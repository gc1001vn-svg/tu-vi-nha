/**
 * Kinh Dich (`src/loi/kinhDich.ts`): bang 64 que (vach rieng tung que, cap que Van Vuong), gieo du 4.096 cach, luat Chu Hy,
 * Mai Hoa: 14 vi du trong 《梅花易數》 (so agent tra 20/10 tinh lai, khop loi sach) + doi gio ra ngay am, gio Tý.
 */
import { amSangDuong, soNgay, tuSoNgay } from '../src/loi/amLich.ts';
import { doanCanDoc, gieo, maiHoaTheoGio, maiHoaTuSo, quai, soQue, tenHao, vachQue, type Hao } from '../src/loi/kinhDich.ts';
import { DUNG_CUU, DUNG_LUC, QUE } from '../src/loi/kinhDichChu.ts';
import { GIAI } from '../src/loi/kinhDichGiai.ts';

const HAN_QUAI = '乾兌離震巽坎艮坤'; // so Tien Thien 1–8
const QH = (han: string): number => HAN_QUAI.indexOf(han) + 1;

describe('bảng 64 quẻ', () => {
  it('mỗi quẻ một bộ vạch riêng, đủ 6 hào, tên Việt khớp quái', () => {
    expect(QUE).toHaveLength(64);
    expect(new Set(QUE.map((_, i) => vachQue(i + 1).join(''))).size).toBe(64);
    expect(QUE.filter((q) => q.hao.length !== 6 || q.hao.some((h) => h === '') || q.thoan === '')).toEqual([]);
    expect([DUNG_CUU, DUNG_LUC]).toEqual(['見群龍无首吉', '利永貞']);
    // ten day du = tuong quai tren + tuong quai duoi + ten ngan; 8 que thuan goi "Thuần …"
    const sai = QUE.filter((q) => q.tenDu !== (q.duoi === q.tren ? `Thuần ${q.ten}` : `${quai(q.tren).tuong} ${quai(q.duoi).tuong} ${q.ten}`));
    expect(sai.map((q) => q.tenDu)).toEqual([]);
  });

  it('lời giải đủ 64 quẻ, mỗi quẻ 6 hào (chính tả kiểm ở LoiGiai.test.ts)', () => {
    expect(GIAI).toHaveLength(64);
    expect(GIAI.flatMap((g, i) => (g.que.length < 40 || g.hao.length !== 6 || g.hao.some((h) => h.length < 10) ? [i + 1] : []))).toEqual([]);
  });

  it('thứ tự Văn Vương: quẻ chẵn là quẻ lẻ lộn ngược, quẻ đối xứng thì đổi hết âm dương', () => {
    for (let n = 1; n < 64; n += 2) {
      const a = vachQue(n);
      const nguoc = [...a].reverse();
      expect(vachQue(n + 1)).toEqual(nguoc.join('') === a.join('') ? a.map((v) => 1 - v) : nguoc);
    }
  });
});

describe('gieo đồng xu', () => {
  it('đủ 4.096 cách: quẻ chủ, hào động, quẻ biến, quẻ hỗ', () => {
    const HAO: readonly Hao[] = [6, 7, 8, 9];
    for (let k = 0; k < 4096; k++) {
      const hao = Array.from({ length: 6 }, (_, i): Hao => HAO[Math.floor(k / 4 ** i) % 4] ?? 7);
      const g = gieo(hao);
      expect(g.chu).toBe(soQue(hao.map((h) => h % 2)));
      expect(g.dong).toEqual(hao.flatMap((h, i) => (h === 6 || h === 9 ? [i + 1] : [])));
      if (g.bien !== null) expect(vachQue(g.bien).filter((v, i) => v !== (hao[i] ?? 0) % 2).length).toBe(g.dong.length);
    }
    expect(gieo([7, 7, 7, 7, 7, 7])).toMatchObject({ chu: 1, bien: null, ho: 1, dong: [] });
    expect(gieo([9, 9, 9, 9, 9, 9])).toMatchObject({ chu: 1, bien: 2, ho: 2 }); // 乾坤無互，互其變卦
    expect(gieo([7, 8, 9, 7, 8, 8])).toMatchObject({ chu: 55, bien: 51, ho: 28 }); // Lôi Hỏa Phong → Thuần Chấn, hỗ Đại Quá
    expect(() => gieo([7, 7, 7])).toThrow(RangeError);
  });

  it('đoạn cần đọc theo luật Chu Hy, đủ 0–6 hào động', () => {
    const doc = (hao: Hao[]): string => doanCanDoc(gieo(hao)).map((d) => `${String(d.que)}${d.loai}${String(d.hao)}${d.chinh ? '*' : ''}`).join(' ');
    expect(doc([7, 7, 7, 7, 7, 7])).toBe('1thoan0*');
    expect(doc([9, 7, 7, 7, 7, 7])).toBe('1hao1*');
    expect(doc([9, 7, 9, 7, 7, 7])).toBe('1hao1 1hao3*');
    expect(doc([9, 9, 9, 7, 7, 7])).toBe('1thoan0* 12thoan0'); // có hào 1 động: quẻ chủ làm chính
    expect(doc([7, 9, 9, 9, 7, 7])).toBe('1thoan0 42thoan0*');
    expect(doc([9, 9, 9, 9, 7, 7])).toBe('20hao5* 20hao6');
    expect(doc([9, 9, 9, 9, 9, 7])).toBe('23hao6*');
    expect(doc([9, 9, 9, 9, 9, 9])).toBe('1dung0*');
    expect(doc([6, 6, 6, 6, 6, 6])).toBe('2dung0*');
    expect(doc([9, 6, 9, 6, 9, 6])).toBe('64thoan0*');
  });

  it('tên hào kiểu sách', () => {
    expect([tenHao(1, 1), tenHao(2, 2), tenHao(1, 6), tenHao(2, 6), tenHao(3, 5)]).toEqual(['Sơ Cửu', 'Lục Nhị', 'Thượng Cửu', 'Thượng Lục', 'Cửu Ngũ']);
  });
});

