/**
 * Man "Hom nay": thong tin mot ngay (can chi, tiet, truc, hoang dao, gio hoang dao, than tai), chi tiet ngay (nen/kieng,
 * than sat, 28 tu, Banh To, xung, sat, ngay ky am) va theo tuoi tung nguoi.
 * Quy uoc: `docs/QUY_UOC.md` muc 2 (can chi thang theo thang am, truc/hoang dao/than sat theo thang tiet), muc 11 (theo tuoi, mau, so).
 * Thuoc: `tests/HomNay.test.ts` (5 anh lich anh chup, quet so thu vien 1900–2100), `tests/HomNayChiTiet.test.ts`.
 */
import { LunarUtil, Solar, type Lunar } from 'lunar-typescript';
import { CHI, canChiNam, canChiNgay, canChiThang, duongSangAm, soNgay, thu, tuSoNgay, type NgayAm, type NgayDuong } from './amLich.ts';
import { BANG, hv, type Bang, type Nhom } from './hanViet/index.ts';

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
// Tai than theo can ngay (Giap = 0): sach Dang Xuan Xuyen, lichngaytot, lichvannien, quantrimang (tra 21/10, QUY_UOC muc 19).
// Hoang lich Trung Hoa (`getDayPositionCaiDesc`) khac 8/10 can; xemlicham khac them Mau (Chinh Nam), Quy (Chinh Tay).
const TAI_THAN = ['Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Bắc', 'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc'];

// Thu vien tinh tiet theo gio Bac Kinh (+8). Ca ngay D (gio VN) thuoc thang cua tiet roi truoc 23:59:59 VN = 00:59:59 Bac Kinh ngay D+1.
function cuoiNgayVN(d: NgayDuong): Lunar {
  const mai = tuSoNgay(soNgay(d) + 1);
  return Solar.fromYmdHms(mai.nam, mai.thang, mai.ngay, 0, 59, 59).getLunar();
}
const chiThangXem = (cuoiNgay: Lunar, am: NgayAm, t: ThangXemNgay): number =>
  t === 'am' ? (am.thang + 1) % 12 : cuoiNgay.getMonthZhiIndexExact();

// Mac dinh thang am nhu lich Viet (anh chot 19/10, QUY_UOC muc 2); 'tiet' theo Thong Thu, de so voi thu vien.
export function xemNgay(d: NgayDuong, thangXemNgay: ThangXemNgay = 'am'): NgayXem {
  const am = duongSangAm(d);
  const lunar = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
  const cuoiNgay = cuoiNgayVN(d);
  const chiNgay = (soNgay(d) + 1) % 12;
  const chiThang = chiThangXem(cuoiNgay, am, thangXemNgay);
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
    thanTai: TAI_THAN[(soNgay(d) + 9) % 10] ?? '',
    hyThan: hv('huong', lunar.getDayPositionXiDesc()),
    napAmNgay: hv('napAm', napAm),
    hanhNgay: hv('nguHanh', napAm.slice(-1)),
    chiNgay,
  };
}

/** Gio hoang dao tru gio luc xung chi nam sinh (`QUY_UOC` muc 11). */
export function gioTotTheoTuoi(n: NgayXem, chiNamSinh: number): GioHoangDao[] {
  const xung = hv('chi', CHI.charAt((chiNamSinh + 6) % 12));
  return n.gioHoangDao.filter((g) => g.chi !== xung);
}

export interface ChiTietNgay {
  /** Viec nen lam (宜), nen kieng (忌) — loi de hieu (`nghia` cua bang). */
  readonly nen: readonly string[]; readonly kieng: readonly string[];
  /** Cat than (吉神), hung sat (凶煞). */
  readonly saoTot: readonly string[]; readonly saoXau: readonly string[];
  /** "Tâm Nguyệt Hồ", "Xấu", "Cáo". */
  readonly tu28: { readonly ten: string; readonly catHung: string; readonly conVat: string };
  /** Banh To bach ky: [can ngay, chi ngay]. */
  readonly banhTo: readonly string[];
  /** Tuoi chinh xung ("Canh Thân (Khỉ)"): chi luc xung chi ngay, can bi can ngay khac (`getDayChongDesc`). */
  readonly tuoiXung: string;
  readonly huongSat: string;
  /** "Tam Nương", "Nguyệt Kỵ" theo ngay am (`QUY_UOC` muc 2, 5). */
  readonly ngayKy: readonly string[];
}

/** `nghia` neu bang co (viec nen/kieng, cau Banh To, con vat), khong thi am Han-Viet. */
const deHieu = (nhom: Nhom, chu: string): string => (BANG[nhom] as Bang)[chu]?.nghia ?? hv(nhom, chu);
const NGAY_KY: readonly (readonly [string, readonly number[]])[] = [['Tam Nương', [3, 7, 13, 18, 22, 27]], ['Nguyệt Kỵ', [5, 14, 23]]];

/**
 * Tach khoi `xemNgay` vi chi tiet khong can gio (`getTimes` chiem ~0,9 ms/ngay cua `xemNgay`): the Tra cuu khong phai
 * tinh thua, thuoc quet duoc day. Thang cua nen/kieng, than sat: nhu truc (thu vien lay thang tiet theo ngay giao tiet
 * gio Bac Kinh — `getMonthInGanZhi`, `getMonthZhiIndex`), o day sua theo gio VN. 28 tu, Banh To, xung, sat chi theo ngay.
 */
export function chiTietNgay(d: NgayDuong, thangXemNgay: ThangXemNgay = 'am'): ChiTietNgay {
  const am = duongSangAm(d);
  const l = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
  const ganChi = l.getDayInGanZhi();
  const chiThang = chiThangXem(cuoiNgayVN(d), am, thangXemNgay);
  // Nen/kieng chi doi theo chi thang (quet 60 can chi ngay x 60 can chi thang 19/10: can thang khong doi ket qua),
  // nen dua mot can chi bat ky co chi do (JIA_ZI[0..11] co chi 0..11).
  const thang = LunarUtil.JIA_ZI[chiThang] ?? '';
  const ds = (nhom: Nhom, chu: readonly string[]): string[] => chu.map((c) => deHieu(nhom, c));
  return {
    nen: ds('nenKieng', LunarUtil.getDayYi(thang, ganChi)),
    kieng: ds('nenKieng', LunarUtil.getDayJi(thang, ganChi)),
    saoTot: ds('thanSat', LunarUtil.getDayJiShen(chiThang, ganChi)),
    saoXau: ds('thanSat', LunarUtil.getDayXiongSha(chiThang, ganChi)),
    tu28: {
      ten: `${hv('tu28', l.getXiu())} ${hv('thatChinh', l.getZheng())} ${hv('dongVat28', l.getAnimal())}`,
      catHung: deHieu('catHung', l.getXiuLuck()), conVat: deHieu('dongVat28', l.getAnimal()),
    },
    banhTo: [deHieu('banhTo', l.getPengZuGan()), deHieu('banhTo', l.getPengZuZhi())],
    tuoiXung: `${hv('can', l.getDayChongGan())} ${hv('chi', l.getDayChong())} (${deHieu('conGiap', l.getDayChongShengXiao())})`,
    huongSat: hv('phuong', l.getDaySha()),
    ngayKy: NGAY_KY.filter(([, ngay]) => ngay.includes(am.ngay)).map(([ten]) => ten),
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
