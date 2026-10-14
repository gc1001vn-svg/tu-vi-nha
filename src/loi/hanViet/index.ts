/**
 * Bang Han-Viet cho MOI chuoi chu Han ma `lunar-typescript` tra ra (can chi, tiet khi, hoang lich,
 * bat tu, cuu tinh). Thu vien chi ra chu Trung Quoc; app hien tieng Viet qua bang nay, khong tu
 * dich o noi khac.
 *
 * Thuoc giu bang:
 *   - `tests/HanViet.test.ts`: phu du 100% chuoi thu vien tra ra, khong thua, dung quy uoc chu.
 *   - `tests/HanVietDoiChieu.test.ts`: tung am tiet `hv` khop am doc lap (Unihan + tu dien
 *     hanviet.csv, `tests/vang/am-han-viet.json`); khac thi muc do phai ghi `lyDo`.
 * Quy uoc chu: `docs/QUY_UOC.md` muc "Chu".
 */
import { CO_BAN } from './coBan.ts';
import { NEN_KIENG } from './nenKieng.ts';
import { THAN_SAT } from './thanSat.ts';
import { CAU } from './cau.ts';

export interface Muc {
  /** Am Han-Viet, doc tung chu theo thu tu chu Han trong khoa. */
  readonly hv: string;
  /** Loi tieng Viet de hien khi `hv` kho hieu (viec nen/kieng, cau Banh To, con giap...). */
  readonly nghia?: string;
  /** Vi sao `hv` khac am Han-Viet goc tung chu (vd "Mùi" cho 未) — thuoc doi chieu bo qua muc nay. */
  readonly lyDo?: string;
}
export type Bang = Readonly<Record<string, Muc>>;

export const NHOM = [
  'can', 'chi', 'conGiap', 'nguHanh', 'napAm', 'tietKhi', 'hau', 'vatHau', 'mua',
  'truc', 'thienThan', 'hoangDao', 'catHung', 'tu28', 'thatChinh', 'dongVat28', 'phuong', 'tuLinh',
  'batQuai', 'huong', 'thaiThan', 'banhTo', 'loc', 'nenKieng', 'thanSat', 'cuuTinh', 'lucDieu',
  'nguyetTuong', 'soCuu', 'tamPhuc', 'thapThan', 'truongSinh', 'cungHoangDao',
] as const;
export type Nhom = (typeof NHOM)[number];

/** Nhom la cau/cum tu (hv viet hoa chu dau), con lai la ten rieng (hv viet hoa moi chu). */
export const NHOM_CAU: ReadonlySet<Nhom> = new Set<Nhom>(['vatHau', 'thaiThan', 'banhTo', 'loc', 'nenKieng']);

export const BANG = { ...CO_BAN, ...NEN_KIENG, ...THAN_SAT, ...CAU } satisfies Record<Nhom, Bang>;