describe('Mai Hoa', () => {
  // [vi du, tong tren, tong duoi, tong dong, que chu, hao dong, que bien, ho tren, ho duoi, The, Dung] — 梅花易數 quyen 1–2
  const SACH: [string, number, number, number, number, number, number, string, string, string, string][] = [
    ['觀梅占', 34, 43, 43, 49, 1, 31, '乾', '巽', '兌', '離'],
    ['牡丹占', 25, 29, 29, 44, 5, 50, '乾', '乾', '巽', '乾'],
    ['鄰夜扣門', 1, 5, 16, 44, 4, 57, '乾', '乾', '巽', '乾'],
    ['今日動靜', 8, 5, 13, 46, 1, 11, '震', '兌', '坤', '巽'],
    ['西林寺', 7, 8, 15, 23, 3, 52, '坤', '坤', '艮', '坤'],
    ['西林寺+2', 7, 10, 17, 41, 5, 61, '坤', '震', '兌', '艮'],
    ['老人憂色', 1, 5, 10, 44, 4, 57, '乾', '乾', '巽', '乾'],
    ['少年喜色', 7, 3, 17, 22, 5, 37, '震', '坎', '離', '艮'],
    ['牛哀鳴', 8, 6, 21, 7, 3, 46, '坤', '震', '坤', '坎'],
    ['雞悲鳴', 5, 1, 10, 9, 4, 1, '離', '兌', '乾', '巽'],
    ['枯枝墜地', 3, 2, 10, 38, 4, 41, '坎', '離', '兌', '離'],
    ['加數例-王', 20, 27, 27, 55, 3, 51, '兌', '巽', '震', '離'],
    ['加數例-田', 22, 29, 29, 48, 5, 46, '離', '兌', '巽', '坎'],
    ['加數例-韓', 37, 44, 44, 42, 2, 61, '艮', '坤', '巽', '震'],
  ];

  it.each(SACH)('%s', (_, t, d, dg, chu, dong, bien, hoTren, hoDuoi, the, dung) => {
    const m = maiHoaTuSo(t, d, dg);
    const ho = QUE[m.ho - 1];
    expect({ chu: m.chu, dong: m.dong, bien: m.bien, ho: [ho?.tren, ho?.duoi], the: m.the, dung: m.dung })
      .toEqual({ chu, dong: [dong], bien, ho: [QH(hoTren), QH(hoDuoi)], the: QH(the), dung: QH(dung) });
  });

  it('theo giờ: năm Thìn tháng Chạp ngày 17 giờ Thân (觀梅占) ra quẻ 49; 23 giờ tính sang ngày sau', () => {
    const d = amSangDuong({ nam: 2024, thang: 12, ngay: 17, nhuan: false }); // nam Giáp Thìn
    const m = maiHoaTheoGio(d, 16);
    // sach: "兌金為體，離火克之" — Dung khac The, co gai be canh hoa nga gay dui
    expect({ soNam: m.soNam, soGio: m.soGio, chu: m.chu, dong: m.dong, quanHe: m.quanHe }).toEqual({ soNam: 5, soGio: 9, chu: 49, dong: [1], quanHe: 'dungKhacThe' });
    expect(maiHoaTheoGio(d, 23)).toEqual(maiHoaTheoGio(tuSoNgay(soNgay(d) + 1), 0));
    expect(() => maiHoaTheoGio(d, 24)).toThrow(RangeError);
  });
});
