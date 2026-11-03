/**
 * Goi du lieu gui AI (dot 7 phan 1): chi so may da tinh — KHONG ten nguoi, KHONG khoa API. Moi mon mot muc "## …", chu gon
 * de AI doc va de `kiemBia.ts` so ten rieng trong loi AI voi chuoi nay. Loi thuan: ngay xem va phut lech mui gio nuoc ngoai
 * nhan qua tham so. Ke hoach: `docs/ke-hoach/2026-10-23-dot-7.md`.
 */
import { CHI, canChiNam, dinhDangAm, dinhDangNgay, duongSangAm, type NgayDuong } from '../amLich.ts';
import { batTrach } from '../batTrach.ts';
import { tinhBatTu, type Tru } from '../batTu.ts';
import { DIEM, GOC, dinhDang, laSoNguoi, nhaCua } from '../chiemTinh.ts';
import { hv } from '../hanViet/index.ts';
import { moTaKhac, tuoiMu, type GioiTinh, type HoSo, type TinhRa } from '../hoSo.ts';
import type * as KinhDichTinh from '../kinhDich.ts';
import type * as KinhDichChu from '../kinhDichChu.ts';
import type * as KinhDichGiai from '../kinhDichGiai.ts';
import { xemLaBan } from '../laBan.ts';
import { namNay, type Muc } from '../namNay.ts';
import { nhipSinhHoc, tenSo, thanSo } from '../soHoc.ts';
import type * as TarotMod from '../tarot.ts';
import type * as TarotLuan from '../tarotLuan.ts';
import { NUOC_NGOAI } from '../tinh.ts';
import { luanTuoi } from '../tuoiHopLuan.ts';
import type { SoDoMat } from '../tuongMat.ts';
import { QUY_LUAT_CHUNG, giaiChiTay, mucTin, type KhungChiTay, type Luat } from '../chiTay.ts';
import { CAC_KHOA, GIAI, SO_ANH_MAU, dangSo, giaiMat, type MatDoGiai } from '../tuongMatGiai.ts';
import { luanMat, mucXet, netChot } from '../tuongMatLuan.ts';
import { luanTay } from '../chiTayLuan.ts';
import type * as KinhDichLuan from '../kinhDichLuan.ts';
import { tinhTuVi, type Sao } from '../tuVi/laSo.ts';
import { NGUONG_CUNG, diemCung, luanDaiVan, luanNam, tongLuan } from '../tuVi/luan.ts';
import { CHU_DE } from '../tuVi/nghia.ts';
import { dsVanBT, luanNamBT, luanViec, phanTich, tongLuanBT } from '../batTuLuan.ts';
import { tongLuanTS, vanTS } from '../soHocLuan.ts';
import { gocChinh, tongLuanCT, type DoanLuan } from '../chiemTinhLuan.ts';
import { luanBatTrach } from '../batTrachLuan.ts';
import { luanNamNay } from '../namNayLuan.ts';
import { danhGiaHan, tinhLuuHan } from '../tuVi/luuHan.ts';

type KinhDich = typeof KinhDichTinh & typeof KinhDichChu & typeof KinhDichGiai & typeof KinhDichLuan;
type Tarot = typeof TarotMod & typeof TarotLuan;

const tenChi = (i: number): string => hv('chi', CHI.charAt(i));
const DO_SANG = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình', H: 'Hãm' } as const;
const muc = (tieuDe: string, dong: readonly (string | null)[]): string =>
  [`## ${tieuDe}`, ...dong.filter((d) => d !== null && d !== '')].join('\n');
const so1 = (x: number): string => x.toFixed(1).replace('.', ',');

/**
 * Loi chot gui AI phai gon (han muc 8.000 token/phut tinh ca dau ra xin truoc, `vuaHanMuc`): moi doan chi lay cau dau, cat o ranh tu.
 * AI duoc dan lay "Lời chốt của app" lam ket luan chinh cua mon (`LOI_DAN` luat 3).
 */
