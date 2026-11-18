"use client";

import { useEffect, useRef } from "react";
import styles from "./orbit-world.module.css";

type Chip = { x: number; y: number; vx: number; vy: number; born: number; life: number; size: number };

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
        ctx.globalAlpha = (1 - elapsed / chip.life) * .52;
        ctx.fillStyle = "#ffd735";
        ctx.shadowColor = "#ffd735"; ctx.shadowBlur = 7;
        ctx.fillRect(x, y, chip.size, chip.size);
        ctx.shadowBlur = 0;
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
      if (now - lastEmit < 25 || Math.hypot(dx, dy) < 4) return;
      lastEmit = now; prevX = x; prevY = y;
      px = snap(x); py = snap(y); halo = now + 160;
      for (let n = 0; n < 2; n++) {
        if (chips.length >= 20) chips.shift();
        chips.push({
          x: px - Math.sign(dx) * n * 4, y: py - Math.sign(dy) * n * 4,
          vx: -dx / Math.max(8, Math.hypot(dx, dy)) * .055,
          vy: -dy / Math.max(8, Math.hypot(dx, dy)) * .055,
          born: now, life: 150 + Math.random() * 60, size: 4,
        });
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
