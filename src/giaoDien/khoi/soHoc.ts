/**
 * Hai khoi mot nguoi tu ngay DUONG sinh (`src/loi/soHoc.ts`): than so hoc, nhip sinh hoc hom nay (cung hoang dao: khoi chiem tinh).
 * Dung tuy chon mac dinh (`docs/QUY_UOC.md` bang tuy chon) va ghi ro cach tinh ngay tren khoi.
 */
import { dinhDangNgay, type NgayDuong } from '../../loi/amLich.ts';
import type { HoSo } from '../../loi/hoSo.ts';
import { nhipSinhHoc, tenSo, thanSo } from '../../loi/soHoc.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './soHoc.css';

const LOI = 'Lời do Claude soạn lại theo quan niệm phổ biến.';

const ngaySinh = (hs: HoSo): NgayDuong => {
  const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
  return { nam, thang, ngay };
};

const dong = (nhan: string, so: string, loi: string): HTMLElement =>
  el('div', { class: 'dong' }, el('span', { class: 'nhan' }, nhan), el('b', {}, so), el('span', { class: 'sh-loi' }, loi));

// Luoi Pitago: hang tren 3-6-9, giua 2-5-8, duoi 1-4-7.
const THU_TU_O = [3, 6, 9, 2, 5, 8, 1, 4, 7];

export const veKhoiThanSo: VeKhoi = (hs, _tr, ngayXem) => {
  const t = thanSo(ngaySinh(hs), ngayXem);
  return khoi('Thần số học', false, el('div', { class: 'so-hoc' },
    el('div', { class: 'sh-lon' }, el('span', { class: 'sh-so' }, tenSo(t.chuDao)), el('span', {}, 'số chủ đạo')),
    el('p', {}, t.nghiaChuDao),
    dong('Số ngày sinh', String(t.ngaySinh), t.nghiaNgaySinh),
    dong(`Năm cá nhân ${String(t.namXem)}`, String(t.namCaNhan), t.nghiaNam),
    dong(`Tháng cá nhân ${String(ngayXem.thang)}/${String(ngayXem.nam)}`, String(t.thangCaNhan), t.nghiaThang),
    el('div', { class: 'sh-luoi', role: 'group', 'aria-label': 'Biểu đồ ngày sinh' },
      ...THU_TU_O.map((k) => el('span', {}, String(k).repeat(t.luoi[k - 1] ?? 0)))),
    el('p', { class: 'sh-chu-thich' }, 'Biểu đồ ngày sinh: mỗi chữ số trong ngày sinh vào đúng ô của nó (bỏ số 0). '
      + 'Hàng trên 3-6-9 thiên về trí óc, giữa 2-5-8 tình cảm, dưới 1-4-7 thể chất.'),
    el('p', { class: 'sh-chu-thich' }, `Số chủ đạo: cộng mọi chữ số ngày sinh dương lịch (cách phổ biến ở Việt Nam). Năm cá nhân đổi ngày 01/01. ${LOI}`)));
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
