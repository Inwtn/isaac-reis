import type { Metadata } from "next";
import { site } from "./site";

export type Locale = "pt" | "en";
type Page = "home" | "privacy" | "project";
export const baseUrl = "https://isaac-reis.vercel.app";
export const otherLocale = (locale: Locale): Locale => locale === "pt" ? "en" : "pt";
export const htmlLang = { pt: "pt-BR", en: "en" } as const;

export const dictionary = {
  pt: {
    role: "Engenharia de software", job: site.role, description: site.description,
    explore: "Explorar", home: "Início", projects: "Projetos", about: "Sobre", contact: "Contato", privacy: "Privacidade",
    aboutStart: "Das finanças", aboutEnd: "ao código", contactTitle: "Vamos conversar",
    aboutTitle: "Software para a vida real",
    aboutIntro: "Gosto de entender o que acontece antes e depois de cada clique. Passei mais de quatro anos em operações financeiras; hoje transformo processos complexos em ferramentas que as pessoas conseguem usar de verdade.",
    aboutDetail: "Construo funcionalidades para sistemas internos, APIs e integrações. No dia a dia, conecto dados, automatizo tarefas repetitivas e experimento IA aplicada onde ela resolve um problema concreto.",
    focus: [
      { title: "Fluxos que funcionam", text: "Da conciliação bancária à rotina de um ERP, começo pelas regras do negócio e por quem usa o sistema." },
      { title: "Sistemas conectados", text: "APIs, serviços e bancos de dados trabalhando juntos para reduzir retrabalho e dar clareza aos dados." },
      { title: "IA com propósito", text: "Automação e modelos de linguagem entram quando ajudam a equipe a decidir ou produzir melhor." },
    ],
    bio: "Depois de mais de quatro anos em operações financeiras, passei a desenvolver sistemas internos, integrações e automações.",
    navigation: "Navegação principal", skip: "Pular para o conteúdo", language: "Read in English",
    copy: "Copiar e-mail", copied: "Endereço copiado.", copyError: "Não foi possível copiar. Use o link de e-mail.",
    signal: "Sinal", collect: "Coletar sinal", collected: "Sinal coletado", signals: "Sinais", complete: "Sinais completos",
    backWork: "Voltar aos projetos", backHome: "Voltar ao início",
    kind: "Tipo", year: "Ano", roleLabel: "Participação", stack: "Tecnologias", unknownYear: "Não informado",
    workflow: "Fluxo do projeto", workflowNote: "Diagrama editorial baseado no fluxo descrito no repositório.",
    workflowLabel: "Etapas documentadas do projeto", details: "Detalhes de implementação", source: "Ver repositório", live: "Abrir projeto",
    privacyDescription: "Informações sobre privacidade neste site.", privacyTitle: "Dados neste site",
    privacyBody: "Este portfólio não usa análise de tráfego, formulários, publicidade nem cookies próprios. Os sinais coletados são salvos no seu navegador. O contato abre seu aplicativo de e-mail. Serviços externos seguem suas próprias políticas de privacidade.",
    privacyContact: "Para falar sobre esta página, escreva para",
    notFound: "Esta página não existe.",
  },
  en: {
    role: "Software engineering", job: "Software Engineer", description: "Isaac Almeida’s portfolio: internal software, integrations, and automation.",
    explore: "Explore", home: "Home", projects: "Projects", about: "About", contact: "Contact", privacy: "Privacy",
    aboutStart: "From finance", aboutEnd: "to software", contactTitle: "Let’s talk",
    aboutTitle: "Software for real life",
    aboutIntro: "I like to understand what happens before and after every click. I spent over four years in financial operations; now I turn complex processes into tools people can actually use.",
    aboutDetail: "I build features for internal systems, APIs, and integrations. My work connects data, automates repetitive tasks, and explores applied AI when it solves a real problem.",
    focus: [
      { title: "Workflows that work", text: "From bank reconciliation to ERP routines, I start with the business rules and the people using the system." },
      { title: "Connected systems", text: "APIs, services, and databases working together to reduce busywork and make data clearer." },
      { title: "AI with a purpose", text: "Automation and language models belong where they help a team decide or create more effectively." },
    ],
    bio: "After more than four years in financial operations, I moved into building internal software, integrations, and automation.",
    navigation: "Main navigation", skip: "Skip to content", language: "Ler em português",
    copy: "Copy email", copied: "Email address copied.", copyError: "Couldn’t copy the address. Use the email link instead.",
    signal: "Signal", collect: "Collect signal", collected: "Signal collected", signals: "Signals", complete: "All signals collected",
    backWork: "Back to projects", backHome: "Back to home",
    kind: "Type", year: "Year", roleLabel: "Role", stack: "Technologies", unknownYear: "Not listed",
    workflow: "How it works", workflowNote: "Illustration based on the workflow documented in the repository.",
    workflowLabel: "Documented project steps", details: "Implementation details", source: "View source", live: "Open project",
    privacyDescription: "Privacy information for this website.", privacyTitle: "Data on this site",
    privacyBody: "This portfolio does not use analytics, forms, advertising, or its own cookies. Collected signals are saved in your browser. The contact link opens your email app. External services have their own privacy policies.",
    privacyContact: "For questions about this page, email",
    notFound: "This page doesn’t exist.",
  },
} as const;

const englishSlugs: Record<string, string> = { "reconciliacao-bancaria": "bank-reconciliation" };
export const projectSlug = (locale: Locale, slug: string) => locale === "en" ? englishSlugs[slug] ?? slug : slug;
export const pathFor = (locale: Locale, page: Page = "home", slug = "") => {
  if (page === "home") return locale === "en" ? "/" : "/pt";
  if (page === "privacy") return locale === "en" ? "/privacy" : "/pt/privacidade";
  return `${locale === "en" ? "/work" : "/pt/trabalhos"}/${projectSlug(locale, slug)}`;
};
export const anchors = { pt: { home: "inicio", work: "trabalhos", about: "sobre", contact: "contact" }, en: { home: "home", work: "work", about: "about", contact: "contact" } } as const;

export function pageMetadata(locale: Locale, page: Page, slug = "", copy?: {title: string; description: string}): Metadata {
  const words = dictionary[locale];
  const title = copy?.title ?? `${site.name} — ${words.job}`;
  const description = copy?.description ?? words.description;
  return {
    metadataBase: new URL(baseUrl), title, description,
    icons: { icon: "/icon.svg" },
    alternates: { canonical: pathFor(locale, page, slug), languages: { "pt-BR": pathFor("pt", page, slug), en: pathFor("en", page, slug), "x-default": pathFor("en", page, slug) } },
    openGraph: { type: "website", locale: locale === "en" ? "en_US" : "pt_BR", alternateLocale: [locale === "en" ? "pt_BR" : "en_US"], title, description, url: pathFor(locale, page, slug) },
    twitter: { card: "summary", title, description },
  };
}
