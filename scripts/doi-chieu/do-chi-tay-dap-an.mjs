// Do may tu do chi tay theo DAP AN (ke hoach docs/ke-hoach/2026-11-06-may-do-chi-tay.md): chay ban dung that trong Chromium, goi thang
// `doAnhTay` (cung duong chay voi app). Anh lay tu `dap-an-chi-tay.json` (ten, nguon, giay phep, diem dap an) tai vao thu muc tam,
// KHONG vao repo. Moi anh:
//  - duong DUNG khi ≥ 2/3 diem dap an cach vet ≤ 0,06 L; SAI khi co vet ma khong du; THIEU khi dap an co ma khong ve; THUA khi dap an
//    ghi "khong co" ma may ve (dap an chi danh diem CHAC — Claude danh truoc khi sua may do, khong sua theo ket qua may);
//  - 5 ban nhieu (xoay ±5°, thu 0,85, toi 0,75, sang 1,25) → % o trung voi ban goc (bo o trong o mot trong hai), % o trong;
//  - o trung giua cac ban tay KHAC nhau (cao = may doan rap khuon).
//  - duoi duong tri (them 08/11): vet tri NHAY sang dap an duong tinh; o "dai" theo `duoiTri`; phan duoi co giu qua ban nhieu.
// Anh `rieng: true` (de rieng) chi bao so tong khi co `--ca-rieng`; luc chinh may do khong chay.
//   npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/do-chi-tay-dap-an.mjs <thu_muc_anh> [--dist <dist>] [--ca-rieng]
//     [--them <dap_an_rieng.json>]   (them anh khong vao repo, vd anh nguoi nha: cung khuon, file nam ngoai repo)
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const thamSo = process.argv.slice(2);
const lay = (ten) => { const i = thamSo.indexOf(ten); return i < 0 ? undefined : thamSo[i + 1]; };
const thuMuc = thamSo[0] ?? '';
if (thuMuc === '' || thuMuc.startsWith('--')) throw new Error('Thieu thu muc anh');
mkdirSync(thuMuc, { recursive: true });
const DIST = lay('--dist') ?? new URL('../../dist/', import.meta.url).pathname;
const caRieng = thamSo.includes('--ca-rieng');
const DAP_AN = JSON.parse(readFileSync(new URL('./dap-an-chi-tay.json', import.meta.url), 'utf8')).anh;
const them = lay('--them');
const nhanh = thamSo.includes('--nhanh'); // chi anh co dap an duong, bo ban nhieu — de chinh nhanh
const DS = [...DAP_AN, ...(them === undefined ? [] : JSON.parse(readFileSync(them, 'utf8')).anh)]
  .filter((a) => (caRieng || a.rieng !== true) && (!nhanh || a.duong !== undefined));

const UA = 'tu-vi-nha-do-chi-tay/1.0 (https://github.com/gc1001vn-svg/tu-vi-nha)';
for (const a of DS) {
  if (a.url === undefined || existsSync(join(thuMuc, a.ten))) continue;
  for (let lan = 0; ; lan++) {
    const r = await fetch(a.url, { headers: { 'user-agent': UA } });
    if (r.ok) { writeFileSync(join(thuMuc, a.ten), Buffer.from(await r.arrayBuffer())); break; }
    if (lan >= 3) throw new Error(`Tai ${a.ten}: HTTP ${String(r.status)} (Wikimedia gioi han luot thi cho roi chay lai, anh da tai duoc giu)`);
    await new Promise((x) => { setTimeout(x, 20_000 * (lan + 1)); });
  }
  await new Promise((x) => { setTimeout(x, 12_000); });
}

const mp = readdirSync(join(DIST, 'assets')).find((f) => /^chiTayMp-.*\.js$/.test(f));
if (mp === undefined) throw new Error('Chua co ban dung: chay `npm run build` truoc');
const KIEU = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.task': 'application/octet-stream', '.html': 'text/html', '.css': 'text/css' };
const NHIEU = [['xoay +5°', { xoay: 5 }], ['xoay −5°', { xoay: -5 }], ['thu 0,85', { thu: 0.85 }], ['tối 0,75', { sang: 0.75 }], ['sáng 1,25', { sang: 1.25 }]];
const DUONG = ['life', 'head', 'heart', 'fate'];

/** Moi o thanh [ten, gia tri]; duong "khong thay / khong co" thi cac o kia khong tinh. */
const cacO = (k) => [['simian', k.simian], ...Object.entries(k.duong).flatMap(([d, o]) => Object.entries(o)
  .map(([t, g]) => [`${d}.${t}`, t !== 'seen' && o.seen === 'none' ? undefined : g]))].filter(([, g]) => g !== undefined);
