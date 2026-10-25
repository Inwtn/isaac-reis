# Análise local de SV com REA

Ferramenta: REA 6.7.0, distribuição oficial `rea-agents`, repositório https://github.com/morluto/rea.

Alvo: `C:/Program Files (x86)/Steam/steamapps/common/SV/Stardew Valley.dll`. A pasta contém MonoGame, xTile, bibliotecas .NET e recursos separados em `Content/Animals`, `Characters`, `Maps`, `TerrainFeatures` e `TileSheets`.

Foi executado `inspect-managed-members` selecionando `StardewValley.Character` e `StardewValley.FarmerSprite`, pelo provedor `rea-dotnet-static`. A inspeção leu metadados e âncoras CIL; não carregou nem executou a assembly. Os registros selecionados tiveram cobertura completa segundo o provedor; isso não significa análise completa do jogo.

## Evidências e aplicação

| Evidência encontrada | Decisão no portfólio |
| --- | --- |
| `Character.get_FacingDirection`, `set_FacingDirection`, `animateInFacingDirection` | Estado explícito de direção, com atlas de caminhada separado da posição |
| `Character.MovePosition`, `tryToMoveInDirection`, `updateMovement` | Atualização de movimento separada do desenho e colisões por região dos pés |
| `Character.GetBoundingBox` | Caixa de colisão pequena, enquanto o sprite visual pode ser maior |
| `Character.draw`, `drawAboveAlwaysFrontLayer`, `DrawShadow` | Desenho ordenado pela base dos objetos e sombras simples |
| `FarmerSprite.animate`, `animateOnce`, `animateBackwardsOnce` | Sequência de frames com estado parado e ciclo de caminhada |

Essas relações são referências arquiteturais. Os detalhes exatos de física, temporização, escala e estilo não foram demonstrados por essa seleção de metadados. A implementação web usa sua própria simulação fixa de 60 Hz, seus próprios sprites de personagem e gato, e um mapa de portfólio; não é uma tradução do código comercial.

A inspeção CIL foi aprofundada em dois métodos. `animateInFacingDirection` contém uma instrução `switch` com quatro destinos, corroborando a divisão por quatro direções. `GetBoundingBox` tem 31 instruções decodificadas, incluindo a criação de um retângulo e constantes 16 e 32; essas constantes isoladas não determinam o tamanho de todos os sprites. As arestas de chamadas de `tryToMoveInDirection`, `applyVelocity` e `MovePosition` apontam para `GameLocation.isCollidingPosition`, demonstrando a ligação entre movimento e colisão do cenário. Os tokens e as âncoras estão em `rea-summary.json`.

Identificador da evidência e hash do arquivo estão no resumo JSON. O resultado bruto, com CIL, está em `work/rea/sv-members.json` e permanece fora do repositório. A análise inicial não extraiu XNB. Na revisão visual solicitada depois, xnb.js foi usado separadamente para decodificar texturas de terreno, construções e árvores da mesma instalação. Elas estão no cenário, com procedência registrada em `sv-assets.json`. Não foram incorporados mapas completos, músicas, assemblies ou código do jogo.

## Revisão de interiores e montaria

Uma segunda inspeção estática com REA selecionou `StardewValley.Characters.Horse` e `StardewValley.Objects.Furniture`. Os identificadores e métodos selecionados estão em `rea-horse-furniture.json`; o resultado bruto fica em `work/rea/sv-horse-furniture.json`. As texturas de mobiliário, paredes/pisos e casa foram decodificadas separadamente com xnb.js. A montagem das salas e suas colisões são próprias do portfólio.

A orientação da faixa lateral do cavalo foi conferida visualmente no PNG nativo. A caminhada para a esquerda usa a faixa voltada para a direita com espelhamento horizontal explícito; o resultado não foi inferido apenas dos nomes de métodos do jogo.
