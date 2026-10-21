/**
 * La ban (`src/loi/laBan.ts`, QUY_UOC muc 20): bang 24 son go tay theo nguon (Wikipedia "Flying Star Feng Shui",
 * SCMP "mastering degrees": moi son 15°, Nham 337,5–352,5, Ty 352,5–7,5 …), khong suy ra tu cong thuc trong ma.
 */
import { phuong, RANH, xemLaBan } from '../src/loi/laBan.ts';

// [son, do bat dau, huong, que] theo thu tu vong la ban.
const BANG: readonly (readonly [string, number, string, string])[] = [
  ['Nhâm', 337.5, 'Bắc', 'Khảm'], ['Tý', 352.5, 'Bắc', 'Khảm'], ['Quý', 7.5, 'Bắc', 'Khảm'],
  ['Sửu', 22.5, 'Đông Bắc', 'Cấn'], ['Cấn', 37.5, 'Đông Bắc', 'Cấn'], ['Dần', 52.5, 'Đông Bắc', 'Cấn'],
  ['Giáp', 67.5, 'Đông', 'Chấn'], ['Mão', 82.5, 'Đông', 'Chấn'], ['Ất', 97.5, 'Đông', 'Chấn'],
  ['Thìn', 112.5, 'Đông Nam', 'Tốn'], ['Tốn', 127.5, 'Đông Nam', 'Tốn'], ['Tỵ', 142.5, 'Đông Nam', 'Tốn'],
  ['Bính', 157.5, 'Nam', 'Ly'], ['Ngọ', 172.5, 'Nam', 'Ly'], ['Đinh', 187.5, 'Nam', 'Ly'],
  ['Mùi', 202.5, 'Tây Nam', 'Khôn'], ['Khôn', 217.5, 'Tây Nam', 'Khôn'], ['Thân', 232.5, 'Tây Nam', 'Khôn'],
  ['Canh', 247.5, 'Tây', 'Đoài'], ['Dậu', 262.5, 'Tây', 'Đoài'], ['Tân', 277.5, 'Tây', 'Đoài'],
  ['Tuất', 292.5, 'Tây Bắc', 'Càn'], ['Càn', 307.5, 'Tây Bắc', 'Càn'], ['Hợi', 322.5, 'Tây Bắc', 'Càn'],
];

describe('la ban', () => {
  test('24 son: dau son, giua son, sat cuoi son deu dung ten, huong, que', () => {
    for (const [son, tu, huong, quai] of BANG) {
      for (const d of [tu, tu + 7.5, tu + 14.99]) expect(phuong(d), `${son} ${String(d)}°`).toMatchObject({ son, huong, quai });
    }
  });

  test('do ngoai 0–360 quy ve vong; 360° = 0° = Ty', () => {
    expect(phuong(360)).toEqual(phuong(0));
    expect(phuong(-1).son).toBe('Tý');
    expect(phuong(-22).son).toBe('Nhâm'); // 338°
    expect(phuong(-23).son).toBe('Hợi'); // 337°
    expect(phuong(725).son).toBe('Tý');
    expect(() => xemLaBan(Number.NaN)).toThrow();
  });

  test('toa la son doi dien: 12 cap toa–huong', () => {
    const cap = [['Tý', 'Ngọ'], ['Nhâm', 'Bính'], ['Quý', 'Đinh'], ['Sửu', 'Mùi'], ['Cấn', 'Khôn'], ['Dần', 'Thân'],
      ['Giáp', 'Canh'], ['Mão', 'Dậu'], ['Ất', 'Tân'], ['Thìn', 'Tuất'], ['Tốn', 'Càn'], ['Tỵ', 'Hợi']];
    for (const [son, tu] of BANG) {
      const x = xemLaBan(tu + 7.5);
      expect(cap.some(([a, b]) => (a === son && b === x.toa.son) || (b === son && a === x.toa.son)), son).toBe(true);
    }
    // vnexpress (Sua nha bep hop phong thuy): 215° la tọa Sửu hướng Mùi.
    expect(xemLaBan(215)).toMatchObject({ huong: { son: 'Mùi' }, toa: { son: 'Sửu' } });
  });

  test('sat ranh duoi 3°: chi ra son ben kia ranh va khoang cach', () => {
    expect(RANH).toBe(3);
    expect(xemLaBan(15).satRanh).toBeNull(); // giua son Quy
    expect(xemLaBan(10.5).satRanh).toBeNull(); // cach ranh dung 3°
    expect(xemLaBan(5).satRanh).toMatchObject({ ke: { son: 'Quý', huong: 'Bắc' }, cach: 2.5 });
    expect(xemLaBan(22).satRanh).toMatchObject({ ke: { son: 'Sửu', huong: 'Đông Bắc' }, cach: 0.5 });
    expect(xemLaBan(23).satRanh).toMatchObject({ ke: { son: 'Quý', huong: 'Bắc' }, cach: 0.5 });
    expect(xemLaBan(339).satRanh).toMatchObject({ ke: { son: 'Hợi', huong: 'Tây Bắc' }, cach: 1.5 });
  });
});
