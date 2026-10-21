/**
 * The "Phong thuy" (dot 5): la ban (`src/loi/laBan.ts`) + huong do tot/xau theo cung phi (`batTrach`), luu huong nha.
 * iPhone: xin quyen cam bien NGAY trong luc bam, khong `await` gi truoc (WebKit 269706 tu choi ma khong hoi).
 * Bi tu choi, hay may khong gui so (may tinh, Android chua lam) thi go so do tay. QUY_UOC muc 20.
 */
import { batTrach } from '../loi/batTrach.ts';
import { tenCungPhi, type GioiTinh, type HoSo } from '../loi/hoSo.ts';
import { xemLaBan, type Phuong } from '../loi/laBan.ts';
import { xemLoBan, type DoanCung } from '../loi/loBan.ts';
import { docSoDoGo } from '../loi/nhap.ts';
import { phiTinh, type Ban, type HuongKy, type O } from '../loi/phiTinh.ts';
import { el, homNay7, khoi, tinh } from './chung.ts';
import { dongMuc, LOI_SOAN } from './khoi/namNay.ts';

export interface PhongThuy {
  readonly toi: HoSo | undefined;
  /** Ghi huong nha vao ho so cua toi; tra loi neu khong ghi duoc. */
  luuHuong(doNha: number): string | null;
}

type SuKien = DeviceOrientationEvent & { readonly webkitCompassHeading?: number; readonly webkitCompassAccuracy?: number };
type XinQuyen = { requestPermission?: () => Promise<string> };

/** Sai so may bao quá muc nay (hay -1 = chua hieu chinh) thi khong ket luan tot/xau (ke hoach dot 5). */
const SAI_SO_TOI_DA = 15;
const NGHIENG_TOI_DA = 25;
const CHO_MS = 3000;

const soDo = (d: number): string => `${String(Math.round(d) % 360)}°`;

