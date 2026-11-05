/**
 * Doan "Nói gọn" dau khoi Tu vi, Bat tu, Chiem tinh (ke hoach `docs/ke-hoach/2026-11-05-loi-giai-de-hieu.md`, QUY_UOC muc 43):
 * 3–5 cau loi thuong — manh o dau, can luu y gi, giai doan nay nen lam gi. Moi cau sinh tu dung diem, dung nguong ma loi luan ben
 * duoi dung (`luan.ts`, `batTuLuan.ts`, `chiemTinhLuan.ts`) nen ket khong the vênh. Cau: Claude soan moi (luat 6), khong chu mon.
 */
import { CUNG, cungCua, type LaSo as LaSoCT } from './chiemTinh.ts';
import { NGUONG_NHA, demNguyenTo, diemNha, vanCT } from './chiemTinhLuan.ts';
import { NHA_TEN } from './chiemTinhNhaLoi.ts';
import { hanhDung, luanNamBT, luanVanBT, luanViec, type Ket, type PhanTich } from './batTuLuan.ts';
import type { BatTu } from './batTu.ts';
import type { GioiTinh } from './hoSo.ts';
import { NGUONG_CUNG, NGUONG_MENH, diemCung, diemMenh, luanDaiVan, luanNam } from './tuVi/luan.ts';
import type { LaSo } from './tuVi/laSo.ts';
import type { LuuHan } from './tuVi/luuHan.ts';

export interface NoiGon {
  readonly cau: readonly string[];
  /** Ket ma doan dua vao — thuoc so voi loi luan ben duoi. */
  readonly ket: Readonly<Record<string, string>>;
}

/** "chuyện A và chuyện B" — ten viec co dau phay ben trong nen moi muc mot chu "chuyện". */
const noi = (ds: readonly string[]): string => ds.map((x) => `chuyện ${x}`).join(' và ');
const VAN = { thuan: 'thuận', vua: 'bình thường', kho: 'nhiều thử thách' } as const;
const NAM = { thuan: 'thuận', vua: 'bình thường', kho: 'nhiều trở ngại' } as const;
/** Loi khuyen theo [ket chang 10 nam]|[ket nam] — cung y voi `GHEP` cua tu vi va bat tu, noi bang viec nen lam. */
const KHUYEN: Readonly<Record<string, string>> = {
  'thuan|thuan': 'nên mạnh dạn làm việc lớn đã định.',
  'thuan|vua': 'cứ theo đà mà làm, chủ động tìm cơ hội.',
  'thuan|kho': 'chậm lại một nhịp, việc lớn nên tính kỹ, đừng bỏ cuộc.',
  'vua|thuan': 'năm này đáng tận dụng để làm điều mình muốn.',
  'vua|vua': 'làm vừa sức, giữ nhịp đều.',
  'vua|kho': 'năm nên cẩn thận hơn: tránh vay mượn, ký kết vội.',
  'kho|thuan': 'năm này đỡ hơn, làm được việc vừa sức nhưng chưa nên liều.',
  'kho|vua': 'nên giữ gìn, củng cố cái đang có.',
  'kho|kho': 'nên giữ gìn hơn cả: tránh đầu tư lớn, vay mượn, quyết định vội.',
};
const giaiDoan = (van: Ket | null, tuoi: number | null, nam: Ket, tenNam: string): string => (van === null || tuoi === null
  ? `Chưa vào chặng 10 năm đầu tiên; ${tenNam} ${NAM[nam]} — ${KHUYEN[`vua|${nam}`] ?? ''}`
  : `Chặng 10 năm hiện tại (${String(tuoi)}–${String(tuoi + 9)} tuổi) ${VAN[van]}, riêng ${tenNam} ${NAM[nam]} — ${KHUYEN[`${van}|${nam}`] ?? ''}`);

// ---- Tu vi ----

/** Ten ngan cua viec moi cung (phan dau `CHU_DE`). */
const VIEC_CUNG: Readonly<Record<string, string>> = {
  'Phụ Mẫu': 'cha mẹ', 'Phúc Đức': 'phúc nhà, họ hàng', 'Điền Trạch': 'nhà cửa, đất đai', 'Quan Lộc': 'công việc', 'Nô Bộc': 'bạn bè, đồng nghiệp',
  'Thiên Di': 'đi xa, giao thiệp', 'Tật Ách': 'sức khỏe', 'Tài Bạch': 'tiền bạc', 'Tử Tức': 'con cái', 'Phu Thê': 'vợ chồng', 'Huynh Đệ': 'anh chị em',
};
const THE_MENH = {
  vung: 'Nhìn chung lá số khá vững: nền tốt hơn phần đông, gặp lúc thuận là làm nên.',
  vua: 'Nhìn chung lá số ở mức vừa: có mặt tốt, có mặt xấu, thành hay không phần lớn nhờ sức mình và thời điểm.',
  yeu: 'Nhìn chung lá số thuộc loại phải tự lực nhiều: nên chọn nghề vững, tránh liều; gặp lúc thuận vẫn đổi được hẳn.',
} as const;

