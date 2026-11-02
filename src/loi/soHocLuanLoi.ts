/**
 * Loi luan than so hoc (`soHocLuan.ts`), Claude soan moi (luat 6) sau khi doc Balliett 1908, Westcott 1911 (nguyen van archive.org)
 * va cach doc hien nay (Jordan, Decoz, Phillips, ban Viet) qua trich doan: nguon, ly do chot o `docs/LUAN_THAN_SO.md`.
 * App chi hien loi chot, khong ke ten sach.
 */

/** So chu dao: ban chat · manh · mat trai · bai hoc, huong viec (cac nguon gan nhu cung y o phan loi). */
export const CHU_DAO: Readonly<Record<number, string>> = {
  1: 'Người mở đường: độc lập, quyết đoán, nhiều sáng kiến, muốn làm theo cách của mình. Mạnh ở khởi xướng và dẫn dắt; mặt trái là '
    + 'cứng đầu, nóng vội, khó nhờ người. Bài học: tự tin mà vẫn lắng nghe; hợp việc tự chủ, khởi nghiệp, dẫn dắt nhóm.',
  2: 'Người kết nối: tinh tế, nhạy cảm, giỏi lắng nghe, hòa giải, hợp tác. Mạnh ở làm việc cùng người, thấy được chi tiết và cảm xúc '
    + 'người khác; mặt trái là dễ tổn thương, ngại va chạm, hay dựa vào ý người. Bài học: tin vào mình, dám nói "không"; hợp vai cộng '
    + 'sự, tư vấn, chăm sóc, ngoại giao.',
  3: 'Người biểu đạt: vui, sáng tạo, giỏi nói, viết, truyền cảm hứng. Mạnh ở ý tưởng và giao tiếp; mặt trái là dàn trải, cả thèm chóng '
    + 'chán, dễ nói nhiều hơn làm. Bài học: chọn ít việc mà làm tới nơi; hợp nghề sáng tạo, truyền thông, giảng dạy, nghệ thuật.',
  4: 'Người xây nền: thực tế, kỷ luật, chăm chỉ, đáng tin, làm từng bước chắc. Mạnh ở tổ chức, quy trình, sức bền; mặt trái là cứng '
    + 'nhắc, bảo thủ, ngại thay đổi. Bài học: giữ nề nếp mà vẫn mềm mỏng; hợp kỹ thuật, quản lý, tài chính, xây dựng.',
  5: 'Người tự do: ham trải nghiệm, linh hoạt, học nhanh, thích đi và đổi mới. Mạnh ở thích nghi, giao tiếp, buôn bán; mặt trái là '
    + 'bốc đồng, thiếu kiên trì, dễ sa vào hưởng thụ. Bài học: tự do có kỷ luật; hợp việc đi lại, kinh doanh, truyền thông, du lịch.',
  6: 'Người chăm lo: trách nhiệm, yêu gia đình, có thẩm mỹ, muốn giúp người. Mạnh ở chăm sóc, dạy dỗ, giữ hòa khí; mặt trái là ôm '
    + 'việc, lo thay người khác, cầu toàn, dễ áp đặt. Bài học: thương người mà vẫn giữ ranh giới; hợp giáo dục, y tế, tư vấn, thiết kế.',
  7: 'Người tìm hiểu: thích đào sâu, phân tích, học qua trải nghiệm của chính mình, cần khoảng riêng. Mạnh ở nghiên cứu, chuyên môn '
    + 'sâu, trực giác; mặt trái là khép kín, đa nghi, khó tin người. Bài học: chia sẻ và tin tưởng; hợp nghiên cứu, kỹ thuật, khoa '
    + 'học, triết học.',
  8: 'Người quản trị: thực tế, có tham vọng, giỏi lo tiền bạc và điều hành, độc lập. Mạnh ở kinh doanh, quản lý, đứng vững trước áp '
    + 'lực; mặt trái là quá coi trọng vật chất, khắt khe, khó bộc lộ tình cảm. Bài học: cân bằng thành tựu với tình người; hợp quản '
    + 'lý, tài chính, kinh doanh.',
  9: 'Người vị tha: bao dung, lý tưởng, từng trải, muốn đóng góp cho số đông. Mạnh ở nhìn xa, nghệ thuật, phục vụ cộng đồng; mặt trái '
    + 'là sống trong lý tưởng, khó buông chuyện cũ, dễ thất vọng vì người. Bài học: buông bỏ, cho đi vừa sức; hợp giáo dục, nghệ '
    + 'thuật, công tác xã hội.',
  10: 'Số 10 (cách tính phổ biến ở Việt Nam giữ riêng, nền số 1): tự lập, tự tin, thích nghi nhanh, xoay xở được nhiều hoàn cảnh. '
    + 'Mạnh ở khởi đầu và vượt khó; mặt trái là tự cao, dễ đổi hướng khi chán. Bài học: giữ cam kết đến cùng; hợp việc tự chủ, '
    + 'cần linh hoạt.',
  11: 'Số bậc thầy nền 2: trực giác mạnh, nhạy cảm, giàu cảm hứng, có sức truyền động lực cho người khác. Mạnh ở thấu hiểu, sáng '
    + 'tạo, dẫn dắt tinh thần; mặt trái là căng thẳng, lo âu, dao động giữa lý tưởng và thực tế. Bài học: giữ cân bằng thân – tâm, '
    + 'biến cảm hứng thành việc cụ thể; hợp giảng dạy, nghệ thuật, tư vấn.',
  22: 'Số bậc thầy nền 4: tầm nhìn lớn đi cùng óc thực tế, có thể biến ý tưởng thành công trình. Mạnh ở tổ chức quy mô, kiên trì dài '
    + 'hạn; mặt trái là tự đặt áp lực quá cao, dễ kiệt sức hoặc lui về an toàn như số 4. Bài học: đi từng bước mà không bỏ tầm nhìn; '
    + 'hợp quản lý dự án, kỹ thuật, xây dựng tổ chức.',
  33: 'Số bậc thầy nền 6: lòng thương lớn, muốn nâng đỡ, dạy dỗ, chữa lành. Mạnh ở chăm sóc và truyền cảm hứng bằng sự tận tụy; mặt '
    + 'trái là hy sinh quá mức, ôm trách nhiệm của người khác. Bài học: chăm mình trước khi chăm người; hợp giáo dục, y tế, công tác '
    + 'xã hội, nghệ thuật.',
};

