/**
 * Loi giai de hieu dot 2 (QUY_UOC muc 44): doan "Nói gọn" 11 mon con lai, moi mon 30 ca GIA (ho so gia, que / la / cau / khung
 * rut theo LCG hat co dinh). Kiem: co cau, ≤ 600 ky tu, dung quy uoc chu, khong chu mon (mon cau soan moi) hoac chu mon da giai nghia
 * (mon lay cau tu loi chot), nhieu doan khac nhau, ket khop loi luan ben duoi.
 */
import { batTrach } from '../src/loi/batTrach.ts';
import { CAC_DUONG, KHUNG, type Duong, type KhungChiTay } from '../src/loi/chiTay.ts';
import { luanTay } from '../src/loi/chiTayLuan.ts';
import type { DoanLuan } from '../src/loi/chiemTinhLuan.ts';
import { VIEC, chonNgay, type Viec } from '../src/loi/chonNgay.ts';
import { luanThang } from '../src/loi/chonNgayLuan.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import { SO_CAP, queKieu } from '../src/loi/kieu.ts';
import { luanKieu } from '../src/loi/kieuLuan.ts';
import { gieo, type Hao } from '../src/loi/kinhDich.ts';
import { luanQue } from '../src/loi/kinhDichLuan.ts';
import { namNay } from '../src/loi/namNay.ts';
import { luanNamNay } from '../src/loi/namNayLuan.ts';
import { KET as KET_NAM, VIEC as VIEC_NAM } from '../src/loi/namNayLuanLoi.ts';
import type { NoiGon } from '../src/loi/noiGon.ts';
import { CHON, THEM_KINH_DICH, noiGonHuong, noiGonNamNay, noiGonThanSo, noiGonTuLuan, noiGonTuoi } from '../src/loi/noiGonMon.ts';
import { phiTinh } from '../src/loi/phiTinh.ts';
import { luanPhiTinh } from '../src/loi/phiTinhLuan.ts';
import { thanSo } from '../src/loi/soHoc.ts';
import { tongLuanTS } from '../src/loi/soHocLuan.ts';
import { rutBai } from '../src/loi/tarot.ts';
import { luanTarot } from '../src/loi/tarotLuan.ts';
import {
  THUAT_NGU_CHON_NGAY, THUAT_NGU_HUONG, THUAT_NGU_KIEU, THUAT_NGU_KINH_DICH, THUAT_NGU_MAT, THUAT_NGU_NAM_NAY, THUAT_NGU_PHI_TINH, THUAT_NGU_TAROT,
  THUAT_NGU_TAY, THUAT_NGU_THAN_SO, THUAT_NGU_TUOI, chenNghia, coThuatNgu, type ThuatNgu,
} from '../src/loi/thuatNgu.ts';
import type { SoDoMat } from '../src/loi/tuongMat.ts';
import { CAC_KHOA, MAU } from '../src/loi/tuongMatGiai.ts';
import { luanMat } from '../src/loi/tuongMatLuan.ts';
import { luanTuoi } from '../src/loi/tuoiHopLuan.ts';
import { MUC } from '../src/loi/tuoiHopLuanLoi.ts';

const XEM = { nam: 2026, thang: 11, ngay: 5 };
const TINH = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Thừa Thiên Huế', 'Cần Thơ', 'Hải Phòng'];
let hat = 20261106;
const r = (n: number): number => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return Math.floor((hat / 2 ** 31) * n); };
const hai = (x: number): string => String(x).padStart(2, '0');
const N = 30;
const HS: readonly HoSo[] = Array.from({ length: N }, (_, i) => ({
  id: `gia${String(i)}`, ten: 'Người Giả', gioiTinh: i % 2 === 0 ? 'nam' : 'nu',
  ngaySinh: `${String(1945 + r(75))}-${hai(1 + r(12))}-${hai(1 + r(28))}`, gioSinh: `${hai(r(24))}:${hai(r(60))}`,
  noiSinh: TINH[i % TINH.length] ?? 'Hà Nội', ...(i % 3 === 0 ? {} : { huongNha: r(360) }),
}));

/** Mot ca: doan "Nói gọn", loi luan ben duoi (null: mon cau soan moi khong lay tu luan). */
interface Ca { readonly ng: NoiGon & { readonly dung?: readonly string[] }; readonly luan: readonly DoanLuan[] }
type Mon = readonly [string, readonly ThuatNgu[], boolean, readonly Ca[]];

const khungTay = (): KhungChiTay => ({ simian: r(8) === 0,
  duong: Object.fromEntries(CAC_DUONG.map((d: Duong) => [d, Object.fromEntries((Object.entries(KHUNG[d]) as [string, readonly unknown[]][])
    .map(([k, v]) => [k, v[r(v.length)] ?? null]))])) as unknown as KhungChiTay['duong'] });
const VIECS = Object.keys(VIEC) as Viec[];