export function noiGonTuVi(ls: LaSo, lh: LuuHan, namAm: number): NoiGon {
  const dm = diemMenh(ls), the = dm >= NGUONG_MENH.vung ? 'vung' : dm < NGUONG_MENH.yeu ? 'yeu' : 'vua';
  const cung = ls.cung.filter((c) => c.chi !== ls.menh).map((c) => ({ ten: c.ten, d: diemCung(ls, c.chi) }));
  const tot = cung.filter((c) => c.d >= NGUONG_CUNG.tot).sort((a, b) => b.d - a.d).slice(0, 2);
  const kem = cung.filter((c) => c.d < NGUONG_CUNG.kem).sort((a, b) => a.d - b.d).slice(0, 2);
  const kha = [...cung].sort((a, b) => b.d - a.d)[0];
  const ten = (ds: readonly { ten: string }[]): string => noi(ds.map((c) => VIEC_CUNG[c.ten] ?? c.ten.toLowerCase()));
  const dv = ls.daiVanNay === null ? null : luanDaiVan(ls, ls.daiVanNay, namAm).ket;
  const tuoi = ls.daiVanNay === null ? null : ls.cung[ls.daiVanNay]?.daiVan ?? null;
  const nam = luanNam(ls, lh, namAm).ket;
  return {
    cau: [
      THE_MENH[the],
      tot.length > 0 ? `Mặt mạnh: ${ten(tot)} — thuận hơn phần đông.`
        : `Không có mặt nào nổi trội hẳn; khá nhất là ${ten(kha === undefined ? [] : [kha])}.`,
      kem.length > 0 ? `Cần để tâm hơn: ${ten(kem)}.` : 'Không có mặt nào xấu hẳn.',
      giaiDoan(dv, tuoi, nam, `năm ${String(lh.namAm)}`),
    ],
    ket: { the, tot: tot.map((c) => c.ten).join('|'), kem: kem.map((c) => c.ten).join('|'), dv: dv ?? 'chua', nam },
  };
}

// ---- Bat tu ----

const SUC: readonly string[] = [
  'Sức tự thân yếu hơn hẳn sức ép quanh mình: nên chọn ít việc mà làm cho chắc, dựa vào nghề vững và người tin được.',
  'Sức tự thân hơi yếu so với việc phải gánh: làm được nhưng chóng mệt; có thầy, có bạn đồng hành, có nghề chuyên thì phát.',
  'Sức tự thân gần cân bằng: đủ sức gánh việc, chỉ cần thêm chút trợ lực đúng lúc.',
  'Sức tự thân gần cân bằng, hơi mạnh: đủ sức gánh việc, chỉ cần có chỗ dùng sức cho khỏi phí.',
  'Sức tự thân mạnh: tự tin, chịu được áp lực, cần việc đủ lớn để không phí sức.',
  'Sức tự thân rất mạnh: cần việc lớn, trách nhiệm rõ để dùng sức, kẻo dễ cố chấp, va chạm.',
];
const SUC_TONG = 'Lá số nghiêng hẳn về một phía, hiếm gặp: nên thuận theo thế mạnh sẵn có hơn là cố bù chỗ yếu.';
const SUC_CHUYEN = 'Lá số dồn hẳn sức vào chính mình, hiếm gặp: nên đi theo nghề mình giỏi nhất, phát huy thế mạnh riêng.';
/** [ten hanh, nghia, mau, huong, nghe] — cung du lieu voi `VIEC_HANH` (batTuLuanLoi.ts). */
const HANH: readonly (readonly [string, string, string, string, string])[] = [
  ['Mộc', 'cây cỏ', 'xanh lá', 'hướng Đông', 'giáo dục, xuất bản, cây trồng'],
  ['Hỏa', 'lửa', 'đỏ, hồng', 'hướng Nam', 'điện, ăn uống, truyền thông'],
  ['Thổ', 'đất', 'vàng, nâu', 'vùng giữa', 'đất đai, xây dựng, nông nghiệp'],
  ['Kim', 'kim loại', 'trắng, ánh kim', 'hướng Tây', 'cơ khí, tài chính, ngân hàng'],
  ['Thủy', 'nước', 'đen, xanh dương', 'hướng Bắc', 'vận tải, du lịch, thương mại'],
];

