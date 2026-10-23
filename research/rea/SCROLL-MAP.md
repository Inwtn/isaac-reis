# Mapa de funcionamento — Daniel Ingrassia

Alvo: https://ingrassiadaniel.it/ · inspeção em 23/10/2026.

Este mapa combina a inspeção visual anterior da página com leitura estática dos JavaScripts públicos coletados. As chamadas REA passaram pelo transporte MCP stdio local. Não houve captura de execução pelo REA nem comprovação de todos os caminhos dinâmicos.

## Sequência de rolagem

O componente de partículas calcula progresso a partir de `scrollY / innerHeight`. Os três primeiros controles usam `smoothstep` cúbico, mantendo os mesmos índices de partículas entre as formas. A rolagem de volta recalcula o progresso, em vez de depender de uma animação que dispara uma única vez.

| Trecho | Controle encontrado | Comportamento |
| --- | --- | --- |
| Abertura | `uFormation`, posição e escala do grupo | Os pontos dispersos formam o retrato. A cabeça tem movimento lento contínuo e acompanhamento limitado do mouse. |
| Introdução | escala, deslocamento e rotação do grupo | O retrato cresce, desloca e gira enquanto o texto ocupa o espaço livre. |
| Retrato → globo | `uMorph` | Interpolação entre o retrato e uma esfera distribuída por espiral de Fibonacci. |
| Globo → localização | `uMorph2` | Interpolação para os pontos do mapa da Itália. |
| Localização → abordagem | `uMorph3` | Os pontos tornam-se uma dupla hélice horizontal com conexões entre as duas hastes. |
| Abordagem → trabalhos | `uWorkSlide` | A hélice desliza sobre seu eixo, gira e participa de uma mudança de câmera. |
| Galeria | transformação horizontal do trilho | A distância vertical percorrida determina o deslocamento horizontal dos projetos. |
| Encerramento da galeria | `uMorph4` / `__playgroundClosing` | A hélice é reorientada para a profundidade; a câmera em perspectiva produz o túnel. |
| Contato | `uMorph5`, `uOutlineRect` | Os pontos do túnel formam uma moldura em torno do retângulo medido do e-mail. |

Valores **padrão do componente**, não valores medidos de cada frame: primeiro morph entre 1 e 2 alturas de viewport; segundo entre 2 e 3; terceiro entre 3 e 4. O deslocamento da abordagem tem distância padrão de 2,5 alturas. Uma configuração passada pelo chamador pode substituir esses padrões; a investigação atual não demonstrou todos os valores efetivos dessa configuração.

`--globe-ready`, `--italy-ready` e `--work-ready` são calculados a partir desses morphs para sincronizar os elementos HTML com a cena. A presença dessas propriedades não transforma o canvas em elementos HTML separados: o desenho permanece na cena de pontos.

## Hélice, túnel e turbulência

A hélice possui dois conjuntos de pontos em lados opostos de uma seção circular e um conjunto de pontos entre eles. Aproximadamente um sexto dos índices é reservado às conexões. As conexões são distribuídas em 24 posições ao longo do eixo. A distribuição é embaralhada para não concentrar um papel visual em uma região do retrato.

A velocidade de rolagem também alimenta `uTurbulence`: velocidade absoluta normalizada por 2.400 px/s e suavização exponencial com tempo de 0,15 s no trecho inspecionado. No shader, essa intensidade amplia a dispersão radial/angular da hélice. O túnel reaproveita a organização de duas hastes e conexões, com o eixo orientado em Z e perspectiva.

Esses fatos corrigem a leitura visual inicial de uma simples nuvem/anel no encerramento.

## Cursor e iluminação

O cursor usa uma cabeça em elemento DOM e um rastro separado em canvas. A cabeça converge 28% da distância restante por frame no código da referência. O modo personalizado depende de ponteiro preciso, hover disponível e ausência da preferência de movimento reduzido.

O rastro guarda pontos durante 150 ms e só adiciona uma nova amostra após movimento de pelo menos 1,5 px. O desenho é uma faixa preenchida com gradiente, largura variável e desfoque luminoso de 10 px. Assim, a cauda desaparece mesmo quando o mouse fica parado. Links, botões e elementos com `data-cursor` ativam o estado de hover. A inspeção anterior dos estilos confirmou cabeça de 8 px e anel de hover de 40 px.

