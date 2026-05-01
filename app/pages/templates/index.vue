<template>
  <div
    class="templates-theme h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900"
  >
    <ToastContainer />

    <!-- Confirm Modal -->
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :subtitle="confirmData.subtitle || ''"
      :message="
        confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'
      "
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      :loading="confirmData.loading"
      :loading-text="confirmData.loadingText"
      @confirm="confirm"
      @cancel="cancel"
    />

    <!-- Header Section -->
    <div class="bg-white bo rder-b border-gray-200 shrink-0 z-30 shadow-sm">
      <div class="px-4 py-3 sm:px-6 sm:py-4">
        <!-- Mobile / Tablet Top Row -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 overflow-hidden">
            <!-- Feature Icon -->
            <div
              class="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <i
                class="bi bi-envelope-paper text-white text-base sm:text-lg"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Quản Lý Mẫu
              </h1>
              <p class="text-xs text-gray-500 truncate hidden sm:block">
                Tạo và quản lý các mẫu email của bạn
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- View Toggle (Desktop) -->
            <div class="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm transition-all',
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <i class="bi bi-grid-fill"></i>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm transition-all',
                  viewMode === 'list'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <i class="bi bi-list-ul"></i>
              </button>
            </div>

            <button
              @click="createNewTemplate"
              class="px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <i class="bi bi-plus-lg"></i>
              <span class="hidden sm:inline">Tạo Mới</span>
            </button>
          </div>
        </div>

        <!-- Search & Filter Row -->
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <i
              class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Tìm kiếm mẫu email..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm transition-all outline-none"
            />
          </div>

          <!-- Mobile View Toggle & Filter Button -->
          <div class="flex gap-2 sm:hidden overflow-x-auto pb-1 no-scrollbar">
            <select
              v-model="filters.category"
              @change="fetchTemplates"
              class="flex-1 min-w-30 px-3 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-700 focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="">Tất cả danh mục</option>
              <option value="marketing">Marketing</option>
              <option value="transactional">Giao dịch</option>
              <option value="newsletter">Bản tin</option>
              <option value="promotional">Khuyến mãi</option>
            </select>
            <div class="flex bg-gray-100 rounded-xl p-1 shrink-0">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'w-9 h-9 flex items-center justify-center rounded-lg transition-all',
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500',
                ]"
              >
                <i class="bi bi-grid-fill"></i>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'w-9 h-9 flex items-center justify-center rounded-lg transition-all',
                  viewMode === 'list'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500',
                ]"
              >
                <i class="bi bi-list-ul"></i>
              </button>
            </div>
          </div>

          <!-- Desktop Filters -->
          <div class="hidden sm:flex gap-3">
            <select
              v-model="filters.category"
              @change="fetchTemplates"
              class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              <option value="marketing">Marketing</option>
              <option value="transactional">Giao dịch</option>
              <option value="newsletter">Bản tin</option>
              <option value="promotional">Khuyến mãi</option>
            </select>
            <select
              v-model="filters.sortBy"
              @change="fetchTemplates"
              class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="createdAt">Mới nhất</option>
              <option value="updatedAt">Cập nhật</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (Scrollable) -->
    <div class="flex-1 overflow-y-auto min-h-0 bg-gray-50 px-4 sm:px-6 py-6">
      <div class="max-w-full mx-auto min-h-full flex flex-col">
        <!-- Loading Skeleton -->
        <div
          v-if="showLoadingSkeleton"
          :class="[
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4',
          ]"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="bg-gray-200 rounded-2xl animate-pulse"
            :class="viewMode === 'grid' ? 'h-64' : 'h-24'"
          ></div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="templates.length === 0"
          class="flex-1 flex flex-col items-center justify-center text-center py-20"
        >
          <div
            class="w-20 h-20 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mb-6 text-4xl"
          >
            <i class="bi bi-inbox"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Chưa tìm thấy mẫu email
          </h3>
          <p class="text-gray-500 mb-6 max-w-sm mx-auto">
            Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác để tìm mẫu email bạn
            cần.
          </p>
          <button
            v-if="filters.search || filters.category"
            @click="clearFilters"
            class="px-6 py-2 bg-white border border-gray-300 hover:border-emerald-300 text-gray-700 hover:text-emerald-600 rounded-xl font-medium transition-all shadow-sm"
          >
            Xóa bộ lọc
          </button>
        </div>

        <!-- Grid View (Redesigned - No Image) -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <div
            v-for="template in templates"
            :key="template._id"
            class="group bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer relative overflow-hidden"
            @click="editTemplate(template._id)"
          >
            <!-- Card decoration line -->
            <div
              class="h-1.5 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <div class="p-5 flex flex-col flex-1">
              <!-- Header: Category & Mobile Menu -->
              <div class="flex items-start justify-between mb-4">
                <span
                  class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg uppercase tracking-wider group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors"
                >
                  {{ getCategoryLabel(template.category) }}
                </span>
                <button
                  @click.stop="activeMobileMenu = template._id"
                  class="sm:hidden w-8 h-8 -mr-1 -mt-1 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full"
                >
                  <i class="bi bi-three-dots"></i>
                </button>
              </div>

              <!-- Content -->
              <div class="flex-1 mb-4">
                <h3
                  class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors"
                  :title="template.name"
                >
                  {{ template.name }}
                </h3>
                <p class="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                  {{
                    template.description || "Chưa có mô tả cho mẫu email này."
                  }}
                </p>
              </div>

              <!-- Footer Info -->
              <div
                class="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto"
              >
                <div
                  class="flex items-center gap-2 text-xs text-gray-400 font-medium"
                >
                  <i class="bi bi-clock"></i>
                  {{ formatDate(template.updatedAt) }}
                </div>

                <!-- Desktop Action Buttons (Always visible on hover or static) -->
                <div
                  class="hidden sm:flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300"
                >
                  <button
                    @click.stop="previewTemplate(template)"
                    class="w-8 h-8 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center transition-colors"
                    title="Xem trước"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    @click.stop="duplicateTemplate(template._id)"
                    class="w-8 h-8 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 flex items-center justify-center transition-colors"
                    title="Nhân bản"
                  >
                    <i class="bi bi-files"></i>
                  </button>
                  <button
                    @click.stop="
                      confirmDeleteTemplate(template._id, template.name)
                    "
                    class="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                    title="Xóa"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Action Sheet Overlay -->
            <div
              v-if="activeMobileMenu === template._id"
              @click.stop="activeMobileMenu = null"
              class="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 gap-3 animate-fade-in sm:hidden text-center"
            >
              <h4 class="font-bold text-gray-900 mb-2 line-clamp-1 w-full">
                {{ template.name }}
              </h4>
              <button
                @click.stop="editTemplate(template._id)"
                class="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm shadow-md"
              >
                Chỉnh sửa
              </button>
              <div class="grid grid-cols-2 gap-3 w-full">
                <button
                  @click.stop="previewTemplate(template)"
                  class="py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm"
                >
                  Xem trước
                </button>
                <button
                  @click.stop="duplicateTemplate(template._id)"
                  class="py-3 bg-green-50 text-green-700 rounded-xl font-semibold text-sm"
                >
                  Nhân bản
                </button>
              </div>
              <button
                @click.stop="confirmDeleteTemplate(template._id, template.name)"
                class="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm"
              >
                Xóa
              </button>
              <button
                @click.stop="activeMobileMenu = null"
                class="mt-2 text-gray-400 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>

        <!-- List View (Redesigned - No Image) -->
        <div v-else-if="viewMode === 'list'" class="space-y-3">
          <div
            v-for="template in templates"
            :key="template._id"
            class="group bg-white rounded-xl border border-gray-200 p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
            @click="editTemplate(template._id)"
          >
            <!-- Icon/Badge for List -->
            <div
              class="hidden sm:flex w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center shrink-0"
            >
              <i class="bi bi-envelope-paper text-xl"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3
                  class="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition-colors"
                >
                  {{ template.name }}
                </h3>
                <span
                  class="sm:hidden px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                  >{{ getCategoryLabel(template.category) }}</span
                >
              </div>
              <p class="text-sm text-gray-500 line-clamp-1">
                {{ template.description || "Không có mô tả" }}
              </p>
              <div
                class="flex items-center gap-3 mt-2 sm:hidden text-xs text-gray-400"
              >
                <span
                  ><i class="bi bi-clock mr-1"></i
                  >{{ formatDate(template.updatedAt) }}</span
                >
              </div>
            </div>

            <!-- Desktop Meta & Actions -->
            <div class="hidden sm:flex items-center gap-6 shrink-0">
              <span
                class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap"
              >
                {{ getCategoryLabel(template.category) }}
              </span>
              <span
                class="text-sm text-gray-500 font-medium whitespace-nowrap w-24 text-right"
              >
                {{ formatDate(template.updatedAt) }}
              </span>

              <div class="w-px h-8 bg-gray-200 mx-2"></div>

              <div class="flex items-center gap-1">
                <button
                  @click.stop="previewTemplate(template)"
                  class="w-9 h-9 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center transition-colors"
                  title="Xem trước"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  @click.stop="duplicateTemplate(template._id)"
                  class="w-9 h-9 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 flex items-center justify-center transition-colors"
                  title="Nhân bản"
                >
                  <i class="bi bi-files"></i>
                </button>
                <button
                  @click.stop="
                    confirmDeleteTemplate(template._id, template.name)
                  "
                  class="w-9 h-9 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                  title="Xóa"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Pagination Footer -->
    <div
      v-if="pagination && pagination.total > 0"
      class="shrink-0 border-t border-gray-200 bg-white px-4 py-3 z-30"
    >
      <div
        class="max-w-full mx-auto flex flex-row items-center justify-between gap-4"
      >
        <!-- Info (Desktop: Left, Mobile: Left) -->
        <div class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
          <span class="sm:hidden">{{ pagination.total }} mẫu</span>
          <span class="hidden sm:inline"
            >Hiển thị {{ (filters.page - 1) * filters.limit + 1 }}-{{
              Math.min(filters.page * filters.limit, pagination.total)
            }}
            trong số {{ pagination.total }} mẫu</span
          >
        </div>

        <!-- Pagination (Desktop: Right, Mobile: Right) -->
        <div class="flex items-center gap-2">
          <button
            @click="changePage(filters.page - 1)"
            :disabled="filters.page <= 1"
            class="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 flex items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Trước</span>
            <i class="bi bi-chevron-left sm:hidden"></i>
          </button>

          <div
            class="px-3 py-2 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-lg border border-emerald-100"
          >
            {{ filters.page }}
            <span class="sm:hidden">/ {{ pagination.totalPages }}</span>
          </div>

          <button
            @click="changePage(filters.page + 1)"
            :disabled="filters.page >= pagination.totalPages"
            class="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 flex items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Sau</span>
            <i class="bi bi-chevron-right sm:hidden"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import ConfirmModal from "~/components/ConfirmModal.vue";

