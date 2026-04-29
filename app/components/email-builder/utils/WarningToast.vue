<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="show"
        style="z-index: 999999 !important"
        class="fixed top-16 right-4 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm"
      >
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span class="text-sm font-medium">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
