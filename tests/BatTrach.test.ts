/**
 * Bat trach (`src/loi/batTrach.ts`): moi cung du 8 huong khong trung, Phuc Vi = huong cua chinh quai, Dong/Tay tu menh
 * chi tot o nhom huong cua minh; dung lai bang bang phep bien hao Du Nien; vai ca doi chieu nguon.
 */
import { batTrach } from '../src/loi/batTrach.ts';
import { tinhHoSo } from '../src/loi/hoSo.ts';

// Hau Thien bat quai: quai -> [huong, 3 hao tu duoi len (1 = duong)].
const QUAI: Readonly<Record<string, readonly [string, number]>> = {
  Khảm: ['Bắc', 0b010], Cấn: ['Đông Bắc', 0b001], Chấn: ['Đông', 0b100], Tốn: ['Đông Nam', 0b011],
  Ly: ['Nam', 0b101], Khôn: ['Tây Nam', 0b000], Đoài: ['Tây', 0b110], Càn: ['Tây Bắc', 0b111],
};
// Bit cao = hao duoi. Du Nien: Sinh Khi doi hao tren, Thien Y doi hao duoi + giua, Dien Nien doi ca ba…
const BIEN: Readonly<Record<string, number>> = {
  'Sinh Khí': 0b001, 'Thiên Y': 0b110, 'Diên Niên': 0b111, 'Phục Vị': 0,
  'Tuyệt Mệnh': 0b010, 'Ngũ Quỷ': 0b011, 'Lục Sát': 0b101, 'Họa Hại': 0b100,
};
const DONG = ['Bắc', 'Nam', 'Đông', 'Đông Nam'];
const theoHuong = (cung: string): Record<string, string> =>
  Object.fromEntries(batTrach(cung).huong.map((h) => [h.sao, h.huong]));

describe('bat trach', () => {
  test('moi cung: 8 huong khong trung, Phuc Vi la huong cua quai, 4 huong tot cung nhom Dong/Tay tu trach', () => {
    for (const [cung, [huong]] of Object.entries(QUAI)) {
      const bt = batTrach(cung);
      expect(new Set(bt.huong.map((h) => h.huong))).toEqual(new Set(Object.values(QUAI).map(([x]) => x)));
      expect(theoHuong(cung)['Phục Vị']).toBe(huong);
      const dong = DONG.includes(huong);
      expect(bt.nhom).toBe(dong ? 'Đông tứ mệnh' : 'Tây tứ mệnh');
      expect(bt.huong.filter((h) => h.tot).every((h) => DONG.includes(h.huong) === dong)).toBe(true);
    }
  });

  test('bang khop phep bien hao Du Nien (Dai Du Nien) cho ca 64 o', () => {
    const lech: string[] = [];
    for (const [cung, [, hao]] of Object.entries(QUAI)) {
      for (const h of batTrach(cung).huong) {
        const ra = Object.values(QUAI).find(([, x]) => x === (hao ^ (BIEN[h.sao] ?? -1)))?.[0];
        if (ra !== h.huong) lech.push(`${cung} ${h.sao}: bang ${h.huong}, bien hao ${String(ra)}`);
      }
    }
    expect(lech).toEqual([]);
  });

  test('doi chieu nguon', () => {
    // https://www.blogphongthuy.com/cac-huong-tot-xau-voi-8-menh-cung.html (Can du 8 huong)
    expect(theoHuong('Càn')).toEqual({
      'Sinh Khí': 'Tây', 'Thiên Y': 'Đông Bắc', 'Diên Niên': 'Tây Nam', 'Phục Vị': 'Tây Bắc',
      'Tuyệt Mệnh': 'Nam', 'Ngũ Quỷ': 'Đông', 'Lục Sát': 'Bắc', 'Họa Hại': 'Đông Nam',
    });
    // https://wiki.batdongsan.com.vn/wiki/xem-huong-tot-va-xau-cho-tung-cung-menh-58093: Sinh Khi tung cung
    expect(Object.keys(QUAI).map((c) => theoHuong(c)['Sinh Khí'])).toEqual(
      ['Đông Nam', 'Tây Nam', 'Nam', 'Bắc', 'Đông', 'Đông Bắc', 'Tây Bắc', 'Tây']);
    // Ly du 8 huong (mytour cung-ly-la-gi, vmstyle); Chan (vatphamphongthuy); Doai (phongthuyminhviet); Kham (happynest)
    expect(theoHuong('Ly')).toMatchObject({ 'Sinh Khí': 'Đông', 'Thiên Y': 'Đông Nam', 'Diên Niên': 'Bắc', 'Phục Vị': 'Nam',
      'Tuyệt Mệnh': 'Tây Bắc', 'Ngũ Quỷ': 'Tây', 'Lục Sát': 'Tây Nam', 'Họa Hại': 'Đông Bắc' });
    expect(theoHuong('Chấn')).toMatchObject({ 'Sinh Khí': 'Nam', 'Thiên Y': 'Bắc', 'Diên Niên': 'Đông Nam', 'Phục Vị': 'Đông' });
    expect(theoHuong('Đoài')).toMatchObject({ 'Sinh Khí': 'Tây Bắc', 'Thiên Y': 'Tây Nam', 'Diên Niên': 'Đông Bắc' });
    expect(theoHuong('Khảm')).toMatchObject({ 'Sinh Khí': 'Đông Nam', 'Thiên Y': 'Đông', 'Diên Niên': 'Nam', 'Phục Vị': 'Bắc' });
  });

  test('lay cung phi tu ho so (nam 1996 cung Ton: Dong tu menh); cung la thi bao loi', () => {
    const k = tinhHoSo({ id: 'x', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1996-06-15', gioSinh: '12:00', noiSinh: 'Hà Nội' }).chinh;
    expect(batTrach(k.cungPhi).nhom).toBe('Đông tứ mệnh');
    expect(() => batTrach('Trung')).toThrow('Không có cung phi');
  });
});
