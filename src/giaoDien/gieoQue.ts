/**
 * The "Gieo que" (dot 4, tarot dot 6): Kinh Dich (gieo dong xu, Mai Hoa theo gio), boi Kieu, tarot. So ngau nhien, gio "bay gio" lay o day
 * (loi cam ngau nhien, dong ho). Chu Kinh Dich, chu Kieu tai rieng luc bam lan dau (`import()`); service worker van luu.
 */
import { canChiNam, CHI } from '../loi/amLich.ts';
import { hv } from '../loi/hanViet/index.ts';
import type { QueKieu } from '../loi/kieu.ts';
import type * as Tinh from '../loi/kinhDich.ts';
import type { DoanDoc, Gieo, Hao, MaiHoaGio } from '../loi/kinhDich.ts';
import type * as Chu from '../loi/kinhDichChu.ts';
import type * as Giai from '../loi/kinhDichGiai.ts';
import { khoiAI } from './ai/index.ts';
import { el } from './chung.ts';
import './gieoQue.css';
import { LOI_SOAN } from './khoi/namNay.ts';

type KinhDich = typeof Tinh & typeof Chu & typeof Giai;
const taiKinhDich = (): Promise<KinhDich> =>
  Promise.all([import('../loi/kinhDich.ts'), import('../loi/kinhDichChu.ts'), import('../loi/kinhDichGiai.ts')])
    .then(([tinh, chu, giai]) => ({ ...tinh, ...chu, ...giai }));

const loi = (e: unknown): HTMLElement => el('p', { class: 'loi' }, `Không mở được: ${e instanceof Error ? e.message : String(e)}`);

/** Moi lan gieo, rut mot phien AI moi. */
let soLanGieo = 0;

/** Hinh que, hao 6 o tren: hao duong mot vach, hao am hai vach; hao dong to mau khac. */
const veHinh = (hao: readonly Hao[]): HTMLElement =>
  el('div', { class: 'hinh-que', 'aria-hidden': 'true' },
    ...[...hao].reverse().map((h) => el('div', { class: h === 6 || h === 9 ? 'vach hao-dong' : 'vach' }, ...(h % 2 === 0 ? [el('i'), el('i')] : [el('i')]))));

function veQueDich(k: KinhDich, g: Gieo, mh: MaiHoaGio | null): HTMLElement {
  const ten = (so: number): string => { const q = k.QUE[so - 1]; return q === undefined ? '' : `${String(so)}. ${q.tenDu} (${q.han})`; };
  const chuQue = k.QUE[g.chu - 1];
  const doan = k.doanCanDoc(g);
  const veDoan = (d: DoanDoc): HTMLElement => {
    const q = k.QUE[d.que - 1];
    const gi = k.GIAI[d.que - 1];
    const [tieuDe, giai, nguyen] = d.loai === 'dung'
      ? [d.que === 1 ? 'Dụng Cửu (quẻ Càn)' : 'Dụng Lục (quẻ Khôn)', d.que === 1 ? k.GIAI_DUNG_CUU : k.GIAI_DUNG_LUC, d.que === 1 ? k.DUNG_CUU : k.DUNG_LUC]
      : d.loai === 'thoan'
        ? [`Lời quẻ ${ten(d.que)}`, gi?.que ?? '', q?.thoan ?? '']
        : [`Hào ${String(d.hao)} (${k.tenHao(d.que, d.hao)}) quẻ ${ten(d.que)}`, gi?.hao[d.hao - 1] ?? '', q?.hao[d.hao - 1] ?? ''];
    return el('div', { class: 'dong' }, el('span', { class: 'nhan' }, `${tieuDe}${doan.length > 1 && d.chinh ? ' — đọc chính' : ''}`),
      el('span', {}, giai), el('small', { class: 'ghi-chu' }, `Nguyên văn: ${nguyen}`));
  };
  const coLoiQue = doan.some((d) => d.loai === 'thoan' && d.que === g.chu);
  const maiHoa = mh === null ? [] : [
    el('p', { class: 'mau' }, `Năm ${canChiNam(mh.am.nam)} (${String(mh.soNam)}) + tháng ${String(mh.am.thang)} + ngày ${String(mh.am.ngay)} âm`
      + ` → quái trên ${k.quai(mh.tren).ten}; thêm giờ ${hv('chi', CHI.charAt(mh.soGio - 1))} (${String(mh.soGio)})`
      + ` → quái dưới ${k.quai(mh.duoi).ten}, hào ${String(g.dong[0] ?? 0)} động.`),
    el('p', {}, `Thể ${k.quai(mh.the).ten} (${k.quai(mh.the).hanh}), Dụng ${k.quai(mh.dung).ten} (${k.quai(mh.dung).hanh}): `,
      el('b', { class: mh.quanHe === 'theSinhDung' || mh.quanHe === 'dungKhacThe' ? 'loi' : 'am' }, k.LUAN[mh.quanHe].ten), ` — ${k.LUAN[mh.quanHe].loi}`),
  ];
  return el('div', {},
    el('p', { class: 'am' }, `Quẻ chủ: ${ten(g.chu)}`),
    veHinh(g.hao),
    el('p', {}, g.dong.length === 0 ? 'Không có hào động.' : `Hào động: ${g.dong.map((h) => `${String(h)} (${k.tenHao(g.chu, h)})`).join(', ')}.`),
    g.bien === null ? null : el('p', {}, `Quẻ biến: ${ten(g.bien)}`),
    el('p', {}, `Quẻ hỗ: ${ten(g.ho)}`),
    ...maiHoa,
    coLoiQue ? null : el('div', { class: 'dong' }, el('span', { class: 'nhan' }, 'Ý quẻ chủ'), el('span', {}, k.GIAI[g.chu - 1]?.que ?? ''),
      el('small', { class: 'ghi-chu' }, `Nguyên văn: ${chuQue?.thoan ?? ''}`)),
    el('p', { class: 'ghi-chu' }, 'Đoạn nên đọc theo số hào động (luật Chu Hy):'),
    ...doan.map(veDoan),
    el('p', { class: 'ghi-chu' }, `Nguyên văn theo bản Kanripo (bỏ dấu câu). Lời giải: ${LOI_SOAN}`),
    khoiAI('AI giải quẻ', `que:${String(++soLanGieo)}`, { loai: 'que', k, g, mh }));
}

