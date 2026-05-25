import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('gp_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true); setError(null);
    try {
      const { user: u, token } = await authService.login(email, password);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('gp_user', JSON.stringify(u));
      setUser(u);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Credenciales inválidas';
      setError(msg);
      return { success: false, message: msg };
    } finally { setIsLoading(false); }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true); setError(null);
    try {
      const { user: u, token } = await authService.register(data);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('gp_user', JSON.stringify(u));
      setUser(u);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Error al registrar usuario';
      setError(msg);
      return { success: false, message: msg };
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('gp_user');
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
};
