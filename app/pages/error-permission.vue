<template>
    <div class="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <div class="max-w-md w-full text-center space-y-8">
            <!-- Icon -->
            <div class="relative w-24 h-24 mx-auto">
                <div class="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
                <div class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-red-50 to-red-100 rounded-full shadow-lg border border-red-200">
                    <i class="bi bi-shield-lock-fill text-4xl text-red-500 drop-shadow-sm"></i>
                </div>
            </div>

            <!-- Content -->
            <div class="space-y-4">
                <h1 class="text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-red-500 to-red-600 tracking-tighter">
                    403
                </h1>
                <div class="space-y-2">
                    <h2 class="text-xl font-bold text-gray-900">Không Có Quyền Truy Cập</h2>
                    <p class="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
                    </p>
                </div>
            </div>

            <!-- Action -->
            <div class="pt-4">
                <NuxtLink 
                    to="/" 
                    class="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                    <i class="bi bi-house-door-fill"></i>
                    <span>Về Trang Chủ</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
});</script>

<style lang="scss" scoped>
</style>