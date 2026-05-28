import fs from 'fs';
import path from 'path';
import { getStaticDirForArticleId } from './product-static-paths.mjs';

export function isValidImageFile(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 256) return false;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf.slice(0, 4).toString('ascii') === 'RIFF') return true;
  return false;
}

export function resolveProductCoverFile(articleId, productId) {
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
