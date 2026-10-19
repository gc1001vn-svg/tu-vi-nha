/**
 * The "Hom nay": thong tin chung cua ngay + "Voi toi hom nay" theo ho so cua toi (anh chot 19/10: chi luu ho so cua anh,
 * tra cuu nguoi khac thi khong luu).
 */
import { dinhDangAm, dinhDangNgay, type NgayDuong } from '../loi/amLich.ts';
import { tuoiMu, type HoSo } from '../loi/hoSo.ts';
import { theoTuoi, xemNgay, type NgayXem } from '../loi/homNay.ts';
import { el, homNay7, tinh } from './chung.ts';

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const NHAN = { xung: 'Xung', hop: 'Hợp', binh: 'Bình thường' } as const;

const dong = (nhan: string, giaTri: string, ghiChu?: string): HTMLElement =>
  el('div', { class: 'dong' }, el('span', { class: 'nhan' }, nhan), el('span', {}, giaTri),
    ghiChu === undefined ? null : el('small', { class: 'ghi-chu' }, ghiChu));

/** Mot nguoi hom nay: hop/xung tuoi, loi, mau so hop menh. Dung o "Hom nay" (ho so cua toi) va "Tra cuu". */
export function dongTheoTuoi(hs: HoSo, n: NgayXem, d: NgayDuong): HTMLElement {
  try {
    const k = tinh(hs).chinh;
    const t = theoTuoi(n, k.chiNam, k.hanhMenh);
    return el('div', { class: `nguoi ${t.quanHe}` },
      el('div', { class: 'ten' }, `${hs.ten} · ${String(tuoiMu(k.am.nam, d))} tuổi (${k.conGiap})`,
        el('span', { class: 'nhan-quan-he' }, `${NHAN[t.quanHe]}${t.loai === '' ? '' : ` · ${t.loai}`}`)),
      el('p', {}, t.loi),
      el('p', { class: 'mau' }, `Màu hợp: ${t.mauHop.join(', ')} · Số hợp: ${t.soHop.join(', ')}`),
      el('p', { class: 'ghi-chu' }, 'Màu, số theo mệnh (nạp âm năm sinh). Lời do Claude soạn lại theo quan niệm dân gian.'));
  } catch (e) {
    return el('p', { class: 'loi' }, `${hs.ten}: không tính được (${e instanceof Error ? e.message : String(e)})`);
  }
}

export function veHomNay(toi: HoSo | undefined, moToi: () => void): HTMLElement {
  const d = homNay7();
  const n = xemNgay(d);
  const chung = el('section', { class: 'the' },
    el('h2', {}, `${THU[n.thu] ?? ''}, ${dinhDangNgay(d)}`),
    el('p', { class: 'am' }, `Âm lịch ${dinhDangAm(n.am)}`),
    dong('Năm', n.canChiNam), dong('Tháng', n.canChiThang), dong('Ngày', n.canChiNgay),
    dong('Tiết', n.tiet),
    dong('Tốt/xấu', `${n.hoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'} (${n.thienThan})`),
    dong('Trực', n.truc, 'tính theo tháng tiết — chưa chắc, chờ ảnh lịch'),
    dong('Giờ tốt', n.gioHoangDao.map((g) => `${g.chi} (${g.khoang})`).join(', ')),
    dong('Thần tài', n.thanTai), dong('Hỷ thần', n.hyThan),
    dong('Nạp âm', `${n.napAmNgay} (${n.hanhNgay})`),
  );
  const voiToi = el('section', { class: 'the' }, el('h2', {}, 'Với tôi hôm nay'));
  if (toi === undefined) {
    const nut = el('button', { type: 'button', class: 'chinh' }, 'Nhập hồ sơ của tôi');
    nut.addEventListener('click', moToi);
    voiToi.append(el('p', {}, 'Chưa có hồ sơ của tôi. Nhập một lần, app tự tính mỗi ngày.'), nut);
  } else {
    voiToi.append(dongTheoTuoi(toi, n, d));
  }
  return el('div', {}, chung, voiToi);
}
