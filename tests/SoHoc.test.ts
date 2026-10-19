/**
 * Than so hoc, cung hoang dao, nhip sinh hoc (`src/loi/soHoc.ts`). Ngay sinh trong file nay deu la ngay GIA (luat 1 CLAUDE.md);
 * vai ca la vi du tinh tay trong ket qua tim kiem (URL o bao cao C3), de biet cong thuc khop nguon chu khong chi khop chinh no.
 */
import { soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { cungHoangDao, nhipSinhHoc, tenSo, thanSo } from '../src/loi/soHoc.ts';

const d = (s: string): NgayDuong => {
  const [ngay = 0, thang = 0, nam = 0] = s.split('/').map(Number);
  return { nam, thang, ngay };
};
const XEM = d('19/10/2026');
const cong = (x: NgayDuong, n: number): NgayDuong => tuSoNgay(soNgay(x) + n);

describe('so chu dao', () => {
  // [ngay sinh, cong mot luot (mac dinh), rut gon rieng]
  const CA: [string, number, number][] = [
    ['25/11/1998', 9, 9], // fptshop: 2+5+1+1+1+9+9+8 = 36 → 9
    ['12/04/1994', 3, 3], // hellobacsi: 30 → 3
    ['08/06/1987', 3, 3], // vi du web VN: 39 → 12 → 3
    ['03/01/2002', 8, 8], // hellobacsi: 8
    ['28/11/1965', 33, 6], // vi du web quoc te (rut gon rieng): 1 + 11 + 3 = 15 → 6; cong mot luot ra dung 33
    ['01/01/1980', 2, 11], // 20 → 2; 1 + 1 + 9 = 11
    ['20/03/2005', 3, 3],
    ['29/09/1989', 11, 11], // 47 → 11; 11 + 9 + 9 = 29 → 11
    ['19/04/1950', 11, 11], // 29 → 11; 1 + 4 + 6 = 11
    ['11/05/1950', 22, 22], // 22; 11 + 5 + 6 = 22
    ['09/02/1957', 33, 33], // 33; 9 + 2 + 22 = 33
    ['25/11/2000', 11, 2], // 11; 7 + 11 + 2 = 20 → 2
    ['14/02/2001', 10, 1], // 10 giu nguyen (phai VN khong co so 1); 5 + 2 + 3 = 10 → 1
  ];

  test.each(CA)('%s: mot luot %i, rut gon rieng %i', (s, motLuot, rutGonRieng) => {
    expect(thanSo(d(s), XEM).chuDao).toBe(motLuot);
    expect(thanSo(d(s), XEM, { soChuDao: 'rutGonRieng' }).chuDao).toBe(rutGonRieng);
  });

  test('mot luot ra 2–11, 22, 33 (khong co 1); rut gon rieng ra 1–9, 11, 22, 33; so nao cung co loi', () => {
    const ra = { motLuot: new Set<number>(), rutGonRieng: new Set<number>() };
    const dau = soNgay(d('01/01/1900'));
    for (let n = dau; n < dau + 201 * 366; n += 3) {
      for (const cach of ['motLuot', 'rutGonRieng'] as const) {
        const t = thanSo(tuSoNgay(n), XEM, { soChuDao: cach });
        expect(t.nghiaChuDao).not.toBe('');
        ra[cach].add(t.chuDao);
      }
    }
    const xep = (s: Set<number>): number[] => [...s].sort((a, b) => a - b);
    expect(xep(ra.motLuot)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33]);
    expect(xep(ra.rutGonRieng)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]);
    expect([tenSo(22), tenSo(33), tenSo(11)]).toEqual(['22/4', '33/6', '11']);
  });
});

