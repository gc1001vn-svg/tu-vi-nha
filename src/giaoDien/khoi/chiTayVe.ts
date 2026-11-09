/**
 * Noi dung khoi "Chi tay" (nap luoi tu `chiTay.ts`): chup anh long ban tay → may tu do 4 duong ngay trong may (`chiTayMp.ts`, MediaPipe)
 * → ve duong len anh, hien "May do duoc" tung muc (doan cua may; muc sat ranh ghi "may chua chac") → quy luat tung muc kem muc tin
 * (`src/loi/chiTay.ts`) → khoi AI dien giai, du doan (Groq; chi doc ket qua may + luat). Khong con bang tu chon o: anh 09/11 "bo che do
 * lam bang tay di. sao ma co kien thuc de dien tay duoc" (ke hoach `2026-11-09-khong-nhan-tay-bo-tu-chon.md`).
 */
import { CAC_DUONG, DOAN_CHUONG, GIAI, KHUNG, type KhungChiTay, type Luat } from '../../loi/chiTay.ts';
import { luanTay } from '../../loi/chiTayLuan.ts';
import type { GioiTinh } from '../../loi/hoSo.ts';
import { CHON, noiGonTuLuan } from '../../loi/noiGonMon.ts';
import { THUAT_NGU_TAY } from '../../loi/thuatNgu.ts';
import { el, khoiNap } from '../chung.ts';
import { giaiThuatNgu, hopNoiGon, veLuan } from './deHieu.ts';
import './chiTay.css';

