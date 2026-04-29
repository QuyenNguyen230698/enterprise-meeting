<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    
    <!-- Text Type Selector -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Text Type</label>
      <select
        :value="textType"
        @change="$emit('update:textType', $event.target.value)"
        class="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="p">Paragraph</option>
        <option value="span">Span</option>
      </select>
    </div>

    <!-- Font Family -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Font Family</label>
      <select
        :value="fontFamily"
        @change="$emit('update:fontFamily', $event.target.value)"
        class="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <optgroup label="Sans-Serif">
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
          <option value="'Lucida Sans', sans-serif">Lucida Sans</option>
          <option value="'Century Gothic', sans-serif">Century Gothic</option>
          <option value="'Franklin Gothic', sans-serif">Franklin Gothic</option>
          <option value="'Gill Sans', sans-serif">Gill Sans</option>
          <option value="Calibri, sans-serif">Calibri</option>
          <option value="'Segoe UI', sans-serif">Segoe UI</option>
        </optgroup>
        <optgroup label="Serif">
          <option value="'Times New Roman', Times, serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Garamond, serif">Garamond</option>
          <option value="'Palatino Linotype', serif">Palatino</option>
          <option value="'Book Antiqua', serif">Book Antiqua</option>
          <option value="'Baskerville', serif">Baskerville</option>
          <option value="Cambria, serif">Cambria</option>
        </optgroup>
        <optgroup label="Monospace">
          <option value="'Courier New', Courier, monospace">Courier New</option>
          <option value="Monaco, monospace">Monaco</option>
          <option value="'Lucida Console', monospace">Lucida Console</option>
          <option value="Consolas, monospace">Consolas</option>
        </optgroup>
        <optgroup label="Display">
          <option value="Impact, sans-serif">Impact</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
          <option value="'Brush Script MT', cursive">Brush Script MT</option>
        </optgroup>
      </select>
    </div>

    <!-- Font Size -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Font Size</label>
      <div class="flex items-center gap-2">
        <input
          type="number"
          :value="parseFontSize(fontSize).value"
          @input="updateFontSize($event.target.value)"
          step="0.1"
          min="0.5"
          class="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="fontSizeUnit"
          @change="updateFontSize(parseFontSize(fontSize).value)"
          class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
        </select>
      </div>
    </div>

    <!-- Text Style Buttons -->
    <div>
      <label class="text-xs text-gray-600 mb-2 block">Text Style</label>
      <div class="flex flex-wrap gap-2">
        <!-- Bold -->
        <button
          @click="toggleStyle('fontWeight', 'bold', 'normal')"
          :class="[
            'px-3 py-1 rounded-md text-sm font-bold transition-colors border',
            fontWeight === 'bold' 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
          title="Bold"
        >
          <i class="bi bi-type-bold"></i> B
        </button>

        <!-- Italic -->
        <button
          @click="toggleStyle('fontStyle', 'italic', 'normal')"
          :class="[
            'px-3 py-1 rounded-md text-sm italic transition-colors border',
            fontStyle === 'italic' 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
          title="Italic"
        >
          <i class="bi bi-type-italic"></i> I
        </button>

        <!-- Underline -->
        <button
          @click="toggleDecoration('underline')"
          :class="[
            'px-3 py-1 rounded-md text-sm underline transition-colors border',
            textDecoration?.includes('underline') 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
          title="Underline"
        >
          <i class="bi bi-type-underline"></i> U
        </button>

        <!-- Strikethrough -->
        <button
          @click="toggleDecoration('line-through')"
          :class="[
            'px-3 py-1 rounded-md text-sm line-through transition-colors border',
            textDecoration?.includes('line-through') 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
          title="Strikethrough"
        >
          <i class="bi bi-type-strikethrough"></i> S
        </button>
      </div>
    </div>

    <!-- Text Align -->
    <div>
      <label class="text-xs text-gray-600 mb-2 block">Text Align</label>
      <div class="flex gap-2">
        <button
          v-for="align in ['left', 'center', 'right', 'justify']"
          :key="align"
          @click="$emit('update:textAlign', align)"
          :class="[
            'flex-1 px-3 py-1 rounded-md text-sm transition-colors border',
            textAlign === align 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          ]"
        >
          <i :class="`bi bi-text-${align}`"></i>
        </button>
      </div>
    </div>

    <!-- Line Height -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Line Height</label>
      <input
        type="number"
        :value="lineHeight"
        @input="$emit('update:lineHeight', $event.target.value)"
        step="0.1"
        min="1"
        max="3"
        class="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Letter Spacing -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Letter Spacing</label>
      <div class="flex items-center gap-2">
        <input
          type="number"
          :value="parseLetterSpacing(letterSpacing).value"
          @input="updateLetterSpacing($event.target.value)"
          step="0.1"
          class="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-500">px</span>
      </div>
    </div>

    <!-- Text Transform -->
    <div>
      <label class="text-xs text-gray-600 mb-1 block">Text Transform</label>
      <select
        :value="textTransform"
        @change="$emit('update:textTransform', $event.target.value)"
        class="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="none">None</option>
        <option value="uppercase">UPPERCASE</option>
        <option value="lowercase">lowercase</option>
        <option value="capitalize">Capitalize</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Text Styles'
  },
  textType: {
    type: String,
    default: 'p'
  },
  fontFamily: {
    type: String,
    default: 'Arial, sans-serif'
  },
  fontSize: {
    type: String,
    default: '1rem'
  },
  fontWeight: {
    type: String,
    default: 'normal'
  },
  fontStyle: {
    type: String,
    default: 'normal'
  },
  textDecoration: {
    type: String,
    default: 'none'
  },
  textAlign: {
    type: String,
    default: 'left'
  },
  lineHeight: {
    type: String,
    default: '1.5'
  },
  letterSpacing: {
    type: String,
    default: '0px'
  },
  textTransform: {
    type: String,
    default: 'none'
  }
})

