<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999] flex p-2 md:p-4 items-center justify-center"
    @click.self="emit('close')"
  >
    <div
      class="bg-white w-full max-h-[100dvh] md:max-h-[90vh] h-full md:h-auto md:max-w-7xl rounded-lg shadow-2xl flex flex-col"
    >
      <!-- HEADER -->
      <div
        class="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b bg-gradient-to-r from-gray-50 to-gray-100"
      >
        <div class="flex items-center gap-2 md:gap-3">
          <i class="bi bi-code-square text-blue-600 text-lg md:text-xl"></i>
          <span class="font-semibold text-gray-800 text-sm md:text-base"
            >HTML Editor</span
          >
          <span
            class="hidden md:inline text-xs text-gray-500 px-2 py-0.5 bg-white rounded border"
          >
            Lines: {{ actualLineCount }}
          </span>
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <!-- Desktop: Theme Selector -->
          <select
            v-model="currentTheme"
            class="hidden md:block px-3 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :style="{
              backgroundColor: themes[currentTheme].bg,
              color: themes[currentTheme].text,
              borderColor: themes[currentTheme].lineNumber,
            }"
          >
            <option
              v-for="(theme, key) in themes"
              :key="key"
              :value="key"
              :style="{ backgroundColor: theme.bg, color: theme.text }"
            >
              {{ theme.name }}
            </option>
          </select>

          <!-- Mobile: Essential Actions Only -->
          <div class="flex gap-1 md:hidden">
            <button
              @click="undo"
              class="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-40"
              title="Undo"
              :disabled="!canUndo"
            >
              <i class="bi bi-arrow-counterclockwise text-sm"></i>
            </button>
            <button
              @click="redo"
              class="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-40"
              title="Redo"
              :disabled="!canRedo"
            >
              <i class="bi bi-arrow-clockwise text-sm"></i>
            </button>
          </div>

          <!-- Desktop: Full Actions -->
          <div class="hidden md:flex gap-1 border-l pl-2 ml-2">
            <button
              @click="expandAll"
              class="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Expand All"
            >
              <i class="bi bi-arrows-expand"></i>
            </button>
            <button
              @click="collapseAll"
              class="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Collapse All"
            >
              <i class="bi bi-arrows-collapse"></i>
            </button>
            <button
              @click="undo"
              class="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
              :disabled="!canUndo"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
            <button
              @click="redo"
              class="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
              :disabled="!canRedo"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          <!-- Mobile: Essential Actions -->
          <div class="flex gap-1 md:hidden">
            <button
              @click="formatCode"
              class="px-2 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Format"
            >
              <i class="bi bi-code-slash"></i>
            </button>
            <button
              @click="copyCode"
              class="px-2 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Copy"
            >
              <i class="bi bi-clipboard"></i>
            </button>
          </div>

          <!-- Desktop: More Actions -->
          <div class="hidden md:flex gap-1 border-l pl-2 ml-2">
            <button
              @click="discardChanges"
              class="px-3 py-1.5 text-xs font-medium rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
              title="Discard Changes"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              Discard
            </button>
            <button
              @click="formatCode"
              class="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1"
              title="Format Code (Alt+Shift+F)"
            >
              <i class="bi bi-code-slash"></i>
              Format
            </button>
            <button
              @click="copyCode"
              class="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1"
              title="Copy Code"
            >
              <i class="bi bi-clipboard"></i>
              Copy
            </button>
          </div>

          <button
            @click="handleClose"
            class="p-1.5 md:p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
            title="Close"
          >
            <i class="bi bi-x-lg text-sm md:text-base"></i>
          </button>
        </div>
      </div>

      <!-- EDITOR -->
      <div
        class="flex-1 flex overflow-hidden"
        :style="{ backgroundColor: themes[currentTheme].bg }"
      >
        <!-- Gutter - Line Numbers -->
        <div
          class="flex border-r select-none"
          :style="{
            backgroundColor: themes[currentTheme].gutter,
            borderColor: themes[currentTheme].lineNumber + '40',
          }"
        >
          <!-- Fold Controls - Desktop Only -->
          <div class="hidden md:block w-8">
            <div ref="foldColumn" class="will-change-transform">
              <div
                v-for="(line, idx) in displayLines"
                :key="'f-' + idx"
                class="h-6 md:h-5 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                @click="line.canFold && toggleFold(line.sourceIndex)"
              >
                <i
                  v-if="line.canFold"
                  class="bi text-xs transition-transform"
                  :class="
                    line.isCollapsed ? 'bi-chevron-right' : 'bi-chevron-down'
                  "
                  :style="{ color: themes[currentTheme].lineNumber }"
                />
              </div>
            </div>
          </div>

          <!-- Line Numbers -->
          <div class="w-10 md:w-12 text-right pr-2 md:pr-3">
            <div ref="lineNumberColumn" class="will-change-transform">
              <div
                v-for="(line, idx) in displayLines"
                :key="'n-' + idx"
                class="h-6 md:h-5 flex items-center justify-end text-xs md:text-xs font-mono cursor-pointer hover:bg-white/5 transition-colors"
                :style="{
                  color: themes[currentTheme].lineNumber,
                }"
              >
                {{ line.displayNumber }}
              </div>
            </div>
          </div>
        </div>

        <!-- CODE EDITOR -->
        <div
          ref="editorWrapper"
          class="flex-1 overflow-auto relative"
          @scroll="onEditorScroll"
          :style="{
            backgroundColor: themes[currentTheme].bg,
            minHeight: '300px',
          }"
        >
          <div
            ref="highlightLayer"
            class="absolute top-0 left-0 right-0 bottom-0 px-2 md:px-4 py-0 font-mono text-base md:text-sm leading-6 md:leading-5 pointer-events-none select-none whitespace-pre"
            :style="{
              color: themes[currentTheme].text,
              overflow: 'visible',
            }"
            v-html="highlightedContent"
          />

          <div
            ref="editorEl"
            class="px-2 md:px-4 py-0 font-mono text-base md:text-sm leading-6 md:leading-5 whitespace-pre min-h-full"
            contenteditable="true"
            spellcheck="false"
            @keydown="onKeyDown"
            @beforeinput="onBeforeInput"
            @input="onInput"
            :style="{
              backgroundColor: 'transparent',
              color: 'transparent',
              caretColor: themes[currentTheme].text,
              tabSize: 2,
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              zIndex: 1,
            }"
          />
        </div>
      </div>

      <!-- FOOTER -->
      <div
        class="px-4 py-2 border-t flex justify-between items-center text-xs"
        :style="{
          backgroundColor: themes[currentTheme].gutter,
          color: themes[currentTheme].text,
          borderColor: themes[currentTheme].lineNumber + '40',
        }"
      >
        <div class="flex gap-2 lg:gap-4">
          <span class="hidden lg:flex items-center gap-1">
            <i class="bi bi-file-text"></i>
            {{ actualLineCount }} lines
          </span>
          <span class="hidden lg:flex items-center gap-1">
            <i class="bi bi-type"></i>
            {{ source.length }} chars
          </span>
          <span class="hidden lg:flex items-center gap-1">
            <i class="bi bi-eye"></i>
            Showing {{ visibleLineCount }}
          </span>
        </div>

        <div class="flex gap-2 items-center">
          <button
            class="px-4 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="px-4 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            @click="apply"
          >
            <i class="bi bi-check-lg"></i>
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isVisible: Boolean,
  htmlCode: String,
});
const emit = defineEmits(["close", "apply"]);

