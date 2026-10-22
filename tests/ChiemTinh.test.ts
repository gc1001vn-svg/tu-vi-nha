/**
 * Chiem tinh (`src/loi/chiemTinh.ts`): 300 ca Swiss Ephemeris (`tests/vang/chiem-tinh-swe.json`, sinh bang
 * `scripts/doi-chieu/chiem-tinh-swe.py`), luoi Placidus, toa do noi sinh, ca dung tay (da so pyswisseph 22/10), va hai
 * doi chieu ngoai: ngay soc trung mung 1 am lich HND, Mat Troi qua 0/90/180/270° nam 2026 theo trang lich (QUY_UOC muc 23).
 * Ngay sinh trong file nay deu la ngay GIA (luat 1 CLAUDE.md).
 */
import { MakeTime, SearchMoonPhase } from 'astronomy-engine';
import vang from './vang/chiem-tinh-swe.json';
import { duongSangAm, soNgay, tuSoNgay } from '../src/loi/amLich.ts';
import {
  DIEM, GOC, chuan, cungCua, dinhDang, gocChieu, laSo, laSoNguoi, nhaCua, placidus, type LaSo,
} from '../src/loi/chiemTinh.ts';
import { CUNG_MOC, HANH_TINH, MAT_TRANG, MAT_TROI, NHA, TU_KHOA, Y_GOC } from '../src/loi/chiemTinhGiai.ts';
import { dan } from '../src/giaoDien/khoi/chiemTinhVe.ts';
import type { HoSo } from '../src/loi/hoSo.ts';
import { NUOC_NGOAI, TINH } from '../src/loi/tinh.ts';
import { TOA_DO } from '../src/loi/toaDo.ts';

const HAI_PHUT = 2 / 60;
const sai = (may: number | null | undefined, swe: number): number =>
  may === null || may === undefined ? Infinity : Math.abs(((may - swe + 540) % 360) - 180);
const hs = (o: Partial<HoSo>): HoSo =>
  ({ id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: '06:14', noiSinh: 'Hà Nội', ...o });

describe('chiem tinh: 300 ca Swiss Ephemeris', () => {
  const ca = vang.ca.map((c) => {
    const phut = (c.jd + 0.5) * 1440, td = [c.viDo, c.kinhDo] as const;
    return { c, ls: laSo(phut, td), th: laSo(phut, td, 'that') };
  });

  test('moi diem lech <= 2′: 10 thien the, nut that va trung binh, cung Moc, Thien Dinh, 12 dinh nha', () => {
    const lon: string[] = [];
    for (const { c, ls, th } of ca) {
      const cap: [string, number | null | undefined, number][] = [
        ...c.kinh.map((k, i): [string, number | undefined, number] => [`diem ${String(i)}`, ls.diem[i]?.kinh, k]),
        ['nut trung binh (mac dinh)', ls.diem[10]?.kinh, c.nutTB], ['nut that', th.diem[10]?.kinh, c.nutThat],
        ['cung Moc', ls.moc, c.moc], ['Thien Dinh', ls.dinh, c.dinh],
        ...c.nha.map((k, i): [string, number | undefined, number] => [`nha ${String(i + 1)}`, ls.nha?.[i], k]),
      ];
      for (const [ten, may, swe] of cap) {
        if (sai(may, swe) > HAI_PHUT) lon.push(`jd ${String(c.jd)} ${ten}: may ${String(may)} / swe ${String(swe)}`);
      }
    }
    expect(lon).toEqual([]);
  });

  test('cung, nha, nghich hanh khop (bo diem cach ranh duoi 2′ va hanh tinh dang dung)', () => {
    const lech: string[] = [];
    let boQua = 0, tong = 0;
    for (const { c, ls } of ca) {
      tong += c.kinh.length + c.toc.length;
      c.kinh.forEach((k, i) => {
        const may = ls.diem[i]?.kinh ?? Number.NaN;
        if (Math.min(k % 30, 30 - (k % 30)) < HAI_PHUT || c.nha.some((n) => sai(n, k) < HAI_PHUT)) { boQua++; return; }
        if (cungCua(may) !== cungCua(k)) lech.push(`cung diem ${String(i)}, jd ${String(c.jd)}`);
        if (nhaCua(may, ls.nha ?? []) !== nhaCua(k, c.nha)) lech.push(`nha diem ${String(i)}, jd ${String(c.jd)}`);
      });
      c.toc.forEach((v, j) => {
        if (Math.abs(v) < 1e-3) { boQua++; return; }
        if ((ls.diem[j + 2]?.nghich ?? false) !== v < 0) lech.push(`nghich diem ${String(j + 2)}, jd ${String(c.jd)}`);
      });
    }
    expect(lech).toEqual([]);
    // Bo qua chi duoc la ca hiem: diem cach ranh cung/dinh nha duoi 2′ (~0,4 %), hanh tinh dang dung (do 22/10: 31/5.400).
    expect(boQua / tong).toBeLessThan(0.01);
  });
});

