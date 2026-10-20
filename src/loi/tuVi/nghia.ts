/**
 * Loi giai tu vi: 12 cung, 14 chinh tinh (sang/ham), moi phu tinh trong bang sao `laSo.ts`, 9 sao luu, Than cu, ba loai han.
 * Claude soan moi theo cach hieu pho bien cua tu vi Viet (luat 6 CLAUDE.md), khong chep sach — chi de tham khao.
 * Thuoc: `tests/LoiGiai.test.ts` (phu du moi cung, moi sao; chu kieu cu Hỏa, Thủy, Hòa).
 */

export const NGHIA_CUNG: Readonly<Record<string, string>> = {
  'Mệnh': 'Cung gốc của lá số: tính tình, dáng vẻ, sức bật và hướng đi chung của cả đời. Sao ở Mệnh cho biết mình mạnh ở đâu, '
    + 'dễ vấp ở đâu; mọi cung khác đều đọc kèm cung này. Người xem thường xét Mệnh cùng Tài Bạch, Quan Lộc (tam hợp) và Thiên Di (đối diện).',
  'Phụ Mẫu': 'Cha mẹ, bề trên, thầy dạy, cấp trên; cũng là phúc được che chở, dạy dỗ. Cung này tốt thì dễ được người lớn nâng đỡ, '
    + 'giấy tờ, học hành suôn sẻ hơn.',
  'Phúc Đức': 'Phúc của dòng họ để lại và đời sống tinh thần: sự an vui, tuổi thọ, chuyện tổ tiên, mồ mả. Nhiều người coi đây là cung '
    + 'đỡ cho cả lá số: Phúc tốt thì hạn xấu cũng nhẹ đi.',
  'Điền Trạch': 'Nhà cửa, đất đai, của để dành và không khí trong nhà. Cung này cho biết dễ hay khó có nhà, giữ được tài sản hay không.',
  'Quan Lộc': 'Học hành, nghề nghiệp, chức phận và cách làm việc. Sao ở đây gợi ý hợp với việc gì, đường công danh nhanh hay chậm.',
  'Nô Bộc': 'Bạn bè, đồng nghiệp, người dưới quyền, người làm cho mình. Cung tốt thì được người giúp sức; cung xấu thì dễ bị bạn bè, '
    + 'người dưới làm phiền hoặc phụ lòng.',
  'Thiên Di': 'Ra ngoài, đi xa, môi trường xã hội và cách người ngoài nhìn mình. Cung này đối diện cung Mệnh nên cũng nói lên vận may '
    + 'khi giao thiệp, đi lại, làm ăn xa.',
  'Tật Ách': 'Sức khỏe, bệnh tật, tai nạn và những rủi ro thân thể. Sao xấu ở đây là lời nhắc giữ gìn, không có nghĩa chắc chắn sẽ ốm.',
  'Tài Bạch': 'Tiền bạc: cách kiếm ra, cách giữ và cách tiêu. Sao ở đây cho biết tiền đến đều hay thất thường, hợp làm công ăn lương '
    + 'hay buôn bán.',
  'Tử Tức': 'Con cái và người nhỏ tuổi dưới mình, cả học trò, người mình dìu dắt. Cung này cũng được xem khi tính chuyện sinh con.',
  'Phu Thê': 'Vợ chồng, người yêu, chuyện hôn nhân: dễ hợp hay khó hợp, cưới sớm hay muộn, người phối ngẫu là người thế nào.',
  'Huynh Đệ': 'Anh chị em ruột và những người thân thiết như anh em. Cung tốt thì anh em hòa thuận, giúp được nhau.',
};

