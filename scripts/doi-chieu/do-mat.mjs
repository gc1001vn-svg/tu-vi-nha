// Do khoi "Tuong mat" (dot 7 phan 2) tren BAN DUNG that trong Chromium, goi thang `doAnh` (cung duong chay voi app).
// Anh: chan dung chinh thuc chinh phu My, NASA (pham vi cong cong) tai tu upload.wikimedia.org vao thu muc tam — KHONG vao repo.
// 7 anh dau: do 2 lan (phai cung so) + ban lat guong (lech %); 50 anh them (24/10) mot lan, in phan bo de dat nguong loi giai. Them: anh tron (phai bao khong thay mat), hai nguoi nho (phai tu
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
// Them 24/10 de dat nguong loi giai (QUY_UOC muc 26): chan dung chinh thuc Quoc hoi, Toa toi cao, noi cac, NASA — phan dong
// Dong A (`DONG_A`) vi nguoi dung la nguoi Viet. Chi do mot luot (khong lap, khong lat guong): lay phan bo tung ti le.
const DONG_A = ['Rep._Derek_Tran_Official_Portrait.jpg', 'Rep._Dave_Min_Official_Portrait.jpg', 'Rep._Jill_Tokuda_official_photo,_118th_Congress.jpg',
  'Andy_Kim,_official_portrait,_116th_Congress.jpg', 'Norman_Mineta,_official_portrait,_DOT.jpg', 'Eric_Shinseki_official_Veterans_Affairs_portrait.jpg',
  'Judy_Chu_official_portrait.jpg', 'Tammy_Duckworth,_official_portrait,_115th_Congress.jpg', 'Mazie_Hirono,_official_portrait,_113th_Congress.jpg',
  'Elaine_Chao_official_portrait.jpg', 'Steven_Chu_official_DOE_portrait.jpg', 'Gary_Locke_official_portrait.jpg', 'Jonny_Kim_official_portrait.jpg',
  'Ellison_Onizuka.jpg', 'Daniel_Inouye,_official_Senate_photo_portrait,_2008.jpg', 'Colleen_Hanabusa_official_photo.jpg',
  'General_Paul_M._Nakasone_(NSA).jpg', 'Mark_Takai_official_portrait.jpg', 'MG_Viet_X._Luong.jpg'];
const THEM = [...DONG_A, 'Raja_Chari_portrait.jpg', 'Ami_Bera,_Official_Portrait,_115th_Congress_(cropped).jpg',
  'Pramila_Jayapal,_official_portrait,_116th_Congress.jpg', 'Ro_Khanna,_official_portrait,_115th_Congress.jpg', 'Chuck_Grassley_official_photo_2017.jpg',
  'Bernie_Sanders.jpg', 'Mitch_McConnell_2016_official_photo.jpg', 'Elizabeth_Warren,_official_portrait,_114th_Congress.jpg', 'Official_roberts_CJ.jpg',
  'Sonia_Sotomayor_in_SCOTUS_robe.jpg', 'Antonin_Scalia_Official_SCOTUS_Portrait.jpg', 'Clarence_Thomas_official_SCOTUS_portrait.jpg',
  'Ruth_Bader_Ginsburg_2016_portrait.jpg', 'Stephen_Breyer,_SCOTUS_photo_portrait.jpg', 'Samuel_Alito_official_photo.jpg',
  'Amy_Coney_Barrett_official_portrait.jpg', 'Donald_Trump_official_portrait.jpg', 'George-W-Bush.jpeg', 'Bill_Clinton.jpg', 'Ronald_Reagan_1985_presidential_portrait.jpg',
  // Quan doi, FBI: phan dong mat nghiem — anh cuoi lam lech mieng, mui, may cach mat (do 24/10)
  'GEN_Mark_A._Milley_portrait.jpg', 'David_C_Jones_official_portrait.jpg', 'Maxwell_D_Taylor_official_portrait.jpg',
  'Henry_Shelton_official_portrait.jpg', 'Official_Portrait_of_FBI_Director_Kash_Patel.jpg', 'Pete_Hegseth_Official_Portrait.jpg',
  'Robert_S._Mueller_official_portrait.jpg', 'Dr._Mark_T._Esper_–_Secretary_of_Defense.jpg', 'Richard_Myers_official_portrait.jpg',
  'Peter_Pace_official_portrait.jpg', 'James_Mattis_official_photo.jpg', 'James_Comey_official_portrait.jpg'];
