/**
 * Luan chon ngay (ke hoach `docs/ke-hoach/2026-11-03-chon-ngay.md`; cach chot: `docs/LUAN_CHON_NGAY.md`; bang, luat cham: QUY_UOC muc
 * 17–19). Tu cac ngay da cham trong thang (`chonNgay`) → tong luan thang (dem Tot / Duoc / Tranh, ngay nen chon nhat xep theo so ly do
 * tot + sao Duc — Hiep Ky q.10 "nghi ky dang de": gap Duc thi bac giua theo nen), can cu, theo viec, loi nhac. Thuoc:
 * `tests/LuanChonNgay.test.ts`.
 */
import type { NgayDuong } from './amLich.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { TUC, VIEC, type NgayChon, type Viec } from './chonNgay.ts';
import { chiTietNgay } from './homNay.ts';
import { CAN_CU, DO_NHAT, DUC, KHONG_CO, NEN, NHAC, THEO_VIEC, TONG } from './chonNgayLuanLoi.ts';

const SAO_DUC = ['Thiên Đức', 'Nguyệt Đức', 'Thiên Đức Hợp', 'Nguyệt Đức Hợp', 'Thiên Xá'];
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/** Co sao Duc (Thien Duc, Nguyet Duc, hop, Thien Xa) trong ngay. */
export const coDuc = (d: NgayDuong): boolean => chiTietNgay(d).saoTot.some((s) => SAO_DUC.includes(s));

/** Ngay co ky tuc (ly do bat dau bang ten ky va co tien to tuc). */
export const coKyTuc = (n: NgayChon): boolean => n.lyDo.some((l) => l.chu.includes(`: ${TUC}`));

/** Diem xep hang trong mot muc: so ly do tot − so ly do xau + 1 neu co sao Duc. */
export function diemNgay(n: NgayChon): number {
  return n.lyDo.filter((l) => l.loai === 'tot').length - n.lyDo.filter((l) => l.loai === 'xau').length + (coDuc(n.duong) ? 1 : 0);
}

const tenNgay = (n: NgayChon): string => `${THU[n.thu] ?? ''} ${String(n.duong.ngay)}/${String(n.duong.thang)} (âm ${String(n.am.ngay)}/${String(n.am.thang)})`
  + (coDuc(n.duong) ? `, ${DUC}` : '');

/** Ngay nen chon nhat: toi da 3 ngay Tot diem cao nhat; khong co thi ngay Duoc sach ky (khong ky tuc, khong lich kieng). */
export function ngayNenChon(ds: readonly NgayChon[]): { readonly tot: boolean; readonly ngay: readonly NgayChon[] } {
  const xep = (xs: readonly NgayChon[]): NgayChon[] => [...xs].sort((a, b) => diemNgay(b) - diemNgay(a) || a.duong.ngay - b.duong.ngay).slice(0, 3);
  const tot = ds.filter((n) => n.danhGia === 'tot');
  if (tot.length > 0) return { tot: true, ngay: xep(tot) };
  const sach = ds.filter((n) => n.danhGia === 'duoc' && !coKyTuc(n) && !n.lyDo.some((l) => l.chu.startsWith('Lịch ghi kiêng')));
  return { tot: false, ngay: xep(sach) };
}

export function luanThang(viec: Viec, ds: readonly NgayChon[]): DoanLuan[] {
  const dem = (g: NgayChon['danhGia']): number => ds.filter((n) => n.danhGia === g).length;
  const nen = ngayNenChon(ds);
  const chon = nen.ngay.length === 0 ? KHONG_CO : nen.tot ? NEN(nen.ngay.map(tenNgay).join('; ')) : DO_NHAT(nen.ngay.map(tenNgay).join('; '));
  return [
    { tieuDe: 'Tổng luận tháng', loi: [TONG(VIEC[viec].ten.toLowerCase(), dem('tot'), dem('duoc'), dem('tranh')), chon] },
    { tieuDe: 'Căn cứ', loi: [...CAN_CU] },
    { tieuDe: 'Theo việc', loi: [...(THEO_VIEC[viec] ?? [])] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}
