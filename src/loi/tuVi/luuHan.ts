/**
 * Tu vi theo ngay dang xem: Luu Thai Tue, tieu han (da co o la so), nguyet han, nhat han va 9 sao luu nien.
 * Quy tac `docs/QUY_UOC.md` muc 16 (tra 20/10): sao luu an nhu sao goc nhung theo can chi nam xem; nguyet han theo
 * Thai Thu Lang — cung tieu han lam thang Gieng, dem nghich toi thang sinh, roi thuan toi gio sinh duoc thang Gieng nam xem,
 * moi thang thuan mot cung (phai kia khoi tu Luu Thai Tue: Dau Quan, `iztro`); nhat han: cung thang lam mung 1, dem thuan.
 * Nguon goc: *Tu Vi Dau So Tan Bien* (Thai Thu Lang 1956) muc 10.4–10.5 va phan III muc 4 (9 sao luu); *Toan Thu* an Dau Quan.
 * Thuoc: `tests/LuuHan.test.ts` (bang vang tu `tuvi-mcp-server` 0.5.0 va `iztro` 2.6.2 — `scripts/doi-chieu/luu-han-*`).
 */
import { canChiNam, duongSangAm, type NgayDuong } from '../amLich.ts';
import { lapLaSo, type LaSo, type Sao } from './laSo.ts';

/** Nguyet han khoi tu cung tieu han (Thai Thu Lang, mac dinh) hay cung Luu Thai Tue (Dau Quan). */
export type NguyetHanTu = 'tieuHan' | 'thaiTue';

export interface SaoLuu extends Sao { readonly chi: number }

export interface LuuHan {
  readonly namAm: number;
  readonly canChi: string;
  /** Thang, ngay am dang xem; thang nhuan dung so cua thang truoc (QUY_UOC muc 5). */
  readonly thangAm: number;
  readonly nhuan: boolean;
  readonly ngayAm: number;
  /** Chi cung (0 = Ty). */
  readonly thaiTue: number;
  readonly tieuHan: number;
  readonly thang: number;
  readonly ngay: number;
  /** Cung thang, ngay theo phai con lai; bang `thang`, `ngay` thi hai phai trung nhau. */
  readonly thangPhaiKia: number;
  readonly ngayPhaiKia: number;
  readonly sao: readonly SaoLuu[];
}

/** Id sao goc (`laSo.ts`) cua 9 sao luu: Thai Tue, Tang Mon, Bach Ho, Loc Ton, Kinh Duong, Da La, Thien Ma, Thien Khoc, Thien Hu. */
const SAO_LUU = [15, 17, 23, 27, 52, 51, 98, 69, 70];

/** `thangSinh`: thang am sinh nhu khi lap la so (thang nhuan dung so cua thang truoc). */
export function tinhLuuHan(ls: LaSo, thangSinh: number, ngayXem: NgayDuong, tu: NguyetHanTu = 'tieuHan'): LuuHan {
  const am = duongSangAm(ngayXem);
  const thaiTue = (am.nam + 8) % 12;
  const tieuHan = ls.cung.find((c) => c.tieuHan === thaiTue)?.chi;
  if (tieuHan === undefined) throw new Error('tu vi: khong tim duoc tieu han');
  const thangTu = (goc: number): number => (goc - (thangSinh - 1) + ls.chiGio + am.thang - 1 + 24) % 12;
  const [thang, thangPhaiKia] = tu === 'tieuHan' ? [thangTu(tieuHan), thangTu(thaiTue)] : [thangTu(thaiTue), thangTu(tieuHan)];
  // Chin sao nay chi theo can chi nam: lap la so voi nam sinh = nam xem roi lay dung vi tri cac sao do.
  const goc = lapLaSo({ ngay: 1, thang: 1, nam: am.nam, chiGio: 0, gioiTinh: 'nam', namXem: am.nam });
  const sao = SAO_LUU.flatMap((id) => goc.cung.flatMap((c) =>
    c.sao.filter((s) => s.id === id).map((s) => ({ ...s, ten: `Lưu ${s.ten}`, doSang: null, chi: c.chi }))));
  return {
    namAm: am.nam, canChi: canChiNam(am.nam), thangAm: am.thang, nhuan: am.nhuan, ngayAm: am.ngay,
    thaiTue, tieuHan, thang, ngay: (thang + am.ngay - 1) % 12, thangPhaiKia, ngayPhaiKia: (thangPhaiKia + am.ngay - 1) % 12, sao,
  };
}

export interface DanhGia { readonly tot: number; readonly xau: number; readonly tong: number; readonly ket: 'tốt' | 'xấu' | 'lẫn lộn' }

/**
 * Tan Bien phan III muc 1.2: trong cac sao hoi ve cung han (chinh cung, hai cung tam hop, cung doi dien), qua nua tot la han
 * tot, qua nua xau la han xau. Tot/xau theo bang sao (`loai`); chinh tinh tinh theo do sang (Binh khong tot khong xau).
 */
export function danhGiaHan(ls: LaSo, lh: LuuHan, chi: number): DanhGia {
  const hoi = [0, 4, 6, 8].map((d) => (chi + d) % 12);
  const sao = [...hoi.flatMap((c) => ls.cung[c]?.sao ?? []), ...lh.sao.filter((s) => hoi.includes(s.chi))];
  const tot = sao.filter((s) => (s.loai === 1 ? s.doSang === 'M' || s.doSang === 'V' || s.doSang === 'Đ' : s.loai < 10)).length;
  const xau = sao.filter((s) => (s.loai === 1 ? s.doSang === 'H' : s.loai > 10)).length;
  const tong = sao.length;
  return { tot, xau, tong, ket: tot * 2 > tong ? 'tốt' : xau * 2 > tong ? 'xấu' : 'lẫn lộn' };
}
