# Revisão dos projetos do GitHub

Consulta dos cinco repositórios públicos de Inwtn em 18/11/2026 para atualizar os textos do portfólio. Os resumos foram conferidos no README e em arquivos de implementação; não representam auditoria integral do código.

- **MNEME:** src/application/tradingService.ts separa o executor de simulação do modo real; src/application/settingsService.ts bloqueia modo real quando o ambiente não o permite; src/domain/policies.ts reúne regras puras de entrada e risco. O portfólio descreve pesquisa, sinais e execução com controles de risco, sem afirmar resultados financeiros.
- **Bank Reconciliation Engine:** backend/src/main/java/com/reconciliation/service/ConciliacaoService.java confirma importação OFX/CSV, correspondência por valor/tipo/data, tolerância de um dia, histórico de falhas e métricas. O README confirma o dashboard conectado à API.
- **Finance Sync API:** GoogleSheetsService.java e TransactionController.java confirmam um endpoint POST e a inclusão de cinco campos na aba Página1 do Google Sheets. O portfólio não atribui recursos além desse fluxo.
- **StreamHub:** apps/server/src/rooms.ts confirma convites separados, autorização por função e limite de cinco espectadores; apps/web/src/audio.ts confirma as opções de áudio e o tratamento de faixas indesejadas. O README documenta chamadas de voz opcionais e diagnósticos.
- **Lupa.NET:** backend/Analyzer.cs e docs/ARCHITECTURE.md confirmam inspeção estática de assemblies, C# reconstruído, IL, metadados e servidor local. O código da amostra não é executado.

Durante a revisão foi identificado um arquivo de credenciais de conta de serviço no repositório público Finance Sync API. O portfólio não utiliza, copia nem exibe esse arquivo. A chave precisa ser revogada no Google Cloud e substituída fora do Git.
