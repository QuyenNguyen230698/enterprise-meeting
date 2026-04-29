<template>
  <header :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent']">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/modulux" class="flex items-center space-x-2">
          <div class="text-2xl md:text-3xl font-light text-gray-900">
            Modulux <span class="font-semibold">Prime</span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#home" @click.prevent="scrollToSection('home')" class="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
          <a href="#features" @click.prevent="scrollToSection('features')" class="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
          <a href="#showcase" @click.prevent="scrollToSection('showcase')" class="text-gray-700 hover:text-gray-900 transition-colors">Showcase</a>
          <NuxtLink to="/modulux/configurator" class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Start Designing
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-700 hover:text-gray-900">
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <nav class="px-4 py-4 space-y-3">
          <a href="#home" @click="scrollToSectionMobile('home')" class="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Home</a>
          <a href="#features" @click="scrollToSectionMobile('features')" class="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Features</a>
          <a href="#showcase" @click="scrollToSectionMobile('showcase')" class="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Showcase</a>
          <NuxtLink to="/modulux/configurator" class="block w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center">
            Start Designing
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const emit = defineEmits(['scrollTo'])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const scrollToSection = (section) => {
  emit('scrollTo', section)
}

const scrollToSectionMobile = (section) => {
  mobileMenuOpen.value = false
  setTimeout(() => {
    emit('scrollTo', section)
  }, 300)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
