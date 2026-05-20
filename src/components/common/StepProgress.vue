<template>
  <nav class="mx-auto w-full max-w-5xl overflow-x-auto rounded-full bg-white/60 px-3 py-2 shadow-sm ring-1 ring-slate-200/70 backdrop-blur" aria-label="Progress onboarding">
    <ol class="flex min-w-[560px] items-center">
      <li
        v-for="(label, index) in stepLabels"
        :key="label"
        class="flex flex-1 items-center"
      >
        <div class="flex shrink-0 items-center gap-3">
          <span
            class="grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition"
            :class="
              index + 1 === current
                ? 'bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-sm'
                : index + 1 < current
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-transparent text-slate-500'
            "
          >
            {{ index + 1 }}
          </span>
          <span
            class="whitespace-nowrap text-sm font-bold"
            :class="index + 1 === current ? 'text-[#5d6ff3]' : 'text-slate-600'"
          >
            {{ label }}
          </span>
        </div>

        <span
          v-if="index < stepLabels.length - 1"
          class="mx-6 h-px flex-1 rounded-full"
          :class="index + 1 < current ? 'bg-blue-300' : 'bg-slate-200'"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true,
  },
  labels: {
    type: Array,
    default: () => ['IT Familiarity', 'Reframing', 'Minat', 'Rekomendasi'],
  },
})

const stepLabels = computed(() => props.labels)
</script>
