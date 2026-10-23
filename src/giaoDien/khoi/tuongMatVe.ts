/**
 * Noi dung khoi "Tuong mat" (nap luoi tu `tuongMat.ts`): nut chon/chup anh, trang thai, bang so do. Anh khong luu, khong gui
 * di — doc vao bo nho, do xong bo. Loi do `src/loi/tuongMat.ts`; MediaPipe nap khi bam (`tuongMatMp.ts`).
 */
import type { SoDoMat } from '../../loi/tuongMat.ts';
import { el } from '../chung.ts';
import type { KetQuaMat } from './tuongMatMp.ts';
import './tuongMat.css';

const DONG: readonly (readonly [keyof SoDoMat, string, string])[] = [
  ['trungHa', 'Trung đình : hạ đình', 'ấn đường → chân mũi, so với chân mũi → đáy cằm'],
  ['nguNhan', 'Ngũ nhãn', 'bề ngang mặt bằng bấy nhiêu mắt'],
  ['khoangMat', 'Khoảng giữa hai mắt', 'bằng bấy nhiêu mắt'],
  ['mui', 'Cánh mũi', 'rộng bằng bấy nhiêu khoảng giữa hai mắt'],
  ['mieng', 'Miệng', 'rộng bằng bấy nhiêu cánh mũi'],
  ['daiRong', 'Dài : rộng mặt', 'ấn đường → đáy cằm, so với bề ngang mặt'],
  ['may', 'Lông mày', 'dài bằng bấy nhiêu mắt'],
  ['anDuong', 'Ấn đường', 'khoảng giữa hai đầu mày, bằng bấy nhiêu mắt'],
  ['mayCach', 'Mày cách mắt', 'bằng bấy nhiêu mắt'],
];
const so = (x: number, le = 2): string => x.toFixed(le).replace('.', ',');

function veKetQua(k: KetQuaMat): Node[] {
  return [
    el('table', {}, el('tbody', {}, ...DONG.map(([khoa, ten, y]) => el('tr', {},
      el('th', { scope: 'row' }, ten, el('small', {}, y)), el('td', {}, so(k.so[khoa])))))),
    el('p', { class: 'ghi-chu' }, `Sai số ước ±${so(k.lech, 1)} % (trung bình 10 lần đo: 5 cỡ khung, ảnh và ảnh lật gương). `
      + `Đầu quay ngang ${so(k.goc.quay, 0)}°, ngẩng/cúi ${so(k.goc.ngua, 0)}°. Tải thư viện ${so(k.taiMs / 1000, 1)} giây, `
      + `đo ${so(k.doMs / 1000, 1)} giây.`),
    el('p', { class: 'ghi-chu' }, 'Bản thử: mới có số đo, lời giải theo sách tướng sẽ có ở bản sau.'),
  ];
}

export function veTuongMat(): Node[] {
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
      .then((k) => { ket.replaceChildren(...veKetQua(k)); }, (e: unknown) => { bao('loi', e instanceof Error ? e.message : String(e)); })
      .finally(() => { nut.disabled = false; });
  });
  return [
    el('p', { class: 'ghi-chu' }, 'Nhìn thẳng vào máy, mặt tự nhiên (không cười), đủ sáng, bỏ kính, tóc không che lông mày. '
      + 'Ảnh chỉ đo ngay trong máy: không gửi đi, không lưu. Lần đầu cần mạng để tải thư viện đo mặt (khoảng 17 MB), '
      + 'sau đó dùng không cần mạng.'),
    el('div', { class: 'nut-hang' }, nut), chon, ket,
  ];
}
