/**
 * Luan chi tay (ke hoach 02/11 `2026-11-02-chi-tay.md`; viet lai 09/11 `2026-11-09-loi-giai-chi-tay-nguon.md`; cach chot, nguyen van
 * sach: `docs/LUAN_CHI_TAY.md`; khung, may do: QUY_UOC muc 27, 45–49). Ket qua may do (`KhungChiTay`) → tong luan (ket: mang manh nhat
 * / can giu nhat, net ca ban tay, chi tay ngang), tinh cach – tri tue, cong viec – tien bac, tinh cam – gia dinh, suc ben, cac quang
 * doi, loi nhac. Moi cau mot y kem sach (`Y`), phan lon ghep hai o tro len; "ro / mo" tren anh chi dem khi so cac duong voi nhau.
 * Loi o `chiTayLuanLoi.ts`. Thuoc: `tests/LuanChiTay.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { CAC_DUONG, type Duong, type KhungChiTay } from './chiTay.ts';
import {
  CHUA_DU, CHUA_NGHIEP, CHUA_QUANG, KET, KET_SACH, MANG, NET, NGANG_Y, NGHIEP, NGHIEP_DUT, NGHIEP_KHONG, NHAC, QUANG, QUANG_KHONG, SUC,
  SUC_BU, SUC_DAM, SUC_DUT, SUC_KHONG, SUC_NHAC, TINH, TINH_KHONG, TINH_TRI, TINH_VONG, TRI_DANG, TRI_DAU, TRI_DUT, TRI_KHONG,
  cau, type Y,
} from './chiTayLuanLoi.ts';

/** Doc mot o thanh chuoi (null = may chua do; duong "khong thay / khong co" thi cac o khac coi nhu chua do). */
export function oDoc(k: KhungChiTay, d: Duong, o: string): string | null {
  const doc = k.duong[d] as Readonly<Record<string, string | boolean | null>>;
  if (o !== 'seen' && doc['seen'] === 'none') return null;
  const v = doc[o];
  return v === null || v === undefined ? null : String(v);
}

/** Mot y da chon cho ban tay; `tu`: cac o y do dua vao ("duong.o", "simian"). */
export interface YTay extends Y { readonly tu: readonly string[] }
/** Mot doan: cac y (co sach) roi cac cau co dinh (loi dan, bao may chua do). */
export interface DoanY { readonly tieuDe: string; readonly y: readonly YTay[]; readonly them: readonly string[] }

const BA = ['life', 'head', 'heart'] as const;
const TEN: Readonly<Record<Duong, string>> = { life: 'đường đời', head: 'đường trí', heart: 'đường tình', fate: 'đường sự nghiệp' };
/** Thu tu khi hai mang bang diem. */
const THU: readonly Duong[] = ['head', 'life', 'fate', 'heart'];

/** Mot dau cua mot duong cho cau ket: diem (+ manh, − yeu), chu ghi, o. */
interface Dau { readonly d: number; readonly ten: string; readonly tu: string }

/**
 * Dau tung duong cho cau ket — Benham so cac duong voi nhau (tr. 362: "đường đậm hơn hẳn là điều mạnh nhất, đường mờ hơn hẳn là chỗ
 * yếu nhất"), doc do dai (tr. 425, 473), cho dut (tr. 366–368); Cheiro doc duong tinh (tr. 97–99), su nghiep (tr. 103–105).
 * Ro / mo chi tinh khi dung mot duong khac hai duong kia (anh toi lam mo ca ban tay nhu nhau), nhe (0,25).
 */
