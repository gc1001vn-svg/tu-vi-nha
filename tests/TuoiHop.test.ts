/**
 * Tuoi hop/ky (`src/loi/tuoiHop.ts`): bang tam hop, luc hop, tu hanh xung, luc xung, luc hai cua cac nguon, va khop
 * cong thuc xung/hop cua `theoTuoi` (`src/loi/homNay.ts`) cho moi cap chi.
 */
import { CHI, soNgay, tuSoNgay } from '../src/loi/amLich.ts';
import { hv } from '../src/loi/hanViet/index.ts';
import { theoTuoi, xemNgay } from '../src/loi/homNay.ts';
import { tuoiHop } from '../src/loi/tuoiHop.ts';

const TEN = Array.from({ length: 12 }, (_, i) => hv('chi', CHI.charAt(i)));
const so = (ten: string): number => TEN.indexOf(ten);

describe('tuoi hop, tuoi ky', () => {
  test('tuoi Ty (vi du mytour, dienmayxanh)', () => {
    expect(tuoiHop(0)).toEqual({
      tamHop: ['Thìn', 'Thân'], lucHop: 'Sửu', tuHanhXung: ['Mão', 'Ngọ', 'Dậu'], lucXung: 'Ngọ', lucHai: 'Mùi',
    });
  });

  test('bang cac nguon: 4 nhom tam hop, 3 nhom tu hanh xung, 6 cap luc hop, luc xung, luc hai — doi xung hai chieu', () => {
    // https://www.dienmayxanh.com/kinh-nghiem-hay/tam-hop-la-gi-tu-hanh-xung-la-gi-1588018 ·
    // https://mytour.vn/vi/blog/bai-viet/tai-sao-lai-co-cac-khai-niem-nhu-tam-hop-tu-hanh-xung-luc-hop-va-luc-hai-giua-cac-tuoi.html ·
    // https://giaoducthudo.giaoducthoidai.vn/vi-dau-co-tam-hop-tu-hanh-xung-luc-hop-luc-hai-giua-cac-tuoi-voi-nhau-112321.html
    const nhom = (ds: string[][], lay: (c: number) => readonly string[]): void => {
      for (const g of ds) for (const c of g) expect([...lay(so(c))].sort()).toEqual(g.filter((x) => x !== c).sort());
    };
    nhom([['Thân', 'Tý', 'Thìn'], ['Dần', 'Ngọ', 'Tuất'], ['Tỵ', 'Dậu', 'Sửu'], ['Hợi', 'Mão', 'Mùi']], (c) => tuoiHop(c).tamHop);
    nhom([['Tý', 'Ngọ', 'Mão', 'Dậu'], ['Thìn', 'Tuất', 'Sửu', 'Mùi'], ['Dần', 'Thân', 'Tỵ', 'Hợi']], (c) => tuoiHop(c).tuHanhXung);
    nhom([['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'], ['Thìn', 'Dậu'], ['Tỵ', 'Thân'], ['Ngọ', 'Mùi']], (c) => [tuoiHop(c).lucHop]);
    nhom([['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'], ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi']], (c) => [tuoiHop(c).lucXung]);
    nhom([['Tý', 'Mùi'], ['Sửu', 'Ngọ'], ['Dần', 'Tỵ'], ['Mão', 'Thìn'], ['Thân', 'Hợi'], ['Dậu', 'Tuất']], (c) => [tuoiHop(c).lucHai]);
  });

  test('khop theoTuoi (man Hom nay) moi cap chi ngay x chi nam sinh', () => {
    const dau = soNgay({ nam: 2026, thang: 10, ngay: 19 });
    const lech: string[] = [];
    for (let i = 0; i < 12; i++) {
      const ngay = xemNgay(tuSoNgay(dau + i));
      const chiNgay = TEN[ngay.chiNgay] ?? '';
      for (let b = 0; b < 12; b++) {
        const t = tuoiHop(b);
        const mong = t.lucXung === chiNgay ? 'xung' : [...t.tamHop, t.lucHop].includes(chiNgay) ? 'hop' : 'binh';
        const may = theoTuoi(ngay, b, 'Kim').quanHe;
        if (may !== mong) lech.push(`ngay ${chiNgay}, tuoi ${String(TEN[b])}: theoTuoi ${may}, tuoiHop ${mong}`);
      }
    }
    expect(lech).toEqual([]);
  });
});
