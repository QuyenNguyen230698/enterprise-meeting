<template>
  <div class="grid grid-cols-2 gap-3">
    <!-- Tỉnh/Thành phố -->
    <div>
      <label :class="labelClass">Tỉnh/Thành phố</label>
      <ComboboxDropdown
        :data="provinces"
        v-model="selectedProvince"
        field-filter="Name"
        placeholder="Chọn tỉnh/thành phố"
        @update:modelValue="handleProvinceChange"
        :allowCustomInput="false"
        :useBorder="false"
        :useAbsolute="true"
        iconSearch="bi bi-chevron-down"
        :useBgWhite="'bg-white'"
        :cssClass="inputClass"
      />
    </div>

    <!-- Phường -->
    <div>
      <label :class="labelClass">Phường/Xã</label>
      <ComboboxDropdown
        :data="wards"
        v-model="selectedWard"
        field-filter="Name"
        placeholder="Chọn phường/xã"
        :disable-component="!!selectedProvince"
        @update:modelValue="handleWardChange"
        :allowCustomInput="false"
        :useBorder="false"
        :useAbsolute="true"
        iconSearch="bi bi-chevron-down"
        :useBgWhite="'bg-white'"
        :cssClass="inputClass"
      />
    </div>

    <!-- Địa chỉ cụ thể -->
    <div class="col-span-2">
      <label :class="labelClass">Địa chỉ cụ thể</label>
      <input
        v-model="street"
        type="text"
        placeholder="Số nhà, tên đường"
        :class="inputClass"
      />
    </div>
  </div>
</template>

<script setup>
import addressData from '../../data/address/data.json'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  darkTheme: {
    type: Boolean,
    default: false,
  },
  labelClass: {
    type: String,
    default: 'block text-sm font-medium text-gray-700 mb-1',
  },
  inputClass: {
    type: String,
    default: 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500',
  },
})

const emit = defineEmits(['update:modelValue'])

const provinces = ref(addressData)
const wards = ref([])
const selectedProvince = ref('')
const selectedWard = ref('')
const street = ref('')
const isInitialized = ref(false)

const handleProvinceChange = (provinceName) => {
  
  const selectedProvinceData = provinces.value.find(
    (province) => province.Name === provinceName
  )
  
  
  wards.value = selectedProvinceData ? selectedProvinceData.Wards : []

  // Clear ward if it doesn't exist in new province's wards
  if (selectedWard.value && wards.value.length > 0) {
    const wardExists = wards.value.some((ward) => ward.Name === selectedWard.value)
    if (!wardExists) {
      selectedWard.value = ''
    }
  }
}

const handleWardChange = (wardName) => {
}

const full_address = computed(() => {
  const parts = [
    street.value,
    selectedWard.value,
    selectedProvince.value,
  ].filter((part) => part)
  return parts.join(', ')
})

watch(full_address, (newAddress) => {
  
  if (isInitialized.value) {
    emit('update:modelValue', newAddress)
  } else {
  }
})

const parseAddress = (addressString) => {
  
  if (!addressString) {
    return
  }
  
  const parts = addressString.split(',').map((part) => part.trim())
  
  if (parts.length >= 2) {
    const potentialProvince = parts[parts.length - 1]
    const potentialWard = parts[parts.length - 2]
    const potentialStreet = parts.slice(0, -2).join(', ')
    
  
    
    const provinceData = provinces.value.find(
      (province) => province.Name === potentialProvince
    )
    
    if (provinceData) {
      selectedProvince.value = potentialProvince
      wards.value = provinceData.Wards || []
      
      const wardData = wards.value.find(
        (ward) => ward.Name === potentialWard
      )
      
      if (wardData) {
        selectedWard.value = potentialWard
      } 
      
      street.value = potentialStreet
    } else {
      street.value = addressString
    }
  } else {
    street.value = addressString
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    
    if (!isInitialized.value) {
      parseAddress(newValue)
      // Force initialize immediately
      isInitialized.value = true
    }
  },
  { immediate: true }
)

const provinceCode = computed(() => {
  const selectedProvinceData = provinces.value.find(
    (province) => province.Name === selectedProvince.value
  )
  return selectedProvinceData ? selectedProvinceData.Code : ''
})

const wardCode = computed(() => {
  const selectedWardData = wards.value.find(
    (ward) => ward.Name === selectedWard.value
  )
  return selectedWardData ? selectedWardData.Code : ''
})

const isAddressValid = computed(() => {
  return selectedProvince.value && selectedWard.value && street.value.trim()
})

defineExpose({
  provinceName: selectedProvince,
  provinceCode,
  wardName: selectedWard,
  wardCode,
  street,
  full_address,
  isAddressValid,
})
</script>

<style scoped>
/* Modern styling for address component */
</style>