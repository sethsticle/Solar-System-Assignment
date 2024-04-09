import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
//import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';


import starsTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Stars.jpg';
import sunTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Sun.jpg';
import mercuryTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Mercury.jpg';
import earthTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Earth.jpg';
import moonTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Moon Texture.jpg';
import jupiterTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Jupiter.jpg';
import marsTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Mars.jpg';
import neptuneTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Neptune.jpg';
import plutoTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Pluto.jpg';
import saturnRingTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Saturn Ring.png';
import saturnTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Saturn.jpg';
import uranusTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Uranus.jpg';
import uranusRingTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/UranusRing.png';
import venusTexture from '/Users/sethhendrikz/Documents/THREE.JS PROJECTS/Lighting Fixes/pointLight/Img/Venus.jpg';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();
renderer.shadowMap.enabled = true;


const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

//Lighting
const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x202020, 10);
scene.add(ambientLight);

//helpers
// const axesHelper = new THREE.AxesHelper(30);
// scene.add(axesHelper);
// const pointLightHelper = new THREE.PointLightHelper( pointLight, 25 ); 
// scene.add( pointLightHelper );
//////////////////////////////////////////////////////////////////////////////////////////
const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
console.log(sun);



//lets make one function to make it easier to make all the child objects of the SUN
function createPlanets(size, texture, position, ring, meshname) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({map: textureLoader.load(texture)});
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = meshname;
  const obj = new THREE.Object3D();
  obj.add(mesh);
  //lets check if the planets need a ring added to them
  if(ring) {
      const ringGeo = new THREE.RingGeometry(ring.innerRadius,ring.outerRadius,32);
      const ringMat = new THREE.MeshStandardMaterial({map: textureLoader.load(ring.texture),side: THREE.DoubleSide});
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      ringMesh.rotation.x = -0.5 * Math.PI; //this makes sit flat to the horizontal
      ringMesh.receiveShadow= true;
  }
  scene.add(obj);
  mesh.position.x = position;
  return {mesh, obj, meshname}
}
// Function to create a moon orbiting around a planet
function createMoon(parentPlanet, size, texture, distanceFromPlanet, orbitSpeed) {
  const moonGeometry = new THREE.SphereGeometry(size, 30, 30);
  const moonMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.x = distanceFromPlanet;
  const obj = new THREE.Object3D();
  obj.add(moonMesh);
  parentPlanet.add(obj);
  console.log(obj);
  return { mesh: moonMesh, orbitSpeed: orbitSpeed , obj: obj};
}

//lets now use these functions to make some planets
const mercury = createPlanets(3.2, mercuryTexture, 28, { angle: Math.PI / 4 }, "Mercury");
const venus = createPlanets(5.8, venusTexture, 44, { angle: Math.PI / 3 }, "Venus");
  const earth = createPlanets(6, earthTexture, 62, { angle: Math.PI / 2 },"Earth");

 const earthMoon = createMoon(earth.mesh, 3, moonTexture, 15, 0.03); // Adjust the distance and orbit speed later on
 console.log(earthMoon);

const mars = createPlanets(4, marsTexture, 78, { angle: Math.PI / 1.5 }, "Mars");
const jupiter = createPlanets(12, jupiterTexture, 100, { angle: Math.PI }, "Jupiter");
const saturn = createPlanets(10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture, angle: Math.PI * 1.5 }, "Saturn");
const uranus = createPlanets(7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture, angle: Math.PI * 1.7 }, "Uranus");
const neptune = createPlanets(7, neptuneTexture, 200, { angle: Math.PI * 1.9 }, "Neptune");
const pluto = createPlanets(2.8, plutoTexture, 216, { angle: Math.PI * 2.1 },"Pluto");


// Create a GUI for paths to be shown
const gui = new dat.GUI();

const guiControls = {
  showOrbits: false // Initial state: orbits are visible
};
// Define an object to hold the GUI controls
const guiControlsFolder = gui.addFolder('OrbitControls');

// Add controls to the GUI
guiControlsFolder.add(guiControls, 'showOrbits').onChange(function(value) {
  // Toggle visibility of orbit paths based on the value of showOrbits
  earthOrbit.visible = value;
  marsOrbit.visible = value;
  jupiterOrbit.visible = value;
  saturnOrbit.visible = value;
  uranusOrbit.visible = value;
  neptuneOrbit.visible = value;
  plutoOrbit.visible = value;
  mercuryOrbit.visible = value;
  earthMoonOrbitPaths.forEach(path => path.visible = value); // Set visibility for each orbit path
});

