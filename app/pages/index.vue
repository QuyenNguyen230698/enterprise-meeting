<template>
  <div class="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Gradient Orbs -->
      <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-t-400/20 rounded-full blur-[120px] animate-float"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-lime-400/20 rounded-full blur-[100px] animate-float-delayed"></div>
      <!-- <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[80px]"></div> -->

      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center">
          <span class="inline-block px-4 py-1.5 rounded-full font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-sm tracking-wide mb-6 animate-fade-in">
            ENTERPRISE MEETING SOLUTION
          </span>
          <h1 class="text-5xl lg:text-7xl font-black tracking-tight text-lime-600 mb-8 leading-[1.1]">
            Nâng Tầm Không Gian <br>
            <span class="text-emerald-600 italic">Hội Họp Chuyên Nghiệp</span>
          </h1>
          <p class="max-w-2xl mx-auto text-lg text-slate-400 mb-12 leading-relaxed">
            Giải pháp toàn diện cho quản lý phòng họp và tài nguyên doanh nghiệp. Tối ưu hóa hiệu suất làm việc với hệ thống đặt lịch thông minh, minh bạch và hiệu quả.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink 
              to="/dashboard" 
              class="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-lime-500 hover:via-teal-500 hover:to-emerald-500 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25 hover:scale-105"
            >
              Vào Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25 hover:scale-105"
            >
              Tìm hiểu thêm
            </NuxtLink>
          </div>
        </div>

        <!-- Hero Stats/Features Mini -->
        <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl bg-white/3 border border-white/10 hover:bg-white/6 hover:border-white/20 transition-all duration-500">
            <div class="from-cyan-500 to-teal-500 w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="bi bi-calendar-check text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Đặt Lịch Nhanh Chóng</h3>
            <p class="text-slate-400">Đặt phòng họp chỉ trong vài giây với giao diện kéo thả trực quan.</p>
          </div>
          <div class="p-8 rounded-3xl bg-white/3 border border-white/10 hover:bg-white/6 hover:border-white/20 transition-all duration-500">
            <div class="from-red-500 to-rose-500 w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="bi bi-display text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Hiển Thị Trực Quan</h3>
            <p class="text-slate-400">Theo dõi trạng thái phòng họp thời gian thực trên mọi thiết bị.</p>
          </div>
          <div class="p-8 rounded-3xl bg-white/3 border border-white/10 hover:bg-white/6 hover:border-white/20 transition-all duration-500">
            <div class="from-green-500 to-emerald-500 w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="bi bi-shield-lock text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Quản Lý Tập Trung</h3>
            <p class="text-slate-400">Phân quyền người dùng và quản lý tài nguyên doanh nghiệp bảo mật.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted Companies Section -->
    <TrustedCompanies />

    <!-- Project Showcase Section -->
    <ProjectShowcase />

    <!-- Why Choose Us -->
    <section class="py-24 bg-slate-900 text-white overflow-hidden relative opacity-70">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-4xl lg:text-5xl font-black mb-8 leading-tight">
              Tại sao nên chọn <br>
              <span class="text-emerald-400">Enterprise Meeting?</span>
            </h2>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mt-1">
                  <i class="bi bi-check2 text-emerald-400 font-bold"></i>
                </div>
                <p class="text-slate-300">Tối ưu hóa 40% thời gian tìm kiếm và đặt phòng họp.</p>
              </div>
              <div class="flex gap-4">
                <div class="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mt-1">
                  <i class="bi bi-check2 text-emerald-400 font-bold"></i>
                </div>
                <p class="text-slate-300">Tích hợp mượt mà với các hệ thống hiện có của doanh nghiệp.</p>
              </div>
              <div class="flex gap-4">
                <div class="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mt-1">
                  <i class="bi bi-check2 text-emerald-400 font-bold"></i>
                </div>
                <p class="text-slate-300">Báo cáo phân tích sử dụng tài nguyên chi tiết hàng tháng.</p>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square rounded-[40px] bg-emerald-500/10 border border-white/10 p-8 flex items-center justify-center">
               <div class="text-center">
                  <div class="text-8xl font-black text-white mb-2">99%</div>
                  <div class="text-emerald-400 font-bold tracking-widest uppercase">Sự Hài Lòng</div>
               </div>
            </div>
            <!-- Decorative bits -->
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500 blur-[60px] opacity-30"></div>
            <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-lime-500 blur-[80px] opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public',
  auth: false,
})

useSeoMeta({
  title: 'Enterprise Meeting - Giải Pháp Hội Họp Chuyên Nghiệp',
  description: 'Nền tảng quản lý phòng họp và tài nguyên doanh nghiệp hiệu quả nhất.',
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

h1 {
  text-wrap: balance;
}

/* Custom transitions */
.active-scale-95:active {
  transform: scale(0.95);
}
</style>