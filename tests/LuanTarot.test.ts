/**
 * Luan trai tarot (`src/loi/tarotLuan.ts`, ke hoach 2026-11-03-tarot): bang do tot xau du 78 la; ca dung tay (la nguoc nua suc, ba la
 * sang → thuan, Celtic toi → bao vuong, bo chiem da so, an chinh); quet 3.000 trai moi kieu: du doan, chu dung quy uoc, ket moi dau
 * 10–40 %, trung loi giua hai trai.
 */
import { LA, rutBai, type LaRut } from '../src/loi/tarot.ts';
import { diemLa, diemTrai, luanTarot } from '../src/loi/tarotLuan.ts';
import { DO, KET, MACH, NGUOC, NHAC, NHOM } from '../src/loi/tarotLuanLoi.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);
const x = (so: number, nguoc = false): LaRut => ({ so, nguoc });

describe('luan tarot', () => {
  test('bang do du 78 la, trong −1,5…1,5; la trieu 0; Sun, World sang nhat, Tower toi nhat an chinh; 10 Kiem toi', () => {
    expect([DO.length, DO.every((d) => d >= -1.5 && d <= 1.5)]).toEqual([LA.length, true]);
    expect([DO[19], DO[21], DO[16], DO[22 + 2 * 14 + 9]]).toEqual([1.5, 1.5, -1.5, -1.5]);
    for (let b = 0; b < 4; b++) for (let h = 10; h < 14; h++) expect(DO[22 + b * 14 + h]).toBe(0);
    expect([diemLa(x(19)), diemLa(x(19, true)), diemLa(x(16, true))]).toEqual([1.5, 0.75, -0.75]);
  });

  test('ba la sang → thuan, mach di len khi la cuoi sang hon; Celtic nhieu Kiem toi → bao vuong, nghieng Kiem', () => {
    const ba = luanTarot('baLa', [x(13), x(17), x(19)]); // Death → Star → Sun
    expect([ba[0]?.loi[0], ba.find((d) => d.tieuDe === 'Mạch bài')?.loi.slice(0, 2), ba.at(-1)?.loi]).toEqual([KET.thuan, [MACH.len, MACH.ketTot], [...NHAC]]);
    const kiem = [2, 4, 7, 8, 9].map((h) => x(22 + 2 * 14 + h));
    const celtic = luanTarot('thapTu', [...kiem, x(16), x(18), x(15), x(50), x(36)]);
    const nghieng = celtic.find((d) => d.tieuDe === 'Bài nghiêng về')?.loi ?? [];
    expect([celtic[0]?.loi[0], nghieng.includes(NHOM.Kiếm), nghieng.includes(NGUOC.khong)]).toEqual([KET.kho, true, true]);
    expect(diemTrai('motLa', [x(0)])).toBe(0);
  });

  test('3.000 trai moi kieu: du doan, chu dung quy uoc, ket moi dau 10–40 %, trung loi < 60 %', () => {
    let s = 9;
    const r = (): number => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (t ^ (t >>> 14)) >>> 0; };
    for (const [kieu, n] of [['motLa', 1], ['baLa', 3], ['thapTu', 10]] as const) {
      const sai: string[] = [], ket: string[] = [], cau: Set<string>[] = [];
      for (let i = 0; i < 3000; i++) {
        const l = luanTarot(kieu, rutBai(Array.from({ length: 2 * n }, r), n, true));
        expect(l.length).toBeGreaterThanOrEqual(3);
        for (const y of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(y); if (e !== null) sai.push(`${kieu} ${String(i)}: ${e} — ${y}`); }
        ket.push(l[0]?.loi[0] ?? '');
        cau.push(new Set(l.filter((d) => d.tieuDe !== 'Nhìn cho đúng' && d.tieuDe !== 'Lời khuyên').flatMap((d) => d.loi.slice(d.tieuDe === 'Tổng luận' ? 1 : 0))));
      }
      expect(sai.slice(0, 5)).toEqual([]);
      for (const k of [KET.thuan, KET.kho]) {
        const ti = ket.filter((y) => y === k).length / ket.length;
        expect([kieu, ti >= 0.1 && ti <= 0.4]).toEqual([kieu, true]);
      }
      if (n === 1) continue;
      let trung = 0, dem = 0;
      for (let i = 0; i + 1 < cau.length; i += 2) {
        const a = cau[i] ?? new Set<string>(), b = cau[i + 1] ?? new Set<string>();
        trung += [...a].filter((y) => b.has(y)).length / Math.max(a.size, 1); dem++;
      }
      expect(trung / dem).toBeLessThan(0.6);
    }
  });
});
