// Bang vang luu han phai "khoi tu Luu Thai Tue" (Dau Quan) tu `iztro` 2.6.2 (MIT, tu vi Trung Hoa): cung luu nien, luu nguyet,
// luu nhat, 4 sao luu Loc Kinh Da Ma (流禄 流羊 流陀 流马) va Tang Mon, Bach Ho (丧门, 白虎 vong 岁前). `tests/LuuHan.test.ts` so voi file nay.
// Chi lay ngay xem ma lich Trung Hoa (lunar-lite cua iztro) va lich Viet +7 (@tuquet/lunar) ra cung ngay am, khong nhuan —
// iztro tu doi ngay duong sang am theo lich Trung Hoa. Ngay sinh ngau nhien, khong phai nguoi that (luat 1 CLAUDE.md).
// Chay (chay.sh goi): node luu-han-iztro.mjs <thu muc co node_modules iztro, @tuquet/lunar> <ra.json> [so ca = 200] [hat = 20]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [pk, ra, soCa = '200', hat = '20'] = process.argv.slice(2);
const can = createRequire(join(pk, 'x.js'));
const { astro } = can('iztro');
const { solar2lunar } = can('lunar-lite');
const { solarToLunar } = can('@tuquet/lunar');

let s = Number(hat);
const ngauNhien = () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const tu = (a, b) => a + Math.floor(ngauNhien() * (b - a + 1));
// iztro danh so cung tu Dan = 0.
const chi = (i) => (i + 2) % 12;
const TEN = { 流禄: 'Lưu Lộc Tồn', 流羊: 'Lưu Kình Dương', 流陀: 'Lưu Đà La', 流马: 'Lưu Thiên Mã' };

const ca = [];
while (ca.length < Number(soCa)) {
  const y = tu(1930, 2030), m = tu(1, 12), d = tu(1, 28), h = tu(0, 11);
  const ngay = new Date(Date.UTC(tu(y + 1, Math.min(y + 90, 2100)), tu(0, 11), tu(1, 28)));
  const xem = ngay.toISOString().slice(0, 10);
  const cn = solar2lunar(xem);
  const vn = solarToLunar({ day: ngay.getUTCDate(), month: ngay.getUTCMonth() + 1, year: ngay.getUTCFullYear() }, 7);
  if (cn.isLeap || vn.isLeap || cn.lunarYear !== vn.year || cn.lunarMonth !== vn.month || cn.lunarDay !== vn.day) continue;
  const la = astro.byLunar(`${y}-${m}-${d}`, h, '男', false, true, 'zh-CN');
  const hs = la.horoscope(xem, 0);
  const sao = {};
  hs.yearly.stars.forEach((o, i) => o.forEach((x) => { if (x.name in TEN) sao[TEN[x.name]] = chi(i); }));
  hs.yearly.yearlyDecStar.suiqian12.forEach((ten, i) => {
    if (ten === '丧门') sao['Lưu Tang Môn'] = chi(i);
    if (ten === '白虎') sao['Lưu Bạch Hổ'] = chi(i);
  });
  ca.push({ vao: [d, m, y, h], xem, thaiTue: chi(hs.yearly.index), thang: chi(hs.monthly.index), ngay: chi(hs.daily.index), sao });
}
const nguon = 'iztro 2.6.2 (MIT) horoscope, sinh bang scripts/doi-chieu/luu-han-iztro.mjs; chi 0 = Ty; ngay xem lich Trung Hoa trung lich Viet';
writeFileSync(ra, JSON.stringify({ nguon, ca }));
console.log(`${String(ca.length)} ca -> ${ra}`);
