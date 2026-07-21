import * as Speech from 'expo-speech';

// ✅ Voix améliorée avec Google TTS
export async function speakWithBestVoice(text: string, language: string = 'en-US', rate: number = 0.85) {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    
    // Cherche la meilleure voix pour cette langue
    const bestVoice = voices.find(v => 
      v.language.startsWith(language.split('-')[0]) && 
      (v.quality === 'Enhanced' || v.quality === 'Default')
    );
    
    await Speech.speak(text, {
      language,
      voice: bestVoice?.identifier,
      pitch: 1.0,
      rate,
    });
  } catch {
    Speech.speak(text, { language, pitch: 1.0, rate });
  }
}

// ✅ Version simple (fallback)
export function speakPhrase(text: string, language: string = 'en-US', rate: number = 0.9) {
  Speech.speak(text, { language, pitch: 1.0, rate });
}

export function stopSpeaking() {
  Speech.stop();
}