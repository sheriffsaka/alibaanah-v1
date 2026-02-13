import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authService } from '../services/authService';
import { AdminUser } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (username: string, pass: string) => Promise<AdminUser | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Refactored to use an explicit props interface and React.FC for better type consistency.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authService.isAuthenticated());

  const login = async (username: string, pass: string): Promise<AdminUser | null> => {
    const loggedInUser = await authService.login(username, pass);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    }
    return null;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};