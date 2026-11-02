/**
 * Luan Bat trach (ke hoach `docs/ke-hoach/2026-11-02-bat-trach.md`; nguon, cach chot: `docs/LUAN_BAT_TRACH.md`): menh quai; nha —
 * trach quai theo TOA (*Bat Trach Minh Kinh*: "toa son cua nha la cung Phuc Duc"), menh – trach cung nhom hay khong va cach go theo thu
 * tu sach (doi cua, chon phong, xoay giuong), cua chinh hop menh, phuong tot / xau trong nha; bo tri tung viec theo *Duong Trach Tam
 * Yeu* (cua, cho chu nha ngu, bep) va cach dung hien nay. Loi o `batTrachLuanLoi.ts`. Thuoc: `tests/LuanBatTrach.test.ts`.
 */
import { batTrach, type BatTrach } from './batTrach.ts';
import { BO_TRI, HANH, MENH, NHA } from './batTrachLuanLoi.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { xemLaBan } from './laBan.ts';

const ds = (bt: BatTrach, tot: boolean): string => bt.huong.filter((h) => h.tot === tot).map((h) => `${h.huong} (${h.sao})`).join(', ');

/** Ba doan: menh quai, nha (khi da do huong; `huongNha` la do cua huong mat nha), bo tri theo huong tot cua minh. */
export function luanBatTrach(cungPhi: string, huongNha?: number): DoanLuan[] {
  const bt = batTrach(cungPhi);
  const h = (sao: string): string => bt.huong.find((x) => x.sao === sao)?.huong ?? '';
  const nha = ((): DoanLuan => {
    if (huongNha === undefined) return { tieuDe: 'Nhà', loi: [NHA.chuaDo] };
    const x = xemLaBan(huongNha), bn = batTrach(x.toa.quai), bnHuong = batTrach(x.huong.quai);
    const cua = bt.huong.find((k) => k.huong === x.huong.huong);
    const hopNhom = bn.nhom === bt.nhom;
    return { tieuDe: `Nhà tọa ${x.toa.huong} hướng ${x.huong.huong} — ${x.toa.quai} trạch (${bn.nhom.replace('mệnh', 'trạch')})`, loi: [
      hopNhom ? NHA.hop(bt.nhom) : NHA.khongHop,
      cua === undefined ? '' : NHA.cua(x.huong.huong, cua.sao, cua.tot),
      NHA.phuongTot(ds(bn, true)), NHA.phuongXau(ds(bn, false)),
      // Truc Dong – Tay, Dong Nam – Tay Bac: toa, huong khac nhom — trang tinh nhom theo huong nha se ra nguoc (docs muc 3).
      bnHuong.nhom === bn.nhom ? '' : NHA.theoHuong(bnHuong.nhom.replace('mệnh', 'trạch')),
    ].filter((l) => l !== '') };
  })();
  return [
    { tieuDe: `Mệnh quái ${cungPhi} (${HANH[cungPhi] ?? ''}) — ${bt.nhom}`, loi: [MENH(bt.nhom, h('Sinh Khí'), h('Tuyệt Mệnh'))] },
    nha,
    { tieuDe: 'Bố trí theo hướng tốt của mình', loi: [
      BO_TRI.cua(h('Sinh Khí'), h('Thiên Y'), h('Diên Niên')), BO_TRI.giuong(h('Thiên Y'), h('Diên Niên'), h('Sinh Khí')),
      BO_TRI.ban(h('Sinh Khí'), h('Phục Vị')), BO_TRI.bep(h('Tuyệt Mệnh'), h('Ngũ Quỷ'), h('Thiên Y'), h('Sinh Khí')),
      BO_TRI.tho(h('Phục Vị'), h('Diên Niên')), BO_TRI.wc(h('Tuyệt Mệnh'), h('Ngũ Quỷ')), BO_TRI.nhieuNguoi,
    ] },
  ];
}
