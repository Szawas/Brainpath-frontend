import { defineStore } from 'pinia'
import api from '@/lib/api'
import { ref } from 'vue'

export const useChatbotStore = defineStore('chatbot', () => {
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const isChatOpen = ref(false)

  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  const sendMessage = async (question, courseId) => {
    if (!question.trim() || !courseId) return

    // Add user message to UI
    messages.value.push({ role: 'user', content: question })
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/chatbot', {
        message: question,
        course_id: courseId
      })
      
      const answer = response.data?.data?.answer || 'Maaf, terjadi kesalahan saat memproses jawaban.'
      
      // Add AI response to UI
      messages.value.push({ role: 'ai', content: answer })
      
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal terhubung ke layanan Chatbot.'
      messages.value.push({ role: 'ai', content: error.value, isError: true })
    } finally {
      isLoading.value = false
    }
  }

  const clearChat = () => {
    messages.value = []
    error.value = null
  }

  return {
    messages,
    isLoading,
    error,
    isChatOpen,
    sendMessage,
    clearChat,
    toggleChat
  }
})
