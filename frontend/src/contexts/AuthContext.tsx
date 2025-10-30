import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

// AWS Cognito configuration - hardcoded for Amplify deployment
const COGNITO_DOMAIN = 'medhya.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '6npa9g9it0o66diikabm29j9je';
const REDIRECT_URI = window.location.origin + '/callback';
const LOGOUT_URI = window.location.origin + '/login';

console.log('Cognito Config:', {
  COGNITO_DOMAIN,
  CLIENT_ID,
  REDIRECT_URI,
  LOGOUT_URI,
  currentOrigin: window.location.origin
});

interface DecodedToken {
  sub: string;
  email: string;
  name?: string;
  'cognito:groups'?: string[];
  exp: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try loading token from localStorage, decode if valid
  useEffect(() => {
    const storedToken = localStorage.getItem('idToken');
    if (storedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          localStorage.removeItem('idToken');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('idToken');
      }
    }
    setIsLoading(false);
  }, []);

  // Redirect to Cognito Hosted UI login
  const login = () => {
    // Using implicit flow (response_type=token) - works without client secret
    const authUrl = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    console.log('Redirecting to Cognito:', authUrl);
    window.location.href = authUrl;
  };

  // Remove token, redirect to Cognito Hosted UI logout
  const logout = () => {
    localStorage.removeItem('idToken');
    setUser(null);
    setToken(null);
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
    window.location.href = logoutUrl;
  };

  // Function to set token from callback
  const setAuthToken = (newToken: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(newToken);
      if (decoded.exp * 1000 > Date.now()) {
        setToken(newToken);
        setUser(decoded);
        localStorage.setItem('idToken', newToken);
      } else {
        throw new Error('Token is expired');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('idToken');
      throw error;
    }
  };

  // Only users in 'admin' group are admins; everyone else is treated as regular user
  const isAdmin = Boolean(user?.['cognito:groups']?.includes('admin'));

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, logout, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
