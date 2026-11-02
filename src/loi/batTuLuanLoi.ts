/**
 * Loi luan bat tu (`batTuLuan.ts`), Claude soan moi (luat 6) sau khi doc *Trich Thien Tuy*, *Uyen Hai Tu Binh*, *Tu Binh Chan Thuyen*,
 * *Cung Thong Bao Giam* va cach doc hien nay (Dai – Hong, Han, Nhat, Viet): nguon, ly do chot o `docs/LUAN_BAT_TU.md`.
 * App chi hien loi chot, khong ke ten sach; "sach goi" chi de nguoi doc tra them thuat ngu.
 */

export const NHOM_TEN = ['Tỷ Kiếp', 'Thực Thương', 'Tài', 'Quan Sát', 'Ấn'] as const;
/** Thu tu nhu `than()`: cung am duong truoc. Ten khop bang Han–Viet `thapThan` (test so). */
export const THAP_THAN = [
  'Tỷ Kiên', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Thiên Tài', 'Chính Tài', 'Thất Sát', 'Chính Quan', 'Thiên Ấn', 'Chính Ấn',
] as const;
export const MUA = ['mùa xuân', 'mùa hè', 'mùa thu', 'mùa đông'] as const;

/** Nhat chu o lenh thang, theo nhom cua chinh khi chi thang (vuong, huu, tu, tu, tuong). */
export const LENH = [
  'đúng mùa của hành mình — được lệnh (vượng), sức sẵn có.',
  'mùa của hành mình sinh ra — thất lệnh (hưu), sức tiết ra ngoài.',
  'mùa của hành mình phải khắc — thất lệnh (tù), tốn sức.',
  'mùa của hành khắc mình — thất lệnh (tử), chịu sức ép.',
  'mùa của hành sinh ra mình — được mùa nâng đỡ (tướng).',
] as const;
export const LENH_NGAN = ['được lệnh', 'thất lệnh, bị tiết sức', 'thất lệnh, tốn sức', 'thất lệnh, bị khắc', 'được mùa sinh cho'] as const;

export const THAN_MUC = {
  muc: [
    'Thân rất nhược: phần giúp mình (cùng hành, hành sinh mình) ít hơn hẳn phần làm mình hao sức. Đời dễ thấy việc nhiều hơn sức — '
      + 'nên dựa vào nghề vững, người tin được, chọn ít việc mà làm cho chắc.',
    'Thân nhược: phần giúp mình ít hơn phần làm mình tốn sức. Làm được việc nhưng chóng mệt; có thầy, có bạn đồng hành, có nghề '
      + 'chuyên thì phát.',
    'Thân hơi nhược, gần cân bằng: không cần bù nhiều, được thêm chút trợ lực (học thêm, cộng sự tốt) là đủ.',
    'Thân hơi vượng, gần cân bằng: đủ sức gánh việc, chỉ cần có chỗ dùng sức để không phí.',
    'Thân vượng: sức mình nhiều, tự tin, chịu được áp lực; cần việc đủ lớn, trách nhiệm rõ để tiêu sức, không thì dễ cố chấp, va chạm.',
    'Thân rất vượng: ý chí mạnh, khó ai lay; dễ quá cứng, một mình một ý — nên nghe người, chọn việc đủ lớn để dồn sức.',
  ],
  tong: (nhom: string): string => `Lá số gần như không có gốc giúp mình, thế nghiêng hẳn về ${nhom}: đây là cách "tòng" (thuận theo thế `
    + `mạnh). Người cách này thường khéo thích nghi, sống tốt khi đi theo dòng ${nhom} chứ không chống lại; gặp vận giúp mình lại hay trục `
    + 'trặc. Cách tòng khó định, các thầy còn bàn khác nhau — nên đối chiếu với vận đã qua.',
  chuyen: 'Hành của mình chiếm gần trọn lá số, không có hành khắc: đây là cách "chuyên vượng". Sức rất mạnh, hợp đi một đường dài; nên '
    + 'thuận theo thế đó (cho sức tỏa ra qua tài năng, việc làm) hơn là ép khắc.',
} as const;

export const YEU_TO = (lenh: string, goc: string, canGiup: boolean): string => `Xét ba điều các sách cùng dùng: lệnh tháng (${lenh}), `
  + `gốc trong chi (${goc === '' ? 'không có gốc' : `có gốc ở chi ${goc}`}), can trợ giúp (${canGiup ? 'có' : 'không có'} can cùng hành `
  + 'hoặc can sinh mình lộ ra); lệnh tháng nặng nhất.';

