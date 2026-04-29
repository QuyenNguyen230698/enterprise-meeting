<template>
  <div v-if="show" class="fixed inset-0 z-[100] overflow-hidden">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 transition-opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
      @click="handleCancel"
    ></div>

    <!-- Drawer - Responsive width -->
    <div class="absolute inset-y-0 right-0 flex max-w-full">
      <div
        class="w-screen transform transition-transform duration-300 ease-in-out"
        :class="[
          show ? 'translate-x-0' : 'translate-x-full',
          'max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-[50vw]',
        ]"
      >
        <div class="flex h-full flex-col bg-white shadow-xl">
          <!-- Header -->
          <div
            class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 sm:py-6"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-xl sm:text-2xl font-bold text-white">
                Thanh toán
              </h2>
              <button
                @click="handleCancel"
                :disabled="loading"
                class="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
              >
                <i class="bi bi-x-lg text-lg sm:text-xl"></i>
              </button>
            </div>

            <!-- Steps indicator - Responsive -->
            <div class="mt-4 sm:mt-6 flex items-center justify-between">
              <div
                v-for="(stepItem, index) in steps"
                :key="index"
                class="flex items-center flex-1"
                :class="index === steps.length - 1 ? 'max-w-[100px]' : ''"
              >
                <!-- Step circle and label -->
                <div class="flex flex-col items-center flex-shrink-0">
                  <div
                    class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all shadow-lg"
                    :class="[
                      currentStep > index
                        ? 'border-white bg-white text-blue-600'
                        : currentStep === index
                          ? 'border-white bg-blue-500 text-white ring-4 ring-white/30'
                          : 'border-white/40 bg-transparent text-white/60',
                    ]"
                  >
                    <i
                      v-if="currentStep > index"
                      class="bi bi-check-lg text-lg sm:text-xl font-bold"
                    ></i>
                    <span v-else class="text-sm sm:text-base font-semibold">{{
                      index + 1
                    }}</span>
                  </div>
                  <span
                    class="mt-2 text-xs sm:text-xs font-medium text-center whitespace-nowrap px-1"
                    :class="
                      currentStep >= index
                        ? 'text-white font-semibold'
                        : 'text-white/60'
                    "
                  >
                    {{ stepItem }}
                  </span>
                </div>

                <!-- Connector line - flex to fill space, centered with circle -->
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 mx-2 sm:mx-3 flex items-center"
                >
                  <div
                    class="w-full h-0.5 transition-all"
                    :class="currentStep > index ? 'bg-white' : 'bg-white/40'"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Content - Scrollable -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
            <!-- Step 0: Chọn phương thức thanh toán (only shown if multiple providers) -->
            <div
              v-if="currentStep === 0 && steps.length === 4"
              class="space-y-4 sm:space-y-6"
            >
              <div>
                <h3
                  class="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                >
                  Chọn phương thức thanh toán
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Vui lòng chọn cổng thanh toán bạn muốn sử dụng
                </p>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:gap-4">
                <!-- PayOS Option -->
                <div
                  v-if="enablePayOS"
                  @click="formData.paymentProvider = 'payos'"
                  class="relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
                  :class="
                    formData.paymentProvider === 'payos'
                      ? 'border-blue-500 bg-blue-500/10 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  "
                >
                  <div class="flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors"
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'bg-blue-500'
                            : 'bg-gray-100'
                        "
                      >
                        <i
                          class="bi bi-wallet2 text-xl sm:text-2xl"
                          :class="
                            formData.paymentProvider === 'payos'
                              ? 'text-white'
                              : 'text-gray-400'
                          "
                        ></i>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h4
                          class="font-bold text-base sm:text-lg"
                          :class="
                            formData.paymentProvider === 'payos'
                              ? 'text-blue-600'
                              : 'text-gray-900'
                          "
                        >
                          PayOS
                        </h4>
                        <span
                          class="px-2 py-0.5 text-xs sm:text-xs font-semibold bg-green-100 text-green-700 rounded-full"
                        >
                          Khuyên dùng
                        </span>
                      </div>
                      <p
                        class="text-xs sm:text-sm mb-2 sm:mb-3"
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'text-gray-700'
                            : 'text-gray-500'
                        "
                      >
                        QR Code & Chuyển khoản ngân hàng
                      </p>
                      <ul
                        class="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs"
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        "
                      >
                        <li class="flex items-center gap-2">
                          <i class="bi bi-check-circle-fill text-green-500"></i>
                          <span>Hỗ trợ QR Code, chuyển khoản ngân hàng</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="bi bi-check-circle-fill text-green-500"></i>
                          <span>Bảo mật cao, giao dịch nhanh chóng</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i class="bi bi-check-circle-fill text-green-500"></i>
                          <span>Không cần nhập thông tin thẻ</span>
                        </li>
                      </ul>
                    </div>
                    <div class="flex-shrink-0">
                      <div
                        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                        "
                      >
                        <i
                          v-if="formData.paymentProvider === 'payos'"
                          class="bi bi-check text-white text-xs sm:text-sm font-bold"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- OnePay Option -->
                <div
                  v-if="enableOnePay"
                  @click="formData.paymentProvider = 'onepay'"
                  class="relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
                  :class="
                    formData.paymentProvider === 'onepay'
                      ? 'border-purple-500 bg-purple-500/10 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  "
                >
                  <div class="flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors"
                        :class="
                          formData.paymentProvider === 'onepay'
                            ? 'bg-purple-500'
                            : 'bg-gray-100'
                        "
                      >
                        <i
                          class="bi bi-credit-card text-xl sm:text-2xl"
                          :class="
                            formData.paymentProvider === 'onepay'
                              ? 'text-white'
                              : 'text-gray-400'
                          "
                        ></i>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h4
                          class="font-bold text-base sm:text-lg"
                          :class="
                            formData.paymentProvider === 'onepay'
                              ? 'text-purple-600'
                              : 'text-gray-900'
                          "
                        >
                          OnePay
                        </h4>
                      </div>
                      <p
                        class="text-xs sm:text-sm mb-2 sm:mb-3"
                        :class="
                          formData.paymentProvider === 'onepay'
                            ? 'text-gray-700'
                            : 'text-gray-500'
                        "
                      >
                        Thẻ ATM / Visa / Mastercard
                      </p>
                      <ul
                        class="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs"
                        :class="
                          formData.paymentProvider === 'onepay'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        "
                      >
                        <li class="flex items-center gap-2">
                          <i
                            class="bi bi-check-circle-fill text-purple-500"
                          ></i>
                          <span>Hỗ trợ thẻ nội địa và quốc tế</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i
                            class="bi bi-check-circle-fill text-purple-500"
                          ></i>
                          <span>Có thể lưu thẻ để thanh toán nhanh</span>
                        </li>
                        <li class="flex items-center gap-2">
                          <i
                            class="bi bi-check-circle-fill text-purple-500"
                          ></i>
                          <span>Thanh toán trực tiếp bằng thẻ</span>
                        </li>
                      </ul>
                    </div>
                    <div class="flex-shrink-0">
                      <div
                        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        :class="
                          formData.paymentProvider === 'onepay'
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 bg-white'
                        "
                      >
                        <i
                          v-if="formData.paymentProvider === 'onepay'"
                          class="bi bi-check text-white text-xs sm:text-sm font-bold"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 1: Thông tin gói (or Step 0 if only one provider) -->
            <div
              v-if="
                (steps.length === 4 && currentStep === 1) ||
                (steps.length === 3 && currentStep === 0)
              "
              class="space-y-4 sm:space-y-6"
            >
              <div
                class="rounded-lg border-2 border-blue-100 bg-blue-50 p-3 sm:p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base sm:text-lg font-bold text-gray-900">
                      {{ planName }}
                    </h3>
                    <p class="mt-1 text-xs sm:text-sm text-gray-600">
                      {{ planDescription }}
                    </p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-xl sm:text-2xl font-bold text-blue-600">
                      {{ price }}
                    </div>
                    <div class="text-xs sm:text-xs text-gray-500">/ tháng</div>
                  </div>
                </div>
              </div>

              <div
                v-if="planFeatures && planFeatures.length > 0"
                class="space-y-2 sm:space-y-3"
              >
                <h4 class="font-semibold text-gray-900 text-sm sm:text-base">
                  Tính năng gói:
                </h4>
                <ul class="space-y-1.5 sm:space-y-2">
                  <li
                    v-for="(feature, idx) in planFeatures"
                    :key="idx"
                    class="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
                  >
                    <i
                      class="bi bi-check-circle-fill text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Step 2: Thông tin cá nhân (or Step 1 if only one provider) -->
            <div
              v-if="
                (steps.length === 4 && currentStep === 2) ||
                (steps.length === 3 && currentStep === 1)
              "
              class="space-y-3 sm:space-y-4"
            >
              <!-- First Name and Last Name -->
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Họ <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.firstName"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ"
                    :disabled="loading"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Tên <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.lastName"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên"
                    :disabled="loading"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                >
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0912345678"
                  :disabled="loading"
                />
              </div>

              <!-- Address with AddressLocation Component -->
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                >
                  Địa chỉ
                </label>
                <AddressLocation
                  v-model="formData.address"
                  :darkTheme="false"
                />
              </div>
            </div>

            <!-- Step 3: Xác nhận (or Step 2 if only one provider) -->
            <div
              v-if="
                (steps.length === 4 && currentStep === 3) ||
                (steps.length === 3 && currentStep === 2)
              "
              class="space-y-4 sm:space-y-6"
            >
              <div
                class="rounded-lg bg-gray-50 p-3 sm:p-4 space-y-2 sm:space-y-3"
              >
                <h4 class="font-semibold text-gray-900 text-sm sm:text-base">
                  Thông tin thanh toán
                </h4>

                <div class="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Phương thức:</span>
                    <span
                      class="font-medium flex items-center gap-1.5 sm:gap-2"
                    >
                      <i
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'bi bi-wallet2 text-blue-500'
                            : 'bi bi-credit-card text-purple-500'
                        "
                      ></i>
                      <span
                        :class="
                          formData.paymentProvider === 'payos'
                            ? 'text-blue-600'
                            : 'text-purple-600'
                        "
                      >
                        {{
                          formData.paymentProvider === "payos"
                            ? "PayOS"
                            : "OnePay"
                        }}
                      </span>
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Gói:</span>
                    <span class="font-medium text-gray-900">{{
                      planName
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Họ tên:</span>
                    <span class="font-medium text-gray-900"
                      >{{ formData.firstName }} {{ formData.lastName }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Số điện thoại:</span>
                    <span class="font-medium text-gray-900">{{
                      formData.phone
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium text-gray-900 truncate">{{
                      formData.email
                    }}</span>
                  </div>

                  <div class="border-t border-gray-200 my-2 sm:my-3"></div>

                  <div class="flex justify-between items-center">
                    <span class="text-gray-900 font-semibold">Tổng cộng:</span>
                    <span class="text-xl sm:text-2xl font-bold text-blue-600">{{
                      price
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Dynamic notice based on payment provider -->
              <div
                v-if="formData.paymentProvider === 'payos'"
                class="rounded-lg border-2 border-blue-200 bg-blue-50 p-3 sm:p-4"
              >
                <div class="flex gap-2 sm:gap-3">
                  <i
                    class="bi bi-info-circle-fill text-blue-600 text-lg sm:text-xl flex-shrink-0 mt-0.5"
                  ></i>
                  <div class="text-xs sm:text-sm text-blue-800">
                    <p class="font-medium mb-1">Thanh toán qua PayOS:</p>
                    <ul
                      class="list-disc list-inside space-y-0.5 sm:space-y-1 text-blue-700"
                    >
                      <li>Bạn sẽ được chuyển đến cổng thanh toán PayOS</li>
                      <li>Hỗ trợ QR Code và chuyển khoản ngân hàng</li>
                      <li>Giao dịch được mã hóa và bảo mật tuyệt đối</li>
                      <li>Đừng đóng trình duyệt trong quá trình thanh toán</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="rounded-lg border-2 border-purple-200 bg-purple-50 p-3 sm:p-4"
              >
                <div class="flex gap-2 sm:gap-3">
                  <i
                    class="bi bi-info-circle-fill text-purple-600 text-lg sm:text-xl flex-shrink-0 mt-0.5"
                  ></i>
                  <div class="text-xs sm:text-sm text-purple-800">
                    <p class="font-medium mb-1">Thanh toán qua OnePay:</p>
                    <ul
                      class="list-disc list-inside space-y-0.5 sm:space-y-1 text-purple-700"
                    >
                      <li>Bạn sẽ được chuyển đến cổng thanh toán OnePay</li>
                      <li>Hỗ trợ thẻ ATM, Visa, Mastercard</li>
                      <li>Giao dịch được mã hóa và bảo mật tuyệt đối</li>
                      <li>Đừng đóng trình duyệt trong quá trình thanh toán</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer - Fixed at bottom -->
          <div
            class="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50"
          >
            <div class="flex gap-2 sm:gap-3">
              <button
                v-if="currentStep > 0"
                @click="handleBack"
                :disabled="loading"
                class="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="bi bi-arrow-left mr-1 sm:mr-2"></i>
                Quay lại
              </button>

              <button
                v-if="currentStep < steps.length - 1"
                @click="handleNext"
                :disabled="!canProceed || loading"
                class="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Tiếp tục
                <i class="bi bi-arrow-right ml-1 sm:ml-2"></i>
              </button>

              <button
                v-else
                @click="handleConfirm"
                :disabled="loading"
                class="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
              >
                <span v-if="!loading" class="flex items-center">
                  <i class="bi bi-shield-check mr-1 sm:mr-2"></i>
                  Xác nhận thanh toán
                </span>
                <span v-else class="flex items-center">
                  <span class="animate-spin mr-1 sm:mr-2">
                    <i class="bi bi-arrow-repeat"></i>
                  </span>
                  Đang xử lý...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  planName: {
    type: String,
    required: true,
  },
  planDescription: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    required: true,
  },
  planFeatures: {
    type: Array,
    default: () => [],
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm", "cancel", "update-user-info"]);

// Dynamic steps based on payment providers
const steps = computed(() => {
  const totalProviders =
    (enablePayOS.value ? 1 : 0) + (enableOnePay.value ? 1 : 0);
  // Skip payment method selection if only one provider is available
  if (totalProviders === 1) {
    return ["Gói dịch vụ", "Thông tin", "Xác nhận"];
  }
  return ["Phương thức", "Gói dịch vụ", "Thông tin", "Xác nhận"];
});

const currentStep = ref(0);

// Get payment provider settings from appConfig
const enableOnePay = computed(() => appConfig.payment?.enable_onepay ?? false);
const enablePayOS = computed(() => appConfig.payment?.enable_payos ?? true);

// Default to the first enabled provider
const defaultProvider = computed(() => {
  if (enablePayOS.value) return "payos";
  if (enableOnePay.value) return "onepay";
  return "payos"; // Fallback
});

const formData = ref({
  paymentProvider: defaultProvider.value,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
});

// Watch for userInfo changes
watch(
  () => props.userInfo,
  (newUserInfo) => {
    if (newUserInfo) {
      formData.value = {
        ...formData.value,
        firstName: newUserInfo.firstName || "",
        lastName: newUserInfo.lastName || "",
        phone: newUserInfo.phone || "",
        email: newUserInfo.email || "",
        address: newUserInfo.address || "",
      };
    }
  },
  { immediate: true, deep: true },
);

// Reset step when drawer is closed
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      // Reset payment provider to default when drawer opens
      formData.value.paymentProvider = defaultProvider.value;
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        currentStep.value = 0;
      }, 300);
    }
  },
);

