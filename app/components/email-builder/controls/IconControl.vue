<template>
  <div class="icon-control">
    <!-- Icon URL -->
    <div class="prop-field">
      <label class="prop-label">{{ urlLabel || 'URL Icon' }}</label>
      <input 
        v-model="localIconUrl" 
        @input="updateElement" 
        type="url" 
        class="prop-input" 
        :placeholder="urlPlaceholder || 'https://img.icons8.com/...'" 
      />
    </div>
    
    <!-- Icon Background Color -->
    <div class="prop-field" v-if="showBackground">
      <label class="prop-label">{{ backgroundLabel || 'Nền icon' }}</label>
      <div class="icon-bg-control">
        <div class="icon-bg-swatch" :style="{ backgroundColor: localIconBgColor || defaultBgColor }">
          <input 
            type="color" 
            :value="localIconBgColor || defaultBgColor" 
            @input="localIconBgColor = $event.target.value; updateElement()" 
          />
        </div>
        <input 
          type="text" 
          v-model="localIconBgColor" 
          @input="updateElement" 
          class="icon-bg-hex" 
          :placeholder="defaultBgColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  elementProps: {
    type: Object,
    required: true
  },
  updateElement: {
    type: Function,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      urlProp: 'iconUrl',
      bgProp: 'iconBgColor',
      urlLabel: 'URL Icon',
      backgroundLabel: 'Nền icon',
      urlPlaceholder: 'https://img.icons8.com/...',
      defaultBgColor: '#dbeafe',
      showBackground: true
    })
  }
})

const urlProp = props.config.urlProp || 'iconUrl'
const bgProp = props.config.bgProp || 'iconBgColor'
const urlLabel = props.config.urlLabel || 'URL Icon'
const backgroundLabel = props.config.backgroundLabel || 'Nền icon'
const urlPlaceholder = props.config.urlPlaceholder || 'https://img.icons8.com/...'
const defaultBgColor = props.config.defaultBgColor || '#dbeafe'
const showBackground = props.config.showBackground !== false

const localIconUrl = computed({
  get: () => props.elementProps[urlProp] || '',
  set: (value) => {
    props.elementProps[urlProp] = value
  }
})

const localIconBgColor = computed({
  get: () => props.elementProps[bgProp] || '',
  set: (value) => {
    props.elementProps[bgProp] = value
  }
})
</script>

<style scoped>
.icon-control {
  padding: 0.5rem 0;
}

.icon-control .prop-field {
  margin-bottom: 1rem;
}

.icon-control .prop-field:last-child {
  margin-bottom: 0;
}

.icon-control .prop-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.icon-control .prop-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.icon-control .prop-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.icon-control .prop-input::placeholder {
  color: #9ca3af;
}

.icon-bg-control {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.icon-bg-swatch {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.icon-bg-swatch:hover {
  border-color: #9ca3af;
}

.icon-bg-swatch input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.icon-bg-hex {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  text-transform: uppercase;
  transition: all 0.15s ease;
}

.icon-bg-hex:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.icon-bg-hex::placeholder {
  color: #9ca3af;
}
</style>
