/**
 * Hai the dung chung form nhap ngay gio sinh (duong hoac am) va the ket qua:
 *   - "Cua toi": MOT ho so duy nhat cua anh, luu trong may + xuat/nhap file sao luu. App dua vao no de tu tinh moi ngay.
 *   - "Tra cuu": nhap bat ky ai, ra ket qua ngay, KHONG luu (anh chot 19/10; luu them nguoi khac de dot 9).
 */
import { amSangDuong, dinhDangAm, dinhDangNgay, soNgay, thu, type NgayAm, type NgayDuong } from '../loi/amLich.ts';
import { kiemHoSo, tuoiMu, type GioiTinh, type HoSo } from '../loi/hoSo.ts';
import { xemNgay } from '../loi/homNay.ts';
import { docGioGo, docNgayGo, khungGio, noiSinhChac, timNoiSinh } from '../loi/nhap.ts';
import { NUOC_NGOAI } from '../loi/tinh.ts';
import { docFile, type Kho } from '../luuTru.ts';
import { el, homNay7, isoNgay, moTaKhac, tinh } from './chung.ts';
import { dongTheoTuoi } from './homNay.ts';
import { CAC_KHOI } from './khoi/index.ts';

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

/** The ket qua + cac khoi mon (bat tu, nam nay…). Khoi nao loi thi chi khoi do bao loi, cac khoi khac van hien. */
function theHoSo(hs: HoSo, ...nut: HTMLElement[]): HTMLElement {
  const noi = hs.noiSinh === NUOC_NGOAI ? `nước ngoài (${hs.muiGio ?? '?'})` : hs.noiSinh;
  const [nam, thang, ngay] = hs.ngaySinh.split('-').map(Number);
  const dau = el('div', { class: 'ten' }, `${hs.ten} (${hs.gioiTinh === 'nam' ? 'nam' : 'nữ'})`);
  const duong = el('p', {}, `Dương lịch ${dinhDangNgay({ nam: nam ?? 0, thang: thang ?? 0, ngay: ngay ?? 0 })} ${hs.gioSinh ?? '(không rõ giờ)'} · ${noi}`);
  const the = el('section', { class: 'the' }, dau, duong);
  const khoiMon: HTMLElement[] = [];
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
    for (const ve of CAC_KHOI) {
      try {
        khoiMon.push(ve(hs, r, homNay7()));
      } catch (e) {
        khoiMon.push(el('p', { class: 'loi' }, `Một phần không tính được: ${loiCua(e)}`));
      }
    }
  } catch (e) {
    the.append(el('p', { class: 'loi' }, `Không tính được: ${loiCua(e)}`));
  }
  if (nut.length > 0) the.append(el('div', { class: 'nut-hang' }, ...nut));
  return el('div', {}, the, ...khoiMon);
}

const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const NGAY_DAU = soNgay({ nam: 1900, thang: 2, ngay: 1 });
const NGAY_CUOI = soNgay({ nam: 2100, thang: 12, ngay: 31 });
const hai = (n: number): string => String(n).padStart(2, '0');

const dongXem = (): HTMLElement => el('p', { class: 'xem-truoc', 'aria-live': 'polite' });
const dat = (p: HTMLElement, chu: string, laLoi = false): void => {
  p.textContent = chu;
  p.classList.toggle('loi', laLoi);
};

/**
 * Hang nut goi y + dong "= ten da chon" duoi mot o go. Chi bam nut moi dien chu vao o (khong sua chu dang go).
 * Nut chi ve lai khi danh sach doi: bam nut luc bo go con dang ghep chu thi 'compositionend' ban truoc 'click',
 * ve lai luc do la mat cu bam.
 */
function goiY(o: HTMLInputElement, tim: (s: string) => readonly string[], chac: (s: string) => string | null,
  khongThay: string, doi: () => void = () => undefined): HTMLElement[] {
  const hang = el('div', { class: 'goi-y' });
  const xem = dongXem();
  let dangHien = '';
  const capNhat = (): void => {
    const chon = chac(o.value);
    const ds = o.value === chon ? [] : tim(o.value);
    if (ds.join('|') !== dangHien) {
      dangHien = ds.join('|');
      hang.replaceChildren(...ds.map((t) => {
        const n = el('button', { type: 'button' }, t);
        n.addEventListener('click', () => { o.value = t; capNhat(); });
        return n;
      }));
    }
    const khong = chon === null && ds.length === 0 && o.value.trim() !== '';
    dat(xem, chon !== null ? `= ${chon}` : khong ? khongThay : '', khong);
    doi();
  };
  o.addEventListener('input', capNhat);
  o.addEventListener('compositionend', capNhat);
  capNhat();
  return [hang, xem];
}

