"use client";

import { useEffect, useRef, type Ref } from "react";
import styles from "@/app/orbit.module.css";

const image = "/isaac-avatar-full.png";

export function AnimatedAvatar({ alt }: { alt: string }) {
  const rig = useRef<HTMLSpanElement>(null);
  const head = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = rig.current;
    const face = head.current;
    if (!element || !face) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    function look(event: PointerEvent) {
      if (event.pointerType === "touch" || reduced.matches) return;
      const box = element!.getBoundingClientRect();
      targetX = clamp((event.clientX - box.left - box.width / 2) / (innerWidth * .42)) * 6;
      targetY = clamp((event.clientY - box.top - box.height * .28) / (innerHeight * .45)) * 4;
    }
    function resetLook() { targetX = 0; targetY = 0; }

    function tick(time: number) {
      if (!visible || reduced.matches || document.hidden) { frame = 0; return; }
      x += (targetX - x) * .13;
      y += (targetY - y) * .13;
      const bob = Math.sin(time / 450) * 1.2;
      face!.style.transform = `translate(${x.toFixed(2)}px, ${(y + bob).toFixed(2)}px) rotate(${(x * .32).toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    }

    function resume() {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        face!.style.transform = "";
      } else if (visible && !frame && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; }
      else resume();
    });
    observer.observe(element);
    window.addEventListener("pointermove", look, { passive: true });
    document.addEventListener("pointerleave", resetLook);
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", look);
      document.removeEventListener("pointerleave", resetLook);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
    };
  }, []);

  const part = (className: string, ref?: Ref<HTMLImageElement>) =>
    <img ref={ref} className={className} src={image} alt="" aria-hidden="true" width={1086} height={1448} draggable={false} />;

  return <span ref={rig} className={styles.heroAvatar} role="img" aria-label={alt}>
    {part(styles.avatarLegLeft)}
    {part(styles.avatarLegRight)}
    {part(styles.avatarArmLeft)}
    {part(styles.avatarArmRight)}
    {part(styles.avatarTorso)}
    {part(styles.avatarHead, head)}
  </span>;
}
