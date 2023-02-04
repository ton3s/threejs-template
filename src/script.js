import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'
import { MeshBasicMaterial } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('State Farm', {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 4,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4,
	})

	const text = new THREE.Mesh(textGeometry, material)
	textGeometry.center()
	scene.add(text)
	console.log(textGeometry.boundingBox)
})

// Objects
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donuts = []

for (let i = 0; i < 100; i++) {
	const donut = new THREE.Mesh(
		donutGeometry,
		new THREE.MeshBasicMaterial({ wireframe: true })
	)
	scene.add(donut)

	// Randomize its position
	donut.position.x = (Math.random() - 0.5) * 10
	donut.position.y = (Math.random() - 0.5) * 10
	donut.position.z = (Math.random() - 0.5) * 10

	// Randomize its rotation
	donut.rotation.x = Math.random() * Math.PI
	donut.rotation.y = Math.random() * Math.PI

	// Randomize the scale
	const scale = Math.random()
	donut.scale.set(scale, scale, scale)
	donuts.push(donut)
}

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update controls
	controls.update()

	// Animate donuts
	donuts.forEach((donut) => {
		donut.rotation.y = elapsedTime
	})

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
