/**
 * Loi luan chi tay (`chiTayLuan.ts`), Claude soan moi (luat 6): khong ke sach, khong chep cau sach. Nguon da doc va ly do chot tung
 * cho venh: `docs/LUAN_CHI_TAY.md` (nguon chi tiet, nguyen van: QUY_UOC muc 27).
 */

/** Nhan chot tung o: diem (+ tot, − kem, 0 trung tinh / cac nen venh) va cau tom. */
export interface OChot { readonly d: number; readonly y: string }
type Bang = Readonly<Record<string, Readonly<Record<string, OChot>>>>;

const RO = (ten: string, tot: string, kem: string): Readonly<Record<string, OChot>> => ({
  clear: { d: 1, y: `${ten} rõ, sâu — ${tot}` }, faint: { d: -1, y: `${ten} mờ, nông — ${kem}` },
  none: { d: 0, y: `chưa thấy ${ten} — gập nhẹ bàn tay, nhìn dưới đèn rồi chọn lại` },
});
const DUT = (tot: string, kem: string, dKem = -1): Readonly<Record<string, OChot>> => ({
  true: { d: dKem, y: kem }, false: { d: 0, y: tot },
});

export const O: Readonly<Record<'life' | 'head' | 'heart' | 'fate', Bang>> = {
  life: {
    seen: RO('đường đời', 'sức bền tốt', 'sức bền kém hơn'),
    length: { long: { d: 1, y: 'đường đời dài — dẻo dai, bền sức' }, medium: { d: 0, y: 'đường đời dài vừa' },
      short: { d: -0.5, y: 'đường đời ngắn — cần giữ sức, không phải điềm thọ yểu' } },
    arc: { wide: { d: 0, y: 'vòng rộng — ấm áp, nhiều sinh lực' }, narrow: { d: 0, y: 'ôm sát ngón cái — kín đáo, giữ sức' } },
    broken: DUT('đường đời liền', 'đường đời có chỗ đứt — có quãng phải nghỉ lấy sức'),
  },
  head: {
    seen: RO('đường trí', 'đầu óc sắc, chí bền', 'chí hướng dễ lung lay'),
    length: { long: { d: 1, y: 'đường trí dài — nghĩ xa, trí lực dồi dào' }, medium: { d: 0, y: 'đường trí dài vừa' },
      short: { d: -0.5, y: 'đường trí ngắn — nghĩ nhanh, làm gọn, ít bàn xa' } },
    shape: { straight: { d: 0, y: 'đường trí thẳng — thực tế, rõ ràng' }, curved: { d: 0, y: 'đường trí cong xuống — giàu tưởng tượng' } },
    joined: { true: { d: 0, y: 'đầu dính đường đời — thận trọng, nghĩ kỹ' }, false: { d: 0, y: 'đầu tách đường đời — tự lập, dám làm' } },
    broken: DUT('đường trí liền', 'đường trí có chỗ đứt — lúc hăng lúc nản, việc dễ dở dang'),
  },
  heart: {
    seen: RO('đường tình', 'tình cảm sâu, bền', 'tình cảm nhạt, khó bày tỏ'),
    length: { long: { d: 0.5, y: 'đường tình dài tới ngón trỏ — thương người, giàu lý tưởng' },
      medium: { d: 0, y: 'đường tình tới khe trỏ – giữa — tình cảm cân bằng' },
      short: { d: -0.5, y: 'đường tình ngắn — tình cảm ít lộ ra' } },
    broken: DUT('đường tình liền', 'đường tình có chỗ đứt — có trắc trở trong tình cảm'),
  },
  fate: {
    seen: { clear: { d: 1, y: 'đường sự nghiệp rõ — công việc có hướng, dễ thành' },
      faint: { d: 0, y: 'đường sự nghiệp mờ — thành nhờ sức mình hơn nhờ vận' },
      none: { d: 0, y: 'không có đường sự nghiệp — tự chọn lối đi, như rất nhiều người' } },
    start: { wrist: { d: 1, y: 'mọc từ cổ tay — tay trắng dựng nghiệp' }, life: { d: 0, y: 'tách từ đường đời — tuổi trẻ gắn với gia đình' },
      middle: { d: 0, y: 'mọc giữa lòng tay — phát từ giữa đời' } },
    broken: DUT('đường sự nghiệp liền — đi một đường bền', 'đường sự nghiệp có chỗ đứt — có lần đổi hướng', -0.5),
  },
};
export const NGANG: Readonly<Record<'true' | 'false', OChot>> = {
  true: { d: 0, y: 'có — ý chí dồn một hướng' }, false: { d: 0, y: 'không — trí, tình tách riêng như phần đông' },
};

