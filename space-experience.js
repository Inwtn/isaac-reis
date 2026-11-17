import * as THREE from "three";

const starVertex = `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uWarp;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float depth = mod(p.z + uTime * (18.0 + uWarp * 1800.0), 9000.0) - 9000.0;
    p.z = depth;
    p.x += sin(uTime * 0.18 + position.y * 0.02) * 8.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float stretch = 1.0 + uWarp * 12.0 * smoothstep(-9000.0, -300.0, depth);
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
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float glow = exp(-d * 8.0) * (1.0 - smoothstep(0.12, 0.5, d));
    float ray = exp(-abs(uv.x) * 36.0) * exp(-abs(uv.y) * 5.0) * uWarp * 0.62;
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
  const starUniforms = { uTime: { value: 0 }, uWarp: { value: 0 } };
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
    new THREE.RingGeometry(245, 510, mobile ? 72 : 128, 1),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vPos; void main(){vPos=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `uniform float uTime; varying vec2 vPos; void main(){float r=length(vPos);float a=atan(vPos.y,vPos.x);float band=sin(a*16.0-r*.045-uTime*1.8)*.5+.5;vec3 hot=vec3(1.0,.76,.25);vec3 cyan=vec3(0.0,.82,1.0);vec3 violet=vec3(.52,.22,1.0);vec3 col=mix(violet,hot,smoothstep(260.0,470.0,r));col=mix(col,cyan,smoothstep(.70,.98,band)*.36);float alpha=(.3+band*.58)*smoothstep(245.0,285.0,r)*(1.0-smoothstep(480.0,510.0,r));gl_FragColor=vec4(col,alpha);}`,
    }),
  );
  disk.rotation.z = -0.13;
  hole.add(disk);
  const lens = new THREE.Mesh(
    new THREE.TorusGeometry(305, 8, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0x83dfff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending }),
  );
  lens.scale.set(1, 0.47, 1);
  hole.add(lens);
  const outerLens = new THREE.Mesh(
    new THREE.TorusGeometry(570, 2, 5, 128),
    new THREE.MeshBasicMaterial({ color: 0x9562ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending }),
  );
  outerLens.scale.set(1, 0.43, 1);
  hole.add(outerLens);
  scene.add(hole);

  const glow = new THREE.PointLight(0x8a44ff, 1200, 3400, 1.5);
  glow.position.copy(hole.position);
  scene.add(glow);
  const goldGlow = new THREE.PointLight(0xffbf2b, 700, 2500, 1.7);
  goldGlow.position.set(1920, 70, -5150);
  scene.add(goldGlow);

  let progress = 0;
  let targetZ = 0;
  let currentWarp = 0;
  const clock = new THREE.Clock();

  function setProgress(value) {
    progress = THREE.MathUtils.clamp(value, 0, 1);
    targetZ = -progress * 5000;
    const warpStart = THREE.MathUtils.smoothstep(progress, 0.48, 0.92);
    starUniforms.uWarp.value = reducedMotion ? 0 : warpStart;
    camera.fov = 62 + warpStart * 9;
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
    currentWarp += (starUniforms.uWarp.value - currentWarp) * 0.055;
    camera.position.z += (targetZ - camera.position.z) * 0.055;
    const depth = Math.abs(camera.position.z);
    const proximity = THREE.MathUtils.smoothstep(depth, 3300, 4900);
    camera.position.x = 2200 * progress + Math.sin(elapsed * 0.13) * 13 * (1 - proximity * 0.4);
    camera.position.y = Math.cos(elapsed * 0.16) * 7;
    const lookX = camera.position.x + (hole.position.x - camera.position.x) * proximity;
    camera.lookAt(lookX, 0, camera.position.z - 1200 + proximity * 500);
    nebulas.forEach((nebula) => { nebula.userData.nebulaMaterial.uniforms.uTime.value = elapsed; });
    disk.material.uniforms.uTime.value = elapsed;
    hole.rotation.z = Math.sin(elapsed * 0.08) * 0.025;
    lens.material.opacity = 0.16 + proximity * 0.28;
    outerLens.material.opacity = 0.1 + proximity * 0.2;
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
  }, { once: true });

  return { setProgress, resize };
}
