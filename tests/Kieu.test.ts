/**
 * Boi Kieu (`src/loi/kieu.ts`): chu Truyen Kieu sau soat (luat luc bat 6/8, NFC), 21 doan phu lien, que o dau, cuoi
 * truyen va o ranh hoi. Chu da soat sinh lai bang `scripts/doi-chieu/soat-kieu.py`.
 */
import { CAU, HOI, SO_CAP, queKieu } from '../src/loi/kieu.ts';

const soChu = (l: string): number => l.match(/\p{L}+/gu)?.length ?? 0;

describe('Truyện Kiều', () => {
  it('đủ 3.254 câu, câu lục 6 chữ, câu bát 8 chữ, chuẩn NFC', () => {
    expect(CAU).toHaveLength(3254);
    expect(SO_CAP).toBe(1627);
    expect(CAU[0]).toBe('Trăm năm trong cõi người ta,');
    expect(CAU[3253]).toBe('Mua vui cũng được một vài trống canh.');
    expect(CAU.flatMap((l, i) => (soChu(l) === (i % 2 === 0 ? 6 : 8) && l === l.normalize('NFC') ? [] : [i + 1]))).toEqual([]);
  });

  it('21 đoạn bắt đầu ở câu lục, tăng dần, đoạn nào cũng có tóm tắt', () => {
    const dau = HOI.map((h) => h.dau);
    expect(dau).toHaveLength(21);
    expect(dau[0]).toBe(1);
    expect(dau.every((d, i) => d % 2 === 1 && (i === 0 || d > (dau[i - 1] ?? 0)) && d < 3254)).toBe(true);
    expect(HOI.filter((h) => h.tomTat.length < 60 || h.ten === '')).toEqual([]);
  });

  it('quẻ ở đầu, cuối truyện và ở ranh hồi', () => {
    const dau = queKieu(0);
    expect(dau).toMatchObject({ so: 1, luc: CAU[0], bat: CAU[1], truoc: [], sau: [CAU[2], CAU[3]] });
    expect(dau.hoi.ten).toBe('Mở đầu');
    const cuoi = queKieu(SO_CAP - 1);
    expect(cuoi).toMatchObject({ so: 3253, truoc: [CAU[3250], CAU[3251]], sau: [] });
    expect(queKieu(526).hoi.ten).toBe('Lầu Ngưng Bích'); // cau 1053-1054
    expect(queKieu(527).hoi.ten).toBe('Mắc lừa Sở Khanh'); // cau 1055
    expect(() => queKieu(SO_CAP)).toThrow(RangeError);
    expect(() => queKieu(1.5)).toThrow(RangeError);
  });
});
