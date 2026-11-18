import Link from "next/link";
import { notFound } from "next/navigation";
import { anchors, dictionary, otherLocale, pageMetadata, pathFor, projectSlug, type Locale } from "@/content/locales";
import { localizeProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { LanguageSwitch } from "./LanguageSwitch";
import { CaseDiagram } from "./CaseDiagram";

export const detailParams = (locale: Locale) => projects.map(p => ({slug: projectSlug(locale, p.slug)}));

function getProject(locale: Locale, slug: string) {
  const project = projects.find(p => projectSlug(locale, p.slug) === slug);
  if (!project) notFound();
  return localizeProject(project, locale);
}

export function detailMetadata(locale: Locale, slug: string) {
  const p = getProject(locale, slug);
  return pageMetadata(locale, "project", p.slug, { title: `${p.title} — ${site.name}`, description: p.summary });
}

export function DetailPage({locale, slug}: {locale: Locale; slug: string}) {
  const p = getProject(locale, slug), t = dictionary[locale], home = pathFor(locale);
  return <>
    <main id="conteudo" className="case">
      <div className="case__navigation">
        <Link className="case__back" href={`${home}#${anchors[locale].work}`}>{t.backWork}</Link>
        <LanguageSwitch locale={locale} href={pathFor(otherLocale(locale), "project", p.slug)} />
      </div>
      <h1>{p.title}</h1><p className="case__summary">{p.summary}</p>
      <dl className="case__facts">
        <div><dt>{t.kind}</dt><dd>{p.kind}</dd></div>
        <div><dt>{t.year}</dt><dd>{p.year === "[PREENCHER]" ? t.unknownYear : p.year}</dd></div>
        <div><dt>{t.roleLabel}</dt><dd>{p.role}</dd></div>
        <div><dt>{t.stack}</dt><dd>{p.stack.join(", ")}</dd></div>
      </dl>
      <section className="case__section"><h2>{t.workflow}</h2><p className="copy">{t.workflowNote}</p><CaseDiagram slug={p.slug} locale={locale} /></section>
      <section className="case__section"><h2>{t.details}</h2><ul className="case__facts-list">{p.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></section>
      <div className="case__links"><a href={p.href} target="_blank" rel="noreferrer">{t.source}</a>{p.live && <a href={p.live} target="_blank" rel="noreferrer">{t.live}</a>}</div>
    </main>
    <footer className="footer"><Link href={`${home}#contact`}>{t.contact}</Link><Link href={pathFor(locale, "privacy")}>{t.privacy}</Link></footer>
  </>;
}

export function PrivacyPage({locale}: {locale: Locale}) {
  const t = dictionary[locale];
  return <main id="conteudo" className="case">
    <div className="case__navigation"><Link className="case__back" href={pathFor(locale)}>{t.backHome}</Link><LanguageSwitch locale={locale} href={pathFor(otherLocale(locale),"privacy")} /></div>
    <h1>{t.privacy}</h1>
    <section className="case__section"><h2>{t.privacyTitle}</h2><p className="copy">{t.privacyBody}</p></section>
    <section className="case__section"><h2>{t.contact}</h2><p className="copy">{t.privacyContact} <a href={`mailto:${site.email}`}>{site.email}</a>.</p></section>
  </main>;
}

export function NotFoundPage({locale}: {locale: Locale}) {
  const t = dictionary[locale];
  return <main id="conteudo" className="not-found"><h1>{t.notFound}</h1><Link href={pathFor(locale)}>{t.backHome}</Link></main>;
}

export const privacyMetadata = (locale: Locale) => pageMetadata(locale, "privacy", "", {title: `${dictionary[locale].privacy} — ${site.name}`, description: dictionary[locale].privacyDescription});
