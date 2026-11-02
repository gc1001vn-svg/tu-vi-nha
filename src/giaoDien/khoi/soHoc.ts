/**
 * Hai khoi mot nguoi tu ngay DUONG sinh (`src/loi/soHoc.ts`): than so hoc, nhip sinh hoc hom nay (cung hoang dao: khoi chiem tinh).
 * Than so hoc hien loi chot cua `src/loi/soHocLuan.ts` (ke hoach 2026-11-02-than-so; nguon, ly do: `docs/LUAN_THAN_SO.md`).
 * Dung tuy chon mac dinh (`docs/QUY_UOC.md` bang tuy chon) va ghi ro cach tinh ngay tren khoi.
 */
import { dinhDangNgay, type NgayDuong } from '../../loi/amLich.ts';
import type { DoanLuan } from '../../loi/chiemTinhLuan.ts';
import type { HoSo } from '../../loi/hoSo.ts';
import { nhipSinhHoc, tenSo, thanSo } from '../../loi/soHoc.ts';
import { bieuDoTS, tongLuanTS, vanTS } from '../../loi/soHocLuan.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './soHoc.css';

const LOI = 'Lời do Claude soạn lại theo quan niệm phổ biến.';

const ngaySinh = (hs: HoSo): NgayDuong => {
  const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
  return { nam, thang, ngay };
};

const doan = (d: DoanLuan): HTMLElement[] => [el('h4', {}, d.tieuDe), ...d.loi.map((l) => el('p', {}, l))];
const phan = (tieuDe: string, ...con: HTMLElement[]): HTMLElement => el('details', { class: 'sh-luan', open: '' }, el('summary', {}, tieuDe), ...con);

// Luoi Pitago: hang tren 3-6-9, giua 2-5-8, duoi 1-4-7.
const THU_TU_O = [3, 6, 9, 2, 5, 8, 1, 4, 7];

export const veKhoiThanSo: VeKhoi = (hs, _tr, ngayXem) => {
  const sinh = ngaySinh(hs), t = thanSo(sinh, ngayXem), v = vanTS(t, sinh, ngayXem);
  return khoi('Thần số học', false, el('div', { class: 'so-hoc' },
    el('div', { class: 'sh-lon' }, el('span', { class: 'sh-so' }, tenSo(t.chuDao)), el('span', {}, 'số chủ đạo')),
    phan('Tổng luận', ...tongLuanTS(t, sinh).flatMap(doan)),
    el('div', { class: 'sh-luoi', role: 'group', 'aria-label': 'Biểu đồ ngày sinh' },
      ...THU_TU_O.map((k) => el('span', {}, String(k).repeat(t.luoi[k - 1] ?? 0)))),
    el('p', { class: 'sh-chu-thich' }, 'Biểu đồ ngày sinh: mỗi chữ số trong ngày sinh vào đúng ô của nó (bỏ số 0). '
      + 'Hàng trên 3-6-9 thiên về trí óc, giữa 2-5-8 tình cảm, dưới 1-4-7 thể chất.'),
    phan('Biểu đồ ngày sinh', ...bieuDoTS(t).flatMap(doan)),
    phan('Vận: đỉnh cao, năm, tháng',
      el('ul', {}, ...v.dinh.map((x, i) => el('li', i === v.dang ? { class: 'dang' } : {},
        `Đỉnh ${String(i + 1)}: ${String(x.tu)}–${x.den === null ? '…' : String(x.den)} tuổi · số ${String(x.so)} · thử thách ${String(x.thuThach)}`
          + (i === v.dang ? ' (đang đi qua)' : '')))),
      ...v.loi.map((l) => el('p', {}, l))),
    el('p', { class: 'sh-chu-thich' }, 'Số chủ đạo: cộng mọi chữ số ngày sinh dương lịch (cách phổ biến ở Việt Nam). Năm cá nhân đổi ngày 01/01. '
      + 'Claude tổng hợp nhiều trường phái thần số học (Pythagoras hiện đại phương Tây, bản Việt) rồi chốt lời; thần số học không có '
      + 'cơ sở khoa học, chỉ để tham khảo.')));
};

export const veKhoiNhipSinhHoc: VeKhoi = (hs, _tr, ngayXem) => {
  const n = nhipSinhHoc(ngaySinh(hs), ngayXem);
  return khoi('Nhịp sinh học hôm nay', false, el('div', { class: 'so-hoc' },
    el('p', {}, `${dinhDangNgay(ngayXem)}: ${String(n.ngay)} ngày kể từ ngày sinh.`),
    ...n.nhip.map((x) => {
      const nua = Math.abs(x.phanTram) / 2;
      // Thanh chay tu giua: duong sang phai, am sang trai.
      const vach = `left:${String(x.phanTram < 0 ? 50 - nua : 50)}%;width:${String(nua)}%`;
      return el('div', { class: 'sh-nhip' },
        el('div', { class: 'sh-nhip-dau' }, el('span', {}, `${x.ten} (${String(x.chuKy)} ngày)`),
          el('b', {}, `${x.phanTram > 0 ? '+' : ''}${String(x.phanTram)}% ${x.len ? '↑' : '↓'}`)),
        el('div', { class: 'sh-thanh', 'aria-hidden': 'true' }, el('i', { class: x.phanTram < 0 ? 'sh-am' : '', style: vach })),
        el('div', { class: 'sh-loi' }, `${x.yNghia}; ${x.len ? 'đang lên' : 'đang xuống'}`,
          x.nguy ? el('b', { class: 'sh-nguy' }, ' · ngày nguy (đổi dấu), nên cẩn thận') : null));
    }),
    el('p', { class: 'sh-chu-thich' }, 'Nhịp sinh học là thuyết cũ (hình sin chu kỳ 23, 28, 33 ngày tính từ ngày sinh), '
      + `không có cơ sở khoa học vững; chỉ để tham khảo. ${LOI}`)));
};
