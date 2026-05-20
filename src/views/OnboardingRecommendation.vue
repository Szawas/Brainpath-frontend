<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[#f4f8ff] px-5 py-8 text-slate-950 sm:px-6 lg:py-10"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(17,153,238,0.14),rgba(20,184,166,0.10),rgba(134,78,233,0.13))]"
      aria-hidden="true"
    />

    <OnboardingHeader :current="4" />

    <section
      class="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white/95 px-5 py-8 shadow-[0_24px_80px_rgba(32,82,149,0.14)] ring-1 ring-slate-200/80 backdrop-blur sm:px-8 lg:px-12 lg:py-11"
    >
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div
          class="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-[0_20px_50px_rgba(93,111,243,0.28)] sm:p-8"
        >
          <span class="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black">
            Hasil onboarding
          </span>
          <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-4xl">
            Rekomendasi awalmu sudah siap
          </h1>
          <p class="max-w-2xl text-sm font-medium leading-6 text-blue-50 sm:text-base">
            Brainpath memilih beberapa sumber belajar eksternal yang paling relevan berdasarkan
            minat, kebutuhan, dan jawaban onboarding kamu.
          </p>
        </div>

        <aside class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p class="text-sm font-black text-slate-950">Profil rekomendasi</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in profileTags"
              :key="tag"
              class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p class="text-xs font-bold uppercase text-slate-400">Confidence</p>
            <p class="mt-1 text-3xl font-black text-[#5d6ff3]">92%</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              Cocok untuk pengguna yang ingin mulai dari dasar web, latihan langsung, lalu lanjut ke
              framework modern.
            </p>
          </div>
        </aside>
      </div>

      <div class="mt-8 grid gap-4">
        <article
          v-for="resource in recommendations"
          :key="resource.title"
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(37,99,235,0.12)]"
        >
          <div class="gap-5 lg:flex lg:items-start lg:justify-between">
            <div class="flex gap-4">
              <div
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black"
                :class="resource.accent"
              >
                {{ resource.sourceInitial }}
              </div>

              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    {{ resource.type }}
                  </span>
                  <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    Match {{ resource.match }}%
                  </span>
                </div>
                <h3 class="mt-3 text-lg font-black text-slate-950">{{ resource.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ resource.description }}</p>
                <p class="mt-3 text-sm leading-6 text-slate-500">
                  <span class="font-black text-slate-700">Alasan:</span> {{ resource.reason }}
                </p>
              </div>
            </div>

            <a
              :href="resource.url"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#1199ee] to-[#864ee9] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(93,111,243,0.20)] transition group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_38px_rgba(93,111,243,0.28)] lg:mt-0 lg:w-auto"
            >
              Buka sumber
            </a>
          </div>
        </article>
      </div>

      <div
        class="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="font-black text-slate-950">Mau eksplor rekomendasi lain?</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Lanjut ke halaman rekomendasi utama untuk melihat kategori lain dan sumber belajar tambahan.
          </p>
        </div>
        <RouterLink
          to="/recommendation"
          class="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
        >
          Eksplor rekomendasi
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import OnboardingHeader from '@/components/onboarding/OnboardingHeader.vue'

const profileTags = [
  'Pemula',
  'Minat website/aplikasi',
  'Butuh latihan langsung',
  'Target fondasi frontend',
]

const recommendations = [
  {
    title: 'MDN Learn Web Development',
    sourceInitial: 'MDN',
    type: 'Artikel terstruktur',
    match: 96,
    description: 'Panduan belajar web dari dasar sampai konsep inti frontend.',
    reason: 'Cocok untuk memahami konteks web secara bertahap sebelum masuk ke framework.',
    accent: 'bg-blue-100 text-blue-700',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
  },
  {
    title: 'freeCodeCamp Responsive Web Design',
    sourceInitial: 'FCC',
    type: 'Kursus praktik',
    match: 93,
    description: 'Kursus gratis berbasis latihan untuk HTML, CSS, layout responsif, dan proyek kecil.',
    reason: 'Minat membuat website akan lebih cepat berkembang jika langsung dipasangkan latihan.',
    accent: 'bg-emerald-100 text-emerald-700',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
  },
]
</script>
