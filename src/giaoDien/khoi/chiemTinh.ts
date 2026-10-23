/**
 * Khoi "Chiem tinh" (moi nguoi) va "Chiem tinh hom nay" (the Hom nay) — dot 6. Thu vien thien van nang nen chi nap
 * khi mo khoi lan dau (`chiemTinhVe.ts`). Ke hoach: `docs/ke-hoach/2026-10-22-dot-6.md`.
 */
import type { HoSo } from '../../loi/hoSo.ts';
import { khoiNap, lechNuocNgoai, type VeKhoi } from '../chung.ts';

export const veKhoiChiemTinh: VeKhoi = (hs) => khoiNap('Chiêm tinh', 'chiem-tinh',
  () => import('./chiemTinhVe.ts').then((m) => m.veChiemTinh(hs, lechNuocNgoai(hs))));

/** Dong ho doc dung luc mo khoi (lop vo); loi nhan qua tham so. */
export const veKhoiChiemTinhHomNay = (toi: HoSo | undefined): HTMLElement => khoiNap('Chiêm tinh hôm nay', 'chiem-tinh',
  () => import('./chiemTinhVe.ts').then((m) => m.veChiemTinhHomNay(toi, toi === undefined ? undefined : lechNuocNgoai(toi), Date.now())));
