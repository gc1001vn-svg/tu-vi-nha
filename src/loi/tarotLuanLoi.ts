/**
 * Loi luan trai tarot (`tarotLuan.ts`), Claude soan moi (luat 6). Nguon, ly do chot: `docs/LUAN_TAROT.md` (bo bai, trai: QUY_UOC muc 24).
 */

/**
 * Do tot / xau tung la xuoi (−1,5 … +1,5): an chinh theo nghia Waite (1910); la so theo ten Golden Dawn (Book T: "Lord of Victory",
 * "Lord of Ruin"…) doi chieu Waite; la trieu (nguoi) 0. Thu tu nhu `LA` trong `tarot.ts`.
 */
export const DO: readonly number[] = [
  // An chinh 0–21
  0, 1, 0.5, 1, 0.5, 0.5, 1, 1, 1, 0, 0.5, 0.5, 0, -0.5, 1, -1, -1.5, 1, -1, 1.5, 0.5, 1.5,
  // Gay: At, 2–10, Tieu Dong, Hiep Si, Hoang Hau, Vua
  1, 0.5, 0.5, 1, -0.5, 1, 0, 0.5, 0, -1, 0, 0, 0, 0,
  // Coc
  1, 1, 1, -0.5, -1, 0.5, -0.5, -0.5, 1, 1.5, 0, 0, 0, 0,
  // Kiem
  0.5, 0, -1.5, 0, -1, 0.5, -0.5, -1, -1.5, -1.5, 0, 0, 0, 0,
  // Tien
  1, 0, 1, 0, -1, 1, -0.5, 0.5, 1, 1.5, 0, 0, 0, 0,
];

export const KET = {
  thuan: 'Kết: trải bài thuận — lá sáng nhiều hơn lá tối; việc hỏi có đà, cứ đi tiếp nhưng giữ chừng mực.',
  vua: 'Kết: trải bài lẫn — có lá thuận, có lá báo vướng; kết quả tùy cách mình xử.',
  kho: 'Kết: trải bài báo vướng — lá tối trội hơn; nên chậm lại, gỡ chỗ vướng trước khi làm tiếp.',
} as const;

export const TRONG_TAM = (ten: string, tot: boolean): string => `Lá nặng ký nhất: ${ten} — ${tot ? 'điểm sáng nên dựa vào' : 'chỗ cần để ý nhất'}.`;

export const NHOM = {
  anChinh: 'Nhiều lá ẩn chính: việc này gắn với những sức lớn ngoài tầm tay (thời thế, bước ngoặt đời) — thuận theo thời hơn là cố ép.',
  Gậy: 'Nghiêng về Gậy (lửa): việc làm, sức hăng, cạnh tranh — có đà nhưng dễ va chạm.',
  Cốc: 'Nghiêng về Cốc (nước): tình cảm, niềm vui, quan hệ — lòng người là chính.',
  Kiếm: 'Nghiêng về Kiếm (khí): suy nghĩ, lời nói, tranh chấp, lo âu — giữ đầu óc tỉnh, lời nói mềm.',
  Tiền: 'Nghiêng về Tiền (đất): tiền bạc, công việc, của cải — chuyện thực tế là chính.',
  trieu: 'Nhiều lá triều (người): nhiều người dính vào việc này — gặp gỡ, giao thiệp quyết định nhiều.',
  at: 'Nhiều lá Át: sức mới, khởi đầu mạnh.',
  doi: 'Lửa (Gậy) và nước (Cốc), hoặc khí (Kiếm) và đất (Tiền) cùng mạnh: hai thế đối nhau làm yếu nhau — muốn vừa hăng vừa giữ hòa, vừa nghĩ vừa làm, phải chọn cái trước cái sau.',
  khong: 'Không bộ nào trội: việc nhiều mặt, không nghiêng hẳn về đâu.',
} as const;

export const NGUOC = {
  nhieu: 'Nhiều lá ngược: việc chậm, sức chưa ra hết — điều tốt nhẹ đi, điều xấu cũng nhẹ đi; chưa phải lúc dồn sức.',
  it: 'Ít lá ngược: các lá phát huy đủ nghĩa.',
  khong: 'Không lá nào ngược.',
} as const;

export const MACH = {
  len: 'Mạch bài đi lên: lá sau sáng hơn lá đầu — việc đang chuyển về phía tốt.',
  xuong: 'Mạch bài đi xuống: lá sau tối hơn lá đầu — đừng chủ quan, liệu trước.',
  ngang: 'Mạch bài đi ngang: trước sau gần như nhau — giữ nếp hiện tại thì kết quả cũng như hiện tại.',
  ketTot: 'Lá kết quả thuận: nếu cứ đi đường hiện tại, việc nhiều khả năng thành.',
  ketXau: 'Lá kết quả tối: theo đà hiện tại khó thành — đổi cách làm thì kết quả đổi theo.',
  troNgai: 'Lá trở ngại tối hơn lá hiện trạng: vướng mắc lớn hơn sức đang có — gỡ nó trước.',
  troNgaiNhe: 'Lá trở ngại không nặng: chướng ngại vượt được.',
  hyVong: 'Lá hy vọng – lo sợ tối: nỗi lo của mình có thể đang làm việc khó thêm.',
} as const;

export const KHUYEN = {
  thuan: 'Lời khuyên: làm tiếp, chọn việc chính mà dồn sức; đừng ôm thêm vì đang thuận.',
  vua: 'Lời khuyên: chọn một chỗ yếu nhất trong trải bài mà sửa trước; còn lại cứ đều tay.',
  kho: 'Lời khuyên: chậm lại, hỏi người hiểu việc, chuẩn bị đường lui; xem lại sau một thời gian.',
} as const;

export const NHAC = [
  'Một câu hỏi rút một lần; rút lại ngay cho cùng câu là lấy lá vừa ý, không phải lời đáp.',
  'Tarot là bài chơi Ý thế kỷ 15, thành bài bói ở Pháp – Anh từ thế kỷ 18; nghĩa các lá do người đời sau đặt, mỗi sách một ít khác — đọc như '
    + 'một tấm gương để nghĩ về việc mình, không phải lời phán.',
  'Không có cơ sở khoa học: việc lớn (tiền, sức khỏe, pháp lý) hỏi người chuyên môn.',
] as const;
