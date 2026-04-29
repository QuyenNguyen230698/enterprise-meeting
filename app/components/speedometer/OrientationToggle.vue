<template>
  <button 
    class="orientation-toggle"
    @click="$emit('toggle')"
    :class="{ 'is-landscape': isLandscape }"
    :title="isLandscape ? 'Switch to Portrait' : 'Switch to Landscape'"
  >
    <svg 
      class="icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <rect 
        v-if="isLandscape"
        x="2" 
        y="5" 
        width="20" 
        height="14" 
        rx="2"
      />
      <rect 
        v-else
        x="5" 
        y="2" 
        width="14" 
        height="20" 
        rx="2"
      />
    </svg>
    <span class="label">{{ isLandscape ? 'Landscape' : 'Portrait' }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  isLandscape: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
</script>

<style scoped lang="scss">
.orientation-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s ease;
  }

  &.is-landscape .icon {
    transform: rotate(90deg);
  }

  .label {
    user-select: none;
  }
}
</style>
