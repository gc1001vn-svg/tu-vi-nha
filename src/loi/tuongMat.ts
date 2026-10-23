/**
 * Tuong mat do trong may (dot 7 phan 2): tu luoi 478 diem MediaPipe Face Landmarker ra cac ti le khong don vi va goc dau.
 * Loi thuan: nhan diem chuan hoa (x theo be rong, y theo chieu cao anh), co anh, ma tran bien doi — khong dung trinh duyet.
 * So diem theo luoi chuan MediaPipe (mat phai nguoi trong anh = ben trai anh), kiem bang mat tren anh 23/10.
 * Quy uoc chon diem, gioi han goc: `docs/QUY_UOC.md` muc 26.
 */

/** Diem moc MediaPipe: x, y chuan hoa theo rong, cao anh. */
export interface DiemMoc { readonly x: number; readonly y: number }

/** Mot lan do: luoi diem, co anh (px), ma tran bien doi 4x4 luu theo cot, anh co lat guong khong. */
export interface LanDo {
  readonly diem: readonly DiemMoc[]; readonly rong: number; readonly cao: number; readonly maTran: readonly number[]; readonly lat: boolean;
}

export interface SoDoMat {
  /** Trung dinh (an duong → chan mui) : ha dinh (chan mui → day cam). Luoi khong toi chan toc nen khong do thuong dinh. */
  readonly trungHa: number;
  /** Ngu nhan: be ngang mat (hai mep ma ngang tam mat) bang bao nhieu mat. */
  readonly nguNhan: number;
  /** Khoang giua hai khoe mat trong / be ngang mot mat. */
  readonly khoangMat: number;
  /** Be ngang canh mui / khoang giua hai khoe mat trong. */
  readonly mui: number;
  /** Be ngang mieng (hai khoe) / be ngang canh mui. */
  readonly mieng: number;
  /** Dai mat (an duong → day cam) / be ngang mat. */
  readonly daiRong: number;
  /** Dai long may / be ngang mot mat. */
  readonly may: number;
  /** An duong (khoang giua hai dau may) / be ngang mot mat. */
  readonly anDuong: number;
  /** Long may cach mi tren / be ngang mot mat. */
  readonly mayCach: number;
}

/** Goc dau (do): quay ngang (yaw), ngua/cui (pitch), nghieng sang ben (roll). */
export interface GocDau { readonly quay: number; readonly ngua: number; readonly nghieng: number }

/** Anh chan dung chinh dien do ra quay ±5, ngua toi 14 do (23/10) → ngua noi rong hon ke hoach (10). Nghieng khong lam sai ti le. */
export const GIOI_HAN_GOC = { quay: 10, ngua: 15 } as const;

/**
 * Mat (chieu lon) nho hon 12 % canh dai anh thi bao chup gan/cat anh: bo tim mat thu ca anh ve 128 px nen mat nho luc thay luc
 * khong — anh ghep hai nguoi (moi mat 10 %) do nham mot nguoi ma khong bao (23/10). Anh chan dung that: 15–33 %.
 */
export const MAT_NHO_NHAT = 0.12;

type Px = readonly [number, number];
const kc = (a: Px, b: Px): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const giua = (a: Px, b: Px): Px => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** Cac ti le cua mot lan do. Moi phep do lay ca hai ben mat nhu nhau nen anh lat guong do ra cung dai luong. */
export function soDo(d: readonly DiemMoc[], rong: number, cao: number): SoDoMat {
  const p = (i: number): Px => {
    const m = d[i];
    if (m === undefined) throw new Error(`Lưới mặt thiếu điểm ${String(i)}`);
    return [m.x * rong, m.y * cao];
  };
  const mat = (kc(p(33), p(133)) + kc(p(362), p(263))) / 2;
  const trong = kc(p(133), p(362));
  const mui = kc(p(129), p(358));
  const ngang = kc(p(234), p(454));
  const dauMayP = giua(p(107), p(55)), dauMayT = giua(p(336), p(285));
  return {
    trungHa: kc(p(9), p(2)) / kc(p(2), p(152)),
    nguNhan: ngang / mat,
    khoangMat: trong / mat,
    mui: mui / trong,
    mieng: kc(p(61), p(291)) / mui,
    daiRong: kc(p(9), p(152)) / ngang,
    may: (kc(giua(p(70), p(46)), dauMayP) + kc(giua(p(300), p(276)), dauMayT)) / 2 / mat,
    anDuong: kc(dauMayP, dauMayT) / mat,
    mayCach: (kc(p(52), p(159)) + kc(p(282), p(386))) / 2 / mat,
  };
}

