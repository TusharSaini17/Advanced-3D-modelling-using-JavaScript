// Import necessary modules
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Set up the scene, renderer, and camera
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

// Set up orbit controls for easy navigation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Set up lighting in the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(10, 10, 10);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-10, -10, -10);
scene.add(directionalLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 5);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// Set initial rotation speed and parameters for the superellipsoid
let rotationSpeed = 0.01;
const A = 2;
const B = 2;
const C = 2;
const n = 2;
const m = 2;

// Generate superellipsoid geometry based on initial parameters
const geometry = generateSuperellipsoidGeometry(A, B, C, n, m);

// Load texture for the superellipsoid
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'); // Replace with the path to your texture

// Create material with texture
const material = new THREE.MeshPhongMaterial({ map: texture, flatShading: true });

// Apply the material to the superellipsoid
const superellipsoid = new THREE.Mesh(geometry, material);
scene.add(superellipsoid);

// Animation function to update the scene and render frames
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    superellipsoid.rotation.x += rotationSpeed;
    superellipsoid.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
}
animate();

// Function to update educational text based on current parameters
function updateEducationalText(A, B, C, n, m) {
    const equationsElement = document.getElementById('equations');
    const parameterInfoElement = document.getElementById('parameterInfo');

    equationsElement.innerHTML = `
        Equations:
        x = A * sign(cos(v)) * pow(abs(cos(v)), n) * sign(cos(u)) * pow(abs(cos(u)), m)
        y = B * sign(cos(v)) * pow(abs(cos(v)), n) * sign(sin(u)) * pow(abs(sin(u)), m)
        z = C * sign(sin(v)) * pow(abs(sin(v)), n)
    `;

    parameterInfoElement.innerHTML = `
        Parameter Information:
        X Dimension (A): ${A}, Y Dimension (B): ${B}, Z Dimension (C): ${C}, Shape Control for X and Y (n): ${n}, Shape Control for Z (m): ${m}
    `;
}

// Function to update the superellipsoid based on user input
function updateSuperellipsoid() {
    const paramA = parseFloat(document.getElementById('paramA').value);
    const paramB = parseFloat(document.getElementById('paramB').value);
    const paramC = parseFloat(document.getElementById('paramC').value);
    const paramN = parseFloat(document.getElementById('paramN').value);
    const paramM = parseFloat(document.getElementById('paramM').value);

    // Generate new superellipsoid geometry based on user input
    const newGeometry = generateSuperellipsoidGeometry(paramA, paramB, paramC, paramN, paramM);
    superellipsoid.geometry.dispose();
    superellipsoid.geometry = newGeometry;

    // Update educational text
    updateEducationalText(paramA, paramB, paramC, paramN, paramM);
}

// Function to generate superellipsoid geometry based on given parameters
function generateSuperellipsoidGeometry(A, B, C, n, m) {
    const newGeometry = new THREE.BufferGeometry();

    const newVertices = [];
    const newIndices = [];

    const phiSteps = 32;
    const thetaSteps = 32;

    for (let phi = 0; phi <= phiSteps; phi++) {
        for (let theta = 0; theta <= thetaSteps; theta++) {
            const u = (phi / phiSteps) * Math.PI * 2;
            const v = (theta / thetaSteps) * Math.PI;

            const x = A * Math.sign(Math.cos(v)) * Math.pow(Math.abs(Math.cos(v)), n) * Math.sign(Math.cos(u)) * Math.pow(Math.abs(Math.cos(u)), m);
            const y = B * Math.sign(Math.cos(v)) * Math.pow(Math.abs(Math.cos(v)), n) * Math.sign(Math.sin(u)) * Math.pow(Math.abs(Math.sin(u)), m);
            const z = C * Math.sign(Math.sin(v)) * Math.pow(Math.abs(Math.sin(v)), n);

            newVertices.push(x, y, z);
        }
    }

    for (let phi = 0; phi < phiSteps; phi++) {
        for (let theta = 0; theta < thetaSteps; theta++) {
            const current = phi * (thetaSteps + 1) + theta;
            const next = current + thetaSteps + 1;

            newIndices.push(current, next, current + 1);
            newIndices.push(next, next + 1, current + 1);

            // Connect the last vertex to the first vertex in each loop to close the model
            if (theta === thetaSteps - 1) {
                newIndices.push(current + 1, next + 1, current + 2 - thetaSteps);
                newIndices.push(next + 1, next + 2 - thetaSteps, current + 2 - thetaSteps);
            }
        }
    }

    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3));
    newGeometry.setIndex(newIndices);

    return newGeometry;
}

// Function to reset the superellipsoid to its default state
function resetSuperellipsoid() {
    // Set default values for parameters
    const defaultA = 2;
    const defaultB = 2;
    const defaultC = 2;
    const defaultN = 2;
    const defaultM = 2;

    // Set default values in the UI
    document.getElementById('paramA').value = defaultA;
    document.getElementById('paramB').value = defaultB;
    document.getElementById('paramC').value = defaultC;
    document.getElementById('paramN').value = defaultN;
    document.getElementById('paramM').value = defaultM;

    // Update the superellipsoid based on default values
    updateSuperellipsoid();

    // Continue the rotation
    continueRotation();
}

// Function to continue the rotation
function continueRotation() {
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        superellipsoid.rotation.x += rotationSpeed;
        superellipsoid.rotation.y += rotationSpeed;
        renderer.render(scene, camera);
    }
    animate();
}

// Attach event listeners to the sliders for real-time updates
document.getElementById('paramA').addEventListener('input', updateSuperellipsoid);
document.getElementById('paramB').addEventListener('input', updateSuperellipsoid);
document.getElementById('paramC').addEventListener('input', updateSuperellipsoid);
document.getElementById('paramN').addEventListener('input', updateSuperellipsoid);
document.getElementById('paramM').addEventListener('input', updateSuperellipsoid);

// Attach event listener to the Reset button
document.getElementById('resetButton').addEventListener('click', resetSuperellipsoid);