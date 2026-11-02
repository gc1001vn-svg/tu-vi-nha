/**
 * Tong luan la so chiem tinh (ke hoach `docs/ke-hoach/2026-11-02-chiem-tinh.md`; cach chot: `docs/LUAN_CHIEM_TINH.md`). Khung
 * Alan Leo (1912): nguyen to – the, ba diem chinh, khi chat, sao chu, nhom cung dong; them pham vi (Ptolemy, Lilly), truc, ngay–dem,
 * ban cau, goc chieu chinh va the goc chieu. Khong co gio sinh (khong cung Moc, nha) thi bo phan can chung. Loi o `chiemTinhLuanLoi.ts`.
 */
import { CUNG, DIEM, GOC, cungCua, gocChieu, lech, nhaCua, type LaSo } from './chiemTinh.ts';
import { NHA, TU_KHOA } from './chiemTinhGiai.ts';
import {
  BAN_CAU, BA_CUNG_THE, BA_KHAC_THE, GOC_CAP, KHI_CHAT, NGUYEN_TO, PHAM_VI, SECT, THE, THE_GOC, THE_TROI, TO_THIEU, TO_TROI, TROI_MOC,
  TROI_TRANG, TRUC,
} from './chiemTinhLuanLoi.ts';

export interface DoanLuan { readonly tieuDe: string; readonly loi: readonly string[] }

/** Trong so khi dem nguyen to, the, ban cau: Mat Troi, Mat Trang (va cung Moc) 3; Thuy, Kim, Hoa 2; Moc, Tho 1; ba sao xa 0,5. */
const TRONG = [3, 3, 2, 2, 2, 1, 1, 0.5, 0.5, 0.5];
/** Sao chu co dien cua 12 cung (Ptolemy); hien dai them: Thien Yet – Diem Vuong, Bao Binh – Thien Vuong, Song Ngu – Hai Vuong. */
export const CHU = [4, 3, 2, 1, 0, 2, 3, 4, 5, 6, 6, 5];
const CHU_MOI: Readonly<Record<number, number>> = { 7: 9, 10: 7, 11: 8 };
/** Cung vuong (exaltation) cua 7 sao co dien. */
const VUONG: Readonly<Record<number, number>> = { 0: 0, 1: 1, 2: 5, 3: 11, 4: 9, 5: 3, 6: 6 };

const so1 = (x: number): string => x.toFixed(1).replace('.', ',');
const quanHeTo = (a: number, b: number): 'dong' | 'hop' | 'nghich' => (a === b ? 'dong' : (a + b) % 2 === 0 ? 'hop' : 'nghich');

/** Pham vi sao `i` (0..6) o kinh do `k`: 0 mieu, 1 vuong, 2 ham, 3 suy, null khong co. */
export function phamVi(i: number, k: number): number | null {
  const s = cungCua(k), d = (s + 6) % 12;
  return CHU[s] === i ? 0 : VUONG[i] === s ? 1 : CHU[d] === i ? 2 : VUONG[i] === d ? 3 : null;
}

/** Tong trong so theo nhom: `nhom(kinh)` → chi so nhom. */
function dem(ls: LaSo, so: number, nhom: (k: number) => number): number[] {
  const t = new Array<number>(so).fill(0);
  ls.diem.slice(0, 10).forEach((d, i) => { t[nhom(d.kinh)] = (t[nhom(d.kinh)] ?? 0) + (TRONG[i] ?? 0); });
  if (ls.moc !== null) t[nhom(ls.moc)] = (t[nhom(ls.moc)] ?? 0) + 3;
  return t;
}

/** Goc chieu chinh giua cac cap co loi (`GOC_CAP`), uu tien cap co Mat Troi / Mat Trang, roi lech nho; toi da `n`. */
export function gocChinh(ls: LaSo, n = 6): { a: number; b: number; goc: number; orb: number; thuan: boolean }[] {
  const nang = (a: number): number => (a <= 1 ? 0 : a <= 4 ? 1 : 2);
  return gocChieu(ls).filter((g) => g.b < 10 && GOC_CAP[`${String(g.a)}-${String(g.b)}`] !== undefined)
    .map((g) => ({ ...g, thuan: g.goc === 1 || g.goc === 3 || (g.goc === 0 && g.b < 6) }))
    .sort((x, y) => nang(x.a) - nang(y.a) || x.orb - y.orb).slice(0, n);
}

