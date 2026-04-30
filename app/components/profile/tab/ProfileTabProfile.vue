<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
    <form @submit.prevent="$emit('update-profile')">
      <!-- Avatar + Header -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        <div class="relative group shrink-0">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 ring-1 ring-slate-200">
            <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-linear-to-br from-emerald-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {{ getInitials(profile.full_name, profile.email) }}
            </div>
          </div>
          <label class="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-all shadow-md active:scale-95">
            <i class="bi bi-camera-fill text-sm"></i>
            <input type="file" accept="image/jpeg,image/png,image/gif" class="hidden" @change="$emit('avatar-upload', $event)" />
          </label>
        </div>

        <div class="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">{{ profile.full_name || profile.email || 'Người dùng' }}</h2>
            <p class="text-slate-500 text-sm">{{ profile.email }}</p>
          </div>
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span v-if="profile.e_code || profile.hr_code" class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
              E-Code: {{ profile.e_code || profile.hr_code }}
            </span>
            <span v-if="profile.dept_code || profile.department" class="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
              {{ profile.department || profile.dept_code }}
            </span>
            <span v-if="profile.title" class="px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs border border-slate-200">
              {{ profile.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 class="font-bold text-slate-900">Thông tin cá nhân</h3>
        </div>
        <div class="p-6 sm:p-8 space-y-6">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700">Họ và tên</label>
            <input
              v-model="profile.full_name"
              type="text"
              placeholder="Nguyễn Văn A"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm text-slate-900"
            />
          </div>

          <!-- Display Name -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700">Tên hiển thị</label>
            <input
              v-model="profile.display_name"
              type="text"
              placeholder="Tên hiển thị trong hệ thống"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm text-slate-900"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Phone -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Số điện thoại</label>
              <input
                v-model="profile.phone"
                type="tel"
                placeholder="0912 345 678"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm text-slate-900 font-mono"
              />
            </div>
            <!-- Email (readonly) -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Email</label>
              <input
                :value="profile.email"
                readonly
                disabled
                type="email"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm font-mono"
              />
            </div>
          </div>

          <!-- Read-only info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Username</label>
              <input
                :value="profile.name || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Mã nhân sự (e_code)</label>
              <input
                :value="profile.e_code || profile.hr_code || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Mã phòng ban</label>
              <input
                :value="profile.dept_code || profile.department"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Phòng ban</label>
              <input
                :value="profile.department || profile.dept_code || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Chức danh</label>
              <input
                :value="profile.title"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Ngày vào làm</label>
              <input
                :value="formatDateOnly(profile.joined_at || profile.joining_date)"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Văn phòng / Site</label>
              <input
                :value="profile.site || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Site ID</label>
              <input
                :value="profile.site_id || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
          </div>

          <!-- <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Role</label>
              <input
                :value="profile.role || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">is_tenant_admin</label>
              <input
                :value="profile.is_tenant_admin ? 'Yes' : 'No'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm"
              />
            </div>
          </div> -->
        </div>
      </div>

      <!-- Tenant Info -->
      <!-- <div v-if="profile.tenant_id" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <i class="bi bi-building text-slate-400"></i>
          <h3 class="font-bold text-slate-900">Tổ chức</h3>
          <span class="ml-auto px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded uppercase tracking-wider">Chỉ đọc</span>
        </div>
        <div class="p-6 sm:p-8 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Tên tổ chức</label>
              <input
                :value="profile.tenant_name || '—'"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm font-medium"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-slate-700">Tenant ID</label>
              <input
                :value="profile.tenant_id"
                readonly
                disabled
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm font-mono"
              />
            </div>
          </div>
          <div v-if="profile.tenant_domain" class="space-y-1.5">
            <label class="text-sm font-semibold text-slate-700">Domain</label>
            <input
              :value="profile.tenant_domain"
              readonly
              disabled
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm font-mono"
            />
          </div>
        </div>
      </div> -->

      <!-- Security Section -->
      <!-- <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 class="font-bold text-slate-900">Bảo mật tài khoản</h3>
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">An toàn</span>
        </div>
        <div class="p-6 sm:p-8 space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 group hover:border-emerald-200 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                <i class="bi bi-shield-lock text-lg"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">Mật khẩu</h4>
                <p class="text-xs text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản</p>
              </div>
            </div>
            <button
              type="button"
              @click="$emit('change-password')"
              class="px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Thay đổi
            </button>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 group hover:border-emerald-200 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                <i class="bi bi-phone-vibrate text-lg"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">Xác thực 2 lớp (2FA)</h4>
                <p class="text-xs text-slate-500">Tăng cường bảo mật bằng mã xác thực</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Desktop Save Button -->
      <div class="hidden lg:flex justify-end pt-6">
        <button
          type="submit"
          :disabled="savingProfile || !hasChanges"
          class="px-8 py-3 bg-emerald-500 hover:scale-105 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
        >
          <span v-if="savingProfile" class="loading loading-spinner loading-sm"></span>
          {{ savingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  profile: Object,
  savingProfile: Boolean,
  hasChanges: Boolean,
});

defineEmits(['update-profile', 'avatar-upload']);

const getInitials = (fullName, email) => {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : fullName.substring(0, 2).toUpperCase();
  }
  return email ? email.substring(0, 2).toUpperCase() : '?';
};

const formatDateOnly = (value) => {
  if (!value) return '—';
  const raw = String(value).trim();
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : raw;
};
</script>
