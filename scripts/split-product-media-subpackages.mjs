/**
 * Split product images into products-media-N subpackages when products pack exceeds 2MB.
 * Run after compress: npm run compress:products && npm run split:product-media
 */
import fs from 'fs';
import path from 'path';
import { PATHS } from './lib/product-static-paths.mjs';

const ROOT = PATHS.ROOT;
const LIMIT_BYTES = 1945 * 1024;
const SRC_STATIC = path.join(ROOT, 'src/subpackage/products/static/products');
const EQUIPMENT = path.join(ROOT, 'src/subpackage/products/data/equipment.json');
const PACK_MAP_PATH = PATHS.PACK_MAP_PATH;
const PAGES_JSON = path.join(ROOT, 'src/pages.json');

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(full) : fs.statSync(full).size;
  }
  return total;
}

function listArticleDirs() {
  if (!fs.existsSync(SRC_STATIC)) return [];
  return fs
    .readdirSync(SRC_STATIC, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({
      articleId: e.name,
      dir: path.join(SRC_STATIC, e.name),
      size: dirSize(path.join(SRC_STATIC, e.name)),
    }))
    .sort((a, b) => b.size - a.size);
}

function ensurePlaceholder(packName) {
  const base = path.join(ROOT, 'src/subpackage', packName);
  const pageDir = path.join(base, 'pages');
  const pageFile = path.join(pageDir, 'placeholder.vue');
  fs.mkdirSync(pageDir, { recursive: true });
  if (!fs.existsSync(pageFile)) {
    fs.writeFileSync(
      pageFile,
      '<template><view /></template>\n<script setup lang="ts"></script>\n',
      'utf8',
    );
  }
  const staticDir = path.join(base, 'static', 'products');
  fs.mkdirSync(staticDir, { recursive: true });
}

function registerInPagesJson(packNames) {
  const pages = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf8'));
  const existing = new Set((pages.subPackages || []).map((s) => s.root));
  let changed = false;
  for (const packName of packNames) {
    const root = `subpackage/${packName}`;
    if (existing.has(root)) continue;
    pages.subPackages.push({
      root,
      pages: [
        {
          path: 'pages/placeholder',
          style: { navigationBarTitleText: '' },
        },
      ],
    });
    changed = true;
  }
  const productsTabRule = pages.preloadRule?.['pages/products/index'];
  if (productsTabRule) {
    const pkgs = new Set(productsTabRule.packages || []);
    pkgs.add('subpackage/products');
    for (const packName of packNames) pkgs.add(`subpackage/${packName}`);
    productsTabRule.packages = [...pkgs];
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(PAGES_JSON, JSON.stringify(pages, null, 2) + '\n', 'utf8');
  }
}

const productsOnlySize = dirSize(path.join(ROOT, 'src/subpackage/products'));
console.log(`Current products subpackage (src): ${(productsOnlySize / 1024).toFixed(1)} KB`);

if (productsOnlySize <= LIMIT_BYTES) {
  console.log('Within limit — split not required.');
  process.exit(0);
}

const articles = listArticleDirs();
const packs = [{ name: 'products-media-1', size: 0, articles: [] }];

for (const article of articles) {
  let target = packs[packs.length - 1];
  if (target.size > 0 && target.size + article.size > LIMIT_BYTES) {
    const n = packs.length + 1;
    target = { name: `products-media-${n}`, size: 0, articles: [] };
    packs.push(target);
  }
  target.articles.push(article);
  target.size += article.size;
}

const packMap = {};
let packIndex = 0;

for (const pack of packs) {
  ensurePlaceholder(pack.name);
  const destRoot = path.join(ROOT, 'src/subpackage', pack.name, 'static/products');
  fs.mkdirSync(destRoot, { recursive: true });

  for (const { articleId, dir } of pack.articles) {
    const dest = path.join(destRoot, articleId);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    fs.renameSync(dir, dest);
    packMap[`web-${articleId}`] = pack.name;
    console.log(`Moved ${articleId} -> ${pack.name}`);
  }
  packIndex++;
}

fs.mkdirSync(path.dirname(PACK_MAP_PATH), { recursive: true });
fs.writeFileSync(PACK_MAP_PATH, JSON.stringify(packMap, null, 2) + '\n', 'utf8');

const data = JSON.parse(fs.readFileSync(EQUIPMENT, 'utf8'));
for (const product of data.products) {
  const pack = packMap[product.id];
  if (!pack) continue;
  const prefix = `/subpackage/${pack}/static/products`;
  const m = product.id.match(/^web-(\d+)$/);
  if (!m) continue;
  const articleId = m[1];
  const rewrite = (p) => {
    if (!p || !p.includes('/static/products/')) return p;
    const file = path.basename(p);
    return `${prefix}/${articleId}/${file}`;
  };
  product.cover = rewrite(product.cover);
  product.images = (product.images || []).map(rewrite);
}
fs.writeFileSync(EQUIPMENT, JSON.stringify(data, null, '\t') + '\n', 'utf8');

registerInPagesJson(packs.map((p) => p.name));
console.log(`Wrote ${PACK_MAP_PATH}`);
console.log('Run: npm run build:mp-weixin && npm run check:package-size');
