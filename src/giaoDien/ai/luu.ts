/**
 * Cai dat AI trong may (dot 7 phan 1): khoa Groq — khoa localStorage RIENG `tvn.ai.v1`, khong nam trong kho ho so nen khong
 * bao gio vao file sao luu. Moi truy cap bo nho boc try/catch (`luuTru.ts`).
 */
const KHOA = 'tvn.ai.v1';

export interface CaiAI { readonly khoa: string | null }

export function docAI(): CaiAI {
  try {
    const o = JSON.parse(localStorage.getItem(KHOA) ?? 'null') as Partial<CaiAI> | null;
    return { khoa: typeof o?.khoa === 'string' ? o.khoa : null };
  } catch {
    return { khoa: null };
  }
}

/** Ghi; tra loi (tieng Viet) neu khong ghi duoc. */
export function ghiAI(c: CaiAI): string | null {
  try {
    localStorage.setItem(KHOA, JSON.stringify(c));
    return null;
  } catch (e) {
    return `Không lưu được: ${e instanceof Error ? e.message : String(e)}`;
  }
}
