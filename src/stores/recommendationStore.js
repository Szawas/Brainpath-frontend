import { defineStore } from 'pinia';
import api from '@/lib/api';
import { mapRecommendationPayload } from '@/utils/recommendationMapper';

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    recommendations: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchRecommendations() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/recommendations');
        const payload = response.data?.data;

        if (!payload || !payload.recommendations) {
          this.recommendations = [];
          return this.recommendations;
        }

        this.recommendations = mapRecommendationPayload(payload);

        return this.recommendations;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat rekomendasi';
        console.error('fetchRecommendations error:', err);
      } finally {
        this.loading = false;
      }
    }
  }
});
