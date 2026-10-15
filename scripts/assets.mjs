import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export async function generateAssets() {
  const source = await readFile(new URL('../public/share.svg', import.meta.url));
  await sharp(source).png({ palette: true }).toFile(fileURLToPath(new URL('../public/share.png', import.meta.url)));
  await sharp(fileURLToPath(new URL('../public/favicon.svg', import.meta.url))).resize(180, 180).png().toFile(fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await generateAssets();
