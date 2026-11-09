# Chỉ tay: ảnh chụp thẳng trên mặt bàn vẫn bị chặn (09/11/2026)

- Hỏi: chụp theo cách mới (tay ngửa trên mặt bàn, máy ngay phía trên) máy có dò ra đường không → Đáp (anh, 09/11): vẫn bị chặn.
- Hỏi: bước tiếp sau khi dừng nắn ảnh (kế hoạch `2026-11-09-nan-anh-chup-cheo.md`) → Đáp: camera trong app + thước thăng bằng.
  Câu trên đổi chẩn đoán: ảnh đã thẳng mà vẫn bị chặn → camera + thước thăng bằng (giúp chụp thẳng) không gỡ được lỗi này.
- Hỏi (sau khi báo chẩn đoán đổi): gật cách nào → Đáp (anh, 09/11): "A: dòng chi tiết + nút \"Vẫn dò thử\"".
- Claude thử 09/11 giả thuyết "lòng tay chiếm gần hết khung (app dặn), cổ tay ra ngoài ảnh → mốc cổ tay sai → bị chặn": cắt 7 ảnh
  mẫu theo khung bàn tay, mép dưới ở 0,3 / 0,1 L dưới cổ tay, ngay cổ tay, 0,1 L trên cổ tay → nhận 28/28. **Giả thuyết sai.**
- Chưa biết anh bị chặn ở bước nào (chụp chéo hay mu bàn tay), mốc nào lệch; máy ảo không có ảnh tay anh → chưa đo được.

Việc: biết chính xác vì sao ảnh thẳng của tay anh bị chặn, rồi gỡ đúng chỗ; trong lúc đó anh vẫn có đường máy vẽ.
Xong là khi: (1) có số mốc thật từ ảnh anh (dòng chi tiết hoặc ảnh gửi vào chat); (2) ảnh thẳng trên mặt bàn của anh qua, ra
  đường; (3) bộ đo cũ không lùi (5/5 đường, chặn mu tay 5/5, chụp lại ≥ 85 %); `npm run do` xanh.

Cách đo: dòng chi tiết trên máy anh (bước 1) hoặc ảnh anh gửi (chỉ ở máy ảo, không vào repo, xoá khi xong) → em chạy lại đúng
  ảnh đó trong vòng thử `thu-khoi-chi-tay.mjs`; bộ đo cũ chạy lại để so.

Phương án A (đề xuất) · ~nửa phiên mỗi bước:
  (1) Bị chặn thì hiện thêm dòng "Chi tiết để báo lỗi": bước nào chặn, mốc nào lệch, giá trị và khoảng cho phép (vd "gốc ngón cái
      0,31 — cần 0,35–0,90"); nút "Vẫn dò thử" — dò bỏ qua bước chặn, vẽ đường, ô để trống, ghi rõ "ảnh có thể chụp chéo, đường
      có thể lệch — soi kỹ". (2) Có số thật → chỉnh khoảng mốc / bước "mu bàn tay" theo đúng chỗ lệch, đo lại bộ ảnh.
  Rủi ro: "Vẫn dò thử" vẽ đường sai trên ảnh chéo thật (đo 08/11: nghiêng 45° sai 6/6) → ô để trống, lời cảnh báo; anh không gửi
  được số → vẫn có "Vẫn dò thử".
Phương án B: làm camera trong app + thước thăng bằng như anh chọn · ~2–3 phiên. Rủi ro: ảnh thẳng vẫn bị chặn như hiện nay,
  công cốc; máy ảo không đo được camera / con quay.
Phương án C: bỏ hẳn bước chặn "chụp chéo" · nhỏ. Rủi ro: ảnh chéo nặng vẽ sai không báo (bước chặn chỉ bắt ca ≥ 45°).
  Vì sao A: đo trước rồi mới sửa; anh có đường ngay (nút "Vẫn dò thử"); B, C sửa khi chưa biết lỗi nằm đâu.

Giả sử A hỏng rồi — ba lý do: dòng chi tiết khó đọc → viết bằng tên mốc tiếng Việt, một dòng, chụp màn hình được; "Vẫn dò thử"
  thành mặc định ai cũng bấm, đường sai thành chuyện thường → ô để trống, cảnh báo đỏ; số của một bàn tay làm nới khoảng quá
  rộng → chỉ nới đúng mốc lệch, vừa đủ cho ảnh anh, đo lại ảnh mu tay vẫn bị chặn 4/4.

Vịt cao su 09/11: Gemini không trả lời (quá 2,5 phút) — Claude tự phản biện: dòng chi tiết phải đọc / gõ lại được bằng tay
  (anh chưa gửi được ảnh lần nào) → ngắn, chữ Việt, số hai chữ số lẻ.
Lùi bằng: `git revert` commit gộp `main` của việc này.
KHÔNG làm: camera trong app (đợi số thật); nắn ảnh; lưu ảnh.
Cần anh trả lời: gật A? (gửi thẳng ảnh vào chat được thì nhanh hơn bước 1).
