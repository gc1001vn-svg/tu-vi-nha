/**
 * Tuong mat dot 7 phan 2 — loi do: luoi diem dung tay voi ti le biet truoc (anh 800×1000 de bat loi quen doi chuan hoa ra px),
 * gop anh + anh lat guong, goc dau tu ma tran. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`, quy uoc `QUY_UOC` muc 26.
 */
import { GIOI_HAN_GOC, doMat, gocDau, khungCat, quaGoc, soDo, type DiemMoc, type LanDo } from '../src/loi/tuongMat.ts';
import { CAC_KHOA, GIAI, KET, MAU, NHAY_GAN, giaiMat, ketLuan, mucMat, soVoiMau } from '../src/loi/tuongMatGiai.ts';

const RONG = 800, CAO = 1000;
/** Diem dat theo px tren mat doi xung qua x = 420; con lai de giua anh. */
const PX: Record<number, readonly [number, number]> = {
  33: [300, 400], 133: [380, 400], 362: [460, 400], 263: [540, 400], // mat rong 80, khoang giua 80
  234: [220, 400], 454: [620, 400], // mat ngang 400 = 5 mat
  129: [380, 560], 358: [460, 560], // canh mui 80
  61: [360, 640], 291: [480, 640], // mieng 120
  9: [420, 360], 2: [420, 600], 152: [420, 840], // trung 240, ha 240, dai 480
  70: [290, 345], 46: [290, 355], 107: [390, 345], 55: [390, 355], // may phai dai 100
  300: [550, 345], 276: [550, 355], 336: [450, 345], 285: [450, 355], // may trai dai 100, an duong 60
  52: [340, 355], 159: [340, 385], 282: [500, 355], 386: [500, 385], // may cach mi 30
};
const luoi = (doi: (x: number, y: number) => readonly [number, number] = (x, y) => [x, y]): DiemMoc[] =>
  Array.from({ length: 478 }, (_, i) => {
    const [x, y] = doi(...(PX[i] ?? [RONG / 2, CAO / 2]));
    return { x: x / RONG, y: y / CAO };
  });
const DUNG = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -30, 1];
const lan = (diem: DiemMoc[], maTran: readonly number[] = DUNG, lat = false): LanDo => ({ diem, rong: RONG, cao: CAO, maTran, lat });

/** Ma tran quay luu theo cot nhu MediaPipe: R[r][c] o o c*4 + r. */
function maTran(R: readonly (readonly number[])[]): number[] {
  const m = [...DUNG];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[c * 4 + r] = R[r]?.[c] ?? 0;
  return m;
}
const rad = (d: number): number => (d * Math.PI) / 180;
const quayY = (d: number): number[][] => [[Math.cos(rad(d)), 0, Math.sin(rad(d))], [0, 1, 0], [-Math.sin(rad(d)), 0, Math.cos(rad(d))]];
const quayX = (d: number): number[][] => [[1, 0, 0], [0, Math.cos(rad(d)), -Math.sin(rad(d))], [0, Math.sin(rad(d)), Math.cos(rad(d))]];
const quayZ = (d: number): number[][] => [[Math.cos(rad(d)), -Math.sin(rad(d)), 0], [Math.sin(rad(d)), Math.cos(rad(d)), 0], [0, 0, 1]];

describe('so do tuong mat', () => {
  test('luoi dung tay ra dung ti le da dat', () => {
    const s = soDo(luoi(), RONG, CAO);
    expect(Object.fromEntries(Object.entries(s).map(([k, v]) => [k, Math.round(v * 1000) / 1000]))).toEqual({
      trungHa: 1, nguNhan: 5, khoangMat: 1, mui: 0.2, mieng: 0.3, daiRong: 1.2, may: 1.25, anDuong: 0.75, mayCach: 0.375,
    });
  });

  test('xoay anh, phong to khong doi ti le (chi lay khoang cach giua hai diem)', () => {
    const a = soDo(luoi(), RONG, CAO);
    const c = Math.cos(rad(25)), s = Math.sin(rad(25));
    const b = soDo(luoi((x, y) => [100 + 0.7 * (c * (x - 420) - s * (y - 500)) + 420, 0.7 * (s * (x - 420) + c * (y - 500)) + 500]), RONG, CAO);
    for (const k of Object.keys(a) as (keyof typeof a)[]) expect(b[k]).toBeCloseTo(a[k], 9);
  });

  test('anh lat guong cung so; cac lan lech nhau thi lay trung binh, lech = 2 sai so chuan cua trung binh (%)', () => {
    const lat = luoi((x, y) => [RONG - x, y]);
    const k = doMat([lan(luoi()), lan(lat, DUNG, true)]);
    for (const [x, y] of [[k.so.nguNhan, 5], [k.so.khoangMat, 1], [k.lech, 0]] as const) expect(x).toBeCloseTo(y, 9);
    // Lan lat do mat rong 88 (mo hinh lech trai phai): khoang mat 80/88. Hai lan a, b: 2 sai so chuan = |a − b|, chia trung binh.
    const lech = luoi((x, y) => [RONG - (x === 300 ? 292 : x === 540 ? 548 : x), y]);
    const k2 = doMat([lan(luoi()), lan(lech, DUNG, true)]);
    expect(k2.so.khoangMat).toBeCloseTo((1 + 80 / 88) / 2, 9);
    expect(k2.lech).toBeCloseTo(((1 - 80 / 88) / ((1 + 80 / 88) / 2)) * 100, 9);
    // Ba lan 1, 1, 80/88: do lech mau = (1 − 80/88)/√3, sai so chuan = do lech/√3.
    const k3 = doMat([lan(luoi()), lan(luoi()), lan(lech, DUNG, true)]);
    expect(k3.so.khoangMat).toBeCloseTo((2 + 80 / 88) / 3, 9);
    expect(k3.lech).toBeCloseTo(((2 * (1 - 80 / 88)) / 3 / ((2 + 80 / 88) / 3)) * 100, 9);
    expect(() => doMat([])).toThrow('Không có lần đo nào');
  });

  test('thieu diem thi bao loi, khong ra so sai', () => {
    expect(() => soDo(luoi().slice(0, 400), RONG, CAO)).toThrow('thiếu điểm 454');
  });
});

