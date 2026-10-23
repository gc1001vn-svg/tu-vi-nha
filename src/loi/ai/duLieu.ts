/**
 * Goi du lieu gui AI (dot 7 phan 1): chi so may da tinh — KHONG ten nguoi, KHONG khoa API. Moi mon mot muc "## …", chu gon
 * de AI doc va de `kiemBia.ts` so ten rieng trong loi AI voi chuoi nay. Loi thuan: ngay xem va phut lech mui gio nuoc ngoai
 * nhan qua tham so. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { CHI, canChiNam, dinhDangAm, dinhDangNgay, duongSangAm, type NgayDuong } from '../amLich.ts';
import { batTrach } from '../batTrach.ts';
import { tinhBatTu, type Tru } from '../batTu.ts';
import { DIEM, GOC, dinhDang, gocChieu, laSoNguoi, nhaCua } from '../chiemTinh.ts';
import { hv } from '../hanViet/index.ts';
import { moTaKhac, tuoiMu, type HoSo, type TinhRa } from '../hoSo.ts';
import type * as KinhDichTinh from '../kinhDich.ts';
import type * as KinhDichChu from '../kinhDichChu.ts';
import type * as KinhDichGiai from '../kinhDichGiai.ts';
import { xemLaBan } from '../laBan.ts';
import { namNay, type Muc } from '../namNay.ts';
import { nhipSinhHoc, tenSo, thanSo } from '../soHoc.ts';
import type * as TarotMod from '../tarot.ts';
import { NUOC_NGOAI } from '../tinh.ts';
import { tuoiHop } from '../tuoiHop.ts';
import { tinhTuVi, type Sao } from '../tuVi/laSo.ts';
import { danhGiaHan, tinhLuuHan } from '../tuVi/luuHan.ts';

type KinhDich = typeof KinhDichTinh & typeof KinhDichChu & typeof KinhDichGiai;
type Tarot = typeof TarotMod;

const tenChi = (i: number): string => hv('chi', CHI.charAt(i));
const DO_SANG = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình', H: 'Hãm' } as const;
const muc = (tieuDe: string, dong: readonly (string | null)[]): string =>
  [`## ${tieuDe}`, ...dong.filter((d) => d !== null && d !== '')].join('\n');
const so1 = (x: number): string => x.toFixed(1).replace('.', ',');

function nguoiXem(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const k = tr.chinh;
  const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
  const noi = hs.noiSinh === NUOC_NGOAI ? `nước ngoài (múi giờ ${hs.muiGio ?? '?'})` : hs.noiSinh;
  const am = duongSangAm(ngayXem);
  return muc('Người xem', [
    `Giới tính: ${hs.gioiTinh === 'nam' ? 'nam' : 'nữ'}. Sinh ngày ${dinhDangNgay({ nam, thang, ngay })} dương lịch, `
      + `${hs.gioSinh === null ? 'không rõ giờ' : `lúc ${hs.gioSinh} (giờ đồng hồ lúc đó)`}, nơi sinh ${noi}.`,
    `Âm lịch ${dinhDangAm(k.am)}: năm ${k.canChiNam}, tháng ${k.canChiThang}, ngày ${k.canChiNgay}`
      + `${k.chiGio === null ? '' : `, giờ ${k.chiGio}`}. Tuổi ${k.conGiap}.`,
    `Mệnh ${k.napAm} (hành ${k.hanhMenh}). Cung phi ${k.cungPhi} (hành ${k.hanhCungPhi}).`,
    `Hôm nay ${dinhDangNgay(ngayXem)} (âm ${dinhDangAm(am)}), ${String(tuoiMu(k.am.nam, ngayXem))} tuổi mụ.`,
    ...tr.canhBao.map((c) => `Lưu ý: ${c}`),
    ...tr.khac.map((p) => `${p.lyDo} thì khác ở: ${moTaKhac(p.khac, p.ketQua)}.`),
  ]);
}

const tenSao = (s: Sao): string => (s.doSang === null ? s.ten : `${s.ten} (${DO_SANG[s.doSang]})`);

function tuVi(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const kq = tr.chinh;
  const ls = tinhTuVi(hs, kq, ngayXem);
  if (ls === 'canChonGio') return muc('Tử vi', ['Không rõ giờ sinh nên chưa lập được lá số tử vi (cần giờ sinh).']);
  const lh = tinhLuuHan(ls, kq.am.thang, ngayXem);
  const tenCung = (chi: number): string => `${ls.cung[chi]?.ten ?? ''} (${tenChi(chi)})`;
  const cung = ls.cung.map((c) => {
    const chinh = c.sao.filter((s) => s.loai === 1).map(tenSao);
    const tot = c.sao.filter((s) => s.loai > 1 && s.loai < 10).map(tenSao);
    const xau = c.sao.filter((s) => s.loai > 10).map(tenSao);
    return [`- ${c.ten} (${tenChi(c.chi)}, ${c.canChi})${c.chi === ls.menh ? ' · cung Mệnh' : ''}${c.chi === ls.than ? ' · Thân cư' : ''}`,
      `đại vận ${String(c.daiVan)}–${String(c.daiVan + 9)} tuổi${c.chi === ls.daiVanNay ? ' (đang chạy)' : ''}`,
      chinh.length === 0 ? 'vô chính diệu' : `chính tinh: ${chinh.join(', ')}`,
      ...(tot.length === 0 ? [] : [`sao tốt: ${tot.join(', ')}`]), ...(xau.length === 0 ? [] : [`sao xấu: ${xau.join(', ')}`]),
      ...(c.tuan ? ['có Tuần'] : []), ...(c.triet ? ['có Triệt'] : [])].join(' · ');
  });
  const han = (ten: string, chi: number): string => {
    const d = danhGiaHan(ls, lh, chi);
    return `${ten} ở cung ${tenCung(chi)}: hạn ${d.ket} (${String(d.tot)} sao tốt, ${String(d.xau)} sao xấu trong ${String(d.tong)} sao hội về).`;
  };
  return muc('Tử vi (lá số theo sách Tử Vi Đẩu Số Tân Biên)', [
    `${ls.amDuong}, ${ls.cuc}. Mệnh chủ ${ls.menhChu}, Thân chủ ${ls.thanChu}. Mệnh ở cung ${tenChi(ls.menh)}, `
      + `Thân cư ${tenCung(ls.than)}. Năm xem ${String(ls.tuoi)} tuổi mụ.`,
    '12 cung (tên, chi, can chi; độ sáng sao chính: Miếu, Vượng, Đắc sáng, Bình vừa, Hãm mờ):',
    ...cung,
    `Đại vận đang chạy: ${ls.daiVanNay === null ? 'chưa vào đại vận đầu' : `cung ${tenCung(ls.daiVanNay)}`}.`,
    han(`Năm ${lh.canChi} ${String(lh.namAm)}: tiểu hạn`, lh.tieuHan),
    `Lưu Thái Tuế năm ${lh.canChi} ở cung ${tenCung(lh.thaiTue)}.`,
    han(`Tháng ${String(lh.thangAm)}${lh.nhuan ? ' nhuận' : ''} âm: nguyệt hạn`, lh.thang),
    han(`Hôm nay (${String(lh.ngayAm)}/${String(lh.thangAm)} âm): nhật hạn`, lh.ngay),
    `Sao lưu năm ${lh.canChi}: ${lh.sao.map((s) => `${s.ten} ở cung ${tenCung(s.chi)}`).join('; ')}.`,
  ]);
}

function nam(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const n = namNay(hs, tr.chinh, ngayXem);
  const dong = (nhan: string, m: Muc): string => `${nhan}: ${m.ten} (${m.mucDo === 'tot' ? 'tốt' : m.mucDo === 'xau' ? 'xấu' : 'vừa'}) — ${m.nghia}`;
  return muc(`Năm nay (năm âm ${n.canChi} ${String(n.namAm)}, ${String(n.tuoiMu)} tuổi mụ, tính từ Tết)`, [
    dong('Sao chiếu mệnh', n.sao), dong('Hạn', n.han), dong('Kim Lâu', n.kimLau), dong('Hoang Ốc', n.hoangOc),
    dong('Tam Tai', n.tamTai), dong('Thái Tuế', n.thaiTue),
  ]);
}

function batTu(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const b = tinhBatTu(hs, tr.chinh, ngayXem);
  const tru = (ten: string, t: Tru | null): string => (t === null ? `Trụ ${ten}: không rõ giờ sinh.`
    : `Trụ ${ten}: ${t.can} ${t.chi} — can ${t.can} là ${t.thapThan}; tàng can ${t.tangCan.map((c) => `${c.can} (${c.thapThan})`).join(', ')}`
      + `; nạp âm ${t.napAm}; trường sinh ${t.truongSinh}.`);
  const van = b.daiVan.find((v) => v.dangChay);
  return muc('Bát tự (tứ trụ)', [
    ...(['năm', 'tháng', 'ngày', 'giờ'] as const).map((ten, i) => tru(ten, b.tru[i] ?? null)),
    `Nhật chủ ${b.nhatChu}. Ngũ hành (đếm can, chi; không tính tàng can): ${b.nguHanh.map((x) => `${x.hanh} ${String(x.so)}`).join(', ')}.`,
    `Theo quan hệ với nhật chủ: ${b.nhomHanh.map((x) => `${x.nhom} (hành ${x.hanh}) ${String(x.so)}`).join(', ')}.`,
    `Không vong: ${b.khongVong}. Khởi vận ${String(b.khoiVan.nam)} năm ${String(b.khoiVan.thang)} tháng ${String(b.khoiVan.ngay)} ngày `
      + `sau khi sinh, đi ${b.thuan ? 'thuận' : 'nghịch'}.`,
    `Đại vận (tuổi mụ bắt đầu, can chi, năm bắt đầu): ${b.daiVan.map((v) => `${String(v.tuoi)} tuổi ${v.canChi} (${String(v.batDau.nam)})`).join('; ')}.`,
    van === undefined ? 'Hôm nay chưa vào đại vận nào.'
      : `Đại vận đang chạy ${van.canChi}: can là ${van.thapThan[0]}, chi (can chính ẩn ${van.tang}) là ${van.thapThan[1]}.`,
    `Năm nay ${b.namNay.canChi} (tính từ Lập Xuân): can là ${b.namNay.thapThan[0]}, chi (can chính ẩn ${b.namNay.tang}) là ${b.namNay.thapThan[1]}.`,
    ...b.ghiChu.map((c) => `Lưu ý: ${c}`),
  ]);
}

function huong(hs: HoSo, tr: TinhRa): string {
  const bt = batTrach(tr.chinh.cungPhi);
  const nha = hs.huongNha === undefined ? undefined : xemLaBan(hs.huongNha).huong;
  const sao = bt.huong.find((h) => h.huong === nha?.huong);
  return muc(`Hướng nhà (Bát trạch theo cung phi ${tr.chinh.cungPhi})`, [
    `${bt.nhom}. ${bt.huong.map((h) => `${h.huong}: ${h.sao} (${h.tot ? 'tốt' : 'xấu'})`).join('; ')}.`,
    nha === undefined || sao === undefined ? null
      : `Nhà đã đo bằng la bàn: ${String(nha.do)}° hướng ${nha.huong} (sơn ${nha.son}) — ${sao.sao} (${sao.tot ? 'tốt' : 'xấu'}).`,
  ]);
}

function tuoi(tr: TinhRa): string {
  const t = tuoiHop(tr.chinh.chiNam);
  return muc('Tuổi hợp, tuổi kỵ (theo chi năm sinh)', [
    `Tuổi ${tenChi(tr.chinh.chiNam)}: tam hợp ${t.tamHop.join(', ')}; lục hợp ${t.lucHop}; tứ hành xung ${t.tuHanhXung.join(', ')}; `
      + `lục xung ${t.lucXung}; lục hại ${t.lucHai}.`,
  ]);
}

function soHoc(hs: HoSo, ngayXem: NgayDuong): string {
  const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
  const sinh = { nam, thang, ngay };
  const t = thanSo(sinh, ngayXem);
  const n = nhipSinhHoc(sinh, ngayXem);
  return [
    muc('Thần số học (ngày sinh dương lịch)', [
      `Số chủ đạo ${tenSo(t.chuDao)}; số ngày sinh ${String(t.ngaySinh)}; năm cá nhân ${String(t.namXem)}: ${String(t.namCaNhan)}; `
        + `tháng cá nhân ${String(ngayXem.thang)}/${String(ngayXem.nam)}: ${String(t.thangCaNhan)}.`,
      `Biểu đồ ngày sinh (số lần mỗi chữ số 1–9): ${t.luoi.map((x, i) => `${String(i + 1)}×${String(x)}`).join(', ')}.`,
    ]),
    muc(`Nhịp sinh học hôm nay (ngày thứ ${String(n.ngay)} kể từ ngày sinh)`, [
      n.nhip.map((x) => `${x.ten} ${x.phanTram > 0 ? '+' : ''}${String(x.phanTram)}% ${x.len ? 'đang lên' : 'đang xuống'}`
        + (x.nguy ? ' (ngày đổi dấu)' : '')).join('; ') + '.',
    ]),
  ].join('\n\n');
}

function chiemTinh(hs: HoSo, lechNuoc: number | undefined): string {
  const r = laSoNguoi(hs, lechNuoc);
  const ls = r.laSo;
  const diem = ls.diem.map((d, i) => `${DIEM[i] ?? ''} ${dinhDang(d.kinh)}${ls.nha === null ? '' : `, nhà ${String(nhaCua(d.kinh, ls.nha))}`}`
    + (d.nghich ? ', nghịch hành' : ''));
  return muc('Chiêm tinh (hoàng đạo nhiệt đới, nhà Placidus, Bắc Giao Điểm trung bình)', [
    `${diem.join('; ')}.`,
    ls.moc === null || ls.dinh === null ? null : `Cung Mọc ${dinhDang(ls.moc)}; Thiên Đỉnh ${dinhDang(ls.dinh)}.`,
    `Góc chiếu: ${gocChieu(ls).map((g) => `${DIEM[g.a] ?? ''} ${GOC[g.goc]?.ten.toLowerCase() ?? ''} ${DIEM[g.b] ?? ''} (lệch ${so1(g.orb)}°)`).join('; ')}.`,
    ...r.ghiChu.map((c) => `Lưu ý: ${c}`),
    ...r.phuongAn.map((p) => `${p.lyDo}: ${p.khac}.`),
  ]);
}

/** Du lieu mot nguoi gui AI: moi mon da tinh, theo thu tu khoi tren man hinh. Mon nao loi thi ghi loi, cac mon khac van gui. */
export function duLieuNguoi(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong, lechNuoc: number | undefined): string {
  const phan: (() => string)[] = [
    (): string => nguoiXem(hs, tr, ngayXem), (): string => tuVi(hs, tr, ngayXem), (): string => nam(hs, tr, ngayXem),
    (): string => batTu(hs, tr, ngayXem),
    (): string => huong(hs, tr), (): string => tuoi(tr), (): string => soHoc(hs, ngayXem), (): string => chiemTinh(hs, lechNuoc),
  ];
  return phan.map((f) => {
    try {
      return f();
    } catch (e) {
      return `## (Một mục không tính được: ${e instanceof Error ? e.message : String(e)})`;
    }
  }).join('\n\n');
}

