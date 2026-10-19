/**
 * Bat tu (tu tru) va dai van cua mot nguoi, tu thoi diem sinh da doi ve gio +7 (`KetQuaHoSo.duong7` + `phut7`).
 * Quy uoc `docs/QUY_UOC.md`: muc 1, 2 (tru nam, thang theo Lap Xuan / 12 tiet dung thoi khac), 4 (phai A: tu 23:00
 * tinh ngay hom sau), 8 (sat ranh ±15 phut thi hien them phuong an), 9 (khong ro gio: 3 tru, khoi van luc 12:00).
 * Thuoc: `tests/BatTu.test.ts` (300 ca `sxtwl` o `tests/vang/bat-tu-sxtwl.json` + ca bien); 2.400 ca:
 * `scripts/doi-chieu/so-bat-tu.py` roi `so-bat-tu.mjs`.
 */
import { LunarUtil, Solar, type Lunar } from 'lunar-typescript';
import { CAN, CHI, soNgay, tuSoNgay, type NgayDuong } from './amLich.ts';
import { hv } from './hanViet/index.ts';
import type { HoSo, KetQuaHoSo } from './hoSo.ts';

export interface TangCan { readonly can: string; readonly thapThan: string }
export interface Tru {
  readonly can: string;
  readonly chi: string;
  /** Thap than cua can so voi nhat chu; tru ngay ghi "Nhật Chủ". */
  readonly thapThan: string;
  readonly tangCan: readonly TangCan[];
  readonly napAm: string;
  /** Truong sinh (dia the) cua nhat chu tai chi cua tru nay. */
  readonly truongSinh: string;
}
export interface DaiVan { readonly canChi: string; readonly tuoi: number; readonly batDau: NgayDuong; readonly dangChay: boolean }
export interface BatTu {
  /** Nam, thang, ngay, gio; gio = null khi khong ro gio. */
  readonly tru: readonly [Tru, Tru, Tru, Tru | null];
  /** Vd "Kỷ Thổ". */
  readonly nhatChu: string;
  readonly nghiaNhatChu: string;
  /** Hai chi tuan khong cua tru ngay, vd "Tuất, Hợi". */
  readonly khongVong: string;
  /** Dem 8 chu (6 khi khong ro gio): can theo hanh can, chi theo hanh chinh — khong cong tang can. */
  readonly nguHanh: readonly { readonly hanh: string; readonly so: number }[];
  readonly khoiVan: { readonly nam: number; readonly thang: number; readonly ngay: number };
  readonly thuan: boolean;
  /** 8 van, moi van 10 nam; `tuoi` = tuoi mu nam bat dau (QUY_UOC muc 3). */
  readonly daiVan: readonly DaiVan[];
  /** Phuong an sat ranh, khong ro gio — moi dong mot cau de hien. */
  readonly ghiChu: readonly string[];
}

/** Loi Claude soan lai theo quan niem dan gian (luat 6), mot dong moi can cua nhat chu. */
const NGHIA_CAN: Readonly<Record<string, string>> = {
  '甲': 'Dương Mộc, như cây lớn: thẳng thắn, muốn vươn lên, thích đứng đầu.',
  '乙': 'Âm Mộc, như cỏ hoa, dây leo: mềm mỏng, khéo xoay xở, dễ thích nghi.',
  '丙': 'Dương Hỏa, như mặt trời: sôi nổi, rộng rãi, thích được thấy.',
  '丁': 'Âm Hỏa, như ngọn đèn: ấm áp, tinh tế, chu đáo với người gần.',
  '戊': 'Dương Thổ, như núi, đất dày: vững vàng, đáng tin, chậm thay đổi.',
  '己': 'Âm Thổ, như đất ruộng vườn: bao dung, chịu khó, giỏi vun đắp.',
  '庚': 'Dương Kim, như sắt thép: cứng rắn, quyết đoán, trọng nghĩa.',
  '辛': 'Âm Kim, như châu ngọc: tinh tế, kỹ tính, giữ thể diện.',
  '壬': 'Dương Thủy, như sông biển: rộng lượng, năng động, nhiều ý tưởng.',
  '癸': 'Âm Thủy, như mưa sương: kín đáo, nhạy cảm, thấm dần mà bền.',
};

