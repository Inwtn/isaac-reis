# Referências do novo portfólio

## Método

Em 17/11/2026, observei as páginas públicas de Daniel Ingrassia, Carter Ogunsola, Emotion Agency e Blue Square X. Baixei o HTML e 11 bundles JavaScript públicos do site de Ingrassia para a pasta temporária tmp/rea-ingrassia e executei o REA 6.9.0 em análise estática. O recorte com HTML e dois bundles produziu evidências em tmp/rea-core-result.json: 3 arquivos relevantes, 2 JavaScripts analisados, 17.094 nós AST percorridos e nenhuma falha de parsing. O REA aponta cobertura parcial de rotas; as inferências de layout e interação abaixo vêm da observação da página.

## Padrões observados

- **Daniel Ingrassia:** fundo carvão, tipografia branca discreta, grande forma de partículas no centro e transformações controladas pela rolagem. Textos pequenos nas laterais dão escala à cena. A página usa Next.js, conforme os caminhos /_next/static/ no HTML público.
- **Carter Ogunsola:** navegação compacta, marca pessoal, presença editorial e uma lista clara de trabalhos selecionados.
- **Emotion Agency:** narrativa em blocos curtos, títulos fortes e projetos acompanhados de contexto.
- **Blue Square X:** visual imersivo e uso de um objeto luminoso para dar identidade à primeira dobra.

## Adaptação para Isaac

O resultado usa uma esfera de partículas desenhada em Canvas 2D, em vez da figura humana da referência. Mantém o contraste entre carvão e branco e acrescenta amarelo pontual, alinhado ao README do GitHub. Projetos e experiência vêm dos dados já existentes no repositório. A página é em português, indica o Brasil e preserva links para GitHub, LinkedIn, currículo e versão de leitura.

As ilustrações geométricas dos projetos são originais em CSS; nenhum código, texto, imagem ou modelo 3D dos sites de referência foi incorporado.
