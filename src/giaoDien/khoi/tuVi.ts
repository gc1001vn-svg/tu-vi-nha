/**
 * Khoi "Tu vi — la so" (`src/loi/tuVi/laSo.ts`): luoi 4×4 kho iPhone, 12 cung o vi tri dia chi chuan (Ty Ngo Mui Than
 * hang tren), o giua thong tin chung. O hep khong du cho → bam mot cung, ben duoi hien du sao va loi giai cung do.
 * Tren luoi: han nam, thang, ngay theo hom nay va 9 sao luu (`luuHan.ts`); loi giai o `nghia.ts`.
 * Khong ro gio → 12 nut gio gia dinh, chi doi trong khoi, khong luu (QUY_UOC muc 9). Gio sat ranh → nut xem la so kia (muc 8).
 */
import { CHI, canChiNam, dinhDangAm } from '../../loi/amLich.ts';
import { hv } from '../../loi/hanViet/index.ts';
import type { KetQuaHoSo } from '../../loi/hoSo.ts';
import { tinhTuVi, type Cung, type LaSo, type Sao } from '../../loi/tuVi/laSo.ts';
import { dsDaiVan, luanCung, luanDaiVan, luanNam, tongLuan } from '../../loi/tuVi/luan.ts';
import { danhGiaHan, tinhLuuHan, type LuuHan } from '../../loi/tuVi/luuHan.ts';
import { CHU_DE, HAN, NGHIA_CUNG, SAO_LUU, SAO_LUU_TRUNG } from '../../loi/tuVi/nghia.ts';
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
const SOAN = '(Claude tổng hợp nhiều phái tử vi rồi chốt lời; chỉ để tham khảo.)';

const loaiSao = (s: Sao): string => (s.loai === 1 ? 'tv-chinh' : s.loai < 10 ? 'tv-tot' : 'tv-xau');
const voiDoSang = (s: Sao): string => (s.doSang === null ? s.ten : `${s.ten} (${DO_SANG[s.doSang]})`);
const tenCung = (ls: LaSo, chi: number): string => `${ls.cung[chi]?.ten ?? ''} (${tenChi(chi)})`;
/** Nhan han nam, thang, ngay dang roi vao cung `chi`. */
const hanO = (lh: LuuHan, chi: number): string[] =>
  ([[lh.tieuHan, 'Năm'], [lh.thang, 'Tháng'], [lh.ngay, 'Ngày']] as const).filter(([c]) => c === chi).map(([, t]) => t);

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

