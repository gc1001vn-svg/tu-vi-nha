/**
 * Luan bat tu (ke hoach `docs/ke-hoach/2026-11-02-bat-tu.md`; cach chot, nguon, so do: `docs/LUAN_BAT_TU.md`).
 * Tang 1 tong luan: than vuong nhuoc (lenh thang, goc trong chi, can do — *Tu Binh Chan Thuyen* "dac thoi bat vuong"), hanh hop /
 * ky (phu uc, dieu hau, thong quan, tong — *Trich Thien Tuy*), cach cuc lay o lenh thang (*Tu Binh Chan Thuyen*), hop xung giua cac
 * tru, thap than troi. Tang 2 tung viec (cung vi + sao, *Tu Binh Chan Thuyen* "cung phan dung than phoi luc than"), tang 3 dai van
 * (chi nang hon can) va nam (can nang hon chi — *Uyen Hai Tu Binh*). Loi o `batTuLuanLoi.ts`. Thuoc: `tests/LuanBatTu.test.ts`.
 */
import { CHI } from './amLich.ts';
import type { BatTu, VanNam } from './batTu.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { hv } from './hanViet/index.ts';
import type { GioiTinh } from './hoSo.ts';
import {
  CACH, CACH_THUONG, DIEU_HAU, GHEP, HOP_XUNG, KET, LENH, LENH_NGAN, LY_DO, MUA, NAM, NGHE, NHOM_TEN, SUC_KHOE, TANG_PHU, THAN_MUC,
  THAP_THAN, TINH, TINH_DEU, TINH_VANG, UNG_DUNG, VAN, VAN_THAN, VIEC, YEU_TO,
} from './batTuLuanLoi.ts';

const m5 = (x: number): number => ((x % 5) + 5) % 5;
const m12 = (x: number): number => ((x % 12) + 12) % 12;
/** Hanh cua can: 0 Moc, 1 Hoa, 2 Tho, 3 Kim, 4 Thuy. */
const hanhCan = (c: number): number => Math.floor(c / 2);
/** Can tang trong chi, chinh khi truoc (khop `LunarUtil.ZHI_HIDE_GAN`, test so). */
export const TANG: readonly (readonly number[])[] = [
  [9], [5, 9, 7], [0, 2, 4], [1], [4, 1, 9], [2, 6, 4], [3, 5], [5, 3, 1], [6, 8, 4], [7], [4, 7, 3], [8, 0],
];
/** Phan chinh khi, trung khi, du khi theo so can tang (Claude dat, cach chia pho bien 6 : 3 : 1). */
const PHAN: readonly (readonly number[])[] = [[], [1], [0.7, 0.3], [0.6, 0.3, 0.1]];
/** Trong so vi tri — can nam, thang, (ngay = nhat chu), gio; chi nam, thang (lenh thang nang nhat), ngay, gio. */
const W_CAN = [0.6, 1, 0, 0.8] as const;
const W_CHI = [0.8, 3, 1.5, 1] as const;
/** Chi Lam Quan (loc) cua 10 can; Duong Nhan (De Vuong) chi tinh can duong (*Tu Binh Chan Thuyen*). */
const LOC = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0] as const;
const NHAN = [3, -1, 6, -1, 6, -1, 9, -1, 0, -1] as const;

/** Nhom cua can `c` voi nhat chu `n`: 0 Ty Kiep, 1 Thuc Thuong, 2 Tai, 3 Quan Sat, 4 An. */
const nhom = (n: number, c: number): number => m5(hanhCan(c) - hanhCan(n));
/** Thap than 0..9 theo `THAP_THAN` (cung am duong: Ty Kien, Thuc Than, Thien Tai, That Sat, Thien An). */
export const than = (n: number, c: number): number => nhom(n, c) * 2 + (c % 2 === n % 2 ? 0 : 1);
const chinhKhi = (z: number): number => TANG[z]?.[0] ?? 0;
const cong = (a: number[], k: number, w: number): void => { a[k] = (a[k] ?? 0) + w; };
const tong = (a: readonly number[]): number => a.reduce((s, x) => s + x, 0);
const xung = (a: number, b: number): boolean => m12(a - b) === 6;
const hop = (a: number, b: number): boolean => (a + b) % 12 === 1;
/** Tam hop g (0 Thuy, 1 Kim, 2 Hoa, 3 Moc — chi % 4) va tam hoi g (0 Moc … 3 Thuy, ba chi lien mua); can chinh cua chi giua. */
const TAM_HOP = [[8, 0, 4], [5, 9, 1], [2, 6, 10], [11, 3, 7]] as const;
const TAM_HOI = [[2, 3, 4], [5, 6, 7], [8, 9, 10], [11, 0, 1]] as const;
const tenChi = (z: number): string => hv('chi', CHI.charAt(m12(z)));
const tenHanh = (e: number): string => hv('nguHanh', '木火土金水'.charAt(m5(e)));