export function dauTay(k: KhungChiTay): Readonly<Record<Duong, readonly Dau[]>> {
  const v = (d: Duong, o: string): string | null => oDoc(k, d, o);
  const ra: Record<Duong, Dau[]> = { life: [], head: [], heart: [], fate: [] };
  const them = (dk: boolean, d: Duong, diem: number, ten: string, tu: string): void => { if (dk) ra[d].push({ d: diem, ten, tu }); };
  for (const d of ['life', 'head'] as const) {
    them(v(d, 'length') === 'long', d, 1, 'dài', `${d}.length`);
    them(v(d, 'length') === 'short', d, -1, 'ngắn', `${d}.length`);
  }
  them(v('heart', 'length') === 'long', 'heart', 0.5, 'dài tới ngón trỏ', 'heart.length');
  them(v('heart', 'length') === 'short', 'heart', -0.5, 'ngắn', 'heart.length');
  them(v('life', 'arc') === 'wide', 'life', 0.5, 'vòng rộng', 'life.arc');
  them(v('life', 'arc') === 'narrow', 'life', -0.5, 'ôm sát ngón cái', 'life.arc');
  them(v('fate', 'seen') === 'clear', 'fate', 1, 'rõ', 'fate.seen');
  them(v('fate', 'start') === 'wrist', 'fate', 0.5, 'mọc từ cổ tay', 'fate.start');
  for (const d of CAC_DUONG) them(v(d, 'broken') === 'true', d, -1, 'có chỗ đứt', `${d}.broken`);
  const ro = BA.filter((d) => v(d, 'seen') === 'clear'), mo = BA.filter((d) => v(d, 'seen') === 'faint');
  const [r0] = ro, [m0] = mo;
  // 0,25: chi phan dinh khi cac dau khac bang nhau (dau khac la boi cua 0,5) — do 09/11: lat ro ↔ mo doi mang chon 17 % ban tay (0,5: 41 %).
  if (r0 !== undefined && ro.length === 1 && mo.length === 2) them(true, r0, 0.25, 'nét đậm hơn hai đường kia', `${r0}.seen`);
  if (m0 !== undefined && mo.length === 1 && ro.length === 2) them(true, m0, -0.25, 'nét mờ hơn hai đường kia', `${m0}.seen`);
  return ra;
}

/** Cau ket: mang manh nhat (tong dau > 0) va can giu nhat (tong < 0); bang diem thi lay mang nhieu dau hon roi theo `THU`. */
function ketTay(k: KhungChiTay): YTay {
  const dau = dauTay(k), tong = (d: Duong): number => dau[d].reduce((s, x) => s + x.d, 0);
  const so = (d: Duong, len: boolean): number => dau[d].filter((x) => (len ? x.d > 0 : x.d < 0)).length;
  const manh = THU.filter((d) => tong(d) > 0).sort((a, b) => tong(b) - tong(a) || so(b, true) - so(a, true))[0];
  const yeu = THU.filter((d) => tong(d) < 0).sort((a, b) => tong(a) - tong(b) || so(b, false) - so(a, false))[0];
  const ta = (d: Duong, len: boolean): string => `${MANG[d]} — ${TEN[d]} ${dau[d].filter((x) => (len ? x.d > 0 : x.d < 0)).map((x) => x.ten)
    .join(', ')}`;
  const loi = manh !== undefined && yeu !== undefined ? KET.ca(ta(manh, true), ta(yeu, false)) : manh !== undefined ? KET.manh(ta(manh, true))
    : yeu !== undefined ? KET.yeu(ta(yeu, false)) : KET.deu;
  const tu = [...(manh === undefined ? [] : dau[manh].filter((x) => x.d > 0)), ...(yeu === undefined ? [] : dau[yeu].filter((x) => x.d < 0))]
    .map((x) => x.tu);
  return { loi, sach: KET_SACH, ghep: true, tu };
}

const co = (x: Y, ...tu: string[]): YTay => ({ ...x, tu });

