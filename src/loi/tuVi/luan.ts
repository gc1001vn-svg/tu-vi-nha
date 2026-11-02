/**
 * Luan tu vi tang 1 — tong luan Menh – Than (ke hoach `docs/ke-hoach/2026-11-02-loi-giai-chuyen-gia.md`; cach chot, nguon:
 * `docs/LUAN_TU_VI.md` muc 7). Thu tu theo *Toan Thu*: xem cach cuc truoc, roi sao; Menh doc kem tam phuong tu chinh.
 * Loi Claude soan o `luanLoi.ts`. Thuoc: `tests/LuanTuVi.test.ts`.
 */
import { napAm, type Cung, type LaSo, type Sao } from './laSo.ts';
import { CUNG_SAO, HOP_KY, KET_CUNG, PHU_CUNG, SUC_KHOE } from './luanCungLoi.ts';
import {
  CAN_NAM, CHI_NAM, DIA_LOI, GHEP, KET_NAM, KET_VAN, KINH_DA_DIEP, NHAN_HOA, SAT_TRUNG, SAT_TRUNG_GIAI, THIEN_THOI, VAN_SAO,
} from './luanHanLoi.ts';
import type { LuuHan } from './luuHan.ts';
import {
  AM_DUONG, CACH_LOI, HOA, MENH_CUC, PHUC_DUC, SUC_MENH, THAI_TUE, TINH_HE, VIEC_SAO, VO_CHINH, VO_CHINH_NHAT_NGUYET,
} from './luanLoi.ts';
import { BINH, CHINH_TINH, CHU_DE, THAN_CU } from './nghia.ts';

const TEN_SANG = { M: 'miếu', V: 'vượng', Đ: 'đắc địa', B: 'bình hòa', H: 'hãm địa' } as const;

export interface DoanLuan { readonly tieuDe: string; readonly loi: readonly string[] }

const m12 = (x: number): number => ((x % 12) + 12) % 12;
const cungO = (ls: LaSo, chi: number): Cung => {
  const c = ls.cung[m12(chi)];
  if (c === undefined) throw new Error('tu vi: thieu cung');
  return c;
};
const co = (c: Cung, ...ten: string[]): boolean => ten.some((t) => c.sao.some((s) => s.ten === t));
const chinhTinh = (c: Cung): string[] => c.sao.filter((s) => s.loai === 1).map((s) => s.ten);
/** Tam phuong tu chinh: ban cung, cung doi, hai cung tam hop. */
const tamPhuong = (chi: number): number[] => [chi, chi + 6, chi + 4, chi + 8].map(m12);
const trongTp = (ls: LaSo, chi: number, ten: string): boolean => tamPhuong(chi).some((x) => co(cungO(ls, x), ten));
const giap = (ls: LaSo, chi: number, a: string, b: string): boolean => {
  const t = cungO(ls, chi - 1), p = cungO(ls, chi + 1);
  return (co(t, a) && co(p, b)) || (co(t, b) && co(p, a));
};

/** Khoa tinh he cua cung: "A+B" (dong cung) · "A|B+C" (sao le | chinh tinh cung doi) · "VCD|B+C" (vo chinh dieu). */
export function khoaTinhHe(ls: LaSo, chi: number): string {
  const ch = chinhTinh(cungO(ls, chi)), doi = chinhTinh(cungO(ls, chi + 6)).join('+');
  if (ch.length === 0) return `VCD|${doi}`;
  return ch.length === 1 ? `${ch[0] ?? ''}|${doi}` : ch.join('+');
}

const DIEM_SANG: Readonly<Record<string, number>> = { M: 2, V: 2, Đ: 1, B: 0, H: -2 };
const CAT: Readonly<Record<string, number>> = {
  'Tả Phù': 1, 'Hữu Bật': 1, 'Văn Xương': 1, 'Văn Khúc': 1, 'Thiên Khôi': 1, 'Thiên Việt': 1, 'Lộc Tồn': 1, 'Hóa Lộc': 1.5,
  'Hóa Quyền': 1, 'Hóa Khoa': 1,
};
const SAT: Readonly<Record<string, number>> = {
  'Kình Dương': 1, 'Đà La': 1, 'Hỏa Tinh': 1, 'Linh Tinh': 1, 'Địa Không': 1.5, 'Địa Kiếp': 1.5, 'Hóa Kỵ': 1.5,
};
/** Ban cung ×1, cung doi ×0,8, tam hop ×0,6 — "ban cung manh nhat, cung doi thu nhi" (docs/LUAN_TU_VI.md muc 7). */
const TRONG = [1, 0.8, 0.6, 0.6] as const;

/** Diem sang trung binh cua chinh tinh trong cung (null: vo chinh dieu). */
function sangCung(c: Cung): number | null {
  const d = c.sao.filter((s) => s.loai === 1 && s.doSang !== null).map((s) => DIEM_SANG[s.doSang ?? 'B'] ?? 0);
  return d.length === 0 ? null : d.reduce((a, b) => a + b, 0) / d.length;
}

