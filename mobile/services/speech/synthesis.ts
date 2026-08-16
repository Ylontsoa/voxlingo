// mobile/services/speech/synthesis.ts
import * as Speech from 'expo-speech';
import { voiceService } from '../voice.service';

// ✅ Voix améliorée avec ElevenLabs (prioritaire) + fallback Google TTS
export async function speakWithBestVoice(text: string, language: string = 'fr', rate: number = 0.85) {
  if (!text) return;

  try {
    // 🔥 PRIORITÉ : ElevenLabs
    console.log('[Voice] Tentative ElevenLabs...');
    await voiceService.speak(text, {
      voice: 'alice',
      speed: rate,
      emotion: 'neutral',
    });
    console.log('[Voice] ElevenLabs réussi ✅');
    return;
  } catch (error) {
    console.log('[Voice] ElevenLabs échoué, fallback Expo Speech:', error);
    
    // 🟡 FALLBACK : Expo Speech (Google TTS)
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      
      // Cherche la meilleure voix pour cette langue
      const langCode = language.split('-')[0] || 'fr';
      const bestVoice = voices.find(v => 
        v.language?.startsWith(langCode) && 
        (v.quality === 'Enhanced' || v.quality === 'Default')
      );
      
      await Speech.speak(text, {
        language: language,
        voice: bestVoice?.identifier,
        pitch: 1.0,
        rate: rate,
      });
      console.log('[Voice] Expo Speech fallback réussi ✅');
    } catch (fallbackError) {
      console.error('[Voice] Fallback Expo Speech échoué:', fallbackError);
      // Dernier recours : Speech.speak simple
      Speech.speak(text, { language, pitch: 1.0, rate });
    }
  }
}

// ✅ Version simple avec ElevenLabs (fallback)
export function speakPhrase(text: string, language: string = 'fr', rate: number = 0.9) {
  if (!text) return;
  
  // Essayer ElevenLabs d'abord
  voiceService.speak(text, {
    voice: 'alice',
    speed: rate,
    emotion: 'neutral',
  }).catch(() => {
    // Fallback Expo Speech
    Speech.speak(text, {
      language: language,
      pitch: 1.0,
      rate,
    });
  });
}

// ✅ Version avec choix de la voix
export async function speakWithVoice(text: string, voiceId: string = 'alice', language: string = 'fr', rate: number = 0.85) {
  if (!text) return;

  try {
    await voiceService.speak(text, {
      voice: voiceId as any,
      speed: rate,
      emotion: 'neutral',
    });
  } catch (error) {
    console.error('[Voice] Erreur avec la voix', voiceId, ':', error);
    // Fallback vers la voix par défaut
    await speakWithBestVoice(text, language, rate);
  }
}

// ✅ Stop la lecture en cours
export function stopSpeaking() {
  voiceService.stop();
  Speech.stop();
}

// ✅ Vérifier si la lecture est en cours
export function isSpeaking(): boolean {
  return voiceService.isSpeaking;
}