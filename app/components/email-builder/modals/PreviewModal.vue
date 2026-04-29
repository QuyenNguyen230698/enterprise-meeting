<template>
  <div style="z-index: 999999 !important" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
      <!-- Header - Desktop: horizontal, Mobile: vertical with better spacing -->
      <div class="flex flex-col md:flex-row w-full p-4 border-b border-gray-200 relative">
        <!-- Top row - Device dropdown and close button -->
        <div class="flex items-center justify-between md:justify-start w-full md:w-auto">
          <div class="flex items-center gap-4">
            <!-- Device Dropdown (only visible on Preview tab) -->
            <details v-if="activeTab === 'preview'" ref="previewDeviceDropdown" class="dropdown relative">
              <summary class="flex items-center px-5 rounded py-1 bg-gray-500 border-gray-500 hover:bg-gray-900 text-white gap-2 cursor-pointer">
                <i :class="currentDevice.icon + ' text-base'"></i>
                <span class="text-sm">{{ currentDevice.name }}</span>
                <i class="bi bi-chevron-down text-xs"></i>
              </summary>
              <ul class="dropdown-content menu bg-white rounded-lg shadow-lg border border-gray-200 w-52 p-2 mt-2 z-60 absolute left-0 top-full">
                <li v-for="device in devices" :key="device.name">
                  <a
                    @click="selectPreviewDevice(device)"
                    :class="[
                      'flex items-center gap-3 px-3 py-1 rounded-md text-sm transition-colors',
                      currentDevice.name === device.name
                        ? 'bg-emerald-100 text-emerald-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    <i :class="device.icon + ' text-base text-black'"></i>
                    <div class="flex-1">
                      <div class="font-medium text-black cursor-pointer">{{ device.name }}</div>
                      <!-- <div class="text-xs text-gray-500">{{ device.width }}px</div> -->
                    </div>
                    <i
                      v-if="currentDevice.name === device.name"
                      class="bi bi-check-lg text-emerald-600"
                    ></i>
                  </a>
                </li>
              </ul>
            </details>
          </div>

          <!-- Close button - mobile only, desktop hidden -->
          <button
            @click="$emit('close')"
            class="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        <!-- Bottom row - Send Test button -->
        <div class="flex md:hidden items-center w-full mt-3">
          <button
            @click="openTestEmailModal"
            class="flex items-center justify-center gap-2 w-full px-4 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <i class="bi bi-send"></i>
            <span>Gửi Email</span>
          </button>
        </div>

        <!-- Desktop only - Send Test and Close buttons -->
        <div class="hidden md:flex items-center gap-2 ml-auto">
          <button
            @click="openTestEmailModal"
            class="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <i class="bi bi-send"></i>
            <span>Gửi Email</span>
          </button>

          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
      </div>
      
      <!-- Test Email Modal -->
      <div v-if="showTestEmailModal" class="absolute inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showTestEmailModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <i class="bi bi-send text-emerald-600"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Gửi Email Test</h3>
                <p class="text-xs text-gray-500">Kiểm tra template trên email thật</p>
              </div>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email nhận *</label>
                <input 
                  v-model="testEmailAddress"
                  type="email"
                  class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="your-email@example.com"
                  @keyup.enter="sendTestEmail"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Tiêu đề email</label>
                <input 
                  v-model="testEmailSubject"
                  type="text"
                  class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Email Test - Emailer Builder"
                />
              </div>

              <!-- Public Mode: Gmail Credentials -->
              <div v-if="isPublicMode" class="border-t border-gray-200 pt-4 mt-4">
                <div class="mb-3">
                  <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email Gmail *</label>
                  <input 
                    v-model="gmailEmail"
                    type="email"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="your-email@gmail.com"
                    :readonly="showResetMode"
                  />
                  <p v-if="!showResetMode" class="text-xs text-gray-400 mt-1">Email Gmail của bạn để Gửi Email</p>
                  <p v-else class="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <i class="bi bi-check-circle-fill"></i>
                    Đã lưu email: {{ gmailEmail }}
                  </p>
                </div>

                <div class="mb-3">
                  
                  <!-- Show reset button when credentials are stored -->
                  <div v-if="showResetMode" class="flex items-center gap-3">
                    
                    <button 
                      @click="resetCredentials"
                      class="px-4 py-2 w-full text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <i class="bi bi-arrow-clockwise mr-1"></i>
                      Reset
                    </button>
                  </div>
                  
                  <!-- Show input field when no credentials stored -->
                  <div v-else>
                    <input 
                      v-model="gmailAppPassword"
                      type="password"
                      class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                      placeholder="abcd-efgh-ijkl-mnop"
                    />
                    <p class="text-xs text-gray-400 mt-1">
                      <strong>Cách tạo App Password:</strong><br>
                      <span class="text-teal-600">Bước 1:</span> Bật xác minh 2 bước tại <a href="https://myaccount.google.com/security" target="_blank" class="text-emerald-600 hover:text-emerald-700 underline">myaccount.google.com/security</a><br>
                      <span class="text-teal-600">Bước 2:</span> Vào <a href="https://myaccount.google.com/apppasswords" target="_blank" class="text-emerald-600 hover:text-emerald-700 underline">Mật khẩu ứng dụng</a> → "Mail" → "Khác" → Đặt tên → "Tạo"
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="testEmailResult" class="p-4 rounded-xl" :class="testEmailResult.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="testEmailResult.success ? 'bg-emerald-100' : 'bg-red-100'"
                  >
                    <i :class="testEmailResult.success ? 'bi bi-check-lg text-emerald-600' : 'bi bi-x-lg text-red-600'"></i>
                  </div>
                  <div class="flex-1">
                    <span :class="testEmailResult.success ? 'text-emerald-700' : 'text-red-700'" class="text-sm font-medium">
                      {{ testEmailResult.message }}
                    </span>
                    <p v-if="testEmailResult.remaining !== undefined" class="text-xs text-gray-500 mt-1">
                      Còn lại: {{ testEmailResult.remaining }}/50 lượt gửi trong giờ này
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100 shrink-0">
            <button 
              @click="showTestEmailModal = false" 
              class="px-6 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Đóng
            </button>
            <button 
              @click="sendTestEmail"
              :disabled="sendingTestEmail || !testEmailAddress || (isPublicMode && (!gmailEmail))"
              class="px-6 py-1.5 text-sm font-medium text-white bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <i v-if="sendingTestEmail" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-send"></i>
              {{ sendingTestEmail ? 'Đang gửi...' : 'Gửi Email' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex">
          <button
            @click="activeTab = 'preview'"
            :class="[
              'px-6 py-3 text-sm font-medium transition-colors',
              activeTab === 'preview'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <i class="bi bi-eye mr-2"></i>
            Preview
          </button>
          <button
            @click="activeTab = 'html'"
            :class="[
              'px-6 py-3 text-sm font-medium transition-colors',
              activeTab === 'html'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <i class="bi bi-code-slash mr-2"></i>
            HTML Code
          </button>
          <button
            @click="activeTab = 'json'"
            :class="[
              'px-6 py-3 text-sm font-medium transition-colors',
              activeTab === 'json'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <i class="bi bi-file-earmark-code mr-2"></i>
            JSON Data
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden">
        <!-- Preview Tab: HTML in iframe for proper @media support -->
        <div v-if="activeTab === 'preview'" class="h-full bg-linear-to-br from-gray-50 to-gray-100 overflow-y-auto py-4">
          <div class="flex items-start justify-center min-h-full">
            <!-- Preview Device Frame -->
            <div 
              class="bg-white shadow-2xl rounded-2xl border-2 border-gray-200 transition-all duration-300 relative flex flex-col"
              :style="{ 
                width: getPreviewContainerWidth(),
                maxWidth: '100%'
              }"
            >
              <!-- Device Header with professional styling -->
              <div class="bg-linear-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-t-2xl flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                  <i :class="currentDevice.icon + ' text-xl'"></i>
                  <div>
                    <div class="font-semibold text-sm">{{ currentDevice.name }} Preview</div>
                    <div class="text-xs text-gray-300">{{ currentDevice.width }}px viewport</div>
                  </div>
                </div>
                
                <!-- Device indicator dots (like browser chrome) -->
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <!-- Email Content - No iframe scrolling, container scrolls -->
              <div class="bg-white">
                <iframe
                  v-if="previewHtml"
                  ref="previewIframe"
                  :srcdoc="previewHtml"
                  scrolling="no"
                  class="w-full border-0 block"
                  :style="{ 
                    width: '100%',
                    height: iframeHeight + 'px',
                    minHeight: '400px'
                  }"
                  @load="adjustIframeHeight"
                ></iframe>
                <div v-else class="p-12 text-center text-gray-500">
                  <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p class="text-lg font-medium">Generating preview...</p>
                </div>
              </div>
              
              <!-- Device Footer with professional styling -->
              <div class="bg-gray-800 text-white px-6 py-1.5 rounded-b-2xl flex items-center justify-center shrink-0">
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <span><i class="bi bi-aspect-ratio mr-1"></i>{{ currentDevice.width }}px</span>
                  <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span><i class="bi bi-envelope mr-1"></i>Email Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- HTML Code Tab -->
        <div v-if="activeTab === 'html'" class="h-full flex flex-col">
          <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Generated HTML</h3>
              <p class="text-sm text-gray-500">Copy this code to use in your email client</p>
            </div>
            <button
              @click="copyHtml"
              :class="[
                'px-6 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2',
                htmlCopied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              ]"
            >
              <i :class="htmlCopied ? 'bi bi-check-lg' : 'bi bi-clipboard'"></i>
              {{ htmlCopied ? 'Copied!' : 'Copy HTML' }}
            </button>
          </div>
          
          <div class="flex-1 overflow-auto p-4 bg-gray-50">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 border-dashed rounded border border-gray-100">{{ generatedHtml }}</pre>
          </div>
        </div>

        <!-- JSON Data Tab -->
        <div v-if="activeTab === 'json'" class="h-full flex flex-col">
          <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">JSON Data</h3>
              <p class="text-sm text-gray-500">Email template structure in JSON format</p>
            </div>
            <button
              @click="copyJson"
              :class="[
                'px-6 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2',
                jsonCopied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              ]"
            >
              <i :class="jsonCopied ? 'bi bi-check-lg' : 'bi bi-clipboard'"></i>
              {{ jsonCopied ? 'Copied!' : 'Copy JSON' }}
            </button>
          </div>
          
          <div class="flex-1 overflow-auto p-4 bg-gray-50">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 border border-gray-100 border-dashed shadow-xl">{{ generatedJson }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { sanitizeHtml, getSafeHtml } from '~/utils/sanitizeHtml.js'
