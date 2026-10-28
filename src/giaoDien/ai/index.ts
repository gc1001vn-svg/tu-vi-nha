/**
 * Cua vao AI (dot 7 phan 1) trong goi mo app: chi cac khoi gap/mo. Ma AI nap luc mo khoi lan dau
 * (`phien.ts`, `caiDat.ts`) nen goi mo app khong keo theo. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import type { NgayDuong } from '../../loi/amLich.ts';
import type { KhungChiTay } from '../../loi/chiTay.ts';
import type { GioiTinh, HoSo, TinhRa } from '../../loi/hoSo.ts';
import type * as KinhDichTinh from '../../loi/kinhDich.ts';
import type * as KinhDichChu from '../../loi/kinhDichChu.ts';
import type * as KinhDichGiai from '../../loi/kinhDichGiai.ts';
import type * as TarotMod from '../../loi/tarot.ts';
import type { MatDo } from '../../loi/ai/duLieu.ts';
import { isoNgay, khoiNap, lechNuocNgoai, type VeKhoi } from '../chung.ts';
import { MAT_DA_DO, khoaNguoi } from '../khoi/tuongMat.ts';

type Tarot = typeof TarotMod;

/** Dieu dua cho AI doc: mot nguoi (moi mon da tinh), que Kinh Dich, trai tarot vua gieo, chi tay nguoi xem tu chon. */
export type ChuDe =
  | { readonly loai: 'nguoi'; readonly hs: HoSo; readonly tr: TinhRa; readonly ngayXem: NgayDuong; readonly lechNuoc: number | undefined;
    /** So do mat da do (neu co) luc gui luot dau — khoi tuong mat co the do sau khi khoi AI da mo. */
    readonly mat: () => MatDo | undefined }
  | { readonly loai: 'que'; readonly k: typeof KinhDichTinh & typeof KinhDichChu & typeof KinhDichGiai; readonly g: KinhDichTinh.Gieo; readonly mh: KinhDichTinh.MaiHoaGio | null }
  | { readonly loai: 'tarot'; readonly t: Tarot; readonly kieu: keyof Tarot['TRAI']; readonly rut: readonly TarotMod.LaRut[] }
  | { readonly loai: 'chiTay'; readonly k: KhungChiTay; readonly gioiTinh: GioiTinh };

/** `ma`: cung ma thi dung lai phien dang co (hoi thoai con nguyen khi app ve lai). */
export const khoiAI = (tieuDe: string, ma: string, cd: ChuDe): HTMLElement =>
  khoiNap(tieuDe, 'ai', () => import('./phien.ts').then((m) => m.vePhien(ma, cd)));

export const khoiCaiDatAI = (): HTMLElement => khoiNap('AI (Groq, miễn phí): khoá', 'ai', () => import('./caiDat.ts').then((m) => m.veCaiDat()));

/** Khoi cuoi moi nguoi ("Tra cuu", "Cua toi"): ho so doi thi phien moi. */
export const veKhoiAI: VeKhoi = (hs, tr, ngayXem) => khoiAI('AI tổng hợp mọi môn',
  `nguoi:${isoNgay(ngayXem)}:${khoaNguoi(hs)}`,
  { loai: 'nguoi', hs, tr, ngayXem, lechNuoc: lechNuocNgoai(hs), mat: () => MAT_DA_DO.get(khoaNguoi(hs)) });
