"use client";

import { anchors, dictionary, htmlLang, otherLocale, type Locale } from "@/content/locales";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export function LanguageSwitch({ locale, href, preserveSection = false }: { locale: Locale; href: string; preserveSection?: boolean }) {
  const other = otherLocale(locale);
  const [travel, setTravel] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function switchLanguage(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const section = document.querySelector<HTMLElement>("[data-orbit-root]")?.dataset.orbitCurrent ?? location.hash.slice(1);
    const key = (Object.keys(anchors[locale]) as (keyof typeof anchors.pt)[]).find(k => anchors[locale][k] === section);
    event.preventDefault();
    if (timer.current) return;
    const destination = preserveSection && key && key !== "home" ? `${href}#${anchors[other][key]}` : href;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { location.assign(destination); return; }
    setTravel(true);
    timer.current = setTimeout(() => location.assign(destination), 520);
  }
  return <span className="language-track" data-travel={travel || undefined}>
    <span className="language-current" aria-hidden="true">{locale.toUpperCase()}</span>
    <span className="language-pellets" aria-hidden="true"><i /><i /><i /></span>
    <span className="language-munch" aria-hidden="true" />
    <a className="language-switch" href={href} hrefLang={htmlLang[other]} lang={htmlLang[other]} aria-label={dictionary[locale].language} onClick={switchLanguage}>{other.toUpperCase()}</a>
  </span>;
}
