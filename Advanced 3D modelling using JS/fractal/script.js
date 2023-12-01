const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Setting up renderer size and appending it to the HTML container
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Adding ambient light and directional light to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

let taran; // Variable to store the generated fractal structure

// Explanation content based on levels
const explanationContent = [
  "Welcome to the Fractal Taran Demo!",
  "Adjust the Levels and Color to explore the fractal.",
  "Levels: Specifies the depth of recursion. Higher levels create more detailed structures.",
  "Color: Choose the base color of the fractal.",
  "This demo uses recursive subdivision to generate a fractal structure. Enjoy exploring!"
];

// Function to update explanatory text based on the current level
function updateExplanatoryText(level) {
  const explanationDiv = document.getElementById('explanation');
  explanationDiv.innerHTML = explanationContent.join('<br>') + `<br>Current Level: ${level}`;
}

// Function to generate the fractal taran recursively
function generateFractalTaran(depth, size, position = new THREE.Vector3(), parentColor) {
  if (depth === 0) {
    return null;
  }

  const parentColorObj = new THREE.Color(parentColor);
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({ color: parentColor });
  const taran = new THREE.Mesh(geometry, material);
  taran.position.copy(position);
  scene.add(taran);

  const subTaranSize = size * 0.5;

  // Generate a random color for this level
  const levelColor = getRandomColor();

  for (let i = 0; i < 6; i++) {
    const subTaranPosition = calculateSubTaranPosition(i, size, position);
    // Adjust the color based on the parent's color
    const adjustedColor = adjustColor(parentColorObj, levelColor);
    const subTaran = generateFractalTaran(depth - 1, subTaranSize, subTaranPosition, adjustedColor);
    if (subTaran) {
      taran.add(subTaran);
    }
  }

  return taran;
}

// Function to calculate the position of sub-tarans based on the index
function calculateSubTaranPosition(index, size, position) {
  const offset = size * 1.5;
  switch (index) {
    case 0: return new THREE.Vector3(offset, 0, 0).add(position);
    case 1: return new THREE.Vector3(-offset, 0, 0).add(position);
    case 2: return new THREE.Vector3(0, offset, 0).add(position);
    case 3: return new THREE.Vector3(0, -offset, 0).add(position);
    case 4: return new THREE.Vector3(0, 0, offset).add(position);
    case 5: return new THREE.Vector3(0, 0, -offset).add(position);
    default: return position;
  }
}

// Function to rotate the taran and its sub-tarans
function rotateTaran(taran) {
  // Rotate Taran
  taran.rotation.x += 0.01;
  taran.rotation.y += 0.01;

  // Rotate sub-Tarans
  taran.children.forEach(subTaran => {
    subTaran.rotation.x += 0.01;
    subTaran.rotation.y += 0.01;
  });
}

// Function to update the fractal taran based on user input
function updateFractalTaran() {
  if (taran) {
    scene.remove(taran);
  }

  const level = parseInt(document.getElementById('levelInput').value, 10);
  const color = document.getElementById('colorInput').value;
  taran = generateFractalTaran(level, 10, new THREE.Vector3(), parseInt(color.substring(1), 16));

  // Update explanatory text based on the current level
  updateExplanatoryText(level);
}

// Function to generate a random color
function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

// Function to adjust the color based on the parent's color
function adjustColor(parentColor, levelColor) {
  const adjustedColor = parentColor.clone().lerp(new THREE.Color(levelColor), 0.5).getHex();
  return adjustedColor;
}

// Event listeners for input changes
document.getElementById('levelInput').addEventListener('input', updateFractalTaran);
document.getElementById('colorInput').addEventListener('input', updateFractalTaran);

// Initial update and camera position
updateFractalTaran();
camera.position.z = 50;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (taran) {
    rotateTaran(taran);
  }

  renderer.render(scene, camera);
}

animate();