/** `xong` nhan ho so da kiem va da tinh thu; tra loi (tieng Viet) neu khong xong. */
function form(tieuDe: string, nutXong: string, tenMacDinh: string, cu: HoSo | null,
  xong: (hs: HoSo) => string | null, huy: (() => void) | null): HTMLElement {
  const ten = el('input', { type: 'text', maxlength: '60', autocomplete: 'off', enterkeyhint: 'next', placeholder: tenMacDinh, value: cu?.ten ?? '' });

  let gioiTinh: GioiTinh = cu?.gioiTinh ?? 'nam';
  const nutGioi = (['nam', 'nu'] as const).map((g) => {
    const n = el('button', { type: 'button', 'aria-pressed': String(g === gioiTinh) }, g === 'nam' ? 'Nam' : 'Nữ');
    n.addEventListener('click', () => {
      gioiTinh = g;
      for (const b of nutGioi) b.setAttribute('aria-pressed', String(b === n));
    });
    return n;
  });

  // Ngay, gio: o chu + ban phim so; chi doc chu go roi hien dong "= …" ngay duoi.
  const oNgay = el('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', enterkeyhint: 'next',
    placeholder: 'vd 15031985 hoặc 15/03/1985', value: cu === null ? '' : cu.ngaySinh.split('-').reverse().join('/') });
  const laAm = el('input', { type: 'checkbox' });
  const nhuan = el('input', { type: 'checkbox' });
  const oNhuan = el('label', { hidden: '' }, nhuan, ' Tháng nhuận');
  const dongNgay = dongXem();
  const docNgaySinh = (): { d: NgayDuong; a: NgayAm | null } => {
    const r = docNgayGo(oNgay.value, homNay7().nam);
    if ('loi' in r) throw new Error(r.loi);
    const a = laAm.checked ? { ...r, nhuan: nhuan.checked } : null;
    const d = a === null ? r : amSangDuong(a);
    if (soNgay(d) < NGAY_DAU || soNgay(d) > NGAY_CUOI) throw new Error('Ngày sinh cần từ 01/02/1900 tới 31/12/2100');
    return { d, a };
  };
  const capNhatNgay = (): void => {
    oNhuan.hidden = !laAm.checked;
    if (oNgay.value.trim() === '') {
      dat(dongNgay, '');
      return;
    }
    try {
      const { d, a } = docNgaySinh();
      let chu = a === null ? `= ${THU[thu(d)] ?? ''}, ${dinhDangNgay(d)}` : `= âm ${dinhDangAm(a)} → dương ${dinhDangNgay(d)}`;
      // Truoc 1976 nhieu lich in theo gio +8 (QUY_UOC muc 7): ngay am nho theo lich do co the lech.
      if (a !== null && a.nam < 1976) {
        try {
          const d8 = amSangDuong(a, 8);
          if (isoNgay(d8) !== isoNgay(d)) chu += `. Lịch thời đó có thể theo giờ +8: ngày dương có thể là ${dinhDangNgay(d8)} — nếu biết ngày dương thì nhập ngày dương.`;
        } catch {
          chu += '. Lịch giờ +8 thời đó không có ngày âm này.';
        }
      }
      dat(dongNgay, chu);
    } catch (e) {
      dat(dongNgay, loiCua(e), true);
    }
  };
  oNgay.addEventListener('input', capNhatNgay);
  oNgay.addEventListener('compositionend', capNhatNgay);
  for (const o of [laAm, nhuan]) o.addEventListener('change', capNhatNgay);
  capNhatNgay();

  const oGio = el('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', enterkeyhint: 'next',
    placeholder: 'vd 1430 hoặc 7h30', value: cu?.gioSinh ?? '' });
  const dongGio = dongXem();
  const capNhatGio = (): void => {
    const g = docGioGo(oGio.value);
    if (g === null) dat(dongGio, '= không rõ giờ');
    else if ('loi' in g) dat(dongGio, g.loi, true);
    else dat(dongGio, `= ${hai(g.gio)}:${hai(g.phut)} · giờ ${khungGio(g.gio, g.phut)}`);
  };
  oGio.addEventListener('input', capNhatGio);
  oGio.addEventListener('compositionend', capNhatGio);
  capNhatGio();

  // Go khong dau, viet tat: tat sua chu, viet hoa tu dong cua iPhone ("sg" thanh "so").
  const kieuGo = { type: 'text', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'none', spellcheck: 'false' };
  const mui = Intl.supportedValuesOf('timeZone');
  const khoaMui = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, '_');
  const oMui = el('input', { ...kieuGo, placeholder: 'tên thành phố, vd Paris, Tokyo', value: cu?.muiGio ?? '' });
  const muiChac = (s: string): string | null => mui.find((z) => z.toLowerCase() === khoaMui(s)) ?? null;
  const khoiMui = el('div', { class: 'cot' }, el('label', { class: 'nhan-o' }, 'Múi giờ nơi sinh', oMui),
    ...goiY(oMui, (s) => (khoaMui(s) === '' ? [] : mui.filter((z) => z.toLowerCase().includes(khoaMui(s))).slice(0, 6)),
      muiChac, 'Không thấy múi giờ này: gõ tên thành phố bằng tiếng Anh, vd Paris'));
  const oNoi = el('input', { ...kieuGo, placeholder: 'vd ha noi, hcm, sai gon', value: cu?.noiSinh ?? '' });
  const khoiNoi = el('div', { class: 'cot' }, el('label', { class: 'nhan-o' }, 'Nơi sinh (tên tỉnh lúc sinh)', oNoi),
    ...goiY(oNoi, timNoiSinh, noiSinhChac, 'Không thấy tỉnh nào: gõ tên tỉnh lúc sinh, vd ha noi, hcm, sg',
      () => { khoiMui.hidden = noiSinhChac(oNoi.value) !== NUOC_NGOAI; }));

  const loi = el('p', { class: 'loi', role: 'alert' });
  const nutHuy = huy === null ? null : el('button', { type: 'button' }, 'Huỷ');
  nutHuy?.addEventListener('click', () => { huy?.(); });

  const f = el('form', { class: 'the form' },
    el('h2', {}, tieuDe),
    el('label', { class: 'cot' }, 'Tên gọi (không bắt buộc)', ten),
    el('div', { class: 'cot' }, el('span', {}, 'Giới tính'), el('div', { class: 'nut-doi', role: 'group', 'aria-label': 'Giới tính' }, ...nutGioi)),
    el('div', { class: 'cot' }, el('label', { class: 'nhan-o' }, 'Ngày sinh', oNgay), dongNgay,
      el('div', { class: 'hang-chon' }, el('label', {}, laAm, ' Ngày âm lịch'), oNhuan)),
    el('div', { class: 'cot' }, el('label', { class: 'nhan-o' }, 'Giờ sinh (giờ đồng hồ lúc đó, không rõ thì để trống)', oGio), dongGio),
    khoiNoi, khoiMui, loi, el('div', { class: 'nut-hang' }, el('button', { type: 'submit', class: 'chinh' }, nutXong), nutHuy),
  );
  // Loi cu con hien trong khi dong xem truoc da bao dung thi de hieu nham: go lai la xoa.
  f.addEventListener('input', () => { loi.textContent = ''; });
  // Enter o o chua phai cuoi thi sang o sau (enterkeyhint=next); o cuoi de trinh duyet gui form.
  f.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' || ev.isComposing) return;
    const ds = [ten, oNgay, oGio, oNoi, oMui].filter((o) => o.closest('[hidden]') === null);
    const i = ds.findIndex((o) => o === ev.target);
    const sau = ds[i + 1];
    if (i < 0 || sau === undefined) return;
    ev.preventDefault();
    sau.focus();
  });
  f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    try {
      const { d } = docNgaySinh();
      const g = docGioGo(oGio.value);
      if (g !== null && 'loi' in g) throw new Error(g.loi);
      const noiSinh = noiSinhChac(oNoi.value);
      if (noiSinh === null) throw new Error('Chưa chọn nơi sinh: gõ vài chữ (vd ha noi, hcm) rồi bấm một tỉnh gợi ý');
      const muiGio = muiChac(oMui.value);
      if (noiSinh === NUOC_NGOAI && muiGio === null) throw new Error('Chưa chọn múi giờ nơi sinh: gõ tên thành phố rồi bấm một gợi ý');
      const hs = kiemHoSo({
        id: cu?.id ?? crypto.randomUUID(), ten: ten.value.trim() === '' ? tenMacDinh : ten.value, gioiTinh,
        ngaySinh: isoNgay(d), gioSinh: g === null ? null : `${hai(g.gio)}:${hai(g.phut)}`, noiSinh,
        ...(noiSinh === NUOC_NGOAI ? { muiGio } : {}),
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
