import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '../types/lesson';
import { getContinueLessonRequest } from '../services/api/lessons';

export function useContinueLesson() {
  const [continueLesson, setContinueLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContinueLesson = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContinueLessonRequest();
      setContinueLesson(res.lesson);
    } catch {
      setContinueLesson(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContinueLesson();
  }, [fetchContinueLesson]);

  return { continueLesson, loading, refetch: fetchContinueLesson };
}