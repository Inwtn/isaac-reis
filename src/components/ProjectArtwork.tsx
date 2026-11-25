"use client";

import { useEffect, useRef } from "react";
import { drawProject } from "./project-world";
import styles from "@/app/orbit.module.css";

export function ProjectArtwork({ slug }: { slug: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d", { alpha: false });
    const tile = element?.closest("a");
    if (!element || !context || !tile) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastPaint = 0;

    const paint = (time: number) => drawProject(context, element.width, element.height, slug, 0, time, "artwork");

    const resize = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      element.width = Math.max(1, Math.ceil(width / 3));
      element.height = Math.max(1, Math.ceil(height / 3));
      paint(0);
    };
    const tick = (time: number) => {
      if (time - lastPaint > 100) {
        paint(time);
        lastPaint = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      if (!motion.matches && tile.matches(":hover, :focus-visible")) {
        frame = requestAnimationFrame(tick);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    tile.addEventListener("pointerenter", update);
    tile.addEventListener("pointerleave", update);
    tile.addEventListener("focus", update);
    tile.addEventListener("blur", update);
    motion.addEventListener("change", update);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      tile.removeEventListener("pointerenter", update);
      tile.removeEventListener("pointerleave", update);
      tile.removeEventListener("focus", update);
      tile.removeEventListener("blur", update);
      motion.removeEventListener("change", update);
    };
  }, [slug]);

  return <canvas data-project-art ref={canvas} className={styles.projectArt} aria-hidden="true" />;
}
