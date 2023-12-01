// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Add lights to the scene, so we can actually see the 3D model
const hlight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new THREE.PointLight(0xc4c4c4, 0.2);
light.position.set(0, 300, 500);
scene.add(light);

// Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Set which object to render
let objToRender = 'eye';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  'Models/pm.glb',
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.querySelector(".model").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
const fixedCameraPosition = objToRender === "dino" ? 25 : .5;
camera.position.set(0.1, 0.7, 1.3);

controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enablePan = false;

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Make the eye move
  // if (object && objToRender === "eye") {
  //   object.rotation.y = -3 + mouseX / window.innerWidth * 3;
  //   object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  // }

  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to load a specific folder
function loadFolder(folderName) {
  // Replace the existing object with the new one
  if (object) {
    scene.remove(object);
  }

  // Load the new object
  loader.load(
    `Models/${folderName}/model.glb`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );
}

// Event listener for folder buttons
document.getElementById('btnProjectileMotion').addEventListener('click', function () {
  loadFolder('Projectile_Motion');
});

document.getElementById('btnSuperellipsoid').addEventListener('click', function () {
  loadFolder('Superellipsoid');
});

document.getElementById('btnFractal').addEventListener('click', function () {
  loadFolder('Fractal');
});

// Start the 3D rendering
animate();
