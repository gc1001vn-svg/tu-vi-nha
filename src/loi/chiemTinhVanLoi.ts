/**
 * Loi van chiem tinh (tang 3) — Claude tong hop, soan moi (luat 6): hanh tinh cham di qua diem goc (cach dung pho bien tu xua toi
 * nay; Robert Hand *Planets in Transit* — kien thuc chung), chu ky doi (Sao Tho tro ve…), nam xoay theo tuoi (profection, phai Hy Lap
 * co phuc hoi), Mat Trang tien hoa (secondary progression, hien dai). Ly do, trong so: `docs/LUAN_CHIEM_TINH.md` muc 4.
 */

/** Hanh tinh cham 5..9 (thu tu `DIEM`) tao goc voi diem goc: [thuan (luc hop, tam hop), cang (vuong, doi), hop (trung)]. */
export const QUA: Readonly<Record<number, readonly [string, string, string]>> = {
  5: ['mở rộng, gặp may, được giúp — nên chủ động nắm cơ hội', 'dễ quá đà: hứa nhiều, tiêu nhiều, ôm đồm — nên biết đủ',
    'chu kỳ mở rộng mới bắt đầu, nhiều cơ hội'],
  6: ['việc thành nhờ kiên trì, công sức được ghi nhận, nền móng vững thêm', 'thử thách, gánh nặng, chậm trễ — cần kỷ luật, kiên nhẫn; '
    + 'qua rồi sẽ vững hơn', 'bắt đầu chu kỳ trách nhiệm mới, phải sắp xếp lại đời sống'],
  7: ['đổi mới thuận lợi, cơ hội bất ngờ, muốn tự do', 'biến động đột ngột, muốn phá khuôn — tránh quyết định vội', 'bước ngoặt bất ngờ, đổi hướng'],
  8: ['trực giác, cảm hứng, lòng trắc ẩn tăng — hợp sáng tạo, tâm linh', 'mơ hồ, dễ nhầm lẫn, bị lừa hay mất phương hướng — cần tỉnh '
    + 'táo, kiểm tra kỹ', 'giai đoạn buông bỏ cái cũ, mơ ước mới, ranh giới mờ'],
  9: ['sức mạnh nội tâm, cải tổ thuận lợi', 'biến đổi sâu, áp lực quyền lực, kết thúc để bắt đầu lại', 'lột xác, thay đổi tận gốc'],
};

/** Viec cua diem goc bi cham toi (0..4 thien the, 11 cung Moc, 12 Thien Dinh). */
export const VUNG: Readonly<Record<number, string>> = {
  0: 'bản thân, sức sống, mục tiêu', 1: 'cảm xúc, gia đình, nhà cửa', 2: 'suy nghĩ, học hành, giấy tờ, đi lại',
  3: 'tình cảm, tiền bạc, các mối quan hệ', 4: 'sức hành động, công việc cạnh tranh', 11: 'bản thân, hình ảnh, sức khỏe',
  12: 'sự nghiệp, danh tiếng',
};

/** Chu ky doi: hanh tinh cham tao goc voi chinh no luc sinh ("sao-goc"). */
export const CHU_KY: Readonly<Record<string, string>> = {
  '5-0': 'Sao Mộc trở về (12 năm một lần): chu kỳ mở rộng mới — hợp học, đi xa, bắt đầu việc lớn.',
  '6-0': 'Sao Thổ trở về (khoảng 29–30 và 58–59 tuổi): mốc trưởng thành — sắp lại công việc, gia đình, tự chịu trách nhiệm trọn vẹn.',
  '6-2': 'Sao Thổ vuông chính nó (khoảng 7, 21–22, 36–37, 51–52 tuổi): mốc phải điều chỉnh, sửa lại cái chưa vững.',
  '6-4': 'Sao Thổ đối chính nó (khoảng 14–15, 44–45 tuổi): đối diện kết quả những gì đã dựng, cân lại hướng đi.',
  '7-2': 'Thiên Vương vuông chính nó (khoảng 20–21, 61–63 tuổi): muốn tự do, đổi cách sống.',
  '7-4': 'Thiên Vương đối chính nó (khoảng 40–42 tuổi): tuổi giữa đời — muốn sống thật hơn với mình, dễ đổi hướng.',
  '8-2': 'Hải Vương vuông chính nó (khoảng 40–44 tuổi): mơ ước cũ phai, đi tìm ý nghĩa mới.',
  '9-2': 'Diêm Vương vuông chính nó (tuổi tùy thế hệ, nhiều người khoảng 36–45): biến đổi sâu về quyền lực, giá trị sống.',
};

export const VONG_NAM = 'Năm xoay theo tuổi (lối cổ): năm tuổi tròn {n} ứng nhà {h} ({ten}), chủ năm là {sao} — việc {ten} nổi lên; '
  + 'những gì {sao} gặp trong năm đáng để ý.';
export const TIEN_HOA = 'Mặt Trăng tiến hóa (một ngày sau sinh ứng một năm đời) đang ở {cung} khoảng hai năm rưỡi: cảm xúc, nhu cầu '
  + 'nghiêng về kiểu {kieu}.';

export const KET_VAN = {
  thuan: 'Mười hai tháng tới nhìn chung thuận — góc thuận của hành tinh chậm nhiều hơn góc căng.',
  vua: 'Mười hai tháng tới tốt xấu xen nhau.',
  kho: 'Mười hai tháng tới nhiều thử thách — góc căng của hành tinh chậm nổi hơn; giữ nhịp, đừng vội.',
  em: 'Mười hai tháng tới không có góc lớn nào của hành tinh chậm tới điểm chính: một năm tương đối êm.',
} as const;
