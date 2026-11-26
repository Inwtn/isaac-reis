import type { ReactNode } from "react";
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
import { ProjectArtwork } from "./ProjectArtwork";
import { PixelCursor } from "@/src/components/PixelCursor";
import { AnimatedAvatar } from "./AnimatedAvatar";
import { ProjectLink } from "./ProjectLink";
import styles from "@/app/orbit.module.css";

// Run before the browser can restore the previous position or jump to its old fragment.
const preparePortfolio = `
  if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    window.scrollTo(0, 0);
    window.addEventListener("pageshow", () => {
      // Keep manual mode through the browser's restoration after pageshow.
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        history.scrollRestoration = previousRestoration;
      });
    }, { once: true });
  }
  if (!location.hash && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.setAttribute("data-portfolio-opening", "");
    window.setTimeout(() => document.documentElement.removeAttribute("data-portfolio-opening"), 7000);
  }
`;

const projectCaptions: Record<string, Record<Locale, string>> = {
  mneme: { pt: "Dados de mercado e backtesting", en: "Market data and backtesting" },
  "reconciliacao-bancaria": { pt: "Concilia extratos OFX e CSV", en: "Matches OFX and CSV bank statements" },
  "finance-sync-api": { pt: "Envia lançamentos ao Google Sheets", en: "Sends transactions to Google Sheets" },
  streamhub: { pt: "Compartilha a tela em salas privadas", en: "Screen sharing in private rooms" },
  "lupa-net": { pt: "Inspeciona assemblies .NET localmente", en: "Inspects .NET assemblies locally" },
};

const startupPixels = ["..###..", ".#####.", "#######", "#######", ".#####.", "..###..", "...#..."];
const startupBuildings = [
  { x: 0, width: 112, height: 142 }, { x: 102, width: 82, height: 210 }, { x: 176, width: 118, height: 170 },
  { x: 286, width: 92, height: 265 }, { x: 370, width: 132, height: 192 }, { x: 494, width: 86, height: 310 },
  { x: 572, width: 124, height: 230 }, { x: 688, width: 92, height: 168 }, { x: 770, width: 116, height: 248 },
  { x: 878, width: 84, height: 355 }, { x: 952, width: 132, height: 260 }, { x: 1076, width: 98, height: 195 },
  { x: 1164, width: 122, height: 300 }, { x: 1276, width: 88, height: 220 }, { x: 1354, width: 112, height: 155 },
];

function Arrival({ locale, echo = false }: { locale: Locale; echo?: boolean }) {
  const t = dictionary[locale], a = anchors[locale];
  return <section className={styles.arrival} id={echo ? undefined : a.home} data-orbit-scene={!echo ? a.home : undefined} data-orbit-seam={echo ? "" : undefined} aria-hidden={echo || undefined}>
    <div className={styles.arrivalCopy} data-arrival-copy={!echo || undefined}>
      <div className={styles.arrivalStage}>
        <AnimatedAvatar alt={echo ? "" : locale === "pt" ? "Avatar de Isaac em pixel art, de corpo inteiro, com roupa futurista preta e detalhes amarelos" : "Full-body pixel art avatar of Isaac in a black futuristic outfit with yellow details"} />
      </div>
      {echo ? <p className={styles.name}>Isaac Almeida<span>.</span></p> : <h1 className={styles.name}>Isaac Almeida<span>.</span></h1>}
      <p className={styles.arrivalLine}>{locale === "pt" ? "Desenvolvo sistemas, integro APIs e automatizo processos." : "I build software, connect APIs, and automate workflows."}</p>
      {!echo && <div className={styles.arrivalActions}>
        <a className={styles.primaryEntry} href={`#${a.work}`}>{t.projects}</a>
        <a href={`#${a.about}`}>{t.about}</a>
      </div>}
      {echo && <div className={styles.arrivalActions}><span className={styles.primaryEntry}>{t.projects}</span><span>{t.about}</span></div>}
    </div>
  </section>;
}

function PortalSection({ id, heading, theme, variant, panelClass, children }: {
  id: string;
  heading: string;
  theme: "work" | "about" | "experience" | "education" | "contact";
  variant: "gallery" | "full" | "compact";
  panelClass?: string;
  children: ReactNode;
}) {
  return <section id={id} className={styles.sceneTrack} data-orbit-scene={id} data-scene-entry={theme} aria-labelledby={heading}>
    <div className={styles.scenePin}>
      {theme !== "about" && <div className={styles.portalRim} aria-hidden="true" />}
      <div className={[styles.panel, panelClass].filter(Boolean).join(" ")} data-portal-panel={variant}>
        {children}
      </div>
    </div>
  </section>;
}