export function cau(s: string, toi = 90): string {
  const het = s.search(/[.!?](\s|$)/u);
  if (het >= 0 && het < toi) return s.slice(0, het);
  if (s.length <= toi) return s.replace(/[.!?]$/u, '');
  const cat = s.lastIndexOf(' ', toi);
  return `${s.slice(0, cat > 0 ? cat : toi).replace(/[,;:—–\s]+$/u, '')}…`;
}
const cham = (x: string): string => (x.endsWith('…') ? x : `${x}.`);
const tomTat = (xs: readonly DoanLuan[], toi = 90): string => cham(xs.map((d) => `${d.tieuDe}: ${cau(d.loi[0] ?? '', toi)}`).join(' · '));
const KET_CHU: Readonly<Record<string, string>> = { thuan: 'thuận', vua: 'vừa', kho: 'cần giữ gìn' };

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
/** Phu tinh lon gui AI (luc cat, luc sat, tu hoa, Loc Ton, Thien Ma, sao dao hoa): du 12 cung moi sao thi qua dai cho han muc; app luan du sao. */
const PHU_LON = new Set(['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Thiên Mã', 'Hóa Lộc', 'Hóa Quyền',
  'Hóa Khoa', 'Hóa Kỵ', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Đào Hoa', 'Hồng Loan', 'Thiên Hỷ',
  'Thiên Hình', 'Thiên Riêu']);

function tuVi(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const kq = tr.chinh;
  const ls = tinhTuVi(hs, kq, ngayXem);
  if (ls === 'canChonGio') return muc('Tử vi', ['Không rõ giờ sinh nên chưa lập được lá số tử vi (cần giờ sinh).']);
  const lh = tinhLuuHan(ls, kq.am.thang, ngayXem);
  const tenCung = (chi: number): string => `${ls.cung[chi]?.ten ?? ''} (${tenChi(chi)})`;
  const cung = ls.cung.map((c) => {
    const chinh = c.sao.filter((s) => s.loai === 1).map(tenSao);
    const tot = c.sao.filter((s) => s.loai > 1 && s.loai < 10 && PHU_LON.has(s.ten)).map(tenSao);
    const xau = c.sao.filter((s) => s.loai > 10 && PHU_LON.has(s.ten)).map(tenSao);
    // Nghia ngan cua cung (do 03/11: AI tung lay "Phụ Mẫu … cần lưu ý" de noi chuyen vo chong).
    return [`- ${c.ten} — ${(CHU_DE[c.ten] ?? '').split(',')[0] ?? ''} (${tenChi(c.chi)}, ${c.canChi})${c.chi === ls.menh ? ' · cung Mệnh' : ''}${c.chi === ls.than ? ' · Thân cư' : ''}`,
      `đại vận ${String(c.daiVan)}–${String(c.daiVan + 9)} tuổi${c.chi === ls.daiVanNay ? ' (đang chạy)' : ''}`,
      chinh.length === 0 ? 'vô chính diệu' : `chính tinh: ${chinh.join(', ')}`,
      ...(tot.length === 0 ? [] : [`sao tốt: ${tot.join(', ')}`]), ...(xau.length === 0 ? [] : [`sao xấu: ${xau.join(', ')}`]),
      ...(c.tuan ? ['có Tuần'] : []), ...(c.triet ? ['có Triệt'] : []),
      `app chấm: ${((d: number): string => (d >= NGUONG_CUNG.tot ? 'tốt' : d < NGUONG_CUNG.kem ? 'cần lưu ý' : 'vừa'))(diemCung(ls, c.chi))}`].join(' · ');
  });
  const ln = luanNam(ls, lh, kq.am.nam);
  const dv = ls.daiVanNay === null ? null : luanDaiVan(ls, ls.daiVanNay, kq.am.nam);
  const han = (ten: string, chi: number): string => {
    const d = danhGiaHan(ls, lh, chi);
    return `${ten} ở cung ${tenCung(chi)}: hạn ${d.ket} (${String(d.tot)} sao tốt, ${String(d.xau)} sao xấu trong ${String(d.tong)} sao hội về).`;
  };
  return muc('Tử vi (lá số theo sách Tử Vi Đẩu Số Tân Biên)', [
    `${ls.amDuong}, ${ls.cuc}. Mệnh chủ ${ls.menhChu}, Thân chủ ${ls.thanChu}. Mệnh ở cung ${tenChi(ls.menh)}, `
      + `Thân cư ${tenCung(ls.than)}. Năm xem ${String(ls.tuoi)} tuổi mụ.`,
    '12 cung (độ sáng: Miếu, Vượng, Đắc sáng, Bình vừa, Hãm mờ; chỉ ghi sao chính, phụ tinh lớn; "app chấm" đã xét đủ sao):',
    ...cung,
    `Lời chốt của app: ${tomTat(tongLuan(ls, kq.am.nam))}`,
    `Đại vận đang chạy: ${ls.daiVanNay === null || dv === null ? 'chưa vào đại vận đầu.' : `cung ${tenCung(ls.daiVanNay)}; app luận: ${KET_CHU[dv.ket] ?? ''} — ${cham(cau(dv.loi[0] ?? ''))}`}`,
    `Năm ${lh.canChi} ${String(lh.namAm)}: tiểu hạn ở cung ${tenCung(lh.tieuHan)}; app luận: ${KET_CHU[ln.ket] ?? ''} — ${cham(cau(ln.loi.at(-1) ?? '', 120))}`,
    han(`Tháng ${String(lh.thangAm)}${lh.nhuan ? ' nhuận' : ''} âm: nguyệt hạn`, lh.thang),
    han(`Hôm nay (${String(lh.ngayAm)}/${String(lh.thangAm)} âm): nhật hạn`, lh.ngay),
    `Sao lưu năm ${lh.canChi} (Lưu Thái Tuế ở ${tenCung(lh.thaiTue)}): ${[...new Set(lh.sao.map((x) => x.chi))]
      .map((chi) => `${tenCung(chi)}: ${lh.sao.filter((x) => x.chi === chi).map((x) => x.ten).join(', ')}`).join('; ')}.`,
  ]);
}

