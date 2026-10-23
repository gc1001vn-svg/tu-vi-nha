/**
 * Cai dat AI trong may (dot 7 phan 1): khoa API, han muc chi thang, so tien da tieu — khoa localStorage RIENG `tvn.ai.v1`,
 * khong nam trong kho ho so nen khong bao gio vao file sao luu. Moi truy cap bo nho boc try/catch (`luuTru.ts`).
 */
import type { SoTien } from '../../loi/ai/chiPhi.ts';

const KHOA = 'tvn.ai.v1';

export interface CaiAI { readonly khoa: string | null; readonly hanMuc: number; readonly tien: SoTien }

const MAC_DINH: CaiAI = { khoa: null, hanMuc: 5, tien: { thang: '', daTieu: 0 } };

export function docAI(): CaiAI {
  try {
    const o = JSON.parse(localStorage.getItem(KHOA) ?? 'null') as Partial<CaiAI> | null;
    if (o === null) return MAC_DINH;
    return {
      khoa: typeof o.khoa === 'string' ? o.khoa : null,
      hanMuc: typeof o.hanMuc === 'number' && o.hanMuc > 0 ? o.hanMuc : MAC_DINH.hanMuc,
      tien: typeof o.tien?.thang === 'string' && typeof o.tien.daTieu === 'number' ? o.tien : MAC_DINH.tien,
    };
  } catch {
    return MAC_DINH;
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
