/**
 * Tarot (`src/loi/tarot.ts`): 78 la du, khong trung, co anh (`public/tarot/`), ten, nghia; xao bai Fisher–Yates voi so ngau
 * nhien gia co hat giong (chi trong test): 78.000 lan rut deu (khi binh phuong), trai 10 la khong trung, la nguoc ~50 %.
 */
import { readdirSync, statSync } from 'node:fs';
import { LA, TRAI, rutBai } from '../src/loi/tarot.ts';

/** mulberry32: so 32 bit gia, tat dinh theo hat giong — de test khong doi giua cac lan chay. */
function gia(hat: number): () => number {
  let s = hat >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
}
const khiBinhPhuong = (dem: readonly number[], kyVong: number): number => dem.reduce((a, d) => a + (d - kyVong) ** 2 / kyVong, 0);

describe('tarot', () => {
  test('78 la: 22 an chinh theo thu tu 1909 + 4 bo × 14; ten khong trung; la nao cung co nghia xuoi, nguoc', () => {
    expect(LA).toHaveLength(78);
    expect([new Set(LA.map((l) => l.anh)).size, new Set(LA.map((l) => l.ten)).size]).toEqual([78, 78]);
    expect(LA.filter((l) => l.ten === '' || l.xuoi.length < 15 || l.nguoc.length < 15 || l.xuoi === l.nguoc)).toEqual([]);
    expect([LA[8]?.anh, LA[11]?.anh, LA[22]?.anh, LA[35]?.ten, LA[77]?.anh]).toEqual(['Strength', 'Justice', 'Ace of Wands', 'Vua Gậy', 'King of Pentacles']);
  });

  test('anh: du 78 file WebP theo so la, moi file 5–80 KB, tong <= 3 MB (ke hoach)', () => {
    const ten = readdirSync('public/tarot').filter((f) => f.endsWith('.webp')).sort();
    expect(ten).toEqual(LA.map((_, i) => `${String(i).padStart(2, '0')}.webp`));
    const co = ten.map((f) => statSync(`public/tarot/${f}`).size);
    expect(co.filter((c) => c < 5_000 || c > 80_000)).toEqual([]);
    expect(co.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(3_000_000);
  });

  test('xao bai: 78.000 lan rut 1 la deu (khi binh phuong 77 bac tu do < 130), la nguoc 50 % ± 1 %', () => {
    const r = gia(20261022), dem = LA.map(() => 0);
    let nguoc = 0;
    for (let i = 0; i < 78_000; i++) {
      const [la] = rutBai([r(), r()], 1, true);
      dem[la?.so ?? 0] = (dem[la?.so ?? 0] ?? 0) + 1;
      if (la?.nguoc === true) nguoc++;
    }
    expect(khiBinhPhuong(dem, 1000)).toBeLessThan(130);
    expect(Math.abs(nguoc / 78_000 - 0.5)).toBeLessThan(0.01);
  });

  test('thap tu 10 la: 10.000 lan khong trung; vi tri 1 va 10 deu; tat la nguoc thi khong la nao nguoc', () => {
    const r = gia(7), dau = LA.map(() => 0), cuoi = LA.map(() => 0);
    for (let i = 0; i < 10_000; i++) {
      const ds = rutBai(Array.from({ length: 20 }, r), 10, false);
      expect(new Set(ds.map((x) => x.so)).size).toBe(10);
      expect(ds.some((x) => x.nguoc)).toBe(false);
      const a = ds[0]?.so ?? 0, z = ds[9]?.so ?? 0;
      dau[a] = (dau[a] ?? 0) + 1;
      cuoi[z] = (cuoi[z] ?? 0) + 1;
    }
    expect([khiBinhPhuong(dau, 10_000 / 78) < 130, khiBinhPhuong(cuoi, 10_000 / 78) < 130]).toEqual([true, true]);
  });

  test('ba kieu trai 1, 3, 10 vi tri; so la sai hay thieu so ngau nhien thi bao loi', () => {
    expect([TRAI.motLa.viTri.length, TRAI.baLa.viTri.length, TRAI.thapTu.viTri.length]).toEqual([1, 3, 10]);
    expect(() => rutBai([1, 2, 3], 2, true)).toThrow();
    expect(() => rutBai(Array.from({ length: 200 }, () => 1), 79, true)).toThrow();
    expect(rutBai(Array.from({ length: 156 }, () => 0), 78, false).map((x) => x.so)).toEqual(LA.map((_, i) => i));
  });
});
