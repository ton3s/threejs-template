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

// Matcap Textures
// const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/6.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
//const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

// Gradient Textures
// const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

// Object
const parameters = {
	color: '#0091ff',
}
const material = new THREE.MeshStandardMaterial()
material.map = doorColorTexture
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.side = THREE.DoubleSide

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
sphere.position.x = -1.5
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)

sphere.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)
plane.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)
torus.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.normalScale.set(0.5, 0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture

// Debug Controls
gui.add(material, 'wireframe')
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

// Color
gui.addColor(parameters, 'color').onChange(() => {
	material.color.set(parameters.color)
})

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)

camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Light sources
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
	sphere.rotation.y = 0.2 * elapsedTime
	plane.rotation.y = 0.2 * elapsedTime
	torus.rotation.y = 0.2 * elapsedTime

	sphere.rotation.x = 0.15 * elapsedTime
	plane.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15 * elapsedTime

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}
tick()