/** Ti le phan giup minh: [p10, p40, p50, p60, p90] tren 3.000 la so gia (docs/LUAN_BAT_TU.md muc 5). */
export const NGUONG_THAN = [0.18, 0.35, 0.39, 0.44, 0.65] as const;
/** Ty le Thuy (mua he) hay Hoa (mua dong) duoi muc nay thi can dieu hau. */
export const NGUONG_HAU = 0.12;
export type Ket = 'thuan' | 'vua' | 'kho';
export interface Luan { readonly ket: Ket; readonly diem: number; readonly loi: readonly string[] }
/** Nguong ket tung viec, dai van, nam: diem roi rac nen chon moc gan phan vi 75 / 25 nhat tren 3.000 la so gia (muc 5 docs). */
export const NGUONG_VIEC: Readonly<Record<string, { readonly thuan: number; readonly kho: number }>> = {
  'Sự nghiệp': { thuan: 1, kho: -0.75 }, 'Tiền bạc': { thuan: 1.25, kho: -1 }, 'Hôn nhân': { thuan: 0.25, kho: -1.75 },
  'Cha mẹ': { thuan: 0.5, kho: -0.75 }, 'Anh em, bạn bè': { thuan: 1, kho: -1 }, 'Con cái': { thuan: 0.5, kho: -1.25 },
  'Sức khỏe': { thuan: 1, kho: -1 },
};
export const NGUONG_VAN = { thuan: 0.4, kho: -0.4 } as const;
export const NGUONG_NAM = { thuan: 0.3, kho: -0.5 } as const;
const ket = (d: number, ng: { readonly thuan: number; readonly kho: number }): Ket => (d >= ng.thuan ? 'thuan' : d < ng.kho ? 'kho' : 'vua');

export interface PhanTich {
  /** Can nhat chu. */
  readonly n: number;
  /** Trong so 5 hanh, tinh ca nhat chu (1) — de ve, xet dieu hau, suc khoe. */
  readonly hanh: readonly number[];
  /** Trong so 5 nhom va 10 thap than (khong tinh nhat chu). */
  readonly nhomW: readonly number[];
  readonly thanW: readonly number[];
  /** Thap than co mat: o can (tru nam, thang, gio) hoac la chinh khi mot chi; `loCan`: chi tinh can (sach goi la "lo", "thau"). */
  readonly lo: readonly boolean[];
  readonly loCan: readonly boolean[];
  /** Ti le phan giup minh (Ty Kiep + An) tren tong. */
  readonly tyLe: number;
  /** 0 rat nhuoc, 1 nhuoc, 2 hoi nhuoc, 3 hoi vuong, 4 vuong, 5 rat vuong. */
  readonly muc: number;
  /** Nhom duoc "tong" khi than khong goc, khong duoc giup (1, 2, 3); null: khong tong. */
  readonly tong: number | null;
  readonly chuyenVuong: boolean;
  /** Muc hop 5 nhom: 1 dung than, 0,5 hy, 0 trung tinh, −0,5 / −1 ky. */
  readonly hy: readonly number[];
  /** Ly do chon dung than (khoa `LY_DO`). */
  readonly lyDo: string;
  /** Hanh can dieu hau (1 Hoa, 4 Thuy) hay null. */
  readonly dieuHau: number | null;
  readonly coGoc: boolean;
  readonly canGiup: boolean;
  /** Cach cuc: 0..9 thap than o lenh thang, 10 Kien Loc, 11 Duong Nhan, 12 thang cung hanh. */
  readonly cach: number;
  readonly cachKet: 'thanh' | 'thuong' | 'bai';
}

/** Cac chi co trong la so: [vi tri tru, chi]. */
const cacChi = (b: BatTu): (readonly [number, number])[] => b.tru.flatMap((t, i) => (t === null ? [] : [[i, t.so[1]] as const]));

function layCach(b: BatTu, n: number): number {
  const thang = b.tru[1]?.so[1] ?? 0;
  if (thang === LOC[n]) return 10;
  if (thang === NHAN[n]) return 11;
  const tang = TANG[thang] ?? [];
  // *Tu Binh Chan Thuyen* "luan dung than bien hoa": can tang trong lenh thang lo ra can nao thi lay can do; khong lo lay chinh khi.
  const loCan = [0, 1, 3].flatMap((i) => { const t = b.tru[i]; return t === null || t === undefined ? [] : [t.so[0]]; });
  const lo = tang.find((c) => nhom(n, c) !== 0 && loCan.includes(c));
  if (lo !== undefined) return than(n, lo);
  const chinh = tang[0] ?? 0;
  return nhom(n, chinh) === 0 ? 12 : than(n, chinh);
}

