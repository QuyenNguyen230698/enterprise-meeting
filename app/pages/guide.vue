<template>
  <NuxtLayout :name="layout">
    <div class="h-full flex w-full overflow-hidden bg-zinc-50">
      <!-- Mobile Menu Button -->

      <!-- Sidebar Drawer -->
      <div
        style="z-index: 999999 !important"
        :class="[
          'fixed md:relative top-0 bottom-0 md:top-auto md:bottom-auto left-0 z-40 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ]"
      >
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
              >
                <i class="bi bi-book text-white"></i>
              </div>
              <div>
                <h2 class="font-bold text-gray-900">Hướng Dẫn</h2>
                <p class="text-xs text-gray-500">Enterprise Meeting</p>
              </div>
            </div>
            <button
              @click="sidebarOpen = false"
              class="md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto p-4">
          <div class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="selectTab(tab.id)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                  : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-700',
              ]"
            >
              <i :class="tab.icon" class="text-lg"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-gray-200">
          <div
            class="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100"
          >
            <p class="text-xs text-gray-600 mb-2">Cần hỗ trợ?</p>
            <a
              href="mailto:anh.leduc2512@gmail.com"
              class="text-xs text-emerald-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <i class="bi bi-envelope"></i>
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>

      <!-- Overlay for mobile -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="md:hidden fixed inset-0 bg-black/50 z-30"
      ></div>

      <!-- Main Content -->
      <div class="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
        <!-- Header -->
        <div
          class="shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3"
        >
          <div class="flex items-center justify-between md:justify-start gap-4">
            <div class="flex-1">
              <h1 class="text-xl md:text-2xl font-bold text-gray-900">
                {{ currentTab?.label }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                {{ currentTab?.description }}
              </p>
            </div>
            <button
              @click="sidebarOpen = true"
              class="md:hidden w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              <i class="bi bi-journal-text text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-h-0 overflow-auto py-3">
          <div class="px-4 sm:px-6">
            <!-- Email Config Tab -->
            <div v-if="activeTab === 'email-config'">
              <div class="relative max-w-4xl mx-auto">
                <!-- Timeline Line -->
                <div
                  class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
                ></div>

                <div class="space-y-12">
                  <!-- 01: Gmail Setup -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm">01</span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div class="flex items-start gap-4 mb-6">
                        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                          <i class="bi bi-shield-lock text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Tạo Gmail App Password
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Bước đầu tiên để cho phép ứng dụng gửi email thay
                            mặt bạn
                          </p>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div
                          class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <span
                            class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                            >1</span
                          >
                          <div>
                            <p class="text-sm font-medium text-gray-900">
                              Truy cập Security Settings
                            </p>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Vào
                              <a
                                href="https://myaccount.google.com/security"
                                target="_blank"
                                class="text-emerald-600 hover:text-blue-700 hover:underline"
                                >Google Account Security</a
                              >
                              để bắt đầu.
                            </p>
                          </div>
                        </div>

                        <div
                          class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <span
                            class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                            >2</span
                          >
                          <div>
                            <p class="text-sm font-medium text-gray-900">
                              Bật xác thực 2 bước
                            </p>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Bắt buộc phải bật 2-Step Verification mới có thể
                              tạo App Password.
                            </p>
                          </div>
                        </div>

                        <div
                          class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <span
                            class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                            >3</span
                          >
                          <div>
                            <p class="text-sm font-medium text-gray-900">
                              Tạo App Password
                            </p>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Tìm kiếm "App passwords" &rarr; Tạo mới &rarr;
                              Chọn App "Mail" & Device "Other".
                            </p>
                          </div>
                        </div>

                        <div
                          class="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                        >
                          <span
                            class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                            ><i class="bi bi-key"></i
                          ></span>
                          <div>
                            <p class="text-sm font-bold text-blue-900">
                              Copy Mật Khẩu 16 Ký Tự
                            </p>
                            <p class="text-xs text-blue-700 mt-0.5">
                              Lưu lại mật khẩu này để nhập vào bước tiếp theo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 02: Configure in Enterprise Meeting -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm"
                          >02</span
                        >
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div class="flex items-start gap-4 mb-6">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-sliders text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Cấu Hình Trong Enterprise Meeting
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Kết nối ứng dụng với tài khoản Gmail của bạn
                          </p>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 transition-colors group"
                        >
                          <div class="flex items-center gap-3 mb-2">
                            <i
                              class="bi bi-gear text-emerald-500 group-hover:scale-110 transition-transform"
                            ></i>
                            <span class="text-sm font-semibold text-gray-900"
                              >Vào Cấu Hình</span
                            >
                          </div>
                          <p class="text-xs text-gray-500 pl-7">
                            Settings &rarr; Email Configuration
                          </p>
                        </div>

                        <div
                          class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 transition-colors group"
                        >
                          <div class="flex items-center gap-3 mb-2">
                            <i
                              class="bi bi-hdd-network text-emerald-500 group-hover:scale-110 transition-transform"
                            ></i>
                            <span class="text-sm font-semibold text-gray-900"
                              >Chọn Provider</span
                            >
                          </div>
                          <p class="text-xs text-gray-500 pl-7">
                            Chọn "Gmail" từ danh sách
                          </p>
                        </div>

                        <div
                          class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 transition-colors group"
                        >
                          <div class="flex items-center gap-3 mb-2">
                            <i
                              class="bi bi- envelope text-emerald-500 group-hover:scale-110 transition-transform"
                            ></i>
                            <span class="text-sm font-semibold text-gray-900"
                              >Nhập Thông Tin</span
                            >
                          </div>
                          <p class="text-xs text-gray-500 pl-7">
                            Nhập Email & App Password
                          </p>
                        </div>

                        <div
                          class="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 transition-colors group"
                        >
                          <div class="flex items-center gap-3 mb-2">
                            <i
                              class="bi bi-check-circle text-emerald-500 group-hover:scale-110 transition-transform"
                            ></i>
                            <span class="text-sm font-semibold text-gray-900"
                              >Kiểm Tra & Lưu</span
                            >
                          </div>
                          <p class="text-xs text-gray-500 pl-7">
                            Test Connection &rarr; Save
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 03: Custom SMTP -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm"
                          >03</span
                        >
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div class="flex items-start gap-4 mb-6">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-server text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            SMTP Server Tùy Chỉnh
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Dành cho người dùng nâng cao muốn sử dụng server
                            riêng
                          </p>
                        </div>
                        <span
                          class="ml-auto px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full hidden sm:inline-block"
                          >Tùy Chọn</span
                        >
                      </div>

                      <div
                        class="bg-emerald-50 rounded-xl p-5 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-emerald-900 mb-3 flex items-center gap-2"
                        >
                          <i class="bi bi-info-circle"></i> Thông Tin Cần Thiết
                        </h4>
                        <div
                          class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2"
                        >
                          <div
                            class="flex items-center justify-between text-sm py-2 border-b border-emerald-100 last:border-0 sm:border-b-0"
                          >
                            <span class="text-teal-700">SMTP Host</span>
                            <span
                              class="font-mono text-emerald-900 bg-white/50 px-2 rounded"
                              >smtp.example.com</span
                            >
                          </div>
                          <div
                            class="flex items-center justify-between text-sm py-2 border-b border-emerald-100 last:border-0 sm:border-b-0"
                          >
                            <span class="text-teal-700">Port</span>
                            <span
                              class="font-mono text-emerald-900 bg-white/50 px-2 rounded"
                              >587 / 465</span
                            >
                          </div>
                          <div
                            class="flex items-center justify-between text-sm py-2 border-b border-emerald-100 last:border-0 sm:border-b-0"
                          >
                            <span class="text-teal-700">Username</span>
                            <span
                              class="font-mono text-emerald-900 bg-white/50 px-2 rounded"
                              >your-email</span
                            >
                          </div>
                          <div
                            class="flex items-center justify-between text-sm py-2 border-b border-emerald-100 last:border-0 sm:border-b-0"
                          >
                            <span class="text-teal-700">Encryption</span>
                            <span
                              class="font-mono text-emerald-900 bg-white/50 px-2 rounded"
                              >TLS / SSL</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Getting Started Tab -->
            <div v-if="activeTab === 'getting-started'">
              <div class="relative max-w-4xl mx-auto">
                <!-- Vertical Line -->
                <div
                  class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
                ></div>

                <!-- Step Items -->
                <div class="space-y-12">
                  <!-- 01: Đặt Lịch Họp -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm">01</span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                      >
                        <div class="flex items-start gap-4">
                          <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <i class="bi bi-calendar-check text-xl"></i>
                          </div>
                          <div>
                            <h3 class="text-xl font-bold text-gray-900">
                              Đặt Lịch Họp
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              Quản lý và đặt phòng họp trực tuyến
                            </p>
                          </div>
                        </div>
                        <span
                          class="px-3 py-1 bg-emerald-100 text-blue-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >
                          Bắt buộc
                        </span>
                      </div>
                      <div class="space-y-4">
                        <div
                          class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <i
                            class="bi bi-door-open-fill text-emerald-500 text-xl"
                          ></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Chọn Khu Vực & Phòng
                            </h4>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Lọc danh sách phòng theo khu vực làm việc để tìm không gian phù hợp nhất.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <i
                            class="bi bi-clock-history text-emerald-500 text-xl"
                          ></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Kiểm Tra Trùng Lịch
                            </h4>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Hệ thống tự động phát hiện và khóa (🔒) các phòng đã bận trong khung giờ bạn chọn.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                        >
                          <i
                            class="bi bi-lightning-charge-fill text-emerald-500 text-xl mt-0.5"
                          ></i>
                          <div>
                            <h4 class="font-bold text-emerald-900 text-sm">
                              Tạo Nhanh Trên Calendar
                            </h4>
                            <p class="text-xs text-emerald-800 mt-0.5">
                              Bạn có thể click và kéo trực tiếp trên giao diện lịch để mở form đặt phòng nhanh chóng.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 02: Mời Người Tham Dự -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-green-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-green-100"
                      >
                        <span class="text-green-600 font-bold text-sm">02</span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                      >
                        <div class="flex items-start gap-4">
                          <div
                            class="p-3 bg-green-50 rounded-xl text-green-600"
                          >
                            <i class="bi bi-people text-xl"></i>
                          </div>
                          <div>
                            <h3 class="text-xl font-bold text-gray-900">
                              Mời Người Tham Dự
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              Quản lý danh sách người tham gia cuộc họp
                            </p>
                          </div>
                        </div>
                        <span
                          class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >
                          Bắt buộc
                        </span>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div
                          class="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"
                        >
                          <i
                            class="bi bi-person-plus text-2xl text-green-500 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-gray-900 text-sm">
                            Thành Viên Nội Bộ
                          </h4>
                          <p class="text-xs text-gray-500 mt-1">
                            Chọn từ danh sách user có sẵn
                          </p>
                        </div>
                        <div
                          class="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"
                        >
                          <i
                            class="bi bi-envelope-at text-2xl text-green-500 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-gray-900 text-sm">
                            CC Ngoài Hệ Thống
                          </h4>
                          <p class="text-xs text-gray-500 mt-1">
                            Nhập email khách mời bên ngoài
                          </p>
                        </div>
                        <div
                          class="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"
                        >
                          <i
                            class="bi bi-calendar-event text-2xl text-green-500 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-gray-900 text-sm">
                            Gửi File Lịch (.ics)
                          </h4>
                          <p class="text-xs text-gray-500 mt-1">
                            Tự động gửi thư mời vào Calendar
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 03: Phân Tích & Báo Cáo -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm"
                          >03</span
                        >
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                      >
                        <div class="flex items-start gap-4">
                          <div
                            class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                          >
                            <i class="bi bi-bar-chart-line text-xl"></i>
                          </div>
                          <div>
                            <h3 class="text-xl font-bold text-gray-900">
                              Phân Tích & Báo Cáo
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              Theo dõi hiệu suất sử dụng phòng họp
                            </p>
                          </div>
                        </div>
                        <span
                          class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >
                          Phân tích
                        </span>
                      </div>

                      <div class="space-y-4">
                        <div
                          class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <i
                            class="bi bi-pie-chart text-emerald-500 text-xl"
                          ></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Tỷ Lệ Lấp Đầy
                            </h4>
                            <p class="text-xs text-gray-500 mt-0.5">
                              Xem biểu đồ phân bổ thời gian sử dụng của từng phòng họp.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <i
                            class="bi bi-graph-up-arrow text-emerald-500 text-xl"
                          ></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Tần Suất Theo Tuần
                            </h4>
                            <p class="text-xs text-gray-500 mt-0.5">
                              So sánh tần suất đặt lịch giữa tuần này và tuần trước.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 04: Create Campaign -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-indigo-100"
                      >
                        <span class="text-teal-600 font-bold text-sm"
                          >04</span
                        >
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                      >
                        <div class="flex items-start gap-4">
                          <div
                            class="p-3 bg-teal-50 rounded-xl text-teal-600"
                          >
                            <i class="bi bi-send text-xl"></i>
                          </div>
                          <div>
                            <h3 class="text-xl font-bold text-gray-900">
                              Tạo Chiến Dịch
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              Thiết lập và cấu hình chiến dịch email
                            </p>
                          </div>
                        </div>
                        <span
                          class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >
                          Bắt buộc
                        </span>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div
                          class="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div
                            class="w-8 h-8 rounded-full bg-indigo-100 text-teal-600 flex items-center justify-center font-bold text-sm mb-2"
                          >
                            1
                          </div>
                          <span class="text-sm font-bold text-gray-900"
                            >Chọn Template</span
                          >
                          <span class="text-xs text-gray-500 mt-1"
                            >Mẫu email đã thiết kế</span
                          >
                        </div>
                        <div
                          class="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div
                            class="w-8 h-8 rounded-full bg-indigo-100 text-teal-600 flex items-center justify-center font-bold text-sm mb-2"
                          >
                            2
                          </div>
                          <span class="text-sm font-bold text-gray-900"
                            >Chọn Danh Sách</span
                          >
                          <span class="text-xs text-gray-500 mt-1"
                            >Người nhận email</span
                          >
                        </div>
                        <div
                          class="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div
                            class="w-8 h-8 rounded-full bg-indigo-100 text-teal-600 flex items-center justify-center font-bold text-sm mb-2"
                          >
                            3
                          </div>
                          <span class="text-sm font-bold text-gray-900"
                            >Cấu Hình Gửi</span
                          >
                          <span class="text-xs text-gray-500 mt-1"
                            >Tiêu đề, thời gian</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 05: Send & Track -->
                  <div class="relative pl-24">
                    <!-- Marker -->
                    <div class="absolute left-0 w-16 flex justify-center">
                      <div
                        class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                      >
                        <span class="text-emerald-600 font-bold text-sm"
                          >05</span
                        >
                      </div>
                    </div>

                    <!-- Content -->
                    <div
                      class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div
                        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                      >
                        <div class="flex items-start gap-4">
                          <div
                            class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                          >
                            <i class="bi bi-graph-up-arrow text-xl"></i>
                          </div>
                          <div>
                            <h3 class="text-xl font-bold text-gray-900">
                              Gửi & Theo Dõi
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">
                              Gửi chiến dịch và theo dõi hiệu quả
                            </p>
                          </div>
                        </div>
                        <span
                          class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >
                          Hoàn tất
                        </span>
                      </div>

                      <div
                        class="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center"
                      >
                        <div class="flex justify-center gap-8 mb-4">
                          <div class="text-center">
                            <div class="text-2xl font-bold text-emerald-600">
                              Open
                            </div>
                            <div class="text-xs text-emerald-700 font-medium">
                              Tracking
                            </div>
                          </div>
                          <div class="text-center">
                            <div class="text-2xl font-bold text-emerald-600">
                              Click
                            </div>
                            <div class="text-xs text-emerald-700 font-medium">
                              Tracking
                            </div>
                          </div>
                          <div class="text-center">
                            <div class="text-2xl font-bold text-emerald-600">
                              Bounce
                            </div>
                            <div class="text-xs text-emerald-700 font-medium">
                              Tracking
                            </div>
                          </div>
                        </div>
                        <p class="text-sm text-emerald-800">
                          Hệ thống tự động theo dõi và báo cáo chi tiết hiệu quả
                          của từng chiến dịch gửi đi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Email Warm-up Tab -->
          <div v-if="activeTab === 'email-warmup'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <!-- Vertical Line -->
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
              ></div>

              <!-- Step Items -->
              <div class="space-y-12">
                <!-- 01: Why Warm-up -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-orange-100"
                    >
                      <span class="text-orange-600 font-bold text-sm">01</span>
                    </div>
                  </div>

                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-orange-50 rounded-xl text-orange-600"
                        >
                          <i class="bi bi-exclamation-triangle text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Tại Sao Cần Warm-up Email?
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Xây dựng uy tín và tránh spam filter
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >Quan trọng</span
                      >
                    </div>

                    <div class="space-y-4">
                      <div
                        class="bg-red-50 rounded-xl p-5 border border-red-100"
                      >
                        <h4
                          class="font-semibold text-red-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-shield-exclamation"></i> Rủi Ro Khi
                          Không Warm-up
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div
                            class="flex items-start gap-2 text-xs text-red-800"
                          >
                            <i
                              class="bi bi-x-circle-fill text-red-500 mt-0.5"
                            ></i>
                            <span>Email vào spam/junk folder</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-red-800"
                          >
                            <i
                              class="bi bi-x-circle-fill text-red-500 mt-0.5"
                            ></i>
                            <span>IP/Domain bị blacklist</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-red-800"
                          >
                            <i
                              class="bi bi-x-circle-fill text-red-500 mt-0.5"
                            ></i>
                            <span>Tài khoản Gmail bị khóa</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-red-800"
                          >
                            <i
                              class="bi bi-x-circle-fill text-red-500 mt-0.5"
                            ></i>
                            <span>Deliverability rate thấp</span>
                          </div>
                        </div>
                      </div>

                      <div
                        class="bg-green-50 rounded-xl p-5 border border-green-100"
                      >
                        <h4
                          class="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-check-circle-fill"></i> Lợi Ích
                          Warm-up Đúng Cách
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div
                            class="flex items-start gap-2 text-xs text-green-800"
                          >
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span>Inbox placement cao (90%+)</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-green-800"
                          >
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span>Sender reputation tốt</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-green-800"
                          >
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span>Tránh bị ISP chặn</span>
                          </div>
                          <div
                            class="flex items-start gap-2 text-xs text-green-800"
                          >
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span>Engagement rate cao hơn</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Warm-up Schedule -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">02</span>
                    </div>
                  </div>

                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                          <i class="bi bi-calendar-week text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Lịch Trình Warm-up 30 Ngày
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Tăng volume từ từ theo tuần
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-blue-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >Khuyến nghị</span
                      >
                    </div>

                    <div class="space-y-3">
                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h4
                            class="font-bold text-blue-900 text-sm flex items-center gap-2"
                          >
                            <span
                              class="w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs"
                              >1</span
                            >
                            Tuần 1: Khởi Động
                          </h4>
                          <span
                            class="text-xs font-mono bg-blue-200 text-blue-800 px-2 py-1 rounded"
                            >10-20 emails/ngày</span
                          >
                        </div>
                        <p class="text-xs text-blue-700 pl-8">
                          Gửi cho danh sách nhỏ, người quen, đồng nghiệp. Đảm
                          bảo open rate cao (>40%).
                        </p>
                      </div>

                      <div
                        class="bg-teal-50 rounded-xl p-4 border border-indigo-100"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h4
                            class="font-bold text-indigo-900 text-sm flex items-center gap-2"
                          >
                            <span
                              class="w-6 h-6 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center text-xs"
                              >2</span
                            >
                            Tuần 2: Tăng Dần
                          </h4>
                          <span
                            class="text-xs font-mono bg-indigo-200 text-indigo-800 px-2 py-1 rounded"
                            >50-100 emails/ngày</span
                          >
                        </div>
                        <p class="text-xs text-indigo-700 pl-8">
                          Mở rộng danh sách, theo dõi bounce rate (<2%). Duy trì
                          engagement tốt.
                        </p>
                      </div>

                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h4
                            class="font-bold text-emerald-900 text-sm flex items-center gap-2"
                          >
                            <span
                              class="w-6 h-6 bg-teal-100 text-emerald-800 rounded-full flex items-center justify-center text-xs"
                              >3</span
                            >
                            Tuần 3: Mở Rộng
                          </h4>
                          <span
                            class="text-xs font-mono bg-teal-100 text-emerald-800 px-2 py-1 rounded"
                            >200-300 emails/ngày</span
                          >
                        </div>
                        <p class="text-xs text-teal-700 pl-8">
                          Gửi campaign thực tế, A/B testing. Monitor spam
                          complaints (<0.1%).
                        </p>
                      </div>

                      <div
                        class="bg-green-50 rounded-xl p-4 border border-green-100"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h4
                            class="font-bold text-green-900 text-sm flex items-center gap-2"
                          >
                            <span
                              class="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs"
                              >4</span
                            >
                            Tuần 4+: Full Speed
                          </h4>
                          <span
                            class="text-xs font-mono bg-green-200 text-green-800 px-2 py-1 rounded"
                            >500+ emails/ngày</span
                          >
                        </div>
                        <p class="text-xs text-green-700 pl-8">
                          Đạt volume mục tiêu. Tiếp tục monitor metrics và duy
                          trì chất lượng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Clean IP Practices -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-green-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-green-100"
                    >
                      <span class="text-green-600 font-bold text-sm">03</span>
                    </div>
                  </div>

                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-green-50 rounded-xl text-green-600">
                          <i class="bi bi-shield-check text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Duy Trì IP Sạch
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Best practices cho sender reputation
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >Bắt buộc</span
                      >
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        class="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <h4
                          class="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-check-circle text-green-500"></i> Làm
                          Gì
                        </h4>
                        <ul class="space-y-2 text-xs text-gray-600">
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-green-500 text-lg"></i>
                            <span>Verify email list (remove invalid)</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-green-500 text-lg"></i>
                            <span>Setup SPF, DKIM, DMARC</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-green-500 text-lg"></i>
                            <span>Monitor blacklist status</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-green-500 text-lg"></i>
                            <span>Segment danh sách engaged users</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-green-500 text-lg"></i>
                            <span>Gửi nội dung có giá trị</span>
                          </li>
                        </ul>
                      </div>

                      <div
                        class="bg-red-50 rounded-xl p-4 border border-red-100"
                      >
                        <h4
                          class="font-semibold text-red-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-x-circle text-red-500"></i> Tránh Làm
                        </h4>
                        <ul class="space-y-2 text-xs text-red-800">
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-red-500 text-lg"></i>
                            <span>Mua email list từ bên thứ 3</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-red-500 text-lg"></i>
                            <span>Gửi quá nhiều email đột ngột</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-red-500 text-lg"></i>
                            <span>Spam keywords (FREE, WIN, $$$)</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-red-500 text-lg"></i>
                            <span>Gửi cho inactive users (>6 tháng)</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-dot text-red-500 text-lg"></i>
                            <span>Bỏ qua unsubscribe requests</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 04: Monitoring Metrics -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">04</span>
                    </div>
                  </div>

                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-graph-up-arrow text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Theo Dõi Metrics
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Chỉ số quan trọng cần monitor
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >Analytics</span
                      >
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center"
                      >
                        <div class="text-2xl font-bold text-emerald-600 mb-1">
                          >95%
                        </div>
                        <div class="text-xs text-blue-700 font-medium">
                          Deliverability
                        </div>
                        <div class="text-xs text-emerald-600 mt-1">Mục tiêu</div>
                      </div>
                      <div
                        class="bg-green-50 rounded-xl p-4 border border-green-100 text-center"
                      >
                        <div class="text-2xl font-bold text-green-600 mb-1">
                          >20%
                        </div>
                        <div class="text-xs text-green-700 font-medium">
                          Open Rate
                        </div>
                        <div class="text-xs text-green-600 mt-1">Tốt</div>
                      </div>
                      <div
                        class="bg-red-50 rounded-xl p-4 border border-red-100 text-center"
                      >
                        <div class="text-2xl font-bold text-red-600 mb-1">
                          <2%
                        </div>
                        <div class="text-xs text-red-700 font-medium">
                          Bounce Rate
                        </div>
                        <div class="text-xs text-red-600 mt-1">Tối đa</div>
                      </div>
                      <div
                        class="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center"
                      >
                        <div class="text-2xl font-bold text-orange-600 mb-1">
                          <0.1%
                        </div>
                        <div class="text-xs text-orange-700 font-medium">
                          Spam Rate
                        </div>
                        <div class="text-xs text-orange-600 mt-1">Giới hạn</div>
                      </div>
                    </div>

                    <div
                      class="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                    >
                      <h4
                        class="font-semibold text-emerald-900 mb-2 text-sm flex items-center gap-2"
                      >
                        <i class="bi bi-tools"></i> Công Cụ Kiểm Tra
                      </h4>
                      <div
                        class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"
                      >
                        <a
                          href="https://mxtoolbox.com/blacklists.aspx"
                          target="_blank"
                          class="flex items-center gap-2 text-teal-700 hover:text-emerald-900 hover:underline"
                        >
                          <i class="bi bi-box-arrow-up-right"></i>
                          <span>MXToolbox (Blacklist check)</span>
                        </a>
                        <a
                          href="https://www.mail-tester.com/"
                          target="_blank"
                          class="flex items-center gap-2 text-teal-700 hover:text-emerald-900 hover:underline"
                        >
                          <i class="bi bi-box-arrow-up-right"></i>
                          <span>Mail-Tester (Spam score)</span>
                        </a>
                        <a
                          href="https://postmaster.google.com/"
                          target="_blank"
                          class="flex items-center gap-2 text-teal-700 hover:text-emerald-900 hover:underline"
                        >
                          <i class="bi bi-box-arrow-up-right"></i>
                          <span>Google Postmaster Tools</span>
                        </a>
                        <a
                          href="https://senderscore.org/"
                          target="_blank"
                          class="flex items-center gap-2 text-teal-700 hover:text-emerald-900 hover:underline"
                        >
                          <i class="bi bi-box-arrow-up-right"></i>
                          <span>Sender Score (IP reputation)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 05: Enterprise Meeting Advantages -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-cyan-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-cyan-100"
                    >
                      <span class="text-cyan-600 font-bold text-sm">05</span>
                    </div>
                  </div>

                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-cyan-50 rounded-xl text-cyan-600">
                          <i class="bi bi-rocket-takeoff text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Lợi Ích Khi Dùng Enterprise Meeting
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Công cụ hỗ trợ warm-up tự động và thông minh
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                        >Ưu việt</span
                      >
                    </div>

                    <div class="space-y-4">
                      <div
                        class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-speedometer2"></i> Tự Động Kiểm Soát
                          Volume
                        </h4>
                        <ul class="space-y-2 text-xs text-blue-800">
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-emerald-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Rate limiting thông minh:</strong> Tự
                              động giới hạn số email/ngày theo gói dịch vụ</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-emerald-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Queue system:</strong> Phân phối email
                              đều trong ngày, tránh gửi đột ngột</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-emerald-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Batch processing:</strong> Chia nhỏ
                              campaign lớn thành các batch an toàn</span
                            >
                          </li>
                        </ul>
                      </div>

                      <div
                        class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100"
                      >
                        <h4
                          class="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-graph-up"></i> Theo Dõi Realtime
                        </h4>
                        <ul class="space-y-2 text-xs text-green-800">
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-green-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Live metrics:</strong> Open rate, click
                              rate, bounce rate cập nhật liên tục</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-green-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Spam detection:</strong> Phát hiện bot
                              scanner, lọc metrics chính xác</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-green-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Alert system:</strong> Cảnh báo khi
                              bounce/spam rate vượt ngưỡng</span
                            >
                          </li>
                        </ul>
                      </div>

                      <div
                        class="bg-gradient-to-br from-emerald-50 to-pink-50 rounded-xl p-5 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-emerald-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-shield-check"></i> Bảo Vệ Sender
                          Reputation
                        </h4>
                        <ul class="space-y-2 text-xs text-emerald-800">
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-teal-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Email validation:</strong> Tự động verify
                              email trước khi gửi</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-teal-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Unsubscribe auto:</strong> Link hủy đăng
                              ký tự động, tuân thủ GDPR</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-teal-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Bounce handling:</strong> Tự động loại bỏ
                              email bounce khỏi danh sách</span
                            >
                          </li>
                        </ul>
                      </div>

                      <div
                        class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100"
                      >
                        <h4
                          class="font-semibold text-orange-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-lightning-charge"></i> Tối Ưu
                          Engagement
                        </h4>
                        <ul class="space-y-2 text-xs text-orange-800">
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-orange-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Segmentation:</strong> Chia nhóm engaged
                              users để warm-up hiệu quả</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-orange-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>Personalization:</strong> Dynamic fields
                              tăng open rate tự nhiên</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i
                              class="bi bi-check-circle-fill text-orange-500 mt-0.5"
                            ></i>
                            <span
                              ><strong>A/B testing:</strong> Tối ưu subject line
                              và nội dung cho warm-up</span
                            >
                          </li>
                        </ul>
                      </div>

                      <div
                        class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-5 border border-indigo-200"
                      >
                        <div class="flex items-center gap-3 mb-3">
                          <i class="bi bi-stars text-2xl text-teal-600"></i>
                          <h4 class="font-bold text-indigo-900 text-sm">
                            Kết Quả Thực Tế
                          </h4>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div class="text-center p-3 bg-white/60 rounded-lg">
                            <div class="text-xl font-bold text-teal-600">
                              95%+
                            </div>
                            <div class="text-xs text-indigo-700 mt-1">
                              Inbox Rate
                            </div>
                          </div>
                          <div class="text-center p-3 bg-white/60 rounded-lg">
                            <div class="text-xl font-bold text-green-600">
                              30%+
                            </div>
                            <div class="text-xs text-green-700 mt-1">
                              Open Rate
                            </div>
                          </div>
                          <div class="text-center p-3 bg-white/60 rounded-lg">
                            <div class="text-xl font-bold text-emerald-600">
                              <1%
                            </div>
                            <div class="text-xs text-blue-700 mt-1">Bounce</div>
                          </div>
                          <div class="text-center p-3 bg-white/60 rounded-lg">
                            <div class="text-xl font-bold text-emerald-600">
                              0%
                            </div>
                            <div class="text-xs text-teal-700 mt-1">Spam</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Email Lists Tab -->
          <div v-if="activeTab === 'email-lists'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <!-- Vertical Line -->
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
              ></div>

              <!-- Step Items -->
              <div class="space-y-12">
                <!-- 01: Create List -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-green-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-green-100"
                    >
                      <span class="text-green-600 font-bold text-sm">01</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-green-50 rounded-xl text-green-600">
                          <i class="bi bi-people text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Tạo Danh Sách Khách Hàng
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Thiết lập danh sách email đầu tiên
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Bắt buộc
                      </span>
                    </div>
                    <div class="space-y-4">
                      <div
                        class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <span
                          class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold"
                          >1</span
                        >
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Vào mục Danh Sách
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Từ sidebar chọn "Danh Sách Khách Hàng"
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <span
                          class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold"
                          >2</span
                        >
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Tạo danh sách mới
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Nhấn nút "Tạo Danh Sách Mới"
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <span
                          class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold"
                          >3</span
                        >
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Điền thông tin & Lưu
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Nhập tên, mô tả rồi nhấn "Lưu"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Import Contacts -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">02</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                          <i class="bi bi-person-plus text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Nhập Khách Hàng
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Thêm khách hàng vào danh sách
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-blue-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Bắt buộc
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div
                        class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center hover:bg-emerald-100 transition-colors"
                      >
                        <i
                          class="bi bi-file-earmark-excel text-2xl text-emerald-600 mb-2 block"
                        ></i>
                        <h4 class="font-semibold text-blue-900 text-sm">
                          Import Excel
                        </h4>
                        <p class="text-xs text-blue-700 mt-1">.xlsx, .xls</p>
                      </div>
                      <div
                        class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center hover:bg-emerald-100 transition-colors"
                      >
                        <i
                          class="bi bi-keyboard text-2xl text-emerald-600 mb-2 block"
                        ></i>
                        <h4 class="font-semibold text-emerald-900 text-sm">
                          Nhập Thủ Công
                        </h4>
                        <p class="text-xs text-teal-700 mt-1">
                          Từng khách hàng
                        </p>
                      </div>
                      <div
                        class="p-4 rounded-xl bg-green-50 border border-green-100 text-center hover:bg-green-100 transition-colors"
                      >
                        <i
                          class="bi bi-clipboard text-2xl text-green-600 mb-2 block"
                        ></i>
                        <h4 class="font-semibold text-green-900 text-sm">
                          Copy & Paste
                        </h4>
                        <p class="text-xs text-green-700 mt-1">Từ file khác</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Custom Fields -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">03</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-input-cursor-text text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Trường Tùy Chỉnh
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Thêm thông tin cá nhân hóa
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Tùy chọn
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        class="bg-emerald-50 rounded-xl p-5 border border-emerald-100"
                      >
                        <h3
                          class="font-semibold text-emerald-900 mb-3 flex items-center gap-2"
                        >
                          <i class="bi bi-plus-circle"></i> Tạo Trường Mới
                        </h3>
                        <ul class="space-y-2 text-emerald-800 text-sm">
                          <li class="flex items-start gap-2">
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span><strong>Tên:</strong> Tên hiển thị</span>
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span
                              ><strong>Key:</strong> Mã định danh duy nhất</span
                            >
                          </li>
                          <li class="flex items-start gap-2">
                            <i class="bi bi-check2 mt-0.5"></i>
                            <span
                              ><strong>Loại:</strong> Text, Number,
                              Date...</span
                            >
                          </li>
                        </ul>
                      </div>
                      <div
                        class="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm"
                      >
                        <h3
                          class="font-semibold text-emerald-900 mb-3 flex items-center gap-2"
                        >
                          <i class="bi bi-code-slash"></i> Sử Dụng (Merge Tags)
                        </h3>
                        <div class="flex flex-wrap gap-2">
                          <span
                            class="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600"
                            >{'{{ firstName }}'}</span
                          >
                          <span
                            class="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600"
                            >{'{{ lastName }}'}</span
                          >
                          <span
                            class="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600"
                            >{'{{ email }}'}</span
                          >
                          <span
                            class="px-2 py-1 bg-emerald-100 rounded text-xs font-mono text-teal-700 border border-teal-200"
                            >{'{{ customKey }}'}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 04: Cloudinary Configuration -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">04</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                          <i class="bi bi-cloud-arrow-up text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Cấu Hình Cloudinary
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Thiết lập lưu trữ ảnh chuyên nghiệp
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-blue-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Khuyến nghị
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div
                        class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <span
                          class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          >1</span
                        >
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            Đăng ký tài khoản
                          </p>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Tại
                            <a
                              href="https://cloudinary.com"
                              target="_blank"
                              class="text-emerald-600 hover:underline"
                              >cloudinary.com</a
                            >
                            (miễn phí)
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <span
                          class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          >2</span
                        >
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            Lấy API Key
                          </p>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Dashboard &rarr; Create API Key
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <span
                          class="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          >3</span
                        >
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            Cấu hình Enterprise Meeting
                          </p>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Danh sách &rarr; Cloudinary Config &rarr; Nhập Key
                          </p>
                        </div>
                      </div>

                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2"
                        >
                          <i class="bi bi-star-fill text-emerald-500"></i> Lợi ích
                        </h4>
                        <div
                          class="grid grid-cols-2 gap-2 text-xs text-blue-800"
                        >
                          <span class="flex items-center gap-1"
                            ><i class="bi bi-check2"></i> CDN toàn cầu</span
                          >
                          <span class="flex items-center gap-1"
                            ><i class="bi bi-check2"></i> Tự động tối ưu</span
                          >
                          <span class="flex items-center gap-1"
                            ><i class="bi bi-check2"></i> Bảo mật cao</span
                          >
                          <span class="flex items-center gap-1"
                            ><i class="bi bi-check2"></i> Quản lý dễ dàng</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 05: Add Image Field -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">05</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-image text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Thêm Trường Image
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Tùy chỉnh trường thông tin cho subscriber
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Tùy chọn
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div class="flex items-start gap-3">
                        <i
                          class="bi bi-arrow-return-right text-purple-400 mt-1"
                        ></i>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            1. Vào Custom Fields
                          </p>
                          <p class="text-xs text-gray-500">
                            Tab "Custom Fields" &rarr; "Thêm Field Mới"
                          </p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <i
                          class="bi bi-arrow-return-right text-purple-400 mt-1"
                        ></i>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            2. Cấu hình
                          </p>
                          <p class="text-xs text-gray-500">
                            Loại: "Image", Key: "avatar"
                          </p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <i
                          class="bi bi-arrow-return-right text-purple-400 mt-1"
                        ></i>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            3. Sử dụng
                          </p>
                          <p class="text-xs text-gray-500">
                            Nút "Choose from Library" xuất hiện khi thêm
                            subscriber
                          </p>
                        </div>
                      </div>

                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-xs text-emerald-800"
                      >
                        <strong>Mẹo:</strong> Sử dụng ảnh đại diện giúp email cá
                        nhân hóa hơn và tăng tỷ lệ tương tác.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 06: Unsubscribe Link -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-amber-100"
                    >
                      <span class="text-amber-600 font-bold text-sm">06</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-amber-50 rounded-xl text-amber-600">
                          <i class="bi bi-link-45deg text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Link Hủy Đăng Ký
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Quản lý unsubscribe link tự động
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Quan trọng
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div
                        class="bg-amber-50 rounded-xl p-4 border border-amber-100"
                      >
                        <h4
                          class="font-semibold text-amber-900 mb-2 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-check-circle-fill"></i>
                          Tự Động Thêm Vào Email
                        </h4>
                        <p class="text-sm text-amber-800 mb-3">
                          Hệ thống tự động thêm link hủy đăng ký vào cuối mỗi
                          email. Sử dụng dynamic field:
                        </p>
                        <div
                          class="bg-white rounded p-2 font-mono text-xs text-amber-700 border border-amber-200 w-fit"
                        >
                          {'{{ unsubscribeLink }}'}
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          class="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        >
                          <h4 class="font-semibold text-gray-900 text-sm mb-2">
                            Cấu Hình
                          </h4>
                          <ul class="space-y-2 text-xs text-gray-600">
                            <li>• Tùy chỉnh thông báo</li>
                            <li>• Redirect URL</li>
                            <li>• Confirmation page</li>
                          </ul>
                        </div>
                        <div
                          class="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        >
                          <h4 class="font-semibold text-gray-900 text-sm mb-2">
                            Best Practices
                          </h4>
                          <ul class="space-y-2 text-xs text-gray-600">
                            <li>• Đặt ở footer</li>
                            <li>• Không yêu cầu login</li>
                            <li>• Xử lý ngay lập tức</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Campaigns Tab -->
          <div v-if="activeTab === 'campaigns'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <!-- Vertical Line -->
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
              ></div>

              <!-- Step Items -->
              <div class="space-y-12">
                <!-- 01: Create Campaign -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-indigo-100"
                    >
                      <span class="text-teal-600 font-bold text-sm">01</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-teal-50 rounded-xl text-teal-600"
                        >
                          <i class="bi bi-send text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Tạo Chiến Dịch Email
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Gửi email hàng loạt cho danh sách khách hàng
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Quan trọng
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                        <div
                          class="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <div
                            class="flex items-center gap-2 font-semibold text-gray-900 text-sm"
                          >
                            <span
                              class="w-6 h-6 bg-indigo-100 text-teal-600 rounded-full flex items-center justify-center text-xs"
                              >1</span
                            >
                            Chọn Template
                          </div>
                          <p class="text-xs text-gray-500 pl-8">
                            Sử dụng template có sẵn hoặc tự thiết kế.
                          </p>
                        </div>
                        <div
                          class="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <div
                            class="flex items-center gap-2 font-semibold text-gray-900 text-sm"
                          >
                            <span
                              class="w-6 h-6 bg-indigo-100 text-teal-600 rounded-full flex items-center justify-center text-xs"
                              >2</span
                            >
                            Chọn Danh Sách
                          </div>
                          <p class="text-xs text-gray-500 pl-8">
                            Lọc theo segments hoặc gửi toàn bộ.
                          </p>
                        </div>
                        <div
                          class="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <div
                            class="flex items-center gap-2 font-semibold text-gray-900 text-sm"
                          >
                            <span
                              class="w-6 h-6 bg-indigo-100 text-teal-600 rounded-full flex items-center justify-center text-xs"
                              >3</span
                            >
                            Cấu Hình
                          </div>
                          <p class="text-xs text-gray-500 pl-8">
                            Tiêu đề, Email gửi, tracking options.
                          </p>
                        </div>
                        <div
                          class="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <div
                            class="flex items-center gap-2 font-semibold text-gray-900 text-sm"
                          >
                            <span
                              class="w-6 h-6 bg-indigo-100 text-teal-600 rounded-full flex items-center justify-center text-xs"
                              >4</span
                            >
                            Gửi Test
                          </div>
                          <p class="text-xs text-gray-500 pl-8">
                            Gửi thử cho bản thân để kiểm tra hiển thị.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Schedule & Send -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-green-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-green-100"
                    >
                      <span class="text-green-600 font-bold text-sm">02</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-green-50 rounded-xl text-green-600">
                          <i class="bi bi-clock-history text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Gửi & Lên Lịch
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Tùy chọn thời gian gửi thông minh
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-send-check"></i>
                          Gửi Ngay
                        </h4>
                        <p class="text-xs text-blue-800">
                          Email sẽ được đưa vào hàng đợi và gửi đi ngay lập tức.
                          Phù hợp cho tin tức nóng hổi.
                        </p>
                      </div>
                      <div
                        class="bg-orange-50 rounded-xl p-4 border border-orange-100"
                      >
                        <h4
                          class="font-semibold text-orange-900 mb-2 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-calendar-event"></i>
                          Lên Lịch
                        </h4>
                        <p class="text-xs text-orange-800">
                          Chọn ngày và giờ cụ thể trong tương lai. Hệ thống sẽ
                          tự động gửi đúng giờ.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Analytics -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">03</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-bar-chart-line text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Báo Cáo Hiệu Quả
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Theo dõi real-time metrics
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Analytics
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div
                          class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center"
                        >
                          <div class="text-lg font-bold text-emerald-600 mb-1">
                            Open
                          </div>
                          <div class="text-xs text-gray-500">Tỷ lệ mở mail</div>
                        </div>
                        <div
                          class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center"
                        >
                          <div class="text-lg font-bold text-green-600 mb-1">
                            Click
                          </div>
                          <div class="text-xs text-gray-500">
                            Tỷ lệ click link
                          </div>
                        </div>
                        <div
                          class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center"
                        >
                          <div class="text-lg font-bold text-red-600 mb-1">
                            Bounce
                          </div>
                          <div class="text-xs text-gray-500">
                            Email hỏng/sai
                          </div>
                        </div>
                        <div
                          class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center"
                        >
                          <div class="text-lg font-bold text-orange-600 mb-1">
                            Unsub
                          </div>
                          <div class="text-xs text-gray-500">Hủy đăng ký</div>
                        </div>
                      </div>

                      <div
                        class="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg"
                      >
                        <i class="bi bi-info-circle"></i>
                        Báo cáo được cập nhật liên tục mỗi khi có tương tác mới.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Templates Tab -->
          <div v-if="activeTab === 'templates'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <!-- Vertical Line -->
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
              ></div>

              <!-- Step Items -->
              <div class="space-y-12">
                <!-- 01: Template Library -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-indigo-100"
                    >
                      <span class="text-teal-600 font-bold text-sm">01</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-teal-50 rounded-xl text-teal-600"
                        >
                          <i class="bi bi-grid text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Thư Viện Mẫu
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Khám phá và sử dụng các mẫu email có sẵn
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Bắt buộc
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        class="p-4 rounded-xl bg-teal-50 border border-indigo-100 group hover:bg-indigo-100 transition-colors"
                      >
                        <i
                          class="bi bi-collection text-2xl text-teal-600 mb-2 block group-hover:scale-110 transition-transform"
                        ></i>
                        <h4 class="font-semibold text-indigo-900 text-sm">
                          Mẫu Đa Dạng
                        </h4>
                        <p class="text-xs text-indigo-700 mt-1">
                          Nhiều chủ đề: Newsletter, Sales, Welcome...
                        </p>
                      </div>
                      <div
                        class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 group hover:bg-emerald-100 transition-colors"
                      >
                        <i
                          class="bi bi-eye text-2xl text-emerald-600 mb-2 block group-hover:scale-110 transition-transform"
                        ></i>
                        <h4 class="font-semibold text-emerald-900 text-sm">
                          Xem Trước
                        </h4>
                        <p class="text-xs text-teal-700 mt-1">
                          Preview trên nhiều thiết bị trước khi chọn
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Drag & Drop Builder -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-orange-100"
                    >
                      <span class="text-orange-600 font-bold text-sm">02</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-orange-50 rounded-xl text-orange-600"
                        >
                          <i class="bi bi-tools text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Email Builder
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Tùy chỉnh mẫu email dễ dàng
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Tính năng chính
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          <i class="bi bi-arrows-move"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Kéo & Thả
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Kéo thả các khối nội dung (Text, Image, Button...)
                            vào vị trí mong muốn.
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          <i class="bi bi-pencil-square"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Chỉnh Sửa Trực Tiếp
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Click vào bất kỳ phần tử nào để chỉnh sửa nội dung,
                            màu sắc, font chữ.
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          <i class="bi bi-image"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Quản Lý Ảnh
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Upload và quản lý thư viện ảnh, hỗ trợ Cloudinary.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Save & Reuse -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">03</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-save text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Lưu & Tái Sử Dụng
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Quản lý các thiết kế của bạn
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Hoàn tất
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        class="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-center"
                      >
                        <h4 class="font-bold text-emerald-900 text-sm mb-1">
                          Lưu Template
                        </h4>
                        <p class="text-xs text-emerald-700">
                          Lưu lại thiết kế để sử dụng cho các chiến dịch sau
                          này.
                        </p>
                      </div>
                      <div
                        class="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-center"
                      >
                        <h4 class="font-bold text-emerald-900 text-sm mb-1">
                          Duplicate
                        </h4>
                        <p class="text-xs text-emerald-700">
                          Dễ dàng nhân bản template để tạo biến thể mới.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Tab -->
          <div v-if="activeTab === 'faq'" class="px-4 sm:px-6 py-2">
            <div class="max-w-3xl mx-auto space-y-4">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                :data-aos-delay="Math.min(index * 50, 300)"
              >
                <button
                  @click="toggleFaq(index)"
                  class="w-full px-6 py-5 text-left flex items-center justify-between bg-white group-hover:bg-gray-50/50 transition-colors"
                >
                  <span
                    class="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors"
                    >{{ faq.question }}</span
                  >
                  <span
                    class="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors"
                  >
                    <i
                      :class="
                        openFaqs.includes(index) ? 'bi bi-dash' : 'bi bi-plus'
                      "
                      class="text-xl text-gray-500 group-hover:text-emerald-600 transition-colors"
                    ></i>
                  </span>
                </button>
                <div
                  v-if="openFaqs.includes(index)"
                  class="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50"
                >
                  <div
                    class="prose prose-sm max-w-none pt-4"
                    v-html="faq.answer"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Meeting Booking Tab -->
          <div v-if="activeTab === 'meeting-booking'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 via-teal-200 to-lime-200"
              ></div>
              <div class="space-y-12">
                <!-- 01: Giao Diện Chính -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">01</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div
                        class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                      >
                        <i class="bi bi-calendar3 text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Giao Diện Lịch Họp
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Tổng quan về lịch đặt phòng họp
                        </p>
                      </div>
                      <span
                        class="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full hidden sm:inline-block"
                        >Tổng quan</span
                      >
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div
                        v-for="view in [
                          {
                            icon: 'bi-calendar-day',
                            label: 'Timeline Day',
                            desc: 'Theo phòng/giờ',
                          },
                          {
                            icon: 'bi-calendar2',
                            label: 'Day',
                            desc: 'Theo ngày',
                          },
                          {
                            icon: 'bi-calendar-week',
                            label: 'Week',
                            desc: 'Theo tuần',
                          },
                          {
                            icon: 'bi-calendar-month',
                            label: 'Month',
                            desc: 'Theo tháng',
                          },
                        ]"
                        :key="view.label"
                        class="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                      >
                        <i
                          :class="[
                            'bi',
                            view.icon,
                            'text-2xl text-emerald-600 mb-2 block group-hover:scale-110 transition-transform',
                          ]"
                        ></i>
                        <h4 class="font-semibold text-emerald-900 text-xs">
                          {{ view.label }}
                        </h4>
                        <p class="text-xs text-emerald-700 mt-1">
                          {{ view.desc }}
                        </p>
                      </div>
                    </div>
                    <div
                      class="mt-4 flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100"
                    >
                      <i
                        class="bi bi-arrow-clockwise text-teal-500 text-xl mt-0.5"
                      ></i>
                      <div>
                        <h4 class="font-bold text-teal-900 text-sm">
                          Nút Sync
                        </h4>
                        <p class="text-xs text-teal-700 mt-0.5">
                          Nhấn <strong>Sync</strong> ở góc trên trái để tải dữ
                          liệu mới nhất. Dữ liệu cũng tự cập nhật realtime qua
                          Socket.io khi người khác tạo/sửa lịch họp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Tạo Cuộc Họp Mới -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-teal-600 font-bold text-sm">02</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div class="p-3 bg-teal-50 rounded-xl text-teal-600">
                        <i class="bi bi-plus-circle text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Tạo Cuộc Họp Mới
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Mở form đặt lịch họp
                        </p>
                      </div>
                      <span
                        class="ml-auto px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full hidden sm:inline-block"
                        >Bắt buộc</span
                      >
                    </div>
                    <div class="space-y-3">
                      <div
                        v-for="(step, i) in [
                          {
                            num: '1',
                            title: 'Click vào ô thời gian',
                            desc: 'Trong chế độ Week/Day, click và kéo trên lịch để chọn khung giờ — form tạo lịch sẽ tự mở.',
                          },
                          {
                            num: '2',
                            title: 'Nhấn nút New Booking',
                            desc: 'Hoặc click vào vùng trống trên lịch để mở popup chọn thời gian và tạo booking mới.',
                          },
                          {
                            num: '3',
                            title: 'Điền thông tin & Lưu',
                            desc: 'Hoàn thành tất cả các trường bắt buộc rồi nhấn Save để xác nhận đặt phòng.',
                          },
                        ]"
                        :key="i"
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-teal-200 transition-colors group"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:bg-teal-200 transition-colors"
                        >
                          {{ step.num }}
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            {{ step.title }}
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            {{ step.desc }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Thông Tin Cuộc Họp -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-lime-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-lime-100"
                    >
                      <span class="text-lime-700 font-bold text-sm">03</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-lime-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div class="p-3 bg-lime-50 rounded-xl text-lime-700">
                        <i class="bi bi-card-text text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Điền Thông Tin Cuộc Họp
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Các trường cần nhập trong form đặt lịch
                        </p>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        v-for="field in [
                          {
                            icon: 'bi-pencil',
                            color: 'emerald',
                            label: 'Meeting Title',
                            desc: 'Tiêu đề cuộc họp (bắt buộc). Hiển thị trên lịch và email thông báo.',
                          },
                          {
                            icon: 'bi-building',
                            color: 'teal',
                            label: 'Area (Khu vực)',
                            desc: 'Chọn khu vực làm việc. Danh sách phòng sẽ lọc theo khu vực được chọn.',
                          },
                          {
                            icon: 'bi-door-open',
                            color: 'lime',
                            label: 'Conference Room',
                            desc: 'Phòng họp trong khu vực đã chọn. Phòng bận hiện dấu 🔒 và bị vô hiệu hoá.',
                          },
                          {
                            icon: 'bi-clock',
                            color: 'emerald',
                            label: 'Start / End Time',
                            desc: 'Thời gian bắt đầu và kết thúc. Dùng datetime picker để chọn nhanh.',
                          },
                        ]"
                        :key="field.label"
                        class="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-200 transition-colors"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            `bg-${field.color}-100 text-${field.color}-600`,
                          ]"
                        >
                          <i :class="['bi', field.icon, 'text-sm']"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            {{ field.label }}
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            {{ field.desc }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 04: Chọn Người Tham Dự -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">04</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div
                        class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                      >
                        <i class="bi bi-people text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Chọn Người Tham Dự
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Mời thành viên trong hệ thống và bên ngoài
                        </p>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div
                        class="p-5 rounded-xl bg-emerald-50 border border-emerald-100"
                      >
                        <h4
                          class="font-semibold text-emerald-900 mb-3 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-person-check-fill"></i> Participants
                          (nội bộ)
                        </h4>
                        <p class="text-xs text-emerald-800 mb-3">
                          Danh sách người dùng trong hệ thống hiển thị dạng pill
                          button. Click để chọn/bỏ chọn:
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            class="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 text-white shadow-sm flex items-center gap-1.5"
                          >
                            <i class="bi bi-check-circle-fill"></i>
                            user@company.com
                          </span>
                          <span
                            class="px-3 py-1.5 text-xs font-bold rounded-full border border-emerald-200 text-emerald-700 flex items-center gap-1.5"
                          >
                            <i class="bi bi-person"></i> other@company.com
                          </span>
                        </div>
                        <p class="text-xs text-emerald-700 mt-2">
                          ✦ Người được chọn có nền gradient emerald → teal →
                          lime
                        </p>
                      </div>
                      <div
                        class="p-5 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <h4
                          class="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm"
                        >
                          <i class="bi bi-envelope-at text-teal-500"></i> CC
                          ngoài hệ thống
                        </h4>
                        <p class="text-xs text-gray-600">
                          Nhập email ngoài (cách nhau bằng dấu phẩy) vào ô
                          <strong>CC ngoài hệ thống</strong>. Những người này sẽ
                          nhận email thông báo cuộc họp.
                        </p>
                        <div
                          class="mt-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-400 font-mono"
                        >
                          check@gmail.com, guest@partner.com, ...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 05: IT Support -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-teal-600 font-bold text-sm">05</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div class="p-3 bg-teal-50 rounded-xl text-teal-600">
                        <i class="bi bi-headset text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Yêu Cầu Hỗ Trợ IT
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Đăng ký hỗ trợ kỹ thuật cho cuộc họp
                        </p>
                      </div>
                      <span
                        class="ml-auto px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full hidden sm:inline-block"
                        >Tuỳ chọn</span
                      >
                    </div>
                    <div
                      class="p-5 rounded-xl bg-linear-to-r from-emerald-50 via-teal-50 to-lime-50 border border-emerald-100"
                    >
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                          <i class="bi bi-headset text-teal-500"></i>
                          <span
                            class="text-xss font-black text-emerald-700 uppercase tracking-widest text-xs"
                            >Need IT Support?</span
                          >
                        </div>
                        <div
                          class="w-9 h-5 bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 rounded-full relative flex items-center px-0.5"
                        >
                          <div
                            class="w-4 h-4 bg-white rounded-full shadow ml-auto"
                          ></div>
                        </div>
                      </div>
                      <p class="text-xs text-emerald-800">
                        Bật toggle <strong>Need IT Support?</strong> nếu cuộc
                        họp cần hỗ trợ thiết bị (máy chiếu, âm thanh, kết
                        nối...). Bộ phận IT sẽ được thông báo tự động qua email.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 06: Phát Hiện Xung Đột Realtime -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-lime-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-lime-100"
                    >
                      <span class="text-lime-700 font-bold text-sm">06</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-lime-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div class="p-3 bg-lime-50 rounded-xl text-lime-700">
                        <i class="bi bi-lightning-charge text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Phát Hiện Xung Đột Realtime
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Hệ thống ngăn 2 người đặt cùng phòng cùng giờ
                        </p>
                      </div>
                      <span
                        class="ml-auto px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full hidden sm:inline-block"
                        >Quan trọng</span
                      >
                    </div>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center"
                        >
                          <i
                            class="bi bi-database-check text-2xl text-emerald-600 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-emerald-900 text-xs">
                            Backend Layer
                          </h4>
                          <p class="text-xs text-emerald-700 mt-1">
                            Kiểm tra atomic tại DB khi lưu
                          </p>
                        </div>
                        <div
                          class="p-4 rounded-xl bg-teal-50 border border-teal-100 text-center"
                        >
                          <i
                            class="bi bi-broadcast text-2xl text-teal-600 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-teal-900 text-xs">
                            Realtime Layer
                          </h4>
                          <p class="text-xs text-teal-700 mt-1">
                            Socket.io broadcast draft đang mở
                          </p>
                        </div>
                        <div
                          class="p-4 rounded-xl bg-lime-50 border border-lime-100 text-center"
                        >
                          <i
                            class="bi bi-ui-checks text-2xl text-lime-700 mb-2 block"
                          ></i>
                          <h4 class="font-semibold text-lime-900 text-xs">
                            Frontend Layer
                          </h4>
                          <p class="text-xs text-lime-700 mt-1">
                            Phòng bận bị lock ngay trên UI
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100"
                      >
                        <i
                          class="bi bi-exclamation-triangle-fill text-amber-500 text-xl mt-0.5 flex-shrink-0"
                        ></i>
                        <div>
                          <h4 class="font-bold text-amber-900 text-sm">
                            Phòng hiện dấu 🔒
                          </h4>
                          <p class="text-xs text-amber-800 mt-0.5">
                            Khi phòng đã có lịch hoặc người khác đang soạn draft
                            trong cùng khung giờ, phòng đó sẽ bị disable kèm
                            nhãn <em>(Đang bận)</em>. Hệ thống tự chuyển sang
                            phòng trống khác nếu có.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 07: Xem Analytics -->
                <div class="relative pl-24">
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-emerald-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">07</span>
                    </div>
                  </div>
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300"
                  >
                    <div class="flex items-start gap-4 mb-6">
                      <div
                        class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                      >
                        <i class="bi bi-bar-chart-line text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">
                          Xem Thống Kê Analytics
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                          Chuyển tab Analytics để xem báo cáo cuộc họp
                        </p>
                      </div>
                      <span
                        class="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full hidden sm:inline-block"
                        >Analytics</span
                      >
                    </div>
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div
                          v-for="stat in [
                            {
                              label: 'Tổng cuộc họp',
                              icon: 'bi-calendar-check',
                              color: 'emerald',
                            },
                            {
                              label: 'Số phòng sử dụng',
                              icon: 'bi-door-open',
                              color: 'teal',
                            },
                            {
                              label: 'Tổng thời lượng',
                              icon: 'bi-clock',
                              color: 'lime',
                            },
                            {
                              label: 'Trung bình/ngày',
                              icon: 'bi-bar-chart',
                              color: 'emerald',
                            },
                          ]"
                          :key="stat.label"
                          class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center hover:border-emerald-200 transition-colors"
                        >
                          <i
                            :class="[
                              'bi',
                              stat.icon,
                              `text-${stat.color}-500`,
                              'text-xl mb-1 block',
                            ]"
                          ></i>
                          <div class="text-xs text-gray-500">
                            {{ stat.label }}
                          </div>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          class="p-4 rounded-xl bg-emerald-50 border border-emerald-100"
                        >
                          <h4
                            class="font-semibold text-emerald-900 mb-2 flex items-center gap-2 text-sm"
                          >
                            <i class="bi bi-bar-chart-fill"></i> Tần suất đặt
                            lịch
                          </h4>
                          <p class="text-xs text-emerald-800">
                            Biểu đồ cột theo ngày trong tuần — so sánh tuần này
                            vs tuần trước.
                          </p>
                        </div>
                        <div
                          class="p-4 rounded-xl bg-teal-50 border border-teal-100"
                        >
                          <h4
                            class="font-semibold text-teal-900 mb-2 flex items-center gap-2 text-sm"
                          >
                            <i class="bi bi-pie-chart-fill"></i> Phân bổ phòng
                            họp
                          </h4>
                          <p class="text-xs text-teal-800">
                            Biểu đồ tròn (Doughnut) thể hiện tỷ lệ sử dụng từng
                            phòng họp trong tuần.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HR & Employee Hub Tab (removed - not in source) -->
          <!-- Cloud Storage Tab (removed - not in source) -->

          <!-- Support Tab -->
          <div v-if="activeTab === 'support'" class="px-4 sm:px-6 py-2">
            <div class="relative max-w-4xl mx-auto">
              <!-- Vertical Line -->
              <div
                class="absolute left-8 top-0 bottom-0 w-px bg-gray-200"
              ></div>

              <!-- Step Items -->
              <div class="space-y-12">
                <!-- 01: Create Ticket -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-red-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-red-100"
                    >
                      <span class="text-red-600 font-bold text-sm">01</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-red-50 rounded-xl text-red-600">
                          <i class="bi bi-ticket-perforated text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Tạo Ticket Hỗ Trợ
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Gửi yêu cầu hỗ trợ tới đội ngũ kỹ thuật
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Ưu tiên
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div
                          class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <i class="bi bi-bug text-red-500 mt-1"></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Báo Lỗi (Bug)
                            </h4>
                            <p class="text-xs text-gray-500">
                              Các lỗi kỹ thuật gặp phải.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <i class="bi bi-lightbulb text-amber-500 mt-1"></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Tính Năng Mới
                            </h4>
                            <p class="text-xs text-gray-500">
                              Đề xuất cải tiến hệ thống.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <i
                            class="bi bi-question-circle text-emerald-500 mt-1"
                          ></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Câu Hỏi
                            </h4>
                            <p class="text-xs text-gray-500">
                              Thắc mắc về cách sử dụng.
                            </p>
                          </div>
                        </div>
                        <div
                          class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <i class="bi bi-three-dots text-gray-500 mt-1"></i>
                          <div>
                            <h4 class="font-bold text-gray-900 text-sm">
                              Khác
                            </h4>
                            <p class="text-xs text-gray-500">
                              Các vấn đề khác.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        class="flex items-center gap-2 text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100"
                      >
                        <i class="bi bi-info-circle text-red-500"></i>
                        Hãy mô tả chi tiết vấn đề để được hỗ trợ nhanh nhất.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 02: Track Ticket -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-blue-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">02</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                          <i class="bi bi-kanban text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Theo Dõi Trạng Thái
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Cập nhật tiến độ xử lý yêu cầu
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-blue-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Quy trình
                      </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        class="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center"
                      >
                        <i
                          class="bi bi-clock-history text-2xl text-yellow-600 mb-2 block"
                        ></i>
                        <h4 class="font-bold text-yellow-900 text-sm mb-1">
                          Đang Chờ
                        </h4>
                        <p class="text-xs text-yellow-700">
                          Ticket mới tạo, chưa được tiếp nhận.
                        </p>
                      </div>
                      <div
                        class="bg-emerald-50 rounded-xl p-4 border border-blue-200 text-center"
                      >
                        <i
                          class="bi bi-gear-wide-connected text-2xl text-emerald-600 mb-2 block"
                        ></i>
                        <h4 class="font-bold text-blue-900 text-sm mb-1">
                          Đang Xử Lý
                        </h4>
                        <p class="text-xs text-blue-700">
                          Đội ngũ kỹ thuật đang làm việc.
                        </p>
                      </div>
                      <div
                        class="bg-green-50 rounded-xl p-4 border border-green-200 text-center"
                      >
                        <i
                          class="bi bi-check-circle-fill text-2xl text-green-600 mb-2 block"
                        ></i>
                        <h4 class="font-bold text-green-900 text-sm mb-1">
                          Đã Giải Quyết
                        </h4>
                        <p class="text-xs text-green-700">
                          Vấn đề đã được xử lý xong.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 03: Realtime Updates -->
                <div class="relative pl-24">
                  <!-- Marker -->
                  <div class="absolute left-0 w-16 flex justify-center">
                    <div
                      class="w-10 h-10 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center z-10 shadow-sm shadow-teal-100"
                    >
                      <span class="text-emerald-600 font-bold text-sm">03</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <div
                          class="p-3 bg-emerald-50 rounded-xl text-emerald-600"
                        >
                          <i class="bi bi-chat-dots text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-gray-900">
                            Trao Đổi Trực Tiếp
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Tương tác với đội ngũ hỗ trợ
                          </p>
                        </div>
                      </div>
                      <span
                        class="px-3 py-1 bg-emerald-100 text-teal-700 text-xs font-semibold rounded-full w-fit self-start sm:self-center"
                      >
                        Realtime
                      </span>
                    </div>

                    <div class="space-y-4">
                      <div
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          <i class="bi bi-bell"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Thông Báo
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Nhận thông báo ngay lập tức khi có phản hồi mới.
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        >
                          <i class="bi bi-chat-square-text"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 text-sm">
                            Bình Luận
                          </h4>
                          <p class="text-xs text-gray-500 mt-0.5">
                            Trao đổi thêm thông tin, đính kèm ảnh chụp màn hình
                            ngay trong ticket.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import Cookies from "js-cookie";

