// So bat tu cua app (`src/loi/batTu.ts`) voi sxtwl (ket qua `so-bat-tu.py`), va thoi khac 12 tiet 1900–2100 cua
// lunar-typescript (thu vien app dung) voi sxtwl. Cach chay: dau `so-bat-tu.py`.
// Ca "thuong": so ca 4 tru voi sxtwl. Ca "tiet" (ngay +8 co giao tiet, sxtwl tinh nam/thang theo ca ngay): ngay, gio so
// thang; nam, thang so voi thoi khac tiet cua sxtwl, va dem them bao nhieu ca app khac cach "theo ngay" cua sxtwl.
import { readFileSync } from 'node:fs';
import { Solar } from 'lunar-typescript';
import { tinhBatTu } from '../../src/loi/batTu.ts';
import { hv } from '../../src/loi/hanViet/index.ts';
import { tinhHoSo } from '../../src/loi/hoSo.ts';

const { ca, tiet } = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ten = (gz) => `${hv('can', gz[0])} ${hv('chi', gz[1])}`;
const XEM = { nam: 2026, thang: 10, ngay: 19 };
const dem = { thuong: [0, 0], tiet: [0, 0], ngayGio: [0, 0], khacTheoNgay: 0 };
const lech = [];
for (const [t, nam, thang, ngay, gio, loai, namNgay, thangNgay] of ca) {
  const [ngaySinh, gioSinh] = t.split(' ');
  const hs = { id: 'x', ten: 'x', gioiTinh: 'nam', ngaySinh, gioSinh, noiSinh: 'Hà Nội' };
  const app = tinhBatTu(hs, tinhHoSo(hs, undefined, { doiVeGio7: false }).chinh, XEM).tru.map((x) => `${x.can} ${x.chi}`);
  const dung = (i, gz) => app[i] === ten(gz);
  const ng = dung(2, ngay) && dung(3, gio);
  dem.ngayGio[1]++;
  if (ng) dem.ngayGio[0]++;
  const nt = dung(0, nam) && dung(1, thang);
  dem[loai][1]++;
  if (nt && ng) dem[loai][0]++;
  if (loai === 'tiet' && !(dung(0, namNgay) && dung(1, thangNgay))) dem.khacTheoNgay++;
  if (!(nt && ng)) lech.push(`${t} ${loai}: app ${app.join(' | ')} / sxtwl ${[nam, thang, ngay, gio].map(ten).join(' | ')}`);
}

// Thoi khac tiet: lunar-typescript tinh theo +8; tim tiet gan nhat truoc moc sxtwl + 1 gio (gio +8) roi tru.
let lechMax = 0, quaPhut = 0;
for (const vn of tiet) {
  const [d, h] = vn.split(' ');
  const [y, m, n] = d.split('-').map(Number), [hh, mm, ss] = h.split(':').map(Number);
  const sx = Solar.fromYmdHms(y, m, n, hh, mm, Math.floor(ss)).nextHour(1);
  const lt = sx.nextHour(1).getLunar().getPrevJie().getSolar();
  const giay = Math.abs((lt.getJulianDay() - sx.getJulianDay()) * 86400 - (ss % 1));
  lechMax = Math.max(lechMax, giay);
  if (giay > 60) quaPhut++;
}

console.log(`Bat tu app so sxtwl 2.0.7, ${ca.length} ca:`);
console.log(`  ca thuong (4 tru so thang sxtwl): khop ${dem.thuong[0]}/${dem.thuong[1]}`);
console.log(`  ca ngay giao tiet (nam, thang theo thoi khac tiet sxtwl): khop ${dem.tiet[0]}/${dem.tiet[1]}; `
  + `trong do ${dem.khacTheoNgay} ca app khac sxtwl "theo ca ngay" (vi vay loai khoi so thang)`);
console.log(`  tru ngay + gio (phai A) moi ca: khop ${dem.ngayGio[0]}/${dem.ngayGio[1]}`);
console.log(`  thoi khac ${tiet.length} tiet 1900–2100, lunar-typescript so sxtwl: lech toi da ${lechMax.toFixed(1)} giay, ${quaPhut} tiet lech qua 60 giay`);
if (lech.length > 0) console.log(`  lech (${lech.length}):\n    ${lech.slice(0, 20).join('\n    ')}`);
process.exit(lech.length > 0 ? 1 : 0);
