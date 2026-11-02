/**
 * Luan tuong mat (ke hoach `docs/ke-hoach/2026-11-02-tuong-mat.md`; cach chot: `docs/LUAN_TUONG_MAT.md`; do, nguong: QUY_UOC muc 26).
 * Tu 12 ti le da xep thap / vua / cao (`tuongMatGiai.ts`) → chot nhan tung net (cho sach venh thi chot bang net khac do duoc: ha dinh
 * dai, mat dai xet theo ham, cam) → tong luan (ket, dang mat, tam dinh, ngu quan), tinh cach, tien bac, nha cua – anh em, van theo
 * tuoi, loi nhac. Loi o `tuongMatLuanLoi.ts`. Thuoc: `tests/LuanTuongMat.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import type { SoDoMat } from './tuongMat.ts';
import { CAC_KHOA, giaiMat, hinhMat, mucMat, type MatDoGiai, type MucMat } from './tuongMatGiai.ts';
import {
  CHUA_DU, HA_DAI, HINH_NHAC, HINH_Y, KET, MAT_DAI, NET, NHA, NHAC, QUAN, QUANG, TIEN, TINH, TUOI, VE_GIA, type NetChot,
} from './tuongMatLuanLoi.ts';

type Khoa = keyof SoDoMat;
/** Diem roi rac: moc gan phan vi 75 / 25 cua 3.000 mat gia (moi ti le rut doc lap tu 15 nguoi mau; docs muc 5). */
export const NGUONG_MAT = { thuan: 3, kho: -1 } as const;
/** Duoi so net nay (anh chup gan) chi bao chua du. */
export const IT_NHAT = 5;

/** Muc tung net xet duoc (null = khong giai: anh cuoi, chup gan, sua meo chua chac). */
export function mucXet(m: MatDoGiai): Readonly<Record<Khoa, MucMat | null>> {
  const g = giaiMat(m);
  return Object.fromEntries(CAC_KHOA.map((k) => [k, g.loi[k] === null ? null : mucMat(k, m.so[k])])) as Record<Khoa, MucMat | null>;
}

/**
 * Nhan chot tung net. Cho venh chot bang net khac: ha dinh dai — sach khen khi cam, ham day, che khi nhon; mat dai — quy khi vuong,
 * kem khi nhon hai dau. May dai qua mat thi 0 (luoi dung may theo cung nen gan nhu ai cung ra "dai").
 */
export function netChot(k: Khoa, muc: Readonly<Record<Khoa, MucMat | null>>): NetChot | null {
  const m = muc[k];
  if (m === null) return null;
  const day = muc.cam === 'cao' || muc.ham === 'cao', nhon = muc.cam === 'thap';
  if (k === 'trungHa' && m === 'thap') return day ? HA_DAI.day : nhon ? HA_DAI.nhon : HA_DAI.thuong;
  if (k === 'daiRong' && m === 'cao') return muc.ham === 'cao' ? MAT_DAI.vuong : nhon ? MAT_DAI.nhon : MAT_DAI.thuong;
  return NET[k]?.[m] ?? null;
}

const tong = (ks: readonly Khoa[], muc: Readonly<Record<Khoa, MucMat | null>>): number | null => {
  const ds = ks.map((k) => netChot(k, muc)).filter((x): x is NetChot => x !== null);
  return ds.length === 0 ? null : ds.reduce((t, x) => t + x.d, 0);
};

export function diemMat(muc: Readonly<Record<Khoa, MucMat | null>>): number { return tong(CAC_KHOA, muc) ?? 0; }

const QUAN_KHOA: readonly (readonly [string, readonly Khoa[]])[] = [
  ['mày', ['may', 'mayCach', 'anDuong']], ['mắt', ['nguNhan']], ['mũi', ['mui']], ['miệng', ['mieng']],
];
const chi = (m: MucMat | null): number => (m === 'thap' ? 0 : m === 'cao' ? 2 : 1);

