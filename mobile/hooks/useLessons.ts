import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '../types/lesson';
import { getLessonsRequest } from '../services/api/lessons';
import { getOfflineLessons } from '../services/offlineStorage';

export function useLessons(filters?: { language?: string; level?: string; theme?: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLessonsRequest(filters);
      setLessons(res.lessons);
    } catch (err: any) {
      // ✅ Fallback hors-ligne
      try {
        const offlineLessons = await getOfflineLessons();
        if (offlineLessons.length > 0) {
          setLessons(offlineLessons);
          setError(null);
        } else {
          setError('Connexion internet requise pour charger les leçons');
        }
      } catch {
        setError('Connexion internet requise pour charger les leçons');
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
}