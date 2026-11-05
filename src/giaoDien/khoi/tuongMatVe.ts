/**
 * Noi dung khoi "Tuong mat" (nap luoi tu `tuongMat.ts`): nut chon/chup anh, trang thai, bang so do, loi giai. Anh khong luu, khong
 * gui di — doc vao bo nho, do xong bo. Loi do `src/loi/tuongMat.ts`, loi giai `src/loi/tuongMatGiai.ts`; MediaPipe nap khi bam
 * (`tuongMatMp.ts`). Loi chot (tong luan, tung viec, van, tung net): `src/loi/tuongMatLuan.ts` (`docs/LUAN_TUONG_MAT.md`).
 */
import { CAC_KHOA, GIAI, SO_ANH_MAU, dangSo, giaiMat, soVoiMau } from '../../loi/tuongMatGiai.ts';
import { IT_NHAT, luanMat, mucXet, netChot } from '../../loi/tuongMatLuan.ts';
import { CHON, noiGonTuLuan } from '../../loi/noiGonMon.ts';
import { THUAT_NGU_MAT } from '../../loi/thuatNgu.ts';
import { el } from '../chung.ts';
import { chiTietRanh, giaiThuatNgu, hopNoiGon, veLuan } from './deHieu.ts';
import { MAT_DA_DO } from './tuongMat.ts';
import type { KetQuaMat } from './tuongMatMp.ts';
import './tuongMat.css';

const so = (x: number, le = 2): string => x.toFixed(le).replace('.', ',');

function veKetQua(k: KetQuaMat): Node[] {
  const g = giaiMat(k), co = CAC_KHOA.filter((khoa) => g.loi[khoa] !== null), luan = luanMat(k), muc = mucXet(k);
  const ng = luan === null ? null : noiGonTuLuan(luan, CHON.mat);
  // Thu tu doc cho nguoi thuong (QUY_UOC muc 44): "Nói gọn" → loi giai → tung net; bang so do, sai so, so voi mau → nguoi ranh.
  const ra: Node[] = [
    ...(ng === null ? [] : [hopNoiGon(ng.cau)]),
    ...g.canhBao.map((c) => el('p', { class: 'canh-bao' }, c)),
    ...(luan === null ? [] : [
      el('h3', {}, 'Lời giải'),
      ...veLuan(luan, ng?.dung),
      ...(co.length < IT_NHAT ? [] : [
        el('h3', {}, 'Từng nét'),
        el('ul', {}, ...co.map((khoa) => {
          const n = netChot(khoa, muc), d = n?.d ?? 0;
          return el('li', {}, el('b', {}, `${GIAI[khoa].ten}: `),
            el('span', { class: `nhan nhan-${String(Math.sign(d))}` }, d > 0 ? 'Tốt' : d < 0 ? 'Cần lưu ý' : 'Trung tính'), ` ${n?.y ?? ''}.`);
        }))])]),
    chiTietRanh(
      el('table', {}, el('tbody', {}, ...CAC_KHOA.map((khoa) => el('tr', {},
        el('th', { scope: 'row' }, GIAI[khoa].ten, el('small', {}, GIAI[khoa].y)), el('td', {}, dangSo(khoa, k.so[khoa])))))),
      el('p', {}, `Sai số ước ±${so(k.lech, 1)} % (trung bình 10 lần đo: 5 cỡ khung, ảnh và ảnh lật gương). `
        + `Đầu quay ngang ${so(k.goc.quay, 0)}°, ngẩng/cúi ${so(k.goc.ngua, 0)}°. Tải thư viện ${so(k.taiMs / 1000, 1)} giây, `
        + `đo ${so(k.doMs / 1000, 1)} giây.`),
      co.length < IT_NHAT ? null : el('p', {}, `So với ${String(SO_ANH_MAU)} ảnh chân dung người Đông Á (Nhật, Hàn, Hoa, Việt) mặt tự nhiên `
        + 'đo cùng máy:'),
      co.length < IT_NHAT ? null : el('ul', {}, ...co.map((khoa) => el('li', {}, `${GIAI[khoa].ten} ${dangSo(khoa, k.so[khoa])}: `
        + soVoiMau(khoa, k.so[khoa]))))),
    el('p', { class: 'ghi-chu' }, 'Số đo này (không có ảnh) được gửi kèm cho "AI tổng hợp mọi môn" nếu đo xong trước khi AI trả lời lần đầu. '
      + 'Lời giải do Claude tổng hợp từ nhiều sách, nhiều nước rồi soạn lại, chốt lời; chỉ để tham khảo.'),
  ];
  giaiThuatNgu(ra, THUAT_NGU_MAT);
  return ra;
}

export function veTuongMat(khoa: string): Node[] {
  const ket = el('div', { 'aria-live': 'polite' });
  const bao = (lop: string, chu: string): void => { ket.replaceChildren(el('p', { class: lop }, chu)); };
  const nut: HTMLButtonElement[] = [];
  /** Nut + o chon file an. `truoc`: mo thang camera truoc (capture="user") — anh khong ghi tieu cu thi gia dinh goc rong camera truoc. */
  const nutAnh = (chu: string, truoc: boolean): readonly [HTMLButtonElement, HTMLInputElement] => {
    const chon = el('input', { type: 'file', accept: 'image/*', hidden: '', ...(truoc ? { capture: 'user' } : {}) });
    const n = el('button', { type: 'button', ...(truoc ? { class: 'chinh' } : {}) }, chu);
    nut.push(n);
    n.addEventListener('click', () => { chon.click(); });
    chon.addEventListener('change', () => {
      const f = chon.files?.[0];
      chon.value = ''; // chon lai dung anh cu (iPhone hay dat trung ten) van do
      if (f === undefined) return;
      for (const x of nut) x.disabled = true;
      bao('ghi-chu', 'Đang tải thư viện đo mặt (lần đầu khoảng 17 MB)…');
      import('./tuongMatMp.ts')
        .then((m) => m.doAnh(f, () => { bao('ghi-chu', 'Đang đo…'); }, truoc))
        .then((k) => { MAT_DA_DO.set(khoa, k); ket.replaceChildren(...veKetQua(k)); },
          (e: unknown) => { bao('loi', e instanceof Error ? e.message : String(e)); })
        .finally(() => { for (const x of nut) x.disabled = false; });
    });
    return [n, chon];
  };
  const [n1, o1] = nutAnh('Tự chụp (camera trước)', true), [n2, o2] = nutAnh('Chọn ảnh có sẵn', false);
  return [
    el('p', { class: 'ghi-chu' }, 'Tự chụp: bấm "Tự chụp (camera trước)", duỗi thẳng tay cầm máy ngang tầm mắt, nhìn thẳng vào ống kính. '
      + 'Máy gần làm mặt méo (dài ra, mũi to ra) — app tự sửa theo góc rộng camera. Chắc hơn nữa: chụp bằng app Camera (camera trước, '
      + 'không cắt ảnh) rồi bấm "Chọn ảnh có sẵn" — ảnh trong Thư viện còn ghi tiêu cự; tốt nhất vẫn là nhờ người khác chụp cách 1,5–2 m, '
      + 'zoom 2–3×. Mặt tự nhiên, ngậm miệng, đủ sáng, bỏ kính, tóc không che lông mày. '
      + 'Ảnh chỉ đo ngay trong máy: không gửi đi, không lưu. Lần đầu cần mạng để tải thư viện đo mặt (khoảng 17 MB), '
      + 'sau đó dùng không cần mạng.'),
    el('div', { class: 'nut-hang' }, n1, n2), o1, o2, ket,
  ];
}
