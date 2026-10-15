# Um de Nós — Jogo do Impostor

Jogo para amigos em um único celular, feito com React, TypeScript, Vite e CSS Modules. Interface em português e adaptada para celular.

## Desenvolvimento

Requer Node.js 22.12+ (ou outra versão compatível com Vite 7) e npm.

```sh
npm install
npm run dev
```

O endereço local aparece no terminal. Para abrir em um celular na mesma rede, use o endereço de rede exibido pelo Vite e permita o acesso ao servidor no firewall, se necessário.

## Organização do código

```text
src/
├── app/           # App e useGame: navegação e estado da sessão
├── screens/       # Uma pasta por tela, com componente e CSS Module
├── components/    # Layout, máscara, jogadores, categorias, opções, card e diálogo
├── game/          # Tipos, regras e sorteios, sem dependência de React
├── data/          # Catálogo JSON e acesso tipado às categorias
├── storage/       # Leitura, validação e gravação das preferências
├── styles/        # Estilos globais e classes visuais compartilhadas
├── main.tsx       # Entrada no navegador, hidratação e Analytics
└── entry-server.tsx # Entrada de pré-renderização durante o build
```

`app/useGame.ts` permanece montado durante as trocas de tela para preservar a partida e as palavras usadas. As telas recebem dados e ações por propriedades; não importam umas às outras. `SecretCard/useRevealCard.ts` controla somente a consulta temporária da informação e é reiniciado para cada jogador. A confirmação usa um portal, com gerenciamento de foco e fechamento por Escape. As regras não acessam armazenamento ou componentes, e apenas as preferências são persistidas no navegador.

Estilos de cada tela e componente ficam ao lado do respectivo arquivo. `styles/shared.module.css` reúne botões, painéis e textos usados por mais de uma tela. Os testes cobrem regras de sorteio e dados de preferências corrompidos, além da execução durante a pré-renderização.

```sh
npm test
npm run build
npm run check:seo
npm run preview
```

## Como jogar

1. Adicione os nomes pelo campo com o botão +. Remova jogadores pelo ×.
2. Escolha 1 impostor, 2 ou sorteio entre 1 e 2. O mínimo é 3 jogadores para 1 impostor e 5 para os demais modos.
3. Escolha a votação após 2, 3, 4 rodadas ou sorteio e selecione as categorias.
4. Passe o aparelho na ordem dos nomes. Segure o próprio card para revelar e solte para esconder. Depois, avance.
5. A tela da partida informa quem começa, quando votar e as orientações. Uma rodada corresponde a todos falarem uma vez.
6. O grupo conversa, conta rodadas e vota ao vivo. O impostor pode arriscar a palavra apenas na própria vez. Acerto é vitória individual; erro é derrota individual. Com dois impostores, a dica é compartilhada e os resultados são individuais.
7. Ao terminar, revele os impostores e a palavra. Volte às configurações para outra partida.

O app não gerencia votos, eliminações ou vencedores. No modo aleatório, a quantidade de impostores fica em segredo até a revelação final.

## Sessão e preferências

- Nomes e configurações são salvos no `localStorage` quando disponível.
- Palavras usadas ficam apenas em memória e nunca são repetidas durante a sessão, inclusive ao trocar categorias.
- Recarregar a página reinicia a partida e libera o catálogo completo.
- A palavra é marcada como usada ao iniciar a partida.
- Se as categorias selecionadas esgotarem, selecione outras ou recarregue a página.

## Catálogo

`src/data/words.json` contém 200 palavras em 10 categorias. Cada entrada precisa de um `id` único no catálogo, uma `palavra` e três `dicas` diferentes. Use palavras cotidianas e dicas acessíveis, sem termos técnicos ou referências específicas. Revise a dificuldade com o grupo ao expandir o catálogo.

```json
{
  "id": "pizza",
  "palavra": "Pizza",
  "dicas": ["Entrega", "Fatia", "Forno"]
}
```

Os testes em `src/game/game.test.ts` verificam a integridade do catálogo e as regras de sorteio em `src/game/rules.ts`. Para permitir a mesma palavra em várias categorias, reutilize o mesmo ID para manter o bloqueio global (e ajuste a verificação de IDs únicos no teste).

## Vercel

Importe o repositório `EmanuelBitenc/JogoImpostor` e selecione o preset **Vite**. O comando de build é `npm run build` e o diretório de saída é `dist`. O projeto usa uma única URL e não precisa de regras de redirecionamento. Não precisa de backend.

O build usa `VERCEL_PROJECT_PRODUCTION_URL` para gerar canonical, URLs absolutas das imagens de compartilhamento e `sitemap.xml`. Para definir outro endereço, configure `SITE_URL` com a origem HTTPS definitiva (exemplo no `.env.example`). Ative a exposição das variáveis de sistema da Vercel caso necessário. Sem endereço público, o build local omite canonical e sitemap e gera robots com rastreamento desabilitado. Prévias da Vercel também recebem `noindex` e robots restritivo; use o domínio de produção para indexação.

## Busca, compartilhamento e acessibilidade

### Vercel Web Analytics

O componente oficial `@vercel/analytics/react` está integrado na entrada do React para registrar acessos ao site. No painel do projeto na Vercel, abra **Analytics → Enable** e faça um novo deploy. Os dados passam a aparecer após visitas ao endereço publicado. O modo de desenvolvimento não envia acessos reais.

A integração usa apenas a medição padrão de acessos. Nomes digitados pelos jogadores, palavras secretas e dicas não são enviados como eventos personalizados. O painel mostra estatísticas de visitantes, sem identificar nominalmente as pessoas. Como as etapas do jogo usam a mesma URL, não são contadas como páginas diferentes.

### Recursos implementados

- A capa e o conteúdo de como jogar são pré-renderizados durante o build com React e Vite. O HTML final já contém os textos; o React hidrata a página para iniciar a interação. Não há servidor de renderização em produção.
- O HTML inclui título, descrição, Open Graph, Twitter Card e dados estruturados de WebApplication com acesso gratuito e preço zero. Esses dados não garantem resultados especiais nos buscadores.
- `scripts/assets.mjs` gera a imagem de compartilhamento PNG de 1200 × 630 a partir de `public/share.svg`, além do ícone para iOS. O build e o início do desenvolvimento executam a geração automaticamente.
- As fontes DM Sans e Space Grotesk são servidas pelo próprio site, via Fontsource, com `font-display: swap`. Não há requisições ao Google Fonts.
- Há um link para pular ao conteúdo, controles com áreas de toque mínimas de 44px, foco visível, campos identificados e respeito a movimento reduzido.
- Depois de publicar, cadastre o endereço no Google Search Console, envie `/sitemap.xml` e confira a indexação do domínio de produção. Essa etapa precisa da conta do proprietário.

O jogo completo é gratuito, com todas as categorias e configurações liberadas. O jogo não é um PWA e não promete funcionamento offline.