/** Ly do chon dung than (khoa `PhanTich.lyDo`); {nhom}: nhom duoc tong. */
export const LY_DO: Readonly<Record<string, string>> = {
  nhuocQuan: 'Mình thiếu sức mà sức ép lớn nhất là Quan Sát (công việc, áp lực): dùng Ấn — hành sinh ra mình — vừa đỡ thân vừa biến áp lực '
    + 'thành chỗ dựa (sách gọi là Ấn hóa Sát); Tỷ Kiếp giúp thêm.',
  nhuocThuc: 'Mình thiếu sức mà hao nhất là Thực Thương (tài năng, lời nói, con cái): dùng Ấn giữ sức và kìm bớt (sách gọi là Thương '
    + 'Quan bội Ấn); Tỷ Kiếp giúp thêm.',
  nhuocTai: 'Mình thiếu sức mà nặng nhất là Tài (tiền bạc, của cải): cần Tỷ Kiếp — người cùng hành — gánh đỡ cho mình giữ được của; Ấn '
    + 'giúp thêm.',
  vuongAn: 'Mình dư sức vì được sinh quá nhiều (Ấn): dùng Tài tiết chế Ấn (sách gọi là Tài phá Ấn); Thực Thương giúp sức mình tỏa ra.',
  vuongThong: 'Mình dư sức mà Tài cũng nhiều, hai bên giằng co: dùng Thực Thương làm cầu nối — mình sinh Thực Thương, Thực Thương sinh '
    + 'Tài (sách gọi là thông quan); Quan Sát cũng giúp kìm bớt.',
  vuongQuan: 'Mình dư sức vì cùng hành nhiều: dùng Quan Sát kìm lại thành kỷ luật, chức phận; Tài sinh cho Quan Sát nên cũng hợp.',
  vuongThuc: 'Mình dư sức vì cùng hành nhiều mà không có Quan Sát lộ: dùng Thực Thương cho sức mình tỏa ra thành tài năng, việc làm '
    + '(sách gọi là tiết tú); Tài, Quan Sát cũng hợp.',
  tong: 'Mình gần như không có gốc, không ai giúp, nên thuận theo thế {nhom} đang mạnh; Ấn và Tỷ Kiếp lại thành kỵ.',
  chuyen: 'Hành của mình chiếm gần trọn lá số: thuận theo thế mạnh đó, cho sức tỏa ra qua Thực Thương; Quan Sát khắc ngược thế nên kỵ.',
};

export const DIEU_HAU: Readonly<Record<number, string>> = {
  4: 'Sinh mùa hè mà lá số khô nóng, ít Thủy: trước hết cần Thủy làm mát (điều hậu) — xếp lên trước cả chuyện bù mạnh yếu.',
  1: 'Sinh mùa đông mà lá số lạnh, ít Hỏa: trước hết cần Hỏa sưởi ấm (điều hậu) — xếp lên trước cả chuyện bù mạnh yếu.',
};

const VIEC_HANH = [
  'Mộc: giáo dục, xuất bản, cây trồng, đồ gỗ; màu xanh lá; hướng Đông',
  'Hỏa: điện, năng lượng, ăn uống, truyền thông, làm đẹp; màu đỏ, hồng; hướng Nam',
  'Thổ: đất đai, xây dựng, nông nghiệp, kho bãi; màu vàng, nâu; vùng giữa',
  'Kim: cơ khí, kim loại, tài chính, ngân hàng; màu trắng, ánh kim; hướng Tây',
  'Thủy: vận tải, du lịch, thương mại, thủy sản; màu đen, xanh dương; hướng Bắc',
] as const;
export const UNG_DUNG = (hanh: readonly number[]): string => `Cách dùng phổ biến hiện nay: chọn việc, màu, hướng thuộc hành hợp — `
  + `${hanh.map((e) => VIEC_HANH[e] ?? '').join(' · ')}.`;

