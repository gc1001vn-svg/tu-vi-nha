/**
 * Khoi "Bat tu (Tu tru)": bang 4 tru, nhat chu, ngu hanh (dem va theo quan he voi nhat chu), khong vong, dai van, van dang
 * chay va nam nay theo thap than, giai nghia. Tinh o `src/loi/batTu.ts`.
 */
import { dinhDangNgay } from '../../loi/amLich.ts';
import { NGHIA_THAP_THAN, NGHIA_VAN, NHOM_HANH, khacTru, tinhBatTu, type Tru, type VanNam } from '../../loi/batTu.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './batTu.css';

const COT = ['Năm', 'Tháng', 'Ngày', 'Giờ'];

/** "can Quý là Thiên Tài — … Chi Hợi (can chính ẩn trong chi là Nhâm) là Kiếp Tài — …" */
const giaiVan = (v: VanNam): string => {
  const [can = '', chi = ''] = v.canChi.split(' ');
  const [t1, t2] = v.thapThan;
  return `can ${can} là ${t1} — ${NGHIA_VAN[t1] ?? ''} Chi ${chi} (can chính ẩn trong chi là ${v.tang}) là ${t2} — ${NGHIA_VAN[t2] ?? ''}`;
};

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

  const tong = b.nhomHanh.reduce((t, x) => t + x.so, 0);
  const giup = b.nhomHanh.filter((x) => x.nhom === 'Tỷ Kiếp' || x.nhom === 'Ấn').reduce((t, x) => t + x.so, 0);
  const nhomHanh = [
    el('p', {}, 'Xếp theo quan hệ với nhật chủ (chính mình):'),
    el('ul', { class: 'nhom-hanh' }, ...b.nhomHanh.map((x) => el('li', {}, el('b', {}, x.nhom),
      ` — ${NHOM_HANH[x.nhom]?.la ?? ''}: hành ${x.hanh}, ${String(x.so)} chữ`))),
    ...b.nhomHanh.filter((x) => x.so >= 3).map((x) =>
      el('p', {}, el('b', {}, `${x.nhom} nhiều`), ` (${String(x.so)} chữ ${x.hanh}): ${NHOM_HANH[x.nhom]?.nhieu ?? ''}`)),
    ...b.nhomHanh.filter((x) => x.so === 0).map((x) =>
      el('p', {}, el('b', {}, `Thiếu ${x.nhom}`), ` (không có chữ ${x.hanh}): ${NHOM_HANH[x.nhom]?.thieu ?? ''}`)),
    el('p', { class: 'ghi-chu' }, `Hành đỡ cho mình (Tỷ Kiếp, Ấn): ${String(giup)}/${String(tong)} chữ; hành làm mình tốn sức `
      + `(Thực Thương, Tài, Quan Sát): ${String(tong - giup)}/${String(tong)} chữ. Đây chỉ là đếm thô, chưa tính mùa sinh và can ẩn `
      + 'trong chi, nên chưa nói được mình mạnh hay yếu.'),
  ];
  const vanNay = b.daiVan.find((v) => v.dangChay);
  const dau = b.daiVan[0];
  const daiVan = el('div', { class: 'dai-van' }, ...b.daiVan.map((v) => el('div', { class: v.dangChay ? 'van dang' : 'van' },
    el('div', {}, `${String(v.tuoi)} tuổi`), el('div', { class: 'cc' }, v.canChi), el('div', {}, String(v.batDau.nam)))));

  const thapThan = [...new Set(b.tru.flatMap((t) => (t === null ? [] : [t.thapThan, ...t.tangCan.map((c) => c.thapThan)])))]
    .filter((t) => t in NGHIA_THAP_THAN);
  const giai = el('details', { class: 'giai' }, el('summary', {}, 'Giải nghĩa thập thần, trường sinh, đại vận'),
    el('p', {}, 'Nhật chủ là can của ngày sinh, tượng trưng cho chính mình; mọi can chi khác xét theo quan hệ sinh – khắc với nhật chủ.'),
    el('p', {}, 'Thập thần là tên của quan hệ đó, ghi cho từng can và tàng can (can ẩn trong chi). "Mình" dưới đây là nhật chủ:'),
    el('ul', {}, ...thapThan.map((t) => el('li', {}, `${t}: ${NGHIA_THAP_THAN[t] ?? ''}`))),
    el('p', {}, 'Trường sinh: sức của nhật chủ ở từng chi, mạnh ở Lâm Quan, Đế Vượng, yếu ở Bệnh, Tử, Mộ, Tuyệt.'),
    el('p', {}, 'Đại vận: mỗi vận 10 năm, can chi đi tiếp từ trụ tháng; năm sinh can dương thì nam đi thuận, nữ đi nghịch, can âm thì ngược lại.'),
    el('p', { class: 'ghi-chu' }, 'Lời do Claude soạn lại theo quan niệm dân gian.'));

  return khoi('Bát tự (Tứ trụ)', false,
    bang,
    el('p', {}, el('b', {}, `Nhật chủ ${b.nhatChu}`), ` — ${b.nghiaNhatChu}`),
    el('p', { class: 'nhan-muc' }, 'Ngũ hành (đếm can và chi, không tính tàng can)'), nguHanh, ...nhomHanh,
    el('p', {}, `Không vong (theo trụ ngày): ${b.khongVong}`),
    el('p', { class: 'nhan-muc' }, 'Đại vận'),
    el('p', {}, `Khởi vận ${String(b.khoiVan.nam)} năm ${String(b.khoiVan.thang)} tháng ${String(b.khoiVan.ngay)} ngày sau khi sinh`
      + `${dau === undefined ? '' : ` (từ ${dinhDangNgay(dau.batDau)})`}, đi ${b.thuan ? 'thuận' : 'nghịch'}. Tuổi ghi là tuổi mụ năm bắt đầu vận.`),
    daiVan,
    vanNay === undefined ? el('p', { class: 'ghi-chu' }, 'Hôm nay chưa vào vận nào trong 8 vận trên.')
      : el('p', {}, el('b', {}, `Vận đang chạy ${vanNay.canChi}`), ` (từ ${String(vanNay.tuoi)} tuổi): ${giaiVan(vanNay)}`),
    el('p', {}, el('b', {}, `Năm nay ${b.namNay.canChi}`), ` (tính từ Lập Xuân): ${giaiVan(b.namNay)}`),
    ...[...ghiChu].map((c) => el('p', { class: 'canh-bao' }, c)),
    giai,
  );
};
