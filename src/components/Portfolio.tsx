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
import { AnimatedAvatar } from "@/src/components/AnimatedAvatar";
import styles from "@/app/orbit.module.css";

function Arrival({ locale, echo = false }: { locale: Locale; echo?: boolean }) {
  const t = dictionary[locale], a = anchors[locale];
  return <section className={styles.arrival} id={echo ? undefined : a.home} data-orbit-scene={!echo ? a.home : undefined} data-orbit-seam={echo ? "" : undefined} aria-hidden={echo || undefined}>
    <div className={styles.arrivalCopy}>
      <AnimatedAvatar alt={echo ? "" : locale === "pt" ? "Avatar de Isaac em pixel art, de corpo inteiro, com roupa futurista preta e detalhes amarelos" : "Full-body pixel art avatar of Isaac in a black futuristic outfit with yellow details"} />
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
      <div className={styles.headerControls}><LanguageSwitch locale={locale} href={pathFor(otherLocale(locale))} preserveSection /><PixelMenu label={t.navigation}><nav className={styles.nav} aria-label={t.navigation}>
        {markers.map(([id, label]) => <a key={id} href={`#${id}`} data-orbit-link={id}>{label}</a>)}
      </nav>
      <div className={styles.headerActions}><a className={styles.github} href={site.github}>GitHub <span aria-hidden="true">↗</span></a></div></PixelMenu></div>
    </header>
    <main id="conteudo" className={styles.main}>
      <Arrival locale={locale} />
      <section id={a.work} data-orbit-scene={a.work} className={`${styles.panel} ${styles.work}`} aria-labelledby="work-title">
        <div className={styles.workHeading}><div className={styles.workIndex}><Signal sector="trabalhos" /><span>01 / 05</span></div><h2 id="work-title">{t.projects}<span>.</span></h2></div>
        <div className={styles.projectList}>
          {projects.map(project => localizeProject(project, locale)).map((project, index) => <Link key={project.slug} className={styles.project} href={pathFor(locale,"project",project.slug)}>
            <span className={styles.projectNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.projectCopy}><strong className={styles.projectTitle}>{project.title}</strong><span className={styles.projectSummary}>{project.summary}</span><span className={styles.projectStack}>{project.stack.slice(0, 3).join(" / ")}</span></span>
            <span className={styles.projectArrow} aria-hidden="true">↗</span>
          </Link>)}
        </div>
      </section>
      <section id={a.about} data-orbit-scene={a.about} className={`${styles.panel} ${styles.about}`} aria-labelledby="about-title">
        <div className={styles.sectionSignal}><Signal sector="sobre" /></div>
        <h2 id="about-title">{t.aboutTitle}<span>.</span></h2>
        <p className={styles.aboutText}>{t.aboutIntro}</p>
        <p className={styles.aboutDetail}>{t.aboutDetail}</p>
        <div className={styles.focusGrid}>{t.focus.map(item => <div className={styles.focusItem} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
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
