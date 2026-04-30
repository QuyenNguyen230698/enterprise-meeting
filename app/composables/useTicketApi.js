/**
 * useTicketApi — Real API calls to node-gateway /api/v1/tickets
 * PostgreSQL is source of truth. Redis handles lock + pub/sub only.
 */
export function useTicketApi() {
  const config     = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase 
  const authStore  = useAuthStore()

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authStore.accessToken}`,
  })

  const headersNoJson = () => ({
    Authorization: `Bearer ${authStore.accessToken}`,
  })

  const qs = (params = {}) => {
    const q = new URLSearchParams()
    if (params.page)     q.set('page',     params.page)
    if (params.limit)    q.set('limit',    params.limit)
    if (params.sort)     q.set('sort',     params.sort)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.search)   q.set('search',   params.search)
    if (params.category) q.set('category', params.category)
    if (params.priority) q.set('priority', params.priority)
    return q.toString()
  }

  return {
    // ── Admin-panel list ─────────────────────────────────────────────────────
    getAllTickets(params = {}) {
      return fetch(`${apiBaseUrl}/v1/tickets?${qs(params)}`, { headers: headers() }).then(r => r.json())
    },

    // ── My tickets ───────────────────────────────────────────────────────────
    getMyTickets(params = {}) {
      return fetch(`${apiBaseUrl}/v1/tickets/my-tickets?${qs(params)}`, { headers: headers() }).then(r => r.json())
    },

    // ── Stats ────────────────────────────────────────────────────────────────
    getStats() {
      return fetch(`${apiBaseUrl}/v1/tickets/stats`, { headers: headers() }).then(r => r.json())
    },
    getMyStats() {
      return fetch(`${apiBaseUrl}/v1/tickets/my-stats`, { headers: headers() }).then(r => r.json())
    },

    // ── Chi tiết ticket ──────────────────────────────────────────────────────
    getTicket(id) {
      return fetch(`${apiBaseUrl}/v1/tickets/${id}`, { headers: headers() }).then(r => r.json())
    },

    // ── Tạo ticket ───────────────────────────────────────────────────────────
    createTicket(payload) {
      return fetch(`${apiBaseUrl}/v1/tickets`, {
        method: 'POST', headers: headers(), body: JSON.stringify(payload),
      }).then(r => r.json())
    },

    // ── Claim ticket — nhận xử lý (atomic) ───────────────────────────────────
    claimTicket(id) {
      return fetch(`${apiBaseUrl}/v1/tickets/${id}/claim`, {
        method: 'PUT', headers: headers(),
      }).then(r => r.json())
    },

    // ── Unlock ticket (superAdmin) ────────────────────────────────────────────
    unlockTicket(id, clearAssigned = true) {
      return fetch(`${apiBaseUrl}/v1/tickets/${id}/unlock`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify({ clear_assigned: clearAssigned }),
      }).then(r => r.json())
    },

    // ── Lock ticket (superAdmin) ──────────────────────────────────────────────
    lockTicket(id) {
      return fetch(`${apiBaseUrl}/v1/tickets/${id}/lock`, {
        method: 'PUT', headers: headers(),
      }).then(r => r.json())
    },

    // ── Comment ───────────────────────────────────────────────────────────────
    addComment(ticketId, payload) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/comments`, {
        method: 'POST', headers: headers(), body: JSON.stringify(payload),
      }).then(r => r.json())
    },

    deleteComment(ticketId, commentId) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/comments/${commentId}`, {
        method: 'DELETE', headers: headers(),
      }).then(r => r.json())
    },

    // ── SSE: real-time comments stream ────────────────────────────────────────
    streamComments(ticketId, onComment, onError) {
      const token = authStore.accessToken
      const es = new EventSource(
        `${apiBaseUrl}/v1/tickets/${ticketId}/comments/stream?token=${encodeURIComponent(token)}`
      )
      es.addEventListener('comment', (e) => {
        try { onComment(JSON.parse(e.data)) } catch (_) {}
      })
      if (onError) es.onerror = onError
      return es
    },

    // ── Quản lý trạng thái ────────────────────────────────────────────────────
    updateStatus(ticketId, status, resolution) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/status`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ status, resolution }),
      }).then(r => r.json())
    },

    updatePriority(ticketId, priority) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/priority`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ priority }),
      }).then(r => r.json())
    },

    saveResolution(ticketId, resolution) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/resolution`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ resolution }),
      }).then(r => r.json())
    },

    resolveTicket(ticketId, resolution) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/resolve`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ resolution }),
      }).then(r => r.json())
    },

    closeTicket(ticketId) {
      return fetch(`${apiBaseUrl}/v1/tickets/${ticketId}/close`, {
        method: 'PUT', headers: headers(),
      }).then(r => r.json())
    },

    // ── Upload ảnh ────────────────────────────────────────────────────────────
    uploadImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      return fetch(`${apiBaseUrl}/v1/images/upload`, {
        method: 'POST', headers: headersNoJson(), body: formData,
      }).then(r => r.json())
    },

    // ── Contact tickets (superAdmin) ──────────────────────────────────────────
    getContactTickets(params = {}) {
      return fetch(`${apiBaseUrl}/v1/tickets/contact?${qs(params)}`, { headers: headers() }).then(r => r.json())
    },
    getContactStats() {
      return fetch(`${apiBaseUrl}/v1/tickets/contact/stats`, { headers: headers() }).then(r => r.json())
    },
    getContactTicket(id) {
      return fetch(`${apiBaseUrl}/v1/tickets/contact/${id}`, { headers: headers() }).then(r => r.json())
    },
    resolveContactTicket(id, resolution) {
      return fetch(`${apiBaseUrl}/v1/tickets/contact/${id}/resolve`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ resolution }),
      }).then(r => r.json())
    },
    updateContactStatus(id, status, resolution) {
      return fetch(`${apiBaseUrl}/v1/tickets/contact/${id}/status`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ status, resolution }),
      }).then(r => r.json())
    },
    addContactComment(id, payload) {
      return fetch(`${apiBaseUrl}/v1/tickets/contact/${id}/comments`, {
        method: 'POST', headers: headers(), body: JSON.stringify(payload),
      }).then(r => r.json())
    },
  }
}
