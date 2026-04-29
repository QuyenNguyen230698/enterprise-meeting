<template>
  <div class="flex flex-col gap-4 md:gap-6 animate-fade-in pb-8">
    <!-- Period Selector & Controls -->
    <div
      class="shrink-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4 flex flex-wrap items-center justify-between gap-4 z-20 relative"
    >
      <div class="flex items-center gap-2">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="selectedPeriod = p.value"
          :class="[
            'px-4 py-2 text-xs font-bold rounded-lg transition-all',
            selectedPeriod === p.value
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Year Selector -->
        <UiCustomSelect
          v-model="selectedYear"
          :options="years.map((y) => ({ label: `Năm ${y}`, value: y }))"
          class="min-w-[100px]"
        />

        <!-- Month Selector -->
        <UiCustomSelect
          v-if="selectedPeriod === 'month'"
          v-model="selectedMonth"
          :options="[
            { label: 'Tất cả tháng', value: 'all' },
            ...Array.from({ length: 12 }, (_, i) => ({
              label: `Tháng ${i + 1}`,
              value: i + 1,
            })),
          ]"
          class="min-w-[120px]"
        />

        <!-- Quarter Selector -->
        <UiCustomSelect
          v-if="selectedPeriod === 'quarter'"
          v-model="selectedQuarter"
          :options="[
            { label: 'Tất cả quý', value: 'all' },
            ...Array.from({ length: 4 }, (_, i) => ({
              label: `Quý ${i + 1}`,
              value: i + 1,
            })),
          ]"
          class="min-w-[110px]"
        />

        <button
          @click="$emit('add-transaction')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 ml-2"
        >
          <i class="bi bi-plus-lg"></i>
          <span class="hidden sm:inline">Giao Dịch</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.label"
        class="bg-white p-5 rounded-xl shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div
              class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
            >
              {{ kpi.label }}
            </div>
            <div class="text-2xl font-bold text-gray-900 font-mono">
              {{ formatCurrency(kpi.value) }}
            </div>
          </div>
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              kpi.bgColor,
            ]"
          >
            <i :class="[kpi.icon, kpi.iconColor, 'text-lg']"></i>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span
            :class="
              kpi.trend >= 0
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
            "
          >
            <i
              :class="kpi.trend >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"
            ></i>
            {{ Math.abs(kpi.trend).toFixed(1) }}%
          </span>
          <span class="text-gray-400">so với kỳ trước</span>
        </div>
      </div>
    </div>

    <!-- Charts Row 1: Revenue & Expense Breakdown -->
    <div class="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminFinanceChartsRevenueChart
        :title="`Xu Hướng Doanh Thu (${selectedPeriod === 'month' ? 'Tháng' : selectedPeriod === 'quarter' ? 'Quý' : 'Năm'})`"
        :period="selectedPeriod"
        :labels="chartLabels"
        :datasets="revenueDatasets"
      />
      <AdminFinanceChartsExpenseBreakdownChart
        title="Phân Bổ Chi Phí"
        :subtitle="`Năm ${selectedYear}`"
        :data="expenseBreakdown"
      />
    </div>

    <!-- Profit Margin Chart - Full Width -->
    <div class="shrink-0">
      <AdminFinanceChartsProfitMarginChart
        :title="`Biên Lợi Nhuận (${selectedPeriod === 'month' ? 'Tháng' : selectedPeriod === 'quarter' ? 'Quý' : 'Năm'})`"
        :period="selectedPeriod"
        :labels="chartLabels"
        :revenue="revenueData"
        :expenses="expensesData"
      />
    </div>

    <!-- Summary Card - Full Width -->
    <div class="shrink-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Quick Stats -->
          <div>
            <h3
              class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4"
            >
              Tóm Tắt Nhanh
            </h3>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <span class="text-sm text-gray-600">Tổng giao dịch</span>
                <span class="text-sm font-bold text-gray-900">{{
                  periodData?.summary?.transactionCount || 0
                }}</span>
              </div>
              <div
                class="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <span class="text-sm text-gray-600">Doanh thu TB</span>
                <span class="text-sm font-bold text-green-600">{{
                  formatCurrency(avgRevenue)
                }}</span>
              </div>
              <div
                class="flex justify-between items-center pb-2 border-b border-gray-100"
              >
                <span class="text-sm text-gray-600">Chi phí TB</span>
                <span class="text-sm font-bold text-red-600">{{
                  formatCurrency(avgExpense)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Tỷ suất lợi nhuận</span>
                <span class="text-sm font-bold text-blue-600"
                  >{{ profitMargin.toFixed(1) }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Revenue By Type -->
          <div>
            <h4
              class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4"
            >
              Theo Gói Dịch Vụ
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div class="text-xs font-bold text-gray-500 uppercase mb-1">
                  Email
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ formatCurrency(emailPackageRevenue) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ emailPackageCount }} gói
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div class="text-xs font-bold text-gray-500 uppercase mb-1">
                  Conversion
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ formatCurrency(conversionPackageRevenue) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ conversionPackageCount }} gói
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction Breakdown List -->
          <div>
            <h4
              class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4"
            >
              Chi Tiết Theo Loại
            </h4>
            <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div
                v-for="item in transactionSummary"
                :key="item.type + item.category"
                class="flex items-center justify-between py-2 px-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full shrink-0',
                      item.type === 'income' ? 'bg-green-500' : 'bg-red-500',
                    ]"
                  ></div>
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-bold text-gray-700 truncate">
                      {{ item.category }}
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ item.count }} giao dịch
                    </div>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <div
                    :class="[
                      'text-sm font-bold font-mono',
                      item.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ item.type === "income" ? "+" : "-"
                    }}{{ formatCurrency(item.total) }}
                  </div>
                </div>
              </div>
              <div
                v-if="transactionSummary.length === 0"
                class="text-center py-8 text-sm text-gray-400"
              >
                Chưa có dữ liệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Source Table (Full Width) -->
    <div
      class="shrink-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">
          Nguồn Thanh Toán
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead
            class="bg-gray-50 text-xs text-gray-500 uppercase font-semibold"
          >
            <tr>
              <th class="px-5 py-3 text-left">Nguồn</th>
              <th class="px-5 py-3 text-right">Số Lượng Giao Dịch</th>
              <th class="px-5 py-3 text-right">Doanh Thu</th>
              <th class="px-5 py-3 text-right">Tỷ Trọng</th>
              <th class="px-5 py-3 w-1/3 min-w-[200px]">Phân Bổ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"
                  >
                    <i class="bi bi-credit-card"></i>
                  </div>
                  <span class="font-bold text-gray-700">User Trả</span>
                </div>
              </td>
              <td class="px-5 py-4 text-right font-medium text-gray-600">
                {{ userPaidCount }}
              </td>
              <td class="px-5 py-4 text-right font-bold text-gray-900">
                {{ formatCurrency(userPaidRevenue) }}
              </td>
              <td class="px-5 py-4 text-right text-gray-500">
                {{
                  (
                    (userPaidRevenue /
                      (userPaidRevenue + adminAssignedRevenue || 1)) *
                    100
                  ).toFixed(1)
                }}%
              </td>
              <td class="px-5 py-4">
                <div
                  class="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="bg-green-500 h-full rounded-full transition-all duration-500"
                    :style="{
                      width: `${(userPaidRevenue / (userPaidRevenue + adminAssignedRevenue || 1)) * 100}%`,
                    }"
                  ></div>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"
                  >
                    <i class="bi bi-person-badge"></i>
                  </div>
                  <span class="font-bold text-gray-700">Admin Gán</span>
                </div>
              </td>
              <td class="px-5 py-4 text-right font-medium text-gray-600">
                {{ adminAssignedCount }}
              </td>
              <td class="px-5 py-4 text-right font-bold text-gray-900">
                {{ formatCurrency(adminAssignedRevenue) }}
              </td>
              <td class="px-5 py-4 text-right text-gray-500">
                {{
                  (
                    (adminAssignedRevenue /
                      (userPaidRevenue + adminAssignedRevenue || 1)) *
                    100
                  ).toFixed(1)
                }}%
              </td>
              <td class="px-5 py-4">
                <div
                  class="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    :style="{
                      width: `${(adminAssignedRevenue / (userPaidRevenue + adminAssignedRevenue || 1)) * 100}%`,
                    }"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50/50 font-bold text-gray-900">
            <tr>
              <td class="px-5 py-3">Tổng cộng</td>
              <td class="px-5 py-3 text-right">
                {{ userPaidCount + adminAssignedCount }}
              </td>
              <td class="px-5 py-3 text-right">
                {{ formatCurrency(userPaidRevenue + adminAssignedRevenue) }}
              </td>
              <td class="px-5 py-3 text-right">100%</td>
              <td class="px-5 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Advanced Transaction Table -->
    <div
      class="shrink-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 flex flex-col overflow-hidden"
      style="min-height: 500px"
    >
      <!-- Table Header with Filters -->
      <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">
            Nhật Ký Giao Dịch
          </h3>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-200 rounded-lg transition-all"
            >
              <i class="bi bi-download"></i> Export CSV
            </button>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            class="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
          />
          <select
            v-model="filterType"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
          >
            <option value="">Tất cả loại</option>
            <option value="income">Thu</option>
            <option value="expense">Chi</option>
          </select>
          <select
            v-model="filterCategory"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none bg-white"
          >
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <!-- Table Content -->
      <div class="flex-1 overflow-auto">
        <table class="w-full text-sm">
          <thead
            class="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 border-b border-gray-200"
          >
            <tr>
              <th
                class="px-5 py-3 font-semibold text-left cursor-pointer hover:bg-gray-100 transition-colors"
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
              <th class="px-5 py-3 font-semibold text-left">Nội Dung</th>
              <th
                class="px-5 py-3 font-semibold text-left hidden sm:table-cell cursor-pointer hover:bg-gray-100 transition-colors"
                @click="sortBy('type')"
              >
                <div class="flex items-center gap-1">
                  Loại
                  <i
                    v-if="sortColumn === 'type'"
                    :class="
                      sortDirection === 'asc'
                        ? 'bi bi-arrow-up'
                        : 'bi bi-arrow-down'
                    "
                    class="text-xs"
                  ></i>
                </div>
              </th>
              <th
                class="px-5 py-3 font-semibold text-right cursor-pointer hover:bg-gray-100 transition-colors"
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
              <th class="px-3 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="5" class="px-5 py-12 text-center text-gray-400">
                Không có giao dịch nào
              </td>
            </tr>
            <tr
              v-for="item in paginatedTransactions"
              :key="item._id"
              class="hover:bg-gray-50/80 transition-colors group"
            >
              <td class="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                {{ formatDate(item.date) }}
              </td>
              <td class="px-5 py-3.5">
                <div class="font-medium text-gray-900">
                  {{ item.description || item.category }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5" v-if="item.notes">
                  {{ item.notes }}
                </div>
              </td>
              <td class="px-5 py-3.5 hidden sm:table-cell">
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
                <div class="text-xs text-gray-400 mt-1 truncate max-w-[100px]">
                  {{ item.category }}
                </div>
              </td>
              <td
                class="px-5 py-3.5 text-right font-mono font-semibold"
                :class="
                  item.type === 'income' ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ item.type === "income" ? "+" : "-"
                }}{{ formatCurrency(item.amount) }}
              </td>
              <td class="px-3 py-3 text-right">
                <button
                  v-if="item.type === 'expense'"
                  @click="$emit('delete-transaction', item._id)"
                  class="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded hover:bg-gray-100"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="px-5 py-3 border-t border-gray-100 bg-gray-50/50 shrink-0 flex items-center justify-between"
      >
        <div class="text-xs text-gray-500">
          Hiển thị {{ (currentPage - 1) * pageSize + 1 }}-{{
            Math.min(currentPage * pageSize, filteredTransactions.length)
          }}
          / {{ filteredTransactions.length }} giao dịch
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="pageSize"
            class="px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 outline-none bg-white"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="text-xs font-semibold text-gray-700"
            >{{ currentPage }} / {{ totalPages }}</span
          >
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-xs font-semibold border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Cancelled Transactions Section -->
    <div
      class="shrink-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 flex flex-col overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-gray-100 bg-red-50/30 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <i class="bi bi-x-circle text-red-600"></i>
            </div>
            <div>
              <h3
                class="font-bold text-gray-800 text-sm uppercase tracking-wide"
              >
                Giao Dịch Đã Hủy
              </h3>
              <p class="text-xs text-gray-500">
                Năm {{ selectedYear }} - subscription bị cancelled/expired
              </p>
            </div>
          </div>
          <span
            class="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full"
          >
            {{ filteredCancelledTransactions.length }} giao dịch
          </span>
        </div>
      </div>

      <div class="overflow-auto" style="max-height: 400px">
        <table class="w-full text-sm">
          <thead
            class="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 border-b border-gray-200"
          >
            <tr>
              <th class="px-5 py-3 font-semibold text-left">Người Dùng</th>
              <th class="px-5 py-3 font-semibold text-left">Gói</th>
              <th class="px-5 py-3 font-semibold text-right">Số Tiền</th>
              <th class="px-5 py-3 font-semibold text-left">Trạng Thái</th>
              <th class="px-5 py-3 font-semibold text-left">Ngày Hủy</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="paginatedCancelledTransactions.length === 0">
              <td colspan="5" class="px-5 py-8 text-center text-gray-400">
                Không có giao dịch bị hủy trong năm {{ selectedYear }}
              </td>
            </tr>
            <tr
              v-for="item in paginatedCancelledTransactions"
              :key="item._id"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="font-medium text-gray-900 text-xs">
                  {{ item.userName }}
                </div>
                <div class="text-xs text-gray-400">{{ item.userEmail }}</div>
              </td>
              <td class="px-5 py-3.5">
                <div class="font-semibold text-gray-700 text-xs">
                  {{ item.plan }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ item.billingPeriod }}
                </div>
              </td>
              <td
                class="px-5 py-3.5 text-right font-mono font-semibold text-gray-600 text-xs"
              >
                {{ formatCurrency(item.amount) }}
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                  :class="
                    item.status === 'cancelled'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-orange-50 text-orange-700 border border-orange-100'
                  "
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-500">
                {{ formatDate(item.cancelledAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination for Cancelled -->
      <div
        v-if="filteredCancelledTransactions.length > cancelledPageSize"
        class="shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between"
      >
        <div class="text-xs text-gray-500">
          {{ (cancelledCurrentPage - 1) * cancelledPageSize + 1 }}-{{
            Math.min(
              cancelledCurrentPage * cancelledPageSize,
              filteredCancelledTransactions.length,
            )
          }}
          / {{ filteredCancelledTransactions.length }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="cancelledCurrentPage--"
            :disabled="cancelledCurrentPage === 1"
            class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="text-xs font-semibold"
            >{{ cancelledCurrentPage }} / {{ cancelledTotalPages }}</span
          >
          <button
            @click="cancelledCurrentPage++"
            :disabled="cancelledCurrentPage === cancelledTotalPages"
            class="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  transactions: Array,
});

const emit = defineEmits(["add-transaction", "delete-transaction"]);

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || "http://localhost:8000/api";
const authStore = useAuthStore();

// Period Selection
const periods = [
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];
const selectedPeriod = ref("month");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref("all"); // 'all' or 1-12
const selectedQuarter = ref("all"); // 'all' or 1-4
const years = [2026, 2025]; // Only current and previous year

// Data from NEW unified endpoint
const periodData = ref(null);
const cancelledTransactions = ref([]);
const loading = ref(false);

// Fetch ALL data from new unified endpoint
const fetchPeriodData = async () => {
  try {
    loading.value = true;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.accessToken}`,
    };

    // Build query params
    let url = `${apiBaseUrl}/admin/finance/period-summary?period=${selectedPeriod.value}&year=${selectedYear.value}`;
    if (selectedPeriod.value === "month" && selectedMonth.value !== "all") {
      url += `&month=${selectedMonth.value}`;
    } else if (
      selectedPeriod.value === "quarter" &&
      selectedQuarter.value !== "all"
    ) {
      url += `&quarter=${selectedQuarter.value}`;
    }

    const res = await fetch(url, { headers });
    const data = await res.json();

    if (data.success) {
      periodData.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching period data:", err);
  } finally {
    loading.value = false;
  }
};

// Fetch cancelled transactions
const fetchCancelledTransactions = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.accessToken}`,
    };

    const res = await fetch(`${apiBaseUrl}/admin/finance/cancelled`, {
      headers,
    });
    const data = await res.json();

    if (data.success) {
      cancelledTransactions.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching cancelled transactions:", err);
  }
};

// Watch for period type changes - reset month/quarter when switching
watch(selectedPeriod, (newPeriod) => {
  if (newPeriod === "month") {
    selectedMonth.value = "all";
  } else if (newPeriod === "quarter") {
    selectedQuarter.value = "all";
  }
});

// Watch for period/year/month/quarter changes
watch([selectedPeriod, selectedYear, selectedMonth, selectedQuarter], () => {
  fetchPeriodData();
  cancelledCurrentPage.value = 1; // Reset pagination when period changes
});

// Cancelled Transactions Pagination
const cancelledCurrentPage = ref(1);
const cancelledPageSize = 10;

// Filter cancelled transactions by selected year
const filteredCancelledTransactions = computed(() => {
  if (!cancelledTransactions.value) return [];

  return cancelledTransactions.value.filter((item) => {
    const cancelDate = new Date(item.cancelledAt || item.createdAt);
    return cancelDate.getFullYear() === selectedYear.value;
  });
});

const cancelledTotalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredCancelledTransactions.value.length / cancelledPageSize),
  ),
);

