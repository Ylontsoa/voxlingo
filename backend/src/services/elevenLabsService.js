// backend/src/services/elevenLabsService.js
const axios = require('axios');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Voix recommandées pour VoxLingo
const VOICES = {
  alice: 'Xb7hH8MSUJpSbSDYk0k2',    // Éducative (recommandée)
  sarah: 'EXAVITQu4vr4xnSDxMaL',     // Rassurante
  jessica: 'cgSgspJ2msm6clMCkdW9',   // Ludique
  george: 'JBFqnCBsd6RMkjVDRZzb',    // Narrateur
  matilda: 'XrExE9yKIg1WjnnlVkGX',   // Professionnelle
  rachel: '21m00Tcm4TlvDq8ikWAM',    // Classique
  river: 'SAz9YHcvj6GT2YYXdXww',     // Neutre
};

/**
 * Transforme un texte en audio (buffer MP3) via ElevenLabs.
 * @param {string} text - Le texte à vocaliser
 * @param {string} voiceId - ID de la voix ElevenLabs
 * @param {object} options - Options supplémentaires
 * @returns {Promise<Buffer>} buffer audio MP3
 */
async function textToSpeech(text, voiceId = VOICES.alice, options = {}) {
  if (!text || !text.trim()) {
    throw new Error('Texte vide, impossible de générer un audio');
  }

  const {
    stability = 0.5,
    similarity_boost = 0.75,
    speed = 1.0,
    model = 'eleven_multilingual_v2'
  } = options;

  try {
    const response = await axios({
      method: 'POST',
      url: `${ELEVENLABS_API_URL}/${voiceId}`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      data: {
        text,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost,
        },
        ...(speed !== 1.0 && { speed }),
      },
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error('❌ ElevenLabs error:', error.response?.data || error.message);
    throw new Error(`ElevenLabs: ${error.message}`);
  }
}

/**
 * Version adaptée à l'apprentissage (vitesse lente)
 */
async function textToSpeechForLearning(text, level = 'beginner', voiceId = VOICES.alice) {
  const speeds = {
    beginner: 0.7,
    intermediate: 0.85,
    advanced: 1.0,
  };

  return textToSpeech(text, voiceId, {
    speed: speeds[level] || 0.8,
    stability: 0.7,
    similarity_boost: 0.8,
  });
}

/**
 * Génère un message de bienvenue vocal
 */
async function speakWelcome(username, streak = 0) {
  let text = `Bonjour ${username || 'utilisateur'} ! Bienvenue sur VoxLingo.`;
  if (streak > 0) {
    text += ` Vous êtes sur une série de ${streak} jours. Continuez comme ça !`;
  }
  return textToSpeech(text, VOICES.alice, { speed: 0.85, stability: 0.6 });
}

/**
 * Génère un feedback vocal selon le score
 */
async function speakFeedback(score, level = 'intermediate') {
  let text = '';
  if (score >= 90) {
    text = 'Excellent ! Très bonne prononciation !';
  } else if (score >= 70) {
    text = 'Bien ! Continue comme ça !';
  } else if (score >= 50) {
    text = 'Pas mal, entraîne-toi encore un peu.';
  } else {
    text = 'Réessaie, tu vas y arriver !';
  }
  return textToSpeechForLearning(text, level, VOICES.jessica);
}

/**
 * Liste toutes les voix disponibles (depuis l'API)
 */
async function listVoices() {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.elevenlabs.io/v1/voices',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
    });
    return response.data.voices;
  } catch (error) {
    console.error('❌ Erreur liste voix:', error.message);
    return [];
  }
}

module.exports = {
  textToSpeech,
  textToSpeechForLearning,
  speakWelcome,
  speakFeedback,
  listVoices,
  VOICES,
};