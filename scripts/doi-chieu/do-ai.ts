// Đo AI thật qua Groq miễn phí (đợt 7 phần 1, kế hoạch docs/ke-hoach/2026-10-23-dot-7.md): N hồ sơ GIẢ × các mô hình viết lời
// tổng hợp — đếm tên AI nêu mà dữ liệu không có (src/loi/ai/kiemBia.ts) + giây; 10 câu hỏi bẫy (dữ liệu không có) phải trả
// "chưa có". In trước danh sách mô hình Groq đang có. Khoá đọc từ GROQ_API_KEY (bí mật môi trường cloud) — không in, không
// ghi file. Máy ảo phải được mở mạng tới api.groq.com. Gói miễn phí giới hạn token mỗi phút: hết lượt thì chờ theo retry-after.
//   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-ai.ts <thư_mục_tạm> [số_hồ_sơ=10] [mô_hình,…]
// Ghi <thư_mục_tạm>/do-ai.json (lời AI từng lần, để đọc lại) — ngoài repo. In bảng số ra màn hình.
import { mkdirSync, writeFileSync } from 'node:fs';
import { LoiGroq, goiAI, loiTiengViet, type TinNhan } from '../../src/giaoDien/ai/goi.ts';
import { duLieuNguoi } from '../../src/loi/ai/duLieu.ts';
import { TU_NGUOI, timBia } from '../../src/loi/ai/kiemBia.ts';
import { YEU_CAU } from '../../src/loi/ai/loiDan.ts';
import { tinhHoSo, type HoSo } from '../../src/loi/hoSo.ts';
import { TINH } from '../../src/loi/tinh.ts';

const khoa = process.env['GROQ_API_KEY'];
if (khoa === undefined || khoa === '') {
  console.error('Thiếu GROQ_API_KEY: thêm khoá Groq vào bí mật môi trường cloud rồi mở phiên mới.');
  process.exit(1);
}
const [ra = '', soHs = '10', dsMoHinh = 'openai/gpt-oss-120b,openai/gpt-oss-20b'] = process.argv.slice(2);
if (ra === '') throw new Error('Thiếu thư mục tạm để ghi kết quả');
mkdirSync(ra, { recursive: true });

const ds = await fetch('https://api.groq.com/openai/v1/models', { headers: { authorization: `Bearer ${khoa}` } });
console.log(`Mô hình Groq đang có (${String(ds.status)}):`, ((await ds.json()) as { data?: { id: string }[] }).data?.map((m) => m.id).sort().join(', '));

/** mulberry32: hồ sơ giả như nhau mọi lần chạy. */
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
const HO_SO: HoSo[] = Array.from({ length: Number(soHs) }, (_, i) => ({
  id: `gia${String(i)}`, ten: 'Người Giả', gioiTinh: i % 2 === 0 ? 'nam' : 'nu',
  ngaySinh: `${String(1950 + Math.floor(r() * 65))}-${hai(1 + Math.floor(r() * 12))}-${hai(1 + Math.floor(r() * 28))}`,
  gioSinh: i % 5 === 4 ? null : `${hai(Math.floor(r() * 24))}:${hai(Math.floor(r() * 60))}`,
  noiSinh: TINH[Math.floor(r() * TINH.length)]?.[0] ?? 'Hà Nội',
}));
const XEM = { nam: 2026, thang: 10, ngay: 23 };

// Câu hỏi bẫy: điều gói dữ liệu không có (app không tính) — AI phải nói chưa có, không bịa.
const BAY = ['Năm 2031 tôi gặp sao hạn gì?', 'Nhịp sinh học ngày mai của tôi thế nào?', 'Con số may mắn của tôi là số mấy?',
  'Màu nào hợp mệnh tôi để sơn nhà?', 'Quẻ Kinh Dịch của tôi là quẻ gì?', 'Tháng 3 âm năm sau nguyệt hạn ở cung nào?',
  'Lá bài tarot chủ mệnh của tôi là lá nào?', 'Vợ tôi tuổi Dần thì hợp không, theo lá số của vợ?', 'Ngày mai nhật hạn ở cung nào?',
  'Sao Chiron trong lá số chiêm tinh của tôi ở cung nào?'];
