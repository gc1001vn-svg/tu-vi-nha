/**
 * Tu vi: lap la so 12 cung tu ngay, thang, nam am + chi gio + gioi tinh.
 *
 * CHEP logic an sao cua `ansaotuvi` 0.1.28 (Python, MIT) sang TypeScript: `App.lapDiaBan`, `DiaBan` (cung chu, dai han,
 * tieu han, do sang sao), `AmDuong` (cuc, Tu Vi, Trang Sinh, Hoa Linh, Khoi Viet, Quan Phuc, Co Than, Thien Ma,
 * Pha Toai, Tuan Triet, Luu Ha Thien Tru), `Sao` (bang sao), `ThienBan` (menh chu, than chu).
 *   Nguon: https://pypi.org/project/ansaotuvi/0.1.28/ · https://github.com/hieudo-ursa/ansaotuvi
 *   Tac gia goi: hieu.do <hieu.do@ursa.vn>; ma goc ghi "(c) 2016 doanguyen <dungnv2410@gmail.com>".
 * So cung giu dung nhu ma Python (1 = Ty … 12 = Hoi) de chep khong lech; ra ngoai doi ve chi 0 = Ty.
 * Cho `ansaotuvi` khac Altuvi (chuan cuoi — CLAUDE.md luat 3) → tuy chon `phaiTuVi`, mac dinh 'altuvi' (`docs/NGUON_MO.md`).
 * Thuoc: `tests/TuVi.test.ts` (5 la Altuvi, ~200 la vang `ansaotuvi`), `scripts/doi-chieu/so-tu-vi.mjs` (3.000 la).
 *
 * Giay phep cua ma goc (nguyen van):
 *   MIT License
 *
 *   Copyright (c) 2018 The Python Packaging Authority
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
import { CAN, CHI, duongSangAm, type NgayDuong } from '../amLich.ts';
import { hv } from '../hanViet/index.ts';
import type { GioiTinh, HoSo, KetQuaHoSo } from '../hoSo.ts';

/** 'altuvi': 4 cho theo Altuvi (Thien Giai, Pha Toai, Hoa/Linh Tinh, nam Canh) + menh chu theo cung Menh; 'ansaotuvi': y nguyen thu vien. */
export type PhaiTuVi = 'altuvi' | 'ansaotuvi';
/** Mieu, Vuong, Dac, Binh, Ham. */
export type DoSang = 'M' | 'V' | 'Đ' | 'B' | 'H';

export interface DauVaoLaSo {
  /** Ngay, thang, nam AM (nam theo Tet). Thang nhuan: dua so cua thang truoc, vd 2 nhuan → 2 (QUY_UOC muc 5). */
  readonly ngay: number;
  readonly thang: number;
  readonly nam: number;
  /** 0 = Ty … 11 = Hoi. */
  readonly chiGio: number;
  readonly gioiTinh: GioiTinh;
  /** Nam am dang xem (theo Tet): tuoi mu, dai van, tieu han. */
  readonly namXem: number;
  readonly phaiTuVi?: PhaiTuVi;
  /** Menh chu (chi ap cho phai 'altuvi'): 'cungMenh' theo chi cung Menh (Toan Thu, mac dinh) · 'tuoi' theo chi nam (Quan Xuan Thinh 1950). */
  readonly menhChuTheo?: 'cungMenh' | 'tuoi';
}

export interface Sao {
  readonly id: number;
  readonly ten: string;
  /** Cach chia cua `ansaotuvi`: 1 chinh tinh, 2–9 sao tot, tu 11 sao xau. */
  readonly loai: number;
  readonly doSang: DoSang | null;
}

export interface Cung {
  /** 0 = Ty. */
  readonly chi: number;
  /** "Bính Dần". */
  readonly canChi: string;
  /** "Mệnh", "Phụ Mẫu"… */
  readonly ten: string;
  /** Tuoi bat dau dai van o cung nay. */
  readonly daiVan: number;
  /** Chi nam (0 = Ty) ma tieu han roi vao cung nay. */
  readonly tieuHan: number;
  readonly tuan: boolean;
  readonly triet: boolean;
  /** Thu tu nhu `ansaotuvi` nhap: chinh tinh truoc. */
  readonly sao: readonly Sao[];
}

