/**
 * Bat trach: tu cung phi (`KetQuaHoSo.cungPhi`, nam theo Lap Xuan — QUY_UOC muc 1, tuy chon `namCungPhi`) ra 8 huong.
 * Bang chuan (wiki.batdongsan, vatphamphongthuy, blogphongthuy, happynest, mytour); thuoc `tests/BatTrach.test.ts`
 * dung lai bang tu phep bien hao Du Nien de kiem. Loi nghia do Claude soan lai theo quan niem dan gian.
 */
export interface Huong { readonly sao: string; readonly huong: string; readonly tot: boolean; readonly nghia: string }
export interface BatTrach { readonly nhom: 'Đông tứ mệnh' | 'Tây tứ mệnh'; readonly huong: readonly Huong[] }

const SAO: readonly (readonly [string, string])[] = [
  ['Sinh Khí', 'Tốt nhất: hợp cửa chính, bàn làm việc; chủ tài lộc, công danh.'],
  ['Thiên Y', 'Tốt cho sức khỏe: hợp phòng ngủ, bếp.'],
  ['Diên Niên', 'Giữ gia đạo, vợ chồng bền lâu.'],
  ['Phục Vị', 'Yên ổn: hợp bàn thờ, góc học.'],
  ['Tuyệt Mệnh', 'Xấu nhất: tránh đặt cửa chính, giường ngủ.'],
  ['Ngũ Quỷ', 'Dễ thị phi, hao tài.'],
  ['Lục Sát', 'Dễ bất hòa, kiện tụng.'],
  ['Họa Hại', 'Hay gặp chuyện phiền nhỏ.'],
];

// Huong theo thu tu SAO: Sinh Khi, Thien Y, Dien Nien, Phuc Vi, Tuyet Menh, Ngu Quy, Luc Sat, Hoa Hai.
const BANG: Readonly<Record<string, readonly string[]>> = {
  Khảm: ['Đông Nam', 'Đông', 'Nam', 'Bắc', 'Tây Nam', 'Đông Bắc', 'Tây Bắc', 'Tây'],
  Ly: ['Đông', 'Đông Nam', 'Bắc', 'Nam', 'Tây Bắc', 'Tây', 'Tây Nam', 'Đông Bắc'],
  Chấn: ['Nam', 'Bắc', 'Đông Nam', 'Đông', 'Tây', 'Tây Bắc', 'Đông Bắc', 'Tây Nam'],
  Tốn: ['Bắc', 'Nam', 'Đông', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây', 'Tây Bắc'],
  Càn: ['Tây', 'Đông Bắc', 'Tây Nam', 'Tây Bắc', 'Nam', 'Đông', 'Bắc', 'Đông Nam'],
  Khôn: ['Đông Bắc', 'Tây', 'Tây Bắc', 'Tây Nam', 'Bắc', 'Đông Nam', 'Nam', 'Đông'],
  Cấn: ['Tây Nam', 'Tây Bắc', 'Tây', 'Đông Bắc', 'Đông Nam', 'Bắc', 'Đông', 'Nam'],
  Đoài: ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây', 'Đông', 'Nam', 'Đông Nam', 'Bắc'],
};

export function batTrach(cungPhi: string): BatTrach {
  const ds = BANG[cungPhi];
  if (ds === undefined) throw new Error(`Không có cung phi "${cungPhi}"`);
  return {
    nhom: ['Khảm', 'Ly', 'Chấn', 'Tốn'].includes(cungPhi) ? 'Đông tứ mệnh' : 'Tây tứ mệnh',
    huong: SAO.map(([sao, nghia], i) => ({ sao, huong: ds[i] ?? '', tot: i < 4, nghia })),
  };
}
