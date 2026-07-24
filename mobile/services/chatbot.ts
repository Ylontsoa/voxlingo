import client from './api/client';

// ✅ Conservé pour compatibilité avec le reste de l'app — l'historique n'est plus géré côté mobile
export function resetConversation() {
    // no-op : la logique IA vit maintenant côté backend
}

// 🎤 Pratique orale - Générer une phrase à prononcer
export async function generatePracticePhrase(language: string, level: string = 'debutant', theme: string = 'general'): Promise<{ phrase: string; translation: string }> {
    try {
        const { data } = await client.post('/ai/practice-phrase', { language, level, theme });
        return {
            phrase: data.phrase || 'Hello! How are you?',
            translation: data.translation || 'Bonjour ! Comment vas-tu ?',
        };
    } catch (err: any) {
        console.error('[chatbot] generatePracticePhrase Erreur:', err?.response?.status, err?.response?.data || err.message);
        return { phrase: 'Hello! How are you?', translation: 'Bonjour ! Comment vas-tu ?' };
    }
}

// 🇫🇷 Traduction automatique
export async function translateText(text: string, from: string, to: string): Promise<string> {
    try {
        const { data } = await client.post('/ai/translate', { text, from, to });
        return data.translation || 'Traduction indisponible.';
    } catch (err: any) {
        console.error('[chatbot] translateText Erreur:', err?.response?.status, err?.response?.data || err.message);
        return 'Erreur de traduction.';
    }
}

// 🔧 Correction d'orthographe/grammaire
export async function correctAlphabet(text: string, language: string): Promise<string> {
    try {
        const { data } = await client.post('/ai/correct', { text, language });
        return data.correction || 'Correction indisponible.';
    } catch (err: any) {
        console.error('[chatbot] correctAlphabet Erreur:', err?.response?.status, err?.response?.data || err.message);
        return 'Erreur de correction.';
    }
}

// 🔍 Vérifier les mots faux et donner l'erreur
export async function checkMistakes(text: string, language: string): Promise<string> {
    try {
        const { data } = await client.post('/ai/check-mistakes', { text, language });
        return data.result || 'Verification indisponible.';
    } catch (err: any) {
        console.error('[chatbot] checkMistakes Erreur:', err?.response?.status, err?.response?.data || err.message);
        return 'Erreur de verification.';
    }
}

// 💬 Chat normal
export async function chatWithAI(message: string, language: string, level: string = 'debutant'): Promise<string> {
    try {
        const { data } = await client.post('/ai/chat', { message, language, level });
        return data.reply || 'Interessant ! Continue !';
    } catch (err: any) {
        console.error('[chatbot] chatWithAI Erreur:', err?.response?.status, err?.response?.data || err.message);
        return 'Je n\'ai pas compris. Peux-tu repeter ?';
    }
}