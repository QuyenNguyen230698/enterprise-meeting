import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'speedometer_settings'

interface SpeedometerSettings {
  template: 'lamborghini' | 'supercar' | 'digital' | 'retro'
  theme: 'light' | 'dark'
  odometer: number // Total distance in km
  avgSpeed: number // Average speed
  totalTime: number // Total time in seconds for avg calculation
  speedSamples: number // Number of speed samples
}

const defaultSettings: SpeedometerSettings = {
  template: 'lamborghini',
  theme: 'dark',
  odometer: 0,
  avgSpeed: 0,
  totalTime: 0,
  speedSamples: 0
}

// Shared state
const settings = ref<SpeedometerSettings>({ ...defaultSettings })
const isInitialized = ref(false)

export function useSpeedometerStorage() {
  // Load settings from localStorage
  const loadSettings = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        settings.value = { ...defaultSettings, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load speedometer settings:', e)
    }
    isInitialized.value = true
  }

  // Save settings to localStorage
  const saveSettings = () => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('Failed to save speedometer settings:', e)
    }
  }

  // Update template
  const setTemplate = (template: 'lamborghini' | 'supercar' | 'digital' | 'retro') => {
    settings.value.template = template
    saveSettings()
  }

  // Update theme
  const setTheme = (theme: 'light' | 'dark') => {
    settings.value.theme = theme
    saveSettings()
  }

  // Update odometer (add distance in km)
  const addDistance = (distanceKm: number) => {
    if (distanceKm > 0) {
      settings.value.odometer += distanceKm
      saveSettings()
    }
  }

  // Update average speed (running average)
  const updateAvgSpeed = (currentSpeed: number) => {
    if (currentSpeed > 0) {
      settings.value.speedSamples++
      settings.value.totalTime++
      // Running average formula
      const n = settings.value.speedSamples
      settings.value.avgSpeed = settings.value.avgSpeed + (currentSpeed - settings.value.avgSpeed) / n
      saveSettings()
    }
  }

  // Reset trip data (ODO and AVG)
  const resetTrip = () => {
    settings.value.odometer = 0
    settings.value.avgSpeed = 0
    settings.value.totalTime = 0
    settings.value.speedSamples = 0
    saveSettings()
  }

  // Format odometer display - always in KM
  const formatOdometer = (km: number): string => {
    if (km < 1) {
      return `${km.toFixed(2)} km`
    }
    return `${km.toFixed(1)} km`
  }

  // Format average speed
  const formatAvgSpeed = (speed: number): string => {
    return `${Math.round(speed)} km/h`
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
    isInitialized,
    loadSettings,
    saveSettings,
    setTemplate,
    setTheme,
    addDistance,
    updateAvgSpeed,
    resetTrip,
    formatOdometer,
    formatAvgSpeed
  }
}
