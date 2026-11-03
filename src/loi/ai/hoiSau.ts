/**
 * Hoi them o khoi "AI tong hop moi mon" (ke hoach `docs/ke-hoach/2026-11-03-xu-ly-ton.md`, QUY_UOC muc 42). Cau hoi them noi toi viec
 * nao (tinh duyen, cong viec, ngay tot, sua nha…) thi goi du lieu luot do dat loi app luan DAY DU cua viec ay len dau, roi loi chot gon
 * cac mon con cho: han muc 8.000 token/phut khong cho gui ca goi gon lan loi day du (`choDuLieu`, `luotHoiThem` o `goi.ts`). Khong nhan
 * ra viec nao thi `null` (giu goi gon). Loi thuan: ngay xem nhan qua tham so. Thuoc: `tests/AIHoiSau.test.ts`.
 */
import { CHI, type NgayDuong } from '../amLich.ts';
import { tinhBatTu } from '../batTu.ts';
import { luanBatTrach } from '../batTrachLuan.ts';
import { luanNamBT, luanVanBT, luanViec, phanTich, tongLuanBT } from '../batTuLuan.ts';
import { laSoNguoi } from '../chiemTinh.ts';
import { luanNha, tongLuanCT, type DoanLuan } from '../chiemTinhLuan.ts';
import { NHA_TEN } from '../chiemTinhNhaLoi.ts';
import { canhBaoNam, chonNgay, VIEC, type Viec } from '../chonNgay.ts';
import { luanThang } from '../chonNgayLuan.ts';
import { hv } from '../hanViet/index.ts';
import type { HoSo, TinhRa } from '../hoSo.ts';
import { namNay } from '../namNay.ts';
import { luanNamNay } from '../namNayLuan.ts';
import { phiTinh } from '../phiTinh.ts';
import { luanPhiTinh } from '../phiTinhLuan.ts';
import { thanSo } from '../soHoc.ts';
import { tongLuanTS, vanTS } from '../soHocLuan.ts';
import { luanTuoi } from '../tuoiHopLuan.ts';
import { luanMat } from '../tuongMatLuan.ts';
import { tinhTuVi } from '../tuVi/laSo.ts';
import { diemCung, dsDaiVan, luanCung, luanDaiVan, luanNam, NGUONG_CUNG, tongLuan } from '../tuVi/luan.ts';
import { tinhLuuHan } from '../tuVi/luuHan.ts';
import { KET_CHU, huongHop, phanNguoi, type MatDo, type Mon } from './duLieu.ts';

/** Mot doan loi day du: `khoa` de bo trung; `thay`: mon co doan gon trong goi cu ma doan nay da noi du (khong gui lai). */
export interface DoanThem { readonly khoa: string; readonly thay?: Mon; readonly chu: string }

export const TIEU_DE_HOI = '## Lời app luận đủ cho câu hỏi này (dựa vào phần này mà trả lời; dưới là lời chốt gọn các môn)';

const tenChi = (i: number): string => hv('chi', CHI.charAt(i));
const boDau = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gu, 'd');
const thoat = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

/** Mot nhom tu khoa → ham khop tron chu; cau go khong dau (chi chu ASCII) thi so voi ban bo dau. */
function nhom(tu: readonly string[]): (cau: string) => boolean {
  const re = (ds: readonly string[]): RegExp => new RegExp(`(?<![\\p{L}\\p{M}])(?:${ds.map(thoat).join('|')})(?![\\p{L}\\p{M}])`, 'iu');
  const co = re(tu), khong = re(tu.map(boDau));
  return (cau) => (/[^\p{ASCII}]/u.test(cau) ? co.test(cau) : khong.test(cau));
}

