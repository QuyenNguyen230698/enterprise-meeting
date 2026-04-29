<template>
    <dialog v-if="dataProject" id="listImageProject" class="modal" ref="listImageProject">
        
        <div class="modal-box flex flex-col w-full fixed top-0 right-0 left-0 bottom-0 overflow-hidden bg-linear-to-br from-gray-50 to-white">
            <main v-show="dataProject?.listImage?.length > 0"
                class="flex-grow flex lg:flex-row flex-col w-full h-full relative">
                <div class="relative flex-grow h-full overflow-hidden" data-aos="zoom-in" data-aos-duration="800" data-aos-easing="ease-in-out">
                    <div v-if="imageLoading"
                        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 transition-opacity duration-500">
                        <span class="loading loading-spinner text-teal-950 w-12 h-12"></span>
                    </div>
                    <div @click="closeDialog" class="absolute top-0 right-5">
                        <div aria-label="close"
                            class="cursor-pointer bg-black/50 hover:bg-black/70 backdrop-blur-md text-white w-12 h-12 rounded-full hover:text-gray-100 absolute top-2 right-2 z-50 flex items-center justify-center transition-all duration-300 ease-in-out">
                            <i class="bi bi-x text-2xl lg:text-3xl"></i>
                        </div>
                    </div>
                    <!-- Navigation Overlay Buttons - Always visible on mobile, hover on desktop -->
                    <div class="absolute inset-0 z-20 pointer-events-none">
                        <!-- Previous Image Button -->
                        <button v-if="dataProject?.listImage?.length > 1"
                            class="pointer-events-auto absolute top-1/2 left-2 md:left-4 lg:left-6 transform -translate-y-1/2 
                                   bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full 
                                   shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95
                                   border border-white/20 hover:border-white/40"
                            :class="[
                                isMobile ? 'w-12 h-12' : 'w-14 h-14',
                                selectedImageIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
                            ]"
                            :disabled="selectedImageIndex === 0"
                            tabindex="-1"
                            @click.stop="prevImage"
                            aria-label="Hình ảnh trước">
                            <i :class="isMobile ? 'text-xl' : 'text-2xl'" class="bi bi-chevron-left"></i>
                        </button>
                        
                        <!-- Next Image Button -->
                        <button v-if="dataProject?.listImage?.length > 1"
                            class="pointer-events-auto absolute top-1/2 right-2 md:right-4 lg:right-6 transform -translate-y-1/2 
                                   bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full 
                                   shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95
                                   border border-white/20 hover:border-white/40"
                            :class="[
                                isMobile ? 'w-12 h-12' : 'w-14 h-14',
                                selectedImageIndex >= (dataProject?.listImage?.length - 1) ? 'opacity-40 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
                            ]"
                            :disabled="selectedImageIndex >= (dataProject?.listImage?.length - 1)"
                            tabindex="-1"
                            @click.stop="nextImage"
                            aria-label="Hình ảnh tiếp theo">
                            <i :class="isMobile ? 'text-xl' : 'text-2xl'" class="bi bi-chevron-right"></i>
                        </button>
                        
                        <!-- Image Counter - Top Right -->
                        <div class="pointer-events-auto absolute top-4 left-4 bg-black/60 backdrop-blur-md 
                                    text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                            {{ selectedImageIndex + 1 }} / {{ dataProject?.listImage?.length || 0 }}
                        </div>
                    </div>
                    
                    <div :style="imageStyle" class="flex items-center justify-center w-full h-full transition-transform duration-500 ease-in-out"
                         @touchstart="startSwipe"
                         @touchmove.prevent="handleSwipe"
                         @touchend="endSwipe">
                        <img v-if="dataProject.listImage && dataProject.listImage[selectedImageIndex]"
                            class="cursor-pointer object-contain w-full h-full" loading="eager" priority
                            :src="getImageSrc(dataProject.listImage[selectedImageIndex].url)"
                            :alt="`Hình ảnh dự án ${dataProject.title} - ${selectedImageIndex + 1}`"
                            @load="handleImageLoad" @error="handleImageError" @mousedown="startDragging"
                            @mousemove="dragImage" @mouseup="stopDragging" @mouseleave="stopDragging" @dragstart.prevent
                            @touchstart="startDragging" @touchmove="dragImage" @touchend="stopDragging"
                            style="max-width: 100%; max-height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); will-change: transform;" />
                    </div>
                </div>
                <div v-show="!isMobile && isSidebarVisible" ref="sidebar"
                    :class="['scroll-smooth w-28 py-16 lg:py-24 shadow-md h-full flex flex-col items-center justify-start p-3 overflow-y-auto bg-white transition-transform duration-700 ease-in-out', { 'translate-x-0': isSidebarVisible, '-translate-x-full': !isSidebarVisible }]">
                    <div v-for="(itemImage, index) in dataProject?.listImage" :key="index"
                        class="w-full aspect-square mb-3 relative shadow-sm hover:scale-105 transition-transform duration-300 ease-in-out">
                        <img :alt="`Hình ảnh dự án ${dataProject.title} - ${index + 1}`" quality="90"
                            
                            :src="getImageSrc(itemImage.url)" width="100" height="100"
                            class="cursor-pointer w-full h-full object-cover rounded-md shadow-sm transition-all duration-300"
                            :class="{ 'border-2 border-teal-900 rounded-md': selectedImageIndex === index }"
                            @click="selectImage(index)" loading="eager" priority @load="itemImage.loading = false"
                            @error="itemImage.loading = false" />
                        <div v-if="itemImage.loading"
                            class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
                            <span class="loading loading-spinner text-teal-950 w-6 h-6"></span>
                        </div>
                    </div>
                </div>
            </main>
            <footer v-if="!isMobile" class="flex items-center justify-center  min-h-16 navbar fixed bottom-0 left-0 right-0 w-full bg-linear-to-t from-white to-gray-50 text-gray-800 py-1 shadow-md">
                <div v-if="dataProject?.listImage?.length > 0" class="navbar-start flex items-center gap-3 px-3">
                    <div class="shrink-0">
                        <img quality="90" class="w-full h-16 object-contain" src="https://datools.info/logo/logo.png"
                            alt="Logo TD CASA" format="webp" height="40" width="auto" loading="lazy"
                            priority />
                    </div>
                </div>
                <div class="navbar-center flex items-center gap-4 px-3">
                    <div class="flex gap-3">
                        <div v-if="useRotate" :class="{ 'cursor-not-allowed': selectedImageIndex === 0 }" aria-label="Xoay theo chiều kim đồng hồ" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="rotateClockwise" tabindex="-1">
                            <i class="bi bi-arrow-clockwise text-2xl"></i>
                        </div>
                        <div v-if="useRotate" :class="{ 'cursor-not-allowed': selectedImageIndex === dataProject?.listImage?.length - 1 }" aria-label="Xoay ngược chiều kim đồng hồ" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="rotateCounterclockwise" tabindex="-1">
                            <i class="bi bi-arrow-counterclockwise text-2xl"></i>
                        </div>
                    </div>
                    <div v-if="useRotate" class="h-6 border-l border-gold/30"></div>
                    <div class="flex gap-3">
                        <div aria-label="Phóng to" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="zoomIn" tabindex="-1">
                            <i class="bi bi-zoom-in text-2xl"></i>
                        </div>
                        <div aria-label="Thu nhỏ" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="zoomOut" tabindex="-1">
                            <i class="bi bi-zoom-out text-2xl"></i>
                        </div>
                    </div>
                    <div class="h-6 border-l border-gold/30"></div>
                    <div class="flex gap-3">
                        <div aria-label="Đặt lại tất cả" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="resetAll" tabindex="-1">
                            <i class="bi bi-arrow-repeat text-2xl"></i>
                        </div>
                    </div>
                </div>
                <div class="navbar-end px-3 flex items-center">
                    <div @click="toggleSidebar" class="btn btn-ghost text-gray-600 hover:text-teal-950 transition-colors duration-300" tabindex="-1">
                        <i class="bi bi-layout-text-sidebar-reverse text-2xl"></i>
                    </div>
                </div>
            </footer>
            <footer v-if="isMobile"
                class="fixed bottom-0 right-0 left-0 flex flex-col items-center bg-linear-to-t from-white to-gray-50 justify-center w-full z-40 shadow-md">
                <div class="flex items-center justify-center w-full px-2 py-2 overflow-hidden border-b border-gold/20">
                    <div ref="sidebarMobile" data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-in-out"
                        class="scroll-smooth w-full flex items-center justify-start overflow-x-auto overflow-y-hidden bg-transparent transition-all duration-800 ease-in-out z-40">
                        <div class="flex flex-nowrap space-x-2">
                            <div v-for="(itemImage, index) in dataProject.listImage" :key="index"
                                class="w-14 h-14 shrink-0 aspect-square relative shadow-sm hover:scale-110 transition-transform duration-300 ease-in-out">
                                <img :alt="`Hình ảnh dự án ${dataProject.title} - ${index + 1}`" quality="90" 
                                    
                                    :src="getImageSrc(itemImage.url)" width="56" height="56"
                                    class="cursor-pointer w-full h-full object-cover rounded-sm shadow-xs transition-all duration-300"
                                    :class="{ 'border-2 border-gold': selectedImageIndex === index }"
                                    @click="selectImage(index)" loading="lazy" priority
                                    @load="itemImage.loadingMobile = false" @error="itemImage.loadingMobile = false" />
                                <div v-if="itemImage.loadingMobile"
                                    class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-sm">
                                    <span class="loading loading-spinner text-teal-950 w-3 h-3"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex w-full justify-around p-2 gap-2 border-t border-gold/20">
                    <div aria-label="reset all" class="btn btn-ghost btn-sm text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="resetAll" tabindex="-1">
                        <i class="bi bi-arrow-repeat text-lg"></i>
                    </div>
                    <div v-if="useRotate" aria-label="rotate clockwise" class="btn btn-ghost btn-sm text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="rotateClockwise" tabindex="-1">
                        <i class="bi bi-arrow-clockwise text-lg"></i>
                    </div>
                    <div v-if="useRotate"  aria-label="rotate counterclockwise" class="btn btn-ghost btn-sm text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="rotateCounterclockwise" tabindex="-1">
                        <i class="bi bi-arrow-counterclockwise text-lg"></i>
                    </div>
                    <div aria-label="zoom in" class="btn btn-ghost btn-sm text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="zoomIn" tabindex="-1">
                        <i class="bi bi-zoom-in text-lg"></i>
                    </div>
                    <div aria-label="zoom out" class="btn btn-ghost btn-sm text-gray-600 hover:text-teal-950 transition-colors duration-300" @click="zoomOut" tabindex="-1">
                        <i class="bi bi-zoom-out text-lg"></i>
                    </div>
                </div>
            </footer>
        </div>
    </dialog>
