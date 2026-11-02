/**
 * Loi tong luan chiem tinh (ke hoach `docs/ke-hoach/2026-11-02-chiem-tinh.md`) — Claude tong hop, soan moi (luat 6). Khung theo
 * Alan Leo *The Art of Synthesis* (1912): nguyen to va the, Mat Troi – Mat Trang – cung Moc, khi chat, sao chu, nhom cung dong;
 * pham vi theo Ptolemy / Lilly; ngay–dem (sect) theo truong phai Hy Lap co phuc hoi; ban cau, the goc chieu theo sach hien dai.
 * Ly do, cho venh: `docs/LUAN_CHIEM_TINH.md`.
 */

export const NGUYEN_TO = ['Lửa', 'Đất', 'Khí', 'Nước'] as const;
export const THE = ['Tiên phong', 'Kiên định', 'Biến đổi'] as const;

export const TO_TROI: readonly string[] = [
  'Lửa trội: sôi nổi, dám làm, cần mục tiêu và sự công nhận; dễ nóng vội, nhanh chán.',
  'Đất trội: thực tế, bền bỉ, giỏi làm ra của cải và giữ nề nếp; dễ cứng nhắc, ngại đổi.',
  'Khí trội: nghĩ nhiều, giỏi giao tiếp, thích ý tưởng và kết nối; dễ xa cách cảm xúc.',
  'Nước trội: giàu cảm xúc, nhạy cảm, trực giác tốt, gắn bó; dễ bị tâm trạng chi phối.',
];
export const TO_THIEU: readonly string[] = [
  'Thiếu Lửa: dễ thiếu hăng hái, ngại khởi đầu — cần người hoặc mục tiêu tiếp lửa.',
  'Thiếu Đất: dễ bỏ dở, khó giữ nhịp đều; chuyện tiền bạc cần kỷ luật hơn.',
  'Thiếu Khí: khó đứng ngoài nhìn vấn đề, đôi khi ngại nói ra suy nghĩ.',
  'Thiếu Nước: ít bộc lộ cảm xúc, dễ bị cho là lạnh; nên học lắng nghe cảm xúc của mình và người.',
];
export const THE_TROI: readonly string[] = [
  'Thể Tiên phong trội: thích khởi xướng, mở đầu việc mới, hành động nhanh; dễ bỏ ngang khi hết hứng.',
  'Thể Kiên định trội: bền, lì, theo đến cùng; dễ cố chấp, khó thay đổi.',
  'Thể Biến đổi trội: linh hoạt, dễ thích nghi, học nhanh; dễ phân tán, thiếu quyết đoán.',
];

/** Mat Troi, Mat Trang, cung Moc theo the (Leo II). */
export const BA_CUNG_THE: readonly string[] = [
  'Mặt Trời, Mặt Trăng, cung Mọc cùng thể Tiên phong: ý chí dồn một hướng, đạt mục đích bằng hành động nhanh, bứt phá.',
  'Mặt Trời, Mặt Trăng, cung Mọc cùng thể Kiên định: ý chí sắt đá — chậm mà chắc, theo đuổi nhiều năm không đổi.',
  'Mặt Trời, Mặt Trăng, cung Mọc cùng thể Biến đổi: uyển chuyển, xoay xở giỏi khi hoàn cảnh đổi.',
];
export const BA_KHAC_THE = 'Mặt Trời, Mặt Trăng, cung Mọc thuộc ba thể khác nhau: nhiều mặt, đa năng, biết xoay theo việc — đôi khi tự '
  + 'thấy mâu thuẫn.';

/** Quan he nguyen to: cung · hop (Lua–Khi, Dat–Nuoc) · kho hop. */
export const TROI_TRANG = {
  dong: 'Mặt Trời và Mặt Trăng cùng nguyên tố: điều mình muốn và điều mình cần thống nhất — sống khá nhất quán.',
  hop: 'Mặt Trời và Mặt Trăng ở hai nguyên tố hợp nhau: lý trí và cảm xúc đỡ nhau.',
  nghich: 'Mặt Trời và Mặt Trăng ở hai nguyên tố khó hợp: điều mình muốn và điều mình cần hay giằng co — biết cân bằng thì thành điểm mạnh.',
} as const;
export const TROI_MOC = {
  dong: 'Cung Mọc cùng nguyên tố với Mặt Trời: bề ngoài đúng như bên trong.',
  hop: 'Cung Mọc và Mặt Trời ở hai nguyên tố hợp nhau: người khác dễ hiểu đúng mình.',
  nghich: 'Cung Mọc và Mặt Trời ở hai nguyên tố khó hợp: ấn tượng ban đầu khác con người thật — quen lâu mới hiểu.',
} as const;

