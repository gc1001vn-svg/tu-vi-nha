/**
 * Loi giai tuong mat (dot 7 phan 2): moi ti le xep thap / vua / cao so voi anh mau mat tu nhien roi lay loi Claude soan lai (luat 6
 * `CLAUDE.md`: soan moi, khong chep) theo nhieu nen: sach tuong Trung Hoa (goc cua tuong hoc Viet), An Do, kinh Phat, A Rap – Ba Tu,
 * Hy Lap – La Ma, tuong hoc hien dai Nhat – Han, tuc ngu Viet. Cac nen noi nguoc nhau thi neu ca. Nguong, nguon, muc kiem chung:
 * `docs/QUY_UOC.md` muc 26.
 */
import type { SoDoMat } from './tuongMat.ts';

export type MucMat = 'thap' | 'vua' | 'cao';

interface DongGiai {
  readonly ten: string;
  /** Giai thich cach do, hien duoi ten. */
  readonly y: string;
  /** Duoi `nguong[0]` la thap, tren `nguong[1]` la cao. */
  readonly nguong: readonly [number, number];
  /** Loi chinh, ngan — hien tren man hinh va gui AI. */
  readonly loi: Readonly<Record<MucMat, string>>;
  /** Cac nen khac, cho venh, luu y — chi hien tren man hinh (AI chi nhan `loi` cho vua han muc token). */
  readonly them: Readonly<Record<MucMat, string>>;
  readonly nguon: string;
}

/**
 * Diem cuoi (trung binh `mouthSmileLeft/Right` cua MediaPipe) tu muc nay tro len thi khong giai: anh 0,22 da hoi cuoi, 0,38 cuoi
 * ho rang; 14 anh mat nghiem ra 0,01–0,12. Trung vi anh cuoi so anh khong cuoi: mieng +14 %, trung:ha −8 % (do 24/10).
 */
export const NGUONG_CUOI = 0.2;

/** So anh mau lam nguong: nguoi Dong A, mat tu nhien (do 26/10, `scripts/doi-chieu/do-mat.mjs`). */
export const SO_ANH_MAU = 15;

/**
 * Chup gan meo phoi canh: chieu lai luoi 3D 14 anh mat nghiem o 30 cm (may -> dau mui) thi mui +20 %, dai:rong +20 %, mieng +17 %,
 * may cach mat +17 %, ngu nhan −12 %, an duong +8 %, trung:ha +7,5 %; khoang mat, may lech <=2,5 % (QUY_UOC muc 26). 72 anh mau
 * chup xa ra dai:rong 0,87–1,05 -> vuot `NGUONG_GAN` thi nghi tu chup cam tay, bo loi 7 ti le nhay khoang cach.
 */
export const NHAY_GAN: readonly (keyof SoDoMat)[] = ['trungHa', 'nguNhan', 'mui', 'mieng', 'daiRong', 'anDuong', 'mayCach'];
export const NGUONG_GAN = 1.05;

const S = {
  thaiThanh: 'Thái Thanh Thần Giám (Tống)',
  toanBien: 'Thần Tướng Toàn Biên (Minh)',
  thietQuan: 'Thần Tướng Thiết Quan Đao (Thanh)',
  nhanLuan: 'Nhân Luân Đại Thống Phú (Kim)',
  nguyetBa: 'Nguyệt Ba Động Trung Ký',
  bangGiam: 'Băng Giám (Thanh)',
  brhat: 'Bṛhat Saṃhitā (Ấn Độ, thế kỷ 6)',
  fakhr: 'Fakhr al-Dīn al-Rāzī, Kitāb al-firāsa (Ba Tư, thế kỷ 12)',
  rhazes: 'Rhazes, al-Manṣūrī (Ba Tư, thế kỷ 10)',
  sirr: 'Sirr al-asrār (Ả Rập)',
  aristotle: 'Aristotle giả danh, Physiognomonica (Hy Lạp)',
  polemon: 'Polemon (Hy Lạp, thế kỷ 2)',
  latinus: 'Anonymus Latinus (La Mã, thế kỷ 4)',
  vuTaiLuc: 'Vũ Tài Lục, Tướng mệnh khảo luận',
  hienDai: 'tướng học hiện đại Nhật, Hàn, Trung, Hồng Kông (đọc qua trích đoạn)',
} as const;

/**
 * Nguong = phan vi 25 va 75 cua 15 anh nguoi Dong A mat tu nhien (diem cuoi < 0,2), tru may: duoi 1 la "may ngan hon mat" dung luat
 * sach (luoi may dung theo cung may nen 72/72 anh ra 1,4–1,8). Truoc 26/10 lay 14 anh tron Tay – Dong A: nguoi Viet bi xep "mat xa,
 * may cao, an duong rong" vi Dong A khac han o cac ti le do. `loi`: loi chinh (gui ca AI); `them`: cac nen khac, cho
 * venh, luu y — chi hien tren man hinh. Nguon doc tan noi (6 huong tim 24–25/10): `docs/QUY_UOC.md` muc 26, [W55], [W56].
 */
