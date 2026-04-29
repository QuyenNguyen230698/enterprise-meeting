<template>
  <div ref="viewerContainer" class="textured-model-viewer">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Loading 3D Model...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
        <p class="progress-text">{{ Math.round(loadingProgress) }}%</p>
      </div>
    </div>

    <!-- Error Overlay -->
    <div v-if="error" class="error-overlay">
      <div class="error-content">
        <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="error-text">{{ error }}</p>
        <button @click="reload" class="retry-button">Retry</button>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="showControls && !loading && !error" class="viewer-controls">
      <button @click="toggleAutoRotate" :class="['control-btn', { active: autoRotate }]" title="Auto Rotate">
        <svg class="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <button @click="reset" class="control-btn" title="Reset View">
        <svg class="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      <button @click="screenshot" class="control-btn" title="Screenshot">
        <svg class="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTexturedModelViewer } from '~/composables/useTexturedModelViewer'

const props = defineProps({
  modelPath: {
    type: String,
    required: true
  },
  texturePath: {
    type: String,
    default: null
  },
  textureOptions: {
    type: Object,
    default: () => ({
      flipY: true,
      offset: { x: 0, y: 0 },
      repeat: { x: 1, y: 1 },
      rotation: 0
    })
  },

  backgroundColor: {
    type: String,
    default: '#1a1a1a'
  },
  showControls: {
    type: Boolean,
    default: true
  },
  initialAutoRotate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['loaded', 'error'])

const viewerContainer = ref(null)
const loading = ref(false)
const loadingProgress = ref(0)
const error = ref(null)
const autoRotate = ref(false)

const {
  initViewer,
  loadModelWithTexture,
  updateTexture,
  setAutoRotate,
  resetCamera,
  setBackground,
  takeScreenshot,
  destroy
} = useTexturedModelViewer()

const loadModel = async () => {
  loading.value = true
  loadingProgress.value = 0
  error.value = null

  try {
    const result = await loadModelWithTexture(
      props.modelPath,
      props.texturePath,
      (progress) => {
        loadingProgress.value = progress
      },
      props.textureOptions
    )
    
    loading.value = false
    autoRotate.value = props.initialAutoRotate
    setAutoRotate(autoRotate.value)
    emit('loaded', result)
  } catch (err) {
    console.error('Failed to load model:', err)
    error.value = `Failed to load model: ${err.message}`
    loading.value = false
    emit('error', err)
  }
}

const reload = () => {
  loadModel()
}

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value
  setAutoRotate(autoRotate.value)
}

const reset = () => {
  resetCamera()
}

const screenshot = () => {
  const dataUrl = takeScreenshot()
  if (dataUrl) {
    const link = document.createElement('a')
    link.download = `model-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }
}

watch(() => props.texturePath, async (newTexture) => {
  if (newTexture && !loading.value) {
    try {
      await updateTexture(newTexture, props.textureOptions)
    } catch (err) {
      console.error('Failed to update texture:', err)
    }
  }
})

// Watch for background color changes
watch(() => props.backgroundColor, (newColor) => {
  setBackground(newColor)
})

onMounted(() => {
  if (viewerContainer.value) {
    initViewer(viewerContainer.value, {
      backgroundColor: props.backgroundColor,
      enableGrid: false
    })
    loadModel()
  }
})

onUnmounted(() => {
  destroy()
})
</script>

<style scoped>
.textured-model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.loading-content,
.error-content {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text,
.error-text {
  color: white;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
}

.progress-text {
  color: #94a3b8;
  font-size: 0.875rem;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #4f46e5;
}

.viewer-controls {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 5;
}

.control-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(51, 65, 85, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  color: white;
}

.control-btn.active {
  background: rgba(99, 102, 241, 0.5);
  color: white;
  border-color: #6366f1;
}

.control-icon {
  width: 20px;
  height: 20px;
}
</style>
