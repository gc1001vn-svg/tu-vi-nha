#!/usr/bin/env node
/**
 * Sinh `tests/vang/am-han-viet.json`: am Han-Viet DOC LAP cho moi chu Han ma `lunar-typescript` tra
 * ra, de `tests/HanVietDoiChieu.test.ts` doi chieu bang Claude soan (`src/loi/hanViet/`).
 *
 * Hai nguon doc lap voi nhau va voi Claude:
 *   - Unihan 17.0.0, truong kVietnamese (Unicode) — ban chep o GitHub `vearvip/hanzi-readings` (MIT),
 *     vi unicode.org bi mang may ao chan (do 14/10/2026).
 *   - `hanviet.csv` cua `ph0ngp/hanviet-pinyin-wordlist` (MIT; tong hop Thieu Chuu, Tran Van Chanh...).
 * Ca hai chu yeu ghi chu PHON THE -> chu gian the tra them qua kTraditionalVariant (`unicode-org/unihan-database`).
 *
 * Chay (can mang toi raw.githubusercontent.com):
 *   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/sinh_am_doi_chieu.mjs
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { lietKeChuHan } from '../tests/lietKeChuHan.ts';

const NGUON = {
  unihan: 'https://raw.githubusercontent.com/vearvip/hanzi-readings/main/src/dataSource/Unihan_Readings.txt',
  phonThe: 'https://raw.githubusercontent.com/unicode-org/unihan-database/main/kTraditionalVariant.txt',
  hanVietCsv: 'https://raw.githubusercontent.com/ph0ngp/hanviet-pinyin-wordlist/main/hanviet.csv',
};
// curl thay fetch: fetch cua Node khong di qua proxy HTTPS cua may ao.
const tai = (url) => execFileSync('curl', ['-sSfL', '-m', '180', url], { encoding: 'utf8', maxBuffer: 64 << 20 });
const van = Object.fromEntries(Object.entries(NGUON).map(([k, url]) => [k, tai(url)]));

const chuTuMa = (ma) => String.fromCodePoint(parseInt(ma, 16));
const them = (bang, chu, am) => bang.set(chu, (bang.get(chu) ?? new Set()).add(am));

const amUnihan = new Map();
for (const dong of van.unihan.split('\n')) {
  const [ma, truong, giaTri] = dong.split('\t');
  if (truong !== 'kVietnamese' || !ma.startsWith('U+')) continue; // bo dong chu thich '#'
  for (const am of giaTri.trim().split(/\s+/)) them(amUnihan, chuTuMa(ma.slice(2)), am.toLowerCase());
}
const phonThe = new Map();
for (const dong of van.phonThe.split('\n')) {
  const [dau, truong, giaTri] = dong.split('\t');
  const ma = /^U\+([0-9A-F]+)/.exec(dau)?.[1];
  if (truong !== 'kTraditionalVariant' || ma === undefined) continue;
  phonThe.set(chuTuMa(ma), [...giaTri.matchAll(/U\+([0-9A-F]+)/g)].map((m) => chuTuMa(m[1])));
}
const amCsv = new Map();
for (const dong of van.hanVietCsv.split('\n').slice(1)) {
  const chu = [...dong][0];
  if (chu === undefined) continue;
  for (const m of dong.matchAll(/'([^']+)'/g)) them(amCsv, chu, m[1].toLowerCase());
}

const chuHan = new Set();
for (const m of lietKeChuHan([2020, 1, 1], [2031, 12, 31], [2025, 1, 1], [2025, 12, 31]).values()) {
  for (const khoa of m.keys()) for (const c of khoa) if (/\p{Script=Han}/u.test(c)) chuHan.add(c);
}
const am = {};
let khongNguon = 0;
for (const c of [...chuHan].sort()) {
  const s = new Set();
  for (const x of [c, ...(phonThe.get(c) ?? [])]) for (const nguon of [amUnihan, amCsv]) for (const a of nguon.get(x) ?? []) s.add(a);
  am[c] = [...s].sort();
  if (s.size === 0) khongNguon++;
}
const bam = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
writeFileSync('tests/vang/am-han-viet.json', JSON.stringify({
  nguon: Object.fromEntries(Object.entries(NGUON).map(([k, url]) => [k, { url, sha256: bam(van[k]) }])),
  lenh: 'node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/sinh_am_doi_chieu.mjs',
  am,
}) + '\n');
console.log(`So do: ${chuHan.size} chu Han, ${chuHan.size - khongNguon} co am nguon, ${khongNguon} khong co`);