export const GIAI: Readonly<Record<keyof SoDoMat, DongGiai>> = {
  trungHa: {
    ten: 'Trung đình : hạ đình', y: 'ấn đường → chân mũi, so với chân mũi → đáy cằm', nguong: [1.03, 1.09],
    loi: {
      thap: 'Hạ đình (chân mũi → cằm) dài hơn phần đông. Sách tướng Trung Hoa nói khác nhau, ngay trong Thần Tướng Toàn Biên: '
        + 'chỗ cho là về già yên ổn, chỗ chê là tầm thường (Thái Thanh Thần Giám cũng chê); sách nào cũng khen cằm vuông, đầy, dày.',
      vua: 'Trung đình và hạ đình gần bằng nhau như phần đông. Sách Trung Hoa coi ba đình đều nhau là cơm áo không thiếu (Toàn '
        + 'Biên); sách đo tượng Ấn Độ cũng chia mặt ba phần bằng nhau.',
      cao: 'Trung đình (ấn đường → chân mũi) dài hơn phần đông. Sách Trung Hoa phần nhiều cho là trung niên hanh thông, gần quyền '
        + 'quý (Thái Thanh Thần Giám, Toàn Biên).',
    },
    them: {
      thap: 'Tướng học Trung Hoa hiện đại (*) lại cho hạ đình hơi dài là tốt. Hạ đình dài mà hẹp, nhọn, mỏng thì sách chê rõ nhất (về '
        + 'già vất vả). Sách Tây cổ (Anonymus Latinus): cằm dài là người điềm tĩnh, ít nóng giận; Bṛhat Saṃhitā (Ấn Độ): cằm quá '
        + 'dài mà gầy là nghèo. Máy không xét dáng cằm.',
      vua: 'Tướng học Trung, Hàn hiện đại (*) vẫn lấy ba đình đều làm chuẩn; khoa học (*): đo người thật thì hiếm ai có ba đình '
        + 'đúng bằng nhau. Máy không đo được thượng đình (trán).',
      cao: 'Nhưng một chỗ khác trong Toàn Biên lại chê trung đình dài — sách cổ vênh nhau. Sách khen trung đình thẳng, đầy (thọ), '
        + 'chê trung đình ngắn, xẹp (thiếu trí, trung niên hao). Sách phương Tây, Ấn Độ không so hai đình.',
    },
    nguon: `${S.thaiThanh} q.5–6 · ${S.toanBien}: Tướng thuyết, Tam tài tam đình luận, Diện tam đình, Tướng ngũ trường · `
      + `${S.brhat} ch.57, 67 · ${S.latinus} · ${S.hienDai}`,
  },
  nguNhan: {
    ten: 'Ngũ nhãn', y: 'bề ngang mặt bằng bấy nhiêu mắt (số nhỏ = mắt dài so với mặt)', nguong: [5.48, 5.99],
    loi: {
      thap: 'Mắt dài so với bề ngang mặt hơn phần đông. Sách Trung Hoa khen mắt dài, thanh tú: "mắt dài một tấc ắt giúp minh '
        + 'vương" (Toàn Biên); kinh Phật, sách Ấn Độ cũng tả mắt dài như cánh sen là tướng quý.',
      vua: 'Mắt dài vừa so với mặt, như phần đông. Sách Trung Hoa ("không to không nhỏ là quý"), Aristotle giả danh và Polemon bản '
        + 'Ả Rập đều khen mắt vừa phải.',
      cao: 'Mắt ngắn so với bề ngang mặt hơn phần đông. Thiết Quan Đao chê "mặt to mắt nhỏ" là mang sát khí; nhưng Hứa Phụ, Thái '
        + 'Thanh Thần Giám nói mắt nhỏ mà sáng, có thần vẫn thông minh, quý, thọ.',
    },
    them: {
      thap: 'Thiết Quan Đao thêm: mặt nhỏ mắt to thì có của nhưng hay hao. Sách Tây và Ả Rập ngược hẳn: mắt dài là người khó lường '
        + '(Rhazes, Sirr al-asrār), mắt to là chậm chạp (Aristotle giả danh, Fakhr al-Dīn al-Rāzī). Tự chụp gần làm số này nhỏ '
        + 'đi tới 12 %.',
      vua: 'Phần còn lại sách xem ở thần mắt (sáng, có thần hay không) — máy không đo được.',
      cao: 'Tướng học Hàn hiện đại (*): mắt nhỏ là người cẩn thận, bền bỉ, chặt chẽ chuyện tiền. Polemon chê mắt nhỏ là gian; tục ngữ '
        + 'Việt "ti hí mắt lươn" là câu chê nặng nề, không nên tin. Thần mắt phải nhìn người thật.',
    },
    nguon: `${S.thietQuan} · ${S.toanBien}: Đạt Ma tướng nhãn, Tứ độc, Hứa Phụ · ${S.thaiThanh} q.5 · ${S.brhat} ch.67 · Đại Bát `
      + `Nhã Kinh q.381 · ${S.aristotle} · ${S.polemon} · ${S.fakhr} · ${S.rhazes} · ${S.sirr}`,
  },
  khoangMat: {
    ten: 'Khoảng giữa hai mắt', y: 'bằng bấy nhiêu mắt', nguong: [1.32, 1.53],
    loi: {
      thap: 'Hai mắt gần nhau hơn phần đông. Tướng học Nhật, Hàn hiện đại (*) cho là người nhạy bén, tập trung, nắm chi tiết nhanh, '
        + 'nhưng dễ lo nghĩ, hay để bụng.',
      vua: 'Khoảng giữa hai mắt như phần đông — gần chuẩn "giữa hai mắt lọt một con mắt" của tướng học Nhật, Hàn, Hồng Kông hiện '
        + 'đại (*).',
      cao: 'Hai mắt xa nhau hơn phần đông. Tướng học Nhật, Hàn, Hồng Kông hiện đại (*) cho là người rộng lượng, lạc quan, nhìn xa, '
        + 'nhưng dễ dãi nên đôi khi cẩu thả, dễ tin người.',
    },
    them: {
      thap: 'Sách tướng cổ không bàn thẳng khoảng này; gần nhất là: sơn căn (gốc mũi giữa hai mắt) hẹp mà nhọn thì của nhà sớm '
        + 'hao (Toàn Biên), ngũ quan dồn vào giữa là tính chi li (Thiết Quan Đao). Polemon tả người u sầu có khoảng giữa mắt "khép '
        + 'lại". Sách Ấn Độ, Ả Rập không nói.',
      vua: 'Sách đo tượng Ấn Độ, Tây Tạng cũng định sẵn khoảng giữa hai mắt — đó là phép tạc tượng, không phải lời đoán vận. Lưới '
        + 'máy đặt khoé mắt lọt vào trong nên số ra lớn hơn số đo bằng thước.',
      cao: 'Sách cổ Trung Hoa không chê mắt xa: chỉ khen sơn căn cao, rộng là giảm nửa tai hoạ (Quảng Giám Tập, chép trong Toàn '
        + 'Biên), và Tuân Tử kể Công Tôn Lữ ngũ quan cách nhau thưa mà danh vang thiên hạ. Số này không dùng để chẩn đoán '
        + 'bệnh.',
    },
    nguon: `${S.hienDai} · ${S.toanBien}: Ngũ tinh lục diệu, Quảng Giám Tập · ${S.thietQuan} · Tuân Tử, Phi Tướng · ${S.polemon} · `
      + `${S.brhat} ch.57. Sách tướng cổ (Trung Hoa, Ấn Độ, Ả Rập, Hy Lạp) không có câu nói thẳng về khoảng này`,
  },
  mui: {
    ten: 'Cánh mũi', y: 'bề ngang cánh mũi, phần trăm bề ngang mặt', nguong: [0.291, 0.301],
    loi: {
      thap: 'Cánh mũi hẹp so với mặt hơn phần đông. Sách Trung Hoa chê cánh mũi nhỏ, hẹp là tính dè sẻn, khó tích của (Nhân Luân '
        + 'Đại Thống Phú, Thông Nguyên Phú); Thiết Quan Đao xếp "mặt to mũi nhỏ" vào bốn tướng xấu.',
      vua: 'Cánh mũi rộng vừa so với mặt, như phần đông.',
      cao: 'Cánh mũi rộng so với mặt hơn phần đông. Sách Trung Hoa gọi hai cánh mũi (Lan Đài, Đình Úy) là kho tiền: "Lan Đài rộng mà dài thì '
        + 'tích được vàng" (Toàn Biên); tướng học Nhật, Hàn, Việt hiện đại (*) cũng coi cánh mũi nở là giữ được của.',
    },
    them: {
      thap: 'Sách có ngoại lệ: mũi "huyền đởm" (thẳng như túi mật treo) cánh nhỏ vẫn giàu; riêng phụ nữ, Toàn Biên lại khen mũi '
        + 'thon thẳng là quý. Sách Ấn Độ và kinh Phật khen mũi cao thẳng, lỗ mũi nhỏ kín — khác hẳn sách Trung Hoa.',
      vua: 'Sách cổ còn xét độ đầy, hai bên cân nhau, đầu mũi tròn, lỗ mũi không lộ — máy chỉ đo bề ngang. Tự chụp gần làm mũi '
        + 'trông rộng thêm tới 20 %.',
      cao: 'Điều kiện: rộng mà lỗ mũi hếch lộ thì của vẫn hao (Toàn Biên); Vũ Tài Lục: mũi to phải có gò má đỡ. Sách Tây và Ả Rập '
        + 'chia hai: lỗ mũi phồng rộng là nóng nảy (Aristotle giả danh, Fakhr al-Dīn al-Rāzī) hoặc gan dạ (Anonymus Latinus).',
    },
    nguon: `${S.toanBien}: Tướng phú, Tướng tị · ${S.nhanLuan} · Thông Nguyên Phú · ${S.thietQuan} · ${S.vuTaiLuc} · ${S.hienDai}, `
      + `bài phổ thông tiếng Việt · ${S.brhat} ch.67 · Đại Bát Nhã Kinh q.381 · ${S.aristotle} · ${S.fakhr} · ${S.latinus}`,
  },
  mieng: {
    ten: 'Miệng', y: 'bề ngang miệng, phần trăm bề ngang mặt', nguong: [0.356, 0.374],
    loi: {
      thap: 'Miệng hẹp so với mặt hơn phần đông. Sách Trung Hoa chê miệng nhỏ, chúm là kém lộc, về già vất vả, "mặt to miệng nhỏ" '
        + 'là tướng xấu (Hứa Phụ, Thiết Quan Đao); sách Tây cổ cho miệng nhỏ là người rụt rè.',
      vua: 'Miệng rộng vừa so với mặt, như phần đông. Sách Ấn Độ (Bṛhat Saṃhitā) khen miệng gọn, chê miệng quá rộng.',
      cao: 'Miệng rộng so với mặt hơn phần đông. Sách Trung Hoa khen miệng rộng mà vuông: "miệng rộng vuông lộc ngàn chung" (Băng '
        + 'Giám), "miệng rộng mặt vuông" là tướng làm quan (Thiết Quan Đao); sách Tây, Ả Rập gọi miệng rộng là miệng sư tử — gan dạ.',
    },
    them: {
      thap: 'Hứa Phụ cũng nói miệng nhỏ mà ăn nói khéo vẫn được; Fakhr al-Dīn al-Rāzī: miệng hẹp hay ốm vặt.',
      vua: 'Sách Trung Hoa còn xét môi dày mỏng, khoé miệng hướng lên hay xuống — máy không đo.',
      cao: 'Sách Trung Hoa và Tây cổ đều chê miệng rộng quá mà khép không kín, môi dày (nói nhiều ít tin, ham ăn). Sách Ấn Độ ngược '
        + 'lại: miệng quá rộng là bạc phận. Tục ngữ Việt xưa "đàn ông rộng miệng thì sang, đàn bà rộng miệng tan hoang cửa nhà" (Trương Vĩnh Ký chép năm 1883) '
        + 'là câu trọng nam khinh nữ, thật ra chê đàn bà nói nhiều.',
    },
    nguon: `${S.bangGiam} · ${S.nhanLuan} · ${S.thietQuan} · ${S.toanBien}: Hứa Phụ, Tướng khẩu · ${S.brhat} 67.54 · ${S.polemon} · `
      + `${S.latinus} · ${S.fakhr} · ${S.sirr} · tục ngữ (Trương Vĩnh Ký 1883)`,
  },
  daiRong: {
    ten: 'Dài : rộng mặt', y: 'ấn đường → đáy cằm, so với bề ngang mặt', nguong: [0.89, 0.97],
    loi: {
      thap: 'Mặt (từ ấn đường xuống) ngắn và rộng hơn phần đông. Sách Trung Hoa khen mặt rộng, vuông là có ruộng vườn, đứng trên '
        + 'người (Thái Thanh Thần Giám, Toàn Biên); kinh Phật tả mặt Phật đầy, rộng như trăng rằm.',
      vua: 'Mặt dài, rộng như phần đông. Sách Ả Rập (Fakhr al-Dīn al-Rāzī) nói mặt to hay nhỏ đều bị chê, vừa phải là tốt nhất; '
        + 'kinh Phật cũng khen mặt "không quá dài".',
      cao: 'Mặt (từ ấn đường xuống) dài hơn phần đông. Sách Trung Hoa khen mặt dài mà vuông: "mặt nên dài mà vuông", thân ngắn mặt '
        + 'dài là quý (Toàn Biên); mặt dài thuộc hình Mộc: tính hoà hoãn, thương người.',
    },
    them: {
      thap: 'Nhưng "mặt ngắn" bị chê nghèo hèn, trừ khi mắt dài; Bṛhat Saṃhitā (Ấn Độ): mặt quá ngắn là keo kiệt, mặt đầy đặn là '
        + 'hưởng phúc. Tục ngữ Việt: "mặt vuông chữ điền" là người phúc hậu. Tướng học Hàn hiện đại (*): mặt rộng là người khéo xoay '
        + 'xở, chân thành. Sách Ả Rập, Polemon chê mặt quá tròn, quá bè là kém hiểu. Khoa học (*): mặt rộng làm người khác thấy mạnh '
        + 'mẽ, áp đảo, nhưng liên hệ với tính cách thật rất yếu.',
      vua: 'Sách Trung Hoa xét dáng mặt theo ngũ hành và theo thân người, không theo một con số; Tuân Tử (thiên Phi Tướng) còn '
        + 'nhắc: dài ngắn to nhỏ không phải điềm lành dữ.',
      cao: 'Như Tang Duy Hàn đời Hậu Tấn tự hào "thân bảy thước không bằng mặt một thước" rồi làm tể tướng (Tân Ngũ Đại Sử). Sách '
        + 'chê mặt dài mà nhọn hai đầu, hay "mặt ngựa". Sách Ả Rập (Fakhr al-Dīn al-Rāzī, Rhazes, Sirr al-asrār) và Ấn Độ (Bṛhat '
        + 'Saṃhitā) ngược hẳn: mặt dài là trơ tráo hoặc nghèo. Tướng học Hàn hiện đại (*): người lý trí, bền chí. Tự chụp gần làm mặt '
        + 'trông dài thêm tới 20 %.',
    },
    nguon: `${S.toanBien}: Tướng diện, Quý tướng khẩu quyết, Ngũ hành ca · ${S.thaiThanh} q.1, q.4 · Tân Ngũ Đại Sử q.29 · Tuân `
      + `Tử, Phi Tướng · Đại Trí Độ Luận q.89 · ${S.brhat} 67.55–56 · ${S.fakhr} · ${S.rhazes} · ${S.sirr} · ${S.polemon} · `
      + `${S.hienDai} · tục ngữ Việt`,
  },
  may: {
    ten: 'Lông mày', y: 'dài bằng bấy nhiêu mắt', nguong: [1, 1.77],
    loi: {
      thap: 'Lông mày ngắn hơn mắt. Sách Trung Hoa chê mày không phủ hết mắt: thiếu tiền, ít nhờ anh em, tính hay một mình (Nguyệt '
        + 'Ba Động Trung Ký, Toàn Biên).',
      vua: 'Lông mày dài quá mắt, như phần đông. Sách Trung Hoa khen mày dài hơn mắt: ngay thẳng, có lộc, anh em hoà thuận (Toàn '
        + 'Biên, Nhân Luân Đại Thống Phú).',
      cao: 'Lông mày dài hơn phần đông, dài quá mắt rõ. Sách Trung Hoa khen: ngay thẳng, có lộc, anh em đông ("mày dài hơn mắt, anh '
        + 'em năm sáu" — Vạn Kim Tướng); sách Ấn Độ, kinh Phật cũng khen mày dài cong như trăng non.',
    },
    them: {
      thap: 'Lưới máy dựng theo cung mày nên hiếm khi ra số này — soi gương lại cho chắc; máy không thấy lông mày thưa, đứt hay '
        + 'đã tỉa.',
      vua: 'Sách Ả Rập (Sirr al-asrār) khen mày dài vừa phải là người thận trọng. Máy không thấy lông mày thưa, đứt hay đã tỉa.',
      cao: 'Sách Tây và Ả Rập ngược lại: mày dài tới thái dương là người kiêu (Rhazes, Fakhr al-Dīn al-Rāzī, Sirr al-asrār). Máy '
        + 'không thấy lông mày thưa, đứt hay đã tỉa.',
    },
    nguon: `${S.toanBien}: Luận mi, cung Huynh Đệ, Vạn Kim Tướng · ${S.nhanLuan} · ${S.nguyetBa} · ${S.thaiThanh} q.5 · `
      + `${S.thietQuan} · ${S.brhat} 67.68–69 · Đại Bát Nhã Kinh q.381 · ${S.rhazes} · ${S.fakhr} · ${S.sirr}`,
  },
  anDuong: {
    ten: 'Ấn đường', y: 'khoảng giữa hai đầu mày, bằng bấy nhiêu mắt', nguong: [1.08, 1.17],
    loi: {
      thap: 'Ấn đường hẹp hơn phần đông. Sách Trung Hoa cho ấn đường hẹp, hai đầu mày gần giao là đường đời vất vả, con muộn vợ '
        + 'muộn (Thần Dị Phú, Nguyệt Ba Động Trung Ký); sách Tây cổ cũng nói mày giao là người hay buồn.',
      vua: 'Ấn đường rộng vừa, như phần đông — gần chuẩn "giữa mày lọt hai ngón tay" (Ngân Thi Ca trong Toàn Biên; sách đo tượng '
        + 'Ấn Độ Bṛhat Saṃhitā cũng đặt 2 ngón).',
      cao: 'Ấn đường rộng hơn phần đông. Sách Trung Hoa khen: "khoảng mày rộng thì lòng phẳng lặng" (Nhân Luân Đại Thống Phú), hai '
        + 'mày lùi xa cung mệnh là vận sớm, giàu sang (Thiết Quan Đao).',
    },
    them: {
      thap: 'Tướng học hiện đại (*): tỉ mỉ nhưng hay lo, dễ để bụng. Sách cổ có ngoại lệ ("người thần khí mạnh không tính"); kinh Phật '
        + 'lại tả đầu mày Phật hơi liền nhau (Phương Quảng Đại Trang Nghiêm Kinh), Polemon bản Ả Rập cho mày giao xuống sống mũi '
        + 'là kiêu hãnh, hiếu động.',
      vua: 'Tướng học Trung, Nhật, Hàn hiện đại (*) cũng lấy hai ngón tay làm chuẩn. Vũ Tài Lục: ấn đường nên rộng rãi, đầy đặn.',
      cao: 'Tướng học hiện đại (*): rộng quá (ba ngón) thì bị cho là lơ đãng, dễ dãi. Sách cổ cũng dặn: rộng mà gồ ghề, không phẳng thì '
        + 'vẫn không giàu (Nguyệt Ba Động Trung Ký). Polemon bản Ả Rập xếp mày tách xa vào chân dung người cứng cỏi, can đảm.',
    },
    nguon: `${S.nhanLuan} · ${S.thietQuan} · ${S.nguyetBa} · ${S.toanBien}: Thần Dị Phú, Ngân Thi Ca, Tướng ấn đường · ${S.vuTaiLuc} `
      + `· ${S.hienDai} · ${S.brhat} ch.57, 67 · Phương Quảng Đại Trang Nghiêm Kinh · `
      + `${S.aristotle} · ${S.latinus} · ${S.polemon}`,
  },
  mayCach: {
    ten: 'Mày cách mắt', y: 'bằng bấy nhiêu mắt', nguong: [0.65, 0.78],
    loi: {
      thap: 'Lông mày gần mắt hơn phần đông. Sách Trung Hoa chê mày đè sát mắt: túng bức, bất lợi (Thái Thanh Thần Giám, Băng '
        + 'Giám); sách Tây cổ (Aristotle, Anonymus Latinus) cũng nói mày sà xuống mắt là tính đố kỵ.',
      vua: 'Mày cách mắt vừa, như phần đông. Tướng học hiện đại (*) lấy khoảng một ngón tay làm chuẩn, nam thường hẹp hơn nữ.',
      cao: 'Lông mày cách mắt xa hơn phần đông. Sách Trung Hoa khen mày cao hơn mắt: "mày nên cao hơn mắt một tấc" — thông minh, '
        + 'phú quý (Toàn Biên); "hai mày cao giữa trán thì lòng khoáng đạt" (Thiết Quan Đao).',
    },
    them: {
      thap: 'Nguyệt Ba Động Trung Ký: mày gần mắt mà sắc mặt tối là hay ganh; Vũ Tài Lục: mày sụp xuống là phá cung Điền Trạch. '
        + 'Tướng học hiện đại (*) nhẹ hơn: tự lập, chăm chỉ nhưng nóng tính. Ngoại lệ: tướng "tinh tinh" mày gần mắt lại là cao tăng, '
        + 'vợ hiền (Toàn Biên).',
      vua: 'Khoảng này dân gian Việt, Trung ngày nay gọi là cung Điền Trạch (sách cổ lại đặt Điền Trạch ở mắt).',
      cao: 'Tướng học Hồng Kông hiện đại (Tô Dân Phong) (*): người trọng gia đình. Lưu ý: Nhân Luân Đại Thống Phú nói mày cong vén cao '
        + 'là hay tranh; Vũ Tài Lục: đầu mày cao quá là tự cao. Tự chụp gần làm khoảng này rộng ra tới 17 %.',
    },
    nguon: `${S.toanBien}: Thập quan, Luận mi, Ngân Thi Ca · ${S.thaiThanh} q.5 · ${S.thietQuan} · ${S.bangGiam} · ${S.nguyetBa} · `
      + `${S.nhanLuan} · ${S.vuTaiLuc} · ${S.hienDai} · Aristotle, Historia animalium · ${S.latinus}`,
  },
};

