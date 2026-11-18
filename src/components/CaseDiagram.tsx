const flows:Record<string,string[]>={
  mneme:["Dados de mercado","Pesquisa e validação","Controles de risco","Execução simulada"],
  "reconciliacao-bancaria":["Extrato OFX ou CSV","Leitura e validação","Conciliação por regras","Registros classificados"],
  "finance-sync-api":["Transação enviada","API REST","Google Sheets","Linha registrada"],
  streamhub:["Sala privada","Sinalização","Conexão WebRTC","Tela compartilhada"],
  "lupa-net":["Arquivo local","Análise PE/CLI","C# e IL reconstruídos","Notas da sessão"],
};
const english: Record<string, string[]> = {
  mneme: ["Market data", "Research and validation", "Risk checks", "Simulated execution"],
  "reconciliacao-bancaria": ["OFX or CSV statement", "Parsing and validation", "Rule-based reconciliation", "Classified entries"],
  "finance-sync-api": ["Transaction submitted", "REST API", "Google Sheets", "Row added"],
  streamhub: ["Private room", "Signaling", "WebRTC connection", "Shared screen"],
  "lupa-net": ["Local file", "PE/CLI analysis", "Reconstructed C# and IL", "Session notes"],
};

export function CaseDiagram({slug, locale}: {slug: string; locale: Locale}) {
  const steps = (locale === "en" ? english : flows)[slug] ?? [];
  return <ol className="case__diagram" aria-label={dictionary[locale].workflowLabel}>{steps.map(step => <li key={step}>{step}</li>)}</ol>;
}
import { dictionary, type Locale } from "@/content/locales";
