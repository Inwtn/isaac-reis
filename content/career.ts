import type { Locale } from "./locales";

export const career = {
  pt: {
    experience: "Experiência",
    currentWork: "Engenharia para o ERP da 3D Lab",
    currentSummary: "Construo módulos e integrações para o ERP interno com PHP, Laravel, JavaScript e Python. Uso IA generativa para automatizar parte desse trabalho.",
    careerDetails: "Ver trajetória profissional",
    education: "Formação",
    certifications: "Cursos e certificações",
    roles: [
      { title: "Engenheiro de software", company: "3D Lab", period: "set. 2026 – atual", detail: "Desenvolvo módulos para o ERP interno, do planejamento à implementação. Trabalho com JavaScript, PHP, Laravel e Python em integrações, automações e scripts com IA generativa. Também testo funcionalidades, registro bugs e mantenho a documentação técnica." },
      { title: "Desenvolvedor de software", period: "fev. 2025 – jun. 2026", detail: "Desenvolvi APIs REST e microsserviços com Java e Spring Boot. Automatizei a atualização de planilhas de fluxo de caixa e integrei sistemas que processavam até R$ 100 mil por mês." },
      { title: "Analista financeiro", company: "Benericks Cocktail Co", period: "out. 2020 – fev. 2025", detail: "Cuidei do fluxo de caixa, contas a pagar e a receber e conciliação bancária. Automatizei rotinas e preparei relatórios para o fechamento mensal." },
    ],
    degree: "Análise e Desenvolvimento de Sistemas",
    university: "Newton Paiva",
    studyPeriod: "jan. 2025 – atual",
  },
  en: {
    experience: "Experience",
    currentWork: "Building 3D Lab’s ERP",
    currentSummary: "I build internal ERP modules and integrations with PHP, Laravel, JavaScript, and Python. I use generative AI to automate parts of that work.",
    careerDetails: "See career history",
    education: "Education",
    certifications: "Courses & certifications",
    roles: [
      { title: "Software Engineer", company: "3D Lab", period: "Sep 2026 – present", detail: "I build internal ERP modules from planning through implementation. I use JavaScript, PHP, Laravel, and Python for integrations, automation, and scripts with generative AI. I also test features, report bugs, and maintain technical documentation." },
      { title: "Software Developer", period: "Feb 2025 – Jun 2026", detail: "I built REST APIs and microservices with Java and Spring Boot. I automated cash flow spreadsheets and integrated systems that processed up to BRL 100,000 per month." },
      { title: "Financial Analyst", company: "Benericks Cocktail Co", period: "Oct 2020 – Feb 2025", detail: "I managed cash flow, accounts payable and receivable, and bank reconciliation. I automated routine tasks and prepared reports for the monthly close." },
    ],
    degree: "Systems Analysis and Development",
    university: "Newton Paiva",
    studyPeriod: "Jan 2025 – present",
  },
} satisfies Record<Locale, {
  experience: string; education: string; certifications: string;
  currentWork: string; currentSummary: string; careerDetails: string;
  roles: {title: string; company?: string; period: string; detail: string}[];
  degree: string; university: string; studyPeriod: string;
}>;

export const certificates = [
  { issuer: "Google", name: "Google Cybersecurity", year: 2026 },
  { issuer: "IBM", name: "Started with Cybersecurity", year: 2026 },
  { issuer: "IBM", name: "Web Development Fundamentals" },
  { issuer: "Santander", name: "Data with Python and AI" },
  { issuer: "Santander", name: "RAG with ChromaDB, LlamaIndex and Python" },
];
