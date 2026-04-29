import { ref, watch } from 'vue'

export interface WeatherData {
  temperature: number | null // in Celsius
  weatherCode: number | null
  weatherDescription: string
  icon: string
  windSpeed: number | null
  humidity: number | null
}

export const useWeatherData = (latitude: Ref<number | null>, longitude: Ref<number | null>) => {
  const temperature = ref<number | null>(null)
  const weatherCode = ref<number | null>(null)
  const weatherDescription = ref<string>('Loading...')
  const weatherIcon = ref<string>('☀️')
  const windSpeed = ref<number | null>(null)
  const humidity = ref<number | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<number | null>(null)

  // Weather code to description mapping (WMO Weather interpretation codes)
  const getWeatherInfo = (code: number | null): { description: string; icon: string } => {
    if (code === null) return { description: 'Unknown', icon: '❓' }
    
    const weatherMap: Record<number, { description: string; icon: string }> = {
      0: { description: 'Clear sky', icon: '☀️' },
      1: { description: 'Mainly clear', icon: '🌤️' },
      2: { description: 'Partly cloudy', icon: '⛅' },
      3: { description: 'Overcast', icon: '☁️' },
      45: { description: 'Foggy', icon: '🌫️' },
      48: { description: 'Depositing rime fog', icon: '🌫️' },
      51: { description: 'Light drizzle', icon: '🌦️' },
      53: { description: 'Moderate drizzle', icon: '🌦️' },
      55: { description: 'Dense drizzle', icon: '🌧️' },
      61: { description: 'Slight rain', icon: '🌧️' },
      63: { description: 'Moderate rain', icon: '🌧️' },
      65: { description: 'Heavy rain', icon: '⛈️' },
      71: { description: 'Slight snow', icon: '🌨️' },
      73: { description: 'Moderate snow', icon: '❄️' },
      75: { description: 'Heavy snow', icon: '❄️' },
      77: { description: 'Snow grains', icon: '🌨️' },
      80: { description: 'Slight rain showers', icon: '🌦️' },
      81: { description: 'Moderate rain showers', icon: '🌧️' },
      82: { description: 'Violent rain showers', icon: '⛈️' },
      85: { description: 'Slight snow showers', icon: '🌨️' },
      86: { description: 'Heavy snow showers', icon: '❄️' },
      95: { description: 'Thunderstorm', icon: '⛈️' },
      96: { description: 'Thunderstorm with hail', icon: '⛈️' },
      99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
    }

    return weatherMap[code] || { description: 'Unknown', icon: '❓' }
  }

  const fetchWeatherData = async () => {
    if (!latitude.value || !longitude.value) {
      error.value = 'Location not available'
      return
    }

    // Check if we need to update (cache for 10 minutes)
    const now = Date.now()
    if (lastUpdate.value && (now - lastUpdate.value) < 600000) {
      return // Use cached data
    }

    isLoading.value = true
    error.value = null

    try {
      // Open-Meteo API - Free, no API key required
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.value}&longitude=${longitude.value}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      
      if (data.current) {
        temperature.value = Math.round(data.current.temperature_2m)
        weatherCode.value = data.current.weather_code
        windSpeed.value = data.current.wind_speed_10m
        humidity.value = data.current.relative_humidity_2m
        
        const weatherInfo = getWeatherInfo(weatherCode.value)
        weatherDescription.value = weatherInfo.description
        weatherIcon.value = weatherInfo.icon
        
        lastUpdate.value = now
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather data'
      console.error('Weather fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for location changes and fetch weather
  watch([latitude, longitude], () => {
    if (latitude.value && longitude.value) {
      fetchWeatherData()
    }
  }, { immediate: true })

  // Refresh weather data every 10 minutes
  let refreshInterval: NodeJS.Timeout | null = null
  
  onMounted(() => {
    refreshInterval = setInterval(() => {
      fetchWeatherData()
    }, 600000) // 10 minutes
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })

  const weatherData = computed<WeatherData>(() => ({
    temperature: temperature.value,
    weatherCode: weatherCode.value,
    weatherDescription: weatherDescription.value,
    icon: weatherIcon.value,
    windSpeed: windSpeed.value,
    humidity: humidity.value
  }))

  return {
    temperature,
    weatherCode,
    weatherDescription,
    weatherIcon,
    windSpeed,
    humidity,
    isLoading,
    error,
    weatherData,
    fetchWeatherData
  }
}
