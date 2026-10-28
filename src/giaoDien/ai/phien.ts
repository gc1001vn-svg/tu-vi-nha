/**
 * Phien AI mot chu de (dot 7 phan 1): nut mo dau (tong hop, giai que, doc bai) → chu chay dan → o hoi dap. Hoi thoai chi song
 * trong bo nho khi app dang mo (khong ghi may — ke hoach), dong mo lai khoi van con. Ten rieng AI neu ma du lieu khong co thi
 * gach chan (`kiemBia.ts`). AI mien phi qua Groq (`goi.ts`).
 */
import { duLieuChiTay, duLieuNguoi, duLieuQue, duLieuTarot } from '../../loi/ai/duLieu.ts';
import { TU_NGUOI, timBia } from '../../loi/ai/kiemBia.ts';
import { YEU_CAU } from '../../loi/ai/loiDan.ts';
import { TU_CHI_TAY } from '../../loi/chiTay.ts';
import { el } from '../chung.ts';
import { goiAI, loiTiengViet, type TinNhan } from './goi.ts';
import type { ChuDe } from './index.ts';
import { docAI } from './luu.ts';
import './ai.css';

interface Luot {
  /** Cau gui di (luot dau: yeu cau mo dau); `hoi`: cau hien len (null o luot dau). */
  readonly gui: string;
  readonly hoi: string | null;
  dap: string;
  bia: readonly string[];
  ghiChu: string | null;
  xong: boolean;
}

interface Phien {
  readonly cd: ChuDe;
  /** Lay lai moi lan goi khi chua co cau tra loi nao: so do mat do sau khi mo khoi AI van kip vao. */
  duLieu: string;
  readonly tuDien: readonly string[];
  readonly luot: Luot[];
  dung: AbortController | null;
  /** Ham ve lai cua cac khung dang hien phien nay (khung bi go khoi trang thi tu bo ra). */
  readonly nghe: Set<() => void>;
}

const PHIEN = new Map<string, Phien>();

const lamMoi = (p: Phien): void => { for (const f of p.nghe) f(); };

const duLieuCua = (cd: ChuDe): string => (cd.loai === 'nguoi' ? duLieuNguoi(cd.hs, cd.tr, cd.ngayXem, cd.lechNuoc, cd.mat())
  : cd.loai === 'que' ? duLieuQue(cd.k, cd.g, cd.mh) : cd.loai === 'tarot' ? duLieuTarot(cd.t, cd.kieu, cd.rut) : duLieuChiTay(cd.k, cd.gioiTinh));

function taoPhien(cd: ChuDe): Phien {
  const tuDien = cd.loai === 'nguoi' ? TU_NGUOI : cd.loai === 'que' ? [...TU_NGUOI, ...cd.k.QUE.map((q) => q.tenDu)]
    : cd.loai === 'tarot' ? cd.t.LA.flatMap((l) => [l.anh, l.ten, ...(l.khac === null ? [] : [l.khac])]) : [...TU_NGUOI, ...TU_CHI_TAY];
  return { cd, duLieu: '', tuDien, luot: [], dung: null, nghe: new Set() };
}

async function goi(p: Phien, gui: string, hoi: string | null): Promise<void> {
  const { khoa } = docAI();
  const l: Luot = { gui, hoi, dap: '', bia: [], ghiChu: null, xong: false };
  p.luot.push(l);
  if (khoa === null) {
    l.ghiChu = 'Chưa có khoá Groq: dán khoá (miễn phí) ở khối "AI (Groq)" cuối thẻ "Của tôi".';
    l.xong = true;
    lamMoi(p);
    return;
  }
  // Luot truoc loi (khong co chu) khong gui lai: API doi luot nguoi – AI xen ke.
  const tin: TinNhan[] = p.luot.filter((x) => x !== l && x.dap !== '')
    .flatMap((x) => [{ role: 'user' as const, content: x.gui }, { role: 'assistant' as const, content: x.dap }]);
  tin.push({ role: 'user', content: gui });
  p.dung = new AbortController();
  let cho = 0;
  lamMoi(p);
  try {
    if (!p.luot.some((x) => x.dap !== '')) p.duLieu = duLieuCua(p.cd);
    const kq = await goiAI(khoa, p.duLieu, tin, (them) => {
      l.dap += them;
      // Ve lai toi da moi khung hinh mot lan, chu chay nhanh van muot.
      if (cho === 0) cho = requestAnimationFrame(() => { cho = 0; lamMoi(p); });
    }, p.dung.signal);
    l.dap = kq.chu;
    l.bia = [...new Set(timBia(kq.chu, p.duLieu, p.tuDien).map((b) => b.tu))];
    l.ghiChu = (kq.ket === 'tuChoi' ? 'Groq chặn câu trả lời này. ' : kq.ket === 'quaDai' ? 'Câu trả lời quá dài nên bị cắt. ' : '')
      + `Mô hình ${kq.moHinh} qua Groq, miễn phí.`;
  } catch (e) {
    l.ghiChu = loiTiengViet(e);
  } finally {
    cancelAnimationFrame(cho);
    p.dung = null;
    l.xong = true;
    lamMoi(p);
  }
}

