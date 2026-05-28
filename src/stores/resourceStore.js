import { defineStore } from 'pinia';
import api, { convertKeysToCamelCase } from '@/lib/api';

export const useResourceStore = defineStore('resource', {
  state: () => ({
    resources: [],
    history: [],
    currentResource: null,
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchResources() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/courses');
        this.resources = convertKeysToCamelCase(response.data.data);
        return this.resources;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat daftar resource';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchHistory() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/courses/history');
        this.history = convertKeysToCamelCase(response.data.data);
        return this.history;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat riwayat';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchResourceById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/courses/${id}`);
        this.currentResource = convertKeysToCamelCase(response.data.data);
        return this.currentResource;
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat detail resource';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    async trackProgress(id) {
      try {
        await api.post(`/courses/${id}/progress`, { status: 'in_progress' });
      } catch (err) {
        console.error('Gagal mencatat progres:', err);
      }
    },
    
    async addResource(resourceData) {
      try {
        const payload = {
          title: resourceData.title,
          external_url: resourceData.externalUrl,
          description: resourceData.description,
          category: resourceData.category,
          level: resourceData.level,
          duration_text: resourceData.duration,
          tags: resourceData.tags,
          summary: resourceData.summary,
          learning_points: resourceData.points || resourceData.learningPoints,
        };
        const response = await api.post('/courses', payload);
        const newResource = convertKeysToCamelCase(response.data.data);
        this.resources.unshift(newResource);
        return newResource;
      } catch (err) {
        console.error('Gagal menambah resource:', err);
        throw err;
      }
    },
    
    async updateResource(id, updatedData) {
      try {
        const payload = {
          title: updatedData.title,
          external_url: updatedData.externalUrl,
          description: updatedData.description,
          category: updatedData.category,
          level: updatedData.level,
          duration_text: updatedData.duration,
          tags: updatedData.tags,
          summary: updatedData.summary,
          learning_points: updatedData.points || updatedData.learningPoints,
        };
        const response = await api.put(`/courses/${id}`, payload);
        const updatedResource = convertKeysToCamelCase(response.data.data);
        const index = this.resources.findIndex(r => r.id === id);
        if (index !== -1) {
          this.resources[index] = updatedResource;
        }
        return updatedResource;
      } catch (err) {
        console.error('Gagal update resource:', err);
        throw err;
      }
    },
    
    async deleteResource(id) {
      try {
        await api.delete(`/courses/${id}`);
        this.resources = this.resources.filter(r => r.id !== id);
      } catch (err) {
        console.error('Gagal menghapus resource:', err);
        throw err;
      }
    }
  }
});
