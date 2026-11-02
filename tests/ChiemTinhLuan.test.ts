/**
 * Tong luan chiem tinh (`src/loi/chiemTinhLuan.ts`): pham vi dung bang Ptolemy; dem nguyen to tren la dung tay; nhan the chu T;
 * 2.000 la so gia (co va khong co gio) ra du doan, khong cau trong, khong co phan can cung Moc khi khong co toa do.
 */
import { laSo, type LaSo } from '../src/loi/chiemTinh.ts';
import { phamVi, tongLuanCT } from '../src/loi/chiemTinhLuan.ts';
import { GOC_CAP, KHI_CHAT, TO_THIEU, TO_TROI } from '../src/loi/chiemTinhLuanLoi.ts';

/** La dung tay: 10 thien the theo kinh do cho truoc, Bac Giao Diem 0, khong cung Moc. */
const dung = (kinh: readonly number[]): LaSo => ({ diem: [...kinh, 0].map((k) => ({ kinh: k, nghich: false })), moc: null, dinh: null, nha: null });

describe('tong luan chiem tinh', () => {
  test('pham vi theo Ptolemy: mieu, vuong, ham, suy', () => {
    expect([phamVi(0, 130), phamVi(0, 10), phamVi(0, 310), phamVi(0, 190), phamVi(2, 160), phamVi(1, 220), phamVi(5, 40)])
      .toEqual([0, 1, 2, 3, 0, 3, null]);
  });

  test('ca 10 thien the o Bach Duong: Lua troi, thieu Dat Khi Nuoc, khi chat duong', () => {
    const l = tongLuanCT(dung([5, 8, 12, 15, 18, 20, 22, 25, 27, 29])).flatMap((d) => d.loi);
    expect([l.includes(TO_TROI[0] ?? ''), [1, 2, 3].every((i) => l.includes(TO_THIEU[i] ?? '')), l.includes(KHI_CHAT.duong)])
      .toEqual([true, true, true]);
  });

  test('the chu T: Sao Moc doi Sao Thien Vuong, Sao Kim vuong ca hai', () => {
    // Cac sao con lai don o 25–55° (cuoi Bach Duong, Kim Nguu) de khong thanh the chu T nao khac.
    const l = tongLuanCT(dung([40, 45, 35, 10, 50, 100, 30, 280, 55, 25])).flatMap((d) => d.loi);
    expect(l.some((x) => x.startsWith('Thế chữ T (Sao Mộc, Sao Thiên Vương, Sao Kim)'))).toBe(true);
  });

  test('2.000 la so gia: du doan, khong cau trong; khong toa do thi khong co sao chu, ngay–dem', () => {
    let hat = 20261102;
    const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return (hat / 2 ** 31) * n; };
    for (let i = 0; i < 2000; i++) {
      const phut = Math.floor((2433283 + r(21900)) * 1440 + r(1440)), toa = i % 2 === 0 ? [10 + r(13), 103 + r(6)] as const : null;
      const tl = tongLuanCT(laSo(phut, toa));
      expect(tl.length).toBeGreaterThanOrEqual(2);
      for (const d of tl) for (const x of d.loi) expect([x.length > 15, x.includes('undefined')]).toEqual([true, false]);
      if (toa === null) expect(tl.some((d) => d.tieuDe.startsWith('Ngày') || d.loi.some((x) => x.includes('sao chủ lá số')))).toBe(false);
    }
  });

  test('moi cap goc chieu co loi la hai thien the khac nhau, a < b, khong cap hai sao xa', () => {
    expect(Object.keys(GOC_CAP).filter((k) => { const [a = 0, b = 0] = k.split('-').map(Number); return !(a < b && b < 10 && a <= 4); })).toEqual([]);
  });
});
