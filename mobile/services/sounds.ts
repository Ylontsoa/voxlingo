import { Audio } from 'expo-av';

let successSound: Audio.Sound | null = null;
let failSound: Audio.Sound | null = null;

const SUCCESS_URL = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3';
const FAIL_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2d37f6c9f9.mp3';

export async function playSuccessSound() {
  try {
    if (successSound) {
      await successSound.setPositionAsync(0);
      await successSound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SUCCESS_URL },
        { shouldPlay: true, volume: 0.5 }
      );
      successSound = sound;
    }
  } catch (err) {
    console.log('Son succes non disponible');
  }
}

export async function playFailSound() {
  try {
    if (failSound) {
      await failSound.setPositionAsync(0);
      await failSound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        { uri: FAIL_URL },
        { shouldPlay: true, volume: 0.3 }
      );
      failSound = sound;
    }
  } catch (err) {
    console.log('Son echec non disponible');
  }
}

export async function unloadSounds() {
  if (successSound) { await successSound.unloadAsync(); successSound = null; }
  if (failSound) { await failSound.unloadAsync(); failSound = null; }
}