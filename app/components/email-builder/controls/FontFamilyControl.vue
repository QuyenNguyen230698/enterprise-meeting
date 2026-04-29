<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>

    <!-- Badge Style (default) -->
    <div class="font-badges-container">
      <button
        v-for="font in fonts"
        :key="font.value"
        @click="$emit('update:modelValue', font.value)"
        :class="[
          'font-badge',
          (modelValue || defaultFont) === font.value ? 'active' : ''
        ]"
        :style="{ fontFamily: font.value }"
      >
        {{ font.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Font chữ'
  },
  fonts: {
    type: Array,
    default: () => [
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
      { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
      { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
      { value: "'Courier New', Courier, monospace", label: 'Courier New' },
      { value: 'Impact, sans-serif', label: 'Impact' },
      { value: 'Comic Sans MS, cursive', label: 'Comic Sans' }
    ]
  },
  defaultFont: {
    type: String,
    default: 'Arial, sans-serif'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.prop-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.prop-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(51, 65, 85);
}

.font-badges-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding: 0.25rem 0;
}

.font-badges-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.font-badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid rgb(226, 232, 240);
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.font-badge:hover {
  border-color: rgb(148, 163, 184);
  background-color: rgb(248, 250, 252);
}

.font-badge.active {
  background-color: rgb(99, 102, 241);
  color: white;
  border-color: rgb(99, 102, 241);
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}
</style>
