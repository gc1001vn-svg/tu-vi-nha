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
/** Mot can chi gap tren duong doi (dai van, nam dang xem): thap than cua can va cua chinh khi (tang can dau) cua chi. */
export interface VanNam { readonly canChi: string; readonly thapThan: readonly [string, string]; /** Can chinh an trong chi. */ readonly tang: string }
export interface DaiVan extends VanNam { readonly tuoi: number; readonly batDau: NgayDuong; readonly dangChay: boolean }
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
  /** Cung so chu do, xep theo quan he voi hanh nhat chu: Ty Kiep, Thuc Thuong, Tai, Quan Sat, An (khoa `NHOM_HANH`). */
  readonly nhomHanh: readonly { readonly nhom: string; readonly hanh: string; readonly so: number }[];
  readonly khoiVan: { readonly nam: number; readonly thang: number; readonly ngay: number };
  readonly thuan: boolean;
  /** 8 van, moi van 10 nam; `tuoi` = tuoi mu nam bat dau (QUY_UOC muc 3). */
  readonly daiVan: readonly DaiVan[];
  /** Tru nam cua ngay xem (Lap Xuan dung thoi khac, luc 12:00 gio VN — QUY_UOC muc 1). */
  readonly namNay: VanNam;
  /** Phuong an sat ranh, khong ro gio — moi dong mot cau de hien. */
  readonly ghiChu: readonly string[];
}

/** Loi Claude soan lai theo quan niem dan gian (luat 6): moi can cua nhat chu mot doan — hinh tuong, manh, yeu, hop viec gi. */
const NGHIA_CAN: Readonly<Record<string, string>> = {
  '甲': 'Dương Mộc, như cây lớn: thẳng thắn, muốn vươn lên, thích đứng đầu. Có chí, giữ lời, hay che chở người khác; điểm yếu là '
    + 'cứng, khó cúi đầu, dễ gãy khi sức ép quá lớn. Hợp việc cần dựng nền lâu dài như quản lý, giáo dục, xây dựng.',
  '乙': 'Âm Mộc, như cỏ hoa, dây leo: mềm mỏng, khéo xoay xở, dễ thích nghi. Biết dựa thế, giỏi giao tế, bền bỉ âm thầm; điểm yếu '
    + 'là hay do dự, dễ dựa dẫm. Hợp việc cần khéo léo, tỉ mỉ như thiết kế, tư vấn, buôn bán.',
  '丙': 'Dương Hỏa, như mặt trời: sôi nổi, rộng rãi, thích được thấy. Nhiệt tình, hào phóng, truyền năng lượng cho người khác; điểm '
    + 'yếu là nóng vội, thiếu kiên nhẫn, dễ phô trương. Hợp việc cần xuất hiện, truyền cảm hứng như bán hàng, truyền thông, dẫn dắt nhóm.',
  '丁': 'Âm Hỏa, như ngọn đèn: ấm áp, tinh tế, chu đáo với người gần. Nhạy cảm, có chiều sâu, giỏi soi chi tiết; điểm yếu là hay lo, '
    + 'dễ tổn thương, cảm xúc lên xuống. Hợp việc cần tỉ mỉ, tinh thần như nghiên cứu, nghệ thuật, chăm sóc người khác.',
  '戊': 'Dương Thổ, như núi, đất dày: vững vàng, đáng tin, chậm thay đổi. Trung hậu, giữ chữ tín, chịu được áp lực; điểm yếu là bảo '
    + 'thủ, chậm thích nghi. Hợp việc cần ổn định, bao quát như quản lý, nhà đất, làm chỗ dựa cho tập thể.',
  '己': 'Âm Thổ, như đất ruộng vườn: bao dung, chịu khó, giỏi vun đắp. Khéo chăm lo, thực tế, dễ gần; điểm yếu là hay lo xa, ôm việc, '
    + 'khó từ chối. Hợp việc cần nuôi dưỡng, sắp xếp như giáo dục, dịch vụ, hành chính.',
  '庚': 'Dương Kim, như sắt thép: cứng rắn, quyết đoán, trọng nghĩa. Thẳng thắn, dám làm, chịu rèn luyện; điểm yếu là nóng, cứng '
    + 'nhắc, dễ va chạm. Hợp việc cần kỷ luật, xử lý dứt khoát như kỹ thuật, quân đội, pháp luật.',
  '辛': 'Âm Kim, như châu ngọc: tinh tế, kỹ tính, giữ thể diện. Có gu, chú ý tiểu tiết, tự trọng cao; điểm yếu là dễ tự ái, kén chọn. '
    + 'Hợp việc cần sự tinh xảo như tài chính, làm đẹp, kiểm định, thủ công.',
  '壬': 'Dương Thủy, như sông biển: rộng lượng, năng động, nhiều ý tưởng. Thông minh, thích đi, thích đổi mới; điểm yếu là khó ổn '
    + 'định, dễ phóng túng. Hợp việc cần di chuyển, giao lưu như thương mại, du lịch, vận tải.',
  '癸': 'Âm Thủy, như mưa sương: kín đáo, nhạy cảm, thấm dần mà bền. Trực giác tốt, nghĩ sâu; điểm yếu là hay nghĩ nhiều, dễ bi '
    + 'quan. Hợp việc cần chiều sâu như nghiên cứu, tư vấn, viết lách.',
};

