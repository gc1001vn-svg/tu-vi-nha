/**
 * Loi giai de hieu dot 1 (ke hoach `docs/ke-hoach/2026-11-05-loi-giai-de-hieu.md`, QUY_UOC muc 43): 30 ho so GIA (luat 1) × 3 khoi
 * Tu vi, Bat tu, Chiem tinh. Doan "Nói gọn": 3–5 cau, ≤ 600 ky tu, khong thuat ngu, dung quy uoc chu, ≥ 20 doan khac nhau / 30,
 * ket khop loi luan ben duoi. Giai nghia thuat ngu: lan dau gap trong loi luan duoc chen nghia, khong long ngoac hai tang.
 */
import { tinhBatTu } from '../src/loi/batTu.ts';
import { luanNamBT, luanVanBT, luanViec, phanTich, tongLuanBT } from '../src/loi/batTuLuan.ts';
import { laSoNguoi } from '../src/loi/chiemTinh.ts';
import { diemNha, luanNha, tongLuanCT, vanCT } from '../src/loi/chiemTinhLuan.ts';
import { KET_NHA, NHA_TEN } from '../src/loi/chiemTinhNhaLoi.ts';
import { phutUtcTuMs } from '../src/loi/chiemTinhNgay.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { noiGonBatTu, noiGonChiemTinh, noiGonTuVi, type NoiGon } from '../src/loi/noiGon.ts';
import { THUAT_NGU_BAT_TU, THUAT_NGU_CHIEM_TINH, THUAT_NGU_TU_VI, chenNghia, coThuatNgu, type ThuatNgu } from '../src/loi/thuatNgu.ts';
import { KET_CUNG } from '../src/loi/tuVi/luanCungLoi.ts';
import { CHU_DE } from '../src/loi/tuVi/nghia.ts';
import { SUC_MENH } from '../src/loi/tuVi/luanLoi.ts';
import { tinhTuVi } from '../src/loi/tuVi/laSo.ts';
import { luanCung, luanDaiVan, luanNam, tongLuan } from '../src/loi/tuVi/luan.ts';
import { tinhLuuHan } from '../src/loi/tuVi/luuHan.ts';

const XEM = { nam: 2026, thang: 11, ngay: 5 };
const NAY = phutUtcTuMs(Date.UTC(2026, 10, 5, 3));
const TINH = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Thừa Thiên Huế', 'Cần Thơ', 'Hải Phòng'];

/** 30 ho so gia rai 1950–2015, du gio, du gioi (LCG hat co dinh); 3 ho so khong ro gio. */
const HS: readonly HoSo[] = (() => {
  let hat = 20261105;
  const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return Math.floor((hat / 2 ** 31) * n); };
  const hai = (x: number): string => String(x).padStart(2, '0');
  return Array.from({ length: 30 }, (_, i) => ({
    id: `gia${String(i)}`, ten: 'Người Giả', gioiTinh: i % 2 === 0 ? 'nam' : 'nu',
    ngaySinh: `${String(1950 + r(66))}-${hai(1 + r(12))}-${hai(1 + r(28))}`,
    gioSinh: i % 10 === 9 ? null : `${hai(r(24))}:${hai(r(60))}`, noiSinh: TINH[i % TINH.length] ?? 'Hà Nội',
  }));
})();

interface Khoi { readonly ten: string; readonly ng: NoiGon; readonly luan: readonly string[] }
const KHOI: readonly (readonly [string, readonly ThuatNgu[]])[] = [['tuVi', THUAT_NGU_TU_VI], ['batTu', THUAT_NGU_BAT_TU], ['chiemTinh', THUAT_NGU_CHIEM_TINH]];

