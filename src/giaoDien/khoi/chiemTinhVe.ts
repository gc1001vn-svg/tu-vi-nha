/**
 * Noi dung khoi "Chiem tinh" (nap luoi tu `chiemTinh.ts`): ba diem chinh, banh xe, bang vi tri, loi giai, goc chieu.
 * Loi `src/loi/chiemTinh.ts`, loi giai `src/loi/chiemTinhGiai.ts`, quy uoc `docs/QUY_UOC.md` muc 23.
 */
import { CUNG, CUNG_ANH, DIEM, DIEM_ANH, GOC, chuan, kinhDo, laSo, cungCua, dinhDang, gocChieu, laSoNguoi, nhaCua, type GocChieu, type LaSo } from '../../loi/chiemTinh.ts';
import {
  BAC_GIAO_DIEM, CUNG_MOC, HANH_TINH, MAT_TRANG, MAT_TROI, NGHICH_HANH, NHA, THIEN_DINH, TRANG_QUA_CUNG, TU_KHOA, Y_GOC, Y_TUAN_TRANG,
} from '../../loi/chiemTinhGiai.ts';
import { TUAN_TRANG, gioVN, gocChieuQua, khoangNghich, ngayVN, phutUtcTuMs, trangDoiCung, tuanTrang } from '../../loi/chiemTinhNgay.ts';
import type { HoSo } from '../../loi/hoSo.ts';
import { el } from '../chung.ts';
import { KY_HIEU } from './kyHieu.ts';
import './chiemTinh.css';

const LOI = 'Lời do Claude soạn lại theo quan niệm chiêm tinh phương Tây phổ biến; chỉ để tham khảo.';
const NS = 'http://www.w3.org/2000/svg';

function sv(ten: string, thuoc: Readonly<Record<string, string | number>>, ...con: SVGElement[]): SVGElement {
  const e = document.createElementNS(NS, ten);
  for (const [k, v] of Object.entries(thuoc)) e.setAttribute(k, String(v));
  e.append(...con);
  return e;
}

/** Dan cac ky hieu sat nhau ra toi thieu `min` do, giu thu tu, de khong chong len nhau tren banh xe. */
export function dan(goc: readonly number[], min: number): number[] {
  const thuTu = goc.map((g, i) => [chuan(g), i] as const).sort((a, b) => a[0] - b[0]);
  const v = thuTu.map(([g]) => g);
  for (let lan = 0; lan < 60 && v.length > 1; lan++) {
    let doi = false;
    for (let j = 0; j < v.length; j++) {
      // Khe khong quan vong (chi cap cuoi cong 360): diem bi day vuot hang xom thi khe am, van bi day tiep.
      const k = (j + 1) % v.length, khe = (v[k] ?? 0) - (v[j] ?? 0) + (k === 0 ? 360 : 0);
      if (khe < min - 1e-9) {
        v[j] = (v[j] ?? 0) - (min - khe) / 2;
        v[k] = (v[k] ?? 0) + (min - khe) / 2;
        doi = true;
      }
    }
    if (!doi) break;
  }
  const ra = [...goc];
  thuTu.forEach(([, i], j) => { ra[i] = v[j] ?? 0; });
  return ra;
}

