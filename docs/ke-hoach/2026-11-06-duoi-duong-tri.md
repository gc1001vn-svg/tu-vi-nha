# Máy dò chỉ tay: đuôi đường trí dừng đúng chỗ (06/11/2026)

- Hỏi: việc kế sau máy dò chỉ tay (QUY_UOC mục 45) → Đáp (anh, 06/11): "Thử rồi, ổn, làm tiếp đuôi đường trí".
- Ô đuôi không chắc: theo chốt kế hoạch trước — để trống, không đoán.
- Hỏi: gật kế hoạch? → Đáp (anh, 08/11): "Xứ lý với phương án tối ưu nhất" → làm phương án A (đề xuất).
- Claude soi 06/11 trên 7 ảnh mạng (bản đang chạy): ảnh "Right Hand Palm" (có đáp án) đường trí đổ dốc xuống
  tới (−0,18; 0,47 L), nhưng vết bỏ đường trí ở chỗ thấp nhất (−0,15; 0,64), **vòng ngược lên 0,10 L** rồi chạy theo đầu
  đường tình phía ngón út tới mép tay — đường tình bị đẩy lên trên, mất đầu thật. Vì quy hoạch bắt vết đường trí đi đủ
  mọi cột tới mép ngón út: hết nếp thì vẫn phải bám nếp khác. Ô "dài" đường trí ra "dài" 7/7 ảnh. Ảnh khác: 3 ảnh vết
  tới mép tay trên nếp đậm liền (có vẻ dài thật); 2 ảnh có chỗ lồi / lõm ~0,07 L giữa đường rồi đi xuống tiếp (không
  phải đuôi vòng); "Hand female 2/3" vết nối hai nếp (đã để trống ô chỉ tay ngang).

Việc: vết đường trí dừng ở chỗ nếp trí hết, không vòng sang nếp khác; phần thừa trả lại cho đường tình.
Xong là khi: trên bộ ảnh đo không còn đuôi đường trí nào nhảy sang nếp khác (nay 1 ảnh); ảnh có đáp án đuôi thì đuôi
  đúng hoặc ô "dài" để trống; không lùi: 5/5 đường đáp án vẫn đúng, chụp lại giữ ≥ 85 % ô, ô trống ≤ 40 % (nay 37 %),
  chặn mu tay 5/5; anh xem trên iPhone: đường xanh dương dừng đúng chỗ nếp hết.

Cách đo (dựng trước khi sửa):
- Đáp án đuôi: Claude đánh **điểm cuối chắc** của đường trí (và đầu đường tình phía ngón út nếu rõ) trên ảnh nào thấy
  rõ, trước khi sửa, sai số 0,08 L; ảnh không chắc thì không đánh. Tìm thêm tối đa 4 ảnh lòng tay mạng có đường trí rõ.
- Kịch bản `do-chi-tay-dap-an.mjs` thêm phán đuôi: đúng (cuối vết cách điểm cuối ≤ 0,08 L) / vượt / hụt / nhảy
  (khúc cuối vết rời đường trí > 0,06 L). Đo bản đang chạy làm nền, rồi đo bản sửa.
- Thước tổng hợp thêm ca: đường trí đổ dốc rồi hết, có nếp khác ngay trên → vết phải dừng; máy hiện tại phải trượt.

Phương án A (đề xuất): cắt đuôi vòng có kiểm chéo · ~1 phiên. Vết đường trí đã xuống thấp nhất rồi vòng ngược lên
  ≥ 0,05 L, không xuống lại tới cuối → dò đường tình lại khi bỏ đuôi đó; đường tình chạy dọc đuôi (chung ≥ 0,1 L, cách
  ≤ 0,03 L) → đuôi là của đường tình: đường trí dừng ở chỗ thấp nhất. Không chung → giữ đuôi (có thể là đường trí cong
  lên phía ngón út thật — ít gặp), ô "dài" đường trí để trống. Ảnh không có đuôi vòng: không dò lại gì, ô giữ y nguyên.
  Rủi ro: đường tình đổi đầu phía ngón út → ô đường tình đổi theo; ngưỡng sát ranh thì chụp lại có lần cắt có lần không.
Phương án B: cho vết đường trí được dừng ở bất kỳ cột nào (mỗi bước trừ một mức nền, dừng khi tổng không tăng thêm)
  · ~1–2 phiên. Rủi ro: đụng mọi vết đường trí, cả ảnh đang đúng; đường trí mờ bị cụt; bộ ảnh nhỏ không đo hết được.
  Vì sao chọn A: lỗi đo được là đúng một kiểu (vòng ngược sang đường tình), sửa đúng chỗ đó; B thay cả cách tìm.
  (Ba chỗ sửa trên thêm sau vịt cao su 06/11: đường trí cong lên thật, lỗi dây chuyền, khớp vừa ít ảnh.)

Giả sử A hỏng rồi — ba lý do:
- Đáp án đuôi sai vì nếp mờ dần → chỉ đánh điểm chắc, đánh trước khi sửa, không sửa đáp án theo kết quả máy.
- Ngưỡng khớp vừa 7 ảnh, tay khác lại sai → ảnh mới tìm được để riêng 2 ảnh, chỉ chạy lúc cuối, báo số riêng;
  phán đuôi phải giữ qua 5 bản nhiễu; độ vòng sát ranh thì không cắt mà để trống ô "dài".
- Dò lại đường tình gây lỗi dây chuyền → chỉ dò lại ở ảnh có đuôi vòng; đo: ảnh khác ô không đổi ô nào; đường tình
  giữ ≥ 4/5 điểm đáp án như nay, tụt thì không gộp.

Lùi bằng: `git revert` commit gộp `main` của việc này.
KHÔNG làm: đầu đường trí "dính / tách" (6/7 ảnh ra "tách" — việc sau, cần đáp án riêng); vết đi qua vân da mà không
  vòng (phương án B — đo thấy còn thì báo anh); đổi giao diện, lời giải, luật giải.
Cần anh trả lời: gật kế hoạch.
