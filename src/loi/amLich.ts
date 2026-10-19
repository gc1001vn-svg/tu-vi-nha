/**
 * Am lich Viet Nam: thuat toan Ho Ngoc Duc mui +7 (`@tuquet/lunar`), can chi nam/thang/ngay.
 * Thuoc: `tests/AmLich.test.ts` so tung ngay 01/02/1900–31/12/2100 voi bang vang `tests/vang/am-lich-hnd.json`.
 * Quy uoc: `docs/QUY_UOC.md` muc 0 (lich +7), muc 2 (can chi thang in lich theo thang am), muc 5 (thang nhuan).
 */
import { jdFromDate, jdToDate, lunarToSolar, solarToLunar } from '@tuquet/lunar';
import { hv } from './hanViet/index.ts';

export interface NgayDuong { readonly nam: number; readonly thang: number; readonly ngay: number }
export interface NgayAm { readonly nam: number; readonly thang: number; readonly ngay: number; readonly nhuan: boolean }

/** Thu tu can, chi (Giap = 0, Ty = 0) bang chu Han de tra bang Han-Viet — ten hien ra chi lay tu bang do. */
export const CAN = '甲乙丙丁戊己庚辛壬癸';
export const CHI = '子丑寅卯辰巳午未申酉戌亥';

const MUI = 7;

/** So ngay Julius cua ngay duong — dung cong tru ngay ma khong can `Date` (loi thuan cam dong ho). */
export function soNgay(d: NgayDuong): number {
  return jdFromDate(d.ngay, d.thang, d.nam);
}

export function tuSoNgay(jd: number): NgayDuong {
  const [ngay, thang, nam] = jdToDate(jd);
  return { nam, thang, ngay };
}

export function duongSangAm(d: NgayDuong, mui = MUI): NgayAm {
  const r = solarToLunar({ day: d.ngay, month: d.thang, year: d.nam }, mui);
  if (r.day !== 0) return { nam: r.year, thang: r.month, ngay: r.day, nhuan: r.isLeap };
  // `@tuquet/lunar` 0.1.0 tra "ngay 0" khi trang moi sat 0 gio (07/05/2054, 09/04/2062): do la ngay cuoi thang truoc.
  const truoc = duongSangAm(tuSoNgay(soNgay(d) - 1), mui);
  return { ...truoc, ngay: truoc.ngay + 1 };
}

/** Ngay am → ngay duong. Ngay am khong co that (30 cua thang thieu, nhuan sai thang) thi nem loi. */
export function amSangDuong(a: NgayAm, mui = MUI): NgayDuong {
  const r = lunarToSolar({ day: a.ngay, month: a.thang, year: a.nam, isLeap: a.nhuan }, mui);
  const d = { nam: r.year, thang: r.month, ngay: r.day };
  const lai = duongSangAm(d, mui);
  if (lai.nam !== a.nam || lai.thang !== a.thang || lai.ngay !== a.ngay || lai.nhuan !== a.nhuan) {
    throw new Error(`Không có ngày âm ${dinhDangAm(a)}`);
  }
  return d;
}

export function tenCanChi(can: number, chi: number): string {
  return `${hv('can', CAN.charAt(can))} ${hv('chi', CHI.charAt(chi))}`;
}

/** Nam am (theo Tet). 1984 = Giap Ty. */
export function canChiNam(namAm: number): string {
  return tenCanChi((namAm + 6) % 10, (namAm + 8) % 12);
}

/** Can chi thang theo thang am, nhu lich Viet in (anh chup 19/10): thang Gieng nam Giap/Ky = Binh Dan; nhuan dung can chi thang truoc. */
export function canChiThang(a: NgayAm): string {
  return tenCanChi((((a.nam + 6) % 10) % 5 * 2 + 2 + a.thang - 1) % 10, (a.thang + 1) % 12);
}

export function canChiNgay(d: NgayDuong): string {
  const jd = soNgay(d);
  return tenCanChi((jd + 9) % 10, (jd + 1) % 12);
}

/** 0 = Chu nhat … 6 = Thu bay. */
export function thu(d: NgayDuong): number {
  return (soNgay(d) + 1) % 7;
}

const hai = (n: number): string => String(n).padStart(2, '0');

export function dinhDangNgay(d: NgayDuong): string {
  return `${hai(d.ngay)}/${hai(d.thang)}/${String(d.nam)}`;
}

export function dinhDangAm(a: NgayAm): string {
  return `${String(a.ngay)}/${String(a.thang)}${a.nhuan ? ' nhuận' : ''}/${String(a.nam)}`;
}
