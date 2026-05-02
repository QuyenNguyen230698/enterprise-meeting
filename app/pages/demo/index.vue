<template>
    <div class="loading-screen">
        <!-- Giữ nguyên Stars logic của bạn -->
        <div class="stars">
            <span v-for="i in 20" :key="i" class="star" :style="starStyle(i)" />
        </div>

        <!-- Cấu trúc Grid mới để fix bug hiển thị -->
        <div class="grid-lines-wrapper">
            <div class="grid-plane" />
        </div>

        <!-- Giữ nguyên Content của bạn -->
        <div class="center-content">
            <div class="logo-wrapper">
                <div class="text-xl md:text-2xl uppercase text-white font-bold tracking-wider">Emtools</div>
            </div>
            <div class="tagline">Initializing HRM</div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" />
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] })

// Giữ nguyên function starStyle gốc của bạn
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
    z-index: 999;
}

/* --- Stars: Giữ nguyên class của bạn --- */
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

/* --- Rebuilt Grid: Đứng yên và không bị mất góc --- */
.grid-lines-wrapper {
    position: absolute;
    inset: 0;
    perspective: 600px; /* Tạo chiều sâu */
    perspective-origin: 50% 40%; 
    z-index: 0;
}

.grid-plane {
    position: absolute;
    top: 30%; /* Bắt đầu từ khoảng giữa màn hình đổ xuống */
    left: 25%;
    right: 25%;
    width: 50%;
    height: 100%;
    
    background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px; /* Kích thước ô vuông */
    
    transform: rotateX(70deg);
    transform-origin: top center;
    
    /* Dùng mask để tạo đầu kia của lưới mờ dần vào nền, không bị cắt cụt */
    mask-image: linear-gradient(to bottom, 
        rgba(0, 0, 0, 0) 0%, 
        rgba(0, 0, 0, 1) 30%, 
        rgba(0, 0, 0, 1) 100%
    );
}

/* --- Content: Giữ nguyên style của bạn --- */
.center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 10; /* Đảm bảo nằm trên lưới */
}
.logo-wrapper { margin-bottom: 4px; }
.tagline {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}

/* --- Progress Bar: Giữ nguyên bounce-fill của bạn --- */
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