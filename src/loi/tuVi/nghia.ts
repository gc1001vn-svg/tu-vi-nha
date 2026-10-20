/**
 * Loi giai tu vi: 12 cung, 14 chinh tinh (sang / vua / mo), moi phu tinh trong bang sao `laSo.ts`, 9 sao luu, Than cu, Tuan Triet,
 * ba loai han. Y nghia lay theo *Tu Vi Dau So Tan Bien* (Van Dang Thai Thu Lang, Sai Gon 1956 — phan II muc 3 "Dac tinh cac sao",
 * phan III muc 1, 2, 4), doc ban OCR archive.org 20/10; Claude viet lai bang loi thuong (luat 6 CLAUDE.md), khong chep van sach.
 * Thuoc: `tests/LoiGiai.test.ts` (phu du moi cung, moi sao; chu kieu cu Hỏa, Thủy, Hòa).
 */

export const NGHIA_CUNG: Readonly<Record<string, string>> = {
  'Mệnh': 'Cung gốc của lá số: tính tình, dáng vẻ, sức bật và hướng đi chung của cả đời. Đọc cung nào cũng phải đọc kèm cung này. '
    + 'Người xem thường xét Mệnh cùng ba cung chiếu về: Tài Bạch, Quan Lộc (tam hợp) và Thiên Di (đối diện).',
  'Phụ Mẫu': 'Cha mẹ, bề trên, thầy dạy, cấp trên; cũng là phúc được che chở, dạy dỗ. Cung này tốt thì dễ được người lớn nâng đỡ.',
  'Phúc Đức': 'Phúc của dòng họ để lại và đời sống tinh thần: sự an vui, tuổi thọ, họ hàng, mồ mả tổ tiên. Sách Tân Biên dặn xét cung này '
    + 'trước tiên: Phúc tốt thì tai họa cũng nhẹ đi.',
  'Điền Trạch': 'Nhà cửa, đất đai, của để dành và không khí trong nhà: dễ hay khó có nhà, giữ được tài sản hay không.',
  'Quan Lộc': 'Học hành, nghề nghiệp, chức phận và cách làm việc: hợp với việc gì, đường công danh nhanh hay chậm.',
  'Nô Bộc': 'Bạn bè, đồng nghiệp, người dưới quyền, người làm cho mình: được người giúp sức hay bị phiền lụy.',
  'Thiên Di': 'Ra ngoài, đi xa, môi trường xã hội và cách người ngoài nhìn mình. Cung này đối diện cung Mệnh nên chiếu thẳng vào bản thân.',
  'Tật Ách': 'Sức khỏe, bệnh tật, tai nạn. Sao xấu ở đây là lời nhắc giữ gìn, không có nghĩa chắc chắn sẽ ốm.',
  'Tài Bạch': 'Tiền bạc: cách kiếm ra, cách giữ và cách tiêu; tiền đến đều hay thất thường.',
  'Tử Tức': 'Con cái và người nhỏ tuổi dưới mình (học trò, người mình dìu dắt); cũng xem khi tính chuyện sinh con.',
  'Phu Thê': 'Vợ chồng, người yêu, chuyện hôn nhân: dễ hợp hay khó hợp, cưới sớm hay muộn, người phối ngẫu là người thế nào.',
  'Huynh Đệ': 'Anh chị em ruột và những người thân như anh em: có hòa thuận, giúp được nhau không.',
};

/** Viec cua tung cung, ngan, de ghep vao cau ket luan han ("nam nay chuyen ... noi len"). */
export const CHU_DE: Readonly<Record<string, string>> = {
  'Mệnh': 'bản thân, sức khỏe, tinh thần', 'Phụ Mẫu': 'cha mẹ, bề trên, giấy tờ', 'Phúc Đức': 'phúc nhà, họ hàng, tinh thần',
  'Điền Trạch': 'nhà cửa, đất đai', 'Quan Lộc': 'công danh, công việc', 'Nô Bộc': 'bạn bè, đồng nghiệp, người dưới',
  'Thiên Di': 'đi lại, xa nhà, giao thiệp', 'Tật Ách': 'sức khỏe, bệnh tật', 'Tài Bạch': 'tiền bạc, của cải', 'Tử Tức': 'con cái',
  'Phu Thê': 'vợ chồng, tình cảm', 'Huynh Đệ': 'anh chị em',
};

