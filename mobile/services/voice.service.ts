// mobile/services/voice.service.ts
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { speakRequest, welcomeRequest, feedbackRequest, pronouncePhraseRequest, speakConversationMessageRequest } from './api/tts';

export class VoiceService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  /**
   * Joue un audio à partir d'un base64
   * Utilise l'API legacy de expo-file-system
   */
  async playAudio(base64Audio: string): Promise<void> {
    try {
      // Arrêter l'audio précédent
      await this.stop();

      const fileUri = FileSystem.documentDirectory + 'voice_' + Date.now() + '.mp3';
      
      // ✅ Utiliser l'API legacy
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Charger et jouer l'audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );

      this.sound = sound;
      this.isPlaying = true;

      // Nettoyer après la lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isPlaying = false;
          sound.unloadAsync().catch(() => {});
        }
      });

    } catch (error) {
      console.error('Erreur lecture audio:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  /**
   * Synthèse vocale simple
   */
  async speak(text: string, options: {
    voice?: 'alice' | 'sarah' | 'jessica' | 'george' | 'matilda' | 'rachel' | 'river';
    speed?: number;
    emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'friendly';
  } = {}): Promise<void> {
    try {
      const response = await speakRequest(text, options);
      if (response.audio) {
        await this.playAudio(response.audio);
      }
    } catch (error) {
      console.error('Erreur speak:', error);
      throw error;
    }
  }

  /**
   * Message de bienvenue
   */
  async welcome(username: string, streak: number = 0): Promise<void> {
    try {
      const response = await welcomeRequest(username, streak);
      if (response.audio) {
        await this.playAudio(response.audio);
      }
    } catch (error) {
      console.error('Erreur welcome:', error);
      throw error;
    }
  }

  /**
   * Feedback vocal selon le score
   */
  async feedback(score: number, level: string = 'intermediate'): Promise<void> {
    try {
      const response = await feedbackRequest(score, level);
      if (response.audio) {
        await this.playAudio(response.audio);
      }
    } catch (error) {
      console.error('Erreur feedback:', error);
      throw error;
    }
  }

  /**
   * Prononciation d'une phrase de leçon
   */
  async pronouncePhrase(phrase: string, translation?: string, level: string = 'beginner'): Promise<{
    phraseAudio: string | null;
    translationAudio: string | null;
  }> {
    try {
      const response = await pronouncePhraseRequest(phrase, translation, level);
      
      // Jouer la phrase immédiatement
      if (response.phraseAudio) {
        await this.playAudio(response.phraseAudio);
      }
      
      return {
        phraseAudio: response.phraseAudio || null,
        translationAudio: response.translationAudio || null,
      };
    } catch (error) {
      console.error('Erreur pronouncePhrase:', error);
      throw error;
    }
  }

  /**
   * Message vocal en conversation
   */
  async speakConversationMessage(code: string, text: string, language: string = 'fr'): Promise<void> {
    try {
      const response = await speakConversationMessageRequest(code, text, language);
      if (response.audio) {
        await this.playAudio(response.audio);
      }
    } catch (error) {
      console.error('Erreur speakConversationMessage:', error);
      throw error;
    }
  }

  /**
   * Arrête la lecture en cours
   */
  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (e) {
        // Ignorer les erreurs de déchargement
      }
      this.sound = null;
      this.isPlaying = false;
    }
  }

  /**
   * Vérifie si un audio est en cours de lecture
   */
  get isSpeaking(): boolean {
    return this.isPlaying;
  }
}

// Export d'une instance unique
export const voiceService = new VoiceService();