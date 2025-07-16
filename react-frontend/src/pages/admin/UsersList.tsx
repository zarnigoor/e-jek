// import React, { useEffect, useState, useMemo } from 'react';
// import api from '../../services/api';
// import Spinner from '../../components/ui/Spinner';
// import Modal from '../../components/ui/Modal';
// import { FiEdit, FiSearch } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import { useTranslation } from 'react-i18next';

// interface User {
//   _id: string;
//   login: string;
//   name?: string;
//   createdAt: string;
// }

// const UsersList: React.FC = () => {
//   const { t } = useTranslation();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [newPassword, setNewPassword] = useState('');
//   const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await api.get('/admin/users');
//         setUsers(response.data);
//       } catch (err) {
//         setError(t('users_list_toast_load_error'));
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [t]);

//   const filteredUsers = useMemo(() => {
//     return users.filter(user =>
//       user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [users, searchTerm]);

//   const openEditModal = (user: User) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//     setNewPassword('');
//   };

//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser) return;
//     setIsUpdating(true);
//     try {
//       await api.patch(`/admin/users/${selectedUser._id}/password`, { newPassword });
//       toast.success(t('users_list_toast_update_success'));
//       setIsModalOpen(false);
//     } catch (err) {
//       toast.error(t('users_list_toast_update_error'));
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64"><Spinner /></div>;
//   }

//   if (error) {
//     return <div className="p-4 text-center text-danger bg-red-100 rounded-lg">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto">
//       <h1 className="mb-6 text-3xl font-bold text-darkText">{t('users_list_title')}</h1>
//       <div className="mb-4">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder={t('users_list_search_placeholder')}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-dark-card text-darkText border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
//           />
//           <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>
//       <div className="p-4 bg-dark-card border rounded-lg shadow-sm border-borderColor">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left text-darkText">
//             <thead className="bg-dark-hover">
//               <tr>
//                 <th className="px-4 py-3 font-semibold">{t('table_header_name')}</th>
//                 <th className="px-4 py-3 font-semibold">{t('table_header_login')}</th>
//                 <th className="px-4 py-3 font-semibold">{t('table_header_date')}</th>
//                 <th className="px-4 py-3 font-semibold text-center">{t('table_header_actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-borderColor">
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-dark-hover transition-colors duration-200">
//                   <td className="px-4 py-3 font-medium">{user.name || t('not_available')}</td>
//                   <td className="px-4 py-3">{user.login}</td>
//                   <td className="px-4 py-3 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
//                   <td className="px-4 py-3 text-center">
//                     <button onClick={() => openEditModal(user)} className="text-primary hover:text-primaryDark transition-transform duration-200 ease-in-out hover:scale-110" title={t('action_edit')}>
//                       <FiEdit size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('users_list_edit_password_title', { login: selectedUser?.login })}>
//         {selectedUser && (
//           <form onSubmit={handlePasswordUpdate}>
//             <div className="p-1">
//               <label htmlFor="password" className="block mb-2 text-sm font-medium text-darkText">{t('users_list_new_password_label')}</label>
//               <input
//                 id="password"
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
//                 required
//               />
//             </div>
//             <div className="flex justify-end pt-4 mt-4 border-t border-borderColor">
//               <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-3 font-semibold rounded-md text-white bg-danger hover:bg-red-700 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
//                 {t('action_reject')}
//               </button>
//               <button type="submit" disabled={isUpdating} className="px-4 py-2 font-bold text-white rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
//                 {isUpdating ? <Spinner size="sm" /> : t('action_update')}
//               </button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default UsersList;


import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface User {
  _id: string;
  login: string;
  name?: string;
  createdAt: string;
}

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError(t('users_list_toast_load_error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setNewPassword('');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      await api.patch(`/admin/users/${selectedUser._id}/password`, { newPassword });
      toast.success(t('users_list_toast_update_success'));
      setIsModalOpen(false);
    } catch (err) {
      toast.error(t('users_list_toast_update_error'));
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-danger bg-red-100 rounded-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-darkText">{t('users_list_title')}</h1>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('users_list_search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-dark-card text-darkText border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
          />
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="p-4 bg-dark-card border rounded-lg shadow-sm border-borderColor">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-darkText">
            <thead className="bg-dark-hover">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('table_header_name')}</th>
                <th className="px-4 py-3 font-semibold">{t('table_header_login')}</th>
                <th className="px-4 py-3 font-semibold">{t('table_header_date')}</th>
                <th className="px-4 py-3 font-semibold text-center">{t('table_header_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-dark-hover transition-colors duration-200">
                  <td className="px-4 py-3 font-medium">{user.name || t('not_available')}</td>
                  <td className="px-4 py-3">{user.login}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openEditModal(user)} className="text-primary hover:text-primaryDark transition-transform duration-200 ease-in-out hover:scale-110" title={t('action_edit')}>
                      <FiEdit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('users_list_edit_password_title', { login: selectedUser?.login })}>
        {selectedUser && (
          <form onSubmit={handlePasswordUpdate}>
            <div className="p-1">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-darkText">{t('users_list_new_password_label')}</label>
              <input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-gray-700 text-white border-borderColor focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
                required
              />
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-borderColor">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 mr-3 font-semibold rounded-md text-white bg-danger hover:bg-red-700 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
                {t('action_reject')}
              </button>
              <button type="submit" disabled={isUpdating} className="px-4 py-2 font-bold text-white rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
                {isUpdating ? <Spinner /> : t('action_update')}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UsersList;