const authStore = useAuthStore();

// Dynamically set layout based on auth status
const isAuthenticated = computed(() => {
  return !!(authStore.accessToken || Cookies.get("accessToken"));
});

definePageMeta({
  layout: false, // We'll handle layout dynamically
  auth: false,
});

// Set layout dynamically
const layout = computed(() => (isAuthenticated.value ? "default" : "blank"));



const activeSection = ref("customer-list");
const openFaqs = ref([]);
const contentRef = ref(null);

const faqs = [
  // Meeting Booking FAQs
  {
    question: "Làm thế nào để đặt lịch họp mới?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-calendar-plus text-emerald-500 mr-2"></i>Có 2 cách để tạo lịch họp:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-cursor-fill text-teal-500 mr-2 "></i><strong class="text-gray-900">Cách 1:</strong> Click và kéo trực tiếp trên lịch (Calendar) để chọn khung giờ.</li><li><i class="bi bi-plus-circle text-teal-500 mr-2 "></i><strong class="text-gray-900">Cách 2:</strong> Nhấn vào vùng trống bất kỳ trên lịch để mở form "New Booking".</li></ul><p class="leading-relaxed mt-3">Sau đó điền Tiêu đề, chọn Khu vực/Phòng, chọn Người tham dự và nhấn <strong>Save</strong>.</p></div>',
  },
  {
    question: "Dấu khóa (🔒) hiển thị trên phòng họp nghĩa là gì?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-lock-fill text-amber-500 mr-2"></i>Biểu tượng 🔒 xuất hiện khi phòng đó đang không sẵn sàng:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-slash-circle text-red-500 mr-2 "></i><strong class="text-gray-900">Đã có lịch:</strong> Phòng đã được người khác đặt trong khung giờ bạn chọn.</li><li><i class="bi bi-broadcast text-teal-500 mr-2 "></i><strong class="text-gray-900">Đang soạn thảo:</strong> Có người khác đang mở form đặt phòng này (Real-time collision detection).</li></ul><p class="leading-relaxed mt-3">Hệ thống sẽ tự động vô hiệu hóa (disable) các phòng này để tránh trùng lịch.</p></div>',
  },
  {
    question: "Làm thế nào để yêu cầu hỗ trợ IT cho cuộc họp?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-headset text-emerald-500 mr-2"></i>Trong form đặt lịch họp:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-toggle-on text-teal-500 mr-2 "></i>Bật tính năng <strong class="text-gray-900">"Need IT Support?"</strong>.</li><li><i class="bi bi-info-circle text-teal-500 mr-2 "></i>Hệ thống sẽ tự động gửi email thông báo cho đội ngũ kỹ thuật kèm theo thông tin phòng và thời gian họp của bạn.</li></ul></div>',
  },
  {
    question: "Tôi có thể mời người bên ngoài công ty tham gia không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-person-plus text-emerald-500 mr-2"></i>Hoàn toàn được!</p><ul class="space-y-2 ml-4"><li>Sử dụng ô <strong class="text-gray-900">"CC ngoài hệ thống"</strong> trong form đặt lịch.</li><li>Nhập danh sách email (cách nhau bằng dấu phẩy). Hệ thống sẽ gửi email thư mời kèm file lịch (.ics) để họ có thể lưu vào Google Calendar hoặc Outlook.</li></ul></div>',
  },
  {
    question: "Làm thế nào để thay đổi hoặc hủy lịch họp?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-pencil-square text-emerald-500 mr-2"></i>Thao tác chỉnh sửa:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-check-lg text-teal-500 mr-2 "></i>Click vào sự kiện đã đặt trên lịch để mở lại form thông tin.</li><li><i class="bi bi-trash text-red-500 mr-2 "></i>Nhấn <strong>Delete</strong> để hủy lịch hoặc thay đổi thông tin rồi nhấn <strong>Save</strong> để cập nhật.</li></ul></div>',
  },

  // Email Sending & Limits
  {
    question: "Tôi có thể gửi bao nhiêu email mỗi tháng?",
    answer:
      '<div class="space-y-3. text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-envelope-paper text-emerald-500 mr-2"></i>Số lượng email phụ thuộc vào gói dịch vụ và giới hạn của nhà cung cấp SMTP:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-check-circle text-green-500 mr-2 "></i><strong class="text-gray-900">Gói miễn phí:</strong> <span class="text-gray-600">Gmail (500/ngày), SMTP tùy chỉnh (tùy provider)</span></li><li><i class="bi bi-star text-yellow-500 mr-2 "></i><strong class="text-gray-900">Các gói trả phí:</strong> <span class="text-gray-600">Giới hạn cao hơn theo gói</span></li></ul><p class="leading-relaxed mt-3"><i class="bi bi-bell text-orange-500 mr-2"></i>Hệ thống tự động theo dõi quota và cảnh báo khi gần đạt giới hạn.</p></div>',
  },

  {
    question: "Làm thế nào để tránh email bị vào spam?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-shield-exclamation text-red-500 mr-2"></i>Để tránh spam filter:</p><ol class="space-y-2 ml-4 text-gray-600"><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">01</span>Luôn có link hủy đăng ký rõ ràng</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">02</span>Sử dụng địa chỉ email xác thực với SPF/DKIM</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">03</span>Gửi với tần suất hợp lý, không spam</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">04</span>Nội dung email có giá trị, không chứa từ khóa spam</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">05</span>Tránh attachment lớn</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">06</span>Warm-up email mới dần dần</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">07</span>Duy trì engagement rate cao</li><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">08</span>Xóa email bounce và invalid</li></ol></div>',
  },

  // Tracking & Analytics
  {
    question: "Làm thế nào để theo dõi lượt mở và nhấp chuột?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-graph-up text-emerald-500 mr-2"></i>Theo dõi email được bật tự động cho tất cả chiến dịch:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-eye text-green-500 mr-2 "></i><span class="text-gray-600">Sử dụng tracking pixel cho <strong class="text-gray-900">open rate</strong></span></li><li><i class="bi bi-mouse-pointer text-emerald-500 mr-2 "></i><span class="text-gray-600">Redirect link cho <strong class="text-gray-900">click rate</strong></span></li></ul><p class="leading-relaxed mt-3"><i class="bi bi-bar-chart-line text-teal-500 mr-2"></i>Bạn có thể xem tỷ lệ mở, tỷ lệ nhấp chuột, thống kê chi tiết theo thời gian, thiết bị, vị trí địa lý và báo cáo phân tích trong trang quản lý chiến dịch.</p></div>',
  },
  {
    question: "Làm thế nào để phát hiện bot scanner email?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-robot text-red-500 mr-2"></i>Hệ thống tự động phát hiện bot scanner thông qua:</p><ol class="space-y-2 ml-4 text-gray-600"><li><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">01</span>Phân tích thời gian mở email (bot thường mở ngay lập tức)</li><li><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">02</span>User-agent analysis</li><li><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">03</span>IP reputation check</li><li><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">04</span>Behavioral patterns</li></ol><p class="leading-relaxed mt-3"><i class="bi bi-flag text-orange-500 mr-2"></i>Email được đánh dấu "nghi ngờ bot" sẽ được tách riêng trong báo cáo để không làm sai lệch metrics.</p></div>',
  },

  // Unsubscribe & Compliance
  {
    question: "Điều gì xảy ra nếu ai đó hủy đăng ký?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-person-x text-red-500 mr-2"></i>Khi người nhận nhấp vào liên kết hủy đăng ký:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-x-circle text-red-500 mr-2 "></i><span class="text-gray-600">Tự động bị loại khỏi tất cả danh sách email trong tương lai</span></li><li><i class="bi bi-lightning text-yellow-500 mr-2 "></i><span class="text-gray-600">Hệ thống xử lý ngay lập tức</span></li><li><i class="bi bi-shield-check text-green-500 mr-2 "></i><span class="text-gray-600">Tuân thủ <strong class="text-gray-900">GDPR</strong> và <strong class="text-gray-900">CAN-SPAM Act</strong></span></li></ul><p class="leading-relaxed mt-3"><i class="bi bi-file-earmark-text text-emerald-500 mr-2"></i>Bạn có thể xem và quản lý danh sách hủy đăng ký, export dữ liệu, và xem lý do hủy đăng ký trong phần báo cáo.</p></div>',
  },
  {
    question: "Link hủy đăng ký có tự động thêm vào email không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-link-45deg text-emerald-500 mr-2"></i>Có! Hệ thống tự động thêm link hủy đăng ký vào cuối mỗi email:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-code text-teal-500 mr-2 "></i><span class="text-gray-600">Sử dụng dynamic field <code class="bg-gray-100 px-1 py-0.5 rounded text-xs">{{unsubscribeLink}}</code></span></li><li><i class="bi bi-fingerprint text-green-500 mr-2 "></i><span class="text-gray-600">Link unique cho mỗi người nhận</span></li><li><i class="bi bi-hand-index-thumb text-emerald-500 mr-2 "></i><span class="text-gray-600">One-click unsubscribe, không yêu cầu đăng nhập</span></li><li><i class="bi bi-check-circle-fill text-green-500 mr-2 "></i><span class="text-gray-600">Tuân thủ <strong class="text-gray-900">RFC 8058</strong></span></li></ul><p class="leading-relaxed mt-3"><i class="bi bi-gear text-orange-500 mr-2"></i>Bạn có thể tùy chỉnh trang unsubscribe, thông báo xác nhận, và redirect URL.</p></div>',
  },
  {
    question: "Hệ thống có tuân thủ GDPR và các quy định bảo mật không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-check-circle-fill text-green-500 mr-2"></i>Có! Enterprise Meeting tuân thủ đầy đủ:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-shield-lock mr-2"></i>GDPR</h4><ul class="space-y-1 text-xs text-blue-800"><li>• One-click unsubscribe</li><li>• Data encryption</li><li>• Right to be forgotten</li></ul></div><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-envelope-check mr-2"></i>CAN-SPAM Act</h4><ul class="space-y-1 text-xs text-green-800"><li>• Compliance với quy định email marketing</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-teal-200"><h4 class="font-semibold text-emerald-900 mb-2 flex items-center"><i class="bi bi-globe mr-2"></i>CASL</h4><ul class="space-y-1 text-xs text-emerald-800"><li>• Tuân thủ luật chống spam Canada</li></ul></div><div class="bg-orange-50 rounded-lg p-3 border border-orange-200"><h4 class="font-semibold text-orange-900 mb-2 flex items-center"><i class="bi bi-lock mr-2"></i>Bảo mật</h4><ul class="space-y-1 text-xs text-orange-800"><li>• SSL/TLS, AES-256 encryption</li><li>• JWT tokens, Audit logs</li></ul></div></div></div>',
  },

  // List Management

  {
    question: "Tôi có thể tạo custom fields cho subscriber không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-plus-circle text-green-500 mr-2"></i>Có! Bạn có thể tạo unlimited custom fields:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-emerald-50 rounded-lg p-3 border border-teal-200"><h4 class="font-semibold text-emerald-900 mb-2 flex items-center"><i class="bi bi-diagram-3 mr-2"></i>Data Types</h4><ul class="space-y-1 text-xs text-emerald-800"><li>• Text, Number</li><li>• Email, Phone</li><li>• URL, Date</li><li>• Boolean, Dropdown</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-lightbulb mr-2"></i>Uses</h4><ul class="space-y-1 text-xs text-blue-800"><li>• Personalize email</li><li>• Segment danh sách</li><li>• Lưu trữ thông tin bổ sung</li><li>• Import từ Excel/API</li></ul></div></div></div>',
  },

  // Email Builder & Templates
  {
    question: "Làm thế nào để tạo email responsive?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-phone text-emerald-500 mr-2"></i>Email builder tự động tạo email responsive:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-laptop text-green-500 mr-2 "></i><span class="text-gray-600">Preview realtime trên <strong class="text-gray-900">Desktop (900px)</strong>, <strong class="text-gray-900">Tablet (768px)</strong>, <strong class="text-gray-900">Mobile (375px)</strong></span></li><li><i class="bi bi-arrows-move text-teal-500 mr-2 "></i><span class="text-gray-600">Drag-and-drop elements với layout columns responsive</span></li><li><i class="bi bi-smartphone text-emerald-500 mr-2 "></i><span class="text-gray-600">Tự động inject CSS cho mobile devices</span></li><li><i class="bi bi-code-slash text-green-500 mr-2 "></i><span class="text-gray-600">Hỗ trợ @media queries và optimize cho tất cả email clients</span></li></ul></div>',
  },
  {
    question: "Tôi có thể sử dụng hình ảnh của mình không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-images text-emerald-500 mr-2"></i>Có! Upload hình ảnh lên Cloud Storage:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-file-image mr-2"></i>Hỗ trợ định dạng</h4><ul class="space-y-1 text-xs text-green-800"><li>• JPG, PNG, GIF, WebP</li><li>• Tối đa 20MB/hình</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-cloud-check mr-2"></i>Gói miễn phí</h4><ul class="space-y-1 text-xs text-blue-800"><li>• Tối đa 50 hình ảnh</li><li>• Tự động tối ưu qua CDN</li><li>• URL permanent với Cloudflare R2</li></ul></div></div></div>',
  },
  {
    question: "Social icons có hiển thị đúng trên tất cả email client không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-share text-emerald-500 mr-2"></i>Gmail và một số email client không hỗ trợ SVG icons:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-red-50 rounded-lg p-3 border border-red-200"><h4 class="font-semibold text-red-900 mb-2 flex items-center"><i class="bi bi-x-octagon mr-2"></i>Gmail không hỗ trợ</h4><ul class="space-y-1 text-xs text-red-800"><li>• SVG icons bị strip</li><li>• Chỉ hiển thị khoảng trống</li><li>• Outlook/Apple Mail OK</li></ul></div><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-check-circle mr-2"></i>Giải pháp</h4><ul class="space-y-1 text-xs text-green-800"><li>• Sử dụng PNG image URLs</li><li>• Tương thích tất cả email clients</li><li>• Khuyến nghị: <code class="bg-white px-1 py-0.5 rounded text-xs">Icon Image URL (i)</code></li></ul></div></div><p class="leading-relaxed mt-3"><i class="bi bi-lightbulb text-yellow-500 mr-2"></i><strong>Tips:</strong> Upload social icons lên Cloud Storage và sử dụng URL hình ảnh thay vì SVG để đảm bảo tương thích tối đa.</p></div>',
  },
  {
    question: "Làm thế nào để cá nhân hóa email?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-person-badge text-emerald-500 mr-2"></i>Sử dụng dynamic fields:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-emerald-50 rounded-lg p-3 border border-teal-200"><h4 class="font-semibold text-emerald-900 mb-2 flex items-center"><i class="bi bi-tags mr-2"></i>Cơ bản</h4><ul class="space-y-1 text-xs text-emerald-800"><li><code class="bg-white px-1 py-0.5 rounded">{{firstName}}</code></li><li><code class="bg-white px-1 py-0.5 rounded">{{lastName}}</code></li><li><code class="bg-white px-1 py-0.5 rounded">{{email}}</code></li><li><code class="bg-white px-1 py-0.5 rounded">{{company}}</code></li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-gear mr-2"></i>Tính năng nâng cao</h4><ul class="space-y-1 text-xs text-blue-800"><li>• Unlimited custom fields</li><li>• Fallback values</li><li>• Conditional content</li></ul></div></div></div>',
  },
  {
    question: "Template có thể tái sử dụng được không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-recycle text-green-500 mr-2"></i>Có! Tất cả template được lưu trữ và tái sử dụng:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-folder text-emerald-500 mr-2 "></i><span class="text-gray-600">Tạo template library với categories</span></li><li><i class="bi bi-copy text-teal-500 mr-2 "></i><span class="text-gray-600">Duplicate và edit templates</span></li><li><i class="bi bi-share text-green-500 mr-2 "></i><span class="text-gray-600">Share với team members</span></li><li><i class="bi bi-download text-orange-500 mr-2 "></i><span class="text-gray-600">Export/Import dưới dạng JSON</span></li></ul></div>',
  },

  // Security & Data
  {
    question: "Dữ liệu của tôi có an toàn không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-shield-check text-green-500 mr-2"></i>Có! Chúng tôi sử dụng bảo mật cao:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-lock mr-2"></i>Encryption</h4><ul class="space-y-1 text-xs text-blue-800"><li>• SSL/TLS, AES-256 at rest</li><li>• Bcrypt hashing</li></ul></div><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-key mr-2"></i>Authentication</h4><ul class="space-y-1 text-xs text-green-800"><li>• JWT tokens</li><li>• 2FA option</li></ul></div><div class="bg-red-50 rounded-lg p-3 border border-red-200"><h4 class="font-semibold text-red-900 mb-2 flex items-center"><i class="bi bi-shield mr-2"></i>Protection</h4><ul class="space-y-1 text-xs text-red-800"><li>• Rate limiting</li><li>• DDoS protection</li><li>• Security audits</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-teal-200"><h4 class="font-semibold text-emerald-900 mb-2 flex items-center"><i class="bi bi-check-circle mr-2"></i>Compliance</h4><ul class="space-y-1 text-xs text-emerald-800"><li>• GDPR</li><li>• Regular backups</li><li>• Audit logs</li></ul></div></div></div>',
  },

  // Advanced Features
  {
    question: "Hệ thống có hỗ trợ A/B testing không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-dash-circle text-orange-500 mr-2"></i>Hiện tại chưa hỗ trợ A/B testing tự động.</p><p class="leading-relaxed"><i class="bi bi-tools text-emerald-500 mr-2"></i>Giải pháp thay thế:</p><ul class="space-y-2 ml-4"><li><i class="bi bi-diagram-3 text-teal-500 mr-2 "></i><span class="text-gray-600">Tạo multiple campaigns với variants khác nhau</span></li><li><i class="bi bi-people text-green-500 mr-2 "></i><span class="text-gray-600">Gửi cho segments khác nhau</span></li><li><i class="bi bi-bar-chart-line text-emerald-500 mr-2 "></i><span class="text-gray-600">So sánh metrics (open rate, click rate, conversions)</span></li><li><i class="bi bi-trophy text-yellow-500 mr-2 "></i><span class="text-gray-600">Tìm ra variant tốt nhất</span></li></ul></div>',
  },
  {
    question: "Làm thế nào để export dữ liệu chiến dịch?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-file-earmark-spreadsheet text-emerald-500 mr-2"></i>Trong trang quản lý chiến dịch:</p><ul class="space-y-2 ml-4 text-gray-600"><li><span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">01</span>Chọn campaign và nhấn "Export"</li><li><span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-3 mt-0.5">02</span><strong class="text-gray-900">Có thể export:</strong></li></ul><ul class="space-y-1 ml-8 text-xs text-gray-600"><li>• Danh sách người đã mở email</li><li>• Chưa mở / Clicked links</li><li>• Bounced emails / Unsubscribed</li><li>• Bot scanner suspects</li><li>• Full analytics report (CSV/JSON)</li></ul></div>',
  },
  {
    question: "Tôi có thể kết nối domain riêng không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-globe text-emerald-500 mr-2"></i>Có! Cấu hình SMTP server với domain riêng:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-gear mr-2"></i>Cần setup</h4><ul class="space-y-1 text-xs text-green-800"><li>• SPF record</li><li>• DKIM signature</li><li>• DMARC policy</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-rocket mr-2"></i>Lợi ích</h4><ul class="space-y-1 text-xs text-blue-800"><li>• Tăng độ tin cậy</li><li>• Deliverability rate cao</li><li>• Brand recognition</li><li>• Custom tracking domain</li><li>• Dedicated IP (high-volume)</li></ul></div></div></div>',
  },
  {
    question: "Có hỗ trợ multi-user và team collaboration không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><p class="leading-relaxed"><i class="bi bi-people-fill text-green-500 mr-2"></i>Có! Hỗ trợ đầy đủ:</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3"><div class="bg-emerald-50 rounded-lg p-3 border border-blue-200"><h4 class="font-semibold text-blue-900 mb-2 flex items-center"><i class="bi bi-person-badge mr-2"></i>Roles</h4><ul class="space-y-1 text-xs text-blue-800"><li>• Admin, Editor, Viewer</li><li>• Permissions</li></ul></div><div class="bg-green-50 rounded-lg p-3 border border-green-200"><h4 class="font-semibold text-green-900 mb-2 flex items-center"><i class="bi bi-building mr-2"></i>Features</h4><ul class="space-y-1 text-xs text-green-800"><li>• Team workspaces</li><li>• Shared templates/campaigns</li><li>• Activity logs</li><li>• Comments</li><li>• Approval workflows</li></ul></div><div class="bg-emerald-50 rounded-lg p-3 border border-teal-200 col-span-1 md:col-span-2"><h4 class="font-semibold text-emerald-900 mb-2 flex items-center"><i class="bi bi-graph-up mr-2"></i>Enterprise</h4><ul class="space-y-1 text-xs text-emerald-800"><li>• Audit trails, Advanced permissions</li></ul></div></div></div>',
  },
  {
    question: "Có giới hạn số lượng subscribers không?",
    answer:
      '<div class="space-y-3 text-xs sm:text-sm text-gray-700 break-words whitespace-pre-wrap"><ul class="space-y-2 ml-4"><li><i class="bi bi-star text-yellow-500 mr-2 "></i><strong class="text-gray-900">Gói miễn phí:</strong> <span class="text-gray-600">Tối đa 1,000 subscribers</span></li><li><i class="bi bi-diamond text-emerald-500 mr-2 "></i><strong class="text-gray-900">Gói trả phí:</strong> <span class="text-gray-600">Unlimited subscribers</span></li></ul><div class="bg-green-50 rounded-lg p-3 border border-green-200 mt-3"><p class="text-xs text-green-800 leading-relaxed"><i class="bi bi-check-circle-fill text-green-600 mr-1"></i><strong>Không giới hạn:</strong> Lists, segments, custom fields. Có thể import bulk, clean inactive contacts, manage unlimited email addresses.</p></div></div>',
  },
];

