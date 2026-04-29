<template>
  <div class="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">{{ title }}</h3>
      <div class="text-xs text-gray-400">{{ subtitle }}</div>
    </div>
    <div class="relative h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: 'Expense Breakdown' },
  subtitle: { type: String, default: '' },
  data: { type: Array, required: true }
})

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [{
    data: props.data.map(item => item.value),
    backgroundColor: [
      'rgba(239, 68, 68, 0.8)',   // red
      'rgba(251, 146, 60, 0.8)',  // orange
      'rgba(251, 191, 36, 0.8)',  // amber
      'rgba(34, 197, 94, 0.8)',   // green
      'rgba(59, 130, 246, 0.8)',  // blue
      'rgba(168, 85, 247, 0.8)',  // purple
      'rgba(236, 72, 153, 0.8)',  // pink
      'rgba(107, 114, 128, 0.8)'  // gray
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 8
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        usePointStyle: true,
        padding: 12,
        font: { size: 11, weight: '600' },
        generateLabels: (chart) => {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i]
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 13, weight: 'bold' },
      bodyFont: { size: 12 },
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(context.parsed)
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}
</script>