const paginatedCancelledTransactions = computed(() => {
  const start = (cancelledCurrentPage.value - 1) * cancelledPageSize;
  return filteredCancelledTransactions.value.slice(
    start,
    start + cancelledPageSize,
  );
});

// Reset cancelled page when year changes
watch(selectedYear, () => {
  cancelledCurrentPage.value = 1;
});

onMounted(() => {
  fetchPeriodData();
  fetchCancelledTransactions();
});

// Calculate trend percentage
const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// KPI Cards - ALL data from backend
const kpiCards = computed(() => {
  if (!periodData.value) return [];

  const summary = periodData.value.summary;
  const prev = periodData.value.previousPeriod;

  return [
    {
      label: "Doanh Thu",
      value: summary.revenue,
      trend: calculateTrend(summary.revenue, prev.revenue),
      icon: "bi bi-graph-up-arrow",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Chi Phí",
      value: summary.expenses,
      trend: calculateTrend(summary.expenses, prev.expenses),
      icon: "bi bi-graph-down-arrow",
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Thuế GTGT",
      value: summary.outputVAT,
      trend: 0,
      icon: "bi bi-receipt",
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Lợi Nhuận",
      value: summary.profit,
      trend: calculateTrend(summary.profit, prev.profit),
      icon: "bi bi-trophy",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];
});

// Helper to generate a consistent key for sorting and mapping
const getTrendKey = (item) => {
  if (selectedPeriod.value === "month") {
    // If viewing month details, key is day
    if (item._id.day) return item._id.day;
    return item._id.month;
  } else if (selectedPeriod.value === "quarter") {
    return item._id.month; // Monthly breakdown for Quarter view
  } else {
    // Year view
    if (item._id.month) return item._id.month; // Monthly breakdown for Year view
    if (item._id.quarter) return item._id.quarter; // Quarterly breakdown
    return item._id.year; // Yearly breakdown
  }
};

// Helper to generate Label from Key
const getLabelFromKey = (key) => {
  if (selectedPeriod.value === "month") return `${key}`;
  if (selectedPeriod.value === "quarter") return `T${key}`;
  if (selectedPeriod.value === "year") {
    // Check if key is month (1-12) or quarter (1-4). This is ambiguous if both exist.
    // However, usually Year view returns Monthly breakdown.
    // Let's assume consistent breakdown type from backend.
    return `T${key}`;
  }
  return `${key}`;
};

// Unified keys from both Revenue and Expenses
const unifiedKeys = computed(() => {
  if (!periodData.value?.trends) return [];

  const keys = new Set();

  periodData.value.trends.revenue?.forEach((item) => {
    keys.add(getTrendKey(item));
  });

  periodData.value.trends.expenses?.forEach((item) => {
    keys.add(getTrendKey(item));
  });

  // Sort keys numerically
  return Array.from(keys).sort((a, b) => a - b);
});

// Chart Labels
const chartLabels = computed(() => {
  return unifiedKeys.value.map((key) => getLabelFromKey(key));
});

// Revenue and Expense Data
const revenueData = computed(() => {
  if (!periodData.value?.trends) return [];

  const revMap = new Map();

  periodData.value.trends.revenue?.forEach((item) => {
    revMap.set(getTrendKey(item), item.revenue);
  });

  // Also add Income from 'income' array if exists (merging into Revenue)
  periodData.value.trends.income?.forEach((item) => {
    const key = getTrendKey(item);
    const current = revMap.get(key) || 0;
    revMap.set(key, current + item.income);
  });

  return unifiedKeys.value.map((key) => revMap.get(key) || 0);
});

const expensesData = computed(() => {
  if (!periodData.value?.trends) return [];

  const expMap = new Map();
  periodData.value.trends.expenses?.forEach((item) => {
    expMap.set(getTrendKey(item), item.expenses);
  });

  return unifiedKeys.value.map((key) => expMap.get(key) || 0);
});

const revenueDatasets = computed(() => [
  {
    label: "Doanh thu",
    data: revenueData.value,
    borderColor: "rgb(34, 197, 94)",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    tension: 0.4,
    fill: true,
  },
  {
    label: "Lợi nhuận",
    data: unifiedKeys.value.map((key, i) => {
      const rev = revenueData.value[i] || 0;
      const exp = expensesData.value[i] || 0;
      return rev - exp;
    }),
    borderColor: "rgb(59, 130, 246)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    tension: 0.4,
    fill: true,
  },
]);

const expenseBreakdown = computed(() => {
  if (!periodData.value?.breakdown?.expense) return [];

  return periodData.value.breakdown.expense.map((item) => ({
    label: getCategoryLabel(item.category),
    value: item.amount,
  }));
});

// Category label mapping
const getCategoryLabel = (cat) => {
  const labels = {
    operating: "Vận hành",
    marketing: "Marketing",
    salary: "Lương NV",
    software: "Phần mềm",
    tax: "Thuế",
    office: "Văn phòng",
    other: "Khác",
  };
  return labels[cat] || cat;
};

// Transaction Summary - Group by type and category
const transactionSummary = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return [];

  // Filter by selected year first
  const filtered = props.transactions.filter((t) => {
    const txDate = new Date(t.date);
    return txDate.getFullYear() === selectedYear.value;
  });

  const summary = new Map();

  filtered.forEach((tx) => {
    const key = `${tx.type}-${tx.category}`;

    if (!summary.has(key)) {
      summary.set(key, {
        type: tx.type,
        category: tx.category,
        count: 0,
        total: 0,
      });
    }

    const item = summary.get(key);
    item.count++;
    item.total += tx.amount;
  });

  return Array.from(summary.values()).sort((a, b) => b.total - a.total);
});

