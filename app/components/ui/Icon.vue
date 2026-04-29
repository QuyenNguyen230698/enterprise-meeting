<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icons[name]?.viewBox || '0 0 24 24'"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      v-if="icons[name]?.path"
      :d="icons[name].path"
      :stroke="stroke || 'currentColor'"
      :fill="fill || 'none'"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <g v-else-if="icons[name]?.paths">
      <path
        v-for="(path, index) in icons[name].paths"
        :key="index"
        :d="path.d"
        :stroke="path.stroke || stroke || 'currentColor'"
        :fill="path.fill || fill || 'none'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 24
  },
  stroke: {
    type: String,
    default: null
  },
  fill: {
    type: String,
    default: null
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  className: {
    type: String,
    default: ''
  }
})

// SVG Icons library
const icons = {
  // Actions
  'save': {
    viewBox: '0 0 24 24',
    path: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8'
  },
  'download': {
    viewBox: '0 0 24 24',
    path: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3'
  },
  'upload': {
    viewBox: '0 0 24 24',
    path: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12'
  },
  'trash': {
    viewBox: '0 0 24 24',
    path: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6'
  },
  'undo': {
    viewBox: '0 0 24 24',
    path: 'M3 7v6h6 M21 17a9 9 0 0 0-9-9 9 9 0 0 0-9 9'
  },
  'redo': {
    viewBox: '0 0 24 24',
    path: 'M21 7v6h-6 M3 17a9 9 0 0 1 9-9 9 9 0 0 1 9 9'
  },
  'copy': {
    viewBox: '0 0 24 24',
    path: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2'
  },
  'edit': {
    viewBox: '0 0 24 24',
    path: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
  },
  'eye': {
    viewBox: '0 0 24 24',
    paths: [
      { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
      { d: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' }
    ]
  },
  'close': {
    viewBox: '0 0 24 24',
    path: 'M18 6L6 18 M6 6l12 12'
  },
  'check': {
    viewBox: '0 0 24 24',
    path: 'M20 6L9 17l-5-5'
  },
  'plus': {
    viewBox: '0 0 24 24',
    path: 'M12 5v14 M5 12h14'
  },
  'menu': {
    viewBox: '0 0 24 24',
    path: 'M3 12h18 M3 6h18 M3 18h18'
  },
  'image': {
    viewBox: '0 0 24 24',
    paths: [
      { d: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z' },
      { d: 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
      { d: 'M21 15l-5-5L5 21' }
    ]
  },
  'video': {
    viewBox: '0 0 24 24',
    paths: [
      { d: 'M23 7l-7 5 7 5V7z' },
      { d: 'M16 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z' }
    ]
  },
  'text': {
    viewBox: '0 0 24 24',
    path: 'M4 7V4h16v3 M9 20h6 M12 4v16'
  },
  'heading': {
    viewBox: '0 0 24 24',
    path: 'M6 4v7m0 0v9m0-9h12m0-7v7m0 0v9'
  },
  'link': {
    viewBox: '0 0 24 24',
    path: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
  },
  'layout': {
    viewBox: '0 0 24 24',
    paths: [
      { d: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z' },
      { d: 'M3 9h18 M9 21V9' }
    ]
  },
  'code': {
    viewBox: '0 0 24 24',
    path: 'M16 18l6-6-6-6 M8 6l-6 6 6 6'
  },
  'chevron-down': {
    viewBox: '0 0 24 24',
    path: 'M6 9l6 6 6-6'
  },
  'file-code': {
    viewBox: '0 0 24 24',
    paths: [
      { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
      { d: 'M14 2v6h6 M16 13l-3.5 3.5L16 20 M8 13l3.5 3.5L8 20' }
    ]
  },
  'map': {
    viewBox: '0 0 24 24',
    path: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16'
  }
}
</script>
