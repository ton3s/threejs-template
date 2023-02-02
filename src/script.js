import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
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
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
	0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 2, 0,
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
const material = new THREE.MeshPhongMaterial({
	color: 0xff0000,
	specular: 0x444444,
	shininess: 60,
	wireframe: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	100
)
// const camera = new THREE.OrthographicCamera(
// 	-1 * aspectRatio,
// 	1 * aspectRatio,
// 	1,
// 	-1,
// 	0.1,
// 	100
// )
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// controls.target.y = 2
// controls.update()

// Cursor
// const cursor = {
// 	x: 0,
// 	y: 0,
// }
// window.addEventListener("mousemove", (event) => {
// 	cursor.x = event.clientX / sizes.width - 0.5
// 	cursor.y = -(event.clientY / sizes.height - 0.5)
// })

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

	// Update objects
	// mesh.rotation.y = elapsedTime
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
	// camera.position.y = cursor.y * 3
	// camera.lookAt(mesh.position)

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}
tick()