/** Viec hoi → cung tu vi (`luanCung`), viec bat tu (`luanViec`), nha chiem tinh (`luanNha`); thu tu la uu tien. */
const VIEC_HOI: readonly { readonly co: (c: string) => boolean; readonly cung: string; readonly viec?: string; readonly nha?: number }[] = [
  { co: nhom(['vợ', 'chồng', 'hôn nhân', 'cưới', 'tình duyên', 'tình cảm', 'tình yêu', 'người yêu', 'yêu đương', 'kết hôn', 'ly hôn', 'ly dị',
    'duyên', 'hẹn hò', 'phu thê']), cung: 'Phu Thê', viec: 'Hôn nhân', nha: 7 },
  { co: nhom(['công việc', 'sự nghiệp', 'nghề', 'làm ăn', 'kinh doanh', 'buôn bán', 'thăng tiến', 'thăng chức', 'chức vụ', 'đi làm', 'việc làm',
    'công danh', 'học hành', 'thi cử', 'đổi việc', 'nghỉ việc', 'khởi nghiệp', 'quan lộc']), cung: 'Quan Lộc', viec: 'Sự nghiệp', nha: 10 },
  { co: nhom(['tiền', 'tiền bạc', 'tài chính', 'của cải', 'giàu', 'thu nhập', 'tài lộc', 'lương', 'nợ', 'tích lũy', 'tiết kiệm', 'đầu tư',
    'phát tài', 'tài bạch']), cung: 'Tài Bạch', viec: 'Tiền bạc', nha: 2 },
  { co: nhom(['sức khỏe', 'sức khoẻ', 'bệnh', 'ốm', 'đau', 'khỏe', 'khoẻ', 'thể lực', 'tật ách']), cung: 'Tật Ách', viec: 'Sức khỏe', nha: 6 },
  { co: nhom(['con cái', 'con trai', 'con gái', 'sinh con', 'có con', 'đứa con', 'các con', 'con tôi', 'con mình', 'sinh nở', 'mang thai',
    'hiếm muộn', 'tử tức']), cung: 'Tử Tức', viec: 'Con cái', nha: 5 },
  { co: nhom(['bố mẹ', 'cha mẹ', 'ba mẹ', 'bố tôi', 'mẹ tôi', 'cha tôi', 'ba tôi', 'phụ mẫu']), cung: 'Phụ Mẫu', viec: 'Cha mẹ', nha: 4 },
  { co: nhom(['anh chị em', 'anh em', 'chị em', 'em trai', 'em gái', 'anh trai', 'chị gái', 'huynh đệ']), cung: 'Huynh Đệ', viec: 'Anh em, bạn bè', nha: 3 },
  { co: nhom(['bạn bè', 'đồng nghiệp', 'cấp dưới', 'giao thiệp', 'quý nhân', 'đối tác', 'nô bộc']), cung: 'Nô Bộc', viec: 'Anh em, bạn bè', nha: 11 },
  { co: nhom(['đi xa', 'xuất ngoại', 'nước ngoài', 'du học', 'du lịch', 'định cư', 'chuyển nhà', 'xa nhà', 'thiên di']), cung: 'Thiên Di', nha: 9 },
  { co: nhom(['nhà đất', 'bất động sản', 'mua nhà', 'đất đai', 'mua đất', 'nhà cửa', 'xây nhà', 'tài sản', 'điền trạch']), cung: 'Điền Trạch', nha: 4 },
  { co: nhom(['phúc đức', 'họ hàng', 'dòng họ', 'tổ tiên', 'mồ mả', 'tâm linh', 'phần mộ']), cung: 'Phúc Đức' },
  { co: nhom(['tính cách', 'tính tình', 'tính nết', 'bản thân', 'điểm mạnh', 'điểm yếu', 'bản tính', 'cung mệnh']), cung: 'Mệnh', nha: 1 },
];

