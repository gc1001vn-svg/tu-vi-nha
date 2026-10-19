/**
 * Khoi "Tu vi — la so" (`src/loi/tuVi/laSo.ts`): luoi 4×4 kho iPhone, 12 cung o vi tri dia chi chuan (Ty Ngo Mui Than
 * hang tren), o giua thong tin chung. O hep khong du cho → bam mot cung, ben duoi hien du sao cua cung do.
 * Khong ro gio → 12 nut gio gia dinh, chi doi trong khoi, khong luu (QUY_UOC muc 9). Gio sat ranh → nut xem la so kia (muc 8).
 */
import { CHI, canChiNam, dinhDangAm } from '../../loi/amLich.ts';
import { hv } from '../../loi/hanViet/index.ts';
import type { KetQuaHoSo } from '../../loi/hoSo.ts';
import { tinhTuVi, type Cung, type LaSo, type Sao } from '../../loi/tuVi/laSo.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './tuVi.css';

const tenChi = (i: number): string => hv('chi', CHI.charAt(i));
/** [hang, cot] tren luoi 4×4 cua chi Ty = 0 … Hoi = 11. */
const O: readonly (readonly [number, number])[] = [
  [4, 3], [4, 2], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4],
];
/** Phu tinh hien ngay trong o, theo thu tu nay (con lai bam xem): tu hoa, Loc Ton, Thien Ma, luc cat, luc sat. */
const PHU_HIEN = [94, 93, 92, 95, 27, 98, 57, 58, 59, 60, 61, 62, 52, 51, 53, 54, 56, 55];
const TOI_DA = 4;
const DO_SANG = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình', H: 'Hãm' } as const;
/** Mot dong nghia moi cung — Claude soan lai (luat 6), khong chep sach. */
const NGHIA: Readonly<Record<string, string>> = {
  'Mệnh': 'Bản thân: tính tình, dáng vẻ, hướng đi chung của cả đời.',
  'Phụ Mẫu': 'Cha mẹ, bề trên, người nuôi dạy mình.',
  'Phúc Đức': 'Phúc của dòng họ, đời sống tinh thần, sự an vui lâu dài.',
  'Điền Trạch': 'Nhà cửa, đất đai, của để dành.',
  'Quan Lộc': 'Học hành, công việc, chức phận.',
  'Nô Bộc': 'Bạn bè, đồng nghiệp, người làm cùng hoặc giúp việc.',
  'Thiên Di': 'Ra ngoài, đi xa, cách người ngoài nhìn mình.',
  'Tật Ách': 'Sức khỏe, bệnh tật, rủi ro thân thể.',
  'Tài Bạch': 'Tiền bạc: cách kiếm ra và cách giữ.',
  'Tử Tức': 'Con cái, người nhỏ tuổi dưới mình.',
  'Phu Thê': 'Vợ chồng, chuyện hôn nhân.',
  'Huynh Đệ': 'Anh chị em ruột.',
};

const loaiSao = (s: Sao): string => (s.loai === 1 ? 'tv-chinh' : s.loai < 10 ? 'tv-tot' : 'tv-xau');
const voiDoSang = (s: Sao): string => (s.doSang === null ? s.ten : `${s.ten} (${DO_SANG[s.doSang]})`);

function hangNut(nhan: string, nut: readonly (string | HTMLElement)[], dangChon: number | undefined, chon: (i: number) => void,
  lop = ''): HTMLElement {
  return el('div', { class: `tv-hang-nut ${lop}`, role: 'group', 'aria-label': nhan },
    el('span', { class: 'nhan' }, nhan),
    ...nut.map((n, i) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(i === dangChon) }, n);
      b.addEventListener('click', () => { chon(i); });
      return b;
    }));
}

function oCung(c: Cung, ls: LaSo): HTMLElement {
  const chinh = c.sao.filter((s) => s.loai === 1);
  const phu = PHU_HIEN.flatMap((id) => c.sao.filter((s) => s.id === id));
  const [hang, cot] = O[c.chi] ?? [1, 1];
  return el('button', {
    type: 'button', class: c.chi === ls.menh ? 'tv-cung tv-menh' : 'tv-cung', style: `grid-row:${String(hang)};grid-column:${String(cot)}`,
  },
  el('span', { class: 'tv-ten' }, c.ten, c.chi === ls.than ? el('b', { class: 'tv-than' }, 'Thân') : null),
  ...(chinh.length === 0
    ? [el('span', { class: 'tv-vcd' }, 'Vô chính diệu')]
    : chinh.map((s) => el('span', { class: 'tv-chinh' }, s.ten, s.doSang === null ? null : el('small', {}, ` ${s.doSang}`)))),
  ...phu.slice(0, TOI_DA).map((s) => el('span', { class: loaiSao(s) }, s.ten)),
  phu.length > TOI_DA ? el('span', { class: 'tv-them' }, `+${String(phu.length - TOI_DA)} sao`) : null,
  el('span', { class: 'tv-chan' },
    el('span', {}, tenChi(c.chi), c.tuan ? ' · Tuần' : '', c.triet ? ' · Triệt' : ''),
    el('span', { class: c.chi === ls.daiVanNay ? 'tv-dv tv-nay' : 'tv-dv' }, String(c.daiVan))));
}

