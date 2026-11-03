/**
 * Hoi them AI tong hop (`src/loi/ai/hoiSau.ts`, ke hoach 2026-11-03-xu-ly-ton, QUY_UOC muc 42): nhan viec theo cau hoi; goi theo cau hoi
 * vua cho trong va giu loi tong hop; cau bay khong nhan them du lieu tra loi duoc bay; quet ho so gia × cau hoi (chu dung quy uoc, goi
 * khac nhau theo cau); goi boi Kieu.
 */
import { choDuLieu, luotHoiThem, vuaHanMuc, type TinNhan } from '../src/giaoDien/ai/goi.ts';
import { duLieuKieu, duLieuNguoi } from '../src/loi/ai/duLieu.ts';
import { doanThem, duLieuHoi, TIEU_DE_HOI, viecHoi } from '../src/loi/ai/hoiSau.ts';
import { LOI_DAN, YEU_CAU } from '../src/loi/ai/loiDan.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { queKieu, SO_CAP } from '../src/loi/kieu.ts';
import * as luanKieu from '../src/loi/kieuLuan.ts';
import { TINH } from '../src/loi/tinh.ts';
import { BAY, HOI_SAU } from '../scripts/doi-chieu/cau-do-ai.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || /undefined|NaN|\.\./u.test(v) ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);
const XEM = { nam: 2026, thang: 11, ngay: 3 };
const HS: HoSo = { id: 'gia', ten: 'Người Giả', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: '06:14', noiSinh: 'Hà Nội' };
const KHONG_GIO: HoSo = { ...HS, id: 'gia2', gioiTinh: 'nu', ngaySinh: '1985-02-20', gioSinh: null };
/** Hoi them sau loi tong hop ~3.300 ky tu (do 03/11: loi that 2.800–3.200). */
const tin = (cau: string): TinNhan[] => [{ role: 'user', content: YEU_CAU.nguoi() }, { role: 'assistant', content: 'Lời tổng hợp. '.repeat(236) }, { role: 'user', content: cau }];
const goi = (hs: HoSo, cau: string): { readonly duLieu: string | null; readonly tin: readonly TinNhan[] } =>
  luotHoiThem(tin(cau), (cho) => duLieuHoi(hs, tinhHoSo(hs), XEM, undefined, undefined, cau, cho));

