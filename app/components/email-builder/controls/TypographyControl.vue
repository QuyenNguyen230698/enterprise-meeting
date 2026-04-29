<template>
  <div class="typography-control">
    <!-- Title Typography -->
    <div class="prop-divider"></div>

    <div class="spacing-section">
      <AlignmentControl
        :model-value="getPropValue('titleAlign')"
        @update:model-value="updateProp('titleAlign', $event)"
        label="Căn chỉnh tiêu đề"
        :default-align="'left'"
      />
    </div>

    <div class="spacing-section">
      <FontSizeControl
        :model-value="getPropValue('titleFontSize')"
        @update:model-value="updateProp('titleFontSize', $event)"
        label="Cỡ chữ tiêu đề"
        :sizes="titleSizes"
        :default-size="defaultTitleSize"
      />
    </div>

    <div class="spacing-section">
      <div class="prop-grid-2">
        <FontWeightControl
          :model-value="getPropValue('titleFontWeight')"
          @update:model-value="updateProp('titleFontWeight', $event)"
          :weights="weightOptions"
          :default-weight="defaultTitleWeight"
        />

        <FontStyleControl
          :model-value="getPropValue('titleFontStyle')"
          @update:model-value="updateProp('titleFontStyle', $event)"
        />
      </div>
    </div>

    <div class="spacing-section">
      <FontFamilyControl
        :model-value="getPropValue('titleFontFamily')"
        @update:model-value="updateProp('titleFontFamily', $event)"
        label="Font chữ tiêu đề"
        :fonts="fontOptions"
        :default-font="defaultTitleFont"
      />
    </div>

    <!-- Subtitle Typography -->
    <div class="prop-divider-large"></div>

    <div class="spacing-section">
      <AlignmentControl
        :model-value="getPropValue(subtitlePrefix + 'Align')"
        @update:model-value="updateProp(subtitlePrefix + 'Align', $event)"
        :label="`Căn chỉnh ${subtitleLabel}`"
        :default-align="'left'"
      />
    </div>

    <div class="spacing-section">
      <FontSizeControl
        :model-value="getPropValue(subtitlePrefix + 'FontSize')"
        @update:model-value="updateProp(subtitlePrefix + 'FontSize', $event)"
        :label="`Cỡ chữ ${subtitleLabel}`"
        :sizes="subtitleSizes"
        :default-size="defaultSubtitleSize"
      />
    </div>

    <div class="spacing-section">
      <FontWeightControl
        :model-value="getPropValue(subtitlePrefix + 'FontWeight')"
        @update:model-value="updateProp(subtitlePrefix + 'FontWeight', $event)"
        :label="`Độ đậm ${subtitleLabel}`"
        :weights="weightOptions"
        :default-weight="defaultSubtitleWeight"
      />
    </div>

    <div class="spacing-section">
      <FontFamilyControl
        :model-value="getPropValue(subtitlePrefix + 'FontFamily')"
        @update:model-value="updateProp(subtitlePrefix + 'FontFamily', $event)"
        :label="`Font chữ ${subtitleLabel}`"
        :fonts="fontOptions"
        :default-font="defaultSubtitleFont"
      />
    </div>
  </div>
</template>

<script setup>
import AlignmentControl from './AlignmentControl.vue'
import FontSizeControl from './FontSizeControl.vue'
import FontWeightControl from './FontWeightControl.vue'
import FontStyleControl from './FontStyleControl.vue'
import FontFamilyControl from './FontFamilyControl.vue'

const props = defineProps({
  elementProps: {
    type: Object,
    required: true
  },
  updateElement: {
    type: Function,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      titleSizes: ['12px', '14px', '16px', '18px', '20px', '24px'],
      subtitleSizes: ['10px', '11px', '12px', '13px', '14px'],
      defaultTitleSize: '16px',
      defaultSubtitleSize: '12px',
      defaultTitleWeight: 'bold',
      defaultSubtitleWeight: 'normal',
      defaultTitleFont: 'Arial, sans-serif',
      defaultSubtitleFont: 'Arial, sans-serif',
      subtitleLabel: 'phụ đề',
      titlePrefix: 'title',
      subtitlePrefix: 'subtitle'
    })
  }
})

const weightOptions = [
  { value: 'normal', label: 'N' },
  { value: '600', label: 'S' },
  { value: 'bold', label: 'B' }
]

const fontOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Times New Roman', Times, serif", label: 'Times' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' }
]

// Extract config values
const titleSizes = props.config.titleSizes
const subtitleSizes = props.config.subtitleSizes
const defaultTitleSize = props.config.defaultTitleSize
const defaultSubtitleSize = props.config.defaultSubtitleSize
const defaultTitleWeight = props.config.defaultTitleWeight
const defaultSubtitleWeight = props.config.defaultSubtitleWeight
const defaultTitleFont = props.config.defaultTitleFont
const defaultSubtitleFont = props.config.defaultSubtitleFont
const subtitleLabel = props.config.subtitleLabel
const subtitlePrefix = props.config.subtitlePrefix

const getPropValue = (key) => {
  return props.elementProps[key]
}

const updateProp = (key, value) => {
  props.elementProps[key] = value
  props.updateElement()
}
</script>

<style scoped>
.typography-control {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spacing-section {
  margin-bottom: 1rem;
}

.prop-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgb(226, 232, 240), transparent);
  margin: 0.5rem 0;
}

.prop-divider-large {
  height: 1px;
  background: linear-gradient(to right, transparent, rgb(226, 232, 240), transparent);
  margin: 1.5rem 0;
}

.prop-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
</style>
