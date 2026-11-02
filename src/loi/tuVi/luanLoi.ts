/**
 * Loi luan tu vi tang 1 (tong luan Menh – Than) — Claude tong hop, soan moi (luat 6 CLAUDE.md), khong chep sach. Vi sao chot the,
 * nguon nao noi gi: `docs/LUAN_TU_VI.md` (Toan Thu q.1–2, Tan Bien, Thien Luong *Tu Vi Nghiem Ly*, cach doc pho bien hien nay).
 * Khoa tinh he: chinh tinh trong cung noi "+"; sao le thi "|" + chinh tinh cung doi (`luan.ts` `khoaTinhHe`). Du 60 khoa: test.
 */

export const TINH_HE: Readonly<Record<string, string>> = {
  // Bo Tu Vi
  'Tử Vi|Tham Lang': 'Tử Vi đứng một mình, đối diện Tham Lang: tự tin, thích làm chủ, lòng tự trọng cao, có dáng lãnh đạo. Ở Ngọ là '
    + 'thế đẹp nhất của Tử Vi ("Tử Vi cư Ngọ, không sát tinh thì địa vị cao"); ở Tý sao kém sáng, uy không đủ, dễ cô độc. Phải có '
    + 'người phò tá (Tả Hữu, Xương Khúc) mới làm nên việc lớn; thiếu thì hay tự quyết một mình và ham hưởng thụ.',
  'Tử Vi+Phá Quân': 'Tử Vi đi với Phá Quân: chí lớn, dám phá cũ làm mới, chịu được biến động; thường đổi nghề, đổi chỗ vài lần mới '
    + 'yên. Sách cổ chê thế này "làm thuộc lại" — tài nhiều mà khó giữ ngôi cao lâu; có Tả Hữu, Khoa Quyền Lộc thì thành người khai '
    + 'phá có tiếng. Nên học kiên nhẫn, giữ chữ tín, đừng làm theo hứng.',
  'Tử Vi+Thiên Phủ': 'Tử Phủ đồng cung — sách cổ: "trọn đời phúc dày". Điềm đạm, chắc chắn, giỏi giữ của và quản việc, thích ổn định '
    + 'hơn mạo hiểm. Điểm yếu: bảo thủ, muốn chu toàn mọi bề nên đôi khi chậm quyết; có Tả Hữu, Xương Khúc thì vươn cao.',
  'Tử Vi+Tham Lang': 'Tử Vi gặp Tham Lang (sách gọi "đào hoa phạm chủ"): đa tài, khéo giao thiệp, ham vui, có duyên với nghệ thuật, '
    + 'ăn uống, cái đẹp. Sao không sáng nên dễ sa vào hưởng thụ, tình cảm rắc rối; gặp Hỏa Tinh, Linh Tinh thì có dịp phát lớn bất '
    + 'ngờ; gặp Không Kiếp thì hay hướng về tâm linh. Cần kỷ luật với tiền và chuyện tình.',
  'Tử Vi+Thiên Tướng': 'Tử Vi đi với Thiên Tướng, đối diện Phá Quân: có tổ chức, trọng thể diện, giỏi phối hợp, làm việc theo khuôn '
    + 'phép — hợp vai quản lý, điều hành. Sách cổ nhắc thế này thiếu cát tinh thì "giàu mà không sang, có tiếng hão": bề ngoài hơn '
    + 'thực chất; có Tả Hữu, Khoa Quyền thì danh đi đôi với thực.',
  'Tử Vi+Thất Sát': 'Tử Vi gặp Thất Sát ("hóa sát thành quyền"): quyết đoán, có uy, dám gánh việc khó; hợp làm chủ, quân đội, công an, '
    + 'kỹ thuật, kinh doanh lớn. Ở Tỵ sao sáng, uy rõ; ở Hợi kém sáng, dễ nóng vội và cô độc. Nên học mềm mỏng, chịu nghe người khác.',
  // Bo Thien Co
  'Thiên Cơ|Cự Môn': 'Thiên Cơ ở Tý Ngọ, đối diện Cự Môn: đầu óc nhanh, thích tìm tòi, bàn luận, hay đổi ý; ăn nói và lập kế hoạch '
    + 'giỏi. Dễ lo nghĩ, hay bị điều tiếng vì nói thẳng; hợp nghề cần suy tính: kỹ thuật, tư vấn, giáo dục, buôn bán.',
  'Thiên Cơ|Thiên Lương': 'Thiên Cơ ở Sửu Mùi, đối diện Thiên Lương: thông minh, cẩn trọng, thích lý lẽ, có lòng giúp người; hay làm cố '
    + 'vấn, thầy, chuyên viên. Tài không phô ra, phải bền mới thành; tránh lo xa quá mà lỡ thời cơ.',
  'Thiên Cơ|Thái Âm': 'Thiên Cơ ở Tỵ Hợi, đối diện Thái Âm: linh hoạt, tinh tế, hay di chuyển, đổi việc; giàu tưởng tượng, khéo tay. Ở '
    + 'Tỵ sao sáng: lanh lợi, làm ăn xa có lợi; ở Hợi sao mờ: dễ bất an, nghĩ nhiều làm ít. Hợp nghề cần khéo léo, kế hoạch, dịch vụ.',
  'Thiên Cơ+Thái Âm': 'Cơ Âm đồng cung (thuộc bộ Cơ Nguyệt Đồng Lương): tinh tế, cảm xúc sâu, giỏi lên kế hoạch; hợp công chức, văn '
    + 'phòng, tài chính, nghệ thuật; đời hay đổi chỗ ở, đổi việc. Ở Thân sao sáng: thanh lịch, có của; ở Dần sao mờ: hay lo, dễ dao '
    + 'động vì tình cảm — sách cổ chê "ở Dần dù có cát tinh cũng không đầy đặn".',
  'Thiên Cơ+Cự Môn': 'Cự Cơ đồng cung — sách cổ coi "Cự Cơ ở Mão" là quý cách (Mão hơn Dậu): ăn nói khéo, lý luận sắc, học rộng, giỏi '
    + 'phân tích; hợp luật, báo chí, giảng dạy, kinh doanh cần thương lượng. Mặt trái: hay hoài nghi, dễ thị phi, lên xuống vì lời nói.',
  'Thiên Cơ+Thiên Lương': 'Cơ Lương đồng cung — sách cổ: "Thìn Tuất Cơ Lương chẳng phải chuyện nhỏ": mưu trí, giỏi bàn luận, bày kế, '
    + 'thích triết lý, tôn giáo, y học, tư vấn. Nhược điểm: nói nhiều làm ít, nặng lý thuyết; nên theo nghề chuyên môn để dùng cái trí.',
  // Bo Thai Duong
  'Thái Dương|Thiên Lương': 'Thái Dương một mình ở Tý Ngọ, đối diện Thiên Lương. Ở Ngọ là thế rực rỡ nhất ("Kim xán quang huy"): hào '
    + 'phóng, có danh, hợp việc công, lãnh đạo. Ở Tý sao hãm: tốt bụng mà vất vả, làm nhiều được ghi nhận ít — hợp việc chuyên môn, '
    + 'thầm lặng.',
  'Thái Dương|Thái Âm': 'Thái Dương ở Thìn Tuất, đối diện Thái Âm. Ở Thìn sao sáng: nhiệt tình, thẳng thắn, dễ có danh. Ở Tuất sao lặn '
    + '(sách gọi "phản bối"): sống vì người khác nhiều, vất vả, nên giữ sức. Hợp việc công khai, giáo dục, phục vụ cộng đồng.',
  'Thái Dương|Cự Môn': 'Thái Dương ở Tỵ Hợi, đối diện Cự Môn. Ở Tỵ sáng rõ: chính trực, nói có sức thuyết phục, hợp ngoại giao, truyền '
    + 'thông, luật. Ở Hợi sao hãm: giỏi mà ít được ghi nhận, dễ vướng thị phi — nên chọn nghề dùng lời nói chuyên môn.',
  'Thái Dương+Thái Âm': 'Nhật Nguyệt đồng cung ở Sửu Mùi: tính hai mặt — lúc sôi nổi lúc trầm lắng, giàu cảm xúc, đa tài, dễ thay đổi. '
    + 'Sách cổ: tốt nhất khi có Lộc, Quyền, Khoa; không có thì "phúc khó đầy". Hợp việc cần cả lý lẫn tình: giáo dục, y tế, nghệ thuật.',
  'Thái Dương+Cự Môn': 'Cự Nhật đồng cung — sách cổ: "Cự Nhật đồng cung, quan phong ba đời" (Dần đẹp hơn Thân): ăn nói giỏi, có tầm '
    + 'nhìn, nổi danh nhờ lời nói; hợp ngoại giao, truyền thông, luật, giảng dạy. Ở Thân Thái Dương kém sáng: vất vả hơn, dễ khẩu '
    + 'thiệt — cần giữ lời, tránh tranh cãi.',
  'Thái Dương+Thiên Lương': 'Dương Lương đồng cung. Ở Mão ("Nhật chiếu lôi môn"): rộng lượng, có danh, hợp việc công, y, giáo dục; '
    + 'thêm Văn Xương, Lộc là cách "Dương Lương Xương Lộc" — học hành, thi cử đỗ đạt. Ở Dậu sao lặn: tốt bụng mà vất vả, danh không '
    + 'bằng công; nên theo chuyên môn, đừng ôm việc thiên hạ.',
  // Bo Vu Khuc
  'Vũ Khúc|Tham Lang': 'Vũ Khúc ở Thìn Tuất (miếu), đối diện Tham Lang: cứng cỏi, quyết đoán, giỏi kiếm tiền; hợp kinh doanh, tài chính, '
    + 'kỹ thuật, quân đội. Bộ Vũ Tham "không phát tuổi trẻ" — thường ngoài ba mươi mới vững. Cần mềm mỏng trong quan hệ, nhất là '
    + 'chuyện vợ chồng.',
  'Vũ Khúc+Thiên Phủ': 'Vũ Phủ đồng cung — sao tiền gặp kho: giỏi quản tiền, làm ăn chắc, giữ được của; thực tế, ít mạo hiểm. Hợp tài '
    + 'chính, ngân hàng, quản lý. Mặt trái: tính toán quá kỹ, khô khan tình cảm; gặp Không Kiếp thì phải phòng hao tán.',
  'Vũ Khúc+Tham Lang': 'Vũ Tham đồng cung ở Sửu Mùi — sách cổ: "Tham Vũ đồng hành uy trấn biên cương", "Tham Vũ ở Mộ, ba mươi tuổi mới '
    + 'phát": ý chí mạnh, chịu khó, làm giàu từ hai bàn tay, phát muộn mà bền; gặp Hỏa Linh thì phát lớn. Tuổi trẻ thường vất vả, nóng vội.',
  'Vũ Khúc+Thiên Tướng': 'Vũ Tướng đồng cung: tháo vát, giữ chữ tín, giỏi việc tiền bạc, giấy tờ; hợp tài chính, hành chính, kinh '
    + 'doanh có tổ chức. Tính thẳng, đôi khi cứng nhắc; gặp Kình Đà thì vất vả vì tiền.',
  'Vũ Khúc+Thất Sát': 'Vũ Sát đồng cung: cứng rắn, gan dạ, làm việc mạnh tay; hợp kỹ thuật, quân đội, công an, kinh doanh cạnh tranh. '
    + 'Mặt trái: nóng nảy, cô độc, dễ va chạm và hao tài vì quyết vội; cần học chữ nhẫn.',
  'Vũ Khúc+Phá Quân': 'Vũ Phá đồng cung (cả hai hãm): dám nghĩ dám làm, thích tự lập, hay rời quê lập nghiệp, có tay nghề; tiền vào ra '
    + 'mạnh. Dễ phá tán, đổi nghề nhiều; nên theo nghề chuyên môn, quản tiền chặt, tránh đầu cơ.',
  // Bo Thien Dong
  'Thiên Đồng|Thái Âm': 'Thiên Đồng ở Mão Dậu, đối diện Thái Âm: hiền hòa, dễ gần, thích sống nhẹ nhàng, giàu tình cảm; ở Mão khá hơn '
    + 'Dậu. Dễ thiếu quyết đoán, ngại khó; hợp môi trường ổn định, nghề dịch vụ, chăm sóc, nghệ thuật.',
  'Thiên Đồng|Cự Môn': 'Thiên Đồng ở Thìn Tuất (hãm), đối diện Cự Môn: tuổi trẻ vất vả, tâm trạng thất thường, dễ va thị phi; về sau mới '
    + 'yên. Sách cổ: "Thiên Đồng ở Tuất là phản bối, tuổi Đinh có hóa lại đại quý" — gặp Hóa Lộc, Quyền thì đổi hẳn. Nên học một nghề chắc.',
  'Thiên Đồng|Thiên Lương': 'Thiên Đồng ở Tỵ Hợi, đối diện Thiên Lương: phúc hậu, lạc quan, thích giúp người; sách cổ khen tuổi Bính ở '
    + 'đây "tài quan đều đẹp". Dễ an phận, ham vui; nên đặt mục tiêu rõ để khỏi phí tài.',
  'Thiên Đồng+Thái Âm': 'Đồng Âm đồng cung: dịu dàng, tình cảm, có khiếu nghệ thuật, thẩm mỹ. Ở Tý cả hai sáng: an nhàn, có của, được '
    + 'yêu mến. Ở Ngọ cả hai hãm: cảm xúc dao động, dễ vướng chuyện tình, nên rèn ý chí.',
  'Thiên Đồng+Cự Môn': 'Đồng Cự đồng cung (cả hai hãm): tâm tư nhiều, dễ buồn bực, hay bị hiểu lầm; tuổi trẻ nhiều trắc trở, trung niên '
    + 'mới yên. Hợp nghề dùng lời nói chuyên môn (giảng dạy, tư vấn, bán hàng); nên tránh tranh cãi, giữ tinh thần thư thái.',
  'Thiên Đồng+Thiên Lương': 'Đồng Lương đồng cung — sách cổ: "Dần Thân rất mừng gặp Đồng Lương": nhân hậu, có phúc, sống lâu, thích '
    + 'giúp đỡ; hợp y, giáo dục, công tác xã hội, công chức. Mặt trái: dễ an phận, thiếu tham vọng; gặp Thiên Mã thì hay phiêu bạt.',
  // Bo Liem Trinh
  'Liêm Trinh|Tham Lang': 'Liêm Trinh đứng một mình ở Dần Thân (vượng), đối diện Tham Lang: thông minh, có tham vọng, giỏi giao tế; hợp '
    + 'chính trị, quản lý, kinh doanh. Sách cổ xếp tuổi Giáp ở đây vào thượng cách. Cần giữ chừng mực trong tình cảm, quan hệ.',
  'Liêm Trinh+Thiên Phủ': 'Liêm Phủ đồng cung: khôn ngoan, cẩn thận, giỏi quản lý và giữ của, tính đường dài; hợp hành chính, tài chính, '
    + 'kinh doanh. Thiên Phủ làm dịu cái nóng của Liêm Trinh nên tính điềm hơn; nhược điểm là đa nghi.',
  'Liêm Trinh+Thiên Tướng': 'Liêm Tướng đồng cung: chính trực, trọng nguyên tắc, có trách nhiệm — sách cổ nói Thiên Tướng "hóa được cái '
    + 'dữ của Liêm Trinh". Hợp luật, hành chính, quân đội. Gặp Kình Dương, Thiên Hình thì dễ vướng kiện tụng — cần làm đúng luật.',
  'Liêm Trinh+Thất Sát': 'Liêm Sát đồng cung — sách cổ: "Liêm Trinh Thất Sát lại là người tích giàu": cương nghị, chịu khổ, dám làm, tự '
    + 'tay gây dựng; hợp kỹ thuật, kinh doanh, quân đội. Tuổi trẻ nhiều sóng gió, hay đi xa lập nghiệp; gặp sát tinh phải cẩn trọng '
    + 'việc kiện tụng, đi lại.',
  'Liêm Trinh+Tham Lang': 'Liêm Tham đồng cung ở Tỵ Hợi (cả hai hãm): đa tài, đa tình, giỏi giao tế, ham vui; đời nhiều biến động, dễ '
    + 'sa vào rượu chè, tình ái nếu không giữ mình. Gặp Hóa Lộc, Hóa Khoa hay Tuần Triệt thì đỡ hẳn. Hợp nghệ thuật, '
    + 'dịch vụ, giao tế.',
  'Liêm Trinh+Phá Quân': 'Liêm Phá đồng cung (cả hai hãm): bạo dạn, thích phiêu lưu, đổi mới, chịu áp lực tốt; đời nhiều thăng trầm, '
    + 'hay đổi nghề, đổi chỗ. Hợp kỹ thuật, quân đội, nghề cần gan dạ có kỷ luật. Cần kiềm nóng nảy, tránh liều với tiền bạc.',
  // Thien Phu, Thai Am, Tham Lang, Cu Mon, Thien Tuong, Thien Luong, That Sat, Pha Quan dung mot minh
  'Thiên Phủ|Liêm Trinh+Thất Sát': 'Thiên Phủ một mình ở Sửu Mùi, đối diện Liêm Sát: cẩn thận, biết giữ của, sống thực tế; ngoài ôn '
    + 'hòa mà trong nhiều toan tính. Phải tự lực nhiều, làm ăn chắc thì giàu dần; tránh bảo thủ, đa nghi.',
  'Thiên Phủ|Tử Vi+Thất Sát': 'Thiên Phủ ở Tỵ Hợi, đối diện Tử Sát: điềm đạm mà có uy, giỏi quản lý tài sản và con người; có Tả Hữu '
    + 'phò thì phúc lớn. Nên bớt cầu toàn để khỏi lỡ việc.',
  'Thiên Phủ|Vũ Khúc+Thất Sát': 'Thiên Phủ ở Mão Dậu, đối diện Vũ Sát: thực tế, giỏi tính toán tiền bạc, chăm chỉ; sao ở mức bình nên '
    + 'phải tích lũy dần, không giàu nhanh. Tránh keo kiệt, cứng nhắc.',
  'Thái Âm|Thiên Cơ': 'Thái Âm ở Tỵ Hợi, đối diện Thiên Cơ. Ở Hợi là "Nguyệt lãng thiên môn" (quý cách): thanh tú, tinh tế, có của, '
    + 'được nể. Ở Tỵ sao hãm: nhạy cảm, hay lo, tiền vào ra thất thường — nên làm nghề chuyên môn, tích lũy đều.',
  'Thái Âm|Thiên Đồng': 'Thái Âm ở Mão Dậu, đối diện Thiên Đồng. Ở Dậu sáng: dịu dàng, có của, giỏi quản gia và tài chính. Ở Mão hãm: '
    + 'tình cảm dễ tổn thương, vất vả về tiền — nên làm nghề ổn định, tránh đầu cơ.',
  'Thái Âm|Thái Dương': 'Thái Âm ở Thìn Tuất, đối diện Thái Dương. Ở Tuất sáng: trầm tĩnh, thông minh, có của, hay được phụ nữ giúp. Ở '
    + 'Thìn hãm: sống nội tâm, dễ buồn, việc nhà vất vả. Hợp nghề tỉ mỉ, kế toán, nghệ thuật.',
  'Tham Lang|Tử Vi': 'Tham Lang ở Tý Ngọ (hãm), đối diện Tử Vi: đa tài, nhiều ham muốn, ưa náo nhiệt, giỏi ứng biến; dễ sa vào hưởng '
    + 'thụ, tình cảm phức tạp (sách Việt cảnh giác "Tham Lang ở Tý gặp Kình Dương"). Gặp Hỏa Linh thì có dịp phát; cần kỷ luật bản thân.',
  'Tham Lang|Liêm Trinh': 'Tham Lang ở Dần Thân, đối diện Liêm Trinh: khéo giao tế, linh hoạt, có tham vọng; hợp kinh doanh, ngoại giao, '
    + 'nghệ thuật. Dễ ham vui, nhiều mối quan hệ rối; gặp Đà La thì phải giữ mình chuyện tình.',
  'Tham Lang|Vũ Khúc': 'Tham Lang ở Thìn Tuất (miếu), đối diện Vũ Khúc: mạnh mẽ, giỏi kiếm tiền, giao thiệp rộng; sách cổ: Tham Lang ở '
    + 'bốn cung Mộ "phúc khí đậm", gặp Hỏa Tinh lập công lớn. Thường phát muộn; tuổi trẻ ham vui.',
  'Cự Môn|Thiên Cơ': 'Cự Môn ở Tý Ngọ, đối diện Thiên Cơ — "Thạch trung ẩn ngọc" (ngọc trong đá): tài giấu bên trong, ăn nói sắc, học '
    + 'sâu; phải qua mài giũa mới sáng, thường thành danh từ trung niên. Gặp Khoa Quyền Lộc thì quý; gặp sát tinh dễ thị phi.',
  'Cự Môn|Thiên Đồng': 'Cự Môn ở Thìn Tuất (hãm), đối diện Thiên Đồng: hay nghi ngờ, dễ vướng điều tiếng, tuổi trẻ vất vả. Sách cổ: "Cự '
    + 'Môn Thìn Tuất là hãm địa, tuổi Tân có hóa lại vinh" — gặp Hóa Lộc, Quyền thì đổi hẳn. Hợp nghề dùng lời nói chuyên môn.',
  'Cự Môn|Thái Dương': 'Cự Môn ở Tỵ Hợi, đối diện Thái Dương: lý lẽ, nói có sức nặng; ở Hợi được Thái Dương sáng chiếu nên khá, ở Tỵ kém '
    + 'hơn. Hợp luật, giảng dạy, truyền thông; cần giữ lời, tránh thị phi.',
  'Thiên Tướng|Liêm Trinh+Phá Quân': 'Thiên Tướng ở Mão Dậu (hãm), đối diện Liêm Phá: tốt bụng, thích giúp, nhưng dễ bị lợi dụng hoặc '
    + 'kéo vào việc rắc rối; đời nhiều biến động. Nên chọn môi trường có nguyên tắc rõ, tránh đứng ra bảo lãnh.',
  'Thiên Tướng|Tử Vi+Phá Quân': 'Thiên Tướng ở Sửu Mùi, đối diện Tử Phá: chu đáo, trọng thể diện, giỏi phối hợp; hợp vai phụ tá, quản '
    + 'lý. Cung đối nhiều biến động nên có lúc phải làm lại; giữ chữ tín là vốn lớn nhất.',
  'Thiên Tướng|Vũ Khúc+Phá Quân': 'Thiên Tướng ở Tỵ Hợi, đối diện Vũ Phá: hiền hòa, tháo vát, hay gánh việc cho người; tiền vào ra mạnh. '
    + 'Nên theo nghề chuyên môn, quản lý tài chính chặt.',
  'Thiên Lương|Thiên Cơ': 'Thiên Lương ở Sửu Mùi, đối diện Thiên Cơ: chín chắn, thích làm thầy, làm cố vấn, giàu lòng thương người. Dễ '
    + 'ôm việc thiên hạ, cô độc; nên giữ chừng mực.',
  'Thiên Lương|Thiên Đồng': 'Thiên Lương ở Tỵ Hợi (hãm), đối diện Thiên Đồng: thích tự do, phóng khoáng, hay đi xa — sách cổ: "Thiên '
    + 'Lương gặp Thiên Mã ở đất hãm thì phiêu bạt". Nên có nghề chuyên môn và mục tiêu dài hạn.',
  'Thiên Lương|Thái Dương': 'Thiên Lương ở Tý Ngọ, đối diện Thái Dương. Ở Ngọ — sách cổ: "Lương ở Ngọ, quan chức thanh cao": chính trực, '
    + 'có danh, sống lâu; hợp việc công, y, giáo dục. Ở Tý cũng tốt nhưng phải tự lực nhiều hơn.',
  'Thất Sát|Liêm Trinh+Thiên Phủ': 'Thất Sát ở Thìn Tuất (hãm), đối diện Liêm Phủ: gan dạ, làm việc mạnh tay; đời nhiều thăng trầm, '
    + 'phải tự lập sớm. Cần kiềm nóng nảy, chọn nghề kỹ thuật, có kỷ luật.',
  'Thất Sát|Tử Vi+Thiên Phủ': 'Thất Sát ở Dần Thân, đối diện Tử Phủ — "Thất Sát triều đẩu" (sách cổ: "tước lộc vinh xương"): quyết '
    + 'đoán, chí lớn, tự gây dựng; hợp lãnh đạo, quân đội, kinh doanh. Đời có lúc thăng trầm nhưng đi lên.',
  'Thất Sát|Vũ Khúc+Thiên Phủ': 'Thất Sát ở Tý Ngọ, đối diện Vũ Phủ: mạnh mẽ, độc lập, giỏi tổ chức, có sức làm giàu — sách cổ: Thất '
    + 'Sát ở Dần Thân Tý Ngọ "bốn phương phục anh hùng". Cần mềm mỏng hơn trong quan hệ.',
  'Phá Quân|Liêm Trinh+Thiên Tướng': 'Phá Quân ở Tý Ngọ (miếu), đối diện Liêm Tướng — sách cổ: "Tý Ngọ Phá Quân thêm quan tiến lộc": '
    + 'dũng cảm, dám đổi mới, có sức khai phá; hợp lãnh đạo, quân đội, khởi nghiệp. Cần biết giữ thành quả.',
  'Phá Quân|Tử Vi+Thiên Tướng': 'Phá Quân ở Thìn Tuất, đối diện Tử Tướng: thích đổi mới, dám làm, có tham vọng; đời nhiều thay đổi. '
    + 'Câu phú "trai Phá Quân Thìn Tuất bất nhân" không đúng cho mọi người — còn tùy tuổi, vòng Thái Tuế. Giữ chữ tín.',
  'Phá Quân|Vũ Khúc+Thiên Tướng': 'Phá Quân ở Dần Thân (hãm), đối diện Vũ Tướng: thẳng thắn, liều lĩnh, hay đổi việc; tiền vào ra '
    + 'mạnh. Hợp nghề kỹ thuật, tay nghề giỏi; nên tiết kiệm, tránh đầu tư vội.',
};

