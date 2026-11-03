/**
 * Luan phi tinh (`src/loi/phiTinhLuan.ts`, ke hoach 2026-11-03-phi-tinh): nam 2026 (Nhất Bạch giua; Nam co Thai Tue + Ngu Hoang, Bac co
 * Tue Pha + Tam Sat, Tay Bac Nhi Hac); thang nang nhat dung la sao xau nam va thang chong nhau; quet 1901–2099 moi thang: du doan, chu
 * dung quy uoc.
 */
import { phiTinh } from '../src/loi/phiTinh.ts';
import { deYen, luanPhiTinh } from '../src/loi/phiTinhLuan.ts';
import { GIUA, NHAC } from '../src/loi/phiTinhLuanLoi.ts';

const saiChu = (v: string): string | null => (v.trim() === '' || v.trim() !== v || /\s{2}/u.test(v) || v.includes('undefined') ? 'rong / thua cach'
  : v.normalize('NFC') !== v ? 'chua NFC' : /(?<![qQ])(o[àáảãạ]|o[èéẻẽẹ]|u[ỳýỷỹỵ])(?!\p{L})/iu.test(v) ? 'dau kieu moi'
    : /(?<!\p{L})(tị|kỉ|kị)(?!\p{L})/iu.test(v) ? 'viet Tỵ, Kỷ, Kỵ' : /Hoả|Thuỷ/u.test(v) ? 'viet Hỏa, Thủy' : null);

describe('luan phi tinh', () => {
  test('2026: Nhất Bạch giua; gop huong ky theo huong; huong thuan khong trung huong de yen', () => {
    const p = phiTinh({ nam: 2026, thang: 6, ngay: 15 });
    const yen = deYen(p);
    expect([yen.get('Nam'), yen.get('Bắc'), yen.get('Tây Bắc')]).toEqual([['Thái Tuế', 'Ngũ Hoàng'], ['Tuế Phá', 'Tam Sát'], ['Nhị Hắc']]);
    const l = luanPhiTinh(p);
    expect([l[0]?.loi[0], l.at(-1)?.loi, /(: |, )(Nam|Bắc|Tây Bắc) \(/u.test(l[0]?.loi[2] ?? '')]).toEqual([GIUA[0], [...NHAC], false]);
  });

  test('1901–2099 moi thang: du 5 doan, chu dung quy uoc; huong "nang nhat" la noi sao 2 hoac 5 nam gap 2 hoac 5 thang', () => {
    const sai: string[] = [];
    for (let nam = 1901; nam <= 2099; nam += 7) for (let thang = 1; thang <= 12; thang++) {
      const p = phiTinh({ nam, thang, ngay: 15 });
      const l = luanPhiTinh(p);
      expect(l).toHaveLength(5);
      for (const x of l.flatMap((d) => [d.tieuDe, ...d.loi])) { const e = saiChu(x); if (e !== null) sai.push(`${String(nam)}/${String(thang)}: ${e} — ${x}`); }
      const nang = l[1]?.loi[0] ?? '';
      for (const h of ['Bắc', 'Nam', 'Đông', 'Tây', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'] as const) {
        const ca = [2, 5].includes(p.nam.o[h].so) && [2, 5].includes(p.thang.o[h].so);
        if (nang.startsWith('Tháng này nặng nhất')) expect(new RegExp(`(: |; )${h} \\(năm`, 'u').test(nang)).toBe(ca);
      }
    }
    expect(sai.slice(0, 5)).toEqual([]);
  });
});
