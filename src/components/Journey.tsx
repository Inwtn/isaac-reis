"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import styles from "@/app/orbit.module.css";
import { dictionary, type Locale } from "@/content/locales";

const signals = { trabalhos: "Trabalhos", sobre: "Sobre", contato: "Contato" };
type Sector = keyof typeof signals;
const JourneyContext = createContext<{ locale: Locale; ready: boolean; found: Sector[]; collect: (signal: Sector) => void } | null>(null);
const saveKey = "inwtn:signals-v1";

export function Journey({ children, locale }: { children: ReactNode; locale: Locale }) {
  const t = dictionary[locale];
  const [found, setFound] = useState<Sector[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(saveKey) ?? "[]");
      if (Array.isArray(saved)) setFound([...new Set(saved.filter((s): s is Sector => typeof s === "string" && Object.hasOwn(signals,s)))]);
    } catch { /* Progress still works in memory. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(saveKey, JSON.stringify(found)); } catch { /* Storage may be unavailable. */ }
  }, [found, ready]);
  return <JourneyContext.Provider value={{ locale, ready, found, collect: signal => setFound(current => current.includes(signal) ? current : [...current, signal]) }}>
    {ready && <span className={styles.srOnly} role="status">{found.length === 3 ? t.complete : t.signals} {found.length}/3</span>}
    {children}
  </JourneyContext.Provider>;
}

export function Signal({ sector }: { sector: Sector }) {
  const journey = useContext(JourneyContext);
  if (!journey?.ready) return null;
  const t = dictionary[journey.locale];
  const sectorLabel = sector === "trabalhos" ? t.projects : sector === "sobre" ? t.about : t.contact;
  const collected = journey.found.includes(sector);
  return <button type="button" data-signal={sector} aria-pressed={collected} className={styles.collect} title={collected ? t.collected : t.collect} onClick={() => journey.collect(sector)}>
    <i aria-hidden="true" /><span className={styles.srOnly}>{t.signal} · {sectorLabel}</span>
  </button>;
}
