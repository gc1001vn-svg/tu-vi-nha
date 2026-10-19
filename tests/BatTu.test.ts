/**
 * Bat tu (`src/loi/batTu.ts`): 300 ca `sxtwl` (`tests/vang/bat-tu-sxtwl.json`, sinh bang `scripts/doi-chieu/so-bat-tu.py`;
 * ca 2.700 ca chay bang `so-bat-tu.mjs`), ca bien (gio Ty phai A, Lap Xuan 2013 — QUY_UOC muc 0 — truoc/sau 10 phut,
 * sat giao tiet, khong ro gio), dai van, va doi chieu thap than, tang can, nap am, truong sinh voi `EightChar` cua thu vien.
 * Ngay sinh trong file nay deu la ngay GIA (luat 1 CLAUDE.md).
 */
import { Solar } from 'lunar-typescript';
import vang from './vang/bat-tu-sxtwl.json';
import { NGHIA_THAP_THAN, tinhBatTu, type BatTu } from '../src/loi/batTu.ts';
import { hv } from '../src/loi/hanViet/index.ts';
import { tinhHoSo, type HoSo } from '../src/loi/hoSo.ts';

const XEM = { nam: 2026, thang: 10, ngay: 19 };
/** Gio nhap coi nhu gio +7 (khong doi mui lich su), nhu ca vang. */
const bt = (ngaySinh: string, gioSinh: string | null, o: Partial<HoSo> = {}, xem = XEM): BatTu => {
  const hs: HoSo = { id: 'a', ten: 'Thử', gioiTinh: 'nam', ngaySinh, gioSinh, noiSinh: 'Hà Nội', ...o };
  return tinhBatTu(hs, tinhHoSo(hs, undefined, { doiVeGio7: false }).chinh, xem);
};
const tru = (b: BatTu): string[] => b.tru.map((t) => (t === null ? '?' : `${t.can} ${t.chi}`));
const ten = (gz: string): string => `${hv('can', gz.charAt(0))} ${hv('chi', gz.charAt(1))}`;
const tach = (t: string): [string, string] => [t.slice(0, 10), t.slice(11, 16)];

