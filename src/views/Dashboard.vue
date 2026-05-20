<template>
  <main class="flex min-h-screen bg-[#f4f8ff] text-slate-950">
    <AppSidebar />

    <section class="flex-1 px-5 py-6 md:px-8">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-black text-[#5d6ff3]">Dashboard</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Halo, siap eksplor belajar apa hari ini?
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Brainpath membantu kamu menemukan sumber belajar IT eksternal yang paling relevan,
            bukan menyimpan materi belajar di dalam aplikasi.
          </p>
        </div>

        <RouterLink
          to="/onboarding"
          class="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#1199ee] to-[#864ee9] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(93,111,243,0.22)] transition hover:-translate-y-0.5"
        >
          Perbarui onboarding
        </RouterLink>
      </div>

      <div class="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section
          class="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-[0_20px_50px_rgba(93,111,243,0.24)]"
        >
          <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black">
            Rekomendasi utama
          </span>
          <h2 class="mt-4 max-w-2xl text-2xl font-black">
            Mulai dari Frontend Foundations untuk membangun fondasi web yang rapi.
          </h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
            Berdasarkan minat website/aplikasi dan kebutuhan praktik langsung, Brainpath
            merekomendasikan kombinasi artikel, kursus praktik, dan roadmap.
          </p>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/recommendation"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              Lihat rekomendasi
            </RouterLink>
            <RouterLink
              to="/onboarding-recommendation"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/25 transition hover:bg-white/15"
            >
              Hasil onboarding
            </RouterLink>
          </div>
        </section>

        <aside class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-black text-slate-950">Profil rekomendasi</p>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Aktif
            </span>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in profileTags"
              :key="tag"
              class="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
            >
              {{ tag }}
            </span>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-3 text-center">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <p class="text-xl font-black text-slate-950">{{ stat.value }}</p>
              <p class="mt-1 text-xs font-bold text-slate-500">{{ stat.label }}</p>
            </div>
          </div>
        </aside>
      </div>

      <section class="mb-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-950">Rekomendasi terbaru</h2>
            <p class="mt-1 text-sm text-slate-500">
              Sumber belajar eksternal yang paling cocok untuk profil kamu saat ini.
            </p>
          </div>
          <RouterLink to="/recommendation" class="text-sm font-black text-blue-600 hover:text-violet-600">
            Lihat semua
          </RouterLink>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <article
            v-for="resource in featuredResources"
            :key="resource.title"
            class="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(37,99,235,0.12)]"
          >
            <div
              class="grid h-12 w-12 place-items-center rounded-2xl text-sm font-black"
              :class="resource.accent"
            >
              {{ resource.sourceInitial }}
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {{ resource.type }}
              </span>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Match {{ resource.match }}%
              </span>
            </div>
            <h3 class="mt-3 text-lg font-black text-slate-950">{{ resource.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ resource.description }}</p>
            <a
              :href="resource.url"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition group-hover:bg-blue-600"
            >
              Buka sumber
            </a>
          </article>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-black text-slate-950">Kategori yang bisa dieksplor</h2>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <RouterLink
              v-for="category in categories"
              :key="category.label"
              to="/recommendation"
              class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <p class="text-sm font-black">{{ category.label }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-500">{{ category.count }} sumber</p>
            </RouterLink>
          </div>
        </div>

        <div class="rounded-3xl border border-blue-100 bg-blue-50 p-5">
          <h2 class="text-lg font-black text-slate-950">Cara pakai Brainpath setelah onboarding</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div
              v-for="step in nextSteps"
              :key="step.title"
              class="rounded-2xl bg-white p-4 ring-1 ring-blue-100"
            >
              <p class="text-sm font-black text-blue-700">{{ step.title }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'

const profileTags = ['Pemula', 'Frontend', 'Latihan langsung', 'Butuh roadmap']

const stats = [
  { label: 'Sumber', value: 6 },
  { label: 'Match', value: '92%' },
  { label: 'Kategori', value: 4 },
]

const featuredResources = [
  {
    title: 'MDN Learn Web Development',
    sourceInitial: 'MDN',
    type: 'Artikel',
    match: 96,
    description: 'Panduan web dasar sampai konsep inti frontend dari dokumentasi MDN.',
    accent: 'bg-blue-100 text-blue-700',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
  },
  {
    title: 'freeCodeCamp Responsive Web Design',
    sourceInitial: 'FCC',
    type: 'Kursus',
    match: 93,
    description: 'Latihan gratis untuk HTML, CSS, layout responsif, dan proyek kecil.',
    accent: 'bg-emerald-100 text-emerald-700',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
  },
  {
    title: 'Frontend Developer Roadmap',
    sourceInitial: 'MAP',
    type: 'Roadmap',
    match: 84,
    description: 'Peta urutan topik frontend agar belajar lebih terarah.',
    accent: 'bg-amber-100 text-amber-700',
    url: 'https://roadmap.sh/frontend',
  },
]

const categories = [
  { label: 'Frontend', count: 3 },
  { label: 'Data', count: 1 },
  { label: 'AI', count: 1 },
  { label: 'Karier', count: 1 },
]

const nextSteps = [
  {
    title: '1. Pilih sumber',
    description: 'Buka rekomendasi yang match-nya paling tinggi untuk mulai dari jalur paling aman.',
  },
  {
    title: '2. Bandingkan',
    description: 'Cek kategori lain jika kamu ingin melihat alternatif di data, AI, atau karier.',
  },
  {
    title: '3. Perbarui minat',
    description: 'Ulangi onboarding saat tujuan belajarmu berubah agar rekomendasi ikut menyesuaikan.',
  },
]
</script>