/**
 * Chinh tinh: tinh chat chung · khi sang (Mieu, Vuong, Dac) · khi mo (Ham) · khi vua (Binh — chi Tu Vi, Thien Phu co loi rieng,
 * con lai dung `BINH`). "Sang", "mo" la chu cua sach: sao dung o vi tri hop hay khong hop voi no.
 */
export const CHINH_TINH: Readonly<Record<string, { readonly chung: string; readonly sang: string; readonly ham: string; readonly binh?: string }>> = {
  'Tử Vi': {
    chung: 'Sao đứng đầu lá số, như ông vua: nói về quyền hành, của cải, phúc đức. Đứng ở cung nào thì đem phúc cho việc của cung đó; '
      + 'gặp các sao phò tá (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) thì càng có uy.',
    sang: 'thông minh, trung hậu, nghiêm túc, có uy.',
    binh: 'kém rực rỡ, uy giảm, không đủ sức gỡ tai họa cho cung này.',
    ham: 'kém rực rỡ, uy giảm.',
  },
  'Liêm Trinh': {
    chung: 'Sao của chức việc và luật lệ (sách gọi là Tù tinh): nói về công danh nhưng cũng dính tới kiện cáo, giấy tờ pháp lý.',
    sang: 'liêm khiết, thẳng thắn; ở Mệnh còn có nét duyên dáng, đào hoa.',
    ham: 'khắc nghiệt, khó tính; gặp nhiều sao xấu thì dễ vướng kiện tụng, tai họa.',
  },
  'Thiên Đồng': {
    chung: 'Phúc tinh: nói về phúc và tuổi thọ; tính hiền, hay đổi ý, thích thay đổi.',
    sang: 'trung hậu, tốt bụng, vui vẻ, hay gặp may.',
    ham: 'vẫn hiền nhưng thay đổi thất thường, dễ gặp thị phi, kiện cáo, chuyện không may.',
  },
  'Vũ Khúc': {
    chung: 'Tài tinh: nói về tiền bạc; tính cương quyết, hơi cô độc.',
    sang: 'cứng cỏi, gan dạ, kiếm được tiền, của cải tăng dần.',
    ham: 'tham, bướng, dễ làm hao tán tiền của.',
  },
  'Thái Dương': {
    chung: 'Mặt trời: nói về công danh, chức việc; ứng với cha, ông nội, và với phụ nữ là người chồng.',
    sang: 'thông minh, nhân hậu, hơi nóng tính, có uy, danh và lộc tăng; người sinh ban ngày càng tốt.',
    ham: 'kém sáng suốt, hay nhầm lẫn, uy giảm.',
  },
  'Thiên Cơ': {
    chung: 'Sao mưu trí: nói về anh em, phúc thọ; khéo léo, nhiều mưu kế.',
    sang: 'sáng suốt, khéo tay, có mưu, tốt bụng.',
    ham: 'kém sáng suốt, tính toán hay sai.',
  },
  'Thiên Phủ': {
    chung: 'Kho của trời: nói về tiền của và quyền hành; giúp gỡ bệnh tật, tai ương và kìm bớt các sao dữ (Kình, Đà, Hỏa, Linh).',
    sang: 'nhân hậu, tốt bụng, quyền và lộc tăng.',
    binh: 'vẫn vững nhưng không thêm tốt; sợ gặp Tuần, Triệt, Thiên Không, Địa Không, Địa Kiếp — như kho bị phá.',
    ham: 'vẫn vững nhưng không thêm tốt.',
  },
  'Thái Âm': {
    chung: 'Mặt trăng: nói về nhà đất; ứng với mẹ, bà nội và vợ.',
    sang: 'hiền hòa, nhân hậu, khá giả, nhiều nhà đất, hay gặp may; người sinh ban đêm càng tốt.',
    ham: 'kém sáng suốt, hay nhầm lẫn, tiền của dễ hao, dễ sa sút.',
  },
  'Tham Lang': {
    chung: 'Sao ham muốn (sách xếp vào hung tinh): nói về họa phúc và quyền hành; nhiều ham muốn, thích vui chơi.',
    sang: 'có quyền, có tiền, nhưng vẫn ham vui, thích rượu và sắc.',
    ham: 'tham, nóng nảy, dễ sa đà ăn chơi, hay gây chuyện; có người lại muốn xa lánh đời, đi tu.',
  },
  'Cự Môn': {
    chung: 'Sao ăn nói (sách gọi là ám tinh): nói về lời nói và thị phi.',
    sang: 'nhân hậu, vui vẻ, ăn nói sắc sảo, có quyền, có lộc.',
    ham: 'khó tin cậy, kém sáng suốt, hay gây thị phi, kiện cáo, tai họa.',
  },
  'Thiên Tướng': {
    chung: 'Sao ấn quan (quyền tinh): nói về công danh và việc thiện; kìm được tính nóng của Liêm Trinh và các sao dữ.',
    sang: 'đôn hậu, can đảm, thích cái đẹp, dễ say mê; có uy, có công danh, tiền bạc.',
    ham: 'uy giảm; sợ gặp Tuần, Triệt (như tướng mất ấn) và Kình Dương cùng cung.',
  },
  'Thiên Lương': {
    chung: 'Sao che chở (thọ tinh): nói về cha mẹ, phúc thọ; giúp gỡ bệnh tật, tai họa.',
    sang: 'nhân hậu, khoan hòa, có mưu, biết tùy cơ ứng biến.',
    ham: 'vẫn nhân hậu nhưng hay nhầm lẫn, thay đổi thất thường, ham chơi.',
  },
  'Thất Sát': {
    chung: 'Tướng tinh: nói về uy võ, tranh đấu; gan dạ, dữ dội.',
    sang: 'can đảm, dũng mãnh, nóng nảy, dám làm.',
    ham: 'liều lĩnh, dữ, hay gây tai họa; gặp Kình Dương càng đáng ngại.',
  },
  'Phá Quân': {
    chung: 'Sao phá (hao tinh): nói về vợ chồng và chuyện hao tán; tính mạnh, dám phá lệ.',
    sang: 'can đảm, dũng mãnh, cương nghị, đôi khi hiểm.',
    ham: 'liều lĩnh, dữ, hay làm hao tán, đổ vỡ; gặp Thiên Lương, Thiên Hỷ hay Hóa Lộc thì bớt xấu.',
  },
};

