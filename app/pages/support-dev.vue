<template>
  <div class="min-h-screen pt-20">
    <section class="relative py-24 overflow-hidden">
      <!-- Gradient Orbs -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]"></div>
      
      <div class="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Tiếp sức cho 
            <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400">
              Sáng tạo
            </span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Enterprise Meeting là dự án phi lợi nhuận với mong muốn cung cấp giải pháp quản trị miễn phí cho cộng đồng. 
            Mọi sự ủng hộ từ bạn đều trực tiếp giúp duy trì hạ tầng và phát triển các tính năng mới.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div class="relative h-full p-8 md:p-10 bg-[#0d0d14] border border-white/10 rounded-[32px] flex flex-col justify-center text-center">
              <div class="mb-6 flex justify-center">
                <div class="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <i class="bi bi-bank text-4xl text-emerald-400"></i>
                </div>
              </div>
              
              <h3 class="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-sm">Thông tin chuyển khoản</h3>
              
              <div class="space-y-4 text-left bg-white/5 p-6 rounded-2xl border border-white/5">
                <div>
                  <p class="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Ngân hàng</p>
                  <p class="text-white font-semibold">VPBank (Ngân hàng TMCP Việt Nam Thịnh Vượng)</p>
                </div>
                <div class="pt-3 border-t border-white/5">
                  <p class="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Số tài khoản</p>
                  <p class="text-2xl font-mono text-emerald-400 font-bold tracking-tighter leading-none">130607373</p>
                </div>
                <div class="pt-3 border-t border-white/5">
                  <p class="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Chủ tài khoản</p>
                  <p class="text-white font-semibold uppercase">NGUYEN CONG QUYEN</p>
                </div>
              </div>

              <div class="mt-8">
                <p class="text-slate-400 text-sm italic">
                  Nội dung: <span class="text-white">Donate EMTools - [Ten_cua_ban]</span>
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="bi bi-server text-emerald-400"></i> Hạ tầng 24/7
              </h4>
              <p class="text-slate-400 text-sm">Đóng góp của bạn giúp thanh toán chi phí Server, Database và duy trì tốc độ truy cập cao cho hệ thống.</p>
            </div>
            
            <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="bi bi-code-slash text-teal-400"></i> Phát triển tính năng
              </h4>
              <p class="text-slate-400 text-sm">Chúng tôi có thể dành nhiều thời gian hơn để nghiên cứu các công nghệ AI và Mobile giúp tối ưu hóa công việc của bạn.</p>
            </div>

            <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h4 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="bi bi-heart text-lime-400"></i> Nuôi dưỡng đam mê
              </h4>
              <p class="text-slate-400 text-sm">Lời cảm ơn thực tế nhất chính là sự công nhận từ cộng đồng, giúp đội ngũ có thêm động lực sáng tạo.</p>
            </div>
          </div>
        </div>

        <div class="mt-20 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-400 text-sm">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Mọi sự đóng góp đều được trân trọng, dù là nhỏ nhất.
          </div>
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
  title: 'Ủng Hộ Dự Án - Enterprise Meeting Tools',
  description: 'Ủng hộ dự án Enterprise Meeting Tools để chúng tôi tiếp tục duy trì hạ tầng và phát triển các tính năng mới miễn phí cho cộng đồng.',
  keywords: 'ủng hộ, donate, Enterprise Meeting Tools, hỗ trợ dự án, VPBank, phi lợi nhuận',
  author: 'Enterprise Meeting Tools',
  ogTitle: 'Ủng Hộ Dự Án - Enterprise Meeting Tools',
  ogDescription: 'Ủng hộ dự án Enterprise Meeting Tools để chúng tôi tiếp tục duy trì hạ tầng và phát triển các tính năng mới miễn phí cho cộng đồng.',
  ogImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  ogUrl: 'https://emtools.site/support-dev',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Ủng Hộ Dự Án - Enterprise Meeting Tools',
  twitterDescription: 'Ủng hộ dự án Enterprise Meeting Tools để chúng tôi tiếp tục duy trì hạ tầng và phát triển các tính năng mới miễn phí cho cộng đồng.',
  twitterImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  robots: 'index, follow',
  canonical: 'https://emtools.site/support-dev',
})
</script>
