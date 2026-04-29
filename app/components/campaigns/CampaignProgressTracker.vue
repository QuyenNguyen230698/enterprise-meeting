<template>
  <div v-if="campaignId" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <!-- Connection Status -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div 
          class="w-2 h-2 rounded-full"
          :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
        ></div>
        <span class="text-xs text-gray-600">
          {{ isConnected ? 'Live tracking' : 'Disconnected' }}
        </span>
      </div>
      <div class="text-xs text-gray-500">
        Campaign: {{ campaignId.slice(-8) }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="progress" class="mb-4">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="font-medium text-gray-900">Sending Progress</span>
        <span class="text-gray-600">{{ progress.percentage || 0 }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          class="h-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
          :style="{ width: `${Math.min(progress.percentage || 0, 100)}%` }"
        ></div>
      </div>
      
      <!-- Stats -->
      <div class="grid grid-cols-4 gap-2 mt-3">
        <div class="text-center p-2 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-gray-900">{{ progress.total || 0 }}</div>
          <div class="text-xs text-gray-600">Total</div>
        </div>
        <div class="text-center p-2 bg-green-50 rounded-lg">
          <div class="text-lg font-bold text-green-600">{{ progress.sent || 0 }}</div>
          <div class="text-xs text-gray-600">Sent</div>
        </div>
        <div class="text-center p-2 bg-yellow-50 rounded-lg">
          <div class="text-lg font-bold text-yellow-600">{{ progress.pending || 0 }}</div>
          <div class="text-xs text-gray-600">Pending</div>
        </div>
        <div class="text-center p-2 bg-red-50 rounded-lg">
          <div class="text-lg font-bold text-red-600">{{ progress.failed || 0 }}</div>
          <div class="text-xs text-gray-600">Failed</div>
        </div>
      </div>
    </div>

    <!-- Status Badge -->
    <div v-if="status" class="mb-4">
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-600">Status:</span>
        <span 
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="getStatusClass(status)"
        >
          {{ status }}
        </span>
      </div>
    </div>

    <!-- Recent Updates -->
    <div v-if="recipientUpdates.length > 0" class="border-t pt-3">
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-xs font-semibold text-gray-700">Recent Updates</h4>
        <button 
          @click="showAllUpdates = !showAllUpdates"
          class="text-xs text-blue-600 hover:text-blue-700"
        >
          {{ showAllUpdates ? 'Show less' : 'Show all' }}
        </button>
      </div>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <div 
          v-for="(update, index) in displayedUpdates" 
          :key="index"
          class="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
        >
          <span class="text-gray-700 truncate flex-1">{{ update.email }}</span>
          <span 
            class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusBadgeClass(update.status)"
          >
            {{ update.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-if="!progress && !status" class="text-center py-4 text-gray-500 text-sm">
      <i class="bi bi-hourglass-split text-2xl mb-2"></i>
      <p>Waiting for campaign data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCampaignRealtime } from '~/composables/useRealtimeSocket';

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const showAllUpdates = ref(false);

// Use campaign realtime composable with userId for security
const { progress, status, recipientUpdates, isConnected } = useCampaignRealtime(props.campaignId, props.userId);

const displayedUpdates = computed(() => {
  return showAllUpdates.value 
    ? recipientUpdates.value 
    : recipientUpdates.value.slice(0, 5);
});

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-blue-100 text-blue-700',
    sending: 'bg-yellow-100 text-yellow-700',
    paused: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    sent: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};
</script>
