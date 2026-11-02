/**
 * Loi luan tuong mat (`tuongMatLuan.ts`), Claude soan moi (luat 6): khong ke sach, khong chep cau sach. Nguon da doc va ly do chot
 * tung cho venh: `docs/LUAN_TUONG_MAT.md` (nguon chi tiet: QUY_UOC muc 26).
 */
import type { MucMat } from './tuongMatGiai.ts';

/** Nhan tung net sau khi chot (+1 tot, −1 can luu y, 0 trung tinh) va cau tom. */
export interface NetChot { readonly d: number; readonly y: string }

/** Cau tom tung net — ban mac dinh; trung:ha thap, dai:rong cao doi theo ham, cam (xem `tuongMatLuan.ts`). */
export const NET: Readonly<Record<string, Readonly<Record<MucMat, NetChot>>>> = {
  tran: { thap: { d: -1, y: 'trán hẹp — tuổi trẻ phải tự gây dựng nhiều hơn' }, vua: { d: 0, y: 'trán rộng vừa' },
    cao: { d: 1, y: 'trán rộng — tuổi trẻ thuận, sớm có chỗ đứng' } },
  trungHa: { thap: { d: 0, y: 'hạ đình dài hơn trung đình' }, vua: { d: 1, y: 'trung đình, hạ đình cân — đời đều đặn' },
    cao: { d: 1, y: 'trung đình dài — trung niên là quãng mạnh' } },
  nguNhan: { thap: { d: 1, y: 'mắt dài so với mặt — sáng dạ, nhìn xa' }, vua: { d: 0, y: 'mắt dài vừa' },
    cao: { d: -0.5, y: 'mắt nhỏ so với mặt — cần thần mắt bù (máy không đo được)' } },
  khoangMat: { thap: { d: 0, y: 'hai mắt gần — tập trung, hay lo' }, vua: { d: 0, y: 'hai mắt cách vừa' },
    cao: { d: 0, y: 'hai mắt xa — rộng rãi, dễ tin người' } },
  mui: { thap: { d: -1, y: 'cánh mũi hẹp — tiền vào khó giữ' }, vua: { d: 0, y: 'cánh mũi vừa' },
    cao: { d: 1, y: 'cánh mũi rộng — giữ được của' } },
  mieng: { thap: { d: -1, y: 'miệng hẹp — lộc ăn mỏng' }, vua: { d: 0, y: 'miệng vừa' }, cao: { d: 1, y: 'miệng rộng — có lộc ăn' } },
  daiRong: { thap: { d: 1, y: 'mặt rộng — vững, có của nền' }, vua: { d: 0, y: 'mặt dài rộng vừa' }, cao: { d: 0, y: 'mặt dài' } },
  ham: { thap: { d: -1, y: 'hàm hẹp — về già ít chỗ dựa' }, vua: { d: 0, y: 'hàm vừa' }, cao: { d: 1, y: 'hàm rộng — về già vững' } },
  cam: { thap: { d: -1, y: 'cằm nhọn — về già cần lo trước' }, vua: { d: 0, y: 'cằm vừa' }, cao: { d: 1, y: 'cằm rộng — về già an ổn' } },
  may: { thap: { d: -1, y: 'lông mày ngắn hơn mắt — ít nhờ anh em' }, vua: { d: 0, y: 'lông mày dài quá mắt' },
    cao: { d: 0, y: 'lông mày dài' } },
  anDuong: { thap: { d: -1, y: 'ấn đường hẹp — dễ dồn nén' }, vua: { d: 0, y: 'ấn đường vừa' },
    cao: { d: 1, y: 'ấn đường rộng — lòng thoáng' } },
  mayCach: { thap: { d: -1, y: 'mày sát mắt — dễ bị việc dồn ép' }, vua: { d: 0, y: 'mày cách mắt vừa' },
    cao: { d: 1, y: 'mày cao — thông minh, rộng lượng' } },
};

export const HA_DAI = {
  day: { d: 1, y: 'hạ đình dài mà hàm, cằm đầy — về già yên' },
  nhon: { d: -1, y: 'hạ đình dài mà cằm nhọn — về già cần lo trước' },
  thuong: { d: 0, y: 'hạ đình dài hơn trung đình — về già bình thường' },
} as const;
export const MAT_DAI = {
  vuong: { d: 1, y: 'mặt dài mà hàm vuông — tướng quý' },
  nhon: { d: -1, y: 'mặt dài mà cằm nhọn — dễ vất vả' },
  thuong: { d: 0, y: 'mặt dài, hàm cằm vừa' },
} as const;

