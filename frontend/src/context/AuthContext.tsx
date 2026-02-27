import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, User } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: 'user' | 'organizer' }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    authService.getMe().then(user => {
      if (user) {
        setState({ user, token: localStorage.getItem('evt_token'), isLoading: false, isAuthenticated: true });
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    setState({ user, token, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: 'user' | 'organizer' }) => {
    const { user, token } = await authService.register(data);
    setState({ user, token, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const updated = await authService.updateProfile(data);
    setState(s => ({ ...s, user: updated }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
