/**
 * Tuong mat do trong may (dot 7 phan 2): tu luoi 478 diem MediaPipe Face Landmarker ra cac ti le khong don vi va goc dau.
 * Loi thuan: nhan diem chuan hoa (x theo be rong, y theo chieu cao anh), co anh, ma tran bien doi — khong dung trinh duyet.
 * So diem theo luoi chuan MediaPipe (mat phai nguoi trong anh = ben trai anh), kiem bang mat tren anh 23/10.
 * Quy uoc chon diem, gioi han goc: `docs/QUY_UOC.md` muc 26.
 */

/** Diem moc MediaPipe: x, y chuan hoa theo rong, cao anh. */
export interface DiemMoc { readonly x: number; readonly y: number }

/** Mot lan do: luoi diem, co anh (px), ma tran bien doi 4x4 luu theo cot, anh co lat guong khong, diem cuoi MediaPipe (0–1). */
export interface LanDo {
  readonly diem: readonly DiemMoc[]; readonly rong: number; readonly cao: number; readonly maTran: readonly number[]; readonly lat: boolean;
  readonly cuoi?: number;
}

export interface SoDoMat {
  /** Be ngang tran (diem 54/284, mep tran gan chan toc) / be ngang mat — 27/10, xep dang mat ngu hanh. */
  readonly tran: number;
  /** Trung dinh (an duong → chan mui) : ha dinh (chan mui → day cam). Luoi khong toi chan toc nen khong do thuong dinh. */
  readonly trungHa: number;
  /** Ngu nhan: be ngang mat (hai mep ma ngang tam mat) bang bao nhieu mat. */
  readonly nguNhan: number;
  /** Khoang giua hai khoe mat trong / be ngang mot mat. */
  readonly khoangMat: number;
  /**
   * Be ngang canh mui / be ngang mat. 26/10 doi tu "/ khoang giua hai khoe mat": mat Dong A khoang mat rong nen mui rong bi xep
   * "hep" (anh thay nguoc); sach co cung so mui, mieng voi mat ("面大鼻小", "面大口小").
   */
  readonly mui: number;
  /** Be ngang mieng (hai khoe) / be ngang mat (truoc 26/10: / be ngang canh mui — so day chuyen theo mui). */
  readonly mieng: number;
  /** Dai mat (an duong → day cam) / be ngang mat. */
  readonly daiRong: number;
  /** Be ngang hai goc ham (172/397) / be ngang mat — 27/10. */
  readonly ham: number;
  /** Be ngang cam (176/400) / be ngang hai goc ham: so nho = cam nhon — 27/10. */
  readonly cam: number;
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
  const ham = kc(p(172), p(397));
  return {
    tran: kc(p(54), p(284)) / ngang,
    trungHa: kc(p(9), p(2)) / kc(p(2), p(152)),
    nguNhan: ngang / mat,
    khoangMat: trong / mat,
    mui: mui / ngang,
    mieng: kc(p(61), p(291)) / ngang,
    daiRong: kc(p(9), p(152)) / ngang,
    ham: ham / ngang,
    cam: kc(p(176), p(400)) / ham,
    may: (kc(giua(p(70), p(46)), dauMayP) + kc(giua(p(300), p(276)), dauMayT)) / 2 / mat,
    anDuong: kc(dauMayP, dauMayT) / mat,
    mayCach: (kc(p(52), p(159)) + kc(p(282), p(386))) / 2 / mat,
  };
}

/**
 * Anh chup bang nut "Tu chup (camera truoc)": Safari iPhone ghi lai JPEG khong EXIF (ma WebKit, tra 28/10) nen doan tieu cu quy doi
 * 35 mm theo co anh camera truoc iPhone chua thu nho; co khac thi lay 30 mm — selfie doc mac dinh iPhone 11–16 (EXIF that). Anh chon
 * tu Thu vien (iOS 16.4+) con EXIF tieu cu. QUY_UOC muc 26.
 */
export const F35_TRUOC = 30;
const F35_THEO_CO: Readonly<Record<string, number>> = { '2316x3088': 30, '2320x3088': 32, '3024x4032': 23, '3672x4896': 20 };
export const f35TheoCo = (rong: number, cao: number): number | null =>
  F35_THEO_CO[`${String(Math.min(rong, cao))}x${String(Math.max(rong, cao))}`] ?? null;

/** Tieu cu (px) cua anh rong × cao tu tieu cu quy doi 35 mm (theo duong cheo khung 36 × 24 mm). */
export const tieuCuPx = (f35: number, rong: number, cao: number): number => (f35 / Math.hypot(36, 24)) * Math.hypot(rong, cao);

/**
 * Meo phoi canh tung ti le: ln(R / R chup cach ~2,5 m) = MEO × (u − U_MAU), u = ngang mat (px) / tieu cu (px) ≈ ngang mat / khoang
 * cach. Khop 28/10 tren 28 nguoi that bo CMDP (Caltech, chup cach ~0,4 m va ~4,7 m, tieu cu EXIF; QUY_UOC muc 26) — dau 3D dung du
 * doan meo khac han (mat dai, mui gap doi, an duong gap 4) nen khong dung. `MEO_LECH`: lech chuan phan du giua nguoi, moi don vi u.
 */
export const MEO: Readonly<Record<keyof SoDoMat, number>> = {
  tran: 0.088, trungHa: 0.245, nguNhan: -0.226, khoangMat: 0.022, mui: 0.296, mieng: 0.226, daiRong: 0.231, ham: -0.017, cam: 0.086,
  may: -0.112, anDuong: 0.091, mayCach: 0.109,
};
export const MEO_LECH: Readonly<Record<keyof SoDoMat, number>> = {
  tran: 0.056, trungHa: 0.174, nguNhan: 0.088, khoangMat: 0.088, mui: 0.092, mieng: 0.106, daiRong: 0.092, ham: 0.03, cam: 0.068,
  may: 0.056, anDuong: 0.087, mayCach: 0.158,
};
/** u cua anh mau (chan dung chinh thuc, ong 85–135 mm, cach ~2,5 m): sua anh gan ve dung khoang do de so voi nguong lay tu anh mau. */
export const U_MAU = 0.05;

/** Bo meo: dua cac ti le do o u ve nhu chup cach anh mau. */
export const boMeo = (so: SoDoMat, u: number): SoDoMat =>
  Object.fromEntries(Object.entries(so).map(([k, x]) => [k, x * Math.exp(-MEO[k as keyof SoDoMat] * (u - U_MAU))])) as unknown as SoDoMat;

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
export function doMat(cac: readonly LanDo[]): { readonly so: SoDoMat; readonly lech: number; readonly goc: GocDau; readonly cuoi: number } {
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
  return { so, lech, goc: { quay: tb(g.map((x) => x.quay * x.d)), ngua: tb(g.map((x) => x.ngua)), nghieng: tb(g.map((x) => x.nghieng * x.d)) },
    cuoi: tb(cac.map((l) => l.cuoi ?? 0)) };
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
