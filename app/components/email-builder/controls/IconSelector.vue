<template>
  <div class="icon-selector">
    <label v-if="label" class="text-xs text-gray-500 mb-1 block">{{ label }}</label>
    <div class="relative">
      <button 
        type="button"
        @click="isOpen = !isOpen"
        class="w-full flex items-center justify-between gap-2 px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
        :class="isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'"
      >
        <div class="flex items-center gap-2">
          <img v-if="selectedIcon && selectedIcon !== 'none' && selectedIcon !== 'custom'" :src="getIconUrl(selectedIcon)" class="w-4 h-4" />
          <span v-else class="w-4 h-4 flex items-center justify-center text-gray-400">+</span>
          <span class="text-gray-700">{{ selectedIcon && selectedIcon !== 'none' ? getIconLabel(selectedIcon) : 'Chọn icon' }}</span>
        </div>
        <span class="text-gray-400 transition-transform text-xs" :class="isOpen ? 'rotate-180' : ''">▼</span>
      </button>
      
      <!-- Dropdown -->
      <div 
        v-if="isOpen" 
        class="absolute z-50 mt-1 w-68 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden"
      >
        <!-- Search -->
        <div class="p-2 border-b border-gray-100">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Tìm icon..."
            class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- Categories -->
        <div class="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <button 
            v-for="cat in displayCategories" 
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors"
            :class="activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ cat.label }}
          </button>
        </div>
        
        <!-- Icons Grid -->
        <div class="p-2 max-h-44 overflow-y-auto">
          <div class="grid grid-cols-8 gap-1">
            <button
              v-for="icon in filteredIcons"
              :key="icon.id"
              @click="selectIcon(icon.id)"
              class="p-2 rounded-lg hover:bg-blue-50 transition-colors group relative"
              :class="selectedIcon === icon.id ? 'bg-blue-100 ring-2 ring-blue-500' : ''"
              :title="icon.label"
            >
              <img :src="getIconUrl(icon.id)" class="w-4 h-4 group-hover:opacity-70" />
            </button>
          </div>
          <div v-if="filteredIcons.length === 0" class="text-center py-4 text-gray-400 text-sm">
            Không tìm thấy icon
          </div>
        </div>
        
        <!-- Custom URL option -->
        <div v-if="allowCustom" class="p-2 border-t border-gray-100 space-y-2">
          <button 
            @click="selectIcon('custom')"
            class="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md text-left flex items-center gap-2"
            :class="selectedIcon === 'custom' ? 'bg-blue-50' : ''"
          >
            🖼️ Icon tùy chỉnh (URL)
          </button>
          <button 
            @click="selectIcon('none')"
            class="w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-md text-left flex items-center gap-2"
          >
            ⊘ Không có icon
          </button>
        </div>
      </div>
    </div>
    
    <!-- Custom URL input -->
    <div v-if="allowCustom && selectedIcon === 'custom'" class="mt-2">
      <input 
        :value="customUrl"
        @input="$emit('update:customUrl', $event.target.value)"
        type="url"
        placeholder="URL hình icon tùy chỉnh"
        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  customUrl: { type: String, default: '' },
  label: { type: String, default: '' },
  allowCustom: { type: Boolean, default: true },
  categoryFilter: { type: Array, default: () => [] } // Filter to specific categories
})

const emit = defineEmits(['update:modelValue', 'update:customUrl'])

const isOpen = ref(false)
const searchQuery = ref('')
const activeCategory = ref('all')

const selectedIcon = computed(() => props.modelValue)

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'shipping', label: 'Vận chuyển' },
  { id: 'finance', label: 'Tài chính' },
  { id: 'social', label: 'Xã hội' },
  { id: 'general', label: 'Chung' },
  { id: 'realestate', label: 'BĐS' }
]

const displayCategories = computed(() => {
  if (props.categoryFilter.length > 0) {
    return categories.filter(c => c.id === 'all' || props.categoryFilter.includes(c.id))
  }
  return categories
})

// Bootstrap Icons CDN base URL - for email-compatible icon images
const ICON_CDN_BASE = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/'