/** Khi chat (Leo III): cung le (Lua, Khi) la duong, cung chan (Dat, Nuoc) la am. */
export const KHI_CHAT = {
  duong: 'Khí chất dương (đa số hành tinh ở cung Lửa, Khí): chủ động, hướng ra ngoài, thích tác động lên hoàn cảnh.',
  am: 'Khí chất âm (đa số hành tinh ở cung Đất, Nước): kín đáo, hướng vào trong, tiếp nhận và nuôi dưỡng.',
  can: 'Khí chất cân bằng giữa chủ động và tiếp nhận.',
} as const;

/** Pham vi: [mieu (cung nha), vuong, ham (doi cung nha), suy (doi cung vuong)] — ghep sau ten sao va tu khoa. */
export const PHAM_VI = ['ở cung nhà của mình: {} mạnh, đúng chất', 'ở cung vượng: {} được tôn lên, dễ phát huy',
  'ở cung hãm: {} phải vất vả mới dùng được, dễ lệch chất', 'ở cung suy: {} yếu, cần rèn mới vững'] as const;

/** Bon truc: [ten, viec]. */
export const TRUC: readonly (readonly [string, string])[] = [
  ['cung Mọc', 'lộ rõ ở dáng vẻ, cách đối xử với đời'], ['Thiên Đỉnh', 'thể hiện qua sự nghiệp, danh tiếng'],
  ['điểm Lặn (Giáng)', 'hiện qua các mối quan hệ, người bạn đời'], ['đáy trời (Thiên Để)', 'chi phối gia đình, đời sống riêng'],
];

export const SECT = {
  ngay: 'Sinh ban ngày (Mặt Trời trên đường chân trời): Sao Mộc là cát tinh chính, Sao Thổ bớt khắc nghiệt; Sao Hỏa là phần thử thách lớn hơn.',
  dem: 'Sinh ban đêm (Mặt Trời dưới đường chân trời): Sao Kim là cát tinh chính, Sao Hỏa bớt khắc nghiệt; Sao Thổ là phần thử thách lớn hơn.',
} as const;

export const BAN_CAU = {
  tren: 'Đa số hành tinh ở nửa trên lá số: hướng ra xã hội, mục tiêu công khai, sự nghiệp.',
  duoi: 'Đa số hành tinh ở nửa dưới lá số: hướng về đời sống riêng, gia đình, xây nền bên trong.',
  dong: 'Đa số hành tinh ở nửa phía cung Mọc: tự quyết, tự tạo hoàn cảnh cho mình.',
  tay: 'Đa số hành tinh ở nửa phía điểm Lặn: hay hợp tác, dựa vào và chịu ảnh hưởng người khác.',
} as const;

export const THE_GOC = {
  tamHopLon: 'Tam hợp lớn ({}): có tài năng tự nhiên, việc trong mảng này trôi chảy; dễ ỷ vào thuận lợi mà thiếu cố gắng.',
  chuT: 'Thế chữ T ({}): căng thẳng thúc đẩy hành động mạnh; {} là nơi phải rèn nhiều nhất.',
  thapLon: 'Thập giá lớn ({}): áp lực từ nhiều phía, đời nhiều thử thách nhưng rất bền bỉ.',
} as const;

