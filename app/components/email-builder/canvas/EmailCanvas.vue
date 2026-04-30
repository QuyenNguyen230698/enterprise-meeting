<template>
  <!-- Toast Notification -->
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="showToast" 
        class="fixed top-4 right-4 z-9999 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm"
      >
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span class="text-sm font-medium">{{ toastMessage }}</span>
      </div>
    </Transition>
  </Teleport>

  <!-- Dynamic CSS injection for mobile/tablet preview of HTML elements -->
  <component :is="'style'" v-if="device && device.width <= 400">
    /* Mobile-specific styles for HTML elements */
    .email-canvas-container .html-container .mobile-contact,
    .email-canvas-container .html-nested-container .mobile-contact,
    .email-canvas-container .html-child-container .mobile-contact {
      display: table !important;
    }
    .email-canvas-container .html-container .desktop-contact,
    .email-canvas-container .html-nested-container .desktop-contact,
    .email-canvas-container .html-child-container .desktop-contact {
      display: none !important;
    }
    .email-canvas-container .html-container .outlook600,
    .email-canvas-container .html-nested-container .outlook600,
    .email-canvas-container .html-child-container .outlook600 {
      width: 100% !important;
    }
    .email-canvas-container .html-container img[width="180"],
    .email-canvas-container .html-nested-container img[width="180"],
    .email-canvas-container .html-child-container img[width="180"] {
      width: 120px !important;
    }
  </component>
  
  <component :is="'style'" v-if="device && device.width > 400 && device.width <= 768">
    /* Tablet-specific styles for HTML elements */
    .email-canvas-container .html-container .outlook600,
    .email-canvas-container .html-nested-container .outlook600,
    .email-canvas-container .html-child-container .outlook600 {
      width: 100% !important;
    }
  </component>

  <!-- Email Builder Canvas - Modern Clean Design -->
  <div 
    class="email-builder-canvas w-full h-full flex flex-col"
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @dragend="onDragEnd"
    @drop="onDragEnd"
  >
    
    <!-- Email Preview Container -->
    <div 
      class="flex-1 flex justify-center"
    >
      <!-- Email Frame -->
      <div 
        class="email-canvas-container rounded-lg overflow-hidden"
        :style="getEmailFrameStyle()"
      >
        <!-- Email Body with Global Settings -->
        <div 
          class="email-body min-h-full flex flex-col w-full h-full items-center justify-start"
          :style="getEmailBodyStyle()"
        >
    <!-- Drop Zone Before First Element -->
    <!-- <div 
      v-if="elements.length > 0"
      class="h-8 transition-all mb-2"
      :class="dropIndex === 0 ? 'h-12 bg-blue-100 border-2 border-dashed border-blue-500 rounded' : 'hover:bg-blue-50'"
      @drop="(e) => onDropAtIndex(e, 0)"
      @dragover.prevent
      @dragenter="dropIndex = 0"
      @dragleave="dropIndex = null"
    > 
      
    </div>-->

    <!-- Drop Zone at Top (only when dragging) -->
    <div 
      v-if="isDragging && elements.length > 0"
      class="w-full h-10 my-2 border-2 border-dashed rounded-lg flex items-center justify-center transition-all"
      :class="dropIndex === 0 ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50/50'"
      @drop.prevent="(e) => onDropAtIndex(e, 0)"
      @dragover.prevent
      @dragenter.prevent="dropIndex = 0"
    >
      <span class="text-blue-500 text-sm font-medium flex items-center gap-2 pointer-events-none">
        <i class="bi bi-arrow-down-circle"></i>
        Drop here
      </span>
    </div>

    <!-- Render Elements -->
    <div 
      v-for="(element, index) in elements" 
      :key="element.id" 
      class="w-full"
      :class="{ 'mt-10': index === 0 && selectedElement?.id === element.id }"
      :style="index > 0 ? { marginTop: (globalSettings.elementGap || 0) + 'px' } : {}"
    >
      <!-- Element Container -->
      <div class="relative group cursor-pointer"
        :class="{ 
          'border border-blue-500 border-inset border-dashed rounded': selectedElement?.id === element.id,
          'hover:border hover:border-blue-300 hover:border-inset border-dashed rounded': selectedElement?.id !== element.id
        }"
        
      >
        <!-- Element Toolbar (appears on selection) -->
        <div v-if="selectedElement?.id === element.id"
          class="element-toolbar mb-3">
          <div class="toolbar-label">
            <i :class="getElementIcon(element.type)"></i>
            <span>{{ getElementName(element.type) }}</span>
          </div>
          
          <div class="toolbar-actions">
            <button @click.stop="moveToTop(index)" :disabled="index === 0" title="Move to Top">
              <i class="bi bi-chevron-double-up"></i>
            </button>
            <button @click.stop="moveUp(index)" :disabled="index === 0" title="Move Up">
              <i class="bi bi-chevron-up"></i>
            </button>
            <button @click.stop="moveDown(index)" :disabled="index === elements.length - 1" title="Move Down">
              <i class="bi bi-chevron-down"></i>
            </button>
            <button @click.stop="moveToBottom(index)" :disabled="index === elements.length - 1" title="Move to Bottom">
              <i class="bi bi-chevron-double-down"></i>
            </button>
            <div class="toolbar-divider"></div>
            <button @click.stop="duplicateElement(index)" title="Duplicate">
              <i class="bi bi-copy"></i>
            </button>
            <button @click.stop="deleteElement(index)" class="delete-btn" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <!-- Render Element -->
        <div 
          v-if="!shouldHideElement(element)"
          class="relative border border-gray-300 border-dashed rounded"
          :style="getElementWrapperStyle(element)"
        >
          <div v-if="selectedElement?.id !== element.id" @click.stop="selectElement(element)" class="absolute top-0 left-0 bg-transparent w-full h-full z-40"></div>
          <!-- Column Layout -->
          <div v-if="isColumnElement(element.type)" class="space-y-2">
            <div class="flex items-center justify-between mb-2 p-2">
              <div class="text-xs text-gray-500 font-medium">{{ getElementName(element.type) }}</div>
              <button 
                @click.stop="configureColumn(element)"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <i class="bi bi-gear mr-1"></i>
                Configure
              </button>
            </div>
            <div class="flex p-2 gap-2">
              <div 
                v-for="i in getColumnCount(element.type)" 
                :key="i"
                class="flex-1 min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 relative z-0"
                :class="{'border-blue-400 bg-blue-50': dropTargetColumn === `${element.id}-${i}`}"
                @drop.stop="(e) => handleColumnDrop(e, element.id, i - 1)"
                @dragover.prevent="dropTargetColumn = `${element.id}-${i}`"
                @dragleave="dropTargetColumn = null"
              >
                <div class="text-xs text-gray-400 mb-2 font-medium pointer-events-none">Column {{ i }}</div>
                
                <!-- Column Content Area -->
                <div class="min-h-16 space-y-2">
                  <!-- Render nested elements if any -->
                  <div v-if="element.children && element.children[i-1] && element.children[i-1].length > 0" class="space-y-2 mb-2 relative z-10">
                    <div 
                      v-for="(childElement, childIndex) in element.children[i-1]" 
                      :key="childElement.id"
                      @click.stop="selectElement(childElement)"
                      class="rounded border-2 cursor-pointer hover:border-blue-300 transition-colors relative group z-20"
                      :class="selectedElement?.id === childElement.id ? 'border-blue-500 shadow-md ring-2 ring-blue-400' : 'border-gray-200'"
                      :style="getElementWrapperStyle(childElement)"
                    >
                      <!-- Nested Row Layout -->
                      <div v-if="isRowElement(childElement.type)" class="p-2">
                        <div class="flex items-center justify-between mb-2 p-2">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)" class="text-green-600"></i>
                            <span class="font-semibold text-green-700">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Render rows inside -->
                        <div class="space-y-1">
                          <div 
                            v-for="j in getRowCount(childElement.type)" 
                            :key="j"
                            class="min-h-12 border border-dashed border-green-300 rounded bg-green-50/30 p-1 relative"
                            @drop.stop="(e) => handleRowItemDrop(e, childElement.id, j - 1)"
                            @dragover.prevent
                          >
                            <div class="text-xs text-green-500 font-medium mb-1 pointer-events-none">Row {{ j }}</div>
                            
                            <!-- Empty state when no children -->
                            <div v-if="!childElement.children || !childElement.children[j-1] || childElement.children[j-1].length === 0" 
                                 class="text-xs text-gray-400 italic text-center py-2 pointer-events-none">
                              Drag elements here
                            </div>
                            
                            <!-- Items if any -->
                            <div v-if="childElement.children && childElement.children[j-1] && childElement.children[j-1].length > 0" class="space-y-1">
                              <div 
                                v-for="(item, itemIndex) in childElement.children[j-1]" 
                                :key="item.id" 
                                @click.stop="selectElement(item)"
                                class="text-xs rounded border-2 cursor-pointer hover:border-blue-400 transition-colors relative z-30 group/item"
                                :class="selectedElement?.id === item.id ? 'border-blue-500 shadow ring-1 ring-blue-400' : 'border-gray-300'"
                                :style="getElementWrapperStyle(item)"
                              >
                                <!-- Header with icon, name and delete button -->
                                <div class="flex items-center justify-between gap-1.5 mb-1">
                                  <div class="flex items-center gap-1.5 flex-1 min-w-0">
                                    <i :class="getElementIcon(item.type)" class="text-blue-600 shrink-0 text-xs"></i>
                                    <span class="font-medium text-gray-700 truncate text-xs">{{ getElementName(item.type) }}</span>
                                  </div>
                                  <button 
                                    @click.stop="deleteNestedElementDeep(childElement.id, j - 1, itemIndex)"
                                    class="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-all shrink-0"
                                    title="Delete"
                                  >
                                    <i class="bi bi-trash text-xs"></i>
                                  </button>
                                </div>
                                
                                <!-- Actual Element Content -->
                                <div class="mt-1">
                                  <!-- Image -->
                                  <div 
                                    v-if="item.type === 'image'"
                                    class="w-full aspect-square rounded overflow-hidden"
                                    :style="{
                                      backgroundImage: item.style?.backgroundImage ? `url(${item.style.backgroundImage})` : `url(${item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'})`,
                                      backgroundSize: item.style?.backgroundSize || 'contain',
                                      backgroundPosition: item.style?.backgroundPosition || 'center',
                                      backgroundRepeat: item.style?.backgroundRepeat || 'no-repeat'
                                    }"
                                  >
                                    <!-- Fallback img tag for accessibility -->
                                    <img 
                                      :src="item.style?.backgroundImage || item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                                      :alt="item.props.alt || 'Image'"
                                      class="w-full h-full object-cover opacity-0"
                                    />
                                  </div>
                                  
                                  <!-- Video -->
                                  <iframe
                                    v-else-if="item.type === 'video' && item.props.videoType === 'youtube' && getYouTubeEmbedId(item.props.youtubeUrl)"
                                    :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(item.props.youtubeUrl)}`"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || '180px'
                                    }"
                                    class="w-full rounded"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                  ></iframe>
                                  <video 
                                    v-else-if="item.type === 'video'"
                                    :src="item.props.src"
                                    :poster="item.props.poster"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || 'auto'
                                    }"
                                    class="w-full rounded"
                                    controls
                                  ></video>
                                  
                                  <!-- Link -->
                                  <a 
                                    v-else-if="item.type === 'link'"
                                    :href="item.props.href || '#'"
                                    class="text-blue-600 hover:underline text-xs block truncate"
                                  >
                                    {{ item.props.children || 'Link' }}
                                  </a>
                                  
                                  <!-- Button -->
                                  <div 
                                    v-else-if="item.type === 'button'"
                                    class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                                    :style="{ backgroundColor: item.style?.backgroundColor || '#3b82f6' }"
                                  >
                                    {{ item.props.children || 'Button' }}
                                  </div>
                                  
                                  <!-- Heading1 -->
                                  <h1 
                                    v-else-if="item.type === 'heading1'"
                                    class="text-sm font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 1' }}
                                  </h1>
                                  
                                  <!-- Heading2 -->
                                  <h2 
                                    v-else-if="item.type === 'heading2'"
                                    class="text-xs font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 2' }}
                                  </h2>
                                  
                                  <!-- Heading3 -->
                                  <h3 
                                    v-else-if="item.type === 'heading3'"
                                    class="text-xs font-semibold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 3' }}
                                  </h3>
                                  
                                  <!-- Text -->
                                  <p 
                                    v-else-if="item.type === 'text'"
                                    class="text-xs"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Text content' }}
                                  </p>
                                  
                                  <!-- Divider -->
                                  <div 
                                    v-else-if="item.type === 'divider'"
                                    class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                  >
                                    <hr class="my-0" :style="item.style" />
                                  </div>
                                  
                                  <!-- Spacer -->
                                  <div 
                                    v-else-if="item.type === 'spacer'"
                                    class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                                    :style="{ minHeight: '20px', height: item.style?.height || '20px', ...item.style }"
                                  >
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                      <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ item.style?.height || '20px' }}</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Quote -->
                                  <blockquote 
                                    v-else-if="item.type === 'quote'"
                                    class="text-xs italic border-l-2 pl-2"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Quote' }}
                                  </blockquote>
                                  
                                  <!-- HTML Element with Full CSS Support -->
                                  <div 
                                    v-else-if="item.type === 'html'"
                                    class="html-nested-container"
                                    :style="{
                                      minHeight: '30px',
                                      fontSize: '12px',
                                      width: '100%'
                                    }"
                                    v-html="getSafeHtml(item.props.children)"
                                  ></div>
                                  
                                  <!-- CTA Block -->
                                  <div v-else-if="item.type === 'cta-block'" class="p-3 bg-linear-to-r from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                                    <h4 class="text-xs font-bold mb-1 text-gray-800">{{ item.props.children || 'Call to Action' }}</h4>
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                      {{ item.props.buttonText || 'Get Started' }}
                                    </button>
                                  </div>
                                  
                                  <!-- Testimonial -->
                                  <div v-else-if="item.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                                    <p class="text-xs text-gray-600 italic mb-1">"{{ item.props.children || 'Great product!' }}"</p>
                                    <p class="text-xs font-semibold text-gray-800">— {{ item.props.author || 'Customer' }}</p>
                                    <div class="flex gap-0.5 mt-1">
                                      <i v-for="n in (item.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                                    </div>
                                  </div>
                                  
                                  <!-- Product Card -->
                                  <div v-else-if="item.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                                    <img :src="item.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                                    <div class="p-2">
                                      <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ item.props.children || 'Product' }}</h5>
                                      <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$99' }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Header -->
                                  <div v-else-if="item.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                                    <h4 class="text-xs font-bold">{{ item.props.children || 'Header' }}</h4>
                                  </div>
                                  
                                  <!-- Footer -->
                                  <div v-else-if="item.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                                    <p class="text-xs">{{ item.props.children || '© 2025 Company' }}</p>
                                  </div>
                                  
                                  <!-- E-commerce: Product Grid -->
                                  <div v-else-if="item.type === 'product-grid'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold mb-1"> {{ item.props.children || 'Products' }}</p>
                                    <div class="grid grid-cols-3 gap-1">
                                      <div v-for="(p, pi) in (item.props.products || []).slice(0,3)" :key="pi" class="bg-white p-1 rounded text-center">
                                        <div class="w-full h-6 bg-gray-200 rounded mb-1"></div>
                                        <p class="text-xs truncate">{{ p.name }}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                                                    
                                  <!-- E-commerce: Coupon Code -->
                                  <div v-else-if="item.type === 'coupon-code'" class="p-2 bg-amber-50 border-2 border-dashed border-amber-400 rounded text-center">
                                    <p class="text-xs text-amber-600">🎟️ {{ item.props.discount || 'Discount' }}</p>
                                    <p class="text-sm font-mono font-bold text-amber-700">{{ item.props.children || 'CODE' }}</p>
                                  </div>
                                  
                                  <!-- E-commerce: Cart Reminder -->
                                  <div v-else-if="item.type === 'cart-reminder'" class="p-2 bg-orange-50 border-l-4 border-orange-500 rounded-r">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Cart Reminder' }}</p>
                                    <p class="text-xs text-gray-500">{{ item.props.subtitle || '' }}</p>
                                  </div>
                                  
                                  <!-- E-commerce: Order Summary -->
                                  <div v-else-if="item.type === 'order-summary'" class="p-2 bg-gray-50 rounded border">
                                    <p class="text-xs font-semibold mb-1"> {{ item.props.children || 'Order' }}</p>
                                    <p class="text-xs text-blue-600 font-bold">{{ item.props.total || '$0' }}</p>
                                  </div>
                                  
                                  <!-- E-commerce: Shipping Info -->
                                  <div v-else-if="item.type === 'shipping-info'" class="p-2 bg-green-50 rounded">
                                    <p class="text-xs font-semibold">🚚 {{ item.props.children || 'Shipping' }}</p>
                                    <p class="text-xs text-gray-600">{{ item.props.address || '' }}</p>
                                  </div>
                                  
                                  <!-- Real Estate: Property Card -->
                                  <div v-else-if="item.type === 'property-card'" class="p-2 bg-white rounded border">
                                    <div class="w-full h-8 bg-gray-200 rounded mb-1"></div>
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Property' }}</p>
                                    <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$0' }}</p>
                                  </div>
                                  
                                  <!-- Real Estate: Property Features -->
                                  <div v-else-if="item.type === 'property-features'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold mb-1">{{ item.props.children || 'Features' }}</p>
                                    <div class="flex flex-wrap gap-1">
                                      <span v-for="(f, fi) in (item.props.features || []).slice(0,3)" :key="fi" class="text-xs bg-white px-1 rounded">{{ f }}</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Real Estate: Location Map -->
                                  <div v-else-if="item.type === 'location-map'" class="p-2 bg-white rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Location' }}</p>
                                    <p class="text-xs text-gray-500">{{ item.props.address || 'Address' }}</p>
                                    <div class="w-full h-12 bg-blue-100 rounded mt-1 flex items-center justify-center">
                                      <span class="text-xs text-blue-500">Map Preview</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Real Estate: Agent Contact -->
                                  <div v-else-if="item.type === 'agent-contact'" class="p-2 bg-blue-50 rounded">
                                    <p class="text-xs font-semibold">👤 {{ item.props.name || 'Agent' }}</p>
                                    <p class="text-xs text-gray-500">{{ item.props.title || '' }}</p>
                                    <p class="text-xs text-blue-600">{{ item.props.phone || '' }}</p>
                                  </div>
                                  
                                  <!-- Recruitment: Job Listing -->
                                  <div v-else-if="item.type === 'job-listing'" class="p-2 bg-white rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Job Title' }}</p>
                                    <p class="text-xs text-blue-600">{{ item.props.company || '' }}</p>
                                    <p class="text-xs text-green-600">{{ item.props.salary || '' }}</p>
                                  </div>
                                  
                                  <!-- Recruitment: Company Intro -->
                                  <div v-else-if="item.type === 'company-intro'" class="p-2 bg-gray-50 rounded text-center">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Company' }}</p>
                                    <p class="text-xs text-gray-500 truncate">{{ item.props.description || '' }}</p>
                                  </div>
                                  
                                  <!-- Recruitment: Benefits List -->
                                  <div v-else-if="item.type === 'benefits-list'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold mb-1"> {{ item.props.children || 'Benefits' }}</p>
                                    <div class="space-y-0.5">
                                      <p v-for="(b, bi) in (item.props.benefits || []).slice(0,3)" :key="bi" class="text-xs">{{ b }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Recruitment: Apply Button -->
                                  <div v-else-if="item.type === 'apply-button'" class="p-2 text-center">
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded">{{ item.props.children || 'Apply Now' }}</button>
                                  </div>
                                  
                                  <!-- Fallback for other types -->
                                  <div v-else-if="item.props?.children" class="text-xs text-gray-700">
                                    {{ item.props.children }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Nested Column Layout -->
                      <div v-else-if="isColumnElement(childElement.type)" class="p-2">
                        <div class="flex items-center justify-between mb-2 p-2">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)" class="text-purple-600"></i>
                            <span class="font-semibold text-purple-700">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Render columns inside -->
                        <div class="grid gap-1" :class="{
                          'grid-cols-1 sm:grid-cols-2': childElement.type === 'columns2',
                          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3': childElement.type === 'columns3',
                          'grid-cols-2 sm:grid-cols-3 md:grid-cols-4': childElement.type === 'columns4'
                        }">
                          <div 
                            v-for="j in getColumnCount(childElement.type)" 
                            :key="j"
                            class="min-h-12 border border-dashed border-purple-300 rounded bg-purple-50/30 p-1"
                            @drop.stop="(e) => handleColumnDrop(e, childElement.id, j - 1)"
                            @dragover.prevent
                          >
                            <div class="text-xs text-purple-500 font-medium mb-1 pointer-events-none">Col {{ j }}</div>
                            <div v-if="childElement.children && childElement.children[j-1] && childElement.children[j-1].length > 0" class="space-y-1">
                              <div 
                                v-for="(item, itemIndex) in childElement.children[j-1]" 
                                :key="item.id" 
                                @click.stop="selectElement(item)"
                                class="text-xs p-2 bg-white rounded border-2 cursor-pointer hover:border-blue-400 transition-colors relative z-30 group/item"
                                :class="selectedElement?.id === item.id ? 'border-blue-500 bg-blue-50 shadow ring-1 ring-blue-400' : 'border-gray-300'"
                              >
                                <!-- Header with icon, name and delete button -->
                                <div class="flex items-center justify-between gap-1.5 mb-1">
                                  <div class="flex items-center gap-1.5 flex-1 min-w-0">
                                    <i :class="getElementIcon(item.type)" class="text-blue-600 shrink-0 text-xs"></i>
                                    <span class="font-medium text-gray-700 truncate text-xs">{{ getElementName(item.type) }}</span>
                                  </div>
                                  <button 
                                    @click.stop="deleteNestedElementDeep(childElement.id, j - 1, itemIndex)"
                                    class="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-all shrink-0"
                                    title="Delete"
                                  >
                                    <i class="bi bi-trash text-xs"></i>
                                  </button>
                                </div>
                                
                                <!-- Actual Element Content -->
                                <div class="mt-1">
                                  <!-- Image -->
                                  <div 
                                    v-if="item.type === 'image'"
                                    class="w-full aspect-square rounded overflow-hidden"
                                    
                                  >
                                    <!-- Fallback img tag for accessibility -->
                                    <img 
                                      :src="item.style?.backgroundImage || item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                                      :alt="item.props.alt || 'Image'"
                                      class="w-full h-full object-cover opacity-0"
                                    />
                                  </div>
                                  
                                  <!-- Video -->
                                  <iframe
                                    v-else-if="item.type === 'video' && item.props.videoType === 'youtube' && getYouTubeEmbedId(item.props.youtubeUrl)"
                                    :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(item.props.youtubeUrl)}`"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || '180px'
                                    }"
                                    class="w-full rounded"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                  ></iframe>
                                  <video 
                                    v-else-if="item.type === 'video'"
                                    :src="item.props.src"
                                    :poster="item.props.poster"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || 'auto'
                                    }"
                                    class="w-full rounded"
                                    controls
                                  ></video>
                                  
                                  <!-- Link -->
                                  <a 
                                    v-else-if="item.type === 'link'"
                                    :href="item.props.href || '#'"
                                    class="text-blue-600 hover:underline text-xs block truncate"
                                  >
                                    {{ item.props.children || 'Link' }}
                                  </a>
                                  
                                  <!-- Button -->
                                  <div 
                                    v-else-if="item.type === 'button'"
                                    class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                                    :style="{ backgroundColor: item.style?.backgroundColor || '#3b82f6' }"
                                  >
                                    {{ item.props.children || 'Button' }}
                                  </div>
                                  
                                  <!-- Heading1 -->
                                  <h1 
                                    v-else-if="item.type === 'heading1'"
                                    class="text-sm font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 1' }}
                                  </h1>
                                  
                                  <!-- Heading2 -->
                                  <h2 
                                    v-else-if="item.type === 'heading2'"
                                    class="text-xs font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 2' }}
                                  </h2>
                                  
                                  <!-- Heading3 -->
                                  <h3 
                                    v-else-if="item.type === 'heading3'"
                                    class="text-xs font-semibold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 3' }}
                                  </h3>
                                  
                                  <!-- Text -->
                                  <p 
                                    v-else-if="item.type === 'text'"
                                    class="text-xs"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Text content' }}
                                  </p>
                                  
                                  <!-- Divider -->
                                  <div 
                                    v-else-if="item.type === 'divider'"
                                    class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                  >
                                    <hr class="my-0" :style="item.style" />
                                  </div>
                                  
                                  <!-- Spacer -->
                                  <div 
                                    v-else-if="item.type === 'spacer'"
                                    class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                                    :style="{ minHeight: '20px', height: item.style?.height || '20px', ...item.style }"
                                  >
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                      <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ item.style?.height || '20px' }}</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Quote -->
                                  <blockquote 
                                    v-else-if="item.type === 'quote'"
                                    class="text-xs italic border-l-2 pl-2"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Quote' }}
                                  </blockquote>
                                  
                                  <!-- HTML Element with Full CSS Support -->
                                  <div 
                                    v-else-if="item.type === 'html'"
                                    class="html-nested-container"
                                    :style="{ 
                                      minHeight: '30px',
                                      fontSize: '12px',
                                      width: '100%'
                                    }"
                                    v-html="getSafeHtml(item.props.children)"
                                  ></div>
                                  
                                  <!-- CTA Block -->
                                  <div v-else-if="item.type === 'cta-block'" class="p-3 bg-linear-to-r  from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                                    <h4 class="text-xs font-bold mb-1 text-gray-800">{{ item.props.children || 'Call to Action' }}</h4>
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                      {{ item.props.buttonText || 'Get Started' }}
                                    </button>
                                  </div>
                                  
                                  <!-- Testimonial -->
                                  <div v-else-if="item.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                                    <p class="text-xs text-gray-600 italic mb-1">"{{ item.props.children || 'Great product!' }}"</p>
                                    <p class="text-xs font-semibold text-gray-800">— {{ item.props.author || 'Customer' }}</p>
                                    <div class="flex gap-0.5 mt-1">
                                      <i v-for="n in (item.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                                    </div>
                                  </div>
                                  
                                  <!-- Product Card -->
                                  <div v-else-if="item.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                                    <img :src="item.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                                    <div class="p-2">
                                      <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ item.props.children || 'Product' }}</h5>
                                      <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$99' }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Header -->
                                  <div v-else-if="item.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                                    <h4 class="text-xs font-bold">{{ item.props.children || 'Header' }}</h4>
                                  </div>
                                  
                                  <!-- Footer -->
                                  <div v-else-if="item.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                                    <p class="text-xs">{{ item.props.children || ' 2025 Company' }}</p>
                                  </div>
                                  
                                  <!-- E-commerce Elements -->
                                  <div v-else-if="item.type === 'product-grid'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold mb-1"> {{ item.props.children || 'Products' }}</p>
                                    <div class="grid grid-cols-3 gap-1">
                                      <div v-for="(p, pi) in (item.props.products || []).slice(0,3)" :key="pi" class="bg-white p-1 rounded text-center">
                                        <div class="w-full h-6 bg-gray-200 rounded mb-1"></div>
                                        <p class="text-xs truncate">{{ p.name }}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div v-else-if="item.type === 'coupon-code'" class="p-2 bg-amber-50 border-2 border-dashed border-amber-400 rounded text-center">
                                    <p class="text-xs text-amber-600">🎟️ {{ item.props.discount || 'Discount' }}</p>
                                    <p class="text-sm font-mono font-bold text-amber-700">{{ item.props.children || 'CODE' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'cart-reminder'" class="p-2 bg-orange-50 border-l-4 border-orange-500 rounded-r">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Cart Reminder' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'order-summary'" class="p-2 bg-gray-50 rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Order' }}</p>
                                    <p class="text-xs text-blue-600 font-bold">{{ item.props.total || '$0' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'shipping-info'" class="p-2 bg-green-50 rounded">
                                    <p class="text-xs font-semibold">🚚 {{ item.props.children || 'Shipping' }}</p>
                                  </div>
                                  
                                  <!-- Real Estate Elements -->
                                  <div v-else-if="item.type === 'property-card'" class="p-2 bg-white rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Property' }}</p>
                                    <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$0' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'property-features'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold">{{ item.props.children || 'Features' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'location-map'" class="p-2 bg-white rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Location' }}</p>
                                    <div class="w-full h-8 bg-blue-100 rounded mt-1 flex items-center justify-center">
                                      <span class="text-xs text-blue-500">Map</span>
                                    </div>
                                  </div>
                                  <div v-else-if="item.type === 'agent-contact'" class="p-2 bg-blue-50 rounded">
                                    <p class="text-xs font-semibold">👤 {{ item.props.name || 'Agent' }}</p>
                                  </div>
                                  
                                  <!-- Recruitment Elements -->
                                  <div v-else-if="item.type === 'job-listing'" class="p-2 bg-white rounded border">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Job' }}</p>
                                    <p class="text-xs text-green-600">{{ item.props.salary || '' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'company-intro'" class="p-2 bg-gray-50 rounded text-center">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Company' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'benefits-list'" class="p-2 bg-gray-50 rounded">
                                    <p class="text-xs font-semibold"> {{ item.props.children || 'Benefits' }}</p>
                                  </div>
                                  <div v-else-if="item.type === 'apply-button'" class="p-2 text-center">
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded">{{ item.props.children || 'Apply' }}</button>
                                  </div>
                                  
                                  <!-- Fallback for other types -->
                                  <div v-else-if="item.props?.children" class="text-xs text-gray-700">
                                    {{ item.props.children }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Regular elements -->
                      <div v-else :style="getElementWrapperStyle(childElement)">
                        <div class="flex items-center justify-between mb-1">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)"></i>
                            <span class="font-medium">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Visual Preview -->
                        <div class="mt-1">
                          <!-- Image -->
                          <div 
                            v-if="childElement.type === 'image'"
                            class="w-full aspect-square rounded overflow-hidden"
                            :style="{
                              backgroundImage: childElement.style?.backgroundImage ? `url(${childElement.style.backgroundImage})` : `url(${childElement.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'})`,
                              backgroundSize: childElement.style?.backgroundSize || 'contain',
                              backgroundPosition: childElement.style?.backgroundPosition || 'center',
                              backgroundRepeat: childElement.style?.backgroundRepeat || 'no-repeat'
                            }"
                          >
                            <img 
                              :src="childElement.style?.backgroundImage || childElement.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                              :alt="childElement.props.alt || 'Image'"
                              class="w-full h-full object-cover opacity-0"
                            />
                          </div>
                          
                          <!-- Video -->
                          <iframe
                            v-else-if="childElement.type === 'video' && childElement.props.videoType === 'youtube' && getYouTubeEmbedId(childElement.props.youtubeUrl)"
                            :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(childElement.props.youtubeUrl)}`"
                            :style="{
                              width: childElement.props.width || '100%',
                              height: childElement.props.height || '180px'
                            }"
                            class="w-full rounded"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                          <video 
                            v-else-if="childElement.type === 'video'"
                            :src="childElement.props.src"
                            :poster="childElement.props.poster"
                            :style="{
                              width: childElement.props.width || '100%',
                              height: childElement.props.height || 'auto'
                            }"
                            class="w-full rounded"
                            controls
                          ></video>
                          
                          <!-- Button -->
                          <div 
                            v-else-if="childElement.type === 'button'"
                            class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                            :style="{ backgroundColor: childElement.style?.backgroundColor || '#3b82f6' }"
                          >
                            {{ childElement.props.children || 'Button' }}
                          </div>
                          
                          <!-- Heading1 -->
                          <h1 
                            v-else-if="childElement.type === 'heading1'"
                            class="text-sm font-bold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 1' }}
                          </h1>
                          
                          <!-- Heading2 -->
                          <h2 
                            v-else-if="childElement.type === 'heading2'"
                            class="text-xs font-bold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 2' }}
                          </h2>
                          
                          <!-- Heading3 -->
                          <h3 
                            v-else-if="childElement.type === 'heading3'"
                            class="text-xs font-semibold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 3' }}
                          </h3>
                          
                          <!-- Text -->
                          <p 
                            v-else-if="childElement.type === 'text'"
                            class="text-xs"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Text content' }}
                          </p>
                          
                          <!-- Link -->
                          <a 
                            v-else-if="childElement.type === 'link'"
                            :href="childElement.props.href || '#'"
                            class="text-blue-600 hover:underline text-xs block truncate"
                          >
                            {{ childElement.props.children || 'Link' }}
                          </a>
                          
                          <!-- Divider -->
                          <div 
                            v-else-if="childElement.type === 'divider'"
                            class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                          >
                            <hr class="my-0" :style="childElement.style" />
                          </div>
                          
                          <!-- Spacer -->
                          <div 
                            v-else-if="childElement.type === 'spacer'"
                            class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                            :style="{ minHeight: '20px', height: childElement.style?.height || '20px', ...childElement.style }"
                          >
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ childElement.style?.height || '20px' }}</span>
                            </div>
                          </div>
                          
                          <!-- Quote -->
                          <blockquote 
                            v-else-if="childElement.type === 'quote'"
                            class="text-xs italic border-l-2 pl-2"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Quote' }}
                          </blockquote>
                          
                          <!-- HTML Element with Full CSS Support -->
                          <div 
                            v-else-if="childElement.type === 'html'"
                            class="html-child-container"
                            :style="{ 
                              minHeight: '30px',
                              fontSize: '12px',
                              width: '100%'
                            }"
                          >
                            <component :is="'style'" v-if="getHtmlCSS(childElement.props.children)">
                              {{ getHtmlCSS(childElement.props.children) }}
                            </component>
                            <div 
                              class="html-child-content"
                              v-html="getHtmlOnlyContent(childElement.props.children)"
                            ></div>
                          </div>
                          
                          <!-- CTA Block -->
                          <div v-else-if="childElement.type === 'cta-block'" class="p-3 bg-linear-to-r  from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                            <h4 class="text-xs font-bold mb-1 text-gray-800">{{ childElement.props.children || 'Call to Action' }}</h4>
                            <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                              {{ childElement.props.buttonText || 'Get Started' }}
                            </button>
                          </div>
                          
                          <!-- Testimonial -->
                          <div v-else-if="childElement.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                            <p class="text-xs text-gray-600 italic mb-1">"{{ childElement.props.children || 'Great product!' }}"</p>
                            <p class="text-xs font-semibold text-gray-800">— {{ childElement.props.author || 'Customer' }}</p>
                            <div class="flex gap-0.5 mt-1">
                              <i v-for="n in (childElement.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                            </div>
                          </div>
                          
                          <!-- Product Card -->
                          <div v-else-if="childElement.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                            <img :src="childElement.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                            <div class="p-2">
                              <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ childElement.props.children || 'Product' }}</h5>
                              <p class="text-xs text-blue-600 font-bold">{{ childElement.props.price || '$99' }}</p>
                            </div>
                          </div>
                          
                          <!-- Header -->
                          <div v-else-if="childElement.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                            <h4 class="text-xs font-bold">{{ childElement.props.children || 'Header' }}</h4>
                          </div>
                          
                          <!-- Footer -->
                          <div v-else-if="childElement.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                            <p class="text-xs">{{ childElement.props.children || '© 2025 Company' }}</p>
                          </div>
                          
                          
                          
                          <!-- Fallback -->
                          <div v-else-if="childElement.props?.children" class="text-xs text-gray-700">
                            {{ childElement.props.children }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Always show add button -->
                  <div class="flex items-center justify-center" :class="element.children && element.children[i-1] && element.children[i-1].length > 0 ? 'py-2' : 'h-16'">
                    <button 
                      @click.stop="showColumnElementLibrary(element.id, i - 1)"
                      class="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors text-xs font-medium z-10 relative flex items-center gap-1"
                    >
                      <i class="bi bi-plus-circle"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                
                <!-- Drop indicator -->
                <div class="absolute inset-0 bg-blue-100 border-2 border-blue-400 rounded-lg opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity"></div>
              </div>
            </div>
          </div>

          <!-- Section Layout -->
          <div v-else-if="element.type === 'section'" class="space-y-2">
            <div class="text-xs text-gray-500 font-medium">{{ getElementName(element.type) }}</div>
            <div 
              class="min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 relative group"
              @drop.stop="(e) => handleSectionDrop(e, element.id)"
              @dragover.prevent
              @dragenter.prevent
            >
              <!-- Section Content Area -->
              <div class="min-h-20 space-y-2">
                <!-- Render nested elements if any -->
                <div v-if="element.children && element.children.length > 0" class="space-y-2">
                  <div 
                    v-for="(childElement, childIndex) in element.children" 
                    :key="childElement.id"
                    @click.stop="selectElement(childElement)"
                    class="p-2 bg-white rounded border-2 cursor-pointer hover:border-blue-300 transition-colors text-sm relative group"
                    :class="selectedElement?.id === childElement.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <i :class="getElementIcon(childElement.type)" class="text-sm"></i>
                        <span class="font-medium">{{ getElementName(childElement.type) }}</span>
                      </div>
                      <button 
                        @click.stop="deleteNestedElement(element.id, null, childIndex)"
                        class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                      >
                        <i class="bi bi-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Empty state with add button -->
                <div v-else class="flex items-center justify-center h-20">
                  <button 
                    @click="showSectionElementLibrary(element.id)"
                    class="px-6 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <i class="bi bi-plus-circle mr-2"></i>
                    Add Elements to Section
                  </button>
                </div>
              </div>
              
              <!-- Drop indicator -->
              <div class="absolute inset-0 bg-blue-100 border-2 border-blue-400 rounded-lg opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity"></div>
            </div>
          </div>

          <!-- Multi-Row Layout (row2, row3, row4) -->
          <div v-else-if="isRowElement(element.type)" class="space-y-2">
            <div class="flex items-center justify-between mb-2 p-2">
              <div class="text-xs text-gray-500 font-medium">{{ getElementName(element.type) }}</div>
              <button 
                @click.stop="configureColumn(element)"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <i class="bi bi-gear mr-1"></i>
                Configure
              </button>
            </div>
            <div class="grid gap-2 p-2" :class="{
              'grid-rows-2': element.type === 'row2',
              'grid-rows-3': element.type === 'row3',
              'grid-rows-4': element.type === 'row4'
            }">
              <div 
                v-for="i in getRowCount(element.type)" 
                :key="i"
                class="min-h-24 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 relative z-0"
                :class="{'border-blue-400 bg-blue-50': dropTargetColumn === `${element.id}-row-${i}`}"
                @drop.stop="(e) => handleRowItemDrop(e, element.id, i - 1)"
                @dragover.prevent="dropTargetColumn = `${element.id}-row-${i}`"
                @dragleave="dropTargetColumn = null"
              >
                <div class="text-xs text-gray-400 mb-2 font-medium pointer-events-none">Row {{ i }}</div>
                
                <!-- Row Content Area -->
                <div class="min-h-12 space-y-2">
                  <!-- Render nested elements if any -->
                  <div v-if="element.children && element.children[i-1] && element.children[i-1].length > 0" class="space-y-2 mb-2 relative z-10">
                    <div 
                      v-for="(childElement, childIndex) in element.children[i-1]" 
                      :key="childElement.id"
                      @click.stop="selectElement(childElement)"
                      class="bg-white rounded border-2 cursor-pointer hover:border-blue-300 transition-colors relative group z-20"
                      :class="selectedElement?.id === childElement.id ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-400' : 'border-gray-200'"
                    >
                      <!-- Nested Column Layout -->
                      <div v-if="isColumnElement(childElement.type)" class="p-2">
                        <div class="flex items-center justify-between mb-2 p-2">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)" class="text-purple-600"></i>
                            <span class="font-semibold text-purple-700">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Render columns inside -->
                        <div class="grid gap-1" :class="{
                          'grid-cols-1 sm:grid-cols-2': childElement.type === 'columns2',
                          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3': childElement.type === 'columns3',
                          'grid-cols-2 sm:grid-cols-3 md:grid-cols-4': childElement.type === 'columns4'
                        }">
                          <div 
                            v-for="j in getColumnCount(childElement.type)" 
                            :key="j"
                            class="min-h-16 border border-dashed border-purple-300 rounded bg-purple-50/30 p-1 relative"
                            @drop.stop="(e) => handleColumnDrop(e, childElement.id, j - 1)"
                            @dragover.prevent
                          >
                            <div class="text-xs text-purple-500 font-medium mb-1 pointer-events-none">Col {{ j }}</div>
                            
                            <!-- Empty state when no children -->
                            <div v-if="!childElement.children || !childElement.children[j-1] || childElement.children[j-1].length === 0" 
                                 class="text-xs text-gray-400 italic text-center py-2 pointer-events-none">
                              Drag elements here
                            </div>
                            
                            <!-- Items if any -->
                            <div v-if="childElement.children && childElement.children[j-1] && childElement.children[j-1].length > 0" class="space-y-1">
                              <div 
                                v-for="(item, itemIndex) in childElement.children[j-1]" 
                                :key="item.id" 
                                @click.stop="selectElement(item)"
                                class="text-xs p-2 bg-white rounded border-2 cursor-pointer hover:border-blue-400 transition-colors relative z-30 group/item"
                                :class="selectedElement?.id === item.id ? 'border-blue-500 bg-blue-50 shadow ring-1 ring-blue-400' : 'border-gray-300'"
                              >
                                <!-- Header with icon, name and delete button -->
                                <div class="flex items-center justify-between gap-1.5 mb-1">
                                  <div class="flex items-center gap-1.5 flex-1 min-w-0">
                                    <i :class="getElementIcon(item.type)" class="text-blue-600 shrink-0 text-xs"></i>
                                    <span class="font-medium text-gray-700 truncate text-xs">{{ getElementName(item.type) }}</span>
                                  </div>
                                  <button 
                                    @click.stop="deleteNestedElementDeep(childElement.id, j - 1, itemIndex)"
                                    class="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-all shrink-0"
                                    title="Delete"
                                  >
                                    <i class="bi bi-trash text-xs"></i>
                                  </button>
                                </div>
                                
                                <!-- Actual Element Content -->
                                <div class="mt-1">
                                  <!-- Image -->
                                  <div 
                                    v-if="item.type === 'image'"
                                    class="w-full aspect-square rounded overflow-hidden"
                                    :style="{
                                      backgroundImage: item.style?.backgroundImage ? `url(${item.style.backgroundImage})` : `url(${item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'})`,
                                      backgroundSize: item.style?.backgroundSize || 'contain',
                                      backgroundPosition: item.style?.backgroundPosition || 'center',
                                      backgroundRepeat: item.style?.backgroundRepeat || 'no-repeat'
                                    }"
                                  >
                                    <!-- Fallback img tag for accessibility -->
                                    <img 
                                      :src="item.style?.backgroundImage || item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                                      :alt="item.props.alt || 'Image'"
                                      class="w-full h-full object-cover opacity-0"
                                    />
                                  </div>
                                  
                                  <!-- Video -->
                                  <iframe
                                    v-else-if="item.type === 'video' && item.props.videoType === 'youtube' && getYouTubeEmbedId(item.props.youtubeUrl)"
                                    :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(item.props.youtubeUrl)}`"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || '180px'
                                    }"
                                    class="w-full rounded"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                  ></iframe>
                                  <video 
                                    v-else-if="item.type === 'video'"
                                    :src="item.props.src"
                                    :poster="item.props.poster"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || 'auto'
                                    }"
                                    class="w-full rounded"
                                    controls
                                  ></video>
                                  
                                  <!-- Link -->
                                  <a 
                                    v-else-if="item.type === 'link'"
                                    :href="item.props.href || '#'"
                                    class="text-blue-600 hover:underline text-xs block truncate"
                                  >
                                    {{ item.props.children || 'Link' }}
                                  </a>
                                  
                                  <!-- Button -->
                                  <div 
                                    v-else-if="item.type === 'button'"
                                    class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                                    :style="{ backgroundColor: item.style?.backgroundColor || '#3b82f6' }"
                                  >
                                    {{ item.props.children || 'Button' }}
                                  </div>
                                  
                                  <!-- Heading1 -->
                                  <h1 
                                    v-else-if="item.type === 'heading1'"
                                    class="text-sm font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 1' }}
                                  </h1>
                                  
                                  <!-- Heading2 -->
                                  <h2 
                                    v-else-if="item.type === 'heading2'"
                                    class="text-xs font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 2' }}
                                  </h2>
                                  
                                  <!-- Heading3 -->
                                  <h3 
                                    v-else-if="item.type === 'heading3'"
                                    class="text-xs font-semibold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 3' }}
                                  </h3>
                                  
                                  <!-- Text -->
                                  <p 
                                    v-else-if="item.type === 'text'"
                                    class="text-xs"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Text content' }}
                                  </p>
                                  
                                  <!-- Divider -->
                                  <div 
                                    v-else-if="item.type === 'divider'"
                                    class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                  >
                                    <hr class="my-0" :style="item.style" />
                                  </div>
                                  
                                  <!-- Spacer -->
                                  <div 
                                    v-else-if="item.type === 'spacer'"
                                    class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                                    :style="{ minHeight: '20px', height: item.style?.height || '20px', ...item.style }"
                                  >
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                      <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ item.style?.height || '20px' }}</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Quote -->
                                  <blockquote 
                                    v-else-if="item.type === 'quote'"
                                    class="text-xs italic border-l-2 pl-2"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Quote' }}
                                  </blockquote>
                                  
                                  <!-- HTML Element with Full CSS Support -->
                                  <div 
                                    v-else-if="item.type === 'html'"
                                    class="html-nested-container"
                                    :style="{ 
                                      minHeight: '30px',
                                      fontSize: '12px',
                                      width: '100%'
                                    }"
                                    v-html="getSafeHtml(item.props.children)"
                                  ></div>
                                  
                                  <!-- CTA Block -->
                                  <div v-else-if="item.type === 'cta-block'" class="p-3 bg-linear-to-r  from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                                    <h4 class="text-xs font-bold mb-1 text-gray-800">{{ item.props.children || 'Call to Action' }}</h4>
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                      {{ item.props.buttonText || 'Get Started' }}
                                    </button>
                                  </div>
                                  
                                  <!-- Testimonial -->
                                  <div v-else-if="item.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                                    <p class="text-xs text-gray-600 italic mb-1">"{{ item.props.children || 'Great product!' }}"</p>
                                    <p class="text-xs font-semibold text-gray-800">— {{ item.props.author || 'Customer' }}</p>
                                    <div class="flex gap-0.5 mt-1">
                                      <i v-for="n in (item.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                                    </div>
                                  </div>
                                  
                                  <!-- Product Card -->
                                  <div v-else-if="item.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                                    <img :src="item.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                                    <div class="p-2">
                                      <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ item.props.children || 'Product' }}</h5>
                                      <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$99' }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Header -->
                                  <div v-else-if="item.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                                    <h4 class="text-xs font-bold">{{ item.props.children || 'Header' }}</h4>
                                  </div>
                                  
                                  <!-- Footer -->
                                  <div v-else-if="item.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                                    <p class="text-xs">{{ item.props.children || '© 2025 Company' }}</p>
                                  </div>
                                  
                                  
                                  
                                  <!-- Fallback for other types -->
                                  <div v-else-if="item.props?.children" class="text-xs text-gray-700">
                                    {{ item.props.children }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Nested Row Layout -->
                      <div v-else-if="isRowElement(childElement.type)" class="p-2">
                        <div class="flex items-center justify-between mb-2 p-2">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)" class="text-green-600"></i>
                            <span class="font-semibold text-green-700">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Render rows inside -->
                        <div class="space-y-1">
                          <div 
                            v-for="j in getRowCount(childElement.type)" 
                            :key="j"
                            class="min-h-16 border border-dashed border-green-300 rounded bg-green-50/30 p-1"
                            @drop.stop="(e) => handleRowItemDrop(e, childElement.id, j - 1)"
                            @dragover.prevent
                          >
                            <div class="text-xs text-green-500 font-medium mb-1 pointer-events-none">Row {{ j }}</div>
                            <div v-if="childElement.children && childElement.children[j-1] && childElement.children[j-1].length > 0" class="space-y-1">
                              <div 
                                v-for="(item, itemIndex) in childElement.children[j-1]" 
                                :key="item.id" 
                                @click.stop="selectElement(item)"
                                class="text-xs p-2 bg-white rounded border-2 cursor-pointer hover:border-blue-400 transition-colors relative z-30 group/item"
                                :class="selectedElement?.id === item.id ? 'border-blue-500 bg-blue-50 shadow ring-1 ring-blue-400' : 'border-gray-300'"
                              >
                                <!-- Header with icon, name and delete button -->
                                <div class="flex items-center justify-between gap-1.5 mb-1">
                                  <div class="flex items-center gap-1.5 flex-1 min-w-0">
                                    <i :class="getElementIcon(item.type)" class="text-blue-600 shrink-0 text-xs"></i>
                                    <span class="font-medium text-gray-700 truncate text-xs">{{ getElementName(item.type) }}</span>
                                  </div>
                                  <button 
                                    @click.stop="deleteNestedElementDeep(childElement.id, j - 1, itemIndex)"
                                    class="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-all shrink-0"
                                    title="Delete"
                                  >
                                    <i class="bi bi-trash text-xs"></i>
                                  </button>
                                </div>
                                
                                <!-- Actual Element Content -->
                                <div class="mt-1">
                                  <!-- Image -->
                                  <div 
                                    v-if="item.type === 'image'"
                                    class="w-full aspect-square rounded overflow-hidden"
                                    :style="{
                                      backgroundImage: item.style?.backgroundImage ? `url(${item.style.backgroundImage})` : `url(${item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'})`,
                                      backgroundSize: item.style?.backgroundSize || 'contain',
                                      backgroundPosition: item.style?.backgroundPosition || 'center',
                                      backgroundRepeat: item.style?.backgroundRepeat || 'no-repeat'
                                    }"
                                  >
                                    <!-- Fallback img tag for accessibility -->
                                    <img 
                                      :src="item.style?.backgroundImage || item.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                                      :alt="item.props.alt || 'Image'"
                                      class="w-full h-full object-cover opacity-0"
                                    />
                                  </div>
                                  
                                  <!-- Video -->
                                  <iframe
                                    v-else-if="item.type === 'video' && item.props.videoType === 'youtube' && getYouTubeEmbedId(item.props.youtubeUrl)"
                                    :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(item.props.youtubeUrl)}`"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || '180px'
                                    }"
                                    class="w-full rounded"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                  ></iframe>
                                  <video 
                                    v-else-if="item.type === 'video'"
                                    :src="item.props.src"
                                    :poster="item.props.poster"
                                    :style="{
                                      width: item.props.width || '100%',
                                      height: item.props.height || 'auto'
                                    }"
                                    class="w-full rounded"
                                    controls
                                  ></video>
                                  
                                  <!-- Link -->
                                  <a 
                                    v-else-if="item.type === 'link'"
                                    :href="item.props.href || '#'"
                                    class="text-blue-600 hover:underline text-xs block truncate"
                                  >
                                    {{ item.props.children || 'Link' }}
                                  </a>
                                  
                                  <!-- Button -->
                                  <div 
                                    v-else-if="item.type === 'button'"
                                    class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                                    :style="{ backgroundColor: item.style?.backgroundColor || '#3b82f6' }"
                                  >
                                    {{ item.props.children || 'Button' }}
                                  </div>
                                  
                                  <!-- Heading1 -->
                                  <h1 
                                    v-else-if="item.type === 'heading1'"
                                    class="text-sm font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 1' }}
                                  </h1>
                                  
                                  <!-- Heading2 -->
                                  <h2 
                                    v-else-if="item.type === 'heading2'"
                                    class="text-xs font-bold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 2' }}
                                  </h2>
                                  
                                  <!-- Heading3 -->
                                  <h3 
                                    v-else-if="item.type === 'heading3'"
                                    class="text-xs font-semibold"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Heading 3' }}
                                  </h3>
                                  
                                  <!-- Text -->
                                  <p 
                                    v-else-if="item.type === 'text'"
                                    class="text-xs"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Text content' }}
                                  </p>
                                  
                                  <!-- Divider -->
                                  <div 
                                    v-else-if="item.type === 'divider'"
                                    class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                  >
                                    <hr class="my-0" :style="item.style" />
                                  </div>
                                  
                                  <!-- Spacer -->
                                  <div 
                                    v-else-if="item.type === 'spacer'"
                                    class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                                    :style="{ minHeight: '20px', height: item.style?.height || '20px', ...item.style }"
                                  >
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                      <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ item.style?.height || '20px' }}</span>
                                    </div>
                                  </div>
                                  
                                  <!-- Quote -->
                                  <blockquote 
                                    v-else-if="item.type === 'quote'"
                                    class="text-xs italic border-l-2 pl-2"
                                    :style="item.style"
                                  >
                                    {{ item.props.children || 'Quote' }}
                                  </blockquote>
                                  
                                  <!-- HTML Element with Full CSS Support -->
                                  <div 
                                    v-else-if="item.type === 'html'"
                                    class="html-nested-container"
                                    :style="{ 
                                      minHeight: '30px',
                                      fontSize: '12px',
                                      width: '100%'
                                    }"
                                    v-html="getSafeHtml(item.props.children)"
                                  ></div>
                                  
                                  <!-- CTA Block -->
                                  <div v-else-if="item.type === 'cta-block'" class="p-3 bg-linear-to-r  from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                                    <h4 class="text-xs font-bold mb-1 text-gray-800">{{ item.props.children || 'Call to Action' }}</h4>
                                    <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                      {{ item.props.buttonText || 'Get Started' }}
                                    </button>
                                  </div>
                                  
                                  <!-- Testimonial -->
                                  <div v-else-if="item.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                                    <p class="text-xs text-gray-600 italic mb-1">"{{ item.props.children || 'Great product!' }}"</p>
                                    <p class="text-xs font-semibold text-gray-800">— {{ item.props.author || 'Customer' }}</p>
                                    <div class="flex gap-0.5 mt-1">
                                      <i v-for="n in (item.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                                    </div>
                                  </div>
                                  
                                  <!-- Product Card -->
                                  <div v-else-if="item.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                                    <img :src="item.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                                    <div class="p-2">
                                      <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ item.props.children || 'Product' }}</h5>
                                      <p class="text-xs text-blue-600 font-bold">{{ item.props.price || '$99' }}</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Header -->
                                  <div v-else-if="item.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                                    <h4 class="text-xs font-bold">{{ item.props.children || 'Header' }}</h4>
                                  </div>
                                  
                                  <!-- Footer -->
                                  <div v-else-if="item.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                                    <p class="text-xs">{{ item.props.children || '© 2025 Company' }}</p>
                                  </div>
                                  
                                 
                                  
                                  <!-- Fallback for other types -->
                                  <div v-else-if="item.props?.children" class="text-xs text-gray-700">
                                    {{ item.props.children }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Regular Element -->
                      <div v-else :style="getElementWrapperStyle(childElement)">
                        <div class="flex items-center justify-between mb-1">
                          <div class="flex items-center gap-1 text-xs">
                            <i :class="getElementIcon(childElement.type)"></i>
                            <span class="font-medium">{{ getElementName(childElement.type) }}</span>
                          </div>
                          <button 
                            @click.stop="deleteNestedElement(element.id, i-1, childIndex)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <i class="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        <!-- Visual Preview -->
                        <div class="mt-1">
                          <!-- Image -->
                          <div 
                            v-if="childElement.type === 'image'"
                            class="w-full aspect-square rounded overflow-hidden"
                            :style="{
                              backgroundImage: childElement.style?.backgroundImage ? `url(${childElement.style.backgroundImage})` : `url(${childElement.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'})`,
                              backgroundSize: childElement.style?.backgroundSize || 'contain',
                              backgroundPosition: childElement.style?.backgroundPosition || 'center',
                              backgroundRepeat: childElement.style?.backgroundRepeat || 'no-repeat'
                            }"
                          >
                            <img 
                              :src="childElement.style?.backgroundImage || childElement.props.src || 'https://placehold.co/200x200/e2e8f0/64748b?text=Image'"
                              :alt="childElement.props.alt || 'Image'"
                              class="w-full h-full object-cover opacity-0"
                            />
                          </div>
                          
                          <!-- Video -->
                          <iframe
                            v-else-if="childElement.type === 'video' && childElement.props.videoType === 'youtube' && getYouTubeEmbedId(childElement.props.youtubeUrl)"
                            :src="`https://www.youtube.com/embed/${getYouTubeEmbedId(childElement.props.youtubeUrl)}`"
                            :style="{
                              width: childElement.props.width || '100%',
                              height: childElement.props.height || '180px'
                            }"
                            class="w-full rounded"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                          <video 
                            v-else-if="childElement.type === 'video'"
                            :src="childElement.props.src"
                            :poster="childElement.props.poster"
                            :style="{
                              width: childElement.props.width || '100%',
                              height: childElement.props.height || 'auto'
                            }"
                            class="w-full rounded"
                            controls
                          ></video>
                          
                          <!-- Button -->
                          <div 
                            v-else-if="childElement.type === 'button'"
                            class="inline-block px-3 py-1.5 rounded text-xs text-white text-center"
                            :style="{ backgroundColor: childElement.style?.backgroundColor || '#3b82f6' }"
                          >
                            {{ childElement.props.children || 'Button' }}
                          </div>
                          
                          <!-- Heading1 -->
                          <h1 
                            v-else-if="childElement.type === 'heading1'"
                            class="text-sm font-bold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 1' }}
                          </h1>
                          
                          <!-- Heading2 -->
                          <h2 
                            v-else-if="childElement.type === 'heading2'"
                            class="text-xs font-bold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 2' }}
                          </h2>
                          
                          <!-- Heading3 -->
                          <h3 
                            v-else-if="childElement.type === 'heading3'"
                            class="text-xs font-semibold"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Heading 3' }}
                          </h3>
                          
                          <!-- Text -->
                          <p 
                            v-else-if="childElement.type === 'text'"
                            class="text-xs"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Text content' }}
                          </p>
                          
                          <!-- Link -->
                          <a 
                            v-else-if="childElement.type === 'link'"
                            :href="childElement.props.href || '#'"
                            class="text-blue-600 hover:underline text-xs block truncate"
                          >
                            {{ childElement.props.children || 'Link' }}
                          </a>
                          
                          <!-- Divider -->
                          <div 
                            v-else-if="childElement.type === 'divider'"
                            class="divider-wrapper py-2 hover:bg-blue-50/50 transition-colors cursor-pointer"
                          >
                            <hr class="my-0" :style="childElement.style" />
                          </div>
                          
                          <!-- Spacer -->
                          <div 
                            v-else-if="childElement.type === 'spacer'"
                            class="spacer-wrapper hover:bg-blue-50/50 transition-colors cursor-pointer relative"
                            :style="{ minHeight: '20px', height: childElement.style?.height || '20px', ...childElement.style }"
                          >
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span class="text-xs text-blue-400 bg-white/80 px-2 py-0.5 rounded">{{ childElement.style?.height || '20px' }}</span>
                            </div>
                          </div>
                          
                          <!-- Quote -->
                          <blockquote 
                            v-else-if="childElement.type === 'quote'"
                            class="text-xs italic border-l-2 pl-2"
                            :style="childElement.style"
                          >
                            {{ childElement.props.children || 'Quote' }}
                          </blockquote>
                          
                          <!-- HTML Element with Full CSS Support -->
                          <div 
                            v-else-if="childElement.type === 'html'"
                            class="html-child-container"
                            :style="{ 
                              minHeight: '30px',
                              fontSize: '12px',
                              width: '100%'
                            }"
                          >
                            <component :is="'style'" v-if="getHtmlCSS(childElement.props.children)">
                              {{ getHtmlCSS(childElement.props.children) }}
                            </component>
                            <div 
                              class="html-child-content"
                              v-html="getHtmlOnlyContent(childElement.props.children)"
                            ></div>
                          </div>
                          
                          <!-- CTA Block -->
                          <div v-else-if="childElement.type === 'cta-block'" class="p-3 bg-linear-to-r  from-blue-50 to-lime-50 border border-blue-200 rounded text-center">
                            <h4 class="text-xs font-bold mb-1 text-gray-800">{{ childElement.props.children || 'Call to Action' }}</h4>
                            <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                              {{ childElement.props.buttonText || 'Get Started' }}
                            </button>
                          </div>
                          
                          <!-- Testimonial -->
                          <div v-else-if="childElement.type === 'testimonial'" class="p-2 border-l-2 border-blue-500 bg-gray-50 rounded">
                            <p class="text-xs text-gray-600 italic mb-1">"{{ childElement.props.children || 'Great product!' }}"</p>
                            <p class="text-xs font-semibold text-gray-800">— {{ childElement.props.author || 'Customer' }}</p>
                            <div class="flex gap-0.5 mt-1">
                              <i v-for="n in (childElement.props.rating || 5)" :key="n" class="bi bi-star-fill text-yellow-400 text-xs"></i>
                            </div>
                          </div>
                          
                          <!-- Product Card -->
                          <div v-else-if="childElement.type === 'product-card'" class="border border-gray-200 rounded overflow-hidden bg-white">
                            <img :src="childElement.props.image || 'https://placehold.co/200x120/e2e8f0/64748b?text=Product'" alt="Product" class="w-full h-20 object-cover" />
                            <div class="p-2">
                              <h5 class="text-xs font-semibold text-gray-800 mb-1">{{ childElement.props.children || 'Product' }}</h5>
                              <p class="text-xs text-blue-600 font-bold">{{ childElement.props.price || '$99' }}</p>
                            </div>
                          </div>
                          
                          <!-- Header -->
                          <div v-else-if="childElement.type === 'header'" class="p-2 bg-gray-900 text-white text-center rounded">
                            <h4 class="text-xs font-bold">{{ childElement.props.children || 'Header' }}</h4>
                          </div>
                          
                          <!-- Footer -->
                          <div v-else-if="childElement.type === 'footer'" class="p-2 bg-gray-900 text-gray-400 text-center rounded">
                            <p class="text-xs">{{ childElement.props.children || '© 2025 Company' }}</p>
                          </div>
                          
                          
                          
                          <!-- Fallback -->
                          <div v-else-if="childElement.props?.children" class="text-xs text-gray-700">
                            {{ childElement.props.children }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Always show add button -->
                  <div class="flex items-center justify-center" :class="element.children && element.children[i-1] && element.children[i-1].length > 0 ? 'py-2' : 'h-12'">
                    <button 
                      @click.stop="showRowItemLibrary(element.id, i - 1)"
                      class="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors text-xs font-medium z-10 relative flex items-center gap-1"
                    >
                      <i class="bi bi-plus-circle"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Single Row Layout -->
          <div v-else-if="element.type === 'row'" class="space-y-2">
            <div class="text-xs text-gray-500 font-medium">{{ getElementName(element.type) }}</div>
            <div 
              class="min-h-24 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 relative group"
              @drop.stop="(e) => handleRowDrop(e, element.id)"
              @dragover.prevent
              @dragenter.prevent
            >
              <!-- Row Content Area -->
              <div class="min-h-16 flex items-center justify-center">
                <!-- Render nested elements if any -->
                <div v-if="element.children && element.children.length > 0" class="flex flex-wrap gap-2 w-full">
                  <div 
                    v-for="(childElement, childIndex) in element.children" 
                    :key="childElement.id"
                    @click.stop="selectElement(childElement)"
                    class="px-2 py-1 bg-white rounded border-2 cursor-pointer hover:border-blue-300 transition-colors text-xs relative group"
                    :class="selectedElement?.id === childElement.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                  >
                    <div class="flex items-center gap-1">
                      <i :class="getElementIcon(childElement.type)" class="text-xs"></i>
                      <span class="font-medium">{{ getElementName(childElement.type) }}</span>
                      <button 
                        @click.stop="deleteNestedElement(element.id, null, childIndex)"
                        class="ml-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                      >
                        <i class="bi bi-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Empty state with add button -->
                <div v-else class="flex items-center justify-center">
                  <button 
                    @click="showRowItemLibrary(element.id, i - 1)"
                    class="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                  >
                    <i class="bi bi-plus-circle mr-1"></i>
                    Add Elements to Row
                  </button>
                </div>
              </div>
              
              <!-- Drop indicator -->
              <div class="absolute inset-0 bg-blue-100 border-2 border-blue-400 rounded-lg opacity-0 group-hover:opacity-50 pointer-events-none transition-opacity"></div>
            </div>
          </div>

          <!-- Custom Elements with Rich Display -->
          <div v-else-if="element.type === 'cta-block'" class="p-6 text-center bg-white rounded-lg" :style="element.style">
            <h3 class="text-xl font-bold mb-3" :style="{ color: element.style.color || '#1f2937' }">
              {{ element.props.children }}
            </h3>
            <button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium" :style="{ backgroundColor: element.style.buttonColor || '#3b82f6' }">
              {{ element.props.buttonText || 'Get Started' }}
            </button>
          </div>

          <div v-else-if="element.type === 'testimonial'" class="p-4 rounded" :style="{ ...element.style, borderLeft: `4px solid ${element.props.borderColor || '#3b82f6'}` }">
            <div class="flex items-center gap-1 mb-3">
              <i v-for="i in (element.props.rating || 5)" :key="i" class="bi bi-star-fill text-xs" :style="{ color: element.props.starColor || '#f59e0b' }"></i>
              <i v-for="i in (5 - (element.props.rating || 5))" :key="'empty-'+i" class="bi bi-star text-xs text-gray-300"></i>
            </div>
            <p class="italic mb-3" :style="{ color: element.props.textColor || '#374151', fontSize: element.props.fontSize || '16px' }">"{{ element.props.children }}"</p>
            <div class="flex items-center gap-3">
              <img v-if="element.props.avatar" :src="element.props.avatar" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold" :style="{ color: element.props.textColor || '#1f2937', fontSize: '14px' }">{{ element.props.author || 'Customer Name' }}</p>
                <p v-if="element.props.role" class="text-xs text-gray-500">{{ element.props.role }}</p>
              </div>
            </div>
          </div>

          <!-- Professional Product Card -->
          <div v-else-if="element.type === 'product-card'" class="bg-white rounded-2xl shadow-lg overflow-hidden" :style="element.style">
            <!-- Image with Badges Overlay -->
            <div class="relative">
              <img :src="element.props.image || 'https://placehold.co/400x300/f8fafc/64748b?text=Premium+Product'" 
                   alt="Product" 
                   class="w-full h-56 object-cover" />
              <!-- Badges ON Image -->
              <div v-if="element.props.badge || element.props.discount || !element.props.inStock" class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span v-if="element.props.badge" class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{{ element.props.badge }}</span>
                <span v-if="element.props.discount" class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">-{{ element.props.discount }}%</span>
                <span v-if="!element.props.inStock" class="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Hết hàng</span>
              </div>
            </div>
            
            <div class="p-6" :class="{ 'text-left': element.props.align === 'left', 'text-center': element.props.align === 'center' || !element.props.align, 'text-right': element.props.align === 'right' }">
              <!-- Product Name & Rating -->
              <div class="mb-3">
                <h4 class="font-bold mb-2 line-clamp-2" :style="{ fontSize: element.props.fontSize || '22px', color: element.props.textColor || '#1f2937' }">{{ element.props.children || 'Premium Product' }}</h4>
                <div class="flex items-center gap-2" :class="{ 'justify-start': element.props.align === 'left', 'justify-center': element.props.align === 'center' || !element.props.align, 'justify-end': element.props.align === 'right' }">
                  <div class="flex items-center">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= (element.props.rating || 5) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-500">({{ element.props.reviews || 128 }} reviews)</span>
                </div>
              </div>
              
              <!-- Price Section -->
              <div class="mb-4">
                <div class="flex items-baseline gap-2 mb-1" :class="{ 'justify-start': element.props.align === 'left', 'justify-center': element.props.align === 'center' || !element.props.align, 'justify-end': element.props.align === 'right' }">
                  <span class="text-3xl font-bold" :style="{ color: element.props.priceColor || '#1f2937' }">{{ element.props.price || '$99.99' }}</span>
                  <span v-if="element.props.oldPrice" class="text-lg line-through" :style="{ color: element.props.oldPriceColor || '#9ca3af' }">{{ element.props.oldPrice }}</span>
                </div>
                <p v-if="element.props.description" class="text-sm text-gray-600 line-clamp-2">{{ element.props.description }}</p>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-3">
                <a :href="element.props.href || '#'" class="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-center no-underline" :style="{ backgroundColor: element.props.buttonBgColor || '#2563eb' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  {{ element.props.buttonText || 'Mua ngay' }}
                </a>
              </div>
            </div>
          </div>

          <div v-else-if="element.type === 'header'">
            <div :style="{ maxWidth: (globalSettings.contentWidth || 700) + 'px', margin: '0 auto' }">
              <!-- Stacked Layout: Logo on top, then company name -->
              <template v-if="element.props.headerLayout === 'stacked'">
                <div class="text-center" :class="{ 'text-left': element.props.logoPosition === 'left', 'text-right': element.props.logoPosition === 'right' }">
                  <img v-if="element.props.logo" :src="element.props.logo" alt="Logo" class="h-12 object-contain mb-2" :class="{ 'mx-auto': element.props.logoPosition !== 'left' && element.props.logoPosition !== 'right' }" />
                  <div v-if="element.props.companyName" class="text-lg font-bold" :style="{ color: element.props.textColor || '#ffffff' }">{{ element.props.companyName }}</div>
                  <div v-if="element.props.tagline" class="text-xs opacity-80 mt-1" :style="{ color: element.props.taglineColor || element.props.textColor || '#ffffff' }">{{ element.props.tagline }}</div>
                </div>
              </template>
              
              <!-- Inline Layout (default): Logo and company name side by side -->
              <template v-else>
                <div class="flex items-center" :class="{ 'justify-start': element.props.logoPosition === 'left', 'justify-center': element.props.logoPosition === 'center' || !element.props.logoPosition, 'justify-end': element.props.logoPosition === 'right' }">
                  <img v-if="element.props.logo" :src="element.props.logo" alt="Logo" class="h-10 object-contain" :class="{ 'mr-3': element.props.companyName || element.props.tagline }" />
                  <div v-if="element.props.companyName || element.props.tagline">
                    <div v-if="element.props.companyName" class="text-lg font-bold" :style="{ color: element.props.textColor || '#ffffff' }">{{ element.props.companyName }}</div>
                    <div v-if="element.props.tagline" class="text-xs opacity-80" :style="{ color: element.props.taglineColor || element.props.textColor || '#ffffff' }">{{ element.props.tagline }}</div>
                  </div>
                </div>
              </template>
              
              <!-- Navigation -->
              <div v-if="element.props.showNav && element.props.navLinks && element.props.navLinks.length > 0" class="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/20" :class="{ 'justify-start': element.props.navAlign === 'left', 'justify-center': element.props.navAlign === 'center' || !element.props.navAlign, 'justify-end': element.props.navAlign === 'right' }">
                <a 
                  v-for="(link, index) in element.props.navLinks" 
                  :key="index"
                  :href="link.url || '#'"
                  class="text-sm hover:opacity-80 transition-opacity"
                  :style="{ color: element.props.linkColor || '#60a5fa' }"
                >
                  {{ link.text }}
                </a>
              </div>
            </div>
          </div>

          <div v-else-if="element.type === 'footer'" class="p-6 bg-gray-800 text-gray-300 text-sm text-center" :style="element.style">
            <div :style="{ maxWidth: (globalSettings.contentWidth || 700) + 'px', margin: '0 auto' }">
              <!-- Company Logo -->
              <div v-if="element.props.logo" class="mb-4">
                <img :src="element.props.logo" alt="Logo" class="h-10 mx-auto object-contain" />
              </div>
              
              <!-- Company Name -->
              <p v-if="element.props.companyName" class="text-white font-semibold mb-2 text-sm">{{ element.props.companyName }}</p>
              
              <!-- Address -->
              <p v-if="element.props.address" class="text-xs mb-2">{{ element.props.address }}</p>
              
              <!-- Contact Info -->
              <div v-if="element.props.phone || element.props.email" class="text-xs mb-4">
                <p v-if="element.props.phone">{{ element.props.phone }}</p>
                <p v-if="element.props.email">{{ element.props.email }}</p>
              </div>
              
              <!-- Social Links -->
              <div v-if="element.props.socials && element.props.socials.length > 0" class="mb-4">
                <div class="flex justify-center gap-2 flex-wrap">
                  <a 
                    v-for="(social, index) in element.props.socials" 
                    :key="index"
                    :href="social.url" 
                    target="_blank"
                    class="hover:opacity-80 transition-opacity inline-block"
                    :style="{
                      backgroundColor: social.logo ? '#ffffff' : getSocialColor(social.platform),
                      padding: element.props.socialIconSize === 'small' ? '6px' : element.props.socialIconSize === 'large' ? '10px' : '8px',
                      borderRadius: element.props.socialIconStyle === 'square' ? '4px' : element.props.socialIconStyle === 'rounded' ? '8px' : '50%'
                    }"
                  >
                    <img 
                      v-if="social.logo"
                      :src="social.logo" 
                      :alt="social.platform"
                      class="object-contain block"
                      :style="{
                        width: element.props.socialIconSize === 'small' ? '16px' : element.props.socialIconSize === 'large' ? '24px' : '20px',
                        height: element.props.socialIconSize === 'small' ? '16px' : element.props.socialIconSize === 'large' ? '24px' : '20px'
                      }"
                    />
                    <span 
                      v-else
                      v-html="getSocialIcon(social.platform, '#ffffff', element.props.socialIconSize === 'small' ? 16 : element.props.socialIconSize === 'large' ? 24 : 20, {'display': 'block'})"
                    ></span>
                  </a>
                </div>
              </div>
              
              <!-- Copyright -->
              <p class="text-xs">{{ element.props.children || '© 2025 Your Company. All rights reserved.' }}</p>
            </div>
          </div>

          

          <!-- E-commerce: Product Grid -->
          <div v-else-if="element.type === 'product-grid'">
            <div class="mb-6 flex items-center gap-3" :class="{ 'justify-center': element.props.align === 'center' || !element.props.align, 'justify-end': element.props.align === 'right', 'justify-start': element.props.align === 'left' }">
              <div v-if="element.props.icon || element.props.iconUrl" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.iconBgColor || '#dbeafe' }">
                <img v-if="element.props.iconUrl" :src="element.props.iconUrl" alt="Icon" :style="{ width: '20px', height: '20px' }" />
                <div v-else :style="{ width: '20px', height: '20px', backgroundColor: element.props.iconColor || '#3b82f6', borderRadius: '4px' }"></div>
              </div>
              <h3 :style="{ color: element.props.titleColor || '#0f172a', fontSize: element.props.fontSize || '20px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.children || 'Sản phẩm nổi bật' }}</h3>
            </div>
            <div class="product-grid-responsive gap-4 items-stretch" :class="getProductGridClass(element.props.columns || 3)">
              <a 
                v-for="(p, i) in (element.props.products || [])" 
                :key="i" 
                :href="p.url || '#'" 
                class="group text-center shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                :style="{
                  backgroundColor: element.props.cardBgColor || '#ffffff',
                  borderRadius: element.props.cardBorderRadius || '12px',
                  border: element.props.imageShape === 'circle' ? 'none' : `${element.props.cardBorderWidth || '1px'} solid ${element.props.cardBorderColor || '#e5e7eb'}`,
                  padding: element.props.imageShape === 'circle' ? (element.props.cardPadding || '0px') : '0'
                }"
              >
                <!-- Image container -->
                <div 
                  class="overflow-hidden" 
                  :style="{ 
                    height: element.props.imageShape === 'circle' ? (element.props.imageHeight || '140px') : (element.props.imageHeight || '140px'),
                    width: element.props.imageShape === 'circle' ? (element.props.imageHeight || '140px') : '100%',
                    borderRadius: element.props.imageShape === 'circle' ? '50%' : (element.props.imageShape === 'rounded' ? '16px' : (element.props.imageBorderRadius || '0px')),
                    margin: element.props.imageShape === 'circle' ? '8px auto' : '0',
                    marginBottom: element.props.imageShape === 'circle' ? '8px' : '0'
                  }"
                >
                  <img 
                    :src="p.image || 'https://placehold.co/150x100'" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    :style="{
                      borderRadius: element.props.imageShape === 'circle' ? '50%' : (element.props.imageShape === 'rounded' ? '16px' : (element.props.imageBorderRadius || '0px'))
                    }"
                  />
                </div>
                <!-- Product info -->
                <div class="flex flex-col flex-1" :style="{ padding: element.props.cardPadding || '12px' }">
                  <!-- Product name -->
                  <p :style="{ fontSize: '14px', fontWeight: '600', color: element.props.productNameColor || '#1f2937', minHeight: '36px', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }" class="mb-2 line-clamp-2 text-left">{{ p.name }}</p>
                  <!-- Price section -->
                  <div class="mt-auto text-left">
                    <span :style="{ fontWeight: 'bold', fontSize: '18px', color: element.props.priceColor || '#2563eb', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ p.price }}</span>
                    <span v-if="p.oldPrice" :style="{ fontSize: '13px', color: element.props.oldPriceColor || '#9ca3af', textDecoration: 'line-through', marginLeft: '8px' }">{{ p.oldPrice }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- E-commerce: Coupon Code - Email-safe layout (no absolute positioning) -->
          <div v-else-if="element.type === 'coupon-code'" class="text-center overflow-hidden" :style="{ backgroundColor: element.props.bgColor || '#fffbeb', padding: '24px'}">
            <div class="inline-flex items-center gap-2 text-white px-6 py-1.5 rounded-full text-sm font-bold mb-4 shadow-md" :style="{ backgroundColor: element.props.iconBgColor || '#f59e0b' }">
              <img v-if="element.props.iconUrl" :src="element.props.iconUrl" class="w-4 h-4" />
              <i v-else class="bi bi-tag-fill" :style="{ color: element.props.iconColor || '#ffffff' }"></i>
              {{ element.props.discount || '20% OFF' }}
            </div>
            <div class="bg-white border-2 rounded-xl p-5 mb-4 shadow-inner" :style="{ borderColor: element.props.borderColor || '#f59e0b' }">
              <code class="font-black tracking-[0.3em] select-all" :style="{ color: element.props.codeColor || '#d97706', fontSize: element.props.fontSize || '28px' }">{{ element.props.children || 'SAVE20' }}</code>
            </div>
            <p class="text-gray-600 text-sm">{{ element.props.description || 'Use this code at checkout' }}</p>
            <p v-if="element.props.expiryDate" class="text-xs text-gray-400 mt-2"> Hạn sử dụng: {{ element.props.expiryDate }}</p>
          </div>

          <!-- E-commerce: Cart Reminder -->
          <div v-else-if="element.type === 'cart-reminder'" :style="{ backgroundColor: element.props.bgColor || '#fff7ed', padding: '24px', borderRadius: element.style?.borderRadius || '12px' }">
            <div :style="{ display: 'flex', alignItems: 'flex-start', gap: '16px' }">
              <div :style="{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: element.props.iconBgColor || '#fed7aa' }">
                <img v-if="element.props.iconUrl" :src="element.props.iconUrl" alt="Icon" :style="{ width: '24px', height: '24px' }" />
                <div v-else :style="{ width: '24px', height: '24px', backgroundColor: element.props.iconColor || '#f97316', borderRadius: '4px' }"></div>
              </div>
              <div :style="{ flex: 1, textAlign: element.props.align || 'left' }">
                <h4 :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '20px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: 'arial,helvetica,sans-serif', marginBottom: '4px' }">{{ element.props.children || 'Bạn còn sản phẩm trong giỏ hàng!' }}</h4>
                <p :style="{ color: '#4b5563', fontSize: '14px', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.subtitle || 'Hoàn tất đơn hàng ngay để không bỏ lỡ ưu đãi' }}</p>
              </div>
            </div>
            <button class="mt-5 w-full px-6 py-3 shadow-md hover:shadow-lg transition-all" :style="{ backgroundColor: element.props.buttonBgColor || '#f97316', color: element.props.buttonTextColor || '#fff', borderRadius: element.props.buttonRadius || '12px', fontWeight: '600', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">
              {{ element.props.buttonText || 'Xem giỏ hàng →' }}
            </button>
          </div>

          <!-- E-commerce: Order Summary -->
          <div v-else-if="element.type === 'order-summary'">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px', justifyContent: element.props.align === 'center' ? 'center' : element.props.align === 'right' ? 'flex-end' : 'flex-start' }">
              <div :style="{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: element.props.iconBgColor || '#dbeafe' }">
                <img v-if="element.props.iconUrl" :src="element.props.iconUrl" alt="Icon" :style="{ width: '20px', height: '20px' }" />
                <div v-else :style="{ width: '20px', height: '20px', backgroundColor: element.props.iconColor || '#3b82f6', borderRadius: '4px' }"></div>
              </div>
              <h4 :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '18px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.children || 'Đơn hàng' }}</h4>
            </div>
            <div class="space-y-3 mb-4">
              <div v-for="(item, i) in (element.props.items || [])" :key="i" class="flex justify-between items-center py-2 border-b border-dashed border-gray-200 last:border-0">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center" :style="{ fontSize: '12px', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ item.quantity }}</span>
                  <span :style="{ fontSize: '14px', color: '#374151', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ item.name }}</span>
                </div>
                <span :style="{ fontWeight: '600', color: '#111827', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ item.price }}</span>
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2">
              <div class="flex justify-between pt-1" :style="{ fontSize: '14px', color: '#4b5563', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">
                <span>Tạm tính</span>
                <span>{{ element.props.subtotal || '$0' }}</span>
              </div>
              <div class="flex justify-between" :style="{ fontSize: '14px', color: '#4b5563', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">
                <span>Phí vận chuyển</span>
                <span>{{ element.props.shipping || '$0' }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200" :style="{ fontWeight: 'bold', fontSize: '18px', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">
                <span>Tổng cộng</span>
                <span :style="{ color: element.props.totalColor || '#2563eb' }">{{ element.props.total || '$0' }}</span>
              </div>
            </div>
          </div>

          <!-- Real Estate: Property Card - No overlay -->
          <div v-else-if="element.type === 'property-card'" class="overflow-hidden" :style="{ borderRadius: element.props.imageShape === 'rounded' ? '16px' : '0' }">
            <!-- Image -->
            <img 
              :src="element.props.image || 'https://placehold.co/400x280'" 
              class="w-full object-cover" 
              :style="{ height: element.props.imageHeight || '200px', borderRadius: element.props.imageShape === 'rounded' ? '16px 16px 0 0' : '0' }"
            />
            <!-- Price Bar (below image) -->
            <div class="px-4 py-3 flex items-center justify-between" style="background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);">
              <span class="text-xl font-bold text-white">{{ element.props.price || '0' }}</span>
              <!-- Badges in price bar -->
              <div v-if="element.props.discount || element.props.badge" class="flex items-center gap-1.5">
                <span v-if="element.props.discount" class="px-2 py-1 text-xs font-bold text-white rounded shadow-md" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">-{{ element.props.discount }}%</span>
                <span v-if="element.props.badge" class="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded uppercase shadow-md">{{ element.props.badge }}</span>
              </div>
            </div>
            <!-- Content -->
            <div class="p-5">
              <h3 class="mb-3 leading-tight" :class="{ 'text-left': !element.props.align || element.props.align === 'left', 'text-center': element.props.align === 'center', 'text-right': element.props.align === 'right' }" :style="{ color: element.props.titleColor || '#1a1a2e', fontSize: element.props.fontSize || '22px', fontWeight: element.props.fontWeight || '700', fontStyle: element.props.fontStyle || 'normal' }">{{ element.props.children || 'Căn hộ cao cấp' }}</h3>
              <!-- Location -->
              <p class="text-gray-500 text-sm mb-4 flex items-center gap-2">
                <span class="w-5 h-5 flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.locationIconBgColor || '#fee2e2', borderRadius: '50%' }">
                  <img v-if="element.props.locationIconUrl" :src="element.props.locationIconUrl" class="w-3 h-3" />
                  <i v-else class="bi bi-geo-alt-fill text-red-500 text-xs"></i>
                </span>
                <span>{{ element.props.location || 'Vị trí đắc địa' }}</span>
              </p>
              <!-- Property Specs -->
              <div class="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2 text-gray-600">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.areaIconBgColor || '#fef3c7' }">
                    <span v-html="getInlineSvgIcon(element.props.areaIconUrl, 'arrows-angle-expand', '#d97706', 16)"></span>
                  </div>
                  <span class="text-xs sm:text-sm font-medium whitespace-nowrap">{{ element.props.area || '120m²' }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.bedroomsIconBgColor || '#e0e7ff' }">
                    <span v-html="getInlineSvgIcon(element.props.bedroomsIconUrl, 'door-open', '#4f46e5', 16)"></span>
                  </div>
                  <span class="text-xs sm:text-sm font-medium whitespace-nowrap">{{ element.props.bedrooms || 3 }} PN</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.bathroomsIconBgColor || '#cffafe' }">
                    <span v-html="getInlineSvgIcon(element.props.bathroomsIconUrl, 'droplet', '#0891b2', 16)"></span>
                  </div>
                  <span class="text-xs sm:text-sm font-medium whitespace-nowrap">{{ element.props.bathrooms || 2 }} VS</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Estate: Property Features -->
          <div v-else-if="element.type === 'property-features'" :style="{ backgroundColor: element.props.bgColor || '#ffffff', padding: '16px', borderRadius: element.style?.borderRadius || '16px' }">
            <h4 class="mb-5" :class="{ 'text-left': !element.props.align || element.props.align === 'left', 'text-center': element.props.align === 'center', 'text-right': element.props.align === 'right' }" :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '18px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.children || 'Tiện ích' }}</h4>
            <div :class="element.props.layout === 'grid' ? 'grid gap-3 items-stretch' : 'space-y-3'" :style="element.props.layout === 'grid' ? { gridTemplateColumns: `repeat(${element.props.columns || 2}, 1fr)` } : {}">
              <div v-for="(f, i) in (element.props.features || [])" :key="i" class="flex items-center gap-3 p-3 rounded-xl h-full" :style="{ fontSize: '14px', backgroundColor: element.props.itemBgColor || '#f9fafb' }">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.iconBgColor || '#dcfce7' }">
                  <span v-html="getInlineSvgIcon(element.props.iconUrl || element.props.icon, 'check-lg', element.props.iconColor || '#22c55e', 16)"></span>
                </div>
                <span :style="{ color: element.props.textColor || '#374151', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ f }}</span>
              </div>
            </div>
          </div>

          <!-- Real Estate: Location Map -->
          <div v-else-if="element.type === 'location-map'">
            <div class="flex items-center gap-3 mb-4" :class="{ 'justify-start': !element.props.align || element.props.align === 'left', 'justify-center': element.props.align === 'center', 'justify-end': element.props.align === 'right' }">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.iconBgColor || '#fee2e2' }">
                <span v-html="getInlineSvgIcon(element.props.iconUrl || element.props.icon, 'geo-alt-fill', element.props.iconColor || '#ef4444', 20)"></span>
              </div>
              <div :class="{ 'text-left': !element.props.align || element.props.align === 'left', 'text-center': element.props.align === 'center', 'text-right': element.props.align === 'right' }">
                <h4 :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '18px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.children || 'Vị trí' }}</h4>
                <p :style="{ color: element.props.textColor || '#6b7280', fontFamily: element.props.fontFamily || 'Arial, sans-serif', fontSize: '14px' }">{{ element.props.address || 'Address' }}</p>
              </div>
            </div>
            <div class="overflow-hidden rounded-xl">
              <img :src="element.props.mapImage || 'https://placehold.co/600x300?text=Map'" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          <!-- Recruitment: Job Listing -->
          <div v-else-if="element.type === 'job-listing'">
            <!-- Header: Icon + Title -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.iconBgColor || element.props.buttonBgColor || '#2563eb' }">
                <span v-html="getInlineSvgIcon(element.props.iconUrl, 'briefcase-fill', '#ffffff', 24)"></span>
              </div>
              <div class="flex-1 min-w-0 text-left">
                <h3 class="mb-0.5 text-left" :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '18px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.children || 'Vị trí tuyển dụng' }}</h3>
                <p :style="{ color: element.props.companyColor || '#2563eb', fontFamily: element.props.fontFamily || 'Arial, sans-serif', fontSize: '14px', fontWeight: '600', textAlign: 'left' }">{{ element.props.company || 'Tên công ty' }}</p>
              </div>
            </div>
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" :style="{ fontSize: '12px', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.location || 'Địa điểm' }}</span>
              <span class="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" :style="{ fontSize: '12px', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.type || 'Full-time' }}</span>
              <span class="bg-green-100 text-green-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full" :style="{ fontSize: '12px', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.salary || 'Thương lượng' }}</span>
            </div>
            <!-- Apply Button -->
            <span 
               class="block w-full text-center py-3 rounded-lg cursor-pointer" 
               :style="{ 
                 backgroundColor: element.props.buttonBgColor || '#2563eb', 
                 color: element.props.buttonTextColor || '#ffffff',
                 fontWeight: '600',
                 fontFamily: element.props.fontFamily || 'Arial, sans-serif'
               }">
              {{ element.props.buttonText || 'Ứng tuyển ngay' }} →
            </span>
            <p v-if="element.props.deadline" class="text-center text-xs text-gray-400 mt-3">Hạn nộp: {{ element.props.deadline }}</p>
          </div>

          <!-- Recruitment: Benefits List -->
          <div v-else-if="element.type === 'benefits-list'">
            <h4 class="mb-5" :class="{ 'text-left': !element.props.align || element.props.align === 'left', 'text-center': element.props.align === 'center', 'text-right': element.props.align === 'right' }" :style="{ color: element.props.titleColor || '#1f2937', fontSize: element.props.fontSize || '18px', fontWeight: element.props.fontWeight || 'bold', fontStyle: element.props.fontStyle || 'normal', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ element.props.children || 'Phúc lợi' }}</h4>
            <div :class="element.props.layout === 'grid' ? 'grid gap-3 items-stretch' : 'space-y-3'" :style="element.props.layout === 'grid' ? { gridTemplateColumns: `repeat(${element.props.columns || 1}, 1fr)` } : {}">
              <div v-for="(b, i) in (element.props.benefits || [])" :key="i" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl h-full">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: element.props.iconBgColor || '#dcfce7' }">
                  <span v-html="getInlineSvgIcon(element.props.iconUrl || element.props.icon, 'check-lg', element.props.iconColor || '#22c55e', 16)"></span>
                </div>
                <span :style="{ color: element.props.textColor || '#374151', fontWeight: '500', fontFamily: element.props.fontFamily || 'Arial, sans-serif' }">{{ b }}</span>
              </div>
            </div>
          </div>

          <!-- Banking: Transaction Card -->
          <div v-else-if="element.type === 'transaction-card'" :style="{ backgroundColor: element.props.bgColor || '#f0fdf4', borderRadius: element.style?.borderRadius || '12px', padding: '20px' }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }">
              <div :style="{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: element.props.iconBgColor || '#dcfce7' }">
                <img v-if="element.props.iconUrl" :src="element.props.iconUrl" alt="Icon" :style="{ width: '20px', height: '20px' }" />
                <div v-else :style="{ width: '20px', height: '20px', backgroundColor: element.props.iconColor || '#22c55e', borderRadius: '4px' }"></div>
              </div>
              <div :style="{ flex: 1, textAlign: element.props.align || 'left' }">
                <h4 :style="{ 
                  color: element.props.titleColor || '#15803d', 
                  fontSize: element.props.titleFontSize || '16px', 
                  fontWeight: element.props.titleFontWeight || 'bold', 
                  fontStyle: element.props.titleFontStyle || 'normal',
                  fontFamily: element.props.titleFontFamily || 'Arial, sans-serif', 
                  margin: '0 0 4px 0',
                  textAlign: element.props.titleAlign || 'left'
                }">{{ element.props.children || 'Giao dịch thành công' }}</h4>
                <p :style="{ 
                  fontSize: element.props.dateFontSize || '12px', 
                  color: element.props.dateColor || '#6b7280', 
                  fontWeight: element.props.dateFontWeight || 'normal',
                  fontFamily: element.props.dateFontFamily || 'Arial, sans-serif',
                  margin: 0,
                  textAlign: element.props.dateAlign || 'left'
                }">{{ element.props.date || '31/12/2025 14:30' }}</p>
              </div>
              <span :style="{ 
                padding: '4px 12px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                borderRadius: '20px',
                backgroundColor: element.props.status === 'success' ? '#dcfce7' : element.props.status === 'pending' ? '#fef3c7' : '#fee2e2',
                color: element.props.status === 'success' ? '#166534' : element.props.status === 'pending' ? '#92400e' : '#991b1b'
              }">
                {{ element.props.status === 'success' ? 'Thành công' : element.props.status === 'pending' ? 'Đang xử lý' : 'Thất bại' }}
              </span>
            </div>
            <div :style="{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }">
              <p :style="{ fontSize: '18px', fontWeight: 'bold', color: element.props.amountColor || '#16a34a', margin: 0, fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.amount || '5,000,000đ' }}</p>
            </div>
            <div :style="{ marginTop: '16px' }">
              <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }">
                <span :style="{ fontSize: '14px', color: element.props.labelColor || '#6b7280', fontFamily: 'arial,helvetica,sans-serif' }">Mã GD:</span>
                <span :style="{ fontSize: '14px', fontWeight: 500, color: element.props.detailsColor || '#374151', fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.transactionId || 'TXN123456789' }}</span>
              </div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }">
                <span :style="{ fontSize: '14px', color: element.props.labelColor || '#6b7280', fontFamily: 'arial,helvetica,sans-serif' }">Từ TK:</span>
                <span :style="{ fontSize: '14px', fontWeight: 500, color: element.props.detailsColor || '#374151', fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.fromAccount || '**** 1234' }}</span>
              </div>
              <div :style="{ display: 'flex', justifyContent: 'space-between' }">
                <span :style="{ fontSize: '14px', color: element.props.labelColor || '#6b7280', fontFamily: 'arial,helvetica,sans-serif' }">Đến:</span>
                <span :style="{ fontSize: '14px', fontWeight: 500, color: element.props.detailsColor || '#374151', fontFamily: 'arial,helvetica,sans-serif' }">{{ element.props.toName || 'Nguyễn Văn A' }} ({{ element.props.toAccount || '**** 5678' }})</span>
              </div>
            </div>
          </div>

         

          <!-- Banking: Credit Card Info -->
          <div v-else-if="element.type === 'credit-card-info'" :style="{ backgroundColor: element.props.bgColor || '#1e3a8a', borderRadius: element.style?.borderRadius || '16px', padding: '20px', color: '#ffffff' }">
            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }">
              <span :style="{ 
                fontSize: element.props.titleFontSize || '14px', 
                fontWeight: element.props.titleFontWeight || 'normal',
                fontStyle: element.props.titleFontStyle || 'normal',
                fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                color: element.props.titleColor || '#ffffff',
                opacity: 0.8,
                textAlign: element.props.titleAlign || 'left'
              }">{{ element.props.children || 'Thẻ tín dụng' }}</span>
              <span :style="{ 
                fontSize: element.props.cardTypeFontSize || '18px', 
                fontWeight: element.props.cardTypeFontWeight || 'bold', 
                fontStyle: element.props.cardTypeFontStyle || 'normal',
                fontFamily: element.props.cardTypeFontFamily || 'Arial, sans-serif',
                color: element.props.cardTypeColor || '#ffffff',
                textTransform: 'uppercase',
                textAlign: element.props.cardTypeAlign || 'right'
              }">{{ element.props.cardType || 'VISA' }}</span>
            </div>
            <p :style="{ 
              fontSize: element.props.cardNumberFontSize || '20px', 
              letterSpacing: element.props.cardNumberLetterSpacing || '2px', 
              fontFamily: element.props.cardNumberFontFamily || 'monospace',
              fontWeight: element.props.cardNumberFontWeight || 'normal',
              fontStyle: element.props.cardNumberFontStyle || 'normal',
              color: element.props.cardNumberColor || '#ffffff',
              margin: '0 0 16px 0',
              textAlign: element.props.cardNumberAlign || 'center'
            }">{{ element.props.cardNumber || '**** **** **** 9876' }}</p>
            <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: element.props.detailsFontSize || '14px' }">
              <div>
                <span :style="{ 
                  opacity: 0.6, 
                  fontSize: element.props.labelFontSize || '10px', 
                  display: 'block',
                  fontFamily: element.props.labelFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.labelFontWeight || 'normal',
                  fontStyle: element.props.labelFontStyle || 'normal',
                  color: element.props.labelColor || '#ffffff',
                  textAlign: element.props.labelAlign || 'left'
                }">CHỦ THẺ</span>
                <p :style="{ 
                  margin: '4px 0 0 0', 
                  fontWeight: element.props.cardHolderFontWeight || 500,
                  fontStyle: element.props.cardHolderFontStyle || 'normal',
                  fontFamily: element.props.cardHolderFontFamily || 'Arial, sans-serif',
                  fontSize: element.props.cardHolderFontSize || '14px',
                  color: element.props.cardHolderColor || '#ffffff',
                  textAlign: element.props.cardHolderAlign || 'left'
                }">{{ element.props.cardHolder || 'NGUYEN VAN A' }}</p>
              </div>
              <div :style="{ textAlign: element.props.expiryAlign || 'right' }">
                <span :style="{ 
                  opacity: 0.6, 
                  fontSize: element.props.labelFontSize || '10px', 
                  display: 'block',
                  fontFamily: element.props.labelFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.labelFontWeight || 'normal',
                  fontStyle: element.props.labelFontStyle || 'normal',
                  color: element.props.labelColor || '#ffffff',
                  textAlign: element.props.expiryAlign || 'right'
                }">HẾT HẠN</span>
                <p :style="{ 
                  margin: '4px 0 0 0', 
                  fontWeight: element.props.expiryFontWeight || 500,
                  fontStyle: element.props.expiryFontStyle || 'normal',
                  fontFamily: element.props.expiryFontFamily || 'Arial, sans-serif',
                  fontSize: element.props.expiryFontSize || '14px',
                  color: element.props.expiryColor || '#ffffff',
                  textAlign: element.props.expiryAlign || 'right'
                }">{{ element.props.expiryDate || '12/28' }}</p>
              </div>
            </div>
            <div v-if="element.props.showUsage" :style="{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '16px', paddingTop: '16px' }">
              <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: element.props.usageFontSize || '14px', marginBottom: '8px' }">
                <span :style="{ 
                  opacity: 0.7,
                  fontFamily: element.props.usageLabelFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.usageLabelFontWeight || 'normal',
                  fontStyle: element.props.usageLabelFontStyle || 'normal',
                  fontSize: element.props.usageLabelFontSize || '14px',
                  color: element.props.usageLabelColor || '#ffffff'
                }">Hạn mức:</span>
                <span :style="{ 
                  fontFamily: element.props.usageValueFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.usageValueFontWeight || 'normal',
                  fontStyle: element.props.usageValueFontStyle || 'normal',
                  fontSize: element.props.usageValueFontSize || '14px',
                  color: element.props.usageValueColor || '#ffffff'
                }">{{ element.props.creditLimit || '100,000,000đ' }}</span>
              </div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: element.props.usageFontSize || '14px' }">
                <span :style="{ 
                  opacity: 0.7,
                  fontFamily: element.props.usageLabelFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.usageLabelFontWeight || 'normal',
                  fontStyle: element.props.usageLabelFontStyle || 'normal',
                  fontSize: element.props.usageLabelFontSize || '14px',
                  color: element.props.usageLabelColor || '#ffffff'
                }">Đã dùng:</span>
                <span :style="{ 
                  fontFamily: element.props.usageValueFontFamily || 'Arial, sans-serif',
                  fontWeight: element.props.usageValueFontWeight || 'normal',
                  fontStyle: element.props.usageValueFontStyle || 'normal',
                  fontSize: element.props.usageValueFontSize || '14px',
                  color: element.props.usageValueColor || '#ffffff'
                }">{{ element.props.usedAmount || '35,000,000đ' }}</span>
              </div>
            </div>
          </div>

          <!-- Gaming: Course Card -->
          <div v-else-if="element.type === 'course-card'" :style="{ backgroundColor: element.props.bgColor || '#ffffff', borderRadius: element.style?.borderRadius || '12px', border: `1px solid ${element.props.borderColor || '#e5e7eb'}`, overflow: 'hidden' }">
            <img v-if="element.props.thumbnail" :src="element.props.thumbnail" alt="Course" :style="{ width: '100%', height: '160px', objectFit: 'cover' }" />
            <div :style="{ padding: '16px' }">
              <h4 :style="{ 
                color: element.props.titleColor || '#1f2937', 
                fontSize: element.props.titleFontSize || '18px', 
                fontWeight: element.props.titleFontWeight || 'bold',
                fontStyle: element.props.titleFontStyle || 'normal',
                fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                textAlign: element.props.titleAlign || 'left',
                margin: '0 0 12px 0' 
              }">{{ element.props.children || 'Khóa học Python' }}</h4>
              
              <!-- Instructor with avatar -->
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }">
                <img v-if="element.props.instructorAvatar" :src="element.props.instructorAvatar" alt="Instructor" :style="{ width: '32px', height: '32px', borderRadius: '50%' }" />
                <img v-else :src="generateAvatarFromName(element.props.instructor || 'Giảng viên')" alt="Instructor" :style="{ width: '32px', height: '32px', borderRadius: '50%' }" />
                <span :style="{ 
                  color: element.props.detailsColor || '#6b7280', 
                  fontSize: element.props.detailsFontSize || '14px',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">{{ element.props.instructor || 'Giảng viên' }}</span>
              </div>
              
              <!-- Stats: Duration + Lessons + Students -->
              <div :style="{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '12px', 
                fontSize: element.props.detailsFontSize || '14px', 
                color: element.props.detailsColor || '#6b7280',
                fontWeight: element.props.detailsFontWeight || 'normal',
                fontStyle: element.props.detailsFontStyle || 'normal',
                fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                textAlign: element.props.detailsAlign || 'left'
              }">
                <span><img :src="element.props.durationIconUrl || 'https://img.icons8.com/ios/100/alarm-clock--v1.png'" :style="{ width: '16px', height: '16px', marginRight: '4px', verticalAlign: 'middle' }" /> {{ element.props.duration || '20 giờ' }}</span>
                <span><img :src="element.props.lessonsIconUrl || 'https://img.icons8.com/carbon-copy/100/book.png'" :style="{ width: '16px', height: '16px', marginRight: '4px', verticalAlign: 'middle' }" /> {{ element.props.lessons || 45 }} bài</span>
              </div>
              
              <!-- Rating (optional) -->
              <div v-if="element.props.showRating" :style="{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }">
                <span v-for="s in 5" :key="s" :style="{ 
                  fontSize: '14px', 
                  color: s <= Math.floor(element.props.rating || 4.8) ? (element.props.starColor || '#fbbf24') : '#e5e7eb' 
                }"><img :src="element.props.starIconUrl || 'https://img.icons8.com/emoji/48/star-emoji.png'" :style="{ width: '14px', height: '14px', verticalAlign: 'middle' }" /></span>
                <span :style="{ 
                  color: element.props.detailsColor || '#6b7280', 
                  fontSize: element.props.detailsFontSize || '14px',
                  marginLeft: '4px' 
                }">{{ element.props.rating || 4.8 }}</span>
              </div>
              
              <!-- Price -->
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
                <span :style="{ 
                  fontSize: element.props.priceFontSize || '20px', 
                  fontWeight: element.props.priceFontWeight || 'bold',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'left',
                  color: element.props.priceColor || '#dc2626' 
                }">{{ element.props.price || '799,000đ' }}</span>
                <span v-if="element.props.originalPrice" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px', 
                  color: '#9ca3af', 
                  textDecoration: 'line-through' 
                }">{{ element.props.originalPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Gaming: Game Item Card -->
          <div v-else-if="element.type === 'game-item-card'" class="p-4 text-center" :style="{ backgroundColor: element.props.bgColor || '#fffbeb', borderRadius: element.style?.borderRadius || '12px', border: `2px solid ${element.props.borderColor || '#f59e0b'}` }">
            <span class="inline-block px-2 py-0.5 text-xs font-bold rounded mb-2" :class="{ 'bg-gray-200 text-gray-700': element.props.rarity === 'common', 'bg-green-200 text-green-700': element.props.rarity === 'uncommon', 'bg-blue-200 text-blue-700': element.props.rarity === 'rare', 'bg-purple-200 text-purple-700': element.props.rarity === 'epic', 'bg-yellow-200 text-yellow-700': element.props.rarity === 'legendary' }">
              {{ element.props.rarity === 'legendary' ? 'Huyền thoại' : element.props.rarity === 'epic' ? 'Sử thi' : element.props.rarity === 'rare' ? 'Hiếm' : 'Thường' }}
            </span>
            <img :src="element.props.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=Item'" class="w-24 h-24 mx-auto mb-3 rounded-lg shadow-lg" />
            <h4 :style="{ 
              color: element.props.titleColor || '#78350f', 
              fontSize: element.props.titleFontSize || '16px', 
              fontWeight: element.props.titleFontWeight || 'bold',
              fontStyle: element.props.titleFontStyle || 'normal',
              fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
              textAlign: element.props.titleAlign || 'center'
            }">{{ element.props.children || 'Kiếm Huyền Thoại' }}</h4>
            <p class="text-sm mt-2 opacity-80" :style="{ 
              color: element.props.descriptionColor || '#92400e',
              fontSize: element.props.descriptionFontSize || '14px',
              fontWeight: element.props.descriptionFontWeight || 'normal',
              fontStyle: element.props.descriptionFontStyle || 'normal',
              fontFamily: element.props.descriptionFontFamily || 'Arial, sans-serif',
              textAlign: element.props.descriptionAlign || 'center'
            }">{{ element.props.description || 'Thanh kiếm cổ đại' }}</p>
            <div v-if="element.props.stats" class="mt-3 space-y-1 text-xs">
              <div v-for="stat in element.props.stats" :key="stat.name" class="flex justify-between px-4"><span>{{ stat.name }}</span><span class="font-bold">{{ stat.value }}</span></div>
            </div>
            <p class="mt-3 font-bold" :style="{ 
              color: element.props.priceColor || '#78350f',
              fontSize: element.props.priceFontSize || '14px',
              fontWeight: element.props.priceFontWeight || 'bold',
              fontStyle: element.props.priceFontStyle || 'normal',
              fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
              textAlign: element.props.priceAlign || 'center'
            }">{{ element.props.price || '50,000 Gems' }}</p>
          </div>

          <!-- Gaming: Achievement Badge -->
          <div v-else-if="element.type === 'achievement-badge'" :style="{ backgroundColor: element.props.bgColor || '#fffbeb', borderRadius: element.style?.borderRadius || '12px', border: `2px solid ${element.props.borderColor || '#f59e0b'}`, padding: '20px', textAlign: 'center' }">
            <div :style="{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', backgroundColor: element.props.iconBgColor || '#fde68a' }">
              <img v-if="element.props.iconUrl" :src="element.props.iconUrl" alt="Icon" :style="{ width: '28px', height: '28px' }" />
              <div v-else :style="{ width: '28px', height: '28px', backgroundColor: element.props.iconColor || '#f59e0b', borderRadius: '4px' }"></div>
            </div>
            <h4 :style="{ 
              color: element.props.titleColor || '#78350f', 
              fontSize: element.props.titleFontSize || '18px', 
              fontWeight: element.props.titleFontWeight || 'bold',
              fontStyle: element.props.titleFontStyle || 'normal',
              fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
              textAlign: element.props.titleAlign || 'center',
              margin: '0 0 4px 0' 
            }">{{ element.props.children || 'Master Developer' }}</h4>
            <p :style="{ 
              fontSize: element.props.descriptionFontSize || '14px', 
              color: element.props.descriptionColor || '#92400e',
              fontWeight: element.props.descriptionFontWeight || 'normal',
              fontStyle: element.props.descriptionFontStyle || 'normal',
              fontFamily: element.props.descriptionFontFamily || 'Arial, sans-serif',
              textAlign: element.props.descriptionAlign || 'center',
              margin: '0 0 12px 0' 
            }">{{ element.props.description || 'Hoàn thành 100 bài tập' }}</p>
            <div v-if="element.props.showPoints" :style="{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: element.props.borderColor || '#f59e0b', 
              color: '#ffffff', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }">
              <span :style="{ fontSize: '12px' }">⭐</span> {{ element.props.points || 500 }} điểm
            </div>
            <p :style="{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 0 0' }">{{ element.props.earnedDate || '31/12/2025' }}</p>
          </div>

          <!-- Gaming: Progress Bar -->
          <div v-else-if="element.type === 'progress-bar'" :style="{ padding: '16px' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }">
              <span :style="{ 
                fontSize: element.props.titleFontSize || '14px', 
                fontWeight: element.props.titleFontWeight || '500',
                fontStyle: element.props.titleFontStyle || 'normal',
                fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                textAlign: element.props.titleAlign || 'left',
                color: element.props.titleColor || '#1f2937' 
              }">{{ element.props.label || 'Hoàn thành khóa học' }}</span>
              <span v-if="element.props.showPercentage" :style="{ 
                fontSize: element.props.labelFontSize || '14px', 
                fontWeight: element.props.labelFontWeight || '700',
                fontStyle: element.props.labelFontStyle || 'normal',
                fontFamily: element.props.labelFontFamily || 'Arial, sans-serif',
                textAlign: element.props.labelAlign || 'left',
                color: element.props.barColor || '#3b82f6' 
              }">{{ Math.round((element.props.currentValue || 75) / (element.props.maxValue || 100) * 100) }}%</span>
            </div>
            <div :style="{ 
              width: '100%', 
              borderRadius: '9999px', 
              overflow: 'hidden', 
              backgroundColor: element.props.trackColor || '#e5e7eb', 
              height: element.props.height || '12px' 
            }">
              <div :style="{ 
                height: '100%', 
                borderRadius: '9999px', 
                backgroundColor: element.props.barColor || '#3b82f6', 
                width: ((element.props.currentValue || 75) / (element.props.maxValue || 100) * 100) + '%' 
              }"></div>
            </div>
            <p v-if="element.props.sublabel" :style="{ 
              fontSize: element.props.labelFontSize || '12px', 
              color: element.props.labelColor || '#6b7280', 
              margin: '8px 0 0 0',
              fontWeight: element.props.labelFontWeight || 'normal',
              fontStyle: element.props.labelFontStyle || 'normal',
              fontFamily: element.props.labelFontFamily || 'Arial, sans-serif',
              textAlign: element.props.labelAlign || 'left'
            }">{{ element.props.sublabel }}</p>
          </div>

          <!-- F&B: Menu Item -->
          <div v-else-if="element.type === 'menu-item'" :style="{ backgroundColor: element.props.bgColor || '#ffffff', borderRadius: element.style?.borderRadius || '12px', border: `1px solid ${element.props.borderColor || '#e5e7eb'}`, overflow: 'hidden', display: 'flex' }">
            <img v-if="element.props.image" :src="element.props.image" alt="Food" :style="{ width: '128px', height: '128px', objectFit: 'cover', flexShrink: 0 }" />
            <img v-else src="https://placehold.co/150x150/e2e8f0/64748b?text=Food" alt="Food" :style="{ width: '128px', height: '128px', objectFit: 'cover', flexShrink: 0 }" />
            <div :style="{ padding: '16px', flex: 1 }">
              <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }">
                <h4 :style="{ 
                  color: element.props.titleColor || '#1f2937', 
                  fontSize: element.props.titleFontSize || '16px', 
                  fontWeight: element.props.titleFontWeight || 'bold',
                  fontStyle: element.props.titleFontStyle || 'normal',
                  fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.titleAlign || 'left',
                  margin: 0 
                }">{{ element.props.children || 'Phở Bò Đặc Biệt' }}</h4>
                <span :style="{ 
                  fontWeight: element.props.priceFontWeight || 'bold',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'right',
                  color: element.props.priceColor || '#dc2626', 
                  fontSize: element.props.priceFontSize || '16px' 
                }">{{ element.props.price || '85,000đ' }}</span>
              </div>
              <p :style="{ 
                fontSize: element.props.descriptionFontSize || '14px', 
                color: element.props.descriptionColor || '#6b7280', 
                margin: '4px 0 0 0', 
                lineHeight: '1.4',
                fontWeight: element.props.descriptionFontWeight || 'normal',
                fontStyle: element.props.descriptionFontStyle || 'normal',
                fontFamily: element.props.descriptionFontFamily || 'Arial, sans-serif',
                textAlign: element.props.descriptionAlign || 'left'
              }">{{ element.props.description || 'Phở bò truyền thống' }}</p>
              <div v-if="element.props.showTags && element.props.tags" :style="{ display: 'flex', gap: '4px', marginTop: '8px' }">
                <span v-for="tag in element.props.tags" :key="tag" :style="{ padding: '2px 8px', fontSize: '12px', backgroundColor: '#fed7aa', color: '#ea580c', borderRadius: '4px', fontWeight: 500 }">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Hotel: Room Card -->
          <div v-else-if="element.type === 'room-card'" class="overflow-hidden" :style="{ backgroundColor: element.props.bgColor || '#ffffff', borderRadius: element.style?.borderRadius || '16px', border: `1px solid ${element.props.borderColor || '#e5e7eb'}` }">
            <img :src="element.props.image || 'https://placehold.co/400x200/e2e8f0/64748b?text=Room'" class="w-full h-48 object-cover" />
            <div class="p-5">
              <h4 :style="{ 
                color: element.props.titleColor || '#1f2937', 
                fontSize: element.props.titleFontSize || '20px', 
                fontWeight: element.props.titleFontWeight || 'bold',
                fontStyle: element.props.titleFontStyle || 'normal',
                fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                textAlign: element.props.titleAlign || 'left'
              }" class="mb-2">{{ element.props.children || 'Phòng Deluxe Ocean View' }}</h4>
              <p class="text-sm text-gray-500 mb-3" :style="{ 
                fontSize: element.props.descriptionFontSize || '14px',
                color: element.props.descriptionColor || '#6b7280',
                fontWeight: element.props.descriptionFontWeight || 'normal',
                fontStyle: element.props.descriptionFontStyle || 'normal',
                fontFamily: element.props.descriptionFontFamily || 'Arial, sans-serif',
                textAlign: element.props.descriptionAlign || 'left'
              }">{{ element.props.description || 'Phòng rộng rãi với view biển' }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 text-xs bg-gray-100 rounded" :style="{ 
                  fontSize: element.props.detailsFontSize || '12px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }"><i class="bi bi-rulers mr-1"></i>{{ element.props.roomSize || '45m²' }}</span>
                <span class="px-2 py-1 text-xs bg-gray-100 rounded" :style="{ 
                  fontSize: element.props.detailsFontSize || '12px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }"><i class="bi bi-people mr-1"></i>{{ element.props.maxGuests || 2 }} khách</span>
              </div>
              <div v-if="element.props.showRating" class="flex items-center gap-1 mb-3">
                <i v-for="s in 5" :key="s" class="bi bi-star-fill text-sm" :style="{ color: s <= Math.floor(element.props.rating || 4.9) ? (element.props.starColor || '#fbbf24') : '#e5e7eb' }"></i>
                <span class="text-sm text-gray-500 ml-1">({{ element.props.reviews || 234 }} đánh giá)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xl font-bold" :style="{ 
                  color: element.props.priceColor || '#059669',
                  fontSize: element.props.priceFontSize || '20px',
                  fontWeight: element.props.priceFontWeight || 'bold',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'right'
                }">{{ element.props.pricePerNight || '2,500,000đ' }}</span>
                <span class="text-sm text-gray-400">/đêm</span>
                <span v-if="element.props.originalPrice" class="text-sm text-gray-400 line-through ml-2">{{ element.props.originalPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Hotel: Booking Summary -->
          <div v-else-if="element.type === 'booking-summary'" class="p-5" :style="{ backgroundColor: element.props.bgColor || '#ffffff', borderRadius: element.style?.borderRadius || '12px', border: `1px solid ${element.props.borderColor || '#e5e7eb'}` }">
            <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: element.props.iconBgColor || '#d1fae5' }">
                <span v-html="getInlineSvgIcon(element.props.iconUrl || element.props.icon, 'calendar-check', element.props.iconColor || '#059669', 20)"></span>
              </div>
              <div>
                <h4 :style="{ 
                  color: element.props.titleColor || '#1f2937', 
                  fontSize: element.props.titleFontSize || '16px', 
                  fontWeight: element.props.titleFontWeight || 'bold',
                  fontStyle: element.props.titleFontStyle || 'normal',
                  fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.titleAlign || 'left'
                }">{{ element.props.children || 'Chi tiết đặt phòng' }}</h4>
                <p class="text-sm text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Mã: {{ element.props.confirmationCode || 'BK123456' }}</p>
              </div>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Khách sạn:</span>
                <span class="font-medium" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.detailsFontWeight || '500',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'right'
                }">{{ element.props.propertyName || 'Sunset Beach Resort' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Loại phòng:</span>
                <span class="font-medium" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.detailsFontWeight || '500',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'right'
                }">{{ element.props.roomType || 'Deluxe Ocean View' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Nhận phòng:</span>
                <span class="font-medium" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.detailsFontWeight || '500',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'right'
                }">{{ element.props.checkIn || '01/01/2026' }} {{ element.props.checkInTime || '14:00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Trả phòng:</span>
                <span class="font-medium" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.detailsFontWeight || '500',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'right'
                }">{{ element.props.checkOut || '03/01/2026' }} {{ element.props.checkOutTime || '12:00' }}</span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-500" :style="{ 
                  fontSize: element.props.detailsFontSize || '14px',
                  color: element.props.detailsColor || '#6b7280',
                  fontWeight: element.props.detailsFontWeight || 'normal',
                  fontStyle: element.props.detailsFontStyle || 'normal',
                  fontFamily: element.props.detailsFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.detailsAlign || 'left'
                }">Tiền phòng ({{ element.props.nights || 2 }} đêm):</span>
                <span :style="{ 
                  fontSize: element.props.priceFontSize || '14px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.priceFontWeight || 'normal',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'right'
                }">{{ element.props.roomPrice || '5,000,000đ' }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold">
                <span :style="{ 
                  fontSize: element.props.priceFontSize || '18px',
                  color: element.props.detailsColor || '#374151',
                  fontWeight: element.props.priceFontWeight || 'bold',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'left'
                }">Tổng cộng:</span>
                <span :style="{ 
                  color: element.props.priceColor || '#059669',
                  fontSize: element.props.priceFontSize || '18px',
                  fontWeight: element.props.priceFontWeight || 'bold',
                  fontStyle: element.props.priceFontStyle || 'normal',
                  fontFamily: element.props.priceFontFamily || 'Arial, sans-serif',
                  textAlign: element.props.priceAlign || 'right'
                }">{{ element.props.total || '5,250,000đ' }}</span>
              </div>
            </div>
          </div>

          <!-- Hotel: Rating Review -->
          <div v-else-if="element.type === 'rating-review'" class="p-5" :style="{ backgroundColor: element.props.bgColor || '#ffffff', borderRadius: element.style?.borderRadius || '12px', border: `1px solid ${element.props.borderColor || '#e5e7eb'}` }">
            <div class="flex items-start gap-3 mb-3">
              <img :src="element.props.reviewerAvatar || 'https://placehold.co/48x48/e2e8f0/64748b?text=A'" class="w-12 h-12 rounded-full shrink-0" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium" :style="{ 
                      color: element.props.titleColor || '#1f2937',
                      fontSize: element.props.titleFontSize || '14px',
                      fontWeight: element.props.titleFontWeight || '500',
                      fontStyle: element.props.titleFontStyle || 'normal',
                      fontFamily: element.props.titleFontFamily || 'Arial, sans-serif',
                      textAlign: element.props.titleAlign || 'left'
                    }">{{ element.props.reviewerName || 'Nguyễn Văn C' }}</span>
                    <span v-if="element.props.showVerified && element.props.verified" class="ml-2 text-xs text-green-600"><i class="bi bi-patch-check-fill"></i> Đã xác minh</span>
                  </div>
                  <span class="text-xs text-gray-400">{{ element.props.reviewDate || '28/12/2025' }}</span>
                </div>
                <div class="flex items-center gap-0.5 mt-1">
                  <i v-for="s in 5" :key="s" class="bi bi-star-fill text-sm" :style="{ color: s <= (element.props.rating || 5) ? (element.props.starColor || '#fbbf24') : '#e5e7eb' }"></i>
                </div>
              </div>
            </div>
            <h5 class="font-medium mb-2" :style="{ 
              color: element.props.reviewTitleColor || '#1f2937',
              fontSize: element.props.reviewTitleFontSize || '16px',
              fontWeight: element.props.reviewTitleFontWeight || 'medium',
              fontStyle: element.props.reviewTitleFontStyle || 'normal',
              fontFamily: element.props.reviewTitleFontFamily || 'Arial, sans-serif',
              textAlign: element.props.reviewTitleAlign || 'left'
            }">{{ element.props.title || 'Trải nghiệm tuyệt vời!' }}</h5>
            <p class="text-sm" :style="{ 
              color: element.props.contentColor || '#374151',
              fontSize: element.props.contentFontSize || '14px',
              fontWeight: element.props.contentFontWeight || 'normal',
              fontStyle: element.props.contentFontStyle || 'normal',
              fontFamily: element.props.contentFontFamily || 'Arial, sans-serif',
              textAlign: element.props.contentAlign || 'left'
            }">{{ element.props.content || 'Phòng sạch sẽ, view đẹp, nhân viên thân thiện.' }}</p>
            <div v-if="element.props.helpful" class="mt-3 text-xs text-gray-500"><i class="bi bi-hand-thumbs-up mr-1"></i>{{ element.props.helpful }} người thấy hữu ích</div>
          </div>

          <!-- Unsubscribe -->
          <div style="padding: 10px 0px" v-else-if="element.type === 'unsubscribe'" class="border-t border-gray-200" :class="{ 'text-left': element.props.align === 'left', 'text-center': element.props.align === 'center' || !element.props.align, 'text-right': element.props.align === 'right' }">
            <div :style="{ maxWidth: (globalSettings.contentWidth || 700) + 'px', margin: '0 auto' }">
              <p class="mb-3 leading-relaxed" :style="{ color: element.props.textColor || '#9ca3af', fontSize: element.props.fontSize || '12px' }">
                {{ element.props.description || 'Nếu bạn không muốn nhận email từ chúng tôi, bạn có thể hủy đăng ký bất cứ lúc nào.' }}
              </p>
              <a :href="element.props.href || '#unsubscribe'" :style="{ color: element.props.linkColor || '#2563eb', fontSize: element.props.fontSize || '12px' }" class="underline hover:no-underline">
                {{ element.props.children || 'Hủy đăng ký' }}
              </a>
            </div>
          </div>

          <!-- Image with Title and Caption -->
          <div v-else-if="element.type === 'image'" class="w-full">
            <h4 v-if="element.props.title" class="text-sm font-medium text-gray-800 mb-2" :style="{ textAlign: element.props.align || 'center' }">{{ element.props.title }}</h4>
            <img 
              :src="element.props.src || element.style?.backgroundImage || 'https://placehold.co/600x300/e2e8f0/64748b?text=Image'"
              :alt="element.props.alt || 'Image'"
              :style="{ 
                width: element.props.width || '100%',
                height: 'auto',
                aspectRatio: element.props.aspectRatio || 'auto', 
                objectFit: element.props.aspectRatio ? 'cover' : 'initial',
                display: 'block',
                margin: element.props.align === 'center' ? '0 auto' : element.props.align === 'right' ? '0 0 0 auto' : '0'
              }"
              class="cursor-pointer max-w-full"
            />
            <p v-if="element.props.caption" class="text-xs text-gray-600 mt-2 italic" :style="{ textAlign: element.props.align || 'center' }">{{ element.props.caption }}</p>
          </div>

          <!-- Video Element - No overlay design -->
          <div v-else-if="element.type === 'video'" class="w-full">
            <h4 v-if="element.props.title" class="text-sm font-medium text-gray-800 mb-2" :style="{ textAlign: element.props.align || 'center' }">{{ element.props.title }}</h4>
            <!-- YouTube Thumbnail -->
            <div 
              v-if="element.props.videoType === 'youtube' && getYouTubeEmbedId(element.props.youtubeUrl)"
              :style="{ 
                width: element.props.width || '100%',
                margin: element.props.align === 'center' ? '0 auto' : element.props.align === 'right' ? '0 0 0 auto' : '0'
              }"
            >
              <img 
                :src="`https://img.youtube.com/vi/${getYouTubeEmbedId(element.props.youtubeUrl)}/maxresdefault.jpg`"
                alt="Video thumbnail"
                class="w-full h-auto"
                :style="{ borderRadius: element.props.borderRadius || '8px', display: 'block' }"
              />
              <div class="mt-3 text-center">
                <a :href="element.props.youtubeUrl || '#'" class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <i class="bi bi-play-circle-fill text-xl"></i>
                  <span class="font-medium">Xem Video</span>
                </a>
              </div>
            </div>
            
            <!-- Regular Video File -->
            <div 
              v-else
              :style="{
                width: element.props.width || '100%',
                margin: element.props.align === 'center' ? '0 auto' : element.props.align === 'right' ? '0 0 0 auto' : '0'
              }"
            >
              <img 
                v-if="element.props.poster"
                :src="element.props.poster"
                alt="Video poster"
                class="w-full h-auto"
                :style="{ borderRadius: element.props.borderRadius || '8px', display: 'block' }"
              />
              <div v-else class="w-full bg-gray-200 flex items-center justify-center" :style="{ aspectRatio: element.props.aspectRatio || '16/9', borderRadius: element.props.borderRadius || '8px' }">
                <i class="bi bi-play-circle text-6xl text-gray-400"></i>
              </div>
              <div class="mt-3 text-center">
                <a :href="element.props.src || '#'" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="bi bi-play-circle-fill text-xl"></i>
                  <span class="font-medium">Phát Video</span>
                </a>
              </div>
            </div>
            <p v-if="element.props.caption" class="text-xs text-gray-600 mt-2 italic" :style="{ textAlign: element.props.align || 'center' }">{{ element.props.caption }}</p>
          </div>

          <!-- Button Element -->
          <div v-else-if="element.type === 'button'" :style="{ textAlign: element.style.textAlign || 'left', margin: element.style.margin || '0' }">
            <div :style="{ maxWidth: (globalSettings.contentWidth || 700) + 'px', margin: '0 auto' }">
              <a 
                :href="element.props.href || '#'"
                :style="{
                  backgroundColor: element.style.backgroundColor || '#3b82f6',
                  color: element.style.color || '#ffffff',
                  padding: element.style.padding || '12px 24px',
                  borderRadius: element.style.borderRadius || '6px',
                  fontSize: element.style.fontSize || '16px',
                  fontFamily: element.style.fontFamily || 'Arial, sans-serif',
                  fontWeight: element.style.fontWeight || 'normal',
                  fontStyle: element.style.fontStyle || 'normal',
                  textDecoration: 'none',
                  display: 'inline-block',
                  cursor: 'pointer'
                }"
                class="cursor-pointer"
              >
                {{ element.props.children || 'Button' }}
              </a>
            </div>
          </div>

          <!-- Heading Elements -->
          <component
            v-else-if="['heading1', 'heading2', 'heading3'].includes(element.type)"
            :is="element.props.as || (element.type === 'heading1' ? 'h1' : element.type === 'heading2' ? 'h2' : 'h3')"
            :style="getTextOnlyStyle(element.style, { fontWeight: 'bold', lineHeight: '1.2' })"
            class="cursor-pointer"
          >
            {{ element.props.children || 'Heading' }}
          </component>

          <!-- Text and Link Elements -->
          <component
            v-else-if="['text', 'link'].includes(element.type)"
            :is="element.props.as || getElementComponent(element.type)"
            :href="element.props.href"
            :style="getTextOnlyStyle(element.style)"
            class="cursor-pointer"
          >
            {{ element.props.children || 'Text content' }}
          </component>

          <!-- Quote Element -->
          <blockquote
            v-else-if="element.type === 'quote'"
            :style="getTextOnlyStyle(element.style, { fontStyle: 'italic' })"
            class="cursor-pointer"
          >
            {{ element.props.children || 'Quote text' }}
          </blockquote>

          <!-- HTML Element with Full CSS Support - Using iframe for isolation -->
          <iframe 
            v-else-if="element.type === 'html'"
            class="html-iframe cursor-pointer"
            :style="{ 
              minHeight: element.style?.minHeight || '50px',
              width: '100%',
              border: 'none',
              borderRadius: element.style?.borderRadius || '0px'
            }"
            :srcdoc="getHtmlIframeContent(element.props.children)"
            @load="onHtmlIframeLoad($event, element)"
          ></iframe>

          <!-- Other Elements (divider, spacer, etc) -->
          <component 
            v-else
            :is="getElementComponent(element.type)"
            v-bind="getElementProps(element)"
            :style="getTextOnlyStyle(element.style)"
            class="cursor-pointer"
          />
        </div>
      </div>

      <!-- Drop Zone After Each Element (only when dragging) -->
      <div 
        v-if="isDragging"
        class="w-full h-10 my-2 border-2 border-dashed rounded-lg flex items-center justify-center transition-all"
        :class="dropIndex === index + 1 ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50/50'"
        @drop.prevent="(e) => onDropAtIndex(e, index + 1)"
        @dragover.prevent
        @dragenter.prevent="dropIndex = index + 1"
      >
        <span class="text-blue-500 text-sm font-medium flex items-center gap-2 pointer-events-none">
          <i class="bi bi-arrow-down-circle"></i>
          Drop here
        </span>
      </div>
    </div>

    <!-- Empty State --> 
    <div 
      v-if="elements.length === 0"
      class="flex-1 flex items-center justify-center p-6 w-full h-full"
      @drop.prevent="(e) => onDropAtIndex(e, 0)"
      @dragover.prevent
      @dragenter.prevent="dropIndex = 0"
    >
      <div 
        class="text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl  w-full h-full transition-all"
        :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'"
      >
        <i class="bi bi-inbox text-4xl mb-2 block" :class="isDragging ? 'text-blue-500' : 'text-gray-400'"></i>
        <h4 class="text-base font-semibold text-gray-700 mb-2">Kéo các phần tử vào đây</h4>
        <p class="text-sm text-gray-500">Bắt đầu soạn thảo email của bạn bằng cách kéo các thành phần từ thanh bên.</p>
      </div>
    </div> <!-- Close empty state -->
        </div> <!-- Close padding/maxWidth/textAlign wrapper -->
      </div> <!-- Close background/font wrapper -->
    </div> <!-- Close inner container with max-width -->
  </div> <!-- Close outer container full width -->
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { EHeading, EText, EButton, EImg, EHr, EHtml, ESection, ERow, EContainer } from 'vue-email'
import { getSafeHtml } from '~/utils/sanitizeHtml.js'
import { getEmailIcon, getSocialIcon } from '~/utils/emailIcons.js'
import SocialLinksRenderer from '../utils/SocialLinksRenderer.vue'

