/**
 * Hai the dung chung form nhap ngay gio sinh (duong hoac am) va the ket qua:
 *   - "Cua toi": MOT ho so duy nhat cua anh, luu trong may + xuat/nhap file sao luu. App dua vao no de tu tinh moi ngay.
 *   - "Tra cuu": nhap bat ky ai, ra ket qua ngay, KHONG luu (anh chot 19/10; luu them nguoi khac de dot 9).
 */
import { amSangDuong, dinhDangAm, dinhDangNgay, type NgayAm } from '../loi/amLich.ts';
import { kiemHoSo, tuoiMu, type HoSo } from '../loi/hoSo.ts';
import { xemNgay } from '../loi/homNay.ts';
import { NUOC_NGOAI, TINH } from '../loi/tinh.ts';
import { docFile, type Kho } from '../luuTru.ts';
import { el, homNay7, isoNgay, moTaKhac, tinh } from './chung.ts';
import { dongTheoTuoi } from './homNay.ts';

export interface CuaToi {
  readonly kho: Kho;
  /** Ghi danh sach moi; tra loi neu khong ghi duoc. */
  doiHoSo(ds: readonly HoSo[]): string | null;
  xuat(): void;
  bao(loi: string): void;
  /** Ve lai ca app (sau khi doi trang thai cuc bo cua the nay). */
  ve(): void;
}

let dangSuaToi = false;
let choNhap: HoSo[] | null = null;
/** Nguoi vua tra cuu — chi song trong phien mo app, khong ghi vao may. */
let daTra: HoSo | null = null;

const loiCua = (e: unknown): string => (e instanceof Error ? e.message : String(e));

function theHoSo(hs: HoSo, ...nut: HTMLElement[]): HTMLElement {
  const noi = hs.noiSinh === NUOC_NGOAI ? `nước ngoài (${hs.muiGio ?? '?'})` : hs.noiSinh;
  const [nam, thang, ngay] = hs.ngaySinh.split('-').map(Number);
  const dau = el('div', { class: 'ten' }, `${hs.ten} (${hs.gioiTinh === 'nam' ? 'nam' : 'nữ'})`);
  const duong = el('p', {}, `Dương lịch ${dinhDangNgay({ nam: nam ?? 0, thang: thang ?? 0, ngay: ngay ?? 0 })} ${hs.gioSinh ?? '(không rõ giờ)'} · ${noi}`);
  const the = el('section', { class: 'the' }, dau, duong);
  try {
    const r = tinh(hs);
    const k = r.chinh;
    the.append(
      el('p', {}, `Âm lịch ${dinhDangAm(k.am)} · năm ${k.canChiNam}, tháng ${k.canChiThang}, ngày ${k.canChiNgay}`
        + (k.chiGio === null ? '' : `, giờ ${k.chiGio}`)),
      el('p', {}, `Tuổi ${k.conGiap} · ${String(tuoiMu(k.am.nam, homNay7()))} tuổi mụ`),
      el('p', {}, `Mệnh ${k.napAm} (${k.hanhMenh}) · cung phi ${k.cungPhi} (${k.hanhCungPhi})`),
      ...r.canhBao.map((c) => el('p', { class: 'canh-bao' }, c)),
      ...r.khac.map((p) => el('p', { class: 'canh-bao' }, `${p.lyDo}: khác ở ${moTaKhac(p.khac, p.ketQua)}`)),
    );
  } catch (e) {
    the.append(el('p', { class: 'loi' }, `Không tính được: ${loiCua(e)}`));
  }
  if (nut.length > 0) the.append(el('div', { class: 'nut-hang' }, ...nut));
  return the;
}

