import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from 'react-i18next';

const CreateUser = () => {
  const { t } = useTranslation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dom, setDom] = useState('');
  const [uy, setUy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/users', { login, password, name, dom: Number(dom), uy: Number(uy) });
      toast.success(t('create_user_toast_success'));
      setLogin(''); setPassword(''); setName(''); setDom(''); setUy('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('create_user_toast_error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-dark-card border rounded-lg shadow-sm sm:p-8 border-borderColor">
        <h1 className="mb-6 text-2xl font-bold text-center text-darkText">{t('create_user_title')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className="block mb-2 text-sm font-medium text-darkText">{t('table_header_login')}</label>
            <input id="login" type="text" placeholder={t('create_user_login_placeholder')} value={login} onChange={e => setLogin(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" required />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-darkText">{t('password_label')}</label>
            <input id="password" type="password" placeholder={t('create_user_password_placeholder')} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" required />
          </div>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-darkText">{t('create_user_name_label')}</label>
            <input id="name" type="text" placeholder={t('create_user_name_placeholder')} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="dom" className="block mb-2 text-sm font-medium text-darkText">{t('create_user_dom_label')}</label>
              <input id="dom" type="number" placeholder={t('create_user_dom_label')} value={dom} onChange={e => setDom(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" required />
            </div>
            <div>
              <label htmlFor="uy" className="block mb-2 text-sm font-medium text-darkText">{t('create_user_uy_label')}</label>
              <input id="uy" type="number" placeholder={t('create_user_uy_label')} value={uy} onChange={e => setUy(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out" required />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center w-full px-6 py-3 font-bold text-white rounded-md bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
              {loading ? <Spinner /> : t('create_user_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;