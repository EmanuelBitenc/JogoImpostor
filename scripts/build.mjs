import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { build, loadEnv } from 'vite';
import { generateAssets } from './assets.mjs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const configuredUrl = env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL;
let siteUrl;
if (configuredUrl) {
  const parsed = new URL(configuredUrl.includes('://') ? configuredUrl : `https://${configuredUrl}`);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || parsed.hostname === 'localhost') {
    throw new Error('SITE_URL deve ser a origem HTTPS pública, sem caminho, credenciais, parâmetros ou fragmentos.');
  }
  siteUrl = `${parsed.origin}/`;
}
const isPreview = env.VERCEL_ENV === 'preview';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

await generateAssets();
await build();
const ssrDir = 'node_modules/.cache/um-de-nos-prerender';
await build({ build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true } });
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
let html = await readFile('dist/index.html', 'utf8');
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

const application = {
  '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Um de Nós — Jogo do Impostor',
  applicationCategory: 'GameApplication', operatingSystem: 'Web', inLanguage: 'pt-BR',
  description: 'Jogo do impostor completo e gratuito para jogar com amigos em um único celular, sem cadastro.',
  isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
  ...(siteUrl ? { url: siteUrl, image: new URL('share.png', siteUrl).href } : {}),
};
const head = [`<script type="application/ld+json">${JSON.stringify(application).replaceAll('<', '\\u003c')}</script>`];
if (siteUrl) {
  head.push(`<link rel="canonical" href="${escape(siteUrl)}" />`, `<meta property="og:url" content="${escape(siteUrl)}" />`);
  html = html.replaceAll('content="/share.png"', `content="${escape(new URL('share.png', siteUrl).href)}"`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl)}</loc></url></urlset>\n`);
} else {
  console.info('SEO: domínio público ainda não definido. Configure SITE_URL ou publique na Vercel para gerar canonical e sitemap com o endereço real.');
}
if (isPreview) head.push('<meta name="robots" content="noindex, nofollow" />');
await writeFile('dist/robots.txt', `User-agent: *\n${isPreview || !siteUrl ? 'Disallow: /' : 'Allow: /'}\n${siteUrl && !isPreview ? `Sitemap: ${siteUrl}sitemap.xml\n` : ''}`);
html = html.replace('<!--seo-head-->', head.join('\n    '));
await writeFile('dist/index.html', html);
console.info('Capa pré-renderizada. Imagem de compartilhamento e arquivos de SEO preparados.');
