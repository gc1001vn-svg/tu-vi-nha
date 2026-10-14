// Chỉ phần lịch âm: liệt kê ngày @tuquet/@dqcai khác HND(+7), gom theo năm.
import { createRequire } from "module"; import fs from "fs";
const S = process.argv[2], r = createRequire(S + "/pk/js/package.json"), T = r("@tuquet/lunar");
const D = await import(S + "/pk/js/node_modules/@dqcai/vn-lunar/lib/index.mjs");
const { days } = JSON.parse(fs.readFileSync(S + "/tv_data.json"));
const k = (a, b, c, l) => `${a}/${b}${l ? "n" : ""}/${c}`, by = { tuquet: {}, dqcai: {} }, vd = { tuquet: [], dqcai: [] };
let dqLeapKey;
for (const [y, m, d, h7] of days) {
  const vn = k(...h7), t = T.solarToLunar({ day: d, month: m, year: y }), q = D.getLunarDate(d, m, y);
  dqLeapKey ??= Object.keys(q).join(",");
  for (const [n, v] of [["tuquet", k(t.day, t.month, t.year, t.isLeap)], ["dqcai", k(q.day, q.month, q.year, q.leap)]])
    if (v !== vn) { by[n][y] = (by[n][y] || 0) + 1; if (vd[n].length < 4) vd[n].push(`${d}/${m}/${y}: HND ${vn} · ${n} ${v}`); }
}
console.log("khoa dqcai:", dqLeapKey);
for (const n in by) console.log(n, "năm lệch:", JSON.stringify(by[n]), "\n  ví dụ:", vd[n].join(" | "));
