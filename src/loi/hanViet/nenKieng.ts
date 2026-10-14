/**
 * Bang Han-Viet — viec nen lam / nen kieng (宜/忌) theo ngay va gio. Kieu va luat chung: `./index.ts`.
 *
 * Khoa: dung nguyen chuoi `lunar-typescript` 1.8.6 tra ra (chu gian the). Gia tri: { hv, nghia?, lyDo? }.
 * Chu: Unicode NFC; dau thanh kieu cu (Hỏa, Thủy, Hóa, Hòa); "Tỵ", "Kỷ", "Kỵ".
 * hv viet hoa chu dau ("Tế tự"); `nghia` BAT BUOC, loi thuong ngay nguoi Viet hieu ngay ("Cúng tế").
 * Claude soan 14/10/2026 — khong chep tu sach con ban quyen; doi chieu am bang `tests/HanVietDoiChieu.test.ts`.
 */
import type { Bang } from './index.ts';

export const NEN_KIENG = {
  nenKieng: {},
} satisfies Record<string, Bang>;
