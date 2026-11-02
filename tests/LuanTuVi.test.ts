/**
 * Luan tu vi tang 1 (`src/loi/tuVi/luan.ts`, ke hoach 2026-11-02): du loi cho moi tinh he; tu hoa khop bo an sao; 3.000 la so gia
 * (ngay sinh gia, luat 1) ra du doan, khong cau trong; cau chinh khong lap qua nhieu giua cac la so; phan bo "the Menh".
 */
import { lapLaSo, type LaSo } from '../src/loi/tuVi/laSo.ts';
import {
  NGUONG_CUNG, NGUONG_MENH, NGUONG_NAM, NGUONG_VAN, cachCuc, diemCung, diemMenh, dsDaiVan, khoaTinhHe, luanCung, luanDaiVan, luanNam, tenTuHoa,
  tongLuan,
} from '../src/loi/tuVi/luan.ts';
import { CAN_NAM, CHI_NAM, KET_VAN } from '../src/loi/tuVi/luanHanLoi.ts';
import { tinhLuuHan } from '../src/loi/tuVi/luuHan.ts';
import { CUNG_SAO, HOP_KY, SUC_KHOE } from '../src/loi/tuVi/luanCungLoi.ts';
import { CACH_LOI, TINH_HE } from '../src/loi/tuVi/luanLoi.ts';

/** 3.000 la so gia, rai deu nam 1950–2009, du thang, ngay, gio, gioi (LCG hat co dinh). */
const MAU: readonly { ls: LaSo; nam: number }[] = (() => {
  let hat = 20261102;
  const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return Math.floor((hat / 2 ** 31) * n); };
  return Array.from({ length: 3000 }, () => {
    const nam = 1950 + r(60);
    return { nam, ls: lapLaSo({ ngay: 1 + r(29), thang: 1 + r(12), nam, chiGio: r(12), gioiTinh: r(2) === 0 ? 'nam' : 'nu', namXem: 2026 }) };
  });
})();

