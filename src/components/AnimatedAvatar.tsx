"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/orbit.module.css";

const front = "/isaac-avatar-full.png";
const side = "/isaac-avatar-look-left.png";

export function AnimatedAvatar({ alt }: { alt: string }) {
  const rig = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = rig.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let pose = "front";

    function setPose(next: string) {
      if (pose !== next) { pose = next; element!.dataset.look = next; }
    }

    function look(event: PointerEvent) {
      if (reduced.matches || event.pointerType === "touch") return;
      const box = element!.getBoundingClientRect();
      const offset = event.clientX - box.left - box.width / 2;
      const threshold = Math.max(48, box.width * .18);
      setPose(offset < -threshold ? "left" : offset > threshold ? "right" : "front");
    }

    function reset() { setPose("front"); }
    window.addEventListener("pointermove", look, { passive: true });
    document.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", reset);
    return () => {
      window.removeEventListener("pointermove", look);
      document.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", reset);
    };
  }, []);

  const part = (className: string, src = front) =>
    <img className={className} src={src} alt="" aria-hidden="true" width={1086} height={1448} draggable={false} />;

  return <span ref={rig} className={styles.heroAvatar} role="img" aria-label={alt} data-look="front">
    {part(styles.avatarLegLeft)}
    {part(styles.avatarLegRight)}
    {part(styles.avatarArmLeft)}
    {part(styles.avatarArmRight)}
    {part(styles.avatarTorso)}
    {part(styles.avatarHeadFront)}
    {part(styles.avatarHeadSide, side)}
  </span>;
}
