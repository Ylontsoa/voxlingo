import AsyncStorage from '@react-native-async-storage/async-storage';

const LESSONS_KEY = 'offline_lessons';
const PHRASES_KEY = 'offline_phrases';

export async function saveLessonsOffline(lessons: any[]) {
  await AsyncStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
}

export async function getOfflineLessons(): Promise<any[]> {
  const data = await AsyncStorage.getItem(LESSONS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function savePhrasesOffline(phrases: any[]) {
  await AsyncStorage.setItem(PHRASES_KEY, JSON.stringify(phrases));
}

export async function getOfflinePhrases(): Promise<any[]> {
  const data = await AsyncStorage.getItem(PHRASES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function isOfflineDataAvailable(): Promise<boolean> {
  const lessons = await getOfflineLessons();
  return lessons.length > 0;
}