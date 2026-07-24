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

  // ✅ Verrou explicite : évite que finishRecording() s'exécute deux fois
  // en parallèle (ex: le timeout auto ET un clic manuel arrivent presque ensemble)
  const isFinishingRef = useRef(false);

  const recordingDuration = maxDuration || RECORDING_MAX_DURATION_MS;

  function reset() {
    setTranscription('');
    setError(null);
    setVolumeLevel(0);
  }

  async function record() {
    setError(null);
    setTranscription('');
    setVolumeLevel(0);
    isFinishingRef.current = false; // ✅ réinitialise le verrou a chaque nouvel enregistrement
    try {
      setIsRecording(true);
      startTimeRef.current = Date.now();
      await startRecording((level) => setVolumeLevel(level));

      timeoutRef.current = setTimeout(async () => {
        await finishRecording();
      }, recordingDuration);
    } catch (err: any) {
      setIsRecording(false);
      if (err.message === 'PERMISSION_DENIED') {
        setError("La reconnaissance vocale n'est pas disponible sur cet appareil");
      } else {
        setError('Erreur de transcription, veuillez reessayer');
      }
    }
  }

  async function finishRecording() {
    // ✅ Si un arrêt est déjà en cours (ou terminé), on ignore cet appel supplémentaire
    if (isFinishingRef.current || !isRecording) return;
    isFinishingRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const elapsed = Date.now() - startTimeRef.current;

    try {
      const uri = await stopRecording();
      setIsRecording(false);
      setVolumeLevel(0);

      if (!uri) {
        setError('Aucun son detecte, veuillez reessayer');
        return;
      }

      if (elapsed < MIN_RECORDING_DURATION_MS) {
        setError('Parle un peu plus longtemps, essaie encore');
        return;
      }

      const text = await transcribeAudio(uri, isoLanguage);
      if (!text || text.trim().length === 0) {
        setError('Aucun son detecte, veuillez reessayer');
        return;
      }
      setTranscription(text);
    } catch (err) {
      setError('Erreur de transcription, veuillez reessayer');
    }
  }

  return { record, finishRecording, isRecording, transcription, error, volumeLevel, reset };
}