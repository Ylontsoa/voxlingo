// mobile/hooks/useSpeechRecognition.ts
import { useState, useRef } from 'react';
import { startRecording, stopRecording, transcribeAudio } from '../services/speech/recognition';
import { RECORDING_MAX_DURATION_MS } from '../constants/config';

const MIN_RECORDING_DURATION_MS = 500;

export function useSpeechRecognition(isoLanguage?: string, maxDuration?: number) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFinishingRef = useRef(false);
  const isRecordingRef = useRef(false); // ✅ Ajout pour suivre l'état réel

  const recordingDuration = maxDuration || RECORDING_MAX_DURATION_MS;

  function reset() {
    setTranscription('');
    setError(null);
    setVolumeLevel(0);
    isRecordingRef.current = false;
  }

  async function record() {
    console.log('[useSpeechRecognition] 🎤 Démarrage enregistrement...');
    
    // ✅ Nettoyer l'état précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isRecording) {
      console.log('[useSpeechRecognition] ⚠️ Déjà en enregistrement, arrêt...');
      await finishRecording();
      return;
    }
    
    setError(null);
    setTranscription('');
    setVolumeLevel(0);
    isFinishingRef.current = false;
    isRecordingRef.current = false;
    
    try {
      setIsRecording(true);
      isRecordingRef.current = true;
      startTimeRef.current = Date.now();
      await startRecording((level) => setVolumeLevel(level));

      // ✅ Timeout pour arrêter automatiquement après la durée définie
      timeoutRef.current = setTimeout(async () => {
        console.log('[useSpeechRecognition] ⏰ Timeout atteint, arrêt...');
        if (isRecordingRef.current) {
          await finishRecording();
        } else {
          console.log('[useSpeechRecognition] ⏰ Timeout ignoré - pas d\'enregistrement');
        }
      }, recordingDuration);
      
    } catch (err: any) {
      console.error('[useSpeechRecognition] ❌ Erreur:', err.message);
      
      // ✅ Nettoyer l'état en cas d'erreur
      setIsRecording(false);
      isRecordingRef.current = false;
      setVolumeLevel(0);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (err.message === 'PERMISSION_DENIED') {
        setError("La reconnaissance vocale n'est pas disponible sur cet appareil");
      } else {
        setError('Erreur de transcription, veuillez reessayer');
      }
    }
  }

  async function finishRecording() {
    console.log('[useSpeechRecognition] ⏹️ Arrêt en cours...');
    
    // ✅ Vérifier les conditions d'arrêt
    if (isFinishingRef.current) {
      console.log('[useSpeechRecognition] Déjà en cours de fin');
      return;
    }
    
    if (!isRecordingRef.current) {
      console.log('[useSpeechRecognition] Pas d\'enregistrement en cours');
      return;
    }
    
    isFinishingRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const elapsed = Date.now() - startTimeRef.current;
    console.log(`[useSpeechRecognition] Durée: ${elapsed}ms`);

    try {
      const uri = await stopRecording();
      console.log('[useSpeechRecognition] URI:', uri);
      
      // ✅ Mettre à jour l'état immédiatement
      setIsRecording(false);
      isRecordingRef.current = false;
      setVolumeLevel(0);

      if (!uri) {
        setError('Aucun son detecte, veuillez reessayer');
        isFinishingRef.current = false;
        return;
      }

      if (elapsed < MIN_RECORDING_DURATION_MS) {
        setError('Parle un peu plus longtemps, essaie encore');
        isFinishingRef.current = false;
        return;
      }

      console.log('[useSpeechRecognition] Transcription...');
      const text = await transcribeAudio(uri, isoLanguage);
      console.log('[useSpeechRecognition] Texte:', text);
      
      if (!text || text.trim().length === 0) {
        setError('Aucun son detecte, veuillez reessayer');
        isFinishingRef.current = false;
        return;
      }
      setTranscription(text);
    } catch (err) {
      console.error('[useSpeechRecognition] ❌ Erreur:', err);
      setError('Erreur de transcription, veuillez reessayer');
    } finally {
      isFinishingRef.current = false;
    }
  }

  return { record, finishRecording, isRecording, transcription, error, volumeLevel, reset };
}