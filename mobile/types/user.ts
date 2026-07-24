export interface User {
  id: number;
  email: string;
  username?: string | null; // ✅ Ajout
  target_language?: string | null;
  profile_image_url?: string | null;
  current_streak: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}