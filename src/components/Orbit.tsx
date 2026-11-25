"use client";

import { useEffect, useRef } from "react";
import styles from "./orbit-world.module.css";

import { drawWorld } from "./pixel-world";
import { drawProject } from "./project-world";
import { drawSceneGate } from "./scene-gate";

export function Orbit({project, returnTo}: {project?: string; returnTo?: string} = {}) {
  const layer = useRef<HTMLCanvasElement>(null);
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
    let entering = -1;
    let entry = 0;
    let target = 0, displayed = 0, time = 0, lastFrame = 0, leaving = false;
    const scroll = () => {
      let y = window.scrollY;
      if (!reduced.matches && seam && y > lastY && y >= start + period - 1 && period > 1 &&
          !root.querySelector("main :focus-visible")) {
        if (returnTo) {
          if (!leaving) { leaving = true; location.replace(returnTo); }
          return;
        }
        const overshoot = Math.max(0, y - start - period);
        y = start + overshoot;
        if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
        window.scrollTo({top: y, behavior: "instant"});
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
      const entryStart = height * .92;
      const entryEnd = height * .20;
      const gate = reduced.matches ? -1 : positions.findIndex((top, index) =>
        scenes[index].hasAttribute("data-scene-gate") && top - relative < entryStart && top - relative > entryEnd
      );
      if (gate !== entering && entering >= 0) {
        delete scenes[entering].dataset.entering;
        scenes[entering].style.removeProperty("--scene-enter");
      }
      entering = gate;
      if (gate >= 0) {
        entry = (entryStart - (positions[gate] - relative)) / (entryStart - entryEnd);
        const settle = Math.min(1, Math.max(0, (entry - .12) / .72));
        scenes[gate].dataset.entering = "";
        scenes[gate].style.setProperty("--scene-enter", String(settle * settle * (3 - 2 * settle)));
      }
      if (reduced.matches) draw(ctx, 0);
    };

    function draw(g: CanvasRenderingContext2D, progress: number) {
      if (!width || !height) return;
      if (project) drawProject(g, canvas!.width, canvas!.height, project, progress, time);
      else {
        drawWorld(g, canvas!.width, canvas!.height, progress, time, width <= 760);
        if (entering >= 0) drawSceneGate(g, canvas!.width, canvas!.height, entering - 1, entry);
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
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", change);
    return () => {
      delete root.dataset.orbitReady;
      if (entering >= 0) {
        delete scenes[entering].dataset.entering;
        scenes[entering].style.removeProperty("--scene-enter");
      }
      observer.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", change);
    };
  }, [project, returnTo]);
  return <div className={styles.world} aria-hidden="true"><canvas ref={layer} className={styles.canvas} /></div>;
}
