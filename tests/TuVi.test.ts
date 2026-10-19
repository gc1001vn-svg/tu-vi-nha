/**
 * Tu vi (`src/loi/tuVi/laSo.ts`, chep `ansaotuvi` 0.1.28): 5 la Altuvi (`scripts/doi-chieu/mau-altuvi.json`), bang vang
 * 200 la `ansaotuvi` Python (`tests/vang/tu-vi-ansaotuvi.json`, sinh bang `scripts/doi-chieu/tu-vi-py.py`), noi voi ho so.
 * 3.000 la: `scripts/doi-chieu/so-tu-vi.ts`. Ngay sinh trong file nay deu la ngay GIA (luat 1 CLAUDE.md).
 */
import mau from '../scripts/doi-chieu/mau-altuvi.json';
import { soAltuvi, soPy, type LaPy } from '../scripts/doi-chieu/so-tu-vi.ts';
import { duongSangAm } from '../src/loi/amLich.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { lapLaSo, tinhTuVi } from '../src/loi/tuVi/laSo.ts';
import vang from './vang/tu-vi-ansaotuvi.json';

const LA = vang.la as unknown as LaPy[];
const hs = (o: Partial<HoSo> = {}): HoSo => ({
  id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1985-03-15', gioSinh: '02:00', noiSinh: 'Hà Nội', ...o,
});
const XEM = { nam: 2026, thang: 10, ngay: 19 };

describe('tu vi: la so', () => {
  test('5 la Altuvi: 345/345 sao dung cung, Menh, Than, cuc khop', () => {
    const kq = mau.ca.map((c) => soAltuvi(c));
    expect(kq.flatMap((k) => k.lech)).toEqual([]);
    expect(kq.reduce((s, k) => s + k.khop, 0)).toBe(345);
  });

  test('bang vang du loai: thang nhuan, ngay 30, 12 gio, nam nu, nam Canh', () => {
    expect(LA.length).toBe(200);
    expect(LA.some((p) => p.vao[3] === 1) && LA.some((p) => p.vao[0] === 30)).toBe(true);
    expect(new Set(LA.map((p) => p.vao[4])).size).toBe(12);
    expect(new Set(LA.map((p) => p.vao[5])).size).toBe(2);
    expect(LA.some((p) => (p.vao[2] + 6) % 10 === 6)).toBe(true);
  });

  test('phai ansaotuvi: khop het 200 la Python (sao, do sang, cung, dai han, tieu han, Tuan, Triet, cuc, menh chu)', () => {
    expect(LA.flatMap((p) => soPy(p, 'ansaotuvi'))).toEqual([]);
  });

  test('phai altuvi (mac dinh): chi lech Thien Giai, Pha Toai, Hoa/Linh Tinh, nam Canh, menh chu', () => {
    expect(LA.flatMap((p) => soPy(p, 'altuvi'))).toEqual([]);
  });

  test('ngay gio sai thi nem loi', () => {
    const v = { ngay: 31, thang: 1, nam: 2000, chiGio: 0, gioiTinh: 'nam', namXem: 2026 } as const;
    expect(() => lapLaSo(v)).toThrow();
    expect(() => lapLaSo({ ...v, ngay: 1, chiGio: 12 })).toThrow();
  });
});

describe('tu vi: noi ho so', () => {
  test('ca A Altuvi qua ho so: Menh Dan, Than Thin, Tho Ngu Cuc; nam 2026 dai van Hoi, tieu han Ty', () => {
    const a = tinhTuVi(hs(), tinhHoSo(hs()).chinh, XEM);
    if (a === 'canChonGio') throw new Error('co gio ma doi chon gio');
    expect([a.menh, a.than, a.cuc, a.chiGio, a.amDuong]).toEqual([2, 4, 'Thổ Ngũ Cục', 1, 'Âm Nam']);
    // 42 tuoi mu; am nam di nghich tu Menh: Dan 5, Suu 15, Ty 25, Hoi 35–44. Tieu han: Ty Dau Suu khoi Mui, nam thuan, Suu → Ngo = 5 cung.
    expect([a.tuoi, a.daiVanNay, a.tieuHanNay]).toEqual([42, 11, 0]);
    expect(a.cung[a.menh]?.ten).toBe('Mệnh');
  });

  test('khong ro gio: can chon gio; chon gio gia dinh thi ra la so gio do (QUY_UOC muc 9)', () => {
    const k = hs({ gioSinh: null });
    const kq = tinhHoSo(k).chinh;
    expect(tinhTuVi(k, kq, XEM)).toBe('canChonGio');
    expect(tinhTuVi(k, kq, XEM, 1)).toEqual(tinhTuVi(hs(), tinhHoSo(hs()).chinh, XEM));
  });

  test('gio Ty 23:30: chi Ty, ngay am hom sau (phai A o ho so)', () => {
    const t = hs({ ngaySinh: '2026-10-14', gioSinh: '23:30' });
    const la = tinhTuVi(t, tinhHoSo(t).chinh, XEM);
    const am = duongSangAm({ nam: 2026, thang: 10, ngay: 15 });
    expect(la).toEqual(lapLaSo({ ngay: am.ngay, thang: am.thang, nam: am.nam, chiGio: 0, gioiTinh: 'nam', namXem: 2026 }));
  });
});
