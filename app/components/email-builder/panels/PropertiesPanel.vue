<template>
  <div class="h-full flex flex-col bg-slate-50">
    <!-- Header -->
    <div class="p-3 border-b border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div
            class="w-9 h-9 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-md"
          >
            <i class="bi bi-sliders2 text-white text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-slate-800 truncate">
              {{
                selectedElement
                  ? getElementName(selectedElement.type)
                  : "Thuộc Tính"
              }}
            </h3>
            <p class="text-xs text-slate-500 truncate">
              {{
                selectedElement
                  ? "Chỉnh sửa thuộc tính phần tử"
                  : "Chọn phần tử để chỉnh sửa"
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="!isMobile"
            @click="$emit('toggle-panel')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Thu gọn"
          >
            <i class="bi bi-chevron-right text-sm"></i>
          </button>
          <button
            v-if="isMobile"
            @click="$emit('close-panel')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="bi bi-x-lg text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-slate-200">
      <div class="flex p-1 gap-1">
        <button
          @click="activeTab = 'element'"
          :class="[
            'flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
            activeTab === 'element'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
          ]"
        >
          <i class="bi bi-puzzle text-xs"></i>
          Phần tử
        </button>
        <button
          @click="activeTab = 'global'"
          :class="[
            'flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
            activeTab === 'global'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
          ]"
        >
          <i class="bi bi-gear text-xs"></i>
          Cài đặt chung
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Element Properties Tab -->
      <div v-if="activeTab === 'element'">
        <div
          v-if="!selectedElement"
          class="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
          <div
            class="w-14 h-14 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-3 shadow-inner"
          >
            <i class="bi bi-cursor text-xl text-slate-400"></i>
          </div>
          <h4 class="text-sm font-medium text-slate-700 mb-1">
            Chưa chọn phần tử
          </h4>
          <p class="text-xs text-slate-500 max-w-[200px]">
            Nhấp vào phần tử trên canvas để chỉnh sửa
          </p>
        </div>

        <div v-else class="p-3 space-y-2">
          <!-- Content Properties -->
          <div v-if="hasContentProp" class="prop-section">
            <button
              @click="toggleSection('content')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-blue-500">
                  <i class="bi bi-type"></i>
                </div>
                <span>Nội dung</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.content
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.content" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Văn bản</label>
                <textarea
                  v-model="localElement.props.children"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="3"
                  placeholder="Nhập văn bản..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- URL Properties -->
          <div v-if="hasUrlProp" class="prop-section">
            <button @click="toggleSection('url')" class="prop-section-header">
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-emerald-500">
                  <i class="bi bi-link-45deg"></i>
                </div>
                <span>Liên kết</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.url ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.url" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">URL</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <!-- Social Properties -->
          <div
            v-if="selectedElement.type.startsWith('social-')"
            class="prop-section"
          >
            <button
              @click="toggleSection('social')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-pink-500">
                  <i class="bi bi-share"></i>
                </div>
                <span>Mạng xã hội</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.social ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.social" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Nền tảng</label>
                <select
                  v-model="localElement.type"
                  @change="updateSocialType"
                  class="prop-select"
                >
                  <option value="social-facebook">Facebook</option>
                  <option value="social-twitter">Twitter</option>
                  <option value="social-instagram">Instagram</option>
                  <option value="social-linkedin">LinkedIn</option>
                  <option value="social-youtube">YouTube</option>
                  <option value="social-tiktok">TikTok</option>
                </select>
              </div>
              <div class="prop-field">
                <label class="prop-label">Đường dẫn</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  :placeholder="getSocialPlaceholder(localElement.type)"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Văn bản hiển thị</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Theo dõi chúng tôi"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Kích thước icon</label>
                <select
                  v-model="localElement.style.fontSize"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="16px">Nhỏ (16px)</option>
                  <option value="20px">Vừa (20px)</option>
                  <option value="24px">Lớn (24px)</option>
                  <option value="32px">Rất lớn (32px)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- HTML Properties -->
          <div v-if="selectedElement.type === 'html'" class="prop-section">
            <button @click="toggleSection('html')" class="prop-section-header">
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-orange-500">
                  <i class="bi bi-code-slash"></i>
                </div>
                <span>Mã HTML</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.html ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.html" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Mã HTML</label>
                <textarea
                  v-model="localElement.props.children"
                  @input="updateElement"
                  class="prop-textarea font-mono text-xs"
                  rows="8"
                  placeholder="<p>Your HTML code here</p>"
                ></textarea>
              </div>
              <!-- HTML Editor Modal Button -->
              <div class="prop-field mb-3">
                <button
                  @click="openHtmlEditor"
                  class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-sm"
                >
                  <i class="bi bi-window-stack mr-2"></i>
                  HTML Editor
                </button>
              </div>
              <!-- AI HTML Generator Button -->
              <!-- <div class="prop-field mb-3">
                <AiHtmlGenerator @apply="applyAiHtml" />
                <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <i class="bi bi-info-circle"></i>
                  Tạo tự động HTML theo yêu cầu
                </p>
              </div> -->
            </div>
          </div>

          <!-- Custom Element Properties -->
          <div v-if="isCustomElement">
            <!-- CTA Block -->
            <div
              v-if="selectedElement.type === 'cta-block'"
              class="prop-section"
            >
              <button
                @click="toggleSection('ctaBlock')"
                class="prop-section-header"
              >
                <div class="flex items-center gap-2">
                  <div class="prop-icon bg-violet-500">
                    <i class="bi bi-megaphone"></i>
                  </div>
                  <span>CTA Block</span>
                </div>
                <i
                  :class="[
                    'bi transition-transform duration-200',
                    expandedSections.ctaBlock
                      ? 'bi-chevron-up'
                      : 'bi-chevron-down',
                  ]"
                ></i>
              </button>
              <div v-show="expandedSections.ctaBlock" class="prop-section-body">
                <div class="prop-field">
                  <label class="prop-label">Tiêu đề</label>
                  <input
                    v-model="localElement.props.children"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Kêu gọi hành động"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Mô tả</label>
                  <textarea
                    v-model="localElement.props.description"
                    @input="updateElement"
                    class="prop-textarea"
                    rows="2"
                    placeholder="Mô tả ngắn..."
                  ></textarea>
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Văn bản nút</label>
                    <input
                      v-model="localElement.props.buttonText"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="Bắt đầu"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Đường dẫn</label>
                    <input
                      v-model="localElement.props.href"
                      @input="updateElement"
                      type="url"
                      class="prop-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <!-- Alignment -->
                <div class="prop-divider"></div>
                <AlignmentControl
                  v-model="localElement.props.align"
                  @update:modelValue="updateElement"
                  :default-align="'center'"
                />

                <!-- Typography -->
                <FontSizeControl
                  v-model="localElement.props.fontSize"
                  @update:modelValue="updateElement"
                  :sizes="['16px', '18px', '20px', '24px']"
                  :default-size="'20px'"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.fontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.fontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>

                <!-- Colors -->
                <div class="prop-divider"></div>
                <ColorGridControl
                  :colors="[
                    { label: 'Nền', prop: 'bgColor', default: '#4f46e5' },
                    {
                      label: 'Tiêu đề',
                      prop: 'titleColor',
                      default: '#ffffff',
                    },
                    { label: 'Nút', prop: 'buttonBgColor', default: '#ffffff' },
                    {
                      label: 'Chữ nút',
                      prop: 'buttonTextColor',
                      default: '#4f46e5',
                    },
                  ]"
                  :element-props="localElement.props"
                  @update="updateElement"
                />
              </div>
            </div>

            <!-- Testimonial -->
            <div
              v-if="selectedElement.type === 'testimonial'"
              class="prop-section"
            >
              <button
                @click="toggleSection('testimonial')"
                class="prop-section-header"
              >
                <div class="flex items-center gap-2">
                  <div class="prop-icon bg-amber-500">
                    <i class="bi bi-chat-quote"></i>
                  </div>
                  <span>Đánh giá</span>
                </div>
                <i
                  :class="[
                    'bi transition-transform duration-200',
                    expandedSections.testimonial
                      ? 'bi-chevron-up'
                      : 'bi-chevron-down',
                  ]"
                ></i>
              </button>
              <div
                v-show="expandedSections.testimonial"
                class="prop-section-body"
              >
                <div class="prop-field">
                  <label class="prop-label">Nhận xét</label>
                  <textarea
                    v-model="localElement.props.children"
                    @input="updateElement"
                    class="prop-textarea"
                    rows="3"
                    placeholder="Sản phẩm tuyệt vời!"
                  ></textarea>
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Tác giả</label>
                    <input
                      v-model="localElement.props.author"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="Tên khách hàng"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Chức vụ</label>
                    <input
                      v-model="localElement.props.role"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="CEO, Công ty ABC"
                    />
                  </div>
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Avatar URL</label>
                    <input
                      v-model="localElement.props.avatar"
                      @input="updateElement"
                      type="url"
                      class="prop-input"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="prop-field">
                    <RatingControl
                      v-model="localElement.props.rating"
                      @update:modelValue="updateElement"
                      :max="5"
                      :default-rating="5"
                    />
                  </div>
                </div>

                <!-- Alignment & Typography -->
                <div class="prop-divider"></div>
                <AlignmentControl
                  v-model="localElement.props.align"
                  @update:modelValue="updateElement"
                  :default-align="'center'"
                />
                <FontSizeControl
                  v-model="localElement.props.fontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.fontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.fontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>

                <!-- Colors -->
                <div class="prop-divider"></div>
                <ColorGridControl
                  :colors="[
                    { label: 'Nền', prop: 'bgColor', default: '#ffffff' },
                    { label: 'Chữ', prop: 'textColor', default: '#374151' },
                    { label: 'Sao', prop: 'starColor', default: '#f59e0b' },
                    {
                      label: 'Viền trái',
                      prop: 'borderColor',
                      default: '#3b82f6',
                    },
                  ]"
                  :element-props="localElement.props"
                  @update="updateElement"
                />
              </div>
            </div>

            <!-- Product Card -->
            <div
              v-if="selectedElement.type === 'product-card'"
              class="prop-section"
            >
              <button
                @click="toggleSection('productCard')"
                class="prop-section-header"
              >
                <div class="flex items-center gap-2">
                  <div class="prop-icon bg-cyan-500">
                    <i class="bi bi-box-seam"></i>
                  </div>
                  <span>Sản phẩm</span>
                </div>
                <i
                  :class="[
                    'bi transition-transform duration-200',
                    expandedSections.productCard
                      ? 'bi-chevron-up'
                      : 'bi-chevron-down',
                  ]"
                ></i>
              </button>
              <div
                v-show="expandedSections.productCard"
                class="prop-section-body"
              >
                <div class="prop-field">
                  <label class="prop-label">Tên sản phẩm</label>
                  <input
                    v-model="localElement.props.children"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Tên sản phẩm"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Mô tả</label>
                  <textarea
                    v-model="localElement.props.description"
                    @input="updateElement"
                    class="prop-textarea"
                    rows="2"
                    placeholder="Mô tả ngắn..."
                  ></textarea>
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Giá</label>
                    <input
                      v-model="localElement.props.price"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="$99"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Giá gốc</label>
                    <input
                      v-model="localElement.props.originalPrice"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="$129"
                    />
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Hình ảnh</label>
                  <input
                    v-model="localElement.props.image"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="https://..."
                  />
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <RatingControl
                      v-model="localElement.props.rating"
                      @update:modelValue="updateElement"
                      :max="5"
                      :default-rating="5"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Số đánh giá</label>
                    <input
                      v-model.number="localElement.props.reviews"
                      @input="updateElement"
                      type="number"
                      class="prop-input"
                      placeholder="128"
                    />
                  </div>
                </div>
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Badge</label>
                    <input
                      v-model="localElement.props.badge"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="Hot, Sale..."
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Giảm giá %</label>
                    <input
                      v-model.number="localElement.props.discount"
                      @input="updateElement"
                      type="number"
                      class="prop-input"
                      placeholder="20"
                    />
                  </div>
                </div>
                <CheckboxControl
                  v-model="localElement.props.inStock"
                  @update:modelValue="updateElement"
                  label="Còn hàng"
                />
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Văn bản nút</label>
                    <input
                      v-model="localElement.props.buttonText"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="Mua ngay"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Link</label>
                    <input
                      v-model="localElement.props.href"
                      @input="updateElement"
                      type="url"
                      class="prop-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <!-- Alignment & Typography -->
                <div class="prop-divider"></div>
                <AlignmentControl
                  v-model="localElement.props.align"
                  @update:modelValue="updateElement"
                  :default-align="'center'"
                />
                <FontSizeControl
                  v-model="localElement.props.fontSize"
                  @update:modelValue="updateElement"
                  :sizes="['18px', '20px', '22px', '24px', '28px']"
                  :default-size="'22px'"
                />

                <!-- Colors -->
                <div class="prop-divider"></div>
                <ColorGridControl
                  :colors="[
                    { label: 'Nền', prop: 'bgColor', default: '#ffffff' },
                    { label: 'Chữ', prop: 'textColor', default: '#1f2937' },
                    { label: 'Giá', prop: 'priceColor', default: '#2563eb' },
                    { label: 'Nút', prop: 'buttonBgColor', default: '#2563eb' },
                  ]"
                  :element-props="localElement.props"
                  @update="updateElement"
                />
              </div>
            </div>

            <!-- Header -->
            <div v-if="selectedElement.type === 'header'" class="prop-section">
              <button
                @click="toggleSection('header')"
                class="prop-section-header"
              >
                <div class="flex items-center gap-2">
                  <div class="prop-icon bg-indigo-600">
                    <i class="bi bi-layout-text-window"></i>
                  </div>
                  <span>Header</span>
                </div>
                <i
                  :class="[
                    'bi transition-transform duration-200',
                    expandedSections.header
                      ? 'bi-chevron-up'
                      : 'bi-chevron-down',
                  ]"
                ></i>
              </button>
              <div v-show="expandedSections.header" class="prop-section-body">
                <!-- Logo -->
                <ImagePreviewControl
                  v-model="localElement.props.logo"
                  @update:modelValue="updateElement"
                  label="Logo"
                  placeholder="https://example.com/logo.png"
                  alt-text="Logo"
                />

                <!-- Company Name & Tagline -->
                <div class="prop-field">
                  <label class="prop-label">Tên công ty</label>
                  <input
                    v-model="localElement.props.companyName"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Your Company"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Tagline / Slogan</label>
                  <input
                    v-model="localElement.props.tagline"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Your tagline here"
                  />
                </div>

                <!-- Layout Options -->
                <div class="prop-divider"></div>
                <div class="prop-field">
                  <label class="prop-label">Bố cục Logo & Tên</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.headerLayout = 'inline';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1',
                        (localElement.props.headerLayout || 'inline') ===
                        'inline'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-layout-split"></i> Cùng hàng
                    </button>
                    <button
                      @click="
                        localElement.props.headerLayout = 'stacked';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1',
                        localElement.props.headerLayout === 'stacked'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-layout-three-columns"></i> Xếp chồng
                    </button>
                  </div>
                </div>

                <!-- Alignment -->
                <AlignmentControl
                  v-model="localElement.props.logoPosition"
                  @update:modelValue="updateElement"
                  :default-align="'center'"
                />

                <!-- Navigation Links -->
                <div class="prop-divider"></div>
                <div class="flex items-center justify-between mb-2">
                  <CheckboxControl
                    v-model="localElement.props.showNav"
                    @update:modelValue="updateElement"
                    label="Menu điều hướng"
                  />
                  <button @click="addNavLink" class="prop-btn prop-btn-primary">
                    <i class="bi bi-plus text-xs"></i>
                  </button>
                </div>

                <div v-if="localElement.props.showNav" class="space-y-2">
                  <!-- Nav Alignment -->
                  <AlignmentControl
                    v-model="localElement.props.navAlign"
                    @update:modelValue="updateElement"
                    :default-align="'center'"
                    label="Căn chỉnh menu"
                  />

                  <!-- Nav Links List -->
                  <LinkListControl
                    v-model="localElement.props.navLinks"
                    @update:modelValue="updateElement"
                    label="Menu điều hướng"
                    text-placeholder="Tên link"
                    url-placeholder="URL"
                    empty-message="Chưa có link menu"
                  />
                </div>

                <!-- Colors -->
                <div class="prop-divider"></div>
                <ColorGridControl
                  :colors="[
                    {
                      label: 'Tên công ty',
                      prop: 'textColor',
                      default: '#ffffff',
                    },
                    {
                      label: 'Tagline',
                      prop: 'taglineColor',
                      default: '#d1d5db',
                    },
                    {
                      label: 'Link menu',
                      prop: 'linkColor',
                      default: '#60a5fa',
                    },
                  ]"
                  :element-props="localElement.props"
                  @update="updateElement"
                />
              </div>
            </div>

            <!-- Footer -->
            <div v-if="selectedElement.type === 'footer'" class="prop-section">
              <button
                @click="toggleSection('footer')"
                class="prop-section-header"
              >
                <div class="flex items-center gap-2">
                  <div class="prop-icon bg-slate-600">
                    <i class="bi bi-layout-text-window-reverse"></i>
                  </div>
                  <span>Footer</span>
                </div>
                <i
                  :class="[
                    'bi transition-transform duration-200',
                    expandedSections.footer
                      ? 'bi-chevron-up'
                      : 'bi-chevron-down',
                  ]"
                ></i>
              </button>
              <div v-show="expandedSections.footer" class="prop-section-body">
                <ImagePreviewControl
                  v-model="localElement.props.logo"
                  @update:modelValue="updateElement"
                  label="Logo công ty"
                  placeholder="https://example.com/logo.png"
                  alt-text="Logo công ty"
                />
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Tên công ty</label>
                    <input
                      v-model="localElement.props.companyName"
                      @input="updateElement"
                      type="text"
                      class="prop-input"
                      placeholder="Your Company"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Email</label>
                    <input
                      v-model="localElement.props.email"
                      @input="updateElement"
                      type="email"
                      class="prop-input"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Địa chỉ</label>
                  <textarea
                    v-model="localElement.props.address"
                    @input="updateElement"
                    class="prop-textarea"
                    rows="2"
                    placeholder="123 Business St, City"
                  ></textarea>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Điện thoại</label>
                  <input
                    v-model="localElement.props.phone"
                    @input="updateElement"
                    type="tel"
                    class="prop-input"
                    placeholder="+84 123 456 789"
                  />
                </div>

                <!-- Social Links -->
                <div class="pt-2 border-t border-slate-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-slate-700"
                      >Mạng xã hội</span
                    >
                    <button
                      @click="addFooterSocial"
                      class="prop-btn prop-btn-primary"
                    >
                      <i class="bi bi-plus text-xs"></i> Thêm
                    </button>
                  </div>
                  <div
                    v-if="
                      localElement.props.socials &&
                      localElement.props.socials.length > 0
                    "
                    class="prop-grid-2 mb-2"
                  >
                    <SelectControl
                      v-model="localElement.props.socialIconStyle"
                      @update:modelValue="updateElement"
                      label="Kiểu icon"
                      :options="[
                        { value: 'square', label: 'Vuông' },
                        { value: 'rounded', label: 'Bo góc' },
                        { value: 'circle', label: 'Tròn' },
                      ]"
                      :default-value="'circle'"
                    />
                    <SelectControl
                      v-model="localElement.props.socialIconSize"
                      @update:modelValue="updateElement"
                      label="Kích thước"
                      :options="[
                        { value: 'small', label: 'Nhỏ' },
                        { value: 'medium', label: 'Vừa' },
                        { value: 'large', label: 'Lớn' },
                      ]"
                      :default-value="'medium'"
                    />
                  </div>
                  <div
                    v-if="
                      !localElement.props.socials ||
                      localElement.props.socials.length === 0
                    "
                    class="text-xs text-slate-400 italic py-2 text-center"
                  >
                    Chưa có liên kết MXH
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(social, index) in localElement.props.socials"
                      :key="index"
                      class="prop-item-card"
                    >
                      <div class="prop-item-header">
                        <select
                          v-model="social.platform"
                          @change="updateElement"
                          class="prop-select flex-1"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                        <button
                          @click="removeFooterSocial(index)"
                          class="prop-btn prop-btn-danger"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                      <input
                        v-model="social.url"
                        @input="updateElement"
                        type="url"
                        class="prop-input"
                        placeholder="URL trang cá nhân"
                      />
                      <input
                        v-model="social.logo"
                        @input="updateElement"
                        type="url"
                        class="prop-input mt-1"
                        placeholder="URL icon (để trống dùng mặc định)"
                      />
                      <div
                        v-if="social.logo"
                        class="mt-1 p-1.5 bg-white border border-slate-200 rounded flex items-center gap-2"
                      >
                        <img
                          :src="social.logo"
                          :alt="social.platform"
                          class="h-6 w-6 object-contain"
                        />
                        <span class="text-xs text-slate-500 truncate flex-1">{{
                          social.logo
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="prop-field">
                  <label class="prop-label">Copyright</label>
                  <input
                    v-model="localElement.props.children"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="© 2024 Company. All rights reserved."
                  />
                </div>
                6yyyytt6y
              </div>
            </div>
          </div>

          <!-- E-commerce: Product Grid -->
          <div
            v-if="selectedElement.type === 'product-grid'"
            class="prop-section"
          >
            <button
              @click="toggleSection('productGrid')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-indigo-500 to-purple-600"
                >
                  <i class="bi bi-grid-3x3-gap"></i>
                </div>
                <span>Lưới sản phẩm</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.productGrid
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.productGrid"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Sản phẩm nổi bật"
                />
              </div>
              <SelectControl
                v-model="localElement.props.columns"
                @update:modelValue="updateElement"
                label="Số cột"
                :options="[
                  { value: 2, label: '2 cột' },
                  { value: 3, label: '3 cột' },
                ]"
                value-type="number"
              />

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <AlignmentControl
                v-model="localElement.props.align"
                @update:modelValue="updateElement"
                :default-align="'center'"
                label="Căn chỉnh tiêu đề"
              />
              <FontSizeControl
                v-model="localElement.props.fontSize"
                @update:modelValue="updateElement"
                :sizes="['16px', '18px', '20px', '24px', '28px', '32px']"
                :default-size="'20px'"
                label="Cỡ chữ tiêu đề"
              />
              <div class="prop-grid-2">
                <FontWeightControl
                  v-model="localElement.props.fontWeight"
                  @update:modelValue="updateElement"
                  :default-weight="'bold'"
                />
                <FontStyleControl
                  v-model="localElement.props.fontStyle"
                  @update:modelValue="updateElement"
                />
              </div>
              <FontFamilyControl
                v-model="localElement.props.fontFamily"
                @update:modelValue="updateElement"
                label="Font chữ"
                display-style="dropdown"
              />

              <!-- Colors Section -->
              <div class="prop-divider"></div>
              <ColorGridControl
                :colors="[
                  { label: 'Tiêu đề', prop: 'titleColor', default: '#1f2937' },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />

              <!-- Icon Controls -->
              <IconControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  urlProp: 'iconUrl',
                  bgProp: 'iconBgColor',
                  urlLabel: 'URL Icon tiêu đề',
                  backgroundLabel: 'Nền icon',
                  urlPlaceholder: 'https://img.icons8.com/...',
                  defaultBgColor: '#dbeafe',
                  showBackground: true,
                }"
              />

              <!-- Card Style Section -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-indigo-600"
                  >Cài đặt Card sản phẩm</label
                >
              </div>

              <!-- Card Colors -->
              <ColorGridControl
                :colors="[
                  {
                    label: 'Nền card',
                    prop: 'cardBgColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Viền card',
                    prop: 'cardBorderColor',
                    default: '#e5e7eb',
                  },
                  {
                    label: 'Tên SP',
                    prop: 'productNameColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Giá hiện tại',
                    prop: 'priceColor',
                    default: '#2563eb',
                  },
                  {
                    label: 'Giá cũ',
                    prop: 'oldPriceColor',
                    default: '#9ca3af',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />

              <!-- Card Border Width -->
              <div class="prop-field">
                <label class="prop-label">Độ dày viền</label>
                <div class="flex gap-1">
                  <button
                    v-for="w in ['0px', '1px', '2px', '3px']"
                    :key="w"
                    @click="
                      localElement.props.cardBorderWidth = w;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.cardBorderWidth || '1px') === w
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ w === "0px" ? "0" : w.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Card Border Radius -->
              <div class="prop-field">
                <label class="prop-label">Bo góc card</label>
                <div class="flex gap-1">
                  <button
                    v-for="r in ['0px', '8px', '12px', '16px', '24px']"
                    :key="r"
                    @click="
                      localElement.props.cardBorderRadius = r;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.cardBorderRadius || '12px') === r
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ r === "0px" ? "0" : r.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Card Padding -->
              <div class="prop-field">
                <label class="prop-label">Padding card</label>
                <div class="flex gap-1">
                  <button
                    v-for="p in ['0', '4px', '8px', '12px', '16px']"
                    :key="p"
                    @click="
                      localElement.props.cardPadding = p;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.cardPadding || '0px') === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ p.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Image Settings -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-indigo-600"
                  >Cài đặt hình ảnh</label
                >
              </div>

              <!-- Image Shape -->
              <div class="prop-field">
                <label class="prop-label">Kiểu hình</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="s in [
                      { v: 'rectangle', l: 'Chữ nhật' },
                      { v: 'circle', l: 'Tròn' },
                    ]"
                    :key="s.v"
                    @click="
                      localElement.props.imageShape = s.v;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.imageShape || 'rectangle') === s.v
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ s.l }}
                  </button>
                </div>
              </div>

              <!-- Image Height -->
              <div class="prop-field">
                <label class="prop-label">Chiều cao ảnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="h in ['100px', '120px', '140px', '160px', '180px']"
                    :key="h"
                    @click="
                      localElement.props.imageHeight = h;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.imageHeight || '140px') === h
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ h.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Image Border Radius -->
              <div class="prop-field">
                <label class="prop-label">Bo góc hình ảnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="r in ['0px', '8px', '12px', '16px']"
                    :key="r"
                    @click="
                      localElement.props.imageBorderRadius = r;
                      updateElement();
                    "
                    :class="[
                      'flex-1 px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.imageBorderRadius || '0px') === r
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ r === "0px" ? "0" : r.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Products List -->
              <div class="prop-divider"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="prop-label">Sản phẩm</span>
                <button @click="addProduct" class="prop-btn prop-btn-primary">
                  <i class="bi bi-plus text-xs"></i> Thêm
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(p, i) in localElement.props.products"
                  :key="i"
                  class="prop-item-card"
                >
                  <div class="prop-item-header">
                    <span class="text-xs font-semibold text-slate-600"
                      >Sản Phẩm {{ i + 1 }}</span
                    >
                    <button
                      @click="removeProduct(i)"
                      class="prop-btn prop-btn-danger"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <input
                    v-model="p.name"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Tên sản phẩm"
                  />
                  <div class="prop-grid-2">
                    <input
                      v-model="p.price"
                      @input="updateElement"
                      class="prop-input"
                      placeholder="Giá mới"
                    />
                    <input
                      v-model="p.oldPrice"
                      @input="updateElement"
                      class="prop-input"
                      placeholder="Giá cũ"
                    />
                  </div>
                  <input
                    v-model="p.image"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="URL ảnh"
                  />
                  <input
                    v-model="p.url"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="Link sản phẩm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- E-commerce: Coupon Code -->
          <div
            v-if="selectedElement.type === 'coupon-code'"
            class="prop-section"
          >
            <button
              @click="toggleSection('couponCode')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-amber-500 to-orange-600"
                >
                  <i class="bi bi-ticket-perforated"></i>
                </div>
                <span>Mã giảm giá</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.couponCode
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.couponCode" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Mã coupon</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input font-mono tracking-wider"
                  placeholder="SUMMER2024"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Badge</label>
                  <input
                    v-model="localElement.props.discount"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Giảm 20%"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Hạn sử dụng</label>
                  <input
                    v-model="localElement.props.expiryDate"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="31/12/2024"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Điều kiện</label>
                <input
                  v-model="localElement.props.description"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Đơn tối thiểu 500K"
                />
              </div>

              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#fef3c7',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#fef3c7'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Viền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.borderColor || '#f59e0b',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.borderColor || '#f59e0b'"
                        @input="
                          localElement.props.borderColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.borderColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Màu mã</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.codeColor || '#d97706',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.codeColor || '#d97706'"
                        @input="
                          localElement.props.codeColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.codeColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>

              <!-- Icon Controls -->
              <IconControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  urlProp: 'iconUrl',
                  bgProp: 'iconBgColor',
                  urlLabel: 'URL Icon',
                  backgroundLabel: 'Nền icon',
                  urlPlaceholder: 'https://img.icons8.com/...',
                  defaultBgColor: '#f59e0b',
                  showBackground: true,
                }"
              />
            </div>
          </div>

          <!-- E-commerce: Cart Reminder -->
          <div
            v-if="selectedElement.type === 'cart-reminder'"
            class="prop-section"
          >
            <button
              @click="toggleSection('cartReminder')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-rose-500 to-pink-600"
                >
                  <i class="bi bi-cart3"></i>
                </div>
                <span>Nhắc giỏ hàng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.cartReminder
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.cartReminder"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Bạn đã quên giỏ hàng!"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Phụ đề</label>
                <input
                  v-model="localElement.props.subtitle"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Hoàn tất đơn hàng ngay"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Văn bản nút</label>
                  <input
                    v-model="localElement.props.buttonText"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Mua ngay"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Bo góc nút</label>
                  <input
                    v-model="localElement.props.buttonRadius"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="8px"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Link nút</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh tiêu đề</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      localElement.props.align === align ||
                      (!localElement.props.align && align === 'center')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['18px', '20px', '24px', '28px', '32px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '28px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Font Weight & Style -->
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#fff1f2',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#fff1f2'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền nút</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.buttonBgColor || '#e11d48',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.buttonBgColor || '#e11d48'"
                        @input="
                          localElement.props.buttonBgColor =
                            $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.buttonBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ nút</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.buttonTextColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.buttonTextColor || '#ffffff'"
                        @input="
                          localElement.props.buttonTextColor =
                            $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.buttonTextColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
              <IconControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  urlProp: 'iconUrl',
                  bgProp: 'iconBgColor',
                  urlLabel: 'URL Icon',
                  backgroundLabel: 'Nền icon',
                  urlPlaceholder: 'https://img.icons8.com/...',
                  defaultBgColor: '#fed7aa',
                  showBackground: true,
                }"
              />
            </div>
          </div>

          <!-- E-commerce: Order Summary -->
          <div
            v-if="selectedElement.type === 'order-summary'"
            class="prop-section"
          >
            <button
              @click="toggleSection('orderSummary')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-emerald-500 to-teal-600"
                >
                  <i class="bi bi-receipt"></i>
                </div>
                <span>Tổng đơn hàng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.orderSummary
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.orderSummary"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Đơn hàng #12345"
                />
              </div>

              <!-- Order Items -->
              <div class="prop-divider"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="prop-label">Sản phẩm</span>
                <button @click="addOrderItem" class="prop-btn prop-btn-primary">
                  <i class="bi bi-plus text-xs"></i> Thêm
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(item, i) in localElement.props.items"
                  :key="i"
                  class="prop-item-card"
                >
                  <div class="prop-item-header">
                    <button
                      @click="removeOrderItem(i)"
                      class="prop-btn prop-btn-danger"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <input
                    v-model="item.name"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="Tên sản phẩm"
                  />
                  <div class="prop-grid-2">
                    <input
                      v-model="item.quantity"
                      @input="updateElement"
                      type="number"
                      class="prop-input"
                      placeholder="SL"
                      min="1"
                    />
                    <input
                      v-model="item.price"
                      @input="updateElement"
                      class="prop-input"
                      placeholder="Đơn giá"
                    />
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="prop-divider"></div>
              <div class="space-y-2 bg-slate-50 rounded-xl p-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Tạm tính</span>
                  <input
                    v-model="localElement.props.subtotal"
                    @input="updateElement"
                    class="w-28 px-2 py-1 text-xs text-right border border-slate-200 rounded-lg"
                    placeholder="597.000đ"
                  />
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-500">Phí ship</span>
                  <input
                    v-model="localElement.props.shipping"
                    @input="updateElement"
                    class="w-28 px-2 py-1 text-xs text-right border border-slate-200 rounded-lg"
                    placeholder="30.000đ"
                  />
                </div>
                <div
                  class="flex justify-between items-center pt-2 border-t border-slate-200"
                >
                  <span class="text-xs font-bold text-slate-700"
                    >Tổng cộng</span
                  >
                  <input
                    v-model="localElement.props.total"
                    @input="updateElement"
                    class="w-28 px-2 py-1 text-xs text-right font-bold border border-slate-200 rounded-lg"
                    placeholder="627.000đ"
                  />
                </div>
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh tiêu đề</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      localElement.props.align === align ||
                      (!localElement.props.align && align === 'left')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tổng tiền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.totalColor || '#059669',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.totalColor || '#059669'"
                        @input="
                          localElement.props.totalColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.totalColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Viền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.borderColor || '#e5e7eb',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.borderColor || '#e5e7eb'"
                        @input="
                          localElement.props.borderColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.borderColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
              <IconControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  urlProp: 'iconUrl',
                  bgProp: 'iconBgColor',
                  urlLabel: 'URL Icon',
                  backgroundLabel: 'Nền icon',
                  urlPlaceholder: 'https://img.icons8.com/...',
                  defaultBgColor: '#dbeafe',
                  showBackground: true,
                }"
              />
            </div>
          </div>

          <!-- Real Estate: Property Card -->
          <div
            v-if="selectedElement.type === 'property-card'"
            class="prop-section"
          >
            <button
              @click="toggleSection('propertyCard')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-linear-to-br from-sky-500 to-blue-600">
                  <i class="bi bi-house-door"></i>
                </div>
                <span>Bất động sản</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.propertyCard
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.propertyCard"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tên BĐS</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Căn hộ cao cấp 2PN"
                />
              </div>

              <!-- Image Settings -->
              <div class="prop-divider"></div>
              <span class="text-xs font-semibold text-slate-700 mb-2 block"
                >Hình ảnh</span
              >
              <div class="prop-field">
                <label class="prop-label">URL Hình ảnh</label>
                <input
                  v-model="localElement.props.image"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Chiều cao hình (px)</label>
                <div class="flex gap-1">
                  <input
                    v-model="localElement.props.imageHeight"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="200px"
                  />
                  <select
                    v-model="localElement.props.imageShape"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="rectangle">Chữ nhật</option>
                    <option value="rounded">Bo góc</option>
                  </select>
                </div>
              </div>

              <div class="prop-divider"></div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Giá</label>
                  <input
                    v-model="localElement.props.price"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="2.5 tỷ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Giảm giá %</label>
                  <input
                    v-model.number="localElement.props.discount"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="10"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Badge</label>
                  <input
                    v-model="localElement.props.badge"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Hot"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Vị trí</label>
                  <input
                    v-model="localElement.props.location"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Quận 7, TP.HCM"
                  />
                </div>
              </div>

              <!-- Specs -->
              <div class="prop-divider"></div>
              <div class="prop-grid-3">
                <div class="prop-field">
                  <label class="prop-label">Diện tích</label>
                  <input
                    v-model="localElement.props.area"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="85m²"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Phòng ngủ</label>
                  <input
                    v-model.number="localElement.props.bedrooms"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="2"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Phòng tắm</label>
                  <input
                    v-model.number="localElement.props.bathrooms"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="2"
                  />
                </div>
              </div>

              <div class="prop-field">
                <label class="prop-label">Link chi tiết</label>
                <input
                  v-model="localElement.props.url"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Icon Settings for 4 specs -->
              <div class="prop-divider"></div>
              <span class="text-xs font-semibold text-slate-700 mb-2 block"
                >Cấu hình Icon</span
              >

              <!-- Location Icon -->
              <div class="p-3 bg-slate-50 rounded-lg space-y-2 mb-2">
                <span class="text-xs font-medium text-slate-600"
                  >Icon Vị trí</span
                >
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label text-xs">URL Icon</label>
                    <input
                      v-model="localElement.props.locationIconUrl"
                      @input="updateElement"
                      type="url"
                      class="prop-input text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label text-xs">Màu nền</label>
                    <div class="flex gap-1">
                      <div
                        class="w-8 h-8 rounded border"
                        :style="{
                          backgroundColor:
                            localElement.props.locationIconBgColor || '#fee2e2',
                        }"
                      >
                        <input
                          type="color"
                          :value="
                            localElement.props.locationIconBgColor || '#fee2e2'
                          "
                          @input="
                            localElement.props.locationIconBgColor =
                              $event.target.value;
                            updateElement();
                          "
                          class="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        v-model="localElement.props.locationIconBgColor"
                        @input="updateElement"
                        class="prop-input text-xs flex-1"
                        placeholder="#fee2e2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Area Icon -->
              <div class="p-3 bg-slate-50 rounded-lg space-y-2 mb-2">
                <span class="text-xs font-medium text-slate-600"
                  >Icon Diện tích</span
                >
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label text-xs">URL Icon</label>
                    <input
                      v-model="localElement.props.areaIconUrl"
                      @input="updateElement"
                      type="url"
                      class="prop-input text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label text-xs">Màu nền</label>
                    <div class="flex gap-1">
                      <div
                        class="w-8 h-8 rounded border"
                        :style="{
                          backgroundColor:
                            localElement.props.areaIconBgColor || '#fef3c7',
                        }"
                      >
                        <input
                          type="color"
                          :value="
                            localElement.props.areaIconBgColor || '#fef3c7'
                          "
                          @input="
                            localElement.props.areaIconBgColor =
                              $event.target.value;
                            updateElement();
                          "
                          class="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        v-model="localElement.props.areaIconBgColor"
                        @input="updateElement"
                        class="prop-input text-xs flex-1"
                        placeholder="#fef3c7"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bedrooms Icon -->
              <div class="p-3 bg-slate-50 rounded-lg space-y-2 mb-2">
                <span class="text-xs font-medium text-slate-600"
                  >Icon Phòng ngủ</span
                >
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label text-xs">URL Icon</label>
                    <input
                      v-model="localElement.props.bedroomsIconUrl"
                      @input="updateElement"
                      type="url"
                      class="prop-input text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label text-xs">Màu nền</label>
                    <div class="flex gap-1">
                      <div
                        class="w-8 h-8 rounded border"
                        :style="{
                          backgroundColor:
                            localElement.props.bedroomsIconBgColor || '#e0e7ff',
                        }"
                      >
                        <input
                          type="color"
                          :value="
                            localElement.props.bedroomsIconBgColor || '#e0e7ff'
                          "
                          @input="
                            localElement.props.bedroomsIconBgColor =
                              $event.target.value;
                            updateElement();
                          "
                          class="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        v-model="localElement.props.bedroomsIconBgColor"
                        @input="updateElement"
                        class="prop-input text-xs flex-1"
                        placeholder="#e0e7ff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bathrooms Icon -->
              <div class="p-3 bg-slate-50 rounded-lg space-y-2 mb-2">
                <span class="text-xs font-medium text-slate-600"
                  >Icon Phòng tắm</span
                >
                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label text-xs">URL Icon</label>
                    <input
                      v-model="localElement.props.bathroomsIconUrl"
                      @input="updateElement"
                      type="url"
                      class="prop-input text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label text-xs">Màu nền</label>
                    <div class="flex gap-1">
                      <div
                        class="w-8 h-8 rounded border"
                        :style="{
                          backgroundColor:
                            localElement.props.bathroomsIconBgColor ||
                            '#cffafe',
                        }"
                      >
                        <input
                          type="color"
                          :value="
                            localElement.props.bathroomsIconBgColor || '#cffafe'
                          "
                          @input="
                            localElement.props.bathroomsIconBgColor =
                              $event.target.value;
                            updateElement();
                          "
                          class="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        v-model="localElement.props.bathroomsIconBgColor"
                        @input="updateElement"
                        class="prop-input text-xs flex-1"
                        placeholder="#cffafe"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <span class="text-xs font-semibold text-slate-700 mb-2 block"
                >Kiểu chữ tiêu đề</span
              >
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs transition-all',
                      (localElement.props.align || 'left') === align
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['16px', '18px', '20px', '22px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '22px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || '700') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Giá</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.priceColor || '#dc2626',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.priceColor || '#dc2626'"
                        @input="
                          localElement.props.priceColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.priceColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Estate: Property Features -->
          <div
            v-if="selectedElement.type === 'property-features'"
            class="prop-section"
          >
            <button
              @click="toggleSection('propertyFeatures')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-violet-500 to-purple-600"
                >
                  <i class="bi bi-list-check"></i>
                </div>
                <span>Tiện ích BĐS</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.propertyFeatures
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.propertyFeatures"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Tiện ích nổi bật"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Bố cục</label>
                  <select
                    v-model="localElement.props.layout"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="list">Danh sách</option>
                    <option value="grid">Lưới</option>
                  </select>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Số cột</label>
                  <select
                    v-model.number="localElement.props.columns"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option :value="1">1 cột</option>
                    <option :value="2">2 cột</option>
                    <option :value="3">3 cột</option>
                  </select>
                </div>
              </div>

              <!-- Features List -->
              <div class="prop-divider"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="prop-label">Tiện ích</span>
                <button @click="addFeature" class="prop-btn prop-btn-primary">
                  <i class="bi bi-plus text-xs"></i> Thêm
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(f, i) in localElement.props.features"
                  :key="i"
                  class="flex gap-2 items-center"
                >
                  <input
                    v-model="localElement.props.features[i]"
                    @input="updateElement"
                    class="prop-input flex-1"
                    placeholder="Hồ bơi, Gym, BBQ..."
                  />
                  <button
                    @click="removeFeature(i)"
                    class="prop-btn prop-btn-danger"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh tiêu đề</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      localElement.props.align === align ||
                      (!localElement.props.align && align === 'left')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.textColor || '#4b5563',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.textColor || '#4b5563'"
                        @input="
                          localElement.props.textColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.textColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền icon</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.iconBgColor || '#dcfce7',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.iconBgColor || '#dcfce7'"
                        @input="
                          localElement.props.iconBgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.iconBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>

                <div class="color-grid-item">
                  <span class="color-grid-label">Nền item</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.itemBgColor || '#f9fafb',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.itemBgColor || '#f9fafb'"
                        @input="
                          localElement.props.itemBgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.itemBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>

              <!-- Icon URL -->
              <div class="prop-field">
                <label class="prop-label">URL Icon</label>
                <input
                  v-model="localElement.props.iconUrl"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://img.icons8.com/..."
                />
              </div>
            </div>
          </div>

          <!-- Real Estate: Location Map -->
          <div
            v-if="selectedElement.type === 'location-map'"
            class="prop-section"
          >
            <button
              @click="toggleSection('locationMap')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-green-500 to-emerald-600"
                >
                  <i class="bi bi-geo-alt"></i>
                </div>
                <span>Bản đồ vị trí</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.locationMap
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.locationMap"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Vị trí dự án"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Địa chỉ</label>
                <input
                  v-model="localElement.props.address"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="123 Nguyễn Văn Linh, Q7"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Hình bản đồ</label>
                <input
                  v-model="localElement.props.mapImage"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh tiêu đề</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      localElement.props.align === align ||
                      (!localElement.props.align && align === 'left')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['14px', '16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.textColor || '#4b5563',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.textColor || '#4b5563'"
                        @input="
                          localElement.props.textColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.textColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền icon</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.iconBgColor || '#fee2e2',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.iconBgColor || '#fee2e2'"
                        @input="
                          localElement.props.iconBgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.iconBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>

              <!-- Icon URL -->
              <div class="prop-field">
                <label class="prop-label">URL Icon</label>
                <input
                  v-model="localElement.props.iconUrl"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://img.icons8.com/..."
                />
              </div>
            </div>
          </div>

          <!-- Recruitment: Job Listing -->
          <div
            v-if="selectedElement.type === 'job-listing'"
            class="prop-section"
          >
            <button
              @click="toggleSection('jobListing')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-blue-500 to-cyan-600"
                >
                  <i class="bi bi-briefcase"></i>
                </div>
                <span>Tuyển dụng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.jobListing
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.jobListing" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Vị trí</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Senior Developer"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Công ty</label>
                <input
                  v-model="localElement.props.company"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Tech Company"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Địa điểm</label>
                  <input
                    v-model="localElement.props.location"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="TP.HCM"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Loại hình</label>
                  <select
                    v-model="localElement.props.type"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Lương</label>
                  <input
                    v-model="localElement.props.salary"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="$2000-3000"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Hạn nộp</label>
                  <input
                    v-model="localElement.props.deadline"
                    @input="updateElement"
                    class="prop-input"
                    placeholder="31/12/2024"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Văn bản nút</label>
                  <input
                    v-model="localElement.props.buttonText"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Ứng tuyển ngay"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Link</label>
                  <input
                    v-model="localElement.props.href"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['14px', '16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Icon Settings -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Icon URL (tùy chọn)</label>
                <input
                  v-model="localElement.props.iconUrl"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://example.com/icon.png"
                />
                <p class="text-xs text-gray-400 mt-1">
                  Để trống để dùng icon mặc định
                </p>
              </div>
              <div class="prop-field">
                <label class="prop-label">Màu nền icon</label>
                <div class="flex items-center gap-2">
                  <div
                    class="color-grid-swatch"
                    :style="{
                      backgroundColor:
                        localElement.props.iconBgColor ||
                        localElement.props.buttonBgColor ||
                        '#2563eb',
                    }"
                  >
                    <input
                      type="color"
                      :value="
                        localElement.props.iconBgColor ||
                        localElement.props.buttonBgColor ||
                        '#2563eb'
                      "
                      @input="
                        localElement.props.iconBgColor = $event.target.value;
                        updateElement();
                      "
                    />
                  </div>
                  <input
                    type="text"
                    v-model="localElement.props.iconBgColor"
                    @input="updateElement"
                    class="prop-input flex-1"
                    placeholder="#2563eb"
                  />
                </div>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền nút</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.buttonBgColor || '#3b82f6',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.buttonBgColor || '#3b82f6'"
                        @input="
                          localElement.props.buttonBgColor =
                            $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.buttonBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ nút</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.buttonTextColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.buttonTextColor || '#ffffff'"
                        @input="
                          localElement.props.buttonTextColor =
                            $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.buttonTextColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recruitment: Benefits List -->
          <div
            v-if="selectedElement.type === 'benefits-list'"
            class="prop-section"
          >
            <button
              @click="toggleSection('benefitsList')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-lime-500 to-green-600"
                >
                  <i class="bi bi-gift"></i>
                </div>
                <span>Phúc lợi</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.benefitsList
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.benefitsList"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Quyền lợi nhân viên"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Bố cục</label>
                  <select
                    v-model="localElement.props.layout"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="list">Danh sách</option>
                    <option value="grid">Lưới</option>
                  </select>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Số cột</label>
                  <select
                    v-model.number="localElement.props.columns"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option :value="1">1 cột</option>
                    <option :value="2">2 cột</option>
                    <option :value="3">3 cột</option>
                  </select>
                </div>
              </div>

              <div class="prop-divider"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="prop-label">Danh sách phúc lợi</span>
                <button @click="addBenefit" class="prop-btn prop-btn-primary">
                  <i class="bi bi-plus text-xs"></i> Thêm
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(b, i) in localElement.props.benefits"
                  :key="i"
                  class="flex gap-2 items-center"
                >
                  <input
                    v-model="localElement.props.benefits[i]"
                    @input="updateElement"
                    class="prop-input flex-1"
                    placeholder="Bảo hiểm, Thưởng..."
                  />
                  <button
                    @click="removeBenefit(i)"
                    class="prop-btn prop-btn-danger"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Title Typography -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh tiêu đề</label>
                <div class="flex gap-1">
                  <button
                    v-for="align in ['left', 'center', 'right']"
                    :key="align"
                    @click="
                      localElement.props.align = align;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      localElement.props.align === align ||
                      (!localElement.props.align && align === 'left')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        align === 'left'
                          ? 'bi-text-left'
                          : align === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>
              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ tiêu đề</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '600', l: 'S' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'bold') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'normal') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        localElement.props.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Font Family -->
              <div class="prop-field">
                <label class="prop-label">Font chữ</label>
                <select
                  v-model="localElement.props.fontFamily"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                </select>
              </div>

              <!-- Icon Settings -->
              <div class="prop-divider"></div>
              <span class="text-xs font-semibold text-slate-700 mb-2 block"
                >Cấu hình Icon</span
              >
              <div class="prop-field">
                <label class="prop-label">URL Icon</label>
                <input
                  v-model="localElement.props.iconUrl"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://img.icons8.com/..."
                />
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#ffffff',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#1f2937',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#1f2937'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.textColor || '#4b5563',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.textColor || '#4b5563'"
                        @input="
                          localElement.props.textColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.textColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền icon</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.iconBgColor || '#dcfce7',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.iconBgColor || '#dcfce7'"
                        @input="
                          localElement.props.iconBgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.iconBgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Banking: Transaction Card -->
          <div
            v-if="selectedElement.type === 'transaction-card'"
            class="prop-section"
          >
            <button
              @click="toggleSection('transactionCard')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-green-500 to-emerald-600"
                >
                  <i class="bi bi-arrow-left-right"></i>
                </div>
                <span>Giao dịch</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.transactionCard
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.transactionCard"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Giao dịch thành công"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Mã giao dịch</label>
                  <input
                    v-model="localElement.props.transactionId"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="TXN123456"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Số tiền</label>
                  <input
                    v-model="localElement.props.amount"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="5,000,000đ"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Từ TK</label>
                  <input
                    v-model="localElement.props.fromAccount"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="**** 1234"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Đến TK</label>
                  <input
                    v-model="localElement.props.toAccount"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="**** 5678"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Người nhận</label>
                <input
                  v-model="localElement.props.toName"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Thời gian</label>
                  <input
                    v-model="localElement.props.date"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="31/12/2025 14:30"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Trạng thái</label>
                  <select
                    v-model="localElement.props.status"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="success">Thành công</option>
                    <option value="pending">Đang xử lý</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>
              <div class="prop-divider"></div>

              <!-- Icon Controls -->
              <IconControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  urlProp: 'iconUrl',
                  bgProp: 'iconBgColor',
                  urlLabel: 'URL Icon',
                  backgroundLabel: 'Nền Icon',
                  urlPlaceholder: 'https://example.com/icon.png',
                  defaultBgColor: '#dcfce7',
                  showBackground: true,
                }"
              />
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#f0fdf4',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#f0fdf4'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Viền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.borderColor || '#22c55e',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.borderColor || '#22c55e'"
                        @input="
                          localElement.props.borderColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.borderColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Tiêu đề</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.titleColor || '#15803d',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.titleColor || '#15803d'"
                        @input="
                          localElement.props.titleColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.titleColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Ngày</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.dateColor || '#6b7280',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.dateColor || '#6b7280'"
                        @input="
                          localElement.props.dateColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.dateColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Số tiền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.amountColor || '#16a34a',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.amountColor || '#16a34a'"
                        @input="
                          localElement.props.amountColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.amountColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chi tiết</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.detailsColor || '#374151',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.detailsColor || '#374151'"
                        @input="
                          localElement.props.detailsColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.detailsColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nhãn</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.labelColor || '#6b7280',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.labelColor || '#6b7280'"
                        @input="
                          localElement.props.labelColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.labelColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
              <!-- đóng color-grid -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <TypographyControl
                :element-props="localElement.props"
                :update-element="updateElement"
                :config="{
                  titleSizes: ['12px', '14px', '16px', '18px', '20px', '24px'],
                  subtitleSizes: ['10px', '11px', '12px', '13px', '14px'],
                  defaultTitleSize: '16px',
                  defaultSubtitleSize: '12px',
                  defaultTitleWeight: 'bold',
                  defaultSubtitleWeight: 'normal',
                  defaultTitleFont: 'Arial, sans-serif',
                  defaultSubtitleFont: 'Arial, sans-serif',
                  subtitleLabel: 'ngày',
                  titlePrefix: 'title',
                  subtitlePrefix: 'date',
                }"
              />
            </div>
          </div>

          <!-- Banking: Credit Card Info -->
          <div
            v-if="selectedElement.type === 'credit-card-info'"
            class="prop-section"
          >
            <button
              @click="toggleSection('creditCardInfo')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-indigo-600 to-purple-700"
                >
                  <i class="bi bi-credit-card-2-front"></i>
                </div>
                <span>Thẻ tín dụng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.creditCardInfo
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.creditCardInfo"
              class="prop-section-body"
            >
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Thẻ tín dụng"
                />
              </div>
              <div class="prop-grid-2">
                <SelectControl
                  v-model="localElement.props.cardType"
                  @update:modelValue="updateElement"
                  label="Loại thẻ"
                  :options="[
                    { value: 'visa', label: 'Visa' },
                    { value: 'mastercard', label: 'Mastercard' },
                    { value: 'jcb', label: 'JCB' },
                    { value: 'amex', label: 'Amex' },
                  ]"
                />
                <div class="prop-field">
                  <label class="prop-label">Số thẻ</label>
                  <input
                    v-model="localElement.props.cardNumber"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="**** 9876"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Chủ thẻ</label>
                  <input
                    v-model="localElement.props.cardHolder"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="NGUYEN VAN A"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Hết hạn</label>
                  <input
                    v-model="localElement.props.expiryDate"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="12/28"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Hạn mức</label>
                  <input
                    v-model="localElement.props.creditLimit"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="100,000,000đ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Đã dùng</label>
                  <input
                    v-model="localElement.props.usedAmount"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="35,000,000đ"
                  />
                </div>
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px', '18px']"
                  :default-size="'14px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Card Type Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Loại thẻ</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.cardTypeAlign"
                  @update:modelValue="updateElement"
                  :default-align="'right'"
                  label="Căn chỉnh loại thẻ"
                />
                <FontSizeControl
                  v-model="localElement.props.cardTypeFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px', '22px']"
                  :default-size="'18px'"
                  label="Cỡ chữ loại thẻ"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.cardTypeFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.cardTypeFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.cardTypeFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ loại thẻ"
                />
              </div>

              <!-- Card Number Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Số thẻ</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.cardNumberAlign"
                  @update:modelValue="updateElement"
                  :default-align="'center'"
                  label="Căn chỉnh số thẻ"
                />
                <FontSizeControl
                  v-model="localElement.props.cardNumberFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['16px', '18px', '20px', '22px', '24px']"
                  :default-size="'20px'"
                  label="Cỡ chữ số thẻ"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.cardNumberFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.cardNumberFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.cardNumberFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ số thẻ"
                />
              </div>

              <!-- Label Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Label (CHỦ THẺ/HẾT HẠN)</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.labelAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh label"
                />
                <FontSizeControl
                  v-model="localElement.props.labelFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['8px', '10px', '12px']"
                  :default-size="'10px'"
                  label="Cỡ chữ label"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.labelFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.labelFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.labelFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ label"
                />
              </div>

              <!-- Card Holder Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Chủ thẻ</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.cardHolderAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh chủ thẻ"
                />
                <FontSizeControl
                  v-model="localElement.props.cardHolderFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ chủ thẻ"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.cardHolderFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'500'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.cardHolderFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.cardHolderFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ chủ thẻ"
                />
              </div>

              <!-- Expiry Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Hết hạn</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.expiryAlign"
                  @update:modelValue="updateElement"
                  :default-align="'right'"
                  label="Căn chỉnh hết hạn"
                />
                <FontSizeControl
                  v-model="localElement.props.expiryFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ hết hạn"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.expiryFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'500'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.expiryFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.expiryFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ hết hạn"
                />
              </div>

              <!-- Usage Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-indigo-600"
                    >Typography Usage</label
                  >
                </div>
                <FontSizeControl
                  v-model="localElement.props.usageFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ usage"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.usageLabelFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.usageLabelFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.usageLabelFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ label usage"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.usageValueFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.usageValueFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.usageValueFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ value usage"
                />
              </div>
              <!-- Background Color -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-indigo-600"
                  >Background Color</label
                >
              </div>
              <div class="prop-field">
                <label class="prop-label">Màu nền thẻ</label>
                <input
                  v-model="localElement.props.bgColor"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="#1e3a8a"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-indigo-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền thẻ', prop: 'bgColor', default: '#1e3a8a' },
                  {
                    label: 'Màu chữ tiêu đề',
                    prop: 'titleColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu chữ loại thẻ',
                    prop: 'cardTypeColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu số thẻ',
                    prop: 'cardNumberColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu label',
                    prop: 'labelColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu chủ thẻ',
                    prop: 'cardHolderColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu hết hạn',
                    prop: 'expiryColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu usage label',
                    prop: 'usageLabelColor',
                    default: '#ffffff',
                  },
                  {
                    label: 'Màu usage value',
                    prop: 'usageValueColor',
                    default: '#ffffff',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- Gaming: Course Card -->
          <div
            v-if="selectedElement.type === 'course-card'"
            class="prop-section"
          >
            <button
              @click="toggleSection('courseCard')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-purple-500 to-pink-600"
                >
                  <i class="bi bi-mortarboard"></i>
                </div>
                <span>Khóa học</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.courseCard
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.courseCard" class="prop-section-body">
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tên khóa học</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Khóa học Python"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Giảng viên</label>
                <input
                  v-model="localElement.props.instructor"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Nguyễn Văn B"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Ảnh thumbnail</label>
                <input
                  v-model="localElement.props.thumbnail"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Thời lượng</label>
                  <input
                    v-model="localElement.props.duration"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="20 giờ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Số bài học</label>
                  <input
                    v-model.number="localElement.props.lessons"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="45"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Giá</label>
                  <input
                    v-model="localElement.props.price"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="799,000đ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Giá gốc</label>
                  <input
                    v-model="localElement.props.originalPrice"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="1,500,000đ"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Đánh giá</label>
                  <SelectControl
                    v-model="localElement.props.rating"
                    @update:modelValue="updateElement"
                    label="Số sao"
                    :options="[
                      { value: 5, label: '5 sao' },
                      { value: 4.5, label: '4.5 sao' },
                      { value: 4, label: '4 sao' },
                      { value: 3.5, label: '3.5 sao' },
                      { value: 3, label: '3 sao' },
                      { value: 2.5, label: '2.5 sao' },
                      { value: 2, label: '2 sao' },
                      { value: 1.5, label: '1.5 sao' },
                      { value: 1, label: '1 sao' },
                    ]"
                    :value-type="'number'"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Hiển thị đánh giá</label>
                  <SelectControl
                    v-model="localElement.props.showRating"
                    @update:modelValue="updateElement"
                    label="Trạng thái"
                    :options="[
                      { value: true, label: 'Hiển thị' },
                      { value: false, label: 'Ẩn' },
                    ]"
                    :value-type="'boolean'"
                  />
                </div>
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-purple-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['16px', '18px', '20px', '22px', '24px']"
                  :default-size="'18px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Price Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-purple-600"
                    >Typography Giá</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.priceAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh giá"
                />
                <FontSizeControl
                  v-model="localElement.props.priceFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                  label="Cỡ chữ giá"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.priceFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.priceFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.priceFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ giá"
                />
              </div>

              <!-- Details Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-purple-600"
                    >Typography Chi tiết</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.detailsAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh chi tiết"
                />
                <FontSizeControl
                  v-model="localElement.props.detailsFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ chi tiết"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.detailsFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.detailsFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.detailsFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ chi tiết"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-purple-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: '#ffffff' },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  { label: 'Màu giá', prop: 'priceColor', default: '#dc2626' },
                  {
                    label: 'Màu chi tiết',
                    prop: 'detailsColor',
                    default: '#6b7280',
                  },
                  { label: 'Màu sao', prop: 'starColor', default: '#fbbf24' },
                  {
                    label: 'Màu viền',
                    prop: 'borderColor',
                    default: '#e5e7eb',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <div
            v-if="selectedElement.type === 'progress-bar'"
            class="prop-section"
          >
            <button
              @click="toggleSection('progressBar')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-blue-500 to-cyan-600"
                >
                  <i class="bi bi-graph-up"></i>
                </div>
                <span>Tiến độ</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.progressBar
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.progressBar"
              class="prop-section-body"
            >
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Tiến độ hoàn thành"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Nhãn</label>
                <input
                  v-model="localElement.props.label"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Hoàn thành khóa học"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Giá trị</label>
                  <input
                    v-model.number="localElement.props.currentValue"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="75"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Tối đa</label>
                  <input
                    v-model.number="localElement.props.maxValue"
                    @input="updateElement"
                    type="number"
                    class="prop-input"
                    placeholder="100"
                  />
                </div>
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-blue-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px', '18px']"
                  :default-size="'14px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Label Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-blue-600"
                    >Typography Nhãn</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.labelAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh nhãn"
                />
                <FontSizeControl
                  v-model="localElement.props.labelFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ nhãn"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.labelFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'500'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.labelFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.labelFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ nhãn"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-blue-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: 'transparent' },
                  { label: 'Màu thanh', prop: 'barColor', default: '#3b82f6' },
                  {
                    label: 'Màu track',
                    prop: 'trackColor',
                    default: '#e5e7eb',
                  },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  { label: 'Màu nhãn', prop: 'labelColor', default: '#6b7280' },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- F&B: Menu Item -->
          <div v-if="selectedElement.type === 'menu-item'" class="prop-section">
            <button
              @click="toggleSection('menuItem')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-orange-500 to-red-600"
                >
                  <i class="bi bi-cup-hot"></i>
                </div>
                <span>Món ăn</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.menuItem
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.menuItem" class="prop-section-body">
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tên món</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Phở Bò Đặc Biệt"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Mô tả</label>
                <textarea
                  v-model="localElement.props.description"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="2"
                ></textarea>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Giá</label>
                  <input
                    v-model="localElement.props.price"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="85,000đ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Danh mục</label>
                  <input
                    v-model="localElement.props.category"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Món chính"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Ảnh món ăn</label>
                <input
                  v-model="localElement.props.image"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-orange-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Description Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-orange-600"
                    >Typography Mô tả</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.descriptionAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh mô tả"
                />
                <FontSizeControl
                  v-model="localElement.props.descriptionFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ mô tả"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.descriptionFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.descriptionFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.descriptionFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ mô tả"
                />
              </div>

              <!-- Price Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-orange-600"
                    >Typography Giá</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.priceAlign"
                  @update:modelValue="updateElement"
                  :default-align="'right'"
                  label="Căn chỉnh giá"
                />
                <FontSizeControl
                  v-model="localElement.props.priceFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px']"
                  :default-size="'16px'"
                  label="Cỡ chữ giá"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.priceFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.priceFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.priceFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ giá"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-orange-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: '#ffffff' },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Màu mô tả',
                    prop: 'descriptionColor',
                    default: '#6b7280',
                  },
                  { label: 'Màu giá', prop: 'priceColor', default: '#dc2626' },
                  {
                    label: 'Màu viền',
                    prop: 'borderColor',
                    default: '#e5e7eb',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- Hotel: Room Card -->
          <div v-if="selectedElement.type === 'room-card'" class="prop-section">
            <button
              @click="toggleSection('roomCard')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-teal-500 to-emerald-600"
                >
                  <i class="bi bi-building"></i>
                </div>
                <span>Phòng khách sạn</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.roomCard
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.roomCard" class="prop-section-body">
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tên phòng</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Phòng Deluxe Ocean View"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Mô tả</label>
                <textarea
                  v-model="localElement.props.description"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="2"
                ></textarea>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Giá/đêm</label>
                  <input
                    v-model="localElement.props.pricePerNight"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="2,500,000đ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Giá gốc</label>
                  <input
                    v-model="localElement.props.originalPrice"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="3,200,000đ"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Loại giường</label>
                  <input
                    v-model="localElement.props.bedType"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="1 King bed"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Diện tích</label>
                  <input
                    v-model="localElement.props.roomSize"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="45m²"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Ảnh phòng</label>
                <input
                  v-model="localElement.props.image"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-teal-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['16px', '18px', '20px', '22px']"
                  :default-size="'20px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Description Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-teal-600"
                    >Typography Mô tả</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.descriptionAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh mô tả"
                />
                <FontSizeControl
                  v-model="localElement.props.descriptionFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ mô tả"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.descriptionFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.descriptionFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.descriptionFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ mô tả"
                />
              </div>

              <!-- Price Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-teal-600"
                    >Typography Giá</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.priceAlign"
                  @update:modelValue="updateElement"
                  :default-align="'right'"
                  label="Căn chỉnh giá"
                />
                <FontSizeControl
                  v-model="localElement.props.priceFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['16px', '18px', '20px', '22px']"
                  :default-size="'18px'"
                  label="Cỡ chữ giá"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.priceFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.priceFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.priceFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ giá"
                />
              </div>

              <!-- Details Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-teal-600"
                    >Typography Chi tiết</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.detailsAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh chi tiết"
                />
                <FontSizeControl
                  v-model="localElement.props.detailsFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ chi tiết"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.detailsFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.detailsFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.detailsFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ chi tiết"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-teal-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: '#ffffff' },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Màu mô tả',
                    prop: 'descriptionColor',
                    default: '#6b7280',
                  },
                  { label: 'Màu giá', prop: 'priceColor', default: '#059669' },
                  {
                    label: 'Màu chi tiết',
                    prop: 'detailsColor',
                    default: '#6b7280',
                  },
                  {
                    label: 'Màu viền',
                    prop: 'borderColor',
                    default: '#e5e7eb',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- Hotel: Booking Summary -->
          <div
            v-if="selectedElement.type === 'booking-summary'"
            class="prop-section"
          >
            <button
              @click="toggleSection('bookingSummary')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-green-500 to-teal-600"
                >
                  <i class="bi bi-calendar-check"></i>
                </div>
                <span>Đặt phòng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.bookingSummary
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.bookingSummary"
              class="prop-section-body"
            >
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Chi tiết đặt phòng"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Mã đặt phòng</label>
                  <input
                    v-model="localElement.props.confirmationCode"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="BK123456"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Khách sạn</label>
                  <input
                    v-model="localElement.props.propertyName"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Sunset Beach Resort"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Nhận phòng</label>
                  <input
                    v-model="localElement.props.checkIn"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="01/01/2026"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Trả phòng</label>
                  <input
                    v-model="localElement.props.checkOut"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="03/01/2026"
                  />
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Tiền phòng</label>
                  <input
                    v-model="localElement.props.roomPrice"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="5,000,000đ"
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Tổng cộng</label>
                  <input
                    v-model="localElement.props.total"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="5,250,000đ"
                  />
                </div>
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-green-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Details Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-green-600"
                    >Typography Chi tiết</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.detailsAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh chi tiết"
                />
                <FontSizeControl
                  v-model="localElement.props.detailsFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ chi tiết"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.detailsFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.detailsFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.detailsFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ chi tiết"
                />
              </div>

              <!-- Price Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-green-600"
                    >Typography Giá</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.priceAlign"
                  @update:modelValue="updateElement"
                  :default-align="'right'"
                  label="Căn chỉnh giá"
                />
                <FontSizeControl
                  v-model="localElement.props.priceFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                  label="Cỡ chữ giá"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.priceFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.priceFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.priceFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ giá"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-green-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: '#ffffff' },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Màu chi tiết',
                    prop: 'detailsColor',
                    default: '#374151',
                  },
                  { label: 'Màu giá', prop: 'priceColor', default: '#059669' },
                  {
                    label: 'Màu viền',
                    prop: 'borderColor',
                    default: '#e5e7eb',
                  },
                  {
                    label: 'Màu nền icon',
                    prop: 'iconBgColor',
                    default: '#d1fae5',
                  },
                  { label: 'Màu icon', prop: 'iconColor', default: '#059669' },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- Hotel: Rating Review -->
          <div
            v-if="selectedElement.type === 'rating-review'"
            class="prop-section"
          >
            <button
              @click="toggleSection('ratingReview')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-yellow-500 to-orange-600"
                >
                  <i class="bi bi-star-fill"></i>
                </div>
                <span>Đánh giá</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.ratingReview
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.ratingReview"
              class="prop-section-body"
            >
              <!-- Basic Content -->
              <div class="prop-field">
                <label class="prop-label">Tiêu đề</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Đánh giá từ khách hàng"
                />
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Người đánh giá</label>
                  <input
                    v-model="localElement.props.reviewerName"
                    @input="updateElement"
                    type="text"
                    class="prop-input"
                    placeholder="Nguyễn Văn C"
                  />
                </div>
                <SelectControl
                  v-model="localElement.props.rating"
                  @update:modelValue="updateElement"
                  label="Số sao"
                  :options="[
                    { value: 5, label: '5 sao' },
                    { value: 4, label: '4 sao' },
                    { value: 3, label: '3 sao' },
                    { value: 2, label: '2 sao' },
                    { value: 1, label: '1 sao' },
                  ]"
                  :value-type="'number'"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Tiêu đề review</label>
                <input
                  v-model="localElement.props.title"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Trải nghiệm tuyệt vời!"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Nội dung</label>
                <textarea
                  v-model="localElement.props.content"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="3"
                ></textarea>
              </div>

              <!-- Typography Controls -->
              <div class="prop-divider"></div>

              <!-- Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-yellow-600"
                    >Typography Tiêu đề</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.titleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề"
                />
                <FontSizeControl
                  v-model="localElement.props.titleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'14px'"
                  label="Cỡ chữ tiêu đề"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.titleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.titleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.titleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề"
                />
              </div>

              <!-- Review Title Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-yellow-600"
                    >Typography Tiêu đề Review</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.reviewTitleAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh tiêu đề review"
                />
                <FontSizeControl
                  v-model="localElement.props.reviewTitleFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['14px', '16px', '18px', '20px']"
                  :default-size="'16px'"
                  label="Cỡ chữ tiêu đề review"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.reviewTitleFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'bold'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.reviewTitleFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.reviewTitleFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ tiêu đề review"
                />
              </div>

              <!-- Content Typography -->
              <div class="typography-section">
                <div class="prop-field">
                  <label class="prop-label font-semibold text-yellow-600"
                    >Typography Nội dung</label
                  >
                </div>
                <AlignmentControl
                  v-model="localElement.props.contentAlign"
                  @update:modelValue="updateElement"
                  :default-align="'left'"
                  label="Căn chỉnh nội dung"
                />
                <FontSizeControl
                  v-model="localElement.props.contentFontSize"
                  @update:modelValue="updateElement"
                  :sizes="['12px', '14px', '16px']"
                  :default-size="'14px'"
                  label="Cỡ chữ nội dung"
                />
                <div class="prop-grid-2">
                  <FontWeightControl
                    v-model="localElement.props.contentFontWeight"
                    @update:modelValue="updateElement"
                    :default-weight="'normal'"
                  />
                  <FontStyleControl
                    v-model="localElement.props.contentFontStyle"
                    @update:modelValue="updateElement"
                  />
                </div>
                <FontFamilyControl
                  v-model="localElement.props.contentFontFamily"
                  @update:modelValue="updateElement"
                  label="Font chữ nội dung"
                />
              </div>

              <!-- Color Controls -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label font-semibold text-yellow-600"
                  >Màu sắc</label
                >
              </div>
              <ColorGridControl
                :colors="[
                  { label: 'Màu nền', prop: 'bgColor', default: '#ffffff' },
                  {
                    label: 'Màu tiêu đề',
                    prop: 'titleColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Màu tiêu đề review',
                    prop: 'reviewTitleColor',
                    default: '#1f2937',
                  },
                  {
                    label: 'Màu nội dung',
                    prop: 'contentColor',
                    default: '#374151',
                  },
                  { label: 'Màu sao', prop: 'starColor', default: '#fbbf24' },
                  {
                    label: 'Màu viền',
                    prop: 'borderColor',
                    default: '#e5e7eb',
                  },
                ]"
                :element-props="localElement.props"
                @update="updateElement"
              />
            </div>
          </div>

          <!-- Unsubscribe -->
          <div
            v-if="selectedElement.type === 'unsubscribe'"
            class="prop-section"
          >
            <button
              @click="toggleSection('unsubscribe')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-slate-500 to-gray-600"
                >
                  <i class="bi bi-envelope-x"></i>
                </div>
                <span>Hủy đăng ký</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.unsubscribe
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.unsubscribe"
              class="prop-section-body"
            >
              <div class="prop-field">
                <label class="prop-label">Văn bản link</label>
                <input
                  v-model="localElement.props.children"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Hủy đăng ký"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Link</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="{{UNSUBSCRIBE_URL}}"
                />
                <p class="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <i class="bi bi-info-circle"></i>
                  <span
                    >Sử dụng
                    <code class="bg-blue-50 px-1 rounded">{{
                      UNSUBSCRIBE_URL
                    }}</code>
                    để tự động inject token cho mỗi subscriber</span
                  >
                </p>
              </div>
              <div class="prop-field">
                <label class="prop-label">Mô tả</label>
                <textarea
                  v-model="localElement.props.description"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="2"
                  placeholder="Nếu bạn không muốn nhận email..."
                ></textarea>
              </div>

              <!-- Alignment -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="a in ['left', 'center', 'right']"
                    :key="a"
                    @click="
                      localElement.props.align = a;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      (localElement.props.align || 'center') === a
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        a === 'left'
                          ? 'bi-text-left'
                          : a === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>

              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['10px', '11px', '12px', '13px', '14px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '12px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.textColor || '#6b7280',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.textColor || '#6b7280'"
                        @input="
                          localElement.props.textColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.textColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Link</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.linkColor || '#3b82f6',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.linkColor || '#3b82f6'"
                        @input="
                          localElement.props.linkColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.linkColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || 'transparent',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#ffffff'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                      placeholder="transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quote Properties -->
          <div v-if="selectedElement.type === 'quote'" class="prop-section">
            <button @click="toggleSection('quote')" class="prop-section-header">
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-amber-500 to-yellow-600"
                >
                  <i class="bi bi-quote"></i>
                </div>
                <span>Trích dẫn</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.quote ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.quote" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Nội dung</label>
                <textarea
                  v-model="localElement.props.children"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="4"
                  placeholder="Nhập trích dẫn..."
                ></textarea>
              </div>
              <div class="prop-field">
                <label class="prop-label">Tác giả</label>
                <input
                  v-model="localElement.props.author"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="- Tên tác giả"
                />
              </div>

              <!-- Alignment -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="a in ['left', 'center', 'right']"
                    :key="a"
                    @click="
                      localElement.props.align = a;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      (localElement.props.align || 'left') === a
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        a === 'left'
                          ? 'bi-text-left'
                          : a === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>

              <!-- Font Size -->
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="size in ['16px', '18px', '20px', '24px']"
                    :key="size"
                    @click="
                      localElement.props.fontSize = size;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1 rounded-lg text-xs transition-all',
                      (localElement.props.fontSize || '18px') === size
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ size.replace("px", "") }}
                  </button>
                </div>
              </div>
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in [
                        { v: 'normal', l: 'N' },
                        { v: '500', l: 'M' },
                        { v: 'bold', l: 'B' },
                      ]"
                      :key="w.v"
                      @click="
                        localElement.props.fontWeight = w.v;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontWeight || 'normal') === w.v
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                      :style="{ fontWeight: w.v }"
                    >
                      {{ w.l }}
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Kiểu chữ</label>
                  <div class="flex gap-1">
                    <button
                      @click="
                        localElement.props.fontStyle = 'normal';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.fontStyle || 'italic') === 'normal'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type"></i>
                    </button>
                    <button
                      @click="
                        localElement.props.fontStyle = 'italic';
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all italic',
                        (localElement.props.fontStyle || 'italic') === 'italic'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i class="bi bi-type-italic"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div class="prop-divider"></div>
              <div class="color-grid">
                <div class="color-grid-item">
                  <span class="color-grid-label">Nền</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.bgColor || '#f8fafc',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.bgColor || '#f8fafc'"
                        @input="
                          localElement.props.bgColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.bgColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Chữ</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.textColor || '#374151',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.textColor || '#374151'"
                        @input="
                          localElement.props.textColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.textColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
                <div class="color-grid-item">
                  <span class="color-grid-label">Viền trái</span>
                  <div class="color-grid-control">
                    <div
                      class="color-grid-swatch"
                      :style="{
                        backgroundColor:
                          localElement.props.borderColor || '#6366f1',
                      }"
                    >
                      <input
                        type="color"
                        :value="localElement.props.borderColor || '#6366f1'"
                        @input="
                          localElement.props.borderColor = $event.target.value;
                          updateElement();
                        "
                      />
                    </div>
                    <input
                      type="text"
                      v-model="localElement.props.borderColor"
                      @input="updateElement"
                      class="color-grid-hex"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Properties -->
          <div v-if="selectedElement.type === 'video'" class="prop-section">
            <button @click="toggleSection('video')" class="prop-section-header">
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-linear-to-br from-red-500 to-rose-600">
                  <i class="bi bi-play-circle"></i>
                </div>
                <span>Video</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.video ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.video" class="prop-section-body">
              <div class="prop-field">
                <label class="prop-label">Loại video</label>
                <select
                  v-model="localElement.props.videoType"
                  @change="updateElement"
                  class="prop-select"
                >
                  <option value="file">Video File (mp4, webm)</option>
                  <option value="youtube">YouTube Embed</option>
                </select>
              </div>
              <div
                v-if="localElement.props.videoType === 'youtube'"
                class="prop-field"
              >
                <label class="prop-label">YouTube URL</label>
                <input
                  v-model="localElement.props.youtubeUrl"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <template v-else>
                <div class="prop-field">
                  <label class="prop-label">Video URL</label>
                  <input
                    v-model="localElement.props.src"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="https://..."
                  />
                </div>
                <div class="prop-field">
                  <label class="prop-label">Poster (thumbnail)</label>
                  <input
                    v-model="localElement.props.poster"
                    @input="updateElement"
                    type="url"
                    class="prop-input"
                    placeholder="https://..."
                  />
                </div>
              </template>

              <!-- Width (% only) -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Chiều rộng</label>
                <div class="flex gap-1">
                  <button
                    v-for="w in ['25%', '50%', '75%', '100%']"
                    :key="w"
                    @click="
                      localElement.props.width = w;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs font-medium transition-all',
                      (localElement.props.width || '100%') === w
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ w }}
                  </button>
                </div>
              </div>

              <!-- Aspect Ratio -->
              <div class="prop-field">
                <label class="prop-label">Tỉ lệ khung hình</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="ar in [
                      { v: '', l: 'Tự động' },
                      { v: '1/1', l: '1:1' },
                      { v: '4/3', l: '4:3' },
                      { v: '16/9', l: '16:9' },
                      { v: '21/9', l: '21:9' },
                    ]"
                    :key="ar.v"
                    @click="
                      localElement.props.aspectRatio = ar.v;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.aspectRatio || '') === ar.v
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ ar.l }}
                  </button>
                </div>
              </div>

              <!-- Options -->
              <div class="prop-divider"></div>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2">
                  <input
                    v-model="localElement.props.controls"
                    @change="updateElement"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Controls</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    v-model="localElement.props.autoplay"
                    @change="updateElement"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">Autoplay</span>
                </label>
              </div>

              <!-- Alignment (horizontal only) -->
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="a in ['left', 'center', 'right']"
                    :key="a"
                    @click="
                      localElement.props.align = a;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      (localElement.props.align || 'center') === a
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        a === 'left'
                          ? 'bi-text-left'
                          : a === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>

              <!-- Title & Caption -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Tiêu đề (tùy chọn)</label>
                <input
                  v-model="localElement.props.title"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Tiêu đề video"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Chú thích (tùy chọn)</label>
                <textarea
                  v-model="localElement.props.caption"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="2"
                  placeholder="Chú thích video"
                ></textarea>
              </div>

              <!-- Link Settings -->
              <div class="prop-field">
                <label class="prop-label">Link (tùy chọn)</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <!-- Image Properties -->
          <div v-if="selectedElement.type === 'image'" class="prop-section">
            <button @click="toggleSection('image')" class="prop-section-header">
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-purple-500 to-pink-600"
                >
                  <i class="bi bi-image"></i>
                </div>
                <span>Hình ảnh</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.image ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.image" class="prop-section-body">
              <!-- Image Source -->
              <div class="prop-field">
                <label class="prop-label">URL hình ảnh</label>
                <div class="flex gap-2">
                  <input
                    v-model="localElement.props.src"
                    @input="updateElement"
                    type="url"
                    class="prop-input flex-1"
                    placeholder="https://..."
                  />
                  <button
                    @click="showImageModal = true"
                    class="prop-btn prop-btn-primary"
                  >
                    <i class="bi bi-folder"></i>
                  </button>
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Alt text</label>
                <input
                  v-model="localElement.props.alt"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Mô tả hình ảnh"
                />
              </div>

              <!-- Width (% only) -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Chiều rộng</label>
                <div class="flex gap-1">
                  <button
                    v-for="w in ['25%', '50%', '75%', '100%']"
                    :key="w"
                    @click="
                      localElement.props.width = w;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs font-medium transition-all',
                      (localElement.props.width || '100%') === w
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ w }}
                  </button>
                </div>
              </div>

              <!-- Aspect Ratio -->
              <div class="prop-field">
                <label class="prop-label">Tỉ lệ khung hình</label>
                <div class="flex gap-1 flex-wrap">
                  <button
                    v-for="ar in [
                      { v: '', l: 'Tự động' },
                      { v: '1/1', l: '1:1' },
                      { v: '4/3', l: '4:3' },
                      { v: '16/9', l: '16:9' },
                      { v: '3/2', l: '3:2' },
                    ]"
                    :key="ar.v"
                    @click="
                      localElement.props.aspectRatio = ar.v;
                      updateElement();
                    "
                    :class="[
                      'px-2 py-1.5 rounded-lg text-xs transition-all',
                      (localElement.props.aspectRatio || '') === ar.v
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ ar.l }}
                  </button>
                </div>
              </div>

              <!-- Alignment (horizontal only) -->
              <div class="prop-field">
                <label class="prop-label">Căn chỉnh</label>
                <div class="flex gap-1">
                  <button
                    v-for="a in ['left', 'center', 'right']"
                    :key="a"
                    @click="
                      localElement.props.align = a;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-xl text-xs transition-all',
                      (localElement.props.align || 'center') === a
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                  >
                    <i
                      :class="[
                        'bi',
                        a === 'left'
                          ? 'bi-text-left'
                          : a === 'center'
                            ? 'bi-text-center'
                            : 'bi-text-right',
                      ]"
                    ></i>
                  </button>
                </div>
              </div>

              <!-- Text Content -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="prop-label">Tiêu đề (tùy chọn)</label>
                <input
                  v-model="localElement.props.title"
                  @input="updateElement"
                  type="text"
                  class="prop-input"
                  placeholder="Tiêu đề hình ảnh"
                />
              </div>
              <div class="prop-field">
                <label class="prop-label">Chú thích (tùy chọn)</label>
                <textarea
                  v-model="localElement.props.caption"
                  @input="updateElement"
                  class="prop-textarea"
                  rows="2"
                  placeholder="Chú thích hình ảnh"
                ></textarea>
              </div>

              <!-- Link Settings -->
              <div class="prop-field">
                <label class="prop-label">Link (tùy chọn)</label>
                <input
                  v-model="localElement.props.href"
                  @input="updateElement"
                  type="url"
                  class="prop-input"
                  placeholder="https://..."
                />
              </div>

              <!-- Text Overlay Section -->
              <div class="prop-divider"></div>
              <div class="prop-field">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="localElement.props.enableTextOverlay"
                    @change="updateElement"
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="prop-label mb-0">Chữ đè lên hình</span>
                </label>
                <p class="text-xs text-gray-400 mt-1">
                  Text sẽ được convert thành hình và đè lên ảnh gốc
                </p>
              </div>

              <div
                v-if="localElement.props.enableTextOverlay"
                class="space-y-3 mt-3 p-3 bg-slate-50 rounded-xl"
              >
                <div class="prop-field">
                  <label class="prop-label">Nội dung text</label>
                  <textarea
                    v-model="localElement.props.overlayText"
                    @input="updateElement"
                    class="prop-textarea"
                    rows="2"
                    placeholder="Nhập text đè lên hình..."
                  ></textarea>
                </div>

                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Căn ngang</label>
                    <div class="flex gap-1">
                      <button
                        v-for="a in ['left', 'center', 'right']"
                        :key="a"
                        @click="
                          localElement.props.overlayAlign = a;
                          updateElement();
                        "
                        :class="[
                          'flex-1 p-2 rounded-lg text-xs transition-all',
                          (localElement.props.overlayAlign || 'center') === a
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                        ]"
                      >
                        <i
                          :class="[
                            'bi',
                            a === 'left'
                              ? 'bi-text-left'
                              : a === 'center'
                                ? 'bi-text-center'
                                : 'bi-text-right',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Vị trí dọc (%)</label>
                    <input
                      type="number"
                      v-model.number="localElement.props.overlayTop"
                      @input="updateElement"
                      class="prop-input"
                      min="0"
                      max="100"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Cỡ chữ (px)</label>
                    <input
                      type="number"
                      v-model.number="localElement.props.overlayFontSize"
                      @input="updateElement"
                      class="prop-input"
                      min="10"
                      max="200"
                      placeholder="48"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Màu chữ</label>
                    <div class="flex gap-2">
                      <div
                        class="color-grid-swatch"
                        :style="{
                          backgroundColor:
                            localElement.props.overlayColor || '#ffffff',
                        }"
                      >
                        <input
                          type="color"
                          :value="localElement.props.overlayColor || '#ffffff'"
                          @input="
                            localElement.props.overlayColor =
                              $event.target.value;
                            updateElement();
                          "
                        />
                      </div>
                      <input
                        type="text"
                        v-model="localElement.props.overlayColor"
                        @input="updateElement"
                        class="prop-input flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div class="prop-field">
                  <label class="prop-label">Font chữ</label>
                  <select
                    v-model="localElement.props.overlayFontFamily"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Alifiyah">Alifiyah</option>
                    <option value="Futura Bold">Futura Bold</option>
                    <option value="Futura Book">Futura Book</option>
                    <option value="Futura Demi">Futura Demi</option>
                    <option value="Futura ExtraBold">Futura ExtraBold</option>
                    <option value="Futura Heavy">Futura Heavy</option>
                    <option value="Futura Light">Futura Light</option>
                    <option value="Futura Medium">Futura Medium</option>
                    <option value="SFU Futura Bold">SFU Futura Bold</option>
                    <option value="SFU Futura Book">SFU Futura Book</option>
                    <option value="FZ">FZ</option>
                    <option value="Photograph">Photograph</option>
                  </select>
                </div>

                <div class="prop-field">
                  <label class="prop-label">Độ đậm</label>
                  <div class="flex gap-1">
                    <button
                      v-for="w in ['normal', 'bold']"
                      :key="w"
                      @click="
                        localElement.props.overlayFontWeight = w;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.overlayFontWeight || 'bold') === w
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      {{ w === "normal" ? "Thường" : "Đậm" }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- QR Code Overlay -->
              <div class="mt-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="localElement.props.enableQROverlay"
                    @change="updateElement"
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="prop-label mb-0">QR Code đè lên hình</span>
                </label>
                <p class="text-xs text-gray-400 mt-1">
                  QR code sẽ được tạo từ _id của người nhận và đè lên ảnh
                </p>
              </div>

              <div
                v-if="localElement.props.enableQROverlay"
                class="space-y-3 mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div class="flex items-start gap-2 p-2 bg-blue-100 rounded-lg">
                  <i class="bi bi-info-circle text-blue-600 mt-0.5"></i>
                  <div class="text-xs text-blue-700">
                    <strong>Dynamic QR Code:</strong> Mã QR sẽ được tạo tự động
                    từ _id của từng người nhận khi gửi email.
                  </div>
                </div>

                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Căn ngang</label>
                    <div class="flex gap-1">
                      <button
                        v-for="a in ['left', 'center', 'right']"
                        :key="a"
                        @click="
                          localElement.props.qrAlign = a;
                          updateElement();
                        "
                        :class="[
                          'flex-1 p-2 rounded-lg text-xs transition-all',
                          (localElement.props.qrAlign || 'center') === a
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                        ]"
                      >
                        <i
                          :class="[
                            'bi',
                            a === 'left'
                              ? 'bi-text-left'
                              : a === 'center'
                                ? 'bi-text-center'
                                : 'bi-text-right',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Vị trí dọc (%)</label>
                    <input
                      type="number"
                      v-model.number="localElement.props.qrTop"
                      @input="updateElement"
                      class="prop-input"
                      min="0"
                      max="100"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div class="prop-grid-2">
                  <div class="prop-field">
                    <label class="prop-label">Kích thước (px)</label>
                    <input
                      type="number"
                      v-model.number="localElement.props.qrSize"
                      @input="updateElement"
                      class="prop-input"
                      min="50"
                      max="300"
                      placeholder="100"
                    />
                  </div>
                  <div class="prop-field">
                    <label class="prop-label">Màu nền QR</label>
                    <div class="flex gap-2">
                      <div
                        class="color-grid-swatch"
                        :style="{
                          backgroundColor:
                            localElement.props.qrBackground || '#ffffff',
                        }"
                      >
                        <input
                          type="color"
                          :value="localElement.props.qrBackground || '#ffffff'"
                          @input="
                            localElement.props.qrBackground =
                              $event.target.value;
                            updateElement();
                          "
                        />
                      </div>
                      <input
                        type="text"
                        v-model="localElement.props.qrBackground"
                        @input="updateElement"
                        class="prop-input flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Combined Overlay Button -->
              <button
                v-if="
                  localElement.props.enableTextOverlay ||
                  localElement.props.enableQROverlay
                "
                @click="generateCombinedOverlay"
                :disabled="
                  processingOverlay ||
                  (localElement.props.enableTextOverlay &&
                    !localElement.props.overlayText)
                "
                class="w-full mt-4 py-2.5 px-4 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl font-medium text-sm hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                <i
                  v-if="processingOverlay"
                  class="bi bi-arrow-repeat animate-spin"
                ></i>
                <i v-else class="bi bi-magic"></i>
                {{
                  processingOverlay
                    ? "Đang xử lý..."
                    : localElement.props.overlayProcessed ||
                        localElement.props.qrConfig
                      ? "Cập nhật Overlay"
                      : "Tạo Overlay"
                }}
              </button>
            </div>
          </div>

          <!-- Typography -->
          <div v-if="hasTextStyles" class="prop-section">
            <button
              @click="toggleSection('typography')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-indigo-500">
                  <i class="bi bi-fonts"></i>
                </div>
                <span>Kiểu chữ</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.typography
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.typography" class="prop-section-body">
              <TextStyleControl
                :key="`text-style-${selectedElement?.id || 'none'}`"
                :text-type="localElement.props.as || 'p'"
                :font-family="
                  localElement.style.fontFamily || 'Arial, sans-serif'
                "
                :font-size="localElement.style.fontSize || '1rem'"
                :font-weight="localElement.style.fontWeight || 'normal'"
                :font-style="localElement.style.fontStyle || 'normal'"
                :text-decoration="localElement.style.textDecoration || 'none'"
                :text-align="localElement.style.textAlign || 'left'"
                :line-height="localElement.style.lineHeight || '1.5'"
                :letter-spacing="localElement.style.letterSpacing || 'normal'"
                :text-transform="localElement.style.textTransform || 'none'"
                @update:text-type="
                  (val) => {
                    localElement.props.as = val;
                    updateElement();
                  }
                "
                @update:font-family="
                  (val) => {
                    localElement.style.fontFamily = val;
                    updateElement();
                  }
                "
                @update:font-size="
                  (val) => {
                    localElement.style.fontSize = val;
                    updateElement();
                  }
                "
                @update:font-weight="
                  (val) => {
                    localElement.style.fontWeight = val;
                    updateElement();
                  }
                "
                @update:font-style="
                  (val) => {
                    localElement.style.fontStyle = val;
                    updateElement();
                  }
                "
                @update:text-decoration="
                  (val) => {
                    localElement.style.textDecoration = val;
                    updateElement();
                  }
                "
                @update:text-align="
                  (val) => {
                    localElement.style.textAlign = val;
                    updateElement();
                  }
                "
                @update:line-height="
                  (val) => {
                    localElement.style.lineHeight = val;
                    updateElement();
                  }
                "
                @update:letter-spacing="
                  (val) => {
                    localElement.style.letterSpacing = val;
                    updateElement();
                  }
                "
                @update:text-transform="
                  (val) => {
                    localElement.style.textTransform = val;
                    updateElement();
                  }
                "
              />
              <div class="pt-2">
                <ColorPicker
                  v-model="localElement.style.color"
                  label="Màu chữ"
                  color-type="text"
                  default-color="#000000"
                  @update:model-value="updateElement"
                />
              </div>
            </div>
          </div>

          <!-- Layout Properties (for columns/rows) -->
          <div v-if="isLayoutElement" class="prop-section">
            <button
              @click="toggleSection('layout')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-cyan-500">
                  <i class="bi bi-grid"></i>
                </div>
                <span>Bố cục</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.layout ? 'bi-chevron-up' : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.layout" class="prop-section-body">
              <!-- Alignment -->
              <div class="prop-grid-2">
                <div class="prop-field">
                  <label class="prop-label">Căn ngang</label>
                  <div class="flex gap-1">
                    <button
                      v-for="align in [
                        'flex-start',
                        'center',
                        'flex-end',
                        'space-between',
                      ]"
                      :key="align"
                      @click="
                        localElement.props.justifyContent = align;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.justifyContent || 'flex-start') ===
                        align
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i
                        :class="[
                          'bi',
                          align === 'flex-start'
                            ? 'bi-align-start'
                            : align === 'center'
                              ? 'bi-align-center'
                              : align === 'flex-end'
                                ? 'bi-align-end'
                                : 'bi-distribute-horizontal',
                        ]"
                      ></i>
                    </button>
                  </div>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Căn dọc</label>
                  <div class="flex gap-1">
                    <button
                      v-for="align in [
                        'flex-start',
                        'center',
                        'flex-end',
                        'stretch',
                      ]"
                      :key="align"
                      @click="
                        localElement.props.alignItems = align;
                        updateElement();
                      "
                      :class="[
                        'flex-1 p-2 rounded-lg text-xs transition-all',
                        (localElement.props.alignItems || 'stretch') === align
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                      ]"
                    >
                      <i
                        :class="[
                          'bi',
                          align === 'flex-start'
                            ? 'bi-align-top'
                            : align === 'center'
                              ? 'bi-align-middle'
                              : align === 'flex-end'
                                ? 'bi-align-bottom'
                                : 'bi-arrows-expand',
                        ]"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="prop-divider"></div>

              <!-- Gap -->
              <UnitControl
                :key="`layout-gap-${selectedElement?.id || 'none'}`"
                v-model="localElement.props.gap"
                label="Khoảng cách (gap)"
                :min="0"
                :max="10"
                :units="['%']"
                :presets="[
                  { label: '0', value: '0' },
                  { label: '1%', value: '1%' },
                  { label: '2%', value: '2%' },
                  { label: '4%', value: '4%' },
                ]"
                @update:modelValue="updateElement"
              />

              <!-- Background Color -->
              <ColorPicker
                v-model="localElement.props.backgroundColor"
                label="Màu nền"
                color-type="background"
                default-color="transparent"
                :allow-transparent="true"
                @update:model-value="updateElement"
              />
            </div>
          </div>

          <!-- Background -->
          <div v-if="hasBackground" class="prop-section">
            <button
              @click="toggleSection('background')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-amber-500">
                  <i class="bi bi-paint-bucket"></i>
                </div>
                <span>Nền</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.background
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.background" class="prop-section-body">
              <ColorPicker
                v-model="localElement.style.backgroundColor"
                label="Màu nền"
                color-type="background"
                default-color="#ffffff"
                :allow-transparent="true"
                @update:model-value="updateElement"
              />
              <div class="prop-field">
                <label class="prop-label">Hình nền URL</label>
                <div class="flex items-center gap-1.5">
                  <input
                    :value="getBackgroundImageUrl"
                    @input="setBackgroundImageUrl($event.target.value)"
                    type="url"
                    class="prop-input flex-1"
                    placeholder="https://..."
                  />
                  <button
                    @click="clearBackgroundImage"
                    class="prop-btn prop-btn-secondary"
                    title="Xóa"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <div
                v-if="localElement.style.backgroundImage"
                class="prop-grid-2"
              >
                <div class="prop-field">
                  <label class="prop-label">Kích thước</label>
                  <select
                    v-model="localElement.style.backgroundSize"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div class="prop-field">
                  <label class="prop-label">Vị trí</label>
                  <select
                    v-model="localElement.style.backgroundPosition"
                    @change="updateElement"
                    class="prop-select"
                  >
                    <option value="center">Giữa</option>
                    <option value="top">Trên</option>
                    <option value="bottom">Dưới</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Spacing -->
          <div class="prop-section">
            <button
              @click="toggleSection('spacing')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500">
                  <i class="bi bi-arrows-expand"></i>
                </div>
                <span>Khoảng cách</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.spacing
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.spacing" class="prop-section-body">
              <SpacingControl
                :key="`padding-${selectedElement?.id || 'none'}`"
                v-model="localElement.style.padding"
                label="Padding"
                type="padding"
                @update:modelValue="updateElement"
              />
              <SpacingControl
                :key="`margin-${selectedElement?.id || 'none'}`"
                v-model="localElement.style.margin"
                label="Margin"
                type="margin"
                @update:modelValue="updateElement"
              />
            </div>
          </div>

          <!-- Border & Shadow (Universal for all elements) -->
          <div class="prop-section">
            <button
              @click="toggleSection('borderShadow')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div
                  class="prop-icon bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500"
                >
                  <i class="bi bi-bounding-box"></i>
                </div>
                <span>Viền & Đổ bóng</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.borderShadow
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div
              v-show="expandedSections.borderShadow"
              class="prop-section-body"
            >
              <!-- Border Width -->
              <div class="prop-field">
                <label class="prop-label">Độ dày viền</label>
                <div class="flex gap-1">
                  <button
                    v-for="w in ['0px', '1px', '2px', '3px', '4px']"
                    :key="w"
                    @click="
                      localElement.style.borderWidth = w;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs transition-all',
                      (localElement.style.borderWidth || '0px') === w
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{ w === "0px" ? "Không" : w }}
                  </button>
                </div>
              </div>

              <!-- Border Style (only show if border width > 0) -->
              <div
                v-if="
                  localElement.style.borderWidth &&
                  localElement.style.borderWidth !== '0px'
                "
                class="prop-field"
              >
                <label class="prop-label">Kiểu viền</label>
                <div class="flex gap-1">
                  <button
                    v-for="s in [
                      { v: 'solid', l: 'Liền', icon: '─' },
                      { v: 'dashed', l: 'Đứt', icon: '┄' },
                      { v: 'dotted', l: 'Chấm', icon: '┈' },
                      { v: 'double', l: 'Đôi', icon: '═' },
                    ]"
                    :key="s.v"
                    @click="
                      localElement.style.borderStyle = s.v;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-0.5',
                      (localElement.style.borderStyle || 'solid') === s.v
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <span class="text-base">{{ s.icon }}</span>
                    <span class="text-xs">{{ s.l }}</span>
                  </button>
                </div>
              </div>

              <!-- Border Color (only show if border width > 0) -->
              <div
                v-if="
                  localElement.style.borderWidth &&
                  localElement.style.borderWidth !== '0px'
                "
                class="prop-field"
              >
                <label class="prop-label">Màu viền</label>
                <div class="flex items-center gap-2">
                  <div
                    class="relative w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shadow-sm"
                  >
                    <input
                      type="color"
                      :value="localElement.style.borderColor || '#e5e7eb'"
                      @input="
                        localElement.style.borderColor = $event.target.value;
                        updateElement();
                      "
                      class="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div
                      class="w-full h-full"
                      :style="{
                        backgroundColor:
                          localElement.style.borderColor || '#e5e7eb',
                      }"
                    ></div>
                  </div>
                  <input
                    v-model="localElement.style.borderColor"
                    @input="updateElement"
                    type="text"
                    class="prop-input flex-1"
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>

              <div class="prop-divider"></div>

              <!-- Border Radius -->
              <div class="prop-field">
                <label class="prop-label">Bo góc (Border Radius)</label>
                <div class="flex gap-1 mb-2">
                  <button
                    v-for="r in [
                      '0px',
                      '4px',
                      '8px',
                      '12px',
                      '16px',
                      '24px',
                      '50%',
                    ]"
                    :key="r"
                    @click="
                      localElement.style.borderRadius = r;
                      updateElement();
                    "
                    :class="[
                      'flex-1 p-2 rounded-lg text-xs transition-all',
                      (localElement.style.borderRadius || '0px') === r
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    {{
                      r === "0px"
                        ? "0"
                        : r === "50%"
                          ? "●"
                          : r.replace("px", "")
                    }}
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    :value="parseInt(localElement.style.borderRadius) || 0"
                    @input="
                      localElement.style.borderRadius =
                        $event.target.value + 'px';
                      updateElement();
                    "
                    min="0"
                    max="50"
                    class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <input
                    :value="localElement.style.borderRadius || '0px'"
                    @input="
                      localElement.style.borderRadius = $event.target.value;
                      updateElement();
                    "
                    type="text"
                    class="w-16 px-2 py-1.5 text-xs text-center border border-slate-200 rounded-lg"
                    placeholder="0px"
                  />
                </div>
              </div>

              <div class="prop-divider"></div>

              <!-- Box Shadow -->
              <div class="prop-field">
                <label class="prop-label">Đổ bóng (Box Shadow)</label>
                <div class="grid grid-cols-3 gap-1 mb-2">
                  <button
                    @click="
                      localElement.style.boxShadow = 'none';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      !localElement.style.boxShadow ||
                      localElement.style.boxShadow === 'none'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <i class="bi bi-x-circle text-sm"></i>
                    <span>Không</span>
                  </button>
                  <button
                    @click="
                      localElement.style.boxShadow =
                        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      localElement.style.boxShadow ===
                      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <div class="w-6 h-4 bg-slate-300 rounded shadow-sm"></div>
                    <span>Nhẹ</span>
                  </button>
                  <button
                    @click="
                      localElement.style.boxShadow =
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      localElement.style.boxShadow ===
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <div class="w-6 h-4 bg-slate-300 rounded shadow"></div>
                    <span>Vừa</span>
                  </button>
                  <button
                    @click="
                      localElement.style.boxShadow =
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      localElement.style.boxShadow ===
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <div class="w-6 h-4 bg-slate-300 rounded shadow-md"></div>
                    <span>Lớn</span>
                  </button>
                  <button
                    @click="
                      localElement.style.boxShadow =
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      localElement.style.boxShadow ===
                      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <div class="w-6 h-4 bg-slate-300 rounded shadow-lg"></div>
                    <span>Rất lớn</span>
                  </button>
                  <button
                    @click="
                      localElement.style.boxShadow =
                        '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                      updateElement();
                    "
                    :class="[
                      'p-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1',
                      localElement.style.boxShadow ===
                      '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100',
                    ]"
                  >
                    <div class="w-6 h-4 bg-slate-300 rounded shadow-xl"></div>
                    <span>2XL</span>
                  </button>
                </div>

                <!-- Custom Box Shadow Input -->
                <div class="mt-2">
                  <label class="prop-label text-xs text-slate-400"
                    >Tùy chỉnh (CSS)</label
                  >
                  <input
                    v-model="localElement.style.boxShadow"
                    @input="updateElement"
                    type="text"
                    class="prop-input text-xs font-mono"
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Visibility -->
          <div class="prop-section">
            <button
              @click="toggleSection('visibility')"
              class="prop-section-header"
            >
              <div class="flex items-center gap-2">
                <div class="prop-icon bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500">
                  <i class="bi bi-eye"></i>
                </div>
                <span>Hiển thị</span>
              </div>
              <i
                :class="[
                  'bi transition-transform duration-200',
                  expandedSections.visibility
                    ? 'bi-chevron-up'
                    : 'bi-chevron-down',
                ]"
              ></i>
            </button>
            <div v-show="expandedSections.visibility" class="prop-section-body">
              <div class="space-y-2">
                <label
                  class="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-purple-300 transition-colors"
                >
                  <input
                    v-model="localElement.props.hideOnDesktop"
                    @change="updateElement"
                    type="checkbox"
                    class="prop-checkbox"
                  />
                  <div class="flex-1">
                    <div class="text-xs font-medium text-slate-700">
                      Ẩn trên Desktop
                    </div>
                    <div class="text-xs text-slate-400">>768px</div>
                  </div>
                  <i class="bi bi-display text-slate-400 text-sm"></i>
                </label>
                <label
                  class="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-purple-300 transition-colors"
                >
                  <input
                    v-model="localElement.props.hideOnMobile"
                    @change="updateElement"
                    type="checkbox"
                    class="prop-checkbox"
                  />
                  <div class="flex-1">
                    <div class="text-xs font-medium text-slate-700">
                      Ẩn trên Mobile
                    </div>
                    <div class="text-xs text-slate-400">≤768px</div>
                  </div>
                  <i class="bi bi-phone text-slate-400 text-sm"></i>
                </label>
                <label
                  class="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-purple-300 transition-colors"
                >
                  <input
                    v-model="localElement.props.hideOnTablet"
                    @change="updateElement"
                    type="checkbox"
                    class="prop-checkbox"
                  />
                  <div class="flex-1">
                    <div class="text-xs font-medium text-slate-700">
                      Ẩn trên Tablet
                    </div>
                    <div class="text-xs text-slate-400">769-1024px</div>
                  </div>
                  <i class="bi bi-tablet text-slate-400 text-sm"></i>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Global Settings Tab -->
      <div v-if="activeTab === 'global'" class="p-3 space-y-2">
        <!-- Layout Settings -->
        <div class="prop-section">
          <button @click="toggleSection('layout')" class="prop-section-header">
            <div class="flex items-center gap-2">
              <div class="prop-icon bg-blue-500">
                <i class="bi bi-layout-text-window"></i>
              </div>
              <span>Bố cục</span>
            </div>
            <i
              :class="[
                'bi transition-transform duration-200',
                expandedSections.layout ? 'bi-chevron-up' : 'bi-chevron-down',
              ]"
            ></i>
          </button>
          <div v-show="expandedSections.layout" class="prop-section-body">
            <div class="prop-field">
              <label class="prop-label">Chiều rộng email</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model.number="localGlobalSettings.contentWidth"
                  @input="updateGlobalSettings"
                  type="number"
                  min="500"
                  max="800"
                  step="10"
                  class="prop-input flex-1"
                />
                <span class="text-xs text-slate-500">px</span>
              </div>
              <div class="flex gap-1 mt-1.5">
                <button
                  v-for="preset in [500, 600, 700, 800, 900]"
                  :key="preset"
                  @click="setContentWidthPreset(preset)"
                  :class="[
                    'px-2 py-0.5 text-xs rounded transition-colors',
                    localGlobalSettings.contentWidth === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600',
                  ]"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
            <div class="prop-field">
              <label class="prop-label">Căn chỉnh</label>
              <div class="flex gap-1">
                <button
                  v-for="align in ['left', 'center', 'right']"
                  :key="align"
                  @click="
                    localGlobalSettings.textAlign = align;
                    updateGlobalSettings();
                  "
                  :class="[
                    'flex-1 p-1.5 rounded-lg text-xs transition-colors',
                    localGlobalSettings.textAlign === align
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                  ]"
                >
                  <i
                    :class="[
                      'bi',
                      align === 'left'
                        ? 'bi-text-left'
                        : align === 'center'
                          ? 'bi-text-center'
                          : 'bi-text-right',
                    ]"
                  ></i>
                </button>
              </div>
            </div>
            <div class="prop-field">
              <label class="prop-label">Khoảng cách phần tử</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model.number="localGlobalSettings.elementGap"
                  @input="updateGlobalSettings"
                  type="number"
                  min="0"
                  max="100"
                  step="4"
                  class="prop-input w-16"
                />
                <span class="text-xs text-slate-500">px</span>
                <div class="flex gap-1 ml-auto">
                  <button
                    v-for="gap in [0, 8, 16, 24]"
                    :key="gap"
                    @click="
                      localGlobalSettings.elementGap = gap;
                      updateGlobalSettings();
                    "
                    :class="[
                      'px-1.5 py-0.5 text-xs rounded',
                      localGlobalSettings.elementGap === gap
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500',
                    ]"
                  >
                    {{ gap }}
                  </button>
                </div>
              </div>
            </div>
            <SpacingControl
              :key="`global-padding`"
              v-model="localGlobalSettings.padding"
              label="Padding"
              type="padding"
              @update:modelValue="updateGlobalSettings"
            />
            <SpacingControl
              :key="`global-margin`"
              v-model="localGlobalSettings.margin"
              label="Margin"
              type="margin"
              @update:modelValue="updateGlobalSettings"
            />
          </div>
        </div>

        <!-- Typography Settings -->
        <div class="prop-section">
          <button
            @click="toggleSection('globalTypography')"
            class="prop-section-header"
          >
            <div class="flex items-center gap-2">
              <div class="prop-icon bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500">
                <i class="bi bi-fonts"></i>
              </div>
              <span>Kiểu chữ</span>
            </div>
            <i
              :class="[
                'bi transition-transform duration-200',
                expandedSections.globalTypography
                  ? 'bi-chevron-up'
                  : 'bi-chevron-down',
              ]"
            ></i>
          </button>
          <div
            v-show="expandedSections.globalTypography"
            class="prop-section-body"
          >
            <div class="prop-field">
              <label class="prop-label">Font chữ</label>
              <select
                v-model="localGlobalSettings.fontFamily"
                @change="updateGlobalSettings"
                class="prop-select"
              >
                <optgroup label="Sans-Serif">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Helvetica Neue', Helvetica, sans-serif">
                    Helvetica
                  </option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Segoe UI', sans-serif">Segoe UI</option>
                </optgroup>
                <optgroup label="Serif">
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                </optgroup>
              </select>
            </div>
            <div class="prop-grid-2">
              <div class="prop-field">
                <label class="prop-label">Cỡ chữ</label>
                <div class="flex items-center gap-1">
                  <input
                    v-model.number="fontSizeValue"
                    @input="updateGlobalFontSize"
                    type="number"
                    min="10"
                    max="24"
                    class="prop-input flex-1"
                  />
                  <select
                    v-model="fontSizeUnit"
                    @change="updateGlobalFontSize"
                    class="prop-select w-14"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                  </select>
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Chiều cao dòng</label>
                <input
                  v-model="localGlobalSettings.lineHeight"
                  @input="updateGlobalSettings"
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  class="prop-input"
                />
              </div>
            </div>
            <div class="prop-grid-2">
              <div class="prop-field">
                <label class="prop-label">Màu chữ</label>
                <div class="prop-color-row">
                  <input
                    :value="localGlobalSettings.textColor || '#000000'"
                    @input="
                      localGlobalSettings.textColor = $event.target.value;
                      updateGlobalSettings();
                    "
                    type="color"
                    class="prop-color-input"
                  />
                  <input
                    v-model="localGlobalSettings.textColor"
                    @input="updateGlobalSettings"
                    type="text"
                    class="prop-input flex-1"
                  />
                </div>
              </div>
              <div class="prop-field">
                <label class="prop-label">Màu link</label>
                <div class="prop-color-row">
                  <input
                    :value="localGlobalSettings.linkColor || '#3b82f6'"
                    @input="
                      localGlobalSettings.linkColor = $event.target.value;
                      updateGlobalSettings();
                    "
                    type="color"
                    class="prop-color-input"
                  />
                  <input
                    v-model="localGlobalSettings.linkColor"
                    @input="updateGlobalSettings"
                    type="text"
                    class="prop-input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Background Settings -->
        <div class="prop-section">
          <button
            @click="toggleSection('globalBackground')"
            class="prop-section-header"
          >
            <div class="flex items-center gap-2">
              <div class="prop-icon bg-emerald-500">
                <i class="bi bi-paint-bucket"></i>
              </div>
              <span>Nền</span>
            </div>
            <i
              :class="[
                'bi transition-transform duration-200',
                expandedSections.globalBackground
                  ? 'bi-chevron-up'
                  : 'bi-chevron-down',
              ]"
            ></i>
          </button>
          <div
            v-show="expandedSections.globalBackground"
            class="prop-section-body"
          >
            <div class="prop-field">
              <label class="prop-label">Màu nền</label>
              <div class="prop-color-row">
                <input
                  :value="
                    localGlobalSettings.backgroundColor &&
                    localGlobalSettings.backgroundColor !== 'transparent'
                      ? localGlobalSettings.backgroundColor
                      : '#ffffff'
                  "
                  @input="
                    localGlobalSettings.backgroundColor = $event.target.value;
                    updateGlobalSettings();
                  "
                  type="color"
                  class="prop-color-input"
                />
                <input
                  v-model="localGlobalSettings.backgroundColor"
                  @input="updateGlobalSettings"
                  type="text"
                  class="prop-input flex-1"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div class="prop-field">
              <label class="prop-label">Hình nền URL</label>
              <input
                :value="getGlobalBackgroundImageUrl"
                @input="setGlobalBackgroundImageUrl($event.target.value)"
                type="url"
                class="prop-input"
                placeholder="https://..."
              />
            </div>
            <div v-if="localGlobalSettings.backgroundImage" class="prop-grid-2">
              <div class="prop-field">
                <label class="prop-label">Kích thước</label>
                <select
                  v-model="localGlobalSettings.backgroundSize"
                  @change="updateGlobalSettings"
                  class="prop-select"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div class="prop-field">
                <label class="prop-label">Vị trí</label>
                <select
                  v-model="localGlobalSettings.backgroundPosition"
                  @change="updateGlobalSettings"
                  class="prop-select"
                >
                  <option value="center">Giữa</option>
                  <option value="top">Trên</option>
                  <option value="bottom">Dưới</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Upload Modal -->
      <ImageUploadModal
        v-if="showImageModal"
        @close="showImageModal = false"
        @select="handleImageSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
