/**
 * Phi tinh nam, thang (dot 5, QUY_UOC muc 22): sao giua tu thu vien — nam doi o Lap Xuan, thang o tiet, dung thoi khac
 * (QUY_UOC muc 1, 2), xet luc 12:00 gio VN; 8 sao con bay thuan theo duong Lac Thu. Huong ky nam: Thai Tue (chi nam),
 * Tue Pha (chi doi), Tam Sat (tam hop doi dien), Ngu Hoang, Nhi Hac. Ten sao, tiet qua bang Han–Viet (luat 4).
 */
import { NineStar, Solar } from 'lunar-typescript';
import { CAN, CHI, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';
import { phuong } from './laBan.ts';

/** Duong bay Lac Thu: o thu i nhan sao (giua + i). */
export const DUONG_BAY = ['Giữa', 'Tây Bắc', 'Tây', 'Đông Bắc', 'Nam', 'Bắc', 'Tây Nam', 'Đông', 'Đông Nam'] as const;
export type O = (typeof DUONG_BAY)[number];

export interface Sao { readonly so: number; readonly ten: string; readonly tenHuyenKhong: string; readonly tot: boolean; readonly nghia: string }
/** Mot ban cuu cung: `o[huong]` la sao dang o huong do. */
export interface Ban { readonly giua: number; readonly o: Readonly<Record<O, Sao>> }
/** `son`: cac son (24 son) bi chiem; khong co thi chiem ca huong (45°). */
export interface HuongKy { readonly ten: string; readonly huong: O; readonly son?: readonly string[]; readonly nghia: string }
export interface PhiTinh {
  readonly canChiNam: string;
  readonly nam: Ban;
  readonly thang: Ban;
  /** Tiet mo dau thang nay va ngay giao tiet (gio VN). */
  readonly tiet: { readonly ten: string; readonly ngay: NgayDuong };
  readonly ky: readonly HuongKy[];
}

// Loi giai Claude soan lai theo nghia pho bien (QUY_UOC muc 22); tot/xau lay tu thu vien (玄空 吉/凶).
const NGHIA = [
  'Học hành, công danh, tình duyên; Vận 9 (2024–2043) là sinh khí.',
  'Sao bệnh: dễ ốm đau; tránh kê giường, tránh động thổ phía này.',
  'Sao thị phi: dễ cãi cọ, kiện tụng.',
  'Sao văn xương: lợi học hành, thi cử, viết lách.',
  'Sao xấu nhất: tai họa, bệnh nặng; tránh động thổ, sửa chữa phía này.',
  'Quyền lực, quý nhân, tiền bạc.',
  'Dễ mất trộm, hao tài, va chạm.',
  'Sao tài lộc; từ Vận 9 (2024) nhiều thầy coi là đã thoái khí, kém trước.',
  'Sao vượng của Vận 9: hỷ sự, danh tiếng, may mắn.',
];

function sao(so: number): Sao {
  const n = NineStar.fromIndex(so - 1);
  return {
    so,
    ten: `${hv('cuuTinh', n.getNumber())} ${hv('cuuTinh', n.getColor())}`,
    tenHuyenKhong: hv('cuuTinh', n.getNameInXuanKong()),
    tot: n.getLuckInXuanKong() === '吉',
    nghia: NGHIA[so - 1] ?? '',
  };
}

export function ban(giua: number): Ban {
  return { giua, o: Object.fromEntries(DUONG_BAY.map((h, i) => [h, sao(((giua - 1 + i) % 9) + 1)])) as Record<O, Sao> };
}

const oCua = (b: Ban, so: number): O => DUONG_BAY.find((h) => b.o[h].so === so) ?? 'Giữa';
const huongChi = (chi: number): O => phuong(chi * 30).huong as O;
const tenChi = (chi: number): string => hv('chi', CHI.charAt(((chi % 12) + 12) % 12));

/** Huong ky cua nam: chi nam (theo Lap Xuan) + ban nam. */
export function huongKy(chiNam: number, nam: Ban): HuongKy[] {
  // Tam Sat: tam hop cua chi nam co chi vuong (Ty, Mao, Ngo, Dau); sat o ba son quanh chi doi dien chi vuong do.
  const vuong = [0, 3, 6, 9].find((x) => (x - chiNam + 12) % 4 === 0) ?? 0;
  const sat = (vuong + 6) % 12;
  return [
    { ten: 'Thái Tuế', huong: huongChi(chiNam), son: [tenChi(chiNam)], nghia: 'Phía này nên để yên, kỵ động thổ, sửa lớn; tựa lưng về được, kỵ quay mặt về.' },
    { ten: 'Tuế Phá', huong: huongChi(chiNam + 6), son: [tenChi(chiNam + 6)], nghia: 'Đối Thái Tuế: kỵ động thổ, sửa chữa phía này.' },
    { ten: 'Tam Sát', huong: huongChi(sat), son: [tenChi(sat - 1), tenChi(sat), tenChi(sat + 1)], nghia: 'Kỵ động thổ; kỵ nhất đặt lưng (tọa) về phía này.' },
    { ten: 'Ngũ Hoàng', huong: oCua(nam, 5), nghia: NGHIA[4] ?? '' },
    { ten: 'Nhị Hắc', huong: oCua(nam, 2), nghia: NGHIA[1] ?? '' },
  ];
}

/** Hien tai `ngay` (gio VN): lay luc 12:00 VN = 13:00 Bac Kinh, sect 3 = dung thoi khac Lap Xuan, giao tiet. */
export function phiTinh(ngay: NgayDuong): PhiTinh {
  const l = Solar.fromYmdHms(ngay.nam, ngay.thang, ngay.ngay, 13, 0, 0).getLunar();
  const nam = ban(l.getYearNineStar(3).getIndex() + 1);
  const tiet = l.getPrevJie();
  const s = tiet.getSolar().nextHour(-1);
  return {
    canChiNam: `${hv('can', CAN.charAt(l.getYearGanIndexExact()))} ${hv('chi', CHI.charAt(l.getYearZhiIndexExact()))}`,
    nam,
    thang: ban(l.getMonthNineStar(3).getIndex() + 1),
    tiet: { ten: hv('tietKhi', tiet.getName()), ngay: { nam: s.getYear(), thang: s.getMonth(), ngay: s.getDay() } },
    ky: huongKy(l.getYearZhiIndexExact(), nam),
  };
}