/** The goc chieu giua 10 thien the: tam hop lon, chu T, thap gia lon (moi loai toi da mot). */
function theGoc(ls: LaSo): string[] {
  const g = gocChieu(ls).filter((x) => x.b < 10), co = (a: number, b: number, goc: number): boolean =>
    g.some((x) => x.goc === goc && ((x.a === a && x.b === b) || (x.a === b && x.b === a)));
  const ten = (...i: number[]): string => i.map((x) => DIEM[x] ?? '').join(', ');
  const ra: string[] = [];
  const doi = g.filter((x) => x.goc === 4);
  outer: for (const x of doi) {
    for (const y of doi) {
      if (y === x || y.a <= x.a) continue;
      if ([[x.a, y.a], [x.a, y.b], [x.b, y.a], [x.b, y.b]].every(([p = 0, q = 0]) => co(p, q, 2))) { ra.push(THE_GOC.thapLon.replace('{}', ten(x.a, x.b, y.a, y.b))); break outer; }
    }
  }
  for (const x of doi) {
    const dinh = [...Array(10).keys()].find((c) => c !== x.a && c !== x.b && co(x.a, c, 2) && co(x.b, c, 2));
    if (dinh !== undefined && ra.length === 0) { ra.push(THE_GOC.chuT.replace('{}', ten(x.a, x.b, dinh)).replace('{}', DIEM[dinh] ?? '')); break; }
  }
  const tam = g.filter((x) => x.goc === 3);
  for (const x of tam) {
    const c = [...Array(10).keys()].find((k) => k > x.b && co(x.a, k, 3) && co(x.b, k, 3));
    if (c !== undefined) { ra.push(THE_GOC.tamHopLon.replace('{}', `${ten(x.a, x.b, c)}, nguyên tố ${NGUYEN_TO[cungCua(ls.diem[x.a]?.kinh ?? 0) % 4] ?? ''}`)); break; }
  }
  return ra;
}

