<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <h2>Settings</h2>
            <button class="close-btn" @click="close">✕</button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Colors Section -->
            <section class="settings-section">
              <h3>Colors</h3>

              <div class="color-group">
                <label>Arc Gradient Start</label>
                <input
                  type="color"
                  v-model="localSettings.colors.arcGradientStart"
                  class="color-input"
                />
                <span class="color-value">{{ localSettings.colors.arcGradientStart }}</span>
              </div>

              <div class="color-group">
                <label>Arc Gradient End</label>
                <input
                  type="color"
                  v-model="localSettings.colors.arcGradientEnd"
                  class="color-input"
                />
                <span class="color-value">{{ localSettings.colors.arcGradientEnd }}</span>
              </div>

              <div class="color-group">
                <label>Active Numbers</label>
                <input
                  type="color"
                  v-model="localSettings.colors.numberActive"
                  class="color-input"
                />
                <span class="color-value">{{ localSettings.colors.numberActive }}</span>
              </div>

              <div class="color-group">
                <label>Inactive Numbers</label>
                <input
                  type="color"
                  v-model="localSettings.colors.numberInactive"
                  class="color-input"
                />
                <span class="color-value">{{ localSettings.colors.numberInactive }}</span>
              </div>

              <div class="color-group">
                <label>Background Color</label>
                <input
                  type="color"
                  v-model="localSettings.colors.background"
                  class="color-input"
                />
                <span class="color-value">{{ localSettings.colors.background }}</span>
              </div>
            </section>

            <!-- Color Presets Section -->
            <section class="settings-section">
              <h3>Color Presets</h3>
              
              <div class="preset-grid">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.name"
                  class="preset-btn"
                  @click="applyPreset(preset)"
                >
                  <div class="preset-preview">
                    <div class="preset-gradient" :style="{ background: `linear-gradient(90deg, ${preset.start}, ${preset.end})` }"></div>
                  </div>
                  <span class="preset-name">{{ preset.name }}</span>
                </button>
              </div>
            </section>

            <!-- Dashed Lines Effect Section -->
            <section class="settings-section">
              <h3>Arc Effects</h3>
              
              <div class="toggle-group">
                <label>Show Dashed Lines</label>
                <button
                  class="toggle-btn"
                  :class="{ active: localSettings.showDashedLines }"
                  @click="localSettings.showDashedLines = !localSettings.showDashedLines"
                >
                  <span class="toggle-slider"></span>
                </button>
              </div>
            </section>

            <!-- Background Section -->
            <section class="settings-section">
              <h3>Background Effect</h3>

              <div class="toggle-group">
                <label>Enable Background Effect</label>
                <button
                  class="toggle-btn"
                  :class="{ active: localSettings.background.enabled }"
                  @click="localSettings.background.enabled = !localSettings.background.enabled"
                >
                  <span class="toggle-slider"></span>
                </button>
              </div>

              <div v-if="localSettings.background.enabled" class="bg-types">
                <button
                  v-for="type in bgTypes"
                  :key="type.value"
                  class="bg-type-btn"
                  :class="{ active: localSettings.background.type === type.value }"
                  @click="localSettings.background.type = type.value as typeof localSettings.background.type"
                >
                  <span class="bg-icon">{{ type.icon }}</span>
                  <span class="bg-label">{{ type.label }}</span>
                </button>
              </div>

              <!-- Image Upload Section -->
              <div v-if="localSettings.background.enabled && localSettings.background.type === 'image'" class="image-settings">
                <div class="image-upload-area">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden-input"
                  />

                  <!-- Image Preview or Upload Button -->
                  <div v-if="localImagePreview" class="image-preview">
                    <img
                      :src="localImagePreview"
                      :style="{
                        objectFit: localSettings.background.imageFit,
                        opacity: localSettings.background.imageOpacity
                      }"
                      alt="Background preview"
                    />
                    <button class="remove-image-btn" @click="removeImage">✕</button>
                  </div>
                  <button v-else class="upload-btn" @click="triggerUpload">
                    <span class="upload-icon">📷</span>
                    <span>Upload Image</span>
                  </button>
                </div>

                <!-- Object Fit Options -->
                <div class="fit-options">
                  <label>Image Fit</label>
                  <div class="fit-buttons">
                    <button
                      v-for="fit in fitOptions"
                      :key="fit.value"
                      class="fit-btn"
                      :class="{ active: localSettings.background.imageFit === fit.value }"
                      @click="localSettings.background.imageFit = fit.value"
                    >
                      {{ fit.label }}
                    </button>
                  </div>
                </div>

                <!-- Opacity Slider -->
                <div class="opacity-setting">
                  <label>Opacity: {{ Math.round(localSettings.background.imageOpacity * 100) }}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    v-model.number="localSettings.background.imageOpacity"
                    class="opacity-slider"
                  />
                </div>
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="resetToDefaults">
              Reset
            </button>
            <button class="btn btn-primary" @click="save">
              Save
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSpeedometerUISettings } from '~/composables/useSpeedometerUISettings'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const {
  settings,
  backgroundImage,
  setColors,
  setBackground,
  saveBackgroundImage,
  resetToDefaults: reset
} = useSpeedometerUISettings()

// File input ref
const fileInput = ref<HTMLInputElement | null>(null)

// Local copy for editing
const localSettings = ref({
  colors: { ...settings.value.colors },
  background: { ...settings.value.background },
  showDashedLines: settings.value.showDashedLines
})

// Local image preview (for editing before save)
const localImagePreview = ref<string | null>(backgroundImage.value)

