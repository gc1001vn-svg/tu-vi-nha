/**
 * Ho so mot nguoi va nhung gi tinh ra tu ngay gio sinh: ngay am, can chi, con giap, nap am (menh), cung phi, tuoi mu.
 * Ho so chi luu ngay DUONG + gio dong ho luc sinh + noi sinh; moi thu khac la ket qua tinh (`docs/QUY_UOC.md` muc 0).
 * Gio sat ranh ±15 phut, gio doi mui, khong ro gio: tinh moi phuong an, hien phuong an khac ban chinh (muc 8, 9).
 */
import { LunarUtil, Solar } from 'lunar-typescript';
import {
  CAN, CHI, canChiNam, canChiNgay, canChiThang, duongSangAm, soNgay, tuSoNgay, type NgayAm, type NgayDuong,
} from './amLich.ts';
import { BANG, hv } from './hanViet/index.ts';
import { lechGio } from './muiGio.ts';
import { NUOC_NGOAI, mienCua } from './tinh.ts';

export type GioiTinh = 'nam' | 'nu';

export interface HoSo {
  readonly id: string;
  readonly ten: string;
  readonly gioiTinh: GioiTinh;
  /** Ngay duong luc sinh, "YYYY-MM-DD". */
  readonly ngaySinh: string;
  /** Gio dong ho luc sinh "HH:MM", `null` = khong ro gio. */
  readonly gioSinh: string | null;
  /** Ten tinh trong `TINH`, hoac `NUOC_NGOAI`. */
  readonly noiSinh: string;
  /** Mui gio IANA (vd "Europe/Paris") khi sinh o nuoc ngoai — giao dien doi ra phut lech bang `Intl`. */
  readonly muiGio?: string;
}

export interface KetQuaHoSo {
  /** Ngay, phut trong ngay sau khi doi ve gio +7 (`phut7` = null khi khong ro gio). */
  readonly duong7: NgayDuong;
  readonly phut7: number | null;
  /** Ngay am sinh — phai A (QUY_UOC muc 4): tu 23:00 tinh la ngay hom sau. */
  readonly am: NgayAm;
  readonly canChiNam: string;
  readonly canChiThang: string;
  readonly canChiNgay: string;
  readonly chiGio: string | null;
  /** Chi nam sinh, 0 = Ty — de xet xung/hop. */
  readonly chiNam: number;
  readonly conGiap: string;
  readonly napAm: string;
  readonly hanhMenh: string;
  readonly cungPhi: string;
  readonly hanhCungPhi: string;
}

export interface PhuongAn { readonly lyDo: string; readonly ketQua: KetQuaHoSo; readonly khac: readonly string[] }
export interface TinhRa { readonly chinh: KetQuaHoSo; readonly khac: readonly PhuongAn[]; readonly canhBao: readonly string[] }

/** Tuy chon o `docs/QUY_UOC.md` "Bang tuy chon"; bo trong la mac dinh anh da chot. */
export interface TuyChon {
  readonly doiVeGio7?: boolean;
  readonly gioTy?: 'doiNgay23h' | 'chiaDoi';
  readonly namCungPhi?: 'lapXuan' | 'tet';
}

const CON_GIAP = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
// Cung phi theo so Lac Thu 1..9 (5: nam Khon, nu Can); hanh cua tung quai.
const QUAI = ' 坎坤震巽 乾兑艮离';
const HANH_QUAI = ' 水土木木 金金土火';

const conGiap = (chi: number): string => BANG.conGiap[CON_GIAP.charAt(chi) as keyof typeof BANG.conGiap].nghia;

function napAmNam(namAm: number): string {
  const ten = LunarUtil.NAYIN[CAN.charAt((namAm + 6) % 10) + CHI.charAt((namAm + 8) % 12)];
  if (ten === undefined) throw new Error(`Thieu nap am nam ${String(namAm)}`);
  return ten;
}

/** Nam theo Lap Xuan dung thoi khac: thu vien tinh gio Bac Kinh nen dua vao gio +7 cong 1 gio. */
function namLapXuan(phutTuyetDoi7: number): number {
  const p = phutTuyetDoi7 + 60;
  const d = tuSoNgay(Math.floor(p / 1440));
  const trong = p - Math.floor(p / 1440) * 1440;
  const can = Solar.fromYmdHms(d.nam, d.thang, d.ngay, Math.floor(trong / 60), Math.floor(trong % 60), 0)
    .getLunar().getYearGanIndexExact();
  return (d.nam + 6) % 10 === can ? d.nam : d.nam - 1;
}

function cungPhi(nam: number, gioiTinh: GioiTinh): number {
  let so = 11 - (nam % 9);
  if (so > 9) so -= 9;
  if (gioiTinh === 'nu') {
    so = 15 - so;
    if (so > 9) so -= 9;
  }
  return so === 5 ? (gioiTinh === 'nam' ? 2 : 8) : so;
}

