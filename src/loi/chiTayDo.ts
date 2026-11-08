/**
 * May tu do chi tay tren anh (dot 7 phan 3; sua 06/11 — ke hoach `docs/ke-hoach/2026-11-06-may-do-chi-tay.md`): nhan anh xam long ban
 * tay DA DUA VE KHUNG CHUAN (giaoDien lo MediaPipe + canvas) cung moc ngon tay, tim 4 duong roi xep o cua `KHUNG` (`chiTay.ts`) de
 * nguoi xem xac nhan, sua. Cach lam: ban do nep tren LOG do sang (bong do khong lam mat nep) — tri rieng lon nhat cua Hessian, hai co,
 * giu ca HUONG nep → moi duong mot quy hoach dong, chi cong nep chay CUNG HUONG buoc di (bo nep nhan cat ngang) → tim theo thu tu
 * duong doi (quanh go ngon cai) → duong tri (chung dau voi duong doi) → duong tinh (BAT BUOC nam tren duong tri) → su nghiep → do o;
 * o sat ranh de trong (null) cho nguoi xem tu chon. Thuan: khong trinh duyet, dong ho, ngau nhien. Nguong: QUY_UOC muc 27, 45, 46.
 *
 * Khung chuan: goc toa do o co tay (moc 0), truc y huong ve goc ngon giua (moc 9), don vi L = khoang co tay → goc ngon giua; truc x
 * huong ve phia ngon cai (tay trai da lat guong). Diem anh (i, j): x = X0 + (i + 0,5)/PX, y = Y1 − (j + 0,5)/PX.
 */
import type { KhungChiTay } from './chiTay.ts';

export const KHUNG_ANH = { x0: -0.8, x1: 0.8, y0: -0.15, y1: 1.3, px: 160 } as const;
export const RONG = Math.round((KHUNG_ANH.x1 - KHUNG_ANH.x0) * KHUNG_ANH.px);
export const CAO = Math.round((KHUNG_ANH.y1 - KHUNG_ANH.y0) * KHUNG_ANH.px);

/** Toa do khung chuan, don vi L. */
export interface Diem { readonly x: number; readonly y: number }

/** Moc MediaPipe can dung (so trong ngoac): co tay (0), goc ngon cai (1), khop ngon cai (2), goc ngon tro (5), giua (9), ap ut (13), ut (17). */
export interface MocTay { readonly co: Diem; readonly caiGoc: Diem; readonly caiKhop: Diem; readonly tro: Diem; readonly giua: Diem; readonly apUt: Diem; readonly ut: Diem }

export interface KetQuaDo {
  readonly khung: KhungChiTay;
  /** Doan nep may thay cua tung duong (rong = khong thay), da lam muot de ve de len anh. */
  readonly vet: { readonly life: readonly Diem[]; readonly head: readonly Diem[]; readonly heart: readonly Diem[]; readonly fate: readonly Diem[] };
}

/**
 * Moc tay co dung dang ban tay chup thang khong (khung chuan). Khoang cho phep: khoang do tren 11 anh mau 06/11 (long va mu tay, trai
 * va phai) noi rong ~50 %. Ngoai khoang = chup nghieng, ngon co, MediaPipe dat moc lech → do bua se sai duong.
 */
export function mocHopLe(m: MocTay): boolean {
  const trong = (v: number, a: number, b: number): boolean => v >= a && v <= b;
  return trong(m.tro.x, 0.12, 0.45) && trong(m.tro.y, 0.85, 1.15) && trong(m.apUt.x, -0.38, -0.08) && trong(m.apUt.y, 0.75, 1.05)
    && trong(m.ut.x, -0.62, -0.25) && trong(m.ut.y, 0.55, 0.98) && trong(m.caiGoc.x, 0.2, 0.62) && trong(m.caiGoc.y, -0.08, 0.45)
    && trong(m.caiKhop.x, 0.35, 0.9) && trong(m.caiKhop.y, 0.2, 0.85) && m.tro.x > m.apUt.x && m.apUt.x > m.ut.x;
}

const iX = (x: number): number => (x - KHUNG_ANH.x0) * KHUNG_ANH.px - 0.5;
const jY = (y: number): number => (KHUNG_ANH.y1 - y) * KHUNG_ANH.px - 0.5;
const xI = (i: number): number => KHUNG_ANH.x0 + (i + 0.5) / KHUNG_ANH.px;
const yJ = (j: number): number => KHUNG_ANH.y1 - (j + 0.5) / KHUNG_ANH.px;

