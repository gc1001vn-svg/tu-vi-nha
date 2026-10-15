// So lunar-typescript (dung trong app) voi lunar-javascript (ban NGUON_MO do 14/10): cung ngay, cung ham -> cung chuoi?
// 42 ham moi ngay; cuu tinh, bat tu, 13 gio thi moi 7 ngay (cham). Ca 1900–2100 mat ~2 phut.
// Chay: node scripts/doi-chieu/so-lunar-ts.mjs <thu muc co node_modules/lunar-javascript@1.7.7> [nam dau] [nam cuoi]
// Do 14/10/2026: 73.414 ngay, chi lech getDayXiongSha 300 ngay — lunar-typescript 1.8.6 lo ma i18n
// (sn.sanSang, sn.guiKu, sn.siLi, sn.daTui) thay cho chu Han. Bang Han-Viet do cac ma nay.
import { createRequire } from 'node:module';
import { Solar } from 'lunar-typescript';
const [thuMuc, dau = '1900', cuoi = '2100'] = process.argv.slice(2);
const J = createRequire(thuMuc + '/package.json')('lunar-javascript');
const HAM = ['getYearInGanZhi', 'getYearInGanZhiByLiChun', 'getMonthInGanZhi', 'getMonthInGanZhiExact', 'getDayInGanZhi', 'getDayInGanZhiExact',
  'getDayInGanZhiExact2', 'getYearNaYin', 'getDayNaYin', 'getDayChongDesc', 'getDaySha', 'getDayLu', 'getYueXiang', 'getJieQi', 'getHou',
  'getWuHou', 'getSeason', 'getDayPositionTai', 'getMonthPositionTai', 'getPengZuGan', 'getPengZuZhi', 'getDayPositionXiDesc',
  'getDayPositionCaiDesc', 'getDayPositionFuDesc', 'getDayPositionTaiSuiDesc', 'getZhiXing', 'getDayTianShen', 'getDayTianShenType', 'getXiu',
  'getXiuLuck', 'getZheng', 'getAnimal', 'getGong', 'getShou', 'getDayYi', 'getDayJi', 'getDayJiShen', 'getDayXiongSha', 'getLiuYao', 'getDay',
  'getMonth', 'getYear'];
const CHAM = [
  ['cuuTinh', (l) => [l.getYearNineStar(), l.getMonthNineStar(), l.getDayNineStar()].map(String).join()],
  ['batTu', (l) => { const e = l.getEightChar(); return [e.getYear(), e.getMonth(), e.getDay(), e.getTime(), e.getYearShiShenZhi().join(), e.getDayDiShi(), e.getTaiYuan(), e.getMingGong(), e.getShenGong()].join(); }],
  ['gio', (l) => l.getTimes().map((t) => [t.getGanZhi(), t.getTianShen(), t.getYi().join(), t.getJi().join(), t.getPositionCaiDesc()].join()).join('|')],
];
const dem = {}, vd = {};
const ghi = (h, ngay, a, b) => { dem[h] = (dem[h] ?? 0) + 1; if ((vd[h] ??= []).length < 2) vd[h].push(`${ngay} js=${a.slice(0, 120)} ts=${b.slice(0, 120)}`); };
let n = 0;
for (let s = Solar.fromYmd(+dau, 1, 1), het = Solar.fromYmd(+cuoi, 12, 31); !s.isAfter(het); s = s.next(1)) {
  n++;
  const lt = s.getLunar(), lj = J.Solar.fromYmd(s.getYear(), s.getMonth(), s.getDay()).getLunar();
  for (const h of HAM) { const a = JSON.stringify(lj[h]()), b = JSON.stringify(lt[h]()); if (a !== b) ghi(h, s.toYmd(), a, b); }
  if (n % 7 === 0) for (const [h, f] of CHAM) { const a = f(lj), b = f(lt); if (a !== b) ghi(h, s.toYmd(), a, b); }
}
console.log('So do:', n, 'ngay · ham lech (so ngay):', JSON.stringify(dem));
for (const h in vd) console.log(h, '\n  ' + vd[h].join('\n  '));
