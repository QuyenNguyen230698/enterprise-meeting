<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Usage Card -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden group"
      >
        <!-- Background Decoration -->
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>

        <div class="flex items-center justify-between mb-6 relative z-10">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-sm shadow-emerald-100">
              <i class="bi bi-pie-chart-fill"></i>
            </div>
            <h3 class="font-bold text-slate-900">Mức sử dụng tài khoản</h3>
          </div>
          <span
            class="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-500/10 border border-emerald-400/20"
          >
            {{ currentPlanName }}
          </span>
        </div>

        <div class="space-y-8 flex-1 relative z-10">
          <!-- Meeting Quota -->
          <div class="group/item">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <i class="bi bi-calendar2-week text-emerald-500"></i>
                <span class="text-sm font-bold text-slate-700">Lịch họp trong tháng</span>
              </div>
              <span
                class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
              >
                12 / 50
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
              <div
                class="bg-linear-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style="width: 24%"
              ></div>
            </div>
            <p class="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <i class="bi bi-info-circle"></i> Giới hạn 50 cuộc họp/tháng cho gói hiện tại
            </p>
          </div>

          <!-- Participant Quota -->
          <div class="group/item">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <i class="bi bi-people text-teal-500"></i>
                <span class="text-sm font-bold text-slate-700">Người tham gia tối đa</span>
              </div>
              <span
                class="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100"
              >
                100 / 100
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
              <div
                class="bg-linear-to-r from-teal-400 to-lime-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style="width: 100%"
              ></div>
            </div>
            <p class="text-[10px] text-teal-600 mt-2 font-bold flex items-center gap-1">
              <i class="bi bi-exclamation-triangle"></i> Bạn đã đạt giới hạn tối đa người tham gia
            </p>
          </div>
        </div>

        <button
          class="mt-6 w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          Xem chi tiết thống kê <i class="bi bi-arrow-right"></i>
        </button>
      </div>

      <!-- Plan Features -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden group"
      >
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-teal-50 rounded-full blur-2xl group-hover:bg-teal-100 transition-colors"></div>

        <div class="flex items-center gap-3 mb-6 relative z-10">
          <div class="p-2 bg-teal-50 text-teal-600 rounded-lg shadow-sm shadow-teal-100">
            <i class="bi bi-award-fill"></i>
          </div>
          <h3 class="font-bold text-slate-900">Quyền lợi của bạn</h3>
        </div>
        <ul class="space-y-4 flex-1 relative z-10">
          <li
            v-for="(feature, idx) in currentPlanFeatures"
            :key="idx"
            class="flex items-center gap-3 text-sm text-slate-600 group/li"
          >
            <div class="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover/li:bg-emerald-500 group-hover/li:text-white transition-all">
              <i class="bi bi-check-lg text-xs"></i>
            </div>
            <span class="group-hover/li:text-slate-900 transition-colors">{{ feature }}</span>
          </li>
        </ul>

        <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
           <div class="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
             <i class="bi bi-stars text-emerald-500"></i> Tip:
           </div>
           <p class="text-[11px] text-slate-500 leading-relaxed">
             Nâng cấp lên gói Business để không giới hạn số lượng cuộc họp và người tham dự mỗi phòng.
           </p>
        </div>
      </div>
    </div>

    <!-- Upgrade Plans -->
    <div class="pt-6">
      <h3 class="text-xl font-bold text-slate-900 mb-6 text-center">
        Nâng cấp gói
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="pkg in emailPackages.filter((p) => {
            const price = p.variants?.find((v) => v.isActive)?.price || 0;
            return price > 0;
          })"
          :key="pkg._id"
          class="rounded-2xl p-6 border transition-all duration-300 flex flex-col relative overflow-hidden group"
          :class="[
            isEmailCurrentPlan(pkg)
              ? 'bg-white border-green-500 ring-1 ring-green-500 shadow-md'
              : pkg.isPopular
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl z-10'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg',
          ]"
        >
          <!-- Popular Badge -->
          <div
            v-if="pkg.isPopular"
            class="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-purple-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm"
          >
            Phổ biến
          </div>

          <div class="mb-4">
            <h4
              class="font-bold text-lg mb-1"
              :class="
                isEmailCurrentPlan(pkg)
                  ? 'text-slate-900'
                  : pkg.isPopular
                    ? 'text-white'
                    : 'text-slate-900'
              "
            >
              {{ pkg.name }}
            </h4>
            <div class="flex items-end gap-1">
              <span
                class="text-2xl font-bold"
                :class="
                  isEmailCurrentPlan(pkg)
                    ? 'text-slate-900'
                    : pkg.isPopular
                      ? 'text-white'
                      : 'text-slate-900'
                "
              >
                {{
                  formatCurrency(
                    pkg.variants?.find((v) => v.isActive)?.price || 0,
                  )
                }}₫
              </span>
              <span
                class="text-xs mb-1"
                :class="
                  isEmailCurrentPlan(pkg)
                    ? 'text-slate-500'
                    : pkg.isPopular
                      ? 'text-slate-400'
                      : 'text-slate-500'
                "
                >/tháng</span
              >
            </div>
          </div>

          <ul class="space-y-2 mb-6 flex-1">
            <li
              v-for="(feature, idx) in Array.isArray(pkg.features)
                ? pkg.features
                : []"
              :key="idx"
              class="flex items-start gap-2 text-xs"
            >
              <i
                class="bi bi-check-lg shrink-0"
                :class="
                  isEmailCurrentPlan(pkg)
                    ? 'text-green-600'
                    : pkg.isPopular
                      ? 'text-green-400'
                      : 'text-green-600'
                "
              ></i>
              <span
                :class="
                  isEmailCurrentPlan(pkg)
                    ? 'text-slate-600'
                    : pkg.isPopular
                      ? 'text-slate-300'
                      : 'text-slate-600'
                "
                >{{ feature }}</span
              >
            </li>
          </ul>

          <button
            v-if="enableMethodPayment"
            @click="handleUpgrade(pkg)"
            :disabled="isEmailCurrentPlan(pkg) || isEmailDowngrade(pkg)"
            class="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
            :class="[
              isEmailCurrentPlan(pkg)
                ? 'bg-green-500 text-white cursor-default'
                : isEmailDowngrade(pkg)
                  ? 'bg-slate-100 text-slate-400'
                  : pkg.slug === 'email-pro'
                    ? 'bg-white text-slate-900 hover:bg-emerald-50 border border-slate-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800',
            ]"
          >
            <span v-if="isEmailCurrentPlan(pkg)"
              ><i class="bi bi-check-circle-fill mr-1"></i> Đang sử dụng</span
            >
            <span v-else-if="isEmailDowngrade(pkg)">Không thể hạ cấp</span>
            <span v-else>Nâng cấp ngay</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  profile: Object,
  emailPackages: Array,
  currentPlanName: String,
  isExpiringSoon: Boolean,
  enableMethodPayment: Boolean,
});