/** Chinh tinh: tinh chat chung · khi sang (Mieu, Vuong, Dac) · khi ham. Do sang Binh dung `BINH`. */
export const CHINH_TINH: Readonly<Record<string, { readonly chung: string; readonly sang: string; readonly ham: string }>> = {
  'Tử Vi': {
    chung: 'Sao đứng đầu, như vua: chủ quyền uy, lòng tự trọng, thích làm chủ và được người khác nể.',
    sang: 'Sáng: đường hoàng, có tài tổ chức, dễ được giao việc lớn và có người phò tá.',
    ham: 'Kém sáng: vẫn giữ nét tự tôn nhưng dễ cô đơn, chủ quan; cần người giỏi bên cạnh mới phát.',
  },
  'Liêm Trinh': {
    chung: 'Sao của kỷ cương và đam mê: nguyên tắc, cứng cỏi, có lúc nóng nảy; tình cảm sâu nhưng khó nói ra.',
    sang: 'Sáng: liêm chính, giỏi việc có phép tắc như hành chính, kỹ thuật, pháp lý; được tin cậy.',
    ham: 'Hãm: dễ cố chấp, vướng thị phi, giấy tờ pháp lý hay chuyện tình cảm rắc rối; nên giữ mình trong khuôn phép.',
  },
  'Thiên Đồng': {
    chung: 'Phúc tinh: hiền hòa, dễ chịu, thích an nhàn, biết hưởng; hay đổi ý.',
    sang: 'Sáng: tính vui, được lòng người, càng về sau càng sung túc.',
    ham: 'Hãm: dễ lười, thiếu quyết tâm, hay đổi nghề đổi chỗ; phải tự ép mình bền bỉ.',
  },
  'Vũ Khúc': {
    chung: 'Tài tinh: chủ tiền bạc và sự cương quyết; thực tế, làm việc tới nơi tới chốn.',
    sang: 'Sáng: giỏi kiếm và giữ tiền, hợp tài chính, kinh doanh, kỹ thuật.',
    ham: 'Hãm: cứng nhắc, dễ cô đơn, tiền đến rồi đi; tránh liều lĩnh khi đầu tư.',
  },
  'Thái Dương': {
    chung: 'Mặt trời: sáng sủa, rộng rãi, thích giúp người, trọng danh tiếng; cũng ứng với cha, chồng, con trai.',
    sang: 'Sáng: danh vọng rõ ràng, làm việc công khai được tiếng, được người kính trọng.',
    ham: 'Hãm: hao tâm sức mà ít được ghi nhận, dễ mỏi mắt, đau đầu; hợp làm việc thầm lặng, bền bỉ.',
  },
  'Thiên Cơ': {
    chung: 'Sao mưu trí: nhanh nhạy, khéo tính toán, giỏi lên kế hoạch, hay lo nghĩ.',
    sang: 'Sáng: thông minh, hợp nghề cần đầu óc như kỹ thuật, tư vấn, nghiên cứu; biến báo giỏi.',
    ham: 'Hãm: nghĩ nhiều mà ít làm, dễ bất an, hay đổi hướng; nên chọn một việc mà theo tới cùng.',
  },
  'Thiên Phủ': {
    chung: 'Kho của trời: ổn định, chừng mực, biết giữ của, ưa sự chắc chắn.',
    sang: 'Sáng: tài lộc vững, giỏi quản lý, cuộc sống đầy đủ.',
    ham: 'Kém sáng: vẫn chắc chắn nhưng dè dặt quá, ngại thay đổi, bỏ lỡ dịp tốt.',
  },
  'Thái Âm': {
    chung: 'Mặt trăng: dịu dàng, kín đáo, giàu cảm xúc; chủ nhà đất, tiền tích lũy; ứng với mẹ, vợ, con gái.',
    sang: 'Sáng: có của để dành, nhà đất, tính hiền hậu, được phụ nữ giúp đỡ.',
    ham: 'Hãm: hay buồn phiền, nhạy cảm quá, tiền bạc khó giữ; cần giữ sức khỏe và tinh thần.',
  },
  'Tham Lang': {
    chung: 'Sao ham muốn: nhiều tham vọng, đa tài, giỏi giao tế, thích hưởng thụ, đào hoa.',
    sang: 'Sáng: năng động, khéo léo, làm ăn giỏi, hợp kinh doanh, nghệ thuật.',
    ham: 'Hãm: dễ sa đà ăn chơi, tham thì thâm; nên tiết chế và chọn bạn mà chơi.',
  },
  'Cự Môn': {
    chung: 'Sao ăn nói: lý luận sắc, hay nghi ngờ, dễ vướng thị phi, khẩu thiệt.',
    sang: 'Sáng: giỏi nói, hợp nghề luật, dạy học, bán hàng, truyền thông.',
    ham: 'Hãm: lời nói dễ gây hiểu lầm, cãi vã, kiện cáo; nên nói ít, viết rõ ràng.',
  },
  'Thiên Tướng': {
    chung: 'Sao ấn tín: đứng đắn, trọng lẽ phải, hay bênh người yếu, thích chỉn chu.',
    sang: 'Sáng: được tín nhiệm, có chức phận, giỏi giúp việc và đứng ra lo chuyện chung.',
    ham: 'Hãm: hay ôm việc của người khác, dễ bị liên lụy; nên biết từ chối.',
  },
  'Thiên Lương': {
    chung: 'Sao che chở: nhân hậu như người anh cả, thích khuyên bảo; chủ tuổi thọ và giải nạn.',
    sang: 'Sáng: được quý nhân giúp, gặp nạn có người đỡ; hợp nghề y, giáo dục, công tác xã hội.',
    ham: 'Hãm: thích lo chuyện bao đồng, dễ cô độc, tiền bạc không dư dả.',
  },
  'Thất Sát': {
    chung: 'Tướng tinh: can đảm, quyết liệt, dám làm, không chịu luồn cúi.',
    sang: 'Sáng: có uy, gặp thời thì nên công lớn; hợp việc cần quyết đoán.',
    ham: 'Hãm: nóng vội, dễ va chạm, tai nạn; làm gì cũng nên chậm lại một nhịp.',
  },
  'Phá Quân': {
    chung: 'Sao phá cũ lập mới: thích đổi thay, dám phá rào, cuộc đời nhiều biến động.',
    sang: 'Sáng: tiên phong, mở đường, làm nên chuyện lớn khi dám thay đổi.',
    ham: 'Hãm: hao tán, hay bỏ dở, quan hệ dễ đổ vỡ; tránh làm theo cảm hứng.',
  },
};

