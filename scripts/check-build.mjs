import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import sharp from 'sharp';

const html = await readFile('dist/index.html', 'utf8');
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(!html.includes('<div id="root"></div>'), 'A capa precisa chegar renderizada no HTML.');
for (const text of ['Completo e gratuito.', 'Como jogar', '200 palavras', 'application/ld+json']) assert.ok(html.includes(text), `Conteúdo ausente: ${text}`);
const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(data.isAccessibleForFree, true);
assert.equal(data.offers.price, '0');
assert.equal(data.offers.priceCurrency, 'BRL');
const image = await sharp('dist/share.png').metadata();
assert.equal(image.width, 1200); assert.equal(image.height, 630);
for (const filename of await readdir('dist/assets')) {
  if (filename.endsWith('.css')) assert.ok(!(await readFile(`dist/assets/${filename}`, 'utf8')).includes('fonts.googleapis.com'));
}
assert.ok((await readdir('dist/assets')).some(filename => filename.endsWith('.woff2')));
const configured = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (configured) {
  const origin = new URL(configured.includes('://') ? configured : `https://${configured}`).origin + '/';
  assert.ok(html.includes(`<link rel="canonical" href="${origin}"`));
  assert.ok(html.includes(`<meta property="og:url" content="${origin}"`));
  assert.ok(html.includes(`content="${origin}share.png"`));
  assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes(`<loc>${origin}</loc>`));
  if (process.env.VERCEL_ENV !== 'preview') { assert.ok(robots.includes('Allow: /')); assert.ok(robots.includes(`Sitemap: ${origin}sitemap.xml`)); }
} else {
  assert.ok(!html.includes('rel="canonical"'));
  assert.ok(robots.includes('Disallow: /'));
}
if (process.env.VERCEL_ENV === 'preview') { assert.ok(html.includes('noindex, nofollow')); assert.ok(robots.includes('Disallow: /')); }
console.info('SEO conferido: HTML estático, dados de gratuidade, fontes locais, imagem e configuração de rastreamento.');
