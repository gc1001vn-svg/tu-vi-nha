/**
 * Liet ke MOI chuoi chu Han ma `lunar-typescript` tra ra, gom theo nhom, trong mot khoang ngay.
 *
 * Hai viec dung no:
 *   1. `HanViet.test.ts` doi bang Han-Viet (`src/loi/hanViet/`) phai phu 100% cac chuoi nay.
 *   2. In danh sach ra JSON de dich:
 *      node --experimental-strip-types -e "import('./tests/lietKeChuHan.ts').then(m => ...)"
 *
 * Chuoi GHEP thi tach ra tung phan va ghi vao nhom cua phan do — app ghep lai khi hien:
 * can chi "甲子" -> can + chi · tuan khong "申酉" -> chi + chi · ngu hanh bat tu "木火" -> tung hanh ·
 * xung "(丁丑)牛" -> can + chi + con giap · nhi thap bat tu "小寒 初候" -> tiet khi + hau.
 *
 * KHONG liet ke (app tu viet, khong dich): ten thang/ngay/nam am bang chu (正月, 初一),
 * thu trong tuan, le tet Trung Quoc, lich Phat/Dao, tho 28 tu (getXiuSong), tho Thai At.
 */
import { Solar, type Lunar, type LunarTime, type NineStar } from 'lunar-typescript';
import { NHOM, type Nhom } from '../src/loi/hanViet/index.ts';

export { NHOM, type Nhom };

/** nhom -> (chuoi -> so lan gap). */
export type BangChu = Map<Nhom, Map<string, number>>;

/** Ngay duong dang [nam, thang, ngay]. */
export type Ngay = readonly [number, number, number];

