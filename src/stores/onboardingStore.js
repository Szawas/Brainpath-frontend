import { defineStore } from 'pinia';
import api from '@/lib/api';
import { useAuthStore } from './authStore';

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    hasItKnowledge: null,
    interests: [],
    learningGoal: '',
    note: '',
    loading: false,
    error: null,
  }),
  
  actions: {
    setKnowledge(value) {
      this.hasItKnowledge = value;
    },
    
    setInterests(interests) {
      this.interests = interests;
    },
    
    setGoalAndNote(goal, note) {
      this.learningGoal = goal;
      this.note = note;
    },
    
    async completeOnboarding() {
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          has_it_knowledge: this.hasItKnowledge,
          interest: this.interests.join(', '), // Ubah array menjadi string, dan gunakan key `interest`
          learning_goal: this.learningGoal,
          note: this.note,
        };
        
        await api.post('/onboarding/complete', payload);
        
        // Asumsi backend mengupdate role/status user atau kita bisa refetch
        const authStore = useAuthStore();
        await authStore.fetchUser(); // untuk sinkronisasi profil jika diperlukan
        
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menyimpan data onboarding';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
