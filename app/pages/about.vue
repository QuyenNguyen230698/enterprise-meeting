<template>
  <div class="min-h-screen pt-20">
    <!-- Hero Section -->
    <section class="relative py-32 overflow-hidden">
      <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[120px] animate-float"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-lime-400/20 rounded-full blur-[100px] animate-float-delayed"></div>

      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10 pb-32">
        <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
          Hệ sinh thái EMTools
        </span>
        <h1 ref="heroTitle" class="text-4xl md:text-6xl font-bold text-white mb-6 opacity-0">
          Nâng tầm hiệu suất
          <span class="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400">
            cho doanh nghiệp
          </span>
        </h1>
        <p ref="heroSubtitle" class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed opacity-0">
          Từ quản lý phòng họp thông minh Enterprise Meeting đến tiếp thị khách hàng chuyên nghiệp. 
          Chúng tôi xây dựng công cụ giúp tối ưu hóa mọi nguồn lực của bạn.
        </p>
      </div>
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <i class="bi bi-megaphone text-2xl text-emerald-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Marketing Tools</h3>
            <p class="text-gray-400">Trình soạn thảo email kéo thả chuyên nghiệp, giúp doanh nghiệp tiếp cận khách hàng mục tiêu hiệu quả và tiết kiệm nhất.</p>
          </div>
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-lime-500/30 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-lime-500/20 flex items-center justify-center mb-6">
              <i class="bi bi-calendar-check text-2xl text-lime-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Enterprise Meeting</h3>
            <p class="text-gray-400">Giải pháp đặt lịch phòng họp và quản lý tài nguyên tập trung, minh bạch. Tối ưu hóa không gian làm việc hiện đại.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section ref="missionSection" class="py-24 relative">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6">
              Sứ mệnh
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              Số hóa quản trị doanh nghiệp
            </h2>
            <p class="text-gray-400 text-lg leading-relaxed mb-8">
              EMTools được tạo ra với khát vọng cung cấp những công cụ quản lý và marketing chuẩn doanh nghiệp hoàn toàn miễn phí. 
              Chúng tôi tin rằng công nghệ tốt nhất là công nghệ mà bất kỳ ai cũng có thể tiếp cận.
            </p>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <i class="bi bi-check-lg text-emerald-400"></i>
                </div>
                <span class="text-gray-300">Enterprise Meeting: Quản lý phòng họp minh bạch</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <i class="bi bi-check-lg text-teal-400"></i>
                </div>
                <span class="text-gray-300">Email Marketing: Kéo thả chuyên nghiệp, không giới hạn</span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="relative bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
              <div class="grid grid-cols-2 gap-6">
                <div class="stat-card p-6 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
                  <div class="text-4xl font-bold text-white mb-2">100%</div>
                  <div class="text-gray-400 text-sm">Miễn phí & Mở</div>
                </div>
                <div class="stat-card p-6 rounded-2xl bg-linear-to-br from-lime-500/20 to-lime-500/5 border border-lime-500/20">
                  <div class="text-4xl font-bold text-white mb-2">∞</div>
                  <div class="text-gray-400 text-sm">Không giới hạn</div>
                </div>
                <div class="stat-card p-6 rounded-2xl bg-linear-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/20">
                  <div class="text-4xl font-bold text-white mb-2">24/7</div>
                  <div class="text-gray-400 text-sm">Vận hành ổn định</div>
                </div>
                <div class="stat-card p-6 rounded-2xl bg-linear-to-br from-emerald-400/20 to-emerald-400/5 border border-emerald-400/20">
                  <div class="text-4xl font-bold text-white mb-2">
                    <i class="bi bi-heart-fill text-3xl text-emerald-400"></i>
                  </div>
                  <div class="text-gray-400 text-sm">Made in Vietnam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section ref="timelineSection" class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-emerald-500/5 to-transparent"></div>
      
      <div class="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-lime-500/10 text-lime-400 text-sm font-medium mb-6">
            Hành trình
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Câu chuyện của EMTools
          </h2>
        </div>

        <div class="relative">
          <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-emerald-500 via-teal-500 to-lime-500"></div>
          <div class="space-y-12">
            <div v-for="(item, index) in timeline" :key="index" class="timeline-item relative flex items-start gap-8" :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
              <div class="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-linear-to-br from-emerald-500 to-lime-500 transform -translate-x-1/2 border-4 border-[#0a0a0f] z-10"></div>
              <div class="ml-16 md:ml-0 md:w-[calc(50%-2rem)] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm" :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                <span class="text-sm text-emerald-400 font-medium uppercase tracking-widest">{{ item.date }}</span>
                <h3 class="text-xl font-semibold text-white mt-2 mb-3">{{ item.title }}</h3>
                <p class="text-gray-400 text-sm">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section ref="teamSection" class="py-24 relative">
      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span class="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6">
          Founder & Developer
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-16">
          Người đứng sau EMTools
        </h2>
        <div class="flex justify-center">
          <div class="team-card group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20">
            <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-emerald-500 to-lime-500 p-1">
              <div class="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                <i class="bi bi-person-fill text-5xl text-gray-400"></i>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Nguyễn Công Quyền</h3>
            <p class="text-emerald-400 mb-4 font-bold text-sm">Full-stack Developer</p>
            <p class="text-gray-400 text-sm mb-6">
              Đam mê xây dựng hệ sinh thái công cụ hỗ trợ doanh nghiệp Việt Nam vận hành thông minh và hiệu quả hơn.
            </p>
            <div class="flex items-center justify-center gap-4">
              <a href="mailto:quyen.nc.dev@gmail.com" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/10"><i class="bi bi-envelope"></i></a>
              <a href="https://github.com/QuyenNguyen230698" target="_blank" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/10"><i class="bi bi-github"></i></a>
            </div>
            <div class="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/10 to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section ref="valuesSection" class="py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            Giá trị cốt lõi
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Những điều chúng tôi tin tưởng
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(value, index) in values" 
            :key="index"
            class="value-card relative p-8 rounded-3xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 hover:border-white/20 transition-all duration-500"
          >
            <div class="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
              :class="value.gradient"
            >
              <i :class="value.icon" class="text-2xl text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">{{ value.title }}</h3>
            <p class="text-gray-400">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]"></div>
      
      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">
          Muốn hỗ trợ dự án?
        </h2>
        <p class="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
          EM là dự án mã nguồn mở. Mọi đóng góp đều được trân trọng!
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/support-dev" 
            class="group relative px-8 py-4 bg-linear-to-r from-emerald-600 via-teal-600 to-lime-600 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              <i class="bi bi-heart-fill"></i>
              Ủng hộ dự án
            </span>
          </NuxtLink>
          <a 
            href="https://github.com/QuyenNguyen230698"
            target="_blank"
            class="px-8 py-4 bg-white/5 text-white rounded-full font-semibold text-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <span class="flex items-center justify-center gap-2">
              <i class="bi bi-github"></i>
              GitHub
            </span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { useScrollAnimation } from '~/composables/useScrollAnimation'

