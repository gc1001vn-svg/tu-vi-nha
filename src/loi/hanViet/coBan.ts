/**
 * Bang Han-Viet — ten rieng co ban: can chi, ngu hanh, nap am, tiet khi, truc, 28 tu, cuu tinh, thap than. Kieu va luat chung: `./index.ts`.
 *
 * Khoa: dung nguyen chuoi `lunar-typescript` 1.8.6 tra ra (chu gian the). Gia tri: { hv, nghia?, lyDo? }.
 * Chu: Unicode NFC; dau thanh kieu cu (Hỏa, Thủy, Hóa, Hòa); "Tỵ", "Kỷ", "Kỵ".
 * Ten rieng: hv viet hoa moi chu ("Giáp Tý", "Hải Trung Kim", "Lập Xuân"). `nghia` chi khi hv kho hieu.
 * Claude soan 14/10/2026 — khong chep tu sach con ban quyen; doi chieu am bang `tests/HanVietDoiChieu.test.ts`.
 */
import type { Bang } from './index.ts';

export const CO_BAN = {
  can: {},
  chi: {},
  conGiap: {},
  nguHanh: {},
  napAm: {},
  tietKhi: {},
  hau: {},
  mua: {},
  truc: {},
  thienThan: {},
  hoangDao: {},
  catHung: {},
  tu28: {},
  thatChinh: {},
  dongVat28: {},
  phuong: {},
  tuLinh: {},
  batQuai: {},
  huong: {},
  cuuTinh: {},
  lucDieu: {},
  nguyetTuong: {},
  soCuu: {},
  tamPhuc: {},
  thapThan: {},
  truongSinh: {},
  cungHoangDao: {},
} satisfies Record<string, Bang>;
