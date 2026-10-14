#!/usr/bin/env node
/**
 * Doi chieu duong dan goc sau khi build. Sai cho nay la PWA mo ra trang trang.
 *
 * Kiem ba dieu:
 *   1. `vite.config.ts` khai dung MOT hang so `BASE`.
 *   2. `dist/manifest.webmanifest` co `start_url`, `scope`, `icons` dung theo `BASE` do.
 *   3. Trong `dist/assets/*.js` va `dist/assets/*.css` khong con duong dan asset viet cung.
 *
 * Chay sau `npm run build`. CI chan neu lech.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const loi = [];

// 1. Doc BASE tu vite.config.ts.
const cauHinh = readFileSync('vite.config.ts', 'utf8');
const khai = [...cauHinh.matchAll(/^const BASE = '([^']*)';$/gm)];
if (khai.length !== 1) {
  loi.push(`vite.config.ts phai khai dung mot dong "const BASE = '...';", dang co ${khai.length}`);
}
const BASE = khai[0]?.[1] ?? '/';
if (!BASE.startsWith('/') || !BASE.endsWith('/')) {
  loi.push(`BASE phai bat dau va ket thuc bang "/", dang la "${BASE}"`);
}

// 2. Manifest PWA.
const duongManifest = 'dist/manifest.webmanifest';
if (!existsSync(duongManifest)) {
  loi.push(`Chua co ${duongManifest} - chay "npm run build" truoc`);
} else {
  const m = JSON.parse(readFileSync(duongManifest, 'utf8'));
  if (m.start_url !== BASE) loi.push(`manifest start_url = "${m.start_url}", phai la "${BASE}"`);
  if (m.scope !== BASE) loi.push(`manifest scope = "${m.scope}", phai la "${BASE}"`);
  for (const icon of m.icons ?? []) {
    if (!icon.src.startsWith(BASE)) loi.push(`icon "${icon.src}" khong bat dau bang "${BASE}"`);
    const tren = join('dist', icon.src.slice(BASE.length));
    if (!existsSync(tren)) loi.push(`icon "${icon.src}" khai trong manifest nhung khong co file ${tren}`);
  }
}

// 3. Duong dan viet cung trong ban build.
const CAM = /(?<!\.)["'`(]\/(assets|icons)\//g;
const thuMuc = 'dist/assets';
if (existsSync(thuMuc)) {
  for (const ten of readdirSync(thuMuc)) {
    if (!/\.(js|css)$/.test(ten)) continue;
    const noiDung = readFileSync(join(thuMuc, ten), 'utf8');
    const dinh = noiDung.match(CAM);
    if (dinh && BASE !== '/') {
      loi.push(`${ten}: con ${dinh.length} duong dan viet cung (${[...new Set(dinh)].join(', ')}) - phai di qua assetUrl()`);
    }
  }
}

if (loi.length > 0) {
  console.error('check:base HONG');
  for (const d of loi) console.error(`  - ${d}`);
  process.exit(1);
}
console.log(`check:base OK - BASE = "${BASE}", manifest va icon khop.`);
