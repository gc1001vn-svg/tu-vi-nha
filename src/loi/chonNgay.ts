/**
 * Chon ngay theo viec (dot 4): moi ngay trong mot thang duong -> Tot / Duoc / Tranh kem ly do; xuat hanh them ngay Khong Minh,
 * gio Ly Thuan Phong, huong hy than, tai than. Luat cham va nguon tung bang: `docs/QUY_UOC.md` muc 19.
 * Thang cua bang theo ngay am la thang am; thang nhuan tinh nhu thang truoc (giu so thang, QUY_UOC muc 5).
 * Thuoc: `tests/ChonNgay.test.ts` (ca mau tung bang, 9 anh lich anh chup cho Khong Minh).
 */
import { CHI, duongSangAm, soNgay, thu, tuSoNgay, type NgayAm, type NgayDuong } from './amLich.ts';
import { BANG, hv, type Bang } from './hanViet/index.ts';
import { chiTietNgay, xemNgay } from './homNay.ts';
import { hanNam, type Muc } from './namNay.ts';

export type Viec = 'cuoiHoi' | 'dongTho' | 'khaiTruong' | 'xuatHanh' | 'muaXe';
/** `muc`: chu Han cua muc nen/kieng trong hoang lich ung voi viec. Mua xe: khong nguon nao co muc rieng, lay Giao dich, Nap tai. */
export const VIEC: Readonly<Record<Viec, { readonly ten: string; readonly muc: readonly string[]; readonly nam: readonly ('kimLau' | 'hoangOc' | 'tamTai')[] }>> = {
  cuoiHoi: { ten: 'Cưới hỏi', muc: ['嫁娶', '纳采'], nam: ['kimLau', 'tamTai'] },
  dongTho: { ten: 'Động thổ, làm nhà', muc: ['动土'], nam: ['kimLau', 'hoangOc', 'tamTai'] },
  khaiTruong: { ten: 'Khai trương', muc: ['开市'], nam: ['tamTai'] },
  xuatHanh: { ten: 'Xuất hành, đi xa', muc: ['出行'], nam: [] },
  muaXe: { ten: 'Mua xe', muc: ['交易', '纳财'], nam: [] },
};

export type DanhGia = 'tot' | 'duoc' | 'tranh';
/** `tot` cong diem, `xau` chan muc Tot, `tranh` la Tranh. */
export interface LyDo { readonly loai: 'tot' | 'xau' | 'tranh'; readonly chu: string }
export interface GioXuatHanh { readonly chi: string; readonly khoang: string; readonly ten: string; readonly tot: boolean }
export interface XuatHanh {
  readonly khongMinh: { readonly ten: string; readonly tot: boolean; readonly nghia: string };
  readonly gio: readonly GioXuatHanh[];
  readonly hyThan: string; readonly taiThan: string;
}
export interface NgayChon {
  readonly duong: NgayDuong; readonly thu: number; readonly am: NgayAm; readonly canChiNgay: string;
  readonly danhGia: DanhGia; readonly lyDo: readonly LyDo[];
  readonly xuatHanh?: XuatHanh;
}

// Duong Cong Ky: [thang am, ngay am] (13 ngay/nam).
const DUONG_CONG: readonly (readonly [number, number])[] = [
  [1, 13], [2, 11], [3, 9], [4, 7], [5, 5], [6, 3], [7, 8], [7, 29], [8, 27], [9, 25], [10, 23], [11, 21], [12, 19],
];
// Sat Chu: chi ngay theo thang am (phan tu i = thang i+1).
const SAT_CHU = '子丑丑戌辰辰丑辰丑辰未辰';
// Tho Tu: can chi ngay theo thang am.
const THO_TU = ['Bính Tuất', 'Nhâm Thìn', 'Tân Hợi', 'Đinh Tỵ', 'Mậu Tý', 'Bính Ngọ', 'Ất Sửu', 'Quý Mùi', 'Giáp Dần', 'Mậu Thân', 'Tân Mão', 'Tân Dậu'];

