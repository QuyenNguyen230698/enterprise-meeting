<template>
  <div class="border-b border-gray-300" :style="blockStyle">
    <!-- Section label -->
    <div class="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
      <p class="text-xs font-bold text-gray-600">THÔNG TIN CÁC BÊN / PARTIES</p>
    </div>

    <div class="grid text-sm" :class="content.showPartyB ? 'grid-cols-2' : 'grid-cols-1'">

      <!-- Bên A — người lập / nhân viên -->
      <div class="border-r border-gray-200 px-3 py-3 space-y-2" :class="{ 'border-r-0': !content.showPartyB }">
        <p class="text-xs font-bold text-blue-700 uppercase tracking-wide">Bên A — Người lập / Prepared by</p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <InfoRowInline label="Họ và tên" labelEn="Full Name" value="{{employee_name}}" placeholder />
          <InfoRowInline label="Mã NV" labelEn="E.Code" value="{{employee_code}}" placeholder />
          <InfoRowInline label="Phòng ban" labelEn="Department" value="{{department}}" placeholder />
          <InfoRowInline label="Chức danh" labelEn="Position" value="{{job_title}}" placeholder />
          <InfoRowInline label="Đơn vị" labelEn="Unit" value="{{dept_code}}" placeholder />
          <InfoRowInline label="Ngày lập" labelEn="Date" value="{{today}}" placeholder />
        </div>
        <!-- Additional custom fields -->
        <div v-if="editable" class="mt-2 pt-2 border-t border-dashed border-gray-200">
          <p class="text-[10px] text-gray-400 font-semibold mb-1.5">Thông tin bổ sung Bên A</p>
          <div v-for="(field, idx) in content.partyAExtra || []" :key="idx" class="flex items-center gap-1.5 mb-1">
            <input
              :value="field.label"
              @input="updateExtraField('partyAExtra', idx, 'label', $event.target.value)"
              class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Tên trường..."
            />
            <input
              :value="field.value"
              @input="updateExtraField('partyAExtra', idx, 'value', $event.target.value)"
              class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Nội dung..."
            />
            <button @click="removeExtraField('partyAExtra', idx)" class="text-red-400 hover:text-red-600 text-xs shrink-0">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <button
            @click="addExtraField('partyAExtra')"
            class="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          ><i class="bi bi-plus mr-0.5"></i>Thêm trường</button>
        </div>
        <div v-else>
          <div v-for="(field, idx) in content.partyAExtra || []" :key="idx" class="flex gap-2 text-xs mt-1">
            <span class="text-gray-500 font-medium w-24 shrink-0">{{ field.label }}:</span>
            <span class="text-gray-800">{{ field.value }}</span>
          </div>
        </div>
      </div>

      <!-- Bên B (optional) -->
      <div v-if="content.showPartyB" class="px-3 py-3 space-y-2">
        <p class="text-xs font-bold text-purple-700 uppercase tracking-wide">
          <template v-if="editable">
            <input
              :value="content.partyBLabel || 'Bên B'"
              @input="emit('update:content', { ...content, partyBLabel: $event.target.value })"
              class="bg-transparent border-b border-dashed border-purple-300 focus:outline-none font-bold text-purple-700 uppercase tracking-wide text-xs w-auto"
              placeholder="Bên B"
            /> —
            <input
              :value="content.partyBLabelEn || 'Party B'"
              @input="emit('update:content', { ...content, partyBLabelEn: $event.target.value })"
              class="bg-transparent border-b border-dashed border-purple-200 focus:outline-none italic text-xs text-purple-600"
              placeholder="Party B"
            />
          </template>
          <template v-else>
            {{ content.partyBLabel || 'Bên B' }} — <span class="font-normal italic">{{ content.partyBLabelEn || 'Party B' }}</span>
          </template>
        </p>
        <!-- Party B extra fields -->
        <div v-if="editable" class="space-y-1.5">
          <div v-for="(field, idx) in content.partyBFields || defaultPartyBFields" :key="idx" class="flex items-center gap-1.5">
            <input
              :value="field.label"
              @input="updatePartyBField(idx, 'label', $event.target.value)"
              class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Tên trường..."
            />
            <input
              :value="field.value"
              @input="updatePartyBField(idx, 'value', $event.target.value)"
              class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Nội dung..."
            />
            <button @click="removePartyBField(idx)" class="text-red-400 hover:text-red-600 text-xs shrink-0">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <button @click="addPartyBField" class="text-xs text-blue-600 hover:text-blue-800 font-semibold">
            <i class="bi bi-plus mr-0.5"></i>Thêm trường
          </button>
        </div>
        <div v-else class="space-y-1">
          <div v-for="(field, idx) in content.partyBFields || defaultPartyBFields" :key="idx" class="flex gap-2 text-xs">
            <span class="text-gray-500 font-medium w-24 shrink-0">{{ field.label }}:</span>
            <span class="text-gray-800 font-semibold">{{ field.value || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({}) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:content'])

const defaultPartyBFields = [
  { label: 'Họ và tên', value: '' },
  { label: 'Chức danh', value: '' },
  { label: 'Phòng ban', value: '' },
  { label: 'Số ĐT', value: '' },
]

const updateExtraField = (key, idx, field, val) => {
  const arr = [...(props.content[key] || [])]
  arr[idx] = { ...arr[idx], [field]: val }
  emit('update:content', { ...props.content, [key]: arr })
}

const addExtraField = (key) => {
  const arr = [...(props.content[key] || []), { label: '', value: '' }]
  emit('update:content', { ...props.content, [key]: arr })
}

const removeExtraField = (key, idx) => {
  const arr = (props.content[key] || []).filter((_, i) => i !== idx)
  emit('update:content', { ...props.content, [key]: arr })
}

const updatePartyBField = (idx, field, val) => {
  const arr = [...(props.content.partyBFields || defaultPartyBFields)]
  arr[idx] = { ...arr[idx], [field]: val }
  emit('update:content', { ...props.content, partyBFields: arr })
}

const addPartyBField = () => {
  const arr = [...(props.content.partyBFields || defaultPartyBFields), { label: '', value: '' }]
  emit('update:content', { ...props.content, partyBFields: arr })
}

const removePartyBField = (idx) => {
  const arr = (props.content.partyBFields || defaultPartyBFields).filter((_, i) => i !== idx)
  emit('update:content', { ...props.content, partyBFields: arr })
}
</script>
