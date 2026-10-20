/**
 * Kinh Dich (dot 4): gieo dong xu (6 lan, moi lan 3 dong) va Mai Hoa theo gio (梅花易數 quyen 1, 年月日時起例) ra que chu,
 * hao dong, que bien, que ho; doan can doc theo luat Chu Hy (易學啟蒙·考變占); Mai Hoa them The/Dung (quyen 2).
 * Loi thuan: ket qua gieo do giao dien boc roi truyen vao; gio "bay gio" nhan qua tham so. Quy uoc: `QUY_UOC` muc 18.
 */
import { duongSangAm, soNgay, tuSoNgay, type NgayAm, type NgayDuong } from './amLich.ts';
import { QUE } from './kinhDichChu.ts';
import type { MucDo } from './namNay.ts';

/** Tong ba dong xu (mat 2 hoac 3): 6 lao am (dong), 7 thieu duong, 8 thieu am, 9 lao duong (dong). */
export type Hao = 6 | 7 | 8 | 9;

interface Quai { readonly ten: string; readonly tuong: string; readonly hanh: string; readonly vach: readonly number[] }

/** Bat quai so Tien Thien 1–8: ten, tuong, hanh, vach tu duoi len (1 = duong). */
export const QUAI: readonly Quai[] = [
  { ten: 'Càn', tuong: 'Thiên', hanh: 'Kim', vach: [1, 1, 1] },
  { ten: 'Đoài', tuong: 'Trạch', hanh: 'Kim', vach: [1, 1, 0] },
  { ten: 'Ly', tuong: 'Hỏa', hanh: 'Hỏa', vach: [1, 0, 1] },
  { ten: 'Chấn', tuong: 'Lôi', hanh: 'Mộc', vach: [1, 0, 0] },
  { ten: 'Tốn', tuong: 'Phong', hanh: 'Mộc', vach: [0, 1, 1] },
  { ten: 'Khảm', tuong: 'Thủy', hanh: 'Thủy', vach: [0, 1, 0] },
  { ten: 'Cấn', tuong: 'Sơn', hanh: 'Thổ', vach: [0, 0, 1] },
  { ten: 'Khôn', tuong: 'Địa', hanh: 'Thổ', vach: [0, 0, 0] },
];

export function quai(so: number): Quai {
  const q = QUAI[so - 1];
  if (q === undefined) throw new RangeError(`Quái ${String(so)} ngoài 1–8`);
  return q;
}

/** Vach 6 hao (hao 1 o duoi) cua que so `so` (1–64, thu tu Van Vuong). */
export function vachQue(so: number): number[] {
  const q = QUE[so - 1];
  if (q === undefined) throw new RangeError(`Quẻ ${String(so)} ngoài 1–64`);
  return [...quai(q.duoi).vach, ...quai(q.tren).vach];
}

const khoa = (vach: readonly number[]): number => vach.reduce((s, v, i) => s + v * 2 ** i, 0);
const SO_QUE = new Map(QUE.map((_, i) => [khoa(vachQue(i + 1)), i + 1]));

export function soQue(vach: readonly number[]): number {
  const n = vach.length === 6 ? SO_QUE.get(khoa(vach)) : undefined;
  if (n === undefined) throw new RangeError(`Vạch quẻ không hợp lệ: ${vach.join('')}`);
  return n;
}

/** Que ho: hao 2-3-4 lam quai duoi, hao 3-4-5 lam quai tren. */
const queHo = (v: readonly number[]): number => soQue([...v.slice(1, 4), ...v.slice(2, 5)]);

export interface Gieo {
  readonly hao: readonly Hao[];
  readonly chu: number;
  /** Hao dong 1–6, tu duoi len. */
  readonly dong: readonly number[];
  readonly bien: number | null;
  readonly ho: number;
}

export function gieo(hao: readonly Hao[]): Gieo {
  if (hao.length !== 6) throw new RangeError('Cần đủ 6 hào');
  const vach = hao.map((h) => h % 2);
  const dong = hao.flatMap((h, i) => (h === 6 || h === 9 ? [i + 1] : []));
  const bien = dong.length === 0 ? null : soQue(hao.map((h) => (h === 6 ? 1 : h === 9 ? 0 : h % 2)));
  const chu = soQue(vach);
  // 乾坤無互，互其變卦 (梅花易數 quyen 1): que Càn, Khôn lay que ho cua que bien
  const ho = (chu === 1 || chu === 2) && bien !== null ? queHo(vachQue(bien)) : queHo(vach);
  return { hao, chu, dong, bien, ho };
}

export interface DoanDoc {
  readonly que: number;
  /** 'thoan' loi que · 'hao' loi mot hao (so `hao`) · 'dung' 用九 (Càn) hoac 用六 (Khôn). */
  readonly loai: 'thoan' | 'hao' | 'dung';
  /** 1–6 khi loai = 'hao', con lai 0. */
  readonly hao: number;
  /** Doan lam chu khi phai doc nhieu doan. */
  readonly chinh: boolean;
}

