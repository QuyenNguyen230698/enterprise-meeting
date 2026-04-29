import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useScrollAnimation = () => {
  const animations = ref([])
  const isMobile = ref(false)

  const initScrollAnimations = () => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)
    
    // Detect mobile device
    isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
    
    // Refresh ScrollTrigger after a short delay to ensure Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }

  // Fade up animation
  const fadeUp = (element, options = {}) => {
    if (!element) return null
    
    // On mobile, show immediately without scroll trigger
    if (isMobile.value) {
      gsap.set(element, { opacity: 1, y: 0 })
      return null
    }
    
    const defaults = {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        end: 'bottom 15%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(element, { y: animProps.y, opacity: 0 })

    const tween = gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      delay: animProps.delay,
      stagger: animProps.stagger,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Fade in animation
  const fadeIn = (element, options = {}) => {
    if (!element) return null
    
    // On mobile, show immediately
    if (isMobile.value) {
      gsap.set(element, { opacity: 1 })
      return null
    }
    
    const defaults = {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(element, { opacity: 0 })

    const tween = gsap.to(element, {
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      delay: animProps.delay,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Scale up animation
  const scaleUp = (element, options = {}) => {
    if (!element) return null
    
    // On mobile, show immediately
    if (isMobile.value) {
      gsap.set(element, { scale: 1, opacity: 1 })
      return null
    }
    
    const defaults = {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(element, { scale: animProps.scale, opacity: 0 })

    const tween = gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      delay: animProps.delay,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Slide from left
  const slideFromLeft = (element, options = {}) => {
    if (!element) return null
    
    // On mobile, show immediately
    if (isMobile.value) {
      gsap.set(element, { x: 0, opacity: 1 })
      return null
    }
    
    const defaults = {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(element, { x: animProps.x, opacity: 0 })

    const tween = gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      delay: animProps.delay,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Slide from right
  const slideFromRight = (element, options = {}) => {
    if (!element) return null
    
    // On mobile, show immediately
    if (isMobile.value) {
      gsap.set(element, { x: 0, opacity: 1 })
      return null
    }
    
    const defaults = {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(element, { x: animProps.x, opacity: 0 })

    const tween = gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      delay: animProps.delay,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Parallax effect
  const parallax = (element, options = {}) => {
    const defaults = {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }

    const config = { ...defaults, ...options }

    const tween = gsap.to(element, config)
    animations.value.push(tween)
    return tween
  }

  // Text reveal animation
  const textReveal = (element, options = {}) => {
    const defaults = {
      y: '100%',
      duration: 1,
      ease: 'power4.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    // Wrap each character in a span
    const text = element.textContent
    element.innerHTML = text.split('').map(char => 
      `<span style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">${char === ' ' ? '&nbsp;' : char}</span></span>`
    ).join('')

    const chars = element.querySelectorAll('span > span')

    gsap.set(chars, { y: animProps.y })

    const tween = gsap.to(chars, {
      y: 0,
      duration: animProps.duration,
      ease: animProps.ease,
      stagger: animProps.stagger,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Stagger animation for multiple elements
  const staggerElements = (elements, options = {}) => {
    if (!elements || elements.length === 0) return null
    
    // On mobile, show all elements immediately
    if (isMobile.value) {
      gsap.set(elements, { y: 0, opacity: 1 })
      return null
    }
    
    const defaults = {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }

    const config = { ...defaults, ...options }
    const { scrollTrigger, ...animProps } = config

    gsap.set(elements, { y: animProps.y, opacity: 0 })

    const tween = gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration: animProps.duration,
      ease: animProps.ease,
      stagger: animProps.stagger,
      scrollTrigger
    })

    animations.value.push(tween)
    return tween
  }

  // Magnetic effect for buttons/links
  const magneticEffect = (element) => {
    const strength = 0.3

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  // Cleanup all animations
  const cleanup = () => {
    animations.value.forEach(tween => {
      if (tween && tween.scrollTrigger) {
        tween.scrollTrigger.kill()
      }
      if (tween) {
        tween.kill()
      }
    })
    animations.value = []
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  return {
    initScrollAnimations,
    fadeUp,
    fadeIn,
    scaleUp,
    slideFromLeft,
    slideFromRight,
    parallax,
    textReveal,
    staggerElements,
    magneticEffect,
    cleanup
  }
}
