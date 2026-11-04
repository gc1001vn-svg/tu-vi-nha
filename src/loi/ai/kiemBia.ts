/**
 * Do chu AI bia (dot 7 phan 1): ten rieng trong loi AI (sao, han, can chi, nap am, cung hoang dao, thap than, que, la bai…)
 * ma DU LIEU gui di khong co thi danh dau de giao dien gach chan. Hai cach bat: ten trong tu dien ma du lieu khong co; ten la ngoai tu
 * dien (do 03/11: "Vệ Thần" khi du lieu ghi Sao Thiên Vương) — cum ≥ 2 chu viet hoa co mot chu tieng Viet chua tung co trong du lieu,
 * loi dan, cau nguoi hoi. Chi bat ten nam NGOAI du lieu; ten co trong du lieu ma gan sai cho (sao X o cung Y) thi khong bat duoc — viec
 * do do bang kich ban `scripts/doi-chieu/` (ke hoach dot 7).
 */
import { canChiNam } from '../amLich.ts';
import { batTrach } from '../batTrach.ts';
import { NGHIA_THAP_THAN } from '../batTu.ts';
import { CUNG } from '../chiemTinh.ts';
import { BANG } from '../hanViet/index.ts';
import { HAN_NAM, SAO_NAM } from '../namNay.ts';
import { CHINH_TINH, PHU_TINH, SAO_LUU } from '../tuVi/nghia.ts';
import { LOI_DAN } from './loiDan.ts';

/** Ten rieng cac mon cua mot nguoi. Bo ten mot chu (Mộ, Tử…): trung chu thuong, bat nham nhieu hon bat dung. */
export const TU_NGUOI: readonly string[] = [
  ...Object.keys(CHINH_TINH), ...Object.keys(PHU_TINH), ...Object.keys(SAO_LUU), ...SAO_NAM, ...HAN_NAM,
  ...Array.from({ length: 60 }, (_, i) => canChiNam(1984 + i)), ...Object.values(BANG.napAm).map((m) => m.hv),
  ...Object.keys(NGHIA_THAP_THAN), ...CUNG, ...batTrach('Khảm').huong.map((h) => h.sao),
];

/** Ten nhan vat Truyen Kieu (nhieu chu): AI neu ten khong co trong que vua mo thi gach chan — de dan sai doan. */
export const TU_KIEU: readonly string[] = ['Thúy Kiều', 'Thúy Vân', 'Kim Trọng', 'Vương Quan', 'Vương ông', 'Vương bà', 'Mã Giám Sinh', 'Tú Bà',
  'Sở Khanh', 'Thúc Sinh', 'Thúc ông', 'Hoạn Thư', 'Hoạn bà', 'Giác Duyên', 'Từ Hải', 'Hồ Tôn Hiến', 'Đạm Tiên', 'Bạc Bà', 'Bạc Hạnh',
  'Khuyển Ưng', 'Khuyển Phệ', 'Tam Hợp', 'Chung công'];

export interface Bia { readonly tu: string; readonly vt: number }

const chuCai = '\\p{L}\\p{M}\\p{N}';
/** Cum chu viet hoa lien nhau (ten rieng): "Sao Thiên Vương", "Vệ Thần". */
const CUM = /(?<![\p{L}\p{M}\p{N}])\p{Lu}[\p{L}\p{M}\p{N}]*(?: \p{Lu}[\p{L}\p{M}\p{N}]*)+/gu;
const THANH = /[\u0300\u0301\u0303\u0309\u0323]/gu;
/** Khoa so chu: bo hoa thuong, dau thanh dat cuoi (Hoả = Hỏa), y = i (Tị = Tỵ) — chi khac cach viet thi khong tinh la bia. */
const khoaChu = (w: string): string => {
  const d = w.normalize('NFD').toLowerCase();
  return `${d.replace(THANH, '').replace(/y/gu, 'i').normalize('NFC')}${(d.match(THANH) ?? []).join('')}`;
};
/** Ten chung AI hay dan, khong phai so lieu (nuoc, le, thu, thang, sach, phai): chu trong day khong tinh la la. Thay bat nham thi them. */
const TEN_CHUNG = 'Trung Quốc, Phương Đông, Phương Tây, Tết Nguyên Đán, Tháng Giêng, Tháng Chạp, Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, '
  + 'Thứ Bảy, Chủ Nhật, Lịch Vạn Niên, Tử Vi Đẩu Số, Huyền Không, Kinh Dịch, Truyện Kiều, Đoạn Trường Tân Thanh, Nguyễn Du';
/** Vi tri sau `truoc` la dau cau (dau bai, xuong dong, sau . ! ? : …), bo qua dau cach, dau dong (- * #), ngoac mo, ngoac kep. */
const dauCau = (truoc: string): boolean => /(?:^|[\n.!?:…])[\s*_#>"“”'‘’`([\-–—•]*$/u.test(truoc);

/**
 * Ten bia trong `loi`: ten `tuDien` (dung chu hoa, tron chu) ma `duLieu` khong co, va ten la (xem dau file); `vt` la vi tri trong `loi`.
 * `duLieu`: moi chu da gui AI (du lieu, cau nguoi hoi) — ten nguoi dung tu go ("Sao Chiron?") khong phai AI bia.
 */
export function timBia(loi: string, duLieu: string, tuDien: readonly string[]): Bia[] {
  const chu = loi.normalize('NFC'), co = duLieu.normalize('NFC');
  const tu = [...new Set(tuDien.map((t) => t.normalize('NFC')).filter((t) => t.includes(' ')))].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![${chuCai}])(?:${tu.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![${chuCai}])`, 'gu');
  const theoTuDien = tu.length === 0 ? [] : [...chu.matchAll(re)].filter((m) => !co.includes(m[0])).map((m) => ({ tu: m[0], vt: m.index }));
  const biet = new Set((`${LOI_DAN}\n${TEN_CHUNG}\n${co}`.normalize('NFC').match(/[\p{L}\p{M}\p{N}]+/gu) ?? []).map(khoaChu));
  const la = [...chu.matchAll(CUM)].flatMap((m): Bia[] => {
    if (/^\s*#/u.test(chu.slice(chu.lastIndexOf('\n', m.index) + 1, m.index))) return []; // tieu de muc hay viet hoa moi chu
    // Dau cau: chu dau viet hoa vi mo cau ("Nhờ Thiên Lương…") nen bo, xet phan sau.
    // shortcut: ten la dung dau cau ma chu dau la cua ten ("Vệ Thần ở nhà 8…") khong bat duoc; nang khi do that thay lot.
    const bo = dauCau(chu.slice(0, m.index)) ? m[0].indexOf(' ') + 1 : 0;
    const ten = m[0].slice(bo);
    // Chu toan ASCII (tieng Anh trong ngoac: "North Node") khong xet: AI hay dich kem ten co trong du lieu.
    return ten.includes(' ') && ten.split(' ').some((w) => /[^\p{ASCII}]/u.test(w) && !biet.has(khoaChu(w))) ? [{ tu: ten, vt: m.index + bo }] : [];
  });
  const chong = (a: Bia, b: Bia): boolean => a.vt < b.vt + b.tu.length && b.vt < a.vt + a.tu.length;
  return [...theoTuDien, ...la.filter((b) => !theoTuDien.some((a) => chong(a, b)))].sort((a, b) => a.vt - b.vt);
}
