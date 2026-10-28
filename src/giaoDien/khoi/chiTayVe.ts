/**
 * Noi dung khoi "Chi tay" (nap luoi tu `chiTay.ts`): chon/chup anh → thu nho ≤1024 px va ma hoa lai JPEG tren canvas (canvas chi
 * co diem anh, khong mang EXIF: vi tri GPS, ten may trong anh goc bi bo) → hien anh se gui, hoi gui → AI dien khung
 * (`src/loi/chiTay.ts`) → ghep loi soan san. Anh chi gui khi bam, khong luu.
 */
import { LOI_DAN_CHI_TAY, docKhung, giaiChiTay, type KhungChiTay } from '../../loi/chiTay.ts';
import type { GioiTinh } from '../../loi/hoSo.ts';
import { MO_HINH_ANH, docAnh, loiTiengViet } from '../ai/goi.ts';
import { docAI } from '../ai/luu.ts';
import { el } from '../chung.ts';
import './chiTay.css';

const CANH_MAX = 1024;

async function thuNho(f: File): Promise<string> {
  const url = URL.createObjectURL(f);
  const anh = new Image();
  anh.src = url;
  try {
    await anh.decode();
  } catch {
    throw new Error('Không đọc được ảnh này — chọn ảnh khác.');
  } finally {
    URL.revokeObjectURL(url);
  }
  const ty = Math.min(1, CANH_MAX / Math.max(anh.naturalWidth, anh.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(anh.naturalWidth * ty);
  c.height = Math.round(anh.naturalHeight * ty);
  const g = c.getContext('2d');
  if (g === null) throw new Error('Máy không vẽ được ảnh (canvas).');
  g.drawImage(anh, 0, 0, c.width, c.height);
  const s = c.toDataURL('image/jpeg', 0.85);
  c.width = 0; c.height = 0; // Safari giu bo nho canvas toi luc don rac
  return s;
}

function veKetQua(k: KhungChiTay): Node[] {
  return [
    el('p', { class: 'canh-bao' }, 'AI đọc ảnh, có thể sai — đo 28/10 thấy sai nhiều: 5 bàn tay khác nhau được AI tả giống nhau 76 % '
      + 'ô (gần bằng một bàn tay chụp lại: 80 %), ảnh vẽ sẵn đường sự nghiệp mà AI báo không có, ảnh chỉ tay ngang AI không nhận ra. '
      + 'Coi như lời chung; so bằng mắt với bàn tay mình.'),
    ...giaiChiTay(k).flatMap((m) => [
      el('h3', {}, m.ten),
      el('p', { class: 'ghi-chu' }, m.y),
      el('ul', {}, ...m.dong.map((d) => el('li', {}, el('b', {}, `${d.nhan}: `), d.loi))),
      el('p', { class: 'ghi-chu' }, `Nguồn: ${m.nguon}.`),
    ]),
    el('p', { class: 'ghi-chu' }, `AI (${MO_HINH_ANH} qua Groq, miễn phí) chỉ tả các đường vào khung có sẵn; lời giải do Claude soạn `
      + 'lại từ sách tướng tay phạm vi công cộng. Tên bốn đường theo cách gọi phổ biến ở Việt Nam (gốc sách Tây); sách Trung Hoa cổ '
      + 'chia ba đường lớn Thiên – Nhân – Địa. Chỉ tay là quan niệm dân gian, không có cơ sở khoa học — đọc cho vui, đừng dựa vào '
      + 'để quyết việc lớn.'),
  ];
}

export function veChiTay(gioiTinh: GioiTinh): Node[] {
  const ket = el('div', { 'aria-live': 'polite' });
  const bao = (lop: string, chu: string): void => { ket.replaceChildren(el('p', { class: lop }, chu)); };
  const chon = el('input', { type: 'file', accept: 'image/*', hidden: '' });
  const nut = el('button', { type: 'button', class: 'chinh' }, 'Chọn hoặc chụp ảnh lòng bàn tay');
  nut.addEventListener('click', () => { chon.click(); });
  const doc = async (anh: string): Promise<void> => {
    const { khoa } = docAI();
    if (khoa === null) { bao('loi', 'Chưa có khoá Groq: dán khoá (miễn phí) ở khối "AI (Groq)" cuối thẻ "Của tôi".'); return; }
    nut.disabled = true;
    bao('ghi-chu', 'Đang gửi ảnh cho AI đọc…');
    try {
      const k = docKhung(await docAnh(khoa, LOI_DAN_CHI_TAY, anh));
      if (k === null) bao('loi', 'AI trả lời sai khuôn — bấm chọn lại ảnh để thử lần nữa.');
      else if (!k.palm) bao('loi', 'AI không thấy rõ một lòng bàn tay — chụp lại: chỉ một bàn tay, xoè hết các ngón, chụp thẳng, đủ sáng.');
      else ket.replaceChildren(...veKetQua(k));
    } catch (e) {
      bao('loi', loiTiengViet(e));
    } finally {
      nut.disabled = false;
    }
  };
  chon.addEventListener('change', () => {
    const f = chon.files?.[0];
    chon.value = ''; // chon lai dung anh cu van chay
    if (f === undefined) return;
    thuNho(f).then((anh) => {
      const gui = el('button', { type: 'button', class: 'chinh' }, 'Gửi ảnh cho Groq');
      const thoi = el('button', { type: 'button' }, 'Thôi');
      gui.addEventListener('click', () => { void doc(anh); });
      thoi.addEventListener('click', () => { ket.replaceChildren(); });
      ket.replaceChildren(el('img', { src: anh, alt: 'Ảnh sẽ gửi' }),
        el('p', {}, 'Gửi ảnh này cho Groq đọc chỉ tay? Ảnh đã thu nhỏ, đã xoá thông tin vị trí trong ảnh; không kèm tên.'),
        el('div', { class: 'nut-hang' }, gui, thoi));
    }, (e: unknown) => { bao('loi', e instanceof Error ? e.message : String(e)); });
  });
  return [
    el('p', { class: 'ghi-chu' }, `Chụp tay ${gioiTinh === 'nam' ? 'trái' : 'phải'} (nam tả nữ hữu — cách xem phổ biến ở Việt Nam; `
      + 'sách Tây xem cả hai tay: tay trái bẩm sinh, tay phải phần tự rèn). Xoè thẳng cả bàn tay, đủ năm ngón và gốc ngón cái trong '
      + 'khung, chụp thẳng từ trên xuống, đủ sáng, không bóng loá. Ảnh gửi tới Groq để AI tả các đường (cần khoá Groq ở cuối thẻ '
      + '"Của tôi"); app không lưu ảnh.'),
    el('div', { class: 'nut-hang' }, nut), chon, ket,
  ];
}
