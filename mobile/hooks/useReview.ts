import { useState, useCallback } from 'react';
import client from '../services/api/client';
import { Phrase } from '../types/phrase';

interface ReviewPhrase extends Phrase {
  Lesson: { id: number; language: string; title: string };
}

export function useReview() {
  const [phrases, setPhrases] = useState<ReviewPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/progress/review');
      setPhrases(data.phrases);
    } catch (err) {
      console.warn('Erreur chargement révision:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { phrases, loading, fetchReview };
}