/**
 * Luan chi tay (ke hoach `docs/ke-hoach/2026-11-02-chi-tay.md`; cach chot: `docs/LUAN_CHI_TAY.md`; khung, may do, nguon: QUY_UOC muc
 * 27). Tu cac o da chon (`KhungChiTay`) → nhan chot tung o → tong luan (ket, net chung, chi tay ngang), tinh cach – tri tue, cong
 * viec – tien bac, tinh cam – gia dinh, suc ben, cac quang doi, loi nhac. Loi o `chiTayLuanLoi.ts`. Thuoc: `tests/LuanChiTay.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { CAC_DUONG, type Duong, type KhungChiTay } from './chiTay.ts';
import {
  CHUA_DU, DOI_VONG, GIAI_DOAN, KET, NEN_CHUNG, NGANG, NGANG_Y, NGHIEP, NHAC, O, SUC, TINH, TRI, TRI_MOT, TRI_SUC, type OChot,
} from './chiTayLuanLoi.ts';

/** Diem roi rac: moc gan phan vi 75 / 25 cua 3.000 ban tay gia (ba duong chinh ro / mo, o khac chia deu; docs muc 5). */
export const NGUONG_TAY = { thuan: 1.5, kho: -2.5 } as const;

/** Doc mot o da chon thanh chuoi (null = chua chon; duong "khong thay / khong co" thi cac o khac coi nhu chua chon). */
export function oDoc(k: KhungChiTay, d: Duong, o: string): string | null {
  const doc = k.duong[d] as Readonly<Record<string, string | boolean | null>>;
  if (o !== 'seen' && doc['seen'] === 'none') return null;
  const v = doc[o];
  return v === null || v === undefined ? null : String(v);
}

/** Nhan chot mot o; null khi chua chon. */
export function oChot(k: KhungChiTay, d: Duong, o: string): OChot | null {
  const v = oDoc(k, d, o);
  return v === null ? null : O[d][o]?.[v] ?? null;
}

const CAC_O = (d: Duong): string[] => Object.keys(O[d]);
const BA = ['life', 'head', 'heart'] as const;
const TEN: Readonly<Record<Duong, string>> = { life: 'đường đời', head: 'đường trí', heart: 'đường tình', fate: 'đường sự nghiệp' };

/** Ba duong chinh deu ro va da chon "lien": cac nen cung khen (+1). */
const sach = (k: KhungChiTay): boolean => BA.every((d) => oDoc(k, d, 'seen') === 'clear' && oDoc(k, d, 'broken') === 'false');

export function diemTay(k: KhungChiTay): number {
  return CAC_DUONG.reduce((t, d) => t + CAC_O(d).reduce((s, o) => s + (oChot(k, d, o)?.d ?? 0), 0), 0) + (sach(k) ? 1 : 0);
}