function veKinhDich(): HTMLElement {
  const ketQua = el('div', { 'aria-live': 'polite' });
  const nut = (chu: string, lam: (k: KinhDich) => HTMLElement): HTMLElement => {
    const n = el('button', { type: 'button', class: 'chinh' }, chu);
    n.addEventListener('click', () => {
      taiKinhDich().then((k) => { ketQua.replaceChildren(lam(k)); }, (e: unknown) => { ketQua.replaceChildren(loi(e)); });
    });
    return n;
  };
  const xu = nut('Gieo đồng xu', (k) => {
    // moi hao: ba dong xu, moi dong 2 hoac 3 -> tong 6–9
    const b = crypto.getRandomValues(new Uint8Array(18));
    const hao = Array.from({ length: 6 }, (_, i) => (6 + ((b[3 * i] ?? 0) & 1) + ((b[3 * i + 1] ?? 0) & 1) + ((b[3 * i + 2] ?? 0) & 1)) as Hao);
    return veQueDich(k, k.gieo(hao), null);
  });
  const maiHoa = nut('Mai Hoa theo giờ này', (k) => {
    const t = new Date(Date.now() + 7 * 3_600_000); // gio Viet Nam
    const m = k.maiHoaTheoGio({ nam: t.getUTCFullYear(), thang: t.getUTCMonth() + 1, ngay: t.getUTCDate() }, t.getUTCHours());
    return veQueDich(k, m, m);
  });
  return el('section', { class: 'the' },
    el('h2', {}, 'Kinh Dịch'),
    el('p', {}, 'Lặng lòng nghĩ việc muốn hỏi rồi chọn cách gieo: máy tung ba đồng xu sáu lần, hoặc lấy quẻ theo năm, tháng, ngày, giờ âm lịch lúc này (Mai Hoa).'),
    el('div', { class: 'nut-hang' }, xu, maiHoa),
    ketQua,
    el('p', { class: 'ghi-chu' }, 'Một việc chỉ nên hỏi một lần: sách dạy "hỏi lần đầu thì bảo, hỏi đi hỏi lại là nhờn".'));
}

const KHAN = 'Lạy vua Từ Hải, lạy vãi Giác Duyên, lạy tiên Thúy Kiều. Con tên là …, xin cho con một quẻ về việc …';

const xuongDong = (ds: readonly string[]): (string | HTMLElement)[] => ds.flatMap((c, i) => (i === 0 ? [c] : [el('br'), c]));

function veQueKieu(q: QueKieu): HTMLElement {
  const ke = (ds: readonly string[]): HTMLElement | null => (ds.length === 0 ? null : el('p', { class: 'mau' }, ...xuongDong(ds)));
  return el('div', {},
    el('p', { class: 'ghi-chu' }, `Câu ${String(q.so)}–${String(q.so + 1)} · ${q.hoi.ten}`),
    ke(q.truoc),
    el('p', { class: 'am' }, ...xuongDong([q.luc, q.bat])),
    ke(q.sau),
    el('p', {}, `Đoạn này: ${q.hoi.tomTat}`),
    el('p', { class: 'ghi-chu' }, `Tên đoạn, tóm tắt: ${LOI_SOAN}`));
}

