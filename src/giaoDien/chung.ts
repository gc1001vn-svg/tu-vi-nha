/**
 * Do nghe chung cua giao dien: tao the DOM, ngay "hom nay" theo gio VN, phut lech mui gio nuoc ngoai (Intl — loi cam locale).
 */
import { dinhDangAm, type NgayDuong } from '../loi/amLich.ts';
import { tinhHoSo, type HoSo, type KetQuaHoSo, type TinhRa } from '../loi/hoSo.ts';
import { NUOC_NGOAI } from '../loi/tinh.ts';

type Con = Node | string | null | false;

/** Khuon chung moi khoi thong tin mot nguoi (bat tu, nam nay, tu vi…): ho so, ket qua tinh san, ngay xem. */
export type VeKhoi = (hs: HoSo, tr: TinhRa, ngayXem: NgayDuong) => HTMLElement;

/** Tao the. Chu nguoi dung luon vao bang text node (khong innerHTML). */
export function el<K extends keyof HTMLElementTagNameMap>(
  ten: K, thuoc: Readonly<Record<string, string>> = {}, ...con: Con[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(ten);
  for (const [k, v] of Object.entries(thuoc)) e.setAttribute(k, v);
  for (const c of con) if (c !== null && c !== false) e.append(c);
  return e;
}

/** Khoi gap/mo: the `<details>` san cua trinh duyet — khong can JS, may doc man hinh doc duoc. */
export function khoi(tieuDe: string, moSan: boolean, ...con: Con[]): HTMLElement {
  return el('details', { class: 'khoi', ...(moSan ? { open: '' } : {}) }, el('summary', {}, tieuDe), ...con);
}

/** "Hom nay" luon theo gio Viet Nam (+7), du may dang dat mui khac. */
export function homNay7(): NgayDuong {
  const d = new Date(Date.now() + 7 * 3_600_000);
  return { nam: d.getUTCFullYear(), thang: d.getUTCMonth() + 1, ngay: d.getUTCDate() };
}

export const isoNgay = (d: NgayDuong): string =>
  `${String(d.nam)}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;

function lechTai(muiGio: string, ms: number): number {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: muiGio, timeZoneName: 'longOffset' })
    .formatToParts(ms).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?/.exec(s);
  if (m === null) return 0; // "GMT" tron = UTC
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]) + Number(m[4] ?? 0) / 60);
}

/** Phut lech UTC luc sinh theo gio dong ho dia phuong; lap hai lan vi phai biet lech moi doi duoc gio dia phuong ra UTC. */
export function lechNuocNgoai(hs: HoSo): number | undefined {
  if (hs.noiSinh !== NUOC_NGOAI || hs.muiGio === undefined) return undefined;
  const [nam, thang, ngay] = hs.ngaySinh.split('-').map(Number);
  const [gio, phut] = (hs.gioSinh ?? '12:00').split(':').map(Number);
  const dongHo = Date.UTC(nam ?? 0, (thang ?? 1) - 1, ngay ?? 1, gio ?? 0, phut ?? 0);
  let lech = 0;
  for (let i = 0; i < 2; i++) lech = lechTai(hs.muiGio, dongHo - lech * 60_000);
  return lech;
}

export const tinh = (hs: HoSo): TinhRa => tinhHoSo(hs, lechNuocNgoai(hs));

const GIA_TRI: Readonly<Record<string, (k: KetQuaHoSo) => string>> = {
  'ngày âm': (k) => dinhDangAm(k.am), 'năm': (k) => k.canChiNam, 'tháng': (k) => k.canChiThang,
  'ngày': (k) => k.canChiNgay, 'giờ': (k) => k.chiGio ?? '?', 'mệnh': (k) => k.napAm, 'cung phi': (k) => k.cungPhi,
};

/** "ngày âm 6/9/2026, ngày Nhâm Tuất" — gia tri cua cac truong khac ban chinh. */
export const moTaKhac = (truong: readonly string[], k: KetQuaHoSo): string =>
  truong.map((t) => `${t} ${GIA_TRI[t]?.(k) ?? ''}`.trim()).join(', ');