export function phanTich(b: BatTu): PhanTich {
  const n = b.tru[2]?.so[0] ?? 0;
  const hanh = [0, 0, 0, 0, 0], thanW = new Array<number>(10).fill(0), lo = new Array<boolean>(10).fill(false);
  const loCan = new Array<boolean>(10).fill(false);
  let canGiup = false, coGoc = false;
  b.tru.forEach((t, i) => {
    if (t === null) return;
    const [g, z] = t.so;
    if (i !== 2) {
      cong(thanW, than(n, g), W_CAN[i] ?? 0); cong(hanh, hanhCan(g), W_CAN[i] ?? 0);
      lo[than(n, g)] = true; loCan[than(n, g)] = true;
      if (nhom(n, g) === 0 || nhom(n, g) === 4) canGiup = true;
    }
    const tang = TANG[z] ?? [];
    tang.forEach((c, k) => {
      const w = (W_CHI[i] ?? 0) * (PHAN[tang.length]?.[k] ?? 0);
      cong(thanW, than(n, c), w); cong(hanh, hanhCan(c), w);
      if (nhom(n, c) === 0) coGoc = true;
    });
    lo[than(n, chinhKhi(z))] = true;
  });
  cong(hanh, hanhCan(n), 1);
  // Du ba chi tam hop / tam hoi thi khi hanh do gom lai (*Tu Binh Chan Thuyen* "thau can hoi chi"): cong 1,5 nhu them mot chi manh.
  const co = new Set(cacChi(b).map(([, z]) => z));
  for (const bo of [...TAM_HOP, ...TAM_HOI]) {
    if (!bo.every((z) => co.has(z))) continue;
    const c = chinhKhi(bo[1]);
    cong(thanW, than(n, c), 1.5); cong(hanh, hanhCan(c), 1.5);
  }
  const nhomW = [0, 1, 2, 3, 4].map((g) => (thanW[2 * g] ?? 0) + (thanW[2 * g + 1] ?? 0));
  const [ty = 0, , tai = 0, quan = 0, an = 0] = nhomW;
  const tot = tong(nhomW) || 1, tyLe = (ty + an) / tot;
  const muc = NGUONG_THAN.filter((x) => tyLe >= x).length;
  const coN = (g: number): boolean => (lo[2 * g] ?? false) || (lo[2 * g + 1] ?? false);
  const hao = [1, 2, 3].reduce((m, g) => ((nhomW[g] ?? 0) > (nhomW[m] ?? 0) ? g : m), 1);
  // Tong nhuoc (*Uyen Hai Tu Binh* "khi menh tong sat / tai"): khong goc, khong can giup, An trong chi chi con chut du khi.
  const tongNhom = !coGoc && !canGiup && muc === 0 && ty + an < 0.5 ? hao : null;
  // Chuyen vuong: rat vuong, khong co Quan Sat (ca can tang), Tai gan nhu khong.
  const chuyenVuong = muc === 5 && quan === 0 && tai < 0.5;

  const hy = [0, 0, 0, 0, 0];
  let lyDo: string;
  if (tongNhom !== null) {
    hy[tongNhom] = 1; hy[tongNhom === 2 ? 1 : 2] = 0.5; hy[0] = -1; hy[4] = -1; lyDo = 'tong';
  } else if (chuyenVuong) {
    const d = ty >= an ? 0 : 4;
    hy[d] = 1; hy[4 - d] = 0.5; hy[1] = 0.5; hy[3] = -1; hy[2] = -0.5; lyDo = 'chuyen';
  } else if (muc <= 2) {
    // Than nhuoc: Tai nhieu nhat thi Ty Kiep ganh do; Quan Sat, Thuc Thuong nhieu nhat thi An hoa / che (*Trich Thien Tuy* luc than luan).
    if (hao === 2) { hy[0] = 1; hy[4] = 0.5; lyDo = 'nhuocTai'; } else { hy[4] = 1; hy[0] = 0.5; lyDo = hao === 3 ? 'nhuocQuan' : 'nhuocThuc'; }
    for (const g of [1, 2, 3]) hy[g] = g === hao ? -1 : -0.5;
  } else if (an > ty) {
    hy[2] = 1; hy[1] = 0.5; hy[4] = -1; hy[3] = -0.5; hy[0] = -0.5; lyDo = 'vuongAn';
  } else if (tai >= 0.25 * tot) {
    hy[1] = 1; hy[2] = 0.5; hy[3] = 0.5; hy[0] = -1; hy[4] = -0.5; lyDo = 'vuongThong';
  } else if (coN(3)) {
    hy[3] = 1; hy[2] = 0.5; hy[0] = -1; hy[4] = -0.5; lyDo = 'vuongQuan';
  } else {
    hy[1] = 1; hy[2] = 0.5; hy[3] = 0.5; hy[0] = -1; hy[4] = -1; lyDo = 'vuongThuc';
  }
  // Dieu hau (*Trich Thien Tuy* "han noan", *Tu Binh Chan Thuyen* "dung than phoi khi hau"): he kho thi can Thuy, dong lanh can Hoa.
  const thang = b.tru[1]?.so[1] ?? 0, tongH = tong(hanh);
  const dieuHau = tongNhom !== null || chuyenVuong ? null
    : [5, 6, 7].includes(thang) && (hanh[4] ?? 0) / tongH < NGUONG_HAU ? 4
      : [11, 0, 1].includes(thang) && (hanh[1] ?? 0) / tongH < NGUONG_HAU ? 1 : null;
  if (dieuHau !== null) hy[m5(dieuHau - hanhCan(n))] = 1;

  const cach = layCach(b, n);
  const chi = cacChi(b);
  // Lenh thang bi chi ke ben (nam, ngay) xung ma khong co chi nao hop giai (*Tu Binh Chan Thuyen* "hinh xung hoi hop giai phap").
  const xungThang = chi.some(([i, z]) => (i === 0 || i === 2) && xung(z, thang) && !chi.some(([k, y]) => k !== i && k !== 1 && (hop(y, z) || hop(y, thang))));
  // Thanh bai (*Tu Binh Chan Thuyen* "dung than thanh bai cuu ung"): than pha phai lo o can moi tinh; than cuu co mat la du.
  const c = (k: number): boolean => lo[k] ?? false, t = (k: number): boolean => loCan[k] ?? false;
  const tN = (g: number): boolean => t(2 * g) || t(2 * g + 1);
  const thanhBai = ((): PhanTich['cachKet'] => {
    switch (cach) {
      case 7: return (t(3) && !coN(4)) || t(6) || xungThang ? 'bai' : coN(2) || coN(4) ? 'thanh' : 'thuong';
      case 6: return c(2) || tN(4) ? 'thanh' : tN(2) && !coN(4) ? 'bai' : 'thuong';
      case 4: case 5: return muc === 0 || (ty >= tai && !coN(3)) || (t(6) && !c(2)) ? 'bai' : (coN(3) || coN(1)) && muc >= 2 ? 'thanh' : 'thuong';
      case 8: case 9: return tN(2) && tai >= an && !coN(0) ? 'bai' : tN(3) || (muc >= 4 && coN(1)) ? 'thanh' : 'thuong';
      case 2: return t(8) && !coN(2) ? 'bai' : coN(2) || t(6) ? 'thanh' : 'thuong';
      case 3: return t(7) && !coN(4) && !(hanhCan(n) === 3 && [11, 0, 1].includes(thang)) ? 'bai'
        : (muc <= 2 && coN(4)) || (muc >= 3 && coN(2)) ? 'thanh' : 'thuong';
      case 11: return coN(3) ? 'thanh' : 'bai';
      default: return tN(3) || (tN(2) && coN(1)) ? 'thanh' : !coN(2) && !coN(3) ? 'bai' : 'thuong';
    }
  })();
  return { n, hanh, nhomW, thanW, lo, loCan, tyLe, muc, tong: tongNhom, chuyenVuong, hy, lyDo, dieuHau, coGoc, canGiup, cach, cachKet: thanhBai };
}

