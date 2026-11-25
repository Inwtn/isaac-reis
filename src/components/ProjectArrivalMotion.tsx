"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export function ProjectArrivalMotion() {
  useLayoutEffect(() => {
    const intro = document.querySelector<HTMLElement>("[data-project-intro]");
    if (!intro) return;
    const flight = document.querySelector<HTMLElement>("[data-project-flight-overlay]");
    document.documentElement.removeAttribute("data-project-flight");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { flight?.remove(); return; }
    const timeline = gsap.timeline({ onComplete: () => flight?.remove() });
    timeline.fromTo(intro,
      { clipPath: "inset(34% 38% round 32px)", filter: "brightness(.62)", scale: .985 },
      { clipPath: "inset(0% 0% round 0px)", filter: "brightness(1)", scale: 1, duration: .84, ease: "power3.inOut", clearProps: "clipPath,filter,scale" }, 0,
    );
    if (flight) timeline.to(flight, { opacity: 0, duration: .24, ease: "power2.out" }, .12);
    return () => { timeline.kill(); gsap.set(intro, { clearProps: "clipPath,filter,scale" }); };
  }, []);
  return null;
}
