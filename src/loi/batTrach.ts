/**
 * Bat trach: tu cung phi (`KetQuaHoSo.cungPhi`, nam theo Lap Xuan — QUY_UOC muc 1, tuy chon `namCungPhi`) ra 8 huong.
 * Bang chuan (wiki.batdongsan, vatphamphongthuy, blogphongthuy, happynest, mytour); thuoc `tests/BatTrach.test.ts`
 * dung lai bang tu phep bien hao Du Nien de kiem. Nghia 8 sao: Claude soan lai sau khi tong hop (`docs/LUAN_BAT_TRACH.md` muc 2).
 */
export interface Huong { readonly sao: string; readonly huong: string; readonly tot: boolean; readonly nghia: string }
export interface BatTrach { readonly nhom: 'Đông tứ mệnh' | 'Tây tứ mệnh'; readonly huong: readonly Huong[] }

/** Thu tu: 4 cat tu manh toi nhe, roi 4 hung tu nang toi nhe (cac phai cung xep Tuyet Menh nang nhat, Hoa Hai nhe nhat). */
const SAO: readonly (readonly [string, string])[] = [
  ['Sinh Khí', 'Tốt nhất: sinh lực, tài lộc, danh tiếng — hợp hướng cửa chính, hướng ngồi làm việc.'],
  ['Thiên Y', 'Tốt nhì: sức khỏe, quý nhân giúp, hồi phục — hợp hướng đầu giường, hướng đun bếp.'],
  ['Diên Niên', 'Tốt ba: hòa thuận, vợ chồng, quan hệ bền lâu — hợp phòng ngủ vợ chồng, phòng khách.'],
  ['Phục Vị', 'Tốt vừa: bình yên, vững tâm, học hành — hợp bàn thờ, bàn học.'],
  ['Tuyệt Mệnh', 'Xấu nhất: hao tổn sức khỏe, đổ vỡ lớn — tránh cửa chính, đầu giường; hợp nhà vệ sinh, kho.'],
  ['Ngũ Quỷ', 'Xấu nhì: thị phi, mất của, cháy nổ — tránh cửa, giường; hợp nhà vệ sinh, kho.'],
  ['Lục Sát', 'Xấu ba: tình cảm rối, kiện tụng, mất tiền vì người — tránh phòng ngủ.'],
  ['Họa Hại', 'Xấu nhẹ: phiền toái nhỏ, thị phi vặt — tránh chỗ ngồi lâu.'],
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