const toggleFaq = (index) => {
  const idx = openFaqs.value.indexOf(index);
  if (idx === -1) {
    openFaqs.value.push(index);
  } else {
    openFaqs.value.splice(idx, 1);
  }
};

// Update active section on scroll
const handleScroll = () => {
  for (const section of sections) {
    const element = document.getElementById(section.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeSection.value = section.id;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const activeTab = ref("getting-started");
const sidebarOpen = ref(false);

const tabs = [
  {
    id: "getting-started",
    label: "Bắt Đầu",
    icon: "bi bi-rocket-takeoff",
    description: "Hướng dẫn bắt đầu sử dụng Enterprise Meeting",
  },
  {
    id: "meeting-booking",
    label: "Lịch Họp",
    icon: "bi bi-calendar-check",
    description: "Đặt lịch và quản lý phòng họp",
  },
  {
    id: "email-config",
    label: "Cấu Hình Email",
    icon: "bi bi-gear",
    description: "Cấu hình SMTP server với domain riêng",
  },
  {
    id: "email-warmup",
    label: "Warm Up Email",
    icon: "bi bi-thermometer-sun",
    description: "Tránh spam và duy trì IP sạch",
  },
  {
    id: "email-lists",
    label: "Danh Sách KH",
    icon: "bi bi-people",
    description: "Quản lý khách hàng và danh sách email",
  },
  {
    id: "campaigns",
    label: "Chiến Dịch",
    icon: "bi bi-send",
    description: "Tạo, gửi và theo dõi chiến dịch email",
  },
  {
    id: "templates",
    label: "Templates",
    icon: "bi bi-palette",
    description: "Tạo mẫu email chuyên nghiệp",
  },
  {
    id: "support",
    label: "Hỗ Trợ",
    icon: "bi bi-headset",
    description: "Tạo và quản lý ticket hỗ trợ",
  },
  {
    id: "faq",
    label: "FAQ",
    icon: "bi bi-question-circle",
    description: "Câu hỏi thường gặp",
  },
];

const currentTab = computed(() => tabs.find((t) => t.id === activeTab.value));

const selectTab = (tabId) => {
  activeTab.value = tabId;
  sidebarOpen.value = false;
  // Reset scroll to top when switching tabs
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.scrollTop = 0;
    }
  });
};