// Payment Source Breakdown - User Paid vs Admin Assigned
const userPaidRevenue = computed(() => {
  if (!props.transactions) return 0;
  return props.transactions
    .filter(
      (t) =>
        t.paymentSource === "user" &&
        t.type === "income" &&
        new Date(t.date).getFullYear() === selectedYear.value,
    )
    .reduce((sum, t) => sum + t.amount, 0);
});

const userPaidCount = computed(() => {
  if (!props.transactions) return 0;
  return props.transactions.filter(
    (t) =>
      t.paymentSource === "user" &&
      t.type === "income" &&
      new Date(t.date).getFullYear() === selectedYear.value,
  ).length;
});

const adminAssignedRevenue = computed(() => {
  if (!props.transactions) return 0;
  return props.transactions
    .filter(
      (t) =>
        t.paymentSource === "admin" &&
        t.type === "income" &&
        new Date(t.date).getFullYear() === selectedYear.value,
    )
    .reduce((sum, t) => sum + t.amount, 0);
});

const adminAssignedCount = computed(() => {
  if (!props.transactions) return 0;
  return props.transactions.filter(
    (t) =>
      t.paymentSource === "admin" &&
      t.type === "income" &&
      new Date(t.date).getFullYear() === selectedYear.value,
  ).length;
});

