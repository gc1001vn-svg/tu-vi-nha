/**
 * Khoi "Tuong mat" (dot 7 phan 2) duoi moi nguoi: chon/chup anh → do ngay trong may. Thu vien MediaPipe (~17 MB) chi tai khi
 * bam chon anh (`tuongMatMp.ts`), khong cai san cung app. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`, quy uoc `QUY_UOC` muc 26.
 */
import type { HoSo } from '../../loi/hoSo.ts';
import type { SoDoMat } from '../../loi/tuongMat.ts';
import { khoiNap, type VeKhoi } from '../chung.ts';

/** So do mat vua do cua tung nguoi — chi trong bo nho (anh, so deu khong luu may); khoi AI tong hop gui kem. */
export const MAT_DA_DO = new Map<string, { readonly so: SoDoMat; readonly cuoi: number }>();
/** Doi ten khong doi nguoi (cung cach khoi AI dat ma phien). */
export const khoaNguoi = (hs: HoSo): string => JSON.stringify({ ...hs, ten: '' });

export const veKhoiTuongMat: VeKhoi = (hs) => khoiNap('Tướng mặt (đo trong máy)', 'tuong-mat',
  () => import('./tuongMatVe.ts').then((m) => m.veTuongMat(khoaNguoi(hs))));