function veLaBan(ctx: PhongThuy): HTMLElement {
  let cungHoSo: string | undefined;
  try { cungHoSo = ctx.toi === undefined ? undefined : tinh(ctx.toi).chinh.cungPhi; } catch { cungHoSo = undefined; }
  let gioi: GioiTinh = ctx.toi?.gioiTinh ?? 'nam';
  let doHienTai: number | null = ctx.toi?.huongNha ?? null;
  let dangNghe = false;
  let giu = false;

  const trangThai = el('p', { class: 'canh-bao', 'aria-live': 'polite' });
  const mat = el('div', { class: 'mat' }, ...['B', 'Đ', 'N', 'T'].map((c, i) => el('span', { class: `chu-${String(i)}` }, c)));
  const chuDo = el('div', { class: 'so-do' }, doHienTai === null ? '—' : soDo(doHienTai));
  const nutBat = el('button', { type: 'button', class: 'chinh' }, 'Bật la bàn');
  const oDo = el('input', { type: 'text', inputmode: 'numeric', maxlength: '3', autocomplete: 'off', placeholder: 'vd 135',
    'aria-label': 'Số độ' });
  const oNam = el('input', { type: 'text', inputmode: 'numeric', maxlength: '4', autocomplete: 'off', placeholder: 'vd 1987' });
  const nutGioi = (['nam', 'nu'] as const).map((g) => {
    const n = el('button', { type: 'button', 'aria-pressed': String(g === gioi) }, g === 'nam' ? 'Nam' : 'Nữ');
    n.addEventListener('click', () => {
      gioi = g;
      for (const b of nutGioi) b.setAttribute('aria-pressed', String(b === n));
      veKetQua(null, false);
    });
    return n;
  });
  const ketQua = el('div', { 'aria-live': 'polite' });
  const pt = phiTinh(homNay7());
  const ky = (p: Phuong, phia: string): HTMLElement | null => {
    const ten = pt.ky.filter((k) => (k.son === undefined ? k.huong === p.huong : k.son.includes(p.son))).map((k) => k.ten);
    return ten.length === 0 ? null : el('p', { class: 'canh-bao' },
      `Năm ${pt.canChiNam}: ${phia} (${p.huong}, sơn ${p.son}) có ${ten.join(', ')} — tránh động thổ, sửa lớn phía này.`);
  };

  const veKetQua = (saiSo: number | null, nghieng: boolean): void => {
    if (doHienTai === null) { ketQua.replaceChildren(); return; }
    const x = xemLaBan(doHienTai);
    const so = Number(oNam.value.trim());
    const namSai = oNam.value.trim() !== '' && !(Number.isInteger(so) && so >= 1900 && so <= 2100);
    const cung = oNam.value.trim() !== '' && !namSai ? tenCungPhi(so, gioi) : cungHoSo;
    const nguon = cung === cungHoSo && oNam.value.trim() === '' ? 'theo hồ sơ của tôi' : `năm ${String(so)}, ${gioi === 'nam' ? 'nam' : 'nữ'}`;
    const chuaChac = saiSo !== null && (saiSo < 0 || saiSo > SAI_SO_TOI_DA);
    const bt = cung === undefined ? undefined : batTrach(cung);
    const sao = bt?.huong.find((h) => h.huong === x.huong.huong);
    const ke = x.satRanh;
    ketQua.replaceChildren(el('div', {},
      el('p', {}, `Hướng ${soDo(x.huong.do)}: sơn ${x.huong.son}, hướng ${x.huong.huong} (quẻ ${x.huong.quai}). `
        + `Tọa ${soDo(x.toa.do)}: sơn ${x.toa.son}, ${x.toa.huong}. Gọi là tọa ${x.toa.son} hướng ${x.huong.son}.`),
      ke === null ? null : el('p', { class: 'canh-bao' }, `Cách ranh sơn ${ke.ke.son} ${ke.cach.toFixed(1).replace('.', ',')}°`
        + (ke.ke.huong === x.huong.huong ? '' : ` (sang hướng ${ke.ke.huong})`) + ': điện thoại sai vài độ là đổi sơn — đo lại vài chỗ.'),
      ky(x.huong, 'phía trước'), ky(x.toa, 'phía sau lưng'),
      nghieng ? el('p', { class: 'canh-bao' }, 'Máy đang nghiêng: đặt nằm phẳng trên lòng bàn tay, đầu máy chỉ thẳng ra ngoài.') : null,
      chuaChac ? el('p', { class: 'canh-bao' }, `La bàn máy đang sai ${saiSo < 0 ? 'chưa rõ bao nhiêu' : `±${String(Math.round(saiSo))}°`}: `
        + 'chưa kết luận. Cầm máy vẽ hình số 8 vài lần, ra xa sắt thép rồi đo lại.') : null,
      namSai ? el('p', { class: 'loi' }, 'Năm sinh cần từ 1900 tới 2100.') : null,
      bt === undefined || sao === undefined || chuaChac ? null : el('p', {}, `Cung phi ${cung ?? ''} (${nguon}, ${bt.nhom}):`),
      bt === undefined || sao === undefined || chuaChac ? null
        : dongMuc(x.huong.huong, { ten: sao.sao, mucDo: sao.tot ? 'tot' : 'xau', nghia: sao.nghia }),
      cung === undefined ? el('p', { class: 'ghi-chu' }, 'Chưa có hồ sơ: gõ năm sinh bên dưới để xem hướng này hợp hay không.') : null,
      ctx.toi === undefined || chuaChac ? null : el('div', { class: 'nut-hang' }, nutLuu),
    ));
  };
  const nutLuu = el('button', { type: 'button' }, 'Lưu làm hướng nhà');
  nutLuu.addEventListener('click', () => {
    if (doHienTai === null) return;
    const d = Math.round(doHienTai) % 360;
    trangThai.textContent = ctx.luuHuong(d) ?? `Đã lưu hướng nhà ${String(d)}° (${xemLaBan(d).huong.huong}) vào hồ sơ.`;
  });

  const datDo = (d: number, saiSo: number | null, nghieng: boolean): void => {
    doHienTai = ((d % 360) + 360) % 360;
    chuDo.textContent = soDo(doHienTai);
    mat.style.transform = `rotate(${String(-doHienTai)}deg)`;
    veKetQua(saiSo, nghieng);
  };

  const nghe = (ev: Event): void => {
    // The da ve lai (doi the): tu go, khong ton pin.
    if (!mat.isConnected) { removeEventListener('deviceorientation', nghe); return; }
    const e = ev as SuKien;
    if (giu || e.webkitCompassHeading === undefined || e.webkitCompassHeading === null) return;
    const nghieng = Math.abs(e.beta ?? 0) > NGHIENG_TOI_DA || Math.abs(e.gamma ?? 0) > NGHIENG_TOI_DA;
    trangThai.textContent = '';
    datDo(e.webkitCompassHeading, e.webkitCompassAccuracy ?? null, nghieng);
  };

  const batNghe = (): void => {
    dangNghe = true;
    giu = false;
    nutBat.textContent = 'Giữ số này';
    trangThai.textContent = 'Đang đọc la bàn…';
    addEventListener('deviceorientation', nghe);
    const truoc = doHienTai;
    setTimeout(() => {
      if (mat.isConnected && dangNghe && doHienTai === truoc && trangThai.textContent === 'Đang đọc la bàn…') {
        trangThai.textContent = 'Máy chưa gửi số la bàn. Dùng cách gõ số độ bên dưới.';
      }
    }, CHO_MS);
  };

  nutBat.addEventListener('click', () => {
    if (dangNghe) {
      giu = !giu;
      nutBat.textContent = giu ? 'Đo tiếp' : 'Giữ số này';
      return;
    }
    const xin = typeof DeviceOrientationEvent === 'undefined' ? undefined : (DeviceOrientationEvent as unknown as XinQuyen).requestPermission;
    if (typeof xin !== 'function') { batNghe(); return; }
    xin.call(DeviceOrientationEvent).then((kq) => {
      if (kq === 'granted') batNghe();
      // Safari co the nho lan tu choi (NGUON_MO, Defold) — chi bao "thu lai", khong hua se hoi lai.
      else trangThai.textContent = 'Máy không cho đọc la bàn: gõ số độ bên dưới. Muốn thử lại thì đóng hẳn app, mở lại rồi bấm "Bật la bàn".';
    }, (e: unknown) => {
      trangThai.textContent = `Không bật được la bàn (${e instanceof Error ? e.message : String(e)}). Gõ số độ bên dưới.`;
    });
  });

  oDo.addEventListener('input', () => {
    const t = oDo.value.trim();
    const so = Number(t);
    if (t === '') return;
    if (!/^\d{1,3}$/.test(t) || so > 359) { trangThai.textContent = 'Số độ cần từ 0 tới 359.'; return; }
    giu = true;
    if (dangNghe) nutBat.textContent = 'Đo tiếp';
    trangThai.textContent = '';
    datDo(so, null, false);
  });
  oNam.addEventListener('input', () => { veKetQua(null, false); });
  if (doHienTai !== null) datDo(doHienTai, null, false);

  return khoi('La bàn', true,
    ctx.toi?.huongNha === undefined ? null : el('p', {}, `Hướng nhà đã lưu: ${soDo(ctx.toi.huongNha)} (${xemLaBan(ctx.toi.huongNha).huong.huong}).`),
    el('div', { class: 'la-ban' }, mat, el('div', { class: 'kim', 'aria-hidden': 'true' }), chuDo),
    el('div', { class: 'nut-hang' }, nutBat),
    trangThai,
    el('label', { class: 'cot' }, 'Hoặc gõ số độ (đọc ở app La bàn của iPhone)', oDo),
    ketQua,
    el('details', { class: 'giai-nam', ...(cungHoSo === undefined ? { open: '' } : {}) }, el('summary', {}, 'Xem cho người khác'),
      el('label', { class: 'cot' }, 'Năm sinh (sinh trước Lập Xuân, khoảng 4/2 dương lịch, thì lùi một năm)', oNam),
      el('div', { class: 'nut-doi', role: 'group', 'aria-label': 'Giới tính' }, ...nutGioi)),
    el('p', { class: 'ghi-chu' }, 'Cách đo: đứng ở cửa chính, lưng quay vào nhà, nhìn thẳng ra ngoài; cầm máy nằm phẳng, đầu máy chỉ ra '
      + 'ngoài — số độ là hướng nhà, sau lưng là tọa. Đứng xa cửa sắt, cột thép, xe máy. Đo 3 chỗ cách nhau 1 m: ba số lệch nhau quá 5° '
      + 'là có nhiễu, ra xa thêm rồi đo lại. Dùng app La bàn của iPhone thì vào Cài đặt → La bàn, tắt "Dùng phương bắc thực" '
      + '(ở Việt Nam hai cách chỉ lệch nhau dưới 2°). Hướng tốt, xấu theo Bát trạch, cung phi tính theo năm Lập Xuân. '
      + `24 sơn mỗi sơn 15°. ${LOI_SOAN}`));
}

