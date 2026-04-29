<template>
  <div style="z-index: 9999 !important" v-if="visible" :class="[toastClass, positionClass, toastWidthClass]" class="fixed transform container mx-auto">
    <div role="alert" :class="alertClass" class="flex items-center justify-center p-4 rounded-lg">
      <svg @click="closeToast" v-if="typeToast === 'success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <svg @click="closeToast" v-if="typeToast === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6 mr-2"
        fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg @click="closeToast" v-if="typeToast === 'warning'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6 mr-2"
        fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg @click="closeToast" v-if="typeToast === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-6 h-6 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm md:text-sm text-center font-thin ">{{ message }}</p>
    </div>
  </div>
</template>
<script setup>
//#region AnhLD (Khai báo props cho component)
const props = defineProps({
  typeToast: {
    type: String,
    default: () => null, // Giá trị mặc định là null
    required: false,
  },
  message: {
    type: String,
    default: () => '', // Giá trị mặc định là chuỗi rỗng
    required: false,
  },
  show: {
    type: Boolean,
    required: true, // Bắt buộc phải truyền vào
  },
  width: {
    type: String,
    default: 'w-full', // Giá trị mặc định cho chiều rộng
    required: false,
  },
  position: {
    type: String,
    default: 'top-center', // Vị trí mặc định
    required: false,
  },
  customTop: {
    type: String,
    default: 'top-20', // Giá trị mặc định cho vị trí top tùy chỉnh
    required: false,
  }
});

const emit = defineEmits(['update:show']);
//#endregion

//#region AnhLD (Biến trạng thái để điều khiển hiển thị toast)
const visible = ref(props.show);
//#endregion

//#region AnhLD (Tính toán class chiều rộng của toast)
const toastWidthClass = computed(() => {
  return props.width; // Trả về class chiều rộng từ props
});
//#endregion

//#region AnhLD (Tính toán class của toast dựa trên loại toast)
const toastClass = computed(() => {
  switch (props.typeToast) {
    case 'success':
      return 'bg-green-600'; // Màu nhẹ hơn cho toast thành công
    case 'error':
      return 'bg-red-600'; // Màu nhẹ hơn cho toast lỗi
    case 'warning':
      return 'bg-yellow-600'; // Màu nhẹ hơn cho toast cảnh báo
    case 'info':
      return 'bg-blue-600'; // Màu nhẹ hơn cho toast thông tin
    default:
      return '';
  }
});
//#endregion

//#region AnhLD (Tính toán class văn bản của toast)
const alertClass = computed(() => {
  switch (props.typeToast) {
    case 'success':
    case 'error':
    case 'info':
      return 'text-white'; // Màu văn bản tối hơn cho các loại này
    case 'warning':
      return 'text-black'; // Màu văn bản tối hơn cho cảnh báo
    default:
      return '';
  }
});
//#endregion

//#region AnhLD (Tính toán class vị trí của toast)
const positionClass = computed(() => {
  const topPosition = props.customTop || 'top-20'; // Sử dụng customTop nếu có
  const positions = {
    'top-start': `${topPosition} left-5`,
    'top-center': `${topPosition} left-1/2 -translate-x-1/2`,
    'top-end': `${topPosition} right-5`,
    'bottom-start': 'bottom-10 left-5',
    'bottom-center': 'bottom-10 left-1/2 -translate-x-1/2',
    'bottom-end': 'bottom-10 right-5',
    'center-start': 'top-1/2 left-5 -translate-y-1/2',
    'center-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'center-end': 'top-1/2 right-5 -translate-y-1/2'
  };

  return positions[props.position] || `${topPosition} left-1/2 -translate-x-1/2`;
});
//#endregion

//#region AnhLD (Hàm hiển thị toast)
const showToast = () => {
  visible.value = true; // Thiết lập trạng thái visible thành true
  setTimeout(() => {
    visible.value = false; // Đóng toast sau 5 giây
    emit('update:show', false); // RESET THE PARENT STATE
  }, 10000);
};
//#endregion

//#region AnhLD (Hàm đóng toast)
const closeToast = () => {
  visible.value = false; // Thiết lập trạng thái visible thành false
  emit('update:show', false); // RESET THE PARENT STATE
};
//#endregion

//#region AnhLD (Theo dõi sự thay đổi của prop show để hiển thị toast)
watch(() => props.show, (newVal) => {
  if (newVal) {
    showToast(); // Gọi hàm hiển thị nếu prop show là true
  }
});
//#endregion

//#region AnhLD (Expose các hàm show và close ra ngoài)
defineExpose({
  show: showToast, // Expose hàm hiển thị toast
  close: closeToast // Expose hàm đóng toast
});
//#endregion
</script>
