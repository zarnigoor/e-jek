import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { useTranslation } from 'react-i18next';

const SubmitApplication = () => {
  const { t } = useTranslation();
  const [mutaxassislik, setMutaxassislik] = useState('santexnik');
  const [muammoTavsifi, setMuammoTavsifi] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!muammoTavsifi.trim()) {
      toast.error(t('submit_application_toast_validation'));
      return;
    }
    setLoading(true);
    try {
      await api.post('/applications', { mutaxassislik, muammoTavsifi });
      toast.success(t('submit_application_toast_success'));
      navigate('/user/my-applications');
    } catch (error) {
      toast.error(t('submit_application_toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-dark-card border rounded-lg shadow-sm sm:p-8 border-borderColor">
        <h1 className="mb-6 text-2xl font-bold text-center text-darkText">{t('submit_application_title')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mutaxassislik" className="block mb-2 text-sm font-medium text-darkText">
              {t('submit_application_specialty')}
            </label>
            <select
              id="mutaxassislik"
              value={mutaxassislik}
              onChange={(e) => setMutaxassislik(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
            >
              <option value="santexnik">{t('specialty_santexnik')}</option>
              <option value="usta">{t('specialty_usta')}</option>
              <option value="elektrik">{t('specialty_elektrik')}</option>
              <option value="gaz-ustasi">{t('specialty_gaz_ustasi')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="muammo_tavsifi" className="block mb-2 text-sm font-medium text-darkText">
              {t('submit_application_description')}
            </label>
            <textarea
              id="muammo_tavsifi"
              rows={5}
              value={muammoTavsifi}
              onChange={(e) => setMuammoTavsifi(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
              placeholder={t('submit_application_placeholder')}
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full px-6 py-3 font-bold text-white rounded-md bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? <Spinner /> : t('submit_application_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitApplication;