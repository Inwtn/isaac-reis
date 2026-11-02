# Event Horizon · art direction

The approved proposal combines Event Horizon's entrance, Monolith's presentation of individual projects, and Signal's metallic helix and connected narrative. The base palette is near-black/off-white/silver with minimal violet highlights. English copy is sourced from the existing professional content; no generated mockup metrics or fictional career dates were adopted.

## Production asset

Built-in imagegen mode was used. The selected PNG was copied into `src/horizon/event-horizon.png` from the generated image `exec-e0d45f95-752c-4b4c-b3fc-f8d3ba798e7e.png`. It is a background image, not a pre-rendered website UI. The interactive scene combines its scroll-driven transformation with real WebGL particles, a metallic double helix and CSS 3D project panels.

### Generation prompt

Create a production website background asset, landscape 16:9, no typography, no text, no UI, no logos, no dashboard. Ultra-premium cinema-quality astronomy VFX art: an enormous black hole on the RIGHT side of a near-black frame, circular pitch-black event horizon centered at x=70% y=50%, radius about 28% of image height. Thin extraordinarily detailed brushed-silver and ivory accretion ring, streaming dust fibers swirling around it, restrained violet rim only in tiny highlights. Strong asymmetrical flare upper-left arc and lower-right arc of the ring; center absolutely empty black. Almost pure black LEFT 40% of image reserved for readable white website typography, sparse stars only, no white clouds on left. Black backdrop with extremely subtle far-off star dust, physically convincing gravitational lensing, cinematic luxury, soft white-silver light without excessive bloom. Elegant and visually powerful, the ring should be distinctly circular at a slight cinematic slant, never an orange fire ring. Crisp at full screen, no border.

## Verification

Desktop and 390 × 844 viewport reviewed through the in-app browser. Project detail opened and closed with Escape. Loop tested by reaching the bottom and continuing to scroll, confirming return to scroll position 0 and #top. Motion toggle switched to the static layout and disabled the loop. Existing game unit tests retained. The WebGL scene has not been benchmarked on a physical low-end phone; DPR and mobile frame rate are limited to reduce its cost.


## Revisão interativa

O portal passou a animar a textura original em um shader WebGL com rotação diferencial e ondulação. Os capítulos substituem a caixa de leitura simples nos projetos e empregos, preservando todo o conteúdo profissional. O cursor usa refração SVG discreta e acompanha o dialog na camada superior. A hélice fica limitada a um espaço próprio medido no layout, sem se sobrepor à legenda ou à trajetória profissional. StreamHub é o terceiro monólito e recebeu uma prévia visual específica para compartilhamento de tela.


## Átomos e lente óptica

Os detalhes de projetos e experiências receberam um canvas próprio de partículas e átomos orbitais. O canvas fica na camada superior do dialog, atrás do conteúdo, e para quando o dialog fecha. A lente do cursor passou a usar cópias locais e isoladas do texto em Shadow DOM, com uma ampliação de 14% no centro e deslocamento leve nas bordas; o portal usa distorção óptica equivalente no shader. As cópias não interferem nos cliques nem nos leitores de tela.


Case-study reading returns to the exact saved gallery position when a fresh downward scroll starts at the end. Trackpad momentum that reaches the last chapter does not exit it; the exit gesture is consumed before it can move the page behind the dialog. Touch swipes from the bottom also return. The footer explains the next scroll action. Optical text copies explicitly reset native button appearance and backgrounds to keep the dark cursor lens transparent.
