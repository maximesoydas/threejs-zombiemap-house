import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { DirectionalLightHelper, metalness, texture } from "three/webgpu";
import { Sky } from "three/addons/objects/Sky.js";

console.log(Sky);
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

/**
 * Floor textures
 */
const floorAlphaTexture = textureLoader.load("./floor/alpha.webp");
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
);
const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
);
const floorArmTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
);
/**
 * Wall Textures
 */
const wallColorTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
);
const wallArmTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
);
/**
 * Bush Textures
 */
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
);
const bushArmTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
);
/**
 * Roof Textures
 */
const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
);
const roofArmTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
);

/**
 * Graves Textures
 */
const gravesColorTexture = textureLoader.load(
  "./graves/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
);
const gravesArmTexture = textureLoader.load(
  "./graves/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
);
const gravesNormalTexture = textureLoader.load(
  "./graves/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
);
/**
 * Door Textures
 */
const doorColorTexture = textureLoader.load("./door/color.webp");
const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load("./door/height.webp");
const doorNormalTexture = textureLoader.load("./door/normal.webp");
const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Repeat is a vector 2 it will tell threeJS how many times it will repeat
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

floorArmTexture.repeat.set(8, 8);
floorArmTexture.wrapT = THREE.RepeatWrapping;
floorArmTexture.wrapS = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

// Roof Repeat/wrap
roofArmTexture.repeat.set(3, 1);
roofArmTexture.wrapS = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(3, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

// Bush Repeat/wrap
bushArmTexture.repeat.set(2, 1);
bushArmTexture.wrapS = THREE.RepeatWrapping;

bushNormalTexture.repeat.set(2, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;

bushColorTexture.repeat.set(2, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;

/**
 * Graves repeat/wrap
 */
bushArmTexture.repeat.set(0.3, 0.4);

bushNormalTexture.repeat.set(0.3, 0.4);

bushColorTexture.repeat.set(0.3, 0.4);

//floor texture colorspace
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

//roof texture colorspace
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
//wall texture colorspace
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
// bush texture colorspace
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
// scene.add(sphere);

// Floor Geometry
// a floor concises of planegeometry and a mesh still acesible with floor.material and floor.geometry
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 300, 300),
  new THREE.MeshStandardMaterial({
    // wireframe: true,
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorArmTexture,
    roughnessMap: floorArmTexture,
    metalnessMap: floorArmTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  })
);
// floor.rotation.y = 0.5;
floor.rotation.x = -Math.PI * 0.5;
// floor.rotation.z = ;

scene.add(floor);
gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");

gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

// House container

const house = new THREE.Group();
scene.add(house);

// house measurements best practice

const houseMeasurements = {
  width: 4,
  height: 2.5,
  depth: 4,
};

// walls

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    metalnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += 2.5 / 2; // += not necessary as it is equal to 0 by defualt position.y
house.add(walls);

// roof

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y += 3.2; // size of the wall + half the size of the height of the roof
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//door

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    // color: "white",
    map: doorColorTexture,
    trasnparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "darkgreen",
  map: bushColorTexture,
  aoMap: bushArmTexture,
  roughnessMap: bushArmTexture,
  metalnessMap: bushArmTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5); // same value on x y and z
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;
house.add(bush1, bush2, bush3, bush4);

// Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2); // width, height, depth
const graveMaterial = new THREE.MeshStandardMaterial({
  // color: "black",
  map: gravesColorTexture,
  aoMap: gravesArmTexture,
  roughnessMap: gravesArmTexture,
  metalnessMap: gravesArmTexture,
  normalMap: gravesNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  // calculate the angle
  const angle = Math.random() * Math.PI * 2; //get a full circle of the angle because, Math.PI is half a circle so multiplied by 2 gives a whole circle
  const radius = 4 + Math.random() * 4;
  const x = Math.sin(angle) * radius; // this is a x axes positional value on a circle according to the angle value)
  const z = Math.cos(angle) * radius; // this is a z axes positional value on a circle according to the const angle value

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  // Add to graves group
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts Light
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;
gui.add(camera.position, "x").min(-20).max(20).step(0.001).name("positionX");
gui.add(camera.position, "y").min(1).max(20).step(0.001).name("positionY");
gui.add(camera.position, "z").min(-20).max(20).step(0.001).name("positionZ");
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
 * Shadows
 */

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// cast and receive

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
// reduce the amplitude of the ortographic camera so that the scene fits in the middle
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.top = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.top = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.top = 10;

/**
 * Sky
 */

const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms;

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */

// scene.fog = new THREE.Fog("#", 1, 13);
scene.fog = new THREE.FogExp2("#043440", 0.1);

/**
 * Animate
 */
const timer = new Timer(); // replaces getElapsedTime() fixes same frame same time issue / needs to be imported

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghost
  const ghost1Angle = elapsedTime * 0.5; // angle and speed of rotation
  ghost1.position.x = Math.cos(ghost1Angle) * 4; // position and direction of rotation
  ghost1.position.z = Math.sin(ghost1Angle) * 4; // position and direction of rotation
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45); // position and direction of rotation
  const ghost2Angle = -elapsedTime * 0.28; // angle and speed of rotation
  ghost2.position.x = Math.cos(ghost2Angle) * 5; // position and direction of rotation
  ghost2.position.z = Math.sin(ghost2Angle) * 5; // position and direction of rotation
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45); // position and direction of rotation
  const ghost3Angle = elapsedTime * 0.18; // angle and speed of rotation
  ghost3.position.x = Math.cos(ghost3Angle) * 6; // position and direction of rotation
  ghost3.position.z = Math.sin(ghost3Angle) * 6; // position and direction of rotation
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45); // position and direction of rotation

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// 400gr flour -> 140gr butter -> 7gr salt -> 12gr sugar -> 150cl water = pate briser
// straight water -> then butter goes in 200celcius watch 10min