onMounted(() => {
  // Scroll reset on tab change
  watch(activeTab, () => {
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = 0;
      }
    });
  });
});

// SEO Configuration
useSeoMeta({
  title: "Hướng Dẫn Sử Dụng - Enterprise Meeting",
  description:
    "Hướng dẫn sử dụng chi tiết Enterprise Meeting. Học cách thiết kế email, gửi email hàng loạt và các tính năng khác một cách dễ dàng.",
  keywords:
    "hướng dẫn sử dụng, Enterprise Meeting, tutorial, hướng dẫn đặt lịch họp, quản lý phòng họp, tài liệu hướng dẫn",
  author: "Enterprise Meeting",
  ogTitle: "Hướng Dẫn Sử Dụng - Enterprise Meeting",
  ogDescription:
    "Hướng dẫn sử dụng chi tiết Enterprise Meeting. Học cách sử dụng tất cả tính năng một cách dễ dàng.",
  ogImage:
    "https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public",
  ogUrl: "https://emtools.site/guide",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Hướng Dẫn Sử Dụng - Enterprise Meeting",
  twitterDescription:
    "Hướng dẫn sử dụng chi tiết Enterprise Meeting. Học cách sử dụng tất cả tính năng một cách dễ dàng.",
  twitterImage:
    "https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public",
  robots: "index, follow",
  canonical: "https://emtools.site/guide",
});