/** Cat tinh tru sat tinh cua mot cung (khong trong so). */
const catSat = (c: Cung): number => c.sao.reduce((t, s) => t + (CAT[s.ten] ?? 0) - (SAT[s.ten] ?? 0), 0);

/** Diem suc Menh (chi de chon loi, khong hien so). */
export function diemMenh(ls: LaSo): number {
  const m = ls.menh;
  const gp = (giap(ls, m, 'Tả Phù', 'Hữu Bật') ? 0.5 : 0) + (giap(ls, m, 'Văn Xương', 'Văn Khúc') ? 0.5 : 0)
    + (giap(ls, m, 'Thái Dương', 'Thái Âm') ? 0.5 : 0) - (giap(ls, m, 'Địa Không', 'Địa Kiếp') ? 0.5 : 0)
    - (giap(ls, m, 'Hỏa Tinh', 'Linh Tinh') ? 0.5 : 0);
  return diemTamPhuong(ls, m) + gp;
}

/** Diem tam phuong tu chinh cua mot cung (Menh, cung dai van, cung tieu han): sang chinh tinh (vo chinh dieu muon cung doi mot
 * nua, − 1), Tuan Triet (sao sang bot, sao mo do — Tan Bien), cat − sat theo trong so ban cung / cung doi / tam hop. */
export function diemTamPhuong(ls: LaSo, chi: number): number {
  const c = cungO(ls, chi);
  let goc = sangCung(c) ?? (sangCung(cungO(ls, chi + 6)) ?? 0) * 0.5 - 1;
  if (c.tuan || c.triet) goc += goc > 0 ? -1 : 1;
  return goc + tamPhuong(chi).reduce((t, x, i) => t + catSat(cungO(ls, x)) * (TRONG[i] ?? 0.6), 0);
}

/** Nguong vung / yeu theo phan bo 3.000 la so gia (phan vi 75 = 2,7 · 25 = −0,9; 02/11): thang so tuong doi — khoang 1/4 la so
 * "vung", 1/4 "yeu" so voi cac la so khac, khong phai thang tuyet doi. */
export const NGUONG_MENH = { vung: 2.7, yeu: -0.9 } as const;

const sangToi = (ls: LaSo, ten: string, tot: boolean): boolean => tamPhuong(ls.menh).some((x) => cungO(ls, x).sao
  .some((s) => s.ten === ten && (tot ? s.doSang === 'M' || s.doSang === 'V' || s.doSang === 'Đ' : s.doSang === 'H')));