export const BINH = 'sức sao ở mức vừa, tốt xấu tùy các sao đi cùng.';

/** Moi phu tinh trong `BANG_SAO`. Hai sao cung ten Quan Phù (vong Thai Tue, vong Bac Sy) dung chung mot loi. */
export const PHU_TINH: Readonly<Record<string, string>> = {
  // Luc sat, luc cat, tu hoa, Loc Ton, Thien Ma.
  'Kình Dương': 'Sát tinh, cứng và mạnh. Đứng chỗ hợp (Thìn, Tuất, Sửu, Mùi): gan dạ, quả quyết, nhanh nhưng hơi thô; chỗ không hợp: '
    + 'liều lĩnh, dễ gây tai họa, bệnh tật.',
  'Đà La': 'Sát tinh, cặp với Kình Dương: hay làm việc dây dưa, cản trở ngầm. Chỗ hợp thì gan dạ, quả quyết; chỗ không hợp thì liều, '
    + 'dễ gây tai họa, bệnh tật.',
  'Hỏa Tinh': 'Sát tinh nóng như lửa: bột phát, dễ gây tai họa, bệnh tật; sách nói làm giảm thọ. Đứng từ Dần tới Ngọ thì bớt dữ.',
  'Linh Tinh': 'Sát tinh, cặp với Hỏa Tinh nhưng âm ỉ: lo nghĩ ngấm ngầm, dễ gây tai họa, bệnh tật. Đứng từ Dần tới Ngọ thì bớt dữ.',
  'Địa Không': 'Sát tinh, chuyên phá tán. Đứng chỗ hợp (Dần, Thân, Tỵ, Hợi): sâu sắc, có lúc phất lên nhanh rồi đổ nhanh; '
    + 'chỗ không hợp: dễ hao tán, bệnh tật, tai họa.',
  'Địa Kiếp': 'Sát tinh, cặp với Địa Không: tiền của, công việc đến rồi đi bất ngờ. Chỗ không hợp thì dễ hao tán, tai họa.',
  'Văn Xương': 'Văn tinh: nói về chữ nghĩa, thi cử; thông minh, ham học. Gặp sát tinh, Hóa Kỵ, Thiên Riêu thì dễ sa vào sắc dục.',
  'Văn Khúc': 'Văn tinh, cặp với Văn Xương: nói về văn chương, nghệ thuật; thông minh, khéo léo.',
  'Thiên Khôi': 'Quý nhân (Thiên Ất quý nhân): nói về thi cử, chức tước; thông minh, cao thượng, tốt bụng, dễ được người trên giúp.',
  'Thiên Việt': 'Quý nhân, cặp với Thiên Khôi: thông minh, tốt bụng, dễ được giúp. Gặp Hỏa Tinh, Linh Tinh, Thiên Hình thì đáng ngại.',
  'Tả Phù': 'Sao phò tá: chuyên giúp sức. Gặp nhiều sao tốt thì tốt thêm, gặp nhiều sao xấu thì xấu thêm.',
  'Hữu Bật': 'Sao phò tá, cặp với Tả Phù: chuyên giúp sức; đi với sao tốt thì tốt thêm, với sao xấu thì xấu thêm.',
  'Hóa Lộc': 'Thêm tiền, thêm lộc, giữ được chức vị; tốt bụng, giúp gỡ tai họa. Gặp Địa Không, Địa Kiếp, Thiên Không, '
    + 'Đại Hao, Tiểu Hao thì lại hao tán.',
  'Hóa Quyền': 'Mạnh mẽ, nhanh nhẹn, thích nắm quyền. Gặp sao tốt thì tốt thêm, gặp sao xấu thì xấu thêm.',
  'Hóa Khoa': 'Thông minh, hiểu rộng, tốt bụng; thêm phúc thọ, giúp gỡ bệnh tật, tai họa, thuận thi cử; gặp sát tinh cũng không hại.',
  'Hóa Kỵ': 'Ích kỷ, hay ghen ghét, hay nhầm lẫn; dễ gây bệnh tật, thị phi, kiện cáo, nhưng giữ của bền. Đứng ở Thìn, Tuất, Sửu, Mùi thì đỡ lo.',
  'Lộc Tồn': 'Sao lộc: nói về chức tước, tiền của, phúc thọ; thông minh, nghiêm cẩn, hơi cô độc, tốt bụng, giúp gỡ bệnh tật, tai họa. '
    + 'Luôn có Kình Dương, Đà La kèm hai bên.',
  'Thiên Mã': 'Sao đi lại: tháo vát, nhanh nhẹn, hay đi xa, đổi mới; ảnh hưởng nhiều tới công danh, tiền bạc. Gặp Lộc Tồn thì rất tốt; '
    + 'gặp Tuần, Triệt, Thiên Hình, Đà La thì trắc trở.',
  // Cac sao khac.
  'Thiên Không': 'Phá tán, nhiều mưu mà khó làm nên việc; ở Mệnh cùng Hồng Loan thì thích ẩn dật, tu hành.',
  'Đại Hao': 'Bại tinh: làm hao hụt tiền của, gây chia lìa, xa cách.',
  'Tiểu Hao': 'Bại tinh, cặp với Đại Hao: tiền ra lặt vặt, khó giữ, dễ xa cách.',
  'Tang Môn': 'Bại tinh: dễ có tang, buồn, bệnh tật, hao tiền. Gặp Tấu Thư, Phi Liêm thì lại thuận thi cử, công danh.',
  'Bạch Hổ': 'Bại tinh, dữ dội: dễ có tai họa, bệnh tật, hao tiền. Gặp Tấu Thư ("hổ đeo hòm sắt") thì lợi thi cử, công danh.',
  'Thiên Khốc': 'Bại tinh: hay buồn, lo nghĩ xa xôi; việc lúc đầu trắc trở, sau mới thành. Đứng chỗ hợp thì lời nói sắc sảo.',
  'Thiên Hư': 'Bại tinh, cặp với Thiên Khốc: hay buồn, hụt hẫng; việc lúc đầu trắc trở, sau mới thành.',
  'Thiên Hình': 'Sao hình phạt: gan dạ, nghiêm, có uy; liên quan dao kéo, mổ xẻ, châm chích. Gặp sát tinh thì đáng ngại; '
    + 'gặp Lộc, Thiên Y thì hợp nghề thuốc.',
  'Thiên Riêu': 'Đa nghi, hay tin điều huyền bí. Chỗ hợp thì gần rượu sắc mà không hư; chỗ không hợp thì dễ sa vào rượu, sắc. '
    + 'Gặp Long Trì, Phượng Các thì có tin cưới hỏi, sinh nở.',
  'Long Trì': 'Thông minh, hiền hòa, vui vẻ; có tin cưới hỏi, sinh nở; đem may mắn cho công danh, nhà cửa.',
  'Phượng Các': 'Cặp với Long Trì: hiền hòa, vui vẻ; có tin cưới hỏi, sinh nở; nhà cửa thêm đẹp.',
  'Tam Thai': 'Khôn ngoan, đường bệ, phúc hậu, thích an nhàn; nhà cửa thêm khang trang.',
  'Bát Tọa': 'Cặp với Tam Thai: đường bệ, phúc hậu; nhà cửa thêm khang trang.',
  'Ân Quang': 'Thông minh, vui vẻ, trọng ơn nghĩa, tốt bụng; giúp gỡ bệnh tật, tai họa, đem may mắn.',
  'Thiên Quý': 'Cặp với Ân Quang: trọng ơn nghĩa, tốt bụng; gặp nạn có người cứu.',
  'Đào Hoa': 'Vui vẻ, nhanh nhẹn, đa tình; có tin cưới hỏi, chuyện vui; thuận thi cử, công danh.',
  'Hồng Loan': 'Cặp với Đào Hoa: duyên dáng, đa tình; có tin cưới hỏi, chuyện vui.',
  'Thiên Hỷ': 'Vui vẻ, hòa nhã; đem chuyện mừng, thuận cưới hỏi, sinh nở, công danh.',
  'Thai Phụ': 'Thích danh tiếng, hơi phô trương; thuận thi cử, được khen thưởng, bằng cấp.',
  'Phong Cáo': 'Cặp với Thai Phụ: thích danh tiếng; thuận thi cử, bằng cấp.',
  'Quốc Ấn': 'Thuận thi cử, công danh, giữ được chức quyền; gặp Tuần, Triệt thì việc bế tắc.',
  'Đường Phù': 'Đường bệ; thuận công danh, dễ mua nhà đất, nhà cửa khang trang.',
  'Thiên Thọ': 'Điềm đạm, hòa nhã, tốt bụng; thêm phúc thọ.',
  'Bác Sỹ': 'Thông minh, khoan hòa; thuận học hành thi cử, giúp gỡ bệnh tật.',
  'Lưu Niên Văn Tinh': 'Thông minh, thích bằng cấp; thuận học hành, thi cử, công danh (sao gốc, không phải sao lưu).',
  'Hoa Cái': 'Đẹp, bề ngoài có vẻ uy nghi; nói về giàu sang, quyền thế, thuận công danh.',
  'Thiên Trù': 'Thích ăn ngon; thêm tiền lộc.',
  'Thiên Quan': 'Quý nhân: có đức, có lòng tin tôn giáo, tốt bụng; giúp gỡ bệnh tật, tai họa, thêm phúc thọ.',
  'Thiên Phúc': 'Quý nhân, cặp với Thiên Quan: có đức, tốt bụng; giúp gỡ bệnh tật, tai họa.',
  'Thiên Giải': 'Sao giải: có đức, khoan hòa; gỡ bệnh tật, tai họa, thêm phúc thọ.',
  'Địa Giải': 'Sao giải: có đức, khoan hòa; gỡ bệnh tật, tai họa.',
  'Giải Thần': 'Sao giải: gỡ bệnh tật, tai họa; nhưng đứng ở Điền Trạch hay Tài Bạch thì của cải hay hao, khó giàu lớn.',
  'Thiên Đức': 'Có đức, đoan chính, nhân hậu; gỡ được bệnh tật nhỏ.',
  'Nguyệt Đức': 'Cặp với Thiên Đức: đoan chính, nhân hậu; gỡ được bệnh tật nhỏ.',
  'Thiên Y': 'Sạch sẽ, cẩn thận; giúp gỡ bệnh tật.',
  'Cô Thần': 'Cô độc, lạnh lùng, khó tính, ít giao thiệp; giữ của bền nhưng không lợi cho chuyện vợ chồng, con cái.',
  'Quả Tú': 'Cặp với Cô Thần: cô độc, khép kín; giữ của bền nhưng không lợi cho hôn nhân.',
  'Đẩu Quân': 'Nghiêm nghị, khắt khe; giữ của bền; không lợi cho sinh nở.',
  'Thiên Thương': 'Buồn thảm (luôn ở cung Nô Bộc): đem chuyện không may, bệnh tật, cản trở công việc.',
  'Thiên Sứ': 'Buồn thảm (luôn ở cung Tật Ách): đem chuyện không may, bệnh tật, cản trở công việc.',
  'Kiếp Sát': 'Sao dữ: dễ có chuyện đâm chém, mổ xẻ, tai họa.',
  'Lưu Hà': 'Sao dữ: thâm hiểm, dễ gây tai họa; gặp Kiếp Sát cùng cung càng đáng ngại.',
  'Phá Toái': 'Táo bạo, chóng chán, hay bỏ ngang, hao tán; gây trở ngại công việc.',
  'Thiên Tài': 'Sao làm dịu: gặp sao xấu thì giảm cái xấu, gặp sao tốt thì cũng giảm cái tốt.',
  'Thiên La': 'Lưới trời (luôn ở Thìn): kìm hãm, gây rắc rối, cản trở; dính tới bắt bớ, giam cầm.',
  'Địa Võng': 'Lưới đất (luôn ở Tuất): kìm hãm, gây rắc rối, cản trở; dính tới bắt bớ, giam cầm.',
  // Vong Thai Tue (theo nam sinh).
  'Thái Tuế': 'Lạnh lùng, ít giao thiệp, giỏi lý luận, xét đoán. Gặp sao tốt thì ăn nói hùng hồn, có quyền; gặp Đà La, Hóa Kỵ '
    + 'hay sát tinh thì thị phi, kiện cáo.',
  'Thiếu Dương': 'Thông minh, vui vẻ, hòa nhã, tốt bụng; gỡ được bệnh tật, tai họa nhỏ.',
  'Thiếu Âm': 'Cặp với Thiếu Dương: thông minh, hòa nhã, tốt bụng; gỡ được bệnh tật, tai họa nhỏ.',
  'Quan Phù': 'Giỏi lý luận, hay giúp người; dính tới thị phi, kiện cáo, việc pháp luật; gặp sao xấu thì gây rắc rối, cản trở.',
  'Tử Phù': 'Buồn thảm, dễ có tang; gây rắc rối, cản trở.',
  'Trực Phù': 'Cặp với Tử Phù: buồn thảm, gây rắc rối, cản trở.',
  'Tuế Phá': 'Ngang ngược, phá tán.',
  'Long Đức': 'Có đức, đoan chính, hòa nhã, tốt bụng; gỡ bệnh tật, tai họa.',
  'Phúc Đức': 'Có đức, đoan chính, tốt bụng; gỡ bệnh tật, tai họa.',
  'Điếu Khách': 'Hay khoe, nói năng thiếu cẩn thận, ham chơi; dễ có bệnh tật, tai nạn, tin buồn.',
  // Vong Bac Sy (theo Loc Ton).
  'Lực Sĩ': 'Khỏe, mạnh bạo, nhanh nhẹn, có uy lực; gặp sao tốt thì may đến nhanh, gặp sao xấu thì rủi đến nhanh.',
  'Thanh Long': 'Vui vẻ, hòa nhã; thuận công danh, cưới hỏi, sinh nở; gỡ bệnh tật nhỏ.',
  'Tướng Quân': 'Can đảm, hiên ngang, hơi kiêu, thích cầm đầu; thuận công danh; gặp Tuần, Triệt thì đáng ngại.',
  'Tấu Thư': 'Vui vẻ, nói năng khéo; thuận văn chương, đàm luận, ca hát.',
  'Phi Liêm': 'Nhanh nhẹn: gặp sao tốt thì may đến nhanh, gặp sao xấu thì rủi đến nhanh; không lợi cho sinh nở.',
  'Hỷ Thần': 'Vui vẻ, đem chuyện mừng; thuận cưới hỏi.',
  'Bệnh Phù': 'Đau yếu, buồn rầu; nói về bệnh tật.',
  'Phục Binh': 'Gặp sao tốt thì hay giúp đỡ; gặp sao xấu thì dễ bị lừa, bị hại ngầm.',
  // Vong Trang Sinh.
  'Tràng Sinh': 'Hiền, độ lượng; thêm phúc thọ, thuận sinh nở, mọi việc bền lâu.',
  'Mộc Dục': 'Hay thay đổi, dễ chán, bỏ dở việc; thích làm đẹp; dễ sa vào sắc dục.',
  'Quan Đới': 'Ham công danh, có chức vị; gặp sao xấu thì rắc rối, ràng buộc.',
  'Lâm Quan': 'Thích phô trương, nói năng kiểu cách; gặp sao tốt thì phát đạt, gặp sao xấu thì phiền nhiễu.',
  'Đế Vượng': 'Đường bệ, vui vẻ, tốt bụng; thêm phúc thọ, thuận công danh, tiền bạc.',
  'Suy': 'Yếu, kém; nói về sa sút.',
  'Bệnh': 'Đau yếu, buồn, hay nhầm lẫn.',
  'Tử': 'Kín đáo, hay nghĩ sâu, đa sầu; ở Điền Trạch, Tài Bạch thì có của cất giữ, biết giữ tiền.',
  'Mộ': 'Chậm, hay nhầm lẫn; nói về chôn cất, mồ mả. Ở cung Phúc Đức đóng tại Thìn, Tuất, Sửu, Mùi thì rất tốt.',
  'Tuyệt': 'Tiêu tán, bế tắc; nhưng ở Mệnh thì khôn ngoan, nhiều mưu.',
  'Thai': 'Hay nhầm lẫn, ham chơi, a dua; nói về thụ thai, sinh nở.',
  'Dưỡng': 'Chăm chỉ, cẩn thận; nói về nuôi nấng, đỡ đầu, có khi là con nuôi.',
};