export const KET = {
  thuan: 'Kết: tướng thuận — nét nổi nhiều hơn nét kém; cái sẵn có tốt, giữ được là đủ.',
  vua: 'Kết: tướng bình thường — có nét mạnh, có nét yếu, phần lớn nằm ở cách sống.',
  kho: 'Kết: tướng cần tự bồi đắp — vài nét kém đi cùng nhau; làm chậm, chắc và giữ sức khỏe là bù được.',
} as const;

export const CHUA_DU = (bo: number, tong: number): string => `Chưa đủ nét để luận cả khuôn mặt: ${String(bo)}/${String(tong)} nét không `
  + 'xét vì ảnh chụp gần. Nhờ người chụp cách 1,5–2 m (hoặc kê máy, hẹn giờ) để có lời giải đủ.';

/** Dang mat ngu hanh: [mo ta hinh, loi]. */
export const HINH_Y: Readonly<Record<string, string>> = {
  Mộc: 'Dáng mặt nghiêng về hình Mộc (dài, thon): người hòa hoãn, thương người, hợp việc cần kiên nhẫn và chữ nghĩa.',
  Kim: 'Dáng mặt nghiêng về hình Kim (vuông vắn): người rõ ràng, giữ nguyên tắc, làm việc có đầu có cuối.',
  Thủy: 'Dáng mặt nghiêng về hình Thủy (tròn, ngắn): người mềm mỏng, khó đoán, nhưng lâu dài thường làm nên.',
  Hỏa: 'Dáng mặt nghiêng về hình Hỏa (trên hẹp dưới rộng): người nhanh, quyết, có uy nhưng dễ nóng.',
  Thổ: 'Dáng mặt nghiêng về hình Thổ (dày, rộng): người đôn hậu, chắc chắn, giữ được của.',
  can: 'Dáng mặt cân, không nghiêng hẳn về hình nào trong năm hình.',
};
export const HINH_NHAC = 'Máy chỉ xếp hình theo dài ngắn, rộng hẹp; màu da, xương thịt, thần khí — phần quan trọng hơn — máy không thấy.';

export const QUAN = (noi: readonly string[], kem: readonly string[]): string => (noi.length === 0 && kem.length === 0
  ? 'Bốn quan đo được (mày, mắt, mũi, miệng) đều ở mức vừa: không nét nào trội, cũng không nét nào kém.'
  : `Trong bốn quan đo được, ${noi.length === 0 ? 'chưa quan nào nổi' : `${noi.join(', ')} nổi`}${kem.length === 0 ? ''
    : `; ${kem.join(', ')} kém`}. Mỗi quan tốt được coi như thêm một quãng đời thuận${noi.length >= 2 ? ' — có hai quan trở lên là nền vững' : ''}.`);

export const TINH = {
  mat: { thap: 'Mắt dài so với mặt: sáng dạ, nhìn việc xa, dễ được tin cậy.', vua: '',
    cao: 'Mắt nhỏ so với mặt: thận trọng, kín đáo; mắt có thần (trong, sáng, nhìn vững) thì không kém ai — máy không đo được thần.' },
  anCach: {
    tot: 'Ấn đường rộng, mày cao: lòng thoáng, nghĩ rộng, ít để bụng — người dễ gần, dễ được giúp.',
    xau: 'Ấn đường hẹp, mày sát mắt: hay dồn việc vào lòng, dễ lo nghĩ — tập nói ra, chia việc cho người khác.',
    anTot: 'Ấn đường rộng: lòng thoáng, ít để bụng.', anXau: 'Ấn đường hẹp: dễ dồn nén, hay lo — nên tập buông bớt.',
    cachTot: 'Mày cao so với mắt: thông minh, rộng lượng.', cachXau: 'Mày sát mắt: dễ bị việc dồn ép, nóng vội — nên chừa khoảng thở.',
    lech: 'Ấn đường và khoảng mày – mắt đi hai hướng: lúc thoáng, lúc dồn nén — biết mình thuộc lúc nào thì điều được.',
  },
  khoang: { thap: 'Hai mắt gần (theo cách xem hiện đại, nhẹ): tập trung tốt, nhưng hay lo.', vua: '',
    cao: 'Hai mắt xa (theo cách xem hiện đại, nhẹ): rộng rãi, lạc quan, dễ tin người — nên kiểm lại trước khi tin.' },
  tran: { thap: 'Trán hẹp: tuổi trẻ phải tự lực nhiều, thành muộn mà chắc.', vua: '',
    cao: 'Trán rộng: học hành, tuổi trẻ thuận, sớm có chỗ đứng.' },
  vua: 'Các nét về tính cách đều ở mức vừa: tính cân, không thái quá bên nào.',
} as const;

