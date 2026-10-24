/**
 * Noi dung khoi "Tuong mat" (nap luoi tu `tuongMat.ts`): nut chon/chup anh, trang thai, bang so do, loi giai. Anh khong luu, khong
 * gui di — doc vao bo nho, do xong bo. Loi do `src/loi/tuongMat.ts`, loi giai `src/loi/tuongMatGiai.ts`; MediaPipe nap khi bam
 * (`tuongMatMp.ts`).
 */
import { CAC_KHOA, GIAI, NGUONG_CUOI, SO_ANH_MAU, mucMat } from '../../loi/tuongMatGiai.ts';
import { el } from '../chung.ts';
import { MAT_DA_DO } from './tuongMat.ts';
import type { KetQuaMat } from './tuongMatMp.ts';
import './tuongMat.css';

const so = (x: number, le = 2): string => x.toFixed(le).replace('.', ',');

function veKetQua(k: KetQuaMat): Node[] {
  return [
    el('table', {}, el('tbody', {}, ...CAC_KHOA.map((khoa) => el('tr', {},
      el('th', { scope: 'row' }, GIAI[khoa].ten, el('small', {}, GIAI[khoa].y)), el('td', {}, so(k.so[khoa])))))),
    el('p', { class: 'ghi-chu' }, `Sai số ước ±${so(k.lech, 1)} % (trung bình 10 lần đo: 5 cỡ khung, ảnh và ảnh lật gương). `
      + `Đầu quay ngang ${so(k.goc.quay, 0)}°, ngẩng/cúi ${so(k.goc.ngua, 0)}°. Tải thư viện ${so(k.taiMs / 1000, 1)} giây, `
      + `đo ${so(k.doMs / 1000, 1)} giây.`),
    ...(k.cuoi >= NGUONG_CUOI
      ? [el('p', { class: 'canh-bao' }, `Ảnh có vẻ đang cười (điểm cười ${so(k.cuoi)}): cười làm miệng rộng ra, mắt híp lại nên số `
        + 'lệch — app không giải. Chụp lại mặt tự nhiên, ngậm miệng.')]
      : [el('h3', {}, 'Lời giải (Claude soạn lại theo sách tướng, tham khảo)'),
        el('p', { class: 'ghi-chu' }, `"Phần đông" là so với ${String(SO_ANH_MAU)} ảnh chân dung mặt tự nhiên đo bằng cùng máy, không `
          + 'so thẳng với số trong sách: lưới máy lệch vài chỗ (khoé mắt, lông mày). Số sát ngưỡng thì đọc cả hai bên.'),
        el('ul', {}, ...CAC_KHOA.map((khoa) => el('li', {}, el('b', {}, `${GIAI[khoa].ten} ${so(k.so[khoa])}: `),
          GIAI[khoa].loi[mucMat(khoa, k.so[khoa])], el('small', {}, ` Nguồn: ${GIAI[khoa].nguon}.`))))]),
    el('p', { class: 'ghi-chu' }, 'Nhân tướng là quan niệm dân gian, không có cơ sở khoa học — đọc cho vui, đừng dựa vào để đánh '
      + 'giá người. Số đo này (không có ảnh) được gửi kèm cho "AI tổng hợp mọi môn" nếu đo xong trước khi AI trả lời lần đầu.'),
  ];
}

export function veTuongMat(khoa: string): Node[] {
  const chon = el('input', { type: 'file', accept: 'image/*', hidden: '' });
  const nut = el('button', { type: 'button', class: 'chinh' }, 'Chọn hoặc chụp ảnh');
  const ket = el('div', { 'aria-live': 'polite' });
  const bao = (lop: string, chu: string): void => { ket.replaceChildren(el('p', { class: lop }, chu)); };
  nut.addEventListener('click', () => { chon.click(); });
  chon.addEventListener('change', () => {
    const f = chon.files?.[0];
    chon.value = ''; // chon lai dung anh cu (iPhone hay dat trung ten) van do
    if (f === undefined) return;
    nut.disabled = true;
    bao('ghi-chu', 'Đang tải thư viện đo mặt (lần đầu khoảng 17 MB)…');
    import('./tuongMatMp.ts')
      .then((m) => m.doAnh(f, () => { bao('ghi-chu', 'Đang đo…'); }))
      .then((k) => { MAT_DA_DO.set(khoa, k); ket.replaceChildren(...veKetQua(k)); },
        (e: unknown) => { bao('loi', e instanceof Error ? e.message : String(e)); })
      .finally(() => { nut.disabled = false; });
  });
  return [
    el('p', { class: 'ghi-chu' }, 'Nhìn thẳng vào máy, mặt tự nhiên (không cười), đủ sáng, bỏ kính, tóc không che lông mày. '
      + 'Ảnh chỉ đo ngay trong máy: không gửi đi, không lưu. Lần đầu cần mạng để tải thư viện đo mặt (khoảng 17 MB), '
      + 'sau đó dùng không cần mạng.'),
    el('div', { class: 'nut-hang' }, nut), chon, ket,
  ];
}
