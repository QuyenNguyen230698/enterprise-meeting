<template>
  <div class="min-h-screen pt-20">
    <section class="relative py-24 overflow-hidden">
      <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">Liên hệ & Hỗ trợ</span>
        <h1 ref="heroTitle" class="text-4xl md:text-6xl font-bold text-white mb-6 opacity-0">
          Cùng xây dựng
          <span class="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400">hệ sinh thái</span>
        </h1>
        <p ref="heroSubtitle" class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed opacity-0">
          Gửi yêu cầu hỗ trợ hoặc đề xuất tính năng — đội ngũ kỹ thuật sẽ xem xét và phản hồi sớm nhất.
        </p>
      </div>
    </section>

    <!-- Ticket Form Section -->
    <section ref="formSection" class="py-12 relative opacity-0">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="relative p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/10 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">

            <!-- Left: Info -->
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6 tracking-widest uppercase">
                <i class="bi bi-ticket-detailed"></i> Gửi Ticket Hỗ Trợ
              </div>
              <h2 class="text-3xl font-bold text-white mb-6">Bạn cần giúp đỡ?</h2>
              <p class="text-gray-400 mb-8 leading-relaxed">
                Mô tả chi tiết vấn đề bạn gặp phải. Đội ngũ kỹ thuật sẽ tiếp nhận và phản hồi trong thời gian sớm nhất.
              </p>

              <!-- Channels -->
              <div class="space-y-3 mb-8">
                <a href="mailto:quyen.nc.dev@gmail.com" class="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <i class="bi bi-envelope text-lg"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium text-sm">Email hỗ trợ</p>
                    <p class="text-gray-400 text-xs">quyen.nc.dev@gmail.com</p>
                  </div>
                </a>
                <a href="https://github.com/QuyenNguyen230698" target="_blank" class="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div class="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center text-lime-400 shrink-0">
                    <i class="bi bi-github text-lg"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium text-sm">GitHub Repository</p>
                    <p class="text-gray-400 text-xs">github.com/QuyenNguyen230698</p>
                  </div>
                </a>
              </div>

              <!-- Priority donation info -->
              <div class="p-5 rounded-2xl bg-[#0d0d14] border border-white/10">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Hỗ trợ ưu tiên qua donate</p>
                <p class="text-emerald-400 font-mono text-lg tracking-tighter">130607373</p>
                <p class="text-white font-bold text-sm">VPBank — NGUYEN CONG QUYEN</p>
              </div>
            </div>

            <!-- Right: Form -->
            <div class="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
              <!-- Success State -->
              <div v-if="submitted" class="text-center py-8">
                <div class="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <i class="bi bi-check-lg text-emerald-400 text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Ticket đã được gửi!</h3>
                <p class="text-gray-400 text-sm mb-6">Mã ticket: <span class="text-emerald-400 font-mono font-bold">{{ createdTicketNumber }}</span></p>
                <p class="text-gray-400 text-sm mb-6">Đội ngũ kỹ thuật sẽ phản hồi sớm nhất có thể.</p>
                <button @click="resetForm" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-sm font-medium">
                  Gửi ticket khác
                </button>
              </div>

              <!-- Form -->
              <form v-else @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Tên của bạn <span class="text-gray-600 normal-case font-normal">(tuỳ chọn)</span>
                  </label>
                  <input
                    v-model="form.displayName"
                    type="text"
                    placeholder="Để trống sẽ tự tạo tên ẩn danh"
                    class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiêu đề <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.subject"
                    type="text"
                    required
                    placeholder="Mô tả ngắn gọn vấn đề của bạn..."
                    class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Danh mục</label>
                    <select v-model="form.category" class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all text-sm appearance-none cursor-pointer">
                      <option value="question" class="bg-gray-900">Câu hỏi</option>
                      <option value="bug" class="bg-gray-900">Báo lỗi</option>
                      <option value="feature" class="bg-gray-900">Tính năng</option>
                      <option value="billing" class="bg-gray-900">Thanh toán</option>
                      <option value="other" class="bg-gray-900">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mức độ</label>
                    <select v-model="form.priority" class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all text-sm appearance-none cursor-pointer">
                      <option value="low" class="bg-gray-900">Thấp</option>
                      <option value="medium" class="bg-gray-900">Trung bình</option>
                      <option value="high" class="bg-gray-900">Cao</option>
                      <option value="urgent" class="bg-gray-900">Khẩn cấp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email nhận phản hồi</label>
                  <input
                    v-model="form.contactEmail"
                    type="email"
                    placeholder="email@example.com"
                    class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>

                <!-- Transaction ID for priority requests -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Mã giao dịch <span class="text-gray-600 normal-case font-normal">(nếu có donate để ưu tiên)</span>
                  </label>
                  <input
                    v-model="form.transactionId"
                    type="text"
                    placeholder="Để xác thực ưu tiên xử lý"
                    class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả chi tiết <span class="text-red-400">*</span></label>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    required
                    placeholder="Mô tả chi tiết vấn đề, các bước tái hiện lỗi, hoặc tính năng bạn muốn đề xuất..."
                    class="contact-field w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting || !form.subject.trim() || !form.description.trim()"
                  class="w-full py-4 bg-linear-to-r from-emerald-600 to-lime-600 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {{ isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 relative">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div ref="infoSection" class="opacity-0 space-y-4">
            <h2 class="text-2xl font-bold text-white mb-6">Câu hỏi thường gặp</h2>
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="p-5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer"
              @click="activeFaq = activeFaq === index ? null : index"
            >
              <div class="flex justify-between items-center text-white font-medium">
                <span>{{ faq.question }}</span>
                <i class="bi shrink-0 ml-4" :class="activeFaq === index ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
              <div v-if="activeFaq === index" class="mt-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {{ faq.answer }}
              </div>
            </div>
          </div>

          <div class="flex flex-col justify-center">
            <div class="p-10 rounded-[40px] bg-linear-to-br from-emerald-500/5 to-blue-500/5 border border-white/10 text-center">
              <div class="w-20 h-20 mx-auto bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-6">
                <i class="bi bi-geo-alt-fill text-3xl text-emerald-400"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Vietnam</h3>
              <p class="text-gray-400 leading-relaxed mb-8">
                Dự án được phát triển và vận hành tại Việt Nam. Chúng tôi cam kết mang lời giải tốt nhất cho bài toán quản trị doanh nghiệp Việt.
              </p>
              <div class="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <span>Handcrafted with</span>
                <i class="bi bi-heart-fill text-red-500"></i>
                <span>in Vietnam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { useScrollAnimation } from '~/composables/useScrollAnimation'

