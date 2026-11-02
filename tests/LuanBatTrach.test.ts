/**
 * Luan Bat trach (`src/loi/batTrachLuan.ts`, ke hoach 2026-11-02-bat-trach): menh – trach cung / khac nhom, cua hop menh, nhom nha
 * tinh theo toa (truc Dong – Tay ghi them cach tinh theo huong), 8 menh × 8 huong nha + chua do deu ra du loi, chu dung quy uoc.
 */
import { luanBatTrach } from '../src/loi/batTrachLuan.ts';
import { NHA } from '../src/loi/batTrachLuanLoi.ts';

const CUNG = ['Khảm', 'Ly', 'Chấn', 'Tốn', 'Càn', 'Khôn', 'Cấn', 'Đoài'];
/** Loi chu theo quy uoc (`docs/QUY_UOC.md` muc 10), nhu `tests/LoiGiai.test.ts`. */
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}|\s\)/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : null);

describe('luan bat trach', () => {
  test('Kham o nha toa Bac huong Nam: Kham trach, cung nhom Dong; mat nha la Dien Nien — thuan', () => {
    const [, nha] = luanBatTrach('Khảm', 180);
    expect(nha?.tieuDe).toBe('Nhà tọa Bắc hướng Nam — Khảm trạch (Đông tứ trạch)');
    expect(nha?.loi.slice(0, 2)).toEqual([NHA.hop('Đông tứ mệnh'), NHA.cua('Nam', 'Diên Niên', true)]);
  });

  test('Can o nha huong Nam: khac nhom, cach go theo thu tu; mat nha la Tuyet Menh cua Can', () => {
    const [, nha] = luanBatTrach('Càn', 180);
    expect(nha?.loi.slice(0, 2)).toEqual([NHA.khongHop, NHA.cua('Nam', 'Tuyệt Mệnh', false)]);
  });

  test('nha huong Tay: toa Dong la Chan trach (Dong tu trach); ghi them neu tinh theo huong thi la Tay tu trach', () => {
    const [, nha] = luanBatTrach('Khảm', 270);
    expect(nha?.tieuDe).toBe('Nhà tọa Đông hướng Tây — Chấn trạch (Đông tứ trạch)');
    expect(nha?.loi.at(-1)).toBe(NHA.theoHuong('Tây tứ trạch'));
    expect(luanBatTrach('Khảm', 180)[1]?.loi.some((l) => l === NHA.theoHuong('Đông tứ trạch'))).toBe(false); // truc Bac – Nam khong vong
  });

  test('8 menh × (8 huong nha + chua do): 3 doan, khong cau trong, chu dung quy uoc', () => {
    const sai: string[] = [];
    for (const c of CUNG) {
      for (const d of [undefined, 0, 45, 90, 135, 180, 225, 270, 315]) {
        const tl = luanBatTrach(c, d);
        expect(tl).toHaveLength(3);
        for (const l of tl.flatMap((x) => [x.tieuDe, ...x.loi])) { const s = saiChu(l); if (s !== null) sai.push(`${c} ${String(d)}: ${s} — ${l.slice(0, 50)}`); }
      }
    }
    expect(sai).toEqual([]);
  });
});
