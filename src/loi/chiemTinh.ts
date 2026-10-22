/**
 * Chiem tinh phuong Tay (dot 6): vi tri 10 thien the + Bac Giao Diem, cung Moc, Thien Dinh, 12 nha Placidus, goc chieu.
 * Vi tri lay tu `astronomy-engine` (MIT); so Swiss Ephemeris o `tests/vang/chiem-tinh-swe.json`. Quy uoc (ten, orb, he
 * nha, nut): `docs/QUY_UOC.md` muc 23. Thoi diem la "phut UTC" = so ngay Julius × 1440 + phut trong ngay theo gio UTC
 * (cach dem cua `muiGio.ts`) — loi khong doc dong ho.
 */
import {
  AstroTime, Body, GeoMoonState, GeoVector, RotateVector, Rotation_EQJ_ECT, SiderealTime, SphereFromVector, Vector, e_tilt,
} from 'astronomy-engine';
import { soNgay } from './amLich.ts';
import type { HoSo } from './hoSo.ts';
import { lechGio, type LechGio } from './muiGio.ts';
import { NUOC_NGOAI, mienCua } from './tinh.ts';
import { TOA_DO } from './toaDo.ts';

/** Ten 12 cung (trung bang Han–Viet `cungHoangDao`), bat dau Bach Duong o 0°. */
export const CUNG = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
  'Thiên Bình', 'Thiên Yết', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư',
] as const;
export const CUNG_ANH = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

/** 13 diem cua la so: 0..9 thien the, 10 Bac Giao Diem, 11 cung Moc, 12 Thien Dinh. */
export const DIEM = [
  'Mặt Trời', 'Mặt Trăng', 'Sao Thủy', 'Sao Kim', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương',
  'Sao Diêm Vương', 'Bắc Giao Điểm', 'Cung Mọc', 'Thiên Đỉnh',
] as const;
export const DIEM_ANH = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North Node', 'Ascendant',
  'Midheaven',
] as const;
const THAN: readonly Body[] = [
  Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn, Body.Uranus, Body.Neptune, Body.Pluto,
];

/** Nam goc chieu chinh, orb theo muc 23: 8° cho bon goc lon, 6° cho luc hop. */
export const GOC = [
  { ten: 'Hợp', anh: 'Conjunction', do: 0, orb: 8 },
  { ten: 'Lục hợp', anh: 'Sextile', do: 60, orb: 6 },
  { ten: 'Vuông', anh: 'Square', do: 90, orb: 8 },
  { ten: 'Tam hợp', anh: 'Trine', do: 120, orb: 8 },
  { ten: 'Đối', anh: 'Opposition', do: 180, orb: 8 },
] as const;

/** Bac Giao Diem: nut trung binh (mac dinh nhu astro-seek, anh chot 22/10) hay nut that (quy dao Mat Trang tuc thoi) — tuy chon `nutBac`. */
export type Nut = 'that' | 'trungBinh';

export interface ViTri { readonly kinh: number; readonly nghich: boolean }
export interface LaSo {
  /** 11 diem dau cua `DIEM`: kinh do hoang dao 0..360 (bieu kien, hoang dao that cua ngay) va nghich hanh. */
  readonly diem: readonly ViTri[];
  /** Khong co toa do (sinh nuoc ngoai, khong ro gio) thi ca ba la null. */
  readonly moc: number | null;
  readonly dinh: number | null;
  /** 12 dinh nha Placidus, phan tu 0 la nha 1. */
  readonly nha: readonly number[] | null;
}

const R = Math.PI / 180;
export const chuan = (x: number): number => ((x % 360) + 360) % 360;
const lech = (a: number, b: number): number => {
  const d = chuan(a - b);
  return d > 180 ? d - 360 : d;
};
export const cungCua = (kinh: number): number => Math.floor(chuan(kinh) / 30);

/** "Song Ngư 12°34′": do va phut cat bo phan le, nhu lich thien van. */
export function dinhDang(kinh: number): string {
  const p = Math.floor(chuan(kinh) * 60);
  return `${CUNG[Math.floor(p / 1800)] ?? ''} ${String(Math.floor((p % 1800) / 60))}°${String(p % 60).padStart(2, '0')}′`;
}

// So ngay Julius (`soNgay`) dem tu trua, nua dem dau ngay la JD − 0,5; AstroTime nhan so ngay UT ke tu J2000 (JD 2451545).
const thoiGian = (phutUtc: number): AstroTime => new AstroTime(phutUtc / 1440 - 0.5 - 2451545);

