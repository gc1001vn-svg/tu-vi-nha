/**
 * Bo vang lich am `tests/vang/am-lich-hnd.json` phai tu nhat quan truoc khi dot 1 dung no lam chuan.
 * Moi phan tu: [ngay duong mung 1, nam am, thang am, nhuan 0/1] theo thuat toan Ho Ngoc Duc mui +7 (ansaotuvi);
 * du cac nam am 1900–2100, phan tu cuoi (Tet 2101) chi danh dau het bang. Sinh lai: `bash scripts/doi-chieu/chay.sh`.
 */
import vang from './vang/am-lich-hnd.json';

interface DauThang { ngay: string; so: number; nam: number; thang: number; nhuan: boolean }

const NGAY_MS = 86_400_000;
const BANG: readonly DauThang[] = vang.thang.map((x) => {
  const [ngay, nam, thang, nhuan] = x;
  const so = typeof ngay === 'string' ? Date.parse(ngay) / NGAY_MS : Number.NaN;
  // Date.parse nhan ca "2054-02-30" (lan sang thang 3) nen phai doi nguoc ra chuoi de so.
  if (x.length !== 4 || typeof ngay !== 'string' || !Number.isInteger(so) || new Date(so * NGAY_MS).toISOString().slice(0, 10) !== ngay
    || typeof nam !== 'number' || typeof thang !== 'number' || (nhuan !== 0 && nhuan !== 1)) {
    throw new Error(`phan tu sai dang: ${JSON.stringify(x)}`);
  }
  return { ngay, so, nam, thang, nhuan: nhuan === 1 };
});
const THANG = BANG.slice(0, -1); // bo moc cuoi (Tet 2101): khong biet thang do dai bao nhieu

describe('vang lich am HND +7', () => {
  test('phu du 01/02/1900–31/12/2100: bat dau o Tet 1900, het o Tet 2101', () => {
    const [dau, cuoi] = [BANG[0], BANG.at(-1)];
    expect(dau).toMatchObject({ nam: 1900, thang: 1, nhuan: false });
    expect(cuoi).toMatchObject({ nam: 2101, thang: 1, nhuan: false });
    expect((dau?.ngay ?? '9999') <= '1900-02-01' && (cuoi?.ngay ?? '') > '2100-12-31').toBe(true);
  });

  test('moi thang dai 29 hoac 30 ngay', () => {
    const sai = THANG.flatMap((t, i) => {
      const dai = (BANG[i + 1]?.so ?? Number.NaN) - t.so;
      return dai === 29 || dai === 30 ? [] : [`${t.ngay}: ${String(dai)} ngay`];
    });
    expect(sai).toEqual([]);
  });

  test('moi nam am co 12 hoac 13 thang dung thu tu, nam 13 thang co dung mot thang nhuan', () => {
    const sai: string[] = [];
    for (let nam = 1900; nam <= 2100; nam++) {
      const ds = THANG.filter((t) => t.nam === nam);
      const soNhuan = ds.filter((t) => t.nhuan).length;
      if (ds.length !== 12 && ds.length !== 13) sai.push(`${String(nam)}: ${String(ds.length)} thang`);
      if (soNhuan !== (ds.length === 13 ? 1 : 0)) sai.push(`${String(nam)}: ${String(ds.length)} thang, ${String(soNhuan)} thang nhuan`);
      // Thang nhuan mang so cua thang lien truoc; thang thuong tang 1, bat dau tu thang Gieng.
      ds.forEach((t, i) => {
        const truoc = ds[i - 1]?.thang ?? 0;
        if (t.thang !== (t.nhuan ? truoc : truoc + 1)) sai.push(`${t.ngay}: thang ${String(t.thang)}${t.nhuan ? ' nhuan' : ''} sau thang ${String(truoc)}`);
      });
    }
    expect(sai).toEqual([]);
  });

  test('Tet da biet: 1985 (VN som hon TQ mot thang), 2007 (som mot ngay), 2026 (trung TQ)', () => {
    const tet = (nam: number): string | undefined => BANG.find((t) => t.nam === nam && t.thang === 1 && !t.nhuan)?.ngay;
    expect([tet(1985), tet(2007), tet(2026)]).toEqual(['1985-01-21', '2007-02-17', '2026-02-17']);
  });
});