/** Loi Claude soan lai theo quan niem dan gian, moi thap than mot doan (khoa la ten tieng Viet). */
export const NGHIA_THAP_THAN: Readonly<Record<string, string>> = {
  'Tỷ Kiên': 'cùng hành, cùng tính âm/dương với mình: anh em, bạn bè, tính tự lập. Vừa phải thì có bạn đồng hành, chí tự lực; '
    + 'nhiều quá thì cứng đầu, dễ tranh phần.',
  'Kiếp Tài': 'cùng hành, khác tính âm/dương với mình: bạn mà cũng là người tranh phần, dám liều, dễ hao tiền. Nhiều thì hay hùn hạp, '
    + 'bốc đồng; có Quan Sát kìm lại thì thành dũng cảm, quyết đoán.',
  'Thực Thần': 'do mình sinh ra, cùng tính âm/dương: tài khéo, ăn ở thong thả, có lộc ăn; sáng tạo nhẹ nhàng. Nhiều quá thì dễ lười, ham vui.',
  'Thương Quan': 'do mình sinh ra, khác tính âm/dương: sáng tạo, giỏi nói, không chịu gò bó; tài hoa nhưng hay chê, dễ va chạm cấp trên. '
    + 'Có Ấn kìm lại thì thành tài năng có chừng mực.',
  'Thiên Tài': 'bị mình khắc, cùng tính âm/dương: tiền bất ngờ, buôn bán, hào phóng; giỏi nắm cơ hội. Nhiều quá thì tiêu nhiều, khó giữ.',
  'Chính Tài': 'bị mình khắc, khác tính âm/dương: tiền làm ra đều đặn, cần kiệm, thực tế, giữ nếp nhà; với nam còn ứng với vợ '
    + 'theo cách xem truyền thống.',
  'Thất Sát': 'khắc mình, cùng tính âm/dương: áp lực, uy quyền, dám đương đầu. Có sao kìm lại thì thành người có uy, làm việc lớn; '
    + 'không thì dễ căng thẳng, va chạm.',
  'Chính Quan': 'khắc mình, khác tính âm/dương: kỷ luật, danh dự, chức phận; đứng đắn, được tín nhiệm. Với nữ còn ứng với chồng '
    + 'theo cách xem truyền thống.',
  'Thiên Ấn': 'sinh ra mình, cùng tính âm/dương: học điều lạ, trực giác, nghề riêng; giỏi tự học, có óc khác người. Nhiều quá thì dễ '
    + 'cô độc, nghĩ nhiều làm ít.',
  'Chính Ấn': 'sinh ra mình, khác tính âm/dương: mẹ, thầy, học vấn, được che chở; nhân hậu, học hành và giấy tờ thuận. Nhiều quá thì '
    + 'dễ ỷ lại.',
};

/** Thap than cua can (hoac chinh khi cua chi) dai van, nam dang xem: nghia trong khoang thoi gian do. */
export const NGHIA_VAN: Readonly<Record<string, string>> = {
  'Tỷ Kiên': 'có bạn đồng hành, tự lực cánh sinh; dễ phải chia phần, cạnh tranh với người ngang hàng.',
  'Kiếp Tài': 'dám làm, dám liều; dễ hao tiền vì bạn bè, hùn hạp — cẩn thận chuyện tiền chung.',
  'Thực Thần': 'thong thả, có lộc ăn, hợp sáng tạo, học thêm nghề; tinh thần thoải mái.',
  'Thương Quan': 'nhiều ý tưởng, muốn thay đổi; dễ va chạm cấp trên, lời nói dễ gây chuyện.',
  'Thiên Tài': 'có cơ hội tiền bất ngờ, buôn bán, đi lại; dễ tiêu hoang.',
  'Chính Tài': 'thu nhập đều, làm ăn chắc chắn; hợp tích lũy, lo việc nhà.',
  'Thất Sát': 'áp lực, thử thách, cạnh tranh gắt; vượt được thì lên, nên giữ sức khỏe.',
  'Chính Quan': 'có chức phận, trách nhiệm, được ghi nhận; hợp thi cử, thăng tiến.',
  'Thiên Ấn': 'hợp học điều mới, nghề riêng, suy ngẫm; dễ cô đơn, nghĩ nhiều.',
  'Chính Ấn': 'được che chở, học hành, giấy tờ thuận; được người trên giúp.',
};