/** Moi ho so: ba khoi, "Nói gọn" va loi luan (theo thu tu doc trong khoi) de kiem khop, giai nghia. */
const MAU: readonly Khoi[][] = HS.map((hs) => {
  const tr = tinhHoSo(hs);
  const kq = tr.chinh;
  const raTv = tinhTuVi(hs, kq, XEM, 6);
  if (raTv === 'canChonGio') throw new Error('gio gia dinh');
  const ls = raTv, lh = tinhLuuHan(ls, kq.am.thang, XEM), namAm = kq.am.nam;
  const tv: Khoi = { ten: 'tuVi', ng: noiGonTuVi(ls, lh, namAm), luan: [
    ...(ls.daiVanNay === null ? [] : luanDaiVan(ls, ls.daiVanNay, namAm).loi), ...luanNam(ls, lh, namAm).loi,
    ...tongLuan(ls, namAm).flatMap((d) => d.loi), ...luanCung(ls, ls.menh, namAm)] };
  const b = tinhBatTu(hs, kq, XEM), p = phanTich(b), van = b.daiVan.find((v) => v.dangChay);
  const bt: Khoi = { ten: 'batTu', ng: noiGonBatTu(b, p, hs.gioiTinh), luan: [...tongLuanBT(b, p).flatMap((d) => d.loi),
    ...luanViec(b, hs.gioiTinh, p).flatMap((v) => v.loi), ...(van === undefined ? [] : luanVanBT(b, van, p).loi), ...luanNamBT(b, p).loi] };
  const r = laSoNguoi(hs);
  const ct: Khoi = { ten: 'chiemTinh', ng: noiGonChiemTinh(r.laSo, r.phut, NAY), luan: [...tongLuanCT(r.laSo).flatMap((d) => d.loi),
    ...vanCT(r.laSo, r.phut, NAY).loi, ...(r.laSo.nha === null ? [] : NHA_TEN.flatMap((_, i) => luanNha(r.laSo, i + 1)))] };
  return [tv, bt, ct];
});

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || /undefined|NaN|\.\.|\{\}/u.test(v) ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('loi giai de hieu: doan "Nói gọn"', () => {
  test('3–5 cau, ≤ 600 ky tu, dung quy uoc chu, khong thuat ngu cua ca ba mon', () => {
    const sai: string[] = [], dai: Record<string, number[]> = {};
    for (const ba of MAU) {
      for (const k of ba) {
        const chu = k.ng.cau.join(' ');
        (dai[k.ten] ??= []).push(chu.length);
        if (k.ng.cau.length < 3 || k.ng.cau.length > 5) sai.push(`${k.ten}: ${String(k.ng.cau.length)} cau`);
        if (chu.length > 600) sai.push(`${k.ten}: dai ${String(chu.length)}`);
        const e = saiChu(chu);
        if (e !== null) sai.push(`${k.ten}: ${e} — ${chu}`);
        const tn = KHOI.flatMap(([, bang]) => coThuatNgu(chu, bang));
        if (tn.length > 0) sai.push(`${k.ten}: thuat ngu ${tn.join(', ')} — ${chu}`);
      }
    }
    // In do dai (thuoc: ke hoach muc "Cách đo").
    console.log(Object.entries(dai).map(([t, d]) => `${t} ${String(Math.min(...d))}–${String(Math.max(...d))} ky tu`).join(' · '));
    expect(sai.slice(0, 5)).toEqual([]);
  });

  test('moi cau dua mot so rieng cua la so: 30 ho so ra ≥ 20 doan khac nhau moi khoi', () => {
    for (let i = 0; i < 3; i++) {
      const khac = new Set(MAU.map((ba) => ba[i]?.ng.cau.join(' ') ?? ''));
      expect([KHOI[i]?.[0], khac.size >= 20]).toEqual([KHOI[i]?.[0], true]);
    }
  });

  test('ket "Nói gọn" khop loi luan ben duoi', () => {
    const sai: string[] = [];
    HS.forEach((hs, j) => {
      const [tv, bt, ct] = MAU[j] ?? [];
      const coCau = (k: Khoi | undefined, cau: string): boolean => k?.luan.includes(cau) === true;
      // Tu vi: the Menh, chang 10 nam, nam; cung manh / yeu ra dung cau ket cung.
      const the = tv?.ng.ket.the as keyof typeof SUC_MENH;
      if (!coCau(tv, SUC_MENH[the])) sai.push(`${hs.id} tu vi the ${the}`);
      const tr = tinhHoSo(hs), ls = tinhTuVi(hs, tr.chinh, XEM, 6);
      if (ls !== 'canChonGio') {
        const dv = ls.daiVanNay === null ? 'chua' : luanDaiVan(ls, ls.daiVanNay, tr.chinh.am.nam).ket;
        if (tv?.ng.ket.dv !== dv) sai.push(`${hs.id} tu vi dai van`);
        if (tv?.ng.ket.nam !== luanNam(ls, tinhLuuHan(ls, tr.chinh.am.thang, XEM), tr.chinh.am.nam).ket) sai.push(`${hs.id} tu vi nam`);
        for (const ten of (tv?.ng.ket.tot ?? '').split('|').filter((x) => x !== '')) {
          const c = ls.cung.find((x) => x.ten === ten);
          if (c === undefined || !luanCung(ls, c.chi, tr.chinh.am.nam).some((l) => l === KET_CUNG.tot.replace('{}', CHU_DE[ten] ?? ''))) sai.push(`${hs.id} tu vi cung ${ten}`);
        }
      }
      const b = tinhBatTu(hs, tr.chinh, XEM), p = phanTich(b), viec = luanViec(b, hs.gioiTinh, p);
      if (bt?.ng.ket.thuan !== viec.filter((v) => v.ket === 'thuan').map((v) => v.ten.toLowerCase()).join('|')) sai.push(`${hs.id} bat tu viec`);
      if (bt?.ng.ket.nam !== luanNamBT(b, p).ket) sai.push(`${hs.id} bat tu nam`);
      // Bat tu: viec thuan / kho dung ket luan tung viec; hanh hop dung "Hành hợp nhất".
      if (bt !== undefined && !bt.luan.some((l) => l.startsWith(`Hành hợp nhất (dụng thần): ${bt.ng.ket.hanh ?? ''}`))) sai.push(`${hs.id} bat tu hanh`);
      // Chiem tinh: nha manh / yeu ra dung cau ket nha; van 12 thang.
      const r = laSoNguoi(hs);
      for (const t of (ct?.ng.ket.tot ?? '').split('|').filter((x) => x !== '')) {
        const n = NHA_TEN.findIndex((x) => x.toLowerCase() === t) + 1;
        if (!luanNha(r.laSo, n).includes(KET_NHA.tot.replace('{}', t))) sai.push(`${hs.id} chiem tinh nha ${t} ${String(diemNha(r.laSo, n))}`);
      }
      if (ct?.ng.ket.van !== vanCT(r.laSo, r.phut, NAY).ket) sai.push(`${hs.id} chiem tinh van`);
    });
    expect(sai).toEqual([]);
    expect(KET_CUNG.tot.includes('{}')).toBe(true);
  });
});

