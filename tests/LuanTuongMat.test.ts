/**
 * Luan tuong mat (`src/loi/tuongMatLuan.ts`, ke hoach 2026-11-02-tuong-mat): ca dung tay (cho venh chot bang net khac, bang mui ×
 * mieng, anh cuoi, chup gan), quet 3.000 mat gia (moi ti le rut doc lap tu 15 nguoi mau): du doan, khong cau trong, chu dung quy uoc,
 * ket moi dau 10–40 %, do trung loi giua hai mat khac nhau. Khong anh, khong so do nguoi that.
 */
import type { SoDoMat } from '../src/loi/tuongMat.ts';
import { CAC_KHOA, MAU } from '../src/loi/tuongMatGiai.ts';
import { diemMat, luanMat, mucXet, netChot } from '../src/loi/tuongMatLuan.ts';
import { HA_DAI, KET, MAT_DAI, NHAC, TIEN } from '../src/loi/tuongMatLuanLoi.ts';

const vua = Object.fromEntries(CAC_KHOA.map((k) => [k, MAU[k][7] ?? 0])) as unknown as SoDoMat;
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('luan tuong mat', () => {
  test('mat vua: ket binh thuong; mui rong mieng hep → cau bang mui × mieng; du 6 doan', () => {
    const l = luanMat({ so: vua, cuoi: 0 });
    expect([l?.length, l?.[0]?.loi[0], l?.at(-1)?.loi]).toEqual([6, KET.vua, [...NHAC]]);
    const t = luanMat({ so: { ...vua, mui: 0.31, mieng: 0.34 }, cuoi: 0 });
    expect(t?.find((d) => d.tieuDe === 'Tiền bạc, lộc ăn')?.loi[0]).toBe(TIEN[2]?.[0]);
  });

  test('cho venh chot bang net khac: ha dinh dai xet cam, ham; mat dai xet ham, cam', () => {
    const m = (so: Partial<SoDoMat>) => mucXet({ so: { ...vua, ...so }, cuoi: 0 });
    expect([netChot('trungHa', m({ trungHa: 0.9, cam: 0.41 })), netChot('trungHa', m({ trungHa: 0.9, cam: 0.37 })),
      netChot('trungHa', m({ trungHa: 0.9 }))]).toEqual([HA_DAI.day, HA_DAI.nhon, HA_DAI.thuong]);
    expect([netChot('daiRong', m({ daiRong: 1.0, ham: 0.83 })), netChot('daiRong', m({ daiRong: 1.0, cam: 0.37 })),
      netChot('daiRong', m({ daiRong: 1.0 }))]).toEqual([MAT_DAI.vuong, MAT_DAI.nhon, MAT_DAI.thuong]);
    expect(netChot('may', m({}))?.d).toBe(0); // may dai qua mat: luoi gan nhu ai cung ra, khong cong diem
  });

  test('nhieu net tot → thuan; nhieu net kem → can boi dap; anh cuoi → null; chup gan con duoi 5 net → chua du', () => {
    const tot = { ...vua, tran: 0.87, mui: 0.32, mieng: 0.4, anDuong: 1.25, mayCach: 0.85 };
    const xau = { ...vua, tran: 0.8, mui: 0.28, mieng: 0.33, anDuong: 1.0, mayCach: 0.55 };
    expect([luanMat({ so: tot, cuoi: 0 })?.[0]?.loi[0], luanMat({ so: xau, cuoi: 0 })?.[0]?.loi[0]]).toEqual([KET.thuan, KET.kho]);
    expect(luanMat({ so: vua, cuoi: 0.5 })).toBeNull();
    const gan = luanMat({ so: { ...vua, daiRong: 1.2 }, cuoi: 0, meo: { f35: 30, nguon: 'uoc', co: '1×1', u: 1, cach: 0.1, goc: vua } });
    expect(gan?.[0]?.loi[0]?.startsWith('Chưa đủ nét để luận cả khuôn mặt')).toBe(true);
  });

  test('3.000 mat gia: du doan, khong cau trong, chu dung quy uoc; ket moi dau 10–40 %; trung loi giua hai mat < 40 %', () => {
    let s = 7;
    const r = (): number => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const sai: string[] = [], ket: string[] = [], cau: Set<string>[] = [];
    for (let i = 0; i < 3000; i++) {
      const so = Object.fromEntries(CAC_KHOA.map((k) => [k, (MAU[k][Math.floor(r() * 15)] ?? 0) * (1 + (r() - 0.5) * 0.02)])) as unknown as SoDoMat;
      const l = luanMat({ so, cuoi: 0 }) ?? [];
      expect(l.length).toBeGreaterThanOrEqual(5);
      for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(i)}: ${e} — ${x}`); }
      ket.push(l[0]?.loi[0] ?? '');
      cau.push(new Set(l.filter((d) => d.tieuDe !== 'Nhìn cho đúng').flatMap((d) => d.loi.slice(d.tieuDe === 'Tổng luận' ? 1 : 0))));
      expect(diemMat(mucXet({ so, cuoi: 0 }))).toBe(CAC_KHOA.reduce((t, k) => t + (netChot(k, mucXet({ so, cuoi: 0 }))?.d ?? 0), 0));
    }
    expect(sai.slice(0, 5)).toEqual([]);
    for (const k of [KET.thuan, KET.kho]) {
      const ti = ket.filter((x) => x === k).length / ket.length;
      expect(ti >= 0.1 && ti <= 0.4).toBe(true);
    }
    let trung = 0, dem = 0;
    for (let i = 0; i + 1 < cau.length; i += 2) {
      const a = cau[i] ?? new Set<string>(), b = cau[i + 1] ?? new Set<string>();
      trung += [...a].filter((x) => b.has(x)).length / Math.max(a.size, 1); dem++;
    }
    expect(trung / dem).toBeLessThan(0.4);
  });
});
