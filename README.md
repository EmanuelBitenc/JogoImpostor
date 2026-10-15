# Entre Nós — Jogo do Impostor

Jogo para amigos em um único celular, feito com React, TypeScript, Vite e CSS Modules. Interface em português e adaptada para celular.

## Desenvolvimento

Requer Node.js 22.12+ (ou outra versão compatível com Vite 7) e npm.

```sh
npm install
npm run dev
```

O endereço local aparece no terminal. Para abrir em um celular na mesma rede, use o endereço de rede exibido pelo Vite e permita o acesso ao servidor no firewall, se necessário.

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

Os testes verificam a integridade do catálogo e as regras de sorteio. Para permitir a mesma palavra em várias categorias, reutilize o mesmo ID para manter o bloqueio global (e ajuste a verificação de IDs únicos no teste).

## Vercel

Importe o repositório `EmanuelBitenc/JogoImpostor` e selecione o preset **Vite**. O comando de build é `npm run build` e o diretório de saída é `dist`. O projeto usa uma única URL e não precisa de regras de redirecionamento. Não precisa de backend.

O build usa `VERCEL_PROJECT_PRODUCTION_URL` para gerar canonical, URLs absolutas das imagens de compartilhamento e `sitemap.xml`. Para definir outro endereço, configure `SITE_URL` com a origem HTTPS definitiva (exemplo no `.env.example`). Ative a exposição das variáveis de sistema da Vercel caso necessário. Sem endereço público, o build local omite canonical e sitemap e gera robots com rastreamento desabilitado. Prévias da Vercel também recebem `noindex` e robots restritivo; use o domínio de produção para indexação.

## Busca, compartilhamento e acessibilidade

- A capa e o conteúdo de como jogar são pré-renderizados durante o build com React e Vite. O HTML final já contém os textos; o React hidrata a página para iniciar a interação. Não há servidor de renderização em produção.
- O HTML inclui título, descrição, Open Graph, Twitter Card e dados estruturados de WebApplication com acesso gratuito e preço zero. Esses dados não garantem resultados especiais nos buscadores.
- `scripts/assets.mjs` gera a imagem de compartilhamento PNG de 1200 × 630 a partir de `public/share.svg`, além do ícone para iOS. O build e o início do desenvolvimento executam a geração automaticamente.
- As fontes DM Sans e Space Grotesk são servidas pelo próprio site, via Fontsource, com `font-display: swap`. Não há requisições ao Google Fonts.
- Há um link para pular ao conteúdo, controles com áreas de toque mínimas de 44px, foco visível, campos identificados e respeito a movimento reduzido.
- Depois de publicar, cadastre o endereço no Google Search Console, envie `/sitemap.xml` e confira a indexação do domínio de produção. Essa etapa precisa da conta do proprietário.

O jogo completo é gratuito, com todas as categorias e configurações liberadas. O jogo não é um PWA e não promete funcionamento offline.
