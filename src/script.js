import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

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

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
	'/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

// Object
const parameters = {
	color: '#0091ff',
}
const material = new THREE.MeshBasicMaterial()
material.transparent = true
material.opacity = 0.1

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
sphere.position.x = -1.5
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 16, 32),
	material
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)

// Debug Controls
gui.add(material, 'wireframe')

// Color
gui.addColor(parameters, 'color').onChange(() => {
	material.color.set(parameters.color)
})

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	100
)

camera.position.z = 3
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))

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
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
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

	// Objects
	// Update objects
	sphere.rotation.y = 0.1 * elapsedTime
	plane.rotation.y = 0.1 * elapsedTime
	torus.rotation.y = 0.1 * elapsedTime

	sphere.rotation.x = 0.15 * elapsedTime
	plane.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15 * elapsedTime

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}
tick()