function mo(a: Float32Array, w: number, h: number, s: number): Float32Array {
  const r = Math.ceil(s * 3), k = Array.from({ length: 2 * r + 1 }, (_, t) => Math.exp(-((t - r) ** 2) / (2 * s * s)));
  const tong = k.reduce((x, y) => x + y, 0), tam = new Float32Array(a.length), ra = new Float32Array(a.length);
  const lay = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    let t = 0;
    for (let d = -r; d <= r; d++) t += (k[d + r] ?? 0) * (a[j * w + lay(i + d, 0, w - 1)] ?? 0);
    tam[j * w + i] = t / tong;
  }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    let t = 0;
    for (let d = -r; d <= r; d++) t += (k[d + r] ?? 0) * (tam[lay(j + d, 0, h - 1) * w + i] ?? 0);
    ra[j * w + i] = t / tong;
  }
  return ra;
}

/**
 * Ban do nep tren log do sang: tri rieng lon nhat cua Hessian (duong toi manh → duong) tru do doc, chuan hoa theo co, lay lon nhat hai
 * co; `A` la goc HUONG nep (radian, theo diem anh, j huong xuong) — vuong goc voi vector rieng cua tri rieng lon nhat.
 */
export function banDoNep(xam: Float32Array, w: number, h: number): { readonly R: Float32Array; readonly A: Float32Array } {
  const lg = Float32Array.from(xam, (v) => Math.log(v + 0.03));
  const R = new Float32Array(xam.length), A = new Float32Array(xam.length);
  for (const s of [1.5, 2.5]) {
    const g = mo(lg, w, h, s);
    for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
      const c = g[j * w + i] ?? 0;
      const xx = (g[j * w + i + 1] ?? 0) - 2 * c + (g[j * w + i - 1] ?? 0);
      const yy = (g[(j + 1) * w + i] ?? 0) - 2 * c + (g[(j - 1) * w + i] ?? 0);
      const xy = ((g[(j + 1) * w + i + 1] ?? 0) - (g[(j + 1) * w + i - 1] ?? 0) - (g[(j - 1) * w + i + 1] ?? 0) + (g[(j - 1) * w + i - 1] ?? 0)) / 4;
      const dx = ((g[j * w + i + 1] ?? 0) - (g[j * w + i - 1] ?? 0)) / 2, dy = ((g[(j + 1) * w + i] ?? 0) - (g[(j - 1) * w + i] ?? 0)) / 2;
      // Nep la rang hai ben sang, giua do doc ~0; vien tay la bac sang mot phia, do doc lon → tru di de vien khong thanh "nep".
      const l = ((xx + yy) / 2 + Math.sqrt(((xx - yy) / 2) ** 2 + xy * xy)) * s * s - 1.2 * Math.hypot(dx, dy) * s;
      if (l > (R[j * w + i] ?? 0)) {
        R[j * w + i] = l;
        A[j * w + i] = 0.5 * Math.atan2(2 * xy, xx - yy) + Math.PI / 2;
      }
    }
  }
  return { R, A };
}

/** Trong da giac (toa do diem anh). */
function trong(p: readonly [number, number][], i: number, j: number): boolean {
  let co = false;
  for (let a = 0, b = p.length - 1; a < p.length; b = a++) {
    const [xa, ya] = p[a] ?? [0, 0], [xb, yb] = p[b] ?? [0, 0];
    if ((ya > j) !== (yb > j) && i < ((xb - xa) * (j - ya)) / (yb - ya) + xa) co = !co;
  }
  return co;
}

/**
 * Quy hoach dong: duyet `buoc` buoc, moi buoc chon mot vi tri tuyet doi trong [lo, hi) cua truc kia; d = vi tri buoc nay − buoc truoc
 * (|d| ≤ 2), tru `phat(d)`. Diem moi o = `diem` × do hop huong (0,3 + 0,7·cos² goc giua huong nep tai o va huong buoc di — nep cat
 * ngang duong chi duoc 0,3); o bi cam (diem < 0) giu nguyen. Tra vi tri tung buoc.
 */
