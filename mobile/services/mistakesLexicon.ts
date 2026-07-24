import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MistakeEntry {
  id: string;
  wrong: string;
  correction: string;
  explanation: string;
  language: string;
  date: string;
}

const STORAGE_KEY = 'mistakes_lexicon';

export async function getMistakes(language?: string): Promise<MistakeEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const all: MistakeEntry[] = raw ? JSON.parse(raw) : [];
    return language ? all.filter(m => m.language === language) : all;
  } catch {
    return [];
  }
}

export async function addMistakes(newEntries: Omit<MistakeEntry, 'id' | 'date'>[]): Promise<void> {
  if (newEntries.length === 0) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const all: MistakeEntry[] = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();
    const toAdd: MistakeEntry[] = newEntries.map((e, i) => ({ ...e, id: `${Date.now()}_${i}`, date: now }));
    const updated = [...toAdd, ...all].slice(0, 200); // garde les 200 dernieres
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur sauvegarde lexique:', error);
  }
}

export async function clearMistakes(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur suppression lexique:', error);
  }
}

// Extrait les erreurs du format "❌ "mot" → ✅ "correction" : explication"
export function parseMistakesFromCheckResult(checkResult: string, language: string): Omit<MistakeEntry, 'id' | 'date'>[] {
  const lines = checkResult.split('\n').filter(l => l.includes('❌') && l.includes('✅'));
  const regex = /❌\s*"([^"]+)"\s*→\s*✅\s*"([^"]+)"\s*:\s*(.+)/;
  const entries: Omit<MistakeEntry, 'id' | 'date'>[] = [];
  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      entries.push({ wrong: match[1].trim(), correction: match[2].trim(), explanation: match[3].trim(), language });
    }
  }
  return entries;
}