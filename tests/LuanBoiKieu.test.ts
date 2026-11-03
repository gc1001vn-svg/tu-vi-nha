/**
 * Luan que boi Kieu (`src/loi/kieuLuan.ts`, ke hoach 2026-11-03-boi-kieu): bang doan du 21, 18 de muc; dem chu vui buon (ca tay); nhan
 * vat; quet ca 1.627 cap × 18 muc: du doan, chu dung quy uoc, ket moi dau 10–40 %, chu da nghia da bo.
 */
import { HOI, SO_CAP, queKieu } from '../src/loi/kieu.ts';
import { diemKieu, luanKieu, sacThai, TEN_MUC } from '../src/loi/kieuLuan.ts';
import { HOI_DIEM, HOI_Y, KET, MUC, NHAC, XAU } from '../src/loi/kieuLuanLoi.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('luan boi Kieu', () => {
  test('bang du: 21 doan co diem va loi, 18 de muc du ba muc; bo chu da nghia', () => {
    expect([HOI_DIEM.length, HOI_Y.length, MUC.length, TEN_MUC.length]).toEqual([HOI.length, HOI.length, 18, 18]);
    expect(MUC.every((m) => m.every((x) => x.length > 2))).toBe(true);
    expect(['tai', 'sang', 'tan', 'phụ'].some((w) => XAU.includes(w))).toBe(false);
  });

  test('dem chu: cau vui, cau buon, "tai nghe" khong tinh', () => {
    expect([sacThai('Một nhà sum họp trúc mai'), sacThai('Đau đớn thay phận đàn bà'), sacThai('Tai nghe mắt thấy')]).toEqual([1, -1, 0]);
  });

  test('cap dau truyen (mo dau) va cap trong canh doan tu: du doan; nhac luon co', () => {
    const l = luanKieu(queKieu(0));
    expect([l[0]?.loi.length, l.at(-1)?.loi]).toEqual([3, [...NHAC]]);
    expect(luanKieu(queKieu(SO_CAP - 1), 6).find((d) => d.tieuDe === 'Theo việc hỏi')?.loi[0]?.startsWith('Hôn nhân:')).toBe(true);
  });

  test('ca 1.627 cap × 18 muc: du doan, chu dung quy uoc, ket moi dau 10–40 %', () => {
    const sai: string[] = [], ket: string[] = [], ds: number[] = [];
    let nguoi = 0;
    for (let c = 0; c < SO_CAP; c++) {
      const q = queKieu(c);
      ds.push(diemKieu(q));
      for (let m = 0; m < 18; m++) {
        const l = luanKieu(q, m);
        if (m === 0) { ket.push(l[0]?.loi[0] ?? ''); if (l.some((d) => d.tieuDe === 'Người trong câu')) nguoi++; }
        for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(c)}/${String(m)}: ${e} — ${x}`); }
      }
    }
    ds.sort((a, b) => a - b);
    expect([ds[Math.floor(0.25 * (ds.length - 1))], ds[Math.floor(0.75 * (ds.length - 1))], nguoi > 200]).toEqual([-1, 0.5, true]);
    expect(sai.slice(0, 5)).toEqual([]);
    for (const k of [KET.tot, KET.xau]) {
      const ti = ket.filter((x) => x === k).length / ket.length;
      expect(ti >= 0.1 && ti <= 0.4).toBe(true);
    }
  });
});
