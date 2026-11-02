/**
 * Loi luan van han (tang 3) — Claude tong hop, soan moi (luat 6). Nguon, ly do: `docs/LUAN_TU_VI.md` muc 10: *Toan Thu* q.1 (tho
 * "nhap han cat hung quyet" tung sao) va q.3 (luan dai han 10 nam, nhi han thai tue, duong da diep tinh, that sat trung phung),
 * Thien Luong (dai van la chinh; thien thoi, nhan hoa, dia loi; can nam so can tuoi), *Tan Bien* (dai van tot thi nam xau cung
 * nhe), tu hoa theo can cung van va can nam (cac phai Dai Loan). Loi co phan chet, "quan tai", "tu vong" doi thanh loi can trong.
 * Moi o: mot cau, hoac [sao sang, sao mo].
 */

type Loi = string | readonly [string, string];

/** Sao chinh o cung van / cung tieu han: chuyen hay den trong van (nam) do. */
export const VAN_SAO: Readonly<Record<string, Loi>> = {
  'Tử Vi': 'được nâng đỡ, việc lớn dễ thành, có thể lên chức, thêm của; gặp Sát Phá Tham và sát tinh thì dễ bị hạ, có chuyện kinh động.',
  'Thiên Cơ': ['gặp Khoa Quyền Lộc thì làm được việc lớn, ra ngoài hay gặp quý nhân, phát tài lặng lẽ.',
    'nhiều xáo trộn, việc nhà việc ngoài rối ren; gặp Kình Đà, Cự Môn thì phải cẩn thận.'],
  'Thái Dương': ['thêm tiền, thêm việc, có tin vui (cưới hỏi, con cái), dễ thăng tiến.',
    'vất vả, việc hay trở ngại; gặp Hóa Kỵ, sát tinh thì phòng chuyện bất ngờ, hao tài.'],
  'Vũ Khúc': ['tiền bạc vào, làm ăn thuận; có Xương Khúc, Tả Hữu thì danh lợi đều có.',
    'dễ vướng chuyện tiền, nợ nần, giấy tờ pháp lý — nên thận trọng làm ăn.'],
  'Thiên Đồng': ['vui vẻ, thêm của, hợp mở mang, xây dựng.', 'việc tốt mà chưa trọn; gặp sát tinh thì phòng rắc rối giấy tờ, gia đạo.'],
  'Liêm Trinh': ['có quyền, quan hệ rộng, tích được của.', 'dễ vướng kiện tụng, va chạm, thương tích nhỏ — nên giữ đúng luật, cẩn thận đi lại.'],
  'Thiên Phủ': 'ổn định, thêm của, ít tai ương; có Khoa Quyền Lộc thì được dịp thi thố tài năng.',
  'Thái Âm': ['tiền và nhà đất tốt, có chuyện cưới hỏi, thêm người.', 'tiền bạc thất thường, dễ phiền muộn; gặp Hỏa Linh thì phòng ốm đau, rắc rối.'],
  'Tham Lang': ['cơ hội phát tài, giao tế rộng; gặp Hỏa Tinh, Linh Tinh có thể phát lớn.',
    'ham vui, dễ hao tiền vì hưởng thụ, tình cảm rắc rối — nên tiết chế.'],
  'Cự Môn': ['dùng lời nói, chuyên môn mà thành việc; có thị phi nhưng qua được.', 'thị phi, kiện tụng, buồn phiền dễ đến — nên giữ lời, tránh tranh cãi.'],
  'Thiên Tướng': 'được tin dùng, việc làm suôn sẻ, ít tai ương; gặp Kình Đà, Không Kiếp thì phòng khẩu thiệt.',
  'Thiên Lương': 'được che chở, gặp dữ hóa lành, dễ thăng tiến, sức khỏe bền; gặp Hỏa Linh, Kình Đà thì vẫn phải đề phòng.',
  'Thất Sát': ['biến động nhưng đi lên, tự lập làm nên; có Tử Phủ chiếu thì thăng tiến.',
    'việc khó, hay mất mát, dễ đau ốm, va chạm — nên đi chậm, giữ sức.'],
  'Phá Quân': ['thay đổi lớn, phá cũ làm mới thành công; có Xương Khúc, Khôi Việt càng tốt.',
    'hao tán, đổ vỡ, tai nạn nhỏ dễ đến — nên tránh mạo hiểm, giữ tiền.'],
};

/** Thien thoi (Thien Luong): hanh tam hop cung van so hanh tam hop tuoi. */
export const THIEN_THOI = {
  dong: 'Vận vào tam hợp tuổi (cùng hành tuổi): đắc thời — mười năm là "đất sống" của mình, dễ hưng vượng, có quyền.',
  khacXuat: 'Vận ở tam hợp mà tuổi khắc được: phải tranh đấu, gắng sức mới thành; có Thiên Mã trong vận thì dễ toại ý.',
  sinhXuat: 'Vận ở tam hợp mà tuổi sinh ra: làm nhiều mà người khác hưởng phần lớn — nên giữ phần mình.',
  sinhNhap: 'Vận ở tam hợp sinh cho tuổi (chỗ có Thiên Không): tưởng thuận mà dễ hụt — thấy dễ dàng càng phải thận trọng.',
  khacNhap: 'Vận ở tam hợp khắc tuổi: khó ganh đua — nên giữ sức, chọn việc vừa tầm.',
} as const;

