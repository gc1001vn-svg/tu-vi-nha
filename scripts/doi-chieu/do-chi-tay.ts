// Đo chỉ tay thật (đợt 7 phần 3, kế hoạch docs/ke-hoach/2026-10-23-dot-7.md, QUY_UOC mục 27): ảnh bàn tay Wikimedia Commons
// (CC BY, CC BY-SA — không tìm được ảnh tay phạm vi công cộng; tải vào thư mục tạm, KHÔNG vào repo) → Chromium thu nhỏ, mã hoá
// lại như app (≤1024 px, JPEG 0,85 — kiểm ảnh ra không còn EXIF) và làm bản "chụp lại" (xoay 4°, thu 0,9) → Groq đọc bằng
// `docAnh` + `docKhung` của app: bản gốc 2 lần + bản chụp lại 1 lần → số ô trùng (ngưỡng ≥80 %). 3 ảnh cuối (cận da, hai bàn tay)
// phải bị từ chối (`palm` false). Khoá đọc từ GROQ_API_KEY — không in, không ghi file, không vào trình duyệt. Hết lượt (7.000
// token vào/phút) thì chờ theo lời Groq.
//   NODE_PATH=$(npm root -g) node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-chi-tay.ts <thư_mục_tạm>
// Ghi <thư_mục_tạm>/do-chi-tay.json (khung AI từng lần) — ngoài repo.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { LoiGroq, docAnh, loiTiengViet } from '../../src/giaoDien/ai/goi.ts';
import { LOI_DAN_CHI_TAY, cacO, docKhung, type KhungChiTay } from '../../src/loi/chiTay.ts';

const khoa = process.env['GROQ_API_KEY'];
if (khoa === undefined || khoa === '') {
  console.error('Thiếu GROQ_API_KEY: thêm khoá Groq vào bí mật môi trường cloud rồi mở phiên mới.');
  process.exit(1);
}
const [ra = ''] = process.argv.slice(2);
if (ra === '') throw new Error('Thiếu thư mục tạm');
mkdirSync(ra, { recursive: true });

/** Một bàn tay (đo), rồi ảnh phải từ chối: cận da, hai lòng bàn tay, hai bàn tay chồng nhau. */
const MOT = ['Human_Palm.jpg', 'Single_transverse_palmar_crease_adult.jpg', 'Right_Hand_Palm.png', 'La_palma_de_la_mano.jpg', 'Palmistry.jpg'];
const TU_CHOI = ['Palm_hand.JPG', 'Bilateral_single_transverse_palmar_crease.jpg', 'Open_Palm_of_the_Left_Hand,_Fingers.jpg'];

for (const f of [...MOT, ...TU_CHOI]) {
  if (existsSync(join(ra, f))) continue;
  const h = createHash('md5').update(f).digest('hex');
  const r = await fetch(`https://upload.wikimedia.org/wikipedia/commons/thumb/${h.slice(0, 1)}/${h.slice(0, 2)}/${f}/960px-${f}`,
    { headers: { 'user-agent': 'tu-vi-nha-do-chi-tay/1.0 (https://github.com/gc1001vn-svg/tu-vi-nha)' } });
  if (!r.ok) throw new Error(`Tai ${f}: HTTP ${String(r.status)} (Wikimedia gioi han luot thi cho roi chay lai)`);
  writeFileSync(join(ra, f), Buffer.from(await r.arrayBuffer()));
  await new Promise((x) => { setTimeout(x, 15_000); }); // tai lien mach Wikimedia tra 429 (28/10)
}

// Playwright cai chung may (NODE_PATH), khong co kieu trong repo.
const { chromium } = createRequire(import.meta.url)('playwright');
const trinh = await chromium.launch();
const trang = await trinh.newPage();

/** Trong trinh duyet: nhu `thuNho` cua app (≤1024 px, JPEG 0,85); `xoay` khac 0 thi xoay + thu 0,9 quanh tam (ban "chup lai"). */
const lamAnh = (tep: string, xoay: number): Promise<string> => trang.evaluate(async ([url, d]: [string, number]) => {
  const a = new Image();
  a.src = url;
  await a.decode();
  const ty = Math.min(1, 1024 / Math.max(a.naturalWidth, a.naturalHeight)), w = Math.round(a.naturalWidth * ty), h = Math.round(a.naturalHeight * ty);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (g === null) throw new Error('canvas');
  g.translate(w / 2, h / 2);
  g.rotate((d * Math.PI) / 180);
  if (d !== 0) g.scale(0.9, 0.9);
  g.drawImage(a, -w / 2, -h / 2, w, h);
  return c.toDataURL('image/jpeg', 0.85);
}, [`data:image/${tep.toLowerCase().endsWith('.png') ? 'png' : 'jpeg'};base64,${readFileSync(join(ra, tep)).toString('base64')}`, xoay]) as Promise<string>;

