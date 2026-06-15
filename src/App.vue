<template>
  <RouterView v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
  <FloatingChat v-if="authStore.isAuthenticated" />
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import FloatingChat from '@/components/chat/FloatingChat.vue'

const authStore = useAuthStore()
</script>

<style>
/* Global Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
