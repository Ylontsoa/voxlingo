import { useState, useCallback } from 'react';
import client from '../services/api/client';

export function useCalendar() {
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/progress/calendar');
      console.log('📅 Calendrier reçu:', data); // ✅ Debug
      setDays(data.days || []);
    } catch (err: any) {
      console.warn('Erreur calendrier:', err?.response?.status, err?.message);
      setDays([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { days, loading, fetchCalendar };
}