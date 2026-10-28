/**
 * Chi tay (dot 7 phan 3), khong mang: moi gia tri moi o co luat (ten, cau chot, nguon); moi nen khai la "cung noi" phai co sach cua
 * nen do trong phan nguon (khong khai khong muc dong thuan); khung → luat; du lieu gui AI du o da chon, ghi muc tin, khong kem chi
 * tiet tung sach; ten duong/go ngoai khung bi gach chan.
 */
import { duLieuChiTay } from '../src/loi/ai/duLieu.ts';
import { TU_NGUOI, timBia } from '../src/loi/ai/kiemBia.ts';
import { LOI_DAN, YEU_CAU } from '../src/loi/ai/loiDan.ts';
import { CAC_DUONG, DOAN_CHUONG, GIAI, KHUNG, NEN, QUY_LUAT_CHUNG, TU_CHI_TAY, giaiChiTay, mucTin, type Duong, type KhungChiTay,
  type Luat, type Nen } from '../src/loi/chiTay.ts';

const o = (d: Duong): [string, readonly unknown[]][] => Object.entries(KHUNG[d]) as [string, readonly unknown[]][];
const luatCua = (d: Duong, k: string): Readonly<Record<string, Luat>> =>
  (GIAI[d].o as unknown as Readonly<Record<string, { gia: Readonly<Record<string, Luat>> }>>)[k]?.gia ?? {};
const tatCa = (): Luat[] => [...CAC_DUONG.flatMap((d) => o(d).flatMap(([k]) => Object.values(luatCua(d, k)))), ...Object.values(DOAN_CHUONG)];

/** Sach cua tung nen — luat khai nen nao thi phan nguon phai nhac sach nen do. */
const SACH: Readonly<Record<Nen, RegExp>> = { tq: /Thái Thanh|Toàn Biên|Liễu Trang/, ad: /Bṛhat Saṃhitā/, hl: /Aristotle/, tay: /Cheiro|Benham/ };

/** Khung chon het, lay gia tri thu `i` cua tung o. */
const khungThu = (i: number): KhungChiTay => ({ simian: i % 2 === 0,
  duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k, v]) => [k, v[i % v.length]]))])) as unknown as KhungChiTay['duong'] });
const trong: KhungChiTay = { simian: null,
  duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(o(d).map(([k]) => [k, null]))])) as unknown as KhungChiTay['duong'] };

describe('quy luat chi tay', () => {
  test('moi gia tri moi o co luat du ten, cau chot, nguon; khong thua gia tri ngoai khung', () => {
    for (const d of CAC_DUONG) for (const [k, v] of o(d)) expect(Object.keys(luatCua(d, k)).sort()).toEqual(v.map(String).sort());
    for (const l of tatCa()) expect([l.nhan.length > 1, l.chot.length > 2, l.loi.length > 10]).toEqual([true, true, true]);
  });

  test('nen nao khai "cung noi" thi phan nguon co sach nen do; dong thuan dem theo nen, khong theo sach', () => {
    for (const l of [...tatCa(), ...QUY_LUAT_CHUNG]) {
      expect(new Set(l.nen).size).toBe(l.nen.length);
      for (const n of l.nen) expect(`${l.loi} ${l.venh ?? ''}`).toMatch(SACH[n]);
    }
    expect(Object.keys(NEN)).toEqual(['tq', 'ad', 'hl', 'tay']);
    expect([mucTin({ nen: ['tq', 'ad', 'tay'] }), mucTin({ nen: ['tay'] }), mucTin({ nen: [] }), mucTin({ nen: ['tay'], venh: 'x' })])
      .toEqual(['đồng thuận 3 nền: Trung Hoa, Ấn Độ, Tây', 'một nền: Tây', 'sách không đọc riêng', 'các nền vênh (Tây nói như trên)']);
  });

  test('khung → luat: chon het thi moi dong co luat; duong "khong thay" chi con dong do ro; chua chon thi null', () => {
    for (const i of [0, 1, 2]) {
      const g = giaiChiTay(khungThu(i));
      expect(g.map((m) => m.ten)).toEqual(['Chỉ tay ngang (đoạn chưởng)', ...CAC_DUONG.map((d) => GIAI[d].ten)]);
      for (const [j, d] of CAC_DUONG.entries()) {
        const dong = g[j + 1]?.dong ?? [];
        expect(dong.length).toBe(khungThu(i).duong[d].seen === 'none' ? 1 : o(d).length);
        for (const x of dong) expect(x.luat).not.toBeNull();
      }
    }
    expect(giaiChiTay(trong).flatMap((m) => m.dong.map((d) => d.luat))).toEqual(Array<null>(16).fill(null));
  });
});

describe('du lieu gui AI dien giai, du doan', () => {
  test('ban tay nguoi xem tach khoi luat; luat tung o da chon kem muc tin; o chua chon ghi "chưa chọn"; khong kem chi tiet sach', () => {
    const k = khungThu(0), d = duLieuChiTay(k, 'nam');
    expect(d.match(/^## .+/gm)?.map((m) => m.slice(3).split(' (')[0])).toEqual(['Bàn tay người xem', 'Luật app tra cho từng ô đã chọn',
      'Nghĩa từng đường theo các nền', 'Quy luật chung']);
    expect([d.includes('tay trái (nam)'), duLieuChiTay(k, 'nu').includes('tay phải (nữ)')]).toEqual([true, true]);
    for (const l of QUY_LUAT_CHUNG) expect(d).toContain(`- [${mucTin(l)}] ${l.chot}`);
    for (const m of giaiChiTay(k)) {
      expect(d).toContain(`- ${m.ten}: ${m.dong.map((x) => `${x.o} = ${x.luat?.nhan ?? ''}`).join('; ')}.`);
      for (const x of m.dong) if (x.luat !== null) expect(d).toContain(`- [${mucTin(x.luat)}] ${m.ten} · ${x.o} = ${x.luat.nhan}: ${x.luat.chot}`);
    }
    expect(d.includes(GIAI.life.o.seen.gia.clear.loi)).toBe(false);
    const t = duLieuChiTay(trong, 'nu');
    expect([t.match(/ = chưa chọn/g)?.length, t.includes(' · ')]).toEqual([16, false]);
    expect(d.includes('không có ảnh')).toBe(false); // 28/10: chu nay lam AI tuong la khong co du lieu
    expect(Math.max(...[0, 1, 2].map((i) => duLieuChiTay(khungThu(i), 'nam').length))).toBeLessThan(7000);
  });

  test('yeu cau co cac muc du doan; loi dan biet mon chi tay; ten duong, go ngoai khung bi gach chan', () => {
    expect(YEU_CAU.chiTay('')).toMatch(/Tổng quan · Từng đường · Dự đoán .*sức khoẻ.*· Lưu ý/);
    expect(LOI_DAN).toContain('chỉ tay');
    const d = duLieuChiTay(khungThu(0), 'nam');
    expect(timBia('Đường hôn nhân của bạn đẹp, đường tình rõ, gò Mộc Tinh cao.', d, [...TU_NGUOI, ...TU_CHI_TAY]).map((b) => b.tu))
      .toEqual(['Đường hôn nhân', 'gò Mộc Tinh']);
  });
});