const canProceed = computed(() => {
  const totalProviders =
    (enablePayOS.value ? 1 : 0) + (enableOnePay.value ? 1 : 0);
  const hasPaymentMethodStep = totalProviders > 1;

  if (hasPaymentMethodStep) {
    if (currentStep.value === 0) return true; // Payment provider selection
    if (currentStep.value === 1) return true; // Plan info
    if (currentStep.value === 2) {
      // Personal info validation
      return (
        formData.value.firstName &&
        formData.value.lastName &&
        formData.value.phone &&
        formData.value.phone.match(/^[0-9]{10,11}$/)
      );
    }
  } else {
    // Without payment method step
    if (currentStep.value === 0) return true; // Plan info
    if (currentStep.value === 1) {
      // Personal info validation
      return (
        formData.value.firstName &&
        formData.value.lastName &&
        formData.value.phone &&
        formData.value.phone.match(/^[0-9]{10,11}$/)
      );
    }
  }
  return true;
});

const handleNext = async () => {
  if (!canProceed.value) return;

  const totalProviders =
    (enablePayOS.value ? 1 : 0) + (enableOnePay.value ? 1 : 0);
  const hasPaymentMethodStep = totalProviders > 1;

  // Save user info when moving from personal info step to confirmation step
  const personalInfoStep = hasPaymentMethodStep ? 2 : 1;
  if (currentStep.value === personalInfoStep) {
    emit("update-user-info", formData.value);
  }

  currentStep.value++;
};

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleConfirm = () => {
  emit("confirm", formData.value);
};

const handleCancel = () => {
  if (!props.loading) {
    emit("cancel");
  }
};
</script>

<style scoped>
/* Add smooth transitions */
.transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
