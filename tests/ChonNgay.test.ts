/**
 * Chon ngay theo viec (`src/loi/chonNgay.ts`): Khong Minh so 9 anh lich anh chup (`scripts/doi-chieu/mau-lich.json`),
 * ca mau tung bang ngay xau, gio Ly Thuan Phong, luat cham Tot/Duoc/Tranh, canh bao nam.
 */
import mau from '../scripts/doi-chieu/mau-lich.json';
import { duongSangAm, soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { canhBaoNam, chamNgay, chonNgay, gioLyThuanPhong, khongMinh, ngayXauThang, VIEC, type Viec } from '../src/loi/chonNgay.ts';
import { xemNgay } from '../src/loi/homNay.ts';

const ngay = (s: string): NgayDuong => {
  const [nam = 0, thang = 0, d = 0] = s.split('-').map(Number);
  return { nam, thang, ngay: d };
};

// Ca lay tu trang lich theo ngay (xemlicham, lichngaytot, lichvannien, bao, sach Hoa) qua tom tat tim kiem — agent khong mo
// duoc trang goc (tra 21/10, QUY_UOC muc 19). Rieng Khong Minh co 9 anh anh chup.
const khop = <T>(ca: readonly (readonly [string, T])[], may: (d: NgayDuong) => T): string[] =>
  ca.filter(([s, t]) => may(ngay(s)) !== t).map(([s, t]) => `${s}: nguon ${String(t)} / may ${String(may(ngay(s)))}`);

describe('xuat hanh', () => {
  const km = (d: NgayDuong): string => khongMinh(duongSangAm(d)).ten;
  test('ngay Khong Minh khop 9 anh lich anh chup (du ba nhom thang)', () => {
    expect(khop(mau.ca.map((c) => [c.duong, c.xuatHanh] as const), km)).toEqual([]);
  });

  test('Khong Minh: nhom 3-6-9-12 mung 1 la Chu Tuoc, ngay 30 thang 2-5-8-11 la Thien Thuong, thang nhuan giu so thang', () => {
    expect(khop([
      ['2025-12-21', 'Thiên Môn'], ['2025-12-23', 'Thiên Tài'], ['2025-12-26', 'Thiên Hầu'], ['2026-01-01', 'Thiên Tặc'],
      ['2026-01-12', 'Thiên Thương'], ['2026-01-14', 'Thiên Môn'], ['2026-01-18', 'Thiên Thương'], // 30/11 (xemlicham, lichvannien)
      ['2026-01-21', 'Bạch Hổ Kiếp'], ['2026-10-26', 'Chu Tước'], ['2026-05-16', 'Thanh Long Đầu'], // 30/3 (xemngay, lichvannien)
      ['2025-07-25', 'Chu Tước'], ['2025-08-13', 'Bạch Hổ Túc'], ['2025-08-01', 'Thanh Long Túc'], ['2025-08-09', 'Thanh Long Túc'], // thang 6 nhuan
    ], km)).toEqual([]);
  });

  test('gio Ly Thuan Phong: theo sach (vietnamnet, lichngaytot, lichvannien) va tuy chon xemlicham', () => {
    const ltp = (phai: 'sach' | 'xemlicham', gio: number) => (d: NgayDuong): string => gioLyThuanPhong(duongSangAm(d), phai)[gio]?.ten ?? '';
    expect(khop([['2025-01-29', 'Đại An'], ['2026-10-13', 'Tuyệt Lộ'], ['2026-10-20', 'Đại An'], ['2026-09-20', 'Tiểu Cát'],
      ['2026-10-29', 'Xích Khẩu'], ['2026-10-14', 'Đại An'], ['2026-10-30', 'Tiểu Cát'], ['2026-07-16', 'Tốc Hỷ'],
      ['2025-07-25', 'Tuyệt Lộ'], ['2025-07-26', 'Đại An'], ['2026-10-21', 'Tốc Hỷ']], ltp('sach', 0))).toEqual([]);
    expect(khop([['2025-01-29', 'Tốc Hỷ'], ['2026-10-13', 'Đại An']], ltp('sach', 1))).toEqual([]);
    expect(khop([['2026-10-13', 'Lưu Niên']], ltp('sach', 3))).toEqual([]);
    expect(khop([['2025-01-29', 'Tiểu Cát']], ltp('sach', 4))).toEqual([]);
    expect(khop([['2025-07-26', 'Tuyệt Lộ']], ltp('sach', 5))).toEqual([]);
    expect(khop([['2026-10-13', 'Đại An'], ['2026-10-14', 'Lưu Niên'], ['2026-10-20', 'Lưu Niên'], ['2026-02-17', 'Lưu Niên'],
      ['2026-01-14', 'Đại An'], ['2026-10-21', 'Tốc Hỷ'], ['2026-01-21', 'Tốc Hỷ']], ltp('xemlicham', 0))).toEqual([]);
    // sach: (16 + 2 + 5 − 3) chia 6 du 2 = Luu Nien; (21 + 4 + 5 − 3) du 3 = Xich Khau (xemvm, osshcmup)
    expect(gioLyThuanPhong({ nam: 2026, thang: 2, ngay: 16, nhuan: false })[4]?.ten).toBe('Lưu Niên');
    expect(gioLyThuanPhong({ nam: 2026, thang: 4, ngay: 21, nhuan: false })[4]?.ten).toBe('Xích Khẩu');
  });

  test('tai than theo sach Viet (lichngaytot, lichvannien), hy than khop hoang lich', () => {
    const n = (d: NgayDuong): string => { const x = xemNgay(d); return `${x.thanTai}/${x.hyThan}`; };
    expect(khop([['2026-01-05', 'Chính Nam/Đông Bắc'], ['2026-01-14', 'Chính Bắc/Đông Nam'], ['2026-10-13', 'Tây Nam/Tây Bắc'],
      ['2026-10-14', 'Tây Nam/Tây Nam'], ['2026-10-15', 'Chính Tây/Chính Nam'], ['2026-10-16', 'Tây Bắc/Đông Nam'],
      ['2025-07-25', 'Đông Nam/Tây Bắc'], ['2026-10-27', 'Đông Nam/Đông Bắc'], ['2026-01-12', 'Chính Đông/Tây Nam'],
      ['2026-01-23', 'Chính Đông/Chính Nam']], n)).toEqual([]);
  });
});

describe('ngay xau theo thang am', () => {
  const co = (ten: string) => (d: NgayDuong): boolean => { const n = xemNgay(d); return ngayXauThang(n.am, n.chiNgay).some((l) => l.chu.startsWith(ten)); };
  test('Sat Chu Am: thang 7 Suu, thang 8 Hoi (xemlicham, lichngaytot, lichvannien theo ngay)', () => {
    expect(khop([['2026-01-04', true], ['2025-12-23', true], ['2026-03-27', true], ['2026-12-01', true], ['2024-08-17', true],
      ['2026-08-19', true], ['2026-08-31', true], ['2026-09-22', true], ['2026-10-04', true], ['2026-08-17', false]], co('Sát Chủ Âm'))).toEqual([]);
  });
  test('Sat Chu Duong (xemlicham)', () => {
    expect(khop([['2026-03-03', true], ['2026-03-28', true], ['2026-05-24', true], ['2026-10-09', true], ['2026-01-09', true],
      ['2024-01-29', true]], co('Sát Chủ Dương'))).toEqual([]);
  });
  test('Tho Tu theo chi ngay (xemlicham, lichvannien), ke ca ngay khong trung can chi cua bai viet', () => {
    expect(khop([['2026-01-05', true], ['2026-01-17', true], ['2026-02-04', true], ['2026-02-17', true], ['2026-05-13', true],
      ['2025-05-31', true], ['2026-07-13', true], ['2026-08-19', true], ['2026-08-31', true], ['2026-09-18', true],
      ['2026-10-31', true]], co('Thọ Tử'))).toEqual([]);
  });
  test('Duong Cong Ky: 13 ngay 2026 (sina, sohu), thang 7 mung 1 va 29, thang nhuan dung bang thang cung so (xemlicham)', () => {
    const NAM_2026 = ['2026-03-01', '2026-03-29', '2026-04-25', '2026-05-23', '2026-06-19', '2026-07-16', '2026-08-13',
      '2026-09-10', '2026-10-07', '2026-11-03', '2026-12-01', '2026-12-29', '2027-01-26'];
    expect(khop([...NAM_2026, '2025-02-10', '2025-04-06', '2025-05-31', '2025-07-27', '2025-11-14', '2025-12-12', '2026-01-09']
      .map((s) => [s, true] as const), co('Dương Công'))).toEqual([]);
    expect(co('Dương Công')(ngay('2026-08-20'))).toBe(false); // 8/7: lichngaytot ghi, xemlicham khong
    let dem = 0;
    for (let jd = soNgay(ngay('2026-02-17')); jd < soNgay(ngay('2027-02-06')); jd++) if (co('Dương Công')(tuSoNgay(jd))) dem++;
    expect(dem).toBe(13);
  });
});

describe('cham ngay', () => {
  const VIECS = Object.keys(VIEC) as Viec[];
  test('Tranh khi co ly do tranh; Tot khi Hoang Dao, lich ghi nen va khong ly do xau; con lai Duoc', () => {
    for (const v of VIECS) {
      for (const d of chonNgay(v, 2026, 11, 3)) {
        const loai = new Set(d.lyDo.map((l) => l.loai));
        expect(d.danhGia).toBe(loai.has('tranh') ? 'tranh' : loai.has('xau') ? 'duoc' : 'tot');
        if (d.danhGia === 'tot') expect(d.lyDo.some((l) => l.chu.startsWith('Hoàng Đạo'))).toBe(true);
        if (d.danhGia === 'tot') expect(d.lyDo.some((l) => l.chu.startsWith('Lịch ghi nên'))).toBe(true);
      }
    }
  });

  test('du ngay trong thang, ke ca thang 2 nam nhuan', () => {
    expect(chonNgay('cuoiHoi', 2028, 2).length).toBe(29);
    expect(chonNgay('cuoiHoi', 2026, 12).map((d) => d.duong.ngay).at(-1)).toBe(31);
  });

  test('ngay xung tuoi la Tranh; bo nam sinh thi khong xet tuoi', () => {
    const d = ngay('2026-10-02'); // Ky Dau, xung tuoi Mao
    expect(chamNgay(d, 'muaXe', 3).lyDo).toContainEqual({ loai: 'tranh', chu: 'Ngày Dậu xung tuổi Mão' });
    expect(chamNgay(d, 'muaXe').lyDo.some((l) => l.chu.includes('tuổi'))).toBe(false);
  });

  test('chi xuat hanh co Khong Minh, gio Ly Thuan Phong, huong', () => {
    const d = ngay('2026-11-14');
    expect(chamNgay(d, 'cuoiHoi').xuatHanh).toBeUndefined();
    expect(chamNgay(d, 'xuatHanh').xuatHanh).toMatchObject({ khongMinh: { ten: 'Hảo Thương' }, hyThan: 'Chính Nam', taiThan: 'Chính Tây' });
    expect(chamNgay(d, 'xuatHanh').xuatHanh?.gio.length).toBe(12);
  });
});

describe('canh bao nam', () => {
  test('Kim Lau, Hoang Oc, Tam Tai chi bao cho viec co xet; thang giao Tet ra hai nam am', () => {
    // 1987 Dinh Mao: Tam Tai Ty, Ngo, Mui -> 2026 Ngo nam thu 2, 2027 Mui nam thu 3
    expect(canhBaoNam('muaXe', 1987, 2026, 11)).toEqual([]);
    expect(canhBaoNam('xuatHanh', 1987, 2026, 11)).toEqual([]);
    expect(canhBaoNam('khaiTruong', 1987, 2026, 11).map((c) => `${String(c.namAm)} ${c.ten} ${c.muc.ten}`)).toEqual(['2026 Tam Tai Năm thứ 2/3']);
    expect(canhBaoNam('cuoiHoi', 1987, 2027, 2).map((c) => `${String(c.namAm)} ${c.ten}`)).toEqual(['2026 Tam Tai', '2027 Tam Tai']);
    // 1990 Canh Ngo: 2026 tuoi mu 37, chia 9 du 1 -> Kim Lau Than; (3 + 7) chia 6 du 4 -> Tu Tan Tai (khong pham)
    expect(canhBaoNam('dongTho', 1990, 2026, 6).map((c) => c.ten)).toEqual(['Kim Lâu']);
  });
});
