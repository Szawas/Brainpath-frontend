<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f4f8ff] px-5 py-8 text-slate-950 sm:px-6 lg:py-10"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(17,153,238,0.16),rgba(134,78,233,0.14),rgba(20,184,166,0.10))]"
      aria-hidden="true"
    />

    <OnboardingHeader :current="1" />

    <section
      class="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white/95 px-5 py-8 text-center shadow-[0_24px_80px_rgba(32,82,149,0.14)] ring-1 ring-slate-200/80 backdrop-blur sm:px-8 lg:px-12 lg:py-11"
    >
      <div
        class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"
        aria-hidden="true"
      />

      <span
        class="mb-4 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700"
      >
        Langkah 1
      </span>
      <h1 class="mx-auto mb-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        Apakah kamu sudah memahami dunia IT?
      </h1>
      <p class="mx-auto mb-9 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
        Jawabanmu membantu Brainpath memilih jalur kursus yang paling sesuai dengan ritme dan tujuan belajarmu.
      </p>

      <div class="grid gap-5 md:grid-cols-2">
        <RouterLink to="/interest-form" class="block">
          <KnowledgeOptionCard
            icon="✓"
            title="Sudah Paham"
            description="Saya sudah familiar dengan dunia IT dan ingin langsung memilih minat."
          />
        </RouterLink>

        <RouterLink to="/reframing" class="block">
          <KnowledgeOptionCard
            icon="?"
            title="Belum Paham"
            description="Saya butuh pengenalan singkat tentang bidang-bidang IT terlebih dahulu."
          />
        </RouterLink>
      </div>

      <RouterLink
        to="/dashboard"
        class="mt-8 inline-flex text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        Lewati onboarding →
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import OnboardingHeader from '@/components/onboarding/OnboardingHeader.vue'
import KnowledgeOptionCard from '@/components/onboarding/KnowledgeOptionCard.vue'
</script>
