# Chỉ tay: ảnh bị máy chặn vẫn phải xem được (08/11/2026)

- Anh báo 08/11: "Phần chỉ tay vẫn không thể xem được hình chụp". Hỏi: chuyện gì xảy ra → Đáp: chỉ hiện chữ báo lỗi.
  Hỏi: lấy ảnh cách nào → Đáp: chụp ảnh mới bằng camera. Hỏi: câu báo lỗi → Đáp: "Bàn tay chụp nghiêng…".
- Hỏi: gật cách sửa nào → Đáp (anh, 08/11): "A ngay, B sau".
- Claude tái hiện 08/11 (app thật, trình duyệt giả iPhone 13; 7 ảnh lòng tay mẫu làm nghiêng như cầm máy chụp chéo tay mình,
  4 hướng): nghiêng 15° qua 28/28; 30° qua 26/28, 2 ảnh bị chặn nhầm "mu bàn tay"; 45° chỉ qua 16/28 — 9 ảnh "chụp nghiêng",
  2 "không thấy tay", 1 "mu bàn tay". Bị chặn thì chỉ có chữ, **không hiện ảnh** — đúng lỗi anh thấy. Bước chặn "chụp nghiêng"
  thêm 06/11, khoảng mốc lấy từ 11 ảnh mạng chụp thẳng, chưa thử ảnh tự chụp tay mình.
- Đo thêm (tắt bước chặn, 2 ảnh có đáp án): nghiêng 15–30° có 6/15 lần vẽ sai ít nhất một đường; 45° 6/6 lần → bước chặn
  chỉ bắt ca nặng, ca vừa vẫn lọt mà sai. Ảnh chụp chéo là gốc rễ; chặn không giải quyết được.

Việc: ảnh nào máy không dò được vẫn hiện ra để anh soi và tự chọn ô; lời nhắc chụp lại cụ thể, làm theo được.
Xong là khi: vòng thử (trình duyệt giả iPhone) với ảnh nghiêng 45°, ảnh mu tay, ảnh không thấy tay: ảnh vẫn hiện kèm lời nhắc;
  ảnh dò được thì như cũ (đo lại bộ ảnh: mọi số không đổi); `npm run do` xanh; anh chụp trên iPhone thấy ảnh.

Cách đo: kịch bản vòng thử `scripts/doi-chieu/thu-khoi-chi-tay.mjs` (mới): mở app, Tra cứu (ngày sinh giả), mở khối Chỉ tay,
  đưa ảnh vào ô chọn ảnh, in có ảnh hay không + chữ báo. Nay: ảnh nghiêng 45° → "KHÔNG CÓ ẢNH" (đỏ). Bộ đo cũ chạy lại để so.

Phương án A (đề xuất, làm ngay): máy từ chối sau khi đã đọc được ảnh (chụp nghiêng, mu tay, không thấy tay, tay nhỏ, hai tay)
  → vẫn hiện ảnh (không vẽ đường) + lời nhắc; ô để trống cho anh tự chọn. Lời nhắc "chụp nghiêng" đổi thành cách chụp làm được:
  đặt bàn tay ngửa trên mặt bàn, xoè ngón, cầm máy ngay phía trên, song song mặt bàn; lời báo "mu bàn tay" thêm: nếu đúng là
  lòng bàn tay thì có thể do chụp chéo — chụp lại như trên. ~nửa phiên.
  Rủi ro: anh vẫn phải chụp lại mới có đường máy vẽ; tưởng máy đã dò → lời nhắc nói rõ "máy chưa dò được ảnh này".
Phương án B (việc kế, cần kế hoạch riêng): nắn phối cảnh theo mốc tay trước khi dò — ảnh chụp chéo vừa phải vẫn dò đúng, bớt
  chặn. ~1–2 phiên. Rủi ro: mốc MediaPipe trên ảnh chéo lệch thì nắn sai; đo bằng bộ ảnh nghiêng đã dựng 08/11.
  Vì sao A trước: hết ngõ cụt ngay, sửa nhỏ, đo được ngay; B sửa gốc nhưng lâu và rủi ro hơn.

Giả sử A hỏng rồi — ba lý do:
- Ảnh hiện nhưng anh tưởng đường đã dò → không vẽ đường nào, lời nhắc ghi rõ máy chưa dò được, phải tự chọn ô.
- Ảnh lớn làm iPhone chậm / hết bộ nhớ → hiện ảnh đã thu nhỏ (cạnh dài ≤ 1024) có sẵn trong bước dò, không giữ ảnh gốc.
- Sửa nhầm làm ảnh dò được đổi kết quả → chỉ đụng nhánh báo lỗi; đo lại bộ ảnh, số phải y như trước.

Vịt cao su 08/11: Gemini không trả lời (2 lần quá 4 phút) — Claude tự phản biện, thêm ý "mu bàn tay" ở phương án A.
Lùi bằng: `git revert` commit gộp `main` của việc này.
KHÔNG làm: nắn phối cảnh (phương án B); đổi máy dò, ngưỡng chặn; lưu ảnh.
Cần anh trả lời: gật A làm ngay, B để kế hoạch sau?
