<template>
    <div class="flex flex-col w-full h-full py-4 text-slate-800">
        <div class="bg-gray-50 p-4 space-y-4 border border-slate-200">
            <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-calendar-check text-xl text-emerald-600"></i>
                <h3 class="text-sm font-black uppercase tracking-widest text-slate-500">Meeting Parameters</h3>
            </div>
            <div class="mb-4">
                <label class="block text-xs font-black text-slate-500 mb-1 required uppercase tracking-widest">Meeting Title</label>
                <ejs-textbox :multiline="false" v-model="formData.title" :enabled="canEdit"
                    placeholder="Enter short meeting title" class="w-full"></ejs-textbox>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="mb-4">
                    <label class="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Conference Room</label>
                    <ejs-dropdownlist v-model="formData.roomId" :enabled="canEdit" :dataSource="roomOptions"
                        :fields="{ text: 'text', value: 'value' }" placeholder="Select room" class="w-full">
                    </ejs-dropdownlist>
                </div>
                <div class="mb-4 md:col-span-2">
                   <label class="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Project Flags</label>
                   <ejs-multiselect v-model="formData.tags" :enabled="canEdit" :dataSource="tagOptions"
                        mode="Box" placeholder="Select tags" class="w-full">
                   </ejs-multiselect>
                </div>
                <div class="mb-4">
                    <label class="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Priority Tier</label>
                    <ejs-dropdownlist v-model="formData.priority" :enabled="canEdit" :dataSource="priorityOptions"
                        :fields="{ text: 'text', value: 'value' }" placeholder="Priority"
                        class="w-full"></ejs-dropdownlist>
                </div>
                <div class="mb-4">
                    <label class="block text-xs font-black text-slate-500 mb-1 uppercase tracking-widest">Operational Status</label>
                    <ejs-dropdownlist v-model="formData.status" :enabled="canEdit" :dataSource="bookingStatusOptions"
                        :fields="{ text: 'text', value: 'value' }" placeholder="Status"
                        class="w-full"></ejs-dropdownlist>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { DropDownListComponent as EjsDropdownlist, MultiSelectComponent as EjsMultiselect } from '@syncfusion/ej2-vue-dropdowns';
import { TextBoxComponent as EjsTextbox } from '@syncfusion/ej2-vue-inputs';

const props = defineProps({
    currentUser: { type: Object, required: true },
    modelValue: { type: Object, required: true },
    modeCreate: { type: Boolean, default: false },
    isViewing: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const formData = computed({
    get() { return props.modelValue || {}; },
    set(value) { emit('update:modelValue', value); }
});

const canEdit = computed(() => {
    if (props.isViewing) return false;
    return true; 
});

const priorityOptions = [
    { text: 'Daily Sync', value: 'Daily' },
    { text: 'Urgent Action', value: 'Urgent' }
];

const bookingStatusOptions = [
    { text: 'In Progress', value: 'đang tiến hành' },
    { text: 'Completed', value: 'hoàn thành' }
];

const roomOptions = [
    { text: 'Executive Suite A', value: 'Room_A' },
    { text: 'Innovation Hub B', value: 'Room_B' },
    { text: 'Focus Room C', value: 'Room_C' }
];

const tagOptions = ['TDC', 'TDF', 'TDH', 'AnLam', 'Modulux', 'Events', 'Other'];
</script>

<style>
/* Reset all Syncfusion components to square */

.e-input-group.e-control-wrapper {
    border-color: #cbd5e1 !important;
}
</style>
