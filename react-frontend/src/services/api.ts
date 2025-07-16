import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend manzili
  withCredentials: true, // Cookie'larni so'rovlar bilan birga yuborish
});

// 401 (Unauthorized) xatolikni ushlab, avtomatik logout qilish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar xatolik 401 bo'lsa va biz allaqachon login sahifasida bo'lmasak,
    // foydalanuvchini login sahifasiga yo'naltiramiz.
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;