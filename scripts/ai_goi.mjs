#!/usr/bin/env node
// Tim AI GOI mot ham/method, bang TypeScript Compiler API.
//
// Vi sao co script nay: `grep -rn '<ten>'` tra ve moi cho van ban trung ten —
// comment, chuoi, va method cung ten cua class khac. Do 22/09 tren repo nay:
// `grep -rn '\bve\b'` ra 446 dong (~11.125 token) de tra loi mot cau hoi ma
// cau tra loi that chi co vai dong. Cang nhieu ten pho bien thi khoang cach
// cang gian.
//
// Vi sao khong dung `@nanonets/graft`: no lam dung viec nay va lam tot, nhung
// keo theo 392 MB moi phien (binding tree-sitter 8 ngon ngu ta khong dung), bat
// telemetry san, va moi lan chay lai nhet mot dong VAO NGU CANH TRO LY bao no
// quang cao so token da tiet kiem trong cau tra loi gui chu du an
// (`dist/context/savings.js`, ham `savingsTurnNudge`). So do va ly do day du:
// kho ghi-nho, `quyet-dinh/2026-09-22-graft-chua-dung.md`.
//
// `typescript` da nam san trong `devDependencies` — day la bac "thu vien DA cai"
// cua thang tra-truoc-khi-viet, khong them phu thuoc nao. Compiler API con chuan
// hon tree-sitter o dung cho no hieu kieu: hai `doi()` cua hai class khac nhau
// la hai symbol khac nhau, khong phai mot ten trung.
//
//   node scripts/ai_goi.mjs xayNha
//   node scripts/ai_goi.mjs doi nhip ve   # nhieu ten, mot lan nang chuong trinh
//   node scripts/ai_goi.mjs doi --json

import ts from 'typescript';
import { pathToFileURL } from 'node:url';
import { dirname, relative } from 'node:path';

/** Dung `tsconfig.json` cua repo lam nguon su that ve "file nao thuoc du an". */
export function docChuongTrinh(goc = process.cwd()) {
  const duong = ts.findConfigFile(goc, ts.sys.fileExists, 'tsconfig.json');
  if (duong === undefined) throw new Error(`khong tim thay tsconfig.json tu ${goc}`);
  const doc = ts.readConfigFile(duong, ts.sys.readFile);
  if (doc.error !== undefined) {
    throw new Error(ts.flattenDiagnosticMessageText(doc.error.messageText, '\n'));
  }
  const cau_hinh = ts.parseJsonConfigFileContent(doc.config, ts.sys, dirname(duong));
  return ts.createProgram(cau_hinh.fileNames, cau_hinh.options);
}

/** Duyet moi nut cua moi file NGUON (bo file khai bao `.d.ts`). */
function moiNut(program, lam) {
  for (const sf of program.getSourceFiles()) {
    if (sf.isDeclarationFile) continue;
    const di = (node) => {
      lam(node, sf);
      ts.forEachChild(node, di);
    };
    ts.forEachChild(sf, di);
  }
}

/**
 * Nhung dang khai bao co the "bi goi". Bien va thuoc tinh chi tinh khi no GIU
 * MOT HAM — khong loc cho nay thi mot `const doi = 3` o test cung hien ra nhu
 * mot dich, dung cai nhieu ma script nay sinh ra de cat.
 */
export function laKhaiBaoGoiDuoc(node) {
  if (
    ts.isFunctionDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isMethodSignature(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isClassDeclaration(node)
  ) {
    return true;
  }
  if (!ts.isVariableDeclaration(node) && !ts.isPropertyDeclaration(node)) return false;
  const gan = node.initializer;
  return (
    gan !== undefined && (ts.isArrowFunction(gan) || ts.isFunctionExpression(gan))
  );
}

/** Ten loai khai bao, in cho nguoi doc. */
function loaiKhaiBao(node) {
  if (ts.isFunctionDeclaration(node)) return 'function';
  if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) return 'method';
  if (ts.isGetAccessorDeclaration(node)) return 'get';
  if (ts.isClassDeclaration(node)) return 'class';
  return 'ham gan cho bien';
}

/** Moi khai bao mang ten `ten`. Day la DICH ma caller phai tro dung vao. */
export function timKhaiBao(program, ten) {
  const ds = [];
  moiNut(program, (node) => {
    const n = node.name;
    if (n !== undefined && ts.isIdentifier(n) && n.text === ten && laKhaiBaoGoiDuoc(node)) {
      ds.push(node);
    }
  });
  return ds;
}

