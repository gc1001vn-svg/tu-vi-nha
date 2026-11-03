// Đo AI thật qua Groq miễn phí (đợt 7 phần 1, kế hoạch docs/ke-hoach/2026-10-23-dot-7.md; 03/11: 2026-11-03-xu-ly-ton): hồ sơ GIẢ viết
// lời tổng hợp — đếm tên AI nêu mà dữ liệu không có (src/loi/ai/kiemBia.ts) + giây; 10 câu bẫy (dữ liệu không có) phải trả "chưa có";
// câu hỏi sâu (QUY_UOC mục 42) phải nhắc đúng điều app luận; bói Kiều không trích câu ngoài quẻ. Hỏi thêm gửi gói theo câu hỏi như app
// (`luotHoiThem`, `hoiSau.ts`). Khoá đọc từ GROQ_API_KEY (bí mật môi trường cloud) — không in, không ghi file. Máy ảo phải được mở mạng
// tới api.groq.com. Khoá DÙNG CHUNG cả nhà (200.000 token/ngày): trần mặc định 100.000 token một lượt đo; Groq báo hết hạn mức NGÀY thì
// dừng ngay (không chờ), ghi phần đã đo; hết hạn mức PHÚT thì chờ đúng số giây Groq báo.
//   node --experimental-strip-types --disable-warning=ExperimentalWarning [--import ./scripts/doi-chieu/nap-raw.mjs] scripts/doi-chieu/do-ai.ts
//     <thư_mục_tạm> [hồ_sơ=0,4 | số] [mô_hình,…=openai/gpt-oss-120b] [phần=tong,bay,sau,kieu] [trần_token=100000]
// Phần "kieu" cần `--import …/nap-raw.mjs` (chữ Truyện Kiều nạp kiểu `?raw` của Vite). Ghi <thư_mục_tạm>/do-ai.json (lời AI từng lần) —
// ngoài repo. In bảng số, token đã dùng, dấu vết mô hình (`system_fingerprint`: đổi là Groq đổi mô hình / cấu hình).
import { mkdirSync, writeFileSync } from 'node:fs';
import { LoiGroq, goiAI, loiTiengViet, luotHoiThem, type TinNhan } from '../../src/giaoDien/ai/goi.ts';
import { duLieuKieu, duLieuNguoi } from '../../src/loi/ai/duLieu.ts';
import { duLieuHoi } from '../../src/loi/ai/hoiSau.ts';
import { TU_KIEU, TU_NGUOI, timBia } from '../../src/loi/ai/kiemBia.ts';
import { YEU_CAU } from '../../src/loi/ai/loiDan.ts';
import { tinhHoSo, type HoSo } from '../../src/loi/hoSo.ts';
import { TINH } from '../../src/loi/tinh.ts';
import { BAY, HOI_SAU, KIEU_CAP, KIEU_HOI, coNhac, coNoiChuaCo } from './cau-do-ai.ts';

const khoa = process.env['GROQ_API_KEY'];
if (khoa === undefined || khoa === '') {
  console.error('Thiếu GROQ_API_KEY: thêm khoá Groq vào bí mật môi trường cloud rồi mở phiên mới.');
  process.exit(1);
}
const [ra = '', dsHs = '0,4', dsMoHinh = 'openai/gpt-oss-120b', dsPhan = 'tong,bay,sau,kieu', tranChu = '100000'] = process.argv.slice(2);
if (ra === '') throw new Error('Thiếu thư mục tạm để ghi kết quả');
mkdirSync(ra, { recursive: true });
const PHAN = new Set(dsPhan.split(','));
const TRAN = Number(tranChu);
const CHI_SO = dsHs.includes(',') ? dsHs.split(',').map(Number) : Array.from({ length: Number(dsHs) }, (_, i) => i);

const ds = await fetch('https://api.groq.com/openai/v1/models', { headers: { authorization: `Bearer ${khoa}` } });
console.log(`Mô hình Groq đang có (${String(ds.status)}):`, ((await ds.json()) as { data?: { id: string }[] }).data?.map((m) => m.id).sort().join(', '));

/** mulberry32: hồ sơ giả như nhau mọi lần chạy (hồ sơ 0–9 trùng các lần đo 23/10, 03/11). */
function gia(hat: number): () => number {
  let s = hat >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}
const r = gia(20261023);
const hai = (n: number): string => String(n).padStart(2, '0');
const HO_SO: HoSo[] = Array.from({ length: Math.max(5, ...CHI_SO.map((i) => i + 1)) }, (_, i) => ({
  id: `gia${String(i)}`, ten: 'Người Giả', gioiTinh: i % 2 === 0 ? 'nam' : 'nu',
  ngaySinh: `${String(1950 + Math.floor(r() * 65))}-${hai(1 + Math.floor(r() * 12))}-${hai(1 + Math.floor(r() * 28))}`,
  gioSinh: i % 5 === 4 ? null : `${hai(Math.floor(r() * 24))}:${hai(Math.floor(r() * 60))}`,
  noiSinh: TINH[Math.floor(r() * TINH.length)]?.[0] ?? 'Hà Nội',
}));
const XEM = { nam: 2026, thang: 10, ngay: 23 };
const ngu = (giay: number): Promise<void> => new Promise((x) => setTimeout(x, giay * 1000));

