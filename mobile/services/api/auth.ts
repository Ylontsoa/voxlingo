import client from './client';
import { AuthResponse, User } from '../../types/user';

export async function registerRequest(email: string, password: string, confirmPassword: string, username?: string) {
  const { data } = await client.post<AuthResponse>('/auth/register', {
    email,
    password,
    confirmPassword,
    username,
  });
  return data;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await client.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function getMeRequest() {
  const { data } = await client.get<{ success: boolean; user: User }>('/auth/me');
  return data;
}

export async function selectLanguageRequest(language: string) {
  const { data } = await client.post('/auth/select-language', { language });
  return data;
}

export async function updateAvatarRequest(avatar_url: string) {
  const { data } = await client.patch('/auth/avatar', { avatar_url });
  return data;
}

// ✅ Upload avatar (photo locale → serveur)
export async function uploadAvatarRequest(localUri: string) {
  const formData = new FormData();
  const filename = localUri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('avatar', {
    uri: localUri,
    name: filename,
    type,
  } as any);

  const response = await client.post('/auth/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}