// Khong Minh: ba nhom thang am, ngay 1 la ten dau vong. [ten, tot, nghia — Claude soan lai].
type Ten = readonly [string, boolean, string];
const KHONG_MINH: readonly (readonly Ten[])[] = [
  [ // thang 1, 4, 7, 10
    ['Đường Phong', true, 'Đi đâu cũng thuận, cầu gì được nấy, dễ gặp quý nhân.'],
    ['Kim Thổ', false, 'Ra đi dễ lỡ tàu xe, cầu tài khó được, đề phòng mất của.'],
    ['Kim Dương', true, 'Đi xa tốt, có quý nhân giúp, tài lộc thông suốt.'],
    ['Thuần Dương', true, 'Đi thuận lợi, được người tốt giúp, cầu tài được như ý.'],
    ['Đạo Tặc', false, 'Rất xấu: đi dễ gặp hại, mất của.'],
    ['Hảo Thương', true, 'Đi thuận, gặp người trên vừa lòng, làm việc như ý.'],
  ],
  [ // thang 2, 5, 8, 11
    ['Thiên Đạo', false, 'Cầu tài nên tránh: được cũng tốn kém, dễ thua thiệt.'],
    ['Thiên Môn', true, 'Đi đâu cũng thông, làm việc gì cũng vừa ý.'],
    ['Thiên Đường', true, 'Đi được người giúp đỡ, buôn bán may mắn.'],
    ['Thiên Tài', true, 'Nên đi cầu tài, được người giúp, mọi việc thuận.'],
    ['Thiên Tặc', false, 'Đi xa xấu, dễ mất của, việc gì cũng không xong.'],
    ['Thiên Dương', true, 'Đi tốt, cầu tài được, hỏi vợ được vợ.'],
    ['Thiên Hầu', false, 'Đi xa dễ cãi cọ, xảy chuyện không hay.'],
    ['Thiên Thương', true, 'Đi gặp người trên thì tốt, cầu tài được.'],
  ],
  [ // thang 3, 6, 9, 12
    ['Bạch Hổ Đầu', true, 'Đi xa, cầu tài được; đi đâu cũng thông đạt.'],
    ['Bạch Hổ Kiếp', true, 'Đi bốn phương đều tốt, trăm việc được như ý.'],
    ['Bạch Hổ Túc', false, 'Cấm đi xa, làm việc gì cũng không thành.'],
    ['Huyền Vũ', false, 'Đi thường gặp cãi cọ, việc xấu, không nên đi.'],
    ['Chu Tước', false, 'Đi hay mất của, việc thường thua thiệt.'],
    ['Thanh Long Đầu', true, 'Nên đi sớm, cầu tài thắng lợi, mọi việc như ý.'],
    ['Thanh Long Kiếp', true, 'Đi bốn phương tám hướng đều tốt.'],
    ['Thanh Long Túc', false, 'Đi xa không nên, tài lộc không có, dễ kiện cáo.'],
  ],
];

// Ly Thuan Phong: (ngay am + thang am + khac − 2) chia 6, phan tu i = so du i; khac 1 = gio Ty va Ngo … khac 6 = Ty (蛇) va Hoi.
const LY_THUAN_PHONG: readonly (readonly [string, boolean])[] = [
  ['Tuyệt Lộ', false], ['Đại An', true], ['Tốc Hỷ', true], ['Lưu Niên', false], ['Xích Khẩu', false], ['Tiểu Cát', true],
];

const hai = (n: number): string => String(n).padStart(2, '0');
const nghia = (c: string): string => (BANG.nenKieng as Bang)[c]?.nghia ?? hv('nenKieng', c);

/** Ngay Khong Minh cua mot ngay am. */
export function khongMinh(am: NgayAm): XuatHanh['khongMinh'] {
  const vong = KHONG_MINH[(am.thang - 1) % 3] ?? [];
  const [ten, tot, y] = vong[(am.ngay - 1) % vong.length] ?? ['', false, ''];
  return { ten, tot, nghia: y };
}

/** 12 gio xuat hanh Ly Thuan Phong cua mot ngay am (gio Ty dau ngay). */
export function gioLyThuanPhong(am: NgayAm): GioXuatHanh[] {
  return Array.from({ length: 12 }, (_, i) => {
    const [ten, tot] = LY_THUAN_PHONG[(am.ngay + am.thang + (i % 6) + 1 - 2) % 6] ?? ['', false];
    return { chi: hv('chi', CHI.charAt(i)), khoang: `${hai((i * 2 + 23) % 24)}–${hai(i * 2 + 1)}`, ten, tot };
  });
}

/** Ten ngay xau theo thang am (Duong Cong Ky, Sat Chu, Tho Tu) cua mot ngay. */
export function ngayXauThang(am: NgayAm, canChi: string, chiNgay: number): string[] {
  return [
    DUONG_CONG.some(([t, n]) => t === am.thang && n === am.ngay) && 'Dương Công Kỵ',
    SAT_CHU.charAt(am.thang - 1) === CHI.charAt(chiNgay) && 'Sát Chủ',
    THO_TU[am.thang - 1] === canChi && 'Thọ Tử',
  ].filter((x): x is string => x !== false);
}

const LOI_XAU: Readonly<Record<string, string>> = {
  'Tam Nương': 'kiêng khởi sự việc lớn', 'Nguyệt Kỵ': 'kiêng đi xa, khởi sự',
  'Dương Công Kỵ': 'kiêng mọi việc lớn', 'Sát Chủ': 'kiêng việc lớn', 'Thọ Tử': 'trăm việc đều kỵ',
};

/**
 * Lich ghi kieng viec: mac dinh `xau` (chi chan muc Tot) vi muc kieng cua thu vien trung cnlunar chi 58–65% (kappa 0,02–0,16,
 * `scripts/doi-chieu/so-cnlunar.mjs`); `tranh` = xep Tranh nhu ngay ky (QUY_UOC muc 19).
 */
