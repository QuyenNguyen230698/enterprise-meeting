/**
 * usePublicTicketApi — Gửi ticket từ trang /contact (không cần đăng nhập)
 * Gọi thẳng public endpoint, không cần auth header.
 * Ticket lưu vào Redis trên backend dưới tenant __guest__.
 */
export function usePublicTicketApi() {
  const config     = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase 

  return {
    async createPublicContactTicket(payload) {
      const res = await fetch(`${apiBaseUrl}/v1/tickets/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      return res.json()
    },
  }
}