function kinhCua(i: number, t: AstroTime, nut: Nut): number {
  const than = THAN[i];
  if (than !== undefined) return chuan(SphereFromVector(RotateVector(Rotation_EQJ_ECT(t), GeoVector(than, t, true))).lon);
  if (nut === 'trungBinh') {
    const T = t.tt / 36525; // Meeus, Astronomical Algorithms (47.7)
    return chuan(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T ** 3 / 467441 - T ** 4 / 60616000);
  }
  // Nut that = nut quy dao Mat Trang tuc thoi: huong h = r × v trong he hoang dao that cua ngay.
  const s = GeoMoonState(t), xoay = Rotation_EQJ_ECT(t);
  const r = RotateVector(xoay, new Vector(s.x, s.y, s.z, t)), v = RotateVector(xoay, new Vector(s.vx, s.vy, s.vz, t));
  return chuan(Math.atan2(r.y * v.z - r.z * v.y, r.x * v.z - r.z * v.x) / R);
}

/**
 * Cung Moc, Thien Dinh, 12 dinh nha Placidus tu RAMC, do nghieng hoang dao, vi do (deu tinh bang do). Dinh 11, 12 chia
 * cung ngay, dinh 2, 3 chia cung dem cua chinh diem do — phep lap; vi do VN (8–24°) hoi tu nhanh, thuoc luoi o test.
 */