describe('loi giai de hieu: giai nghia thuat ngu lan dau gap', () => {
  test('thuat ngu co trong loi luan duoc giai nghia; khong long ngoac hai tang; chu dung quy uoc', () => {
    const sai: string[] = [];
    let co = 0, giai = 0;
    for (const ba of MAU) {
      ba.forEach((k, i) => {
        const bang = KHOI[i]?.[1] ?? [];
        const daGap = new Set<string>();
        const ra = k.luan.map((l) => chenNghia(l, bang, daGap));
        const coKhoa = new Set(k.luan.flatMap((l) => coThuatNgu(l, bang)).map((m) => bang.find((t) => new RegExp(`^(?:${t.mau})$`, 'iu').test(m))?.khoa));
        co += coKhoa.size;
        giai += [...coKhoa].filter((x) => x !== undefined && daGap.has(x)).length;
        const lien = (x: string): number => x.split(') (').length;
        ra.forEach((x, j) => {
          if (/\([^()]*\([^()]*\([^()]*\)/u.test(x)) sai.push(`${k.ten}: long ngoac — ${x.slice(0, 160)}`);
          if (lien(x) > lien(k.luan[j] ?? '')) sai.push(`${k.ten}: hai ngoac lien — ${x.slice(0, 160)}`);
          const e = saiChu(x);
          if (e !== null) sai.push(`${k.ten}: ${e}`);
        });
      });
    }
    console.log(`thuat ngu gap ${String(co)}, da giai nghia ${String(giai)} (${String(Math.round(giai / co * 100))} %)`);
    expect(sai.slice(0, 5)).toEqual([]);
    expect(giai / co).toBeGreaterThan(0.9);
  });

  test('chen dung cho: ngoai ngoac, cuoi ngoac, da co nghia, mau thay', () => {
    const g = new Set<string>();
    expect(chenNghia('Vũ Khúc (hãm địa): dễ vướng. Phá Quân (hãm địa): hao.', THUAT_NGU_TU_VI, g))
      .toBe('Vũ Khúc (hãm địa, tức sao đứng chỗ không hợp nên yếu, dễ ra mặt xấu): dễ vướng. Phá Quân (hãm địa): hao.');
    expect(chenNghia('nơi xa thịnh vượng', THUAT_NGU_TU_VI, new Set())).toBe('nơi xa thịnh vượng');
    expect(chenNghia('Mệnh vô chính diệu (không có sao chính)', THUAT_NGU_TU_VI, new Set())).toBe('Mệnh (cung gốc, nói về chính mình) vô chính diệu (không có sao chính)');
    expect(chenNghia('Mặt Trời đối Mặt Trăng (lệch 1,7°): giằng co.', THUAT_NGU_CHIEM_TINH, new Set()))
      .toBe('Mặt Trời đối (cách nhau 180°: hai bên giằng co) Mặt Trăng (lệch 1,7° — số độ càng nhỏ, ảnh hưởng càng rõ): giằng co.');
    expect(chenNghia('mùa của hành mình sinh ra — thất lệnh (hưu), sức tiết ra ngoài.', THUAT_NGU_BAT_TU, new Set()))
      .toBe('mùa của hành mình sinh ra — thất lệnh (hưu — sinh không đúng mùa của hành mình nên yếu đi), sức tiết ra ngoài.');
  });
});
