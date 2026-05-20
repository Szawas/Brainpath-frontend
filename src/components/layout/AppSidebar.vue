<template>
  <aside class="hidden min-h-screen w-[253px] shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
    <RouterLink
      to="/dashboard"
      class="flex h-[60px] items-center gap-3 border-b border-slate-200 px-5"
    >
      <span
        class="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-sm"
        aria-hidden="true"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.5 4.75a3.25 3.25 0 0 0-3.21 2.76 3.63 3.63 0 0 0-.54 7.1 3.75 3.75 0 0 0 7.25 1.26V7.75a3 3 0 0 0-3.5-3Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.5 4.75a3.25 3.25 0 0 1 3.21 2.76 3.63 3.63 0 0 1 .54 7.1A3.75 3.75 0 0 1 11 15.87V7.75a3 3 0 0 1 3.5-3Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="text-lg font-extrabold tracking-tight text-[#5d6ff3]">Brainpath</span>
    </RouterLink>

    <nav class="flex-1 px-3 pt-7">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="mb-2 flex h-10 items-center gap-3 rounded-[11px] px-3 text-sm font-bold transition"
        :class="
          isActive(item)
            ? 'bg-gradient-to-r from-[#1d8dea] to-[#804fe4] text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        "
      >
        <component :is="icons[item.icon]" class="h-[17px] w-[17px] shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-slate-200 px-3 py-4">
      <div class="rounded-[18px] bg-[#f1ecff] px-4 py-4">
        <p class="text-xs font-extrabold text-[#4c377f]">Tanya AI</p>
        <p class="mt-2 text-xs leading-4 text-slate-500">
          Asisten belajar siap membantu di halaman materi.
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', match: ['/dashboard'] },
  { label: 'Courses', path: '/courses/1', icon: 'courses', match: ['/courses', '/learn'] },
  { label: 'Recommendation', path: '/recommendation', icon: 'sparkle', match: ['/recommendation'] },
  { label: 'Progress', path: '/dashboard', icon: 'progress', match: ['/progress'] },
  { label: 'Profile', path: '/dashboard', icon: 'profile', match: ['/profile'] },
]

const isActive = (item) => item.match.some((path) => route.path.startsWith(path))

const createIcon = (paths) =>
  ({
    render() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.9,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        paths.map((attrs) => h(attrs.tag ?? 'path', attrs)),
      )
    },
  })

const icons = {
  dashboard: createIcon([
    { tag: 'rect', x: 4, y: 4, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 14, y: 4, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 4, y: 14, width: 6, height: 6, rx: 1 },
    { tag: 'rect', x: 14, y: 14, width: 6, height: 6, rx: 1 },
  ]),
  courses: createIcon([
    { d: 'M4 5.5h7a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H4z' },
    { d: 'M20 5.5h-7a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3h7z' },
  ]),
  sparkle: createIcon([
    { d: 'M12 3l1.35 4.15L17.5 8.5l-4.15 1.35L12 14l-1.35-4.15L6.5 8.5l4.15-1.35z' },
    { d: 'M18 13l.75 2.25L21 16l-2.25.75L18 19l-.75-2.25L15 16l2.25-.75z' },
    { d: 'M5.5 13.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z' },
  ]),
  progress: createIcon([
    { d: 'M5 19V9' },
    { d: 'M12 19V5' },
    { d: 'M19 19v-7' },
    { d: 'M4 19h16' },
  ]),
  profile: createIcon([
    { tag: 'circle', cx: 12, cy: 8, r: 3.25 },
    { d: 'M6.5 19a5.5 5.5 0 0 1 11 0' },
  ]),
}
</script>