const HISTORY_KEY = "html-editor-history";
const HISTORY_INDEX_KEY = "html-editor-history-index";

const editorEl = ref(null);
const editorWrapper = ref(null);
const highlightLayer = ref(null);
const foldColumn = ref(null);
const lineNumberColumn = ref(null);

const source = ref("");
const originalSource = ref(""); // Store original for discard
const collapsed = ref(new Set());
const currentTheme = ref("vs-dark");
const isUpdating = ref(false);

// Undo/Redo history
const history = ref([]);
const historyIndex = ref(-1);
const maxHistory = 50;

/* ================= THEMES ================= */
const themes = {
  "vs-dark": {
    name: "VS Code Dark",
    bg: "#1e1e1e",
    gutter: "#252526",
    text: "#d4d4d4",
    lineNumber: "#858585",
    tag: "#4ec9b0",
    attribute: "#9cdcfe",
    string: "#ce9178",
    comment: "#6a9955",
  },
  "vs-light": {
    name: "VS Code Light",
    bg: "#ffffff",
    gutter: "#f3f3f3",
    text: "#000000",
    lineNumber: "#237893",
    tag: "#800000",
    attribute: "#0451a5",
    string: "#a31515",
    comment: "#008000",
  },
  monokai: {
    name: "Monokai Pro",
    bg: "#2d2a2e",
    gutter: "#221f22",
    text: "#fcfcfa",
    lineNumber: "#727072",
    tag: "#ff6188",
    attribute: "#ffd866",
    string: "#a9dc76",
    comment: "#727072",
  },
  dracula: {
    name: "Dracula",
    bg: "#282a36",
    gutter: "#21222c",
    text: "#f8f8f2",
    lineNumber: "#6272a4",
    tag: "#ff79c6",
    attribute: "#50fa7b",
    string: "#f1fa8c",
    comment: "#6272a4",
  },
  "github-dark": {
    name: "GitHub Dark",
    bg: "#0d1117",
    gutter: "#161b22",
    text: "#c9d1d9",
    lineNumber: "#8b949e",
    tag: "#7ee787",
    attribute: "#79c0ff",
    string: "#a5d6ff",
    comment: "#8b949e",
  },
  "tokyo-night": {
    name: "Tokyo Night",
    bg: "#1a1b26",
    gutter: "#16161e",
    text: "#a9b1d6",
    lineNumber: "#565f89",
    tag: "#f7768e",
    attribute: "#7dcfff",
    string: "#9ece6a",
    comment: "#565f89",
  },
  nord: {
    name: "Nord",
    bg: "#2e3440",
    gutter: "#3b4252",
    text: "#eceff4",
    lineNumber: "#4c566a",
    tag: "#88c0d0",
    attribute: "#8fbcbb",
    string: "#a3be8c",
    comment: "#616e88",
  },
  "one-dark": {
    name: "One Dark Pro",
    bg: "#282c34",
    gutter: "#21252b",
    text: "#abb2bf",
    lineNumber: "#5c6370",
    tag: "#e06c75",
    attribute: "#61afef",
    string: "#98c379",
    comment: "#5c6370",
  },
  "material-ocean": {
    name: "Material Ocean",
    bg: "#0f111a",
    gutter: "#090b10",
    text: "#8f93a2",
    lineNumber: "#464b5d",
    tag: "#89ddff",
    attribute: "#82aaff",
    string: "#c3e88d",
    comment: "#464b5d",
  },
  "gruvbox-dark": {
    name: "Gruvbox Dark",
    bg: "#282828",
    gutter: "#1d2021",
    text: "#ebdbb2",
    lineNumber: "#928374",
    tag: "#fe8019",
    attribute: "#fabd2f",
    string: "#b8bb26",
    comment: "#928374",
  },
  "ayu-dark": {
    name: "Ayu Dark",
    bg: "#0a0e14",
    gutter: "#01060e",
    text: "#b3b1ad",
    lineNumber: "#4d5566",
    tag: "#ff8f40",
    attribute: "#ffb454",
    string: "#aad94c",
    comment: "#626a73",
  },
  synthwave: {
    name: "Synthwave 84",
    bg: "#262335",
    gutter: "#1f1b2e",
    text: "#f0eff1",
    lineNumber: "#848bbd",
    tag: "#ff7edb",
    attribute: "#fede5d",
    string: "#72f1b8",
    comment: "#848bbd",
  },
  cyberpunk: {
    name: "Cyberpunk",
    bg: "#000b1e",
    gutter: "#00061a",
    text: "#00ffff",
    lineNumber: "#ff00ff",
    tag: "#ff00ff",
    attribute: "#00ff88",
    string: "#ffaa00",
    comment: "#7f7f7f",
  },
  forest: {
    name: "Forest Night",
    bg: "#1e2326",
    gutter: "#181b1e",
    text: "#d3c6aa",
    lineNumber: "#7a8478",
    tag: "#a7c080",
    attribute: "#dbbc7f",
    string: "#83c092",
    comment: "#7a8478",
  },
  "rose-pine": {
    name: "Rosé Pine",
    bg: "#191724",
    gutter: "#1f1d2e",
    text: "#e0def4",
    lineNumber: "#6e6a86",
    tag: "#ebbcba",
    attribute: "#f6c177",
    string: "#9ccfd8",
    comment: "#6e6a86",
  },
  catppuccin: {
    name: "Catppuccin Mocha",
    bg: "#1e1e2e",
    gutter: "#181825",
    text: "#cdd6f4",
    lineNumber: "#6c7086",
    tag: "#f5c2e7",
    attribute: "#89dceb",
    string: "#a6e3a1",
    comment: "#6c7086",
  },
  moonlight: {
    name: "Moonlight",
    bg: "#212337",
    gutter: "#1e1e2e",
    text: "#c8d3f5",
    lineNumber: "#7a88cf",
    tag: "#c099ff",
    attribute: "#86e1fc",
    string: "#c3e88d",
    comment: "#7a88cf",
  },
  palenight: {
    name: "Palenight",
    bg: "#292d3e",
    gutter: "#1f2233",
    text: "#a6accd",
    lineNumber: "#676e95",
    tag: "#f07178",
    attribute: "#82aaff",
    string: "#c3e88d",
    comment: "#676e95",
  },
  "ayu-mirage": {
    name: "Ayu Mirage",
    bg: "#1f2430",
    gutter: "#191e2a",
    text: "#cbccc6",
    lineNumber: "#707a8c",
    tag: "#ffa759",
    attribute: "#ffd580",
    string: "#bae67e",
    comment: "#5c6773",
  },
  "night-owl": {
    name: "Night Owl",
    bg: "#011627",
    gutter: "#010e1a",
    text: "#d6deeb",
    lineNumber: "#5f7e97",
    tag: "#c792ea",
    attribute: "#82aaff",
    string: "#ecc48d",
    comment: "#637777",
  },
};