// Control Components
import SpacingControl from "../controls/SpacingControl.vue";
import UnitControl from "../controls/UnitControl.vue";
import TextStyleControl from "../controls/TextStyleControl.vue";
import ColorPicker from "../controls/ColorPicker.vue";
import TypographyControl from "../controls/TypographyControl.vue";
import IconControl from "../controls/IconControl.vue";
// New Atomic Controls
import AlignmentControl from "../controls/AlignmentControl.vue";
import ColorGridControl from "../controls/ColorGridControl.vue";
import FontSizeControl from "../controls/FontSizeControl.vue";
import FontWeightControl from "../controls/FontWeightControl.vue";
import FontStyleControl from "../controls/FontStyleControl.vue";
import FontFamilyControl from "../controls/FontFamilyControl.vue";
import ImagePreviewControl from "../controls/ImagePreviewControl.vue";
import RatingControl from "../controls/RatingControl.vue";
import LinkListControl from "../controls/LinkListControl.vue";
import SelectControl from "../controls/SelectControl.vue";
import CheckboxControl from "../controls/CheckboxControl.vue";
// Modal Components
import ImageUploadModal from "../modals/ImageUploadModal.vue";
import AiHtmlGenerator from "../modals/AiHtmlGenerator.vue";

const props = defineProps({
  selectedElement: {
    type: Object,
    default: null,
  },
  globalSettings: {
    type: Object,
    default: () => ({}),
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update-element",
  "update-global",
  "upload-image",
  "toggle-panel",
  "close-panel",
  "open-html-editor",
]);

const activeTab = ref("element");
const showImageModal = ref(false);
const processingOverlay = ref(false);
const localElement = ref({
  props: {},
  style: {
    padding: "0",
    margin: "0",
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: "0px",
    boxShadow: "none",
  },
});
const localGlobalSettings = ref({});
const isUpdatingGlobal = ref(false);

// Collapsible sections state
const expandedSections = ref({
  content: true,
  url: true,
  social: true,
  html: true,
  ctaBlock: true,
  testimonial: true,
  productCard: true,
  socialLinks: true,
  header: true,
  footer: true,
  productGrid: true,
  couponCode: true,
  cartReminder: true,
  orderSummary: true,
  propertyCard: true,
  propertyFeatures: true,
  locationMap: true,
  jobListing: true,
  benefitsList: true,
  unsubscribe: true,
  quote: true,
  video: true,
  image: true,
  typography: true,
  background: true,
  spacing: true,
  border: true,
  visibility: true,
  layout: true,
  globalTypography: true,
  globalBackground: true,
  borderShadow: true,
  // Banking elements
  transactionCard: true,
  accountBalance: true,
  creditCardInfo: true,
  // Gaming/Course elements
  courseCard: true,
  gameItemCard: true,
  achievementBadge: true,
  progressBar: true,
  // F&B/Hotel elements
  menuItem: true,
  roomCard: true,
  bookingSummary: true,
  ratingReview: true,
  // Recruitment elements
  companyIntro: true,
  applyButton: true,
});

const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Global Settings Unit States
const fontSizeValue = ref(16);
const fontSizeUnit = ref("px");

// Set contentWidth preset
const setContentWidthPreset = (value) => {
  localGlobalSettings.value.contentWidth = value;
  updateGlobalSettings();
};

// Parse and update fontSize
const parseFontSize = (value) => {
  if (!value) return;
  const match = String(value).match(/^(-?\d+\.?\d*)(px|rem|em)?$/);
  if (match) {
    fontSizeValue.value = parseFloat(match[1]) || 16;
    fontSizeUnit.value = match[2] || "px";
  }
};

// Update global fontSize with validation
const updateGlobalFontSize = () => {
  // Validate and limit fontSize values
  let validValue = fontSizeValue.value;
  if (fontSizeUnit.value === "px") {
    validValue = Math.min(Math.max(validValue, 10), 32); // 10px to 32px
  } else if (fontSizeUnit.value === "rem") {
    validValue = Math.min(Math.max(validValue, 0.5), 2); // 0.5rem to 2rem
  } else if (fontSizeUnit.value === "em") {
    validValue = Math.min(Math.max(validValue, 0.5), 2); // 0.5em to 2em
  }
  fontSizeValue.value = validValue;
  localGlobalSettings.value.fontSize = `${validValue}${fontSizeUnit.value}`;
  updateGlobalSettings();
};

// Set fontSize preset
const setFontSizePreset = (value) => {
  fontSizeValue.value = value;
  fontSizeUnit.value = "px";
  updateGlobalFontSize();
};

// Default prop values for each element type (matching EmailCanvas rendering)
const getDefaultProps = (type) => {
  const defaults = {
    // Media elements (% width only, no height/verticalAlign)
    image: {
      width: "100%",
      align: "center",
      borderRadius: "0",
      borderWidth: "0",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    video: {
      width: "100%",
      align: "center",
      borderRadius: "0",
      borderWidth: "0",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      videoType: "file",
      controls: true,
    },
    // CTA and simple elements
    "cta-block": {
      align: "center",
      fontSize: "20px",
      fontWeight: "bold",
      fontStyle: "normal",
      bgColor: "#4f46e5",
      titleColor: "#ffffff",
      buttonBgColor: "#ffffff",
      buttonTextColor: "#4f46e5",
    },
    testimonial: {
      align: "center",
      fontSize: "16px",
      fontWeight: "normal",
      fontStyle: "normal",
      bgColor: "#ffffff",
      textColor: "#374151",
      starColor: "#f59e0b",
      borderColor: "#3b82f6",
      rating: 5,
    },
    "product-card": {
      align: "center",
      fontSize: "22px",
      fontWeight: "600",
      fontStyle: "normal",
      bgColor: "#ffffff",
      textColor: "#1f2937",
      priceColor: "#1f2937",
      oldPriceColor: "#9ca3af",
      buttonBgColor: "#2563eb",
      rating: 5,
      reviews: 128,
      inStock: false,
    },
    quote: {
      align: "left",
      fontSize: "18px",
      fontWeight: "normal",
      fontStyle: "italic",
      bgColor: "#f8fafc",
      textColor: "#374151",
      borderColor: "#3b82f6",
    },
    unsubscribe: {
      align: "center",
      fontSize: "12px",
      textColor: "#6b7280",
      linkColor: "#3b82f6",
    },
    // E-commerce elements
    "product-grid": {
      bgColor: "#f8fafc",
      titleColor: "#0f172a",
      priceColor: "#2563eb",
      align: "center",
      fontSize: "20px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      cardBgColor: "#ffffff",
      cardBorderColor: "#e5e7eb",
      cardBorderWidth: "1px",
      cardBorderRadius: "12px",
      cardPadding: "0px",
      productNameColor: "#1f2937",
      oldPriceColor: "#9ca3af",
      imageHeight: "140px",
      imageBorderRadius: "0px",
      imageShape: "rectangle",
      iconBgColor: "#dbeafe",
      iconColor: "#3b82f6",
      columns: 3,
      products: [
        {
          name: "Sản phẩm 1",
          price: "199.000đ",
          oldPrice: "299.000đ",
          image: "https://placehold.co/300x200/e2e8f0/64748b?text=SP1",
          url: "#",
        },
        {
          name: "Sản phẩm 2",
          price: "299.000đ",
          oldPrice: "",
          image: "https://placehold.co/300x200/e2e8f0/64748b?text=SP2",
          url: "#",
        },
        {
          name: "Sản phẩm 3",
          price: "399.000đ",
          oldPrice: "499.000đ",
          image: "https://placehold.co/300x200/e2e8f0/64748b?text=SP3",
          url: "#",
        },
      ],
    },
    "coupon-code": {
      bgColor: "#fffbeb",
      borderColor: "#f59e0b",
      codeColor: "#d97706",
      iconBgColor: "#f59e0b",
      iconColor: "#ffffff",
    },
    "cart-reminder": {
      bgColor: "#fff7ed",
      borderColor: "#f97316",
      titleColor: "#1f2937",
      buttonBgColor: "#f97316",
      buttonTextColor: "#ffffff",
      align: "center",
      fontSize: "20px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#fed7aa",
      iconColor: "#f97316",
    },
    "order-summary": {
      bgColor: "#ffffff",
      borderColor: "#e5e7eb",
      titleColor: "#1f2937",
      totalColor: "#2563eb",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#dbeafe",
      iconColor: "#3b82f6",
    },
    // Real estate elements
    "property-card": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      priceColor: "#2563eb",
      align: "left",
      fontSize: "22px",
      fontWeight: "700",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      imageHeight: "200px",
      imageShape: "rectangle",
      locationIconUrl: "https://img.icons8.com/fluency/48/marker.png",
      locationIconBgColor: "#fee2e2",
      areaIconUrl: "https://img.icons8.com/fluency/48/expand.png",
      areaIconBgColor: "#fef3c7",
      bedroomsIconUrl: "https://img.icons8.com/fluency/48/open-door.png",
      bedroomsIconBgColor: "#e0e7ff",
      bathroomsIconUrl: "https://img.icons8.com/fluency/48/water.png",
      bathroomsIconBgColor: "#cffafe",
    },
    "property-features": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      textColor: "#374151",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#dcfce7",
      iconColor: "#22c55e",
      itemBgColor: "#f9fafb",
    },
    "location-map": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      textColor: "#6b7280",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#fee2e2",
      iconColor: "#ef4444",
    },
    // Job listing elements
    "job-listing": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      companyColor: "#2563eb",
      buttonBgColor: "#2563eb",
      buttonTextColor: "#ffffff",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#2563eb",
    },
    "benefits-list": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      textColor: "#374151",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#dcfce7",
      iconColor: "#22c55e",
    },
    // Banking elements
    "transaction-card": {
      bgColor: "#f0fdf4",
      borderColor: "#22c55e",
      titleColor: "#15803d",
      amountColor: "#16a34a",
      textColor: "#374151",
      align: "left",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#dcfce7",
      iconColor: "#22c55e",
    },
    "credit-card-info": {
      bgColor: "#1e3a8a",
      textColor: "#ffffff",
      titleColor: "#ffffff",
      align: "left",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
    },
    // Gaming/Course elements
    "course-card": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      priceColor: "#dc2626",
      textColor: "#6b7280",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      starColor: "#fbbf24",
    },
    "game-item-card": {
      bgColor: "#fffbeb",
      borderColor: "#f59e0b",
      titleColor: "#78350f",
      textColor: "#92400e",
      align: "center",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
    },
    "achievement-badge": {
      bgColor: "#fffbeb",
      borderColor: "#f59e0b",
      titleColor: "#78350f",
      textColor: "#92400e",
      align: "center",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#fde68a",
      iconColor: "#f59e0b",
    },
    "progress-bar": {
      bgColor: "transparent",
      barColor: "#3b82f6",
      trackColor: "#e5e7eb",
      titleColor: "#1f2937",
      textColor: "#6b7280",
      align: "left",
      fontSize: "14px",
      fontWeight: "normal",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
    },
    // F&B/Hotel elements
    "menu-item": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      priceColor: "#dc2626",
      textColor: "#6b7280",
      align: "left",
      fontSize: "18px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
    },
    "room-card": {
      bgColor: "#ffffff",
      titleColor: "#1f2937",
      priceColor: "#059669",
      textColor: "#6b7280",
      align: "left",
      fontSize: "20px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      starColor: "#fbbf24",
    },
    "booking-summary": {
      bgColor: "#ffffff",
      borderColor: "#e5e7eb",
      titleColor: "#1f2937",
      totalColor: "#059669",
      textColor: "#374151",
      align: "left",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      iconBgColor: "#d1fae5",
      iconColor: "#059669",
    },
    "rating-review": {
      bgColor: "#ffffff",
      borderColor: "#e5e7eb",
      titleColor: "#1f2937",
      textColor: "#374151",
      align: "left",
      fontSize: "14px",
      fontWeight: "normal",
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      starColor: "#fbbf24",
    },
  };
  return defaults[type] || {};
};

