/**
 * Luan tuoi hop (ke hoach `docs/ke-hoach/2026-11-03-tuoi-hop.md`; cach chot: `docs/LUAN_TUOI_HOP.md`; bang chi cu: `tuoiHop.ts`, QUY_UOC
 * muc 14). Quan he hai chi theo Tam Menh Thong Hoi q.2 (luc hop, tam hop, tam hinh, luc hai, xung kich) va Hiep Ky Bien Phuong Thu
 * (luc hai = bat hoa); "tu hanh xung" cua tuc Viet tach lai theo sach. Xep 12 tuoi cho mot nguoi; so hai nam sinh: chi + menh (nap am)
 * + can. Loi o `tuoiHopLuanLoi.ts`. Thuoc: `tests/LuanTuoiHop.test.ts`.
 */
import { CAN, CHI } from './amLich.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { hv } from './hanViet/index.ts';
import { napAmNam } from './hoSo.ts';
import {
  CAN_Y, CHI_Y, CUNG_TUOI, KET_CAP, KHONG_DUNG, MENH_Y, MUC, NHAC, OAN_THAN, TU_HANH, TU_HINH,
} from './tuoiHopLuanLoi.ts';

const tenChi = (c: number): string => hv('chi', CHI.charAt(((c % 12) + 12) % 12));
const kc = (a: number, b: number): number => (((b - a) % 12) + 12) % 12;

/** Tam hinh: Dần–Tỵ–Thân, Sửu–Tuất–Mùi, Tý–Mão; tu hinh: Thìn, Ngọ, Dậu, Hợi (Tam Menh Thong Hoi "Luan tam hinh"). */
const HINH: readonly (readonly number[])[] = [[2, 5, 8], [1, 10, 7], [0, 3]];
const TU_HINH_CHI = new Set([4, 6, 9, 11]);
/** Oan than (Han: 원진): Tý–Mùi, Sửu–Ngọ, Dần–Dậu, Mão–Thân, Thìn–Hợi, Tỵ–Tuất. */
const OAN: readonly (readonly [number, number])[] = [[0, 7], [1, 6], [2, 9], [3, 8], [4, 11], [5, 10]];

export interface QuanHeChi {
  readonly tamHop: boolean; readonly lucHop: boolean; readonly xung: boolean; readonly hinh: boolean;
  readonly hai: boolean; readonly cung: boolean; readonly tuHinh: boolean; readonly oanThan: boolean;
}

export function quanHeChi(a: number, b: number): QuanHeChi {
  const d = kc(a, b), cung = d === 0;
  return {
    tamHop: d === 4 || d === 8, lucHop: (a + b) % 12 === 1, xung: d === 6, hai: (a + b) % 12 === 7, cung,
    hinh: !cung && HINH.some((g) => g.includes(a) && g.includes(b)), tuHinh: cung && TU_HINH_CHI.has(a),
    oanThan: OAN.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
  };
}

export type MucChi = 'rat' | 'hopHinh' | 'binh' | 'ne' | 'ky';

/** Muc chot cua mot cap chi: xung nang nhat; hop ma co hinh (Tỵ–Thân) rieng; hinh, hai, tu hinh "de chung". */
export function mucChi(a: number, b: number): MucChi {
  const q = quanHeChi(a, b);
  if (q.xung) return 'ky';
  if (q.lucHop && q.hinh) return 'hopHinh';
  if (q.tamHop || q.lucHop) return 'rat';
  if (q.hinh || q.hai || q.tuHinh) return 'ne';
  return 'binh';
}

