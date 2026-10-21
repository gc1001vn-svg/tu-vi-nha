// So anh lich chu du an chup (mau-lich.json) voi bang vang am lich (HND +7) va lunar-typescript.
// Chay: node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-anh-lich.mjs
// Do 19/10/2026: 25/25 o khop; 21/10 them 4 anh (2026, ngay khac mung 1): 45/45. Can chi THANG tren lich Viet tinh theo thang am (cong thuc duoi), khong theo tiet.
import { readFileSync } from 'node:fs';
import { Solar } from 'lunar-typescript';
import { CO_BAN } from '../../src/loi/hanViet/coBan.ts';
const doc = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const vang = doc('../../tests/vang/am-lich-hnd.json').thang, { ca } = doc('./mau-lich.json');
const CAN = '甲乙丙丁戊己庚辛壬癸', CHI = '子丑寅卯辰巳午未申酉戌亥';
const gz = (s) => `${CO_BAN.can[s[0]].hv} ${CO_BAN.chi[s[1]].hv}`;
let khop = 0, tong = 0;
for (const c of ca) {
  const t = vang.filter((x) => x[0] <= c.duong).at(-1); // dau thang am chua ngay nay
  const am = `${(Date.parse(c.duong) - Date.parse(t[0])) / 864e5 + 1}/${t[2]}${t[3] ? 'n' : ''}/${t[1]}`;
  const [y, m, d] = c.duong.split('-').map(Number), l = Solar.fromYmd(y, m, d).getLunar();
  const canNam = (t[1] - 4 + 4000) % 10; // can nam am (Giap = 0)
  const thang = CAN[((canNam % 5) * 2 + 2 + t[2] - 1) % 10] + CHI[(t[2] + 1) % 12]; // thang Gieng nam Giap/Ky = Binh Dan
  const may = { am, ngay: gz(l.getDayInGanZhi()), thang: gz(thang), tiet: CO_BAN.tietKhi[l.getPrevJieQi(true).getName()].hv,
    gioHoangDao: l.getTimes().slice(0, 12).filter((x) => x.getTianShenType() === '黄道').map((x) => CO_BAN.chi[x.getZhi()].hv).join(' ') };
  const lech = Object.keys(may).filter((k) => may[k] !== c[k]);
  tong += 5; khop += 5 - lech.length;
  console.log(c.duong, lech.length ? 'LECH ' + lech.map((k) => `${k}: anh ${c[k]} / may ${may[k]}`).join('; ') : 'khop 5/5');
}
console.log(`So do: ${khop}/${tong} o khop`);