export const BINH = 'Độ sáng Bình: sức sao ở mức vừa, tốt xấu tùy các sao đi cùng.';

/** Moi phu tinh trong `BANG_SAO` (hai sao cung ten Quan Phù dung chung mot loi). */
export const PHU_TINH: Readonly<Record<string, string>> = {
  // Vong Thai Tue (theo nam sinh).
  'Thái Tuế': 'Sao lời nói, lý lẽ: thẳng thắn, hay tranh luận, có lúc làm mất lòng người.',
  'Thiếu Dương': 'Sao sáng sủa: thông minh, vui vẻ, dễ được giúp.',
  'Tang Môn': 'Sao buồn: dễ có chuyện tang chế, lo buồn trong nhà.',
  'Thiếu Âm': 'Sao hiền hòa: dịu dàng, được phụ nữ giúp đỡ.',
  'Quan Phù': 'Sao quan sự: dễ dính giấy tờ, thủ tục, kiện cáo; cũng nhắc làm việc cẩn trọng.',
  'Tử Phù': 'Sao u buồn: hay phiền muộn, sức khỏe giảm.',
  'Tuế Phá': 'Sao phá tán: ngang bướng, dễ hao tổn, đổ vỡ.',
  'Long Đức': 'Sao phúc đức: hiền lành, gặp dữ hóa lành.',
  'Bạch Hổ': 'Sao dữ: dễ va chạm, thương tích, kiện tụng; gặp sao tốt thì thành mạnh mẽ, có uy.',
  'Phúc Đức': 'Sao phúc đức: tâm tốt, được che chở.',
  'Điếu Khách': 'Sao lời ra tiếng vào: hay nói quá lời, dễ có tin buồn từ xa.',
  'Trực Phù': 'Sao thị phi nhỏ: dễ bị trách móc, lời qua tiếng lại.',
  'Thiên Không': 'Sao trống rỗng: lý tưởng cao mà khó thành, dễ mất mát.',
  // Vong Loc Ton (Bac Sy).
  'Lộc Tồn': 'Sao lộc: tiền bạc vững, biết tiết kiệm, giữ của; luôn có Kình Dương, Đà La kèm hai bên.',
  'Bác Sỹ': 'Sao học thức: thông minh, ham hiểu biết.',
  'Lực Sĩ': 'Sao sức lực: khỏe, dám làm, có quyền hành.',
  'Thanh Long': 'Sao vui: có tin mừng, việc hanh thông.',
  'Tiểu Hao': 'Sao hao nhỏ: tiền ra lặt vặt, khó giữ.',
  'Tướng Quân': 'Sao uy dũng: có khí phách, dám đứng mũi chịu sào; đôi khi nóng.',
  'Tấu Thư': 'Sao văn thư: khéo ăn nói, giỏi giấy tờ, thư từ.',
  'Phi Liêm': 'Sao nhanh: việc đến nhanh; cũng dễ có tin đồn, bị nói sau lưng.',
  'Hỷ Thần': 'Sao vui: có chuyện mừng, tiệc tùng.',
  'Bệnh Phù': 'Sao bệnh: sức khỏe kém, hay mệt mỏi.',
  'Đại Hao': 'Sao hao lớn: tiền bạc dễ hụt nhiều; nên chi tiêu có kế hoạch.',
  'Phục Binh': 'Sao ngầm hại: có người đố kỵ, cạnh tranh ngầm.',
  // Vong Trang Sinh: suc cua cuc tai tung cung.
  'Tràng Sinh': 'Sức sống đang lên: việc mới khởi đầu thuận, chủ sống lâu.',
  'Mộc Dục': 'Tắm gội: thích làm đẹp, đa tình, dễ thay đổi.',
  'Quan Đới': 'Đội mũ: bắt đầu có danh phận, trưởng thành.',
  'Lâm Quan': 'Ra làm quan: sự nghiệp lên, được trọng dụng.',
  'Đế Vượng': 'Thịnh nhất: sức ở đỉnh, làm được việc lớn.',
  'Suy': 'Bắt đầu yếu: nên giữ hơn là tiến.',
  'Bệnh': 'Bệnh: sức kém, hay mệt.',
  'Tử': 'Ngừng lại: việc chậm, kém hoạt động.',
  'Mộ': 'Cất giữ: tích lũy, để dành; cũng chủ chuyện mồ mả.',
  'Tuyệt': 'Dứt: dễ đứt đoạn, phải làm lại từ đầu.',
  'Thai': 'Hoài thai: ý mới đang thành hình, chưa rõ ràng.',
  'Dưỡng': 'Nuôi dưỡng: được chăm lo; có khi là con nuôi, người được đỡ đầu.',
  // Luc sat.
  'Kình Dương': 'Sát tinh: cứng rắn, hay tranh đấu; sáng thì quyết đoán, có uy; hãm thì dễ va chạm, thương tích.',
  'Đà La': 'Sát tinh: dây dưa, chậm, bị cản trở ngầm; sáng thì bền bỉ, nhẫn nại.',
  'Địa Không': 'Sát tinh: hao tán, ý tưởng viển vông, mất mát bất ngờ; hợp việc cần sáng tạo khác người.',
  'Địa Kiếp': 'Sát tinh: tai họa, hao tiền đến bất ngờ; tránh liều lĩnh, cờ bạc.',
  'Hỏa Tinh': 'Sát tinh: nóng nảy, bột phát, việc đến nhanh đi nhanh; cẩn thận lửa, bỏng.',
  'Linh Tinh': 'Sát tinh: âm ỉ, lo lắng ngấm ngầm, phiền não kéo dài.',
  // Luc cat.
  'Văn Xương': 'Sao văn: học giỏi, viết hay, thi cử và giấy tờ thuận.',
  'Văn Khúc': 'Sao tài nghệ: ăn nói hay, khéo tay, có năng khiếu nghệ thuật.',
  'Thiên Khôi': 'Quý nhân: được người trên nâng đỡ, có dịp may ở chỗ công quyền, thi cử.',
  'Thiên Việt': 'Quý nhân: được giúp đỡ kín đáo, nhiều khi từ người lạ hoặc người khác giới.',
  'Tả Phù': 'Sao trợ lực: có người đỡ đần, làm việc có bạn đồng hành; giảm bớt sao xấu.',
  'Hữu Bật': 'Sao trợ lực, cặp với Tả Phù: được bạn bè, người ngang hàng giúp sức.',
  // Tu hoa.
  'Hóa Lộc': 'Thêm lộc: tiền bạc, cơ hội, sự dễ chịu; việc ở cung này hanh thông hơn.',
  'Hóa Quyền': 'Thêm quyền: có tiếng nói, được giao trách nhiệm; quá thì thành độc đoán.',
  'Hóa Khoa': 'Thêm danh: tiếng tốt, học hành thi cử thuận, gặp nạn dễ được giải.',
  'Hóa Kỵ': 'Vướng mắc: hiểu lầm, trắc trở, lo nghĩ ở việc thuộc cung này; nên nhẫn nại, nói rõ ràng.',
  // Cac sao khac.
  'Thiên Mã': 'Sao di chuyển: bôn ba, đi xa, đổi chỗ; gặp Lộc Tồn thì đi xa có lộc.',
  'Long Trì': 'Sao văn nhã: có khiếu nghệ thuật, nhà cửa đẹp; cặp với Phượng Các.',
  'Phượng Các': 'Sao văn nhã: có tiếng tốt, thích cái đẹp; cặp với Long Trì.',
  'Tam Thai': 'Sao địa vị: có chỗ đứng, được trọng; cặp với Bát Tọa.',
  'Bát Tọa': 'Sao địa vị: có nhà cửa, xe cộ, được nể; cặp với Tam Thai.',
  'Ân Quang': 'Sao ơn huệ: được người giúp và biết trả ơn.',
  'Thiên Quý': 'Sao ơn huệ: gặp nạn có người cứu, sống có hậu.',
  'Thiên Khốc': 'Sao buồn: hay lo buồn, nước mắt; sáng thì có tiếng nói, nổi danh muộn.',
  'Thiên Hư': 'Sao hư hao: việc dễ đổ vỡ, hứa nhiều làm ít, buồn vô cớ.',
  'Thiên Đức': 'Sao phúc đức: lòng tốt, gặp nạn được giải.',
  'Nguyệt Đức': 'Sao phúc đức: hiền hậu, được che chở, nhất là trong nhà.',
  'Thiên Hình': 'Sao hình pháp: nghiêm khắc, kỷ luật; xấu thì dễ dao kéo, mổ xẻ, kiện tụng.',
  'Thiên Riêu': 'Sao đào hoa xấu: ham vui, đa nghi, dễ vướng tình cảm rắc rối.',
  'Thiên Y': 'Sao thuốc: hiểu chuyện sức khỏe, hợp nghề y; ốm đau dễ gặp thầy giỏi.',
  'Quốc Ấn': 'Sao ấn tín: được giao chức quyền, giữ giấy tờ quan trọng.',
  'Đường Phù': 'Sao chức phận, nhà cửa: được giao việc, nhà cửa khang trang.',
  'Đào Hoa': 'Sao duyên: hấp dẫn, đông bạn; cũng dễ lắm chuyện tình cảm.',
  'Hồng Loan': 'Sao hôn nhân: duyên dáng, dễ có tin cưới hỏi, chuyện vui về tình cảm.',
  'Thiên Hỷ': 'Sao tin vui: cưới hỏi, sinh nở, tiệc tùng.',
  'Thiên Giải': 'Sao giải: gỡ bớt điều xấu, gặp khó có lối thoát.',
  'Địa Giải': 'Sao giải: hóa giải bớt tai ách.',
  'Giải Thần': 'Sao giải: gỡ rối, hòa giải, gặp nạn có người cứu.',
  'Thai Phụ': 'Sao danh dự: được khen thưởng, có danh hiệu; cặp với Phong Cáo.',
  'Phong Cáo': 'Sao danh dự: được ban khen, có tiếng tốt; cặp với Thai Phụ.',
  'Thiên Tài': 'Sao tài riêng: có khiếu, làm được việc người khác ngại.',
  'Thiên Thọ': 'Sao thọ: sống lâu, tính hiền hòa.',
  'Thiên Thương': 'Sao hao tổn, luôn đóng ở cung Nô Bộc: hạn đi qua dễ có chuyện buồn, hao tốn.',
  'Thiên Sứ': 'Sao hao tổn, luôn đóng ở cung Tật Ách: hạn đi qua nên giữ sức khỏe.',
  'Thiên La': 'Lưới trời, luôn ở cung Thìn: việc dễ rối, bị ràng buộc.',
  'Địa Võng': 'Lưới đất, luôn ở cung Tuất: việc dễ vướng víu, khó thoát.',
  'Cô Thần': 'Sao cô đơn: thích một mình, tự lo liệu, ít nhờ người thân.',
  'Quả Tú': 'Sao cô đơn: lạnh nhạt trong tình cảm, hay sống khép kín.',
  'Phá Toái': 'Sao phá: việc dễ dở dang, hao tốn lặt vặt.',
  'Thiên Quan': 'Sao quý nhân: được người trên giúp, có duyên với việc thiện, tâm linh.',
  'Thiên Phúc': 'Sao phúc: được che chở, gặp dữ hóa lành.',
  'Lưu Hà': 'Sao sông nước, máu: cẩn thận nơi sông nước, thương tích chảy máu.',
  'Thiên Trù': 'Sao bếp: ăn uống đầy đủ, khéo nấu nướng.',
  'Kiếp Sát': 'Sao cướp đoạt: cẩn thận mất mát, tai nạn bất ngờ.',
  'Hoa Cái': 'Sao lộng lẫy: thích chưng diện, có tài nghệ; cũng có nét kiêu, đơn độc.',
  'Lưu Niên Văn Tinh': 'Sao văn: thuận học hành, thi cử, giấy tờ.',
  'Đẩu Quân': 'Sao nghiêm: nguyên tắc, cô độc, ít khoan nhượng.',
};

