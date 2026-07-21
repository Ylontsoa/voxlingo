import { useState, useRef } from 'react';
import { startRecording, stopRecording, transcribeAudio } from '../services/speech/recognition';
import { RECORDING_MAX_DURATION_MS } from '../constants/config';

const MIN_RECORDING_DURATION_MS = 500; // ✅ en dessous, on considere que c'est accidentel

export function useSpeechRecognition(isoLanguage?: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0); // ✅ pour mesurer la duree reelle

  function reset() {
    setTranscription('');
    setError(null);
    setVolumeLevel(0);
  }

  async function record() {
    setError(null);
    setTranscription('');
    setVolumeLevel(0);
    try {
      setIsRecording(true);
      startTimeRef.current = Date.now(); // ✅ marque le debut
      await startRecording((level) => setVolumeLevel(level));

      timeoutRef.current = setTimeout(async () => {
        await finishRecording();
      }, RECORDING_MAX_DURATION_MS);
    } catch (err: any) {
      setIsRecording(false);
      if (err.message === 'PERMISSION_DENIED') {
        setError("La reconnaissance vocale n'est pas disponible sur cet appareil");
      } else {
        setError('Erreur de transcription, veuillez réessayer');
      }
    }
  }

  async function finishRecording() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const elapsed = Date.now() - startTimeRef.current; // ✅ duree reelle de l'enregistrement

    try {
      const uri = await stopRecording();
      setIsRecording(false);
      setVolumeLevel(0);

      if (!uri) {
        setError('Aucun son détecté, veuillez réessayer');
        return;
      }

      // ✅ Enregistrement trop court : on evite d'envoyer un texte inexploitable a Whisper
      if (elapsed < MIN_RECORDING_DURATION_MS) {
        setError('Parle un peu plus longtemps, essaie encore');
        return;
      }

      const text = await transcribeAudio(uri, isoLanguage);
      if (!text || text.trim().length === 0) {
        setError('Aucun son détecté, veuillez réessayer');
        return;
      }
      setTranscription(text);
    } catch (err) {
      setError('Erreur de transcription, veuillez réessayer');
    }
  }

  return { record, finishRecording, isRecording, transcription, error, volumeLevel, reset };
}