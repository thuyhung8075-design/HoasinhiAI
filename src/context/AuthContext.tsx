import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { apiGetMe, apiLogin, apiLogout, apiRegister, apiStudentLogin, getStoredToken } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginStudent: (data: {
    name?: string;
    grade?: number;
    className?: string;
    avatar?: string;
    studentId?: string;
  }) => Promise<void>;
  register: (data: {
    username: string;
    password: string;
    name: string;
    grade: number;
    className: string;
    avatar?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  quickLogin: (accountKey: 'teacher' | 'student1' | 'student2' | 'student3') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiGetMe();
      setUser(res.user);
    } catch (err) {
      console.warn('Session verification failed, logging out:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin({ username, password });
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginStudent = async (data: {
    name?: string;
    grade?: number;
    className?: string;
    avatar?: string;
    studentId?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await apiStudentLogin(data);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    password: string;
    name: string;
    grade: number;
    className: string;
    avatar?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await apiRegister(data);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (accountKey: 'teacher' | 'student1' | 'student2' | 'student3') => {
    if (accountKey === 'teacher') {
      await login('dothanhthuy', '123456');
    } else if (accountKey === 'student1') {
      await loginStudent({ studentId: 'student_minh_anh', name: 'Nguyễn Minh Anh', grade: 3, className: '3A' });
    } else if (accountKey === 'student2') {
      await loginStudent({ studentId: 'student_bao_nam', name: 'Trần Bảo Nam', grade: 5, className: '5B' });
    } else if (accountKey === 'student3') {
      await loginStudent({ studentId: 'student_linh_dan', name: 'Lê Linh Đan', grade: 1, className: '1B' });
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isTeacher,
        isStudent,
        login,
        loginStudent,
        register,
        logout,
        quickLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