const props = defineProps({
  elements: {
    type: Array,
    default: () => []
  },
  selectedElement: Object,
  device: Object,
  globalSettings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:elements', 'select-element', 'show-element-library'])

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')

const showWarningToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const selectedElement = ref(null)
const dropIndex = ref(null)
const dropTargetColumn = ref(null)
const isDragging = ref(false)
const dragCounter = ref(0)

// Drag event handlers - use counter to prevent flickering
const onDragEnter = (e) => {
  dragCounter.value++
  isDragging.value = true
}

const onDragLeave = (e) => {
  dragCounter.value--
  if (dragCounter.value === 0) {
    isDragging.value = false
    dropIndex.value = null
  }
}

const onDragEnd = () => {
  dragCounter.value = 0
  isDragging.value = false
  dropIndex.value = null
}



// Element drag reorder
const draggedElementIndex = ref(null)

const onElementDragStart = (event, index) => {
  draggedElementIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', `reorder:${index}`)
  isDragging.value = true
}

const onElementDragEnd = () => {
  draggedElementIndex.value = null
  isDragging.value = false
  dropIndex.value = null
  dragCounter.value = 0
}

// Helper functions
const isColumnElement = (type) => {
  return ['columns2', 'columns3', 'columns4'].includes(type)
}

const isRowElement = (type) => {
  return ['row2', 'row3', 'row4'].includes(type)
}

const getColumnCount = (type) => {
  const counts = { columns2: 2, columns3: 3, columns4: 4 }
  return counts[type] || 1
}

const getRowCount = (type) => {
  const counts = { row2: 2, row3: 3, row4: 4 }
  return counts[type] || 1
}

// Check if element should be hidden based on device width
const shouldHideElement = (element) => {
  if (!element.props) return false
  
  const deviceWidth = props.device?.width || 900
  
  // Mobile: <= 480px
  if (deviceWidth <= 480 && element.props.hideOnMobile) {
    return true
  }
  
  // Tablet: 481px - 768px
  if (deviceWidth > 480 && deviceWidth <= 768 && element.props.hideOnTablet) {
    return true
  }
  
  // Desktop: > 768px
  if (deviceWidth > 768 && element.props.hideOnDesktop) {
    return true
  }
  
  return false
}

const getElementComponent = (type) => {
  const components = {
    heading1: EHeading,
    heading2: EHeading,
    heading3: EHeading,
    text: EText,
    button: EButton,
    image: EImg,
    video: 'video',
    divider: EHr,
    html: EHtml,
    section: ESection,
    row: ERow,
    container: EContainer,
    link: 'a',
    spacer: 'div',
    quote: 'blockquote'
  }
  
  if (type.startsWith('social-')) return 'a'
  if (['cta-block', 'testimonial', 'product-card', 'footer', 'header'].includes(type)) return 'div'
  
  return components[type] || EText
}

const getElementProps = (element) => {
  const props = { ...element.props }
  
  if (element.type.startsWith('heading')) {
    props.as = element.type.replace('heading', 'h')
  }
  
  if (element.type === 'button') {
    props.href = 'javascript:void(0)'
  }
  
  if (element.type.startsWith('social-')) {
    props.href = element.props.href || '#'
    props.target = '_blank'
  }
  
  return props
}

const getElementIcon = (type) => {
  const icons = {
    heading1: 'bi bi-type-h1',
    heading2: 'bi bi-type-h2',
    heading3: 'bi bi-type-h3',
    text: 'bi bi-type',
    button: 'bi bi-mouse2',
    image: 'bi bi-image',
    video: 'bi bi-play-circle',
    link: 'bi bi-link-45deg',
    divider: 'bi bi-hr',
    spacer: 'bi bi-arrows-expand',
    html: 'bi bi-code-slash',
    section: 'bi bi-layout-split',
    row: 'bi bi-distribute-horizontal',
    container: 'bi bi-square',
    columns2: 'bi bi-columns',
    columns3: 'bi bi-layout-three-columns',
    columns4: 'bi bi-grid-3x2',
    row2: 'bi bi-distribute-vertical',
    row3: 'bi bi-distribute-vertical',
    row4: 'bi bi-distribute-vertical',
    'social-facebook': 'bi bi-facebook',
    'social-twitter': 'bi bi-twitter',
    'social-instagram': 'bi bi-instagram',
    'social-linkedin': 'bi bi-linkedin',
    'social-youtube': 'bi bi-youtube',
    'social-tiktok': 'bi bi-tiktok',
    'cta-block': 'bi bi-megaphone',
    'testimonial': 'bi bi-chat-quote',
    'product-card': 'bi bi-card-image',
    'product-grid': 'bi bi-grid-3x3',
    'coupon-code': 'bi bi-tag',
    'cart-reminder': 'bi bi-cart3',
    'order-summary': 'bi bi-receipt',
    'shipping-info': 'bi bi-truck',
    'property-card': 'bi bi-house',
    'property-features': 'bi bi-check2-square',
    'location-map': 'bi bi-geo-alt',
    'agent-contact': 'bi bi-person-badge',
    'job-listing': 'bi bi-briefcase',
    'company-intro': 'bi bi-building',
    'benefits-list': 'bi bi-list-check',
    // Banking
    'transaction-card': 'bi bi-arrow-left-right',
    'credit-card-info': 'bi bi-credit-card-2-front',
    // Gaming/Course
    'course-card': 'bi bi-mortarboard',
    'game-item-card': 'bi bi-gem',
    'achievement-badge': 'bi bi-trophy',
    'progress-bar': 'bi bi-graph-up',
    // F&B/Hotel
    'menu-item': 'bi bi-cup-hot',
    'room-card': 'bi bi-building',
    'booking-summary': 'bi bi-calendar-check',
    'rating-review': 'bi bi-star-fill',  
  }
  return icons[type] || 'bi bi-square'
}

// Helper to get YouTube embed ID from various URL formats
const getYouTubeEmbedId = (url) => {
  if (!url) return null
  
  // youtube.com/watch?v=VIDEO_ID
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  if (match && match[1]) return match[1]
  
  // If already an embed URL or just an ID
  if (url.includes('youtube.com/embed/')) {
    const parts = url.split('embed/')
    return parts[1]?.split('?')[0]
  }
  
  // Assume it's just the ID if no match
  if (url.length === 11 && !url.includes('/') && !url.includes('=')) {
    return url
  }
  
  return null
}

// Sanitize HTML content for safe rendering
const getSafeHtmlContent = (html) => {
  if (!html) return '<p style="color: #999; font-style: italic;">No HTML content</p>'
  return getSafeHtml(html, { maxLength: 50000 })
}

// Generate HTML content for iframe to isolate from app CSS
const getHtmlIframeContent = (html) => {
  if (!html) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            padding: 8px; 
            font-family: Arial, sans-serif; 
            font-size: 14px;
            line-height: 1.4;
            color: #333;
          }
        </style>
      </head>
      <body>
        <p style="color: #999; font-style: italic;">No HTML content</p>
      </body>
      </html>
    `
  }
  
  // Sanitize the HTML first
  const sanitizedHtml = sanitizeHtmlContent(html)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          font-size: 14px;
          line-height: 1.4;
          color: #333;
        }
        /* Reset common styles to ensure user HTML displays correctly */
        * {
          box-sizing: border-box;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
      </style>
    </head>
    <body>
      ${sanitizedHtml}
    </body>
    </html>
  `
}

// Handle iframe load event
const onHtmlIframeLoad = (event, element) => {
  try {
    const iframe = event.target
    if (iframe && iframe.contentWindow) {
      // Adjust iframe height based on content
      const height = iframe.contentWindow.document.body.scrollHeight
      iframe.style.height = Math.max(height, 50) + 'px'
      
      // Make links open in new tab
      const links = iframe.contentWindow.document.querySelectorAll('a')
      links.forEach(link => {
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank')
          link.setAttribute('rel', 'noopener noreferrer')
        }
      })
    }
  } catch (error) {
    console.warn('Failed to adjust iframe:', error)
  }
}

