/**
 * Nam nay voi mot nguoi: sao Cuu Dieu, 8 han, Kim Lau, Hoang Oc, Tam Tai, Thai Tue.
 * Nam xem = nam am (theo Tet) cua ngay xem; tuoi mu theo QUY_UOC muc 3; Tam Tai, Thai Tue theo chi nam sinh.
 * Nguon tung quy tac ghi tren bang; thuoc: `tests/NamNay.test.ts` (bang in san nam 2026, vai ca 2025).
 * Loi nghia do Claude soan lai theo quan niem dan gian (luat 6): mot dong moi muc; sao, han them mot doan `giai`.
 * Thang ky, ngay cung trong `giai` chi ghi khi >=2 trang dan gian khop (tra 20/10: hoatieu, bachhoaxanh, dienmayxanh,
 * docungtamlinh, didongviet, thuvienphapluat, vietlac, muaban); trang ghi khac nhau thi bo.
 * Doi chieu (tra 20/10, QUY_UOC muc 14): vong sao nam trung 9/9 bang hanh nien Cuu Dieu cua hai kinh Mat tong doi Duong
 * (Dai Chinh tang so 1308, 1311 — ban XML CBETA) va bang chua Nhat; kinh khong co vong rieng cho nu.
 */
import { CHI, canChiNam, duongSangAm, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';
import { tuoiMu, type HoSo, type KetQuaHoSo } from './hoSo.ts';

export type MucDo = 'tot' | 'binh' | 'xau';
export interface Muc { readonly ten: string; readonly mucDo: MucDo; readonly nghia: string; readonly giai?: string }
export interface NamNay {
  readonly namAm: number;
  readonly canChi: string;
  readonly tuoiMu: number;
  readonly sao: Muc;
  readonly han: Muc;
  readonly kimLau: Muc;
  readonly hoangOc: Muc;
  readonly tamTai: Muc;
  readonly thaiTue: Muc;
}
/** Cach dem Hoang Oc khi qua chuc (QUY_UOC bang tuy chon `hoangOc`), mac dinh `theoChuc`. */
export interface TuyChonNamNay { readonly hoangOc?: 'theoChuc' | 'demTiep' }

type Bang = Readonly<Record<string, readonly [MucDo, string, string?]>>;

// Cuu Dieu: tuoi mu chia 9, nam nu hai vong khac nhau (luatminhkhue, thuvienphapluat, hoatieu).
// Tot/trung/xau: ngaydep, nongnghiepmoitruong (3 sao tot, 3 xau, 3 trung tinh); hai kinh goc xep khac — NGUON_SAO_HAN.
const SAO: Bang = {
  'Thái Dương': ['tot', 'Sao tốt: công việc hanh thông, dễ gặp người giúp.',
    'Sao tốt, ứng với Mặt Trời: năm có sao này chiếu thường hanh thông về công việc, danh tiếng, dễ gặp người giúp; hợp mở rộng '
    + 'việc làm ăn, nhận trách nhiệm mới. Các trang dân gian ghi tháng Sáu và tháng Mười âm là hai tháng tốt nhất. '
    + 'Dân gian thường cúng giải hạn sao này ngày 27 âm lịch hằng tháng.'],
  'Thái Âm': ['tot', 'Sao tốt: tiền bạc khá, gia đạo yên vui.',
    'Sao tốt, ứng với Mặt Trăng: năm có sao này chiếu thường khá về tiền bạc, nhà cửa, gia đạo êm ấm; hợp tích lũy, sửa sang nhà. '
    + 'Dân gian ghi tháng Chín âm là tháng tốt; đa số trang ghi kỵ tháng Mười Một (vài trang ghi tháng Mười). '
    + 'Thường cúng giải hạn ngày 26 âm lịch hằng tháng.'],
  'Mộc Đức': ['tot', 'Sao tốt: hòa thuận, dễ có tin vui.',
    'Sao tốt, ứng với sao Mộc: năm có sao này chiếu thường hòa thuận, dễ có tin vui như cưới hỏi, thêm người, công việc êm. '
    + 'Nên giữ cái hòa, tránh nóng nảy làm hỏng việc tốt. Ngày cúng sao này các trang ghi khác nhau nên app không ghi.'],
  'Thổ Tú': ['binh', 'Sao trung tính: dễ gặp tiểu nhân, thị phi; đi xa nên cẩn thận.',
    'Sao trung tính, ứng với sao Thổ: dễ gặp tiểu nhân, thị phi, chuyện trong nhà lục đục; đi xa, làm ăn với người lạ nên '
    + 'kỹ giấy tờ. Không phải sao dữ, giữ lời ăn tiếng nói là qua. Thường cúng giải hạn ngày 19 âm lịch hằng tháng.'],
  'Thủy Diệu': ['binh', 'Sao trung tính: có lộc nhưng dễ thị phi; dân gian dặn tránh sông nước.',
    'Sao trung tính, ứng với sao Thủy: có lộc, nhất là việc buôn bán, đi lại, nhưng dễ thị phi vì lời nói. Dân gian dặn tránh '
    + 'sông nước, nhất là tháng Tư và tháng Tám âm. Thường cúng giải hạn ngày 21 âm lịch hằng tháng. Nhiều trang gọi đây là '
    + 'sao phúc lộc, xếp vào nhóm tốt; app theo cách chia ba sao tốt, ba sao xấu, ba sao trung tính.'],
  'Vân Hớn': ['binh', 'Sao trung tính: dễ nóng nảy, cãi vã, kiện tụng nhỏ.',
    'Sao trung tính hơi xấu, ứng với sao Hỏa: dễ nóng nảy, cãi vã, kiện tụng nhỏ, ốm vặt; làm ăn ở mức vừa. Đa số trang ghi '
    + 'tháng Hai và tháng Tám âm là xấu nhất. Nên nhịn một câu, tránh tranh chấp; ngày cúng các trang ghi khác nhau.'],
  'La Hầu': ['xau', 'Sao xấu, kỵ nam: dễ thị phi, kiện tụng, buồn phiền.',
    'Sao xấu: hay mang chuyện lời qua tiếng lại, thị phi, kiện tụng, buồn phiền; nam gặp nặng hơn nữ. '
    + 'Các trang dân gian ghi kỵ nhất tháng Giêng và tháng Bảy âm. Nên giữ lời nói, đọc kỹ giấy tờ trước khi ký. '
    + 'Thường cúng giải hạn ngày 8 âm lịch hằng tháng.'],
  'Kế Đô': ['xau', 'Sao xấu, kỵ nữ: dễ buồn phiền, hao tài, lục đục trong nhà.',
    'Sao xấu, cặp với La Hầu: hay mang chuyện buồn phiền, hao tiền, trong nhà lục đục; nữ gặp nặng hơn nam. Dân gian ghi kỵ tháng Ba '
    + 'và tháng Chín âm. Nên chi tiêu dè dặt, giữ hòa khí trong nhà. Thường cúng giải hạn ngày 18 âm lịch hằng tháng.'],
  'Thái Bạch': ['xau', 'Sao xấu: dễ hao tài; nên giữ tiền, tránh đầu tư lớn.',
    'Sao xấu, ứng với sao Kim: hay làm hao tiền, gặp kẻ xấu, ốm vặt — câu cửa miệng là "Thái Bạch quét sạch cửa nhà". Kỵ nhất tháng '
    + 'Năm âm; nhiều trang kể thêm tháng Hai, tháng Tám. Nên giữ tiền, tránh cho vay, đầu tư lớn. Thường cúng giải hạn ngày 15 '
    + 'âm lịch hằng tháng.'],
};
/** Hien duoi doan giai sao han (tra 20/10: kinh 1308, 1311, chua Nhat, Giao duc 2019, baovanhoa, sggp — QUY_UOC W43, W45). */
export const NGUON_SAO_HAN = 'Về nguồn: bảng sao theo tuổi có từ hai kinh Mật tông đời Đường trong Đại Chính tạng (số 1308 '
  + 'và 1311): vòng sao của nam trong app trùng đủ 9 tuổi với kinh, các chùa Nhật Bản vẫn dùng bảng này trong lễ cúng sao đầu '
  + 'năm. Kinh chỉ có một vòng chung, không có vòng riêng cho nữ (vòng nữ chưa thấy nguồn ngoài Việt Nam); kinh 1308 ghi La Hầu, '
  + 'Thổ Tú nặng với nam, Kế Đô, Vân Hớn nặng với nữ. Hai kinh xếp Thổ Tú, Vân Hớn là sao xấu, Thủy Diệu là sao tốt — khác cách '
  + 'chia ba tốt, ba xấu, ba trung tính của dân gian ta mà app theo. Thích Nhật Từ (Học viện Phật giáo Việt Nam) và Thứ trưởng Bộ '
  + 'Văn hóa, Thể thao và Du lịch nói giáo lý nhà Phật không có sao tốt, sao xấu; năm 2019 Bộ đề nghị không để việc dâng sao '
  + 'giải hạn biến tướng thành dịch vụ trục lợi.';

// Phan tu thu i = tuoi mu chia 9 du i.
const SAO_NAM = ['Mộc Đức', 'La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hớn', 'Kế Đô', 'Thái Âm'];
const SAO_NU = ['Thủy Diệu', 'Kế Đô', 'Vân Hớn', 'Mộc Đức', 'Thái Âm', 'Thổ Tú', 'La Hầu', 'Thái Dương', 'Thái Bạch'];

// 8 han: dem tren ban tay, 10 tuoi nam o Huynh Tuyen, nu o Tan Tan (nu di nguoc); moi chuc sang mot cung, tuoi le dem tiep
// -> vi tri = so chuc + so don vi (phongthuyviet, dichhocungdung, bang tuoi tuvisonlong, hoatieu; khop 35 nam sinh 2026).
const HAN: Bang = {
  'Huỳnh Tuyền': ['xau', 'Dễ đau ốm, hao tài; dân gian dặn tránh sông nước.',
    'Hạn xấu, nghĩa đen là "suối vàng": dễ đau ốm nặng, hao tài, việc lớn khó thành. Nên giữ sức khỏe, đi khám định kỳ, '
    + 'tránh sông nước và những việc liều.'],
  'Tam Kheo': ['xau', 'Dễ đau nhức tay chân, va quệt khi đi lại.',
    'Hạn xấu nhẹ: dễ đau nhức tay chân, va quệt khi đi lại. Nên cẩn thận khi lái xe, leo trèo, mang vác nặng.'],
  'Ngũ Mộ': ['xau', 'Dễ hao tài, mất đồ; chi tiêu nên dè dặt.',
    'Hạn xấu về tiền: dễ hao tài, mất đồ, tiền ra nhiều hơn vào. Nên chi tiêu dè dặt, cất giữ giấy tờ, tài sản cẩn thận.'],
  'Thiên Tinh': ['xau', 'Dễ vướng thị phi, kiện tụng; ăn uống nên cẩn thận.',
    'Hạn xấu về thị phi: dễ vướng kiện tụng, tranh chấp, bị nói xấu; dân gian dặn cẩn thận ăn uống. Nên giữ lời, '
    + 'tránh đứng ra bảo lãnh cho người khác.'],
  'Tán Tận': ['xau', 'Còn gọi Toán Tận: dễ hao tiền, bệnh lâu khỏi; đi xe nên cẩn thận.',
    'Còn gọi Toán Tận: dễ hao tiền, bệnh lâu khỏi, việc dở dang. Nên giữ sức khỏe, đi xe cẩn thận, chưa vội làm ăn lớn.'],
  'Thiên La': ['xau', 'Dễ gặp chuyện rối rắm, phiền muộn khó gỡ.',
    'Hạn "lưới trời": dễ gặp chuyện rối rắm, phiền muộn, đầu óc căng thẳng, khó gỡ. Nên làm từng việc một, nghỉ ngơi đủ.'],
  'Địa Võng': ['xau', 'Dễ vướng thị phi, chuyện giấy tờ pháp lý; nói năng nên giữ lời.',
    'Hạn "lưới đất": dễ vướng thị phi, giấy tờ pháp lý, tai tiếng. Nên giữ lời, làm đúng thủ tục, tránh việc mờ ám.'],
  'Diêm Vương': ['xau', 'Dễ có chuyện buồn, người nhà đau ốm; đi lại nên cẩn thận.',
    'Hạn xấu về chuyện buồn: dễ có tin buồn, người nhà đau ốm, xa nhà gặp chuyện. Nên thăm hỏi người thân, đi lại cẩn thận.'],
};
// Phan tu thu i = (so chuc + so don vi) chia 8 du i.
const HAN_NAM = ['Diêm Vương', 'Huỳnh Tuyền', 'Tam Kheo', 'Ngũ Mộ', 'Thiên Tinh', 'Tán Tận', 'Thiên La', 'Địa Võng'];
const HAN_NU = ['Thiên La', 'Tán Tận', 'Thiên Tinh', 'Ngũ Mộ', 'Tam Kheo', 'Huỳnh Tuyền', 'Diêm Vương', 'Địa Võng'];

// Kim Lau: tuoi mu chia 9 du 1, 3, 6, 8 (dienmayxanh, hoatieu, fptshop). Cach "cong chu so toi mot chu so" ra cung so du
// (10 chia 9 du 1) nen khong can tuy chon — thuoc kiem lai 1..120.
const KIM_LAU: Readonly<Record<number, readonly [string, string]>> = {
  1: ['Kim Lâu Thân', 'hại bản thân'],
  3: ['Kim Lâu Thê', 'hại vợ'],
  6: ['Kim Lâu Tử', 'hại con'],
  8: ['Kim Lâu Lục Súc', 'hại vật nuôi, làm ăn'],
};

// Hoang Oc: 10 tuoi Nhat Cat, 20 Nhi Nghi… moi chuc sang mot cung, tuoi le dem tiep (dienmayxanh "ban tay", nhadepktv,
// homedy, radanhadat). Tuy chon `demTiep`: dem lien tu 10 tuoi, khong ve cung cua chuc (vinhomes, mot bang mogi).
const HOANG_OC: Bang = {
  'Nhất Cát': ['tot', 'Cung tốt: làm nhà được yên ổn.'],
  'Nhì Nghi': ['tot', 'Cung tốt: làm nhà dễ có lộc.'],
  'Tam Địa Sát': ['xau', 'Cung xấu: dân gian kiêng làm nhà, sợ đau ốm.'],
  'Tứ Tấn Tài': ['tot', 'Cung tốt: làm nhà thêm tài lộc.'],
  'Ngũ Thọ Tử': ['xau', 'Cung xấu: dân gian kiêng làm nhà, sợ chuyện tang chế.'],
  'Lục Hoang Ốc': ['xau', 'Cung xấu: dân gian kiêng làm nhà, sợ nhà vắng, việc khó thành.'],
};
// Phan tu thu i = vi tri chia 6 du i.
const HOANG_OC_TEN = ['Lục Hoang Ốc', 'Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử'];

// Tam Tai: nhom tam hop cua chi nam sinh gap 3 nam lien, bat dau tu chi xung voi chi dau nhom (luatminhkhue, hoatieu,
// wiki.batdongsan). Theo chi chia 4: Ty/Thin/Than -> Dan, Suu/Ty/Dau -> Hoi, Dan/Ngo/Tuat -> Than, Mao/Mui/Hoi -> Ty.
const TAM_TAI_DAU = [2, 11, 8, 5];

// Thai Tue: chi nam sinh so chi nam xem (soha, kenh14, lichngaytot; tvbs, hk01 cho 2025, 2026).
// Tam hinh Dan–Ty–Than, Suu–Tuat–Mui, tuong hinh Ty–Mao; tu hinh Thin, Ngo, Dau, Hoi.
const HINH = [[2, 5, 8], [1, 7, 10], [0, 3]];
const TU_HINH = [4, 6, 9, 11];
function thaiTue(b: number, y: number): readonly (readonly [string, string])[] {
  const hinh = b === y ? TU_HINH.includes(b) : HINH.some((g) => g.includes(b) && g.includes(y));
  const co: readonly (readonly [boolean, string, string])[] = [
    [b === y, 'Trị Thái Tuế', 'năm tuổi, dễ biến động'],
    [(b - y + 12) % 12 === 6, 'Xung Thái Tuế', 'dễ thay đổi lớn, hao tổn'],
    [hinh, 'Hình Thái Tuế', 'dễ thị phi, kiện tụng'],
    [(b + y) % 12 === 7, 'Hại Thái Tuế', 'dễ gặp tiểu nhân'],
    [(y % 2 === 0 ? y + 9 : y + 3) % 12 === b, 'Phá Thái Tuế', 'dễ đổ vỡ quan hệ, hao tài'],
  ];
  return co.filter(([phai]) => phai).map(([, ten, nghia]) => [ten, nghia]);
}

const tenChi = (c: number): string => hv('chi', CHI.charAt(c % 12));

function tra(bang: Bang, ten: string | undefined): Muc {
  const m = ten === undefined ? undefined : bang[ten];
  if (ten === undefined || m === undefined) throw new Error(`Bảng năm nay thiếu "${String(ten)}"`);
  return { ten, mucDo: m[0], nghia: m[1], ...(m[2] === undefined ? {} : { giai: m[2] }) };
}

const CHUA_XET: Muc = { ten: 'Chưa xét', mucDo: 'binh', nghia: 'Các bảng bắt đầu đếm từ 10 tuổi mụ.' };

export function namNay(hs: HoSo, kq: KetQuaHoSo, ngayXem: NgayDuong, tc: TuyChonNamNay = {}): NamNay {
  const namAm = duongSangAm(ngayXem).nam;
  const n = tuoiMu(kq.am.nam, ngayXem);
  if (n < 1) throw new Error('Ngày xem trước năm sinh');
  const nam = hs.gioiTinh === 'nam';
  // Ban tay: moi chuc sang mot cung, tuoi le dem tiep tu cung cua chuc.
  const viTri = Math.floor(n / 10) + (n % 10);
  const kl = KIM_LAU[n % 9];
  const kimLau: Muc = kl === undefined ? { ten: 'Không phạm', mucDo: 'tot', nghia: 'Không phạm Kim Lâu.' }
    : { ten: kl[0], mucDo: 'xau', nghia: `Dân gian kiêng làm nhà (tuổi gia chủ), cưới hỏi (tuổi cô dâu): sợ ${kl[1]}.` };
  const yChi = (namAm + 8) % 12;
  const dau = TAM_TAI_DAU[kq.chiNam % 4] ?? 0;
  const thu = (yChi - dau + 12) % 12;
  const tt = thaiTue(kq.chiNam, yChi);

  return {
    namAm,
    canChi: canChiNam(namAm),
    tuoiMu: n,
    sao: tra(SAO, (nam ? SAO_NAM : SAO_NU)[n % 9]),
    han: n < 10 ? CHUA_XET : tra(HAN, (nam ? HAN_NAM : HAN_NU)[viTri % 8]),
    kimLau: n < 10 ? CHUA_XET : kimLau,
    hoangOc: n < 10 ? CHUA_XET : tra(HOANG_OC, HOANG_OC_TEN[(tc.hoangOc === 'demTiep' ? n - 9 : viTri) % 6]),
    tamTai: thu < 3
      ? { ten: `Năm thứ ${String(thu + 1)}/3`, mucDo: 'xau', nghia: 'Dân gian kiêng việc lớn: làm nhà, cưới hỏi, khởi sự làm ăn.' }
      : { ten: 'Không phạm', mucDo: 'tot', nghia: `Tuổi ${tenChi(kq.chiNam)} gặp Tam Tai các năm ${[0, 1, 2].map((i) => tenChi(dau + i)).join(', ')}.` },
    thaiTue: tt.length === 0
      ? { ten: 'Không phạm', mucDo: 'tot', nghia: `Năm ${tenChi(yChi)} không trùng, xung, hình, hại, phá tuổi ${tenChi(kq.chiNam)}.` }
      : { ten: tt.map(([ten]) => ten).join(', '), mucDo: 'xau', nghia: `Dân gian cho là ${tt.map(([, nghia]) => nghia).join('; ')}.` },
  };
}
