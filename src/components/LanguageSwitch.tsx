"use client";

import { anchors, dictionary, htmlLang, otherLocale, type Locale } from "@/content/locales";
import type { MouseEvent } from "react";

export function LanguageSwitch({ locale, href, preserveSection = false }: { locale: Locale; href: string; preserveSection?: boolean }) {
  const other = otherLocale(locale);
  function switchLanguage(event: MouseEvent<HTMLAnchorElement>) {
    if (!preserveSection || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const section = document.querySelector<HTMLElement>("[data-orbit-root]")?.dataset.orbitCurrent ?? location.hash.slice(1);
    const key = (Object.keys(anchors[locale]) as (keyof typeof anchors.pt)[]).find(k => anchors[locale][k] === section);
    if (!key || key === "home") return;
    event.preventDefault();
    location.assign(`${href}#${anchors[other][key]}`);
  }
  return <a className="language-switch" href={href} hrefLang={htmlLang[other]} lang={htmlLang[other]} aria-label={dictionary[locale].language} onClick={switchLanguage}>{other.toUpperCase()}</a>;
}
