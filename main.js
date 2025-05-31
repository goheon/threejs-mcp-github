// 기본 Three.js 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);
let cameraYaw = 0; // 카메라 회전값(라디안)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 바닥
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// 사과 본체(구체)
const appleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xff2222 });
const apple = new THREE.Mesh(appleGeometry, appleMaterial);
apple.position.set(0, 0.5, 0);
scene.add(apple);

// 사과 잎 (더 자연스러운 위치와 크기)
const leafGeometry = new THREE.SphereGeometry(0.13, 16, 16);
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x22bb22 });
const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
leaf.position.set(0.18, 0.65, -0.18);
leaf.rotation.z = Math.PI / 8;
apple.add(leaf);

// 사과 꼭지(갈색 원기둥)
const stemGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.22, 12);
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
const stem = new THREE.Mesh(stemGeometry, stemMaterial);
stem.position.set(0, 0.77, 0);
stem.rotation.x = Math.PI / 8;
apple.add(stem);

// 조명
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// 카메라 이동/회전 제어
let move = { left: false, right: false, up: false, down: false, yawLeft: false, yawRight: false, upY: false, downY: false };
function onKeyDown(e) {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') move.left = true;
  if (key === 'arrowright' || key === 'd') move.right = true;
  if (key === 'arrowup' || key === 'w') move.up = true;
  if (key === 'arrowdown' || key === 's') move.down = true;
  if (key === 'q') move.yawLeft = true;
  if (key === 'e') move.yawRight = true;
  if (key === 'r') move.upY = true;
  if (key === 'f') move.downY = true;
}
function onKeyUp(e) {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') move.left = false;
  if (key === 'arrowright' || key === 'd') move.right = false;
  if (key === 'arrowup' || key === 'w') move.up = false;
  if (key === 'arrowdown' || key === 's') move.down = false;
  if (key === 'q') move.yawLeft = false;
  if (key === 'e') move.yawRight = false;
  if (key === 'r') move.upY = false;
  if (key === 'f') move.downY = false;
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function animate() {
  requestAnimationFrame(animate);
  // 카메라 회전
  let yawSpeed = 0.03;
  if (move.yawLeft) cameraYaw += yawSpeed;
  if (move.yawRight) cameraYaw -= yawSpeed;
  // 카메라 이동
  let speed = 0.1;
  let forward = new THREE.Vector3(Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
  let right = new THREE.Vector3(Math.cos(cameraYaw), 0, Math.sin(cameraYaw));
  if (move.up) camera.position.add(forward.clone().multiplyScalar(speed));
  if (move.down) camera.position.add(forward.clone().multiplyScalar(-speed));
  if (move.left) camera.position.add(right.clone().multiplyScalar(-speed));
  if (move.right) camera.position.add(right.clone().multiplyScalar(speed));
  if (move.upY) camera.position.y += speed;
  if (move.downY) camera.position.y -= speed;
  // 카메라가 바라보는 방향 갱신
  camera.lookAt(camera.position.x + Math.sin(cameraYaw), camera.position.y, camera.position.z - Math.cos(cameraYaw));
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