export interface LaSo {
  /** 12 cung theo chi, `cung[0]` = Ty. */
  readonly cung: readonly Cung[];
  readonly menh: number;
  readonly than: number;
  /** "Thủy Nhị Cục". */
  readonly cuc: string;
  readonly soCuc: number;
  readonly menhChu: string;
  readonly thanChu: string;
  /** "Dương Nam", "Âm Nữ"… */
  readonly amDuong: string;
  readonly chiGio: number;
  /** Tuoi mu o nam xem (QUY_UOC muc 3). */
  readonly tuoi: number;
  /** Chi cung dai van dang chay; null khi chua toi dai van dau. */
  readonly daiVanNay: number | null;
  /** Chi cung tieu han nam xem. */
  readonly tieuHanNay: number;
  readonly phai: PhaiTuVi;
}

/** [id, ten, loai] — `ansaotuvi/Sao.py`, ten viet hoa moi chu (QUY_UOC muc 10). */
const BANG_SAO: readonly (readonly [number, string, number])[] = [
  [1, 'Tử Vi', 1], [2, 'Liêm Trinh', 1], [3, 'Thiên Đồng', 1], [4, 'Vũ Khúc', 1], [5, 'Thái Dương', 1],
  [6, 'Thiên Cơ', 1], [7, 'Thiên Phủ', 1], [8, 'Thái Âm', 1], [9, 'Tham Lang', 1], [10, 'Cự Môn', 1],
  [11, 'Thiên Tướng', 1], [12, 'Thiên Lương', 1], [13, 'Thất Sát', 1], [14, 'Phá Quân', 1],
  [15, 'Thái Tuế', 15], [16, 'Thiếu Dương', 5], [17, 'Tang Môn', 12], [18, 'Thiếu Âm', 5], [19, 'Quan Phù', 12],
  [20, 'Tử Phù', 12], [21, 'Tuế Phá', 12], [22, 'Long Đức', 5], [23, 'Bạch Hổ', 12], [24, 'Phúc Đức', 5],
  [25, 'Điếu Khách', 12], [26, 'Trực Phù', 16],
  [27, 'Lộc Tồn', 3], [28, 'Lực Sĩ', 2], [29, 'Thanh Long', 5], [30, 'Tiểu Hao', 12], [31, 'Tướng Quân', 4],
  [32, 'Tấu Thư', 3], [33, 'Phi Liêm', 2], [34, 'Hỷ Thần', 5], [35, 'Bệnh Phù', 12], [36, 'Đại Hao', 12],
  [37, 'Phục Binh', 13], [38, 'Quan Phù', 12],
  [39, 'Tràng Sinh', 5], [40, 'Mộc Dục', 14], [41, 'Quan Đới', 4], [42, 'Lâm Quan', 7], [43, 'Đế Vượng', 5],
  [44, 'Suy', 12], [45, 'Bệnh', 12], [46, 'Tử', 12], [47, 'Mộ', 2], [48, 'Tuyệt', 12], [49, 'Thai', 14], [50, 'Dưỡng', 2],
  [51, 'Đà La', 11], [52, 'Kình Dương', 11], [53, 'Địa Không', 11], [54, 'Địa Kiếp', 11], [55, 'Linh Tinh', 11],
  [56, 'Hỏa Tinh', 11], [57, 'Văn Xương', 6], [58, 'Văn Khúc', 6], [59, 'Thiên Khôi', 6], [60, 'Thiên Việt', 6],
  [61, 'Tả Phù', 2], [62, 'Hữu Bật', 2], [63, 'Long Trì', 3], [64, 'Phượng Các', 3], [65, 'Tam Thai', 7],
  [66, 'Bát Tọa', 7], [67, 'Ân Quang', 3], [68, 'Thiên Quý', 3], [69, 'Thiên Khốc', 12], [70, 'Thiên Hư', 12],
  [71, 'Thiên Đức', 5], [72, 'Nguyệt Đức', 5], [73, 'Thiên Hình', 15], [74, 'Thiên Riêu', 13], [75, 'Thiên Y', 5],
  [76, 'Quốc Ấn', 6], [77, 'Đường Phù', 4], [78, 'Đào Hoa', 8], [79, 'Hồng Loan', 8], [80, 'Thiên Hỷ', 5],
  [81, 'Thiên Giải', 5], [82, 'Địa Giải', 5], [83, 'Giải Thần', 5], [84, 'Thai Phụ', 6], [85, 'Phong Cáo', 4],
  [86, 'Thiên Tài', 2], [87, 'Thiên Thọ', 5], [88, 'Thiên Thương', 12], [89, 'Thiên Sứ', 12], [90, 'Thiên La', 12],
  [91, 'Địa Võng', 12], [92, 'Hóa Khoa', 5], [93, 'Hóa Quyền', 4], [94, 'Hóa Lộc', 3], [95, 'Hóa Kỵ', 13],
  [96, 'Cô Thần', 13], [97, 'Quả Tú', 13], [98, 'Thiên Mã', 3], [99, 'Phá Toái', 12], [100, 'Thiên Quan', 5],
  [101, 'Thiên Phúc', 5], [102, 'Lưu Hà', 12], [103, 'Thiên Trù', 5], [104, 'Kiếp Sát', 11], [105, 'Hoa Cái', 14],
  // ansaotuvi ghi tat "LN. Văn tinh".
  [106, 'Lưu Niên Văn Tinh', 6], [107, 'Đẩu Quân', 5], [108, 'Thiên Không', 11], [109, 'Bác Sỹ', 5],
];
const SAO = new Map(BANG_SAO.map(([id, ten, loai]) => [id, { ten, loai }]));

