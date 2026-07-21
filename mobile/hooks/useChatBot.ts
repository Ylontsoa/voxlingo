import { useState, useCallback } from 'react';
import { chatWithAI, resetConversation, translateText, correctAlphabet, generatePracticePhrase, checkMistakes } from '../services/chatbot';

interface Message { role: 'user' | 'ai' | 'correction' | 'translation' | 'practice' | 'check'; text: string; extra?: string; }

export function useChatBot(language: string, level: string = 'debutant') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 💬 Chat
  const sendMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    const reply = await chatWithAI(text, language, level);
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setLoading(false);
  }, [language, level]);

  // 🇫🇷 Traduction
  const translate = useCallback(async (text: string) => {
    setLoading(true);
    const translation = await translateText(text, language, 'francais');
    setMessages(prev => [...prev, { role: 'translation', text: '🇫🇷 Traduction', extra: translation }]);
    setLoading(false);
  }, [language]);

  // 🔧 Correction
  const correct = useCallback(async (text: string) => {
    setLoading(true);
    const correction = await correctAlphabet(text, language);
    setMessages(prev => [...prev, { role: 'correction', text: '🔧 Correction', extra: correction }]);
    setLoading(false);
  }, [language]);

  // 🔍 Vérifier les fautes
  const check = useCallback(async (text: string) => {
    setLoading(true);
    const result = await checkMistakes(text, language);
    setMessages(prev => [...prev, { role: 'check', text: '🔍 Verification', extra: result }]);
    setLoading(false);
  }, [language]);

  // 🎤 Pratique orale
  const practice = useCallback(async (theme: string = 'general') => {
    setLoading(true);
    const result = await generatePracticePhrase(language, level, theme);
    setMessages(prev => [...prev, { role: 'practice', text: '🎤 ' + result.phrase, extra: result.translation }]);
    setLoading(false);
  }, [language, level]);

  // 🧹 Reset
  const reset = useCallback(() => {
    setMessages([]);
    resetConversation();
  }, []);

  return { messages, loading, sendMessage, reset, translate, correct, check, practice };
}