/** Luan ca khuon mat; null khi khong net nao giai duoc (anh cuoi). */
export function luanMat(m: MatDoGiai): DoanLuan[] | null {
  const muc = mucXet(m);
  const co = CAC_KHOA.filter((k) => muc[k] !== null);
  if (co.length === 0) return null;
  const nhac: DoanLuan = { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] };
  if (co.length < IT_NHAT) return [{ tieuDe: 'Tổng luận', loi: [CHUA_DU(CAC_KHOA.length - co.length, CAC_KHOA.length)] }, nhac];

  const d = diemMat(muc);
  const ket = d >= NGUONG_MAT.thuan ? KET.thuan : d <= NGUONG_MAT.kho ? KET.kho : KET.vua;
  const xetHinh = (['daiRong', 'ham', 'tran', 'cam'] as const).every((k) => muc[k] !== null);
  const hinh = xetHinh ? hinhMat(m.so) : null;
  const th = netChot('trungHa', muc);
  const quan = QUAN_KHOA.map(([t, ks]) => [t, tong(ks, muc)] as const);
  const noi = quan.filter(([, x]) => x !== null && x > 0).map(([t]) => t), kem = quan.filter(([, x]) => x !== null && x < 0).map(([t]) => t);
  const tongLuan = [ket, ...(xetHinh ? [`${HINH_Y[hinh ?? 'can'] ?? ''} ${HINH_NHAC}`] : []),
    ...(th === null ? [] : [`Ba đình: ${th.y}.`]), QUAN(noi, kem)];

  // Tinh cach: mat, an duong + may cach mat (gop), khoang mat (nhe), tran.
  const an = netChot('anDuong', muc)?.d ?? null, cach = netChot('mayCach', muc)?.d ?? null;
  const anCach = an !== null && cach !== null && an > 0 && cach > 0 ? TINH.anCach.tot
    : an !== null && cach !== null && an < 0 && cach < 0 ? TINH.anCach.xau
      : an !== null && cach !== null && an * cach < 0 ? TINH.anCach.lech
        : an !== null && an !== 0 ? (an > 0 ? TINH.anCach.anTot : TINH.anCach.anXau)
          : cach !== null && cach !== 0 ? (cach > 0 ? TINH.anCach.cachTot : TINH.anCach.cachXau) : '';
  const v = (bang: Readonly<Record<MucMat, string>>, k: Khoa): string => { const x = muc[k]; return x === null ? '' : bang[x]; };
  const tinh = [v(TINH.mat, 'nguNhan'), anCach, v(TINH.tran, 'tran'), v(TINH.khoang, 'khoangMat')].filter((x) => x !== '');

  // Tien: bang mui × mieng; ham, cam cho cua ve gia.
  const tien = muc.mui === null && muc.mieng === null ? [] : [TIEN[chi(muc.mui)]?.[chi(muc.mieng)] ?? ''];
  const gia = tong(['ham', 'cam'], muc);
  const tenGia = (dau: number): string => [muc.ham !== null && (netChot('ham', muc)?.d ?? 0) * dau > 0 ? (dau > 0 ? 'Hàm rộng' : 'Hàm hẹp') : '',
    muc.cam !== null && (netChot('cam', muc)?.d ?? 0) * dau > 0 ? (dau > 0 ? 'cằm rộng' : 'cằm nhọn') : '']
    .filter((x) => x !== '').join(', ').replace(/^./u, (c) => c.toUpperCase());
  if (gia !== null && gia > 0) tien.push(VE_GIA.tot(tenGia(1))); else if (gia !== null && gia < 0) tien.push(VE_GIA.xau(tenGia(-1)));

  // Ham da noi o cau ve gia (tien) thi khong nhac lai.
  const nha = [v(NHA.may, 'may'), v(NHA.mat, 'daiRong'), gia === null || gia === 0 ? v(NHA.ham, 'ham') : ''].filter((x) => x !== '');
  if (netChot('daiRong', muc) === MAT_DAI.vuong) nha.push('Mặt dài mà hàm vuông: dễ có địa vị, được người nể.');

  // Van theo tuoi (phep luu nien): tuoi tre tran + an duong; trung nien may, mat, mui (+ trung dinh dai); ve gia mieng, cam, ham
  // (+ ha dinh dai).
  const thM = muc.trungHa, thD = th?.d ?? 0;
  const cong = (x: number | null, them: number): number | null => (x === null ? null : x + them);
  const quang = [tong(['tran', 'anDuong'], muc), cong(tong(['may', 'mayCach', 'nguNhan', 'mui'], muc), thM === 'cao' ? thD : 0),
    cong(tong(['mieng', 'cam', 'ham'], muc), thM === 'thap' ? thD : 0)];
  const chu = quang.map((x, i) => (x === null ? TUOI.chua : x > 0 ? TUOI.thuan : x < 0 ? TUOI.kho : TUOI.binh)(QUANG[i] ?? ''));
  const so = quang.map((x) => x ?? 0), max = Math.max(...so);
  const tenQ = (i: number): string => (QUANG[i] ?? '').split(' (')[0]?.toLowerCase() ?? '';
  const yeu = so.map((x, i) => [x, i] as const).filter(([x]) => x < 0).map(([, i]) => tenQ(i));
  const van = [`${chu.join('; ')}.`,
    ...(max > 0 && so.filter((x) => x === max).length === 1 ? [TUOI.manh(tenQ(so.indexOf(max)))] : []),
    ...(yeu.length > 0 ? [TUOI.yeu(yeu.join(', '))] : []), ...(max <= 0 && yeu.length === 0 ? [TUOI.deu] : [])];

  return [
    { tieuDe: 'Tổng luận', loi: tongLuan },
    { tieuDe: 'Tính cách, trí tuệ', loi: tinh.length === 0 ? [TINH.vua] : tinh },
    ...(tien.length === 0 ? [] : [{ tieuDe: 'Tiền bạc, lộc ăn', loi: tien }]),
    { tieuDe: 'Nhà cửa, anh em', loi: nha.length === 0 ? [NHA.vua] : nha },
    { tieuDe: 'Vận theo tuổi', loi: van },
    nhac,
  ];
}
