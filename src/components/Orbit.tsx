"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./orbit-world.module.css";

import { drawWorld } from "./pixel-world";
import { drawProject } from "./project-world";
import { drawPixelPassage } from "./pixel-passage";
import { attachPortfolioMotion } from "./portfolio-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import transitionStyles from "@/app/orbit.module.css";

const projectColors: Record<string, string> = {
  mneme: "#66ead2",
  "reconciliacao-bancaria": "#ffcc56",
  "finance-sync-api": "#7befaa",
  streamhub: "#bbc3ff",
  "lupa-net": "#eca6f9",
};

export function Orbit({project, returnTo}: {project?: string; returnTo?: string} = {}) {
  const layer = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  useEffect(() => {
    const canvas = layer.current, root = canvas?.closest<HTMLElement>("[data-orbit-root]");
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx || !root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-orbit-scene]"));
    const links = root.querySelectorAll<HTMLElement>("[data-orbit-link]");
    const seam = root.querySelector<HTMLElement>("[data-orbit-seam]");
    let width = 0, height = 0, start = 0, period = 1, raf = 0, active = "", lastY = window.scrollY;
    let positions: number[] = [];
    let portfolioMotion: ReturnType<typeof attachPortfolioMotion> | undefined;
    let target = 0, displayed = 0, time = 0, lastFrame = 0, leaving = false;
    const returnToPortfolio = () => {
      if (!returnTo || leaving) return;
      leaving = true;
      const overlay = document.createElement("div");
      overlay.className = transitionStyles.projectFlight;
      overlay.dataset.projectFlightOverlay = "";
      overlay.setAttribute("aria-hidden", "true");
      let saved: { x: number; y: number; width: number; height: number; title: string; imageUrl?: string; accent: string; ground: string } | undefined;
      try { saved = JSON.parse(sessionStorage.getItem("project-portal-return") ?? "null") ?? undefined; } catch { /* Use a centered fallback if the saved card is unavailable. */ }
      const accent = saved?.accent ?? projectColors[project ?? ""] ?? "#ffd735";
      const ground = saved?.ground ?? "#080b12";
      const columns = Math.ceil(innerWidth / 40), rows = Math.ceil(innerHeight / 40);
      overlay.style.setProperty("--flight-ink", accent);
      overlay.style.setProperty("--flight-columns", String(columns));
      overlay.style.setProperty("--flight-rows", String(rows));
      const frame = document.createElement("div");
      frame.className = transitionStyles.projectFlightFrame;
      frame.style.setProperty("--flight-ink", accent);
      frame.style.setProperty("--flight-ground", ground);
      if (saved?.imageUrl) {
        const image = document.createElement("img");
        image.className = transitionStyles.projectFlightArt;
        image.src = saved.imageUrl;
        image.alt = "";
        frame.append(image);
      }
      const label = document.createElement("span");
      label.className = transitionStyles.projectFlightLabel;
      label.textContent = saved?.title ?? "Project";
      frame.append(label);
      const tiles = document.createElement("span");
      tiles.className = transitionStyles.projectFlightTiles;
      for (let index = 0; index < columns * rows; index++) tiles.append(document.createElement("i"));
      overlay.append(frame, tiles);
      document.body.append(overlay);
      const target = saved ? {
        x: saved.x * innerWidth,
        y: saved.y * innerHeight,
        width: saved.width * innerWidth,
        height: saved.height * innerHeight,
      } : { x: innerWidth * .34, y: innerHeight * .28, width: innerWidth * .32, height: innerHeight * .44 };
      gsap.set(frame, { x: 0, y: 0, width: innerWidth, height: innerHeight, borderRadius: 0 });
      document.documentElement.setAttribute("data-project-flight", "");
      gsap.timeline({ onComplete: () => {
        try { sessionStorage.removeItem("project-portal-return"); } catch { /* The landing page clears the remaining return state. */ }
        router.replace(returnTo, { scroll: false });
      }})
        .to(frame, { ...target, borderRadius: 7, duration: .82, ease: "power3.inOut" }, 0)
        .fromTo(tiles.children, { opacity: 0, scale: 0 }, { opacity: .92, scale: 1, stagger: { each: .0004, from: "random" }, duration: .2, ease: "steps(4)" }, .04);
    };
    const scroll = () => {
      let y = window.scrollY;
      if (!reduced.matches && seam && y > lastY && y >= start + period - 1 && period > 1 &&
          !root.querySelector("main :focus-visible")) {
        if (returnTo) {
          returnToPortfolio();
          return;
        }
        const overshoot = Math.max(0, y - start - period);
        y = start + overshoot;
        if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
        if (portfolioMotion) portfolioMotion.jumpTo(y);
        else window.scrollTo({top: y, behavior: "instant"});
        displayed = displayed > .5 ? displayed - 1 : 0;
      }
      lastY = y;
      const relative = y - start;
      target = Math.max(0, relative / period);
      root.style.setProperty("--orbit-progress", String(Math.min(target, 1)));
      let current = 0;
      for (let i = 1; i < positions.length; i++) if (relative >= positions[i] - Math.min(height * .38, 320)) current = i;
      const name = scenes[current]?.dataset.orbitScene || "inicio";
      if (active !== name) {
        active = name;
        root.dataset.orbitCurrent = name;
        links.forEach(link => link.dataset.orbitLink === name ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current"));
      }
      if (reduced.matches) draw(ctx, 0);
    };

    function draw(g: CanvasRenderingContext2D, progress: number) {
      if (!width || !height) return;
      if (project) drawProject(g, canvas!.width, canvas!.height, project, progress, time);
      else {
        const distance = progress * period;
        const next = positions.findIndex((top, index) => index > 0 && distance < top);
        let district = next < 0 ? positions.length - 1 : next - 1;
        if (next > 0) {
          const approach = Math.max(0, 1 - (positions[next] - distance) / (height * .56));
          district += approach * approach * (3 - 2 * approach);
        }
        const end = Math.max(0, Math.min(1, (distance - period + height * .44) / (height * .44)));
        const mobile = width <= 760;
        drawWorld(g, canvas!.width, canvas!.height, progress, time, mobile, district * (1 - end));
        if (next > 0 && !reduced.matches) {
          const distanceToSection = (positions[next] - distance) / height;
          const phase = (.85 - distanceToSection) / .70;
          drawPixelPassage(g, canvas!.width, canvas!.height, phase, next, mobile);
        }
      }
    }
    const tick = (now: number) => {
      raf = 0;
      if (reduced.matches || document.hidden) return;
      const elapsed = lastFrame ? now - lastFrame : 16;
      if (elapsed >= (Math.abs(target - displayed) > .0005 ? 32 : 105) || !lastFrame) {
        time += Math.min(elapsed, 60);
        const delta = target - displayed;
        displayed = Math.abs(delta) > .45 ? target : displayed + delta * .22;
        draw(ctx, displayed); lastFrame = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(raf); raf = 0; lastFrame = 0;
      if (!reduced.matches && !document.hidden) raf = requestAnimationFrame(tick);
      else draw(ctx, 0);
    };
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const pixel = width <= 760 ? 3 : 4;
      canvas.width = Math.max(1, Math.ceil(width / pixel));
      canvas.height = Math.max(1, Math.ceil(height / pixel));
      canvas.style.width = `${canvas.width * pixel}px`;
      canvas.style.height = `${canvas.height * pixel}px`;
      ctx.imageSmoothingEnabled = false;
      start = root.getBoundingClientRect().top + window.scrollY;
      const end = returnTo ? root.offsetHeight - height : seam?.getBoundingClientRect().top ?? 0;
      period = Math.max(1, returnTo || !seam?.offsetHeight ? root.offsetHeight - height : end + window.scrollY - start);
      positions = scenes.map(scene => scene.getBoundingClientRect().top + window.scrollY - start);
      scroll(); draw(ctx, reduced.matches ? 0 : target);
    };
    root.dataset.orbitReady = "";
    const observer = new ResizeObserver(resize);
    observer.observe(root); observer.observe(canvas.parentElement!);
    const change = () => { resize(); resume(); };
    change();
    if (!project) portfolioMotion = attachPortfolioMotion(root);
    if (!project) {
      let savedY: string | null = null;
      try { savedY = sessionStorage.getItem("portfolio-return-y"); } catch { /* Normal scrolling remains available without storage. */ }
      if (savedY !== null) {
        try { sessionStorage.removeItem("portfolio-return-y"); } catch { /* The saved position is still restored once. */ }
        const overlay = document.querySelector<HTMLElement>("[data-project-flight-overlay]");
        const frame = overlay?.firstElementChild;
        const tiles = overlay?.lastElementChild?.children;
        document.documentElement.removeAttribute("data-project-flight");
        requestAnimationFrame(() => requestAnimationFrame(() => {
          portfolioMotion?.jumpTo(Number(savedY));
          ScrollTrigger.refresh();
          if (overlay && frame && tiles) {
            gsap.timeline({ onComplete: () => overlay.remove() })
              .to(frame, { opacity: 0, duration: .12, ease: "power1.out" }, 0)
              .to(tiles, { opacity: 0, scale: 0, stagger: { each: .00025, from: "random" }, duration: .16, ease: "steps(4)" }, 0);
          } else overlay?.remove();
        }));
      }
    }
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", change);
    return () => {
      portfolioMotion?.dispose();
      delete root.dataset.orbitReady;
      observer.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", change);
    };
  }, [project, returnTo]);
  return <div className={styles.world} aria-hidden="true"><canvas ref={layer} className={styles.canvas} /></div>;
}
