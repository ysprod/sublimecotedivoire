'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/libs/interface';
import { getRandomUserImage } from '@/lib/libs/functions';
import { mockUser } from '@/lib/libs/mockdata';

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  deleteUser: () => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  user: null,
  login: async () => { },
  logout: () => { },
  updateUser: async () => { },
  deleteUser: async () => { },
  register: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser(mockUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (email && password) {
      localStorage.setItem('authToken', '12345678');
      setUser(mockUser);
      setIsAuthenticated(true);
      router.push('/home');
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: userData.name,
      email: userData.email,
      birthDate: userData.birthDate,
      photo: getRandomUserImage()!
    };
    localStorage.setItem('authToken', '12345678');
    setUser(newUser);
    setIsAuthenticated(true);
    router.push('/home');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    return new Promise<void>((resolve) => { setTimeout(() => resolve(), 500); });
  };

  const deleteUser = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        router.push('/');
        resolve();
      }, 600);
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, deleteUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);