/**
 * The "Hom nay": thong tin chung cua ngay + "Voi toi hom nay" theo ho so cua toi (anh chot 19/10: chi luu ho so cua anh,
 * tra cuu nguoi khac thi khong luu) + khoi gap/mo chi tiet ngay (nen/kieng, sao, 28 tu, Banh To, xung, sat).
 */
import { dinhDangAm, dinhDangNgay, type NgayDuong } from '../loi/amLich.ts';
import { tuoiMu, type HoSo } from '../loi/hoSo.ts';
import { chiTietNgay, gioTotTheoTuoi, theoTuoi, xemNgay, type ChiTietNgay, type GioHoangDao, type NgayXem } from '../loi/homNay.ts';
import { el, homNay7, khoi, tinh } from './chung.ts';

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const NHAN = { xung: 'Xung', hop: 'Hợp', binh: 'Bình thường' } as const;
const SOAN_LAI = 'Lời do Claude soạn lại theo quan niệm dân gian.';
const LOI_KY: Readonly<Record<string, string>> = {
  'Tam Nương': 'dân gian kiêng khởi sự việc lớn: cưới hỏi, khai trương, động thổ, đi xa',
  'Nguyệt Kỵ': 'dân gian kiêng đi xa, khởi sự việc lớn',
};
const THEO = 'Theo hoàng lịch Trung Hoa (thư viện lunar-typescript), tháng tính theo tiết khí giờ Việt Nam; lịch Việt trên mạng có thể ghi khác.';

const dong = (nhan: string, giaTri: string, ghiChu?: string): HTMLElement =>
  el('div', { class: 'dong' }, el('span', { class: 'nhan' }, nhan), el('span', {}, giaTri),
    ghiChu === undefined ? null : el('small', { class: 'ghi-chu' }, ghiChu));
const gio = (ds: readonly GioHoangDao[]): string => ds.map((g) => `${g.chi} (${g.khoang})`).join(', ');

/** Khoi gap/mo chi tiet ngay: nen/kieng (mo san), sao, 28 tu… */
function veChiTiet(c: ChiTietNgay): HTMLElement[] {
  const conVat = c.tu28.ten.endsWith(c.tu28.conVat) ? '' : ` (${c.tu28.conVat})`;
  return [
    khoi('Việc nên làm, nên kiêng', true, dong('Nên', c.nen.join(' · ')), dong('Kiêng', c.kieng.join(' · ')),
      el('p', { class: 'ghi-chu' }, THEO)),
    khoi('Sao tốt, sao xấu', false, dong('Sao tốt', c.saoTot.join(', ')), dong('Sao xấu', c.saoXau.join(', ')),
      el('p', { class: 'ghi-chu' }, THEO)),
    khoi('28 tú, Bành Tổ, tuổi xung, hướng', false,
      dong('28 tú', `${c.tu28.ten}${conVat} — ${c.tu28.catHung}`),
      dong('Bành Tổ', `${c.banhTo.join('. ')}.`),
      dong('Tuổi xung', c.tuoiXung, 'nặng nhất tuổi này (chi bị xung, can bị khắc); cùng con giáp cũng xung ngày'),
      dong('Hướng sát', c.huongSat, 'kiêng động thổ, dọn nhà, đi xa về hướng này'),
      el('p', { class: 'ghi-chu' }, `Theo hoàng lịch Trung Hoa. ${SOAN_LAI}`)),
  ];
}

/** Mot nguoi hom nay: hop/xung tuoi, loi, mau so hop menh. Dung o "Hom nay" (ho so cua toi) va "Tra cuu". */
export function dongTheoTuoi(hs: HoSo, n: NgayXem, d: NgayDuong): HTMLElement {
  try {
    const k = tinh(hs).chinh;
    const t = theoTuoi(n, k.chiNam, k.hanhMenh);
    return el('div', { class: `nguoi ${t.quanHe}` },
      el('div', { class: 'ten' }, `${hs.ten} · ${String(tuoiMu(k.am.nam, d))} tuổi (${k.conGiap})`,
        el('span', { class: 'nhan-quan-he' }, `${NHAN[t.quanHe]}${t.loai === '' ? '' : ` · ${t.loai}`}`)),
      el('p', {}, t.loi),
      el('p', {}, `Giờ tốt hợp tuổi: ${gio(gioTotTheoTuoi(n, k.chiNam))}`),
      el('p', { class: 'mau' }, `Màu hợp: ${t.mauHop.join(', ')} · Số hợp: ${t.soHop.join(', ')}`),
      el('p', { class: 'ghi-chu' }, `Giờ tốt hợp tuổi: giờ hoàng đạo bỏ giờ xung tuổi. Màu, số theo mệnh (nạp âm năm sinh). ${SOAN_LAI}`));
  } catch (e) {
    return el('p', { class: 'loi' }, `${hs.ten}: không tính được (${e instanceof Error ? e.message : String(e)})`);
  }
}

export function veHomNay(toi: HoSo | undefined, moToi: () => void): HTMLElement {
  const d = homNay7();
  const n = xemNgay(d);
  const c = chiTietNgay(d);
  const chung = el('section', { class: 'the' },
    el('h2', {}, `${THU[n.thu] ?? ''}, ${dinhDangNgay(d)}`),
    el('p', { class: 'am' }, `Âm lịch ${dinhDangAm(n.am)}`),
    ...c.ngayKy.map((k) => el('div', { class: 'dong' }, el('span', { class: 'nhan' }, 'Ngày kỵ'),
      el('strong', { class: 'loi' }, k), el('small', { class: 'ghi-chu' }, `${LOI_KY[k] ?? ''}. ${SOAN_LAI}`))),
    dong('Năm', n.canChiNam), dong('Tháng', n.canChiThang), dong('Ngày', n.canChiNgay),
    dong('Tiết', n.tiet),
    dong('Tốt/xấu', `${n.hoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'} (${n.thienThan})`),
    dong('Trực', n.truc, 'tính theo tháng tiết — chưa chắc, chờ ảnh lịch'),
    dong('Giờ tốt', gio(n.gioHoangDao)),
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
  return el('div', {}, chung, voiToi, ...veChiTiet(c));
}
