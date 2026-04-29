<template>
  <div class="weather-display" :class="{ 'weather-loading': isLoading }">
    <div v-if="error" class="weather-error">
      <span class="weather-icon">⚠️</span>
      <span class="weather-text">Weather unavailable</span>
    </div>
    <div v-else class="weather-content">
      <div class="weather-icon">{{ weatherIcon }}</div>
      <div class="weather-temp">{{ displayTemperature }}°C</div>
      <!-- <div class="weather-desc">{{ weatherDescription }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  temperature: number | null
  weatherDescription: string
  weatherIcon: string
  isLoading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null
})

const displayTemperature = computed(() => {
  if (props.temperature === null) return '--'
  return Math.round(props.temperature)
})
</script>

<style scoped lang="scss">
.weather-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  min-width: 140px;
}

.weather-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.weather-icon {
  font-size: 1.5rem;
  text-align: center;
}

.weather-temp {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.weather-desc {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.weather-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  color: rgba(239, 68, 68, 0.8);
  text-align: center;
}

.weather-loading {
  opacity: 0.6;
}
</style>