/** Doan can doc theo so hao dong — luat Chu Hy (易學啟蒙·考變占); hai truong hop 2 va 4 hao sach tu ghi la suy ra. */
export function doanCanDoc(g: Gieo): DoanDoc[] {
  const { chu, bien, dong } = g;
  const tinh = [1, 2, 3, 4, 5, 6].filter((i) => !dong.includes(i));
  const hao = (que: number, h: number, chinh: boolean): DoanDoc => ({ que, loai: 'hao', hao: h, chinh });
  if (bien === null) return [{ que: chu, loai: 'thoan', hao: 0, chinh: true }];
  switch (dong.length) {
    case 1: return dong.map((h) => hao(chu, h, true));
    case 2: return dong.map((h, i) => hao(chu, h, i === 1)); // hao tren lam chu
    // 前十卦主貞，後十卦主悔: 10 cach co hao 1 dong lay que chu lam chinh, 10 cach con lai lay que bien
    case 3: return [{ que: chu, loai: 'thoan', hao: 0, chinh: dong.includes(1) }, { que: bien, loai: 'thoan', hao: 0, chinh: !dong.includes(1) }];
    case 4: return tinh.map((h, i) => hao(bien, h, i === 0)); // hai hao tinh cua que bien, hao duoi lam chu
    case 5: return tinh.map((h) => hao(bien, h, true));
    default: return [chu <= 2 ? { que: chu, loai: 'dung', hao: 0, chinh: true } : { que: bien, loai: 'thoan', hao: 0, chinh: true }];
  }
}

const VI_TRI = ['Sơ', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Thượng'];

/** Ten hao kieu sach: hao 1 duong "Sơ Cửu", hao 2 am "Lục Nhị", hao 6 duong "Thượng Cửu". */
export function tenHao(que: number, viTri: number): string {
  const so = vachQue(que)[viTri - 1] === 1 ? 'Cửu' : 'Lục';
  const vt = VI_TRI[viTri - 1] ?? '';
  return viTri === 1 || viTri === 6 ? `${vt} ${so}` : `${so} ${vt}`;
}

export type QuanHe = 'dungSinhThe' | 'theKhacDung' | 'tyHoa' | 'theSinhDung' | 'dungKhacThe';
const SINH: Readonly<Record<string, string>> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
const KHAC: Readonly<Record<string, string>> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };

/** 體用總訣 (quyen 2): "體克用，諸事吉；用克體，諸事凶。體生用，有耗失之患；用生體，有進益之喜。體用比和，則百事順遂". */
export const LUAN: Readonly<Record<QuanHe, { readonly ten: string; readonly mucDo: MucDo; readonly loi: string }>> = {
  dungSinhThe: { ten: 'Dụng sinh Thể', mucDo: 'tot', loi: 'việc sinh cho mình: được thêm, có lợi.' },
  theKhacDung: { ten: 'Thể khắc Dụng', mucDo: 'tot', loi: 'mình chế ngự được việc: mọi việc tốt.' },
  tyHoa: { ten: 'Thể, Dụng cùng hành', mucDo: 'tot', loi: 'hòa hợp: trăm việc thuận.' },
  theSinhDung: { ten: 'Thể sinh Dụng', mucDo: 'xau', loi: 'mình phải bỏ sức, bỏ của cho việc: lo hao tổn.' },
  dungKhacThe: { ten: 'Dụng khắc Thể', mucDo: 'xau', loi: 'việc đè nặng lên mình: mọi việc xấu.' },
};

export interface MaiHoa extends Gieo {
  /** Quai tren, quai duoi, quai The, quai Dung — so Tien Thien 1–8. */
  readonly tren: number;
  readonly duoi: number;
  readonly the: number;
  readonly dung: number;
  readonly quanHe: QuanHe;
}

/** Tu ba tong so: quai tren = tong tren chia 8, quai duoi = tong duoi chia 8 (du 0 lay 8), hao dong = tong dong chia 6 (du 0 lay 6). */
export function maiHoaTuSo(tongTren: number, tongDuoi: number, tongDong: number): MaiHoa {
  for (const s of [tongTren, tongDuoi, tongDong]) if (!Number.isInteger(s) || s < 1) throw new RangeError(`Tổng số ${String(s)} không hợp lệ`);
  const tren = ((tongTren - 1) % 8) + 1;
  const duoi = ((tongDuoi - 1) % 8) + 1;
  const dong = ((tongDong - 1) % 6) + 1;
  const vach = [...quai(duoi).vach, ...quai(tren).vach];
  const g = gieo(vach.map((v, i): Hao => (i + 1 === dong ? (v === 1 ? 9 : 6) : v === 1 ? 7 : 8)));
  const [dung, the] = dong <= 3 ? [duoi, tren] : [tren, duoi]; // 動者為用，靜者為體
  const ht = quai(the).hanh;
  const hd = quai(dung).hanh;
  const quanHe: QuanHe = ht === hd ? 'tyHoa' : SINH[hd] === ht ? 'dungSinhThe' : KHAC[ht] === hd ? 'theKhacDung' : SINH[ht] === hd ? 'theSinhDung' : 'dungKhacThe';
  return { ...g, tren, duoi, the, dung, quanHe };
}

export interface MaiHoaGio extends MaiHoa { readonly am: NgayAm; readonly soNam: number; readonly soGio: number }

/**
 * Mai Hoa theo gio: so nam = chi nam am (Tý 1 … Hợi 12, nam tu Tet), thang va ngay am (+7; thang nhuan lay so thang),
 * so gio = chi gio. Tu 23 gio tinh sang ngay sau, gio Tý (`QUY_UOC` muc 4, anh chot 15/10).
 */
export function maiHoaTheoGio(d: NgayDuong, gio: number): MaiHoaGio {
  if (!Number.isInteger(gio) || gio < 0 || gio > 23) throw new RangeError(`Giờ ${String(gio)} ngoài 0–23`);
  const am = duongSangAm(gio === 23 ? tuSoNgay(soNgay(d) + 1) : d);
  const soNam = ((((am.nam - 4) % 12) + 12) % 12) + 1;
  const soGio = (Math.floor((gio + 1) / 2) % 12) + 1;
  const tong = soNam + am.thang + am.ngay;
  return { ...maiHoaTuSo(tong, tong + soGio, tong + soGio), am, soNam, soGio };
}
