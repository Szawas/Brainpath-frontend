<template>
  <button
    class="group h-full min-h-[190px] rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50 hover:shadow-[0_18px_42px_rgba(37,99,235,0.14)]"
  >
    <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-2xl text-blue-600 transition group-hover:scale-105">
      {{ icon }}
    </div>

    <h3 class="mb-2 text-lg font-bold text-slate-950">{{ title }}</h3>
    <p class="text-sm leading-6 text-slate-600">{{ description }}</p>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '✓',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