/** Nhan hoa (Thien Luong): sao chinh cua van cung bo voi sao chinh Menh. */
export const NHAN_HOA = {
  hop: 'Sao chính của vận cùng bộ với sao Mệnh: hợp với mình, dễ phát huy sở trường.',
  khac: 'Sao chính của vận khác bộ với sao Mệnh: phải đổi cách làm cho hợp hoàn cảnh.',
} as const;

/** Dia loi (Thien Luong): hanh cung van so hanh Menh (nap am). */
export const DIA_LOI = {
  thuan: 'Hành của cung vận hợp hành Mệnh: hoàn cảnh nâng đỡ.',
  bo: 'Mệnh phải bỏ sức vào hoàn cảnh của vận: thành quả tùy công sức.',
  can: 'Hành của cung vận khắc hành Mệnh: hoàn cảnh hay cản trở.',
} as const;

export const KET_VAN = {
  thuan: 'Mười năm này nhìn chung thuận — nên mạnh dạn làm việc lớn.',
  vua: 'Mười năm này tốt xấu xen nhau — giữ nhịp đều, chọn việc chắc.',
  kho: 'Mười năm này nhiều thử thách — nên giữ gìn, tránh mạo hiểm; qua vận này sẽ khác.',
} as const;

/** Can nam so can tuoi (Thien Luong: "viec chinh yeu la so hang Can cua Menh voi Can cua nam han"). */
export const CAN_NAM = {
  sinhNhap: 'Can năm sinh cho can tuổi: năm được nâng đỡ — thuận nhất.',
  khacXuat: 'Can tuổi khắc can năm: mình làm chủ được tình thế, gắng thì được.',
  dong: 'Can năm cùng hành can tuổi: năm bình, hên xui tùy sao hạn.',
  sinhXuat: 'Can tuổi sinh cho can năm: hao sức, hao của — nên giữ gìn.',
  khacNhap: 'Can năm khắc can tuổi: năm bị áp lực, dễ trắc trở — nên thận trọng.',
} as const;

export const CHI_NAM = {
  tuoi: 'Năm tuổi (chi năm trùng chi tuổi): nên giữ gìn, tránh quyết định vội.',
  xung: 'Năm xung tuổi: dễ có thay đổi, va chạm — cẩn thận đi lại, giấy tờ.',
  pha: 'Năm phá tuổi: dễ hao tổn vặt, việc hay dở dang.',
} as const;

export const KINH_DA_DIEP = 'Kình Dương, Đà La gốc gặp thêm Lưu Kình, Lưu Đà ở cung hạn (sách cổ gọi "Kình Đà điệp tịnh"): năm cần '
  + 'thận trọng nhất — tránh mạo hiểm, giữ sức khỏe, đi lại cẩn thận.';
export const SAT_TRUNG = 'Thất Sát gặp Lưu Kình, Lưu Đà xung ở cung hạn ("Thất Sát trùng phùng"): dễ biến cố — nên đi chậm, giữ gìn.';
export const SAT_TRUNG_GIAI = ' Có Tử Vi, Thiên Tướng hoặc Lộc Tồn hội về nên được giải bớt.';

export const KET_NAM = {
  thuan: 'Riêng năm nay thuận',
  vua: 'Riêng năm nay bình thường',
  kho: 'Riêng năm nay nhiều trở ngại',
} as const;

/** Ghep dai van voi nam (Tan Bien: dai van tot thi nam xau cung nhe; Thien Luong: nam chi them bot ~1/10). Khoa: "dai van|nam". */
export const GHEP: Readonly<Record<string, string>> = {
  'thuan|thuan': 'đại vận cũng thuận — năm đáng làm việc lớn.',
  'thuan|vua': 'đại vận thuận nên năm vẫn khá.',
  'thuan|kho': 'nhưng đại vận thuận nên trở ngại nhẹ đi.',
  'vua|thuan': 'đại vận bình thường nên cái tốt vừa phải.',
  'vua|vua': 'đại vận quyết định phần lớn, năm chỉ thêm bớt.',
  'vua|kho': 'đại vận bình thường, năm cần cẩn thận hơn.',
  'kho|thuan': 'nhưng đại vận nhiều thử thách nên cái tốt bớt đi — làm việc vừa sức.',
  'kho|vua': 'đại vận nhiều thử thách nên năm cần giữ gìn.',
  'kho|kho': 'đại vận cũng nhiều thử thách — năm nên giữ gìn hơn cả.',
  chua: 'chưa vào đại vận đầu nên năm theo hạn nhỏ là chính.',
};
