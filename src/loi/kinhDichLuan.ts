/**
 * Luan que Kinh Dich (ke hoach `docs/ke-hoach/2026-11-03-kinh-dich.md`; cach chot: `docs/LUAN_KINH_DICH.md`; nguyen van, luat doc:
 * QUY_UOC muc 18). Tu lan gieo (`Gieo`, Mai Hoa them The – Dung) → cham chu cat hung trong nguyen van cac doan can doc (He Tu: cat hung
 * = duoc mat; hoi, lan = lo; vo cuu = kheo sua loi) → tong luan, loi khuyen, vi tri hao (He Tu, Vuong Bat), tien trinh chu → ho → bien,
 * viec hoi, loi nhac. Loi o `kinhDichLuanLoi.ts`. Thuoc: `tests/LuanKinhDich.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import { doanCanDoc, vachQue, type Gieo, type MaiHoaGio } from './kinhDich.ts';
import { DUNG_CUU, DUNG_LUC, QUE } from './kinhDichChu.ts';
import { GIAI } from './kinhDichGiai.ts';
import {
  CHINH, KET, KHUYEN, MUC_DOAN, NHAC, THE_DUNG, TIEN_TRINH, TRUNG, UNG, VIEC, VIEC_NHAC, VI_TRI,
} from './kinhDichLuanLoi.ts';

/**
 * Diem roi rac: moc gan phan vi 75 / 25 cua 3.000 lan gieo dong xu gia va 3.000 gio Mai Hoa (docs muc 5). Mai Hoa cong them The – Dung
 * ±1 nen phan bo rong hon (ngang nhau voi moc hien tai, de rieng de chinh).
 */
export const NGUONG_QUE = { xu: { thuan: 1.5, kho: -0.5 }, maiHoa: { thuan: 1.5, kho: -0.5 } } as const;

/**
 * Diem chu cat hung mot doan nguyen van, kep [−2, 2]. Chu ghep doc truoc roi xoa de khoi dem lai: 元吉 / 大吉 +2 · 吉 +1 · 无不利 +1 ·
 * 元亨 +1 · 亨 +0,5 · 悔亡 +0,5 · 利涉大川 +0,5 · 无咎 0 · 悔, 吝, 厲 −0,5 · 不利 −0,5 · 凶 −1,5.
 */
export function diemChu(s: string): number {
  let t = s, d = 0;
  const lay = (tu: string, w: number): void => { while (t.includes(tu)) { d += w; t = t.replace(tu, ''); } };
  lay('元吉', 2); lay('大吉', 2); lay('无不利', 1); lay('悔亡', 0.5); lay('利涉大川', 0.5); lay('元亨', 1); lay('亨', 0.5); lay('不利', -0.5); lay('无咎', 0);
  lay('吉', 1); lay('凶', -1.5); lay('悔', -0.5); lay('吝', -0.5); lay('厲', -0.5);
  return Math.max(-2, Math.min(2, d));
}

/** Nguyen van mot doan can doc. */
const chuDoan = (que: number, loai: 'thoan' | 'hao' | 'dung', hao: number): string => (loai === 'dung' ? (que === 1 ? DUNG_CUU : DUNG_LUC)
  : loai === 'thoan' ? QUE[que - 1]?.thoan ?? '' : QUE[que - 1]?.hao[hao - 1] ?? '');

/** Tuong que: ve dau loi giai que (truoc dau ":"), vd "Trời chồng lên trời". */
const tuong = (so: number): string => `${QUE[so - 1]?.tenDu ?? ''} — ${(GIAI[so - 1]?.que ?? '').split(':')[0]?.toLowerCase() ?? ''}`;

const TOT_MH = new Set(['dungSinhThe', 'theKhacDung', 'tyHoa']);

/** Diem ca lan gieo: doan chinh trong so 1, doan phu 0,5; que bien (khi doan doc chua phai loi que bien) 0,5; Mai Hoa The – Dung ±1. */
export function diemQue(g: Gieo, mh: MaiHoaGio | null = null): number {
  const doan = doanCanDoc(g);
  let d = doan.reduce((t, x) => t + diemChu(chuDoan(x.que, x.loai, x.hao)) * (x.chinh ? 1 : 0.5), 0);
  if (g.bien !== null && !doan.some((x) => x.loai === 'thoan' && x.que === g.bien)) d += 0.5 * diemChu(QUE[g.bien - 1]?.thoan ?? '');
  if (mh !== null) d += TOT_MH.has(mh.quanHe) ? 1 : -1;
  return d;
}

