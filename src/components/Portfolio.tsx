import Link from "next/link";
import { site } from "@/content/site";
import { projects, localizeProject } from "@/content/projects";
import { anchors, dictionary, otherLocale, pathFor, type Locale } from "@/content/locales";
import { career, certificates } from "@/content/career";
import { LanguageSwitch } from "./LanguageSwitch";
import { PixelMenu } from "./PixelMenu";
import { Orbit } from "@/src/components/Orbit";
import { Contact } from "@/src/components/Contact";
import { Journey, Signal } from "@/src/components/Journey";
import { PixelCursor } from "@/src/components/PixelCursor";
import { AnimatedAvatar } from "./AnimatedAvatar";
import styles from "@/app/orbit.module.css";

const projectCaptions: Record<string, Record<Locale, string>> = {
  mneme: { pt: "Dados de mercado e backtesting", en: "Market data and backtesting" },
  "reconciliacao-bancaria": { pt: "Concilia extratos OFX e CSV", en: "Matches OFX and CSV bank statements" },
  "finance-sync-api": { pt: "Envia lançamentos ao Google Sheets", en: "Sends transactions to Google Sheets" },
  streamhub: { pt: "Compartilha a tela em salas privadas", en: "Screen sharing in private rooms" },
  "lupa-net": { pt: "Inspeciona assemblies .NET localmente", en: "Inspects .NET assemblies locally" },
};

const projectIcons: Record<string, string[]> = {
  mneme: [".......",".....##","....##.","#...#..",".###...","..#....","......."],
  "reconciliacao-bancaria": ["..#.#..",".#####.","..#.#..",".......","..#.#..",".#####.","..#.#.."],
  "finance-sync-api": ["######.","#.#..#.","######.","#.#..#.","######.","#.#..#.","######."],
  streamhub: ["#######","#.....#","#..#..#","#..##.#","#..#..#","#.....#","#######"],
  "lupa-net": [".###...","#...#..","#...#..","#...#..",".###...","....##.",".....##"],
};

function ProjectIcon({slug}: {slug: string}) {
  const pixels = projectIcons[slug]?.flatMap((row, y) =>
    [...row].flatMap((cell, x) => cell === "#" ? [`${x * 3}px ${y * 3}px currentColor`] : [])
  );
  return <span className={styles.projectIcon} aria-hidden="true"><i style={{boxShadow: pixels?.join(", ")}} /></span>;
}

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
  const cv = career[locale];
  const [currentRole, ...pastRoles] = cv.roles;
  const markers = [[a.work,t.projects],[a.about,t.about],[a.experience,cv.experience],[a.education,cv.education],[a.contact,t.contact]];
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
      <section id={a.work} data-orbit-scene={a.work} data-scene-gate className={styles.panel} aria-labelledby="work-title">
        <div className={styles.sceneContent}>
          <div className={styles.sectionSignal}><Signal sector="trabalhos" /></div>
          <h2 id="work-title" className={styles.projectHeading}>{t.projects}</h2>
          <div className={styles.projectList}>
            {projects.map(source => {
              const project = localizeProject(source, locale);
              return <Link key={project.slug} className={styles.project} href={pathFor(locale, "project", project.slug)}>
                <ProjectIcon slug={source.slug} />
                <span className={styles.projectCopy}>
                  <strong className={styles.projectTitle}>{project.title}</strong>
                  <span className={styles.projectCaption}>{projectCaptions[source.slug]?.[locale] ?? project.kind}</span>
                </span>
              </Link>;
            })}
          </div>
        </div>
      </section>
      <section id={a.about} data-orbit-scene={a.about} data-scene-gate className={`${styles.panel} ${styles.about}`} aria-labelledby="about-title">
        <div className={styles.sceneContent}>
          <div className={styles.sectionSignal}><Signal sector="sobre" /></div>
          <h2 id="about-title">{t.aboutTitle}<span>.</span></h2>
          <p className={styles.aboutText}>{t.aboutIntro}</p>
          <p className={styles.aboutDetail}>{t.aboutDetail}</p>
          <div className={styles.focusGrid}>
            {t.focus.map(item => <div className={styles.focusItem} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
          <ul className={styles.stack}><li>Java · Spring Boot</li><li>PHP · Laravel</li><li>Python</li><li>JavaScript · React</li><li>PostgreSQL · MySQL</li><li>LLMs · RAG</li></ul>
        </div>
      </section>
      <section id={a.experience} data-orbit-scene={a.experience} data-scene-gate className={styles.panel} aria-labelledby="experience-title">
        <div className={styles.sceneContent}>
          <div className={styles.careerInner}>
            <h2 id="experience-title">{cv.experience}</h2>
            <article className={styles.currentWork}>
              <p className={styles.period}>{currentRole.company} · {currentRole.period}</p>
              <h3>{cv.currentWork}</h3>
              <p>{cv.currentSummary}</p>
            </article>
            <details className={styles.sceneNotes}>
              <summary>{cv.careerDetails}</summary>
              <p>{currentRole.title} · {currentRole.detail}</p>
              <ul>
                {pastRoles.map(role => <li key={role.title}>
                  <p className={styles.period}>{role.period}</p>
                  <h3>{role.title}{role.company && ` · ${role.company}`}</h3>
                  <p>{role.detail}</p>
                </li>)}
              </ul>
            </details>
          </div>
        </div>
      </section>
      <section id={a.education} data-orbit-scene={a.education} data-scene-gate className={styles.panel} aria-labelledby="education-title">
        <div className={styles.sceneContent}>
          <div className={styles.careerInner}>
            <h2 id="education-title">{cv.education}</h2>
            <div className={styles.degree}>
              <p className={styles.period}>{cv.studyPeriod}</p>
              <h3>{cv.degree}</h3>
              <p className={styles.company}>{cv.university}</p>
            </div>
            <details className={styles.sceneNotes}>
              <summary>{cv.certifications}</summary>
              <ul className={styles.certificates}>
                {certificates.map(cert => <li key={cert.name}><strong>{cert.name}</strong><span>{cert.issuer}{cert.year && ` · ${cert.year}`}</span></li>)}
              </ul>
            </details>
          </div>
        </div>
      </section>
      <section className={`${styles.panel} ${styles.contact}`} id="contact" data-orbit-scene="contact" data-scene-gate aria-labelledby="contact-title">
        <div className={styles.sceneContent}>
          <div className={styles.sectionSignal}><Signal sector="contato" /></div>
          <h2 id="contact-title">{t.contactTitle}<span>{locale === "pt" ? "?" : "."}</span></h2>
          <Contact locale={locale} />
          <footer className={styles.footer}><span>© {new Date().getFullYear()} {site.name}</span><Link href={pathFor(locale,"privacy")}>{t.privacy}</Link></footer>
          <a className={styles.return} href={`#${a.home}`}>{t.home} <span aria-hidden="true">↻</span></a>
        </div>
      </section>
      <Arrival locale={locale} echo />
    </main>
    <div className={styles.progress} aria-hidden="true" />
    </Journey>
  </div>;
}