O brilho das partículas é calculado pela distância ao mouse **após a projeção na tela**, com correção de aspecto horizontal. Há uma influência suave dentro do raio configurado e uma multiplicação da intensidade das partículas. Não foi identificado, nesse trecho, um sistema de luz física com sombras. O shader também aplica cintilação temporal e exposição. Os padrões do componente são intensidade 2, raio 1 em coordenadas normalizadas e exposição 0,5.

O movimento da cabeça/cena em resposta ao mouse tem parâmetros separados do cursor: acompanhamento padrão de 0,35 s, retorno de 1,1 s e limites de rotação. Esses valores não devem ser confundidos com os 28% por frame do elemento DOM.

## Galeria e superfícies

Cada prévia usa uma malha `PlaneGeometry` de 32 × 18 segmentos, câmera ortográfica e textura de vídeo. A malha é alterada em X/Y; não é somente um retângulo rodando em CSS. A textura mantém o recorte correspondente ao formato da prévia.

A energia de rolagem vem de `abs(deltaScroll) / deltaTempoEmMs / 3`, limitada a 1 e suavizada. O hover adiciona uma segunda contribuição à deformação. A amplitude aumenta em direção às extremidades da superfície, mantendo uma região central mais estável. A textura e a malha permanecem vinculadas, por isso a imagem acompanha as bordas deformadas.

O trilho usa uma curva de progresso de quinta ordem. Sua origem calculada é negativa e o destino positivo: no trecho analisado, as prévias atravessam a tela da esquerda para a direita. A apresentação visual anterior, com o quarto projeto aparecendo antes dos primeiros, é consistente com essa direção.

O layout considera largura de 50vw em paisagem e 85vw em retrato, com espaçamento de 12vw na fórmula de deslocamento. O avanço em retrato usa fator 0,6. O encerramento começa após 60% do percurso em paisagem ou 40% em retrato. Esses valores vêm das fórmulas do bundle, não de uma medição de todas as combinações de viewport.

Vídeos são preparados antes de uso, iniciados quando visíveis e pausados fora da área relevante. As páginas internas compartilham título/ano, apresentação visual, descrição, tecnologias e links. A inspeção visual completa de scroll interno foi feita na página Lea Winery; as demais foram abertas e verificadas pelo conteúdo exposto.

## Evidência, localização e limites

- Análise REA principal: `ev_96a9e083b97e082f70f8b1ec11924221eb875fbaccf0b0389891f941f743c8e6`.
- Bundle principal: `site/1stl4ykwpf_a2.js`, SHA-256 `b31e7555cb9fa6aba273fceeab940b172e1dea0a9b697a7bfbc1249573d90a88`.
- Nesse bundle: cursor a partir do offset aproximado 3.200; padrões do componente 28.300; loop de atualização 33.900; controle dos morphs 34.500; moldura do contato 37.000. Offsets são de caracteres, base zero, da versão local coletada.
- Galeria: `site/1tzay28hfjym9.js`, SHA-256 `8994f1ca5f7b799ff9dfb6befc5b9057b7df021426c56ca96395a8f9d82eb22e`; deformação entre aproximadamente 4.000–6.400; layout e progresso entre 6.400–9.900.
- Os shaders extraídos guardam proveniência em `shaders/provenance.json`. A leitura de seus textos foi inspeção estática auxiliar, distinta do grafo produzido pelo REA.
- Consultas por strings/eventos não encontraram correspondências no grafo parcial. Isso não demonstra ausência dos recursos, que aparecem no texto dos artefatos.
- Consultas semânticas por IDs exatos localizaram as escritas de `uMorph`, `uGlow` e `__playgroundClosing`. Cada consulta retornou um nó, uma função e um módulo, mas **zero relações percorridas**. Portanto, o REA não demonstrou uma cadeia completa de eventos até renderização. Resultados: `semantic-node-scroll.json`, `semantic-node-light.json` e `semantic-node-gallery.json`.

## Adaptação local após esta investigação

O motor local agora usa dupla hélice com conexões, túnel em perspectiva, brilho suave que altera intensidade sem repelir os pontos e rastro luminoso com expiração temporal. As fórmulas locais são uma reconstrução própria; os shaders extraídos da referência não foram incorporados ao produto.

Persistem diferenças: galeria local com filtro SVG em vez de malha de vídeo, sentido de percurso diferente, retrato genérico licenciado, mapa do Brasil, enquadramentos aproximados e estudos de caso em dialog em vez de rotas. A página local ainda precisa de comparação visual completa no navegador. As prévias PNG mostram a geometria do mesmo motor, não uma captura da página.
