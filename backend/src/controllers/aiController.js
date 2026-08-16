// backend/src/controllers/aiController.js
const { callGemini } = require('../services/geminiService');
const { textToSpeech, textToSpeechForLearning } = require('../services/elevenLabsService');

// 🎤 Pratique orale - Générer une phrase à prononcer
async function generatePracticePhrase(req, res, next) {
  try {
    const { language, level = 'debutant', theme = 'general', withVoice = true } = req.body;
    console.log('[AI practice-phrase] langue:', language, '- niveau:', level, '- theme:', theme, '- withVoice:', withVoice);

    const prompt = `Genere une phrase en ${language} (niveau ${level}, theme ${theme}) pour que l'utilisateur s'entraine a la prononcer.
Reponds EXACTEMENT dans ce format :
Phrase : [phrase en ${language}]
Traduction : [traduction en francais]`;

    const text = await callGemini(prompt, { temperature: 0.9, maxOutputTokens: 200 });
    const phraseMatch = text.match(/Phrase\s*:\s*(.+)/);
    const translationMatch = text.match(/Traduction\s*:\s*(.+)/);

    const phrase = phraseMatch?.[1]?.trim() || 'Hello! How are you?';
    const translation = translationMatch?.[1]?.trim() || 'Bonjour ! Comment vas-tu ?';

    let phraseAudio = null;
    let translationAudio = null;

    if (withVoice) {
      try {
        const levelMap = {
          'debutant': 'beginner',
          'intermediaire': 'intermediate',
          'avance': 'advanced'
        };
        const learningLevel = levelMap[level] || 'beginner';

        phraseAudio = await textToSpeechForLearning(phrase, learningLevel);
        translationAudio = await textToSpeechForLearning(translation, learningLevel);
      } catch (voiceError) {
        console.error('[Voice] Erreur génération audio:', voiceError.message);
      }
    }

    res.json({
      success: true,
      phrase,
      translation,
      phraseAudio: phraseAudio ? phraseAudio.toString('base64') : null,
      translationAudio: translationAudio ? translationAudio.toString('base64') : null,
    });
  } catch (error) {
    console.error('[AI practice-phrase] Erreur:', error.message);
    res.json({
      success: true,
      phrase: 'Hello! How are you?',
      translation: 'Bonjour ! Comment vas-tu ?',
      phraseAudio: null,
      translationAudio: null,
    });
  }
}

// 🇫🇷 Traduction automatique (CORRIGÉ)
async function translateText(req, res, next) {
  try {
    const { text, from, to } = req.body;
    console.log('[AI translate]', from, '->', to, '- texte:', text?.substring(0, 50) + '...');

    if (!text) {
      console.warn('[AI translate] Texte vide');
      return res.json({ success: true, translation: 'Aucun texte à traduire.' });
    }

    const prompt = `Traduis ce texte de ${from} vers ${to}. Reponds UNIQUEMENT avec la traduction, rien d'autre.
Texte : "${text}"
Traduction :`;

    const result = await callGemini(prompt, { temperature: 0.3, maxOutputTokens: 200 });

    if (!result || result.trim().length === 0) {
      console.warn('[AI translate] Réponse Gemini vide');
      return res.json({ success: true, translation: 'Traduction indisponible.' });
    }

    res.json({ success: true, translation: result.trim() });
  } catch (error) {
    console.error('[AI translate] Erreur:', error.message);
    // ✅ Toujours retourner une réponse JSON même en cas d'erreur
    res.json({ success: true, translation: 'Erreur de traduction. Veuillez réessayer.' });
  }
}

