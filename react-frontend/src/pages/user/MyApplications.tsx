import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { FiPlusSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { useTranslation } from 'react-i18next';

interface Application {
  _id: string;
  mutaxassislik: string;
  muammoTavsifi: string;
  status: 'ochiq' | 'bajarildi' | 'amalga_oshirilmadi' | 'bekor_qilingan';
  createdAt: string;
  navbatRaqami?: number;
}

const MyApplications: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [appToUpdate, setAppToUpdate] = useState<{ id: string; newStatus: string } | null>(null);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (err) {
      setError(t('my_applications_toast_load_error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [t]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppToUpdate({ id, newStatus });
    setIsConfirmModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!appToUpdate) return;

    const { id, newStatus } = appToUpdate;
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success(t('my_applications_toast_updated'));
      fetchApplications();
    } catch (err) {
      toast.error(t('my_applications_toast_update_error'));
    } finally {
      setIsConfirmModalOpen(false);
      setAppToUpdate(null);
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'ochiq':
        return <span className={`${baseClasses} bg-yellow-500 text-white`}>{t('status_open')}</span>;
      case 'bajarildi':
        return <span className={`${baseClasses} bg-green-500 text-white`}>{t('status_completed')}</span>;
      case 'amalga_oshirilmadi':
        return <span className={`${baseClasses} bg-red-500 text-white`}>{t('status_not_completed')}</span>;
      case 'bekor_qilingan':
        return <span className={`${baseClasses} bg-gray-500 text-white`}>{t('status_cancelled')}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-600 text-white`}>{t('status_unknown')}</span>;
    }
  };
  
  const getSpecialtyName = (specialty: string) => {
    const key = `specialty_${specialty.replace('-', '_')}`;
    return t(key);
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-danger bg-red-100 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-darkText">{t('my_applications_title')}</h1>
          <Link
            to="/user/submit-application"
            className="flex items-center justify-center mt-4 sm:mt-0 px-4 py-2 font-bold text-white rounded-md bg-primary hover:bg-primaryDark"
          >
            <FiPlusSquare className="mr-2" />
            {t('my_applications_new')}
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-16 text-center bg-dark-card border rounded-lg shadow-sm border-borderColor">
            <h3 className="text-xl font-semibold text-darkText">{t('my_applications_no_apps')}</h3>
            <p className="mt-2 text-gray-400">{t('my_applications_no_apps_subtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div key={app._id} className="flex flex-col justify-between p-5 bg-dark-card border rounded-lg shadow-sm border-borderColor">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold capitalize text-darkText">{getSpecialtyName(app.mutaxassislik)}</h2>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3">{app.muammoTavsifi}</p>
                  {app.status === 'ochiq' && app.navbatRaqami !== null && (
                    <p className="mt-2 text-lg font-bold text-primary">{t('my_applications_queue_number')}: {app.navbatRaqami}</p>
                  )}
                </div>
                <div className="flex items-end justify-between mt-4">
                  <p className="text-xs text-gray-400">
                    {t('my_applications_sent_on')}: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                  {app.status === 'ochiq' && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusChange(app._id, 'bajarildi')}
                        className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                        title={t('action_completed')}
                      >
                        {t('action_completed')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'amalga_oshirilmadi')}
                        className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                        title={t('action_not_completed')}
                      >
                        {t('action_not_completed')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'bekor_qilingan')}
                        className="px-3 py-1 text-xs font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700"
                        title={t('action_cancel')}
                      >
                        {t('action_cancel')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title={t('my_applications_confirm_status_change')}
        >
          {appToUpdate && (
            <div>
              <p className="mb-4 text-darkText">
                {t('my_applications_confirm_status_prompt', { status: t(`status_${appToUpdate.newStatus.replace('_', '')}`) })}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 font-semibold rounded-md text-white bg-danger hover:bg-red-700"
                >
                  {t('action_reject')}
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 font-semibold text-white rounded-md bg-green-600 hover:bg-green-700"
                >
                  {t('action_confirm')}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </>
    </div>
  );
};

export default MyApplications;