function ketQua(phutTuyetDoi7: number, coGio: boolean, gioiTinh: GioiTinh, tc: TuyChon): KetQuaHoSo {
  const ngay7 = Math.floor(phutTuyetDoi7 / 1440);
  const trongNgay = phutTuyetDoi7 - ngay7 * 1440;
  const ngayTinh = tuSoNgay(Math.floor((phutTuyetDoi7 + (coGio && tc.gioTy !== 'chiaDoi' ? 60 : 0)) / 1440));
  const am = duongSangAm(ngayTinh);
  const chiNam = (am.nam + 8) % 12;
  const napAm = napAmNam(am.nam);
  const cp = cungPhi(tc.namCungPhi === 'tet' ? am.nam : namLapXuan(phutTuyetDoi7), gioiTinh);
  return {
    duong7: tuSoNgay(ngay7),
    phut7: coGio ? trongNgay : null,
    am,
    canChiNam: canChiNam(am.nam),
    canChiThang: canChiThang(am),
    canChiNgay: canChiNgay(ngayTinh),
    chiGio: coGio ? hv('chi', CHI.charAt(Math.floor((trongNgay + 60) / 120) % 12)) : null,
    chiNam,
    conGiap: conGiap(chiNam),
    napAm: hv('napAm', napAm),
    hanhMenh: hv('nguHanh', napAm.slice(-1)),
    cungPhi: hv('batQuai', QUAI.charAt(cp)),
    hanhCungPhi: hv('nguHanh', HANH_QUAI.charAt(cp)),
  };
}

const SO_SANH: readonly (readonly [keyof KetQuaHoSo, string])[] = [
  ['am', 'ngày âm'], ['canChiNam', 'năm'], ['canChiThang', 'tháng'], ['canChiNgay', 'ngày'], ['chiGio', 'giờ'],
  ['napAm', 'mệnh'], ['cungPhi', 'cung phi'],
];

/**
 * Tinh ho so. `lechNuocNgoai`: phut lech UTC luc sinh khi sinh o nuoc ngoai (giao dien lay tu `Intl` — loi cam locale).
 * Nem loi khi ho so sai dang (goi `kiemHoSo` truoc).
 */
export function tinhHoSo(hs: HoSo, lechNuocNgoai?: number, tc: TuyChon = {}): TinhRa {
  const ngay = docNgay(hs.ngaySinh);
  const coGio = hs.gioSinh !== null;
  const phutNhap = hs.gioSinh === null ? 12 * 60 : docGio(hs.gioSinh);
  const goc = soNgay(ngay) * 1440 + phutNhap;

  let lech: { lech: number; khac?: number; lyDo?: string };
  if (hs.noiSinh === NUOC_NGOAI) {
    if (lechNuocNgoai === undefined) throw new Error('Sinh ở nước ngoài: thiếu múi giờ');
    lech = { lech: lechNuocNgoai };
  } else {
    const mien = mienCua(hs.noiSinh);
    if (mien === undefined) throw new Error(`Không có nơi sinh "${hs.noiSinh}"`);
    lech = lechGio(mien, goc);
  }
  const doi = (l: number): number => (tc.doiVeGio7 === false ? 0 : l - 420);

  // Cac thoi diem (phut tuyet doi +7) can thu, kem ly do; phan tu dau la ban chinh.
  const thu: [number, string][] = [];
  if (coGio) {
    const t = goc - doi(lech.lech);
    thu.push([t, ''], [t - 15, 'Nếu sinh sớm hơn 15 phút'], [t + 15, 'Nếu sinh muộn hơn 15 phút']);
    if (lech.khac !== undefined) thu.push([goc - doi(lech.khac), `Nếu lúc đó là giờ UTC${lech.khac >= 0 ? '+' : ''}${String(lech.khac / 60)}`]);
  } else {
    const dau = soNgay(ngay) * 1440;
    thu.push([dau, ''], [dau + 22 * 60 + 59, 'Không rõ giờ: nếu sinh cuối ngày']);
  }
  const [chinhThu, ...conLai] = thu;
  if (chinhThu === undefined) throw new Error('khong co thoi diem nao');
  const chinh = ketQua(chinhThu[0], coGio, hs.gioiTinh, tc);

  const daCo = new Set([JSON.stringify(SO_SANH.map(([k]) => chinh[k]))]);
  const khac: PhuongAn[] = [];
  for (const [t, lyDo] of conLai) {
    const kq = ketQua(t, coGio, hs.gioiTinh, tc);
    const dau = JSON.stringify(SO_SANH.map(([k]) => kq[k]));
    if (daCo.has(dau)) continue;
    daCo.add(dau);
    const lechTruong = SO_SANH.filter(([k]) => JSON.stringify(kq[k]) !== JSON.stringify(chinh[k])).map(([, ten]) => ten);
    khac.push({ lyDo, ketQua: kq, khac: lechTruong });
  }
  return { chinh, khac, canhBao: lech.lyDo === undefined ? [] : [lech.lyDo] };
}

