<template>
  <div class="template-selector">
    <div class="selector-header">
      <h3 class="selector-title">Choose Template</h3>
    </div>
    
    <div class="template-grid">
      <button
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :class="{ active: modelValue === template.id }"
        @click="$emit('update:modelValue', template.id)"
      >
        <div class="template-preview">
          <component :is="template.icon" />
        </div>
        <div class="template-info">
          <div class="template-name">{{ template.name }}</div>
          <div class="template-desc">{{ template.description }}</div>
        </div>
        <div v-if="modelValue === template.id" class="active-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

interface Props {
  modelValue: string
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional analog speedometer',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  },
  {
    id: 'digital',
    name: 'Digital',
    description: 'Modern LED display',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
      h('path', { d: 'M7 10h2m4 0h2m-8 4h2m4 0h2' })
    ])
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Sci-fi neon design',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('circle', { cx: '12', cy: '12', r: '6' }),
      h('circle', { cx: '12', cy: '12', r: '2' })
    ])
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    }, [
      h('line', { x1: '4', y1: '12', x2: '20', y2: '12' }),
      h('line', { x1: '12', y1: '4', x2: '12', y2: '20' })
    ])
  }
]
</script>

<style scoped lang="scss">
.template-selector {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-header {
  margin-bottom: 0.75rem;
}

.selector-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.template-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
  }
}

.template-preview {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.template-info {
  text-align: center;
}

.template-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.125rem;
}

.template-desc {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
}

.active-indicator {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  width: 1rem;
  height: 1rem;
  color: #4ade80;
  
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