/** Cap goc chieu "a-b" (so thu tu `DIEM`, a < b): [hai hoa, cang thang]. */
export const GOC_CAP: Readonly<Record<string, readonly [string, string]>> = {
  '0-1': ['ý chí và cảm xúc đồng lòng: sống nhất quán, dễ tự tin.', 'ý chí và cảm xúc hay giằng co: muốn một đằng, cần một nẻo — học dung hòa thì vững.'],
  '0-2': ['suy nghĩ gắn chặt với bản thân: nói năng tự tin, thể hiện ý mình rõ.', 'suy nghĩ gắn chặt với bản thân: nói năng tự tin, thể hiện ý mình rõ.'],
  '0-3': ['duyên dáng, yêu cái đẹp, dễ được quý mến.', 'duyên dáng, yêu cái đẹp, dễ được quý mến.'],
  '0-4': ['năng lượng dồi dào, dám làm, có sức cạnh tranh.', 'nóng nảy, hiếu thắng, dễ va chạm — dồn sức vào thể thao, việc khó thì tốt.'],
  '0-5': ['lạc quan, rộng lượng, hay gặp may và được giúp.', 'dễ tự tin quá đà, hứa nhiều, tiêu rộng tay.'],
  '0-6': ['nghiêm túc, có trách nhiệm, thành công nhờ bền bỉ.', 'hay tự ti, gánh trách nhiệm sớm; thành công đến muộn nhưng chắc.'],
  '0-7': ['độc lập, sáng tạo, thích cái mới.', 'bất ổn, nổi loạn, đời có những thay đổi đột ngột.'],
  '0-8': ['giàu tưởng tượng, nhạy cảm, có năng khiếu nghệ thuật, tâm linh.', 'mơ hồ về bản thân, dễ ảo tưởng hoặc bị lừa — cần mục tiêu rõ.'],
  '0-9': ['ý chí mạnh, có sức tái tạo, biết dùng quyền lực.', 'thích kiểm soát, va chạm quyền lực, đời có lần phải làm lại từ đầu.'],
  '1-2': ['hiểu cảm xúc, nói ra được điều mình cảm, trí nhớ tốt.', 'nghĩ theo cảm xúc, hay lo, dễ nói khi đang bực.'],
  '1-3': ['dịu dàng, dễ mến, có gu thẩm mỹ, được yêu thương.', 'dễ chiều mình, cảm xúc và tình cảm thất thường.'],
  '1-4': ['dám bày tỏ cảm xúc, bảo vệ người thân mạnh mẽ.', 'dễ nổi nóng, phản ứng vội, trong nhà hay to tiếng.'],
  '1-5': ['rộng lòng, lạc quan, gia đạo êm, hay được nâng đỡ.', 'cảm xúc thái quá, dễ ăn uống, tiêu xài theo cảm hứng.'],
  '1-6': ['chín chắn, kiềm chế tốt, biết lo xa.', 'hay buồn, khó bộc lộ cảm xúc; tuổi thơ có phần thiếu thốn tình cảm.'],
  '1-7': ['cảm xúc tự do, cởi mở, chấp nhận khác biệt.', 'cảm xúc thất thường, cần khoảng riêng, ngại ràng buộc.'],
  '1-8': ['giàu lòng trắc ẩn, trực giác mạnh, mơ mộng.', 'dễ bị cảm xúc người khác cuốn theo, mơ hồ, thiếu ranh giới.'],
  '1-9': ['cảm xúc sâu, gắn bó bền, sức chịu đựng lớn.', 'cảm xúc dữ dội, hay ghen, dễ ôm giữ chuyện cũ.'],
  '2-3': ['nói năng khéo léo, nhã nhặn, có khiếu văn chương nghệ thuật.', 'nói năng khéo léo, nhã nhặn, có khiếu văn chương nghệ thuật.'],
  '2-4': ['nghĩ nhanh, nói sắc, quyết đoán.', 'nói gay gắt, dễ tranh cãi, vội kết luận.'],
  '2-5': ['học rộng, nghĩ lớn, nói có sức thuyết phục.', 'nói nhiều, hứa nhiều, dễ bỏ qua chi tiết.'],
  '2-6': ['nghĩ kỹ, chặt chẽ, hợp việc cần chính xác.', 'hay lo, bi quan, ngại nói; học chậm mà chắc.'],
  '2-7': ['đầu óc nhanh, nhiều ý tưởng độc đáo.', 'nghĩ nhảy cóc, nói đột ngột, khó tập trung.'],
  '2-8': ['trí tưởng tượng phong phú, giỏi kể chuyện, viết lách.', 'dễ lơ đãng, hiểu lầm, nhầm lẫn giấy tờ.'],
  '2-9': ['suy nghĩ sâu, giỏi tìm hiểu tận gốc, thuyết phục.', 'đa nghi, nói nặng lời, cố chấp quan điểm.'],
  '3-4': ['đam mê, hấp dẫn, tình cảm nồng nhiệt mà hòa hợp.', 'tình cảm mạnh nhưng hay giận hờn, đòi hỏi.'],
  '3-5': ['duyên dáng, hào phóng, tình cảm và tiền bạc thuận.', 'ham vui, chi tiêu rộng tay, dễ chiều mình quá.'],
  '3-6': ['chung thủy, nghiêm túc trong tình cảm, giữ tiền giỏi.', 'ngại bày tỏ, tình duyên chậm, dễ thấy cô đơn.'],
  '3-7': ['có sức hút lạ, tình cảm cởi mở, sáng tạo nghệ thuật.', 'tình cảm bất ngờ, đến nhanh đi nhanh, cần tự do.'],
  '3-8': ['lãng mạn, giàu lòng vị tha, năng khiếu nghệ thuật.', 'dễ lý tưởng hóa người yêu, dễ thất vọng hoặc bị lừa tình.'],
  '3-9': ['tình cảm sâu sắc, đam mê, gắn bó bền.', 'tình cảm chiếm hữu, ghen tuông; yêu mãnh liệt dễ tổn thương.'],
  '4-5': ['dám nghĩ lớn làm lớn, nhiệt huyết, hay gặp thời.', 'liều, quá sức, dễ làm quá tay.'],
  '4-6': ['bền bỉ, kỷ luật, chịu được việc nặng.', 'hay bị cản trở, bực bội dồn nén — cần kiên nhẫn, cẩn thận khi làm việc nặng.'],
  '4-7': ['phản xạ nhanh, dám đổi mới, giỏi kỹ thuật.', 'nóng vội, dễ va chạm bất ngờ — cẩn thận đi lại, máy móc.'],
  '4-8': ['hành động vì lý tưởng, có năng khiếu nghệ thuật, thể thao mềm dẻo.', 'thiếu sức, mục tiêu mơ hồ, dễ nản.'],
  '4-9': ['sức mạnh và ý chí lớn, chịu áp lực tốt.', 'quyết liệt quá mức, dễ đối đầu gay gắt.'],
};
