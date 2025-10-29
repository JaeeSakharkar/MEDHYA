import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// SIMPLIFIED AUTH CONTEXT - NO COGNITO FOR AMPLIFY DEPLOYMENT
// This provides a mock authentication system for demo purposes

interface MockUser {
  sub: string;
  email: string;
  name?: string;
  'cognito:groups'?: string[];
  exp: number;
}

interface AuthContextType {
  user: MockUser | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication - automatically log in as admin for demo
  useEffect(() => {
    const mockUser: MockUser = {
      sub: 'demo-user-123',
      email: 'demo@quizmaster.com',
      name: 'Demo User',
      'cognito:groups': ['admin'],
      exp: Date.now() / 1000 + 3600 // Expires in 1 hour
    };

    const mockToken = 'demo-token-' + Date.now();
    
    setUser(mockUser);
    setToken(mockToken);
    setIsLoading(false);
  }, []);

  const login = () => {
    // Mock login - already logged in
    console.log('Mock login - user already authenticated');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // In a real app, this would redirect to login page
    console.log('Mock logout - user signed out');
  };

  const setAuthToken = (newToken: string) => {
    // Mock token setting
    setToken(newToken);
    console.log('Mock token set:', newToken);
  };

  const isAdmin = user?.['cognito:groups']?.includes('admin') ?? false;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin,
      isLoading,
      login,
      logout,
      setAuthToken
    }}>
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