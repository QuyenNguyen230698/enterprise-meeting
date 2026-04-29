<template>
  <div
    v-if="modelValue"
    style="z-index: 999999 !important"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <i class="bi bi-send text-emerald-600"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Gửi Email Test</h3>
            <p class="text-xs text-gray-500">
              {{ isPublicMode ? 'Sử dụng Gmail của bạn để Gửi Email' : 'Kiểm tra template trên email thật' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        <!-- Gmail Credentials for Public Mode -->
        <div v-if="isPublicMode" class="space-y-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="bi bi-google text-teal-600"></i>
              <span class="text-sm font-medium text-teal-800">Gmail Credentials</span>
              <span
                v-if="hasStoredCredentials"
                class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                <i class="bi bi-check-circle-fill mr-1"></i>Đã lưu
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="hasStoredCredentials"
                @click="resetGmailCredentials"
                class="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
              >
                <i class="bi bi-trash"></i> Reset
              </button>
              <button
                @click="showGmailHelp = !showGmailHelp"
                class="text-teal-600 hover:text-teal-800 text-xs"
              >
                <i class="bi bi-question-circle"></i> Hướng dẫn
              </button>
            </div>
          </div>

          <!-- Gmail Help -->
          <div v-if="showGmailHelp" class="p-3 bg-white rounded-lg text-xs text-gray-600 space-y-2">
            <p><strong>Để lấy App Password:</strong></p>
            <ol class="list-decimal list-inside space-y-1 ml-2">
              <li>
                Vào
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  class="text-teal-600 underline"
                  >Google Account Security</a
                >
              </li>
              <li>Bật 2-Step Verification nếu chưa bật</li>
              <li>Tìm "App Passwords" và tạo mới</li>
              <li>Chọn "Mail" và "Other (Custom name)"</li>
              <li>Copy mật khẩu 16 ký tự được tạo</li>
            </ol>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Gmail của bạn *
            </label>
            <input
              v-model="gmailEmail"
              type="email"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              placeholder="your-email@gmail.com"
              :disabled="hasStoredCredentials"
              :class="{ 'bg-gray-100': hasStoredCredentials }"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              App Password *
            </label>
            <input
              v-model="gmailAppPassword"
              :type="hasStoredCredentials ? 'password' : 'text'"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              placeholder="xxxx xxxx xxxx xxxx"
              :disabled="hasStoredCredentials"
              :class="{ 'bg-gray-100': hasStoredCredentials }"
            />
            <p class="text-xs text-gray-500 mt-1">
              {{ hasStoredCredentials ? 'Thông tin đã được lưu và mã hóa' : 'Không phải mật khẩu Gmail thông thường' }}
            </p>
          </div>
        </div>

        <!-- Email Address -->
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Email nhận *
          </label>
          <input
            v-model="testEmailAddress"
            type="email"
            class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="recipient@example.com"
            @keyup.enter="sendTestEmail"
          />
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Tiêu đề email
          </label>
          <input
            v-model="testEmailSubject"
            type="text"
            class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="Email Test - Emailer Builder"
          />
        </div>

        <!-- Result -->
        <div
          v-if="testEmailResult"
          class="p-4 rounded-xl"
          :class="testEmailResult.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              :class="testEmailResult.success ? 'bg-emerald-100' : 'bg-red-100'"
            >
              <i :class="testEmailResult.success ? 'bi bi-check-lg text-emerald-600' : 'bi bi-x-lg text-red-600'"></i>
            </div>
            <div class="flex-1">
              <span
                :class="testEmailResult.success ? 'text-emerald-700' : 'text-red-700'"
                class="text-sm font-medium"
              >
                {{ testEmailResult.message }}
              </span>
              <p v-if="testEmailResult.remaining !== undefined" class="text-xs text-gray-500 mt-1">
                Còn lại: {{ testEmailResult.remaining }}/50 lượt gửi trong giờ này
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100 shrink-0">
        <button
          @click="close"
          class="px-6 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
        >
          Đóng
        </button>
        <button
          @click="sendTestEmail"
          :disabled="sendingTestEmail || !testEmailAddress || (isPublicMode && (!gmailEmail || !gmailAppPassword))"
          class="px-6 py-1.5 text-sm font-medium text-white bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <i v-if="sendingTestEmail" class="bi bi-arrow-repeat animate-spin"></i>
          <i v-else class="bi bi-send"></i>
          {{ sendingTestEmail ? 'Đang gửi...' : 'Gửi Email' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isPublicMode: {
    type: Boolean,
    default: false
  },
  generateHtmlFn: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()
const authStore = useAuthStore()
const apiBaseUrl = config.public.apiBase

// Gmail credentials state
const gmailEmail = ref('')
const gmailAppPassword = ref('')
const hasStoredCredentials = ref(false)
const showGmailHelp = ref(false)
const GMAIL_STORAGE_KEY = 'emailer_gmail_credentials'

// Test email state
const testEmailAddress = ref('')
const testEmailSubject = ref('Email Test - Emailer Builder')
const sendingTestEmail = ref(false)
const testEmailResult = ref(null)

// Simple encryption/decryption for localStorage
const encryptCredentials = (email, password) => {
  const data = JSON.stringify({ e: email, p: password })
  return btoa(data.split('').reverse().join(''))
}

const decryptCredentials = (encrypted) => {
  try {
    const reversed = atob(encrypted).split('').reverse().join('')
    return JSON.parse(reversed)
  } catch {
    return null
  }
}

const loadStoredGmailCredentials = () => {
  try {
    const stored = localStorage.getItem(GMAIL_STORAGE_KEY)
    if (stored) {
      const creds = decryptCredentials(stored)
      if (creds && creds.e && creds.p) {
        gmailEmail.value = creds.e
        gmailAppPassword.value = creds.p
        hasStoredCredentials.value = true
        return true
      }
    }
  } catch (e) {
    console.error('Failed to load Gmail credentials:', e)
  }
  return false
}

const saveGmailCredentials = () => {
  try {
    if (gmailEmail.value && gmailAppPassword.value) {
      const encrypted = encryptCredentials(gmailEmail.value, gmailAppPassword.value)
      localStorage.setItem(GMAIL_STORAGE_KEY, encrypted)
      hasStoredCredentials.value = true
    }
  } catch (e) {
    console.error('Failed to save Gmail credentials:', e)
  }
}

const resetGmailCredentials = () => {
  gmailEmail.value = ''
  gmailAppPassword.value = ''
  hasStoredCredentials.value = false
  localStorage.removeItem(GMAIL_STORAGE_KEY)
}

const close = () => {
  emit('update:modelValue', false)
}

const sendTestEmail = async () => {
  if (!testEmailAddress.value) return

  // For public mode, require Gmail credentials
  if (props.isPublicMode) {
    if (!gmailEmail.value || !gmailAppPassword.value) {
      testEmailResult.value = {
        success: false,
        message: 'Vui lòng nhập Gmail và App Password của bạn'
      }
      return
    }
  }

  sendingTestEmail.value = true
  testEmailResult.value = null

  try {
    // Generate HTML content using the provided function
    const htmlContent = props.generateHtmlFn()

    let response

    if (props.isPublicMode) {
      // Public mode: Use user's Gmail credentials
      response = await fetch(`${apiBaseUrl}/public/email/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Email Builder',
          html: htmlContent,
          gmailEmail: gmailEmail.value,
          gmailAppPassword: gmailAppPassword.value
        })
      })
    } else {
      // Authenticated mode: Use system email

      response = await fetch(`${apiBaseUrl}/v1/admin/system-email-config/send-template-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Emailer Builder',
          html: htmlContent
        })
      })
    }

    const data = await response.json()

    testEmailResult.value = {
      success: data.success,
      message: data.success
        ? 'Email đã được gửi thành công! Kiểm tra hộp thư của bạn.'
        : data.message || 'Gửi thất bại',
      remaining: data.remaining
    }

    // Save Gmail credentials on success (public mode only)
    if (data.success && props.isPublicMode) {
      saveGmailCredentials()
    }
  } catch (error) {
    console.error('Send test email error:', error)
    testEmailResult.value = {
      success: false,
      message: props.isPublicMode
        ? 'Không thể gửi email. Vui lòng kiểm tra Gmail và App Password.'
        : 'Không thể gửi email test. Vui lòng kiểm tra cấu hình SMTP.'
    }
  } finally {
    sendingTestEmail.value = false
  }
}

// Load stored credentials when modal opens
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.isPublicMode && !hasStoredCredentials.value) {
      loadStoredGmailCredentials()
    }
    // Reset result when reopening
    if (newVal) {
      testEmailResult.value = null
    }
  }
)

onMounted(() => {
  if (props.isPublicMode) {
    loadStoredGmailCredentials()
  }
})
</script>