/** [so o trung, so o ca hai cung dien]: bo o trong (null) o mot trong hai. */
const trung = (a, b) => {
  const y = new Map(cacO(b));
  const ca = cacO(a).filter(([t, g]) => g !== null && y.get(t) !== null && y.get(t) !== undefined);
  return [ca.filter(([t, g]) => y.get(t) === g).length, ca.length];
};
const trong = (k) => { const o = cacO(k); return [o.filter(([, g]) => g === null).length, o.length]; };
/** Khoang cach diem p toi duong gay khuc v (diem anh). */
const kc = (p, v) => {
  if (v.length === 0) return Infinity;
  if (v.length === 1) return Math.hypot(p.x - v[0].x, p.y - v[0].y);
  let m = Infinity;
  for (let i = 0; i + 1 < v.length; i++) {
    const a = v[i], b = v[i + 1], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1e-9;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
    m = Math.min(m, Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy));
  }
  return m;
};

/**
 * Duoi duong tri (ke hoach 2026-11-06-duoi-duong-tri.md), tren ban goc hoac ban nhieu (`n`: diem dap an xoay / thu theo cung canvas):
 *  - NHAY: vet tri chay doc dap an duong tinh — ≥ 0,05 L vet cach duong tinh ≤ 0,04 L ma cach dap an duong tri > 0,06 L (chi xet anh
 *    co dap an ca hai duong, khong phai chi tay ngang);
 *  - o "dai" duong tri so voi `duoiTri` — `cuoi`: diem cuoi chac; `toiIt`: duong tri toi it nhat toi day — cung nguong voi loi may do
 *    (moc ngon: ut + 1/4 khoang ut → ap ut; giua khoang giua → ap ut), diem dap an sat nguong ± 0,04 L thi nhan ca hai bac.
 */
const THU = ['short', 'medium', 'long'];
const phanDuoi = (a, g, n = {}) => {
  const [w, h] = g.co, L = g.L, goc = ((n.xoay ?? 0) * Math.PI) / 180, s = n.thu ?? 1;
  const ve = ([x, y]) => { // diem dap an (0–1 anh goc) → diem anh dang do, qua phep xoay / thu quanh tam canvas
    const dx = (x - 0.5) * w, dy = (y - 0.5) * h;
    return { x: w / 2 + s * (Math.cos(goc) * dx - Math.sin(goc) * dy), y: h / 2 + s * (Math.sin(goc) * dx + Math.cos(goc) * dy) };
  };
  const kq = { nhay: null, lop: null, moTa: [] }, daTri = a.duong?.head, daTinh = a.duong?.heart, vTri = g.vetAnh.head;
  if (Array.isArray(daTri) && Array.isArray(daTinh) && JSON.stringify(daTri) !== JSON.stringify(daTinh)) {
    const pTri = daTri.map(ve), pTinh = daTinh.map(ve);
    kq.nhay = vTri.filter((q) => kc(q, pTinh) <= 0.04 * L && kc(q, pTri) > 0.06 * L).length / 160; // vet cach nhau ~1/160 L
    kq.moTa.push(kq.nhay >= 0.05 ? `đuôi trí NHẢY sang đường tình ${kq.nhay.toFixed(2)} L` : 'đuôi trí không nhảy');
  }
  if (a.duoiTri !== undefined) {
    const p = ve(a.duoiTri.cuoi ?? a.duoiTri.toiIt), { o, xv } = g.khungAnh, m = g.mocChuan;
    const X = ((p.x - o.x) * xv.x + (p.y - o.y) * xv.y) / L;
    const nDai = m.ut.x + 0.25 * (m.apUt.x - m.ut.x), nNgan = (m.giua.x + m.apUt.x) / 2;
    const lop = X <= nDai ? 'long' : X >= nNgan ? 'short' : 'medium', satDai = Math.abs(X - nDai) < 0.04, satNgan = Math.abs(X - nNgan) < 0.04;
    const nhan = a.duoiTri.cuoi !== undefined ? (satDai ? ['medium', 'long'] : satNgan ? ['short', 'medium'] : [lop])
      : THU.slice(THU.indexOf(satDai ? 'medium' : satNgan ? 'short' : lop));
    const may = g.khung.duong.head.length;
    kq.lop = may === null ? 'trong' : nhan.includes(may) ? 'dung' : 'sai';
    kq.moTa.push(`ô dài trí ${may ?? 'trống'} (đáp án ${nhan.join('/')}) ${{ trong: 'trống', dung: 'đúng', sai: 'SAI' }[kq.lop]}`);
  }
  return kq;
};

