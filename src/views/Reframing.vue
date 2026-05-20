<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f4f8ff] px-5 py-8 text-slate-950 sm:px-6 lg:py-10"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(17,153,238,0.15),rgba(20,184,166,0.12),rgba(134,78,233,0.12))]"
      aria-hidden="true"
    />

    <OnboardingHeader :current="2" />

    <section
      class="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white/95 px-5 py-8 shadow-[0_24px_80px_rgba(32,82,149,0.14)] ring-1 ring-slate-200/80 backdrop-blur sm:px-8 lg:px-12 lg:py-11"
    >
      <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span
            class="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700"
          >
            Langkah 2
          </span>
          <h1 class="mb-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Yuk, kenali dunia IT dari hal yang paling dekat denganmu.
          </h1>
          <p class="text-sm font-medium leading-6 text-slate-500 sm:text-base">
            Setiap bidang punya cara kerja yang berbeda. Pilih role yang terasa menarik, lalu Brainpath akan bantu mengarahkan langkah belajarmu.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <article
            v-for="role in roles"
            :key="role.title"
            class="group min-h-[156px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(37,99,235,0.12)]"
          >
            <div
              class="mb-4 grid h-11 w-11 place-items-center rounded-2xl text-sm font-black"
              :class="role.accent"
            >
              {{ role.initial }}
            </div>
            <h3 class="mb-2 font-black text-slate-950">{{ role.title }}</h3>
            <p class="text-sm leading-6 text-slate-600">{{ role.description }}</p>
          </article>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm font-semibold text-slate-500">
          Tidak perlu langsung yakin. Mulai dari yang paling bikin penasaran.
        </p>
        <RouterLink
          to="/interest-form"
          class="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1199ee] to-[#864ee9] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(93,111,243,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(93,111,243,0.30)] sm:w-auto"
        >
          Lanjutkan
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import OnboardingHeader from '@/components/onboarding/OnboardingHeader.vue'

const roles = [
  {
    title: 'Frontend Developer',
    initial: 'FE',
    accent: 'bg-blue-100 text-blue-700',
    description: 'Membangun tampilan website dan aplikasi yang digunakan pengguna.',
  },
  {
    title: 'Backend Developer',
    initial: 'BE',
    accent: 'bg-emerald-100 text-emerald-700',
    description: 'Mengelola server, database, dan logika aplikasi.',
  },
  {
    title: 'Data Analyst',
    initial: 'DA',
    accent: 'bg-amber-100 text-amber-700',
    description: 'Mengolah data menjadi informasi untuk pengambilan keputusan.',
  },
  {
    title: 'AI / Machine Learning Engineer',
    initial: 'AI',
    accent: 'bg-violet-100 text-violet-700',
    description: 'Membangun sistem cerdas yang dapat belajar dari data.',
  },
]
</script>