/** Hanh cua nhom `g` voi nhat chu `n`. */
const hanhNhom = (n: number, g: number): number => m5(hanhCan(n) + g);
const dsHanh = (p: PhanTich, f: (v: number) => boolean): string => [0, 1, 2, 3, 4].filter((g) => f(p.hy[g] ?? 0))
  .sort((a, b) => (p.hy[b] ?? 0) - (p.hy[a] ?? 0)).map((g) => `${tenHanh(hanhNhom(p.n, g))} (${NHOM_TEN[g] ?? ''})`).join(', ');
const TRU = ['năm', 'tháng', 'ngày', 'giờ'] as const;

/** Hop, xung giua cac tru: can ngu hop (tru ke nhau), chi luc xung, luc hop, tam hop, tam hoi, tam hinh. */
export function hopXung(b: BatTu): string[] {
  const ra: string[] = [];
  const chi = cacChi(b);
  for (let i = 0; i < 3; i++) {
    const a = b.tru[i], c = b.tru[i + 1];
    if (a === null || a === undefined || c === null || c === undefined) continue;
    if (a.so[0] % 5 === c.so[0] % 5 && a.so[0] !== c.so[0]) ra.push(HOP_XUNG.canHop(`${a.can} – ${c.can}`, TRU[i] ?? '', TRU[i + 1] ?? '', i >= 1));
  }
  for (const [i, z] of chi) {
    for (const [j, y] of chi) {
      if (j <= i) continue;
      const cap = `${String(i)}${String(j)}`;
      if (xung(z, y)) {
        const giai = chi.some(([k, w]) => k !== i && k !== j && (hop(w, z) || hop(w, y)));
        ra.push(`${HOP_XUNG.xung(`${tenChi(z)} – ${tenChi(y)}`, TRU[i] ?? '', TRU[j] ?? '')} ${HOP_XUNG.capXung[cap] ?? ''}`
          + (giai ? ` ${HOP_XUNG.giai}` : ''));
      } else if (hop(z, y)) {
        ra.push(`${HOP_XUNG.hop(`${tenChi(z)} – ${tenChi(y)}`, TRU[i] ?? '', TRU[j] ?? '')} ${HOP_XUNG.capHop[cap] ?? ''}`);
      }
    }
  }
  const co = new Set(chi.map(([, z]) => z));
  TAM_HOP.forEach((bo) => { if (bo.every((z) => co.has(z))) ra.push(HOP_XUNG.tamHop(bo.map(tenChi).join(' '), tenHanh(hanhCan(chinhKhi(bo[1]))))); });
  TAM_HOI.forEach((bo) => { if (bo.every((z) => co.has(z))) ra.push(HOP_XUNG.tamHoi(bo.map(tenChi).join(' '), tenHanh(hanhCan(chinhKhi(bo[1]))))); });
  if ([2, 5, 8].every((z) => co.has(z)) || [1, 10, 7].every((z) => co.has(z))) ra.push(HOP_XUNG.tamHinh);
  return ra;
}

