<template>
  <div class="email-config-theme flex flex-col w-full bg-slate-50">
    <ToastContainer />
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :message="
        confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'
      "
      :type="confirmData.type"
      @confirm="confirm"
      @cancel="cancel"
    />

    <!-- Header -->
    <div
      class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm shrink-0"
    >
      <div class="px-4 sm:px-6 py-4">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/email-lists"
              class="sm:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <i class="bi bi-arrow-left text-lg"></i>
            </NuxtLink>
            <div
              class="w-10 h-10 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <i class="bi bi-envelope-at-fill text-white text-xl"></i>
            </div>
            <div>
              <h1
                class="text-lg sm:text-xl font-bold text-slate-900 leading-tight"
              >
                Cấu Hình Email
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 font-medium">
                Quản lý tài khoản gửi email
              </p>
            </div>
          </div>

          <button
            @click="createConfig"
            class="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <i class="bi bi-plus-lg"></i>
            <span>Thêm cấu hình</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Configurations Grid -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="n in 3"
            :key="n"
            class="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-48"
          >
            <div class="h-10 w-10 bg-slate-200 rounded-xl mb-4"></div>
            <div class="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
            <div class="h-4 w-1/2 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div
          v-else-if="configs.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <div
            v-for="cfg in configs"
            :key="cfg._id"
            class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 relative flex flex-col overflow-hidden"
            :class="{
              'ring-2 ring-emerald-500 border-transparent': cfg.isDefault,
            }"
          >
            <!-- Default Badge -->
            <div
              v-if="cfg.isDefault"
              class="absolute top-0 right-0 bg-emerald-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm"
            >
              Mặc định
            </div>

            <div class="p-6 flex-1">
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                  :class="
                    cfg.provider === 'smtp'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-red-50 text-red-600'
                  "
                >
                  <i
                    :class="
                      cfg.provider === 'smtp'
                        ? 'bi bi-hdd-network'
                        : 'bi bi-google'
                    "
                  ></i>
                </div>
                <!-- Actions Dropdown Trigger (Mobile) or Buttons (Desktop) -->
                <div class="flex gap-1">
                  <button
                    @click="editConfig(cfg)"
                    class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    @click="deleteConfig(cfg._id, cfg.name)"
                    class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <h3 class="text-lg font-bold text-slate-900 mb-1 truncate">
                {{ cfg.name }}
              </h3>
              <div
                class="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100"
              >
                <i class="bi bi-person-badge text-slate-400"></i>
                <span class="truncate font-medium">{{
                  cfg.sender?.name || "Chưa đặt tên"
                }}</span>
              </div>
              <div
                class="flex items-center gap-2 text-sm text-slate-500 mb-1 truncate"
              >
                <i class="bi bi-envelope text-slate-400"></i>
                <span class="truncate">{{ cfg.sender?.email }}</span>
              </div>
              <div
                v-if="cfg.provider === 'smtp'"
                class="flex items-center gap-2 text-xs text-slate-400 truncate"
              >
                <i class="bi bi-globe"></i>
                <span>{{ cfg.smtp?.host }}:{{ cfg.smtp?.port }}</span>
              </div>
            </div>

            <!-- Footer Actions -->
            <div
              class="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
            >
              <button
                v-if="!cfg.isDefault"
                @click="setDefault(cfg._id)"
                class="flex-1 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 text-slate-600 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Đặt mặc định
              </button>
              <div
                v-else
                class="flex-1 py-2 text-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100"
              >
                <i class="bi bi-check-circle-fill mr-1"></i>Đã chọn
              </div>

              <button
                @click="testConfig(cfg._id)"
                class="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold shadow-sm transition-all"
                title="Gửi test"
              >
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-dashed border-slate-300 text-center"
        >
          <div
            class="w-20 h-20 bg-linear-to-br from-emerald-50 via-teal-50 to-lime-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm"
          >
            <i class="bi bi-inbox text-4xl text-emerald-300"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">
            Chưa có cấu hình email
          </h3>
          <p class="text-slate-500 max-w-md mx-auto mb-8">
            Thêm cấu hình Gmail hoặc SMTP để bắt đầu gửi chiến dịch email
            marketing của bạn.
          </p>
          <button
            @click="createConfig"
            class="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-1"
          >
            Thêm Cấu Hình Ngay
          </button>
        </div>
      </div>
    </div>

    <!-- Modals (Create/Edit, Test) -->
    <!-- Config Modal -->
    <div
      style="z-index: 999999 !important"
      v-if="showModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 opacity-100 transition-opacity"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all scale-100"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white rounded-t-2xl"
        >
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ editingId ? "Chỉnh Sửa Cấu Hình" : "Thêm Cấu Hình Mới" }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Kết nối tài khoản email để gửi chiến dịch
            </p>
          </div>
          <button
            @click="showModal = false"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <i class="bi bi-x-lg text-sm"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto space-y-6">
          <!-- Step 1: Basic Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5"
                >Tên gợi nhớ</label
              >
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium"
                placeholder="VD: Marketing Gmail, Support SMTP..."
              />
            </div>

            <!-- Provider Select (Only when creating) -->
            <div v-if="!editingId" class="grid grid-cols-2 gap-4">
              <div
                @click="form.provider = 'gmail'"
                class="cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 relative overflow-hidden"
                :class="
                  form.provider === 'gmail'
                    ? 'border-red-500 bg-red-50/50 ring-1 ring-red-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                "
              >
                <div
                  class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-xl shrink-0"
                >
                  <i class="bi bi-google"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900">Gmail</div>
                  <div class="text-xs text-slate-500">App Password</div>
                </div>
                <div
                  v-if="form.provider === 'gmail'"
                  class="absolute top-2 right-2 text-red-500"
                >
                  <i class="bi bi-check-circle-fill"></i>
                </div>
              </div>

              <div
                @click="form.provider = 'smtp'"
                class="cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 relative overflow-hidden"
                :class="
                  form.provider === 'smtp'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                "
              >
                <div
                  class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xl shrink-0"
                >
                  <i class="bi bi-hdd-network"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900">SMTP</div>
                  <div class="text-xs text-slate-500">Custom Server</div>
                </div>
                <div
                  v-if="form.provider === 'smtp'"
                  class="absolute top-2 right-2 text-blue-500"
                >
                  <i class="bi bi-check-circle-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Credentials -->
          <div class="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h4
              class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2"
            >
              Thông tin xác thực
            </h4>

            <!-- Gmail Form -->
            <div v-if="form.provider === 'gmail'" class="space-y-4">
              <div
                class="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs leading-relaxed border border-yellow-200 flex gap-2"
              >
                <i class="bi bi-lightbulb-fill mt-0.5"></i>
                <div>
                  Sử dụng <strong>App Password</strong> (Mật khẩu ứng dụng) thay
                  vì mật khẩu đăng nhập Gmail.
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    class="underline font-bold hover:text-yellow-900 ml-1"
                    >Lấy tại đây</a
                  >
                </div>
              </div>

              <div class="grid gap-4">
                <div>
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >Gmail Address</label
                  >
                  <div class="relative">
                    <i
                      class="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    ></i>
                    <input
                      v-model="form.sender.email"
                      type="email"
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-sm font-medium"
                      placeholder="example@gmail.com"
                      :disabled="editingId"
                    />
                  </div>
                </div>

                <div v-if="!editingId">
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >App Password (16 ký tự)</label
                  >
                  <div class="relative">
                    <i
                      class="bi bi-key absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    ></i>
                    <input
                      v-model="form.gmail.appPassword"
                      @input="
                        form.gmail.appPassword = form.gmail.appPassword.replace(
                          /\s/g,
                          '',
                        )
                      "
                      type="password"
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-sm font-mono tracking-wider"
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- SMTP Form -->
            <div v-if="form.provider === 'smtp'" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >SMTP Host</label
                  >
                  <input
                    v-model="form.smtp.host"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    placeholder="smtp.example.com"
                    :disabled="editingId"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >Port</label
                  >
                  <select
                    v-model.number="form.smtp.port"
                    @change="onPortChange"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
                    :disabled="editingId"
                  >
                    <option :value="25">25 (Relay)</option>
                    <option :value="587">587 (TLS)</option>
                    <option :value="465">465 (SSL)</option>
                  </select>
                </div>
              </div>

              <!-- Info for Port 25 -->
              <div
                v-if="!editingId && form.smtp.port === 25"
                class="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs leading-relaxed border border-blue-200 flex gap-2"
              >
                <i class="bi bi-info-circle-fill mt-0.5"></i>
                <div>
                  Port <strong>25 (Relay)</strong> thường không yêu cầu xác
                  thực. Username và Password không cần thiết.
                </div>
              </div>

              <!-- Username/Password only for ports 587 and 465 -->
              <div
                v-if="!editingId && form.smtp.port !== 25"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >Username</label
                  >
                  <input
                    v-model="form.smtp.username"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    placeholder="user"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-semibold text-slate-700 mb-1.5"
                    >Password</label
                  >
                  <input
                    v-model="form.smtp.password"
                    type="password"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <!-- Sender Email for SMTP -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5"
                  >Email người gửi *</label
                >
                <div class="relative">
                  <i
                    class="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  ></i>
                  <input
                    v-model="form.sender.email"
                    type="email"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-medium"
                    placeholder="noreply@example.com"
                  />
                </div>
                <p class="text-xs text-slate-500 mt-1 ml-1">
                  Email này sẽ hiển thị là người gửi
                </p>
              </div>

              <div class="flex items-center gap-2 mt-2">
                <input
                  v-model="form.smtp.secure"
                  id="ssl"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  :disabled="editingId"
                />
                <label
                  for="ssl"
                  class="text-sm text-slate-600 font-medium cursor-pointer"
                  >Sử dụng kết nối an toàn (SSL/TLS)</label
                >
              </div>
            </div>
          </div>

          <!-- Step 3: Sender Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5"
                >Tên hiển thị người gửi *</label
              >
              <div class="relative">
                <i
                  class="bi bi-person absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                ></i>
                <input
                  v-model="form.sender.name"
                  type="text"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium"
                  placeholder="VD: Công ty TNHH ABC"
                />
              </div>
              <p class="text-xs text-slate-500 mt-1 ml-1">
                Tên này sẽ hiển thị trong hộp thư người nhận
              </p>
            </div>

            <div class="pt-2">
              <label
                class="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <div class="relative flex items-center">
                  <input
                    v-model="form.isDefault"
                    type="checkbox"
                    class="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </div>
                <div class="text-sm">
                  <div class="font-bold text-emerald-900">Đặt làm mặc định</div>
                  <div class="text-emerald-700 opacity-80 text-xs">
                    Sử dụng cấu hình này cho tất cả chiến dịch mới
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between shrink-0"
        >
          <button
            @click="showModal = false"
            class="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors text-sm"
          >
            Đóng
          </button>
          <button
            @click="saveConfig"
            :disabled="!isFormValid || saving"
            class="px-8 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-500/40 transform active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving" class="flex items-center gap-2"
              ><i class="bi bi-arrow-repeat animate-spin"></i> Đang lưu...</span
            >
            <span v-else>Lưu Cấu Hình</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Test Email Modal -->
    <div
      style="z-index: 999999 !important"
      v-if="showTestModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
          >
            <i class="bi bi-send-fill"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900">Gửi Email Test</h3>
        </div>
        <p class="text-sm text-slate-500 mb-4">
          Nhập địa chỉ email để kiểm tra cấu hình gửi.
        </p>

        <div class="mb-6">
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1.5"
            >Email người nhận</label
          >
          <input
            v-model="testEmail"
            type="email"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-sm"
            placeholder="name@example.com"
          />
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="showTestModal = false"
            class="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg text-sm"
          >
            Hủy
          </button>
          <button
            @click="sendTest"
            :disabled="!testEmail || testing"
            class="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all text-sm disabled:opacity-50"
          >
            {{ testing ? "Đang gửi..." : "Gửi Test" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ConfirmModal from "~/components/ConfirmModal.vue";
import { ref, computed, onMounted } from "vue";

definePageMeta({ middleware: ["auth", "permission"] });

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase ;
const { success, error: showError } = useToast();
const authStore = useAuthStore();
const {
  isVisible,
  confirmData,
  confirm,
  cancel,
  confirmDelete: showConfirmDelete,
} = useConfirm();

const configs = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editingId = ref(null);
const showTestModal = ref(false);
const testConfigId = ref(null);
const testEmail = ref("");
const testing = ref(false);
const userQuota = ref(null);

const getDefaultForm = () => ({
  name: "",
  provider: "gmail",
  sender: { name: "", email: "", replyTo: "" },
  gmail: { appPassword: "" },
  smtp: { host: "", port: 587, secure: false, username: "", password: "" },
  isDefault: false,
});

const form = ref(getDefaultForm());

const onPortChange = () => {
  if (form.value.smtp.port === 465) {
    form.value.smtp.secure = true;
  } else if (form.value.smtp.port === 587 || form.value.smtp.port === 25) {
    form.value.smtp.secure = false;
  }

  // Clear username/password when switching to port 25 (relay doesn't need auth)
  if (form.value.smtp.port === 25) {
    form.value.smtp.username = "";
    form.value.smtp.password = "";
  }
};

const isFormValid = computed(() => {
  const baseValid =
    form.value.name && form.value.sender.name && form.value.sender.email;
  if (editingId.value) return baseValid;

  if (form.value.provider === "gmail") {
    return baseValid && form.value.gmail.appPassword;
  }

  if (form.value.provider === "smtp") {
    const hostValid = form.value.smtp.host && form.value.smtp.port;
    if (form.value.smtp.port === 25) return baseValid && hostValid;
    return (
      baseValid &&
      hostValid &&
      form.value.smtp.username &&
      form.value.smtp.password
    );
  }

  return baseValid;
});

const getAuthHeaders = async () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.accessToken}`,
  };
};

const fetchConfigs = async () => {
  loading.value = true;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}/v1/email-config`, { headers });
    const data = await response.json();
    if (data.success) configs.value = data.data;
  } catch (error) {
    showError("Không thể tải cấu hình");
  } finally {
    loading.value = false;
  }
};

