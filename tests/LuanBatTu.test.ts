/**
 * Luan bat tu (`src/loi/batTuLuan.ts`, ke hoach 2026-11-02-bat-tu): la dung tay (tong, chuyen vuong, dieu hau, xung hop, nam tuoi),
 * bang can tang va thap than khop thu vien, 3.000 la so GIA (luat 1): du loi, khong cau trong, chu dung quy uoc, ket moi dau 10–40 %,
 * hai la so khac nhau trung it cau.
 */
import { LunarUtil } from 'lunar-typescript';
import { CAN, CHI } from '../src/loi/amLich.ts';
import { tinhBatTu, type BatTu, type Tru, type VanNam } from '../src/loi/batTu.ts';
import {
  NGUONG_NAM, NGUONG_VAN, NGUONG_VIEC, TANG, dsVanBT, hopXung, luanNamBT, luanViec, phanTich, than, tongLuanBT,
} from '../src/loi/batTuLuan.ts';
import { NAM, THAP_THAN, VIEC } from '../src/loi/batTuLuanLoi.ts';
import { hv } from '../src/loi/hanViet/index.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';

const so = (gz: string): readonly [number, number] => [CAN.indexOf(gz.charAt(0)), CHI.indexOf(gz.charAt(1))];
const van = (gz: string, dangChay = false): VanNam & { tuoi: number; batDau: { nam: number; thang: number; ngay: number }; dangChay: boolean } => ({
  canChi: `${hv('can', gz.charAt(0))} ${hv('chi', gz.charAt(1))}`, thapThan: ['', ''], tang: hv('can', CAN.charAt(TANG[so(gz)[1]]?.[0] ?? 0)),
  so: so(gz), tuoi: 1, batDau: { nam: 2000, thang: 1, ngay: 1 }, dangChay,
});
/** La so dung tay tu bon can chi (chu Han); cac truong may luan khong dung thi de trong. */
function gia(tru: readonly [string, string, string, string | null], namNay = '丙午', daiVan = '甲子'): BatTu {
  const lap = (gz: string): Tru => ({ can: hv('can', gz.charAt(0)), chi: hv('chi', gz.charAt(1)), thapThan: '', tangCan: [], napAm: '', truongSinh: '', so: so(gz) });
  return {
    tru: [lap(tru[0]), lap(tru[1]), lap(tru[2]), tru[3] === null ? null : lap(tru[3])],
    nhatChu: '', nghiaNhatChu: 'Lời nhật chủ thử.', khongVong: '', nguHanh: [], nhomHanh: [], khoiVan: { nam: 1, thang: 0, ngay: 0 }, thuan: true,
    daiVan: [van(daiVan, true)], namNay: van(namNay), ghiChu: [],
  };
}