/** Do sang theo cung Ty … Hoi (`DiaBan.dacTinhSao`); '.' = khong ghi. */
const DO_SANG: Readonly<Record<number, string>> = {
  1: 'BĐMBVMMĐMBVB', 2: 'VĐVHMHVĐVHMH', 3: 'VHMĐHĐHHMHHĐ', 4: 'VMVĐMHVMVĐMH', 5: 'HĐVVVMMĐHHHH',
  6: 'ĐĐHMMVĐĐVMMH', 7: 'MBMBVĐMĐMBVĐ', 8: 'VĐHHHHHĐVMMM', 9: 'HMĐHVHHMĐHVH', 10: 'VHVMHHVHĐMHĐ',
  11: 'VĐMHVĐVĐMHVĐ', 12: 'ĐĐVVMHMĐVHMH', 13: 'MĐMHHVMĐMHHH', 14: 'MVHHVHMVHHVH',
  30: 'HHĐĐHHHHĐĐHH', 36: 'HHĐĐHHHHĐĐHH', 51: 'HĐHHĐHHĐHHĐH', 52: 'HĐHHĐHHĐHHĐH', 53: 'HHĐHHĐHHĐHHĐ',
  54: 'HHĐHHĐHHĐHHĐ', 55: 'HBĐĐĐĐĐBHHHH', 56: 'HBĐĐĐĐĐBHHHH', 57: 'HĐHHĐHHĐHHĐH', 58: 'HĐHHĐHHĐHHĐH',
  69: 'ĐHHĐHHĐHHĐHH', 70: 'ĐHHĐHHĐHHĐHH', 73: '..ĐĐ....ĐĐ..', 74: '..ĐĐ.....ĐĐ.', 92: 'ĐĐĐĐĐĐĐĐĐĐĐĐ',
  93: 'HĐHHĐHHĐHHĐH', 94: 'HĐHHĐHHĐHHĐH', 95: 'HĐHHĐHHĐHHĐH', 98: '..Đ..Đ..Đ..Đ',
};

const TEN_CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch',
  'Tử Tức', 'Phu Thê', 'Huynh Đệ'] as const;
/** Menh chu, than chu theo chi 1..12 (bang `diaChi` cua `AmDuong.py`). */
const MENH_CHU = ['', 'Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc',
  'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'] as const;
const THAN_CHU = ['', 'Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh',
  'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'] as const;
/** Hanh nap am → [so cuc, ten cuc] (`AmDuong.nguHanh`). */
const CUC: Readonly<Record<string, readonly [number, string]>> = {
  K: [4, 'Kim Tứ Cục'], M: [3, 'Mộc Tam Cục'], T: [2, 'Thủy Nhị Cục'], H: [6, 'Hỏa Lục Cục'], O: [5, 'Thổ Ngũ Cục'],
};

