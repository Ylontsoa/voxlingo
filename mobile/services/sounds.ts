// mobile/services/sounds.ts
import * as Haptics from 'expo-haptics';

export async function playSuccessSound() {
  try {
    // ✅ Vibration courte et légère pour le succès
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Fallback silencieux si l'haptique n'est pas disponible
    console.log('Retour haptique non disponible');
  }
}

export async function playFailSound() {
  try {
    // ✅ Vibration plus marquée pour l'échec
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.log('Retour haptique non disponible');
  }
}

// ✅ Fonction de déchargement (plus nécessaire, mais gardée pour compatibilité)
export async function unloadSounds() {
  // Ne fait rien, car il n'y a plus de sons à décharger
  return Promise.resolve();
}