/**
 * The "Ca nha": danh sach ho so, form them/sua (nhap ngay duong hoac am), xuat/nhap file sao luu.
 */
import { amSangDuong, dinhDangAm, dinhDangNgay, type NgayAm } from '../loi/amLich.ts';
import { kiemHoSo, tuoiMu, type HoSo } from '../loi/hoSo.ts';
import { NUOC_NGOAI, TINH } from '../loi/tinh.ts';
import { docFile, type Kho } from '../luuTru.ts';
import { el, homNay7, isoNgay, moTaKhac, tinh } from './chung.ts';

export interface CaNha {
  readonly kho: Kho;
  /** Ghi danh sach moi; tra loi neu khong ghi duoc. */
  doiHoSo(ds: readonly HoSo[]): string | null;
  xuat(): void;
  bao(loi: string): void;
  /** Ve lai ca app (sau khi doi trang thai cuc bo cua the nay). */
  ve(): void;
}

/** `null` = dang xem danh sach; 'moi' = form trong; HoSo = dang sua. */
let dangSua: HoSo | 'moi' | null = null;
let choNhap: HoSo[] | null = null;

export function moForm(hs: HoSo | 'moi'): void {
  dangSua = hs;
}

const loiCua = (e: unknown): string => (e instanceof Error ? e.message : String(e));

function theHoSo(hs: HoSo, ctx: CaNha): HTMLElement {
  const sua = el('button', { type: 'button' }, 'Sửa');
  sua.addEventListener('click', () => { dangSua = hs; ctx.ve(); });
  const xoa = el('button', { type: 'button', class: 'nguy' }, 'Xoá');
  xoa.addEventListener('click', () => {
    if (!confirm(`Xoá hồ sơ "${hs.ten}"? Không lấy lại được nếu chưa sao lưu.`)) return;
    const loi = ctx.doiHoSo(ctx.kho.hoSo.filter((h) => h.id !== hs.id));
    if (loi !== null) ctx.bao(loi);
    ctx.ve();
  });
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
  the.append(el('div', { class: 'nut-hang' }, sua, xoa));
  return the;
}

function form(ctx: CaNha, cu: HoSo | null): HTMLElement {
  const ten = el('input', { type: 'text', maxlength: '60', autocomplete: 'off', value: cu?.ten ?? '' });
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
      // Truoc 1976 nhieu lich in theo gio +8 (QUY_UOC muc 7): nguoi nha nho ngay am theo lich do co the lech.
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
  const luu = el('button', { type: 'submit', class: 'chinh' }, 'Lưu');
  const huy = el('button', { type: 'button' }, 'Huỷ');
  huy.addEventListener('click', () => { dangSua = null; ctx.ve(); });

  const f = el('form', { class: 'the form' },
    el('h2', {}, cu === null ? 'Thêm người nhà' : `Sửa: ${cu.ten}`),
    el('label', { class: 'cot' }, 'Tên gọi', ten),
    el('label', { class: 'cot' }, 'Giới tính', gioiTinh),
    el('div', { class: 'cot' }, el('span', {}, 'Ngày sinh'), el('label', {}, kieuAm, ' Nhập ngày âm'), ngayDuong, khoiAm),
    el('div', { class: 'cot' }, el('label', { class: 'cot' }, 'Giờ sinh (giờ đồng hồ lúc đó)', gio),
      el('label', {}, khongRo, ' Không rõ giờ')),
    el('label', { class: 'cot' }, 'Nơi sinh (tên tỉnh lúc sinh)', noiSinh),
    khoiMui, loi, el('div', { class: 'nut-hang' }, luu, huy),
  );
  f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    try {
      if (!khongRo.checked && gio.value === '') throw new Error('Chưa nhập giờ sinh (hoặc chọn "Không rõ giờ")');
      const ngaySinh = kieuAm.checked ? isoNgay(amSangDuong(docAm())) : ngayDuong.value;
      const hs = kiemHoSo({
        id: cu?.id ?? crypto.randomUUID(), ten: ten.value, gioiTinh: gioiTinh.value, ngaySinh,
        gioSinh: khongRo.checked ? null : gio.value.slice(0, 5), noiSinh: noiSinh.value,
        ...(noiSinh.value === NUOC_NGOAI ? { muiGio: muiGio.value } : {}),
      });
      tinh(hs); // tinh thu truoc khi luu: mui gio la, ngay ngoai bang… bao ngay o day
      const ds = ctx.kho.hoSo;
      const moi = ds.some((h) => h.id === hs.id) ? ds.map((h) => (h.id === hs.id ? hs : h)) : [...ds, hs];
      const loiGhi = ctx.doiHoSo(moi);
      if (loiGhi !== null) throw new Error(loiGhi);
      dangSua = null;
      ctx.ve();
    } catch (e) {
      loi.textContent = loiCua(e);
    }
  });
  return f;
}

function khoiSaoLuu(ctx: CaNha): HTMLElement {
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
    const gop = el('button', { type: 'button', class: 'chinh' }, 'Gộp thêm');
    const thay = el('button', { type: 'button', class: 'nguy' }, 'Thay hết');
    const huy = el('button', { type: 'button' }, 'Huỷ');
    const xong = (moi: readonly HoSo[] | null): void => {
      choNhap = null;
      if (moi !== null) {
        const loi = ctx.doiHoSo(moi);
        ctx.bao(loi ?? `Đã nhập ${String(ds.length)} hồ sơ.`);
      }
      ctx.ve();
    };
    gop.addEventListener('click', () => {
      const trongFile = new Set(ds.map((h) => h.id));
      xong([...ctx.kho.hoSo.filter((h) => !trongFile.has(h.id)), ...ds]); // trung ma: lay ban trong file
    });
    thay.addEventListener('click', () => {
      if (confirm(`Thay toàn bộ ${String(ctx.kho.hoSo.length)} hồ sơ đang có bằng ${String(ds.length)} hồ sơ trong file?`)) xong(ds);
    });
    huy.addEventListener('click', () => { xong(null); });
    khoi.append(el('p', { class: 'canh-bao' }, `File có ${String(ds.length)} hồ sơ: ${ds.map((h) => h.ten).join(', ')}.`),
      el('div', { class: 'nut-hang' }, gop, thay, huy));
  }
  return khoi;
}

export function veCaNha(ctx: CaNha): HTMLElement {
  if (dangSua !== null) return form(ctx, dangSua === 'moi' ? null : dangSua);
  const them = el('button', { type: 'button', class: 'chinh' }, 'Thêm người nhà');
  them.addEventListener('click', () => { dangSua = 'moi'; ctx.ve(); });
  return el('div', {}, ...ctx.kho.hoSo.map((h) => theHoSo(h, ctx)),
    ctx.kho.hoSo.length === 0 ? el('p', {}, 'Chưa có hồ sơ nào.') : null, them, khoiSaoLuu(ctx));
}