// Bang tra theo so can 1..10 (Giap = 1): `thienCan.vitriDiaBan` (Loc Ton), `timThienKhoi`, `timThienQuanThienPhuc`, `timLuuTru`.
const LOC_TON = [0, 3, 4, 6, 7, 6, 7, 9, 10, 12, 1];
const KHOI = [0, 2, 1, 12, 10, 8, 1, 8, 7, 6, 4];
const THIEN_QUAN = [0, 8, 5, 6, 3, 4, 10, 12, 10, 11, 7];
const THIEN_PHUC = [0, 10, 9, 1, 12, 4, 3, 7, 6, 7, 6];
const LUU_HA = [0, 10, 11, 8, 5, 6, 7, 9, 4, 12, 3];
const THIEN_TRU = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 11];

const so = (bang: readonly number[], i: number): number => {
  const x = bang[i];
  if (x === undefined) throw new Error(`tu vi: thieu bang o ${String(i)}`);
  return x;
};

/** `dichCung`: cong cac buoc, quy ve 1..12. Python `%` khong ra so am — TS phai cong them 12. */
function dc(cung: number, ...buoc: number[]): number {
  const n = (((buoc.reduce((a, b) => a + b, cung)) % 12) + 12) % 12;
  return n === 0 ? 12 : n;
}

/** `khoangCachCung`: so buoc tu cung2 toi cung1, chieu 1 = thuan. */
const kc = (cung1: number, cung2: number, chieu: number): number =>
  chieu === 1 ? (cung1 - cung2 + 12) % 12 : (cung2 - cung1 + 12) % 12;

/**
 * Hanh nap am cua can chi (so 1..10, 1..12) — bang `matranNapAm` cua `AmDuong.py` rut gon:
 * cap chi (Ty Suu, Dan Mao…) lech dan mot buoc tren vong K T H O M, het ba cap thi lap lai.
 */
const napAm = (chi: number, can: number): string =>
  'KTHOM'.charAt((Math.floor((can - 1) / 2) + (Math.floor((chi - 1) / 2) % 3)) % 5);

/** `timTuVi`: dem cuc tu cung Dan toi khi vuot ngay sinh; du le thi lui, chan thi tien. */
function timTuVi(cuc: number, ngay: number): number {
  let tong = cuc, dan = 3;
  while (tong < ngay) {
    tong += cuc;
    dan += 1;
  }
  const lech = tong - ngay;
  return dc(dan, lech % 2 === 1 ? -lech : lech);
}

/** `timHoaLinh`. Altuvi: nam Ty Dau Suu khoi Hoa o Mao, Linh o Tuat (ansaotuvi dao nguoc). */
function timHoaLinh(chiNam: number, gio: number, chieu: number, al: boolean): readonly [number, number] {
  let [hoa, linh] = [10, 11];
  if ([3, 7, 11].includes(chiNam)) [hoa, linh] = [2, 4];
  else if ([1, 5, 9].includes(chiNam)) [hoa, linh] = [3, 11];
  else if ([6, 10, 2].includes(chiNam)) [hoa, linh] = al ? [4, 11] : [11, 4];
  return chieu === 1 ? [dc(hoa - 1, gio), dc(linh + 1, -gio)] : [dc(hoa + 1, -gio), dc(linh - 1, gio)];
}

