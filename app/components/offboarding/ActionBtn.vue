<template>
  <button
    @click="$emit('click')"
    :disabled="disabled || loading"
    class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClass"
  >
    <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
    <i v-else :class="iconClass"></i>
    {{ label || defaultLabel }}
  </button>
</template>

<script setup>
const props = defineProps({
  variant:  { type: String,  required: true },
  label:    { type: String,  default: '' },
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])

const MAP = {
  approve:   { icon: 'bi bi-check-circle-fill', label: 'Approve',   cls: 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/25' },
  reject:    { icon: 'bi bi-x-circle-fill',     label: 'Reject',    cls: 'bg-red-100 hover:bg-red-200 text-red-600' },
  authorize: { icon: 'bi bi-patch-check-fill',  label: 'Authorize', cls: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25' },
  process:   { icon: 'bi bi-clipboard-check',   label: 'Process',   cls: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25' },
  complete:  { icon: 'bi bi-check2-all',        label: 'Complete',  cls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25' },
  block:     { icon: 'bi bi-slash-circle',      label: 'Block',     cls: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
  unblock:   { icon: 'bi bi-unlock',            label: 'Unlock',    cls: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
}

const variantClass  = computed(() => MAP[props.variant]?.cls  ?? '')
const iconClass     = computed(() => MAP[props.variant]?.icon ?? '')
const defaultLabel  = computed(() => MAP[props.variant]?.label ?? '')
</script>
