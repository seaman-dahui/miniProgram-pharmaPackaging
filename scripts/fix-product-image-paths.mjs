import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const EQUIPMENT = path.join(ROOT, 'src/subpackage/products/data/equipment.json');

function resolveStaticPath(webPath) {
  const rel = webPath.replace(/^\//, '').replace(/\//g, path.sep);
  return path.join(ROOT, 'src', rel);
}

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .sort((a, b) => {
      if (a.startsWith('cover')) return -1;
      if (b.startsWith('cover')) return 1;
      return a.localeCompare(b);
    });
}

const data = JSON.parse(fs.readFileSync(EQUIPMENT, 'utf8'));
let fixed = 0;

for (const product of data.products) {
  const m = product.id.match(/^web-(\d+)$/);
  if (!m) continue;
  const articleId = m[1];
  const dir = path.join(ROOT, 'src/subpackage/products/static/products', articleId);
  const files = listImageFiles(dir);
  if (!files.length) {
    console.warn('No images:', product.id, dir);
    continue;
  }

  const coverFile = files.find((f) => f.startsWith('cover')) || files[0];
  const coverPath = `/subpackage/products/static/products/${articleId}/${coverFile}`;
  const imagePaths = files.map(
    (f) => `/subpackage/products/static/products/${articleId}/${f}`,
  );

  if (product.cover !== coverPath) {
    product.cover = coverPath;
    fixed++;
  }
  const imagesStr = JSON.stringify(imagePaths);
  const currentStr = JSON.stringify(product.images);
  if (currentStr !== imagesStr) {
    product.images = imagePaths;
    fixed++;
  }
}

fs.writeFileSync(EQUIPMENT, JSON.stringify(data, null, '\t') + '\n', 'utf8');
console.log(`Fixed ${fixed} path field(s) in equipment.json`);