/** Nam nhom hanh theo quan he voi nhat chu, thu tu trong `BatTu.nhomHanh`: la gi, nghia khi nhieu va khi thieu. */
export const NHOM_HANH: Readonly<Record<string, { readonly la: string; readonly nhieu: string; readonly thieu: string }>> = {
  'Tỷ Kiếp': { la: 'cùng hành với mình (anh em, bạn bè, người ngang hàng)', nhieu: 'tự tin, cứng đầu, đông bạn nhưng dễ tranh phần, hao tiền vì bạn.',
    thieu: 'dễ thiếu tự tin, ít người cùng chí hướng; nên tìm cộng sự đáng tin.' },
  'Thực Thương': { la: 'hành do mình sinh ra (tài năng, lời nói, sự sáng tạo)', nhieu: 'giỏi thể hiện, sáng tạo, ăn nói; dễ nói quá lời, không chịu gò bó.',
    thieu: 'ít bộc lộ, khó nói ra ý mình; nên tập trình bày, viết ra.' },
  'Tài': { la: 'hành bị mình khắc (tiền bạc, của cải)', nhieu: 'nhạy với tiền, thực tế, nhưng dễ mệt vì lo kiếm; nếu bản thân yếu mà '
    + 'Tài nhiều thì tiền khó giữ.',
    thieu: 'ít để tâm tiền bạc, tiêu tùy hứng; nên lập kế hoạch chi tiêu.' },
  'Quan Sát': { la: 'hành khắc mình (công việc, kỷ luật, áp lực, chức phận)', nhieu: 'chịu nhiều áp lực, kỷ luật, trách nhiệm nặng; dễ căng thẳng.',
    thieu: 'tự do, ít ràng buộc, nhưng dễ thiếu kỷ luật, khó giữ nề nếp.' },
  'Ấn': { la: 'hành sinh ra mình (cha mẹ, thầy, học hành, sự che chở)', nhieu: 'được che chở, học nhiều, nhưng dễ ỷ lại, chậm hành động.',
    thieu: 'phải tự lập sớm, ít được nâng đỡ; nên chủ động tìm thầy, học thêm.' },
};

const TEN_TRU = ['năm', 'tháng', 'ngày', 'giờ'] as const;
const HANH = ['金', '木', '水', '火', '土'] as const;
/** Vong tuong sinh; tu hanh nhat chu dem tiep 0..4 ra Ty Kiep, Thuc Thuong (minh sinh), Tai (minh khac), Quan Sat, An. */
const SINH = ['木', '火', '土', '金', '水'] as const;
const NHOM = ['Tỷ Kiếp', 'Thực Thương', 'Tài', 'Quan Sát', 'Ấn'] as const;
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

/** Can chi `g` `z` (chu Han) nhin tu nhat chu `nhat`: ten va thap than cua can, cua chinh khi trong chi. */
function vanNam(nhat: string, g: string, z: string): VanNam {
  const tt = (c: string): string => hv('thapThan', LunarUtil.SHI_SHEN[nhat + c] ?? '');
  const tang = LunarUtil.ZHI_HIDE_GAN[z]?.[0] ?? '';
  return { canChi: `${hv('can', g)} ${hv('chi', z)}`, thapThan: [tt(g), tt(tang)], tang: hv('can', tang) };
}

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
      ...vanNam(nhat, g, z),
      tuoi: batDau.nam - kq.am.nam + 1,
      batDau,
      dangChay: soNgay(batDau) <= xem && xem < soNgay(sau),
    };
  });

  const chu = so.flatMap(([g, z]) => [LunarUtil.WU_XING_GAN[CAN.charAt(g)], LunarUtil.WU_XING_ZHI[CHI.charAt(z)]]);
  const goc = SINH.findIndex((h) => h === LunarUtil.WU_XING_GAN[nhat]);
  const ln = solarLuc(xem * 1440 + 720 + BAC_KINH).getLunar();
  return {
    tru,
    nhatChu: `${hv('can', nhat)} ${hv('nguHanh', LunarUtil.WU_XING_GAN[nhat] ?? '')}`,
    nghiaNhatChu: NGHIA_CAN[nhat] ?? '',
    khongVong: Array.from(LunarUtil.getXunKong(nhat + CHI.charAt(so[2]?.[1] ?? 0))).map((c) => hv('chi', c)).join(', '),
    nguHanh: HANH.map((h) => ({ hanh: hv('nguHanh', h), so: chu.filter((c) => c === h).length })),
    nhomHanh: NHOM.map((nhom, k) => {
      const h = SINH[(goc + k) % 5] ?? '木';
      return { nhom, hanh: hv('nguHanh', h), so: chu.filter((c) => c === h).length };
    }),
    khoiVan: { nam: yun.getStartYear(), thang: yun.getStartMonth(), ngay: yun.getStartDay() },
    thuan: yun.isForward(),
    daiVan,
    namNay: vanNam(nhat, CAN.charAt(ln.getYearGanIndexExact()), CHI.charAt(ln.getYearZhiIndexExact())),
    ghiChu,
  };
}
