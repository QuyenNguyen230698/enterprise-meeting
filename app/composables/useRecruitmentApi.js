export const useRecruitmentApi = () => {
  const authStore = useAuthStore()
  const uid = computed(() => authStore.user?.portal_user_id)
  const config = useRuntimeConfig()

  const call = async (method, path, body = null) => {
    const opts = { method }
    if (body) opts.body = body
    return useFetchAuth(path, opts)
  }

  const qs = (extra = {}) => {
    const p = new URLSearchParams({ portal_user_id: uid.value, ...extra })
    return p.toString()
  }

  const downloadAttachment = async (emailId, attachmentIndex, filename) => {
    const url = `${config.public.apiBase}/v1/recruitment/inbox/${emailId}/attachments/${attachmentIndex}?${qs()}`
    const res = await fetch(url, {
      headers: { Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : undefined },
    })
    if (!res.ok) throw new Error('Không thể tải file đính kèm')
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename || 'attachment'
    a.click()
    URL.revokeObjectURL(blobUrl)
  }

  return {
    // Stats
    fetchStats: () => call('GET', `/v1/recruitment/stats?${qs()}`),

    // Jobs
    fetchJobs: (params = {}) => call('GET', `/v1/recruitment/jobs?${qs(params)}`),
    createJob: (body) => call('POST', `/v1/recruitment/jobs?${qs()}`, body),
    updateJob: (id, body) => call('PATCH', `/v1/recruitment/jobs/${id}?${qs()}`, body),
    deleteJob: (id) => call('DELETE', `/v1/recruitment/jobs/${id}?${qs()}`),

    // Inbox
    fetchInbox: (params = {}) => call('GET', `/v1/recruitment/inbox?${qs(params)}`),
    fetchEmail: (id) => call('GET', `/v1/recruitment/inbox/${id}?${qs()}`),
    patchEmail: (id, body) => call('PATCH', `/v1/recruitment/inbox/${id}?${qs()}`, body),
    deleteEmail: (id, deleteFromMail = false) => call('DELETE', `/v1/recruitment/inbox/${id}?${qs({ delete_from_mail: deleteFromMail })}`),
    bulkDeleteEmails: (ids, deleteFromMail = false) => call('POST', `/v1/recruitment/inbox/bulk-delete?${qs()}`, { ids, delete_from_mail: deleteFromMail }),
    pullInbox: (body) => call('POST', `/v1/recruitment/inbox/pull?${qs()}`, body),
    downloadAttachment,

    // Bulk Reply
    bulkReply: (body) => call('POST', `/v1/recruitment/bulk-reply?${qs()}`, body),
    fetchReplies: (params = {}) => call('GET', `/v1/recruitment/replies?${qs(params)}`),
    fetchBulkDetail: (bulkId) => call('GET', `/v1/recruitment/replies/bulk/${bulkId}?${qs()}`),

    // Auto Rules
    fetchRules: (params = {}) => call('GET', `/v1/recruitment/auto-rules?${qs(params)}`),
    createRule: (body) => call('POST', `/v1/recruitment/auto-rules?${qs()}`, body),
    updateRule: (id, body) => call('PATCH', `/v1/recruitment/auto-rules/${id}?${qs()}`, body),
    deleteRule: (id) => call('DELETE', `/v1/recruitment/auto-rules/${id}?${qs()}`),
    toggleRule: (id) => call('POST', `/v1/recruitment/auto-rules/${id}/toggle?${qs()}`),
  }
}
