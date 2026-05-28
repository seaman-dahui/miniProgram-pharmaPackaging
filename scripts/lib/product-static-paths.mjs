import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PACK_MAP_PATH = path.join(ROOT, 'data/product-media-pack.json');

let packMapCache = null;

export function getPackMap() {
  if (packMapCache) return packMapCache;
  if (!fs.existsSync(PACK_MAP_PATH)) {
    packMapCache = {};
    return packMapCache;
  }
  packMapCache = JSON.parse(fs.readFileSync(PACK_MAP_PATH, 'utf8'));
  return packMapCache;
}

/** e.g. products-media-1 or products (default) */
export function getMediaPackForProductId(productId) {
  const map = getPackMap();
  return map[productId] || 'products';
}

export function getStaticWebPrefix(productId) {
  const pack = getMediaPackForProductId(productId);
  if (pack === 'products') {
    return '/subpackage/products/static/products';
  }
  return `/subpackage/${pack}/static/products`;
}

export function getStaticDirForArticleId(articleId, productId = `web-${articleId}`) {
  const pack = getMediaPackForProductId(productId);
  if (pack === 'products') {
    return path.join(ROOT, 'src/subpackage/products/static/products', articleId);
  }
  return path.join(ROOT, 'src/subpackage', pack, 'static/products', articleId);
}

export const PATHS = { ROOT, PACK_MAP_PATH };
