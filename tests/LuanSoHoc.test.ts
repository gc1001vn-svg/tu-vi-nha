/**
 * Luan than so hoc (`src/loi/soHocLuan.ts`, ke hoach 2026-11-02-than-so): vi du dung tay (dinh cao, thu thach, mui ten, so thai do),
 * moi ngay sinh 1940–2025 deu ra du loi, chu dung quy uoc; hai nguoi khac ngay sinh trung it cau. Ngay sinh GIA (luat 1).
 */
import { tuSoNgay, soNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { thanSo } from '../src/loi/soHoc.ts';
import { bieuDoTS, dinhCao, tongLuanTS, vanTS } from '../src/loi/soHocLuan.ts';

const d = (s: string): NgayDuong => { const [ngay = 0, thang = 0, nam = 0] = s.split('/').map(Number); return { nam, thang, ngay }; };
const XEM = { nam: 2026, thang: 11, ngay: 2 };
/** Moi cau luan (khong tieu de) cua mot ngay sinh. */
const loiCua = (sinh: NgayDuong, xem: NgayDuong = XEM): string[] => {
  const t = thanSo(sinh, xem);
  return [...tongLuanTS(t, sinh), ...bieuDoTS(t)].flatMap((x) => x.loi).concat(vanTS(t, sinh, xem).loi);
};
/** Loi chu theo quy uoc (`docs/QUY_UOC.md` muc 10), nhu `tests/LoiGiai.test.ts`. */
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : null);

describe('luan than so hoc: vi du dung tay', () => {
  test('15/03/1985: dinh cao 9, 11, 11, 8 · thu thach 3, 1, 2, 2 · dinh 1 het 31 tuoi (36 − 5) · 2026 dang o dinh 3', () => {
    const sinh = d('15/03/1985'), t = thanSo(sinh, XEM);
    expect(dinhCao(t, sinh).map((x) => `${String(x.tu)}-${String(x.den)} ${String(x.so)}/${String(x.thuThach)}`))
      .toEqual(['0-31 9/3', '32-40 11/1', '41-49 11/2', '50-null 8/2']);
    expect(vanTS(t, sinh, XEM).dang).toBe(2);
    expect(vanTS(t, sinh, { nam: 2016, thang: 3, ngay: 14 }).dang).toBe(0); // 30 tuoi, chua qua sinh nhat 31
  });

  test('so chu dao bac thay rut ve mot chu so khi tinh tuoi: 22/4 → dinh 1 het 32 tuoi; 11 → 34', () => {
    const a = d('10/03/1980'), b = d('29/09/1980');
    expect([thanSo(a, XEM).chuDao, dinhCao(thanSo(a, XEM), a)[0]?.den]).toEqual([22, 32]);
    expect([thanSo(b, XEM).chuDao, dinhCao(thanSo(b, XEM), b)[0]?.den]).toEqual([11, 34]);
  });

  test('mui ten: 15/03/1985 chi co Quyet tam; 20/10/2000 trong 4-5-6, 7-8-9, 3-6-9, 3-5-7', () => {
    const mt = (s: string): string[] => (bieuDoTS(thanSo(d(s), XEM))[1]?.loi ?? []).map((l) => l.split(':')[0] ?? '');
    expect(mt('15/03/1985')).toEqual(['Mũi tên Quyết tâm (1-5-9 đầy)']);
    expect(mt('20/10/2000')).toEqual(['Mũi tên Uất giận (4-5-6 trống)', 'Mũi tên Thụ động (7-8-9 trống)',
      'Mũi tên Trí nhớ ngắn hạn (3-6-9 trống)', 'Mũi tên Hoài nghi (3-5-7 trống)']);
  });

  test('so thai do = ngay + thang rut gon (vi du trang Viet: 14/1 → 6)', () => {
    const sinh = d('14/01/1990');
    expect(tongLuanTS(thanSo(sinh, XEM), sinh)[2]?.tieuDe).toBe('Số thái độ 6');
  });
});

describe('luan than so hoc: moi ngay sinh 1940–2025', () => {
  const ngay = Array.from({ length: soNgay({ nam: 2025, thang: 12, ngay: 31 }) - soNgay({ nam: 1940, thang: 1, ngay: 1 }) + 1 },
    (_, i) => tuSoNgay(soNgay({ nam: 1940, thang: 1, ngay: 1 }) + i));

  test('du loi moi phan, khong cau trong, chu dung quy uoc; 1-2-3 khong bao gio trong', () => {
    const sai: string[] = [];
    for (const sinh of ngay) {
      const t = thanSo(sinh, XEM);
      expect([tongLuanTS(t, sinh).length, bieuDoTS(t).length, vanTS(t, sinh, XEM).loi.length]).toEqual([4, 3, 4]);
      for (const l of loiCua(sinh)) {
        const loi = saiChu(l) ?? (l.endsWith(': ') || l.endsWith('— ') ? 'cau cut' : null);
        if (loi !== null) sai.push(`${String(sinh.ngay)}/${String(sinh.thang)}/${String(sinh.nam)}: ${loi} — ${l.slice(0, 60)}`);
      }
      if ([1, 2, 3].every((k) => (t.luoi[k - 1] ?? 0) === 0)) sai.push('1-2-3 trong');
    }
    expect(sai.slice(0, 10)).toEqual([]);
  });

  test('khong chung chung: hai ngay sinh ngau nhien trung trung binh duoi 30 % cau (do 02/11)', () => {
    let hat = 20261102;
    const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return Math.floor((hat / 2 ** 31) * n); };
    let tong = 0;
    for (let i = 0; i < 300; i++) {
      const a = new Set(loiCua(ngay[r(ngay.length)] ?? XEM)), b = new Set(loiCua(ngay[r(ngay.length)] ?? XEM));
      tong += [...a].filter((l) => b.has(l)).length / a.size;
    }
    expect(tong / 300).toBeLessThan(0.3);
  });
});
