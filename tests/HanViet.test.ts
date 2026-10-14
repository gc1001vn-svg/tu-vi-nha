/**
 * Bang Han-Viet (`src/loi/hanViet/`) phai: phu du moi chuoi `lunar-typescript` tra ra, khong co
 * khoa thua (go nham), va viet dung quy uoc chu (`docs/QUY_UOC.md` muc "Chu").
 *
 * Khoang 2020–2031 (+ 12 gio moi ngay cua nam 2025) ra DUNG bo chuoi cua ca 1900–2100: do 14/10/2026,
 * ca khoang 141 giay, khoang ngan 8 giay. Doi ban thu vien thi do lai (cach do: dau `lietKeChuHan.ts`).
 * Chi kiem vai nhom: `NHOM=nenKieng,thanSat npx vitest run tests/HanViet`.
 */
import { lietKeChuHan } from './lietKeChuHan.ts';
import { BANG, NHOM, NHOM_CAU, type Bang } from '../src/loi/hanViet/index.ts';

const CHON = NHOM.filter((n) => process.env.NHOM === undefined || process.env.NHOM.split(',').includes(n));
const daGap = lietKeChuHan([2020, 1, 1], [2031, 12, 31], [2025, 1, 1], [2025, 12, 31]);
const bang = (n: (typeof NHOM)[number]): Bang => BANG[n];

describe('bang Han-Viet', () => {
  test('phu du moi chuoi thu vien tra ra', () => {
    const thieu = CHON.flatMap((n) => [...(daGap.get(n)?.keys() ?? [])].filter((c) => !(c in bang(n))).map((c) => `${n}: ${c}`));
    expect(thieu).toEqual([]);
  });

  test('khong co khoa thua (thu vien khong bao gio tra ra)', () => {
    const thua = CHON.flatMap((n) => Object.keys(bang(n)).filter((c) => daGap.get(n)?.has(c) !== true).map((c) => `${n}: ${c}`));
    expect(thua).toEqual([]);
  });

  test('chu dung quy uoc', () => {
    const sai: string[] = [];
    const kiem = (n: string, khoa: string, truong: string, v: string): void => {
      const loi = (ly: string): void => { sai.push(`${n} ${khoa} ${truong}="${v}": ${ly}`); };
      if (v === '' || v.trim() !== v || /\s{2}/u.test(v)) loi('rong hoac thua khoang trang');
      if (v.normalize('NFC') !== v) loi('chua NFC');
      if (/(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v)) loi('dau thanh kieu moi — viet kieu cu: Hỏa, Thủy, Hòa');
      if (/(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v)) loi('viet Tỵ, Kỷ, Kỵ');
      const dau = v[0] ?? '';
      if (dau !== dau.toUpperCase()) loi('chu dau phai viet hoa');
    };
    for (const n of CHON) {
      for (const [khoa, m] of Object.entries(bang(n))) {
        kiem(n, khoa, 'hv', m.hv);
        if (!NHOM_CAU.has(n) && m.hv.split(/[\s-]+/u).some((t) => t[0] !== t[0]?.toUpperCase())) {
          sai.push(`${n} ${khoa} hv="${m.hv}": ten rieng viet hoa moi chu`);
        }
        if (m.nghia !== undefined) kiem(n, khoa, 'nghia', m.nghia);
        else if (NHOM_CAU.has(n)) sai.push(`${n} ${khoa}: nhom nay bat buoc co nghia`);
      }
    }
    expect(sai).toEqual([]);
  });
});
