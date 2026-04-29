<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-200 overflow-hidden"
  >
    <!-- Left Curtain -->
    <div 
      ref="curtainLeft" 
      class="absolute top-0 left-0 w-1/2 h-full bg-[#0a0a0f] will-change-transform"
    >
      <!-- Left side content -->
      <div class="absolute inset-0 flex items-center justify-end pr-4">
        <div ref="textLeft" class="text-right overflow-hidden">
          <div class="text-[8vw] md:text-[6vw] font-black text-white leading-none tracking-tighter opacity-0">
            EM
          </div>
        </div>
      </div>
    </div>

    <!-- Right Curtain -->
    <div 
      ref="curtainRight" 
      class="absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0f] will-change-transform"
    >
      <!-- Right side content -->
      <div class="absolute inset-0 flex items-center justify-start pl-4">
        <div ref="textRight" class="text-left overflow-hidden">
          <div class="text-[8vw] md:text-[6vw] font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 leading-none tracking-tighter opacity-0">
            Tools
          </div>
        </div>
      </div>
    </div>

    <!-- Center Line -->
    <div 
      ref="centerLine" 
      class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-emerald-500 to-transparent opacity-0"
    ></div>

    <!-- Loading indicator -->
    <div ref="loadingIndicator" class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0">
      <div class="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div 
          ref="progressFill"
          class="h-full bg-linear-to-r from-emerald-500 to-lime-500 rounded-full origin-left"
          style="transform: scaleX(0)"
        ></div>
      </div>
      <p class="text-gray-500 text-xs tracking-[0.3em] uppercase">Loading</p>
    </div>

    <!-- Subtle grain overlay -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise"></div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['complete'])

const isVisible = ref(true)

const curtainLeft = ref(null)
const curtainRight = ref(null)
const textLeft = ref(null)
const textRight = ref(null)
const centerLine = ref(null)
const loadingIndicator = ref(null)
const progressFill = ref(null)

onMounted(() => {
  // Disable scroll during loading
  document.body.style.overflow = 'hidden'
  
  const tl = gsap.timeline()

  // Entrance animation
  tl.to(centerLine.value, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, 0)

  tl.to(textLeft.value.children[0], {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, 0.2)

  tl.to(textRight.value.children[0], {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, 0.3)

  tl.to(loadingIndicator.value, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, 0.4)

  // Progress animation
  tl.to(progressFill.value, {
    scaleX: 1,
    duration: props.duration / 1000 - 0.8,
    ease: 'power1.inOut'
  }, 0.6)

  // Exit animation - curtain reveal
  tl.to(centerLine.value, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in'
  }, `+=${0.2}`)

  tl.to(loadingIndicator.value, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.in'
  }, '<')

  tl.to([textLeft.value.children[0], textRight.value.children[0]], {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in'
  }, '<')

  // Curtain slide out
  tl.to(curtainLeft.value, {
    x: '-100%',
    duration: 1.2,
    ease: 'power4.inOut'
  }, '-=0.1')

  tl.to(curtainRight.value, {
    x: '100%',
    duration: 1.2,
    ease: 'power4.inOut',
    onComplete: () => {
      document.body.style.overflow = ''
      isVisible.value = false
      emit('complete')
    }
  }, '<')

  // Set initial states
  gsap.set(textLeft.value.children[0], { x: 50, opacity: 0 })
  gsap.set(textRight.value.children[0], { x: -50, opacity: 0 })
  gsap.set(loadingIndicator.value, { y: 20, opacity: 0 })
})
</script>

<style scoped>
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
</style>
