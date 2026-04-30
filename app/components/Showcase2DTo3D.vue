<template>
  <div class="w-full px-4">
    <!-- Section Header -->
    <div class="text-center mb-6">
      <span
        class="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-3"
      >
        <i class="bi bi-magic mr-2"></i>
        AI Texture Generation
      </span>
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-3">
        Từ 2D
        <span
          class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
          >→</span
        >
        3D
      </h2>
      <p class="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
        Chuyển đổi hình ảnh 2D thành texture cho mô hình 3D
      </p>
    </div>

    <!-- 2 Column Grid - Always side by side -->
    <div
      class="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 max-w-5xl mx-auto mb-6"
    >
      <!-- Left: 2D Image -->
      <div class="relative group h-full">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
        ></div>
        <div
          class="relative bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 min-h-16 border-b border-white/10 bg-slate-900/50"
          >
            <div
              class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500"
            ></div>
            <span class="text-xs sm:text-xs font-medium text-slate-300"
              >2D</span
            >
          </div>
          <!-- Image Container -->
          <div
            class="flex-1 max-h-60 lg:max-h-96 bg-slate-900/50 flex items-center justify-center p-1.5 sm:p-3"
          >
            <img
              src="https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/e24513e7-9e6a-4ea9-645b-fe82fee8a300/2K"
              alt="UV Texture 2D"
              class="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Right: 3D Viewer -->
      <div class="relative group h-full">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-lime-500/20 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
        ></div>
        <div
          class="relative bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col"
        >
          <!-- Header with Controls -->
          <div
            class="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 min-h-16 border-b border-white/10 bg-slate-900/50"
          >
            <div class="flex items-center gap-1 sm:gap-2">
              <div
                class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500"
                :class="{ 'animate-pulse': isRotating && !loading }"
              ></div>
              <span class="text-xs sm:text-xs font-medium text-slate-300"
                >3D</span
              >
            </div>
            <!-- Control Buttons -->
            <div class="flex items-center gap-0.5 sm:gap-1">
              <!-- AR Button (iOS + WebXR) -->
              <button
                v-if="arSupported && !loading && !error"
                @click="toggleAR"
                class="p-1 sm:p-1.5 rounded-lg bg-gradient-to-r from-emerald-500/30 to-purple-500/30 hover:from-emerald-500/50 hover:to-purple-500/50 text-emerald-300 hover:text-white transition-all border border-emerald-500/30"
                :title="
                  isIOS
                    ? 'Xem AR (Quick Look)'
                    : arActive
                      ? 'Thoát AR'
                      : 'Xem AR'
                "
              >
                <i class="bi bi-badge-ar text-xs sm:text-sm"></i>
              </button>
              <button
                v-if="!loading"
                @click="toggleRotation"
                class="p-1 sm:p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                :title="isRotating ? 'Dừng quay' : 'Quay'"
              >
                <i
                  :class="isRotating ? 'bi bi-pause-fill' : 'bi bi-play-fill'"
                  class="text-xs sm:text-sm"
                ></i>
              </button>
              <button
                v-if="!loading"
                @click="resetView"
                class="p-1 sm:p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Reset view"
              >
                <i class="bi bi-arrow-counterclockwise text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>
          <!-- 3D Viewer with Loading Overlay -->
          <div
            ref="viewerContainer"
            class="flex-1 max-h-60 lg:max-h-96 bg-slate-950 relative"
            @mousedown="handleInteractionStart"
            @mouseup="handleInteractionEnd"
            @touchstart="handleInteractionStart"
            @touchend="handleInteractionEnd"
          >
            <!-- Loading Overlay -->
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10"
            >
              <div class="text-center">
                <div
                  class="w-8 h-8 sm:w-12 sm:h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"
                ></div>
                <p class="text-xs sm:text-xs text-slate-400">Loading 3D...</p>
              </div>
            </div>
            <!-- Error Overlay -->
            <div
              v-if="error && !loading"
              class="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10"
            >
              <div class="text-center px-4">
                <i
                  class="bi bi-exclamation-triangle text-red-500 text-2xl mb-2"
                ></i>
                <p class="text-xs sm:text-xs text-red-400">{{ error }}</p>
                <button
                  @click="retryLoad"
                  class="mt-2 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div
      class="flex gap-3 justify-between lg:justify-center items-center gap-3"
    >
      <NuxtLink
        to="/models"
        class="group relative px-6 py-3 w-full lg:w-fit bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
      >
        <span class="flex items-center justify-center gap-2 flex-nowrap">
          <i class="bi bi-box"></i>
          Models
          <i
            class="bi bi-arrow-right group-hover:translate-x-1 transition-transform"
          ></i>
        </span>
      </NuxtLink>
      <NuxtLink
        to="/textured-models"
        class="group px-6 w-full lg:w-fit py-3 bg-white/5 text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <span class="flex items-center justify-center gap-2 flex-nowrap">
          <i class="bi bi-magic"></i>
          Texture
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useModelViewer } from "~/composables/useModelViewer";