/** Luan ca ban tay; chua chon do ro cua ba duong chinh thi chi bao chua du. */
export function luanTay(k: KhungChiTay): DoanLuan[] {
  const nhac: DoanLuan = { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] };
  if (BA.some((d) => oDoc(k, d, 'seen') === null)) return [{ tieuDe: 'Tổng luận', loi: [CHUA_DU] }, nhac];
  const v = (d: Duong, o: string): string | null => oDoc(k, d, o);
  const diem = diemTay(k);
  const mo = CAC_DUONG.filter((d) => v(d, 'seen') === 'faint').map((d) => TEN[d]);
  const dut = CAC_DUONG.filter((d) => v(d, 'broken') === 'true').map((d) => TEN[d]);
  const tong = [diem >= NGUONG_TAY.thuan ? KET.thuan : diem <= NGUONG_TAY.kho ? KET.kho : KET.vua,
    ...(sach(k) ? [NEN_CHUNG.sach] : []), ...(mo.length > 0 ? [NEN_CHUNG.mo(mo.join(', '))] : []),
    ...(dut.length > 0 ? [NEN_CHUNG.dut(dut.join(', '))] : []), ...(k.simian === true ? [NGANG_Y] : [])];

  // Tinh cach, tri tue: dang × diem dau duong tri; suc duong tri (ro + dai); vong duong doi.
  const dang = v('head', 'shape'), dinh = v('head', 'joined');
  const tri = dang !== null && dinh !== null ? TRI[dang as 'straight' | 'curved'][dinh as 'true' | 'false']
    : dang !== null ? TRI_MOT[dang as 'straight' | 'curved'] : dinh !== null ? TRI_MOT[dinh as 'true' | 'false'] : '';
  const sucTri = (oChot(k, 'head', 'seen')?.d ?? 0) + (oChot(k, 'head', 'length')?.d ?? 0);
  const vong = v('life', 'arc');
  const tinhCach = [tri, sucTri >= 2 ? TRI_SUC.manh : sucTri < 0 ? TRI_SUC.yeu : '', vong === null ? '' : DOI_VONG[vong as 'wide' | 'narrow'],
    k.simian === true ? 'Chỉ tay ngang: một khi đã quyết thì khó ai lay — mạnh khi đúng hướng.' : ''].filter((x) => x !== '');

  // Cong viec, tien bac: duong su nghiep.
  const fs = v('fate', 'seen'), fb = v('fate', 'start');
  const nghiep = fs === null ? [NGHIEP.chua] : fs === 'none' ? [NGHIEP.khong]
    : [fb === null ? '' : NGHIEP[fb as 'wrist' | 'life' | 'middle'], fs === 'clear' ? NGHIEP.ro : NGHIEP.mo,
      v('fate', 'broken') === 'true' ? NGHIEP.dut : ''].filter((x) => x !== '');

  // Tinh cam, gia dinh: duong tinh (+ goc gia dinh khi su nghiep tach tu duong doi).
  const hs = v('heart', 'seen'), hl = v('heart', 'length');
  const tinh = hs === 'none' ? [TINH.khong] : [hs === 'clear' ? TINH.ro : TINH.mo, hl === null ? '' : TINH[hl as 'long' | 'medium' | 'short'],
    v('heart', 'broken') === 'true' ? TINH.dut : ''].filter((x) => x !== '');
  if (fb === 'life' && fs !== 'none') tinh.push(TINH.giaDinh);

  // Suc ben: duong doi; luon kem cau "khong bao tuoi tho".
  const ls = v('life', 'seen'), ll = v('life', 'length');
  const suc = [ls === 'none' ? SUC.khong : ls === 'clear' ? SUC.ro : SUC.mo, ll === 'long' ? SUC.long : ll === 'short' ? SUC.short : '',
    v('life', 'broken') === 'true' ? SUC.dut : '', SUC.nhac].filter((x) => x !== '');

  // Cac quang doi: diem dau duong su nghiep; cho dut cua duong doi, su nghiep.
  const moc = fs === 'none' ? GIAI_DOAN.none : fb === null ? '' : GIAI_DOAN[fb as 'wrist' | 'life' | 'middle'];
  const dutFate = v('fate', 'broken') === 'true', dutLife = v('life', 'broken') === 'true';
  const quang = moc === '' ? [GIAI_DOAN.chua] : [moc, dutFate ? GIAI_DOAN.fateDut : '', dutLife ? GIAI_DOAN.lifeDut : '',
    !dutFate && !dutLife && v('life', 'broken') === 'false' && (fs === 'none' || v('fate', 'broken') === 'false') ? GIAI_DOAN.khongDut : '']
    .filter((x) => x !== '');

  return [
    { tieuDe: 'Tổng luận', loi: tong },
    ...(tinhCach.length === 0 ? [] : [{ tieuDe: 'Tính cách, trí tuệ', loi: tinhCach }]),
    { tieuDe: 'Công việc, tiền bạc', loi: nghiep },
    { tieuDe: 'Tình cảm, gia đình', loi: tinh },
    { tieuDe: 'Sức bền', loi: suc },
    { tieuDe: 'Các quãng đời', loi: quang },
    nhac,
  ];
}

/** Cau tom tung o da chon cho muc "Tung o" (chi tay ngang truoc). */
export function tungO(k: KhungChiTay): { readonly ten: string; readonly o: readonly OChot[] }[] {
  return [
    ...(k.simian === null ? [] : [{ ten: 'Chỉ tay ngang', o: [NGANG[k.simian ? 'true' : 'false']] }]),
    ...CAC_DUONG.map((d) => ({ ten: TEN[d].replace(/^./u, (c) => c.toUpperCase()),
      o: CAC_O(d).map((o) => oChot(k, d, o)).filter((x): x is OChot => x !== null) })).filter((x) => x.o.length > 0),
  ];
}