describe('goc dau', () => {
  test('ma tran quay ra dung goc tung truc', () => {
    const r = (g: ReturnType<typeof gocDau>): number[] => [g.quay, g.ngua, g.nghieng].map((x) => Math.round(x * 10) / 10 + 0);
    expect(r(gocDau(maTran(quayY(20))))).toEqual([20, 0, 0]);
    expect(r(gocDau(maTran(quayX(-12))))).toEqual([0, -12, 0]);
    expect(r(gocDau(maTran(quayZ(30))))).toEqual([0, 0, 30]);
  });

  test('qua gioi han thi bao chup lai; nghieng sang ben khong tinh', () => {
    expect([GIOI_HAN_GOC.quay, GIOI_HAN_GOC.ngua]).toEqual([10, 15]);
    expect(quaGoc({ quay: 9.9, ngua: 14.9, nghieng: 40 })).toBe(false);
    expect([quaGoc({ quay: 10.1, ngua: 0, nghieng: 0 }), quaGoc({ quay: 0, ngua: -15.1, nghieng: 0 })]).toEqual([true, true]);
  });

  test('gop anh + anh lat: lat guong doi dau goc quay, nghieng, giu ngua', () => {
    const k = doMat([lan(luoi(), maTran(quayY(12))), lan(luoi(), maTran(quayY(-8)), true)]);
    expect(k.goc.quay).toBeCloseTo(10, 9);
    const k2 = doMat([lan(luoi(), maTran(quayX(6))), lan(luoi(), maTran(quayX(8)), true)]);
    expect(k2.goc.ngua).toBeCloseTo(7, 9);
    const k3 = doMat([lan(luoi(), maTran(quayZ(4))), lan(luoi(), maTran(quayZ(-6)), true)]);
    expect(k3.goc.nghieng).toBeCloseTo(5, 9);
  });
});

test('khung cat: vuong, tam mat, canh = he so × chieu lon cua mat', () => {
  const d = [{ x: 0.25, y: 0.3 }, { x: 0.75, y: 0.5 }]; // 200..600 px ngang, 300..500 px doc
  expect(khungCat(d, RONG, CAO)).toEqual({ x: 0, y: 0, canh: 800 });
  expect(khungCat(d, RONG, CAO, 1)).toEqual({ x: 200, y: 200, canh: 400 });
});

