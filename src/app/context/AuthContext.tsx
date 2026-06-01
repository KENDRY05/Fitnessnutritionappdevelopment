/**
 * Contexto de Autenticación
 * Maneja el estado global del usuario autenticado
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Verificar si hay una sesión guardada al iniciar
  useEffect(() => {
    const user = storageService.getCurrentUser();
    const token = storageService.getToken();

    if (user && token) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
    }
  }, []);

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      const newUser = storageService.registerUser(userData);
      const token = btoa(`${newUser.id}:${Date.now()}`);

      storageService.setCurrentUser(newUser, token);

      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = storageService.loginUser(email, password);

      storageService.setCurrentUser(user, token);

      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    storageService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    const updatedUser = storageService.updateUserProfile(updates);
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
