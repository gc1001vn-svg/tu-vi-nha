/**
 * Luan chi tay (`src/loi/chiTayLuan.ts`; viet lai 09/11, ke hoach `2026-11-09-loi-giai-chi-tay-nguon.md`). Ca dung tay; thuoc tren
 * 3.000 ban tay gia (ba duong chinh ro / mo chia doi, o khac chia deu, chi tay ngang 5 %): moi cau co sach trong bang, khong cap cau
 * choi nhau, bot chung chung (trung giua hai tay, cau pho bien, cau ghep), ro / mo tren anh khong cham nang, moi gia tri o deu duoc
 * luan va co dong trong bang nguon `docs/LUAN_CHI_TAY.md`. So nen ban cu (02/11) ghi trong ke hoach.
 */
import { readFileSync } from 'node:fs';
import { CAC_DUONG, KHUNG, type Duong, type KhungChiTay } from '../src/loi/chiTay.ts';
import { dauTay, luanTay, luanTayY, oDoc, type YTay } from '../src/loi/chiTayLuan.ts';
import { CHUA_DU, CHUA_NGHIEP, CHUA_QUANG, NET, NGANG_Y, NHAC, SACH, SUC_NHAC, TRI_KHONG, cau } from '../src/loi/chiTayLuanLoi.ts';

const o = (d: Duong): [string, readonly unknown[]][] => Object.entries(KHUNG[d]) as [string, readonly unknown[]][];
type Chon = Partial<Record<Duong, Record<string, string | boolean | null>>>;
const khung = (c: Chon, simian: boolean | null = false): KhungChiTay => ({ simian,
  duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k]) => [k, c[d]?.[k] ?? null]))])) as unknown as KhungChiTay['duong'] });
const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || /undefined|NaN|\.\.|\{\}/u.test(v) ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

const tot: Chon = { life: { seen: 'clear', length: 'long', arc: 'wide', broken: false },
  head: { seen: 'clear', length: 'long', shape: 'straight', joined: true, broken: false },
  heart: { seen: 'clear', length: 'medium', broken: false }, fate: { seen: 'clear', start: 'wrist', broken: false } };
const xau: Chon = { life: { seen: 'faint', length: 'short', arc: 'narrow', broken: true }, head: { seen: 'faint', length: 'short', shape: 'curved',
  joined: false, broken: true }, heart: { seen: 'faint', length: 'short', broken: true }, fate: { seen: 'faint', start: 'middle', broken: true } };

/** Cau co dinh (loi dan, bao may chua do) — khong phai y luan, khong can sach. */
const CO_DINH = new Set<string>([...NHAC, SUC_NHAC, CHUA_DU, CHUA_NGHIEP, CHUA_QUANG]);
/** Cap y choi nhau: hai cau khac nhau trong cung loi giai, mot cau khop ve trai, mot cau khop ve phai. */
const CHOI: readonly (readonly [RegExp, RegExp, string])[] = [
  [/sáng tạo|tưởng tượng mạnh/u, /tay chân/u, 'sang tao <> viec tay chan'],
  [/dồi dào|dẻo dai|sinh lực mạnh/u, /sức có hạn|không dồi dào|sức bền kém/u, 'suc ben tot <> kem'],
  [/tự quyết từ sớm|tự nghĩ, tự quyết từ sớm|sớm biết tự nghĩ/u, /tự quyết muộn|chưa dám tự quyết|quen dựa vào/u, 'tu quyet som <> muon'],
  [/chung thủy|thương lý tưởng|yêu hết mình/u, /tình cảm nhạt|hờ hững/u, 'tinh sau <> nhat'],
  [/đi một mạch|bền một hướng|ít biến động|liền mạch/u, /đổi hẳn hướng|đổi hướng lớn|lên xuống nhiều lần|một lần đổi hướng/u, 'mot huong <> doi huong'],
  [/thận trọng|hay lo xa/u, /quyết nhanh|hấp tấp/u, 'than trong <> hap tap'],
  [/tình thường thắng/u, /lý trí thường (thắng|dẫn đường)/u, 'tinh thang <> ly thang'],
  [/nền sẵn có tốt|cứ thế mà đi/u, /cần giữ nhất|bồi đắp/u, 'nen tot <> can giu'],
];
const TEN_SACH = Object.keys(SACH);
/** Nguon cuoi cau: "(theo A, B)." hoac "(ghép ý A, B)."; tra ten sach hoac null khi khong co / sai. */
const nguon = (c: string): string[] | null => {
  const m = /\((?:theo|ghép ý) ([^()]+)\)\.$/u.exec(c);
  const ds = m?.[1]?.split(', ') ?? [];
  return ds.length > 0 && ds.every((x) => TEN_SACH.includes(x)) ? ds : null;
};

