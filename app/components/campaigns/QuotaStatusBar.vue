<template>
  <div class="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <i class="bi bi-speedometer2 text-purple-600 text-lg"></i>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-900">Email Quota</h3>
          <p class="text-xs text-gray-600">{{ quotaData?.plan || 'basic' }} plan</p>
        </div>
      </div>
      <button 
        @click="refreshQuota" 
        :disabled="loading"
        class="p-2 hover:bg-white/50 rounded-lg transition-colors"
        title="Refresh"
      >
        <i class="bi bi-arrow-clockwise text-gray-600" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="mb-3">
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="text-gray-600">Daily Usage</span>
        <span class="font-medium text-gray-900">
          {{ quotaData?.used || 0 }} / {{ quotaData?.dailyLimit || 0 }} emails
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full transition-all duration-500 rounded-full"
          :class="getProgressColor(quotaData?.percentage || 0)"
          :style="{ width: `${Math.min(quotaData?.percentage || 0, 100)}%` }"
        ></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white rounded-lg p-3 text-center">
        <div class="text-lg font-bold text-green-600">{{ quotaData?.remaining || 0 }}</div>
        <div class="text-xs text-gray-600">Remaining</div>
      </div>
      <div class="bg-white rounded-lg p-3 text-center">
        <div class="text-lg font-bold text-blue-600">{{ queueData?.activeCampaigns || 0 }}</div>
        <div class="text-xs text-gray-600">Active</div>
      </div>
      <div class="bg-white rounded-lg p-3 text-center">
        <div class="text-lg font-bold text-orange-600">{{ queueData?.queueLength || 0 }}</div>
        <div class="text-xs text-gray-600">Queued</div>
      </div>
    </div>

    <!-- Warning Messages -->
    <div v-if="quotaData?.percentage >= 80" class="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
      <div class="flex items-center gap-2">
        <i class="bi bi-exclamation-triangle text-orange-600 text-sm"></i>
        <p class="text-xs text-orange-700">
          <strong>Warning:</strong> You're approaching your daily limit. 
          <NuxtLink to="/subscription" class="underline hover:text-orange-800">Upgrade plan</NuxtLink>
        </p>
      </div>
    </div>

    <div v-if="quotaData?.percentage >= 100" class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center gap-2">
        <i class="bi bi-x-circle text-red-600 text-sm"></i>
        <p class="text-xs text-red-700">
          <strong>Limit Reached:</strong> Daily quota exceeded. Resets at {{ formatResetTime(quotaData?.resetTime) }}.
        </p>
      </div>
    </div>

    <!-- Queue Info -->
    <div v-if="queueData?.queueLength > 0" class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2">
        <i class="bi bi-info-circle text-blue-600 text-sm"></i>
        <p class="text-xs text-blue-700">
          {{ queueData.queueLength }} campaign(s) in queue. 
          {{ queueData.availableSlots }} slot(s) available.
        </p>
      </div>
    </div>

    <!-- Reset Time -->
    <div class="mt-3 text-xs text-gray-500 text-center">
      Quota resets: {{ formatResetTime(quotaData?.resetTime) }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRealtimeSocket } from '~/composables/useRealtimeSocket';

const quotaData = ref(null);
const queueData = ref(null);
const loading = ref(false);
const refreshInterval = ref(null);

const emit = defineEmits(['quota-updated']);

// Real-time connection
const { socket, isConnected } = useRealtimeSocket();

const fetchQuotaStatus = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiBase;
    
    const response = await $fetch(`${apiUrl}/api/quota/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.success) {
      quotaData.value = response.data.quota;
      queueData.value = response.data.queue;
      emit('quota-updated', response.data);
    }
  } catch (error) {
    console.error('Error fetching quota:', error);
  } finally {
    loading.value = false;
  }
};

const refreshQuota = () => {
  fetchQuotaStatus();
};

const getProgressColor = (percentage) => {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

const formatResetTime = (resetTime) => {
  if (!resetTime) return 'N/A';
  const date = new Date(resetTime);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Setup real-time listeners for quota updates
const setupRealtimeListeners = () => {
  const s = socket();
  if (!s) return;

  // Listen for quota updates (when campaigns complete, etc.)
  s.on('quota:updated', (data) => {
    if (data.quota) quotaData.value = data.quota;
    if (data.queue) queueData.value = data.queue;
    emit('quota-updated', data);
  });

  // Listen for campaign status changes to refresh quota
  s.on('campaign:status_change', (data) => {
    if (data.status === 'completed' || data.status === 'sending') {
      // Refresh quota when campaign status changes
      setTimeout(fetchQuotaStatus, 1000);
    }
  });
};

const removeRealtimeListeners = () => {
  const s = socket();
  if (!s) return;
  
  s.off('quota:updated');
  s.off('campaign:status_change');
};

onMounted(() => {
  fetchQuotaStatus();
  setupRealtimeListeners();
  // Refresh every 30 seconds as fallback
  refreshInterval.value = setInterval(fetchQuotaStatus, 30000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  removeRealtimeListeners();
});

defineExpose({
  refreshQuota
});
</script>
