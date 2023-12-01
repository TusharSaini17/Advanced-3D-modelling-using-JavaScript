//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles (Field of view)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//Add lights to the scene, so we can actually see the 3D model
const hlight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new THREE.PointLight(0xc4c4c4, 0.2);
light.position.set(0, 300, 500);
scene.add(light);

const light2 = new THREE.PointLight(0xc4c4c4, 0.2);
light2.position.set(500, 100, 500);
scene.add(light2);

const light3 = new THREE.PointLight(0xc4c4c4, 0.2);
light3.position.set(0, 100, -500);
scene.add(light3);

const light4 = new THREE.PointLight(0xc4c4c4, 0.2);
light4.position.set(-500, 300, 500);
scene.add(light4);


//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

let defaultObjPos;

// Add a global variable to store the trail line
let trailLine;

// Add a global variable to store the trail line points
let allTrailPoints = [];

//Load the file
loader.load(
  // `location of the model`,
  'Models/pm(mountains).glb',
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene.children[4];
    scene.add(gltf.scene);
    defaultObjPos = object.position.clone();

    // Create a material for the trail line
    const trailMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    linewidth: 50,
    dashSize: 100,
    gapSize: 100,
  });
    
  // Create the initial trail line geometry
  const trailGeometry = new THREE.BufferGeometry().setFromPoints([]);
    
  // Create the trail line with the initial geometry and material
  trailLine = new THREE.Line(trailGeometry, trailMaterial);
  scene.add(trailLine);
    

  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.querySelector(".model").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
const fixedCameraPosition = objToRender === "dino" ? 25 : .5;
camera.position.set(0.1,0.7, 1.3);

controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = true;
//controls.enabled = false;
controls.enablePan = false;

//Render the scene
let clock = new THREE.Clock();
let vx = 0.5, vy = 0.1;

function addTrailPoint(position) {
  allTrailPoints.push(position.clone());

// Create a new trail line geometry with all trail points
const trailGeometry = new THREE.BufferGeometry().setFromPoints(allTrailPoints);

// If the trail line already exists, update its geometry
if (trailLine) {
  trailLine.geometry = trailGeometry;
} else {
  // If the trail line doesn't exist, create a new one
  const trailMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      dashSize: 0.1,
      gapSize: 0.1,
    });

    trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);
  }
}


function animate() {
  requestAnimationFrame(animate);
  // console.log(object);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  //if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    //object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    //object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  //}
  
  // Update the scene, adding some automatic movement
  let dt = clock.getDelta();
  object.position.x += vx * dt;
  object.position.y += vy * dt;
  vy -= 0.2 * dt;

  // Add the current position to the trail
  addTrailPoint(object.position);

  // Render the scene
  renderer.render(scene, camera);
}


document.getElementById("throwButton").addEventListener("click", function () {
  let s = document.getElementById("speedInput").value / 50;
  let a = document.getElementById("angleInput").value;
  vx = s * Math.cos(a * Math.PI / 180);
  vy = s * Math.sin(a * Math.PI / 180);
  
  // Reset the position of the object
  object.position.set(defaultObjPos.x, defaultObjPos.y, defaultObjPos.z);

  // Clear the existing trail points and reset the trail line
  allTrailPoints = [];
  scene.remove(trailLine);
  trailLine = null;
});

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
//document.onmousemove = (e) => {
  //mouseX = e.clientX;
  //mouseY = e.clientY;
//}

//Start the 3D rendering
animate();