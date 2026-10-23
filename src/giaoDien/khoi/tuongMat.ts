/**
 * Khoi "Tuong mat" (dot 7 phan 2) duoi moi nguoi: chon/chup anh → do ngay trong may. Thu vien MediaPipe (~17 MB) chi tai khi
 * bam chon anh (`tuongMatMp.ts`), khong cai san cung app. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`, quy uoc `QUY_UOC` muc 26.
 */
import { khoiNap, type VeKhoi } from '../chung.ts';

export const veKhoiTuongMat: VeKhoi = () => khoiNap('Tướng mặt (đo trong máy)', 'tuong-mat',
  () => import('./tuongMatVe.ts').then((m) => m.veTuongMat()));
