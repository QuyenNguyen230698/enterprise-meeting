<template>
  <div class="min-h-screen w-full relative bg-[#020617] text-white overflow-hidden flex flex-col">
    
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div v-for="n in 12" :key="n" :class="['orb', `orb-${n}`]"></div>
    </div> 

    <div class="relative z-10 flex-1 flex flex-col justify-between p-8 md:p-16">
      
      <div class="flex justify-between items-center">
        <NuxtLink to="/">
          <EMLogo
            :variant="isDarkTheme ? 'light' : 'dark'"
            :width="100"
            :height="50"
          />
        </NuxtLink>
        <div class="text-right hidden sm:block">
          <p class="text-sm uppercase tracking-[0.3em] opacity-40">Enterprise<br/>Meeting Portal</p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center space-y-12 text-center">
        <div class="space-y-4">
          <h1 class="textSubBanner font-black tracking-wider leading-none drop-shadow-2xl">
            Brand
            <span class="text-[#00ff9d] textSubBanner tracking-wider">Guidelines</span>
          </h1>
          <p class="textSubBanner uppercase tracking-[0.4em] font-bold opacity-60">
            Enterprise Meeting
          </p>
        </div>

        <div class="w-full max-w-72">
          <button
            @click="loginWithGoogle"
            class="w-full text-sm font-bold flex items-center justify-center gap-4 px-4 py-3 bg-white text-black rounded-full transition-all duration-300 hover:bg-slate-100 hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-[1.05] active:scale-[0.98]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              class="w-6 h-6"
              alt="Google"
            />
            CONTINUE WITH GOOGLE
          </button>
          <p class="mt-6 text-xss uppercase tracking-widest opacity-40">
            Secure single sign-on access
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10 text-[10px] uppercase tracking-widest opacity-60 font-medium">
        <div>
          <p class="text-[#00ff9d] mb-2 font-bold">Address</p>
          <p>Thoi An Ward, 12 District, Ho Chi Minh City, Viet Nam</p>
        </div>
        <div>
          <p class="text-[#00ff9d] mb-2 font-bold">Contact</p>
          <p>Phone: +84 7788 23698</p>
        </div>
        <div>
          <p class="text-[#00ff9d] mb-2 font-bold">Support</p>
          <p>Email: quyen.nc.dev@gmail.com</p>
          <p>Web: www.emtools.site</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const loginWithGoogle = () => {
  const { googleAuth } = useAppConfig();
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: googleAuth.redirectUri,
    client_id: googleAuth.clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
  };
  window.location.href = `${rootUrl}?${new URLSearchParams(options).toString()}`;
};
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

/* Sử dụng delay âm (ví dụ: -3s, -7s) để các bong bóng "chạy trước" 
  ngay khi trang vừa load, giúp màn hình không bị trống.
*/
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
</style>