/** So ngay sinh: nang khieu, net tro giup cho so chu dao. */
export const NGAY_SINH: Readonly<Record<number, string>> = {
  1: 'năng khiếu tự đứng ra, quyết nhanh; làm tốt khi được giao quyền chủ động.',
  2: 'năng khiếu cảm nhận người khác, làm cầu nối; hợp việc cần khéo léo, kiên nhẫn.',
  3: 'năng khiếu diễn đạt bằng lời, chữ, hình; dễ được mến vì vui vẻ.',
  4: 'năng khiếu sắp xếp, làm việc có quy trình; người khác tin giao việc khó.',
  5: 'năng khiếu thích nghi, học nhanh cái mới, giao tiếp rộng.',
  6: 'năng khiếu chăm lo, tạo không khí ấm cúng; có con mắt thẩm mỹ.',
  7: 'năng khiếu quan sát, phân tích, nhìn ra cái người khác bỏ sót.',
  8: 'năng khiếu tổ chức, tính toán thực tế, nắm được tiền bạc và việc lớn.',
  9: 'năng khiếu thấu cảm rộng, có óc nghệ thuật, dễ được tin cậy.',
  11: 'năng khiếu trực giác và cảm hứng, nhìn ra ý nghĩa sau sự việc; cần chỗ dựa vững để không căng thẳng.',
  22: 'năng khiếu biến kế hoạch lớn thành việc thật; làm tốt khi có mục tiêu dài hạn.',
};

