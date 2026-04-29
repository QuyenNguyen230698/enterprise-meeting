<template>
  <div style="z-index: 99999999 !important" class="fixed top-4 right-4  space-y-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto rounded-lg shadow-lg p-4 min-w-[300px] max-w-md',
          'flex items-center gap-3 backdrop-blur-sm',
          toastStyles[toast.type]
        ]"
      >
        <div class="shrink-0">
          <i :class="toastIcons[toast.type]"></i>
        </div>
        <div class="flex-1 text-sm font-medium">
          {{ toast.message }}
        </div>
        <button
          @click="remove(toast.id)"
          class="shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <i class="bi bi-x-lg text-xs"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()

const toastStyles = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}

const toastIcons = {
  success: 'bi bi-check-circle-fill text-green-600 text-lg',
  error: 'bi bi-x-circle-fill text-red-600 text-lg',
  warning: 'bi bi-exclamation-triangle-fill text-yellow-600 text-lg',
  info: 'bi bi-info-circle-fill text-blue-600 text-lg'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
</style>