export function placidus(ramc: number, nghieng: number, viDo: number): { moc: number; dinh: number; nha: number[] } {
  const a = ramc * R, e = nghieng * R, phi = viDo * R;
  const raSangKinh = (ra: number): number => chuan(Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(e)) / R);
  const dinh = raSangKinh(a);
  const moc = chuan(Math.atan2(Math.cos(a), -(Math.sin(a) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / R);
  const dinhNha = (phan: number, duoi: boolean): number => {
    // ad: hieu xich kinh cua diem dang thu (bat dau 0 = chia deu theo xich kinh).
    let ad = 0, lam = Number.NaN;
    for (let i = 0; i < 100; i++) {
      const moi = raSangKinh(duoi ? a + Math.PI - phan * (Math.PI / 2 - ad) : a + phan * (Math.PI / 2 + ad));
      if (Math.abs(lech(moi, lam)) < 1e-9) return moi;
      lam = moi;
      ad = Math.asin(Math.tan(phi) * Math.tan(Math.asin(Math.sin(e) * Math.sin(lam * R))));
    }
    throw new Error(`Placidus không hội tụ (vĩ độ ${String(viDo)})`);
  };
  const n11 = dinhNha(1 / 3, false), n12 = dinhNha(2 / 3, false), n2 = dinhNha(2 / 3, true), n3 = dinhNha(1 / 3, true);
  const nha = [moc, n2, n3, dinh + 180, n11 + 180, n12 + 180, moc + 180, n2 + 180, n3 + 180, dinh, n11, n12].map(chuan);
  return { moc, dinh, nha };
}

/** La so tai mot thoi diem. `toaDo` = [vi do Bac, kinh do Dong]; null thi bo cung Moc va nha. */
export function laSo(phutUtc: number, toaDo: readonly [number, number] | null, nut: Nut = 'trungBinh'): LaSo {
  const t = thoiGian(phutUtc), truoc = t.AddDays(-0.5), sau = t.AddDays(0.5);
  const diem = DIEM.slice(0, 11).map((_, i) => ({
    kinh: kinhCua(i, t, nut),
    // Mat Troi, Mat Trang khong bao gio nghich; diem khac so kinh do nua ngay truoc va sau.
    nghich: i > 1 && lech(kinhCua(i, sau, nut), kinhCua(i, truoc, nut)) < 0,
  }));
  if (toaDo === null) return { diem, moc: null, dinh: null, nha: null };
  return { diem, ...placidus(chuan(SiderealTime(t) * 15 + toaDo[1]), e_tilt(t).tobl, toaDo[0]) };
}

/** So nha (1..12) cua mot kinh do theo 12 dinh nha. */
export function nhaCua(kinh: number, nha: readonly number[]): number {
  for (let i = 0; i < 12; i++) {
    const dau = nha[i] ?? 0;
    if (chuan(kinh - dau) < chuan((nha[(i + 1) % 12] ?? 0) - dau)) return i + 1;
  }
  throw new Error('Đỉnh nhà không theo thứ tự');
}

export interface GocChieu { readonly a: number; readonly b: number; readonly goc: number; readonly orb: number }

/** Goc chieu giua 10 thien the, cung Moc, Thien Dinh (so thu tu theo `DIEM`), chat nhat truoc; bo Bac Giao Diem. */
export function gocChieu(ls: LaSo): GocChieu[] {
  const ds: (readonly [number, number])[] = ls.diem.slice(0, 10).map((d, i) => [i, d.kinh] as const);
  if (ls.moc !== null && ls.dinh !== null) ds.push([11, ls.moc], [12, ls.dinh]);
  const ra: GocChieu[] = [];
  ds.forEach(([a, ka], i) => {
    for (const [b, kb] of ds.slice(i + 1)) {
      if (a === 11 && b === 12) continue;
      const d = Math.abs(lech(ka, kb)), goc = GOC.findIndex((g) => Math.abs(d - g.do) <= g.orb);
      if (goc >= 0) ra.push({ a, b, goc, orb: Math.abs(d - (GOC[goc]?.do ?? 0)) });
    }
  });
  return ra.sort((x, y) => x.orb - y.orb);
}

export interface PhuongAn { readonly lyDo: string; readonly khac: string }
export interface LaSoNguoi {
  readonly laSo: LaSo;
  /** Tinh ly lay toa do va toa do do; null khi bo cung Moc va nha. */
  readonly noi: { readonly ten: string; readonly viDo: number; readonly kinhDo: number } | null;
  /** Gio sinh ±15 phut, mui gio chua chac: Mat Troi, Mat Trang, cung Moc doi cung (`docs/QUY_UOC.md` muc 8). */
  readonly phuongAn: readonly PhuongAn[];
  readonly ghiChu: readonly string[];
}

/** La so mot nguoi tu ho so (da kiem). `lechNuocNgoai`: phut lech UTC luc sinh khi sinh o nuoc ngoai. */
export function laSoNguoi(hs: HoSo, lechNuocNgoai?: number, nut: Nut = 'trungBinh'): LaSoNguoi {
  const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
  const dau = soNgay({ nam, thang, ngay }) * 1440;
  const nuocNgoai = hs.noiSinh === NUOC_NGOAI;
  const lechTai = (phut: number): LechGio => {
    if (nuocNgoai) {
      if (lechNuocNgoai === undefined) throw new Error('Sinh ở nước ngoài: thiếu múi giờ');
      return { lech: lechNuocNgoai };
    }
    const mien = mienCua(hs.noiSinh);
    if (mien === undefined) throw new Error(`Không có nơi sinh "${hs.noiSinh}"`);
    return lechGio(mien, phut);
  };
  const tenCung = (k: number): string => CUNG[cungCua(k)] ?? '';

  if (hs.gioSinh === null) {
    // QUY_UOC muc 9: tinh luc 12 gio trua; diem nao doi cung trong ngay thi ghi ca hai cung.
    const l = lechTai(dau + 720).lech, dauNgay = laSo(dau - l, null, nut), cuoiNgay = laSo(dau + 1439 - l, null, nut);
    const doi = DIEM.slice(0, 10).flatMap((ten, i) => {
      const a = dauNgay.diem[i]?.kinh ?? 0, b = cuoiNgay.diem[i]?.kinh ?? 0;
      return cungCua(a) === cungCua(b) ? [] : [`${ten} từ ${tenCung(a)} sang ${tenCung(b)}`];
    });
    return {
      laSo: laSo(dau + 720 - l, null, nut), noi: null, phuongAn: [],
      ghiChu: ['Không rõ giờ sinh: tính lúc 12 giờ trưa, bỏ cung Mọc và nhà.',
        ...(doi.length === 0 ? [] : [`Trong ngày sinh có đổi cung: ${doi.join('; ')}.`])],
    };
  }

  const [gio = 0, phut = 0] = hs.gioSinh.split(':').map(Number);
  const goc = dau + gio * 60 + phut, l = lechTai(goc), t = goc - l.lech;
  const td = nuocNgoai ? undefined : TOA_DO[hs.noiSinh];
  const toaDo = td === undefined ? null : [td[0], td[1]] as const;
  const ls = laSo(t, toaDo, nut);
  const tom = (x: LaSo): string[] => [`Mặt Trời ${tenCung(x.diem[0]?.kinh ?? 0)}`, `Mặt Trăng ${tenCung(x.diem[1]?.kinh ?? 0)}`,
    ...(x.moc === null ? [] : [`cung Mọc ${tenCung(x.moc)}`])];
  const chinh = tom(ls);
  const thu: [number, string][] = [[t - 15, 'Nếu sinh sớm hơn 15 phút'], [t + 15, 'Nếu sinh muộn hơn 15 phút']];
  if (l.khac !== undefined) thu.push([goc - l.khac, `Nếu lúc đó là giờ UTC${l.khac >= 0 ? '+' : ''}${String(l.khac / 60)}`]);
  const phuongAn: PhuongAn[] = [];
  for (const [tt, lyDo] of thu) {
    const khac = tom(laSo(tt, toaDo, nut)).filter((s, i) => s !== chinh[i]).join(', ');
    if (khac !== '' && !phuongAn.some((p) => p.khac === khac)) phuongAn.push({ lyDo, khac });
  }
  return {
    laSo: ls, noi: td === undefined ? null : { ten: td[2], viDo: td[0], kinhDo: td[1] }, phuongAn,
    ghiChu: [...(l.lyDo === undefined ? [] : [l.lyDo]),
      ...(nuocNgoai ? ['Sinh ở nước ngoài: app chưa có toạ độ nơi sinh nên bỏ cung Mọc và nhà.'] : [])],
  };
}
