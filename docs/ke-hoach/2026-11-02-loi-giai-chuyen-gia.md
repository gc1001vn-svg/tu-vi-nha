# Lời giải chuyên gia — tử vi trước (02/11/2026)

- Hỏi: vấn đề → Đáp (anh, 02/11): "đang dùng mọi thứ dựa trên 1 hoặc 2 quyển sách … phải tìm hiểu từ tất cả mọi quyển sách,
  mọi nguồn chính quy từ tất cả các đất nước … tổng hợp … suy luận và viết ra lời giải đúng nhất … ghi ra trong app"; "không có
  suy luận hay tổng hợp nào về dân gian hay từ các người có kinh nghiệm lâu năm".
- Kiểm 02/11 (em): tử vi — nghĩa sao, cung từ **một sách** (*Tân Biên*, Thái Thứ Lang 1956), giải rời từng sao, hạn chỉ đếm sao
  tốt/xấu · chiêm tinh, thần số, Bát trạch, năm nay — "quan niệm phổ biến", không ghi sách · bát tự đếm thô · chỉ tay (7 sách,
  4 nền), tướng mặt (nhiều nền) đọc rộng nhưng bày theo nền, không chốt. Anh đúng phần lớn; chỉ tay, tướng mặt thì sai chỗ "1–2 sách".
- Hỏi: môn trước · cách hiện → Đáp: tử vi trước, rồi chiêm tinh, bát tự, các môn khác (mỗi môn một kế hoạch ngắn) · app chỉ hiện
  lời chốt; nguồn, lý do chọn ghi trong `docs/` (anh, 02/11).
- Tra 02/11: máy ảo vào được zh.wikisource, ctext, archive.org; không vào lyso.vn, Google, Bing → diễn đàn đọc qua công cụ tìm.
  Không đọc được "mọi quyển sách": sách cổ đọc nguyên văn; sách hiện đại còn bản quyền đọc trích đoạn, rút ý (luật 6); kiến thức
  em đã học ghi rõ "chưa kiểm nguồn". "Đúng nhất" không đo được bằng số — chốt theo: nhiều phái, nhiều thầy cùng nói + lập luận.

Việc (tử vi):
  (1) Đọc, lập bảng so trong `docs/LUAN_TU_VI.md`: cổ (*Toàn Thư*, *Toàn Tập*/《紫微斗數》 Tục Đạo Tạng) · Đài Loan – Hồng Kông
      (Trung Châu – Vương Đình Chi, Tam hợp, Phi tinh – Tứ hóa, Tử Vân, Lục Bân Triệu…) · Việt (Thái Thứ Lang, Nguyễn Phát Lộc,
      Thiên Lương, Vũ Tài Lục, Song An…) · kinh nghiệm thầy trên diễn đàn, sách mẫu lá số · Nhật, Hàn nếu có.
  (2) Chốt cách luận theo tầng: tổng luận Mệnh – Thân (chính tinh + tam phương tứ chính + cách cục + tứ hóa + cát/sát + Tuần
      Triệt + Mệnh – Cục) → từng cung → đại vận, năm (thêm tứ hóa lưu niên). Mỗi luật: lời chốt (app) + vì sao, nguồn (docs).
  (3) Lõi thuần `src/loi/tuVi/luan*.ts`: lá số → nhận định xếp ưu tiên → câu Claude soạn. Khối tử vi: "Lời giải" thay danh sách
      nghĩa từng sao; dữ liệu gửi AI tổng hợp dùng lời chốt mới.
Xong là khi, trên iPhone: khối tử vi có tổng luận vài đoạn · bấm cung → một đoạn luận cung đó (không còn liệt kê nghĩa từng sao)
  · hạn năm nay luận ra câu, không chỉ "tốt/xấu/lẫn lộn" · lời là lời chốt, không kể sách · ghi "Claude tổng hợp từ nhiều phái".

Cách đo: `npm run do` + test mới (ngày sinh giả):
- 3.000 lá số giả: lời đủ tầng, không câu trống, không cặp câu ngược nhau trong một cung (bảng cặp ngược), độ dài trong khoảng.
- Cách cục: lá số mẫu sách nêu tên cách (≥20 lá) → app nhận đúng cách sách nêu; ghi số trúng.
- Không chung chung: hai lá số khác nhau phải khác lời rõ (đo % câu trùng, như chỉ tay 54 %).
- Anh đọc lá số của anh, báo chỗ sai, khó hiểu (anh chấm — máy không chấm được đúng sai).

Phương án A (chọn): lõi luật + lời Claude soạn sẵn, chạy không mạng như các môn khác · ~5–8 phiên (ước, chưa chắc) · rủi ro:
  tổ hợp quá nhiều sao; nguồn hiện đại khó đọc; lời chung chung.
Phương án B: chỉ soạn bộ luật, để AI Groq viết thành câu lúc xem — ít việc hơn nhưng cần mạng, khoá Groq, AI có thể bịa.
  Vì sao chọn A: anh muốn lời chính em suy luận và viết; A chạy cả khi không mạng, không khoá.

Giả sử A hỏng rồi — ba lý do:
1. Tổ hợp nổ (14 chính tinh × 12 cung × độ sáng × sao đi cùng) → luận theo tầng: lời gốc theo bộ chính tinh + câu bổ cho tứ
   hóa, cát/sát, Tuần Triệt; xếp ưu tiên, mỗi cung giữ vài câu chính.
2. Sách hiện đại có bản quyền, trang bị chặn → trích đoạn qua công cụ tìm, ghi rõ mức kiểm; nguồn cổ đọc nguyên văn.
3. Lời "ai đọc cũng thấy đúng" → đo độ khác nhau giữa lá số; câu nào hiện ở >30 % lá số thì viết lại cho cụ thể.

Lùi bằng: lõi mới ở file riêng, khối tử vi đổi trong một commit dồn; hỏng thì `git revert` về lời cũ. Lá số, hồ sơ không đổi.
KHÔNG làm: phán chết, bệnh nặng, tai nạn cụ thể · người nhà (đợt 9) · môn khác trong kế hoạch này · đợt 8 cũ (Kỳ Môn…) lùi lại.
Cần anh: đọc lời giải lá số của anh khi xong tổng luận, báo chỗ sai/khó hiểu · có sách tử vi giấy muốn em ưu tiên thì báo tên.
