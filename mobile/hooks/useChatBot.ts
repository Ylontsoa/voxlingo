import { useState, useCallback, useEffect } from 'react';
import { chatWithAI, resetConversation, translateText, correctAlphabet, generatePracticePhrase, checkMistakes } from '../services/chatbot';
import { saveHistoryRequest, getHistoryRequest, HistoryEntry } from '../services/api/chat';

interface Message {
  id: string; // ✅ Ajout — identifiant stable pour mettre à jour un message précis (traduction en arrière-plan)
  role: 'user' | 'ai' | 'correction' | 'translation' | 'practice' | 'check';
  text: string;
  extra?: string;
  translation?: string; // ✅ Ajout — traduction automatique du message IA (langue apprise -> francais)
}

function makeId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8);
}

export function useChatBot(language: string, level: string = 'debutant') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [pastSessions, setPastSessions] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHistoryRequest();
        setPastSessions(res.history.filter(h => h.language === language));
      } catch {
        setPastSessions([]);
      }
    })();
  }, [language]);

  const sendMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, { id: makeId(), role: 'user', text }]);
    setLoading(true);
    const reply = await chatWithAI(text, language, level);
    const aiMessageId = makeId();
    setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', text: reply }]);
    setLoading(false);

    // ✅ Traduction automatique en arrière-plan — n'attend pas et ne bloque pas l'affichage de la réponse.
    // Toujours language (langue apprise dans ce chat) -> francais, pas de langue tierce.
    translateText(reply, language, 'francais')
      .then(translation => {
        setMessages(prev => prev.map(m => (m.id === aiMessageId ? { ...m, translation } : m)));
      })
      .catch(() => {
        // pas grave si la traduction automatique echoue, la reponse reste affichee sans traduction
      });
  }, [language, level]);

  const translate = useCallback(async (text: string) => {
    setLoading(true);
    const translation = await translateText(text, language, 'francais');
    setMessages(prev => [...prev, { id: makeId(), role: 'translation', text: '🇫🇷 Traduction', extra: translation }]);
    setLoading(false);
  }, [language]);

  const correct = useCallback(async (text: string) => {
    setLoading(true);
    const correction = await correctAlphabet(text, language);
    setMessages(prev => [...prev, { id: makeId(), role: 'correction', text: '🔧 Correction', extra: correction }]);
    setLoading(false);
  }, [language]);

  const check = useCallback(async (text: string) => {
    setLoading(true);
    const result = await checkMistakes(text, language);
    setMessages(prev => [...prev, { id: makeId(), role: 'check', text: '🔍 Verification', extra: result }]);
    setLoading(false);
  }, [language]);

  const practice = useCallback(async (theme: string = 'general') => {
    setLoading(true);
    const result = await generatePracticePhrase(language, level, theme);
    setMessages(prev => [...prev, { id: makeId(), role: 'practice', text: '🎤 ' + result.phrase, extra: result.translation }]);
    setLoading(false);
  }, [language, level]);

  // 🧹 Reset : sauvegarde la conversation sur le serveur avant d'effacer
  const reset = useCallback(async () => {
    if (messages.length > 0) {
      try {
        await saveHistoryRequest(language, messages);
        const res = await getHistoryRequest();
        setPastSessions(res.history.filter(h => h.language === language));
      } catch {
        // pas grave si la sauvegarde echoue, on efface quand meme localement
      }
    }
    setMessages([]);
    resetConversation();
  }, [messages, language]);

  const loadSession = useCallback((sessionId: number) => {
    const session = pastSessions.find(s => s.id === sessionId);
    if (session) {
      try {
        const parsed = JSON.parse(session.messages);
        // ✅ Compatibilite avec d'anciennes sessions sauvegardees sans id
        setMessages(parsed.map((m: any) => ({ ...m, id: m.id || makeId() })));
      } catch {}
    }
  }, [pastSessions]);

  return { messages, loading, pastSessions, sendMessage, reset, translate, correct, check, practice, loadSession };
}