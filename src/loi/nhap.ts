/**
 * Doc chu go vao form: ngay "15031985" / "15/03/1985", gio "1430" / "7h30", noi sinh "hcm" / "ha noi",
 * so do "81", "81 cm", "0,81 m" (dan tu app Do cua iPhone).
 * Chi DOC: giao dien khong sua chu dang go (bo go Telex/VNI, con tro iPhone se hong), chi hien dong "= …" ben duoi.
 * Thuoc: `tests/Nhap.test.ts`.
 */
import { CHI, dinhDangNgay, soNgay, tuSoNgay, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';
import { NUOC_NGOAI, TINH } from './tinh.ts';

export interface Loi { readonly loi: string }

const CHUA_DU = 'Gõ đủ ngày, tháng, năm: vd 15031985 hoặc 15/03/1985';
// Ban phim so iPhone (inputmode=numeric) khong co dau "/", nen chi them cach go du 8 so.
const MO_HO = 'Gõ thêm dấu / cho rõ ngày và tháng, hoặc gõ đủ 8 số như 15031985';

function ngayTu(ngay: number, thang: number, nam: string, namNay: number): NgayDuong | Loi {
  const so = Number(nam);
  // Nam 2 chu so: chua toi nam nay la the ky nay (26 → 2026), qua roi la the ky truoc (85 → 1985).
  const nam4 = nam.length === 4 ? so : namNay - (namNay % 100) + so - (so > namNay % 100 ? 100 : 0);
  const d = { nam: nam4, thang, ngay };
  const lai = tuSoNgay(soNgay(d));
  return lai.nam === nam4 && lai.thang === thang && lai.ngay === ngay ? d : { loi: `Không có ngày ${dinhDangNgay(d)}` };
}

/** Ngay go tay (duong hay am deu dung): chi doc ngay/thang/nam, pham vi 1900–2100 do cho goi kiem. */
export function docNgayGo(s: string, namNay: number): NgayDuong | Loi {
  const t = s.trim();
  if (t === '') return { loi: 'Chưa nhập ngày sinh' };
  const m = /^(\d{1,2})[\s/.-]+(\d{1,2})[\s/.-]+(\d{2}|\d{4})$/.exec(t) ?? /^(\d\d)(\d\d)(\d\d|\d{4})$/.exec(t);
  if (m !== null) return ngayTu(Number(m[1]), Number(m[2]), m[3] ?? '', namNay);
  if (!/^\d{7}$/.test(t)) return { loi: CHUA_DU };
  // 7 chu so la "dmmyyyy" hay "ddmyyyy": chi lay khi dung mot cach ra ngay co that.
  const cach = [ngayTu(Number(t.slice(0, 1)), Number(t.slice(1, 3)), t.slice(3), namNay),
    ngayTu(Number(t.slice(0, 2)), Number(t.slice(2, 3)), t.slice(3), namNay)].filter((d) => !('loi' in d));
  const [mot, ...thua] = cach;
  return mot !== undefined && thua.length === 0 ? mot : { loi: MO_HO };
}

/** Gio go tay; trong = khong ro gio (null). */
export function docGioGo(s: string): { gio: number; phut: number } | null | Loi {
  const t = s.trim().toLowerCase();
  if (t === '') return null;
  const m = /^(\d{1,2})(?:\s*[:hg.\s]\s*(\d{1,2})?)?$/.exec(t) ?? /^(\d{1,2})(\d\d)$/.exec(t);
  if (m === null) return { loi: 'Chưa đọc được giờ: gõ vd 1430 hoặc 7h30, không rõ giờ thì để trống' };
  const gio = Number(m[1]);
  const phut = Number(m[2] ?? 0);
  if (gio > 23) return { loi: `Không có ${String(gio)} giờ: giờ từ 0 tới 23` };
  if (phut > 59) return { loi: `Không có ${String(phut)} phút: phút từ 0 tới 59` };
  return { gio, phut };
}

/**
 * So do (cm) go tay hay dan tu app Do: so tran la cm; co don vi thi uu tien cm, roi mm, roi m (chu dan co the kem nhan, so inch).
 * Dau phay hay cham deu la dau thap phan.
 */
export function docSoDoGo(s: string): { cm: number } | null | Loi {
  const t = s.replace(/\u00a0/g, ' ').trim().toLowerCase();
  if (t === '') return null;
  const so = (x: string): number => Number(x.replace(',', '.'));
  const tran = /^\d+(?:[.,]\d+)?$/.test(t) ? so(t) : undefined;
  if (tran !== undefined) return { cm: tran };
  for (const [dv, he] of [['cm', 1], ['mm', 0.1], ['m', 100]] as const) {
    const m = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*${dv}(?![a-z])`).exec(t);
    if (m?.[1] !== undefined) return { cm: Math.round(so(m[1]) * he * 100) / 100 };
  }
  if (/["″']|\bin\b|\bft\b/.test(t)) return { loi: 'Số đo theo inch: vào Cài đặt → Đo, chọn hệ mét rồi đo lại' };
  return { loi: 'Chưa đọc được số đo: gõ vd 81, 81,5 hoặc 81 cm' };
}

const hai = (n: number): string => String(n).padStart(2, '0');

/** "Mùi (13–15)": chi cua gio dong ho vua go (the ket qua moi doi ve +7). */
export function khungGio(gio: number, phut: number): string {
  const i = Math.floor((gio * 60 + phut + 60) / 120) % 12;
  return `${hv('chi', CHI.charAt(i))} (${hai((i * 2 + 23) % 24)}–${hai(i * 2 + 1)})`;
}

/** "TP. Hồ Chí Minh" → "ho chi minh": bo dau, chu thuong, dau cau thanh khoang trang, bo tien to tp/tinh/thanh pho. */
const chuan = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, ' ').trim().replace(/^(tp|tinh|thanh pho) /, '');
const lien = (s: string): string => s.replace(/ /g, '');

const BI_DANH: readonly (readonly [string, string])[] = [
  ['sai gon', 'TP. Hồ Chí Minh'], ['sg', 'TP. Hồ Chí Minh'], ['tphcm', 'TP. Hồ Chí Minh'], ['hcm', 'TP. Hồ Chí Minh'],
  ['hue', 'Thừa Thiên Huế'], ['vung tau', 'Bà Rịa – Vũng Tàu'], ['nuoc ngoai', NUOC_NGOAI], ['nn', NUOC_NGOAI],
];

// `khoa`: ten va bi danh viet lien (go "hanoi", "saigon" cung khop); `tat`: chu dau moi tu, bo phan trong ngoac.
const MUC = [...TINH.map(([t]) => t), NUOC_NGOAI].map((ten) => {
  const goc = chuan(ten.replace(/\(.*\)/, ''));
  const du = chuan(ten);
  return {
    ten, du,
    khoa: [du, goc, ...BI_DANH.filter(([, t]) => t === ten).map(([b]) => b)].map(lien),
    tat: goc.split(' ').map((w) => w.charAt(0)).join(''),
  };
});

/** 5 dung ten/bi danh > 4 dau ten > 3 dau mot tu > 2 viet tat > 1 chuoi con > 0 khong khop. */
function diem(q: string, m: (typeof MUC)[number]): number {
  const ql = lien(q);
  if (m.khoa.includes(ql)) return 5;
  if (m.khoa.some((t) => t.startsWith(ql))) return 4;
  if (` ${m.du}`.includes(` ${q}`)) return 3;
  if (m.tat.startsWith(ql)) return 2;
  return lien(m.du).includes(ql) ? 1 : 0;
}

// Sap xep on dinh: cung diem thi giu thu tu bac → nam cua `TINH`.
function xep(s: string): { ten: string; diem: number }[] {
  const q = chuan(s);
  if (q === '') return [];
  return MUC.map((m) => ({ ten: m.ten, diem: diem(q, m) })).filter((x) => x.diem > 0).sort((a, b) => b.diem - a.diem);
}

/** Toi da 6 goi y noi sinh (ten trong `TINH` hoac `NUOC_NGOAI`). */
export function timNoiSinh(s: string): string[] {
  return xep(s).slice(0, 6).map((x) => x.ten);
}

/** Noi sinh da chon chac: con dung mot goi y va chuoi go khop dung ten/bi danh; khong thi null. */
export function noiSinhChac(s: string): string | null {
  const [mot, ...thua] = xep(s);
  return mot !== undefined && mot.diem === 5 && thua.length === 0 ? mot.ten : null;
}