/** Menh vo chinh dieu: muon tinh he cung doi. */
export const VO_CHINH = 'Mệnh vô chính diệu (không có sao chính) nên mượn sao cung đối diện; sức chỉ bằng khoảng một nửa, đời dễ '
  + 'chịu ảnh hưởng hoàn cảnh, người xung quanh (sách cổ coi là thế yếu). Bù lại người này linh hoạt, dễ thích nghi.';
export const VO_CHINH_NHAT_NGUYET = ' Có Thái Dương, Thái Âm sáng chiếu về nên được sáng sủa, minh bạch ("chính không bằng chiếu").';

/** Suc Menh theo diem (`luan.ts` `sucMenh`). */
export const SUC_MENH = {
  vung: 'Tính chung Mệnh và ba cung chiếu về (Tài Bạch, Quan Lộc, Thiên Di): thế vững — cát tinh trội hơn sát tinh, gặp vận '
    + 'tốt là phát được.',
  vua: 'Tính chung Mệnh và ba cung chiếu về (Tài Bạch, Quan Lộc, Thiên Di): thế vừa — tốt xấu xen nhau, thành bại tùy vận và '
    + 'sự cố gắng.',
  yeu: 'Tính chung Mệnh và ba cung chiếu về (Tài Bạch, Quan Lộc, Thiên Di): thế yếu — sát tinh nặng hơn cát tinh, đời phải tự '
    + 'lực nhiều, nên chọn nghề vững, tránh mạo hiểm; vận tốt vẫn có thể đổi hẳn.',
} as const;

