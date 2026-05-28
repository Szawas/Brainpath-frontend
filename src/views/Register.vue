<template>
  <main class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 px-5 py-10 text-slate-950">
    <section class="w-full max-w-md">
      <RouterLink to="/" class="mb-8 flex items-center justify-center gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow-sm">
          BP
        </span>
        <span class="text-xl font-black tracking-tight text-slate-950">Brainpath</span>
      </RouterLink>

      <BaseCard padding="lg" class="shadow-xl shadow-blue-100/70">
        <div class="mb-8 text-center">
          <p class="text-sm font-black uppercase tracking-wide text-blue-600">Daftar</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight">Buat Akun Baru</h1>
          <p class="mt-2 text-sm font-medium leading-6 text-slate-500">
            Dapatkan rekomendasi belajar IT yang dipersonalisasi khusus untukmu.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="handleRegister">
          <div>
            <label for="name" class="mb-2 block text-sm font-bold text-slate-800">Nama Lengkap</label>
            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              required
              class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="mb-2 block text-sm font-bold text-slate-800">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="user@brainpath.dev"
            />
          </div>

          <div>
            <label for="password" class="mb-2 block text-sm font-bold text-slate-800">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <div>
            <label for="password_confirmation" class="mb-2 block text-sm font-bold text-slate-800">Konfirmasi Password</label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              autocomplete="new-password"
              required
              class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Masukkan ulang password"
            />
          </div>

          <BaseButton type="submit" full-width size="lg" :disabled="authStore.loading">
            {{ authStore.loading ? 'Memproses...' : 'Daftar' }}
          </BaseButton>
          
          <div v-if="authStore.error" class="text-sm font-medium text-red-500 text-center">
            {{ authStore.error }}
          </div>
        </form>

        <div class="mt-6 text-center text-sm font-medium text-slate-600">
          Sudah punya akun?
          <RouterLink to="/login" class="text-blue-600 hover:text-blue-700 hover:underline">
            Masuk di sini
          </RouterLink>
        </div>
      </BaseCard>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const authStore = useAuthStore()

const handleRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    authStore.error = 'Konfirmasi password tidak cocok'
    return
  }
  
  try {
    const user = await authStore.register(name.value, email.value, password.value, passwordConfirmation.value)
    // Setelah register, arahkan ke onboarding untuk pengguna baru
    router.push('/onboarding')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
