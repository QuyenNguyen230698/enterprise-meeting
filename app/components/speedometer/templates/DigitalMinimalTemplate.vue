<template>
  <div class="digital-minimal">
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

    <!-- Main Content -->
    <div class="content">
      <!-- Top Bar - Speed Segments -->
      <div class="speed-segments">
        <div
          v-for="i in 10"
          :key="i"
          class="segment"
          :class="{ active: speedLevel >= i }"
          :style="{ 
            background: speedLevel >= i ? segmentGradient(i) : uiSettings.colors.numberInactive,
            boxShadow: speedLevel >= i ? `0 0 20px ${uiSettings.colors.arcGradientEnd}` : 'none'
          }"
        ></div>
      </div>

      <!-- Center - Large Speed Display -->
      <div class="speed-display">
        <div class="speed-number" :style="{ color: uiSettings.colors.numberActive }">
          {{ Math.round(speed) }}
        </div>
        <div class="speed-unit" :style="{ color: uiSettings.colors.numberInactive }">
          {{ unit }}
        </div>
      </div>

      <!-- Bottom - Progress Bar -->
      <div class="progress-container">
        <div class="progress-bg" :style="{ background: uiSettings.colors.numberInactive }"></div>
        <div 
          class="progress-fill"
          :class="{ dashed: uiSettings.showDashedLines }"
          :style="{ 
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, ${uiSettings.colors.arcGradientStart}, ${uiSettings.colors.arcGradientEnd})`,
            boxShadow: `0 0 15px ${uiSettings.colors.arcGradientEnd}`
          }"
        ></div>
      </div>

      <!-- Speed Level Numbers -->
      <div class="level-numbers">
        <span
          v-for="i in 11"
          :key="i"
          :style="{ color: speedLevel >= (i - 1) ? uiSettings.colors.numberActive : uiSettings.colors.numberInactive }"
        >
          {{ (i - 1) * 10 }}
        </span>
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
const progressPercent = computed(() => Math.min((props.speed / 100) * 100, 100))

// Gradient for each segment
const segmentGradient = (index: number) => {
  const ratio = index / 10
  return `linear-gradient(135deg, ${uiSettings.value.colors.arcGradientStart}, ${uiSettings.value.colors.arcGradientEnd})`
}
</script>

<style scoped lang="scss">
.digital-minimal {
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

.content {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.speed-segments {
  display: flex;
  gap: 0.5rem;
  height: 8px;

  .segment {
    flex: 1;
    border-radius: 4px;
    transition: all 0.3s ease;
    opacity: 0.3;

    &.active {
      opacity: 1;
    }
  }
}

.speed-display {
  text-align: center;

  .speed-number {
    font-size: 120px;
    font-weight: 100;
    line-height: 1;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: -0.05em;
    transition: color 0.3s ease;
  }

  .speed-unit {
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 0.5rem;
    transition: color 0.3s ease;
  }
}

.progress-container {
  position: relative;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;

  .progress-bg {
    position: absolute;
    inset: 0;
    opacity: 0.2;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease, box-shadow 0.3s ease;
    border-radius: 2px;

    &.dashed {
      background-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 4px,
        rgba(0, 0, 0, 0.3) 4px,
        rgba(0, 0, 0, 0.3) 8px
      );
      background-size: 8px 100%;
    }
  }
}

.level-numbers {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Helvetica Neue', Arial, sans-serif;

  span {
    transition: color 0.3s ease;
  }
}
</style>
