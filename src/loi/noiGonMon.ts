/**
 * Doan "Nói gọn" dot 2 (QUY_UOC muc 44): 11 mon con lai. Hai cach:
 * - mon da co loi chot "Kết: …" (Kinh Dich, tarot, boi Kieu, tuong mat, chi tay, chon ngay, phi tinh): lay dung cau ket va cau
 *   viec nen lam tu loi luan (`noiGonTuLuan`) — cung mot cau nen khong the venh; giao dien bo cac cau do khoi phan duoi cho khoi lap;
 * - mon chua co cau tom (nam nay, huong nha, tuoi hop, than so): cau Claude soan moi, lay tu cung du lieu va nguong cua loi luan.
 */
import { CHI } from './amLich.ts';
import { batTrach } from './batTrach.ts';
import type { DoanLuan } from './chiemTinhLuan.ts';
import { hv } from './hanViet/index.ts';
import { xemLaBan } from './laBan.ts';
import type { NamNay } from './namNay.ts';
import { NGUONG_NAM_NAY, diemNamNay } from './namNayLuan.ts';
import type { NoiGon } from './noiGon.ts';
import { tenSo, type ThanSo } from './soHoc.ts';
import { CHU_DAO, NAM_CA_NHAN } from './soHocLuanLoi.ts';
import { mucChi } from './tuoiHopLuan.ts';

/** Chon cau: [dau tieu de doan, chi so cau (−1 = ca doan)] hoac ham loc. */
export type ChonCau = readonly [string, number] | ((tieuDe: string, cau: string, i: number) => boolean);