interface Lan {
  moHinh: string; hs: string; loai: 'tongHop' | 'bay' | 'sau' | 'kieu'; hoi: string; chu: string; bia: string[]; giay: number; ket: string;
  loi?: string; token?: { vao: number; ra: number }; dauVet?: string; dat?: boolean; ghiChu?: string;
}
const lan: Lan[] = [];
let dung = 0;
let dungLai: string | null = null;

/** Một lượt gọi; `duLieuBia`: chuỗi dùng để bắt tên bịa (lượt hỏi thêm: gói gọn + gói theo câu hỏi). */
async function goi(moHinh: string, nhan: Pick<Lan, 'hs' | 'loai' | 'hoi'>, duLieu: string, tin: readonly TinNhan[], tuDien: readonly string[],
  duLieuBia: string): Promise<Lan | null> {
  if (dungLai !== null || khoa === undefined) return null;
  const uoc = Math.round((duLieu.length + tin.reduce((s, m) => s + m.content.length, 0)) / 2.2 + 1500);
  if (TRAN > 0 && dung + uoc > TRAN) { dungLai = `chạm trần ${String(TRAN)} token của lượt đo`; return null; }
  for (let thu = 1; ; thu++) {
    const bd = Date.now();
    try {
      const kq = await goiAI(khoa, duLieu, tin, () => undefined, new AbortController().signal, { moHinh });
      dung += kq.token === undefined ? uoc : kq.token.vao + kq.token.ra;
      const x: Lan = { moHinh, ...nhan, chu: kq.chu, bia: [...new Set(timBia(kq.chu, duLieuBia, tuDien).map((b) => b.tu))],
        giay: (Date.now() - bd) / 1000, ket: kq.ket, ...(kq.token === undefined ? {} : { token: { ...kq.token } }),
        ...(kq.dauVet === undefined ? {} : { dauVet: kq.dauVet }) };
      lan.push(x);
      console.error(`${moHinh} ${nhan.hs} ${nhan.loai}: ${x.ket} ${String(x.bia.length)} từ bịa, ${x.giay.toFixed(1)} giây, ${String(dung)} token đã dùng`);
      return x;
    } catch (e) {
      if (e instanceof LoiGroq && e.ma === 429) {
        // Het han muc NGAY (token / luot): dung han — cho la an not phan con lai cua ca nha. Het han muc PHUT: cho roi thu lai (toi da 4 lan).
        if (/per day|TPD|RPD/iu.test(e.message) || (e.choGiay ?? 0) > 300) {
          dungLai = `Groq báo hết hạn mức ngày: ${e.message.replace(/org_[A-Za-z0-9]+/gu, 'org_…').slice(0, 240)}`;
          break;
        }
        if (thu < 4) { await ngu((e.choGiay ?? 30) + 1); continue; }
      }
      lan.push({ moHinh, ...nhan, chu: '', bia: [], giay: (Date.now() - bd) / 1000, ket: 'loi', loi: loiTiengViet(e) });
      console.error(`${moHinh} ${nhan.hs} ${nhan.loai}: lỗi ${loiTiengViet(e)}`);
      break;
    }
  }
  return null;
}

