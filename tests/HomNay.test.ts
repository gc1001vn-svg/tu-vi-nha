/**
 * Man "Hom nay" (`src/loi/homNay.ts`): khop 5 anh lich anh chup (`scripts/doi-chieu/mau-lich.json`), khop thu vien
 * `lunar-typescript` o truc/than truc nhat moi ngay tru ngay tiet roi 23:00–24:00 gio VN (thu vien tinh +8), theo tuoi.
 */
import { Lunar, LunarUtil, Solar } from 'lunar-typescript';
import mau from '../scripts/doi-chieu/mau-lich.json';
import { soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { hv } from '../src/loi/hanViet/index.ts';
import { theoTuoi, xemNgay } from '../src/loi/homNay.ts';

const ngay = (s: string): NgayDuong => {
  const [nam = 0, thang = 0, d = 0] = s.split('-').map(Number);
  return { nam, thang, ngay: d };
};
const ymd = (d: NgayDuong): string => `${String(d.nam)}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;

describe('xemNgay', () => {
  test('5 anh lich anh chup: am, can chi ngay, can chi thang, tiet, gio hoang dao (25 o)', () => {
    const lech = mau.ca.flatMap((c) => {
      const x = xemNgay(ngay(c.duong));
      const may = {
        am: `${String(x.am.ngay)}/${String(x.am.thang)}${x.am.nhuan ? 'n' : ''}/${String(x.am.nam)}`,
        ngay: x.canChiNgay, thang: x.canChiThang, tiet: x.tiet, gioHoangDao: x.gioHoangDao.map((g) => g.chi).join(' '),
      };
      return (Object.keys(may) as (keyof typeof may)[]).filter((k) => may[k] !== c[k]).map((k) => `${c.duong} ${k}: anh ${c[k]} / may ${may[k]}`);
    });
    expect(lech).toEqual([]);
  });

  test('19/10/2026', () => {
    expect(xemNgay(ngay('2026-10-19'))).toMatchObject({
      thu: 1, am: { nam: 2026, thang: 9, ngay: 10, nhuan: false }, canChiNam: 'Bính Ngọ', canChiThang: 'Mậu Tuất',
      canChiNgay: 'Bính Dần', tiet: 'Hàn Lộ', truc: 'Định', thienThan: 'Tư Mệnh', hoangDao: true,
      thanTai: 'Tây Nam', napAmNgay: 'Lư Trung Hỏa', hanhNgay: 'Hỏa', chiNgay: 2,
    });
    expect(xemNgay(ngay('2026-10-19')).gioHoangDao[0]).toEqual({ chi: 'Tý', khoang: '23–01' });
  });

  test('tuy chon thang am cho truc, hoang dao (ngay thu o QUY_UOC muc 2)', () => {
    expect(xemNgay(ngay('2026-02-10'))).toMatchObject({ truc: 'Trừ', hoangDao: false });
    expect(xemNgay(ngay('2026-02-10'), 'am')).toMatchObject({ truc: 'Mãn', hoangDao: true });
    expect(xemNgay(ngay('2026-03-10')).truc).toBe('Định');
    expect(xemNgay(ngay('2026-03-10'), 'am').truc).toBe('Chấp');
  });

  // Ngay VN D ma tiet (12 "tiet", khong tinh 12 trung khi) roi 00:00–00:59 gio Bac Kinh ngay D+1 = 23:xx gio VN ngay D.
  const JIE = new Set(['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒']);
  const moc = new Map<string, NgayDuong>(); // ngay Bac Kinh co tiet -> ngay do
  const ngoaiLe = new Set<string>();
  for (let nam = 1899; nam <= 2101; nam++) {
    for (const [ten, s] of Object.entries(Lunar.fromYmd(nam, 6, 1).getJieQiTable())) {
      if (!JIE.has(ten)) continue;
      const d = { nam: s.getYear(), thang: s.getMonth(), ngay: s.getDay() };
      moc.set(ymd(d), d);
      if (s.getHour() === 0) ngoaiLe.add(ymd(tuSoNgay(soNgay(d) - 1)));
    }
  }

  test('so thu vien 1900–2100: truc, than truc nhat khop moi ngay tru ngay tiet roi 23:xx gio VN', () => {
    // 0,85 ms/ngay (do 19/10) -> ca 73.383 ngay ~60 giay: lay 1 ngay moi 29 ngay (29, 12 nguyen to cung nhau nen
    // du moi cap chi ngay/chi thang) va moi ngay sat tiet — do 19/10: 9.579 ngay, 102 ngay ngoai le, ~14 giay.
    const [dau, cuoi] = [soNgay(ngay('1900-02-01')), soNgay(ngay('2100-12-31'))];
    const chon = new Set<number>();
    for (let jd = dau; jd <= cuoi; jd += 29) chon.add(jd);
    for (const d of moc.values()) for (const k of [-1, 0, 1]) chon.add(soNgay(d) + k);
    const lech: string[] = [];
    let soNgoaiLe = 0;
    for (const jd of chon) {
      if (jd < dau || jd > cuoi) continue;
      const d = tuSoNgay(jd);
      const x = xemNgay(d);
      const l = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
      const khop = x.truc === hv('truc', l.getZhiXing()) && x.thienThan === hv('thienThan', l.getDayTianShen());
      if (ngoaiLe.has(ymd(d))) {
        soNgoaiLe++;
        if (khop) lech.push(`${ymd(d)} la ngay ngoai le ma van khop thu vien`);
      } else if (!khop) lech.push(`${ymd(d)}: may ${x.truc}/${x.thienThan}, thu vien ${l.getZhiXing()}/${l.getDayTianShen()}`);
    }
    expect(lech).toEqual([]);
    expect(soNgoaiLe).toBe(ngoaiLe.size - [...ngoaiLe].filter((s) => s < '1900-02-01' || s > '2100-12-31').length);
    expect(soNgoaiLe).toBeGreaterThan(0);
  }, 60_000);

  test('ngay tiet roi 23:xx gio VN da sang thang moi (thang cua ngay hom sau theo thu vien)', () => {
    const s = [...ngoaiLe].find((x) => x >= '2000-01-01') ?? '';
    const d = ngay(s);
    const mai = tuSoNgay(soNgay(d) + 1);
    const lMai = Solar.fromYmd(mai.nam, mai.thang, mai.ngay).getLunar();
    const chiNgay = (soNgay(d) + 1) % 12;
    expect(xemNgay(d).truc).toBe(hv('truc', LunarUtil.ZHI_XING[(chiNgay - lMai.getMonthZhiIndex() + 12) % 12 + 1] ?? ''));
  });
});

describe('theoTuoi', () => {
  const dan = xemNgay(ngay('2026-10-19')); // Binh Dan, Lu Trung Hoa
  const ty = xemNgay(ngay('1987-07-26')); // Binh Ty

  test('xung, luc hop, tam hop, binh', () => {
    expect(theoTuoi(dan, 8, 'Kim')).toMatchObject({ quanHe: 'xung', loai: 'lục xung' }); // Dan - Than
    expect(theoTuoi(ty, 1, 'Kim')).toMatchObject({ quanHe: 'hop', loai: 'lục hợp' }); // Ty - Suu
    expect(theoTuoi(ty, 8, 'Kim')).toMatchObject({ quanHe: 'hop', loai: 'tam hợp' }); // Ty - Than
    expect(theoTuoi(dan, 6, 'Kim')).toMatchObject({ quanHe: 'hop', loai: 'tam hợp' }); // Dan - Ngo
    expect(theoTuoi(dan, 2, 'Kim')).toMatchObject({ quanHe: 'binh', loai: '' });
  });

  test('ngu hanh ngay (Hoa) so voi menh', () => {
    expect(['Thổ', 'Kim', 'Mộc', 'Thủy', 'Hỏa'].map((m) => theoTuoi(dan, 0, m).nguHanh))
      .toEqual(['sinh', 'khac', 'duocSinh', 'biKhac', 'hoa']);
    expect(() => theoTuoi(dan, 0, 'Gió')).toThrow();
  });

  test('mau, so hop menh', () => {
    const kim = theoTuoi(dan, 0, 'Kim');
    expect(kim.soHop).toEqual([2, 5, 6, 7, 8]);
    expect(kim.mauHop).toEqual(expect.arrayContaining(['vàng', 'trắng']));
    expect(kim.mauKy).toContain('đỏ');
    expect(theoTuoi(dan, 0, 'Mộc').soHop).toEqual([0, 1, 3, 4]);
  });
});
