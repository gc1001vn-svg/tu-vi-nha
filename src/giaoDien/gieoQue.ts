/**
 * The "Gieo que" (dot 4): boi Kieu; Kinh Dich them sau. So ngau nhien boc o day bang `crypto` (loi cam ngau nhien).
 * Chu Kieu tai rieng luc bam lan dau (`import()`); service worker van luu nen chay duoc khi mat mang.
 */
import type { QueKieu } from '../loi/kieu.ts';
import { el } from './chung.ts';
import { LOI_SOAN } from './khoi/namNay.ts';

const KHAN = 'Lạy vua Từ Hải, lạy vãi Giác Duyên, lạy tiên Thúy Kiều. Con tên là …, xin cho con một quẻ về việc …';

const xuongDong = (ds: readonly string[]): (string | HTMLElement)[] => ds.flatMap((c, i) => (i === 0 ? [c] : [el('br'), c]));

function veQue(q: QueKieu): HTMLElement {
  const ke = (ds: readonly string[]): HTMLElement | null => (ds.length === 0 ? null : el('p', { class: 'mau' }, ...xuongDong(ds)));
  return el('div', {},
    el('p', { class: 'ghi-chu' }, `Câu ${String(q.so)}–${String(q.so + 1)} · ${q.hoi.ten}`),
    ke(q.truoc),
    el('p', { class: 'am' }, ...xuongDong([q.luc, q.bat])),
    ke(q.sau),
    el('p', {}, `Đoạn này: ${q.hoi.tomTat}`),
    el('p', { class: 'ghi-chu' }, `Tên đoạn, tóm tắt: ${LOI_SOAN}`));
}

export function veGieoQue(): HTMLElement {
  const ketQua = el('div', { 'aria-live': 'polite' });
  const nut = el('button', { type: 'button', class: 'chinh' }, 'Mở sách');
  nut.addEventListener('click', () => {
    import('../loi/kieu.ts').then((k) => {
      const cap = (crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % k.SO_CAP;
      ketQua.replaceChildren(veQue(k.queKieu(cap)));
    }, (e: unknown) => {
      ketQua.replaceChildren(el('p', { class: 'loi' }, `Không mở được sách: ${e instanceof Error ? e.message : String(e)}`));
    });
  });
  return el('section', { class: 'the' },
    el('h2', {}, 'Bói Kiều'),
    el('p', {}, 'Nghĩ việc muốn hỏi, khấn thầm rồi bấm "Mở sách": máy mở ngẫu nhiên một cặp lục bát trong 3.254 câu Truyện Kiều.'),
    el('p', { class: 'mau' }, `Lời khấn: ${KHAN}`),
    nut,
    ketQua,
    el('p', { class: 'ghi-chu' },
      'Bói Kiều là thú chơi dân gian: tự đặt hai câu thơ vào việc mình đang hỏi mà suy ngẫm. Chữ theo bản phổ thông, đã soát với hai bản khác.'));
}