/** 9 sao luu (Tan Bien phan III muc 4): sao luu co tinh chat nhu sao goc cung ten, xet theo nam dang xem. */
export const SAO_LUU: Readonly<Record<string, string>> = {
  'Lưu Thái Tuế': 'Chuyện hay dở của cả năm hay xoay quanh việc của cung này: gặp nhiều sao tốt thì càng tốt, gặp nhiều sao xấu thì càng xấu.',
  'Lưu Tang Môn': 'Gặp nhiều sao xấu thì trong năm dễ ốm đau, có tang.',
  'Lưu Bạch Hổ': 'Gặp nhiều sao xấu thì trong năm dễ ốm đau, có tang, tai nạn.',
  'Lưu Thiên Khốc': 'Như sao xấu: trong năm dễ buồn phiền, đau ốm, trừ khi có nhiều sao tốt gỡ.',
  'Lưu Thiên Hư': 'Như sao xấu: trong năm dễ buồn phiền, đau ốm, trừ khi có nhiều sao tốt gỡ.',
  'Lưu Lộc Tồn': 'Gặp sao tốt (nhất là Lộc Tồn, Thiên Mã gốc) thì mọi việc hanh thông, có danh có tiền; gặp Địa Không, Địa Kiếp, '
    + 'Đại Hao, Tiểu Hao thì hao tiền, phiền lòng.',
  'Lưu Kình Dương': 'Gặp nhiều sao xấu thì trong năm dễ có tai nạn, tai họa; đáng lo nhất khi gặp Thất Sát cùng cung.',
  'Lưu Đà La': 'Gặp nhiều sao xấu thì trong năm dễ có tai nạn, tai họa; đáng lo nhất khi gặp Thất Sát cùng cung.',
  'Lưu Thiên Mã': 'Trong năm có đi lại, thay đổi dính tới việc của cung này (đổi chỗ ở, đổi việc, đi xa); gặp Lộc thì tốt, '
    + 'gặp Tuần, Triệt thì trắc trở.',
};