const VIEC_NGAY: readonly (readonly [Viec, (c: string) => boolean])[] = [
  ['cuoiHoi', nhom(['cưới', 'ăn hỏi', 'dạm ngõ', 'hỏi vợ', 'hôn lễ', 'đám hỏi', 'lễ hỏi', 'kết hôn', 'rước dâu'])],
  ['dongTho', nhom(['động thổ', 'làm nhà', 'xây nhà', 'cất nhà', 'sửa nhà', 'nhập trạch', 'về nhà mới', 'lên nhà mới', 'đổ mái', 'cất nóc', 'khởi công'])],
  ['khaiTruong', nhom(['khai trương', 'mở cửa hàng', 'mở quán', 'mở công ty', 'mở hàng', 'mở tiệm'])],
  ['xuatHanh', nhom(['xuất hành', 'đi xa', 'lên đường', 'đi chơi', 'du lịch', 'đi công tác'])],
  ['muaXe', nhom(['mua xe', 'nhận xe', 'lấy xe', 'sắm xe'])],
];
const NGAY_RO = nhom(['ngày tốt', 'ngày đẹp', 'ngày lành', 'ngày nào', 'ngày hợp', 'chọn ngày', 'xem ngày', 'giờ tốt', 'giờ đẹp', 'ngày giờ']);
const KHI = nhom(['ngày', 'hôm nào', 'bữa nào', 'khi nào', 'lúc nào', 'bao giờ', 'tháng này', 'tháng sau', 'tháng tới', 'tuần này', 'tuần sau']);
const NAM_SAU = nhom(['năm sau', 'năm tới', 'sang năm', 'năm kế']);
const NGAY_KHAC = nhom(['ngày mai', 'ngày kia', 'hôm sau', 'tuần sau', 'tuần tới']);
const NHAT = nhom(['nhật hạn', 'nhịp sinh học']);
const HOI_NAM_NAY = nhom(['năm nay', 'năm này', 'cả năm', 'trong năm', 'cuối năm', 'đầu năm']);
const TU_NAM = nhom(['tam tai', 'kim lâu', 'hoang ốc', 'thái tuế', 'sao hạn', 'vận hạn', 'hạn năm', 'tiểu hạn', 'sao chiếu', 'vận năm']);
const DAI_VAN = nhom(['đại vận', 'mười năm', '10 năm', 'giai đoạn', 'vận tới', 'những năm tới', 'sắp tới', 'tương lai', 'về già', 'trung niên',
  'tuổi già', 'về sau']);
const PHONG_THUY = nhom(['phong thủy', 'phong thuỷ', 'hướng', 'bàn thờ', 'giường', 'bếp', 'cửa chính', 'cửa nhà', 'kê', 'bố trí', 'sửa nhà',
  'sửa chữa', 'cải tạo', 'động thổ', 'phi tinh', 'cửu tinh', 'ngũ hoàng', 'nhị hắc', 'văn phòng', 'bàn làm việc', 'phòng ngủ', 'sơn nhà', 'cây cảnh',
  'bát trạch', 'cung phi', 'mệnh quái']);
const NAM_TRUOC = nhom(['sửa', 'động thổ', 'cải tạo', 'năm', 'tháng', 'phi tinh', 'ngũ hoàng', 'nhị hắc']);
const MAU = nhom(['màu', 'màu sắc', 'nghề hợp', 'hợp nghề', 'nghề gì', 'hướng hợp', 'hành hợp', 'hợp hành', 'mệnh hợp', 'hợp mệnh']);
const MON: readonly (readonly [string, (c: string) => boolean])[] = [
  ['tuVi', nhom(['tử vi', 'lá số'])],
  ['batTu', nhom(['bát tự', 'tứ trụ', 'dụng thần', 'nhật chủ', 'ngũ hành', 'thập thần'])],
  ['chiemTinh', nhom(['chiêm tinh', 'hoàng đạo', 'cung mọc', 'mặt trời', 'mặt trăng', 'sao kim', 'sao hỏa', 'sao hoả', 'sao thủy', 'sao thuỷ',
    'sao mộc', 'sao thổ', 'thiên đỉnh'])],
  ['thanSo', nhom(['thần số', 'số chủ đạo', 'năm cá nhân', 'tháng cá nhân', 'số ngày sinh'])],
  ['tuoi', nhom(['tuổi hợp', 'hợp tuổi', 'tuổi kỵ', 'kỵ tuổi', 'xung tuổi', 'tuổi nào', 'tam hợp', 'lục hợp', 'tứ hành xung', 'hợp với tuổi',
    ...['tý', 'sửu', 'dần', 'mão', 'mẹo', 'thìn', 'tỵ', 'tị', 'ngọ', 'mùi', 'thân', 'dậu', 'tuất', 'hợi'].map((c) => `tuổi ${c}`)])],
  ['tuongMat', nhom(['tướng mặt', 'khuôn mặt', 'gương mặt', 'nhân tướng', 'tướng số', 'mặt mũi', 'diện mạo'])],
];