/** 9 sao luu: nghia khi sao luu nam xem dong o mot cung. */
export const SAO_LUU: Readonly<Record<string, string>> = {
  'Lưu Thái Tuế': 'Cung này "động" trong năm: lời ăn tiếng nói, giấy tờ, việc công nổi lên; dễ có tranh luận.',
  'Lưu Tang Môn': 'Năm nay dễ có chuyện buồn, tang chế, ốm đau dính tới việc của cung này.',
  'Lưu Bạch Hổ': 'Năm nay dễ va chạm, kiện tụng, thương tích ở việc của cung này; đi lại cẩn thận.',
  'Lưu Lộc Tồn': 'Năm nay có lộc ở cung này: tiền bạc, cơ hội đến đều.',
  'Lưu Kình Dương': 'Năm nay có cạnh tranh, va chạm mạnh ở cung này; dễ thương tích nhỏ, nên nhường một bước.',
  'Lưu Đà La': 'Năm nay việc ở cung này dễ chậm, dây dưa, vướng ngầm.',
  'Lưu Thiên Mã': 'Năm nay hay di chuyển, đổi chỗ, đi xa; gặp Lộc Tồn thì đi xa có lộc.',
  'Lưu Thiên Khốc': 'Năm nay dễ có chuyện làm buồn, lo âu ở việc của cung này.',
  'Lưu Thiên Hư': 'Năm nay dễ hụt hẫng: việc hứa hẹn không thành, hao tốn vặt.',
};

