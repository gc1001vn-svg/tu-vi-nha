/**
 * Nam nay (`src/loi/namNay.ts`): so bang sao han in san nam 2026 (Binh Ngo) theo nam sinh, vai ca 2025, danh sach tuoi
 * gap tung sao/han, Kim Lau, Hoang Oc, Tam Tai, Thai Tue 2026 tren bao/trang tra cuu. Ngay sinh deu GIA (15/06, luat 1).
 * Nguon doc qua trich doan ket qua tim kiem (may ao chan mo trang goc), tra 19/10/2026.
 */
import type { NgayDuong } from '../src/loi/amLich.ts';
import { tinhHoSo, type GioiTinh, type HoSo } from '../src/loi/hoSo.ts';
import { namNay, type TuyChonNamNay } from '../src/loi/namNay.ts';

const XEM: NgayDuong = { nam: 2026, thang: 10, ngay: 19 };
const hs = (namSinh: number, gioiTinh: GioiTinh, ngaySinh = `${String(namSinh)}-06-15`): HoSo =>
  ({ id: 'x', ten: 'Thử', gioiTinh, ngaySinh, gioSinh: '12:00', noiSinh: 'Hà Nội' });
const nn = (namSinh: number, gioiTinh: GioiTinh, xem = XEM, tc?: TuyChonNamNay) => {
  const h = hs(namSinh, gioiTinh);
  return namNay(h, tinhHoSo(h).chinh, xem, tc);
};
/** Theo tuoi mu nam 2026. */
const tuoi = (n: number, gioiTinh: GioiTinh, tc?: TuyChonNamNay) => nn(2026 - n + 1, gioiTinh, XEM, tc);
const CA: readonly GioiTinh[] = ['nam', 'nu'];

