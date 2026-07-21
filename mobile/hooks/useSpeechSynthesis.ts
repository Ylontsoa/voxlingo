import { useState } from 'react';
import { speakWithBestVoice, speakPhrase, stopSpeaking } from '../services/speech/synthesis';

export function useSpeechSynthesis(defaultRate: number = 0.85) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(defaultRate);

  async function speak(text: string, language?: string) {
    setIsSpeaking(true);
    try {
      await speakWithBestVoice(text, language, rate);
    } catch {
      speakPhrase(text, language, rate);
      setTimeout(() => setIsSpeaking(false), Math.max(1500, text.length * 80 / rate));
      return;
    }
    setIsSpeaking(false);
  }

  function stop() {
    stopSpeaking();
    setIsSpeaking(false);
  }

  return { speak, stop, isSpeaking, rate, setRate };
}