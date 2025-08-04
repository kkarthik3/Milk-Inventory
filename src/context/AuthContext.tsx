import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      fetchUserFromToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserFromToken = async (token: string) => {
    try {
      // In real app, verify token with backend
      const mockUser: User = {
        _id: '1',
        email: 'admin@milkdelivery.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date()
      };
      setUser(mockUser);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - replace with actual API call
      const mockUsers = [
        { email: 'admin@milk.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        { email: 'worker@milk.com', password: 'worker123', role: 'worker', name: 'Worker One' },
        { email: 'customer@milk.com', password: 'customer123', role: 'customer', name: 'John Doe' }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const user: User = {
          _id: Math.random().toString(),
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role as any,
          createdAt: new Date()
        };
        
        setUser(user);
        localStorage.setItem('token', 'mock-token');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};