// Background types
const bgTypes = [
  { value: 'solid', label: 'Solid', icon: '⬛' },
  { value: 'orbs', label: 'Orbs', icon: '🔵' },
  { value: 'galaxy', label: 'Galaxy', icon: '🌌' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'quantum', label: 'Quantum', icon: '⚛️' },
]

// Object fit options
const fitOptions = [
  { value: 'cover' as const, label: 'Cover' },
  { value: 'contain' as const, label: 'Contain' },
  { value: 'fill' as const, label: 'Fill' },
]

// Color Presets - High contrast and distinct colors
const colorPresets = [
  { name: 'Purple', start: '#8800ff', end: '#ff00ff' },      // Bright purple → Magenta
  { name: 'Pink', start: '#ff3388', end: '#ff99cc' },        // Bright pink → Light pink
  { name: 'Red', start: '#ff0000', end: '#ff6666' },         // Bright red → Light red
  { name: 'Blue', start: '#0066ff', end: '#00d4ff' },        // Bright blue → Cyan
  { name: 'Green', start: '#00cc00', end: '#00ff66' },       // Bright green → Light green
  { name: 'Emerald', start: '#00cc88', end: '#00ffcc' },     // Bright teal → Bright emerald
  { name: 'Ocean', start: '#0088cc', end: '#00ddff' },       // Bright ocean → Sky blue
  { name: 'Sunset', start: '#ff6600', end: '#ffdd00' },      // Bright orange → Golden yellow
  { name: 'Fire', start: '#ff3300', end: '#ff9900' },        // Bright red-orange → Orange
  { name: 'Gold', start: '#ffaa00', end: '#ffee00' },        // Bright gold → Yellow gold
  { name: 'Neon', start: '#00ff00', end: '#00ffff' },        // Lime → Cyan
  { name: 'Royal', start: '#6600cc', end: '#bb00ff' },       // Bright purple → Bright violet
]

function applyPreset(preset: typeof colorPresets[0]) {
  localSettings.value.colors.arcGradientStart = preset.start
  localSettings.value.colors.arcGradientEnd = preset.end
  localSettings.value.colors.numberActive = preset.start
}

// Watch for settings changes from outside
watch(() => settings.value, (newSettings) => {
  localSettings.value = {
    colors: { ...newSettings.colors },
    background: { ...newSettings.background },
    showDashedLines: newSettings.showDashedLines
  }
}, { deep: true })

// Watch for background image changes
watch(() => backgroundImage.value, (newImage) => {
  localImagePreview.value = newImage
})

// Sync local preview when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    localSettings.value = {
      colors: { ...settings.value.colors },
      background: { ...settings.value.background },
      showDashedLines: settings.value.showDashedLines
    }
    localImagePreview.value = backgroundImage.value
  }
})

function triggerUpload() {
  fileInput.value?.click()
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Check file size (max 2MB for localStorage)
  if (file.size > 2 * 1024 * 1024) {
    alert('Image too large. Maximum size is 2MB.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    localImagePreview.value = result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  localImagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function close() {
  emit('close')
}

function save() {
  setColors(localSettings.value.colors)
  setBackground(localSettings.value.background)
  settings.value.showDashedLines = localSettings.value.showDashedLines

  // Save image if type is 'image'
  if (localSettings.value.background.type === 'image') {
    saveBackgroundImage(localImagePreview.value)
  }

  close()
}

function resetToDefaults() {
  reset()
  localSettings.value = {
    colors: { ...settings.value.colors },
    background: { ...settings.value.background },
    showDashedLines: settings.value.showDashedLines
  }
  localImagePreview.value = null
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }
}

.close-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.color-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    flex: 1;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .color-input {
    width: 3rem;
    height: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.375rem;
    cursor: pointer;
    background: transparent;

    &::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 0.25rem;
    }
  }

  .color-value {
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    color: rgba(255, 255, 255, 0.5);
    min-width: 5rem;
  }
}

.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
}

.toggle-btn {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: #00e5ff;
    border-color: #00e5ff;

    .toggle-slider {
      transform: translateX(1.5rem);
    }
  }

  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.25rem;
    height: 1.25rem;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }
}

.bg-types {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.bg-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.6rem 0.4rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  .bg-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .bg-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    opacity: 0.9;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background: rgba(0, 229, 255, 0.2);
    border-color: #00e5ff;
    color: #00e5ff;
  }
}

// Color Presets
.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .preset-preview {
    width: 100%;
    height: 30px;
    border-radius: 0.375rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .preset-gradient {
    width: 100%;
    height: 100%;
  }

  .preset-name {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 600;
  }
}

// Image settings section
.image-settings {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.hidden-input {
  display: none;
}

.image-upload-area {
  margin-bottom: 1rem;
}

.upload-btn {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;

  .upload-icon {
    font-size: 1.5rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.image-preview {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    transition: all 0.2s ease;
  }

  .remove-image-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 0, 0, 0.8);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 0, 0, 1);
      transform: scale(1.1);
    }
  }
}

.fit-options {
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }

  .fit-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .fit-btn {
    flex: 1;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background: rgba(0, 229, 255, 0.2);
      border-color: #00e5ff;
      color: #00e5ff;
    }
  }
}

.opacity-setting {
  label {
    display: block;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }

  .opacity-slider {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: #00e5ff;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.2);
      }
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: #00e5ff;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  }
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  flex: 1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }

  &.btn-primary {
    background: #00e5ff;
    border: 1px solid #00e5ff;
    color: #000;

    &:hover {
      background: #00d4ee;
    }
  }
}

// Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95);
    opacity: 0;
  }
}

// Scrollbar
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