/* ================= INIT ================= */
const loadTheme = () => {
  const saved = localStorage.getItem("html-editor-theme");
  if (saved && themes[saved]) {
    currentTheme.value = saved;
  }
};

const loadHistory = () => {
  try {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedIndex = localStorage.getItem(HISTORY_INDEX_KEY);

    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Only load if history exists and is valid
      if (Array.isArray(parsed) && parsed.length > 0) {
        history.value = parsed;
        historyIndex.value = savedIndex
          ? parseInt(savedIndex)
          : parsed.length - 1;
        return;
      }
    }
  } catch (e) {
    console.error("Failed to load history:", e);
  }

  // Init with current source
  initHistory();
};

const initHistory = () => {
  history.value = [source.value];
  historyIndex.value = 0;
  saveHistory();
};

const saveHistory = () => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value));
    localStorage.setItem(HISTORY_INDEX_KEY, historyIndex.value.toString());
  } catch (e) {
    console.error("Failed to save history:", e);
  }
};

const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(HISTORY_INDEX_KEY);
  history.value = [];
  historyIndex.value = -1;
};

loadTheme();

watch(
  () => currentTheme.value,
  (newTheme) => {
    localStorage.setItem("html-editor-theme", newTheme);
  },
);

// Watch htmlCode prop - sync to source when changed
watch(
  () => props.htmlCode,
  (newValue) => {
    if (newValue !== undefined && newValue !== null) {
      source.value = newValue;
      originalSource.value = newValue; // Save original
      nextTick(() => {
        updateEditorContent();
      });
    }
  },
  { immediate: true },
);