for (const moHinh of dsMoHinh.split(',')) {
  const tongHop = new Map<number, string>();
  const can = new Set([...(PHAN.has('tong') ? CHI_SO : []), ...(PHAN.has('bay') ? [0, 4] : []), ...(PHAN.has('sau') ? [0] : [])]);
  for (const i of [...can].sort((a, b) => a - b)) {
    const h = HO_SO[i];
    if (h === undefined) continue;
    const d = duLieuNguoi(h, tinhHoSo(h), XEM, undefined);
    const x = await goi(moHinh, { hs: h.id, loai: 'tongHop', hoi: YEU_CAU.nguoi() }, d, [{ role: 'user', content: YEU_CAU.nguoi() }], TU_NGUOI, d);
    if (x !== null && x.chu !== '') tongHop.set(i, x.chu);
  }
  /** Hỏi thêm sau lời tổng hợp của hồ sơ `i`, gói theo câu hỏi như app. */
  const hoiThem = async (i: number, loai: 'bay' | 'sau', cau: string): Promise<{ readonly x: Lan | null; readonly duLieu: string }> => {
    const h = HO_SO[i], dau = tongHop.get(i);
    if (h === undefined || dau === undefined) return { x: null, duLieu: '' };
    const tr = tinhHoSo(h), gon = duLieuNguoi(h, tr, XEM, undefined);
    const l = luotHoiThem([{ role: 'user', content: YEU_CAU.nguoi() }, { role: 'assistant', content: dau }, { role: 'user', content: cau }],
      (cho) => duLieuHoi(h, tr, XEM, undefined, undefined, cau, cho));
    const duLieu = l.duLieu ?? gon;
    return { x: await goi(moHinh, { hs: h.id, loai, hoi: cau }, duLieu, l.tin, TU_NGUOI, l.duLieu === null ? gon : `${gon}\n${duLieu}`), duLieu };
  };
  if (PHAN.has('bay')) for (const [i, cau] of BAY.entries()) await hoiThem(i % 2 === 0 ? 0 : 4, 'bay', cau);
  if (PHAN.has('sau')) {
    for (const c of HOI_SAU) {
      const { x, duLieu } = await hoiThem(0, 'sau', c.hoi);
      if (x === null) continue;
      const chu = c.can(duLieu);
      x.dat = x.bia.length === 0 && coNhac(x.chu, chu);
      x.ghiChu = `cần nhắc một trong: ${chu.join(', ') || '(gói không có — phải nói không có)'}`;
    }
  }
  if (PHAN.has('kieu') && dungLai === null) {
    try {
      const [k, luan] = await Promise.all([import('../../src/loi/kieu.ts'), import('../../src/loi/kieuLuan.ts')]);
      const chuan = (s: string): string => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/gu, ' ').trim();
      for (const c of KIEU_CAP) {
        const q = k.queKieu(c), d = duLieuKieu(luan, q, 0), hoi = YEU_CAU.kieu(KIEU_HOI);
        const x = await goi(moHinh, { hs: `kieu${String(c)}`, loai: 'kieu', hoi }, d, [{ role: 'user', content: hoi }], TU_KIEU, d);
        if (x === null) continue;
        const a = chuan(x.chu), dd = chuan(d);
        const ngoai = k.CAU.filter((l) => { const y = chuan(l); return y.length >= 15 && a.includes(y) && !dd.includes(y); });
        x.dat = x.bia.length === 0 && ngoai.length === 0;
        x.ghiChu = ngoai.length === 0 ? 'không trích câu ngoài quẻ' : `trích ${String(ngoai.length)} câu ngoài quẻ: ${ngoai.slice(0, 2).join(' | ')}`;
      }
    } catch (e) {
      console.error(`Bỏ phần bói Kiều (${e instanceof Error ? e.message : String(e)}): chạy kèm --import ./scripts/doi-chieu/nap-raw.mjs`);
    }
  }
}
writeFileSync(`${ra}/do-ai.json`, JSON.stringify({ luc: new Date().toISOString(), hoSo: HO_SO, dung, dungLai, lan }, null, 1));
for (const moHinh of dsMoHinh.split(',')) {
  const cua = (loai: Lan['loai']): Lan[] => lan.filter((x) => x.moHinh === moHinh && x.loai === loai);
  const th = cua('tongHop'), bay = cua('bay'), sau = cua('sau'), kieu = cua('kieu');
  const tb = (a: number[]): number => (a.length === 0 ? 0 : a.reduce((s, x) => s + x, 0) / a.length);
  const truot = bay.filter((x) => !(coNoiChuaCo(x.chu) && x.bia.length === 0)).map((x) => x.hoi);
  console.log(`${moHinh}: tổng hợp ${String(th.filter((x) => x.ket === 'xong').length)}/${String(th.length)} xong · có bịa ${String(th.filter((x) => x.bia.length > 0).length)}`
    + `/${String(th.length)} (${[...new Set(th.flatMap((x) => x.bia))].join(', ') || 'không'}) · ${tb(th.map((x) => x.giay)).toFixed(1)} giây/lần · `
    + `bẫy nói "chưa có" ${String(bay.length - truot.length)}/${String(bay.length)}${truot.length === 0 ? '' : ` (trượt: ${truot.join(' | ')})`} · `
    + `hỏi sâu đạt ${String(sau.filter((x) => x.dat === true).length)}/${String(sau.length)} · bói Kiều đạt ${String(kieu.filter((x) => x.dat === true).length)}/${String(kieu.length)} · lỗi: `
    + `${[...new Set(lan.filter((x) => x.moHinh === moHinh && x.loi !== undefined).map((x) => x.loi))].join(' | ') || 'không'}`);
  for (const x of [...sau, ...kieu]) console.log(`  ${x.dat === true ? 'đạt' : 'TRƯỢT'} ${x.loai} ${x.hs} "${x.hoi.slice(0, 60)}": ${x.ghiChu ?? ''}${x.bia.length > 0 ? ` · bịa: ${x.bia.join(', ')}` : ''}`);
}
console.log(`Token đã dùng: ${String(dung)} · dấu vết mô hình: ${[...new Set(lan.map((x) => x.dauVet).filter((x) => x !== undefined))].join(', ') || 'không thấy'}`
  + `${dungLai === null ? '' : ` · DỪNG: ${dungLai}`}`);
