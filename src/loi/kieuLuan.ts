/**
 * Luan que boi Kieu (ke hoach `docs/ke-hoach/2026-11-03-boi-kieu.md`; cach chot: `docs/LUAN_BOI_KIEU.md`; chu, cach boi: QUY_UOC muc
 * 17). Tu cap cau rut duoc → dem chu vui / buon (cap rut ×1, hai cau truoc sau ×0,5) + canh truyen (doan hoi) ×0,5 → ket; nhan vat trong
 * may cau; loi theo 18 de muc cua thay boi Kieu xua; loi nhac. Loi o `kieuLuanLoi.ts`. Thuoc: `tests/LuanBoiKieu.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { HOI, type QueKieu } from './kieu.ts';
import { CAU_Y, HOI_DIEM, HOI_Y, KET, MUC, NGUOI, NHAC, TOT, XAU } from './kieuLuanLoi.ts';

const TU = (w: string): RegExp => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, 'giu');
const RE_TOT = TOT.map(TU), RE_XAU = XAU.map(TU);
const dem = (s: string, ds: readonly RegExp[]): number => ds.reduce((t, r) => t + (s.match(r) ?? []).length, 0);

/** So chu vui tru so chu buon trong mot doan chu. */
export const sacThai = (s: string): number => dem(s, RE_TOT) - dem(s, RE_XAU);

/** Moc diem: gan phan vi 75 / 25 cua ca 1.627 cap (docs muc 5). */
export const NGUONG_KIEU = { tot: 0.5, xau: -1 } as const;

export function diemKieu(q: QueKieu): number {
  const i = HOI.indexOf(q.hoi);
  return sacThai(`${q.luc} ${q.bat}`) + 0.5 * sacThai([...q.truoc, ...q.sau].join(' ')) + 0.5 * (HOI_DIEM[i] ?? 0);
}

/** Luan mot que; `muc`: chi so de muc dang hoi (0–17), mac dinh "Vận cả năm". */
export function luanKieu(q: QueKieu, muc = 0): DoanLuan[] {
  const d = diemKieu(q), i = HOI.indexOf(q.hoi);
  const ket = d >= NGUONG_KIEU.tot ? 'tot' : d <= NGUONG_KIEU.xau ? 'xau' : 'vua';
  const cap = `${q.luc} ${q.bat}`, t = dem(cap, RE_TOT), x = dem(cap, RE_XAU);
  const cau = t > 0 && x > 0 ? CAU_Y.lan : t > 0 ? CAU_Y.tot : x > 0 ? CAU_Y.xau : CAU_Y.khong;
  const ca = [...q.truoc, q.luc, q.bat, ...q.sau].join(' ');
  const nguoi = NGUOI.filter(([re]) => re.test(ca)).map(([, l]) => l);
  const m = MUC[muc] ?? MUC[0];
  const loiMuc = m === undefined ? '' : `${m[0]}: ${ket === 'tot' ? m[1] : ket === 'vua' ? m[2] : m[3]}`;
  return [
    { tieuDe: 'Tổng luận', loi: [KET[ket], cau, HOI_Y[i] ?? ''].filter((l) => l !== '') },
    ...(nguoi.length === 0 ? [] : [{ tieuDe: 'Người trong câu', loi: nguoi }]),
    { tieuDe: 'Theo việc hỏi', loi: [loiMuc] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}

export const TEN_MUC: readonly string[] = MUC.map(([t]) => t);