const coExif = (b: Buffer): boolean => b.subarray(0, 1 << 16).includes(Buffer.from('Exif\0\0', 'latin1'));

async function doc(anh: string): Promise<{ k: KhungChiTay | null; chu: string; giay: number }> {
  for (;;) {
    const bd = Date.now();
    try {
      const chu = await docAnh(khoa ?? '', LOI_DAN_CHI_TAY, anh);
      return { k: docKhung(chu), chu, giay: (Date.now() - bd) / 1000 };
    } catch (e) {
      if (!(e instanceof LoiGroq && e.ma === 429)) throw new Error(loiTiengViet(e));
      await new Promise((x) => { setTimeout(x, ((e.choGiay ?? 30) + 1) * 1000); });
    }
  }
}

const trung = (a: KhungChiTay | null, b: KhungChiTay | null): [number, number] => {
  const x = a === null ? [] : cacO(a), y = new Map(b === null ? [] : cacO(b));
  return [x.filter(([t, g]) => y.get(t) === g).length, x.length];
};

const ghi: Record<string, unknown> = {};
const cong = { a: [0, 0], b: [0, 0] };
/** Khung lan dau cua tung ban tay: so cac ban tay KHAC nhau — trung cao nghia la AI tra rap khuon, khong doc tay (28/10: 76 %). */
const dau: (KhungChiTay | null)[] = [];
console.log('ảnh | EXIF gốc→gửi | palm A1 A2 B | trùng A1–A2 | trùng A1–B | giây');
for (const f of [...MOT, ...TU_CHOI]) {
  const goc = readFileSync(join(ra, f)), anh = await lamAnh(f, 0), lai = await lamAnh(f, 4);
  const exif = `${coExif(goc) ? 'có' : 'không'}→${coExif(Buffer.from(anh.slice(anh.indexOf(',') + 1), 'base64')) ? 'CÓ' : 'không'}`;
  const a1 = await doc(anh), a2 = await doc(anh), b = await doc(lai);
  const [ta, na] = trung(a1.k, a2.k), [tb, nb] = trung(a1.k, b.k);
  if (MOT.includes(f)) {
    cong.a = [(cong.a[0] ?? 0) + ta, (cong.a[1] ?? 0) + na];
    cong.b = [(cong.b[0] ?? 0) + tb, (cong.b[1] ?? 0) + nb];
    dau.push(a1.k);
  }
  ghi[f] = { a1: a1.chu, a2: a2.chu, b: b.chu };
  console.log(`${f} | ${exif} | ${[a1, a2, b].map((x) => String(x.k?.palm ?? 'sai khuôn')).join(' ')} | ${String(ta)}/${String(na)} | `
    + `${String(tb)}/${String(nb)} | ${[a1, a2, b].map((x) => x.giay.toFixed(1)).join(' ')}`);
}
await trinh.close();
writeFileSync(join(ra, 'do-chi-tay.json'), JSON.stringify(ghi, null, 1));
const pt = (x: number[]): string => `${String(x[0])}/${String(x[1])} = ${((100 * (x[0] ?? 0)) / (x[1] || 1)).toFixed(0)} %`;
const khac = [0, 0];
dau.forEach((x, i) => { for (const y of dau.slice(i + 1)) { const [t, n] = trung(x, y); khac[0] = (khac[0] ?? 0) + t; khac[1] = (khac[1] ?? 0) + n; } });
console.log(`Ô trùng (${String(MOT.length)} ảnh một bàn tay): cùng ảnh 2 lần ${pt(cong.a)} · ảnh gốc với bản chụp lại ${pt(cong.b)} · ngưỡng ≥80 %`
  + ` · giữa các bàn tay KHÁC nhau ${pt(khac)} (gần bằng số trên = AI trả rập khuôn, không đọc tay)`);
