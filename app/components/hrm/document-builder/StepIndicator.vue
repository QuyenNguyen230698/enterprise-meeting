<template>
  <div class="flex items-center gap-0">
    <template v-for="(step, idx) in steps" :key="step.id">
      <!-- Step -->
      <button
        @click="emit('go', step.id)"
        :disabled="step.id > maxReached"
        class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
        :class="{
          'text-blue-700 font-bold': current === step.id,
          'text-gray-400 cursor-not-allowed': step.id > maxReached,
          'text-gray-600 hover:text-blue-600 cursor-pointer': step.id <= maxReached && current !== step.id,
        }"
      >
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all"
          :class="{
            'bg-blue-600 text-white shadow-md': current === step.id,
            'bg-green-500 text-white': step.id < current && step.id <= maxReached,
            'bg-gray-200 text-gray-400': step.id > maxReached,
            'bg-gray-300 text-gray-600': step.id <= maxReached && step.id > current,
          }"
        >
          <i v-if="step.id < current" class="bi bi-check text-xs"></i>
          <span v-else>{{ step.id }}</span>
        </div>
        <span class="text-xs font-semibold hidden sm:block whitespace-nowrap">{{ step.label }}</span>
      </button>

      <!-- Connector -->
      <div
        v-if="idx < steps.length - 1"
        class="h-px flex-1 min-w-4 mx-1 transition-colors"
        :class="current > step.id ? 'bg-green-400' : 'bg-gray-200'"
      ></div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  current: { type: Number, default: 1 },
  maxReached: { type: Number, default: 1 },
})
const emit = defineEmits(['go'])

const steps = [
  { id: 1, label: 'Soạn thảo nội dung' },
  { id: 2, label: 'Người ký' },
  { id: 3, label: 'Quy trình duyệt' },
]
</script>