const cmTuMm = (mm: number): string => (mm / 10).toFixed(1).replace('.', ',');
const khoang = (d: DoanCung): string => `${cmTuMm(d.tuMm)}–${cmTuMm(d.denMm)} cm`;

/** App Do cua iPhone sai khoang 1–2 cm (QUY_UOC muc 21): so dan vao cach ranh cung duoi muc nay thi nhac do lai bang thuoc day. */
const SAT_RANH_APP_DO_MM = 20;

function veThuocLoBan(): HTMLElement {
  const o = el('input', { type: 'text', inputmode: 'decimal', maxlength: '40', autocomplete: 'off', placeholder: 'vd 81, 81,5 hoặc 81 cm' });
  const nutDan = el('button', { type: 'button' }, 'Dán từ app Đo');
  const ketQua = el('div', { 'aria-live': 'polite' });
  const bao = (chu: string): void => { ketQua.replaceChildren(el('p', { class: 'loi' }, chu)); };
  let tuAppDo = false;
  const ve = (): void => {
    const r = docSoDoGo(o.value);
    if (r === null) { ketQua.replaceChildren(); return; }
    if ('loi' in r) { bao(r.loi); return; }
    let ds;
    try { ds = xemLoBan(r.cm); } catch (e) { bao(e instanceof Error ? e.message : String(e)); return; }
    const mm = r.cm * 10;
    ketQua.replaceChildren(
      el('p', {}, `= ${String(r.cm).replace('.', ',')} cm`),
      ...ds.map((x) => {
        const cach = Math.min(mm - x.doan.tuMm, x.doan.denMm + 1 - mm);
        return dongMuc(`${x.thuoc.ten} ${String(x.thuoc.dai).replace('.', ',')}`, {
          ten: x.doan.cung.ten, mucDo: x.doan.cung.tot ? 'tot' : 'xau',
          nghia: `${x.doan.cung.nghia} Cung này ${khoang(x.doan)}.`
            + (x.doan.cung.tot ? '' : ` Gần nhất cung tốt: ${[x.totDuoi, x.totTren].filter((d) => d !== undefined)
              .map((d) => `${khoang(d)} (${d.cung.ten})`).join(' hoặc ')}.`)
            + (tuAppDo && cach < SAT_RANH_APP_DO_MM ? ` Chỉ cách ranh cung ${cmTuMm(Math.max(cach, 0))} cm — app Đo có thể sai chừng đó, đo lại bằng thước dây.` : ''),
        });
      }));
  };
  o.addEventListener('input', () => { tuAppDo = false; ve(); });
  // Safari hoi "Dan" ngay tren nut; bi chan thi chi cach dan tay.
  nutDan.addEventListener('click', () => {
    if (navigator.clipboard?.readText === undefined) { bao('Máy không cho đọc chữ đã chép: giữ ngón tay vào ô số đo rồi chọn Dán.'); return; }
    navigator.clipboard.readText().then((chu) => { o.value = chu.trim(); tuAppDo = true; ve(); },
      () => { bao('Máy không cho đọc chữ đã chép: giữ ngón tay vào ô số đo rồi chọn Dán.'); });
  });
  return khoi('Thước Lỗ Ban', false,
    el('label', { class: 'cot' }, 'Số đo (cm)', o),
    el('div', { class: 'nut-hang' }, nutDan),
    ketQua,
    el('p', { class: 'ghi-chu' }, 'Đo bằng app Đo của iPhone: đo xong chạm vào con số → Chép, quay lại đây bấm "Dán từ app Đo". App Đo sai '
      + 'khoảng 1–2 cm, có khi 3–5 %, trong khi cung nhỏ nhất chỉ 3,9 cm: số nào gần ranh cung thì đo lại bằng thước dây. '
      + 'Thước 52,2 cm (thông thủy): khoảng lọt lòng — cửa đi, cửa sổ, ô thoáng, đo trong khung, không tính khung. '
      + 'Thước 42,9 cm (dương trạch): khối đặc — bếp, bệ, bậc, giường, tủ. Thước 38,8 cm (âm phần): đồ thờ, mộ. Các trang ghi công dụng '
      + 'từng thước hơi khác nhau; số dùng cho việc gì thì xem thước đó. Chỉ xét cung lớn: tên cung nhỏ các trang ghi vênh nhau. '
      + `Cung này "a–b cm" là mọi số đo tròn mm nằm trong cung. ${LOI_SOAN}`));
}

