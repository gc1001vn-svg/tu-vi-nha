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
import { noiGonHuong, noiGonTuoi } from '../../loi/noiGonMon.ts';
import { THUAT_NGU_HUONG, THUAT_NGU_TUOI } from '../../loi/thuatNgu.ts';
import { el, khoi, lechNuocNgoai, type VeKhoi } from '../chung.ts';
import { chiTietRanh, giaiThuatNgu, hopNoiGon, veLuan } from './deHieu.ts';
import { dongMuc } from './namNay.ts';

/** Cau "Nhiều trang Việt tính nhóm nhà theo hướng…" (cach tinh khac) → muc cho nguoi ranh. */
const laCachTinh = (l: string): boolean => l.startsWith('Nhiều trang Việt');

export const veKhoiHuong: VeKhoi = (hs, tr) => {
  const k = tr.chinh;
  const bt = batTrach(k.cungPhi);
  // Sinh giua Tet va Lap Xuan: cung phi theo Tet khac mac dinh Lap Xuan (QUY_UOC muc 1) — ghi ro tren man hinh.
  const theoTet = tinhHoSo(hs, lechNuocNgoai(hs), { namCungPhi: 'tet' }).chinh.cungPhi;
  const luan = luanBatTrach(k.cungPhi, hs.huongNha), cachTinh = luan.flatMap((d) => d.loi.filter(laCachTinh));
  const khoiHuong = khoi(`Hướng tốt, hướng xấu (cung phi ${k.cungPhi})`, false,
    hopNoiGon(noiGonHuong(k.cungPhi, hs.huongNha).cau),
    ...bt.huong.map((h) => dongMuc(h.huong, { ten: h.sao, mucDo: h.tot ? 'tot' : 'xau', nghia: h.nghia })),
    theoTet !== k.cungPhi && el('p', { class: 'canh-bao' }, `Cung phi tính theo năm Lập Xuân; nếu tính theo Tết thì là ${theoTet}.`),
    // Luan (ke hoach 2026-11-02-bat-trach): menh quai, nha da do huong, bo tri tung viec — chi loi chot.
    ...veLuan(luan, cachTinh),
    cachTinh.length === 0 ? null : chiTietRanh(...cachTinh.map((l) => el('p', {}, l))),
    el('p', { class: 'dong-muc-chu ghi-chu' }, 'Lời giải do Claude tổng hợp nhiều phái phong thủy nhà ở (sách Bát trạch cổ, cách dùng hiện nay) '
      + 'rồi soạn lại, chốt lời; chỉ để tham khảo.'));
  giaiThuatNgu([khoiHuong], THUAT_NGU_HUONG);
  return khoiHuong;
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
    giaiThuatNgu([ket], THUAT_NGU_TUOI);
  };
  nut.addEventListener('click', so);
  o.addEventListener('keydown', (e) => { if (e.key === 'Enter') so(); });
  // "Chỗ tục Việt khác sách" (so sach voi tuc) → muc cho nguoi ranh (QUY_UOC muc 44).
  const luan = luanTuoi(k.chiNam), ranh = luan.filter((d) => d.tieuDe.startsWith('Chỗ tục Việt'));
  const khoiTuoi = khoi('Tuổi hợp, tuổi kỵ', false,
    hopNoiGon(noiGonTuoi(k.chiNam).cau),
    el('p', {}, `Tuổi ${hv('chi', CHI.charAt(k.chiNam))} (${k.conGiap}), năm sinh tính theo Tết.`),
    ...veLuan(luan.filter((d) => !ranh.includes(d))),
    el('h4', {}, 'So với năm sinh một người khác'),
    el('p', { class: 'ghi-chu' }, 'Nhập năm âm lịch của người kia (sinh trước Tết thì lấy năm trước). Không lưu vào máy.'),
    el('div', { class: 'nut-hang' }, o, nut), ket,
    chiTietRanh(...veLuan(ranh)),
    el('p', { class: 'dong-muc-chu ghi-chu' }, 'Lời giải do Claude tổng hợp sách cổ Trung Hoa, cách xem Việt, Hàn rồi soạn lại, chốt lời; chỉ để tham khảo.'));
  giaiThuatNgu([khoiTuoi], THUAT_NGU_TUOI);
  return khoiTuoi;
};