</template>

<script setup>
import AOS from 'aos';
import 'aos/dist/aos.css';

const props = defineProps({
    modelValue: { type: [Object, null], required: true },
    useRotate: { type: Boolean, default: true },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const { $_, $util } = useNuxtApp();

const dataProject = computed({
    get() {
        return modelValue?.value ?? {};
    },
    set(value) {
        if (!$_.isEqual(modelValue.value, value)) {
            emit("update:modelValue", value);
        }
    }
});

const positionScroll = ref(0);
const zoomLevel = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isSidebarVisible = ref(true);
const selectedImageIndex = ref(0);
const sidebar = ref(null);
const sidebarMobile = ref(null);
const rotateAngle = ref(0);
const imageLoading = ref(true);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const listImageProject = ref(null);

const swipeStartX = ref(0);
const swipeStartY = ref(0);
const swipeThreshold = 50; // Minimum swipe distance

watchEffect(() => {
    if (dataProject.value.listImage) {
        dataProject.value.listImage.forEach(image => {
            image.loading ??= true;
            image.loadingMobile ??= true;
        });
    }
});

const isMobile = ref(process.client ? window.innerWidth < 768 : false)

const updateIsMobile = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 768
  }
}

const imageStyle = computed(() => ({
    transform: `scale(${zoomLevel.value}) translate(${offsetX.value}px, ${offsetY.value}px) rotate(${rotateAngle.value}deg)`,
    transformOrigin: 'center center',
    willChange: 'transform',
    cursor: 'grab',
    transition: 'transform 0.4s ease-in-out',
}));

