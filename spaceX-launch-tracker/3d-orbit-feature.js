// ===== Scene & Camera =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 25);

// ===== Renderer =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ===== Lights =====
scene.add(new THREE.AmbientLight(0xffffff, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// ===== OrbitControls =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 60;

// ===== Load Falcon 9 Model (CORS-friendly link) =====
const loader = new THREE.GLTFLoader();
loader.load(
  'https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/Falcon9/glTF/Falcon9.gltf',
  (gltf) => {
    const rocket = gltf.scene;
    rocket.scale.set(5, 5, 5);
    rocket.rotation.y = Math.PI;
    scene.add(rocket);
  },
  undefined,
  (error) => {
    console.error('Model load error:', error);
  }
);

// ===== Animate =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== Resize =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
