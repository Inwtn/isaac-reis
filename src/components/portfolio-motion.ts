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
  const entrance = gsap.timeline({ paused: true, onComplete: finish });
  entrance.to(progress, { scaleX: 1, duration: .16, ease: "steps(6)" }, 0)
    .to(loader.querySelectorAll("[data-startup-tile]"), { yPercent: -110, opacity: 0, stagger: .035, duration: .26, ease: "steps(5)" }, .12)
    .to(loader, { opacity: 0, duration: .22, ease: "power2.inOut" }, .25)
    .fromTo(hero, { y: 24, opacity: .72 }, { y: 0, opacity: 1, duration: .43, ease: "power3.out", clearProps: "transform,opacity", immediateRender: false }, .25);

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
    dispose() { motion.revert(); },
  };
}
