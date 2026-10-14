/**
 * Bang Han-Viet — cau dai: 72 vat hau, thai than, Banh To bach ky, loc. Kieu va luat chung: `./index.ts`.
 *
 * Khoa: dung nguyen chuoi `lunar-typescript` 1.8.6 tra ra (chu gian the). Gia tri: { hv, nghia?, lyDo? }.
 * Chu: Unicode NFC; dau thanh kieu cu (Hỏa, Thủy, Hóa, Hòa); "Tỵ", "Kỷ", "Kỵ".
 * hv viet hoa chu dau; `nghia` BAT BUOC: dich nghia tieng Viet de hieu.
 * Claude soan 14/10/2026 — khong chep tu sach con ban quyen; doi chieu am bang `tests/HanVietDoiChieu.test.ts`.
 */
import type { Bang } from './index.ts';

export const CAU = {
  vatHau: {},
  thaiThan: {},
  banhTo: {},
  loc: {},
} satisfies Record<string, Bang>;