// Emit events for parent component (carousel pause/resume)
const emit = defineEmits(["interaction-start", "interaction-end"]);

const config = useRuntimeConfig();
const baseUrl = config.public.apiBase.replace("/api", "");

// Sofa Pea model data
const modelPath = `${baseUrl}/models/sofas/sofas_pea.glb`;
const modelPathVR = `${baseUrl}/models/sofas/sofas_pea.usdz`;
const textureImageUrl = `${baseUrl}/image/uv-layout/sofas_pea.jpg`;
const materialConfig = {
  color: "#A69B90",
  bgColor: "#F8F8F8",
  image: textureImageUrl,
};

const viewerContainer = ref(null);
const isRotating = ref(true);
const isIOS = ref(false);
const loading = ref(true);
const error = ref(null);
const arSupported = ref(false);
const arActive = ref(false);

const {
  initViewer,
  loadModel,
  setAutoRotate,
  resetCamera,
  applyMaterialTexture,
  forceResize,
  checkARSupport,
  startAR,
  stopAR,
  updateAR,
  getRenderer,
  destroy,
} = useModelViewer();

// Handle user interaction - emit to parent to pause carousel
const handleInteractionStart = () => {
  emit("interaction-start");
};

const handleInteractionEnd = () => {
  emit("interaction-end");
};

// Toggle auto-rotation
const toggleRotation = () => {
  isRotating.value = !isRotating.value;
  setAutoRotate(isRotating.value);
};

// Reset camera view
const resetView = () => {
  resetCamera();
};

// Check AR support (iOS Quick Look + WebXR)
const checkAR = async () => {
  if (typeof window === "undefined") return;

  const userAgent = navigator.userAgent || navigator.vendor;
  isIOS.value = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

  if (isIOS.value) {
    arSupported.value = true;
    console.log("AR Quick Look available on iOS");
  } else {
    // Check WebXR for Android/other devices
    const result = await checkARSupport();
    arSupported.value = result.supported;
    console.log("WebXR AR:", result.reason);
  }
};

// Toggle AR (iOS Quick Look or WebXR)
const toggleAR = async () => {
  if (isIOS.value) {
    // Use AR Quick Look for iOS
    if (modelPathVR) {
      const a = document.createElement("a");
      a.rel = "ar";
      a.href = modelPathVR;

      const img = document.createElement("img");
      a.appendChild(img);

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } else {
    // Use WebXR for Android/other devices
    if (arActive.value) {
      stopAR();
      arActive.value = false;
    } else {
      try {
        await startAR();
        arActive.value = true;

        const renderer = getRenderer();
        if (renderer && renderer.xr) {
          renderer.setAnimationLoop((_timestamp, frame) => {
            if (frame) {
              updateAR(frame);
            }
          });
        }
      } catch (err) {
        console.error("AR failed:", err);
        arActive.value = false;
      }
    }
  }
};

onMounted(async () => {
  // Check AR support (iOS + WebXR)
  await checkAR();

  // Wait for next tick to ensure DOM is fully rendered
  await nextTick();

  if (viewerContainer.value) {
    // Log container dimensions for debugging
    console.log("Viewer container dimensions:", {
      width: viewerContainer.value.clientWidth,
      height: viewerContainer.value.clientHeight,
    });

    // Initialize viewer
    initViewer(viewerContainer.value, {
      backgroundColor: "#0f172a",
      enableGrid: false,
      enableAxes: false,
    });

    try {
      loading.value = true;

      console.log("Loading model from:", modelPath);

      // Load model
      await loadModel(modelPath);

      console.log("Model loaded, applying texture from:", textureImageUrl);

      // Apply texture
      await applyMaterialTexture(materialConfig);

      console.log("Texture applied successfully");

      // Force resize to ensure correct dimensions after loading
      forceResize();

      // Enable auto-rotate for demo
      setAutoRotate(true);

      loading.value = false;
    } catch (err) {
      console.error("Failed to load 3D model:", err);
      error.value = err.message || "Không thể tải model 3D";
      loading.value = false;
    }
  }
});

// Retry loading function
const retryLoad = async () => {
  error.value = null;
  loading.value = true;

  try {
    await loadModel(modelPath);
    await applyMaterialTexture(materialConfig);
    forceResize();
    setAutoRotate(true);
    loading.value = false;
  } catch (err) {
    console.error("Failed to load 3D model:", err);
    error.value = err.message || "Không thể tải model 3D";
    loading.value = false;
  }
};

onUnmounted(() => {
  destroy();
});
</script>
