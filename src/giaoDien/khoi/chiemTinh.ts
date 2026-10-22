/**
 * Khoi "Chiem tinh" (dot 6). Thu vien thien van nang nen chi nap khi mo khoi lan dau (`chiemTinhVe.ts`).
 * Ke hoach: `docs/ke-hoach/2026-10-22-dot-6.md`.
 */
import { el, khoi, lechNuocNgoai, type VeKhoi } from '../chung.ts';

export const veKhoiChiemTinh: VeKhoi = (hs) => {
  const than = el('div', { class: 'chiem-tinh' }, el('p', { class: 'ghi-chu' }, 'Đang tính…'));
  const k = khoi('Chiêm tinh', false, than);
  let daNap = false;
  k.addEventListener('toggle', () => {
    if (daNap || !k.hasAttribute('open')) return;
    daNap = true;
    import('./chiemTinhVe.ts')
      .then((m) => { than.replaceChildren(...m.veChiemTinh(hs, lechNuocNgoai(hs))); })
      .catch((e: unknown) => { than.replaceChildren(el('p', { class: 'loi' }, `Không tính được: ${e instanceof Error ? e.message : String(e)}`)); });
  });
  return k;
};