export const KET = {
  thuan: 'Kết: bàn tay thuận — nét rõ, liền nhiều hơn nét mờ, đứt; nền sẵn có tốt, cứ thế mà đi.',
  vua: 'Kết: bàn tay bình thường — có đường mạnh, có đường yếu; phần lớn nằm ở cách sống.',
  kho: 'Kết: bàn tay cần tự bồi đắp — vài đường mờ hoặc đứt đi cùng nhau; làm chậm, chắc, giữ sức là bù được.',
} as const;
export const CHUA_DU = 'Chưa chọn đủ ô để luận cả bàn tay: chọn ít nhất độ rõ của đường đời, đường trí, đường tình (hoặc dùng ảnh để máy điền sẵn).';

export const NEN_CHUNG = {
  sach: 'Ba đường chính rõ và liền — nền tốt mà các sách nhiều nước cùng khen.',
  mo: (ds: string): string => `Mờ: ${ds} — phần đó nên bồi thêm bằng sức mình, đừng trông vào vận.`,
  dut: (ds: string): string => `Đứt: ${ds} — đời có quãng gián đoạn, làm lại được; chỗ đứt không báo trước điều gì cụ thể.`,
};
export const NGANG_Y = 'Có chỉ tay ngang (trí và tình nhập một): người dồn hết sức vào một hướng, làm tới cùng — việc hợp thì nên lớn, việc '
  + 'không hợp dễ cực đoan, cố chấp. Các nước đọc đường này trái ngược nhau (có nơi rất khen, có nơi rất chê) nên app không chấm tốt '
  + 'xấu, chỉ giữ điểm chung: ý chí mạnh, nên có người góp ý.';

/** Duong tri: [dang][dinh]: dang thang/cong × dau dinh/tach. */
export const TRI: Readonly<Record<'straight' | 'curved', Readonly<Record<'true' | 'false', string>>>> = {
  straight: {
    true: 'Đường trí thẳng, đầu dính đường đời: thực tế, nghĩ kỹ trước khi làm — chắc chắn nhưng đôi khi chậm quyết.',
    false: 'Đường trí thẳng, đầu tách đường đời: thực tế mà dám làm, quyết nhanh — nên soát lại trước việc lớn.',
  },
  curved: {
    true: 'Đường trí cong xuống, đầu dính đường đời: giàu tưởng tượng, nhạy cảm, hay lo xa — hợp việc sáng tạo, cần người vững bên cạnh.',
    false: 'Đường trí cong xuống, đầu tách đường đời: giàu ý tưởng, thích tự do, theo cảm hứng — hợp việc sáng tạo, cần kỷ luật.',
  },
};
export const TRI_MOT = {
  straight: 'Đường trí thẳng: thực tế, rõ ràng, thích việc có số liệu.', curved: 'Đường trí cong xuống: giàu tưởng tượng, hợp việc sáng tạo.',
  true: 'Đầu đường trí dính đường đời: thận trọng, nghĩ kỹ trước khi làm.', false: 'Đầu đường trí tách đường đời: tự lập, dám làm, quyết nhanh.',
} as const;
export const TRI_SUC = {
  manh: 'Đường trí rõ và dài: đầu óc là vốn chính — học, nghĩ, lập kế hoạch đều có lợi.',
  yeu: 'Đường trí mờ hoặc ngắn: nên chọn việc làm bằng tay chân, kinh nghiệm hơn việc dựa vào bàn tính xa.',
} as const;
export const DOI_VONG = { wide: 'Đường đời vòng rộng: ấm áp, ham sống, thích có người xung quanh.',
  narrow: 'Đường đời ôm sát ngón cái: kín đáo, giữ sức, cần thời gian riêng.' } as const;