/** Cach cuc: [khoa loi, tot?, dieu kien]. Dinh nghia theo Toan Thu q.1 va sach Viet (docs/LUAN_TU_VI.md muc 3, 7). */
type DieuKien = (ls: LaSo, m: number, mc: Cung, k: string) => boolean;
const c = (khoa: string, tot: boolean, dk: DieuKien): readonly [string, boolean, DieuKien] => [khoa, tot, dk];
const CACH = [
  c('tuPhuDong', true, (_ls, _m, mc) => co(mc, 'Tử Vi') && co(mc, 'Thiên Phủ')),
  c('tuPhuTrieu', true, (ls, m, mc) => !co(mc, 'Tử Vi', 'Thiên Phủ') && [m + 4, m + 6, m + 8].some((x) => co(cungO(ls, x), 'Tử Vi'))
    && [m + 4, m + 6, m + 8].some((x) => co(cungO(ls, x), 'Thiên Phủ'))),
  c('phuTuongTrieu', true, (ls, m, mc) => !co(mc, 'Thiên Phủ', 'Thiên Tướng')
    && [m + 4, m + 6, m + 8].some((x) => co(cungO(ls, x), 'Thiên Phủ')) && [m + 4, m + 6, m + 8].some((x) => co(cungO(ls, x), 'Thiên Tướng'))),
  c('quanThan', true, (ls, m, mc) => co(mc, 'Tử Vi') && trongTp(ls, m, 'Tả Phù') && trongTp(ls, m, 'Hữu Bật')),
  c('cucHuong', true, (_ls, m, mc, k) => m === 6 && k === 'Tử Vi|Tham Lang' && !co(mc, ...Object.keys(SAT))),
  c('satTrieu', true, (_ls, m, _mc, k) => [0, 2, 6, 8].includes(m) && k.startsWith('Thất Sát|')),
  c('coNguyet', true, (ls, m, mc) => ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].every((t) => trongTp(ls, m, t))
    && !co(mc, 'Tử Vi', 'Thiên Phủ', 'Thất Sát', 'Phá Quân', 'Tham Lang')),
  c('satPhaTham', true, (_ls, _m, mc) => co(mc, 'Thất Sát', 'Phá Quân', 'Tham Lang')),
  c('nhatNguyetMinh', true, (ls) => sangToi(ls, 'Thái Dương', true) && sangToi(ls, 'Thái Âm', true)),
  c('nhatXuat', true, (_ls, m, mc) => m === 3 && co(mc, 'Thái Dương')),
  c('kimXan', true, (_ls, m, _mc, k) => m === 6 && k === 'Thái Dương|Thiên Lương'),
  c('nguyetLang', true, (_ls, m, _mc, k) => m === 11 && k === 'Thái Âm|Thiên Cơ'),
  c('minhChau', true, (ls, m, _mc, k) => m === 7 && k.startsWith('VCD|') && co(cungO(ls, 3), 'Thái Dương') && co(cungO(ls, 11), 'Thái Âm')),
  c('thachTrung', true, (_ls, m, _mc, k) => (m === 0 || m === 6) && k === 'Cự Môn|Thiên Cơ'),
  c('cuNhat', true, (_ls, _m, _mc, k) => k === 'Thái Dương+Cự Môn'),
  c('cuCo', true, (_ls, _m, _mc, k) => k === 'Thiên Cơ+Cự Môn'),
  c('thamHoa', true, (ls, m, mc) => co(mc, 'Tham Lang') && (trongTp(ls, m, 'Hỏa Tinh') || trongTp(ls, m, 'Linh Tinh'))),
  c('thamVu', true, (_ls, _m, _mc, k) => k === 'Vũ Khúc+Tham Lang'),
  c('vuThuVien', true, (_ls, m, mc) => m === 3 && co(mc, 'Vũ Khúc')),
  c('locMa', true, (ls, m) => (trongTp(ls, m, 'Lộc Tồn') || trongTp(ls, m, 'Hóa Lộc')) && trongTp(ls, m, 'Thiên Mã')),
  c('tamKy', true, (ls, m) => trongTp(ls, m, 'Hóa Lộc') && trongTp(ls, m, 'Hóa Quyền') && trongTp(ls, m, 'Hóa Khoa')),
  c('songLoc', true, (ls, m) => trongTp(ls, m, 'Lộc Tồn') && trongTp(ls, m, 'Hóa Lộc')),
  c('taHuuGiap', true, (ls, m) => giap(ls, m, 'Tả Phù', 'Hữu Bật')),
  c('xuongKhucGiap', true, (ls, m) => giap(ls, m, 'Văn Xương', 'Văn Khúc')),
  c('nhatNguyetGiap', true, (ls, m) => giap(ls, m, 'Thái Dương', 'Thái Âm')),
  c('toaQuy', true, (ls, m, mc) => (co(mc, 'Thiên Khôi') && trongTp(ls, m, 'Thiên Việt')) || (co(mc, 'Thiên Việt') && trongTp(ls, m, 'Thiên Khôi'))),
  c('vanQue', true, (_ls, m, mc) => (m === 1 || m === 7) && co(mc, 'Văn Xương') && co(mc, 'Văn Khúc')),
  c('kinhMieu', true, (ls, m, mc) => [1, 4, 7, 10].includes(m) && co(mc, 'Kình Dương')
    && tamPhuong(m).some((x) => cungO(ls, x).sao.some((s) => (CAT[s.ten] ?? 0) > 0))),
  c('maDau', true, (_ls, m, mc) => m === 6 && co(mc, 'Kình Dương')),
  c('khongKiepGiap', false, (ls, m) => giap(ls, m, 'Địa Không', 'Địa Kiếp')),
  c('kinhDaGiap', false, (ls, m, mc) => giap(ls, m, 'Kình Dương', 'Đà La') && !co(mc, 'Hóa Kỵ')),
  c('kinhDaGiapKy', false, (ls, m, mc) => giap(ls, m, 'Kình Dương', 'Đà La') && co(mc, 'Hóa Kỵ')),
  c('hoaLinhGiap', false, (ls, m) => giap(ls, m, 'Hỏa Tinh', 'Linh Tinh')),
  c('nhatNguyetPhan', false, (ls) => sangToi(ls, 'Thái Dương', false) && sangToi(ls, 'Thái Âm', false)),
  c('khongKiepMenh', false, (_ls, _m, mc) => co(mc, 'Địa Không', 'Địa Kiếp')),
  c('locPhungKhong', false, (_ls, _m, mc) => co(mc, 'Lộc Tồn', 'Hóa Lộc') && co(mc, 'Địa Không', 'Địa Kiếp')),
  c('maKhong', false, (_ls, _m, mc) => co(mc, 'Thiên Mã') && (mc.tuan || mc.triet || co(mc, 'Địa Không', 'Địa Kiếp'))),
];

