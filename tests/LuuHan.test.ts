/**
 * Luu han (`src/loi/tuVi/luuHan.ts`) so hai bang vang doc lap, sinh bang `scripts/doi-chieu/luu-han-*`:
 * `tuvi-mcp-server` (tu vi Viet: tieu han, nguyet han khoi tu tieu han, nhat han, 7 sao luu) va `iztro` (phai khoi tu
 * Luu Thai Tue — Dau Quan; Loc Kinh Da Ma luu, Tang Mon, Bach Ho). Ngay sinh trong cac bang deu ngau nhien (luat 1).
 */
import { amSangDuong, duongSangAm, soNgay, tuSoNgay } from '../src/loi/amLich.ts';
import type { GioiTinh } from '../src/loi/hoSo.ts';
import { lapLaSo } from '../src/loi/tuVi/laSo.ts';
import { danhGiaHan, tinhLuuHan, type LuuHan } from '../src/loi/tuVi/luuHan.ts';
import mcp from './vang/luu-han-mcp.json';
import iz from './vang/luu-han-iztro.json';

interface Ca { vao: (number | string)[]; thang: number; ngay: number; sao: Record<string, number> }
const CA_MCP = mcp.ca as unknown as (Ca & { xem: number[]; tieuHan: number })[];
const CA_IZ = iz.ca as unknown as (Ca & { xem: string; thaiTue: number })[];

const laSo = (vao: Ca['vao'], namXem: number) => {
  const [ngay = 0, thang = 0, nam = 0, chiGio = 0, gioi = 'nam'] = vao;
  return lapLaSo({ ngay: Number(ngay), thang: Number(thang), nam: Number(nam), chiGio: Number(chiGio), gioiTinh: gioi as GioiTinh, namXem });
};
/** Vi tri cac sao luu co trong bang vang (bang vang chi ghi mot phan 9 sao). */
const viTri = (l: LuuHan, ten: readonly string[]) =>
  Object.fromEntries(l.sao.filter((s) => ten.includes(s.ten)).map((s) => [s.ten, s.chi]));

