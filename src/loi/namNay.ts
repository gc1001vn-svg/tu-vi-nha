/**
 * Nam nay voi mot nguoi: sao Cuu Dieu, 8 han, Kim Lau, Hoang Oc, Tam Tai, Thai Tue.
 * Nam xem = nam am (theo Tet) cua ngay xem; tuoi mu theo QUY_UOC muc 3; Tam Tai, Thai Tue theo chi nam sinh.
 * Nguon tung quy tac ghi tren bang; thuoc: `tests/NamNay.test.ts` (bang in san nam 2026, vai ca 2025).
 * Loi nghia do Claude soan lai theo quan niem dan gian (luat 6), mot dong moi muc.
 */
import { CHI, canChiNam, duongSangAm, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';
import { tuoiMu, type HoSo, type KetQuaHoSo } from './hoSo.ts';

export type MucDo = 'tot' | 'binh' | 'xau';
export interface Muc { readonly ten: string; readonly mucDo: MucDo; readonly nghia: string }
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

type Bang = Readonly<Record<string, readonly [MucDo, string]>>;

// Cuu Dieu: tuoi mu chia 9, nam nu hai vong khac nhau (luatminhkhue, thuvienphapluat, hoatieu).
// Tot/trung/xau: ngaydep, nongnghiepmoitruong (3 sao tot, 3 xau, 3 trung tinh).
const SAO: Bang = {
  'Thái Dương': ['tot', 'Sao tốt: công việc hanh thông, dễ gặp người giúp.'],
  'Thái Âm': ['tot', 'Sao tốt: tiền bạc khá, gia đạo yên vui.'],
  'Mộc Đức': ['tot', 'Sao tốt: hòa thuận, dễ có tin vui.'],
  'Thổ Tú': ['binh', 'Sao trung tính: dễ gặp tiểu nhân, thị phi; đi xa nên cẩn thận.'],
  'Thủy Diệu': ['binh', 'Sao trung tính: có lộc nhưng dễ thị phi; dân gian dặn tránh sông nước.'],
  'Vân Hớn': ['binh', 'Sao trung tính: dễ nóng nảy, cãi vã, kiện tụng nhỏ.'],
  'La Hầu': ['xau', 'Sao xấu, kỵ nam: dễ thị phi, kiện tụng, buồn phiền.'],
  'Kế Đô': ['xau', 'Sao xấu, kỵ nữ: dễ buồn phiền, hao tài, lục đục trong nhà.'],
  'Thái Bạch': ['xau', 'Sao xấu: dễ hao tài; nên giữ tiền, tránh đầu tư lớn.'],
};
// Phan tu thu i = tuoi mu chia 9 du i.
const SAO_NAM = ['Mộc Đức', 'La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hớn', 'Kế Đô', 'Thái Âm'];
const SAO_NU = ['Thủy Diệu', 'Kế Đô', 'Vân Hớn', 'Mộc Đức', 'Thái Âm', 'Thổ Tú', 'La Hầu', 'Thái Dương', 'Thái Bạch'];

// 8 han: dem tren ban tay, 10 tuoi nam o Huynh Tuyen, nu o Tan Tan (nu di nguoc); moi chuc sang mot cung, tuoi le dem tiep
// -> vi tri = so chuc + so don vi (phongthuyviet, dichhocungdung, bang tuoi tuvisonlong, hoatieu; khop 35 nam sinh 2026).
const HAN: Bang = {
  'Huỳnh Tuyền': ['xau', 'Dễ đau ốm, hao tài; dân gian dặn tránh sông nước.'],
  'Tam Kheo': ['xau', 'Dễ đau nhức tay chân, va quệt khi đi lại.'],
  'Ngũ Mộ': ['xau', 'Dễ hao tài, mất đồ; chi tiêu nên dè dặt.'],
  'Thiên Tinh': ['xau', 'Dễ vướng thị phi, kiện tụng; ăn uống nên cẩn thận.'],
  'Tán Tận': ['xau', 'Còn gọi Toán Tận: dễ hao tiền, bệnh lâu khỏi; đi xe nên cẩn thận.'],
  'Thiên La': ['xau', 'Dễ gặp chuyện rối rắm, phiền muộn khó gỡ.'],
  'Địa Võng': ['xau', 'Dễ vướng thị phi, chuyện giấy tờ pháp lý; nói năng nên giữ lời.'],
  'Diêm Vương': ['xau', 'Dễ có chuyện buồn, người nhà đau ốm; đi lại nên cẩn thận.'],
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
  return { ten, mucDo: m[0], nghia: m[1] };
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
