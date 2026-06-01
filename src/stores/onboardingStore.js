import { defineStore } from 'pinia';
import api from '@/lib/api';
import { useAuthStore } from './authStore';

const GUEST_RECOMMENDATION_KEY = 'guest_recommendation';

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    hasItKnowledge: null,
    interests: [],
    learningGoal: '',
    note: '',
    guestRecommendation: loadGuestRecommendation(),
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

    buildOnboardingPayload() {
      return {
        has_it_knowledge: this.hasItKnowledge,
        interest: this.interests.join(', '),
        learning_goal: this.learningGoal,
        note: this.note,
      };
    },
    
    async completeOnboarding() {
      this.loading = true;
      this.error = null;
      try {
        const payload = this.buildOnboardingPayload();
        
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
    },

    async getGuestRecommendation() {
      this.loading = true;
      this.error = null;
      try {
        const payload = this.buildOnboardingPayload();
        const response = await api.post('/guest/recommendations', payload);
        const result = response.data?.data || null;

        this.guestRecommendation = result;
        localStorage.setItem(GUEST_RECOMMENDATION_KEY, JSON.stringify(result));

        return result;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat rekomendasi guest';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    hydrateGuestRecommendation() {
      this.guestRecommendation = loadGuestRecommendation();
      return this.guestRecommendation;
    }
  }
});

function loadGuestRecommendation() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_RECOMMENDATION_KEY)) || null;
  } catch {
    localStorage.removeItem(GUEST_RECOMMENDATION_KEY);
    return null;
  }
}