const b = await chromium.launch();
try {
  const p = await b.newPage();
  await p.route('http://tvn.test/**', (r) => {
    const duong = decodeURIComponent(new URL(r.request().url()).pathname).replace(/^\/tu-vi-nha\//, '') || 'index.html';
    return existsSync(join(DIST, duong)) ? r.fulfill({ body: readFileSync(join(DIST, duong)), contentType: KIEU[extname(duong)] ?? 'application/octet-stream' })
      : r.fulfill({ status: 404, body: '' });
  });
  await p.goto('http://tvn.test/tu-vi-nha/');
  /** Trong trang: moi anh ve lai qua canvas (nen xam cho anh PNG trong suot, cat `cat`, xoay, thu, sang) roi doAnhTay; `gioi` cho may
   * biet tay can xem (ban dung cu bo qua tham so nay). Ban goc va ban nhieu di cung mot duong. */
  const doTep = (a, nhieu) => p.evaluate(async ([duong, s, n, g, cat]) => {
    const m = await import(duong);
    const goc = await createImageBitmap(new Blob([Uint8Array.from(atob(s), (c) => c.charCodeAt(0))]));
    const [x0, y0, x1, y1] = cat ?? [0, 0, 1, 1], sx = Math.round(x0 * goc.width), sy = Math.round(y0 * goc.height);
    const cw = Math.round((x1 - x0) * goc.width), ch = Math.round((y1 - y0) * goc.height);
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const x = c.getContext('2d');
    x.fillStyle = '#888'; x.fillRect(0, 0, cw, ch);
    if (n.sang !== undefined) x.filter = `brightness(${String(n.sang)})`;
    x.translate(cw / 2, ch / 2); x.rotate(((n.xoay ?? 0) * Math.PI) / 180); x.scale(n.thu ?? 1, n.thu ?? 1);
    x.drawImage(goc, sx, sy, cw, ch, -cw / 2, -ch / 2, cw, ch);
    const tep = new File([await new Promise((y) => { c.toBlob(y, 'image/jpeg', 0.92); })], 'b', { type: 'image/jpeg' });
    try { return await m.doAnhTay(tep, () => undefined, g); } catch (e) { return { loi: e.message }; }
  }, [`/tu-vi-nha/assets/${mp}`, readFileSync(join(thuMuc, a.ten)).toString('base64'), nhieu, a.gioi ?? 'nam', a.cat ?? null]);

  const tong = { dung: 0, sai: 0, thieu: 0, thua: 0, khongCo: 0, theoDuong: {} }, on = [0, 0], tr = [0, 0], dau = [], thoiGian = [];
  const tuChoi = { dung: 0, sot: 0 }, ngang = { bao: 0, anh: 0, saiDapAn: 0 };
  const duoi = { nhay: 0, coHai: 0, dung: 0, sai: 0, trong: 0, giu: [0, 0] }; // giu: phan duoi ban nhieu trung ban goc
  for (const a of DS) {
    if (!existsSync(join(thuMuc, a.ten))) { console.log(`${a.ten}: chua tai`); continue; }
    const g = await doTep(a, {});
    const ma = a.cat === undefined ? a.ten : `${a.ten}@${a.cat[0] === 0 ? 'trai' : 'phai'}`;
    const tieu = ma.slice(0, 34).padEnd(34);
    if (g.loi !== undefined) {
      const dungTuChoi = a.tuChoi === true;
      console.log(`${tieu} ${dungTuChoi ? 'từ chối đúng' : 'KHÔNG ĐO ĐƯỢC'} — ${g.loi}`);
      if (dungTuChoi) tuChoi.dung += 1; else tong.khongCo += 1;
      continue;
    }
    if (a.tuChoi === true) {
      console.log(`${tieu} ${g.nhac ? `nhắc đúng: ${g.nhac}` : `LẼ RA PHẢI TỪ CHỐI / NHẮC (${a.ghiChu ?? ''})`}`);
      if (g.nhac) tuChoi.dung += 1; else tuChoi.sot += 1;
      continue;
    }
    ngang.anh += 1;
    if (g.khung.simian === true) ngang.bao += 1;
    if (a.simian !== undefined && g.khung.simian !== null && g.khung.simian !== a.simian) ngang.saiDapAn += 1;
    writeFileSync(join(thuMuc, `${ma}.do.jpg`), Buffer.from(g.anh.slice(g.anh.indexOf(',') + 1), 'base64'));
    thoiGian.push(g.doMs);
    const [w, h] = g.co, L = g.L;
    const ketDuong = DUONG.map((d) => {
      const da = a.duong?.[d], vet = g.vetAnh[d];
      if (da === undefined) return `${d} ·`; // khong danh dap an duong nay (khong chac)
      const td = (tong.theoDuong[d] ??= { dung: 0, sai: 0, thieu: 0, thua: 0 });
      if (da === null) { const x = vet.length > 0 ? 'thua' : 'dung'; tong[x] += 1; td[x] += 1; return `${d} ${x === 'dung' ? 'đúng (không có)' : 'THỪA'}`; }
      if (vet.length === 0) { tong.thieu += 1; td.thieu += 1; return `${d} THIẾU`; }
      const gan = da.filter(([x, y]) => kc({ x: x * w, y: y * h }, vet) <= 0.06 * L).length;
      const x = gan * 3 >= da.length * 2 ? 'dung' : 'sai';
      tong[x] += 1; td[x] += 1;
      return `${d} ${x === 'dung' ? 'đúng' : 'SAI'} ${String(gan)}/${String(da.length)}`;
    });
    const dg = phanDuoi(a, g);
    if (dg.nhay !== null) { duoi.coHai += 1; if (dg.nhay >= 0.05) duoi.nhay += 1; }
    if (dg.lop !== null) duoi[dg.lop] += 1;
    const nh = [];
    for (const [ten, n] of nhanh ? [] : NHIEU) {
      const r = await doTep(a, n);
      if (r.loi !== undefined) { nh.push(`${ten}: lỗi`); continue; }
      const [t, n2] = trung(g.khung, r.khung);
      on[0] += t; on[1] += n2;
      const dn = phanDuoi(a, r, n);
      if (dg.nhay !== null || dg.lop !== null) {
        duoi.giu[1] += 1;
        if ((dn.nhay === null || (dn.nhay >= 0.05) === (dg.nhay >= 0.05)) && dn.lop === dg.lop) duoi.giu[0] += 1;
      }
      nh.push(`${ten} ${String(t)}/${String(n2)}`);
    }
    const [o0, o1] = trong(g.khung);
    tr[0] += o0; tr[1] += o1;
    if (a.rieng !== true) dau.push(g.khung);
    console.log(`${tieu} ${[...ketDuong, ...dg.moTa].join(' · ')} · trống ${String(o0)}/${String(o1)} · ${(g.doMs / 1000).toFixed(2)} s${g.nhac ? ` · nhắc: ${g.nhac}` : ''}`);
    console.log(`${' '.repeat(35)}nhiễu: ${nh.join(' · ')} · ${JSON.stringify(g.khung)}`);
  }
  const khac = [0, 0];
  dau.forEach((x, i) => { for (const y of dau.slice(i + 1)) { const [t, n] = trung(x, y); khac[0] += t; khac[1] += n; } });
  const pt = (x) => `${String(x[0])}/${String(x[1])} = ${((100 * x[0]) / (x[1] || 1)).toFixed(0)} %`;
  console.log(`\nĐường: đúng ${String(tong.dung)} · sai ${String(tong.sai)} · thiếu ${String(tong.thieu)} · thừa ${String(tong.thua)} · ảnh không đo được ${String(tong.khongCo)}`
    + ` · theo đường ${JSON.stringify(tong.theoDuong)}`);
  console.log(`Mu bàn tay, hai tay: từ chối / nhắc đúng ${String(tuChoi.dung)} · sót ${String(tuChoi.sot)} · báo chỉ tay ngang ${String(ngang.bao)}/${String(ngang.anh)} ảnh`
    + ` lòng tay (sai đáp án ${String(ngang.saiDapAn)})`);
  console.log(`Đuôi trí: nhảy sang đường tình ${String(duoi.nhay)}/${String(duoi.coHai)} ảnh có đáp án hai đường · ô dài trí theo đáp án đuôi:`
    + ` đúng ${String(duoi.dung)} · sai ${String(duoi.sai)} · trống ${String(duoi.trong)} · phán đuôi giữ qua bản nhiễu ${pt(duoi.giu)}`);
  console.log(`Chụp lại (5 bản nhiễu): ô trùng ${pt(on)} · ô trống ${pt(tr)} · giữa các bàn tay khác nhau ${pt(khac)}`
    + ` · dò ${thoiGian.length === 0 ? '—' : `${(Math.max(...thoiGian) / 1000).toFixed(2)} s chậm nhất`}`);
} finally {
  await b.close();
}
