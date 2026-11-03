/**
 * Loi luan chon ngay (`chonNgayLuan.ts`), Claude soan moi (luat 6). Nguon, ly do chot: `docs/LUAN_CHON_NGAY.md` (bang, luat cham: QUY_UOC
 * muc 17–19).
 */

export const TONG = (viec: string, tot: number, duoc: number, tranh: number): string => `Tháng này cho việc ${viec}: ${String(tot)} ngày Tốt, `
  + `${String(duoc)} ngày Được, ${String(tranh)} ngày Tránh.`;
export const NEN = (ds: string): string => `Nên chọn nhất: ${ds}.`;
export const DO_NHAT = (ds: string): string => `Không có ngày Tốt. Đỡ nhất (không phạm kỵ nào, kể cả kỵ tục): ${ds} — việc không gấp thì xem tháng khác.`;
export const KHONG_CO = 'Không có ngày Tốt, cũng không có ngày Được nào sạch kỵ — việc không gấp thì xem tháng khác.';
export const DUC = 'có Thiên Đức, Nguyệt Đức hoặc Thiên Xá';

export const CAN_CU = [
  'Nặng nhất: Hoàng Đạo – Hắc Đạo, lịch ghi nên – kiêng việc này, ngày xung tuổi — sách lịch chính thức đời Thanh và lịch Việt cùng dùng.',
  'Sao Đức (Thiên Đức, Nguyệt Đức, Thiên Xá) giải được cái xấu nhẹ: sách lịch chính thức chia nên – kiêng sáu bậc, gặp Đức thì bậc giữa '
    + 'theo nên; xấu chồng lên nhau thì có Đức vẫn kiêng.',
  'Nguyệt Kỵ (mùng 5, 14, 23): sách lịch chính thức giữ, nhưng chỉ ghi việc nhỏ ngày này — việc lớn vẫn nên tránh.',
  'Dương Công Kỵ, Thọ Tử, Tam Nương, Sát Chủ: chỉ có trong tục (sách lịch chính thức bác Dương Công Kỵ, bỏ Thọ Tử, không có Tam Nương, '
    + 'Sát Chủ) — app hạ xuống "Được, có tục kiêng"; nhà nào giữ tục thì cứ tránh, các ngày Tốt đều không phạm.',
] as const;

export const THEO_VIEC: Readonly<Record<string, readonly string[]>> = {
  cuoiHoi: ['Cưới hỏi: xem thêm Kim Lâu theo tuổi cô dâu (khối "Năm …"); ngày không xung tuổi cả hai người — nhập lần lượt năm sinh từng người.'],
  dongTho: ['Động thổ, làm nhà: tuổi người đứng tên phạm Kim Lâu, Hoang Ốc, Tam Tai thì tục mượn tuổi người khác đứng tên; giờ khởi công chọn giờ Hoàng Đạo.'],
  khaiTruong: ['Khai trương: chọn thêm giờ Hoàng Đạo trong ngày (thẻ "Hôm nay"); việc buôn bán còn nhờ chuẩn bị hàng, người hơn ngày giờ.'],
  xuatHanh: ['Đi xa: ngày Khổng Minh, giờ Lý Thuần Phong là cách xem của lịch Việt — dùng thêm cho yên tâm; xem thời tiết, đường sá quan trọng hơn.'],
  muaXe: ['Mua xe: lịch không có mục riêng, app dùng mục giao dịch, nhận của; xem kỹ giấy tờ, chạy thử quan trọng hơn ngày.'],
};

export const NHAC = [
  'Lời tựa vua Càn Long cho bộ sách lịch chính thức: chọn ngày là để thuận theo trời đất khi làm việc lớn, còn những lời họa phúc rối rắm '
    + 'là lỗi của thầy thuật — đừng vì chuyện ngày mà bỏ việc nên làm.',
  'Việc gấp (cứu người, khám bệnh, việc công, việc theo lịch người khác) không cần đợi ngày.',
  'Chọn ngày là tục xưa, không có cơ sở khoa học.',
] as const;