/** Cac cach cuc cua Menh: [khoa, tot?]. */
export function cachCuc(ls: LaSo): (readonly [string, boolean])[] {
  const m = ls.menh, mc = cungO(ls, m), k = khoaTinhHe(ls, m);
  return CACH.filter(([, , dk]) => dk(ls, m, mc, k)).map(([t, tot]) => [t, tot] as const);
}

/** Tu hoa theo can nam (0 = Giap): [Loc, Quyen, Khoa, Ky] — cung bang `laSo.ts` (Altuvi nam Canh: Khoa Thai Am, Ky Thien Dong). */
export function tenTuHoa(can: number, phai: LaSo['phai']): readonly [string, string, string, string] {
  const B: readonly (readonly [string, string, string, string])[] = [
    ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'], ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
    ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
    ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'], ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
    phai === 'altuvi' ? ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'] : ['Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Thái Âm'],
    ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'], ['Thiên Lương', 'Tử Vi', 'Thiên Phủ', 'Vũ Khúc'],
    ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
  ];
  const h = B[can];
  if (h === undefined) throw new Error('tu vi: thieu tu hoa');
  return h;
}

/** Cau tu hoa nam sinh: hoa nao theo sao nao vao cung nao, viec gi thuan / vuong. */
const canCua = (nam: number): number => (((nam - 4) % 10) + 10) % 10;

/** Cau tu hoa theo can `can` (nam sinh, can cung dai van, can nam xem): hoa nao theo sao nao vao cung nao. Tu hoa nam sinh la sao
 * co san tren la so; tu hoa van, nam tim cung cua sao chu. */
function cauHoa(ls: LaSo, can: number, dau = '', goc = true): { chi: number; ten: string; loi: string }[] {
  return tenTuHoa(can, ls.phai).flatMap((sao, i) => {
    const tenHoa = (['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'] as const)[i] ?? 'Hóa Lộc';
    const c = ls.cung.find((x) => co(x, goc ? tenHoa : sao));
    return c === undefined ? [] : [{ chi: c.chi, ten: tenHoa, loi: `${dau}${tenHoa} theo sao ${sao} vào cung ${c.ten} (${CHU_DE[c.ten] ?? ''}): `
      + `${HOA[tenHoa]} — mang màu ${VIEC_SAO[sao] ?? sao}.` }];
  });
}

const HANH = { Kim: 'K', Thủy: 'T', Hỏa: 'H', Thổ: 'O', Mộc: 'M' } as const;
const SINH = 'MHOKT'; // Moc sinh Hoa sinh Tho sinh Kim sinh Thuy sinh Moc
const KHAC = 'MOTHK'; // Moc khac Tho khac Thuy khac Hoa khac Kim khac Moc
const ke = (vong: string, a: string, b: string): boolean => vong.charAt((vong.indexOf(a) + 1) % 5) === b;

