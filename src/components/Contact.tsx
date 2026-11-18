"use client";
import { useState } from "react";
import { site } from "@/content/site";
import { dictionary, type Locale } from "@/content/locales";

export function Contact({locale}: {locale: Locale}) {
  const t = dictionary[locale];
  const [status,setStatus]=useState("");
  const copy=async()=>{try{await navigator.clipboard.writeText(site.email);setStatus(t.copied);}catch{setStatus(t.copyError);}};
  return <div className="contact-details">
    <a className="contact__email" href={`mailto:${site.email}`}>{site.email}</a>
    <div className="contact__actions"><button type="button" onClick={copy}>{t.copy}</button><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={site.github} target="_blank" rel="noreferrer">GitHub</a></div>
    <p className="contact__status" role="status" aria-live="polite">{status}</p>
  </div>;
}