// Nam o tren nhu bang phi tinh trong sach (Wikibooks, masterseanchan); o nao cung ghi huong.
const LUOI: readonly O[] = ['Đông Nam', 'Nam', 'Tây Nam', 'Đông', 'Giữa', 'Tây', 'Đông Bắc', 'Bắc', 'Tây Bắc'];

const veLuoi = (b: Ban, ten: string): HTMLElement => el('div', { class: 'luoi-phi-tinh', role: 'img', 'aria-label': `${ten}: `
  + LUOI.map((h) => `${h} ${b.o[h].ten}`).join(', ') },
...LUOI.map((h) => el('div', { class: b.o[h].tot ? 'tot' : 'xau' },
  el('span', { class: 'huong' }, h), el('span', { class: 'so' }, String(b.o[h].so)), el('span', {}, b.o[h].ten))));

const dongKy = (k: HuongKy): HTMLElement => dongMuc(k.ten,
  { ten: k.huong + (k.son === undefined ? '' : ` (sơn ${k.son.join(', ')})`), mucDo: 'xau', nghia: k.nghia });

function vePhiTinh(): HTMLElement {
  const p = phiTinh(homNay7());
  const d = p.tiet.ngay;
  return khoi(`Phi tinh năm ${p.canChiNam}, tháng này`, false,
    el('p', {}, el('b', {}, `Năm ${p.canChiNam}`), ` (đổi năm ở Lập Xuân, khoảng 4/2): ${p.nam.o['Giữa'].ten} vào giữa.`),
    veLuoi(p.nam, `Phi tinh năm ${p.canChiNam}`),
    ...LUOI.map((h) => dongMuc(h, { ten: `${p.nam.o[h].ten} (${p.nam.o[h].tenHuyenKhong})`, mucDo: p.nam.o[h].tot ? 'tot' : 'xau', nghia: p.nam.o[h].nghia })),
    el('p', {}, el('b', {}, 'Hướng kỵ năm nay')), ...p.ky.map(dongKy),
    el('p', {}, el('b', {}, 'Tháng này'), ` (từ tiết ${p.tiet.ten} ${String(d.ngay)}/${String(d.thang)}): ${p.thang.o['Giữa'].ten} vào giữa.`),
    veLuoi(p.thang, 'Phi tinh tháng này'),
    el('p', { class: 'ghi-chu' }, 'Lưới đặt Nam ở trên, Bắc ở dưới như bảng phi tinh trong sách. Đứng giữa nhà: phía nào ứng ô đó. '
      + 'Sao tháng cùng nghĩa sao năm, tác động nhẹ hơn. Tốt/xấu từng sao theo Huyền Không (thư viện lunar); Thái Tuế, Tuế Phá, '
      + `Tam Sát theo chi năm. La bàn ở trên tự báo khi hướng đo trùng hướng kỵ. ${LOI_SOAN}`));
}

export function vePhongThuy(ctx: PhongThuy): HTMLElement {
  return el('div', {}, veLaBan(ctx), veThuocLoBan(), vePhiTinh());
}
