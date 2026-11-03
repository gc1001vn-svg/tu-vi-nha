/**
 * Luan trai tarot (ke hoach `docs/ke-hoach/2026-11-03-tarot.md`; cach chot: `docs/LUAN_TAROT.md`; bo bai, trai, xao: QUY_UOC muc 24).
 * Tu cac la da rut → diem tung la (`DO`; la nguoc = nua suc, Waite "the same in a lesser degree"), trong so theo vi tri → tong luan, mach
 * bai (3 la, Thap tu Celtic), bo chiem da so (Book T "A majority of…"), la nguoc, loi khuyen, loi nhac. Loi o `tarotLuanLoi.ts`.
 * Thuoc: `tests/LuanTarot.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { LA, TRAI, type LaRut } from './tarot.ts';
import { DO, KET, KHUYEN, MACH, NGUOC, NHAC, NHOM, TRONG_TAM } from './tarotLuanLoi.ts';

type Kieu = keyof typeof TRAI;
/** Diem trung binh moi la: moc gan phan vi 75 / 25 cua 3.000 trai gia moi kieu (docs muc 5). */
export const NGUONG_TAROT: Readonly<Record<Kieu, { readonly thuan: number; readonly kho: number }>> = {
  motLa: { thuan: 0.5, kho: -0.25 }, baLa: { thuan: 0.4, kho: -0.1 }, thapTu: { thuan: 0.25, kho: 0 },
};

/** Diem mot la da rut: nguoc thi nua suc (Waite: "the same in a lesser degree"; cach doc hien dai: bi chan, chua ra het). */
export const diemLa = (r: LaRut): number => (DO[r.so] ?? 0) * (r.nguoc ? 0.5 : 1);

/** Trong so vi tri: la ket qua (Celtic 10, tuong lai 3 la) gom y cac la truoc nen nang hon. */
const trongSo = (kieu: Kieu, i: number): number => ((kieu === 'thapTu' && i === 9) || (kieu === 'baLa' && i === 2) ? 1.5 : 1);

export function diemTrai(kieu: Kieu, rut: readonly LaRut[]): number {
  const w = rut.map((_, i) => trongSo(kieu, i));
  return rut.reduce((t, r, i) => t + diemLa(r) * (w[i] ?? 1), 0) / w.reduce((a, b) => a + b, 0);
}

const bo = (so: number): 'anChinh' | 'Gậy' | 'Cốc' | 'Kiếm' | 'Tiền' => (so < 22 ? 'anChinh' : (['Gậy', 'Cốc', 'Kiếm', 'Tiền'] as const)[Math.floor((so - 22) / 14)] ?? 'Tiền');
const hang = (so: number): number => (so < 22 ? -1 : (so - 22) % 14);
const ten = (r: LaRut): string => `${LA[r.so]?.anh ?? ''} (${LA[r.so]?.ten ?? ''}${r.nguoc ? ', ngược' : ''})`;

export function luanTarot(kieu: Kieu, rut: readonly LaRut[]): DoanLuan[] {
  const n = rut.length, d = diemTrai(kieu, rut), ng = NGUONG_TAROT[kieu];
  const ket = d >= ng.thuan ? 'thuan' : d <= ng.kho ? 'kho' : 'vua';
  // La trong tam: |diem| lon nhat, bang nhau thi uu tien an chinh, roi la dau.
  const tam = [...rut].sort((a, b) => Math.abs(diemLa(b)) - Math.abs(diemLa(a)) || Number(a.so >= 22) - Number(b.so >= 22))[0];
  const tong = [KET[ket], ...(n > 1 && tam !== undefined && diemLa(tam) !== 0 ? [TRONG_TAM(ten(tam), diemLa(tam) > 0)] : [])];

  // Bo chiem da so (Book T): 3 la tu 2, 10 la tu 4.
  const nguong = n >= 10 ? 4 : 2;
  const dem = (f: (so: number) => boolean): number => rut.filter((r) => f(r.so)).length;
  const nhom: string[] = [];
  if (n >= 3) {
    if (dem((s) => s < 22) >= nguong) nhom.push(NHOM.anChinh);
    const boDem = (['Gậy', 'Cốc', 'Kiếm', 'Tiền'] as const).map((b) => [b, dem((s) => bo(s) === b)] as const);
    const troi = boDem.filter(([, c]) => c >= nguong).map(([b]) => b);
    for (const b of troi) nhom.push(NHOM[b]);
    const co = (b: string): boolean => boDem.some(([x, c]) => x === b && c >= Math.max(2, nguong - 1));
    if ((co('Gậy') && co('Cốc')) || (co('Kiếm') && co('Tiền'))) nhom.push(NHOM.doi);
    if (dem((s) => hang(s) >= 10) >= nguong) nhom.push(NHOM.trieu);
    if (dem((s) => hang(s) === 0) >= Math.max(2, nguong - 1)) nhom.push(NHOM.at);
    if (nhom.length === 0) nhom.push(NHOM.khong);
  }

  const soNguoc = rut.filter((r) => r.nguoc).length;
  const nguoc = n === 1 ? [] : [soNguoc === 0 ? NGUOC.khong : soNguoc * 2 >= n ? NGUOC.nhieu : NGUOC.it];

  // Mach bai: 3 la (qua khu → tuong lai); Celtic (hien trang, tro ngai, hy vong – lo so, ket qua).
  const dl = rut.map(diemLa);
  const mach: string[] = [];
  if (kieu === 'baLa' || kieu === 'thapTu') {
    const dau = dl[0] ?? 0, cuoi = dl[n - 1] ?? 0;
    mach.push(cuoi - dau >= 1 ? MACH.len : dau - cuoi >= 1 ? MACH.xuong : MACH.ngang);
    if (cuoi > 0) mach.push(MACH.ketTot); else if (cuoi < 0) mach.push(MACH.ketXau);
  }
  if (kieu === 'thapTu') {
    mach.push((dl[1] ?? 0) < (dl[0] ?? 0) && (dl[1] ?? 0) < 0 ? MACH.troNgai : MACH.troNgaiNhe);
    if ((dl[8] ?? 0) < 0) mach.push(MACH.hyVong);
  }

  return [
    { tieuDe: 'Tổng luận', loi: tong },
    ...(mach.length === 0 ? [] : [{ tieuDe: 'Mạch bài', loi: mach }]),
    ...(nhom.length === 0 && nguoc.length === 0 ? [] : [{ tieuDe: 'Bài nghiêng về', loi: [...nhom, ...nguoc] }]),
    { tieuDe: 'Lời khuyên', loi: [KHUYEN[ket]] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}
