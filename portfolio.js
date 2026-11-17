import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const scrollCounter = document.querySelector(".scroll-counter");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const storageKey = "isaac-space-portfolio-v1";

const initialState = (() => {
  try {
    return { xp: 0, crystals: [], achievements: [], loops: 0, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return { xp: 0, crystals: [], achievements: [], loops: 0 };
  }
})();

let state = initialState;
let toastTimer;
let previousScrollY = window.scrollY;
let hasMoved = false;
let resetInProgress = false;
let audioContext;
let drone;
let droneGain;
let ambientGain;

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function showToast(name) {
  const toast = document.querySelector("#achievement-toast");
  const title = document.querySelector("#toast-title");
  if (!toast || !title) return;
  title.textContent = name;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
}

function unlock(id, name, bonus = 0) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  state.xp += bonus;
  save();
  updateHud();
  showToast(name);
}

function addXp(amount) {
  state.xp += Math.max(0, Math.round(amount));
  save();
  updateHud();
}

function updateHud(progress = getProgress()) {
  const level = Math.floor(state.xp / 100) + 1;
  const levelProgress = state.xp % 100;
  const levelNode = document.querySelector("#hud-level");
  if (levelNode) levelNode.textContent = String(level).padStart(2, "0");
  const xpNode = document.querySelector("#hud-xp");
  if (xpNode) xpNode.textContent = `${state.xp} XP`;
  const fill = document.querySelector("#xp-fill");
  if (fill) fill.style.width = `${levelProgress}%`;
  const track = document.querySelector(".xp-track");
  if (track) track.setAttribute("aria-valuenow", String(levelProgress));
  const crystalNode = document.querySelector("#hud-crystals");
  if (crystalNode) crystalNode.textContent = String(state.crystals.length);
  const loopNode = document.querySelector("#hud-loop");
  if (loopNode) loopNode.textContent = `CYCLE ${String(state.loops + 1).padStart(2, "0")}`;
  const depth = document.querySelector("#hud-depth");
  if (depth) depth.textContent = `${Math.max(0, Math.round(10000 * (1 - progress))).toLocaleString("en-US")} km`;
  if (scrollCounter) scrollCounter.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
  root.style.setProperty("--scroll-progress", `${progress * 100}%`);
}

function getProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function setSector(sector) {
  const label = document.querySelector("#hud-sector");
  if (label && sector) label.textContent = sector;
  const section = sector && [...document.querySelectorAll("[data-sector]")].find((item) => item.dataset.sector === sector);
  document.querySelectorAll(".map-point").forEach((point) => point.classList.toggle("is-active", point.dataset.map === section?.id));
}

let space = { setProgress() {}, resize() {} };
import("./space-experience.js").then(({ createSpaceExperience }) => {
  space = createSpaceExperience({
    onProgress(progress) {
      updateHud(progress);
      if (progress > 0.012 && !hasMoved) {
        hasMoved = true;
        unlock("first-contact", "First Contact", 10);
      }
      if (progress > 0.3) unlock("explorer", "Deep Space Explorer", 25);
      if (progress > 0.992 && !resetInProgress) triggerNewGame();
    },
    onSector: setSector,
  });
  space.resize();
  space.setProgress(getProgress());
}).catch(() => {
  root.classList.add("space-unavailable");
});

function triggerNewGame() {
  resetInProgress = true;
  unlock("event-horizon", "Beyond the Event Horizon", 50);
  state.loops += 1;
  save();
  document.body.dataset.newGame = "true";
  document.querySelector(".singularity-flash")?.classList.add("is-active");
  showToast("NEW GAME+ · XP RETAINED");
  window.setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    ScrollTrigger.refresh();
    resetInProgress = false;
    document.querySelector(".singularity-flash")?.classList.remove("is-active");
  }, 850);
}

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 620) closeMenu();
  });
}

const lenis = new Lenis({
  duration: 1.15,
  smoothWheel: !reducedMotion,
  syncTouch: false,
  wheelMultiplier: 0.9,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

ScrollTrigger.create({
  trigger: document.documentElement,
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => space.setProgress(self.progress),
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -85, duration: 1.35 });
  });
});

const sectorObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setSector(entry.target.dataset.sector);
  });
}, { rootMargin: "-40% 0px -45% 0px", threshold: 0 });
document.querySelectorAll("[data-sector]").forEach((sector) => sectorObserver.observe(sector));

if (!reducedMotion) {
  gsap.utils.toArray(".project-card, .timeline-item, .toolkit-groups > div, .contact-grid").forEach((item) => {
    gsap.fromTo(item, { autoAlpha: 0.28, y: 45, scale: 0.96, filter: "blur(8px)" }, {
      autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "none",
      scrollTrigger: { trigger: item, start: "top 92%", end: "top 48%", scrub: 0.7 },
    });
  });
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      addXp(5);
      if (!state.achievements.includes("project-curious")) unlock("project-curious", "Signal Traced", 5);
    }
  });
});

document.querySelectorAll(".collectible").forEach((item) => {
  const id = item.dataset.crystal;
  if (state.crystals.includes(id)) item.classList.add("is-collected");
  item.addEventListener("click", () => {
    if (state.crystals.includes(id)) return;
    state.crystals.push(id);
    addXp(20);
    item.classList.add("is-collected");
    showToast("Stellar Fragment Collected");
    if (state.crystals.length >= 3) unlock("star-hunter", "Star Hunter", 30);
    else save();
  });
});

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
document.addEventListener("keydown", (event) => {
  if (event.key === konami[konamiIndex] || event.key.toLowerCase() === konami[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === konami.length) {
      document.body.dataset.konami = "true";
      unlock("konami", "Secret Signal Found", 50);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = event.key === konami[0] ? 1 : 0;
  }
});

document.querySelector("#sound-toggle")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
    drone = audioContext.createOscillator();
    const low = audioContext.createOscillator();
    droneGain = audioContext.createGain();
    const lowGain = audioContext.createGain();
    ambientGain = lowGain;
    const filter = audioContext.createBiquadFilter();
    drone.type = "sine";
    low.type = "triangle";
    drone.frequency.value = 55;
    low.frequency.value = 55.6;
    filter.type = "lowpass";
    filter.frequency.value = 180;
    droneGain.gain.value = 0;
    lowGain.gain.value = 0;
    drone.connect(droneGain).connect(filter);
    low.connect(lowGain).connect(filter);
    filter.connect(audioContext.destination);
    drone.start();
    low.start();
  }
  if (audioContext.state === "suspended") await audioContext.resume();
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(enabled));
  button.querySelector(".sound-label").textContent = enabled ? "SOUND ON" : "SOUND OFF";
  gsap.to(droneGain.gain, { value: enabled ? 0.026 : 0, duration: 0.6 });
  gsap.to(ambientGain.gain, { value: enabled ? 0.008 : 0, duration: 0.6 });
  unlock("sound-check", "Ambient Channel Tuned", 0);
});

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  if (currentY > previousScrollY) addXp((currentY - previousScrollY) * 0.055);
  previousScrollY = currentY;
}, { passive: true });

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
  space.resize();
});

root.classList.add("js-ready");
updateHud();
save();
space.resize();
