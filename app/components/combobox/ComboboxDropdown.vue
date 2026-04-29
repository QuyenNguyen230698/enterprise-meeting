<template>
  <div class="relative w-full h-fit gap-3"
    :class="[`relative-${fieldFilter}`, !disableComponent ? 'bg-gray-300 rounded' : '']">
    <input ref="valueInput" autocomplete="new-firstname"
      :class="[useBorder ? 'border-b' : '', cssClass || 'w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white']"
      :disabled="!disableComponent || offActionDelete"
      class="pr-8"
      type="text" v-model="itemSelected" @input="handleInput" :placeholder="label" @focus="focusInput"
      :readonly="allowCustomInput" />
    <kbd v-if="isSearching" @click="clearValue"
      class="absolute inset-y-0 right-3 flex items-center p-1 kbd kbd-md border-none bg-transparent"
      :class="[!offActionDelete ? 'cursor-pointer' : '']">
      <i v-if="!offActionDelete" :class="iconDelete" class="cursor-pointer text-xs"></i>
    </kbd>

    <kbd v-else @click="focusInput"
      class="absolute inset-y-0 right-3 flex items-center p-1 kbd kbd-md border-none bg-transparent cursor-pointer">
      <i :class="iconSearch" class="text-xs"></i>
    </kbd>
    <ul v-if="filteredData?.length > 0" v-show="showDropdown" :class="{ 'absolute': useAbsolute }"
      class="absolute z-40 w-full max-w-full bg-stone-100 border-2 mt-2 px-2 py-1 shadow-lg max-h-46 overflow-y-auto overflow-x-hidden">
      <li v-if="!useTemplate" v-for="(item, index) in filteredData" :key="index" @click="selectItem($event, item)"
        class="cursor-pointer px-2 py-1 hover:bg-gray-100 mt-1 bg-stone-100 text-sm ">
        <span>
          {{ item }}
        </span>
      </li>
      <li v-else>
        <slot name="item" :dataFilter="data"></slot>
      </li>
      <li v-if="!isLoadingData && filteredData?.length === 0" class="px-2 py-1 text-sm bg-stone-100 text-gray-500">
        No item
      </li>
    </ul>
  </div>
</template>

<script setup>
const { $_ } = useNuxtApp();

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  fieldFilter: {
    type: String,
    default: 'name'
  },
  useAbsolute: {
    type: Boolean,
    default: false
  },
  useBorder: {
    type: Boolean,
    default: true
  },
  iconDelete: {
    type: String,
    default: 'bi bi-trash'
  },
  iconSearch: {
    type: String,
    default: 'bi bi-search'
  },
  allowCustomInput: {
    type: Boolean,
    default: false
  },
  offActionDelete: {
    type: Boolean,
    default: false
  },
  disableComponent: {
    type: Boolean,
    default: true
  },
  useTemplate: {
    type: Boolean,
    default: false
  },
  cssClass: {
    type: String,
    default: '',
  },
});

const { data, fieldFilter, label, modelValue, useAbsolute, allowCustomInput, useBorder, offActionDelete, useTemplate } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'update:data','closeRecommentAddress']);

const itemSelected = computed({
  get() {
    return modelValue.value ?? '';
  },
  set(value) {
    if (!$_.isEqual(modelValue.value, value)) {
      emit('update:modelValue', value);
    }
  }
});

const isLoadingData = ref(true);
const showDropdown = ref(false);
const valueInput = ref(null);
const pressedKey = ref('');
const isSearching = computed(() => {
  return itemSelected.value?.length > 0;
});
const logValue = $_.debounce((event) => {
  if (allowCustomInput.value) {
    pressedKey.value = event.target.value;
    showDropdown.value = true; // Hiển thị dropdown khi nhập liệu
  } else {
    pressedKey.value = '';
  }
}, 500);

const handleInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  pressedKey.value = searchTerm; // Cập nhật giá trị tìm kiếm
  showDropdown.value = true; // Hiển thị dropdown khi nhập liệu

  // Cập nhật danh sách được lọc theo từ khóa
  filteredData.value = data.value
    ?.map(item => item[fieldFilter.value])
    ?.filter(item => removeVietnameseTones(item.toLowerCase()).includes(removeVietnameseTones(searchTerm.toLowerCase())));
};
function removeVietnameseTones(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
const filteredData = ref([]); // Khởi tạo filteredData là một ref

const selectItem = (event, value) => {
  itemSelected.value = value;
  showDropdown.value = false; // Đóng danh sách sau khi chọn
  pressedKey.value = ''; // Đặt lại giá trị tìm kiếm
};

const focusInput = () => {
  // Đóng tất cả các dropdown khác
  document.dispatchEvent(new CustomEvent('closeAllDropdowns', { detail: showDropdown }));
  // Mở dropdown hiện tại
  showDropdown.value = true;
  emit('closeRecommentAddress', false);
};

const handleClickOutside = (event) => {
  if (!event.target.closest(`.relative-${fieldFilter.value}`)) {
    showDropdown.value = false;
  }
};

const clearValue = (event) => {
  if (!offActionDelete.value) {
    if (event) {
      event.preventDefault();
    }
    itemSelected.value = ''; // Reset giá trị đã chọn
    pressedKey.value = ''; // Reset giá trị tìm kiếm
    showDropdown.value = false; // Đóng dropdown
    filteredData.value = data.value?.map(item => item[fieldFilter.value]); // Reset danh sách được lọc
  }

};

// Watch data changes to update filteredData
watch(data, (newData) => {
  filteredData.value = newData?.map(item => item[fieldFilter.value]);
}, { immediate: true, deep: true });

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('closeAllDropdowns', (e) => {
    if (e.detail !== showDropdown) {
      showDropdown.value = false;
    }
  });
  // Khởi tạo filteredData với toàn bộ dữ liệu khi component được mount
  filteredData.value = data.value?.map(item => item[fieldFilter.value]);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('closeAllDropdowns', (e) => {
    if (e.detail !== showDropdown) {
      showDropdown.value = false;
    }
  });
});
</script>

<style scoped>
.no-zoom {
  font-size: 16px;
  /* Kích thước font tối thiểu để ngăn zoom trên Safari */
}

@supports (-webkit-touch-callout: none) {
  .no-zoom {
    font-size: 16px !important;
  }
}

.relative-fieldFilter {
  max-width: 100%;
  overflow-x: hidden;
}

ul {
  left: 0;
  right: 0;
  width: auto !important;
}
</style>