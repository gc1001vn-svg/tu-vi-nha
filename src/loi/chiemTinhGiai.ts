/**
 * Loi giai chiem tinh (luat 6): Claude soan lai theo quan niem chiem tinh phuong Tay pho bien, khong chep sach.
 * Mang 12 phan tu xep theo `CUNG` cua `chiemTinh.ts` (0 = Bach Duong); so thu tu diem theo `DIEM`.
 */

/** Mat Troi qua 12 cung: ban nga, cach song chinh. */
export const MAT_TROI: readonly string[] = [
  'Người hành động trước, nghĩ sau: thích mở đường, ưa thử thách và cạnh tranh. Sức sống mạnh, phản ứng nhanh, nói thẳng. Bài học là kiên nhẫn đi đến cùng và bớt nóng khi việc không theo ý.',
  'Cần nền tảng vững: tiền bạc, nhà cửa, nhịp sống đều đặn. Làm chậm mà chắc, giữ lời, biết hưởng thụ cái đẹp và món ngon. Mặt trái là cố chấp, ngại thay đổi; đã quyết thì khó lay.',
  'Đầu óc lanh lẹ, tò mò đủ thứ, học nhanh và nói chuyện có duyên. Hợp việc cần giao tiếp, viết lách, buôn bán, đi lại. Dễ phân tán vì quá nhiều mối quan tâm; nên chọn vài việc để đi sâu.',
  'Sống bằng tình cảm và sự gắn bó: gia đình, quê nhà, người thân là chỗ dựa. Chu đáo, biết chăm lo, nhớ lâu cả chuyện vui lẫn chuyện buồn. Khi bất an thì thu mình lại để tự che chở.',
  'Có khí chất, thích được ghi nhận và đứng ở chỗ nhiều người thấy. Rộng rãi, trung thành, dám nhận phần việc lớn. Nên tránh sĩ diện và học cách để người khác cùng tỏa sáng.',
  'Óc phân tích, để ý chi tiết, thích làm việc có quy trình và có ích. Hay giúp người bằng việc cụ thể hơn là lời nói. Dễ khắt khe với mình và với người, lo xa quá mức.',
  'Trọng hòa khí, công bằng và cái đẹp; giỏi nhìn hai mặt của một chuyện. Hợp việc cần đàm phán, phối hợp, thẩm mỹ. Điểm yếu là do dự, ngại va chạm nên đôi khi chiều người mà quên mình.',
  'Sâu sắc, kín đáo, cảm xúc mạnh mà ít để lộ. Đã quyết thì theo đến cùng, chịu đựng giỏi và có sức làm lại từ đầu. Nên học cách tin người và buông chuyện cũ.',
  'Lạc quan, ham hiểu biết, thích đi xa và tìm ý nghĩa của mọi việc. Thẳng thắn, vui tính, truyền hứng khởi cho người quanh mình. Dễ hứa nhiều, thiếu kiên nhẫn với việc lặp đi lặp lại.',
  'Thực tế, có chí, chịu khó leo từng bậc tới mục tiêu dài hạn. Trọng kỷ luật, danh dự và trách nhiệm; càng lớn tuổi càng vững. Nên bớt khắt khe, cho mình nghỉ ngơi và nói ra tình cảm.',
  'Độc lập, nghĩ khác số đông, quan tâm cộng đồng và cái mới. Thân thiện với nhiều người nhưng giữ khoảng riêng. Có lúc cứng đầu với ý mình và xa cách về cảm xúc.',
  'Giàu tưởng tượng, nhạy cảm, dễ đồng cảm với nỗi khổ của người khác. Hợp nghệ thuật, chăm sóc, việc thiện. Cần ranh giới rõ để không bị người khác cuốn đi hay trốn vào mơ mộng.',
];