describe('chiem tinh: Placidus, toa do, goc chieu, cach ghi', () => {
  test('Placidus: vi do 8–24° × RAMC moi 1° deu hoi tu, 12 dinh noi tiep (moi khoang 0–180°)', () => {
    const hong: string[] = [];
    for (let viDo = 8; viDo <= 24; viDo++) {
      for (let ramc = 0; ramc < 360; ramc++) {
        const { nha } = placidus(ramc, 23.44, viDo);
        nha.forEach((n, i) => {
          const g = chuan((nha[(i + 1) % 12] ?? 0) - n);
          if (!(g > 0 && g < 180)) hong.push(`vi do ${String(viDo)}, RAMC ${String(ramc)}, nha ${String(i + 1)}`);
        });
      }
    }
    expect(hong).toEqual([]);
  });

  test('toa do: du 64 noi sinh cua o chon, trong hop Viet Nam', () => {
    expect(Object.keys(TOA_DO).sort()).toEqual(TINH.map(([t]) => t).sort());
    for (const [viDo, kinhDo] of Object.values(TOA_DO)) {
      expect(viDo > 8.4 && viDo < 23.4 && kinhDo > 102.1 && kinhDo < 109.5).toBe(true);
    }
  });

  test('goc chieu: dung orb (8°, luc hop 6°), bo Bac Giao Diem va cap cung Moc – Thien Dinh, chat nhat truoc', () => {
    // Diem 5..9 dat chung 300° chi de du 10 thien the; chi xet cap trong nhom 0..4, cung Moc (11), Thien Dinh (12).
    const kinh = [0, 59, 97.5, 127, 186, 300, 300, 300, 300, 300, 0.5];
    const ls: LaSo = { diem: kinh.map((k) => ({ kinh: k, nghich: false })), moc: 90, dinh: 0, nha: null };
    const nhom = (i: number): boolean => i < 5 || i > 10;
    const gc = gocChieu(ls);
    expect(gc.some((g) => g.a === 10 || g.b === 10 || (g.a === 11 && g.b === 12))).toBe(false);
    expect(gc.filter((g) => nhom(g.a) && nhom(g.b)).map((g) => `${String(g.a)}-${String(g.b)} ${String(g.goc)} ${g.orb.toFixed(1)}`))
      .toEqual(['0-11 2 0.0', '0-12 0 0.0', '0-1 1 1.0', '1-12 1 1.0', '3-4 1 1.0', '2-4 2 1.5', '0-4 4 6.0', '4-11 2 6.0',
        '4-12 4 6.0', '0-3 3 7.0', '1-4 3 7.0', '3-12 3 7.0', '0-2 2 7.5', '2-11 0 7.5', '2-12 2 7.5']);
  });

  test('loi giai du: 12 cung cho Mat Troi, Mat Trang, cung Moc, 8 hanh tinh; tu khoa moi diem, 12 nha, 5 goc', () => {
    for (const ds of [MAT_TROI, MAT_TRANG, CUNG_MOC, ...[2, 3, 4, 5, 6, 7, 8, 9].map((i) => HANH_TINH[i] ?? [])]) expect(ds).toHaveLength(12);
    expect([TU_KHOA.length, NHA.length, Y_GOC.length]).toEqual([DIEM.length, 12, GOC.length]);
    expect([...MAT_TROI, ...MAT_TRANG, ...CUNG_MOC].filter((d) => d.length < 80)).toEqual([]);
    expect(new Set(Object.values(HANH_TINH).flat()).size).toBe(96);
  });

  test('banh xe: ky hieu sat nhau duoc dan cach >= 11°, giu thu tu, qua ca ranh 0°', () => {
    // Ca that 15/06/1985: Mat Troi 84,3°, Thuy 93,9°, Hoa 94,0° (Thuy, Hoa tung de nhau); them cum quanh 0°.
    for (const goc of [[84.3, 93.9, 94.0, 300], [358, 359, 1, 2, 180], [10, 10, 10, 10]]) {
      const ra = dan(goc, 11), xep = goc.map((g, i) => [g, ra[i] ?? 0] as const).sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
      const khe = xep.map(([, h], i) => chuan((xep[(i + 1) % xep.length]?.[1] ?? 0) - h));
      expect(Math.min(...khe)).toBeGreaterThanOrEqual(11 - 1e-6);
      expect(khe.reduce((a, b) => a + b, 0)).toBeCloseTo(360, 6); // tong khe 360° = khong diem nao vuot hang xom
    }
  });

  test('cach ghi: cat phan le, khong lam tron len 60′', () => {
    expect(dinhDang(62.2362)).toBe('Song Tử 2°14′');
    expect(dinhDang(359.9999)).toBe('Song Ngư 29°59′');
    expect(dinhDang(-0.5)).toBe('Song Ngư 29°30′');
    expect(dinhDang(0)).toBe('Bạch Dương 0°00′');
  });
});

