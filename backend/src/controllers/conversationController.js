// backend/src/controllers/conversationController.js
const { Op } = require('sequelize');
const { Conversation, ConversationParticipant, TranslationMessage, User } = require('../models');
const { textToSpeech } = require('../services/elevenLabsService'); // ✅ AJOUT

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createConversation(req, res, next) {
  try {
    const { language } = req.body;
    console.log('[CREATE] Requete recue - user:', req.user?.id, '- langue:', language);

    let code;
    let exists = true;
    while (exists) {
      code = generateCode();
      exists = await Conversation.findOne({ where: { code } });
    }

    const conversation = await Conversation.create({ code });
    console.log('[CREATE] Conversation creee - id:', conversation.id, '- code:', code);

    await ConversationParticipant.create({
      conversation_id: conversation.id,
      user_id: req.user.id,
      language,
    });
    console.log('[CREATE] Participant ajoute - user_id:', req.user.id);

    res.json({ success: true, code, conversationId: conversation.id });
  } catch (error) {
    console.error('[CREATE] Erreur:', error.message);
    next(error);
  }
}

async function joinConversation(req, res, next) {
  try {
    const rawCode = req.body.code;
    const code = rawCode?.trim().toUpperCase();
    const { language } = req.body;

    console.log('[JOIN] user:', req.user?.id, '- code:', code, '- langue:', language);

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code manquant' });
    }

    const conversation = await Conversation.findOne({ where: { code } });

    if (!conversation) {
      const allCodes = await Conversation.findAll({ attributes: ['code'], order: [['created_at', 'DESC']], limit: 10 });
      console.warn('[JOIN] Code introuvable:', code, '- codes recents:', allCodes.map(c => c.code));
      return res.status(404).json({ success: false, message: 'Code introuvable' });
    }

    const participants = await ConversationParticipant.findAll({ where: { conversation_id: conversation.id } });
    const alreadyIn = participants.find(p => p.user_id === req.user.id);

    if (!alreadyIn) {
      if (participants.length >= 2) {
        console.warn('[JOIN] Conversation deja complete');
        return res.status(400).json({ success: false, message: 'Cette conversation est deja complete' });
      }
      await ConversationParticipant.create({ conversation_id: conversation.id, user_id: req.user.id, language });
      console.log('[JOIN] Nouveau participant ajoute');
    }

    const otherParticipant = participants.find(p => p.user_id !== req.user.id);
    res.json({
      success: true,
      code,
      conversationId: conversation.id,
      otherLanguage: otherParticipant?.language || null,
    });
  } catch (error) {
    console.error('[JOIN] Erreur:', error.message);
    next(error);
  }
}

async function startConversation(req, res, next) {
  try {
    const { targetUserId, language } = req.body;
    const myId = req.user.id;

    console.log('[START] user:', myId, '-> target:', targetUserId, '- langue:', language);

    if (!targetUserId || targetUserId === myId) {
      return res.status(400).json({ success: false, message: 'Utilisateur cible invalide' });
    }

    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      console.warn('[START] Utilisateur cible introuvable:', targetUserId);
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    const myParticipations = await ConversationParticipant.findAll({ where: { user_id: myId } });
    const myConversationIds = myParticipations.map(p => p.conversation_id);

    const existingTargetParticipation = await ConversationParticipant.findOne({
      where: {
        user_id: targetUserId,
        conversation_id: { [Op.in]: myConversationIds.length > 0 ? myConversationIds : [-1] },
      },
    });

    if (existingTargetParticipation) {
      const conversation = await Conversation.findByPk(existingTargetParticipation.conversation_id);
      console.log('[START] Conversation existante retrouvee - code:', conversation.code);
      return res.json({
        success: true,
        code: conversation.code,
        conversationId: conversation.id,
        otherLanguage: existingTargetParticipation.language,
        otherUser: {
          id: targetUser.id,
          username: targetUser.username || targetUser.email?.split('@')[0],
          profile_image_url: targetUser.profile_image_url,
        },
      });
    }

    let code;
    let exists = true;
    while (exists) {
      code = generateCode();
      exists = await Conversation.findOne({ where: { code } });
    }

    const conversation = await Conversation.create({ code });
    await ConversationParticipant.create({ conversation_id: conversation.id, user_id: myId, language });
    await ConversationParticipant.create({
      conversation_id: conversation.id,
      user_id: targetUserId,
      language: targetUser.target_language || 'anglais',
    });

    console.log('[START] Nouvelle conversation creee - code:', code);

    res.json({
      success: true,
      code,
      conversationId: conversation.id,
      otherLanguage: targetUser.target_language || 'anglais',
      otherUser: {
        id: targetUser.id,
        username: targetUser.username || targetUser.email?.split('@')[0],
        profile_image_url: targetUser.profile_image_url,
      },
    });
  } catch (error) {
    console.error('[START] Erreur:', error.message);
    next(error);
  }
}

