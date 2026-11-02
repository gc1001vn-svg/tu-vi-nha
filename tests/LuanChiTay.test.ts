/**
 * Luan chi tay (`src/loi/chiTayLuan.ts`, ke hoach 2026-11-02-chi-tay): moi gia tri moi o co nhan chot; ca dung tay (ba duong ro lien →
 * thuan; mo, dut → can boi dap; chi tay ngang khong cham diem; chua chon du); quet 3.000 ban tay gia: du doan, chu dung quy uoc, ket moi
 * dau 10–40 %, do trung loi giua hai ban tay khac nhau.
 */
import { CAC_DUONG, KHUNG, type Duong, type KhungChiTay } from '../src/loi/chiTay.ts';
import { diemTay, luanTay, oChot, tungO } from '../src/loi/chiTayLuan.ts';
import { CHUA_DU, KET, NGANG_Y, NHAC, O } from '../src/loi/chiTayLuanLoi.ts';

const o = (d: Duong): [string, readonly unknown[]][] => Object.entries(KHUNG[d]) as [string, readonly unknown[]][];
type Chon = Partial<Record<Duong, Record<string, string | boolean | null>>>;
const khung = (c: Chon, simian: boolean | null = false): KhungChiTay => ({ simian,
  duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k]) => [k, c[d]?.[k] ?? null]))])) as unknown as KhungChiTay['duong'] });
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

const tot: Chon = { life: { seen: 'clear', length: 'long', arc: 'wide', broken: false },
  head: { seen: 'clear', length: 'long', shape: 'straight', joined: true, broken: false },
  heart: { seen: 'clear', length: 'medium', broken: false }, fate: { seen: 'clear', start: 'wrist', broken: false } };

describe('luan chi tay', () => {
  test('moi gia tri moi o trong KHUNG co nhan chot, khong thua', () => {
    for (const d of CAC_DUONG) for (const [k, v] of o(d)) expect(Object.keys(O[d][k] ?? {}).sort()).toEqual(v.map(String).sort());
  });

  test('ba duong ro lien, su nghiep tu co tay → thuan; mo va dut → can boi dap; chi tay ngang 0 diem nhung co loi', () => {
    const l = luanTay(khung(tot));
    expect([l.length, l[0]?.loi[0], l[0]?.loi[1]?.startsWith('Ba đường chính rõ và liền'), l.at(-1)?.loi]).toEqual([7, KET.thuan, true, [...NHAC]]);
    const xau: Chon = { life: { seen: 'faint', length: 'short', broken: true }, head: { seen: 'faint', length: 'short', broken: true },
      heart: { seen: 'faint', length: 'short', broken: true }, fate: { seen: 'faint', start: 'middle', broken: true } };
    expect(luanTay(khung(xau))[0]?.loi[0]).toBe(KET.kho);
    expect([diemTay(khung(tot, true)), luanTay(khung(tot, true))[0]?.loi.includes(NGANG_Y)]).toEqual([diemTay(khung(tot)), true]);
  });

  test('chua chon do ro ba duong chinh → chua du; duong "khong thay" khoa o con lai; tung o', () => {
    expect(luanTay(khung({ life: { seen: 'clear' } }))[0]?.loi).toEqual([CHUA_DU]);
    const k = khung({ ...tot, fate: { seen: 'none', start: 'wrist', broken: true } });
    expect([oChot(k, 'fate', 'start'), luanTay(k).find((d) => d.tieuDe === 'Công việc, tiền bạc')?.loi[0]?.startsWith('Không có đường sự nghiệp')])
      .toEqual([null, true]);
    expect(tungO(k).map((x) => x.ten)).toEqual(['Chỉ tay ngang', 'Đường đời', 'Đường trí', 'Đường tình', 'Đường sự nghiệp']);
  });

  test('3.000 ban tay gia: du doan, chu dung quy uoc; ket moi dau 10–40 %; trung loi giua hai ban tay < 50 %', () => {
    let s = 11;
    const r = (): number => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const pick = <T,>(a: readonly T[]): T => a[Math.floor(r() * a.length)] as T;
    const sai: string[] = [], ket: string[] = [], cau: Set<string>[] = [];
    for (let i = 0; i < 3000; i++) {
      // Ba duong chinh ai cung co: chi ro / mo; o khac chia deu (ke ca "khong co" duong su nghiep).
      const c = Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k, v]) =>
        [k, k === 'seen' && d !== 'fate' ? pick(['clear', 'faint']) : pick(v)]))])) as Chon;
      const l = luanTay(khung(c, r() < 0.05));
      expect(l.length).toBeGreaterThanOrEqual(6);
      for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(i)}: ${e} — ${x}`); }
      ket.push(l[0]?.loi[0] ?? '');
      cau.push(new Set(l.filter((d) => d.tieuDe !== 'Nhìn cho đúng').flatMap((d) => d.loi.slice(d.tieuDe === 'Tổng luận' ? 1 : 0))
        .filter((x) => !x.startsWith('Đường đời không báo'))));
    }
    expect(sai.slice(0, 5)).toEqual([]);
    for (const k of [KET.thuan, KET.kho]) {
      const ti = ket.filter((x) => x === k).length / ket.length;
      expect(ti >= 0.1 && ti <= 0.4).toBe(true);
    }
    let trung = 0, dem = 0;
    for (let i = 0; i + 1 < cau.length; i += 2) {
      const a = cau[i] ?? new Set<string>(), b = cau[i + 1] ?? new Set<string>();
      trung += [...a].filter((x) => b.has(x)).length / Math.max(a.size, 1); dem++;
    }
    expect(trung / dem).toBeLessThan(0.5);
  });
});
