import { defineStore } from 'pinia'

// QF-HRA-17 — Biên bản bàn giao công việc
export const useJobHandoverStore = defineStore('jobHandover', {
  state: () => ({
    list: [],
    currentHandover: null,
    total: 0,
    loading: false,
    submitting: false,
    error: null,
  }),

  actions: {
    async fetchList(params = {}) {
      this.loading = true
      this.error = null
      try {
        const qs = new URLSearchParams()
        if (params.status) qs.set('status', params.status)
        if (params.created_by) qs.set('created_by', String(params.created_by))
        qs.set('page', String(params.page ?? 1))
        qs.set('page_size', '30')
        const res = await useFetchAuth(`/v1/job-handover?${qs}`)
        this.list = res?.data?.items ?? res?.data ?? []
        this.total = res?.data?.total ?? this.list.length
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tải danh sách biên bản công việc'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await useFetchAuth(`/v1/job-handover/${id}`)
        this.currentHandover = res?.data ?? res
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tải thông tin biên bản'
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth('/v1/job-handover', {
          method: 'POST',
          body: payload,
        })
        const item = res?.data ?? res
        this.list.unshift(item)
        return { success: true, data: item }
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tạo biên bản'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async takeAction(id, action, note = '') {
      return this.takeActionWithContent(id, { action, note })
    },

    async takeActionWithContent(id, payload = {}) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(`/v1/job-handover/${id}/actions`, {
          method: 'POST',
          body: payload,
        })
        await this.fetchById(id)
        try {
          const processId = this.currentHandover?.offboarding_id
          if (processId) {
            const { triggerNotification } = useOffboardingNotify()
            triggerNotification({
              process_id: processId,
              step_number: 6,
              action: payload.action,
              note: payload.note ?? '',
              extra: { document_type: 'JOB_HANDOVER', document_id: id },
            })
          }
        } catch (_) {}
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? 'Thao tác thất bại'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },
  },
})
