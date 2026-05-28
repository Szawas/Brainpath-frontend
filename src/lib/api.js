import axios from 'axios';

// Konfigurasi axios instance untuk API backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Disesuaikan dengan URL lokal backend Anda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menyisipkan token pada setiap request (jika ada token)
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error respons secara global
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika 401 Unauthorized, mungkin token expired atau tidak valid
    if (error.response && error.response.status === 401) {
      // Hapus data auth dari localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Jika tidak di halaman login, redirect ke login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Utility untuk konversi format data dari API (snake_case) ke Frontend (camelCase)
 * Berguna jika backend mengirim field seperti `relevance_score` dan frontend
 * mengharapkan `relevanceScore`.
 */
export const snakeToCamel = (str) => {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const convertKeysToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  const camelObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      camelObj[camelKey] = convertKeysToCamelCase(obj[key]);
    }
  }
  
  return camelObj;
};

export default api;
