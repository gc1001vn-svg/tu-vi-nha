/**
 * Boi Kieu (dot 4): chu Truyen Kieu 3.254 cau (soat ba ban: `scripts/doi-chieu/soat-kieu.py`, `QUY_UOC` muc 17)
 * + 21 doan: "Mo dau" va 20 hoi theo muc luc ban Nguyen Can Mong 1936; ten hoi, tom tat do Claude soan lai.
 * Loi thuan: so ngau nhien do giao dien boc roi truyen vao `queKieu`.
 */
import CHU from './truyenKieu.txt?raw';

export const CAU: readonly string[] = CHU.trimEnd().split('\n');
/** 1.627 cap luc bat — que boi la mot cap. */
export const SO_CAP = CAU.length / 2;

export interface Hoi { readonly dau: number; readonly ten: string; readonly tomTat: string }

export const HOI: readonly Hoi[] = [
  { dau: 1, ten: 'Mở đầu', tomTat: 'Lời than chữ tài, chữ mệnh. Nhà Vương viên ngoại đời Gia Tĩnh triều Minh có hai chị em Thúy Kiều, Thúy Vân; Vân đoan trang, Kiều sắc sảo và tài hoa hơn.' },
  { dau: 39, ten: 'Viếng mộ Đạm Tiên, gặp Kim Trọng', tomTat: 'Tiết Thanh minh, chị em đi chơi xuân, gặp nấm mộ ca nhi bạc mệnh Đạm Tiên; Kiều thương khóc, đề thơ. Trên đường về gặp Kim Trọng, hai bên cùng để ý nhau.' },
  { dau: 171, ten: 'Kiều nằm mộng, Kim tương tư', tomTat: 'Kiều mộng thấy Đạm Tiên báo tên mình có trong sổ đoạn trường. Kim Trọng nhớ Kiều, dọn đến trọ sát vách nhà nàng mong gặp lại.' },
  { dau: 289, ten: 'Gặp gỡ, thề nguyền', tomTat: 'Kim nhặt được cành thoa Kiều đánh rơi, hai người trò chuyện, trao kỷ vật. Nhân cả nhà đi vắng, Kiều sang thăm Kim, hai người thề nguyền, Kiều gảy đàn cho Kim nghe.' },
  { dau: 569, ten: 'Gia biến', tomTat: 'Kim Trọng phải về quê chịu tang chú. Nhà Kiều bị vu oan, cha và em bị bắt, của cải bị lấy sạch; Kiều quyết bán mình chuộc cha.' },
  { dau: 625, ten: 'Bán mình chuộc cha', tomTat: 'Mã Giám Sinh đến hỏi mua Kiều, ngã giá như món hàng; lễ xong, cha Kiều được tha.' },
  { dau: 693, ten: 'Trao duyên', tomTat: 'Đêm trước khi đi, Kiều nhờ Thúy Vân thay mình kết duyên với Kim Trọng, khóc thương mối tình dang dở rồi ngất đi. Sáng ra kiệu hoa đến đón.' },
  { dau: 781, ten: 'Theo Mã Giám Sinh', tomTat: 'Kiều theo Mã Giám Sinh rời nhà, bị hắn làm nhục ở nhà trọ. Về tới Lâm Truy mới biết hắn mua người cho Tú Bà mở lầu xanh.' },
  { dau: 985, ten: 'Lầu Ngưng Bích', tomTat: 'Kiều rút dao tự vẫn không thành. Tú Bà dỗ dành, hứa gả chồng tử tế, đưa nàng ra ở lầu Ngưng Bích; một mình nàng nhớ người yêu, thương cha mẹ.' },
  { dau: 1055, ten: 'Mắc lừa Sở Khanh', tomTat: 'Sở Khanh giả làm người hào hiệp hứa cứu, đưa Kiều trốn rồi bỏ mặc. Tú Bà bắt về đánh đập, Kiều đành nhận tiếp khách.' },
  { dau: 1199, ten: 'Tú Bà dạy nghề', tomTat: 'Tú Bà dạy Kiều nghề làng chơi. Nàng sống chán chường giữa chốn lầu xanh, thương thân mình.' },
  { dau: 1271, ten: 'Gặp Thúc Sinh', tomTat: 'Thúc Sinh, con một nhà buôn, say mê Kiều và muốn chuộc nàng về làm vợ lẽ; Kiều lo vợ cả và cha chàng không thuận.' },
  { dau: 1375, ten: 'Về làm vợ lẽ Thúc Sinh', tomTat: 'Thúc Sinh chuộc Kiều khỏi lầu xanh. Cha chàng kiện lên quan; quan đọc thơ Kiều, cảm tài nàng, xử cho hai người ở với nhau.' },
  { dau: 1475, ten: 'Thúc Sinh về thăm nhà', tomTat: 'Kiều khuyên Thúc Sinh về quê gặp vợ cả là Hoạn Thư để nói rõ mọi chuyện; hai người tiễn biệt nhau.' },
  { dau: 1527, ten: 'Hoạn Thư đánh ghen', tomTat: 'Hoạn Thư biết chuyện, sai người bắt cóc Kiều về làm con hầu, bắt nàng hầu rượu, gảy đàn ngay trước mặt Thúc Sinh.' },
  { dau: 1925, ten: 'Trốn khỏi nhà họ Hoạn', tomTat: 'Kiều xin ra Quan Âm các chép kinh. Biết khó thoát, nàng mang theo chuông vàng khánh bạc trốn đi, nương nhờ sư Giác Duyên.' },
  { dau: 2061, ten: 'Lại vào lầu xanh', tomTat: 'Sợ lộ chuyện, Giác Duyên gửi Kiều ở nhà Bạc Bà; Bạc Bà, Bạc Hạnh lừa bán nàng vào lầu xanh lần nữa.' },
  { dau: 2165, ten: 'Gặp Từ Hải', tomTat: 'Từ Hải, người anh hùng, gặp Kiều, chuộc nàng làm vợ. Nửa năm sau chàng từ biệt đi lập nghiệp lớn, rồi trở về đón nàng.' },
  { dau: 2289, ten: 'Báo ân báo oán', tomTat: 'Có Từ Hải giúp, Kiều đền ơn những người từng cứu giúp mình, trị tội Tú Bà, Mã Giám Sinh, Sở Khanh…; riêng Hoạn Thư biết nhận lỗi nên được tha.' },
  { dau: 2455, ten: 'Từ Hải mắc mưu', tomTat: 'Hồ Tôn Hiến dụ hàng; Kiều tin lời, khuyên Từ Hải ra hàng, chàng bị đánh úp, chết đứng. Kiều bị ép gả cho viên thổ quan, nàng gieo mình xuống sông Tiền Đường.' },
  { dau: 2645, ten: 'Đoàn tụ', tomTat: 'Sư Giác Duyên cứu Kiều về am. Kim Trọng đỗ đạt, đã cưới Thúy Vân mà vẫn đi tìm Kiều; cả nhà đoàn tụ, Kiều và Kim giữ tình bạn thay duyên vợ chồng. Lời kết bàn chữ tâm, chữ tài.' },
];

export interface QueKieu {
  /** So thu tu cau luc (le, 1-…). */
  readonly so: number;
  readonly luc: string;
  readonly bat: string;
  /** Mot cap truoc, mot cap sau de doc cho ra y (rong o dau, cuoi truyen). */
  readonly truoc: readonly string[];
  readonly sau: readonly string[];
  readonly hoi: Hoi;
}

/** Cap thu `cap` (0 … SO_CAP − 1): cau luc 2·cap + 1, cau bat 2·cap + 2. */
export function queKieu(cap: number): QueKieu {
  if (!Number.isInteger(cap) || cap < 0 || cap >= SO_CAP) throw new RangeError(`Cặp câu ${String(cap)} ngoài 0–${String(SO_CAP - 1)}`);
  const i = cap * 2;
  const so = i + 1;
  const hoi = HOI.filter((h) => h.dau <= so).at(-1);
  if (hoi === undefined) throw new Error('Thiếu bảng hồi');
  return { so, luc: CAU[i] ?? '', bat: CAU[i + 1] ?? '', truoc: CAU.slice(Math.max(0, i - 2), i), sau: CAU.slice(i + 2, i + 4), hoi };
}