describe('bat tu: bon tru', () => {
  test('300 ca sxtwl: nam, thang theo thoi khac tiet, ngay gio phai A', () => {
    const lech = vang.ca.flatMap(([t = '', ...gz]) => {
      const may = tru(bt(...tach(t)));
      const mong = gz.slice(0, 4).map(ten);
      return may.join(' | ') === mong.join(' | ') ? [] : [`${t}: may ${may.join(' | ')} / sxtwl ${mong.join(' | ')}`];
    });
    expect(lech).toEqual([]);
    expect(vang.ca.filter((c) => c[5] === 'tiet').length).toBeGreaterThanOrEqual(30);
    expect(vang.ca.filter((c) => c[0]?.slice(11, 13) === '23').length).toBeGreaterThanOrEqual(10);
  });

  test('gio Ty phai A: tu 23:00 la ngay hom sau, can gio theo ngay do (QUY_UOC muc 4)', () => {
    expect(tru(bt('2026-10-14', '23:30')).slice(2)).toEqual(['Nhâm Tuất', 'Canh Tý']);
    expect(tru(bt('2026-10-15', '00:30')).slice(2)).toEqual(['Nhâm Tuất', 'Canh Tý']);
    expect(tru(bt('2026-10-14', '22:59')).slice(2)).toEqual(['Tân Dậu', 'Kỷ Hợi']);
  });

  test('Lap Xuan 2013 (03/02 23:13 gio VN): truoc, sau 10 phut', () => {
    const truoc = bt('2013-02-03', '23:03');
    expect(tru(truoc)).toEqual(['Nhâm Thìn', 'Quý Sửu', 'Tân Sửu', 'Mậu Tý']);
    expect(tru(bt('2013-02-03', '23:23'))).toEqual(['Quý Tỵ', 'Giáp Dần', 'Tân Sửu', 'Mậu Tý']);
    expect(truoc.ghiChu).toContain('Nếu sinh muộn hơn 15 phút: trụ năm Quý Tỵ, trụ tháng Giáp Dần');
  });

  test('sat giao tiet: Han Lo 2026 (08/10 13:29 gio VN) doi tru thang dung thoi khac', () => {
    expect(tru(bt('2026-10-08', '13:19'))[1]).toBe('Đinh Dậu');
    expect(tru(bt('2026-10-08', '13:39'))[1]).toBe('Mậu Tuất');
    expect(bt('2026-10-08', '13:39').ghiChu).toEqual(['Nếu sinh sớm hơn 15 phút: trụ tháng Đinh Dậu']);
    expect(bt('2026-10-08', '18:00').ghiChu).toEqual([]);
  });

  test('khong ro gio: 3 tru, tru gio "?", ngay giao tiet thi ghi gio tiet (QUY_UOC muc 9)', () => {
    const b = bt('2024-02-04', null);
    expect(tru(b)).toEqual(['Quý Mão', 'Ất Sửu', 'Mậu Tuất', '?']);
    expect(b.nguHanh.reduce((s, x) => s + x.so, 0)).toBe(6);
    expect(b.ghiChu.join(' ')).toContain('±2 tháng');
    expect(b.ghiChu).toContain('Ngày sinh có tiết Lập Xuân lúc 15:27 giờ VN: sinh sau giờ đó thì trụ năm Giáp Thìn, trụ tháng Bính Dần, đại vận cũng khác.');
    expect(bt('2024-06-01', null).ghiChu).toHaveLength(1);
    // Khoi van tinh luc 12:00.
    expect(b.khoiVan).toEqual(bt('2024-02-04', '12:00').khoiVan);
  });

  test('thap than, tang can, nap am, truong sinh, khong vong khop EightChar cua thu vien (gio dong ho, sect 1)', () => {
    let so = 0;
    const lech: string[] = [];
    for (const [t = ''] of vang.ca) {
      const [ngay, gio] = tach(t);
      const [y = 0, m = 0, d = 0] = ngay.split('-').map(Number);
      const [h = 0, p = 0] = gio.split(':').map(Number);
      const e = Solar.fromYmdHms(y, m, d, h, p, 0).getLunar().getEightChar();
      e.setSect(1);
      const b = bt(ngay, gio);
      const thu = [
        [e.getYear(), e.getYearShiShenGan(), e.getYearHideGan(), e.getYearShiShenZhi(), e.getYearNaYin(), e.getYearDiShi()],
        [e.getMonth(), e.getMonthShiShenGan(), e.getMonthHideGan(), e.getMonthShiShenZhi(), e.getMonthNaYin(), e.getMonthDiShi()],
        [e.getDay(), e.getDayShiShenGan(), e.getDayHideGan(), e.getDayShiShenZhi(), e.getDayNaYin(), e.getDayDiShi()],
        [e.getTime(), e.getTimeShiShenGan(), e.getTimeHideGan(), e.getTimeShiShenZhi(), e.getTimeNaYin(), e.getTimeDiShi()],
      ] as const;
      thu.forEach(([gz, tt, an, ttAn, napAm, ts], i) => {
        const x = b.tru[i];
        // Thu vien doc gio +7 nhu gio +8: sat tiet trong vong 1 gio thi tru nam/thang cua no lech — bo qua tru do.
        if (x === null || x === undefined || `${x.can} ${x.chi}` !== ten(gz)) return;
        so++;
        const mong = [hv('thapThan', tt), an.map((c, k) => `${hv('can', c)} ${hv('thapThan', ttAn[k] ?? '')}`).join(', '),
          hv('napAm', napAm), hv('truongSinh', ts)];
        const may = [x.thapThan, x.tangCan.map((c) => `${c.can} ${c.thapThan}`).join(', '), x.napAm, x.truongSinh];
        if (may.join(' / ') !== mong.join(' / ')) lech.push(`${t} tru ${String(i)}: may ${may.join(' / ')} / thu vien ${mong.join(' / ')}`);
      });
      const kv = Array.from(e.getDayXunKong()).map((c) => hv('chi', c)).join(', ');
      if (b.khongVong !== kv) lech.push(`${t} khong vong: may ${b.khongVong} / thu vien ${kv}`);
      if (b.nguHanh.reduce((s, x) => s + x.so, 0) !== 8) lech.push(`${t}: ngu hanh khong du 8 chu`);
      if (b.nghiaNhatChu === '' || b.tru.some((x) => x !== null && x.thapThan !== 'Nhật Chủ' && !(x.thapThan in NGHIA_THAP_THAN))) {
        lech.push(`${t}: thieu loi giai nhat chu / thap than`);
      }
    }
    expect(lech).toEqual([]);
    expect(so).toBeGreaterThan(1150);
  });
});