/** Tong luan Menh – Than. `namAm`: nam am sinh (theo Tet) — can chi tuoi, tu hoa, vong Thai Tue, nap am. */
export function tongLuan(ls: LaSo, namAm: number): DoanLuan[] {
  const m = ls.menh, mc = cungO(ls, m), k = khoaTinhHe(ls, m);
  const can = (((namAm - 4) % 10) + 10) % 10, chi = m12(namAm - 4);

  const kieu: string[] = [];
  if (k.startsWith('VCD|')) {
    const nhatNguyet = sangToi(ls, 'Thái Dương', true) && sangToi(ls, 'Thái Âm', true);
    kieu.push(VO_CHINH + (nhatNguyet ? VO_CHINH_NHAT_NGUYET : ''), `Mượn sao cung đối — ${TINH_HE[k.slice(4)] ?? ''}`);
  } else {
    kieu.push(TINH_HE[k] ?? '');
    // Tung sao chinh: sang / binh / ham theo bang do sang Altuvi, nghia theo Tan Bien (`nghia.ts`).
    for (const s of mc.sao.filter((x) => x.loai === 1)) {
      const t = CHINH_TINH[s.ten], d = s.doSang;
      if (t === undefined || d === null) continue;
      kieu.push(`${s.ten} ${TEN_SANG[d]}: ${d === 'H' ? t.ham : d === 'B' ? t.binh ?? BINH : t.sang}`);
    }
  }

  const d = diemMenh(ls);
  const the = [d >= NGUONG_MENH.vung ? SUC_MENH.vung : d < NGUONG_MENH.yeu ? SUC_MENH.yeu : SUC_MENH.vua];
  if (mc.tuan || mc.triet) the.push(`Mệnh gặp ${mc.tuan && mc.triet ? 'cả Tuần lẫn Triệt' : mc.tuan ? 'Tuần' : 'Triệt'}: như có tấm `
    + 'màn che — sao sáng bị bớt sức, sao mờ lại đỡ xấu; việc hay bị chậm, bị cản giữa chừng.');

  const cc = cachCuc(ls);
  const satMenh = mc.sao.filter((s) => (SAT[s.ten] ?? 0) > 0).map((s) => s.ten);
  const cach = cc.map(([t]) => CACH_LOI[t] ?? '');
  if (cc.some(([, tot]) => tot) && (satMenh.length >= 2 || satMenh.includes('Hóa Kỵ'))) {
    cach.push(`Mệnh có ${satMenh.join(', ')} nên các cách tốt trên bị phá một phần: phát không bền, phải biết giữ (sách cổ: "cát tinh `
      + 'gặp hung tinh như ngọc có vết").');
  }

  const hoa = cauHoa(ls, canCua(namAm)).map((h) => h.loi);

  const hm = napAm(chi + 1, can + 1); // chu cai hanh K T H O M, cung bang HANH
  const hc = HANH[(ls.cuc.split(' ')[0] ?? 'Thổ') as keyof typeof HANH] ?? 'O';
  const viet = [
    THAI_TUE[m12(m - chi) % 4] ?? '',
    hm === hc ? MENH_CUC.dong : ke(SINH, hm, hc) || ke(SINH, hc, hm) ? MENH_CUC.sinh : MENH_CUC.khac,
    chi % 2 === m % 2 ? AM_DUONG.thuan : AM_DUONG.nghich,
  ];

  const than = cungO(ls, ls.than), pd = ls.cung.find((x) => x.ten === 'Phúc Đức');
  const dpd = pd === undefined ? 0 : (sangCung(pd) ?? 0) + catSat(pd);
  const sau = [THAN_CU[than.ten] ?? '', dpd >= 2 ? PHUC_DUC.tot : dpd <= -1 ? PHUC_DUC.kem : PHUC_DUC.vua];

  return [
    { tieuDe: 'Kiểu người (sao chính cung Mệnh)', loi: kieu },
    { tieuDe: 'Thế của Mệnh', loi: the },
    ...(cach.length === 0 ? [] : [{ tieuDe: 'Cách cục', loi: cach }]),
    { tieuDe: 'Tứ hóa năm sinh: việc thuận, việc vướng', loi: hoa },
    { tieuDe: 'Gốc và thái độ sống (lối xem Việt)', loi: viet },
    { tieuDe: 'Nửa đời sau và phúc', loi: sau },
  ];
}

const CAT_TEN = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn'];
const SAT_TEN = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

/**
 * Diem mot cung: sang chinh tinh ± 1,5 moi sao hop / ky voi cung (`HOP_KY`) + cat − sat ban cung (×1) va cung doi (×0,8); vo chinh
 * dieu muon cung doi (mot nua, − 1); Tuan Triet: sao sang bot, sao mo do (nhu Menh).
 */
export function diemCung(ls: LaSo, chi: number): number {
  const c = cungO(ls, chi), doi = cungO(ls, chi + 6), hk = HOP_KY[c.ten];
  const nghieng = (x: Cung): number => chinhTinh(x).reduce((t, s) => t + (hk?.hop.includes(s) === true ? 1.5 : 0) - (hk?.ky.includes(s) === true ? 1.5 : 0), 0);
  let goc = chinhTinh(c).length > 0 ? (sangCung(c) ?? 0) + nghieng(c) : ((sangCung(doi) ?? 0) + nghieng(doi)) * 0.5 - 1;
  if (c.tuan || c.triet) goc += goc > 0 ? -1 : 1;
  return goc + catSat(c) + catSat(doi) * 0.8;
}

/** Nguong "thuan / phai de tam" theo phan bo 11 cung × 3.000 la so gia (phan vi 75 = 2,7 · 25 = −1,0; 02/11): thang tuong doi. */
export const NGUONG_CUNG = { tot: 2.7, kem: -1.0 } as const;

/** Nhat (cha), Nguyet (me) sang hay mo — Toan Thu: "xem cha me lay Thai Duong lam cha, Thai Am lam me" (o dau cung xet). */
function chaMe(ls: LaSo): string[] {
  return ([['Thái Dương', 'cha'], ['Thái Âm', 'mẹ']] as const).flatMap(([ten, ai]) => {
    const s = ls.cung.flatMap((c) => c.sao).find((x) => x.ten === ten);
    if (s?.doSang === undefined || s.doSang === null) return [];
    return [s.doSang === 'B' || s.doSang === 'H' ? `Sao chỉ ${ai} (${ten}) mờ: ${ai} vất vả, nên quan tâm ${ai} nhiều hơn.`
      : `Sao chỉ ${ai} (${ten}) sáng: ${ai} có sức, giúp được mình.`];
  });
}

