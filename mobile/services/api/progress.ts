import client from './client';
import { ProgressEntry, Stats } from '../../types/progress';

export async function saveProgressRequest(entry: ProgressEntry) {
  const { data } = await client.post('/progress', entry);
  return data;
}

export async function getStatsRequest() {
  const { data } = await client.get<{ success: boolean; stats: Stats }>('/progress/stats');
  return data;
}