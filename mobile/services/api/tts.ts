// mobile/services/api/tts.ts
import client from './client';

export async function speakRequest(text: string, options: {
  voice?: 'alice' | 'sarah' | 'jessica' | 'george' | 'matilda' | 'rachel' | 'river';
  speed?: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'friendly';
} = {}) {
  const { data } = await client.post('/voice/speak', {
    text,
    voice: options.voice || 'alice',
    speed: options.speed || 1.0,
    emotion: options.emotion || 'neutral',
  });
  return data;
}

export async function welcomeRequest(username: string, streak: number = 0) {
  const { data } = await client.post('/voice/welcome', { username, streak });
  return data;
}

export async function feedbackRequest(score: number, level: string = 'intermediate') {
  const { data } = await client.post('/voice/feedback', { score, level });
  return data;
}

export async function getVoicesRequest() {
  const { data } = await client.get('/voice/voices');
  return data;
}

export async function pronouncePhraseRequest(phrase: string, translation?: string, level: string = 'beginner') {
  const { data } = await client.post('/lessons/pronounce', {
    phrase,
    translation,
    level,
  });
  return data;
}

export async function speakConversationMessageRequest(code: string, text: string, language: string = 'fr') {
  const { data } = await client.post(`/conversations/${code}/speak`, {
    text,
    language,
  });
  return data;
}