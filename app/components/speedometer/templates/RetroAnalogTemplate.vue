<template>
  <div class="retro-analog">
    <!-- Background containers -->
    <div
      class="orbs-bg-container"
      v-show="uiSettings.background.enabled && uiSettings.background.type === 'orbs'"
    >
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div
      ref="threeBgContainer"
      class="three-bg-container"
      v-show="uiSettings.background.enabled && uiSettings.background.type !== 'solid' && uiSettings.background.type !== 'orbs' && uiSettings.background.type !== 'image'"
    ></div>

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

    <!-- Main SVG Gauge -->
    <svg class="gauge-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Gradient for needle and arc -->
        <linearGradient id="retroGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" :stop-color="uiSettings.colors.arcGradientStart" />
          <stop offset="100%" :stop-color="uiSettings.colors.arcGradientEnd" />
        </linearGradient>

        <!-- Glow filter -->
        <filter id="retroGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Radial background -->
        <radialGradient id="retroBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" :stop-color="uiSettings.colors.background" stop-opacity="0.8"/>
          <stop offset="100%" :stop-color="uiSettings.colors.background" stop-opacity="1"/>
        </radialGradient>
      </defs>

      <!-- Background circle -->
      <circle cx="200" cy="200" r="180" :fill="uiSettings.colors.background" opacity="0.3"/>
      <circle cx="200" cy="200" r="170" fill="none" :stroke="uiSettings.colors.numberInactive" stroke-width="1" opacity="0.3"/>

      <!-- Outer ring - inactive -->
      <circle 
        cx="200" 
        cy="200" 
        r="160" 
        fill="none" 
        :stroke="uiSettings.colors.numberInactive"
        :stroke-width="uiSettings.showDashedLines ? 20 : 20"
        :stroke-dasharray="uiSettings.showDashedLines ? '8 4' : 'none'"
        opacity="0.2"
        stroke-linecap="butt"
      />

      <!-- Active arc - DASHED mode -->
      <g v-if="uiSettings.showDashedLines">
        <defs>
          <mask id="retroProgressMask">
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="white"
              stroke-width="20"
              :stroke-dasharray="`${circumference} ${circumference}`"
              :stroke-dashoffset="dashOffset"
              transform="rotate(-90 200 200)"
            />
          </mask>
        </defs>
        
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="url(#retroGradient)"
          stroke-width="20"
          stroke-dasharray="8 4"
          stroke-linecap="butt"
          filter="url(#retroGlow)"
          mask="url(#retroProgressMask)"
        />
      </g>

      <!-- Active arc - SOLID mode -->
      <circle
        v-else
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke="url(#retroGradient)"
        stroke-width="20"
        :stroke-dasharray="`${circumference} ${circumference}`"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 200 200)"
        stroke-linecap="butt"
        filter="url(#retroGlow)"
      />

      <!-- Speed markers -->
      <g v-for="i in 11" :key="i">
        <line
          :x1="markerPoints(i - 1).x1"
          :y1="markerPoints(i - 1).y1"
          :x2="markerPoints(i - 1).x2"
          :y2="markerPoints(i - 1).y2"
          :stroke="speedLevel >= (i - 1) ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive"
          stroke-width="3"
          stroke-linecap="round"
        />
        <text
          :x="markerPoints(i - 1).textX"
          :y="markerPoints(i - 1).textY"
          :fill="speedLevel >= (i - 1) ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive"
          text-anchor="middle"
          class="marker-text"
        >
          {{ (i - 1) * 10 }}
        </text>
      </g>

      <!-- Center speed display -->
      <text
        x="200"
        y="200"
        text-anchor="middle"
        class="speed-text"
        :fill="uiSettings.colors.numberActive"
        filter="url(#retroGlow)"
      >
        {{ Math.round(speed) }}
      </text>

      <!-- Unit -->
      <text
        x="200"
        y="240"
        text-anchor="middle"
        class="unit-text"
        :fill="uiSettings.colors.numberInactive"
      >
        {{ unit }}
      </text>

      <!-- Needle -->
      <g :transform="`rotate(${needleAngle} 200 200)`">
        <line
          x1="200"
          y1="200"
          x2="200"
          y2="60"
          stroke="url(#retroGradient)"
          stroke-width="4"
          stroke-linecap="round"
          filter="url(#retroGlow)"
        />
        <circle
          cx="200"
          cy="200"
          r="8"
          :fill="uiSettings.colors.arcGradientEnd"
          filter="url(#retroGlow)"
        />
      </g>
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
}

const props = withDefaults(defineProps<Props>(), {
  maxSpeed: 100,
  unit: 'km/h'
})

const { settings: uiSettingsRef, backgroundImage } = useSpeedometerUISettings()
const uiSettings = computed(() => uiSettingsRef.value)

const { start: startBg, stop: stopBg, dispose: disposeBg } = useThreeBackground()
const threeBgContainer = ref<HTMLElement | null>(null)

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
  { deep: true }
)

onMounted(() => {
  const bg = uiSettingsRef.value.background
  const needsThreeJS = bg.enabled && bg.type !== 'solid' && bg.type !== 'orbs' && bg.type !== 'image'
  if (needsThreeJS && threeBgContainer.value) {
    setTimeout(() => {
      if (threeBgContainer.value) {
        startBg(threeBgContainer.value as HTMLElement, bg.type)
      }
    }, 100)
  }
})

onUnmounted(() => {
  disposeBg()
})

const speedLevel = computed(() => Math.min(Math.floor(props.speed / 10), 10))

// Circle calculations
const circumference = computed(() => 2 * Math.PI * 160)
const dashOffset = computed(() => {
  const progress = Math.min(props.speed / 100, 1)
  return circumference.value * (1 - progress)
})

// Needle angle (0-100 speed = -135 to 135 degrees)
const needleAngle = computed(() => {
  const progress = Math.min(props.speed / 100, 1)
  return -135 + (progress * 270)
})

// Marker positions
const markerPoints = (index: number) => {
  const angle = -135 + (index / 10) * 270
  const rad = (angle * Math.PI) / 180
  
  const innerRadius = 135
  const outerRadius = 150
  const textRadius = 115
  
  return {
    x1: 200 + innerRadius * Math.cos(rad),
    y1: 200 + innerRadius * Math.sin(rad),
    x2: 200 + outerRadius * Math.cos(rad),
    y2: 200 + outerRadius * Math.sin(rad),
    textX: 200 + textRadius * Math.cos(rad),
    textY: 200 + textRadius * Math.sin(rad) + 5
  }
}
</script>

<style scoped lang="scss">
.retro-analog {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  overflow: hidden;
  background: #0a0a0a;
}

.three-bg-container,
.image-bg-container,
.orbs-bg-container {
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

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb-1 {
  top: 20%;
  left: -20%;
  width: 50%;
  height: 60%;
  background: rgba(99, 102, 241, 0.2);
  animation: float-orb 8s ease-in-out infinite;
}

.orb-2 {
  bottom: 20%;
  right: -20%;
  width: 45%;
  height: 55%;
  background: rgba(168, 85, 247, 0.2);
  animation: float-orb-delayed 10s ease-in-out infinite;
}

.orb-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35%;
  height: 50%;
  background: rgba(6, 182, 212, 0.1);
}

@keyframes float-orb {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes float-orb-delayed {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

.gauge-svg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
}

.marker-text {
  font-size: 18px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  transition: fill 0.3s ease;
}

.speed-text {
  font-size: 80px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  transition: fill 0.3s ease;
}

.unit-text {
  font-size: 16px;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
