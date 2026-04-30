<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click.self="onCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <!-- Header with gradient -->
          <div
            class="relative p-6 pb-4 bg-linear-to-br from-emerald-600/20 to-purple-600/20"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-linear-to-br from-emerald-600 to-purple-600 flex items-center justify-center"
                >
                  <i
                    :class="
                      mode === 'user-info'
                        ? 'bi bi-person-fill'
                        : 'bi bi-arrow-up-circle'
                    "
                    class="text-white text-xl"
                  ></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">
                    {{
                      mode === "user-info"
                        ? "Thông tin thanh toán"
                        : "Xác nhận nâng cấp"
                    }}
                  </h3>
                  <p class="text-sm text-gray-400">{{ planName }}</p>
                </div>
              </div>
              <button
                @click="onCancel"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <i class="bi bi-x text-white text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- User Info Mode -->
            <div v-if="mode === 'user-info'" class="mb-6">
              <form @submit.prevent="onConfirm">
                <!-- Payment Provider Selection -->
                <div class="mb-6">
                  <div class="text-sm font-semibold text-emerald-400 mb-3">
                    Chọn phương thức thanh toán
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <!-- PayOS Option -->
                    <div
                      @click="formData.paymentProvider = 'payos'"
                      :class="[
                        'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
                        formData.paymentProvider === 'payos'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      ]"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          :class="[
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0',
                            formData.paymentProvider === 'payos'
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-white/30',
                          ]"
                        >
                          <div
                            v-if="formData.paymentProvider === 'payos'"
                            class="w-2.5 h-2.5 rounded-full bg-white"
                          ></div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <i
                              class="bi bi-wallet2 text-blue-400 text-base"
                            ></i>
                            <span class="text-white font-semibold text-sm"
                              >PayOS</span
                            >
                          </div>
                          <p class="text-xs text-gray-400 leading-relaxed">
                            QR Code & Chuyển khoản
                          </p>
                          <div class="flex gap-1 mt-2">
                            <span
                              class="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded"
                              >Nhanh</span
                            >
                            <span
                              class="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded"
                              >An toàn</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- OnePay Option -->
                    <div
                      @click="formData.paymentProvider = 'onepay'"
                      :class="[
                        'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
                        formData.paymentProvider === 'onepay'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      ]"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          :class="[
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0',
                            formData.paymentProvider === 'onepay'
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-white/30',
                          ]"
                        >
                          <div
                            v-if="formData.paymentProvider === 'onepay'"
                            class="w-2.5 h-2.5 rounded-full bg-white"
                          ></div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <i
                              class="bi bi-credit-card text-purple-400 text-base"
                            ></i>
                            <span class="text-white font-semibold text-sm"
                              >OnePay</span
                            >
                          </div>
                          <p class="text-xs text-gray-400 leading-relaxed">
                            Thẻ ATM/Visa/Master
                          </p>
                          <div class="flex gap-1 mt-2">
                            <span
                              class="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded"
                              >Lưu thẻ</span
                            >
                            <span
                              class="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded"
                              >Tiện lợi</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2 Column Layout -->
                <div class="grid grid-cols-2 gap-6">
                  <!-- Left Column - Personal Info -->
                  <div class="space-y-4">
                    <div class="text-sm font-semibold text-emerald-400 mb-3">
                      Thông tin cá nhân
                    </div>

                    <!-- First Name -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Họ
                      </label>
                      <input
                        v-model="formData.firstName"
                        type="text"
                        class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        placeholder="Nguyễn"
                      />
                    </div>

                    <!-- Last Name -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Tên
                      </label>
                      <input
                        v-model="formData.lastName"
                        type="text"
                        class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        placeholder="Văn A"
                      />
                    </div>
                    <!-- Phone -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Số điện thoại <span class="text-red-400">*</span>
                      </label>
                      <input
                        v-model="formData.phone"
                        type="tel"
                        required
                        :class="[
                          'w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white placeholder-gray-500 focus:outline-none',
                          errors.phone
                            ? 'border-red-500'
                            : 'border-white/10 focus:border-emerald-500',
                        ]"
                        placeholder="0987654321"
                        @input="validatePhone"
                      />
                      <p v-if="errors.phone" class="text-red-400 text-xs mt-1">
                        {{ errors.phone }}
                      </p>
                    </div>
                    <!-- Save Payment -->
                  </div>

                  <!-- Right Column - Address -->
                  <div class="space-y-4">
                    <div class="text-sm font-semibold text-emerald-400 mb-3">
                      Địa chỉ
                    </div>
                    <div>
                      <AddressLocation
                        v-model="formData.address"
                        :darkTheme="true"
                      />
                    </div>
                  </div>
                </div>

                <!-- Payment Method Section - Only show for OnePay -->
                <div
                  v-if="formData.paymentProvider === 'onepay'"
                  class="mt-6 space-y-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-semibold text-emerald-400">
                      Phương thức thanh toán
                    </div>
                    <button
                      v-if="savedCards.length > 0"
                      type="button"
                      @click="showCardDrawer = true"
                      class="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <i class="bi bi-credit-card"></i>
                      <span>Danh sách thẻ ({{ savedCards.length }})</span>
                    </button>
                  </div>

                  <!-- Loading State -->
                  <div
                    v-if="loadingCards"
                    class="flex items-center justify-center p-4"
                  >
                    <div
                      class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                  </div>

                  <!-- Saved Card Display - 2 Column Grid -->
                  <div
                    v-else-if="savedCards.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <!-- Default Card (Left Column - Desktop: 1/4, Mobile: 3/4) -->
                    <div
                      @click="formData.useExistingCard = true"
                      :class="[
                        'md:col-span-1 cursor-pointer transition-all group',
                        formData.useExistingCard
                          ? 'ring-1 ring-emerald-500'
                          : 'hover:ring-1 hover:ring-white/20',
                      ]"
                      style="padding: 2px"
                      class="relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-600 via-purple-600 to-pink-600"
                    >
                      <div class="bg-slate-900 rounded-xl p-4 h-full">
                        <!-- Card Header -->
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center gap-2">
                            <div
                              :class="[
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                                formData.useExistingCard
                                  ? 'border-emerald-400 bg-emerald-500'
                                  : 'border-white/30',
                              ]"
                            >
                              <div
                                v-if="formData.useExistingCard"
                                class="w-2.5 h-2.5 rounded-full bg-white"
                              ></div>
                            </div>
                            <span class="text-xs font-medium text-gray-400"
                              >Thẻ đã lưu</span
                            >
                          </div>
                          <span
                            v-if="defaultCard?.isDefault"
                            class="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium"
                          >
                            Mặc định
                          </span>
                        </div>

                        <!-- Card Logo -->
                        <div class="mb-4">
                          <div
                            class="w-16 h-12 rounded-lg p-1 bg-white/95 p-1 flex items-center justify-center backdrop-blur-sm"
                          >
                            <img
                              v-if="
                                getCardLogo(defaultCard?.cardType).startsWith(
                                  'http',
                                )
                              "
                              :src="getCardLogo(defaultCard?.cardType)"
                              :alt="getCardName(defaultCard?.cardType)"
                              class="w-full h-full object-cover"
                            />
                            <span v-else class="text-2xl">{{
                              getCardLogo(defaultCard?.cardType)
                            }}</span>
                          </div>
                        </div>

                        <!-- Card Number -->
                        <div class="mb-3">
                          <div
                            class="text-white font-mono text-lg tracking-wider"
                          >
                            •••• •••• ••••
                            {{ defaultCard?.cardNumber?.slice(-4) || "****" }}
                          </div>
                        </div>

                        <!-- Card Info Footer -->
                        <div class="flex items-center justify-between">
                          <div>
                            <div class="text-xs text-gray-500 uppercase mb-1">
                              Hết hạn
                            </div>
                            <div class="text-sm text-white font-medium">
                              {{ formatExpiryDate(defaultCard?.vpc_TokenExp) }}
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="text-xs text-gray-500 uppercase mb-1">
                              Loại thẻ
                            </div>
                            <div class="text-sm text-white font-medium">
                              {{ getCardName(defaultCard?.cardType) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Use New Card (Right Column) -->
                    <div
                      @click="formData.useExistingCard = false"
                      :class="[
                        'md:col-span-1 cursor-pointer transition-all',
                        !formData.useExistingCard
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      ]"
                      class="p-4 rounded-xl border-2"
                    >
                      <div class="flex items-center gap-3 mb-3">
                        <div
                          :class="[
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                            !formData.useExistingCard
                              ? 'border-emerald-500'
                              : 'border-white/30',
                          ]"
                        >
                          <div
                            v-if="!formData.useExistingCard"
                            class="w-3 h-3 rounded-full bg-emerald-500"
                          ></div>
                        </div>
                        <span class="text-white font-medium text-sm"
                          >Sử dụng thẻ mới</span
                        >
                      </div>

                      <div class="flex items-center gap-2 mb-3">
                        <i
                          class="bi bi-credit-card-2-front text-purple-400 text-xl"
                        ></i>
                        <i
                          class="bi bi-credit-card text-emerald-400 text-xl"
                        ></i>
                        <i class="bi bi-wallet2 text-pink-400 text-xl"></i>
                      </div>

                      <div class="text-gray-400 text-xs mb-3">
                        Nhập thông tin thẻ mới để thanh toán
                      </div>

                      <!-- Save New Card Checkbox -->
                      <div
                        v-if="!formData.useExistingCard"
                        class="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                      >
                        <input
                          v-model="formData.savePayment"
                          type="checkbox"
                          id="savePayment"
                          class="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                        />
                        <label
                          for="savePayment"
                          class="text-xs text-gray-300 cursor-pointer"
                        >
                          Lưu thẻ này
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- No Saved Cards - OnePay only -->
                  <div v-else class="space-y-3">
                    <div
                      class="flex items-center gap-2 p-3 bg-white/5 rounded-lg"
                    >
                      <input
                        v-model="formData.savePayment"
                        type="checkbox"
                        id="savePayment"
                        class="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <label
                        for="savePayment"
                        class="text-sm text-gray-300 cursor-pointer"
                      >
                        Lưu thẻ này để thanh toán nhanh hơn lần sau
                      </label>
                    </div>
                  </div>
                </div>

                <!-- PayOS Payment Notice -->
                <div
                  v-if="formData.paymentProvider === 'payos'"
                  class="mt-6 space-y-4"
                >
                  <div
                    class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                  >
                    <div class="flex items-start gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"
                      >
                        <i class="bi bi-wallet2 text-blue-400 text-lg"></i>
                      </div>
                      <div>
                        <h4 class="text-white font-medium mb-1">
                          Thanh toán qua PayOS
                        </h4>
                        <p class="text-sm text-gray-400 mb-2">
                          Bạn sẽ được chuyển đến cổng thanh toán PayOS để hoàn
                          tất giao dịch.
                        </p>
                        <ul class="text-xs text-gray-500 space-y-1">
                          <li class="flex items-center gap-2">
                            <i
                              class="bi bi-check-circle-fill text-green-400"
                            ></i>
                            <span>Hỗ trợ QR Code, chuyển khoản ngân hàng</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <i class="bi bi-shield-check text-green-400"></i>
                            <span>Bảo mật cao, giao dịch nhanh chóng</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <i class="bi bi-credit-card text-green-400"></i>
                            <span>Không lưu thông tin thẻ</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Selection Drawer -->
                <Teleport to="body">
                  <Transition name="drawer">
                    <div
                      style="z-index: 999999 !important"
                      v-if="showCardDrawer"
                      class="fixed inset-0 flex items-center justify-start"
                      @click.self="showCardDrawer = false"
                    >
                      <div
                        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
                      ></div>
                      <div
                        class="relative h-full w-3/4 md:w-1/4 bg-slate-900 border-r border-white/10 shadow-2xl flex flex-col"
                      >
                        <!-- Drawer Header -->
                        <div class="p-4 border-b border-white/10">
                          <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-white">
                              Chọn thẻ thanh toán
                            </h3>
                            <button
                              @click="showCardDrawer = false"
                              class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                            >
                              <i class="bi bi-x text-white text-xl"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Cards List -->
                        <div class="flex-1 overflow-y-auto p-4 space-y-3">
                          <div
                            v-for="card in savedCards"
                            :key="card._id"
                            @click="selectCard(card)"
                            :class="[
                              'cursor-pointer transition-all',
                              formData.selectedCardId === card._id
                                ? 'ring-1 ring-emerald-500'
                                : 'hover:ring-1 hover:ring-white/20',
                            ]"
                            style="padding: 2px"
                            class="relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-600 via-purple-600 to-pink-600"
                          >
                            <div class="bg-slate-900 rounded-xl p-4">
                              <div
                                class="flex items-center justify-between mb-3"
                              >
                                <span
                                  v-if="card.isDefault"
                                  class="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium"
                                >
                                  Mặc định
                                </span>
                                <div
                                  v-if="formData.selectedCardId === card._id"
                                  class="ml-auto"
                                >
                                  <i
                                    class="bi bi-check-circle-fill text-emerald-400 text-xl"
                                  ></i>
                                </div>
                              </div>

                              <div
                                class="w-16 h-12 rounded-lg bg-white/95 flex items-center justify-center backdrop-blur-sm mb-3"
                              >
                                <img
                                  v-if="
                                    getCardLogo(card.cardType).startsWith(
                                      'http',
                                    )
                                  "
                                  :src="getCardLogo(card.cardType)"
                                  :alt="getCardName(card.cardType)"
                                  class="w-full h-full object-cover"
                                />
                                <span v-else class="text-2xl">{{
                                  getCardLogo(card.cardType)
                                }}</span>
                              </div>

                              <div
                                class="text-white font-mono text-lg tracking-wider mb-3"
                              >
                                •••• •••• ••••
                                {{ card.cardNumber?.slice(-4) || "****" }}
                              </div>

                              <div class="flex items-center justify-between">
                                <div>
                                  <div
                                    class="text-xs text-gray-500 uppercase mb-1"
                                  >
                                    Hết hạn
                                  </div>
                                  <div class="text-sm text-white font-medium">
                                    {{ formatExpiryDate(card.vpc_TokenExp) }}
                                  </div>
                                </div>
                                <div class="text-right">
                                  <div
                                    class="text-xs text-gray-500 uppercase mb-1"
                                  >
                                    Loại thẻ
                                  </div>
                                  <div class="text-sm text-white font-medium">
                                    {{ getCardName(card.cardType) }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </Teleport>
              </form>
            </div>

            <!-- Confirm Mode -->
            <div v-else class="mb-6">
              <p class="text-gray-300 mb-4">{{ message }}</p>

              <!-- User Info Display -->
              <div
                v-if="userInfo"
                class="bg-white/5 rounded-xl p-4 space-y-3 mb-4"
              >
                <div class="text-sm font-semibold text-emerald-400 mb-2">
                  Thông tin thanh toán
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Email</span>
                  <span class="text-white text-sm">{{ userInfo.email }}</span>
                </div>
                <div
                  v-if="userInfo.phone"
                  class="flex items-center justify-between"
                >
                  <span class="text-gray-400 text-sm">Số điện thoại</span>
                  <span class="text-white text-sm">{{ userInfo.phone }}</span>
                </div>
                <div
                  v-if="userInfo.firstName || userInfo.lastName"
                  class="flex items-center justify-between"
                >
                  <span class="text-gray-400 text-sm">Họ và tên</span>
                  <span class="text-white text-sm"
                    >{{ userInfo.firstName }} {{ userInfo.lastName }}</span
                  >
                </div>
                <div
                  v-if="userInfo.address"
                  class="flex items-center justify-between"
                >
                  <span class="text-gray-400 text-sm">Địa chỉ</span>
                  <span class="text-white text-sm">{{ userInfo.address }}</span>
                </div>
              </div>
              <!-- Plan details -->
              <div class="bg-white/5 rounded-xl p-4 space-y-3 mb-2">
                <div class="text-sm font-semibold text-emerald-400 mb-2">
                  Chi tiết gói
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Gói</span>
                  <span class="text-white font-semibold">{{ planName }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400 text-sm">Giá</span>
                  <span class="text-white font-semibold">{{ price }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
              <button
                @click="onCancel"
                class="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                @click="onConfirm"
                :disabled="loading"
                class="flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-emerald-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Xác nhận</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <i class="bi bi-arrow-repeat animate-spin"></i>
                  Đang xử lý...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import AddressLocation from "~/components/address/AddressLocation.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  planName: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "Bạn có chắc muốn nâng cấp gói này?",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "confirm", // 'confirm' or 'user-info'
    validator: (value) => ["confirm", "user-info"].includes(value),
  },
  userInfo: {
    type: Object,
    default: null,
  },
  paymentProvider: {
    type: String,
    default: "payos", // 'payos' or 'onepay'
    validator: (value) => ["payos", "onepay"].includes(value),
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const formData = ref({
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  savePayment: false,
  useExistingCard: true,
  selectedCardId: null,
  paymentProvider: props.paymentProvider || "payos",
});

const errors = ref({
  phone: "",
});

const savedCards = ref([]);
const loadingCards = ref(false);
const showCardDrawer = ref(false);

const { getCardLogo, getCardName, formatExpiryDate } = useCardUtils();

const defaultCard = computed(() => {
  return savedCards.value.find((card) => card.isDefault) || savedCards.value[0];
});

const selectCard = (card) => {
  formData.value.selectedCardId = card._id;
  formData.value.useExistingCard = true;
  showCardDrawer.value = false;
};

const fetchSavedCards = async () => {
  loadingCards.value = true;
  try {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const token = authStore.accessToken || useCookie("accessToken").value;

    const response = await fetch(
      `${config.public.apiBase}/subscriptions/saved-cards`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    if (data.result && data.cards) {
      savedCards.value = data.cards;
      if (defaultCard.value) {
        formData.value.selectedCardId = defaultCard.value._id;
        formData.value.useExistingCard = true;
      }
    }
  } catch (error) {
    console.error("Error fetching saved cards:", error);
  } finally {
    loadingCards.value = false;
  }
};

watch(
  () => props.userInfo,
  (newVal) => {
    if (newVal) {
      formData.value = {
        ...formData.value,
        phone: newVal.phone || "",
        firstName: newVal.firstName || "",
        lastName: newVal.lastName || "",
        address: newVal.address || "",
      };
    }
  },
  { immediate: true },
);

// Watch for payment provider changes to fetch cards when needed
watch(
  () => formData.value.paymentProvider,
  (newVal) => {
    if (
      newVal === "onepay" &&
      props.show &&
      props.mode === "user-info" &&
      savedCards.value.length === 0
    ) {
      fetchSavedCards();
    }
  },
);

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.mode === "user-info") {
      // Set payment provider from user preference or props
      formData.value.paymentProvider = props.paymentProvider || "payos";

      // Fetch cards if OnePay is selected
      if (formData.value.paymentProvider === "onepay") {
        fetchSavedCards();
      }
    }
  },
  { immediate: true },
);

const validatePhone = () => {
  const phone = formData.value.phone;
  if (!phone) {
    errors.value.phone = "Số điện thoại là bắt buộc";
  } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""))) {
    errors.value.phone = "Số điện thoại không hợp lệ (10-11 số)";
  } else {
    errors.value.phone = "";
  }
};

const isValid = computed(() => {
  if (props.mode === "user-info") {
    return formData.value.phone && !errors.value.phone;
  }
  return true;
});

const onConfirm = () => {
  if (props.mode === "user-info") {
    validatePhone();
    if (!isValid.value) return;
    emit("confirm", {
      ...formData.value,
      paymentProvider: formData.value.paymentProvider,
      useExistingCard:
        formData.value.paymentProvider === "onepay"
          ? formData.value.useExistingCard
          : false,
      selectedCardId:
        formData.value.paymentProvider === "onepay"
          ? formData.value.selectedCardId
          : null,
    });
  } else {
    emit("confirm");
  }
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.3s ease;
}

.drawer-enter-from .relative {
  transform: translateX(-100%);
}

.drawer-leave-to .relative {
  transform: translateX(-100%);
}
</style>
