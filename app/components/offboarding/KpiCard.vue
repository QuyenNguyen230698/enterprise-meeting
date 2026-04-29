<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
    <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md" :class="iconBg">
      <i :class="[icon, 'text-white text-lg']"></i>
    </div>
    <div>
      <p class="text-2xl font-bold text-gray-900 leading-none">{{ value }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String,  required: true },
  value: { type: Number,  required: true },
  icon:  { type: String,  required: true },
  color: { type: String,  default: 'violet' },
})

const COLOR_MAP = {
  violet:  'bg-linear-to-br from-violet-500 to-indigo-500 shadow-violet-500/25',
  amber:   'bg-linear-to-br from-amber-500 to-orange-500 shadow-amber-500/25',
  emerald: 'bg-linear-to-br from-emerald-500 to-teal-500 shadow-emerald-500/25',
  red:     'bg-linear-to-br from-red-500 to-pink-500 shadow-red-500/25',
  blue:    'bg-linear-to-br from-blue-500 to-indigo-500 shadow-blue-500/25',
}

const iconBg = computed(() => COLOR_MAP[props.color] ?? COLOR_MAP.violet)
</script>
