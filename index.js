import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import johnny from "./assets/johnny-dance.fbx"
import chris from "./assets/chris-dance.fbx"
import luis from "./assets/luis-dance.fbx"
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import './styles.css';

function createContainer(id) {
    const container = document.createElement('div');
    container.classList.add('container');
    container.setAttribute('id', 'container-1');
    document.body.appendChild(container);

    let expanded = false;
    // container.addEventListener('click', () => {
    //     console.log('here');
    //     if (expanded) {
    //         container.classList.remove('expanded');
    //         expanded = false;
    //     } else {
    //         container.classList.add('expanded');
    //         expanded = true;
    //     }
    // })

    return container;
}

function createHTML() {
    const container1 = createContainer('container-1');
    // const container2 = createContainer('container-2');
}


createHTML();

const mixers = [];
const objects = [];

class FBXClone {
    constructor(object) {
        const clone = SkeletonUtils.clone(object);
        this.object = clone;
        this.object.traverse(o=>o.frustumCulled = false);
    }

    animate() {
        const mixer = new THREE.AnimationMixer(this.object)
        mixers.push(mixer);
        const animationAction = mixer.clipAction(
            this.object.animations[0]
        );
        scene.add(this.object);
        animationAction.play();

        return mixer;
    }
}

const scene = new THREE.Scene()
scene.background = new THREE.Color("white")
const ambientLight = new THREE.AmbientLight(0x404040, )
scene.add(ambientLight)

const l1 = new THREE.PointLight(0xffffff, .5)
l1.position.set(0.8, 1.4, 1.0)
scene.add(l1)
const l2 = new THREE.PointLight(0xffffff, .5)
l2.position.set(-0.8, 1.4, 1.0)
scene.add(l2)
const l3 = new THREE.PointLight(0xffffff, .5)
l3.position.set(0.8, 1.4, -1.0)
scene.add(l3)
const l4 = new THREE.PointLight(0xffffff, .5)
l4.position.set(-0.8, 1.4, -1.0)
scene.add(l4)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.zoom = 0.01;
camera.position.set(-3.6, 1, 4.1)
camera.rotation.set(-.044, 1.11, 0.04)

const renderer = new THREE.WebGLRenderer()
console.log('here');
const container = document.getElementById('container-1');
container.appendChild(renderer.domElement)
console.log(container);
renderer.setSize(container.clientWidth, container.clientHeight)
// document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

// const createClone = () => {
//     if (objectCaptured) {
//         const clone = new FBXClone(object);
//         objects.push(clone);
//         mixers.push(clone.animate());
//     }
// }

async function createObject(model) {
    const fbxLoader = new FBXLoader()
    let modelReady = false;
    let objectCaptured;
    const object = await fbxLoader.loadAsync(model);
    object.scale.set(.01, .01, .01)
    objectCaptured = SkeletonUtils.clone(object);
    modelReady = true;
    
    const clone = new FBXClone(object);
    objects.push(clone);
    mixers.push(clone.animate());

    return object;
} 

// createObject(infiniti);
createObject(johnny);
// createObject(chris);
setTimeout(() => {
    createObject(luis);
}, 3000)

// const kachujinObject = await fbxLoader.loadAsync(kachujin);
// kachujinObject.scale.set(.01, .01, .01);
// scene.add(kachujinObject);

// window.addEventListener('click', () => {
//     createClone();
// })

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight
    // camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    render()
}

const stats = new Stats()
// document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let count = 0;
function animate() {
    requestAnimationFrame(animate)

    controls.update()

    const delta = clock.getDelta() / 4;
    for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(delta);
    }

    render()

    stats.update()
    count++
    if (count % 120 === 0) {
        console.log(camera);
    }
}

function render() {
    renderer.render(scene, camera)
}

animate()