/** [ten, bang thuat ngu, lay cau tu luan?, 30 ca]. */
const MON: readonly Mon[] = [
  ['namNay', THUAT_NGU_NAM_NAY, false, HS.map((hs) => { const n = namNay(hs, tinhHoSo(hs).chinh, XEM); return { ng: noiGonNamNay(n), luan: luanNamNay(n) }; })],
  ['huong', THUAT_NGU_HUONG, false, HS.map((hs) => ({ ng: noiGonHuong(tinhHoSo(hs).chinh.cungPhi, hs.huongNha), luan: [] }))],
  ['tuoi', THUAT_NGU_TUOI, false, HS.map((hs) => { const c = tinhHoSo(hs).chinh.chiNam; return { ng: noiGonTuoi(c), luan: luanTuoi(c) }; })],
  ['thanSo', THUAT_NGU_THAN_SO, false, HS.map((hs) => {
    const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number), t = thanSo({ nam, thang, ngay }, XEM);
    return { ng: noiGonThanSo(t), luan: tongLuanTS(t, { nam, thang, ngay }) };
  })],
  ['kinhDich', THUAT_NGU_KINH_DICH, true, Array.from({ length: N }, () => {
    const l = luanQue(gieo(Array.from({ length: 6 }, () => (6 + r(4)) as Hao)));
    return { ng: noiGonTuLuan(l, CHON.kinhDich, [THEM_KINH_DICH]), luan: l };
  })],
  ['tarot', THUAT_NGU_TAROT, true, Array.from({ length: N }, (_, i) => {
    const kieu = (['motLa', 'baLa', 'thapTu'] as const)[i % 3] ?? 'baLa', so = kieu === 'motLa' ? 1 : kieu === 'baLa' ? 3 : 10;
    const l = luanTarot(kieu, rutBai(Array.from({ length: 2 * so }, () => r(2 ** 32)), so, true));
    return { ng: noiGonTuLuan(l, CHON.tarot), luan: l };
  })],
  ['kieu', THUAT_NGU_KIEU, true, Array.from({ length: N }, (_, i) => { const l = luanKieu(queKieu(r(SO_CAP)), i % 18); return { ng: noiGonTuLuan(l, CHON.kieu), luan: l }; })],
  ['mat', THUAT_NGU_MAT, true, Array.from({ length: N }, () => {
    const so = Object.fromEntries(CAC_KHOA.map((k) => [k, MAU[k][r(MAU[k].length)] ?? 0])) as unknown as SoDoMat;
    const l = luanMat({ so, cuoi: 0 }) ?? [];
    return { ng: noiGonTuLuan(l, CHON.mat), luan: l };
  })],
  ['tay', THUAT_NGU_TAY, true, Array.from({ length: N }, () => { const l = luanTay(khungTay()); return { ng: noiGonTuLuan(l, CHON.tay), luan: l }; })],
  ['chonNgay', THUAT_NGU_CHON_NGAY, true, Array.from({ length: N }, (_, i) => {
    const v = VIECS[i % VIECS.length] ?? 'cuoiHoi', l = luanThang(v, chonNgay(v, 2026, 1 + (i % 12), i % 4 === 0 ? undefined : r(12)));
    return { ng: noiGonTuLuan(l, CHON.chonNgay), luan: l };
  })],
  ['phiTinh', THUAT_NGU_PHI_TINH, true, Array.from({ length: N }, (_, i) => {
    const l = luanPhiTinh(phiTinh({ nam: 2000 + i, thang: 1 + r(12), ngay: 1 + r(28) }));
    return { ng: noiGonTuLuan(l, CHON.phiTinh), luan: l };
  })],
];

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || /undefined|NaN|\.\.|\{\}/u.test(v) ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);
const khoaCua = (bang: readonly ThuatNgu[], m: string): string | undefined => bang.find((t) => new RegExp(`^(?:${t.mau})$`, 'iu').test(m))?.khoa;

