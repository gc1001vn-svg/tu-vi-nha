/**
 * Loi giai tuong mat (dot 7 phan 2): moi ti le xep thap / vua / cao so voi anh mau mat tu nhien roi lay loi Claude soan lai theo
 * sach tuong co va sach dan gian Viet (luat 6 `CLAUDE.md`: soan moi, khong chep). Moi loi co >=2 nguon; ti le khong tim duoc nguon
 * thi chi tu, khong phan. Nguong, nguon, vi sao so voi anh mau chu khong so thang chuan sach: `docs/QUY_UOC.md` muc 26.
 */
import type { SoDoMat } from './tuongMat.ts';

export type MucMat = 'thap' | 'vua' | 'cao';

interface DongGiai {
  readonly ten: string;
  /** Giai thich cach do, hien duoi ten. */
  readonly y: string;
  /** Duoi `nguong[0]` la thap, tren `nguong[1]` la cao. */
  readonly nguong: readonly [number, number];
  readonly loi: Readonly<Record<MucMat, string>>;
  readonly nguon: string;
}

/**
 * Diem cuoi (trung binh `mouthSmileLeft/Right` cua MediaPipe) tu muc nay tro len thi khong giai: anh 0,22 da hoi cuoi, 0,38 cuoi
 * ho rang; 14 anh mat nghiem ra 0,01–0,12. Trung vi anh cuoi so anh khong cuoi: mieng +14 %, trung:ha −8 % (do 24/10).
 */
export const NGUONG_CUOI = 0.2;

/** So anh mau mat tu nhien lam nguong (do 24/10, `scripts/doi-chieu/do-mat.mjs`). */
export const SO_ANH_MAU = 14;

const SACH = {
  thaiThanh: 'Thái Thanh Thần Giám (đời Tống)',
  toanBien: 'Thần Tướng Toàn Biên (đời Minh)',
  thietQuan: 'Thần Tướng Thiết Quan Đao (đời Thanh)',
} as const;

/**
 * Nguong = phan vi 25 va 75 cua 14 anh mat tu nhien (diem cuoi < 0,2; 6 nguoi goc Dong A), tru may: duoi 1 la "may ngan hon mat"
 * dung luat sach (luoi may dung theo cung may nen 53/53 anh ra 1,5–1,8).
 */
