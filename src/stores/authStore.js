import { defineStore } from 'pinia';
import api from '@/lib/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    hasRole: (state) => {
      return (role) => state.user?.role === role;
    },
    isAdmin: (state) => state.user?.role === 'admin',
  },
  
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // Asumsikan struktur response: { success: true, data: { user: {...}, token: '...' } }
        const { user, token } = response.data.data;
        
        user.role = user.email === 'admin@brainpath.dev' ? 'admin' : 'user';
        
        this.user = user;
        this.token = token;
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        return user;
      } catch (err) {
        this.error = err.response?.data?.message || 'Terjadi kesalahan saat login';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async register(name, email, password, password_confirmation) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', { 
          name, 
          email, 
          password, 
          password_confirmation 
        });
        
        const { user, token } = response.data.data;
        
        user.role = user.email === 'admin@brainpath.dev' ? 'admin' : 'user';
        
        this.user = user;
        this.token = token;
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        return user;
      } catch (err) {
        this.error = err.response?.data?.message || 'Terjadi kesalahan saat mendaftar';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      try {
        // Coba beritahu backend untuk invalidasi token jika perlu
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Hapus juga mock auth lama untuk berjaga-jaga
        localStorage.removeItem('brainpath_auth');
      }
    },
    
    async fetchUser() {
      // Endpoint /api/me mungkin tidak ada secara eksplisit di api.php, tapi jika ada:
      try {
        const response = await api.get('/me');
        const user = response.data.data;
        user.role = user.email === 'admin@brainpath.dev' ? 'admin' : 'user';
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    }
  }
});
