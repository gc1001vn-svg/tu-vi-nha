/**
 * Khoi "Chon ngay theo viec" o the "Hom nay" (`src/loi/chonNgay.ts`): chon viec, lui/toi thang, nam sinh lay tu ho so
 * (sua duoc, khong luu). Chi tinh khi mo khoi lan dau — the "Hom nay" khong cham hon.
 */
import { dinhDangNgay, type NgayDuong } from '../loi/amLich.ts';
import { canhBaoNam, chonNgay, VIEC, type NgayChon, type Viec } from '../loi/chonNgay.ts';
import type { HoSo } from '../loi/hoSo.ts';
import { el, khoi, THU, tinh } from './chung.ts';
import { LOI_SOAN } from './khoi/namNay.ts';

const NHAN = { tot: 'Tốt', duoc: 'Được', tranh: 'Tránh' } as const;
const LOP = { tot: 'hop', duoc: 'binh', tranh: 'xung' } as const;

function veNgay(n: NgayChon): HTMLElement {
  const x = n.xuatHanh;
  return el('div', { class: `nguoi ${LOP[n.danhGia]}` },
    el('div', { class: 'ten' }, `${THU[n.thu] ?? ''} ${dinhDangNgay(n.duong).slice(0, 5)} · âm ${String(n.am.ngay)}/${String(n.am.thang)}${n.am.nhuan ? ' nhuận' : ''} · ${n.canChiNgay}`,
      el('span', { class: 'nhan-quan-he' }, NHAN[n.danhGia])),
    el('p', { class: 'mau' }, n.lyDo.map((l) => l.chu).join(' · ')),
    x === undefined ? null : el('p', { class: 'mau' }, `${x.khongMinh.ten}: ${x.khongMinh.nghia} Giờ tốt: `
      + `${x.gio.filter((g) => g.tot).map((g) => `${g.chi} ${g.khoang} (${g.ten})`).join(', ')}. Hỷ thần ${x.hyThan}, tài thần ${x.taiThan}.`));
}

export function veChonNgay(toi: HoSo | undefined, homNay: NgayDuong): HTMLElement {
  let thang = { nam: homNay.nam, thang: homNay.thang };
  let namSinh: number | undefined;
  try { namSinh = toi === undefined ? undefined : tinh(toi).chinh.am.nam; } catch { namSinh = undefined; }

  const chonViec = el('select', { 'aria-label': 'Việc' },
    ...(Object.keys(VIEC) as Viec[]).map((v) => el('option', { value: v }, VIEC[v].ten)));
  const oNam = el('input', { type: 'text', inputmode: 'numeric', maxlength: '4', autocomplete: 'off', placeholder: 'vd 1987',
    value: namSinh === undefined ? '' : String(namSinh) });
  const nhanThang = el('span', { class: 'am' });
  const ketQua = el('div', { 'aria-live': 'polite' });

  const ve = (): void => {
    const viec = chonViec.value as Viec;
    const so = Number(oNam.value.trim());
    const nam = oNam.value.trim() !== '' && Number.isInteger(so) && so >= 1900 && so <= 2100 ? so : undefined;
    nhanThang.textContent = `Tháng ${String(thang.thang)}/${String(thang.nam)}`;
    const ds = chonNgay(viec, thang.nam, thang.thang, nam === undefined ? undefined : (nam + 8) % 12);
    const tot = ds.filter((n) => n.danhGia === 'tot').map((n) => String(n.duong.ngay));
    ketQua.replaceChildren(
      ...(oNam.value.trim() !== '' && nam === undefined ? [el('p', { class: 'loi' }, 'Năm sinh cần từ 1900 tới 2100 — đang không xét tuổi.')] : []),
      ...(nam === undefined ? [] : canhBaoNam(viec, nam, thang.nam, thang.thang).map((c) =>
        el('p', { class: 'canh-bao' }, `Năm ${String(c.namAm)} tuổi mụ ${String(c.tuoiMu)} phạm ${c.ten} (${c.muc.ten}): ${c.muc.nghia}`))),
      el('p', {}, tot.length === 0 ? 'Tháng này không có ngày Tốt cho việc này.' : `Ngày Tốt (dương lịch): ${tot.join(', ')}.`),
      ...ds.map(veNgay));
  };
  const nutThang = (chu: string, buoc: number): HTMLElement => {
    const n = el('button', { type: 'button', 'aria-label': buoc < 0 ? 'Tháng trước' : 'Tháng sau' }, chu);
    n.addEventListener('click', () => {
      const t = thang.nam * 12 + thang.thang - 1 + buoc;
      thang = { nam: Math.floor(t / 12), thang: (t % 12) + 1 };
      ve();
    });
    return n;
  };
  chonViec.addEventListener('change', ve);
  oNam.addEventListener('input', ve);

  const k = khoi('Chọn ngày theo việc', false,
    el('div', { class: 'form' },
      el('label', { class: 'cot' }, 'Việc', chonViec),
      el('label', { class: 'cot' }, 'Năm sinh âm lịch (sinh trước Tết thì lùi một năm; để trống thì không xét tuổi)', oNam)),
    el('div', { class: 'nut-hang' }, nutThang('‹', -1), nhanThang, nutThang('›', 1)),
    ketQua,
    el('p', { class: 'ghi-chu' }, 'Tốt: ngày Hoàng Đạo, lịch ghi nên làm việc này, không phạm ngày kỵ. Tránh: ngày Tam Nương, Nguyệt Kỵ, '
      + 'Dương Công Kỵ, Sát Chủ, Thọ Tử, hoặc ngày xung tuổi. Còn lại là Được. Nên/kiêng theo hoàng lịch Trung Hoa; hai bộ hoàng lịch '
      + `máy so được chỉ trùng nhau khoảng 6/10 ở mục kiêng, nên lịch ghi kiêng chỉ hạ xuống Được. Năm sinh sửa ở đây không lưu. ${LOI_SOAN}`));
  k.addEventListener('toggle', () => { if (ketQua.childElementCount === 0) ve(); });
  return k;
}
