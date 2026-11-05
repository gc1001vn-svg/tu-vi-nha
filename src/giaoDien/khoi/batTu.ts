/**
 * Khoi "Bat tu (Tu tru)": bang 4 tru, ngu hanh (tinh ca can an), khong vong; tong luan, luan tung viec, dai van, nam nay — loi chot
 * cua `src/loi/batTuLuan.ts` (ke hoach `docs/ke-hoach/2026-11-02-bat-tu.md`; nguon, ly do: `docs/LUAN_BAT_TU.md`). Tinh: `batTu.ts`.
 */
import { dinhDangNgay } from '../../loi/amLich.ts';
import { NGHIA_THAP_THAN, khacTru, tinhBatTu, type Tru } from '../../loi/batTu.ts';
import { dsVanBT, luanNamBT, luanVanBT, luanViec, phanTich, tongLuanBT } from '../../loi/batTuLuan.ts';
import { hv } from '../../loi/hanViet/index.ts';
import { noiGonBatTu } from '../../loi/noiGon.ts';
import { THUAT_NGU_BAT_TU } from '../../loi/thuatNgu.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import { chiTietRanh, giaiThuatNgu, hopNoiGon } from './deHieu.ts';
import './batTu.css';

const COT = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
const VAN = { thuan: 'thuận', vua: 'bình thường', kho: 'nhiều thử thách' } as const;
/** Van bat dau tu tuoi nay tro di thi gop mot dong (qua tuoi tho thuong) — nhu khoi tu vi. */
const TUOI_GOP = 85;
const VIEC = { thuan: 'thuận hơn phần đông', vua: 'bình thường', kho: 'phải để tâm hơn' } as const;
const giai = (tom: string, mo: boolean, loi: readonly string[]): HTMLElement =>
  el('details', { class: 'giai', ...(mo ? { open: '' } : {}) }, el('summary', {}, tom), ...loi.map((l) => el('p', {}, l)));

