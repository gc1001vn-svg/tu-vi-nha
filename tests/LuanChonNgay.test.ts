/**
 * Luan chon ngay (`src/loi/chonNgayLuan.ts`, ke hoach 2026-11-03-chon-ngay): ky tuc mac dinh ha xuong `xau` (Hiep Ky), giu `tranh` khi
 * chon; Nguyet Ky van Tranh; ngay Tot khong bao gio co ky tuc; ngay nen chon xep theo diem; 2026 × 5 viec × co / khong tuoi: du doan,
 * chu dung quy uoc.
 */
import { duongSangAm, soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { chamNgay, chonNgay, ngayXauThang, VIEC, type Viec } from '../src/loi/chonNgay.ts';
import { coKyTuc, diemNgay, luanThang, ngayNenChon } from '../src/loi/chonNgayLuan.ts';
import { xemNgay } from '../src/loi/homNay.ts';
import { NHAC } from '../src/loi/chonNgayLuanLoi.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);
const VIECS = Object.keys(VIEC) as Viec[];
/** Ngay duong dau tien tu 2026-01-01 co ngay am `ngay` (thang bat ky). */
const timAm = (ngay: number, thang?: number): NgayDuong => {
  for (let jd = soNgay({ nam: 2026, thang: 1, ngay: 1 }); ; jd++) { const d = tuSoNgay(jd), a = duongSangAm(d); if (a.ngay === ngay && (thang === undefined || a.thang === thang)) return d; }
};

describe('luan chon ngay', () => {
  test('Duong Cong Ky (13/1 am): mac dinh xau, ghi tuc; kyTuc tranh thi Tranh; Nguyet Ky (mung 5) van Tranh', () => {
    const d = timAm(13, 1), n = xemNgay(d);
    const mac = ngayXauThang(n.am, n.chiNgay).find((l) => l.chu.startsWith('Dương Công'));
    expect([mac?.loai, mac?.chu.includes('tục'), ngayXauThang(n.am, n.chiNgay, 'tranh').find((l) => l.chu.startsWith('Dương Công'))?.loai])
      .toEqual(['xau', true, 'tranh']);
    const nk = chamNgay(timAm(5), 'cuoiHoi');
    expect([nk.danhGia, nk.lyDo.find((l) => l.chu.startsWith('Nguyệt Kỵ'))?.loai]).toEqual(['tranh', 'tranh']);
  });

  test('ca nam 2026 × 5 viec: ngay Tot khong co ky tuc; ngay nen chon la Tot (neu co), xep diem giam dan; du doan, chu dung', () => {
    const sai: string[] = [];
    let tranhCu = 0, tranhMoi = 0;
    for (const v of VIECS) for (let t = 1; t <= 12; t++) for (const tuoi of [undefined, 3]) {
      const ds = chonNgay(v, 2026, t, tuoi);
      if (tuoi === undefined) { tranhMoi += ds.filter((x) => x.danhGia === 'tranh').length; tranhCu += chonNgay(v, 2026, t, undefined, { kyTuc: 'tranh' }).filter((x) => x.danhGia === 'tranh').length; }
      for (const n of ds) if (n.danhGia === 'tot') expect(coKyTuc(n)).toBe(false);
      const nen = ngayNenChon(ds);
      if (ds.some((n) => n.danhGia === 'tot')) expect(nen.tot && nen.ngay.every((n) => n.danhGia === 'tot')).toBe(true);
      expect(nen.ngay.every((n, i, a) => i === 0 || diemNgay(a[i - 1] ?? n) >= diemNgay(n))).toBe(true);
      const l = luanThang(v, ds);
      expect([l.length, l.at(-1)?.loi]).toEqual([4, [...NHAC]]);
      for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${v} ${String(t)}: ${e} — ${x}`); }
    }
    expect(sai.slice(0, 5)).toEqual([]);
    // Ky tuc ha xuong Duoc: bot ngay Tranh nhung van con (Nguyet Ky moi thang 3 ngay).
    // Do 03/11: Tranh 2026 (5 viec, khong xet tuoi) cu 805 / 1.825 ngay, moi 190.
    expect([tranhCu, tranhMoi]).toEqual([805, 190]);
  }, 60_000);
});
