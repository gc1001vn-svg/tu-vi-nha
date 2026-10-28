/**
 * Khoi "Chi tay" (dot 7 phan 3) duoi moi nguoi: chon/chup anh long ban tay → AI doc anh (Groq) ta 4 duong vao khung → loi soan
 * san. Ma nap khi mo khoi (`chiTayVe.ts`). Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`, quy uoc `QUY_UOC` muc 27.
 */
import { khoiNap, type VeKhoi } from '../chung.ts';

export const veKhoiChiTay: VeKhoi = (hs) => khoiNap('Chỉ tay (AI đọc ảnh)', 'chi-tay',
  () => import('./chiTayVe.ts').then((m) => m.veChiTay(hs.gioiTinh)));
