<template>
  <div class="flex-1 min-h-0 flex flex-col bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200">
      <div class="px-6 py-3">
        <div class="mb-3">
          <NuxtLink to="/support" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <i class="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </NuxtLink>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i class="bi bi-plus-lg text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Tạo Ticket Mới</h1>
            <p class="text-sm text-gray-500 mt-0.5">Gửi yêu cầu hỗ trợ kỹ thuật</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-6xl mx-auto px-6 py-6">
        <form id="ticketForm" @submit.prevent="submitTicket" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Left Column -->
          <div class="space-y-6">

            <!-- Subject + Category + Priority -->
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label class="block text-sm font-medium text-gray-900 mb-2">Tiêu đề <span class="text-red-500">*</span></label>
              <input
                v-model="form.subject"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                placeholder="Mô tả ngắn gọn vấn đề"
                required
              />

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">Danh mục <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select v-model="form.category" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="question">Câu hỏi</option>
                      <option value="bug">Báo lỗi</option>
                      <option value="feature">Yêu cầu tính năng</option>
                      <option value="billing">Thanh toán</option>
                      <option value="other">Khác</option>
                    </select>
                    <i class="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">Mức độ ưu tiên <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select v-model="form.priority" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                    <i class="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Email -->
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label class="block text-sm font-medium text-gray-900 mb-2">Email nhận thông báo</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="bi bi-envelope text-gray-400"></i>
                </div>
                <input
                  v-model="form.contactEmail"
                  type="email"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  placeholder="email@example.com"
                />
              </div>
              <label class="flex items-center gap-2 mt-4 cursor-pointer group">
                <input v-model="form.emailNotification" type="checkbox" class="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Nhận thông báo qua email khi có cập nhật</span>
              </label>
            </div>

            <!-- Initial Status (admin+ only) -->
            <div v-if="isAdminOrAbove" class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                <i class="bi bi-shield-check text-emerald-500 mr-1"></i>
                Trạng thái ban đầu
              </label>
              <div class="relative">
                <select v-model="form.status" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer">
                  <option value="open">Mở</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="waiting">Chờ phản hồi</option>
                </select>
                <i class="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6 flex flex-col">

            <!-- Description -->
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col flex-1">
              <label class="block text-sm font-medium text-gray-900 mb-2">Mô tả chi tiết <span class="text-red-500">*</span></label>
              <textarea
                v-model="form.description"
                class="w-full flex-1 min-h-37.5 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder:text-gray-400"
                placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu..."
                required
              ></textarea>
              <div class="flex justify-end mt-2">
                <span class="text-xs text-gray-400">{{ form.description.length }}/5000</span>
              </div>
            </div>

            <!-- Attachments -->
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <label class="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <i class="bi bi-paperclip text-gray-500"></i>
                Hình ảnh đính kèm
              </label>

              <div
                class="border-2 border-dashed rounded-xl py-6 px-4 flex flex-col items-center justify-center transition-all cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300"
                :class="isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="$refs.fileInput.click()"
              >
                <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileSelect" />
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                  <i class="bi bi-cloud-arrow-up text-emerald-600 text-lg"></i>
                </div>
                <p class="text-sm font-medium text-gray-700">Kéo thả hoặc click để tải lên</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB · Tối đa 5 ảnh</p>
              </div>

              <div v-if="attachments.length" class="grid grid-cols-4 gap-3 mt-4">
                <div v-for="(att, index) in attachments" :key="index" class="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                  <img :src="att.preview" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" @click.stop="removeAttachment(index)" class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <div v-if="att.uploading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div class="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <div class="shrink-0 bg-white border-t border-gray-200">
      <div class="px-6 py-4 flex items-center justify-end gap-3">
        <NuxtLink to="/support" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Hủy bỏ</NuxtLink>
        <button
          type="submit"
          form="ticketForm"
          :disabled="!isFormValid || submitting"
          class="px-6 py-2.5 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
        >
          <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ submitting ? 'Đang tạo...' : 'Tạo Ticket' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] })

const ticketApi      = useTicketApi()
const { success, error: showError } = useToast()
const authStore      = useAuthStore()
const router         = useRouter()
const isAdminOrAbove = computed(() => authStore.isSuperAdmin || authStore.isAdmin)

const form = ref({
  subject: '',
  description: '',
  category: 'question',
  priority: 'medium',
  status: 'open',
  contactEmail: authStore.user?.email || '',
  emailNotification: true,
})

const attachments = ref([])
const isDragging = ref(false)
const submitting = ref(false)

const isFormValid = computed(() => form.value.subject.trim() && form.value.description.trim())

const handleFileSelect = (event) => processFiles(Array.from(event.target.files))
const handleDrop = (event) => {
  isDragging.value = false
  processFiles(Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith('image/')))
}

const processFiles = async (files) => {
  const slots = 5 - attachments.value.length
  for (const file of files.slice(0, slots)) {
    if (file.size > 5 * 1024 * 1024) { showError(`${file.name} quá lớn. Tối đa 5MB`); continue }
    const preview = URL.createObjectURL(file)
    const idx = attachments.value.length
    attachments.value.push({ file, preview, uploading: true, url: null, filename: null })
    try {
      const data = await ticketApi.uploadImage(file)
      if (data.success && data.data?.url) {
        attachments.value[idx].url = data.data.url
        attachments.value[idx].filename = data.data.filename
        attachments.value[idx].uploading = false
      } else throw new Error()
    } catch {
      showError(`Không thể tải lên ${file.name}`)
      attachments.value.splice(idx, 1)
    }
  }
}

const removeAttachment = (index) => {
  URL.revokeObjectURL(attachments.value[index].preview)
  attachments.value.splice(index, 1)
}

const submitTicket = async () => {
  if (!isFormValid.value) return
  if (attachments.value.some((a) => a.uploading)) { showError('Vui lòng đợi hình ảnh tải lên xong'); return }

  submitting.value = true
  try {
    const payload = {
      ...form.value,
      attachments: attachments.value.filter((a) => a.url).map((a) => ({ url: a.url, filename: a.filename })),
    }
    const data = await ticketApi.createTicket(payload)
    if (data.success) {
      success('Ticket đã được tạo thành công!')
      router.push(`/support/${data.data.id}`)
    } else {
      showError(data.message || 'Không thể tạo ticket')
    }
  } catch {
    showError('Không thể tạo ticket')
  } finally {
    submitting.value = false
  }
}
</script>
