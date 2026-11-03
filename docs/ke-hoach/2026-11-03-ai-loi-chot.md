# Lời chốt các môn vào AI tổng hợp (03/11/2026, nối kế hoạch `2026-11-02-loi-giai-chuyen-gia.md`)

- Hỏi: làm gì → Đáp (anh, 03/11): "Làm tiếp: đưa lời chốt các môn vào AI tổng hợp".
- Kiểm 03/11: gói dữ liệu "AI tổng hợp" (`duLieuNguoi`) gửi số liệu thô từng môn; chỉ tướng mặt, tuổi hợp có lời chốt — tử vi, năm nay,
  bát tự, Bát trạch, thần số, chiêm tinh thì AI tự giải lại theo "cách hiểu phổ biến", có thể nói khác app. Hạn mức Groq 8.000 token/phút
  tính cả đầu ra xin trước: dữ liệu 8.500 ký tự + lời dặn ~1.060 → lượt đầu vừa đủ 3.000 token ra; gửi nguyên lời chốt (~19.000 ký tự) là vỡ.

Việc: (1) mỗi môn một dòng "Lời chốt của app" gọn (câu đầu mỗi đoạn luận, cắt ở ranh từ) + kết đại vận / năm ("app luận") + chấm 12 cung tử
  vi ("app chấm") · (2) bớt phần thô đã có lời chốt thay: phụ tinh nhỏ của 12 cung, hạn năm đếm sao kiểu Tân Biên, đếm ngũ hành thô bát tự,
  góc chiếu phụ, lời giải dài năm nay, câu dài tuổi hợp · (3) lời dặn AI: lấy lời chốt làm kết luận chính · (4) đo AI thật (Groq).
Xong là khi: lượt đầu vẫn xin đủ ~3.000 token ra; hỏi thêm sau lời tổng hợp dài vẫn giữ lời đó (test `AIGoi`); 6 môn có lời chốt.
Cách đo: `tests/AI.test.ts` (6 môn có lời chốt, 12 cung có "app chấm", `vuaHanMuc` ≥ 2.900) · `tests/AIGoi.test.ts` · `do-ai.ts` 3 hồ sơ giả.
KHÔNG làm: đổi mô hình, hạn mức · lời chốt chọn ngày, phi tinh (không thuộc hồ sơ người) · AI tự đọc ảnh.
Lùi bằng: `git revert` (chỉ đổi `duLieu.ts`, `loiDan.ts`, test).
Cần anh: bấm "AI tổng hợp" ở hồ sơ của anh, xem lời AI có khớp lời chốt từng khối không, báo chỗ lệch.