/** So thai do (ngay + thang): an tuong dau tien, cach phan ung truoc viec moi. */
export const THAI_DO: Readonly<Record<number, string>> = {
  1: 'người khác thấy mình tự tin, chủ động; gặp việc thì muốn tự quyết ngay.',
  2: 'người khác thấy mình hiền, dễ gần; gặp việc thì lắng nghe, tìm cách hòa trước.',
  3: 'người khác thấy mình vui, cởi mở; gặp việc thì phản ứng bằng lời, bằng ý tưởng.',
  4: 'người khác thấy mình nghiêm túc, đáng tin; gặp việc thì cân nhắc, cần kế hoạch rõ.',
  5: 'người khác thấy mình năng động, thú vị; gặp việc thì phản ứng nhanh, dễ đổi ý.',
  6: 'người khác thấy mình chu đáo, có trách nhiệm; gặp việc thì nghĩ tới người thân trước.',
  7: 'người khác thấy mình kín đáo, khó đoán; gặp việc thì quan sát, tìm hiểu kỹ rồi mới nói.',
  8: 'người khác thấy mình mạnh mẽ, có uy; gặp việc thì tính hiệu quả, được – mất.',
  9: 'người khác thấy mình rộng lượng, từng trải; gặp việc thì nhìn bức tranh lớn.',
};

export const KET_HOP = {
  trung: 'Số ngày sinh cùng nền với số chủ đạo: nét chính của mình rất đậm, dễ nhận ra cả điểm mạnh lẫn mặt trái.',
  thaiDoTrung: 'Số thái độ cùng nền với số chủ đạo: người ngoài nhìn vào thấy đúng con người bên trong của mình.',
  vangTrenLuoi: (so: string): string => `Chữ số ${so} (nền số chủ đạo) không có trên biểu đồ ngày sinh: phẩm chất chính phải tự rèn qua `
    + 'trải nghiệm, phát chậm mà chắc.',
  coTrenLuoi: (so: string): string => `Chữ số ${so} (nền số chủ đạo) có một lần trên biểu đồ ngày sinh: phẩm chất chính có sẵn, vừa đủ.`,
  dayTrenLuoi: (so: string): string => `Chữ số ${so} (nền số chủ đạo) lặp nhiều lần trên biểu đồ ngày sinh: phẩm chất chính rất mạnh — `
    + 'coi chừng lạm dụng.',
} as const;

export const MAT_PHANG = {
  troi: [
    'Trí não (hàng 3-6-9) nhiều chữ số nhất: thiên về suy nghĩ, ghi nhớ, lập luận; nên nhớ vận động và để ý cảm xúc.',
    'Cảm xúc (hàng 2-5-8) nhiều chữ số nhất: sống bằng cảm nhận, trực giác, tình cảm; quyết định nên kèm số liệu rõ.',
    'Thể chất (hàng 1-4-7) nhiều chữ số nhất: thực tế, làm bằng tay, học qua việc cụ thể; nên dành thời gian cho suy ngẫm.',
  ],
  deu: 'Không hàng nào trội hẳn: trí não, cảm xúc, thể chất tương đối cân nhau.',
  khongMuiTen: 'Không có đường nào đầy hay trống trọn: không có nét nào quá nổi, cũng không có chỗ hụt lớn.',
  khongSo: 'Không số nào lặp từ 3 lần; số vắng (nếu có) đã nói ở phần mũi tên trống.',
} as const;

