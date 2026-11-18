import * as THREE from "three";

const starVertex = `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uWarp;
  uniform float uVelocity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float depth = mod(p.z + uTime * (18.0 + uWarp * 1800.0), 9000.0) - 9000.0;
    p.z = depth;
    p.x += sin(uTime * 0.18 + position.y * 0.02) * 8.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float stretch = 1.0 + (uWarp * 16.0 + uVelocity * 5.0) * smoothstep(-9000.0, -300.0, depth);
    gl_PointSize = clamp(aSize * stretch * (1050.0 / max(80.0, -mvPosition.z)), 1.5, 36.0);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    vAlpha = 0.55 + 0.45 * sin(uTime * 1.1 + position.x * 0.03 + position.y * 0.02);
  }
`;

const starFragment = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uWarp;
  uniform float uVelocity;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = exp(-d * 8.0) * (1.0 - smoothstep(0.12, 0.5, d));
    float ray = exp(-abs(uv.x) * 36.0) * exp(-abs(uv.y) * 5.0) * (uWarp * 0.9 + uVelocity * 0.42);
    float alpha = max(glow, ray) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function makeStarField(count, colorMix = 0) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const gold = new THREE.Color("#ffd23f");
  const cyan = new THREE.Color("#00e8ff");
  const violet = new THREE.Color("#9562ff");
  const magenta = new THREE.Color("#ee55d4");
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 8400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2300;
    positions[i * 3 + 2] = -Math.random() * 9000;
    const pick = Math.random();
    const color = pick < 0.48 ? gold : pick < 0.76 ? cyan : pick < 0.96 ? violet : magenta;
    const mix = color.clone().lerp(gold, colorMix * 0.4);
    colors[i * 3] = mix.r;
    colors[i * 3 + 1] = mix.g;
    colors[i * 3 + 2] = mix.b;
    sizes[i] = 1 + Math.random() * 3.5;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

