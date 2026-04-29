<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', castValue($event.target.value))"
      class="prop-select"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    // Format: [{ value: 'option1', label: 'Option 1' }]
  },
  valueType: {
    type: String,
    default: 'string', // 'string', 'number', 'boolean'
  }
})

defineEmits(['update:modelValue'])

const castValue = (value) => {
  if (props.valueType === 'number') {
    return Number(value)
  }
  if (props.valueType === 'boolean') {
    return value === 'true'
  }
  return value
}
</script>

<style scoped>
.prop-field {
  display: flex;
  flex-direction: column;
}

.prop-label {
  font-size: 11px;
  font-weight: 500;
  color: rgb(51, 65, 85);
}

.prop-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid rgb(226, 232, 240);
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
}

.prop-select:focus {
  outline: none;
  border-color: rgb(99, 102, 241);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.prop-select:hover {
  border-color: rgb(148, 163, 184);
}
</style>
