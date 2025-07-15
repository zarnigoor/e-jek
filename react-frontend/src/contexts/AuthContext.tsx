import { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

interface User {
  _id: string;
  login: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Cookie mavjudligini tekshirish uchun so'rov yuboramiz
        const { data } = await api.get<User>('/auth/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = useCallback(async () => {
     try {
        const { data } = await api.get<User>('/auth/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
      }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  // `useMemo` yordamida kontekst qiymati faqat kerak bo'lganda yangilanadi
  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading, login, logout]);

  // Ilova yuklanayotganda Spinner ko'rsatiladi
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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