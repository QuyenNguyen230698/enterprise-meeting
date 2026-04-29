<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label v-if="label" class="text-xs font-medium text-slate-700">{{ label }}</label>
      <button
        @click="addLink"
        class="prop-btn prop-btn-primary"
      >
        <i class="bi bi-plus text-xs"></i>
        {{ addButtonText }}
      </button>
    </div>

    <div
      v-if="!links || links.length === 0"
      class="text-xs text-slate-400 italic py-2 text-center"
    >
      {{ emptyMessage }}
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(link, index) in links"
        :key="index"
        class="prop-item-card"
      >
        <div class="prop-item-header">
          <input
            v-model="link[textField]"
            @input="emitUpdate"
            type="text"
            class="prop-input flex-1"
            :placeholder="textPlaceholder"
          />
          <button
            @click="removeLink(index)"
            class="prop-btn prop-btn-danger"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <input
          v-model="link[urlField]"
          @input="emitUpdate"
          type="url"
          class="prop-input"
          :placeholder="urlPlaceholder"
        />
        <slot name="extra-field" :link="link" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  textField: {
    type: String,
    default: 'text'
  },
  urlField: {
    type: String,
    default: 'url'
  },
  textPlaceholder: {
    type: String,
    default: 'Tên link'
  },
  urlPlaceholder: {
    type: String,
    default: 'https://...'
  },
  emptyMessage: {
    type: String,
    default: 'Chưa có link'
  },
  addButtonText: {
    type: String,
    default: 'Thêm'
  },
  defaultLinkTemplate: {
    type: Object,
    default: () => ({ text: '', url: '' })
  }
})

const emit = defineEmits(['update:modelValue'])

const links = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const addLink = () => {
  const newLinks = [...links.value]
  newLinks.push({ ...props.defaultLinkTemplate })
  emit('update:modelValue', newLinks)
}

const removeLink = (index) => {
  const newLinks = links.value.filter((_, i) => i !== index)
  emit('update:modelValue', newLinks)
}

const emitUpdate = () => {
  emit('update:modelValue', links.value)
}
</script>

<style scoped>
.prop-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.prop-btn-primary {
  background-color: rgb(99, 102, 241);
  color: white;
}

.prop-btn-primary:hover {
  background-color: rgb(79, 70, 229);
}

.prop-btn-danger {
  background-color: rgb(239, 68, 68);
  color: white;
  padding: 0.375rem;
}

.prop-btn-danger:hover {
  background-color: rgb(220, 38, 38);
}

.prop-item-card {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid rgb(226, 232, 240);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prop-item-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.prop-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid rgb(226, 232, 240);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.prop-input:focus {
  outline: none;
  border-color: rgb(99, 102, 241);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
