<template>
  <div class="flex-1 overflow-y-auto p-4">
    <div class="space-y-4">
      <!-- Basic Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3">Cơ Bản</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in basicElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Layout Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3">Bố Cục</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in layoutElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Media Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3">Đa Phương Tiện</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in mediaElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>


      <!-- Custom Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3">Tuỳ Biến</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in customElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- E-commerce Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3"> E-commerce</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in ecommerceElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Real Estate Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3"> Bất Động Sản</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in realEstateElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Recruitment Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3"> Tuyển Dụng</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in recruitmentElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Banking Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3"> Ngân Hàng</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in bankingElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

      <!-- Gaming/Course Elements -->
      <div>
        <h6 class="text-sm font-medium text-gray-700 mb-3"> Gaming & Khóa Học</h6>
        <div class="grid grid-cols-2 gap-2">
          <ElementItem
            v-for="element in gamingCourseElements"
            :key="element.type"
            :element="element"
            @click="$emit('add-element', element.type)"
          />
        </div>
      </div>

    
    </div>
  </div>
</template>

<script setup>
import ElementItem from './ElementItem.vue'

defineEmits(['add-element'])

const basicElements = ref([
  { type: 'heading1', name: 'Heading 1', icon: 'bi bi-type-h1', description: 'Large heading' },
  { type: 'heading2', name: 'Heading 2', icon: 'bi bi-type-h2', description: 'Medium heading' },
  { type: 'heading3', name: 'Heading 3', icon: 'bi bi-type-h3', description: 'Small heading' },
  { type: 'text', name: 'Text', icon: 'bi bi-text-paragraph', description: 'Paragraph text' },
  { type: 'button', name: 'Button', icon: 'bi bi-hand-index', description: 'Call-to-action button' },
  { type: 'link', name: 'Link', icon: 'bi bi-link-45deg', description: 'Hyperlink' },
  { type: 'divider', name: 'Divider', icon: 'bi bi-hr', description: 'Horizontal line' },
])

const layoutElements = [
  {
    type: 'row2',
    name: '2 Rows',
    icon: 'bi bi-distribute-vertical',
    description: 'Two row layout'
  },
  {
    type: 'row3',
    name: '3 Rows',
    icon: 'bi bi-distribute-vertical',
    description: 'Three row layout'
  },
  // {
  //   type: 'row4',
  //   name: '4 Rows',
  //   icon: 'bi bi-distribute-vertical',
  //   description: 'Four row layout'
  // },
  {
    type: 'columns2',
    name: '2 Columns',
    icon: 'bi bi-columns',
    description: '2 column layout'
  },
  {
    type: 'columns3',
    name: '3 Columns',
    icon: 'bi bi-layout-three-columns',
    description: '3 column layout'
  },
  // {
  //   type: 'columns4',
  //   name: '4 Columns',
  //   icon: 'bi bi-grid-3x3',
  //   description: '4 column layout'
  // },
  {
    type: 'html',
    name: 'HTML',
    icon: 'bi bi-code-slash',
    description: 'Raw HTML content'
  }
]

const mediaElements = [
  {
    type: 'image',
    name: 'Image',
    icon: 'bi bi-image',
    description: 'Add an image'
  },
  {
    type: 'video',
    name: 'Video',
    icon: 'bi bi-play-circle',
    description: 'Embed video content'
  },
]

const customElements = ref([
  { type: 'header', name: 'Header', icon: 'bi bi-layout-text-window', description: 'Email header with logo & nav' },
  { type: 'product-card', name: 'Product Card', icon: 'bi bi-card-image', description: 'Product showcase' },
  { type: 'footer', name: 'Footer', icon: 'bi bi-layout-text-window-reverse', description: 'Email footer' },
  { type: 'unsubscribe', name: 'Unsubscribe', icon: 'bi bi-envelope-slash', description: 'Auto-inject token link' },
])

// E-commerce Elements
const ecommerceElements = ref([
  { type: 'product-grid', name: 'Product Grid', icon: 'bi bi-grid-3x3-gap', description: 'Display multiple products' },
  { type: 'coupon-code', name: 'Coupon Code', icon: 'bi bi-ticket-perforated', description: 'Discount coupon' },
  { type: 'cart-reminder', name: 'Cart Reminder', icon: 'bi bi-cart-x', description: 'Abandoned cart reminder' },
  { type: 'order-summary', name: 'Order Summary', icon: 'bi bi-receipt', description: 'Order details' },
])

// Real Estate Elements
const realEstateElements = ref([
  { type: 'property-card', name: 'Property Card', icon: 'bi bi-house', description: 'Property listing' },
  { type: 'property-features', name: 'Features', icon: 'bi bi-list-check', description: 'Property features list' },
  { type: 'location-map', name: 'Location Map', icon: 'bi bi-geo-alt', description: 'Property location' },
])

// Recruitment Elements
const recruitmentElements = ref([
  { type: 'job-listing', name: 'Job Listing', icon: 'bi bi-briefcase', description: 'Job posting' },
  { type: 'benefits-list', name: 'Benefits List', icon: 'bi bi-gift', description: 'Job benefits' },
])

// Banking Elements
const bankingElements = ref([
  { type: 'transaction-card', name: 'Giao Dịch', icon: 'bi bi-arrow-left-right', description: 'Thẻ giao dịch ngân hàng' },
  { type: 'credit-card-info', name: 'Thẻ Tín Dụng', icon: 'bi bi-credit-card-2-front', description: 'Thông tin thẻ tín dụng' },
])

// Gaming/Course Elements
const gamingCourseElements = ref([
  { type: 'course-card', name: 'Khóa Học', icon: 'bi bi-mortarboard', description: 'Card khóa học online' },
  { type: 'progress-bar', name: 'Tiến Độ', icon: 'bi bi-graph-up', description: 'Thanh tiến độ' },
    { type: 'menu-item', name: 'Món Ăn', icon: 'bi bi-cup-hot', description: 'Món ăn nhà hàng' },
])

</script>
