<template>
  <div class="min-h-screen relative bg-[#020617] flex items-center justify-center text-white">
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div v-for="n in 12" :key="n" :class="['orb', `orb-${n}`]"></div>
    </div>
    <div class="text-center space-y-6">
      <div v-if="loading" class="space-y-4 bg-white/20 flex flex-col items-center justify-center w-[500px] h-[300px] rounded-2xl">
        <div class="relative w-20 h-20 mx-auto">
          <div class="absolute inset-0 border-4 border-[#00ff9d]/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-[#00ff9d] rounded-full animate-spin"></div>
        </div>
        <h2 class="text-2xl font-bold tracking-tight">Authenticating...</h2>
        <p class="text-slate-400">Verifying your Google account details.</p>
      </div>

      <div v-else-if="error" class="space-y-4 bg-white/20 flex flex-col items-center justify-center w-[500px] h-[300px] rounded-2xl">
        <div class="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
          <Icon name="ph:warning-circle-bold" class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-red-500">Authentication Failed</h2>
        <p class="text-slate-400">{{ errorMessage }}</p>
        <button 
          @click="navigateTo('/login')"
          class="px-6 py-2 bg-[#00ff9d] text-[#020617] rounded-xl font-bold uppercase hover:bg-[#05ff96] transition-all"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const route = useRoute();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const code = route.query.code;

  if (!code) {
    error.value = true;
    loading.value = false;
    errorMessage.value = 'No authentication code received from Google.';
    return;
  }

  try {
    const result = await authStore.loginWithGoogle(code);
    
    if (result.success) {
      // Redirect to home or dashboard
      navigateTo('/dashboard');
    } else {
      error.value = true;
      errorMessage.value = result.message || 'Failed to authenticate with our server.';
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = 'An unexpected error occurred during login.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* BACKGROUND ANIMATION */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  transform: scale(0.1);
  animation: grow-and-fade 10s infinite ease-in-out;
}

@keyframes grow-and-fade {
  0% { opacity: 0; transform: scale(0.1) translate(0, 0); }
  30% { opacity: 0.4; }
  60% { opacity: 0.2; transform: scale(1.5) translate(20px, -40px); }
  100% { opacity: 0; transform: scale(1.8) translate(40px, -80px); }
}


/* Các cấu hình màu sắc và vị trí ngẫu nhiên cho bong bóng */
.orb-1  { width: 400px; height: 400px; background: #10b981; top: 10%; left: 5%; animation-delay: -2s; }
.orb-2  { width: 500px; height: 500px; background: #14b8a6; bottom: 10%; right: 5%; animation-delay: -5s; }
.orb-3  { width: 300px; height: 300px; background: #84cc16; top: 50%; left: 20%; animation-delay: -8s; }
.orb-4  { width: 450px; height: 450px; background: #10b981; top: 70%; left: 40%; animation-delay: -1s; }
.orb-5  { width: 350px; height: 350px; background: #14b8a6; top: 15%; right: 20%; animation-delay: -6s; }
.orb-6  { width: 250px; height: 250px; background: #84cc16; bottom: 30%; left: 10%; animation-delay: -4s; }
.orb-7  { width: 500px; height: 500px; background: #10b981; top: -5%; left: 60%; animation-delay: -9s; }
.orb-8  { width: 300px; height: 300px; background: #14b8a6; bottom: 45%; right: 10%; animation-delay: -3s; }
.orb-9  { width: 350px; height: 350px; background: #84cc16; top: 40%; right: 40%; animation-delay: -7s; }
.orb-10 { width: 400px; height: 400px; background: #002537; top: 20%; left: 30%; animation-delay: -2.5s; }
.orb-11 { width: 250px; height: 250px; background: #10b981; bottom: 15%; left: 50%; animation-delay: -8.5s; }
.orb-12 { width: 380px; height: 380px; background: #14b8a6; top: 5%; right: 45%; animation-delay: -4.5s; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
