<template>
  <div class="supercar-speedometer dark" :style="{ '--bg-color': uiSettings.colors.background , 'border-radius': '25px'}">
    <div class="panel">
      <!-- Carbon fiber background -->
      <div class="carbon-bg"></div>
      <div class="radial-bg"></div>

      <!-- CSS Gradient Orbs Background -->
      <div
        class="orbs-bg-container"
        v-show="uiSettings.background.enabled && uiSettings.background.type === 'orbs'"
      >
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <!-- ThreeJS 3D Background -->
      <div
        ref="threeBgContainer"
        class="three-bg-container"
        v-show="uiSettings.background.enabled && uiSettings.background.type !== 'solid' && uiSettings.background.type !== 'orbs' && uiSettings.background.type !== 'image'"
      ></div>

      <!-- Custom Image Background -->
      <div
        class="image-bg-container"
        v-show="uiSettings.background.enabled && uiSettings.background.type === 'image' && backgroundImage"
      >
        <img
          :src="backgroundImage || ''"
          :style="{
            objectFit: uiSettings.background.imageFit,
            opacity: uiSettings.background.imageOpacity
          }"
          alt="Background"
        />
      </div>

      <!-- Main Content -->
      <div class="gauge-container">
        <!-- SVG Gauge -->
        <svg class="gauge-svg" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="tachoGradientSupercar" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" :stop-color="uiSettings.colors.arcGradientStart" stop-opacity="1"/>
              <stop offset="25%" :stop-color="uiSettings.colors.arcGradientStart" stop-opacity="1"/>
              <stop offset="40%" :stop-color="gradientMid1" stop-opacity="1"/>
              <stop offset="60%" :stop-color="gradientMid2" stop-opacity="1"/>
              <stop offset="75%" :stop-color="uiSettings.colors.arcGradientEnd" stop-opacity="1"/>
              <stop offset="100%" :stop-color="uiSettings.colors.arcGradientEnd" stop-opacity="1"/>
            </linearGradient>
            <filter id="glowSupercar">
              <feGaussianBlur result="coloredBlur" stdDeviation="5"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Background arc (solid dark) -->
          <path 
            d="M 90 280 A 210 210 0 1 1 510 280" 
            fill="none" 
            stroke="#1e293b" 
            stroke-linecap="butt" 
            stroke-width="20"
          />

          <!-- Inactive arc (background) - ALWAYS dashed -->
          <path 
            d="M 110 280 A 190 190 0 1 1 490 280" 
            fill="none" 
            :stroke="uiSettings.colors.numberInactive" 
            stroke-dasharray="4 6"
            stroke-linecap="butt" 
            stroke-width="25"
          />

          <!-- Active gradient arc - DASHED mode -->
          <g v-if="uiSettings.showDashedLines">
            <defs>
              <mask id="dashedProgressMask">
                <path 
                  d="M 110 280 A 190 190 0 1 1 490 280" 
                  fill="none" 
                  stroke="white"
                  :stroke-dasharray="`${arcLength} ${arcLength}`"
                  :stroke-dashoffset="arcDashOffset"
                  stroke-width="25"
                />
              </mask>
            </defs>
            
            <path 
              ref="activeArc"
              d="M 110 280 A 190 190 0 1 1 490 280" 
              fill="none" 
              stroke="url(#tachoGradientSupercar)" 
              stroke-dasharray="4 6"
              stroke-linecap="butt" 
              stroke-width="25"
              filter="url(#glowSupercar)"
              mask="url(#dashedProgressMask)"
              class="active-arc"
            />
          </g>

          <!-- Active gradient arc - SOLID mode -->
          <path 
            v-else
            ref="activeArcSolid"
            d="M 110 280 A 190 190 0 1 1 490 280" 
            fill="none" 
            stroke="url(#tachoGradientSupercar)" 
            :stroke-dasharray="`${arcLength} ${arcLength}`"
            :stroke-dashoffset="arcDashOffset"
            stroke-linecap="butt" 
            stroke-width="25"
            filter="url(#glowSupercar)"
            class="active-arc"
          />



          <!-- Speed Numbers around arc -->
          <g :fill="uiSettings.colors.numberInactive" font-family="Orbitron, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">
            <!-- All numbers use numberActive color -->
            <text :fill="speedLevel >= 0 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" font-size="26" x="55" y="265">0</text>
            <text :fill="speedLevel >= 1 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="75" y="205">1</text>
            <text :fill="speedLevel >= 2 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="100" y="152">2</text>
            <text :fill="speedLevel >= 3 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="145" y="108">3</text>
            <text :fill="speedLevel >= 4 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="200" y="75">4</text>
            <text :fill="speedLevel >= 5 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" font-size="28" x="300" y="52" :class="{ 'glow-text-yellow': speedLevel >= 5 }">5</text>
            <text :fill="speedLevel >= 6 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="400" y="75">6</text>
            <text :fill="speedLevel >= 7 ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive" x="455" y="108">7</text>
            <text :fill="speedLevel >= 8 ? uiSettings.colors.arcGradientEnd : uiSettings.colors.numberInactive" x="500" y="152">8</text>
            <text :fill="speedLevel >= 9 ? uiSettings.colors.arcGradientEnd : uiSettings.colors.numberInactive" x="525" y="205">9</text>
            <text :fill="speedLevel >= 10 ? uiSettings.colors.arcGradientEnd : uiSettings.colors.numberInactive" font-size="26" x="545" y="265" :class="{ 'glow-text-red': speedLevel >= 10 }">10</text>
          </g>
        </svg>

        <!-- Center Speed Display -->
        <div class="center-display">
          <div class="speed-number" :style="{ textShadow: `0 0 20px ${uiSettings.colors.numberActive}88, 0 0 40px ${uiSettings.colors.numberActive}66` }">{{ displaySpeed }}</div>
          <div class="speed-unit" :style="{ background: `${uiSettings.colors.numberActive}33`, borderColor: `${uiSettings.colors.numberActive}88`, color: uiSettings.colors.numberActive, boxShadow: `0 0 10px ${uiSettings.colors.numberActive}bb` }">{{ unit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useSpeedometerUISettings } from '~/composables/useSpeedometerUISettings'
import { useThreeBackground } from '~/composables/useThreeBackground'

interface Props {
  speed: number
  maxSpeed?: number
  unit?: string
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  maxSpeed: 200,
  unit: 'km/h',
  theme: 'dark'
})