/** Cach cuc lay o lenh thang (2..9 thap than, 10 Kien Loc, 11 Duong Nhan, 12 thang cung hanh): nghia, thanh, bai. */
export const CACH: Readonly<Record<number, { readonly ten: string; readonly y: string; readonly thanh: string; readonly bai: string }>> = {
  2: { ten: 'Thực Thần cách',
    y: 'Tháng sinh lấy Thực Thần làm chủ: người hiền hòa, có tài khéo, sống thong thả, biết hưởng; làm nghề chuyên môn, sáng tạo nhẹ '
      + 'nhàng thì bền.',
    thanh: 'Cách thành: có Tài để Thực Thần sinh ra, hoặc Thực Thần chế được Thất Sát — tài năng đổi được ra tiền, ra vị trí.',
    bai: 'Cách bị phá: Thiên Ấn lộ mà không có Tài giải (sách gọi là "kiêu thần đoạt thực") — dễ bỏ dở giữa chừng, lộc ăn bị chặn; '
      + 'vận gặp Tài thì đỡ.' },
  3: { ten: 'Thương Quan cách',
    y: 'Tháng sinh lấy Thương Quan làm chủ: thông minh, giỏi nói, giỏi làm cái mới, không chịu gò bó; tài hoa mà hay chê, dễ va chạm '
      + 'cấp trên.',
    thanh: 'Cách thành: thân nhược có Ấn kìm Thương Quan, hoặc thân vượng có Tài để Thương Quan sinh ra — tài năng thành sự nghiệp.',
    bai: 'Cách bị phá: Chính Quan lộ mà không có Ấn che (sách gọi là "thương quan kiến quan") — dễ đụng chạm, kiện cáo, mất chức; nên '
      + 'giữ lời, tránh đối đầu.' },
  4: { ten: 'Thiên Tài cách',
    y: 'Tháng sinh lấy Thiên Tài làm chủ: hào phóng, nhạy cơ hội, giỏi xoay tiền, thích đi lại, giao du rộng.',
    thanh: 'Cách thành: thân đủ sức gánh Tài, lại có Quan bảo vệ hoặc Thực Thương sinh Tài — giàu lên nhờ làm ăn.',
    bai: 'Cách bị phá: Tỷ Kiếp nặng tranh Tài, thân yếu không giữ nổi Tài, hoặc Thất Sát lộ không chế — tiền vào rồi ra, nên làm ăn '
      + 'vừa sức.' },
  5: { ten: 'Chính Tài cách',
    y: 'Tháng sinh lấy Chính Tài làm chủ: thực tế, cần kiệm, làm ăn chắc chắn, giữ nếp nhà.',
    thanh: 'Cách thành: thân đủ sức gánh Tài, lại có Quan bảo vệ hoặc Thực Thương sinh Tài — của cải tích dần mà chắc.',
    bai: 'Cách bị phá: Tỷ Kiếp nặng tranh Tài, thân yếu không giữ nổi Tài, hoặc Thất Sát lộ không chế — tiền vào rồi ra, nên làm ăn '
      + 'vừa sức.' },
  6: { ten: 'Thất Sát cách',
    y: 'Tháng sinh lấy Thất Sát làm chủ: gan dạ, quyết đoán, chịu được áp lực, có uy; hợp việc lớn, việc khó.',
    thanh: 'Cách thành: có Thực Thần chế hoặc Ấn hóa Thất Sát — áp lực biến thành quyền, thành tựu.',
    bai: 'Cách bị phá: Tài lộ sinh thêm Thất Sát mà không có chế, không có hóa — áp lực dồn dập, dễ căng thẳng; vận gặp Thực Thần hay Ấn '
      + 'thì gỡ được.' },
  7: { ten: 'Chính Quan cách',
    y: 'Tháng sinh lấy Chính Quan làm chủ: đứng đắn, có nề nếp, trọng danh dự, được tín nhiệm; hợp tổ chức có kỷ cương.',
    thanh: 'Cách thành: có Tài sinh Quan hoặc Ấn bảo vệ Quan, không bị Thương Quan, Thất Sát làm rối — đường công danh rõ.',
    bai: 'Cách bị phá: gặp Thương Quan không có Ấn che, hoặc Quan Sát cùng lộ, hoặc lệnh tháng bị xung — công danh trắc trở, hay đổi '
      + 'việc.' },
  8: { ten: 'Thiên Ấn cách',
    y: 'Tháng sinh lấy Thiên Ấn làm chủ: óc khác người, trực giác tốt, giỏi tự học, hợp nghề riêng, nghề lạ.',
    thanh: 'Cách thành: có Quan Sát sinh Ấn, hoặc thân và Ấn đều vượng mà có Thực Thương tiết bớt — học vấn, nghề riêng thành danh.',
    bai: 'Cách bị phá: Tài nặng hơn Ấn mà không có Tỷ Kiếp giải (sách gọi là "tham tài hoại ấn") — dễ vì tiền mà bỏ học, bỏ nghề gốc.' },
  9: { ten: 'Chính Ấn cách',
    y: 'Tháng sinh lấy Chính Ấn làm chủ: nhân hậu, ham học, có chỗ dựa (mẹ, thầy, tổ chức), giấy tờ học hành thuận.',
    thanh: 'Cách thành: có Quan Sát sinh Ấn, hoặc thân và Ấn đều vượng mà có Thực Thương tiết bớt — học vấn thành danh.',
    bai: 'Cách bị phá: Tài nặng hơn Ấn mà không có Tỷ Kiếp giải (sách gọi là "tham tài hoại ấn") — dễ vì tiền mà bỏ học, bỏ nghề gốc.' },
  10: { ten: 'Kiến Lộc cách',
    y: 'Tháng sinh là chỗ Lộc của mình (cùng hành, được lệnh): tự lập, tự lực, ít nhờ tổ nghiệp; phải lấy chỗ dùng ở trụ khác (Tài, '
      + 'Quan, Thực Thương).',
    thanh: 'Cách thành: có Quan lộ để dùng, hoặc có cả Tài và Thực Thương — tự gây dựng mà nên.',
    bai: 'Cách khó: không có Tài, không có Quan để dùng — sức nhiều mà không có chỗ đặt, dễ lận đận lúc đầu; vận gặp Tài, Quan thì khá.' },
  11: { ten: 'Dương Nhận cách',
    y: 'Tháng sinh là chỗ Dương Nhận của mình (vượng cực): ý chí mạnh, gan, dám tranh; hợp nghề cạnh tranh, kỷ luật cao.',
    thanh: 'Cách thành: có Quan Sát chế Nhận — có uy quyền, giữ được của, làm được việc lớn.',
    bai: 'Cách khó: không có Quan Sát kìm — dễ nóng, liều, hao tiền, va chạm; nên tự đặt kỷ luật cho mình.' },
  12: { ten: 'Nguyệt Kiếp cách (tháng cùng hành)',
    y: 'Tháng sinh cùng hành với mình nhưng không phải chỗ Lộc, Nhận: tự lực, nhiều bạn cùng chí; chỗ dùng phải tìm ở Tài, Quan, Thực '
      + 'Thương trong các trụ khác.',
    thanh: 'Cách thành: có Quan lộ để dùng, hoặc có cả Tài và Thực Thương — tự gây dựng mà nên.',
    bai: 'Cách khó: không có Tài, không có Quan để dùng — sức nhiều mà không có chỗ đặt, dễ lận đận lúc đầu; vận gặp Tài, Quan thì khá.' },
};
export const CACH_THUONG = 'Cách chưa đủ để thành, cũng không bị phá: tốt xấu do vận gặp hành hợp hay hành kỵ.';

