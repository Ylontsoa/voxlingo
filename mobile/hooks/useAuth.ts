import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types/user';
import { loginRequest, registerRequest, getMeRequest } from '../services/api/auth';
import { saveToken, getToken, deleteToken } from '../services/storage/secureStorage';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, username?: string) => Promise<void>; // ✅ username optionnel
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          try {
            const res = await getMeRequest();
            if (isMounted) setUser(res.user);
          } catch {
            await deleteToken();
          }
        }
      } catch (err) {
        console.warn('Erreur initialisation auth:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  async function login(email: string, password: string) {
    const res = await loginRequest(email, password);
    await saveToken(res.token);
    setUser(res.user);
  }

  async function register(email: string, password: string, confirmPassword: string, username?: string) { // ✅
    const res = await registerRequest(email, password, confirmPassword, username); // ✅
    await saveToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await deleteToken();
    setUser(null);
  }

  async function refreshUser() {
    try {
      const res = await getMeRequest();
      setUser(res.user);
    } catch (err) {
      console.warn('Erreur refresh user:', err);
    }
  }

  return { user, loading, login, register, logout, refreshUser };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthContext.Provider');
  return ctx;
}