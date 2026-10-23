# REA — conexão e primeira análise do site

Alvo: https://ingrassiadaniel.it/
Data: 23/10/2026.

## Estado da integração

- REA **6.7.0**, instalado em `C:/Users/isaac.almeida_3dlab/.codex/tools/rea`.
- Registro stdio adicionado ao `C:/Users/isaac.almeida_3dlab/.codex/config.toml`.
- Backup criado em `C:/Users/isaac.almeida_3dlab/.codex/config.toml.rea.backup`.
- Instruções correspondentes instaladas em `C:/Users/isaac.almeida_3dlab/.agents/skills/reverse-engineer-anything`.
- Servidor validado por um cliente MCP local sobre stdin/stdout: protocolo negociado `2025-11-25`, identificação `rea / 6.7.0`, **207 ferramentas anunciadas**.
- Chamada real de `binary_session` concluída sem erro.
- Chamada real de `analyze_javascript_application` e exportação das evidências concluídas sem erro.

Isso verifica o servidor e as chamadas MCP feitas pelo cliente local de diagnóstico. Após o usuário informar que reiniciou o aplicativo, as ferramentas REA continuaram ausentes do catálogo nativo deste chat. Os logs de inicialização disponíveis mostram os servidores do aplicativo, mas não registram uma tentativa de iniciar `rea` nem um erro específico desse servidor. Portanto, a causa da ausência nativa continua indeterminada; não foi repetida a instalação nem solicitado outro reinício como solução presumida.

A investigação continuou pela conexão MCP stdio já validada. As evidências anteriores foram importadas sem repetir a análise. O mapa detalhado está em [SCROLL-MAP.md](SCROLL-MAP.md).

O teste de protocolo pode ser repetido com `node scripts/rea-mcp-check.cjs`. O comando usa a instalação local registrada, não instala outra versão.

## Coleta e escopo

O inventário `pageAssets` da aba aberta identificou 14 scripts. Foram baixados apenas os **12 scripts do próprio domínio**, com URLs observadas nesse inventário. Os dois scripts de terceiros ficaram fora da coleta. Manifesto: `site-manifest.json`; identidades de conteúdo: `site-hashes.json`.

A análise do REA selecionou especificamente `1stl4ykwpf_a2.js` e `1tzay28hfjym9.js`, que contêm os estados de partículas/cursor e componentes relacionados. Os scripts foram tratados como texto inerte. Eles não foram executados pela análise.

Resultado: dois JavaScripts interpretados pelo analisador, 78.393 bytes lidos, 17.004 nós de AST visitados e nenhuma falha de parsing. Dez arquivos inventariados não foram incluídos nessa análise. As relações semânticas são parciais, especialmente por chamadas dinâmicas e nomes minificados; um fato ausente do resultado não prova ausência no site.

Evidência principal de análise:
`ev_96a9e083b97e082f70f8b1ec11924221eb875fbaccf0b0389891f941f743c8e6`.

Resumo da evidência:
`ev_630ac823f8f0e4a8a21fbe985b9fd352bf839088473f4652f4220645ed4b9ebf`.

Arquivos locais: `site-analysis-verified.json`, `site-evidence-verified.json`, `site-evidence-export-verified.json`.

## Achados estáticos confirmados nos scripts coletados

### Partículas e transformações

O shader de vértices contém cinco controles independentes, de `uMorph` até `uMorph5`. A expressão de composição interpola sucessivamente entre a posição do retrato, o globo, a Itália, uma forma ondulada, uma espiral e o contorno de contato. Isso confirma a arquitetura de transformação das posições; uma simples dissolução em pontos aleatórios não representa o mecanismo inteiro.

Atributos próprios armazenam os destinos de globo e Itália. Parâmetros separados controlam tamanho das partículas, formação, turbulência, tempo e enquadramento em orientação retrato. O material usa pontos com mistura aditiva e escrita de profundidade desligada.

### Luz próxima ao cursor

O shader projeta cada partícula para coordenadas normalizadas da tela, subtrai a posição do cursor e corrige a distância horizontal pelo aspecto da viewport. Uma transição suave dentro de `uGlowRadius`, multiplicada pela intensidade `uGlow` e pelo progresso de formação, produz a influência local.

A influência aumenta a intensidade/alpha da partícula. Existe também cintilação temporal. Cor e exposição são aplicadas no shader de fragmentos. Portanto, o efeito observado pode ser descrito com precisão como brilho local por proximidade na tela; não é necessário presumir uma luz física com sombras no espaço 3D.