/** Loi khuyen tu cum chu trong doan chinh. */
function khuyen(s: string): string[] {
  const co = (re: RegExp): boolean => re.test(s);
  return [
    co(/征凶|勿用|往吝|不可涉大川|不利有攸往/u) ? KHUYEN.dung : co(/利涉大川|利有攸往|往吉|往有功|征吉/u) ? KHUYEN.tien : '',
    co(/貞凶/u) ? KHUYEN.doiCach : co(/[貞居]吉|安貞|利貞|利永貞|可貞/u) ? KHUYEN.giu : '',
    co(/終吉/u) ? KHUYEN.sau : '', co(/利見大人/u) ? KHUYEN.nguoi : '', co(/悔亡/u) ? KHUYEN.hetHoi : co(/无咎/u) ? KHUYEN.sua : '',
  ].filter((x) => x !== '');
}

/** Vi tri, trung, chinh, ung cua mot hao (Vuong Bat: hao dau, hao cuoi khong xet am duong dung vi). */
function viTri(que: number, h: number): string[] {
  const v = vachQue(que), duong = v[h - 1] === 1;
  const ung = v[h - 1] !== v[(h + 2) % 6];
  return [VI_TRI[h - 1] ?? '', ...(h === 2 || h === 5 ? [TRUNG] : []), ...(h === 1 || h === 6 ? [] : [duong === (h % 2 === 1) ? CHINH.dung : CHINH.sai]),
    ung ? UNG.co : UNG.khong];
}

export function luanQue(g: Gieo, mh: MaiHoaGio | null = null): DoanLuan[] {
  const doan = doanCanDoc(g), chinh = doan.find((x) => x.chinh) ?? doan[0];
  const chuChinh = chinh === undefined ? '' : chuDoan(chinh.que, chinh.loai, chinh.hao);
  const d = diemQue(g, mh), dc = diemChu(chuChinh);
  const ng = mh === null ? NGUONG_QUE.xu : NGUONG_QUE.maiHoa;
  const ket = d >= ng.thuan ? 'thuan' : d <= ng.kho ? 'kho' : 'vua';
  const muc = !/[吉凶悔吝厲咎亨]|利/u.test(chuChinh) ? MUC_DOAN.khong : dc > 0 ? MUC_DOAN.tot : dc < 0 ? MUC_DOAN.xau : MUC_DOAN.vua;
  const tong = [KET[ket], muc, ...(mh === null ? [] : [TOT_MH.has(mh.quanHe) ? THE_DUNG.tot : THE_DUNG.xau])];
  const kh = khuyen(chuChinh);
  const bienD = g.bien === null ? 0 : diemChu(QUE[g.bien - 1]?.thoan ?? '');
  const tien = [TIEN_TRINH.chu(tuong(g.chu)), TIEN_TRINH.ho(tuong(g.ho)),
    g.bien === null ? TIEN_TRINH.khongBien : TIEN_TRINH.bien(tuong(g.bien)),
    ...(g.bien === null ? [] : bienD > 0 ? [TIEN_TRINH.bienTot] : bienD < 0 ? [TIEN_TRINH.bienXau] : [])];
  const i = ket === 'thuan' ? 0 : ket === 'vua' ? 1 : 2;
  return [
    { tieuDe: 'Tổng luận', loi: tong },
    ...(kh.length === 0 ? [] : [{ tieuDe: 'Lời khuyên', loi: kh }]),
    ...(chinh?.loai === 'hao' ? [{ tieuDe: `Hào ${String(chinh.hao)} — vị trí trong quẻ`, loi: viTri(chinh.que, chinh.hao) }] : []),
    { tieuDe: 'Diễn tiến', loi: tien },
    { tieuDe: 'Theo việc hỏi', loi: [...Object.entries(VIEC).map(([t, c]) => `${t}: ${c[i] ?? ''}`), VIEC_NHAC] },
    { tieuDe: 'Nhìn cho đúng', loi: [...NHAC] },
  ];
}