definePageMeta({ middleware: ["auth", "permission"] });

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase ;
const { success, error: showError, warning } = useToast();
const authStore = useAuthStore();
const {
  isVisible,
  confirmData,
  confirm,
  cancel,
  confirmDelete: showConfirmDelete,
} = useConfirm();

const templates = ref([]);
const pagination = ref(null);
const loading = ref(false);
const viewMode = ref("grid");
const activeMobileMenu = ref(null);
const isMobile = ref(false);

const filters = ref({
  search: "",
  category: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 12,
});

const showLoadingSkeleton = computed(
  () => loading.value && !templates.value.length,
);

let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    fetchTemplates();
  }, 500);
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

const fetchTemplates = async () => {
  loading.value = true;
  try {
    if (!authStore.isAuthenticated) {
      loading.value = false;
      return;
    }

    const queryParams = new URLSearchParams();
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = `${apiBaseUrl}/v1/templates/my-templates?${queryParams}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    const data = await response.json();
    if (data.success) {
      templates.value = data.data;
      pagination.value = data.pagination;
    }
  } catch (error) {
    console.error(error);
    showError("Không thể tải danh sách templates");
  } finally {
    loading.value = false;
  }
};

const createNewTemplate = () => navigateTo("/editor?mode=create");
const editTemplate = (id) => navigateTo(`/editor?mode=edit&templateId=${id}`);
const previewTemplate = (tpl) =>
  navigateTo(`/editor?mode=edit&templateId=${tpl._id}&preview=true`);

const duplicateTemplate = async (templateId) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/v1/templates/${templateId}/duplicate`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    const data = await response.json();
    if (data.success) {
      success("Đã nhân bản template!");
      fetchTemplates();
    } else {
      showError("Lỗi nhân bản");
    }
  } catch (err) {
    showError("Lỗi nhân bản");
  }
};

