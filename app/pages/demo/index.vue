<template>
    <div class="loading-screen">
        <div class="stars">
            <span v-for="i in 80" :key="i" class="star" :style="starStyle(i)" />
        </div>
        <div class="grid-lines" />
        <div class="center-content">
            <div class="logo-wrapper">
                <div class="logo-fallback">Emtools<sup>site</sup></div>
            </div>
            <div class="tagline">Initializing HRM</div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" />
            </div>
        </div>
    </div>
</template>

<script setup>
// definePageMeta({ middleware: ['auth', 'permission'] })
definePageMeta({
  layout: 'blank',
  auth: false,
});

function starStyle(i) {
    const seed = i * 137.508
    const x = (Math.sin(seed) * 0.5 + 0.5) * 100
    const y = (Math.cos(seed * 1.3) * 0.5 + 0.5) * 100
    const size = 6 + (i % 3) * 4
    const delay = (i % 7) * 0.3
    const duration = 2 + (i % 4)
    return {
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
    }
}
</script>

<style lang="scss" scoped>
.loading-screen {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, #047857 0%, #0f766e 40%, #4d7c0f 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 9999;
}

/* Stars */
.stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.star {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    animation: twinkle ease-in-out infinite;
    clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
}

@keyframes twinkle {
    0%, 100% { opacity: 0.1; transform: scale(0.8) rotate(0deg); }
    50%       { opacity: 0.7; transform: scale(1.2) rotate(45deg); }
}

/* Perspective grid at bottom */
.grid-lines {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55%;
    background-image:
        linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 100%),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 80px),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 80px);
    transform: perspective(600px) rotateX(40deg);
    transform-origin: bottom center;
    pointer-events: none;
}

/* Center content */
.center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 1;
}

.logo-wrapper {
    margin-bottom: 4px;
}

.logo-fallback {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.05em;

    sup {
        font-size: 0.5em;
        vertical-align: super;
        font-weight: 400;
        letter-spacing: 0.1em;
    }
}

.tagline {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-family: sans-serif;
}

/* Indeterminate progress bar */
.progress-bar-track {
    width: 160px;
    height: 3px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 9999px;
    overflow: hidden;
    margin-top: 6px;
    position: relative;
}

.progress-bar-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40%;
    border-radius: 9999px;
    background: #fff;
    animation: bounce-fill 1s ease-in-out infinite alternate;
}

@keyframes bounce-fill {
    0%   { left: -20%; }
    100% { left: 80%; }
}
</style>