/** 15 so do mau (nguoi Dong A, mat tu nhien, do 26/10) cua tung ti le, xep tang: noi "lon hon N/15 nguoi mau", nguong lay tu day. */
export const MAU: Readonly<Record<keyof SoDoMat, readonly number[]>> = {
  trungHa: [0.863, 0.98, 1.004, 1.025, 1.036, 1.036, 1.055, 1.067, 1.071, 1.078, 1.083, 1.098, 1.117, 1.139, 1.143],
  nguNhan: [5.434, 5.446, 5.453, 5.472, 5.491, 5.577, 5.595, 5.68, 5.878, 5.922, 5.973, 6.0, 6.28, 6.294, 6.308],
  khoangMat: [1.248, 1.269, 1.314, 1.321, 1.327, 1.331, 1.384, 1.437, 1.444, 1.456, 1.525, 1.543, 1.55, 1.556, 1.621],
  mui: [0.28, 0.287, 0.287, 0.29, 0.291, 0.292, 0.292, 0.293, 0.297, 0.3, 0.301, 0.302, 0.303, 0.315, 0.319],
  mieng: [0.336, 0.351, 0.355, 0.356, 0.356, 0.36, 0.361, 0.364, 0.365, 0.372, 0.373, 0.375, 0.375, 0.386, 0.397],
  daiRong: [0.878, 0.879, 0.879, 0.891, 0.898, 0.898, 0.905, 0.936, 0.952, 0.953, 0.97, 0.977, 0.987, 0.99, 1.046],
  may: [1.585, 1.599, 1.613, 1.627, 1.64, 1.649, 1.659, 1.677, 1.716, 1.728, 1.766, 1.778, 1.797, 1.824, 1.833],
  anDuong: [1.018, 1.05, 1.051, 1.071, 1.088, 1.108, 1.109, 1.109, 1.13, 1.159, 1.161, 1.174, 1.178, 1.197, 1.227],
  mayCach: [0.544, 0.629, 0.637, 0.645, 0.656, 0.666, 0.68, 0.706, 0.747, 0.755, 0.759, 0.803, 0.807, 0.812, 0.827],
};