describe('luan bat tu: la dung tay', () => {
  test('tong Quan Sat: Giap khong goc, khong can giup, Kim vuong (Tan Dau | Dinh Dau | Giap Tuat | Canh Ngo)', () => {
    const p = phanTich(gia(['辛酉', '丁酉', '甲戌', '庚午']));
    expect([p.coGoc, p.canGiup, p.muc, p.tong, p.lyDo, p.hy.join(' ')]).toEqual([false, false, 0, 3, 'tong', '-1 0 0.5 1 -1']);
    // Lenh thang Dau: chinh khi Tan lo o can nam → Chinh Quan cach; Dinh (Thuong Quan) lo, khong An che → pha.
    expect([p.cach, p.cachKet]).toEqual([7, 'bai']);
  });

  test('chuyen vuong: Giap gap Moc Thuy, khong Kim, Tai gan khong (Nham Dan | Quy Mao | Giap Dan | At Hoi)', () => {
    const p = phanTich(gia(['壬寅', '癸卯', '甲寅', '乙亥']));
    expect([p.muc, p.chuyenVuong, p.lyDo, p.hy.join(' ')]).toEqual([5, true, 'chuyen', '1 0.5 -0.5 -1 0.5']);
    expect([p.cach, p.cachKet]).toEqual([11, 'bai']); // thang Mao la Duong Nhan cua Giap, khong Quan Sat che
  });

  test('dieu hau: Canh sinh thang Ngo, la so khong mot chu Thuy → Thuy (Thuc Thuong) len dung than, dung truoc', () => {
    const b = gia(['丙午', '甲午', '庚午', '丙戌']);
    const p = phanTich(b);
    expect([p.dieuHau, p.lyDo, p.hy.join(' ')]).toEqual([4, 'nhuocQuan', '0.5 1 -0.5 -1 1']);
    expect(tongLuanBT(b, p)[2]?.loi[0]).toMatch(/^Hành hợp nhất \(dụng thần\): Thủy \(Thực Thương\), Thổ \(Ấn\)\. Sinh mùa hè/u);
  });

  test('xung, hop giua cac tru; tam hop du ba chi cong suc hanh', () => {
    const hx = hopXung(gia(['甲子', '丙寅', '戊午', '庚申']));
    expect(hx).toHaveLength(2);
    expect(hx[0]).toMatch(/^Chi Tý – Ngọ \(trụ năm – trụ ngày\) xung nhau: gốc gia đình/u);
    expect(hx[1]).toMatch(/^Chi Dần – Thân \(trụ tháng – trụ giờ\) xung nhau: việc làm/u);
    const b = gia(['壬申', '庚子', '甲辰', '丙寅']);
    expect(hopXung(b).some((x) => x.includes('tam hợp Thủy'))).toBe(true);
    // Doi Thin (ngay) thanh Tuat: mat 1,5 cua tam hop va 0,15 du khi Quy trong Thin (0,1 × trong so chi ngay 1,5).
    const khongHop = phanTich(gia(['壬申', '庚子', '甲戌', '丙寅']));
    expect((phanTich(b).nhomW[4] ?? 0) - (khongHop.nhomW[4] ?? 0)).toBeCloseTo(1.65);
  });

  test('nam: nam tuoi, thien khac dia xung tru ngay; can va chi cung thap than thi gop mot cau', () => {
    const n = luanNamBT(gia(['戊午', '甲寅', '庚子', '丙子'], '丙午', '壬申'));
    expect([n.loi.includes(NAM.tuoi), n.loi.includes(NAM.khacXung), n.loi.filter((l) => l.startsWith('Can Bính')).length]).toEqual([true, true, 1]);
    expect(luanNamBT(gia(['戊午', '甲寅', '庚子', '丙子'], '戊戌')).loi[0]).toMatch(/^Can Mậu và chi Tuất \(khí chính Mậu\) đều là Thiên Ấn/u);
  });
});

/** 3.000 la so GIA rai deu 1950–2009, 1/10 khong ro gio, nam xem 2020–2031 (LCG hat co dinh, cung cach do nguong). */
const MAU: readonly { b: BatTu; hs: HoSo }[] = (() => {
  let hat = 20261102;
  const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return Math.floor((hat / 2 ** 31) * n); };
  const hai = (n: number): string => String(n).padStart(2, '0');
  return Array.from({ length: 3000 }, (_, i) => {
    const nam = 1950 + r(60), thang = 1 + r(12), ngay = 1 + r(28), coGio = r(10) > 0;
    const hs: HoSo = { id: 'a', ten: 'Giả', gioiTinh: r(2) === 0 ? 'nam' : 'nu', ngaySinh: `${String(nam)}-${hai(thang)}-${hai(ngay)}`,
      gioSinh: coGio ? `${hai(r(24))}:${hai(r(60))}` : null, noiSinh: 'Hà Nội' };
    return { hs, b: tinhBatTu(hs, tinhHoSo(hs, undefined, { doiVeGio7: false }).chinh, { nam: 2020 + (i % 12), thang: 6, ngay: 1 }) };
  });
})();

/** Loi chu theo quy uoc (`docs/QUY_UOC.md` muc 10), nhu `tests/LoiGiai.test.ts`. */
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : null);