/** Xep 12 tuoi cho nguoi co chi nam `chi` (0 = Tý). */
export function luanTuoi(chi: number): DoanLuan[] {
  const nhom = (m: MucChi): string[] => Array.from({ length: 11 }, (_, i) => (chi + i + 1) % 12).filter((c) => mucChi(chi, c) === m).map(tenChi);
  const xep = (['rat', 'hopHinh', 'binh', 'ne', 'ky'] as const).flatMap((m) => { const ds = nhom(m); return ds.length === 0 ? [] : [MUC[m](ds.join(', '))]; });
  // Tu hanh xung tuc Viet: ba chi cach 3, 6, 9 — tach lai theo quan he that.
  const ba = [3, 6, 9].map((d) => (chi + d) % 12);
  const khac = ba.filter((c) => kc(chi, c) !== 6).map((c) => {
    const q = quanHeChi(chi, c);
    return `${tenChi(c)} ${q.lucHop ? 'là lục hợp (tốt)' : q.hinh && q.hai ? 'là hình và hại' : q.hinh ? 'là tương hình' : q.hai ? 'là lục hại' : 'không hợp không xung'}`;
  });
  const oan = OAN.find(([x, y]) => x === chi || y === chi);
  const oanTen = oan === undefined ? '' : tenChi(oan[0] === chi ? oan[1] : oan[0]);
  return [
    { tieuDe: `Xếp 12 tuổi cho tuổi ${tenChi(chi)}`, loi: [...xep, TU_HINH_CHI.has(chi) ? TU_HINH : CUNG_TUOI] },
    { tieuDe: 'Chỗ tục Việt khác sách', loi: [TU_HANH([chi, ...ba].map(tenChi).join(', '), tenChi(chi + 6), khac.join('; ')), OAN_THAN(oanTen)] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}

const SINH: Readonly<Record<string, string>> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const hanh = (namAm: number): string => napAmNam(namAm).slice(-1);
const tenHanh = (h: string): string => hv('nguHanh', h);

/** Diem cap: chi (tam / luc hop +2; hop ma hinh +0,5; cung chi +0,5, tu hinh −0,5; hinh, hai −1, ca hai −1,5; xung −2, xung ma menh
 * sinh nhau −0,5) + menh (sinh +1, cung hanh +0,5, khac −1) + can (ngu hop +0,5, tuong xung −0,5). */
export function diemCap(namA: number, namB: number): number {
  return chiCap(namA, namB).d + menhCap(namA, namB).d + canCap(namA, namB).d;
}

const chiNam = (n: number): number => (((n + 8) % 12) + 12) % 12;
const canNam = (n: number): number => (((n + 6) % 10) + 10) % 10;

function menhCap(a: number, b: number): { readonly d: number; readonly y: string; readonly sinh: boolean } {
  const ha = hanh(a), hb = hanh(b);
  if (ha === hb) return { d: 0.5, y: MENH_Y.cung(tenHanh(ha)), sinh: false };
  if (SINH[ha] === hb) return { d: 1, y: MENH_Y.sinh(tenHanh(ha), tenHanh(hb)), sinh: true };
  if (SINH[hb] === ha) return { d: 1, y: MENH_Y.sinh(tenHanh(hb), tenHanh(ha)), sinh: true };
  const khac = SINH[SINH[ha] ?? ''] === hb; // ha khac hb khi hb cach ha hai buoc tren vong sinh
  return { d: -1, y: khac ? MENH_Y.khac(tenHanh(ha), tenHanh(hb)) : MENH_Y.khac(tenHanh(hb), tenHanh(ha)), sinh: false };
}

function chiCap(a: number, b: number): { readonly d: number; readonly y: string } {
  const ca = chiNam(a), cb = chiNam(b), q = quanHeChi(ca, cb);
  if (q.xung) return menhCap(a, b).sinh ? { d: -0.5, y: CHI_Y.xungGiam } : { d: -2, y: CHI_Y.xung };
  if (q.lucHop && q.hinh) return { d: 0.5, y: CHI_Y.hopHinh };
  if (q.tamHop) return { d: 2, y: CHI_Y.tamHop };
  if (q.lucHop) return { d: 2, y: CHI_Y.lucHop };
  if (q.hinh && q.hai) return { d: -1.5, y: CHI_Y.hinhHai };
  if (q.hinh) return { d: -1, y: CHI_Y.hinh };
  if (q.hai) return { d: -1, y: CHI_Y.hai };
  if (q.cung) return q.tuHinh ? { d: -0.5, y: CHI_Y.tuHinh } : { d: 0.5, y: CHI_Y.cung };
  return { d: 0, y: CHI_Y.binh };
}

/** Can ngu hop (Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý); tuong xung (Giáp–Canh, Ất–Tân, Bính–Nhâm, Đinh–Quý). */
function canCap(a: number, b: number): { readonly d: number; readonly y: string } {
  const x = canNam(a), y = canNam(b);
  if (Math.abs(x - y) === 5) return { d: 0.5, y: CAN_Y.hop };
  if (Math.abs(x - y) === 6 && Math.min(x, y) <= 3) return { d: -0.5, y: CAN_Y.xung };
  return { d: 0, y: CAN_Y.binh };
}

/** Moc diem: gan phan vi 75 / 25 cua moi cap trong 60 × 60 nam (docs muc 5). */
export const NGUONG_CAP = { hop: 1.5, ky: -1 } as const;

const tenNam = (n: number): string => `${hv('can', CAN.charAt(canNam(n)))} ${tenChi(chiNam(n))}`;

/** So hai nam sinh am lich (theo Tet). */
export function luanCap(namA: number, namB: number): DoanLuan[] {
  const d = diemCap(namA, namB), c = chiCap(namA, namB), m = menhCap(namA, namB), k = canCap(namA, namB);
  const ket = d >= NGUONG_CAP.hop ? KET_CAP.hop : d <= NGUONG_CAP.ky ? KET_CAP.ky : KET_CAP.vua;
  const oan = quanHeChi(chiNam(namA), chiNam(namB)).oanThan;
  return [
    { tieuDe: `Tuổi ${tenNam(namA)} (${String(namA)}) và tuổi ${tenNam(namB)} (${String(namB)})`, loi: [ket] },
    { tieuDe: 'Từng phần', loi: [c.y, m.y, ...(k.y === '' ? [] : [k.y]), ...(oan ? [CHI_Y.oanThan] : []), KHONG_DUNG] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}
