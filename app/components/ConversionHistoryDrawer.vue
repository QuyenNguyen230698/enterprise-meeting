<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[999999] flex justify-end">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
        
        <!-- Drawer -->
        <div class="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Lịch sử chuyển đổi</h2>
              <p class="text-sm text-gray-600 mt-1">{{ history.length }} file đã chuyển đổi</p>
            </div>
            <button 
              @click="$emit('close')"
              class="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <i class="bi bi-x-lg text-xl text-gray-600"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <span class="loading loading-spinner loading-lg text-blue-600"></span>
            </div>

            <!-- Empty State -->
            <div v-else-if="history.length === 0" class="text-center py-12">
              <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-clock-history text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử</h3>
              <p class="text-gray-600 text-sm">Các file bạn chuyển đổi sẽ hiển thị ở đây</p>
            </div>

            <!-- History List -->
            <div v-else class="space-y-4">
              <div
                v-for="item in history"
                :key="item._id"
                class="group relative bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-2xl hover:border-blue-300/60 transition-all duration-500"
              >
                <!-- Header with gradient -->
                <div 
                  :class="[
                    'h-16 relative overflow-hidden',
                    item.conversionType === 'pdf-to-word' 
                      ? 'bg-linear-to-br from-red-400 via-red-500 to-pink-500' 
                      : 'bg-linear-to-br from-blue-400 via-blue-500 to-lime-500'
                  ]"
                >
                                    
                  <!-- Large conversion icon -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="flex items-center gap-3 scale-110">
                      <!-- Source file -->
                      <div class="w-8 h-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <i 
                          :class="[
                            'text-lg text-white font-bold',
                            item.conversionType === 'pdf-to-word' ? 'bi bi-file-pdf' : 'bi bi-file-word'
                          ]"
                        ></i>
                      </div>
                      
                      <!-- Arrow -->
                      <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <i class="bi bi-arrow-right text-lg text-white font-bold"></i>
                      </div>
                      
                      <!-- Target file -->
                      <div class="w-8 h-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                        <i 
                          :class="[
                            'text-lg text-white font-bold',
                            item.conversionType === 'pdf-to-word' ? 'bi bi-file-word' : 'bi bi-file-pdf'
                          ]"
                        ></i>
                      </div>
                    </div>
                  </div>
                  
            
                </div>
                
                <!-- Content section -->
                <div class="py-2 px-6">
                  <!-- File name -->
                  <h4 class="text-base font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-all duration-200 px-2 py-2 border-b-2 border-dashed border-gray-300">
                    {{ item.fileName }}
                  </h4>
                  
                  <!-- Meta info grid -->
                  <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="text-center p-2 bg-gray-50 rounded-lg">
                      <div class="text-xs text-gray-500">Kích thước</div>
                      <div class="text-xs font-semibold text-gray-900">{{ formatFileSize(item.fileSize) }}</div>
                    </div>
                    
                    <div class="text-center p-2 bg-gray-50 rounded-lg">
                      <div class="text-xs text-gray-500">Thời gian</div>
                      <div class="text-xs font-semibold text-gray-900">{{ formatDate(item.createdAt) }}</div>
                    </div>
                    
                    <div class="text-center p-2 bg-gray-50 rounded-lg">
                      <div class="text-xs text-gray-500">Xử lý</div>
                      <div class="text-xs font-semibold text-gray-900">{{ (item.processingTime / 1000).toFixed(2) }}s</div>
                    </div>
                  </div>
                </div>

                              </div>
            </div>
          </div>

          <!-- Footer Stats -->
          <div v-if="stats" class="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div class="flex items-center justify-around gap-2">
              <div class="text-center">
                <div class="text-sm font-semibold text-gray-900">{{ history.length }}</div>
                <div class="text-xs text-gray-600">Tổng số</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold text-green-600">{{ getTodayCount() }}</div>
                <div class="text-xs text-gray-600">Hôm nay</div>
              </div>
              <div class="text-center">
                <div class="text-sm font-semibold text-blue-600">{{ formatFileSize(stats.stats?.[0]?.totalSize || 0) }}</div>
                <div class="text-xs text-gray-600">Dung lượng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'download']);

const config = useRuntimeConfig();
const authStore = useAuthStore();

const loading = ref(false);
const history = ref([]);
const stats = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchHistory();
    fetchStats();
  }
});

const fetchHistory = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/conversions/history`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    
    if (response.success) {
      // API returns { conversions: [...], pagination: {...}, stats: {...} }
      history.value = response.data.conversions || [];
      // Use stats from history API response if available
      if (response.data.stats) {
        stats.value = response.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch history:', error);
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/conversions/stats`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (response.success) {
      stats.value = response.data;
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

const deleteHistory = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa file này khỏi lịch sử?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/conversions/history/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    
    // Refresh history
    await fetchHistory();
    await fetchStats();
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Không thể xóa file. Vui lòng thử lại.');
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getTodayCount = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return history.value.filter(item => {
    const itemDate = new Date(item.createdAt);
    return itemDate >= today && itemDate < tomorrow;
  }).length;
};

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusText = (status) => {
  const statusMap = {
    completed: 'Hoàn thành',
    failed: 'Thất bại',
    processing: 'Đang xử lý',
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateX(100%);
}

.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.3s ease;
}
</style>
