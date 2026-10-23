/**
 * Khoi "AI (Groq)" cuoi the "Cua toi" (dot 7 phan 1): dan khoa Groq mien phi (chi luu trong may, khong vao file sao luu), xoa
 * khoa. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { el } from '../chung.ts';
import { MO_HINH } from './goi.ts';
import { docAI, ghiAI } from './luu.ts';
import './ai.css';

export function veCaiDat(): Node[] {
  const goc = el('div', { class: 'ai-cai-dat' });
  const ve = (bao: string | null = null): void => {
    const c = docAI();
    const khoa: HTMLElement[] = [];
    if (c.khoa === null) {
      const o = el('input', { type: 'password', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', placeholder: 'gsk_…' });
      const luu = el('button', { type: 'button', class: 'chinh' }, 'Lưu khoá');
      luu.addEventListener('click', () => {
        const k = o.value.trim();
        if (!/^gsk_\w{20,}$/.test(k)) { ve('Khoá Groq bắt đầu bằng "gsk_": dán đủ cả chuỗi.'); return; }
        ve(ghiAI({ khoa: k }) ?? 'Đã lưu khoá trong máy này.');
      });
      khoa.push(el('label', { class: 'cot' }, 'Khoá Groq (tạo miễn phí ở console.groq.com → API Keys)', o), el('div', { class: 'nut-hang' }, luu));
    } else {
      const xoa = el('button', { type: 'button', class: 'nguy' }, 'Xoá khoá');
      xoa.addEventListener('click', () => {
        if (confirm('Xoá khoá Groq khỏi máy này? Muốn dùng lại AI phải dán lại khoá.')) ve(ghiAI({ khoa: null }) ?? 'Đã xoá khoá.');
      });
      khoa.push(el('p', {}, `Đã có khoá …${c.khoa.slice(-4)} (chỉ lưu trong máy này).`), el('div', { class: 'nut-hang' }, xoa));
    }
    goc.replaceChildren(
      ...khoa,
      bao === null ? el('p', { class: 'loi' }) : el('p', { class: 'canh-bao', role: 'status' }, bao),
      el('p', { class: 'ghi-chu' }, `Miễn phí: tài khoản Groq không gắn thẻ thì không bao giờ mất tiền, hết lượt chỉ phải chờ. Mô hình: ${MO_HINH}.`),
      el('p', { class: 'ghi-chu' }, 'Gửi tới Groq: giới tính, ngày giờ sinh, tỉnh sinh và các số app đã tính — không gửi tên. Nên bật '
        + 'Zero Data Retention ở console.groq.com (Data Controls) để Groq không lưu lại. Khoá chỉ nằm trong máy này, không vào file sao lưu.'));
  };
  ve();
  return [goc];
}
