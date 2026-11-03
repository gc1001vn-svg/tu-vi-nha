/**
 * Loi luan que boi Kieu (`kieuLuan.ts`), Claude soan moi (luat 6): khong chep sach boi Kieu nao (sach con ban quyen). Nguon, ly do chot:
 * `docs/LUAN_BOI_KIEU.md` (chu, cach boi: QUY_UOC muc 17).
 */

/** Chu vui / buon trong cau (tieng Viet cua Truyen Kieu); bo chu da nghia ("tai" = tai nghe, "sang", "tan" dung rieng). */
export const TOT: readonly string[] = ['vui', 'mừng', 'sum vầy', 'sum họp', 'đoàn viên', 'đoàn tụ', 'phúc', 'may', 'lành', 'thỏa', 'thoả',
  'toại', 'phỉ', 'êm', 'yên', 'ấm', 'vinh', 'hiển', 'giàu', 'đền ơn', 'cứu', 'cười', 'thong dong', 'tươi', 'xứng', 'trọn', 'vẹn'];
export const XAU: readonly string[] = ['sầu', 'buồn', 'khóc', 'lệ', 'đau', 'oan', 'hận', 'tủi', 'thảm', 'đoạn trường', 'bạc mệnh', 'bạc phận',
  'tan tác', 'tan tành', 'tan nát', 'tan hoang', 'lìa', 'dở dang', 'lỡ', 'nhục', 'hờn', 'ghen', 'khổ', 'cực', 'tội', 'chết', 'thác', 'liều',
  'mất', 'trôi', 'phong trần', 'dập vùi', 'lao đao', 'truân chuyên', 'lừa', 'gian', 'ác', 'độc', 'đánh', 'ngục', 'giam', 'tai họa',
  'tai hoạ', 'họa', 'hoạ', 'vạ', 'lo', 'sợ', 'xót', 'não', 'ngán', 'chán', 'lẻ loi', 'đắng', 'cay', 'thiệt', 'phụ lòng', 'phụ tình',
  'phụ phàng', 'bơ vơ', 'long đong', 'éo le'];

/** Diem cua 21 doan truyen (thu tu `HOI`): +1 doan vui, −1 doan kho, 0 lan. */
export const HOI_DIEM: readonly number[] = [0, 0, 0, 1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 0, -1, 0, -1, 1, 1, -1, 1];

/** Diem bao cua tung doan (Claude doc canh truyen ra loi cho viec hoi). */
export const HOI_Y: readonly string[] = [
  'Cảnh mở đầu: tài và mệnh hay ngược nhau — việc có cái hay sẵn, nhưng đừng cậy tài.',
  'Cảnh gặp gỡ đầu tiên giữa lúc buồn: có người, có cơ hội mới đến khi mình đang chùng lòng.',
  'Cảnh mộng báo và tương tư: điều mong còn ở trong lòng, chưa thành việc; đừng để lo lắng dẫn đường.',
  'Cảnh hẹn ước: duyên, hợp tác đang thuận — lời hứa lúc này có giá trị, giữ cho trọn.',
  'Cảnh gia biến: tai họa đến bất ngờ từ bên ngoài; giữ người, giữ nhà trước, của cải sau.',
  'Cảnh bán mình chuộc cha: phải hy sinh cái riêng để cứu cái chung — được việc nhưng thiệt mình, cân nhắc kỹ.',
  'Cảnh trao duyên: phải nhường lại điều mình quý; buông được thì nhẹ, níu thì khổ.',
  'Cảnh theo Mã Giám Sinh: dễ gặp kẻ đội lốt tử tế — xem kỹ người trước khi giao việc, giao tiền.',
  'Cảnh lầu Ngưng Bích: một mình, chờ đợi, bị giữ chân — chưa phải lúc hành động.',
  'Cảnh mắc lừa Sở Khanh: lời hứa cứu giúp có thể là bẫy — chớ vội tin người lạ.',
  'Cảnh lầu xanh: phải làm điều trái lòng để sống — giữ lòng mình, chờ thời thoát ra.',
  'Cảnh gặp Thúc Sinh: có người thương, muốn giúp, nhưng người ấy không tự quyết được — lo trước chỗ vướng phía sau họ.',
  'Cảnh được chuộc về: thoát cảnh cũ, có chỗ nương; việc được người có quyền xét cho, nhưng chưa phải yên hẳn.',
  'Cảnh tiễn Thúc Sinh về: nên nói rõ mọi chuyện từ sớm — giấu thì sau khổ.',
  'Cảnh Hoạn Thư đánh ghen: người ngoài mặt ngọt, trong lòng ghen — đề phòng người có quyền ngấm ngầm.',
  'Cảnh trốn khỏi nhà họ Hoạn: thoát được nhưng còn long đong; có người giúp, đi tiếp phải thận trọng.',
  'Cảnh lại vào lầu xanh: điều tưởng thoát lại quay về — nhìn kỹ chỗ nương tựa mới.',
  'Cảnh gặp Từ Hải: quý nhân mạnh mẽ xuất hiện, nâng mình lên; dựa người mạnh thì cũng lo người ấy sa cơ.',
  'Cảnh báo ân báo oán: điều phải trả thì trả, điều đáng tha thì tha — lúc thuận để làm cho phân minh.',
  'Cảnh Từ Hải mắc mưu: tin lời hứa của kẻ mạnh mà hỏng việc lớn — chớ vội tin, chớ khuyên người khác liều.',
  'Cảnh đoàn tụ: sau bao trắc trở, việc trở về chỗ êm; giữ cái tình hơn cái cuồng vọng.',
];

