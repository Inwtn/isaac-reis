# Análise da referência — Daniel Ingrassia

Referência: https://ingrassiadaniel.it/
Inspeção em 23/10/2026. Este documento registra observações; não altera a implementação do portfólio.

## O que define a experiência

A página usa uma cena persistente de partículas, com mudanças de forma e enquadramento comandadas pela posição da rolagem. Texto, geometria, cursor e galeria têm estados coordenados. Repetir somente o busto e um fundo de pontos não reproduz essa experiência.

A impressão de uma etapa por scroll vem de uma sequência com trechos próximos à altura de uma tela e intervalos mais longos para cenas específicas. A transição não se resume a avançar slides: existem valores intermediários de transformação. Foi observado, por exemplo, um estado parcial de retrato entre o busto e a esfera. Ao voltar ao topo, a forma se recompõe progressivamente.

## Sequência da página inicial

| Etapa | Comportamento observado |
| --- | --- |
| Carregamento | Indicador percentual antes de a cena ficar pronta. |
| Identidade | Busto detalhado de partículas claras, fundo grafite, nome e profissão pequenos. No painel estreito, o nome fica no alto à esquerda e o cargo embaixo à direita. |
| Apresentação | O texto entra enquanto o busto muda de posição, escala e orientação. Existe sobreposição temporal; a cena anterior não simplesmente desaparece antes do texto. |
| Transformação em esfera | O retrato se reorganiza em uma esfera de partículas. Texto acompanha o contorno circular, comunicando disponibilidade e atuação global. |
| Localização | A esfera passa por uma configuração fragmentada/em camadas e chega a uma forma espacial associada à localização. Há uma seção própria de Itália e uma legenda sobre onde o profissional está baseado. Não foi extraída uma malha para confirmar a geometria cartográfica exata. |
| Como trabalha | Uma estrutura alongada e torcida de partículas atravessa a composição atrás do texto. O enquadramento continua variando durante a permanência da mensagem. |
| Entrada dos trabalhos | Um rótulo discreto introduz a galeria. A estrutura de partículas permanece atrás das prévias. |
| Galeria horizontal | A área permanece presa à tela enquanto a rolagem vertical movimenta horizontalmente quatro projetos. As prévias têm deformação ondulada; não são imagens imóveis dentro de caixas comuns. Cada uma tem nome e ano. |
| Saída da galeria | As prévias deixam a tela; uma frase final acompanha uma nuvem de partículas que aumenta e muda de configuração. |
| Contato | A nuvem se organiza em uma moldura retangular de partículas em torno do e-mail e do contato social. O rodapé contém identidade e links. |

## Medições da inspeção

Na aba observada, a viewport informada pelo DOM foi 503 × 524 px, e a página tinha aproximadamente 8961 px de altura. Os valores abaixo são amostras observadas, não especificações universais nem os limites exatos das animações.

| Scroll Y aproximado | Cena visível |
| --- | --- |
| 0 | Identidade e retrato, após acomodação da transição de retorno |
| 458 | Texto de apresentação com o busto reenquadrado |
| 618 | Transformação parcial entre retrato e esfera |
| 916 | Esfera com texto circular |
| 1374 | Forma intermediária fragmentada da localização |
| 1832 | Cena de localização |
| 2290 e 2748 | Texto sobre o trabalho e estrutura torcida |
| 3206 | Introdução da galeria |
| 4122 | Prévia de projeto entrando no enquadramento |
| 5038 | Duas prévias adjacentes com deformação ondulada |
| 5954 | Último trecho de projeto observado na sequência |
| 6870 e 7786 | Mensagem de saída e nuvem em transformação |
| 8437 | Contato com moldura de partículas |

Seções expostas no DOM: identidade, apresentação, mundo, Itália, modo de trabalho, galeria e contato. A galeria tem um intervalo de rolagem muito maior que as primeiras seções. Existem estados visuais intermediários dentro dessas seções, portanto contar tags de seção não equivale a contar cenas.

Foram observadas propriedades de progresso no elemento HTML para transformação do retrato e prontidão das cenas de globo, Itália e trabalho. O progresso do retrato assumiu um valor fracionário, confirmando que o comportamento é interpolado.

## Cursor e luz

### Confirmado por observação e estilos do DOM

- O cursor nativo é ocultado.
- O cursor personalizado tem uma cabeça em elemento DOM e um canvas próprio sobre a tela.
- No estado comum, a cabeça mede 8 × 8 px, com preenchimento claro e sombra luminosa de 10 px com expansão de 2 px.
- Sobre as prévias de projeto, passa a um círculo vazado de 40 × 40 px, com contorno claro fino, sem o preenchimento e o halo do estado comum.
- A posição do cursor é atualizada com coordenadas fracionárias. Junto ao comportamento visual, isso é consistente com acompanhamento suavizado.
- A cena apresenta diferenças de brilho entre regiões e uma resposta de enquadramento/orientação à interação; o cursor não é apenas o ponteiro padrão do navegador.

### Limites da conclusão

O halo do cursor é confirmado. Há também um canvas específico para seus efeitos. O mecanismo exato de iluminação das partículas, seu raio de influência, eventual rastro e fórmula de decaimento não foram confirmados pelo código de shaders. Tratar tudo como uma luz física 3D seria uma inferência, não uma conclusão desta inspeção.

