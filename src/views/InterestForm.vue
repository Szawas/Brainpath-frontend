<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f4f8ff] px-5 py-8 text-slate-950 sm:px-6 lg:py-10"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(17,153,238,0.14),rgba(245,158,11,0.10),rgba(134,78,233,0.12))]"
      aria-hidden="true"
    />

    <OnboardingHeader :current="3" />

    <section
      class="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white/95 px-5 py-8 shadow-[0_24px_80px_rgba(32,82,149,0.14)] ring-1 ring-slate-200/80 backdrop-blur sm:px-8 lg:px-12 lg:py-11"
    >
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span
            class="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700"
          >
            Langkah 3
          </span>
          <h1 class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Apa yang bikin kamu penasaran?
          </h1>
          <p class="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
            Pilih satu atau lebih minat. Kombinasi pilihanmu akan membentuk rekomendasi kursus yang lebih personal.
          </p>
        </div>

        <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
          Terpilih: <span class="text-[#5d6ff3]">{{ selectedInterests.length }}</span>
        </div>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="interest in interests"
          :key="interest.label"
          type="button"
          class="group flex min-h-[142px] flex-col justify-between rounded-2xl border bg-white px-5 py-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(37,99,235,0.12)]"
          :class="
            selectedInterests.includes(interest.label)
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
              : 'border-slate-200 hover:border-blue-300'
          "
          @click="toggleInterest(interest.label)"
        >
          <span
            class="grid h-11 w-11 place-items-center rounded-2xl text-sm font-black transition group-hover:scale-105"
            :class="interest.accent"
          >
            {{ interest.initial }}
          </span>
          <span class="mt-5 block text-sm font-black leading-5 text-slate-950">
            {{ interest.label }}
          </span>
        </button>
      </div>

      <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <label for="learning-goal" class="mb-2 block text-sm font-black text-slate-950">
          Tujuan belajar
        </label>
        <select
          id="learning-goal"
          v-model="learningGoal"
          class="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option v-for="goal in goals" :key="goal" :value="goal">{{ goal }}</option>
        </select>
      </div>

      <RouterLink
        to="/onboarding-recommendation"
        class="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1199ee] to-[#864ee9] text-sm font-black text-white shadow-[0_14px_30px_rgba(93,111,243,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(93,111,243,0.30)]"
      >
        Lihat Rekomendasi
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import OnboardingHeader from '@/components/onboarding/OnboardingHeader.vue'

const interests = [
  { label: 'Desain & Visual', initial: 'DV', accent: 'bg-rose-100 text-rose-700' },
  { label: 'Membuat Website/Aplikasi', initial: 'WA', accent: 'bg-blue-100 text-blue-700' },
  { label: 'Logika & Problem Solving', initial: 'LP', accent: 'bg-violet-100 text-violet-700' },
  { label: 'Data & Analisis', initial: 'DA', accent: 'bg-emerald-100 text-emerald-700' },
  { label: 'AI & Teknologi Baru', initial: 'AI', accent: 'bg-amber-100 text-amber-700' },
]

const goals = [
  'Mencari pekerjaan IT',
  'Membangun project pribadi',
  'Upgrade skill',
  'Sekadar penasaran',
]

const selectedInterests = ref([])
const learningGoal = ref(goals[0])

const toggleInterest = (label) => {
  if (selectedInterests.value.includes(label)) {
    selectedInterests.value = selectedInterests.value.filter((item) => item !== label)
    return
  }

  selectedInterests.value = [...selectedInterests.value, label]
}
</script>
