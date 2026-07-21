import client from './client';
import { Lesson } from '../../types/lesson';
import { Phrase } from '../../types/phrase';

export async function getLessonsRequest(filters?: { language?: string; level?: string; theme?: string; search?: string }) {
  const { data } = await client.get<{ success: boolean; lessons: Lesson[] }>('/lessons', {
    params: filters,
  });
  return data;
}

export async function getContinueLessonRequest() {
  const { data } = await client.get<{ success: boolean; lesson: Lesson | null }>('/lessons/continue');
  return data;
}

export async function getLessonByIdRequest(id: number) {
  const { data } = await client.get<{ success: boolean; lesson: Lesson & { phrases: Phrase[] } }>(`/lessons/${id}`);
  return data;
}