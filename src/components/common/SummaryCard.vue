<template>
  <BaseCard :selected="highlight" :interactive="interactive" padding="lg" class="group h-full min-h-[160px] transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-default hover:border-blue-300 relative bg-white">
    <div class="flex h-full flex-col">
      <IconBox
        v-if="icon"
        :icon="icon"
        :color="iconColor"
        size="xl"
        class="transition-transform duration-500 group-hover:scale-110 group-hover:shadow-md"
      />

      <div class="mt-5">
        <p v-if="eyebrow" class="text-sm font-black uppercase tracking-wide text-blue-600">
          {{ eyebrow }}
        </p>
        <h3 class="text-xl font-black leading-7 text-slate-950 transition-colors duration-300 group-hover:text-blue-700">{{ title }}</h3>
        
        <div 
          v-if="description" 
          class="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          :class="interactive ? 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-3' : 'grid-rows-[1fr] opacity-100 mt-3'"
        >
          <div class="overflow-hidden">
            <p class="text-sm font-medium leading-relaxed text-slate-500">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="value || $slots.footer" class="mt-4 flex items-end justify-between gap-3">
      <p v-if="value" class="text-2xl font-black text-slate-950">{{ value }}</p>
      <slot name="footer" />
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
import IconBox from '@/components/common/IconBox.vue'

defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconColor: {
    type: String,
    default: 'blue',
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: false,
  },
})
</script>