/** 3.000 ban tay gia: ba duong chinh ai cung co (chi ro / mo); o khac chia deu, ke ca "khong co" duong su nghiep. */
function tayGia(n: number, hat0: number): KhungChiTay[] {
  let s = hat0;
  const r = (): number => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(r() * a.length)] as T;
  return Array.from({ length: n }, () => khung(Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k, v]) =>
    [k, k === 'seen' && d !== 'fate' ? pick(['clear', 'faint']) : pick(v)]))])) as Chon, r() < 0.05));
}
const TAY = tayGia(3000, 11);
const yLuan = (k: KhungChiTay): YTay[] => luanTayY(k).flatMap((d) => d.y);
/** Cau luan (khong tinh cau co dinh, doan "Nhìn cho đúng"). */
const cauLuan = (k: KhungChiTay): string[] => luanTay(k).filter((d) => d.tieuDe !== 'Nhìn cho đúng').flatMap((d) => d.loi).filter((x) => !CO_DINH.has(x));

describe('luan chi tay', () => {
  test('ca dung tay: tay "tot" → manh nhat, ba duong ro lien; tay "xau" → can giu; chi tay ngang co loi nhung khong cham diem', () => {
    const l = luanTay(khung(tot));
    expect([l.map((d) => d.tieuDe), l[0]?.loi[0]?.startsWith('Kết: mạnh nhất là sức bền — đường đời dài, vòng rộng; không đường nào kém hẳn'), l[0]?.loi[1], l.at(-1)?.loi])
      .toEqual([['Tổng luận', 'Tính cách, trí tuệ', 'Công việc, tiền bạc', 'Tình cảm, gia đình', 'Sức bền', 'Các quãng đời', 'Nhìn cho đúng'],
        true, cau(NET.sach), [...NHAC]]);
    expect(luanTay(khung(xau))[0]?.loi[0]).toMatch(/^Kết: không đường nào trội hẳn; cần giữ nhất là /u);
    expect([dauTay(khung(tot, true)), luanTay(khung(tot, true))[0]?.loi.includes(cau(NGANG_Y))]).toEqual([dauTay(khung(tot)), true]);
  });

  test('chua do du ba duong chinh → chua du; duong "khong thay" khoa o con lai, bao chup lai', () => {
    expect(luanTay(khung({ life: { seen: 'clear' } }))[0]?.loi).toEqual([CHUA_DU]);
    const k = khung({ ...tot, head: { seen: 'none', length: 'long', shape: 'curved', joined: true, broken: true } });
    expect([oDoc(k, 'head', 'length'), luanTay(k).find((d) => d.tieuDe.startsWith('Tính cách'))?.loi]).toEqual([null, [cau(TRI_KHONG)]]);
  });

  test('3.000 ban tay gia: chu dung quy uoc; 100 % cau luan ghi sach trong bang; 0 loi giai co cap y choi nhau', () => {
    const sai: string[] = [], khongNguon: string[] = [], choi = new Map<string, string>();
    TAY.forEach((k, i) => {
      for (const x of luanTay(k).flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(i)}: ${e} — ${x}`); }
      const c = cauLuan(k);
      for (const x of c) if (nguon(x) === null) khongNguon.push(x);
      for (const [a, b, t] of CHOI) {
        const ia = c.findIndex((x) => a.test(x)), ib = c.findIndex((x, j) => b.test(x) && j !== ia);
        if (ia >= 0 && ib >= 0 && !choi.has(t)) choi.set(t, `${c[ia] ?? ''} ⟷ ${c[ib] ?? ''}`);
      }
    });
    expect([sai.slice(0, 3), [...new Set(khongNguon)].slice(0, 3), [...choi]]).toEqual([[], [], []]);
  });

  test('bot chung chung: hai tay trung ≤ 15 % cau; khong cau nao o > 30 % ban tay; moi loi giai ≥ 3 cau ghep tu ≥ 2 o', () => {
    const tap = TAY.map((k) => new Set(cauLuan(k)));
    let j = 0;
    tap.forEach((a, i) => {
      const b = tap[(i * 7 + 13) % tap.length] ?? new Set<string>(), giao = [...a].filter((x) => b.has(x)).length;
      j += giao / (a.size + b.size - giao);
    });
    const dem = new Map<string, number>();
    for (const s of tap) for (const c of s) dem.set(c, (dem.get(c) ?? 0) + 1);
    const pho = [...dem].filter(([, v]) => v > 0.3 * TAY.length).map(([c, v]) => `${(100 * v / TAY.length).toFixed(0)} % ${c.slice(0, 60)}`);
    // Cau ghep: y dua vao ≥ 2 o khac nhau (khong tinh chi tay ngang).
    const ghep = TAY.map((k) => yLuan(k).filter((x) => new Set(x.tu.filter((t) => t !== 'simian')).size >= 2).length);
    console.log(`trung ${(100 * j / tap.length).toFixed(1)} % · ${String(dem.size)} cau khac nhau · cau > 30 %: ${String(pho.length)} · cau ghep / loi giai: `
      + `it nhat ${String(Math.min(...ghep))}, trung binh ${(ghep.reduce((s, x) => s + x, 0) / ghep.length).toFixed(1)}`);
    expect([j / tap.length <= 0.15, pho, Math.min(...ghep) >= 3]).toEqual([true, [], true]);
  });

  test('ro / mo tren anh khong cham nang: lat ro ↔ mo ca ba duong chinh doi mang manh / can giu cua cau ket ≤ 20 % ban tay (ban cu doi muc ket 68 %)', () => {
    const lat = (k: KhungChiTay): KhungChiTay => ({ ...k, duong: { ...k.duong, ...Object.fromEntries((['life', 'head', 'heart'] as const)
      .map((d) => [d, { ...k.duong[d], seen: k.duong[d].seen === 'clear' ? 'faint' : 'clear' }])) } });
    const mang = (k: KhungChiTay): string => (luanTay(k)[0]?.loi[0] ?? '').replace(/ — [^;(]+/gu, '');
    const doi = TAY.filter((k) => mang(k) !== mang(lat(k))).length / TAY.length;
    console.log(`lat ro <-> mo doi mang chon trong cau ket: ${(100 * doi).toFixed(0)} %`);
    expect(doi).toBeLessThanOrEqual(0.2);
  });

  test('moi gia tri moi o deu duoc luan (co y dua vao o do) va co dong nguyen van trong bang nguon docs/LUAN_CHI_TAY.md', () => {
    const doc = readFileSync('docs/LUAN_CHI_TAY.md', 'utf8'), thieuLuan: string[] = [], thieuDoc: string[] = [];
    for (const d of CAC_DUONG) {
      for (const [ten, gia] of o(d)) {
        for (const v of gia) {
          const khoa = `${d}.${ten}`, coLuan = TAY.some((k) => oDoc(k, d, ten) === String(v) && yLuan(k).some((x) => x.tu.includes(khoa)));
          if (!coLuan && !(ten === 'seen' && v === 'none' && d !== 'fate')) thieuLuan.push(`${khoa} = ${String(v)}`);
          if (!doc.includes(`\`${khoa} = ${String(v)}\``)) thieuDoc.push(`${khoa} = ${String(v)}`);
        }
      }
    }
    for (const s of TEN_SACH) if (!doc.includes(`**${s}**`)) thieuDoc.push(s);
    expect([thieuLuan, thieuDoc]).toEqual([[], []]);
  });
});