const coNoiChuaCo = (s: string): boolean => /chưa có|không có/i.test(s);
const ngu = (giay: number): Promise<void> => new Promise((x) => setTimeout(x, giay * 1000));

interface Lan { moHinh: string; hs: string; loai: 'tongHop' | 'bay'; hoi: string; chu: string; bia: string[]; giay: number; ket: string; loi?: string }
const lan: Lan[] = [];
const goi = async (moHinh: string, h: HoSo, loai: Lan['loai'], tin: TinNhan[], hoi: string): Promise<void> => {
  const duLieu = duLieuNguoi(h, tinhHoSo(h), XEM, undefined);
  for (let thu = 1; ; thu++) {
    const bd = Date.now();
    try {
      const kq = await goiAI(khoa, duLieu, tin, () => undefined, new AbortController().signal, { moHinh });
      lan.push({ moHinh, hs: h.id, loai, hoi, chu: kq.chu, bia: [...new Set(timBia(kq.chu, duLieu, TU_NGUOI).map((b) => b.tu))],
        giay: (Date.now() - bd) / 1000, ket: kq.ket });
    } catch (e) {
      // Het luot mien phi theo phut: cho dung so giay Groq bao roi thu lai (toi da 4 lan).
      if (e instanceof LoiGroq && e.ma === 429 && thu < 4) { await ngu((e.choGiay ?? 30) + 1); continue; }
      lan.push({ moHinh, hs: h.id, loai, hoi, chu: '', bia: [], giay: (Date.now() - bd) / 1000, ket: 'loi', loi: loiTiengViet(e) });
    }
    break;
  }
  const x = lan.at(-1);
  console.error(`${moHinh} ${h.id} ${loai}: ${x?.ket ?? ''} ${String(x?.bia.length ?? 0)} từ bịa, ${(x?.giay ?? 0).toFixed(1)} giây ${x?.loi ?? ''}`);
};

for (const moHinh of dsMoHinh.split(',')) {
  for (const h of HO_SO) await goi(moHinh, h, 'tongHop', [{ role: 'user', content: YEU_CAU.nguoi() }], YEU_CAU.nguoi());
  // Bẫy: hồ sơ 0 (có giờ) và 4 (không rõ giờ), mỗi câu một lượt mới sau lời tổng hợp đã có.
  for (const [i, cau] of BAY.entries()) {
    const h = HO_SO[i % 2 === 0 ? 0 : 4] ?? HO_SO[0];
    const dau = lan.find((x) => x.moHinh === moHinh && x.hs === h?.id && x.loai === 'tongHop' && x.chu !== '');
    if (h === undefined || dau === undefined) continue;
    await goi(moHinh, h, 'bay', [{ role: 'user', content: YEU_CAU.nguoi() }, { role: 'assistant', content: dau.chu }, { role: 'user', content: cau }], cau);
  }
}
writeFileSync(`${ra}/do-ai.json`, JSON.stringify({ luc: new Date().toISOString(), hoSo: HO_SO, lan }, null, 1));
for (const moHinh of dsMoHinh.split(',')) {
  const th = lan.filter((x) => x.moHinh === moHinh && x.loai === 'tongHop');
  const bay = lan.filter((x) => x.moHinh === moHinh && x.loai === 'bay');
  const tb = (a: number[]): number => (a.length === 0 ? 0 : a.reduce((s, x) => s + x, 0) / a.length);
  console.log(`${moHinh}: tổng hợp ${String(th.filter((x) => x.ket === 'xong').length)}/${String(th.length)} xong · có bịa ${String(th.filter((x) => x.bia.length > 0).length)}`
    + `/${String(th.length)} (${[...new Set(th.flatMap((x) => x.bia))].join(', ') || 'không'}) · ${tb(th.map((x) => x.giay)).toFixed(1)} giây/lần · `
    + `bẫy nói "chưa có" ${String(bay.filter((x) => coNoiChuaCo(x.chu) && x.bia.length === 0).length)}/${String(bay.length)} · lỗi: `
    + `${[...new Set(lan.filter((x) => x.moHinh === moHinh && x.loi !== undefined).map((x) => x.loi))].join(' | ') || 'không'}`);
}
