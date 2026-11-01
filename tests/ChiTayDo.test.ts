/**
 * May tu do chi tay (dot 7 phan 3), khong trinh duyet: anh khung chuan TONG HOP — nen xam co nhieu (hat co dinh) + nep toi ve theo
 * duong biet truoc — phai ra dung o: duong doi dai, vong rong; duong tri cong, dinh duong doi; duong tinh dai; su nghiep tu co tay;
 * mot nep ngang suot ban tay thi la chi tay ngang. Anh that do o `scripts/doi-chieu/do-chi-tay-anh.mjs`.
 */
import { CAO, KHUNG_ANH, RONG, doChiTay, type Diem, type MocTay } from '../src/loi/chiTayDo.ts';

const MOC: MocTay = { co: { x: 0, y: 0 }, caiGoc: { x: 0.28, y: 0.18 }, caiKhop: { x: 0.5, y: 0.4 }, tro: { x: 0.3, y: 0.95 },
  giua: { x: 0, y: 1 }, apUt: { x: -0.2, y: 0.95 }, ut: { x: -0.38, y: 0.85 } };

/** Anh nen 0,6 + nhieu ±0,03 (LCG hat co dinh), ve cac nep toi sau 0,25, be ngang ~1,5 diem anh. */
function anh(nep: readonly (readonly Diem[])[]): Float32Array {
  let hat = 20261101;
  const a = Float32Array.from({ length: RONG * CAO }, () => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return 0.6 + (hat / 2 ** 31 - 0.5) * 0.06; });
  for (const d of nep) {
    for (let k = 0; k < d.length - 1; k++) {
      const p = d[k], q = d[k + 1];
      if (p === undefined || q === undefined) continue;
      const n = Math.ceil(Math.hypot(q.x - p.x, q.y - p.y) * KHUNG_ANH.px * 2);
      for (let t = 0; t <= n; t++) {
        const ci = (p.x + ((q.x - p.x) * t) / n - KHUNG_ANH.x0) * KHUNG_ANH.px, cj = (KHUNG_ANH.y1 - (p.y + ((q.y - p.y) * t) / n)) * KHUNG_ANH.px;
        for (let j = Math.floor(cj - 4); j <= cj + 4; j++) for (let i = Math.floor(ci - 4); i <= ci + 4; i++) {
          if (i < 0 || j < 0 || i >= RONG || j >= CAO) continue;
          const v = 0.6 - 0.25 * Math.exp(-((i + 0.5 - ci) ** 2 + (j + 0.5 - cj) ** 2) / (2 * 1.5 ** 2));
          a[j * RONG + i] = Math.min(a[j * RONG + i] ?? 1, v);
        }
      }
    }
  }
  return a;
}

/** Duong gay khuc qua cac diem; cung tron quanh `tam` tu goc g0 toi g1 (do), ban kinh r0 → r1. */
const cung = (tam: Diem, g0: number, g1: number, r0: number, r1: number): Diem[] => Array.from({ length: 40 }, (_, k) => {
  const t = k / 39, g = ((g0 + (g1 - g0) * t) * Math.PI) / 180, r = r0 + (r1 - r0) * t;
  return { x: tam.x + r * Math.cos(g), y: tam.y + r * Math.sin(g) };
});
const TAM_DOI = { x: (MOC.caiGoc.x + MOC.caiKhop.x) / 2 + 0.05, y: (MOC.caiGoc.y + MOC.caiKhop.y) / 2 };
const DOI = cung(TAM_DOI, 100, 225, 0.4, 0.38);

describe('may tu do chi tay tren anh tong hop', () => {
  test('bon duong: doi dai, vong rong; tri cong, dinh duong doi; tinh dai; su nghiep tu co tay', () => {
    const tinh = [{ x: -0.45, y: 0.8 }, { x: -0.1, y: 0.84 }, { x: 0.15, y: 0.9 }, { x: 0.28, y: 0.93 }];
    const tri = [{ x: 0.34, y: 0.68 }, { x: 0.05, y: 0.6 }, { x: -0.2, y: 0.52 }, { x: -0.4, y: 0.44 }];
    const su = [{ x: -0.13, y: 0.08 }, { x: -0.11, y: 0.45 }, { x: -0.09, y: 0.82 }];
    const { khung: k, vet } = doChiTay(anh([tinh, tri, DOI, su]), MOC);
    expect(k.simian).toBe(false);
    expect([k.duong.life.length, k.duong.life.arc, k.duong.head.shape, k.duong.head.joined, k.duong.heart.length, k.duong.fate.start])
      .toEqual(['long', 'wide', 'curved', true, 'long', 'wrist']);
    for (const d of ['life', 'head', 'heart', 'fate'] as const) expect(k.duong[d].seen).not.toBe('none');
    const gan = (p: Diem, d: readonly Diem[]): number => Math.min(...d.flatMap((a, i) => {
      const b = d[i + 1];
      if (b === undefined) return [];
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / ((b.x - a.x) ** 2 + (b.y - a.y) ** 2)));
      return [Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y))];
    }));
    // Vet nam tren nep da ve: 95 % diem cach nep ≤ 0,03 L, toi da 0,06 L (duoi vet loi qua dau nep vai diem anh).
    for (const [ten, v, d] of [['tinh', vet.heart, tinh], ['doi', vet.life, DOI], ['tri', vet.head, tri]] as const) {
      const lech = v.map((p) => gan(p, d)).sort((a, b) => a - b);
      expect([ten, (lech[Math.floor(lech.length * 0.95)] ?? 1) < 0.03, (lech[lech.length - 1] ?? 1) < 0.06]).toEqual([ten, true, true]);
    }
  });

  test('mot nep ngang suot ban tay, khong co duong tinh, tri rieng → chi tay ngang; khong ve duong su nghiep → khong co', () => {
    const ngang = [{ x: -0.45, y: 0.72 }, { x: 0, y: 0.7 }, { x: 0.42, y: 0.66 }];
    const { khung: k } = doChiTay(anh([ngang, DOI]), MOC);
    expect([k.simian, k.duong.fate.seen]).toEqual([true, 'none']);
  });
});