/** Tang 1: nhat chu – mua sinh, manh yeu, hanh hop / ky, cach cuc, hop xung, net tinh. */
export function tongLuanBT(b: BatTu, p: PhanTich = phanTich(b)): DoanLuan[] {
  const thang = b.tru[1]?.so[1] ?? 0;
  const lenh = nhom(p.n, chinhKhi(thang));
  const goc = cacChi(b).filter(([, z]) => (TANG[z] ?? []).some((c) => nhom(p.n, c) === 0)).map(([i]) => TRU[i] ?? '');
  const the = p.tong !== null ? THAN_MUC.tong(NHOM_TEN[p.tong] ?? '') : p.chuyenVuong ? THAN_MUC.chuyen : THAN_MUC.muc[p.muc] ?? '';
  // Dung than: hanh dieu hau dung truoc (khi co), roi nhom dung theo phu uc.
  const dh = p.dieuHau === null ? null : m5(p.dieuHau - hanhCan(p.n));
  const dung = [...(dh === null ? [] : [dh]), ...[0, 1, 2, 3, 4].filter((g) => p.hy[g] === 1 && g !== dh)];
  const ky = [0, 1, 2, 3, 4].filter((g) => (p.hy[g] ?? 0) < 0);
  // Net tinh: hai thap than nang nhat (tu 1 tro len); nhom vang hoan toan.
  const troi = [...p.thanW.keys()].filter((k) => (p.thanW[k] ?? 0) >= 1)
    .sort((a, c) => (p.thanW[c] ?? 0) - (p.thanW[a] ?? 0)).slice(0, 2);
  const vang = [0, 1, 2, 3, 4].filter((g) => (p.nhomW[g] ?? 0) === 0);
  const hx = hopXung(b);
  return [
    { tieuDe: `Nhật chủ ${b.nhatChu}`, loi: [
      `Sinh tháng ${tenChi(thang)} (${MUA[Math.floor(m12(thang - 2) / 3)] ?? ''}): ${LENH[lenh] ?? ''}`, b.nghiaNhatChu] },
    { tieuDe: 'Mạnh hay yếu (thân vượng – nhược)', loi: [the, YEU_TO(LENH_NGAN[lenh] ?? '', goc.join(', '), p.canGiup)] },
    { tieuDe: 'Hành hợp, hành kỵ (dụng thần)', loi: [
      `Hành hợp nhất (dụng thần): ${dung.map((g) => `${tenHanh(hanhNhom(p.n, g))} (${NHOM_TEN[g] ?? ''})`).join(', ')}. `
        + `${p.dieuHau === null ? '' : `${DIEU_HAU[p.dieuHau] ?? ''} `}${(LY_DO[p.lyDo] ?? '').replace('{nhom}', NHOM_TEN[p.tong ?? 0] ?? '')}`,
      ...(dsHanh(p, (v) => v > 0 && v < 1) === '' ? [] : [`Hành cũng hợp (hỷ thần): ${dsHanh(p, (v) => v > 0 && v < 1)}.`]),
      `Hành nên tránh (kỵ thần): ${ky.length === 0 ? 'không có hành nào kỵ rõ' : dsHanh(p, (v) => v < 0)}.`
        + (dsHanh(p, (v) => v === 0) === '' ? '' : ` Hành trung tính: ${dsHanh(p, (v) => v === 0)}.`),
      UNG_DUNG(dung.map((g) => hanhNhom(p.n, g))),
    ] },
    { tieuDe: `Cách cục: ${CACH[p.cach]?.ten ?? ''}`, loi: [CACH[p.cach]?.y ?? '', p.cachKet === 'thuong' ? CACH_THUONG : CACH[p.cach]?.[p.cachKet] ?? ''] },
    { tieuDe: 'Hợp, xung giữa các trụ', loi: hx.length === 0 ? [HOP_XUNG.khong] : hx },
    { tieuDe: 'Nét tính nổi bật (thập thần)', loi: [
      ...troi.map((k) => `${THAP_THAN[k] ?? ''} ${(p.thanW[k] ?? 0) >= 2.5 ? 'rất mạnh' : 'mạnh'}: ${TINH[k] ?? ''}`),
      ...(troi.length === 0 ? [TINH_DEU] : []),
      ...vang.map((g) => `Vắng ${NHOM_TEN[g] ?? ''} (không có chữ ${tenHanh(hanhNhom(p.n, g))} nào, kể cả can ẩn): ${TINH_VANG[g] ?? ''}`),
    ] },
  ];
}