// ✅ OPTIMISÉ — passe de 1+3N requêtes (une conversation à la fois) à 5 requêtes fixes,
// peu importe le nombre de conversations de l'utilisateur.
async function getMyConversations(req, res, next) {
  try {
    const myId = req.user.id;
    console.log('[MY_CONVERSATIONS] user:', myId);

    // Requête 1 — mes participations
    const myParticipations = await ConversationParticipant.findAll({ where: { user_id: myId } });
    const conversationIds = myParticipations.map(p => p.conversation_id);

    if (conversationIds.length === 0) {
      return res.json({ success: true, conversations: [] });
    }

    // Requête 2 — toutes les conversations d'un coup
    const conversations = await Conversation.findAll({ where: { id: { [Op.in]: conversationIds } } });
    const conversationById = new Map(conversations.map(c => [c.id, c]));

    // Requête 3 — tous les "autres participants" d'un coup
    const otherParticipants = await ConversationParticipant.findAll({
      where: {
        conversation_id: { [Op.in]: conversationIds },
        user_id: { [Op.ne]: myId },
      },
    });
    const otherParticipantByConv = new Map(otherParticipants.map(p => [p.conversation_id, p]));
    const otherUserIds = otherParticipants.map(p => p.user_id);

    // Requête 4 — tous les autres utilisateurs d'un coup
    const otherUsers = await User.findAll({
      where: { id: { [Op.in]: otherUserIds.length > 0 ? otherUserIds : [-1] } },
      attributes: ['id', 'username', 'email', 'profile_image_url', 'target_language'],
    });
    const userById = new Map(otherUsers.map(u => [u.id, u]));

    // Requête 5 — tous les messages triés par date croissante ; on garde le dernier par conversation en mémoire
    const allMessages = await TranslationMessage.findAll({
      where: { conversation_id: { [Op.in]: conversationIds } },
      order: [['created_at', 'ASC']],
    });
    const lastMessageByConv = new Map();
    for (const msg of allMessages) {
      lastMessageByConv.set(msg.conversation_id, msg); // le tri ASC garantit que le dernier écrit écrase les précédents
    }

    const results = conversationIds.map(convId => {
      const conversation = conversationById.get(convId);
      const otherParticipant = otherParticipantByConv.get(convId);
      if (!conversation || !otherParticipant) return null;

      const otherUser = userById.get(otherParticipant.user_id);
      if (!otherUser) return null;

      const lastMessage = lastMessageByConv.get(convId);

      return {
        code: conversation.code,
        conversationId: conversation.id,
        otherUser: {
          id: otherUser.id,
          username: otherUser.username || otherUser.email?.split('@')[0],
          avatar: otherUser.profile_image_url,
          language: otherUser.target_language,
        },
        lastMessage: lastMessage ? {
          text: lastMessage.translated_text,
          senderId: lastMessage.sender_id,
          createdAt: lastMessage.created_at,
        } : null,
      };
    });

    const filtered = results.filter(r => r !== null);
    filtered.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    console.log('[MY_CONVERSATIONS]', filtered.length, 'conversations trouvees');
    res.json({ success: true, conversations: filtered });
  } catch (error) {
    console.error('[MY_CONVERSATIONS] Erreur:', error.message);
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const { code } = req.params;
    console.log('[MESSAGES] code:', code);

    const conversation = await Conversation.findOne({ where: { code } });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }

    const messages = await TranslationMessage.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']],
    });

    res.json({ success: true, conversationId: conversation.id, messages });
  } catch (error) {
    console.error('[MESSAGES] Erreur:', error.message);
    next(error);
  }
}

// ✅ NOUVELLE FONCTION : Message vocal en conversation
async function speakMessage(req, res, next) {
  try {
    const { code } = req.params;
    const { text, language = 'fr' } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Texte requis' });
    }

    // Vérifier que la conversation existe
    const conversation = await Conversation.findOne({ where: { code } });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation introuvable' });
    }

    // Vérifier que l'utilisateur est bien dans la conversation
    const participant = await ConversationParticipant.findOne({
      where: {
        conversation_id: conversation.id,
        user_id: req.user.id,
      },
    });

    if (!participant) {
      return res.status(403).json({ success: false, message: 'Vous n\'êtes pas dans cette conversation' });
    }

    // 🎤 Générer l'audio du message
    let audio = null;
    try {
      // Utiliser la voix d'Alice (éducative) avec une vitesse adaptée
      const audioBuffer = await textToSpeech(text, 'Xb7hH8MSUJpSbSDYk0k2', {
        speed: 0.9,
        stability: 0.5,
        similarity_boost: 0.75,
      });
      audio = audioBuffer.toString('base64');
    } catch (voiceError) {
      console.error('[Voice] Erreur génération audio:', voiceError.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur de synthèse vocale',
        details: voiceError.message 
      });
    }

    res.json({
      success: true,
      audio,
      text,
      language,
      code,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('[SpeakMessage] Erreur:', error.message);
    next(error);
  }
}

module.exports = {
  createConversation,
  joinConversation,
  startConversation,
  getMyConversations,
  getMessages,
  speakMessage, // ✅ AJOUTER
};