/** Huong nghe theo cach cuc (cach doc hien nay, cac phai Dai – Hong, Han, Viet gan nhu cung y). */
export const NGHE: Readonly<Record<number, string>> = {
  2: 'Hướng nghề: chuyên môn kỹ thuật, ẩm thực, giáo dục, nghệ thuật, dịch vụ — việc dùng tài khéo, không cần tranh giành.',
  3: 'Hướng nghề: tự do, sáng tạo, nói viết, luật sư, tư vấn, kỹ thuật cao — chỗ được tự quyết; khó hợp chỗ nhiều tầng quản lý.',
  4: 'Hướng nghề: kinh doanh, buôn bán, đầu tư, môi giới, việc đi lại nhiều.',
  5: 'Hướng nghề: tài chính, kế toán, buôn bán ổn định, quản lý tài sản — việc có thu nhập đều.',
  6: 'Hướng nghề: việc cần quyết đoán, chịu áp lực — quản lý, kỹ thuật, quân đội, công an, ngoại khoa, khởi nghiệp.',
  7: 'Hướng nghề: cơ quan, tổ chức lớn, hành chính, quản lý, luật — nơi có nề nếp, đường thăng tiến rõ.',
  8: 'Hướng nghề: nghiên cứu, kỹ thuật riêng, y dược, tâm lý, nghệ thuật, nghề ít người làm.',
  9: 'Hướng nghề: giáo dục, học thuật, văn hóa, y, luật — việc cần bằng cấp, chứng chỉ.',
  10: 'Hướng nghề: tự làm chủ, nghề chuyên tự gây dựng; làm công thì hợp vị trí được giao quyền.',
  11: 'Hướng nghề: quân đội, công an, thể thao, kỹ thuật nặng, việc cạnh tranh — nơi cần gan và kỷ luật.',
  12: 'Hướng nghề: tự lập, hợp tác với người cùng chí; nghề chuyên sâu hơn là việc chung chung.',
};

export const HOP_XUNG = {
  canHop: (cap: string, t1: string, t2: string, nhat: boolean): string => `Can ${cap} (trụ ${t1} – trụ ${t2}) hợp nhau: `
    + (nhat ? 'nhật chủ có chỗ gắn bó, trọng tình, dễ bị quan hệ kéo theo.' : 'hai mặt đời ấy gắn bó, đỡ nhau.'),
  xung: (cap: string, t1: string, t2: string): string => `Chi ${cap} (trụ ${t1} – trụ ${t2}) xung nhau:`,
  hop: (cap: string, t1: string, t2: string): string => `Chi ${cap} (trụ ${t1} – trụ ${t2}) hợp nhau:`,
  capXung: {
    '01': 'gia đình gốc, nơi ở thời nhỏ hay đổi; sớm rời quê.',
    '12': 'với cha mẹ, anh em dễ khác ý; công việc, chỗ ở hay đổi.',
    '23': 'vợ chồng với con cái, hậu vận nhiều thay đổi; con sớm tự lập.',
    '02': 'gốc gia đình với bản thân khác hướng — tự đi đường riêng.',
    '13': 'việc làm với hậu vận dễ đổi hướng giữa chừng.',
    '03': 'đầu đời với cuối đời khác hẳn nhau.',
  } as Readonly<Record<string, string>>,
  capHop: {
    '01': 'gia đình gốc êm ấm, được họ hàng giúp.',
    '12': 'hợp với cha mẹ, anh em; môi trường làm việc dễ chịu.',
    '23': 'vợ chồng, con cái gắn bó; hậu vận ấm.',
    '02': 'được gia đình gốc nâng đỡ bản thân.',
    '13': 'công việc với hậu vận nối nhau thuận.',
    '03': 'đầu đời và cuối đời nối nhau êm.',
  } as Readonly<Record<string, string>>,
  giai: '(Có chi khác hợp vào nên xung được giải bớt.)',
  tamHop: (ds: string, hanh: string): string => `Đủ ba chi ${ds} (tam hợp ${hanh}): khí ${hanh} được gom lại, mạnh hơn đếm thường.`,
  tamHoi: (ds: string, hanh: string): string => `Đủ ba chi ${ds} (tam hội ${hanh}): khí ${hanh} rất mạnh, chi phối cả lá số.`,
  tamHinh: 'Có đủ bộ tam hình (Dần Tỵ Thân hoặc Sửu Tuất Mùi): đời hay gặp va chạm, thị phi, giấy tờ — nên mềm mỏng, giữ đúng luật.',
  khong: 'Bốn trụ không xung, không hợp nhau rõ: các mặt đời ít giằng co, cũng ít chỗ dựa sẵn.',
} as const;