// Sanitize HTML helper
const sanitizeHtmlContent = (html) => {
  if (!html) return ''
  
  let safe = html.trim()
  
  // Remove script tags and their content
  safe = safe.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onload, onerror, etc.)
  safe = safe.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  safe = safe.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol in links
  safe = safe.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
  safe = safe.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
  
  return safe
}

// Extract CSS from HTML content
const getHtmlCSS = (html) => {
  if (!html) return ''
  
  const safeHtml = sanitizeHtmlContent(html)
  
  // Check if already has style tags
  const styleMatch = safeHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  if (styleMatch) {
    return styleMatch[1]
  }
  
  // Check if content has @media queries (likely CSS without style tags)
  const hasMediaQuery = /@media/.test(safeHtml)
  if (hasMediaQuery) {
    // Extract HTML tags
    const htmlTagsRegex = /<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/gi
    const htmlTags = safeHtml.match(htmlTagsRegex) || []
    
    // CSS is everything that's not HTML tags
    let cssContent = safeHtml
    htmlTags.forEach(tag => {
      cssContent = cssContent.replace(tag, '')
    })
    
    return cssContent.trim()
  }
  
  return ''
}

// Extract HTML content only (without CSS)
const getHtmlOnlyContent = (html) => {
  if (!html) return '<p style="color: #999; font-style: italic;">No HTML content</p>'
  
  const safeHtml = sanitizeHtmlContent(html)
  
  // Remove style tags if present
  let htmlOnly = safeHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  
  // Check if content has @media queries (likely mixed CSS and HTML)
  const hasMediaQuery = /@media/.test(htmlOnly)
  if (hasMediaQuery) {
    // Extract only HTML tags
    const htmlTagsRegex = /<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/gi
    const htmlTags = htmlOnly.match(htmlTagsRegex) || []
    
    if (htmlTags.length > 0) {
      return htmlTags.join('\n')
    }
    
    // No HTML tags, return empty
    return ''
  }
  
  return htmlOnly.trim() || '<p style="color: #999; font-style: italic;">No HTML content</p>'
}


