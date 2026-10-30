# Vale de Isaac

Portfólio em forma de jogo 2D no navegador, com Canvas e JavaScript, empacotado por Vite. O cenário usa texturas PNG extraídas da instalação SV fornecida pelo usuário. Personagem e gato são desenhados por código em atlas offscreen separados. Nenhum executável de Stardew Valley é carregado pelo navegador. A interface e o conteúdo profissional estão em inglês.

## Rodar

Com Node.js 22.12+ ou 24 instalado:

```sh
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. Não abra o `index.html` por `file://`, pois o projeto usa módulos JavaScript.

```sh
npm test
npm run build
npm run preview
```

Se você usa pnpm, os comandos equivalentes são `pnpm install`, `pnpm dev`, `pnpm test` e `pnpm build`. O lockfile incluído é do pnpm.

## Editar

- `src/content.js`: todos os textos profissionais, projetos, links, certificações e habilidades. Os níveis em pontos são sugestões visuais editáveis.
- `src/map.js`: casas, portas, obstáculos e dimensões do mundo.
- `src/sprites.js`: paleta e atlas animados de personagem e gato, além da composição das árvores de referência. O gato mantém os pixels inteiros. `src/avatar.js` desenha o personagem em pixel art com oito poses de caminhada e cores personalizáveis; `src/actor-animation.js` controla as poses e o espelhamento do cavalo.
- `src/main.js`: cenário, câmera, ordenação por profundidade, simulação, gato seguidor e sons sintetizados.
- `src/input.js`: teclado e joystick por arraste.
- `src/panels.js`: conteúdo dos painéis e foco do diálogo.
- `src/loading.js`: progresso real das etapas e tela inicial.
- `src/style.css`: molduras, HUD e responsividade.
- `public/curriculo.pdf`: currículo atual fornecido pelo Isaac.
- `public/gato.svg`: favicon.

O personagem foi personalizado pela referência enviada (cabelo curto preto, óculos, barba curta, roupa preta e tênis branco). Fofão usa as fotos do gato como referência: pelagem creme clara, orelhas rosadas, olhos azuis e cauda volumosa. Os certificados sem URL de validação são apresentados com instituição e descrição, sem links inventados. O currículo precisa ser substituído quando houver uma versão nova.

`simples.html` é a alternativa de leitura. `scripts/prerender.mjs` gera seu HTML completo a partir do mesmo conteúdo antes de cada build, para leitura sem JavaScript e indexação.

## Publicar

Netlify ou Vercel: importe o repositório, use `npm run build` como comando e `dist` como pasta de saída. Não há backend nem variáveis secretas.

GitHub Pages: gere `dist` e publique seu conteúdo por uma GitHub Action ou pela ferramenta de deploy escolhida. `base: './'` mantém os caminhos dos bundles relativos. A página inicial é `index.html` e a alternativa é `simples.html`.

## Análise do jogo de referência

Veja `docs/analise-sv.md` e `docs/rea-summary.json`. O REA foi executado localmente apenas para inspeção estática. A instalação do jogo não foi alterada. As ferramentas e os resultados brutos estão em `work/`, ignorado pelo Git.

## Recursos de referência

`src/assets/sv/` contém texturas do Stardew Valley da instalação fornecida, decodificadas com xnb.js. Origem e hashes estão em `docs/sv-assets.json`. Esses recursos pertencem ao jogo e não são arte original do portfólio nem recebem uma nova licença neste projeto. A análise estática com REA continua documentada em `docs/analise-sv.md`.

O personagem usa oito poses de caminhada por direção e o gato mantém oito quadros. Ambas as animações avançam pela distância percorrida, e o gato segue uma fila contínua de posições. Os sprites são desenhos próprios baseados nas referências enviadas.

## Exploração e minijogo

- O mundo tem 1120 × 800 pixels, caminhos sinuosos, um lago arredondado, um bosque e uma horta.
- E / Enter entra nas casas com transição. Dentro delas, caminhe até uma mesa, computador ou certificado e use E para inspecionar aquele conteúdo. A porta inferior retorna ao mapa.
- Os atalhos inferiores levam diretamente ao interior de cada casa.
- E perto do cavalo permite montar; E novamente desmonta. A montaria espera onde foi deixada. Desmonte para entrar em uma casa.
- Na horta: E planta uma semente gratuita, E rega e, após 35 segundos de jogo, E colhe e ganha 15 moedas. Três cenouras já começam maduras para experimentar. As plantas e moedas ficam salvas neste navegador; o crescimento pausa quando a página está fechada.
- `src/interiors.js` define os ambientes e exposições; `src/farming.js` controla o cultivo e o salvamento.
- `src/music.js` contém uma composição instrumental original de 32 compassos a 76 BPM, sintetizada por Web Audio: melodia suave, arpejos e baixo. Começa após a ação de entrar no jogo, possui botão para silenciar e pausa quando a aba fica oculta. Não depende de MP3 externo.

## Conteúdo detalhado

`src/professional-details.js` contém os dois projetos e as três experiências profissionais completas. Os painéis incluem problema, fluxo, arquitetura, funcionalidades e exemplos; as experiências trazem responsabilidades e tecnologias. As fontes estão em `docs/content-sources.md`. Os interiores usam móveis e superfícies nativos documentados em `docs/sv-assets.json`, com colisões e profundidade próprias.

## Personagem do visitante

Antes de entrar no mapa, o visitante monta seu próprio personagem em pixel art, com modelo masculino ou feminino: cabelo (raspado, curto, cacheado, longo ou sem cabelo), tom de pele, cores do cabelo, camisa, calça e sapatos, óculos e barba. O nome é opcional. `src/avatar-options.js` valida e salva as escolhas localmente; `src/avatar-editor.js` apresenta uma prévia animada. O botão Character reabre o editor durante o jogo. Nenhum nome ou escolha é enviado a um servidor.

As placas e os títulos dos interiores usam texto HTML em `src/interior-labels.js`, posicionado junto dos objetos do mapa. Isso mantém a fonte legível sem a pixelização do canvas. Os certificados continuam com os títulos completos nos painéis; nomes curtos nas placas evitam blocos excessivos de texto.