function makeNebula(color, scale, position) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; varying vec2 vUv; void main(){vec2 p=(vUv-.5)*2.0; float d=length(p); float cloud=exp(-d*d*2.4)*(.72+.18*sin(p.x*5.0+uTime*.16)*cos(p.y*4.0-uTime*.13)); float wisps=exp(-abs(p.y-p.x*.23)*6.0)*.13; float a=(cloud+wisps)*smoothstep(1.0,.12,d)*.27; gl_FragColor=vec4(uColor,a);}`,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  plane.scale.set(...scale);
  plane.position.set(...position);
  plane.userData.nebulaMaterial = material;
  return plane;
}

export function createSpaceExperience({ onProgress = () => {}, onSector = () => {} } = {}) {
  const canvas = document.querySelector("#space-canvas");
  if (!canvas) return { setProgress() {}, resize() {} };

  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x02020a, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 14000);
  camera.position.set(0, 0, 0);
  const starUniforms = { uTime: { value: 0 }, uWarp: { value: 0 }, uVelocity: { value: 0 } };
  const stars = new THREE.Points(makeStarField(mobile ? 520 : 1900), new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: starUniforms,
    vertexShader: starVertex,
    fragmentShader: starFragment,
  }));
  scene.add(stars);

  const farStars = new THREE.Points(makeStarField(mobile ? 240 : 850, 0.35), new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: starUniforms,
    vertexShader: starVertex,
    fragmentShader: starFragment,
  }));
  farStars.scale.setScalar(1.55);
  farStars.position.set(80, -30, -300);
  scene.add(farStars);

  const nebulas = [
    makeNebula("#5337aa", [2900, 1450, 1], [-1050, 260, -2000]),
    makeNebula("#087a9f", [2500, 1250, 1], [1280, -360, -4750]),
    makeNebula("#6230a8", [3300, 1500, 1], [-550, 140, -7400]),
  ];
  nebulas.forEach((nebula) => scene.add(nebula));

  const hole = new THREE.Group();
  hole.position.set(2200, 0, -5200);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(235, mobile ? 36 : 64, mobile ? 28 : 48),
    new THREE.MeshBasicMaterial({ color: 0x010106 }),
  );
  hole.add(core);
  const disk = new THREE.Mesh(
    new THREE.RingGeometry(237, 420, mobile ? 72 : 128, 1),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vPos; void main(){vPos=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vPos;
        void main() {
          float r = length(vPos);
          float angle = atan(vPos.y, vPos.x);
          float highlight = pow(max(0.0, sin(angle + 0.45)), 4.0);
          float photonRing = exp(-pow((r - 246.0) / 5.0, 2.0));
          float accretion = exp(-pow((r - 282.0) / 38.0, 2.0));
          float outerHaze = exp(-pow((r - 345.0) / 65.0, 2.0));
          float shimmer = 0.94 + 0.06 * sin(angle * 3.0 - uTime * 0.16);
          float alpha = (photonRing * 0.7 + accretion * (0.1 + highlight * 0.13)
            + outerHaze * 0.035) * shimmer;
          vec3 color = mix(vec3(0.25, 0.26, 0.30), vec3(0.86, 0.82, 0.76),
            photonRing * 0.75 + highlight * 0.25);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    }),
  );
  hole.add(disk);
  const lens = new THREE.Mesh(
    new THREE.TorusGeometry(241, 2, 6, 128),
    new THREE.MeshBasicMaterial({ color: 0xc7c3c5, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending }),
  );
  hole.add(lens);
  scene.add(hole);

  let progress = 0;
  let targetZ = 0;
  let pointerX = 0;
  let pointerY = 0;
  let previousCameraZ = 0;
  const clock = new THREE.Clock();

  function trackPointer(event) {
    pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
  }
  window.addEventListener("pointermove", trackPointer, { passive: true });

  function setProgress(value) {
    progress = THREE.MathUtils.clamp(value, 0, 1);
    targetZ = -progress * 5000;
    const warpStart = THREE.MathUtils.smoothstep(progress, 0.12, 0.84);
    starUniforms.uWarp.value = reducedMotion ? 0 : warpStart;
    camera.fov = 62 + warpStart * 18;
    camera.updateProjectionMatrix();
    onProgress(progress);
  }

  const sectorObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onSector(entry.target.dataset.sector);
    });
  }, { rootMargin: "-42% 0px -45% 0px", threshold: 0 });
  document.querySelectorAll("[data-sector]").forEach((sector) => sectorObserver.observe(sector));

  function render() {
    const elapsed = clock.getElapsedTime();
    starUniforms.uTime.value = reducedMotion ? 0 : elapsed;
    camera.position.z += (targetZ - camera.position.z) * 0.055;
    const scrollSpeed = Math.min(Math.abs(camera.position.z - previousCameraZ) / 20, 1.5);
    starUniforms.uVelocity.value += (scrollSpeed - starUniforms.uVelocity.value) * 0.16;
    previousCameraZ = camera.position.z;
    const depth = Math.abs(camera.position.z);
    const proximity = THREE.MathUtils.smoothstep(depth, 3300, 4900);
    camera.position.x = 2200 * progress + pointerX * 38 * (1 - proximity * 0.5) + Math.sin(elapsed * 0.22) * 22 * (1 - proximity * 0.4);
    camera.position.y = -pointerY * 26 + Math.cos(elapsed * 0.28) * 12;
    const lookX = camera.position.x + (hole.position.x - camera.position.x) * proximity * 0.65;
    camera.lookAt(lookX, 0, camera.position.z - 1200 + proximity * 500);
    nebulas.forEach((nebula) => { nebula.userData.nebulaMaterial.uniforms.uTime.value = elapsed; });
    disk.material.uniforms.uTime.value = elapsed;
    hole.rotation.z = Math.sin(elapsed * 0.08) * 0.025;
    disk.rotation.z = elapsed * 0.005;
    lens.material.opacity = 0.25 + proximity * 0.18;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(render);
  }

  let frame = window.requestAnimationFrame(render);

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width <= 700 ? 1 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frame);
    renderer.dispose();
    stars.geometry.dispose();
    farStars.geometry.dispose();
    window.removeEventListener("pointermove", trackPointer);
  }, { once: true });

  return { setProgress, resize };
}