/** Cac viec cau hoi noi toi, theo thu tu uu tien (khoa dang `cung:Phu Thê`, `ngay:cuoiHoi`, `nam`, `mon:batTu`…). */
export function viecHoi(cauHoi: string, namXem: number): string[] {
  const c = cauHoi.normalize('NFC').toLowerCase();
  const ra: string[] = [];
  const nam = [...c.matchAll(/(?<!\d)((?:19|20)\d{2})(?!\d)/gu)].map((m) => Number(m[1]));
  const khac = [...new Set(nam.filter((y) => y > namXem))];
  for (const y of khac) ra.push(`namKhac:${String(y)}`);
  if (khac.length === 0 && NAM_SAU(c)) ra.push(`namKhac:${String(namXem + 1)}`);
  if (NGAY_KHAC(c) && NHAT(c)) ra.push('ngayKhac');
  const viec = VIEC_NGAY.filter(([, f]) => f(c)).map(([v]) => v);
  if (viec.length > 0 && (KHI(c) || NGAY_RO(c))) ra.push(...viec.map((v) => `ngay:${v}`));
  else if (NGAY_RO(c)) ra.push('ngay:*');
  for (const v of VIEC_HOI) if (v.co(c)) ra.push(`cung:${v.cung}`);
  if (HOI_NAM_NAY(c) || nam.includes(namXem) || (TU_NAM(c) && !ra.some((k) => k.startsWith('namKhac')))) ra.push('nam');
  if (DAI_VAN(c)) ra.push('daiVan');
  if (PHONG_THUY(c)) ra.push(NAM_TRUOC(c) ? 'phongThuy:nam' : 'phongThuy');
  if (MAU(c)) ra.push('mau');
  for (const [k, f] of MON) if (f(c)) ra.push(`mon:${k}`);
  return [...new Set(ra)];
}

const doan = (tieuDe: string, loi: readonly string[]): string => `### ${tieuDe}\n${loi.filter((x) => x !== '').join(' ')}`;
const CHAM = (d: number): string => (d >= NGUONG_CUNG.tot ? 'tốt' : d < NGUONG_CUNG.kem ? 'cần lưu ý' : 'vừa');
const nho = <T>(f: () => T): (() => T) => {
  let v: { readonly x: T } | null = null;
  return () => (v ??= { x: f() }).x;
};

type LaSoTV = Exclude<ReturnType<typeof tinhTuVi>, 'canChonGio'>;

/** So da tinh cua mot nguoi, tinh luc can (cau hoi chi cham mot mon thi khong tinh mon khac). */
function nen(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong, lechNuoc: number | undefined): {
  readonly tv: () => { readonly ls: LaSoTV; readonly lh: ReturnType<typeof tinhLuuHan>; readonly namAm: number } | null;
  readonly bt: () => { readonly b: ReturnType<typeof tinhBatTu>; readonly p: ReturnType<typeof phanTich> };
  readonly ct: () => ReturnType<typeof laSoNguoi>['laSo'];
  readonly ts: () => { readonly t: ReturnType<typeof thanSo>; readonly sinh: NgayDuong };
} {
  return {
    tv: nho(() => {
      const ls = tinhTuVi(hs, tr.chinh, ngayXem);
      return ls === 'canChonGio' ? null : { ls, lh: tinhLuuHan(ls, tr.chinh.am.thang, ngayXem), namAm: tr.chinh.am.nam };
    }),
    bt: nho(() => { const b = tinhBatTu(hs, tr.chinh, ngayXem); return { b, p: phanTich(b) }; }),
    ct: nho(() => laSoNguoi(hs, lechNuoc).laSo),
    ts: nho(() => {
      const [nam = 0, thang = 0, ngay = 0] = hs.ngaySinh.split('-').map(Number);
      const sinh = { nam, thang, ngay };
      return { t: thanSo(sinh, ngayXem), sinh };
    }),
  };
}

const tongMon = (ten: string, ds: readonly DoanLuan[], khoa: string, thay?: Mon): DoanThem[] => ds.filter((d) => d.tieuDe !== 'Nhìn cho đúng')
  .map((d) => ({ khoa: `${khoa}:${d.tieuDe}`, ...(thay === undefined ? {} : { thay }), chu: doan(`${ten} — ${d.tieuDe}`, d.loi) }));

