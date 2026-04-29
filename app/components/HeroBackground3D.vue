<template>
  <div ref="canvasContainer" class="absolute inset-0 -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)

let scene, camera, renderer, mesh, animationId
let mouse = { x: 0, y: 0 }

const initThree = () => {
  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xf5f5f5, 1, 100)
  
  // Camera
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.z = 30

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // Create 3D wave geometry
  createWaveGeometry()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  scene.add(directionalLight)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
  directionalLight2.position.set(-10, -10, -5)
  scene.add(directionalLight2)

  // Start animation
  animate()
}

const createWaveGeometry = () => {
  // Create plane geometry with high detail
  const geometry = new THREE.PlaneGeometry(80, 80, 128, 128)
  
  // Store original positions
  const positions = geometry.attributes.position
  const originalPositions = []
  
  for (let i = 0; i < positions.count; i++) {
    originalPositions.push({
      x: positions.getX(i),
      y: positions.getY(i),
      z: positions.getZ(i)
    })
  }
  
  geometry.userData.originalPositions = originalPositions

  // Material with light gray tones
  const material = new THREE.MeshStandardMaterial({
    color: 0xe5e5e5,
    metalness: 0.3,
    roughness: 0.4,
    wireframe: false,
    side: THREE.DoubleSide,
    flatShading: false
  })

  mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 3
  mesh.position.y = -10
  scene.add(mesh)

  // Add wireframe overlay for more depth
  const wireframeGeometry = new THREE.PlaneGeometry(80, 80, 128, 128)
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xd0d0d0,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  })
  const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
  wireframeMesh.rotation.x = -Math.PI / 3
  wireframeMesh.position.y = -10
  wireframeMesh.position.z = 0.1
  scene.add(wireframeMesh)
  
  // Store wireframe for animation
  mesh.userData.wireframe = wireframeMesh
}

let time = 0

const animate = () => {
  animationId = requestAnimationFrame(animate)
  time += 0.01

  if (mesh) {
    const positions = mesh.geometry.attributes.position
    const originalPositions = mesh.geometry.userData.originalPositions
    
    // Create wave effect
    for (let i = 0; i < positions.count; i++) {
      const original = originalPositions[i]
      const x = original.x
      const y = original.y
      
      // Multiple wave frequencies for complexity
      const wave1 = Math.sin(x * 0.2 + time) * 2
      const wave2 = Math.sin(y * 0.15 + time * 0.7) * 1.5
      const wave3 = Math.sin((x + y) * 0.1 + time * 0.5) * 1
      
      // Mouse influence
      const mouseInfluence = Math.exp(-((x - mouse.x * 20) ** 2 + (y - mouse.y * 20) ** 2) / 100)
      const mouseWave = mouseInfluence * Math.sin(time * 2) * 3
      
      positions.setZ(i, wave1 + wave2 + wave3 + mouseWave)
    }
    
    positions.needsUpdate = true
    mesh.geometry.computeVertexNormals()
    
    // Update wireframe
    if (mesh.userData.wireframe) {
      const wirePositions = mesh.userData.wireframe.geometry.attributes.position
      for (let i = 0; i < wirePositions.count; i++) {
        wirePositions.setZ(i, positions.getZ(i))
      }
      wirePositions.needsUpdate = true
    }
    
    // Subtle rotation
    mesh.rotation.z = Math.sin(time * 0.1) * 0.05
    if (mesh.userData.wireframe) {
      mesh.userData.wireframe.rotation.z = mesh.rotation.z
    }
  }

  renderer.render(scene, camera)
}

const onMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
  
  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    })
  }
})
</script>
