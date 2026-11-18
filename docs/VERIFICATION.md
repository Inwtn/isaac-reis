# Verificação da órbita

- `pnpm build`: produção e páginas estáticas.
- `pnpm verify`: rolagem por dois ciclos consecutivos, navegação direta para contato, um título principal, ausência de retrato e de overflow horizontal, movimento reduzido, conteúdo sem JavaScript e axe.
- As capturas ficam em `work/qa/orbit-*.png`.
- O teste de navegação é executado em Chromium; não representa uma sessão em aparelho físico.
