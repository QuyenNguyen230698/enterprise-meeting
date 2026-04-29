<template>
  <div v-if="recipientCount > 0" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
        <i class="bi bi-clock-history text-blue-600"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Send Estimate</h4>
        
        <div v-if="loading" class="text-xs text-gray-600">
          <i class="bi bi-hourglass-split animate-spin mr-1"></i>
          Calculating...
        </div>

        <div v-else-if="estimate" class="space-y-2">
          <!-- Strategy Badge -->
          <div class="flex items-center gap-2">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStrategyClass(estimate.strategy)"
            >
              {{ getStrategyLabel(estimate.strategy) }}
            </span>
            <span class="text-xs text-gray-600">
              {{ recipientCount }} recipients
            </span>
          </div>

          <!-- Time Estimate -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white rounded-lg p-2">
              <div class="text-xs text-gray-600">Duration</div>
              <div class="text-sm font-semibold text-gray-900">
                {{ estimate.estimatedDuration }}
              </div>
            </div>
            <div class="bg-white rounded-lg p-2">
              <div class="text-xs text-gray-600">Completion</div>
              <div class="text-sm font-semibold text-gray-900">
                {{ formatTime(estimate.schedule?.endTime) }}
              </div>
            </div>
          </div>

          <!-- Batch Info -->
          <div class="text-xs text-gray-600 space-y-1">
            <div class="flex justify-between">
              <span>Batch size:</span>
              <span class="font-medium text-gray-900">{{ estimate.batchInfo?.batchSize }} emails</span>
            </div>
            <div class="flex justify-between">
              <span>Batch delay:</span>
              <span class="font-medium text-gray-900">{{ estimate.batchInfo?.batchDelay }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total batches:</span>
              <span class="font-medium text-gray-900">{{ estimate.batchInfo?.totalBatches }}</span>
            </div>
          </div>

          <!-- Info Message -->
          <div class="mt-2 p-2 bg-blue-100 rounded-lg">
            <p class="text-xs text-blue-800">
              <i class="bi bi-info-circle mr-1"></i>
              {{ getStrategyMessage(estimate.strategy) }}
            </p>
          </div>
        </div>

        <div v-else-if="error" class="text-xs text-red-600">
          <i class="bi bi-exclamation-circle mr-1"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  recipientCount: {
    type: Number,
    default: 0
  }
});

const estimate = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchEstimate = async () => {
  if (props.recipientCount <= 0) {
    estimate.value = null;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const response = await $fetch('/quota/estimate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipientCount: props.recipientCount
      })
    });

    if (response.success) {
      estimate.value = response.data;
    }
  } catch (err) {
    console.error('Error fetching estimate:', err);
    error.value = 'Unable to calculate estimate';
  } finally {
    loading.value = false;
  }
};

const getStrategyClass = (strategy) => {
  const classes = {
    burst: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    distributed: 'bg-blue-100 text-blue-700'
  };
  return classes[strategy] || 'bg-gray-100 text-gray-700';
};

const getStrategyLabel = (strategy) => {
  const labels = {
    burst: '⚡ Fast Send',
    moderate: '📊 Moderate',
    distributed: '🏦 Bank-style'
  };
  return labels[strategy] || strategy;
};

const getStrategyMessage = (strategy) => {
  const messages = {
    burst: 'Small campaign - sending quickly to maximize delivery speed.',
    moderate: 'Medium campaign - balanced speed and deliverability.',
    distributed: 'Large campaign - distributed over time to avoid spam filters and provider limits.'
  };
  return messages[strategy] || 'Optimized sending strategy';
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

watch(() => props.recipientCount, () => {
  fetchEstimate();
}, { immediate: true });
</script>