export interface TuyChonChonNgay { readonly kiengLich?: 'xau' | 'tranh' }

/** Cham mot ngay cho mot viec. `chiNamSinh` (0 = Ty) bo trong thi khong xet tuoi. */
export function chamNgay(d: NgayDuong, viec: Viec, chiNamSinh?: number, tc: TuyChonChonNgay = {}): NgayChon {
  const n = xemNgay(d);
  const c = chiTietNgay(d);
  const v = VIEC[viec];
  const ten = v.muc.map(nghia);
  const ly: LyDo[] = [];
  const kieng = ten.filter((t) => c.kieng.includes(t));
  if (kieng.length > 0) ly.push({ loai: tc.kiengLich ?? 'xau', chu: `Lịch ghi kiêng ${kieng.join(', ').toLowerCase()}` });
  for (const k of [...c.ngayKy, ...ngayXauThang(n.am, n.canChiNgay, n.chiNgay)]) ly.push({ loai: 'tranh', chu: `${k}: ${LOI_XAU[k] ?? ''}` });
  if (chiNamSinh !== undefined) {
    const lech = (n.chiNgay - chiNamSinh + 12) % 12;
    const tuoi = hv('chi', CHI.charAt(chiNamSinh));
    if (lech === 6) ly.push({ loai: 'tranh', chu: `Ngày ${hv('chi', CHI.charAt(n.chiNgay))} xung tuổi ${tuoi}` });
    else if ((n.chiNgay + chiNamSinh) % 12 === 1) ly.push({ loai: 'tot', chu: `Lục hợp tuổi ${tuoi}` });
    else if (lech !== 0 && lech % 4 === 0) ly.push({ loai: 'tot', chu: `Tam hợp tuổi ${tuoi}` });
  }
  ly.push({ loai: n.hoangDao ? 'tot' : 'xau', chu: `${n.hoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'} (${n.thienThan})` });
  const nen = ten.filter((t) => c.nen.includes(t));
  if (nen.length > 0) ly.push({ loai: 'tot', chu: `Lịch ghi nên ${nen.join(', ').toLowerCase()}` });
  else if (kieng.length === 0) ly.push({ loai: 'xau', chu: `Lịch không ghi nên ${v.ten.toLowerCase()}` });

  let xuatHanh: XuatHanh | undefined;
  if (viec === 'xuatHanh') {
    const km = khongMinh(n.am);
    ly.push({ loai: km.tot ? 'tot' : 'xau', chu: `Ngày ${km.ten} (Khổng Minh)` });
    xuatHanh = { khongMinh: km, gio: gioLyThuanPhong(n.am), hyThan: n.hyThan, taiThan: n.thanTai };
  }
  const danhGia: DanhGia = ly.some((l) => l.loai === 'tranh') ? 'tranh'
    : ly.some((l) => l.loai === 'xau') ? 'duoc' : 'tot';
  return { duong: d, thu: thu(d), am: n.am, canChiNgay: n.canChiNgay, danhGia, lyDo: ly, ...(xuatHanh === undefined ? {} : { xuatHanh }) };
}

/** Moi ngay cua thang duong `thang`/`nam`. */
export function chonNgay(viec: Viec, nam: number, thang: number, chiNamSinh?: number, tc: TuyChonChonNgay = {}): NgayChon[] {
  const dau = soNgay({ nam, thang, ngay: 1 });
  const cuoi = soNgay(thang === 12 ? { nam: nam + 1, thang: 1, ngay: 1 } : { nam, thang: thang + 1, ngay: 1 });
  return Array.from({ length: cuoi - dau }, (_, i) => chamNgay(tuSoNgay(dau + i), viec, chiNamSinh, tc));
}

/** Kim Lau, Hoang Oc, Tam Tai ma viec nay xet, chi muc pham; moi nam am co trong thang mot lan. */
export function canhBaoNam(viec: Viec, namAmSinh: number, nam: number, thang: number): { readonly namAm: number; readonly tuoiMu: number; readonly ten: string; readonly muc: Muc }[] {
  const TEN = { kimLau: 'Kim Lâu', hoangOc: 'Hoang Ốc', tamTai: 'Tam Tai' } as const;
  const ngay = [{ nam, thang, ngay: 1 }, tuSoNgay(soNgay(thang === 12 ? { nam: nam + 1, thang: 1, ngay: 1 } : { nam, thang: thang + 1, ngay: 1 }) - 1)];
  const nam2 = [...new Map(ngay.map((d) => [duongSangAm(d).nam, d])).values()].filter((d) => duongSangAm(d).nam >= namAmSinh);
  return nam2.flatMap((d) => {
    const h = hanNam(namAmSinh, d);
    return VIEC[viec].nam.map((k) => ({ namAm: h.namAm, tuoiMu: h.tuoiMu, ten: TEN[k], muc: h[k] })).filter((x) => x.muc.mucDo === 'xau');
  });
}
