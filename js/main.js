
// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create floating geometric shapes
const geometries = [
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  new THREE.OctahedronGeometry(1),
  new THREE.IcosahedronGeometry(1),
  new THREE.TetrahedronGeometry(1)
];

const material = new THREE.MeshPhongMaterial({
  color: 0x00ffff,
  wireframe: true,
  transparent: true,
  opacity: 0.6
});

const shapes = [];
for (let i = 0; i < 8; i++) {
  const geometry = geometries[Math.floor(Math.random() * geometries.length)];
  const mesh = new THREE.Mesh(geometry, material.clone());

  mesh.position.x = (Math.random() - 0.5) * 20;
  mesh.position.y = (Math.random() - 0.5) * 20;
  mesh.position.z = (Math.random() - 0.5) * 20;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  mesh.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    }
  };

  scene.add(mesh);
  shapes.push(mesh);
}

// Create particle field
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0x00ffff,
  transparent: true,
  opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const light1 = new THREE.PointLight(0x00ffff, 1, 100);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0x0080ff, 1, 100);
light2.position.set(-10, -10, -10);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

camera.position.z = 15;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate shapes
  shapes.forEach(shape => {
    shape.rotation.x += shape.userData.rotationSpeed.x;
    shape.rotation.y += shape.userData.rotationSpeed.y;
    shape.rotation.z += shape.userData.rotationSpeed.z;
  });

  // Rotate particles
  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0002;

  // Camera follows mouse
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
