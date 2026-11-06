/**
 * AI dot 7 phan 1 — phan khong can mang: goi du lieu gui di (du cac mon, khong ten), do chu bia. Ngay sinh GIA. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { vuaHanMuc } from '../src/giaoDien/ai/goi.ts';
import { cau, duLieuNguoi, duLieuQue, duLieuTarot, gomMuc } from '../src/loi/ai/duLieu.ts';
import { LOI_DAN, YEU_CAU } from '../src/loi/ai/loiDan.ts';
import { TU_NGUOI, timBia } from '../src/loi/ai/kiemBia.ts';
import { soNgay, tuSoNgay } from '../src/loi/amLich.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';
import * as kinhDich from '../src/loi/kinhDich.ts';
import * as kinhDichChu from '../src/loi/kinhDichChu.ts';
import * as kinhDichGiai from '../src/loi/kinhDichGiai.ts';
import * as kinhDichLuan from '../src/loi/kinhDichLuan.ts';
import * as tarotBai from '../src/loi/tarot.ts';
import * as tarotLuan from '../src/loi/tarotLuan.ts';

const tarot = { ...tarotBai, ...tarotLuan };
import { NUOC_NGOAI } from '../src/loi/tinh.ts';

const XEM = { nam: 2026, thang: 10, ngay: 23 };
const hs = (o: Partial<HoSo> = {}): HoSo =>
  ({ id: 'a', ten: 'Nguyễn Bí Mật', gioiTinh: 'nam', ngaySinh: '1990-05-10', gioSinh: '06:14', noiSinh: 'Hà Nội', ...o });
const du = (h: HoSo, lech?: number): string => duLieuNguoi(h, tinhHoSo(h, lech), XEM, lech);

describe('goi du lieu gui AI', () => {
  test('loi chot cac mon (ke hoach 2026-11-03-ai-loi-chot): moi mon co "Lời chốt của app"; tu vi cham tung cung; luot dau con ≥ 2.900 token ra', () => {
    const d = du(hs());
    const phan = (ten: string): string => d.split(/\n(?=## )/).find((x) => x.startsWith(`## ${ten}`)) ?? '';
    for (const m of ['Tử vi', 'Năm nay', 'Bát tự', 'Hướng nhà', 'Thần số học', 'Chiêm tinh']) expect([m, phan(m).includes('Lời chốt của app')]).toEqual([m, true]);
    expect([(phan('Tử vi').match(/ · app chấm: (tốt|vừa|cần lưu ý)/g) ?? []).length, phan('Tử vi').includes('Tràng Sinh'), d.includes('..')]).toEqual([12, false, false]);
    expect(vuaHanMuc(`${LOI_DAN}\n\nDỮ LIỆU:\n${d}`, [{ role: 'user', content: YEU_CAU.nguoi() }]).ra).toBeGreaterThanOrEqual(2900);
    // khong gio sinh: tu vi chua lap duoc, cac mon khac van co loi chot
    expect(phan.call(null, 'Bát tự').length > 0 && du(hs({ gioSinh: null })).includes('Lời chốt của app')).toBe(true);
    expect([cau('Câu một. Câu hai.'), cau('a '.repeat(80)).endsWith('…'), cau('Ngắn.')]).toEqual(['Câu một', true, 'Ngắn']);
  });

  test('moc thoi gian ro (do AI that 03/11): nhip sinh hoc ghi muc, qua dinh / qua day; dai van ghi da qua, dang chay', () => {
    const dong = (d: string, dau: string): string => d.split('\n').find((x) => x.startsWith(dau)) ?? '';
    const ngay = (xem: { nam: number; thang: number; ngay: number }): string => duLieuNguoi(hs(), tinhHoSo(hs()), xem, undefined);
    // AI doc "+90% đang xuống" thanh "giảm nhẹ": ghi muc (cao) va qua dinh.
    expect(dong(du(hs()), 'Thể chất')).toBe('Thể chất -52% thấp, đã qua đáy; Cảm xúc -22% hơi thấp, đang xuống; Trí tuệ +10% hơi cao, đã qua đỉnh (ngày đổi dấu).');
    expect(dong(ngay({ nam: 2026, thang: 11, ngay: 1 }), 'Thể chất')).toMatch(/^Thể chất \+94% cao, đã qua đỉnh;/u);
    // Ca chu ky 33 ngay: muc khop so; qua dinh chi khi duong, qua day chi khi am.
    for (let i = 0; i < 34; i++) {
      for (const x of dong(ngay(tuSoNgay(soNgay(XEM) + i)), 'Thể chất').slice(0, -1).split('; ')) {
        const m = /^(?:Thể chất|Cảm xúc|Trí tuệ) ([+-]?\d+)% (cao|hơi cao|ở giữa|hơi thấp|thấp), (đã qua đỉnh|đã qua đáy|đang lên|đang xuống)( \(ngày đổi dấu\))?$/u.exec(x);
        const p = Number(m?.[1]), muc = { cao: p >= 50, 'hơi cao': p > 0 && p < 50, 'ở giữa': p === 0, 'hơi thấp': p < 0 && p > -50, thấp: p <= -50 };
        expect([x, m !== null && muc[m[2] as keyof typeof muc] && (m[3] === 'đã qua đỉnh' ? p > 0 : m[3] === 'đã qua đáy' ? p < 0 : true)]).toEqual([x, true]);
      }
    }
    // Dai van: AI lay dai van Phu Thê 24–33 da qua noi chuyen vo chong hien tai (ho so gia0 do that, sinh 27/10/1957 00:30).
    const gia0 = du(hs({ ngaySinh: '1957-10-27', gioSinh: '00:30' }));
    expect(dong(gia0, '- Phu Thê')).toContain('đại vận 24–33 tuổi (đã qua)');
    for (const d of [du(hs()), gia0]) {
      const tuoi = Number(/(\d+) tuổi mụ\.\n/u.exec(d)?.[1]);
      for (const [, a = '', b = '', ghi = ''] of d.matchAll(/đại vận (\d+)–(\d+) tuổi( \(đã qua\)| \(đang chạy\))?/gu)) {
        expect([a, ghi]).toEqual([a, Number(b) < tuoi ? ' (đã qua)' : Number(a) <= tuoi ? ' (đang chạy)' : '']);
      }
    }
    expect(dong(du(hs()), 'Đại vận (')).toBe('Đại vận (tuổi mụ và năm bắt đầu): đã qua 10 tuổi Nhâm Ngọ (1999), 20 tuổi Quý Mùi (2009); '
      + 'đang chạy 30 tuổi Giáp Thân (2019); sắp tới 40 tuổi Ất Dậu (2029), 50 tuổi Bính Tuất (2039), 60 tuổi Đinh Hợi (2049), 70 tuổi Mậu Tý (2059), 80 tuổi Kỷ Sửu (2069).');
    // Tre chua vao dai van bat tu dau: chi co van sap toi.
    const tre = du(hs({ ngaySinh: '2023-03-01', gioSinh: '08:00' }));
    expect([dong(tre, 'Đại vận (').startsWith('Đại vận (tuổi mụ và năm bắt đầu): sắp tới 9 tuổi Quý Sửu (2031), '), dong(tre, 'Đại vận (').includes('đã qua'),
      tre.includes('Hôm nay chưa vào đại vận nào.')]).toEqual([true, false, true]);
  });

  test('du 9 muc, dung so may tinh, khong ten nguoi, khong muc nao loi, ~8 nghin token tro xuong', () => {
    const d = du(hs());
    expect(d.match(/^## [^(\n]+/gm)?.map((m) => m.slice(3).trim())).toEqual(['Người xem', 'Tử vi', 'Năm nay', 'Bát tự', 'Hướng nhà',
      'Tuổi hợp, tuổi kỵ', 'Thần số học', 'Nhịp sinh học hôm nay', 'Chiêm tinh']);
    expect([d.includes('Bí Mật'), d.includes('không tính được')]).toEqual([false, false]);
    // So da kiem o test tung mon: nam Canh Ngo, cung Moc Song Tu 2°14′ (ChiemTinh.test), 12 cung tu vi.
    expect([d.includes('năm Canh Ngọ'), d.includes('Cung Mọc Song Tử 2°14′'), (d.match(/^- .+ · đại vận /gm) ?? []).length]).toEqual([true, true, 12]);
    expect(d.length).toBeLessThan(16_000);
  });

  test('tuong mat (neu da do): muc cuoi, so + loi app xep; anh cuoi chi gui so', () => {
    const so = { tran: 0.8, trungHa: 1.1, nguNhan: 5.5, khoangMat: 1.3, mui: 0.3, mieng: 0.3, daiRong: 0.9, ham: 0.8, cam: 0.4, may: 1.6,
      anDuong: 1.05, mayCach: 0.6 };
    const tinh = tinhHoSo(hs());
    const d = duLieuNguoi(hs(), tinh, XEM, undefined, { so, cuoi: 0.05 });
    const m = d.slice(d.indexOf('## Tướng mặt'));
    expect([d.endsWith(m), (m.match(/^- /gm) ?? []).length, m.includes('- Trung đình : hạ đình 1,10: trung đình dài — trung niên là quãng mạnh (tốt)'), m.includes('Lời chốt của app: Kết:')]).toEqual([true, 12, true, true]);
    // loi day du chi o man hinh: muc gui AI ngan de luot dau con du token ra (vuaHanMuc)
    expect([m.includes('- Miệng 30,0 %: miệng hẹp — lộc ăn mỏng (cần lưu ý)'), m.length < 2000]).toEqual([true, true]);
    const c = duLieuNguoi(hs(), tinh, XEM, undefined, { so, cuoi: 0.6 });
    expect([c.includes('app không giải'), c.includes('- Miệng 30,0 %\n'), c.includes('miệng hẹp —')]).toEqual([true, true, false]);
    expect(du(hs()).includes('Tướng mặt')).toBe(false);
  });

  test('khong ro gio: tu vi bao can gio, chiem tinh ghi tinh 12 gio trua; sinh nuoc ngoai: ghi mui gio, bo cung Moc', () => {
    const k = du(hs({ gioSinh: null }));
    expect([k.includes('chưa lập được lá số tử vi'), k.includes('không có nhật hạn hôm nay'), k.includes('12 giờ trưa'), k.includes('Cung Mọc ')])
      .toEqual([true, true, true, false]);
    const n = du(hs({ noiSinh: NUOC_NGOAI, muiGio: 'Europe/Paris' }), 120);
    expect([n.includes('múi giờ Europe/Paris'), n.includes('Cung Mọc ')]).toEqual([true, false]);
  });

  test('nam nay: gom muc Xấu / Vừa / Tốt, không cần kiêng (do AI that 06/11: AI dan kieng ca muc khong pham)', () => {
    expect(gomMuc([['Sao chiếu mệnh', 'Kế Đô', 'xau'], ['Hạn', 'Địa Võng', 'xau'], ['Kim Lâu', 'Không phạm', 'tot'], ['Tam Tai', 'Năm thứ 2/3', 'vua']]))
      .toBe('Xấu: Sao chiếu mệnh Kế Đô; Hạn Địa Võng. Vừa: Tam Tai Năm thứ 2/3. Tốt, không cần kiêng: Kim Lâu Không phạm.');
    expect(du(hs()).split('\n').some((x) => /^(?:Xấu|Vừa|Tốt, không cần kiêng): /u.test(x))).toBe(true);
  });

  test('que, trai bai: ten que, hao dong, doan nen doc kem nguyen van; la, vi tri, xuoi nguoc', () => {
    const k = { ...kinhDich, ...kinhDichChu, ...kinhDichGiai, ...kinhDichLuan };
    const q = duLieuQue(k, kinhDich.gieo([7, 7, 7, 7, 7, 9]), null);
    expect([q.includes('Quẻ chủ: quẻ 1 Thuần Càn'), q.includes('Hào động: 6'), q.includes('nguyên văn "'), q.includes('Lời chốt của app')]).toEqual([true, true, true, true]);
    const t = duLieuTarot(tarot, 'baLa', [{ so: 0, nguoc: false }, { so: 77, nguoc: true }, { so: 22, nguoc: false }]);
    expect([t.includes('Quá khứ'), t.includes('The Fool'), t.includes('King of Pentacles — Vua Tiền, lá ngược'), t.includes('Lời chốt của app')]).toEqual([true, true, true, true]);
  });
});

describe('do chu bia', () => {
  const d = du(hs());
  test('du lieu tu so voi chinh no: khong bia; tu dien du ten cac mon', () => {
    expect(timBia(d, d, TU_NGUOI)).toEqual([]);
    expect(['Tử Vi', 'Lưu Thái Tuế', 'La Hầu', 'Tam Kheo', 'Giáp Tý', 'Lộ Bàng Thổ', 'Thất Sát', 'Song Ngư', 'Sinh Khí'].filter((t) => !TU_NGUOI.includes(t)))
      .toEqual([]);
  });

  test('ten khong co trong du lieu thi bat, kem vi tri; dung chu hoa, tron chu; bo ten mot chu', () => {
    const coSan = ['Mộc Đức', 'La Hầu', 'Thái Bạch', 'Kế Đô'].filter((t) => d.includes(t));
    const vang = ['Mộc Đức', 'La Hầu', 'Thái Bạch', 'Kế Đô'].find((t) => !d.includes(t)) ?? '';
    const loi = `Năm nay gặp sao ${vang}, lại thêm hạn; ${coSan[0] ?? ''} thì ổn. Năm Đinh Mão xa rồi; la hầu viết thường; Mộ một chữ.`;
    expect(timBia(loi, d, [...TU_NGUOI, 'Mộ'])).toEqual([{ tu: vang, vt: loi.indexOf(vang) }, { tu: 'Đinh Mão', vt: loi.indexOf('Đinh Mão') }]);
    expect(timBia('Tử Vi Đẩu Số', 'Tử Vi', ['Tử Vi Đẩu'])).toEqual([{ tu: 'Tử Vi Đẩu', vt: 0 }]);
    expect(timBia('Nhà Tử Vinh', 'Vinh', ['Tử Vi'])).toEqual([]);
  });

  test('ten la ngoai tu dien (do AI that 03/11: "Vệ Thần", du lieu ghi Sao Thiên Vương): bat; chu thuong, chu mo cau, ten chung, cach viet khac thi khong', () => {
    const loi = '## Tính Cách\nTheo Tử Vi, Mệnh vô chính diệu nên mượn sao cung đối. Nhờ Thái Dương ở Quan Lộc sáng, công danh thuận. '
      + 'Sao Vệ Thần ở nhà 8, còn sao Vệ Thần "bảo vệ" tiền bạc; Sao Thiên Vương (Vệ Thần) nghịch hành.\n'
      + '- **Chiêm tinh:** Mặt Trời Kim Ngưu, Bắc Giao Điểm (North Node) ở Bảo Bình; Sao Thuỷ nghịch hành; Hoả Tinh đắc.\n'
      + '- Năm Tân Tị 2001 đã qua; Tết Nguyên Đán năm sau rơi vào Thứ Bảy. Đây là quan niệm dân gian Việt Nam.';
    expect(timBia(loi, d, TU_NGUOI)).toEqual([...loi.matchAll(/Vệ Thần/gu)].map((m) => ({ tu: 'Vệ Thần', vt: m.index })));
    // Ten nguoi hoi tu go (cau bay) khong tinh la bia: noi goi gui kem cau hoi (`phien.ts`, `do-ai.ts`).
    expect(timBia('Dữ liệu app tính chưa có sao Vệ Thần.', `${d}\nSao Vệ Thần của tôi ở đâu?`, TU_NGUOI)).toEqual([]);
    // Do AI that 05/11: gpt-oss chen U+202F giua chu — ten la, ten tu dien van bat, vi tri giu nguyen.
    expect(timBia(loi.replace(/Vệ Thần/gu, 'Vệ Thần'), d, TU_NGUOI)).toEqual(timBia(loi, d, TU_NGUOI));
    expect(timBia('Gặp sao La Hầu.', 'không có', ['La Hầu'])).toEqual([{ tu: 'La Hầu', vt: 8 }]);
  });
});