/** Mui ten theo thu tu `DUONG` (1-2-3, 4-5-6, 7-8-9, 1-4-7, 2-5-8, 3-6-9, 1-5-9, 3-5-7); 1-2-3 khong the trong (nam sinh 19xx, 20xx). */
export const MUI_TEN: readonly { readonly ten: string; readonly day: string; readonly tenTrong: string; readonly trong: string }[] = [
  { ten: 'Kế hoạch', day: 'giỏi tính trước, sắp đặt việc theo trình tự; nên để chừa chỗ cho linh hoạt.',
    tenTrong: 'Thiếu kế hoạch', trong: 'nên tập lên kế hoạch trên giấy.' },
  { ten: 'Ý chí', day: 'quyết đã làm thì làm tới cùng, bền trước khó khăn; coi chừng cố chấp.',
    tenTrong: 'Uất giận', trong: 'dễ hụt hẫng khi việc không như ý, giận dồn trong lòng — nên đặt mục tiêu vừa sức, nói ra thay vì nén.' },
  { ten: 'Hoạt động', day: 'năng động, thích bắt tay làm ngay, không ngồi yên được lâu.',
    tenTrong: 'Thụ động', trong: 'dễ chần chừ, đợi người khác khởi động — nên tự đặt hạn chót, làm việc nhỏ trước.' },
  { ten: 'Thực tế', day: 'khéo tay, giỏi việc cụ thể, chú trọng vật chất và kết quả thấy được.',
    tenTrong: 'Hỗn độn', trong: 'dễ bừa bộn, khó giữ nề nếp sinh hoạt — nên lập thói quen cố định, dọn dẹp từng chút.' },
  { ten: 'Cân bằng cảm xúc', day: 'cảm xúc ổn định, hiểu người, giữ được bình tĩnh.',
    tenTrong: 'Nhạy cảm', trong: 'dễ tổn thương, ngại bày tỏ, hay giữ cảm xúc trong lòng — nên có chỗ chia sẻ, tập nói ra.' },
  { ten: 'Trí tuệ', day: 'trí nhớ tốt, học nhanh, giỏi lý luận.',
    tenTrong: 'Trí nhớ ngắn hạn', trong: 'dễ quên việc vặt, mất tập trung — nên ghi chép, lặp lại, chia việc nhỏ.' },
  { ten: 'Quyết tâm', day: 'kiên trì theo đuổi mục tiêu, khó bị lay chuyển; coi chừng bướng.',
    tenTrong: 'Trì hoãn', trong: 'dễ lần lữa, khó quyết — nên chia mục tiêu thành bước nhỏ, đặt hạn rõ.' },
  { ten: 'Nhạy bén (tâm linh)', day: 'trực giác tốt, giàu lòng trắc ẩn, quan tâm ý nghĩa sống.',
    tenTrong: 'Hoài nghi', trong: 'khó tin điều chưa thấy tận mắt, hay nghi ngờ — nên tìm hiểu kỹ rồi mở lòng.' },
];

/** So lap tu 3 lan tren luoi: net cua so do qua dam. */
export const SO_NHIEU: Readonly<Record<number, string>> = {
  1: 'cái tôi mạnh, nói nhiều về mình, dễ lấn át người khác — tập lắng nghe.',
  2: 'nhạy cảm quá mức, dễ bị tổn thương, phụ thuộc cảm xúc người khác.',
  3: 'trí tưởng tượng mạnh, dễ lo xa, nghĩ nhiều mà khó dừng.',
  4: 'quá chú trọng vật chất, chi tiết, khó thoát khỏi lối quen.',
  5: 'cảm xúc mạnh, dễ bốc đồng, nóng nảy — cần kênh xả lành mạnh.',
  6: 'lo lắng nhiều cho gia đình, ôm trách nhiệm quá sức.',
  7: 'hay gặp chuyện phải trả giá để học, dễ hy sinh, khép mình.',
  8: 'đòi hỏi cao với mình và người, dễ cứng nhắc.',
  9: 'lý tưởng cao, dễ chê đời, khó hài lòng.',
};

/** So vang tren luoi: bai hoc can boi dap (cac nguon cung y "so vang la bai hoc"); gop mot cau, bo so da noi o mui ten trong. */
export const SO_VANG: Readonly<Record<number, string>> = {
  1: 'tự khẳng định mình', 2: 'lắng nghe, kiên nhẫn với người', 3: 'diễn đạt, tưởng tượng', 4: 'ngăn nắp, kỷ luật hằng ngày',
  5: 'bày tỏ cảm xúc, đón thay đổi', 6: 'chăm lo gia đình', 7: 'rút bài học từ trải nghiệm', 8: 'để ý tiền bạc, chi tiết',
  9: 'nhìn rộng ra việc chung',
};