const { error: showError } = useToast()

definePageMeta({ layout: 'public', auth: false })

const { initScrollAnimations, fadeUp, cleanup } = useScrollAnimation()
const ticketApi = usePublicTicketApi()

const heroTitle = ref(null)
const heroSubtitle = ref(null)
const formSection = ref(null)
const infoSection = ref(null)
const activeFaq = ref(null)
const isSubmitting = ref(false)
const submitted = ref(false)
const createdTicketNumber = ref('')

const form = reactive({
  displayName: '',
  subject: '',
  description: '',
  category: 'question',
  priority: 'medium',
  contactEmail: '',
  transactionId: '',
})

const faqs = [
  {
    question: 'Ticket hỗ trợ được xử lý trong bao lâu?',
    answer: 'Thông thường trong vòng 24-48 giờ làm việc. Ticket có mã giao dịch donate sẽ được ưu tiên review trong 24h và đưa vào bản dev trong 1-2 tuần.',
  },
  {
    question: 'Dữ liệu doanh nghiệp có được bảo mật không?',
    answer: 'Chắc chắn. Chúng tôi sử dụng tiêu chuẩn mã hóa AES-256 cho dữ liệu và không chia sẻ với bất kỳ bên thứ ba nào.',
  },
  {
    question: 'Tôi có thể theo dõi trạng thái ticket không?',
    answer: 'Có. Sau khi gửi, bạn có thể đăng nhập và vào phần cài đặt hoặc nhận thông báo qua email để theo dõi trạng thái xử lý.',
  },
]

const handleSubmit = async () => {
  if (!form.subject.trim() || !form.description.trim()) return

  isSubmitting.value = true
  try {
    const description = form.transactionId
      ? `${form.description}\n\n---\nMã giao dịch: ${form.transactionId}`
      : form.description

    const payload = {
      subject: form.subject,
      description,
      category: form.category,
      priority: form.priority,
      contactEmail: form.contactEmail,
    }
    if (form.displayName.trim()) payload.guestDisplayName = form.displayName.trim()

    const res = await ticketApi.createPublicContactTicket(payload)

    if (res.success) {
      createdTicketNumber.value = res.data.ticketNumber
      submitted.value = true
    } else {
      showError(res.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.')
    }
  } catch {
    showError('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  submitted.value = false
  createdTicketNumber.value = ''
  form.displayName = ''
  form.subject = ''
  form.description = ''
  form.category = 'question'
  form.priority = 'medium'
  form.contactEmail = ''
  form.transactionId = ''
}

onMounted(() => {
  initScrollAnimations()

  const tl = gsap.timeline()
  tl.to(heroTitle.value, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.2)
    .to(heroSubtitle.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')

  nextTick(() => {
    if (formSection.value) fadeUp(formSection.value, { scrollTrigger: { trigger: formSection.value, start: 'top 80%' } })
    if (infoSection.value) fadeUp(infoSection.value, { scrollTrigger: { trigger: infoSection.value, start: 'top 80%' } })
  })
})

onUnmounted(() => cleanup())

useSeoMeta({
  title: 'Liên Hệ & Hỗ Trợ - Enterprise Meeting Tools',
  description: 'Gửi ticket hỗ trợ kỹ thuật hoặc đề xuất tính năng cho đội ngũ Enterprise Meeting Tools. Chúng tôi sẽ phản hồi sớm nhất có thể.',
  keywords: 'liên hệ, hỗ trợ kỹ thuật, Enterprise Meeting Tools, gửi ticket, đề xuất tính năng, support',
  author: 'Enterprise Meeting Tools',
  ogTitle: 'Liên Hệ & Hỗ Trợ - Enterprise Meeting Tools',
  ogDescription: 'Gửi ticket hỗ trợ kỹ thuật hoặc đề xuất tính năng cho đội ngũ Enterprise Meeting Tools.',
  ogImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  ogUrl: 'https://emtools.site/contact',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Liên Hệ & Hỗ Trợ - Enterprise Meeting Tools',
  twitterDescription: 'Gửi ticket hỗ trợ kỹ thuật hoặc đề xuất tính năng cho đội ngũ Enterprise Meeting Tools.',
  twitterImage: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg',
  robots: 'index, follow',
  canonical: 'https://emtools.site/contact',
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&display=swap');
.font-mono { font-family: 'JetBrains Mono', monospace; }

.contact-field {
  color: #fff !important;
  -webkit-text-fill-color: #fff;
}

.contact-field::placeholder {
  color: #6b7280 !important;
  -webkit-text-fill-color: #6b7280;
}

.contact-field option {
  color: #fff;
  background-color: #111827;
}

.contact-field:-webkit-autofill,
.contact-field:-webkit-autofill:hover,
.contact-field:-webkit-autofill:focus {
  -webkit-text-fill-color: #fff !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
