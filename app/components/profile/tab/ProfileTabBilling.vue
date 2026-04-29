<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
    <!-- Header with Filters -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h3 class="text-xl font-bold text-slate-900">Lịch sử thanh toán</h3>
        <p class="text-sm text-slate-500">Xem và tải xuống hóa đơn của bạn</p>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:flex-none">
          <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Tìm mã giao dịch..."
            class="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all w-full sm:w-48"
          />
        </div>
        <button class="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <i class="bi bi-filter text-slate-600"></i>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="billingHistory.length === 0"
      class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200"
    >
      <div
        class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="bi bi-receipt text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">Chưa có giao dịch</h3>
      <p class="text-slate-500 max-w-xs mx-auto text-sm">
        Lịch sử thanh toán của bạn sẽ xuất hiện ở đây.
      </p>
    </div>

    <!-- Billing List -->
    <div v-else class="space-y-4">
      <div
        v-for="transaction in billingHistory"
        :key="transaction._id"
        class="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
      >
        <div
          class="flex flex-col sm:flex-row gap-5 items-start sm:items-center"
        >
          <!-- Icon Status -->
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
            :class="getStatusBgClass(transaction.status)"
          >
            <i
              class="bi text-xl"
              :class="getStatusIconClass(transaction.status)"
            ></i>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h4 class="font-bold text-slate-900 truncate">
                {{ getTransactionTitle(transaction) }}
              </h4>
              <span
                class="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border"
                :class="
                  transaction.type === 'conversion'
                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                "
              >
                {{ transaction.type === "conversion" ? "CONVERT" : "MEETING" }}
              </span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600"
              >
                {{ transaction.merchTxnRef }}
              </span>
            </div>

            <div
              class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500"
            >
              <div class="flex items-center gap-1.5">
                <i class="bi bi-calendar3"></i>
                {{ formatDate(transaction.createdAt) }}
              </div>
              <div
                v-if="transaction.paymentProvider"
                class="flex items-center gap-1.5"
              >
                <i :class="getProviderIcon(transaction.paymentProvider)"></i>
                {{ getProviderName(transaction.paymentProvider) }}
              </div>
            </div>
          </div>

          <!-- Amount & Action -->
          <div
            class="flex items-center justify-between w-full sm:w-auto gap-4 sm:flex-col sm:items-end sm:gap-1"
          >
            <div class="text-right">
              <div class="text-lg font-bold text-slate-900">
                {{ formatCurrency(transaction.amount) }}
                <span class="text-xs font-medium text-slate-500">{{
                  transaction.currency || "VND"
                }}</span>
              </div>
              <div
                class="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                :class="getStatusBgClass(transaction.status)"
              >
                {{ getStatusText(transaction.status) }}
              </div>
            </div>

            <button
              v-if="transaction.status === 'active'"
              @click="$emit('export-pdf', transaction)"
              class="px-4 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-500 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <i class="bi bi-download"></i> PDF
            </button>
            <button
              v-else-if="transaction.status === 'pending'"
              @click="$emit('check-status', transaction)"
              class="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            >
              <i class="bi bi-arrow-clockwise"></i> Check
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  billingHistory: { type: Array, default: () => [] },
});

defineEmits(["export-pdf", "check-status"]);

const getTransactionTitle = (txn) => {
  if (txn.packageSlug) {
    const planName = txn.packageSlug;
    return `Gói ${planName}`;
  }
  return txn.title || `Gói ${(txn.plan || "Basic").replace("free", "Basic")}`;
};

const formatDate = (date) =>
  !date
    ? "N/A"
    : new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
const formatCurrency = (amt) =>
  !amt ? "0" : new Intl.NumberFormat("vi-VN").format(amt);

const getStatusText = (s) =>
  ({
    active: "Thành công",
    pending: "Đang xử lý",
    cancelled: "Đã hủy",
    expired: "Hết hạn",
  })[s] || s;
const getStatusBgClass = (s) =>
  ({
    active: "bg-emerald-50 text-emerald-600",
    pending: "bg-yellow-50 text-yellow-600",
    cancelled: "bg-slate-50 text-slate-400",
    expired: "bg-slate-50 text-slate-400",
  })[s] || "bg-slate-50";
const getStatusIconClass = (s) =>
  ({
    active: "bi-check-lg",
    pending: "bi-hourglass-split",
    cancelled: "bi-x-lg",
    expired: "bi-slash-circle",
  })[s] || "bi-question";
const getStatusTextClass = (s) =>
  ({
    active: "text-emerald-600",
    pending: "text-yellow-600",
    cancelled: "text-slate-400",
    expired: "text-slate-400",
  })[s] || "text-slate-500";

const getProviderName = (p) =>
  ({ payos: "PayOS", onepay: "OnePay", stripe: "Stripe", paypal: "PayPal" })[
    p?.toLowerCase()
  ] ||
  p ||
  "N/A";
const getProviderIcon = (p) =>
  ({
    payos: "bi-wallet2",
    onepay: "bi-credit-card",
    stripe: "bi-stripe",
    paypal: "bi-paypal",
  })[p?.toLowerCase()] || "bi-credit-card-2-front";
</script>
