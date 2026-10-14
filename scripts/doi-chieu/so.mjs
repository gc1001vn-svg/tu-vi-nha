// So iztro (tử vi TQ) với ansaotuvi (tử vi VN), và 3 thư viện lịch âm với thuật toán HND.
import { createRequire } from "module"; import fs from "fs";
const S = process.argv[2], r = createRequire(S + "/pk/js/package.json");
const { astro } = r("iztro"), { Solar } = r("lunar-javascript"), T = r("@tuquet/lunar");
const D = await import(S + "/pk/js/node_modules/@dqcai/vn-lunar/lib/index.mjs");
const { cases, days } = JSON.parse(fs.readFileSync(S + "/tv_data.json"));
const n = (s) => s.normalize("NFC").toLowerCase();
const HOA = { "Lộc": "hóa lộc", "Quyền": "hóa quyền", "Khoa": "hóa khoa", "Kỵ": "hóa kỵ" };
function chart(a) {
  const m = {};
  for (const p of a.palaces) for (const s of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
    m[n(s.name)] = p.earthlyBranch; if (s.mutagen && HOA[s.mutagen]) m[HOA[s.mutagen]] = p.earthlyBranch;
  }
  return { m, menh: a.earthlyBranchOfSoulPalace, than: a.earthlyBranchOfBodyPalace };
}
const tuChoi = [], lech = {}, chung = {}, tong = { solar: [0, 0, 0], lunar: [0, 0, 0] }; // [menh lệch, than lệch, ca có sao chính lệch]
const CHINH = ["tử vi","thiên cơ","thái dương","vũ khúc","thiên đồng","liêm trinh","thiên phủ","thái âm","tham lang","cự môn","thiên tướng","thiên lương","thất sát","phá quân"];
for (const c of cases) {
  const g = c.g === 1 ? "male" : "female", [ld, lm, ly, leap] = c.lunar;
  let al; try { al = astro.byLunar(`${ly}-${lm}-${ld}`, c.h, g, !!leap, true, "vi-VN"); } catch { tuChoi.push(`${c.y}-${c.m}-${c.d} → âm VN ${ld}/${lm}${leap ? " nhuận" : ""}/${ly}`); al = null; }
  for (const [k, a] of [["solar", astro.bySolar(`${c.y}-${c.m}-${c.d}`, c.h, g, true, "vi-VN")], ["lunar", al]]) {
    if (!a) continue;
    const x = chart(a);
    if (n(x.menh) !== n(c.menh)) tong[k][0]++;
    if (n(x.than) !== n(c.than)) tong[k][1]++;
    if (CHINH.some((s) => n(x.m[s] || "") !== n(c.stars[s] || "?"))) tong[k][2]++;
    if (k === "lunar") for (const s in c.stars) if (x.m[s]) { chung[s] = (chung[s] || 0) + 1; if (n(x.m[s]) !== n(c.stars[s])) lech[s] = (lech[s] || 0) + 1; }
  }
}
console.log("iztro từ chối ngày âm VN:", tuChoi.length, tuChoi.slice(0, 3).join(" | "));
console.log("Tử vi, 3000 ca — [mệnh lệch, thân lệch, ca có ≥1 chính tinh lệch]:", JSON.stringify(tong));
const ds = Object.keys(chung).map((s) => [s, lech[s] || 0, chung[s]]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]);
console.log("Sao cùng tên ở hai bên:", Object.keys(chung).length, "· sao lệch (tên, số ca lệch / số ca):", JSON.stringify(ds));
const k = (a, b, c, l) => `${a}-${b}-${c}-${l ? 1 : 0}`; let cnt = { tz8: 0, tq: 0, tq_vs_tz8: 0, tuquet: 0, dqcai: 0 }, vd = [];
for (const [y, m, d, h7, h8] of days) {
  const vn = k(...h7), cn8 = k(...h8);
  const L = Solar.fromYmd(y, m, d).getLunar(), tq = k(L.getDay(), Math.abs(L.getMonth()), L.getYear(), L.getMonth() < 0);
  const t = T.solarToLunar({ day: d, month: m, year: y }), tu = k(t.day, t.month, t.year, t.isLeap);
  const q = D.getLunarDate(d, m, y), dq = k(q.day, q.month, q.year, q.leap ?? q.isLeap);
  if (vn !== cn8) { cnt.tz8++; if (vd.length < 3) vd.push(`${y}-${m}-${d}: VN ${vn} / TQ ${tq}`); }
  if (vn !== tq) cnt.tq++; if (cn8 !== tq) cnt.tq_vs_tz8++; if (vn !== tu) cnt.tuquet++; if (vn !== dq) cnt.dqcai++;
}
console.log("Lịch âm", days.length, "ngày 1900–2100, số ngày khác HND(+7):", JSON.stringify(cnt), "· ví dụ:", vd.join(" | "));
