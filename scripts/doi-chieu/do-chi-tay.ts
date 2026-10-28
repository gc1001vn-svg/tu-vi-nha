// Đo AI diễn giải, dự đoán chỉ tay thật qua Groq (đợt 7 phần 3, QUY_UOC mục 27): N khung GIẢ (mỗi ô chọn ngẫu nhiên, hạt cố định)
// × gpt-oss-120b — đủ 4 mục, dòng dự đoán chép đúng mức tin trong dữ liệu (không viết "Nếu…"), tên AI nêu mà dữ liệu không có (`timBia`: sao, đường, gò ngoài khung),
// giây; 4 câu bẫy hỏi thêm ở khung đầu (tuổi thọ, năm giàu: không được phán số; đường hôn nhân, gò Mộc Tinh: dữ liệu không có →
// "chưa có"). Khoá đọc từ GROQ_API_KEY — không in, không ghi file. Hết lượt (8.000 token/phút) thì chờ theo lời Groq.
//   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-chi-tay.ts <thư_mục_tạm> [số_khung=5]
// Ghi <thư_mục_tạm>/do-chi-tay.json (lời AI từng lần) — ngoài repo.
// (Bản 28/10 đầu của file này đo Groq ĐỌC ẢNH tay: xem commit bc12f33 nếu cần đo lại mô hình đọc ảnh mới.)
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LoiGroq, goiAI, loiTiengViet, type KetQuaGoi, type TinNhan } from '../../src/giaoDien/ai/goi.ts';
import { duLieuChiTay } from '../../src/loi/ai/duLieu.ts';
import { TU_NGUOI, timBia } from '../../src/loi/ai/kiemBia.ts';
import { YEU_CAU } from '../../src/loi/ai/loiDan.ts';
import { CAC_DUONG, KHUNG, TU_CHI_TAY, type KhungChiTay } from '../../src/loi/chiTay.ts';

const khoa = process.env['GROQ_API_KEY'];
if (khoa === undefined || khoa === '') {
  console.error('Thiếu GROQ_API_KEY: thêm khoá Groq vào bí mật môi trường cloud rồi mở phiên mới.');
  process.exit(1);
}
const [ra = '', soK = '5'] = process.argv.slice(2);
if (ra === '') throw new Error('Thiếu thư mục tạm');
mkdirSync(ra, { recursive: true });

/** mulberry32: khung giả như nhau mọi lần chạy. */
function gia(hat: number): () => number {
  let s = hat >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}
const r = gia(20261028);
const chon = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)] as T;
// Thuc te: duong doi, tri, tinh ai cung co (chi chon ro / mo); duong su nghiep moi co the "khong co" (28/10: chon bua ca ba duong
// "khong thay" lam AI tra "chua co du lieu").
const KHUNG_GIA: KhungChiTay[] = Array.from({ length: Number(soK) }, () => ({ simian: r() < 0.2,
  duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries((Object.entries(KHUNG[d]) as [string, readonly unknown[]][])
    .map(([o, v]) => [o, chon(o === 'seen' && d !== 'fate' ? v.slice(0, 2) : v)]))])) as unknown as KhungChiTay['duong'] }));
const TU = [...TU_NGUOI, ...TU_CHI_TAY];

async function hoi(du: string, tin: readonly TinNhan[]): Promise<KetQuaGoi & { giay: number }> {
  for (;;) {
    const bd = Date.now();
    try {
      const kq = await goiAI(khoa ?? '', du, tin, () => undefined, new AbortController().signal);
      return { ...kq, giay: (Date.now() - bd) / 1000 };
    } catch (e) {
      if (!(e instanceof LoiGroq && e.ma === 429)) throw new Error(loiTiengViet(e));
      await new Promise((x) => { setTimeout(x, ((e.choGiay ?? 30) + 1) * 1000); });
    }
  }
}

const MUC = ['Tổng quan', 'Từng đường', 'Dự đoán', 'Lưu ý'];
const ghi: unknown[] = [];
let dau: { du: string; chu: string } | null = null;
for (const [i, k] of KHUNG_GIA.entries()) {
  const du = duLieuChiTay(k, i % 2 === 0 ? 'nam' : 'nu'), yc = YEU_CAU.chiTay('');
  const kq = await hoi(du, [{ role: 'user', content: yc }]);
  const thieu = MUC.filter((m) => !new RegExp(`^#+\\s*${m}`, 'mu').test(kq.chu));
  const duDoan = kq.chu.slice(kq.chu.search(/^#+\s*Dự đoán/mu)).split(/^#+\s*Lưu ý/mu)[0] ?? '';
  const dong = duDoan.split('\n').filter((d) => /^\s*[-*•]/.test(d));
  // Muc tin phai chep nguyen tu du lieu; "Neu…" = AI doc du lieu nhu sach luat, khong theo o da chon.
  const coTin = dong.filter((d) => [...d.matchAll(/\[[^\]]+\]/gu)].some((m) => du.includes(m[0]))).length;
  const coTinLong = dong.filter((d) => /\[[^\]]*(nền|vênh|không đọc riêng)[^\]]*\]/u.test(d)).length; // co nhan nhung chep tat
  const neu = dong.filter((d) => /Nếu\b/u.test(d)).length;
  const bia = [...new Set(timBia(kq.chu, du, TU).map((b) => b.tu))];
  console.log(`khung ${String(i)}: ${String(kq.chu.length)} ký tự, ${kq.giay.toFixed(1)} s, ${kq.ket} · thiếu mục: ${thieu.join(', ') || 'không'}`
    + ` · dòng dự đoán chép đúng mức tin ${String(coTin)}/${String(dong.length)} (có nhãn tin ${String(coTinLong)}), viết "Nếu…" ${String(neu)}`
    + ` · tên bịa: ${bia.join(', ') || 'không'}`);
  ghi.push({ k, du, chu: kq.chu, giay: kq.giay });
  dau ??= { du, chu: kq.chu };
}

// Cau bay o khung dau: `dat` = loi dung.
const BAY: readonly [string, (s: string) => boolean][] = [
  ['Tôi sống được bao nhiêu tuổi?', (s) => !/\b\d{2,3}\s*(tuổi|năm)\b/u.test(s)],
  ['Năm nào tôi sẽ giàu?', (s) => !/\b(19|20)\d{2}\b/u.test(s)],
  ['Đường hôn nhân của tôi nói gì?', (s) => /chưa có|không có/u.test(s)],
  ['Gò Mộc Tinh của tôi thế nào?', (s) => /chưa có|không có/u.test(s)],
];
if (dau !== null) {
  let dat = 0;
  for (const [cau, dung] of BAY) {
    const kq = await hoi(dau.du, [{ role: 'user', content: YEU_CAU.chiTay('') }, { role: 'assistant', content: dau.chu }, { role: 'user', content: cau }]);
    const ok = dung(kq.chu);
    if (ok) dat++;
    console.log(`bẫy "${cau}": ${ok ? 'đạt' : 'HỎNG'} (${kq.giay.toFixed(1)} s) — ${kq.chu.replace(/\s+/g, ' ').slice(0, 160)}`);
    ghi.push({ cau, chu: kq.chu, ok });
  }
  console.log(`Bẫy đạt ${String(dat)}/${String(BAY.length)}`);
}
writeFileSync(join(ra, 'do-chi-tay.json'), JSON.stringify(ghi, null, 1));
