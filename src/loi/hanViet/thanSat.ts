/**
 * Bang Han-Viet — than sat (cat than 吉神 / hung sat 凶煞) theo ngay. Kieu va luat chung: `./index.ts`.
 *
 * Khoa: dung nguyen chuoi `lunar-typescript` 1.8.6 tra ra (chu gian the). Gia tri: { hv, nghia?, lyDo? }.
 * Chu: Unicode NFC; dau thanh kieu cu (Hỏa, Thủy, Hóa, Hòa); "Tỵ", "Kỷ", "Kỵ".
 * Ten rieng: hv viet hoa moi chu ("Thiên Đức"). `nghia` chi khi can.
 * Claude soan 14/10/2026 — khong chep tu sach con ban quyen; doi chieu am bang `tests/HanVietDoiChieu.test.ts`.
 */
import type { Bang } from './index.ts';

export const THAN_SAT = {
  thanSat: {},
} satisfies Record<string, Bang>;