// Watch visibility - setup editor when opened
watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      // Reset state
      collapsed.value = new Set();

      // Save original source for discard
      originalSource.value = source.value;

      // Load or init history
      if (history.value.length === 0) {
        loadHistory();
      }

      // Update editor with current source
      nextTick(() => {
        updateEditorContent();

        // Focus editor
        if (editorEl.value) {
          editorEl.value.focus();
        }
      });
    } else {
      // Clear when closed
      clearHistory();
    }
  },
);

const sourceLines = computed(() => source.value.split("\n"));
const actualLineCount = computed(() => sourceLines.value.length);

/* ================= SYNTAX HIGHLIGHTING ================= */
const highlightedContent = computed(() => {
  // Always use source, not getVisibleContent for highlighting
  // getVisibleContent is only for displayLines calculation
  const content =
    collapsed.value.size === 0 ? source.value : getVisibleContent();
  return highlightHTML(content);
});

const highlightHTML = (text) => {
  if (!text) return "";

  const theme = themes[currentTheme.value];
  let result = escapeHTML(text);

  // HTML Comments <!-- ... -->
  result = result.replace(
    /(&lt;!--[\s\S]*?--&gt;)/g,
    `<span style="color: ${theme.comment}; font-style: italic;">$1</span>`,
  );

  // DOCTYPE
  result = result.replace(
    /(&lt;!DOCTYPE[^&]*&gt;)/gi,
    `<span style="color: ${theme.tag}; font-weight: bold;">$1</span>`,
  );

  // Self-closing tags and opening/closing tags
  // Match: &lt; followed by optional /, tagname, attributes, and &gt;
  result = result.replace(
    /(&lt;)(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^&]|&(?!gt;))*?)(\/?&gt;)/g,
    (match, openBracket, slash, tagName, rest, closeBracket) => {
      // Highlight the tag brackets and name
      let highlighted = `<span style="color: ${theme.tag}">${openBracket}${slash}${tagName}</span>`;

      // Highlight attributes in the rest part
      if (rest.trim()) {
        const highlightedAttrs = rest.replace(
          /([a-zA-Z][a-zA-Z0-9-]*)(=)(&quot;|&#39;|")?([^&"']*?)(\3)?(?=\s|$|&gt;|\/)/g,
          (m, attrName, equals, quote1, value, quote2) => {
            const q = quote1 || "";
            return `<span style="color: ${theme.attribute}">${attrName}</span>${equals}<span style="color: ${theme.string}">${q}${value}${quote2 || ""}</span>`;
          },
        );
        highlighted += highlightedAttrs;
      }

      highlighted += `<span style="color: ${theme.tag}">${closeBracket}</span>`;
      return highlighted;
    },
  );

  return result;
};

