/**
 * May tu do chi tay tren anh (dot 7 phan 3): nhan anh xam long ban tay DA DUA VE KHUNG CHUAN (giaoDien lo MediaPipe + canvas) cung
 * moc ngon tay, tim 4 duong roi xep o cua `KHUNG` (`chiTay.ts`) de nguoi xem xac nhan, sua. Cach lam: ban do "nep toi manh" (tri
 * rieng lon nhat cua ma tran Hessian, hai co) → moi duong mot quy hoach dong trong vung sach ta (duong tinh, tri: theo cot; duong
 * doi: theo goc quanh go ngon cai; su nghiep: theo hang) → doan con nep that (tren nguong) → do o. Thuan: khong trinh duyet, dong
 * ho, ngau nhien. Nguong dat theo 5 anh mau (QUY_UOC muc 27).
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
  /** Doan nep may thay cua tung duong (rong = khong thay), de ve de len anh. */
  readonly vet: { readonly life: readonly Diem[]; readonly head: readonly Diem[]; readonly heart: readonly Diem[]; readonly fate: readonly Diem[] };
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

/** Ban do nep: tri rieng lon nhat cua Hessian (duong toi manh → duong) tru do doc sang, chuan hoa theo co, lay lon nhat hai co. */
export function banDoNep(xam: Float32Array, w: number, h: number): Float32Array {
  const ra = new Float32Array(xam.length);
  for (const s of [1.5, 2.5]) {
    const g = mo(xam, w, h, s);
    for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
      const c = g[j * w + i] ?? 0;
      const xx = (g[j * w + i + 1] ?? 0) - 2 * c + (g[j * w + i - 1] ?? 0);
      const yy = (g[(j + 1) * w + i] ?? 0) - 2 * c + (g[(j - 1) * w + i] ?? 0);
      const xy = ((g[(j + 1) * w + i + 1] ?? 0) - (g[(j + 1) * w + i - 1] ?? 0) - (g[(j - 1) * w + i + 1] ?? 0) + (g[(j - 1) * w + i - 1] ?? 0)) / 4;
      const dx = ((g[j * w + i + 1] ?? 0) - (g[j * w + i - 1] ?? 0)) / 2, dy = ((g[(j + 1) * w + i] ?? 0) - (g[(j - 1) * w + i] ?? 0)) / 2;
      // Nep la rang hai ben sang, giua do doc ~0; vien tay la bac sang mot phia, do doc lon → tru di de vien khong thanh "nep".
      const l = ((xx + yy) / 2 + Math.sqrt(((xx - yy) / 2) ** 2 + xy * xy)) * s * s - 1.2 * Math.hypot(dx, dy) * s;
      if (l > (ra[j * w + i] ?? 0)) ra[j * w + i] = l;
    }
  }
  return ra;
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
 * Quy hoach dong: duyet `buoc` buoc (cot, hang hay goc), moi buoc chon mot o trong [lo, hi) cua truc kia, cong diem nep, tru
 * `phat(d)` khi nhay d o (|d| ≤ 2; phat lech mot chieu de duong cong dung huong sach ta). Tra chi so o tung buoc.
 */
