/**
 * La ban (dot 5, QUY_UOC muc 20): so do theo bac tu (0 = Bac, theo chieu kim dong ho) ra 24 son, 8 huong, toa.
 * Dung o cua chinh, lung vao nha, dau may chi ra ngoai: so do la huong nha, nguoc lai 180° la toa.
 * Moi son 15°, Nham bat dau 337,5°; ranh thuoc son sau (7,5° la Quy). Ten son qua bang Han–Viet (luat 4).
 */
import { CAN, CHI } from './amLich.ts';
import { hv } from './hanViet/index.ts';

const SON = '壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥';
// 8 huong theo thu tu Bac → Tay Bac, ten trung `batTrach`; quai Hau Thien cua tung huong.
const HUONG = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'] as const;
const QUAI = '坎艮震巽离坤兑乾';

export interface Phuong { readonly do: number; readonly son: string; readonly huong: string; readonly quai: string }
/** `satRanh`: cach ranh son gan nhat duoi `RANH`°, `ke` la son ben kia ranh (doi ca huong neu `ke.huong` khac). */
export interface XemLaBan { readonly huong: Phuong; readonly toa: Phuong; readonly satRanh: { readonly ke: Phuong; readonly cach: number } | null }

/** La ban dien thoai sai vai do (ke hoach dot 5): sat ranh duoi 3° thi nhac do lai. */
export const RANH = 3;

const tenSon = (c: string): string => hv(CAN.includes(c) ? 'can' : CHI.includes(c) ? 'chi' : 'batQuai', c);
const chuan = (d: number): number => ((d % 360) + 360) % 360;

export function phuong(d: number): Phuong {
  const x = chuan(d);
  const i8 = Math.floor(chuan(x + 22.5) / 45);
  return {
    do: x,
    son: tenSon(SON.charAt(Math.floor(chuan(x + 22.5) / 15))),
    huong: HUONG[i8] ?? '',
    quai: hv('batQuai', QUAI.charAt(i8)),
  };
}

export function xemLaBan(d: number): XemLaBan {
  if (!Number.isFinite(d)) throw new Error('Số độ không hợp lệ');
  const x = chuan(d);
  const du = chuan(x - 7.5) % 15; // do tinh tu ranh duoi cua son dang dung
  const cach = Math.min(du, 15 - du);
  return {
    huong: phuong(x),
    toa: phuong(x + 180),
    satRanh: cach < RANH ? { ke: phuong(du < 7.5 ? x - du - 7.5 : x + (15 - du) + 7.5), cach } : null,
  };
}