const escapeHTML = (text) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

/* ================= EDITOR CONTENT UPDATE ================= */
const updateEditorContent = () => {
  if (!editorEl.value || isUpdating.value) return;

  isUpdating.value = true;

  // Save cursor position
  const selection = window.getSelection();
  let cursorOffset = 0;
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorEl.value.contains(range.startContainer)) {
      cursorOffset = range.startOffset;
    }
  }

  // Get visible content based on collapsed state
  const visibleContent = getVisibleContent();

  // Update both layers
  editorEl.value.textContent = visibleContent;

  // Highlight layer will update via computed property

  // Restore cursor position
  nextTick(() => {
    try {
      if (editorEl.value.firstChild && cursorOffset > 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        const textNode = editorEl.value.firstChild;
        const maxOffset = textNode.textContent.length;

        range.setStart(textNode, Math.min(cursorOffset, maxOffset));
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      // Ignore cursor restoration errors
    }
    isUpdating.value = false;
  });
};

const getVisibleContent = () => {
  if (collapsed.value.size === 0) {
    return source.value;
  }

  const lines = sourceLines.value;
  const visibleLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (collapsed.value.has(i)) {
      const endLine = findClosing(i);
      const hiddenCount = endLine - i;

      // Show collapsed line with indicator
      visibleLines.push(lines[i] + ` ⋯ ${hiddenCount} lines`);

      // Skip hidden lines
      i = endLine;
    } else {
      visibleLines.push(lines[i]);
    }
  }

  return visibleLines.join("\n");
};

/* ================= HISTORY (UNDO/REDO) ================= */
const addHistory = (value) => {
  // Remove future history
  history.value = history.value.slice(0, historyIndex.value + 1);

  // Don't add if same as current
  if (history.value[historyIndex.value] === value) return;

  // Add new state
  history.value.push(value);
  historyIndex.value++;

  // Limit history size
  if (history.value.length > maxHistory) {
    history.value.shift();
    historyIndex.value--;
  }

  saveHistory();
};

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

const undo = () => {
  if (!canUndo.value) return;

  historyIndex.value--;
  source.value = history.value[historyIndex.value];
  collapsed.value = new Set();
  updateEditorContent();
  saveHistory();
};

const redo = () => {
  if (!canRedo.value) return;

  historyIndex.value++;
  source.value = history.value[historyIndex.value];
  collapsed.value = new Set();
  updateEditorContent();
  saveHistory();
};

