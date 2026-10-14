// Khai bao kieu cho `ai_goi.mjs`, de `tests/AiGoi.test.ts` import ma khong phai
// tat kiem bang `@ts-expect-error` — chinh dau ma thuoc `check:san` cam.
// Duoi phai la `.d.mts`: TS khong nhan `.d.ts` cho mot module `.mjs` va bao
// TS7016 chu khong im.
import type ts from 'typescript';

export declare function docChuongTrinh(goc?: string): ts.Program;
export declare function laKhaiBaoGoiDuoc(node: ts.Node): boolean;
export declare function timKhaiBao(program: ts.Program, ten: string): ts.Node[];
export declare function timCaller(
  program: ts.Program,
  ten: string,
  goc?: string,
): {
  ten: string;
  khai_bao: { file: string; dong: number; loai: string }[];
  cho: { file: string; dong: number; trong: string; van: string }[];
  chua_chac: number;
};
