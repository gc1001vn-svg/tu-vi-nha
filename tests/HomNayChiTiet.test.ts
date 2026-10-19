/**
 * Chi tiet ngay (`chiTietNgay`, `gioTotTheoTuoi` o `src/loi/homNay.ts`): vai ngay tra tay (nguon ghi o tung ca, trich
 * doan tim kiem 19/10/2026 — may ao chan mo trang goc), quet so thu vien 1900–2100: nen/kieng, than sat theo thang tiet
 * gio VN nen chi lech thu vien (gio Bac Kinh) o ngay tiet roi 23:xx gio VN, va ngay do ra theo thang moi.
 */
import { Lunar, LunarUtil, Solar } from 'lunar-typescript';
import { amSangDuong, soNgay, tuSoNgay, type NgayDuong } from '../src/loi/amLich.ts';
import { BANG, hv, type Bang, type Nhom } from '../src/loi/hanViet/index.ts';
import { chiTietNgay, gioTotTheoTuoi, xemNgay } from '../src/loi/homNay.ts';

const ngay = (s: string): NgayDuong => {
  const [nam = 0, thang = 0, d = 0] = s.split('-').map(Number);
  return { nam, thang, ngay: d };
};
const ymd = (d: NgayDuong): string => `${String(d.nam)}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;
const vn = (nhom: Nhom, chu: string): string => (BANG[nhom] as Bang)[chu]?.nghia ?? hv(nhom, chu);

/** Nen/kieng, cat than/hung sat thu vien tinh voi thang cua `t` (thang tiet theo ngay giao tiet gio Bac Kinh). */
const theoThang = (l: Lunar, t: Lunar): Record<string, string[]> => {
  const gz = l.getDayInGanZhi();
  return {
    nen: LunarUtil.getDayYi(t.getMonthInGanZhi(), gz).map((c) => vn('nenKieng', c)),
    kieng: LunarUtil.getDayJi(t.getMonthInGanZhi(), gz).map((c) => vn('nenKieng', c)),
    saoTot: LunarUtil.getDayJiShen(t.getMonthZhiIndex(), gz).map((c) => vn('thanSat', c)),
    saoXau: LunarUtil.getDayXiongSha(t.getMonthZhiIndex(), gz).map((c) => vn('thanSat', c)),
  };
};
const phanThang = (d: NgayDuong, thang: 'tiet' | 'am' = 'tiet'): Record<string, readonly string[]> => {
  const c = chiTietNgay(d, thang);
  return { nen: c.nen, kieng: c.kieng, saoTot: c.saoTot, saoXau: c.saoXau };
};

describe('chiTietNgay', () => {
  test('19/10/2026 (Bính Dần): khop hoang lich Trung Hoa, 28 tu va sao chung voi lich Viet', () => {
    const c = chiTietNgay(ngay('2026-10-19'));
    // https://www.qmrl888.com/2026-10-19.html: 宜 入殓 破土 启钻 安葬 除服 成服 馀事勿取 · 忌 开市 入宅 祭祀 置产 补垣 塞穴
    // · 彭祖百忌 丙不修灶必见灾殃 寅不祭祀神鬼不尝 · 冲猴(庚申) 煞北.
    expect(c).toMatchObject({
      nen: ['Khâm liệm, nhập quan', 'Đào đất (xây mộ)', 'Bốc mộ, cải táng', 'Chôn cất', 'Bỏ đồ tang, mãn tang', 'Mặc đồ tang',
        'Các việc khác không nên làm'],
      kieng: ['Khai trương', 'Về nhà mới', 'Cúng tế', 'Mua nhà đất, tài sản', 'Vá tường, lấp hố', 'Bít lỗ, lấp hang (kiến, chuột)'],
      banhTo: ['Ngày Bính không nên sửa bếp, ắt gặp tai ương', 'Ngày Dần không nên cúng tế, thần linh không hưởng'],
      // https://www.xemlicham.com/am-lich/nam/2026/thang/10/ngay/19 ghi "kỵ tuổi Canh Thân, Nhâm Thân".
      tuoiXung: 'Canh Thân (Khỉ)', huongSat: 'Bắc', ngayKy: [],
      // https://baohatinh.vn/cong-cu/lich-am/19-10-2026 + xemlicham: sao Tâm, xấu.
      tu28: { ten: 'Tâm Nguyệt Hồ', catHung: 'Xấu', conVat: 'Cáo' },
    });
    // https://baolamdong.vn/am-duong-lich-ngay-19-thang-10-nam-2026.html + xemlicham (he sao lich Viet, rong hon):
    // sao tot Thiên Đức, Nguyệt Đức, Thiên Quan, Tam Hợp, Tư Mệnh; sao xau co Nguyệt Yếm.
    expect(c.saoTot).toEqual(expect.arrayContaining(['Thiên Đức', 'Nguyệt Đức', 'Tam Hợp', 'Tư Mệnh']));
    expect(c.saoXau).toContain('Nguyệt Yếm');
  });

  test('21/10/2026 (Mậu Thìn): khop hai trang hoang lich', () => {
    // https://www.qmrl888.com/2026-10-21.html: 宜 祭祀 沐浴 破屋 坏垣 馀事勿取 · 忌 嫁娶 入宅 上梁 出行 安葬 · 冲狗(壬戌) 煞南.
    // https://wannianli.tianqi.com/laohuangli/2026-10-21.html: 凶煞 月破 大耗 四击 五墓 九空 往亡 复日 · 冲狗 煞南.
    expect(chiTietNgay(ngay('2026-10-21'))).toMatchObject({
      nen: ['Cúng tế', 'Tắm gội (trước khi cúng lễ)', 'Phá dỡ nhà', 'Phá tường cũ', 'Các việc khác không nên làm'],
      kieng: ['Cưới hỏi', 'Về nhà mới', 'Gác xà, cất nóc', 'Xuất hành, đi xa', 'Chôn cất'],
      saoXau: ['Nguyệt Phá', 'Đại Hao', 'Tứ Kích', 'Ngũ Mộ', 'Cửu Không', 'Vãng Vong', 'Phục Nhật'],
      tuoiXung: 'Nhâm Tuất (Chó)', huongSat: 'Nam',
    });
  });

  test('ngay ky theo so ngay am, ca thang nhuan (QUY_UOC muc 2, 5)', () => {
    const ky = (nam: number, thang: number, nhuan: boolean): number[] => Array.from({ length: 29 }, (_, i) => i + 1)
      .filter((n) => chiTietNgay(amSangDuong({ nam, thang, ngay: n, nhuan })).ngayKy.length > 0);
    expect(ky(2026, 9, false)).toEqual([3, 5, 7, 13, 14, 18, 22, 23, 27]);
    expect(ky(2025, 6, true)).toEqual([3, 5, 7, 13, 14, 18, 22, 23, 27]);
    expect(chiTietNgay(ngay('2026-10-12')).ngayKy).toEqual(['Tam Nương']); // 3/9 am
    expect(chiTietNgay(ngay('2026-10-14')).ngayKy).toEqual(['Nguyệt Kỵ']); // 5/9 am
  });

  test('tuy chon thang am: bang dung ket qua thu vien cua mot ngay cung can chi trong thang tiet cung chi', () => {
    // 10/02/2026 (Ất Mão, 23/12 am): thang am la Sửu, thang tiet da sang Dần (QUY_UOC muc 2).
    const d = ngay('2026-02-10');
    const gz = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar().getDayInGanZhi();
    const cung = Array.from({ length: 40 }, (_, k) => tuSoNgay(soNgay(d) - 60 * (k + 1)))
      .map((x) => Solar.fromYmd(x.nam, x.thang, x.ngay).getLunar())
      .find((l) => l.getMonthZhiIndex() === 1 && l.getDayInGanZhi() === gz);
    expect(cung).toBeDefined();
    if (cung !== undefined) expect(phanThang(d, 'am')).toEqual(theoThang(cung, cung));
    expect(phanThang(d, 'am')).not.toEqual(phanThang(d));
  });

  // Ngay VN D ma tiet (12 "tiet", khong tinh 12 trung khi) roi 00:00–00:59 gio Bac Kinh ngay D+1 = 23:xx gio VN ngay D.
  // Chep cach dung tap ngay nay o `tests/HomNay.test.ts` (102 ngay 1900–2100, QUY_UOC muc 11).
  const JIE = new Set(['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒']);
  const moc = new Map<string, NgayDuong>();
  const ngoaiLe = new Set<string>();
  for (let nam = 1899; nam <= 2101; nam++) {
    for (const [ten, s] of Object.entries(Lunar.fromYmd(nam, 6, 1).getJieQiTable())) {
      if (!JIE.has(ten)) continue;
      const d = { nam: s.getYear(), thang: s.getMonth(), ngay: s.getDay() };
      moc.set(ymd(d), d);
      if (s.getHour() === 0) ngoaiLe.add(ymd(tuSoNgay(soNgay(d) - 1)));
    }
  }

  test('07/11/2023 (Lập Đông 23:35 gio VN): ra theo thang Hợi moi, thu vien (gio Bac Kinh) con thang Tuất', () => {
    expect(ngoaiLe.has('2023-11-07')).toBe(true);
    const l = Solar.fromYmd(2023, 11, 7).getLunar();
    expect(phanThang(ngay('2023-11-07'))).toEqual(theoThang(l, Solar.fromYmd(2023, 11, 8).getLunar()));
    expect(phanThang(ngay('2023-11-07'))).not.toEqual(theoThang(l, l));
    expect(chiTietNgay(ngay('2023-11-07')).kieng).toEqual(['Mọi việc đều không nên']);
  });

  test('so thu vien 1900–2100: khop moi ngay tru ngay tiet roi 23:xx gio VN; ngay do theo thang moi; moi chuoi qua bang', () => {
    // Do 19/10: ~0,25 ms/ngay khi di theo thu tu ngay (thu vien giu nam am vua tinh). 1 ngay moi 7 ngay (7, 60 nguyen to
    // cung nhau nen du 60 can chi ngay o moi thang) + moi ngay sat tiet.
    const [dau, cuoi] = [soNgay(ngay('1900-02-01')), soNgay(ngay('2100-12-31'))];
    const chon = new Set<number>();
    for (let jd = dau; jd <= cuoi; jd += 7) chon.add(jd);
    for (const d of moc.values()) for (const k of [-1, 0, 1]) chon.add(soNgay(d) + k);
    const lech: string[] = [];
    const khacThuVien = new Set<string>();
    const sai = /[\p{Script=Han}{}]|sn\./u;
    for (const jd of [...chon].filter((j) => j >= dau && j <= cuoi).sort((a, b) => a - b)) {
      const d = tuSoNgay(jd);
      const c = chiTietNgay(d);
      const l = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
      const chuoi = [...c.nen, ...c.kieng, ...c.saoTot, ...c.saoXau, ...Object.values(c.tu28), ...c.banhTo, c.tuoiXung, c.huongSat];
      if (chuoi.some((s) => s === '' || sai.test(s))) lech.push(`${ymd(d)} con chu thu vien: ${chuoi.join(' | ')}`);
      const m = /^\((.)(.)\)(.)$/u.exec(l.getDayChongDesc());
      if (c.tuoiXung !== `${hv('can', m?.[1] ?? '')} ${hv('chi', m?.[2] ?? '')} (${vn('conGiap', m?.[3] ?? '')})`) {
        lech.push(`${ymd(d)} tuoi xung ${c.tuoiXung} / thu vien ${l.getDayChongDesc()}`);
      }
      const may = JSON.stringify(phanThang(d));
      if (may === JSON.stringify(theoThang(l, l))) continue;
      khacThuVien.add(ymd(d));
      const mai = tuSoNgay(jd + 1);
      if (may !== JSON.stringify(theoThang(l, Solar.fromYmd(mai.nam, mai.thang, mai.ngay).getLunar()))) {
        lech.push(`${ymd(d)} khong theo thang cua ngay hom sau`);
      }
    }
    expect(lech).toEqual([]);
    expect([...khacThuVien].filter((s) => !ngoaiLe.has(s))).toEqual([]);
    expect(khacThuVien.size).toBe([...ngoaiLe].filter((s) => s >= '1900-02-01' && s <= '2100-12-31').length);
  }, 60_000);
});

describe('gioTotTheoTuoi', () => {
  test('gio hoang dao bo gio luc xung chi nam sinh', () => {
    const n = xemNgay(ngay('2026-10-19')); // Bính Dần: hoang dao Tý Sửu Thìn Tỵ Mùi Tuất
    expect(gioTotTheoTuoi(n, 4).map((g) => g.chi)).toEqual(['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi']); // tuoi Thìn xung gio Tuất
    expect(gioTotTheoTuoi(n, 7).map((g) => g.chi)).toEqual(['Tý', 'Thìn', 'Tỵ', 'Mùi', 'Tuất']); // tuoi Mùi xung gio Sửu
    expect(gioTotTheoTuoi(n, 8)).toEqual(n.gioHoangDao); // tuoi Thân xung gio Dần (hac dao)
  });
});

describe('lich Viet tren mang', () => {
  test('ghi truc theo thang am (tuy chon "am"), mac dinh "tiet" ra khac', () => {
    // Trich doan baohatinh.vn/cong-cu/lich-am/<dd-mm-yyyy>, chogia.vn/lich-am/…, baolamdong.vn (tim 19/10/2026):
    // 10/02/2026 Mãn (baohatinh, chogia) · 10/03/2026 Chấp (baohatinh, chogia, baolamdong) · 08/10/2026 Phá (baohatinh,
    // chogia) · 07/11/2023 Nguy (baohatinh, chogia).
    const ca = [['2026-02-10', 'Mãn'], ['2026-03-10', 'Chấp'], ['2026-10-08', 'Phá'], ['2023-11-07', 'Nguy']] as const;
    expect(ca.map(([d]) => xemNgay(ngay(d), 'am').truc)).toEqual(ca.map(([, t]) => t));
    expect(ca.map(([d]) => xemNgay(ngay(d)).truc)).toEqual(['Trừ', 'Định', 'Chấp', 'Phá']);
  });
});
