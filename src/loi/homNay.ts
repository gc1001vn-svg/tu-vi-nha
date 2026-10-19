/**
 * Man "Hom nay": thong tin mot ngay (can chi, tiet, truc, hoang dao, gio hoang dao, than tai) va theo tuoi tung nguoi.
 * Quy uoc: `docs/QUY_UOC.md` muc 2 (can chi thang theo thang am, truc/hoang dao theo thang tiet), muc 11 (theo tuoi, mau, so).
 * Thuoc: `tests/HomNay.test.ts` (5 anh lich anh chup, quet so thu vien 1900–2100).
 */
import { LunarUtil, Solar } from 'lunar-typescript';
import { CHI, canChiNam, canChiNgay, canChiThang, duongSangAm, soNgay, thu, tuSoNgay, type NgayAm, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';

export interface GioHoangDao { readonly chi: string; readonly khoang: string }
export interface NgayXem {
  readonly duong: NgayDuong; readonly thu: number; readonly am: NgayAm;
  readonly canChiNam: string; readonly canChiThang: string; readonly canChiNgay: string;
  readonly tiet: string;
  readonly truc: string; readonly thienThan: string; readonly hoangDao: boolean;
  readonly gioHoangDao: readonly GioHoangDao[];
  readonly thanTai: string; readonly hyThan: string;
  readonly napAmNgay: string; readonly hanhNgay: string;
  readonly chiNgay: number;
}
export type ThangXemNgay = 'tiet' | 'am';

const hai = (n: number): string => String(n).padStart(2, '0');

export function xemNgay(d: NgayDuong, thangXemNgay: ThangXemNgay = 'tiet'): NgayXem {
  const am = duongSangAm(d);
  const lunar = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
  // Thu vien tinh tiet theo gio Bac Kinh (+8). Ca ngay D (gio VN) thuoc thang cua tiet roi truoc 23:59:59 VN = 00:59:59 Bac Kinh ngay D+1.
  const mai = tuSoNgay(soNgay(d) + 1);
  const cuoiNgay = Solar.fromYmdHms(mai.nam, mai.thang, mai.ngay, 0, 59, 59).getLunar();
  const chiNgay = (soNgay(d) + 1) % 12;
  const chiThang = thangXemNgay === 'am' ? (am.thang + 1) % 12 : cuoiNgay.getMonthZhiIndexExact();
  const thienThan = LunarUtil.TIAN_SHEN[(chiNgay + (LunarUtil.ZHI_TIAN_SHEN_OFFSET[CHI.charAt(chiThang)] ?? 0)) % 12 + 1] ?? '';
  const napAm = lunar.getDayNaYin();
  return {
    duong: d, thu: thu(d), am,
    canChiNam: canChiNam(am.nam), canChiThang: canChiThang(am), canChiNgay: canChiNgay(d),
    tiet: hv('tietKhi', cuoiNgay.getPrevJieQi(false).getName()),
    truc: hv('truc', LunarUtil.ZHI_XING[(chiNgay - chiThang + 12) % 12 + 1] ?? ''),
    thienThan: hv('thienThan', thienThan),
    hoangDao: LunarUtil.TIAN_SHEN_TYPE[thienThan] === '黄道',
    gioHoangDao: lunar.getTimes().slice(0, 12).flatMap((t, i) => t.getTianShenType() === '黄道'
      ? [{ chi: hv('chi', t.getZhi()), khoang: `${hai((i * 2 + 23) % 24)}–${hai(i * 2 + 1)}` }] : []),
    thanTai: hv('huong', lunar.getDayPositionCaiDesc()),
    hyThan: hv('huong', lunar.getDayPositionXiDesc()),
    napAmNgay: hv('napAm', napAm),
    hanhNgay: hv('nguHanh', napAm.slice(-1)),
    chiNgay,
  };
}

export interface TheoTuoi {
  readonly quanHe: 'xung' | 'hop' | 'binh';
  readonly loai: string;
  readonly nguHanh: 'sinh' | 'duocSinh' | 'khac' | 'biKhac' | 'hoa';
  readonly loi: string;
  readonly mauHop: readonly string[]; readonly mauKy: readonly string[]; readonly soHop: readonly number[];
}

// Vong tuong sinh Moc → Hoa → Tho → Kim → Thuy → Moc; hanh i sinh i+1, khac i+2. Mau, so: `QUY_UOC` muc 11.
const VONG = ['木', '火', '土', '金', '水'].map((c) => hv('nguHanh', c));
const MAU = [['xanh lá'], ['đỏ', 'hồng', 'tím', 'cam'], ['vàng', 'nâu'], ['trắng', 'xám', 'bạc'], ['đen', 'xanh dương']];
const SO = [[3, 4], [9], [2, 5, 8], [6, 7], [0, 1]];
const LOI_HANH = {
  sinh: 'hành ngày sinh cho mệnh — thuận',
  duocSinh: 'mệnh sinh cho hành ngày — hao sức, làm vừa phải',
  khac: 'hành ngày khắc mệnh — nên thận trọng',
  biKhac: 'mệnh khắc hành ngày — làm được nhưng vất vả',
  hoa: 'hành ngày cùng hành với mệnh — bình hòa',
} as const;

/** Loi Claude soan lai theo quan niem dan gian (luat 6), khong chep sach. */
export function theoTuoi(ngay: NgayXem, chiNamSinh: number, hanhMenh: string): TheoTuoi {
  const [a, b] = [ngay.chiNgay, chiNamSinh];
  const [quanHe, loai] = (a - b + 12) % 12 === 6 ? ['xung', 'lục xung'] as const
    : (a + b) % 12 === 1 ? ['hop', 'lục hợp'] as const
      : a !== b && (a - b) % 4 === 0 ? ['hop', 'tam hợp'] as const : ['binh', ''] as const;
  const m = VONG.indexOf(hanhMenh);
  if (m < 0) throw new Error(`Hành mệnh không rõ: ${hanhMenh}`);
  const nguHanh = (['hoa', 'duocSinh', 'biKhac', 'khac', 'sinh'] as const)[(VONG.indexOf(ngay.hanhNgay) - m + 5) % 5] ?? 'hoa';
  const sinhMenh = (m + 4) % 5;
  const chi = hv('chi', CHI.charAt(b));
  const dauCau = quanHe === 'xung' ? `Ngày ${loai} với tuổi ${chi}, tránh việc lớn`
    : quanHe === 'hop' ? `Ngày ${loai} với tuổi ${chi}, thuận cho việc cần làm` : `Ngày bình thường với tuổi ${chi}`;
  return {
    quanHe, loai, nguHanh,
    loi: `${dauCau}; ${LOI_HANH[nguHanh]}.`,
    mauHop: [...(MAU[sinhMenh] ?? []), ...(MAU[m] ?? [])],
    mauKy: MAU[(m + 3) % 5] ?? [],
    soHop: [...(SO[m] ?? []), ...(SO[sinhMenh] ?? [])].sort((x, y) => x - y),
  };
}
