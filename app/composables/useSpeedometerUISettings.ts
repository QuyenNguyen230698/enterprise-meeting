import { ref, watch, onMounted } from 'vue'

const SETTINGS_KEY = 'speedometer_ui_settings'
const IMAGE_KEY = 'speedometer_bg_image'

interface ColorSettings {
  arcGradientStart: string
  arcGradientEnd: string
  numberActive: string
  numberInactive: string
  background: string
}

interface BackgroundSettings {
  type: 'solid' | 'orbs' | 'galaxy' | 'nature' | 'underwater' | 'city' | 'aurora' | 'matrix' | 'space' | 'rain' | 'fire' | 'snow' | 'image' | 'ocean' | 'vortex' | 'quantum'
  enabled: boolean
  imageFit: 'cover' | 'contain' | 'fill'
  imageOpacity: number
}

interface UISettings {
  colors: ColorSettings
  background: BackgroundSettings
  showDashedLines: boolean
}

const defaultSettings: UISettings = {
  colors: {
    arcGradientStart: '#00e5ff',
    arcGradientEnd: '#ff003c',
    numberActive: '#00e5ff',
    numberInactive: 'rgba(255, 255, 255, 0.5)',
    background: '#0a0a0a'
  },
  background: {
    type: 'solid',
    enabled: false,
    imageFit: 'cover',
    imageOpacity: 0.5
  },
  showDashedLines: true
}

// Shared state
const settings = ref<UISettings>({ ...defaultSettings })
const backgroundImage = ref<string | null>(null)
const isInitialized = ref(false)

export function useSpeedometerUISettings() {
  // Load settings from localStorage
  const loadSettings = () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Deep merge with defaults
        settings.value = {
          colors: { ...defaultSettings.colors, ...parsed.colors },
          background: { ...defaultSettings.background, ...parsed.background },
          showDashedLines: parsed.showDashedLines ?? defaultSettings.showDashedLines
        }
      }

      // Load image separately (can be large)
      const storedImage = localStorage.getItem(IMAGE_KEY)
      if (storedImage) {
        backgroundImage.value = storedImage
      }
    } catch (e) {
      console.error('Failed to load UI settings:', e)
    }
    isInitialized.value = true
  }

  // Save settings to localStorage
  const saveSettings = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('Failed to save UI settings:', e)
    }
  }

  // Save background image separately
  const saveBackgroundImage = (imageData: string | null) => {
    if (typeof window === 'undefined') return

    try {
      if (imageData) {
        localStorage.setItem(IMAGE_KEY, imageData)
      } else {
        localStorage.removeItem(IMAGE_KEY)
      }
      backgroundImage.value = imageData
    } catch (e) {
      console.error('Failed to save background image:', e)
      // localStorage might be full
      alert('Could not save image. The file may be too large.')
    }
  }

  // Update colors
  const setColors = (colors: Partial<ColorSettings>) => {
    settings.value.colors = { ...settings.value.colors, ...colors }
    saveSettings()
  }

  // Update background
  const setBackground = (background: Partial<BackgroundSettings>) => {
    settings.value.background = { ...settings.value.background, ...background }
    saveSettings()
  }

  // Reset to defaults
  const resetToDefaults = () => {
    settings.value = JSON.parse(JSON.stringify(defaultSettings))
    backgroundImage.value = null
    saveSettings()
    if (typeof window !== 'undefined') {
      localStorage.removeItem(IMAGE_KEY)
    }
  }

  // Initialize on mount
  onMounted(() => {
    if (!isInitialized.value) {
      loadSettings()
    }
  })

  // Watch for changes and auto-save
  watch(settings, saveSettings, { deep: true })

  return {
    settings,
    backgroundImage,
    isInitialized,
    loadSettings,
    saveSettings,
    setColors,
    setBackground,
    saveBackgroundImage,
    resetToDefaults
  }
}
