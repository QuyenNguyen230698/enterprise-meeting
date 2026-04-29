<template>
  <div class="space-y-3 p-4 border-b border-black">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      
      <!-- Unit Display (fixed to %) -->
      <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">%</span>
    </div>

    <!-- Visual Spacing Control -->
    <div class="flex flex-col items-center gap-2 py-2">
      <!-- Top -->
      <div class="flex flex-col items-center gap-1">
        <label class="text-xs text-gray-600 font-medium">Top</label>
        <input
          v-model.number="numericValues.top"
          @input="updateValue"
          type="number"
          step="0.25"
          class="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
      
      <!-- Middle Row: Left, Center (Value), Right -->
      <div class="flex items-center gap-3">
        <!-- Left -->
        <div class="flex flex-col items-center gap-1">
          <label class="text-xs text-gray-600 font-medium">Left</label>
          <input
            v-model.number="numericValues.left"
            @input="updateValue"
            type="number"
            step="0.25"
            class="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        
        <!-- Center Value Display -->
        <div class="flex items-center justify-center min-w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded">
          <div class="text-xs text-gray-700 font-mono text-center px-2">
            {{ computedValue }}
          </div>
        </div>
        
        <!-- Right -->
        <div class="flex flex-col items-center gap-1">
          <label class="text-xs text-gray-600 font-medium">Right</label>
          <input
            v-model.number="numericValues.right"
            @input="updateValue"
            type="number"
            step="0.25"
            class="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>
      
      <!-- Bottom -->
      <div class="flex flex-col items-center gap-1">
        <input
          v-model.number="numericValues.bottom"
          @input="updateValue"
          type="number"
          step="0.25"
          class="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
        <label class="text-xs text-gray-600 font-medium">Bottom</label>
      </div>
    </div>

    <!-- Quick presets -->
    <div class="flex items-center justify-center gap-1 flex-wrap">
      <button
        @click="applyAll(0)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >0</button>
      <button
        @click="applyAll(0.5)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >0.5</button>
      <button
        @click="applyAll(1)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >1</button>
      <button
        @click="applyAll(1.5)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >1.5</button>
      <button
        @click="applyAll(2)"
        class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >2</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '0'
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'padding' // padding or margin
  }
})

const emit = defineEmits(['update:modelValue'])

const currentUnit = ref('%')
const numericValues = ref({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
})

// Extract numeric value and unit from a CSS value
const parseValueWithUnit = (value) => {
  if (!value || value === '0') return { number: 0, unit: '%' }
  
  const match = String(value).match(/^(-?\d+\.?\d*)(px|rem|em|%)?$/)
  if (match) {
    return {
      number: parseFloat(match[1]) || 0,
      unit: '%' // Always use %
    }
  }
  return { number: 0, unit: '%' }
}

// Parse CSS shorthand value (e.g., "1rem 2rem" or "0.5rem")
const parseValue = (value) => {
  if (!value || value === '0') {
    numericValues.value = { top: 0, right: 0, bottom: 0, left: 0 }
    currentUnit.value = '%'
    return
  }
  
  const parts = String(value).split(' ').filter(p => p.trim())
  
  if (parts.length === 1) {
    // Single value for all sides
    const parsed = parseValueWithUnit(parts[0])
    numericValues.value = { 
      top: parsed.number, 
      right: parsed.number, 
      bottom: parsed.number, 
      left: parsed.number 
    }
    currentUnit.value = parsed.unit
  } else if (parts.length === 2) {
    // top/bottom, left/right
    const parsed1 = parseValueWithUnit(parts[0])
    const parsed2 = parseValueWithUnit(parts[1])
    numericValues.value = { 
      top: parsed1.number, 
      right: parsed2.number, 
      bottom: parsed1.number, 
      left: parsed2.number 
    }
    currentUnit.value = parsed1.unit
  } else if (parts.length === 4) {
    // top, right, bottom, left
    const parsed = parts.map(p => parseValueWithUnit(p))
    numericValues.value = { 
      top: parsed[0].number, 
      right: parsed[1].number, 
      bottom: parsed[2].number, 
      left: parsed[3].number 
    }
    currentUnit.value = parsed[0].unit
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  try {
    parseValue(newValue)
  } catch (error) {
    console.warn('SpacingControl parseValue error:', error)
    numericValues.value = { top: 0, right: 0, bottom: 0, left: 0 }
    currentUnit.value = '%'
  }
}, { immediate: true })

// Computed CSS value
const computedValue = computed(() => {
  const { top, right, bottom, left } = numericValues.value
  const unit = currentUnit.value
  
  // Convert numbers to strings with unit
  const topVal = top === 0 ? '0' : `${top}${unit}`
  const rightVal = right === 0 ? '0' : `${right}${unit}`
  const bottomVal = bottom === 0 ? '0' : `${bottom}${unit}`
  const leftVal = left === 0 ? '0' : `${left}${unit}`
  
  // If all values are the same
  if (top === right && right === bottom && bottom === left) {
    return topVal
  }
  
  // If top/bottom same and left/right same
  if (top === bottom && left === right) {
    return `${topVal} ${rightVal}`
  }
  
  // Return all four values
  return `${topVal} ${rightVal} ${bottomVal} ${leftVal}`
})

const updateValue = () => {
  emit('update:modelValue', computedValue.value)
}

const applyAll = (value) => {
  numericValues.value = { top: value, right: value, bottom: value, left: value }
  updateValue()
}

const changeUnit = () => {
  // Just update with the new unit
  updateValue()
}
</script>
