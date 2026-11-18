"use client";

import { useEffect, useRef } from "react";
import styles from "./orbit-world.module.css";

type Chip = { x: number; y: number; vx: number; vy: number; u: number; v: number; born: number; life: number; size: number; spark: boolean };

export function PixelCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const scene = canvas?.parentElement?.querySelector("canvas");
    if (!canvas || !ctx || !scene || scene === canvas) return;
    const enabled = matchMedia("(any-pointer: fine) and (prefers-reduced-motion: no-preference)");
    const chips: Chip[] = [];
    let width = 0, height = 0, frame = 0, lastEmit = 0, px = 0, py = 0;
    let prevX = -1, prevY = -1, halo = 0;
    const grid = 4;
    const snap = (n: number) => Math.floor(n / grid) * grid;
    const reset = () => { cancelAnimationFrame(frame); frame = 0; chips.length = 0; halo = 0; prevX = -1; ctx.clearRect(0,0,width,height); };
    const resize = () => {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
      reset();
    };
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      const sceneRatio = scene.getBoundingClientRect().width / scene.width || grid;
      if (now < halo) {
        ctx.globalAlpha = .58 * ((halo - now) / 160);
        ctx.fillStyle = "#080b12";
        ctx.fillRect(px-4, py-4, 4, 4); ctx.fillRect(px+4, py, 4, 4);
        ctx.fillStyle = "#ffe365";
        ctx.fillRect(px+4, py-8, 4, 4); ctx.fillRect(px-8, py+4, 4, 4);
      }
      for(let i = chips.length - 1; i >= 0; i--) {
        const chip = chips[i];
        const elapsed = now - chip.born;
        if(elapsed >= chip.life) { chips.splice(i,1); continue; }
        const x = snap(chip.x + chip.vx * elapsed);
        const y = snap(chip.y + chip.vy * elapsed + .00019 * elapsed * elapsed);
        ctx.globalAlpha = Math.ceil((1 - elapsed / chip.life) * 4) / 4 * .85;
        if (chip.spark) {
          ctx.fillStyle = i % 3 === 0 ? "#f3f1eb" : "#ffd735";
          ctx.fillRect(x, y, chip.size, chip.size);
        } else {
          const u = Math.min(scene.width-1, Math.max(0, Math.floor(chip.u / sceneRatio)));
          const v = Math.min(scene.height-1, Math.max(0, Math.floor(chip.v / sceneRatio)));
          ctx.drawImage(scene, u, v, 1, 1, x, y, chip.size, chip.size);
        }
      }
      ctx.globalAlpha = 1;
      if(chips.length || now < halo) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType === "touch" || document.hidden) return;
      const x = event.clientX, y = event.clientY, now = performance.now();
      if (prevX < 0) { prevX = x; prevY = y; return; }
      const dx = x - prevX, dy = y - prevY;
      if (now - lastEmit < 30 || Math.hypot(dx, dy) < 5) return;
      lastEmit = now; prevX = x; prevY = y;
      px = snap(x); py = snap(y); halo = now + 160;
      for (let n = 0; n < 5; n++) {
        if (chips.length >= 64) chips.shift();
        const u = px + snap((Math.random() - .5) * 26);
        const v = py + snap((Math.random() - .5) * 26);
        chips.push({
          x: u, y: v, u, v,
          vx: (Math.random() - .5)*.16 - Math.sign(dx)*.03,
          vy: (Math.random() - .7)*.15 - Math.sign(dy)*.025,
          born: now, life: 220 + Math.random()*270, size: n < 2 ? 4 : 8, spark: n < 2,
        });
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    enabled.addEventListener("change", reset);
    return () => {
      reset(); window.removeEventListener("resize",resize); window.removeEventListener("pointermove",move);
      window.removeEventListener("blur",reset); document.removeEventListener("visibilitychange",reset);
      enabled.removeEventListener("change",reset);
    };
  }, []);
  return <canvas ref={ref} data-pixel-cursor aria-hidden="true" className={styles.cursor} />;
}
