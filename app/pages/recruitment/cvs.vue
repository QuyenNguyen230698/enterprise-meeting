<template>
  <div class="flex flex-col w-full h-full overflow-hidden bg-slate-50">
    <ToastContainer />

    <!-- ── Header ─────────────────────────────────────────────────── -->
    <div class="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i class="bi bi-file-earmark-person text-rose-500"></i>
            Quản lý CV
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">Upload và xem CV ứng viên trực tiếp trên trình duyệt</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Upload button -->
          <label
            class="flex items-center gap-2 text-sm bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
            :class="{ 'opacity-50 pointer-events-none': uploading }"
          >
            <i class="bi bi-upload"></i>
            <span>{{ uploading ? 'Đang tải...' : 'Upload CV' }}</span>
            <input
              ref="fileInputRef"
              type="file"
              accept=".pdf,.doc,.docx"
              class="hidden"
              @change="handleFileSelect"
            />
          </label>
        </div>
      </div>

      <!-- Search & Filter bar -->
      <div class="flex gap-3 mt-4 flex-wrap">
        <input
          v-model="searchQuery"
          @input="debouncedFetch"
          type="text"
          placeholder="Tìm theo tên ứng viên, tên file..."
          class="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <select
          v-model="filterJobId"
          @change="fetchCVs"
          class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
        >
          <option :value="null">Tất cả vị trí</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
        </select>
        <button
          @click="fetchCVs"
          class="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-arrow-clockwise" :class="{ 'animate-spin': loading }"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- ── Main content ────────────────────────────────────────────── -->
    <div class="flex flex-1 overflow-hidden">

      <!-- CV List (left panel) -->
      <div class="w-80 flex-none border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading" class="flex items-center justify-center h-32 text-gray-400">
            <div class="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            Đang tải...
          </div>

          <!-- Empty -->
          <div v-else-if="cvList.length === 0" class="flex flex-col items-center justify-center h-48 text-gray-400 px-4 text-center">
            <i class="bi bi-file-earmark-x text-4xl mb-2"></i>
            <p class="text-sm">Chưa có CV nào</p>
            <p class="text-xs mt-1">Upload CV đầu tiên bằng nút phía trên</p>
          </div>

          <!-- List -->
          <div v-else>
            <div
              v-for="cv in cvList"
              :key="cv.id"
              @click="selectCV(cv)"
              class="flex items-start gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-rose-50 transition-colors"
              :class="selectedCV?.id === cv.id ? 'bg-rose-50 border-l-2 border-l-rose-500' : ''"
            >
              <div class="flex-none mt-0.5">
                <i
                  class="bi text-2xl"
                  :class="cv.contentType === 'application/pdf' ? 'bi-file-earmark-pdf text-red-500' : 'bi-file-earmark-word text-blue-500'"
                ></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ cv.candidateName || cv.originalName }}
                </p>
                <p v-if="cv.candidateName" class="text-xs text-gray-400 truncate">{{ cv.originalName }}</p>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span v-if="cv.jobId" class="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">
                    {{ jobName(cv.jobId) }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatSize(cv.size) }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(cv.uploadedAt) }}</span>
                </div>
              </div>
              <button
                @click.stop="confirmDelete(cv)"
                class="flex-none text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Xóa CV"
              >
                <i class="bi bi-trash text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="total > pageSize" class="flex-none border-t border-gray-100 px-4 py-2 flex items-center justify-between text-sm text-gray-500">
          <span>{{ total }} CV</span>
          <div class="flex gap-1">
            <button
              @click="changePage(page - 1)"
              :disabled="page <= 1"
              class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >‹</button>
            <span class="px-2 py-1">{{ page }}/{{ totalPages }}</span>
            <button
              @click="changePage(page + 1)"
              :disabled="page >= totalPages"
              class="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >›</button>
          </div>
        </div>
      </div>

      <!-- CV Viewer (right panel) -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- No selection -->
        <div v-if="!selectedCV" class="flex flex-col items-center justify-center h-full text-gray-400">
          <i class="bi bi-file-earmark-person text-6xl mb-3"></i>
          <p class="text-base font-medium">Chọn CV để xem</p>
          <p class="text-sm mt-1">Click vào một CV ở danh sách bên trái</p>
        </div>

        <!-- CV Header -->
        <template v-else>
          <div class="flex-none bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-semibold text-gray-900 truncate">{{ selectedCV.candidateName || selectedCV.originalName }}</p>
              <p class="text-xs text-gray-400">{{ selectedCV.originalName }} · {{ formatSize(selectedCV.size) }} · {{ formatDate(selectedCV.uploadedAt) }}</p>
            </div>
            <div class="flex items-center gap-2 flex-none">
              <a
                :href="cvUrl(selectedCV)"
                target="_blank"
                class="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                Mở tab mới
              </a>
              <a
                :href="cvUrl(selectedCV)"
                download
                class="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <i class="bi bi-download"></i>
                Tải xuống
              </a>
              <button
                @click="confirmDelete(selectedCV)"
                class="text-sm border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Xóa CV này"
              >
                <i class="bi bi-trash"></i>
                Xóa
              </button>
            </div>
          </div>

          <!-- PDF viewer -->
          <div class="flex-1 overflow-hidden">
            <iframe
              v-if="selectedCV.contentType === 'application/pdf'"
              :src="cvUrl(selectedCV) + '#toolbar=1&navpanes=0'"
              class="w-full h-full border-0"
              title="CV Viewer"
            />
            <!-- DOC/DOCX: use Google Docs Viewer -->
            <iframe
              v-else
              :src="`https://docs.google.com/gview?url=${encodeURIComponent(selectedCV.url)}&embedded=true`"
              class="w-full h-full border-0"
              title="CV Viewer"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- ── Upload modal (candidate name input) ────────────────────── -->
    <div
      v-if="uploadModal.visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="uploadModal.visible = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="bi bi-file-earmark-plus text-rose-500"></i>
            Upload CV
          </h3>
        </div>
        <div class="px-6 py-4 space-y-4">
          <!-- File info -->
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <i
              class="bi text-2xl"
              :class="uploadModal.file?.type === 'application/pdf' ? 'bi-file-earmark-pdf text-red-500' : 'bi-file-earmark-word text-blue-500'"
            ></i>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ uploadModal.file?.name }}</p>
              <p class="text-xs text-gray-400">{{ formatSize(uploadModal.file?.size) }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên ứng viên</label>
            <input
              v-model="uploadModal.candidateName"
              type="text"
              placeholder="Nhập tên ứng viên (tùy chọn)"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
              @keydown.enter="doUpload"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vị trí tuyển dụng</label>
            <select
              v-model="uploadModal.jobId"
              class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            >
              <option :value="null">Không gán vị trí</option>
              <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <button
            @click="uploadModal.visible = false"
            class="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="doUpload"
            :disabled="uploading"
            class="px-5 py-1.5 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50 flex items-center gap-2"
          >
            <div v-if="uploading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ uploading ? 'Đang upload...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Delete confirm modal ───────────────────────────────────── -->
    <div
      v-if="deleteModal.visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <i class="bi bi-trash-fill text-red-600 text-lg"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Xóa CV</h3>
          </div>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700">Bạn có chắc muốn xóa CV <strong>{{ deleteModal.cv?.candidateName || deleteModal.cv?.originalName }}</strong>?</p>
          <p class="text-sm text-gray-400 mt-1">Hành động này không thể hoàn tác.</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <button @click="deleteModal.visible = false" class="px-5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Hủy
          </button>
          <button
            @click="doDelete"
            :disabled="deleteModal.loading"
            class="px-5 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <div v-if="deleteModal.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ deleteModal.loading ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const recruitmentApi = useRecruitmentApi()

const cvUrl = (cv) => {
  const base = config.public.apiBase?.replace(/\/$/, '') ?? ''
  const path = cv.url?.startsWith('/') ? cv.url : `/${cv.url}`
  return `${base}${path}`
}

// ── State ─────────────────────────────────────────────────────────
const cvList = ref([])
const jobs = ref([])
const selectedCV = ref(null)
const loading = ref(false)
const uploading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const searchQuery = ref('')
const filterJobId = ref(null)

const uploadModal = reactive({ visible: false, file: null, candidateName: '', jobId: null })
const deleteModal = reactive({ visible: false, cv: null, loading: false })

// ── Computed ──────────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

// ── Methods ───────────────────────────────────────────────────────
const fetchCVs = async () => {
  loading.value = true
  try {
    const params = { page: page.value, page_size: pageSize }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterJobId.value) params.job_id = filterJobId.value
    const res = await recruitmentApi.fetchCVs(params)
    if (res?.success) {
      cvList.value = res.data
      total.value = res.total
    }
  } finally {
    loading.value = false
  }
}