describe('loi giai de hieu dot 2: doan "Nói gọn" 11 mon', () => {
  test('co cau, ≤ 600 ky tu, dung quy uoc chu; chu mon: khong co (cau soan moi) hoac da giai nghia (cau lay tu loi chot)', () => {
    const sai: string[] = [], dai: string[] = [];
    let gap = 0, giai = 0;
    for (const [ten, bang, tuLuan, ca] of MON) {
      const d = ca.map((c) => c.ng.cau.join(' ').length);
      dai.push(`${ten} ${String(Math.min(...d))}–${String(Math.max(...d))}`);
      for (const c of ca) {
        const chu = c.ng.cau.join(' ');
        if (c.ng.cau.length === 0 || c.ng.cau.length > 5) sai.push(`${ten}: ${String(c.ng.cau.length)} cau`);
        if (chu.length > 600) sai.push(`${ten}: dai ${String(chu.length)} — ${chu.slice(0, 80)}`);
        const e = saiChu(chu);
        if (e !== null) sai.push(`${ten}: ${e} — ${chu}`);
        const tn = coThuatNgu(chu, bang);
        // Cau soan moi: chu mon chi duoc dung khi da kem nghia trong ngoac ngay sau (chenNghia de nguyen).
        if (!tuLuan && chenNghia(chu, bang, new Set()) !== chu) sai.push(`${ten}: thuat ngu ${tn.join(', ')} — ${chu}`);
        if (tuLuan) {
          const daGap = new Set<string>();
          for (const x of c.ng.cau) chenNghia(x, bang, daGap);
          const k = new Set(tn.map((m) => khoaCua(bang, m)));
          gap += k.size;
          giai += [...k].filter((x) => x !== undefined && daGap.has(x)).length;
        }
      }
    }
    console.log(`do dai: ${dai.join(' · ')}; thuat ngu trong "Nói gọn" lay tu loi chot: ${String(giai)}/${String(gap)} da giai nghia`);
    expect(sai.slice(0, 5)).toEqual([]);
    expect(giai / Math.max(1, gap)).toBeGreaterThan(0.8);
  });

  test('khong chung chung: ≥ 20 doan khac nhau / 30 (tuoi: bang so con giap khac nhau; nam nay ≥ 15)', () => {
    for (const [ten, , , ca] of MON) {
      const khac = new Set(ca.map((c) => c.ng.cau.join(' '))).size;
      const can = ten === 'tuoi' ? new Set(HS.map((hs) => tinhHoSo(hs).chinh.chiNam)).size : ten === 'namNay' ? 15 : 20;
      expect([ten, khac >= can, khac]).toEqual([ten, true, khac]);
    }
  });

  test('ket khop loi luan ben duoi', () => {
    const sai: string[] = [];
    for (const [ten, , tuLuan, ca] of MON) {
      ca.forEach((c, i) => {
        const cau = c.luan.flatMap((d) => d.loi);
        // Lay tu loi chot: moi cau goc deu co trong luan, cau "Kết:" (neu luan co) da len "Nói gọn".
        if (tuLuan) {
          if ((c.ng.dung ?? []).some((l) => !cau.includes(l))) sai.push(`${ten} ${String(i)}: cau khong co trong luan`);
          if (cau.some((l) => l.startsWith('Kết: ')) && c.ng.ket.ket === '') sai.push(`${ten} ${String(i)}: thieu ket`);
        }
      });
    }
    HS.forEach((hs) => {
      const kq = tinhHoSo(hs).chinh, n = namNay(hs, kq, XEM), ng = noiGonNamNay(n);
      if (luanNamNay(n)[0]?.loi[0] !== KET_NAM[ng.ket.ket as keyof typeof KET_NAM]) sai.push(`${hs.id} nam nay ket`);
      const viec = luanNamNay(n).find((d) => d.tieuDe === 'Việc lớn trong năm')?.loi ?? [];
      if (n.tuoiMu >= 10 && (ng.ket.hoan?.includes('làm nhà') ?? false) !== (viec[0] !== VIEC_NAM.nhaDuoc)) sai.push(`${hs.id} nam nay lam nha`);
      const h = noiGonHuong(kq.cungPhi, hs.huongNha);
      if (h.ket.tot !== batTrach(kq.cungPhi).huong.find((x) => x.sao === 'Sinh Khí')?.huong) sai.push(`${hs.id} huong`);
      const t = noiGonTuoi(kq.chiNam), rat = luanTuoi(kq.chiNam)[0]?.loi[0] ?? '';
      if (rat !== MUC.rat((t.ket.rat ?? '').split('|').join(', '))) sai.push(`${hs.id} tuoi`);
    });
    expect(sai.slice(0, 5)).toEqual([]);
  });

  test('chen nghia vao "Nói gọn" va loi luan: khong long ngoac hai tang, khong hai ngoac lien moi, chu dung quy uoc', () => {
    const sai: string[] = [];
    for (const [ten, bang, , ca] of MON) {
      for (const c of ca) {
        const goc = [...c.ng.cau, ...c.luan.flatMap((d) => d.loi)], daGap = new Set<string>();
        const lien = (x: string): number => x.split(') (').length;
        goc.forEach((x) => {
          const y = chenNghia(x, bang, daGap);
          if (/\([^()]*\([^()]*\([^()]*\)/u.test(y)) sai.push(`${ten}: long ngoac — ${y.slice(0, 160)}`);
          if (lien(y) > lien(x)) sai.push(`${ten}: hai ngoac lien — ${y.slice(0, 160)}`);
          const e = saiChu(y);
          if (e !== null) sai.push(`${ten}: ${e} — ${y.slice(0, 160)}`);
        });
      }
    }
    expect(sai.slice(0, 5)).toEqual([]);
  });
});