/** Banh xe 340 × 340: cung Moc ben trai, hoang dao tang nguoc chieu kim dong ho; khong co cung Moc thi Bach Duong ben trai. */
function veBanhXe(ls: LaSo, gc: readonly GocChieu[], moTa: string): SVGElement {
  const T = 170, moc = ls.moc ?? 0;
  const xy = (kinh: number, r: number): [number, number] => {
    const a = (180 + kinh - moc) * Math.PI / 180;
    return [T + r * Math.cos(a), T - r * Math.sin(a)];
  };
  const net = (k: number, r1: number, r2: number, lop: string): SVGElement => {
    const [x1, y1] = xy(k, r1), [x2, y2] = xy(k, r2);
    return sv('line', { x1, y1, x2, y2, class: lop });
  };
  const kyHieu = (i: number, kinh: number, r: number, co: number, lop: string): SVGElement => {
    const [x, y] = xy(kinh, r);
    return sv('path', { d: KY_HIEU[i] ?? '', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${String(co / 100)})`, class: lop });
  };
  const g: SVGElement[] = [
    sv('circle', { cx: T, cy: T, r: 166, class: 'ct-vong' }), sv('circle', { cx: T, cy: T, r: 140, class: 'ct-vong' }),
    sv('circle', { cx: T, cy: T, r: 72, class: 'ct-vong' }),
  ];
  for (let c = 0; c < 12; c++) g.push(net(c * 30, 140, 166, 'ct-vach'), kyHieu(c, c * 30 + 15, 153, 17, 'ct-ky'));
  if (ls.nha !== null && ls.dinh !== null) {
    const nha = ls.nha;
    nha.forEach((n, i) => {
      g.push(net(n, 72, 140, i % 3 === 0 ? 'ct-truc' : 'ct-nha'));
      const [x, y] = xy(n + chuan((nha[(i + 1) % 12] ?? 0) - n) / 2, 82);
      const so = sv('text', { x: x.toFixed(1), y: (y + 4.5).toFixed(1), class: 'ct-so' });
      so.textContent = String(i + 1);
      g.push(so);
    });
  }
  for (const x of gc) {
    if (x.a > 9 || x.b > 9 || x.goc === 0) continue; // chi noi thien the; goc hop nam chong len nhau, khong ke
    const [x1, y1] = xy(ls.diem[x.a]?.kinh ?? 0, 72), [x2, y2] = xy(ls.diem[x.b]?.kinh ?? 0, 72);
    g.push(sv('line', { x1, y1, x2, y2, class: x.goc === 2 || x.goc === 4 ? 'ct-goc-xau' : 'ct-goc-tot' }));
  }
  const kinh = ls.diem.map((d) => d.kinh), hien = dan(kinh, 11);
  kinh.forEach((k, i) => {
    const h = hien[i] ?? k;
    g.push(net(k, 134, 140, 'ct-vach'), kyHieu(12 + i, h, 115, 17, 'ct-sao'));
    if (Math.abs(((h - k + 540) % 360) - 180) > 0.5) { // ky hieu bi dan ra: ke vach noi ve vi tri that
      const [x1, y1] = xy(k, 134), [x2, y2] = xy(h, 126);
      g.push(sv('line', { x1, y1, x2, y2, class: 'ct-nha' }));
    }
  });
  return sv('svg', { viewBox: '0 0 340 340', role: 'img', 'aria-label': moTa }, ...g);
}

const tenGoc = (g: number): string => `${(GOC[g]?.ten ?? '').toLowerCase()} (${(GOC[g]?.anh ?? '').toLowerCase()})`;
const so1 = (x: number): string => x.toFixed(1).replace('.', ',');

/** Noi dung khoi cho mot ho so. `lechNuoc`: phut lech UTC luc sinh khi sinh o nuoc ngoai. */
export function veChiemTinh(hs: HoSo, lechNuoc: number | undefined): Node[] {
  const r = laSoNguoi(hs, lechNuoc), ls = r.laSo, gc = gocChieu(ls);
  const cungSo = (k: number): number => cungCua(k);
  const nhaSo = (k: number): number | null => (ls.nha === null ? null : nhaCua(k, ls.nha));
  const tenCung = (k: number): string => CUNG[cungSo(k)] ?? '';
  const mt = ls.diem[0]?.kinh ?? 0, mtr = ls.diem[1]?.kinh ?? 0;
  const ba = [`Mặt Trời ${tenCung(mt)}`, `Mặt Trăng ${tenCung(mtr)}`, ...(ls.moc === null ? [] : [`Cung Mọc ${tenCung(ls.moc)}`])];

  const diem: [number, number, boolean][] = ls.diem.map((d, i) => [i, d.kinh, d.nghich]);
  if (ls.moc !== null && ls.dinh !== null) diem.push([11, ls.moc, false], [12, ls.dinh, false]);
  const bang = el('table', {},
    el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'Điểm'), el('th', { scope: 'col' }, 'Vị trí'), el('th', { scope: 'col' }, 'Nhà'))),
    el('tbody', {}, ...diem.map(([i, k, nghich]) => el('tr', {},
      el('th', { scope: 'row' }, DIEM[i] ?? '', nghich ? el('span', { class: 'nghich' }, ' nghịch hành') : null, el('small', {}, DIEM_ANH[i] ?? '')),
      el('td', {}, dinhDang(k)), el('td', {}, i > 10 ? '' : String(nhaSo(k) ?? '–'))))));

  const oNha = (i: number, k: number): string => {
    const n = nhaSo(k);
    return n === null ? '' : ` Ở nhà ${String(n)}: ${TU_KHOA[i] ?? ''} dồn vào ${NHA[n - 1] ?? ''}.`;
  };
  const doan = (tieuDe: string, loi: string): HTMLElement => el('p', {}, el('b', {}, tieuDe), ` — ${loi}`);
  const loiGiai = [
    doan(`Mặt Trời ở ${tenCung(mt)}`, (MAT_TROI[cungSo(mt)] ?? '') + oNha(0, mt)),
    doan(`Mặt Trăng ở ${tenCung(mtr)}`, (MAT_TRANG[cungSo(mtr)] ?? '') + oNha(1, mtr)),
    ...(ls.moc === null ? [] : [doan(`Cung Mọc ${tenCung(ls.moc)}`, CUNG_MOC[cungSo(ls.moc)] ?? '')]),
  ];
  const hanhTinh = el('ul', {}, ...ls.diem.slice(2, 10).map((d, j) => el('li', {}, el('b', {}, `${DIEM[j + 2] ?? ''} ở ${tenCung(d.kinh)}`),
    `${d.nghich ? ' (nghịch hành)' : ''}: ${HANH_TINH[j + 2]?.[cungSo(d.kinh)] ?? ''}${oNha(j + 2, d.kinh)}`)),
  el('li', {}, el('b', {}, `Bắc Giao Điểm ở ${tenCung(ls.diem[10]?.kinh ?? 0)}`), `: ${BAC_GIAO_DIEM}`),
  ls.dinh === null ? null : el('li', {}, el('b', {}, `Thiên Đỉnh ở ${tenCung(ls.dinh)}`), `: ${THIEN_DINH}`));
  const goc = el('ul', {}, ...gc.map((x) => el('li', {},
    el('b', {}, `${DIEM[x.a] ?? ''} ${tenGoc(x.goc)} ${DIEM[x.b] ?? ''}`),
    ` (lệch ${so1(x.orb)}°): ${TU_KHOA[x.a] ?? ''} gặp ${TU_KHOA[x.b] ?? ''} — ${Y_GOC[x.goc] ?? ''}.`)));

  const noi = r.noi === null ? 'không có toạ độ'
    : `toạ độ tỉnh lỵ ${r.noi.ten} (${so1(r.noi.viDo)}° Bắc, ${so1(r.noi.kinhDo)}° Đông)`;
  return [
    el('div', { class: 'ct-ba' }, ...ba.map((t) => el('span', {}, t))),
    ...r.phuongAn.map((p) => el('p', { class: 'canh-bao' }, `${p.lyDo}: ${p.khac}.`)),
    ...r.ghiChu.map((g) => el('p', { class: 'canh-bao' }, g)),
    veBanhXe(ls, gc, `Bánh xe lá số: ${ba.join(', ')}`),
    el('p', { class: 'ghi-chu' }, 'Đường xanh: góc thuận (lục hợp, tam hợp); đường đỏ: góc nghịch (vuông, đối).'),
    bang,
    el('h3', {}, 'Lời giải'), ...loiGiai, hanhTinh,
    // Goc chieu thuong 20–30 dong: gap lai cho khoi khoi dai, bam moi mo.
    el('details', { class: 'ct-them' }, el('summary', {}, `Góc chiếu (${String(gc.length)}) — lệch càng nhỏ càng mạnh`),
      gc.length === 0 ? el('p', {}, 'Không có góc chiếu chính nào.') : goc),
    el('p', { class: 'ghi-chu' }, `Chiêm tinh nhiệt đới, hệ nhà Placidus, Bắc Giao Điểm trung bình, sai số góc 8° (lục hợp 6°); ${noi}. `
      + `Vị trí tính bằng thư viện astronomy-engine, đã so 300 lá với Swiss Ephemeris (lệch dưới 2′). ${LOI}`),
    el('p', { class: 'ghi-chu' }, `Tên Anh 12 cung: ${CUNG.map((c, i) => `${c} – ${CUNG_ANH[i] ?? ''}`).join(', ')}.`),
  ];
}

/** Khoi "Chiem tinh hom nay": bau troi luc mo khoi; co ho so thi them Mat Trang qua nha va goc chieu voi la so (orb 1°). */
export function veChiemTinhHomNay(toi: HoSo | undefined, lechNuoc: number | undefined, ms: number): Node[] {
  const p = phutUtcTuMs(ms), nay = laSo(p, null), tt = tuanTrang(nay), trang = nay.diem[1]?.kinh ?? 0, doi = trangDoiCung(p);
  const tenCung = (k: number): string => CUNG[cungCua(k)] ?? '';
  const doan = (tieuDe: string, loi: string): HTMLElement => el('p', {}, el('b', {}, tieuDe), ` — ${loi}`);
  const nghich = [2, 3, 4, 5, 6, 7, 8, 9].flatMap((i) => {
    const k = khoangNghich(i, p);
    return k === null ? [] : [el('li', {}, el('b', {}, `${DIEM[i] ?? ''} ở ${tenCung(kinhDo(i, p))}`),
      ` nghịch hành từ ${ngayVN(k[0])} đến ${ngayVN(k[1])}: ${NGHICH_HANH[i] ?? ''}`)];
  });
  const ra: Node[] = [
    el('div', { class: 'ct-ba' }, el('span', {}, `Mặt Trăng ${tenCung(trang)}`), el('span', {}, TUAN_TRANG[tt.pha] ?? '')),
    doan(`Mặt Trăng ở ${tenCung(trang)}`, `${TRANG_QUA_CUNG[cungCua(trang)] ?? ''} Sang ${tenCung(kinhDo(1, doi))} lúc ${gioVN(doi)}.`),
    doan(`${TUAN_TRANG[tt.pha] ?? ''}, sáng ${String(tt.sang)} %`, Y_TUAN_TRANG[tt.pha] ?? ''),
    el('h3', {}, 'Hành tinh nghịch hành'),
    nghich.length === 0 ? el('p', {}, 'Hôm nay không hành tinh nào nghịch hành.') : el('ul', {}, ...nghich),
  ];
  if (toi === undefined) {
    ra.push(el('p', { class: 'ghi-chu' }, 'Nhập hồ sơ ở thẻ "Của tôi" để xem Mặt Trăng đi qua nhà nào và góc chiếu hôm nay với lá số của mình.'));
  } else {
    const goc = laSoNguoi(toi, lechNuoc).laSo, nha = goc.nha;
    // Khong ro gio sinh: Mat Trang goc co the lech toi ~6° nen khong xet goc chieu toi no.
    const gc = gocChieuQua(nay, goc).filter((x) => !(toi.gioSinh === null && x.b === 1));
    ra.push(el('h3', {}, 'Với lá số của tôi'),
      nha === null
        ? el('p', { class: 'ghi-chu' }, 'Hồ sơ chưa có giờ sinh hoặc sinh ở nước ngoài nên chưa xét Mặt Trăng qua nhà nào.')
        : el('p', {}, el('b', {}, `Mặt Trăng đi qua nhà ${String(nhaCua(trang, nha))}`), ` — cảm xúc hôm nay xoay quanh ${NHA[nhaCua(trang, nha) - 1] ?? ''}.`),
      gc.length === 0 ? el('p', {}, 'Hôm nay không có góc chiếu chặt (lệch dưới 1°) nào với lá số.')
        : el('ul', {}, ...gc.map((x) => el('li', {}, el('b', {}, `${DIEM[x.a] ?? ''} hôm nay ${tenGoc(x.goc)} ${DIEM[x.b] ?? ''} trong lá số`),
          ` (lệch ${so1(x.orb)}°): ${TU_KHOA[x.a] ?? ''} gặp ${TU_KHOA[x.b] ?? ''} — ${Y_GOC[x.goc] ?? ''}.`))));
  }
  ra.push(el('p', { class: 'ghi-chu' }, `Tính lúc ${gioVN(p)} (giờ Việt Nam); đóng mở lại thẻ để tính lại. ${LOI}`));
  return ra;
}
