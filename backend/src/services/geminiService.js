// backend/src/services/geminiService.js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

async function callGemini(prompt, generationConfig) {
  if (!GEMINI_API_KEY) {
    console.error('[GEMINI] Clé API manquante');
    throw new Error('GEMINI_API_KEY manquante dans les variables d\'environnement du serveur');
  }

  try {
    console.log('[GEMINI] Appel API avec prompt:', prompt.substring(0, 100) + '...');

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-goog-api-key': GEMINI_API_KEY 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 200 },
      }),
    });

    // ✅ Vérifier le statut HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GEMINI] Erreur HTTP:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('[GEMINI] Erreur API:', data.error.message);
      throw new Error(data.error.message || 'Erreur Gemini');
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('[GEMINI] Réponse reçue avec succès');
    return result;

  } catch (error) {
    console.error('[GEMINI] Erreur fetch:', error.message);
    throw error;
  }
}

module.exports = { callGemini };