// Bootstrap Icons CDN base URL
const ICON_CDN_BASE = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/icons'

// Helper function to get social platform brand color
const getSocialColor = (platform) => {
  const colors = {
    facebook: '#1877f2',
    twitter: '#1da1f2',
    instagram: '#e4405f',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    tiktok: '#000000',
    github: '#333333',
    pinterest: '#bd081c',
    snapchat: '#fffc00',
    whatsapp: '#25d366'
  }
  return colors[platform?.toLowerCase()] || '#6b7280'
}

// Helper function to get icon as image (email-compatible - Gmail strips inline SVG)
const getInlineSvgIcon = (iconUrl, fallback = 'star-fill', color = 'currentColor', size = 20) => {
  // If custom URL is provided, use it directly
  if (iconUrl && iconUrl.startsWith && iconUrl.startsWith('http')) {
    return `<img src="${iconUrl}" alt="icon" style="width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;" />`
  }
  // Use CDN URL for fallback icon
  const iconName = fallback || 'star-fill'
  const cdnUrl = `${ICON_CDN_BASE}/${iconName}.svg`
  return `<img src="${cdnUrl}" alt="${iconName}" style="width:${size}px;height:${size}px;vertical-align:middle;" />`
}

// Helper function to generate avatar from name
const generateAvatarFromName = (name) => {
  if (!name) return 'https://placehold.co/32x32/e2e8f0/64748b?text=GV'
  
  // Get initials from name (max 2 characters)
  const words = name.trim().split(/\s+/)
  let initials = ''
  
  if (words.length >= 2) {
    // Take first letter of first two words
    initials = words[0][0] + words[1][0]
  } else if (words.length === 1 && words[0].length >= 2) {
    // Take first two letters of single word
    initials = words[0].substring(0, 2)
  } else {
    // Take first letter
    initials = words[0][0] + (words[1] ? words[1][0] : '')
  }
  
  initials = initials.toUpperCase()
  
  // Generate background color based on name
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#FFD93D', '#6BCB77', '#FF6B9D',
    '#C44569', '#F8B195', '#F67280', '#355C7D', '#6C5CE7'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % colors.length
  const backgroundColor = colors[colorIndex]
  
  // Generate avatar URL
  return `https://placehold.co/32x32/${backgroundColor.replace('#', '')}/ffffff?text=${encodeURIComponent(initials)}`
}


