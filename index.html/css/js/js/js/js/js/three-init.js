/* -------------------------------------------------------
   KEYZEN V2 — 3D KEYBOARD (CYBERPUNK NEON BLUE VERSION)
   Powered by Three.js
--------------------------------------------------------*/

let scene, camera, renderer, keyboardGroup = new THREE.Group();
let keyObjects = {}; // store mesh per key

init3D();
animate();

/* -------------------------------------------------------
   INITIALIZE 3D ENVIRONMENT
--------------------------------------------------------*/
function init3D() {

    /* SCENE */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);

    /* CAMERA */
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / 400,
        0.1,
        100
    );
    camera.position.set(0, 4, 12);

    /* RENDERER */
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("keyboard3D").appendChild(renderer.domElement);

    /* POSTPROCESSING GLOW */
    const renderScene = new THREE.RenderPass(scene, camera);

    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, 400),
        1.3,   // strength
        0.4,   // radius
        0.85   // threshold
    );
    bloomPass.enabled = true;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    window.composer = composer;

    /* LIGHTS */
    const ambient = new THREE.AmbientLight(0x1e3aff, 1.0);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0x4f7dff, 3);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    /* BUILD 3D KEYBOARD */
    buildKeyboard3D();

    /* HANDLE RESIZE */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, 400);
        bloomPass.setSize(window.innerWidth, 400);
    });
}

/* -------------------------------------------------------
   BUILD 3D KEYBOARD (simple blocks)
--------------------------------------------------------*/
function buildKeyboard3D() {

    const layout = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    const keyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0f1f,
        emissive: 0x1f3bff,
        emissiveIntensity: 0.4
    });

    const keyGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);

    let y = 0;
    layout.forEach(row => {
        let x = -(row.length * 0.55) / 2;
        [...row].forEach(char => {

            const keyMesh = new THREE.Mesh(keyGeometry, keyMaterial.clone());
            keyMesh.position.set(x, y, 0);

            scene.add(keyMesh);
            keyboardGroup.add(keyMesh);

            keyObjects[char] = keyMesh;

            x += 1.1;
        });
        y -= 1.1;
    });

    scene.add(keyboardGroup);
}

/* -------------------------------------------------------
   KEY PRESS ANIMATION (called from Engine)
--------------------------------------------------------*/
function animateKeyPress(char) {
    char = char.toUpperCase();
    const key = keyObjects[char];
    if (!key) return;

    // press down
    gsap.to(key.position, { y: key.position.y - 0.25, duration: 0.07 });

    // release
    gsap.to(key.position, { y: key.position.y, delay: 0.07, duration: 0.15 });

    // glow flash
    gsap.to(key.material, {
        emissiveIntensity: 1.5,
        duration: 0.05,
        yoyo: true,
        repeat: 1
    });
}

/* -------------------------------------------------------
   CONNECT ENGINE TYPING EVENTS → 3D ANIMATION
--------------------------------------------------------*/
document.addEventListener("keydown", (e) => {
    if (e.key.length === 1) animateKeyPress(e.key);
});

/* -------------------------------------------------------
   ANIMATION LOOP
--------------------------------------------------------*/
function animate() {

    // slight floating rotation
    keyboardGroup.rotation.y += 0.002;
    keyboardGroup.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;

    window.composer.render();
    requestAnimationFrame(animate);
}