definePageMeta({
  layout: 'public',
  auth: false
})

const { initScrollAnimations, fadeUp, staggerElements, cleanup } = useScrollAnimation()

// Check if mobile
const isMobile = ref(false)

// Refs
const heroTitle = ref(null)
const heroSubtitle = ref(null)
const missionSection = ref(null)
const timelineSection = ref(null)
const teamSection = ref(null)
const valuesSection = ref(null)

// Data
const timeline = [
  {
    date: '2024',
    title: 'Ý tưởng ra đời',
    description: 'Nhận ra nhu cầu về một công cụ email marketing miễn phí và dễ sử dụng cho cộng đồng Việt Nam.'
  },
  {
    date: 'Q1 2025',
    title: 'Phát triển MVP',
    description: 'Bắt đầu phát triển phiên bản đầu tiên với các tính năng cơ bản: editor, gửi email, quản lý danh sách.'
  },
  {
    date: 'Q2 2025',
    title: 'Ra mắt Beta',
    description: 'Phát hành phiên bản beta cho người dùng đầu tiên, nhận feedback và cải thiện.'
  },
  {
    date: 'Tương lai',
    title: 'Phát triển liên tục',
    description: 'Liên tục cập nhật tính năng mới, cải thiện trải nghiệm người dùng dựa trên feedback.'
  }
]

const values = [
  {
    icon: 'bi bi-unlock-fill',
    title: 'Miễn phí & Mở',
    description: 'Chúng tôi tin vào việc cung cấp công cụ chất lượng miễn phí cho mọi người.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: 'bi bi-people-fill',
    title: 'Cộng đồng',
    description: 'Xây dựng và phát triển cùng cộng đồng, lắng nghe mọi góp ý.',
    gradient: 'from-teal-500 to-lime-500'
  },
  {
    icon: 'bi bi-lightning-fill',
    title: 'Đơn giản & Hiệu quả',
    description: 'Tập trung vào trải nghiệm người dùng đơn giản nhưng mạnh mẽ.',
    gradient: 'from-lime-500 to-emerald-500'
  }
]