/** Tam hop cua vong Thai Tue ma Menh dung (Thien Luong; lech = (chi Menh − chi nam) mod 4). */
export const THAI_TUE: readonly string[] = [
  'Mệnh ở tam hợp Thái Tuế (Thái Tuế – Quan Phù – Bạch Hổ): người có lý tưởng, nói được làm được, sống đường hoàng, hay nhận '
    + 'trách nhiệm với tập thể.',
  'Mệnh ở tam hợp Thiếu Dương (Thiếu Dương – Tử Phù – Phúc Đức): thông minh, khôn khéo, biết tùy cơ ứng biến; nên dùng cái khéo '
    + 'vào việc chính đáng.',
  'Mệnh ở tam hợp Tuế Phá (Tang Môn – Tuế Phá – Điếu Khách): hay thấy chưa vừa ý, muốn đổi thay, dám phản biện; dễ va chạm với '
    + 'người trên — biết chọn đúng việc để "phá" thì thành người cải cách.',
  'Mệnh ở tam hợp Thiếu Âm (Thiếu Âm – Long Đức – Trực Phù): hiền, dễ tin người, đôi khi tính chưa kỹ mà làm; nên học cân nhắc '
    + 'trước khi quyết.',
];

/** Menh (nap am nam sinh) – Cuc: sinh nhau / cung hanh / khac nhau. */
export const MENH_CUC = {
  sinh: 'Mệnh và Cục sinh nhau: gốc thuận, làm việc ít bị cản.',
  dong: 'Mệnh và Cục cùng hành: vững gốc, dễ giữ được cái mình có.',
  khac: 'Mệnh và Cục khắc nhau: gốc không thuận, việc gì cũng phải gắng hơn người mới thành — là điểm trừ, không phải án định.',
} as const;