/** Luan mot cung (tang 2): sao chinh theo nghia rieng cua cung, sao phu dang ke, cat / sat, tu hoa, Tuan Triet, Than cu, ket luan. */
export function luanCung(ls: LaSo, chi: number, namAm: number): string[] {
  const c = cungO(ls, chi);
  if (chi === ls.menh) {
    const k = khoaTinhHe(ls, chi);
    return [k.startsWith('VCD|') ? VO_CHINH : TINH_HE[k] ?? '', 'Cung Mệnh: xem đủ ở phần "Tổng luận lá số" bên trên.'];
  }
  const bang = CUNG_SAO[c.ten] ?? {};
  const loiSao = (s: Sao): string => {
    const t = bang[s.ten];
    if (t === undefined) return '';
    const cau = typeof t === 'string' ? t : s.doSang === 'B' || s.doSang === 'H' ? t[1] : t[0];
    return `${s.ten}${s.doSang === null ? '' : ` (${TEN_SANG[s.doSang]})`}: ${cau}`;
  };
  const chinh = c.sao.filter((s) => s.loai === 1), doi = cungO(ls, chi + 6).sao.filter((s) => s.loai === 1);
  const out = chinh.length > 0 ? chinh.map(loiSao)
    : [`Không có sao chính, mượn sao cung đối (${doi.map((s) => s.ten).join(', ')}) nên ứng nhẹ hơn. ${doi.map(loiSao).join(' ')}`];
  const rieng = Object.entries(PHU_CUNG[c.ten] ?? {}).filter(([t]) => co(c, t));
  if (rieng.length > 0) out.push(`Sao phụ đáng kể — ${rieng.map(([, l]) => l).join('; ')}.`);
  const daNoi = (t: string): boolean => rieng.some(([r]) => r === t);
  const cat = CAT_TEN.filter((t) => co(c, t) && !daNoi(t)), sat = SAT_TEN.filter((t) => co(c, t) && !daNoi(t));
  if (cat.length > 0) out.push(`Có ${cat.join(', ')} giúp: việc này dễ có người đỡ, thuận hơn.`);
  if (sat.length > 0) out.push(`Gặp ${sat.join(', ')}: việc này hay trắc trở, cần cẩn thận.`);
  out.push(...cauHoa(ls, canCua(namAm)).filter((h) => h.chi === chi).map((h) => h.loi));
  if (c.tuan || c.triet) {
    out.push(`Có ${c.tuan && c.triet ? 'Tuần, Triệt' : c.tuan ? 'Tuần' : 'Triệt'}: việc này hay bị chậm, bị cản; sao xấu trong cung lại được giảm bớt.`);
  }
  if (c.ten === 'Phụ Mẫu') out.push(...chaMe(ls));
  if (chi === ls.than) out.push(THAN_CU[c.ten] ?? '');
  const d = diemCung(ls, chi), viec = CHU_DE[c.ten] ?? c.ten.toLowerCase();
  out.push((d >= NGUONG_CUNG.tot ? KET_CUNG.tot : d < NGUONG_CUNG.kem ? KET_CUNG.kem : KET_CUNG.vua).replace('{}', viec));
  if (c.ten === 'Tật Ách') out.push(SUC_KHOE);
  return out.filter((x) => x !== '');
}

// ---- Tang 3: van han (docs/LUAN_TU_VI.md muc 10) ----

type QuanHe = 'dong' | 'sinhNhap' | 'sinhXuat' | 'khacNhap' | 'khacXuat';
/** `a` so voi `b` (phia minh): a sinh b = sinh nhap, b sinh a = sinh xuat, a khac b = khac nhap, b khac a = khac xuat. */
const quanHe = (a: string, b: string): QuanHe => (a === b ? 'dong' : ke(SINH, a, b) ? 'sinhNhap' : ke(SINH, b, a) ? 'sinhXuat'
  : ke(KHAC, a, b) ? 'khacNhap' : 'khacXuat');
/** Hanh tam hop theo chi % 4: Than Ty Thin Thuy · Ty Dau Suu Kim · Dan Ngo Tuat Hoa · Hoi Mao Mui Moc. */
const TAM_HOP = 'TKHM';
const CHI_HANH = 'TOMMOHHOKKOT';
const CAN_HANH = 'MMHHOOKKTT';
const CAN_TEN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
/** Bo sao (Thien Luong): Tu Phu Vu Tuong · Sat Pha Liem Tham · Co Nguyet Dong Luong · Cu Nhat. */
const BO: Readonly<Record<string, number>> = {
  'Tử Vi': 0, 'Thiên Phủ': 0, 'Vũ Khúc': 0, 'Thiên Tướng': 0, 'Thất Sát': 1, 'Phá Quân': 1, 'Tham Lang': 1, 'Liêm Trinh': 1,
  'Thiên Cơ': 2, 'Thái Âm': 2, 'Thiên Đồng': 2, 'Thiên Lương': 2, 'Cự Môn': 3, 'Thái Dương': 3,
};
const boCung = (ls: LaSo, chi: number): number[] => {
  const ch = chinhTinh(cungO(ls, chi));
  return (ch.length > 0 ? ch : chinhTinh(cungO(ls, chi + 6))).map((t) => BO[t] ?? -1);
};
const PHA = [[0, 9], [1, 4], [2, 11], [3, 6], [5, 8], [7, 10]];
const LUU_DIEM: Readonly<Record<string, number>> = {
  'Lưu Lộc Tồn': 1, 'Lưu Thiên Mã': 0.5, 'Lưu Kình Dương': -1, 'Lưu Đà La': -1, 'Lưu Tang Môn': -0.5, 'Lưu Bạch Hổ': -0.5,
  'Lưu Thiên Khốc': -0.5, 'Lưu Thiên Hư': -0.5,
};