/** Duong su nghiep: theo diem dau, roi do ro. */
export const NGHIEP = {
  wrist: 'Đường sự nghiệp mọc từ cổ tay: tự lập sớm, tay trắng dựng nghiệp — hợp tự làm chủ hoặc con đường dài một hướng.',
  life: 'Đường sự nghiệp tách từ đường đời: tuổi trẻ gắn với gia đình — được nhờ cha mẹ, họ hàng, nhưng cũng bị ràng buộc; tự đứng '
    + 'được thì đường mới mở.',
  middle: 'Đường sự nghiệp mọc giữa lòng tay: thuở đầu vất vả, việc thành từ quãng giữa đời — đừng nản khi chưa thấy kết quả sớm.',
  ro: 'Nét rõ: công việc có hướng, dễ được việc.', mo: 'Nét mờ: thành nhờ sức mình hơn nhờ thời vận.',
  khong: 'Không có đường sự nghiệp — rất nhiều người như vậy: không theo một lối định sẵn, tự chọn đường, đời ít biến động lớn; tiền '
    + 'bạc đến từ sự đều đặn.',
  dut: 'Có chỗ đứt: sẽ có lần đổi nghề, đổi hướng — chuẩn bị trước thì chỗ đổi thành bước lên.',
  chua: 'Chưa chọn đường sự nghiệp.',
} as const;

export const TINH = {
  ro: 'Đường tình rõ: thương ai thì sâu và bền.', mo: 'Đường tình mờ: tình cảm nhạt bề ngoài, khó nói ra — người gần cần hiểu điều đó.',
  long: 'Dài tới dưới ngón trỏ: giàu lý tưởng, thương người, đặt nhiều kỳ vọng vào người mình thương.',
  medium: 'Tới khe ngón trỏ – ngón giữa: tình cảm cân bằng, điềm tĩnh mà sâu.',
  short: 'Ngắn, dừng dưới ngón giữa: tình cảm ít lộ ra, dễ nghĩ cho mình trước — chủ động quan tâm sẽ giữ được người.',
  dut: 'Có chỗ đứt: tình cảm có trắc trở, có lúc xa cách — biết nhường thì nối lại được.',
  khong: 'Chưa thấy đường tình riêng — nếu đường trên cùng chạy suốt bàn tay thì đó là chỉ tay ngang.',
  giaDinh: 'Đường sự nghiệp tách từ đường đời cũng cho thấy gia đình gốc ảnh hưởng lớn tới các quyết định.',
  chua: 'Chưa chọn đường tình.',
} as const;

export const SUC = {
  ro: 'Đường đời rõ: sức bền tốt, chịu được việc nặng.', mo: 'Đường đời mờ: sức bền kém hơn — ngủ đủ, ăn đều, vận động nhẹ hằng ngày.',
  long: 'Đường đời dài: dẻo dai, hồi sức nhanh.', short: 'Đường đời ngắn: sức có hạn, đừng làm quá sức kéo dài.',
  dut: 'Có chỗ đứt: có một quãng sức khỏe hoặc nếp sống bị gián đoạn — giữ thói quen tốt từ sớm.',
  khong: 'Chưa thấy đường đời — ai cũng có đường này, nên nhìn lại.',
  nhac: 'Đường đời không báo tuổi thọ, không báo bệnh: muốn biết sức khỏe thì đi khám.',
  chua: 'Chưa chọn đường đời.',
} as const;

export const GIAI_DOAN = {
  wrist: 'Tuổi trẻ: tự lập sớm, phải tự lo nhiều — bù lại vững từ sớm.',
  life: 'Tuổi trẻ: sống trong vòng gia đình; giữa đời mới tách ra tự đứng.',
  middle: 'Tuổi trẻ: vất vả, thử nhiều việc; giữa đời: việc bắt đầu thành.',
  none: 'Không có mốc sự nghiệp rõ: các quãng đời đều đều, mỗi quãng tự dựng.',
  fateDut: 'Giữa chừng có lần đổi hướng công việc.',
  lifeDut: 'Có một quãng phải chậm lại, lấy sức.',
  khongDut: 'Không có chỗ đứt nào ở đường đời, đường sự nghiệp: đường đời đi khá liền mạch.',
  chua: 'Chưa đủ ô (đường sự nghiệp) để chia các quãng đời.',
} as const;

export const NHAC = [
  'Chỉ tay đổi theo năm tháng: sách tướng tay Tây kể đường mọc thêm sau một năm; các nước cùng dặn xem cả nếp sống, không xem riêng một '
    + 'đường. Nam xem tay trái, nữ tay phải theo tục Việt; muốn chắc thì xem cả hai tay.',
  'Máy và ô tự chọn chỉ nói hình dáng bốn đường; gò tay, ngón tay, màu da — phần thầy tướng tay coi trọng — app không xét.',
  'Chỉ tay là quan niệm dân gian, chưa có nghiên cứu nào cho thấy đường chỉ tay báo trước tính cách hay vận mệnh: đọc để biết mình, '
    + 'đừng dùng để quyết việc lớn, không dùng để đoán bệnh.',
] as const;