const emit = defineEmits([
  'update:textType',
  'update:fontFamily',
  'update:fontSize',
  'update:fontWeight',
  'update:fontStyle',
  'update:textDecoration',
  'update:textAlign',
  'update:lineHeight',
  'update:letterSpacing',
  'update:textTransform'
])

const fontSizeUnit = ref('rem')

// Parse font size
const parseFontSize = (value) => {
  if (!value) return { value: 1, unit: 'rem' }
  const match = String(value).match(/^(-?\d+\.?\d*)(px|rem|em)?$/)
  if (match) {
    return {
      value: parseFloat(match[1]) || 1,
      unit: match[2] || 'rem'
    }
  }
  return { value: 1, unit: 'rem' }
}

// Parse letter spacing
const parseLetterSpacing = (value) => {
  if (!value || value === 'normal') return { value: 0, unit: 'px' }
  const match = String(value).match(/^(-?\d+\.?\d*)(px)?$/)
  if (match) {
    return {
      value: parseFloat(match[1]) || 0,
      unit: 'px'
    }
  }
  return { value: 0, unit: 'px' }
}

// Update font size
const updateFontSize = (value) => {
  emit('update:fontSize', `${value}${fontSizeUnit.value}`)
}

// Update letter spacing
const updateLetterSpacing = (value) => {
  emit('update:letterSpacing', value === '0' || value === 0 ? 'normal' : `${value}px`)
}

// Toggle style (bold/italic)
const toggleStyle = (prop, activeValue, inactiveValue) => {
  const currentValue = props[prop]
  const newValue = currentValue === activeValue ? inactiveValue : activeValue
  emit(`update:${prop}`, newValue)
}

// Toggle decoration (underline/strikethrough)
const toggleDecoration = (decoration) => {
  const current = props.textDecoration || 'none'
  let decorations = current === 'none' ? [] : current.split(' ')
  
  if (decorations.includes(decoration)) {
    decorations = decorations.filter(d => d !== decoration)
  } else {
    decorations.push(decoration)
  }
  
  const newValue = decorations.length === 0 ? 'none' : decorations.join(' ')
  emit('update:textDecoration', newValue)
}

// Watch fontSize to update unit
watch(() => props.fontSize, (newValue) => {
  const parsed = parseFontSize(newValue)
  fontSizeUnit.value = parsed.unit
}, { immediate: true })
</script>
