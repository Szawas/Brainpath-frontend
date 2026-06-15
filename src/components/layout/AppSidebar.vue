<template>
  <!-- Mobile Header (Sticky at top of mobile viewport) -->
  <header class="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
    <RouterLink
      :to="brandTo"
      class="flex items-center gap-2"
    >
      <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
      <span class="text-sm font-extrabold tracking-tight text-blue-700">{{ brand }}</span>
    </RouterLink>

    <button
      type="button"
      class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none"
      @click="isOpen = true"
      aria-label="Buka menu navigasi"
    >
      <Menu class="h-5 w-5" />
    </button>
  </header>

  <!-- Mobile Navigation Drawer Teleported to Body to Escape Parent CSS Stacking Contexts -->
  <Teleport to="body">
    <!-- Mobile Drawer Backdrop Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm md:hidden"
        @click="isOpen = false"
      />
    </Transition>

    <!-- Mobile Sidebar Drawer Container (Slides from the RIGHT) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isOpen"
        class="fixed inset-y-0 right-0 z-[110] flex h-full w-[270px] max-w-xs flex-col border-l border-slate-200 bg-white p-6 shadow-2xl md:hidden"
      >
        <!-- Drawer Brand Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <RouterLink
            to="/dashboard"
            class="flex items-center gap-2.5"
            @click="isOpen = false"
          >
            <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
            <span class="text-base font-extrabold tracking-tight text-blue-700">{{ brand }}</span>
          </RouterLink>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            @click="isOpen = false"
            aria-label="Tutup menu navigasi"
          >
            <X class="h-4.5 w-4.5" />
          </button>
        </div>

        <!-- Drawer Navigation Links -->
        <nav class="min-h-0 flex-1 overflow-y-auto px-1 py-2">
          <RouterLink
            v-for="item in items"
            :key="item.path"
            :to="item.path"
            class="mb-2 flex h-10 items-center justify-between rounded-xl px-4 text-xs font-bold transition-all"
            :class="
              isActive(item)
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            "
            @click="isOpen = false"
          >
            <div class="flex items-center gap-3">
              <component :is="icons[item.icon]" class="h-4.5 w-4.5 shrink-0" />
              <span>{{ item.label }}</span>
            </div>
            <ChevronRight class="h-3.5 w-3.5 opacity-50" v-if="!isActive(item)" />
          </RouterLink>
        </nav>

        <!-- Drawer Footer Actions -->
        <div class="shrink-0 border-t border-slate-100 pt-4 space-y-3">
          <RouterLink
            v-if="canAccessAdmin"
            to="/admin/resources"
            class="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white text-xs font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
            @click="isOpen = false"
          >
            <component :is="icons.admin" class="h-4.5 w-4.5" />
            Admin Resource
          </RouterLink>

          <!-- User Profile Info in Mobile Drawer -->
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <span class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-600 text-xs font-black text-white shadow-sm ring-2 ring-blue-50">
              <img 
                v-if="authStore.user?.avatar" 
                :src="authStore.user.avatar" 
                alt="Foto Profil"
                class="h-full w-full object-cover" 
              />
              <span v-else>{{ authStore.user?.name ? authStore.user.name[0].toUpperCase() : 'U' }}</span>
            </span>
            <div class="min-w-0">
              <p class="truncate text-xs font-black text-slate-950">{{ authStore.user?.name || 'User Brainpath' }}</p>
              <p class="truncate text-[10px] font-bold text-slate-400 mt-0.5">{{ authStore.user?.email || 'user@brainpath.dev' }}</p>
            </div>
          </div>

          <button
            type="button"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
            @click="handleLogoutMobile"
          >
            <component :is="icons.logout" class="h-4.5 w-4.5" />
            Logout
          </button>

          <button 
            v-if="helperTitle || helperText" 
            type="button"
            class="block w-full text-left rounded-2xl bg-blue-50 px-4 py-3 transition hover:bg-blue-100"
            @click="handleChatToggleMobile"
          >
            <div class="flex items-center gap-2">
              <component :is="icons.chat" class="h-4.5 w-4.5 text-blue-700" />
              <p class="text-xs font-extrabold text-blue-700">{{ helperTitle }}</p>
            </div>
            <p class="mt-1 text-[11px] leading-4 text-slate-500 font-medium">
              {{ helperText }}
            </p>
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>

  <!-- Desktop Aside Sidebar (Hidden on mobile) -->
  <aside class="sticky top-0 hidden h-screen w-[224px] shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
    <RouterLink
      :to="brandTo"
      class="flex h-14 items-center gap-2.5 border-b border-slate-200 px-4"
    >
      <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
      <span class="text-base font-extrabold tracking-tight text-blue-700">{{ brand }}</span>
    </RouterLink>

    <nav class="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
      <RouterLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="mb-1.5 flex h-9 items-center gap-2.5 rounded-[11px] px-2.5 text-xs font-bold transition"
        :class="
          isActive(item)
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        "
      >
        <component :is="icons[item.icon]" class="h-4 w-4 shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="shrink-0 border-t border-slate-200 px-2.5 py-2.5">
      <RouterLink
        v-if="canAccessAdmin"
        to="/admin/resources"
        class="mb-2 flex h-9 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white text-xs font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
      >
        <component :is="icons.admin" class="h-4 w-4" />
        Admin Resource
      </RouterLink>

      <button
        type="button"
        class="mb-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
        @click="handleLogout"
      >
        <component :is="icons.logout" class="h-4 w-4" />
        Logout
      </button>

      <button 
        v-if="helperTitle || helperText" 
        type="button"
        class="block w-full text-left rounded-2xl bg-blue-50 px-3 py-2.5 transition hover:bg-blue-100"
        @click="chatbotStore.toggleChat"
      >
        <div class="flex items-center gap-2">
          <component :is="icons.chat" class="h-4 w-4 text-blue-700" />
          <p class="text-xs font-extrabold text-blue-700">{{ helperTitle }}</p>
        </div>
        <p class="mt-1 text-[11px] leading-4 text-slate-500">
          {{ helperText }}
        </p>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { h, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useChatbotStore } from '@/stores/chatbotStore'
