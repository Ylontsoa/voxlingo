import AsyncStorage from '@react-native-async-storage/async-storage';

const CHALLENGES_KEY = 'daily_challenge';

const CHALLENGES = [
  { id: 1, goal: 5, reward: 20, text: 'Prononce 5 phrases' },
  { id: 2, goal: 10, reward: 50, text: 'Prononce 10 phrases' },
  { id: 3, goal: 3, reward: 30, text: 'Fais 3 phrases parfaites (100%)' },
  { id: 4, goal: 1, reward: 15, text: 'Utilise le chatbot' },
];

export async function getTodayChallenge() {
  const today = new Date().toDateString();
  const saved = await AsyncStorage.getItem(CHALLENGES_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) return data;
  }
  const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  const newData = { ...challenge, date: today, progress: 0, completed: false };
  await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(newData));
  return newData;
}

export async function updateChallengeProgress() {
  const today = new Date().toDateString();
  const saved = await AsyncStorage.getItem(CHALLENGES_KEY);
  if (!saved) return;
  const data = JSON.parse(saved);
  if (data.date !== today || data.completed) return;
  data.progress += 1;
  if (data.progress >= data.goal) {
    data.completed = true;
  }
  await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(data));
}