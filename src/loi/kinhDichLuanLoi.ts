/**
 * Loi luan que Kinh Dich (`kinhDichLuan.ts`), Claude soan moi (luat 6): khong ke sach, khong chep ban dich. Nguon, ly do chot:
 * `docs/LUAN_KINH_DICH.md` (nguyen van, luat doc: QUY_UOC muc 18).
 */

export const KET = {
  thuan: 'Kết: quẻ thuận — lời quẻ, lời hào nghiêng về tốt; việc hỏi có đà, cứ làm nhưng giữ đường ngay.',
  vua: 'Kết: quẻ lẫn — có chỗ được, có chỗ phải lo; kết quả tùy cách mình xử, không tự đến.',
  kho: 'Kết: quẻ khuyên thận trọng — lời quẻ, lời hào nghiêng về lo, hung; chưa nên vội, sửa mình và chờ thời.',
} as const;

/** Muc cat hung cua doan chinh (theo chu trong nguyen van; He Tu: cat hung = duoc mat, hoi lan = lo lang, vo cuu = kheo sua loi). */
export const MUC_DOAN = {
  tot: 'Đoạn đọc chính có chữ tốt (được việc).',
  vua: 'Đoạn đọc chính không nghiêng hẳn — có chữ "không lỗi", hoặc vừa tốt vừa lo.',
  xau: 'Đoạn đọc chính có chữ lo, nguy hoặc hung — điềm mất, phải liệu.',
  khong: 'Đoạn đọc chính không nói tốt xấu, chỉ nói tượng — đọc theo hình ảnh trong lời.',
} as const;

export const KHUYEN = {
  tien: 'Lời có ý "lợi đi tới, lợi qua sông lớn": hợp làm việc lớn, đi xa, bắt đầu.',
  dung: 'Lời có ý "tiến thì hung, đừng dùng": chưa nên ra tay, giữ yên chờ thời.',
  giu: 'Lời có ý "giữ chính thì tốt": làm đúng nếp, bền lòng, đừng đổi hướng vội.',
  doiCach: 'Lời có ý "cố giữ thì hung": cách đang làm không hợp — nên đổi cách.',
  sau: 'Lời có ý "cuối cùng tốt": đầu khó, kiên nhẫn thì sau được.',
  nguoi: 'Lời có ý "lợi gặp đại nhân": nên tìm người giỏi, người có đức giúp sức.',
  sua: 'Lời có ý "không lỗi": biết tự sửa sai thì không sao.',
  hetHoi: 'Lời có ý "hối tiếc mất đi": việc từng vướng nay gỡ được.',
} as const;

/** Vi tri hao (He Tu ha: hai nhieu khen, tu nhieu so, ba nhieu hung, nam nhieu cong; dau kho biet, cuoi de biet). */
export const VI_TRI: readonly string[] = [
  'Hào 1 là lúc việc mới manh nha, chưa thấy rõ — nên bắt đầu nhỏ, đừng vội.',
  'Hào 2 ở giữa quẻ dưới, vị trí hay được khen — làm phận mình cho tốt là được người biết tới.',
  'Hào 3 ở cuối quẻ dưới, chỗ chênh vênh hay gặp hung — cẩn thận, đừng liều.',
  'Hào 4 ở sát ngôi cao, vị trí hay phải lo sợ — gần người trên thì khiêm, dè dặt.',
  'Hào 5 là ngôi cao, vị trí hay có công — lúc làm chủ, quyết được việc.',
  'Hào 6 là chỗ tận cùng — việc đã tới đích; quá đà thì lật, biết dừng thì giữ được.',
];
export const TRUNG = 'Hào ở giữa (trung): biết vừa phải, không thái quá.';
export const CHINH = { dung: 'Hào đúng vị (dương ở chỗ dương, âm ở chỗ âm): làm đúng phận.', sai: 'Hào sai vị: làm việc chưa đúng chỗ, dễ vướng.' } as const;
export const UNG = { co: 'Có hào ứng: có người cùng chí ở phía bên kia.', khong: 'Không có hào ứng: phải tự lo, ít người hưởng ứng.' } as const;

export const TIEN_TRINH = {
  chu: (t: string): string => `Lúc này (quẻ chủ): ${t}.`,
  ho: (t: string): string => `Bên trong, quá trình (quẻ hỗ): ${t}.`,
  bien: (t: string): string => `Chiều hướng (quẻ biến): ${t}.`,
  khongBien: 'Không có hào động: việc còn đứng yên ở thế quẻ chủ, chưa có chiều đổi.',
  bienTot: 'Quẻ biến có lời tốt: việc đi về phía thuận.', bienXau: 'Quẻ biến có lời lo, hung: về sau cần giữ gìn hơn lúc đầu.',
} as const;

export const THE_DUNG = {
  tot: 'Thể – Dụng (Mai Hoa) thuận: việc hợp với mình.', xau: 'Thể – Dụng (Mai Hoa) nghịch: việc làm mình hao sức hoặc bị đè.',
} as const;

/** Viec hoi: [thuan, vua, kho]. */
export const VIEC: Readonly<Record<string, readonly [string, string, string]>> = {
  'Công việc, làm ăn': ['Có đà: mạnh dạn làm, giữ chữ tín.', 'Được một phần: làm từng bước, lo chỗ yếu trước.', 'Chưa phải lúc: giữ việc đang có, chuẩn bị kỹ rồi hãy làm.'],
  'Tiền bạc': ['Có lộc, thu được: đừng tham thêm quá sức.', 'Thu chi ngang: giữ, đừng liều.', 'Dễ hao: tránh vay mượn, đầu tư mới.'],
  'Tình cảm, hôn nhân': ['Hợp: thành thật thì bền.', 'Còn phải hiểu nhau thêm: đừng vội quyết.', 'Có trắc trở: nhường nhịn, chậm lại.'],
  'Sức khỏe': ['Khí lực tốt: giữ nếp sống.', 'Có lúc mệt: nghỉ đủ, ăn đều.', 'Nên giữ gìn: nghỉ ngơi, khám bệnh khi thấy lạ.'],
  'Đi xa, thi cử': ['Thuận: đi được, thi được nếu đã chuẩn bị.', 'Bình thường: chuẩn bị kỹ, đừng trông may.', 'Nên hoãn hoặc chuẩn bị thêm.'],
};
export const VIEC_NHAC = 'Mỗi lần gieo chỉ nên hỏi một việc; dòng hợp việc đang hỏi mới là lời đáp. Quẻ không thay việc khám bệnh, tính toán thật.';

export const NHAC = [
  'Một việc hỏi một lần: hỏi đi hỏi lại là nhờn, quẻ sau không tính.',
  'Kinh Dịch dạy tùy thời mà đổi cho hợp lẽ: lời quẻ là lời khuyên cách xử, không phải án định sẵn — người hiểu Dịch thì ít cần bói.',
  'Gieo quẻ là tục xưa, không có cơ sở khoa học: việc lớn nên quyết bằng tính toán, hỏi người hiểu việc.',
] as const;