/* ================= SCROLL SYNC ================= */
const onEditorScroll = (e) => {
  const scrollTop = e.target.scrollTop;
  const scrollLeft = e.target.scrollLeft;

  if (foldColumn.value) {
    foldColumn.value.style.transform = `translate3d(0, -${scrollTop}px, 0)`;
  }

  if (lineNumberColumn.value) {
    lineNumberColumn.value.style.transform = `translate3d(0, -${scrollTop}px, 0)`;
  }

  // Sync highlight layer using scroll (since it's position: absolute with inset)
  if (highlightLayer.value) {
    highlightLayer.value.scrollTop = scrollTop;
    highlightLayer.value.scrollLeft = scrollLeft;
  }
};

/* ================= LINE MANAGEMENT ================= */
const canFold = (lineIndex) => {
  const line = sourceLines.value[lineIndex]?.trim();
  if (!line) return false;

  return (
    line.startsWith("<") &&
    !line.startsWith("</") &&
    !line.includes("/>") &&
    !line.startsWith("<!--") &&
    !line.startsWith("<!DOCTYPE")
  );
};

const findClosing = (start) => {
  const line = sourceLines.value[start];
  const match = line.match(/<([a-zA-Z][a-zA-Z0-9]*)/);
  if (!match) return start;

  const tag = match[1];
  let depth = 1;

  for (let i = start + 1; i < sourceLines.value.length; i++) {
    const currentLine = sourceLines.value[i];

    const openMatches = currentLine.match(new RegExp(`<${tag}[\\s>]`, "g"));
    if (openMatches) depth += openMatches.length;

    const closeMatches = currentLine.match(new RegExp(`</${tag}>`, "g"));
    if (closeMatches) {
      depth -= closeMatches.length;
      if (depth === 0) return i;
    }
  }

  return start;
};

const displayLines = computed(() => {
  const lines = [];
  let displayNum = 1;

  for (let i = 0; i < sourceLines.value.length; i++) {
    if (collapsed.value.has(i)) {
      const endLine = findClosing(i);

      lines.push({
        sourceIndex: i,
        displayNumber: displayNum++,
        text: sourceLines.value[i],
        isPlaceholder: true,
        canFold: true,
        isCollapsed: true,
      });

      i = endLine;
    } else {
      lines.push({
        sourceIndex: i,
        displayNumber: displayNum++,
        text: sourceLines.value[i],
        isPlaceholder: false,
        canFold: canFold(i),
        isCollapsed: false,
      });
    }
  }

  return lines;
});

const visibleLineCount = computed(() => displayLines.value.length);

const toggleFold = (sourceIndex) => {
  if (collapsed.value.has(sourceIndex)) {
    collapsed.value.delete(sourceIndex);
  } else {
    collapsed.value.add(sourceIndex);
  }

  collapsed.value = new Set(collapsed.value);

  // Update editor to reflect collapse state
  nextTick(() => {
    updateEditorContent();
  });
};

const expandAll = () => {
  collapsed.value = new Set();
  nextTick(() => {
    updateEditorContent();
  });
};

const collapseAll = () => {
  const foldable = new Set();

  sourceLines.value.forEach((line, i) => {
    if (canFold(i)) {
      foldable.add(i);
    }
  });

  collapsed.value = foldable;
  nextTick(() => {
    updateEditorContent();
  });
};

/* ================= INPUT HANDLING ================= */
const onBeforeInput = (e) => {
  // Handle Tab key
  if (e.inputType === "insertText" && e.data === "\t") {
    e.preventDefault();
    document.execCommand("insertText", false, "  ");
  }
};

const onInput = (e) => {
  if (isUpdating.value) return;

  // When editing collapsed content, auto-expand
  if (collapsed.value.size > 0) {
    collapsed.value = new Set();
  }

  const newValue = editorEl.value.textContent || "";

  // Remove collapse indicators from input
  const cleanValue = newValue.replace(/\s+⋯\s+\d+\s+lines/g, "");

  if (cleanValue !== source.value) {
    source.value = cleanValue;
    addHistory(cleanValue);
  }
};