describe('so ngay sinh, nam/thang ca nhan, bieu do', () => {
  test('so ngay sinh: rut gon ngay, giu 11, 22', () => {
    const so = (ngay: number): number => thanSo({ nam: 1990, thang: 1, ngay }, XEM).ngaySinh;
    expect([1, 10, 11, 15, 19, 22, 28, 29, 30, 31].map(so)).toEqual([1, 1, 11, 6, 1, 22, 1, 11, 3, 4]);
  });

  test('vi du web: 15/08 nam 2026 → 6 (quoc te); 01/05 nam 2024 → 5 (blog VN)', () => {
    expect(thanSo(d('15/08/1990'), d('01/06/2026')).namCaNhan).toBe(6);
    expect(thanSo(d('01/05/1990'), d('01/06/2024')).namCaNhan).toBe(5);
  });

  test('thang ca nhan = nam ca nhan + thang: nam 4, thang 9 → 13 → 4 (vi du web)', () => {
    const t = thanSo(d('01/02/1990'), d('15/09/2026'));
    expect([t.namCaNhan, t.thangCaNhan]).toEqual([4, 4]);
  });

  test('nam ca nhan quanh 01/01: mac dinh doi 01/01, tuy chon sinhNhat doi ngay sinh nhat', () => {
    const sinh = d('15/03/1985');
    const nam = (xem: string, namCaNhan?: 'sinhNhat'): [number, number, number] => {
      const t = thanSo(sinh, d(xem), namCaNhan === undefined ? {} : { namCaNhan });
      return [t.namXem, t.namCaNhan, t.thangCaNhan];
    };
    expect(nam('31/12/2025')).toEqual([2025, 9, 3]);
    expect(nam('01/01/2026')).toEqual([2026, 1, 2]);
    expect(nam('31/12/2025', 'sinhNhat')).toEqual([2025, 9, 3]);
    expect(nam('01/01/2026', 'sinhNhat')).toEqual([2025, 9, 1]);
    expect(nam('14/03/2026', 'sinhNhat')).toEqual([2025, 9, 3]);
    expect(nam('15/03/2026', 'sinhNhat')).toEqual([2026, 1, 4]);
  });

  test('bieu do ngay sinh: dem chu so 1–9, bo so 0', () => {
    expect(thanSo(d('15/03/1985'), XEM).luoi).toEqual([2, 0, 1, 0, 2, 0, 0, 1, 1]);
    expect(thanSo(d('20/10/2000'), XEM).luoi).toEqual([1, 2, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('cung hoang dao', () => {
  // Ranh ngay cua `lunar-typescript` (Solar.getXingZuo): [ngay cuoi cung truoc, ngay dau cung sau].
  const RANH: [string, string, string, string][] = [
    ['19/01', 'Ma Kết', '20/01', 'Bảo Bình'], ['18/02', 'Bảo Bình', '19/02', 'Song Ngư'],
    ['20/03', 'Song Ngư', '21/03', 'Bạch Dương'], ['19/04', 'Bạch Dương', '20/04', 'Kim Ngưu'],
    ['20/05', 'Kim Ngưu', '21/05', 'Song Tử'], ['21/06', 'Song Tử', '22/06', 'Cự Giải'],
    ['22/07', 'Cự Giải', '23/07', 'Sư Tử'], ['22/08', 'Sư Tử', '23/08', 'Xử Nữ'],
    ['22/09', 'Xử Nữ', '23/09', 'Thiên Bình'], ['23/10', 'Thiên Bình', '24/10', 'Thiên Yết'],
    ['22/11', 'Thiên Yết', '23/11', 'Nhân Mã'], ['21/12', 'Nhân Mã', '22/12', 'Ma Kết'],
  ];

  test.each(RANH)('%s %s | %s %s, hai ngay ranh ghi cung ben kia', (a, cungA, b, cungB) => {
    expect(cungHoangDao(d(`${a}/1990`))).toMatchObject({ ten: cungA, satRanh: cungB });
    expect(cungHoangDao(d(`${b}/1990`))).toMatchObject({ ten: cungB, satRanh: cungA });
  });

  test('giua cung khong ghi sat ranh; ca nam nhuan cung nao cung co loi', () => {
    expect(cungHoangDao(d('15/07/1990'))).toMatchObject({ ten: 'Cự Giải', satRanh: null });
    expect(cungHoangDao(d('29/02/2024')).ten).toBe('Song Ngư');
    const ten = new Set<string>();
    for (let n = soNgay(d('01/01/2024')); n <= soNgay(d('31/12/2024')); n++) {
      const c = cungHoangDao(tuSoNgay(n));
      expect(c.nghia).not.toBe('');
      ten.add(c.ten);
    }
    expect(ten.size).toBe(12);
  });
});

describe('nhip sinh hoc', () => {
  const SINH = d('10/06/1992');
  const phanTram = (t: number): number[] => nhipSinhHoc(SINH, cong(SINH, t)).nhip.map((x) => x.phanTram);

  test('t = 0: ca ba 0%, dang len, ngay nguy', () => {
    expect(nhipSinhHoc(SINH, SINH).nhip).toMatchObject([
      { chuKy: 23, phanTram: 0, len: true, nguy: true },
      { chuKy: 28, phanTram: 0, len: true, nguy: true },
      { chuKy: 33, phanTram: 0, len: true, nguy: true },
    ]);
  });

  test('t = T/4 → 100%: cam xuc t = 7 dung T/4; the chat t = 6 (T/4 = 5,75), tri tue t = 8 (8,25) lam tron 100', () => {
    expect(phanTram(7)[1]).toBe(100);
    expect(phanTram(6)[0]).toBe(100);
    expect(phanTram(8)[2]).toBe(100);
  });

  test('vi du nguon: sau 365 ngay ra −73%, 22%, 37%', () => {
    expect(phanTram(365)).toEqual([-73, 22, 37]);
  });

  test('ngay nguy khi duong cong cat moc 0 trong ngay; xu huong so voi ngay mai', () => {
    const nguy = (t: number): boolean[] => nhipSinhHoc(SINH, cong(SINH, t)).nhip.map((x) => x.nguy);
    expect(nguy(11)).toEqual([true, false, false]); // 23/2 = 11,5 roi vao ngay 11
    expect(nguy(12)).toEqual([false, false, false]);
    expect(nguy(14)).toEqual([false, true, false]);
    expect(nguy(16)).toEqual([false, false, true]); // 33/2 = 16,5
    expect(nguy(23)).toEqual([true, false, false]);
    const len = (t: number): boolean | undefined => nhipSinhHoc(SINH, cong(SINH, t)).nhip[0]?.len;
    expect([len(5), len(6), len(16), len(17)]).toEqual([true, false, false, true]); // dinh 5,75, day 17,25
    expect(() => nhipSinhHoc(SINH, cong(SINH, -1))).toThrow('Ngày xem trước ngày sinh');
  });
});
