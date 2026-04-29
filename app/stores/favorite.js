import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        favoriteApps: []
    }),
    
    actions: {
        init() {
            // Use process.client for Nuxt 3 compatibility
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('velante-favorite-apps')
                    this.favoriteApps = stored ? JSON.parse(stored) : []
                } catch (error) {
                    console.error('Error loading favorite apps:', error)
                    this.favoriteApps = []
                }
            }
        },
        toggleFavorite(appCode) {
            const index = this.favoriteApps.indexOf(appCode)
            if (index === -1) {
                this.favoriteApps.push(appCode)
            } else {
                this.favoriteApps.splice(index, 1)
            }
            // Save to localStorage (client-side only)
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('velante-favorite-apps', JSON.stringify(this.favoriteApps))
                } catch (error) {
                    console.error('Error saving favorite apps:', error)
                }
            }
        }
    }
})