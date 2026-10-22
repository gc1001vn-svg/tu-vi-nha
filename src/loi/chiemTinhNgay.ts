/**
 * Chiem tinh theo ngay (dot 6 phan 2): Mat Trang doi cung luc nao, tuan trang, hanh tinh dang nghich hanh (tu – toi),
 * goc chieu giua bau troi luc xem va la so goc. Thoi diem la "phut UTC" nhu `chiemTinh.ts`; gio "bay gio" do vo ngoai dua vao.
 * Thuoc: `tests/ChiemTinh.test.ts` (bang vang Swiss Ephemeris `vaoCung`, `nghich`; Sao Thuy nghich hanh 2026 theo trang lich).
 */
import { dinhDangNgay, tuSoNgay } from './amLich.ts';
import { GOC, chuan, cungCua, kinhDo, lech, type GocChieu, type LaSo } from './chiemTinh.ts';

/** Phut UTC tu mili giay Unix (dong ho o vo ngoai): 01/01/1970 la ngay Julius 2440588. */
export const phutUtcTuMs = (ms: number): number => 2440588 * 1440 + ms / 60000;

/** "22/10/2026" theo gio Viet Nam (+7). */
export const ngayVN = (phutUtc: number): string => dinhDangNgay(tuSoNgay(Math.floor((Math.round(phutUtc) + 420) / 1440)));

/** "14:05 22/10/2026" theo gio Viet Nam (+7). */
export function gioVN(phutUtc: number): string {
  const p = Math.round(phutUtc) + 420, phut = p - Math.floor(p / 1440) * 1440;
  return `${String(Math.floor(phut / 60)).padStart(2, '0')}:${String(phut % 60).padStart(2, '0')} ${ngayVN(phutUtc)}`;
}

/** Luc Mat Trang sang cung ke tiep (phut UTC): buoc 1 gio roi chia doi toi nua phut — Mat Trang qua mot cung trong 2–3 ngay. */
export function trangDoiCung(phutUtc: number): number {
  const c = cungCua(kinhDo(1, phutUtc));
  let a = phutUtc, b = phutUtc + 60;
  while (cungCua(kinhDo(1, b)) === c) {
    a = b;
    b += 60;
    if (b - phutUtc > 4 * 1440) throw new Error('Mặt Trăng không đổi cung trong 4 ngày');
  }
  while (b - a > 0.5) {
    const m = (a + b) / 2;
    if (cungCua(kinhDo(1, m)) === c) a = m;
    else b = m;
  }
  return b;
}

// Cung cach xet nghich hanh cua `laSo` (kinh do nua ngay truoc va sau) de khoi va bang khong noi nguoc nhau.
const nghichLuc = (i: number, p: number): boolean => lech(kinhDo(i, p + 720), kinhDo(i, p - 720)) < 0;

/** Khoang nghich hanh dang dien ra cua hanh tinh `i` (2..9): [luc bat dau, luc ket thuc] (phut UTC); dang thuan thi null. */
export function khoangNghich(i: number, phutUtc: number): readonly [number, number] | null {
  if (!nghichLuc(i, phutUtc)) return null;
  const bien = (huong: number): number => {
    let a = phutUtc, b = phutUtc + huong * 1440;
    while (nghichLuc(i, b)) {
      a = b;
      b += huong * 1440;
      if (Math.abs(b - phutUtc) > 400 * 1440) throw new Error('Nghịch hành quá 400 ngày');
    }
    while (Math.abs(b - a) > 5) {
      const m = (a + b) / 2;
      if (nghichLuc(i, m)) a = m;
      else b = m;
    }
    return (a + b) / 2;
  };
  return [bien(-1), bien(1)];
}

/** Khoang nghich hanh bat dau trong `soNgay` ngay toi (xet tung ngay) cua hanh tinh dang thuan; khong co, hay dang nghich, thi null. */
export function sapNghich(i: number, phutUtc: number, soNgay: number): readonly [number, number] | null {
  for (let d = 1; d <= soNgay; d++) {
    const k = khoangNghich(i, phutUtc + d * 1440);
    if (k !== null) return k[0] > phutUtc ? k : null;
  }
  return null;
}

/** Tam tuan trang, moi tuan 45° goc Mat Trang – Mat Troi, tam o 0°, 45°, 90°… (QUY_UOC muc 23). */
export const TUAN_TRANG = [
  'Trăng non', 'Trăng lưỡi liềm đầu tháng', 'Bán nguyệt đầu tháng (thượng huyền)', 'Trăng khuyết đầu tháng', 'Trăng tròn',
  'Trăng khuyết cuối tháng', 'Bán nguyệt cuối tháng (hạ huyền)', 'Trăng lưỡi liềm cuối tháng',
] as const;

/** Tuan trang (0..7 theo `TUAN_TRANG`) va phan tram mat trang duoc chieu sang. */
export function tuanTrang(ls: LaSo): { readonly pha: number; readonly sang: number } {
  const g = chuan((ls.diem[1]?.kinh ?? 0) - (ls.diem[0]?.kinh ?? 0));
  return { pha: Math.floor(chuan(g + 22.5) / 45), sang: Math.round(50 * (1 - Math.cos(g * Math.PI / 180))) };
}

/** Goc chieu giua thien the luc xem (`nay`, 0..9) va la so goc (`goc`: 0..9, cung Moc 11, Thien Dinh 12), chat nhat truoc. */
export function gocChieuQua(nay: LaSo, goc: LaSo, orb = 1): GocChieu[] {
  const ds: (readonly [number, number])[] = goc.diem.slice(0, 10).map((d, i) => [i, d.kinh] as const);
  if (goc.moc !== null && goc.dinh !== null) ds.push([11, goc.moc], [12, goc.dinh]);
  const ra: GocChieu[] = [];
  nay.diem.slice(0, 10).forEach((d, a) => {
    for (const [b, kb] of ds) {
      const x = Math.abs(lech(d.kinh, kb)), g = GOC.findIndex((y) => Math.abs(x - y.do) <= orb);
      if (g >= 0) ra.push({ a, b, goc: g, orb: Math.abs(x - (GOC[g]?.do ?? 0)) });
    }
  });
  return ra.sort((x, y) => x.orb - y.orb);
}
