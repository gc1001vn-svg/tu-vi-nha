/**
 * Noi sinh: 63 tinh, thanh pho truoc sap nhap 07/2025 (ten nhu luc sinh — anh chot 19/10), + "Nuoc ngoai".
 * Mien chi de chon bang mui gio lich su (`muiGio.ts`, `docs/QUY_UOC.md` muc 7): "nam" = phia nam vi tuyen 17.
 * Quang Tri tach doi vi song Ben Hai (vi tuyen 17) chay qua tinh: Vinh Linh o bac, Dong Ha o nam.
 */
export type Mien = 'bac' | 'nam';

export const NUOC_NGOAI = 'Nước ngoài';

const BAC = [
  'Hà Nội', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên', 'Lai Châu', 'Sơn La',
  'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn', 'Quảng Ninh', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh',
  'Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An',
  'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị (bắc sông Bến Hải)',
] as const;
const NAM = [
  'Quảng Trị (nam sông Bến Hải)', 'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên',
  'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Bình Phước',
  'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa – Vũng Tàu', 'TP. Hồ Chí Minh', 'Long An', 'Tiền Giang', 'Bến Tre',
  'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu',
  'Cà Mau',
] as const;

/** Theo thu tu bac → nam, dung luon cho o chon. */
export const TINH: readonly (readonly [ten: string, mien: Mien])[] = [
  ...BAC.map((t) => [t, 'bac'] as const),
  ...NAM.map((t) => [t, 'nam'] as const),
];

export function mienCua(ten: string): Mien | undefined {
  return TINH.find(([t]) => t === ten)?.[1];
}