import { getEmailIcon, getSocialIcon, SOCIAL_COLORS } from '~/utils/emailIcons.js'

// Bootstrap Icons CDN base URL
const ICON_CDN_BASE = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/icons'

// Helper to render icon as image (email-safe - Gmail strips inline SVG)
const renderIcon = (icon, fallback, size = '16', customUrl = '', color = 'currentColor') => {
  // If customUrl is provided, use image
  if (customUrl && customUrl.trim()) {
    return `<img src="${customUrl}" alt="icon" style="width:${size}px;height:${size}px;vertical-align:middle;object-fit:contain;" />`
  }
  
  // Use CDN image for email compatibility (Gmail strips inline SVG)
  let iconId = icon || fallback
  if (!iconId || iconId === 'none') return ''
  
  const iconUrl = `${ICON_CDN_BASE}/${iconId}.svg`
  return `<img src="${iconUrl}" alt="${iconId}" style="width:${size}px;height:${size}px;vertical-align:middle;" />`
}

// Helper to render icon in a circle with proper centering
const renderIconInCircle = (icon, fallback, iconSize = '20', circleSize = '40', bgColor = '#fee2e2', customUrl = '', color = '#22c55e') => {
  // If customUrl is provided, use image in circle
  if (customUrl && customUrl.trim()) {
    return `<table cellpadding="0" cellspacing="0" border="0" style=";margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${customUrl}" alt="icon" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
  }
  
  // Use CDN image for email compatibility (Gmail strips inline SVG)
  let iconId = icon || fallback
  if (!iconId || iconId === 'none') {
    iconId = fallback
  }
  if (!iconId) return ''
  
  const iconUrl = `${ICON_CDN_BASE}/${iconId}.svg`
  return `<table cellpadding="0" cellspacing="0" border="0" style=";margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${iconUrl}" alt="${iconId}" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
}

const props = defineProps({
  elements: {
    type: Array,
    required: true
  },
  devices: {
    type: Array,
    required: true
  },
  globalSettings: {
    type: Object,
    default: () => ({})
  },
  generateHtmlFn: {
    type: Function,
    default: null
  }
})

defineEmits(['close'])

// Runtime config for API
const runtimeConfig = useRuntimeConfig()
const apiBaseUrl = runtimeConfig.public.apiBase || 'http://localhost:8000/api'

// UI State
const activeTab = ref('preview')
const currentDevice = ref(props.devices[0])
const htmlCopied = ref(false)
const jsonCopied = ref(false)
const previewHtml = ref('')

// Test Email State
const showTestEmailModal = ref(false)
const testEmailAddress = ref('')
const testEmailSubject = ref('Email Test - Emailer Builder')
const sendingTestEmail = ref(false)
const testEmailResult = ref(null)

// Public mode detection and Gmail credentials
const isPublicMode = computed(() => {
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('mode') === 'public'
  }
  return false
})
const gmailEmail = ref('')
const gmailAppPassword = ref('')
const showResetMode = ref(false)

