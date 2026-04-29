<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div
      class="shrink-0 flex flex-wrap items-center justify-between gap-4 mb-6"
    >
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-500 font-medium">
          {{ filteredTransactions.length }} giao dịch
          <span v-if="selectedYear !== 'all'" class="text-gray-400"
            >trong năm {{ selectedYear }}</span
          >
        </div>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <select
          v-model="selectedYear"
          class="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
        >
          <option value="all">Tất cả năm</option>
          <option v-for="y in years" :key="y" :value="y">Năm {{ y }}</option>
        </select>
        <select
          v-model="filterType"
          class="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
        >
          <option value="">Tất cả loại</option>
          <option value="income">Thu</option>
          <option value="expense">Chi</option>
        </select>
        <select
          v-model="filterSource"
          class="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
        >
          <option value="">Tất cả nguồn</option>
          <option value="subscription">Subscription</option>
          <option value="manual">Thủ công</option>
        </select>
        <button
          @click="$emit('add-transaction')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i> Thêm Giao Dịch
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="shrink-0 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm giao dịch..."
        class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
      />
    </div>

    <!-- Table -->
    <div
      class="flex-1 min-h-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 flex flex-col overflow-hidden"
    >
      <div class="flex-1 overflow-auto">
        <table class="w-full text-sm">
          <thead
            class="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 border-b border-gray-200"
          >
            <tr>
              <th
                class="px-4 py-3 font-semibold text-left cursor-pointer hover:bg-gray-100"
                @click="sortBy('date')"
              >
                <div class="flex items-center gap-1">
                  Ngày
                  <i
                    v-if="sortColumn === 'date'"
                    :class="
                      sortDirection === 'asc'
                        ? 'bi bi-arrow-up'
                        : 'bi bi-arrow-down'
                    "
                    class="text-xs"
                  ></i>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold text-left">Nội Dung</th>
              <th class="px-4 py-3 font-semibold text-left">Nguồn</th>
              <th class="px-4 py-3 font-semibold text-left">Loại</th>
              <th class="px-4 py-3 font-semibold text-left">Danh Mục</th>
              <th
                class="px-4 py-3 font-semibold text-right cursor-pointer hover:bg-gray-100"
                @click="sortBy('amount')"
              >
                <div class="flex items-center justify-end gap-1">
                  Số Tiền
                  <i
                    v-if="sortColumn === 'amount'"
                    :class="
                      sortDirection === 'asc'
                        ? 'bi bi-arrow-up'
                        : 'bi bi-arrow-down'
                    "
                    class="text-xs"
                  ></i>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold text-center w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="7" class="px-4 py-12 text-center text-gray-400">
                Không có giao dịch nào
              </td>
            </tr>
            <tr
              v-for="item in paginatedTransactions"
              :key="item._id"
              class="hover:bg-gray-50/80 transition-colors group"
            >
              <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {{ formatDate(item.date) }}
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">
                  {{ item.description || item.title || item.category }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5" v-if="item.notes">
                  {{ item.notes }}
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                  :class="
                    item.source === 'subscription'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'bg-purple-50 text-purple-700 border border-purple-100'
                  "
                >
                  {{ item.source === "subscription" ? "Sub" : "Manual" }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border"
                  :class="
                    item.type === 'income'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                  "
                >
                  {{ item.type === "income" ? "THU" : "CHI" }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500">
                {{ item.category }}
              </td>
              <td
                class="px-4 py-3 text-right font-mono font-semibold"
                :class="
                  item.type === 'income' ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ item.type === "income" ? "+" : "-"
                }}{{ formatCurrency(item.amount) }}
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <!-- View History -->
                  <button
                    @click="showHistoryModal(item)"
                    class="w-7 h-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all flex items-center justify-center"
                    title="Xem lịch sử"
                  >
                    <i class="bi bi-clock-history text-sm"></i>
                  </button>
                  <!-- Edit (only for manual transactions) -->
                  <button
                    v-if="item.source !== 'subscription'"
                    @click="$emit('edit-transaction', item)"
                    class="w-7 h-7 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-all flex items-center justify-center"
                    title="Chỉnh sửa"
                  >
                    <i class="bi bi-pencil text-sm"></i>
                  </button>
                  <!-- Delete (only for manual transactions) -->
                  <button
                    v-if="item.source !== 'subscription'"
                    @click="$emit('delete-transaction', item._id)"
                    class="w-7 h-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all flex items-center justify-center"
                    title="Xóa"
                  >
                    <i class="bi bi-trash text-sm"></i>
                  </button>
                  <span
                    v-if="item.source === 'subscription'"
                    class="text-xs text-gray-300 italic"
                    >Tự động</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4"
      >
        <div class="text-xs text-gray-500">
          Hiển thị {{ (currentPage - 1) * pageSize + 1 }}-{{
            Math.min(currentPage * pageSize, filteredTransactions.length)
          }}
          / {{ filteredTransactions.length }}
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="pageSize"
            class="px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-900 outline-none bg-white"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="text-xs font-semibold text-gray-700"
            >{{ currentPage }} / {{ totalPages }}</span
          >
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div
      v-if="historyModalVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm"
        @click="historyModalVisible = false"
      ></div>
      <div
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
      >
        <div
          class="shrink-0 flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl"
        >
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Lịch Sử Chỉnh Sửa
          </h3>
          <button
            @click="historyModalVisible = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-auto p-4">
          <div v-if="loadingHistory" class="text-center py-8 text-gray-400">
            <i class="bi bi-arrow-repeat animate-spin text-xl"></i>
            <p class="mt-2 text-sm">Đang tải...</p>
          </div>
          <div
            v-else-if="historyItems.length === 0"
            class="text-center py-8 text-gray-400"
          >
            <i class="bi bi-clock-history text-3xl"></i>
            <p class="mt-2 text-sm">Chưa có lịch sử chỉnh sửa</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(log, idx) in historyItems"
              :key="idx"
              class="p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <i class="bi bi-person-fill text-gray-500 text-xs"></i>
                  </div>
                  <span class="text-xs font-semibold text-gray-700">{{
                    log.userName || "System"
                  }}</span>
                </div>
                <span class="text-xs text-gray-400">{{
                  formatDateTime(log.createdAt)
                }}</span>
              </div>
              <div class="text-xs text-gray-600">
                <span class="font-semibold">{{ log.action }}:</span>
                {{ log.description }}
              </div>
              <div
                v-if="log.changes && log.changes.length > 0"
                class="mt-2 space-y-1"
              >
                <div
                  v-for="(change, cIdx) in log.changes"
                  :key="cIdx"
                  class="text-[11px] text-gray-500"
                >
                  <span class="font-medium">{{ change.field }}:</span>
                  <span class="text-red-500 line-through">{{
                    change.oldValue
                  }}</span>
                  →
                  <span class="text-green-600">{{ change.newValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  transactions: Array,
});

const emit = defineEmits([
  "add-transaction",
  "edit-transaction",
  "delete-transaction",
]);

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || "http://localhost:8000/api";
const authStore = useAuthStore();

// Filters
const selectedYear = ref(new Date().getFullYear());
const filterType = ref("");
const filterSource = ref("");
const searchQuery = ref("");
const years = [2026, 2025, 2024];

// Sorting
const sortColumn = ref("date");
const sortDirection = ref("desc");

// Pagination
const currentPage = ref(1);
const pageSize = ref(25);

// History Modal
const historyModalVisible = ref(false);
const historyItems = ref([]);
const loadingHistory = ref(false);
const selectedTransactionForHistory = ref(null);

const filteredTransactions = computed(() => {
  let result = props.transactions || [];

  // Filter by year
  if (selectedYear.value !== "all") {
    result = result.filter((t) => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === selectedYear.value;
    });
  }

  // Filter by type
  if (filterType.value) {
    result = result.filter((t) => t.type === filterType.value);
  }

  // Filter by source
  if (filterSource.value) {
    result = result.filter((t) => t.source === filterSource.value);
  }

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q),
    );
  }

  // Sort
  result = [...result].sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];

    if (sortColumn.value === "date") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    return sortDirection.value === "asc"
      ? aVal > bVal
        ? 1
        : -1
      : aVal < bVal
        ? 1
        : -1;
  });

  return result;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize.value)),
);

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTransactions.value.slice(start, start + pageSize.value);
});

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "desc";
  }
};

watch([searchQuery, filterType, filterSource, selectedYear], () => {
  currentPage.value = 1;
});

// History
const showHistoryModal = async (item) => {
  selectedTransactionForHistory.value = item;
  historyModalVisible.value = true;
  loadingHistory.value = true;
  historyItems.value = [];

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.accessToken}`,
    };

    // Determine endpoint based on source
    const endpoint =
      item.source === "subscription"
        ? `${apiBaseUrl}/admin/finance/history/subscription/${item._id}`
        : `${apiBaseUrl}/admin/finance/history/expense/${item._id}`;

    const res = await fetch(endpoint, { headers });
    const data = await res.json();

    if (data.success) {
      historyItems.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching history:", err);
  } finally {
    loadingHistory.value = false;
  }
};

// Helpers
const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val || 0,
  );

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
