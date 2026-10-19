/**
 * Than so hoc (Pitago), cung hoang dao (Tay), nhip sinh hoc cua mot nguoi — chi dung ngay DUONG sinh (ngay ghi trong ho so).
 * Quy uoc: `docs/QUY_UOC.md` muc 1 (nam ca nhan doi ngay 01/01), bang tuy chon (`namCaNhan`, `soChuDao`).
 * Thuoc: `tests/SoHoc.test.ts`. Loi do Claude soan lai theo quan niem pho bien (luat 6), khong chep sach.
 */
import { Solar } from 'lunar-typescript';
import { soNgay, tuSoNgay, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';

export interface TuyChonSoHoc {
  /** `motLuot` (mac dinh, pho bien o VN): cong moi chu so ngay sinh mot luot, ra 2–11, 22/4, 33/6. `rutGonRieng`: rut gon ngay, thang, nam rieng roi cong, ra 1–9, 11, 22, 33. */
  readonly soChuDao?: 'motLuot' | 'rutGonRieng';
  /** `ngay0101` (mac dinh): nam ca nhan doi ngay 01/01. `sinhNhat`: doi ngay sinh nhat (thang ca nhan van theo thang duong lich). */
  readonly namCaNhan?: 'ngay0101' | 'sinhNhat';
}

export interface ThanSo {
  readonly chuDao: number; readonly nghiaChuDao: string;
  readonly ngaySinh: number; readonly nghiaNgaySinh: string;
  /** Nam dem nam ca nhan: tuy chon `sinhNhat` truoc sinh nhat thi la nam truoc. */
  readonly namXem: number;
  readonly namCaNhan: number; readonly nghiaNam: string;
  readonly thangCaNhan: number; readonly nghiaThang: string;
  /** So lan chu so 1–9 co trong ngay sinh dd/mm/yyyy (o 0 = chu so 1); so 0 khong vao luoi. */
  readonly luoi: readonly number[];
}

const NGHIA_SO: Readonly<Record<number, string>> = {
  1: 'Tự lập, quyết đoán, thích mở đường; nên tập lắng nghe người khác.',
  2: 'Tinh tế, giỏi hòa giải và hợp tác; dễ để bụng, cần tin vào mình hơn.',
  3: 'Vui vẻ, giàu ý tưởng, giỏi diễn đạt; cần bền bỉ để việc tới nơi.',
  4: 'Chắc chắn, kỷ luật, xây từng bước vững; nên mềm mỏng, bớt cứng nhắc.',
  5: 'Ưa tự do, thích đổi mới, học nhanh; cần giữ nhịp, tránh bốc đồng.',
  6: 'Trách nhiệm, chăm lo gia đình và người quanh mình; đừng ôm hết phần việc.',
  7: 'Thích tìm hiểu sâu, học qua trải nghiệm, sống nội tâm; nên mở lòng chia sẻ.',
  8: 'Thực tế, giỏi quản lý tiền bạc và công việc; cần cân bằng với đời sống tình cảm.',
  9: 'Bao dung, giàu lý tưởng, muốn giúp người; học cách buông điều đã qua.',
  10: 'Linh hoạt, tự tin, thích nghi nhanh; mang nét tự lập của số 1.',
  11: 'Số bậc thầy (nền số 2): trực giác mạnh, giàu cảm hứng; dễ căng thẳng, cần giữ cân bằng.',
  22: 'Số bậc thầy (nền số 4): tầm nhìn lớn, biến ý tưởng thành việc thật; áp lực cao.',
  33: 'Số bậc thầy (nền số 6): giàu lòng thương, hợp việc chăm sóc, dạy dỗ, chữa lành.',
};

/** Nam/thang ca nhan 1–9 (chu ky 9). */
const NGHIA_CHU_KY = [
  '',
  'Khởi đầu: hợp mở việc mới, đặt mục tiêu, tự quyết.',
  'Chậm lại, vun đắp quan hệ, hợp tác; kiên nhẫn chờ kết quả.',
  'Mở rộng giao tiếp, sáng tạo, vui vẻ; coi chừng tiêu xài, dàn trải.',
  'Làm việc chăm chỉ, xây nền, sắp xếp lại giấy tờ và sức khỏe.',
  'Thay đổi, đi lại, cơ hội mới; cân nhắc trước khi quyết vội.',
  'Lo cho gia đình, nhà cửa, trách nhiệm với người thân.',
  'Nghỉ ngơi, học hỏi, nhìn lại mình; ít hợp việc ồn ào.',
  'Thu hoạch công sức: tiền bạc, công việc, vị thế.',
  'Khép lại: dọn dẹp, buông cái cũ, chuẩn bị bắt đầu mới.',
];

const NGHIA_CUNG: Readonly<Record<string, string>> = {
  'Bạch Dương': 'Hăng hái, thẳng thắn, thích đi đầu; dễ nóng vội.',
  'Kim Ngưu': 'Kiên nhẫn, thực tế, thích ổn định và hưởng thụ; hơi bảo thủ.',
  'Song Tử': 'Lanh lợi, tò mò, giỏi giao tiếp; dễ đổi ý.',
  'Cự Giải': 'Giàu tình cảm, gắn bó gia đình, hay lo cho người khác; dễ tủi thân.',
  'Sư Tử': 'Tự tin, hào phóng, thích được ghi nhận; đôi khi sĩ diện.',
  'Xử Nữ': 'Tỉ mỉ, chu đáo, thích ngăn nắp; hay cầu toàn.',
  'Thiên Bình': 'Hòa nhã, trọng công bằng, có óc thẩm mỹ; khó ra quyết định.',
  'Thiên Yết': 'Sâu sắc, kín đáo, quyết liệt; khó tin người.',
  'Nhân Mã': 'Lạc quan, ưa tự do, thích đi xa và học hỏi; thiếu kiên nhẫn.',
  'Ma Kết': 'Chăm chỉ, kỷ luật, có chí tiến thủ; hơi khô khan.',
  'Bảo Bình': 'Độc lập, sáng tạo, nghĩ khác người; có lúc xa cách.',
  'Song Ngư': 'Mơ mộng, giàu lòng trắc ẩn, nhạy cảm; dễ xa thực tế.',
};

const lay = (bang: Readonly<Record<number, string>>, so: number): string => {
  const loi = bang[so];
  if (loi === undefined) throw new Error(`Thiếu lời cho số ${String(so)}`);
  return loi;
};

/** "22/4", "33/6" nhu cac trang VN ghi, de phan biet voi 4, 6 thuong. */
export const tenSo = (so: number): string => (so === 22 ? '22/4' : so === 33 ? '33/6' : String(so));

const chuSo = (n: number): number[] => (n < 10 ? [n] : [...chuSo(Math.floor(n / 10)), n % 10]);
const tongChuSo = (n: number): number => chuSo(n).reduce((s, c) => s + c, 0);

/** Cong chu so toi khi con 1–9 hoac gap mot so trong `giu`. */
function rutGon(n: number, giu: readonly number[] = []): number {
  let so = n;
  while (so > 9 && !giu.includes(so)) so = tongChuSo(so);
  return so;
}

const BAC_THAY = [11, 22, 33];

export function thanSo(sinh: NgayDuong, xem: NgayDuong, tc: TuyChonSoHoc = {}): ThanSo {
  const chuDao = tc.soChuDao === 'rutGonRieng'
    ? rutGon(rutGon(sinh.ngay, BAC_THAY) + rutGon(sinh.thang, BAC_THAY) + rutGon(sinh.nam, BAC_THAY), BAC_THAY)
    // Phai Pitago o VN giu 10, 11 (khong co so 1), 22, 33 chi ra tu tong dau.
    : rutGon(tongChuSo(sinh.ngay) + tongChuSo(sinh.thang) + tongChuSo(sinh.nam), [10, ...BAC_THAY]);
  const ngaySinh = rutGon(sinh.ngay, [11, 22]);
  const truocSinhNhat = xem.thang < sinh.thang || (xem.thang === sinh.thang && xem.ngay < sinh.ngay);
  const namXem = tc.namCaNhan === 'sinhNhat' && truocSinhNhat ? xem.nam - 1 : xem.nam;
  const namCaNhan = rutGon(tongChuSo(sinh.ngay) + tongChuSo(sinh.thang) + tongChuSo(namXem));
  const thangCaNhan = rutGon(namCaNhan + xem.thang);
  const tatCa = [sinh.ngay, sinh.thang, sinh.nam].flatMap(chuSo);
  return {
    chuDao, nghiaChuDao: lay(NGHIA_SO, chuDao),
    ngaySinh, nghiaNgaySinh: lay(NGHIA_SO, ngaySinh),
    namXem,
    namCaNhan, nghiaNam: lay(NGHIA_CHU_KY, namCaNhan),
    thangCaNhan, nghiaThang: lay(NGHIA_CHU_KY, thangCaNhan),
    luoi: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => tatCa.filter((c) => c === k).length),
  };
}

