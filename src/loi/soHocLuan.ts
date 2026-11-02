/**
 * Luan than so hoc (ke hoach `docs/ke-hoach/2026-11-02-than-so.md`; nguon, cach chot: `docs/LUAN_THAN_SO.md`). Tang 1 tong luan
 * (so chu dao, so ngay sinh, so thai do), tang 2 bieu do ngay sinh (mat phang, mui ten day / trong theo Phillips, so troi, so vang),
 * tang 3 van (4 dinh cao + 4 thu thach theo Jordan – Decoz, nam va thang ca nhan). Loi o `soHocLuanLoi.ts`. Thuoc:
 * `tests/LuanSoHoc.test.ts`. Khong cham tot / xau: cac nguon deu coi moi so co mat sang, mat toi.
 */
import type { NgayDuong } from './amLich.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { rutGon, tenSo, type ThanSo } from './soHoc.ts';
import {
  CHU_DAO, DINH_CAO, KET_HOP, MAT_PHANG, MUI_TEN, NAM_CA_NHAN, NGAY_SINH, SO_NHIEU, SO_VANG, THAI_DO, THANG_CA_NHAN, THU_THACH,
} from './soHocLuanLoi.ts';

/** 8 duong ba o tren luoi (hang tren 3-6-9, giua 2-5-8, duoi 1-4-7): ba cot, ba hang, hai cheo — thu tu khop `MUI_TEN`. */
export const DUONG = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]] as const;
/** Mat phang: tri nao 3-6-9, cam xuc 2-5-8, the chat 1-4-7 (khop `MAT_PHANG`). */
const PHANG = [[3, 6, 9], [2, 5, 8], [1, 4, 7]] as const;
const BAC_THAY = [11, 22] as const;

const dem = (t: ThanSo, k: number): number => t.luoi[k - 1] ?? 0;

/** Tang 1: so chu dao, so ngay sinh, so thai do (ngay + thang, rut ve 1–9), ket hop. */
export function tongLuanTS(t: ThanSo, sinh: NgayDuong): DoanLuan[] {
  const thaiDo = rutGon(rutGon(sinh.ngay) + rutGon(sinh.thang));
  const nen = rutGon(t.chuDao);
  return [
    { tieuDe: `Số chủ đạo ${tenSo(t.chuDao)}`, loi: [CHU_DAO[t.chuDao] ?? ''] },
    { tieuDe: `Số ngày sinh ${String(t.ngaySinh)}`, loi: [NGAY_SINH[t.ngaySinh] ?? ''] },
    { tieuDe: `Số thái độ ${String(thaiDo)}`, loi: [THAI_DO[thaiDo] ?? ''] },
    { tieuDe: 'Kết hợp', loi: [
      ...(rutGon(t.ngaySinh) === nen ? [KET_HOP.trung] : []),
      ...(thaiDo === nen ? [KET_HOP.thaiDoTrung] : []),
      dem(t, nen) === 0 ? KET_HOP.vangTrenLuoi(String(nen)) : dem(t, nen) >= 2 ? KET_HOP.dayTrenLuoi(String(nen)) : KET_HOP.coTrenLuoi(String(nen)),
    ] },
  ];
}

/** Tang 2: bieu do ngay sinh — mat phang troi, mui ten day, mui ten trong, so lap tu 3 lan, so vang. */
export function bieuDoTS(t: ThanSo): DoanLuan[] {
  const phang = PHANG.map((p) => p.reduce((s, k) => s + dem(t, k), 0));
  const max = Math.max(...phang), troi = phang.filter((x) => x === max).length === 1 ? phang.indexOf(max) : -1;
  const day = DUONG.flatMap((d, i) => (d.every((k) => dem(t, k) > 0) ? [i] : []));
  const trong = DUONG.flatMap((d, i) => (d.every((k) => dem(t, k) === 0) ? [i] : []));
  const ten = (d: readonly number[]): string => d.join('-');
  // So vang gop mot cau, bo so da nam trong mui ten trong (do 02/11: moi so vang le ra o 65–70 % la so — chung chung).
  const daTrong = new Set<number>(trong.flatMap((i) => [...(DUONG[i] ?? [])]));
  const nhieu = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((k) => dem(t, k) >= 3);
  const vang = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((k) => dem(t, k) === 0 && !daTrong.has(k));
  return [
    { tieuDe: 'Mặt phẳng nổi trội', loi: [troi < 0 ? MAT_PHANG.deu : MAT_PHANG.troi[troi] ?? ''] },
    { tieuDe: 'Mũi tên', loi: [
      ...day.map((i) => `Mũi tên ${MUI_TEN[i]?.ten ?? ''} (${ten(DUONG[i] ?? [])} đầy): ${MUI_TEN[i]?.day ?? ''}`),
      ...trong.map((i) => `Mũi tên ${MUI_TEN[i]?.tenTrong ?? ''} (${ten(DUONG[i] ?? [])} trống): ${MUI_TEN[i]?.trong ?? ''}`),
      ...(day.length + trong.length === 0 ? [MAT_PHANG.khongMuiTen] : []),
    ] },
    { tieuDe: 'Số lặp nhiều, số vắng', loi: [
      ...nhieu.map((k) => `Số ${String(k)} lặp ${String(dem(t, k))} lần: ${SO_NHIEU[k] ?? ''}`),
      ...(vang.length === 0 ? [] : [`Vắng số ${vang.join(', ')} — bài học cần bồi đắp: ${vang.map((k) => SO_VANG[k] ?? '').join('; ')}.`]),
      ...(nhieu.length + vang.length === 0 ? [MAT_PHANG.khongSo] : []),
    ] },
  ];
}