function nam(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const n = namNay(hs, tr.chinh, ngayXem);
  const dong = (nhan: string, m: Muc): string => `${nhan} ${m.ten} (${m.mucDo === 'tot' ? 'tốt' : m.mucDo === 'xau' ? 'xấu' : 'vừa'})`;
  const l = luanNamNay(n);
  return muc(`Năm nay (năm âm ${n.canChi} ${String(n.namAm)}, ${String(n.tuoiMu)} tuổi mụ, tính từ Tết)`, [
    `${[dong('Sao chiếu mệnh', n.sao), dong('Hạn', n.han), dong('Kim Lâu', n.kimLau), dong('Hoang Ốc', n.hoangOc),
      dong('Tam Tai', n.tamTai), dong('Thái Tuế', n.thaiTue)].join('; ')}.`,
    `Lời chốt của app: ${cham(cau(l[0]?.loi[0] ?? '', 120))} Việc lớn: ${cham((l[1]?.loi ?? []).map((x) => cau(x, 70)).join('; '))}`,
  ]);
}

function batTu(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong): string {
  const b = tinhBatTu(hs, tr.chinh, ngayXem);
  const tru = (ten: string, t: Tru | null): string => (t === null ? `Trụ ${ten}: không rõ giờ sinh.`
    : `Trụ ${ten}: ${t.can} ${t.chi} — can ${t.can} là ${t.thapThan}; tàng can ${t.tangCan.map((c) => `${c.can} (${c.thapThan})`).join(', ')}`
      + `; nạp âm ${t.napAm}; trường sinh ${t.truongSinh}.`);
  const van = b.daiVan.find((v) => v.dangChay);
  const p = phanTich(b), vanLuan = dsVanBT(b, p).find((v) => v.dangChay), namLuan = luanNamBT(b, p);
  return muc('Bát tự (tứ trụ)', [
    ...(['năm', 'tháng', 'ngày', 'giờ'] as const).map((ten, i) => tru(ten, b.tru[i] ?? null)),
    `Nhật chủ ${b.nhatChu}.`,
    `Lời chốt của app: ${tomTat(tongLuanBT(b, p).filter((d) => !d.tieuDe.startsWith('Nhật chủ') && !d.tieuDe.startsWith('Hợp, xung')))}`,
    `Từng việc (app chấm): ${luanViec(b, hs.gioiTinh, p).map((v) => `${v.ten} ${KET_CHU[v.ket] ?? ''}`).join(', ')}.`,
    // Mau, nghe, huong theo hanh hop (do 03/11: khong gui thi AI tu suy mau theo menh nap am, co the nguoc khoi bat tu).
    tongLuanBT(b, p).flatMap((d) => d.loi).find((l) => l.startsWith('Cách dùng phổ biến')) ?? null,
    `Không vong: ${b.khongVong}. Khởi vận ${String(b.khoiVan.nam)} năm ${String(b.khoiVan.thang)} tháng ${String(b.khoiVan.ngay)} ngày `
      + `sau khi sinh, đi ${b.thuan ? 'thuận' : 'nghịch'}.`,
    `Đại vận (tuổi mụ bắt đầu, can chi, năm bắt đầu): ${b.daiVan.map((v) => `${String(v.tuoi)} tuổi ${v.canChi} (${String(v.batDau.nam)})`).join('; ')}.`,
    van === undefined ? 'Hôm nay chưa vào đại vận nào.'
      : `Đại vận đang chạy ${van.canChi}: can là ${van.thapThan[0]}, chi (can chính ẩn ${van.tang}) là ${van.thapThan[1]}`
        + `${vanLuan === undefined ? '' : `; app luận: ${KET_CHU[vanLuan.ket] ?? ''}`}.`,
    `Năm nay ${b.namNay.canChi} (tính từ Lập Xuân): can là ${b.namNay.thapThan[0]}, chi (can chính ẩn ${b.namNay.tang}) là ${b.namNay.thapThan[1]}`
      + `; app luận: ${KET_CHU[namLuan.ket] ?? ''} — ${cham(cau(namLuan.loi.at(-1) ?? '', 140))}`,
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
    `Lời chốt của app: ${luanBatTrach(tr.chinh.cungPhi, hs.huongNha).slice(0, 2).map((d) => cham(cau(d.loi[0] ?? '', 130))).join(' ')}`,
  ]);
}