// Quick Stats - Based on backend data
const avgRevenue = computed(() => {
  if (!revenueData.value || revenueData.value.length === 0) return 0;
  const total = revenueData.value.reduce((sum, val) => sum + val, 0);
  return total / revenueData.value.length;
});

const avgExpense = computed(() => {
  if (!expensesData.value || expensesData.value.length === 0) return 0;
  const total = expensesData.value.reduce((sum, val) => sum + val, 0);
  return total / expensesData.value.length;
});

const profitMargin = computed(() => {
  if (!periodData.value?.summary) return 0;
  const revenue = periodData.value.summary.revenue;
  const profit = periodData.value.summary.profit;
  return revenue > 0 ? (profit / revenue) * 100 : 0;
});

// Subscription Revenue Breakdown by Type (from backend)
const emailPackageRevenue = computed(() => {
  return periodData.value?.summary?.emailRevenue || 0;
});

const conversionPackageRevenue = computed(() => {
  return periodData.value?.summary?.conversionRevenue || 0;
});

const emailPackageCount = computed(() => {
  return periodData.value?.summary?.emailCount || 0;
});

const conversionPackageCount = computed(() => {
  return periodData.value?.summary?.conversionCount || 0;
});

// Table Filtering & Sorting
const searchQuery = ref("");
const filterType = ref("");
const filterCategory = ref("");
const sortColumn = ref("date");
const sortDirection = ref("desc");
const currentPage = ref(1);
const pageSize = ref(25);

const categories = computed(() => {
  const cats = new Set(props.transactions?.map((t) => t.category) || []);
  return Array.from(cats);
});

const filteredTransactions = computed(() => {
  let result = props.transactions || [];

  // Filter by selected year FIRST
  result = result.filter((t) => {
    const txDate = new Date(t.date);
    return txDate.getFullYear() === selectedYear.value;
  });

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q),
    );
  }

  if (filterType.value) {
    result = result.filter((t) => t.type === filterType.value);
  }

  if (filterCategory.value) {
    result = result.filter((t) => t.category === filterCategory.value);
  }

  // Sorting
  result = [...result].sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];

    if (sortColumn.value === "date") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (sortDirection.value === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredTransactions.value.length / pageSize.value),
);

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTransactions.value.slice(start, end);
});

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "desc";
  }
};

watch([searchQuery, filterType, filterCategory], () => {
  currentPage.value = 1;
});

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
</script>