export type KetVan = 'thuan' | 'vua' | 'kho';
/** Nguong theo phan bo (phan vi 75 / 25; 02/11): dai van — 12 cung × 3.000 la so gia (3,6 · −0,4); nam — 3.000 la so × 3 nam
 * xem 2024, 2026, 2028 (2,1 · −2,7). Thang tuong doi: khoang 1/4 "thuan", 1/4 "kho". */
export const NGUONG_VAN = { thuan: 3.6, kho: -0.4 } as const;
export const NGUONG_NAM = { thuan: 2.1, kho: -2.7 } as const;

/** Cau sao chinh o cung van / han (VAN_SAO, cau sang / mo); vo chinh dieu muon cung doi. */
function saoVan(ls: LaSo, chi: number, cho: string): string[] {
  const loi = (s: Sao): string => {
    const t = VAN_SAO[s.ten];
    if (t === undefined) return '';
    return `${s.ten}${s.doSang === null ? '' : ` (${TEN_SANG[s.doSang]})`}: ${typeof t === 'string' ? t : s.doSang === 'B' || s.doSang === 'H' ? t[1] : t[0]}`;
  };
  const ch = cungO(ls, chi).sao.filter((s) => s.loai === 1), doi = cungO(ls, chi + 6).sao.filter((s) => s.loai === 1);
  return ch.length > 0 ? ch.map(loi)
    : [`${cho} không có sao chính, mượn sao cung đối (${doi.map((s) => s.ten).join(', ')}) nên ứng nhẹ hơn. ${doi.map(loi).join(' ')}`];
}

/** Cat / sat trong cung va cung doi (ten), de giai thich diem. */
function catSatCau(ls: LaSo, chi: number): string[] {
  const o = [chi, chi + 6].map((x) => cungO(ls, x));
  const cat = CAT_TEN.filter((t) => o.some((c) => co(c, t))), sat = SAT_TEN.filter((t) => o.some((c) => co(c, t)));
  return [...(cat.length > 0 ? [`Cát tinh hội về: ${cat.join(', ')}.`] : []), ...(sat.length > 0 ? [`Sát tinh hội về: ${sat.join(', ')}.`] : [])];
}

/** Luan mot dai van (cung `chi`): tam diem + cau. Dai van la chinh (Thien Luong, Tan Bien). */
export function luanDaiVan(ls: LaSo, chi: number, namAm: number): { ket: KetVan; diem: number; loi: string[] } {
  const c = cungO(ls, chi), canSinh = canCua(namAm), chiSinh = m12(namAm - 4);
  const tt = quanHe(TAM_HOP.charAt(chi % 4), TAM_HOP.charAt(chiSinh % 4));
  const boMenh = boCung(ls, ls.menh), nh = boCung(ls, chi).some((b) => boMenh.includes(b));
  const hc = CHI_HANH.charAt(chi), hm = napAm(chiSinh + 1, canSinh + 1);
  const dl = hc === hm || ke(SINH, hc, hm) ? 'thuan' : ke(KHAC, hc, hm) ? 'can' : 'bo';
  const hoa = cauHoa(ls, CAN_TEN.indexOf(c.canChi.split(' ')[0] ?? ''), 'Vận này: ', false);
  const tp = tamPhuong(chi);
  const dHoa = hoa.reduce((t, h) => t + (!tp.includes(h.chi) ? 0 : h.ten === 'Hóa Kỵ' ? (h.chi === chi ? -2 : -1) : h.ten === 'Hóa Lộc' ? 1 : 0.5), 0);
  const diem = diemTamPhuong(ls, chi) + { dong: 1.5, khacXuat: 0.5, sinhXuat: 0, sinhNhap: -0.5, khacNhap: -1.5 }[tt] + (nh ? 1 : 0)
    + { thuan: 0.5, bo: 0, can: -0.5 }[dl] + dHoa;
  const ket: KetVan = diem >= NGUONG_VAN.thuan ? 'thuan' : diem < NGUONG_VAN.kho ? 'kho' : 'vua';
  return {
    ket, diem,
    loi: [`Đại vận ${String(c.daiVan)}–${String(c.daiVan + 9)} tuổi ở cung ${c.ten}: mười năm này chuyện ${CHU_DE[c.ten] ?? ''} nổi lên.`,
      ...saoVan(ls, chi, 'Cung vận'), ...catSatCau(ls, chi), THIEN_THOI[tt], nh ? NHAN_HOA.hop : NHAN_HOA.khac, DIA_LOI[dl],
      ...hoa.map((h) => h.loi), KET_VAN[ket]],
  };
}