/** Mat Trang qua 12 cung: cam xuc, dieu can de thay yen long. */
export const MAT_TRANG: readonly string[] = [
  'Cảm xúc đến nhanh, đi nhanh; cần được tự quyết và có việc để làm. Giận thì nói ngay rồi quên. Thấy yên lòng khi được chủ động.',
  'Cảm xúc ổn định, cần sự yên ổn về vật chất và những thói quen quen thuộc. Bữa ăn ngon, góc nhà ấm là liều thuốc an thần. Khó chịu khi bị xáo trộn bất ngờ.',
  'Cần trò chuyện để hiểu lòng mình; buồn thì tìm người tâm sự hoặc viết ra. Tâm trạng đổi nhanh theo tin tức, câu chuyện quanh mình.',
  'Mặt Trăng ở cung nhà của nó: tình cảm sâu, giàu lòng chăm sóc, gắn bó với mẹ và gia đình. Cần cảm giác được che chở; dễ tủi thân khi bị bỏ quên.',
  'Cần được yêu thương và khen ngợi rõ ràng. Ấm áp, hào phóng trong tình cảm; tổn thương khi bị xem nhẹ.',
  'Yên lòng khi mọi thứ ngăn nắp và có ích. Thể hiện tình cảm bằng việc làm cụ thể. Lo lắng thường dồn vào chuyện sức khỏe, công việc.',
  'Cần hòa khí và một người bạn đồng hành; khó chịu với cãi vã, sự thô lỗ. Dễ đặt cảm xúc của người khác lên trước mình.',
  'Cảm xúc mãnh liệt, sâu và kín; yêu ghét rõ ràng. Cần được tin cậy trọn vẹn; bị phụ lòng thì khó quên.',
  'Cần tự do, khoảng trời riêng và niềm vui. Buồn thì muốn đi xa hoặc tìm một ý nghĩa lớn hơn. Tính lạc quan giúp vượt chuyện khó nhanh.',
  'Kín cảm xúc, coi trọng trách nhiệm; yên lòng khi có kế hoạch và thành quả. Hay gồng mình, nên học cách nhờ người khác giúp.',
  'Cần khoảng riêng và được là chính mình; xử lý cảm xúc bằng lý trí. Gắn bó với bạn bè, với nhóm cùng chí hướng.',
  'Rất nhạy, dễ thấm tâm trạng người xung quanh; giàu lòng trắc ẩn. Cần thời gian một mình, âm nhạc, thiên nhiên để lấy lại cân bằng.',
];

/** Cung Moc qua 12 cung: an tuong ban dau, cach bat dau moi viec. */
export const CUNG_MOC: readonly string[] = [
  'Ấn tượng đầu là nhanh nhẹn, thẳng thắn, có phần bốc đồng. Gặp việc mới thì lao vào trước. Dáng vẻ năng động, ưa vận động.',
  'Trông điềm tĩnh, dễ chịu, chắc chắn. Bắt đầu việc mới từ từ, cân nhắc lợi ích thực tế. Thường chăm chút vẻ ngoài và sự thoải mái.',
  'Lanh lợi, hoạt bát, hay hỏi, trông trẻ hơn tuổi. Mở đầu bằng câu chuyện và sự tò mò.',
  'Hiền hòa, kín đáo lúc đầu, dè dặt với người lạ; thân rồi thì rất chu đáo. Tâm trạng hiện rõ trên nét mặt.',
  'Nổi bật, tự tin, có phong thái; người khác dễ để ý. Thích mở đầu bằng sự nhiệt tình và rộng rãi.',
  'Gọn gàng, khiêm tốn, quan sát kỹ trước khi lên tiếng. Tạo cảm giác đáng tin, làm việc cẩn thận.',
  'Lịch sự, dễ mến, ăn mặc có gu. Đến với người khác bằng sự khéo léo và tìm điểm chung.',
  'Ánh nhìn sâu, khó đoán, có sức hút lặng lẽ. Dè chừng trước khi mở lòng; quan sát nhiều hơn nói.',
  'Cởi mở, vui vẻ, thẳng thắn; thích phiêu lưu. Mở đầu bằng sự hào hứng và những câu hỏi lớn.',
  'Nghiêm túc, chững chạc, lúc trẻ trông già dặn hơn tuổi. Bắt đầu việc mới có kế hoạch và mục tiêu.',
  'Thân thiện mà hơi xa cách, có nét riêng khác người. Mở đầu bằng ý tưởng lạ và tính độc lập.',
  'Mềm mỏng, mơ màng, dễ gần; người khác thấy dễ tâm sự. Làm theo cảm nhận hơn là theo kế hoạch.',
];

