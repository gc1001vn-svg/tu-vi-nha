/**
 * Khoi "Chiem tinh" (moi nguoi) va "Chiem tinh hom nay" (the Hom nay) — dot 6. Thu vien thien van nang nen chi nap
 * khi mo khoi lan dau (`chiemTinhVe.ts`). Ke hoach: `docs/ke-hoach/2026-10-22-dot-6.md`.
 */
import type { HoSo } from '../../loi/hoSo.ts';
import { el, khoi, lechNuocNgoai, type VeKhoi } from '../chung.ts';

type Ve = typeof import('./chiemTinhVe.ts');

function khoiLuoi(tieuDe: string, ve: (m: Ve) => Node[]): HTMLElement {
  const than = el('div', { class: 'chiem-tinh' }, el('p', { class: 'ghi-chu' }, 'Đang tính…'));
  const k = khoi(tieuDe, false, than);
  let daNap = false;
  k.addEventListener('toggle', () => {
    if (daNap || !k.hasAttribute('open')) return;
    daNap = true;
    import('./chiemTinhVe.ts')
      .then((m) => { than.replaceChildren(...ve(m)); })
      .catch((e: unknown) => { than.replaceChildren(el('p', { class: 'loi' }, `Không tính được: ${e instanceof Error ? e.message : String(e)}`)); });
  });
  return k;
}

export const veKhoiChiemTinh: VeKhoi = (hs) => khoiLuoi('Chiêm tinh', (m) => m.veChiemTinh(hs, lechNuocNgoai(hs)));

/** Dong ho doc dung luc mo khoi (lop vo); loi nhan qua tham so. */
export const veKhoiChiemTinhHomNay = (toi: HoSo | undefined): HTMLElement => khoiLuoi('Chiêm tinh hôm nay',
  (m) => m.veChiemTinhHomNay(toi, toi === undefined ? undefined : lechNuocNgoai(toi), Date.now()));