/** Dinh cao: chu de cua tung giai doan. */
export const DINH_CAO: Readonly<Record<number, string>> = {
  1: 'giai đoạn tự lập — phải tự quyết, đứng ra lo việc; hợp xây bản lĩnh, khởi nghiệp.',
  2: 'giai đoạn hợp tác — kết quả đến qua người khác; kiên nhẫn, vun quan hệ, tình cảm.',
  3: 'giai đoạn biểu đạt — sáng tạo, giao tiếp, bạn bè, niềm vui; coi chừng dàn trải.',
  4: 'giai đoạn xây nền — làm việc chăm, kỷ luật, tích lũy, ổn định nhà cửa, công việc.',
  5: 'giai đoạn thay đổi — đi lại, đổi việc, trải nghiệm mới; cần giữ kỷ luật.',
  6: 'giai đoạn gia đình — trách nhiệm với nhà, con cái, cộng đồng; hôn nhân, nhà cửa nổi lên.',
  7: 'giai đoạn chiêm nghiệm — học sâu, chuyên môn, đời sống nội tâm; ít ồn ào.',
  8: 'giai đoạn thành tựu — tiền bạc, quyền hành, sự nghiệp; cần cân bằng với sức khỏe, gia đình.',
  9: 'giai đoạn hoàn tất — khép lại chuyện cũ, cho đi, phục vụ, nhìn rộng.',
  11: 'giai đoạn thức tỉnh — trực giác, cảm hứng, dễ được biết đến; dễ căng thẳng, nên giữ nhịp sống.',
  22: 'giai đoạn kiến tạo — cơ hội làm việc tầm rộng, đòi hỏi kỷ luật và sức bền cao.',
};

/** Thu thach 0–8: bai hoc cung giai doan. */
export const THU_THACH: readonly string[] = [
  'không có một bài riêng — phải tự chọn hướng, dễ phân vân giữa nhiều khả năng.',
  'tự khẳng định — dám đứng lên vì mình mà không áp đặt người khác.',
  'nhạy cảm — đừng để lời người khác làm chùn bước; học cân bằng cho và nhận.',
  'biểu đạt — dám nói, dám thể hiện; tránh phân tán, tự ti.',
  'kỷ luật — kiên nhẫn, làm đến nơi; tránh lười hoặc cứng nhắc.',
  'tự do — dùng tự do có trách nhiệm; tránh bốc đồng, ham vui quá đà.',
  'trách nhiệm — không ôm việc người khác, không áp tiêu chuẩn của mình lên người.',
  'niềm tin — bớt hoài nghi, mở lòng; tránh tự cô lập.',
  'tiền bạc, quyền hành — dùng đúng mực; đừng coi vật chất là tất cả, cũng đừng sợ chuyện tiền.',
];

/** Nam ca nhan 1–9: chu ky 9 nam (cac nguon cung mot thu tu y nghia). */
export const NAM_CA_NHAN: Readonly<Record<number, string>> = {
  1: 'năm khởi đầu chu kỳ 9 năm — hợp mở việc mới, đặt mục tiêu, tự quyết; việc gieo năm nay quyết định mấy năm sau.',
  2: 'năm vun đắp — chậm lại, hợp tác, chăm quan hệ; kết quả đến từ kiên nhẫn, đừng ép.',
  3: 'năm mở rộng — giao tiếp, sáng tạo, vui vẻ; coi chừng tiêu xài, dàn trải sức.',
  4: 'năm xây nền — làm việc chăm, sắp xếp giấy tờ, tiền bạc, sức khỏe; ít đường tắt.',
  5: 'năm thay đổi — đi lại, cơ hội mới, đổi chỗ, đổi việc; cân nhắc trước khi quyết vội.',
  6: 'năm gia đình — trách nhiệm với nhà, người thân, cộng đồng; chuyện cưới hỏi, nhà cửa hay nổi lên.',
  7: 'năm nhìn lại — nghỉ ngơi, học hỏi, suy ngẫm; ít hợp việc ồn ào, đầu tư liều.',
  8: 'năm thu hoạch — tiền bạc, công việc, vị thế; công sức mấy năm trước được đền đáp.',
  9: 'năm khép lại — dọn dẹp, buông cái cũ, hoàn tất việc dở; chuẩn bị cho chu kỳ mới.',
};
export const THANG_CA_NHAN: Readonly<Record<number, string>> = {
  1: 'hợp bắt đầu việc mới.', 2: 'hợp hợp tác, chờ đợi.', 3: 'hợp giao tiếp, sáng tạo.', 4: 'hợp làm việc chăm, sắp xếp.',
  5: 'hợp thay đổi, đi lại.', 6: 'hợp lo việc nhà.', 7: 'hợp nghỉ ngơi, học hỏi.', 8: 'hợp lo tiền bạc, công việc.', 9: 'hợp khép lại, dọn dẹp.',
};
