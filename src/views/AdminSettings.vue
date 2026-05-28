<template>
  <main class="min-h-screen bg-slate-50 text-slate-950">
    <AdminTopNavbar />

    <section class="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div class="mb-7">
        <h1 class="text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Konfigurasi dan preferensi admin Brainpath.
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <BaseCard padding="lg" class="rounded-3xl">
          <h2 class="text-lg font-semibold text-slate-950">Recommendation Rules</h2>
          <div class="mt-5 space-y-4">
            <label
              v-for="item in rules"
              :key="item"
              class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
            >
              <span class="font-medium text-slate-700">{{ item }}</span>
              <input type="checkbox" checked class="h-4 w-4 accent-blue-600" />
            </label>
          </div>
        </BaseCard>

        <BaseCard padding="lg" class="rounded-3xl">
          <h2 class="text-lg font-semibold text-slate-950">Admin Profile</h2>
          <form class="mt-5 space-y-4" @submit.prevent="handleSaveProfile">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Nama Admin</label>
              <input v-model="profile.name" class="h-10 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input v-model="profile.email" disabled class="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none" />
              <p class="mt-1 text-xs text-slate-500">Email tidak dapat diubah (digunakan untuk login).</p>
            </div>
            
            <div class="pt-4">
              <button type="submit" class="h-10 w-full sm:w-auto rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
          </form>

          <hr class="my-6 border-slate-200" />
          
          <h2 class="text-lg font-semibold text-red-600">Danger Zone</h2>
          <p class="mt-1 text-sm text-slate-500">Aksi ini akan mengeluarkan Anda dari sesi saat ini.</p>
          <div class="mt-4">
            <button @click="handleLogout" class="h-10 w-full sm:w-auto rounded-xl bg-red-100 px-5 text-sm font-semibold text-red-700 hover:bg-red-200">
              Logout Admin
            </button>
          </div>
        </BaseCard>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AdminTopNavbar from '@/components/admin/AdminTopNavbar.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const profile = ref({
  name: authStore.user?.name || 'Admin Brainpath',
  email: authStore.user?.email || 'admin@brainpath.dev'
})

const handleSaveProfile = () => {
  if (authStore.user) {
    authStore.user.name = profile.value.name
    localStorage.setItem('user', JSON.stringify(authStore.user))
    alert('Profil berhasil diperbarui (secara lokal)')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const rules = [
  'Prioritaskan resource pemula',
  'Tampilkan hanya external link aktif',
  'Gunakan AI summary pada preview materi',
]
</script>
