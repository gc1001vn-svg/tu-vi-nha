/**
 * May tu do chi tay (dot 7 phan 3), khong trinh duyet: anh khung chuan TONG HOP — nen xam co nhieu (hat co dinh) + nep toi ve theo
 * duong biet truoc — phai ra dung o: duong doi dai, vong rong; duong tri cong, dinh duong doi; duong tinh dai; su nghiep tu co tay;
 * mot nep ngang suot ban tay thi la chi tay ngang. Them 06/11 (ke hoach `docs/ke-hoach/2026-11-06-may-do-chi-tay.md`) ba ca lap lai loi
 * thay tren anh that — ma cu truot ca ba: tinh mo + tri dam sat phia ngon tro + nep gap khe ngon cai rat dam; ranh dai / vua → o trong
 * (vet khong vuot dau nep); vet tri gay khuc, khong co duong tinh → chi tay ngang de trong. Them mot ca giu (ma cu cung qua): nep nhan
 * cat ngang duong doi. Them 08/11 (ke hoach `2026-11-06-duoi-duong-tri.md`) hai ca duoi duong tri — ma 06/11 truot ca hai: vet tri vong
 * qua nep nhanh sang dau duong tinh → dung o cho thap nhat; duong tri cong len that, duong tinh rieng → giu duoi, o dai de trong.
 * Anh that do o `scripts/doi-chieu/do-chi-tay-dap-an.mjs`.
 */
import { CAO, KHUNG_ANH, RONG, doChiTay, type Diem, type MocTay } from '../src/loi/chiTayDo.ts';

const MOC: MocTay = { co: { x: 0, y: 0 }, caiGoc: { x: 0.28, y: 0.18 }, caiKhop: { x: 0.5, y: 0.4 }, tro: { x: 0.3, y: 0.95 },
  giua: { x: 0, y: 1 }, apUt: { x: -0.2, y: 0.95 }, ut: { x: -0.38, y: 0.85 } };