export interface CungHoangDao {
  readonly ten: string; readonly nghia: string;
  /** Cung ben canh khi sinh sat ngay giao cung (±1 ngay): bang moi noi lech mot ngay, moc that xe dich theo nam. */
  readonly satRanh: string | null;
}

export function cungHoangDao(d: NgayDuong): CungHoangDao {
  const cung = (x: NgayDuong): string => hv('cungHoangDao', Solar.fromYmd(x.nam, x.thang, x.ngay).getXingZuo());
  const ten = cung(d);
  const benCanh = [-1, 1].map((k) => cung(tuSoNgay(soNgay(d) + k))).find((c) => c !== ten);
  const nghia = NGHIA_CUNG[ten];
  if (nghia === undefined) throw new Error(`Thiếu lời cho cung ${ten}`);
  return { ten, nghia, satRanh: benCanh ?? null };
}

export interface Nhip {
  readonly ten: string; readonly chuKy: number; readonly yNghia: string;
  /** Lam tron 100·sin(2πt/chuKy), −100…100. */
  readonly phanTram: number;
  /** Ngay mai cao hon hom nay. */
  readonly len: boolean;
  /** Duong cong cat moc 0 trong ngay nay (t = k·chuKy/2 roi vao [t, t+1)): ngay doi dau. */
  readonly nguy: boolean;
}

const NHIP = [['Thể chất', 23, 'sức khỏe, sức bền'], ['Cảm xúc', 28, 'tâm trạng, quan hệ'], ['Trí tuệ', 33, 'tập trung, suy nghĩ']] as const;

export function nhipSinhHoc(sinh: NgayDuong, xem: NgayDuong): { readonly ngay: number; readonly nhip: readonly Nhip[] } {
  const t = soNgay(xem) - soNgay(sinh);
  if (t < 0) throw new Error('Ngày xem trước ngày sinh');
  return {
    ngay: t,
    nhip: NHIP.map(([ten, chuKy, yNghia]) => {
      const p = t % chuKy;
      const sin = (x: number): number => Math.sin((2 * Math.PI * x) / chuKy);
      return { ten, chuKy, yNghia, phanTram: Math.round(100 * sin(p)), len: sin(p + 1) > sin(p), nguy: p === 0 || p === Math.floor(chuKy / 2) };
    }),
  };
}
