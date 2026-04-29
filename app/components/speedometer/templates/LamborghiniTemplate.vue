<template>
  <div class="lambo-dashboard">
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

    <!-- Main Dashboard SVG -->
    <svg class="dashboard-svg" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Dynamic gradient based on color presets -->
        <linearGradient id="lamboGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" :stop-color="uiSettings.colors.arcGradientStart" stop-opacity="1"/>
          <stop offset="50%" :stop-color="gradientMid" stop-opacity="1"/>
          <stop offset="100%" :stop-color="uiSettings.colors.arcGradientEnd" stop-opacity="1"/>
        </linearGradient>

        <!-- Glow filter -->
        <filter id="lamboGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Strong glow for center text -->
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Background gradient -->
        <radialGradient id="bgGradient" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stop-color="#1a3a4a"/>
          <stop offset="100%" :stop-color="uiSettings.colors.background"/>
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect x="0" y="0" width="500" height="300" fill="url(#bgGradient)"/>

      <!-- RPM Arc Background - always dashed -->
      <path
        :d="rpmArcPath"
        fill="none"
        :stroke="uiSettings.colors.numberInactive"
        stroke-width="18"
        stroke-linecap="butt"
        stroke-dasharray="4 6"
      />

      <!-- RPM Arc Active - DASHED mode -->
      <g v-if="uiSettings.showDashedLines">
        <defs>
          <mask id="lamboProgressMask">
            <path
              :d="rpmArcPath"
              fill="none"
              stroke="white"
              stroke-width="18"
              :stroke-dasharray="`${arcLength} ${arcLength}`"
              :stroke-dashoffset="arcDashOffset"
            />
          </mask>
        </defs>
        
        <path
          :d="rpmArcPath"
          fill="none"
          stroke="url(#lamboGradient)"
          stroke-width="18"
          stroke-linecap="butt"
          stroke-dasharray="4 6"
          filter="url(#lamboGlow)"
          mask="url(#lamboProgressMask)"
          class="rpm-active"
        />
      </g>

      <!-- RPM Arc Active - SOLID mode -->
      <path
        v-else
        :d="rpmArcPath"
        fill="none"
        stroke="url(#lamboGradient)"
        stroke-width="18"
        stroke-linecap="butt"
        :stroke-dasharray="`${arcLength} ${arcLength}`"
        :stroke-dashoffset="arcDashOffset"
        filter="url(#lamboGlow)"
        class="rpm-active"
      />

      <!-- RPM Tick Marks and Numbers -->
      <g class="rpm-ticks">
        <g v-for="tick in rpmTicks" :key="tick.value">
          <!-- Tick lines -->
          <line
            :x1="tick.x1"
            :y1="tick.y1"
            :x2="tick.x2"
            :y2="tick.y2"
            :stroke="tick.value <= currentRpm ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive"
            :stroke-width="2"
            :filter="tick.value <= currentRpm ? 'url(#lamboGlow)' : 'none'"
          />
          <!-- RPM Numbers -->
          <text
            :x="tick.labelX"
            :y="tick.labelY"
            class="rpm-label"
            :fill="tick.value <= currentRpm ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive"
            text-anchor="middle"
            :filter="tick.value <= currentRpm ? 'url(#lamboGlow)' : 'none'"
          >
            {{ tick.value }}
          </text>
        </g>
      </g>

      <!-- Center Display: N when stopped, Speed when moving -->
      <text
        x="250"
        y="200"
        class="center-display"
        :fill="speed > 0 ? uiSettings.colors.numberActive : '#FFFFFF'"
        text-anchor="middle"
        filter="url(#strongGlow)"
      >
        {{ centerDisplay }}
      </text>

      <!-- Unit label below center (only when moving) -->
      <text
        v-if="speed > 0"
        x="250"
        y="235"
        class="center-unit"
        :fill="uiSettings.colors.numberInactive"
        text-anchor="middle"
      >
        {{ unit }}
      </text>
    </svg>
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

// Get UI settings
const { settings: uiSettingsRef, backgroundImage } = useSpeedometerUISettings()
const uiSettings = computed(() => uiSettingsRef.value)

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

