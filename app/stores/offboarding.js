import { defineStore } from 'pinia'

export const useOffboardingStore = defineStore('offboarding', {
  state: () => ({
    processes: [],
    currentProcess: null,
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    submitting: false,
    error: null,
  }),

  getters: {
    myProcesses: (state) => {
      const auth = useAuthStore()
      const currentUserId = auth.user?.portal_user_id ?? auth.user?.id ?? null
      if (currentUserId == null) return []
      return state.processes.filter(p => String(p.employee_id) === String(currentUserId))
    },

    handoverProgress: (state) => {
      const h = state.currentProcess?.handover
      if (!h) return 0
      return [h.ho1_status, h.ho2_status, h.ho3_status].filter(s => s === 'CONFIRMED').length
    },

    currentStep: (state) => {
      const map = {
        DRAFT: 1,
        PENDING_MANAGER: 2,
        PENDING_HR_PROCESS: 3,
        PENDING_HR_APPROVAL: 4,
        PENDING_GM: 5,
        PENDING_HANDOVER: 6,
        COMPLETED: 7,
        COMPLETED_BLOCKED: 7,
        REJECTED: 0,
      }
      return map[state.currentProcess?.status ?? 'DRAFT'] ?? 1
    },
  },

  actions: {
    async fetchProcesses(params = {}) {
      this.loading = true
      this.error = null
      try {
        const query = new URLSearchParams()
        if (params.status) query.set('status', params.status)
        query.set('page', String(params.page ?? 1))
        query.set('page_size', String(this.pageSize))

        const res = await useFetchAuth(`/v1/offboarding/processes?${query}`)
        this.processes = res?.data?.items ?? res?.data ?? []
        this.total = res?.data?.total ?? this.processes.length
        this.page = params.page ?? 1
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tải danh sách đơn'
      } finally {
        this.loading = false
      }
    },

    async fetchProcess(id) {
      this.loading = true
      this.error = null
      try {
        const res = await useFetchAuth(`/v1/offboarding/processes/${id}`)
        this.currentProcess = res?.data ?? res
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tải thông tin đơn'
      } finally {
        this.loading = false
      }
    },

    async submitResignation(payload) {
      this.submitting = true
      this.error = null
      try {
        const body = {
          full_name: payload?.full_name || undefined,
          e_code: payload?.e_code || payload?.hr_code || undefined,
          dept_code: payload?.dept_code || payload?.department || undefined,
          department_name: payload?.department_name || undefined,
          title: payload?.title || undefined,
          joining_date: payload?.joining_date || undefined,
          last_working_day: payload?.last_working_day || undefined,
          contract_type: payload?.contract_type || undefined,
          reason_for_resignation: payload?.reason_for_resignation || undefined,
          commitment_accepted: !!payload?.commitment_accepted,
        }
        const res = await useFetchAuth('/v1/offboarding/processes', {
          method: 'POST',
          body,
        })
        const process = res?.data ?? res
        this.processes.unshift(process)
        const { triggerNotification } = useOffboardingNotify()
        triggerNotification({ process_id: process.id, step_number: 1, action: 'submit' })
        return { success: true, data: process }
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể nộp đơn'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async takeAction(processId, stepNumber, payload) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(
          `/v1/offboarding/processes/${processId}/steps/${stepNumber}/action`,
          { method: 'POST', body: payload }
        )
        // Side effects should not flip a successful action into failure.
        try {
          await this.fetchProcess(processId)
          const { triggerNotification } = useOffboardingNotify()
          triggerNotification({
            process_id: processId,
            step_number: stepNumber,
            action: payload.action,
            note: payload.note,
          })
        } catch (sideEffectError) {
          console.warn('[offboarding] post-action side effects failed:', sideEffectError)
        }
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Thao tác thất bại'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async confirmHandover(processId, hoKey, notes) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(
          `/v1/offboarding/processes/${processId}/handover/${hoKey}/confirm`,
          { method: 'POST', body: { notes } }
        )
        await this.fetchProcess(processId)
        try {
          const { triggerNotification } = useOffboardingNotify()
          triggerNotification({ process_id: processId, step_number: 6, action: `confirm_${hoKey}`, note: notes ?? '' })
        } catch (_) {}
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Không thể xác nhận bàn giao'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async rejectHandover(processId, hoKey, reason) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(
          `/v1/offboarding/processes/${processId}/handover/${hoKey}/reject`,
          { method: 'POST', body: { reason } }
        )
        await this.fetchProcess(processId)
        try {
          const { triggerNotification } = useOffboardingNotify()
          triggerNotification({ process_id: processId, step_number: 6, action: `reject_${hoKey}`, note: reason ?? '' })
        } catch (_) {}
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Không thể reject bàn giao'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async handoverTimelineAction(processId, hoKey, action, note = '') {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(
          `/v1/offboarding/processes/${processId}/handover/${hoKey}/timeline-action`,
          { method: 'POST', body: { action, note } }
        )
        await this.fetchProcess(processId)
        try {
          const { triggerNotification } = useOffboardingNotify()
          triggerNotification({ process_id: processId, step_number: 6, action: `${hoKey}_${action}`, note })
        } catch (_) {}
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Không thể thao tác timeline biên bản'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async saveHandoverContent(processId, hoKey, content) {
      try {
        await useFetchAuth(
          `/v1/offboarding/processes/${processId}/handover/${hoKey}/content`,
          { method: 'PATCH', body: { content } }
        )
        return { success: true }
      } catch (e) {
        return { success: false, message: e?.data?.message ?? e?.data?.error ?? 'Không thể lưu nội dung biên bản' }
      }
    },

    async forceReturnToHandover(processId, reason) {
      this.submitting = true
      this.error = null
      try {
        await useFetchAuth(
          `/v1/offboarding/processes/${processId}/override/return-handover`,
          { method: 'POST', body: { reason } }
        )
        await this.fetchProcess(processId)
        return { success: true }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Thao tác thất bại'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    async resendConfirmationEmail(processId) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(
          `/v1/offboarding/processes/${processId}/resend-confirmation`,
          { method: 'POST' }
        )
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Không thể gửi lại email xác nhận'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },

    clearCurrentProcess() {
      this.currentProcess = null
      this.error = null
    },
  },
})
