/**
 * Khoi "AI (Claude)" cuoi the "Cua toi" (dot 7 phan 1): dan khoa API (chi luu trong may, khong vao file sao luu), han muc chi
 * thang, so da tieu, xoa khoa. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { daTieuThang } from '../../loi/ai/chiPhi.ts';
import { el, homNay7, isoNgay } from '../chung.ts';
import { MO_HINH } from './goi.ts';
import { docAI, ghiAI } from './luu.ts';
import './ai.css';

const usd = (x: number): string => `${x.toFixed(2).replace('.', ',')} USD`;

export function veCaiDat(): Node[] {
  const goc = el('div', { class: 'ai-cai-dat' });
  const ve = (bao: string | null = null): void => {
    const c = docAI();
    const khoa: HTMLElement[] = [];
    if (c.khoa === null) {
      const o = el('input', { type: 'password', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', placeholder: 'sk-ant-…' });
      const luu = el('button', { type: 'button', class: 'chinh' }, 'Lưu khoá');
      luu.addEventListener('click', () => {
        const k = o.value.trim();
        if (!/^sk-ant-[\w-]{20,}$/.test(k)) { ve('Khoá phải bắt đầu bằng "sk-ant-" và dán đủ cả chuỗi.'); return; }
        ve(ghiAI({ ...docAI(), khoa: k }) ?? 'Đã lưu khoá trong máy này.');
      });
      khoa.push(el('label', { class: 'cot' }, 'Khoá API (tạo ở platform.claude.com → API keys)', o), el('div', { class: 'nut-hang' }, luu));
    } else {
      const xoa = el('button', { type: 'button', class: 'nguy' }, 'Xoá khoá');
      xoa.addEventListener('click', () => {
        if (confirm('Xoá khoá API khỏi máy này? Muốn dùng lại AI phải dán lại khoá.')) ve(ghiAI({ ...docAI(), khoa: null }) ?? 'Đã xoá khoá.');
      });
      khoa.push(el('p', {}, `Đã có khoá …${c.khoa.slice(-4)} (chỉ lưu trong máy này).`), el('div', { class: 'nut-hang' }, xoa));
    }
    const hanMuc = el('input', { type: 'number', inputmode: 'decimal', min: '0.5', step: '0.5', value: String(c.hanMuc) });
    const luuHan = el('button', { type: 'button' }, 'Lưu hạn mức');
    luuHan.addEventListener('click', () => {
      const x = Number(hanMuc.value.replace(',', '.'));
      if (!(x > 0)) { ve('Hạn mức phải là số USD lớn hơn 0.'); return; }
      ve(ghiAI({ ...docAI(), hanMuc: x }) ?? `Đã đặt hạn mức ${usd(x)}/tháng.`);
    });
    goc.replaceChildren(
      ...khoa,
      el('label', { class: 'cot' }, 'Hạn mức chi mỗi tháng (USD) — tới mức này app ngừng gọi AI', hanMuc), el('div', { class: 'nut-hang' }, luuHan),
      el('p', {}, `Tháng này đã tiêu ~${usd(daTieuThang(c.tien, isoNgay(homNay7()).slice(0, 7)))} (ước theo bảng giá; số thật xem ở Console). Mô hình: ${MO_HINH}.`),
      bao === null ? el('p', { class: 'loi' }) : el('p', { class: 'canh-bao', role: 'status' }, bao),
      el('p', { class: 'ghi-chu' }, 'Khoá chỉ nằm trong máy này, không vào file sao lưu. Nên tạo khoá riêng trong một khu (workspace) có hạn mức '
        + 'chi ở Console: lỡ lộ khoá thì mất tối đa bằng hạn mức đó.'),
      el('p', { class: 'ghi-chu' }, 'Gửi tới Anthropic: giới tính, ngày giờ sinh, tỉnh sinh và các số app đã tính — không gửi tên. '
        + 'Anthropic không dùng dữ liệu gửi qua API để huấn luyện AI.'));
  };
  ve();
  return [goc];
}
