# Isaac Reis — portfólio

Checkpoint do trabalho de 23/10/2026. O pedido atual é reproduzir fielmente a experiência de https://ingrassiadaniel.it/, mantendo o nome e os contatos de Isaac.

**A implementação está em andamento.** Leia [CONTINUAR-NO-CODEX.md](CONTINUAR-NO-CODEX.md) antes de continuar. O checkpoint não significa que a fidelidade visual foi aprovada.

## Abrir em outro computador

```sh
git clone --branch codex/portfolio-replica https://github.com/Inwtn/isaac-reis.git
cd isaac-reis
```

Abra essa pasta como projeto no Codex e peça para continuar seguindo `CONTINUAR-NO-CODEX.md`.

O site é estático. Os arquivos de execução já estão no repositório; não é necessário reconstruir os módulos para começar. Para prévia em um navegador comum, use um servidor estático de desenvolvimento, por exemplo `python -m http.server 8080`, se o Python estiver instalado, e visite `http://localhost:8080`. Vídeos/texturas WebGL precisam de verificação especial quando a página é aberta diretamente por `file://`.

## Arquivos ativos

- `index.html`: composição da referência com nome e contatos locais.
- `replica-runtime.js`: adaptador DOM para os componentes selecionados.
- `replica.js` e `replica.css`: integração, galeria, navegação e ajustes locais.
- `assets/replica/`: fonte, estilos, partículas, vídeos e módulos selecionados da referência. A proveniência está em `PROVENANCE.json`.
- `research/rea/`: evidências da investigação e os scripts públicos coletados.
- `scripts/`: construção, inspeção e verificação.

Os arquivos `atelier.js`, `atelier.css` e `journey-core.js` preservam a implementação anterior; o HTML atual carrega a versão `replica`.

## Verificação disponível

```sh
node scripts/check-replica.cjs
```

Isso verifica a integridade dos arquivos e o carregamento dos módulos, sem substituir a inspeção visual no navegador. O retrato e os quatro projetos atualmente exibidos são materiais da referência solicitada; a autoria original deve permanecer identificada, e esses projetos não representam trabalhos pessoais de Isaac.