/** Loi day du cho cau hoi, theo thu tu `viecHoi`; mon nao loi thi bo, mon khac van gui. */
export function doanThem(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong, lechNuoc: number | undefined, mat: MatDo | undefined, cauHoi: string): DoanThem[] {
  const khoa = viecHoi(cauHoi, ngayXem.nam);
  const n = nen(hs, tr, ngayXem, lechNuoc);
  const k = tr.chinh;
  const tenCung = (ls: LaSoTV, chi: number): string => `${ls.cung[chi]?.ten ?? ''} (${tenChi(chi)})`;
  const khongGio = (): DoanThem[] => (n.tv() === null ? [{ khoa: 'tv:khong', chu: doan('Tử vi', ['Không rõ giờ sinh nên app chưa lập lá số tử vi.']) }] : []);

  const cung = (ten: string, viec?: string, nha?: number): DoanThem[] => {
    const ra: DoanThem[] = [...khongGio()];
    const tv = n.tv(), c = tv?.ls.cung.find((x) => x.ten === ten);
    if (tv !== null && c !== undefined) {
      const loi = ten === 'Mệnh' ? tongLuan(tv.ls, tv.namAm).map((d) => `${d.tieuDe}: ${d.loi.join(' ')}`) : luanCung(tv.ls, c.chi, tv.namAm);
      ra.push({ khoa: `tv:${ten}`, chu: doan(`Tử vi — cung ${ten} (${tenChi(c.chi)}) · app chấm: ${CHAM(diemCung(tv.ls, c.chi))}`, loi) });
    }
    const { b, p } = n.bt(), v = viec === undefined ? undefined : luanViec(b, hs.gioiTinh, p).find((x) => x.ten === viec);
    if (v !== undefined) ra.push({ khoa: `bt:${v.ten}`, chu: doan(`Bát tự — ${v.ten} · app chấm: ${KET_CHU[v.ket] ?? ''}`, v.loi) });
    const ls = n.ct();
    if (nha !== undefined && ls.nha !== null) {
      ra.push({ khoa: `ct:${String(nha)}`, chu: doan(`Chiêm tinh — nhà ${String(nha)} (${(NHA_TEN[nha - 1] ?? '').toLowerCase()})`, luanNha(ls, nha)) });
    }
    return ra;
  };

  const thang = [{ nam: ngayXem.nam, thang: ngayXem.thang }, ngayXem.thang === 12 ? { nam: ngayXem.nam + 1, thang: 1 } : { nam: ngayXem.nam, thang: ngayXem.thang + 1 }];
  // Thang dang xem chi tinh tu hom nay: ngay da qua khong con chon duoc.
  const dongThang = (v: Viec, t: { readonly nam: number; readonly thang: number }): string => {
    const nay = t.nam === ngayXem.nam && t.thang === ngayXem.thang;
    const ds = chonNgay(v, t.nam, t.thang, k.chiNam).filter((d) => !nay || d.duong.ngay >= ngayXem.ngay);
    const dem = (g: string): string => String(ds.filter((d) => d.danhGia === g).length);
    return `Tháng ${String(t.thang)}/${String(t.nam)}${nay ? ` (từ hôm nay ${String(ngayXem.ngay)}/${String(ngayXem.thang)})` : ''}: `
      + `${dem('tot')} ngày Tốt, ${dem('duoc')} ngày Được, ${dem('tranh')} ngày Tránh. `
      + (luanThang(v, ds)[0]?.loi[1] ?? '');
  };
  const ngay = (v: Viec | null): DoanThem[] => {
    if (v === null) {
      const t = thang[0] ?? { nam: ngayXem.nam, thang: ngayXem.thang };
      return [{ khoa: 'ngay:*', chu: doan(`Chọn ngày tháng ${String(t.thang)}/${String(t.nam)} cho các việc lớn (theo tuổi ${k.conGiap}; app chấm từng ngày)`,
        (Object.keys(VIEC) as Viec[]).map((x) => `${VIEC[x].ten}: ${dongThang(x, t)}`)) }];
    }
    const theo = luanThang(v, chonNgay(v, ngayXem.nam, ngayXem.thang, k.chiNam))[2]?.loi ?? [];
    return [{ khoa: `ngay:${v}`, chu: doan(`Chọn ngày — ${VIEC[v].ten.toLowerCase()} (theo tuổi ${k.conGiap}; app chấm từng ngày)`, [
      // Kim Lau cuoi hoi tuc xet tuoi co dau: nguoi xem la nam thi khong nhac (dong "Theo việc" da dan xem tuoi co dau).
      ...canhBaoNam(v, k.am.nam, ngayXem.nam, ngayXem.thang).filter((c) => !(v === 'cuoiHoi' && hs.gioiTinh === 'nam' && c.ten === 'Kim Lâu'))
        .map((c) => `Năm ${String(c.namAm)} tuổi mụ ${String(c.tuoiMu)} phạm ${c.ten} (${c.muc.ten}): ${c.muc.nghia}`),
      ...thang.map((t) => dongThang(v, t)), ...theo]) }];
  };

  const phiTinhDay = (): DoanThem[] => luanPhiTinh(phiTinh(ngayXem)).filter((d) => d.tieuDe !== 'Nhìn cho đúng' && d.tieuDe !== 'Vận 9')
    .map((d) => ({ khoa: `pt:${d.tieuDe.startsWith('Tổng luận') ? 'nam' : d.tieuDe}`, chu: doan(`Phi tinh (sao bay theo năm, tháng) — ${d.tieuDe}`, d.loi) }));

  const nam = (): DoanThem[] => {
    const ra = tongMon('Năm nay', luanNamNay(namNay(hs, k, ngayXem)), 'nam', 'nam');
    const tv = n.tv();
    if (tv !== null) {
      const ln = luanNam(tv.ls, tv.lh, tv.namAm);
      ra.push({ khoa: 'tv:nam', chu: doan(`Tử vi — năm ${tv.lh.canChi}: tiểu hạn ở cung ${tenCung(tv.ls, tv.lh.tieuHan)} · app luận: ${KET_CHU[ln.ket] ?? ''}`, ln.loi) });
    }
    const { b, p } = n.bt(), lb = luanNamBT(b, p);
    ra.push({ khoa: 'bt:nam', chu: doan(`Bát tự — năm ${b.namNay.canChi} · app luận: ${KET_CHU[lb.ket] ?? ''}`, lb.loi) });
    const { t, sinh } = n.ts();
    ra.push({ khoa: 'ts:van', chu: doan('Thần số — vận năm nay', vanTS(t, sinh, ngayXem).loi) });
    return [...ra, ...phiTinhDay().slice(0, 1)];
  };

  const daiVan = (): DoanThem[] => {
    const ra: DoanThem[] = [];
    const tv = n.tv();
    if (tv !== null && tv.ls.daiVanNay !== null) {
      const ds = dsDaiVan(tv.ls, tv.namAm), i = ds.findIndex((v) => v.chi === tv.ls.daiVanNay);
      for (const [j, v] of [ds[i], ds[i + 1]].entries()) {
        if (v === undefined) continue;
        const l = luanDaiVan(tv.ls, v.chi, tv.namAm);
        ra.push({ khoa: `tv:dv${String(v.chi)}`, chu: doan(`Tử vi — đại vận ${j === 0 ? 'đang chạy' : 'kế tiếp'} (cung ${tenCung(tv.ls, v.chi)}, từ `
          + `${String(v.tuoi)} tuổi) · app luận: ${KET_CHU[l.ket] ?? ''}`, l.loi) });
      }
    }
    const { b, p } = n.bt(), i = b.daiVan.findIndex((v) => v.dangChay);
    if (i >= 0) {
      for (const [j, v] of [b.daiVan[i], b.daiVan[i + 1]].entries()) {
        if (v === undefined) continue;
        const l = luanVanBT(b, v, p);
        ra.push({ khoa: `bt:dv${v.canChi}`, chu: doan(`Bát tự — đại vận ${v.canChi} (${j === 0 ? 'đang chạy' : 'kế tiếp'}, từ ${String(v.tuoi)} tuổi) · `
          + `app luận: ${KET_CHU[l.ket] ?? ''}`, l.loi) });
      }
    }
    return ra;
  };

  const phongThuy = (namTruoc: boolean): DoanThem[] => {
    const bt = tongMon('Bát trạch', luanBatTrach(k.cungPhi, hs.huongNha), 'btr', 'huong');
    return namTruoc ? [...phiTinhDay(), ...bt] : [...bt, ...phiTinhDay()];
  };

  const mon = (ten: string): DoanThem[] => {
    if (ten === 'tuVi') { const tv = n.tv(); return tv === null ? khongGio() : tongMon('Tử vi', tongLuan(tv.ls, tv.namAm), 'tvt'); }
    if (ten === 'batTu') { const { b, p } = n.bt(); return tongMon('Bát tự', tongLuanBT(b, p), 'btt'); }
    if (ten === 'chiemTinh') return tongMon('Chiêm tinh', tongLuanCT(n.ct()), 'ctt');
    if (ten === 'thanSo') {
      const { t, sinh } = n.ts();
      return [...tongMon('Thần số', tongLuanTS(t, sinh), 'tst'), { khoa: 'ts:van', chu: doan('Thần số — vận năm nay', vanTS(t, sinh, ngayXem).loi) }];
    }
    if (ten === 'tuoi') return tongMon('Tuổi hợp', luanTuoi(k.chiNam), 'tuoi', 'tuoi');
    if (ten === 'tuongMat') {
      return mat === undefined ? [{ khoa: 'tm:khong', chu: doan('Tướng mặt', ['Chưa đo tướng mặt: mở khối "Tướng mặt" trong app, đo ảnh rồi hỏi lại.']) }]
        : tongMon('Tướng mặt', luanMat(mat) ?? [], 'tm', 'tuongMat');
    }
    return [];
  };

  const ra: DoanThem[] = [];
  for (const x of khoa) {
    const [loai = '', gt = ''] = x.split(':');
    try {
      if (loai === 'namKhac') {
        ra.push({ khoa: x, chu: doan(`Năm ${gt}`, [`App chưa tính năm ${gt} (sao hạn, tiểu hạn, Tam Tai, năm cá nhân…): chỉ có năm nay `
          + `${String(ngayXem.nam)}, các đại vận 10 năm và vận bát tự.`]) });
      } else if (loai === 'ngayKhac') {
        ra.push({ khoa: x, chu: doan('Ngày khác hôm nay', ['App chỉ tính nhật hạn và nhịp sinh học của hôm nay.']) });
      } else if (loai === 'ngay') ra.push(...ngay(gt === '*' ? null : gt as Viec));
      else if (loai === 'cung') { const v = VIEC_HOI.find((y) => y.cung === gt); if (v !== undefined) ra.push(...cung(v.cung, v.viec, v.nha)); }
      else if (loai === 'nam') ra.push(...nam());
      else if (loai === 'daiVan') ra.push(...daiVan());
      else if (loai === 'phongThuy') ra.push(...phongThuy(gt === 'nam'));
      else if (loai === 'mau') {
        const { b, p } = n.bt(), d = tongLuanBT(b, p).find((y) => y.tieuDe.startsWith('Hành hợp'));
        if (d !== undefined) ra.push({ khoa: 'btt:dung', chu: doan(`Bát tự — ${d.tieuDe}`, d.loi.map((l) => huongHop(l, k.cungPhi) ?? l)) });
      } else if (loai === 'mon') ra.push(...mon(gt));
    } catch {
      // Mon nay loi (so lieu thieu): bo, cac viec khac van gui.
    }
  }
  return ra.filter((d, i) => d.chu.includes('\n') && !d.chu.endsWith('\n') && ra.findIndex((y) => y.khoa === d.khoa) === i);
}

