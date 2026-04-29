<template>
  <div class="relative min-w-[120px]" ref="container">
    <button
      @click="toggle"
      :class="[
        'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold bg-white border rounded-lg transition-all',
        isOpen
          ? 'border-gray-900 ring-2 ring-gray-900/10'
          : 'border-gray-300 hover:border-gray-400',
      ]"
    >
      <span class="truncate block">{{ selectedLabel }}</span>
      <i
        class="bi bi-chevron-down text-xs text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-fade-in-up origin-top py-1"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @click="select(option)"
        :class="[
          'w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between',
          modelValue === option.value
            ? 'bg-gray-50 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        ]"
      >
        <span class="truncate">{{ option.label }}</span>
        <i
          v-if="modelValue === option.value"
          class="bi bi-check2 text-gray-900 text-sm"
        ></i>
      </button>
    </div>

    <!-- Overlay to close -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40 bg-transparent cursor-default"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array, // [{ label: '...', value: '...' }]
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select...",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const option = props.options.find((o) => o.value === props.modelValue);
  return option ? option.label : props.placeholder;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const select = (option) => {
  emit("update:modelValue", option.value);
  isOpen.value = false;
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.15s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
