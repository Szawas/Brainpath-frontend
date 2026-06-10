<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
      <div class="flex items-center gap-8">
        <RouterLink to="/admin/resources" class="flex items-center gap-2.5" @click="isDrawerOpen = false">
          <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
          <span class="text-lg font-extrabold tracking-tight text-slate-950">Brainpath</span>
        </RouterLink>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Admin navigation">
          <RouterLink
            v-for="item in menu"
            :key="item.label"
            :to="item.to"
            class="rounded-xl px-3.5 py-2 text-sm font-medium transition"
            :class="
              isActive(item.to)
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
            "
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <!-- Notification Bell Widget -->
        <div class="relative">
          <button
            @click="isNotificationOpen = !isNotificationOpen"
            class="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            aria-label="Notifikasi Laporan Video"
          >
            <Bell class="h-5 w-5" />
            
            <!-- Red Pulse Badge for Active Reports -->
            <span v-if="activeReportsCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[9px] font-black text-white items-center justify-center">
                {{ activeReportsCount }}
              </span>
            </span>
          </button>

          <!-- Notification Dropdown Menu -->
          <div
            v-if="isNotificationOpen"
            class="absolute right-0 mt-2.5 z-50 w-80 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-xl p-4 animate-fadeIn"
          >
            <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">Laporan Video Kendala</h4>
              <span class="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-600">
                {{ activeReportsCount }} Masalah
              </span>
            </div>

            <!-- Notification Items List -->
            <div class="max-h-60 overflow-y-auto space-y-2.5 scrollbar-thin">
              <div
                v-for="report in resourceStore.videoReports"
                :key="report.id"
                class="flex flex-col gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 hover:bg-slate-100/50 transition duration-150"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="truncate text-xs font-black text-slate-950">{{ report.courseTitle }}</p>
                    <p class="text-[10px] font-bold text-rose-600 mt-0.5">{{ report.issueType }}</p>
                  </div>
                  
                  <div class="flex gap-1.5 shrink-0">
                    <!-- Quick action edit -->
                    <button
                      @click="quickEditCourse(report.courseId)"
                      class="rounded-lg p-1 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition"
                      title="Perbaiki Link Video"
                    >
                      <Pencil class="h-3.5 w-3.5" />
                    </button>
                    <!-- Quick action complete -->
                    <button
                      @click="completeReport(report.id)"
                      class="rounded-lg p-1 bg-white border border-slate-200 text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 transition"
                      title="Tandai Masalah Selesai"
                    >
                      <Check class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                
                <p v-if="report.details" class="text-[10px] text-slate-500 font-medium leading-relaxed italic bg-white p-2 rounded-lg border border-slate-100">
                  "{{ report.details }}"
                </p>
                <p class="text-[8px] text-slate-400 font-bold text-right">{{ formatRelativeTime(report.reportedAt) }}</p>
              </div>

              <!-- Empty State in Dropdown -->
              <div v-if="activeReportsCount === 0" class="flex flex-col items-center justify-center py-6 text-center">
                <span class="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                  <Check class="h-5 w-5" />
                </span>
                <p class="text-xs font-black text-slate-950">Semua video aman!</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">Belum ada laporan kendala dari user.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Nav Right -->
        <div class="hidden items-center gap-4 sm:flex">
          <RouterLink
            to="/dashboard"
            class="text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            Kembali ke App
          </RouterLink>
          <button
            class="text-sm font-medium text-red-500 transition hover:text-red-700"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>

        <span
          class="hidden h-10 w-10 overflow-hidden place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-sm sm:grid ring-2 ring-slate-100"
          aria-label="Admin avatar"
        >
          <img 
            v-if="authStore.user?.avatar" 
            :src="authStore.user.avatar" 
            alt="Admin"
            class="h-full w-full object-cover" 
          />
          <span v-else>{{ authStore.user?.name?.charAt(0) || 'A' }}</span>
        </span>

        <!-- Hamburger Toggle Button for Mobile Navigation -->
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
          @click="isDrawerOpen = !isDrawerOpen"
          aria-label="Buka menu navigasi"
        >
          <Menu class="h-5 w-5 animate-scaleIn" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer Teleported to Body to Escape Parent CSS Stacking Contexts -->
    <Teleport to="body">
      <!-- Mobile Navigation Drawer Overlay -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDrawerOpen"
          class="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm md:hidden"
          @click="isDrawerOpen = false"
        />
      </Transition>

      <!-- Mobile Navigation Drawer Panel -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isDrawerOpen"
          class="fixed inset-y-0 right-0 z-[110] flex h-full w-72 max-w-sm flex-col justify-between border-l border-slate-200 bg-white p-6 shadow-2xl md:hidden"
        >
          <div class="space-y-6">
            <!-- Independent Drawer Header with Logo and Close button -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div class="flex items-center gap-2.5">
                <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
                <span class="text-base font-extrabold tracking-tight text-slate-950">Brainpath</span>
              </div>
              <button
                type="button"
                class="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
                @click="isDrawerOpen = false"
                aria-label="Tutup menu navigasi"
              >
                <X class="h-4.5 w-4.5" />
              </button>
            </div>

            <div>
              <p class="text-xs font-black uppercase tracking-wider text-slate-400">Admin Navigation</p>
              <nav class="mt-4 flex flex-col gap-2">
                <RouterLink
                  v-for="item in menu"
                  :key="item.label"
                  :to="item.to"
                  class="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all"
                  :class="
                    isActive(item.to)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  "
                  @click="isDrawerOpen = false"
                >
                  <span>{{ item.label }}</span>
                  <ChevronRight class="h-4 w-4 opacity-50" />
                </RouterLink>
              </nav>
            </div>

            <hr class="border-slate-100" />

            <div>
              <p class="text-xs font-black uppercase tracking-wider text-slate-400">System Link</p>
              <div class="mt-4 flex flex-col gap-2">
                <RouterLink
                  to="/dashboard"
                  class="flex items-center gap-2.5 rounded-xl border border-slate-100 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition"
                  @click="isDrawerOpen = false"
                >
                  <AppWindow class="h-4 w-4 text-slate-400" />
                  Kembali ke App
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Admin User Profile Info -->
            <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-950 text-xs font-bold text-white shadow-sm ring-2 ring-slate-100">
                <img 
                  v-if="authStore.user?.avatar" 
                  :src="authStore.user.avatar" 
                  alt="Admin"
                  class="h-full w-full object-cover" 
                />
                <span v-else>{{ authStore.user?.name?.charAt(0) || 'A' }}</span>
              </span>
              <div class="min-w-0">
                <p class="truncate text-xs font-black text-slate-950">{{ authStore.user?.name || 'Administrator' }}</p>
                <p class="truncate text-[10px] font-bold text-slate-400 mt-0.5">{{ authStore.user?.email || 'admin@brainpath.dev' }}</p>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 py-3 text-sm font-black text-red-600 transition"
              @click="handleLogoutMobile"
            >
              <LogOut class="h-4 w-4" />
              Keluar Sesi Admin
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useResourceStore } from '@/stores/resourceStore'
import { Menu, X, ChevronRight, LogOut, AppWindow, Bell, Pencil, Check } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const resourceStore = useResourceStore()

const isDrawerOpen = ref(false)
const isNotificationOpen = ref(false)

const activeReportsCount = computed(() => resourceStore.videoReports.length)

function reloadReports() {
  resourceStore.videoReports = JSON.parse(localStorage.getItem('video_reports')) || []
}

onMounted(() => {
  window.addEventListener('new-video-report', reloadReports)
  window.addEventListener('delete-video-report', reloadReports)
})

onUnmounted(() => {
  window.removeEventListener('new-video-report', reloadReports)
  window.removeEventListener('delete-video-report', reloadReports)
})

function completeReport(id) {
  resourceStore.deleteVideoReport(id)
}

function quickEditCourse(courseId) {
  isNotificationOpen.value = false
  router.push({ path: '/admin/resources', query: { edit: courseId } })
}

function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} jam lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const handleLogoutMobile = async () => {
  isDrawerOpen.value = false
  await handleLogout()
}

const menu = [
  { label: 'Resources', to: '/admin/resources' },
  { label: 'Analytics', to: '/admin/analytics' },
  { label: 'Settings', to: '/admin/settings' },
]

const isActive = (path) => route.path === path
</script>
