/**
 * AI dot 7 phan 1 — phan khong can mang: goi du lieu gui di (du cac mon, khong ten), do chu bia. Ngay sinh GIA. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
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

  test('tuong mat (neu da do): muc cuoi, so + loi app xep; anh cuoi chi gui so', () => {
    const so = { tran: 0.8, trungHa: 1.1, nguNhan: 5.5, khoangMat: 1.3, mui: 0.3, mieng: 0.3, daiRong: 0.9, ham: 0.8, cam: 0.4, may: 1.6,
      anDuong: 1.05, mayCach: 0.6 };
    const tinh = tinhHoSo(hs());
    const d = duLieuNguoi(hs(), tinh, XEM, undefined, { so, cuoi: 0.05 });
    const m = d.slice(d.indexOf('## Tướng mặt'));
    expect([d.endsWith(m), (m.match(/^- /gm) ?? []).length, m.includes('- Trung đình : hạ đình 1,10: trung đình dài — trung niên hanh thông (tốt)')]).toEqual([true, 12, true]);
    // loi day du chi o man hinh: muc gui AI ngan de luot dau con du token ra (vuaHanMuc)
    expect([m.includes('- Miệng 30,0 %: miệng hẹp — lộc ăn kém, về già vất vả (cần lưu ý)'), m.length < 2000]).toEqual([true, true]);
    const c = duLieuNguoi(hs(), tinh, XEM, undefined, { so, cuoi: 0.6 });
    expect([c.includes('app không giải'), c.includes('- Miệng 30,0 %\n'), c.includes('miệng hẹp —')]).toEqual([true, true, false]);
    expect(du(hs()).includes('Tướng mặt')).toBe(false);
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
