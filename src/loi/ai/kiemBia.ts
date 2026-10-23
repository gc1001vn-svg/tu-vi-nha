/**
 * Do chu AI bia (dot 7 phan 1): ten rieng trong loi AI (sao, han, can chi, nap am, cung hoang dao, thap than, que, la bai…)
 * ma DU LIEU gui di khong co thi danh dau de giao dien gach chan. Chi bat ten nam NGOAI du lieu; ten co trong du lieu ma gan
 * sai cho (sao X o cung Y) thi khong bat duoc — viec do do bang kich ban `scripts/doi-chieu/` (ke hoach dot 7).
 */
import { canChiNam } from '../amLich.ts';
import { batTrach } from '../batTrach.ts';
import { NGHIA_THAP_THAN } from '../batTu.ts';
import { CUNG } from '../chiemTinh.ts';
import { BANG } from '../hanViet/index.ts';
import { HAN_NAM, SAO_NAM } from '../namNay.ts';
import { CHINH_TINH, PHU_TINH, SAO_LUU } from '../tuVi/nghia.ts';

/** Ten rieng cac mon cua mot nguoi. Bo ten mot chu (Mộ, Tử…): trung chu thuong, bat nham nhieu hon bat dung. */
export const TU_NGUOI: readonly string[] = [
  ...Object.keys(CHINH_TINH), ...Object.keys(PHU_TINH), ...Object.keys(SAO_LUU), ...SAO_NAM, ...HAN_NAM,
  ...Array.from({ length: 60 }, (_, i) => canChiNam(1984 + i)), ...Object.values(BANG.napAm).map((m) => m.hv),
  ...Object.keys(NGHIA_THAP_THAN), ...CUNG, ...batTrach('Khảm').huong.map((h) => h.sao),
];

export interface Bia { readonly tu: string; readonly vt: number }

const chuCai = '\\p{L}\\p{M}\\p{N}';

/** Cac ten trong `tuDien` xuat hien o `loi` (dung chu hoa, tron chu) ma `duLieu` khong co; `vt` la vi tri trong `loi`. */
export function timBia(loi: string, duLieu: string, tuDien: readonly string[]): Bia[] {
  const tu = [...new Set(tuDien.map((t) => t.normalize('NFC')).filter((t) => t.includes(' ')))].sort((a, b) => b.length - a.length);
  if (tu.length === 0) return [];
  const re = new RegExp(`(?<![${chuCai}])(?:${tu.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![${chuCai}])`, 'gu');
  const co = duLieu.normalize('NFC');
  return [...loi.normalize('NFC').matchAll(re)].filter((m) => !co.includes(m[0])).map((m) => ({ tu: m[0], vt: m.index }));
}