/* ================= KEYBOARD SHORTCUTS ================= */
const onKeyDown = (e) => {
  // Undo
  if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }

  // Redo
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "y" || (e.key === "z" && e.shiftKey))
  ) {
    e.preventDefault();
    redo();
    return;
  }

  // Format
  if (e.altKey && e.shiftKey && e.key === "F") {
    e.preventDefault();
    formatCode();
    return;
  }

  // Tab
  if (e.key === "Tab") {
    e.preventDefault();
    document.execCommand("insertText", false, "  ");
    return;
  }

  // Escape
  if (e.key === "Escape") {
    e.preventDefault();
    handleClose();
    return;
  }
};

/* ================= ACTIONS ================= */
const discardChanges = () => {
  source.value = originalSource.value;
  collapsed.value = new Set();

  // Reset history
  history.value = [originalSource.value];
  historyIndex.value = 0;
  saveHistory();

  updateEditorContent();
};

const formatCode = () => {
  // First, parse the HTML to get proper structure
  let htmlToFormat = source.value.trim();

  // If it's all on one line or poorly formatted, we need to restructure it
  if (
    !htmlToFormat.includes("\n") ||
    htmlToFormat.replace(/\s+/g, " ").length < htmlToFormat.length * 0.8
  ) {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlToFormat;

    // Extract and format the HTML structure
    htmlToFormat = formatHTMLStructure(tempDiv.innerHTML);
  }

  // Now format the properly structured HTML
  let indent = 0;
  const lines = htmlToFormat.split("\n");
  const formatted = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Decrease indent for closing tags
    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }

    // Add the indented line
    formatted.push("  ".repeat(indent) + trimmed);

    // Increase indent for opening tags (that aren't self-closing or comments)
    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("</") &&
      !trimmed.endsWith("/>") &&
      !trimmed.startsWith("<!--") &&
      !trimmed.startsWith("<!")
    ) {
      // Check if it's a tag that typically has content
      const tagMatch = trimmed.match(/^<(\w+)/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        // Tags that are usually self-contained or don't need indentation
        const selfContainedTags = [
          "img",
          "br",
          "hr",
          "input",
          "meta",
          "link",
          "area",
          "base",
          "col",
          "embed",
          "source",
          "track",
          "wbr",
        ];
        if (!selfContainedTags.includes(tagName.toLowerCase())) {
          indent++;
        }
      }
    }
  }

  source.value = formatted.join("\n");
  collapsed.value = new Set();
  addHistory(source.value);
  updateEditorContent();
};

// Helper function to restructure HTML with proper line breaks
const formatHTMLStructure = (html) => {
  // Add line breaks after block-level elements and closing tags
  let formatted = html;

  // Replace > with >\n for most tags, but not for inline elements
  const blockTags =
    "div|p|h[1-6]|section|article|header|footer|nav|aside|main|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|fieldset|legend|address|blockquote|pre|hr|br|img";

  // Add line breaks after opening block tags
  formatted = formatted.replace(
    new RegExp(`(<(?:${blockTags})[^>]*>)`, "gi"),
    "$1\n",
  );

  // Add line breaks before closing block tags
  formatted = formatted.replace(
    new RegExp(`(</(?:${blockTags})>)`, "gi"),
    "\n$1",
  );

  // Add line breaks after closing block tags
  formatted = formatted.replace(
    new RegExp(`(</(?:${blockTags})>)`, "gi"),
    "$1\n",
  );

  // Clean up multiple consecutive line breaks
  formatted = formatted.replace(/\n\s*\n\s*\n/g, "\n\n");

  // Trim and return
  return formatted.trim();
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(source.value);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const apply = () => {
  emit("apply", source.value);
  handleClose();
};

const handleClose = () => {
  clearHistory();
  collapsed.value = new Set();
  emit("close");
};

/* ================= LIFECYCLE ================= */
const handleGlobalKeydown = (e) => {
  if (!props.isVisible) return;
  if (e.key === "Escape") {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
  clearHistory();
});
</script>

<style scoped>
[contenteditable] {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  -webkit-user-modify: read-write-plaintext-only;
  outline: none;
}

/* Preserve all whitespace */
.whitespace-pre {
  white-space: pre !important;
  word-wrap: normal !important;
  overflow-wrap: normal !important;
}

:deep(*)::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

:deep(*)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(*)::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 5px;
}

:deep(*)::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
}
</style>