function oGiua(ls: LaSo, kq: KetQuaHoSo, ten: string, giaDinh: boolean): HTMLElement {
  return el('div', { class: 'tv-giua' },
    el('b', {}, ten),
    el('span', {}, ls.amDuong),
    el('span', {}, `Năm ${kq.canChiNam}`),
    el('span', {}, `Tháng ${kq.canChiThang}`),
    el('span', {}, `Ngày ${kq.canChiNgay}`),
    el('span', { class: giaDinh ? 'tv-gia-dinh' : '' }, `Giờ ${tenChi(ls.chiGio)}${giaDinh ? ' (giả định)' : ''}`),
    el('span', {}, `Âm lịch ${dinhDangAm(kq.am)}`),
    el('span', {}, `Mệnh ${kq.napAm}`),
    el('span', { class: 'tv-cuc' }, ls.cuc),
    el('span', {}, `Mệnh chủ ${ls.menhChu}`),
    el('span', {}, `Thân chủ ${ls.thanChu}`),
    el('span', {}, `Thân cư ${ls.cung[ls.than]?.ten ?? ''}`),
    el('span', {}, `Năm ${canChiNam(kq.am.nam + ls.tuoi - 1)}: ${String(ls.tuoi)} tuổi mụ`));
}

function chiTiet(c: Cung, ls: LaSo): HTMLElement[] {
  const dong = (nhan: string, ds: readonly Sao[]): HTMLElement | null => (ds.length === 0 ? null
    : el('p', {}, el('span', { class: 'nhan' }, nhan), ' ', ds.map(voiDoSang).join(', ')));
  const chinh = c.sao.filter((s) => s.loai === 1);
  const vao = [
    `Đại vận ${String(c.daiVan)}–${String(c.daiVan + 9)} tuổi${c.chi === ls.daiVanNay ? ' (đang chạy)' : ''}`,
    `tiểu hạn các năm ${tenChi(c.tieuHan)}${c.chi === ls.tieuHanNay ? ' (năm nay)' : ''}`,
    ...(c.tuan ? ['có Tuần'] : []), ...(c.triet ? ['có Triệt'] : []),
  ];
  return [
    el('h3', {}, `Cung ${c.ten} · ${c.canChi}${c.chi === ls.than ? ' · Thân cư' : ''}`),
    el('p', { class: 'ghi-chu' }, `${NGHIA[c.ten] ?? ''} (Lời Claude soạn lại.)`),
    el('p', {}, vao.join(' · ')),
    dong('Chính tinh', chinh) ?? el('p', {}, 'Vô chính diệu: cung không có chính tinh.'),
    dong('Sao tốt', c.sao.filter((s) => s.loai > 1 && s.loai < 10)),
    dong('Sao xấu', c.sao.filter((s) => s.loai > 10)),
  ].filter((x) => x !== null);
}

/** Luoi 12 cung + phan chi tiet cung dang chon (mac dinh cung Menh). Bam o chi doi phan chi tiet, khong ve lai luoi. */
function laSo(ls: LaSo, kq: KetQuaHoSo, ten: string, giaDinh: boolean): HTMLElement[] {
  const chiTietCung = el('div', { class: 'tv-chi-tiet', 'aria-live': 'polite' });
  const oDaVe = ls.cung.map((c) => oCung(c, ls));
  const chon = (chi: number): void => {
    oDaVe.forEach((o, i) => { o.setAttribute('aria-pressed', String(i === chi)); });
    const c = ls.cung[chi];
    if (c !== undefined) chiTietCung.replaceChildren(...chiTiet(c, ls));
  };
  oDaVe.forEach((o, i) => {
    o.addEventListener('click', () => {
      chon(i);
      chiTietCung.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });
  chon(ls.menh);
  return [
    el('div', { class: 'tv-luoi' }, ...oDaVe, oGiua(ls, kq, ten, giaDinh)),
    el('p', { class: 'ghi-chu tv-chu-thich' },
      'Độ sáng: M Miếu · V Vượng · Đ Đắc · B Bình · H Hãm. Số góc dưới: tuổi bắt đầu đại vận (tô vàng: đang chạy). '
      + 'Viền vàng: cung Mệnh. Bấm một cung để xem đủ sao.'),
    chiTietCung,
  ];
}

export const veKhoiTuVi: VeKhoi = (hs, tr, ngayXem) => {
  // Phuong an sat ranh lam doi la so (khac gio hoac ngay am) — QUY_UOC muc 8.
  const phuongAn = [
    { lyDo: 'Giờ đã nhập', kq: tr.chinh },
    ...tr.khac.filter((p) => p.ketQua.chiGio !== tr.chinh.chiGio || dinhDangAm(p.ketQua.am) !== dinhDangAm(tr.chinh.am))
      .map((p) => ({ lyDo: p.lyDo, kq: p.ketQua })),
  ];
  let pa = 0;
  let gio: number | undefined;
  const than = el('div', {});
  const ve = (): void => {
    const kq = phuongAn[pa]?.kq ?? tr.chinh;
    const ls = tinhTuVi(hs, kq, ngayXem, gio);
    const con: HTMLElement[] = [];
    if (kq.phut7 === null) {
      con.push(el('p', { class: 'canh-bao' }, ls === 'canChonGio'
        ? 'Không rõ giờ sinh: chưa lập được một lá số duy nhất. Chọn một giờ giả định để xem (chỉ xem, không lưu).'
        : `Lá số theo giờ giả định ${tenChi(ls.chiGio)} — không phải giờ sinh thật.`),
      hangNut('Giờ giả định:', CHI.split('').map((_, i) =>
        el('span', {}, tenChi(i), el('small', {}, `${String((i * 2 + 23) % 24)}–${String(i * 2 + 1)}h`))), gio, (i) => { gio = i; ve(); }, 'tv-gio'));
    }
    if (phuongAn.length > 1) {
      con.push(hangNut('Giờ sát ranh, xem lá số:', phuongAn.map((p) => p.lyDo), pa, (i) => { pa = i; ve(); }));
    }
    if (ls !== 'canChonGio') con.push(...laSo(ls, kq, hs.ten, kq.phut7 === null));
    than.replaceChildren(...con);
  };
  ve();
  return khoi('Tử vi — lá số', true, than);
};
