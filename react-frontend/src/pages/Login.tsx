import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/login', { login, password });
      await authLogin();
      toast.success('Tizimga muvaffaqiyatli kirdingiz!');
    } catch (err) {
      toast.error('Login yoki parol xato.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Agar foydalanuvchi tizimga kirgan bo'lsa, dashboardga yo'naltirish
  if (user) {
    const path = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    navigate(path, { replace: true });
    return null; // Redirect qilganda hech narsa render qilmaymiz
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <div className="w-full max-w-sm p-8 space-y-6 bg-dark-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-darkText">{t('login_title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className="text-sm font-medium text-darkText">
              {t('username_label')}
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white border rounded-md border-borderColor focus:outline-none focus:ring-primary focus:border-primary transition-all duration-200 ease-in-out"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-darkText"
            >
              {t('password_label')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 bg-gray-700 text-white border rounded-md border-borderColor focus:outline-none focus:ring-primary focus:border-primary transition-all duration-200 ease-in-out"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white rounded-md bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? 'Kirilmoqda...' : t('login_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;