describe('luan tu vi tang 1', () => {
  test('du 60 tinh he co loi; vo chinh dieu muon duoc loi cung doi', () => {
    const khoa = new Set(MAU.flatMap(({ ls }) => ls.cung.map((c) => khoaTinhHe(ls, c.chi))));
    const coSao = [...khoa].filter((k) => !k.startsWith('VCD|'));
    expect(coSao.length).toBe(60);
    expect(coSao.filter((k) => TINH_HE[k] === undefined)).toEqual([]);
    expect([...khoa].filter((k) => k.startsWith('VCD|') && TINH_HE[k.slice(4)] === undefined)).toEqual([]);
    expect(Object.keys(TINH_HE).filter((k) => !khoa.has(k))).toEqual([]); // khong co loi thua
  });

  test('tu hoa theo can nam khop sao bo an sao dat cung', () => {
    const sai = MAU.filter(({ ls, nam }) => tenTuHoa((((nam - 4) % 10) + 10) % 10, ls.phai).some((sao, i) => {
      const hoa = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'][i] ?? '';
      const c = ls.cung.find((x) => x.sao.some((s) => s.ten === hoa));
      return c === undefined || !c.sao.some((s) => s.ten === sao);
    }));
    expect(sai.length).toBe(0);
  });

  test('3.000 la so: du doan, khong cau trong; cach cuc co loi; cau chinh khong lap qua 30 %', () => {
    const dem = new Map<string, number>();
    for (const { ls, nam } of MAU) {
      const tl = tongLuan(ls, nam);
      expect(tl.map((d) => d.tieuDe).filter((t) => !t.startsWith('Cách cục'))).toHaveLength(5);
      for (const d of tl) {
        expect(d.loi.length).toBeGreaterThan(0);
        for (const l of d.loi) {
          expect([l.length > 30, l.includes('undefined')]).toEqual([true, false]);
          // Chi dem cau ke chuyen (tinh he, cach cuc, tu hoa); cau phan loai 2–4 nhanh (am duong, Thai Tue…) tat nhien lap.
          if (d.tieuDe.startsWith('Kiểu') || d.tieuDe.startsWith('Cách') || d.tieuDe.startsWith('Tứ hóa')) dem.set(l, (dem.get(l) ?? 0) + 1);
        }
      }
      for (const [k] of cachCuc(ls)) expect(CACH_LOI[k]).toBeDefined();
    }
    const lap = [...dem.entries()].filter(([l, n]) => n > MAU.length * 0.3 && !Object.values(TINH_HE).includes(l));
    expect(lap.map(([l, n]) => `${String(n)}: ${l.slice(0, 50)}`)).toEqual([]);
  });

  test('the Menh: nguong cho khoang 1/4 vung, 1/4 yeu (in phan bo)', () => {
    const d = MAU.map(({ ls }) => diemMenh(ls));
    const vung = d.filter((x) => x >= NGUONG_MENH.vung).length / d.length, yeu = d.filter((x) => x < NGUONG_MENH.yeu).length / d.length;
    console.log(`the Menh: vung ${(vung * 100).toFixed(0)} %, yeu ${(yeu * 100).toFixed(0)} %, vua ${((1 - vung - yeu) * 100).toFixed(0)} %`);
    expect([vung > 0.15 && vung < 0.35, yeu > 0.15 && yeu < 0.35]).toEqual([true, true]);
  });

  test('cach cuc dung dinh nghia tren la so mau', () => {
    const tim = (dk: (ls: LaSo) => boolean): LaSo => {
      const x = MAU.find(({ ls }) => dk(ls));
      if (x === undefined) throw new Error('khong co la so mau');
      return x.ls;
    };
    const menh = (ls: LaSo): string => khoaTinhHe(ls, ls.menh);
    const co = (ls: LaSo, k: string): boolean => cachCuc(ls).some(([t]) => t === k);
    expect(co(tim((ls) => menh(ls) === 'Tử Vi+Thiên Phủ'), 'tuPhuDong')).toBe(true);
    expect(co(tim((ls) => menh(ls) === 'Cự Môn|Thiên Cơ'), 'thachTrung')).toBe(true);
    expect(co(tim((ls) => menh(ls) === 'Thất Sát|Tử Vi+Thiên Phủ'), 'satTrieu')).toBe(true);
    expect(co(tim((ls) => menh(ls) === 'Vũ Khúc+Tham Lang'), 'thamVu')).toBe(true);
    // Minh chau xuat hai: Menh Mui vo chinh dieu, Thai Duong Mao, Thai Am Hoi.
    const mc = tim((ls) => ls.menh === 7 && menh(ls).startsWith('VCD|') && ls.cung[3]?.sao.some((s) => s.ten === 'Thái Dương') === true
      && ls.cung[11]?.sao.some((s) => s.ten === 'Thái Âm') === true);
    expect(co(mc, 'minhChau')).toBe(true);
    // Sat Pha Tham khong lan voi Co Nguyet Dong Luong.
    expect(MAU.filter(({ ls }) => co(ls, 'satPhaTham') && co(ls, 'coNguyet')).length).toBe(0);
  });

  test('tang 2: du loi 14 sao chinh × 11 cung; 3.000 la so × 12 cung ra du loi; ket luan cung ~1/4 thuan, ~1/4 phai de tam', () => {
    const SAO = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn',
      'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];
    const CUNG = ['Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
    expect(CUNG.flatMap((c) => SAO.filter((s) => CUNG_SAO[c]?.[s] === undefined).map((s) => `${c}/${s}`))).toEqual([]);
    let tot = 0, kem = 0, n = 0, nguoc = 0;
    for (const { ls, nam } of MAU) {
      for (const c of ls.cung) {
        const l = luanCung(ls, c.chi, nam);
        expect([l.length >= 2, l.some((x) => x.includes('undefined') || x.length < 15)]).toEqual([true, false]);
        if (c.ten === 'Tật Ách') expect(l.at(-1)).toBe(SUC_KHOE);
        if (c.chi !== ls.menh && c.sao.every((s) => s.loai !== 1)) expect(l[0]?.startsWith('Không có sao chính, mượn sao cung đối')).toBe(true);
        if (c.chi === ls.menh) continue;
        const d = diemCung(ls, c.chi);
        n += 1; tot += d >= NGUONG_CUNG.tot ? 1 : 0; kem += d < NGUONG_CUNG.kem ? 1 : 0;
        // Loi sao noi xau (sao ky voi cung, mo) ma ket luan "thuan hon phan dong" = nguoc nhau.
        const ch = c.sao.filter((s) => s.loai === 1);
        if (d >= NGUONG_CUNG.tot && ch.length > 0 && ch.every((s) => HOP_KY[c.ten]?.ky.includes(s.ten) === true && (s.doSang === 'B' || s.doSang === 'H'))) nguoc += 1;
      }
    }
    console.log(`ket luan cung: thuan ${(100 * tot / n).toFixed(0)} %, phai de tam ${(100 * kem / n).toFixed(0)} %`);
    expect(nguoc).toBe(0);
    expect([tot / n > 0.15 && tot / n < 0.35, kem / n > 0.15 && kem / n < 0.35]).toEqual([true, true]);
  });

  test('tang 3: dai van, nam — du loi, ket luan ~1/4 moi dau; 12 dai van theo tuoi tu so cuc', () => {
    let vt = 0, vk = 0, vn = 0, nt = 0, nk = 0, nn = 0;
    for (const { ls, nam } of MAU.slice(0, 1000)) {
      const ds = dsDaiVan(ls, nam);
      expect([ds.length, ds[0]?.tuoi, ds.every((v, i) => i === 0 || v.tuoi === (ds[i - 1]?.tuoi ?? 0) + 10)]).toEqual([12, ls.soCuc, true]);
      for (const c of ls.cung) {
        const v = luanDaiVan(ls, c.chi, nam);
        expect([v.loi.some((x) => x.includes('undefined') || x.length < 15), v.loi.at(-1)]).toEqual([false, KET_VAN[v.ket]]);
        vn += 1; vt += v.diem >= NGUONG_VAN.thuan ? 1 : 0; vk += v.diem < NGUONG_VAN.kho ? 1 : 0;
      }
      const n = luanNam(ls, tinhLuuHan(ls, 6, { nam: 2026, thang: 7, ngay: 15 }), nam);
      expect(n.loi.some((x) => x.includes('undefined') || x.length < 15)).toBe(false);
      nn += 1; nt += n.diem >= NGUONG_NAM.thuan ? 1 : 0; nk += n.diem < NGUONG_NAM.kho ? 1 : 0;
    }
    console.log(`dai van: thuan ${(100 * vt / vn).toFixed(0)} %, kho ${(100 * vk / vn).toFixed(0)} % · nam 2026: thuan ${(100 * nt / nn).toFixed(0)} %, kho ${(100 * nk / nn).toFixed(0)} %`);
    expect([vt / vn > 0.15 && vt / vn < 0.35, vk / vn > 0.15 && vk / vn < 0.35, nt / nn > 0.1 && nt / nn < 0.4, nk / nn > 0.1 && nk / nn < 0.4])
      .toEqual([true, true, true, true]);
  });

  test('tang 3: can nam Nham sinh can tuoi Giap (Thuy sinh Moc), nam Ty trung tuoi Ty', () => {
    const ls = lapLaSo({ ngay: 5, thang: 3, nam: 1984, chiGio: 2, gioiTinh: 'nam', namXem: 2032 });
    const n = luanNam(ls, tinhLuuHan(ls, 3, { nam: 2032, thang: 7, ngay: 15 }), 1984);
    expect([n.loi.includes(CAN_NAM.sinhNhap), n.loi.includes(CHI_NAM.tuoi)]).toEqual([true, true]);
  });
});
