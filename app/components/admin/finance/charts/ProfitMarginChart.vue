<template>
  <div class="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">{{ title }}</h3>
      <div class="text-xs text-gray-400">{{ period }}</div>
    </div>
    <div class="relative h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: 'Profit Margin' },
  period: { type: String, default: 'Monthly' },
  labels: { type: Array, required: true },
  revenue: { type: Array, required: true },
  expenses: { type: Array, required: true }
})

const chartData = computed(() => {
  const profit = props.revenue.map((rev, idx) => rev - (props.expenses[idx] || 0))
  
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: props.revenue,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Chi phí',
        data: props.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: 'Lợi nhuận',
        data: profit,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: { size: 11, weight: '600' }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 13, weight: 'bold' },
      bodyFont: { size: 12 },
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || ''
          const value = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(context.parsed.y)
          return `${label}: ${value}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return new Intl.NumberFormat('vi-VN', { 
            notation: 'compact', 
            compactDisplay: 'short' 
          }).format(value)
        },
        font: { size: 10 }
      },
      grid: { color: 'rgba(0, 0, 0, 0.05)' }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, weight: '500' } }
    }
  }
}
</script>