describe('hoi them AI tong hop', () => {
  test('nhan viec theo cau hoi (co dau, khong dau); "cuối năm" khong la "cưới"', () => {
    expect(viecHoi('Tháng này ngày nào tốt để cưới?', 2026)).toEqual(['ngay:cuoiHoi', 'cung:Phu Thê']);
    expect(viecHoi('Năm nay sửa nhà nên tránh hướng nào?', 2026)).toEqual(['nam', 'phongThuy:nam']);
    expect(viecHoi('Năm 2031 tôi gặp sao hạn gì?', 2026)).toEqual(['namKhac:2031']);
    expect(viecHoi('tinh duyen cua toi the nao', 2026)).toEqual(['cung:Phu Thê']);
    expect(viecHoi('Cuối năm nay tôi có nên đổi việc?', 2026)).toEqual(['cung:Quan Lộc', 'nam']);
    expect(viecHoi('Giải thích thêm ý thứ hai', 2026)).toEqual([]);
  });

  test('goi theo cau hoi: loi day du len dau, vua cho trong, giu loi tong hop, luot ra 1.500', () => {
    for (const [cau, co] of [['Tháng này ngày nào tốt để cưới?', ['### Chọn ngày — cưới hỏi', 'Tháng 11/2026 (từ hôm nay 3/11):', 'Tháng 12/2026:',
      '### Tử vi — cung Phu Thê']], ['Năm nay sửa nhà nên tránh hướng nào?', ['### Phi tinh', 'Nên để yên năm nay', '### Bát trạch']],
    ['Tình duyên của tôi thế nào?', ['### Tử vi — cung Phu Thê', '### Bát tự — Hôn nhân', '### Chiêm tinh — nhà 7']],
    ['Màu nào hợp với tôi?', ['Cách dùng phổ biến']]] as const) {
      const l = goi(HS, cau), d = l.duLieu ?? '';
      const v = vuaHanMuc(`${LOI_DAN}\n\nDỮ LIỆU:\n${d}`, l.tin);
      expect([cau, l.tin.length, v.tin.length, v.ra, d.length <= choDuLieu(tin(cau)), d.startsWith('## Người xem'), d.includes(TIEU_DE_HOI)])
        .toEqual([cau, 3, 3, 1500, true, true, true]);
      for (const x of co) expect([cau, x, d.includes(x)]).toEqual([cau, x, true]);
    }
    // Nam: Kim Lau cuoi hoi tuc xet tuoi co dau — khong nhac; khong ro gio: bao chua co la so tu vi, khong co nha chiem tinh.
    const dong = (goi(HS, 'Tháng này ngày nào tốt để cưới?').duLieu ?? '').split('\n');
    expect(dong[dong.findIndex((x) => x.startsWith('### Chọn ngày — cưới hỏi')) + 1]?.includes('phạm Kim Lâu')).toBe(false);
    const k = goi(KHONG_GIO, 'Tình duyên của tôi thế nào?').duLieu ?? '';
    expect([k.includes('Không rõ giờ sinh nên app chưa lập lá số tử vi.'), k.includes('### Bát tự — Hôn nhân'), k.includes('### Chiêm tinh — nhà')]).toEqual([true, true, false]);
    // Cau khong noi viec nao: goi gon nhu luot dau (vuaHanMuc lo).
    expect(goi(HS, 'Giải thích thêm ý thứ hai').duLieu).toBeNull();
  });

  test('cau bay: khong nhan them du lieu tra loi duoc bay; nam khac, ngay khac ghi ro chua tinh', () => {
    const d = (cau: string): string => goi(HS, cau).duLieu ?? duLieuNguoi(HS, tinhHoSo(HS), XEM, undefined);
    expect(d('Năm 2031 tôi gặp sao hạn gì?')).toContain('App chưa tính năm 2031');
    expect(d('Năm 2031 tôi gặp sao hạn gì?')).not.toContain('### Năm nay —');
    expect(d('Tháng 3 âm năm sau nguyệt hạn ở cung nào?')).toContain('App chưa tính năm 2027');
    expect(d('Nhịp sinh học ngày mai của tôi thế nào?')).toContain('App chỉ tính nhật hạn và nhịp sinh học của hôm nay.');
    expect(d('Ngày mai nhật hạn ở cung nào?')).toContain('App chỉ tính nhật hạn và nhịp sinh học của hôm nay.');
    for (const cau of BAY) expect([cau, /Chiron|may mắn là số|đeo đá|đá phong thủy/u.test(d(cau))]).toEqual([cau, false]);
    for (const cau of ['Con số may mắn của tôi là số mấy?', 'Quẻ Kinh Dịch của tôi là quẻ gì?', 'Lá bài tarot chủ mệnh của tôi là lá nào?']) {
      expect([cau, goi(HS, cau).duLieu]).toEqual([cau, null]);
    }
  });

  test('quet 30 ho so gia × 14 cau: chu dung quy uoc, vua cho trong; hai viec khac nhau ra loi khac nhau', () => {
    let s = 20261103 >>> 0;
    const r = (): number => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32; };
    const hai = (n: number): string => String(n).padStart(2, '0');
    const sai: string[] = [];
    let trung = 0, cap = 0;
    const CAU = [...BAY, ...HOI_SAU.map((c) => c.hoi), 'Năm nay công việc và tiền bạc thế nào?', 'Mấy năm tới đại vận của tôi ra sao?', 'Tôi hợp với tuổi nào?',
      'Con cái của tôi sau này thế nào?', 'Chiêm tinh nói gì về tính cách của tôi?', 'Tháng sau nên khai trương ngày nào?'].slice(0, 20);
    for (let i = 0; i < 30; i++) {
      const hs: HoSo = { id: `q${String(i)}`, ten: 'Giả', gioiTinh: i % 2 === 0 ? 'nam' : 'nu', ngaySinh: `${String(1950 + Math.floor(r() * 65))}-${hai(1 + Math.floor(r() * 12))}-${hai(1 + Math.floor(r() * 28))}`,
        gioSinh: i % 4 === 3 ? null : `${hai(Math.floor(r() * 24))}:${hai(Math.floor(r() * 60))}`, noiSinh: TINH[Math.floor(r() * TINH.length)]?.[0] ?? 'Hà Nội' };
      const tr = tinhHoSo(hs);
      for (const cau of CAU.slice(i % 7, i % 7 + 14)) {
        const l = goi(hs, cau);
        if (l.duLieu === null) continue;
        if (l.duLieu.length > choDuLieu(tin(cau)) || l.tin.length !== 3) sai.push(`${hs.id} ${cau}: qua cho`);
        for (const x of l.duLieu.split('\n').filter((y) => y !== '')) { const e = saiChu(x); if (e !== null) sai.push(`${hs.id} ${cau}: ${e} — ${x.slice(0, 120)}`); }
      }
      const a = new Set(doanThem(hs, tr, XEM, undefined, undefined, 'Tình duyên của tôi thế nào?').map((d) => d.khoa));
      const b = doanThem(hs, tr, XEM, undefined, undefined, 'Công việc của tôi thế nào?').map((d) => d.khoa);
      trung += b.filter((x) => a.has(x)).length;
      cap += b.length;
    }
    expect(sai.slice(0, 5)).toEqual([]);
    expect(trung / Math.max(1, cap)).toBeLessThan(0.2);
  }, 120_000);

  test('boi Kieu: goi co cap cau, viec hoi, loi chot; ngan, luot dau xin du 3.000 token ra', () => {
    let dai = 0;
    for (let c = 0; c < SO_CAP; c += 37) {
      const q = queKieu(c), d = duLieuKieu(luanKieu, q, c % 18);
      dai = Math.max(dai, d.length);
      expect([d.includes(`${q.luc} / ${q.bat}`), d.includes(`Việc đang hỏi (đề mục bói Kiều xưa): ${luanKieu.TEN_MUC[c % 18] ?? ''}.`),
        d.includes('Lời chốt của app: Tổng luận:'), d.includes('Nhìn cho đúng')]).toEqual([true, true, true, false]);
      for (const x of d.split('\n')) expect([c, saiChu(x)]).toEqual([c, null]);
    }
    expect(dai).toBeLessThan(2500);
    expect(vuaHanMuc(`${LOI_DAN}\n\nDỮ LIỆU:\n${'x'.repeat(dai)}`, [{ role: 'user', content: YEU_CAU.kieu('') }]).ra).toBe(3000);
    expect([YEU_CAU.kieu('').includes('dòng "Việc đang hỏi"'), YEU_CAU.kieu('Công việc').includes('"Công việc"'),
      YEU_CAU.kieu('').includes('chỉ trích câu thơ có trong DỮ LIỆU')]).toEqual([true, true, true]);
  });
});