/** Loi chot (`tuoiHopLuan.ts`): xep 12 tuoi theo sach co, khong gui bang "tu hanh xung" cua tuc Viet (lan luc hop vao nhom xung). */
function tuoi(tr: TinhRa): string {
  return muc('Tuổi hợp, tuổi kỵ (theo chi năm sinh; app xếp theo sách cổ)',
    [`${(luanTuoi(tr.chinh.chiNam)[0]?.loi ?? []).map((l) => l.split(' — ')[0]).join('; ')}.`]);
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
      `Lời chốt của app: ${tomTat(tongLuanTS(t, sinh).filter((d) => d.tieuDe.startsWith('Số chủ đạo') || d.tieuDe === 'Kết hợp'))} `
        + `Vận: ${vanTS(t, sinh, ngayXem).loi.filter((x, i) => i === 0 || x.startsWith('Năm cá nhân')).map((x) => cham(cau(x, 80))).join(' ')}`,
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
    `Góc chiếu chính: ${gocChinh(ls).map((g) => `${DIEM[g.a] ?? ''} ${GOC[g.goc]?.ten.toLowerCase() ?? ''} ${DIEM[g.b] ?? ''} (lệch ${so1(g.orb)}°)`).join('; ')}.`,
    `Lời chốt của app: ${tomTat(tongLuanCT(ls).slice(0, 3), 80)}`,
    ...r.ghiChu.map((c) => `Lưu ý: ${c}`),
    ...r.phuongAn.map((p) => `${p.lyDo}: ${p.khac}.`),
  ]);
}

/** So do mat vua do trong may (khoi "Tuong mat"): chi so, khong anh; `meo` khi anh tu chup da sua meo. */
export type MatDo = MatDoGiai;

