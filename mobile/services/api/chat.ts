import client from './client';

export interface HistoryEntry {
  id: number;
  language: string;
  messages: string;
  created_at: string;
}

export async function saveHistoryRequest(language: string, messages: any[]) {
  const { data } = await client.post('/chat/history', { language, messages });
  return data;
}

export async function getHistoryRequest() {
  const { data } = await client.get<{ success: boolean; history: HistoryEntry[] }>('/chat/history');
  return data;
}

export async function deleteHistoryRequest() {
  const { data } = await client.delete('/chat/history');
  return data;
}