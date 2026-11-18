import Link from "next/link";
import { site } from "@/content/site";
import { projects, localizeProject } from "@/content/projects";
import { anchors, dictionary, otherLocale, pathFor, type Locale } from "@/content/locales";
import { LanguageSwitch } from "./LanguageSwitch";
import { PixelMenu } from "./PixelMenu";
import { Orbit } from "@/src/components/Orbit";
import { Contact } from "@/src/components/Contact";
import { Journey, Signal } from "@/src/components/Journey";
import { PixelCursor } from "@/src/components/PixelCursor";
import styles from "@/app/orbit.module.css";

function Arrival({ locale, echo = false }: { locale: Locale; echo?: boolean }) {
  const t = dictionary[locale], a = anchors[locale];
  return <section className={styles.arrival} id={echo ? undefined : a.home} data-orbit-scene={!echo ? a.home : undefined} data-orbit-seam={echo ? "" : undefined} aria-hidden={echo || undefined}>
    <div className={styles.arrivalCopy}>
      <span className={styles.heroAvatar} aria-hidden="true" />
      {echo ? <p className={styles.name}>Isaac Almeida<span>.</span></p> : <h1 className={styles.name}>Isaac Almeida<span>.</span></h1>}
      <p className={styles.kicker}>{t.role}</p>
    </div>
    {echo ? <span className={styles.scrollCue}>{t.explore} <span>↓</span></span> : <a className={styles.scrollCue} href={`#${a.work}`}>{t.explore} <span aria-hidden="true">↓</span></a>}
  </section>;
}

export function Portfolio({locale}: {locale: Locale}) {
  const t = dictionary[locale], a = anchors[locale];
  const markers = [[a.work,t.projects],[a.about,t.about],[a.contact,t.contact]];
  return <div className={styles.orbit} data-orbit-root>
    <Orbit />
    <PixelCursor />
    <Journey locale={locale}>
    <header className={styles.header}>
      <a href={`#${a.home}`} className={styles.brand} aria-label={`Isaac Almeida, ${t.home}`}><span aria-hidden="true">✳</span> INWTN</a>
      <PixelMenu label={t.navigation}><nav className={styles.nav} aria-label={t.navigation}>
        {markers.map(([id, label]) => <a key={id} href={`#${id}`} data-orbit-link={id}>{label}</a>)}
      </nav>
      <div className={styles.headerActions}><a className={styles.github} href={site.github}>GitHub <span aria-hidden="true">↗</span></a><LanguageSwitch locale={locale} href={pathFor(otherLocale(locale))} preserveSection /></div></PixelMenu>
    </header>
    <main id="conteudo" className={styles.main}>
      <Arrival locale={locale} />
      <section id={a.work} data-orbit-scene={a.work} className={styles.panel} aria-labelledby="work-title">
        <div className={styles.sectionSignal}><Signal sector="trabalhos" /></div>
        <h2 id="work-title">{t.projects}<span>.</span></h2>
        <div className={styles.projectList}>
          {projects.map(project => localizeProject(project, locale)).map(project => <Link key={project.slug} className={styles.project} href={pathFor(locale,"project",project.slug)}>
            <strong className={styles.projectTitle}>{project.title}</strong>
            <span className={styles.projectKind}>{project.kind}</span>
          </Link>)}
        </div>
      </section>
      <section id={a.about} data-orbit-scene={a.about} className={`${styles.panel} ${styles.about}`} aria-labelledby="about-title">
        <div className={styles.sectionSignal}><Signal sector="sobre" /></div>
        <h2 id="about-title">{locale === "pt" ? "O que eu construo" : "What I build"}<span>.</span></h2>
        <p className={styles.aboutText}>{locale === "pt" ? "Sistemas internos, APIs, integrações e automações com IA aplicada." : "Internal software, APIs, integrations, and automation with applied AI."}</p>
        <ul className={styles.stack}><li>Java · Spring Boot</li><li>PHP · Laravel</li><li>Python</li><li>JavaScript · React</li><li>PostgreSQL · MySQL</li><li>LLMs · RAG</li></ul>
      </section>
      <section className={`${styles.panel} ${styles.contact}`} id="contact" data-orbit-scene="contact" aria-labelledby="contact-title">
        <div className={styles.sectionSignal}><Signal sector="contato" /></div>
        <h2 id="contact-title">{t.contactTitle}<span>{locale === "pt" ? "?" : "."}</span></h2>
        <Contact locale={locale} />
        <footer className={styles.footer}><span>© {new Date().getFullYear()} {site.name}</span><Link href={pathFor(locale,"privacy")}>{t.privacy}</Link></footer>
        <a className={styles.return} href={`#${a.home}`}>{t.home} <span aria-hidden="true">↻</span></a>
      </section>
      <Arrival locale={locale} echo />
    </main>
    <div className={styles.progress} aria-hidden="true" />
    </Journey>
  </div>;
}
