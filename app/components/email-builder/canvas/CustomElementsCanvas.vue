<template>
  <!-- This file contains all custom element renderings for the canvas -->
  <div>
    <!-- Hero Banner -->
    <div v-if="element.type === 'hero-banner'" class="relative overflow-hidden" :style="element.style">
      <div v-if="element.props.image" class="absolute inset-0 opacity-30">
        <img :src="element.props.image" alt="Hero" class="w-full h-full object-cover" />
      </div>
      <div class="relative z-10 text-center">
        <h1 class="text-3xl font-bold mb-3" :style="{ color: element.style.color || '#ffffff' }">
          {{ element.props.children || 'Hero Title' }}
        </h1>
        <p class="text-lg mb-4 opacity-90" :style="{ color: element.style.color || '#ffffff' }">
          {{ element.props.subtitle || 'Subtitle here' }}
        </p>
        <button v-if="element.props.buttonText" class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
          {{ element.props.buttonText }}
        </button>
      </div>
    </div>

    <!-- Enhanced Product Card with variants -->
    <div v-else-if="element.type === 'product-card'" class="bg-white rounded-lg overflow-hidden border border-gray-200" :style="element.style">
      <div class="relative">
        <img :src="element.props.image || 'https://placehold.co/400x300/e2e8f0/64748b?text=Product'" 
             alt="Product" 
             class="w-full h-48 object-cover" />
        <div v-if="element.props.badge" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {{ element.props.badge }}
        </div>
        <div v-if="!element.props.inStock" class="absolute inset-0  flex items-center justify-center">
          <span class="text-white font-bold text-lg">Out of Stock</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-2 text-gray-900">{{ element.props.children || 'Product Name' }}</h3>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl font-bold text-blue-600">{{ element.props.price || '$99.99' }}</span>
          <span v-if="element.props.oldPrice" class="text-sm text-gray-500 line-through">{{ element.props.oldPrice }}</span>
        </div>
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Pricing Card -->
    <div v-else-if="element.type === 'pricing-card'" class="bg-white rounded-xl p-6 text-center" :style="element.style"
         :class="{ 'ring-2 ring-blue-500': element.props.popular }">
      <div v-if="element.props.popular" class="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
        MOST POPULAR
      </div>
      <h3 class="text-2xl font-bold mb-2 text-gray-900">{{ element.props.children }}</h3>
      <div class="mb-4">
        <span class="text-4xl font-bold text-gray-900">{{ element.props.price }}</span>
        <span class="text-gray-600">{{ element.props.period }}</span>
      </div>
      <ul class="space-y-2 mb-6 text-left">
        <li v-for="(feature, idx) in element.props.features" :key="idx" class="flex items-center gap-2">
          <i class="bi bi-check-circle-fill text-green-500 mt-0.5"></i>
          <span class="text-gray-700 text-sm">{{ feature }}</span>
        </li>
      </ul>
      <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
        {{ element.props.buttonText || 'Subscribe' }}
      </button>
    </div>

    <!-- Newsletter Signup -->
    <div v-else-if="element.type === 'newsletter-signup'" class="text-center" :style="element.style">
      <h3 class="text-2xl font-bold mb-2 text-gray-900">{{ element.props.children }}</h3>
      <p class="text-gray-600 mb-4">{{ element.props.subtitle }}</p>
      <div class="flex gap-2 max-w-md mx-auto">
        <input type="email" :placeholder="element.props.placeholder" 
               class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          {{ element.props.buttonText }}
        </button>
      </div>
    </div>

    <!-- Feature Card -->
    <div v-else-if="element.type === 'feature-card'" class="text-center" :style="element.style">
      <div class="text-4xl mb-3">{{ element.props.icon || '⚡' }}</div>
      <h4 class="text-xl font-bold mb-2 text-gray-900">{{ element.props.children }}</h4>
      <p class="text-gray-600 text-sm">{{ element.props.description }}</p>
    </div>

    <!-- Stats Counter -->
    <div v-else-if="element.type === 'stats-counter'" class="text-center" :style="element.style">
      <div class="text-4xl mb-2">{{ element.props.icon || '📊' }}</div>
      <div class="text-4xl font-bold mb-1" :style="{ color: element.style.color || '#ffffff' }">
        {{ element.props.children }}
      </div>
      <div class="text-sm opacity-90" :style="{ color: element.style.color || '#ffffff' }">
        {{ element.props.label }}
      </div>
    </div>

    <!-- Team Member -->
    <div v-else-if="element.type === 'team-member'" class="text-center" :style="element.style">
      <img :src="element.props.image" alt="Team Member" class="w-32 h-32 rounded-full mx-auto mb-3 object-cover" />
      <h4 class="font-bold text-lg text-gray-900">{{ element.props.children }}</h4>
      <p class="text-blue-600 text-sm mb-2">{{ element.props.role }}</p>
      <p class="text-gray-600 text-sm mb-3">{{ element.props.bio }}</p>
      <div class="flex gap-2 justify-center">
        <a v-if="element.props.linkedin" :href="element.props.linkedin" class="text-blue-600 hover:text-blue-700">
          <i class="bi bi-linkedin"></i>
        </a>
        <a v-if="element.props.twitter" :href="element.props.twitter" class="text-blue-400 hover:text-blue-500">
          <i class="bi bi-twitter"></i>
        </a>
      </div>
    </div>

    <!-- Blog Post -->
    <div v-else-if="element.type === 'blog-post'" class="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" :style="element.style">
      <img :src="element.props.image" alt="Blog Post" class="w-full h-48 object-cover" />
      <div class="p-4">
        <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span><i class="bi bi-calendar mr-1"></i>{{ element.props.date }}</span>
          <span><i class="bi bi-clock mr-1"></i>{{ element.props.readTime }}</span>
        </div>
        <h3 class="font-bold text-lg mb-2 text-gray-900">{{ element.props.children }}</h3>
        <p class="text-gray-600 text-sm mb-3">{{ element.props.excerpt }}</p>
        <button class="text-blue-600 font-semibold text-sm hover:text-blue-700">
          Read More →
        </button>
      </div>
    </div>

    <!-- Alert Box -->
    <div v-else-if="element.type === 'alert-box'" class="flex items-center gap-3" :style="element.style">
      <i class="bi bi-info-circle-fill text-blue-600 text-xl mt-0.5"></i>
      <div class="flex-1">
        <h4 class="font-bold text-gray-900 mb-1">{{ element.props.children }}</h4>
        <p class="text-gray-700 text-sm">{{ element.props.message }}</p>
      </div>
    </div>

    <!-- Quote Block -->
    <div v-else-if="element.type === 'quote-block'" class="italic" :style="element.style">
      <p class="text-lg text-gray-700 mb-2">"{{ element.props.children }}"</p>
      <p class="text-sm text-gray-600 font-semibold">— {{ element.props.author }}</p>
    </div>

    <!-- FAQ Item -->
    <div v-else-if="element.type === 'faq-item'" :style="element.style">
      <h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
        <i class="bi bi-question-circle text-blue-600"></i>
        {{ element.props.children }}
      </h4>
      <p class="text-gray-700 text-sm pl-6">{{ element.props.answer }}</p>
    </div>

    <!-- Review Card -->
    <div v-else-if="element.type === 'review-card'" :style="element.style">
      <div class="flex items-center gap-2 mb-2">
        <div class="flex gap-1">
          <i v-for="n in element.props.rating" :key="n" class="bi bi-star-fill text-yellow-400"></i>
        </div>
        <span v-if="element.props.verified" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
      </div>
      <p class="text-gray-700 mb-3">{{ element.props.children }}</p>
      <div class="flex items-center justify-between text-sm">
        <span class="font-semibold text-gray-900">{{ element.props.reviewer }}</span>
        <span class="text-gray-500">{{ element.props.date }}</span>
      </div>
    </div>

    <!-- Coupon Code -->
    <div v-else-if="element.type === 'coupon-code'" class="text-center" :style="element.style">
      <div class="text-4xl mb-2">🎟️</div>
      <div class="text-3xl font-bold text-yellow-600 mb-2 tracking-wider">{{ element.props.children }}</div>
      <div class="text-xl font-semibold text-gray-900 mb-1">{{ element.props.discount }}</div>
      <p class="text-sm text-gray-600 mb-2">{{ element.props.description }}</p>
      <p class="text-xs text-gray-500">Hạn sử dụng: {{ element.props.expiryDate }}</p>
    </div>

    <!-- App Download -->
    <div v-else-if="element.type === 'app-download'" class="text-center" :style="element.style">
      <h3 class="text-2xl font-bold mb-2 text-gray-900">{{ element.props.children }}</h3>
      <p class="text-gray-600 mb-4">{{ element.props.subtitle }}</p>
      <div class="flex gap-3 justify-center">
        <a v-if="element.props.appStore" :href="element.props.appStore" 
           class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          <i class="bi bi-apple mr-2"></i> App Store
        </a>
        <a v-if="element.props.playStore" :href="element.props.playStore"
           class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          <i class="bi bi-google-play mr-2"></i> Play Store
        </a>
      </div>
    </div>

    
  </div>
</template>

<script setup>
const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})
</script>