function quyHoach(buoc: number, lo: (b: number) => number, hi: (b: number) => number, diem: (b: number, v: number) => number,
  phat: (d: number) => number, viTri: (b: number, v: number) => readonly [number, number], huong: (b: number, v: number) => number): number[] {
  const tot: Float32Array[] = [], tu: Int16Array[] = [];
  for (let b = 0; b < buoc; b++) {
    const l = lo(b), n = Math.max(1, hi(b) - l), t = new Float32Array(n), f = new Int16Array(n);
    for (let o = 0; o < n; o++) {
      const v = l + o, d0 = diem(b, v), [ci, cj] = viTri(b, v), a = huong(b, v);
      let best = -Infinity, from = 0;
      if (b === 0) best = d0 > 0 ? d0 * 0.65 : d0;
      else {
        const lt = lo(b - 1), truoc = tot[b - 1] ?? new Float32Array(1);
        for (let d = -2; d <= 2; d++) {
          const q = v - d - lt;
          if (q < 0 || q >= truoc.length) continue;
          const [pi, pj] = viTri(b - 1, v - d), c = Math.cos(a - Math.atan2(cj - pj, ci - pi));
          const s = (truoc[q] ?? 0) - phat(d) + (d0 > 0 ? d0 * (0.3 + 0.7 * c * c) : d0);
          if (s > best) { best = s; from = q; }
        }
        if (best === -Infinity) { best = Math.max(...truoc) + d0; from = truoc.indexOf(Math.max(...truoc)); }
      }
      t[o] = best;
      f[o] = from;
    }
    tot.push(t);
    tu.push(f);
  }
  const cuoi = tot[buoc - 1] ?? new Float32Array(1);
  let o = cuoi.indexOf(Math.max(...cuoi));
  const ra = new Array<number>(buoc);
  for (let b = buoc - 1; b >= 0; b--) {
    ra[b] = lo(b) + o;
    o = tu[b]?.[o] ?? 0;
  }
  return ra;
}

/**
 * Doan nep: cac doan lien tuc tren nguong (cho phep ho ≤ `ho` buoc), lay doan tong nep lon nhat trong so doan bat dau truoc buoc
 * `batDauToiDa` (neo dau duong: duong tinh tu mep ngon ut, duong tri tu dau duong doi…). Dao (khuc lien tren nguong) o hai dau yeu hon
 * nua phan con lai thi bo — vet chay qua dau nep that, nhat vai diem van da vua qua nguong (thuoc tong hop 06/11: vet doi, vet tinh vuot
 * dau nep 0,08–0,11 L → o dai / ngan lech ve "dai"). Tra [dau, cuoi, ho lon nhat] hay null.
 */
function doanNep(r: readonly number[], nguong: number, ho: number, batDauToiDa = Infinity): [number, number, number] | null {
  let tot: [number, number, number] | null = null, totTong = 0;
  for (let a = 0; a < r.length && a <= batDauToiDa; a++) {
    if ((r[a] ?? 0) < nguong) continue;
    const dao: { d: number; c: number; t: number }[] = []; // dau, cuoi, tong nep
    let k = a;
    for (;;) {
      const d = k;
      let t = 0;
      while (k < r.length && (r[k] ?? 0) >= nguong) t += r[k++] ?? 0;
      dao.push({ d, c: k - 1, t });
      let g = 0;
      while (k + g < r.length && (r[k + g] ?? 0) < nguong) g++;
      if (k + g >= r.length || g > ho) break;
      k += g;
    }
    const tb = (i: number, j: number): number => { // nep trung binh cac dao i..j
      let t = 0, n = 0;
      for (const q of dao.slice(i, j + 1)) { t += q.t; n += q.c - q.d + 1; }
      return t / Math.max(1, n);
    };
    let i0 = 0, i1 = dao.length - 1;
    while (i1 > i0 && tb(i1, i1) < 0.35 * tb(i0, i1 - 1)) i1--;
    while (i0 < i1 && tb(i0, i0) < 0.35 * tb(i0 + 1, i1)) i0++;
    const giu = dao.slice(i0, i1 + 1), dau = giu[0], cuoi = giu[giu.length - 1];
    const tong = giu.reduce((x, q) => x + q.t, 0), hoLon = Math.max(0, ...giu.slice(1).map((q, m) => q.d - (giu[m]?.c ?? q.d) - 1));
    if (dau !== undefined && cuoi !== undefined && tong > totTong) { tot = [dau.d, cuoi.c, hoLon]; totTong = tong; }
    a = dao[dao.length - 1]?.c ?? a;
  }
  return tot;
}

/** Lam muot vet de ve (trung binh truot 7 diem); o tinh tren vet tho. */
function muot(v: readonly Diem[]): Diem[] {
  return v.map((_, k) => {
    const ds = v.slice(Math.max(0, k - 3), k + 4);
    return { x: ds.reduce((t, p) => t + p.x, 0) / ds.length, y: ds.reduce((t, p) => t + p.y, 0) / ds.length };
  });
}

/** Xep vao hai bac theo nguong; trong dai ± `bien` quanh nguong thi null (khong chac — de trong cho nguoi xem). */
const bac = <A, B>(v: number, nguong: number, bien: number, duoi: A, tren: B): A | B | null =>
  (Math.abs(v - nguong) < bien ? null : v < nguong ? duoi : tren);

const NHO = 1e-6;