for (const f of [...ANH, ...THEM]) {
  if (existsSync(join(ra, f))) continue;
  const h = createHash('md5').update(f).digest('hex');
  const goc = `https://upload.wikimedia.org/wikipedia/commons/${h[0]}/${h.slice(0, 2)}/${f}`;
  const tai = (u) => fetch(u, { headers: { 'user-agent': 'tu-vi-nha-do-mat/1.0 (https://github.com/gc1001vn-svg/tu-vi-nha)' } });
  let r = await tai(`${goc.replace('/commons/', '/commons/thumb/')}/960px-${f}`);
  if (!r.ok) r = await tai(goc); // anh nho hon 960 px: Wikimedia khong phong to, lay ban goc
  if (!r.ok) throw new Error(`Tai ${f}: HTTP ${String(r.status)} (Wikimedia gioi han luot thi cho roi chay lai)`);
  writeFileSync(join(ra, f), Buffer.from(await r.arrayBuffer()));
  await new Promise((x) => { setTimeout(x, 1500); }); // tai lien mach Wikimedia tra 429 (24/10)
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
  const them = [];
  for (const f of THEM) them.push({ f, a: await p.evaluate((s) => window.doTep(window.tuB64(s)), b64(f)) });
  // Ca loi: anh tron; hai nguoi nho (hai anh nguyen canh nhau); hai nguoi to (vung tren giua moi anh, 500×500).
  const [s1, s2] = [b64(ANH[3]), b64(ANH[5])], [t1, t2] = [b64(ANH[1]), b64(ANH[2])];
  const loi = await p.evaluate(async ([s1, s2, t1, t2]) => ({
    tron: await window.doTep(window.ghep(800, 1000, [])),
    haiNho: await window.doTep(window.ghep(1920, 1200, [[s1, 0, 0, 1, 1, 0, 0, 960, 1200], [s2, 0, 0, 1, 1, 960, 0, 960, 1200]])),
    haiTo: await window.doTep(window.ghep(1000, 500, [[t1, 0.2, 0.05, 0.6, 0.6, 0, 0, 500, 500], [t2, 0.2, 0.05, 0.6, 0.6, 500, 0, 500, 500]])),
  }), [s1, s2, t1, t2]);
  writeFileSync(join(ra, 'do-mat.json'), JSON.stringify({ kq, them, loi }, null, 1));

  const lech = {};
  for (const { f, lan: [a, a2, l] } of kq) {
    if (a.loi || a2.loi || l.loi) { console.log(`${f}: LOI ${a.loi ?? a2.loi ?? l.loi}`); continue; }
    const cung = JSON.stringify(a.so) === JSON.stringify(a2.so);
    for (const k of Object.keys(a.so)) lech[k] = Math.max(lech[k] ?? 0, Math.abs(l.so[k] / a.so[k] - 1) * 100);
    console.log(`${f.slice(0, 28).padEnd(28)} 1 mat · 2 lan ${cung ? 'cung so' : 'KHAC SO'} · ±${a.lech.toFixed(1)}% · goc quay ${a.goc.quay.toFixed(1)}°`
      + ` ngua ${a.goc.ngua.toFixed(1)}° · tai ${(a.taiMs / 1000).toFixed(1)}s do ${(a.doMs / 1000).toFixed(2)}s`);
  }
  console.log('Lat guong lech toi da (%):', Object.entries(lech).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(', '));
  // Phan bo tung ti le (luot dau moi anh): phan vi 10/25/50/75/90; trung vi rieng nhom Dong A va nhom anh it cuoi.
  const tat = [...kq.map(({ f, lan: [a] }) => ({ f, a })), ...them].filter(({ f, a }) => {
    if (a.loi) console.log(`${f}: LOI ${a.loi}`);
    return !a.loi;
  });
  const pv = (xs, q) => { const t = [...xs].sort((x, y) => x - y), i = (t.length - 1) * q, d = Math.floor(i); return t[d] + (t[Math.min(d + 1, t.length - 1)] - t[d]) * (i - d); };
  const nhom = { 'tat ca': tat, 'Dong A': tat.filter(({ f }) => DONG_A.includes(f)), 'cuoi<0.2': tat.filter(({ a }) => a.cuoi < 0.2) };
  console.log(`Cuoi (0-1): ${tat.map(({ f, a }) => `${f.slice(0, 12)} ${a.cuoi.toFixed(2)}`).join(' · ')}`);
  console.log(`${'ti le'.padEnd(10)} ${'p10 p25 p50 p75 p90 (tat ca, n='.padEnd(30)}${String(tat.length)})  p50 Dong A (n=${String(nhom['Dong A'].length)})  p25 p50 p75 khong cuoi (n=${String(nhom['cuoi<0.2'].length)})`);
  for (const k of Object.keys(tat[0].a.so)) {
    const xs = (g) => g.map(({ a }) => a.so[k]);
    console.log(`${k.padEnd(10)} ${[0.1, 0.25, 0.5, 0.75, 0.9].map((q) => pv(xs(tat), q).toFixed(3)).join(' ').padEnd(36)}`
      + `${pv(xs(nhom['Dong A']), 0.5).toFixed(3).padEnd(22)}${[0.25, 0.5, 0.75].map((q) => pv(xs(nhom['cuoi<0.2']), q).toFixed(3)).join(' ')}`);
  }
  console.log('Anh tron:', loi.tron.loi ?? 'RA SO (sai)', '| hai nguoi nho:', loi.haiNho.loi ?? 'RA SO (sai)', '| hai nguoi to:', loi.haiTo.loi ?? 'RA SO (sai)');
} finally {
  await b.close();
}