/** Net tinh khi mot thap than troi (theo thu tu `THAP_THAN`). */
export const TINH = [
  'tự lập, có chủ kiến, giữ nguyên tắc; dễ cứng đầu, khó nhờ người.',
  'dám nghĩ dám làm, quảng giao, thích cạnh tranh; dễ bốc đồng, tiêu tiền theo hứng.',
  'hiền hòa, thong thả, ăn nói nhẹ nhàng, biết hưởng; dễ an phận, ngại tranh đua.',
  'thông minh, sắc sảo, giỏi thể hiện, thích cái mới; dễ kiêu, hay chê, không chịu gò bó.',
  'hào phóng, nhạy cơ hội, giỏi giao tế, thích đi; dễ tiêu nhiều, đa tình.',
  'thực tế, chăm chỉ, chi tiêu có kế hoạch, giữ chữ tín; dễ quá tính toán, ngại rủi ro.',
  'gan dạ, quyết đoán, chịu áp lực tốt, có uy; dễ nóng, khắt khe với mình và người.',
  'đứng đắn, có trách nhiệm, trọng lễ nghĩa và danh dự; dễ câu nệ, ngại phá lệ.',
  'trực giác tốt, óc riêng, giỏi tự học, thích đào sâu; dễ cô độc, đa nghi, nghĩ nhiều làm ít.',
  'nhân hậu, ham học, biết thương người, được tin cậy; dễ ỷ lại, chậm quyết.',
] as const;
export const TINH_DEU = 'Không thập thần nào trội hẳn: tính cách cân đối, linh hoạt theo hoàn cảnh.';
export const TINH_VANG = [
  'ít người cùng chí hướng, hay làm một mình — nên tìm cộng sự đáng tin.',
  'ít bộc lộ, khó nói ra ý mình — tập trình bày, viết ra sẽ đỡ thiệt.',
  'ít để tâm tiền bạc, tiêu theo hứng — nên lập kế hoạch chi tiêu.',
  'tự do, ít chịu ràng buộc, nhưng dễ thiếu kỷ luật — tự đặt nề nếp cho mình.',
  'phải tự lập sớm, ít được nâng đỡ — chủ động tìm thầy, học thêm.',
] as const;