/** Bo "Kết: " dau cau, viet hoa chu dau. */
export const boKet = (l: string): string => {
  const s = l.replace(/^Kết: /u, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** "Nói gọn" lay tu loi luan da chot: `dung` la cau goc da lay (giao dien bo khoi doan duoi). */
export function noiGonTuLuan(doan: readonly DoanLuan[], chon: readonly ChonCau[], them: readonly string[] = []): NoiGon & { readonly dung: readonly string[] } {
  const dung: string[] = [];
  for (const c of chon) {
    for (const d of doan) {
      d.loi.forEach((l, i) => {
        const lay = typeof c === 'function' ? c(d.tieuDe, l, i) : d.tieuDe.startsWith(c[0]) && (c[1] === -1 || c[1] === i);
        if (lay && !dung.includes(l)) dung.push(l);
      });
    }
  }
  const ket = dung.find((l) => l.startsWith('Kết: ')) ?? '';
  return { cau: [...dung.map(boKet), ...them], dung, ket: { ket } };
}

export const CHON = {
  kinhDich: [['Tổng luận', -1], ['Diễn tiến', 0]],
  tarot: [['Tổng luận', -1], ['Lời khuyên', -1]],
  kieu: [['Tổng luận', 0], ['Theo việc hỏi', -1]],
  mat: [['Tổng luận', -1], (t: string, l: string): boolean => t.startsWith('Vận theo tuổi') && l.startsWith('Quãng mạnh nhất')],
  tay: [['Tổng luận', 0], ['Tính cách', 0], ['Các quãng đời', 0]],
  chonNgay: [['Tổng luận tháng', -1]],
  phiTinh: [['Tổng luận năm', -1], (t: string, l: string): boolean => t === 'Tháng này' && l.startsWith('Tháng này thuận')],
} as const satisfies Readonly<Record<string, readonly ChonCau[]>>;

export const THEM_KINH_DICH = 'Đọc dòng hợp việc mình đang hỏi ở mục "Theo việc hỏi" bên dưới.';

// ---- Nam nay ----

const NAM_KET = {
  thuan: 'Năm nay nhìn chung êm: hợp làm những việc đã tính.',
  vua: 'Năm nay bình thường: có mặt thuận, có mặt phải để ý; làm việc vừa sức.',
  kho: 'Năm nay nên giữ gìn hơn: nhiều điều xấu theo tuổi chồng lên nhau, việc lớn nên chậm và chắc.',
} as const;
const noiDs = (ds: readonly string[]): string => (ds.length <= 1 ? ds.join('') : `${ds.slice(0, -1).join(', ')} và ${ds.at(-1) ?? ''}`);

export function noiGonNamNay(n: NamNay): NoiGon {
  const d = diemNamNay(n), ket = d >= NGUONG_NAM_NAY.thuan ? 'thuan' : d < NGUONG_NAM_NAY.kho ? 'kho' : 'vua';
  // Cung dieu kien voi muc "Việc lớn trong năm" (namNayLuan.ts).
  const pham = [n.kimLau, n.hoangOc, n.tamTai].some((m) => m.mucDo === 'xau');
  const viec: readonly (readonly [string, boolean])[] = [['làm nhà', pham], ['cưới hỏi', n.kimLau.mucDo === 'xau' || n.tamTai.mucDo === 'xau'],
    ['khởi sự làm ăn', n.tamTai.mucDo === 'xau' || n.thaiTue.ten.includes('Xung')]];
  const hoan = viec.filter(([, x]) => x).map(([t]) => t), duoc = viec.filter(([, x]) => !x).map(([t]) => t);
  const cauViec = n.tuoiMu < 10 ? 'Dưới 10 tuổi nên chưa xét chuyện làm nhà, cưới hỏi.'
    : hoan.length === 0 ? 'Làm nhà, cưới hỏi, khởi sự làm ăn đều không vướng tục kiêng năm nay.'
      : `Theo tục, năm nay nên hoãn hoặc chọn ngày kỹ khi ${noiDs(hoan)}${duoc.length === 0 ? '' : `; ${noiDs(duoc)} thì không vướng`}.`;
  const sao = `Sao chiếu năm nay là ${n.sao.ten} — ${n.sao.mucDo === 'tot' ? 'sao tốt' : n.sao.mucDo === 'xau' ? 'sao xấu' : 'sao trung tính'}`
    + `${n.thaiTue.mucDo === 'xau' ? ', lại phạm Thái Tuế (năm có con giáp xấu với tuổi mình)' : ''}.`;
  return { cau: [NAM_KET[ket], sao, cauViec, 'Không cần tốn tiền cúng giải hạn: coi đây là lời nhắc sống cẩn thận.'], ket: { ket, hoan: hoan.join('|') } };
}

// ---- Huong nha (Bat trach) ----

export function noiGonHuong(cungPhi: string, huongNha?: number): NoiGon {
  const bt = batTrach(cungPhi), h = (sao: string): string => bt.huong.find((x) => x.sao === sao)?.huong ?? '';
  let nha = 'Chưa đo hướng nhà: đo bằng la bàn ở thẻ "Phong thủy" để biết nhà có hợp với mình không.', hop = 'chua';
  if (huongNha !== undefined) {
    const mat = xemLaBan(huongNha).huong.huong, cua = bt.huong.find((k) => k.huong === mat);
    hop = cua?.tot === true ? 'hop' : 'khong';
    nha = cua?.tot === true ? `Nhà đang quay mặt về ${mat}: hợp với mình.`
      : `Nhà đang quay mặt về ${mat}: không hợp lắm, nhưng chưa cần đổi nhà — đặt cửa hay đi, giường, bàn làm việc theo hướng tốt là đủ.`;
  }
  return { cau: [`Hướng hợp nhất với mình là ${h('Sinh Khí')}, nên tránh nhất là ${h('Tuyệt Mệnh')}.`, nha,
    `Nên để cửa chính, bàn làm việc quay về ${h('Sinh Khí')}; đầu giường quay về ${h('Thiên Y')} cho khỏe.`], ket: { hop, tot: h('Sinh Khí') } };
}

// ---- Tuoi hop ----

const tenChi = (c: number): string => hv('chi', CHI.charAt(((c % 12) + 12) % 12));

export function noiGonTuoi(chi: number): NoiGon {
  const nhom = (m: ReturnType<typeof mucChi>): string[] => Array.from({ length: 11 }, (_, i) => (chi + i + 1) % 12).filter((c) => mucChi(chi, c) === m).map(tenChi);
  const rat = nhom('rat'), ky = nhom('ky'), ne = nhom('ne');
  return {
    cau: [`Tuổi ${tenChi(chi)} hợp nhất với tuổi ${noiDs(rat)}.`,
      `Kỵ nhất tuổi ${noiDs(ky)}${ne.length === 0 ? '' : `; tuổi ${noiDs(ne)} thì nên nhường nhịn hơn`}.`,
      'Tuổi chỉ là một phần nhỏ: tính nết, cách cư xử với nhau quan trọng hơn nhiều.'],
    ket: { rat: rat.join('|'), ky: ky.join('|') },
  };
}

// ---- Than so ----

/** Hai cau dau cua loi so chu dao (kieu nguoi, manh — mat trai). */
const haiCau = (s: string): string[] => s.split(/(?<=\.) (?=\p{Lu})/u).slice(0, 2);

/** `dung`: hai cau lay tu loi so chu dao — giao dien bo khoi doan "Tổng luận" cho khoi lap. */
export function noiGonThanSo(t: ThanSo): NoiGon & { readonly dung: readonly string[] } {
  const dung = haiCau(CHU_DAO[t.chuDao] ?? '');
  return {
    dung,
    cau: [`Số chủ đạo (cộng mọi chữ số ngày sinh) là ${tenSo(t.chuDao)}. ${dung.join(' ')}`,
      `Năm ${String(t.namXem)} với riêng mình là ${NAM_CA_NHAN[t.namCaNhan] ?? ''}`],
    ket: { chuDao: String(t.chuDao), nam: String(t.namCaNhan) },
  };
}