// Get email frame style - Unlayer-style professional preview
const getEmailFrameStyle = () => {
  const contentWidth = props.globalSettings?.contentWidth || 700
  const previewDeviceWidth = props.device?.width || 900
  const gs = props.globalSettings || {}
  
  // Determine actual width based on device vs content width
  const actualWidth = previewDeviceWidth <= contentWidth ? '100%' : `${contentWidth}px`
  
  return {
    width: actualWidth,
    maxWidth: previewDeviceWidth <= contentWidth ? `${previewDeviceWidth}px` : `${contentWidth}px`,
    minHeight: '250px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: gs.backgroundColor || '#ffffff'
  }
}

// Get email body style - applies global settings
const getEmailBodyStyle = () => {
  const gs = props.globalSettings || {}
  
  return {
    backgroundColor: gs.backgroundImage ? 'transparent' : (gs.backgroundColor || '#ffffff'),
    backgroundImage: gs.backgroundImage ? `url(${gs.backgroundImage})` : 'none',
    backgroundSize: gs.backgroundSize || 'cover',
    backgroundPosition: gs.backgroundPosition || 'center',
    backgroundRepeat: gs.backgroundRepeat || 'no-repeat',
    fontFamily: gs.fontFamily || 'arial,helvetica,sans-serif',
    fontSize: gs.fontSize || '16px',
    lineHeight: gs.lineHeight || '1.6',
    color: gs.textColor || '#333333',
    padding: gs.padding || '20px',
    textAlign: gs.textAlign || 'left'
  }
}