/** Nut Identifier mang ten ham trong mot bieu thuc goi. */
function nutTen(bieu_thuc) {
  if (ts.isIdentifier(bieu_thuc)) return bieu_thuc;
  if (ts.isPropertyAccessExpression(bieu_thuc)) return bieu_thuc.name;
  return undefined;
}

/** Ham/method bao quanh mot nut — de cau tra loi noi duoc AI goi, khong chi o dau. */
function hamBao(node) {
  for (let p = node.parent; p !== undefined; p = p.parent) {
    if (ts.isConstructorDeclaration(p)) return 'constructor';
    if (
      ts.isFunctionDeclaration(p) ||
      ts.isMethodDeclaration(p) ||
      ts.isGetAccessorDeclaration(p)
    ) {
      return p.name !== undefined && ts.isIdentifier(p.name) ? p.name.text : '<khuyet danh>';
    }
    if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  }
  return '<muc file>';
}

function viTri(sf, node, goc) {
  const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  return { file: relative(goc, sf.fileName), dong: line + 1 };
}

/**
 * Moi cho goi that. `chua_chac` dem nhung cho TEN KHOP ma checker khong noi duoc
 * no tro vao dau — khai ra chu khong nuot, vi con so 0 im lang va con so 0 da
 * kiem la hai thu khac nhau.
 */
export function timCaller(program, ten, goc = process.cwd()) {
  const checker = program.getTypeChecker();
  const dich = new Set(timKhaiBao(program, ten));
  const cho = [];
  let chua_chac = 0;

  moiNut(program, (node, sf) => {
    if (!ts.isCallExpression(node) && !ts.isNewExpression(node)) return;
    const nut = nutTen(node.expression);
    if (nut === undefined || nut.text !== ten) return;

    let sym = checker.getSymbolAtLocation(nut);
    if (sym !== undefined && (sym.flags & ts.SymbolFlags.Alias) !== 0) {
      sym = checker.getAliasedSymbol(sym);
    }
    const khai_bao = sym?.declarations ?? [];
    if (khai_bao.length === 0) {
      chua_chac += 1;
      return;
    }
    if (!khai_bao.some((d) => dich.has(d))) return;

    const { file, dong } = viTri(sf, node, goc);
    cho.push({ file, dong, trong: hamBao(node), van: node.getText(sf).split('\n')[0].trim() });
  });

  return {
    ten,
    khai_bao: [...dich].map((d) => ({
      ...viTri(d.getSourceFile(), d, goc),
      loai: loaiKhaiBao(d),
    })),
    cho,
    chua_chac,
  };
}

function inRa(kq) {
  if (kq.khai_bao.length === 0) {
    console.log(`khong co khai bao nao ten "${kq.ten}" trong du an`);
    return 1;
  }
  for (const k of kq.khai_bao) console.log(`${kq.ten} · ${k.loai} · ${k.file}:${k.dong}`);
  if (kq.cho.length === 0) {
    console.log('  khong ai goi');
  }
  for (const c of kq.cho) {
    console.log(`  <- ${c.trong}  ${c.file}:${c.dong}`);
    console.log(`       ${c.van}`);
  }
  if (kq.chua_chac > 0) {
    console.log(`  (${kq.chua_chac} cho trung ten ma checker khong lan ra khai bao)`);
  }
  console.log(`So do: ${kq.cho.length} cho goi that, ${kq.khai_bao.length} khai bao`);
  return 0;
}

// Chi chay khi duoc goi thang — `tests/AiGoi.test.ts` import cac ham tren, va
// khong co dong nay thi chinh cai import do chay ca script giua bo test.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const doi_so = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (doi_so.length === 0) {
    console.log('dung: node scripts/ai_goi.mjs <ten-ham> [<ten-ham>...] [--json]');
    process.exit(2);
  }
  // Nhieu ten trong MOT lan chay: dung `tsconfig` nang chuong trinh mat ~6 giay,
  // con moi truy van them chi la mot luot duyet cay. Hoi ba ten mot lenh re hon
  // ba lenh gan ba lan.
  const program = docChuongTrinh();
  const ds = doi_so.map((ten) => timCaller(program, ten));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ds.length === 1 ? ds[0] : ds, null, 1));
    process.exit(0);
  }
  process.exit(Math.max(...ds.map(inRa)));
}
