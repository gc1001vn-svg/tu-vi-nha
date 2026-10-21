/**
 * Thuoc Lo Ban (dot 5, QUY_UOC muc 21): ba thuoc 52,2 · 42,9 · 38,8 cm, moi thuoc chia cung lon deu nhau, lap lai theo vong.
 * Tinh bang so nguyen micromet de ranh cung dung tung 0,1 mm (42,9 / 8 = 5,3625 cm); dung ranh thi thuoc cung sau.
 * Chi cung lon + tot/xau: cung nho cac nguon vênh, chua o nao du 2 nguon. Nghia tung cung do Claude soan lai.
 */
export interface CungLoBan { readonly ten: string; readonly tot: boolean; readonly nghia: string }
export interface ThuocLoBan { readonly dai: number; readonly ten: string; readonly dung: string; readonly cung: readonly CungLoBan[] }
/** Mot lan cung xuat hien tren thuoc: `tuMm`–`denMm` la cac so mm nguyen nam trong cung (ca hai dau). */
export interface DoanCung { readonly cung: CungLoBan; readonly tuMm: number; readonly denMm: number }
export interface XemThuoc { readonly thuoc: ThuocLoBan; readonly doan: DoanCung; readonly totDuoi?: DoanCung; readonly totTren?: DoanCung }

const c = (ten: string, tot: boolean, nghia: string): CungLoBan => ({ ten, tot, nghia });

export const THUOC_LO_BAN: readonly ThuocLoBan[] = [
  { dai: 52.2, ten: 'Thông thủy', dung: 'khoảng lọt lòng: cửa đi, cửa sổ, ô thoáng, giếng trời', cung: [
    c('Quý Nhân', true, 'Được người giúp, làm ăn khấm khá.'), c('Hiểm Họa', false, 'Dễ gặp chuyện bất ngờ, hao tổn.'),
    c('Thiên Tai', false, 'Dễ ốm đau, gặp chuyện không may.'), c('Thiên Tài', true, 'Lộc trời, tiền của vào nhà.'),
    c('Nhân Lộc', true, 'Công việc, con cháu hanh thông.'), c('Cô Độc', false, 'Dễ chia lìa, hiu quạnh.'),
    c('Thiên Tặc', false, 'Dễ mất của, bị hại ngầm.'), c('Tể Tướng', true, 'Hanh thông, được trọng vọng.'),
  ] },
  { dai: 42.9, ten: 'Dương trạch', dung: 'khối đặc: bếp, bệ, bậc, giường, tủ, bàn', cung: [
    c('Tài', true, 'Tiền của, phúc lộc.'), c('Bệnh', false, 'Đau ốm, hao tài.'), c('Ly', false, 'Chia lìa, thất thoát.'),
    c('Nghĩa', true, 'Thêm người, điều lành.'), c('Quan', true, 'Công danh, thăng tiến.'),
    c('Kiếp (Nạn)', false, 'Tai nạn, mất của.'), c('Hại', false, 'Tai họa, thị phi.'), c('Bản (Mạng)', true, 'Gốc vững, của cải bền.'),
  ] },
  { dai: 38.8, ten: 'Âm phần', dung: 'đồ thờ: bàn thờ, tủ thờ, bài vị; mộ', cung: [
    c('Đinh', true, 'Thêm người, đỗ đạt.'), c('Hại', false, 'Thị phi, ốm đau.'), c('Vượng', true, 'Hưng vượng, nhiều điều vui.'),
    c('Khổ', false, 'Vất vả, mất mát.'), c('Nghĩa', true, 'Điều lành, lợi ích.'), c('Quan', true, 'Phú quý, công danh.'),
    c('Tử', false, 'Chia ly, mất mát.'), c('Hưng', true, 'Hưng thịnh, con cháu.'), c('Thất', false, 'Thất thoát, cô quạnh.'),
    c('Tài', true, 'Tài lộc, phúc.'),
  ] },
];

const UM_CM = 10_000;
// Be rong mot cung (um): so nguyen voi ca ba thuoc — 65250, 53625, 38800.
const rong = (t: ThuocLoBan): number => Math.round(t.dai * UM_CM) / t.cung.length;

function doan(t: ThuocLoBan, k: number): DoanCung {
  const r = rong(t);
  return { cung: t.cung[k % t.cung.length] as CungLoBan, tuMm: Math.ceil((k * r) / 1000), denMm: Math.ceil(((k + 1) * r) / 1000) - 1 };
}

/** So do tinh bang cm (0 < cm ≤ 10.000). Cung xau thi kem doan tot gan nhat ben duoi (neu co) va ben tren. */
export function xemLoBan(cm: number): readonly XemThuoc[] {
  if (!Number.isFinite(cm) || cm <= 0 || cm > 10_000) throw new Error('Số đo cần lớn hơn 0 và không quá 10.000 cm');
  const um = Math.round(cm * UM_CM);
  return THUOC_LO_BAN.map((t) => {
    const k = Math.floor(um / rong(t));
    const d = doan(t, k);
    if (d.cung.tot) return { thuoc: t, doan: d };
    let duoi = k - 1;
    while (duoi >= 0 && !doan(t, duoi).cung.tot) duoi--;
    let tren = k + 1;
    while (!doan(t, tren).cung.tot) tren++;
    return { thuoc: t, doan: d, ...(duoi >= 0 ? { totDuoi: doan(t, duoi) } : {}), totTren: doan(t, tren) };
  });
}
