<template>
  <main class="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-950">
    <AppSidebar v-if="authStore.isAuthenticated" />

    <section class="flex-1 px-5 py-6 md:px-8">
      <RouterLink v-if="!authStore.isAuthenticated" to="/" class="mb-6 inline-flex items-center gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow-sm">
          BP
        </span>
        <span class="text-lg font-black tracking-tight text-slate-950">Brainpath</span>
      </RouterLink>

      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-black uppercase tracking-wide text-blue-600">AI Course Recommender</p>
          <div class="mt-2 flex items-center gap-3">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <Sparkles class="h-5 w-5" />
            </span>
            <h1 class="text-3xl font-black tracking-tight text-slate-950">
              Rekomendasi Kursus Untukmu
            </h1>
          </div>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Berdasarkan minat dan jawaban onboarding kamu
          </p>
        </div>

        <BaseButton to="/onboarding">
          Ulangi Onboarding
        </BaseButton>
      </div>

      <RecommendationFilter
        v-model:active-category="activeCategory"
        v-model:sort-by="sortBy"
        :categories="categories"
        :sort-options="sortOptions"
        class="mb-6"
      />

      <div class="mb-4 flex items-center justify-between gap-4">
        <p class="text-sm font-bold text-slate-500">
          Menampilkan {{ sortedResources.length }} resource eksternal
        </p>
        <p class="text-sm font-bold text-slate-500">
          Filter: <span class="text-blue-700">{{ activeCategory }}</span>
        </p>
      </div>

      <div v-if="isLoading" class="grid gap-4 xl:grid-cols-2">
        <RecommendationSkeleton v-for="n in 4" :key="n" />
      </div>
      <div v-else-if="errorMessage" class="mb-8 flex justify-center py-10 text-red-500 font-medium">
        {{ errorMessage }}
      </div>
      <div v-else>
        <div v-if="sortedResources.length === 0">
          <EmptyState
            title="Belum Ada Rekomendasi"
            :description="emptyStateDescription"
            :icon="Sparkles"
            cta-text="Mulai Onboarding"
            :cta-to="emptyStateCtaTo"
          />
        </div>
        <div v-else>
          <div class="grid gap-4 xl:grid-cols-2">
            <RecommendationCard
              v-for="resource in sortedResources"
              :key="resource.id"
              :resource="resource"
              :show-preview="authStore.isAuthenticated"
            />
          </div>

          <div
            v-if="!authStore.isAuthenticated"
            class="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-black text-slate-950">Simpan progres belajarmu?</h2>
                <p class="mt-1 text-sm font-medium leading-6 text-slate-500">
                  Login atau daftar untuk menyimpan rekomendasi, progress kursus, dan riwayat belajar.
                </p>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row">
                <BaseButton to="/login" variant="secondary">Login</BaseButton>
                <BaseButton to="/register">Register</BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import RecommendationCard from '@/components/recommendation/RecommendationCard.vue'
import RecommendationSkeleton from '@/components/recommendation/RecommendationSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import RecommendationFilter from '@/components/recommendation/RecommendationFilter.vue'
import { useRecommendationStore } from '@/stores/recommendationStore'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuthStore } from '@/stores/authStore'
import { mapRecommendationPayload } from '@/utils/recommendationMapper'
import { Sparkles } from 'lucide-vue-next'

const recommendationStore = useRecommendationStore()
const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()

const categories = ['Semua', 'Frontend', 'Backend', 'Data', 'AI', 'Cybersecurity']

// Map UI filter labels to actual DB category slugs
const categorySlugMap = {
  'Frontend': 'web-development',
  'Backend': 'web-development',
  'Data': 'data-science',
  'AI': 'data-science',
  'Cybersecurity': 'cybersecurity',
}

const sortOptions = [
  { label: 'Paling Relevan', value: 'relevance' },
  { label: 'Pemula', value: 'beginner' },
  { label: 'Durasi Singkat', value: 'short' },
]

const activeCategory = ref('Semua')
const sortBy = ref('relevance')

const guestResources = computed(() => mapRecommendationPayload(onboardingStore.guestRecommendation))

const currentResources = computed(() => {
  if (authStore.isAuthenticated) {
    return recommendationStore.recommendations || []
  }

  return guestResources.value
})

const isLoading = computed(() => {
  return authStore.isAuthenticated ? recommendationStore.loading : onboardingStore.loading
})

const errorMessage = computed(() => {
  return authStore.isAuthenticated ? recommendationStore.error : onboardingStore.error
})

const emptyStateDescription = computed(() => {
  if (authStore.isAuthenticated) {
    return 'Kamu belum mengatur minat atau mengisi form onboarding. Yuk, mulai isi minat belajarmu sekarang!'
  }

  return 'Isi form minat terlebih dahulu agar Brainpath bisa membuat rekomendasi untukmu.'
})

const emptyStateCtaTo = computed(() => {
  return authStore.isAuthenticated ? '/onboarding' : '/interest-form'
})

const filteredResources = computed(() => {
  if (activeCategory.value === 'Semua') return currentResources.value
  const slug = categorySlugMap[activeCategory.value]
  if (!slug) return currentResources.value
  return currentResources.value.filter((resource) => resource.category === slug)
})

const sortedResources = computed(() => {
  const items = [...filteredResources.value]

  if (sortBy.value === 'beginner') {
    return items.sort((a, b) => {
      if (a.level === b.level) return b.relevanceScore - a.relevanceScore
      return a.level === 'Pemula' ? -1 : 1
    })
  }

  if (sortBy.value === 'short') {
    return items.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration))
  }

  return items.sort((a, b) => b.relevanceScore - a.relevanceScore)
})

const parseDuration = (duration) => {
  const hourMatch = duration.match(/(\d+)\s*jam/)
  const minuteMatch = duration.match(/(\d+)\s*menit/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0

  return hours * 60 + minutes
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    recommendationStore.fetchRecommendations()
  } else {
    onboardingStore.hydrateGuestRecommendation()
  }
})
</script>
