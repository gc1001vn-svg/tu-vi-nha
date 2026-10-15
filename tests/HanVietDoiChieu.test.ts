/**
 * Doi chieu am `hv` cua bang Han-Viet voi hai nguon DOC LAP (Unihan kVietnamese + tu dien hanviet.csv),
 * gop san o `tests/vang/am-han-viet.json` (sinh lai: `scripts/sinh_am_doi_chieu.mjs`).
 *
 * Moi chu Han trong khoa ung voi mot am tiet trong `hv`, theo thu tu (bo qua dau cau). Am tiet khong nam trong am nguon
 * ghi cho chu do -> loi, tru khi muc co `lyDo`. Chu ca hai nguon deu khong co am -> khong so duoc (dem).
 * So am bo qua khac biet dau kieu cu/moi (hỏa = hoả) va i/y cuoi (tỵ = tị).
 * Chi kiem vai nhom: `NHOM=nenKieng,thanSat npx vitest run tests/HanVietDoiChieu`.
 */
import vang from './vang/am-han-viet.json';
import { BANG, NHOM, type Bang, type Nhom } from '../src/loi/hanViet/index.ts';

const AM: Readonly<Record<string, readonly string[]>> = vang.am;
const CHON = NHOM.filter((n) => process.env.NHOM === undefined || process.env.NHOM.split(',').includes(n));
// Dau thanh: huyen, sac, nga, hoi, nang (dang tach NFD). Giu nguyen dau mu, trang, moc cua chu cai.
const THANH = new RegExp(`[${String.fromCodePoint(0x300, 0x301, 0x303, 0x309, 0x323)}]`, 'u');
const bang = (n: Nhom): Bang => BANG[n];

/** Dang so sanh cua mot am tiet: chu thuong, dau thanh tach ra cuoi, y cuoi sau phu am thanh i. */
export function chuanAm(am: string): string {
  const tach = am.toLowerCase().normalize('NFD');
  const thanh = THANH.exec(tach)?.[0] ?? '';
  const goc = tach.replace(THANH, '').normalize('NFC').replace(/(?<=^(?:[bcdđghklmnprstvx]+|qu))y$/u, 'i');
  return goc + thanh;
}

/** Cac cho `hv` lech nguon, va so chu so duoc. */
function soMuc(khoa: string, hv: string): { lech: string[]; soDuoc: number } {
  const chu = Array.from(khoa).filter((c) => /\p{Script=Han}/u.test(c));
  const amTiet = hv.split(/[^\p{L}]+/u).filter((t) => t !== ''); // bo dau cau, ngoac
  if (chu.length !== amTiet.length) return { lech: [`${String(chu.length)} chu Han nhung ${String(amTiet.length)} am tiet`], soDuoc: 0 };
  const lech: string[] = [];
  let soDuoc = 0;
  chu.forEach((c, i) => {
    const nguon = AM[c] ?? [];
    if (nguon.length === 0) return;
    soDuoc++;
    const a = amTiet[i] ?? '';
    if (!nguon.some((x) => chuanAm(x) === chuanAm(a))) lech.push(`${c} "${a}" khong co trong {${nguon.join(', ')}}`);
  });
  return { lech, soDuoc };
}

describe('doi chieu am Han-Viet', () => {
  test('chuan am', () => {
    expect(chuanAm('Hỏa')).toBe(chuanAm('hoả'));
    expect(chuanAm('Tỵ')).toBe(chuanAm('tị'));
    expect(chuanAm('Quý')).toBe(chuanAm('quí'));
    expect(chuanAm('Hợi')).not.toBe(chuanAm('hời'));
  });

  test('moi am tiet khop nguon, tru muc co lyDo', () => {
    const loi: string[] = [];
    let soDuoc = 0;
    for (const n of CHON) {
      for (const [khoa, m] of Object.entries(bang(n))) {
        if (m.lyDo !== undefined) continue;
        const kq = soMuc(khoa, m.hv);
        soDuoc += kq.soDuoc;
        for (const l of kq.lech) loi.push(`${n} ${khoa} "${m.hv}": ${l}`);
      }
    }
    console.log(`doi chieu Han-Viet: ${String(soDuoc)} chu so duoc voi nguon`);
    expect(loi).toEqual([]);
  });

  test('lyDo khong thua: muc co lyDo phai that su lech nguon', () => {
    const thua: string[] = [];
    for (const n of CHON) {
      for (const [khoa, m] of Object.entries(bang(n))) {
        if (m.lyDo === undefined) continue;
        const kq = soMuc(khoa, m.hv);
        if (kq.lech.length === 0 && kq.soDuoc > 0) thua.push(`${n} ${khoa} "${m.hv}": khop nguon, bo lyDo`);
      }
    }
    expect(thua).toEqual([]);
  });
});
