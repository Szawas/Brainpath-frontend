<template>
  <main class="flex min-h-screen bg-slate-50 text-slate-950">
    <AppSidebar />

    <section class="flex-1 px-5 py-5 md:px-6">
      <div class="mx-auto max-w-5xl">
        <div class="mb-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Profile</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-950">Profil Pengguna</h1>
          <p class="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Ringkasan preferensi belajar dan aktivitas rekomendasi Brainpath.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <BaseCard padding="lg" class="rounded-3xl">
            <div class="flex items-center gap-4">
              <span class="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                {{ authStore.user?.name ? authStore.user.name[0].toUpperCase() : 'U' }}
              </span>
              <div>
                <h2 class="text-lg font-semibold text-slate-950">{{ authStore.user?.name || 'User Brainpath' }}</h2>
                <p class="mt-1 text-sm text-slate-500">{{ authStore.user?.email || 'user@brainpath.dev' }}</p>
              </div>
            </div>

            <div class="mt-6 space-y-3 text-sm">
              <div class="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span class="text-slate-500">Pemahaman IT Awal</span>
                <span class="font-medium text-slate-900">{{ authStore.user?.hasItKnowledge ? 'Sudah Paham' : 'Baru Belajar' }}</span>
              </div>
              <div class="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span class="text-slate-500">Minat terakhir</span>
                <span class="font-medium text-slate-900">{{ authStore.user?.interest || 'Belum diatur' }}</span>
              </div>
              <div class="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span class="text-slate-500">Total rekomendasi</span>
                <span class="font-medium text-slate-900">{{ recommendationStore.recommendations?.length || 0 }} resource</span>
              </div>
            </div>
          </BaseCard>

          <BaseCard padding="lg" class="rounded-3xl">
            <h2 class="text-lg font-semibold text-slate-950">Preferensi Belajar</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              Berikut adalah ringkasan hasil onboarding kamu.
            </p>

            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <div
                v-for="item in preferences"
                :key="item.label"
                class="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ item.label }}</p>
                <p class="mt-2 text-sm font-semibold text-slate-950">{{ item.value }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRecommendationStore } from '@/stores/recommendationStore'

const authStore = useAuthStore()
const recommendationStore = useRecommendationStore()

const preferences = computed(() => [
  { label: 'Tujuan', value: authStore.user?.learningGoal || 'Belum diatur' },
  { label: 'Pengetahuan IT', value: authStore.user?.hasItKnowledge ? 'Sudah Tahu' : 'Belum Tahu' },
  { label: 'Kategori rekomendasi', value: authStore.user?.interest || 'Belum diatur' },
  { label: 'Catatan tambahan', value: authStore.user?.note || 'Tidak ada catatan' },
])
</script>
