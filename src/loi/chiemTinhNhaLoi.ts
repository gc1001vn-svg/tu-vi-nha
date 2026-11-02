/**
 * Loi luan tung nha chiem tinh (tang 2) — Claude tong hop, soan moi (luat 6): Alan Leo *How to Judge a Nativity* (hanh tinh trong
 * tung nha), Lilly (y nghia nha, chu nha), sach hien dai (Sasportas, Hand — kien thuc chung). Loi co nang ("chet du doi", "toi tu")
 * doi sang xu huong. Ly do: `docs/LUAN_CHIEM_TINH.md` muc 3.
 */

/** Ten ngan 12 nha (tieu de muc). */
export const NHA_TEN = ['Bản thân', 'Tiền bạc', 'Giao tiếp, anh chị em', 'Gia đình, nhà cửa', 'Tình yêu, con cái, sáng tạo',
  'Công việc, sức khỏe', 'Hôn nhân, đối tác', 'Tài sản chung, biến đổi', 'Học cao, đi xa', 'Sự nghiệp, danh tiếng',
  'Bạn bè, mong ước', 'Tâm linh, chuyện kín'] as const;

/** Kieu cua 12 cung khi dung dau mot nha. */
export const KIEU_CUNG = ['chủ động, nhanh, thẳng', 'chậm mà chắc, coi trọng ổn định, vật chất', 'linh hoạt, nhiều mối, ưa trao đổi',
  'nặng tình, cần an toàn, che chở', 'hào phóng, muốn được ghi nhận', 'tỉ mỉ, thực tế, cầu toàn', 'hòa nhã, cân nhắc, cần người cùng làm',
  'sâu sắc, kín đáo, dồn hết sức', 'rộng mở, lạc quan, thích mở mang', 'có kế hoạch, kỷ luật, lâu dài',
  'độc lập, khác lối mòn, hướng cộng đồng', 'mềm mỏng, giàu cảm thông, dễ mơ hồ'] as const;

