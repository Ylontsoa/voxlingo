// mobile/hooks/useChatBot.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  chatWithAI, 
  chatWithVoice, 
  resetConversation, 
  translateText, 
  correctAlphabet, 
  generatePracticePhrase, 
  generatePracticePhraseWithVoice,
  checkMistakes 
} from '../services/chatbot';
import { saveHistoryRequest, getHistoryRequest, HistoryEntry } from '../services/api/chat';
import { voiceService } from '../services/voice.service';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'correction' | 'translation' | 'practice' | 'check';
  text: string;
  extra?: string;
  translation?: string;
  audio?: string;
}

// ✅ Types séparés pour les deux fonctions
interface PracticeResultWithVoice {
  phrase: string;
  translation: string;
  phraseAudio: string | null;
  translationAudio: string | null;
}

interface PracticeResultWithoutVoice {
  phrase: string;
  translation: string;
}

type PracticeResult = PracticeResultWithVoice | PracticeResultWithoutVoice;

interface ChatVoiceResult {
  reply: string;
  audio?: string;
}

function makeId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8);
}

interface UseChatBotOptions {
  voiceEnabled?: boolean;
  defaultVoice?: 'alice' | 'sarah' | 'jessica' | 'george' | 'matilda' | 'rachel' | 'river';
  defaultSpeed?: number;
}

export function useChatBot(
  language: string, 
  level: string = 'debutant',
  options: UseChatBotOptions = {}
) {
  const {
    voiceEnabled = true,
    defaultVoice = 'alice',
    defaultSpeed = 0.85,
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [pastSessions, setPastSessions] = useState<HistoryEntry[]>([]);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  
  const isPlayingRef = useRef(false);

  // Charger l'historique
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

  /**
   * Joue l'audio d'un message
   */
  const playMessageAudio = useCallback(async (audioBase64: string) => {
    if (!audioBase64 || isPlayingRef.current) return;
    
    isPlayingRef.current = true;
    setIsVoicePlaying(true);
    
    try {
      await voiceService.playAudio(audioBase64);
    } catch (error) {
      console.error('[useChatBot] Erreur lecture audio:', error);
    } finally {
      isPlayingRef.current = false;
      setIsVoicePlaying(false);
    }
  }, []);

  /**
   * Envoie un message avec support vocal
   */
  const sendMessage = useCallback(async (text: string) => {
    if (!text || !text.trim()) return;

    setMessages(prev => [...prev, { id: makeId(), role: 'user', text }]);
    setLoading(true);

    try {
      let reply: string;
      let audio: string | undefined;

      if (voiceEnabled) {
        const result: ChatVoiceResult = await chatWithVoice(text, language, level);
        reply = result.reply;
        audio = result.audio;
      } else {
        reply = await chatWithAI(text, language, level);
      }

      const aiMessageId = makeId();
      setMessages(prev => [...prev, { 
        id: aiMessageId, 
        role: 'ai', 
        text: reply,
        audio: audio || undefined 
      }]);

      if (audio && voiceEnabled) {
        await playMessageAudio(audio);
      }

      translateText(reply, language, 'francais')
        .then(translation => {
          setMessages(prev => prev.map(m => 
            m.id === aiMessageId ? { ...m, translation } : m
          ));
        })
        .catch(() => {});

    } catch (error) {
      console.error('[useChatBot] Erreur sendMessage:', error);
      setMessages(prev => [...prev, { 
        id: makeId(), 
        role: 'ai', 
        text: 'Désolé, une erreur est survenue. Réessaie plus tard.' 
      }]);
    } finally {
      setLoading(false);
    }
  }, [language, level, voiceEnabled, playMessageAudio]);

  /**
   * Traduction automatique
   */
  const translate = useCallback(async (text: string) => {
    setLoading(true);
    try {
      const translation = await translateText(text, language, 'francais');
      setMessages(prev => [...prev, { 
        id: makeId(), 
        role: 'translation', 
        text: '🇫🇷 Traduction', 
        extra: translation 
      }]);
    } catch (error) {
      console.error('[useChatBot] Erreur translate:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  /**
   * Correction d'orthographe/grammaire
   */
  const correct = useCallback(async (text: string) => {
    setLoading(true);
    try {
      const correction = await correctAlphabet(text, language);
      setMessages(prev => [...prev, { 
        id: makeId(), 
        role: 'correction', 
        text: '🔧 Correction', 
        extra: correction 
      }]);
    } catch (error) {
      console.error('[useChatBot] Erreur correct:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  /**
   * Vérification des erreurs
   */
  const check = useCallback(async (text: string) => {
    setLoading(true);
    try {
      const result = await checkMistakes(text, language);
      setMessages(prev => [...prev, { 
        id: makeId(), 
        role: 'check', 
        text: '🔍 Verification', 
        extra: result 
      }]);
    } catch (error) {
      console.error('[useChatBot] Erreur check:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  /**
   * Pratique orale avec voix
   */
  const practice = useCallback(async (theme: string = 'general') => {
    setLoading(true);
    try {
      if (voiceEnabled) {
        // ✅ Avec voix - type explicite
        const result = await generatePracticePhraseWithVoice(language, level, theme) as PracticeResultWithVoice;
        
        setMessages(prev => [...prev, { 
          id: makeId(), 
          role: 'practice', 
          text: '🎤 ' + result.phrase, 
          extra: result.translation,
          audio: result.phraseAudio || undefined,
        }]);

        if (result.phraseAudio) {
          await playMessageAudio(result.phraseAudio);
        }
      } else {
        // ✅ Sans voix - type explicite
        const result = await generatePracticePhrase(language, level, theme) as PracticeResultWithoutVoice;
        setMessages(prev => [...prev, { 
          id: makeId(), 
          role: 'practice', 
          text: '🎤 ' + result.phrase, 
          extra: result.translation 
        }]);
      }
    } catch (error) {
      console.error('[useChatBot] Erreur practice:', error);
    } finally {
      setLoading(false);
    }
  }, [language, level, voiceEnabled, playMessageAudio]);

  /**
   * Reset : sauvegarde la conversation avant d'effacer
   */
  const reset = useCallback(async () => {
    if (messages.length > 0) {
      try {
        await saveHistoryRequest(language, messages);
        const res = await getHistoryRequest();
        setPastSessions(res.history.filter(h => h.language === language));
      } catch {
        // pas grave si la sauvegarde echoue
      }
    }
    setMessages([]);
    resetConversation();
  }, [messages, language]);

  /**
   * Charge une session précédente
   */
  const loadSession = useCallback((sessionId: number) => {
    const session = pastSessions.find(s => s.id === sessionId);
    if (session) {
      try {
        const parsed = JSON.parse(session.messages);
        setMessages(parsed.map((m: any) => ({ ...m, id: m.id || makeId() })));
      } catch {
        console.error('[useChatBot] Erreur chargement session');
      }
    }
  }, [pastSessions]);

  /**
   * Arrête la lecture audio en cours
   */
  const stopAudio = useCallback(() => {
    voiceService.stop();
    isPlayingRef.current = false;
    setIsVoicePlaying(false);
  }, []);

  return {
    messages,
    loading,
    pastSessions,
    isVoicePlaying,
    sendMessage,
    reset,
    translate,
    correct,
    check,
    practice,
    loadSession,
    stopAudio,
    voiceEnabled,
  };
}