// Check for stored credentials
const storedCredentials = computed(() => {
  if (process.client) {
    try {
      const stored = localStorage.getItem('gmail_credentials')
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  }
  return null
})

// Load stored credentials on mount
onMounted(() => {
  if (storedCredentials.value) {
    gmailEmail.value = storedCredentials.value.email || ''
    showResetMode.value = true
  }
})

// Reset stored Gmail credentials
const resetCredentials = () => {
  if (process.client) {
    localStorage.removeItem('gmail_credentials')
    gmailEmail.value = ''
    gmailAppPassword.value = ''
    showResetMode.value = false
    testEmailResult.value = null
  }
}

// Preview device dropdown ref and selection
const previewDeviceDropdown = ref(null)
const previewIframe = ref(null)
const iframeHeight = ref(600)

// Adjust iframe height to match content
const adjustIframeHeight = () => {
  nextTick(() => {
    try {
      if (previewIframe.value && previewIframe.value.contentWindow) {
        const doc = previewIframe.value.contentWindow.document
        if (doc && doc.body) {
          const height = doc.body.scrollHeight || doc.documentElement.scrollHeight
          iframeHeight.value = Math.max(height + 20, 400) // Add some padding
        }
      }
    } catch (e) {
      // Cross-origin error, use default height
      iframeHeight.value = 800
    }
  })
}

// Open test email modal
const openTestEmailModal = () => {
  testEmailResult.value = null
  showTestEmailModal.value = true
}

// Send test email
const sendTestEmail = async () => {
  if (!testEmailAddress.value) return
  
  // Public mode validation
  if (isPublicMode.value) {
    if (!gmailEmail.value) {
      testEmailResult.value = {
        success: false,
        message: 'Vui lòng nhập email Gmail của bạn.'
      }
      return
    }
    // Only validate password if NOT in reset mode (credentials not stored)
    if (!showResetMode.value && !gmailAppPassword.value) {
      testEmailResult.value = {
        success: false,
        message: 'Vui lòng nhập App Password Gmail.'
      }
      return
    }
  }
  
  sendingTestEmail.value = true
  testEmailResult.value = null
  
  try {
    // Generate HTML content
    const htmlContent = props.generateHtmlFn ? props.generateHtmlFn() : ''
    
    let response
    
    if (isPublicMode.value) {
      // Public mode: Use public API without authentication
      const currentPassword = showResetMode.value ? storedCredentials.value?.password : gmailAppPassword.value
      
      response = await fetch(`${apiBaseUrl}/public/email/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Emailer Builder',
          html: htmlContent,
          gmailEmail: gmailEmail.value,
          gmailAppPassword: currentPassword
        })
      })
    } else {
      // Admin mode: Use admin API with authentication
      const authStore = useAuthStore()
      
      response = await fetch(`${apiBaseUrl}/v1/admin/system-email-config/send-template-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.accessToken}`
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Emailer Builder',
          html: htmlContent
        })
      })
    }
    
    const data = await response.json()
    
    // Save credentials to localStorage on success (public mode only)
    if (isPublicMode.value && data.success && !showResetMode.value) {
      if (process.client) {
        try {
          localStorage.setItem('gmail_credentials', JSON.stringify({
            email: gmailEmail.value,
            password: gmailAppPassword.value
          }))
          showResetMode.value = true
        } catch (e) {
          console.warn('Could not save credentials to localStorage:', e)
        }
      }
    }
    
    testEmailResult.value = {
      success: data.success,
      message: data.success ? 'Email đã được gửi thành công! Kiểm tra hộp thư của bạn.' : (data.message || 'Gửi thất bại'),
      remaining: data.remaining
    }
  } catch (error) {
    console.error('Send test email error:', error)
    testEmailResult.value = {
      success: false,
      message: isPublicMode.value 
        ? 'Không thể gửi email test. Vui lòng kiểm tra lại Gmail và App Password của bạn.' 
        : 'Không thể gửi email test. Vui lòng kiểm tra cấu hình SMTP.'
    }
  } finally {
    sendingTestEmail.value = false
  }
}

// Generate preview HTML function
const generatePreviewHtml = () => {
  previewHtml.value = props.generateHtmlFn()
}

// Auto-resize iframe to fit content
const resizeIframe = () => {
  nextTick(() => {
    if (previewIframe.value) {
      const iframe = previewIframe.value
      
      const measureAndResize = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc && iframeDoc.body) {
            // Wait for images and content to fully load
            setTimeout(() => {
              // Reset margins/padding for accurate measurement
              iframeDoc.body.style.margin = '0'
              iframeDoc.body.style.padding = '0'
              
              // Get the actual content height
              const height = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.body.offsetHeight,
                iframeDoc.documentElement.scrollHeight,
                iframeDoc.documentElement.offsetHeight,
                300 // Minimum height
              )
              
              // Set iframe height to match content
              iframe.style.height = height + 'px'
              
            }, 100) // Wait 100ms for content to settle
          }
        } catch (e) {
          console.warn('Could not resize iframe:', e)
        }
      }
      
      // Try to measure immediately
      measureAndResize()
      
      // Also measure on iframe load
      iframe.onload = measureAndResize
    }
  })
}

// Watch previewHtml changes and trigger resize
watch(previewHtml, () => {
  if (previewHtml.value) {
    resizeIframe()
  }
}, { flush: 'post' })

// Watch and regenerate when props change
watch([() => props.elements, () => props.globalSettings, () => currentDevice.value], () => {
  generatePreviewHtml()
  resizeIframe()
}, { immediate: true, deep: true })

// Select device and close dropdown
const selectPreviewDevice = (device) => {
  currentDevice.value = device
  // Close dropdown by removing open attribute
  if (previewDeviceDropdown.value) {
    previewDeviceDropdown.value.removeAttribute('open')
  }
}

// Get preview container width with smart scaling
const getPreviewContainerWidth = () => {
  const deviceWidth = currentDevice.value.width
  
  // For mobile, scale up to make it more visible
  if (deviceWidth <= 400) {
    return '450px'  // Mobile scaled to 450px container
  }
  // For tablet, scale up slightly
  if (deviceWidth <= 768) {
    return '820px'  // Tablet scaled to 820px container
  }
  // Desktop stays same
  return deviceWidth + 'px'
}

// Get iframe scale transform
const getIframeScale = () => {
  const deviceWidth = currentDevice.value.width
  
  // Mobile: scale from 375px to fit 450px container
  if (deviceWidth <= 400) {
    const scale = 450 / deviceWidth
    return `scale(${scale})`
  }
  // Tablet: scale from 768px to fit 820px container
  if (deviceWidth <= 768) {
    const scale = 820 / deviceWidth
    return `scale(${scale})`
  }
  // Desktop: no scaling
  return 'scale(1)'
}


// Generate HTML from elements (lazy - only when HTML tab is active)
const generatedHtml = computed(() => {
  if (activeTab.value !== 'html') return ''
  return props.generateHtmlFn ? props.generateHtmlFn() : ''
})

// Generate JSON from elements (lazy - only when JSON tab is active)
const generatedJson = computed(() => {
  if (activeTab.value !== 'json') return ''
  return JSON.stringify({
    version: '1.0',
    elements: props.elements,
    metadata: {
      createdAt: new Date().toISOString(),
      elementCount: props.elements.length
    }
  }, null, 2)
})

// Generate email HTML content - Main logic
function generateEmailHtmlContent(elements, contentWidth, breakpoint, backgroundColor, fontFamily = 'Arial, sans-serif', elementGap = 0) {
  
  let html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title>Email Template</title>
  
  <style type="text/css">
    @media only screen and (min-width: ${breakpoint}px) {
      .u-row {
        width: ${contentWidth}px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
      .u-row .u-col-100 {
        width: ${contentWidth}px !important;
      }
    }

    @media only screen and (max-width: ${breakpoint}px) {
      .u-row-container {
        max-width: 100% !important;
        /* REMOVED: padding-left/right: 0px - preserve user's custom padding */
      }
      .u-row {
        width: 100% !important;
      }
      .u-row .u-col {
        display: block !important;
        width: 100% !important;
        min-width: 320px !important;
        max-width: 100% !important;
      }
      .u-row .u-col > div {
        margin: 0 auto;
      }
      .u-row .u-col img {
        max-width: 100% !important;
      }
    }

    /* Visibility Classes - Hide on Mobile (max-width: 480px) */
    @media only screen and (max-width: 480px) {
      .hide-on-mobile {
        display: none !important;
        mso-hide: all !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
    }

    /* Visibility Classes - Hide on Tablet (481px - 768px) */
    @media only screen and (min-width: 481px) and (max-width: 768px) {
      .hide-on-tablet {
        display: none !important;
        mso-hide: all !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
    }

    /* Visibility Classes - Hide on Desktop (min-width: 769px) */
    @media only screen and (min-width: 769px) {
      .hide-on-desktop {
        display: none !important;
        mso-hide: all !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
    }

body{margin:0;padding:0}table,td,tr{;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}
  </style>

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: ${backgroundColor};color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table role="presentation" id="u_body" style="table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: ${backgroundColor};width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: ${backgroundColor};"><![endif]-->
    
`

  elements.forEach((element, index) => {
    // Add gap between elements (not before first element) - use table for email compatibility
    if (index > 0 && elementGap > 0) {
      html += `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tr><td style="height:${elementGap}px;line-height:${elementGap}px;font-size:1px;">&nbsp;</td></tr></table>`
    }
    html += generateUnlayerRow(element, contentWidth, fontFamily)
  })

  html += `
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>
</html>`

  return html
}

// Generate Unlayer row structure
function generateUnlayerRow(element, contentWidth, fontFamily = 'Arial, sans-serif') {
  const style = element.style || {}
  const props = element.props || {}
  const bgColor = style.backgroundColor || 'transparent'
  const padding = style.padding || '0'
  const margin = style.margin || '0'
  const borderRadius = style.borderRadius || '0px'
  
  // Build visibility classes based on element props
  const visibilityClasses = []
  if (props.hideOnMobile) visibilityClasses.push('hide-on-mobile')
  if (props.hideOnTablet) visibilityClasses.push('hide-on-tablet')
  if (props.hideOnDesktop) visibilityClasses.push('hide-on-desktop')
  const visibilityClassStr = visibilityClasses.length > 0 ? ' ' + visibilityClasses.join(' ') : ''
  
  // For elements that handle their own border-radius (coupon-code, cart-reminder, order-summary, product-grid, unsubscribe)
  // Don't apply border-radius on wrapper
  const selfStyledElements = ['coupon-code', 'cart-reminder', 'order-summary', 'product-grid', 'unsubscribe']
  const isSelfStyled = selfStyledElements.includes(element.type)
  const wrapperBorderRadius = isSelfStyled ? '0px' : borderRadius
  const wrapperBgColor = isSelfStyled ? 'transparent' : bgColor
  
  return `
<div class="u-row-container${visibilityClassStr}" style="margin: ${margin}; background-color: ${wrapperBgColor}; font-family: ${fontFamily};">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: ${contentWidth}px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: ${wrapperBgColor};">
    <div style="display: table;width: 100%;height: 100%;background-color: ${wrapperBgColor};">
      <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: ${padding};background-color: ${bgColor};" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:${contentWidth}px;"><tr style="background-color: ${bgColor};"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="${contentWidth}" style="width: ${contentWidth}px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: ${wrapperBorderRadius};-webkit-border-radius: ${wrapperBorderRadius}; -moz-border-radius: ${wrapperBorderRadius};" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: ${contentWidth}px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: ${wrapperBorderRadius};-webkit-border-radius: ${wrapperBorderRadius}; -moz-border-radius: ${wrapperBorderRadius};">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: ${wrapperBorderRadius};-webkit-border-radius: ${wrapperBorderRadius}; -moz-border-radius: ${wrapperBorderRadius};"><!--<![endif]-->
  
${generateElementContent(element, contentWidth, fontFamily)}

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>`
}

// Render nested element recursively
function renderNestedElement(element, contentWidth, fontFamily = 'Arial, sans-serif') {
  const style = element.style || {}
  const props = element.props || {}
  const effectiveFontFamily = style.fontFamily || fontFamily
  
  // Handle nested columns with responsive CSS
  if (['columns2', 'columns3', 'columns4'].includes(element.type)) {
    const colCount = parseInt(element.type.replace('columns', ''))
    const colWidthPercent = Math.floor(100 / colCount)
    const colId = `col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    
    // Responsive CSS for columns - stack on mobile
    const responsiveCss = `
<style>
  .${colId} { display: flex; flex-wrap: wrap; width: 100%; }
  .${colId} > .col-item { width: ${colWidthPercent}%; vertical-align: top; padding: 4px; box-sizing: border-box; }
  @media (max-width: 600px) {
    .${colId} > .col-item { width: ${colCount > 2 ? '50%' : '100%'}; }
  }
  @media (max-width: 480px) {
    .${colId} > .col-item { width: 100%; }
  }
</style>`
    
    let html = `${responsiveCss}
<div class="${colId}" style="font-family:${effectiveFontFamily};">`
    
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((col) => {
        html += `<div class="col-item">`
        
        if (col && Array.isArray(col) && col.length > 0) {
          col.forEach(child => {
            html += renderNestedElement(child, contentWidth, fontFamily)
          })
        }
        
        html += `</div>`
      })
    }
    
    html += `</div>`
    return html
  }
  
  // Handle nested rows
  if (['row2', 'row3', 'row4'].includes(element.type)) {
    let html = `<table style="font-family:${effectiveFontFamily};" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>`
    
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((row) => {
        if (row && Array.isArray(row) && row.length > 0) {
          row.forEach(child => {
            html += `
    <tr>
      <td style="padding: 0px;">${renderNestedElement(child, contentWidth, fontFamily)}</td>
    </tr>`
          })
        }
      })
    }
    
    html += `
  </tbody>
</table>`
    return html
  }
  
  // Build full style string from element style
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ')
  
  // Render simple elements - USE USER'S STYLES with globalSettings fontFamily as fallback
  switch (element.type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      const tag = element.type.replace('heading', 'h')
      return `<${tag} style="margin: ${style.margin || '0'}; padding: ${style.padding || '0'}; font-size: ${style.fontSize || '32px'}; color: ${style.color || '#000'}; font-weight: ${style.fontWeight || 'bold'}; line-height: ${style.lineHeight || '1.2'}; text-align: ${style.textAlign || 'left'}; font-family: ${effectiveFontFamily}; letter-spacing: ${style.letterSpacing || 'normal'}; text-transform: ${style.textTransform || 'none'};">${props.children || ''}</${tag}>`
    
    case 'text':
      return `<div style="margin: ${style.margin || '0'}; padding: ${style.padding || '0'}; font-size: ${style.fontSize || '16px'}; color: ${style.color || '#374151'}; line-height: ${style.lineHeight || '1.6'}; text-align: ${style.textAlign || 'left'}; font-family: ${effectiveFontFamily}; font-weight: ${style.fontWeight || 'normal'}; font-style: ${style.fontStyle || 'normal'}; letter-spacing: ${style.letterSpacing || 'normal'}; text-transform: ${style.textTransform || 'none'};">${props.children || ''}</div>`
    
    case 'button':
      return `<div align="${style.textAlign || 'center'}" style="margin: ${style.margin || '0'};">
  <a target="_blank" href="${props.href || '#'}" target="_blank" style="box-sizing: border-box;display: inline-block;text-decoration: none;text-align: center;color: ${style.color || '#ffffff'}; background-color: ${style.backgroundColor || '#3b82f6'}; border-radius: ${style.borderRadius || '6px'}; padding: ${style.padding || '12px 24px'}; font-size: ${style.fontSize || '16px'}; font-weight: ${style.fontWeight || 'bold'}; font-family: ${effectiveFontFamily};">
    ${props.children || 'Button'}
  </a>
</div>`
    
    case 'image':
      const imgSrc = style.backgroundImage || props.src || ''
      return `<div style="text-align: ${style.textAlign || 'center'}; margin: ${style.margin || '0'}; padding: ${style.padding || '0'};">
  ${props.href ? `<a target="_blank" href="${props.href}" target="_blank">` : ''}
  <img src="${imgSrc}" alt="${props.alt || ''}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: ${style.borderRadius || '0'};" />
  ${props.href ? '</a>' : ''}
</div>`
    
    case 'divider':
      return `<hr style="border: none; border-top: 1px solid ${style.borderColor || '#e5e7eb'}; margin: ${style.margin || '10px 0'}; padding: ${style.padding || '0'};" />`
    
    case 'spacer':
      return `<div style="height: ${style.height || '0'}; margin: ${style.margin || '0'}; padding: ${style.padding || '0'};"></div>`
    
    case 'video':
      const videoUrl = props.src || props.url || props.youtubeUrl || ''
      const videoType = props.videoType || 'custom'
      const buttonBg = videoType === 'youtube' ? '#cc0000' : '#2563eb'
      const buttonText = videoType === 'youtube' ? 'Xem Video' : 'Phát Video'
      return `<div style="text-align: ${style.textAlign || 'center'}; margin: ${style.margin || '0'}; padding: ${style.padding || '0'};">
  <img src="${props.thumbnail || props.poster || 'https://via.placeholder.com/640x360?text=Video'}" alt="Video" style="max-width: 100%; height: auto; display: block; border-radius: ${style.borderRadius || '8px'}; margin: 0 auto;" />
  <div style="margin-top: 16px; text-align: center;">
    <a target="_blank" href="${videoUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: ${buttonBg}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;">
      <span style="font-size: 18px; vertical-align: middle; margin-right: 8px;">▶</span>
      <span style="vertical-align: middle;">${buttonText}</span>
    </a>
  </div>
</div>`
    
    case 'html':
      // Keep full HTML with CSS support including @media queries for preview
      let fullHtml = (props.content || props.children || '').trim()
      
      // Only remove dangerous scripts but keep all CSS
      fullHtml = fullHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
      fullHtml = fullHtml.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
      fullHtml = fullHtml.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
      
      // Smart CSS/HTML separation
      const hasStyleTags = /<style/i.test(fullHtml)
      const hasMediaQuery = /@media/.test(fullHtml)
      
      if (hasMediaQuery && !hasStyleTags) {
        const htmlTagsRegex = /<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/gi
        const htmlTags = fullHtml.match(htmlTagsRegex) || []
        
        if (htmlTags.length > 0) {
          let htmlContent = htmlTags.join('\n')
          let cssContent = fullHtml
          htmlTags.forEach(tag => {
            cssContent = cssContent.replace(tag, '')
          })
          cssContent = cssContent.trim()
          if (cssContent) {
            fullHtml = `<style>\n${cssContent}\n</style>\n${htmlContent}`
          }
        } else {
          fullHtml = `<style>\n${fullHtml}\n</style>`
        }
      }
      
      return `<div style="padding: 10px; width: 100%; box-sizing: border-box;">${fullHtml}</div>`

    case 'quote':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${style.padding || '15px 20px'};border-left:4px solid #3b82f6;background:#f8fafc;">
    <p style="margin:0;font-style:italic;color:${style.color || '#374151'};font-size:${style.fontSize || '16px'};">${props.children || ''}</p>
    ${props.author ? `<p style="margin:10px 0 0 0;color:#6b7280;font-size:14px;">— ${props.author}</p>` : ''}
  </td></tr>
</table>`

    case 'link':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${style.padding || '10px'};">
    <a target="_blank" href="${props.href || props.url || '#'}" target="_blank" style="color:${style.color || '#3b82f6'};text-decoration:underline;font-size:${style.fontSize || '16px'};">${props.children || props.text || 'Link'}</a>
  </td></tr>
</table>`

   

    case 'cta-block':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${style.padding || '24px'};background:linear-gradient(to right,#eff6ff,#eef2ff);border:1px solid #bfdbfe;border-radius:8px;text-align:center;">
    <h4 style="font-weight:bold;margin:0 0 12px 0;color:#1f2937;font-size:18px;">${props.children || 'Call to Action'}</h4>
    <a target="_blank" href="${props.href || '#'}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:white;text-decoration:none;border-radius:6px;font-weight:600;">${props.buttonText || 'Get Started'}</a>
  </td></tr>
</table>`

    case 'testimonial':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${style.padding || '16px'};border-left:4px solid #3b82f6;background:#f9fafb;border-radius:4px;">
    <p style="color:#4b5563;font-style:italic;margin:0 0 8px 0;font-size:14px;">"${props.children || 'Great product!'}"</p>
    <p style="font-size:14px;font-weight:600;color:#1f2937;margin:0;">— ${props.author || 'Customer Name'}</p>
  </td></tr>
</table>`

    case 'product-card':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${style.padding || '16px'};background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <img src="${props.image || 'https://placehold.co/300x200'}" alt="${props.children || 'Product'}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />
    <h4 style="font-weight:bold;margin:0 0 8px 0;">${props.children || 'Product Name'}</h4>
    <p style="font-size:20px;font-weight:bold;color:#3b82f6;margin:0 0 4px 0;">${props.price || '$0'}</p>
    ${props.oldPrice ? `<p style="font-size:14px;color:#9ca3af;text-decoration:line-through;margin:0;">${props.oldPrice}</p>` : ''}
  </td></tr>
</table>`

    case 'product-grid': {
      const products = props.products || []
      const cols = props.columns || 3
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const titleAlign = props.titleAlign || 'center'
      const titleFontSize = props.titleFontSize || '20px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const textAlign = titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'right' : 'left'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto 24px auto;' : titleAlign === 'right' ? 'margin:0 0 24px auto;' : 'margin:0 0 24px 0;'
      const hasIcon = props.icon || props.iconUrl
      const titleHtml = hasIcon 
        ? `<table cellpadding="0" cellspacing="0" border="0" style="${alignStyle}"><tr><td style="vertical-align:middle;">${renderIconInCircle(props.icon, 'cart3', '20', '40', '#dbeafe', props.iconUrl, props.iconColor || '#3b82f6')}</td><td style="vertical-align:middle;padding-left:12px;"><span style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};color:${props.titleColor || '#0f172a'};font-family:${fontFamily};">${props.children || 'Sản phẩm nổi bật'}</span></td></tr></table>`
        : `<p style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};text-align:${textAlign};margin:0 0 24px 0;color:${props.titleColor || '#0f172a'};font-family:${fontFamily};">${props.children || 'Sản phẩm nổi bật'}</p>`
      
      // Generate unique class name for this grid
      const gridId = `pg-${Date.now()}`
      
      // Responsive CSS for product grid
      const responsiveCss = `
<style>
  .${gridId} { display: flex; flex-wrap: wrap; gap: 16px; }
  .${gridId} .product-item { width: calc(${100/cols}% - 16px); box-sizing: border-box; }
  @media (max-width: 767px) {
    .${gridId} .product-item { width: calc(50% - 8px); }
  }
  @media (max-width: 480px) {
    .${gridId} .product-item { width: 100%; }
  }
</style>`
      
      // product-grid props
      const productGridBorderRadius = style.borderRadius || '0px'
      const cardBgColor = props.cardBgColor || '#ffffff'
      const cardBorderRadius = props.cardBorderRadius || '12px'
      const cardBorderWidth = props.cardBorderWidth || '1px'
      const cardBorderColor = props.cardBorderColor || '#e5e7eb'
      const cardPadding = props.cardPadding || '0px'
      const imageHeight = props.imageHeight || '140px'
      const imageBorderRadius = props.imageBorderRadius || '0px'
      const productNameColor = props.productNameColor || '#1f2937'
      const oldPriceColor = props.oldPriceColor || '#9ca3af'
      
      return `${responsiveCss}
<div style="padding:24px;background:${props.bgColor || '#f8fafc'};border-radius:${productGridBorderRadius};overflow:hidden;font-family:${fontFamily};">
  ${titleHtml}
  <div class="${gridId}">
    ${products.map(p => `
      <div class="product-item">
        <div style="background:${cardBgColor};border-radius:${cardBorderRadius};overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);border:${cardBorderWidth} solid ${cardBorderColor};">
          <div style="overflow:hidden;border-radius:${imageBorderRadius};height:${imageHeight};">
            <img src="${p.image || 'https://placehold.co/150x100'}" alt="${p.name}" style="width:100%;height:${imageHeight};object-fit:cover;display:block;border-radius:${imageBorderRadius};" />
          </div>
          <div style="padding:${cardPadding};">
            <p style="font-weight:600;margin:0 0 4px 0;font-size:14px;color:${productNameColor};text-align:left;min-height:36px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-family:${fontFamily};">${p.name}</p>
            <div style="text-align:left;">
              <span style="color:${props.priceColor || '#2563eb'};font-weight:bold;font-size:18px;font-family:${fontFamily};">${p.price}</span>
              ${p.oldPrice ? `<span style="color:${oldPriceColor};text-decoration:line-through;font-size:13px;margin-left:8px;">${p.oldPrice}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
</div>`
    }

   

    case 'coupon-code': {
      const couponBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '12px'
      return `<div style="padding:24px;text-align:center;background:${props.bgColor || '#fffbeb'};border:2px dashed ${props.borderColor || '#f59e0b'};border-radius:${couponBorderRadius} !important;overflow:hidden;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:12px;"><tr><td style="background:linear-gradient(to right, #f59e0b, #ea580c);color:white;padding:8px 20px;border-radius:20px;font-size:14px;font-weight:bold;">${renderIcon(props.icon, 'tag-fill', '16', props.iconUrl, '#fff')} ${props.discount || '20% OFF'}</td></tr></table>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;"><tr><td style="background:white;border:2px solid ${props.borderColor || '#f59e0b'};border-radius:8px;padding:16px;text-align:center;"><code style="font-size:${props.fontSize || '24px'};font-weight:bold;color:${props.codeColor || '#d97706'};letter-spacing:4px;font-family:monospace;">${props.children || 'SAVE20'}</code></td></tr></table>
  <p style="color:#57534e;font-size:14px;margin:0;text-align:center;">${props.description || 'Use this code at checkout'}</p>
  ${props.expiryDate ? `<p style="color:#78716c;font-size:12px;margin:8px 0 0 0;text-align:center;">Hạn sử dụng: ${props.expiryDate}</p>` : ''}
</div>`
    }

    case 'cart-reminder': {
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const titleFontSize = props.titleFontSize || '20px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const titleAlign = props.titleAlign || 'left'
      const textAlign = titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'right' : 'left'
      const cartBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '12px'
      return `<div style="padding:24px;background:${props.bgColor || '#fff7ed'};border-left:4px solid ${props.borderColor || '#f97316'};border-radius:${cartBorderRadius};overflow:hidden;font-family:${fontFamily};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
    <td style="width:52px;vertical-align:middle;">${renderIconInCircle(props.icon, 'cart-fill', '24', '48', '#fed7aa', props.iconUrl, props.iconColor || '#f97316')}</td>
    <td style="vertical-align:middle;text-align:${textAlign};">
      <h4 style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};color:${props.titleColor || '#1f2937'};margin:0 0 4px 0;font-family:${fontFamily};">${props.children || 'You left items in your cart!'}</h4>
      <p style="color:#57534e;font-size:14px;margin:0;font-family:${fontFamily};">${props.subtitle || 'Complete your order now'}</p>
    </td>
  </tr></table>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;"><tr><td align="center"><a href="${props.href || '#'}" target="_blank" style="display:inline-block;padding:12px 24px;background:${props.buttonBgColor || '#f97316'};color:${props.buttonTextColor || '#ffffff'};text-decoration:none;border-radius:${props.buttonRadius || '8px'};font-weight:600;font-family:${fontFamily};">${props.buttonText || 'View Cart'}</a></td></tr></table>
</div>`
    }

    case 'order-summary': {
      const items = props.items || []
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto;' : titleAlign === 'right' ? 'margin-left:auto;' : ''
      const orderBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '12px'
      return `<div style="padding:24px;background:${props.bgColor || '#ffffff'};border:1px solid ${props.borderColor || '#e5e7eb'};border-radius:${orderBorderRadius};font-family:${fontFamily};">
  <table style="${alignStyle}border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:16px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:44px;vertical-align:middle;">${renderIconInCircle(props.icon, 'clipboard-check', '20', '40', '#dbeafe', props.iconUrl, props.iconColor || '#3b82f6')}</td>
      <td style="vertical-align:middle;padding-left:12px;">
        <h4 style="font-weight:${titleFontWeight};font-size:${titleFontSize};font-style:${titleFontStyle};margin:0;color:${props.titleColor || '#1f2937'};font-family:${fontFamily};">${props.children || 'Đơn hàng'}</h4>
      </td>
    </tr>
  </table>
  <table style="width:100%;margin-bottom:16px;" cellpadding="0" cellspacing="0">
    ${items.map(item => `<tr>
      <td style="padding:8px 0;font-size:14px;border-bottom:1px dashed #e5e7eb;">
        <span style="display:inline-block;width:24px;height:24px;background:#f3f4f6;border-radius:4px;text-align:center;line-height:24px;font-size:12px;font-weight:500;margin-right:8px;">${item.quantity}</span>
        ${item.name}
      </td>
      <td style="padding:8px 0;text-align:right;font-size:14px;font-weight:600;border-bottom:1px dashed #e5e7eb;">${item.price}</td>
    </tr>`).join('')}
  </table>
  <div style="background:#f9fafb;border-radius:12px;padding:16px;">
    <table style="width:100%;" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:14px;padding:4px 0;color:#6b7280;">Tạm tính</td><td style="text-align:right;font-size:14px;color:#6b7280;">${props.subtotal || '$0'}</td></tr>
      <tr><td style="font-size:14px;padding:4px 0;color:#6b7280;">Phí vận chuyển</td><td style="text-align:right;font-size:14px;color:#6b7280;">${props.shipping || '$0'}</td></tr>
      <tr><td style="font-weight:bold;font-size:18px;padding-top:8px;border-top:1px solid #e5e7eb;">Tổng cộng</td><td style="text-align:right;font-weight:bold;font-size:18px;color:${props.totalColor || '#2563eb'};padding-top:8px;border-top:1px solid #e5e7eb;">${props.total || '$0'}</td></tr>
    </table>
  </div>
</div>`
    }

    case 'shipping-info':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:20px;background:${props.bgColor || '#f0fdf4'};border-radius:12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
      <tr>
        <td style="vertical-align:middle;padding-right:10px;">${getEmailIcon(props.icon || 'truck', props.iconColor || '#22c55e', 20, {'vertical-align': 'middle'})}</td>
        <td style="vertical-align:middle;"><span style="font-weight:bold;color:${props.titleColor || '#1f2937'};">${props.children || 'Shipping Info'}</span></td>
      </tr>
    </table>
    <table role="presentation" cellpadding="4" cellspacing="0" border="0" style="font-size:14px;color:${props.textColor || '#374151'};">
      <tr><td style="font-weight:600;padding-right:12px;">Người nhận:</td><td>${props.name || 'N/A'}</td></tr>
      <tr><td style="font-weight:600;padding-right:12px;">Địa chỉ:</td><td>${props.address || 'N/A'}</td></tr>
      <tr><td style="font-weight:600;padding-right:12px;">SĐT:</td><td>${props.phone || 'N/A'}</td></tr>
    </table>
  </td></tr>
</table>`

    case 'property-card': {
      const titleAlign = props.align || props.titleAlign || 'left'
      const titleFontSize = props.fontSize || props.titleFontSize || '22px'
      const titleFontWeight = props.fontWeight || props.titleFontWeight || '700'
      const titleFontStyle = props.fontStyle || props.titleFontStyle || 'normal'
      const cardId = `pc-${Date.now()}`
      
      // Responsive CSS for property card specs
      const responsiveCss = `
<style>
  .${cardId}-specs { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
  .${cardId}-spec { display: flex; align-items: center; gap: 8px; }
  .${cardId}-spec-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .${cardId}-spec-text { font-size: 13px; font-weight: 500; color: #4b5563; white-space: nowrap; }
  @media (max-width: 480px) {
    .${cardId}-spec-icon { width: 28px; height: 28px; }
    .${cardId}-spec-text { font-size: 12px; }
  }
</style>`
      
      return `${responsiveCss}
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background:${props.bgColor || '#ffffff'};border-radius:${style.borderRadius || '16px'};overflow:hidden;">
  <tr><td style="padding:0;">
    <img src="${props.image || 'https://placehold.co/600x300'}" alt="Property" style="width:100%;height:auto;display:block;" />
  </td></tr>
  <tr><td style="padding:12px 16px;background:linear-gradient(135deg, #b8860b 0%, #daa520 100%);">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tr>
      <td><span style="font-size:20px;font-weight:bold;color:#fff;">${props.price || '0'}</span></td>
      ${(props.discount || props.badge) ? `<td style="text-align:right;">
        ${props.discount ? `<span style="display:inline-block;padding:4px 12px;background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%);color:#fff;font-size:11px;font-weight:bold;border-radius:4px;margin-left:6px;">-${props.discount}%</span>` : ''}
        ${props.badge ? `<span style="display:inline-block;padding:4px 12px;background:#10b981;color:#fff;font-size:11px;font-weight:bold;border-radius:4px;text-transform:uppercase;margin-left:6px;">${props.badge}</span>` : ''}
      </td>` : ''}
    </tr></table>
  </td></tr>
  <tr><td style="padding:20px;">
    <h3 style="font-weight:${titleFontWeight};font-size:${titleFontSize};font-style:${titleFontStyle};text-align:${titleAlign};margin:0 0 12px 0;color:${props.titleColor || '#1a1a2e'};line-height:1.3;">${props.children || 'Căn hộ cao cấp'}</h3>
    <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;"><img src="${props.locationIconUrl || 'https://img.icons8.com/fluency/48/marker.png'}" alt="loc" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;" />${props.location || 'Vị trí đắc địa'}</p>
    <div class="${cardId}-specs">
      <div class="${cardId}-spec">
        <div class="${cardId}-spec-icon" style="background:${props.areaIconBgColor || '#fef3c7'};"><img src="${props.areaIconUrl || 'https://img.icons8.com/fluency/48/expand.png'}" alt="area" style="width:14px;height:14px;" /></div>
        <span class="${cardId}-spec-text">${props.area || '120m²'}</span>
      </div>
      <div class="${cardId}-spec">
        <div class="${cardId}-spec-icon" style="background:${props.bedroomsIconBgColor || '#e0e7ff'};"><img src="${props.bedroomsIconUrl || 'https://img.icons8.com/fluency/48/open-door.png'}" alt="bed" style="width:14px;height:14px;" /></div>
        <span class="${cardId}-spec-text">${props.bedrooms || 3} PN</span>
      </div>
      <div class="${cardId}-spec">
        <div class="${cardId}-spec-icon" style="background:${props.bathroomsIconBgColor || '#cffafe'};"><img src="${props.bathroomsIconUrl || 'https://img.icons8.com/fluency/48/water.png'}" alt="bath" style="width:14px;height:14px;" /></div>
        <span class="${cardId}-spec-text">${props.bathrooms || 2} VS</span>
      </div>
    </div>
  </td></tr>
</table>`
    }

    case 'property-features': {
      const features = props.features || []
      const cols = props.columns || 2
      const layout = props.layout || 'grid'
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const textAlign = titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'right' : 'left'
      const iconBgColor = props.iconBgColor || '#dcfce7'
      const colWidth = Math.floor(100 / cols)
      
      // Use table-based layout for email client compatibility
      let featureHtml = ''
      if (layout === 'grid') {
        const rows = []
        for (let i = 0; i < features.length; i += cols) {
          const rowItems = features.slice(i, i + cols)
          const rowHtml = rowItems.map(f => `
            <td style="width:${colWidth}%;padding:6px;vertical-align:top;">
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9fafb;border-radius:12px;height:100%;min-height:48px;">
                ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                <span style="font-weight:500;font-size:14px;color:${props.textColor || '#374151'};font-family:${fontFamily};">${f}</span>
              </div>
            </td>
          `).join('')
          // Fill empty cells if row is not complete
          const emptyCells = cols - rowItems.length
          const emptyHtml = emptyCells > 0 ? `<td style="width:${colWidth}%;padding:6px;"></td>`.repeat(emptyCells) : ''
          rows.push(`<tr>${rowHtml}${emptyHtml}</tr>`)
        }
        featureHtml = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">${rows.join('')}</table>`
      } else {
        featureHtml = features.map(f => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9fafb;border-radius:12px;margin-bottom:8px;">
            ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
            <span style="font-weight:500;font-size:14px;color:${props.textColor || '#374151'};font-family:${fontFamily};">${f}</span>
          </div>
        `).join('')
      }
      
      return `<div style="padding:24px;background:${props.bgColor || 'transparent'};border-radius:${style.borderRadius || '16px'};overflow:hidden;font-family:${fontFamily};">
  <h4 style="font-weight:${titleFontWeight};font-size:${titleFontSize};font-style:${titleFontStyle};text-align:${textAlign};margin:0 0 20px 0;color:${props.titleColor || '#1f2937'};font-family:${fontFamily};">${props.children || 'Tiện ích'}</h4>
  ${featureHtml}
</div>`
    }

    case 'location-map': {
      const titleAlign = props.titleAlign || 'left'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto;' : titleAlign === 'right' ? 'margin-left:auto;' : ''
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const textColor = props.textColor || '#6b7280'
      const locationBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '16px'
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:20px;background:${props.bgColor || '#ffffff'};border-radius:${locationBorderRadius};overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);font-family:${fontFamily};">
      <table style="${alignStyle}margin-bottom:16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:44px;vertical-align:middle;">
            ${renderIconInCircle(props.icon, 'geo-alt-fill', '20', '40', '#fee2e2', props.iconUrl, props.iconColor || '#ef4444')}
          </td>
          <td style="vertical-align:middle;padding-left:12px;text-align:${titleAlign};">
            <p style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};margin:0 0 4px 0;color:${props.titleColor || '#1f2937'};font-family:${fontFamily};">${props.children || 'Vị trí'}</p>
            <p style="color:${textColor};font-size:14px;margin:0;font-family:${fontFamily};">${props.address || 'Address'}</p>
          </td>
        </tr>
      </table>
      <img src="${props.mapImage || 'https://placehold.co/600x300?text=Map'}" alt="Map" style="width:100%;height:200px;object-fit:cover;border-radius:8px;" />
    </div>
  </td></tr>
</table>`
    }

    case 'agent-contact': {
      const agentBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '16px'
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:24px;background:${props.bgColor || '#eff6ff'};border-radius:${agentBorderRadius};overflow:hidden;">
    <h4 style="font-weight:bold;text-align:center;margin:0 0 16px 0;color:${props.titleColor || '#1f2937'};">${props.children || 'Contact Agent'}</h4>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="width:80px;vertical-align:top;">
        <img src="${props.image || 'https://placehold.co/80x80'}" alt="Agent" style="width:70px;height:70px;border-radius:50%;object-fit:cover;" />
      </td>
      <td style="padding-left:16px;vertical-align:top;">
        <p style="font-weight:bold;font-size:18px;margin:0 0 4px 0;">${props.name || 'Agent Name'}</p>
        <p style="color:#2563eb;font-size:14px;margin:0 0 12px 0;">${props.title || 'Real Estate Agent'}</p>
        <a target="_blank" href="tel:${props.phone}" style="display:inline-block;padding:10px 20px;background:${props.buttonBgColor || '#2563eb'};color:${props.buttonTextColor || '#ffffff'};text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">${renderIcon('telephone-fill', 'telephone-fill', '14')} Gọi ngay</a>
      </td>
    </tr></table>
    <a target="_blank" href="${props.href || '#'}" style="display:block;text-align:center;margin-top:16px;padding:12px 24px;background:${props.buttonBgColor || '#2563eb'};color:${props.buttonTextColor || '#ffffff'};text-decoration:none;border-radius:8px;font-weight:600;">${props.buttonText || 'Contact Now'}</a>
    </div>
  </td></tr>
</table>`
    }

    case 'job-listing': {
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const jobId = `jl-${Date.now()}`
      
      // Responsive CSS for job listing tags
      const responsiveCss = `
<style>
  .${jobId}-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .${jobId}-tag { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; font-family: ${fontFamily}; }
  @media (max-width: 480px) {
    .${jobId}-tag { padding: 4px 10px; font-size: 11px; }
  }
</style>`
      
      const jobBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '16px'
      return `${responsiveCss}
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:24px;background:${props.bgColor || '#ffffff'};border-radius:${jobBorderRadius};overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-family:${fontFamily};">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:16px;">
        <tr>
          <td style="vertical-align:top;">
            <h3 style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};margin:0 0 4px 0;color:${props.titleColor || '#1f2937'};font-family:${fontFamily};">${props.children || 'Job Title'}</h3>
            <p style="color:${props.companyColor || '#2563eb'};font-weight:600;margin:0;font-family:${fontFamily};">${props.company || 'Company'}</p>
          </td>
          <td style="width:48px;vertical-align:top;text-align:right;">
            <table cellpadding="0" cellspacing="0" border="0"><tr><td style="width:48px;height:48px;background:${props.iconBgColor || '#dbeafe'};border-radius:12px;text-align:center;vertical-align:middle;">
              ${getEmailIcon(props.icon || 'briefcase-fill', props.iconColor || '#2563eb', 24)}
            </td></tr></table>
          </td>
        </tr>
      </table>
      <div class="${jobId}-tags">
        <span class="${jobId}-tag" style="background:#f3f4f6;color:#374151;">${props.location || 'Location'}</span>
        <span class="${jobId}-tag" style="background:#dbeafe;color:#1d4ed8;">${props.type || 'Full-time'}</span>
        <span class="${jobId}-tag" style="background:#dcfce7;color:#15803d;">${props.salary || 'Negotiable'}</span>
      </div>
      <a target="_blank" href="${props.href || '#'}" style="display:block;width:100%;text-align:center;padding:14px;background:${props.buttonBgColor || '#2563eb'};color:${props.buttonTextColor || '#ffffff'};text-decoration:none;border-radius:12px;font-weight:bold;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-family:${fontFamily};">${props.buttonText || 'Ứng tuyển ngay'} →</a>
      ${props.deadline ? `<p style="text-align:center;font-size:12px;color:#9ca3af;margin:12px 0 0 0;font-family:${fontFamily};">Hạn nộp: ${props.deadline}</p>` : ''}
    </div>
  </td></tr>
</table>`
    }

    case 'company-intro': {
      const logoPos = props.logoPosition || 'top'
      const textAlign = props.textAlign || 'center'
      const companyBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '12px'
      
      if (logoPos === 'left') {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:24px;background:${props.bgColor || 'transparent'};border-radius:${companyBorderRadius};overflow:hidden;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        ${props.logo ? `<td style="vertical-align:top;padding-right:16px;"><img src="${props.logo}" alt="Logo" style="max-height:60px;" /></td>` : ''}
        <td style="vertical-align:top;">
          <h3 style="font-weight:bold;font-size:24px;margin:0 0 8px 0;color:${props.titleColor || '#1f2937'};"> ${props.children || 'Company Name'}</h3>
          <p style="color:${props.descColor || '#6b7280'};font-size:16px;line-height:1.6;margin:0;">${props.description || 'Company description'}</p>
        </td>
      </tr></table>
    </div>
  </td></tr>
</table>`
      }
      
      if (logoPos === 'right') {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:24px;background:${props.bgColor || 'transparent'};border-radius:${companyBorderRadius};overflow:hidden;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td style="vertical-align:top;">
          <h3 style="font-weight:bold;font-size:24px;margin:0 0 8px 0;color:${props.titleColor || '#1f2937'};"> ${props.children || 'Company Name'}</h3>
          <p style="color:${props.descColor || '#6b7280'};font-size:16px;line-height:1.6;margin:0;">${props.description || 'Company description'}</p>
        </td>
        ${props.logo ? `<td style="vertical-align:top;padding-left:16px;text-align:right;"><img src="${props.logo}" alt="Logo" style="max-height:60px;" /></td>` : ''}
      </tr></table>
    </div>
  </td></tr>
</table>`
      }
      
      // Default: top
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:24px;background:${props.bgColor || 'transparent'};border-radius:${companyBorderRadius};overflow:hidden;text-align:${textAlign};">
      ${props.logo ? `<img src="${props.logo}" alt="Logo" style="max-height:60px;margin-bottom:16px;" />` : ''}
      <h3 style="font-weight:bold;font-size:24px;margin:0 0 12px 0;color:${props.titleColor || '#1f2937'};"> ${props.children || 'Company Name'}</h3>
      <p style="color:${props.descColor || '#6b7280'};font-size:16px;line-height:1.6;margin:0;">${props.description || 'Company description'}</p>
    </div>
  </td></tr>
</table>`
    }

    case 'benefits-list': {
      const benefits = props.benefits || []
      const cols = props.columns || 1
      const layout = props.layout || 'list'
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const textAlign = titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'right' : 'left'
      const iconBgColor = props.iconBgColor || '#dcfce7'
      const colWidth = Math.floor(100 / cols)
      
      // Use table-based layout for email client compatibility
      let benefitHtml = ''
      if (layout === 'grid') {
        const rows = []
        for (let i = 0; i < benefits.length; i += cols) {
          const rowItems = benefits.slice(i, i + cols)
          const rowHtml = rowItems.map(b => `
            <td style="width:${colWidth}%;padding:6px;vertical-align:top;">
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9fafb;border-radius:12px;height:100%;min-height:48px;">
                ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                <span style="font-weight:500;color:${props.textColor || '#374151'};font-family:${fontFamily};">${b}</span>
              </div>
            </td>
          `).join('')
          // Fill empty cells if row is not complete
          const emptyCells = cols - rowItems.length
          const emptyHtml = emptyCells > 0 ? `<td style="width:${colWidth}%;padding:6px;"></td>`.repeat(emptyCells) : ''
          rows.push(`<tr>${rowHtml}${emptyHtml}</tr>`)
        }
        benefitHtml = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">${rows.join('')}</table>`
      } else {
        benefitHtml = benefits.map(b => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9fafb;border-radius:12px;margin-bottom:8px;">
            ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
            <span style="font-weight:500;color:${props.textColor || '#374151'};font-family:${fontFamily};">${b}</span>
          </div>
        `).join('')
      }
      
      return `<div style="padding:24px;background:${props.bgColor || 'transparent'};border-radius:${style.borderRadius || '12px'};overflow:hidden;font-family:${fontFamily};">
  <h4 style="font-weight:${titleFontWeight};font-size:${titleFontSize};font-style:${titleFontStyle};text-align:${textAlign};margin:0 0 20px 0;color:${props.titleColor || '#1f2937'};font-family:${fontFamily};">${props.children || 'Phúc lợi'}</h4>
  ${benefitHtml}
</div>`
    }

    case 'apply-button':
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:24px;text-align:center;">
    <a target="_blank" href="${props.href || '#'}" style="display:inline-block;padding:${props.paddingY || '16px'} ${props.paddingX || '48px'};background:${props.bgColor || '#2563eb'};color:${props.textColor || '#ffffff'};text-decoration:none;border-radius:${props.borderRadius || '12px'};font-weight:${props.fontWeight || 'bold'};font-size:${props.fontSize || '18px'};border:${props.borderWidth || '0'} solid ${props.borderColor || 'transparent'};box-shadow:0 4px 14px rgba(59,130,246,0.4);">${props.icon || props.iconUrl ? renderIcon(props.icon, '', '18', props.iconUrl) + ' ' : ''}${props.children || 'Apply Now'}</a>
  </td></tr>
</table>`

    case 'header': {
      const bgColor = style.backgroundColor || props.backgroundColor || '#1f2937'
      const textColor = props.textColor || '#ffffff'
      const taglineColor = props.taglineColor || textColor
      const linkColor = props.linkColor || '#60a5fa'
      const logoPosition = props.logoPosition || 'center'
      const navAlign = props.navAlign || 'center'
      const headerLayout = props.headerLayout || 'inline'
      const headerPadding = props.padding || '16px'
      const logoAlignStyle = logoPosition === 'left' ? 'left' : logoPosition === 'right' ? 'right' : 'center'
      const navAlignStyle = navAlign === 'left' ? 'left' : navAlign === 'right' ? 'right' : 'center'
      
      const navHtml = (props.showNav && props.navLinks && props.navLinks.length > 0) 
        ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;">
            <tr><td style="text-align:${navAlignStyle};">
              ${props.navLinks.map(link => `<a target="_blank" href="${link.url || '#'}" style="color:${linkColor} !important;text-decoration:none;font-size:14px;margin:0 12px;display:inline-block;">${link.text}</a>`).join('')}
            </td></tr>
          </table>` 
        : ''
      
      // Stacked layout: logo on top, company name below
      if (headerLayout === 'stacked') {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${headerPadding};background:${bgColor};text-align:${logoAlignStyle};">
    ${props.logo ? `<img src="${props.logo}" alt="Logo" style="max-height:48px;display:block;margin-bottom:8px;${logoPosition === 'center' ? 'margin-left:auto;margin-right:auto;' : ''}" />` : ''}
    ${props.companyName ? `<div style="font-size:18px;font-weight:bold;color:${textColor};">${props.companyName}</div>` : ''}
    ${props.tagline ? `<div style="font-size:12px;color:${taglineColor};margin-top:4px;">${props.tagline}</div>` : ''}
    ${navHtml}
  </td></tr>
</table>`
      }
      
      // Inline layout (default): logo and company name side by side using table cells
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${headerPadding};background:${bgColor};text-align:${logoAlignStyle};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="${logoPosition === 'center' ? 'margin:0 auto;' : logoPosition === 'right' ? 'margin-left:auto;' : ''}">
      <tr>
        ${props.logo ? `<td style="vertical-align:middle;${props.companyName || props.tagline ? 'padding-right:12px;' : ''}"><img src="${props.logo}" alt="Logo" style="max-height:40px;display:block;" /></td>` : ''}
        ${(props.companyName || props.tagline) ? `<td style="vertical-align:middle;">
          ${props.companyName ? `<div style="font-size:18px;font-weight:bold;color:${textColor};white-space:nowrap;">${props.companyName}</div>` : ''}
          ${props.tagline ? `<div style="font-size:12px;color:${taglineColor};white-space:nowrap;">${props.tagline}</div>` : ''}
        </td>` : ''}
      </tr>
    </table>
    ${navHtml}
  </td></tr>
</table>`
    }

    case 'footer': {
      const footerSocials = props.socials || []
      const footerIconStyle = props.socialIconStyle || 'circle'
      const footerIconSize = props.socialIconSize || 'medium'
      const footerIconRadius = { square: '4px', rounded: '8px', circle: '50%' }
      const footerSvgSize = footerIconSize === 'small' ? 16 : footerIconSize === 'large' ? 24 : 20
      const footerPadding = footerIconSize === 'small' ? '6px' : footerIconSize === 'large' ? '10px' : '8px'
      
      const socialsHtml = footerSocials.filter(s => s.enabled !== false).map(social => {
        const platformColor = SOCIAL_COLORS[social.platform] || '#666666'
        if (social.logo) {
          return `<a href="${social.url}" target="_blank" style="text-decoration:none;display:inline-block;background:white;padding:${footerPadding};border-radius:${footerIconRadius[footerIconStyle]};margin:0 4px;">
            <img src="${social.logo}" alt="${social.platform}" style="height:${footerSvgSize}px;width:${footerSvgSize}px;object-fit:contain;display:block;" />
          </a>`
        } else {
          return `<a href="${social.url}" target="_blank" style="text-decoration:none;display:inline-block;background:${platformColor};padding:${footerPadding};border-radius:${footerIconRadius[footerIconStyle]};margin:0 4px;">
            ${getSocialIcon(social.platform, 'white', footerSvgSize, {'vertical-align': 'middle', 'display': 'block'})}
          </a>`
        }
      }).join('')
      
      // Build contact info section
      const contactInfo = []
      if (props.phone) contactInfo.push(`<p style="margin:0;font-size:12px;">${props.phone}</p>`)
      if (props.email) contactInfo.push(`<p style="margin:0;font-size:12px;">${props.email}</p>`)
      const contactHtml = contactInfo.length > 0 ? `<div style="margin:0 0 16px 0;">${contactInfo.join('')}</div>` : ''
      
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:32px;background:#1f2937;color:#9ca3af;text-align:center;">
    ${props.logo ? `<img src="${props.logo}" alt="Logo" style="max-height:40px;margin-bottom:16px;" />` : ''}
    ${props.companyName ? `<p style="margin:0 0 8px 0;font-size:14px;color:#ffffff;font-weight:600;">${props.companyName}</p>` : ''}
    ${props.address ? `<p style="margin:0 0 8px 0;font-size:12px;">${props.address}</p>` : ''}
    ${contactHtml}
    ${socialsHtml ? `<div style="margin:16px 0;">${socialsHtml}</div>` : ''}
    <p style="margin:0;font-size:12px;">${props.children || '© 2024 All rights reserved.'}</p>
  </td></tr>
</table>`
    }

    case 'unsubscribe': {
      const unsubBorderRadius = (style.borderRadius && style.borderRadius !== '0px') ? style.borderRadius : '0px'
      const unsubBgColor = props.bgColor || style.backgroundColor || 'transparent'
      const unsubPadding = style.padding || '16px'
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td>
    <div style="padding:${unsubPadding};background:${unsubBgColor};border-radius:${unsubBorderRadius};overflow:hidden;text-align:${props.align || 'center'};">
      <p style="color:${props.textColor || '#9ca3af'};font-size:${props.fontSize || '12px'};margin:0 0 8px 0;line-height:1.5;">${props.description || 'Nếu bạn không muốn nhận email từ chúng tôi, bạn có thể hủy đăng ký bất cứ lúc nào.'}</p>
      <a target="_blank" href="${props.href || '#unsubscribe'}" style="color:${props.linkColor || '#2563eb'};font-size:${props.fontSize || '12px'};text-decoration:underline;">${props.children || 'Hủy đăng ký'}</a>
    </div>
  </td></tr>
</table>`
    }
    
    default:
      return ''
  }
}

// Generate element content
function generateElementContent(element, contentWidth, fontFamily = 'Arial, sans-serif') {
  const style = element.style || {}
  const props = element.props || {}
  const effectiveFontFamily = style.fontFamily || fontFamily
  
  // Handle columns/rows at top level
  if (['columns2', 'columns3', 'columns4', 'row2', 'row3', 'row4'].includes(element.type)) {
    return renderNestedElement(element, contentWidth, fontFamily)
  }
  
  // Extract padding/margin from element style
  const padding = style.padding || '0'
  const margin = style.margin || '0'
  const textAlign = style.textAlign || 'center'
  const borderRadius = style.borderRadius || '0'
  
  switch (element.type) {
    case 'image':
      const imgSrc = style.backgroundImage || props.src || ''
      return `<table style="font-family:${effectiveFontFamily};" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:${padding};margin:${margin};font-family:${effectiveFontFamily};" align="${textAlign}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0;" align="${textAlign}">
      ${props.href ? `<a href="${props.href}" target="_blank">` : ''}
      <img align="${textAlign}" border="0" src="${imgSrc}" alt="${props.alt || ''}" title="${props.title || ''}" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: ${contentWidth}px;border-radius:${borderRadius};" width="${contentWidth}"/>
      ${props.href ? '</a>' : ''}
    </td>
  </tr>
</table>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'video':
    case 'property-card':
    case 'product-grid':
      // These elements are handled in renderNestedElement with no position:absolute
      return renderNestedElement(element, contentWidth, fontFamily)
    
    case 'footer':
    case 'header':
    case 'cta-block':
    case 'testimonial':
    case 'coupon-code':
    case 'cart-reminder':
    case 'order-summary':
    case 'shipping-info':
    case 'property-features':
    case 'location-map':
    case 'agent-contact':
    case 'job-listing':
    case 'company-intro':
    case 'benefits-list':
    case 'apply-button':
    case 'quote':
    case 'link':
    case 'unsubscribe':
      return renderNestedElement(element, contentWidth, fontFamily)
    
    default:
      return generateElementHtml(element)
  }
}

// Check if element is a column layout
function isColumnElement(type) {
  return ['columns2', 'columns3', 'columns4'].includes(type)
}

// Check if element is a row layout
function isRowElement(type) {
  return ['row2', 'row3', 'row4'].includes(type)
}

// Get column width percentage
function getColumnWidth(type) {
  const widths = {
    columns2: '50%',
    columns3: '33.33%',
    columns4: '25%'
  }
  return widths[type] || '100%'
}

// Generate HTML for individual element (with recursive support for nested layouts)
function generateElementHtml(element) {
  const { type, props, style } = element
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')

  // Handle Column Layouts (columns2, columns3, columns4)
  if (isColumnElement(type)) {
    let html = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="${styleStr}">\n  <tr>\n`
    
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((col, colIndex) => {
        const width = getColumnWidth(type)
        html += `    <td width="${width}" style="vertical-align: top;">\n`
        
        if (col && col.length > 0) {
          col.forEach(child => {
            // Nested Row in Column
            if (isRowElement(child.type)) {
              html += generateRowLayout(child)
            } else {
              // Regular element
              html += `      ${generateSimpleElementHtml(child)}`
            }
          })
        }
        
        html += `    </td>\n`
      })
    }
    
    html += `  </tr>\n</table>\n`
    return html
  }
  
  // Handle Row Layouts (row2, row3, row4)
  if (isRowElement(type)) {
    return generateRowLayout(element)
  }
  
  // Handle regular elements
  return generateSimpleElementHtml(element)
}

// Generate Row Layout HTML
const generateRowLayout = (element) => {
  const { style } = element
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')
  
  let html = `<div style="${styleStr}">\n`
  
  if (element.children && Array.isArray(element.children)) {
    element.children.forEach((row, rowIndex) => {
      const marginBottom = rowIndex < element.children.length - 1 ? '0px' : '0'
      html += `  <div style="margin-bottom: ${marginBottom};">\n`
      
      if (row && row.length > 0) {
        row.forEach(child => {
          // Nested Column in Row
          if (isColumnElement(child.type)) {
            html += generateColumnLayout(child)
          } else {
            // Regular element
            html += `    ${generateSimpleElementHtml(child)}`
          }
        })
      }
      
      html += `  </div>\n`
    })
  }
  
  html += `</div>\n`
  return html
}

// Generate Column Layout HTML (for nested columns in rows)
const generateColumnLayout = (element) => {
  const { style } = element
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')
  
  let html = `    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${styleStr}">\n      <tr>\n`
  
  if (element.children && Array.isArray(element.children)) {
    element.children.forEach((col, colIndex) => {
      const width = getColumnWidth(element.type)
      html += `        <td width="${width}" style="vertical-align: top;">\n`
      
      if (col && col.length > 0) {
        col.forEach(item => {
          html += `          ${generateSimpleElementHtml(item)}`
        })
      }
      
      html += `        </td>\n`
    })
  }
  
  html += `      </tr>\n    </table>\n`
  return html
}

// Generate simple element HTML (heading, text, button, image, etc.)
const generateSimpleElementHtml = (element) => {
  const { type, props, style } = element
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')

  switch (type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      const tag = type.replace('heading', 'h')
      return `<${tag} style="${styleStr}">${props.children || ''}</${tag}>\n`
    
    case 'text':
      return `<p style="${styleStr}">${props.children || ''}</p>\n`
    
    case 'button':
      return `<a target="_blank" href="${props.href || '#'}" style="${styleStr}">${props.children || 'Button'}</a>\n`
    
    case 'image':
      const imgSrc = props.src || style?.backgroundImage || ''
      const imgAlign = props.align || 'center'
      const imgMargin = imgAlign === 'center' ? '0 auto' : imgAlign === 'right' ? '0 0 0 auto' : '0'
      const imgStyle = `display: block; max-width: 100%; width: ${props.width || '100%'}; height: ${props.height || 'auto'}; aspect-ratio: ${props.aspectRatio || 'auto'}; object-fit: ${props.aspectRatio ? 'cover' : 'initial'}; margin: ${imgMargin}; border-radius: ${props.borderRadius || '0'}; border-width: ${props.borderWidth || '0'}; border-style: ${props.borderStyle || 'solid'}; border-color: ${props.borderColor || '#e5e7eb'}; ${styleStr}`
      let imgHtml = ''
      if (props.title) imgHtml += `<p style="text-align: ${imgAlign}; font-weight: 500; margin-bottom: 8px;">${props.title}</p>\n`
      if (props.href) {
        imgHtml += `<a target="_blank" href="${props.href}" style="display: block;"><img src="${imgSrc}" alt="${props.alt || 'Image'}" style="${imgStyle}" /></a>\n`
      } else {
        imgHtml += `<img src="${imgSrc}" alt="${props.alt || 'Image'}" style="${imgStyle}" />\n`
      }
      if (props.caption) imgHtml += `<p style="text-align: ${imgAlign}; font-size: 12px; color: #6b7280; margin-top: 8px; font-style: italic;">${props.caption}</p>\n`
      return imgHtml
    
    case 'video':
      const videoAlign = props.align || 'center'
      const videoMargin = videoAlign === 'center' ? '0 auto' : videoAlign === 'right' ? '0 0 0 auto' : '0'
      const videoStyle = `display: block; max-width: 100%; width: ${props.width || '100%'}; height: ${props.height || 'auto'}; aspect-ratio: ${props.aspectRatio || 'auto'}; margin: ${videoMargin}; border-radius: ${props.borderRadius || '0'}; border-width: ${props.borderWidth || '0'}; border-style: ${props.borderStyle || 'solid'}; border-color: ${props.borderColor || '#e5e7eb'};`
      let videoHtml = ''
      if (props.title) videoHtml += `<p style="text-align: ${videoAlign}; font-weight: 500; margin-bottom: 8px;">${props.title}</p>\n`
      if (props.videoType === 'youtube' && props.youtubeUrl) {
        const ytId = props.youtubeUrl.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''
        videoHtml += `<iframe src="https://www.youtube.com/embed/${ytId}" style="${videoStyle} height: ${props.height || '315px'};" frameborder="0" allowfullscreen></iframe>\n`
      } else {
        videoHtml += `<video src="${props.src || ''}" poster="${props.poster || ''}" style="${videoStyle}" ${props.controls ? 'controls' : ''} ${props.autoplay ? 'autoplay' : ''}>Video not supported</video>\n`
      }
      if (props.caption) videoHtml += `<p style="text-align: ${videoAlign}; font-size: 12px; color: #6b7280; margin-top: 8px; font-style: italic;">${props.caption}</p>\n`
      return videoHtml
    
    case 'divider':
      return `<hr style="${styleStr}" />\n`
    
    case 'spacer':
      return `<div style="height: ${style.height || '0'};"></div>\n`
    
    case 'link':
      return `<a target="_blank" href="${props.href || '#'}" style="${styleStr}">${props.children || 'Link'}</a>\n`
    
    case 'product-grid':
      const productGridColumns = props.columns || 3
      const productGridItems = props.products || []
      const productGridBgColor = props.bgColor || '#f8fafc'
      
      // Create grid layout
      let productGridHtml = `<div style="background:${productGridBgColor};padding:24px;border-radius:${style.borderRadius || '12px'};overflow:hidden;">`
      
      if (productGridItems.length > 0) {
        productGridHtml += `<h3 style="font-size:20px;font-weight:bold;text-align:center;margin:0 0 20px 0;color:${props.titleColor || '#0f172a'};">${props.children || 'Sản phẩm nổi bật'}</h3>`
        
        // Calculate responsive columns
        const gridCols = Math.min(productGridColumns, productGridItems.length)
        const colWidth = Math.floor(100 / gridCols)
        
        productGridHtml += `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="margin-bottom:20px;"><tr>`
        
        productGridItems.forEach((product, index) => {
          if (index % gridCols === 0 && index > 0) {
            productGridHtml += `</tr><tr>`
          }
          
          productGridHtml += `
            <td style="width:${colWidth}%;padding:0 8px;vertical-align:top;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background:${props.cardBgColor || '#ffffff'};border:${props.cardBorderWidth || '1px'} solid ${props.cardBorderColor || '#e5e7eb'};border-radius:${props.cardBorderRadius || '12px'};overflow:hidden;margin-bottom:16px;">
                <tr><td style="padding:0;">
                  <img src="${product.image || 'https://placehold.co/300x200/e2e8f0/64748b?text=Product'}" alt="${product.name}" style="width:100%;height:140px;object-fit:cover;display:block;" />
                  <div style="padding:16px;">
                    <h4 style="font-size:16px;font-weight:600;margin:0 0 8px 0;color:${props.productNameColor || '#1f2937'};">${product.name}</h4>
                    <div style="display:flex;items-center:justify-between;margin-bottom:8px;">
                      <span style="font-size:18px;font-weight:bold;color:${props.priceColor || '#2563eb'};">${product.price}</span>
                      ${product.oldPrice ? `<span style="font-size:14px;color:${props.oldPriceColor || '#9ca3af'};text-decoration:line-through;margin-left:8px;">${product.oldPrice}</span>` : ''}
                    </div>
                    ${product.url ? `<a target="_blank" href="${product.url}" style="display:block;text-align:center;padding:8px 16px;background:${props.buttonBgColor || '#2563eb'};color:${props.buttonTextColor || '#ffffff'};text-decoration:none;border-radius:6px;font-weight:500;font-size:14px;">Xem chi tiết</a>` : ''}
                  </div>
                </td></tr>
              </table>
            </td>`
        })
        
        productGridHtml += `</tr></table>`
      }
      
      productGridHtml += `</div>`
      return productGridHtml

    default:
      return `<div style="${styleStr}">${props.children || ''}</div>\n`
  }
}

// Convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

// Copy HTML to clipboard
const copyHtml = async () => {
  try {
    // Use parent's HTML generation function if provided, otherwise use local
    const html = props.generateHtmlFn ? props.generateHtmlFn() : ''
    await navigator.clipboard.writeText(html)
    htmlCopied.value = true
    
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      htmlCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('❌ Failed to copy HTML:', error)
  }
}

// Copy JSON to clipboard
const copyJson = async () => {
  try {
    const jsonData = {
      version: '1.0',
      elements: props.elements,
      metadata: {
        createdAt: new Date().toISOString(),
        elementCount: props.elements.length
      }
    }
    await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
    jsonCopied.value = true
   
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      jsonCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('❌ Failed to copy JSON:', error)
  }
}
</script>

<style>
/* Email preview content - Allow @media queries to work */
.email-preview-content {
  /* Reset inherited styles that might interfere */
  line-height: normal;
}

/* Ensure email HTML renders properly */


.email-preview-content img {
  max-width: 100%;
  height: auto;
}
</style>