/** Luan ca ban tay thanh tung doan y (co sach); chua do du ba duong chinh thi chi bao chua du. */
export function luanTayY(k: KhungChiTay): DoanY[] {
  const nhac: DoanY = { tieuDe: 'Nhìn cho đúng', y: [], them: [...NHAC] };
  const v = (d: Duong, o: string): string | null => oDoc(k, d, o);
  if (BA.some((d) => v(d, 'seen') === null)) return [{ tieuDe: 'Tổng luận', y: [], them: [CHUA_DU] }, nhac];
  const thay = (d: Duong): boolean => v(d, 'seen') === 'clear' || v(d, 'seen') === 'faint';
  const ro = BA.filter((d) => v(d, 'seen') === 'clear'), mo = BA.filter((d) => v(d, 'seen') === 'faint');
  const fs = v('fate', 'seen'), fb = v('fate', 'start') as 'wrist' | 'life' | 'middle' | null;
  const hl = v('head', 'length') as 'long' | 'medium' | 'short' | null, tl = v('heart', 'length') as 'long' | 'medium' | 'short' | null;
  const ll = v('life', 'length') as 'long' | 'medium' | 'short' | null, arc = v('life', 'arc') as 'wide' | 'narrow' | null;
  const dinh = v('head', 'joined') as 'true' | 'false' | null;
  const ds = <T,>(...x: (T | null | false)[]): T[] => x.filter((a): a is T => a !== null && a !== false);

  const tong = ds<YTay>(ketTay(k),
    ro.length === 3 && BA.every((d) => v(d, 'broken') === 'false') && co(NET.sach, ...BA.flatMap((d) => [`${d}.seen`, `${d}.broken`])),
    mo.length === 3 && co(NET.mo, ...BA.map((d) => `${d}.seen`)), k.simian === true && co(NGANG_Y, 'simian'));

  const dang = v('head', 'shape') as 'straight' | 'curved' | null;
  const dauNghiep = fs === 'none' ? 'none' : fs === null ? null : fb;
  const tri = v('head', 'seen') === 'none' ? [co(TRI_KHONG, 'head.seen')] : ds<YTay>(
    dang !== null && hl !== null && co(TRI_DANG[dang][hl], 'head.shape', 'head.length'),
    dinh !== null && dauNghiep !== null && co(TRI_DAU[dinh][dauNghiep], 'head.joined', dauNghiep === 'none' ? 'fate.seen' : 'fate.start'),
    v('head', 'broken') === 'true' && thay('head') && co(TRI_DUT[v('head', 'seen') as 'clear' | 'faint'], 'head.broken', 'head.seen'));

  const nghiep = fs === 'none' ? [hl === 'long' || hl === 'short' ? co(NGHIEP_KHONG[hl], 'fate.seen', 'head.length')
    : co(NGHIEP_KHONG.medium, 'fate.seen')] : ds<YTay>(
    (fs === 'clear' || fs === 'faint') && fb !== null && co(NGHIEP[fb][fs], 'fate.start', 'fate.seen'),
    (fs === 'clear' || fs === 'faint') && v('fate', 'broken') === 'true' && co(NGHIEP_DUT[fs], 'fate.broken', 'fate.seen'));

  const tb = v('heart', 'broken') as 'true' | 'false' | null;
  const tinh = v('heart', 'seen') === 'none' ? [co(TINH_KHONG, 'heart.seen')] : ds<YTay>(
    tl !== null && tb !== null && co(TINH[tl][tb], 'heart.length', 'heart.broken'),
    arc !== null && tl !== null && co(TINH_VONG[arc][tl], 'life.arc', 'heart.length'),
    k.simian !== true && thay('heart') && thay('head') && v('heart', 'seen') !== v('head', 'seen')
      && co(TINH_TRI[v('heart', 'seen') === 'clear' ? 'tinh' : 'tri'], 'heart.seen', 'head.seen'));

  const suc = v('life', 'seen') === 'none' ? [co(SUC_KHONG, 'life.seen')] : ds<YTay>(
    ll !== null && arc !== null && co(SUC[ll][arc], 'life.length', 'life.arc'),
    ll === 'short' && v('head', 'seen') === 'clear' && hl === 'long' && co(SUC_BU, 'life.length', 'head.seen', 'head.length'),
    v('life', 'broken') === 'true' && thay('life') && co(SUC_DUT[v('life', 'seen') as 'clear' | 'faint'], 'life.broken', 'life.seen'),
    ro.length === 1 && ro[0] === 'life' && mo.length === 2 && co(SUC_DAM, ...BA.map((d) => `${d}.seen`)));

  const fd = v('fate', 'broken') as 'true' | 'false' | null;
  const quang = fs === 'none' ? [dinh === null ? co(QUANG_KHONG.chung, 'fate.seen') : co(QUANG_KHONG[dinh], 'fate.seen', 'head.joined')]
    : ds<YTay>(fb !== null && fd !== null && co(QUANG[fb][fd], 'fate.start', 'fate.broken'));

  return [
    { tieuDe: 'Tổng luận', y: tong, them: [] },
    { tieuDe: 'Tính cách, trí tuệ', y: tri, them: [] },
    { tieuDe: 'Công việc, tiền bạc', y: nghiep, them: nghiep.length === 0 ? [CHUA_NGHIEP] : [] },
    { tieuDe: 'Tình cảm, gia đình', y: tinh, them: [] },
    { tieuDe: 'Sức bền', y: suc, them: [SUC_NHAC] },
    { tieuDe: 'Các quãng đời', y: quang, them: quang.length === 0 ? [CHUA_QUANG] : [] },
    nhac,
  ].filter((d) => d.y.length + d.them.length > 0);
}

/** Loi luan hien ra: moi y mot cau kem sach trong ngoac, roi cac cau co dinh. */
export function luanTay(k: KhungChiTay): DoanLuan[] {
  return luanTayY(k).map((d) => ({ tieuDe: d.tieuDe, loi: [...d.y.map(cau), ...d.them] }));
}