describe('chiem tinh: la so mot nguoi (ca da so pyswisseph)', () => {
  test('cung Moc sat ranh: 10/05/1990 06:14 Ha Noi la Song Tu 2°14′, sinh som 15 phut thi Kim Nguu', () => {
    const r = laSoNguoi(hs({}));
    expect(dinhDang(r.laSo.moc ?? Number.NaN)).toBe('Song Tử 2°14′');
    expect(r.phuongAn).toEqual([{ lyDo: 'Nếu sinh sớm hơn 15 phút', khac: 'cung Mọc Kim Ngưu' }]);
    expect(r.noi).toEqual({ ten: 'Hà Nội', viDo: 21.02, kinhDo: 105.84 });
    expect(r.laSo.nha).toHaveLength(12);
  });

  test('mui gio chua chac 1947–1954: tinh them gio +7, cung Moc doi thi hien', () => {
    const r = laSoNguoi(hs({ ngaySinh: '1950-06-15', gioSinh: '06:00' }));
    expect(cungCua(r.laSo.moc ?? Number.NaN)).toBe(2);
    expect(r.phuongAn).toContainEqual({ lyDo: 'Nếu lúc đó là giờ UTC+7', khac: 'cung Mọc Cự Giải' });
    expect(r.ghiChu.join(' ')).toContain('chưa chắc');
  });

  test('khong ro gio: bo cung Moc, nha; ghi diem doi cung trong ngay (03/01/2000 Mat Trang)', () => {
    const r = laSoNguoi(hs({ ngaySinh: '2000-01-03', gioSinh: null }));
    expect([r.laSo.moc, r.laSo.nha, r.noi]).toEqual([null, null, null]);
    expect(r.ghiChu).toEqual(['Không rõ giờ sinh: tính lúc 12 giờ trưa, bỏ cung Mọc và nhà.',
      'Trong ngày sinh có đổi cung: Mặt Trăng từ Thiên Yết sang Nhân Mã.']);
  });

  test('sinh nuoc ngoai: co hanh tinh, bo cung Moc va nha', () => {
    const r = laSoNguoi(hs({ noiSinh: NUOC_NGOAI, muiGio: 'Europe/Paris' }), 120);
    expect([r.laSo.moc, r.noi]).toEqual([null, null]);
    expect(r.laSo.diem).toHaveLength(11);
    expect(r.ghiChu[0]).toContain('nước ngoài');
    expect(() => laSoNguoi(hs({ noiSinh: NUOC_NGOAI }))).toThrow('thiếu múi giờ');
  });
});

describe('chiem tinh: doi chieu ngoai', () => {
  test('2.484 lan soc 1900–2100 (gio +7) roi vao mung 1 am lich HND, tru ca cach nua dem duoi 1 phut', () => {
    let t = MakeTime(new Date(Date.UTC(1900, 1, 1))), dem = 0;
    const lech: string[] = [];
    while (t.ut < MakeTime(new Date(Date.UTC(2100, 11, 1))).ut) {
      const soc = SearchMoonPhase(0, t, 40);
      if (soc === null) throw new Error('không thấy sóc');
      const phut7 = (soc.ut + 2451545 + 0.5) * 1440 + 420, ngay = Math.floor(phut7 / 1440), le = phut7 - ngay * 1440;
      if (duongSangAm(tuSoNgay(ngay)).ngay !== 1 && Math.min(le, 1440 - le) >= 1) lech.push(soc.date.toISOString());
      dem++;
      t = soc.AddDays(20);
    }
    expect(dem).toBe(2484);
    expect(lech).toEqual([]);
  });

  test('Mat Troi qua 0°, 90°, 180°, 270° nam 2026 dung gio trang lich (±5 phut)', () => {
    // universaltimedate, farmersalmanac, icalendars, starwalk (tra 22/10/2026), gio UTC.
    const MOC: [number, number, number, number, number][] = [[3, 20, 14, 46, 0], [6, 21, 8, 24, 90], [9, 23, 0, 5, 180], [12, 21, 20, 50, 270]];
    for (const [thang, ngay, gio, phut, doMoc] of MOC) {
      const p = soNgay({ nam: 2026, thang, ngay }) * 1440 + gio * 60 + phut;
      const ky = (dp: number): number => ((laSo(p + dp, null).diem[0]?.kinh ?? 0) - doMoc + 540) % 360 - 180;
      expect([ky(-5) < 0, ky(5) > 0]).toEqual([true, true]);
    }
  });
});
