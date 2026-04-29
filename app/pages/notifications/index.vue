<template>
  <div class="flex flex-col w-full h-full bg-linear-to-br from-emerald-50/50 via-white to-lime-50/40 font-sans">
    <ToastContainer />

    <!-- Sticky Header -->
    <div
      class="border-b border-emerald-100/70 sticky top-0 z-10 shadow-sm shadow-emerald-100/40 backdrop-blur-xl bg-white/90"
    >
      <div class="max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200"
            >
              <i class="bi bi-bell-fill"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 tracking-tight">
                Thông Báo
              </h1>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs font-medium text-gray-500"
                  >Cập nhật hoạt động của bạn</span
                >
                <span
                  v-if="unreadCount > 0"
                  class="w-1.5 h-1.5 rounded-full bg-red-500"
                ></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="unreadCount > 0"
              @click="handleMarkAllRead"
              class="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 rounded-xl transition-colors shadow-sm shadow-emerald-200"
              title="Đánh dấu tất cả là đã đọc"
            >
              <i class="bi bi-check2-all text-lg"></i>
              <span class="hidden sm:inline">Đánh dấu đã đọc</span>
            </button>
            <button
              v-if="unreadCount > 0"
              @click="handleMarkAllRead"
              class="sm:hidden w-9 h-9 flex items-center justify-center text-white bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 rounded-xl transition-colors shadow-sm shadow-emerald-200"
            >
              <i class="bi bi-check2-all text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 mt-6 border-b border-emerald-100/70">
          <button
            @click="setFilter(false)"
            class="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors relative rounded-t-lg"
            :class="
              !filterUnread
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
            "
          >
            Tất cả
            <span
              v-if="!filterUnread && unreadCount > 0"
              class="absolute top-2 right-1 flex h-2 w-2"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
              ></span>
            </span>
          </button>
          <button
            @click="setFilter(true)"
            class="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 rounded-t-lg"
            :class="
              filterUnread
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/80'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
            "
          >
            Chưa đọc
            <span
              v-if="unreadCount > 0"
              class="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-md min-w-5 text-center"
              >{{ unreadCount }}</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 w-full overflow-y-auto overflow-x-hidden">
      <div class="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 pb-20">
        <!-- Loading State -->
        <div
          v-if="loading && notifications.length === 0"
          class="py-12 flex flex-col items-center justify-center text-center"
        >
          <div
            class="w-10 h-10 border-2 border-emerald-100 border-t-teal-500 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-400 text-sm">Đang tải thông báo...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="notifications.length === 0"
          class="py-20 flex flex-col items-center justify-center text-center"
        >
          <div
            class="w-24 h-24 bg-linear-to-br from-emerald-100 via-teal-100 to-lime-100 rounded-full flex items-center justify-center mb-6"
          >
            <i class="bi bi-bell-slash text-emerald-400 text-4xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Không có thông báo nào
          </h3>
          <p class="text-gray-500 max-w-sm mx-auto">
            {{
              filterUnread
                ? "Tuyệt vời! Bạn đã đọc hết tất cả thông báo."
                : "Khi có hoạt động mới, chúng sẽ xuất hiện tại đây."
            }}
          </p>
          <button
            v-if="filterUnread"
            @click="setFilter(false)"
              class="mt-6 px-5 py-2.5 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white border border-emerald-200/70 font-medium rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-lime-700 transition-colors shadow-sm"
          >
            Xem tất cả thông báo
          </button>
        </div>

        <!-- Notifications List -->
        <div v-else class="space-y-4">
          <div
            v-for="notification in notifications"
            :key="notification._id"
            class="group relative bg-white/95 rounded-2xl p-4 sm:p-5 border transition-all duration-200 backdrop-blur-xs"
            :class="[
              !notification.isRead
                ? 'border-emerald-200 shadow-sm ring-1 ring-emerald-100/70 hover:shadow-md'
                : 'border-transparent hover:border-gray-200 hover:bg-gray-50',
            ]"
            @click="handleNotificationClick(notification)"
          >
            <!-- Unread Indicator Dot -->
            <div
              v-if="!notification.isRead"
              class="absolute top-5 right-5 w-2.5 h-2.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm ring-2 ring-white"
            ></div>

            <div class="flex gap-4 sm:gap-5">
              <!-- Icon -->
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-sm"
                :class="getNotificationStyles(notification.type).bgClass"
              >
                <i
                  :class="[
                    getNotificationIcon(notification.type),
                    getNotificationStyles(notification.type).textClass,
                  ]"
                ></i>
              </div>

              <div class="flex-1 min-w-0 pr-6">
                <!-- Header Line -->
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                    :class="getTypeBadgeClass(notification.type)"
                  >
                    {{ getTypeLabel(notification.type) }}
                  </span>
                  <span
                    class="text-xs text-gray-400 font-medium whitespace-nowrap"
                    >&bull; {{ formatDate(notification.createdAt) }}</span
                  >
                </div>

                <!-- Title & Message -->
                <h4
                  class="text-base font-bold text-gray-900 mb-1 leading-snug"
                  :class="{ 'text-emerald-900': !notification.isRead }"
                >
                  {{ notification.title }}
                </h4>
                <p
                  class="text-sm text-gray-600 line-clamp-2 leading-relaxed"
                  :class="{ 'text-gray-800 font-medium': !notification.isRead }"
                >
                  {{ notification.message }}
                </p>

                <!-- Actions (Visible on Hover mostly, simplified) -->
                <div
                  class="mt-3 flex items-center gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <button
                    @click.stop="handleDelete(notification._id)"
                    class="text-xs font-medium text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <i class="bi bi-trash"></i> Xóa
                  </button>

                  <button
                    v-if="!notification.isRead"
                    @click.stop="markAsRead(notification._id)"
                    class="text-xs font-medium text-emerald-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <i class="bi bi-check2"></i> Đánh dấu đã đọc
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="pt-6 text-center">
            <button
              @click="loadMore"
              :disabled="loading"
              class="px-8 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 font-bold text-sm transition-all shadow-sm hover:shadow-md"
            >
              <span v-if="!loading">Xem thêm thông báo cũ hơn</span>
              <span v-else class="flex items-center gap-2">
                <span
                  class="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin"
                ></span>
                Đang tải...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ["auth", "permission"], layout: "default" });

