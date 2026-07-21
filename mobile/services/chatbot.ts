const GEMINI_API_KEY = 'AQ.Ab8RN6J0pTYS5oyRtxEbZjKjh1em5mtyobqOuWEnNglPWbFLYQ';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

let conversationHistory: string[] = [];

export function resetConversation() {
    conversationHistory = [];
}

// 🎤 Pratique orale - Générer une phrase à prononcer
export async function generatePracticePhrase(language: string, level: string = 'debutant', theme: string = 'general'): Promise<{ phrase: string; translation: string }> {
    const prompt = `Genere une phrase en ${language} (niveau ${level}, theme ${theme}) pour que l'utilisateur s'entraine a la prononcer.
Reponds EXACTEMENT dans ce format :
Phrase : [phrase en ${language}]
Traduction : [traduction en francais]`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.9, maxOutputTokens: 200 },
            }),
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const phraseMatch = text.match(/Phrase\s*:\s*(.+)/);
        const translationMatch = text.match(/Traduction\s*:\s*(.+)/);
        return {
            phrase: phraseMatch?.[1]?.trim() || 'Hello! How are you?',
            translation: translationMatch?.[1]?.trim() || 'Bonjour ! Comment vas-tu ?',
        };
    } catch {
        return { phrase: 'Hello! How are you?', translation: 'Bonjour ! Comment vas-tu ?' };
    }
}

// 🇫🇷 Traduction automatique
export async function translateText(text: string, from: string, to: string): Promise<string> {
    const prompt = `Traduis ce texte de ${from} vers ${to}. Reponds UNIQUEMENT avec la traduction, rien d'autre.
Texte : "${text}"
Traduction :`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 200 },
            }),
        });
        const data = await response.json();
        if (data.error) return 'Traduction indisponible.';
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Traduction indisponible.';
    } catch {
        return 'Erreur de traduction.';
    }
}

// 🔧 Correction d'orthographe/grammaire
export async function correctAlphabet(text: string, language: string): Promise<string> {
    const prompt = `Corrige l'orthographe et la grammaire de ce texte en ${language}.
Reponds avec :
1. Le texte corrige
2. Une explication courte des corrections (en francais)

Texte : "${text}"
Reponse :`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
            }),
        });
        const data = await response.json();
        if (data.error) return 'Correction indisponible.';
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Correction indisponible.';
    } catch {
        return 'Erreur de correction.';
    }
}

// 🔍 Vérifier les mots faux et donner l'erreur
export async function checkMistakes(text: string, language: string): Promise<string> {
    const prompt = `Analyse ce texte en ${language} et trouve toutes les erreurs (orthographe, grammaire, conjugaison).
Pour chaque erreur, indique :
- Le mot/expression incorrect
- La correction
- Une explication simple en francais

Texte : "${text}"

Format de reponse :
❌ "[mot incorrect]" → ✅ "[correction]" : [explication]
S'il n'y a pas d'erreur, reponds : "✅ Aucune erreur trouvee !"`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
            }),
        });
        const data = await response.json();
        if (data.error) return 'Verification indisponible.';
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Verification indisponible.';
    } catch {
        return 'Erreur de verification.';
    }
}

// 💬 Chat normal
export async function chatWithAI(message: string, language: string, level: string = 'debutant'): Promise<string> {
    conversationHistory.push(`User: ${message}`);

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

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
            }),
        });
        const data = await response.json();
        if (data.error) return 'Desole, je ne peux pas repondre maintenant. Reessaie !';
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Interessant ! Continue !';
        conversationHistory.push(`AI: ${reply}`);
        return reply.trim();
    } catch {
        return 'Je n\'ai pas compris. Peux-tu repeter ?';
    }
}