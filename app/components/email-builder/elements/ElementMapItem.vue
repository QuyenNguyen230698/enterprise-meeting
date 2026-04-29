<template>
  <div 
    class="group"
    :style="{ paddingLeft: `${level * 12}px` }"
  >
    <div 
      @click="$emit('select', element)"
      :class="[
        'flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors',
        selectedId === element.id 
          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
          : 'hover:bg-gray-100 text-gray-700'
      ]"
    >
      <!-- Element Icon -->
      <i :class="getElementIcon(element.type)" class="text-sm shrink-0"></i>
      
      <!-- Element Info -->
      <div class="flex-1 min-w-0">
        <div class="font-medium truncate">{{ getElementName(element.type) }}</div>
        <div v-if="element.props && element.props.children" class="text-xs text-gray-500 truncate">
          {{ element.props.children }}
        </div>
      </div>

      <!-- Actions -->
      <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <button
          @click.stop="$emit('move-up')"
          class="p-1 hover:bg-gray-200 rounded text-xs"
          title="Move Up"
        >
          <i class="bi bi-arrow-up"></i>
        </button>
        <button
          @click.stop="$emit('move-down')"
          class="p-1 hover:bg-gray-200 rounded text-xs"
          title="Move Down"
        >
          <i class="bi bi-arrow-down"></i>
        </button>
        <button
          @click.stop="$emit('delete')"
          class="p-1 hover:bg-red-200 text-red-600 rounded text-xs"
          title="Delete"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Child Elements (for nested structures) -->
    <div v-if="hasChildren" class="ml-4 space-y-1">
      <!-- For columns/rows with array of arrays -->
      <template v-if="isArrayOfArrays">
        <div v-for="(childArray, arrayIndex) in element.children" :key="`array-${arrayIndex}`" class="space-y-1">
          <div class="text-xs text-gray-500 font-medium px-2 py-1">
            {{ isColumnType ? `Column ${arrayIndex + 1}` : `Row ${arrayIndex + 1}` }}
          </div>
          <ElementMapItem
            v-for="(child, childIndex) in childArray"
            :key="child.id || `child-${arrayIndex}-${childIndex}`"
            :element="child"
            :index="childIndex"
            :level="level + 1"
            :selected-id="selectedId"
            @select="$emit('select', child)"
          />
        </div>
      </template>
      
      <!-- For normal children (single array) -->
      <template v-else>
        <ElementMapItem
          v-for="(child, childIndex) in element.children"
          :key="child.id || `child-${childIndex}`"
          :element="child"
          :index="childIndex"
          :level="level + 1"
          :selected-id="selectedId"
          @select="$emit('select', child)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  selectedId: {
    type: [String, Number],
    default: null
  }
})

defineEmits(['select', 'move-up', 'move-down', 'delete'])

// Check if element has children
const hasChildren = computed(() => {
  return props.element.children && 
         Array.isArray(props.element.children) && 
         props.element.children.length > 0
})

// Check if children is array of arrays (columns/rows)
const isArrayOfArrays = computed(() => {
  if (!hasChildren.value) return false
  return Array.isArray(props.element.children[0])
})

// Check if element is column type
const isColumnType = computed(() => {
  return ['columns2', 'columns3', 'columns4'].includes(props.element.type)
})