describe('luan bat tu: 3.000 la so gia', () => {
  test('bang can tang khop thu vien; thap than may tinh khop thap than thu vien tren moi tru', () => {
    expect(TANG.map((t) => t.map((c) => CAN.charAt(c)).join(''))).toEqual(TANG.map((_, z) => (LunarUtil.ZHI_HIDE_GAN[CHI.charAt(z)] ?? []).join('')));
    const lech = MAU.slice(0, 500).flatMap(({ b }) => b.tru.flatMap((t, i) => {
      if (t === null || i === 2) return [];
      const n = b.tru[2]?.so[0] ?? 0;
      return THAP_THAN[than(n, t.so[0])] === t.thapThan ? [] : [`${t.can} ${t.chi}: ${THAP_THAN[than(n, t.so[0])] ?? ''} / ${t.thapThan}`];
    }));
    expect(lech).toEqual([]);
  });

  test('du 6 doan tong luan, 7 viec, 8 van, nam; khong cau trong, chu dung quy uoc; khong gio thi con cai noi ro', () => {
    const sai: string[] = [];
    for (const { b, hs } of MAU) {
      const p = phanTich(b);
      const tl = tongLuanBT(b, p), viec = luanViec(b, hs.gioiTinh, p);
      expect([tl.length, viec.length, dsVanBT(b, p).length]).toEqual([6, 7, 8]);
      const tieuDe = tl.map((d) => d.tieuDe);
      for (const l of [...tieuDe, ...tl.flatMap((d) => d.loi), ...viec.flatMap((v) => v.loi), ...luanNamBT(b, p).loi]) {
        const loi = l.length < 20 && !tieuDe.includes(l) && !l.startsWith('Năm nay') ? 'ngan qua' : saiChu(l);
        if (loi !== null) sai.push(`${hs.ngaySinh}: ${loi} — ${l.slice(0, 60)}`);
      }
      if (b.tru[3] === null && !viec.some((v) => v.loi.includes(VIEC.khongGio))) sai.push(`${hs.ngaySinh}: khong gio ma con cai khong noi`);
    }
    expect(sai.slice(0, 10)).toEqual([]);
  });

  test('phan bo: than moi dau (rat nhuoc, rat vuong) 5–20 %, tong / chuyen vuong hiem; ket moi viec, van, nam moi dau 10–40 %', () => {
    const ps = MAU.map(({ b }) => phanTich(b));
    const ti = (f: (i: number) => boolean): number => MAU.filter((_, i) => f(i)).length / MAU.length;
    expect([0, 5].map((m) => ti((i) => ps[i]?.muc === m)).every((x) => x >= 0.05 && x <= 0.2)).toBe(true);
    expect([ti((i) => ps[i]?.tong !== null), ti((i) => ps[i]?.chuyenVuong === true)].every((x) => x > 0 && x < 0.02)).toBe(true);
    const viec = MAU.map(({ b, hs }, i) => luanViec(b, hs.gioiTinh, ps[i]));
    const lech = Object.keys(NGUONG_VIEC).flatMap((ten, k) => (['thuan', 'kho'] as const).flatMap((ket) => {
      const x = ti((i) => viec[i]?.[k]?.ket === ket);
      return viec[0]?.[k]?.ten === ten && x >= 0.1 && x <= 0.4 ? [] : [`${ten} ${ket} ${x.toFixed(2)}`];
    }));
    const vans = MAU.flatMap(({ b }, i) => dsVanBT(b, ps[i]).map((v) => v.ket)), nams = MAU.map(({ b }, i) => luanNamBT(b, ps[i]).ket);
    for (const [ten, ds] of [['van', vans], ['nam', nams]] as const) {
      for (const ket of ['thuan', 'kho'] as const) {
        const x = ds.filter((k) => k === ket).length / ds.length;
        if (x < 0.1 || x > 0.4) lech.push(`${ten} ${ket} ${x.toFixed(2)}`);
      }
    }
    expect(lech).toEqual([]);
    expect([NGUONG_VAN.thuan > NGUONG_VAN.kho, NGUONG_NAM.thuan > NGUONG_NAM.kho]).toEqual([true, true]);
  });

  test('khong chung chung: hai la so khac nhau trung trung binh duoi 30 % cau (do 02/11: 14 %)', () => {
    const cau = MAU.slice(0, 400).map(({ b, hs }) => new Set([...tongLuanBT(b).flatMap((d) => d.loi), ...luanViec(b, hs.gioiTinh).flatMap((v) => v.loi.slice(0, -1))]
      .filter((l) => !l.startsWith('Lời về sức khỏe'))));
    let tong = 0;
    for (let i = 0; i < cau.length; i += 2) {
      const a = cau[i] ?? new Set<string>(), c = cau[i + 1] ?? new Set<string>();
      tong += [...a].filter((l) => c.has(l)).length / a.size;
    }
    expect(tong / (cau.length / 2)).toBeLessThan(0.3);
  });
});
