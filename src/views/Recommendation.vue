<template>
  <main class="flex min-h-screen bg-[#f4f8ff] text-slate-950">
    <AppSidebar />

    <section class="flex-1 px-5 py-6 md:px-8">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-black text-[#5d6ff3]">AI Course Recommender</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Eksplor rekomendasi belajar
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Temukan kursus, artikel, dan roadmap eksternal yang dipilih berdasarkan profil minat dan
            kebutuhan belajarmu.
          </p>
        </div>

        <RouterLink
          to="/onboarding"
          class="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-blue-600"
        >
          Ulangi onboarding
        </RouterLink>
      </div>

      <div class="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div
          class="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-[0_20px_50px_rgba(93,111,243,0.24)]"
        >
          <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black">
            Rekomendasi diperbarui
          </span>
          <h2 class="mt-4 text-2xl font-black">Frontend, UI, dan dasar web paling cocok untukmu.</h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
            Gunakan halaman ini sebagai pusat eksplorasi setelah onboarding. Pilih kategori, bandingkan
            sumber belajar, lalu buka platform aslinya.
          </p>
        </div>

        <aside class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-black text-slate-950">Ringkasan profil</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in profileTags"
              :key="tag"
              class="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mt-5 rounded-2xl bg-blue-50 p-4">
            <p class="text-xs font-bold uppercase text-blue-500">Total sumber</p>
            <p class="mt-1 text-3xl font-black text-blue-700">{{ resources.length }}</p>
          </div>
        </aside>
      </div>

      <div class="mb-5 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="shrink-0 rounded-full px-4 py-2 text-sm font-black transition"
          :class="
            category === activeCategory
              ? 'bg-slate-950 text-white shadow-sm'
              : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-blue-600'
          "
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <article
          v-for="resource in filteredResources"
          :key="resource.title"
          class="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_18px_42px_rgba(37,99,235,0.12)]"
        >
          <div class="flex gap-4">
            <div
              class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black"
              :class="resource.accent"
            >
              {{ resource.sourceInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  {{ resource.type }}
                </span>
                <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  Match {{ resource.match }}%
                </span>
              </div>

              <h2 class="mt-3 text-lg font-black text-slate-950">{{ resource.title }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ resource.description }}</p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in resource.tags"
                  :key="tag"
                  class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm font-semibold text-slate-500">{{ resource.reason }}</p>
                <a
                  :href="resource.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#1199ee] to-[#864ee9] px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(93,111,243,0.18)] transition group-hover:-translate-y-0.5"
                >
                  Buka sumber
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const profileTags = ['Pemula', 'Frontend', 'Latihan langsung', 'Butuh roadmap']
const categories = ['Semua', 'Frontend', 'Data', 'AI', 'Karier']
const activeCategory = ref('Semua')

const resources = [
  {
    title: 'MDN Learn Web Development',
    sourceInitial: 'MDN',
    type: 'Artikel',
    category: 'Frontend',
    match: 96,
    description: 'Panduan web dasar sampai konsep inti frontend dari dokumentasi MDN.',
    reason: 'Fondasi paling rapi untuk mulai memahami web.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    accent: 'bg-blue-100 text-blue-700',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
  },
  {
    title: 'freeCodeCamp Responsive Web Design',
    sourceInitial: 'FCC',
    type: 'Kursus',
    category: 'Frontend',
    match: 93,
    description: 'Latihan gratis untuk HTML, CSS, layout responsif, dan proyek kecil.',
    reason: 'Bagus untuk belajar sambil praktik.',
    tags: ['Gratis', 'Project-based'],
    accent: 'bg-emerald-100 text-emerald-700',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
  },
  {
    title: 'Vue.js Official Tutorial',
    sourceInitial: 'VUE',
    type: 'Tutorial',
    category: 'Frontend',
    match: 88,
    description: 'Tutorial resmi interaktif untuk masuk ke framework Vue.',
    reason: 'Langkah lanjutan setelah dasar web terasa nyaman.',
    tags: ['Vue', 'Framework'],
    accent: 'bg-violet-100 text-violet-700',
    url: 'https://vuejs.org/tutorial/',
  },
  {
    title: 'Frontend Developer Roadmap',
    sourceInitial: 'MAP',
    type: 'Roadmap',
    category: 'Karier',
    match: 84,
    description: 'Peta urutan topik frontend agar belajar lebih terarah.',
    reason: 'Membantu memilih prioritas saat sumber belajar terlalu banyak.',
    tags: ['Roadmap', 'Career path'],
    accent: 'bg-amber-100 text-amber-700',
    url: 'https://roadmap.sh/frontend',
  },
  {
    title: 'Kaggle Learn Python',
    sourceInitial: 'KGL',
    type: 'Kursus',
    category: 'Data',
    match: 78,
    description: 'Pengenalan Python singkat untuk pengguna yang tertarik data.',
    reason: 'Cocok sebagai cabang eksplorasi setelah dasar logika.',
    tags: ['Python', 'Data'],
    accent: 'bg-cyan-100 text-cyan-700',
    url: 'https://www.kaggle.com/learn/python',
  },
  {
    title: 'Google Machine Learning Crash Course',
    sourceInitial: 'ML',
    type: 'Kursus',
    category: 'AI',
    match: 74,
    description: 'Materi pengantar machine learning dari Google untuk memahami konsep inti AI.',
    reason: 'Relevan jika kamu mulai penasaran dengan AI dan pembelajaran mesin.',
    tags: ['AI', 'Machine learning'],
    accent: 'bg-rose-100 text-rose-700',
    url: 'https://developers.google.com/machine-learning/crash-course',
  },
]

const filteredResources = computed(() => {
  if (activeCategory.value === 'Semua') return resources
  return resources.filter((resource) => resource.category === activeCategory.value)
})
</script>
