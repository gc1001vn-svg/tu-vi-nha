/**
 * Bang mui gio lich su VN viet cung (`src/loi/muiGio.ts`) phai ra dung tung moc o `docs/QUY_UOC.md` muc 7, va bao
 * gio lap / gio khong co luc doi mui (muc 8: tinh ca hai). Phut = so ngay Julius × 1440 + phut dong ho dia phuong.
 */
import { soNgay } from '../src/loi/amLich.ts';
import { lechGio } from '../src/loi/muiGio.ts';
import type { Mien } from '../src/loi/tinh.ts';

const luc = (s: string): number => {
  const [nam, thang, ngay, gio, phut] = s.split(/[- :]/).map(Number);
  return soNgay({ nam: nam ?? 0, thang: thang ?? 0, ngay: ngay ?? 0 }) * 1440 + (gio ?? 0) * 60 + (phut ?? 0);
};
const lech = (mien: Mien, s: string): ReturnType<typeof lechGio> => lechGio(mien, luc(s));

describe('mui gio lich su Viet Nam', () => {
  test('gio dia phuong truoc 1911, gio Phu Lien tu 01/07/1906 (Bac)', () => {
    expect(lech('bac', '1900-06-01 12:00')).toEqual({ lech: 423 });
    expect(lech('nam', '1900-06-01 12:00')).toEqual({ lech: 426.5 });
    expect(lech('bac', '1906-07-01 12:00')).toEqual({ lech: 426.5 });
    expect(lech('bac', '1911-04-30 12:00')).toEqual({ lech: 426.5 });
  });

  test('+7 tu 01/05/1911, +8 tu 31/12/1942 23:00, +9 tu 14/03/1945 23:00, +7 tu 02/09/1945', () => {
    for (const m of ['bac', 'nam'] as const) {
      expect(lech(m, '1911-05-01 12:00')).toEqual({ lech: 420 });
      expect(lech(m, '1942-12-31 22:59')).toEqual({ lech: 420 });
      expect(lech(m, '1942-12-31 23:30')).toMatchObject({ lech: 480, khac: 420 }); // dong ho nhay toi: gio nay khong co
      expect(lech(m, '1943-01-01 00:30')).toEqual({ lech: 480 });
      expect(lech(m, '1945-03-14 23:30')).toMatchObject({ lech: 540, khac: 480 });
      expect(lech(m, '1945-06-01 12:00')).toEqual({ lech: 540 });
      expect(lech(m, '1945-09-01 22:30')).toMatchObject({ lech: 540, khac: 420 }); // lui 2 gio: 22:00–24:00 gap hai lan
      expect(lech(m, '1945-09-01 21:59')).toEqual({ lech: 540 });
      expect(lech(m, '1945-09-02 00:00')).toEqual({ lech: 420 });
    }
    expect(lech('nam', '1942-12-31 23:30').lyDo).toContain('không có');
    expect(lech('bac', '1945-09-01 22:30').lyDo).toContain('lặp');
  });

  test('1947–10/1954: +8, vung khang chien co the +7 (chua chac)', () => {
    for (const m of ['bac', 'nam'] as const) {
      expect(lech(m, '1947-03-31 12:00')).toEqual({ lech: 420 });
      const nam50 = lech(m, '1950-06-01 12:00');
      expect(nam50).toMatchObject({ lech: 480, khac: 420 });
      expect(nam50.lyDo).toContain('chưa chắc');
      expect(lech(m, '1954-10-15 12:00')).toMatchObject({ lech: 480, khac: 420 });
    }
    expect(lech('bac', '1954-11-15 12:00')).toEqual({ lech: 420 });
    expect(lech('bac', '1955-06-01 12:00')).toEqual({ lech: 420 });
    expect(lech('nam', '1955-01-01 12:00')).toEqual({ lech: 480 });
  });

  test('mien Nam: +7 tu 01/07/1955 01:00, +8 tu 31/12/1959 23:00, +7 tu 13/06/1975', () => {
    expect(lech('nam', '1955-07-01 00:30')).toMatchObject({ lech: 480, khac: 420 }); // 00:00–01:00 gap hai lan
    expect(lech('nam', '1955-07-01 01:30')).toEqual({ lech: 420 });
    expect(lech('nam', '1959-12-31 22:59')).toEqual({ lech: 420 });
    const khongCo = lech('nam', '1959-12-31 23:30');
    expect(khongCo).toMatchObject({ lech: 480, khac: 420 });
    expect(khongCo.lyDo).toContain('không có');
    expect(lech('nam', '1960-01-01 00:30')).toEqual({ lech: 480 });
    expect(lech('nam', '1970-06-15 08:00')).toEqual({ lech: 480 });
    expect(lech('bac', '1965-06-15 08:00')).toEqual({ lech: 420 });
    const lap = lech('nam', '1975-06-12 23:30');
    expect(lap).toMatchObject({ lech: 480, khac: 420 });
    expect(lap.lyDo).toContain('lặp');
    expect(lech('nam', '1975-06-12 22:59')).toEqual({ lech: 480 });
    expect(lech('nam', '1975-06-13 00:00')).toEqual({ lech: 420 });
    expect(lech('nam', '2026-10-19 12:00')).toEqual({ lech: 420 });
  });
});
