import type { Locale } from "./locales";

export type Project = {
  slug: string; title: string; year: string; kind: string; summary: string; stack: string[];
  href: string; live?: string; facts: string[]; role: string;
};

export const projects: Project[] = [
  { slug: "mneme", title: "MNEME", year: "[PREENCHER]", kind: "Plataforma de pesquisa financeira", summary: "Uma plataforma que conecta dados de mercado, experimentos quantitativos e decisões rastreáveis.", stack: ["Python", "TypeScript", "Dados", "IA local"], href: "https://github.com/Inwtn/MNEME", live: "https://mneme-1b8.pages.dev/", role: "Contribuição em dados, pesquisa, serviços, interface e infraestrutura.", facts: ["Pipelines preservam datas e origem para reproduzir análises.", "Validação cronológica reduz vazamento de informação futura.", "As decisões passam por controles de risco antes da simulação."] },
  { slug: "reconciliacao-bancaria", title: "Conciliação bancária", year: "[PREENCHER]", kind: "API financeira", summary: "Compara extratos OFX ou CSV com lançamentos internos e separa registros conciliados, divergentes e pendentes.", stack: ["Java", "Spring Boot", "PostgreSQL", "Testcontainers"], href: "https://github.com/Inwtn/bank-reconciliation", role: "Projeto open source.", facts: ["A conciliação compara valor, natureza e data das transações.", "Uma tolerância de um dia cobre diferenças de data de compensação.", "Perfis de leitura e administração separam consulta de alteração."] },
  { slug: "finance-sync-api", title: "Finance Sync API", year: "2026", kind: "Integração", summary: "Recebe lançamentos por uma API REST e acrescenta os dados a uma planilha do Google Sheets.", stack: ["Java", "Spring Boot", "Google Sheets API"], href: "https://github.com/Inwtn/API-Finance-Sync", role: "Projeto pessoal.", facts: ["A requisição recebe data, tipo, categoria, descrição e valor.", "Controller, DTO e serviço mantêm separadas as responsabilidades.", "A autenticação do Google usa uma conta de serviço configurada."] },
  { slug: "streamhub", title: "StreamHub", year: "[PREENCHER]", kind: "Aplicação WebRTC", summary: "Salas privadas para compartilhar a tela diretamente entre navegadores, com chamadas de voz opcionais.", stack: ["TypeScript", "React", "WebRTC", "Socket.IO"], href: "https://github.com/Inwtn/streamhub", live: "https://streamhub-inwtn.onrender.com/", role: "Projeto open source.", facts: ["O servidor cuida das salas e da sinalização; a mídia segue via WebRTC.", "Credenciais diferentes definem quem hospeda e quem assiste.", "Diagnósticos exibem métricas de conexão para cada participante."] },
  { slug: "lupa-net", title: "Lupa.NET", year: "[PREENCHER]", kind: "Ferramenta de análise estática", summary: "Explora assemblies .NET localmente e apresenta C# reconstruído, IL, metadados e referências sem executar o código analisado.", stack: ["C#", "Node.js", "PowerShell", "ILSpy"], href: "https://github.com/Inwtn/lupa-net", role: "Ferramenta pessoal open source.", facts: ["A interface local envia arquivos ao serviço ligado ao loopback.", "O analisador inspeciona metadados e métodos sem invocá-los.", "Notas ficam no navegador e podem ser exportadas como texto ou JSON."] },
];

type Translation = Pick<Project, "title" | "kind" | "summary" | "role" | "facts"> & { stack?: string[] };

const english: Record<string, Translation> = {
  mneme: {
    title: "MNEME", kind: "Financial research platform", summary: "Connects market data, quantitative experiments, and traceable decisions.",
    stack: ["Python", "TypeScript", "Data", "Local AI"], role: "Contributed to data, research, services, interface, and infrastructure.",
    facts: ["The pipelines preserve dates and sources so analyses can be reproduced.", "Time ordered validation reduces leakage of future information.", "Decisions pass through risk checks before simulation."],
  },
  "reconciliacao-bancaria": {
    title: "Bank Reconciliation", kind: "Finance API", summary: "Compares OFX or CSV statements with internal records and flags matched, divergent, and pending entries.",
    role: "Open source project.", facts: ["Reconciliation compares transaction amounts, types, and dates.", "A one-day tolerance covers settlement date differences.", "Read and admin roles separate viewing from editing."],
  },
  "finance-sync-api": {
    title: "Finance Sync API", kind: "Integration", summary: "Receives financial entries through a REST API and appends them to a Google Sheets spreadsheet.",
    role: "Personal project.", facts: ["Requests carry the date, type, category, description, and amount.", "The controller, DTO, and service have separate responsibilities.", "Google authentication uses a configured service account."],
  },
  streamhub: {
    title: "StreamHub", kind: "WebRTC application", summary: "Private rooms for direct screen sharing between browsers, with optional voice calls.",
    role: "Open source project.", facts: ["The server handles rooms and signaling; media travels over WebRTC.", "Separate credentials determine who hosts and who watches.", "Diagnostics show connection metrics for each participant."],
  },
  "lupa-net": {
    title: "Lupa.NET", kind: "Static analysis tool", summary: "Inspects .NET assemblies locally and shows reconstructed C#, IL, metadata, and references without running the analyzed code.",
    role: "Personal open source tool.", facts: ["The local interface sends files to a service bound to loopback.", "The analyzer inspects metadata and methods without invoking them.", "Notes stay in the browser and can be exported as text or JSON."],
  },
};

export function localizeProject(project: Project, locale: Locale): Project {
  return locale === "en" ? { ...project, ...english[project.slug] } : project;
}
