import fs from 'fs';
import path from 'path';
import { isValidImageFile } from './lib/image-file.mjs';
import { PATHS } from './lib/product-static-paths.mjs';

const ROOT = PATHS.ROOT;
const OUT_DIR = path.join(ROOT, 'src/static/about');
const COMPANY = path.join(ROOT, 'src/subpackage/about/data/company.json');

const SOURCES = [
  {
    key: 'honorsImage',
    src: path.join(ROOT, 'src/subpackage/about/static/cert/honors.png'),
    dest: path.join(OUT_DIR, 'honors.png'),
    web: '/static/about/honors.png',
  },
  {
    key: 'partnerImage',
    src: path.join(ROOT, 'src/subpackage/about/static/partnerImage.png'),
    dest: path.join(OUT_DIR, 'partner.png'),
    web: '/static/about/partner.png',
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
const company = JSON.parse(fs.readFileSync(COMPANY, 'utf8'));

for (const item of SOURCES) {
  if (!fs.existsSync(item.src) || !isValidImageFile(item.src)) {
    console.warn('Skip missing or invalid:', item.src);
    continue;
  }
  fs.copyFileSync(item.src, item.dest);
  company[item.key] = item.web;
  console.log(`${item.key} -> ${item.web}`);
}

fs.writeFileSync(COMPANY, JSON.stringify(company, null, 2) + '\n', 'utf8');
console.log('Updated company.json');