export function tongLuanCT(ls: LaSo): DoanLuan[] {
  const k = (i: number): number => ls.diem[i]?.kinh ?? 0;
  const s0 = cungCua(k(0)), s1 = cungCua(k(1)), moc = ls.moc, sA = moc === null ? null : cungCua(moc);
  const nha = ls.nha, nhaO = (kd: number): number | null => (nha === null ? null : nhaCua(kd, nha));

  const ba = [`Mặt Trời ${CUNG[s0] ?? ''}, Mặt Trăng ${CUNG[s1] ?? ''}${sA === null ? '' : `, cung Mọc ${CUNG[sA] ?? ''}`}.`,
    TROI_TRANG[quanHeTo(s0 % 4, s1 % 4)]];
  if (sA !== null) {
    ba.push(TROI_MOC[quanHeTo(s0 % 4, sA % 4)]);
    const t = [s0 % 3, s1 % 3, sA % 3], trung = t.find((x, i) => t.indexOf(x) !== i);
    ba.push(t[0] === t[1] && t[1] === t[2] ? BA_CUNG_THE[t[0] ?? 0] ?? ''
      : trung === undefined ? BA_KHAC_THE : `Hai trong ba điểm chính cùng thể ${THE[trung] ?? ''}: nét ${(THE[trung] ?? '').toLowerCase()} rõ hơn cả.`);
  }

  const to = dem(ls, 4, (x) => cungCua(x) % 4), the = dem(ls, 3, (x) => cungCua(x) % 3), tong = to.reduce((a, b) => a + b, 0);
  const iTo = to.indexOf(Math.max(...to)), iThe = the.indexOf(Math.max(...the)), duong = (to[0] ?? 0) + (to[2] ?? 0);
  const ngt = [...(Math.max(...to) / tong >= 0.35 ? [TO_TROI[iTo] ?? ''] : []), ...to.flatMap((w, i) => (w < 1 ? [TO_THIEU[i] ?? ''] : [])),
    ...(Math.max(...the) / tong >= 0.4 ? [THE_TROI[iThe] ?? ''] : []),
    duong / tong >= 0.6 ? KHI_CHAT.duong : duong / tong <= 0.4 ? KHI_CHAT.am : KHI_CHAT.can];

  const noiBat: string[] = [];
  if (sA !== null && moc !== null) {
    const r = CHU[sA] ?? 0, h = nhaO(k(r)), pv = phamVi(r, k(r)), moi = CHU_MOI[sA];
    noiBat.push(`Cung Mọc ${CUNG[sA] ?? ''} nên sao chủ lá số là ${DIEM[r] ?? ''} (${TU_KHOA[r] ?? ''}); sao này ở ${CUNG[cungCua(k(r))] ?? ''}`
      + `${h === null ? '' : `, nhà ${String(h)} — đời dồn sức vào ${NHA[h - 1] ?? ''}`}${pv === null ? '' : `; ${(PHAM_VI[pv] ?? '').replace('{}', 'sức sao chủ')}`}.`);
    if (moi !== undefined) noiBat.push(`Theo cách hiện đại, cung ${CUNG[sA] ?? ''} còn có ${DIEM[moi] ?? ''} đồng cai quản — thêm màu ${TU_KHOA[moi] ?? ''}.`);
  }
  if (moc !== null && ls.dinh !== null) {
    const truc = [moc, ls.dinh, moc + 180, ls.dinh + 180];
    for (let i = 0; i < 10; i++) {
      truc.forEach((t, j) => {
        const d = Math.abs(lech(k(i), t));
        if (d <= 8) noiBat.push(`${DIEM[i] ?? ''} sát ${TRUC[j]?.[0] ?? ''} (lệch ${so1(d)}°): ${TU_KHOA[i] ?? ''} nổi bật, ${TRUC[j]?.[1] ?? ''}.`);
      });
    }
  }
  for (let i = 0; i < 7; i++) {
    const pv = phamVi(i, k(i));
    if (pv !== null) noiBat.push(`${DIEM[i] ?? ''} ${(PHAM_VI[pv] ?? '').replace('{}', TU_KHOA[i] ?? '')}.`);
  }

  const nhom: string[] = [];
  const theoChu = new Array<number>(7).fill(0), theoCung = new Array<number>(12).fill(0), theoNha = new Array<number>(12).fill(0);
  for (let i = 0; i < 10; i++) {
    const s = cungCua(k(i)), c = CHU[s] ?? 0, h = nhaO(k(i));
    theoChu[c] = (theoChu[c] ?? 0) + 1; theoCung[s] = (theoCung[s] ?? 0) + 1;
    if (h !== null) theoNha[h - 1] = (theoNha[h - 1] ?? 0) + 1;
  }
  theoChu.forEach((n, c) => { if (n >= 4) nhom.push(`${String(n)} hành tinh ở các cung do ${DIEM[c] ?? ''} cai quản: lá số đậm màu ${TU_KHOA[c] ?? ''}.`); });
  theoCung.forEach((n, s) => { if (n >= 3) nhom.push(`${String(n)} hành tinh cùng ở ${CUNG[s] ?? ''}: sức dồn mạnh vào một phong cách.`); });
  theoNha.forEach((n, h) => { if (n >= 3) nhom.push(`${String(n)} hành tinh cùng ở nhà ${String(h + 1)}: đời dồn sức vào ${NHA[h] ?? ''}.`); });

  const ngayDem: string[] = [];
  if (nha !== null) {
    const hT = nhaO(k(0)) ?? 1;
    ngayDem.push(hT >= 7 ? SECT.ngay : SECT.dem);
    let tren = 0, dong = 0, w = 0;
    ls.diem.slice(0, 10).forEach((d, i) => {
      const h = nhaO(d.kinh) ?? 1, t = TRONG[i] ?? 0;
      w += t; tren += h >= 7 ? t : 0; dong += h >= 10 || h <= 3 ? t : 0;
    });
    if (tren / w >= 0.65) ngayDem.push(BAN_CAU.tren); else if (tren / w <= 0.35) ngayDem.push(BAN_CAU.duoi);
    if (dong / w >= 0.65) ngayDem.push(BAN_CAU.dong); else if (dong / w <= 0.35) ngayDem.push(BAN_CAU.tay);
  }

  const goc = gocChinh(ls).map((g) => `${DIEM[g.a] ?? ''} ${(GOC[g.goc]?.ten ?? '').toLowerCase()} ${DIEM[g.b] ?? ''} (lệch ${so1(g.orb)}°): `
    + (GOC_CAP[`${String(g.a)}-${String(g.b)}`]?.[g.thuan ? 0 : 1] ?? ''));

  return [
    { tieuDe: 'Ba điểm chính (Mặt Trời, Mặt Trăng, cung Mọc)', loi: ba },
    { tieuDe: 'Nguyên tố, thể, khí chất', loi: ngt },
    ...(noiBat.length === 0 ? [] : [{ tieuDe: 'Sao chủ và hành tinh nổi bật', loi: noiBat }]),
    ...(nhom.length === 0 ? [] : [{ tieuDe: 'Chỗ hành tinh dồn lại', loi: nhom }]),
    ...(ngayDem.length === 0 ? [] : [{ tieuDe: 'Ngày – đêm, nửa lá số', loi: ngayDem }]),
    ...(goc.length === 0 ? [] : [{ tieuDe: 'Góc chiếu chính', loi: [...goc, ...theGoc(ls)] }]),
  ];
}
