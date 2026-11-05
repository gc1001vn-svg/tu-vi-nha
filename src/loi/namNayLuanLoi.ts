/**
 * Loi luan nam nay (`namNayLuan.ts`), Claude soan moi (luat 6) tu nguon da doc 20/10 (QUY_UOC muc 14: kinh 1308, 1311, Ngoc Hap Ky, chua
 * Nhat, bach khoa Han, Tam Menh Thong Hoi, lap truong Phat giao, cong van Bo VHTTDL). Ly do chot: `docs/LUAN_NAM_NAY.md`.
 */

export const KET = {
  thuan: 'Kết: năm tương đối êm — mục tốt nhiều hơn, ít vướng Thái Tuế, Tam Tai.',
  vua: 'Kết: năm bình thường — có mục tốt, có mục cần để ý; làm việc vừa sức.',
  kho: 'Kết: năm cần giữ gìn hơn — nhiều mục xấu chồng lên nhau; việc lớn nên chậm và chắc.',
} as const;

/** Sao chieu menh: chot theo cach chia ba cua Viet (anh chot 20/10), ghi them cho nguon goc xep khac. */
export const SAO_Y: Readonly<Record<string, string>> = {
  'Thái Dương': 'Sao Thái Dương tốt theo mọi nguồn (kinh gốc xếp đại cát, chùa Nhật cũng vậy): thuận cho công việc, dễ được người giúp.',
  'Thái Âm': 'Sao Thái Âm tốt theo mọi nguồn (kinh gốc đại cát, chùa Nhật đại cát hoặc trung cát): tiền bạc, gia đạo yên.',
  'Mộc Đức': 'Sao Mộc Đức tốt theo mọi nguồn: hòa thuận, dễ có tin vui.',
  'La Hầu': 'Sao La Hầu xấu theo mọi nguồn (kinh gốc xếp đại hung; nam nặng hơn nữ): giữ lời nói, đọc kỹ giấy tờ.',
  'Kế Đô': 'Sao Kế Đô xấu theo mọi nguồn (nữ nặng hơn nam): giữ hòa khí trong nhà, chi tiêu dè dặt.',
  'Thái Bạch': 'Sao Thái Bạch: tục Việt xếp xấu (hao tài), kinh gốc xếp nhẹ hoặc tốt — giữ tiền, tránh cho vay là đủ, không cần lo quá.',
  'Thổ Tú': 'Sao Thổ Tú: tục Việt xếp trung tính, kinh gốc và chùa Nhật xếp xấu — cẩn thận hơn mức trung tính với giấy tờ, người lạ.',
  'Thủy Diệu': 'Sao Thủy Diệu: tục Việt xếp trung tính, nhiều trang và kinh gốc xếp tốt (phúc lộc) — năm có lộc, chỉ cần giữ lời nói.',
  'Vân Hớn': 'Sao Vân Hớn: tục Việt xếp trung tính, kinh gốc và chùa Nhật xếp xấu (sao Hỏa) — dễ nóng nảy, cãi vã: nhịn một câu.',
};

const TT: Readonly<Record<string, string>> = {
  Trị: 'năm tuổi — nhiều việc tự mình gánh', Xung: 'xung — dễ thay đổi lớn chỗ ở, việc làm', Hình: 'hình — dễ thị phi, kiện tụng',
  Hại: 'hại — dễ gặp tiểu nhân', Phá: 'phá — dễ sứt mẻ quan hệ, hao tài',
};
export const THAI_TUE_Y = {
  khong: 'Không phạm Thái Tuế: phần được nhiều nước cùng xem nhất (Trung Hoa, Đài Loan, Hàn, Việt) năm nay yên.',
  co: (ds: readonly string[]): string => `Phạm Thái Tuế (${ds.map((k) => TT[k] ?? k).join('; ')}): đây là phần được nhiều nước cùng xem nhất; `
    + 'năm tuổi và năm xung nặng hơn hình, hại, phá — làm gì cũng nên chậm và chắc.',
} as const;

export const TAM_TAI_Y = (ten: string): string => `Đang Tam Tai (${ten}): Việt và Hàn cùng cách tính; bách khoa Hàn ghi năm đầu nặng nhất. `
  + 'Việc lớn không gấp thì để sau.';

export const HAN_Y = (ten: string): string => `Hạn ${ten}: năm nào ai cũng gặp một trong tám hạn, lại chưa thấy gốc sách ngoài Việt Nam — coi là `
  + 'lời nhắc nhẹ, không tính vào kết.';

export const VIEC = {
  nho: 'Dưới 10 tuổi mụ: các bảng làm nhà, cưới hỏi chưa xét.',
  nhaDuoc: 'Làm nhà: Kim Lâu, Hoang Ốc, Tam Tai đều không phạm — theo tục là đứng tên làm được.',
  nhaKieng: (ds: string): string => `Làm nhà: phạm ${ds} — theo tục kiêng đứng tên làm nhà năm nay; cần làm thì tục thường mượn tuổi một `
    + 'người không phạm đứng ra động thổ.',
  cuoiKimLau: 'Cưới hỏi: phạm Kim Lâu — tục xét theo tuổi cô dâu; nữ sắp cưới thì nhiều nhà dời năm hoặc chọn ngày kỹ.',
  cuoiTamTai: 'Cưới hỏi: không phạm Kim Lâu; đang Tam Tai — có nơi kiêng, có nơi không.',
  cuoiDuoc: 'Cưới hỏi: không phạm Kim Lâu, không Tam Tai.',
  khoiSuCham: 'Khởi sự làm ăn lớn: đang Tam Tai hoặc xung Thái Tuế — tục khuyên chậm lại, chuẩn bị kỹ, đừng dồn hết vốn.',
  khoiSu: 'Khởi sự làm ăn: không vướng Tam Tai, xung Thái Tuế.',
} as const;

export const NHAC = 'Đây là tục xem năm theo tuổi (gốc từ kinh Mật tông đời Đường và lịch Trung Hoa). Đạo Phật không có sao tốt, sao xấu; '
  + 'Bộ Văn hóa (2019) đề nghị chấn chỉnh dâng sao giải hạn trục lợi — không cần tốn tiền giải hạn, coi là lời nhắc sống cẩn thận.';
