import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// FXAA Post-processing for anti-aliasing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export const useTexturedModelViewer = () => {
  let scene = null
  let camera = null
  let renderer = null
  let controls = null
  let model = null
  let animationId = null
  let clock = null
  let dracoLoader = null
  let currentTexture = null
  // Post-processing
  let composer = null
  let fxaaPass = null
  let smaaPass = null
  let containerRef = null
  let lights = {
    ambient: null,
    directional: null,
    hemisphere: null,
    point1: null,
    point2: null
  }

  const initViewer = (container, options = {}) => {
    if (typeof window === 'undefined' || !container) return

    containerRef = container
    const {
      backgroundColor = 0x1a1a1a,
      cameraPosition = { x: 0, y: 0.5, z: 4.5 },
      enableGrid = false,
      enableFXAA = true,
      enableSMAA = true
    } = options

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    // Camera
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

    // Renderer - MAXIMUM anti-aliasing configuration (like Shopify Supply)
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, // Enable built-in MSAA for maximum smoothness
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      precision: 'highp',
      stencil: true, // Required for SMAA
      depth: true,
      logarithmicDepthBuffer: true // Better depth precision
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    // Use FULL device pixel ratio for ultra-sharp rendering (no limit)
    const pixelRatio = Math.min(window.devicePixelRatio, 3) // Support up to 3x displays
    renderer.setPixelRatio(pixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.useLegacyLights = false
    container.appendChild(renderer.domElement)

    // Setup Post-Processing with FXAA + SMAA (Maximum Anti-Aliasing)
    setupPostProcessing(container, enableFXAA, enableSMAA)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.5
    controls.maxDistance = 10
    controls.maxPolarAngle = Math.PI / 1.5
    controls.autoRotate = false
    controls.autoRotateSpeed = 1.5

    // Lights
    setupLights()

    // Grid (optional)
    if (enableGrid) {
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      gridHelper.position.y = -0.5
      scene.add(gridHelper)
    }

    // Clock
    clock = new THREE.Clock()

    // Resize handler
    const resizeHandler = () => onResize(container)
    window.addEventListener('resize', resizeHandler)

    // Start animation loop
    animate()

    return { scene, camera, renderer, controls, composer }
  }

  /**
   * Setup FXAA + SMAA Post-Processing Pipeline
   * SMAA = Subpixel Morphological Anti-Aliasing (most advanced)
   * FXAA = Fast Approximate Anti-Aliasing (backup/additional)
   * Combined with built-in MSAA for MAXIMUM smoothness
   */
  const setupPostProcessing = (container, enableFXAA = true, enableSMAA = true) => {
    // Create render target with MSAA for ultra-smooth rendering
    const renderTarget = new THREE.WebGLRenderTarget(
      container.clientWidth,
      container.clientHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        colorSpace: THREE.SRGBColorSpace,
        samples: 8, // 8x MSAA for maximum quality (was 0)
        type: THREE.HalfFloatType // Better precision
      }
    )

    // Create composer
    composer = new EffectComposer(renderer, renderTarget)
    composer.setPixelRatio(renderer.getPixelRatio())
    composer.setSize(container.clientWidth, container.clientHeight)

    // Render pass (renders the scene)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // SMAA Pass - HIGHEST quality anti-aliasing
    if (enableSMAA) {
      smaaPass = new SMAAPass(
        container.clientWidth * renderer.getPixelRatio(),
        container.clientHeight * renderer.getPixelRatio()
      )
      composer.addPass(smaaPass)
      console.log('SMAA Anti-Aliasing enabled (ULTRA quality)')
    }

    // FXAA Pass - Additional smoothing
    if (enableFXAA) {
      fxaaPass = new ShaderPass(FXAAShader)
      const pixelRatio = renderer.getPixelRatio()
      fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.clientWidth * pixelRatio)
      fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.clientHeight * pixelRatio)
      composer.addPass(fxaaPass)
      console.log('FXAA Anti-Aliasing enabled')
    }

    // Output pass - ensures correct color space output
    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    console.log('Post-processing pipeline: Built-in MSAA (8x) + SMAA (ULTRA) + FXAA')
  }

  const setupLights = () => {
    // Ambient light - soft overall illumination
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(lights.ambient)

    // Hemisphere light - sky/ground gradient
    lights.hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4)
    lights.hemisphere.position.set(0, 20, 0)
    scene.add(lights.hemisphere)

    // Main directional light - key light with HIGH QUALITY shadows
    lights.directional = new THREE.DirectionalLight(0xffffff, 1.0)
    lights.directional.position.set(5, 10, 7.5)
    lights.directional.castShadow = true
    // CRITICAL: Ultra-high resolution shadows for smoothness
    lights.directional.shadow.mapSize.width = 4096  // Was default (512)
    lights.directional.shadow.mapSize.height = 4096 // Was default (512)
    lights.directional.shadow.camera.near = 0.5
    lights.directional.shadow.camera.far = 50
    lights.directional.shadow.bias = -0.0001
    lights.directional.shadow.normalBias = 0.02
    lights.directional.shadow.radius = 2 // Soft shadow edges
    scene.add(lights.directional)

    // Fill lights
    lights.point1 = new THREE.PointLight(0xffffff, 0.3, 10)
    lights.point1.position.set(-3, 2, 3)
    scene.add(lights.point1)

    lights.point2 = new THREE.PointLight(0xffffff, 0.3, 10)
    lights.point2.position.set(3, 2, -3)
    scene.add(lights.point2)
  }

  /**
   * Load a 3D model and apply a 2D texture to it
   * @param {string} modelPath - URL to the .glb model
   * @param {string} texturePath - URL to the 2D texture image
   * @param {function} onProgress - Progress callback
   * @param {object} textureOptions - Texture transformation options
   * @returns {Promise}
   */
  const loadModelWithTexture = async (modelPath, texturePath, onProgress, textureOptions = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Load texture first with options
        // ALWAYS use high quality texture loading with wireframe removal
        let texture = null
        if (texturePath) {
          // Default to autoRemoveWireframe = true to clean up UV seam lines
          const enhancedOptions = {
            ...textureOptions,
            autoRemoveWireframe: textureOptions.autoRemoveWireframe !== false // Default true
          }
          texture = await loadHighQualityTexture(texturePath, enhancedOptions)
        }

        // Setup GLTF loader with Draco
        const loader = new GLTFLoader()
        if (!dracoLoader) {
          dracoLoader = new DRACOLoader()
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
        }
        loader.setDRACOLoader(dracoLoader)

        loader.load(
          modelPath,
          (gltf) => {
            // Remove old model
            if (model) {
              scene.remove(model)
              disposeModel(model)
            }

            model = gltf.scene

            // Apply texture to all meshes
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true

                // Create new material with texture - ULTRA quality settings
                if (texture) {
                  child.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.6,
                    metalness: 0.1,
                    side: THREE.DoubleSide,
                    // CRITICAL: Smooth shading for organic models
                    flatShading: false,
                    // Enable dithering to reduce banding
                    dithering: true,
                    // Better normal handling
                    normalMapType: THREE.TangentSpaceNormalMap,
                    // Improve edge quality
                    polygonOffset: true,
                    polygonOffsetFactor: 1,
                    polygonOffsetUnits: 1
                  })
                } else {
                  // Default material if no texture
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    roughness: 0.7,
                    metalness: 0.0,
                    side: THREE.DoubleSide
                  })
                }
              }
            })

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 2 / maxDim
            model.scale.multiplyScalar(scale)

            // Recenter after scaling
            const newBox = new THREE.Box3().setFromObject(model)
            const newCenter = newBox.getCenter(new THREE.Vector3())
            model.position.sub(newCenter)
            model.position.y = 0

            scene.add(model)

            currentTexture = texture
            resolve({ model, texture })
          },
          (progress) => {
            if (onProgress && progress.total) {
              const percentComplete = (progress.loaded / progress.total) * 100
              onProgress(percentComplete)
            }
          },
          (error) => {
            console.error('Error loading model:', error)
            reject(error)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Load a texture from URL - Optimized for anti-aliasing 2026
   * @param {string} texturePath - URL to texture image
   * @param {object} options - Texture transformation options
   */
  const loadTexture = (texturePath, options = {}) => {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader()
      
      // Handle CORS
      textureLoader.crossOrigin = 'anonymous'
      
      textureLoader.load(
        texturePath,
        (texture) => {
          // Get max anisotropy supported by the GPU
          const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16
          
          // Configure texture for BEST quality - Anti-aliasing optimizations
          texture.colorSpace = THREE.SRGBColorSpace
          
          // CRITICAL: Use ClampToEdge to prevent color bleeding at UV seam borders
          // RepeatWrapping causes seam lines because colors from opposite edges mix
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          
          // CRITICAL: Use trilinear filtering with mipmaps for smooth texture sampling
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          
          // CRITICAL: Max anisotropic filtering to prevent aliasing at oblique angles
          texture.anisotropy = maxAnisotropy
          
          // Generate mipmaps for smoother texture at different distances
          texture.generateMipmaps = true
          
          // Ensure proper encoding
          texture.needsUpdate = true
          
          // CRITICAL: Texture orientation
          // UV Extractor uses y: p.v * size (v=0 at top of image)
          // flipY = false is standard for GLTF
          texture.flipY = options.flipY !== undefined ? options.flipY : false
          
          // Texture offset (move texture position)
          if (options.offset) {
            texture.offset.set(options.offset.x || 0, options.offset.y || 0)
          }
          
          // Texture repeat (scale texture)
          if (options.repeat) {
            texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1)
          }
          
          // Texture rotation (rotate texture in radians)
          if (options.rotation !== undefined) {
            texture.rotation = options.rotation
            texture.center.set(0.5, 0.5) // Rotate around center
          }
          
          console.log(`Texture loaded: flipY=${texture.flipY}, anisotropy=${maxAnisotropy}, mipmaps=true`)
          resolve(texture)
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error)
          reject(error)
        }
      )
    })
  }

  /**
   * Remove wireframe/black lines from texture image
   * Uses simple inpainting to replace dark pixels with surrounding colors
   * @param {HTMLImageElement} img - Source image
   * @param {number} threshold - Darkness threshold (0-255), pixels below this are considered "lines"
   * @returns {HTMLCanvasElement} - Cleaned canvas
   */
  const removeWireframeFromImage = (img, threshold = 50) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    
    // Draw original image
    ctx.drawImage(img, 0, 0)
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    
    // Helper to check if pixel is dark (likely wireframe)
    const isDark = (r, g, b) => {
      const brightness = (r + g + b) / 3
      return brightness < threshold
    }
    
    // Helper to get pixel at (x, y)
    const getPixel = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return null
      const i = (y * width + x) * 4
      return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
    }
    
    // First pass: Mark dark pixels
    const darkMask = new Uint8Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        if (isDark(data[i], data[i + 1], data[i + 2])) {
          darkMask[y * width + x] = 1
        }
      }
    }
    
    // Second pass: Replace dark pixels with average of non-dark neighbors
    const radius = 10 // INCREASED: Search radius for aggressive wireframe line removal
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (darkMask[y * width + x] === 1) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0
          
          // Sample surrounding non-dark pixels
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              if (dx === 0 && dy === 0) continue
              const nx = x + dx
              const ny = y + dy
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (darkMask[ny * width + nx] === 0) {
                  const pixel = getPixel(nx, ny)
                  if (pixel) {
                    sumR += pixel.r
                    sumG += pixel.g
                    sumB += pixel.b
                    count++
                  }
                }
              }
            }
          }
          
          // Replace with average of neighbors
          if (count > 0) {
            const i = (y * width + x) * 4
            data[i] = Math.round(sumR / count)
            data[i + 1] = Math.round(sumG / count)
            data[i + 2] = Math.round(sumB / count)
            // Keep alpha as is
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    console.log('Wireframe removal complete')
    return canvas
  }

  /**
   * Load texture from high-resolution image with upscaling if needed
   * This helps reduce aliasing on low-res textures
   * @param {string} texturePath - URL to texture image
   * @param {object} options - Options including autoRemoveWireframe, minSize
   */
  const loadHighQualityTexture = (texturePath, options = {}) => {
    const minSize = options.minSize || 2048
    const autoRemoveWireframe = options.autoRemoveWireframe || false
    const wireframeThreshold = options.wireframeThreshold || 50
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Step 1: Remove wireframe if enabled
        let sourceImage = img
        if (autoRemoveWireframe) {
          console.log('Auto-removing wireframe lines...')
          const cleanedCanvas = removeWireframeFromImage(img, wireframeThreshold)
          sourceImage = cleanedCanvas
        }
        
        // Step 2: Create canvas for potential upscaling
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Determine target size (power of 2 for better mipmap generation)
        let targetWidth = img.width
        let targetHeight = img.height
        
        // If image is small, upscale using canvas for smoother results
        if (img.width < minSize || img.height < minSize) {
          const scale = Math.max(minSize / img.width, minSize / img.height)
          targetWidth = Math.floor(img.width * scale)
          targetHeight = Math.floor(img.height * scale)
        }
        
        // Round to nearest power of 2 for optimal GPU performance
        targetWidth = Math.pow(2, Math.round(Math.log2(targetWidth)))
        targetHeight = Math.pow(2, Math.round(Math.log2(targetHeight)))
        
        canvas.width = targetWidth
        canvas.height = targetHeight
        
        // Use high-quality image scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight)
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas)
        const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16
        
        texture.colorSpace = THREE.SRGBColorSpace
        // CRITICAL: Use ClampToEdge to prevent seam bleeding at UV borders
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = maxAnisotropy
        texture.generateMipmaps = true
        texture.flipY = options.flipY !== undefined ? options.flipY : false
        texture.needsUpdate = true
        
        console.log(`High-quality texture: ${targetWidth}x${targetHeight}, wireframe removed: ${autoRemoveWireframe}`)
        resolve(texture)
      }
      
      img.onerror = reject
      img.src = texturePath
    })
  }

  /**
   * Update texture on the current model
   * @param {string} texturePath - URL to texture image
   * @param {object} options - Texture transformation options
   */
  const updateTexture = async (texturePath, options = {}) => {
    if (!model) return

    try {
      // Default to autoRemoveWireframe = true to clean up UV seam lines
      const enhancedOptions = {
        ...options,
        autoRemoveWireframe: options.autoRemoveWireframe !== false // Default true
      }
      const texture = await loadHighQualityTexture(texturePath, enhancedOptions)
      
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.map = texture
          child.material.needsUpdate = true
        }
      })

      // Dispose old texture
      if (currentTexture) {
        currentTexture.dispose()
      }
      currentTexture = texture

      return texture
    } catch (error) {
      console.error('Failed to update texture:', error)
      throw error
    }
  }

  const disposeModel = (obj) => {
    if (!obj) return

    obj.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose()
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => disposeMaterial(material))
        } else {
          disposeMaterial(child.material)
        }
      }
    })
  }

  const disposeMaterial = (material) => {
    if (!material) return

    Object.keys(material).forEach(key => {
      if (material[key] && typeof material[key].dispose === 'function') {
        material[key].dispose()
      }
    })
    material.dispose()
  }

  const animate = () => {
    if (!renderer || !scene || !camera) return

    animationId = requestAnimationFrame(animate)

    if (controls) {
      controls.update()
    }

    // Use composer for post-processed rendering (FXAA/SMAA)
    if (composer) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  const onResize = (container) => {
    if (!camera || !renderer || !container) return

    const width = container.clientWidth
    const height = container.clientHeight
    const pixelRatio = renderer.getPixelRatio()

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)

    // Update composer and FXAA uniforms on resize
    if (composer) {
      composer.setSize(width, height)
    }

    if (fxaaPass) {
      fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio)
      fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio)
    }

    if (smaaPass) {
      smaaPass.setSize(width * pixelRatio, height * pixelRatio)
    }
  }

  const setAutoRotate = (enabled) => {
    if (controls) {
      controls.autoRotate = enabled
    }
  }

  const resetCamera = () => {
    if (camera && controls) {
      camera.position.set(0, 0.5, 4.5)
      controls.reset()
    }
  }

  const setBackground = (color) => {
    if (scene) {
      scene.background = new THREE.Color(color)
    }
  }

  const takeScreenshot = () => {
    if (!renderer) return null
    return renderer.domElement.toDataURL('image/png')
  }

  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    window.removeEventListener('resize', onResize)

    if (controls) {
      controls.dispose()
    }

    if (model) {
      disposeModel(model)
    }

    if (currentTexture) {
      currentTexture.dispose()
    }

    if (dracoLoader) {
      dracoLoader.dispose()
      dracoLoader = null
    }

    // Dispose post-processing
    if (composer) {
      composer.dispose()
      composer = null
    }
    fxaaPass = null
    smaaPass = null

    if (renderer) {
      renderer.dispose()
      renderer.domElement.remove()
    }

    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }

    scene = null
    camera = null
    renderer = null
    controls = null
    model = null
    currentTexture = null
    clock = null
    containerRef = null
  }

  return {
    initViewer,
    loadModelWithTexture,
    loadHighQualityTexture,
    updateTexture,
    setAutoRotate,
    resetCamera,
    setBackground,
    takeScreenshot,
    destroy,
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    getModel: () => model
  }
}
