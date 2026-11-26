"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "@/app/orbit.module.css";

export function PixelMenu({label, children}: {label: string; children: ReactNode}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  useEffect(() => {
    const closeWhenScrolling = () => { if (menu.current?.open) menu.current.open = false; };
    window.addEventListener("scroll", closeWhenScrolling, { passive: true });
    return () => window.removeEventListener("scroll", closeWhenScrolling);
  }, []);
  return <details ref={menu} className={styles.pixelMenu} onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) {
      menu.current.open = false;
      trigger.current?.focus();
    }
  }}>
    <summary ref={trigger} aria-label={label}><i /><i /><i /></summary>
    <button type="button" className={styles.menuBackdrop} aria-label={label} tabIndex={-1} onClick={() => { if (menu.current) menu.current.open = false; trigger.current?.focus(); }} />
    <div className={styles.menuPanel} onClick={event => {
      if (event.target instanceof Element && event.target.closest("a[data-orbit-link]") && menu.current) menu.current.open = false;
    }}>{children}</div>
  </details>;
}
