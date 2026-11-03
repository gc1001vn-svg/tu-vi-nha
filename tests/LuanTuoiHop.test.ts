/**
 * Luan tuoi hop (`src/loi/tuoiHopLuan.ts`, ke hoach 2026-11-03-tuoi-hop): quan he chi doi xung, khop bang cu (`tuoiHop.ts`) o tam hop,
 * luc hop, luc xung, luc hai; muc chot (Tỵ–Thân hop ma hinh, Sửu–Mùi xung lan hinh, tu hinh); "tu hanh xung" tach lai; so hai nam: xung
 * ma menh sinh nhau thi giam; 60 × 60 cap: diem doi xung, chu dung quy uoc, ket moi dau 10–40 %.
 */
import { hv } from '../src/loi/hanViet/index.ts';
import { CHI } from '../src/loi/amLich.ts';
import { tuoiHop } from '../src/loi/tuoiHop.ts';
import { diemCap, luanCap, luanTuoi, mucChi, quanHeChi } from '../src/loi/tuoiHopLuan.ts';
import { CHI_Y, KET_CAP, NHAC } from '../src/loi/tuoiHopLuanLoi.ts';

const TEN = Array.from({ length: 12 }, (_, i) => hv('chi', CHI.charAt(i)));
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('luan tuoi hop', () => {
  test('quan he chi doi xung hai chieu, khop bang cu o tam hop, luc hop, luc xung, luc hai; moi tuoi dung mot tuoi ky nhat', () => {
    for (let a = 0; a < 12; a++) {
      const cu = tuoiHop(a);
      for (let b = 0; b < 12; b++) {
        const q = quanHeChi(a, b);
        expect(quanHeChi(b, a)).toEqual(q);
        expect([q.tamHop, q.lucHop, q.xung, q.hai]).toEqual([cu.tamHop.includes(TEN[b] ?? ''), cu.lucHop === TEN[b], cu.lucXung === TEN[b], cu.lucHai === TEN[b]]);
      }
      expect(Array.from({ length: 12 }, (_, b) => mucChi(a, b)).filter((m) => m === 'ky')).toHaveLength(1);
    }
  });

  test('muc chot: Dần hop Ngọ Tuất Hợi, ky Thân, de chung Tỵ; Tỵ–Thân hop ma hinh; Sửu–Mùi xung; Tý–Mão hinh; Thìn tu hinh; Tý cung tuoi binh', () => {
    expect([2, 6, 10, 11, 8, 5].map((b) => mucChi(2, b))).toEqual(['binh', 'rat', 'rat', 'rat', 'ky', 'ne']);
    expect([mucChi(5, 8), mucChi(1, 7), mucChi(0, 3), mucChi(4, 4), mucChi(0, 0)]).toEqual(['hopHinh', 'ky', 'ne', 'ne', 'binh']);
    const dan = luanTuoi(2);
    expect([dan[0]?.loi[0]?.startsWith('Hợp nhất: Ngọ, Tuất, Hợi'), dan[0]?.loi.some((l) => l.startsWith('Bình thường: Dần')),
      dan[1]?.loi[0]?.includes('Hợi là lục hợp (tốt)'), dan.at(-1)?.loi]).toEqual([true, false, true, [...NHAC]]);
  });

  test('so hai nam: Bính Dần – Nhâm Thân xung, menh khac → nhieu cho ky; Giáp Tý – Canh Ngọ xung ma Thổ sinh Kim → xung giam', () => {
    expect(luanCap(1986, 1992)[0]?.loi[0]).toBe(KET_CAP.ky);
    expect(luanCap(1984, 1990)[1]?.loi[0]).toBe(CHI_Y.xungGiam);
    expect(luanCap(1988, 1992)[1]?.loi[0]).toBe(CHI_Y.tamHop); // Mậu Thìn – Nhâm Thân
  });

  test('60 × 60 cap nam: diem doi xung, chu dung quy uoc, ket moi dau 10–40 %', () => {
    const sai: string[] = [], ket: string[] = [];
    for (let a = 1984; a < 2044; a++) for (let b = 1984; b < 2044; b++) {
      expect(diemCap(a, b)).toBe(diemCap(b, a));
      const l = luanCap(a, b);
      for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(a)}–${String(b)}: ${e} — ${x}`); }
      ket.push(l[0]?.loi[0] ?? '');
    }
    for (let c = 0; c < 12; c++) for (const x of luanTuoi(c).flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(c)}: ${e} — ${x}`); }
    expect(sai.slice(0, 5)).toEqual([]);
    for (const k of [KET_CAP.hop, KET_CAP.ky]) {
      const ti = ket.filter((x) => x === k).length / ket.length;
      expect(ti >= 0.1 && ti <= 0.4).toBe(true);
    }
  });
});
