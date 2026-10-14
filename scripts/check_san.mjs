#!/usr/bin/env node
// Thuoc SAN: bat ba nuoc di lam yeu thuoc ma `check_nguong` khong thay.
//
// `check_nguong` canh CON SO — ai ha nguong thi no bao. Nhung cach lam yeu re
// hon khong dong vao so nao: tat kiem o dong do (`@ts-ignore`), tat mot bai test
// (`it.skip`), hay de mot ham rong cho co. Thuoc do van xanh, va do la van de.
//
// Cach lam chep tu skill `constraint-driven-development` muc Step 6 ("the five
// moves"), ban day o `.claude/skills/constraint-driven-development/`. Nuoc thu
// nam cua ho — them mot dong ngoai le — CO Y khong cai: repo nay khong co bang
// ngoai le nao, chan mot thu khong ton tai la them ma chet.
//
//   node scripts/check_san.mjs
//
// Do 21/09 luc dung thuoc: ca ba nuoc deu 0 lan trong `src/`, `scripts/`,
// `tools/`, `tests/`. Day la LUOI DUNG TRUOC, khong phai don dep — bat duoc dau
// dau tien ngay khi no vao, chu khong doi den luc co mot nam dau roi moi cat.

import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/**
 * Hai file tu ke cac mau tren — bo qua, khong thi thuoc tu bao chinh no va bao
 * ca bo thu cua no. Danh sach nay phai ngan va co ten day du: mot dong glob o
 * day la duong lach de ca thu muc khoi bi quet.
 */
const BO_QUA = new Set(['scripts/check_san.mjs', 'tests/CheckSan.test.ts']);

const DUOI = /\.(ts|tsx|mjs|js)$/;

/** Xuat de `tests/CheckSan.test.ts` thu duoc tung mau ma khong phai dung file gia. */
export const MAU = [
  {
    ten: 'tat kiem tai cho',
    re: /@ts-ignore|@ts-expect-error|eslint-disable|#\s*noqa|#\s*type:\s*ignore/,
    vi_sao: 'tat kiem o mot dong la bo mot phan thuoc. Sua goc, hoac neu that su ' +
      'phai tat thi hoi chu du an — tat lang la thuoc con xanh ma da thung.',
  },
  {
    ten: 'test bi tat',
    // Chi bat khi dang truoc la `it`/`test`/`describe`... Bat `.skip(` tran se dinh
    // ten ham that cua nguoi khac. KHONG doi dau `(` ngay sau: 28/09 lot dang gan qua
    // bien `const t = dk ? it.skip : it;`. `skipIf` cung la tat test co dieu kien.
    re: /\b(it|test|describe|suite|bench)\.(skip|skipIf|only|todo)\b|\bx(it|describe)\s*\(/,
    vi_sao: 'test tat di la thuoc mat mot phan ma khong ai thay. Sua test cho ' +
      'dung, hoac xoa han va ghi ly do — dung de no nam do gia vo con chay.',
  },
  {
    ten: 'ham rong de do',
    // `catch {}` RONG HAN. Co comment ben trong thi cho qua: 21/09 dem duoc 8 cho
    // `catch { /* ly do */ }` la fail-open CO Y cua hook. Ai muon nuot loi thi
    // phai viet ra vi sao.
    re: /catch\s*(\([^)]*\))?\s*\{\s*\}|throw new Error\(\s*['"`](Not implemented|Chua lam|TODO)/i,
    vi_sao: '`catch {}` trong hut loi di mat; `Not implemented` la viec chua xong ' +
      'nhung da qua thuoc. Nuot loi co chu dich thi viet ly do vao trong ngoac: ' +
      '`catch { /* vi sao bo qua */ }`.',
  },
];

/** Quet repo. Tach ra ham de `import` duoc MAU ma khong chay ca thuoc. */
function do_repo() {
  // Ca file MOI chua `git add` (khong bi .gitignore loai): khong thi file vua them lot thuoc toi luc
  // commit - do 03/10, check:san xanh truoc commit roi do tren main.
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
    .split('\n')
    .filter((p) => p && existsSync(p) && DUOI.test(p) && !BO_QUA.has(p) && !p.startsWith('node_modules/'));

  const dinh = [];
  for (const p of files) {
    const dong = readFileSync(p, 'utf8').split('\n');
    for (const m of MAU) {
      dong.forEach((d, i) => {
        if (m.re.test(d)) dinh.push({ p, dong: i + 1, m, van: d.trim().slice(0, 90) });
      });
    }
  }

  if (dinh.length === 0) {
    console.log(`So do: ${files.length} file, 0 dau tat thuoc (${MAU.length} mau)`);
    return 0;
  }

  const theoMau = new Map();
  for (const d of dinh) theoMau.set(d.m, [...(theoMau.get(d.m) ?? []), d]);

  for (const [m, ds] of theoMau) {
    console.log(`HONG ${m.ten} — ${ds.length} cho:`);
    for (const d of ds) console.log(`  ${d.p}:${String(d.dong)}  ${d.van}`);
    console.log(`  ${m.vi_sao}`);
  }
  console.log(`So do: ${dinh.length} dau tat thuoc trong ${files.length} file`);
  return 1;
}

// Chi quet khi duoc goi thang. `tests/CheckSan.test.ts` import MAU de thu tung
// bieu thuc — khong co dong nay thi chinh cai import do chay ca thuoc roi
// `process.exit(0)` giua bo test.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exit(do_repo());
}
