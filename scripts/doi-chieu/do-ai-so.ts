// Đo so bản mã khác với mô hình Groq hôm nay (kế hoạch 2026-11-03-xu-ly-ton): một câu hỏi thêm lặp N lần sau lời tổng hợp của một hồ sơ
// giả, chạy bằng mã ở <thư_mục_mã> (vd bản 23/10: `git worktree add <thư_mục> ea3f70a`, rồi `ln -s <repo>/node_modules <thư_mục>/`).
// Bản cũ trượt câu mà ngày đó qua → mô hình đổi; bản cũ vẫn qua → do dữ liệu mình đổi. Khoá: GROQ_API_KEY (không in, không ghi file);
// Groq báo hết hạn mức ngày thì dừng ngay. Hồ sơ giả và ngày xem như `do-ai.ts`.
//   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-ai-so.ts <thư_mục_mã> <thư_mục_tạm> [số_lần=3]
//     [chỉ_số_hồ_sơ=4] [câu="Màu nào hợp mệnh tôi để sơn nhà?"]
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BAY_MAU_CU, coNoiChuaCo } from './cau-do-ai.ts';

type Goi = typeof import('../../src/giaoDien/ai/goi.ts');
type DuLieu = typeof import('../../src/loi/ai/duLieu.ts');
type KiemBia = typeof import('../../src/loi/ai/kiemBia.ts');
type LoiDan = typeof import('../../src/loi/ai/loiDan.ts');
type HoSoMod = typeof import('../../src/loi/hoSo.ts');
type Tinh = typeof import('../../src/loi/tinh.ts');

const khoa = process.env['GROQ_API_KEY'];
const [goc = '', ra = '', soLan = '3', chiSo = '4', cau = BAY_MAU_CU] = process.argv.slice(2);
if (khoa === undefined || khoa === '' || goc === '' || ra === '') {
  console.error('Cần GROQ_API_KEY, <thư_mục_mã>, <thư_mục_tạm>.');
  process.exit(1);
}
mkdirSync(ra, { recursive: true });
const nap = async <T>(duong: string): Promise<T> => (await import(pathToFileURL(resolve(goc, duong)).href)) as T;
const g = await nap<Goi>('src/giaoDien/ai/goi.ts');
const { duLieuNguoi } = await nap<DuLieu>('src/loi/ai/duLieu.ts');
const { TU_NGUOI, timBia } = await nap<KiemBia>('src/loi/ai/kiemBia.ts');
const { YEU_CAU } = await nap<LoiDan>('src/loi/ai/loiDan.ts');
const { tinhHoSo } = await nap<HoSoMod>('src/loi/hoSo.ts');
const { TINH } = await nap<Tinh>('src/loi/tinh.ts');

// Ho so gia: cung hat, cung thu tu voi `do-ai.ts`.
let s = 20261023 >>> 0;
const r = (): number => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32; };
const hai = (n: number): string => String(n).padStart(2, '0');
const HO_SO = Array.from({ length: Number(chiSo) + 1 }, (_, i) => ({
  id: `gia${String(i)}`, ten: 'Người Giả', gioiTinh: i % 2 === 0 ? 'nam' as const : 'nu' as const,
  ngaySinh: `${String(1950 + Math.floor(r() * 65))}-${hai(1 + Math.floor(r() * 12))}-${hai(1 + Math.floor(r() * 28))}`,
  gioSinh: i % 5 === 4 ? null : `${hai(Math.floor(r() * 24))}:${hai(Math.floor(r() * 60))}`,
  noiSinh: TINH[Math.floor(r() * TINH.length)]?.[0] ?? 'Hà Nội',
}));
const h = HO_SO[Number(chiSo)];
if (h === undefined) throw new Error('Không có hồ sơ');
const duLieu = duLieuNguoi(h, tinhHoSo(h), { nam: 2026, thang: 10, ngay: 23 }, undefined);
const ngu = (giay: number): Promise<void> => new Promise((x) => setTimeout(x, giay * 1000));

interface Lan { readonly hoi: string; readonly chu: string; readonly bia: readonly string[]; readonly dat: boolean; readonly dauVet?: string }
const lan: Lan[] = [];
let dungLai: string | null = null;
async function hoi(tin: readonly { role: 'user' | 'assistant'; content: string }[]): Promise<{ chu: string; dauVet?: string } | null> {
  for (let thu = 1; thu <= 4 && dungLai === null; thu++) {
    try {
      return await g.goiAI(khoa ?? '', duLieu, tin, () => undefined, new AbortController().signal);
    } catch (e) {
      if (!(e instanceof g.LoiGroq) || e.ma !== 429) { console.error(g.loiTiengViet(e)); return null; }
      if (/per day|TPD|RPD/iu.test(e.message) || (e.choGiay ?? 0) > 300) { dungLai = `hết hạn mức ngày: ${e.message.replace(/org_[A-Za-z0-9]+/gu, 'org_…').slice(0, 200)}`; return null; }
      await ngu((e.choGiay ?? 30) + 1);
    }
  }
  return null;
}
const dau = await hoi([{ role: 'user', content: YEU_CAU.nguoi() }]);
if (dau !== null) {
  for (let i = 0; i < Number(soLan) && dungLai === null; i++) {
    const kq = await hoi([{ role: 'user', content: YEU_CAU.nguoi() }, { role: 'assistant', content: dau.chu }, { role: 'user', content: cau }]);
    if (kq === null) continue;
    const bia = [...new Set(timBia(kq.chu, duLieu, TU_NGUOI).map((b) => b.tu))];
    lan.push({ hoi: cau, chu: kq.chu, bia, dat: coNoiChuaCo(kq.chu) && bia.length === 0, ...(kq.dauVet === undefined ? {} : { dauVet: kq.dauVet }) });
    console.log(`${lan.at(-1)?.dat === true ? 'qua' : 'TRƯỢT'}: ${kq.chu.replace(/\s+/gu, ' ').slice(0, 220)}`);
  }
}
writeFileSync(`${ra}/do-ai-so.json`, JSON.stringify({ luc: new Date().toISOString(), goc, hoSo: h, cau, lan, dungLai }, null, 1));
console.log(`Bản ở ${goc}, hồ sơ ${h.id}, câu "${cau}": qua ${String(lan.filter((x) => x.dat).length)}/${String(lan.length)}`
  + `${dungLai === null ? '' : ` · DỪNG: ${dungLai}`}`);
