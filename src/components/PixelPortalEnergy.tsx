"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 16;

export function PixelPortalEnergy() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest<HTMLElement>('[data-scene-entry="about"]');
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return;

    const sprite = new Image();
    sprite.src = "/portal-blue-sprite-4x4.png";
    let width = 1;
    let height = 1;
    let rotation = 0;
    let animation = 0;
    let visible = false;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    const draw = () => {
      if (!sprite.complete || !sprite.naturalWidth) return;
      const progress = Math.max(0, Math.min(1, Number(section.style.getPropertyValue("--portal-open")) || 0));
      const eased = progress;
      const frame = Math.min(FRAME_COUNT - 1, Math.floor(eased * FRAME_COUNT));
      const column = frame % 4;
      const row = Math.floor(frame / 4);
      const box = Math.min(width, height);
      // Keep the sprite inside the same viewport-sized circle as the content.
      const side = box * eased * 1.3;
      const sourceFrame = sprite.naturalWidth / 4;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.globalAlpha = .38 + eased * .62;
      context.translate(width / 2, height / 2);
      if (!reducedMotion.matches) context.rotate(Math.sin(rotation) * .018);
      context.drawImage(
        sprite,
        column * sourceFrame,
        row * sourceFrame,
        sourceFrame,
        sourceFrame,
        -side / 2,
        -side / 2,
        side,
        side,
      );
      context.restore();
    };

    const tick = () => {
      animation = 0;
      if (!visible || document.hidden) return;
      if (!reducedMotion.matches) rotation += .016;
      draw();
      animation = requestAnimationFrame(tick);
    };
    const start = () => {
      if (visible && !document.hidden && !animation) animation = requestAnimationFrame(tick);
    };
    const resize = () => {
      const box = canvas.parentElement!.getBoundingClientRect();
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      canvas.width = Math.max(1, Math.ceil(width));
      canvas.height = Math.max(1, Math.ceil(height));
      context.imageSmoothingEnabled = false;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      draw();
    };

    sprite.onload = () => { draw(); start(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(animation); animation = 0; }
    }, { rootMargin: "100px" });
    const layout = new ResizeObserver(resize);
    observer.observe(section);
    layout.observe(canvas.parentElement!);
    const onMotionPreference = () => draw();
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(animation); animation = 0; }
      else start();
    };
    reducedMotion.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    return () => {
      observer.disconnect();
      layout.disconnect();
      reducedMotion.removeEventListener("change", onMotionPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(animation);
    };
  }, []);

  return <canvas ref={ref} className="portal-energy" aria-hidden="true" />;
}