// Structured Data for SEO
// useSchemaOrg([
//   {
//     '@type': 'WebPage',
//     name: 'Hướng Dẫn Sử Dụng - Enterprise Meeting',
//     description: 'Hướng dẫn sử dụng chi tiết Enterprise Meeting. Học cách thiết kế email, gửi email hàng loạt, chuyển đổi file và các tính năng khác.',
//     url: 'https://emtools.site/guide',
//     inLanguage: 'vi-VN',
//     isPartOf: {
//       '@type': 'WebSite',
//       name: 'Enterprise Meeting',
//       url: 'https://emtools.site'
//     }
//   },
//   {
//     '@type': 'HowTo',
//     name: 'Hướng dẫn sử dụng Enterprise Meeting',
//     description: 'Hướng dẫn chi tiết cách sử dụng các tính năng của Enterprise Meeting',
//     image: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public',
//     totalTime: 'PT30M',
//     supply: [
//       {
//         '@type': 'HowToSupply',
//         name: 'Tài khoản Enterprise Meeting'
//       }
//     ],
//     tool: [
//       {
//         '@type': 'HowToTool',
//         name: 'Email Builder'
//       },
//       {
//         '@type': 'HowToTool',
//         name: 'File Converter'
//       }
//     ],
//     step: [
//       {
//         '@type': 'HowToStep',
//         name: 'Đăng ký tài khoản',
//         text: 'Tạo tài khoản Enterprise Meeting miễn phí để bắt đầu sử dụng',
//         image: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public'
//       },
//       {
//         '@type': 'HowToStep',
//         name: 'Sử dụng Email Builder',
//         text: 'Học cách thiết kế email chuyên nghiệp với drag & drop editor',
//         image: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public'
//       },
//       {
//         '@type': 'HowToStep',
//         name: 'Chuyển đổi file',
//         text: 'Sử dụng công cụ chuyển đổi PDF/Word online miễn phí',
//         image: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/4e70f1f7-7a6e-4d23-3296-32a0f966e500/public'
//       }
//     ]
//   },
//   {
//     '@type': 'FAQPage',
//     mainEntity: [
//       {
//         '@type': 'Question',
//         name: 'Làm thế nào để bắt đầu sử dụng Enterprise Meeting?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Bạn chỉ cần đăng ký tài khoản miễn phí, sau đó có thể bắt đầu sử dụng Email Builder để thiết kế email hoặc công cụ chuyển đổi file ngay lập tức.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'EM có khó sử dụng không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Không, Enterprise Meeting được thiết kế với giao diện trực quan và dễ sử dụng. Chúng tôi cung cấp hướng dẫn chi tiết cho từng tính năng.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'Có cần cài đặt phần mềm không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Không, Enterprise Meeting là nền tảng online hoàn toàn. Bạn chỉ cần trình duyệt web để sử dụng tất cả tính năng.'
//         }
//       }
//     ]
//   }
// ])
</script>
<style scoped>
.prose {
  color: #374151;
  max-width: none;
  font-size: 0.875rem;
}

.prose p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
  font-size: 0.875rem;
}

.prose ul {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.prose li {
  margin-bottom: 0.375rem;
  line-height: 1.6;
  font-size: 0.875rem;
}

.prose strong {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.prose code {
  background-color: #ecfdf5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #059669;
  font-family: "Courier New", monospace;
}

.prose ol {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.prose ol li {
  margin-bottom: 0.375rem;
  line-height: 1.6;
  font-size: 0.875rem;
}

.prose h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.prose h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}
</style>
