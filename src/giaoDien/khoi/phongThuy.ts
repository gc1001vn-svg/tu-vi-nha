/**
 * Khoi "Huong tot, huong xau (cung phi …)" (`src/loi/batTrach.ts`, luan `batTrachLuan.ts` — nguon, ly do: `docs/LUAN_BAT_TRACH.md`)
 * va "Tuoi hop, tuoi ky" (luan `src/loi/tuoiHopLuan.ts` — nguon, ly do: `docs/LUAN_TUOI_HOP.md`).
 */
import { CHI } from '../../loi/amLich.ts';
import { batTrach } from '../../loi/batTrach.ts';
import { luanBatTrach } from '../../loi/batTrachLuan.ts';
import { hv } from '../../loi/hanViet/index.ts';
import { tinhHoSo } from '../../loi/hoSo.ts';
import { luanCap, luanTuoi } from '../../loi/tuoiHopLuan.ts';
import { el, khoi, lechNuocNgoai, type VeKhoi } from '../chung.ts';
import { dongMuc } from './namNay.ts';

export const veKhoiHuong: VeKhoi = (hs, tr) => {
  const k = tr.chinh;
  const bt = batTrach(k.cungPhi);
  // Sinh giua Tet va Lap Xuan: cung phi theo Tet khac mac dinh Lap Xuan (QUY_UOC muc 1) — ghi ro tren man hinh.
  const theoTet = tinhHoSo(hs, lechNuocNgoai(hs), { namCungPhi: 'tet' }).chinh.cungPhi;
  return khoi(`Hướng tốt, hướng xấu (cung phi ${k.cungPhi})`, false,
    ...bt.huong.map((h) => dongMuc(h.huong, { ten: h.sao, mucDo: h.tot ? 'tot' : 'xau', nghia: h.nghia })),
    theoTet !== k.cungPhi && el('p', { class: 'canh-bao' }, `Cung phi tính theo năm Lập Xuân; nếu tính theo Tết thì là ${theoTet}.`),
    // Luan (ke hoach 2026-11-02-bat-trach): menh quai, nha da do huong, bo tri tung viec — chi loi chot.
    ...luanBatTrach(k.cungPhi, hs.huongNha).flatMap((d) => [el('h4', {}, d.tieuDe), ...d.loi.map((l) => el('p', {}, l))]),
    el('p', { class: 'dong-muc-chu' }, 'Claude tổng hợp nhiều phái phong thủy nhà ở (sách Bát trạch cổ, cách dùng hiện nay) rồi chốt lời; '
      + 'chỉ để tham khảo.'));
};

export const veKhoiTuoiHop: VeKhoi = (_hs, tr) => {
  const k = tr.chinh;
  // So voi mot nam sinh khac: chi nhap nam, khong luu (nguoi nha: dot 9).
  const o = el('input', { type: 'text', inputmode: 'numeric', maxlength: '4', placeholder: 'vd 1990', 'aria-label': 'Năm sinh âm lịch người kia' });
  const ket = el('div', { 'aria-live': 'polite' });
  const nut = el('button', { type: 'button' }, 'So tuổi');
  const so = (): void => {
    const n = Number(o.value.trim());
    ket.replaceChildren(...(Number.isInteger(n) && n >= 1900 && n <= 2100
      ? luanCap(k.am.nam, n).filter((d) => d.tieuDe !== 'Nhìn cho đúng').flatMap((d) => [el('h4', {}, d.tieuDe), ...d.loi.map((l, i) => el('p', {}, i === 0 && d.loi.length === 1 ? el('b', {}, l) : l))])
      : [el('p', { class: 'loi' }, 'Nhập năm sinh âm lịch từ 1900 đến 2100.')]));
  };
  nut.addEventListener('click', so);
  o.addEventListener('keydown', (e) => { if (e.key === 'Enter') so(); });
  return khoi('Tuổi hợp, tuổi kỵ', false,
    el('p', {}, `Tuổi ${hv('chi', CHI.charAt(k.chiNam))} (${k.conGiap}), năm sinh tính theo Tết.`),
    ...luanTuoi(k.chiNam).flatMap((d) => [el('h4', {}, d.tieuDe), ...d.loi.map((l) => el('p', {}, l))]),
    el('h4', {}, 'So với năm sinh một người khác'),
    el('p', { class: 'ghi-chu' }, 'Nhập năm âm lịch của người kia (sinh trước Tết thì lấy năm trước). Không lưu vào máy.'),
    el('div', { class: 'nut-hang' }, o, nut), ket,
    el('p', { class: 'dong-muc-chu' }, 'Claude tổng hợp sách cổ Trung Hoa, cách xem Việt, Hàn rồi chốt lời; chỉ để tham khảo.'));
};
