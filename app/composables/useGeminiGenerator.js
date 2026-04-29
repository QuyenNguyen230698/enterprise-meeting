import { ref } from 'vue'

// Prompt tối ưu cho Imagen 3
export const DEFAULT_TEXTURE_PROMPT = `Generate a high-quality, seamless, flat texture map for a 3D model.
View: Top-down, orthographic, flat lay.
Style: Realistic, highly detailed texture.
Resolution: 4K (4096x4096 pixels) or higher for production quality.
Constraints: 
- Seamless tiling (edges match perfectly).
- No perspective, no shadows, no 3D lighting effects (albedo/diffuse map only).
- Consistent lighting across the surface.
- CRITICAL - BACKGROUND COLOR: The entire image background MUST be the main/base color of the product. For example, if the product is a black shirt, the background must be black. If it's a red bag, the background must be red. Do NOT use white, transparent, or any color that doesn't match the product.
- CRITICAL: Maintain correct orientation - logos, stickers, text, and patterns must NOT be upside-down. Top should stay at top, bottom at bottom. Match the exact orientation shown in the reference images.
- CRITICAL: Stickers/logos must be centered and well-positioned. Do NOT overlap stickers with other design elements. Each element should have clear spacing and logical placement appropriate for the product type.
- Design should be production-ready and make sense for the actual product (e.g., shirt front design, bag panel design, etc.).
`

export const useGeminiGenerator = () => {
  const isLoading = ref(false)
  const error = ref(null)

  // Hàm chuyển ảnh sang Base64 (Giữ nguyên logic của bạn)
  const imageToBase64 = async (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('data:image')) {
      return imageUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '')
    }
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result?.toString().replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '')
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (err) {
      console.error('Failed to convert image to base64:', err)
      return null
    }
  }

  // Hàm ghép ảnh (Giữ nguyên logic của bạn - dùng để hiển thị preview cho user nếu cần)
  const combineImages = async (uvImageBase64, textureImageBase64) => {
    // ... (Giữ nguyên code combineImages cũ của bạn nếu bạn muốn dùng tính năng này ở client)
    // Tuy nhiên, lưu ý là Imagen 3 API hiện tại chủ yếu nhận Text prompt,
    // việc gửi ảnh ghép lên server để làm tham chiếu cần API hỗ trợ Image-to-Image (Vertex AI)
    // Code dưới đây vẫn giữ để bạn dùng cho mục đích hiển thị UI.
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 1024
        canvas.width = size * 2
        canvas.height = size
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
  
        let loadedCount = 0
        const totalImages = (uvImageBase64 ? 1 : 0) + (textureImageBase64 ? 1 : 0)
        if (totalImages === 0) { reject(new Error('No images')); return }
  
        const checkComplete = () => {
          loadedCount++
          if (loadedCount >= totalImages) {
            const combined = canvas.toDataURL('image/png')
            resolve(combined.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''))
          }
        }
  
        if (uvImageBase64) {
          const uvImg = new Image()
          uvImg.onload = () => { ctx.drawImage(uvImg, 0, 0, size, size); checkComplete() }
          uvImg.onerror = checkComplete; uvImg.src = `data:image/png;base64,${uvImageBase64}`
        }
        if (textureImageBase64) {
          const texImg = new Image()
          texImg.onload = () => { 
            const offsetX = uvImageBase64 ? size : 0
            ctx.drawImage(texImg, offsetX, 0, size, size); checkComplete() 
          }
          texImg.onerror = checkComplete; texImg.src = `data:image/png;base64,${textureImageBase64}`
        }
      })
  }

  /**
   * Generate texture calling Nuxt API
   */
  const generateTexture = async (apiKey, prompt, uvReferenceImage, textureImage = null) => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Chuẩn bị 2 ảnh riêng biệt
      const uvBase64 = await imageToBase64(uvReferenceImage)
      const textureBase64 = textureImage ? await imageToBase64(textureImage) : null

      // 2. Tạo prompt mô tả rõ vai trò của từng ảnh
      const userPrompt = prompt || "A seamless texture"

      // Prompt mô tả chi tiết cho Gemini hiểu 2 ảnh input
      const imageDescription = (uvBase64 && textureBase64)
        ? `
IMPORTANT - You are receiving 2 reference images:
- IMAGE 1 (UV References): This is the UV wireframe layout. Your OUTPUT MUST match this exact format/shape/boundaries.
- IMAGE 2 (Design Reference): This is the texture design. Apply the colors, patterns, and style from this image.

Your task: Generate a texture that has the EXACT SAME FORMAT as Image 1 (UV layout), but filled with the colors and design from Image 2.
The output should look like Image 1's wireframe structure painted with Image 2's style.
`
        : uvBase64
          ? '\nUse the provided UV wireframe as the format reference for the output texture.'
          : ''

      const finalPrompt = `${DEFAULT_TEXTURE_PROMPT} ${userPrompt}${imageDescription}`

      // 3. Gọi API Server Nuxt - Gửi 2 ảnh riêng biệt
      const response = await fetch('/api/generate-texture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          prompt: finalPrompt,
          uvImageBase64: uvBase64,           // Ảnh 1: UV References
          textureImageBase64: textureBase64  // Ảnh 2: Design Reference
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.statusMessage || errData.message || 'Failed to generate texture')
      }

      const data = await response.json()
      
      if (data.image) {
        // Imagen trả về raw base64, cần thêm prefix để hiển thị trong thẻ <img>
        return `data:image/png;base64,${data.image}`
      }

      throw new Error('Server did not return an image')

    } catch (err) {
      console.error('Generation Error:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    generateTexture,
    isLoading,
    error,
    DEFAULT_TEXTURE_PROMPT
  }
}