export interface DinhCao {
  readonly tu: number;
  /** null: dinh cuoi, keo tron doi. */
  readonly den: number | null;
  readonly so: number;
  readonly thuThach: number;
}

/** Tuoi tron o ngay xem. */
const tuoi = (sinh: NgayDuong, xem: NgayDuong): number =>
  xem.nam - sinh.nam - (xem.thang < sinh.thang || (xem.thang === sinh.thang && xem.ngay < sinh.ngay) ? 1 : 0);

/**
 * 4 dinh cao va 4 thu thach (Juno Jordan, Hans Decoz; ban Viet "kim tu thap"): thang, ngay, nam rut ve 1–9; dinh = thang + ngay,
 * ngay + nam, dinh 1 + dinh 2, thang + nam (giu 11, 22); thu thach = hieu tuyet doi cung cap, thu thach 3 = |tt1 − tt2|. Dinh 1 het
 * o tuoi 36 − so chu dao (rut ve mot chu so: 10 → 1, 11 → 2, 22 → 4, 33 → 6), cac dinh sau 9 nam, dinh 4 tron doi.
 */
export function dinhCao(t: ThanSo, sinh: NgayDuong): DinhCao[] {
  const m = rutGon(sinh.thang), d = rutGon(sinh.ngay), y = rutGon(sinh.nam);
  const p1 = rutGon(m + d, BAC_THAY), p2 = rutGon(d + y, BAC_THAY), p3 = rutGon(rutGon(p1) + rutGon(p2), BAC_THAY), p4 = rutGon(m + y, BAC_THAY);
  const t1 = Math.abs(m - d), t2 = Math.abs(d - y), t3 = Math.abs(t1 - t2), t4 = Math.abs(m - y);
  const het = 36 - rutGon(t.chuDao);
  return [
    { tu: 0, den: het, so: p1, thuThach: t1 }, { tu: het + 1, den: het + 9, so: p2, thuThach: t2 },
    { tu: het + 10, den: het + 18, so: p3, thuThach: t3 }, { tu: het + 19, den: null, so: p4, thuThach: t4 },
  ];
}

/** Tang 3: dinh cao, thu thach dang di qua; nam va thang ca nhan. */
export function vanTS(t: ThanSo, sinh: NgayDuong, xem: NgayDuong): { readonly dinh: readonly DinhCao[]; readonly dang: number; readonly loi: readonly string[] } {
  const dinh = dinhCao(t, sinh), a = tuoi(sinh, xem);
  const dang = dinh.findIndex((x) => a >= x.tu && (x.den === null || a <= x.den));
  const x = dinh[dang] ?? dinh[0];
  return {
    dinh, dang,
    loi: x === undefined ? [] : [
      `Đỉnh cao thứ ${String(dang + 1)} (${String(x.tu)}–${x.den === null ? 'về sau' : `${String(x.den)} tuổi`}), số ${String(x.so)}: ${DINH_CAO[x.so] ?? ''}`,
      `Thử thách cùng giai đoạn, số ${String(x.thuThach)}: ${THU_THACH[x.thuThach] ?? ''}`,
      `Năm cá nhân ${String(t.namCaNhan)} (năm ${String(t.namXem)}): ${NAM_CA_NHAN[t.namCaNhan] ?? ''}`,
      `Tháng cá nhân ${String(t.thangCaNhan)}: ${THANG_CA_NHAN[t.thangCaNhan] ?? ''}`,
    ],
  };
}
