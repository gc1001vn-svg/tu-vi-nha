// Vong thu khoi Chi tay tren giao dien that (ke hoach docs/ke-hoach/2026-11-08-anh-chi-tay-bi-chan.md): ban dung (dist) trong Chromium
// gia iPhone 13 → the Tra cuu (ten, ngay sinh, noi sinh GIA) → mo khoi Chi tay → dua tung anh vao o chon anh → in moi anh: CO ANH
// (anh hien, da nap, rong bao nhieu tren man) hay KHONG CO ANH, kem chu bao loi; chup khoi ra <anh>.khoi.png canh anh.
// Anh bao 08/11: anh chup camera bi chan "chup nghieng" thi chi thay chu, khong xem duoc anh → ban sua phai ra CO ANH ca khi bi chan.
// Anh de NGOAI repo (anh mang giay phep mo, vd ban lam nghieng cua anh trong dap-an-chi-tay.json).
//   npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/thu-khoi-chi-tay.mjs dist <anh1> [anh2 ...]
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';
const pw = createRequire(import.meta.url)('playwright');
const [DIST, ...ANH] = process.argv.slice(2);
const KIEU = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.task': 'application/octet-stream', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const b = await pw.chromium.launch();
const ctx = await b.newContext({ ...pw.devices['iPhone 13'], serviceWorkers: 'block' });
const p = await ctx.newPage();
const loiTrang = [];
p.on('console', (m) => { if (m.type() === 'error') loiTrang.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => loiTrang.push('pageerror: ' + e.message.slice(0, 200)));
await p.route('http://localhost:4173/**', (r) => { const d = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/tu-vi-nha\//, '') || 'index.html';
  return existsSync(join(DIST, d)) ? r.fulfill({ body: readFileSync(join(DIST, d)), contentType: KIEU[extname(d)] ?? 'application/octet-stream' }) : r.fulfill({ status: 404, body: '' }); });
await p.goto('http://localhost:4173/tu-vi-nha/');
await p.getByRole('tab', { name: 'Tra cứu' }).click();
await p.locator('input[type=text]').first().fill('Thu');
await p.getByRole('button', { name: 'Nam' }).first().click();
await p.locator('input[placeholder^="vd 15031985"]').fill('15031985');
await p.locator('input[placeholder^="vd ha noi"]').fill('ha noi');
await p.getByRole('button', { name: /Hà Nội/ }).first().click();
await p.getByRole('button', { name: 'Xem' }).click();
const khoi = p.locator('details.khoi', { has: p.locator('summary', { hasText: 'Chỉ tay' }) });
await khoi.locator('summary').click();
await khoi.getByRole('button', { name: /Chụp hoặc chọn ảnh lòng bàn tay/ }).waitFor({ timeout: 20000 });
for (const a of ANH) {
  await khoi.locator('input[type=file]').setInputFiles(a);
  const kq = khoi.locator('img.anh-do, p.loi');
  await kq.first().waitFor({ timeout: 60000 });
  const anh = await khoi.locator('img.anh-do').evaluateAll((v) => v.map((i) => ({ nap: i.complete && i.naturalWidth > 0, tu: [i.naturalWidth, i.naturalHeight], hien: [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)], src: i.src.slice(0, 30) })));
  const loi = await khoi.locator('p.loi').allTextContents();
  console.log(a.split('/').pop(), anh.length ? 'CO ANH ' + JSON.stringify(anh[0]) : 'KHONG CO ANH', loi.length ? '| loi: ' + loi.join(' / ') : '');
  await khoi.screenshot({ path: a.replace(/\.[a-z]+$/i, '') + '.khoi.png' }).catch(() => {});
}
console.log('loi trang:', loiTrang.length ? loiTrang.join(' || ') : 'khong');
await b.close();