type Muc3 = 'hop' | 'ky' | 'vua';
/** Cau tung viec (tang 2); thieu khoa (thuong la `vua`) la khong noi gi. */
export const VIEC = {
  quan: {
    hop: ['Quan Sát (công việc, cấp trên, chức phận) là hành hợp: làm trong tổ chức dễ được ghi nhận, có đường lên.',
      'Quan Sát mạnh và là hành hợp: có duyên chức phận, gánh được trách nhiệm lớn, hợp làm quản lý.'],
    ky: ['Quan Sát là hành kỵ: không nên ôm chức vụ nặng quá sớm; đi bằng chuyên môn chắc hơn.',
      'Quan Sát mạnh mà là hành kỵ: áp lực công việc, cấp trên khắt khe hay đè nặng — hợp nghề tự chủ hơn chỗ nhiều tầng quản lý.'],
  } as Readonly<Partial<Record<Muc3, readonly [string, string]>>>,
  thuc: {
    hop: 'Thực Thương (tài năng, ý tưởng, lời nói) lộ ở can và là hành hợp: nghề càng dùng tay nghề, ý tưởng càng phát.',
    ky: 'Thực Thương lộ ở can mà là hành kỵ: ý tưởng nhiều nhưng dễ tản sức, nói nhiều dễ va chạm — nên chọn một nghề mà đi sâu.',
  } as Readonly<Partial<Record<Muc3, string>>>,
  thuongQuan: 'Thương Quan và Chính Quan cùng lộ, không có Ấn đứng giữa: dễ bất đồng với cấp trên — nói mềm, hoặc chọn việc được tự quyết.',
  taiVang: 'Tài (tiền bạc) gần như không có trong lá số: tiền không tự đến — kiếm bằng nghề, giữ bằng kế hoạch chi tiêu rõ ràng.',
  tai: {
    hop: 'Tài là hành hợp: có duyên kiếm tiền, càng chịu làm càng có của.',
    ky: 'Tài là hành kỵ: tiền đến thường kéo theo lo toan, dễ vì tiền mà mệt — làm ăn vừa sức, ít vay mượn, giữ của bằng tài sản chắc.',
    vua: 'Tài trung tính: tiền bạc đủ dùng, giàu nghèo tùy cách làm và vận.',
  } as Readonly<Record<Muc3, string>>,
  thienTai: 'Thiên Tài lộ ở can: có tiền làm ăn, tiền bất ngờ, cơ hội đến từ đi lại, quan hệ rộng.',
  chinhTai: 'Chính Tài lộ ở can: thu nhập đều, tích lũy dần mà chắc.',
  taiDa: 'Tài nhiều mà thân nhược (sách gọi là "tài đa thân nhược"): thấy nhiều cơ hội tiền nhưng sức giữ có hạn — hợp làm công ăn lương '
    + 'hoặc hùn với người tin được hơn là tự gánh.',
  tranhTai: 'Tỷ Kiếp nhiều mà Tài ít (sách gọi là "quần kiếp tranh tài"): tiền dễ hao vì bạn bè, hùn hạp, cho vay — tách bạch tiền chung, '
    + 'tiền riêng.',
  sinhTai: 'Có Thực Thương sinh Tài: kiếm tiền nhờ tay nghề, ý tưởng, dịch vụ.',
  cungPhoi: (tt: string, m: Muc3): string => `Cung phối ngẫu (chi ngày) mang ${tt}, ${m === 'hop'
    ? 'là hành hợp: người bạn đời thường là chỗ dựa, giúp mình.' : m === 'ky'
      ? 'là hành kỵ: hai người dễ khác ý — cần nhường và nói rõ với nhau.' : 'hành trung tính: hôn nhân tốt xấu tùy cách vun đắp.'}`,
  phoiVang: (nhom: string): string => `Sao phối ngẫu (${nhom}) gần như không có: duyên thường đến muộn hoặc phải tự chủ động; không có nghĩa là `
    + 'không lập gia đình.',
  phoiKep: {
    nam: 'Sao phối ngẫu lộ cả Chính Tài lẫn Thiên Tài: đường tình cảm nhiều lựa chọn, dễ phân vân — chọn kỹ, giữ một lòng.',
    nu: 'Sao phối ngẫu lộ cả Chính Quan lẫn Thất Sát (sách gọi là "quan sát hỗn tạp"): tình cảm nhiều lựa chọn, dễ phân vân — chọn kỹ, '
      + 'giữ một lòng.',
  },
  phoi: {
    hop: 'Sao phối ngẫu là hành hợp: bạn đời đem lại thuận lợi cho mình.',
    ky: 'Sao phối ngẫu là hành kỵ: tình cảm dễ thành gánh nặng nếu chọn vội — tìm hiểu lâu thì bền.',
    vua: 'Sao phối ngẫu trung tính: hôn nhân không quá thuận, không quá khó.',
  } as Readonly<Record<Muc3, string>>,
  ngayXung: (tru: string): string => `Chi ngày bị chi ${tru} xung: hôn nhân, chỗ ở dễ biến động — cưới khi đã hiểu nhau kỹ thì bền hơn.`,
  ngayHop: (tru: string): string => `Chi ngày hợp chi ${tru}: vợ chồng dễ gắn bó, hòa thuận.`,
  dac: {
    nu: 'Thương Quan mạnh gặp Chính Quan (sách gọi là "thương quan kiến quan"): dễ chê, dễ cãi với chồng — cần mềm lời, tôn trọng nhau.',
    nam: 'Kiếp Tài mạnh: tiền chung vợ chồng dễ hao, dễ có người chen vào — minh bạch tiền bạc, giữ khoảng cách đúng mực.',
  },
  anVang: 'Ấn (mẹ, thầy, người che chở) gần như không có: ít được che chở, phải tự lập sớm.',
  an: {
    hop: ['Ấn (mẹ, thầy, người che chở) là hành hợp: được mẹ, thầy, người trên giúp nhiều.',
      'Ấn mạnh và là hành hợp: được che chở, học hành, nhà cửa thuận; nhờ mẹ, nhờ thầy nhiều.'],
    ky: ['Ấn (mẹ, thầy, người che chở) là hành kỵ: được bao bọc mà dễ ỷ lại — nên sớm tự quyết.',
      'Ấn nhiều mà là hành kỵ: cha mẹ quản chặt, hoặc mình dựa quá nhiều — sớm tự lập thì phát.'],
    vua: ['Ấn trung tính: cha mẹ giúp vừa phải.', 'Ấn nhiều, trung tính: gia đình bao bọc, cần cân bằng giữa nghe lời và tự quyết.'],
  } as Readonly<Record<Muc3, readonly [string, string]>>,
  cha: {
    hop: 'Thiên Tài (cha) lộ ở can và là hành hợp: được cha nâng đỡ, gia cảnh giúp đường làm ăn.',
    ky: 'Thiên Tài (cha) lộ ở can mà là hành kỵ: với cha dễ khác ý, hoặc ít được cha giúp.',
    vua: 'Thiên Tài (cha) lộ ở can, trung tính: quan hệ với cha bình thường.',
  } as Readonly<Record<Muc3, string>>,
  taiPhaAn: 'Tài lấn Ấn: cha mẹ dễ khác ý nhau, hoặc mình ít được ở gần mẹ.',
  namThangXung: 'Trụ năm và trụ tháng xung nhau: gia đình gốc nhiều biến động, sớm rời quê, rời nhà.',
  tyVang: 'Tỷ Kiếp gần như không có: ít anh em hoặc ít người cùng chí — tự làm là chính, chọn cộng sự kỹ.',
  ty: {
    hop: ['Tỷ Kiếp (anh em, bạn bè) là hành hợp: có anh em, bạn đồng hành giúp; hợp làm việc nhóm.',
      'Tỷ Kiếp mạnh và là hành hợp: đông bạn, anh em gắn bó, được người ngang hàng nâng.'],
    ky: ['Tỷ Kiếp (anh em, bạn bè) là hành kỵ: bạn bè dễ cạnh tranh — giúp nhau được nhưng đừng chung tiền.',
      'Tỷ Kiếp nhiều mà là hành kỵ: anh em, bạn bè dễ tranh phần, hùn hạp dễ mất lòng — tách bạch tiền nong.'],
    vua: ['Tỷ Kiếp trung tính: quan hệ anh em, bạn bè bình thường.', 'Tỷ Kiếp nhiều, trung tính: đông bạn bè, nên chọn người mà thân.'],
  } as Readonly<Record<Muc3, readonly [string, string]>>,
  thangNgayXung: 'Trụ tháng xung trụ ngày: với cha mẹ, anh em dễ khác ý; nơi ở, việc làm dễ đổi.',
  conVang: (nhom: string): string => `Sao con cái (${nhom}) gần như không có: con thường đến muộn hoặc ít con.`,
  con: (nhom: string, m: Muc3): string => `Sao con cái (${nhom}) ${m === 'hop' ? 'là hành hợp: con cái là niềm vui, về sau được nhờ.'
    : m === 'ky' ? 'là hành kỵ: nuôi dạy con tốn công sức hơn — kiên nhẫn, gần con nhiều.' : 'trung tính: con cái bình thường, tùy cách dạy.'}`,
  khongGio: 'Không rõ giờ sinh: thiếu trụ giờ (cung con cái, hậu vận) nên phần này chỉ xét sao.',
  gio: {
    hop: 'Trụ giờ (con cái, hậu vận) mang hành hợp: về già thường an ổn hơn lúc trẻ.',
    ky: 'Trụ giờ (con cái, hậu vận) mang hành kỵ: hậu vận cần lo sớm — sức khỏe, tích lũy.',
  } as Readonly<Partial<Record<Muc3, string>>>,
  ngayGioXung: 'Chi giờ xung chi ngày: con cái sớm tự lập, ở xa; hai thế hệ dễ khác ý.',
} as const;
export const KET = {
  thuan: 'Kết: việc này thuận hơn phần đông.',
  vua: 'Kết: việc này bình thường, không quá thuận, không quá khó.',
  kho: 'Kết: việc này phải để tâm hơn phần đông.',
} as const;

