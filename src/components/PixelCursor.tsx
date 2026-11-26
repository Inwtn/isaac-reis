"use client";

import { useEffect, useRef } from "react";
import styles from "./orbit-world.module.css";

type Chip = { x: number; y: number; vx: number; vy: number; born: number; life: number; size: number; color: string; alpha: number };

// Width in pixels for each row of the four-point star.
const starRows = [1, 1, 3, 5, 9, 5, 3, 1, 1];

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const pixel = 2;
  ctx.fillStyle = "#080b12";
  starRows.forEach((width, row) => ctx.fillRect(x - width - 2, y + row * pixel - 11, width * pixel + 4, 6));
  ctx.shadowColor = "#ffd735"; ctx.shadowBlur = 5;
  ctx.fillStyle = "#ffe365";
  starRows.forEach((width, row) => ctx.fillRect(x - width, y + row * pixel - 9, width * pixel, pixel));
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff7cd";
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

export function PixelCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const enabled = matchMedia("(any-pointer: fine) and (prefers-reduced-motion: no-preference)");
    const root = canvas.parentElement!;
    const chips: Chip[] = [];
    let width = 0, height = 0, frame = 0, lastEmit = 0, px = 0, py = 0;
    let prevX = -1, prevY = -1, halo = 0, dotX = 0, dotY = 0;
    const grid = 4;
    const snap = (n: number) => Math.floor(n / grid) * grid;
    const reset = () => { cancelAnimationFrame(frame); frame = 0; chips.length = 0; halo = 0; prevX = -1; delete root.dataset.customPointer; ctx.clearRect(0,0,width,height); };
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
      if (now < halo) {
        ctx.globalAlpha = .28 * ((halo - now) / 160);
        ctx.fillStyle = "#ffe365";
        ctx.shadowColor = "#ffd735"; ctx.shadowBlur = 8;
        ctx.fillRect(px, py, 4, 4);
        ctx.shadowBlur = 0;
      }
      for(let i = chips.length - 1; i >= 0; i--) {
        const chip = chips[i];
        const elapsed = now - chip.born;
        if(elapsed >= chip.life) { chips.splice(i,1); continue; }
        const x = snap(chip.x + chip.vx * elapsed);
        const y = snap(chip.y + chip.vy * elapsed);
        const fade = 1 - elapsed / chip.life;
        ctx.globalAlpha = fade * chip.alpha;
        ctx.fillStyle = chip.color;
        ctx.shadowColor = chip.color; ctx.shadowBlur = chip.size > 4 ? 7 : 3;
        ctx.fillRect(x, y, chip.size, chip.size);
        ctx.shadowBlur = 0;
        if (chip.size >= 5 && fade > .45) {
          ctx.globalAlpha = fade * chip.alpha * .62;
          ctx.fillStyle = "#fff7cd";
          ctx.fillRect(x + 1, y + 1, 2, 2);
        }
      }
      ctx.globalAlpha = 1;
      if (root.dataset.customPointer) {
        drawStar(ctx, dotX, dotY);
      }
      if(chips.length || now < halo) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType === "touch" || document.hidden || !(event.target instanceof Element) || !root.contains(event.target)) { reset(); return; }
      const x = event.clientX, y = event.clientY, now = performance.now();
      root.dataset.customPointer = "true";
      dotX = Math.round(x / 2) * 2; dotY = Math.round(y / 2) * 2;
      if (!frame) frame = requestAnimationFrame(draw);
      if (prevX < 0) { prevX = x; prevY = y; return; }
      const dx = x - prevX, dy = y - prevY;
      const distance = Math.hypot(dx, dy);
      if (now - lastEmit < 12 || distance < 2) return;
      lastEmit = now; prevX = x; prevY = y;
      px = snap(x); py = snap(y); halo = now + 220;
      const steps = Math.max(1, Math.ceil(distance / 7));
      const colors = ["#ffd735", "#ffe365", "#fff7cd", "#f3ad32"];
      for (let step = 1; step <= steps; step++) {
        const progress = step / steps;
        const trailX = snap(x - dx * (1 - progress));
        const trailY = snap(y - dy * (1 - progress));
        const count = 2 + (Math.random() < .72 ? 1 : 0) + (Math.random() < .24 ? 1 : 0);
        for (let n = 0; n < count; n++) {
          if (chips.length >= 96) chips.shift();
          const spread = n === 0 ? 0 : 4 + Math.random() * 8;
          const side = Math.random() < .5 ? -1 : 1;
          const size = n === 0 ? 4 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 4);
          const speed = .025 + Math.random() * .045;
          chips.push({
            x: trailX + (n ? (Math.random() * spread * side) : 0),
            y: trailY + (n ? (Math.random() * spread * -side) : 0),
            vx: -dx / Math.max(8, distance) * speed + (Math.random() - .5) * .035,
            vy: -dy / Math.max(8, distance) * speed + (Math.random() - .5) * .035,
            born: now, life: 220 + Math.random() * 180, size,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: .62 + Math.random() * .32,
          });
        }
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", reset);
    enabled.addEventListener("change", reset);
    return () => {
      reset(); window.removeEventListener("resize",resize); window.removeEventListener("pointermove",move);
      window.removeEventListener("blur",reset); document.removeEventListener("visibilitychange",reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      enabled.removeEventListener("change",reset);
    };
  }, []);
  return <canvas ref={ref} data-pixel-cursor aria-hidden="true" className={styles.cursor} />;
}