export function doChiTay(xam: Float32Array, moc: MocTay): KetQuaDo {
  const w = RONG, h = CAO, { R, A } = banDoNep(xam, w, h), px = KHUNG_ANH.px;
  // Vung long ban tay theo moc: canh tren day len 0,08 L (duong tinh hay nam ngang moc goc ngon — MediaPipe dat moc thap hon nep goc
  // ngon); phia ngon cai di theo mep ke ngon cai – ngon tro (khong lay khop ngon cai: o ngoai long tay); phia ngon ut phinh ra theo go
  // duoi ngon ut (canh thang co tay → goc ngon ut cat mat go nay, noi duoi duong tri, chan duong su nghiep hay nam — thu anh tong hop).
  const len = (p: Diem): Diem => ({ x: p.x, y: p.y + 0.08 });
  const vien = [moc.co, moc.caiGoc, { x: moc.caiKhop.x - 0.08, y: moc.caiKhop.y + 0.05 },
    { x: moc.tro.x + 0.1, y: (moc.caiKhop.y + moc.tro.y) / 2 + 0.1 }, len(moc.tro), len(moc.giua), len(moc.apUt), len(moc.ut),
    { x: moc.ut.x - 0.03, y: 0.35 }, { x: moc.ut.x * 0.6, y: 0.03 }].map((p): [number, number] => [iX(p.x), jY(p.y)]);
  const trongTay = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) trongTay[j * w + i] = trong(vien, i, j) ? 1 : 0;
  const o = (i: number, j: number): number => { const ii = Math.round(i), jj = Math.round(j); return ii < 0 || jj < 0 || ii >= w || jj >= h ? -1 : jj * w + ii; };
  const nep = (i: number, j: number): number => { const k = o(i, j); return k < 0 || trongTay[k] !== 1 ? 0 : R[k] ?? 0; };
  const huongO = (i: number, j: number): number => { const k = o(i, j); return k < 0 ? 0 : A[k] ?? 0; };
  const tatCa: number[] = [];
  for (let k = 0; k < w * h; k++) if (trongTay[k] === 1) tatCa.push(R[k] ?? 0);
  tatCa.sort((a, b) => a - b);
  // Nguong nep: phan vi 90 trong long ban tay (nep chinh la cau truc manh nhat; van da, chi nho nam duoi).
  const nguong = Math.max(NHO, tatCa[Math.floor(tatCa.length * 0.9)] ?? 0);
  // Ranh "ro, sau": trung binh doan nep tu phan vi 97 trong long ban tay tro len.
  const ranh = tatCa[Math.floor(tatCa.length * 0.97)] ?? nguong;
  const mcpY = (x: number): number => { // duong goc ngon (gay khuc qua 17-13-9-5) tai hoanh do x
    const ds = [moc.ut, moc.apUt, moc.giua, moc.tro];
    for (let k = 0; k < ds.length - 1; k++) {
      const a = ds[k], b = ds[k + 1];
      if (a !== undefined && b !== undefined && (x <= b.x || k === ds.length - 2)) return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x || NHO);
    }
    return moc.tro.y;
  };
  const ho = (L: number): number => Math.round(L * px);
  /** Diem nep mot o cho quy hoach: chan tran 2,5 lan nguong — nep gap rat dam (khe ngon cai) khong duoc lan at duong that (do 06/11). */
  const diemNep = (i: number, j: number): number => Math.min(2.5, nep(i, j) / nguong);

  // 1) Duong doi: theo goc quanh tam go ngon cai (giua moc 1, 2, lech 0,05 L ve phia ngon cai), goc 95°→230°, ban kinh 0,15–0,65 L
  // (do 06/11: duong doi that co khi la cung rong, ban kinh ~0,5 L). Chi cong nep chay doc cung (bo nep nhan go ngon cai cat ngang).
  const tamDoi = { x: (moc.caiGoc.x + moc.caiKhop.x) / 2 + 0.05, y: (moc.caiGoc.y + moc.caiKhop.y) / 2 };
  const GOC = 135;
  const diemDoi = (b: number, k: number): Diem => {
    const g = ((95 + b) * Math.PI) / 180, r = 0.15 + k / px;
    return { x: tamDoi.x + r * Math.cos(g), y: tamDoi.y + r * Math.sin(g) };
  };
  const viTriDoi = (b: number, k: number): readonly [number, number] => { const p = diemDoi(b, k); return [iX(p.x), jY(p.y)]; };
  // Phat doi ban kinh 0,6 / diem anh (ma cu 0,5; 1,0 thi duong doi cung rong bi cat giua chung — do 06/11).
  const doiK = quyHoach(GOC, () => 0, () => Math.round(0.5 * px), (b, k) => { const [i, j] = viTriDoi(b, k); return diemNep(i, j); },
    (d) => 0.6 * Math.abs(d), viTriDoi, (b, k) => { const [i, j] = viTriDoi(b, k); return huongO(i, j); });
  const rDoi = doiK.map((k, b) => { const [i, j] = viTriDoi(b, k); return nep(i, j); });
  const dDoi = doanNep(rDoi, nguong, 12, 0.4 * GOC);
  const vDoi = vet(dDoi, (b) => diemDoi(b, doiK[b] ?? 0));
  const sDoi = vDoi[0];
  /** Trong vong duong doi (go ngon cai): ban kinh nho hon ban kinh duong doi o cung goc. */
  const trongGo = (p: Diem): boolean => {
    const g = (Math.atan2(p.y - tamDoi.y, p.x - tamDoi.x) * 180) / Math.PI, b = Math.round((g < 0 ? g + 360 : g) - 95);
    return b >= 0 && b < GOC && Math.hypot(p.x - tamDoi.x, p.y - tamDoi.y) < 0.15 + (doiK[b] ?? 0) / px - 0.02;
  };

  // 2) Duong tri: cot tu dau duong doi (hay qua ngon tro) sang mep ngon ut, tu duoi duong goc ngon 0,10 L toi y = 0,25 L, khong vao go
  // ngon cai; doc xuong ve phia ngon ut thi phat nhe, nguoc len phat nang (ma cu 01/11 dao chieu hai muc phat nay). Doan phai bat dau
  // trong 35 % dau (phia ngon cai).
  const triI0 = Math.round(iX(Math.min(moc.tro.x + 0.12, (sDoi?.x ?? moc.tro.x) + 0.04))), triI1 = Math.round(iX(moc.ut.x - 0.1));
  const nTri = Math.max(1, triI0 - triI1);
  // Duong tri nam TREN duong doi (o moi cot ma duong doi di qua: cao hon diem cao nhat cua duong doi ≥ 0,015 L) — khong bam nep gap
  // khe ngon cai (do 06/11: anh "Right Hand Palm" duong tri bam nep nay, duong tinh truot theo).
  const doiTren = new Map<number, number>();
  for (const q of vDoi) { const i = Math.round(iX(q.x)), j = jY(q.y); doiTren.set(i, Math.min(doiTren.get(i) ?? Infinity, j)); }
  // Gan dau duong doi (≤ 0,10 L theo chieu ngang) thi tha: hai duong hay chung dau ("dau dinh") roi tach dan.
  const triHi = (b: number): number => {
    const tha = sDoi !== undefined && xI(triI0 - b) > sDoi.x - 0.1;
    const lo = Math.round(jY(mcpY(xI(triI0 - b)) - 0.1)), d = tha ? undefined : doiTren.get(triI0 - b), duoi = Math.round(jY(0.25));
    return Math.max(lo + 2, d === undefined ? duoi : Math.min(duoi, Math.round(d - 0.015 * px)));
  };
  const triJ = quyHoach(nTri, (b) => Math.round(jY(mcpY(xI(triI0 - b)) - 0.1)), triHi,
    (b, j) => (trongGo({ x: xI(triI0 - b), y: yJ(j) }) ? -1 : diemNep(triI0 - b, j)), (d) => (d > 0 ? 0.4 * d : 1.0 * -d),
    (b, j) => [triI0 - b, j], (b, j) => huongO(triI0 - b, j));
  const rTri = triJ.map((j, b) => (trongGo({ x: xI(triI0 - b), y: yJ(j) }) ? 0 : nep(triI0 - b, j)));
  const dTri0 = doanNep(rTri, nguong, ho(0.08), 0.35 * nTri);
  /** Hang (j) cua duong tri tai cot i — chi trong doan nep `d`. */
  const taiTheo = (d: [number, number, number] | null) => (i: number): number | undefined => {
    const b = triI0 - i;
    return d === null || b < d[0] || b > d[1] ? undefined : triJ[b];
  };

  // 3) Duong tinh: cot tu mep ngon ut toi qua goc ngon tro 0,06 L, dai tu tren duong goc ngon 0,06 L xuong 0,30 L (phia ngon ut) nong dan
  // con 0,18 L (phia ngon tro — dap an 06/11: duong tinh o day chi cach goc ngon ~0,08 L), VA cach tren duong tri ≥ 0,05 L (ma cu tim
  // duong tinh truoc nen nua phia ngon tro hay nhay sang duong tri). Cong len ve phia ngon tro thi phat nhe, troi xuong phat nang.
  // Doan phai bat dau trong 35 % dau (mep ngon ut). `tai`: duong tri dang giu (cot nao khong co duong tri thi khong buoc).
  const tinhI0 = Math.round(iX(moc.ut.x - 0.1)), tinhI1 = Math.round(iX(moc.tro.x + 0.06)), nTinh = Math.max(1, tinhI1 - tinhI0);
  const tinhLo = (b: number): number => Math.round(jY(mcpY(xI(tinhI0 + b)) + 0.06));
  const sauTinh = (x: number): number => 0.3 - 0.12 * Math.min(1, Math.max(0, (x - moc.ut.x) / (moc.tro.x - moc.ut.x || NHO)));
  const timTinh = (tai: (i: number) => number | undefined): { J: number[]; r: number[]; d: [number, number, number] | null } => {
    const hi = (b: number): number => {
      const x = xI(tinhI0 + b), t = tai(tinhI0 + b), duoi = Math.round(jY(mcpY(x) - sauTinh(x)));
      return Math.max(tinhLo(b) + 2, t === undefined ? duoi : Math.min(duoi, Math.round(t - 0.05 * px)));
    };
    const J = quyHoach(nTinh, tinhLo, hi, (b, j) => diemNep(tinhI0 + b, j), (d) => (d < 0 ? 0.4 * -d : 1.0 * d),
      (b, j) => [tinhI0 + b, j], (b, j) => huongO(tinhI0 + b, j));
    const r = J.map((j, b) => nep(tinhI0 + b, j));
    return { J, r, d: doanNep(r, nguong, ho(0.08), 0.35 * nTinh) };
  };

  // Duoi vong (ke hoach 2026-11-06-duoi-duong-tri.md): quy hoach bat vet tri di du moi cot toi mep ngon ut — het nep tri van phai bam nep
  // khac (anh "Right Hand Palm": vet xuong thap nhat roi vong nguoc len 0,10 L, chay theo dau duong tinh toi mep tay; duong tinh bi day len).
  // Cho thap nhat cua vet (sau 30 % dau) ma sau do vet vong len ≥ 0,05 L (sau cho thap nhat vet khong xuong lai duoc nua) → do lai duong
  // tinh khi bo duoi; duong tinh chay doc duoi (chung ≥ 0,10 L, cach ≤ 0,03 L) thi duoi la cua duong tinh: duong tri dung o cho thap
  // nhat. Khong chung → giu duoi (co the la duong tri cong len that — it gap), o "dai" duong tri de trong. Khong co duoi vong: nhu cu.
  const kCat = ((): number | undefined => {
    if (dTri0 === null) return undefined;
    const y = Array.from({ length: dTri0[1] - dTri0[0] + 1 }, (_, k) => yJ(triJ[dTri0[0] + k] ?? 0));
    const kMin = y.lastIndexOf(Math.min(...y));
    return kMin >= 0.3 * y.length && Math.max(...y.slice(kMin)) - (y[kMin] ?? 0) >= 0.05 ? kMin : undefined;
  })();
  let dTri = dTri0, tinh = timTinh(taiTheo(dTri0)), duoiNgo = false;
  if (dTri0 !== null && kCat !== undefined) {
    let c = dTri0[0] + kCat, hoLon = 0, g = 0;
    while (c > dTri0[0] && (rTri[c] ?? 0) < nguong) c--;
    for (let b = dTri0[0]; b <= c; b++) { g = (rTri[b] ?? 0) < nguong ? g + 1 : 0; hoLon = Math.max(hoLon, g); }
    const dCat: [number, number, number] = [dTri0[0], c, hoLon], t2 = timTinh(taiTheo(dCat));
    let chung = 0;
    for (let b = c + 1; b <= dTri0[1]; b++) {
      const bt = triI0 - b - tinhI0, jt = t2.d !== null && bt >= t2.d[0] && bt <= t2.d[1] ? t2.J[bt] : undefined;
      if (jt !== undefined && Math.abs(jt - (triJ[b] ?? 0)) <= 0.03 * px) chung += 1;
    }
    if (chung / px >= 0.1) { dTri = dCat; tinh = t2; } else duoiNgo = true;
  }
  const vTri = vet(dTri, (b) => ({ x: xI(triI0 - b), y: yJ(triJ[b] ?? 0) }));
  const { J: tinhJ, r: rTinh, d: dTinh } = tinh;
  const vTinh = vet(dTinh, (b) => ({ x: xI(tinhI0 + b), y: yJ(tinhJ[b] ?? 0) }));

  // 4) Duong su nghiep: hang tu tren co tay len, lech truc giua ≤ 0,22 L, toi duoi goc ngon; cam di sat duong doi (≤ 0,07 L) — tinh ca
  // phan duong quy hoach cua duong doi ngoai doan nep da giu (doan nep dut giua chung thi su nghiep hay chiem phan duoi duong doi).
  const doiDu = doiK.map((k, b) => diemDoi(b, k)).filter((q, b) => b >= (dDoi?.[0] ?? 0) && Math.abs(q.x) < 1 && q.y > 0);
  const ganDoi = (p: Diem): boolean => trongGo(p) || doiDu.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 0.07);
  const suJ0 = Math.round(jY(0.05)), suJ1 = Math.round(jY(mcpY(moc.giua.x) - 0.08));
  const suI = quyHoach(Math.max(1, suJ0 - suJ1), () => Math.round(iX(moc.giua.x - 0.22)), () => Math.round(iX(moc.giua.x + 0.22)),
    (b, i) => (ganDoi({ x: xI(i), y: yJ(suJ0 - b) }) ? -1 : diemNep(i, suJ0 - b)), (d) => 0.8 * Math.abs(d),
    (b, i) => [i, suJ0 - b], (b, i) => huongO(i, suJ0 - b));
  const rSu = suI.map((i, b) => (ganDoi({ x: xI(i), y: yJ(suJ0 - b) }) ? 0 : nep(i, suJ0 - b)));
  const dSu = doanNep(rSu, nguong, ho(0.06));
  const vSu = vet(dSu, (b) => ({ x: xI(suI[b] ?? 0), y: yJ(suJ0 - b) }));

  // Do ro: doan ngan hon nguong dai coi nhu khong thay; trung binh nep so voi ranh "ro"; sat nguong (± 25 % do dai, ± 12 % do nep) → null.
  const tbDoan = (r: readonly number[], d: [number, number, number] | null): number =>
    (d === null ? 0 : r.slice(d[0], d[1] + 1).reduce((a, b) => a + b, 0) / (d[1] - d[0] + 1));
  const ro = (r: readonly number[], d: [number, number, number] | null, buocL: number, toiThieu = 0.15): 'clear' | 'faint' | 'none' | null => {
    const dai = d === null ? 0 : (d[1] - d[0]) * buocL;
    if (dai < 0.75 * toiThieu) return 'none';
    if (dai < 1.25 * toiThieu) return null;
    return bac(tbDoan(r, d) / ranh, 1, 0.12, 'faint', 'clear');
  };
  const dut = (d: [number, number, number] | null): boolean | null => (d === null ? null : bac(d[2] / px, 0.05, 0.015, false, true));
  const buocGoc = (Math.PI / 180) * 0.4; // ~ do dai mot do tren cung ban kinh 0,4 L
  const cuoi = (v: readonly Diem[]): Diem | undefined => v[v.length - 1];
  const eTinh = cuoi(vTinh), sTri = vTri[0], eTri = cuoi(vTri), eDoi = cuoi(vDoi), sSu = vSu[0];
  const roTinh = ro(rTinh, dTinh, 1 / px), roTri = ro(rTri, dTri, 1 / px);

  // Chi tay ngang: tren duong tri KHONG co duong tinh rieng, ma duong tri ro, chay toi phia ngon ut va o dau ngon ut van cao (cach duong
  // goc ngon ≤ 0,30 L — duong tri thuong cuoi thap hon nhieu). Ma cu 01/11 bao chi tay ngang 4/7 anh mau (dang le hiem), nen siet.
  // "Khong co duong tinh rieng": khong thay doan nao, hoac doan tim duoc yeu hon 0,45 lan duong tri (nhieu nen); 0,45–0,6 la sat ranh.
  const caoCuoi = eTri === undefined ? Infinity : mcpY(eTri.x) - eTri.y;
  const tyTinh = tbDoan(rTinh, dTinh) / (tbDoan(rTri, dTri) || NHO);
  const tinhVang = roTinh === 'none' || tyTinh < 0.45, tinhNgo = roTinh === null || (tyTinh >= 0.45 && tyTinh < 0.6);
  const toiUt = eTri !== undefined && eTri.x <= moc.apUt.x;
  // Chi tay ngang that la MOT nep gan thang (anh mau 06/11: lech khoi day cung 0,03 L). Vet tri gay khuc — hai nep noi nhau, nua phia
  // ngon cai nam ngang, nua phia ngon ut do xuong (anh "Hand female 2/3": lech 0,11 L) — co the la duong tri chiem mat duong tinh → chi
  // de trong. Thang < 0,045 L; 0,045–0,085 sat ranh; tu 0,085 la gay.
  const lechTri = sTri === undefined || eTri === undefined ? Infinity : Math.max(...vTri.map((q) =>
    Math.abs((q.x - sTri.x) * (eTri.y - sTri.y) - (q.y - sTri.y) * (eTri.x - sTri.x)) / (Math.hypot(eTri.x - sTri.x, eTri.y - sTri.y) || NHO)));
  const ngangDu = roTri === 'clear' && toiUt && caoCuoi <= 0.3 && bac(lechTri, 0.065, 0.02, true, false) === true;
  const ngangNgo = roTri === null || (toiUt && caoCuoi <= 0.36 && !ngangDu);
  const ngang: boolean | null = tinhVang ? (ngangDu ? true : ngangNgo ? null : false) : tinhNgo && ngangDu ? null : false;
  // Su nghiep: doan dai ≥ 0,25 L va manh ≥ nua trung vi ba duong chinh — van da nhieu de thanh doan doc yeu giua long tay.
  const chinh = [tbDoan(rTinh, dTinh), tbDoan(rTri, dTri), tbDoan(rDoi, dDoi)].sort((x, y) => x - y)[1] ?? 0;
  const tySu = tbDoan(rSu, dSu) / (chinh || NHO);
  const roSu = tySu < 0.4 ? 'none' : tySu < 0.6 ? null : ro(rSu, dSu, 1 / px, 0.25);
  /** Co duong su nghiep chac (du manh, du dai) — xet duoc diem moc, dut, ke ca khi ro / mo con sat ranh. */
  const coSu = roSu === 'clear' || roSu === 'faint' || (roSu === null && tySu >= 0.6 && dSu !== null && (dSu[1] - dSu[0]) / px >= 0.32);
  const vTinhVe = ngang === true ? vTri : vTinh;
  const eT = ngang === true ? eTri : eTinh, roT = ngang === true ? roTri : roTinh;
  const tLen = eT === undefined ? 0 : (eT.x - moc.giua.x) / (moc.tro.x - moc.giua.x || NHO);
  const dauTri = sTri, cuoiTri = eTri;
  const daiTri = cuoiTri === undefined || duoiNgo ? null : ((): 'long' | 'medium' | 'short' | null => {
    const dai = moc.ut.x + 0.25 * (moc.apUt.x - moc.ut.x), ngan = (moc.giua.x + moc.apUt.x) / 2;
    if (Math.abs(cuoiTri.x - dai) < 0.04 || Math.abs(cuoiTri.x - ngan) < 0.04) return null;
    return cuoiTri.x <= dai ? 'long' : cuoiTri.x >= ngan ? 'short' : 'medium';
  })();
  const daiDoi = eDoi === undefined ? null : Math.abs(eDoi.y - 0.15) < 0.04 || Math.abs(eDoi.y - 0.45) < 0.04 ? null
    : eDoi.y <= 0.15 ? 'long' : eDoi.y >= 0.45 ? 'short' : 'medium';
  const daiTinh = eT === undefined ? null : Math.abs(tLen - 0.75) < 0.1 || Math.abs(tLen - 0.25) < 0.1 ? null
    : tLen >= 0.75 ? 'long' : tLen >= 0.25 ? 'medium' : 'short';
  const dauSu = sSu === undefined || !coSu ? null : ((): 'life' | 'wrist' | 'middle' | null => {
    const kcDoi = Math.min(Infinity, ...vDoi.map((p) => Math.hypot(p.x - sSu.x, p.y - sSu.y)));
    if (Math.abs(kcDoi - 0.1) < 0.02 || (kcDoi > 0.1 && Math.abs(sSu.y - 0.2) < 0.03)) return null;
    return kcDoi < 0.1 ? 'life' : sSu.y <= 0.2 ? 'wrist' : 'middle';
  })();

  const khung: KhungChiTay = {
    simian: ngang,
    duong: {
      life: { seen: ro(rDoi, dDoi, buocGoc), length: daiDoi,
        arc: vDoi.length === 0 ? null : bac(Math.min(...vDoi.map((p) => p.x)), moc.giua.x + 0.1, 0.04, 'wide', 'narrow'), broken: dut(dDoi) },
      head: { seen: roTri, length: daiTri,
        shape: dauTri === undefined || cuoiTri === undefined ? null : bac(dauTri.y - cuoiTri.y, 0.15, 0.04, 'straight', 'curved'),
        joined: dauTri === undefined || sDoi === undefined ? null : bac(Math.hypot(dauTri.x - sDoi.x, dauTri.y - sDoi.y), 0.1, 0.03, true, false),
        broken: dut(dTri) },
      heart: { seen: roT, length: daiTinh, broken: ngang === true ? dut(dTri) : dut(dTinh) },
      fate: { seen: roSu, start: dauSu, broken: coSu ? dut(dSu) : null },
    },
  };
  return { khung, vet: { life: muot(vDoi), head: muot(vTri), heart: muot(vTinhVe), fate: coSu ? muot(vSu) : [] } };
}

function vet(d: [number, number, number] | null, diem: (b: number) => Diem): Diem[] {
  return d === null ? [] : Array.from({ length: d[1] - d[0] + 1 }, (_, k) => diem(d[0] + k));
}
