/**
 * Chon ngay theo viec (`src/loi/chonNgay.ts`): Khong Minh so 9 anh lich anh chup (`scripts/doi-chieu/mau-lich.json`),
 * ca mau tung bang ngay xau, gio Ly Thuan Phong, luat cham Tot/Duoc/Tranh, canh bao nam.
 */
import mau from '../scripts/doi-chieu/mau-lich.json';
import { duongSangAm, soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { canhBaoNam, chamNgay, chonNgay, khongMinh, ngayXauThang, VIEC, type Viec } from '../src/loi/chonNgay.ts';
import { xemNgay } from '../src/loi/homNay.ts';

const ngay = (s: string): NgayDuong => {
  const [nam = 0, thang = 0, d = 0] = s.split('-').map(Number);
  return { nam, thang, ngay: d };
};

describe('xuat hanh', () => {
  test('ngay Khong Minh khop 9 anh lich anh chup (du ba nhom thang)', () => {
    const lech = mau.ca.filter((c) => khongMinh(duongSangAm(ngay(c.duong))).ten !== c.xuatHanh)
      .map((c) => `${c.duong}: anh ${c.xuatHanh} / may ${khongMinh(duongSangAm(ngay(c.duong))).ten}`);
    expect(lech).toEqual([]);
  });
});

describe('ngay xau theo thang am', () => {
  test('Duong Cong Ky: 13 ngay moi nam am', () => {
    let dem = 0;
    for (let jd = soNgay(ngay('2026-02-17')); jd < soNgay(ngay('2027-02-06')); jd++) {
      const d = tuSoNgay(jd);
      const n = xemNgay(d);
      if (!n.am.nhuan && ngayXauThang(n.am, n.canChiNgay, n.chiNgay).includes('Dương Công Kỵ')) dem++;
    }
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
    expect(chamNgay(d, 'xuatHanh').xuatHanh).toMatchObject({ khongMinh: { ten: 'Hảo Thương' }, hyThan: 'Chính Nam', taiThan: 'Chính Nam' });
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