const fetchUserQuota = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiBaseUrl}/v1/profile/subscriptions/my-subscription`,
      { headers },
    );
    const data = await response.json();
    if (data.result) {
      userQuota.value = {
        plan: data.subscription?.plan || "basic",
        dailyEmailLimit: data.quota?.dailyEmailLimit || 50,
        emailsSentToday: data.usage?.emailsSentToday || 0,
      };
    }
  } catch (error) {
    console.error("Failed to load user quota:", error);
  }
};

const createConfig = () => {
  editingId.value = null;
  form.value = getDefaultForm();
  showModal.value = true;
};

const editConfig = (cfg) => {
  editingId.value = cfg._id;
  form.value = {
    name: cfg.name,
    provider: cfg.provider || "gmail",
    sender: { ...cfg.sender },
    gmail: { appPassword: cfg.gmail?.appPassword || "" },
    smtp: cfg.smtp
      ? { ...cfg.smtp, password: "" }
      : { host: "", port: 587, secure: false, username: "", password: "" },
    isDefault: cfg.isDefault,
  };
  showModal.value = true;
};

const saveConfig = async () => {
  saving.value = true;
  try {
    const headers = await getAuthHeaders();
    const url = editingId.value
      ? `${apiBaseUrl}/v1/email-config/${editingId.value}`
      : `${apiBaseUrl}/v1/email-config`;

    let payload = {
      name: form.value.name,
      provider: form.value.provider,
      sender: form.value.sender,
      isDefault: form.value.isDefault,
    };

    if (!editingId.value) {
      if (form.value.provider === "gmail") {
        payload.gmail = { appPassword: form.value.gmail.appPassword };
      } else if (form.value.provider === "smtp") {
        payload.smtp = {
          host: form.value.smtp.host,
          port: form.value.smtp.port,
          secure: form.value.smtp.secure,
          username: form.value.smtp.username,
          password: form.value.smtp.password,
        };
      }
    }

    const response = await fetch(url, {
      method: editingId.value ? "PUT" : "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      success(
        editingId.value ? "Cập nhật thành công!" : "Tạo cấu hình thành công!",
      );
      showModal.value = false;
      fetchConfigs();
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError("Lưu cấu hình thất bại");
  } finally {
    saving.value = false;
  }
};

const deleteConfig = async (id, name) => {
  const confirmed = await showConfirmDelete(`cấu hình "${name}"`);
  if (!confirmed) return;

  try {
    const headers = await getAuthHeaders();
    await fetch(`${apiBaseUrl}/v1/email-config/${id}`, {
      method: "DELETE",
      headers,
    });
    success("Đã xóa cấu hình!");
    fetchConfigs();
  } catch (error) {
    showError("Xóa thất bại");
  }
};

const setDefault = async (id) => {
  try {
    const headers = await getAuthHeaders();
    await fetch(`${apiBaseUrl}/v1/email-config/${id}/set-default`, {
      method: "POST",
      headers,
    });
    success("Đã đặt mặc định!");
    fetchConfigs();
  } catch (error) {
    showError("Thất bại");
  }
};

const testConfig = (id) => {
  testConfigId.value = id;
  testEmail.value = "";
  showTestModal.value = true;
};

const sendTest = async () => {
  if (!testEmail.value) return;
  testing.value = true;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiBaseUrl}/v1/email-config/${testConfigId.value}/test`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ testEmail: testEmail.value }),
      },
    );

    const data = await response.json();
    if (data.success) {
      success("Đã gửi email test!");
      showTestModal.value = false;
      fetchConfigs();
    } else {
      showError(data.message || "Gửi thất bại");
    }
  } catch (error) {
    showError("Gửi thất bại");
  } finally {
    testing.value = false;
  }
};

