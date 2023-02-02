import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

const image = new Image()
const texture = new THREE.Texture(image)
image.addEventListener('load', () => {
	console.log('image loaded')
	texture.needsUpdate = true
})
image.src = '/Door_Wood_001_basecolor.jpg'

// Debug
const gui = new dat.GUI()

// Base
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
const aspectRatio = sizes.width / sizes.height

// Scene
const scene = new THREE.Scene()

// Object
const parameters = {
	color: '#0091ff',
	spin: () => {
		gsap.to(mesh.rotation, {
			duration: 2,
			y: mesh.rotation.y + Math.PI * 2,
			z: mesh.rotation.z + Math.PI * 2,
		})
	},
}
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({
	map: texture,
	specular: 0x444444,
	shininess: 30,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Debug Controls
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')

// Color
gui.addColor(parameters, 'color').onChange(() => {
	material.color.set(parameters.color)
})
gui.add(parameters, 'spin')

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	100
)

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Light sources
const ambient = new THREE.HemisphereLight(0xffffff, 0x666666, 0.3)
scene.add(ambient)

const light = new THREE.DirectionalLight()
light.position.set(0.2, 1, 1.5)
scene.add(light)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Window
window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Click events
window.addEventListener('dblclick', () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement

	// Handle both Safari and Chrome browsers
	if (!fullscreenElement) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen()
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen()
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		}
	}
})

// Animate
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}
tick()
