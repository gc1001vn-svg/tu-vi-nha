/**
 * Noi dung khoi "Chi tay" (nap luoi tu `chiTay.ts`): hinh mau 4 duong + bang chon tung o (nguoi xem nhin tay minh) → quy luat tung o
 * kem muc tin (`src/loi/chiTay.ts`) → khoi AI dien giai, du doan (Groq; chi doc o da chon + luat). Khong chup anh: AI doc anh mien phi
 * cua Groq khong dinh vi duoc duong (do 28/10, QUY_UOC muc 27).
 */
import { CAC_DUONG, DOAN_CHUONG, GIAI, KHUNG, type Duong, type KhungChiTay, type Luat } from '../../loi/chiTay.ts';
import { luanTay, tungO } from '../../loi/chiTayLuan.ts';
import type { GioiTinh } from '../../loi/hoSo.ts';
import { CHON, noiGonTuLuan } from '../../loi/noiGonMon.ts';
import { THUAT_NGU_TAY } from '../../loi/thuatNgu.ts';
import { el, khoiNap } from '../chung.ts';
import { giaiThuatNgu, hopNoiGon, veLuan } from './deHieu.ts';
import './chiTay.css';

/** Hinh mau ban tay phai nhin long ban tay (ngon cai ben phai); tay trai thi lat guong bang CSS. Mau trung chu chu thich. */
const HINH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 250"><g fill="#f3d9c4" stroke="#8a6a55" stroke-width="2">
<rect x="44" y="40" width="22" height="72" rx="11"/><rect x="70" y="18" width="24" height="92" rx="12"/>
<rect x="98" y="8" width="24" height="102" rx="12"/><rect x="126" y="22" width="24" height="88" rx="12"/>
<rect x="166" y="104" width="28" height="86" rx="14" transform="rotate(32 180 147)"/>
<path d="M40 100 Q36 230 70 242 L140 242 Q168 222 166 150 L160 100 Z"/></g>
<g fill="none" stroke-width="4" stroke-linecap="round"><path d="M42 128 Q95 140 140 112" stroke="#d33"/>
<path d="M152 138 Q110 152 58 172" stroke="#27c"/><path d="M152 140 Q108 180 122 238" stroke="#2a2"/>
<path d="M100 238 L108 112" stroke="#a3c"/></g></svg>`;

/** Cach tim tung duong tren tay (mau theo hinh mau). */
const CHO: Readonly<Record<Duong, string>> = {
  life: 'đường cong vòng quanh gốc ngón cái (xanh lá)',
  head: 'đường ngang giữa lòng bàn tay, đầu phía ngón cái (xanh dương)',
  heart: 'đường ngang trên cùng, ngay dưới gốc các ngón (đỏ)',
  fate: 'đường dọc giữa lòng bàn tay chạy lên ngón giữa — nhiều người không có (tím)',
};

const MAU: readonly [string, string][] = [['#d33', 'đường tình'], ['#27c', 'đường trí'], ['#2a2', 'đường đời'], ['#a3c', 'đường sự nghiệp']];

/** Cau tom tung o da chon (nhan chot, khong ke sach). */
function veTungO(k: KhungChiTay): HTMLElement[] {
  const t = tungO(k);
  return t.length === 0 ? [] : [el('h3', {}, 'Từng ô đã chọn'),
    el('ul', {}, ...t.map((x) => el('li', {}, el('b', {}, `${x.ten}: `), x.o.map((o) => o.y).join('; '), '.')))];
}

function veKetQua(k: KhungChiTay, gioiTinh: GioiTinh): Node[] {
  const luan = luanTay(k), ng = noiGonTuLuan(luan, CHON.tay);
  const ra: Node[] = [
    hopNoiGon(ng.cau),
    el('h3', {}, 'Lời giải'),
    ...veLuan(luan, ng.dung),
    ...veTungO(k),
    el('p', { class: 'ghi-chu' }, 'Lời giải do Claude tổng hợp từ nhiều sách, nhiều nước rồi soạn lại, chốt lời; chỉ để tham khảo.'),
    // Nap thang phien.ts, khong qua `khoiAI`: file nap luoi nay nhap ai/index.ts thi Vite tach goi mo app thanh 4 file (do 28/10).
    khoiNap('AI diễn giải và dự đoán (Groq, miễn phí)', 'ai',
      () => import('../ai/phien.ts').then((m) => m.vePhien(`chiTay:${gioiTinh}:${JSON.stringify(k)}`, { loai: 'chiTay', k, gioiTinh }))),
    el('p', { class: 'ghi-chu' }, 'AI chỉ diễn giải các ô đã chọn và luật app tra, không xem tay.'),
  ];
  giaiThuatNgu(ra, THUAT_NGU_TAY);
  return ra;
}

/** Nhac duoi anh may do — so do: QUY_UOC muc 27. */
const DO_SAI = 'Máy dò mới đúng phần nào, chưa ai chấm đúng sai (thử 01/11 trên 4 ảnh mẫu): đường vẽ thường đúng vùng nhưng chưa bám '
  + 'sát nếp; ảnh nghiêng, hai tay chồng nhau thì đường trí, đường sự nghiệp lệch hẳn. Đường màu lệch khỏi nếp tay thì sửa ô của '
  + 'đường đó; không thấy đường màu nào là máy không tìm ra — tự chọn.';

/** Gia tri trong o chon (chuoi) → gia tri khung. */
const docGia = (s: string): string | boolean | null => (s === '' ? null : s === 'true' ? true : s === 'false' ? false : s);

function oChon(nhan: string, gia: readonly unknown[], ten: (g: unknown) => string, doi: (g: string | boolean | null) => void): HTMLLabelElement {
  const o = el('select', {}, el('option', { value: '' }, '— chọn —'), ...gia.map((g) => el('option', { value: String(g) }, ten(g))));
  o.addEventListener('change', () => { doi(docGia(o.value)); });
  return el('label', { class: 'chon' }, el('span', {}, nhan), o);
}

export function veChiTay(gioiTinh: GioiTinh): Node[] {
  const doc: { simian: boolean | null; duong: Record<string, Record<string, string | boolean | null>> } = {
    simian: null, duong: Object.fromEntries(CAC_DUONG.map((d) => [d, Object.fromEntries(Object.keys(KHUNG[d]).map((o) => [o, null]))])),
  };
  const ket = el('div', { 'aria-live': 'polite' });
  const ve = (): void => { ket.replaceChildren(...veKetQua(structuredClone(doc) as unknown as KhungChiTay, gioiTinh)); };
  /** O chon theo "duong.o" (va "simian") — may do xong thi dien san. */
  const chon = new Map<string, HTMLSelectElement>();
  const khoa = (d: string): void => { // duong "khong thay / khong co": cac o con lai khong dung
    for (const [ten, s] of chon) if (ten.startsWith(`${d}.`) && ten !== `${d}.seen`) s.disabled = doc.duong[d]?.['seen'] === 'none';
  };
  const nhom = CAC_DUONG.map((d) => {
    const g = GIAI[d] as unknown as { ten: string; o: Record<string, { nhan: string; gia: Record<string, Luat> }> };
    const dd = doc.duong[d] ?? {};
    const oDuong = (Object.entries(KHUNG[d]) as [string, readonly unknown[]][]).map(([ten, gia]) => {
      const x = g.o[ten];
      const o = oChon(x?.nhan ?? ten, gia, (v) => x?.gia[String(v)]?.nhan ?? String(v), (v) => { dd[ten] = v; khoa(d); ve(); });
      const sel = o.querySelector('select');
      if (sel !== null) chon.set(`${d}.${ten}`, sel);
      return o;
    });
    return el('fieldset', {}, el('legend', {}, g.ten), el('p', { class: 'ghi-chu' }, `Tìm: ${CHO[d]}.`), ...oDuong);
  });
  const ngang = oChon('Đường trí và đường tình nhập làm một đường ngang suốt bàn tay?', [true, false],
    (v) => DOAN_CHUONG[v === true ? 'true' : 'false'].nhan, (v) => { doc.simian = typeof v === 'boolean' ? v : null; ve(); });
  const selNgang = ngang.querySelector('select');
  if (selNgang !== null) chon.set('simian', selNgang);
  const datKhung = (k: KhungChiTay): void => {
    doc.simian = k.simian;
    for (const d of CAC_DUONG) for (const [o, v] of Object.entries(k.duong[d]) as [string, string | boolean | null][]) {
      const dd = doc.duong[d];
      if (dd !== undefined) dd[o] = v;
    }
    for (const [ten, s] of chon) {
      const [d = '', o = ''] = ten.split('.');
      const v = ten === 'simian' ? doc.simian : doc.duong[d]?.[o] ?? null;
      s.value = v === null ? '' : String(v);
    }
    for (const d of CAC_DUONG) khoa(d);
    ve();
  };
  // Chup anh → may tu do (nap luoi `chiTayMp.ts`, MediaPipe) → ve duong len anh, dien san o.
  const anhKet = el('div', { 'aria-live': 'polite' });
  const chonAnh = el('input', { type: 'file', accept: 'image/*', hidden: '' });
  const nutAnh = el('button', { type: 'button', class: 'chinh' }, 'Chụp hoặc chọn ảnh lòng bàn tay — máy tự dò');
  nutAnh.addEventListener('click', () => { chonAnh.click(); });
  chonAnh.addEventListener('change', () => {
    const f = chonAnh.files?.[0];
    chonAnh.value = ''; // chon lai dung anh cu van chay
    if (f === undefined) return;
    nutAnh.disabled = true;
    anhKet.replaceChildren(el('p', { class: 'ghi-chu' }, 'Đang tải thư viện tìm bàn tay (lần đầu khoảng 21 MB)…'));
    import('./chiTayMp.ts')
      .then((m) => m.doAnhTay(f, () => { anhKet.replaceChildren(el('p', { class: 'ghi-chu' }, 'Đang dò…')); }))
      .then((k) => {
        anhKet.replaceChildren(el('img', { class: 'anh-do', src: k.anh, alt: 'Ảnh tay, các đường máy dò được tô màu theo hình mẫu' }),
          el('p', { class: 'canh-bao' }, DO_SAI));
        datKhung(k.khung);
      }, (e: unknown) => { anhKet.replaceChildren(el('p', { class: 'loi' }, e instanceof Error ? e.message : String(e))); })
      .finally(() => { nutAnh.disabled = false; });
  });
  const hinh = el('img', { class: 'hinh', alt: 'Hình mẫu: bốn đường chính trên lòng bàn tay',
    src: `data:image/svg+xml,${encodeURIComponent(HINH)}`, ...(gioiTinh === 'nam' ? { style: 'transform: scaleX(-1)' } : {}) });
  ve();
  return [
    el('p', { class: 'ghi-chu' }, `Xem tay ${gioiTinh === 'nam' ? 'trái' : 'phải'} (nam tả nữ hữu — cách xem phổ biến ở Việt Nam; sách Tây `
      + 'xem cả hai tay). Cách dễ: chụp lòng bàn tay — máy dò 4 đường ngay trong máy (ảnh không gửi đi, không lưu), tô màu lên ảnh và '
      + 'điền sẵn các ô bên dưới; anh xem đường màu có nằm đúng nếp tay không, ô nào sai thì chọn lại. Chụp: xoè thẳng cả bàn tay, chụp '
      + 'thẳng từ trên xuống, đủ sáng, không bóng loá, lòng bàn tay chiếm gần hết khung. Hoặc tự chọn từng ô theo hình mẫu.'),
    el('div', { class: 'nut-hang' }, nutAnh), chonAnh, anhKet,
    hinh,
    el('p', { class: 'chu-thich' }, ...MAU.flatMap(([m, t], i) => [...(i > 0 ? [' · '] : []), el('span', { style: `color: ${m}` }, `● ${t}`)])),
    el('fieldset', {}, el('legend', {}, 'Chỉ tay ngang (đoạn chưởng)'), ngang),
    ...nhom,
    ket,
  ];
}