export function lietKeChuHan(tu: Ngay, den: Ngay, gioTu: Ngay, gioDen: Ngay): BangChu {
  const bang: BangChu = new Map(NHOM.map((n) => [n, new Map<string, number>()]));
  const ghi = (nhom: Nhom, chu: string): void => {
    if (chu === '') throw new Error(`chuoi rong o nhom ${nhom}`);
    const m = bang.get(nhom);
    if (m === undefined) throw new Error(`khong co nhom ${nhom}`);
    m.set(chu, (m.get(chu) ?? 0) + 1);
  };
  const ghiMoiChu = (nhom: Nhom, chuoi: string): void => {
    for (const c of chuoi) ghi(nhom, c);
  };
  const canChi = (gz: string): void => {
    const [can, chi, ...thua] = Array.from(gz);
    if (can === undefined || chi === undefined || thua.length > 0) throw new Error(`can chi la: "${gz}"`);
    ghi('can', can);
    ghi('chi', chi);
  };
  const xung = (s: string): void => {
    const m = /^\((.)(.)\)(.)$/u.exec(s);
    if (m?.[1] === undefined || m[2] === undefined || m[3] === undefined) throw new Error(`xung la: "${s}"`);
    ghi('can', m[1]);
    ghi('chi', m[2]);
    ghi('conGiap', m[3]);
  };
  const cuuTinh = (ns: NineStar): void => {
    for (const s of [
      ns.getNumber(), ns.getColor(), ns.getNameInXuanKong(), ns.getNameInBeiDou(), ns.getNameInQiMen(),
      ns.getNameInTaiYi(), ns.getTypeInTaiYi(), ns.getLuckInQiMen(), ns.getLuckInXuanKong(),
      ns.getYinYangInQiMen(), ns.getBaMenInQiMen(),
    ]) if (s !== '') ghi('cuuTinh', s); // sao Ngu Hoang o trung cung khong co cua Bat Mon -> chuoi rong
    ghi('nguHanh', ns.getWuXing());
    ghi('batQuai', ns.getPosition());
    ghi('huong', ns.getPositionDesc());
  };

  const ngay = (l: Lunar): void => {
    for (const gz of [
      l.getYearInGanZhi(), l.getYearInGanZhiByLiChun(), l.getYearInGanZhiExact(), l.getMonthInGanZhi(),
      l.getMonthInGanZhiExact(), l.getDayInGanZhi(), l.getDayInGanZhiExact(), l.getDayInGanZhiExact2(),
      l.getTimeInGanZhi(), l.getYearXun(), l.getMonthXun(), l.getDayXun(), l.getDayXunExact(), l.getDayXunExact2(),
    ]) canChi(gz);
    for (const k of [l.getYearXunKong(), l.getMonthXunKong(), l.getDayXunKong(), l.getDayXunKongExact()]) ghiMoiChu('chi', k);
    for (const s of [
      l.getYearShengXiao(), l.getYearShengXiaoByLiChun(), l.getYearShengXiaoExact(), l.getMonthShengXiao(),
      l.getMonthShengXiaoExact(), l.getDayShengXiao(), l.getTimeShengXiao(), l.getDayChongShengXiao(),
    ]) ghi('conGiap', s);
    for (const s of [l.getYearNaYin(), l.getMonthNaYin(), l.getDayNaYin(), l.getTimeNaYin()]) ghi('napAm', s);
    ghi('chi', l.getDayChong());
    ghi('can', l.getDayChongGan());
    ghi('can', l.getDayChongGanTie());
    xung(l.getDayChongDesc());
    ghi('phuong', l.getDaySha());
    for (const p of l.getDayLu().split(' ')) ghi('loc', p);
    ghi('nguyetTuong', l.getYueXiang());
    const tk = l.getJieQi();
    if (tk !== '') ghi('tietKhi', tk);
    ghi('tietKhi', l.getPrevJieQi(true).getName());
    ghi('tietKhi', l.getNextJieQi(true).getName());
    const [tkHau, hau, ...thua] = l.getHou().split(' ');
    if (tkHau === undefined || hau === undefined || thua.length > 0) throw new Error(`hau la: "${l.getHou()}"`);
    ghi('tietKhi', tkHau);
    ghi('hau', hau);
    ghi('vatHau', l.getWuHou());
    ghi('mua', l.getSeason());
    ghi('thaiThan', l.getDayPositionTai());
    const thaiThang = l.getMonthPositionTai();
    if (thaiThang !== '') ghi('thaiThan', thaiThang); // thang nhuan khong co thai than thang -> chuoi rong
    ghi('banhTo', l.getPengZuGan());
    ghi('banhTo', l.getPengZuZhi());
    for (const s of [
      l.getDayPositionXi(), l.getDayPositionYangGui(), l.getDayPositionYinGui(), l.getDayPositionFu(1),
      l.getDayPositionFu(2), l.getDayPositionCai(), l.getDayPositionTaiSui(), l.getMonthPositionTaiSui(),
      l.getYearPositionTaiSui(),
    ]) ghi('batQuai', s);
    for (const s of [
      l.getDayPositionXiDesc(), l.getDayPositionYangGuiDesc(), l.getDayPositionYinGuiDesc(),
      l.getDayPositionFuDesc(1), l.getDayPositionFuDesc(2), l.getDayPositionCaiDesc(),
      l.getDayPositionTaiSuiDesc(), l.getMonthPositionTaiSuiDesc(), l.getYearPositionTaiSuiDesc(),
    ]) ghi('huong', s);
    ghi('truc', l.getZhiXing());
    ghi('thienThan', l.getDayTianShen());
    ghi('hoangDao', l.getDayTianShenType());
    ghi('catHung', l.getDayTianShenLuck());
    ghi('tu28', l.getXiu());
    ghi('catHung', l.getXiuLuck());
    ghi('thatChinh', l.getZheng());
    ghi('dongVat28', l.getAnimal());
    ghi('phuong', l.getGong());
    ghi('tuLinh', l.getShou());
    for (const s of [...l.getDayYi(1), ...l.getDayJi(1), ...l.getDayYi(2), ...l.getDayJi(2)]) ghi('nenKieng', s);
    for (const s of [...l.getDayJiShen(), ...l.getDayXiongSha()]) ghi('thanSat', s);
    ghi('lucDieu', l.getLiuYao());
    const soCuu = l.getShuJiu();
    if (soCuu !== null) ghi('soCuu', soCuu.getName());
    const phuc = l.getFu();
    if (phuc !== null) ghi('tamPhuc', phuc.getName());
    for (const ns of [l.getYearNineStar(), l.getMonthNineStar(), l.getDayNineStar()]) cuuTinh(ns);

    const bt = l.getEightChar();
    for (const gz of [
      bt.getYear(), bt.getMonth(), bt.getDay(), bt.getTime(), bt.getTaiYuan(), bt.getTaiXi(), bt.getMingGong(),
      bt.getShenGong(), bt.getYearXun(), bt.getMonthXun(), bt.getDayXun(), bt.getTimeXun(),
    ]) canChi(gz);
    for (const k of [bt.getYearXunKong(), bt.getMonthXunKong(), bt.getDayXunKong(), bt.getTimeXunKong()]) ghiMoiChu('chi', k);
    for (const c of [...bt.getYearHideGan(), ...bt.getMonthHideGan(), ...bt.getDayHideGan(), ...bt.getTimeHideGan()]) ghi('can', c);
    for (const h of [bt.getYearWuXing(), bt.getMonthWuXing(), bt.getDayWuXing(), bt.getTimeWuXing()]) ghiMoiChu('nguHanh', h);
    for (const s of [
      bt.getYearNaYin(), bt.getMonthNaYin(), bt.getDayNaYin(), bt.getTimeNaYin(), bt.getTaiYuanNaYin(),
      bt.getTaiXiNaYin(), bt.getMingGongNaYin(), bt.getShenGongNaYin(),
    ]) ghi('napAm', s);
    for (const s of [
      bt.getYearShiShenGan(), bt.getMonthShiShenGan(), bt.getDayShiShenGan(), bt.getTimeShiShenGan(),
      ...bt.getYearShiShenZhi(), ...bt.getMonthShiShenZhi(), ...bt.getDayShiShenZhi(), ...bt.getTimeShiShenZhi(),
    ]) ghi('thapThan', s);
    for (const s of [bt.getYearDiShi(), bt.getMonthDiShi(), bt.getDayDiShi(), bt.getTimeDiShi()]) ghi('truongSinh', s);
  };

  const gio = (t: LunarTime): void => {
    canChi(t.getGanZhi());
    canChi(t.getXun());
    ghiMoiChu('chi', t.getXunKong());
    ghi('conGiap', t.getShengXiao());
    ghi('conGiap', t.getChongShengXiao());
    ghi('napAm', t.getNaYin());
    ghi('thienThan', t.getTianShen());
    ghi('hoangDao', t.getTianShenType());
    ghi('catHung', t.getTianShenLuck());
    ghi('chi', t.getChong());
    ghi('can', t.getChongGan());
    ghi('can', t.getChongGanTie());
    xung(t.getChongDesc());
    ghi('phuong', t.getSha());
    for (const s of [t.getPositionXi(), t.getPositionYangGui(), t.getPositionYinGui(), t.getPositionFu(1), t.getPositionFu(2), t.getPositionCai()]) {
      ghi('batQuai', s);
    }
    for (const s of [
      t.getPositionXiDesc(), t.getPositionYangGuiDesc(), t.getPositionYinGuiDesc(), t.getPositionFuDesc(1),
      t.getPositionFuDesc(2), t.getPositionCaiDesc(),
    ]) ghi('huong', s);
    for (const s of [...t.getYi(), ...t.getJi()]) ghi('nenKieng', s);
    cuuTinh(t.getNineStar());
  };

  const duyet = (a: Ngay, b: Ngay, lam: (s: Solar) => void): void => {
    const cuoi = Solar.fromYmd(b[0], b[1], b[2]);
    for (let s = Solar.fromYmd(a[0], a[1], a[2]); !s.isAfter(cuoi); s = s.next(1)) lam(s);
  };
  duyet(tu, den, (s) => {
    ngay(s.getLunar());
    ghi('cungHoangDao', s.getXingZuo());
  });
  duyet(gioTu, gioDen, (s) => {
    for (const t of s.getLunar().getTimes()) gio(t);
  });
  return bang;
}
