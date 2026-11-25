"use client";

import type { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "@/app/orbit.module.css";

type Props = { slug: string; href: string; title: string; featured: boolean; children: ReactNode };

export function ProjectLink({ slug, href, title, featured, children }: Props) {
  const router = useRouter();

  function enterProject(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.hasAttribute("data-project-flight")) { event.preventDefault(); return; }
    event.preventDefault();
    document.documentElement.setAttribute("data-project-flight", "");

    const link = event.currentTarget;
    const rect = link.getBoundingClientRect();
    const art = link.querySelector<HTMLCanvasElement>("[data-project-art]");
    let imageUrl: string | undefined;
    try { imageUrl = art?.toDataURL(); } catch { /* The animated transition still works without its thumbnail. */ }
    const colors = getComputedStyle(link);
    const accent = colors.getPropertyValue("--tile-ink").trim() || "#ffcc56";
    const ground = colors.getPropertyValue("--tile-ground").trim() || "#080b12";
    const columns = Math.ceil(innerWidth / 40), rows = Math.ceil(innerHeight / 40);
    const position = { x: rect.left / innerWidth, y: rect.top / innerHeight, width: rect.width / innerWidth, height: rect.height / innerHeight };
    try {
      sessionStorage.setItem("portfolio-return-y", String(window.scrollY));
      sessionStorage.setItem("project-portal-return", JSON.stringify({ ...position, title, imageUrl, accent, ground }));
    } catch { /* Navigation still works when this browser blocks session storage. */ }

    const flight = document.createElement("div");
    flight.className = styles.projectFlight;
    flight.dataset.projectFlightOverlay = "";
    flight.setAttribute("aria-hidden", "true");
    const frame = document.createElement("div");
    frame.className = styles.projectFlightFrame;
    frame.style.setProperty("--flight-ink", accent);
    frame.style.setProperty("--flight-ground", ground);
    if (imageUrl) {
      const image = document.createElement("img");
      image.className = styles.projectFlightArt;
      image.src = imageUrl;
      image.alt = "";
      frame.append(image);
    }
    const label = document.createElement("span");
    label.className = styles.projectFlightLabel;
    label.textContent = title;
    frame.append(label);
    const tiles = document.createElement("span");
    tiles.className = styles.projectFlightTiles;
    tiles.style.setProperty("--flight-ink", accent);
    tiles.style.setProperty("--flight-columns", String(columns));
    tiles.style.setProperty("--flight-rows", String(rows));
    for (let i = 0; i < columns * rows; i++) {
      const tile = document.createElement("i");
      tiles.append(tile);
    }
    flight.append(frame, tiles);
    document.body.append(flight);

    gsap.set(frame, { x: rect.left, y: rect.top, width: rect.width, height: rect.height, borderRadius: 7 });
    const timeline = gsap.timeline({ onComplete: () => {
      router.push(href);
      window.setTimeout(() => {
        flight.remove();
        document.documentElement.removeAttribute("data-project-flight");
      }, 1500);
    }});
    timeline.to(tiles.children, { opacity: 0, scale: 0, stagger: { each: .0004, from: "random" }, duration: .2, ease: "steps(4)" }, 0)
      .to(frame, { x: 0, y: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: .82, ease: "power3.inOut" }, 0)
      .to(frame, { filter: "brightness(1.18)", duration: .42, ease: "power2.out" }, .22);
  }

  return <Link className={styles.projectTile} data-featured={featured || undefined} data-project={slug} href={href} onClick={enterProject}>{children}</Link>;
}