const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value;
};

const rotateImage = (angle) => {
    rotateAngle.value += angle;
};

const rotateClockwise = () => rotateImage(90);
const rotateCounterclockwise = () => rotateImage(-90);

const scrollToSelectedImage = (mobile = false) => {
    const container = mobile ? sidebarMobile.value : sidebar.value;
    if (container) {
        const images = container.querySelectorAll('img');
        const selected = images[selectedImageIndex.value];
        if (selected) {
            selected.scrollIntoView({
                behavior: 'smooth',
                block: mobile ? 'nearest' : 'center',
                inline: mobile ? 'center' : 'nearest'
            });
        }
    }
};

watch(selectedImageIndex, (newIndex, oldIndex) => {
    // Preload adjacent images for smoother navigation
    if (dataProject.value?.listImage) {
        const images = dataProject.value.listImage;

        // Preload next image
        if (newIndex < images.length - 1) {
            const nextImg = new Image();
            nextImg.src = getImageSrc(images[newIndex + 1].url);
        }

        // Preload previous image
        if (newIndex > 0) {
            const prevImg = new Image();
            prevImg.src = getImageSrc(images[newIndex - 1].url);
        }
    }

    scrollToSelectedImage(false);
    scrollToSelectedImage(true);
});

const getImageSrc = (url) => /^https?:\/\//.test(url) ? url : `${url}`;

