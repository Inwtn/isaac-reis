# Isaac Almeida — Portfólio

Portfólio em Next.js com uma cidade espacial em pixel art desenhada em Canvas 2D. A rolagem move as camadas da cidade, do terreno e das estrelas. Depois do contato, a travessia recomeça. Os três sinais opcionais ficam salvos no mesmo navegador.

```sh
pnpm install
pnpm dev
```

Abra http://127.0.0.1:3000. Para validar a produção, execute `pnpm build`, inicie `pnpm start` e rode `pnpm verify` em outro terminal.

O site abre em português em `/` e tem versão inglesa em `/en`. O seletor no cabeçalho troca de idioma e mantém a seção em que o visitante está.

- Edite perfil e contato em `content/site.ts`.
- Edite a lista e os detalhes dos trabalhos em `content/projects.ts`.
- A arte está em `src/components/pixel-world.ts`, a coleção em `src/components/Journey.tsx` e o layout em `app/orbit.module.css`.

Com movimento reduzido, o cenário fica estático e a página termina no contato. Links diretos como `/#contact` funcionam sem JavaScript.
