/**
 * Thuoc Lo Ban (`src/loi/loBan.ts`, QUY_UOC muc 21): ten, thu tu, tot/xau cung lon theo nguon; ranh cung tung 0,1 mm;
 * cac so "dep" trang Viet cong bo (qua trich doan tim kiem 21/10) phai roi tron trong cung tot.
 */
import { THUOC_LO_BAN, xemLoBan } from '../src/loi/loBan.ts';

const theo = (cm: number, dai: number) => {
  const x = xemLoBan(cm).find((r) => r.thuoc.dai === dai);
  if (x === undefined) throw new Error(`khong co thuoc ${String(dai)}`);
  return x;
};
const tot = (t: number): string[] => (THUOC_LO_BAN.find((x) => x.dai === t)?.cung ?? []).filter((c) => c.tot).map((c) => c.ten);

describe('thuoc Lo Ban', () => {
  test('ten, thu tu, cung tot moi thuoc (quantrimang, batdongsan wiki, mytour, uptogo)', () => {
    expect(THUOC_LO_BAN.map((t) => t.cung.map((c) => c.ten).join(' '))).toEqual([
      'Quý Nhân Hiểm Họa Thiên Tai Thiên Tài Nhân Lộc Cô Độc Thiên Tặc Tể Tướng',
      'Tài Bệnh Ly Nghĩa Quan Kiếp (Nạn) Hại Bản (Mạng)',
      'Đinh Hại Vượng Khổ Nghĩa Quan Tử Hưng Thất Tài',
    ]);
    expect(tot(52.2)).toEqual(['Quý Nhân', 'Thiên Tài', 'Nhân Lộc', 'Tể Tướng']);
    expect(tot(42.9)).toEqual(['Tài', 'Nghĩa', 'Quan', 'Bản (Mạng)']);
    expect(tot(38.8)).toEqual(['Đinh', 'Vượng', 'Nghĩa', 'Quan', 'Hưng', 'Tài']);
  });

  test('ranh cung dung tung 0,1 mm; dung ranh thi sang cung sau', () => {
    expect(theo(5.36, 42.9).doan).toMatchObject({ cung: { ten: 'Tài' }, tuMm: 0, denMm: 53 }); // ranh 53,625 mm
    expect(theo(5.37, 42.9).doan).toMatchObject({ cung: { ten: 'Bệnh' }, tuMm: 54, denMm: 107 });
    expect(theo(81, 52.2).doan).toMatchObject({ cung: { ten: 'Nhân Lộc' }, tuMm: 783, denMm: 848 });
    expect(theo(38.8, 38.8).doan).toMatchObject({ cung: { ten: 'Đinh' }, tuMm: 388, denMm: 426 }); // het vong thu nhat
    expect(theo(38.79, 38.8).doan.cung.ten).toBe('Tài');
  });

  test('cung xau: chi doan tot gan nhat hai ben', () => {
    const x = theo(10, 52.2); // 100 mm: Hiem Hoa
    expect(x.doan.cung.ten).toBe('Hiểm Họa');
    expect(x.totDuoi).toMatchObject({ cung: { ten: 'Quý Nhân' }, tuMm: 0, denMm: 65 });
    expect(x.totTren).toMatchObject({ cung: { ten: 'Thiên Tài' }, tuMm: 196, denMm: 260 });
    expect(theo(81, 52.2).totTren).toBeUndefined();
    expect(theo(4, 38.8).totDuoi).toMatchObject({ cung: { ten: 'Đinh' }, tuMm: 0, denMm: 38 });
  });

  test('khoang cua trang Viet cong bo nam tron trong mot cung tot cua thuoc 52,2', () => {
    // voh (cua chinh mot canh): rong 80,8–82,6, cao 210,6–214,8, rong 105,5–109; batdongsan wiki (cua phong ngu): 80,5–81,8 x 210,8–214,2.
    for (const [a, b] of [[80.8, 82.6], [210.6, 214.8], [105.5, 109], [80.5, 81.8], [210.8, 214.2]] as const) {
      const [x, y] = [theo(a, 52.2).doan, theo(b, 52.2).doan];
      expect(x.cung.tot && x.tuMm === y.tuMm, `${String(a)}–${String(b)}`).toBe(true);
    }
  });

  test('ban tho trang Viet goi y deu roi cung tot thuoc 38,8 (thuviennhadat, scrapbox ban tho dung)', () => {
    for (const cm of [41, 48, 61, 67, 69, 81, 107, 127, 153, 175]) expect(theo(cm, 38.8).doan.cung.tot, String(cm)).toBe(true);
  });

  test('so do sai thi nem loi', () => {
    for (const x of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, 10_001]) expect(() => xemLoBan(x), String(x)).toThrow();
  });
});
