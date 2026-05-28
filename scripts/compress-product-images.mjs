/**
 * Compress product images under subpackage/products/static/products
 * Usage: node scripts/compress-product-images.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PRODUCTS_DIR = path.join(
  ROOT,
  'src/subpackage/products/static/products',
);
const DRY_RUN = process.argv.includes('--dry-run');

const COVER_MAX = 480;
const COVER_QUALITY = 82;
const DETAIL_MAX = 1200;
const DETAIL_QUALITY = 80;

function isValidImageBuffer(buf) {
  if (buf.length < 24) return false;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf.slice(0, 4).toString('ascii') === 'RIFF') return true;
  return false;
}

function isCoverFile(name) {
  return /^cover\./i.test(name);
}

function isDetailFile(name) {
  return /^detail-/i.test(name);
}

function scaleToFit(image, maxDim) {
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  if (w <= maxDim && h <= maxDim) return image;
  if (w >= h) return image.resize(maxDim, Jimp.AUTO);
  return image.resize(Jimp.AUTO, maxDim);
}

async function compressFile(filePath) {
  const name = path.basename(filePath);
  if (!isCoverFile(name) && !isDetailFile(name)) {
    return { skipped: true, reason: 'not product image' };
  }

  const before = fs.readFileSync(filePath);
  if (!isValidImageBuffer(before)) {
    return { skipped: true, reason: 'invalid image' };
  }

  const maxDim = isCoverFile(name) ? COVER_MAX : DETAIL_MAX;
  const quality = isCoverFile(name) ? COVER_QUALITY : DETAIL_QUALITY;

  const image = await Jimp.read(before);
  scaleToFit(image, maxDim);
  const outBuf = await image.quality(quality).getBufferAsync(Jimp.MIME_JPEG);

  if (outBuf.length >= before.length) {
    return { skipped: true, reason: 'no gain', before: before.length };
  }

  const targetPath = filePath.replace(/\.(png|jpe?g|webp|gif)$/i, '.jpg');

  if (!DRY_RUN) {
    if (targetPath !== filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    fs.writeFileSync(targetPath, outBuf);
  }

  return {
    skipped: false,
    before: before.length,
    after: outBuf.length,
    targetPath,
    renamed: targetPath !== filePath,
  };
}

function collectFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) {
      out.push(full);
    } else {
      console.warn('Remove non-image:', path.relative(ROOT, full));
      if (!DRY_RUN) fs.unlinkSync(full);
    }
  }
  return out;
}

const files = collectFiles(PRODUCTS_DIR);
let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;
const savings = [];

for (const filePath of files) {
  const result = await compressFile(filePath);
  if (result.skipped) {
    skipped++;
    if (result.reason === 'invalid image') {
      console.warn('Invalid image (skipped):', path.relative(ROOT, filePath));
    }
    continue;
  }
  processed++;
  totalBefore += result.before;
  totalAfter += result.after;
  savings.push({
    file: path.relative(ROOT, result.targetPath),
    before: result.before,
    after: result.after,
    renamed: result.renamed,
  });
}

savings.sort((a, b) => b.before - b.after - (a.before - a.after));

console.log(DRY_RUN ? '[dry-run] ' : '', `Processed: ${processed}, skipped: ${skipped}`);
console.log(
  `Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`,
);
console.log('Top savings:');
for (const s of savings.slice(0, 10)) {
  console.log(
    `  ${s.file}: ${(s.before / 1024).toFixed(1)}KB -> ${(s.after / 1024).toFixed(1)}KB${s.renamed ? ' (-> jpg)' : ''}`,
  );
}