/** Lap la so. Nem loi khi ngay, thang, gio sai dang. */
export function lapLaSo(v: DauVaoLaSo): LaSo {
  const { ngay: nn, thang: tt } = v;
  if (![nn, tt, v.nam, v.chiGio, v.namXem].every(Number.isInteger) || nn < 1 || nn > 30 || tt < 1 || tt > 12
    || v.chiGio < 0 || v.chiGio > 11 || v.nam < 1) {
    throw new Error(`Tử vi: ngày giờ âm không hợp lệ (${String(nn)}/${String(tt)}/${String(v.nam)}, giờ ${String(v.chiGio)})`);
  }
  const phai = v.phaiTuVi ?? 'altuvi';
  const al = phai === 'altuvi';
  const gio = v.chiGio + 1;
  const gt = v.gioiTinh === 'nam' ? 1 : -1;
  const canNam = ((v.nam + 6) % 10) + 1;
  const chiNam = ((v.nam + 8) % 12) + 1;
  // Can va chi nam cung chan le: le = duong.
  const amDuong = canNam % 2 === 1 ? 1 : -1;
  const thuan = gt * amDuong;

  // Cung chu (`diaBan.cungChu`).
  const than = dc(3, tt - 1, gio - 1);
  const menh = dc(3, tt - 1, -gio + 1);
  const tenCung = new Map(TEN_CUNG.map((t, i) => [dc(menh, i), t]));

  // Cuc: hanh nap am cua can chi cung Menh (`timCuc`).
  const canGieng = (canNam * 2 + 1) % 10;
  const canMenh = (((((menh - 3) % 12) + 12) % 12) + canGieng) % 10 || 10;
  const cuc = CUC[napAm(menh, canMenh)];
  if (cuc === undefined) throw new Error('tu vi: khong tim duoc cuc');
  const [soCuc, tenCuc] = cuc;

  const sao = new Map<number, number[]>();
  const nhap = (cung: number, ...ids: number[]): number => {
    sao.set(cung, [...(sao.get(cung) ?? []), ...ids]);
    return cung;
  };

  // Tu Vi tinh he.
  const tuVi = nhap(timTuVi(soCuc, nn), 1);
  const liemTrinh = nhap(dc(tuVi, 4), 2);
  const thienDong = nhap(dc(tuVi, 7), 3);
  const vuKhuc = nhap(dc(tuVi, 8), 4);
  const thaiDuong = nhap(dc(tuVi, 9), 5);
  const thienCo = nhap(dc(tuVi, 11), 6);
  // Thien Phu tinh he.
  const thienPhu = nhap(dc(3, 3 - tuVi), 7);
  const thaiAm = nhap(dc(thienPhu, 1), 8);
  const thamLang = nhap(dc(thienPhu, 2), 9);
  const cuMon = nhap(dc(thienPhu, 3), 10);
  nhap(dc(thienPhu, 4), 11);
  const thienLuong = nhap(dc(thienPhu, 5), 12);
  nhap(dc(thienPhu, 6), 13);
  const phaQuan = nhap(dc(thienPhu, 10), 14);

  // Vong Loc Ton: Bac Sy cung cung Loc Ton, 11 sao sau di thuan (duong nam, am nu) hoac nghich.
  const locTon = nhap(so(LOC_TON, canNam), 27, 109);
  for (let i = 1; i <= 11; i++) nhap(dc(locTon, i * thuan), 27 + i);

  // Vong Thai Tue.
  const VONG_THAI_TUE: readonly (readonly number[])[] = [[15], [16, 108], [17], [18], [19], [20, 72], [21], [22], [23], [24, 71], [25], [26]];
  VONG_THAI_TUE.forEach((ids, i) => nhap(dc(chiNam, i), ...ids));

  // Vong Trang Sinh: khoi theo cuc (`timTrangSinh`), chieu nhu vong Loc Ton.
  const trangSinh = nhap(soCuc === 6 ? 3 : soCuc === 4 ? 6 : soCuc === 3 ? 12 : 9, 39);
  for (let i = 1; i <= 9; i++) nhap(dc(trangSinh, thuan * i), 39 + i);
  nhap(dc(trangSinh, -thuan), 49);
  nhap(dc(trangSinh, -2 * thuan), 50);

  nhap(dc(locTon, -1), 51);
  const kinhDuong = nhap(dc(locTon, 1), 52);
  const diaKiep = dc(11, gio);
  nhap(diaKiep, 54);
  nhap(dc(12, 12 - diaKiep), 53);
  const [hoaTinh, linhTinh] = timHoaLinh(chiNam, gio, thuan, al);
  nhap(hoaTinh, 56);
  nhap(linhTinh, 55);

  const longTri = nhap(dc(5, chiNam - 1), 63);
  nhap(dc(2, 2 - longTri), 64, 83);
  const taPhu = nhap(dc(5, tt - 1), 61);
  const huuBat = nhap(dc(2, 2 - taPhu), 62);
  const vanKhuc = nhap(dc(5, gio - 1), 58);
  const vanXuong = nhap(dc(2, 2 - vanKhuc), 57);
  const tamThai = nhap(dc(5, tt + nn - 2), 65);
  nhap(dc(2, 2 - tamThai), 66);
  // An Quang: tu Van Xuong lam mung 1 dem toi ngay sinh, lui mot cung; Thien Quy doi xung qua truc Suu Mui.
  const anQuang = nhap(dc(vanXuong, nn - 2), 67);
  nhap(dc(2, 2 - anQuang), 68);

  // Altuvi nam Canh: Khoi Ngo (Viet theo do ra Dan).
  const khoi = nhap(al && canNam === 7 ? 7 : so(KHOI, canNam), 59);
  nhap(dc(5, 5 - khoi), 60);
  nhap(dc(7, chiNam - 1), 70);
  nhap(dc(7, -chiNam + 1), 69);
  nhap(dc(menh, chiNam - 1), 86);
  nhap(dc(than, chiNam - 1), 87);
  const hongLoan = nhap(dc(4, -chiNam + 1), 79);
  nhap(dc(hongLoan, 6), 80);
  nhap(so(THIEN_QUAN, canNam), 100);
  nhap(so(THIEN_PHUC, canNam), 101);
  const thienHinh = nhap(dc(10, tt - 1), 73);
  nhap(dc(thienHinh, 4), 74, 75);
  const coThan = nhap([12, 1, 2].includes(chiNam) ? 3 : [3, 4, 5].includes(chiNam) ? 6 : [6, 7, 8].includes(chiNam) ? 9 : 12, 96);
  nhap(dc(coThan, -4), 97);
  const vanTinh = nhap(dc(kinhDuong, 2), 106);
  const duongPhu = nhap(dc(vanTinh, 2), 77);
  nhap(dc(duongPhu, 3), 76);
  nhap(dc(vanKhuc, 2), 84);
  nhap(dc(vanKhuc, -2), 85);
  // Thien Giai: ansaotuvi khoi Than thang Gieng, dem thuan nhay cung; Altuvi dem lien tung cung.
  nhap(dc(9, al ? tt - 1 : 2 * tt - 2), 81);
  nhap(dc(taPhu, 3), 82);
  nhap(5, 90);
  nhap(11, 91);
  nhap(dc(menh, 5), 88);
  nhap(dc(menh, 7), 89);

  const thienMa = nhap([6, 3, 12, 9][chiNam % 4] ?? 6, 98);
  nhap(dc(thienMa, 2), 105);
  const kiepSat = nhap(dc(thienMa, 3), 104);
  nhap(dc(kiepSat, 4), 78);
  // Pha Toai: Altuvi Ty Ngo Mao Dau → Ty, Dan Than Ty Hoi → Dau (ansaotuvi dao hai nhom nay).
  nhap((al ? [10, 6, 2] : [6, 10, 2])[chiNam % 3] ?? 2, 99);
  nhap(dc(chiNam, -tt + gio), 107);

  // Tu Hoa theo can nam: [Loc, Quyen, Khoa, Ky]. Altuvi nam Canh: Khoa Thai Am, Ky Thien Dong.
  const TU_HOA: readonly (readonly [number, number, number, number])[] = [
    [liemTrinh, phaQuan, vuKhuc, thaiDuong], [thienCo, thienLuong, tuVi, thaiAm], [thienDong, thienCo, vanXuong, liemTrinh],
    [thaiAm, thienDong, thienCo, cuMon], [thamLang, thaiAm, huuBat, thienCo], [vuKhuc, thamLang, thienLuong, vanKhuc],
    al ? [thaiDuong, vuKhuc, thaiAm, thienDong] : [thaiDuong, vuKhuc, thienDong, thaiAm], [cuMon, thaiDuong, vanKhuc, vanXuong],
    [thienLuong, tuVi, thienPhu, vuKhuc], [phaQuan, cuMon, thaiAm, thamLang],
  ];
  const hoa = TU_HOA[canNam - 1];
  if (hoa === undefined) throw new Error('tu vi: thieu tu hoa');
  nhap(hoa[0], 94);
  nhap(hoa[1], 93);
  nhap(hoa[2], 92);
  nhap(hoa[3], 95);
  // Altuvi nam Canh: Luu Ha o Thin.
  nhap(al && canNam === 7 ? 5 : so(LUU_HA, canNam), 102);
  nhap(so(THIEN_TRU, canNam), 103);

  // Tuan: hai cung sau cung ket thuc tuan (can Quy) cua can chi nam. Triet theo can nam.
  const tuan1 = dc(chiNam, 10 - canNam, 1);
  const triet1 = [9, 7, 5, 3, 1][(canNam - 1) % 5] ?? 1;

  // Dai han (`nhapDaiHan`) tinh theo chi nam, tieu han (`nhapTieuHan`) theo gioi tinh.
  const khoiHan = dc(11, -3 * (chiNam - 1));
  const cungTy = dc(khoiHan, -gt * (chiNam - 1));
  const tuoi = v.namXem - v.nam + 1;
  const chiXem = (v.namXem + 8) % 12;
  const canDan = (((canNam - 1) % 5) * 2 + 2) % 10;

  const cung: Cung[] = [];
  for (let c = 1; c <= 12; c++) {
    cung.push({
      chi: c - 1,
      canChi: `${hv('can', CAN.charAt((canDan + ((c - 3 + 12) % 12)) % 10))} ${hv('chi', CHI.charAt(c - 1))}`,
      ten: tenCung.get(c) ?? '',
      daiVan: soCuc + kc(c, menh, thuan) * 10,
      tieuHan: kc(c, cungTy, gt),
      tuan: c === tuan1 || c === dc(tuan1, 1),
      triet: c === triet1 || c === triet1 + 1,
      sao: (sao.get(c) ?? []).map((id) => {
        const s = SAO.get(id);
        if (s === undefined) throw new Error(`tu vi: thieu sao ${String(id)}`);
        const d = DO_SANG[id]?.charAt(c - 1);
        return { id, ten: s.ten, loai: s.loai, doSang: d === undefined || d === '.' || d === '' ? null : (d as DoSang) };
      }),
    });
  }
  const daiVanNay = cung.find((x) => x.daiVan <= tuoi && tuoi < x.daiVan + 10)?.chi ?? null;
  return {
    cung,
    menh: menh - 1,
    than: than - 1,
    cuc: tenCuc,
    soCuc,
    // Toan Thu: Menh chu theo chi cung Menh, Than chu theo chi nam ("火鈴" ty ngo: sach Viet tach Ty Linh, Ngo Hoa) — QUY_UOC muc 15.
    // ansaotuvi tra bang chi bang so CAN nam (`ThienBan.py`) — nham, giu o phai 'ansaotuvi' de so 100% voi Python.
    menhChu: MENH_CHU[al ? (v.menhChuTheo === 'tuoi' ? chiNam : menh) : canNam] ?? '',
    thanChu: THAN_CHU[al ? chiNam : canNam] ?? '',
    amDuong: `${amDuong === 1 ? 'Dương' : 'Âm'} ${gt === 1 ? 'Nam' : 'Nữ'}`,
    chiGio: v.chiGio,
    tuoi,
    daiVanNay,
    tieuHanNay: cung.find((x) => x.tieuHan === chiXem)?.chi ?? 0,
    phai,
  };
}

/**
 * La so tu ho so da tinh (`tinhHoSo(...).chinh`): ngay am da theo phai gio Ty, chi gio tu `phut7` (gio +7).
 * Khong ro gio: dung `gioGiaDinh` (0 = Ty), khong co thi tra 'canChonGio' — 12 phuong an cho nguoi dung chon (QUY_UOC muc 9).
 */
export function tinhTuVi(hs: HoSo, kq: KetQuaHoSo, ngayXem: NgayDuong, gioGiaDinh?: number): LaSo | 'canChonGio' {
  const chiGio = kq.phut7 === null ? gioGiaDinh : Math.floor((kq.phut7 + 60) / 120) % 12;
  if (chiGio === undefined) return 'canChonGio';
  return lapLaSo({
    ngay: kq.am.ngay, thang: kq.am.thang, nam: kq.am.nam, chiGio, gioiTinh: hs.gioiTinh, namXem: duongSangAm(ngayXem).nam,
  });
}
