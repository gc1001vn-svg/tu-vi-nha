# Lời giải dễ hiểu cho người thường — đợt 1: Tử vi, Bát tự, Chiêm tinh (05/11/2026)

- Hỏi: anh đọc lời giải thấy sao → Đáp (anh, 05/11): "nhiều chỗ không hiểu lắm… là người bình thường đọc thử xem".
- Claude đọc thử thẻ "Của tôi" (hồ sơ giả 10/05/1990 06:14 Hà Nội), thấy 6 lỗi: (1) không có câu tóm lại — đọc hết vẫn không biết
  tốt hay xấu, nên làm gì; (2) thuật ngữ không giải nghĩa ("hãm địa", "tam hợp", "Hóa Lộc theo sao Cự Môn", "thất lệnh (hưu)",
  "Ấn hóa Sát", "cung hãm", "nhà khuất", "Thế chữ T") hoặc giải nghĩa ở cuối khối; (3) tốt xấu lẫn lộn không ai cân ("danh và lợi
  đều có" cạnh "sức chỉ bằng khoảng một nửa", "phúc mỏng"); (4) số không tự giải thích ("24 sao tốt, 25 sao xấu" mà "hạn xấu",
  "lệch 4,6°", đại vận tới 124 tuổi); (5) chữ học thuật chen giữa ("Đại Chính tạng số 1308", "Toàn Thư… Đẩu Quân", bảng độ kèm
  tiếng Anh); (6) câu "Claude tổng hợp nhiều phái… chỉ để tham khảo" lặp nhiều lần trong một khối. Dễ hiểu nhất: Hướng nhà,
  Tuổi hợp, đầu khối Năm nay (có lời khuyên cụ thể).
- Hỏi: phạm vi → Đáp: 3 khối khó nhất trước (Tử vi, Bát tự, Chiêm tinh); anh đọc thấy ổn thì làm 11 khối còn lại cùng cách.
- Hỏi: máy dò chỉ tay (ảnh anh 05/11 gán nhầm tên đường) → Đáp: sửa sau phần lời giải.
- Hỏi: làm ở đâu → Đáp: phiên mới. Anh đã duyệt kế hoạch này 05/11: làm luôn sau bước đầu phiên A–F, không chờ duyệt lại.

Việc: ba khối Tử vi, Bát tự, Chiêm tinh đọc được với người không biết gì về môn đó.
Xong là khi: mỗi khối mở đầu bằng đoạn "Nói gọn" 3–5 câu lời thường (mạnh ở đâu, cần lưu ý gì, giai đoạn này nên làm gì); thuật
  ngữ còn lại có nghĩa ngay lần đầu xuất hiện trong khối; bảng số, độ, cách tính khác, nguồn sách nằm trong mục "Chi tiết cho người
  rành" đóng sẵn; câu "chỉ để tham khảo" một lần cuối khối; anh đọc lại 3 khối trên iPhone và gật.

Cách đo:
- Đọc thử như người thường, trước và sau khi sửa: `npm run build`, `npx vite preview --port 4173`, Playwright (Chromium có sẵn);
  đặt `localStorage['tvn.v1']` = `{"hoSo":[{id, ten, gioiTinh, ngaySinh, gioSinh, noiSinh}],"saoLuuLuc":null}` với ngày sinh GIẢ,
  bấm thẻ "Của tôi", mở mọi `<details>`, lấy chữ hiện ra. Xong `kill` tiến trình vite (npx không tự tắt tiến trình con).
- Thước mới (`tests/`): 30 hồ sơ giả × 3 khối — có "Nói gọn", dài ≤ ~600 ký tự, không chứa thuật ngữ trong danh sách mà chưa kèm
  nghĩa, chữ đúng quy ước (như `saiChu` ở `tests/AIHoiSau.test.ts`); in độ dài phần nằm trên mục "Chi tiết" trước / sau.
- `npm run do` xanh.

Phương án A (đề xuất): giữ lời giải chuyên gia; thêm "Nói gọn" sinh từ số máy đã tính (điểm cung, kết đại vận và năm, thân vượng
  nhược, hành hợp, nguyên tố trội…) bằng câu Claude soạn sẵn; bảng giải nghĩa thuật ngữ dùng chung, chèn nghĩa lần đầu gặp; dời
  phần kỹ thuật vào "Chi tiết" · ~1 phiên · rủi ro: "Nói gọn" nói khác lời luận bên dưới (chặn: sinh từ cùng điểm, thước so kết).
Phương án B: viết lại toàn bộ lời giải 3 khối bằng lời thường · ~2–3 phiên · rủi ro: mất phần đọc nhiều phái (QUY_UOC mục 28–40),
  phải đo lại hết.
  Vì sao chọn A: sửa đúng chỗ người thường vấp, giữ phần chuyên gia cho người cần, ít đụng số đã kiểm.

Giả sử A hỏng rồi — ba lý do: (1) "Nói gọn" vẫn đầy chữ môn → thước cấm thuật ngữ chưa giải nghĩa; (2) "Nói gọn" chung chung, ai
  cũng như ai → mỗi câu dựa một số riêng của lá số, thước: 30 hồ sơ ra ≥ 20 đoạn khác nhau; (3) dời chữ vào "Chi tiết" làm mất chỗ
  anh đang dùng (bấm cung xem sao) → giữ nguyên lá số tử vi và thao tác bấm cung, chỉ dời chữ giải thích.

Lùi bằng: `git revert` commit gộp `main` của đợt này.
KHÔNG làm: 11 khối còn lại (sau khi anh gật 3 khối này); máy dò chỉ tay (đợt sau); dữ liệu gửi AI (giữ nguyên, đã đo 05/11);
  thẻ "Hôm nay", "Phong thủy", "Gieo quẻ".
Cần anh trả lời: không có — xong thì anh đọc lại 3 khối trên iPhone.