/** `xong` nhan ho so da kiem va da tinh thu; tra loi (tieng Viet) neu khong xong. */
function form(tieuDe: string, nutXong: string, tenMacDinh: string, cu: HoSo | null,
  xong: (hs: HoSo) => string | null, huy: (() => void) | null): HTMLElement {
  const ten = el('input', { type: 'text', maxlength: '60', autocomplete: 'off', placeholder: tenMacDinh, value: cu?.ten ?? '' });
  const gioiTinh = el('select', {}, el('option', { value: 'nam' }, 'Nam'), el('option', { value: 'nu' }, 'Nữ'));
  gioiTinh.value = cu?.gioiTinh ?? 'nam';

  const ngayDuong = el('input', { type: 'date', min: '1900-02-01', max: '2100-12-31', value: cu?.ngaySinh ?? '' });
  const kieuAm = el('input', { type: 'checkbox' });
  const amNgay = el('input', { type: 'number', inputmode: 'numeric', min: '1', max: '30', placeholder: 'ngày' });
  const amThang = el('input', { type: 'number', inputmode: 'numeric', min: '1', max: '12', placeholder: 'tháng' });
  const amNam = el('input', { type: 'number', inputmode: 'numeric', min: '1900', max: '2100', placeholder: 'năm' });
  const nhuan = el('input', { type: 'checkbox' });
  const xemAm = el('p', { class: 'ghi-chu' });
  const khoiAm = el('div', { class: 'khoi-am', hidden: '' },
    el('div', { class: 'ba-o' }, amNgay, amThang, amNam), el('label', {}, nhuan, ' Tháng nhuận'), xemAm);

  const docAm = (): NgayAm => ({ ngay: Number(amNgay.value), thang: Number(amThang.value), nam: Number(amNam.value), nhuan: nhuan.checked });
  const capNhatAm = (): void => {
    xemAm.textContent = '';
    if (amNgay.value === '' || amThang.value === '' || amNam.value === '') return;
    try {
      const a = docAm();
      const d = amSangDuong(a);
      let chu = `= dương lịch ${dinhDangNgay(d)}`;
      // Truoc 1976 nhieu lich in theo gio +8 (QUY_UOC muc 7): ngay am nho theo lich do co the lech.
      if (a.nam < 1976) {
        try {
          const d8 = amSangDuong(a, 8);
          if (isoNgay(d8) !== isoNgay(d)) chu += `. Lịch thời đó có thể theo giờ +8: ngày dương có thể là ${dinhDangNgay(d8)} — nếu biết ngày dương thì nhập ngày dương.`;
        } catch {
          chu += '. Lịch giờ +8 thời đó không có ngày âm này.';
        }
      }
      xemAm.textContent = chu;
    } catch (e) {
      xemAm.textContent = loiCua(e);
    }
  };
  for (const o of [amNgay, amThang, amNam, nhuan]) o.addEventListener('input', capNhatAm);
  kieuAm.addEventListener('change', () => {
    khoiAm.hidden = !kieuAm.checked;
    ngayDuong.hidden = kieuAm.checked;
  });

  const gio = el('input', { type: 'time', value: cu?.gioSinh ?? '' });
  const khongRo = el('input', { type: 'checkbox' });
  khongRo.checked = cu !== null && cu.gioSinh === null;
  gio.disabled = khongRo.checked;
  khongRo.addEventListener('change', () => { gio.disabled = khongRo.checked; });

  const noiSinh = el('select', {}, el('option', { value: '' }, '— chọn tỉnh —'),
    ...TINH.map(([t]) => el('option', { value: t }, t)), el('option', { value: NUOC_NGOAI }, NUOC_NGOAI));
  noiSinh.value = cu?.noiSinh ?? '';
  const muiGio = el('select', {}, ...Intl.supportedValuesOf('timeZone').map((z) => el('option', { value: z }, z)));
  muiGio.value = cu?.muiGio ?? 'Europe/Paris';
  const khoiMui = el('label', { class: 'cot' }, 'Múi giờ nơi sinh', muiGio);
  khoiMui.hidden = noiSinh.value !== NUOC_NGOAI;
  noiSinh.addEventListener('change', () => { khoiMui.hidden = noiSinh.value !== NUOC_NGOAI; });

  const loi = el('p', { class: 'loi', role: 'alert' });
  const nutHuy = huy === null ? null : el('button', { type: 'button' }, 'Huỷ');
  nutHuy?.addEventListener('click', () => { huy?.(); });

  const f = el('form', { class: 'the form' },
    el('h2', {}, tieuDe),
    el('label', { class: 'cot' }, 'Tên gọi (không bắt buộc)', ten),
    el('label', { class: 'cot' }, 'Giới tính', gioiTinh),
    el('div', { class: 'cot' }, el('span', {}, 'Ngày sinh'), el('label', {}, kieuAm, ' Nhập ngày âm'), ngayDuong, khoiAm),
    el('div', { class: 'cot' }, el('label', { class: 'cot' }, 'Giờ sinh (giờ đồng hồ lúc đó)', gio),
      el('label', {}, khongRo, ' Không rõ giờ')),
    el('label', { class: 'cot' }, 'Nơi sinh (tên tỉnh lúc sinh)', noiSinh),
    khoiMui, loi, el('div', { class: 'nut-hang' }, el('button', { type: 'submit', class: 'chinh' }, nutXong), nutHuy),
  );
  f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    try {
      if (!khongRo.checked && gio.value === '') throw new Error('Chưa nhập giờ sinh (hoặc chọn "Không rõ giờ")');
      const ngaySinh = kieuAm.checked ? isoNgay(amSangDuong(docAm())) : ngayDuong.value;
      const hs = kiemHoSo({
        id: cu?.id ?? crypto.randomUUID(), ten: ten.value.trim() === '' ? tenMacDinh : ten.value, gioiTinh: gioiTinh.value,
        ngaySinh, gioSinh: khongRo.checked ? null : gio.value.slice(0, 5), noiSinh: noiSinh.value,
        ...(noiSinh.value === NUOC_NGOAI ? { muiGio: muiGio.value } : {}),
      });
      tinh(hs); // tinh thu truoc: mui gio la, ngay ngoai bang… bao ngay o day
      const loiXong = xong(hs);
      if (loiXong !== null) throw new Error(loiXong);
    } catch (e) {
      loi.textContent = loiCua(e);
    }
  });
  return f;
}

