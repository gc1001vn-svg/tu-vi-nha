// So lá số altuvi.com (ảnh chủ dự án) với ansaotuvi và iztro (đưa ngày âm VN vào).
// Chạy: node so-altuvi.mjs <thư mục có node_modules iztro> <mau-altuvi.json> <kết quả so-altuvi.py>
import { createRequire } from "module"; import fs from "fs";
const [nm, mauFile, pyFile] = process.argv.slice(2), { astro } = createRequire(nm + "/package.json")("iztro");
const mau = JSON.parse(fs.readFileSync(mauFile)).ca, py = JSON.parse(fs.readFileSync(pyFile));
const n = (s) => (s || "").normalize("NFC").toLowerCase(), HOA = { "Lộc": "hóa lộc", "Quyền": "hóa quyền", "Khoa": "hóa khoa", "Kỵ": "hóa kỵ" };
for (const c of mau) {
  const p = py.find((x) => x.ten === c.ten), [ld, lm, ly, leap] = p.lunar;
  const g = c.gioi === "nam" ? "male" : "female", iz = {};
  let a, cach = "ngày âm VN";
  try { a = astro.byLunar(`${ly}-${lm}-${ld}`, c.gioIztro, g, !!leap, true, "vi-VN"); }
  catch { a = astro.bySolar(c.duong, c.gioIztro, g, true, "vi-VN"); cach = "ngày dương (iztro từ chối ngày âm VN)"; }
  for (const q of a.palaces) for (const s of [...q.majorStars, ...q.minorStars, ...q.adjectiveStars]) {
    iz[n(s.name)] = q.earthlyBranch; if (HOA[s.mutagen]) iz[HOA[s.mutagen]] = q.earthlyBranch;
  }
  const bang = { ansaotuvi: [0, 0, []], iztro: [0, 0, []] }; // [khớp, có so, danh sách lệch]
  for (const [ten, chi] of Object.entries(c.sao)) for (const [k, m] of [["ansaotuvi", p.sao], ["iztro", iz]]) {
    if (!m[ten]) continue; bang[k][1]++;
    if (n(m[ten]) === n(chi)) bang[k][0]++; else bang[k][2].push(`${ten}: altuvi ${chi} / ${m[ten]}`);
  }
  console.log(`Ca ${c.ten} (iztro lập từ ${cach}) — mệnh altuvi ${c.menh} · ansaotuvi ${p.menh} · iztro ${a.earthlyBranchOfSoulPalace}; thân ${c.than} · ${p.than} · ${a.earthlyBranchOfBodyPalace}`);
  for (const k in bang) console.log(`  ${k}: khớp ${bang[k][0]}/${bang[k][1]} sao · lệch: ${bang[k][2].join("; ") || "không"}`);
}