const HON: Readonly<Record<keyof SoDoMat, string>> = {
  trungHa: 'Trung đình dài hơn', nguNhan: 'Mắt dài hơn', khoangMat: 'Hai mắt xa hơn', mui: 'Cánh mũi rộng hơn', mieng: 'Miệng rộng hơn',
  daiRong: 'Mặt dài hơn', may: 'Lông mày dài hơn', anDuong: 'Ấn đường rộng hơn', mayCach: 'Mày cao hơn',
};
/** Hang trong nguoi mau noi theo net mat; ngu nhan so nho = mat dai nen dem so nguoi mau co so lon hon. */
export const soVoiMau = (khoa: keyof SoDoMat, x: number): string =>
  `${HON[khoa]} ${String(MAU[khoa].filter((v) => (khoa === 'nguNhan' ? v > x : v < x)).length)}/${String(MAU[khoa].length)} người mẫu.`;

type LinhVuc = 'tinh' | 'tien' | 'nha' | 'van';
const TEN_LV: Readonly<Record<LinhVuc, string>> = {
  tinh: 'Tính cách, trí tuệ', tien: 'Tiền bạc, lộc ăn', nha: 'Gia đình, nhà cửa, địa vị', van: 'Vận theo tuổi',
};
type Ket = { readonly d: -1 | 0 | 1; readonly y: string };
/**
 * Ket luan tung muc theo loi chinh (sach tuong Trung Hoa — goc cua tuong hoc Viet): +1 tot, −1 can luu y, 0 trung tinh hoac sach
 * khen che lan lon. Khoang mat khong co sach co noi thang nen luon 0. Dong "(*)" = chi doc qua trich doan.
 */
