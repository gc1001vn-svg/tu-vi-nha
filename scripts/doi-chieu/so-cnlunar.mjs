// So nen/kieng (宜/忌) 7 viec cua app (lunar-typescript: LunarUtil.getDayYi/getDayJi, nhu `chiTietNgay` o src/loi/homNay.ts)
// voi cnlunar 0.2.5 (ket qua `sinh-cnlunar.py`, 2024-01-01 -> 2029-06-30). Moi viec: so ngay moi ben co viec trong 宜 / 忌,
// "trung" = % ngay hai ben cung co hoac cung khong co viec trong 宜 (hoac 忌), "J" = % trung tren cac ngay it nhat mot ben co (do khat khe), "k" = Cohen kappa (0 = trung ngau nhien, 1 = trung het),
// "nguoc" = so ngay mot ben 宜 ben kia 忌. 诸事不宜 trong 忌 = moi viec deu kieng (ca hai ben).
// 3 cach ghep thang: (a) app 'tiet' voi cnlunar thang tiet, (b) app 'am' (mac dinh app) voi cnlunar thang am, (c) app 'am' voi cnlunar mac dinh (tiet).
// Chay: node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-cnlunar.mjs <cnlunar.json>
// Do 21/10/2026 (cnlunar 0.2.5, 2.008 ngay 2024-01-01 -> 2029-06-30, chay < 1 giay; chi ngay, so thang am, chi thang tiet 2 ben khop het):
//   trung 宜 / 忌 trung binh 7 viec, nguoc: (a) 73,7% / 58,9%, 1.239 | (b) 73,5% / 60,9%, 1.097 | (c) 70,9% / 57,6%, 1.505.
//   Kappa 宜 0,14-0,51, 忌 0,02-0,16: hai ben chi giong nhau hon ngau nhien chut it, cach chon thang tiet/am khong doi nhieu.
import { readFileSync } from 'node:fs';
import { LunarUtil, Solar } from 'lunar-typescript';
import { duongSangAm, soNgay, tuSoNgay } from '../../src/loi/amLich.ts';
import { BANG, hv } from '../../src/loi/hanViet/index.ts';
import { chiTietNgay } from '../../src/loi/homNay.ts';

const { phienBan, ngay: cn } = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const TAT_CA = '诸事不宜';
// [ten, ten trong lunar-typescript, ten trong cnlunar]; PHU chi de tham khao (cnlunar khong co 动土, 破土 cua no la chon cat; 结婚姻 la viec rieng cua no).
const VIEC = [['嫁娶', '嫁娶', '嫁娶'], ['纳采', '纳采', '纳采'], ['动土', '动土', '修造'], ['开市', '开市', '开市'], ['出行', '出行', '出行'],
  ['交易', '交易', '立券交易'], ['纳财', '纳财', '纳财']];
const PHU = [['动土~破土', '动土', '破土'], ['嫁娶~结婚姻', '嫁娶', '结婚姻']];
const CHI = '子丑寅卯辰巳午未申酉戌亥';

// Chep tu homNay.ts (cuoiNgayVN + chiThangXem, khong export); duoi day kiem lai bang chiTietNgay cua app.
function chiThang(d, am, kieu) {
  if (kieu === 'am') return (am.thang + 1) % 12;
  const mai = tuSoNgay(soNgay(d) + 1);
  return Solar.fromYmdHms(mai.nam, mai.thang, mai.ngay, 0, 59, 59).getLunar().getMonthZhiIndexExact();
}
function appYiJi(d, kieu) {
  const l = Solar.fromYmd(d.nam, d.thang, d.ngay).getLunar();
  const am = duongSangAm(d);
  const ct = chiThang(d, am, kieu);
  const thang = LunarUtil.JIA_ZI[ct];
  const ganChi = l.getDayInGanZhi();
  return { yi: LunarUtil.getDayYi(thang, ganChi), ji: LunarUtil.getDayJi(thang, ganChi), ganChi, ct, am };
}