### Cursor

O cursor tem um elemento para a cabeça e um canvas para o rastro. A posição da cabeça converge 28% da distância restante a cada atualização de frame no trecho inspecionado. O estado de hover é acionado para links, botões e elementos com `data-cursor`. O desenho do rastro usa preenchimento e desfoque de sombra no canvas.

As dimensões de 8 px para o ponto comum e 40 px para o anel em hover já haviam sido verificadas nos estilos da página durante a inspeção visual anterior. A análise dos scripts agora complementa essa observação com o mecanismo de acompanhamento e o tratamento de hover.

### Moldura do contato

A moldura é parametrizada pelos limites do retângulo do e-mail. O código converte limites de tela para coordenadas da cena antes de atualizar `uOutlineRect`. O shader distribui partículas ao longo do perímetro com proporções correspondentes aos comprimentos das arestas e aplica espalhamento próprio dessa forma. Não se trata de uma borda CSS independente da nuvem.

## Origem e limites dos shaders extraídos

`shaders/particles-vertex.glsl` e `shaders/particles-fragment.glsl` foram extraídos das literais de string da AST do bundle, sem executá-lo. A extração foi uma inspeção local auxiliar, distinta das chamadas do REA. `shaders/provenance.json` guarda arquivo, intervalo de caracteres e SHA-256 do bundle. Os arquivos são material de pesquisa; não foram incorporados ao código do portfólio.

## Falha de ambiente e recuperação

A primeira tentativa do analisador não conseguiu acessar um arquivo temporário do sandbox (`EPERM`). Essa falha e a falha da primeira exportação foram preservadas em `site-analysis-summary.json` e `site-evidence-export.json`. A mesma análise, com permissão de execução fora do sandbox e o mesmo escopo de dois arquivos, concluiu e exportou as evidências verificadas.

## O que ainda não foi confirmado

- A análise via REA deste passo é estática, não um registro de execução do site.
- A aba do navegador integrado não forneceu um endpoint CDP público para a conexão passiva do REA. Não foi inventado um endereço nem aberto um navegador com depuração silenciosamente.
- Capturas de execução, cobertura de funções e associação de eventos aos frames precisam de uma sessão de navegador elegível para o REA.
- As observações visuais anteriores da rolagem continuam documentadas em `REFERENCE-ANALYSIS.md`; não foram reclassificadas como evidências de runtime produzidas pelo REA.
- Dez scripts ficaram fora do escopo semântico inicial. Relações por meio deles continuam desconhecidas.

## Próxima investigação

Para execução passiva, primeiro selecionar um navegador com endpoint CDP conhecido e listar seus alvos, restringindo a origem a `https://ingrassiadaniel.it`. Para continuar estaticamente, importar o pacote de evidências ou consultar os artefatos coletados antes de repetir a análise. A conexão nativa do chat ainda exige diagnóstico específico do cliente; o servidor local já responde e não precisa ser reinstalado.

## Continuação após o reinício

As consultas por strings e eventos não encontraram sementes nos grafos parciais. Foram preservadas, sem interpretar esse resultado como ausência dos recursos. A consulta de `trace_javascript_semantics` por IDs exatos encontrou os nós das escritas de `uMorph`, `uGlow` e `__playgroundClosing`, mas não percorreu relações adicionais. Esses resultados não comprovam um caminho completo nem execução em runtime.

- Morph: `ev_31d92f17caee8839466b0c4d040663d11be7d0e63da1b261d1d17d2672a711ff`.
- Luz: `ev_4d2a3c75d7ae1275631c3aba59c07631ea556e9c04590f9bafebab56781c23f3`.
- Encerramento da galeria: `ev_738541873d5db8f2c621d12d38cd5e1f3ae50e168b1ae3b4e15c4609157c681a`.

A leitura auxiliar dos artefatos confirmou a dupla hélice com conexões, sua reorientação em túnel, o rastro de cursor de 150 ms e a deformação geométrica das prévias de vídeo. O portfólio local recebeu uma reconstrução própria da hélice/túnel e do rastro; os shaders de pesquisa continuam separados do produto. Testes de projeção e execução simulada passaram para WebGL, fallback Canvas e falha de shader. A inspeção visual completa da página local permanece pendente.

Referências de instalação: https://github.com/morluto/rea e https://learn.chatgpt.com/docs/extend/mcp?surface=cli .
