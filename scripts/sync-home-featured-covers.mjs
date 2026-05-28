import fs from 'fs';
import path from 'path';
import { getStaticDirForArticleId, PATHS } from './lib/product-static-paths.mjs';

const ROOT = PATHS.ROOT;
const EQUIPMENT = path.join(ROOT, 'src/subpackage/products/data/equipment.json');
const OUT_DIR = path.join(ROOT, 'src/static/home/featured');

function isValidImageFile(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 256) return false;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf.slice(0, 4).toString('ascii') === 'RIFF') return true;
  return false;
}

function resolveCoverFile(articleId, productId) {
  const dir = getStaticDirForArticleId(articleId, productId);
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .sort((a, b) => {
      if (a.startsWith('cover')) return -1;
      if (b.startsWith('cover')) return 1;
      return a.localeCompare(b);
    });
  for (const f of files) {
    const full = path.join(dir, f);
    if (isValidImageFile(full)) return full;
  }
  return null;
}

const data = JSON.parse(fs.readFileSync(EQUIPMENT, 'utf8'));
fs.mkdirSync(OUT_DIR, { recursive: true });

const featured = data.products.filter((p) => p.featured);
let copied = 0;

for (const product of featured) {
  const m = product.id.match(/^web-(\d+)$/);
  if (!m) {
    console.warn('Skip (bad id):', product.id);
    continue;
  }
  const src = resolveCoverFile(m[1], product.id);
  if (!src) {
    console.warn('No cover file:', product.id);
    continue;
  }
  const dest = path.join(OUT_DIR, `${product.id}.png`);
  fs.copyFileSync(src, dest);
  copied++;
  console.log(`${product.id} <- ${path.relative(ROOT, src)}`);
}

console.log(`Synced ${copied} featured cover(s) to ${path.relative(ROOT, OUT_DIR)}`);