/** Thien the 0..9 (thu tu `DIEM`) trong nha 1..12: HANH_TINH_NHA[thien the][nha − 1]. */
export const HANH_TINH_NHA: readonly (readonly string[])[] = [
  ['tự tin, nổi bật, muốn tự quyết đời mình; sức sống mạnh.', 'coi trọng tiền bạc và giá trị bản thân; kiếm tiền bằng chính tài mình.',
    'nổi bật ở giao tiếp, viết, dạy; anh chị em quan trọng.', 'gia đình là trung tâm; cha (hoặc người dựng nhà) ảnh hưởng lớn.',
    'sáng tạo, thích thể hiện, yêu con.', 'làm việc tận tụy; sức khỏe gắn với nhịp sống điều độ.',
    'người bạn đời nổi bật, quan trọng; hợp tác là chìa khóa.', 'quan tâm điều sâu kín, tài chính chung; đời có những lần lột xác.',
    'ham học hỏi, đi xa, tìm triết lý sống.', 'khát vọng sự nghiệp lớn, dễ có danh, hợp vai lãnh đạo.',
    'nổi bật trong nhóm; bạn bè giúp đạt mong ước.', 'sống nội tâm, làm việc sau hậu trường, cần nghỉ ngơi riêng.'],
  ['cảm xúc lộ ra ngoài, dễ đổi tâm trạng; người khác thấy gần gũi.', 'thu nhập lên xuống theo kỳ; cần cảm giác an toàn về tiền.',
    'hay đi lại gần, đổi chỗ; gắn bó anh chị em.', 'gắn bó gia đình, nhớ quê; hay dọn nhà.',
    'tình cảm theo cảm xúc, thương con, thích vui chơi.', 'công việc hay đổi; sức khỏe theo tâm trạng, nên ăn uống điều độ.',
    'cần bạn đời chăm sóc, gắn bó; quan hệ theo cảm xúc.', 'cảm xúc sâu, gắn với tài sản gia đình, thừa kế.',
    'thích đi xa, mến văn hóa khác; niềm tin theo cảm xúc.', 'sự nghiệp hay đổi, gần công chúng; hợp nghề chăm sóc, phục vụ.',
    'bạn bè như người nhà, nhiều bạn nữ.', 'cảm xúc giấu kín, nhạy cảm, cần chỗ riêng tĩnh lặng.'],
  ['lanh lợi, nói nhiều, tò mò, trông trẻ hơn tuổi.', 'kiếm tiền bằng đầu óc, buôn bán, giấy tờ, giao tiếp.',
    'học nhanh, nói giỏi, hợp viết lách, truyền thông.', 'nhà là chỗ học, làm việc; nhà cửa nhiều sách vở.',
    'vui bằng trí óc: trò chơi, viết lách; con cái lanh lợi.', 'làm việc tỉ mỉ, giỏi chi tiết; hay lo nghĩ.',
    'bạn đời trẻ, lanh lợi; hợp tác qua giấy tờ, trao đổi.', 'đầu óc điều tra, nghiên cứu; giỏi việc tài chính, bảo hiểm.',
    'học cao, ngoại ngữ, viết, xuất bản.', 'nghề dùng chữ nghĩa, giao tiếp, buôn bán.',
    'bạn bè đông, trao đổi ý tưởng, mạng lưới rộng.', 'suy nghĩ kín đáo; hợp nghiên cứu, viết một mình.'],
  ['duyên dáng, dễ mến, ưa nhìn, khéo cư xử.', 'kiếm tiền nhờ cái đẹp, sự khéo léo; ưa tiêu cho thứ đẹp.',
    'nói năng duyên dáng, anh chị em hòa thuận.', 'nhà cửa đẹp, ấm cúng; gia đình êm.',
    'duyên tình tốt, có khiếu nghệ thuật, vui vẻ.', 'môi trường làm việc dễ chịu, đồng nghiệp hòa nhã.',
    'hôn nhân hòa hợp, dễ gặp người hợp ý.', 'được lợi qua bạn đời, tài sản chung; tình cảm sâu.',
    'yêu văn hóa, nghệ thuật nước ngoài; có duyên ở nơi xa.', 'nghề liên quan cái đẹp, nghệ thuật, ngoại giao; được quý.',
    'bạn bè dễ mến, hay giúp; có duyên trong cộng đồng.', 'tình cảm thầm kín, giàu lòng thương người.'],
  ['mạnh mẽ, nhanh nhẹn, nóng tính; dễ va quẹt nhỏ.', 'kiếm tiền mạnh tay, tiêu cũng mạnh tay.',
    'tranh luận hăng, đi lại nhanh — cẩn thận khi lái xe.', 'trong nhà hay va chạm; năng động sửa sang nhà cửa.',
    'yêu nồng nhiệt, ham thể thao, thích mạo hiểm.', 'làm việc hăng, dễ quá sức; nên giữ gìn khi làm việc nặng.',
    'bạn đời mạnh tính, hôn nhân hay va chạm — cần nhường nhịn.', 'dễ tranh chấp tài sản chung; nên cẩn thận chuyện nợ nần.',
    'hăng hái vì niềm tin, thích phiêu lưu xa.', 'tham vọng, cạnh tranh mạnh; hợp nghề kỹ thuật, quân sự, thể thao.',
    'hăng hái trong hoạt động nhóm, dễ va chạm với bạn.', 'giận dồn nén, làm việc âm thầm; nên giải tỏa bằng vận động.'],
  ['lạc quan, rộng rãi, dễ được tin; nên giữ cân nặng.', 'tiền bạc dồi dào, hay được giúp vốn; dễ tiêu rộng.',
    'học rộng, anh chị em giúp đỡ, đi lại có lợi.', 'nhà rộng, gia đình đầm ấm, về già sung túc.',
    'vui vẻ, may mắn trong tình cảm, con cái giỏi.', 'công việc thuận, đồng nghiệp giúp; sức khỏe khá.',
    'bạn đời tốt, có lợi nhờ hôn nhân và đối tác.', 'được hưởng thừa kế, tài sản chung tốt.',
    'học vấn cao, may mắn nơi xa, có niềm tin vững.', 'sự nghiệp thuận, có danh, được nâng đỡ.',
    'bạn bè tốt, mong ước dễ thành.', 'có phúc ngầm, gặp nạn được giúp.'],
  ['nghiêm, kín, tự lập sớm; càng lớn tuổi càng vững.', 'tiền đến chậm, phải tích lũy; về sau vững.',
    'học chậm mà chắc, ít lời; anh chị em có gánh nặng.', 'gánh nặng gia đình, tuổi thơ có phần khắt khe; về sau mới yên.',
    'nghiêm túc trong tình cảm, ít vui chơi; con cái đến muộn hoặc nặng trách nhiệm.', 'làm việc chăm, nặng trách nhiệm; nên giữ xương khớp, răng.',
    'bạn đời chín chắn, thường lớn tuổi hơn; hôn nhân bền nhưng đến muộn.', 'trách nhiệm về nợ, tài sản chung; chuyện thừa kế chậm.',
    'học hành nghiêm túc, thành muộn; niềm tin chín chắn.', 'lên chậm mà chắc, trách nhiệm cao; thành đạt muộn.',
    'ít bạn mà bền, bạn lớn tuổi; mong ước thành muộn.', 'nỗi lo thầm, hay một mình; hợp tu dưỡng, làm việc kín.'],
  ['khác người, độc lập, thích tự do; đời có những bước ngoặt.', 'tiền bạc thất thường, có lúc đến bất ngờ; hợp nghề mới.',
    'ý nghĩ độc đáo, học kiểu khác người; anh chị em khác biệt.', 'gia đình nhiều thay đổi, hay chuyển nhà.',
    'tình yêu bất ngờ, sáng tạo độc đáo; con cái cá tính.', 'thích làm việc tự do, hay đổi việc; nhịp sống thất thường.',
    'duyên đến bất ngờ, bạn đời khác thường; cần tự do trong hôn nhân.', 'tài chính chung đổi bất ngờ; quan tâm điều huyền bí.',
    'tư tưởng mới lạ, đi xa bất ngờ.', 'sự nghiệp khác thường, nhiều thay đổi; hợp nghề mới, công nghệ.',
    'bạn bè khác thường; hoạt động cộng đồng đổi mới.', 'trực giác lạ, thay đổi ngầm bên trong.'],
  ['mơ mộng, nhạy cảm, khó nắm bắt; dễ bị người khác gán cho đủ thứ.', 'chuyện tiền mơ hồ, dễ bị lừa; hợp nghề nghệ thuật, phục vụ.',
    'giàu tưởng tượng, dễ lơ đãng; viết, kể chuyện hay.', 'gia đình có điều khó nói; mơ về một mái nhà lý tưởng.',
    'lãng mạn, năng khiếu nghệ thuật; dễ thất vọng vì lý tưởng hóa.', 'công việc phục vụ, chăm sóc; nên cẩn thận thuốc men, đồ uống.',
    'dễ lý tưởng hóa bạn đời, hôn nhân có điều mơ hồ — cần tỉnh táo.', 'chuyện tiền chung mơ hồ; nhạy với điều siêu hình.',
    'hướng tâm linh, tôn giáo, mơ về nơi xa.', 'nghề nghệ thuật, tâm linh, chăm sóc; hình ảnh dễ bị hiểu lầm.',
    'bạn bè lý tưởng, dễ bị lợi dụng — chọn bạn kỹ.', 'tâm linh mạnh, giàu lòng trắc ẩn; cần giữ ranh giới.'],
  ['sức hút mạnh, kín đáo, ý chí lớn; có lần thay đổi cả con người.', 'có sức làm giàu lớn; tiền bạc có lúc mất đi rồi gây dựng lại.',
    'suy nghĩ sâu, lời nói có sức ảnh hưởng.', 'chuyện gia đình sâu kín, trong nhà có biến đổi lớn.',
    'yêu mãnh liệt, sáng tạo có chiều sâu; gắn bó sâu với con cái.', 'làm việc dồn hết sức; có lúc đổi hẳn cách sống, cách làm.',
    'quan hệ sâu và mạnh, dễ giằng co quyền lực trong hôn nhân.', 'sức biến đổi lớn; có thể quản lý tài sản lớn của người khác.',
    'niềm tin thay đổi tận gốc; nghiên cứu sâu.', 'có quyền lực trong nghề; sự nghiệp trải qua lần đổi lớn.',
    'bạn bè có ảnh hưởng mạnh, nhóm có quyền lực.', 'nội tâm sâu, có sức chữa lành và làm lại.'],
];

export const KET_NHA = {
  tot: 'Nhìn chung, việc {} thuận hơn phần đông.',
  vua: 'Nhìn chung, việc {} ở mức bình thường.',
  kem: 'Nhìn chung, việc {} phải cố gắng hơn phần đông.',
} as const;