export const KET: Readonly<Record<keyof SoDoMat, { readonly lv: LinhVuc } & Readonly<Record<MucMat, Ket>>>> = {
  trungHa: { lv: 'van', thap: { d: 0, y: 'hạ đình dài — về già: sách khen chê lẫn lộn' },
    vua: { d: 1, y: 'trung, hạ đình cân — đời đều đặn, cơm áo không thiếu' }, cao: { d: 1, y: 'trung đình dài — trung niên hanh thông' } },
  nguNhan: { lv: 'tinh', thap: { d: 1, y: 'mắt dài — sáng dạ, tướng quý' }, vua: { d: 0, y: 'mắt vừa' },
    cao: { d: -1, y: 'mắt nhỏ so với mặt — sách chê, trừ khi mắt sáng có thần' } },
  khoangMat: { lv: 'tinh', thap: { d: 0, y: 'mắt gần — tập trung nhưng hay lo (*)' }, vua: { d: 0, y: 'mắt cách vừa' },
    cao: { d: 0, y: 'mắt xa — rộng lượng nhưng dễ tin người (*)' } },
  mui: { lv: 'tien', thap: { d: -1, y: 'cánh mũi hẹp — khó tích của' }, vua: { d: 0, y: 'cánh mũi vừa' },
    cao: { d: 1, y: 'cánh mũi rộng — giữ được của' } },
  mieng: { lv: 'tien', thap: { d: -1, y: 'miệng hẹp — lộc ăn kém, về già vất vả' }, vua: { d: 0, y: 'miệng vừa' },
    cao: { d: 1, y: 'miệng rộng — có lộc ăn, phúc thọ' } },
  daiRong: { lv: 'nha', thap: { d: 1, y: 'mặt rộng — có ruộng vườn, đứng trên người' }, vua: { d: 0, y: 'mặt dài rộng vừa' },
    cao: { d: 0, y: 'mặt dài — quý nếu vuông, kém nếu nhọn hai đầu' } },
  may: { lv: 'nha', thap: { d: -1, y: 'mày ngắn hơn mắt — ít nhờ anh em' }, vua: { d: 1, y: 'mày dài quá mắt — anh em hoà thuận' },
    cao: { d: 1, y: 'mày dài — anh em đông, có lộc' } },
  anDuong: { lv: 'tinh', thap: { d: -1, y: 'ấn đường hẹp — đường đời vất vả' }, vua: { d: 0, y: 'ấn đường vừa' },
    cao: { d: 1, y: 'ấn đường rộng — lòng phẳng lặng, vận sớm' } },
  mayCach: { lv: 'nha', thap: { d: -1, y: 'mày sát mắt — túng bức' }, vua: { d: 0, y: 'mày cách mắt vừa' },
    cao: { d: 1, y: 'mày cao — thông minh, phú quý' } },
};