// Gradient middle color
const gradientMid = computed(() => mixColors(uiSettings.value.colors.arcGradientStart, uiSettings.value.colors.arcGradientEnd, 0.5))

// ThreeJS background
const { start: startBg, stop: stopBg, dispose: disposeBg } = useThreeBackground()
const threeBgContainer = ref<HTMLElement | null>(null)

// Watch for background changes
watch(
  () => uiSettingsRef.value.background,
  (bg) => {
    const container = threeBgContainer.value
    const needsThreeJS = bg.enabled && bg.type !== 'solid' && bg.type !== 'orbs' && bg.type !== 'image'

    if (needsThreeJS && container) {
      startBg(container as HTMLElement, bg.type)
    } else {
      stopBg()
    }
  },
  { deep: true, immediate: false }
)

// Initialize ThreeJS background on mount
onMounted(() => {
  const container = threeBgContainer.value
  const bg = uiSettingsRef.value.background
  const needsThreeJS = bg.enabled && bg.type !== 'solid' && bg.type !== 'orbs' && bg.type !== 'image'

  if (needsThreeJS && container) {
    setTimeout(() => {
      const el = threeBgContainer.value
      if (el) {
        startBg(el as HTMLElement, bg.type)
      }
    }, 100)
  }
})

onUnmounted(() => {
  disposeBg()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

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

// Center display: N when stopped, speed when moving
const centerDisplay = computed(() => {
  if (animatedSpeed.value < 1) return 'N'
  return Math.round(animatedSpeed.value).toString()
})

// Convert speed to RPM (0-10 scale)
const currentRpm = computed(() => {
  return Math.min(animatedSpeed.value / 10, 10)
})


// RPM Arc path
const rpmArcPath = computed(() => {
  const centerX = 250
  const centerY = 220
  const radius = 160
  const startAngle = -155
  const endAngle = -25

  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180

  const x1 = centerX + radius * Math.cos(startRad)
  const y1 = centerY + radius * Math.sin(startRad)
  const x2 = centerX + radius * Math.cos(endRad)
  const y2 = centerY + radius * Math.sin(endRad)

  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
})

// Arc calculations for stroke-dashoffset animation
const arcLength = computed(() => {
  // Arc is 130 degrees of a circle with radius 160
  return (130 / 360) * 2 * Math.PI * 160
})

const arcDashOffset = computed(() => {
  const progress = Math.min(animatedSpeed.value / 100, 1)
  return arcLength.value * (1 - progress)
})

// Generate RPM ticks (0-10)
const rpmTicks = computed(() => {
  const result = []
  const centerX = 250
  const centerY = 220
  const outerRadius = 140
  const innerRadius = 130
  const labelRadius = 115

  for (let i = 0; i <= 10; i++) {
    const angle = -155 + (i / 10) * 130
    const rad = (angle * Math.PI) / 180

    const x1 = centerX + innerRadius * Math.cos(rad)
    const y1 = centerY + innerRadius * Math.sin(rad)
    const x2 = centerX + outerRadius * Math.cos(rad)
    const y2 = centerY + outerRadius * Math.sin(rad)
    const labelX = centerX + labelRadius * Math.cos(rad)
    const labelY = centerY + labelRadius * Math.sin(rad) + 5

    result.push({
      value: i,
      x1, y1, x2, y2,
      labelX, labelY
    })
  }

  return result
})
</script>

<style scoped lang="scss">
.lambo-dashboard {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  border-radius: 25px;
  overflow: hidden;
}

.three-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}

.image-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.orbs-bg-container {
  position: absolute;
  inset: 0;
  z-index: 0;
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

.dashboard-svg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.rpm-active {
  transition: stroke-dashoffset 0.3s ease;
}

.rpm-label {
  font-size: 16px;
  font-weight: 600;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: fill 0.3s ease;
}

.center-display {
  font-size: 80px;
  font-weight: 400;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.05em;
  transition: fill 0.3s ease;
}

.center-unit {
  font-size: 14px;
  font-weight: 500;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.15em;
  text-transform: lowercase;
}
</style>