/** Loi Claude soan lai theo quan niem dan gian, mot dong moi thap than (khoa la ten tieng Viet). */
export const NGHIA_THAP_THAN: Readonly<Record<string, string>> = {
  'Tỷ Kiên': 'cùng hành, cùng âm dương với nhật chủ: anh em, bạn bè, tính tự lập.',
  'Kiếp Tài': 'cùng hành, khác âm dương: bạn mà cũng là người tranh phần, dám liều, dễ hao tiền.',
  'Thực Thần': 'nhật chủ sinh ra, cùng âm dương: tài khéo, ăn ở thong thả, phúc lộc.',
  'Thương Quan': 'nhật chủ sinh ra, khác âm dương: sáng tạo, giỏi nói, không chịu gò bó.',
  'Thiên Tài': 'nhật chủ khắc, cùng âm dương: tiền bất ngờ, buôn bán, hào phóng.',
  'Chính Tài': 'nhật chủ khắc, khác âm dương: tiền làm ra đều đặn, cần kiệm.',
  'Thất Sát': 'khắc nhật chủ, cùng âm dương: áp lực, uy quyền, dám đương đầu.',
  'Chính Quan': 'khắc nhật chủ, khác âm dương: kỷ luật, danh dự, chức phận.',
  'Thiên Ấn': 'sinh nhật chủ, cùng âm dương: học điều lạ, trực giác, nghề riêng.',
  'Chính Ấn': 'sinh nhật chủ, khác âm dương: mẹ, thầy, học vấn, được che chở.',
};

const TEN_TRU = ['năm', 'tháng', 'ngày', 'giờ'] as const;
const HANH = ['金', '木', '水', '火', '土'] as const;
/** Thu vien tinh tiet theo gio Bac Kinh (+8): dua thoi diem +7 cong 60 phut. */
const BAC_KINH = 60;

/** Solar dong ho o phut tuyet doi `p` (so ngay Julius × 1440 + phut trong ngay; mui le +7:06:30 cho ra nua phut). */
function solarLuc(p: number): Solar {
  const ngay = Math.floor(p / 1440);
  const d = tuSoNgay(ngay);
  const giay = Math.round((p - ngay * 1440) * 60);
  return Solar.fromYmdHms(d.nam, d.thang, d.ngay, Math.floor(giay / 3600), Math.floor(giay / 60) % 60, giay % 60);
}

/** Chi so [can, chi] cua bon tru o thoi diem `p7` (gio +7); khong ro gio thi khong co tru gio. */
function chiSo(p7: number, coGio: boolean): { lunar: Lunar; so: (readonly [number, number])[] } {
  const lunar = solarLuc(p7 + BAC_KINH).getLunar();
  // Phai A: tu 23:00 gio VN la ngay hom sau, tuc ngay theo dong ho +8 — can chi ngay tu so ngay Julius nhu amLich.
  const jd = Math.floor((p7 + 60) / 1440);
  const ngay = [(jd + 9) % 10, (jd + 1) % 12] as const;
  const so = [
    [lunar.getYearGanIndexExact(), lunar.getYearZhiIndexExact()] as const,
    [lunar.getMonthGanIndexExact(), lunar.getMonthZhiIndexExact()] as const,
    ngay,
  ];
  if (coGio) {
    // Chi gio theo dong ho VN (23–01 Ty); can gio theo ngay phai A (Ty 23:xx lay can cua ngay sau).
    const chi = Math.floor((p7 - Math.floor(p7 / 1440) * 1440 + 60) / 120) % 12;
    so.push([(ngay[0] % 5 * 2 + chi) % 10, chi] as const);
  }
  return { lunar, so };
}

function lapTru(can: number, chi: number, nhat: number, laNgay: boolean): Tru {
  const g = CAN.charAt(can), z = CHI.charAt(chi), nc = CAN.charAt(nhat);
  const thapThan = (c: string): string => hv('thapThan', LunarUtil.SHI_SHEN[nc + c] ?? '');
  // Dia the nhu EightChar.getDiShi cua thu vien: nhat chu duong di thuan, am di nghich tu cung Truong Sinh.
  const ts = ((LunarUtil.CHANG_SHENG_OFFSET[nc] ?? 0) + (nhat % 2 === 0 ? chi : -chi) + 12) % 12;
  return {
    can: hv('can', g),
    chi: hv('chi', z),
    thapThan: laNgay ? hv('thapThan', '日主') : thapThan(g),
    tangCan: (LunarUtil.ZHI_HIDE_GAN[z] ?? []).map((c) => ({ can: hv('can', c), thapThan: thapThan(c) })),
    napAm: hv('napAm', LunarUtil.NAYIN[g + z] ?? ''),
    truongSinh: hv('truongSinh', LunarUtil.CHANG_SHENG[ts] ?? ''),
  };
}

function lap(p7: number, coGio: boolean): { lunar: Lunar; so: (readonly [number, number])[]; tru: BatTu['tru'] } {
  const { lunar, so } = chiSo(p7, coGio);
  const nhat = so[2]?.[0] ?? 0;
  const [nam, thang, ngay, gio] = so.map(([g, z], i) => lapTru(g, z, nhat, i === 2));
  if (nam === undefined || thang === undefined || ngay === undefined) throw new Error('thieu tru');
  return { lunar, so, tru: [nam, thang, ngay, gio ?? null] };
}

