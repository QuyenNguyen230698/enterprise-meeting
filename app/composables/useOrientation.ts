import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

export type OrientationMode = 'portrait' | 'landscape'

export const useOrientation = () => {
  const { width, height } = useWindowSize()
  const manualOrientation = ref<OrientationMode | null>(null)
  
  // Detect natural orientation based on window dimensions
  const naturalOrientation = computed<OrientationMode>(() => {
    return width.value > height.value ? 'landscape' : 'portrait'
  })

  // Current orientation (manual override or natural)
  const currentOrientation = computed<OrientationMode>(() => {
    return manualOrientation.value || naturalOrientation.value
  })

  // Check if orientation is manually set
  const isManualMode = computed(() => manualOrientation.value !== null)

  // Toggle orientation manually
  const toggleOrientation = () => {
    if (manualOrientation.value === null) {
      // First toggle: set opposite of natural
      manualOrientation.value = naturalOrientation.value === 'portrait' ? 'landscape' : 'portrait'
    } else if (manualOrientation.value === naturalOrientation.value) {
      // If manual matches natural, switch to opposite
      manualOrientation.value = naturalOrientation.value === 'portrait' ? 'landscape' : 'portrait'
    } else {
      // If manual is opposite of natural, reset to natural
      manualOrientation.value = null
    }
  }

  // Set specific orientation
  const setOrientation = (mode: OrientationMode) => {
    manualOrientation.value = mode
  }

  // Reset to natural orientation
  const resetOrientation = () => {
    manualOrientation.value = null
  }

  // Check if current orientation is portrait
  const isPortrait = computed(() => currentOrientation.value === 'portrait')

  // Check if current orientation is landscape
  const isLandscape = computed(() => currentOrientation.value === 'landscape')

  return {
    currentOrientation,
    naturalOrientation,
    manualOrientation,
    isManualMode,
    isPortrait,
    isLandscape,
    toggleOrientation,
    setOrientation,
    resetOrientation
  }
}