export function Portfolio({locale}: {locale: Locale}) {
  const t = dictionary[locale], a = anchors[locale];
  const cv = career[locale];
  const [currentRole, ...pastRoles] = cv.roles;
  const markers = [[a.work,t.projects],[a.about,t.about],[a.experience,cv.experience],[a.education,cv.education],[a.contact,t.contact]];
  return <div className={styles.orbit} data-orbit-root>
    <script dangerouslySetInnerHTML={{ __html: preparePortfolio }} />
    <div className={styles.startup} data-startup role="status">
      <div className={styles.startupScene} aria-hidden="true">
        <div className={styles.startupDawn} data-startup-dawn />
        <div className={styles.startupDay} data-startup-day />
        <div className={styles.startupDusk} data-startup-dusk />
        <div className={styles.startupNight} data-startup-night />
        <div className={styles.startupStars} data-startup-stars />
        <i className={styles.startupSun} data-startup-sun />
        <i className={styles.startupMoon} data-startup-moon />
        <svg className={styles.startupCity} viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax slice">
          <rect x="0" y="380" width="1440" height="80" fill="#101723" />
          {startupBuildings.map(({ x, width, height }, building) => {
            const top = 460 - height;
            const windowsAcross = Math.max(1, Math.floor((width - 18) / 24));
            return <g key={x}>
              <rect x={x} y={top} width={width} height={height} fill={building % 3 === 0 ? "#141d2a" : "#101824"} />
              <path d={`M${x} ${top}h${Math.round(width * .22)}v-12h${Math.round(width * .28)}v12h${Math.round(width * .5)}v5h-${width}z`} fill="#1c2937" />
              <g data-startup-windows opacity=".18">
                {Array.from({ length: Math.max(1, Math.floor((height - 26) / 28)) }, (_, row) => Array.from({ length: windowsAcross }, (_, column) => <rect key={`${row}-${column}`} x={x + 8 + column * 24} y={top + 20 + row * 28} width="5" height="8" fill={(row + column + building) % 4 === 0 ? "#69c2c0" : "#ffd735"} />))}
              </g>
            </g>;
          })}
          <path d="M0 438H250v-8h124v12h178v-9h190v13h142v-8h158v10h175v-12h223v24H0z" fill="#080d15" />
          <path d="M0 438H250m124 4h178m12-9h190m-48 22h142m-8-8h158m-14 10h175m0-12h223" fill="none" stroke="#ffd735" strokeWidth="4" opacity=".64" />
        </svg>
      </div>
      <div className={styles.startupContent}>
        <div className={styles.startupMeta} data-startup-copy>
          <span className={styles.startupBrand}><i aria-hidden="true">✳</i> INWTN</span>
          <span>{locale === "pt" ? "PORTFÓLIO DIGITAL" : "DIGITAL PORTFOLIO"}</span>
        </div>
        <div className={styles.startupMark} aria-hidden="true">
          {startupPixels.flatMap((row, y) => [...row].map((pixel, x) => pixel === "#" ? <i key={`${x}-${y}`} data-startup-tile /> : null))}
        </div>
        <p className={styles.startupName} data-startup-copy>ISAAC ALMEIDA<span>.</span></p>
        <p className={styles.startupCaption} data-startup-copy>{locale === "pt" ? "PREPARANDO A EXPERIÊNCIA" : "PREPARING THE EXPERIENCE"}</p>
        <div className={styles.startupTrack} aria-hidden="true"><i data-startup-progress /></div>
        <div className={styles.startupFoot} data-startup-copy><span>{locale === "pt" ? "SISTEMAS ONLINE" : "SYSTEMS ONLINE"}</span><span>PIXEL / 01</span></div>
      </div>
    </div>
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
      <PortalSection id={a.work} heading="work-title" theme="work" variant="gallery">
        <div className={styles.projectGallery}>
          <header className={styles.galleryHeader}>
            <h2 id="work-title">{t.projects}</h2>
            <Signal sector="trabalhos" />
          </header>
          <div className={styles.projectGrid}>
            {projects.map((source, index) => {
              const project = localizeProject(source, locale);
              return <ProjectLink key={source.slug} slug={source.slug} href={pathFor(locale, "project", source.slug)} title={project.title} featured={index === 0}>
                <div className={styles.projectWindow}><ProjectArtwork slug={source.slug} /></div>
                <div className={styles.projectCopy}>
                  <h3>{project.title}</h3>
                  <p>{projectCaptions[source.slug]?.[locale] ?? project.kind}</p>
                  <ul aria-label={t.stack} className={styles.projectStack}>
                    {project.stack.slice(0, 3).map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
              </ProjectLink>;
            })}
          </div>
        </div>
      </PortalSection>
      <PortalSection id={a.about} heading="about-title" theme="about" variant="full" panelClass={styles.about}>
        <div className={styles.sceneContent}>
          <div className={styles.sectionSignal}><Signal sector="sobre" /></div>
          <div className={styles.aboutLead}>
            <h2 id="about-title">{t.aboutTitle}<span>.</span></h2>
            <p className={styles.aboutText}>{t.aboutDetail}</p>
          </div>
          <div className={styles.focusGrid}>
            {t.focus.map(item => <div className={styles.focusItem} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
          <ul className={styles.stack}><li>Java · Spring Boot</li><li>PHP · Laravel</li><li>Python</li><li>JavaScript · React</li><li>PostgreSQL · MySQL</li><li>LLMs · RAG</li></ul>
          <a className={styles.aboutEnter} href={`#${a.work}`}>{locale === "pt" ? "ENTRAR NOS PROJETOS" : "ENTER PROJECTS"}<span aria-hidden="true"> ↗</span></a>
        </div>
      </PortalSection>
      <PortalSection id={a.experience} heading="experience-title" theme="experience" variant="compact">
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
      </PortalSection>
      <PortalSection id={a.education} heading="education-title" theme="education" variant="compact">
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
      </PortalSection>
      <PortalSection id={a.contact} heading="contact-title" theme="contact" variant="compact" panelClass={styles.contact}>
        <div className={styles.sceneContent}>
          <div className={styles.sectionSignal}><Signal sector="contato" /></div>
          <h2 id="contact-title">{t.contactTitle}<span>{locale === "pt" ? "?" : "."}</span></h2>
          <Contact locale={locale} />
          <footer className={styles.footer}><span>© {new Date().getFullYear()} {site.name}</span><Link href={pathFor(locale,"privacy")}>{t.privacy}</Link></footer>
          <a className={styles.return} href={`#${a.home}`}>{t.home} <span aria-hidden="true">↻</span></a>
        </div>
      </PortalSection>
      <Arrival locale={locale} echo />
    </main>
    <div className={styles.progress} aria-hidden="true" />
    </Journey>
  </div>;
}
