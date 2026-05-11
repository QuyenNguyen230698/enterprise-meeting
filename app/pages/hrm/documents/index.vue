<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-100 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight">Biên bản & Văn bản</h1>
            <p class="text-xs text-gray-500 mt-0.5">
              Tạo, theo dõi và phê duyệt biên bản từ các mẫu đã được xuất bản
            </p>
          </div>
          <div class="flex gap-2">
            <NuxtLink
              to="/hrm/documents/create"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <i class="bi bi-plus-lg"></i>
              Tạo biên bản mới
            </NuxtLink>
          </div>
        </div>

        <!-- Filter tabs + search -->
        <div class="mt-3 flex items-center gap-2 flex-wrap">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
            :class="activeTab === tab.value ? tab.activeClass : tab.inactiveClass"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span class="ml-0.5 text-[10px] font-bold">{{ tab.count }}</span>
          </button>

          <div class="relative ml-auto">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên, mã..."
              class="pl-9 pr-4 py-1.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none w-52"
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
      <div v-if="filteredDocs.length === 0" class="text-center py-20">
        <i class="bi bi-file-earmark-check text-5xl text-gray-200 mb-4 block"></i>
        <p class="text-gray-500 font-medium">Không có biên bản nào</p>
        <NuxtLink
          to="/hrm/documents/create"
          class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <i class="bi bi-plus-lg"></i>Tạo biên bản đầu tiên
        </NuxtLink>
      </div>

      <!-- Table (desktop) -->
      <div v-else class="hidden md:block">
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50">
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Biên bản</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Người tạo</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="doc in filteredDocs"
                :key="doc.id"
                class="hover:bg-gray-50 transition-colors group"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <!-- Pulse dot nếu cần action từ tôi -->
                    <span
                      v-if="needsMyAction(doc)"
                      class="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0"
                    ></span>
                    <div>
                      <p class="font-semibold text-gray-900 leading-tight">{{ doc.name }}</p>
                      <p class="text-[11px] font-mono text-gray-400 mt-0.5">{{ doc.code }} · #{{ String(doc.id).slice(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    :class="docTypeClass(doc.docType)"
                  >
                    <i :class="docTypeIcon(doc.docType)"></i>
                    {{ docTypeLabel(doc.docType) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    :class="statusInfo(doc.status).color"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusInfo(doc.status).dot"></span>
                    {{ statusInfo(doc.status).label }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">{{ doc.submittedByName || '—' }}</td>
                <td class="px-4 py-3 text-xs text-gray-400">{{ formatDate(doc.createdAt) }}</td>
                <td class="px-4 py-3">
                  <NuxtLink
                    :to="`/hrm/documents/${doc.id}`"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <i class="bi bi-arrow-right"></i>
                    Xem chi tiết
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cards (mobile) -->
      <div class="md:hidden space-y-3">
        <NuxtLink
          v-for="doc in filteredDocs"
          :key="doc.id"
          :to="`/hrm/documents/${doc.id}`"
          class="block bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all p-4"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span v-if="needsMyAction(doc)" class="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0"></span>
              <p class="font-semibold text-gray-900 text-sm truncate">{{ doc.name }}</p>
            </div>
            <span
              class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              :class="statusInfo(doc.status).color"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="statusInfo(doc.status).dot"></span>
              {{ statusInfo(doc.status).label }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="inline-flex items-center gap-1" :class="docTypeClass(doc.docType)">
              <i :class="docTypeIcon(doc.docType)"></i>{{ docTypeLabel(doc.docType) }}
            </span>
            <span>{{ doc.submittedByName }}</span>
            <span class="ml-auto">{{ formatDate(doc.createdAt) }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore, DOC_STATUS_LABEL } from '~/stores/hrm/document'

const store       = useDocumentStore()
const auth        = useAuthStore()
const search      = ref('')
const activeTab   = ref('all')

// Sync fetch với activeTab
watch(activeTab, () => {
  const params = {}
  if (activeTab.value === 'todo') params.todo = 'true'
  else if (activeTab.value === 'mine') params.submitted_by = auth.user?.portal_user_id
  else if (activeTab.value !== 'all') params.status = activeTab.value
  
  store.fetchDocuments(params)
})

onMounted(() => store.fetchDocuments())

// ── Tab definitions ────────────────────────────────────────────────────────────
const statusTabs = computed(() => {
  const all      = store.documents
  const draft    = all.filter(d => d.status === 'DRAFT')
  const pending  = all.filter(d => d.status.startsWith('PENDING'))
  const done     = all.filter(d => d.status === 'COMPLETED')
  const rejected = all.filter(d => d.status === 'REJECTED')
  return [
    { value: 'all',      label: 'Tất cả',      icon: 'bi bi-grid',           count: all.length,      activeClass: 'bg-blue-600 text-white border-blue-600',    inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'todo',     label: 'Việc cần làm', icon: 'bi bi-clipboard-check', count: todoDocs.value.length, activeClass: 'bg-orange-600 text-white border-orange-600', inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'mine',     label: 'Của tôi',      icon: 'bi bi-person',         count: myDocs.value.length, activeClass: 'bg-indigo-600 text-white border-indigo-600', inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'DRAFT',    label: 'Nháp',         icon: 'bi bi-pencil-square',  count: draft.length,    activeClass: 'bg-amber-500 text-white border-amber-500',   inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'PENDING',  label: 'Đang duyệt',   icon: 'bi bi-hourglass-split',count: pending.length,  activeClass: 'bg-orange-500 text-white border-orange-500',  inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'COMPLETED',label: 'Hoàn thành',   icon: 'bi bi-check-circle',   count: done.length,     activeClass: 'bg-green-600 text-white border-green-600',   inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
    { value: 'REJECTED', label: 'Từ chối',      icon: 'bi bi-x-circle',       count: rejected.length, activeClass: 'bg-red-600 text-white border-red-600',       inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' },
  ]
})

const myDocs = computed(() =>
  store.documents.filter(d => d.submittedBy === auth.user?.portal_user_id)
)

const todoDocs = computed(() =>
  store.documents.filter(d => needsMyAction(d))
)

const filteredDocs = computed(() => {
  let list = store.documents
  if (activeTab.value === 'mine')    list = myDocs.value
  else if (activeTab.value === 'PENDING') list = list.filter(d => d.status.startsWith('PENDING'))
  else if (activeTab.value !== 'all') list = list.filter(d => d.status === activeTab.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q) ||
      d.id?.toLowerCase().includes(q)
    )
  }
  return list
})

function needsMyAction(doc) {
  if (doc.status === 'COMPLETED' || doc.status === 'REJECTED') return false
  if (doc.status === 'DRAFT') {
    // Người tạo cần nộp
    return doc.submittedBy === auth.user?.portal_user_id
  }
  const currentStep = doc.workflowSteps?.find(s => s.statusPending === doc.status)
  if (!currentStep) return false
  const myId = String(auth.user?.portal_user_id || auth.user?.id || '')
  // Ưu tiên: assignedUsers cụ thể
  const assigned = currentStep.assignedUsers || []
  if (assigned.length > 0) return assigned.some(u => String(u.userId || u.id) === myId)
  // Fallback: deptCode
  const myDept = auth.user?.deptCode || auth.user?.department_code
  return currentStep.deptCode === myDept
}

function canDelete(doc) {
  if (doc.submittedBy !== auth.user?.portal_user_id) return false
  // Chỉ cho xóa nếu là DRAFT hoặc chưa có ai phê duyệt/ký (chỉ mới có submit log)
  const actionLogs = (doc.approvalLogs || []).filter(l => !['submit', 'create'].includes(l.action))
  return actionLogs.length === 0
}

async function handleDelete(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa biên bản này?')) return
  try {
    const res = await store.deleteDocument(id)
    if (res?.success) {
      toast.success('Đã xóa biên bản')
      store.fetchDocuments()
    } else {
      toast.error(res?.message || 'Không thể xóa biên bản')
    }
  } catch (e) {
    toast.error('Lỗi khi xóa biên bản')
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusInfo = (s) => {
  if (s?.startsWith('PENDING')) return { label: 'Đang duyệt', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' }
  return DOC_STATUS_LABEL[s] || { label: s || '—', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' }
}

const DOC_TYPE_MAP = {
  MEETING_MINUTES:   { label: 'Biên bản họp',    icon: 'bi bi-people',             cls: 'bg-blue-50 text-blue-700'   },
  HANDOVER:          { label: 'Bàn giao',         icon: 'bi bi-arrow-left-right',   cls: 'bg-purple-50 text-purple-700' },
  INTERNAL_DECISION: { label: 'Quyết định',       icon: 'bi bi-award',              cls: 'bg-red-50 text-red-700'     },
  NDA:               { label: 'NDA',              icon: 'bi bi-shield-lock',        cls: 'bg-amber-50 text-amber-700' },
  DISCIPLINE:        { label: 'Kỷ luật',          icon: 'bi bi-exclamation-triangle', cls: 'bg-rose-50 text-rose-700' },
  CUSTOM:            { label: 'Tùy chỉnh',        icon: 'bi bi-file-earmark-text',  cls: 'bg-gray-100 text-gray-600'  },
}
const docTypeLabel = t => DOC_TYPE_MAP[t]?.label || t
const docTypeIcon  = t => DOC_TYPE_MAP[t]?.icon  || 'bi bi-file-text'
const docTypeClass = t => DOC_TYPE_MAP[t]?.cls   || 'bg-gray-100 text-gray-500'

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
