<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Usage Card -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <i class="bi bi-bar-chart-fill"></i>
            </div>
            <h3 class="font-bold text-slate-900">Mức sử dụng</h3>
          </div>
          <span
            class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200"
          >
            {{ getCurrentPackage()?.name }}
          </span>
        </div>

        <div class="space-y-6 flex-1">
          <!-- Daily Quota -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-600"
                >Lượt chuyển đổi hôm nay</span
              >
              <span
                class="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded"
              >
                {{ getDailyUsage() }} /
                {{
                  getCurrentPackage()?.specifications?.dailyConversionLimit || 0
                }}
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                class="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                :style="{
                  width: `${Math.min(((getDailyUsage() || 0) / (getCurrentPackage()?.specifications?.dailyConversionLimit || 1)) * 100, 100)}%`,
                }"
              ></div>
            </div>
            <p class="text-xs text-slate-400 mt-1.5 text-right">
              Tự động reset lúc 00:00
            </p>
          </div>

          <!-- Expiry -->
          <div
            v-if="conversionSubscription?.endDate"
            class="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between"
          >
            <span class="text-xs text-slate-500 font-medium">Hết hạn vào</span>
            <span class="text-sm font-bold font-mono text-slate-700">{{
              formatDate(conversionSubscription.endDate)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Plan Features -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-green-50 text-green-600 rounded-lg">
            <i class="bi bi-check-lg"></i>
          </div>
          <h3 class="font-bold text-slate-900">Quyền lợi của bạn</h3>
        </div>
        <ul class="space-y-4 flex-1">
          <li
            v-for="(feature, idx) in getCurrentPackage()?.features || []"
            :key="idx"
            class="flex items-start gap-3 text-sm text-slate-600"
          >
            <i
              class="bi bi-check-circle-fill text-green-500 shrink-0 mt-0.5"
            ></i>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Upgrade Plans -->
    <div class="pt-6">
      <h3 class="text-xl font-bold text-slate-900 mb-6 text-center">
        Các gói chuyển đổi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="pkg in conversionPackages.filter((p) => {
            const price = p.variants?.find((v) => v.isActive)?.price || 0;
            return price > 0;
          })"
          :key="pkg._id"
          class="rounded-2xl p-6 border transition-all duration-300 flex flex-col relative overflow-hidden group"
          :class="[
            isCurrent(pkg)
              ? 'bg-white border-green-500 ring-1 ring-green-500 shadow-md'
              : pkg.isPopular
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl  z-10'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg',
          ]"
        >
          <!-- Popular Badge -->
          <div
            v-if="pkg.isPopular"
            class="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm"
          >
            Phổ biến
          </div>

          <div class="mb-4">
            <h4
              class="font-bold text-lg mb-1"
              :class="
                isCurrent(pkg)
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
                  isCurrent(pkg)
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
                  isCurrent(pkg)
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
                  isCurrent(pkg)
                    ? 'text-green-600'
                    : pkg.isPopular
                      ? 'text-green-400'
                      : 'text-green-600'
                "
              ></i>
              <span
                :class="
                  isCurrent(pkg)
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
            @click="
              !isCurrent(pkg) && !isConversionDowngrade(pkg)
                ? navigateTo(`/pricing?packageId=${pkg._id}`)
                : null
            "
            :disabled="isCurrent(pkg) || isConversionDowngrade(pkg)"
            class="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
            :class="[
              isCurrent(pkg)
                ? 'bg-green-500 text-white cursor-default'
                : isConversionDowngrade(pkg)
                  ? 'bg-slate-100 text-slate-400'
                  : pkg.isPopular
                    ? 'bg-white text-slate-900 hover:bg-indigo-50'
                    : 'bg-slate-900 text-white hover:bg-slate-800',
            ]"
          >
            <span v-if="isCurrent(pkg)"
              ><i class="bi bi-check-circle-fill mr-1"></i> Đang sử dụng</span
            >
            <span v-else-if="isConversionDowngrade(pkg)">Không thể hạ cấp</span>
            <span v-else>Nâng cấp ngay</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profile: { type: Object, default: () => ({}) },
  conversionSubscription: { type: Object, default: null },
  conversionPackages: { type: Array, default: () => [] },
  enableMethodPayment: { type: Boolean, default: false },
});

const getCurrentPackage = () => {
  const sub = props.conversionSubscription;
  if (!sub?.productId) return null;

  // Use populated productId directly - NO lookups needed
  return sub.productId;
};

const getDailyUsage = () => props.conversionSubscription?.usage?.used || 0;

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

const isCurrent = (pkg) => {
  if (!pkg || !props.conversionSubscription) return false;
  const sub = props.conversionSubscription;
  if (!sub?.productId) return false; // Must have productId

  // ONLY ID comparison - NO fallbacks
  const subProductId = sub.productId._id?.toString();
  const pkgId = pkg._id?.toString();

  return subProductId === pkgId;
};

const isConversionDowngrade = (pkg) => {
  const currentPkg = getCurrentPackage();
  if (!currentPkg) return false;

  // Compare prices from variants
  const currentPrice = currentPkg.variants?.find((v) => v.isActive)?.price || 0;
  const newPrice = pkg.variants?.find((v) => v.isActive)?.price || 0;

  return newPrice < currentPrice;
};
</script>
