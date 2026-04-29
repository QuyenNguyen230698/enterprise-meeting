import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface GPSSpeedData {
  speed: number // in km/h
  speedMph: number
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  timestamp: number | null
}

export const useGPSSpeed = () => {
  const speed = ref<number>(0) // km/h
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const accuracy = ref<number | null>(null)
  const timestamp = ref<number | null>(null)
  const isTracking = ref<boolean>(false)
  const error = ref<string | null>(null)
  const permissionStatus = ref<'granted' | 'denied' | 'prompt'>('prompt')
  
  let watchId: number | null = null

  // Convert km/h to mph
  const speedMph = computed(() => speed.value * 0.621371)

  // GPS data object
  const gpsData = computed<GPSSpeedData>(() => ({
    speed: speed.value,
    speedMph: speedMph.value,
    latitude: latitude.value,
    longitude: longitude.value,
    accuracy: accuracy.value,
    timestamp: timestamp.value
  }))

  const handleSuccess = (position: GeolocationPosition) => {
    // Update position data
    latitude.value = position.coords.latitude
    longitude.value = position.coords.longitude
    accuracy.value = position.coords.accuracy
    timestamp.value = position.timestamp

    // Speed is in m/s, convert to km/h
    if (position.coords.speed !== null && position.coords.speed !== undefined) {
      // Convert m/s to km/h
      speed.value = Math.max(0, position.coords.speed * 3.6)
    } else {
      // If speed is not available, keep current value or set to 0
      speed.value = 0
    }

    error.value = null
  }

  const handleError = (err: GeolocationPositionError) => {
    isTracking.value = false
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        error.value = 'Location permission denied. Please enable location access.'
        permissionStatus.value = 'denied'
        break
      case err.POSITION_UNAVAILABLE:
        error.value = 'Location information unavailable.'
        break
      case err.TIMEOUT:
        error.value = 'Location request timed out.'
        break
      default:
        error.value = 'An unknown error occurred.'
    }
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by your browser.'
      return
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    isTracking.value = true
    error.value = null

    // Watch position continuously
    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
    isTracking.value = false
  }

  const requestPermission = async () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by your browser.'
      return false
    }

    try {
      // Try to get current position to trigger permission prompt
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            permissionStatus.value = 'granted'
            resolve()
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              permissionStatus.value = 'denied'
            }
            reject(err)
          }
        )
      })
      return true
    } catch (err) {
      return false
    }
  }

  // Auto-start tracking on mount
  onMounted(() => {
    startTracking()
  })

  // Clean up on unmount
  onUnmounted(() => {
    stopTracking()
  })

  return {
    speed,
    speedMph,
    latitude,
    longitude,
    accuracy,
    timestamp,
    isTracking,
    error,
    permissionStatus,
    gpsData,
    startTracking,
    stopTracking,
    requestPermission
  }
}