// Get responsive grid class for Product Grid
const getProductGridClass = (columns) => {
  const cols = parseInt(columns) || 3
  if (cols >= 3) {
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
  } else if (cols === 2) {
    return 'grid grid-cols-1 sm:grid-cols-2'
  }
  return 'grid grid-cols-1'
}

// Get text-only styles (excludes box-model properties that are on wrapper)
const getTextOnlyStyle = (style, defaults = {}) => {
  if (!style) return defaults
  
  const result = { ...defaults }
  
  // Text properties only
  if (style.fontSize) result.fontSize = style.fontSize
  if (style.color) result.color = style.color
  if (style.textAlign) result.textAlign = style.textAlign
  if (style.fontFamily) result.fontFamily = style.fontFamily
  if (style.fontWeight) result.fontWeight = style.fontWeight
  if (style.fontStyle) result.fontStyle = style.fontStyle
  if (style.textDecoration) result.textDecoration = style.textDecoration
  if (style.letterSpacing) result.letterSpacing = style.letterSpacing
  if (style.textTransform) result.textTransform = style.textTransform
  if (style.lineHeight) result.lineHeight = style.lineHeight
  
  return result
}

// Convert spacing value to CSS format with units
// Input: '1 1 1 1' or '1% 1% 1% 1%' or '10px 20px'
// Output: '1% 1% 1% 1%' (adds % if no unit present)
const convertSpacingToCSS = (value) => {
  if (!value || value === '0') return value
  
  const parts = String(value).trim().split(/\s+/)
  return parts.map(part => {
    // If already has unit (px, %, rem, em), keep as is
    if (/^-?\d+\.?\d*(px|%|rem|em)$/i.test(part)) {
      return part
    }
    // If just a number, add % unit
    if (/^-?\d+\.?\d*$/.test(part)) {
      return part === '0' ? '0' : `${part}%`
    }
    return part
  }).join(' ')
}