/** Tang phu theo hanh (*Uyen Hai Tu Binh* "luan tat benh", *Trich Thien Tuy* "tat benh luan"), noi bang loi nay. */
export const TANG_PHU = ['gan, mật, gân, mắt', 'tim, mạch máu, ruột non', 'dạ dày, tiêu hóa', 'phổi, đường thở, da, ruột già',
  'thận, bàng quang, tai, xương'] as const;
export const SUC_KHOE = {
  hoa: 'Năm hành đủ, không hành nào lấn át (sách gọi là "ngũ hành hòa"): ít bệnh vặt, sức bền.',
  nhieu: (h: string, tp: string): string => `Hành ${h} quá nhiều: để ý ${tp} — đừng để thói quen làm nặng thêm.`,
  vang: (h: string, tp: string): string => `Thiếu hẳn hành ${h}: để ý ${tp}.`,
  ky: (h: string, tp: string): string => `Hành kỵ chính là ${h}: những năm, vận hành này mạnh thì giữ ${tp} hơn.`,
  nhac: 'Lời về sức khỏe chỉ là lời nhắc theo bát tự, không thay khám bệnh.',
} as const;

/** Thap than gap o dai van, nam: nghia khi la hanh hop, hanh ky, trung tinh (cung y moi phai: "theo hy ky ma luan, khong chap mot"). */
export const VAN_THAN: readonly { readonly hop: string; readonly ky: string; readonly vua: string }[] = [
  { hop: 'có bạn đồng hành, anh em giúp, tự lực làm được việc lớn hơn.', ky: 'cạnh tranh với người ngang hàng, tiền dễ phải chia, hao vì bạn.',
    vua: 'chuyện bạn bè, anh em nổi lên, không tốt không xấu.' },
  { hop: 'dám làm, có người cùng gánh, mở được đường mới.', ky: 'dễ hao tiền vì hùn hạp, bốc đồng — giữ chặt tiền chung.',
    vua: 'có cơ hội hợp tác, nên làm rõ phần ai nấy giữ.' },
  { hop: 'thong thả, tài năng được dùng, có lộc ăn; hợp học thêm nghề.', ky: 'dễ lười, ham vui, sức tản vào nhiều việc nhỏ.',
    vua: 'có thời gian cho sở thích, nghề tay trái.' },
  { hop: 'ý tưởng mới, dám đổi, thể hiện được tài.', ky: 'dễ va chạm cấp trên, lời nói gây chuyện; giấy tờ, pháp lý cần cẩn thận.',
    vua: 'muốn đổi mới, nên đổi từng bước.' },
  { hop: 'cơ hội tiền bất ngờ, buôn bán, đi lại thuận.', ky: 'tiền vào ra nhanh, dễ đầu tư liều.', vua: 'có dịp kiếm thêm, đừng tham nhanh.' },
  { hop: 'thu nhập đều, tích lũy được, lo được việc nhà.', ky: 'lo toan tiền nong nhiều, vì tiền mà mệt.', vua: 'tiền bạc đều đều, giữ nếp chi tiêu.' },
  { hop: 'có quyền, dám đương đầu, vượt khó mà lên.', ky: 'áp lực, cạnh tranh gắt, dễ căng thẳng — giữ sức khỏe, tránh liều.',
    vua: 'việc khó tìm đến, làm được thì có tiếng.' },
  { hop: 'được ghi nhận, thăng tiến, có chức phận; thi cử thuận.', ky: 'trách nhiệm đè nặng, cấp trên khắt khe, bị gò bó.',
    vua: 'có thêm trách nhiệm, làm đúng phép là ổn.' },
  { hop: 'học điều mới, nghề riêng, có người lạ giúp.', ky: 'nghĩ nhiều làm ít, dễ cô đơn, lộc ăn dễ bị chặn.', vua: 'hợp học hỏi, suy ngẫm.' },
  { hop: 'được che chở, học hành, giấy tờ, nhà cửa thuận; người trên giúp.', ky: 'dễ ỷ lại, chậm, bỏ lỡ cơ hội vì chờ người khác.',
    vua: 'có người trên để hỏi, nên tự quyết phần mình.' },
];