function oCung(c: Cung, ls: LaSo, lh: LuuHan): HTMLElement {
  const chinh = c.sao.filter((s) => s.loai === 1);
  const phu = PHU_HIEN.flatMap((id) => c.sao.filter((s) => s.id === id));
  const han = hanO(lh, c.chi);
  const [hang, cot] = O[c.chi] ?? [1, 1];
  return el('button', {
    type: 'button', class: c.chi === ls.menh ? 'tv-cung tv-menh' : 'tv-cung', style: `grid-row:${String(hang)};grid-column:${String(cot)}`,
  },
  el('span', { class: 'tv-ten' }, c.ten, c.chi === ls.than ? el('b', { class: 'tv-than' }, 'Thân') : null),
  han.length === 0 ? null : el('span', { class: 'tv-han' }, ...han.map((t) => el('b', {}, t))),
  ...(chinh.length === 0
    ? [el('span', { class: 'tv-vcd' }, 'Vô chính diệu')]
    : chinh.map((s) => el('span', { class: 'tv-chinh' }, s.ten, s.doSang === null ? null : el('small', {}, ` ${s.doSang}`)))),
  ...phu.slice(0, TOI_DA).map((s) => el('span', { class: loaiSao(s) }, s.ten)),
  phu.length > TOI_DA ? el('span', { class: 'tv-them' }, `+${String(phu.length - TOI_DA)} sao`) : null,
  ...lh.sao.filter((s) => s.chi === c.chi).map((s) => el('span', { class: `tv-luu ${loaiSao(s)}` }, s.ten.replace('Lưu ', 'L.'))),
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

/** Luan mot cung (`luanCung`, tang 2): chi loi chot, khong liet ke nghia tung sao; sao luu nam nay giu nghia rieng (tang 3 luan han). */
function loiCung(c: Cung, ls: LaSo, lh: LuuHan, namAm: number): HTMLElement[] {
  const luu = lh.sao.filter((s) => s.chi === c.chi);
  return [
    el('p', {}, el('b', {}, `Cung ${c.ten}`), ` — ${NGHIA_CUNG[c.ten] ?? ''}`),
    ...luanCung(ls, c.chi, namAm).map((l) => el('p', {}, l)),
    ...luu.map((s) => el('p', {}, el('b', { class: loaiSao(s) }, s.ten), ` — ${SAO_LUU[s.ten] ?? ''}`,
      c.sao.some((g) => `Lưu ${g.ten}` === s.ten) && SAO_LUU_TRUNG[s.ten] !== undefined ? ` ${SAO_LUU_TRUNG[s.ten] ?? ''}` : '')),
    el('p', { class: 'ghi-chu' }, SOAN),
  ];
}

function chiTiet(c: Cung, ls: LaSo, lh: LuuHan, namAm: number): HTMLElement[] {
  const dong = (nhan: string, ds: readonly Sao[]): HTMLElement | null => (ds.length === 0 ? null
    : el('p', {}, el('span', { class: 'nhan' }, nhan), ' ', ds.map(voiDoSang).join(', ')));
  const han = hanO(lh, c.chi);
  const vao = [
    `Đại vận ${String(c.daiVan)}–${String(c.daiVan + 9)} tuổi${c.chi === ls.daiVanNay ? ' (đang chạy)' : ''}`,
    `tiểu hạn các năm ${tenChi(c.tieuHan)}`,
    ...(han.length === 0 ? [] : [`hạn ${han.join(', ').toLowerCase()} đang ở đây`]),
    ...(c.tuan ? ['có Tuần'] : []), ...(c.triet ? ['có Triệt'] : []),
  ];
  return [
    el('h3', {}, `Cung ${c.ten} · ${c.canChi}${c.chi === ls.than ? ' · Thân cư' : ''}`),
    el('p', {}, vao.join(' · ')),
    dong('Chính tinh', c.sao.filter((s) => s.loai === 1)) ?? el('p', {}, 'Vô chính diệu: cung không có chính tinh.'),
    dong('Sao tốt', c.sao.filter((s) => s.loai > 1 && s.loai < 10)),
    dong('Sao xấu', c.sao.filter((s) => s.loai > 10)),
    ...loiCung(c, ls, lh, namAm),
  ].filter((x) => x !== null);
}

/** Han nam, thang, ngay theo hom nay: moi han mot khoi gap/mo co cau ket luan dau (Tan Bien III.1.2), chi mo san khoi hom nay. */
function hanHomNay(ls: LaSo, lh: LuuHan, giaDinh: boolean, namAm: number): HTMLElement[] {
  const phan = (tieuDe: string, chi: number, khi: string, mo: boolean, ...con: (HTMLElement | null)[]): HTMLElement => {
    const d = danhGiaHan(ls, lh, chi);
    const c = ls.cung[chi];
    return el('details', { class: 'tv-giai', ...(mo ? { open: '' } : {}) }, el('summary', {}, `${tieuDe} · hạn ${d.ket}`),
      el('p', { class: `tv-ket tv-${d.ket === 'tốt' ? 'tot' : d.ket === 'xấu' ? 'xau' : 'vua'}` }, el('b', {}, `Hạn ${d.ket}`),
        `: trong ${String(d.tong)} sao hội về cung này có ${String(d.tot)} sao tốt, ${String(d.xau)} sao xấu. `
        + `Chuyện ${CHU_DE[c?.ten ?? ''] ?? ''} hay nổi lên ${khi}.`),
      ...con, ...(c === undefined ? [] : loiCung(c, ls, lh, namAm)));
  };
  // Chua co man chinh tuy chon (QUY_UOC muc 16): cach Dau Quan ra cung khac thi ghi mot dong.
  const phaiKia = (kia: number, nay: number, viec: string): HTMLElement | null => (kia === nay ? null
    : el('p', { class: 'canh-bao' }, `Nếu tính theo sách Toàn Thư (khởi từ cung Lưu Thái Tuế, gọi là Đẩu Quân) thì ${viec} này ở `
      + `cung ${tenCung(ls, kia)}.`));
  const thang = `${String(lh.thangAm)}${lh.nhuan ? ' nhuận' : ''}`;
  // Dai van, nam: luan tong hop (luan.ts tang 3); thang, ngay: cach dem sao cua Tan Bien (`phan`).
  const TEN = { thuan: 'thuận', vua: 'bình thường', kho: 'nhiều thử thách' } as const;
  const cDv = ls.daiVanNay === null ? undefined : ls.cung[ls.daiVanNay];
  const dv = cDv === undefined ? null : luanDaiVan(ls, cDv.chi, namAm);
  const nam = luanNam(ls, lh, namAm);
  return [
    el('p', { class: 'tv-tieu-de' }, 'Vận hạn'),
    dv === null || cDv === undefined ? el('p', {}, `Chưa vào đại vận đầu (bắt đầu từ ${String(ls.soCuc)} tuổi).`)
      : el('details', { class: 'tv-giai', open: '' },
        el('summary', {}, `Đại vận ${String(cDv.daiVan)}–${String(cDv.daiVan + 9)} tuổi · cung ${tenCung(ls, cDv.chi)} · ${TEN[dv.ket]}`),
        ...dv.loi.map((l) => el('p', {}, l))),
    el('details', { class: 'tv-giai' }, el('summary', {}, 'Các đại vận trong đời'),
      el('ul', {}, ...dsDaiVan(ls, namAm).map((v) => el('li', {}, `${String(v.tuoi)}–${String(v.tuoi + 9)} tuổi · cung ${v.ten}: `
        + `${TEN[v.ket]}${v.chi === ls.daiVanNay ? ' (đang chạy)' : ''}`)))),
    el('details', { class: 'tv-giai', open: '' },
      el('summary', {}, `Năm ${lh.canChi} ${String(lh.namAm)} · tiểu hạn ở cung ${tenCung(ls, lh.tieuHan)} · ${nam.ket === 'kho' ? 'nhiều trở ngại' : TEN[nam.ket]}`),
      ...nam.loi.map((l) => el('p', {}, l)), el('p', {}, `Lưu Thái Tuế ở cung ${tenCung(ls, lh.thaiTue)}.`)),
    el('p', { class: 'ghi-chu' }, `Đại vận, năm: Claude tổng hợp nhiều phái rồi chốt lời (đại vận là chính, năm chỉ thêm bớt). Tháng, ngày `
      + `dưới đây tính theo cách sách Tân Biên. ${HAN.ketLuan}`),
    giaDinh ? el('p', { class: 'canh-bao' }, 'Hạn tháng, ngày tính theo giờ giả định đang chọn.') : null,
    phan(`Tháng ${thang} âm · nguyệt hạn ở cung ${tenCung(ls, lh.thang)}`, lh.thang, 'trong tháng này', false,
      el('p', {}, HAN.thang), phaiKia(lh.thangPhaiKia, lh.thang, 'tháng')),
    phan(`Hôm nay ${String(lh.ngayAm)}/${thang} âm · nhật hạn ở cung ${tenCung(ls, lh.ngay)}`, lh.ngay, 'hôm nay', false,
      el('p', {}, HAN.ngay), phaiKia(lh.ngayPhaiKia, lh.ngay, 'ngày')),
    el('details', { class: 'tv-giai' }, el('summary', {}, `9 sao lưu năm ${lh.canChi}`),
      el('ul', {}, ...lh.sao.map((s) => el('li', {}, el('span', { class: loaiSao(s) }, s.ten),
        ` · cung ${tenCung(ls, s.chi)}: ${SAO_LUU[s.ten] ?? ''}`))),
      el('p', { class: 'ghi-chu' }, 'Sao lưu an như sao gốc cùng tên nhưng theo can chi năm âm đang xem (sách Tân Biên phần III mục 4); '
        + 'trên lá số ghi "L." trước tên.')),
  ].filter((x) => x !== null);
}

/** Tong luan Menh – Than (`luan.ts`, ke hoach loi giai chuyen gia 02/11): chi loi chot, nguon o `docs/LUAN_TU_VI.md`. */
function veTongLuan(ls: LaSo, namAm: number): HTMLElement {
  return el('details', { class: 'tv-giai tv-tong', open: '' }, el('summary', {}, 'Tổng luận lá số (Mệnh – Thân)'),
    ...tongLuan(ls, namAm).flatMap((d) => [el('h4', {}, d.tieuDe), ...d.loi.map((l) => el('p', {}, l))]),
    el('p', { class: 'ghi-chu' }, 'Claude tổng hợp nhiều phái tử vi (sách cổ Trung Hoa, sách và kinh nghiệm thầy Việt) rồi chốt một '
      + 'lời; chỉ để tham khảo. Luận từng cung, vận hạn theo cách này sẽ thay dần phần nghĩa từng sao khi bấm cung.'));
}

/** Luoi 12 cung + phan chi tiet cung dang chon (mac dinh cung Menh). Bam o chi doi phan chi tiet, khong ve lai luoi. */
function laSo(ls: LaSo, kq: KetQuaHoSo, ten: string, giaDinh: boolean, lh: LuuHan): HTMLElement[] {
  const chiTietCung = el('div', { class: 'tv-chi-tiet', 'aria-live': 'polite' });
  const oDaVe = ls.cung.map((c) => oCung(c, ls, lh));
  const chon = (chi: number): void => {
    oDaVe.forEach((o, i) => { o.setAttribute('aria-pressed', String(i === chi)); });
    const c = ls.cung[chi];
    if (c !== undefined) chiTietCung.replaceChildren(...chiTiet(c, ls, lh, kq.am.nam));
  };
  oDaVe.forEach((o, i) => {
    o.addEventListener('click', () => {
      chon(i);
      chiTietCung.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });
  chon(ls.menh);
  return [
    ...hanHomNay(ls, lh, giaDinh, kq.am.nam),
    el('div', { class: 'tv-luoi' }, ...oDaVe, oGiua(ls, kq, ten, giaDinh)),
    el('p', { class: 'ghi-chu tv-chu-thich' },
      'Độ sáng sao chính: M Miếu, V Vượng, Đ Đắc là sáng (đứng chỗ hợp) · B Bình là vừa · H Hãm là mờ (đứng chỗ không hợp). '
      + 'Số góc dưới: tuổi bắt đầu đại vận (tô vàng: đang chạy). '
      + 'Viền vàng: cung Mệnh. Năm, Tháng, Ngày: cung hạn theo hôm nay; "L." là sao lưu năm nay. Bấm một cung để xem đủ sao và lời giải.'),
    veTongLuan(ls, kq.am.nam),
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
    if (ls !== 'canChonGio') con.push(...laSo(ls, kq, hs.ten, kq.phut7 === null, tinhLuuHan(ls, kq.am.thang, ngayXem)));
    than.replaceChildren(...con);
  };
  ve();
  return khoi('Tử vi — lá số, hạn năm, tháng, ngày', true, than);
};