export const mucMat = (khoa: keyof SoDoMat, x: number): MucMat => {
  const [a, b] = GIAI[khoa].nguong;
  return x < a ? 'thap' : x > b ? 'cao' : 'vua';
};

export const CAC_KHOA = Object.keys(GIAI) as (keyof SoDoMat)[];

/** Mui, mieng hien phan tram be ngang mat (de hieu hon "0,30 lan"), 1 so le cho thay ro nguong; con lai 2 so le. */
export const dangSo = (k: keyof SoDoMat, x: number): string =>
  (k === 'mui' || k === 'mieng' ? `${(x * 100).toFixed(1).replace('.', ',')} %` : x.toFixed(2).replace('.', ','));
const so2 = (x: number): string => x.toFixed(2).replace('.', ',');

/** Loi tung ti le (null = khong giai) kem canh bao: anh cuoi thi khong giai ca 9; nghi chup gan thi bo 5 ti le nhay khoang cach. */
export function giaiMat(m: { readonly so: SoDoMat; readonly cuoi: number }):
  { readonly canhBao: readonly string[]; readonly loi: Readonly<Record<keyof SoDoMat, string | null>> } {
  const cuoi = m.cuoi >= NGUONG_CUOI, gan = m.so.daiRong > NGUONG_GAN;
  const canhBao = [
    ...(cuoi ? [`Ảnh có vẻ đang cười (điểm cười ${so2(m.cuoi)}): cười làm miệng rộng ra, mắt híp lại nên số lệch — app không `
      + 'giải. Chụp lại mặt tự nhiên, ngậm miệng.'] : []),
    ...(gan ? [`Dài : rộng mặt ${so2(m.so.daiRong)} vượt mọi ảnh mẫu chụp xa (0,87–1,05) — thường do tự chụp cầm tay: máy gần `
      + `làm mặt dài ra tới ~20 %. App bỏ lời giải ${String(NHAY_GAN.length)} số nhạy khoảng cách (`
      + `${NHAY_GAN.map((k) => GIAI[k].ten.toLowerCase()).join(', ')}). Nhờ người khác chụp cách 1,5–2 m, zoom 2–3× rồi đo lại.`] : []),
  ];
  const loi = Object.fromEntries(CAC_KHOA.map((k) => [k, cuoi || (gan && NHAY_GAN.includes(k)) ? null : GIAI[k].loi[mucMat(k, m.so[k])]]));
  return { canhBao, loi: loi as Record<keyof SoDoMat, string | null> };
}