function quyHoach(buoc: number, lo: (b: number) => number, hi: (b: number) => number, diem: (b: number, o: number) => number,
  phat: (d: number) => number): number[] {
  const tot: Float32Array[] = [], tu: Int16Array[] = [];
  for (let b = 0; b < buoc; b++) {
    const l = lo(b), n = Math.max(1, hi(b) - l), t = new Float32Array(n), f = new Int16Array(n);
    for (let o = 0; o < n; o++) {
      let best = b === 0 ? 0 : -Infinity, from = 0;
      if (b > 0) {
        const lt = lo(b - 1), truoc = tot[b - 1] ?? new Float32Array(1);
        for (let d = -2; d <= 2; d++) {
          const q = l + o + d - lt;
          if (q < 0 || q >= truoc.length) continue;
          const v = (truoc[q] ?? 0) - phat(d);
          if (v > best) { best = v; from = q; }
        }
        if (best === -Infinity) { best = Math.max(...truoc); from = truoc.indexOf(best); }
      }
      t[o] = best + diem(b, l + o);
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
 * `batDauToiDa` (neo dau duong: duong tinh tu mep ngon ut, duong tri tu dau duong doi…). Tra [dau, cuoi, ho lon nhat] hay null.
 */
function doanNep(r: readonly number[], nguong: number, ho: number, batDauToiDa = Infinity): [number, number, number] | null {
  let tot: [number, number, number] | null = null, totTong = 0;
  for (let a = 0; a < r.length && a <= batDauToiDa; a++) {
    if ((r[a] ?? 0) < nguong) continue;
    let b = a, hoLon = 0, k = a, tong = 0;
    while (k < r.length) {
      let g = 0;
      while (k + g < r.length && (r[k + g] ?? 0) < nguong) g++;
      if (k + g >= r.length || g > ho) break;
      hoLon = Math.max(hoLon, g);
      k += g;
      while (k < r.length && (r[k] ?? 0) >= nguong) tong += r[k++] ?? 0;
      b = k - 1;
    }
    if (tong > totTong) { tot = [a, b, hoLon]; totTong = tong; }
    a = b;
  }
  return tot;
}

const NHO = 1e-6;

export function doChiTay(xam: Float32Array, moc: MocTay): KetQuaDo {
  const w = RONG, h = CAO, R = banDoNep(xam, w, h), px = KHUNG_ANH.px;
  // Vung long ban tay theo moc: canh tren day len 0,08 L (duong tinh hay nam ngang moc goc ngon — MediaPipe dat moc thap hon nep goc
  // ngon); phia ngon cai di theo mep ke ngon cai – ngon tro (khong lay khop ngon cai: o ngoai long tay); phia ngon ut phinh ra theo go
  // duoi ngon ut (canh thang co tay → goc ngon ut cat mat go nay, noi duoi duong tri, chan duong su nghiep hay nam — thu anh tong hop).
  const len = (p: Diem): Diem => ({ x: p.x, y: p.y + 0.08 });
  const vien = [moc.co, moc.caiGoc, { x: moc.caiKhop.x - 0.08, y: moc.caiKhop.y + 0.05 },
    { x: moc.tro.x + 0.1, y: (moc.caiKhop.y + moc.tro.y) / 2 + 0.1 }, len(moc.tro), len(moc.giua), len(moc.apUt), len(moc.ut),
    { x: moc.ut.x - 0.03, y: 0.35 }, { x: moc.ut.x * 0.6, y: 0.03 }].map((p): [number, number] => [iX(p.x), jY(p.y)]);
  const trongTay = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) trongTay[j * w + i] = trong(vien, i, j) ? 1 : 0;
  const nep = (i: number, j: number): number => {
    const ii = Math.round(i), jj = Math.round(j);
    return ii < 0 || jj < 0 || ii >= w || jj >= h || trongTay[jj * w + ii] !== 1 ? 0 : R[jj * w + ii] ?? 0;
  };
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

  // Duong tinh: cot tu mep ngon ut sang qua ngon tro toi gan mep ngon cai (de bat ca chi tay ngang), dai +0,06 … −0,30 L quanh moc;
  // di ve phia ngon tro thi duoc cong len (phat nhe), troi xuong bi phat nang. Doan phai bat dau trong 35 % dau (mep ngon ut).
  const tinhI0 = Math.round(iX(moc.ut.x - 0.1)), tinhI1 = Math.round(iX(moc.tro.x + 0.18)), nTinh = tinhI1 - tinhI0;
  const tinhJ = quyHoach(nTinh, (b) => Math.round(jY(mcpY(xI(tinhI0 + b)) + 0.06)), (b) => Math.round(jY(mcpY(xI(tinhI0 + b)) - 0.3)),
    (b, j) => nep(tinhI0 + b, j) / nguong, (d) => (d > 0 ? 1.0 * d : 0.4 * -d));
  const rTinh = tinhJ.map((j, b) => nep(tinhI0 + b, j));
  const dTinh = doanNep(rTinh, nguong, ho(0.08), 0.35 * nTinh);
  const vTinh = vet(dTinh, (b) => ({ x: xI(tinhI0 + b), y: yJ(tinhJ[b] ?? 0) }));

  // Duong doi: theo goc quanh tam go ngon cai (giua moc 1, 2, lech vao long tay 0,05 L), goc 95°→230°, ban kinh 0,15–0,65 L.
  const tamDoi = { x: (moc.caiGoc.x + moc.caiKhop.x) / 2 + 0.05, y: (moc.caiGoc.y + moc.caiKhop.y) / 2 };
  const GOC = 135;
  const diemDoi = (b: number, k: number): Diem => {
    const g = ((95 + b) * Math.PI) / 180, r = 0.15 + k / px;
    return { x: tamDoi.x + r * Math.cos(g), y: tamDoi.y + r * Math.sin(g) };
  };
  const doiK = quyHoach(GOC, () => 0, () => Math.round(0.5 * px), (b, k) => { const p = diemDoi(b, k); return nep(iX(p.x), jY(p.y)) / nguong; },
    (d) => 0.5 * Math.abs(d));
  const rDoi = doiK.map((k, b) => { const p = diemDoi(b, k); return nep(iX(p.x), jY(p.y)); });
  const dDoi = doanNep(rDoi, nguong, 8, 0.4 * GOC);
  const vDoi = vet(dDoi, (b) => diemDoi(b, doiK[b] ?? 0));
  const sDoi = vDoi[0];
  /** Trong vong duong doi (go ngon cai): ban kinh nho hon ban kinh duong doi o cung goc. */
  const trongGo = (p: Diem): boolean => {
    const g = (Math.atan2(p.y - tamDoi.y, p.x - tamDoi.x) * 180) / Math.PI, b = Math.round((g < 0 ? g + 360 : g) - 95);
    return b >= 0 && b < GOC && Math.hypot(p.x - tamDoi.x, p.y - tamDoi.y) < 0.15 + (doiK[b] ?? 0) / px - 0.02;
  };

  // Duong tri: cot tu dau duong doi (hay qua ngon tro) sang mep ngon ut, duoi duong tinh ≥ 0,06 L, tren 0,25 L; di ve phia ngon ut
  // thi duoc doc xuong (phat nhe), nguoc len bi phat nang. Doan phai bat dau trong 35 % dau (phia ngon cai).
  const triI0 = Math.round(iX(Math.min(moc.tro.x + 0.12, (sDoi?.x ?? moc.tro.x) + 0.04))), triI1 = Math.round(iX(moc.ut.x - 0.1));
  const nTri = triI0 - triI1;
  const tinhTai = (i: number): number => tinhJ[Math.min(tinhJ.length - 1, Math.max(0, i - tinhI0))] ?? jY(0.7);
  const triJ = quyHoach(nTri, (b) => Math.round(tinhTai(triI0 - b) + 0.06 * px), () => Math.round(jY(0.25)), (b, j) => (trongGo({ x: xI(triI0 - b), y: yJ(j) }) ? -1 : nep(triI0 - b, j) / nguong),
    (d) => (d > 0 ? 0.4 * d : 1.0 * -d));
  const rTri = triJ.map((j, b) => (trongGo({ x: xI(triI0 - b), y: yJ(j) }) ? 0 : nep(triI0 - b, j)));
  const dTri = doanNep(rTri, nguong, ho(0.08), 0.35 * nTri);
  const vTri = vet(dTri, (b) => ({ x: xI(triI0 - b), y: yJ(triJ[b] ?? 0) }));

  // Duong su nghiep: hang tu tren co tay len, lech truc giua ≤ 0,22 L, toi duoi goc ngon; cam di sat duong doi (≤ 0,07 L).
  const ganDoi = (p: Diem): boolean => trongGo(p) || vDoi.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 0.07);
  const suJ0 = Math.round(jY(0.05)), suJ1 = Math.round(jY(mcpY(moc.giua.x) - 0.08));
  const suI = quyHoach(suJ0 - suJ1, () => Math.round(iX(moc.giua.x - 0.22)), () => Math.round(iX(moc.giua.x + 0.22)),
    (b, i) => (ganDoi({ x: xI(i), y: yJ(suJ0 - b) }) ? -1 : nep(i, suJ0 - b) / nguong), (d) => 0.8 * Math.abs(d));
  const rSu = suI.map((i, b) => (ganDoi({ x: xI(i), y: yJ(suJ0 - b) }) ? 0 : nep(i, suJ0 - b)));
  const dSu = doanNep(rSu, nguong, ho(0.06));
  const vSu = vet(dSu, (b) => ({ x: xI(suI[b] ?? 0), y: yJ(suJ0 - b) }));

  // Do ro: trung binh nep tren doan / nguong; doan ngan hon 0,15 L coi nhu khong thay.
  const tbDoan = (r: readonly number[], d: [number, number, number] | null): number =>
    (d === null ? 0 : r.slice(d[0], d[1] + 1).reduce((a, b) => a + b, 0) / (d[1] - d[0] + 1));
  const ro = (r: readonly number[], d: [number, number, number] | null, buocL: number, toiThieu = 0.15): 'clear' | 'faint' | 'none' =>
    (d === null || (d[1] - d[0]) * buocL < toiThieu ? 'none' : tbDoan(r, d) >= ranh ? 'clear' : 'faint');
  const dut = (d: [number, number, number] | null): boolean | null => (d === null ? null : d[2] >= Math.round(0.05 * px));
  const buocGoc = (Math.PI / 180) * 0.4; // ~ do dai mot do tren cung ban kinh 0,4 L
  const cuoi = (v: readonly Diem[]): Diem | undefined => v[v.length - 1];
  const eTinh = cuoi(vTinh), sTri = vTri[0], eTri = cuoi(vTri), eDoi = cuoi(vDoi), sSu = vSu[0];

  // Chi tay ngang: nep "duong tinh" chay tu phia ngon ut qua ngon tro ma dau cuoi van thap (≥ 0,14 L duoi goc ngon) — duong tinh that
  // cong len gan goc ngon tro, giua; nep ngang suot ban tay thi di thang sang mep phia ngon cai.
  const roTri = ro(rTri, dTri, 1 / px);
  const ngang = eTinh !== undefined && eTinh.x >= moc.tro.x + 0.04 && mcpY(eTinh.x) - eTinh.y >= 0.14 && (vTinh[0]?.x ?? 0) <= moc.apUt.x
    && ro(rTinh, dTinh, 1 / px) === 'clear' && tbDoan(rTri, dTri) < 0.7 * tbDoan(rTinh, dTinh);
  const tLen = eTinh === undefined ? 0 : (eTinh.x - moc.giua.x) / (moc.tro.x - moc.giua.x || NHO);
  // Su nghiep: doan dai ≥ 0,25 L va manh ≥ nua trung vi ba duong chinh — van da nhieu de thanh doan doc yeu giua long tay (anh tong
  // hop chi co nhieu: 0,004 so voi nep 0,07).
  const chinh = [tbDoan(rTinh, dTinh), tbDoan(rTri, dTri), tbDoan(rDoi, dDoi)].sort((x, y) => x - y)[1] ?? 0;
  const roSu = tbDoan(rSu, dSu) < 0.5 * chinh ? 'none' : ro(rSu, dSu, 1 / px, 0.25);
  const dauTri = ngang ? eTinh : sTri, cuoiTri = ngang ? vTinh[0] : eTri;

  const khung: KhungChiTay = {
    simian: ngang,
    duong: {
      life: { seen: ro(rDoi, dDoi, buocGoc), length: eDoi === undefined ? null : eDoi.y <= 0.15 ? 'long' : eDoi.y >= 0.45 ? 'short' : 'medium',
        arc: vDoi.length === 0 ? null : Math.min(...vDoi.map((p) => p.x)) <= moc.giua.x + 0.1 ? 'wide' : 'narrow', broken: dut(dDoi) },
      head: { seen: ngang ? ro(rTinh, dTinh, 1 / px) : roTri,
        length: cuoiTri === undefined ? null : cuoiTri.x <= moc.ut.x + 0.25 * (moc.apUt.x - moc.ut.x) ? 'long'
          : cuoiTri.x >= (moc.giua.x + moc.apUt.x) / 2 ? 'short' : 'medium',
        shape: dauTri === undefined || cuoiTri === undefined ? null : dauTri.y - cuoiTri.y >= 0.15 ? 'curved' : 'straight',
        joined: dauTri === undefined || sDoi === undefined ? null : Math.hypot(dauTri.x - sDoi.x, dauTri.y - sDoi.y) <= 0.1,
        broken: ngang ? dut(dTinh) : dut(dTri) },
      heart: { seen: ro(rTinh, dTinh, 1 / px), length: eTinh === undefined ? null : tLen >= 0.75 ? 'long' : tLen >= 0.25 ? 'medium' : 'short',
        broken: dut(dTinh) },
      fate: { seen: roSu,
        start: sSu === undefined || roSu === 'none' ? null : vDoi.some((p) => Math.hypot(p.x - sSu.x, p.y - sSu.y) < 0.1) ? 'life' : sSu.y <= 0.2 ? 'wrist' : 'middle',
        broken: roSu === 'none' ? null : dut(dSu) },
    },
  };
  return { khung, vet: { life: vDoi, head: ngang ? vTinh : vTri, heart: vTinh, fate: roSu === 'none' ? [] : vSu } };
}

function vet(d: [number, number, number] | null, diem: (b: number) => Diem): Diem[] {
  return d === null ? [] : Array.from({ length: d[1] - d[0] + 1 }, (_, k) => diem(d[0] + k));
}