/** Gui loi chot (`tuongMatLuan.ts`): tong luan + cau tom tung net; gui ca loi day du thi luot dau AI con it token ra, de bi cat. */
function tuongMat(m: MatDo): string {
  const g = giaiMat(m), luan = luanMat(m), mc = mucXet(m);
  const tom = (k: keyof SoDoMat): string => {
    const n = netChot(k, mc);
    return n === null ? '' : `: ${n.y} (${n.d > 0 ? 'tốt' : n.d < 0 ? 'cần lưu ý' : 'trung tính'})`;
  };
  return muc(`Tướng mặt (đo từ ảnh trong máy, xếp so với ${String(SO_ANH_MAU)} ảnh mẫu người Đông Á mặt tự nhiên; lời app chốt từ nhiều sách tướng)`, [
    ...g.canhBao,
    ...(luan === null ? [] : [`Lời chốt của app: ${(luan[0]?.loi ?? []).join(' ')}`]),
    ...CAC_KHOA.map((k) => `- ${GIAI[k].ten} ${dangSo(k, m.so[k])}${tom(k)}`),
  ]);
}

/** Du lieu mot nguoi gui AI: moi mon da tinh, theo thu tu khoi tren man hinh. Mon nao loi thi ghi loi, cac mon khac van gui. */
export function duLieuNguoi(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong, lechNuoc: number | undefined, mat?: MatDo): string {
  const phan: (() => string)[] = [
    (): string => nguoiXem(hs, tr, ngayXem), (): string => tuVi(hs, tr, ngayXem), (): string => nam(hs, tr, ngayXem),
    (): string => batTu(hs, tr, ngayXem),
    (): string => huong(hs, tr), (): string => tuoi(tr), (): string => soHoc(hs, ngayXem), (): string => chiemTinh(hs, lechNuoc),
    ...(mat === undefined ? [] : [(): string => tuongMat(mat)]),
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
    `Lời chốt của app: ${k.luanQue(g, mh).slice(0, 2).flatMap((d) => d.loi).join(' ')}`,
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
  }).concat([`Lời chốt của app: ${t.luanTarot(kieu, rut).slice(0, 3).flatMap((d) => d.loi).join(' ')}`]));
}

/**
 * Chi tay (dot 7 phan 3): ban tay nguoi xem (o tu chon) tach rieng khoi luat app tra — tron chung thi AI doc nhu sach luat, viet
 * "neu… thi…" (do 28/10). Luat kem muc tin (dong thuan may nen, venh). Khong gui chi tiet tung sach (`loi`): man hinh da co, va de
 * luot dau con du token ra (`vuaHanMuc`).
 */
export function duLieuChiTay(k: KhungChiTay, gioiTinh: GioiTinh): string {
  // Muc tin dat dau dong de AI chep nguyen vao dong du doan (dat cuoi dong thi 28/10 AI chi chep dung 2/72 dong).
  const tin = (l: Omit<Luat, 'nhan'>): string => `[${mucTin(l)}]`;
  const venh = (l: Omit<Luat, 'nhan'>): string => (l.venh === undefined ? '' : ` Vênh: ${l.venh}`);
  const g = giaiChiTay(k);
  return [
    muc('Bàn tay người xem (người xem tự chọn từng ô theo hình mẫu)', [
      `- Tay xem: ${gioiTinh === 'nam' ? 'tay trái (nam)' : 'tay phải (nữ)'}, theo "nam tả nữ hữu".`,
      ...g.map((m) => `- ${m.ten}: ${m.dong.map((d) => `${d.o} = ${d.luat?.nhan ?? 'chưa chọn'}`).join('; ')}.`),
    ]),
    muc('Luật app tra cho từng ô đã chọn (mức tin ở đầu dòng)', g.flatMap((m) => m.dong.map((d) => (d.luat === null ? null
      : `- ${tin(d.luat)} ${m.ten} · ${d.o} = ${d.luat.nhan}: ${d.luat.chot}${venh(d.luat)}`)))),
    muc('Nghĩa từng đường theo các nền', g.map((m) => `- ${m.ten}: ${m.y}`)),
    muc('Quy luật chung', QUY_LUAT_CHUNG.map((l) => `- ${tin(l)} ${l.chot}${venh(l)}`)),
    muc('Lời chốt của app (Claude tổng hợp nhiều nước)', luanTay(k).slice(0, 1).flatMap((d) => d.loi.map((x) => `- ${x}`))),
  ].join('\n\n');
}
