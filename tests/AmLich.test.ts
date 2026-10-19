/**
 * Loi am lich `src/loi/amLich.ts` phai khop bang vang `tests/vang/am-lich-hnd.json` (HND mui +7) TUNG NGAY
 * 01/02/1900–31/12/2100, doi nguoc am → duong ra dung ngay cu, va chan dung hai ngay `@tuquet/lunar` tra "ngay 0".
 * Bang vang tu nhat quan: `tests/AmLichVang.test.ts`. Nam 1900 da sua (nhuan 8, ly do trong "nguon" cua bang).
 */
import vang from './vang/am-lich-hnd.json';
import {
  amSangDuong, canChiNam, canChiNgay, canChiThang, duongSangAm, soNgay, thu, tuSoNgay, type NgayAm,
} from '../src/loi/amLich.ts';

const DAU = soNgay({ nam: 1900, thang: 2, ngay: 1 });
const CUOI = soNgay({ nam: 2100, thang: 12, ngay: 31 });
const MUNG1 = vang.thang.map((x) => {
  const [ngay, nam, thang, nhuan] = x;
  const [y, m, d] = String(ngay).split('-').map(Number);
  return { so: soNgay({ nam: y ?? 0, thang: m ?? 0, ngay: d ?? 0 }), nam: Number(nam), thang: Number(thang), nhuan: nhuan === 1 };
});

/** Ngay am theo bang vang: dau thang am chua ngay `so`. */
function amVang(so: number): NgayAm {
  let i = MUNG1.length - 1;
  while ((MUNG1[i]?.so ?? 0) > so) i--;
  const t = MUNG1[i];
  if (t === undefined) throw new Error(`ngay ${String(so)} truoc bang vang`);
  return { nam: t.nam, thang: t.thang, ngay: so - t.so + 1, nhuan: t.nhuan };
}

describe('am lich HND +7', () => {
  test('moi ngay 01/02/1900–31/12/2100 khop bang vang, doi nguoc am → duong ra dung ngay', () => {
    const lech: string[] = [];
    const khongVe: string[] = [];
    let i = 0;
    for (let so = DAU; so <= CUOI; so++) {
      while ((MUNG1[i + 1]?.so ?? Infinity) <= so) i++;
      const t = MUNG1[i];
      if (t === undefined) throw new Error('bang vang rong');
      const mong = { nam: t.nam, thang: t.thang, ngay: so - t.so + 1, nhuan: t.nhuan };
      const d = tuSoNgay(so);
      const may = duongSangAm(d);
      if (JSON.stringify(may) !== JSON.stringify(mong)) lech.push(`${JSON.stringify(d)}: may ${JSON.stringify(may)} / vang ${JSON.stringify(mong)}`);
      else if (soNgay(amSangDuong(may)) !== so) khongVe.push(JSON.stringify(d));
    }
    expect(CUOI - DAU + 1).toBe(73_383);
    expect({ lech: lech.length, mau: lech.slice(0, 10) }).toEqual({ lech: 0, mau: [] });
    expect(khongVe.slice(0, 10)).toEqual([]);
  });

  test('hai ngay trang moi sat 0 gio (thu vien tra "ngay 0") la ngay 30 thang truoc', () => {
    expect(duongSangAm({ nam: 2054, thang: 5, ngay: 7 })).toEqual({ nam: 2054, thang: 3, ngay: 30, nhuan: false });
    expect(duongSangAm({ nam: 2062, thang: 4, ngay: 9 })).toEqual({ nam: 2062, thang: 2, ngay: 30, nhuan: false });
    expect(amVang(soNgay({ nam: 2054, thang: 5, ngay: 7 }))).toEqual({ nam: 2054, thang: 3, ngay: 30, nhuan: false });
  });

  test('nam 1900 nhuan thang 8 (bang vang da sua)', () => {
    expect(duongSangAm({ nam: 1900, thang: 8, ngay: 25 })).toEqual({ nam: 1900, thang: 8, ngay: 1, nhuan: false });
    expect(duongSangAm({ nam: 1900, thang: 9, ngay: 24 })).toEqual({ nam: 1900, thang: 8, ngay: 1, nhuan: true });
  });

  test('ngay am khong co that thi nem loi', () => {
    // Lay mot thang thieu (29 ngay) cua nam 2026 tu bang vang: ngay 30 cua no khong co.
    const thieu = MUNG1.findIndex((t, k) => (MUNG1[k + 1]?.so ?? 0) - t.so === 29 && t.nam === 2026);
    const t = MUNG1[thieu];
    if (t === undefined) throw new Error('khong tim duoc thang thieu nam 2026');
    expect(() => amSangDuong({ nam: t.nam, thang: t.thang, ngay: 30, nhuan: t.nhuan })).toThrow();
    // 2026 khong co thang nhuan; 2025 nhuan thang 6 → nhuan thang 5/2025 khong co.
    expect(() => amSangDuong({ nam: 2026, thang: 3, ngay: 1, nhuan: true })).toThrow();
    expect(() => amSangDuong({ nam: 2025, thang: 5, ngay: 1, nhuan: true })).toThrow();
    expect(amSangDuong({ nam: 2025, thang: 6, ngay: 1, nhuan: true })).toEqual({ nam: 2025, thang: 7, ngay: 25 });
  });

  test('can chi, thu', () => {
    const tet85 = { nam: 1985, thang: 1, ngay: 21 };
    expect([canChiNgay(tet85), canChiThang(duongSangAm(tet85)), canChiNam(duongSangAm(tet85).nam)])
      .toEqual(['Canh Thân', 'Mậu Dần', 'Ất Sửu']);
    expect(canChiNam(1984)).toBe('Giáp Tý');
    expect(canChiNam(2026)).toBe('Bính Ngọ');
    expect(canChiNgay({ nam: 2026, thang: 10, ngay: 19 })).toBe('Bính Dần');
    expect(thu({ nam: 2026, thang: 10, ngay: 19 })).toBe(1);
    expect(thu({ nam: 2026, thang: 10, ngay: 18 })).toBe(0);
  });
});
