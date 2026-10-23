# Continuação em outro computador

## Pedido e prioridade

O usuário quer um portfólio artístico e tecnológico **idêntico visualmente e nas interações** a https://ingrassiadaniel.it/. Ele rejeitou aproximações anteriores, em especial o retrato fraco, cenas genéricas e projetos em cartões quadrados. A última solicitação foi salvar todo o trabalho na nuvem para continuar no Codex em casa.

Repositório: `https://github.com/Inwtn/isaac-reis`.
Branch deste checkpoint: `codex/portfolio-replica`.

Não interpretar os testes matemáticos ou o uso dos arquivos originais como confirmação de equivalência visual. A revisão final no navegador continua necessária.

## Estado da implementação

O `index.html` atual foi reconstruído a partir do HTML público da referência, preservando suas classes e composição. Nome, cargo e contatos foram trocados para Isaac Reis / Software Engineer / `isaacreis.dev@gmail.com` / LinkedIn de Isaac. A referência visual usa a mesma fonte Inter Tight e o fundo `#222124`.

Os módulos públicos selecionados, extraídos dos bundles, estão em `assets/replica/reference-modules.js`. Incluem Three.js, a cena original de partículas/shaders, cursor/rastro, revelação de textos, Lenis, superfície deformável de vídeo e efeito de desintegração. O arquivo `replica-runtime.js` é um adaptador DOM para os componentes que usam refs e effects; não é uma implementação geral do React.

`replica.js` monta a cena, a galeria horizontal com quatro vídeos e o contato. A cena usa os parâmetros reais encontrados no HTML de produção:

```json
{
  "horizontalOffset": 0.15,
  "bottomOffset": -0.09,
  "formationDuration": 4,
  "morphDistance": 0.6,
  "morphStart2": 2.3,
  "morphDistance2": 0.7,
  "morphStart3": 3.4,
  "morphDistance3": 0.6,
  "workSlideDistance": 1.5
}
```

`portrait.bin`, `italy.bin`, fonte e quatro vídeos foram baixados dos URLs públicos observados. Os binários de partículas também foram empacotados como data URLs em `particle-data.js`, para evitar fetch de arquivos locais. A proveniência e as alterações dos módulos estão em `assets/replica/PROVENANCE.json`.

**Importante:** o retrato e os projetos são da referência; não são foto nem trabalhos pessoais de Isaac. A cópia está sendo tratada como reprodução local da referência solicitada. Não publicar atribuindo esses trabalhos a Isaac.

## O que precisa ser concluído

1. Abrir a prévia em uma superfície autorizada e verificar a inicialização completa, erros de console, shaders e vídeos. O carregamento dos módulos foi testado em VM, mas a cena atual ainda não foi validada visualmente no navegador.
2. Comparar as etapas em paisagem e retrato com a referência, incluindo progressos intermediários e rolagem de volta. O pedido exige precisão de aparência e comportamento.
3. Verificar compatibilidade dos vídeos/texturas com `file://`. O módulo original define `crossOrigin="anonymous"`; uma prévia HTTP evita as restrições de origem próprias de arquivos locais. Não presumir que os vídeos WebGL funcionarão diretamente por arquivo sem testar.
4. Substituir a página interna simplificada de `openProject` em `replica.js` pela composição exata dos projetos. O HTML público de todas as quatro páginas já está salvo em `research/rea/project-*.html` e usa vídeos já presentes. Os estilos das páginas estão no CSS coletado.
5. Igualar o preloader. O atual é simplificado, com contagem linear e duração menor. O módulo original 73714 tem contagem cúbica iniciada em 3,5 s, contador em 3 s, animação de 2 s, esperas de 0,5 s e 0,4 s e transição do anel em mais 2 s. O código está no bundle coletado `1stl4ykwpf_a2.js`.
6. Conferir entrada/saída dos projetos, restauração do progresso da galeria e contato nas páginas internas. O estado do canvas é preservado, mas a navegação local por hash é uma adaptação.
7. Verificar degradação sem WebGL e preferências de movimento reduzido. A versão anterior tinha fallback Canvas; a versão atual usa o tratamento do módulo original e precisa ser revisada nesse cenário.

## Pesquisa já realizada

- `REFERENCE-ANALYSIS.md`: observações visuais originais e sequência de trabalho.
- `research/rea/SCROLL-MAP.md`: controles de rolagem, câmera, iluminação, galeria e limites da evidência. A seção final sobre a implementação local descreve a versão anterior; o estado mais recente é este documento.
- `research/rea/README.md`: instalação/validação do REA e identidades das evidências.
- `research/rea/site/`: os 12 JavaScripts públicos coletados.
- `research/rea/site-evidence-verified.json`: pacote completo de evidências estáticas exportado do REA.
- `research/rea/shaders/`: shaders extraídos e sua proveniência.
- `research/rea/reference-home.html`: HTML de produção usado nesta reprodução.
- `research/rea/reference-flight.txt`: conteúdo de dados inicial, tratado como texto/JSON, não executado.

O REA 6.7.0 foi instalado apenas no computador do trabalho, fora deste repositório. A conexão MCP stdio local foi validada e anunciou 207 ferramentas. As ferramentas não apareceram no catálogo nativo do chat mesmo após reinício. O pacote de evidências pode ser importado em uma instalação do REA em casa. Não reinstalar às cegas nem presumir uma conexão nativa ativa. Os caminhos absolutos presentes nas evidências e nos scripts de diagnóstico refletem o computador anterior.

## Verificações realizadas e limites

- A versão anterior (`atelier`) passou nos testes de seis formas, interpolação reversível, projeção móvel/desktop, luz, galeria, casos e fallback.
- A versão atual (`replica`) passou na análise sintática e carregou em VM os módulos Three.js, renderer, partículas, cursor, textos, Lenis, vídeo e desintegração.
- `scripts/check-replica.cjs` registra os testes de integridade aplicáveis ao checkpoint atual.
- Os testes antigos `check-journey.cjs` e `check-app.cjs` continuam úteis para a implementação anterior, mas suas expectativas de HTML não são a especificação do novo `index.html`.
- A ferramenta de navegador no computador anterior bloqueou a inspeção da página `file://`. Esse bloqueio não foi contornado com outro mecanismo ou endpoint. Na nova sessão, usar apenas as superfícies e permissões disponíveis e relatar qualquer limite real de verificação.

## Como retomar

Abra esta pasta no Codex de casa e envie:

> Leia CONTINUAR-NO-CODEX.md e continue a reprodução fiel de https://ingrassiadaniel.it/. Confira primeiro a inicialização real da versão replica, depois termine as páginas internas e o preloader e compare visualmente todas as etapas. Preserve meus arquivos e os resultados da pesquisa.
