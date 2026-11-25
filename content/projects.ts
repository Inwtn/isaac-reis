import type { Locale } from "./locales";

export type Project = {
  slug: string; title: string; year: string; kind: string; summary: string; stack: string[];
  href: string; live?: string; facts: string[]; role: string;
};

export const projects: Project[] = [
  { slug: "mneme", title: "MNEME", year: "[PREENCHER]", kind: "Plataforma de pesquisa financeira", summary: "Pesquisa de mercado com os dados à vista: origem, data, experimento e controles de risco no mesmo lugar.", stack: ["Python", "TypeScript", "Dados", "IA local"], href: "https://github.com/Inwtn/MNEME", live: "https://mneme-1b8.pages.dev/", role: "Contribuição em dados, pesquisa, serviços, interface e infraestrutura.", facts: ["Pipelines preservam datas e origem para reproduzir análises.", "Validação cronológica reduz vazamento de informação futura.", "As decisões passam por controles de risco antes da simulação."] },
  { slug: "reconciliacao-bancaria", title: "Conciliação bancária", year: "[PREENCHER]", kind: "API financeira", summary: "Importe um extrato OFX ou CSV. O sistema mostra o que bateu, o que divergiu e o que ainda precisa de revisão.", stack: ["Java", "Spring Boot", "PostgreSQL", "Testcontainers"], href: "https://github.com/Inwtn/bank-reconciliation", role: "Projeto open source.", facts: ["A conciliação compara valor, natureza e data das transações.", "Uma tolerância de um dia cobre diferenças de data de compensação.", "Perfis de leitura e administração separam consulta de alteração."] },
  { slug: "finance-sync-api", title: "Finance Sync API", year: "2026", kind: "Integração", summary: "Uma API pequena que leva lançamentos financeiros para o Google Sheets assim que eles chegam.", stack: ["Java", "Spring Boot", "Google Sheets API"], href: "https://github.com/Inwtn/API-Finance-Sync", role: "Projeto pessoal.", facts: ["A requisição recebe data, tipo, categoria, descrição e valor.", "Controller, DTO e serviço mantêm separadas as responsabilidades.", "A autenticação do Google usa uma conta de serviço configurada."] },
  { slug: "streamhub", title: "StreamHub", year: "[PREENCHER]", kind: "Aplicação WebRTC", summary: "Compartilhamento de tela em sala privada para até cinco pessoas. O vídeo não fica gravado no servidor.", stack: ["TypeScript", "React", "WebRTC", "Socket.IO"], href: "https://github.com/Inwtn/streamhub", live: "https://streamhub-inwtn.onrender.com/", role: "Projeto open source.", facts: ["O servidor cuida das salas e da sinalização; a mídia segue via WebRTC.", "Credenciais diferentes definem quem hospeda e quem assiste.", "Diagnósticos exibem métricas de conexão para cada participante."] },
  { slug: "lupa-net", title: "Lupa.NET", year: "[PREENCHER]", kind: "Ferramenta de análise estática", summary: "Olhe dentro de um assembly .NET sem executá-lo: C# reconstruído, IL, metadados e referências numa interface local.", stack: ["C#", "Node.js", "PowerShell", "ILSpy"], href: "https://github.com/Inwtn/lupa-net", role: "Ferramenta pessoal open source.", facts: ["A interface local envia arquivos ao serviço ligado ao loopback.", "O analisador inspeciona metadados e métodos sem invocá-los.", "Notas ficam no navegador e podem ser exportadas como texto ou JSON."] },
];

type Translation = Pick<Project, "title" | "kind" | "summary" | "role" | "facts"> & { stack?: string[] };

const english: Record<string, Translation> = {
  mneme: {
    title: "MNEME", kind: "Financial research platform", summary: "Market research with the data in plain sight: source, date, experiment, and risk checks in one place.",
    stack: ["Python", "TypeScript", "Data", "Local AI"], role: "Contributed to data, research, services, interface, and infrastructure.",
    facts: ["The pipelines preserve dates and sources so analyses can be reproduced.", "Time ordered validation reduces leakage of future information.", "Decisions pass through risk checks before simulation."],
  },
  "reconciliacao-bancaria": {
    title: "Bank Reconciliation", kind: "Finance API", summary: "Drop in an OFX or CSV statement. See what matched, what didn't, and what still needs review.",
    role: "Open source project.", facts: ["Reconciliation compares transaction amounts, types, and dates.", "A one-day tolerance covers settlement date differences.", "Read and admin roles separate viewing from editing."],
  },
  "finance-sync-api": {
    title: "Finance Sync API", kind: "Integration", summary: "A small API that sends financial entries to Google Sheets as they arrive.",
    role: "Personal project.", facts: ["Requests carry the date, type, category, description, and amount.", "The controller, DTO, and service have separate responsibilities.", "Google authentication uses a configured service account."],
  },
  streamhub: {
    title: "StreamHub", kind: "WebRTC application", summary: "Private screen sharing for up to five viewers. The video is never stored on the server.",
    role: "Open source project.", facts: ["The server handles rooms and signaling; media travels over WebRTC.", "Separate credentials determine who hosts and who watches.", "Diagnostics show connection metrics for each participant."],
  },
  "lupa-net": {
    title: "Lupa.NET", kind: "Static analysis tool", summary: "Look inside a .NET assembly without running it: decompiled C#, IL, metadata, and references in one local view.",
    role: "Personal open source tool.", facts: ["The local interface sends files to a service bound to loopback.", "The analyzer inspects metadata and methods without invoking them.", "Notes stay in the browser and can be exported as text or JSON."],
  },
};

export function localizeProject(project: Project, locale: Locale): Project {
  return locale === "en" ? { ...project, ...english[project.slug] } : project;
}
