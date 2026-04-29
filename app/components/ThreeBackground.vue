<template>
  <div ref="canvasContainer" class="absolute inset-0 -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)
const props = defineProps({
  particleCount: {
    type: Number,
    default: 1000
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

let scene, camera, renderer, particles, animationId
let mouse = { x: 0, y: 0 }

const initThree = () => {
  // Scene
  scene = new THREE.Scene()
  
  // Camera
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.z = 50

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // Create particles
  createParticles()

  // Start animation
  animate()
}

const createParticles = () => {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  // Create particle positions
  for (let i = 0; i < props.particleCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    )

    // Gradient colors from gray to white
    const color = new THREE.Color()
    color.setHSL(0, 0, 0.5 + Math.random() * 0.5)
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  // Material
  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // Rotate particles slowly
  if (particles) {
    particles.rotation.y += 0.0005
    particles.rotation.x += 0.0002

    // Interactive mouse movement
    if (props.interactive) {
      particles.rotation.y += mouse.x * 0.00005
      particles.rotation.x += mouse.y * 0.00005
    }
  }

  renderer.render(scene, camera)
}

const onMouseMove = (event) => {
  if (!props.interactive) return
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
  if (props.interactive) {
    window.addEventListener('mousemove', onMouseMove)
  }
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
