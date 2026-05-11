import { defineStore } from 'pinia'

// Trạng thái biên bản (mapping từ workflow steps trong template)
export const DOC_STATUS_LABEL = {
  DRAFT:           { label: 'Nháp',              color: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400'   },
  PENDING_STEP_2:  { label: 'Chờ bước 2',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  PENDING_STEP_3:  { label: 'Chờ bước 3',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  PENDING_STEP_4:  { label: 'Chờ bước 4',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  PENDING_STEP_5:  { label: 'Chờ bước 5',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  PENDING_STEP_6:  { label: 'Chờ bước 6',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  PENDING_STEP_7:  { label: 'Chờ bước 7',        color: 'bg-amber-50 text-amber-700',  dot: 'bg-amber-400'  },
  COMPLETED:       { label: 'Hoàn thành',         color: 'bg-green-50 text-green-700',  dot: 'bg-green-500'  },
  REJECTED:        { label: 'Bị từ chối',         color: 'bg-red-50 text-red-700',      dot: 'bg-red-500'    },
}

export const useDocumentStore = defineStore('hrmDocument', {
  state: () => ({
    // Danh sách biên bản
    documents: [],
    total: 0,
    page: 1,
    pageSize: 20,
    listLoading: false,
    listError: null,

    // Chi tiết biên bản đang xem
    currentDocument: null,
    detailLoading: false,
    detailError: null,

    // Submitting action
    submitting: false,
  }),

  getters: {
    // Biên bản của tôi (submitted by current user)
    myDocuments: (state) => (userId) =>
      state.documents.filter(d => d.submittedBy === userId),

    // Biên bản cần tôi xử lý (tôi được giao hoặc thuộc phòng ban tôi)
    pendingMyAction: (state) => (userId, deptCode) =>
      state.documents.filter(d => {
        if (d.status === 'COMPLETED' || d.status === 'REJECTED') return false
        const currentStep = d.workflowSteps?.find(s => s.statusPending === d.status)
        if (!currentStep) return false
        // Ưu tiên: assignedUsers cụ thể
        const assigned = currentStep.assignedUsers || []
        if (assigned.length > 0) return assigned.some(u => String(u.userId || u.id) === String(userId))
        // Fallback: deptCode
        return currentStep.deptCode === deptCode
      }),

    // Bước hiện tại của biên bản
    currentStepNumber: (state) => {
      if (!state.currentDocument) return 0
      const { status, workflowSteps } = state.currentDocument
      if (status === 'COMPLETED') return (workflowSteps?.length || 0) + 1
      const step = workflowSteps?.find(s => s.statusPending === status)
      return step?.stepNumber || 1
    },

    // Bước hiện tại cần ký không
    currentStepRequiresSignature: (state) => {
      if (!state.currentDocument) return false
      const { status, workflowSteps } = state.currentDocument
      const step = workflowSteps?.find(s => s.statusPending === status)
      return step?.signatureRequired || false
    },
  },

  actions: {
    // ── Fetch list ─────────────────────────────────────────────────────────────
    async fetchDocuments(params = {}) {
      this.listLoading = true
      this.listError = null
      try {
        const query = new URLSearchParams({
          page: this.page,
          page_size: this.pageSize,
          ...params,
        }).toString()
        const res = await useFetchAuth(`/v1/hrm/documents?${query}`)
        // Backend: { success, data: { items: [], total, page, pageSize } }
        const payload = res?.data ?? res
        
        // Cập nhật documents list
        this.documents = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : []
        this.total = payload?.total ?? this.documents.length
      } catch (e) {
        this.listError = e?.message || 'Không thể tải danh sách biên bản'
        this.documents = []
      } finally {
        this.listLoading = false
      }
    },

    // ── Fetch detail ───────────────────────────────────────────────────────────
    async fetchDocument(id) {
      this.detailLoading = true
      this.detailError = null
      try {
        const res = await useFetchAuth(`/v1/hrm/documents/${id}`)
        // Backend: { success, data: { ...document } }
        this.currentDocument = res?.data ?? res
      } catch (e) {
        this.detailError = e?.message || 'Không thể tải chi tiết biên bản'
        this.currentDocument = null
      } finally {
        this.detailLoading = false
      }
    },

    // ── Tạo biên bản từ template ───────────────────────────────────────────────
    async createDocument(payload) {
      this.submitting = true
      try {
        const res = await useFetchAuth('/v1/hrm/documents', {
          method: 'POST',
          body: payload,
        })
        return res?.data || res
      } finally {
        this.submitting = false
      }
    },

    // ── Lưu nội dung đã điền (auto-save draft) ────────────────────────────────
    async saveContent(id, contentBlocks) {
      return useFetchAuth(`/v1/hrm/documents/${id}/content`, {
        method: 'PATCH',
        body: { contentBlocks },
      })
    },

    // ── Nộp biên bản (Step 1 → Step 2) ────────────────────────────────────────
    async submitDocument(id, note = '') {
      this.submitting = true
      try {
        const res = await useFetchAuth(`/v1/hrm/documents/${id}/submit`, {
          method: 'POST',
          body: { note },
        })
        if (this.currentDocument?.id === id) await this.fetchDocument(id)
        return res
      } finally {
        this.submitting = false
      }
    },

    // ── Approve / Reject một bước ──────────────────────────────────────────────
    async takeAction(documentId, stepNumber, { action, note, verifyToken }) {
      this.submitting = true
      try {
        const body = { action, note }
        if (verifyToken) body.verify_token = verifyToken
        const res = await useFetchAuth(
          `/v1/hrm/documents/${documentId}/steps/${stepNumber}/action`,
          { method: 'POST', body },
        )
        if (this.currentDocument?.id === documentId) await this.fetchDocument(documentId)
        return res
      } finally {
        this.submitting = false
      }
    },

    // ── Ký số biên bản ─────────────────────────────────────────────────────────
    async signDocument(documentId, { stepNumber, verifyToken }) {
      this.submitting = true
      try {
        const res = await useFetchAuth(`/v1/hrm/documents/${documentId}/sign`, {
          method: 'POST',
          body: { step_number: stepNumber, verify_token: verifyToken },
        })
        if (this.currentDocument?.id === documentId) await this.fetchDocument(documentId)
        return res
      } finally {
        this.submitting = false
      }
    },

    // ── Xóa biên bản ───────────────────────────────────────────────────────────
    async deleteDocument(id) {
      this.submitting = true
      try {
        const res = await useFetchAuth(`/v1/hrm/documents/${id}`, {
          method: 'DELETE',
        })
        return res
      } finally {
        this.submitting = false
      }
    },

    // ── Clear ─────────────────────────────────────────────────────────────────
    clearCurrent() {
      this.currentDocument = null
      this.detailError = null
    },
  },
})