/** Tam hanh tinh con lai (so thu tu 2..9 theo `DIEM`) qua 12 cung, moi cung mot dong. */
export const HANH_TINH: Readonly<Record<number, readonly string[]>> = {
  2: [
    'Nghĩ nhanh, nói thẳng, quyết nhanh; dễ cắt lời người khác.',
    'Nghĩ chậm mà chắc, học kỹ, nói ít nhưng thực tế.',
    'Lanh trí, nói hay, học nhiều thứ cùng lúc.',
    'Nghĩ bằng cảm xúc, nhớ lâu, hay nhắc chuyện cũ.',
    'Nói có sức thuyết phục, thích kể chuyện, tin vào ý mình.',
    'Óc phân tích, tỉ mỉ, giỏi sắp xếp và sửa lỗi.',
    'Ăn nói khéo, cân nhắc nhiều phía, giỏi thương lượng.',
    'Suy nghĩ sâu, thích tìm tận gốc, giữ bí mật tốt.',
    'Nghĩ rộng, thích bàn chuyện lớn, nói thẳng, đôi khi bỏ qua chi tiết.',
    'Nghĩ có hệ thống, thực tế, lời nói cẩn trọng.',
    'Ý tưởng mới lạ, tư duy độc lập, thích tranh luận.',
    'Nghĩ bằng hình ảnh và trực giác, giàu tưởng tượng, dễ mơ hồ.',
  ],
  3: [
    'Yêu nhanh, chủ động bày tỏ, thích sự hào hứng ban đầu.',
    'Chung thủy, thích cái đẹp bền và tiện nghi; giữ tiền khéo.',
    'Yêu qua trò chuyện, thích sự vui vẻ, sở thích hay đổi.',
    'Yêu bằng sự chăm sóc, gắn bó gia đình, cần cảm giác an toàn.',
    'Yêu nồng nhiệt, hào phóng, thích được chiều chuộng.',
    'Thể hiện tình cảm qua việc nhỏ, kén chọn, chu đáo.',
    'Duyên dáng, trọng sự hòa hợp, có óc thẩm mỹ.',
    'Yêu sâu và muốn giữ trọn, cần sự gắn bó hết lòng.',
    'Yêu tự do, thích người cùng đi xa và cùng học hỏi.',
    'Nghiêm túc trong tình cảm, coi trọng sự ổn định lâu dài.',
    'Thích tình bạn trong tình yêu, cần khoảng riêng, chuộng cái lạ.',
    'Lãng mạn, hy sinh vì người mình thương, dễ lý tưởng hóa.',
  ],
  4: [
    'Hăng hái, dám làm, nóng nảy nhưng mau nguôi.',
    'Bền bỉ, làm chậm mà dai, khó lay chuyển khi đã quyết.',
    'Sức lực dồn vào lời nói, tranh luận; làm nhiều việc cùng lúc.',
    'Hành động theo cảm xúc, quyết liệt khi bảo vệ người nhà.',
    'Mạnh mẽ, thích dẫn dắt, làm việc bằng cả tấm lòng.',
    'Làm việc cần cù, chính xác; bực bội khi thấy cẩu thả.',
    'Hành động sau khi cân nhắc, tránh đối đầu trực diện.',
    'Ý chí mạnh, kiên trì, quyết liệt khi bị dồn ép.',
    'Hăng hái vì lý tưởng, thích phiêu lưu, thể thao.',
    'Tham vọng, có kỷ luật, làm việc theo mục tiêu dài hạn.',
    'Hành động vì tập thể hay vì ý tưởng mới, không thích bị ép.',
    'Hành động theo cảm hứng, né va chạm, mạnh nhất khi giúp người khác.',
  ],
  5: [
    'Gặp may khi dám đi đầu, mở đường cho việc mới.',
    'Tài lộc tăng dần nhờ tích lũy và sự bền bỉ.',
    'Mở rộng nhờ học hỏi, giao tiếp, buôn bán, đi lại.',
    'Phúc từ gia đình, nhà cửa; rộng lòng chăm lo người thân.',
    'Hào phóng, vui tính, gặp may qua sáng tạo và con cái.',
    'Tiến lên nhờ làm việc chăm chỉ, phục vụ, giữ sức khỏe.',
    'Gặp may qua hôn nhân, đối tác, quan hệ hợp tác.',
    'Lợi từ tài sản chung, đầu tư; sức hồi phục mạnh.',
    'Ham học, thích đi xa, có niềm tin lớn vào cuộc đời.',
    'Thành công đến chậm mà chắc, nhờ kỷ luật và kế hoạch.',
    'Gặp may qua bạn bè, cộng đồng, ý tưởng mới.',
    'Giàu lòng thương người, lúc khó thường được che chở.',
  ],
  6: [
    'Bài học kiên nhẫn: hành động có trách nhiệm, không nóng vội.',
    'Thận trọng với tiền bạc; bài học về giá trị bản thân và sự an toàn.',
    'Nghiêm túc trong học hành, lời nói; bài học tập trung.',
    'Gánh trách nhiệm gia đình sớm; bài học về tình cảm và chỗ dựa.',
    'Khó bày tỏ niềm vui; bài học tự tin và dám thể hiện.',
    'Làm việc kỷ luật, chu toàn; bài học đừng ôm việc quá sức.',
    'Coi trọng cam kết; hôn nhân thường đến muộn mà bền.',
    'Bài học về kiểm soát, nợ nần, tài sản chung và buông bỏ.',
    'Niềm tin bị thử thách; học thật, nghĩ kỹ trước khi tin.',
    'Chí lớn, kiên trì xây sự nghiệp từng bước.',
    'Trách nhiệm với tập thể; bạn ít mà bền.',
    'Bài học buông nỗi sợ vô hình; cần nghỉ ngơi và tĩnh tâm.',
  ],
  7: [
    'Thế hệ tiên phong, muốn phá lối cũ, dám thử cái mới.',
    'Thế hệ đổi mới cách kiếm tiền, giữ của và dùng tài nguyên.',
    'Thế hệ đổi mới cách giao tiếp, học hành, truyền tin.',
    'Thế hệ đổi mới nếp gia đình và chỗ ở.',
    'Thế hệ đổi mới cách vui chơi, sáng tạo, thể hiện mình.',
    'Thế hệ đổi mới cách làm việc và chăm sóc sức khỏe.',
    'Thế hệ đổi mới cách nhìn hôn nhân, quan hệ đôi lứa.',
    'Thế hệ đổi mới quan niệm về tiền chung, chuyện sinh tử.',
    'Thế hệ đổi mới niềm tin, giáo dục, chuyện đi xa.',
    'Thế hệ đổi mới cơ cấu xã hội, nghề nghiệp, quyền lực.',
    'Thế hệ hướng tới công nghệ, cộng đồng, tự do cá nhân.',
    'Thế hệ đổi mới về tâm linh, nghệ thuật, lòng trắc ẩn.',
  ],
  8: [
    'Thế hệ mơ về những cuộc khởi đầu và lý tưởng anh hùng.',
    'Thế hệ lý tưởng hóa sự ổn định vật chất và thiên nhiên.',
    'Thế hệ mơ mộng qua chữ nghĩa, tin tức, giao lưu.',
    'Thế hệ lý tưởng hóa gia đình, quê hương.',
    'Thế hệ mơ về sân khấu, tình yêu lãng mạn, sáng tạo.',
    'Thế hệ lý tưởng hóa sự phục vụ, y tế, công việc có ích.',
    'Thế hệ lý tưởng hóa tình yêu đôi lứa và hòa bình.',
    'Thế hệ tìm hiểu những điều sâu kín, huyền bí.',
    'Thế hệ tìm chân lý qua tôn giáo, triết học, đi xa.',
    'Thế hệ mơ về trật tự, cơ cấu và thành tựu.',
    'Thế hệ lý tưởng hóa cộng đồng, mạng lưới, công nghệ.',
    'Thế hệ giàu tâm linh, nghệ thuật, lòng trắc ẩn.',
  ],
  9: [
    'Thế hệ biến đổi qua ý chí cá nhân và sự tự khẳng định.',
    'Thế hệ biến đổi quan niệm về của cải, tài nguyên.',
    'Thế hệ biến đổi cách nghĩ, cách truyền tin.',
    'Thế hệ biến đổi gốc rễ gia đình, quê hương.',
    'Thế hệ biến đổi cách thể hiện bản thân, sáng tạo.',
    'Thế hệ biến đổi cách làm việc, y tế, sức khỏe.',
    'Thế hệ biến đổi quan hệ đôi lứa, luật lệ, lẽ công bằng.',
    'Thế hệ biến đổi sâu về tâm lý, tài chính, sinh tử.',
    'Thế hệ biến đổi niềm tin, giáo dục, giao lưu toàn cầu.',
    'Thế hệ biến đổi cơ cấu quyền lực, kinh tế, nhà nước.',
    'Thế hệ biến đổi cộng đồng, công nghệ, mạng lưới.',
    'Thế hệ biến đổi tâm linh, khép lại một vòng lớn.',
  ],
};