/** Than chi dong o 6 cung nay (Than an theo thang, gio sinh). */
export const THAN_CU: Readonly<Record<string, string>> = {
  'Mệnh': 'Thân cư Mệnh: tính cách trước sau như một, tự quyết lấy đời mình; cung Mệnh càng nặng ký.',
  'Phúc Đức': 'Thân cư Phúc Đức: nửa đời sau dựa nhiều vào phúc nhà, sống thiên về tinh thần, coi trọng gia đình, dòng họ.',
  'Quan Lộc': 'Thân cư Quan Lộc: lấy công việc làm lẽ sống, càng về sau càng gắn với sự nghiệp.',
  'Thiên Di': 'Thân cư Thiên Di: hay đi lại, xa nhà; vận may thường đến từ bên ngoài, từ giao thiệp.',
  'Tài Bạch': 'Thân cư Tài Bạch: chú trọng tiền bạc, giỏi xoay xở, coi kinh tế là nền của cuộc sống.',
  'Phu Thê': 'Thân cư Phu Thê: đời sống gắn chặt với người phối ngẫu; hôn nhân ảnh hưởng lớn tới hướng đi.',
};

export const TUAN = 'Tuần: làm sức các sao trong cung yếu đi, cả sao tốt lẫn sao xấu; việc ở cung này hay chậm, phải kiên nhẫn.';
export const TRIET = 'Triệt: chặn mạnh hơn Tuần: sao tốt kém hẳn, sao xấu cũng bớt dữ; việc hay bị cắt ngang, phải làm lại.';
export const VO_CHINH_DIEU = 'Vô chính diệu: cung không có chính tinh nên mượn chính tinh ở cung đối diện để xét; tính chất ít rõ, '
  + 'dễ đổi theo hạn.';

export const HAN = {
  nam: 'Tiểu hạn là cung chủ việc cả năm âm (tính từ Tết). Việc thuộc cung này nổi lên trong năm: sao tốt là chỗ thuận, sao xấu là '
    + 'chỗ cần giữ. Người xem tử vi thường đọc kèm đại vận đang chạy và cung có Lưu Thái Tuế.',
  thang: 'Nguyệt hạn là cung chủ việc trong tháng âm này, mỗi tháng sang một cung. Cách tính: lấy cung tiểu hạn làm tháng Giêng, '
    + 'đếm ngược tới tháng sinh, rồi đếm xuôi tới giờ sinh được tháng Giêng của năm.',
  ngay: 'Nhật hạn là cung chủ việc trong ngày: cung của tháng là mùng 1, mỗi ngày sang một cung. Chỉ nên xem như lời nhắc nhẹ, '
    + 'đừng quyết việc lớn chỉ vì nhật hạn.',
} as const;
