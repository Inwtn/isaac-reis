import Link from "next/link";
import { notFound } from "next/navigation";
import { anchors, dictionary, otherLocale, pageMetadata, pathFor, projectSlug, type Locale } from "@/content/locales";
import { localizeProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { LanguageSwitch } from "./LanguageSwitch";
import { CaseDiagram } from "./CaseDiagram";
import { Orbit } from "./Orbit";
import { PixelCursor } from "./PixelCursor";
import { PixelMenu } from "./PixelMenu";
import { ProjectArrivalMotion } from "./ProjectArrivalMotion";
import styles from "@/app/orbit.module.css";

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
  const work = `${home}#${anchors[locale].work}`;
  return <div className={`${styles.orbit} ${styles.caseOrbit}`} data-orbit-root>
    <ProjectArrivalMotion />
    <Orbit project={p.slug} returnTo={work} />
    <PixelCursor />
    <header className={styles.header}>
      <Link className={styles.brand} href={work}><span aria-hidden="true">✳</span> INWTN</Link>
      <div className={styles.headerControls}><LanguageSwitch locale={locale} href={pathFor(otherLocale(locale), "project", p.slug)} /><PixelMenu label={t.navigation}>
        <nav className={styles.nav} aria-label={t.navigation}><Link href={work}>{t.backWork}</Link><Link href={`${home}#contact`}>{t.contact}</Link></nav>
      </PixelMenu></div>
    </header>
    <main id="conteudo" className={styles.main}>
      <section className={styles.caseArrival} data-orbit-scene="project" data-project-intro><h1>{p.title}</h1><p>{p.summary}</p><a href="#workflow">{t.explore} ↓</a></section>
      <div className={styles.caseBody}>
      <dl className="case__facts">
        <div><dt>{t.kind}</dt><dd>{p.kind}</dd></div>
        <div><dt>{t.year}</dt><dd>{p.year === "[PREENCHER]" ? t.unknownYear : p.year}</dd></div>
        <div><dt>{t.roleLabel}</dt><dd>{p.role}</dd></div>
        <div><dt>{t.stack}</dt><dd>{p.stack.join(", ")}</dd></div>
      </dl>
      <section className="case__section" id="workflow"><h2>{t.workflow}</h2><CaseDiagram slug={p.slug} locale={locale} /></section>
      <section className="case__section"><h2>{t.details}</h2><ul className="case__facts-list">{p.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></section>
      <div className="case__links"><a href={p.href} target="_blank" rel="noreferrer">{t.source}</a>{p.live && <a href={p.live} target="_blank" rel="noreferrer">{t.live}</a>}</div>
      <footer className={styles.caseEnd}><Link href={work}>{t.backWork} ↻</Link>
        <p className={styles.returnCue}>{locale === "pt" ? "Continue rolando para voltar ao portfólio." : "Keep scrolling to return to the portfolio."}</p>
      </footer>
      </div>
      <div className={styles.caseSeam} data-orbit-seam="" aria-hidden="true" />
    </main>
    <div className={styles.progress} aria-hidden="true" />
  </div>;
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