describe('luu han', () => {
  test('tuvi-mcp-server: tieu han, nguyet han, nhat han, 7 sao luu khop 200/200 ca', () => {
    expect(CA_MCP.length).toBe(200);
    const ra = CA_MCP.map((c) => {
      const [D = 0, M = 0, Y = 0] = c.xem;
      const l = tinhLuuHan(laSo(c.vao, Y), Number(c.vao[1]), amSangDuong({ nam: Y, thang: M, ngay: D, nhuan: false }));
      return { tieuHan: l.tieuHan, thang: l.thang, ngay: l.ngay, sao: viTri(l, Object.keys(c.sao)) };
    });
    expect(ra).toEqual(CA_MCP.map((c) => ({ tieuHan: c.tieuHan, thang: c.thang, ngay: c.ngay, sao: c.sao })));
  });

  test('iztro: phai Luu Thai Tue (cung nam, thang, ngay) va Tang Mon, Bach Ho, Loc Kinh Da Ma luu khop 200/200 ca', () => {
    expect(CA_IZ.length).toBe(200);
    const ra = CA_IZ.map((c) => {
      const [nam = 0, thang = 0, ngay = 0] = c.xem.split('-').map(Number);
      const xem = { nam, thang, ngay };
      const ls = laSo(c.vao, duongSangAm(xem).nam);
      const l = tinhLuuHan(ls, Number(c.vao[1]), xem, 'thaiTue');
      // Mac dinh (khoi tu tieu han) thi phai Luu Thai Tue la "phai kia".
      const mac = tinhLuuHan(ls, Number(c.vao[1]), xem);
      return { thaiTue: l.thaiTue, thang: l.thang, ngay: l.ngay, phaiKia: [mac.thangPhaiKia, mac.ngayPhaiKia], sao: viTri(l, Object.keys(c.sao)) };
    });
    expect(ra).toEqual(CA_IZ.map((c) => ({ thaiTue: c.thaiTue, thang: c.thang, ngay: c.ngay, phaiKia: [c.thang, c.ngay], sao: c.sao })));
  });

  test('du 9 sao luu, ten "Luu ..."; nam Binh Ngo 2026: Thai Tue Ngo, Tang Mon Than, Bach Ho Dan, Loc Ton Ty', () => {
    const ls = laSo([24, 2, 1985, 1, 'nam'], 2026);
    const l = tinhLuuHan(ls, 2, { nam: 2026, thang: 10, ngay: 20 });
    expect(l.sao.map((s) => s.ten)).toEqual(['Lưu Thái Tuế', 'Lưu Tang Môn', 'Lưu Bạch Hổ', 'Lưu Lộc Tồn', 'Lưu Kình Dương',
      'Lưu Đà La', 'Lưu Thiên Mã', 'Lưu Thiên Khốc', 'Lưu Thiên Hư']);
    expect([l.canChi, l.thaiTue, ...l.sao.slice(1, 4).map((s) => s.chi)]).toEqual(['Bính Ngọ', 6, 8, 2, 5]);
  });

  test('thang nhuan tinh nhu thang truoc (QUY_UOC muc 5): cung thang, ngay giong ngay cung so cua thang thuong', () => {
    const ls = laSo([24, 2, 1985, 1, 'nam'], 2025);
    // Tim mot ngay thang nhuan nam 2025 (nhuan 6) va ngay cung so o thang 6 thuong.
    const dau = soNgay({ nam: 2025, thang: 7, ngay: 1 });
    const nhuan = Array.from({ length: 90 }, (_, i) => tuSoNgay(dau + i)).find((d) => duongSangAm(d).nhuan);
    if (nhuan === undefined) throw new Error('2025 phai co thang nhuan');
    const a = duongSangAm(nhuan);
    const thuong = amSangDuong({ ...a, nhuan: false });
    const [x, y] = [tinhLuuHan(ls, 2, nhuan), tinhLuuHan(ls, 2, thuong)];
    expect([x.nhuan, x.thangAm, x.thang, x.ngay]).toEqual([true, y.thangAm, y.thang, y.ngay]);
  });

  test('danh gia han (Tan Bien III.1.2): dem sao 4 cung tam phuong tu chinh + sao luu; qua nua tot/xau', () => {
    const ls = laSo([24, 2, 1985, 1, 'nam'], 2026);
    const l = tinhLuuHan(ls, 2, { nam: 2026, thang: 10, ngay: 20 });
    for (let chi = 0; chi < 12; chi++) {
      const d = danhGiaHan(ls, l, chi);
      const hoi = [chi, (chi + 4) % 12, (chi + 6) % 12, (chi + 8) % 12];
      const dem = hoi.reduce((t, c) => t + (ls.cung[c]?.sao.length ?? 0), 0) + l.sao.filter((s) => hoi.includes(s.chi)).length;
      expect(d.tong).toBe(dem);
      expect(d.tot + d.xau).toBeLessThanOrEqual(d.tong);
      expect(d.ket).toBe(d.tot * 2 > d.tong ? 'tốt' : d.xau * 2 > d.tong ? 'xấu' : 'lẫn lộn');
    }
    // Ca A, cung Ty (Phu The): chinh tinh Thien Dong Vuong, Thai Am Vuong deu tinh la tot.
    const ty = danhGiaHan(ls, l, 0);
    const chinhTot = ls.cung[0]?.sao.filter((s) => s.loai === 1 && s.doSang === 'V').length;
    expect(chinhTot).toBe(2);
    expect(ty.tot).toBeGreaterThanOrEqual(2);
  });

  test('vi du trong sach Tan Bien (phan III muc 4): nam At Mui, nam Ty', () => {
    const ls = laSo([24, 2, 1985, 1, 'nam'], 2015);
    const o = (xem: { nam: number; thang: number; ngay: number }) =>
      Object.fromEntries(tinhLuuHan(ls, 2, xem).sao.map((s) => [s.ten.replace('Lưu ', ''), s.chi]));
    // At Mui 2015: Thai Tue Mui, Tang Mon Dau, Bach Ho Mao, Khoc Hoi, Hu Suu, Loc Ton Mao, Kinh Duong Thin, Da La Dan.
    expect(o({ nam: 2015, thang: 6, ngay: 1 })).toMatchObject({
      'Thái Tuế': 7, 'Tang Môn': 9, 'Bạch Hổ': 3, 'Thiên Khốc': 11, 'Thiên Hư': 1, 'Lộc Tồn': 3, 'Kình Dương': 4, 'Đà La': 2,
    });
    // Nam Ty: Luu Thien Ma o Dan.
    expect(o({ nam: 2020, thang: 6, ngay: 1 })['Thiên Mã']).toBe(2);
  });
});