/** Gioi tinh → nhom sao phoi ngau, sao con cai (*Uyen Hai Tu Binh* luc than: nam Tai la vo, Quan Sat la con; nu Quan la chong, Thuc Thuong la con). */
const SAO = { nam: { phoi: 2, con: 3 }, nu: { phoi: 3, con: 1 } } as const;

/** Tang 2: 7 viec, moi viec mot doan + ket. */
export function luanViec(b: BatTu, gioi: GioiTinh, p: PhanTich = phanTich(b)): (Luan & { readonly ten: string })[] {
  const n = p.n, hy = (g: number): number => p.hy[g] ?? 0, w = (g: number): number => p.nhomW[g] ?? 0;
  const s = (k: number): boolean => p.lo[k] ?? false, coN = (g: number): boolean => s(2 * g) || s(2 * g + 1);
  const l = (k: number): boolean => p.loCan[k] ?? false;
  const ghy = (c: number): number => hy(nhom(n, c));
  const tru = b.tru, chiCua = (i: number): number | null => tru[i]?.so[1] ?? null;
  const xungTru = (i: number, j: number): boolean => { const a = chiCua(i), c = chiCua(j); return a !== null && c !== null && xung(a, c); };
  const hopTru = (i: number, j: number): boolean => { const a = chiCua(i), c = chiCua(j); return a !== null && c !== null && hop(a, c); };
  const muc = (v: number): 'hop' | 'ky' | 'vua' => (v > 0 ? 'hop' : v < 0 ? 'ky' : 'vua');
  const sao = SAO[gioi];
  const ra: (Luan & { readonly ten: string })[] = [];
  const them = (ten: string, diem: number, loi: string[]): void => {
    const k = ket(diem, NGUONG_VIEC[ten] ?? { thuan: 1, kho: -1 });
    ra.push({ ten, ket: k, diem, loi: [...loi.filter((l) => l !== ''), KET[k]] });
  };

  // Su nghiep: cach cuc → huong nghe; Quan Sat (cong viec, cap tren), Thuc Thuong (tai nang); tru thang la moi truong.
  {
    // Khong xet chi thang o day: lenh thang nang nhat nen gan nhu luon la hanh ky theo phu uc (do 02/11: 83 % la so).
    const thangChi = chiCua(1) ?? 0, thangCan = tru[1]?.so[0] ?? 0;
    const thuongGapQuan = l(3) && l(7) && !coN(4);
    them('Sự nghiệp', (coN(3) ? 1 : 0.5) * hy(3) + 0.5 * ghy(thangCan)
      + (p.cachKet === 'thanh' ? 1 : p.cachKet === 'bai' ? -1 : 0) - (tru.some((t, i) => i !== 1 && t !== null && xung(t.so[1], thangChi)) ? 0.5 : 0)
      - (thuongGapQuan ? 0.5 : 0), [
      NGHE[p.cach] ?? '',
      VIEC.quan[muc(hy(3))]?.[w(3) >= 1.5 ? 1 : 0] ?? '',
      l(2) || l(3) ? VIEC.thuc[muc(hy(1))] ?? '' : '',
      thuongGapQuan ? VIEC.thuongQuan : '',
    ]);
  }
  // Tien bac: Tai hop / ky; tai da than nhuoc; quan kiep tranh tai; thuc thuong sinh tai.
  {
    const taiDa = p.muc <= 1 && w(2) >= Math.max(w(0) + w(4), 2);
    const tranh = w(0) >= 2 && w(0) > 2 * w(2) && hy(0) < 0;
    const sinh = coN(1) && coN(2) && hy(1) >= 0 && hy(2) >= 0;
    them('Tiền bạc', 1.5 * hy(2) + (coN(2) ? 0.5 : -0.5) - (taiDa ? 1 : 0) - (tranh ? 1 : 0) + (sinh ? 0.5 : 0), [
      !coN(2) && w(2) < 0.5 ? VIEC.taiVang : VIEC.tai[muc(hy(2))],
      l(4) ? VIEC.thienTai : '', l(5) ? VIEC.chinhTai : '',
      taiDa ? VIEC.taiDa : '', tranh ? VIEC.tranhTai : '', sinh ? VIEC.sinhTai : '',
    ]);
  }
  // Hon nhan: cung phoi ngau = chi ngay; sao phoi ngau theo gioi; xung hop chi ngay.
  {
    const ngay = chiCua(2) ?? 0, g = nhom(n, chinhKhi(ngay)), ps = sao.phoi;
    const vangSao = !coN(ps), kep = l(2 * ps) && l(2 * ps + 1);
    const bixung = [1, 3].filter((i) => xungTru(2, i)), duocHop = [1, 3].filter((i) => hopTru(2, i));
    const dac = gioi === 'nu' ? (p.thanW[3] ?? 0) >= 1.5 && l(7) : (p.thanW[1] ?? 0) >= 1.5 && coN(2);
    them('Hôn nhân', 1.5 * hy(g) + hy(ps) - (vangSao ? 0.5 : 0) - (kep ? 0.5 : 0) - (bixung.length > 0 ? 1 : 0)
      + (duocHop.length > 0 ? 0.5 : 0) - (dac ? 1 : 0), [
      VIEC.cungPhoi(THAP_THAN[than(n, chinhKhi(ngay))] ?? '', muc(hy(g))),
      vangSao ? VIEC.phoiVang(NHOM_TEN[ps] ?? '') : kep ? VIEC.phoiKep[gioi] : VIEC.phoi[muc(hy(ps))],
      ...bixung.map((i) => VIEC.ngayXung(TRU[i] ?? '')), ...duocHop.map((i) => VIEC.ngayHop(TRU[i] ?? '')),
      dac ? VIEC.dac[gioi] : '',
    ]);
  }
  // Cha me: An (me, nguoi che cho), Thien Tai (cha); tru nam, thang.
  {
    const taiPhaAn = coN(2) && coN(4) && w(2) >= w(4);
    const nam = tru[0];
    them('Cha mẹ', hy(4) + 0.5 * hy(2) + (nam === null || nam === undefined ? 0 : 0.5 * ghy(nam.so[0]) + 0.5 * ghy(chinhKhi(nam.so[1])))
      - (xungTru(0, 1) ? 1 : 0) - (taiPhaAn ? 0.5 : 0), [
      !coN(4) ? VIEC.anVang : VIEC.an[muc(hy(4))][w(4) >= 2 ? 1 : 0] ?? '',
      l(4) ? VIEC.cha[muc(hy(2))] : '',
      taiPhaAn ? VIEC.taiPhaAn : '',
      xungTru(0, 1) ? VIEC.namThangXung : '',
    ]);
  }
  // Anh em, ban be: Ty Kiep; tru thang.
  them('Anh em, bạn bè', 1.5 * hy(0) + 0.5 * ghy(tru[1]?.so[0] ?? 0) - (xungTru(1, 2) ? 0.5 : 0), [
    !coN(0) ? VIEC.tyVang : VIEC.ty[muc(hy(0))][w(0) >= 2 ? 1 : 0] ?? '',
    xungTru(1, 2) ? VIEC.thangNgayXung : '',
  ]);
  // Con cai: sao con theo gioi; tru gio (cung con cai, hau van).
  {
    const gio = tru[3] ?? null, cs = sao.con;
    them('Con cái', hy(cs) - (coN(cs) ? 0 : 0.5) + (gio === null ? 0 : ghy(chinhKhi(gio.so[1])) + 0.5 * ghy(gio.so[0]))
      - (xungTru(2, 3) ? 0.5 : 0), [
      !coN(cs) ? VIEC.conVang(NHOM_TEN[cs] ?? '') : VIEC.con(NHOM_TEN[cs] ?? '', muc(hy(cs))),
      gio === null ? VIEC.khongGio : VIEC.gio[muc(ghy(chinhKhi(gio.so[1])))] ?? '',
      xungTru(2, 3) ? VIEC.ngayGioXung : '',
    ]);
  }
  // Suc khoe (*Trich Thien Tuy* "tat benh luan", *Uyen Hai Tu Binh* "luan tat benh"): hanh qua nhieu, vang, hanh ky.
  {
    const tongH = tong(p.hanh), ty = p.hanh.map((x) => x / tongH);
    const max = ty.reduce((m, x, e) => (x > (ty[m] ?? 0) ? e : m), 0), vangH = [0, 1, 2, 3, 4].filter((e) => (p.hanh[e] ?? 0) === 0);
    const kyChinh = [0, 1, 2, 3, 4].find((g) => hy(g) === -1);
    const hoa = vangH.length === 0 && (ty[max] ?? 0) < 0.35;
    them('Sức khỏe', (hoa ? 1 : 0) - vangH.length * 0.75 - ((ty[max] ?? 0) >= 0.4 ? 1 : 0), [
      hoa ? SUC_KHOE.hoa : '',
      (ty[max] ?? 0) >= 0.4 ? SUC_KHOE.nhieu(tenHanh(max), TANG_PHU[max] ?? '') : '',
      ...vangH.map((e) => SUC_KHOE.vang(tenHanh(e), TANG_PHU[e] ?? '')),
      kyChinh === undefined || ((ty[max] ?? 0) >= 0.4 && hanhNhom(n, kyChinh) === max) ? '' : SUC_KHOE.ky(tenHanh(hanhNhom(n, kyChinh)), TANG_PHU[hanhNhom(n, kyChinh)] ?? ''),
      SUC_KHOE.nhac,
    ]);
  }
  return ra;
}

