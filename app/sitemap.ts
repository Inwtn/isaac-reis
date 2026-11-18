import type { MetadataRoute } from "next";
import { baseUrl, pathFor } from "@/content/locales";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs = [
    [pathFor("pt"), pathFor("en")],
    [pathFor("pt", "privacy"), pathFor("en", "privacy")],
    ...projects.map(p => [pathFor("pt", "project", p.slug), pathFor("en", "project", p.slug)]),
  ];
  return pairs.flatMap(([pt, en]) => [pt, en].map(path => ({
    url: new URL(path, baseUrl).href,
    alternates: { languages: { "pt-BR": new URL(pt, baseUrl).href, en: new URL(en, baseUrl).href } },
  })));
}
