/**
 * Luan nam nay (ke hoach `docs/ke-hoach/2026-11-02-nam-nay.md`; cach chot: `docs/LUAN_NAM_NAY.md`; tra nguon chi tiet: QUY_UOC muc 14).
 * Gop sao, Thai Tue, Tam Tai thanh mot ket; han KHONG tinh diem (ai cung gap mot trong tam han, chua thay goc ngoai Viet Nam); viec lon
 * (lam nha, cuoi hoi, khoi su) theo Kim Lau, Hoang Oc, Tam Tai, Thai Tue; loi nhac. Loi o `namNayLuanLoi.ts`. Thuoc: `tests/LuanNamNay.test.ts`.
 */
import type { DoanLuan } from './chiemTinhLuan.ts';
import type { NamNay } from './namNay.ts';
import { HAN_Y, KET, NHAC, SAO_Y, TAM_TAI_Y, THAI_TUE_Y, VIEC } from './namNayLuanLoi.ts';

/** Diem roi rac: chon moc gan phan vi 75 / 25 tren tuoi mu 10+ sinh 1930–2014 × nam xem 2020–2031 × hai gioi (docs muc 4). */
export const NGUONG_NAM_NAY = { thuan: 0.5, kho: -1.25 } as const;
/** Trong so Thai Tue: tri, xung nang nhat (cach xem pho bien Trung Hoa, Dai Loan, Han, Viet), roi hinh, hai, pha. */
const THAI_TUE = [['Trị', -1], ['Xung', -1.5], ['Hình', -0.5], ['Hại', -0.5], ['Phá', -0.25]] as const;

export function diemNamNay(n: NamNay): number {
  // La Hau, Ke Do xau o moi nguon (dan gian Viet, kinh goc, chua Nhat) nen nang hon Thai Bach (kinh goc xep nhe hoac tot).
  const sao = n.sao.ten === 'La Hầu' || n.sao.ten === 'Kế Đô' ? -1.5 : n.sao.mucDo === 'tot' ? 1 : n.sao.mucDo === 'xau' ? -1 : 0;
  return sao + THAI_TUE.reduce((t, [k, w]) => t + (n.thaiTue.ten.includes(k) ? w : 0), 0) + (n.tamTai.mucDo === 'xau' ? -0.75 : 0);
}

export function luanNamNay(n: NamNay): DoanLuan[] {
  const d = diemNamNay(n);
  const ket = d >= NGUONG_NAM_NAY.thuan ? 'thuan' : d < NGUONG_NAM_NAY.kho ? 'kho' : 'vua';
  const tt = THAI_TUE.filter(([k]) => n.thaiTue.ten.includes(k)).map(([k]) => k);
  const kiengNha = [['Kim Lâu', n.kimLau], ['Hoang Ốc', n.hoangOc], ['Tam Tai', n.tamTai]] as const;
  const pham = kiengNha.filter(([, m]) => m.mucDo === 'xau').map(([ten]) => ten);
  const nho = n.tuoiMu < 10;
  return [
    { tieuDe: `Tổng quan năm ${n.canChi}`, loi: [
      KET[ket], SAO_Y[n.sao.ten] ?? '', tt.length === 0 ? THAI_TUE_Y.khong : THAI_TUE_Y.co(tt),
      n.tamTai.mucDo === 'xau' ? TAM_TAI_Y(n.tamTai.ten) : '', nho ? '' : HAN_Y(n.han.ten),
    ].filter((l) => l !== '') },
    { tieuDe: 'Việc lớn trong năm', loi: nho ? [VIEC.nho] : [
      pham.length === 0 ? VIEC.nhaDuoc : VIEC.nhaKieng(pham.join(', ')),
      n.kimLau.mucDo === 'xau' ? VIEC.cuoiKimLau : n.tamTai.mucDo === 'xau' ? VIEC.cuoiTamTai : VIEC.cuoiDuoc,
      n.tamTai.mucDo === 'xau' || tt.includes('Xung') ? VIEC.khoiSuCham : VIEC.khoiSu,
    ] },
    { tieuDe: 'Nhìn cho đúng', loi: [NHAC] },
  ];
}