const confirmDeleteTemplate = async (id, name) => {
  const confirmed = await showConfirmDelete(`template "${name}"`);
  if (confirmed) deleteTemplate(id);
};

const deleteTemplate = async (id) => {
  try {
    const headers = { Authorization: `Bearer ${authStore.accessToken}` };
    await fetch(`${apiBaseUrl}/v1/templates/${id}`, { method: "DELETE", headers });
    success("Đã xóa template!");
    fetchTemplates();
  } catch (err) {
    showError("Không thể xóa");
  }
};

const changePage = (page) => {
  filters.value.page = page;
  fetchTemplates();
};

const clearFilters = () => {
  filters.value.search = "";
  filters.value.category = "";
  filters.value.page = 1;
  fetchTemplates();
};

const getCategoryLabel = (cat) => {
  const labels = {
    marketing: "Marketing",
    transactional: "Tickets",
    newsletter: "News",
    promotional: "Sales",
    announcement: "Notice",
  };
  return labels[cat] || cat || "General";
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

onMounted(() => {
  fetchTemplates();
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  if (searchTimeout) clearTimeout(searchTimeout);
});
</script>

<style scoped>
.templates-theme :deep(.bg-emerald-600),
.templates-theme :deep(.bg-emerald-500),
.templates-theme :deep(.bg-purple-600),
.templates-theme :deep(.bg-blue-600) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.templates-theme :deep(.text-emerald-700),
.templates-theme :deep(.text-emerald-600),
.templates-theme :deep(.text-purple-700),
.templates-theme :deep(.text-blue-700),
.templates-theme :deep(.text-blue-600) {
  color: #059669 !important;
}

.templates-theme :deep(.bg-emerald-50),
.templates-theme :deep(.bg-purple-50),
.templates-theme :deep(.bg-blue-50) {
  background-color: #ecfdf5 !important;
}

.templates-theme :deep(.border-emerald-500),
.templates-theme :deep(.border-emerald-300),
.templates-theme :deep(.border-emerald-200),
.templates-theme :deep(.border-purple-500),
.templates-theme :deep(.border-blue-500),
.templates-theme :deep(.border-blue-300),
.templates-theme :deep(.border-blue-200) {
  border-color: #34d399 !important;
}

.templates-theme :deep(.focus\:border-emerald-500:focus),
.templates-theme :deep(.focus\:border-purple-500:focus),
.templates-theme :deep(.focus\:border-blue-500:focus) {
  border-color: #10b981 !important;
}

.templates-theme :deep(.focus\:ring-emerald-200:focus),
.templates-theme :deep(.focus\:ring-emerald-500:focus),
.templates-theme :deep(.focus\:ring-purple-200:focus),
.templates-theme :deep(.focus\:ring-blue-200:focus),
.templates-theme :deep(.focus\:ring-blue-500:focus) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}

