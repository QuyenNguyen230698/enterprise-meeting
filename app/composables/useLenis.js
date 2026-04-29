import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance = null
let rafId = null

export const useLenis = () => {
  const isInitialized = ref(false)
  const isMobile = ref(false)

  const initLenis = (options = {}) => {
    if (typeof window === 'undefined' || lenisInstance) return lenisInstance

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger)
    
    // Detect mobile
    isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
    
    // On mobile, use native scroll for better performance
    if (isMobile.value) {
      // Just set up ScrollTrigger without Lenis on mobile
      ScrollTrigger.defaults({
        scroller: window
      })
      isInitialized.value = true
      return null
    }

    // Create Lenis instance with smooth settings like lenis.darkroom.engineering
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options
    })

    // Connect Lenis to GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // Add Lenis's requestAnimationFrame (raf) to GSAP's ticker
    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000)
    })

    // Disable lag smoothing
    gsap.ticker.lagSmoothing(0)

    isInitialized.value = true
    
    // Refresh ScrollTrigger after Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return lenisInstance
  }

  const destroyLenis = () => {
    if (lenisInstance) {
      gsap.ticker.remove((time) => {
        lenisInstance?.raf(time * 1000)
      })
      lenisInstance.destroy()
      lenisInstance = null
      isInitialized.value = false
    }
  }

  const scrollTo = (target, options = {}) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options
      })
    }
  }

  const stop = () => {
    lenisInstance?.stop()
  }

  const start = () => {
    lenisInstance?.start()
  }

  const getLenis = () => lenisInstance

  return {
    initLenis,
    destroyLenis,
    scrollTo,
    stop,
    start,
    getLenis,
    isInitialized
  }
}