/** Am duong nam sinh voi cung Menh (Tan Bien 1.5). */
export const AM_DUONG = {
  thuan: 'Âm dương thuận lý (năm sinh và cung Mệnh cùng âm hoặc cùng dương): làm việc thuận chiều, ít trắc trở vô cớ.',
  nghich: 'Âm dương nghịch lý (năm sinh và cung Mệnh khác âm dương): hay gặp cảnh "làm đúng mà chưa gặp thời", cần kiên nhẫn hơn.',
} as const;

/** Phuc Duc: cat > sat / lan / sat > cat (Toan Thu: "xem Phuc Duc truoc"). */
export const PHUC_DUC = {
  tot: 'Cung Phúc Đức có cát tinh trội: phúc nhà dày, gặp nạn hay có người đỡ, tinh thần an ổn — cung này nên xem trước tiên.',
  vua: 'Cung Phúc Đức tốt xấu xen nhau: phúc vừa phải, tự mình tu tâm, làm lành thì giữ được yên.',
  kem: 'Cung Phúc Đức có sát tinh trội: phúc mỏng, hay lo nghĩ, việc gì cũng phải tự gánh — nên sống hiền, giúp người để bù.',
} as const;

/** Viec sao chu khi mang tu hoa (ghep vao cau tu hoa). */
export const VIEC_SAO: Readonly<Record<string, string>> = {
  'Tử Vi': 'địa vị, quyền tự quyết', 'Thiên Cơ': 'mưu tính, kế hoạch, đổi thay', 'Thái Dương': 'danh tiếng, cha, chồng, người nam',
  'Vũ Khúc': 'tiền bạc, quyết đoán', 'Thiên Đồng': 'hưởng thụ, tâm tình', 'Liêm Trinh': 'quan hệ, cảm xúc, giấy tờ pháp lý',
  'Thiên Phủ': 'tích trữ, quản lý', 'Thái Âm': 'tiền tích góp, nhà cửa, mẹ, vợ, người nữ', 'Tham Lang': 'ham muốn, giao tế, hưởng thụ',
  'Cự Môn': 'lời nói, tranh luận', 'Thiên Lương': 'che chở, danh dự, người lớn', 'Phá Quân': 'đổi mới, phá cũ làm mới',
  'Văn Xương': 'giấy tờ, chữ nghĩa, thi cử', 'Văn Khúc': 'chữ nghĩa, tài ăn nói, nghệ thuật', 'Hữu Bật': 'người giúp sức',
};