/** Tu khoa 13 diem, dung ghep cau cho nha va goc chieu. */
export const TU_KHOA: readonly string[] = [
  'bản ngã và sức sống', 'cảm xúc và nhu cầu an toàn', 'cách nghĩ và cách nói', 'tình cảm, cái đẹp, tiền bạc',
  'hành động và ý chí', 'may mắn và sự mở rộng', 'kỷ luật và trách nhiệm', 'đổi mới và bất ngờ', 'mơ mộng và trực giác',
  'biến đổi sâu và quyền lực', 'hướng cần lớn lên trong đời', 'dáng vẻ và cách mở đầu', 'sự nghiệp và danh tiếng',
];

/** 12 nha: viec doi song ma diem trong nha do dua suc vao. */
export const NHA: readonly string[] = [
  'bản thân, dáng vẻ, cách mở đầu mọi việc', 'tiền bạc, của cải, giá trị bản thân', 'giao tiếp, học hành, anh chị em, đi lại gần',
  'gia đình, nhà cửa, cội nguồn', 'sáng tạo, vui chơi, tình yêu, con cái', 'công việc hằng ngày, sức khỏe, thói quen',
  'hôn nhân, đối tác, người đối diện', 'tài sản chung, đổi thay sâu, chuyện sinh tử', 'học cao, đi xa, niềm tin, triết lý',
  'sự nghiệp, danh tiếng, vị trí ngoài xã hội', 'bạn bè, cộng đồng, mong ước', 'tiềm thức, chuyện kín, nghỉ ngơi, tâm linh',
];

/** Tinh chat 5 goc chieu, theo thu tu `GOC`. */
export const Y_GOC: readonly string[] = [
  'hòa làm một, cộng sức cho nhau; tốt hay xấu tùy hai bên',
  'dễ phối hợp, mở ra cơ hội nếu chịu làm',
  'va chạm, căng thẳng, thúc phải hành động',
  'thuận chiều, trôi chảy, như tài năng sẵn có',
  'giằng co hai phía, cần tìm thế cân bằng',
];

export const BAC_GIAO_DIEM = 'Điểm Mặt Trăng cắt đường Mặt Trời đi lên phía bắc: hướng nên lớn lên trong đời. Nam Giao Điểm ở cung đối diện là thói quen cũ, vùng quen thuộc.';
export const THIEN_DINH = 'Đỉnh nhà 10, điểm cao nhất của bầu trời lúc sinh: cho biết kiểu thành tựu và hình ảnh ngoài xã hội hợp với mình.';
