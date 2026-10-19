/**
 * Mui gio lich su Viet Nam, viet cung (khong dung `Intl`: khong co `Asia/Hanoi`, va `Asia/Ho_Chi_Minh` la gio
 * mien Nam). Bang va nguon: `docs/QUY_UOC.md` muc 7. Moc ghi theo gio dong ho dia phuong luc doi.
 */
import { soNgay } from './amLich.ts';
import type { Mien } from './tinh.ts';

/** Lech so voi UTC, tinh bang phut. */
export interface LechGio { readonly lech: number; readonly khac?: number; readonly lyDo?: string }

type Moc = readonly [luc: string, lech: number, khac?: number, lyDo?: string];

const CHUA_CHAC_47 = 'Từ 01/04/1947 tới 10/1954: vùng Pháp giữ dùng +8, vùng kháng chiến có thể vẫn +7 (chưa chắc).';

const MOC: Readonly<Record<Mien, readonly Moc[]>> = {
  bac: [
    ['1906-07-01 00:00', 426.5], // gio dai Phu Lien +7:06:30; truoc do gio Ha Noi +7:03
    ['1911-05-01 00:00', 420],
    ['1942-12-31 23:00', 480],
    ['1945-03-14 23:00', 540],
    ['1945-09-02 00:00', 420],
    ['1947-04-01 00:00', 480, 420, CHUA_CHAC_47],
    ['1954-11-01 00:00', 420], // "10/1954, chua ro ngay" — ca thang 10 van de hai phuong an
  ],
  nam: [
    ['1911-05-01 00:00', 420],
    ['1942-12-31 23:00', 480],
    ['1945-03-14 23:00', 540],
    ['1945-09-02 00:00', 420],
    ['1947-04-01 00:00', 480, 420, CHUA_CHAC_47],
    ['1954-11-01 00:00', 480],
    ['1955-07-01 01:00', 420],
    ['1959-12-31 23:00', 480],
    ['1975-06-13 00:00', 420],
  ],
};
const DAU: Readonly<Record<Mien, number>> = { bac: 423, nam: 426.5 };

const phutCua = (luc: string): number => {
  const [nam, thang, ngay, gio, phut] = luc.split(/[- :]/).map(Number);
  return soNgay({ nam: nam ?? 0, thang: thang ?? 0, ngay: ngay ?? 0 }) * 1440 + (gio ?? 0) * 60 + (phut ?? 0);
};
const doi = (ds: readonly Moc[]): readonly { tu: number; lech: number; khac?: number; lyDo?: string }[] =>
  ds.map(([luc, lech, khac, lyDo]) => ({ tu: phutCua(luc), lech, ...(khac === undefined ? {} : { khac }), ...(lyDo === undefined ? {} : { lyDo }) }));
const BANG = { bac: doi(MOC.bac), nam: doi(MOC.nam) };

/**
 * Lech mui gio luc `phut` (phut dong ho dia phuong tinh tu so ngay Julius × 1440). Gio bi lap hai lan, hay bi bo
 * qua luc doi mui, thi tra them `khac` — `docs/QUY_UOC.md` muc 7, 8: tinh ca hai.
 */
export function lechGio(mien: Mien, phut: number): LechGio {
  const bang = BANG[mien];
  let i = -1;
  while (i + 1 < bang.length && (bang[i + 1]?.tu ?? Infinity) <= phut) i++;
  const nay = bang[i];
  const lech = nay?.lech ?? DAU[mien];
  // Ngay sau moc ke tiep: dong ho lui (gio lap) thi khoang cuoi truoc moc gap hai lan.
  const sau = bang[i + 1];
  if (sau !== undefined && sau.lech < lech && phut >= sau.tu - (lech - sau.lech)) {
    return { lech, khac: sau.lech, lyDo: 'Giờ này lặp hai lần lúc đồng hồ lùi khi đổi múi giờ.' };
  }
  // Ngay sau moc: dong ho nhay toi thi khoang dau sau moc khong co that.
  const truocLech = bang[i - 1]?.lech ?? DAU[mien];
  if (nay !== undefined && lech > truocLech && phut < nay.tu + (lech - truocLech)) {
    return { lech, khac: truocLech, lyDo: 'Giờ này không có trên đồng hồ (lúc đổi múi giờ đồng hồ nhảy tới).' };
  }
  return nay?.khac === undefined ? { lech } : { lech, khac: nay.khac, ...(nay.lyDo === undefined ? {} : { lyDo: nay.lyDo }) };
}