const selectImage = (index) => {
    if(index === selectedImageIndex.value) return;
    resetTransform(); // Only reset zoom and rotation, don't reset position
    selectedImageIndex.value = index;
    imageLoading.value = true;
};

const prevImage = () => {
    if (selectedImageIndex.value > 0) {
        selectedImageIndex.value -= 1;
        resetTransform();
        imageLoading.value = true;
    }
};

const nextImage = () => {
    if (selectedImageIndex.value < dataProject.value.listImage.length - 1) {
        selectedImageIndex.value += 1;
        resetTransform();
        imageLoading.value = true;
    }
};

const zoomIn = () => {
    if (zoomLevel.value < 3) zoomLevel.value = Math.min(3, zoomLevel.value + 0.1);
};

const zoomOut = () => {
    if (zoomLevel.value > 0.5) zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1);
};

const startDragging = (event) => {
    event.preventDefault();
    isDragging.value = true;
    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
    startX.value = clientX - offsetX.value;
    startY.value = clientY - offsetY.value;
};

const dragImage = (event) => {
    if (isDragging.value) {
        const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
        offsetX.value = clientX - startX.value;
        offsetY.value = clientY - startY.value;
    }
};

const stopDragging = () => {
    isDragging.value = false;
};

// Swipe gesture handlers for mobile
const startSwipe = (event) => {
    if (!isMobile.value) return;
    swipeStartX.value = event.touches[0].clientX;
    swipeStartY.value = event.touches[0].clientY;
};

const handleSwipe = (event) => {
    if (!isMobile.value) return;
    // Allow default behavior for panning
};

const endSwipe = (event) => {
    if (!isMobile.value) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const diffX = endX - swipeStartX.value;
    const diffY = endY - swipeStartY.value;

    // Only trigger swipe if horizontal movement is significant and greater than vertical
    if (Math.abs(diffX) > swipeThreshold.value && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && selectedImageIndex.value > 0) {
            // Swipe right - previous image
            prevImage();
        } else if (diffX < 0 && selectedImageIndex.value < dataProject.value.listImage.length - 1) {
            // Swipe left - next image
            nextImage();
        }
    }
};

const handleEsc = (event) => {
    if (event.key === 'Escape') {
        closeDialog();
        toggleTheme('#ffffff');
    }
};

const closeDialog = () => {
    if (listImageProject.value) {
        listImageProject.value.close();
        dataProject.value = null;
    }
    selectedImageIndex.value = 0;
    toggleTheme('#ffffff');
    document.body.style.overflow = 'auto';
    window.scrollTo(0, positionScroll.value);
};

const toggleTheme = (color) => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.setAttribute('content', color);

    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) statusBarMeta.setAttribute('content', color);
};

const resetAll = () => {
    zoomLevel.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
    rotateAngle.value = 0;
    isSidebarVisible.value = true;
};

const resetTransform = () => {
    zoomLevel.value = 1;
    rotateAngle.value = 0;
};

onMounted(async () => {
    await nextTick();
    AOS.init({
        offset: 10,
        delay: 50,
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
    });
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    window.addEventListener('keydown', handleEsc);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateIsMobile);
    window.removeEventListener('keydown', handleEsc);
});

onBeforeUnmount(() => {
    toggleTheme('#ffffff');
});

const showModal = () => {
    resetAll();
    selectedImageIndex.value = 0;
    imageLoading.value = true;
    positionScroll.value = window.scrollY;
    listImageProject.value.showModal();
    toggleTheme('#f5f5f5');
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    listImageProject.value.close();
    toggleTheme('#ffffff');
    document.body.style.overflow = 'auto';
    window.scrollTo(0, positionScroll.value);
};

const handleImageLoad = () => {
    imageLoading.value = false;
};

const handleImageError = () => {
    imageLoading.value = false;
};

defineExpose({
    show: showModal,
    close: closeModal,
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            toggleTheme('#ffffff');
            document.body.style.overflow = 'auto';
            window.scrollTo(0, positionScroll.value);
        }
    });
}, { threshold: 0.5 });

onMounted(() => {
    if (listImageProject.value) observer.observe(listImageProject.value);
});

onUnmounted(() => {
    if (listImageProject.value) observer.unobserve(listImageProject.value);
});
</script>

<style lang="scss" scoped>
#listImageProject .modal-box {
    max-height: 100vh !important;
    padding: 0;
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
    background: linear-gradient(to bottom right, #f9f9f9, #ffffff);
    color: #333333;
}

.scroll-smooth {
    scroll-behavior: smooth;
}

dialog {
    touch-action: none !important;
}

</style>