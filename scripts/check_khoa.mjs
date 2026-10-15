#!/usr/bin/env node
/**
 * Thuoc: khong file nao LEN GIT duoc mang hinh dang mot khoa API.
 *
 * VI SAO CAN. Repo nay **Public**. Khoa lo mot lan la lo vinh vien - lich su git khong xoa
 * duoc tu may ao (`git push --force` va xoa nhanh deu bi chan, xem `docs/TIEN_DO.md`).
 * Ba khoa da di qua du an nay - `POLY_PIZZA_KEY`, `FREESOUND_KEY`, va tu 19/09 co the
 * them khoa Gemini - tat ca deu chi duoc di qua BIEN MOI TRUONG. Thuoc nay la cai bat khi
 * ai do quen.
 *
 * CHI quet file SE LEN GIT: dang theo doi, cong file moi chua `git add` ma `.gitignore` khong
 * loai. File bi ignore thi khong phai viec cua thuoc nay: `.duyet/`, `assets_source/`,
 * `.claude/so_lenh.log` deu bi ignore va deu co the chua khoa mot cach chinh dang.
 *
 * Chay: `node scripts/check_khoa.mjs`
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

/**
 * Mau khoa, ghep tu manh de CHINH FILE NAY khong tu bao minh.
 *
 * Moi muc: ten de nguoi doc hieu ngay lo cai gi, va bieu thuc tim.
 */
const MAU = [
  ['khoa Google (AIza…)', new RegExp(`${'AIza'}[0-9A-Za-z_-]{35}`)],
  // Khoa AI Studio kieu MOI, gan voi service account. Do 19/09 tren khoa that: no bat dau
  // bang `AQ.` chu KHONG phai `AIza`, dai 53 ky tu. Chi bat mau `AIza` la lot sach.
  ['khoa Google kieu moi (AQ.…)', new RegExp(`${'AQ'}\\.[0-9A-Za-z_-]{30,}`)],
  ['khoa Anthropic (sk-ant-…)', new RegExp(`${'sk'}-ant-[0-9A-Za-z_-]{20,}`)],
  ['khoa OpenAI (sk-…)', new RegExp(`${'sk'}-[A-Za-z0-9]{32,}`)],
  ['token GitHub (ghp_/gho_/ghs_…)', new RegExp(`${'gh'}[pousr]_[0-9A-Za-z]{36}`)],
  ['khoa AWS (AKIA…)', new RegExp(`${'AKIA'}[0-9A-Z]{16}`)],
  // Bat kieu `api_key: "…"` chung chung. Doi >= 24 ky tu de khong bao nham duong dan,
  // ma so trong `public/atlas/*.json` thi khong co dau nhay nen cung khong dinh.
  ['gan thang mot bi mat vao ma nguon', /(api[_-]?key|auth[_-]?token|client[_-]?secret)\s*[:=]\s*['"][A-Za-z0-9_\-.]{24,}['"]/i],
];

/** File tu mo ta cac mau tren - bo qua, khong thi thuoc tu bao chinh no. */
const BO_QUA = new Set(['scripts/check_khoa.mjs']);

/** File nhi phan va file sinh tu dong: khong doc, khong the chua khoa nguoi go vao. */
const DUOI_BO = /\.(png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|mp3|ogg|wav|glb|gltf|bin|zip)$/i;

/** Tran doc mot file, tranh ngon ca bo nho vi mot file sinh tu dong that to. */
const TRAN_BYTE = 2_000_000;

const dinh = [];
let daQuet = 0;

// Ca file MOI chua `git add` (khong bi .gitignore loai): khong thi file vua them lot thuoc toi luc
// commit - do 03/10, check:san xanh truoc commit roi do tren main.
const danhSach = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  .split('\0')
  .filter((t) => t !== '');

for (const duong of danhSach) {
  if (BO_QUA.has(duong) || DUOI_BO.test(duong)) continue;
  let noi;
  try {
    if (statSync(duong).size > TRAN_BYTE) continue;
    noi = readFileSync(duong, 'utf8');
  } catch {
    continue;
  }
  daQuet += 1;
  const dong = noi.split('\n');
  for (const [ten, mau] of MAU) {
    for (let i = 0; i < dong.length; i += 1) {
      const d = dong[i] ?? '';
      if (!mau.test(d)) continue;
      // In so dong va TEN mau, KHONG in lai chuoi trung - in ra la chep them mot ban nua.
      dinh.push(`${duong}:${String(i + 1)}  ${ten}`);
    }
  }
}

if (dinh.length > 0) {
  console.error(`check:khoa HONG - ${String(dinh.length)} cho co hinh dang khoa API trong file se len git:`);
  for (const d of dinh) console.error(`  - ${d}`);
  console.error('');
  console.error('Repo nay Public. Khoa chi duoc di qua BIEN MOI TRUONG, khong bao gio vao git.');
  console.error('Lo roi thi XOAY KHOA truoc, xoa sau - lich su git khong xoa duoc tu may ao.');
  process.exit(1);
}

console.log(`check:khoa OK - quet ${String(daQuet)} file se len git (dang theo doi + moi chua add), khong thay khoa nao.`);