/**
 * Ket luan chung tu cac net duoc giai: moi linh vuc mot dong (bo net "vua" trung tinh), roi dem net tot / can luu y. Null khi khong
 * net nao duoc giai (anh cuoi).
 */
export function ketLuan(m: { readonly so: SoDoMat; readonly cuoi: number }): { readonly dong: readonly string[]; readonly tong: string } | null {
  const g = giaiMat(m);
  const co = CAC_KHOA.filter((k) => g.loi[k] !== null).map((k) => ({ k, ...KET[k][mucMat(k, m.so[k])] }));
  if (co.length === 0) return null;
  const dong = (Object.keys(TEN_LV) as LinhVuc[]).flatMap((lv) => {
    const y = co.filter((x) => KET[x.k].lv === lv && (x.d !== 0 || mucMat(x.k, m.so[x.k]) !== 'vua')).map((x) => x.y);
    return y.length === 0 ? [] : [`${TEN_LV[lv]}: ${y.join('; ')}.`];
  });
  const tot = co.filter((x) => x.d > 0).length, xau = co.filter((x) => x.d < 0).length;
  const nghieng = tot - xau >= 2 ? 'nghiêng về tốt' : xau - tot >= 2 ? 'nhiều điểm cần lưu ý' : 'tốt xấu gần ngang nhau';
  const bo = CAC_KHOA.length - co.length;
  return { dong, tong: `Tổng: ${String(tot)} nét tốt, ${String(xau)} nét cần lưu ý trên ${String(co.length)} nét xét được — ${nghieng}`
    + `${bo > 0 ? ` (${String(bo)} nét không xét vì ảnh chụp gần)` : ''}.` };
}