/** Sao luu gap sao goc cung ten trong cung (Tan Bien phan III muc 4): sao xau la nang nhat, Loc Ton, Thien Ma la cang tot. */
export const SAO_LUU_TRUNG: Readonly<Record<string, string>> = {
  'Lưu Tang Môn': 'Gặp Tang Môn gốc cùng cung: sách coi là nặng nhất.',
  'Lưu Bạch Hổ': 'Gặp Bạch Hổ gốc cùng cung: sách coi là nặng nhất.',
  'Lưu Thiên Khốc': 'Gặp Thiên Khốc gốc cùng cung: sách coi là nặng nhất.',
  'Lưu Thiên Hư': 'Gặp Thiên Hư gốc cùng cung: sách coi là nặng nhất.',
  'Lưu Kình Dương': 'Gặp Kình Dương gốc cùng cung: sách coi là rất khó tránh tai họa.',
  'Lưu Đà La': 'Gặp Đà La gốc cùng cung: sách coi là rất khó tránh tai họa.',
  'Lưu Lộc Tồn': 'Gặp Lộc Tồn gốc cùng cung: càng hanh thông.',
  'Lưu Thiên Mã': 'Gặp Thiên Mã gốc cùng cung: danh và tiền càng thịnh.',
};

/** Than chi dong o 6 cung nay. Tan Bien: Menh tot chi toai y luc tre, ve sau can Than tot. */
export const THAN_CU: Readonly<Record<string, string>> = {
  'Mệnh': 'Thân và Mệnh cùng cung: trước sau như một; cung Mệnh nói cả lúc trẻ lẫn về sau.',
  'Phúc Đức': 'Thân ở Phúc Đức: từ trung niên, đời sống gắn nhiều với phúc nhà, tinh thần; cung này tốt thì sống lâu, tránh được nhiều tai họa.',
  'Quan Lộc': 'Thân ở Quan Lộc: từ trung niên, đời sống gắn nhiều với công việc, công danh.',
  'Thiên Di': 'Thân ở Thiên Di: từ trung niên hay đi xa, làm ăn xa; cung này tốt thì lập nghiệp nơi xa thịnh vượng.',
  'Tài Bạch': 'Thân ở Tài Bạch: từ trung niên, đời sống gắn nhiều với chuyện tiền bạc, làm ăn.',
  'Phu Thê': 'Thân ở Phu Thê: từ trung niên, đời sống gắn chặt với vợ (chồng), hôn nhân.',
};
export const THAN_CHUNG = 'Mệnh nói về lúc trẻ, Thân nói về từ trung niên trở đi (sách Tân Biên: Mệnh tốt chỉ toại ý lúc trẻ, về sau cần Thân tốt).';

