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

// Duong Cong Ky: [thang am, ngay am], 13 ngay/nam; thang 7 lay mung 1 va 29 (Ngoc Hap Ky, sach Hoa, ~11 nguon; ~7 bai Viet lay 8 va 29).
const DUONG_CONG: readonly (readonly [number, number])[] = [
  [1, 13], [2, 11], [3, 9], [4, 7], [5, 5], [6, 3], [7, 1], [7, 29], [8, 27], [9, 25], [10, 23], [11, 21], [12, 19],
];
// Chi ngay theo thang am (ky tu thu i = thang i+1). Sat Chu Am thang 7 Suu, 8 Hoi (lich theo ngay xemlicham, lichngaytot,
// lichvannien); nhieu bai viet dao lai 7 Hoi, 8 Suu. Tho Tu theo chi (lich theo ngay), khong theo can chi (vai bai viet).
const SAT_CHU_AM = '巳子未卯申戌丑亥午酉寅辰';
const SAT_CHU_DUONG = '子丑丑戌辰辰丑辰丑辰未辰';
const THO_TU = '戌辰亥巳子午丑未寅申卯酉';

// Khong Minh: ba nhom thang am, ngay 1 la ten dau vong. [ten, tot, nghia — Claude soan lai].
type Ten = readonly [string, boolean, string];
const KHONG_MINH: readonly (readonly Ten[])[] = [
  [ // thang 1, 4, 7, 10
    ['Đường Phong', true, 'Đi đâu cũng thuận, dễ gặp người nâng đỡ, cầu tài như ý.'],
    ['Kim Thổ', false, 'Dễ lỡ tàu xe, mất của dọc đường, cầu tài khó.'],
    ['Kim Dương', true, 'Đi suôn sẻ, có quý nhân giúp, tiền bạc thông.'],
    ['Thuần Dương', true, 'Đi về đều thuận, được người giúp, bàn bạc dễ thắng.'],
    ['Đạo Tặc', false, 'Rất xấu: đi dễ gặp hại, mất của.'],
    ['Hảo Thương', true, 'Việc vừa ý, gặp người trên giúp, đi thuận.'],
  ],
  [ // thang 2, 5, 8, 11
    ['Thiên Đạo', false, 'Nên tránh cầu tài: có được cũng hao tốn, dễ thua thiệt.'],
    ['Thiên Môn', true, 'Thuận lợi, việc dễ thành.'],
    ['Thiên Đường', true, 'Việc như ý, có quý nhân, buôn bán có lời.'],
    ['Thiên Tài', true, 'Rất hợp cầu tài, nhiều người giúp.'],
    ['Thiên Tặc', false, 'Cầu tài không được, đi dễ mất cắp.'],
    ['Thiên Dương', true, 'Cầu tài được, việc như ý.'],
    ['Thiên Hầu', false, 'Dễ cãi vã, đề phòng tai nạn.'],
    ['Thiên Thương', true, 'Gặp người trên rất hợp, cầu tài được.'],
  ],
  [ // thang 3, 6, 9, 12
    ['Chu Tước', false, 'Đi và cầu tài đều xấu, dễ mất của, cãi lý thua.'],
    ['Bạch Hổ Đầu', true, 'Đi đâu, cầu tài đều thuận.'],
    ['Bạch Hổ Kiếp', true, 'Đi hướng Bắc hay Nam thuận, cầu tài như ý.'],
    ['Bạch Hổ Túc', false, 'Không nên đi xa, việc khó thành.'],
    ['Huyền Vũ', false, 'Dễ cãi cọ, không nên đi.'],
    ['Thanh Long Đầu', true, 'Nên đi sáng sớm, cầu tài thắng lợi.'],
    ['Thanh Long Kiếp', true, 'Đi các hướng đều thuận.'],
    ['Thanh Long Túc', false, 'Không nên đi xa, không có tài lộc, cãi lý thua.'],
  ],
];

// Ly Thuan Phong (khac 1 = gio Ty va Ngo … khac 6 = Ty (蛇) va Hoi): (ngay + thang + khac − 3) chia 6 tren thu tu Viet — 5 bai day
// cach tinh, bao, lichngaytot, lichvannien (16/16 ca). Mot trang (xemlicham) tinh khac, khong theo (QUY_UOC muc 19).
const LTP = ['Đại An', 'Tốc Hỷ', 'Lưu Niên', 'Xích Khẩu', 'Tiểu Cát', 'Tuyệt Lộ'];
const LTP_TOT = new Set(['Đại An', 'Tốc Hỷ', 'Tiểu Cát']);

const hai = (n: number): string => String(n).padStart(2, '0');
const nghia = (c: string): string => (BANG.nenKieng as Bang)[c]?.nghia ?? hv('nenKieng', c);

/** Ngay Khong Minh cua mot ngay am. Ngay 30 thang 2-5-8-11 la Thien Thuong (4 nguon; vong thuan ra Thien Duong). */
export function khongMinh(am: NgayAm): XuatHanh['khongMinh'] {
  const vong = KHONG_MINH[(am.thang - 1) % 3] ?? [];
  const i = am.ngay === 30 && vong.length === 8 && am.thang % 3 === 2 ? 7 : (am.ngay - 1) % vong.length;
  const [ten, tot, y] = vong[i] ?? ['', false, ''];
  return { ten, tot, nghia: y };
}

/** 12 gio xuat hanh Ly Thuan Phong cua mot ngay am (gio Ty dau ngay). */
export function gioLyThuanPhong(am: NgayAm): GioXuatHanh[] {
  return Array.from({ length: 12 }, (_, i) => {
    const ten = LTP[(am.ngay + am.thang + (i % 6) + 1 - 3) % 6] ?? '';
    return { chi: hv('chi', CHI.charAt(i)), khoang: `${hai((i * 2 + 23) % 24)}–${hai(i * 2 + 1)}`, ten, tot: LTP_TOT.has(ten) };
  });
}

/** Ngay xau theo thang am cua mot ngay: Duong Cong Ky, Sat Chu Duong, Tho Tu (`tranh`) va Sat Chu Am (`xau`). */
export function ngayXauThang(am: NgayAm, chiNgay: number): LyDo[] {
  const chi = CHI.charAt(chiNgay);
  const co = (bang: string): boolean => bang.charAt(am.thang - 1) === chi;
  return [
    DUONG_CONG.some(([t, n]) => t === am.thang && n === am.ngay) && { loai: 'tranh', chu: 'Dương Công Kỵ: kiêng mọi việc lớn' },
    co(SAT_CHU_DUONG) && { loai: 'tranh', chu: 'Sát Chủ Dương: kiêng xây dựng, cưới hỏi, buôn bán, đi xa' },
    co(THO_TU) && { loai: 'tranh', chu: 'Thọ Tử: trăm việc đều kỵ' },
    co(SAT_CHU_AM) && { loai: 'xau', chu: 'Sát Chủ Âm: kiêng việc mai táng, thờ cúng' },
  ].filter((x): x is LyDo => x !== false);
}

const LOI_KY: Readonly<Record<string, string>> = { 'Tam Nương': 'kiêng khởi sự việc lớn', 'Nguyệt Kỵ': 'kiêng đi xa, khởi sự' };

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
  for (const k of c.ngayKy) ly.push({ loai: 'tranh', chu: `${k}: ${LOI_KY[k] ?? ''}` });
  ly.push(...ngayXauThang(n.am, n.chiNgay));
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
