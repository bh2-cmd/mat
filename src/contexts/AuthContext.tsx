import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  hasPremiumAccess?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  upgradeToPreium: () => void;
  sessionId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('leankloud_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // Generate a static session id for this session
      setSessionId(Math.random().toString(36).substr(2, 9));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate OIDC/WSO2 authentication
      // In real implementation, redirect to WSO2 OIDC provider
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        hasPremiumAccess: false
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('leankloud_user', JSON.stringify(mockUser));
      // Generate a static session id for this session
      setSessionId(Math.random().toString(36).substr(2, 9));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setSessionId(null);
    localStorage.removeItem('leankloud_user');
  };

  const upgradeToPreium = () => {
    if (user) {
      const updatedUser = { ...user, hasPremiumAccess: true };
      setUser(updatedUser);
      localStorage.setItem('leankloud_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      upgradeToPreium,
      sessionId
    }}>
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