Para reproduzir o resultado, vale tratar separadamente: núcleo luminoso do cursor, halo, acompanhamento suavizado, reação local das partículas e estado de hover dos elementos clicáveis. Um ponto branco que apenas segue o mouse cobre só parte da interação.

## Galeria

- São quatro trabalhos, com links próprios para páginas internas.
- O trilho horizontal muda de transformação durante o avanço vertical, enquanto as prévias permanecem aproximadamente na mesma faixa vertical.
- Na sequência inspecionada, os trabalhos atravessam o enquadramento de maneira coordenada com o scroll; não é uma lista vertical convencional.
- As superfícies das prévias apresentam bordas curvas e onduladas. O efeito deve ser tratado como deformação da superfície/imagem, não como uma simples rotação CSS.
- Nome e ano ficam junto à respectiva prévia.
- O cursor expandido informa que a superfície é clicável.

## Páginas internas

Foram abertas as quatro páginas: Lea Winery, Stephen Young, Fratelli Simonetti e Michael London. Elas compartilham a estrutura de conteúdo. A rolagem interna foi percorrida na página Lea Winery; as demais foram verificadas pelo conteúdo e navegação expostos na página.

Estrutura comum: retorno aos trabalhos, título e ano, prévia grande, apresentação do projeto, autoria/colaboração, descrição técnica, tecnologias, acesso ao site publicado e contato final. Na página interna percorrida, o fundo de partículas persiste enquanto o conteúdo segue uma leitura vertical.

As tecnologias citadas nos textos dos estudos de caso descrevem os projetos apresentados. Não devem ser automaticamente atribuídas à implementação do próprio portfólio de Daniel.

## Diferenças registradas antes da implementação da sequência

1. Falta uma linha do tempo central que coordene todas as transformações.
2. A versão local dissolve o busto em partículas dispersas, mas não executa a sequência esfera → localização → estrutura torcida → nuvem → moldura de contato.
3. Nome, cargo e textos não têm a mesma coreografia de câmera e entrada/saída.
4. Falta o sistema de cursor personalizado com estados de halo e anel.
5. Falta uma resposta local de luz/proximidade das partículas, ajustada visualmente.
6. Os projetos locais são uma lista vertical com ornamentos; a referência usa galeria horizontal presa à rolagem, com prévias deformáveis.
7. O contato local não tem a transformação da nuvem em moldura.
8. Os links locais levam diretamente a repositórios/sites; a referência possui estudos de caso internos.

## Ordem de implementação recomendada

1. Definir uma linha do tempo de progresso e os estados completos das cenas.
2. Preparar distribuições de pontos compatíveis para retrato, esfera, localização, estrutura torcida e moldura.
3. Implementar interpolação das formas junto com posição, escala e orientação da câmera.
4. Sincronizar os textos com essa linha do tempo.
5. Implementar cursor luminoso e estados de hover; calibrar sua reação com as partículas.
6. Construir a galeria horizontal e a deformação das prévias.
7. Integrar encerramento, contato e estudos de caso.
8. Conferir visualmente as etapas e os estados intermediários, inclusive no retorno da rolagem e em tamanhos diferentes de tela.

Essa ordem corrige a estrutura da experiência antes de polir efeitos isolados. Os parâmetros exatos precisam ser calibrados por comparação visual, não somente por testes de execução.

### Observação sobre o botão de retorno

Ao abrir Lea Winery diretamente em uma nova aba e acionar o retorno, a navegação voltou para `about:blank`, que era a entrada anterior daquela aba. Esse teste é consistente com retorno pelo histórico do navegador. Não confirma que uma entrada direta na página de projeto sempre terá um destino útil. Para a adaptação local, convém definir um destino explícito para a galeria quando não houver histórico interno e preservar o progresso da galeria quando houver.


## Implementação da sequência

A versão local agora inclui seis formas de partículas (retrato, esfera, Brasil, estrutura torcida, nuvem e moldura), interpolação reversível por posição de rolagem, cursor com halo e estado de hover, resposta de proximidade, galeria horizontal com distorção e estudos de caso em janelas nativas. Os estudos visuais dos projetos são composições próprias, não capturas dos produtos publicados. A projeção e a lógica foram verificadas em testes e prévias estáticas do mesmo motor de cenas; isso não equivale a uma captura ou inspeção visual completa da página no navegador.

## Revisão com REA e artefatos públicos

A inspeção estática esclareceu que a estrutura é uma dupla hélice com conexões e que a forma de encerramento é sua reorientação em túnel, com profundidade em perspectiva. A implementação local foi corrigida nesses dois pontos. O brilho agora altera a intensidade sem repelir os pontos, e o rastro do cursor usa uma faixa luminosa com expiração de 150 ms. O mapa de controles, a galeria de vídeo deformada e os limites da investigação estão em [research/rea/SCROLL-MAP.md](research/rea/SCROLL-MAP.md). As ferramentas REA foram usadas por transporte MCP stdio local; continuam ausentes do catálogo nativo do chat mesmo após o reinício informado.