const router = useRouter();
const { success } = useToast();
const {
  notifications,
  unreadCount,
  loading,
  hasMore,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  loadMore,
  getNotificationIcon,
  // getNotificationColor removed in favor of internal style mapper
} = useNotifications();

const filterUnread = ref(false);

const setFilter = (isUnread) => {
  filterUnread.value = isUnread;
  fetchNotifications(1, isUnread);
};

const handleNotificationClick = async (notification) => {
  if (!notification.isRead) {
    await markAsRead(notification._id);
  }

  if (notification.link) {
    router.push(notification.link);
  }
};

const handleMarkAllRead = async () => {
  await markAllAsRead();
  success("Đã đánh dấu tất cả đã đọc");
};

const handleDelete = async (id) => {
  await deleteNotification(id);
  success("Đã xóa thông báo");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeLabel = (type) => {
  const labels = {
    ticket_new: "Support Ticket",
    ticket_reply: "Phản hồi mới",
    ticket_status: "Cập nhật Ticket",
    ticket_resolved: "Đã xong",
    system: "Hệ thống",
    broadcast: "Tin tức",
    info: "Thông tin",
    warning: "Cảnh báo",
    success: "Thành công",
  };
  return labels[type] || "Thông báo";
};

// Styling helper
const getNotificationStyles = (type) => {
  const styles = {
    ticket_new: { bgClass: "bg-lime-50", textClass: "text-lime-600" },
    ticket_reply: { bgClass: "bg-teal-50", textClass: "text-teal-600" },
    ticket_status: { bgClass: "bg-amber-50", textClass: "text-amber-600" },
    ticket_resolved: {
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-600",
    },
    system: { bgClass: "bg-gray-100", textClass: "text-gray-600" },
    broadcast: { bgClass: "bg-emerald-50", textClass: "text-emerald-600" },
    info: { bgClass: "bg-teal-50", textClass: "text-teal-600" },
    warning: { bgClass: "bg-orange-50", textClass: "text-orange-600" },
    success: { bgClass: "bg-lime-50", textClass: "text-lime-600" },
    error: { bgClass: "bg-red-50", textClass: "text-red-600" },
  };
  return styles[type] || { bgClass: "bg-gray-50", textClass: "text-gray-500" };
};

const getTypeBadgeClass = (type) => {
  const classes = {
    ticket_new: "bg-lime-100 text-lime-700",
    ticket_reply: "bg-teal-100 text-teal-700",
    ticket_status: "bg-amber-100 text-amber-700",
    ticket_resolved: "bg-emerald-100 text-emerald-700",
    system: "bg-gray-100 text-gray-700",
    broadcast: "bg-emerald-100 text-emerald-700",
    info: "bg-teal-100 text-teal-700",
    warning: "bg-orange-100 text-orange-700",
    success: "bg-lime-100 text-lime-700",
    error: "bg-red-100 text-red-700",
  };
  return classes[type] || "bg-gray-100 text-gray-600";
};

onMounted(() => {
  fetchNotifications();
  fetchUnreadCount();
});
</script>
