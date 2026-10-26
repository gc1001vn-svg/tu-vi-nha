/**
 * Noi dung khoi "Tuong mat" (nap luoi tu `tuongMat.ts`): nut chon/chup anh, trang thai, bang so do, loi giai. Anh khong luu, khong
 * gui di — doc vao bo nho, do xong bo. Loi do `src/loi/tuongMat.ts`, loi giai `src/loi/tuongMatGiai.ts`; MediaPipe nap khi bam
 * (`tuongMatMp.ts`).
 */
import { CAC_KHOA, GIAI, KET, SO_ANH_MAU, dangSo, giaiMat, ketLuan, mucMat, soVoiMau } from '../../loi/tuongMatGiai.ts';
import { el } from '../chung.ts';
import { MAT_DA_DO } from './tuongMat.ts';
import type { KetQuaMat } from './tuongMatMp.ts';
import './tuongMat.css';

const so = (x: number, le = 2): string => x.toFixed(le).replace('.', ',');

function veKetQua(k: KetQuaMat): Node[] {
  const g = giaiMat(k), co = CAC_KHOA.filter((khoa) => g.loi[khoa] !== null), kl = ketLuan(k);
  return [
    el('table', {}, el('tbody', {}, ...CAC_KHOA.map((khoa) => el('tr', {},
      el('th', { scope: 'row' }, GIAI[khoa].ten, el('small', {}, GIAI[khoa].y)), el('td', {}, dangSo(khoa, k.so[khoa])))))),
    el('p', { class: 'ghi-chu' }, `Sai số ước ±${so(k.lech, 1)} % (trung bình 10 lần đo: 5 cỡ khung, ảnh và ảnh lật gương). `
      + `Đầu quay ngang ${so(k.goc.quay, 0)}°, ngẩng/cúi ${so(k.goc.ngua, 0)}°. Tải thư viện ${so(k.taiMs / 1000, 1)} giây, `
      + `đo ${so(k.doMs / 1000, 1)} giây.`),
    ...g.canhBao.map((c) => el('p', { class: 'canh-bao' }, c)),
    ...(kl === null ? [] : [
      el('h3', {}, 'Kết luận chung cả khuôn mặt (Claude tổng hợp theo sách tướng Trung Hoa, tham khảo)'),
      ...kl.map((c, i) => el('p', {}, i === kl.length - 1 ? el('b', {}, c) : c)),
      el('h3', {}, 'Từng nét'),
      el('p', { class: 'ghi-chu' }, `So với ${String(SO_ANH_MAU)} ảnh chân dung người Đông Á (Nhật, Hàn, Hoa, Việt) mặt tự nhiên đo cùng máy `
        + '— không so thẳng số trong sách vì lưới máy lệch vài chỗ. Nhãn tốt / cần lưu ý theo sách tướng Trung Hoa (gốc của tướng học '
        + 'Việt); Ấn Độ, kinh Phật, Ả Rập, Hy Lạp – La Mã nhiều chỗ nói ngược, xem trong "Các nền khác". (*) = chỉ đọc qua trích đoạn '
        + 'tìm kiếm, chưa mở được trang gốc.'),
      el('ul', {}, ...co.map((khoa) => {
        const muc = mucMat(khoa, k.so[khoa]), d = KET[khoa][muc].d;
        return el('li', {}, el('b', {}, `${GIAI[khoa].ten} ${dangSo(khoa, k.so[khoa])}: `),
          el('span', { class: `nhan nhan-${String(d)}` }, d > 0 ? 'Tốt' : d < 0 ? 'Cần lưu ý' : 'Trung tính'), ' ', g.loi[khoa] ?? '',
          el('small', {}, ` ${soVoiMau(khoa, k.so[khoa])}`),
          el('details', { class: 'nguon' }, el('summary', {}, 'Các nền khác, nguồn'), el('p', {}, GIAI[khoa].them[muc]),
            el('p', {}, `Nguồn: ${GIAI[khoa].nguon}.`)));
      }))]),
    el('p', { class: 'ghi-chu' }, '"Tướng mạo bất như tướng tâm" — tướng mặt không bằng tướng lòng (Phan Kế Bính, Việt Nam phong tục). '
      + 'Nhân tướng là quan niệm dân gian, không có cơ sở khoa học — đọc cho vui, đừng dựa vào để đánh '
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
    el('p', { class: 'ghi-chu' }, 'Đừng tự chụp cầm tay: máy gần làm mặt dài ra, mũi to ra tới ~20 %. Nhờ người khác chụp, đứng '
      + 'cách 1,5–2 m, zoom 2–3×; ở một mình thì kê điện thoại cách mặt 1,5–2 m ngang tầm mắt, mở app Camera, camera sau, zoom 2×, '
      + 'hẹn giờ 10 giây, rồi vào đây chọn ảnh trong Thư viện. Nhìn thẳng, mặt tự nhiên, ngậm miệng, đủ sáng, bỏ kính, tóc không '
      + 'che lông mày. '
      + 'Ảnh chỉ đo ngay trong máy: không gửi đi, không lưu. Lần đầu cần mạng để tải thư viện đo mặt (khoảng 17 MB), '
      + 'sau đó dùng không cần mạng.'),
    el('div', { class: 'nut-hang' }, nut), chon, ket,
  ];
}