export function noiGonBatTu(b: BatTu, p: PhanTich, gioi: GioiTinh): NoiGon {
  const suc = p.tong !== null ? SUC_TONG : p.chuyenVuong ? SUC_CHUYEN : SUC[p.muc] ?? '';
  const viec = luanViec(b, gioi, p);
  const thuan = viec.filter((v) => v.ket === 'thuan').map((v) => v.ten.toLowerCase());
  const kho = viec.filter((v) => v.ket === 'kho').map((v) => v.ten.toLowerCase());
  const e = hanhDung(p)[0], h = e === undefined ? undefined : HANH[e];
  const van = b.daiVan.find((v) => v.dangChay);
  const kv = van === undefined ? null : luanVanBT(b, van, p).ket;
  const nam = luanNamBT(b, p).ket;
  const cau = [suc,
    ...(thuan.length > 0 ? [`Thuận hơn phần đông: ${noi(thuan)}.`] : []),
    ...(kho.length > 0 ? [`Cần để tâm hơn: ${noi(kho)}.`] : []),
    ...(thuan.length + kho.length === 0 ? ['Các việc lớn đều ở mức bình thường, không mặt nào lệch hẳn.'] : []),
    ...(h === undefined ? [] : [`Hợp với mình là hành ${h[0]} (${h[1]}): màu ${h[2]}, ${h[3]}, nghề như ${h[4]}.`]),
    giaiDoan(kv, van?.tuoi ?? null, nam, `năm ${b.namNay.canChi}`)];
  return { cau, ket: { muc: p.tong !== null ? 'tong' : p.chuyenVuong ? 'chuyen' : String(p.muc), thuan: thuan.join('|'), kho: kho.join('|'),
    hanh: h?.[0] ?? '', van: kv ?? 'chua', nam } };
}

// ---- Chiem tinh ----

const NGUYEN_TO_DE = ['nhiệt tình, chủ động, dám làm', 'thực tế, bền bỉ, giỏi giữ của', 'lanh lợi, thích trao đổi, nhiều ý tưởng',
  'giàu cảm xúc, tinh tế, biết thương người'] as const;
const VAN_CT = {
  thuan: 'Mười hai tháng tới nhìn chung thuận: nên chủ động nắm cơ hội.',
  vua: 'Mười hai tháng tới tốt xấu xen nhau: làm vừa sức, chọn việc chắc.',
  kho: 'Mười hai tháng tới nhiều thử thách: giữ nhịp, đừng vội quyết việc lớn.',
  em: 'Mười hai tháng tới tương đối êm: hợp để làm đều tay việc đang có.',
} as const;

/** `sinh`, `nay`: phut UTC (nhu `vanCT`). */
export function noiGonChiemTinh(ls: LaSoCT, sinh: number, nay: number): NoiGon {
  const to = demNguyenTo(ls), tong = to.reduce((a, b) => a + b, 0), max = Math.max(...to), iTo = to.indexOf(max);
  const troi = max / tong >= 0.35; // cung nguong loi "… trội" (tongLuanCT)
  const cung = CUNG[cungCua(ls.diem[0]?.kinh ?? 0)] ?? '';
  const nha = ls.nha === null ? [] : NHA_TEN.map((t, i) => ({ t: t.toLowerCase(), d: diemNha(ls, i + 1) ?? 0 }));
  const tot = nha.filter((x) => x.d >= NGUONG_NHA.tot).sort((a, b) => b.d - a.d).slice(0, 2);
  const kem = nha.filter((x) => x.d < NGUONG_NHA.kem).sort((a, b) => a.d - b.d).slice(0, 2);
  const v = vanCT(ls, sinh, nay).ket;
  return {
    cau: [
      `Cung hoàng đạo theo ngày sinh là ${cung}; ${troi ? `nét nổi nhất: ${NGUYEN_TO_DE[iTo] ?? ''}` : 'tính cách khá cân bằng, không nghiêng hẳn về mặt nào'}.`,
      ...(ls.nha === null ? ['Thiếu giờ sinh hoặc sinh ở nước ngoài nên chưa chia được từng mảng đời.']
        : [tot.length > 0 ? `Thuận hơn cả: ${noi(tot.map((x) => x.t))}.` : 'Không có mảng đời nào nổi trội hẳn.',
          kem.length > 0 ? `Phải cố gắng hơn: ${noi(kem.map((x) => x.t))}.` : 'Không có mảng đời nào xấu hẳn.']),
      VAN_CT[v],
    ],
    ket: { to: troi ? String(iTo) : 'can', tot: tot.map((x) => x.t).join('|'), kem: kem.map((x) => x.t).join('|'), van: v },
  };
}