// Animations
const animateHero = () => {
  if (!heroTitle.value || !heroSubtitle.value) return
  
  // On mobile, show immediately
  if (isMobile.value) {
    gsap.set([heroTitle.value, heroSubtitle.value], { opacity: 1, y: 0 })
    return
  }
  
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  
  gsap.set([heroTitle.value, heroSubtitle.value], { y: 30 })
  
  tl.to(heroTitle.value, { opacity: 1, y: 0, duration: 1 }, 0.2)
    .to(heroSubtitle.value, { opacity: 1, y: 0, duration: 0.8 }, 0.4)
}

onMounted(() => {
  // Detect mobile
  isMobile.value = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)
  
  initScrollAnimations()
  animateHero()

  nextTick(() => {
    // Mission section
    if (missionSection.value) {
      fadeUp(missionSection.value, {
        scrollTrigger: {
          trigger: missionSection.value,
          start: 'top 80%'
        }
      })
    }

    // Timeline items
    if (timelineSection.value) {
      const items = timelineSection.value.querySelectorAll('.timeline-item')
      staggerElements(items, {
        y: 40,
        stagger: 0.2,
        scrollTrigger: {
          trigger: timelineSection.value,
          start: 'top 80%'
        }
      })
    }

    // Team card
    if (teamSection.value) {
      fadeUp(teamSection.value.querySelector('.team-card'), {
        scrollTrigger: {
          trigger: teamSection.value,
          start: 'top 80%'
        }
      })
    }

    // Values
    if (valuesSection.value) {
      const cards = valuesSection.value.querySelectorAll('.value-card')
      staggerElements(cards, {
        y: 40,
        stagger: 0.15,
        scrollTrigger: {
          trigger: valuesSection.value,
          start: 'top 80%'
        }
      })
    }
  })
})

onUnmounted(() => {
  cleanup()
})

// SEO Configuration
useSeoMeta({
  title: 'Về Chúng Tôi - EMTools',
  description: 'Tìm hiểu về EM - Nền tảng Email Marketing miễn phí. Sứ mệnh, tầm nhìn và giá trị cốt lõi của chúng tôi.',
  keywords: 'về chúng tôi, EMTools, giới thiệu, sứ mệnh, tầm nhìn, Email Marketing, đội ngũ',
  author: 'EMTools',
  ogTitle: 'Về Chúng Tôi - EMTools',
  ogDescription: 'Tìm hiểu về EM - Nền tảng Email Marketing miễn phí.',
  ogImage: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public',
  ogUrl: 'https://EMTools.info/about',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Về Chúng Tôi - EMTools',

  twitterDescription: 'Tìm hiểu về EM - Nền tảng Email Marketing miễn phí.',
  twitterImage: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public',
  robots: 'index, follow',
  canonical: 'https://EMTools.info/about'
})

// Structured Data for SEO
// useSchemaOrg([
//   {
//     '@type': 'WebPage',
//     name: 'Về Chúng Tôi - EMTools',
//     description: 'Tìm hiểu về EM - Nền tảng Email Marketing và công cụ chuyển đổi file miễn phí. Sứ mệnh, tầm nhìn và giá trị cốt lõi.',
//     url: 'https://EMTools.info/about',
//     inLanguage: 'vi-VN',
//     isPartOf: {
//       '@type': 'WebSite',
//       name: 'EMTools',
//       url: 'https://EMTools.info'
//     }
//   },
//   {
//     '@type': 'Organization',
//     name: 'EMTools',
//     description: 'Nền tảng Email Marketing và công cụ chuyển đổi file miễn phí',
//     url: 'https://EMTools.info',
//     logo: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public',
//     contactPoint: {
//       '@type': 'ContactPoint',
//       email: 'anh.leduc2512@gmail.com',
//       contactType: 'customer service',
//       availableLanguage: ['Vietnamese']
//     },
//     sameAs: [
//       'https://EMTools.info'
//     ]
//   },
//   {
//     '@type': 'FAQPage',
//     mainEntity: [
//       {
//         '@type': 'Question',
//         name: 'EM là gì?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'EM là nền tảng toàn diện cung cấp công cụ Email Marketing chuyên nghiệp và công cụ chuyển đổi file miễn phí, giúp cá nhân và doanh nghiệp tối ưu hóa công việc hàng ngày.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'Sứ mệnh của EM là gì?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Sứ mệnh của EM là cung cấp các công cụ Marketing và chuyển đổi file miễn phí, chất lượng cao cho mọi người, giúp democratize công nghệ Marketing.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'EM có những sản phẩm nào?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'EM cung cấp Email Builder với drag & drop, công cụ gửi email hàng loạt, template gallery, analytics và công cụ chuyển đổi file PDF/Word.'
//         }
//       }
//     ]
//   }
// ])
</script>

<style scoped>
.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>
