<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="flex items-center gap-2">
      <input
        v-model="numericValue"
        @input="updateValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        class="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        :placeholder="placeholder"
      />
      <select
        v-model="unit"
        @change="updateValue"
        class="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option v-for="u in availableUnits" :key="u" :value="u">{{ u }}</option>
        <option value="auto" v-if="allowAuto">auto</option>
      </select>
    </div>
    
    <!-- Quick Presets -->
    <div v-if="showPresets" class="flex flex-wrap gap-1">
      <button
        v-for="preset in presets"
        :key="preset.value"
        @click="applyPreset(preset.value)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Slider for px values -->
    <div v-if="showSlider && unit === 'px'" class="space-y-1">
      <input
        v-model="numericValue"
        @input="updateValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ min }}{{ unit }}</span>
        <span>{{ numericValue }}{{ unit }}</span>
        <span>{{ max }}{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '0px'
  },
  label: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  placeholder: {
    type: String,
    default: '0'
  },
  allowEm: {
    type: Boolean,
    default: false
  },
  allowRem: {
    type: Boolean,
    default: false
  },
  allowAuto: {
    type: Boolean,
    default: false
  },
  units: {
    type: Array,
    default: () => ['px', '%', 'em', 'rem'] // Available units
  },
  showPresets: {
    type: Boolean,
    default: true
  },
  showSlider: {
    type: Boolean,
    default: true
  },
  presets: {
    type: Array,
    default: () => [
      { label: '0', value: '0px' },
      { label: '25%', value: '25%' },
      { label: '50%', value: '50%' },
      { label: '75%', value: '75%' },
      { label: '100%', value: '100%' },
      { label: 'Auto', value: 'auto' }
    ]
  }
})

const emit = defineEmits(['update:modelValue'])

const numericValue = ref(0)
const unit = ref('px')

// Available units based on props
const availableUnits = computed(() => props.units)

// Parse initial value
const parseValue = (value) => {
  if (!value || value === 'auto') {
    numericValue.value = 0
    unit.value = value === 'auto' ? 'auto' : 'px'
    return
  }
  
  const match = value.match(/^(\d*\.?\d+)(px|%|em|rem)$/)
  if (match) {
    numericValue.value = parseFloat(match[1])
    unit.value = match[2]
  } else {
    // Try to parse as number
    const num = parseFloat(value)
    if (!isNaN(num)) {
      numericValue.value = num
      unit.value = 'px'
    } else {
      numericValue.value = 0
      unit.value = 'px'
    }
  }
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  try {
    parseValue(newValue)
  } catch (error) {
    console.warn('UnitControl parseValue error:', error)
    // Set default values on error
    numericValue.value = 0
    unit.value = 'px'
  }
}, { immediate: true })

// Computed value
const computedValue = computed(() => {
  if (unit.value === 'auto') return 'auto'
  return `${numericValue.value}${unit.value}`
})

// Update value
const updateValue = () => {
  emit('update:modelValue', computedValue.value)
}

// Apply preset
const applyPreset = (preset) => {
  parseValue(preset)
  updateValue()
}

// Update max based on unit
watch(unit, (newUnit) => {
  if (newUnit === '%' && props.max === 100) {
    // Keep current max for percentage
  } else if (newUnit === 'px' && numericValue.value > props.max) {
    numericValue.value = props.max
  }
  updateValue()
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
