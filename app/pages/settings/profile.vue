<template>
  <div class="profile-theme flex flex-col w-full h-full bg-slate-50 relative">
    <ToastContainer />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div
        class="flex flex-col h-full bg-white border-r border-slate-200 w-full lg:w-72 shrink-0 transition-transform duration-300"
        :class="
          isMobile && showTabContent
            ? '-translate-x-full absolute'
            : 'translate-x-0 relative'
        "
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <i class="bi bi-person-gear text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 leading-tight">Cài Đặt</h1>
            <p class="text-xs text-slate-500">Tài khoản</p>
          </div>
        </div>

        <!-- Nav -->
        <div class="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="navigateTab(tab.id)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border border-transparent group"
            :class="
              activeTab === tab.id && !isMobile
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'
            "
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              :class="
                activeTab === tab.id && !isMobile
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm'
              "
            >
              <i :class="tab.icon"></i>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm">{{ tab.label }}</div>
              <div v-if="isMobile" class="text-xs opacity-70 font-normal">{{ tab.desc }}</div>
            </div>
            <i v-if="isMobile" class="bi bi-chevron-right text-xs opacity-50"></i>
          </button>
        </div>

        <!-- User Info Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-3">
            <img
              :src="profile.avatar_url || 'https://via.placeholder.com/40'"
              class="w-9 h-9 rounded-full bg-slate-200 object-cover border border-white shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-slate-900 truncate">
                {{ profile.full_name || "User" }}
              </div>
              <div class="text-xs text-slate-500 truncate">{{ profile.email }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="flex-1 flex flex-col h-full bg-slate-50 transition-transform duration-300 absolute lg:relative w-full lg:w-auto"
        :class="
          isMobile
            ? showTabContent
              ? 'translate-x-0 inset-0 z-20'
              : 'translate-x-full inset-0 z-20'
            : 'translate-x-0'
        "
      >
        <!-- Mobile Header -->
        <div
          v-if="isMobile"
          class="bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between shadow-sm sticky top-0 z-30"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <button
              @click="closeMobileTab"
              class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 -ml-2 text-slate-600"
            >
              <i class="bi bi-arrow-left text-lg"></i>
            </button>
            <h2 class="font-bold text-slate-900 truncate">{{ currentTabLabel }}</h2>
          </div>
          <button
            v-if="activeTab === 'profile'"
            @click="updateProfile"
            :disabled="savingProfile || !hasProfileChanges"
            class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {{ savingProfile ? "Đang lưu..." : "Lưu" }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto overscroll-contain bg-slate-50 pb-4">
          <div v-if="activeTab === 'profile'" class="px-4 sm:px-6 pt-4 pb-1 flex justify-end">
            <div class="flex items-center gap-2">
              <button
                @click="openSignatureModal"
                class="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <i class="bi bi-pen"></i>
                Quản lý chữ ký
              </button>
              <button
                v-if="signatureStatus?.has_signature"
                @click="deleteSignature"
                :disabled="deletingSignature"
                class="px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                <i :class="deletingSignature ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-trash3'"></i>
                Xoá chữ ký
              </button>
            </div>
          </div>
          <ProfileTabProfile
            v-if="activeTab === 'profile'"
            :profile="profile"
            :saving-profile="savingProfile"
            :has-changes="hasProfileChanges"
            @update-profile="updateProfile"
            @avatar-upload="handleAvatarUpload"
            @change-password="handleChangePassword"
          />
          <ProfileTabSubscription
            v-else-if="activeTab === 'subscription'"
            :profile="profile"
            :email-packages="dummyPackages"
            :current-plan-name="currentPlanName"
            :is-expiring-soon="false"
            :enable-method-payment="true"
          />
          <ProfileTabCards
            v-else-if="activeTab === 'cards'"
            :saved-cards="dummyCards"
            @set-default="handleSetDefaultCard"
            @delete-card="handleDeleteCard"
            @add-card="showAddCardModal = true"
          />
          <ProfileTabBilling
            v-else-if="activeTab === 'billing'"
            :billing-history="dummyBilling"
            @export-pdf="handleExportInvoice"
            @check-status="handleCheckBillingStatus"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showSignatureModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showSignatureModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-gray-900">Thiết lập chữ ký SignHub</p>
              <p class="text-xs text-gray-500">Bạn cần có chữ ký trước khi phê duyệt offboarding.</p>
            </div>
            <button class="w-8 h-8 rounded-lg hover:bg-gray-100" @click="showSignatureModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div class="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
              <button
                @click="signatureTab = 'draw'"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                :class="signatureTab === 'draw' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'"
              >
                Tự ký
              </button>
              <button
                @click="signatureTab = 'upload'"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                :class="signatureTab === 'upload' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'"
              >
                Upload ảnh
              </button>
            </div>

            <div v-if="signatureTab === 'draw'" class="space-y-2">
              <canvas
                ref="signatureCanvas"
                width="700"
                height="220"
                class="w-full h-44 border border-gray-200 rounded-xl bg-white touch-none"
                @pointerdown="startDraw"
                @pointermove="drawMove"
                @pointerup="endDraw"
                @pointerleave="endDraw"
              />
              <div class="flex justify-end">
                <button
                  @click="clearSignatureCanvas"
                  class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Xóa nét ký
                </button>
              </div>
            </div>

            <div v-else class="space-y-2">
              <input
                ref="signatureFileInput"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                class="hidden"
                @change="onSignatureFileChange"
              />
              <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                <div class="min-w-0">
                  <p class="text-[11px] font-semibold text-gray-500 mb-0.5">Tệp chữ ký (PNG/JPG/JPEG, tối đa 20MB)</p>
                  <p class="text-xs text-gray-700 truncate">{{ signatureFileName }}</p>
                </div>
                <button
                  type="button"
                  class="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  @click="openSignatureFileDialog"
                >
                  Chọn tệp
                </button>
              </div>
              <div class="flex justify-end">
                <button
                  :disabled="!signatureFile || scanningSignature"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                  @click="scanSignaturePreview"
                >
                  <i v-if="scanningSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
                  Quét chữ ký preview
                </button>
              </div>
              <div v-if="signatureFilePreview" class="border border-gray-200 rounded-xl p-2 bg-gray-50">
                <p class="text-[11px] font-semibold text-gray-500 mb-1">Ảnh gốc</p>
                <img :src="signatureFilePreview" alt="signature-preview" class="max-h-28 object-contain mx-auto" />
              </div>
              <div v-if="scannedSignaturePreview" class="border border-emerald-200 rounded-xl p-2 bg-emerald-50/40">
                <p class="text-[11px] font-semibold text-emerald-700 mb-1">Ảnh chữ ký đã quét (màu xanh lá)</p>
                <img :src="scannedSignaturePreview" alt="signature-scanned-preview" class="max-h-28 object-contain mx-auto" />
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              @click="showSignatureModal = false"
            >
              Hủy
            </button>
            <button
              :disabled="savingSignature"
              class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
              @click="saveSignature"
            >
              <i v-if="savingSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
              Lưu chữ ký
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showDeleteSignatureModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showDeleteSignatureModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <p class="text-sm font-bold text-gray-900">Xoá chữ ký cá nhân</p>
            </div>
            <button class="w-8 h-8 rounded-lg hover:bg-gray-100" @click="showDeleteSignatureModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="px-5 py-4">
            <p class="text-sm text-gray-600">
              Bạn có chắc chắn muốn xoá chữ ký hiện tại? Sau khi xoá, bạn cần tạo chữ ký mới để tiếp tục phê duyệt offboarding.
            </p>
          </div>
          <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              @click="showDeleteSignatureModal = false"
            >
              Hủy
            </button>
            <button
              :disabled="deletingSignature"
              class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-60"
              @click="confirmDeleteSignature"
            >
              <i v-if="deletingSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
              Xoá chữ ký
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth" });

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || "http://localhost:8000/api";
const apiV1 = `${apiBaseUrl}/v1`;
const { success, error: showError } = useToast();
const authStore = useAuthStore();
const { $_ } = useNuxtApp();

const profile = ref({
  id: null,
  portal_user_id: "",
  email: "",
  name: "",
  full_name: "",
  display_name: "",
  avatar_url: "",
  phone: "",
  department: "",
  dept_code: "",
  title: "",
  joined_at: "",
  joining_date: "",
  site: "",
  site_id: "",
  e_code: "",
  role: "",
  is_tenant_admin: false,
  tenant_id: "",
  tenant_name: "",
  tenant_domain: "",
});

const originalProfile = ref({});
const savingProfile = ref(false);
const activeTab = ref("profile");
const showTabContent = ref(false);
const isMobile = ref(false);

const tabs = [
  { id: "profile", label: "Thông tin cá nhân", icon: "bi bi-person-circle", desc: "Avatar, Tên, Liên hệ" },
  { id: "subscription", label: "Gói Dịch Vụ", icon: "bi bi-star", desc: "Quản lý gói và mức sử dụng" },
  { id: "cards", label: "Thẻ Thanh Toán", icon: "bi bi-credit-card", desc: "Thẻ Visa, Mastercard, ..." },
  { id: "billing", label: "Lịch Sử Thanh Toán", icon: "bi bi-clock-history", desc: "Hóa đơn và thanh toán" },
];

const currentTabLabel = computed(() => {
  return tabs.find(t => t.id === activeTab.value)?.label || "Cài đặt";
});

// Dummy Data
const dummyPackages = ref([
  {
    _id: "pkg_free",
    name: "Gói Miễn Phí",
    slug: "email-free",
    features: ["500 emails/ngày", "50 ảnh lưu trữ", "Support cơ bản"],
    variants: [{ isActive: true, price: 0 }]
  },
  {
    _id: "pkg_pro",
    name: "Gói Pro",
    slug: "email-pro",
    isPopular: true,
    features: ["50,000 emails/ngày", "Unlimited ảnh", "Support 24/7", "Custom Domain"],
    variants: [{ isActive: true, price: 500000 }]
  }
]);

const currentPlanName = computed(() => {
  return profile.value.subscription?.planName || "Gói Miễn Phí";
});

const dummyCards = ref([
  { _id: "1", cardNumber: "4242424242421234", cardType: "visa", isDefault: true, vpc_TokenExp: "2512" },
  { _id: "2", cardNumber: "5412751234125678", cardType: "mastercard", isDefault: false, vpc_TokenExp: "2601" }
]);

const dummyBilling = ref([
  { _id: "1", packageSlug: "Pro", type: "email", amount: 500000, status: "active", createdAt: new Date().toISOString(), merchTxnRef: "TXN789456", paymentProvider: "onepay" },
  { _id: "2", packageSlug: "Free", type: "email", amount: 0, status: "active", createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), merchTxnRef: "TXN123456", paymentProvider: "payos" }
]);

const showAddCardModal = ref(false);
const showSignatureModal = ref(false);
const showDeleteSignatureModal = ref(false);
const signatureTab = ref("draw");
const signatureCanvas = ref(null);
const signatureFileInput = ref(null);
const isDrawing = ref(false);
const hasSignatureStroke = ref(false);
const savingSignature = ref(false);
const deletingSignature = ref(false);
const scanningSignature = ref(false);
const signatureFile = ref(null);
const signatureFilePreview = ref("");
const scannedSignaturePreview = ref("");
const signatureStatus = ref({ has_signature: false, signature_type: null, signature_image_url: null, signature_data: null });
const signatureFileName = computed(() => signatureFile.value?.name || "Chưa chọn tệp");

const handleSetDefaultCard = (cardId) => {
  dummyCards.value.forEach(card => {
    card.isDefault = card._id === cardId;
  });
  success("Đã đặt làm thẻ mặc định");
};

const handleDeleteCard = (cardId) => {
  if (confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
    dummyCards.value = dummyCards.value.filter(c => c._id !== cardId);
    success("Đã xóa thẻ");
  }
};

const handleExportInvoice = (transaction) => {
  success(`Đang tạo hóa đơn PDF cho ${transaction.merchTxnRef}...`);
  setTimeout(() => {
    success("Hóa đơn đã được tải xuống");
  }, 1500);
};

const handleCheckBillingStatus = (transaction) => {
  success(`Đang kiểm tra trạng thái giao dịch ${transaction.merchTxnRef}...`);
};

const handleChangePassword = () => {
  success("Đã gửi link đặt lại mật khẩu vào email của bạn");
};

const hasProfileChanges = computed(() => {
  if (!originalProfile.value || Object.keys(originalProfile.value).length === 0) return false;
  const editableFields = ["full_name", "display_name", "phone", "avatar_url"];
  return editableFields.some(
    (field) => !$_.isEqual(profile.value[field], originalProfile.value[field]),
  );
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

const navigateTab = (tab) => {
  activeTab.value = tab;
  if (isMobile.value) showTabContent.value = true;
};

const closeMobileTab = () => {
  showTabContent.value = false;
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${authStore.accessToken}`,
});

const normalizeDateOnly = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

const fetchProfile = async () => {
  try {
    const response = await fetch(`${apiV1}/users/me`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    // GET /users/me trả về plain user object (không bọc success/data)
    const user = data?.data || data;
    if (user?.email) {
      Object.assign(profile.value, {
        id: user.id ?? null,
        portal_user_id: user.portal_user_id || "",
        email: user.email || "",
        name: user.name || "",
        full_name: user.full_name || user.name || "",
        display_name: user.display_name || user.full_name || user.name || "",
        avatar_url: user.avatar_url || "",
        phone: user.phone || "",
        department: user.department || user.dept_code || "",
        dept_code: user.dept_code || user.department || "",
        title: user.title || "",
        joined_at: normalizeDateOnly(user.joined_at || user.joining_date),
        joining_date: normalizeDateOnly(user.joining_date || user.joined_at),
        site: user.site || "",
        site_id: user.site_id || "",
        e_code: user.e_code || user.hr_code || "",
        role: user.role || "",
        is_tenant_admin: !!(user.is_tenant_admin ?? user.admin_meeting_room),
        tenant_id: user.tenant_id || "",
        tenant_name: user.tenant_name || "",
        tenant_domain: user.tenant_domain || "",
      });
      originalProfile.value = $_.cloneDeep(profile.value);
    }
  } catch (e) {
    console.error("fetchProfile error:", e);
    showError("Không thể tải thông tin");
  }
};

const updateProfile = async () => {
  if (!profile.value.id) return;
  savingProfile.value = true;
  const payload = {
    full_name: profile.value.full_name,
    display_name: profile.value.display_name,
    phone: profile.value.phone,
    avatar_url: profile.value.avatar_url,
  };
  try {
    const response = await fetch(`${apiV1}/users/${profile.value.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    const updated = data?.data || data;
    if (updated?.email || response.ok) {
      if (updated?.full_name) {
        Object.assign(profile.value, {
          full_name: updated.full_name || profile.value.full_name,
          display_name: updated.display_name || profile.value.display_name,
          phone: updated.phone || profile.value.phone,
          avatar_url: updated.avatar_url || profile.value.avatar_url,
        });
      }
      originalProfile.value = $_.cloneDeep(profile.value);
      success("Đã cập nhật thông tin");
    } else {
      showError(data.detail || data.message || "Không thể cập nhật");
    }
  } catch (e) {
    showError("Không thể cập nhật thông tin");
  } finally {
    savingProfile.value = false;
  }
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showError("Ảnh không được lớn hơn 5MB");
    return;
  }
  try {
    const headers = { Authorization: `Bearer ${authStore.accessToken}` };
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${apiV1}/profile/upload-avatar`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await response.json();
    if (data.success && data.data?.url) {
      profile.value.avatar_url = data.data.url;
      success("Đã tải ảnh đại diện");
    } else {
      showError("Không thể tải ảnh");
    }
  } catch (e) {
    showError("Không thể tải ảnh đại diện");
  }
};

const loadSignatureStatus = async () => {
  try {
    const response = await fetch(`${apiV1}/profile/signature`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });
    const data = await response.json();
    signatureStatus.value = data?.data || { has_signature: false };
  } catch (_) {
    signatureStatus.value = { has_signature: false, signature_type: null, signature_image_url: null, signature_data: null };
  }
};

const initSignatureCanvas = () => {
  nextTick(() => {
    const c = signatureCanvas.value;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#193CB9";
  });
};

const pointerPos = (evt) => {
  const c = signatureCanvas.value;
  const rect = c.getBoundingClientRect();
  const scaleX = c.width / rect.width;
  const scaleY = c.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
};

const startDraw = (evt) => {
  if (signatureTab.value !== "draw") return;
  const c = signatureCanvas.value;
  if (!c) return;
  const ctx = c.getContext("2d");
  const p = pointerPos(evt);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  isDrawing.value = true;
  hasSignatureStroke.value = true;
};

const drawMove = (evt) => {
  if (!isDrawing.value || signatureTab.value !== "draw") return;
  const c = signatureCanvas.value;
  if (!c) return;
  const ctx = c.getContext("2d");
  const p = pointerPos(evt);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
};

const endDraw = () => {
  isDrawing.value = false;
};

const clearSignatureCanvas = () => {
  const c = signatureCanvas.value;
  if (!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  hasSignatureStroke.value = false;
};

const onSignatureFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) {
    signatureFile.value = null
    signatureFilePreview.value = ""
    scannedSignaturePreview.value = ""
    return
  }
  const validTypes = ["image/png", "image/jpeg"]
  const validExts = [".png", ".jpg", ".jpeg"]
  const lowerName = (file.name || "").toLowerCase()
  const hasValidExt = validExts.some(ext => lowerName.endsWith(ext))
  const hasValidType = validTypes.includes(file.type)
  if (!hasValidExt || !hasValidType) {
    showError("Chỉ hỗ trợ 3 định dạng: PNG, JPG, JPEG.")
    signatureFile.value = null
    signatureFilePreview.value = ""
    scannedSignaturePreview.value = ""
    if (event.target) event.target.value = ""
    return
  }
  if (file.size > 20 * 1024 * 1024) {
    showError("Dung lượng ảnh không được vượt quá 20MB.")
    signatureFile.value = null
    signatureFilePreview.value = ""
    scannedSignaturePreview.value = ""
    if (event.target) event.target.value = ""
    return
  }
  signatureFile.value = file
  scannedSignaturePreview.value = ""
  signatureFilePreview.value = URL.createObjectURL(file)
};

const openSignatureFileDialog = () => {
  signatureFileInput.value?.click()
}

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Không thể đọc file ảnh"))
    reader.readAsDataURL(file)
  })

const scanSignaturePreview = async () => {
  if (!signatureFile.value) {
    showError("Vui lòng chọn ảnh chữ ký.")
    return
  }
  scanningSignature.value = true
  try {
    const imageData = await fileToDataUrl(signatureFile.value)
    const response = await fetch(`${apiV1}/profile/scan-signature`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ image_data: imageData }),
    })
    const scanRes = await response.json()
    scannedSignaturePreview.value = scanRes?.data?.preview_data_url || ""
    if (!scannedSignaturePreview.value) {
      showError("Không thể tạo preview chữ ký.")
      return
    }
    success("Đã quét ảnh chữ ký, vui lòng kiểm tra preview.")
  } catch (e) {
    showError("Quét chữ ký thất bại")
  } finally {
    scanningSignature.value = false
  }
}

const openSignatureModal = () => {
  showSignatureModal.value = true
  signatureTab.value = "draw"
  signatureFile.value = null
  signatureFilePreview.value = signatureStatus.value?.signature_image_url || signatureStatus.value?.signature_data || ""
  scannedSignaturePreview.value = ""
  clearSignatureCanvas()
  initSignatureCanvas()
}

const saveSignature = async () => {
  savingSignature.value = true;
  try {
    if (signatureTab.value === "draw") {
      if (!hasSignatureStroke.value) {
        showError("Vui lòng ký trước khi lưu.");
        return;
      }
      const dataUrl = signatureCanvas.value.toDataURL("image/png");
      await fetch(`${apiV1}/profile/signature`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ signature_type: "drawn", signature_data: dataUrl }),
      });
    } else {
      if (!signatureFile.value) {
        showError("Vui lòng chọn ảnh chữ ký.");
        return;
      }
      const imageData = await fileToDataUrl(signatureFile.value)
      const up = await fetch(`${apiV1}/profile/upload-signature`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ image_data: imageData }),
      }).then((r) => r.json());
      scannedSignaturePreview.value = up?.data?.preview_data_url || scannedSignaturePreview.value
      await fetch(`${apiV1}/profile/signature`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ signature_type: "uploaded", signature_data: up?.data?.url }),
      });
    }
    await loadSignatureStatus();
    success("Đã lưu chữ ký SignHub.");
    showSignatureModal.value = false;
  } catch (e) {
    showError("Không thể lưu chữ ký");
  } finally {
    savingSignature.value = false;
  }
};

const deleteSignature = async () => {
  if (!signatureStatus.value?.has_signature) return
  showDeleteSignatureModal.value = true
}

const confirmDeleteSignature = async () => {
  deletingSignature.value = true
  try {
    await fetch(`${apiV1}/profile/signature`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    })
    signatureStatus.value = { has_signature: false, signature_type: null, signature_image_url: null, signature_data: null }
    signatureFile.value = null
    signatureFilePreview.value = ""
    scannedSignaturePreview.value = ""
    showDeleteSignatureModal.value = false
    success("Đã xoá chữ ký SignHub.")
  } catch (e) {
    showError("Không thể xoá chữ ký")
  } finally {
    deletingSignature.value = false
  }
}

onMounted(async () => {
  checkMobile();
  window.addEventListener("resize", checkMobile);

  // Handle URL hash
  const hash = window.location.hash.replace("#", "");
  if (hash && tabs.some((t) => t.id === hash)) {
    activeTab.value = hash;
  }

  await fetchProfile();
  await loadSignatureStatus();
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const route = useRoute();
watch(
  () => route.hash,
  (newHash) => {
    const hash = newHash.replace("#", "");
    if (hash && tabs.some((t) => t.id === hash)) {
      activeTab.value = hash;
    }
  },
);
</script>

<style scoped>
.translate-x-full { transform: translateX(100%); }
.translate-x-0 { transform: translateX(0); }
.-translate-x-full { transform: translateX(-100%); }

.profile-theme :deep(.bg-slate-50) { background-color: #ecfdf5 !important; }
.profile-theme :deep(.bg-slate-100) { background-color: #d1fae5 !important; }
.profile-theme :deep(.bg-slate-200) { background-color: #a7f3d0 !important; }
.profile-theme :deep(.bg-slate-50\/50) { background-color: rgba(236, 253, 245, 0.7) !important; }
.profile-theme :deep(.bg-slate-900) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.profile-theme :deep(.text-slate-900) { color: #064e3b !important; }
.profile-theme :deep(.text-slate-600) { color: #0f766e !important; }
.profile-theme :deep(.text-slate-500) { color: #0d9488 !important; }

.profile-theme :deep(.border-slate-200) { border-color: #a7f3d0 !important; }
.profile-theme :deep(.border-slate-100) { border-color: #d1fae5 !important; }

.profile-theme :deep(.from-emerald-400) { --tw-gradient-from: #34d399 var(--tw-gradient-from-position) !important; }
.profile-theme :deep(.to-lime-500) { --tw-gradient-to: #84cc16 var(--tw-gradient-to-position) !important; }

.profile-theme :deep(.bg-emerald-500) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.profile-theme :deep([class*="hover:bg-slate-50"]:hover) { background-color: #f0fdfa !important; }
.profile-theme :deep([class*="hover:bg-slate-100"]:hover) { background-color: #d1fae5 !important; }
.profile-theme :deep([class*="hover:border-slate-200"]:hover) { border-color: #6ee7b7 !important; }
.profile-theme :deep([class*="hover:text-emerald-600"]:hover) { color: #059669 !important; }
</style>