// Convert entire style object - ensures padding/margin have proper units
const getConvertedStyle = (style) => {
  if (!style) return {}
  
  const result = { ...style }
  if (result.padding) result.padding = convertSpacingToCSS(result.padding)
  if (result.margin) result.margin = convertSpacingToCSS(result.margin)
  return result
}

// Get wrapper style for elements - consolidates all box-model styles
const getElementWrapperStyle = (element) => {
  if (!element?.style) {
    return {}
  }
  
  const style = element.style
  const result = {}
  
  // Box model properties - these should be on the wrapper
  // Convert spacing values to CSS format with units
  if (style.padding) result.padding = convertSpacingToCSS(style.padding)
  if (style.margin) result.margin = convertSpacingToCSS(style.margin)
  
  // Background properties
  if (style.backgroundColor) result.backgroundColor = style.backgroundColor
  if (style.backgroundImage) {
    // Handle both url() wrapped and plain URLs
    const bgImage = style.backgroundImage
    result.backgroundImage = bgImage.startsWith('url(') ? bgImage : `url(${bgImage})`
  }
  if (style.backgroundSize) result.backgroundSize = style.backgroundSize
  if (style.backgroundPosition) result.backgroundPosition = style.backgroundPosition
  if (style.backgroundRepeat) result.backgroundRepeat = style.backgroundRepeat
  
  // Border properties
  if (style.borderWidth) result.borderWidth = style.borderWidth
  if (style.borderStyle) result.borderStyle = style.borderStyle
  if (style.borderColor) result.borderColor = style.borderColor
  if (style.borderRadius) result.borderRadius = style.borderRadius
  
  // Shadow
  if (style.boxShadow) result.boxShadow = style.boxShadow
  return result
}

const getElementName = (type) => {
  const names = {
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    text: 'Text',
    button: 'Button',
    image: 'Image',
    video: 'Video',
    link: 'Link',
    divider: 'Divider',
    spacer: 'Spacer',
    html: 'HTML',
    section: 'Section',
    row: 'Row',
    row2: '2 Rows',
    row3: '3 Rows',
    row4: '4 Rows',
    container: 'Container',
    columns2: '2 Columns',
    columns3: '3 Columns',
    columns4: '4 Columns',
    'social-facebook': 'Facebook',
    'social-twitter': 'Twitter',
    'social-instagram': 'Instagram',
    'social-linkedin': 'LinkedIn',
    'social-youtube': 'YouTube',
    'social-tiktok': 'TikTok',
    'cta-block': 'CTA Block',
    'testimonial': 'Testimonial',
    'product-card': 'Product Card',
    'footer': 'Footer',
    'header': 'Header',
    'quote': 'Quote',
    // E-commerce
    'product-grid': 'Product Grid',
        'coupon-code': 'Coupon Code',
    'cart-reminder': 'Cart Reminder',
    'order-summary': 'Order Summary',
    // Real Estate
    'property-card': 'Property Card',
    'property-features': 'Property Features',
    'location-map': 'Location Map',
    // Recruitment
    'job-listing': 'Job Listing',
    'benefits-list': 'Benefits List',
    // Banking
    'transaction-card': 'Giao Dịch',
    'credit-card-info': 'Thẻ Tín Dụng',
    // Gaming/Course
    'course-card': 'Khóa Học',
    'progress-bar': 'Tiến Độ',
    // F&B/Hotel
    'menu-item': 'Món Ăn',
    'room-card': 'Phòng',
    'booking-summary': 'Đặt Phòng',
    'rating-review': 'Đánh Giá',
    // Utility
    'unsubscribe': 'Unsubscribe'
  }
  return names[type] || type
}

const elements = computed({
  get: () => props.elements,
  set: (value) => emit('update:elements', value)
})

// Select element
const selectElement = (element) => {
  selectedElement.value = element
  emit('select-element', element)
}

// Update element
const updateElement = (elementId, updates) => {
  const index = elements.value.findIndex(el => el.id === elementId)
  if (index !== -1) {
    elements.value[index] = { ...elements.value[index], ...updates }
    elements.value = [...elements.value]
  }
}

// Elements that cannot be placed inside Row/Column containers
const restrictedContainerElements = [
  // E-commerce
  'product-grid', 'coupon-code', 'cart-reminder', 'order-summary',
  // Real Estate
  'property-card', 'property-features', 'location-map',
  // Recruitment
  'job-listing', 'benefits-list',
  // Banking
  'transaction-card', 'credit-card-info',
  // Gaming/Course
  'course-card', 'game-item-card', 'achievement-badge', 'progress-bar',
  // F&B/Hotel
  'menu-item', 'room-card', 'booking-summary', 'rating-review'
]