function khoiSaoLuu(ctx: CuaToi): HTMLElement {
  const xuat = el('button', { type: 'button' }, 'Xuất file sao lưu');
  xuat.addEventListener('click', () => { ctx.xuat(); });
  const chon = el('input', { type: 'file', accept: '.json,application/json', hidden: '' });
  const nhap = el('button', { type: 'button' }, 'Nhập file sao lưu');
  nhap.addEventListener('click', () => { chon.click(); });
  chon.addEventListener('change', () => {
    const f = chon.files?.[0];
    if (f === undefined) return;
    docFile(f).then((ds) => { choNhap = ds; ctx.ve(); }, (e: unknown) => { ctx.bao(`Không nhập được: ${loiCua(e)}`); ctx.ve(); });
  });
  const khoi = el('section', { class: 'the' }, el('h2', {}, 'Sao lưu'),
    el('p', { class: 'ghi-chu' }, 'Hồ sơ chỉ nằm trong máy này. Xuất file rồi cất vào Tệp/iCloud để không mất khi đổi máy hay iPhone xoá dữ liệu.'),
    el('div', { class: 'nut-hang' }, xuat, nhap), chon);
  if (choNhap !== null) {
    const ds = choNhap;
    const thay = el('button', { type: 'button', class: 'chinh' }, 'Dùng hồ sơ trong file');
    const huy = el('button', { type: 'button' }, 'Huỷ');
    thay.addEventListener('click', () => {
      if (ctx.kho.hoSo.length > 0 && !confirm('Thay hồ sơ đang có bằng hồ sơ trong file?')) return;
      choNhap = null;
      ctx.bao(ctx.doiHoSo(ds) ?? 'Đã nhập file sao lưu.');
      ctx.ve();
    });
    huy.addEventListener('click', () => { choNhap = null; ctx.ve(); });
    khoi.append(el('p', { class: 'canh-bao' }, `File có hồ sơ: ${ds.map((h) => h.ten).join(', ')}.`),
      el('div', { class: 'nut-hang' }, thay, huy));
  }
  return khoi;
}

export function veCuaToi(ctx: CuaToi): HTMLElement {
  // Ho so cua toi = phan tu dau. Phan tu sau (ban truoc cho them nhieu nguoi, hay file cu) giu nguyen, chua hien — dot 9.
  const [toi, ...conLai] = ctx.kho.hoSo;
  if (toi === undefined || dangSuaToi) {
    const luu = (hs: HoSo): string | null => {
      const loi = ctx.doiHoSo([hs, ...conLai]);
      if (loi === null) { dangSuaToi = false; ctx.ve(); }
      return loi;
    };
    const huy = toi === undefined ? null : (): void => { dangSuaToi = false; ctx.ve(); };
    return el('div', {}, form('Hồ sơ của tôi', 'Lưu', 'Tôi', toi ?? null, luu, huy), khoiSaoLuu(ctx));
  }
  const sua = el('button', { type: 'button' }, 'Sửa');
  sua.addEventListener('click', () => { dangSuaToi = true; ctx.ve(); });
  const xoa = el('button', { type: 'button', class: 'nguy' }, 'Xoá');
  xoa.addEventListener('click', () => {
    if (!confirm('Xoá hồ sơ của tôi? Không lấy lại được nếu chưa sao lưu.')) return;
    const loi = ctx.doiHoSo(conLai);
    if (loi !== null) ctx.bao(loi);
    ctx.ve();
  });
  return el('div', {}, theHoSo(toi, sua, xoa), khoiSaoLuu(ctx));
}

export function veTraCuu(ve: () => void): HTMLElement {
  const tra = (hs: HoSo): null => { daTra = hs; ve(); return null; };
  const ketQua: HTMLElement[] = [];
  if (daTra !== null) {
    const d = homNay7();
    ketQua.push(theHoSo(daTra), el('section', { class: 'the' }, el('h2', {}, 'Hôm nay với người này'), dongTheoTuoi(daTra, xemNgay(d), d)));
  }
  return el('div', {}, ...ketQua, form('Tra cứu cho bất kỳ ai', 'Xem', 'Người tra cứu', daTra, tra, null),
    el('p', { class: 'ghi-chu' }, 'Tra cứu không lưu vào máy: đóng app là mất.'));
}