describe('loi giai tuong mat', () => {
  test('du 9 ti le cua so do, moi ti le du ba muc chu, nguong tang dan, co nguon', () => {
    expect(CAC_KHOA).toEqual(Object.keys(soDo(luoi(), RONG, CAO)));
    for (const k of CAC_KHOA) {
      const g = GIAI[k];
      expect([g.nguong[0] < g.nguong[1], g.nguon.length > 20,
        ...(['thap', 'vua', 'cao'] as const).flatMap((m) => [g.loi[m].length > 10, g.them[m].length > 10])]).toEqual(Array(8).fill(true));
    }
  });

  test('xep muc: duoi nguong duoi la thap, tren nguong tren la cao, dung nguong la vua; may duoi 1 la ngan hon mat', () => {
    const [a, b] = GIAI.anDuong.nguong;
    expect([mucMat('anDuong', a - 0.001), mucMat('anDuong', a), mucMat('anDuong', b), mucMat('anDuong', b + 0.001)])
      .toEqual(['thap', 'vua', 'vua', 'cao']);
    expect([mucMat('may', 0.95), mucMat('may', 1.6)]).toEqual(['thap', 'vua']);
    expect(GIAI.may.loi.thap.startsWith('Lông mày ngắn hơn mắt')).toBe(true);
  });

  test('giai: anh cuoi bo ca 9; dai:rong vuot moi anh mau (nghi chup gan) bo 5 ti le nhay khoang cach, giu 4 ti le con lai', () => {
    const so = soDo(luoi(), RONG, CAO); // dai:rong 1,2 > 1,03
    const gan = giaiMat({ so, cuoi: 0 });
    expect([gan.canhBao.length, gan.canhBao[0]?.includes('tự chụp cầm tay')]).toEqual([1, true]);
    expect(CAC_KHOA.filter((k) => gan.loi[k] === null)).toEqual([...NHAY_GAN]);
    const cuoi = giaiMat({ so: { ...so, daiRong: 0.9 }, cuoi: 0.5 });
    expect([cuoi.canhBao.length, CAC_KHOA.every((k) => cuoi.loi[k] === null)]).toEqual([1, true]);
    const tot = giaiMat({ so: { ...so, daiRong: 0.9 }, cuoi: 0.1 });
    expect([tot.canhBao.length, tot.loi.mui]).toEqual([0, GIAI.mui.loi[mucMat('mui', so.mui)]]);
  });

  test('mau: 15 so tang dan moi ti le, nguong = phan vi 25/75 cua mau (tru may duoi 1); du ket luan moi muc', () => {
    const pv = (v: readonly number[], q: number): number => { const i = (v.length - 1) * q, d = Math.floor(i); return (v[d] ?? 0) + ((v[d + 1] ?? 0) - (v[d] ?? 0)) * (i - d); };
    for (const k of CAC_KHOA) {
      const v = MAU[k];
      expect([v.length, v.every((x, i) => i === 0 || x >= (v[i - 1] ?? 0))]).toEqual([15, true]);
      if (k !== 'may') expect(Math.abs(GIAI[k].nguong[0] - pv(v, 0.25))).toBeLessThan(0.011);
      expect(Math.abs(GIAI[k].nguong[1] - pv(v, 0.75))).toBeLessThan(0.011);
      expect((['thap', 'vua', 'cao'] as const).every((m) => KET[k][m].y.length > 3)).toBe(true);
    }
    expect([soVoiMau('mui', 0.31), soVoiMau('mui', 0.2), soVoiMau('nguNhan', 5.45)])
      .toEqual(['Cánh mũi rộng hơn 13/15 người mẫu.', 'Cánh mũi rộng hơn 0/15 người mẫu.', 'Mắt dài hơn 13/15 người mẫu.']);
  });

  test('ket luan chung ca khuon mat: ngu quan, tam dinh, luu nien theo tuoi, tong the; chup gan thi chua du; anh cuoi thi khong co', () => {
    const vua = Object.fromEntries(CAC_KHOA.map((k) => [k, MAU[k][7] ?? 0])) as Record<(typeof CAC_KHOA)[number], number>;
    expect(ketLuan({ so: { ...vua, mui: 0.31, mieng: 0.34, mayCach: 0.85 }, cuoi: 0 })).toEqual([
      'Ngũ quan (máy đo được mày, mắt, mũi, miệng; tai không đo): mày, mũi thành; miệng kém. Theo Thần Tướng Toàn Biên "một quan '
        + 'thành hưởng mười năm quý hiển", tức khoảng 20 năm hanh thông.',
      'Trung đình, hạ đình cân nhau: các quãng đời đều đặn.',
      'Vận theo tuổi (phép lưu niên, Toàn Biên): 28 tuổi (ấn đường) bình thường; 31–34 (mày) thuận; 35–40 (mắt) bình thường; 41–50 '
        + '(mũi) thuận; 51–60 (miệng) cần giữ gìn.',
      'Tổng thể: tướng tốt (4 nét tốt, 1 nét cần lưu ý trên 9 nét xét được); mạnh về gia đình, nhà cửa, địa vị, vận theo tuổi; cần '
        + 'lưu ý về tiền bạc, lộc ăn.',
    ]);
    const gan = ketLuan({ so: soDo(luoi(), RONG, CAO), cuoi: 0 });
    expect([gan?.length, gan?.[0]?.startsWith('Chưa đủ nét để luận cả khuôn mặt: 7/9 nét không xét vì ảnh chụp gần.')]).toEqual([1, true]);
    expect(ketLuan({ so: vua, cuoi: 0.5 })).toBeNull();
  });

  test('diem cuoi: trung binh cac lan do, thieu thi tinh 0', () => {
    expect(doMat([{ ...lan(luoi()), cuoi: 0.3 }, { ...lan(luoi()), cuoi: 0.5 }]).cuoi).toBeCloseTo(0.4, 9);
    expect(doMat([lan(luoi())]).cuoi).toBe(0);
  });
});
