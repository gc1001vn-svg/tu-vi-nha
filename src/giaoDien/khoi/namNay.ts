/**
 * Khoi "Nam <can chi> <nam> — tuoi mu N" (`src/loi/namNay.ts`): sao, han, Kim Lau, Hoang Oc, Tam Tai, Thai Tue.
 * `dongMuc` (muc xau to do, tot to xanh — `namNay.css`) dung chung cho khoi phong thuy.
 */
import { namNay, type Muc } from '../../loi/namNay.ts';
import { el, khoi, type VeKhoi } from '../chung.ts';
import './namNay.css';

export const LOI_SOAN = 'Lời do Claude soạn lại theo quan niệm dân gian.';

/** Mot dong: nhan · ten (to mau theo tot/xau) · mot dong nghia ben duoi. */
export const dongMuc = (nhan: string, m: Muc): HTMLElement =>
  el('div', { class: `dong dong-muc ${m.mucDo}` }, el('span', { class: 'nhan' }, nhan), el('b', {}, m.ten),
    el('span', { class: 'dong-muc-nghia' }, m.nghia));

export const veKhoiNamNay: VeKhoi = (hs, tr, ngayXem) => {
  const k = tr.chinh;
  const n = namNay(hs, k, ngayXem);
  return khoi(`Năm ${n.canChi} ${String(n.namAm)} — tuổi mụ ${String(n.tuoiMu)}`, true,
    dongMuc('Sao', n.sao), dongMuc('Hạn', n.han), dongMuc('Kim Lâu', n.kimLau), dongMuc('Hoang Ốc', n.hoangOc),
    dongMuc('Tam Tai', n.tamTai), dongMuc('Thái Tuế', n.thaiTue),
    tr.khac.some((p) => p.ketQua.am.nam !== k.am.nam)
      && el('p', { class: 'canh-bao' }, 'Giờ sinh sát Tết: nếu tính sang năm âm khác thì các mục trên đổi theo.'),
    el('p', { class: 'dong-muc-chu' }, `Theo tuổi mụ, năm âm tính từ Tết. ${LOI_SOAN}`));
};