/** Diem, loi cho mot can chi gap tren duong doi; `can`, `chi`: trong so (dai van chi nang, nam can nang). */
function luanCanChi(b: BatTu, p: PhanTich, v: VanNam, wCan: number, wChi: number): { diem: number; loi: string[] } {
  const [g, z] = v.so, kc = than(p.n, g), kz = than(p.n, chinhKhi(z));
  const hyC = p.hy[nhom(p.n, g)] ?? 0, hyZ = p.hy[nhom(p.n, chinhKhi(z))] ?? 0;
  const [can = '', chi = ''] = v.canChi.split(' ');
  const cau = (ten: string, k: number, h: number, e: number): string => `${ten} là ${THAP_THAN[k] ?? ''}, hành ${tenHanh(e)} — `
    + `${h > 0 ? 'hợp' : h < 0 ? 'kỵ' : 'trung tính'} với lá số: ${(h > 0 ? VAN_THAN[k]?.hop : h < 0 ? VAN_THAN[k]?.ky : VAN_THAN[k]?.vua) ?? ''}`;
  let diem = wCan * hyC + wChi * hyZ;
  const loi = kc === kz && hyC === hyZ ? [cau(`Can ${can} và chi ${chi} (khí chính ${v.tang}) đều`, kc, hyC, hanhCan(g))]
    : [cau(`Can ${can}`, kc, hyC, hanhCan(g)), cau(`Chi ${chi} (khí chính ${v.tang})`, kz, hyZ, hanhCan(chinhKhi(z)))];
  const thang = b.tru[1]?.so[1], ngay = b.tru[2]?.so[1];
  if (thang !== undefined && xung(z, thang)) {
    const h = p.hy[nhom(p.n, chinhKhi(thang))] ?? 0;
    diem += h > 0 ? -0.5 : h < 0 ? 0.25 : 0;
    loi.push(h > 0 ? VAN.xungThangHop : h < 0 ? VAN.xungThangKy : VAN.xungThang);
  }
  if (ngay !== undefined && xung(z, ngay)) { diem -= 0.5; loi.push(VAN.xungNgay); }
  if (ngay !== undefined && hop(z, ngay)) { diem += 0.25; loi.push(VAN.hopNgay); }
  return { diem, loi };
}

