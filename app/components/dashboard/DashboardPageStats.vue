<!-- Dashboard Page Stats Component -->
<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardPageStatCard 
            icon="bi bi-grid-3x3-gap-fill"
            iconBg="bg-primary-50"
            iconColor="text-primary-600"
            title="Total Apps"
            :value="totalApps"
            unit="apps"
        />
        <DashboardPageStatCard 
            icon="bi bi-check-circle"
            iconBg="bg-green-50"
            iconColor="text-green-600"
            title="Active Apps"
            :value="activeApps"
            unit="active"
            trend="+12%"
            trendIcon="bi bi-arrow-up-short"
            trendColor="text-green-600"
        />
        <DashboardPageStatCard 
            icon="bi bi-people"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            title="Users"
            :value="totalUsers"
            unit="user"
            trend="Active now"
            trendIcon="bi bi-person-plus"
            trendColor="text-blue-600"
        />
        <DashboardPageStatCard 
            icon="bi bi-clock-history"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            title="Recent"
            :value="recentActivities"
            unit="recent"
            trend="Last 24h"
            trendIcon="bi bi-clock"
            trendColor="text-purple-600"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    totalApps: {
        type: Number,
        required: true
    },
    activeApps: {
        type: Number,
        required: true
    },
    totalUsers: {
        type: Number,
        default: 1
    },
    recentActivities: {
        type: Number,
        default: 5
    }
})
</script>