export const veKhoiBatTu: VeKhoi = (hs, tr, ngayXem) => {
  const b = tinhBatTu(hs, tr.chinh, ngayXem);
  const p = phanTich(b);
  // Them phuong an cua ho so (doi mui gio, ±15 phut); trung dong loi da tinh thi Set bo.
  const ghiChu = new Set(b.ghiChu);
  for (const x of tr.khac) {
    const khac = khacTru(b.tru, tinhBatTu(hs, x.ketQua, ngayXem).tru);
    if (khac !== '') ghiChu.add(`${x.lyDo}: ${khac}`);
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

  // Ngu hanh theo trong so may luan dung (ca can an, lenh thang nang nhat), hien phan tram.
  const tong = p.hanh.reduce((s, x) => s + x, 0) || 1;
  const nhieu = Math.max(...p.hanh);
  const nguHanh = el('div', { class: 'ngu-hanh' }, ...p.hanh.map((x, e) => el('div', {},
    `${hv('nguHanh', '木火土金水'.charAt(e))} ${String(Math.round(x / tong * 100))}\u00a0%`,
    el('div', { class: 'thanh', style: `width:${String(Math.round(x / (nhieu || 1) * 100))}%` }))));

  const vanNay = b.daiVan.find((v) => v.dangChay);
  const dau = b.daiVan[0];
  const ds = dsVanBT(b, p);
  const daiVan = el('div', { class: 'dai-van' }, ...ds.flatMap((v, i) => (v.tuoi >= TUOI_GOP ? [] : [el('div', { class: v.dangChay ? 'van dang' : 'van' },
    el('div', {}, `${String(v.tuoi)} tuổi`), el('div', { class: 'cc' }, v.canChi), el('div', {}, String(b.daiVan[i]?.batDau.nam ?? '')),
    el('div', { class: `ket ${v.ket}` }, VAN[v.ket]))])));
  const gop = ds.find((v) => v.tuoi >= TUOI_GOP);
  const lvNay = vanNay === undefined ? null : luanVanBT(b, vanNay, p);
  const nam = luanNamBT(b, p);

  const thapThan = [...new Set(b.tru.flatMap((t) => (t === null ? [] : [t.thapThan, ...t.tangCan.map((c) => c.thapThan)])))]
    .filter((t) => t in NGHIA_THAP_THAN);
  const thuatNgu = el('div', {}, el('h4', {}, 'Giải nghĩa thuật ngữ'),
    el('p', {}, 'Nhật chủ là can của ngày sinh, tượng trưng cho chính mình; mọi can chi khác xét theo quan hệ sinh – khắc với nhật chủ.'),
    el('p', {}, 'Thập thần là tên của quan hệ đó, ghi cho từng can và tàng can (can ẩn trong chi). "Mình" dưới đây là nhật chủ:'),
    el('ul', {}, ...thapThan.map((t) => el('li', {}, `${t}: ${NGHIA_THAP_THAN[t] ?? ''}`))),
    el('p', {}, 'Trường sinh: sức của nhật chủ ở từng chi, mạnh ở Lâm Quan, Đế Vượng, yếu ở Bệnh, Tử, Mộ, Tuyệt.'),
    el('p', {}, 'Đại vận: mỗi vận 10 năm, can chi đi tiếp từ trụ tháng; năm sinh can dương thì nam đi thuận, nữ đi nghịch, can âm thì ngược lại.'),
    el('p', {}, 'Nghĩa chung từng thuật ngữ, Claude soạn lại; phần luận ở trên mới là lời chốt.'));

  // Cau "Xét ba điều các sách cùng dùng…" (cach xet manh yeu) la chu nghe: dua xuong muc cho nguoi ranh; loi gui AI giu nguyen.
  const tongLuan = tongLuanBT(b, p);
  const cachXet = tongLuan.filter((d) => d.tieuDe.startsWith('Mạnh hay yếu')).flatMap((d) => d.loi.slice(1));
  // Thu tu doc cho nguoi thuong (QUY_UOC muc 43): "Nói gọn" → loi luan → van, nam; bang tru, can an, nguon → "Chi tiết cho người rành".
  const k = khoi('Bát tự (Tứ trụ)', false,
    hopNoiGon(noiGonBatTu(b, p, hs.gioiTinh).cau),
    ...[...ghiChu].map((c) => el('p', { class: 'canh-bao' }, c)),
    el('p', { class: 'nhan-muc' }, 'Năm loại khí trong lá số (ngũ hành)'), nguHanh,
    el('details', { class: 'giai bt-tong', open: '' }, el('summary', {}, 'Tổng luận lá số'),
      ...tongLuan.flatMap((d) => [el('h4', {}, d.tieuDe), ...d.loi.filter((l) => !cachXet.includes(l)).map((l) => el('p', {}, l))])),
    el('p', { class: 'nhan-muc' }, 'Luận từng việc'),
    ...luanViec(b, hs.gioiTinh, p).map((v) => giai(`${v.ten} · ${VIEC[v.ket]}`, false, v.loi)),
    el('p', { class: 'nhan-muc' }, 'Đại vận (mỗi vận 10 năm)'),
    daiVan,
    gop === undefined ? null : el('p', { class: 'ghi-chu' }, `Từ ${String(gop.tuoi)} tuổi trở đi: quá tuổi thọ thường, không kể.`),
    vanNay === undefined || lvNay === null ? el('p', { class: 'ghi-chu' }, 'Hôm nay chưa vào vận nào trong 8 vận trên.')
      : giai(`Vận đang chạy ${vanNay.canChi} (${String(vanNay.tuoi)}–${String(vanNay.tuoi + 9)} tuổi) · ${VAN[lvNay.ket]}`, true, lvNay.loi),
    giai(`Năm ${b.namNay.canChi} (tính từ Lập Xuân) · ${nam.ket === 'kho' ? 'nhiều trở ngại' : VAN[nam.ket]}`, true, nam.loi),
    chiTietRanh(
      bang,
      el('p', {}, 'Ngũ hành tính cả can ẩn trong chi, lệnh tháng nặng nhất.'),
      ...cachXet.map((l) => el('p', {}, l)),
      el('p', {}, `Không vong (theo trụ ngày): ${b.khongVong}`),
      el('p', {}, `Khởi vận ${String(b.khoiVan.nam)} năm ${String(b.khoiVan.thang)} tháng ${String(b.khoiVan.ngay)} ngày sau khi sinh`
        + `${dau === undefined ? '' : ` (từ ${dinhDangNgay(dau.batDau)})`}, đi ${b.thuan ? 'thuận' : 'nghịch'}. Tuổi ghi là tuổi mụ năm bắt đầu vận.`),
      el('p', {}, 'Đại vận là chính (chi nặng hơn can), năm thêm bớt (can nặng hơn chi); xét theo hành hợp, hành kỵ của lá số.'),
      thuatNgu),
    el('p', { class: 'ghi-chu' }, 'Lời giải do Claude tổng hợp nhiều phái bát tự (sách cổ Trung Hoa; cách đọc Đài Loan – Hồng Kông, Hàn, Nhật, '
      + 'Việt) rồi soạn lại, chốt một lời; chỉ để tham khảo.'),
  );
  giaiThuatNgu([k], THUAT_NGU_BAT_TU);
  return k;
};
