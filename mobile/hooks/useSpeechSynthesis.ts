// mobile/hooks/useSpeechSynthesis.ts
import { useState, useCallback, useRef } from 'react';
import { voiceService } from '../services/voice.service';
import { speakWithBestVoice, stopSpeaking } from '../services/speech/synthesis';

interface UseSpeechSynthesisOptions {
  defaultRate?: number;
  defaultVoice?: 'alice' | 'sarah' | 'jessica' | 'george' | 'matilda' | 'rachel' | 'river';
  defaultLanguage?: string;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const {
    defaultRate = 0.85,
    defaultVoice = 'alice',
    defaultLanguage = 'fr',
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(defaultRate);
  const [voice, setVoice] = useState(defaultVoice);
  const [language, setLanguage] = useState(defaultLanguage);
  const [error, setError] = useState<string | null>(null);
  
  // Référence pour éviter les appels simultanés
  const isSpeakingRef = useRef(false);

  /**
   * Parle un texte avec ElevenLabs ou fallback
   */
  const speak = useCallback(async (text: string, lang?: string, voiceId?: string) => {
    if (!text || !text.trim()) {
      console.warn('[useSpeechSynthesis] Texte vide, ignore');
      return;
    }

    // Éviter les appels simultanés
    if (isSpeakingRef.current) {
      console.warn('[useSpeechSynthesis] Déjà en cours de lecture');
      return;
    }

    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setError(null);

    const targetLang = lang || language;
    const targetVoice = voiceId || voice;

    try {
      console.log(`[useSpeechSynthesis] Lecture: "${text.substring(0, 30)}..." (voix: ${targetVoice}, vitesse: ${rate})`);
      
      // Utiliser ElevenLabs avec la voix spécifiée
      await voiceService.speak(text, {
        voice: targetVoice as any,
        speed: rate,
        emotion: 'neutral',
      });
      
      console.log('[useSpeechSynthesis] Lecture terminée avec succès ✅');
    } catch (err) {
      console.error('[useSpeechSynthesis] Erreur ElevenLabs:', err);
      setError('Erreur de synthèse vocale, fallback vers la voix système');
      
      // Fallback vers Expo Speech
      try {
        await speakWithBestVoice(text, targetLang, rate);
      } catch (fallbackErr) {
        console.error('[useSpeechSynthesis] Erreur fallback:', fallbackErr);
        setError('Impossible de lire le texte');
      }
    } finally {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    }
  }, [language, voice, rate]);

  /**
   * Parle un texte avec une émotion spécifique
   */
  const speakWithEmotion = useCallback(async (
    text: string,
    emotion: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'friendly' = 'neutral',
    lang?: string
  ) => {
    if (!text || !text.trim()) return;

    if (isSpeakingRef.current) {
      console.warn('[useSpeechSynthesis] Déjà en cours de lecture');
      return;
    }

    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setError(null);

    const targetLang = lang || language;

    try {
      console.log(`[useSpeechSynthesis] Lecture avec émotion ${emotion}: "${text.substring(0, 30)}..."`);
      
      await voiceService.speak(text, {
        voice: voice as any,
        speed: rate,
        emotion: emotion,
      });
      
      console.log('[useSpeechSynthesis] Lecture émotionnelle terminée ✅');
    } catch (err) {
      console.error('[useSpeechSynthesis] Erreur:', err);
      setError('Erreur de synthèse vocale');
      
      // Fallback sans émotion
      try {
        await speakWithBestVoice(text, targetLang, rate);
      } catch (fallbackErr) {
        console.error('[useSpeechSynthesis] Erreur fallback:', fallbackErr);
        setError('Impossible de lire le texte');
      }
    } finally {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
    }
  }, [language, voice, rate]);

  /**
   * Arrête la lecture en cours
   */
  const stop = useCallback(() => {
    console.log('[useSpeechSynthesis] Arrêt demandé');
    stopSpeaking();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  /**
   * Change la vitesse de parole
   */
  const changeRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, newRate));
    setRate(clampedRate);
    console.log(`[useSpeechSynthesis] Vitesse modifiée: ${clampedRate}`);
  }, []);

  /**
   * Change la voix
   */
  const changeVoice = useCallback((newVoice: typeof voice) => {
    setVoice(newVoice);
    console.log(`[useSpeechSynthesis] Voix modifiée: ${newVoice}`);
  }, []);

  /**
   * Change la langue
   */
  const changeLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    console.log(`[useSpeechSynthesis] Langue modifiée: ${newLanguage}`);
  }, []);

  /**
   * Vérifie si la lecture est en cours
   */
  const getIsSpeaking = useCallback(() => {
    return isSpeaking || isSpeakingRef.current;
  }, [isSpeaking]);

  return {
    speak,
    speakWithEmotion,
    stop,
    isSpeaking,
    rate,
    voice,
    language,
    error,
    setRate: changeRate,
    setVoice: changeVoice,
    setLanguage: changeLanguage,
    getIsSpeaking,
  };
}