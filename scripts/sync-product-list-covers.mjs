import fs from 'fs';
import path from 'path';
import { resolveProductCoverFile } from './lib/image-file.mjs';
import { PATHS } from './lib/product-static-paths.mjs';

const ROOT = PATHS.ROOT;
const EQUIPMENT = path.join(ROOT, 'src/subpackage/products/data/equipment.json');
const OUT_DIR = path.join(ROOT, 'src/static/products/list');

const data = JSON.parse(fs.readFileSync(EQUIPMENT, 'utf8'));
fs.mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
for (const product of data.products) {
  const m = product.id.match(/^web-(\d+)$/);
  if (!m) {
    console.warn('Skip (bad id):', product.id);
    continue;
  }
  const src = resolveProductCoverFile(m[1], product.id);
  if (!src) {
    console.warn('No cover file:', product.id);
    continue;
  }
  const dest = path.join(OUT_DIR, `${product.id}.jpg`);
  fs.copyFileSync(src, dest);
  copied++;
}

console.log(`Synced ${copied} list cover(s) to ${path.relative(ROOT, OUT_DIR)}`);
