const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

async function callGemini(prompt, generationConfig) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY manquante dans les variables d\'environnement du serveur');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error('[GEMINI] Erreur API:', data.error.message);
    throw new Error(data.error.message || 'Erreur Gemini');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

module.exports = { callGemini };