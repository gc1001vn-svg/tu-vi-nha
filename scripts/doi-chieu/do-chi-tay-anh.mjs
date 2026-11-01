// Do may tu do chi tay (dot 7 phan 3, QUY_UOC muc 27) tren BAN DUNG that trong Chromium, goi thang `doAnhTay` (cung duong chay voi
// app). Anh: 8 anh ban tay Wikimedia Commons (CC BY, CC BY-SA — khong tim duoc anh tay pham vi cong cong) tai vao thu muc tam, KHONG
// vao repo. Moi anh: anh goc 2 lan (phai ra y het) + ban "chup lai" (xoay 4°, thu 0,9) → so o trung; so o trung giua cac ban tay KHAC
// nhau (cao = may doan rap khuon); ghi anh to duong ra thu muc tam de soat bang mat. 3 anh cuoi phai bi tu choi (can da, hai long ban
// tay, ban quet mat ngon). Can `npm run build` truoc; Playwright cai chung may.
//   npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/do-chi-tay-anh.mjs <thu_muc_tam>
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const [ra = ''] = process.argv.slice(2);
if (ra === '') throw new Error('Thieu thu muc tam');
mkdirSync(ra, { recursive: true });

const MOT = ['Right_Hand_Palm.png', 'Single_transverse_palmar_crease_adult.jpg', 'La_palma_de_la_mano.jpg', 'Open_Palm_of_the_Left_Hand,_Fingers.jpg',
  'Palmistry.jpg'];
const TU_CHOI = ['Palm_hand.JPG', 'Bilateral_single_transverse_palmar_crease.jpg', 'Human_Palm.jpg'];
for (const f of [...MOT, ...TU_CHOI]) {
  if (existsSync(join(ra, f))) continue;
  const h = createHash('md5').update(f).digest('hex');
  const r = await fetch(`https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${f}/960px-${f}`,
    { headers: { 'user-agent': 'tu-vi-nha-do-chi-tay/1.0 (https://github.com/gc1001vn-svg/tu-vi-nha)' } });
  if (!r.ok) throw new Error(`Tai ${f}: HTTP ${String(r.status)} (Wikimedia gioi han luot thi cho roi chay lai)`);
  writeFileSync(join(ra, f), Buffer.from(await r.arrayBuffer()));
  await new Promise((x) => { setTimeout(x, 15_000); }); // tai lien mach Wikimedia tra 429 (28/10)
}

const DIST = new URL('../../dist/', import.meta.url).pathname;
const mp = readdirSync(join(DIST, 'assets')).find((f) => /^chiTayMp-.*\.js$/.test(f));
if (mp === undefined) throw new Error('Chua co ban dung: chay `npm run build` truoc');
const KIEU = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.task': 'application/octet-stream', '.html': 'text/html', '.css': 'text/css' };

/** Moi o thanh [ten, gia tri]; duong "khong thay / khong co" thi cac o kia khong tinh. */
const cacO = (k) => [['simian', k.simian], ...Object.entries(k.duong).flatMap(([d, o]) => Object.entries(o)
  .map(([t, g]) => [`${d}.${t}`, t !== 'seen' && o.seen === 'none' ? null : g]))];
const trung = (a, b) => { const y = new Map(cacO(b)); const x = cacO(a); return [x.filter(([t, g]) => y.get(t) === g).length, x.length]; };

const b = await chromium.launch();
try {
  const p = await b.newPage();
  await p.route('http://tvn.test/**', (r) => {
    const duong = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/tu-vi-nha\//, '') || 'index.html';
    return existsSync(join(DIST, duong)) ? r.fulfill({ body: readFileSync(join(DIST, duong)), contentType: KIEU[extname(duong)] ?? 'application/octet-stream' })
      : r.fulfill({ status: 404, body: '' });
  });
  await p.goto('http://tvn.test/tu-vi-nha/');
  /** Trong trang: doAnhTay tren anh (xoay > 0: ban "chup lai" xoay + thu 0,9 quanh tam). */
  const doTep = (f, xoay) => p.evaluate(async ([duong, s, kieu, d]) => {
    const m = await import(duong);
    let tep = new File([Uint8Array.from(atob(s), (c) => c.charCodeAt(0))], 'a', { type: kieu });
    if (d !== 0) {
      const a = await createImageBitmap(tep), c = document.createElement('canvas');
      c.width = a.width; c.height = a.height;
      const g = c.getContext('2d');
      g.fillStyle = '#888'; g.fillRect(0, 0, c.width, c.height);
      g.translate(c.width / 2, c.height / 2); g.rotate((d * Math.PI) / 180); g.scale(0.9, 0.9);
      g.drawImage(a, -a.width / 2, -a.height / 2);
      tep = new File([await new Promise((x) => { c.toBlob(x, 'image/jpeg', 0.9); })], 'b', { type: 'image/jpeg' });
    }
    try { return await m.doAnhTay(tep, () => undefined); } catch (e) { return { loi: e.message }; }
  }, [`/tu-vi-nha/assets/${mp}`, readFileSync(join(ra, f)).toString('base64'), f.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg', xoay]);

  const dau = [], cong = { a: [0, 0], b: [0, 0] };
  for (const f of [...MOT, ...TU_CHOI]) {
    const a1 = await doTep(f, 0);
    if (a1.loi !== undefined) { console.log(`${f}: ${MOT.includes(f) ? 'KHONG DO DUOC' : 'tu choi dung'} — ${a1.loi}`); continue; }
    const a2 = await doTep(f, 0), bb = await doTep(f, 4);
    writeFileSync(join(ra, `${f}.do.jpg`), Buffer.from(a1.anh.slice(a1.anh.indexOf(',') + 1), 'base64'));
    const [ta, na] = trung(a1.khung, a2.khung), [tb, nb] = bb.loi === undefined ? trung(a1.khung, bb.khung) : [0, 0];
    if (MOT.includes(f)) {
      cong.a = [cong.a[0] + ta, cong.a[1] + na];
      cong.b = [cong.b[0] + tb, cong.b[1] + nb];
      dau.push(a1.khung);
    }
    console.log(`${f.slice(0, 30).padEnd(30)} ${MOT.includes(f) ? '' : 'LE RA PHAI TU CHOI · '}cung anh ${String(ta)}/${String(na)} · chup lai `
      + `${bb.loi === undefined ? `${String(tb)}/${String(nb)}` : `loi: ${bb.loi}`} · tai ${(a1.taiMs / 1000).toFixed(1)} s, do ${(a1.doMs / 1000).toFixed(2)} s`
      + ` · ${JSON.stringify(a1.khung)}`);
  }
  const khac = [0, 0];
  dau.forEach((x, i) => { for (const y of dau.slice(i + 1)) { const [t, n] = trung(x, y); khac[0] += t; khac[1] += n; } });
  const pt = (x) => `${String(x[0])}/${String(x[1])} = ${((100 * x[0]) / (x[1] || 1)).toFixed(0)} %`;
  console.log(`O trung (${String(dau.length)} anh do duoc): cung anh 2 lan ${pt(cong.a)} · anh goc voi ban chup lai ${pt(cong.b)}`
    + ` · giua cac ban tay KHAC nhau ${pt(khac)} (thap hon dong truoc = may doc theo tung tay)`);
} finally {
  await b.close();
}