// [nam sinh, sao nam, han nam, sao nu, han nu]. Bao ghi "Toan Tan" = Tan Tan, "Van Han" = Van Hon.
// Moi trang lichngaytot co them bang nam 2027 (tuoi mu + 1) — da bo, chi lay bang 2026 khop bai luan giai tung tuoi.
const BANG_2026: readonly (readonly [number, string, string, string, string])[] = [
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-ty-nam-2026-304-232429.html
  [1960, 'Thái Bạch', 'Tán Tận', 'Thái Âm', 'Huỳnh Tuyền'],
  [1972, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  [1984, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng'],
  [1996, 'Thái Bạch', 'Thiên Tinh', 'Thái Âm', 'Tam Kheo'],
  [2008, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-suu-nam-2026-304-232430.html
  [1961, 'Thủy Diệu', 'Thiên Tinh', 'Mộc Đức', 'Tam Kheo'],
  [1973, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  [1985, 'Vân Hớn', 'Thiên La', 'La Hầu', 'Diêm Vương'],
  [1997, 'Thủy Diệu', 'Ngũ Mộ', 'Mộc Đức', 'Ngũ Mộ'],
  [2009, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-dan-nam-2026-304-232431.html
  [1962, 'Thổ Tú', 'Ngũ Mộ', 'Vân Hớn', 'Ngũ Mộ'],
  [1974, 'Thái Âm', 'Diêm Vương', 'Thái Bạch', 'Thiên La'],
  [1986, 'Thái Dương', 'Tán Tận', 'Thổ Tú', 'Huỳnh Tuyền'],
  [1998, 'Thổ Tú', 'Ngũ Mộ', 'Vân Hớn', 'Ngũ Mộ'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-mao-nam-2026-304-232432.html
  [1963, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  [1975, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng'],
  [1987, 'Thái Bạch', 'Thiên Tinh', 'Thái Âm', 'Tam Kheo'],
  [1999, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-thin-nam-2026-304-232433.html
  [1964, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  [1976, 'Vân Hớn', 'Thiên La', 'La Hầu', 'Diêm Vương'],
  [1988, 'Thủy Diệu', 'Thiên Tinh', 'Mộc Đức', 'Tam Kheo'], // nu: gabygem.vn cung ghi Moc Duc, Tam Kheo
  [2000, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-ngo-nam-2026-304-232435.html
  [1954, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  [1966, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng'], // thuvienphapluat ghi giong het
  [1978, 'Thái Bạch', 'Tán Tận', 'Thái Âm', 'Huỳnh Tuyền'], // nu: hoatieu.vn/tai-lieu/bang-tinh-sao-han-204566
  [1990, 'La Hầu', 'Tam Kheo', 'Kế Đô', 'Thiên Tinh'],
  [2002, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng'],
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-than-nam-2026-304-232437.html
  [1968, 'Thái Dương', 'Thiên La', 'Thổ Tú', 'Diêm Vương'],
  [1980, 'Thổ Tú', 'Ngũ Mộ', 'Vân Hớn', 'Ngũ Mộ'],
  [1992, 'Thái Âm', 'Diêm Vương', 'Thái Bạch', 'Thiên La'],
  [2004, 'Thái Dương', 'Tán Tận', 'Thổ Tú', 'Huỳnh Tuyền'],
  // https://tuoiam.com/sao-han/
  [1982, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  // https://hoatieu.vn/tai-lieu/xem-sao-han-tuoi-ti-206372 · https://hoatieu.vn/tai-lieu/xem-sao-han-tuoi-mui-206416 ·
  // https://lichngaytot.com/tu-vi/sao-han-tuoi-dau-nam-2026-304-232438.html · https://hoatieu.vn/tai-lieu/xem-sao-han-tuoi-hoi-206421
  [1989, 'Thổ Tú', 'Ngũ Mộ', 'Vân Hớn', 'Ngũ Mộ'],
  [1991, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'],
  [1993, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng'],
  [1995, 'Thái Dương', 'Tán Tận', 'Thổ Tú', 'Huỳnh Tuyền'],
];

const soBang = (bang: typeof BANG_2026, xem: NgayDuong): string[] =>
  bang.flatMap(([nam, saoNam, hanNam, saoNu, hanNu]) => {
    const [a, b] = [nn(nam, 'nam', xem), nn(nam, 'nu', xem)];
    const may = `${a.sao.ten}/${a.han.ten} | ${b.sao.ten}/${b.han.ten}`;
    const bao = `${saoNam}/${hanNam} | ${saoNu}/${hanNu}`;
    return may === bao ? [] : [`${String(nam)}: bao ${bao} — may ${may}`];
  });

describe('sao han Cuu Dieu + 8 han', () => {
  test('bang in san 2026: 36 nam sinh x 2 gioi, sao va han deu khop', () => {
    expect(BANG_2026.length).toBe(36);
    expect(soBang(BANG_2026, XEM)).toEqual([]);
    // Nam Tan Dau 1981: https://waka.vn/bang-xem-sao-han-theo-nam-sinh-chinh-xac-nhat-0grd
    expect([nn(1981, 'nam').sao.ten, nn(1981, 'nam').han.ten]).toEqual(['La Hầu', 'Tam Kheo']);
  });

  test('bang 2025 (At Ty): mogi.vn (1990), fahasa.com (1965)', () => {
    // https://mogi.vn/news/bang-sao-han-2025-270399/ · https://www.fahasa.com/blog/bang-sao-han-nam-2025-cho-tung-tuoi/
    expect(soBang([[1990, 'Mộc Đức', 'Huỳnh Tuyền', 'Thủy Diệu', 'Tán Tận'], [1965, 'Kế Đô', 'Địa Võng', 'Thái Dương', 'Địa Võng']],
      { nam: 2025, thang: 6, ngay: 15 })).toEqual([]);
  });

  // [ten, gioi (null = ca hai), cac tuoi mu]. Sao: hoatieu (cung-sao-ke-do, -moc-duc, -la-hau, -van-hon, -thai-bach),
  // thuvienphapluat (sao-thai-bach-chieu-menh…). Han: https://tuvisonlong.com/han-hang-nam-la-gi/ (Huynh Tuyen, Tam Kheo,
  // Ngu Mo), hoatieu bang-tinh-sao-han-204566 + fahasa (Diem Vuong, Thien La, Dia Vong).
  const DS: readonly (readonly ['sao' | 'han', string, GioiTinh | null, readonly number[]])[] = [
    ['sao', 'Kế Đô', 'nam', [7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97]],
    ['sao', 'Kế Đô', 'nu', [10, 19, 28, 37, 46, 55, 64, 73]],
    ['sao', 'Mộc Đức', 'nam', [9, 18, 27, 36, 45, 54, 63, 72, 81, 90]],
    ['sao', 'Mộc Đức', 'nu', [3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93]],
    ['sao', 'La Hầu', 'nam', [10, 19, 28, 37, 46, 55, 64, 73, 82, 91]],
    ['sao', 'Vân Hớn', 'nam', [6, 15, 24, 33, 42, 51, 60, 69, 78, 87]],
    ['sao', 'Vân Hớn', 'nu', [11, 20, 29, 38, 47, 56, 65, 74, 83]],
    ['sao', 'Thái Bạch', 'nam', [4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94]],
    ['sao', 'Thái Bạch', 'nu', [8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98]],
    ['han', 'Huỳnh Tuyền', 'nam', [18, 27, 36, 45, 54, 63, 72, 81, 89, 90, 98]],
    ['han', 'Huỳnh Tuyền', 'nu', [14, 23, 32, 41, 49, 50, 58, 67, 76, 85, 94]],
    ['han', 'Tam Kheo', 'nam', [11, 19, 20, 28, 37, 46, 55, 64, 73, 82, 91]],
    ['han', 'Tam Kheo', 'nu', [13, 22, 31, 39, 40, 48, 57, 66, 75, 84, 93]],
    ['han', 'Ngũ Mộ', null, [12, 21, 29, 30, 38, 47, 56, 65, 74, 83, 92]],
    ['han', 'Diêm Vương', 'nam', [17, 26, 35, 44, 53, 62, 71, 79, 80, 88, 97]],
    ['han', 'Diêm Vương', 'nu', [15, 24, 33, 42, 51, 59, 60, 68, 77, 86, 95]],
    ['han', 'Thiên La', 'nam', [15, 24, 33, 42, 51, 59, 60, 68, 77, 86, 95]],
    ['han', 'Thiên La', 'nu', [17, 26, 35, 44, 53, 62, 71, 79, 80, 88, 97]],
    ['han', 'Địa Võng', null, [16, 25, 34, 43, 52, 61, 69, 70, 78, 87, 96]],
  ];

  test('danh sach tuoi gap tung sao, han (han dem so chuc + so don vi: 89 va 90 cung Huynh Tuyen)', () => {
    const lech = DS.flatMap(([loai, ten, gioi, ds]) => ds.flatMap((n) => (gioi === null ? CA : [gioi]).flatMap((g) => {
      const may = tuoi(n, g)[loai].ten;
      return may === ten ? [] : [`${String(n)} ${g}: nguon ${ten}, may ${may}`];
    })));
    expect(lech).toEqual([]);
  });

  test('vong sao nam trung bang hanh nien Cuu Dieu cua kinh 1311, 1308 va chua Nhat (数え年), tuoi 1–9', () => {
    // 梵天火羅九曜 (T1311): "羅睺…年一、十、十九…", "土宿…年二、十一…", 北辰(水) 3, 太白 4, 大陽 5, 熒惑(火) 6, 計都 7, 大陰 8,
    // 歲星(木) 9; 七曜攘災決 (T1308) 九執至行年法 cung thu tu — XML CBETA github.com/cbeta-org/xml-p5 T/T21. Chua Nhat:
    // nckoyasan.org (1–3), engakuji.jp (1, 4, 9), higoyo.me, saijigoyomi (5–8).
    expect(Array.from({ length: 9 }, (_, i) => tuoi(i + 1, 'nam').sao.ten)).toEqual(
      ['La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hớn', 'Kế Đô', 'Thái Âm', 'Mộc Đức']);
  });

  test('nam xem doi o Tet; sinh truoc Tet tinh nam am truoc', () => {
    // Tet Binh Ngo 17/02/2026.
    expect(nn(1990, 'nam', { nam: 2026, thang: 2, ngay: 16 })).toMatchObject({ namAm: 2025, canChi: 'Ất Tỵ', tuoiMu: 36 });
    expect(nn(1990, 'nam', { nam: 2026, thang: 2, ngay: 17 })).toMatchObject({ namAm: 2026, canChi: 'Bính Ngọ', tuoiMu: 37 });
    // 20/01/1990 truoc Tet Canh Ngo (27/01/1990) -> nam Ky Ty, nhu dong 1989.
    const h = hs(1990, 'nam', '1990-01-20');
    expect(namNay(h, tinhHoSo(h).chinh, XEM)).toMatchObject({ tuoiMu: 38, sao: { ten: 'Thổ Tú' }, han: { ten: 'Ngũ Mộ' } });
  });

  test('duoi 10 tuoi mu: sao van tinh, han / Kim Lau / Hoang Oc chua xet; ngay xem truoc nam sinh thi bao loi', () => {
    expect(tuoi(3, 'nu')).toMatchObject({ sao: { ten: 'Mộc Đức' }, han: { ten: 'Chưa xét' }, kimLau: { ten: 'Chưa xét' } });
    const h = hs(2030, 'nam');
    expect(() => namNay(h, tinhHoSo(h).chinh, XEM)).toThrow('trước năm sinh');
  });
});

describe('Kim Lau, Hoang Oc', () => {
  test('Kim Lau 2026: fptshop, radanhadat, zmili, thientue', () => {
    // https://fptshop.com.vn/tin-tuc/for-gamers/2026-tuoi-nao-pham-kim-lau-200222 (2003…1990)
    // https://radanhadat.vn/edutech/tuoi-mau-thin-1988-lam-nha-nam-2026 (1988) · https://zmili.vn/tuoi-binh-ty-nam-2026-co-lam-nha-duoc-khong/
    // (1996 khong pham) · https://thientue.vn/sinh-nam-2000-lam-nha-nam-2026.html (2000 khong pham). Nhan theo so du;
    // ngoisao.vn ghi nhan nguoc thu tu (1956 Than…) — bo.
    const ca: readonly (readonly [number, string])[] = [
      [2003, 'Kim Lâu Tử'], [2001, 'Kim Lâu Lục Súc'], [1999, 'Kim Lâu Thân'], [1997, 'Kim Lâu Thê'], [1994, 'Kim Lâu Tử'],
      [1992, 'Kim Lâu Lục Súc'], [1990, 'Kim Lâu Thân'], [1988, 'Kim Lâu Thê'], [1996, 'Không phạm'], [2000, 'Không phạm'],
    ];
    expect(ca.map(([nam]) => [nam, nn(nam, 'nam').kimLau.ten])).toEqual(ca);
  });

  test('Kim Lau: cach cong chu so toi mot chu so ra cung ket qua chia 9 (khong can tuy chon), 10..120 tuoi', () => {
    const cong = (n: number): number => (n < 10 ? n : cong(String(n).split('').reduce((s, c) => s + Number(c), 0)));
    const lech = Array.from({ length: 111 }, (_, i) => i + 10)
      .filter((n) => (tuoi(n, 'nam').kimLau.mucDo === 'xau') !== [1, 3, 6, 8].includes(cong(n)));
    expect(lech).toEqual([]);
  });

  test('Hoang Oc theo chuc (mac dinh): vi du trong cac bai huong dan', () => {
    // dienmayxanh (ban tay: 33), nhadepktv (34, 38), homedy + huyenbi (40, 45), "cong hai chu so chia 6" (28),
    // radanhadat (1988 -> 39), mogi (2000 -> 27); moc chuc 10…70 moi nguon deu ghi.
    const ca: readonly (readonly [number, string])[] = [
      [10, 'Nhất Cát'], [20, 'Nhì Nghi'], [30, 'Tam Địa Sát'], [40, 'Tứ Tấn Tài'], [50, 'Ngũ Thọ Tử'], [60, 'Lục Hoang Ốc'],
      [70, 'Nhất Cát'], [33, 'Lục Hoang Ốc'], [34, 'Nhất Cát'], [38, 'Ngũ Thọ Tử'], [45, 'Tam Địa Sát'], [28, 'Tứ Tấn Tài'],
      [39, 'Lục Hoang Ốc'], [27, 'Tam Địa Sát'],
    ];
    expect(ca.map(([n]) => [n, tuoi(n, 'nam').hoangOc.ten])).toEqual(ca);
  });

  test('Hoang Oc tuy chon demTiep: bang vinhomes (26, 27), danh sach Ngu Tho Tu 14, 20, 26, 32, 38', () => {
    // https://market.vinhomes.vn/blog/han-hoang-oc
    const dem = (n: number): string => tuoi(n, 'nam', { hoangOc: 'demTiep' }).hoangOc.ten;
    expect([26, 27].map(dem)).toEqual(['Ngũ Thọ Tử', 'Lục Hoang Ốc']);
    expect([14, 20, 26, 32, 38].map(dem)).toEqual(new Array<string>(5).fill('Ngũ Thọ Tử'));
    expect(dem(10)).toBe('Nhất Cát');
  });
});

describe('Tam Tai, Thai Tue', () => {
  const tamTai = (namSinh: number, xem = XEM): string => nn(namSinh, 'nam', xem).tamTai.ten;
  test('Tam Tai 2026: Hoi, Mao, Mui nam thu 2; Thin khong pham (vietnamnet, eva, kenh14, radanhadat, mogi)', () => {
    // https://vietnamnet.vn/han-tam-tai-nam-2026-co-nhung-tuoi-nao-cach-hoa-giai-han-tam-tai-2485550.html
    const ds = Array.from({ length: 12 }, (_, i) => 1984 + i).filter((nam) => tamTai(nam) !== 'Không phạm');
    expect(ds.map((nam) => [nam, tamTai(nam)])).toEqual([[1987, 'Năm thứ 2/3'], [1991, 'Năm thứ 2/3'], [1995, 'Năm thứ 2/3']]);
    expect([tamTai(1988), tamTai(2000)]).toEqual(['Không phạm', 'Không phạm']);
  });

  test('Tam Tai Giap Ty 1984 roi vao nam Dan, Mao, Thin (luatminhkhue, wiki.batdongsan); 2025 Hoi nam thu 1', () => {
    expect([2022, 2023, 2024, 2025].map((nam) => tamTai(1984, { nam, thang: 6, ngay: 15 })))
      .toEqual(['Năm thứ 1/3', 'Năm thứ 2/3', 'Năm thứ 3/3', 'Không phạm']);
    expect(nn(1984, 'nam').tamTai.nghia).toBe('Tuổi Tý gặp Tam Tai các năm Dần, Mão, Thìn.');
    expect(tamTai(1995, { nam: 2025, thang: 6, ngay: 15 })).toBe('Năm thứ 1/3');
  });

  const thaiTue = (xem: NgayDuong): string[] => Array.from({ length: 12 }, (_, i) => nn(1984 + i, 'nam', xem).thaiTue.ten);
  test('Thai Tue 2026 Ngo: Ngo tri + tu hinh, Ty xung, Suu hai, Mao pha (soha, kenh14, hk01)', () => {
    expect(thaiTue(XEM)).toEqual([
      'Xung Thái Tuế', 'Hại Thái Tuế', 'Không phạm', 'Phá Thái Tuế', 'Không phạm', 'Không phạm',
      'Trị Thái Tuế, Hình Thái Tuế', 'Không phạm', 'Không phạm', 'Không phạm', 'Không phạm', 'Không phạm',
    ]);
  });

  test('Thai Tue 2025 Ty: Ty tri, Hoi xung, Dan hinh + hai, Than hinh + pha (tvbs, udn, fptshop)', () => {
    const t = thaiTue({ nam: 2025, thang: 6, ngay: 15 });
    expect([t[2], t[5], t[8], t[11]]).toEqual(['Hình Thái Tuế, Hại Thái Tuế', 'Trị Thái Tuế', 'Hình Thái Tuế, Phá Thái Tuế', 'Xung Thái Tuế']);
    expect(t.filter((x) => x !== 'Không phạm')).toHaveLength(4);
  });
});
