/**
 * Tien goi AI (dot 7 phan 1): usage API × bang gia, cong don theo thang (gio VN), chan khi da tieu toi han muc.
 * Gia USD moi trieu token, tra 23/10/2026 o https://platform.claude.com/docs/en/about-claude/pricing — gia doi thi sua bang nay.
 * Han muc trong app la chan mem; chan cung la han muc chi dat trong Console (ke hoach `docs/ke-hoach/2026-10-23-dot-7.md`).
 */

/** vao: token vao · ghi: ghi bo nho dem 5 phut · doc: doc bo nho dem · ra: token ra (ca phan suy nghi). */
export interface Gia { readonly vao: number; readonly ghi: number; readonly doc: number; readonly ra: number }

export const GIA: Readonly<Record<string, Gia>> = {
  'claude-opus-5-5': { vao: 4, ghi: 5, doc: 0.2, ra: 20 },
  'claude-sonnet-5-5': { vao: 2, ghi: 2.5, doc: 0.1, ra: 10 },
  'claude-haiku-5-5': { vao: 0.1, ghi: 0.125, doc: 0.01, ra: 0.5 },
};
/**
 * Mo hinh khac bang (vd mo hinh du phong tra loi thay khi Opus, Sonnet tu choi — `fallbacks: "default"`): tinh theo gia
 * Opus 5 / Opus 4.8, dat nhat trong cac mo hinh du phong, de khong tinh thieu.
 */
const GIA_LA: Gia = { vao: 5, ghi: 6.25, doc: 0.5, ra: 25 };

export interface DungToken {
  readonly input_tokens: number;
  readonly output_tokens: number;
  readonly cache_creation_input_tokens?: number | null;
  readonly cache_read_input_tokens?: number | null;
}

/** USD cua mot lan goi. Haiku 5.5: prompt tren 100.000 token tinh gia gap 5 (trang gia, muc "Long context pricing"). */
export function tienGoi(moHinh: string, u: DungToken): number {
  const g = GIA[moHinh] ?? GIA_LA;
  const ghi = u.cache_creation_input_tokens ?? 0, doc = u.cache_read_input_tokens ?? 0;
  const x = moHinh === 'claude-haiku-5-5' && u.input_tokens + ghi + doc > 100_000 ? 5 : 1;
  return x * (u.input_tokens * g.vao + ghi * g.ghi + doc * g.doc + u.output_tokens * g.ra) / 1e6;
}

/** So tien da tieu trong `thang` ("2026-10", gio VN); sang thang moi thi tinh lai tu 0. */
export interface SoTien { readonly thang: string; readonly daTieu: number }

export const daTieuThang = (s: SoTien, thang: string): number => (s.thang === thang ? s.daTieu : 0);
export const congTien = (s: SoTien, thang: string, them: number): SoTien => ({ thang, daTieu: daTieuThang(s, thang) + them });
export const conHanMuc = (s: SoTien, thang: string, hanMuc: number): boolean => daTieuThang(s, thang) < hanMuc;
