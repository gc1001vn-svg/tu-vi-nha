/**
 * Khoi "Huong tot, huong xau (cung phi …)" (`src/loi/batTrach.ts`) va "Tuoi hop, tuoi ky" (`src/loi/tuoiHop.ts`).
 */
import { CHI } from '../../loi/amLich.ts';
import { batTrach } from '../../loi/batTrach.ts';
import { hv } from '../../loi/hanViet/index.ts';
import { tinhHoSo } from '../../loi/hoSo.ts';
import { tuoiHop } from '../../loi/tuoiHop.ts';
import { el, khoi, lechNuocNgoai, type VeKhoi } from '../chung.ts';
import { LOI_SOAN, dongMuc } from './namNay.ts';

export const veKhoiHuong: VeKhoi = (hs, tr) => {
  const k = tr.chinh;
  const bt = batTrach(k.cungPhi);
  // Sinh giua Tet va Lap Xuan: cung phi theo Tet khac mac dinh Lap Xuan (QUY_UOC muc 1) — ghi ro tren man hinh.
  const theoTet = tinhHoSo(hs, lechNuocNgoai(hs), { namCungPhi: 'tet' }).chinh.cungPhi;
  return khoi(`Hướng tốt, hướng xấu (cung phi ${k.cungPhi})`, false,
    el('p', {}, `${bt.nhom}: hướng tốt ${bt.huong.filter((h) => h.tot).map((h) => h.huong).join(', ')}.`),
    ...bt.huong.map((h) => dongMuc(h.huong, { ten: h.sao, mucDo: h.tot ? 'tot' : 'xau', nghia: h.nghia })),
    theoTet !== k.cungPhi && el('p', { class: 'canh-bao' }, `Cung phi tính theo năm Lập Xuân; nếu tính theo Tết thì là ${theoTet}.`),
    el('p', { class: 'dong-muc-chu' }, `Bát trạch: chọn hướng nhà, cửa, giường theo cung phi. ${LOI_SOAN}`));
};

export const veKhoiTuoiHop: VeKhoi = (_hs, tr) => {
  const k = tr.chinh;
  const t = tuoiHop(k.chiNam);
  return khoi('Tuổi hợp, tuổi kỵ', false,
    el('p', {}, `Tuổi ${hv('chi', CHI.charAt(k.chiNam))} (${k.conGiap}), năm sinh tính theo Tết.`),
    dongMuc('Tam hợp', { ten: t.tamHop.join(', '), mucDo: 'tot', nghia: 'Hợp nhau nhất: làm ăn, kết bạn, cưới hỏi đều thuận.' }),
    dongMuc('Lục hợp', { ten: t.lucHop, mucDo: 'tot', nghia: 'Hợp đôi: dễ thương nhau, nâng đỡ nhau.' }),
    dongMuc('Tứ hành xung', { ten: t.tuHanhXung.join(', '), mucDo: 'xau', nghia: 'Dễ bất đồng; việc lớn làm chung nên cân nhắc.' }),
    dongMuc('Lục xung', { ten: t.lucXung, mucDo: 'xau', nghia: 'Xung mạnh nhất: dân gian kiêng cưới hỏi, hùn hạp.' }),
    dongMuc('Lục hại', { ten: t.lucHai, mucDo: 'xau', nghia: 'Dễ hiểu lầm, ngấm ngầm làm hại nhau.' }),
    el('p', { class: 'dong-muc-chu' }, LOI_SOAN));
};
