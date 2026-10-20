# Lưu niên, lưu nguyệt, lưu nhật + lời giải dài hơn (20/10/2026)

- Hỏi: làm gì → Đáp: thẻ "Của tôi" tự tính tử vi theo năm, tháng, ngày; lời giải dài hơn cho lá số, sao hạn, bát tự (anh, 20/10)
- Hỏi: hạn tháng theo phái nào → Đáp: các phái vênh nên làm tuỳ chọn có mặc định (luật 5), chưa cần hỏi anh

Việc: thêm phần "Tử vi năm nay · tháng này · hôm nay" vào khối tử vi, viết lại lời giải ba môn cho dài và cụ thể hơn.
Xong là khi: mở "Của tôi" thấy (1) lá số đánh dấu cung hạn năm, tháng, ngày và 9 sao lưu của năm; (2) mỗi hạn một đoạn giải:
  rơi vào cung gì, có sao gì, nên lưu ý gì; (3) bấm cung nào cũng có lời cho cung đó, từng chính tinh (sáng/hãm) và phụ tinh hay gặp;
  (4) sao hạn, 8 hạn mỗi mục 3–4 câu; (5) bát tự có đoạn nhật chủ, ngũ hành thiếu/nhiều, đại vận đang chạy và năm nay.
  Sang ngày, tháng, năm mới thì tự đổi theo, không phải bấm gì. Thẻ "Tra cứu" dùng chung khối nên cũng có.

Quy tắc (tra 20/10: đọc mã `tuvi-mcp-server` 0.5.0 bản Việt, `iztro` 2.6.2, trích đoạn trang Việt) → ghi vào `QUY_UOC`:
- Lưu niên: Lưu Thái Tuế ở cung mang chi năm xem; tiểu hạn như đang có. 9 sao lưu an như sao gốc nhưng theo can chi năm xem:
  Thái Tuế, Tang Môn (thuận 2 cung), Bạch Hổ (đối Tang Môn), Lộc Tồn, Kình Dương, Đà La, Thiên Mã, Thiên Khốc, Thiên Hư
  (`tuvi-mcp-server` có 7 sao; Tang Môn, Bạch Hổ: tuvisonlong, phongthuythanhhoa, lyso.vn).
- Lưu nguyệt: lấy cung tiểu hạn làm tháng Giêng, đếm nghịch tới tháng sinh, từ đó đếm thuận tới giờ sinh → tháng Giêng của năm xem,
  mỗi tháng thuận một cung (Thái Thứ Lang; `tuvi-mcp-server`; horos, viettopreview, lyso.vn). Phái kia khởi từ Lưu Thái Tuế
  (Đẩu Quân, Tử Vân; `iztro`): chưa có màn chỉnh tuỳ chọn nên **hiện thêm một dòng cung tháng theo phái kia** khi hai phái khác cung.
  Tháng nhuận tính như tháng trước, giống lá số (`QUY_UOC` mục 5).
- Lưu nhật: cung tháng làm mùng 1, đếm thuận tới ngày âm đang xem (cả hai thư viện; hocvienlyso, kabala).

Cách đo: `npm run do` + test mới: bảng vàng ~200 ca sinh từ `tuvi-mcp-server` (phái tiểu hạn: cung tháng, ngày, 7 sao lưu) và `iztro`
  (phái Lưu Thái Tuế; Tang Môn, Bạch Hổ lưu = 丧门, 白虎 vòng 岁前 của `iztro`), chạy ở thư mục tạm như `scripts/doi-chieu/chay.sh`;
  test lời giải phủ đủ (12 cung, 14 chính tinh, 9 sao hạn, 8 hạn, 10 can, 10 thập thần đều có lời; chữ kiểu cũ Hỏa, Thủy);
  ảnh khổ iPhone 390×844 thẻ "Của tôi".
Lời giải: nghĩa chung của từng sao, cung, can soạn theo cách hiểu phổ biến; chi tiết cụ thể (tháng kỵ, ngày cúng) mới cần ≥2 nguồn.

Phương án A (đề xuất): cả hai phần trong phiên này · ~5–6 giờ máy (ước, chưa đo) · rủi ro: chữ dài làm thẻ rối trên iPhone;
  hạn tháng khác trang anh xem.
Phương án B: lưu niên/nguyệt/nhật + lời giải lá số trước, sao hạn và bát tự phiên sau · ~2 giờ · rủi ro: anh chờ thêm phần còn lại.
  Vì sao chọn A: anh hỏi cả ba; lời giải là dữ liệu chữ, không đụng phần tính đã khớp Altuvi 345/345.

Giả sử A hỏng rồi — ba lý do:
1. Hạn tháng theo phái khác Altuvi → tuỳ chọn có mặc định, đo cả hai phái bằng hai thư viện; ghi "chưa so Altuvi" tới khi có ảnh.
2. Thẻ dài, rối → phần mới gập/mở, chỉ mở sẵn đoạn "hôm nay"; lời từng sao chỉ hiện khi bấm cung.
3. Lời giải bịa chi tiết (tháng kỵ, ngày cúng) → chỉ ghi khi ≥2 nguồn khớp, vênh thì bỏ; ghi rõ "Lời Claude soạn lại", không chép sách.

Lùi bằng: gộp `main` một commit (`git merge --squash`), hỏng thì `git revert` commit đó.
KHÔNG làm: lưu thời (giờ) · tứ hóa lưu niên · lưu đại hạn · chấm điểm tốt/xấu cả năm · chọn ngày xem khác hôm nay · màn chỉnh tuỳ chọn ·
  AI (đợt 7) · người nhà (đợt 9).
Cần anh: duyệt phương án. Nếu trang Altuvi anh xem có mục hạn tháng, chụp một ảnh (ngày sinh giả cũng được) để chốt phái.
