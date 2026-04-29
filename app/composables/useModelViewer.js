import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const useModelViewer = () => {
  let scene = null
  let camera = null
  let renderer = null
  let controls = null
  let model = null
  let animationId = null
  let mixer = null
  let clock = null
  let xrSession = null
  let xrHitTestSource = null
  let reticle = null
  let arModel = null
  let lights = {
    ambient: null,
    directional: null,
    hemisphere: null,
    point1: null,
    point2: null
  }
  let dracoLoader = null
  let resizeObserver = null
  let containerRef = null

  const initViewer = (container, options = {}) => {
    if (typeof window === 'undefined' || !container) return

    const {
      backgroundColor = 0x1a1a1a,
      cameraPosition = { x: 0, y: 1, z: 3 },
      enableGrid = true,
      enableAxes = false
    } = options

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    scene.fog = new THREE.Fog(backgroundColor, 10, 50)

    // Camera
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.xr.enabled = true
    container.appendChild(renderer.domElement)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.5
    controls.maxDistance = 20
    controls.maxPolarAngle = Math.PI / 1.5
    controls.autoRotate = false
    controls.autoRotateSpeed = 1.0

    // Lights
    setupLights()

    // Grid
    if (enableGrid) {
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      gridHelper.position.y = 0
      scene.add(gridHelper)
    }

    // Axes
    if (enableAxes) {
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)
    }

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    scene.add(ground)

    // Clock for animations
    clock = new THREE.Clock()

    // Store container reference
    containerRef = container

    // Resize handler using ResizeObserver for container changes
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          onResize(container)
        }
      }
    })
    resizeObserver.observe(container)

    // Also listen to window resize as fallback
    window.addEventListener('resize', () => onResize(container))

    // Start animation loop
    animate()

    return { scene, camera, renderer, controls }
  }

  const setupLights = () => {
    // Ambient light
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(lights.ambient)

    // Hemisphere light
    lights.hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    lights.hemisphere.position.set(0, 20, 0)
    scene.add(lights.hemisphere)

    // Main directional light
    lights.directional = new THREE.DirectionalLight(0xffffff, 0.8)
    lights.directional.position.set(5, 10, 7.5)
    lights.directional.castShadow = true
    lights.directional.shadow.camera.top = 5
    lights.directional.shadow.camera.bottom = -5
    lights.directional.shadow.camera.left = -5
    lights.directional.shadow.camera.right = 5
    lights.directional.shadow.mapSize.width = 2048
    lights.directional.shadow.mapSize.height = 2048
    scene.add(lights.directional)

    // Point lights for better illumination
    lights.point1 = new THREE.PointLight(0x6366f1, 0.5, 10)
    lights.point1.position.set(-3, 2, 3)
    scene.add(lights.point1)

    lights.point2 = new THREE.PointLight(0x8b5cf6, 0.5, 10)
    lights.point2.position.set(3, 2, -3)
    scene.add(lights.point2)
  }

  const loadModel = async (modelPath, onProgress) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader()
      
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      }
      loader.setDRACOLoader(dracoLoader)

      loader.load(
        modelPath,
        (gltf) => {
          // Remove old model if exists
          if (model) {
            scene.remove(model)
            disposeModel(model)
          }

          model = gltf.scene

          // Enable shadows
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              
              // Enhance materials
              if (child.material) {
                child.material.needsUpdate = true
                if (child.material.map) {
                  child.material.map.colorSpace = THREE.SRGBColorSpace
                }
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

          // Recalculate after scaling
          const newBox = new THREE.Box3().setFromObject(model)
          const newCenter = newBox.getCenter(new THREE.Vector3())
          model.position.sub(newCenter)
          model.position.y = 0

          scene.add(model)

          // Setup animations if available
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model)
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play()
            })
          }

          resolve({ model, animations: gltf.animations })
        },
        (progress) => {
          if (onProgress) {
            const percentComplete = (progress.loaded / progress.total) * 100
            onProgress(percentComplete)
          }
        },
        (error) => {
          console.error('Error loading model:', error)
          reject(error)
        }
      )
    })
  }

  const disposeModel = (obj) => {
    if (!obj) return

    obj.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose()
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            disposeMaterial(material)
          })
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

    // Update controls
    if (controls) {
      controls.update()
    }

    // Update animations
    if (mixer && clock) {
      const delta = clock.getDelta()
      mixer.update(delta)
    }

    renderer.render(scene, camera)
  }

  const onResize = (container) => {
    if (!camera || !renderer || !container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Skip if dimensions are invalid
    if (width === 0 || height === 0) return

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  // Force resize using stored container reference
  const forceResize = () => {
    if (containerRef) {
      onResize(containerRef)
    }
  }

  const setAutoRotate = (enabled) => {
    if (controls) {
      controls.autoRotate = enabled
    }
  }

  const resetCamera = () => {
    if (camera && controls) {
      camera.position.set(0, 1, 3)
      controls.reset()
    }
  }

  const updateLighting = (lightConfig) => {
    if (lightConfig.ambient !== undefined && lights.ambient) {
      lights.ambient.intensity = lightConfig.ambient
    }
    if (lightConfig.directional !== undefined && lights.directional) {
      lights.directional.intensity = lightConfig.directional
    }
    if (lightConfig.hemisphere !== undefined && lights.hemisphere) {
      lights.hemisphere.intensity = lightConfig.hemisphere
    }
    if (lightConfig.point1 !== undefined && lights.point1) {
      lights.point1.intensity = lightConfig.point1
    }
    if (lightConfig.point2 !== undefined && lights.point2) {
      lights.point2.intensity = lightConfig.point2
    }
  }

  const setBackground = (color) => {
    if (scene) {
      scene.background = new THREE.Color(color)
      if (scene.fog) {
        scene.fog.color = new THREE.Color(color)
      }
    }
  }

  const takeScreenshot = () => {
    if (!renderer) return null
    return renderer.domElement.toDataURL('image/png')
  }

  const setWireframe = (enabled) => {
    if (!model) return

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.wireframe = enabled
          })
        } else {
          child.material.wireframe = enabled
        }
      }
    })
  }

  /**
   * Load a high-quality texture with anti-aliasing optimizations
   * @param {string} texturePath - URL to texture image
   * @param {object} options - Texture options
   */
  const loadHighQualityTexture = (texturePath, options = {}) => {
    const minSize = options.minSize || 2048
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Create canvas for potential upscaling
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
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas)
        const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16
        
        texture.colorSpace = THREE.SRGBColorSpace
        // Use ClampToEdge to prevent seam bleeding at UV borders
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = maxAnisotropy
        texture.generateMipmaps = true
        texture.flipY = options.flipY !== undefined ? options.flipY : false
        texture.needsUpdate = true
        
        console.log(`High-quality texture loaded: ${targetWidth}x${targetHeight}`)
        resolve(texture)
      }
      
      img.onerror = reject
      img.src = texturePath
    })
  }

  /**
   * Apply material texture to the current model
   * @param {object} materialConfig - Material configuration { color, bgColor, image }
   */
  const applyMaterialTexture = async (materialConfig) => {
    if (!model || !materialConfig) return

    try {
      const { color, bgColor, image } = materialConfig
      const solidColor = color || bgColor // Use color first, fallback to bgColor
      
      // Load texture if image path provided
      let texture = null
      if (image) {
        texture = await loadHighQualityTexture(image, { flipY: false })
      }

      // Apply to all meshes in the model
      model.traverse((child) => {
        if (child.isMesh) {
          // Create new material with texture
          if (texture) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.6,
              metalness: 0.1,
              side: THREE.DoubleSide,
              flatShading: false,
              dithering: true
            })
          } else if (solidColor) {
            // Apply solid color if no texture
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(solidColor),
              roughness: 0.7,
              metalness: 0.0,
              side: THREE.DoubleSide
            })
          }
          
          child.material.needsUpdate = true
        }
      })

      console.log('Material texture applied successfully')
      return true
    } catch (error) {
      console.error('Failed to apply material texture:', error)
      throw error
    }
  }

  const checkARSupport = async () => {
    if (typeof navigator === 'undefined' || !navigator.xr) {
      return { supported: false, reason: 'WebXR not available' }
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar')
      return { 
        supported, 
        reason: supported ? 'AR supported' : 'AR not supported on this device'
      }
    } catch (error) {
      return { supported: false, reason: error.message }
    }
  }

  const startAR = async () => {
    if (!renderer || !model) {
      throw new Error('Renderer or model not initialized')
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      })

      xrSession = session
      await renderer.xr.setSession(session)

      // Create reticle for placement indicator
      const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2)
      const reticleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1,
        transparent: true,
        opacity: 0.7
      })
      reticle = new THREE.Mesh(reticleGeometry, reticleMaterial)
      reticle.matrixAutoUpdate = false
      reticle.visible = false
      scene.add(reticle)

      // Clone model for AR
      if (model && !arModel) {
        arModel = model.clone()
        arModel.visible = false
        scene.add(arModel)
      }

      // Setup hit test
      const referenceSpace = await session.requestReferenceSpace('viewer')
      xrHitTestSource = await session.requestHitTestSource({ space: referenceSpace })

      // Handle session end
      session.addEventListener('end', () => {
        xrSession = null
        xrHitTestSource = null
        if (reticle) {
          scene.remove(reticle)
          reticle = null
        }
        if (arModel) {
          arModel.visible = false
        }
      })

      // Handle screen tap to place model
      session.addEventListener('select', onARSelect)

      return { success: true, session }
    } catch (error) {
      console.error('AR session failed:', error)
      throw error
    }
  }

  const onARSelect = () => {
    if (reticle && reticle.visible && arModel) {
      arModel.position.setFromMatrixPosition(reticle.matrix)
      arModel.visible = true
    }
  }

  const updateAR = (frame) => {
    if (!frame || !xrHitTestSource || !reticle) return

    const referenceSpace = renderer.xr.getReferenceSpace()
    const hitTestResults = frame.getHitTestResults(xrHitTestSource)

    if (hitTestResults.length > 0) {
      const hit = hitTestResults[0]
      const pose = hit.getPose(referenceSpace)

      if (pose) {
        reticle.visible = true
        reticle.matrix.fromArray(pose.transform.matrix)
      }
    } else {
      reticle.visible = false
    }
  }

  const stopAR = () => {
    if (xrSession) {
      xrSession.end()
    }
  }

  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    if (xrSession) {
      xrSession.end()
    }

    // Clean up ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    window.removeEventListener('resize', onResize)

    if (controls) {
      controls.dispose()
    }

    if (model) {
      disposeModel(model)
    }

    if (arModel) {
      disposeModel(arModel)
    }

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
    arModel = null
    mixer = null
    clock = null
    xrSession = null
    xrHitTestSource = null
    reticle = null
    containerRef = null

    if (dracoLoader) {
      dracoLoader.dispose()
      dracoLoader = null
    }
  }

  return {
    initViewer,
    loadModel,
    setAutoRotate,
    resetCamera,
    updateLighting,
    setBackground,
    takeScreenshot,
    setWireframe,
    checkARSupport,
    startAR,
    stopAR,
    updateAR,
    applyMaterialTexture,
    destroy,
    onResize,
    forceResize,
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    getControls: () => controls,
    getModel: () => model,
    getARSession: () => xrSession
  }
}