onMounted(() => {
  fetchConfigs();
  fetchUserQuota();
});
</script>

<style scoped>
.email-config-theme :deep(.bg-slate-50) { background-color: #ecfdf5 !important; }
.email-config-theme :deep(.bg-slate-100) { background-color: #d1fae5 !important; }
.email-config-theme :deep(.bg-slate-200) { background-color: #a7f3d0 !important; }
.email-config-theme :deep(.bg-slate-900\/40) { background-color: rgba(6, 78, 59, 0.38) !important; }
.email-config-theme :deep(.bg-slate-50\/50) { background-color: rgba(236, 253, 245, 0.7) !important; }

.email-config-theme :deep(.text-slate-900) { color: #064e3b !important; }
.email-config-theme :deep(.text-slate-700) { color: #047857 !important; }
.email-config-theme :deep(.text-slate-600) { color: #0f766e !important; }
.email-config-theme :deep(.text-slate-500) { color: #0d9488 !important; }
.email-config-theme :deep(.text-slate-400) { color: #14b8a6 !important; }

.email-config-theme :deep(.border-slate-300) { border-color: #86efac !important; }
.email-config-theme :deep(.border-slate-200) { border-color: #a7f3d0 !important; }
.email-config-theme :deep(.border-slate-100) { border-color: #d1fae5 !important; }

.email-config-theme :deep(.from-emerald-400) { --tw-gradient-from: #34d399 var(--tw-gradient-from-position) !important; }
.email-config-theme :deep(.to-lime-500) { --tw-gradient-to: #84cc16 var(--tw-gradient-to-position) !important; }
.email-config-theme :deep(.from-emerald-50) { --tw-gradient-from: #ecfdf5 var(--tw-gradient-from-position) !important; }
.email-config-theme :deep(.to-lime-50) { --tw-gradient-to: #f7fee7 var(--tw-gradient-to-position) !important; }

.email-config-theme :deep(.bg-emerald-500),
.email-config-theme :deep(.bg-blue-600) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.email-config-theme :deep(.bg-emerald-50),
.email-config-theme :deep(.bg-blue-50) { background-color: #ecfdf5 !important; }
.email-config-theme :deep(.bg-emerald-100),
.email-config-theme :deep(.bg-blue-100) { background-color: #d1fae5 !important; }

.email-config-theme :deep(.text-emerald-900),
.email-config-theme :deep(.text-blue-800) { color: #064e3b !important; }
.email-config-theme :deep(.text-emerald-700),
.email-config-theme :deep(.text-blue-700) { color: #047857 !important; }
.email-config-theme :deep(.text-emerald-600),
.email-config-theme :deep(.text-blue-600) { color: #059669 !important; }
.email-config-theme :deep(.text-emerald-300),
.email-config-theme :deep(.text-blue-500) { color: #14b8a6 !important; }

.email-config-theme :deep(.border-emerald-100),
.email-config-theme :deep(.border-blue-200) { border-color: #a7f3d0 !important; }
.email-config-theme :deep(.border-emerald-200),
.email-config-theme :deep(.border-blue-500) { border-color: #34d399 !important; }

.email-config-theme :deep(.focus\:border-emerald-500:focus),
.email-config-theme :deep(.focus\:border-blue-500:focus) { border-color: #10b981 !important; }
.email-config-theme :deep(.focus\:ring-emerald-200:focus),
.email-config-theme :deep(.focus\:ring-blue-200:focus),
.email-config-theme :deep(.focus\:ring-blue-500:focus) { --tw-ring-color: rgba(52, 211, 153, 0.35) !important; }

.email-config-theme :deep([class*="hover:bg-slate-100"]:hover) { background-color: #d1fae5 !important; }
.email-config-theme :deep([class*="hover:bg-slate-200"]:hover) { background-color: #a7f3d0 !important; }
.email-config-theme :deep([class*="hover:bg-emerald-600"]:hover),
.email-config-theme :deep([class*="hover:bg-blue-700"]:hover) {
  background-image: linear-gradient(to right, #10b981, #14b8a6, #84cc16) !important;
}
.email-config-theme :deep([class*="hover:text-emerald-600"]:hover),
.email-config-theme :deep([class*="hover:text-slate-800"]:hover) { color: #065f46 !important; }
.email-config-theme :deep([class*="hover:border-emerald-300"]:hover),
.email-config-theme :deep([class*="hover:border-slate-300"]:hover) { border-color: #34d399 !important; }
</style>