/** Hinh mau ban tay phai nhin long ban tay (ngon cai ben phai); tay trai thi lat guong bang CSS. Mau trung chu chu thich. */
const HINH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 250"><g fill="#f3d9c4" stroke="#8a6a55" stroke-width="2">
<rect x="44" y="40" width="22" height="72" rx="11"/><rect x="70" y="18" width="24" height="92" rx="12"/>
<rect x="98" y="8" width="24" height="102" rx="12"/><rect x="126" y="22" width="24" height="88" rx="12"/>
<rect x="166" y="104" width="28" height="86" rx="14" transform="rotate(32 180 147)"/>
<path d="M40 100 Q36 230 70 242 L140 242 Q168 222 166 150 L160 100 Z"/></g>
<g fill="none" stroke-width="4" stroke-linecap="round"><path d="M42 128 Q95 140 140 112" stroke="#d33"/>
<path d="M152 138 Q110 152 58 172" stroke="#27c"/><path d="M152 140 Q108 180 122 238" stroke="#2a2"/>
<path d="M100 238 L108 112" stroke="#a3c"/></g></svg>`;

const MAU: readonly [string, string][] = [['#d33', 'đường tình'], ['#27c', 'đường trí'], ['#2a2', 'đường đời'], ['#a3c', 'đường sự nghiệp']];

/** O (khoa "simian", "duong.o") ma ban chac (`khung`) de trong vi sat ranh nhung may van doan (`doan`) — "may chua chac". */
function oChuaChac(khung: KhungChiTay, doan: KhungChiTay): string[] {
  const ra = khung.simian === null && doan.simian !== null ? ['simian'] : [];
  for (const d of CAC_DUONG) {
    const c = khung.duong[d] as Readonly<Record<string, unknown>>, g = doan.duong[d] as Readonly<Record<string, unknown>>;
    for (const o of Object.keys(KHUNG[d])) if (c[o] === null && g[o] !== null && g[o] !== undefined) ra.push(`${d}.${o}`);
  }
  return ra;
}

/** "May do duoc": tung muc theo doan cua may, muc sat ranh ghi "may chua chac"; `keoTin`: canh bao ca ket qua (bo qua chan, anh sat). */
function veMayDo(k: KhungChiTay, chuaChac: readonly string[], keoTin: readonly string[]): HTMLElement[] {
  const ngo = (t: string): Node[] => (chuaChac.includes(t) ? [el('span', { class: 'chua-chac' }, ' (máy chưa chắc)')] : []);
  const dong = CAC_DUONG.map((d) => {
    const g = GIAI[d] as unknown as { ten: string; o: Record<string, { nhan: string; gia: Record<string, Luat> }> };
    const doc = k.duong[d] as Readonly<Record<string, string | boolean | null>>;
    const cac = Object.keys(KHUNG[d]).filter((o) => (o === 'seen' || doc['seen'] !== 'none') && doc[o] !== null && doc[o] !== undefined);
    return el('li', {}, el('b', {}, `${g.ten}: `), ...cac.flatMap((o, i) => [...(i > 0 ? ['; '] : []),
      `${g.o[o]?.nhan ?? o} — ${g.o[o]?.gia[String(doc[o])]?.nhan ?? String(doc[o])}`, ...ngo(`${d}.${o}`)]), '.');
  });
  return [el('h3', {}, 'Máy dò được'), ...keoTin.map((t) => el('p', { class: 'loi' }, t)),
    el('ul', {}, el('li', {}, el('b', {}, 'Chỉ tay ngang: '), k.simian === null ? 'máy không xác định' : DOAN_CHUONG[k.simian ? 'true' : 'false'].nhan,
      ...ngo('simian'), '.'), ...dong),
    ...(chuaChac.length === 0 ? [] : [el('p', { class: 'ghi-chu' }, 'Mục ghi "máy chưa chắc": số đo nằm sát ranh giữa hai mức, máy chọn mức '
      + 'gần hơn — kém tin hơn các mục khác; lời giải và AI bên dưới vẫn dùng mức máy chọn.')])];
}

function veKetQua(k: KhungChiTay, gioiTinh: GioiTinh, chuaChac: readonly string[]): Node[] {
  const luan = luanTay(k), ng = noiGonTuLuan(luan, CHON.tay);
  const ra: Node[] = [
    hopNoiGon(ng.cau),
    el('h3', {}, 'Lời giải'),
    ...veLuan(luan, ng.dung),
    el('p', { class: 'ghi-chu' }, 'Lời giải do Claude soạn lại từ sách tướng tay ghi trong ngoặc cuối mỗi câu: "theo …" là sách nói đúng ý '
      + 'đó, "ghép ý …" là sách nói từng phần, app ghép lại cho bàn tay này. Chỉ để tham khảo.'),
    // Nap thang phien.ts, khong qua `khoiAI`: file nap luoi nay nhap ai/index.ts thi Vite tach goi mo app thanh 4 file (do 28/10).
    khoiNap('AI diễn giải và dự đoán (Groq, miễn phí)', 'ai',
      () => import('../ai/phien.ts').then((m) => m.vePhien(`chiTay:${gioiTinh}:${JSON.stringify(k)}:${chuaChac.join(',')}`,
        { loai: 'chiTay', k, gioiTinh, chuaChac }))),
    el('p', { class: 'ghi-chu' }, 'AI chỉ diễn giải kết quả máy dò và luật app tra, không xem ảnh.'),
  ];
  giaiThuatNgu(ra, THUAT_NGU_TAY);
  return ra;
}

/** Nhac duoi anh may do — so do: QUY_UOC muc 27, 45–49. */
const DO_SAI = 'Máy dò chấm thử trên 7 ảnh mạng (ít ảnh — chưa bảo đảm mọi bàn tay): 2 ảnh có đáp án thì cả 5 đường đánh dấu đều vẽ '
  + 'đúng; chụp lại (xoay, xa gần, sáng tối) giữ ~9/10 kết quả. Soi ảnh: đường màu nào lệch khỏi nếp tay thì kết quả của đường đó kém tin '
  + '— chụp lại cho rõ, thẳng.';

export function veChiTay(gioiTinh: GioiTinh): Node[] {
  const ket = el('div', { 'aria-live': 'polite' });
  // Chup anh → may tu do (nap luoi `chiTayMp.ts`, MediaPipe) → ve duong len anh, hien ket qua may do + loi giai.
  const anhKet = el('div', { 'aria-live': 'polite' });
  const chonAnh = el('input', { type: 'file', accept: 'image/*', hidden: '' });
  const nutAnh = el('button', { type: 'button', class: 'chinh' }, 'Chụp hoặc chọn ảnh lòng bàn tay — máy tự dò');
  nutAnh.addEventListener('click', () => { chonAnh.click(); });
  /** Do anh `f`; `boQua`: nut "Van do thu" — do ca khi buoc chan mem (chup cheo, mu tay) le ra chan, ket qua ghi kem tin (ke hoach
   * `2026-11-09-anh-thang-van-bi-chan.md`). */
  const chay = (f: File, boQua: boolean): void => {
    nutAnh.disabled = true;
    ket.replaceChildren();
    anhKet.replaceChildren(el('p', { class: 'ghi-chu' }, 'Đang tải thư viện tìm bàn tay (lần đầu khoảng 21 MB)…'));
    import('./chiTayMp.ts')
      .then((m) => m.doAnhTay(f, () => { anhKet.replaceChildren(el('p', { class: 'ghi-chu' }, 'Đang dò…')); }, gioiTinh, boQua))
      .then((k) => {
        anhKet.replaceChildren(el('img', { class: 'anh-do', src: k.anh, alt: 'Ảnh tay, các đường máy dò được tô màu theo hình mẫu' }),
          ...(k.nhac === undefined ? [] : [el('p', { class: 'canh-bao' }, k.nhac)]), el('p', { class: 'canh-bao' }, DO_SAI));
        const keoTin = [
          ...(k.boQua === undefined ? [] : [`Đã dò bỏ qua bước chặn (${k.boQua}): đường có thể lệch — soi kỹ từng đường trên ảnh; mọi kết quả `
            + 'dưới đây kém tin.']),
          ...(k.sat === undefined ? [] : ['Ảnh chụp sát (ngón hoặc cổ tay bị cắt): máy phải thu nhỏ ảnh mới thấy tay — kết quả kém tin. Nên '
            + 'chụp lại cho cả bàn tay nằm trọn trong khung.']),
        ];
        const chuaChac = oChuaChac(k.khung, k.doan);
        ket.replaceChildren(...veMayDo(k.doan, chuaChac, keoTin), ...veKetQua(k.doan, gioiTinh, chuaChac));
      }, (e: unknown) => {
        // Loi sau khi da doc duoc anh (`LoiCoAnh` trong chiTayMp.ts — khong import tinh de khoi keo MediaPipe vao goi chinh): van hien
        // anh (anh bao 08/11); chan mem thi them dong chi tiet + nut "Van do thu" (09/11).
        const loi = e instanceof Error ? e : new Error(String(e));
        const anh = 'anh' in loi && typeof loi.anh === 'string' ? loi.anh : undefined;
        const chiTiet = 'chiTiet' in loi && typeof loi.chiTiet === 'string' ? loi.chiTiet : undefined;
        const nutThu = 'doThu' in loi && loi.doThu === true ? el('button', { type: 'button' }, 'Vẫn dò thử (bỏ qua bước chặn)') : null;
        nutThu?.addEventListener('click', () => { chay(f, true); });
        anhKet.replaceChildren(...(anh === undefined ? [] : [el('img', { class: 'anh-do', src: anh, alt: 'Ảnh vừa chụp — máy chưa dò được, chưa vẽ đường' })]),
          el('p', { class: 'loi' }, loi.message),
          ...(chiTiet === undefined ? [] : [el('p', { class: 'ghi-chu' }, `Chi tiết để báo lỗi: ${chiTiet}.`)]),
          ...(nutThu === null ? [] : [nutThu]),
          ...(anh === undefined ? [] : [el('p', { class: 'ghi-chu' }, 'Máy chưa dò được ảnh này. Chụp lại theo lời nhắc'
            + (nutThu === null ? '.' : ', hoặc bấm "Vẫn dò thử" (máy vẫn dò, kết quả kém tin).'))]));
      })
      .finally(() => { nutAnh.disabled = false; });
  };
  chonAnh.addEventListener('change', () => {
    const f = chonAnh.files?.[0];
    chonAnh.value = ''; // chon lai dung anh cu van chay
    if (f === undefined) return;
    chay(f, false);
  });
  const hinh = el('img', { class: 'hinh', alt: 'Hình mẫu: bốn đường chính trên lòng bàn tay',
    src: `data:image/svg+xml,${encodeURIComponent(HINH)}`, ...(gioiTinh === 'nam' ? { style: 'transform: scaleX(-1)' } : {}) });
  return [
    el('p', { class: 'ghi-chu' }, `Xem tay ${gioiTinh === 'nam' ? 'trái' : 'phải'} (nam tả nữ hữu — cách xem phổ biến ở Việt Nam; sách Tây `
      + 'xem cả hai tay). Chụp lòng bàn tay — máy dò 4 đường ngay trong máy (ảnh không gửi đi, không lưu), tô màu lên ảnh rồi giải từng '
      + 'mục. Cách chụp: đặt bàn tay ngửa trên mặt bàn, xoè thẳng các ngón, cầm máy ngay phía trên, song song mặt bàn; cả bàn tay nằm '
      + 'trọn trong khung (đủ 5 ngón và cổ tay); đủ sáng, không bóng loá.'),
    el('div', { class: 'nut-hang' }, nutAnh), chonAnh, anhKet,
    hinh,
    el('p', { class: 'chu-thich' }, ...MAU.flatMap(([m, t], i) => [...(i > 0 ? [' · '] : []), el('span', { style: `color: ${m}` }, `● ${t}`)])),
    ket,
  ];
}