/** Anh nen 0,6 + nhieu ±0,03 (LCG hat co dinh), ve cac nep toi sau 0,25 (hoac `sau[k]`), be ngang ~1,5 diem anh. */
function anh(nep: readonly (readonly Diem[])[], sau: readonly number[] = []): Float32Array {
  let hat = 20261101;
  const a = Float32Array.from({ length: RONG * CAO }, () => { hat = (hat * 1103515245 + 12345) % 2 ** 31; return 0.6 + (hat / 2 ** 31 - 0.5) * 0.06; });
  for (const [m, d] of nep.entries()) {
    const toi = sau[m] ?? 0.25;
    for (let k = 0; k < d.length - 1; k++) {
      const p = d[k], q = d[k + 1];
      if (p === undefined || q === undefined) continue;
      const n = Math.ceil(Math.hypot(q.x - p.x, q.y - p.y) * KHUNG_ANH.px * 2);
      for (let t = 0; t <= n; t++) {
        const ci = (p.x + ((q.x - p.x) * t) / n - KHUNG_ANH.x0) * KHUNG_ANH.px, cj = (KHUNG_ANH.y1 - (p.y + ((q.y - p.y) * t) / n)) * KHUNG_ANH.px;
        for (let j = Math.floor(cj - 4); j <= cj + 4; j++) for (let i = Math.floor(ci - 4); i <= ci + 4; i++) {
          if (i < 0 || j < 0 || i >= RONG || j >= CAO) continue;
          const v = 0.6 - toi * Math.exp(-((i + 0.5 - ci) ** 2 + (j + 0.5 - cj) ** 2) / (2 * 1.5 ** 2));
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

/** Khoang cach diem → duong gay khuc. */
const gan = (p: Diem, d: readonly Diem[]): number => Math.min(...d.flatMap((a, i) => {
  const b = d[i + 1];
  if (b === undefined) return [];
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / ((b.x - a.x) ** 2 + (b.y - a.y) ** 2)));
  return [Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y))];
}));
/** Vet nam tren nep da ve: 95 % diem cach nep ≤ 0,03 L, toi da 0,06 L (duoi vet loi qua dau nep vai diem anh); vet rong la truot. */
const bam = (ten: string, v: readonly Diem[], d: readonly Diem[]): [string, boolean, boolean] => {
  const lech = v.map((p) => gan(p, d)).sort((a, b) => a - b);
  return [ten, v.length > 0 && (lech[Math.floor(lech.length * 0.95)] ?? 1) < 0.03, v.length > 0 && (lech[lech.length - 1] ?? 1) < 0.06];
};
const TINH = [{ x: -0.45, y: 0.8 }, { x: -0.1, y: 0.84 }, { x: 0.15, y: 0.9 }, { x: 0.28, y: 0.93 }];
const TRI = [{ x: 0.34, y: 0.68 }, { x: 0.05, y: 0.6 }, { x: -0.2, y: 0.52 }, { x: -0.4, y: 0.44 }];

describe('may tu do chi tay tren anh tong hop', () => {
  test('bon duong: doi dai, vong rong; tri cong, dinh duong doi; tinh dai; su nghiep tu co tay', () => {
    const tinh = TINH, tri = TRI;
    const su = [{ x: -0.13, y: 0.08 }, { x: -0.11, y: 0.45 }, { x: -0.09, y: 0.82 }];
    const { khung: k, vet } = doChiTay(anh([tinh, tri, DOI, su]), MOC);
    expect(k.simian).toBe(false);
    expect([k.duong.life.length, k.duong.life.arc, k.duong.head.shape, k.duong.head.joined, k.duong.heart.length, k.duong.fate.start])
      .toEqual(['long', 'wide', 'curved', true, 'long', 'wrist']);
    for (const d of ['life', 'head', 'heart', 'fate'] as const) expect(k.duong[d].seen).not.toBe('none');
    for (const [ten, v, d] of [['tinh', vet.heart, tinh], ['doi', vet.life, DOI], ['tri', vet.head, tri]] as const) expect(bam(ten, v, d)).toEqual([ten, true, true]);
  });

  test('mot nep ngang suot ban tay, khong co duong tinh, tri rieng → chi tay ngang; khong ve duong su nghiep → khong co', () => {
    const ngang = [{ x: -0.45, y: 0.72 }, { x: 0, y: 0.7 }, { x: 0.42, y: 0.66 }];
    const { khung: k } = doChiTay(anh([ngang, DOI]), MOC);
    expect([k.simian, k.duong.fate.seen]).toEqual([true, 'none']);
  });

  test('tinh mo, tri dam vong sat len phia ngon tro, nep gap khe ngon cai rat dam → tinh van o tren, tri van bam nep tri', () => {
    // Loi anh "Right Hand Palm" (ma cu 05/11): duong tinh truot sang duong tri, duong tri bam nep gap khe ngon cai.
    const tri = [{ x: 0.34, y: 0.74 }, { x: 0.1, y: 0.7 }, { x: -0.2, y: 0.56 }, { x: -0.4, y: 0.47 }];
    const gap = [{ x: 0.52, y: 0.62 }, { x: 0.3, y: 0.57 }];
    const { khung: k, vet } = doChiTay(anh([TINH, tri, DOI, gap], [0.15, 0.3, 0.25, 0.5]), MOC);
    expect([bam('tinh', vet.heart, TINH), bam('tri', vet.head, tri), bam('doi', vet.life, DOI)])
      .toEqual([['tinh', true, true], ['tri', true, true], ['doi', true, true]]);
    expect([k.simian, k.duong.heart.length]).toEqual([false, 'long']);
  });

  test('nep nhan go ngon cai cat ngang duong doi → duong doi van vong theo cung, khong re theo nep nhan', () => {
    const nhan = Array.from({ length: 12 }, (_, k) => {
      const g = ((110 + k * 9) * Math.PI) / 180;
      return [0.27, 0.5].map((r) => ({ x: TAM_DOI.x + r * Math.cos(g), y: TAM_DOI.y + r * Math.sin(g) }));
    });
    const { khung: k, vet } = doChiTay(anh([TINH, TRI, DOI, ...nhan]), MOC);
    expect(bam('doi', vet.life, DOI)).toEqual(['doi', true, true]);
    expect([k.duong.life.length, k.duong.life.arc]).toEqual(['long', 'wide']);
  });

  test('duong doi tan sat ranh dai / vua, duong tinh tan sat ranh dai / vua → hai o do de trong, o khac van dien', () => {
    // Doi tan o y = 0,15 L (ranh dai / vua); tinh tan o 3/4 khoang goc ngon giua → goc ngon tro (ranh dai / vua).
    const doi = cung(TAM_DOI, 100, 201.6, 0.4, 0.38), tinh = [...TINH.slice(0, 3), { x: 0.225, y: 0.915 }];
    const { khung: k } = doChiTay(anh([tinh, TRI, doi]), MOC);
    expect([k.duong.life.length, k.duong.heart.length]).toEqual([null, null]);
    expect([k.duong.life.seen, k.duong.head.seen, k.duong.heart.seen, k.duong.life.arc]).not.toContain(null);
  });

  test('khong co duong tinh, vet tri gay khuc (nua phia ngon cai nam ngang, nua phia ngon ut do xuong) → chi tay ngang de trong', () => {
    // Anh "Hand female 2/3" (06/11): ma cu bao chi tay ngang; chi tay ngang that la mot nep gan thang (ca tren).
    const gay = [{ x: 0.36, y: 0.8 }, { x: 0, y: 0.84 }, { x: -0.45, y: 0.64 }];
    const { khung: k } = doChiTay(anh([gay, DOI]), MOC);
    expect(k.simian).toBeNull();
  });

  test('duong tri doc xuong roi het, nep nhanh noi len dau duong tinh phia ngon ut → vet tri dung, khong vong sang duong tinh', () => {
    // Loi anh "Right Hand Palm" (08/11): vet tri xuong thap nhat roi vong nguoc len (qua nep nhanh), chay theo dau duong tinh toi mep tay.
    const tinh = [{ x: -0.48, y: 0.7 }, { x: -0.3, y: 0.745 }, { x: -0.1, y: 0.82 }, { x: 0.15, y: 0.9 }, { x: 0.28, y: 0.93 }];
    const tri = [{ x: 0.34, y: 0.74 }, { x: 0.05, y: 0.66 }, { x: -0.2, y: 0.58 }, { x: -0.26, y: 0.52 }];
    const nhanh = [{ x: -0.2, y: 0.58 }, { x: -0.3, y: 0.745 }];
    const { khung: k, vet } = doChiTay(anh([tinh, tri, DOI, nhanh]), MOC);
    expect([bam('tri', vet.head, tri), bam('tinh', vet.heart, tinh)]).toEqual([['tri', true, true], ['tinh', true, true]]);
    expect([k.simian, k.duong.head.length]).toEqual([false, 'medium']);
  });

  test('duong tri cong len o cuoi, duong tinh rieng o tren → giu duoi cong, o dai duong tri de trong', () => {
    const tri = [{ x: 0.34, y: 0.7 }, { x: 0.05, y: 0.6 }, { x: -0.18, y: 0.5 }, { x: -0.38, y: 0.62 }];
    const { khung: k, vet } = doChiTay(anh([TINH, tri, DOI]), MOC);
    expect([bam('tri', vet.head, tri), bam('tinh', vet.heart, TINH)]).toEqual([['tri', true, true], ['tinh', true, true]]);
    expect(k.duong.head.length).toBeNull();
  });
});
