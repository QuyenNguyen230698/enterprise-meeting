import { ref, shallowRef, onUnmounted } from 'vue'
import * as THREE from 'three'

export type BackgroundType =
  | 'solid'
  | 'orbs'
  | 'galaxy'
  | 'nature'
  | 'underwater'
  | 'city'
  | 'aurora'
  | 'matrix'
  | 'space'
  | 'rain'
  | 'fire'
  | 'snow'
  | 'image'
  | 'ocean'
  | 'vortex'
  | 'quantum'
  | 'nebula'
  | 'dna'
  | 'abstract'
  | 'waves'
  | 'topology'
  | 'digital'
  | 'mystic'
  | 'cyberpunk'
  | 'stellar'
  | 'molecular'
  | 'grid'
  | 'fireflies'
  | 'iris'
  | 'flux'
  | 'geometric'

export function useThreeBackground() {
  const containerRef = shallowRef<HTMLElement | null>(null)
  const isActive = ref(false)
  const currentType = ref<BackgroundType>('solid')

  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let animationId: number | null = null
  let particles: THREE.Points | null = null
  let additionalObjects: THREE.Object3D[] = []
  
  // Mouse interaction state
  const mouse = { x: 0, y: 0 }
  const targetMouse = { x: 0, y: 0 }
  
  // Create a circular texture for particles
  const createCircleTexture = () => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    if (!context) return null
    
    context.beginPath()
    context.arc(32, 32, 28, 0, Math.PI * 2)
    context.fillStyle = '#ffffff'
    context.fill()
    
    return new THREE.CanvasTexture(canvas)
  }
  
  const circleTexture = createCircleTexture()

  // Initialize Three.js
  const init = (container: HTMLElement | null) => {
    if (!container) return
    containerRef.value = container

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 50

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Handle resize and mouse
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
  }

  const handleMouseMove = (event: MouseEvent) => {
    // Normalize mouse coordinates to -1 to +1
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  const handleResize = () => {
    if (!containerRef.value || !camera || !renderer) return

    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }

  // Galaxy background - ENHANCED VERSION
  const createGalaxy = () => {
    if (!scene) return
    clearScene()

    const particleCount = 1200 // Elegant density
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorPalette = [
      { r: 0.20, g: 0.83, b: 0.60 }, // emerald-400
      { r: 0.18, g: 0.83, b: 0.75 }, // teal-400
      { r: 0.64, g: 0.90, b: 0.21 }, // lime-400
      { r: 0.38, g: 0.65, b: 0.98 }, // blue-400
      { r: 0.8, g: 0.8, b: 1.0 },   // Distant Star White
    ]

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * 60
      const spinAngle = radius * 0.75
      const branches = 3
      const branchAngle = (i % branches) * ((Math.PI * 2) / branches)

      // Improved spread for better centering and balance
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 7) * (radius / 60 + 0.1)
      const randomY = (Math.random() - 0.5) * 10 * (radius / 60)
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 7) * (radius / 60 + 0.1)

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      const colorIndex = Math.floor(Math.random() * colorPalette.length)
      const colorBase = colorPalette[colorIndex]!
      
      const coreMix = Math.exp(-radius / 12)
      colors[i3] = colorBase.r * (1 - coreMix) + 1.0 * coreMix
      colors[i3 + 1] = colorBase.g * (1 - coreMix) + 1.0 * coreMix
      colors[i3 + 2] = colorBase.b * (1 - coreMix) + 1.0 * coreMix
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.35, // Increased size for better visibility
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // Slightly higher opacity for presence
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01,
      sizeAttenuation: true
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add a very subtle secondary "star dust" layer
    const dustCount = 800
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3
      dustPositions[i3] = (Math.random() - 0.5) * 200
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 200
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 150 - 50
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      map: circleTexture
    })
    const dust = new THREE.Points(dustGeometry, dustMaterial)
    scene.add(dust)
    additionalObjects.push(dust)
  }

  // Nature background (floating particles/fireflies)
  const createNature = () => {
    if (!scene) return
    clearScene()

    const particleCount = 60
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = (Math.random() - 0.5) * 50

      // Golden/green firefly glow
      colors[i3] = 0.8 + Math.random() * 0.2
      colors[i3 + 1] = 0.9 + Math.random() * 0.1
      colors[i3 + 2] = 0.2 + Math.random() * 0.3
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add ambient background color
    scene.background = new THREE.Color(0x0a1a0a)
  }

  // Underwater background (bubbles)
  const createUnderwater = () => {
    if (!scene) return
    clearScene()

    const particleCount = 80
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 80
      positions[i3 + 1] = (Math.random() - 0.5) * 80
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      sizes[i] = Math.random() * 2 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 1.5,
      color: 0x88ddff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    scene.background = new THREE.Color(0x001a33)
  }

  // City background (grid/neon)
  const createCity = () => {
    if (!scene) return
    clearScene()

    // Create grid
    const gridHelper = new THREE.GridHelper(200, 50, 0x00e5ff, 0x1a1a2e)
    gridHelper.position.y = -20
    gridHelper.rotation.x = -0.3
    scene.add(gridHelper)
    additionalObjects.push(gridHelper)

    // Add neon particles
    const particleCount = 35
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = Math.random() * 60 - 10
      positions[i3 + 2] = (Math.random() - 0.5) * 50 - 30

      // Random neon colors
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors[i3] = 1; colors[i3 + 1] = 0; colors[i3 + 2] = 0.6 // Pink
      } else if (colorChoice < 0.66) {
        colors[i3] = 0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1 // Cyan
      } else {
        colors[i3] = 0.6; colors[i3 + 1] = 0; colors[i3 + 2] = 1 // Purple
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    scene.background = new THREE.Color(0x0a0a1a)
  }

  // Aurora (Northern Lights) background
  const createAurora = () => {
    if (!scene) return
    clearScene()

    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Create wave-like curtain effect
      const x = (Math.random() - 0.5) * 120
      const waveY = Math.sin(x * 0.05) * 15 + Math.random() * 30
      const z = (Math.random() - 0.5) * 30 - 20

      positions[i3] = x
      positions[i3 + 1] = waveY
      positions[i3 + 2] = z

      // Aurora colors: green, cyan, purple, pink
      const t = (x + 60) / 120
      if (t < 0.25) {
        colors[i3] = 0.2; colors[i3 + 1] = 1; colors[i3 + 2] = 0.3 // Green
      } else if (t < 0.5) {
        colors[i3] = 0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.8 // Cyan
      } else if (t < 0.75) {
        colors[i3] = 0.5; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.9 // Purple
      } else {
        colors[i3] = 0.9; colors[i3 + 1] = 0.3; colors[i3 + 2] = 0.7 // Pink
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add stars in background
    const starCount = 150
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPositions[i3] = (Math.random() - 0.5) * 200
      starPositions[i3 + 1] = (Math.random() - 0.5) * 100
      starPositions[i3 + 2] = (Math.random() - 0.5) * 100 - 50
    }

    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      size: 0.3,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      map: circleTexture,
      alphaTest: 0.01
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
    additionalObjects.push(stars)

    scene.background = new THREE.Color(0x050510)
  }

  // Matrix rain effect
  const createMatrix = () => {
    if (!scene) return
    clearScene()

    const columns = 20
    const particlesPerColumn = 15
    const particleCount = columns * particlesPerColumn
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < particlesPerColumn; row++) {
        const i = col * particlesPerColumn + row
        const i3 = i * 3

        positions[i3] = (col - columns / 2) * 2.5
        positions[i3 + 1] = (row - particlesPerColumn / 2) * 3 + Math.random() * 50
        positions[i3 + 2] = (Math.random() - 0.5) * 20 - 30

        // Green with varying brightness
        const brightness = Math.random()
        colors[i3] = 0
        colors[i3 + 1] = 0.5 + brightness * 0.5
        colors[i3 + 2] = 0
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    scene.background = new THREE.Color(0x000a00)
  }

  // Deep space with nebula
  const createSpace = () => {
    if (!scene) return
    clearScene()

    // Create nebula particles
    const nebulaCount = 500
    const nebulaPositions = new Float32Array(nebulaCount * 3)
    const nebulaColors = new Float32Array(nebulaCount * 3)

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3

      // Cluster nebula in center
      const radius = Math.pow(Math.random(), 0.5) * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      nebulaPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      nebulaPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5
      nebulaPositions[i3 + 2] = radius * Math.cos(phi) - 20

      // Nebula colors: orange, red, purple, blue
      const colorT = Math.random()
      if (colorT < 0.25) {
        nebulaColors[i3] = 1; nebulaColors[i3 + 1] = 0.4; nebulaColors[i3 + 2] = 0.2 // Orange
      } else if (colorT < 0.5) {
        nebulaColors[i3] = 0.8; nebulaColors[i3 + 1] = 0.1; nebulaColors[i3 + 2] = 0.3 // Red
      } else if (colorT < 0.75) {
        nebulaColors[i3] = 0.5; nebulaColors[i3 + 1] = 0.1; nebulaColors[i3 + 2] = 0.8 // Purple
      } else {
        nebulaColors[i3] = 0.2; nebulaColors[i3 + 1] = 0.3; nebulaColors[i3 + 2] = 0.9 // Blue
      }
    }

    const nebulaGeometry = new THREE.BufferGeometry()
    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3))
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3))

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(nebulaGeometry, nebulaMaterial)
    scene.add(particles)

    // Add distant stars
    const starCount = 250
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPositions[i3] = (Math.random() - 0.5) * 300
      starPositions[i3 + 1] = (Math.random() - 0.5) * 200
      starPositions[i3 + 2] = (Math.random() - 0.5) * 200 - 50
    }

    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      size: 0.4,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
    additionalObjects.push(stars)

    scene.background = new THREE.Color(0x020208)
  }

  // Rain effect
  const createRain = () => {
    if (!scene) return
    clearScene()

    const rainCount = 400
    const positions = new Float32Array(rainCount * 3)

    for (let i = 0; i < rainCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = Math.random() * 100 - 50
      positions[i3 + 2] = (Math.random() - 0.5) * 50
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.3,
      color: 0x88aacc,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add lightning ambient light
    const ambientLight = new THREE.AmbientLight(0x334455, 0.5)
    scene.add(ambientLight)
    additionalObjects.push(ambientLight)

    scene.background = new THREE.Color(0x101520)
  }

  // Fire particles effect
  const createFire = () => {
    if (!scene) return
    clearScene()

    const particleCount = 350
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Cone-like fire shape
      const height = Math.random() * 60
      const radius = (1 - height / 60) * 20 + Math.random() * 5
      const angle = Math.random() * Math.PI * 2

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = height - 30
      positions[i3 + 2] = Math.sin(angle) * radius - 20

      // Fire colors: yellow at bottom, orange in middle, red at top
      const t = height / 60
      if (t < 0.3) {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 0.3 // Yellow
      } else if (t < 0.6) {
        colors[i3] = 1; colors[i3 + 1] = 0.5; colors[i3 + 2] = 0 // Orange
      } else {
        colors[i3] = 1; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0 // Red
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add point light for fire glow
    const fireLight = new THREE.PointLight(0xff6600, 1, 100)
    fireLight.position.set(0, 0, 0)
    scene.add(fireLight)
    additionalObjects.push(fireLight)

    scene.background = new THREE.Color(0x0a0505)
  }

  // Snow effect
  const createSnow = () => {
    if (!scene) return
    clearScene()

    const snowCount = 350
    const positions = new Float32Array(snowCount * 3)
    const sizes = new Float32Array(snowCount)

    for (let i = 0; i < snowCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = Math.random() * 100 - 50
      positions[i3 + 2] = (Math.random() - 0.5) * 50
      sizes[i] = Math.random() * 0.5 + 0.2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.8,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending,
      map: circleTexture,
      alphaTest: 0.01
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    scene.background = new THREE.Color(0x1a2030)
  }

  // 1. Ocean Waves - Beautiful 3D ocean with waves and beach
  const createOcean = () => {
    if (!scene) return
    clearScene()

    // Create ocean surface with waves
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 100, 100)
    const positionAttr = oceanGeometry.getAttribute('position') as THREE.BufferAttribute
    if (!positionAttr) return
    
    const positions = positionAttr.array as Float32Array
    const colors = new Float32Array(positions.length)

    // Create wave pattern and colors
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]!
      const y = positions[i + 1]!
      
      // Create initial wave height
      const wave = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 3
      positions[i + 2] = wave
      
      // Color gradient: deep blue -> cyan -> sandy beach
      const distanceFromCenter = Math.sqrt(x * x + y * y) / 100
      
      if (y < -50) {
        // Beach/sand area
        colors[i] = 0.9 + Math.random() * 0.1 // R
        colors[i + 1] = 0.8 + Math.random() * 0.1 // G  
        colors[i + 2] = 0.6 + Math.random() * 0.1 // B
      } else if (y < -20) {
        // Shallow water (cyan)
        colors[i] = 0.3
        colors[i + 1] = 0.8
        colors[i + 2] = 0.9
      } else {
        // Deep water (blue gradient)
        const depth = Math.min(distanceFromCenter, 1)
        colors[i] = 0.1 * (1 - depth)
        colors[i + 1] = 0.3 + 0.3 * (1 - depth)
        colors[i + 2] = 0.6 + 0.4 * (1 - depth)
      }
    }

    oceanGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    oceanGeometry.computeVertexNormals()

    const oceanMaterial = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })

    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
    ocean.rotation.x = -Math.PI / 3 // Tilt for better view
    ocean.position.z = -30
    scene.add(ocean)
    additionalObjects.push(ocean)

    // Add ambient light for ocean
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)
    additionalObjects.push(ambientLight)

    // Add directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
    sunLight.position.set(50, 50, 50)
    scene.add(sunLight)
    additionalObjects.push(sunLight)

    // Add foam particles on waves
    const foamCount = 200
    const foamPositions = new Float32Array(foamCount * 3)
    
    for (let i = 0; i < foamCount; i++) {
      const i3 = i * 3
      foamPositions[i3] = (Math.random() - 0.5) * 180
      foamPositions[i3 + 1] = (Math.random() - 0.5) * 100
      foamPositions[i3 + 2] = Math.random() * 10 - 5
    }

    const foamGeometry = new THREE.BufferGeometry()
    foamGeometry.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3))
    
    const foamMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(foamGeometry, foamMaterial)
    scene.add(particles)

    scene.background = new THREE.Color(0x87CEEB) // Sky blue
  }

  // 2. Vortex - Hypnotic spiral effect
  const createVortex = () => {
    if (!scene) return
    clearScene()

    const particleCount = 2500
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Create spiral vortex shape
      const t = i / particleCount
      const radius = t * 80
      const angle = t * Math.PI * 12 // Multiple rotations
      const height = (t - 0.5) * 60
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * radius - 30
      
      // Color gradient from center to edge: cyan -> purple -> pink
      if (t < 0.33) {
        colors[i3] = 0; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1 // Cyan
      } else if (t < 0.66) {
        colors[i3] = 0.7; colors[i3 + 1] = 0.2; colors[i3 + 2] = 1 // Purple
      } else {
        colors[i3] = 1; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.6 // Pink
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    scene.background = new THREE.Color(0x000510)
  }

  // 3. Quantum - Connected particle network
  const createQuantum = () => {
    if (!scene) return
    clearScene()

    const particleCount = 150
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = (Math.random() - 0.5) * 60
      
      // Cyan-blue quantum colors
      colors[i3] = 0.2
      colors[i3 + 1] = 0.8 + Math.random() * 0.2
      colors[i3 + 2] = 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Create connection lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    })
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    additionalObjects.push(lines)

    scene.background = new THREE.Color(0x000a0f)
  }

  // 4. Nebula - Volumetric dust clouds
  const createNebula = () => {
    if (!scene) return
    clearScene()

    const particleCount = 1500
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const palette = [
      new THREE.Color(0x34d399), // emerald-400
      new THREE.Color(0x2dd4bf), // teal-400
      new THREE.Color(0xa3e635), // lime-400
      new THREE.Color(0x60a5fa), // blue-400
    ]

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * 50
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 20
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4 + (Math.random() - 0.5) * 10
      positions[i3 + 2] = radius * Math.cos(phi) - 20

      const color = palette[Math.floor(Math.random() * palette.length)]!
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      sizes[i] = Math.random() * 2 + 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      depthWrite: false
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x020408)
  }

  // 5. DNA - Double helix
  const createDNA = () => {
    if (!scene) return
    clearScene()

    const particleCount = 1000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const t = (i / particleCount) * Math.PI * 10
      const strand = i % 2 === 0 ? 0 : Math.PI
      const radius = 10
      
      positions[i3] = Math.cos(t + strand) * radius
      positions[i3 + 1] = (i / particleCount) * 80 - 40
      positions[i3 + 2] = Math.sin(t + strand) * radius

      if (i % 2 === 0) {
        colors[i3] = 0.20; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.60 // emerald
      } else {
        colors[i3] = 0.64; colors[i3 + 1] = 0.90; colors[i3 + 2] = 0.21 // lime
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x050505)
  }

  // 6. Abstract - Strange Attractor style
  const createAbstract = () => {
    if (!scene) return
    clearScene()

    const particleCount = 3000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    let x = 0.1, y = 0, z = 0
    const a = 10, b = 28, c = 8 / 3
    const dt = 0.01

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const dx = a * (y - x)
      const dy = x * (b - z) - y
      const dz = x * y - c * z
      
      x += dx * dt
      y += dy * dt
      z += dz * dt

      positions[i3] = x * 1.5
      positions[i3 + 1] = y * 1.5
      positions[i3 + 2] = (z - 25) * 1.5

      const mix = i / particleCount
      colors[i3] = 0.18 * (1 - mix) + 0.38 * mix // teal to blue
      colors[i3 + 1] = 0.83 * (1 - mix) + 0.65 * mix
      colors[i3 + 2] = 0.75 * (1 - mix) + 0.98 * mix
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x000205)
  }

  // 7. Waves - Undulating sheet
  const createWaves = () => {
    if (!scene) return
    clearScene()

    const grid = 60
    const particleCount = grid * grid
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        const idx = i * grid + j
        const i3 = idx * 3
        
        positions[i3] = (i - grid / 2) * 2
        positions[i3 + 1] = 0
        positions[i3 + 2] = (j - grid / 2) * 2

        colors[i3] = 0.20; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.60
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    particles.rotation.x = -Math.PI / 4
    scene.add(particles)
    scene.background = new THREE.Color(0x0a0a10)
  }

  // 8. Topology - Contour lines
  const createTopology = () => {
    if (!scene) return
    clearScene()

    const lineCount = 20
    const pointsPerLine = 100
    
    for (let i = 0; i < lineCount; i++) {
      const points = []
      const z = (i - lineCount / 2) * 5
      
      for (let j = 0; j < pointsPerLine; j++) {
        const x = (j - pointsPerLine / 2) * 2
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5
        points.push(new THREE.Vector3(x, noise, z))
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x34d399 : 0x2dd4bf,
        transparent: true,
        opacity: 0.3
      })
      
      const line = new THREE.Line(geometry, material)
      scene.add(line)
      additionalObjects.push(line)
    }
    
    scene.background = new THREE.Color(0x05080a)
  }

  // 9. Digital - Falling bits
  const createDigital = () => {
    if (!scene) return
    clearScene()

    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 120
      positions[i3 + 1] = (Math.random() - 0.5) * 100
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 20

      if (Math.random() > 0.5) {
        colors[i3] = 0.20; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.60
      } else {
        colors[i3] = 0.18; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.75
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x000505)
  }

  // 10. Mystic - Floating runes/sparks
  const createMystic = () => {
    if (!scene) return
    clearScene()

    const particleCount = 400
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 20 + Math.random() * 30
      const angle = Math.random() * Math.PI * 2
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = Math.sin(angle) * radius - 20

      colors[i3] = 0.64; colors[i3 + 1] = 0.90; colors[i3 + 2] = 0.21 // lime
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x0a0510)
  }

  // 11. Cyberpunk - Neon grid and glitches
  const createCyberpunk = () => {
    if (!scene) return
    clearScene()

    const gridHelper = new THREE.GridHelper(100, 20, 0x34d399, 0x1e293b)
    gridHelper.position.y = -20
    scene.add(gridHelper)
    additionalObjects.push(gridHelper)

    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = Math.random() * 40 - 10
      positions[i3 + 2] = (Math.random() - 0.5) * 100 - 50

      colors[i3] = 0.38; colors[i3 + 1] = 0.65; colors[i3 + 2] = 0.98 // blue
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x050a0a)
  }

  // 12. Stellar - Dense star field
  const createStellar = () => {
    if (!scene) return
    clearScene()

    const particleCount = 4000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200 - 100

      const brightness = 0.5 + Math.random() * 0.5
      colors[i3] = brightness; colors[i3 + 1] = brightness; colors[i3 + 2] = 1.0
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x000205)
  }

  // 13. Molecular - Atoms and bonds
  const createMolecular = () => {
    if (!scene) return
    clearScene()

    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 60
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 20

      if (i % 3 === 0) {
        colors[i3] = 0.20; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.60 // emerald
      } else if (i % 3 === 1) {
        colors[i3] = 0.38; colors[i3 + 1] = 0.65; colors[i3 + 2] = 0.98 // blue
      } else {
        colors[i3] = 0.8; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1.0 // white
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    
    // Connections will be handled in animate
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)
    additionalObjects.push(lines)

    scene.background = new THREE.Color(0x050510)
  }

  // 14. Grid - Digital mesh
  const createGrid = () => {
    if (!scene) return
    clearScene()

    const size = 100
    const divisions = 20
    const gridHelper = new THREE.GridHelper(size, divisions, 0x34d399, 0x1e293b)
    gridHelper.rotation.x = Math.PI / 2
    scene.add(gridHelper)
    additionalObjects.push(gridHelper)

    const particleCount = 400
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 100
      positions[i3 + 2] = (Math.random() - 0.5) * 20
      
      colors[i3] = 0.2; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.6
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x020508)
  }

  // 15. Fireflies - Organic glowing orbs
  const createFireflies = () => {
    if (!scene) return
    clearScene()

    const particleCount = 50
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = (Math.random() - 0.5) * 40

      colors[i3] = 0.64; colors[i3 + 1] = 0.90; colors[i3 + 2] = 0.21
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x050a05)
  }

  // 16. Iris - Concentric rings
  const createIris = () => {
    if (!scene) return
    clearScene()

    const ringCount = 5
    const particlesPerRing = 200
    const totalParticles = ringCount * particlesPerRing
    const positions = new Float32Array(totalParticles * 3)
    const colors = new Float32Array(totalParticles * 3)

    for (let r = 0; r < ringCount; r++) {
      const radius = (r + 1) * 10
      for (let p = 0; p < particlesPerRing; p++) {
        const idx = r * particlesPerRing + p
        const i3 = idx * 3
        const angle = (p / particlesPerRing) * Math.PI * 2
        
        positions[i3] = Math.cos(angle) * radius
        positions[i3 + 1] = Math.sin(angle) * radius
        positions[i3 + 2] = (Math.random() - 0.5) * 5

        const color = r % 2 === 0 ? 0x2dd4bf : 0x34d399
        const c = new THREE.Color(color)
        colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      map: circleTexture
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x00050a)
  }

  // 17. Flux - Flowing river
  const createFlux = () => {
    if (!scene) return
    clearScene()

    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 100
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 20

      colors[i3] = 0.18; colors[i3 + 1] = 0.83; colors[i3 + 2] = 0.75
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
    scene.background = new THREE.Color(0x02080a)
  }

  // 18. Geometric - Abstract polyhedrons
  const createGeometric = () => {
    if (!scene) return
    clearScene()

    for (let i = 0; i < 5; i++) {
      const geo = new THREE.IcosahedronGeometry(Math.random() * 5 + 2, 0)
      const mate = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x34d399 : 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
      const mesh = new THREE.Mesh(geo, mate)
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40 - 20
      )
      scene.add(mesh)
      additionalObjects.push(mesh)
    }

    const starCount = 500
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPos[i3] = (Math.random() - 0.5) * 150
      starPos[i3 + 1] = (Math.random() - 0.5) * 150
      starPos[i3 + 2] = (Math.random() - 0.5) * 100 - 50
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMate = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    })
    const stars = new THREE.Points(starGeo, starMate)
    scene.add(stars)
    additionalObjects.push(stars)

    scene.background = new THREE.Color(0x020205)
  }

  const clearScene = () => {
    if (!scene) return

    // Dispose additional objects
    additionalObjects.forEach(obj => {
      scene!.remove(obj)
      if (obj instanceof THREE.Points) {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose()
        }
      }
    })
    additionalObjects = []

    // Dispose particles
    if (particles) {
      scene.remove(particles)
      particles.geometry.dispose()
      if (particles.material instanceof THREE.Material) {
        particles.material.dispose()
      }
      particles = null
    }

    // Clear remaining children
    while (scene.children.length > 0) {
      const child = scene.children[0]
      if (child) {
        scene.remove(child)
        if (child instanceof THREE.Points) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      }
    }

    scene.background = null
  }

  // Animation loop
  const animate = () => {
    if (!isActive.value || !scene || !camera || !renderer) return

    animationId = requestAnimationFrame(animate)

    // Rotate particles based on type
    if (particles && particles.geometry && particles.geometry.attributes && particles.geometry.attributes.position) {
      const positionAttr = particles.geometry.attributes.position
      const positions = positionAttr.array as Float32Array

      switch (currentType.value) {
        case 'galaxy':
          // Smooth mouse movement interpolation (slower for "premium" feel)
          mouse.x += (targetMouse.x - mouse.x) * 0.03
          mouse.y += (targetMouse.y - mouse.y) * 0.03
          
          // 3D Parallax: Move camera subtly (reduced distance for better centering)
          if (camera) {
            const targetPosX = mouse.x * 10
            const targetPosY = mouse.y * 8
            camera.position.x += (targetPosX - camera.position.x) * 0.015
            camera.position.y += (targetPosY - camera.position.y) * 0.015
            camera.lookAt(0, 0, 0)
          }

          // Tilt particles for depth balance
          particles.rotation.y += 0.0003
          particles.rotation.x = mouse.y * 0.1
          particles.rotation.z = -mouse.x * 0.05
          
          additionalObjects.forEach(obj => {
            if (obj instanceof THREE.Points) {
              obj.rotation.x = mouse.y * 0.05
              obj.rotation.z = -mouse.x * 0.02
            }
          })
          break

        case 'nature':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += Math.sin(Date.now() * 0.001 + i) * 0.01
          }
          positionAttr.needsUpdate = true
          break

        case 'underwater':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += 0.02
            if (positions[i + 1]! > 40) positions[i + 1] = -40
          }
          positionAttr.needsUpdate = true
          break

        case 'city':
          particles.rotation.y += 0.0005
          break

        case 'aurora':
          // Wave motion
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += Math.sin(Date.now() * 0.0008 + positions[i]! * 0.1) * 0.03
          }
          positionAttr.needsUpdate = true
          break

        case 'matrix':
          // Rain down effect
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! -= 0.5
            if (positions[i + 1]! < -50) {
              positions[i + 1] = 50
            }
          }
          positionAttr.needsUpdate = true
          break

        case 'space':
          // Slow rotation
          particles.rotation.y += 0.0002
          particles.rotation.x += 0.0001
          break

        case 'rain':
          // Fast rain fall
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! -= 1.5
            if (positions[i + 1]! < -50) {
              positions[i + 1] = 50
              positions[i] = (Math.random() - 0.5) * 100
            }
          }
          positionAttr.needsUpdate = true
          break

        case 'fire':
          // Rising flame effect
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += 0.3 + Math.random() * 0.2
            positions[i]! += (Math.random() - 0.5) * 0.3
            if (positions[i + 1]! > 30) {
              positions[i + 1] = -30
              const radius = Math.random() * 15
              const angle = Math.random() * Math.PI * 2
              positions[i] = Math.cos(angle) * radius
              positions[i + 2] = Math.sin(angle) * radius - 20
            }
          }
          positionAttr.needsUpdate = true
          break

        case 'snow':
          // Gentle falling with drift
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! -= 0.1 + Math.random() * 0.05
            positions[i]! += Math.sin(Date.now() * 0.001 + i) * 0.02
            if (positions[i + 1]! < -50) {
              positions[i + 1] = 50
              positions[i] = (Math.random() - 0.5) * 100
            }
          }
          positionAttr.needsUpdate = true
          break
          break
          
        case 'ocean':
          // Animate ocean waves
          const oceanMesh = additionalObjects.find(obj => obj instanceof THREE.Mesh) as THREE.Mesh
          if (oceanMesh && oceanMesh.geometry) {
            const positions = oceanMesh.geometry.getAttribute('position') as THREE.BufferAttribute
            if (positions) {
              const posArray = positions.array as Float32Array
              const time = Date.now() * 0.001
              
              for (let i = 0; i < posArray.length; i += 3) {
                const x = posArray[i]!
                const y = posArray[i + 1]!
                
                // Create moving wave pattern
                const wave1 = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05) * 3
                const wave2 = Math.sin(x * 0.03 - time * 0.7) * Math.cos(y * 0.04 + time * 0.5) * 2
                posArray[i + 2] = wave1 + wave2
              }
              
              positions.needsUpdate = true
              oceanMesh.geometry.computeVertexNormals()
            }
          }
          
          // Animate foam particles
          if (particles && particles.geometry && particles.geometry.attributes && particles.geometry.attributes.position) {
            const foamPositions = particles.geometry.attributes.position.array as Float32Array
            for (let i = 0; i < foamPositions.length; i += 3) {
              foamPositions[i]! += Math.sin(Date.now() * 0.001 + i) * 0.05
              foamPositions[i + 1]! += Math.cos(Date.now() * 0.001 + i) * 0.03
            }
            particles.geometry.attributes.position.needsUpdate = true
          }
          break

        case 'vortex':
          // Rotate the entire vortex
          particles.rotation.y += 0.005
          
          // Wave motion along the spiral
          for (let i = 0; i < positions.length - 2; i += 3) {
            const t = i / positions.length
            const wave = Math.sin(Date.now() * 0.002 + t * 10) * 2
            positions[i + 1]! += wave * 0.01
          }
          positionAttr.needsUpdate = true
          break

        case 'quantum':
          // Floating particles
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i]! += Math.sin(Date.now() * 0.001 + i) * 0.02
            positions[i + 1]! += Math.cos(Date.now() * 0.001 + i) * 0.02
          }
          positionAttr.needsUpdate = true
          
          // Update connection lines
          const linesObj = additionalObjects[0]
          if (linesObj && linesObj instanceof THREE.LineSegments) {
            const linePositions = []
            const maxDistance = 15 // Increased from 25 to reduce line density
            
            for (let i = 0; i < positions.length - 2; i += 3) {
              for (let j = i + 3; j < positions.length - 2; j += 3) {
                const dx = positions[i]! - positions[j]!
                const dy = positions[i + 1]! - positions[j + 1]!
                const dz = positions[i + 2]! - positions[j + 2]!
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                
                if (distance < maxDistance) {
                  linePositions.push(positions[i]!, positions[i + 1]!, positions[i + 2]!)
                  linePositions.push(positions[j]!, positions[j + 1]!, positions[j + 2]!)
                }
              }
            }
            
            linesObj.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
          }
          break

        case 'nebula':
          particles.rotation.y += 0.001
          particles.rotation.z += 0.0005
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += Math.sin(Date.now() * 0.0005 + i) * 0.01
          }
          positionAttr.needsUpdate = true
          break

        case 'dna':
          particles.rotation.y += 0.01
          break

        case 'abstract':
          particles.rotation.y += 0.002
          particles.rotation.x += 0.001
          break

        case 'waves':
          // Smooth mouse movement interpolation
          mouse.x += (targetMouse.x - mouse.x) * 0.03
          mouse.y += (targetMouse.y - mouse.y) * 0.03
          
          // 3D Parallax: Move camera
          if (camera) {
            const targetPosX = mouse.x * 12
            const targetPosY = mouse.y * 10
            camera.position.x += (targetPosX - camera.position.x) * 0.015
            camera.position.y += (targetPosY - camera.position.y) * 0.015
            camera.lookAt(0, 0, 0)
          }

          // Tilt particles
          particles.rotation.y += 0.0002
          particles.rotation.x = -Math.PI / 4 + mouse.y * 0.15
          particles.rotation.z = -mouse.x * 0.1

          for (let i = 0; i < positions.length - 2; i += 3) {
            const x = positions[i]!
            const z = positions[i + 2]!
            positions[i + 1] = Math.sin(x * 0.2 + Date.now() * 0.002) * Math.cos(z * 0.2 + Date.now() * 0.001) * 3
          }
          positionAttr.needsUpdate = true
          break

        case 'topology':
          additionalObjects.forEach((obj, idx) => {
            if (obj instanceof THREE.Line) {
              const pos = obj.geometry.getAttribute('position') as THREE.BufferAttribute
              const arr = pos.array as Float32Array
              for (let i = 0; i < arr.length; i += 3) {
                const x = arr[i]!
                const z = arr[i + 2]!
                arr[i + 1] = Math.sin(x * 0.1 + Date.now() * 0.001 + idx) * Math.cos(z * 0.1 + Date.now() * 0.0005) * 5
              }
              pos.needsUpdate = true
            }
          })
          break

        case 'digital':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! -= 0.3
            if (positions[i + 1]! < -50) positions[i + 1] = 50
          }
          positionAttr.needsUpdate = true
          break

        case 'mystic':
          particles.rotation.y += 0.005
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i + 1]! += Math.sin(Date.now() * 0.002 + i) * 0.05
          }
          positionAttr.needsUpdate = true
          break

        case 'cyberpunk':
          particles.rotation.y += 0.001
          break

        case 'stellar':
          particles.rotation.y += 0.0005
          particles.rotation.x += 0.0002
          break

        case 'molecular':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i]! += Math.sin(Date.now() * 0.001 + i) * 0.02
            positions[i + 1]! += Math.cos(Date.now() * 0.001 + i) * 0.02
          }
          positionAttr.needsUpdate = true

          const molLines = additionalObjects.find(obj => obj instanceof THREE.LineSegments)
          if (molLines && molLines instanceof THREE.LineSegments) {
            const linePositions = []
            const maxDistance = 15
            for (let i = 0; i < positions.length - 2; i += 3) {
              for (let j = i + 3; j < positions.length - 2; j += 3) {
                const dx = positions[i]! - positions[j]!
                const dy = positions[i + 1]! - positions[j + 1]!
                const dz = positions[i + 2]! - positions[j + 2]!
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                if (distance < maxDistance) {
                  linePositions.push(positions[i]!, positions[i + 1]!, positions[i + 2]!)
                  linePositions.push(positions[j]!, positions[j + 1]!, positions[j + 2]!)
                }
              }
            }
            molLines.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
          }
          break

        case 'grid':
          // Smooth mouse movement interpolation
          mouse.x += (targetMouse.x - mouse.x) * 0.03
          mouse.y += (targetMouse.y - mouse.y) * 0.03
          if (camera) {
            camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02
            camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02
            camera.lookAt(0, 0, 0)
          }
          particles.rotation.z += 0.001
          break

        case 'fireflies':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i]! += Math.sin(Date.now() * 0.001 + i) * 0.05
            positions[i + 1]! += Math.cos(Date.now() * 0.001 + i) * 0.03
          }
          positionAttr.needsUpdate = true
          break

        case 'iris':
          particles.rotation.z += 0.005
          for (let i = 0; i < positions.length - 2; i += 3) {
             const t = (i / positions.length) * Math.PI * 2
             positions[i + 2]! = Math.sin(Date.now() * 0.002 + t) * 2
          }
          positionAttr.needsUpdate = true
          break

        case 'flux':
          for (let i = 0; i < positions.length - 2; i += 3) {
            positions[i]! += 0.1
            if (positions[i]! > 50) positions[i] = -50
            positions[i + 1]! += Math.sin(Date.now() * 0.002 + positions[i]! * 0.1) * 0.02
          }
          positionAttr.needsUpdate = true
          break

        case 'geometric':
          additionalObjects.forEach(obj => {
            if (obj instanceof THREE.Mesh) {
              obj.rotation.x += 0.01
              obj.rotation.y += 0.01
            }
          })
          break
      }
    }

    renderer.render(scene, camera)
  }

  // Set background type
  const setType = (type: BackgroundType) => {
    currentType.value = type

    if (type === 'solid') {
      clearScene()
      return
    }

    if (!scene) return

    switch (type) {
      case 'galaxy':
        createGalaxy()
        break
      case 'nature':
        createNature()
        break
      case 'underwater':
        createUnderwater()
        break
      case 'city':
        createCity()
        break
      case 'aurora':
        createAurora()
        break
      case 'matrix':
        createMatrix()
        break
      case 'space':
        createSpace()
        break
      case 'rain':
        createRain()
        break
      case 'fire':
        createFire()
        break
      case 'snow':
        createSnow()
        break
      case 'ocean':
        createOcean()
        break
      case 'vortex':
        createVortex()
        break
      case 'quantum':
        createQuantum()
        break
      case 'nebula':
        createNebula()
        break
      case 'dna':
        createDNA()
        break
      case 'abstract':
        createAbstract()
        break
      case 'waves':
        createWaves()
        break
      case 'topology':
        createTopology()
        break
      case 'digital':
        createDigital()
        break
      case 'mystic':
        createMystic()
        break
      case 'cyberpunk':
        createCyberpunk()
        break
      case 'stellar':
        createStellar()
        break
      case 'molecular':
        createMolecular()
        break
      case 'grid':
        createGrid()
        break
      case 'fireflies':
        createFireflies()
        break
      case 'iris':
        createIris()
        break
      case 'flux':
        createFlux()
        break
      case 'geometric':
        createGeometric()
        break
    }
  }

  // Start rendering
  const start = (container: HTMLElement | null, typeOrOptions: BackgroundType | any = 'waves') => {
    // Initialize if not already done
    if (!scene) {
      init(container)
    }

    // Determine type from argument
    let type: BackgroundType = 'waves'
    if (typeof typeOrOptions === 'string') {
      type = typeOrOptions as BackgroundType
    } else if (typeOrOptions && typeof typeOrOptions === 'object') {
      // It's an options object, we can extract type if provided, otherwise default to galaxy
      type = (typeOrOptions.type as BackgroundType) || 'waves'
      
      // If we're in a specific background that supports these, we could apply them
      // For now, let's just use the type
    }

    currentType.value = type

    // Handle solid type - just clear and return
    if (type === 'solid') {
      clearScene()
      isActive.value = false
      return { destroy: dispose, stop, setType }
    }

    // Create the scene content
    setType(type)

    // Start animation if not already running
    if (!isActive.value) {
      isActive.value = true
      animate()
    }

    return {
      destroy: dispose,
      stop,
      setType
    }
  }

  // Stop rendering
  const stop = () => {
    isActive.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    clearScene()
  }

  // Cleanup
  const dispose = () => {
    stop()
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)

    if (renderer && containerRef.value) {
      try {
        if (containerRef.value.contains(renderer.domElement)) {
          containerRef.value.removeChild(renderer.domElement)
        }
      } catch (e) {
        console.warn('Could not remove renderer from container', e)
      }
      renderer.dispose()
    }

    scene = null
    camera = null
    renderer = null
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    containerRef,
    isActive,
    currentType,
    start,
    initThreeBackground: start, // Alias for backward compatibility
    stop,
    setType,
    dispose,
    destroy: dispose // Alias for backward compatibility
  }
}