/** "trụ tháng Đinh Sửu, trụ giờ Canh Tý" — cac tru cua `b` khac `a` (rong = giong het). */
export function khacTru(a: BatTu['tru'], b: BatTu['tru']): string {
  return b.flatMap((t, i) => {
    const x = a[i];
    return t !== null && (x?.can !== t.can || x?.chi !== t.chi) ? [`trụ ${TEN_TRU[i] ?? ''} ${t.can} ${t.chi}`] : [];
  }).join(', ');
}

const hai = (n: number): string => String(n).padStart(2, '0');

export function tinhBatTu(hs: HoSo, kq: KetQuaHoSo, ngayXem: NgayDuong): BatTu {
  const coGio = kq.phut7 !== null;
  const dauNgay = soNgay(kq.duong7) * 1440;
  // Khong ro gio: lay 12:00 cho ca tru lan khoi van (QUY_UOC muc 9).
  const p7 = dauNgay + (kq.phut7 ?? 720);
  const { lunar, so, tru } = lap(p7, coGio);
  const nhat = CAN.charAt(so[2]?.[0] ?? 0);

  const ghiChu: string[] = [];
  if (coGio) {
    for (const [d, lyDo] of [[-15, 'Nếu sinh sớm hơn 15 phút'], [15, 'Nếu sinh muộn hơn 15 phút']] as const) {
      const khac = khacTru(tru, lap(p7 + d, true).tru);
      if (khac !== '') ghiChu.push(`${lyDo}: ${khac}`);
    }
  } else {
    ghiChu.push('Không rõ giờ: không có trụ giờ; tuổi khởi vận tính lúc 12:00, có thể lệch tới ±2 tháng.');
    // Ngay giao tiet: tiet roi 00:00–22:59 gio VN thi sinh truoc/sau gio do khac tru thang (nam, neu la Lap Xuan).
    for (const [p, truoc] of [[dauNgay, true], [dauNgay + 22 * 60 + 59, false]] as const) {
      const khac = khacTru(tru, lap(p, false).tru);
      if (khac === '') continue;
      const tiet = truoc ? lunar.getPrevJie() : lunar.getNextJie();
      const s = tiet.getSolar();
      ghiChu.push(`Ngày sinh có tiết ${hv('tietKhi', tiet.getName())} lúc ${hai((s.getHour() + 23) % 24)}:${hai(s.getMinute())} giờ VN: `
        + `sinh ${truoc ? 'trước' : 'sau'} giờ đó thì ${khac}, đại vận cũng khác.`);
    }
  }

  // Dai van: lunar-typescript, sect 2 = tinh tung phut tu luc sinh toi tiet (3 ngay = 1 nam, 6 gio = 1 thang,
  // 12 phut = 1 ngay); sect 1 lam tron theo ngay lich va canh gio (2 gio = 10 ngay). Lunar dua vao la gio +8.
  const yun = lunar.getEightChar().getYun(hs.gioiTinh === 'nam' ? 1 : 0, 2);
  const dau = solarLuc(p7).nextYear(yun.getStartYear()).nextMonth(yun.getStartMonth()).next(yun.getStartDay())
    .nextHour(yun.getStartHour());
  const moc = Array.from({ length: 9 }, (_, i) => {
    const s = dau.nextYear(i * 10);
    return { nam: s.getYear(), thang: s.getMonth(), ngay: s.getDay() };
  });
  const xem = soNgay(ngayXem);
  const daiVan = yun.getDaYun(9).slice(1).map((v, i): DaiVan => {
    const [g = '', z = ''] = Array.from(v.getGanZhi());
    const batDau = moc[i] ?? moc[0] ?? kq.duong7;
    const sau = moc[i + 1] ?? batDau;
    return {
      canChi: `${hv('can', g)} ${hv('chi', z)}`,
      tuoi: batDau.nam - kq.am.nam + 1,
      batDau,
      dangChay: soNgay(batDau) <= xem && xem < soNgay(sau),
    };
  });

  const chu = so.flatMap(([g, z]) => [LunarUtil.WU_XING_GAN[CAN.charAt(g)], LunarUtil.WU_XING_ZHI[CHI.charAt(z)]]);
  return {
    tru,
    nhatChu: `${hv('can', nhat)} ${hv('nguHanh', LunarUtil.WU_XING_GAN[nhat] ?? '')}`,
    nghiaNhatChu: NGHIA_CAN[nhat] ?? '',
    khongVong: Array.from(LunarUtil.getXunKong(nhat + CHI.charAt(so[2]?.[1] ?? 0))).map((c) => hv('chi', c)).join(', '),
    nguHanh: HANH.map((h) => ({ hanh: hv('nguHanh', h), so: chu.filter((c) => c === h).length })),
    khoiVan: { nam: yun.getStartYear(), thang: yun.getStartMonth(), ngay: yun.getStartDay() },
    thuan: yun.isForward(),
    daiVan,
    ghiChu,
  };
}