// Get UI settings for colors
const { settings: uiSettingsRef, backgroundImage } = useSpeedometerUISettings()
const uiSettings = computed(() => uiSettingsRef.value)

// Smooth animated speed display
const animatedSpeed = ref(0)
let animationFrame: number | null = null

// Smoothly interpolate speed changes
watch(() => props.speed, (newSpeed) => {
  const animate = () => {
    const diff = newSpeed - animatedSpeed.value
    const step = diff * 0.15 // Smooth interpolation factor
    
    if (Math.abs(diff) < 0.1) {
      animatedSpeed.value = newSpeed
      animationFrame = null
    } else {
      animatedSpeed.value += step
      animationFrame = requestAnimationFrame(animate)
    }
  }
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  animate()
}, { immediate: true })

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

const displaySpeed = computed(() => Math.round(animatedSpeed.value))

// Helper function to mix two hex colors
const mixColors = (color1: string, color2: string, weight: number): string => {
  const hex = (x: number) => {
    const h = x.toString(16)
    return h.length === 1 ? '0' + h : h
  }
  
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)
  
  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)
  
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
  
  return '#' + hex(r) + hex(g) + hex(b)
}

// Computed gradient colors for smooth transitions
const gradientMid1 = computed(() => mixColors(uiSettings.value.colors.arcGradientStart, uiSettings.value.colors.arcGradientEnd, 0.3))
const gradientMid2 = computed(() => mixColors(uiSettings.value.colors.arcGradientStart, uiSettings.value.colors.arcGradientEnd, 0.7))

