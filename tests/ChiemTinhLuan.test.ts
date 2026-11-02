/**
 * Tong luan chiem tinh (`src/loi/chiemTinhLuan.ts`): pham vi dung bang Ptolemy; dem nguyen to tren la dung tay; nhan the chu T;
 * 2.000 la so gia (co va khong co gio) ra du doan, khong cau trong, khong co phan can cung Moc khi khong co toa do.
 */
import { kinhDo, laSo, type LaSo } from '../src/loi/chiemTinh.ts';
import { NGUONG_NHA, NGUONG_VAN_CT, cacQua, diemNha, luanNha, phamVi, tongLuanCT, vanCT } from '../src/loi/chiemTinhLuan.ts';
import { HANH_TINH_NHA, KIEU_CUNG, NHA_TEN } from '../src/loi/chiemTinhNhaLoi.ts';
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

  test('luan tung nha: du loi 10 thien the × 12 nha; 1.000 la so × 12 nha ra du loi; ket luan ~1/4 moi dau; khong gio thi khong luan', () => {
    expect([HANH_TINH_NHA.length, HANH_TINH_NHA.every((h) => h.length === 12 && h.every((x) => x.length > 15)), KIEU_CUNG.length, NHA_TEN.length])
      .toEqual([10, true, 12, 12]);
    let hat = 7, tot = 0, kem = 0, n = 0;
    const r = (x: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return (hat / 2 ** 31) * x; };
    for (let i = 0; i < 1000; i++) {
      const ls = laSo(Math.floor((2433283 + r(21900)) * 1440 + r(1440)), [10 + r(13), 103 + r(6)]);
      for (let h = 1; h <= 12; h++) {
        const l = luanNha(ls, h), d = diemNha(ls, h) ?? 0;
        expect([l.length >= 3, l.some((x) => x.length < 15 || x.includes('undefined'))]).toEqual([true, false]);
        n += 1; tot += d >= NGUONG_NHA.tot ? 1 : 0; kem += d < NGUONG_NHA.kem ? 1 : 0;
      }
    }
    expect([tot / n > 0.1 && tot / n < 0.35, kem / n > 0.15 && kem / n < 0.4]).toEqual([true, true]);
    expect(luanNha(dung([5, 8, 12, 15, 18, 20, 22, 25, 27, 29]), 1)).toEqual([]);
  });

  test('chu nha nam ngay trong nha minh: cung Moc Bach Duong, Sao Hoa o 10°', () => {
    const ls: LaSo = { ...dung([100, 130, 160, 190, 10, 250, 280, 300, 320, 340]), moc: 0, dinh: 270, nha: Array.from({ length: 12 }, (_, i) => i * 30) };
    expect(luanNha(ls, 1).some((x) => x.startsWith('Chủ nhà là Sao Hỏa, nằm ngay trong nhà này'))).toBe(true);
  });

  test('van: Sao Tho vuong Mat Troi, Sao Tho tro ve, nam xoay theo tuoi tinh dung tren la dung tay', () => {
    const nay = 2461346 * 1440; // 01/11/2026
    const tho = kinhDo(6, nay + 100 * 1440);
    const ls: LaSo = { ...dung([tho + 90, 200, 210, 220, 230, 10, tho, 300, 320, 340]), moc: 0, dinh: 270, nha: Array.from({ length: 12 }, (_, i) => i * 30) };
    const q = cacQua(ls, nay);
    expect([q.some((x) => x.p === 6 && x.n === 0 && x.goc === 2), q.some((x) => x.p === 6 && x.n === 6 && x.goc === 0)]).toEqual([true, true]);
    const sinh = nay - Math.round(13.5 * 365.2422 * 1440); // tuoi tron 13: nha 2, cung Kim Nguu, chu nam Sao Kim
    const l = vanCT(ls, sinh, nay).loi;
    expect([l.some((x) => x.startsWith('Sao Thổ trở về')), l.some((x) => x.includes('năm tuổi tròn 13 ứng nhà 2') && x.includes('chủ năm là Sao Kim'))])
      .toEqual([true, true]);
  });

  // Moi la ~16 ms (astronomy-engine, 615 lan tinh vi tri) → 100 la, cho thoi han 20 s khi chay song song.
  test('van: 100 la so gia — du loi, toi da 6 goc ke ra, ket luan moi dau 10–40 %', () => {
    let hat = 11, tot = 0, kho = 0;
    const r = (x: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return (hat / 2 ** 31) * x; };
    for (let i = 0; i < 100; i++) {
      const sinh = Math.floor((2433283 + r(18250)) * 1440 + r(1440)), nay = sinh + Math.floor((15 + r(65)) * 365.2422 * 1440);
      const v = vanCT(laSo(sinh, [10 + r(13), 103 + r(6)]), sinh, nay);
      expect([v.loi.some((x) => x.length < 15 || x.includes('undefined')), v.loi.filter((x) => x.includes(') — chuyện ')).length <= 6]).toEqual([false, true]);
      tot += v.diem >= NGUONG_VAN_CT.thuan ? 1 : 0; kho += v.diem < NGUONG_VAN_CT.kho ? 1 : 0;
    }
    expect([tot / 100 > 0.1 && tot / 100 < 0.4, kho / 100 > 0.1 && kho / 100 < 0.4]).toEqual([true, true]);
  }, 20_000);
});
