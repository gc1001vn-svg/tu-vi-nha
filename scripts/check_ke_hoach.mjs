#!/usr/bin/env node
// Thuoc: file trong `docs/ke-hoach/` khong duoc dai qua NGUONG dong, va (tu 17/11) phai ghi KET QUA.
//
// Vi sao co thuoc nay: do 13/09 thay khuon noi "toi da 20 dong" ma thuc te
// 210 va 145 dong — vuot 10 lan va 7 lan. Luat khong ai giu thi khong phai luat.
//
// Nguong 60 KHONG phai con so cho dep: no la so do that cua hai ban ke hoach gan
// nhat (53 va 43 dong) cong cho tho. Khuon cu 20 dong la uoc, chua tung ai dat.
//
// Ke hoach dai la dau hieu lam SAI CHO: phan dai thuong la giai thich va so do,
// thu do thuoc ve `docs/NHAT_KY/` (ghi SAU khi lam) chu khong phai ke hoach
// (ghi TRUOC khi lam). `cong-cu/luat-chi-tiet.md` muc "Lap ke hoach" co bang chon muc.
//
// 17/11 THEM DONG `Kết quả:` — ke hoach lap xong khong ai doi chieu lai. Ra 17/11: `tu-vi-nha` 32 ban,
// dung 1 ban ghi ket qua that; 8 ban chi tay noi nhau vi ban truoc do tren may ao dat ma may that hong.
// Luat: file co ngay o ten tu MOC_KET_QUA tro di phai co mot dong bat dau bang `Kết quả:`. Luc lap ghi
// `Kết quả: đang làm`; xong ghi so do that. De "đang làm" / "chưa" qua HAN_MO ngay (tinh tu ngay o ten
// file) la do: ghi ket qua that, hoac `Kết quả: bỏ — <ly do>`. File cu hon moc: mien, khong sua lich su.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const NGUONG = Number(process.env.NGUONG_KE_HOACH) || 60;
const THU_MUC = 'docs/ke-hoach';
const MOC_KET_QUA = '2026-11-17';
const HAN_MO = 7;
// `GC_HOM_NAY` chi de thu (bo mau `scripts/do.sh`): thuoc phu thuoc ngay thi mau thu phai dong bang duoc ngay.
const HOM_NAY = process.env.GC_HOM_NAY || new Date().toISOString().slice(0, 10);

// Hai file viet TRUOC khi co thuoc nay. Khong cat — cat la sua lich su ke hoach
// da duyet. Chung dung day lam moc: dung viet dai nhu vay nua.
const MIEN = new Set([
  '2026-09-07-phase-3.md',
  '2026-09-10-quy-hoach-lai.md',
]);

if (!existsSync(THU_MUC)) {
  console.log(`${THU_MUC} khong ton tai — bo qua`);
  process.exit(0);
}

const qua = [];
const thieu = [];
const treo = [];
let n = 0;
for (const ten of readdirSync(THU_MUC).filter((t) => t.endsWith('.md')).sort()) {
  const noiDung = readFileSync(join(THU_MUC, ten), 'utf8');
  const dong = noiDung.replace(/\n$/, '').split('\n').length;
  const mien = MIEN.has(ten);
  n += 1;
  let ghiChu = mien ? '  (mien, viet truoc khi co thuoc)' : '';
  const ngay = ten.slice(0, 10);
  if (/^\d{4}-\d\d-\d\d$/.test(ngay) && ngay >= MOC_KET_QUA) {
    const kq = /^[ \t>*-]*(?:Kết quả|Ket qua)\**[ \t]*:(.*)$/imu.exec(noiDung);
    if (!kq) {
      thieu.push(ten);
      ghiChu += '  <-- THIEU dong `Kết quả:`';
    } else if (/^(đang làm|dang lam|chưa|chua)/iu.test(kq[1].replace(/^[\s*_`]+/, ''))) {
      const tuoi = Math.floor((Date.parse(HOM_NAY) - Date.parse(ngay)) / 86400000);
      if (tuoi > HAN_MO) {
        treo.push(`${ten} — ${tuoi} ngay`);
        ghiChu += '  <-- TREO';
      } else {
        ghiChu += '  (dang lam)';
      }
    }
  }
  console.log(`  ${String(dong).padStart(4)} dong  ${ten}${ghiChu}`);
  if (dong > NGUONG && !mien) qua.push({ ten, dong });
}

console.log(`${THU_MUC}: ${n} file, nguong ${NGUONG} dong`);

const loi = [];
if (qua.length) {
  loi.push(
    `${qua.length} ke hoach vuot nguong:\n` +
    qua.map((q) => `  ${q.ten} — ${q.dong} dong`).join('\n') +
    `\n  Cat xuong duoi ${NGUONG}. Phan giai thich va so do day sang docs/NHAT_KY/,` +
    `\n  do la cho ghi SAU khi lam; ke hoach chi ghi TRUOC khi lam.`,
  );
}
if (thieu.length) {
  loi.push(
    `${thieu.length} ke hoach thieu dong \`Kết quả:\`:\n` +
    thieu.map((t) => `  ${t}`).join('\n') +
    '\n  Them mot dong bat dau bang `Kết quả:` — dang lam thi `Kết quả: đang làm`; xong thi so do that,' +
    '\n  do tren may ao hay may that, lech ke hoach cho nao.',
  );
}
if (treo.length) {
  loi.push(
    `${treo.length} ke hoach de "dang lam" qua ${HAN_MO} ngay:\n` +
    treo.map((t) => `  ${t}`).join('\n') +
    '\n  Ghi ket qua that vao dong `Kết quả:`, hoac `Kết quả: bỏ — <ly do>`.',
  );
}
if (loi.length) {
  console.error(`HONG: ${loi.join('\nHONG: ')}`);
  process.exit(1);
}