// Icon Library with CDN URLs (email-compatible via <img src>)
const iconLibrary = [
  // E-commerce
  { id: 'cart', label: 'Giỏ hàng', category: 'ecommerce' },
  { id: 'cart2', label: 'Giỏ hàng 2', category: 'ecommerce' },
  { id: 'cart3', label: 'Giỏ hàng 3', category: 'ecommerce' },
  { id: 'cart4', label: 'Giỏ hàng 4', category: 'ecommerce' },
  { id: 'cart-fill', label: 'Giỏ hàng đầy', category: 'ecommerce' },
  { id: 'cart-plus', label: 'Thêm giỏ', category: 'ecommerce' },
  { id: 'cart-plus-fill', label: 'Thêm giỏ đầy', category: 'ecommerce' },
  { id: 'cart-check', label: 'Giỏ check', category: 'ecommerce' },
  { id: 'cart-check-fill', label: 'Giỏ check đầy', category: 'ecommerce' },
  { id: 'cart-dash', label: 'Giỏ trừ', category: 'ecommerce' },
  { id: 'cart-x', label: 'Giỏ xóa', category: 'ecommerce' },
  { id: 'bag', label: 'Túi', category: 'ecommerce' },
  { id: 'bag-fill', label: 'Túi đầy', category: 'ecommerce' },
  { id: 'bag-check', label: 'Túi check', category: 'ecommerce' },
  { id: 'bag-check-fill', label: 'Túi check đầy', category: 'ecommerce' },
  { id: 'bag-plus', label: 'Túi thêm', category: 'ecommerce' },
  { id: 'bag-plus-fill', label: 'Túi thêm đầy', category: 'ecommerce' },
  { id: 'bag-heart', label: 'Túi tim', category: 'ecommerce' },
  { id: 'bag-heart-fill', label: 'Túi tim đầy', category: 'ecommerce' },
  { id: 'basket', label: 'Giỏ xách', category: 'ecommerce' },
  { id: 'basket-fill', label: 'Giỏ xách đầy', category: 'ecommerce' },
  { id: 'basket2', label: 'Giỏ xách 2', category: 'ecommerce' },
  { id: 'basket2-fill', label: 'Giỏ xách 2 đầy', category: 'ecommerce' },
  { id: 'basket3', label: 'Giỏ xách 3', category: 'ecommerce' },
  { id: 'basket3-fill', label: 'Giỏ xách 3 đầy', category: 'ecommerce' },
  { id: 'shop', label: 'Cửa hàng', category: 'ecommerce' },
  { id: 'shop-window', label: 'Cửa sổ shop', category: 'ecommerce' },
  { id: 'tag', label: 'Tag', category: 'ecommerce' },
  { id: 'tag-fill', label: 'Tag đầy', category: 'ecommerce' },
  { id: 'tags', label: 'Tags', category: 'ecommerce' },
  { id: 'tags-fill', label: 'Tags đầy', category: 'ecommerce' },
  { id: 'percent', label: 'Phần trăm', category: 'ecommerce' },
  { id: 'gift', label: 'Quà tặng', category: 'ecommerce' },
  { id: 'gift-fill', label: 'Quà tặng đầy', category: 'ecommerce' },
  { id: 'ticket', label: 'Vé', category: 'ecommerce' },
  { id: 'ticket-fill', label: 'Vé đầy', category: 'ecommerce' },
  { id: 'ticket-perforated', label: 'Vé đục lỗ', category: 'ecommerce' },
  { id: 'ticket-perforated-fill', label: 'Vé đục lỗ đầy', category: 'ecommerce' },
  { id: 'ticket-detailed', label: 'Vé chi tiết', category: 'ecommerce' },
  { id: 'ticket-detailed-fill', label: 'Vé chi tiết đầy', category: 'ecommerce' },
  { id: 'star', label: 'Sao', category: 'ecommerce' },
  { id: 'star-fill', label: 'Sao đầy', category: 'ecommerce' },
  { id: 'star-half', label: 'Sao nửa', category: 'ecommerce' },
  { id: 'stars', label: 'Nhiều sao', category: 'ecommerce' },
  { id: 'fire', label: 'Lửa', category: 'ecommerce' },
  { id: 'lightning', label: 'Sét', category: 'ecommerce' },
  { id: 'lightning-fill', label: 'Sét đầy', category: 'ecommerce' },
  { id: 'lightning-charge', label: 'Sét charge', category: 'ecommerce' },
  { id: 'lightning-charge-fill', label: 'Sét charge đầy', category: 'ecommerce' },
  { id: 'coin', label: 'Đồng xu', category: 'ecommerce' },
  { id: 'piggy-bank', label: 'Heo đất', category: 'ecommerce' },
  { id: 'piggy-bank-fill', label: 'Heo đất đầy', category: 'ecommerce' },
  
  // Shipping
  { id: 'truck', label: 'Xe tải', category: 'shipping' },
  { id: 'truck-front', label: 'Xe tải trước', category: 'shipping' },
  { id: 'truck-front-fill', label: 'Xe tải trước đầy', category: 'shipping' },
  { id: 'truck-flatbed', label: 'Xe tải phẳng', category: 'shipping' },
  { id: 'box', label: 'Hộp', category: 'shipping' },
  { id: 'box-fill', label: 'Hộp đầy', category: 'shipping' },
  { id: 'box2', label: 'Hộp 2', category: 'shipping' },
  { id: 'box2-fill', label: 'Hộp 2 đầy', category: 'shipping' },
  { id: 'box2-heart', label: 'Hộp tim', category: 'shipping' },
  { id: 'box2-heart-fill', label: 'Hộp tim đầy', category: 'shipping' },
  { id: 'box-seam', label: 'Hộp seam', category: 'shipping' },
  { id: 'box-seam-fill', label: 'Hộp seam đầy', category: 'shipping' },
  { id: 'boxes', label: 'Nhiều hộp', category: 'shipping' },
  { id: 'archive', label: 'Lưu trữ', category: 'shipping' },
  { id: 'archive-fill', label: 'Lưu trữ đầy', category: 'shipping' },
  { id: 'send', label: 'Gửi', category: 'shipping' },
  { id: 'send-fill', label: 'Gửi đầy', category: 'shipping' },
  { id: 'airplane', label: 'Máy bay', category: 'shipping' },
  { id: 'airplane-fill', label: 'Máy bay đầy', category: 'shipping' },
  { id: 'clock', label: 'Đồng hồ', category: 'shipping' },
  { id: 'clock-fill', label: 'Đồng hồ đầy', category: 'shipping' },
  { id: 'clock-history', label: 'Lịch sử', category: 'shipping' },
  { id: 'stopwatch', label: 'Bấm giờ', category: 'shipping' },
  { id: 'stopwatch-fill', label: 'Bấm giờ đầy', category: 'shipping' },
  { id: 'geo', label: 'Vị trí', category: 'shipping' },
  { id: 'geo-fill', label: 'Vị trí đầy', category: 'shipping' },
  { id: 'geo-alt', label: 'Vị trí alt', category: 'shipping' },
  { id: 'geo-alt-fill', label: 'Vị trí alt đầy', category: 'shipping' },
  { id: 'pin-map', label: 'Ghim bản đồ', category: 'shipping' },
  { id: 'pin-map-fill', label: 'Ghim bản đồ đầy', category: 'shipping' },
  { id: 'compass', label: 'La bàn', category: 'shipping' },
  { id: 'compass-fill', label: 'La bàn đầy', category: 'shipping' },
  { id: 'signpost', label: 'Biển chỉ đường', category: 'shipping' },
  { id: 'signpost-fill', label: 'Biển chỉ đường đầy', category: 'shipping' },
  
  // Finance
  { id: 'credit-card', label: 'Thẻ tín dụng', category: 'finance' },
  { id: 'credit-card-fill', label: 'Thẻ tín dụng đầy', category: 'finance' },
  { id: 'credit-card-2-front', label: 'Thẻ 2 mặt trước', category: 'finance' },
  { id: 'credit-card-2-front-fill', label: 'Thẻ 2 mặt trước đầy', category: 'finance' },
  { id: 'credit-card-2-back', label: 'Thẻ 2 mặt sau', category: 'finance' },
  { id: 'credit-card-2-back-fill', label: 'Thẻ 2 mặt sau đầy', category: 'finance' },
  { id: 'wallet', label: 'Ví', category: 'finance' },
  { id: 'wallet-fill', label: 'Ví đầy', category: 'finance' },
  { id: 'wallet2', label: 'Ví 2', category: 'finance' },
  { id: 'cash', label: 'Tiền mặt', category: 'finance' },
  { id: 'cash-coin', label: 'Tiền xu', category: 'finance' },
  { id: 'cash-stack', label: 'Xếp tiền', category: 'finance' },
  { id: 'currency-dollar', label: 'Đô la', category: 'finance' },
  { id: 'currency-euro', label: 'Euro', category: 'finance' },
  { id: 'currency-bitcoin', label: 'Bitcoin', category: 'finance' },
  { id: 'currency-exchange', label: 'Đổi tiền', category: 'finance' },
  { id: 'receipt', label: 'Hóa đơn', category: 'finance' },
  { id: 'receipt-cutoff', label: 'Hóa đơn cắt', category: 'finance' },
  { id: 'clipboard', label: 'Clipboard', category: 'finance' },
  { id: 'clipboard-fill', label: 'Clipboard đầy', category: 'finance' },
  { id: 'clipboard-check', label: 'Clipboard check', category: 'finance' },
  { id: 'clipboard-check-fill', label: 'Clipboard check đầy', category: 'finance' },
  { id: 'clipboard-data', label: 'Clipboard data', category: 'finance' },
  { id: 'clipboard-data-fill', label: 'Clipboard data đầy', category: 'finance' },
  { id: 'bank', label: 'Ngân hàng', category: 'finance' },
  { id: 'bank2', label: 'Ngân hàng 2', category: 'finance' },
  { id: 'safe', label: 'Két sắt', category: 'finance' },
  { id: 'safe-fill', label: 'Két sắt đầy', category: 'finance' },
  { id: 'graph-up', label: 'Biểu đồ lên', category: 'finance' },
  { id: 'graph-up-arrow', label: 'Biểu đồ lên mũi tên', category: 'finance' },
  { id: 'graph-down', label: 'Biểu đồ xuống', category: 'finance' },
  { id: 'graph-down-arrow', label: 'Biểu đồ xuống mũi tên', category: 'finance' },
  { id: 'bar-chart', label: 'Biểu đồ cột', category: 'finance' },
  { id: 'bar-chart-fill', label: 'Biểu đồ cột đầy', category: 'finance' },
  { id: 'pie-chart', label: 'Biểu đồ tròn', category: 'finance' },
  { id: 'pie-chart-fill', label: 'Biểu đồ tròn đầy', category: 'finance' },
  
  // Social
  { id: 'person', label: 'Người', category: 'social' },
  { id: 'person-fill', label: 'Người đầy', category: 'social' },
  { id: 'person-circle', label: 'Người tròn', category: 'social' },
  { id: 'person-check', label: 'Người check', category: 'social' },
  { id: 'person-check-fill', label: 'Người check đầy', category: 'social' },
  { id: 'person-plus', label: 'Thêm người', category: 'social' },
  { id: 'person-plus-fill', label: 'Thêm người đầy', category: 'social' },
  { id: 'people', label: 'Nhóm', category: 'social' },
  { id: 'people-fill', label: 'Nhóm đầy', category: 'social' },
  { id: 'telephone', label: 'Điện thoại', category: 'social' },
  { id: 'telephone-fill', label: 'Điện thoại đầy', category: 'social' },
  { id: 'telephone-forward', label: 'Điện thoại forward', category: 'social' },
  { id: 'telephone-forward-fill', label: 'Điện thoại forward đầy', category: 'social' },
  { id: 'envelope', label: 'Thư', category: 'social' },
  { id: 'envelope-fill', label: 'Thư đầy', category: 'social' },
  { id: 'envelope-open', label: 'Thư mở', category: 'social' },
  { id: 'envelope-open-fill', label: 'Thư mở đầy', category: 'social' },
  { id: 'envelope-heart', label: 'Thư tim', category: 'social' },
  { id: 'envelope-heart-fill', label: 'Thư tim đầy', category: 'social' },
  { id: 'chat', label: 'Chat', category: 'social' },
  { id: 'chat-fill', label: 'Chat đầy', category: 'social' },
  { id: 'chat-dots', label: 'Chat chấm', category: 'social' },
  { id: 'chat-dots-fill', label: 'Chat chấm đầy', category: 'social' },
  { id: 'chat-text', label: 'Chat text', category: 'social' },
  { id: 'chat-text-fill', label: 'Chat text đầy', category: 'social' },
  { id: 'share', label: 'Chia sẻ', category: 'social' },
  { id: 'share-fill', label: 'Chia sẻ đầy', category: 'social' },
  { id: 'hand-thumbs-up', label: 'Thích', category: 'social' },
  { id: 'hand-thumbs-up-fill', label: 'Thích đầy', category: 'social' },
  { id: 'emoji-smile', label: 'Cười', category: 'social' },
  { id: 'emoji-smile-fill', label: 'Cười đầy', category: 'social' },
  
  // General
  { id: 'check', label: 'Check', category: 'general' },
  { id: 'check2', label: 'Check 2', category: 'general' },
  { id: 'check-lg', label: 'Check lớn', category: 'general' },
  { id: 'check-all', label: 'Check tất cả', category: 'general' },
  { id: 'check-circle', label: 'Check tròn', category: 'general' },
  { id: 'check-circle-fill', label: 'Check tròn đầy', category: 'general' },
  { id: 'check-square', label: 'Check vuông', category: 'general' },
  { id: 'check-square-fill', label: 'Check vuông đầy', category: 'general' },
  { id: 'x', label: 'X', category: 'general' },
  { id: 'x-lg', label: 'X lớn', category: 'general' },
  { id: 'x-circle', label: 'X tròn', category: 'general' },
  { id: 'x-circle-fill', label: 'X tròn đầy', category: 'general' },
  { id: 'plus', label: 'Cộng', category: 'general' },
  { id: 'plus-lg', label: 'Cộng lớn', category: 'general' },
  { id: 'plus-circle', label: 'Cộng tròn', category: 'general' },
  { id: 'plus-circle-fill', label: 'Cộng tròn đầy', category: 'general' },
  { id: 'dash', label: 'Trừ', category: 'general' },
  { id: 'dash-circle', label: 'Trừ tròn', category: 'general' },
  { id: 'dash-circle-fill', label: 'Trừ tròn đầy', category: 'general' },
  { id: 'info', label: 'Info', category: 'general' },
  { id: 'info-circle', label: 'Info tròn', category: 'general' },
  { id: 'info-circle-fill', label: 'Info tròn đầy', category: 'general' },
  { id: 'question', label: 'Hỏi', category: 'general' },
  { id: 'question-circle', label: 'Hỏi tròn', category: 'general' },
  { id: 'question-circle-fill', label: 'Hỏi tròn đầy', category: 'general' },
  { id: 'exclamation', label: 'Chấm than', category: 'general' },
  { id: 'exclamation-circle', label: 'Chấm than tròn', category: 'general' },
  { id: 'exclamation-circle-fill', label: 'Chấm than tròn đầy', category: 'general' },
  { id: 'exclamation-triangle', label: 'Cảnh báo', category: 'general' },
  { id: 'exclamation-triangle-fill', label: 'Cảnh báo đầy', category: 'general' },
  { id: 'heart', label: 'Tim', category: 'general' },
  { id: 'heart-fill', label: 'Tim đầy', category: 'general' },
  { id: 'suit-heart', label: 'Tim suit', category: 'general' },
  { id: 'suit-heart-fill', label: 'Tim suit đầy', category: 'general' },
  { id: 'calendar', label: 'Lịch', category: 'general' },
  { id: 'calendar-fill', label: 'Lịch đầy', category: 'general' },
  { id: 'calendar-check', label: 'Lịch check', category: 'general' },
  { id: 'calendar-check-fill', label: 'Lịch check đầy', category: 'general' },
  { id: 'gear', label: 'Cài đặt', category: 'general' },
  { id: 'gear-fill', label: 'Cài đặt đầy', category: 'general' },
  { id: 'link', label: 'Link', category: 'general' },
  { id: 'link-45deg', label: 'Link 45 độ', category: 'general' },
  { id: 'box-arrow-up-right', label: 'Link ngoài', category: 'general' },
  { id: 'arrow-right', label: 'Mũi tên phải', category: 'general' },
  { id: 'arrow-left', label: 'Mũi tên trái', category: 'general' },
  { id: 'arrow-up', label: 'Mũi tên lên', category: 'general' },
  { id: 'arrow-down', label: 'Mũi tên xuống', category: 'general' },
  { id: 'chevron-right', label: 'Chevron phải', category: 'general' },
  { id: 'chevron-left', label: 'Chevron trái', category: 'general' },
  { id: 'chevron-up', label: 'Chevron lên', category: 'general' },
  { id: 'chevron-down', label: 'Chevron xuống', category: 'general' },
  
  // Real Estate
  { id: 'house', label: 'Nhà', category: 'realestate' },
  { id: 'house-fill', label: 'Nhà đầy', category: 'realestate' },
  { id: 'house-door', label: 'Nhà cửa', category: 'realestate' },
  { id: 'house-door-fill', label: 'Nhà cửa đầy', category: 'realestate' },
  { id: 'house-heart', label: 'Nhà tim', category: 'realestate' },
  { id: 'house-heart-fill', label: 'Nhà tim đầy', category: 'realestate' },
  { id: 'building', label: 'Tòa nhà', category: 'realestate' },
  { id: 'buildings', label: 'Nhiều tòa nhà', category: 'realestate' },
  { id: 'buildings-fill', label: 'Nhiều tòa nhà đầy', category: 'realestate' },
  { id: 'door-open', label: 'Cửa mở', category: 'realestate' },
  { id: 'door-open-fill', label: 'Cửa mở đầy', category: 'realestate' },
  { id: 'door-closed', label: 'Cửa đóng', category: 'realestate' },
  { id: 'door-closed-fill', label: 'Cửa đóng đầy', category: 'realestate' },
  { id: 'key', label: 'Chìa khóa', category: 'realestate' },
  { id: 'key-fill', label: 'Chìa khóa đầy', category: 'realestate' },
  { id: 'map', label: 'Bản đồ', category: 'realestate' },
  { id: 'map-fill', label: 'Bản đồ đầy', category: 'realestate' },
  { id: 'rulers', label: 'Thước', category: 'realestate' },
  { id: 'bounding-box', label: 'Diện tích', category: 'realestate' },
  { id: 'bounding-box-circles', label: 'Diện tích circles', category: 'realestate' },
  { id: 'droplet', label: 'Giọt nước', category: 'realestate' },
  { id: 'droplet-fill', label: 'Giọt nước đầy', category: 'realestate' },
  { id: 'thermometer', label: 'Nhiệt kế', category: 'realestate' },
  { id: 'thermometer-half', label: 'Nhiệt kế nửa', category: 'realestate' },
  { id: 'fan', label: 'Quạt', category: 'realestate' },
  { id: 'snow', label: 'Tuyết', category: 'realestate' },
  { id: 'sun', label: 'Mặt trời', category: 'realestate' },
  { id: 'sun-fill', label: 'Mặt trời đầy', category: 'realestate' },
  { id: 'tree', label: 'Cây', category: 'realestate' },
  { id: 'tree-fill', label: 'Cây đầy', category: 'realestate' },
  { id: 'water', label: 'Nước', category: 'realestate' },
  { id: 'car-front', label: 'Xe hơi', category: 'realestate' },
  { id: 'car-front-fill', label: 'Xe hơi đầy', category: 'realestate' },
  { id: 'p-square', label: 'Bãi đỗ xe', category: 'realestate' },
  { id: 'p-square-fill', label: 'Bãi đỗ xe đầy', category: 'realestate' },
  { id: 'shield-check', label: 'Bảo vệ', category: 'realestate' },
  { id: 'shield-fill-check', label: 'Bảo vệ đầy', category: 'realestate' }
]