/** Y chung cua tung hoa. */
export const HOA = {
  'Hóa Lộc': 'thuận, có duyên kiếm lợi',
  'Hóa Quyền': 'có quyền, nắm thế chủ động',
  'Hóa Khoa': 'có tiếng tốt, được quý nhân giúp, gặp nạn dễ gỡ',
  'Hóa Kỵ': 'vướng, hay trục trặc, phải để tâm nhiều',
} as const;

/** Cach cuc: ten, tot/xau, loi. Dieu kien o `luan.ts` `CACH`. */
export const CACH_LOI: Readonly<Record<string, string>> = {
  tuPhuDong: 'Tử Phủ đồng cung: phúc dày, giỏi quản trị, đời ít khi túng (sách cổ: "trọn đời phúc dày").',
  tuPhuTrieu: 'Tử Phủ triều viên (Tử Vi, Thiên Phủ chiếu về Mệnh): được nâng đỡ, có lộc, có chỗ dựa vững.',
  phuTuongTrieu: 'Phủ Tướng triều viên (Thiên Phủ, Thiên Tướng chiếu về Mệnh): áo cơm đủ đầy, dễ được tin dùng.',
  quanThan: 'Quân thần khánh hội (Tử Vi gặp Tả Phù, Hữu Bật): có người phò tá đắc lực — làm chủ, làm lãnh đạo thuận.',
  cucHuong: 'Cực hướng ly minh (Tử Vi ở Ngọ): thế cao nhất của Tử Vi — có uy, dễ ở vị trí đứng đầu.',
  satTrieu: 'Thất Sát triều đẩu / ngưỡng đẩu (Thất Sát ở Dần Thân Tý Ngọ): chí lớn, tự lập, càng va chạm càng mạnh.',
  coNguyet: 'Cơ Nguyệt Đồng Lương: hợp làm việc trong tổ chức, công chức, chuyên viên — ổn định, tiến đều (sách cổ: "làm lại").',
  satPhaTham: 'Sát Phá Tham: hợp hành động, đổi mới, đi xa lập nghiệp (sách cổ: "Thất Sát Phá Quân nên ra ngoài"); đời nhiều biến động.',
  nhatNguyetMinh: 'Nhật Nguyệt tịnh minh (Thái Dương, Thái Âm cùng sáng chiếu Mệnh): sáng suốt, minh bạch, danh và lợi đều có.',
  nhatXuat: 'Nhật xuất phù tang / Nhật chiếu lôi môn (Thái Dương ở Mão): như mặt trời mới mọc — sự nghiệp lên dần, có danh.',
  kimXan: 'Kim xán quang huy (Thái Dương ở Ngọ): rực rỡ, có danh, hào phóng.',
  nguyetLang: 'Nguyệt lãng thiên môn (Thái Âm ở Hợi): thanh nhã, có của, được nể trọng.',
  minhChau: 'Minh châu xuất hải (Mệnh ở Mùi vô chính diệu, Thái Dương ở Mão, Thái Âm ở Hợi chiếu về): tuy không sao chính mà sáng '
    + 'sủa, học hành, công danh tốt.',
  thachTrung: 'Thạch trung ẩn ngọc (Cự Môn ở Tý Ngọ): tài giấu bên trong, thành danh muộn mà chắc.',
  cuNhat: 'Cự Nhật đồng cung (Dần Thân): nổi danh nhờ lời nói, hợp ngoại giao, truyền thông.',
  cuCo: 'Cự Cơ cư Mão Dậu: lý luận giỏi, học rộng (sách cổ khen nhất ở Mão).',
  thamHoa: 'Tham Hỏa / Tham Linh tương phùng: dễ phát lớn bất ngờ, nhất là trong kinh doanh, cạnh tranh.',
  thamVu: 'Tham Vũ đồng hành (Sửu Mùi): làm giàu bằng sức mình, phát sau tuổi ba mươi.',
  vuThuVien: 'Vũ Khúc thủ viên (Vũ Khúc ở Mão): có uy về tiền bạc, quyết đoán.',
  locMa: 'Lộc Mã giao trì (Lộc và Thiên Mã gặp nhau): tiền đến nhờ di chuyển, làm ăn xa, buôn bán.',
  tamKy: 'Tam kỳ gia hội (Lộc, Quyền, Khoa hội về Mệnh): danh, quyền, lợi đều có — một trong những cách đẹp nhất.',
  songLoc: 'Song Lộc (Lộc Tồn và Hóa Lộc hội Mệnh): lộc dày, kiếm tiền có duyên.',
  taHuuGiap: 'Tả Hữu giáp Mệnh: luôn có người giúp hai bên.',
  xuongKhucGiap: 'Xương Khúc giáp Mệnh: học hành, giấy tờ, văn chương thuận.',
  nhatNguyetGiap: 'Nhật Nguyệt giáp Mệnh: có quý nhân soi đường, được che chở.',
  toaQuy: 'Tọa quý hướng quý (Thiên Khôi, Thiên Việt ở Mệnh và cung chiếu): hay gặp người tốt nâng đỡ, thi cử thuận.',
  vanQue: 'Văn Quế Văn Hoa (Văn Xương, Văn Khúc ở Mệnh Sửu Mùi): học giỏi, có tiếng về chữ nghĩa.',
  kinhMieu: 'Kình Dương nhập miếu (Kình ở Thìn Tuất Sửu Mùi, có cát tinh): cương quyết, dám tranh, hợp nghề cần bản lĩnh.',
  maDau: 'Mã đầu đới kiếm (Kình Dương ở Ngọ, lối sách Việt): dũng, dám mạo hiểm; có cát tinh thì lập công, gặp sát thì phải phòng '
    + 'thương tích.',
  khongKiepGiap: 'Không Kiếp giáp Mệnh: dễ hao hụt, việc hay hụt hẫng giữa chừng — nên tiêu pha cẩn thận, tránh đầu cơ.',
  kinhDaGiap: 'Kình Đà giáp Mệnh (luôn kèm Lộc Tồn ở Mệnh): có lộc nhưng bị kèm hai bên, giữ của vất vả — Kình Đà sáng thì nhẹ.',
  kinhDaGiapKy: 'Kình Đà giáp Kỵ: thế bị kẹp chặt — việc hay bế tắc, nên đi chậm chắc, tránh tranh chấp.',
  hoaLinhGiap: 'Hỏa Linh giáp Mệnh: tính nóng, việc hay gấp gáp — nên bình tĩnh, giữ sức khỏe.',
  nhatNguyetPhan: 'Nhật Nguyệt phản bối (Thái Dương, Thái Âm cùng mờ chiếu Mệnh): vất vả, công nhiều danh ít; hợp việc thầm lặng, '
    + 'chuyên môn — làm lâu vẫn thành.',
  khongKiepMenh: 'Địa Không / Địa Kiếp ở Mệnh: ý tưởng lạ, dám nghĩ khác, nhưng tiền và việc hay đến nhanh đi nhanh (sách cổ: "như '
    + 'thuyền giữa sóng") — hợp nghề sáng tạo, kỹ thuật; nên giữ tiền chặt.',
  locPhungKhong: 'Lộc gặp Không Kiếp (sách cổ: "Lưỡng trùng Hoa Cái"): có lộc mà khó giữ — nên có tiền là để dành ngay.',
  maKhong: 'Mã lạc không vong (Thiên Mã gặp Tuần, Triệt hoặc Không Kiếp): đi lại, đổi việc nhiều mà ít được việc — nên chọn đường '
    + 'rồi đi bền.',
};