const getElementIcon = (type) => {
  const icons = {
    // Text Elements
    heading1: 'bi bi-type-h1',
    heading2: 'bi bi-type-h2', 
    heading3: 'bi bi-type-h3',
    text: 'bi bi-type',
    quote: 'bi bi-quote',
    
    // Media Elements
    image: 'bi bi-image',
    video: 'bi bi-play-circle',
    
    // Interactive Elements
    button: 'bi bi-mouse2',
    'cta-button': 'bi bi-cursor-fill',
    link: 'bi bi-link-45deg',
    
    // Layout Elements
    divider: 'bi bi-hr',
    spacer: 'bi bi-arrows-expand',
    columns2: 'bi bi-columns',
    columns3: 'bi bi-layout-three-columns',
    columns4: 'bi bi-grid-3x2',
    row2: 'bi bi-distribute-horizontal',
    row3: 'bi bi-distribute-horizontal',
    row4: 'bi bi-distribute-horizontal',
    container: 'bi bi-square',
    html: 'bi bi-code-slash',
    
    // Custom Elements
    header: 'bi bi-window',
    footer: 'bi bi-card-text',
    'hero-banner': 'bi bi-card-heading',
    'cta-block': 'bi bi-megaphone',
    'feature-list': 'bi bi-list-check',
    'pricing-table': 'bi bi-table',
    'testimonial': 'bi bi-chat-quote',
    'product-card': 'bi bi-bag',
    'property-card': 'bi bi-house-door',
    'order-summary': 'bi bi-receipt',
    countdown: 'bi bi-clock',
    'location-map': 'bi bi-geo-alt',
    'property-features': 'bi bi-building',
    'job-listing': 'bi bi-briefcase',
    'benefits-list': 'bi bi-trophy',
    
    // E-commerce Elements
    'cart-reminder': 'bi bi-cart3',
    'coupon-code': 'bi bi-ticket-perforated',
    'product-grid': 'bi bi-grid-3x3-gap',
    
    // Utility Elements
    'unsubscribe': 'bi bi-envelope-slash',
    
    // Social Icons
    'social-facebook': 'bi bi-facebook',
    'social-twitter': 'bi bi-twitter',
    'social-instagram': 'bi bi-instagram',
    'social-linkedin': 'bi bi-linkedin',
    'social-youtube': 'bi bi-youtube',
    'social-tiktok': 'bi bi-tiktok'
  }
  return icons[type] || 'bi bi-square'
}

const getElementName = (type) => {
  const names = {
    // Text Elements
    heading1: 'Tiêu đề 1',
    heading2: 'Tiêu đề 2',
    heading3: 'Tiêu đề 3',
    text: 'Văn bản',
    quote: 'Trích dẫn',
    
    // Media Elements
    image: 'Hình ảnh',
    video: 'Video',
    
    // Interactive Elements
    button: 'Nút bấm',
    'cta-button': 'Nút CTA',
    link: 'Liên kết',
    
    // Layout Elements
    divider: 'Đường kẻ',
    spacer: 'Khoảng trống',
    columns2: '2 Cột',
    columns3: '3 Cột',
    columns4: '4 Cột',
    row2: '2 Hàng',
    row3: '3 Hàng',
    row4: '4 Hàng',
    container: 'Container',
    html: 'Mã HTML',
    
    // Custom Elements
    header: 'Header',
    footer: 'Footer',
    'hero-banner': 'Banner chính',
    'cta-block': 'Khối CTA',
    'feature-list': 'Danh sách tính năng',
    'pricing-table': 'Bảng giá',
    'testimonial': 'Đánh giá',
    'product-card': 'Thẻ sản phẩm',
    'property-card': 'Thẻ bất động sản',
    'order-summary': 'Tóm tắt đơn hàng',
    countdown: 'Đếm ngược',
    'location-map': 'Bản đồ vị trí',
    'property-features': 'Tiện ích BĐS',
    'job-listing': 'Tin tuyển dụng',
    'benefits-list': 'Danh sách quyền lợi',
    
    // E-commerce Elements
    'cart-reminder': 'Nhắc giỏ hàng',
    'coupon-code': 'Mã giảm giá',
    'product-grid': 'Lưới sản phẩm',
    
    // Utility Elements
    'unsubscribe': 'Hủy đăng ký',
    
    // Social Icons
    'social-facebook': 'Facebook',
    'social-twitter': 'Twitter',
    'social-instagram': 'Instagram',
    'social-linkedin': 'LinkedIn',
    'social-youtube': 'YouTube',
    'social-tiktok': 'TikTok'
  }
  return names[type] || type
}
</script>
