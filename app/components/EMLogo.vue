<template>
  <div class="logo-wrapper" 
    :class="variant"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <svg
      :width="height" 
      :height="height" 
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-square"
    >
      <defs>
        <linearGradient id="emGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669" /> 
          <stop offset="50%" stop-color="#10b981" /> 
          <stop offset="100%" stop-color="#84cc16" /> 
        </linearGradient>

        <linearGradient id="emSmokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      
      <rect
        width="100"
        height="100"
        rx="24"
        class="base-rect"
      />

      <g class="icon-text-group">
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          fill="url(#emGreenGradient)"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="44"
          font-weight="900"
          letter-spacing="-3"
        >
          EM
        </text>
      </g>

      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx="23"
        stroke="url(#emSmokeGradient)"
        stroke-width="0.5"
        stroke-opacity="0.5"
      />
    </svg>

    <div v-if="showText" class="brand-text-group" :style="{ fontSize: (Number(height) * 0.7) + 'px' }">
      <span class="text-em">EM</span>
      <span class="text-tools">Tools</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: [Number, String],
    default: 160
  },
  height: {
    type: [Number, String],
    default: 40
  },
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* -------------------------
   THEME LOGIC
-------------------------- */
/* LIGHT THEME */
.light .base-rect {
  fill: #F3F4F6;
}
.light .text-em {
  color: #1e293b;
}

/* DARK THEME */
.dark .base-rect {
  fill: #1e293b;
}
.dark .text-em {
  color: #ffffff;
}

/* -------------------------
   STYLING & ANIMATIONS
-------------------------- */
.logo-square {
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.base-rect {
  transition: fill 0.3s ease;
}

.brand-text-group {
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: 800;
  letter-spacing: -0.8px;
  display: flex;
  align-items: center;
  gap: 4px
}

.text-em {
  transition: color 0.3s ease;
}

.text-tools {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #84cc16 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* HOVER EFFECTS */
.logo-wrapper:hover .logo-square {
  transform: scale(1.08);
}

.logo-wrapper:hover .base-rect {
  fill: #000000;
}

.logo-wrapper:hover .text-em {
  color: #10b981; /* Chữ EM đổi màu xanh khi hover */
}
</style>