function veBoiKieu(): HTMLElement {
  const ketQua = el('div', { 'aria-live': 'polite' });
  const nut = el('button', { type: 'button', class: 'chinh' }, 'Mở sách');
  nut.addEventListener('click', () => {
    import('../loi/kieu.ts').then((k) => {
      const cap = (crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % k.SO_CAP;
      ketQua.replaceChildren(veQueKieu(k.queKieu(cap)));
    }, (e: unknown) => { ketQua.replaceChildren(loi(e)); });
  });
  return el('section', { class: 'the' },
    el('h2', {}, 'Bói Kiều'),
    el('p', {}, 'Nghĩ việc muốn hỏi, khấn thầm rồi bấm "Mở sách": máy mở ngẫu nhiên một cặp lục bát trong 3.254 câu Truyện Kiều.'),
    el('p', { class: 'mau' }, `Lời khấn: ${KHAN}`),
    nut,
    ketQua,
    el('p', { class: 'ghi-chu' },
      'Bói Kiều là thú chơi dân gian: tự đặt hai câu thơ vào việc mình đang hỏi mà suy ngẫm. Chữ theo bản phổ thông, đã soát với hai bản khác.'));
}

type Tarot = typeof import('../loi/tarot.ts');
type KieuTrai = keyof Tarot['TRAI'];

/** Mot la da rut: anh (lat nguoc neu la nguoc), vi tri, ten Anh + ten Viet, nghia. */
function veLa(t: Tarot, so: number, nguoc: boolean, viTri: readonly [string, string]): HTMLElement {
  const la = t.LA[so];
  if (la === undefined) throw new Error(`Không có lá ${String(so)}`);
  const ten = `${la.anh} — ${la.ten}${la.khac === null ? '' : ` (còn gọi ${la.khac})`}`;
  return el('figure', { class: 'la-tarot' },
    el('img', { src: `tarot/${String(so).padStart(2, '0')}.webp`, alt: `${ten}${nguoc ? ', lá ngược' : ''}`, class: nguoc ? 'nguoc' : '', width: '300', height: '520' }),
    el('figcaption', {},
      el('span', { class: 'am' }, viTri[0]), el('small', { class: 'ghi-chu' }, ` · ${viTri[1]}`),
      el('b', {}, ten), nguoc ? el('span', { class: 'loi' }, ' · ngược') : null,
      el('p', {}, nguoc ? la.nguoc : la.xuoi)));
}

function veTarot(): HTMLElement {
  const ketQua = el('div', { 'aria-live': 'polite' });
  const oNguoc = el('input', { type: 'checkbox', checked: '' });
  const nut = (kieu: KieuTrai, chu: string): HTMLElement => {
    const n = el('button', { type: 'button', class: 'chinh' }, chu);
    n.addEventListener('click', () => {
      import('../loi/tarot.ts').then((t) => {
        const viTri = t.TRAI[kieu].viTri;
        const rut = t.rutBai([...crypto.getRandomValues(new Uint32Array(2 * viTri.length))], viTri.length, oNguoc.checked);
        ketQua.replaceChildren(el('div', { class: 'cac-la' }, ...rut.map((r, i) => veLa(t, r.so, r.nguoc, viTri[i] ?? ['', '']))),
          khoiAI('AI đọc trải bài', `tarot:${String(++soLanGieo)}`, { loai: 'tarot', t, kieu, rut }));
      }, (e: unknown) => { ketQua.replaceChildren(loi(e)); });
    });
    return n;
  };
  return el('section', { class: 'the' },
    el('h2', {}, 'Tarot'),
    el('p', {}, 'Bộ bài 1909 do Pamela Colman Smith vẽ, A. E. Waite soạn (đã hết bản quyền). Lặng lòng nghĩ câu hỏi rồi chọn cách trải; máy xáo đủ 78 lá.'),
    el('div', { class: 'nut-hang' }, nut('motLa', 'Rút 1 lá'), nut('baLa', 'Rút 3 lá'), nut('thapTu', 'Thập tự Celtic (10 lá)')),
    el('label', { class: 'chon-nguoc' }, oNguoc, ' Dùng lá ngược (lá rút ra có thể bị lộn ngược, đọc nghĩa ngược)'),
    ketQua,
    el('p', { class: 'ghi-chu' }, 'Tên Anh là tên chính vì tên Việt mỗi nơi gọi một khác. Nghĩa lá do Claude soạn lại theo sách của Waite (1910) '
      + 'và cách đọc phổ biến; chỉ để tham khảo.'));
}

export function veGieoQue(): HTMLElement {
  return el('div', {}, veKinhDich(), veBoiKieu(), veTarot());
}
