/**
 * AI dot 7 phan 1 — phan khong can mang: goi du lieu gui di (du cac mon, khong ten), tinh tien theo bang gia, han muc thang,
 * do chu bia. Ngay sinh GIA. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { GIA, congTien, conHanMuc, daTieuThang, tienGoi } from '../src/loi/ai/chiPhi.ts';
import { duLieuNguoi, duLieuQue, duLieuTarot } from '../src/loi/ai/duLieu.ts';
import { TU_NGUOI, timBia } from '../src/loi/ai/kiemBia.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import * as kinhDich from '../src/loi/kinhDich.ts';
import * as kinhDichChu from '../src/loi/kinhDichChu.ts';
import * as kinhDichGiai from '../src/loi/kinhDichGiai.ts';
import * as tarot from '../src/loi/tarot.ts';
import { NUOC_NGOAI } from '../src/loi/tinh.ts';

const XEM = { nam: 2026, thang: 10, ngay: 23 };
const hs = (o: Partial<HoSo> = {}): HoSo =>
  ({ id: 'a', ten: 'Nguyễn Bí Mật', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: '06:14', noiSinh: 'Hà Nội', ...o });
const du = (h: HoSo, lech?: number): string => duLieuNguoi(h, tinhHoSo(h, lech), XEM, lech);

describe('goi du lieu gui AI', () => {
  test('du 9 muc, dung so may tinh, khong ten nguoi, khong muc nao loi, ~8 nghin token tro xuong', () => {
    const d = du(hs());
    expect(d.match(/^## [^(\n]+/gm)?.map((m) => m.slice(3).trim())).toEqual(['Người xem', 'Tử vi', 'Năm nay', 'Bát tự', 'Hướng nhà',
      'Tuổi hợp, tuổi kỵ', 'Thần số học', 'Nhịp sinh học hôm nay', 'Chiêm tinh']);
    expect([d.includes('Bí Mật'), d.includes('không tính được')]).toEqual([false, false]);
    // So da kiem o test tung mon: nam Canh Ngo, cung Moc Song Tu 2°14′ (ChiemTinh.test), 12 cung tu vi.
    expect([d.includes('năm Canh Ngọ'), d.includes('Cung Mọc Song Tử 2°14′'), (d.match(/^- .+ · đại vận /gm) ?? []).length]).toEqual([true, true, 12]);
    expect(d.length).toBeLessThan(16_000);
  });

  test('khong ro gio: tu vi bao can gio, chiem tinh ghi tinh 12 gio trua; sinh nuoc ngoai: ghi mui gio, bo cung Moc', () => {
    const k = du(hs({ gioSinh: null }));
    expect([k.includes('chưa lập được lá số tử vi'), k.includes('12 giờ trưa'), k.includes('Cung Mọc ')]).toEqual([true, true, false]);
    const n = du(hs({ noiSinh: NUOC_NGOAI, muiGio: 'Europe/Paris' }), 120);
    expect([n.includes('múi giờ Europe/Paris'), n.includes('Cung Mọc ')]).toEqual([true, false]);
  });

  test('que, trai bai: ten que, hao dong, doan nen doc kem nguyen van; la, vi tri, xuoi nguoc', () => {
    const k = { ...kinhDich, ...kinhDichChu, ...kinhDichGiai };
    const q = duLieuQue(k, kinhDich.gieo([7, 7, 7, 7, 7, 9]), null);
    expect([q.includes('Quẻ chủ: quẻ 1 Thuần Càn'), q.includes('Hào động: 6'), q.includes('nguyên văn "')]).toEqual([true, true, true]);
    const t = duLieuTarot(tarot, 'baLa', [{ so: 0, nguoc: false }, { so: 77, nguoc: true }, { so: 22, nguoc: false }]);
    expect([t.includes('Quá khứ'), t.includes('The Fool'), t.includes('King of Pentacles — Vua Tiền, lá ngược')]).toEqual([true, true, true]);
  });
});

describe('tien, han muc', () => {
  test('tien = token × gia; ghi, doc bo nho dem; Haiku tren 100.000 token gap 5; mo hinh la tinh gia dat', () => {
    expect(tienGoi('claude-opus-5-5', { input_tokens: 8000, output_tokens: 3000 })).toBeCloseTo(0.092, 10);
    expect(tienGoi('claude-sonnet-5-5', { input_tokens: 100, output_tokens: 1000, cache_creation_input_tokens: 8000, cache_read_input_tokens: 20_000 }))
      .toBeCloseTo((100 * 2 + 8000 * 2.5 + 20_000 * 0.1 + 1000 * 10) / 1e6, 10);
    expect(tienGoi('claude-haiku-5-5', { input_tokens: 100_001, output_tokens: 0 })).toBeCloseTo(5 * 100_001 * 0.1 / 1e6, 10);
    expect(tienGoi('claude-opus-4-8', { input_tokens: 1e6, output_tokens: 0 })).toBe(5);
    expect(Object.keys(GIA)).toEqual(['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5']);
  });

  test('cong don trong thang, sang thang moi tinh lai; het han muc thi chan', () => {
    const s = congTien(congTien({ thang: '2026-09', daTieu: 4.9 }, '2026-10', 1), '2026-10', 2.5);
    expect([s, daTieuThang(s, '2026-11'), conHanMuc(s, '2026-10', 5), conHanMuc(s, '2026-10', 3.5), conHanMuc(s, '2026-11', 3.5)])
      .toEqual([{ thang: '2026-10', daTieu: 3.5 }, 0, true, false, true]);
  });
});

describe('do chu bia', () => {
  const d = du(hs());
  test('du lieu tu so voi chinh no: khong bia; tu dien du ten cac mon', () => {
    expect(timBia(d, d, TU_NGUOI)).toEqual([]);
    expect(['Tử Vi', 'Lưu Thái Tuế', 'La Hầu', 'Tam Kheo', 'Giáp Tý', 'Lộ Bàng Thổ', 'Thất Sát', 'Song Ngư', 'Sinh Khí'].filter((t) => !TU_NGUOI.includes(t)))
      .toEqual([]);
  });

  test('ten khong co trong du lieu thi bat, kem vi tri; dung chu hoa, tron chu; bo ten mot chu', () => {
    const coSan = ['Mộc Đức', 'La Hầu', 'Thái Bạch', 'Kế Đô'].filter((t) => d.includes(t));
    const vang = ['Mộc Đức', 'La Hầu', 'Thái Bạch', 'Kế Đô'].find((t) => !d.includes(t)) ?? '';
    const loi = `Năm nay gặp sao ${vang}, lại thêm hạn; ${coSan[0] ?? ''} thì ổn. Năm Đinh Mão xa rồi; la hầu viết thường; Mộ một chữ.`;
    expect(timBia(loi, d, [...TU_NGUOI, 'Mộ'])).toEqual([{ tu: vang, vt: loi.indexOf(vang) }, { tu: 'Đinh Mão', vt: loi.indexOf('Đinh Mão') }]);
    expect(timBia('Tử Vi Đẩu Số', 'Tử Vi', ['Tử Vi Đẩu'])).toEqual([{ tu: 'Tử Vi Đẩu', vt: 0 }]);
    expect(timBia('Nhà Tử Vinh', 'x', ['Tử Vi'])).toEqual([]);
  });
});
