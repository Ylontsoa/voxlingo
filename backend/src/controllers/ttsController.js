// backend/src/controllers/ttsController.js
const { textToSpeech, speakWelcome, speakFeedback, listVoices, VOICES } = require('../services/elevenLabsService');

/**
 * POST /api/tts/speak
 * Synthèse vocale simple
 */
async function speak(req, res) {
  try {
    const { text, voice = 'alice', speed = 1.0, emotion = 'neutral' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Texte requis' });
    }

    const voiceMap = {
      alice: VOICES.alice,
      sarah: VOICES.sarah,
      jessica: VOICES.jessica,
      george: VOICES.george,
      matilda: VOICES.matilda,
      rachel: VOICES.rachel,
      river: VOICES.river,
    };

    const voiceId = voiceMap[voice] || VOICES.alice;

    // Ajuster la stabilité selon l'émotion
    const emotionSettings = {
      neutral: { stability: 0.5, style: 0.0 },
      happy: { stability: 0.4, style: 0.7 },
      sad: { stability: 0.7, style: 0.1 },
      excited: { stability: 0.3, style: 0.9 },
      calm: { stability: 0.8, style: 0.1 },
      friendly: { stability: 0.5, style: 0.5 },
    };

    const settings = emotionSettings[emotion] || emotionSettings.neutral;

    const audioBuffer = await textToSpeech(text, voiceId, {
      ...settings,
      speed,
    });

    res.json({
      success: true,
      audio: audioBuffer.toString('base64'),
      text,
      voice,
      emotion,
    });
  } catch (error) {
    console.error('[TTS] Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/tts/welcome
 * Message de bienvenue vocal
 */
async function welcome(req, res) {
  try {
    const { username, streak = 0 } = req.body;

    const audioBuffer = await speakWelcome(username, streak);

    res.json({
      success: true,
      audio: audioBuffer.toString('base64'),
    });
  } catch (error) {
    console.error('[Welcome] Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/tts/feedback
 * Feedback vocal selon le score
 */
async function feedback(req, res) {
  try {
    const { score, level = 'intermediate' } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: 'Score requis' });
    }

    const audioBuffer = await speakFeedback(score, level);

    res.json({
      success: true,
      audio: audioBuffer.toString('base64'),
      score,
    });
  } catch (error) {
    console.error('[Feedback] Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/tts/voices
 * Liste des voix disponibles
 */
async function getVoices(req, res) {
  try {
    const voices = await listVoices();
    res.json({
      success: true,
      voices: voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        preview_url: v.preview_url,
      })),
    });
  } catch (error) {
    console.error('[Voices] Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  speak,
  welcome,
  feedback,
  getVoices,
};