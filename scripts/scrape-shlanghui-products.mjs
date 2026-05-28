/**
 * Scrape http://www.shlanghui.cn/Products and sync to miniapp equipment.json
 */
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = 'http://www.shlanghui.cn';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const DELAY_MS = 300;

const SCRAPED_DIR = path.join(ROOT, 'data', 'scraped');
const STATIC_DIR = path.join(ROOT, 'src', 'subpackage', 'products', 'static', 'products');
const EQUIPMENT_JSON = path.join(ROOT, 'src', 'subpackage', 'products', 'data', 'equipment.json');

const SKIP_IMAGE_PATTERNS = [
  /logo/i,
  /flag_/i,
  /qr\.jpg/i,
  /pattern\.jpg/i,
  /runwell\.jpg/i,
  /dh\.jpg/i,
  /websiteonline\.cn\/website\//,
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchText(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchBuffer(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function isProductImage(src) {
  if (!src || !src.includes('pmo32e87b')) return false;
  return !SKIP_IMAGE_PATTERNS.some((p) => p.test(src));
}

function extFromUrl(url, contentType) {
  const m = url.match(/\.(jpe?g|png|gif|webp)(\?|$)/i);
  if (m) return `.${m[1].toLowerCase().replace('jpeg', 'jpg')}`;
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  return '.jpg';
}

function inferCategory(name) {
  if (/装盒/.test(name)) return 'cartoning';
  if (/泡罩/.test(name)) return 'blister';
  if (/^F-/i.test(name) || /制托/.test(name)) return 'pallet';
  if (/^C-/i.test(name) || /套标/.test(name)) return 'sleeve';
  return 'labeling';
}

function parseSpecLine(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  const idx = t.search(/[:：]/);
  if (idx <= 0) return null;
  return {
    label: t.slice(0, idx).trim(),
    value: t.slice(idx + 1).trim(),
  };
}

function extractSections(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const content =
    $('.artview_content').html() ||
    $('.wp-article_detail_content .artview_detail').html() ||
    '';

  const $c = cheerio.load(content || html, { decodeEntities: false });
  const fullText = $c.root().text();

  let description = '';
  let specsText = '';
  const specItems = [];

  const descMatch = fullText.match(/【设备描述】([\s\S]*?)(?=【技术参数】|$)/);
  const specMatch = fullText.match(/【技术参数】([\s\S]*?)$/);

  if (descMatch) {
    description = descMatch[1]
      .replace(/\s+/g, ' ')
      .replace(/。/g, '。\n')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .join('\n');
  }

  if (specMatch) {
    specsText = specMatch[1]
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .join('\n');
  }

  $c('li').each((_, el) => {
    const t = $c(el).text().replace(/\s+/g, ' ').trim();
    if (!t) return;
    const spec = parseSpecLine(t);
    if (spec) specItems.push(spec);
  });

  if (!description) {
    const bullets = [];
    $c('li').each((_, el) => {
      const t = $c(el).text().replace(/\s+/g, ' ').trim();
      if (t && !parseSpecLine(t)) bullets.push(t);
    });
    description = bullets.join('\n');
  }

  if (!specsText && specItems.length) {
    specsText = specItems.map((s) => `${s.label}：${s.value}`).join('\n');
  }

  const images = [];
  $c('img').each((_, el) => {
    const src = $c(el).attr('src') || '';
    if (isProductImage(src) && !images.includes(src)) images.push(src);
  });

  return { description, specsText, specItems, images };
}

function parseListPage(html) {
  const items = [];
  const $ = cheerio.load(html);

  $('a.articleid[articleid]').each((_, el) => {
    const id = $(el).attr('articleid');
    if (!id) return;
    const title = $(el).attr('title') || $(el).text().trim();
    if (!items.find((x) => x.articleId === id)) {
      items.push({ articleId: id, listTitle: title });
    }
  });

  $('.wp-article_list-thumbnail').each((i, el) => {
    const src = $(el).attr('src') || '';
    const alt = $(el).attr('alt') || '';
    if (items[i]) items[i].listThumb = src;
    if (alt && items[i] && !items[i].listTitle) items[i].listTitle = alt.trim();
  });

  // Pair thumbnails with article links by order in HTML
  const thumbs = [];
  const re =
    /articleid="(\d+)"[^>]*title="([^"]*)"[\s\S]*?wp-article_list-thumbnail[^>]*src="([^"]+)"/gi;
  let m;
  const paired = new Map();
  while ((m = re.exec(html)) !== null) {
    paired.set(m[1], { articleId: m[1], listTitle: m[2], listThumb: m[3] });
  }

  if (paired.size) {
    return [...paired.values()];
  }

  return items;
}

async function fetchProductList() {
  const map = new Map();
  for (let page = 1; page <= 3; page++) {
    const url = `${BASE}/Products?page=${page}`;
    console.log(`Fetching list page ${page}...`);
    const html = await fetchText(url);
    for (const item of parseListPage(html)) {
      map.set(item.articleId, { ...map.get(item.articleId), ...item });
    }
    await sleep(DELAY_MS);
  }
  return [...map.values()];
}

async function fetchProductDetail(articleId, listItem) {
  const url = `${BASE}/Product_Detail?article_id=${articleId}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  let name =
    $('.artview_title').first().text().trim() ||
    $('h1').first().text().trim() ||
    listItem.listTitle ||
    '';

  if (!name) {
    const title = $('title').text();
    name = title.replace(/-上海朗惠.*$/, '').trim();
  }

  const { description, specsText, specItems, images } = extractSections(html);

  if (!images.length && listItem.listThumb) {
    images.push(listItem.listThumb);
  }

  return {
    articleId,
    name,
    description,
    specsText,
    specItems,
    imageUrls: images,
  };
}

async function downloadImages(articleId, urls) {
  const dir = path.join(STATIC_DIR, String(articleId));
  fs.mkdirSync(dir, { recursive: true });

  const localPaths = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const buf = await fetchBuffer(url);
      const ext = extFromUrl(url);
      const filename = i === 0 ? `cover${ext}` : `detail-${i}${ext}`;
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, buf);
      localPaths.push(
        `/subpackage/products/static/products/${articleId}/${filename}`,
      );
      await sleep(100);
    } catch (e) {
      console.warn(`  Failed to download ${url}:`, e.message);
    }
  }
  return localPaths;
}

function toSummary(description) {
  const first = description.split('\n')[0] || '';
  return first.length > 40 ? `${first.slice(0, 37)}...` : first;
}

function toFeatures(description) {
  const lines = description.split('\n').filter(Boolean);
  if (!lines.length) {
    return [{ title: '产品特点', desc: '详见设备描述' }];
  }
  return lines.slice(0, 6).map((line, i) => ({
    title: `特点${i + 1}`,
    desc: line.replace(/^[\d.、]+\s*/, ''),
  }));
}

function csvEscape(val) {
  const s = String(val ?? '').replace(/"/g, '""');
  return `"${s}"`;
}

function exportCsv(rows, filePath) {
  const header = ['产品名称', '设备描述', '技术参数', '产品图片'];
  const lines = [
    header.map(csvEscape).join(','),
    ...rows.map((r) =>
      [r.name, r.description, r.specsText, r.imageUrls.join('\n')]
        .map(csvEscape)
        .join(','),
    ),
  ];
  fs.writeFileSync(filePath, '\uFEFF' + lines.join('\r\n'), 'utf8');
}

function exportMarkdown(rows, filePath) {
  const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
  const lines = [
    '# 上海朗惠产品中心（官网爬取）',
    '',
    '| 产品名称 | 设备描述 | 技术参数 | 产品图片 |',
    '| --- | --- | --- | --- |',
    ...rows.map(
      (r) =>
        `| ${esc(r.name)} | ${esc(r.description)} | ${esc(r.specsText)} | ${esc(r.imageUrls.join(' '))} |`,
    ),
  ];
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function buildProduct(row, sort, localPaths) {
  const categoryId = inferCategory(row.name);
  const cover = localPaths[0] || '/subpackage/products/static/placeholder.png';
  const images = localPaths.length ? localPaths : [cover];

  return {
    id: `web-${row.articleId}`,
    categoryId,
    name: row.name,
    summary: toSummary(row.description),
    cover,
    images,
    tags: [],
    specs: row.specItems.length
      ? row.specItems
      : row.specsText
          .split('\n')
          .map(parseSpecLine)
          .filter(Boolean),
    features: toFeatures(row.description),
    applications: ['制药', '食品', '日化'],
    featured: sort <= 3,
    sort,
  };
}

function updateEquipmentJson(products) {
  const raw = JSON.parse(fs.readFileSync(EQUIPMENT_JSON, 'utf8'));

  const extraCategories = [
    { id: 'pallet', name: '制托机', emoji: '📋' },
    { id: 'sleeve', name: '套标机', emoji: '🏷️' },
  ];
  for (const cat of extraCategories) {
    if (!raw.categories.find((c) => c.id === cat.id)) {
      raw.categories.push(cat);
    }
  }

  // Map S-750 -> web-26 for banner links
  const s750 = products.find((p) => p.name.includes('S-750'));
  const defaultLink = s750?.id || products[0]?.id || '';

  raw.banners = raw.banners.map((b) => ({
    ...b,
    linkProductId: defaultLink,
  }));

  raw.products = products;
  fs.writeFileSync(EQUIPMENT_JSON, JSON.stringify(raw, null, '\t') + '\n', 'utf8');
}

async function main() {
  fs.mkdirSync(SCRAPED_DIR, { recursive: true });
  fs.mkdirSync(STATIC_DIR, { recursive: true });

  const list = await fetchProductList();
  console.log(`Found ${list.length} products on list pages`);

  const rows = [];
  const errors = [];
  const products = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    console.log(`[${i + 1}/${list.length}] article_id=${item.articleId}...`);
    try {
      const detail = await fetchProductDetail(item.articleId, item);
      rows.push(detail);

      console.log(`  Downloading ${detail.imageUrls.length} image(s)...`);
      const localPaths = await downloadImages(item.articleId, detail.imageUrls);
      products.push(buildProduct(detail, i + 1, localPaths));
    } catch (e) {
      console.error(`  Error:`, e.message);
      errors.push({ articleId: item.articleId, error: e.message });
    }
    await sleep(DELAY_MS);
  }

  const csvPath = path.join(SCRAPED_DIR, 'shlanghui-products.csv');
  const mdPath = path.join(SCRAPED_DIR, 'shlanghui-products.md');
  exportCsv(rows, csvPath);
  exportMarkdown(rows, mdPath);
  console.log(`Exported: ${csvPath}`);
  console.log(`Exported: ${mdPath}`);

  if (errors.length) {
    fs.writeFileSync(
      path.join(SCRAPED_DIR, 'errors.json'),
      JSON.stringify(errors, null, 2),
      'utf8',
    );
  }

  updateEquipmentJson(products);
  console.log(`Updated equipment.json with ${products.length} products`);

  runNodeScript('compress-product-images.mjs');
  runNodeScript('fix-product-image-paths.mjs');
  runNodeScript('sync-home-featured-covers.mjs');
}

function runNodeScript(name) {
  console.log(`Running ${name}...`);
  const r = spawnSync(process.execPath, [path.join(__dirname, name)], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    throw new Error(`${name} exited with code ${r.status}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