export const GIAI: Readonly<Record<keyof SoDoMat, DongGiai>> = {
  trungHa: {
    ten: 'Trung đình : hạ đình', y: 'ấn đường → chân mũi, so với chân mũi → đáy cằm', nguong: [0.96, 1.06],
    loi: {
      thap: 'Hạ đình (chân mũi → cằm) dài hơn phần đông. Sách chia mặt ba đình ứng ba quãng đời và nói khác nhau ở đây: Thần Tướng '
        + 'Toàn Biên cho hạ đình dài là về già yên ổn, Thái Thanh Thần Giám lại chê; hai sách cùng khen cằm vuông, đầy, dày '
        + '(máy không xét dáng cằm).',
      vua: 'Trung đình và hạ đình gần cân nhau như phần đông. Sách coi ba đình đều nhau là đời sống đều đặn, cơm áo không thiếu '
        + '(máy không đo được thượng đình là trán).',
      cao: 'Trung đình (ấn đường → chân mũi) dài hơn phần đông. Sách cho trung đình dài là quãng trung niên hanh thông, dễ có '
        + 'địa vị.',
    },
    nguon: `${SACH.thaiThanh} quyển 5 "Luận diện bộ", quyển 6 "Tam đình" · ${SACH.toanBien} "Tam tài tam đình luận", "Tướng thuyết"`,
  },
  nguNhan: {
    ten: 'Ngũ nhãn', y: 'bề ngang mặt bằng bấy nhiêu mắt (số nhỏ = mắt dài so với mặt)', nguong: [5.37, 5.66],
    loi: {
      thap: 'Mắt dài so với bề ngang mặt hơn phần đông. Sách khen mắt dài, thanh tú, đen trắng phân minh (như mắt phượng) là '
        + 'tướng quý.',
      vua: 'Mắt dài vừa so với mặt, như phần đông. Sách xem mắt chủ yếu ở thần (ánh mắt) — máy không đo được.',
      cao: 'Mắt ngắn so với bề ngang mặt hơn phần đông. Sách không chê mắt nhỏ: mắt nhỏ mà sáng, có thần vẫn được coi là quý '
        + 'và thọ — phần thần mắt phải nhìn người thật.',
    },
    nguon: `${SACH.thaiThanh} quyển 5 "Luận nhãn bộ" · ${SACH.toanBien} (phượng tướng mắt dài)`,
  },
  khoangMat: {
    ten: 'Khoảng giữa hai mắt', y: 'bằng bấy nhiêu mắt', nguong: [1.24, 1.33],
    loi: {
      thap: 'Hai mắt gần nhau hơn phần đông.',
      vua: 'Khoảng giữa hai mắt như phần đông.',
      cao: 'Hai mắt xa nhau hơn phần đông.',
    },
    nguon: 'Không tìm được sách tướng bàn khoảng này nên app không giải; chuẩn vẽ "tam đình ngũ nhãn" coi giữa hai mắt bằng một '
      + 'mắt, lưới máy đặt khoé mắt lọt vào trong nên ra số lớn hơn',
  },
  mui: {
    ten: 'Cánh mũi', y: 'rộng bằng bấy nhiêu khoảng giữa hai mắt', nguong: [1.19, 1.29],
    loi: {
      thap: 'Cánh mũi hẹp hơn phần đông. Dân gian cho cánh mũi mỏng, hẹp là tiền vào ra nhanh, nên chú ý tích luỹ.',
      vua: 'Cánh mũi rộng vừa, như phần đông. Sách còn xét độ đầy, hai bên cân nhau và đầu mũi — máy chỉ đo bề ngang.',
      cao: 'Cánh mũi rộng hơn phần đông. Dân gian coi cánh mũi nở, đầy (hai bộ vị Lan Đài, Đình Úy) là tướng biết giữ của.',
    },
    nguon: `${SACH.toanBien} "Tướng tị" (Lan Đài, Đình Úy) · bài nhân tướng học phổ thông tiếng Việt về cánh mũi (QUY_UOC mục 26)`,
  },
  mieng: {
    ten: 'Miệng', y: 'rộng bằng bấy nhiêu cánh mũi', nguong: [1.21, 1.29],
    loi: {
      thap: 'Miệng hẹp hơn phần đông. Sách cũ chê miệng nhỏ, chúm là kém lộc, về già vất vả — nên đọc cùng các nét khác, đừng '
        + 'xét riêng.',
      vua: 'Miệng rộng vừa, như phần đông. Sách còn xét môi dày mỏng, khoé miệng hướng lên hay xuống — máy không đo.',
      cao: 'Miệng rộng hơn phần đông. Sách khen miệng rộng, vuông, có góc cạnh là có lộc ăn, phúc thọ.',
    },
    nguon: `${SACH.toanBien} "Tướng khẩu" · ${SACH.thietQuan} "Tướng khẩu bí quyết"`,
  },
  daiRong: {
    ten: 'Dài : rộng mặt', y: 'ấn đường → đáy cằm, so với bề ngang mặt', nguong: [0.88, 0.95],
    loi: {
      thap: 'Mặt (từ ấn đường xuống) ngắn và rộng hơn phần đông.',
      vua: 'Mặt dài, rộng như phần đông.',
      cao: 'Mặt (từ ấn đường xuống) dài hơn phần đông.',
    },
    nguon: 'Sách xếp dáng mặt theo ngũ hành (dài là Mộc, vuông là Kim, tròn là Thủy…) nhưng không theo một tỉ lệ số nên app '
      + 'không giải',
  },
  may: {
    ten: 'Lông mày', y: 'dài bằng bấy nhiêu mắt', nguong: [1, 1.66],
    loi: {
      thap: 'Lông mày ngắn hơn mắt. Sách chê mày không phủ hết mắt (kém tiền, tính hay một mình). Lưới máy dựng theo cung mày '
        + 'nên hiếm khi ra số này — soi gương lại cho chắc.',
      vua: 'Lông mày dài quá mắt (phần đông ra vậy). Sách khen mày dài quá mắt là người ngay thẳng, có lộc, anh em hoà thuận.',
      cao: 'Lông mày dài hơn phần đông, dài quá mắt rõ. Sách khen mày dài quá mắt là người ngay thẳng, có lộc, anh em hoà thuận.',
    },
    nguon: `${SACH.thaiThanh} quyển 5 "Luận mi" · ${SACH.toanBien} "Luận mi", cung Huynh Đệ · ${SACH.thietQuan}. Máy không thấy `
      + 'lông mày thưa, đứt hay đã tỉa',
  },
  anDuong: {
    ten: 'Ấn đường', y: 'khoảng giữa hai đầu mày, bằng bấy nhiêu mắt', nguong: [1.02, 1.08],
    loi: {
      thap: 'Ấn đường hẹp hơn phần đông. Sách cho ấn đường hẹp, hai đầu mày sát nhau là việc dễ vất vả, bôn ba; dân gian thêm: '
        + 'tính chi li, hay lo nghĩ.',
      vua: 'Ấn đường rộng vừa, như phần đông.',
      cao: 'Ấn đường rộng hơn phần đông. Sách khen ấn đường rộng, phẳng là đời yên ổn, việc hanh thông; dân gian thêm: tính rộng '
        + 'rãi nhưng dễ tin người.',
    },
    nguon: `${SACH.toanBien} "Tướng ấn đường" · ${SACH.thietQuan} · bài phổ thông tiếng Việt về ấn đường (QUY_UOC mục 26)`,
  },
  mayCach: {
    ten: 'Mày cách mắt', y: 'bằng bấy nhiêu mắt', nguong: [0.47, 0.69],
    loi: {
      thap: 'Lông mày gần mắt hơn phần đông. Sách chê mày đè sát mắt là đời dễ chật vật, ít nhờ anh em. Khoảng này dân gian '
        + 'ngày nay gọi là cung Điền Trạch.',
      vua: 'Mày cách mắt vừa, như phần đông.',
      cao: 'Lông mày cách mắt xa hơn phần đông — không phạm điều sách chê (mày đè sát mắt).',
    },
    nguon: `${SACH.thaiThanh} quyển 5 "Luận mi" · ${SACH.toanBien} cung Huynh Đệ ("mày vây sát mắt")`,
  },
};

export const mucMat = (khoa: keyof SoDoMat, x: number): MucMat => {
  const [a, b] = GIAI[khoa].nguong;
  return x < a ? 'thap' : x > b ? 'cao' : 'vua';
};

export const CAC_KHOA = Object.keys(GIAI) as (keyof SoDoMat)[];
