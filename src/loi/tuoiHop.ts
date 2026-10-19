/**
 * Tuoi hop, tuoi ky theo chi nam sinh (nam Tet, QUY_UOC muc 1): tam hop, luc hop, tu hanh xung, luc xung, luc hai.
 * Nguon: dienmayxanh, mytour, giaoducthudo (tam hop, luc hop, tu hanh xung, luc hai); cung cong thuc xung/hop voi
 * `theoTuoi` (`src/loi/homNay.ts`, QUY_UOC muc 11) — `tests/TuoiHop.test.ts` doi chieu.
 */
import { CHI } from './amLich.ts';
import { hv } from './hanViet/index.ts';

export interface TuoiHop {
  readonly tamHop: readonly string[];
  readonly lucHop: string;
  readonly tuHanhXung: readonly string[];
  readonly lucXung: string;
  readonly lucHai: string;
}

const ten = (c: number): string => hv('chi', CHI.charAt(c % 12));

/** `chiNam`: 0 = Ty. Luc hop: tong hai chi chia 12 du 1; luc hai: du 7; tam hop cach 4; tu hanh xung cach 3. */
export function tuoiHop(chiNam: number): TuoiHop {
  const b = chiNam;
  return {
    tamHop: [b + 4, b + 8].map(ten),
    lucHop: ten(13 - b),
    tuHanhXung: [b + 3, b + 6, b + 9].map(ten),
    lucXung: ten(b + 6),
    lucHai: ten(19 - b),
  };
}