/** Mot dong chu AI: **dam** thanh <b>, ten bia thanh <mark>. Chu AI luon vao text node, khong innerHTML. */
function dong(s: string, bia: readonly string[]): (string | HTMLElement)[] {
  const re = bia.length === 0 ? null : new RegExp(`(${bia.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'u');
  const danh = (x: string): (string | HTMLElement)[] => (re === null ? [x]
    : x.split(re).map((y, i) => (i % 2 === 1 ? el('mark', { class: 'bia', title: 'Không có trong dữ liệu app tính' }, y) : y)));
  return s.split(/\*\*(.+?)\*\*/).flatMap((y, i) => (i % 2 === 1 ? [el('b', {}, ...danh(y))] : danh(y))).filter((y) => y !== '');
}

/** Chu AI (dang "## muc", "- y") → the: tieu de h3, danh sach ul, con lai p. */
function veChu(chu: string, bia: readonly string[]): HTMLElement[] {
  const ra: HTMLElement[] = [];
  let ds: HTMLElement | null = null;
  for (const tho of chu.split('\n')) {
    const d = tho.trim();
    if (d === '') { ds = null; continue; }
    if (d.startsWith('#')) { ds = null; ra.push(el('h3', {}, ...dong(d.replace(/^#+\s*/, ''), bia))); continue; }
    if (/^[-*•]\s/.test(d)) {
      if (ds === null) { ds = el('ul'); ra.push(ds); }
      ds.append(el('li', {}, ...dong(d.slice(2), bia)));
      continue;
    }
    ds = null;
    ra.push(el('p', {}, ...dong(d, bia)));
  }
  return ra;
}

const NUT_DAU = { nguoi: 'AI viết lời tổng hợp', que: 'AI giải quẻ', tarot: 'AI đọc trải bài', chiTay: 'AI diễn giải và dự đoán' } as const;

export function vePhien(ma: string, cd: ChuDe): Node[] {
  const p = PHIEN.get(ma) ?? taoPhien(cd);
  PHIEN.set(ma, p);
  const goc = el('div', { class: 'ai-phien', 'aria-live': 'polite' });
  const ve = (): void => {
    if (!goc.isConnected && goc.childElementCount > 0) { p.nghe.delete(ve); return; }
    const dangChay = p.dung !== null;
    const con: HTMLElement[] = [];
    for (const l of p.luot) {
      if (l.hoi !== null) con.push(el('p', { class: 'ai-hoi' }, `Hỏi: ${l.hoi}`));
      con.push(el('div', { class: 'ai-dap' }, ...veChu(l.dap, l.bia)));
      if (l.bia.length > 0) con.push(el('p', { class: 'canh-bao' }, `Gạch chân: tên AI nêu mà dữ liệu app tính không có (${l.bia.join(', ')}) — đừng tin chỗ đó.`));
      if (l.ghiChu !== null) con.push(el('p', { class: l.dap === '' && l.xong ? 'loi' : 'ghi-chu' }, l.ghiChu));
    }
    if (dangChay) {
      const dung = el('button', { type: 'button' }, 'Dừng');
      dung.addEventListener('click', () => { p.dung?.abort(); });
      con.push(el('div', { class: 'nut-hang' }, dung));
    } else if (!p.luot.some((l) => l.dap !== '')) {
      // Chua co cau tra loi nao: nut mo dau (que, tarot kem o "viec muon hoi").
      const o = cd.loai === 'nguoi' ? null : el('input', { type: 'text', maxlength: '200', placeholder: 'Việc muốn hỏi (không bắt buộc)' });
      const nut = el('button', { type: 'button', class: 'chinh' }, NUT_DAU[cd.loai]);
      nut.addEventListener('click', () => {
        const cau = o?.value ?? '';
        void goi(p, cd.loai === 'nguoi' ? YEU_CAU.nguoi() : YEU_CAU[cd.loai](cau), null);
      });
      if (o !== null) con.push(el('label', { class: 'cot' }, 'Việc muốn hỏi', o));
      con.push(el('div', { class: 'nut-hang' }, nut));
    } else {
      const o = el('input', { type: 'text', maxlength: '500', placeholder: 'Hỏi thêm AI về phần trên…', enterkeyhint: 'send' });
      const nut = el('button', { type: 'button', class: 'chinh' }, 'Hỏi');
      const hoi = (): void => { const c = o.value.trim(); if (c !== '') void goi(p, c, c); };
      nut.addEventListener('click', hoi);
      o.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.isComposing) hoi(); });
      con.push(el('div', { class: 'ai-o-hoi' }, o, nut));
    }
    con.push(el('p', { class: 'ghi-chu' }, 'AI chỉ đọc số app đã tính, không gửi tên; hỏi đáp không lưu, đóng app là mất. '
      + 'Lời AI là quan niệm dân gian, để tham khảo; AI có thể chép nhầm chỗ (sao, cung), đối chiếu với số app bên trên.'));
    goc.replaceChildren(...con);
  };
  p.nghe.add(ve);
  ve();
  return [goc];
}