const emit = defineEmits(["navigate"]);

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const isEmailCurrentPlan = (pkg) => {
  if (!pkg) return false;
  const sub = props.profile?.subscription;
  if (!sub?.productId) return false; // Must have productId

  // ONLY ID comparison - NO fallbacks
  const subProductId = sub.productId._id?.toString();
  const pkgId = pkg._id?.toString();

  return subProductId === pkgId;
};

const isEmailDowngrade = (pkg) => {
  if (!props.profile?.subscription || !currentPlanPackage.value) {
    return false;
  }

  // Get current plan price from variants
  const currentPrice =
    currentPlanPackage.value.variants?.find((v) => v.isActive)?.price || 0;

  // Get new package price from variants
  const newPrice = pkg.variants?.find((v) => v.isActive)?.price || 0;

  // Downgrade if new price is less than current price
  return newPrice < currentPrice;
};

const currentPlanPackage = computed(() => {
  const sub = props.profile?.subscription;
  if (!sub?.productId) {
    return null;
  }

  // Use populated productId directly - NO lookups needed
  return sub.productId;
});

const currentPlanFeatures = computed(
  () => currentPlanPackage.value?.features || [],
);

const handleUpgrade = (pkg) => {
  const price = pkg.variants?.find((v) => v.isActive)?.price || 0;
  if (price > 0 && !isEmailCurrentPlan(pkg) && !isEmailDowngrade(pkg)) {
    navigateTo(`/pricing?packageId=${pkg._id}`);
  }
};
</script>