// Function to create orbit paths
function createOrbitPaths(distance) {
  const circleGeo = new THREE.RingGeometry(distance - 0.2, distance + 0.2, 64);
  const circleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const circle = new THREE.Mesh(circleGeo, circleMat);
  circle.position.set(0, 0, 0); // Centered at (0,0,0)
  circle.rotateX(-Math.PI / 2); // Align with the x-y plane
  // Set initial visibility
  circle.visible = guiControls.showOrbits;
  // Add circle to the scene
  scene.add(circle);
  return circle;
}

// Create orbit paths
const earthOrbit = createOrbitPaths(62);
const marsOrbit = createOrbitPaths(78);
const jupiterOrbit = createOrbitPaths(100);
const saturnOrbit = createOrbitPaths(138);
const uranusOrbit = createOrbitPaths(176);
const neptuneOrbit = createOrbitPaths(200);
const plutoOrbit = createOrbitPaths(216);
const mercuryOrbit = createOrbitPaths(28);

// Function to create moon orbit paths
function createMoonOrbitPaths(parentPlanet, orbitRadius, segments, numOrbits) {
  const orbitPaths = [];
  for (let i = 0; i < numOrbits; i++) {
      const orbitRadiusOffset = orbitRadius + (i * 5); // Adjust the offset based on the number of orbits
      const circleGeo = new THREE.RingGeometry(orbitRadiusOffset - 0.1, orbitRadiusOffset + 0.1, segments);
      const circleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const circle = new THREE.Mesh(circleGeo, circleMat);
      circle.position.set(0, 0, 0); // Centered at (0,0,0)
      
      circle.rotateX(-Math.PI / 2); // Align with the x-y plane
      parentPlanet.add(circle); // Add the orbit path to the parent planet
      orbitPaths.push(circle); // Push the orbit path to the array
      
  }
  return orbitPaths;
}

// Create moon orbit paths for the Earth
const earthMoonOrbitPaths = createMoonOrbitPaths(earth.mesh, 15, 64, 1); // Adjust the parameters as needed


function animate()
{
     //Self-rotation
     sun.rotateY(0.005);
  mercury.mesh.rotateY(0.005);
  venus.mesh.rotateY(0.003);
    earth.mesh.rotateY(0.03);
  earthRotation += 0.03; //day counter
  mars.mesh.rotateY(0.019);
  jupiter.mesh.rotateY(0.05);
  saturn.mesh.rotateY(0.039);
  uranus.mesh.rotateY(0.04);
  neptune.mesh.rotateY(0.033);
  pluto.mesh.rotateY(0.009);

  //Around-sun-rotation
  mercury.obj.rotateY(0.05);
  venus.obj.rotateY(0.016);
    earth.obj.rotateY(0.02);
  mars.obj.rotateY(0.009);
  jupiter.obj.rotateY(0.003);
  saturn.obj.rotateY(0.0008);
  uranus.obj.rotateY(0.0005);
  neptune.obj.rotateY(0.0002);
  pluto.obj.rotateY(0.00009);
// Orbiting movement of the Moon around the Earth
earthMoon.obj.rotateY(-0.01);


// Check if the Earth sphere completes a full rotation (2π radians)
if (earthRotation >= Math.PI * 2) {
  // Increment the total number of days
  totalDays++;
  // Reset the rotation of the Earth sphere
  earthRotation = 0;
}

// Update the counter display
counterElement.innerText = `Total Days On Earth: ${totalDays}`;
renderer.render(scene, camera);

}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//lets add a counter for fun:)
let totalDays = 0;
const counterElement = document.getElementById('counter');
let earthRotation =0; 

//////////////////////////////////////////////////////////////////////////////////////////
// //use this to find the best lighting!!
// Initialize dat.gui
// const gui = new dat.GUI();

// Parameters for controlling lights
const lightParams = {
  pointLightIntensity: pointLight.intensity,
  ambientLightColor: ambientLight.color.getHex(),
  pointLightDistance: pointLight.distance,
};

// Folder for light controls
const lightFolder = gui.addFolder('Lighting');
lightFolder.add(lightParams,'pointLightDistance',0, 1000).onChange(value=> {
  pointLight.distance = value;
})

lightFolder.add(lightParams, 'pointLightIntensity', 0, 10000).onChange(value => {
  pointLight.intensity = value;
});

lightFolder.addColor(lightParams, 'ambientLightColor').onChange(value => {
  ambientLight.color.setHex(value);
});
//////////////////////////////////////////////////////////////////////////////////////////

