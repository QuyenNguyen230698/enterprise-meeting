import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    loading: false,
  }),
  actions: {
    async fetchBookings() {
      const { backendUrl } = useRuntimeConfig().public
      this.loading = true
      try {
        const data = await $fetch(`${backendUrl}/api/bookings`, { method: 'GET' })
        this.bookings = data.map(b => ({
          Id: b.id,
          Subject: b.title,
          StartTime: new Date(b.start_time),
          EndTime: new Date(b.end_time),
          Location: b.room_id,
          Description: `Zoom Link: ${b.zoom_link || 'N/A'}`,
          RoomId: b.room_id,
          ZoomLink: b.zoom_link
        }))
      } catch (e) {
        // Fallback for demo
        this.bookings = [
          {
            Id: 1,
            Subject: 'Q2 Strategy Review',
            StartTime: new Date(2026, 2, 28, 9, 0),
            EndTime: new Date(2026, 2, 28, 11, 0),
            Location: 'ROOM_01',
            RoomId: 'ROOM_01'
          },
          {
            Id: 2,
            Subject: 'Product Roadmap',
            StartTime: new Date(2026, 2, 28, 14, 0),
            EndTime: new Date(2026, 2, 28, 15, 30),
            Location: 'ROOM_02',
            RoomId: 'ROOM_02'
          }
        ]
      } finally {
        this.loading = false
      }
    },
    async createBooking(form) {
      const { backendUrl } = useRuntimeConfig().public
      try {
        await $fetch(`${backendUrl}/api/bookings/create`, {
          method: 'POST',
          body: {
            ...form,
            attendees: form.attendees.split(',').map((e) => e.trim()).filter(Boolean),
          },
        })
        await this.fetchBookings()
      } catch (e) {
        throw new Error(e?.data?.detail || 'Lỗi tạo booking')
      }
    }
  }
})
