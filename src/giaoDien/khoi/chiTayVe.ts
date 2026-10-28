/**
 * Noi dung khoi "Chi tay" (nap luoi tu `chiTay.ts`): hinh mau 4 duong + bang chon tung o (nguoi xem nhin tay minh) → quy luat tung o
 * kem muc tin (`src/loi/chiTay.ts`) → khoi AI dien giai, du doan (Groq; chi doc o da chon + luat). Khong chup anh: AI doc anh mien phi
 * cua Groq khong dinh vi duoc duong (do 28/10, QUY_UOC muc 27).
 */
import { CAC_DUONG, DOAN_CHUONG, GIAI, KHUNG, QUY_LUAT_CHUNG, giaiChiTay, mucTin, type Duong, type KhungChiTay, type Luat } from '../../loi/chiTay.ts';
import type { GioiTinh } from '../../loi/hoSo.ts';
import { el, khoiNap } from '../chung.ts';
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

const loaiTin = (l: Pick<Luat, 'nen' | 'venh'>): string => (l.venh !== undefined ? 'venh' : l.nen.length >= 2 ? 'dong' : l.nen.length === 1 ? 'mot' : 'khong');

/** Mot luat: cau chot, nhan muc tin, chi tiet tung sach gap lai. */
function luat(l: Omit<Luat, 'nhan'>): (string | HTMLElement)[] {
  return [l.chot, ' ', el('span', { class: `tin tin-${loaiTin(l)}` }, mucTin(l)),
    el('details', { class: 'nguon' }, el('summary', {}, 'Từng sách nói gì'), el('p', {}, l.loi),
      ...(l.venh === undefined ? [] : [el('p', {}, `Vênh: ${l.venh}`)]))];
}

function veKetQua(k: KhungChiTay, gioiTinh: GioiTinh): Node[] {
  return [
    el('h3', {}, 'Quy luật chung (xếp từ đồng thuận nhiều nền nhất)'),
    el('ul', {}, ...QUY_LUAT_CHUNG.map((l) => el('li', {}, ...luat(l)))),
    ...giaiChiTay(k).flatMap((m) => [
      el('h3', {}, m.ten),
      el('p', { class: 'ghi-chu' }, m.y),
      el('ul', {}, ...m.dong.map((d) => el('li', {}, el('b', {}, `${d.o}: `),
        ...(d.luat === null ? ['chưa chọn.'] : [`${d.luat.nhan} — `, ...luat(d.luat)])))),
      el('p', { class: 'ghi-chu' }, `Nguồn: ${m.nguon}.`),
    ]),
    // Nap thang phien.ts, khong qua `khoiAI`: file nap luoi nay nhap ai/index.ts thi Vite tach goi mo app thanh 4 file (do 28/10).
    khoiNap('AI diễn giải và dự đoán (Groq, miễn phí)', 'ai',
      () => import('../ai/phien.ts').then((m) => m.vePhien(`chiTay:${gioiTinh}:${JSON.stringify(k)}`, { loai: 'chiTay', k, gioiTinh }))),
    el('p', { class: 'ghi-chu' }, 'Quy luật do Claude soạn lại từ sách tướng tay phạm vi công cộng; "đồng thuận N nền" = N trong 4 nền '
      + '(Trung Hoa, Ấn Độ, Hy Lạp, Tây) cùng nói một ý — tin hơn, nhưng vẫn là quan niệm dân gian, không có cơ sở khoa học. AI chỉ '
      + 'diễn giải các luật trên, không xem tay. Đừng dựa vào để quyết việc lớn.'),
  ];
}

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
  const nhom = CAC_DUONG.map((d) => {
    const g = GIAI[d] as unknown as { ten: string; o: Record<string, { nhan: string; gia: Record<string, Luat> }> };
    const dd = doc.duong[d] ?? {};
    const oDuong = (Object.entries(KHUNG[d]) as [string, readonly unknown[]][]).map(([ten, gia]) => {
      const x = g.o[ten];
      return oChon(x?.nhan ?? ten, gia, (v) => x?.gia[String(v)]?.nhan ?? String(v), (v) => {
        dd[ten] = v;
        // Duong "khong thay / khong co" (o dau tien): cac o con lai khong dung
        if (ten === 'seen') for (const o of oDuong.slice(1)) { const s = o.querySelector('select'); if (s !== null) s.disabled = v === 'none'; }
        ve();
      });
    });
    return el('fieldset', {}, el('legend', {}, g.ten), el('p', { class: 'ghi-chu' }, `Tìm: ${CHO[d]}.`), ...oDuong);
  });
  const ngang = oChon('Đường trí và đường tình nhập làm một đường ngang suốt bàn tay?', [true, false],
    (v) => DOAN_CHUONG[v === true ? 'true' : 'false'].nhan, (v) => { doc.simian = typeof v === 'boolean' ? v : null; ve(); });
  const hinh = el('img', { class: 'hinh', alt: 'Hình mẫu: bốn đường chính trên lòng bàn tay',
    src: `data:image/svg+xml,${encodeURIComponent(HINH)}`, ...(gioiTinh === 'nam' ? { style: 'transform: scaleX(-1)' } : {}) });
  ve();
  return [
    el('p', { class: 'ghi-chu' }, `Nhìn lòng bàn tay ${gioiTinh === 'nam' ? 'trái' : 'phải'} của mình (nam tả nữ hữu — cách xem phổ biến `
      + 'ở Việt Nam; sách Tây xem cả hai tay) rồi chọn từng ô theo hình mẫu. Gập nhẹ bàn tay, nhìn dưới đèn sáng cho nét hiện rõ; ô nào '
      + 'không chắc thì để "— chọn —". App không chụp ảnh: AI đọc ảnh miễn phí của Groq đo 28/10 không định vị được đường chỉ tay.'),
    hinh,
    el('p', { class: 'chu-thich' }, ...MAU.flatMap(([m, t], i) => [...(i > 0 ? [' · '] : []), el('span', { style: `color: ${m}` }, `● ${t}`)])),
    el('fieldset', {}, el('legend', {}, 'Chỉ tay ngang (đoạn chưởng)'), ngang),
    ...nhom,
    ket,
  ];
}