const filteredIcons = computed(() => {
  let icons = iconLibrary
  
  // Filter by category
  if (props.categoryFilter.length > 0) {
    icons = icons.filter(icon => props.categoryFilter.includes(icon.category))
  }
  
  if (activeCategory.value !== 'all') {
    icons = icons.filter(icon => icon.category === activeCategory.value)
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    icons = icons.filter(icon => 
      icon.label.toLowerCase().includes(query) || 
      icon.id.toLowerCase().includes(query)
    )
  }
  
  return icons
})

const getIconLabel = (iconId) => {
  if (iconId === 'custom') return 'Tùy chỉnh'
  if (iconId === 'none') return 'Không có'
  const icon = iconLibrary.find(i => i.id === iconId)
  return icon?.label || iconId
}

// Get icon URL from CDN (email-compatible)
const getIconUrl = (iconId) => {
  if (!iconId || iconId === 'none' || iconId === 'custom') return ''
  return `${ICON_CDN_BASE}${iconId}.svg`
}

const selectIcon = (iconId) => {
  emit('update:modelValue', iconId)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.icon-selector')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose for parent component
defineExpose({
  iconLibrary,
  getIconUrl,
  ICON_CDN_BASE
})
</script>

<style scoped>
.icon-selector {
  position: relative;
}
</style>
