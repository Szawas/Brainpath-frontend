<template>
  <main class="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-6 lg:py-10">
    <section class="mx-auto max-w-5xl">
      <RouterLink to="/" class="mb-8 inline-flex items-center gap-3">
        <img src="/Logo_BrainPath.png" alt="Brainpath Logo" class="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 object-contain shadow-sm" />
        <span class="text-lg font-black tracking-tight text-slate-950">Brainpath</span>
      </RouterLink>

      <StepProgress :current="1" :labels="steps" />

      <BaseCard padding="lg" class="mt-8 text-center">
        <p class="text-sm font-black uppercase tracking-wide text-blue-600">Langkah 1</p>
        <h1 class="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Apakah kamu sudah memahami dunia IT?
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
          Jawaban ini membantu Brainpath menentukan apakah kamu perlu pengenalan bidang IT dulu
          atau bisa langsung memilih minat belajar.
        </p>

        <div class="mt-9 grid gap-5 md:grid-cols-2">
          <button @click="selectKnowledge(true)" class="block text-left w-full">
            <KnowledgeOptionCard
              :icon="CheckCircle"
              title="Sudah Paham"
              description="Saya sudah familiar dengan dunia IT dan ingin langsung memilih minat."
            />
          </button>

          <button @click="selectKnowledge(false)" class="block text-left w-full">
            <KnowledgeOptionCard
              :icon="HelpCircle"
              title="Belum Paham"
              description="Saya ingin melihat gambaran singkat bidang-bidang IT terlebih dahulu."
            />
          </button>
        </div>
      </BaseCard>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import StepProgress from '@/components/common/StepProgress.vue'
import KnowledgeOptionCard from '@/components/onboarding/KnowledgeOptionCard.vue'
import { CheckCircle, HelpCircle } from 'lucide-vue-next'
import { useOnboardingStore } from '@/stores/onboardingStore'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const steps = ['Pemahaman IT', 'Reframing', 'Minat']

const selectKnowledge = (hasKnowledge) => {
  onboardingStore.setKnowledge(hasKnowledge)
  if (hasKnowledge) {
    router.push('/interest-form')
  } else {
    router.push('/reframing')
  }
}
</script>
