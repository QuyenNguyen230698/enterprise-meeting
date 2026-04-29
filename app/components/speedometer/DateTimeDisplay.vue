<template>
  <div class="datetime-display">
    <div class="time">{{ formattedTime }}</div>
    <div class="date">{{ formattedDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref(new Date())

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

let intervalId: NodeJS.Timeout | null = null

onMounted(() => {
  // Update time every second
  intervalId = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped lang="scss">
.datetime-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.55rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.time {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.date {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  text-transform: capitalize;
}
</style>
