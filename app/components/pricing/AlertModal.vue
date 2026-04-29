<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="onClose">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <!-- Modal -->
        <div class="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div :class="[
            'relative p-6 pb-4',
            type === 'error' ? 'bg-red-600/20' : type === 'success' ? 'bg-green-600/20' : 'bg-blue-600/20'
          ]">
            <div class="flex items-center gap-3">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'
              ]">
                <i :class="[
                  'text-white text-xl',
                  type === 'error' ? 'bi bi-x-circle' : type === 'success' ? 'bi bi-check-circle' : 'bi bi-info-circle'
                ]"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white">{{ title }}</h3>
              </div>
              <button 
                @click="onClose"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <i class="bi bi-x text-white text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-gray-300 mb-6">{{ message }}</p>

            <!-- Action -->
            <button
              @click="onClose"
              :class="[
                'w-full py-3 px-4 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-200',
                type === 'error' ? 'bg-red-600 hover:shadow-lg hover:shadow-red-500/25' : 
                type === 'success' ? 'bg-green-600 hover:shadow-lg hover:shadow-green-500/25' : 
                'bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25'
              ]"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'info', 'success', 'error'
    validator: (value) => ['info', 'success', 'error'].includes(value)
  },
  title: {
    type: String,
    default: 'Thông báo'
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
