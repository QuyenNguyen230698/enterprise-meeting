<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-100 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight">HRM Document Builder</h1>
            <p class="text-xs text-gray-500 mt-0.5">
              Tạo và quản lý mẫu văn bản, biên bản nội bộ
              <span v-if="store.templates.length" class="text-gray-700 font-semibold">
                — {{ store.templates.length }} mẫu
              </span>
            </p>
          </div>

          <div class="flex gap-2">
            <!-- Mọi user đều có thể tạo biên bản từ mẫu đã xuất bản -->
            <NuxtLink
              to="/hrm/documents"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <i class="bi bi-file-earmark-check"></i>
              Biên bản của tôi
            </NuxtLink>
            <!-- Chỉ admin mới có thể tạo mẫu mới -->
            <NuxtLink
              v-if="auth.isAdmin"
              to="/hrm/document-builder/create"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <i class="bi bi-plus-lg"></i>
              Tạo mẫu mới
            </NuxtLink>
          </div>
        </div>

        <!-- Filter tabs -->
        <div class="mt-3 flex items-center gap-2 flex-wrap">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeStatus = tab.value"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
            :class="activeStatus === tab.value ? tab.activeClass : tab.class"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span class="ml-1 text-[10px] font-bold">{{ tab.count }}</span>
          </button>

          <!-- Search -->
          <div class="relative ml-auto">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm kiếm mẫu văn bản..."
              class="pl-9 pr-4 py-1.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none w-56"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.listLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Content -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-6 py-5">

      <!-- Empty -->
      <div v-if="filteredTemplates.length === 0" class="text-center py-20">
        <i class="bi bi-file-earmark-text text-5xl text-gray-200 mb-4 block"></i>
        <p class="text-gray-500 font-medium">Chưa có mẫu văn bản nào</p>
        <NuxtLink
          v-if="auth.isAdmin"
          to="/hrm/document-builder/create"
          class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <i class="bi bi-plus-lg"></i>Tạo mẫu đầu tiên
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group overflow-hidden"
        >
          <!-- Card header -->
          <div class="px-4 pt-4 pb-3">
            <!-- Badge loại -->
            <div class="flex items-center justify-between mb-2">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="docTypeClass(tpl.docType)">
                <i :class="docTypeIcon(tpl.docType)"></i>
                {{ docTypeLabel(tpl.docType) }}
              </span>
              <span class="text-[10px] font-mono text-gray-400">{{ tpl.code }}</span>
            </div>

            <!-- Tên -->
            <h3 class="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{{ tpl.name }}</h3>
            <p class="text-xs text-gray-400 mt-0.5 italic">{{ tpl.titleEn }}</p>

            <!-- Info -->
            <div class="mt-3 space-y-1 text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <i class="bi bi-pen text-[10px]"></i>
                {{ tpl.signers?.length || 0 }} người ký
              </div>
              <div class="flex items-center gap-1.5">
                <i class="bi bi-diagram-3 text-[10px]"></i>
                {{ tpl.workflowSteps?.length || 0 }} bước phê duyệt
              </div>
              <div class="flex items-center gap-1.5">
                <i class="bi bi-calendar3 text-[10px]"></i>
                {{ formatDate(tpl.updatedAt || tpl.createdAt) }}
              </div>
            </div>
          </div>

          <!-- Status bar -->
          <div class="px-4 pb-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              :class="statusClass(tpl.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full inline-block" :class="statusDotClass(tpl.status)"></span>
              {{ statusLabel(tpl.status) }}
            </span>

            <!-- Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <!-- Tạo biên bản (chỉ với template PUBLISHED) -->
              <NuxtLink
                v-if="tpl.status === 'PUBLISHED'"
                :to="`/hrm/documents/create?templateId=${tpl.id}`"
                class="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Tạo biên bản từ mẫu này"
              >
                <i class="bi bi-file-earmark-plus text-sm"></i>
              </NuxtLink>
              <NuxtLink
                :to="`/hrm/document-builder/${tpl.id}/preview`"
                class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Xem trước"
              >
                <i class="bi bi-eye text-sm"></i>
              </NuxtLink>
              <NuxtLink
                v-if="auth.isAdmin"
                :to="`/hrm/document-builder/${tpl.id}/edit`"
                class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Chỉnh sửa"
              >
                <i class="bi bi-pencil text-sm"></i>
              </NuxtLink>
              <button
                v-if="auth.isAdmin && tpl.status === 'DRAFT'"
                @click="handlePublish(tpl)"
                class="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Xuất bản"
              >
                <i class="bi bi-cloud-upload text-sm"></i>
              </button>
              <button
                v-if="auth.isAdmin"
                @click="confirmDelete(tpl)"
                class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Xóa"
              >
                <i class="bi bi-trash3 text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <i class="bi bi-trash3 text-red-600"></i>
          </div>
          <div>
            <p class="font-bold text-gray-900 text-sm">Xác nhận xóa</p>
            <p class="text-xs text-gray-500 mt-0.5">Hành động này không thể hoàn tác</p>
          </div>
        </div>
        <p class="text-sm text-gray-700 mb-5">
          Bạn có chắc muốn xóa mẫu <strong>{{ deleteTarget.name }}</strong>?
        </p>
        <div class="flex gap-2 justify-end">
          <button @click="deleteTarget = null" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            Hủy
          </button>
          <button @click="handleDelete" class="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
            Xóa mẫu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'
definePageMeta({ middleware: ['auth', 'permission'] })
const auth = useAuthStore()
const store = useDocumentBuilderStore()

onMounted(() => { store.fetchTemplates() })

const search = ref('')
const activeStatus = ref('all')
const deleteTarget = ref(null)

const statusTabs = computed(() => [
  {
    value: 'all', label: 'Tất cả', icon: 'bi bi-grid',
    count: store.templates.length,
    activeClass: 'bg-blue-600 text-white border-blue-600',
    class: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
  },
  {
    value: 'PUBLISHED', label: 'Đã xuất bản', icon: 'bi bi-check-circle',
    count: store.publishedTemplates.length,
    activeClass: 'bg-green-600 text-white border-green-600',
    class: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
  },
  {
    value: 'DRAFT', label: 'Nháp', icon: 'bi bi-pencil-square',
    count: store.draftTemplates.length,
    activeClass: 'bg-amber-500 text-white border-amber-500',
    class: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
  },
])

const filteredTemplates = computed(() => {
  let list = store.templates
  if (activeStatus.value !== 'all') list = list.filter(t => t.status === activeStatus.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      t.code?.toLowerCase().includes(q) ||
      t.titleVn?.toLowerCase().includes(q)
    )
  }
  return list
})

