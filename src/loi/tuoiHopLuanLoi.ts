/**
 * Loi luan tuoi hop (`tuoiHopLuan.ts`), Claude soan moi (luat 6). Nguon, ly do chot: `docs/LUAN_TUOI_HOP.md` (bang chi: QUY_UOC muc 14).
 */

export const MUC = {
  rat: (ds: string): string => `Hợp nhất: ${ds} — tam hợp, lục hợp; làm ăn, kết bạn, cưới hỏi đều thuận.`,
  hopHinh: (ds: string): string => `Hợp mà có hình: ${ds} — dễ đến với nhau, sống chung hay va chạm; hợp được nếu biết nhường.`,
  binh: (ds: string): string => `Bình thường: ${ds} — không hợp, không kỵ; tùy tính nết từng người.`,
  ne: (ds: string): string => `Nên dè chừng: ${ds} — tương hình hoặc lục hại; dễ hiểu lầm, bất hòa ngầm, không đến mức phải tránh.`,
  ky: (ds: string): string => `Kỵ nhất: ${ds} — lục xung; tục xưa kiêng cưới hỏi, hùn hạp. Xung mà hai mệnh (nạp âm) sinh nhau thì sách cổ cho là bớt, có khi lại tốt.`,
} as const;

export const TU_HANH = (nhom: string, xung: string, khac: string): string => `Tục Việt gom ${nhom} thành "tứ hành xung", nhưng sách cổ chỉ coi `
  + `${xung} là xung; ${khac}. App theo sách cổ.`;
export const TU_HINH = 'Cùng tuổi: tuổi này tự hình (Thìn, Ngọ, Dậu, Hợi gặp nhau) — giống nhau quá dễ cùng nóng, cùng cố chấp.';
export const CUNG_TUOI = 'Cùng tuổi: tỷ hòa — dễ hiểu nhau.';
export const OAN_THAN = (ten: string): string => `Người Hàn kiêng thêm tuổi ${ten} ("oán thần" — dễ oán giận nhau); sách Trung Hoa, Việt không dùng, `
  + 'app chỉ ghi để biết.';

export const KET_CAP = {
  hop: 'Kết: hai tuổi hợp — chi, mệnh hay can có chỗ nâng nhau; nền thuận để cùng làm, cùng sống.',
  vua: 'Kết: hai tuổi bình thường — có chỗ hợp, có chỗ vướng; tính nết và cách cư xử quyết định nhiều hơn tuổi.',
  ky: 'Kết: hai tuổi nhiều chỗ kỵ — dễ va chạm; không phải không được, nhưng cần nhường nhau và nói rõ từ đầu.',
} as const;

export const CHI_Y = {
  tamHop: 'Địa chi tam hợp: cùng một nhóm khí, chí hướng gần nhau — chỗ hợp mạnh nhất.',
  lucHop: 'Địa chi lục hợp: một âm một dương bù nhau — dễ thương, dễ nâng đỡ nhau.',
  hopHinh: 'Địa chi vừa lục hợp vừa tương hình: sách cổ ví như vợ chồng hợp nhau mà lại làm khổ nhau — đến với nhau dễ, giữ được thì phải nhịn.',
  xung: 'Địa chi lục xung: hai tuổi đối nhau — tục xưa kiêng nhất trong việc cưới hỏi, làm ăn chung.',
  xungGiam: 'Địa chi lục xung, nhưng mệnh hai người sinh nhau: sách cổ nói xung mà sinh nhau thì có khi lại tốt — xung còn, nhưng bớt hẳn.',
  hinh: 'Địa chi tương hình: dễ làm tổn thương nhau bằng lời, bằng việc — cần mềm mỏng.',
  hai: 'Địa chi lục hại: dễ hiểu lầm, bất hòa ngầm — tục Trung Hoa có câu vè kiêng các cặp này khi cưới.',
  hinhHai: 'Địa chi vừa tương hình vừa lục hại: hai chỗ vướng chồng lên nhau — cần nhẫn nại hơn cả.',
  tuHinh: 'Cùng chi và là chi tự hình: giống nhau quá, dễ cùng nóng, cùng cố chấp.',
  cung: 'Cùng chi: tỷ hòa, dễ hiểu nhau.',
  binh: 'Địa chi không hợp không xung: trung tính.',
  oanThan: 'Cặp này người Hàn gọi là "oán thần" và kiêng; sách Trung Hoa, Việt không dùng — app không tính điểm.',
} as const;

export const MENH_Y = {
  sinh: (a: string, b: string): string => `Mệnh (nạp âm) ${a} sinh ${b}: một bên nâng đỡ bên kia — hợp.`,
  cung: (a: string): string => `Mệnh cùng hành ${a}: tỷ hòa, dễ đồng lòng (tục Việt có vài câu ngoại lệ như "lưỡng Hỏa thành viêm" — app không dùng).`,
  khac: (a: string, b: string): string => `Mệnh (nạp âm) ${a} khắc ${b}: một bên dễ lấn bên kia — cần nhường.`,
} as const;

export const CAN_Y = {
  hop: 'Thiên can ngũ hợp: hai can hợp nhau — thêm một chỗ gắn bó.',
  xung: 'Thiên can tương xung: thêm một chỗ dễ khác ý (nhẹ hơn chi xung).',
  binh: '',
} as const;

export const KHONG_DUNG = 'Không xét cung phi (Bát trạch) cho hai người: sách lịch chính thức đời Thanh ghi đó là phép nhà ở được mượn sang xem '
  + 'hợp hôn; muốn xem kỹ thì so cả lá số tử vi hoặc bát tự hai người.';

export const NHAC = [
  'Tuổi chỉ là năm sinh: cả nước có một phần mười hai người cùng con giáp — hợp tuổi không thay được tính nết, cách sống, sự tôn trọng nhau.',
  'Ngay ở Trung Hoa, Đài Loan, người xem số cũng nói bảng hợp tuổi theo con giáp chỉ là phép thô, "không đủ tin"; đừng vì tuổi mà bỏ '
    + 'một mối tốt, hay ép một mối không hợp.',
  'Không có cơ sở khoa học.',
] as const;