export const VAN = {
  xungThangHop: 'Chi vận xung lệnh tháng (chỗ hợp của lá số): công việc, môi trường dễ xáo trộn — đừng bỏ chỗ vững vì cơ hội mơ hồ.',
  xungThangKy: 'Chi vận xung lệnh tháng (chỗ kỵ của lá số): xáo trộn mà lại gỡ được cái cũ không hợp — dễ đổi việc theo hướng tốt.',
  xungThang: 'Chi vận xung lệnh tháng: công việc, nơi ở dễ thay đổi.',
  xungNgay: 'Chi vận xung chi ngày: hôn nhân, nhà cửa dễ biến động — giữ hòa khí trong nhà.',
  hopNgay: 'Chi vận hợp chi ngày: tình cảm, hợp tác thuận; dễ có chuyện vui trong nhà.',
  ket: {
    thuan: 'Vận này thuận: nên chủ động làm việc lớn.',
    vua: 'Vận này bình thường: tốt xấu đan xen, làm vừa sức.',
    kho: 'Vận này nhiều thử thách: giữ cái đang có, tránh liều.',
  },
} as const;

export const NAM = {
  tuoi: 'Năm tuổi (chi năm trùng chi năm sinh): nhiều việc tự mình phải gánh — thận trọng, đừng ôm quá sức.',
  xungTuoi: 'Năm xung tuổi (chi năm xung chi năm sinh): dễ có thay đổi lớn — đi lại, giấy tờ cẩn thận.',
  khacXung: 'Can năm khắc nhật chủ, chi năm xung chi ngày (sách gọi là "thiên khắc địa xung"): năm biến động về bản thân, gia đình — đi '
    + 'chậm, giữ sức.',
  xungVan: 'Chi năm xung chi đại vận: năm có xáo trộn, việc đang làm dễ đổi hướng.',
  ket: { thuan: 'Năm nay thuận.', vua: 'Năm nay bình thường.', kho: 'Năm nay nhiều trở ngại.' },
} as const;

/** Ket nam ghep voi dai van dang chay ("van" truoc, "nam" sau): van la nen, nam them bot. */
export const GHEP: Readonly<Record<string, string>> = {
  'thuan-thuan': 'Vận và năm cùng thuận: năm tốt để làm việc lớn.',
  'thuan-vua': 'Vận thuận, năm bình thường: cứ theo đà vận mà làm.',
  'thuan-kho': 'Năm có trở ngại nhưng vận đang thuận nên nhẹ đi — chậm lại, đừng bỏ cuộc.',
  'vua-thuan': 'Năm thuận trên nền vận bình thường: nên tận dụng năm này.',
  'vua-vua': 'Vận, năm đều bình thường: năm êm, làm vừa sức.',
  'vua-kho': 'Năm có trở ngại, vận không đỡ nhiều: giữ cái đang có.',
  'kho-thuan': 'Năm thuận nhưng vận đang khó nên chỉ đỡ được phần nào — làm việc nhỏ mà chắc.',
  'kho-vua': 'Vận khó, năm bình thường: giữ sức, tránh liều.',
  'kho-kho': 'Vận và năm cùng khó: năm cần thận trọng nhất — giữ sức khỏe, giữ tiền, tránh quyết định lớn.',
};
