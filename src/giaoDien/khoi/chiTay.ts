/**
 * Khoi "Chi tay" (dot 7 phan 3) duoi moi nguoi: nguoi xem nhin tay minh, chon tung o theo hinh mau → quy luat dong thuan tung o →
 * AI (Groq) dien giai, du doan theo cac luat do. Ma nap khi mo khoi (`chiTayVe.ts`). Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`,
 * quy uoc `QUY_UOC` muc 27.
 */
import { khoiNap, type VeKhoi } from '../chung.ts';

export const veKhoiChiTay: VeKhoi = (hs) => khoiNap('Chỉ tay (tự xem, AI diễn giải)', 'chi-tay',
  () => import('./chiTayVe.ts').then((m) => m.veChiTay(hs.gioiTinh)));
