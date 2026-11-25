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
  const about = root.querySelector<HTMLElement>('[data-scene-entry="about"]');
  const aboutContent = about?.querySelector<HTMLElement>("[data-about-content]");
  const aboutSteps = about ? Array.from(about.querySelectorAll<HTMLElement>("[data-about-step]")) : [];
  const canAnimateAbout = Boolean(aboutContent && aboutSteps.length === 7);
  const seenKey = "inwtn:about-portal-seen";
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
  let aboutPlayed = false;
  try { aboutPlayed = sessionStorage.getItem(seenKey) === "1"; } catch { /* The one-shot can run for this page load. */ }
  const directAbout = about ? location.hash === `#${about.id}` : false;
  let intro: gsap.core.Timeline | undefined;
  let introFinished = false;
  const setAboutOpen = (value: number) => {
    if (!about) return;
    about.style.setProperty("--portal-open", String(value));
    about.style.setProperty("--about-content-scale", String(value));
  };
  const finishAboutIntro = () => {
    if (!about) return;
    if (intro && intro.progress() < 1) { intro.progress(1); return; }
    if (introFinished) return;
    introFinished = true;
    setAboutOpen(1);
    about.style.removeProperty("--about-content-scale");
    about.dataset.portalPassed = "";
    delete about.dataset.aboutIntroPending;
    delete about.dataset.aboutIntroActive;
    gsap.set(aboutSteps, { clearProps: "transform,opacity" });
    try { sessionStorage.setItem(seenKey, "1"); } catch { /* The section still finishes in its natural state. */ }
  };
  const startAboutIntro = () => {
    if (!about || !aboutContent || aboutPlayed || intro) return;
    about.removeAttribute("data-about-intro-pending");
    about.dataset.aboutIntroActive = "";
    const center = aboutContent.getBoundingClientRect();
    const origins = aboutSteps.map(node => {
      const item = node.getBoundingClientRect();
      return {
        x: Math.max(-70, Math.min(70, center.left + center.width / 2 - (item.left + item.width / 2)) * .28),
        y: Math.max(-70, Math.min(70, center.top + center.height / 2 - (item.top + item.height / 2)) * .28),
      };
    });
    setAboutOpen(0);
    const opening = { value: 0 };
    intro = gsap.timeline({ onComplete: finishAboutIntro });
    intro.to(opening, {
      value: 1,
      duration: .7,
      ease: "steps(12)",
      onUpdate: () => setAboutOpen(opening.value),
    }, 0);
    aboutSteps.forEach((node, index) => {
      const { x, y } = origins[index];
      intro!.fromTo(node,
        { opacity: 0, scale: .6, x, y, transformOrigin: "center center" },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: .5, ease: "back.out(1.25)", clearProps: "transform,opacity" },
        .4 + index * .1,
      );
    });
  };
  if (about && (aboutPlayed || directAbout || !canAnimateAbout)) {
    aboutPlayed = true;
    setAboutOpen(1);
    about.dataset.portalPassed = "";
    try { sessionStorage.setItem(seenKey, "1"); } catch { /* The portal remains open for this render. */ }
  } else if (about) {
    about.dataset.aboutIntroPending = "";
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
      if (section === about) {
        ScrollTrigger.create({
          trigger: section,
          pin: section.querySelector<HTMLElement>(".scenePin") ?? section,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => "+=" + innerHeight,
          onEnter: startAboutIntro,
          onEnterBack: startAboutIntro,
          // A fast scroll can cross both trigger boundaries in one frame.
          // Leaving the pin must not force the entrance timeline to its end.
          onLeave: () => { if (!intro && !introFinished) startAboutIntro(); },
          onLeaveBack: () => { if (!intro && !introFinished) startAboutIntro(); },
        });
        if (aboutPlayed) finishAboutIntro();
        continue;
      }
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
      intro?.kill();
      delete root.dataset.portalMotion;
      for (const section of sections) {
        section.style.removeProperty("--portal-open");
        section.style.removeProperty("--about-content-scale");
        delete section.dataset.portalPassed;
        delete section.dataset.aboutIntroPending;
        delete section.dataset.aboutIntroActive;
      }
      gsap.set(aboutSteps, { clearProps: "transform,opacity" });
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
