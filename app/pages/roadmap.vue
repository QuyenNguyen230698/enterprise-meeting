<template>
  <div class="min-h-screen pt-20">
    <section class="relative py-24 overflow-hidden">
      <!-- Gradient Orbs -->
      <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[120px] animate-float"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-lime-400/20 rounded-full blur-[100px] animate-float-delayed"></div>
      
      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
          Lộ Trình <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400">Phát Triển 2026</span>
        </h1>
        <p class="text-slate-400 mb-16 text-lg max-w-2xl mx-auto leading-relaxed">
          Chúng tôi không chỉ xây dựng công cụ đặt lịch, chúng tôi đang kiến tạo một hệ điều hành thông minh giúp doanh nghiệp tối ưu hóa mọi nguồn lực hiện có.
        </p>
        
        <div class="space-y-6 text-left">
          <div class="p-8 bg-white/5 border border-emerald-500/30 rounded-[32px] hover:bg-white/10 transition-all duration-500 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4">
              <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">Đang triển khai</span>
            </div>
            <h3 class="font-bold text-xl mb-4 text-white flex items-center gap-3">
              <i class="bi bi-calendar-check text-emerald-400 text-2xl"></i>
              Q2 2026: Hệ sinh thái đồng bộ (Sync Core)
            </h3>
            <div class="ml-9 space-y-4">
              <p class="text-slate-400">Tích hợp sâu với Google Calendar và Microsoft 365 để quản lý lịch biểu tập trung.</p>
              <div class="flex flex-wrap gap-2">
                <span class="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-300">Google OAuth 2.0</span>
                <span class="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-300">Outlook Integration</span>
                <span class="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-300">Real-time Notification</span>
              </div>
            </div>
          </div>

          <div class="p-8 bg-white/3 border border-white/10 rounded-[32px] hover:bg-white/6 transition-all duration-300 group">
            <h3 class="font-bold text-xl mb-4 text-white flex items-center gap-3">
              <i class="bi bi-phone text-blue-400 text-2xl"></i>
              Q3 2026: Mobile Mobility & QR Access
            </h3>
            <div class="ml-9 space-y-4">
              <p class="text-slate-400">Ra mắt ứng dụng di động và hệ thống Check-in bằng mã QR tại cửa phòng họp.</p>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-500">
                <li class="flex items-center gap-2"><i class="bi bi-check2 text-emerald-500"></i> App iOS & Android Native</li>
                <li class="flex items-center gap-2"><i class="bi bi-check2 text-emerald-500"></i> QR Code Room Identity</li>
              </ul>
            </div>
          </div>

          <div class="p-8 bg-white/3 border border-white/10 rounded-[32px] hover:bg-white/6 transition-all duration-300 group">
            <h3 class="font-bold text-xl mb-4 text-white flex items-center gap-3">
              <i class="bi bi-cpu text-purple-400 text-2xl"></i>
              Q4 2026: AI Meeting Assistant & Analytics
            </h3>
            <div class="ml-9 space-y-4">
              <p class="text-slate-400">Sử dụng AI để gợi ý thời gian họp tối ưu và báo cáo hiệu suất sử dụng tài nguyên doanh nghiệp.</p>
              <p class="text-sm text-slate-500 italic">"Tự động giải phóng phòng họp nếu không có người check-in sau 10 phút."</p>
            </div>
          </div>
        </div>

        <div class="mt-32">
          <div class="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">Tầm nhìn 2027</div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-12">Hướng tới văn phòng thông minh</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div class="p-6 bg-white/2 border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <div class="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i class="bi bi-graph-up text-emerald-400"></i>
              </div>
              <h4 class="text-white font-bold mb-2">Resource Analytics</h4>
              <p class="text-slate-500 text-sm">Thống kê chi tiết tần suất sử dụng thiết bị, giúp doanh nghiệp đưa ra quyết định đầu tư đúng đắn.</p>
            </div>

            <div class="p-6 bg-white/2 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all group">
              <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i class="bi bi-patch-check text-blue-400"></i>
              </div>
              <h4 class="text-white font-bold mb-2">E-Office Integration</h4>
              <p class="text-slate-500 text-sm">Kết nối không giới hạn với các nền tảng quản lý công việc như Jira, Slack, Trello.</p>
            </div>

            <div class="p-6 bg-white/2 border border-white/5 rounded-2xl hover:border-lime-500/20 transition-all group">
              <div class="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i class="bi bi-lightbulb text-lime-400"></i>
              </div>
              <h4 class="text-white font-bold mb-2">Energy Saving</h4>
              <p class="text-slate-500 text-sm">Tích hợp IoT để tự động tắt thiết bị điện khi phòng họp trống, bảo vệ môi trường.</p>
            </div>
          </div>
        </div>

        <div class="mt-32 p-10 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-[40px] border border-white/10">
          <h3 class="text-2xl font-bold text-white mb-4">Bạn mong chờ tính năng nào nhất?</h3>
          <p class="text-slate-400 mb-8">Chúng tôi luôn lắng nghe nhu cầu thực tế của doanh nghiệp để ưu tiên phát triển.</p>
          <button class="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-all active:scale-95">
            Đề xuất tính năng mới
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public',
  auth: false
})

useSeoMeta({
  title: 'Lộ Trình Phát Triển - Enterprise Meeting Tools',
  description: 'Lộ trình phát triển 2026 của Enterprise Meeting Tools. Khám phá các tính năng sắp tới: tích hợp Google Calendar, ứng dụng mobile, AI Meeting Assistant và hơn thế nữa.',
  keywords: 'lộ trình phát triển, roadmap, Enterprise Meeting Tools, tính năng mới, 2026, Google Calendar, mobile app, AI meeting',
  author: 'Enterprise Meeting Tools',
  ogTitle: 'Lộ Trình Phát Triển - Enterprise Meeting Tools',
  ogDescription: 'Lộ trình phát triển 2026 của Enterprise Meeting Tools. Khám phá các tính năng sắp tới.',
  ogImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  ogUrl: 'https://emtools.site/roadmap',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Lộ Trình Phát Triển - Enterprise Meeting Tools',
  twitterDescription: 'Lộ trình phát triển 2026 của Enterprise Meeting Tools. Khám phá các tính năng sắp tới.',
  twitterImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  robots: 'index, follow',
  canonical: 'https://emtools.site/roadmap',
})
</script>