// Calculate arc point positions for dashed lines
const getArcPoint = (speedMark: number) => {
  const centerX = 300
  const centerY = 280
  const radius = 190
  
  // Arc goes from left (110, 280) to right (490, 280)
  // Total angle is PI radians (180 degrees)
  const startAngle = Math.PI // Left side
  const anglePerMark = Math.PI / 10 // Divide PI by 10 marks
  const angle = startAngle - (speedMark * anglePerMark)
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}


// ThreeJS background
const { start: startBg, stop: stopBg, dispose: disposeBg } = useThreeBackground()
const threeBgContainer = ref<HTMLElement | null>(null)

// Watch for background changes - watch the ref directly for reactivity
watch(
  () => uiSettingsRef.value.background,
  (bg) => {
    // Wait for next tick to ensure container is available
    setTimeout(() => {
      const container = threeBgContainer.value
      const needsThreeJS = bg.enabled && bg.type !== 'solid' && bg.type !== 'orbs' && bg.type !== 'image'

      if (needsThreeJS && container) {
        startBg(container as HTMLElement, bg.type as any)
      } else {
        stopBg()
      }
    }, 50)
  },
  { deep: true, immediate: true }
)

onUnmounted(() => {
  disposeBg()
})

// Speed level (0-10) - each number = 10 km/h
// 50 km/h = 5, 100 km/h = 10
// Use animatedSpeed for smoother transitions
const speedLevel = computed(() => {
  return Math.min(Math.floor(animatedSpeed.value / 10), 10)
})

// Progress percentage for clip-path (0-100 km/h range on gauge)
const progressPercent = computed(() => {
  return Math.min((animatedSpeed.value / 100) * 100, 100)
})

// Arc calculations for stroke-dashoffset animation
const arcLength = computed(() => {
  // Arc is a semicircle with radius 190
  // Length = π * r = π * 190 ≈ 597
  return Math.PI * 190
})

const arcDashOffset = computed(() => {
  // Start from full arc (hidden) and reveal as speed increases
  // Offset decreases from arcLength to 0 as speed goes 0 to 100
  const progress = Math.min(animatedSpeed.value / 100, 1)
  return arcLength.value * (1 - progress)
})


</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;500;700&display=swap');

.supercar-speedometer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color, #050505);
  font-family: 'Rajdhani', monospace;
}

.panel {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  max-height: 100%;
  background: var(--bg-color, #0f1115);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.carbon-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
  pointer-events: none;
  z-index: 0;
}

.radial-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at center, rgba(0, 229, 255, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.three-bg-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}

.image-bg-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

// CSS Gradient Orbs Background (giống trang chủ)
.orbs-bg-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
}

.orb-1 {
  top: 25%;
  left: -25%;
  width: 60%;
  height: 80%;
  background: rgba(99, 102, 241, 0.2);
  filter: blur(120px);
  animation: float-orb 8s ease-in-out infinite;
}

.orb-2 {
  bottom: 25%;
  right: -25%;
  width: 50%;
  height: 70%;
  background: rgba(168, 85, 247, 0.2);
  filter: blur(100px);
  animation: float-orb-delayed 10s ease-in-out infinite;
}

.orb-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 60%;
  background: rgba(6, 182, 212, 0.1);
  filter: blur(80px);
}

@keyframes float-orb {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes float-orb-delayed {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(-5deg);
  }
}

.gauge-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.gauge-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.active-arc {
  transition: clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-text {
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.7));
}

.glow-text-red {
  filter: drop-shadow(0 0 10px rgba(255, 0, 60, 0.7));
}

.glow-text-orange {
  filter: drop-shadow(0 0 10px rgba(255, 171, 0, 0.7));
}

.glow-text-yellow {
  filter: drop-shadow(0 0 10px rgba(255, 235, 0, 0.7));
}

.glow-text-red-orange {
  filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.7));
}

.center-display {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
}

.speed-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 130px;
  font-weight: 900;
  color: white;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.speed-unit {
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

// Responsive
@media (max-width: 768px) {
  .speed-number {
    font-size: 120px;
  }
}

@media (max-width: 480px) {
  .speed-number {
    font-size: 80px;
  }
}
</style>
