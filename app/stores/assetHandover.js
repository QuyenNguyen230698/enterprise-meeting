import { defineStore } from 'pinia'

export const useAssetHandoverStore = defineStore('assetHandover', {
  state: () => ({
    list: [],
    currentHandover: null,
    total: 0,
    loading: false,
    submitting: false,
    error: null,
  }),

  getters: {
    currentStep: (state) => {
      const map = {
        DRAFT: 1,
        PENDING_EMPLOYEE_SIGN: 2,
        PENDING_HR_CONFIRM: 3,
        COMPLETED: 4,
        REJECTED: 0,
      }
      return map[state.currentHandover?.status ?? 'DRAFT'] ?? 1
    },
  },

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
        const res = await useFetchAuth(`/v1/asset-handover?${qs}`)
        this.list = res?.data?.items ?? res?.data ?? []
        this.total = res?.data?.total ?? this.list.length
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể tải danh sách'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await useFetchAuth(`/v1/asset-handover/${id}`)
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
        const res = await useFetchAuth('/v1/asset-handover', {
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

    async updateAssets(id, assets) {
      this.submitting = true
      this.error = null
      try {
        const res = await useFetchAuth(`/v1/asset-handover/${id}/assets`, {
          method: 'PUT',
          body: { assets },
        })
        await this.fetchById(id)
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? 'Không thể cập nhật tài sản'
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
        const res = await useFetchAuth(`/v1/asset-handover/${id}/actions`, {
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
              extra: { document_type: 'ASSET_HANDOVER', document_id: id },
            })
          }
        } catch (_) {}
        return { success: true, data: res?.data ?? res }
      } catch (e) {
        this.error = e?.data?.message ?? e?.data?.error ?? 'Thao tác thất bại'
        return { success: false, message: this.error }
      } finally {
        this.submitting = false
      }
    },
  },
})