// ap[kieu][i] = { ngay, yi, ji, ... } cua app; ghep voi cnlunar o cn[i][4] (tiet) / cn[i][5] (am).
const app = { tiet: [], am: [] };
const lech = { canChiNgay: 0, chiThangTiet: [], thangAm: 0 };
cn.forEach(([s, gzNgay, chiTiet, thangAm], i) => {
  const [nam, thang, ngay] = s.split('-').map(Number);
  const d = { nam, thang, ngay };
  for (const kieu of ['tiet', 'am']) {
    const r = appYiJi(d, kieu);
    // Tu kiem: chep dung cach cua app thi `nen/kieng` cua chiTietNgay (dich nghia) phai bang danh sach nay dich nghia.
    const dich = (xs) => xs.map((c) => BANG.nenKieng[c]?.nghia ?? hv('nenKieng', c));
    const ct = chiTietNgay(d, kieu);
    if (JSON.stringify(ct.nen) !== JSON.stringify(dich(r.yi)) || JSON.stringify(ct.kieng) !== JSON.stringify(dich(r.ji))) {
      throw new Error(`Chep sai cach app tinh ${s} (${kieu})`);
    }
    app[kieu].push(r);
    if (kieu === 'tiet' && CHI[r.ct] !== chiTiet) lech.chiThangTiet.push(`${s} app ${CHI[r.ct]} / cnlunar ${chiTiet}`);
    if (kieu === 'am' && r.am.thang !== thangAm) lech.thangAm++;
    if (kieu === 'am' && r.ganChi !== gzNgay) lech.canChiNgay++;
  }
});

function so(nhan, kieuApp, cot) {
  const hang = [...VIEC, ...PHU].map(([ten, a, c]) => {
    const x = { a: 0, c: 0, ay: 0, cy: 0, aj: 0, cj: 0, trungY: 0, trungJ: 0, hopY: 0, hopJ: 0, nguoc: 0 };
    cn.forEach((e, i) => {
      const r = app[kieuApp][i];
      const [yiC, jiC] = e[cot];
      const aY = r.yi.includes(a), aJ = r.ji.includes(a) || r.ji.includes(TAT_CA);
      const cY = yiC.includes(c), cJ = jiC.includes(c) || jiC.includes(TAT_CA);
      x.ay += aY; x.cy += cY; x.aj += aJ; x.cj += cJ;
      x.trungY += aY === cY; x.trungJ += aJ === cJ;
      x.hopY += aY && cY; x.hopJ += aJ && cJ;
      x.nguoc += (aY && cJ) || (aJ && cY);
    });
    const n = cn.length, p = (v) => (100 * v / n).toFixed(1).padStart(5);
    const j = (both, ca, cc) => (100 * both / Math.max(1, ca + cc - both)).toFixed(1).padStart(5);
    // Cohen kappa: 0 = trung ngau nhien theo ti le co cua moi ben, 1 = trung het.
    const k = (po, ca, cc) => { const pe = (ca * cc + (n - ca) * (n - cc)) / n / n; return ((po / n - pe) / (1 - pe)).toFixed(2).padStart(5); };
    return { ten, n, ...x, line: `${(ten + '       ').slice(0, 9)} ${String(n).padStart(4)} | 宜 app ${String(x.ay).padStart(4)} cnl ${String(x.cy).padStart(4)} trung ${p(x.trungY)}% J ${j(x.hopY, x.ay, x.cy)}% k ${k(x.trungY, x.ay, x.cy)} | 忌 app ${String(x.aj).padStart(4)} cnl ${String(x.cj).padStart(4)} trung ${p(x.trungJ)}% J ${j(x.hopJ, x.aj, x.cj)}% k ${k(x.trungJ, x.aj, x.cj)} | nguoc ${String(x.nguoc).padStart(4)}` };
  });
  console.log(`\n${nhan}\n${hang.map((h) => h.line).join('\n')}`);
  const bay = hang.slice(0, VIEC.length);
  const tb = (k) => (bay.reduce((s, h) => s + h[k], 0) / bay.length / cn.length * 100).toFixed(1);
  return `${nhan.slice(0, 3)} 宜 ${tb('trungY')}% 忌 ${tb('trungJ')}% nguoc ${bay.reduce((s, h) => s + h.nguoc, 0)}`;
}

console.log(`cnlunar ${phienBan}, ${cn.length} ngay ${cn[0][0]} -> ${cn.at(-1)[0]}`);
console.log(`Kiem tra: lech chi ngay ${lech.canChiNgay}, lech so thang am ${lech.thangAm}, lech chi thang tiet ${lech.chiThangTiet.length} ngay`
  + (lech.chiThangTiet.length ? ` (${lech.chiThangTiet.slice(0, 6).join('; ')}...)` : ''));
const kq = [
  so("(a) app 'tiet' vs cnlunar thang tiet (godType=8char)", 'tiet', 4),
  so("(b) app 'am' vs cnlunar thang am (godType=cnlunar)", 'am', 5),
  so("(c) app 'am' (mac dinh) vs cnlunar mac dinh (thang tiet)", 'am', 4),
];
console.log(`\nSo do: cnlunar ${phienBan}, ${cn.length} ngay, 7 viec, trung trung binh: ${kq.join(' | ')}`);
