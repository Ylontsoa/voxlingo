const { callGemini } = require('../services/geminiService');

// 🎤 Pratique orale - Générer une phrase à prononcer
async function generatePracticePhrase(req, res, next) {
  try {
    const { language, level = 'debutant', theme = 'general' } = req.body;
    console.log('[AI practice-phrase] langue:', language, '- niveau:', level, '- theme:', theme);

    const prompt = `Genere une phrase en ${language} (niveau ${level}, theme ${theme}) pour que l'utilisateur s'entraine a la prononcer.
Reponds EXACTEMENT dans ce format :
Phrase : [phrase en ${language}]
Traduction : [traduction en francais]`;

    const text = await callGemini(prompt, { temperature: 0.9, maxOutputTokens: 200 });
    const phraseMatch = text.match(/Phrase\s*:\s*(.+)/);
    const translationMatch = text.match(/Traduction\s*:\s*(.+)/);

    res.json({
      success: true,
      phrase: phraseMatch?.[1]?.trim() || 'Hello! How are you?',
      translation: translationMatch?.[1]?.trim() || 'Bonjour ! Comment vas-tu ?',
    });
  } catch (error) {
    console.error('[AI practice-phrase] Erreur:', error.message);
    // ✅ Meme comportement de repli que le code mobile original
    res.json({ success: true, phrase: 'Hello! How are you?', translation: 'Bonjour ! Comment vas-tu ?' });
  }
}

// 🇫🇷 Traduction automatique
async function translateText(req, res, next) {
  try {
    const { text, from, to } = req.body;
    console.log('[AI translate]', from, '->', to);

    const prompt = `Traduis ce texte de ${from} vers ${to}. Reponds UNIQUEMENT avec la traduction, rien d'autre.
Texte : "${text}"
Traduction :`;

    const result = await callGemini(prompt, { temperature: 0.3, maxOutputTokens: 200 });
    res.json({ success: true, translation: result.trim() || 'Traduction indisponible.' });
  } catch (error) {
    console.error('[AI translate] Erreur:', error.message);
    res.json({ success: true, translation: 'Erreur de traduction.' });
  }
}

// 🔧 Correction d'orthographe/grammaire
async function correctAlphabet(req, res, next) {
  try {
    const { text, language } = req.body;
    console.log('[AI correct] langue:', language);

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

// 💬 Chat normal
async function chatWithAI(req, res, next) {
  try {
    const { message, language, level = 'debutant' } = req.body;
    console.log('[AI chat] langue:', language, '- niveau:', level);

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
    res.json({ success: true, reply: reply.trim() || 'Interessant ! Continue !' });
  } catch (error) {
    console.error('[AI chat] Erreur:', error.message);
    res.json({ success: true, reply: 'Desole, je ne peux pas repondre maintenant. Reessaie !' });
  }
}

module.exports = {
  generatePracticePhrase,
  translateText,
  correctAlphabet,
  checkMistakes,
  chatWithAI,
};