export const KET = {
  tot: 'Kết: quẻ thuận — câu và cảnh truyện nghiêng về vui, được; việc hỏi có đà.',
  vua: 'Kết: quẻ lẫn — câu không nói rõ vui buồn, hoặc vừa vui vừa lo; ý nằm ở chỗ mình đối chiếu với việc thật.',
  xau: 'Kết: quẻ khó — câu và cảnh truyện nghiêng về buồn, lo; nên chậm lại, giữ mình.',
} as const;
export const CAU_Y = {
  tot: 'Câu rút có chữ vui, lành.', xau: 'Câu rút có chữ buồn, lo.', lan: 'Câu rút vừa có chữ vui vừa có chữ buồn.',
  khong: 'Câu rút không nói vui buồn rõ — đọc theo hình ảnh trong câu và cảnh truyện.',
} as const;

/** Nhan vat trong may cau: [mau tim, loi]. */
export const NGUOI: readonly (readonly [RegExp, string])[] = [
  [/(?<!\p{L})(Kim Trọng|chàng Kim|Kim lang|họ Kim|Kim)(?!\p{L})/u, 'Có Kim Trọng: người tình thủy chung, người cũ — chuyện tình cảm, chờ đợi.'],
  [/(?<!\p{L})(Thúy Vân|Thuý Vân|Vân)(?!\p{L})/u, 'Có Thúy Vân: người nhà gánh thay mình — nhờ được anh chị em.'],
  [/(?<!\p{L})(Từ Hải|Từ công|họ Từ|chàng Từ)(?!\p{L})/u, 'Có Từ Hải: quý nhân mạnh, có quyền — được giúp lớn, nhưng đừng xui người ấy liều.'],
  [/(?<!\p{L})(Thúc Sinh|Thúc lang|chàng Thúc|họ Thúc|Thúc ông|Thúc)(?!\p{L})/u, 'Có Thúc Sinh: người tốt mà mềm yếu, không tự quyết — đừng trông hết vào họ.'],
  [/(?<!\p{L})(Hoạn Thư|họ Hoạn|Hoạn)(?!\p{L})/u, 'Có Hoạn Thư: người có quyền ngấm ngầm, ghen — đề phòng kẻ ngoài mặt ngọt.'],
  [/(?<!\p{L})(Tú Bà|Mã Giám Sinh|họ Mã|Mã|Sở Khanh|Bạc Bà|Bạc Hạnh|Ưng|Khuyển)(?!\p{L})/u, 'Có kẻ lừa lọc trong truyện: đề phòng hứa hẹn suông, người mua bán lòng tin.'],
  [/(?<!\p{L})(Giác Duyên|Tam Hợp)(?!\p{L})/u, 'Có sư Giác Duyên: có người cứu lúc khó — nên nhận lời giúp ngay tình.'],
  [/(?<!\p{L})(Đạm Tiên)(?!\p{L})/u, 'Có Đạm Tiên: điềm báo, chuyện số phận — làm việc thiện, đừng để nỗi sợ dẫn đường.'],
  [/(?<!\p{L})(Hồ Tôn Hiến|Hồ công|họ Hồ)(?!\p{L})/u, 'Có Hồ Tôn Hiến: kẻ quyền thế mà lật lọng — chớ tin lời hứa đổi lấy sự quy phục.'],
  [/(?<!\p{L})(Vương Ông|Vương Quan|họ Vương|Vương)(?!\p{L})/u, 'Có nhà họ Vương: chuyện cha mẹ, anh em — việc nhà là chính.'],
];

