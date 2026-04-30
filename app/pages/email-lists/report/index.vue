<template>
  <div class="flex flex-col w-full items-center bg-slate-50">
    <ToastContainer />

    <!-- Compact Header -->
    <div
      class="flex flex-col w-full px-4 sm:px-6 py-3 gap-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10 shadow-sm"
    >
      <button
        @click="navigateTo('/email-lists')"
        class="cursor-pointer inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit font-medium"
      >
        <i class="bi bi-arrow-left"></i>
        <span>Quay lại</span>
      </button>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <i class="bi bi-graph-up-arrow text-white text-sm sm:text-base"></i>
          </div>
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg font-bold text-slate-900 truncate">
              Báo Cáo Hiệu Suất
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <!-- Date Range Selector -->
          <select
            v-model="dateRange"
            @change="fetchStats"
            class="px-2.5 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white font-medium shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer hover:border-emerald-300"
          >
            <option :value="7">7 ngày qua</option>
            <option :value="30">30 ngày qua</option>
            <option :value="90">90 ngày qua</option>
          </select>

          <!-- Campaigns Button -->
          <NuxtLink
            to="/campaigns"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-all text-xs sm:text-sm font-semibold shadow-sm"
          >
            <i class="bi bi-list-ul"></i>
            <span class="hidden sm:inline">Chiến dịch</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-full flex-1 px-4 sm:px-6 py-4">
      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <!-- Total Campaigns -->
        <div
          class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div
            class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <i class="bi bi-megaphone-fill text-4xl text-emerald-600"></i>
          </div>
          <div
            class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1"
          >
            Chiến Dịch
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">
            {{ stats?.totalCampaigns || 0 }}
          </div>
          <div
            class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1"
          >
            <i class="bi bi-calendar-check"></i> Trong {{ dateRange }} ngày
          </div>
        </div>

        <!-- Emails Sent -->
        <div
          class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div
            class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <i class="bi bi-send-fill text-4xl text-teal-600"></i>
          </div>
          <div
            class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1"
          >
            Email Đã Gửi
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">
            {{ formatNumber(stats?.totalSent || 0) }}
          </div>
          <div
            class="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden"
          >
            <div class="bg-teal-500 h-full w-3/4"></div>
          </div>
        </div>

        <!-- Avg Open Rate -->
        <div
          class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div
            class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <i class="bi bi-envelope-open-fill text-4xl text-emerald-600"></i>
          </div>
          <div
            class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1"
          >
            Tỷ Lệ Mở
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">
            {{ stats?.avgOpenRate || 0 }}%
          </div>
          <div
            class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-emerald-500 rounded-full transition-all"
              :style="{ width: `${Math.min(stats?.avgOpenRate || 0, 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Avg Click Rate -->
        <div
          class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div
            class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"
          >
            <i class="bi bi-cursor-fill text-4xl text-lime-600"></i>
          </div>
          <div
            class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1"
          >
            Tỷ Lệ Click
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-slate-900">
            {{ stats?.avgClickRate || 0 }}%
          </div>
          <div
            class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-lime-500 rounded-full transition-all"
              :style="{ width: `${Math.min(stats?.avgClickRate || 0, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Detailed Metrics Grid -->
      <div
        class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6"
      >
        <h3
          class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"
        >
          <i class="bi bi-bar-chart-fill text-emerald-500"></i> Chi Tiết Tương
          Tác
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="text-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div class="text-xl sm:text-2xl font-bold text-teal-600 mb-1">
              {{ formatNumber(stats?.totalSent || 0) }}
            </div>
            <div
              class="text-xs font-medium text-slate-600 uppercase tracking-wide"
            >
              Đã gửi
            </div>
          </div>
          <div
            class="text-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div class="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">
              {{ formatNumber(stats?.totalOpened || 0) }}
            </div>
            <div
              class="text-xs font-medium text-slate-600 uppercase tracking-wide"
            >
              Đã mở
            </div>
          </div>
          <div
            class="text-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div class="text-xl sm:text-2xl font-bold text-lime-600 mb-1">
              {{ formatNumber(stats?.totalClicked || 0) }}
            </div>
            <div
              class="text-xs font-medium text-slate-600 uppercase tracking-wide"
            >
              Đã nhấp
            </div>
          </div>
          <div
            class="text-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div class="text-xl sm:text-2xl font-bold text-rose-600 mb-1">
              {{ formatNumber(stats?.totalBounced || 0) }}
            </div>
            <div
              class="text-xs font-medium text-slate-600 uppercase tracking-wide"
            >
              Thất bại
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Campaigns List -->
      <div
        class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col"
      >
        <div
          class="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50"
        >
          <h3 class="text-sm font-bold text-slate-900">Chiến Dịch Gần Đây</h3>
          <NuxtLink
            to="/campaigns"
            class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
          >
            Xem tất cả <i class="bi bi-arrow-right"></i>
          </NuxtLink>
        </div>

        <div class="overflow-auto flex-1 p-0">
          <div v-if="loading" class="p-6 space-y-4">
            <div
              v-for="n in 3"
              :key="n"
              class="flex items-center gap-4 animate-pulse"
            >
              <div class="w-10 h-10 bg-slate-200 rounded-lg"></div>
              <div class="flex-1">
                <div class="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div class="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          <div
            v-else-if="!recentCampaigns.length"
            class="p-12 text-center text-slate-400"
          >
            <i class="bi bi-inbox text-4xl mb-2 block opacity-50"></i>
            <span class="text-sm">Chưa có dữ liệu chiến dịch</span>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="campaign in recentCampaigns"
              :key="campaign._id"
              class="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors group"
              @click="navigateTo(`/campaigns/${campaign._id}`)"
            >
              <!-- Status Icon -->
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="getStatusIconClass(campaign.status)"
              >
                <i class="bi" :class="getStatusIcon(campaign.status)"></i>
              </div>

              <!-- Campaign Info -->
              <div class="flex-1 min-w-0">
                <div
                  class="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-600 transition-colors"
                >
                  {{ campaign.name }}
                </div>
                <div
                  class="text-xs text-slate-500 flex items-center gap-2 mt-0.5"
                >
                  <span class="flex items-center gap-1"
                    ><i class="bi bi-calendar3"></i>
                    {{ formatDate(campaign.createdAt) }}</span
                  >
                  <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span
                    >{{ campaign.stats?.totalRecipients || 0 }} người nhận</span
                  >
                </div>
              </div>

              <!-- Metrics (Desktop) -->
              <div class="hidden sm:flex items-center gap-6 text-right">
                <div>
                  <div class="text-xs font-bold text-emerald-600">
                    {{ campaign.stats?.openRate || 0 }}%
                  </div>
                  <div class="text-xs text-slate-400 uppercase font-medium">
                    Mở
                  </div>
                </div>
                <div>
                  <div class="text-xs font-bold text-teal-600">
                    {{ campaign.stats?.clickRate || 0 }}%
                  </div>
                  <div class="text-xs text-slate-400 uppercase font-medium">
                    Click
                  </div>
                </div>
              </div>

              <i
                class="bi bi-chevron-right text-slate-300 text-xs group-hover:text-slate-500"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script remains largely the same, just keeping the formatting functions
