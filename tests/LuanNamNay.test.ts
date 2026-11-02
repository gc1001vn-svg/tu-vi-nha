/**
 * Luan nam nay (`src/loi/namNayLuan.ts`, ke hoach 2026-11-02-nam-nay): ca dung tay (sao tot khong vuong → thuan; La Hau + xung → can
 * giu gin; duoi 10 tuoi), moi tuoi 1–100 × 12 nam × hai gioi ra du loi, chu dung quy uoc, ket moi dau 10–40 % (tu 10 tuoi). Ngay sinh GIA.
 */
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { namNay, type NamNay } from '../src/loi/namNay.ts';
import { diemNamNay, luanNamNay } from '../src/loi/namNayLuan.ts';
import { KET, VIEC } from '../src/loi/namNayLuanLoi.ts';

const nn = (nam: number, gioiTinh: 'nam' | 'nu', xem: number): NamNay => {
  const hs: HoSo = { id: 'a', ten: 'Giả', gioiTinh, ngaySinh: `${String(nam)}-06-15`, gioSinh: null, noiSinh: 'Hà Nội' };
  return namNay(hs, tinhHoSo(hs, undefined, { doiVeGio7: false }).chinh, { nam: xem, thang: 8, ngay: 1 });
};
const KHONG = { mucDo: 'tot', nghia: '' } as const;
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : null);

describe('luan nam nay', () => {
  const goc = nn(1985, 'nam', 2026);

  test('sao tot, khong Thai Tue, khong Tam Tai → thuan; La Hau + xung → can giu gin; han khong tinh diem', () => {
    const tot: NamNay = { ...goc, sao: { ten: 'Thái Dương', mucDo: 'tot', nghia: '' }, thaiTue: { ten: 'Không phạm', ...KHONG }, tamTai: { ten: 'Không phạm', ...KHONG } };
    expect([diemNamNay(tot), luanNamNay(tot)[0]?.loi[0]]).toEqual([1, KET.thuan]);
    const xau: NamNay = { ...tot, sao: { ten: 'La Hầu', mucDo: 'xau', nghia: '' }, thaiTue: { ten: 'Xung Thái Tuế', mucDo: 'xau', nghia: '' } };
    expect([diemNamNay(xau), luanNamNay(xau)[0]?.loi[0]]).toEqual([-3, KET.kho]);
    expect(diemNamNay({ ...tot, han: { ten: 'Diêm Vương', mucDo: 'xau', nghia: '' } })).toBe(1);
  });

  test('pham Kim Lau / Hoang Oc / Tam Tai thi kieng lam nha; duoi 10 tuoi chua xet', () => {
    const pham: NamNay = { ...goc, kimLau: { ten: 'Kim Lâu Thân', mucDo: 'xau', nghia: '' }, hoangOc: { ten: 'Nhất Cát', ...KHONG }, tamTai: { ten: 'Không phạm', ...KHONG } };
    expect(luanNamNay(pham)[1]?.loi.slice(0, 2)).toEqual([VIEC.nhaKieng('Kim Lâu'), VIEC.cuoiKimLau]);
    expect(luanNamNay(nn(2020, 'nu', 2026))[1]?.loi).toEqual([VIEC.nho]);
  });

  test('tuoi 1–100 × 12 nam × hai gioi: du 3 doan, chu dung quy uoc; ket moi dau 10–40 %', () => {
    const sai: string[] = [];
    const ket: string[] = [];
    for (let nam = 1926; nam <= 2025; nam++) for (const g of ['nam', 'nu'] as const) for (let y = 2020; y <= 2031; y++) {
      if (y < nam) continue;
      const n = nn(nam, g, y), tl = luanNamNay(n);
      expect(tl).toHaveLength(3);
      for (const l of tl.flatMap((x) => [x.tieuDe, ...x.loi])) { const s = saiChu(l); if (s !== null) sai.push(`${String(nam)} ${g} ${String(y)}: ${s}`); }
      if (n.tuoiMu >= 10) ket.push(tl[0]?.loi[0] ?? '');
    }
    expect(sai.slice(0, 5)).toEqual([]);
    for (const k of [KET.thuan, KET.kho]) {
      const ti = ket.filter((x) => x === k).length / ket.length;
      expect(ti >= 0.1 && ti <= 0.4).toBe(true);
    }
  });
});
