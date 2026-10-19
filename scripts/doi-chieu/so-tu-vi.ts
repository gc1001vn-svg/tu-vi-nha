// So lõi tử vi TypeScript (src/loi/tuVi/laSo.ts) với ansaotuvi Python (lá do tu-vi-py.py sinh) và 5 lá Altuvi (mau-altuvi.json).
// Chạy: python tu-vi-py.py <ra.json> 3000 rồi
//   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-tu-vi.ts <ra.json>
// tests/TuVi.test.ts dùng lại hai hàm so ở đây cho bảng vàng ~200 lá.
import { readFileSync } from 'node:fs';
import { duongSangAm } from '../../src/loi/amLich.ts';
import { lapLaSo, type LaSo, type PhaiTuVi } from '../../src/loi/tuVi/laSo.ts';

/** Một lá của tu-vi-py.py: vao = [ngày, tháng, năm âm, nhuận, chi giờ 0 = Tý, giới]; cung = [tên, đại hạn, chi tiểu hạn, Tuần, Triệt, "id+độ sáng"…]. */
export interface LaPy {
  duong: string;
  vao: [number, number, number, number, number, string];
  menh: number;
  than: number;
  cuc: string;
  menhChu: string;
  thanChu: string;
  cung: [string, number, number, boolean, boolean, string][];
}

/** Sao Altuvi khác ansaotuvi (docs/NGUON_MO.md): Thiên Giải, Phá Toái, Hỏa Tinh, Linh Tinh; năm Canh thêm Khôi, Việt, Hóa Khoa, Hóa Kỵ, Lưu Hà. */
export const LECH_ALTUVI: readonly number[] = [81, 99, 56, 55];
export const LECH_CANH: readonly number[] = [59, 60, 92, 95, 102];

const thuong = (s: string): string => s.normalize('NFC').toLowerCase();
const laNamCanh = (namAm: number): boolean => (namAm + 6) % 10 === 6;

export function lapTuPy(p: LaPy, phai: PhaiTuVi): LaSo {
  const [ngay, thang, nam, , chiGio, gioi] = p.vao;
  return lapLaSo({ ngay, thang, nam, chiGio, gioiTinh: gioi === 'nam' ? 'nam' : 'nu', namXem: nam, phaiTuVi: phai });
}

/** Chỗ lệch giữa lõi TS và ansaotuvi ở một lá. Phái 'altuvi': bỏ qua các sao được phép lệch và mệnh chủ, thân chủ. */
export function soPy(p: LaPy, phai: PhaiTuVi): string[] {
  const ts = lapTuPy(p, phai);
  const boQua = new Set(phai === 'altuvi' ? [...LECH_ALTUVI, ...(laNamCanh(p.vao[2]) ? LECH_CANH : [])] : []);
  const loc = (ds: readonly string[]): string[] => ds.filter((x) => x !== '' && !boQua.has(Number.parseInt(x, 10)));
  const lech: string[] = [];
  const so = (ten: string, py: unknown, may: unknown): void => {
    if (JSON.stringify(py) !== JSON.stringify(may)) lech.push(`${p.duong} ${ten}: py ${JSON.stringify(py)} / ts ${JSON.stringify(may)}`);
  };
  so('mệnh, thân, cục', [p.menh, p.than, thuong(p.cuc)], [ts.menh, ts.than, thuong(ts.cuc)]);
  if (phai === 'ansaotuvi') so('mệnh chủ, thân chủ', [p.menhChu, p.thanChu].map(thuong), [ts.menhChu, ts.thanChu].map(thuong));
  // ansaotuvi chỉ đánh dấu cung đầu của Tuần, Triệt; lõi TS đánh dấu cả hai cung.
  const dau = (k: 3 | 4): number[] => p.cung.flatMap((c, i) => (c[k] ? [i, (i + 1) % 12] : [])).sort((a, b) => a - b);
  so('Tuần, Triệt', [dau(3), dau(4)], [ts.cung.filter((c) => c.tuan).map((c) => c.chi), ts.cung.filter((c) => c.triet).map((c) => c.chi)]);
  p.cung.forEach(([ten, daiHan, tieuHan, , , sao], i) => {
    const c = ts.cung[i];
    so(`cung ${String(i)}`, [thuong(ten), daiHan, tieuHan, loc(sao.split(' '))],
      [thuong(c?.ten ?? ''), c?.daiVan, c?.tieuHan, loc((c?.sao ?? []).map((s) => `${String(s.id)}${s.doSang ?? ''}`))]);
  });
  return lech;
}

export interface CaAltuvi { ten: string; duong: string; gioIztro: number; gioi: string; menh: string; than: string; cuc: string; sao: Record<string, string> }

