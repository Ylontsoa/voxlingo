const { Conversation, ConversationParticipant, TranslationMessage } = require('./models');

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('[SOCKET] Nouvelle connexion:', socket.id); // ✅ log

    socket.on('join_room', async ({ code, userId }) => {
      console.log('[SOCKET join_room] socket:', socket.id, '- code:', code, '- userId:', userId); // ✅ log

      socket.join(code);
      socket.data.code = code;
      socket.data.userId = userId;

      try {
        const conversation = await Conversation.findOne({ where: { code } });
        if (!conversation) {
          console.warn('[SOCKET join_room] Conversation introuvable pour le code:', code); // ✅ log
          return;
        }

        const participants = await ConversationParticipant.findAll({ where: { conversation_id: conversation.id } });
        const me = participants.find(p => p.user_id === userId);
        const other = participants.find(p => p.user_id !== userId);

        console.log('[SOCKET join_room] me:', me?.language, '- other:', other?.language); // ✅ log

        socket.emit('room_info', {
          conversationId: conversation.id,
          myLanguage: me?.language || null,
          otherLanguage: other?.language || null,
        });

        if (other) {
          socket.to(code).emit('peer_joined', { userId, language: me?.language });
          console.log('[SOCKET join_room] peer_joined emis vers la room:', code); // ✅ log
        }
      } catch (err) {
        console.error('[SOCKET join_room] Erreur:', err.message); // ✅ log
      }
    });

    socket.on('send_message', async (payload) => {
      console.log('[SOCKET send_message] code:', payload.code, '- de:', payload.senderId, '- texte:', payload.originalText); // ✅ log

      try {
        await TranslationMessage.create({
          conversation_id: payload.conversationId,
          sender_id: payload.senderId,
          original_text: payload.originalText,
          original_language: payload.originalLanguage,
          translated_text: payload.translatedText,
          translated_language: payload.translatedLanguage,
        });
        console.log('[SOCKET send_message] Message sauvegarde en base'); // ✅ log
      } catch (err) {
        console.error('[SOCKET send_message] Erreur sauvegarde:', err.message); // ✅ log
      }

      io.to(payload.code).emit('new_message', {
        senderId: payload.senderId,
        originalText: payload.originalText,
        originalLanguage: payload.originalLanguage,
        translatedText: payload.translatedText,
        translatedLanguage: payload.translatedLanguage,
        createdAt: new Date().toISOString(),
      });
      console.log('[SOCKET send_message] Diffuse vers la room:', payload.code); // ✅ log
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] Deconnexion:', socket.id, '- code:', socket.data.code); // ✅ log
      if (socket.data.code) {
        socket.to(socket.data.code).emit('peer_left', { userId: socket.data.userId });
      }
    });
  });
}

module.exports = initSocket;