// Handle drop in column/section/row
const handleDropInColumn = ({ parentId, columnIndex, elementType, containerType = 'column' }) => {
  const parentElement = elements.value.find(el => el.id === parentId)
  if (!parentElement) return

  // Check if element type is restricted from containers
  if (restrictedContainerElements.includes(elementType)) {
    showWarningToast('Thành phần này không hỗ trợ đặt trong Column/Row')
    return
  }

  // Initialize children array if not exists
  if (!parentElement.children) {
    parentElement.children = containerType === 'column' ? [] : []
  }

  // For columns, initialize column array
  if (containerType === 'column') {
    if (!parentElement.children[columnIndex]) {
      parentElement.children[columnIndex] = []
    }
  } else {
    // For section/row, use single array
    if (!Array.isArray(parentElement.children)) {
      parentElement.children = []
    }
  }

  // Create new element
  const newElement = {
    id: Date.now() + Math.random(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }

  // Add to appropriate container
  if (containerType === 'column') {
    parentElement.children[columnIndex].push(newElement)
  } else {
    parentElement.children.push(newElement)
  }
  
  // Update elements
  elements.value = [...elements.value]
}

// Helper function to get default props
const getDefaultProps = (type) => {
  const defaults = {
    heading1: { as: 'h1', children: 'Your Heading 1' },
    heading2: { as: 'h2', children: 'Your Heading 2' },
    heading3: { as: 'h3', children: 'Your Heading 3' },
    text: { children: 'Your text content goes here...' },
    button: { href: 'javascript:void(0)', children: 'Click Me' },
    image: { src: 'https://placehold.co/300x200/e2e8f0/64748b?text=Image', alt: 'Image', width: '300px', height: '200px' },
    video: { src: '', poster: 'https://placehold.co/400x225/e2e8f0/64748b?text=Video', width: '400px', height: '225px', autoplay: false, controls: true },
    divider: {},
    spacer: { height: '0' },
    html: { children: '<p>Your HTML code here</p>' },
    link: { href: '#', children: 'Link Text' },
    'social-facebook': { href: 'https://facebook.com', children: 'Facebook' },
    'social-twitter': { href: 'https://twitter.com', children: 'Twitter' },
    'social-instagram': { href: 'https://instagram.com', children: 'Instagram' },
    'social-linkedin': { href: 'https://linkedin.com', children: 'LinkedIn' },
    'social-youtube': { href: 'https://youtube.com', children: 'YouTube' },
    'social-tiktok': { href: 'https://tiktok.com', children: 'TikTok' },
    'cta-block': { children: 'Ready to Get Started?', buttonText: 'Sign Up Now', href: '#', subtitle: 'Join thousands of satisfied customers' },
    'testimonial': { children: 'This product exceeded my expectations! Highly recommended for anyone looking for quality.', author: 'John Smith', company: 'ABC Company', rating: 5 },
    'product-card': { children: 'Premium Product', price: '$99.99', oldPrice: '$149.99', image: 'https://placehold.co/400x300/e2e8f0/64748b?text=Product', badge: 'Best Seller', inStock: true },
    'footer': { 
      children: '© 2025 Your Company. All rights reserved.', 
      companyName: 'Your Company',
      logo: 'https://placehold.co/120x40/3b82f6/ffffff?text=Logo',
      address: '123 Business St, City, State 12345', 
      phone: '(555) 123-4567', 
      email: 'contact@company.com',
      socialIconStyle: 'circle', // square, rounded, circle
      socialIconSize: 'medium', // small, medium, large
      socials: [
        { platform: 'facebook', url: 'https://facebook.com', logo: '' },
        { platform: 'twitter', url: 'https://twitter.com', logo: '' }
      ]
    },
    'hero-banner': { children: 'Transform Your Business Today', subtitle: 'The complete solution you have been waiting for', buttonText: 'Get Started', href: '#', image: 'https://placehold.co/1200x600/3b82f6/ffffff?text=Hero+Banner' },
    'pricing-table': { children: 'Choose Your Plan', plans: [{ name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2'] }, { name: 'Pro', price: '$79', features: ['All Basic', 'Feature 3'] }] },
    'pricing-card': { children: 'Pro Plan', price: '$79', period: '/month', features: ['Unlimited Access', '24/7 Support', 'Premium Features'], buttonText: 'Subscribe', href: '#', popular: true },
    'newsletter-signup': { children: 'Subscribe to Our Newsletter', subtitle: 'Get the latest updates delivered to your inbox', buttonText: 'Subscribe', placeholder: 'Enter your email' },
    'social-proof': { children: 'Trusted by Leading Companies', logos: ['Company A', 'Company B', 'Company C'] },
    'feature-list': { children: 'Key Features', features: ['Fast Performance', 'Secure & Reliable', 'Easy to Use', '24/7 Support'] },
    'feature-card': { children: 'Fast Performance', description: 'Lightning-fast loading times and optimized performance', icon: '⚡' },
    'team-member': { children: 'Jane Doe', role: 'CEO & Founder', bio: 'Leading the company with vision and passion', image: 'https://placehold.co/200x200/3b82f6/ffffff?text=JD', linkedin: '#', twitter: '#' },
    'event-card': { children: 'Annual Conference 2025', date: 'December 15, 2025', time: '9:00 AM - 5:00 PM', location: 'Convention Center', buttonText: 'Register Now', href: '#' },
    'blog-post': { children: 'How to Improve Your Productivity', excerpt: 'Discover the top strategies used by successful professionals...', image: 'https://placehold.co/600x400/e2e8f0/64748b?text=Blog+Post', date: 'Nov 1, 2025', author: 'Admin', readTime: '5 min read', href: '#' },
    'video-player': { children: 'Watch Our Video', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://placehold.co/800x450/e2e8f0/64748b?text=Video+Thumbnail' },
    'progress-bar': { children: 'Campaign Goal', progress: 75, goal: '$10,000', current: '$7,500' },
    'alert-box': { children: 'Important Notice', message: 'This is an important message that requires your attention', type: 'info' },
    'quote-block': { children: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    'code-block': { children: 'const greeting = "Hello World";', language: 'javascript' },
    'faq-item': { children: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee on all products. Simply contact our support team to initiate a return.' },
    'review-card': { children: 'Excellent product quality!', reviewer: 'Sarah Johnson', rating: 5, date: 'October 28, 2025', verified: true },
    'coupon-code': { children: 'SAVE20', discount: '20% OFF', description: 'Use this code at checkout', expiryDate: 'Dec 31, 2025' },
    'app-download': { children: 'Download Our App', subtitle: 'Available on iOS and Android', appStore: '#', playStore: '#' },
    'quote': { children: 'This is a quote that stands out from regular content.' },
    'header': { 
      companyName: 'Your Company', 
      tagline: 'Your tagline here',
      logo: 'https://placehold.co/120x40/ffffff/1f2937?text=Logo',
      headerLayout: 'inline',
      logoPosition: 'center',
      textColor: '#ffffff',
      taglineColor: '#ffffff',
      linkColor: '#60a5fa',
      showNav: true,
      navAlign: 'center',
      navLinks: [
        { text: 'Home', url: '#' },
        { text: 'Products', url: '#' },
        { text: 'About', url: '#' }
      ]
    },
    'product-grid': {
      children: 'Sản phẩm nổi bật',
      columns: 3,
      priceColor: '#2563eb',
      oldPriceColor: '#9ca3af',
      productNameColor: '#1f2937',
      titleColor: '#0f172a',
      cardBgColor: '#ffffff',
      cardBorderColor: '#e5e7eb',
      cardBorderWidth: '1px',
      cardBorderRadius: '12px',
      cardPadding: '0px',
      imageShape: 'rectangle',
      iconBgColor: '#dbeafe',
      iconColor: '#3b82f6',
      products: [
        { name: 'Sản phẩm 1', price: '199.000đ', oldPrice: '299.000đ', image: 'https://placehold.co/300x200/e2e8f0/64748b?text=SP1', url: '#' },
        { name: 'Sản phẩm 2', price: '299.000đ', oldPrice: '', image: 'https://placehold.co/300x200/e2e8f0/64748b?text=SP2', url: '#' },
        { name: 'Sản phẩm 3', price: '399.000đ', oldPrice: '499.000đ', image: 'https://placehold.co/300x200/e2e8f0/64748b?text=SP3', url: '#' }
      ]
    },
    'property-card': {
      children: 'Căn hộ cao cấp',
      price: '2.5 Tỷ',
      location: 'Quận 1, TP.HCM',
      badge: 'Mới',
      discount: '',
      area: '120m²',
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://placehold.co/400x280/e2e8f0/64748b?text=Property',
      titleColor: '#1a1a2e',
      imageShape: 'rounded'
    }
  }
  return defaults[type] || {}
}

// Helper function to get default style
const getDefaultStyle = (type) => {
  const defaults = {
    heading1: { fontSize: '32px', color: '#1f2937', textAlign: 'left', margin: '0', padding: '0', fontWeight: 'bold' },
    heading2: { fontSize: '24px', color: '#1f2937', textAlign: 'left', margin: '0', padding: '0', fontWeight: 'bold' },
    heading3: { fontSize: '18px', color: '#1f2937', textAlign: 'left', margin: '0', padding: '0', fontWeight: 'bold' },
    text: { fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: '0', padding: '0' },
    button: { 
      backgroundColor: '#3b82f6', 
      color: '#ffffff', 
      padding: '12px 24px',
      borderRadius: '6px',
      textDecoration: 'none',
      display: 'inline-block',
      margin: '0',
      fontSize: '16px'
    },
    image: { borderRadius: '0', margin: '0', padding: '0' },
    video: { borderRadius: '0', margin: '0', padding: '0', width: '100%', height: 'auto' },
    divider: { margin: '0', padding: '0', borderColor: '#e5e7eb' },
    spacer: { height: '0', margin: '0', padding: '0' },
    html: { margin: '0', padding: '0' },
    link: { color: '#3b82f6', textDecoration: 'underline', fontSize: '16px', margin: '0' },
    'social-facebook': { color: '#1877f2', fontSize: '0', textDecoration: 'none', margin: '0' },
    'social-twitter': { color: '#1da1f2', fontSize: '0', textDecoration: 'none', margin: '0' },
    'social-instagram': { color: '#e4405f', fontSize: '0', textDecoration: 'none', margin: '0' },
    'social-linkedin': { color: '#0077b5', fontSize: '0', textDecoration: 'none', margin: '0' },
    'social-youtube': { color: '#ff0000', fontSize: '0', textDecoration: 'none', margin: '0' },
    'social-tiktok': { color: '#000000', fontSize: '0', textDecoration: 'none', margin: '0' },
    columns2: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    columns3: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    columns4: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row2: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row3: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row4: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    quote: { 
      fontSize: '18px',
      color: '#4b5563',
      fontStyle: 'italic',
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '16px',
      margin: '0',
      padding: '12px 16px',
      backgroundColor: '#f3f4f6'
    },
    'cta-block': { backgroundColor: '#f9fafb', padding: '32px', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'testimonial': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'product-card': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'footer': { backgroundColor: '#1f2937', color: '#9ca3af', padding: '32px 24px', margin: '0' },
    'hero-banner': { backgroundColor: '#3b82f6', padding: '64px 32px', margin: '0', borderRadius: '0', color: '#ffffff', textAlign: 'center' },
    'pricing-table': { backgroundColor: '#ffffff', padding: '32px', margin: '0', borderRadius: '12px' },
    'pricing-card': { backgroundColor: '#ffffff', padding: '32px', margin: '0', borderRadius: '12px', border: '2px solid #e5e7eb' },
    'newsletter-signup': { backgroundColor: '#f9fafb', padding: '32px', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'social-proof': { backgroundColor: '#ffffff', padding: '32px', margin: '0' },
    'feature-list': { backgroundColor: '#ffffff', padding: '32px', margin: '0', borderRadius: '12px' },
    'feature-card': { backgroundColor: '#f9fafb', padding: '2 2 2 2', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'stats-counter': { backgroundColor: '#3b82f6', padding: '2 2 2 2', margin: '0', borderRadius: '12px', color: '#ffffff', textAlign: 'center' },
    'team-member': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' },
    'event-card': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'blog-post': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'video-player': { backgroundColor: '#000000', padding: '0', margin: '0', borderRadius: '12px' },
    'progress-bar': { backgroundColor: '#f3f4f6', padding: '1 1 1 1', margin: '0', borderRadius: '8px' },
    'alert-box': { backgroundColor: '#dbeafe', padding: '1 1 1 1', margin: '0', borderRadius: '8px', border: '1px solid #3b82f6' },
    'quote-block': { backgroundColor: '#f9fafb', padding: '2 2 2 2', margin: '0', borderRadius: '8px', borderLeft: '4px solid #3b82f6' },
    'code-block': { backgroundColor: '#1f2937', padding: '1 1 1 1', margin: '0', borderRadius: '8px', color: '#f3f4f6', fontFamily: 'monospace' },
    'faq-item': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '8px', border: '1px solid #e5e7eb' },
    'review-card': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '12px', border: '1px solid #e5e7eb' },
    'coupon-code': { backgroundColor: 'transparent', padding: '0', margin: '0', borderRadius: '12px', border: 'none', textAlign: 'center', boxShadow: 'none' },
    'app-download': { backgroundColor: '#f9fafb', padding: '32px', margin: '0', borderRadius: '12px', textAlign: 'center', boxShadow: 'none' },
    'hero-banner': { backgroundColor: '#3b82f6', color: '#ffffff', padding: '48px', margin: '0', textAlign: 'center', borderRadius: '0px', boxShadow: 'none' },
    // Real Estate elements
    'property-card': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: 'none' },
    'property-features': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none' },
    'location-map': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', border: 'none' },
    'agent-contact': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none' },
    // Recruitment elements
    'job-listing': { backgroundColor: '#ffffff', padding: '20px', margin: '0', borderRadius: '16px', boxShadow: 'none', border: '1px solid #e5e7eb' },
    'benefits-list': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', boxShadow: 'none', border: 'none' },
    'company-intro': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', boxShadow: 'none', border: 'none' },
    // E-commerce elements
    'product-grid': { backgroundColor: 'transparent', padding: '0', margin: '0', borderRadius: '0px', boxShadow: 'none', border: 'none' },
    'cart-reminder': { backgroundColor: 'transparent', padding: '0', margin: '0', borderRadius: '12px', boxShadow: 'none', border: 'none' },
    'order-summary': { backgroundColor: '#ffffff', padding: '2 2 2 2', margin: '0', borderRadius: '12px', boxShadow: 'none', border: '1px solid #e5e7eb' },
    // Header element
    'header': { backgroundColor: '#1f2937', color: '#ffffff', padding: '1 1 1 1', margin: '0', borderRadius: '0px', boxShadow: 'none', border: 'none' },
    // Unsubscribe element
    'unsubscribe': { backgroundColor: 'transparent', padding: '1 1 1 1', margin: '0', borderRadius: '0px', boxShadow: 'none', border: 'none' }
  }
  return defaults[type] || { margin: '0', padding: '0', borderRadius: '0px', boxShadow: 'none' }
}

// Handle column drop
const handleColumnDrop = (event, parentId, columnIndex) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (!elementType) {
    return
  }
  
  // Find parent to check nesting level - recursive search
  const findParentElement = (elId, elementsArray, depth = 0) => {
    for (const el of elementsArray) {
      if (el.id === elId) return { element: el, depth }
      
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (const childArray of el.children) {
            const found = findParentElement(elId, childArray, depth + 1)
            if (found) return found
          }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row)
          const found = findParentElement(elId, el.children, depth + 1)
          if (found) return found
        }
      }
    }
    return null
  }
  
  const parentInfo = findParentElement(parentId, elements.value)
  const parentElement = parentInfo?.element
  
  // Check if elementType is a layout (row/column) or basic element
  const isLayoutElement = isRowElement(elementType) || isColumnElement(elementType)
  
  // RULE 1: Never allow Column in Column
  if (parentElement && isColumnElement(parentElement.type) && isColumnElement(elementType)) {
    return
  }
  
  // RULE 2: Block E-commerce, Real Estate, Recruitment elements from being nested in Column/Row
  if (restrictedContainerElements.includes(elementType)) {
    showWarningToast('Thành phần này không hỗ trợ đặt trong Column/Row')
    return
  }
  
  // RULE 3: Basic elements (image, text, button, etc.) are ALWAYS allowed
  // No restriction for non-layout elements!
  
  // Create new element for column
  const newElement = {
    id: Date.now(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }
  
  // Initialize children for nested layout elements (columns/rows)
  if (['columns2', 'columns3', 'columns4'].includes(elementType)) {
    const count = parseInt(elementType.replace('columns', ''))
    newElement.children = Array.from({ length: count }, () => [])
  } else if (['row2', 'row3', 'row4'].includes(elementType)) {
    const count = parseInt(elementType.replace('row', ''))
    newElement.children = Array.from({ length: count }, () => [])
  }
  
  // Find parent element and add to column - RECURSIVE SEARCH AND UPDATE
  const updateParentRecursively = (elementsArray) => {
    for (let i = 0; i < elementsArray.length; i++) {
      const el = elementsArray[i]
      
      if (el.id === parentId) {
        // Found the parent!
        if (!el.children) el.children = []
        if (!el.children[columnIndex]) el.children[columnIndex] = []
        el.children[columnIndex].push(newElement)
        return true
      }
      
      // Search in children recursively
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (let j = 0; j < el.children.length; j++) {
            if (updateParentRecursively(el.children[j])) {
              return true
            }
          }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row)
          if (updateParentRecursively(el.children)) {
            return true
          }
        }
      }
    }
    return false
  }
  
  // Clone and update
  const newElements = JSON.parse(JSON.stringify(elements.value))
  if (updateParentRecursively(newElements)) {
    elements.value = newElements
    
    // Auto-select the new element
    nextTick(() => {
      selectedElement.value = { ...newElement }
      emit('select-element', { ...newElement })
    })
  }
  
  // Reset all drag state
  isDragging.value = false
  dropTargetColumn.value = null
  dragCounter.value = 0
}

// Handle section drop
const handleSectionDrop = (event, parentId) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (!elementType) return
  
  // Create new element for section
  const newElement = {
    id: Date.now(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }
  
  // Initialize children for nested layout elements (columns/rows)
  if (['columns2', 'columns3', 'columns4'].includes(elementType)) {
    const count = parseInt(elementType.replace('columns', ''))
    newElement.children = Array.from({ length: count }, () => [])
  } else if (['row2', 'row3', 'row4'].includes(elementType)) {
    const count = parseInt(elementType.replace('row', ''))
    newElement.children = Array.from({ length: count }, () => [])
  }
  
  // Find parent element and add to section
  const parentIndex = elements.value.findIndex(el => el.id === parentId)
  if (parentIndex !== -1) {
    const parent = elements.value[parentIndex]
    if (!parent.children) parent.children = []
    
    parent.children.push(newElement)
    elements.value = [...elements.value]
    
    // Auto-select the new element
    nextTick(() => {
      selectedElement.value = { ...newElement }
      emit('select-element', { ...newElement })
    })
  }
}

// Handle row drop
const handleRowDrop = (event, parentId) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (!elementType) return
  
  // Create new element for row
  const newElement = {
    id: Date.now(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }
  
  // Find parent element and add to row
  const parentIndex = elements.value.findIndex(el => el.id === parentId)
  if (parentIndex !== -1) {
    const parent = elements.value[parentIndex]
    if (!parent.children) parent.children = []
    
    parent.children.push(newElement)
    elements.value = [...elements.value]
    
    // Auto-select the new element
    nextTick(() => {
      selectedElement.value = { ...newElement }
      emit('select-element', { ...newElement })
    })
  }
}

// Configure column properties
const configureColumn = (element) => {
  selectedElement.value = { ...element }
  emit('select-element', { ...element })
}

// Show element library for columns/sections/rows
const showColumnElementLibrary = (parentId, columnIndex) => {
  // Emit event to show element library modal for this column
  emit('show-element-library', { type: 'column', parentId, columnIndex })
}

const showSectionElementLibrary = (parentId) => {
  // Emit event to show element library modal for this section
  emit('show-element-library', { type: 'section', parentId })
}

const showRowElementLibrary = (parentId) => {
  // Emit event to show element library modal for this row
  emit('show-element-library', { type: 'row', parentId })
}

const showRowItemLibrary = (parentId, rowIndex) => {
  // Emit event to show element library modal for this row item
  emit('show-element-library', { type: 'row-item', parentId, rowIndex })
}

// Handle row item drop (for row2, row3, row4)
const handleRowItemDrop = (event, parentId, rowIndex) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (!elementType) return
  
  // Find parent to check nesting level - recursive search
  const findParentElement = (elId, elementsArray, depth = 0) => {
    for (const el of elementsArray) {
      if (el.id === elId) return { element: el, depth }
      
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (const childArray of el.children) {
            const found = findParentElement(elId, childArray, depth + 1)
            if (found) return found
          }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row)
          const found = findParentElement(elId, el.children, depth + 1)
          if (found) return found
        }
      }
    }
    return null
  }
  
  const parentInfo = findParentElement(parentId, elements.value)
  const parentElement = parentInfo?.element
  
  // Check if elementType is a layout (row/column) or basic element
  const isLayoutElement = isRowElement(elementType) || isColumnElement(elementType)
  
  // RULE 1: Never allow Row in Row
  if (parentElement && isRowElement(parentElement.type) && isRowElement(elementType)) {
    return
  }
  
  // RULE 2: Block E-commerce, Real Estate, Recruitment elements from being nested in Column/Row
  if (restrictedContainerElements.includes(elementType)) {
    showWarningToast('Thành phần này không hỗ trợ đặt trong Column/Row')
    return
  }
  
  // RULE 3: Basic elements (image, text, button, etc.) are ALWAYS allowed
  // No restriction for non-layout elements!
  
  // Create new element for row
  const newElement = {
    id: Date.now(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }
  
  // Initialize children for nested layout elements (columns/rows)
  if (['columns2', 'columns3', 'columns4'].includes(elementType)) {
    const count = parseInt(elementType.replace('columns', ''))
    newElement.children = Array.from({ length: count }, () => [])
  } else if (['row2', 'row3', 'row4'].includes(elementType)) {
    const count = parseInt(elementType.replace('row', ''))
    newElement.children = Array.from({ length: count }, () => [])
  }
  
  // Clone elements array first to ensure Vue reactivity
  const newElements = JSON.parse(JSON.stringify(elements.value))
  
  // Recursive function to add element to nested row
  const addToNestedRow = (elementsArray) => {
    for (let i = 0; i < elementsArray.length; i++) {
      const el = elementsArray[i]
      
      if (el.id === parentId) {
        // Found the parent row
        if (!el.children) el.children = []
        if (!el.children[rowIndex]) el.children[rowIndex] = []
        el.children[rowIndex].push(newElement)
        return true
      }
      
      // Search in children
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (const childArray of el.children) {
            if (addToNestedRow(childArray)) return true
          }
        } else if (Array.isArray(el.children)) {
          // Single array
          if (addToNestedRow(el.children)) return true
        }
      }
    }
    return false
  }
  
  if (addToNestedRow(newElements)) {
    elements.value = newElements
    
    // Auto-select the new element
    nextTick(() => {
      selectedElement.value = { ...newElement }
      emit('select-element', { ...newElement })
    })
  }
  
  // Clear drop target
  dropTargetColumn.value = null
}

// Delete nested element while maintaining parent structure
const deleteNestedElement = (parentId, columnIndex, childIndex) => {
  const parentIndex = elements.value.findIndex(el => el.id === parentId)
  if (parentIndex === -1) return
  
  const parent = elements.value[parentIndex]
  
  // Ensure children structure exists
  if (!parent.children) return
  
  if (columnIndex !== null) {
    // Delete from column/row (array of arrays)
    if (Array.isArray(parent.children[columnIndex])) {
      parent.children[columnIndex].splice(childIndex, 1)
      // Keep the empty array to maintain column/row structure
    }
  } else {
    // Delete from section/row (single array)
    if (Array.isArray(parent.children)) {
      parent.children.splice(childIndex, 1)
    }
  }
  
  // Force reactivity update with deep clone
  elements.value = JSON.parse(JSON.stringify(elements.value))
  
  // Deselect if deleted element was selected
  if (selectedElement.value) {
    let stillExists = false
    
    if (columnIndex !== null && parent.children[columnIndex]) {
      stillExists = parent.children[columnIndex].some(el => el.id === selectedElement.value.id)
    } else if (Array.isArray(parent.children)) {
      stillExists = parent.children.some(el => el.id === selectedElement.value.id)
    }
    
    if (!stillExists) {
      selectedElement.value = null
      emit('select-element', null)
    }
  }
}

// Delete deeply nested element (for elements inside nested columns/rows)
const deleteNestedElementDeep = (parentId, columnIndex, childIndex) => {
  // Recursive function to find and delete from deeply nested structure
  const findAndDelete = (elementsArray) => {
    for (let i = 0; i < elementsArray.length; i++) {
      const el = elementsArray[i]
      
      // Check if this is the parent we're looking for
      if (el.id === parentId) {
        // Ensure children structure exists
        if (!el.children || !Array.isArray(el.children[columnIndex])) {
          return false
        }
        
        // Delete the child at the specified index
        el.children[columnIndex].splice(childIndex, 1)
        
        // Deselect if it was selected
        if (selectedElement.value?.id === deletedElement?.id) {
          selectedElement.value = null
          emit('select-element', null)
        }
        
        return true
      }
      
      // Search recursively in children
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (let j = 0; j < el.children.length; j++) {
            if (findAndDelete(el.children[j])) {
              return true
            }
          }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row)
          if (findAndDelete(el.children)) {
            return true
          }
        }
      }
    }
    return false
  }
  
  // Clone, update, and replace
  const newElements = JSON.parse(JSON.stringify(elements.value))
  if (findAndDelete(newElements)) {
    elements.value = newElements
  }
}

// Handle drop at specific index
const onDropAtIndex = (event, index) => {
  event.preventDefault()
  event.stopPropagation()
  
  const data = event.dataTransfer.getData('text/plain')
  if (!data) return
  
  // Check if this is a reorder operation
  if (data.startsWith('reorder:')) {
    const fromIndex = parseInt(data.replace('reorder:', ''))
    if (fromIndex !== index && fromIndex !== index - 1) {
      const newElements = [...elements.value]
      const [movedElement] = newElements.splice(fromIndex, 1)
      const targetIndex = fromIndex < index ? index - 1 : index
      newElements.splice(targetIndex, 0, movedElement)
      elements.value = newElements
      
      nextTick(() => {
        selectedElement.value = { ...movedElement }
        emit('select-element', { ...movedElement })
      })
    }
  } else {
    // Create new element
    const elementType = data
    const newElement = {
      id: Date.now(),
      type: elementType,
      props: getDefaultProps(elementType),
      style: getDefaultStyle(elementType)
    }
    
    // Initialize children for layout elements
    if (['columns2', 'columns3', 'columns4', 'row2', 'row3', 'row4'].includes(elementType)) {
      const count = elementType.includes('columns') ? parseInt(elementType.replace('columns', '')) : parseInt(elementType.replace('row', ''))
      newElement.children = Array.from({ length: count }, () => [])
    }
    
    // Insert at specific index
    const newElements = [...elements.value]
    newElements.splice(index, 0, newElement)
    elements.value = newElements
    
    // Auto-select the new element with nextTick
    nextTick(() => {
      selectedElement.value = { ...newElement }
      emit('select-element', { ...newElement })
    })
  }
  
  // Reset all drag state
  dropIndex.value = null
  isDragging.value = false
  dragCounter.value = 0
  draggedElementIndex.value = null
}
// Duplicate element
const duplicateElement = (index) => {
  const element = elements.value[index]
  const newElement = JSON.parse(JSON.stringify(element))
  newElement.id = Date.now()
  const newElements = [...elements.value]
  newElements.splice(index + 1, 0, newElement)
  elements.value = newElements
  
  nextTick(() => {
        if (window.innerWidth > 768) {
          selectedElement.value = { ...newElement }
          emit('select-element', { ...newElement })
        }
  })
}
// Move element to top
const moveToTop = (index) => {
  if (index > 0) {
    const newElements = [...elements.value]
    const element = newElements.splice(index, 1)[0]
    newElements.unshift(element)
    elements.value = newElements
  }
}

// Move element up
const moveUp = (index) => {
  if (index > 0) {
    const newElements = [...elements.value]
    const temp = newElements[index]
    newElements[index] = newElements[index - 1]
    newElements[index - 1] = temp
    elements.value = newElements
  }
}

// Move element down
const moveDown = (index) => {
  if (index < elements.value.length - 1) {
    const newElements = [...elements.value]
    const temp = newElements[index]
    newElements[index] = newElements[index + 1]
    newElements[index + 1] = temp
    elements.value = newElements
  }
}

// Move element to bottom
const moveToBottom = (index) => {
  if (index < elements.value.length - 1) {
    const newElements = [...elements.value]
    const element = newElements.splice(index, 1)[0]
    newElements.push(element)
    elements.value = newElements
  }
}

// Delete element
const deleteElement = (index) => {
  const newElements = [...elements.value]
  newElements.splice(index, 1)
  elements.value = newElements
  
  // Select previous or next element
  if (newElements.length > 0) {
    const newIndex = index > 0 ? index - 1 : 0
    if (newElements[newIndex]) {
      nextTick(() => {
        selectedElement.value = { ...newElements[newIndex] }
        emit('select-element', { ...newElements[newIndex] })
      })
    } else {
      selectedElement.value = null
      emit('select-element', null)
    }
  } else {
    selectedElement.value = null
    emit('select-element', null)
  }
}


</script>

<style>
/* ========== Email Builder Canvas - Clean Professional Design ========== */
/* Email Frame */
.email-canvas-container {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 20px rgba(0,0,0,0.06);
}


/* ========== Element Toolbar ========== */

.element-toolbar {
  position: absolute;
  top: -38px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(to bottom, #45C895 0%, #45C895 50%, #86D41F 100%) !important;
  color: white;
  padding: 6px 10px;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
  z-index: 10;
  white-space: nowrap;
  z-index:999999 !important
}

/* Toolbar Label */
.toolbar-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.3px;
}

.toolbar-label i {
  font-size: 11px;
}

/* Toolbar Actions */
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid rgba(255,255,255,0.2);
  z-index:999999 !important
}

.toolbar-actions button {
  padding: 4px 5px;
  border-radius: 3px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index:999999 !important
}

.toolbar-actions button:hover:not(:disabled) {
  background: rgba(255,255,255,0.2);
}

.toolbar-actions button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-actions button.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

.toolbar-actions button i {
  font-size: 11px;
}

/* Toolbar Divider */
.toolbar-divider {
  width: 1px;
  height: 14px;
  background: rgba(255,255,255,0.25);
  margin: 0 2px;
}


/* ========== Toast Animation ========== */

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ========== HTML Element Containers ========== */

.html-container,
.html-nested-container,
.html-child-container {
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  isolation: isolate;
}

.html-iframe {
  display: block;
  width: 100%;
  border: none;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.html-content,
.html-nested-content,
.html-child-content {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: block;
}

.html-container style,
.html-nested-container style,
.html-child-container style {
  display: none;
}
</style>
