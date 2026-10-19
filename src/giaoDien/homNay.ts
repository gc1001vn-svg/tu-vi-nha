/**
 * The "Hom nay": thong tin chung cua ngay + "Ca nha hom nay" (moi nguoi mot dong — anh chot 19/10).
 */
import { dinhDangAm, dinhDangNgay } from '../loi/amLich.ts';
import { tuoiMu, type HoSo } from '../loi/hoSo.ts';
import { theoTuoi, xemNgay } from '../loi/homNay.ts';
import { el, homNay7, tinh } from './chung.ts';

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const NHAN = { xung: 'Xung', hop: 'Hợp', binh: 'Bình thường' } as const;

const dong = (nhan: string, giaTri: string, ghiChu?: string): HTMLElement =>
  el('div', { class: 'dong' }, el('span', { class: 'nhan' }, nhan), el('span', {}, giaTri),
    ghiChu === undefined ? null : el('small', { class: 'ghi-chu' }, ghiChu));

export function veHomNay(ds: readonly HoSo[], moThem: () => void): HTMLElement {
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

  const caNha = el('section', { class: 'the' }, el('h2', {}, 'Cả nhà hôm nay'));
  if (ds.length === 0) {
    const nut = el('button', { type: 'button', class: 'chinh' }, 'Thêm người nhà');
    nut.addEventListener('click', moThem);
    caNha.append(el('p', {}, 'Chưa có hồ sơ nào.'), nut);
  }
  for (const hs of ds) {
    try {
      const k = tinh(hs).chinh;
      const t = theoTuoi(n, k.chiNam, k.hanhMenh);
      caNha.append(el('div', { class: `nguoi ${t.quanHe}` },
        el('div', { class: 'ten' }, `${hs.ten} · ${String(tuoiMu(k.am.nam, d))} tuổi (${k.conGiap})`,
          el('span', { class: 'nhan-quan-he' }, `${NHAN[t.quanHe]}${t.loai === '' ? '' : ` · ${t.loai}`}`)),
        el('p', {}, t.loi),
        el('p', { class: 'mau' }, `Màu hợp: ${t.mauHop.join(', ')} · Số hợp: ${t.soHop.join(', ')}`),
      ));
    } catch (e) {
      caNha.append(el('p', { class: 'loi' }, `${hs.ten}: không tính được (${e instanceof Error ? e.message : String(e)})`));
    }
  }
  if (ds.length > 0) caNha.append(el('p', { class: 'ghi-chu' }, 'Màu, số theo mệnh (nạp âm năm sinh). Lời do Claude soạn lại theo quan niệm dân gian.'));
  return el('div', {}, chung, caNha);
}
