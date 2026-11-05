/**
 * Lop "de hieu" cho khoi Tu vi, Bat tu, Chiem tinh (ke hoach `docs/ke-hoach/2026-11-05-loi-giai-de-hieu.md`, QUY_UOC muc 43):
 * hop "Nói gọn" dau khoi, muc "Chi tiết cho người rành" dong san, giai nghia thuat ngu lan dau gap (`src/loi/thuatNgu.ts`).
 */
import type { DoanLuan } from '../../loi/chiemTinhLuan.ts';
import { chenNghia, type ThuatNgu } from '../../loi/thuatNgu.ts';
import { el } from '../chung.ts';
import './deHieu.css';

export const NOI_GON = 'Nói gọn';
export const CHI_TIET_RANH = 'Chi tiết cho người rành';

export const hopNoiGon = (cau: readonly string[]): HTMLElement =>
  el('div', { class: 'noi-gon' }, el('b', {}, NOI_GON), el('p', {}, cau.join(' ')));

/** Ve loi luan (tieu de + cau), bo cac cau da len "Nói gọn" (`bo`); doan het cau thi bo ca tieu de. */
export const veLuan = (doan: readonly DoanLuan[], bo: readonly string[] = []): HTMLElement[] => doan.flatMap((d) => {
  const loi = d.loi.filter((l) => !bo.includes(l));
  return loi.length === 0 ? [] : [el('h4', {}, d.tieuDe), ...loi.map((l) => el('p', {}, l))];
});

export const chiTietRanh = (...con: (Node | null)[]): HTMLElement =>
  el('details', { class: 'chi-tiet-ranh' }, el('summary', {}, CHI_TIET_RANH), ...con.filter((x) => x !== null));

/** Cho khong chen nghia: tieu de, luoi la so, bang, hinh, chu nho, dong muc tu giai nghia, phan cho nguoi ranh. "Nói gọn" thi co:
 * mon lay cau tu loi luan (dot 2) co the co thuat ngu — giai nghia ngay o do (doan nay doc dau tien). */
const BO_QUA = 'summary, h3, h4, table, svg, button, select, label, .tv-luoi, .ct-ba, .dai-van, .ngu-hanh, .nhan-muc, .ghi-chu, .canh-bao, '
  + '.chi-tiet-ranh, .dong-muc, .luoi-phi-tinh, .hinh-que, .sh-luoi, .sh-lon';

/** Chu nam trong muc gap dang dong (tru chinh khoi): doc sau, nen giai nghia sau phan dang mo. */
function trongMucDong(t: Node): boolean {
  for (let e = t.parentElement; e !== null; e = e.parentElement) {
    if (e instanceof HTMLDetailsElement && !e.open && !e.classList.contains('khoi')) return true;
  }
  return false;
}

/** Di qua chu hien ra theo thu tu doc — phan dang mo truoc, muc gap dang dong sau — chen nghia thuat ngu lan dau gap. */
export function giaiThuatNgu(goc: readonly Node[], bang: readonly ThuatNgu[], daGap = new Set<string>()): Set<string> {
  const ds: Text[] = [];
  for (const n of goc) {
    const di = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, {
      acceptNode: (t) => ((t.parentElement?.closest(BO_QUA) ?? null) !== null ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    if (n instanceof Text) ds.push(n);
    for (let t = di.nextNode(); t !== null; t = di.nextNode()) if (t instanceof Text) ds.push(t);
  }
  for (const t of [...ds.filter((x) => !trongMucDong(x)), ...ds.filter(trongMucDong)]) {
    const moi = chenNghia(t.data, bang, daGap);
    if (moi !== t.data) t.data = moi;
  }
  return daGap;
}
