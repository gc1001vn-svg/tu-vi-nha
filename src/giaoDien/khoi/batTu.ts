/**
 * Khoi "Bat tu (Tu tru)": bang 4 tru, nhat chu, ngu hanh, khong vong, dai van, giai nghia ngan. Tinh o `src/loi/batTu.ts`.
 */
import { dinhDangNgay } from '../../loi/amLich.ts';
import { NGHIA_THAP_THAN, khacTru, tinhBatTu, type Tru } from '../../loi/batTu.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './batTu.css';

const COT = ['Năm', 'Tháng', 'Ngày', 'Giờ'];

export const veKhoiBatTu: VeKhoi = (hs, tr, ngayXem) => {
  const b = tinhBatTu(hs, tr.chinh, ngayXem);
  // Them phuong an cua ho so (doi mui gio, ±15 phut); trung dong loi da tinh thi Set bo.
  const ghiChu = new Set(b.ghiChu);
  for (const p of tr.khac) {
    const khac = khacTru(b.tru, tinhBatTu(hs, p.ketQua, ngayXem).tru);
    if (khac !== '') ghiChu.add(`${p.lyDo}: ${khac}`);
  }

  const hang = (nhan: string, f: (t: Tru) => Node | string, lon = false): HTMLElement =>
    el('tr', lon ? { class: 'lon' } : {}, el('th', { scope: 'row' }, nhan),
      ...b.tru.map((t) => el('td', {}, t === null ? (lon ? '?' : '') : f(t))));
  const bang = el('table', { class: 'bat-tu' },
    el('thead', {}, el('tr', {}, el('td', {}), ...COT.map((c) => el('th', { scope: 'col' }, c)))),
    el('tbody', {},
      hang('Thập thần', (t) => t.thapThan),
      hang('Can', (t) => t.can, true),
      hang('Chi', (t) => t.chi, true),
      hang('Tàng can', (t) => el('div', {}, ...t.tangCan.map((c) => el('div', { class: 'tang' }, c.can, el('small', {}, c.thapThan))))),
      hang('Nạp âm', (t) => t.napAm),
      hang('Trường sinh', (t) => t.truongSinh),
    ));

  const nhieu = Math.max(1, ...b.nguHanh.map((x) => x.so));
  const nguHanh = el('div', { class: 'ngu-hanh' }, ...b.nguHanh.map((x) => el('div', {},
    `${x.hanh} ${String(x.so)}`, el('div', { class: 'thanh', style: `width:${String(Math.round(x.so / nhieu * 100))}%` }))));

  const dau = b.daiVan[0];
  const daiVan = el('div', { class: 'dai-van' }, ...b.daiVan.map((v) => el('div', { class: v.dangChay ? 'van dang' : 'van' },
    el('div', {}, `${String(v.tuoi)} tuổi`), el('div', { class: 'cc' }, v.canChi), el('div', {}, String(v.batDau.nam)))));

  const thapThan = [...new Set(b.tru.flatMap((t) => (t === null ? [] : [t.thapThan, ...t.tangCan.map((c) => c.thapThan)])))]
    .filter((t) => t in NGHIA_THAP_THAN);
  const giai = el('details', { class: 'giai' }, el('summary', {}, 'Giải nghĩa ngắn'),
    el('p', {}, 'Nhật chủ là can của ngày sinh, tượng trưng cho chính mình; mọi can chi khác xét theo quan hệ sinh – khắc với nhật chủ.'),
    el('p', {}, 'Thập thần là tên của quan hệ đó, ghi cho từng can và tàng can (can ẩn trong chi):'),
    el('ul', {}, ...thapThan.map((t) => el('li', {}, `${t}: ${NGHIA_THAP_THAN[t] ?? ''}`))),
    el('p', {}, 'Trường sinh: sức của nhật chủ ở từng chi, mạnh ở Lâm Quan, Đế Vượng, yếu ở Bệnh, Tử, Mộ, Tuyệt.'),
    el('p', {}, 'Đại vận: mỗi vận 10 năm, can chi đi tiếp từ trụ tháng; năm sinh can dương thì nam đi thuận, nữ đi nghịch, can âm thì ngược lại.'),
    el('p', { class: 'ghi-chu' }, 'Lời do Claude soạn lại theo quan niệm dân gian.'));

  return khoi('Bát tự (Tứ trụ)', false,
    bang,
    el('p', {}, el('b', {}, `Nhật chủ ${b.nhatChu}`), ` — ${b.nghiaNhatChu}`),
    el('p', { class: 'nhan-muc' }, 'Ngũ hành (đếm can và chi, không tính tàng can)'), nguHanh,
    el('p', {}, `Không vong (theo trụ ngày): ${b.khongVong}`),
    el('p', { class: 'nhan-muc' }, 'Đại vận'),
    el('p', {}, `Khởi vận ${String(b.khoiVan.nam)} năm ${String(b.khoiVan.thang)} tháng ${String(b.khoiVan.ngay)} ngày sau khi sinh`
      + `${dau === undefined ? '' : ` (từ ${dinhDangNgay(dau.batDau)})`}, đi ${b.thuan ? 'thuận' : 'nghịch'}. Tuổi ghi là tuổi mụ năm bắt đầu vận.`),
    daiVan,
    b.daiVan.some((v) => v.dangChay) ? null : el('p', { class: 'ghi-chu' }, 'Hôm nay chưa vào vận nào trong 8 vận trên.'),
    ...[...ghiChu].map((c) => el('p', { class: 'canh-bao' }, c)),
    giai,
  );
};
