<template>
    <div class="relative w-full gap-3 mb-3 mt-1 px-1" :class="`relative-${fieldFilter}`">
        <div class="flex items-center">
            <input ref="valueInput"
                class="w-full bg-transparent border-b rounded-none border-gray-500 focus:outline-none py-2 no-zoom text-sm truncate pr-8"
                type="text" v-model="pressedKey" @input="handleInput" :placeholder="label" @focus="focusInput"
                :readonly="allowCustomInput" />
            <kbd v-if="isTyping" @click="addCustomInput"
                class="bg-white absolute right-8 top-0 kbd kbd-md border-none cursor-pointer"><i
                    class="bi bi-check-circle"></i></kbd>
            <kbd v-if="isSearching" @click="clearValue"
                class="bg-white absolute right-0 top-0 kbd kbd-md border-none cursor-pointer"><i
                    class="bi bi-trash"></i></kbd>
            <kbd v-else class="absolute right-0 top-0 kbd kbd-md border-none bg-transparent cursor-pointer"><i
                    class="bi bi-search"></i></kbd>
        </div>
        <div v-if="itemSelected?.length > 0" class="mt-2 flex flex-wrap gap-1 justify-start items-center min-h-8">
            <div class="grow flex items-center">
                <span v-for="(item, index) in itemSelected.slice(0, 4)" :key="index"
                    class="truncate max-w-96 px-1 badge badge-outline mr-1 text-sm flex items-center">
                    {{ item }}
                    <button @click="removeItem(index)" class="ml-1 text-red-500 hover:text-red-700">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </span>
            </div>
            <span v-if="itemSelected?.length > 4"
                    class="w-8 h-8 aspect-square badge badge-outline mr-1 bg-circle flex justify-center items-center shrink-0 ml-auto">
                    +{{ itemSelected?.length - 4 }}
                </span>
        </div>

        <ul v-if="filteredData?.length > 0" v-show="showDropdown" :class="{ 'absolute': useAbsolute }"
            class="absolute z-40 w-full max-w-full bg-base-100 border-2 mt-2 px-2 py-1 shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
            <li v-for="(item, index) in filteredData" :key="index" @click="selectItem($event, item)"
                class="cursor-pointer px-2 py-1 hover:bg-gray-100 mt-1 text-sm">
                {{ item }}
            </li>
            <li v-if="!isLoadingData && filteredData?.length === 0" class="px-2 py-1 text-sm text-gray-500">
                No item
            </li>
        </ul>
    </div>
</template>

<script setup>
const { $_ } = useNuxtApp();

const props = defineProps({
   modelValue : {
        type: Array,
        default: () => []
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
    allowCustomInput: {
        type: Boolean,
        default: false
    }
});

const { data, fieldFilter, label, modelValue, useAbsolute, allowCustomInput } = toRefs(props);
const emit = defineEmits(['update:modelValue']);
const itemSelected = computed({
  get() {
    return modelValue?.value ?? {};
  },
  set(value) {
    if (!$_.isEqual(modelValue.value, value)) {
      emit("update:modelValue", value)
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

const isTyping = ref(false); // Biến mới để theo dõi trạng thái nhập liệu
const filteredData = ref([]); // Khởi tạo filteredData là một ref

const handleInput = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    pressedKey.value = searchTerm; // Cập nhật giá trị tìm kiếm
    showDropdown.value = true; // Hiển thị dropdown khi nhập liệu
    isTyping.value = searchTerm?.length > 0; // Cập nhật trạng thái nhập liệu

    // Cập nhật danh sách được lọc theo từ khóa
    filteredData.value = data.value
        .map(item => item[fieldFilter.value])
        .filter(item => item.toLowerCase().includes(searchTerm));
};


const selectItem = (event, value) => {
    if (!itemSelected.value.includes(value)) {
        itemSelected.value.push(value); // Thêm mục vào danh sách đã chọn
    }
    showDropdown.value = false; // Đóng danh sách sau khi chọn
    pressedKey.value = ''; // Đặt lại giá trị tìm kiếm
};

const focusInput = () => {
    // Đóng tất cả các dropdown khác
    document.dispatchEvent(new CustomEvent('closeAllDropdowns', { detail: showDropdown }));
    // Mở dropdown hiện tại
    showDropdown.value = true;
};

const handleClickOutside = (event) => {
    if (!event.target.closest(`.relative-${fieldFilter.value}`)) {
        showDropdown.value = false;
    }
};

const clearValue = (event) => {
    if (event) {
        event.preventDefault();
    }
    itemSelected.value = []; // Reset giá trị đã chọn
    pressedKey.value = ''; // Reset giá trị tìm kiếm
    showDropdown.value = false; // Đóng dropdown
    filteredData.value = data.value.map(item => item[fieldFilter.value]); // Reset danh sách được lọc
};

const addCustomInput = () => {
    if (pressedKey.value && !itemSelected.value.includes(pressedKey.value)) {
        itemSelected.value.push(pressedKey.value); // Thêm giá tr nhập tự do vào danh sách đã chọn
        pressedKey.value = '';
        showDropdown.value = false; // Đóng dropdown
    }
    isTyping.value = false;
    filteredData.value = data.value.map(item => item[fieldFilter.value]); // Reset danh sách được lọc

};

const removeItem = (index) => {
    itemSelected.value.splice(index, 1); // Xóa mục khỏi mảng itemSelected
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('closeAllDropdowns', (e) => {
        if (e.detail !== showDropdown) {
            showDropdown.value = false;
        }
    });
    // Khởi tạo filteredData với toàn bộ dữ liệu khi component được mount
    filteredData.value = data.value.map(item => item[fieldFilter.value]);
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

.bg-circle {
    background-color: #ff0000;
    color: #ffffff;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    margin-left: 5px;
}
</style>