// ── Helpers ────────────────────────────────────────────────────────────────────
const DOC_TYPE_MAP = {
  MEETING_MINUTES: { label: 'Biên bản họp', icon: 'bi bi-people', cls: 'bg-blue-50 text-blue-700' },
  HANDOVER: { label: 'Biên bản bàn giao', icon: 'bi bi-arrow-left-right', cls: 'bg-purple-50 text-purple-700' },
  INTERNAL_DECISION: { label: 'Quyết định', icon: 'bi bi-award', cls: 'bg-red-50 text-red-700' },
  NDA: { label: 'NDA', icon: 'bi bi-shield-lock', cls: 'bg-amber-50 text-amber-700' },
  DISCIPLINE: { label: 'Kỷ luật', icon: 'bi bi-exclamation-triangle', cls: 'bg-rose-50 text-rose-700' },
  CUSTOM: { label: 'Tùy chỉnh', icon: 'bi bi-file-earmark-text', cls: 'bg-gray-100 text-gray-600' },
}
const docTypeLabel = t => DOC_TYPE_MAP[t]?.label || t
const docTypeIcon = t => DOC_TYPE_MAP[t]?.icon || 'bi bi-file-text'
const docTypeClass = t => DOC_TYPE_MAP[t]?.cls || 'bg-gray-100 text-gray-600'

const statusLabel = s => ({ PUBLISHED: 'Đã xuất bản', DRAFT: 'Nháp', ARCHIVED: 'Lưu trữ' }[s] || s)
const statusClass = s => ({
  PUBLISHED: 'bg-green-50 text-green-700',
  DRAFT: 'bg-amber-50 text-amber-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
}[s] || 'bg-gray-100 text-gray-500')
const statusDotClass = s => ({
  PUBLISHED: 'bg-green-500',
  DRAFT: 'bg-amber-400',
  ARCHIVED: 'bg-gray-400',
}[s] || 'bg-gray-400')

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Actions ────────────────────────────────────────────────────────────────────
const confirmDelete = (tpl) => { deleteTarget.value = tpl }

const handleDelete = async () => {
  if (!deleteTarget.value) return
  const target = deleteTarget.value
  deleteTarget.value = null
  try {
    const res = await useFetchAuth(`/v1/hrm/document-templates/${target.id}`, { method: 'DELETE' })
    if (!res?.error) {
      store.templates = store.templates.filter(t => t.id !== target.id)
    } else {
      deleteTarget.value = target
    }
  } catch {
    deleteTarget.value = target
  }
}

const handlePublish = async (tpl) => {
  try {
    const res = await useFetchAuth(`/v1/hrm/document-templates/${tpl.id}/publish`, { method: 'POST' })
    if (!res?.error) {
      const found = store.templates.find(t => t.id === tpl.id)
      if (found) found.status = 'PUBLISHED'
    }
  } catch { /* silently ignore, UI unchanged */ }
}
</script>
