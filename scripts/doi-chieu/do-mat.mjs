// Do khoi "Tuong mat" (dot 7 phan 2) tren BAN DUNG that trong Chromium, goi thang `doAnh` (cung duong chay voi app).
// Anh: chan dung chinh thuc chinh phu My, NASA (pham vi cong cong) tai tu upload.wikimedia.org vao thu muc tam — KHONG vao repo.
// Moi anh: do 2 lan (phai cung so) + ban lat guong (lech %). Them: anh tron (phai bao khong thay mat), hai nguoi nho (phai tu
// choi), hai nguoi to (phai bao 2 mat). Can `npm run build` truoc; Playwright cai chung may. QUY_UOC muc 26.
//   npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/do-mat.mjs <thu_muc_tam>
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const [ra = ''] = process.argv.slice(2);
if (ra === '') throw new Error('Thieu thu muc tam');
mkdirSync(ra, { recursive: true });

const ANH = ['Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg', 'Joe_Biden_presidential_portrait.jpg',
  'Kamala_Harris_Vice_Presidential_Portrait.jpg', 'Mae_Carol_Jemison.jpg', 'Michelle_Obama_2013_official_portrait.jpg',
  'Neil_Armstrong_pose.jpg', 'President_Barack_Obama.jpg'];
for (const f of ANH) {
  if (existsSync(join(ra, f))) continue;
  const h = createHash('md5').update(f).digest('hex');
  const r = await fetch(`https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${f}/960px-${f}`,
    { headers: { 'user-agent': 'tu-vi-nha-do-mat/1.0 (https://github.com/gc1001vn-svg/tu-vi-nha)' } });
  if (!r.ok) throw new Error(`Tai ${f}: HTTP ${String(r.status)} (Wikimedia gioi han luot thi cho roi chay lai)`);
  writeFileSync(join(ra, f), Buffer.from(await r.arrayBuffer()));
}

const DIST = new URL('../../dist/', import.meta.url).pathname;
const mp = readdirSync(join(DIST, 'assets')).find((f) => /^tuongMatMp-.*\.js$/.test(f));
if (mp === undefined) throw new Error('Chua co ban dung: chay `npm run build` truoc');
const KIEU = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.task': 'application/octet-stream' };
const b64 = (f) => readFileSync(join(ra, f)).toString('base64');

const b = await chromium.launch();
try {
  const p = await b.newPage();
  // Phuc vu dist/ qua route (nguon http rieng, khong can may chu). Mo app that: khoi do dung chung ma voi goi chinh.
  await p.route('http://tvn.test/**', (r) => {
    const duong = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/tu-vi-nha\//, '') || 'index.html';
    const kieu = { ...KIEU, '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };
    return existsSync(join(DIST, duong))
      ? r.fulfill({ body: readFileSync(join(DIST, duong)), contentType: kieu[extname(duong)] ?? 'application/octet-stream' })
      : r.fulfill({ status: 404, body: '' });
  });
  await p.goto('http://tvn.test/tu-vi-nha/');
  await p.evaluate(async (duong) => {
    const m = await import(duong);
    const tep = (blob) => new File([blob], 'a.jpg', { type: 'image/jpeg' });
    const tuB64 = (s) => tep(new Blob([Uint8Array.from(atob(s), (c) => c.charCodeAt(0))]));
    // Ve cac anh (cung co, vi tri vung lay) len mot canvas w×h roi ra file JPEG.
    window.ghep = async (w, h, ds, lat = false) => {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.fillStyle = '#777'; g.fillRect(0, 0, w, h);
      if (lat) { g.translate(w, 0); g.scale(-1, 1); }
      for (const [s, sx, sy, sw, sh, dx, dy, dw, dh] of ds) {
        const a = await createImageBitmap(tuB64(s));
        g.drawImage(a, sx * a.width, sy * a.height, sw * a.width, sh * a.height, dx, dy, dw, dh);
      }
      return tep(await new Promise((x) => { c.toBlob(x, 'image/jpeg', 0.95); }));
    };
    window.doTep = async (f) => { try { return await m.doAnh(await f, () => undefined); } catch (e) { return { loi: e.message }; } };
    window.tuB64 = tuB64;
  }, `/tu-vi-nha/assets/${mp}`);

  const kq = [];
  for (const f of ANH) {
    const s = b64(f);
    const lan = await p.evaluate(async (s) => {
      const a = await createImageBitmap(window.tuB64(s));
      const lat = window.ghep(a.width, a.height, [[s, 0, 0, 1, 1, 0, 0, a.width, a.height]], true);
      return [await window.doTep(window.tuB64(s)), await window.doTep(window.tuB64(s)), await window.doTep(lat)];
    }, s);
    kq.push({ f, lan });
  }
  // Ca loi: anh tron; hai nguoi nho (hai anh nguyen canh nhau); hai nguoi to (vung tren giua moi anh, 500×500).
  const [s1, s2] = [b64(ANH[3]), b64(ANH[5])], [t1, t2] = [b64(ANH[1]), b64(ANH[2])];
  const loi = await p.evaluate(async ([s1, s2, t1, t2]) => ({
    tron: await window.doTep(window.ghep(800, 1000, [])),
    haiNho: await window.doTep(window.ghep(1920, 1200, [[s1, 0, 0, 1, 1, 0, 0, 960, 1200], [s2, 0, 0, 1, 1, 960, 0, 960, 1200]])),
    haiTo: await window.doTep(window.ghep(1000, 500, [[t1, 0.2, 0.05, 0.6, 0.6, 0, 0, 500, 500], [t2, 0.2, 0.05, 0.6, 0.6, 500, 0, 500, 500]])),
  }), [s1, s2, t1, t2]);
  writeFileSync(join(ra, 'do-mat.json'), JSON.stringify({ kq, loi }, null, 1));

  const lech = {};
  for (const { f, lan: [a, a2, l] } of kq) {
    if (a.loi || a2.loi || l.loi) { console.log(`${f}: LOI ${a.loi ?? a2.loi ?? l.loi}`); continue; }
    const cung = JSON.stringify(a.so) === JSON.stringify(a2.so);
    for (const k of Object.keys(a.so)) lech[k] = Math.max(lech[k] ?? 0, Math.abs(l.so[k] / a.so[k] - 1) * 100);
    console.log(`${f.slice(0, 28).padEnd(28)} 1 mat · 2 lan ${cung ? 'cung so' : 'KHAC SO'} · ±${a.lech.toFixed(1)}% · goc quay ${a.goc.quay.toFixed(1)}°`
      + ` ngua ${a.goc.ngua.toFixed(1)}° · tai ${(a.taiMs / 1000).toFixed(1)}s do ${(a.doMs / 1000).toFixed(2)}s`);
  }
  console.log('Lat guong lech toi da (%):', Object.entries(lech).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(', '));
  console.log('Anh tron:', loi.tron.loi ?? 'RA SO (sai)', '| hai nguoi nho:', loi.haiNho.loi ?? 'RA SO (sai)', '| hai nguoi to:', loi.haiTo.loi ?? 'RA SO (sai)');
} finally {
  await b.close();
}
