/**
 * Luan phi tinh (ke hoach `docs/ke-hoach/2026-11-03-phi-tinh.md`; cach chot: `docs/LUAN_PHI_TINH.md`; cach tinh: QUY_UOC muc 22). Tu ban
 * nam, ban thang, huong ky nam (`phiTinh`) → tong luan nam (sao giua; huong nen de yen = Ngu Hoang, Nhi Hac, Thai Tue, Tue Pha, Tam Sat
 * gop theo huong; huong thuan), thang nay (sao xau / tot nam va thang chong nhau), van 9, viec trong nha, loi nhac. Loi o
 * `phiTinhLuanLoi.ts`. Thuoc: `tests/LuanPhiTinh.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { DUONG_BAY, type O, type PhiTinh } from './phiTinh.ts';
import { BAN_HOC, BAN_HOC_GIUA, DE_YEN, GIUA, NHAC, THANG_NANG, THANG_THUAN, THANG_THUONG, THUAN, VAN, VIEC } from './phiTinhLuanLoi.ts';

const XAU = new Set([2, 5]);
const HUONG = DUONG_BAY.filter((h) => h !== 'Giữa');

/** Huong nen de yen nam nay: ten huong → cac ly do (theo thu tu `ky`). */
export function deYen(p: PhiTinh): ReadonlyMap<O, readonly string[]> {
  const m = new Map<O, string[]>();
  for (const k of p.ky) m.set(k.huong, [...(m.get(k.huong) ?? []), k.ten]);
  return m;
}

export function luanPhiTinh(p: PhiTinh): DoanLuan[] {
  const yen = deYen(p);
  const yenChu = [...yen.entries()].map(([h, ds]) => `${h} (${ds.join(', ')})`).join('; ');
  const thuan = HUONG.filter((h) => p.nam.o[h].tot && !yen.has(h)).map((h) => `${h} (${p.nam.o[h].ten})`);
  const nang = HUONG.filter((h) => XAU.has(p.nam.o[h].so) && XAU.has(p.thang.o[h].so)).map((h) => `${h} (năm ${p.nam.o[h].ten}, tháng ${p.thang.o[h].ten})`);
  const hoc = HUONG.filter((h) => [1, 4].includes(p.nam.o[h].so) && !yen.has(h));
  const tot = HUONG.filter((h) => p.nam.o[h].tot && p.thang.o[h].tot && !yen.has(h)).map((h) => `${h} (năm ${p.nam.o[h].ten}, tháng ${p.thang.o[h].ten})`);
  return [
    { tieuDe: `Tổng luận năm ${p.canChiNam}`, loi: [GIUA[p.nam.giua - 1] ?? '', DE_YEN(yenChu), ...(thuan.length === 0 ? [] : [THUAN(thuan.join(', '))])] },
    { tieuDe: 'Tháng này', loi: [nang.length === 0 ? THANG_THUONG : THANG_NANG(nang.join('; ')), ...(tot.length === 0 ? [] : [THANG_THUAN(tot.join('; '))])] },
    { tieuDe: 'Vận 9', loi: [...VAN] },
    { tieuDe: 'Việc trong nhà', loi: [VIEC[0], hoc.length === 0 ? BAN_HOC_GIUA : BAN_HOC(hoc.join(', ')), VIEC[1]] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}
