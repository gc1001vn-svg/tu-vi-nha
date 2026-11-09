# Chỉ tay: ảnh chụp chéo vẫn dò đúng (09/11/2026)

- Hỏi: việc kế sau "ảnh bị chặn vẫn hiện" (QUY_UOC mục 47) → Đáp (anh, 09/11): "Thử rồi, ảnh hiện, làm tiếp phương án B".
- Hỏi: cách nắn 3D không dùng được — gật hướng nào? → Đáp (anh, 09/11): "A: nắn theo khuôn 6 mốc".
- Số đo 08/11 (bộ ảnh nghiêng tổng hợp: 7 ảnh lòng tay × 4 hướng × 15/30/45°): bước chặn bật — 15° qua 28/28, 30° qua 26/28 (2 ảnh
  bị nhận nhầm "mu bàn tay", một ảnh MediaPipe chắc 0,98 là tay kia), 45° qua 16/28. Tắt bước chặn, 2 ảnh có đáp án: 15–30° vẽ
  sai ≥ 1 đường 6/15 lần (kể cả 15°: 3/8), 45° 6/6 → máy dò nhạy với nghiêng, không chỉ bước chặn.
- Claude thử 09/11 cách nắn định làm (mốc 3D MediaPipe → mặt phẳng lòng tay): **không dùng được** — ảnh thẳng ra nghiêng 7–25°,
  ảnh nghiêng 30° có khi ra 3°; độ sâu z của mốc ảnh cũng lệch (ảnh thẳng 3–22°, nghiêng 45° có ảnh ra 12°).
- Giới hạn chung: chỉ có ảnh nghiêng tổng hợp (nghiêng phẳng cả ảnh), chưa có ảnh thật chụp chéo có đáp án.

Việc: ảnh chụp chéo vừa (≤ 30°) dò ra gần như ảnh thẳng; bớt chặn nhầm.
Xong là khi: bộ ảnh nghiêng, 2 ảnh có đáp án: 15–30° vẽ sai ≤ 2/16 lần (nay 6/15), ô trùng với bản thẳng ≥ 80 %; 45° không vẽ sai
  (đúng, hoặc chặn kèm ảnh); chặn nhầm "mu bàn tay" ở 15–30° = 0 (nay 2/56); ảnh thẳng mọi số không lùi (5/5 đường, chặn mu tay
  5/5, chụp lại ≥ 85 %); dò ≤ 1 giây; anh chụp chéo nhẹ trên iPhone vẫn ra đường đúng.

Cách đo (dựng trước khi sửa): `scripts/doi-chieu/tao-anh-nghieng.py` (tạo bản nghiêng vào thư mục tạm, ngoài repo) +
  `do-chi-tay-dap-an.mjs --nghieng <thư mục>`: biến điểm đáp án theo cùng phép nghiêng; in theo góc: đường đúng/sai, bị chặn (vì gì),
  ô trùng với bản thẳng. Đo bản đang chạy làm nền. Đo **trước tiên**: mốc 2D MediaPipe trên ảnh nghiêng lệch bao nhiêu so với
  mốc ảnh thẳng biến theo đúng phép nghiêng — lệch > 0,05 L ở 30° thì A không cứu được, dừng và báo anh.

Phương án A (đề xuất): nắn theo khuôn 6 mốc 2D (cổ tay, gốc ngón cái, 4 gốc ngón) · ~1–2 phiên. Khuôn = vị trí trung bình
  6 mốc trên ảnh lòng tay thẳng; tìm phép chiếu đưa 6 mốc về gần khuôn, chỉ nắn khi phép chiếu đó đủ mạnh (tương đương nghiêng
  ≥ ~12°) — ảnh gần thẳng giữ như cũ. Lấy ảnh khung chuẩn qua phép chiếu (thay phép xoay / thu hiện nay), vẽ vết ngược lại lên ảnh.
  Rủi ro: tay dáng khác khuôn (bàn tay hẹp, dài) bị coi là nghiêng → nắn méo; bộ đo tổng hợp hợp với cách này hơn ảnh thật;
  lòng tay không phẳng (gò ngón cái phồng) → thử cả 5 mốc (bỏ gốc ngón cái), chọn theo số.
Phương án B: camera ngay trong app + thước thăng bằng (con quay của máy) để chụp thẳng ngay từ đầu · ~2 phiên. Sửa đúng gốc,
  nhưng máy ảo không có Safari, camera, con quay → em không tự đo được, phải nhờ anh thử (trái luật "chưa đo được thì không sửa").
Phương án C: dừng ở mục 47 (ảnh hiện + lời nhắc chụp trên mặt bàn) · 0 công. Ảnh chụp chéo vẫn bị chặn hoặc vẽ sai.
  Vì sao A: đo được trên máy ảo; có ngưỡng nên ảnh thẳng không đổi; nếu số không đạt thì báo anh, không gộp.

Giả sử A hỏng rồi — ba lý do:
- Dáng tay bị nhầm là nghiêng → ảnh thẳng 7 bàn tay khác nhau phải giữ y kết quả (ngưỡng); lệch thì nâng ngưỡng, không đổi đáp án.
- Khớp vừa ảnh tổng hợp, ảnh thật vẫn sai → báo rõ là số trên ảnh tổng hợp; xin anh 2 ảnh cùng bàn tay (một thẳng trên mặt bàn,
  một chéo vừa), so hai kết quả — ảnh chỉ ở máy ảo, không vào repo, xoá khi xong.
- "Mu bàn tay" vẫn chặn nhầm vì MediaPipe đoán sai tay khi nghiêng (0,98) → đo lại sau nắn; còn thì đổi chặn thành nhắc khi
  ảnh có vẻ nghiêng, đo lại 4/4 ảnh mu tay thật vẫn bị nhắc / chặn.

Vịt cao su 09/11 (Gemini): mốc 2D cũng lệch khi nghiêng; tay không phẳng; ngưỡng kích nhầm khi ngón xoè/khép → thêm bước đo mốc
  trước, thử 5/6 mốc, ảnh thẳng phải giữ y kết quả.
Lùi bằng: `git revert` commit gộp `main` của việc này.
KHÔNG làm: camera trong app (phương án B); đổi cách tìm đường trong lõi; đổi ô, lời giải; lưu ảnh.
Cần anh trả lời: gật A? (gửi được 2 ảnh cùng bàn tay — thẳng + chéo vừa — thì tốt, không bắt buộc).
- **Kết quả bước đo trước tiên (09/11) → DỪNG A** (đúng điều kiện dừng ở trên): mốc 2D MediaPipe trên ảnh nghiêng so với mốc ảnh
  thẳng biến theo đúng phép nghiêng, trung vị độ lệch: 30° — cổ tay 0,068 L, gốc ngón cái 0,080 L, 4 gốc ngón 0,026–0,032 L (phép
  nghiêng thật dời mốc ~0,18 L); 15° — cổ tay 0,053 L; 45° — cổ tay 0,111 L. Độ nghiêng dọc ngón chỉ đọc được từ cổ tay + gốc ngón
  cái (4 gốc ngón gần thẳng hàng, không cho biết độ nghiêng) mà hai mốc này lệch quá ngưỡng → nắn theo khuôn sẽ nắn sai. Chưa sửa mã.