const fetchJobs = async () => {
  const res = await recruitmentApi.fetchJobs({ status: 'open' })
  if (res?.success) jobs.value = res.data || []
}

const selectCV = (cv) => {
  selectedCV.value = cv
}

const jobName = (jobId) => {
  const j = jobs.value.find(j => j.id === jobId)
  return j?.title || `Job #${jobId}`
}

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const changePage = (p) => {
  page.value = p
  fetchCVs()
}

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchCVs() }, 350)
}

// Upload flow
const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''
  uploadModal.file = file
  uploadModal.candidateName = ''
  uploadModal.jobId = null
  uploadModal.visible = true
}

const doUpload = async () => {
  if (!uploadModal.file || uploading.value) return
  uploading.value = true
  try {
    const res = await recruitmentApi.uploadCv(uploadModal.file, {
      candidateName: uploadModal.candidateName,
      jobId: uploadModal.jobId,
    })
    if (res?.success) {
      uploadModal.visible = false
      await fetchCVs()
      // Auto-select uploaded CV
      selectedCV.value = res.data
    } else {
      alert(res?.detail || 'Upload thất bại')
    }
  } catch (err) {
    alert(err?.message || 'Upload thất bại')
  } finally {
    uploading.value = false
  }
}

// Delete flow
const confirmDelete = (cv) => {
  deleteModal.cv = cv
  deleteModal.visible = true
  deleteModal.loading = false
}

const doDelete = async () => {
  if (!deleteModal.cv) return
  deleteModal.loading = true
  try {
    const res = await recruitmentApi.deleteCv(deleteModal.cv.id)
    if (res?.success) {
      if (selectedCV.value?.id === deleteModal.cv.id) selectedCV.value = null
      deleteModal.visible = false
      await fetchCVs()
    } else {
      alert(res?.detail || 'Xóa thất bại')
    }
  } finally {
    deleteModal.loading = false
  }
}

// ── Init ─────────────────────────────────────────────────────────
onMounted(() => {
  fetchJobs()
  fetchCVs()
})
</script>
