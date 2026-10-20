/**
 * Loi giai (luat 6, Claude soan lai): phu du — moi cung, moi sao co trong la so, 9 sao luu, 9 sao han, 8 han, 10 nhat chu,
 * 10 thap than — va chu dung quy uoc (`docs/QUY_UOC.md` muc 10: NFC, dau kieu cu Hỏa Thủy Hòa, Tỵ Kỷ Kỵ). Ngay sinh GIA.
 */
import { NGHIA_THAP_THAN, NGHIA_VAN, NHOM_HANH, tinhBatTu } from '../src/loi/batTu.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { NGUON_SAO_HAN, namNay } from '../src/loi/namNay.ts';
import { lapLaSo } from '../src/loi/tuVi/laSo.ts';
import { tinhLuuHan } from '../src/loi/tuVi/luuHan.ts';
import {
  BINH, CHINH_TINH, CHU_DE, HAN, NGHIA_CUNG, PHU_TINH, SAO_LUU, SAO_LUU_TRUNG, THAN_CHUNG, THAN_CU, TRIET, TUAN, VO_CHINH_DIEU,
} from '../src/loi/tuVi/nghia.ts';

const hs = (o: Partial<HoSo> = {}): HoSo => ({
  id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '1985-03-15', gioSinh: '02:00', noiSinh: 'Hà Nội', ...o,
});
const la = (chiGio: number) => lapLaSo({ ngay: 24, thang: 2, nam: 1985, chiGio, gioiTinh: 'nam', namXem: 2026 });
const ngay = (i: number): string => new Date(Date.UTC(1985, 2, 15 + i)).toISOString().slice(0, 10);

/** Moi doan chu loi giai, kem ten cho de tim khi sai. */
function moiDoan(): [string, string][] {
  const ra: [string, string][] = [];
  const them = (ten: string, o: Readonly<Record<string, unknown>>): void => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') ra.push([`${ten}.${k}`, v]);
      else if (typeof v === 'object' && v !== null) them(`${ten}.${k}`, v as Record<string, unknown>);
    }
  };
  them('tuVi', { NGHIA_CUNG, CHU_DE, CHINH_TINH, PHU_TINH, SAO_LUU, SAO_LUU_TRUNG, THAN_CU, THAN_CHUNG, HAN, BINH, TUAN, TRIET, VO_CHINH_DIEU });
  them('batTu', { NGHIA_THAP_THAN, NGHIA_VAN, NHOM_HANH });
  them('namNay', { NGUON_SAO_HAN });
  for (let i = 0; i < 10; i++) {
    const h = hs({ ngaySinh: ngay(i) });
    ra.push([`nhatChu ${ngay(i)}`, tinhBatTu(h, tinhHoSo(h).chinh, { nam: 2026, thang: 10, ngay: 20 }).nghiaNhatChu]);
  }
  for (const gioiTinh of ['nam', 'nu'] as const) {
    for (let tuoi = 1; tuoi <= 120; tuoi++) {
      const h = hs({ gioiTinh });
      const n = namNay(h, tinhHoSo(h).chinh, { nam: 1985 + tuoi - 1, thang: 6, ngay: 1 });
      for (const m of [n.sao, n.han]) if (m.giai !== undefined) ra.push([`namNay ${m.ten}`, m.giai]);
    }
  }
  return ra;
}

describe('loi giai', () => {
  test('tu vi: moi cung, moi sao co trong la so deu co loi; 9 sao luu; Than cu du 6 cung', () => {
    const ls = la(1);
    const ten = [...new Set(ls.cung.flatMap((c) => c.sao.map((s) => s.ten)))];
    expect(ten.length).toBe(108); // 109 sao, hai sao cung ten Quan Phù
    expect(ten.filter((t) => !(t in CHINH_TINH) && !(t in PHU_TINH))).toEqual([]);
    expect(Object.keys(CHINH_TINH)).toHaveLength(14);
    expect(ls.cung.map((c) => c.ten).filter((t) => !(t in NGHIA_CUNG) || !(t in CHU_DE))).toEqual([]);
    expect(Object.keys(SAO_LUU_TRUNG).filter((t) => !(t in SAO_LUU))).toEqual([]);
    expect(tinhLuuHan(ls, 2, { nam: 2026, thang: 10, ngay: 20 }).sao.map((s) => s.ten).sort()).toEqual(Object.keys(SAO_LUU).sort());
    const than = new Set(Array.from({ length: 12 }, (_, g) => { const l = la(g); return l.cung[l.than]?.ten ?? ''; }));
    expect([...than].sort()).toEqual(Object.keys(THAN_CU).sort());
  });

  test('sao han, 8 han: tuoi 1–120 nam nu, sao va han (tu 10 tuoi) nao cung co doan giai', () => {
    const thieu: string[] = [];
    const gap = new Set<string>();
    for (const gioiTinh of ['nam', 'nu'] as const) {
      for (let tuoi = 1; tuoi <= 120; tuoi++) {
        const h = hs({ gioiTinh });
        const n = namNay(h, tinhHoSo(h).chinh, { nam: 1985 + tuoi - 1, thang: 6, ngay: 1 });
        for (const m of tuoi < 10 ? [n.sao] : [n.sao, n.han]) {
          gap.add(m.ten);
          if (m.giai === undefined) thieu.push(`${gioiTinh} ${String(tuoi)} ${m.ten}`);
        }
      }
    }
    expect(thieu).toEqual([]);
    expect(gap.size).toBe(17);
  });

  test('bat tu: 10 nhat chu khac nhau deu co loi; thap than, van, nhom hanh du', () => {
    const nhat = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      const h = hs({ ngaySinh: ngay(i) });
      const b = tinhBatTu(h, tinhHoSo(h).chinh, { nam: 2026, thang: 10, ngay: 20 });
      nhat.set(b.nhatChu, b.nghiaNhatChu);
    }
    expect(nhat.size).toBe(10);
    expect([...nhat.values()].filter((v) => v.length < 100)).toEqual([]);
    expect(Object.keys(NGHIA_VAN).sort()).toEqual(Object.keys(NGHIA_THAP_THAN).sort());
    expect(Object.keys(NGHIA_VAN)).toHaveLength(10);
    expect(Object.keys(NHOM_HANH)).toHaveLength(5);
  });

  test('chu dung quy uoc: NFC, dau kieu cu, Tỵ Kỷ Kỵ, khong thua khoang trang, khong rong', () => {
    const sai = moiDoan().flatMap(([ten, v]) => {
      const loi: string[] = [];
      if (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v)) loi.push('rong hoac thua khoang trang');
      if (v.normalize('NFC') !== v) loi.push('chua NFC');
      if (/(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v)) loi.push('dau kieu moi');
      if (/(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v)) loi.push('viet Tỵ, Kỷ, Kỵ');
      return loi.map((l) => `${ten}: ${l} — ${v.slice(0, 50)}`);
    });
    expect(sai).toEqual([]);
  });
});