.templates-theme :deep([class*="from-purple-500"]) { --tw-gradient-from: #34d399 var(--tw-gradient-from-position) !important; }
.templates-theme :deep([class*="to-purple-600"]) { --tw-gradient-to: #84cc16 var(--tw-gradient-to-position) !important; }

.templates-theme :deep([class*="hover:bg-emerald-700"]:hover),
.templates-theme :deep([class*="hover:bg-purple-700"]:hover),
.templates-theme :deep([class*="hover:bg-blue-700"]:hover) {
  background-image: linear-gradient(to right, #10b981, #14b8a6, #84cc16) !important;
}

.templates-theme :deep([class*="hover:text-emerald-600"]:hover),
.templates-theme :deep([class*="hover:text-purple-600"]:hover),
.templates-theme :deep([class*="hover:text-blue-600"]:hover) {
  color: #047857 !important;
}

.templates-theme :deep([class*="hover:border-emerald-300"]:hover),
.templates-theme :deep([class*="hover:border-purple-300"]:hover),
.templates-theme :deep([class*="hover:border-blue-300"]:hover) {
  border-color: #34d399 !important;
}

.templates-theme :deep([class*="shadow-emerald"]),
.templates-theme :deep([class*="shadow-purple"]),
.templates-theme :deep([class*="shadow-blue"]) {
  --tw-shadow-color: rgba(16, 185, 129, 0.3) !important;
}

.templates-theme :deep([class*="ring-emerald"]),
.templates-theme :deep([class*="ring-purple"]),
.templates-theme :deep([class*="ring-blue"]) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
