/**
 * Loi luan phi tinh (`phiTinhLuan.ts`), Claude soan moi (luat 6). Nguon, ly do chot: `docs/LUAN_PHI_TINH.md` (cach tinh, bang: QUY_UOC
 * muc 22).
 */

/** Sao vao giua ban nam: noi chung ca nha nam nay (thu tu 1–9). */
export const GIUA: readonly string[] = [
  'Nhất Bạch vào giữa: năm êm, hợp học hành, gây dựng từ từ; việc trong nhà nên giữ nếp, đừng sửa lớn giữa nhà.',
  'Nhị Hắc vào giữa: năm cần giữ sức khỏe cả nhà; giữa nhà nên gọn, thoáng.',
  'Tam Bích vào giữa: năm dễ nói qua nói lại; trong nhà nhường lời.',
  'Tứ Lục vào giữa: năm hợp học hành, viết lách; giữ giữa nhà sáng sủa.',
  'Ngũ Hoàng vào giữa: năm nên yên, việc sửa lớn trong nhà để năm khác.',
  'Lục Bạch vào giữa: năm có quý nhân, việc làm có người đỡ.',
  'Thất Xích vào giữa: năm đề phòng mất mát, lời qua tiếng lại; cửa nẻo cẩn thận.',
  'Bát Bạch vào giữa: năm bình ổn về tiền bạc; giữ, đừng liều.',
  'Cửu Tử vào giữa: năm sao vượng của vận 9 về giữa — nhiều tin vui; giữ lửa, điện an toàn.',
];

export const DE_YEN = (ds: string): string => `Nên để yên năm nay (không động thổ, không sửa lớn): ${ds}.`;
export const THUAN = (ds: string): string => `Hướng thuận năm nay (đặt phòng làm việc, bàn học, cửa hay dùng): ${ds}.`;
export const THANG_NANG = (ds: string): string => `Tháng này nặng nhất: ${ds} — sao xấu năm và tháng chồng lên nhau; để yên hẳn, người ốm đừng nằm phía đó.`;
export const THANG_THUAN = (ds: string): string => `Tháng này thuận nhất: ${ds} — sao tốt năm và tháng cùng về.`;
export const THANG_THUONG = 'Tháng này không hướng nào có sao xấu năm và tháng chồng nhau.';

export const VAN = [
  'Vận 9 (2024–2043): Cửu Tử là sao vượng, Nhất Bạch là sao sẽ lên (sinh khí); các thầy nay cùng nói.',
  'Bát Bạch: vận 8 là sao tài vượng nhất; sang vận 9 nhiều thầy coi đã thoái khí, có thầy vẫn coi tốt — app vẫn tô màu tốt theo thư viện, '
    + 'nhưng không coi là sao tài như trước.',
] as const;

export const VIEC = [
  'Sửa nhà, động thổ: tránh các hướng "nên để yên" ở trên; việc gấp thì sửa phần khác trước.',
  'Giường người ốm, người già: tránh hướng có Nhị Hắc, Ngũ Hoàng năm hoặc tháng.',
] as const;

export const BAN_HOC = (ds: string): string => `Bàn học: đặt ở ${ds} — có Tứ Lục hoặc Nhất Bạch năm nay (cách dùng phổ biến hiện nay).`;
export const BAN_HOC_GIUA = 'Bàn học: năm nay Tứ Lục, Nhất Bạch không rơi vào hướng nào dùng được — đặt chỗ sáng, yên là đủ.';

export const NHAC = [
  'Sách lịch chính thức đời Thanh chỉ coi Tử Bạch là sao phụ khi chọn hướng sửa nhà; nhà thoáng, chắc, sáng sủa vẫn là chính.',
  'Không cần mua vật phẩm "hóa giải" (chuông gió, hồ lô, tượng…): sách cổ không dạy; để yên phía có sao xấu là đủ.',
  'Phi tinh là cách xem xưa, không có cơ sở khoa học.',
] as const;