/** Tuoi mu = nam am ngay xem − nam am sinh + 1 (ca hai theo Tet, lich +7) — QUY_UOC muc 3. */
export function tuoiMu(namAmSinh: number, homNay: NgayDuong): number {
  return duongSangAm(homNay).nam - namAmSinh + 1;
}

// --- Kiem du lieu (file sao luu la du lieu ngoai: kiem tung truong truoc khi ghi) --------------------

const NGAY_DAU = soNgay({ nam: 1900, thang: 2, ngay: 1 });
const NGAY_CUOI = soNgay({ nam: 2100, thang: 12, ngay: 31 });

function docNgay(s: string): NgayDuong {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  const d = { nam: Number(m?.[1]), thang: Number(m?.[2]), ngay: Number(m?.[3]) };
  const so = m === null ? Number.NaN : soNgay(d);
  const lai = tuSoNgay(so);
  if (!(so >= NGAY_DAU && so <= NGAY_CUOI) || lai.nam !== d.nam || lai.thang !== d.thang || lai.ngay !== d.ngay) {
    throw new Error(`Ngày sinh "${s}" không hợp lệ (cần từ 01/02/1900 tới 31/12/2100)`);
  }
  return d;
}

function docGio(s: string): number {
  const m = /^(\d{2}):(\d{2})$/.exec(s);
  const gio = Number(m?.[1]), phut = Number(m?.[2]);
  if (m === null || gio > 23 || phut > 59) throw new Error(`Giờ sinh "${s}" không hợp lệ`);
  return gio * 60 + phut;
}

const laChuoi = (x: unknown, ten: string, dai: number): string => {
  if (typeof x !== 'string' || x.trim() === '' || x.length > dai) throw new Error(`Thiếu hoặc sai "${ten}"`);
  return x.trim();
};

/** Kiem mot ho so tu ngoai vao (file, bo nho trinh duyet). Tra ban sach (bo truong la), sai thi nem loi tieng Viet. */
export function kiemHoSo(x: unknown): HoSo {
  if (typeof x !== 'object' || x === null) throw new Error('Hồ sơ không phải đối tượng');
  const o = x as Record<string, unknown>;
  const gioiTinh = o['gioiTinh'];
  if (gioiTinh !== 'nam' && gioiTinh !== 'nu') throw new Error('Sai "giới tính"');
  const ngaySinh = laChuoi(o['ngaySinh'], 'ngày sinh', 10);
  docNgay(ngaySinh);
  const gioSinh = o['gioSinh'] === null ? null : laChuoi(o['gioSinh'], 'giờ sinh', 5);
  if (gioSinh !== null) docGio(gioSinh);
  const noiSinh = laChuoi(o['noiSinh'], 'nơi sinh', 60);
  if (noiSinh !== NUOC_NGOAI && mienCua(noiSinh) === undefined) throw new Error(`Không có nơi sinh "${noiSinh}"`);
  const hs: HoSo = { id: laChuoi(o['id'], 'mã', 64), ten: laChuoi(o['ten'], 'tên', 60), gioiTinh, ngaySinh, gioSinh, noiSinh };
  if (noiSinh !== NUOC_NGOAI) return hs;
  const muiGio = laChuoi(o['muiGio'], 'múi giờ', 64);
  if (!/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+)*$/.test(muiGio)) throw new Error(`Sai múi giờ "${muiGio}"`);
  return { ...hs, muiGio };
}

const UNG = 'tu-vi-nha';

export function taoSaoLuu(ds: readonly HoSo[], luc: string): { ung: string; phienBan: 1; luc: string; hoSo: readonly HoSo[] } {
  return { ung: UNG, phienBan: 1, luc, hoSo: ds };
}

/** Doc file sao luu. Sai bat cu cho nao thi nem loi va KHONG tra gi — nguoi goi giu nguyen du lieu dang co. */
export function docSaoLuu(x: unknown): HoSo[] {
  const o = (typeof x === 'object' && x !== null ? x : {}) as Record<string, unknown>;
  if (o['ung'] !== UNG) throw new Error('Không phải file sao lưu của Tử Vi Nhà');
  if (o['phienBan'] !== 1) throw new Error('File sao lưu của bản app khác, chưa đọc được');
  const ds = o['hoSo'];
  if (!Array.isArray(ds) || ds.length > 500) throw new Error('File sao lưu hỏng: danh sách hồ sơ sai');
  const ra = ds.map((h: unknown, i) => {
    try {
      return kiemHoSo(h);
    } catch (e) {
      throw new Error(`Hồ sơ thứ ${String(i + 1)}: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
    }
  });
  if (new Set(ra.map((h) => h.id)).size !== ra.length) throw new Error('File sao lưu hỏng: trùng mã hồ sơ');
  return ra;
}
