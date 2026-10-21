/**
 * Ho so (`src/loi/hoSo.ts`): cac vi du trong `docs/QUY_UOC.md` (tuoi mu muc 3, gio Ty muc 4, doi ve +7 muc 7,
 * sat ranh muc 8, khong ro gio muc 9), cung phi theo Lap Xuan, va kiem file sao luu (du lieu ngoai vao).
 * Ngay sinh trong file nay deu la ngay GIA (luat 1 CLAUDE.md).
 */
import {
  docSaoLuu, kiemHoSo, taoSaoLuu, tinhHoSo, tuoiMu, type HoSo,
} from '../src/loi/hoSo.ts';

const hs = (o: Partial<HoSo> = {}): HoSo => ({
  id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh: '2000-06-01', gioSinh: '12:00', noiSinh: 'Hà Nội', ...o,
});
const XEM = { nam: 2026, thang: 10, ngay: 14 };

describe('ho so: tinh tu ngay gio sinh', () => {
  test('tuoi mu theo Tet (QUY_UOC muc 3)', () => {
    expect(tuoiMu(tinhHoSo(hs({ ngaySinh: '2001-01-20', gioSinh: null })).chinh.am.nam, XEM)).toBe(27);
    expect(tuoiMu(tinhHoSo(hs({ ngaySinh: '2001-02-02', gioSinh: null })).chinh.am.nam, XEM)).toBe(26);
  });

  test('gio Ty: phai A doi ngay luc 23:00, chiaDoi giu ngay (QUY_UOC muc 4)', () => {
    const ty = hs({ ngaySinh: '2026-10-14', gioSinh: '23:30' });
    expect(tinhHoSo(ty).chinh).toMatchObject({ canChiNgay: 'Nhâm Tuất', chiGio: 'Tý' });
    expect(tinhHoSo(ty, undefined, { gioTy: 'chiaDoi' }).chinh.canChiNgay).toBe('Tân Dậu');
  });

  test('doi gio ve +7: ca D Altuvi (Sai Gon 1970, khi do +8)', () => {
    const d = hs({ gioiTinh: 'nu', ngaySinh: '1970-06-15', gioSinh: '08:00', noiSinh: 'TP. Hồ Chí Minh' });
    expect(tinhHoSo(d).chinh.phut7).toBe(7 * 60);
    expect(tinhHoSo(d, undefined, { doiVeGio7: false }).chinh.phut7).toBe(8 * 60);
  });

  test('cung phi: nam theo so nam, nu = 15 − nam; so 5 thi nam Khon, nu Can', () => {
    const cp = (nam: number, gioiTinh: 'nam' | 'nu'): string =>
      tinhHoSo(hs({ ngaySinh: `${String(nam)}-06-01`, gioiTinh })).chinh.cungPhi;
    expect([cp(1996, 'nam'), cp(1996, 'nu')]).toEqual(['Tốn', 'Khôn']);
    expect([cp(1982, 'nam'), cp(1982, 'nu')]).toEqual(['Ly', 'Càn']);
    expect([cp(1984, 'nam'), cp(1984, 'nu')]).toEqual(['Đoài', 'Cấn']);
    expect([cp(1959, 'nam'), cp(1954, 'nu')]).toEqual(['Khôn', 'Cấn']);
    expect(tinhHoSo(hs({ ngaySinh: '1959-06-01' })).chinh.hanhCungPhi).toBe('Thổ');
  });

  test('cung phi doi nam dung thoi khac Lap Xuan (2013: 03/02 23:13 gio VN)', () => {
    const lx = (gio: string): string => tinhHoSo(hs({ ngaySinh: '2013-02-03', gioSinh: gio })).chinh.cungPhi;
    expect(lx('23:00')).toBe('Càn'); // nam 2012
    expect(lx('23:30')).toBe('Khôn'); // nam 2013 (so 5)
    expect(tinhHoSo(hs({ ngaySinh: '2013-02-03', gioSinh: '23:30' }), undefined, { namCungPhi: 'tet' }).chinh.cungPhi).toBe('Càn');
  });

  test('sat ranh ±15 phut thi co phuong an khac (QUY_UOC muc 8)', () => {
    const r = tinhHoSo(hs({ ngaySinh: '2026-10-14', gioSinh: '22:50' }));
    expect(r.chinh.canChiNgay).toBe('Tân Dậu');
    const muon = r.khac.find((p) => p.lyDo.includes('muộn hơn 15 phút'));
    expect(muon?.khac).toContain('ngày âm');
    expect(muon?.ketQua.canChiNgay).toBe('Nhâm Tuất');
    // Giua khung gio, xa moi ranh: khong co phuong an nao.
    expect(tinhHoSo(hs({ gioSinh: '12:00' })).khac).toEqual([]);
  });

  test('khong ro gio: ngay Lap Xuan 04/02/2024 (15:27 gio VN) hien them phuong an cuoi ngay (QUY_UOC muc 9)', () => {
    const r = tinhHoSo(hs({ ngaySinh: '2024-02-04', gioSinh: null }));
    expect(r.chinh).toMatchObject({ chiGio: null, phut7: null, cungPhi: 'Tốn' });
    expect(r.khac).toHaveLength(1);
    expect(r.khac[0]?.khac).toEqual(['cung phi']);
    expect(r.khac[0]?.ketQua.cungPhi).toBe('Chấn');
    expect(tinhHoSo(hs({ ngaySinh: '2024-06-01', gioSinh: null })).khac).toEqual([]);
  });

  test('mien Bac 1947–1954 chua chac +8 hay +7: canh bao + phuong an +7', () => {
    const r = tinhHoSo(hs({ ngaySinh: '1950-06-01', gioSinh: '23:30' }));
    expect(r.canhBao.join(' ')).toContain('chưa chắc');
    expect(r.chinh).toMatchObject({ phut7: 22 * 60 + 30, chiGio: 'Hợi' });
    const bay = r.khac.find((p) => p.lyDo.includes('UTC+7'));
    expect(bay?.ketQua.chiGio).toBe('Tý');
    expect(bay?.khac).toContain('ngày âm');
  });

  test('nuoc ngoai: can phut lech UTC tu giao dien', () => {
    const nn = hs({ noiSinh: 'Nước ngoài', muiGio: 'Europe/Paris', ngaySinh: '2000-01-01', gioSinh: '20:00' });
    expect(() => tinhHoSo(nn)).toThrow();
    expect(tinhHoSo(nn, 60).chinh).toMatchObject({ duong7: { nam: 2000, thang: 1, ngay: 2 }, phut7: 120, chiGio: 'Sửu' });
  });

  test('con giap, nap am theo nam am', () => {
    expect(tinhHoSo(hs({ ngaySinh: '2026-06-01' })).chinh.conGiap).toBe('Ngựa');
    expect(tinhHoSo(hs({ ngaySinh: '1984-06-01' })).chinh).toMatchObject({ napAm: 'Hải Trung Kim', hanhMenh: 'Kim', canChiNam: 'Giáp Tý' });
    // Sinh truoc Tet 2001 (24/01) van la nam Canh Thin.
    expect(tinhHoSo(hs({ ngaySinh: '2001-01-20' })).chinh).toMatchObject({ canChiNam: 'Canh Thìn', conGiap: 'Rồng' });
  });
});

