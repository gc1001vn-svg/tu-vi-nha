/**
 * Cac khoi thong tin hien duoi the ket qua mot nguoi (the "Tra cuu" va "Cua toi"), theo thu tu trong mang.
 * Moi mon mot file `src/giaoDien/khoi/<mon>.ts` (CSS rieng thi import ngay trong file do), export mot ham `VeKhoi`.
 * Ke hoach: `docs/ke-hoach/2026-10-19-tang-toc.md`.
 */
import type { VeKhoi } from '../chung.ts';
import { veKhoiBatTu } from './batTu.ts';
import { veKhoiHoangDao, veKhoiNhipSinhHoc, veKhoiThanSo } from './soHoc.ts';
import { veKhoiTuVi } from './tuVi.ts';

export const CAC_KHOI: readonly VeKhoi[] = [veKhoiTuVi, veKhoiBatTu, veKhoiThanSo, veKhoiHoangDao, veKhoiNhipSinhHoc];