// 🔧 Correction d'orthographe/grammaire
async function correctAlphabet(req, res, next) {
  try {
    const { text, language } = req.body;
    console.log('[AI correct] langue:', language);

    if (!text) {
      console.warn('[AI correct] Texte vide');
      return res.json({ success: true, correction: 'Aucun texte à corriger.' });
    }

    const prompt = `Corrige l'orthographe et la grammaire de ce texte en ${language}.
Reponds avec :
1. Le texte corrige
2. Une explication courte des corrections (en francais)

Texte : "${text}"
Reponse :`;

    const result = await callGemini(prompt, { temperature: 0.3, maxOutputTokens: 300 });
    res.json({ success: true, correction: result.trim() || 'Correction indisponible.' });
  } catch (error) {
    console.error('[AI correct] Erreur:', error.message);
    res.json({ success: true, correction: 'Erreur de correction.' });
  }
}

// 🔍 Vérifier les mots faux et donner l'erreur
async function checkMistakes(req, res, next) {
  try {
    const { text, language } = req.body;
    console.log('[AI check-mistakes] langue:', language);

    if (!text) {
      console.warn('[AI check-mistakes] Texte vide');
      return res.json({ success: true, result: 'Aucun texte à vérifier.' });
    }

    const prompt = `Analyse ce texte en ${language} et trouve toutes les erreurs (orthographe, grammaire, conjugaison).
Pour chaque erreur, indique :
- Le mot/expression incorrect
- La correction
- Une explication simple en francais

Texte : "${text}"

Format de reponse :
❌ "[mot incorrect]" → ✅ "[correction]" : [explication]
S'il n'y a pas d'erreur, reponds : "✅ Aucune erreur trouvee !"`;

    const result = await callGemini(prompt, { temperature: 0.2, maxOutputTokens: 400 });
    res.json({ success: true, result: result.trim() || 'Verification indisponible.' });
  } catch (error) {
    console.error('[AI check-mistakes] Erreur:', error.message);
    res.json({ success: true, result: 'Erreur de verification.' });
  }
}

// 💬 Chat normal AVEC VOIX
async function chatWithAI(req, res, next) {
  try {
    const { message, language, level = 'debutant', withVoice = false } = req.body;
    console.log('[AI chat] langue:', language, '- niveau:', level, '- withVoice:', withVoice);

    if (!message) {
      console.warn('[AI chat] Message vide');
      return res.json({
        success: true,
        reply: 'Veuillez écrire un message.',
        audio: null
      });
    }

    const prompt = `Tu es un partenaire de conversation amical pour apprendre le ${language}.
Niveau de l'utilisateur : ${level}.
Regles :
- Reponds UNIQUEMENT en ${language}
- Utilise des phrases courtes (max 2-3 phrases)
- Si l'utilisateur fait une erreur, reformule correctement
- Reste encourageant et positif
- Adapte ton vocabulaire au niveau ${level}
- Si l'utilisateur ecrit "translate", traduis le message precedent en francais

Dernier message de l'utilisateur : "${message}"

Ta reponse en ${language} :`;

    const reply = await callGemini(prompt, { temperature: 0.8, maxOutputTokens: 300 });
    const finalReply = reply.trim() || 'Interessant ! Continue !';

    let audio = null;
    if (withVoice) {
      try {
        const levelMap = {
          'debutant': 'beginner',
          'intermediaire': 'intermediate',
          'avance': 'advanced'
        };
        const learningLevel = levelMap[level] || 'beginner';
        const speed = learningLevel === 'beginner' ? 0.75 : learningLevel === 'intermediate' ? 0.85 : 1.0;

        const audioBuffer = await textToSpeech(finalReply, 'Xb7hH8MSUJpSbSDYk0k2', { speed });
        audio = audioBuffer.toString('base64');
      } catch (voiceError) {
        console.error('[Voice] Erreur génération audio:', voiceError.message);
      }
    }

    res.json({
      success: true,
      reply: finalReply,
      audio: audio,
    });
  } catch (error) {
    console.error('[AI chat] Erreur:', error.message);
    res.json({
      success: true,
      reply: 'Desole, je ne peux pas repondre maintenant. Reessaie !',
      audio: null,
    });
  }
}

module.exports = {
  generatePracticePhrase,
  translateText,
  correctAlphabet,
  checkMistakes,
  chatWithAI,
};