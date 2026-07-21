import { useState, useCallback } from 'react';
import { saveProgressRequest, getStatsRequest } from '../services/api/progress';
import { Stats, ProgressEntry } from '../types/progress';

export function useProgress() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const saveProgress = useCallback(async (entry: ProgressEntry) => {
    await saveProgressRequest(entry);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatsRequest();
      setStats(res.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, saveProgress, fetchStats };
}