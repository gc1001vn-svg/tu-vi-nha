/**
 * Noi dung khoi "Tuong mat" (nap luoi tu `tuongMat.ts`): nut chon/chup anh, trang thai, bang so do, loi giai. Anh khong luu, khong
 * gui di — doc vao bo nho, do xong bo. Loi do `src/loi/tuongMat.ts`, loi giai `src/loi/tuongMatGiai.ts`; MediaPipe nap khi bam
 * (`tuongMatMp.ts`).
 */
import { CAC_KHOA, GIAI, SO_ANH_MAU, giaiMat, mucMat } from '../../loi/tuongMatGiai.ts';
import { el } from '../chung.ts';
import { MAT_DA_DO } from './tuongMat.ts';
import type { KetQuaMat } from './tuongMatMp.ts';
import './tuongMat.css';

const so = (x: number, le = 2): string => x.toFixed(le).replace('.', ',');

function veKetQua(k: KetQuaMat): Node[] {
  const g = giaiMat(k), co = CAC_KHOA.filter((khoa) => g.loi[khoa] !== null);
  return [
    el('table', {}, el('tbody', {}, ...CAC_KHOA.map((khoa) => el('tr', {},
      el('th', { scope: 'row' }, GIAI[khoa].ten, el('small', {}, GIAI[khoa].y)), el('td', {}, so(k.so[khoa])))))),
    el('p', { class: 'ghi-chu' }, `Sai số ước ±${so(k.lech, 1)} % (trung bình 10 lần đo: 5 cỡ khung, ảnh và ảnh lật gương). `
      + `Đầu quay ngang ${so(k.goc.quay, 0)}°, ngẩng/cúi ${so(k.goc.ngua, 0)}°. Tải thư viện ${so(k.taiMs / 1000, 1)} giây, `
      + `đo ${so(k.doMs / 1000, 1)} giây.`),
    ...g.canhBao.map((c) => el('p', { class: 'canh-bao' }, c)),
    ...(co.length === 0 ? []
      : [el('h3', {}, 'Lời giải (Claude soạn lại theo sách tướng, tham khảo)'),
        el('p', { class: 'ghi-chu' }, `"Phần đông" là so với ${String(SO_ANH_MAU)} ảnh chân dung mặt tự nhiên đo bằng cùng máy, không `
          + 'so thẳng với số trong sách: lưới máy lệch vài chỗ (khoé mắt, lông mày). Số sát ngưỡng thì đọc cả hai bên. Lời chính theo '
          + 'sách tướng Trung Hoa (gốc của tướng học Việt), rồi tới Ấn Độ, kinh Phật, Ả Rập – Ba Tư, Hy Lạp – La Mã, tướng học hiện '
          + 'đại Nhật – Hàn, tục ngữ Việt. Các nền nhiều chỗ nói ngược nhau — app nêu cả, không chọn hộ.'),
        el('ul', {}, ...co.map((khoa) => el('li', {}, el('b', {}, `${GIAI[khoa].ten} ${so(k.so[khoa])}: `),
          g.loi[khoa] ?? '', ' ', GIAI[khoa].them[mucMat(khoa, k.so[khoa])],
          el('details', { class: 'nguon' }, el('summary', {}, 'Nguồn'), `${GIAI[khoa].nguon}.`))))]),
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
    el('p', { class: 'ghi-chu' }, 'Nhờ người khác chụp, đứng cách 1,5–2 m, zoom 2–3× — đừng tự chụp cầm tay: máy gần làm mặt dài '
      + 'ra tới ~20 %. Nhìn thẳng vào máy, mặt tự nhiên, ngậm miệng, đủ sáng, bỏ kính, tóc không che lông mày. '
      + 'Ảnh chỉ đo ngay trong máy: không gửi đi, không lưu. Lần đầu cần mạng để tải thư viện đo mặt (khoảng 17 MB), '
      + 'sau đó dùng không cần mạng.'),
    el('div', { class: 'nut-hang' }, nut), chon, ket,
  ];
}
