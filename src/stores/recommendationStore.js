import { defineStore } from 'pinia';
import api from '@/lib/api';

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

        // Flatten the nested {course, similarity_score} objects
        // into the flat resource shape expected by RecommendationCard.vue
        this.recommendations = payload.recommendations.map((item) => {
          const course = item.course || {};
          const score = item.similarity_score ?? 0;

          // Parse tags: it could be an array directly, or a JSON string, or a comma string
          let tags = [];
          if (Array.isArray(course.tags)) {
            tags = course.tags;
          } else if (typeof course.tags === 'string') {
            try {
              tags = JSON.parse(course.tags);
            } catch {
              tags = course.tags.split(',').map(t => t.trim()).filter(Boolean);
            }
          }

          // Parse skills for the "reason" text
          const skills = course.skills || '';

          return {
            id: course.id,
            title: course.title || 'Untitled',
            description: course.description || '',
            category: course.category || 'General IT',
            level: course.level || 'Pemula',
            duration: course.duration_text || (course.duration_minutes ? `${course.duration_minutes} menit` : '—'),
            tags,
            externalUrl: course.external_url || '#',
            source: _extractSource(course.external_url),
            relevanceScore: Math.round(score * 100),
            reason: `Direkomendasikan berdasarkan kecocokan konten${skills ? ': ' + skills : ''}.`,
            summary: course.summary || '',
            learningPoints: course.learning_points || '',
          };
        });

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

/** Extract a human-readable source name from a URL */
function _extractSource(url) {
  if (!url) return 'Brainpath';
  try {
    const host = new URL(url).hostname.replace('www.', '');
    const map = {
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'udemy.com': 'Udemy',
      'coursera.org': 'Coursera',
      'freecodecamp.org': 'freeCodeCamp',
      'codecademy.com': 'Codecademy',
      'kaggle.com': 'Kaggle',
    };
    return map[host] || host;
  } catch {
    return 'Brainpath';
  }
}