import { Menu, X, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatbotStore = useChatbotStore()

const canAccessAdmin = computed(() => authStore.isAdmin)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const handleLogoutMobile = async () => {
  isOpen.value = false
  await handleLogout()
}

const handleChatToggleMobile = () => {
  isOpen.value = false
  chatbotStore.toggleChat()
}

const isOpen = ref(false)

watch(() => route.path, () => {
  isOpen.value = false
})

defineProps({
  brand: {
    type: String,
    default: 'Brainpath',
  },
  brandTo: {
    type: [String, Object],
    default: '/dashboard',
  },
  items: {
    type: Array,
    default: () => [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', match: ['/dashboard'] },
      { label: 'Recommendation', path: '/recommendation', icon: 'sparkle', match: ['/recommendation'] },
      { label: 'Riwayat', path: '/history', icon: 'progress', match: ['/history'] },
      { label: 'Profile', path: '/profile', icon: 'profile', match: ['/profile'] },
    ],
  },
  helperTitle: {
    type: String,
    default: 'Tanya AI',
  },
  helperText: {
    type: String,
    default: 'Asisten belajar siap membantu memilih resource yang cocok.',
  },
})

const isActive = (item) => item.match.some((path) => route.path.startsWith(path))

const createIcon = (paths) =>
  ({
    render() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.9,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        paths.map((attrs) => h(attrs.tag ?? 'path', attrs)),
      )
    },
  })

const icons = {
  dashboard: createIcon([
    { tag: 'rect', x: 4, y: 4, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 14, y: 4, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 4, y: 14, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 14, y: 14, width: 6, height: 6, rx: 1 },
  ]),
  courses: createIcon([
    { d: 'M4 5.5h7a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H4z' },
    { d: 'M20 5.5h-7a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3h7z' },
  ]),
  sparkle: createIcon([
    { d: 'M12 3l1.35 4.15L17.5 8.5l-4.15 1.35L12 14l-1.35-4.15L6.5 8.5l4.15-1.35z' },
    { d: 'M18 13l.75 2.25L21 16l-2.25.75L18 19l-.75-2.25L15 16l2.25-.75z' },
    { d: 'M5.5 13.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z' },
  ]),
  progress: createIcon([
    { d: 'M5 19V9' },
    { d: 'M12 19V5' },
    { d: 'M19 19v-7' },
    { d: 'M4 19h16' },
  ]),
  profile: createIcon([
    { tag: 'circle', cx: 12, cy: 8, r: 3.25 },
    { d: 'M6.5 19a5.5 5.5 0 0 1 11 0' },
  ]),
  admin: createIcon([
    { tag: 'rect', x: 4, y: 4, width: 16, height: 16, rx: 3 },
    { d: 'M8 9h8' },
    { d: 'M8 13h5' },
    { d: 'M8 17h8' },
  ]),
  chat: createIcon([
    { d: 'M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-4 4v-4.2A3.5 3.5 0 0 1 5 11.5z' },
    { d: 'M9 8h6' },
    { d: 'M9 11h4' },
  ]),
  logout: createIcon([
    { d: 'M10 17l5-5-5-5' },
    { d: 'M15 12H3' },
    { d: 'M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4' },
  ]),
}
</script>
