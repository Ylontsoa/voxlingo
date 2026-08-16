import { Platform, LogBox } from 'react-native';

// ✅ Masque le warning bénin d'expo-notifications sous Expo Go (SDK 53+).
// Ce message concerne uniquement les notifications PUSH DISTANTES, que
// cette app n'utilise pas — on ne fait que des rappels locaux programmés,
// qui fonctionnent normalement sous Expo Go malgré ce message.
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);

// ✅ Charger expo-notifications avec try/catch pour Expo Go
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  console.log('expo-notifications non disponible (Expo Go)');
}

// Configurer le handler seulement si disponible
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
}

export async function scheduleDailyReminder(hour: number = 19, minute: number = 0) {
  if (!Notifications) return false;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 N'oublie pas ta serie !",
        body: "Prends 2 minutes pour pratiquer ta langue aujourd'hui.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function cancelReminders() {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {}
}