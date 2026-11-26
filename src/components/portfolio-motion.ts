import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

function openPortfolio(root: HTMLElement) {
  const html = document.documentElement;
  const loader = root.querySelector<HTMLElement>("[data-startup]");
  const progress = loader?.querySelector<HTMLElement>("[data-startup-progress]");
  const hero = root.querySelector<HTMLElement>("[data-arrival-copy]");
  const avatar = hero?.querySelector<HTMLImageElement>('img[src="/isaac-avatar-full.png"]');
  if (!html.hasAttribute("data-portfolio-opening") || !loader || !progress || !hero) return;

  let finished = false;
  let cancelled = false;
  const inputs = ["pointerdown", "keydown", "wheel", "touchstart", "hashchange"] as const;
  const dawn = loader.querySelector<HTMLElement>("[data-startup-dawn]")!;
  const day = loader.querySelector<HTMLElement>("[data-startup-day]")!;
  const dusk = loader.querySelector<HTMLElement>("[data-startup-dusk]")!;
  const night = loader.querySelector<HTMLElement>("[data-startup-night]")!;
  const stars = loader.querySelector<HTMLElement>("[data-startup-stars]")!;
  const sun = loader.querySelector<HTMLElement>("[data-startup-sun]")!;
  const moon = loader.querySelector<HTMLElement>("[data-startup-moon]")!;
  const windows = loader.querySelectorAll<HTMLElement>("[data-startup-windows]");
  const entrance = gsap.timeline({ paused: true, onComplete: finish });
  entrance.to(progress, { scaleX: 1, duration: 3.65, ease: "none" }, 0)
    .to(dawn, { opacity: 0, duration: 1.05, ease: "none" }, .45)
    .to(day, { opacity: .76, duration: .65, ease: "none" }, .6)
    .to(day, { opacity: 0, duration: .8, ease: "none" }, 1.65)
    .to(dusk, { opacity: .88, duration: .6, ease: "none" }, 1.8)
    .to(dusk, { opacity: 0, duration: .75, ease: "none" }, 2.55)
    .to(night, { opacity: .86, duration: .85, ease: "none" }, 2.7)
    .to(stars, { opacity: .78, duration: .8, ease: "none" }, 2.65)
    .to(windows, { opacity: .92, duration: .8, stagger: .025, ease: "steps(5)" }, 2.55)
    .to(sun, { x: innerWidth * .34, y: -innerHeight * .38, duration: 1.55, ease: "power1.inOut" }, .35)
    .to(sun, { x: innerWidth * .66, y: innerHeight * .12, scale: .72, opacity: .4, duration: 1.35, ease: "power1.inOut" }, 1.9)
    .to(sun, { opacity: 0, duration: .22 }, 3.12)
    .fromTo(moon, { y: 15, opacity: 0 }, { y: 0, opacity: .92, duration: .45, ease: "steps(6)", clearProps: "transform" }, 3.02)
    .fromTo(loader.querySelectorAll("[data-startup-tile]"), { yPercent: 35, scale: .35, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 1, stagger: .012, duration: .36, ease: "steps(5)" }, .1)
    .fromTo(loader.querySelectorAll("[data-startup-copy]"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .3, ease: "power2.out", clearProps: "transform,opacity" }, .42)
    .to(loader, { opacity: 0, duration: .28, ease: "power2.inOut" }, 3.72)
    .fromTo(hero, { y: 24, opacity: .72 }, { y: 0, opacity: 1, duration: .43, ease: "power3.out", clearProps: "transform,opacity", immediateRender: false }, 3.72);

  function finish() {
    finished = true;
    html.removeAttribute("data-portfolio-opening");
    for (const event of inputs) window.removeEventListener(event, dismiss);
  }
  function dismiss() {
    entrance.progress(1).pause();
    finish();
  }

  for (const event of inputs) window.addEventListener(event, dismiss, { once: true, passive: true });

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
    for (const event of inputs) window.removeEventListener(event, dismiss);
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