describe('bat tu: dai van', () => {
  test('khoi van: 3 ngay = 1 nam, 6 gio = 1 thang, 12 phut = 1 ngay, dem tu thoi khac sinh gio +8 toi tiet', () => {
    // 15/03/1985 02:00 gio VN = 03:00 Bac Kinh; nam At (am) + nam -> di nghich, dem lui toi Kinh Trap 05/03 23:16:21 (+8).
    const tiet = Solar.fromYmdHms(1985, 3, 15, 3, 0, 0).getLunar().getPrevJie().getSolar();
    const phut = Solar.fromYmdHms(1985, 3, 15, 3, 0, 0).subtractMinute(tiet);
    const b = bt('1985-03-15', '02:00');
    expect(b.thuan).toBe(false);
    expect(b.khoiVan).toEqual({ nam: Math.floor(phut / 4320), thang: Math.floor((phut % 4320) / 360), ngay: Math.floor((phut % 360) / 12) });
    expect(b.khoiVan).toEqual({ nam: 3, thang: 0, ngay: 18 });
  });

  test('8 van lien tiep tu tru thang; thuan/nghich theo nam am duong va gioi tinh; van dang chay; tuoi mu', () => {
    const b = bt('1985-03-15', '02:00');
    expect(b.daiVan.map((v) => v.canChi)).toEqual(['Mậu Dần', 'Đinh Sửu', 'Bính Tý', 'Ất Hợi', 'Giáp Tuất', 'Quý Dậu', 'Nhâm Thân', 'Tân Mùi']);
    expect(b.daiVan.map((v) => v.tuoi)).toEqual([4, 14, 24, 34, 44, 54, 64, 74]);
    expect(b.daiVan[0]?.batDau).toEqual({ nam: 1988, thang: 4, ngay: 2 });
    expect(b.daiVan.filter((v) => v.dangChay).map((v) => v.canChi)).toEqual(['Ất Hợi']);
    expect(bt('1985-03-15', '02:00', {}, { nam: 2018, thang: 4, ngay: 1 }).daiVan.find((v) => v.dangChay)?.canChi).toBe('Bính Tý');
    expect(bt('1985-03-15', '02:00', {}, { nam: 1988, thang: 4, ngay: 1 }).daiVan.some((v) => v.dangChay)).toBe(false);
    // Nu nam At (am) di thuan: van dau la can chi sau Ky Mao.
    const nu = bt('1985-03-15', '02:00', { gioiTinh: 'nu' });
    expect([nu.thuan, nu.daiVan[0]?.canChi]).toEqual([true, 'Canh Thìn']);
    // Nam Giap (duong): nam thuan, nu nghich.
    expect([bt('1984-06-01', '12:00').thuan, bt('1984-06-01', '12:00', { gioiTinh: 'nu' }).thuan]).toEqual([true, false]);
    // Sinh truoc Tet (10/01/1985 thuoc nam am Giap Ty): tuoi mu tinh tu nam am 1984.
    const tet = bt('1985-01-10', '12:00');
    expect(tet.daiVan.map((v) => v.tuoi - (v.batDau.nam - 1984 + 1))).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });
});
