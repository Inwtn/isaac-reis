import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { drawWorld } from "./pixel-world";

function openPortfolio(root: HTMLElement) {
  const html = document.documentElement;
  const loader = root.querySelector<HTMLElement>("[data-startup]");
  const progress = loader?.querySelector<HTMLElement>("[data-startup-progress]");
  const hero = root.querySelector<HTMLElement>("[data-arrival-copy]");
  const avatar = hero?.querySelector<HTMLImageElement>('img[src="/isaac-avatar-full.png"]');
  if (!html.hasAttribute("data-portfolio-opening") || !loader || !progress || !hero) return;
  const canvas = loader.querySelector<HTMLCanvasElement>("[data-startup-canvas]");
  const context = canvas?.getContext("2d") ?? null;

  let finished = false;
  let cancelled = false;
  let dayPosition = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  const drawStartup = () => {
    if (!canvas || !context) return;
    const mobile = innerWidth <= 760;
    const pixel = mobile ? 3 : 4;
    const width = Math.max(1, Math.ceil(innerWidth / pixel));
    const height = Math.max(1, Math.ceil(innerHeight / pixel));
    if (canvasWidth !== width || canvasHeight !== height) {
      canvasWidth = canvas.width = width;
      canvasHeight = canvas.height = height;
      context.imageSmoothingEnabled = false;
    }
    drawWorld(context, width, height, 0, 0, mobile, 0, dayPosition);
  };
  drawStartup();
  window.addEventListener("resize", drawStartup, { passive: true });
  const dayClock = { position: 0 };
  const entrance = gsap.timeline({ paused: true, onComplete: finish });
  entrance.to(progress, { scaleX: 1, duration: 3.65, ease: "none" }, 0)
    .to(dayClock, { position: 1, duration: 3.65, ease: "none", onUpdate: () => { dayPosition = dayClock.position; drawStartup(); } }, 0)
    .fromTo(loader.querySelectorAll("[data-startup-tile]"), { yPercent: 35, scale: .35, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 1, stagger: .012, duration: .36, ease: "steps(5)" }, .1)
    .fromTo(loader.querySelectorAll("[data-startup-copy]"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .3, ease: "power2.out", clearProps: "transform,opacity" }, .42)
    .to(loader, { opacity: 0, duration: .28, ease: "power2.inOut" }, 3.72)
    .fromTo(hero, { y: 24, opacity: .72 }, { y: 0, opacity: 1, duration: .43, ease: "power3.out", clearProps: "transform,opacity", immediateRender: false }, 3.72);

  function finish() {
    finished = true;
    html.removeAttribute("data-portfolio-opening");
    window.removeEventListener("resize", drawStartup);
  }

  const started = performance.now();
  const resources = [document.fonts.ready, avatar?.decode() ?? Promise.resolve()];
  let loaded = 0;
  for (const resource of resources) {
    const update = () => {
      if (!finished && !cancelled && entrance.paused() && entrance.progress() === 0) {
        loaded++;
        gsap.to(progress, { scaleX: loaded * .39, duration: .15, ease: "steps(5)", overwrite: true });
      }
    };
    void resource.then(update, update);
  }
  const play = () => {
    if (finished || cancelled) return;
    gsap.killTweensOf(progress);
    entrance.play();
  };
  let settle = 0;
  const deadline = window.setTimeout(play, 1250);
  void Promise.allSettled(resources).then(() => {
    if (!cancelled) settle = window.setTimeout(play, Math.max(0, 220 - (performance.now() - started)));
  });

  return () => {
    cancelled = true;
    window.clearTimeout(settle);
    window.clearTimeout(deadline);
    window.removeEventListener("resize", drawStartup);
    entrance.revert();
    gsap.killTweensOf(progress);
    gsap.set(progress, { clearProps: "transform" });
  };
}

export function attachPortfolioMotion(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  let lenis: Lenis | undefined;
  const localeKey = "inwtn:locale-copy-fade";
  const markLocaleSwitch = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("a.language-switch")) {
      try { sessionStorage.setItem(localeKey, "1"); } catch { /* The portal still opens normally without storage. */ }
    }
  };
  document.addEventListener("click", markLocaleSwitch, true);
  let localeFade = false;
  try {
    localeFade = sessionStorage.getItem(localeKey) === "1";
    sessionStorage.removeItem(localeKey);
  } catch { /* The language switch remains usable without storage. */ }
  if (localeFade) {
    root.dataset.localeCopyFade = "";
    window.setTimeout(() => delete root.dataset.localeCopyFade, 280);
  }
  const motion = gsap.matchMedia(root);
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    const scroller = new Lenis({ lerp: .115, stopInertiaOnNavigate: true });
    lenis = scroller;
    const tick = (time: number) => { scroller.raf(time * 1000); };
    const unsubscribe = scroller.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);

    root.dataset.portalMotion = "";
    const sections = root.querySelectorAll<HTMLElement>("[data-scene-entry]");
    for (const section of sections) {
      if (section.dataset.sceneEntry === "about") continue;
      const open = (trigger: ScrollTrigger) => {
        const position = trigger.progress;
        const eased = position * position * (3 - 2 * position);
        section.style.setProperty("--portal-open", String(eased));
        section.toggleAttribute("data-portal-passed", position >= .997);
      };
      ScrollTrigger.create({
        trigger: section,
        pin: section.querySelector<HTMLElement>(".scenePin") ?? section,
        pinSpacing: true,
        anticipatePin: 1,
        start: "top top",
        end: () => "+=" + innerHeight,
        onUpdate: open,
        onRefresh: open,
      });
    }

    const layout = new ResizeObserver(() => {
      scroller.resize();
      ScrollTrigger.refresh();
    });
    layout.observe(root);
    const disposeOpening = openPortfolio(root);
    return () => {
      layout.disconnect();
      delete root.dataset.portalMotion;
      for (const section of sections) {
        section.style.removeProperty("--portal-open");
        delete section.dataset.portalPassed;
      }
      disposeOpening?.();
      gsap.ticker.remove(tick);
      unsubscribe();
      scroller.destroy();
      lenis = undefined;
    };
  });

  return {
    jumpTo(y: number) {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    },
    dispose() {
      document.removeEventListener("click", markLocaleSwitch, true);
      motion.revert();
    },
  };
}