// Initialize props with defaults if undefined
const initializePropsWithDefaults = (element) => {
  if (!element || !element.props) return element;

  const defaults = getDefaultProps(element.type);
  for (const [key, value] of Object.entries(defaults)) {
    if (
      element.props[key] === undefined ||
      element.props[key] === null ||
      element.props[key] === ""
    ) {
      element.props[key] = value;
    }
  }
  return element;
};

// Get element-specific default styles (matching EmailCanvas getDefaultStyle)
const getElementDefaultStyle = (type) => {
  const defaults = {
    "location-map": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "property-card": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "property-features": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "agent-contact": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "job-listing": {
      backgroundColor: "#ffffff",
      padding: "20px",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "benefits-list": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "cta-block": {
      backgroundColor: "#f9fafb",
      padding: "32px",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    testimonial: {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "product-card": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    footer: {
      backgroundColor: "#1f2937",
      padding: "32px 24px",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    header: {
      backgroundColor: "#1f2937",
      padding: "1 1 1 1",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "hero-banner": {
      backgroundColor: "#3b82f6",
      padding: "48px",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "cart-reminder": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "order-summary": {
      backgroundColor: "#ffffff",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "coupon-code": {
      backgroundColor: "#fef3c7",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "2px",
      borderStyle: "dashed",
      borderColor: "#f59e0b",
    },
    button: {
      backgroundColor: "#3b82f6",
      padding: "12px 24px",
      margin: "0",
      borderRadius: "6px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    image: {
      padding: "0",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    video: {
      padding: "0",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    unsubscribe: {
      backgroundColor: "transparent",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "product-grid": {
      backgroundColor: "#f8fafc",
      padding: "2 2 2 2",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    // Banking elements
    "transaction-card": {
      backgroundColor: "#f0fdf4",
      padding: "1.5rem",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#22c55e",
    },
    "credit-card-info": {
      backgroundColor: "#1e3a8a",
      padding: "1.5rem",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "transparent",
    },
    // Gaming/Course elements
    "course-card": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "game-item-card": {
      backgroundColor: "#fffbeb",
      padding: "1rem",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#f59e0b",
    },
    "achievement-badge": {
      backgroundColor: "#fffbeb",
      padding: "1.25rem",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#f59e0b",
    },
    "progress-bar": {
      backgroundColor: "transparent",
      padding: "1rem",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "transparent",
    },
    // F&B/Hotel elements
    "menu-item": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "room-card": {
      backgroundColor: "#ffffff",
      padding: "0",
      margin: "0",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "booking-summary": {
      backgroundColor: "#ffffff",
      padding: "1.5rem",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
    "rating-review": {
      backgroundColor: "#ffffff",
      padding: "1.25rem",
      margin: "0",
      borderRadius: "12px",
      boxShadow: "none",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    },
  };
  return (
    defaults[type] || {
      padding: "0",
      margin: "0",
      borderRadius: "0px",
      boxShadow: "none",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
    }
  );
};

// Initialize style object to ensure all properties exist
const initializeStyleObject = (element) => {
  if (!element) return element;

  // Ensure style object exists
  if (!element.style) {
    element.style = {};
  }

  // Get element-specific defaults
  const elementDefaults = getElementDefaultStyle(element.type);

  // Some elements use props for visual styling (padding, borderRadius, etc.)
  // We need to sync these to style so PropertiesPanel can read/write them correctly
  const propsToStyleMapping = {
    padding: "padding",
    margin: "margin",
    borderRadius: "borderRadius",
    borderWidth: "borderWidth",
    borderStyle: "borderStyle",
    borderColor: "borderColor",
    boxShadow: "boxShadow",
    backgroundColor: "backgroundColor",
    bgColor: "backgroundColor", // Some elements use bgColor in props
  };

  // Copy values from props to style if style doesn't have them
  if (element.props) {
    for (const [propKey, styleKey] of Object.entries(propsToStyleMapping)) {
      if (
        element.props[propKey] !== undefined &&
        element.props[propKey] !== null &&
        element.props[propKey] !== ""
      ) {
        // Only copy if style doesn't already have a value
        if (
          element.style[styleKey] === undefined ||
          element.style[styleKey] === null ||
          element.style[styleKey] === ""
        ) {
          element.style[styleKey] = element.props[propKey];
        }
      }
    }
  }

  // Apply element-specific defaults for properties that are still missing
  for (const [key, defaultValue] of Object.entries(elementDefaults)) {
    if (
      element.style[key] === undefined ||
      element.style[key] === null ||
      element.style[key] === ""
    ) {
      element.style[key] = defaultValue;
    }
  }

  return element;
};

// Watch for selected element changes
watch(
  () => props.selectedElement,
  (newElement) => {
    if (newElement) {
      let cloned = JSON.parse(JSON.stringify(newElement));
      cloned = initializePropsWithDefaults(cloned);
      cloned = initializeStyleObject(cloned);
      localElement.value = cloned;
    }
  },
  { immediate: true, deep: true },
);

// Watch for global settings changes (only when not updating from local)
watch(
  () => props.globalSettings,
  (newSettings) => {
    if (newSettings && !isUpdatingGlobal.value) {
      localGlobalSettings.value = JSON.parse(JSON.stringify(newSettings));
      // Parse fontSize only (contentWidth is already a number)
      if (newSettings.fontSize) parseFontSize(newSettings.fontSize);
    }
  },
  { immediate: true, deep: true },
);

// Computed properties for conditional rendering
const hasContentProp = computed(() => {
  return [
    "heading1",
    "heading2",
    "heading3",
    "text",
    "button",
    "link",
  ].includes(props.selectedElement?.type);
});

const hasUrlProp = computed(() => {
  return ["button", "link"].includes(props.selectedElement?.type);
});

const hasTextStyles = computed(() => {
  return [
    "heading1",
    "heading2",
    "heading3",
    "text",
    "button",
    "link",
    "quote",
  ].includes(props.selectedElement?.type);
});

const hasBackground = computed(() => {
  return [
    "button",
    "row",
    "row2",
    "row3",
    "row4",
    "columns2",
    "columns3",
    "columns4",
    "hero-banner",
    "cta-block",
    "header",
    "footer",
    "quote",
    "product-grid",
    "unsubscribe",
  ].includes(props.selectedElement?.type);
});

const isLayoutElement = computed(() => {
  return ["row2", "row3", "row4", "columns2", "columns3", "columns4"].includes(
    props.selectedElement?.type,
  );
});

const isCustomElement = computed(() => {
  return [
    "cta-block",
    "testimonial",
    "product-card",
    "footer",
    "header",
    // E-commerce
    "product-grid",
    "coupon-code",
    "cart-reminder",
    "order-summary",
    // Real Estate
    "property-card",
    "property-features",
    "location-map",
    // Recruitment
    "job-listing",
    "benefits-list",
    // Banking
    "transaction-card",
    "credit-card-info",
    // Gaming/Course
    "course-card",
    "game-item-card",
    "achievement-badge",
    "progress-bar",
    // F&B/Hotel
    "menu-item",
    "room-card",
    "booking-summary",
    "rating-review",
    // Utility
    "unsubscribe",
  ].includes(props.selectedElement?.type);
});

// Get element name for display
const getElementName = (type) => {
  const names = {
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    text: "Text",
    button: "Button",
    image: "Image",
    video: "Video",
    link: "Link",
    divider: "Divider",
    spacer: "Spacer",
    html: "HTML",
    section: "Section",
    row: "Row",
    container: "Container",
    columns2: "2 Columns",
    columns3: "3 Columns",
    columns4: "4 Columns",
    row2: "2 Rows",
    row3: "3 Rows",
    row4: "4 Rows",
    "cta-block": "CTA Block",
    "hero-banner": "Hero Banner",
    testimonial: "Testimonial",
    "product-card": "Product Card",
    header: "Header",
    footer: "Footer",

    quote: "Quote",
    "social-facebook": "Facebook",
    "social-twitter": "Twitter",
    "social-instagram": "Instagram",
    "social-linkedin": "LinkedIn",
    // E-commerce
    "product-grid": "Product Grid",
    "coupon-code": "Coupon Code",
    "cart-reminder": "Cart Reminder",
    "order-summary": "Order Summary",
    // Real Estate
    "property-card": "Property Card",
    "property-features": "Property Features",
    "location-map": "Location Map",
    // Recruitment
    "job-listing": "Job Listing",
    "benefits-list": "Benefits List",
    // Banking
    "transaction-card": "Giao Dịch",
    "credit-card-info": "Thẻ Tín Dụng",
    // Gaming/Course
    "course-card": "Khóa Học",
    "progress-bar": "Tiến Độ",
    // F&B/Hotel
    "menu-item": "Món Ăn",
    "room-card": "Phòng KS",
    "booking-summary": "Đặt Phòng",
    "rating-review": "Đánh Giá",
    // Utility
    unsubscribe: "Unsubscribe",
  };
  return names[type] || type;
};

// Font size handling
const fontSize = computed({
  get: () => {
    if (!localElement.value?.style?.fontSize) return 16;
    return parseInt(localElement.value.style.fontSize);
  },
  set: (value) => {
    if (localElement.value) {
      localElement.value.style.fontSize = value + "px";
      updateElement();
    }
  },
});

// Update element
const updateElement = () => {
  if (localElement.value) {
    // Sync style back to props for elements that use props for visual rendering
    // This ensures the canvas renders correctly when user changes values in PropertiesPanel
    const styleToPropsMapping = {
      padding: "padding",
      margin: "margin",
      borderRadius: "borderRadius",
      borderWidth: "borderWidth",
      borderStyle: "borderStyle",
      borderColor: "borderColor",
      boxShadow: "boxShadow",
      backgroundColor: "bgColor", // Some elements use bgColor in props
    };

    if (localElement.value.props && localElement.value.style) {
      for (const [styleKey, propKey] of Object.entries(styleToPropsMapping)) {
        if (
          localElement.value.style[styleKey] !== undefined &&
          localElement.value.style[styleKey] !== null
        ) {
          localElement.value.props[propKey] =
            localElement.value.style[styleKey];
        }
      }
      // Also sync backgroundColor to backgroundColor prop (some elements use this)
      if (localElement.value.style.backgroundColor) {
        localElement.value.props.backgroundColor =
          localElement.value.style.backgroundColor;
      }
    }

    // Emit the full element object with all updates
    emit("update-element", JSON.parse(JSON.stringify(localElement.value)));
  }
};

// Apply AI-generated HTML to element
const applyAiHtml = (html) => {
  if (localElement.value && localElement.value.props) {
    localElement.value.props.children = html;
    updateElement();
  }
};

// Social platform helpers
const getSocialIcon = (platform) => {
  const icons = {
    facebook: "bi bi-facebook",
    twitter: "bi bi-twitter",
    instagram: "bi bi-instagram",
    linkedin: "bi bi-linkedin",
    youtube: "bi bi-youtube",
    tiktok: "bi bi-tiktok",
    github: "bi bi-github",
  };
  return icons[platform] || "bi bi-link-45deg";
};

const getSocialColor = (platform) => {
  const colors = {
    facebook: "#1877f2",
    twitter: "#1da1f2",
    instagram: "#e4405f",
    linkedin: "#0077b5",
    youtube: "#ff0000",
    tiktok: "#000000",
    github: "#333333",
  };
  return colors[platform] || "#666666";
};

const addSocialLink = () => {
  if (!localElement.value.props.links) {
    localElement.value.props.links = [];
  }
  localElement.value.props.links.push({
    platform: "facebook",
    url: "https://facebook.com",
    enabled: true,
    logo: "", // Optional custom logo URL
  });
  updateElement();
};

const removeSocialLink = (index) => {
  if (localElement.value.props.links) {
    localElement.value.props.links.splice(index, 1);
    updateElement();
  }
};

// Footer social management
const addFooterSocial = () => {
  if (!localElement.value.props.socials) {
    localElement.value.props.socials = [];
  }
  localElement.value.props.socials.push({
    platform: "facebook",
    url: "https://facebook.com",
    logo: "", // Optional custom logo URL
  });
  updateElement();
};

const removeFooterSocial = (index) => {
  if (localElement.value.props.socials) {
    localElement.value.props.socials.splice(index, 1);
    updateElement();
  }
};

// Header nav link management
const addNavLink = () => {
  if (!localElement.value.props.navLinks) {
    localElement.value.props.navLinks = [];
  }
  localElement.value.props.navLinks.push({ text: "New Link", url: "#" });
  updateElement();
};

const removeNavLink = (index) => {
  if (localElement.value.props.navLinks) {
    localElement.value.props.navLinks.splice(index, 1);
    updateElement();
  }
};

// Layout border sides management
const getLayoutBorderSide = (side) => {
  const sides = localElement.value.props.borderSides || {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };
  return sides[side];
};

const toggleLayoutBorderSide = (side) => {
  if (!localElement.value.props.borderSides) {
    localElement.value.props.borderSides = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }
  localElement.value.props.borderSides[side] =
    !localElement.value.props.borderSides[side];
  updateElement();
};

// Product Grid management
const addProduct = () => {
  if (!localElement.value.props.products)
    localElement.value.props.products = [];
  localElement.value.props.products.push({
    name: "",
    price: "",
    oldPrice: "",
    image: "",
  });
  updateElement();
};
const removeProduct = (index) => {
  localElement.value.props.products?.splice(index, 1);
  updateElement();
};

// Order Summary management
const addOrderItem = () => {
  if (!localElement.value.props.items) localElement.value.props.items = [];
  localElement.value.props.items.push({ name: "", quantity: 1, price: "" });
  updateElement();
};
const removeOrderItem = (index) => {
  localElement.value.props.items?.splice(index, 1);
  updateElement();
};

// Property Features management
const addFeature = () => {
  if (!localElement.value.props.features)
    localElement.value.props.features = [];
  localElement.value.props.features.push("");
  updateElement();
};
const removeFeature = (index) => {
  localElement.value.props.features?.splice(index, 1);
  updateElement();
};

// Benefits List management
const addBenefit = () => {
  if (!localElement.value.props.benefits)
    localElement.value.props.benefits = [];
  localElement.value.props.benefits.push("");
  updateElement();
};
const removeBenefit = (index) => {
  localElement.value.props.benefits?.splice(index, 1);
  updateElement();
};

// Update font size
const updateFontSize = () => {
  updateElement();
};

// Set text alignment
const setTextAlign = (align) => {
  if (localElement.value) {
    localElement.value.style.textAlign = align;
    updateElement();
  }
};

// Update global settings
const updateGlobalSettings = () => {
  isUpdatingGlobal.value = true;
  emit("update-global", localGlobalSettings.value);
  nextTick(() => {
    isUpdatingGlobal.value = false;
  });
};

// Handle image selection
const handleImageSelect = (url) => {
  if (localElement.value) {
    if (localElement.value.type === "image") {
      localElement.value.props.src = url;
    }
    updateElement();
  }
};

// Combined overlay generation (handles both Text and QR)
const runtimeConfig = useRuntimeConfig();
const { success, warning, error: showError } = useToast();

const generateCombinedOverlay = async () => {
  if (!localElement.value?.props?.src) {
    showError("Vui lòng chọn ảnh trước");
    return;
  }

  const hasText =
    localElement.value.props.enableTextOverlay &&
    localElement.value.props.overlayText;
  const hasQR = localElement.value.props.enableQROverlay;

  if (!hasText && !hasQR) {
    showError("Vui lòng bật Text hoặc QR overlay");
    return;
  }

  processingOverlay.value = true;

  try {
    const apiBaseUrl =
      runtimeConfig.public.apiBase || "http://localhost:8000/api";

    // Store original image URL on first overlay creation
    if (!localElement.value.props.originalImageUrl) {
      localElement.value.props.originalImageUrl = localElement.value.props.src;
    }

    const baseImageUrl = localElement.value.props.originalImageUrl;
    let currentImageUrl = baseImageUrl;
    let hasDynamicContent = false;
    const messages = [];

    // Check if text has dynamic fields
    const textHasDynamicFields =
      hasText && /\{\{\s*\w+\s*\}\}/.test(localElement.value.props.overlayText);

    // Process Text Overlay
    if (hasText) {
      if (textHasDynamicFields) {
        // Dynamic text - save config for backend
        localElement.value.props.overlayConfig = {
          text: localElement.value.props.overlayText,
          align: localElement.value.props.overlayAlign || "center",
          top: localElement.value.props.overlayTop || 50,
          fontSize: localElement.value.props.overlayFontSize || 48,
          color: localElement.value.props.overlayColor || "#ffffff",
          fontFamily: localElement.value.props.overlayFontFamily || "Arial",
          fontWeight: localElement.value.props.overlayFontWeight || "bold",
        };
        hasDynamicContent = true;
        messages.push("Text động (render khi gửi)");
      } else {
        // Static text - render now
        const response = await fetch(`${apiBaseUrl}/images/text-overlay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: currentImageUrl,
            text: localElement.value.props.overlayText,
            align: localElement.value.props.overlayAlign || "center",
            top: localElement.value.props.overlayTop || 50,
            fontSize: localElement.value.props.overlayFontSize || 48,
            color: localElement.value.props.overlayColor || "#ffffff",
            fontFamily: localElement.value.props.overlayFontFamily || "Arial",
            fontWeight: localElement.value.props.overlayFontWeight || "bold",
          }),
        });
        const data = await response.json();
        if (data.success && data.dataUrl) {
          currentImageUrl = data.dataUrl;
          localElement.value.props.overlayProcessed = true;
          messages.push("Text đã render");
        }
        // Remove dynamic config if static text
        delete localElement.value.props.overlayConfig;
      }
    } else {
      // Text disabled - clean up
      delete localElement.value.props.overlayConfig;
      localElement.value.props.overlayProcessed = false;
    }

    // Process QR Overlay (always dynamic - save config)
    if (hasQR) {
      localElement.value.props.qrConfig = {
        align: localElement.value.props.qrAlign || "center",
        top: localElement.value.props.qrTop || 50,
        size: localElement.value.props.qrSize || 100,
        padding: 10,
        backgroundColor: localElement.value.props.qrBackground || "#ffffff",
      };
      hasDynamicContent = true;
      messages.push("QR động (render với _id khi gửi)");
    } else {
      // QR disabled - clean up
      delete localElement.value.props.qrConfig;
    }

    // Update element props
    localElement.value.props.src = currentImageUrl;
    localElement.value.props.hasDynamicOverlay = hasDynamicContent;
    localElement.value.props.isTemporaryOverlay =
      !hasDynamicContent && hasText && !textHasDynamicFields;

    updateElement();
    success(`Overlay: ${messages.join(", ")}`);
  } catch (error) {
    console.error("Error generating overlay:", error);
    showError("Đã xảy ra lỗi khi xử lý overlay.");
  } finally {
    processingOverlay.value = false;
  }
};

// Social element helpers
const updateSocialType = () => {
  if (localElement.value) {
    // Update default URL and text based on platform
    const platform = localElement.value.type.replace("social-", "");
    localElement.value.props.href = getSocialPlaceholder(
      localElement.value.type,
    ).replace("https://", "https://");
    localElement.value.props.children =
      platform.charAt(0).toUpperCase() + platform.slice(1);
    updateElement();
  }
};

const getSocialPlaceholder = (type) => {
  const placeholders = {
    "social-facebook": "https://facebook.com/yourpage",
    "social-twitter": "https://twitter.com/yourusername",
    "social-instagram": "https://instagram.com/yourusername",
    "social-linkedin": "https://linkedin.com/company/yourcompany",
    "social-youtube": "https://youtube.com/c/yourchannel",
    "social-tiktok": "https://tiktok.com/@yourusername",
  };
  return placeholders[type] || "https://example.com";
};

// Background image helpers
const getBackgroundImageUrl = computed(() => {
  if (!localElement.value?.style?.backgroundImage) return "";
  // Handle both wrapped url() and plain URLs
  const bgImage = localElement.value.style.backgroundImage;
  const match = bgImage.match(/url\(['"]?(.+?)['"]?\)/);
  return match ? match[1] : bgImage;
});

const setBackgroundImageUrl = (url) => {
  if (localElement.value) {
    // Store just the URL, not wrapped in url()
    localElement.value.style.backgroundImage = url || "";
    updateElement();
  }
};

const getGlobalBackgroundImageUrl = computed(() => {
  if (!localGlobalSettings.value?.backgroundImage) return "";
  // Handle both wrapped url() and plain URLs
  const bgImage = localGlobalSettings.value.backgroundImage;
  const match = bgImage.match(/url\(['"]?(.+?)['"]?\)/);
  return match ? match[1] : bgImage;
});

const setGlobalBackgroundImageUrl = (url) => {
  if (localGlobalSettings.value) {
    // Store just the URL, not wrapped in url()
    localGlobalSettings.value.backgroundImage = url || "";
    updateGlobalSettings();
  }
};

// Clear background image
const clearBackgroundImage = () => {
  if (localElement.value) {
    localElement.value.style.backgroundImage = "";
    localElement.value.style.backgroundSize = "";
    localElement.value.style.backgroundPosition = "";
    localElement.value.style.backgroundRepeat = "";
    updateElement();
  }
};

// HTML Editor methods
const openHtmlEditor = () => {
  emit("open-html-editor");
};
</script>

<style scoped>
@reference "tailwindcss";

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Property Section Styles */
.prop-section {
  @apply bg-white rounded-2xl border border-slate-200/80 overflow-hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.prop-section-header {
  @apply w-full flex items-center justify-between px-3.5 py-3 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50/80 transition-all duration-200;
}
.prop-section-body {
  @apply px-3.5 pb-3.5 pt-2 space-y-3 bg-linear-to-b from-slate-50/50 to-white;
}
.prop-icon {
  @apply w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs shadow-sm;
}
.prop-field {
  @apply space-y-1.5;
}
.prop-label {
  @apply block text-[11px] font-medium text-slate-500 uppercase tracking-wide;
}
.prop-input {
  @apply w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400;
}
.prop-select {
  @apply w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer appearance-none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;
}
.prop-textarea {
  @apply w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none placeholder:text-slate-400;
}
.prop-checkbox {
  @apply w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer;
}
.prop-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200;
}
.prop-btn-primary {
  @apply bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm;
}
.prop-btn-secondary {
  @apply bg-slate-100 text-slate-600 hover:bg-slate-200;
}
.prop-btn-danger {
  @apply text-red-500 hover:bg-red-50 hover:text-red-600;
}

/* Grid helpers */
.prop-grid-2 {
  @apply grid grid-cols-2 gap-2.5;
}
.prop-grid-3 {
  @apply grid grid-cols-3 gap-2;
}

/* Modern Color Picker */
.color-picker-wrapper {
  @apply flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200;
}
.color-picker-preview {
  @apply w-8 h-8 rounded-lg border-2 border-white shadow-sm cursor-pointer shrink-0 relative overflow-hidden;
}
.color-picker-preview::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;
  z-index: 0;
}
.color-picker-preview-inner {
  @apply absolute inset-0 z-10;
}
.color-picker-input {
  @apply opacity-0 absolute inset-0 w-full h-full cursor-pointer;
}
.color-picker-hex {
  @apply flex-1 px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 uppercase;
}

/* Item card for lists */
.prop-item-card {
  @apply bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 hover:border-slate-300 transition-colors;
}
.prop-item-header {
  @apply flex items-center gap-2;
}

/* Inline color field */
.color-field-inline {
  @apply flex items-center gap-2;
}
.color-swatch {
  @apply w-9 h-9 rounded-xl border-2 border-white shadow-md cursor-pointer relative overflow-hidden shrink-0;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.color-swatch input[type="color"] {
  @apply opacity-0 absolute inset-0 w-full h-full cursor-pointer;
}
.color-hex-input {
  @apply flex-1 px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 uppercase tracking-wider;
}

/* Color grid for multiple colors */
.color-grid {
  @apply grid grid-cols-2 gap-3;
}
.color-grid-item {
  @apply flex flex-col gap-1.5;
}
.color-grid-label {
  @apply text-xs font-medium text-slate-400 uppercase tracking-wider;
}
.color-grid-control {
  @apply flex items-center gap-1.5 p-1 bg-slate-50/80 rounded-lg;
}
.color-grid-swatch {
  @apply w-7 h-7 rounded-lg cursor-pointer relative overflow-hidden shrink-0 border border-slate-200;
}
.color-grid-swatch input[type="color"] {
  @apply opacity-0 absolute inset-0 w-full h-full cursor-pointer;
}
.color-grid-hex {
  @apply flex-1 min-w-0 px-1.5 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 uppercase truncate;
}

/* Section divider */
.prop-divider {
  @apply border-t border-slate-100 my-3;
}

/* Typography section with border */
.typography-section {
  @apply border border-slate-200 rounded-xl p-4 mb-4 bg-white/50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Compact input group */
.input-group-compact {
  @apply flex items-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200;
}
.input-group-compact input {
  @apply flex-1 px-3 py-2 text-xs bg-transparent border-0 focus:outline-none focus:ring-0;
}
.input-group-compact .suffix {
  @apply px-2 text-xs text-slate-400 font-medium;
}
</style>