describe('ho so: kiem du lieu vao', () => {
  test('ho so sai thi nem loi', () => {
    const sai: Record<string, unknown>[] = [
      { ...hs(), ten: '' },
      { ...hs(), ten: undefined },
      { ...hs(), gioiTinh: 'khac' },
      { ...hs(), ngaySinh: '2023-02-30' },
      { ...hs(), ngaySinh: '1899-12-31' },
      { ...hs(), gioSinh: '24:00' },
      { ...hs(), gioSinh: undefined },
      { ...hs(), noiSinh: 'Sài Gòn' },
      { ...hs(), noiSinh: 'Nước ngoài' },
      { ...hs(), noiSinh: 'Nước ngoài', muiGio: '../x' },
      { ...hs(), huongNha: 360 },
      { ...hs(), huongNha: -1 },
      { ...hs(), huongNha: 12.5 },
      { ...hs(), huongNha: '90' },
    ];
    for (const x of sai) expect(() => kiemHoSo(x), JSON.stringify(x)).toThrow();
    expect(() => kiemHoSo(null)).toThrow();
  });

  test('truong la bi bo, ten cat khoang trang, mui gio chi giu khi o nuoc ngoai', () => {
    expect(kiemHoSo({ ...hs(), ten: '  Thử  ', anh: 'data:...', muiGio: 'Asia/Tokyo' })).toEqual(hs());
    const nn = { ...hs(), noiSinh: 'Nước ngoài', muiGio: 'America/Argentina/Buenos_Aires' };
    expect(kiemHoSo(nn)).toEqual(nn);
  });

  test('file sao luu: khu hoi y het; sai thi nem loi co so thu tu', () => {
    // File cu (truoc dot 5) khong co huong nha: van doc duoc; co thi giu nguyen.
    const ds = [hs(), hs({ id: 'b', ten: 'Hai', gioiTinh: 'nu', gioSinh: null }), hs({ id: 'c', noiSinh: 'Nước ngoài', muiGio: 'Europe/Paris' }),
      hs({ id: 'd', huongNha: 0 }), hs({ id: 'e', huongNha: 359 })];
    expect(docSaoLuu(JSON.parse(JSON.stringify(taoSaoLuu(ds, '2026-10-19T12:00:00Z'))))).toEqual(ds);
    const goc = taoSaoLuu(ds, 'x');
    expect(() => docSaoLuu({ ...goc, ung: 'khac' })).toThrow('Tử Vi Nhà');
    expect(() => docSaoLuu({ ...goc, phienBan: 2 })).toThrow();
    expect(() => docSaoLuu({ ...goc, hoSo: [hs(), hs()] })).toThrow('trùng');
    expect(() => docSaoLuu({ ...goc, hoSo: [hs(), { ...hs({ id: 'z' }), ngaySinh: 'abc' }] })).toThrow('Hồ sơ thứ 2');
    expect(() => docSaoLuu('{}')).toThrow();
  });
});