export const TUAN = 'Tuần (Tuần Trung Không Vong): như tấm màn che các sao trong cung — sao đang sáng bị che bớt thành kém, sao đang mờ '
  + 'lại đỡ xấu; sao cần sáng như Thiên Mã, Thiên Tướng, Quốc Ấn gặp Tuần thì kém hẳn.';
export const TRIET = 'Triệt (Triệt Lộ Không Vong): cũng như Tuần — sao đang sáng bị chặn thành kém, sao đang mờ lại đỡ xấu; '
  + 'việc của cung này hay bị cắt ngang.';
export const VO_CHINH_DIEU = 'Vô chính diệu: cung không có sao chính nào (14 sao chính), nên xét sao chính ở cung đối diện chiếu sang '
  + 'cùng các sao phụ trong cung.';

export const HAN = {
  nam: 'Tiểu hạn là cung chi phối cả năm âm (từ Tết tới hết tháng Chạp): việc của cung này hay xảy ra trong năm. Sách Tân Biên: '
    + 'đại vận tốt thì năm xấu cũng nhẹ; đại vận xấu thì năm tốt cũng bớt tốt.',
  thang: 'Nguyệt hạn là cung chi phối tháng âm này, mỗi tháng một cung. Năm tốt thì tháng xấu không đáng lo; năm xấu thì tháng tốt '
    + 'cũng bớt tốt. Cách tính theo sách Tân Biên (cách sách nói hay dùng nhất): coi cung tiểu hạn là tháng Giêng, đếm ngược tới '
    + 'tháng sinh, rồi đếm xuôi tới giờ sinh.',
  ngay: 'Nhật hạn là cung chi phối hôm nay: cung của tháng là mùng 1, mỗi ngày sang một cung (sách Tân Biên). Chỉ nên xem như '
    + 'lời nhắc nhẹ, đừng quyết việc lớn chỉ vì nhật hạn.',
  ketLuan: 'Cách kết luận theo sách Tân Biên: đếm các sao hội về cung hạn (chính cung, hai cung tam hợp và cung đối diện); quá nửa '
    + 'sao tốt là hạn tốt, quá nửa sao xấu là hạn xấu. App chia sao tốt, xấu theo bảng sao; sao chính tính theo độ sáng.',
} as const;