/** Một lá Altuvi qua lõi TS mặc định: Altuvi giữ giờ nhập (không đổi +7), chọn giờ theo 12 chi; sao đếm như so-altuvi.*. */
export function soAltuvi(c: CaAltuvi): { khop: number; tong: number; lech: string[] } {
  const [nam = 0, thang = 0, ngay = 0] = c.duong.split('-').map(Number);
  const am = duongSangAm({ nam, thang, ngay });
  const ls = lapLaSo({ ngay: am.ngay, thang: am.thang, nam: am.nam, chiGio: c.gioIztro, gioiTinh: c.gioi === 'nam' ? 'nam' : 'nu', namXem: am.nam });
  const chi = (i: number): string => ls.cung[i]?.canChi.split(' ')[1] ?? '?';
  const ts = new Map<string, string>();
  for (const cung of ls.cung) for (const s of cung.sao) if (!ts.has(thuong(s.ten))) ts.set(thuong(s.ten), chi(cung.chi));
  const lech = Object.entries(c.sao).filter(([ten, o]) => ts.get(ten) !== o).map(([ten, o]) => `${c.ten} ${ten}: altuvi ${o} / ts ${ts.get(ten) ?? '—'}`);
  const khung = [[c.menh, chi(ls.menh)], [c.than, chi(ls.than)], [thuong(c.cuc), thuong(ls.cuc)]];
  for (const [o, may] of khung) if (o !== may) lech.push(`${c.ten} mệnh/thân/cục: altuvi ${o ?? ''} / ts ${may ?? ''}`);
  const tong = Object.keys(c.sao).length;
  return { khop: tong - lech.filter((x) => !x.includes('mệnh/thân/cục')).length, tong, lech };
}

if (process.argv[1]?.endsWith('so-tu-vi.ts')) {
  const tep = process.argv[2];
  if (tep === undefined) throw new Error('thiếu file ra của tu-vi-py.py');
  const { la } = JSON.parse(readFileSync(tep, 'utf8')) as { la: LaPy[] };
  for (const phai of ['ansaotuvi', 'altuvi'] as const) {
    const lech = la.map((p) => soPy(p, phai));
    console.log(`phái ${phai}: ${String(lech.filter((x) => x.length === 0).length)}/${String(la.length)} lá khớp`
      + (phai === 'altuvi' ? ' (ngoài 4 nhóm sao đã định, mệnh chủ, thân chủ)' : ' hết (sao, độ sáng, tên cung, đại hạn, tiểu hạn, Tuần, Triệt, cục, mệnh chủ, thân chủ)'));
    for (const x of lech.flat().slice(0, 10)) console.log('  ' + x);
  }
  // Số lá mà từng sao được phép lệch thật sự đổi cung, để thấy 4 nhóm đều có tác dụng.
  const cho = (ls: LaSo, id: number): number => ls.cung.find((c) => c.sao.some((s) => s.id === id))?.chi ?? -1;
  const dem = new Map<number, number>();
  let canh = 0, menhChu = 0;
  for (const p of la) {
    const [a, b] = [lapTuPy(p, 'ansaotuvi'), lapTuPy(p, 'altuvi')];
    if (laNamCanh(p.vao[2])) canh++;
    if (a.menhChu !== b.menhChu || a.thanChu !== b.thanChu) menhChu++;
    for (const id of [...LECH_ALTUVI, ...LECH_CANH]) if (cho(a, id) !== cho(b, id)) dem.set(id, (dem.get(id) ?? 0) + 1);
  }
  const ten = (id: number): string => lapTuPy(la[0] as LaPy, 'altuvi').cung.flatMap((c) => c.sao).find((s) => s.id === id)?.ten ?? String(id);
  console.log(`altuvi khác ansaotuvi: ${[...LECH_ALTUVI, ...LECH_CANH].map((id) => `${ten(id)} ${String(dem.get(id) ?? 0)}`).join(' · ')} lá`
    + ` (năm Canh ${String(canh)} lá) · mệnh chủ/thân chủ ${String(menhChu)} lá`);
  const mau = JSON.parse(readFileSync(new URL('mau-altuvi.json', import.meta.url), 'utf8')) as { ca: CaAltuvi[] };
  const kq = mau.ca.map(soAltuvi);
  console.log(`Altuvi: ${kq.map((k, i) => `${mau.ca[i]?.ten ?? ''} ${String(k.khop)}/${String(k.tong)}`).join(' · ')}`
    + ` · tổng ${String(kq.reduce((s, k) => s + k.khop, 0))}/${String(kq.reduce((s, k) => s + k.tong, 0))}`);
  for (const x of kq.flatMap((k) => k.lech)) console.log('  ' + x);
}
