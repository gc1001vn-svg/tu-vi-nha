/**
 * Ho so ca nha chi nam trong trinh duyet (localStorage) + file sao luu. Du lieu nguoi nha KHONG BAO GIO vao repo.
 * iOS co the xoa du lieu web: xin luu ben, nhac sao luu (ke hoach dot 1). Moi truy cap bo nho boc try/catch.
 */
import { docSaoLuu, kiemHoSo, taoSaoLuu, type HoSo } from './loi/hoSo.ts';

const KHOA = 'tvn.v1';

export interface Kho { readonly hoSo: readonly HoSo[]; readonly saoLuuLuc: string | null }

const RONG: Kho = { hoSo: [], saoLuuLuc: null };
const thongDiep = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Doc kho. Hong thi tra kho rong + loi; ban goc chep sang khoa rieng, khong xoa. */
export function docKho(): { kho: Kho; loi: string | null; chanGhi: boolean } {
  let tho: string | null;
  try {
    tho = localStorage.getItem(KHOA);
  } catch {
    return { kho: RONG, loi: 'Trình duyệt chặn bộ nhớ: hồ sơ sẽ không được lưu lại.', chanGhi: true };
  }
  if (tho === null) return { kho: RONG, loi: null, chanGhi: false };
  try {
    const o = JSON.parse(tho) as { hoSo?: unknown; saoLuuLuc?: unknown };
    if (!Array.isArray(o.hoSo)) throw new Error('thiếu danh sách hồ sơ');
    return {
      kho: { hoSo: o.hoSo.map(kiemHoSo), saoLuuLuc: typeof o.saoLuuLuc === 'string' ? o.saoLuuLuc : null },
      loi: null, chanGhi: false,
    };
  } catch (e) {
    const khoaHong = `${KHOA}.hong.${new Date().toISOString()}`;
    try {
      localStorage.setItem(khoaHong, tho);
    } catch {
      // Khong giu duoc ban goc thi chan ghi: ghi de la mat han du lieu cu.
      return { kho: RONG, loi: `Dữ liệu cũ hỏng (${thongDiep(e)}), chưa sao chép được — app không ghi đè.`, chanGhi: true };
    }
    return { kho: RONG, loi: `Dữ liệu cũ hỏng (${thongDiep(e)}). Bản gốc giữ ở "${khoaHong}", chưa xoá.`, chanGhi: false };
  }
}

let daXinLuuBen = false;

/** Ghi kho. Tra loi (tieng Viet) neu khong ghi duoc. */
export function ghiKho(kho: Kho): string | null {
  try {
    localStorage.setItem(KHOA, JSON.stringify(kho));
  } catch (e) {
    return `Không lưu được: ${thongDiep(e)}`;
  }
  if (!daXinLuuBen) {
    daXinLuuBen = true;
    navigator.storage?.persist?.().catch(() => { /* khong xin duoc: van con nhac sao luu */ });
  }
  return null;
}

/** Xuat file sao luu. iPhone: bang Chia se → Luu vao Tep. Tra thoi diem sao luu, `null` neu nguoi dung huy. */
export async function xuatFile(ds: readonly HoSo[], ngay: string): Promise<string | null> {
  const luc = new Date().toISOString();
  const file = new File([JSON.stringify(taoSaoLuu(ds, luc), null, 1)], `tu-vi-nha-${ngay}.json`, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return null;
      throw e;
    }
    return luc;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); }, 10_000);
  return luc;
}

/** Doc file sao luu nguoi dung chon. Sai thi nem loi, khong dung toi kho. */
export async function docFile(f: File): Promise<HoSo[]> {
  let o: unknown;
  try {
    o = JSON.parse(await f.text());
  } catch (e) {
    throw new Error('File không phải JSON — không phải file sao lưu của Tử Vi Nhà', { cause: e });
  }
  return docSaoLuu(o);
}
