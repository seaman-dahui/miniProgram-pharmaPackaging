/**
 * Measure WeChat build output package sizes vs 2MB subpackage limit.
 * Usage: npm run build:mp-weixin && npm run check:package-size
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist/build/mp-weixin');
const PAGES_JSON = path.join(ROOT, 'src/pages.json');
const LIMIT_KB = 1945;
const PRELOAD_LIMIT_KB = 2048;

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

function status(bytes) {
  const kb = bytes / 1024;
  return kb <= LIMIT_KB ? 'OK' : 'OVER';
}

if (!fs.existsSync(DIST)) {
  console.error(`Build output not found: ${DIST}`);
  console.error('Run: npm run build:mp-weixin');
  process.exit(1);
}

const subRoot = path.join(DIST, 'subpackage');
const subpackages = fs.existsSync(subRoot)
  ? fs.readdirSync(subRoot, { withFileTypes: true }).filter((e) => e.isDirectory())
  : [];

let failed = false;
const rows = [];

console.log(`\nPackage size report (limit: ${LIMIT_KB} KB per package)\n`);
console.log('Package'.padEnd(28), 'Size(KB)'.padStart(10), 'Status'.padStart(8));
console.log('-'.repeat(48));

const mainParts = [
  path.join(DIST, 'pages'),
  path.join(DIST, 'static'),
  path.join(DIST, 'common'),
  path.join(DIST, 'app.js'),
  path.join(DIST, 'app.json'),
  path.join(DIST, 'app.wxss'),
];
let mainSize = 0;
for (const p of mainParts) {
  if (!fs.existsSync(p)) continue;
  const st = fs.statSync(p);
  mainSize += st.isDirectory() ? dirSize(p) : st.size;
}
for (const f of fs.readdirSync(DIST)) {
  if (f.endsWith('.js') && f !== 'app.js') {
    mainSize += fs.statSync(path.join(DIST, f)).size;
  }
}
rows.push({ name: 'main (approx)', bytes: mainSize });
if (mainSize / 1024 > LIMIT_KB) failed = true;

const mainStaticDirs = [
  'static/about',
  'static/products/list',
  'static/home/featured',
  'static/home/banner',
  'static/tabs',
];
console.log(`\nMain package static breakdown\n`);
console.log('Path'.padEnd(28), 'Size(KB)'.padStart(10));
console.log('-'.repeat(40));
for (const rel of mainStaticDirs) {
  const dir = path.join(DIST, rel);
  const bytes = dirSize(dir);
  if (bytes > 0) {
    console.log(rel.padEnd(28), formatKB(bytes).padStart(10));
  }
}

for (const sub of subpackages) {
  const name = `subpackage/${sub.name}`;
  const bytes = dirSize(path.join(subRoot, sub.name));
  rows.push({ name, bytes });
  if (bytes / 1024 > LIMIT_KB) failed = true;
}

for (const row of rows.sort((a, b) => b.bytes - a.bytes)) {
  const kb = formatKB(row.bytes);
  const st = status(row.bytes);
  console.log(row.name.padEnd(28), kb.padStart(10), st.padStart(8));
  if (st === 'OVER') {
    console.log(`  ^ exceeds ${LIMIT_KB} KB`);
  }
}

const total = dirSize(DIST);
console.log('-'.repeat(48));
console.log('Total build'.padEnd(28), formatKB(total).padStart(10));

const pagesConfig = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf8'));
const preloadRule = pagesConfig.preloadRule || {};
console.log(`\nPreload rule check (limit: ${PRELOAD_LIMIT_KB} KB per page rule)\n`);
console.log('Page'.padEnd(28), 'Preload(KB)'.padStart(12), 'Status'.padStart(8));
console.log('-'.repeat(52));

for (const [page, rule] of Object.entries(preloadRule)) {
  const packages = rule.packages || [];
  let preloadBytes = 0;
  for (const pkg of packages) {
    const rel = pkg.replace(/^subpackage\//, '');
    const dir = path.join(subRoot, rel);
    preloadBytes += dirSize(dir);
  }
  const kb = preloadBytes / 1024;
  const st = kb <= PRELOAD_LIMIT_KB ? 'OK' : 'OVER';
  console.log(page.padEnd(28), formatKB(preloadBytes).padStart(12), st.padStart(8));
  if (st === 'OVER') {
    console.log(`  ^ preload packages total exceeds ${PRELOAD_LIMIT_KB} KB`);
    failed = true;
  }
  if (!packages.length) {
    console.log('  (no packages)');
  }
}

if (failed) {
  console.error('\nPackage or preload rule exceeds the limit.');
  process.exit(1);
}
console.log('\nAll packages and preload rules within limit.');