/**
 * Goi du lieu cho mot luot hoi them: phan "Người xem", loi day du cua viec duoc hoi (het cho thi bo doan sau), roi loi chot gon cac mon
 * con vua `toiDa` ky tu. Cau hoi khong noi toi viec nao (hoac khong doan nao vua): `null` — dung goi gon nhu luot dau.
 */
export function duLieuHoi(hs: HoSo, tr: TinhRa, ngayXem: NgayDuong, lechNuoc: number | undefined, mat: MatDo | undefined, cauHoi: string,
  toiDa: number): string | null {
  const them = doanThem(hs, tr, ngayXem, lechNuoc, mat, cauHoi);
  if (them.length === 0) return null;
  const phan = phanNguoi(hs, tr, ngayXem, lechNuoc, mat);
  const dau = phan.find((p) => p.mon === 'nguoi')?.chu ?? '';
  let dai = dau.length + 2 + TIEU_DE_HOI.length;
  const vao: DoanThem[] = [];
  for (const d of them) if (dai + 1 + d.chu.length <= toiDa) { vao.push(d); dai += 1 + d.chu.length; }
  if (vao.length === 0) return null;
  const thay = new Set(vao.map((d) => d.thay));
  const gon: string[] = [];
  for (const p of phan) {
    if (p.mon === 'nguoi' || thay.has(p.mon) || dai + 2 + p.chu.length > toiDa) continue;
    gon.push(p.chu);
    dai += 2 + p.chu.length;
  }
  return [dau, [TIEU_DE_HOI, ...vao.map((d) => d.chu)].join('\n'), ...gon].join('\n\n');
}