definePageMeta({ middleware: ["auth", "permission"] });

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase ;
const { error: showError } = useToast();
const authStore = useAuthStore();

const stats = ref(null);
const recentCampaigns = ref([]);
const loading = ref(false);
const dateRange = ref(30);

const getAuthHeaders = async () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.accessToken}`,
  };
};

const fetchStats = async () => {
  loading.value = true;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiBaseUrl}/v1/campaigns/dashboard?dateRange=${dateRange.value}`,
      { headers },
    );
    const data = await response.json();

    if (data.success) {
      stats.value = data.data.totals;
      recentCampaigns.value = data.data.recentCampaigns || [];
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    showError("Failed to load dashboard data");
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
  });

const getStatusIcon = (status) =>
  ({
    draft: "bi-file-earmark",
    scheduled: "bi-clock",
    sending: "bi-send",
    completed: "bi-check-circle",
    paused: "bi-pause-circle",
  })[status] || "bi-circle";

const getStatusIconClass = (status) =>
  ({
    draft: "bg-slate-100 text-slate-500",
    scheduled: "bg-teal-50 text-teal-600",
    sending: "bg-emerald-50 text-emerald-600",
    completed: "bg-emerald-50 text-emerald-600",
    paused: "bg-amber-50 text-amber-600",
  })[status] || "bg-slate-100 text-slate-500";

onMounted(fetchStats);
</script>
