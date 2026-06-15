<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-10 opacity-0 scale-95"
    >
      <div 
        v-if="chatbotStore.isChatOpen" 
        class="mb-4 flex h-[500px] max-h-[calc(100vh-120px)] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
      >
        <!-- Header -->
        <div class="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
          <div class="flex items-center gap-2">
            <Bot class="h-5 w-5" />
            <div>
              <h3 class="text-sm font-bold">Asisten Belajar AI</h3>
              <p class="text-[10px] text-blue-100">Brainpath Assistant</p>
            </div>
          </div>
          <button @click="chatbotStore.toggleChat" class="rounded-lg p-1 hover:bg-blue-700 transition">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Course Selector -->
        <div class="border-b border-slate-100 bg-slate-50 p-3 shrink-0">
          <select 
            id="course-select-floating" 
            v-model="selectedCourseId"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
            @change="handleCourseChange"
          >
            <option value="" disabled>-- Pilih Kursus Untuk Konteks --</option>
            <option v-for="course in resourceStore.resources" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref="chatContainer">
          <div v-if="chatbotStore.messages.length === 0" class="flex h-full items-center justify-center flex-col text-center opacity-60">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600 mb-3">
              <Bot class="h-6 w-6" />
            </span>
            <p class="text-sm font-semibold text-slate-900">Halo! Saya Asisten AI.</p>
            <p class="text-xs text-slate-500 mt-1 px-4">Pilih kursus di atas dan tanyakan apa saja seputar materi.</p>
          </div>
          
          <div v-for="(msg, index) in chatbotStore.messages" :key="index" :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm',
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : msg.isError 
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
            ]">
              <div v-if="msg.role === 'assistant' || msg.role === 'ai'" class="prose prose-sm prose-blue max-w-none text-xs" v-html="formatMessage(msg.content)"></div>
              <p v-else>{{ msg.content }}</p>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="chatbotStore.isLoading" class="flex justify-start items-end gap-2">
            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-black shadow-sm">
              AI
            </span>
            <div class="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-3 py-2 text-xs flex items-center gap-1.5 shadow-sm">
              <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
              <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
              <span class="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-slate-100 p-3 bg-white shrink-0">
          <form @submit.prevent="sendMessage" class="flex gap-2 relative">
            <input 
              v-model="question" 
              type="text" 
              placeholder="Ketik pertanyaan..." 
              class="flex-1 rounded-xl border border-slate-200 py-2.5 pl-3 pr-10 text-xs focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50 disabled:bg-slate-50"
              :disabled="chatbotStore.isLoading || !selectedCourseId"
            />
            <button 
              type="submit" 
              class="absolute right-1.5 top-1.5 bottom-1.5 grid w-8 place-items-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-sm"
              :disabled="!question.trim() || chatbotStore.isLoading || !selectedCourseId"
            >
              <Send class="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- Floating Bubble Button -->
    <button 
      @click="chatbotStore.toggleChat"
      class="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-95"
      :class="chatbotStore.isChatOpen ? 'rotate-90 scale-90' : 'rotate-0'"
    >
      <X v-if="chatbotStore.isChatOpen" class="h-6 w-6 transition-transform" />
      <MessageSquare v-else class="h-6 w-6 transition-transform" />
      
      <!-- Unread dot indicator (optional logic) -->
      <span v-if="!chatbotStore.isChatOpen && chatbotStore.messages.length > 0 && chatbotStore.messages[chatbotStore.messages.length-1].role !== 'user'" class="absolute right-0 top-0 flex h-3 w-3">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useResourceStore } from '@/stores/resourceStore'
import { Bot, X, MessageSquare, Send } from 'lucide-vue-next'

const chatbotStore = useChatbotStore()
const resourceStore = useResourceStore()

const question = ref('')
const selectedCourseId = ref('')
const chatContainer = ref(null)

onMounted(async () => {
  if (resourceStore.resources.length === 0) {
    await resourceStore.fetchResources()
  }
})

const handleCourseChange = () => {
  chatbotStore.clearChat()
}

const sendMessage = async () => {
  if (!question.value.trim() || !selectedCourseId.value) return
  
  const currentQuestion = question.value
  question.value = ''
  
  await chatbotStore.sendMessage(currentQuestion, selectedCourseId.value)
}

// Auto-scroll to bottom
watch(() => chatbotStore.messages.length, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

watch(() => chatbotStore.isChatOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
})

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const formatMessage = (text) => {
  if (!text) return ''
  return DOMPurify.sanitize(md.render(text))
}
</script>

<style scoped>
/* Customize scrollbar for chat area */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
