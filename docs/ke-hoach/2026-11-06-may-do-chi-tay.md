# Máy dò chỉ tay: hết gán nhầm đường (06/11/2026)

- Hỏi: việc kế sau lời giải dễ hiểu → Đáp (anh, 05/11): "Đọc rồi, ổn, làm tiếp máy dò chỉ tay". Lỗi anh thấy trên iPhone 05/11:
  đường đời không vòng quanh gò ngón cái, thiếu đường tình; chụp lại đổi ~1/4 ô (TIEN_DO mục 4, QUY_UOC mục 27).
- Hỏi: anh gửi 2–3 ảnh lòng bàn tay (ảnh đã thử 05/11 + 1–2 lần chụp lại) để đo? → Đáp: gửi. Ảnh chỉ nằm trong máy ảo phiên
  làm việc, không vào repo, xoá khi xong (luật 1 `CLAUDE.md`).
- Hỏi: ô máy không chắc (sát ranh dài / vừa, rõ / mờ) để trống hay vẫn điền? → Đáp: để trống — chỉ điền ô máy đo chắc.
- Claude thử máy dò hiện tại 06/11 (bản dựng thật, Chromium) trên ảnh mạng giấy phép mở (Commons; Flickr qua Openverse): **lặp
  đúng lỗi của anh 2/2 ảnh lòng bàn tay rõ** — đường đời chạy ngang theo đường trí rồi đổ thẳng xuống giữa lòng tay, không vòng gò
  ngón cái; ảnh **mu bàn tay** vẫn bị vẽ "chỉ tay"; ảnh bàn tay đầy khung có lúc báo "không thấy tay" (đệm viền thì thấy).
  Gốc lỗi đường đời: vùng tìm quá rộng (bán kính tới 0,65 L), cộng cả nếp nhăn cắt ngang, không ràng buộc điểm cuối.

Việc: máy dò vẽ đúng đường đời, đường trí, đường tình trên ảnh lòng bàn tay chụp bằng điện thoại; ô không chắc để trống.
Xong là khi: trên ảnh của anh, đường đời vòng quanh gò ngón cái và có đường tình (anh xem trên iPhone và gật); trên bộ ảnh đo
  không còn đường nào bị gán nhầm; chụp lại cùng bàn tay giữ ≥ 85 % ô đã điền; ảnh mu bàn tay bị nhắc chụp lại.

Cách đo (dựng trước, chưa sửa máy dò):
- Bộ ảnh: ảnh anh gửi + ~8 ảnh lòng bàn tay mạng (tải vào thư mục tạm, repo chỉ ghi tên ảnh, giấy phép) + 1–2 ảnh mu bàn tay.
- Đáp án: Claude đánh dấu 3–5 điểm **chắc chắn** trên mỗi đường thấy rõ, làm **trước** khi sửa; điểm ảnh mạng ghi vào repo,
  điểm ảnh anh chỉ để trong thư mục tạm. Đường "đúng" khi ≥ 2/3 điểm cách vết ≤ 0,06 L; "nhầm" khi vết nằm trên đường khác;
  "thiếu" khi đường có mà không vẽ.
- Chụp lại: cặp ảnh thật của anh + mỗi ảnh 4 bản nhiễu (xoay ±5°, thu 0,85, sáng ±25 %) → % ô trùng (bỏ ô trống), % ô trống.
- Kịch bản đo mới trong `scripts/doi-chieu/`; thước `tests/ChiTayDo.test.ts` (ảnh tổng hợp) giữ, thêm ca; `npm run do` xanh.

Phương án A (đề xuất): sửa máy dò đang có · ~1–2 phiên.
  (1) tìm tay: không thấy thì thử lại có đệm viền; cảnh báo mu bàn tay / nhầm tay theo tay cần xem (nam tả nữ hữu); mốc tay
  lệch dáng thường (tỉ lệ khoảng cách các mốc ngoài khoảng đo được trên ảnh mẫu) thì nhắc chụp lại thẳng, không dò bừa;
  (2) bản đồ nếp tính trên log độ sáng (bóng đổ không làm mất nếp), giữ hướng nếp;
  (3) mỗi đường tìm trong dải quanh khuôn dựng từ 21 mốc tay — đời vòng gò ngón cái, cuối ở cổ tay phía ngón cái; trí chung
  đầu với đời; tình từ mép ngón út lên khe trỏ – giữa — chỉ cộng nếp chạy **cùng hướng** đường; tình phải nằm trên trí;
  (4) ô sát ranh để trống; vẽ vết mượt (bớt răng cưa).
  Rủi ro: ảnh chụp nghiêng, MediaPipe đặt mốc lệch thì khuôn lệch theo — đường lại sai; ô trống nhiều quá thì máy dò thành vô ích.
Phương án B: bán tự động — người xem chạm đầu, cuối đường bị sai trên ảnh, máy bám nếp giữa hai điểm · ~1 phiên.
  Rủi ro: thêm thao tác trên màn nhỏ, chạm lệch; người xem vẫn phải tự biết đường nào là đường nào; đường đời vẫn phải sửa.
  Vì sao chọn A: lỗi lặp lại do máy bỏ qua dáng đường đời — sửa được ở gốc; B đẩy việc sang người xem.

Giả sử A hỏng rồi — ba lý do:
- Đáp án Claude tự đánh dấu sai (đường mờ) → chỉ đánh điểm chắc, đánh trước khi sửa, không sửa đáp án theo kết quả máy.
- Chỉnh vừa với ít ảnh, tay khác vẫn sai → để riêng 3 ảnh không nhìn khi chỉnh, chỉ chạy lúc cuối, báo số riêng.
- Ô trống nhiều tới mức vô ích → đúng trước, đủ sau: không gán nhầm là bắt buộc; ô trống > 1/3 trên ảnh rõ thì báo anh số đo,
  không tự nới ngưỡng cho đẹp số.
- Bộ ảnh nhỏ (~10 ảnh, đáp án một người đánh) → số đo chỉ là mức sàn, không bảo đảm mọi tay; nói rõ khi báo; chốt cuối là anh
  thử trên iPhone. (Ba ý trên thêm sau vịt cao su 06/11.)
- (thêm) iPhone chậm hơn máy ảo → giữ khung 160 điểm / L; dò quá 1 giây trên máy ảo thì cắt bớt.

Lùi bằng: `git revert` commit gộp `main` của đợt này.
KHÔNG làm: mô hình học máy mới; đổi luật giải, lời giải, AI chỉ tay; lưu ảnh; đổi giao diện chọn ô (chỉ thêm ô trống, lời nhắc).
Cần anh trả lời: gửi 2–3 ảnh vào chat (ảnh thử 05/11 + 1–2 lần chụp lại cùng bàn tay); gật kế hoạch.