/** Bang mui (hang) × mieng (cot): thap, vua, cao. */
export const TIEN: readonly (readonly string[])[] = [
  ['Mũi hẹp, miệng hẹp: tiền vào chậm và khó giữ — hợp làm công ăn lương, để dành đều đặn hơn là làm ăn lớn.',
    'Mũi hẹp: tiền vào được nhưng khó giữ — nên có khoản để dành cố định, tránh cho vay.',
    'Miệng rộng mà mũi hẹp: có lộc ăn, giao thiệp rộng, nhưng tiêu cũng nhanh — giữ tiền là việc phải học.'],
  ['Miệng hẹp: lộc ăn mỏng, ít dịp được mời mọc — bù bằng chăm chỉ, tiết kiệm.',
    'Mũi, miệng đều vừa: tiền bạc bình thường, giàu nghèo tùy sức làm.',
    'Miệng rộng: có lộc ăn, dễ có người giúp miếng cơm manh áo.'],
  ['Mũi rộng mà miệng hẹp: giữ của tốt, nhưng ít lộc từ người khác — giàu nhờ tích góp.',
    'Mũi rộng: giữ được của, tích góp dần mà nên.',
    'Mũi rộng, miệng rộng: tiền vào có lối, giữ được — tướng có của.'],
];
export const VE_GIA = {
  tot: (ten: string): string => `${ten}: của để dành, chỗ dựa về già vững.`,
  xau: (ten: string): string => `${ten}: về già nên lo trước chỗ dựa (nhà, khoản để dành).`,
} as const;

export const NHA = {
  may: { thap: 'Lông mày ngắn hơn mắt: ít nhờ anh em, việc mình tự lo là chính.', vua: '', cao: '' },
  mat: { thap: 'Mặt rộng: có của nền, đứng được trước người.', vua: '', cao: '' },
  ham: { thap: 'Hàm hẹp: ít đất cát, nhà cửa đến muộn.', vua: '', cao: 'Hàm rộng: dễ có đất, nhà cửa; về già vững.' },
  vua: 'Các nét về nhà cửa, anh em ở mức vừa: không có điều gì nổi lên.',
} as const;

export const TUOI = {
  thuan: (q: string): string => `${q}: thuận`, binh: (q: string): string => `${q}: bình thường`,
  kho: (q: string): string => `${q}: cần giữ gìn`, chua: (q: string): string => `${q}: chưa xét`,
  manh: (q: string): string => `Quãng mạnh nhất là ${q} — việc lớn nên dồn sức vào đó.`,
  yeu: (q: string): string => `Quãng ${q} nên chậm lại, giữ sức khỏe và tiền để dành.`,
  deu: 'Các quãng đời gần như nhau: không có quãng nào phải lo riêng.',
} as const;
export const QUANG = ['Tuổi trẻ (15–30, trán, ấn đường)', 'Trung niên (31–50, mày, mắt, mũi)', 'Về già (51 trở đi, miệng, cằm, hàm)'] as const;

export const NHAC = [
  'Tướng không đứng yên: ăn uống điều độ, nếp sống, lòng dạ đổi dần nét mặt và vận người — các thầy tướng nhiều nước cùng dặn '
    + 'tướng mặt không bằng tướng lòng.',
  'Máy chỉ đo tỉ lệ hình dáng từ một tấm ảnh; thần mắt, màu da, giọng nói, dáng đi — phần thầy tướng coi trọng — máy không thấy.',
  'Nhân tướng là quan niệm dân gian, không có cơ sở khoa học: đọc để biết mình, đừng dùng để đánh giá người khác, không dùng để đoán bệnh.',
] as const;
