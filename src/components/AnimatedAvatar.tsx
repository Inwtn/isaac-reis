"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/orbit.module.css";

const front = "/isaac-avatar-full.png";
const headPoses = [
  ["left", "/isaac-avatar-look-left.png"],
  ["up", "/isaac-avatar-look-up.png"],
  ["down", "/isaac-avatar-look-down.png"],
  ["up-left", "/isaac-avatar-look-up-left.png"],
  ["down-left", "/isaac-avatar-look-down-left.png"],
] as const;
type Pose = "front" | "left" | "right" | "up" | "down" | "up-left" | "up-right" | "down-left" | "down-right";

export function AnimatedAvatar({ alt }: { alt: string }) {
  const rig = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = rig.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let pose: Pose = "front";

    function setPose(next: Pose) {
      if (pose !== next) { pose = next; element!.dataset.look = next; }
    }

    function look(event: PointerEvent) {
      if (reduced.matches || event.pointerType === "touch") return;
      const box = element!.getBoundingClientRect();
      const dx = event.clientX - box.left - box.width / 2;
      const dy = event.clientY - box.top - box.height * .22;
      const horizontal = dx < -Math.max(48, box.width * .18) ? "left" : dx > Math.max(48, box.width * .18) ? "right" : "";
      const vertical = dy < -Math.max(36, box.height * .12) ? "up" : dy > Math.max(36, box.height * .12) ? "down" : "";
      setPose((vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal || "front") as Pose);
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

  const part = (className: string, src = front, pose?: string) =>
    <img className={className} src={src} data-pose={pose} alt="" aria-hidden="true" width={1086} height={1448} draggable={false} />;

  return <span ref={rig} className={styles.heroAvatar} role="img" aria-label={alt} data-look="front">
    {part(styles.avatarLegLeft)}
    {part(styles.avatarLegRight)}
    {part(styles.avatarArmLeft)}
    {part(styles.avatarArmRight)}
    {part(styles.avatarTorso)}
    {part(styles.avatarHeadFront)}
    {headPoses.map(([pose, src]) => <img key={pose} className={styles.avatarHeadPose} src={src} data-pose={pose} alt="" aria-hidden="true" width={1086} height={1448} draggable={false} />)}
  </span>;
}