/** Moi dai van trong doi theo tuoi bat dau: cung, ket luan. */
export function dsDaiVan(ls: LaSo, namAm: number): { tuoi: number; chi: number; ten: string; ket: KetVan }[] {
  return [...ls.cung].sort((a, b) => a.daiVan - b.daiVan).map((c) => ({ tuoi: c.daiVan, chi: c.chi, ten: c.ten, ket: luanDaiVan(ls, c.chi, namAm).ket }));
}

/** Luan nam dang xem: cung tieu han, sao luu, tu hoa nam, can nam so can tuoi, nam tuoi / xung / pha, Kinh Da diep, That Sat trung
 * phung; roi ghep voi dai van dang chay (Tan Bien: dai van tot thi nam xau cung nhe). */
export function luanNam(ls: LaSo, lh: LuuHan, namAm: number): { ket: KetVan; diem: number; loi: string[] } {
  const th = lh.tieuHan, c = cungO(ls, th), canSinh = canCua(namAm), chiSinh = m12(namAm - 4);
  const canX = canCua(lh.namAm), chiX = m12(lh.namAm - 4), tp = tamPhuong(th);
  const luuTp = tp.reduce((t, x, i) => t + lh.sao.filter((s) => s.chi === x).reduce((u, s) => u + (LUU_DIEM[s.ten] ?? 0), 0) * (TRONG[i] ?? 0.6), 0);
  const hoa = cauHoa(ls, canX, 'Năm nay: ', false);
  const dHoa = hoa.reduce((t, h) => t + (!tp.includes(h.chi) ? 0 : h.ten === 'Hóa Kỵ' ? (h.chi === th ? -2 : -1) : h.ten === 'Hóa Lộc' ? 1 : 0.5), 0);
  const qh = quanHe(CAN_HANH.charAt(canX), CAN_HANH.charAt(canSinh));
  const chi = chiX === chiSinh ? 'tuoi' : m12(chiX - chiSinh) === 6 ? 'xung' : PHA.some(([a, b]) => (a === chiX && b === chiSinh) || (b === chiX && a === chiSinh)) ? 'pha' : null;
  const vung = [th, th + 6].map(m12);
  const luuO = (ten: string): boolean => lh.sao.some((s) => s.ten === ten && vung.includes(s.chi));
  const luuKD = luuO('Lưu Kình Dương') || luuO('Lưu Đà La');
  const diep = luuKD && vung.some((x) => co(cungO(ls, x), 'Kình Dương', 'Đà La'));
  const trung = luuKD && tp.some((x) => co(cungO(ls, x), 'Thất Sát'));
  const giai = trung && tp.some((x) => co(cungO(ls, x), 'Tử Vi', 'Thiên Tướng', 'Lộc Tồn'));
  const diem = diemTamPhuong(ls, th) + luuTp + dHoa + { sinhNhap: 1, khacXuat: 0.5, dong: 0, sinhXuat: -0.5, khacNhap: -1 }[qh]
    + (chi === null ? 0 : -0.5) + (diep ? -1.5 : 0) + (trung && !giai ? -1.5 : 0);
  const ket: KetVan = diem >= NGUONG_NAM.thuan ? 'thuan' : diem < NGUONG_NAM.kho ? 'kho' : 'vua';
  const dv = ls.daiVanNay === null ? null : luanDaiVan(ls, ls.daiVanNay, namAm).ket;
  const ghep = GHEP[dv === null ? 'chua' : `${dv}|${ket}`] ?? '';
  const luuVe = lh.sao.filter((s) => vung.includes(s.chi) && (LUU_DIEM[s.ten] ?? 0) !== 0).map((s) => s.ten);
  return {
    ket, diem,
    loi: [`Năm ${lh.canChi}: tiểu hạn ở cung ${c.ten} — chuyện ${CHU_DE[c.ten] ?? ''} nổi lên trong năm.`, ...saoVan(ls, th, 'Cung hạn'),
      ...catSatCau(ls, th), ...(luuVe.length > 0 ? [`Sao lưu năm nay hội về: ${luuVe.join(', ')}.`] : []),
      ...hoa.map((h) => h.loi), CAN_NAM[qh], ...(chi === null ? [] : [CHI_NAM[chi]]), ...(diep ? [KINH_DA_DIEP] : []),
      ...(trung ? [SAT_TRUNG + (giai ? SAT_TRUNG_GIAI : '')] : []), `${KET_NAM[ket]}; ${ghep}`],
  };
}