/** Que Kinh Dich vua gieo: que chu, hao dong, que bien, que ho, Mai Hoa (neu co), cac doan nen doc kem nguyen van + loi app. */
export function duLieuQue(k: KinhDich, g: KinhDichTinh.Gieo, mh: KinhDichTinh.MaiHoaGio | null): string {
  const ten = (so: number): string => { const q = k.QUE[so - 1]; return q === undefined ? '' : `quẻ ${String(so)} ${q.tenDu} (${q.han})`; };
  const doan = k.doanCanDoc(g).map((d) => {
    const q = k.QUE[d.que - 1];
    const gi = k.GIAI[d.que - 1];
    const [nhan, nguyen, giai] = d.loai === 'dung'
      ? [d.que === 1 ? 'Dụng Cửu (quẻ Càn)' : 'Dụng Lục (quẻ Khôn)', d.que === 1 ? k.DUNG_CUU : k.DUNG_LUC, d.que === 1 ? k.GIAI_DUNG_CUU : k.GIAI_DUNG_LUC]
      : d.loai === 'thoan' ? [`Lời ${ten(d.que)}`, q?.thoan ?? '', gi?.que ?? '']
        : [`Hào ${String(d.hao)} (${k.tenHao(d.que, d.hao)}) ${ten(d.que)}`, q?.hao[d.hao - 1] ?? '', gi?.hao[d.hao - 1] ?? ''];
    return `- ${nhan}${d.chinh ? ' (đọc chính)' : ''}: nguyên văn "${nguyen}"; app giải: ${giai}`;
  });
  return muc('Quẻ Kinh Dịch vừa gieo', [
    mh === null ? 'Cách gieo: tung ba đồng xu sáu lần.' : `Cách gieo: Mai Hoa theo năm, tháng, ngày, giờ âm lịch (âm ${dinhDangAm(mh.am)}, `
      + `năm ${canChiNam(mh.am.nam)}, giờ ${tenChi(mh.soGio - 1)}).`,
    `Quẻ chủ: ${ten(g.chu)}. Sáu hào từ dưới lên: ${g.hao.map((h) => (h % 2 === 1 ? 'dương' : 'âm') + (h === 6 || h === 9 ? ' động' : '')).join(', ')}.`,
    g.dong.length === 0 ? 'Không có hào động.' : `Hào động: ${g.dong.map((h) => `${String(h)} (${k.tenHao(g.chu, h)})`).join(', ')}.`,
    g.bien === null ? null : `Quẻ biến: ${ten(g.bien)}.`,
    `Quẻ hỗ: ${ten(g.ho)}.`,
    mh === null ? null : `Thể ${k.quai(mh.the).ten} (${k.quai(mh.the).hanh}), Dụng ${k.quai(mh.dung).ten} (${k.quai(mh.dung).hanh}): `
      + `${k.LUAN[mh.quanHe].ten} — ${k.LUAN[mh.quanHe].loi}`,
    'Đoạn nên đọc theo số hào động (luật Chu Hy):',
    ...doan,
  ]);
}

/** Trai tarot vua rut: kieu trai, tung vi tri (y nghia vi tri), la (ten Anh, ten Viet), xuoi/nguoc, nghia app soan. */
export function duLieuTarot(t: Tarot, kieu: keyof Tarot['TRAI'], rut: readonly TarotMod.LaRut[]): string {
  const trai = t.TRAI[kieu];
  return muc(`Trải tarot vừa rút: ${trai.ten} (bộ bài 1909 Rider–Waite–Smith)`, rut.map((r, i) => {
    const la = t.LA[r.so];
    const [vt = '', yNghia = ''] = trai.viTri[i] ?? [];
    return la === undefined ? null : `- ${vt} (${yNghia}): ${la.anh} — ${la.ten}${r.nguoc ? ', lá ngược' : ', lá xuôi'}. `
      + `App giải: ${r.nguoc ? la.nguoc : la.xuoi}`;
  }));
}