/** Tang 3a: mot dai van (*Trich Thien Tuy* "tue van luan": dai van nhu dat minh di qua, nang chi). */
export function luanVanBT(b: BatTu, v: VanNam, p: PhanTich = phanTich(b)): Luan {
  const { diem, loi } = luanCanChi(b, p, v, 0.4, 0.6);
  const k = ket(diem, NGUONG_VAN);
  return { ket: k, diem, loi: [...loi, VAN.ket[k]] };
}

export function dsVanBT(b: BatTu, p: PhanTich = phanTich(b)): { tuoi: number; canChi: string; ket: Ket; dangChay: boolean }[] {
  return b.daiVan.map((v) => ({ tuoi: v.tuoi, canChi: v.canChi, ket: luanVanBT(b, v, p).ket, dangChay: v.dangChay }));
}

/** Tang 3b: nam dang xem (*Uyen Hai Tu Binh*: "dai van xem chi, Thai Tue xem can"); ghep voi dai van dang chay. */
export function luanNamBT(b: BatTu, p: PhanTich = phanTich(b)): Luan {
  const v = b.namNay, [g, z] = v.so;
  const r = luanCanChi(b, p, v, 0.6, 0.4);
  let diem = r.diem;
  const loi = r.loi.filter((l) => l !== VAN.hopNgay);
  const sinh = b.tru[0]?.so[1], ngay = b.tru[2]?.so, dv = b.daiVan.find((x) => x.dangChay);
  if (sinh !== undefined && z === sinh) { diem -= 0.25; loi.push(NAM.tuoi); }
  if (sinh !== undefined && xung(z, sinh)) { diem -= 0.5; loi.push(NAM.xungTuoi); }
  // Thien khac dia xung tru ngay: can nam khac nhat chu, chi nam xung chi ngay.
  if (ngay !== undefined && nhom(ngay[0], g) === 3 && xung(z, ngay[1])) { diem -= 0.5; loi.push(NAM.khacXung); }
  if (dv !== undefined && xung(z, dv.so[1])) { diem -= 0.25; loi.push(NAM.xungVan); }
  const k = ket(diem, NGUONG_NAM);
  const kv = dv === undefined ? null : luanVanBT(b, dv, p).ket;
  return { ket: k, diem, loi: [...loi, kv === null ? NAM.ket[k] : GHEP[`${kv}-${k}`] ?? NAM.ket[k]] };
}