/** 18 de muc cua thay boi Kieu xua (Phạm Đan Quế 1991 ke; ten muc, khong chep cau dap): [ten, thuan, lan, kho]. */
export const MUC: readonly (readonly [string, string, string, string])[] = [
  ['Vận cả năm', 'năm nhiều điều thuận, cứ làm việc chính cho đều.', 'năm có lên có xuống, giữ nếp là qua.', 'năm nhiều trắc trở, việc lớn để sau.'],
  ['Công danh', 'có cơ hội lên, nắm lấy.', 'thăng tiến chậm, làm cho chắc.', 'chưa tới lúc, đừng cố chen.'],
  ['Tiền của', 'có lộc vào, nhớ để dành.', 'thu chi ngang nhau.', 'dễ hao, đừng cho vay, đừng liều.'],
  ['Tin tức của một người', 'sắp có tin, tin vui.', 'tin còn chậm.', 'tin khó đến, hoặc tin không vui.'],
  ['Kiện tụng, tranh chấp', 'lẽ phải nghiêng về mình.', 'hòa được thì hòa.', 'khó thắng, nên tìm cách thương lượng.'],
  ['Vận nhà, bình an', 'nhà yên, người khỏe.', 'có chuyện nhỏ, nhường nhau là êm.', 'giữ gìn trong nhà, chú ý người già, trẻ nhỏ.'],
  ['Hôn nhân', 'duyên thuận, có thể tiến tới.', 'còn phải tìm hiểu thêm.', 'có trắc trở, chưa nên vội.'],
  ['Buôn bán', 'có lãi.', 'lãi ít, giữ vốn.', 'dễ lỗ, đừng mở rộng.'],
  ['Đổi chỗ ở, đổi việc', 'đổi được, chỗ mới tốt hơn.', 'ở yên cũng được, đổi cũng được.', 'chưa nên đổi.'],
  ['Bệnh tật', 'bệnh nhẹ, mau khỏi.', 'cần chữa đúng cách, kiên nhẫn.', 'phải đi khám kỹ, đừng chần chừ.'],
  ['Thi cử', 'đỗ nếu đã học đủ.', 'cần ôn thêm.', 'khó, chuẩn bị lại cho chắc.'],
  ['Con cái', 'con cái thuận, có tin vui.', 'bình thường, dạy dỗ là chính.', 'con cái cần để tâm hơn.'],
  ['Xuất hành, đi xa', 'đi được, thuận đường.', 'đi được nhưng chuẩn bị kỹ.', 'nên hoãn hoặc đổi ngày.'],
  ['Tìm đồ mất', 'có thể tìm lại.', 'tìm quanh chỗ gần.', 'khó tìm lại.'],
  ['Lo âu', 'điều lo sẽ qua.', 'lo vừa thôi, việc không đến nỗi.', 'điều lo có thật, nên lo trước một bước.'],
  ['Đi thăm, gặp người', 'gặp được, được tiếp đón.', 'gặp được nhưng chưa được việc.', 'khó gặp, để dịp khác.'],
  ['Nghề nghiệp', 'nghề vững, tiến được.', 'giữ nghề, học thêm.', 'nghề đang khó, tính đường lui.'],
  ['Tình riêng, tâm sự', 'điều mong có thể toại.', 'còn phải chờ, nói thật lòng.', 'khó toại, nên nghĩ cho mình.'],
];

export const NHAC = [
  'Lòng thành, hỏi một việc, đọc xong tự đối chiếu với cảnh mình — cách bói sách ở nhiều nước (Việt, Ba Tư, Nhật) đều dạy vậy.',
  'Bói Kiều xưa nay vẫn được gọi là "bói chơi": chỗ dựa tinh thần chứ không phải lời phán; việc lớn nên quyết bằng tính toán, hỏi người hiểu việc.',
] as const;
