/**
 * Phi tinh (`src/loi/phiTinh.ts`, QUY_UOC muc 22): sao giua nam, thang so voi cong thuc tay (khong qua thu vien) moi nam
 * 1901–2099; ban giua Ngu Hoang la ma phuong Lac Thu; ban 2026 so trang Hong Kong; huong ky nam so quy tac + thu vien.
 */
import { Solar } from 'lunar-typescript';
import { ban, DUONG_BAY, huongKy, phiTinh, type O } from '../src/loi/phiTinh.ts';

const vong = (x: number): number => (((x - 1) % 9) + 9) % 9 + 1;
// Nam theo Lap Xuan Y: 2026 → 1, 2025 → 2, 2024 → 3 … (lui moi nam, chu ky 9) — cung dang cong thuc cung phi nam.
const giuaNam = (y: number): number => vong(11 - (y % 9));
// Thang Dan (k = 1): nam Ty Ngo Mao Dau khoi 8, Thin Tuat Suu Mui khoi 5, Dan Than Ty Hoi khoi 2; moi thang lui 1.
const giuaThang = (y: number, k: number): number => {
  const chi = (y + 8) % 12;
  const khoi = [0, 6, 3, 9].includes(chi) ? 8 : [4, 10, 1, 7].includes(chi) ? 5 : 2;
  return vong(khoi - (k - 1));
};
// Nam tren nhu sach (Wikibooks, masterseanchan): hang tren Dong Nam, Nam, Tay Nam.
const LUOI: readonly (readonly O[])[] = [['Đông Nam', 'Nam', 'Tây Nam'], ['Đông', 'Giữa', 'Tây'], ['Đông Bắc', 'Bắc', 'Tây Bắc']];

describe('phi tinh', () => {
  test('sao giua nam: sau Lap Xuan theo nam do, truoc Lap Xuan theo nam truoc — 1901–2099', () => {
    for (let y = 1901; y <= 2099; y++) {
      expect(phiTinh({ nam: y, thang: 3, ngay: 1 }).nam.giua, String(y)).toBe(giuaNam(y));
      expect(phiTinh({ nam: y, thang: 1, ngay: 20 }).nam.giua, `${String(y)} truoc Lap Xuan`).toBe(giuaNam(y - 1));
    }
  });

  test('sao giua thang (ngay 20 luon nam giua thang tiet) — 1901–2099', () => {
    for (let y = 1901; y <= 2099; y++) {
      for (let m = 1; m <= 12; m++) {
        const [ly, k] = m === 1 ? [y - 1, 12] : [y, m - 1]; // 20/1 la thang Suu cua nam Lap Xuan truoc
        expect(phiTinh({ nam: y, thang: m, ngay: 20 }).thang.giua, `${String(y)}-${String(m)}`).toBe(giuaThang(ly, k));
      }
    }
  });

  test('giua Ngu Hoang: luoi Nam tren la ma phuong Lac Thu 4 9 2 / 3 5 7 / 8 1 6', () => {
    const b = ban(5);
    expect(LUOI.map((h) => h.map((x) => b.o[x].so))).toEqual([[4, 9, 2], [3, 5, 7], [8, 1, 6]]);
    for (let g = 1; g <= 9; g++) expect(new Set(DUONG_BAY.map((h) => ban(g).o[h].so)).size).toBe(9);
  });

  test('ban nam 2026 (hk01 To Dan Phong, sina): Nhat Bach giua, Ngu Hoang Nam, Nhi Hac Tay Bac, Cuu Tu Dong Nam, Luc Bach Bac', () => {
    const p = phiTinh({ nam: 2026, thang: 10, ngay: 21 });
    expect(p.canChiNam).toBe('Bính Ngọ');
    expect([p.nam.o['Giữa'], p.nam.o['Nam'], p.nam.o['Tây Bắc'], p.nam.o['Đông Nam'], p.nam.o['Bắc']].map((s) => s.ten))
      .toEqual(['Nhất Bạch', 'Ngũ Hoàng', 'Nhị Hắc', 'Cửu Tử', 'Lục Bạch']);
    expect(p.nam.o['Giữa']).toMatchObject({ tenHuyenKhong: 'Tham Lang', tot: true });
    expect(p.nam.o['Nam'].tot).toBe(false);
    expect(p.tiet).toEqual({ ten: 'Hàn Lộ', ngay: { nam: 2026, thang: 10, ngay: 8 } });
  });

  test('huong ky 2026: Thai Tue Ngo (Nam), Tue Pha Ty, Tam Sat Hoi Ty Suu (Bac — CLSA qua Sing Tao), Ngu Hoang Nam, Nhi Hac Tay Bac', () => {
    expect(phiTinh({ nam: 2026, thang: 10, ngay: 21 }).ky.map((k) => [k.ten, k.huong, k.son?.join(' ') ?? ''])).toEqual([
      ['Thái Tuế', 'Nam', 'Ngọ'], ['Tuế Phá', 'Bắc', 'Tý'], ['Tam Sát', 'Bắc', 'Hợi Tý Sửu'], ['Ngũ Hoàng', 'Nam', ''], ['Nhị Hắc', 'Tây Bắc', ''],
    ]);
  });

  test('Tam Sat 12 chi: Than Ty Thin → Nam, Dan Ngo Tuat → Bac, Ty Dau Suu → Dong, Hoi Mao Mui → Tay (masterseanchan)', () => {
    const theo = ['Nam', 'Đông', 'Bắc', 'Tây']; // chi % 4: Ty(0) Than Thin · Suu(1) Ty Dau · Dan(2) Ngo Tuat · Mao(3) Hoi Mui
    for (let c = 0; c < 12; c++) expect(huongKy(c, ban(1)).find((k) => k.ten === 'Tam Sát')?.huong, String(c)).toBe(theo[c % 4]);
  });

  test('huong Thai Tue khop thu vien (getYearPositionTaiSuiDesc) 10/12 chi; Tuat, Hoi theo 24 son', () => {
    const TEN: Record<string, string> = { 正北: 'Bắc', 东北: 'Đông Bắc', 正东: 'Đông', 东南: 'Đông Nam', 正南: 'Nam', 西南: 'Tây Nam', 正西: 'Tây', 西北: 'Tây Bắc' };
    for (let y = 2020; y < 2032; y++) {
      const l = Solar.fromYmd(y, 6, 1).getLunar();
      const app = phiTinh({ nam: y, thang: 6, ngay: 1 }).ky[0]?.huong;
      // Thu vien ghi Tuat, Hoi o 坎 (Bac); 24 son: Tuat 292,5–307,5°, Hoi 322,5–337,5° deu thuoc cung Can (Tay Bac) — QUY_UOC muc 22.
      if (['戌', '亥'].includes(l.getYearZhi())) expect(app, String(y)).toBe('Tây Bắc');
      else expect(app, String(y)).toBe(TEN[l.getYearPositionTaiSuiDesc()]);
    }
  });
});
