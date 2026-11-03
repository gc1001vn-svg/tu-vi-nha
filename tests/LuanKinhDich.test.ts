/**
 * Luan que Kinh Dich (`src/loi/kinhDichLuan.ts`, ke hoach 2026-11-03-kinh-dich): cham chu cat hung (ca tay theo nguyen van), que Càn
 * khong dong / dong hao 6 / dong ca sau, vi tri – trung – chinh – ung, quet 3.000 lan gieo dong xu va 3.000 gio Mai Hoa: du doan, chu
 * dung quy uoc, ket moi dau 10–40 %, trung loi giua hai lan gieo.
 */
import { gieo, maiHoaTheoGio, type Hao } from '../src/loi/kinhDich.ts';
import { diemChu, diemQue, luanQue } from '../src/loi/kinhDichLuan.ts';
import { CHINH, KET, KHUYEN, NHAC, TRUNG, UNG } from '../src/loi/kinhDichLuanLoi.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('luan que Kinh Dich', () => {
  test('cham chu cat hung theo nguyen van', () => {
    expect(['元亨利貞', '亢龍有悔', '見群龍无首吉', '黃裳元吉', '括囊无咎无譽', '屯其膏小貞吉大貞凶', '潛龍勿用'].map(diemChu))
      .toEqual([1, -0.5, 1, 2, 0, -0.5, 0]);
  });

  test('Càn khong hao dong: loi que 元亨 +1 → ket lan; dong hao 6: hao cuoi, khong xet dung vi; dong ca sau: Dung Cuu', () => {
    const tinh = luanQue(gieo([7, 7, 7, 7, 7, 7]));
    expect([tinh[0]?.loi[0], tinh.some((d) => d.tieuDe.startsWith('Hào')), tinh.at(-1)?.loi]).toEqual([KET.vua, false, [...NHAC]]);
    const h6 = luanQue(gieo([7, 7, 7, 7, 7, 9]));
    const vt = h6.find((d) => d.tieuDe.startsWith('Hào 6'))?.loi ?? [];
    expect([vt.includes(CHINH.dung) || vt.includes(CHINH.sai), vt.includes(UNG.khong)]).toEqual([false, true]);
    expect(diemQue(gieo([9, 9, 9, 9, 9, 9]))).toBe(2); // Dung Cuu "見群龍无首吉" +1, nua loi que bien Khôn (元亨 … 安貞吉 = 2) +1
  });

  test('hao 5 duong o que Ti (dong hao 5): trung, dung vi, co ung; loi khuyen theo cum chu', () => {
    // Que 8 Ti: Khôn duoi, Khảm tren → vach tu duoi 0 0 0 0 1 0; dong hao 5 (9)
    const l = luanQue(gieo([8, 8, 8, 8, 9, 8]));
    const vt = l.find((d) => d.tieuDe.startsWith('Hào 5'))?.loi ?? [];
    expect([vt.includes(TRUNG), vt.includes(CHINH.dung), vt.includes(UNG.co)]).toEqual([true, true, true]);
    expect(Object.values(KHUYEN).every((x) => x.length > 10)).toBe(true);
  });

  test('3.000 lan gieo dong xu va 3.000 gio Mai Hoa: du doan, chu dung quy uoc, ket moi dau 10–40 %, trung loi < 60 %', () => {
    let s = 5;
    const r = (): number => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const xu = (): Hao => (6 + [0, 1, 2].reduce((t) => t + (r() < 0.5 ? 1 : 0), 0)) as Hao;
    for (const kieu of ['xu', 'maiHoa'] as const) {
      const sai: string[] = [], ket: string[] = [], cau: Set<string>[] = [];
      for (let i = 0; i < 3000; i++) {
        const m = kieu === 'xu' ? null : maiHoaTheoGio({ nam: 1990 + Math.floor(r() * 40), thang: 1 + Math.floor(r() * 12), ngay: 1 + Math.floor(r() * 28) },
          Math.floor(r() * 24));
        const l = m === null ? luanQue(gieo(Array.from({ length: 6 }, xu))) : luanQue(m, m);
        expect(l.length).toBeGreaterThanOrEqual(4);
        for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${kieu} ${String(i)}: ${e} — ${x}`); }
        ket.push(l[0]?.loi[0] ?? '');
        cau.push(new Set(l.filter((d) => d.tieuDe !== 'Nhìn cho đúng' && d.tieuDe !== 'Theo việc hỏi').flatMap((d) => d.loi.slice(d.tieuDe === 'Tổng luận' ? 1 : 0))));
      }
      expect(sai.slice(0, 5)).toEqual([]);
      for (const k of [KET.thuan, KET.kho]) {
        const ti = ket.filter((x) => x === k).length / ket.length;
        expect([kieu, ti >= 0.1 && ti <= 0.4]).toEqual([kieu, true]);
      }
      let trung = 0, dem = 0;
      for (let i = 0; i + 1 < cau.length; i += 2) {
        const a = cau[i] ?? new Set<string>(), b = cau[i + 1] ?? new Set<string>();
        trung += [...a].filter((x) => b.has(x)).length / Math.max(a.size, 1); dem++;
      }
      expect(trung / dem).toBeLessThan(0.6);
    }
  });
});
