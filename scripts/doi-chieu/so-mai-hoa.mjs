// Doi chieu Mai Hoa theo gio (src/loi/kinhDich.ts) voi meihua-ts-lib (npm, GPL -> chi chay ngoai repo, khong luu ma no).
// Cung mot ngay am +7 cua app dua vao ca hai (che do "lunar" cua thu vien), so que chu, hao dong, que bien, que ho.
// Bo qua thang nhuan va gio 23 (thu vien giu ngay cu, app tinh sang ngay sau — QUY_UOC muc 18).
//   npm install --prefix <tam> --ignore-scripts meihua-ts-lib
//   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-mai-hoa.mjs <tam>/node_modules/meihua-ts-lib/dist/index.mjs
import { duongSangAm, soNgay, tuSoNgay } from '../../src/loi/amLich.ts';
import { maiHoaTheoGio } from '../../src/loi/kinhDich.ts';

const { qiGuaByTime } = await import(process.argv[2]);
let hat = 20261020;
const ngauNhien = () => (hat = (hat * 1103515245 + 12345) % 2147483648) / 2147483648;
const goc = soNgay({ nam: 1950, thang: 1, ngay: 1 });
const het = soNgay({ nam: 2050, thang: 12, ngay: 31 });
const dem = { so: 0, khop: 0, canKhon: 0, ranhNam: 0, nhuan: 0, gio23: 0 };
const lech = [];
while (dem.so < 300) {
  const d = tuSoNgay(goc + Math.floor(ngauNhien() * (het - goc)));
  const gio = Math.floor(ngauNhien() * 24);
  const am = duongSangAm(d);
  if (gio === 23) { dem.gio23++; continue; }
  if (am.nhuan) { dem.nhuan++; continue; }
  dem.so++;
  const ta = maiHoaTheoGio(d, gio);
  const ho = qiGuaByTime({ calendar: 'lunar', year: am.nam, month: am.thang, day: am.ngay, hour: gio });
  const a = [ta.chu, ta.dong[0], ta.bien, ta.ho].join(' ');
  const b = [ho.mainHexagram.kingWenNumber, ho.movingLine, ho.changedHexagram.kingWenNumber, ho.mutualHexagram.kingWenNumber].join(' ');
  // Lech da biet: que Càn/Khôn lay ho cua que bien (sach) · nam doi o Lap Xuan (thu vien) thay vi Tet (app)
  const lapXuan = qiGuaByTime({ calendar: 'lunar', year: am.nam, month: am.thang, day: am.ngay, hour: gio }).time?.ganzhi.year.name;
  const chiTa = '子丑寅卯辰巳午未申酉戌亥'[ta.soNam - 1];
  if (a === b) dem.khop++;
  else if ([1, 2].includes(ta.chu) && a.split(' ').slice(0, 3).join() === b.split(' ').slice(0, 3).join()) dem.canKhon++;
  else if (lapXuan !== undefined && !lapXuan.endsWith(chiTa)) dem.ranhNam++;
  else lech.push(`${JSON.stringify(d)} ${gio}h am ${am.ngay}/${am.thang}/${am.nam}: app ${a} | thu vien ${b}`);
}
console.log(dem, 'lech chua giai thich:', lech);