/** Euler ZYX tu ma tran luu theo cot (o 12–14 la tinh tien — kiem tren anh that 23/10). */
export function gocDau(m: readonly number[]): GocDau {
  const R = (r: number, c: number): number => m[c * 4 + r] ?? 0;
  const doi = 180 / Math.PI;
  return {
    quay: Math.asin(Math.max(-1, Math.min(1, -R(2, 0)))) * doi,
    ngua: Math.atan2(R(2, 1), R(2, 2)) * doi,
    nghieng: Math.atan2(R(1, 0), R(0, 0)) * doi,
  };
}

export const quaGoc = (g: GocDau): boolean => Math.abs(g.quay) > GIOI_HAN_GOC.quay || Math.abs(g.ngua) > GIOI_HAN_GOC.ngua;

/**
 * Gop nhieu lan do (moi co khung × anh, anh lat guong): mo hinh lech trai phai toi ~6 % va doi so theo vi tri khung toi ~5 %
 * (23/10) nen lay trung binh. `lech`: 2 sai so chuan cua trung binh (% — khoang tin ~95 %), lon nhat trong cac ti le.
 * Lan lat guong doi dau goc quay, nghieng.
 */
export function doMat(cac: readonly LanDo[]): { readonly so: SoDoMat; readonly lech: number; readonly goc: GocDau } {
  const s = cac.map((l) => soDo(l.diem, l.rong, l.cao));
  const dau = s[0];
  if (dau === undefined) throw new Error('Không có lần đo nào');
  const khoa = Object.keys(dau) as (keyof SoDoMat)[];
  const tb = (xs: readonly number[]): number => xs.reduce((a, x) => a + x, 0) / xs.length;
  const so = Object.fromEntries(khoa.map((k) => [k, tb(s.map((x) => x[k]))])) as Record<keyof SoDoMat, number>;
  const lech = Math.max(...khoa.map((k) => {
    const xs = s.map((x) => x[k]), m = tb(xs);
    const doLech = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / Math.max(1, xs.length - 1));
    return ((2 * doLech) / Math.sqrt(xs.length) / m) * 100;
  }));
  const g = cac.map((l) => ({ ...gocDau(l.maTran), d: l.lat ? -1 : 1 }));
  return { so, lech, goc: { quay: tb(g.map((x) => x.quay * x.d)), ngua: tb(g.map((x) => x.ngua)), nghieng: tb(g.map((x) => x.nghieng * x.d)) } };
}

/**
 * Cac co khung (lan chieu lon cua mat), moi co do anh + anh lat guong, lay trung binh 10 lan: mot khung lech vai px doi so toi
 * 5 %. Anh lat guong lech toi da (7 anh, 23/10): 2 khung 5,3 % · 3 khung 2,2 % · 5 khung 1,05 %.
 */
export const HE_SO_KHUNG: readonly number[] = [1.7, 1.85, 2, 2.15, 2.3];

/**
 * Khung vuong cat anh lay mat lam tam, canh = `heSo` lan chieu lon cua mat: MediaPipe tinh goc dau voi tam anh la truc ong kinh,
 * mat lech tam bi tinh thanh ngua (anh chan dung do ra toi 22 do, cat lai con 14 — 23/10).
 */
export function khungCat(d: readonly DiemMoc[], rong: number, cao: number, heSo = 2): { readonly x: number; readonly y: number; readonly canh: number } {
  const xs = d.map((m) => m.x * rong), ys = d.map((m) => m.y * cao);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const canh = heSo * Math.max(x1 - x0, y1 - y0);
  return { x: (x0 + x1) / 2 - canh / 2, y: (y0 + y1) / 2 - canh / 2, canh };
}
