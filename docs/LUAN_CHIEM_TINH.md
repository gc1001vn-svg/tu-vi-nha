# LUẬN CHIÊM TINH — tổng hợp nhiều trường phái, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-02-chiem-tinh.md`)

App chỉ hiện lời chốt; file này ghi vì sao chốt thế. Lời trong app Claude soạn mới (luật 6). Chiêm tinh không có cách đo đúng sai
bằng số; "đúng nhất" = các trường phái cùng nói + lập luận.

## 1. Nguồn

| Nguồn | Trường phái | Đã đọc (02/11) | Mức kiểm |
|---|---|---|---|
| Alan Leo, *The Art of Synthesis* (1912; bản 1926) | hiện đại sớm, Anh | chương XVI "Methods of Synthesis": 5 cách luận gộp | nguyên văn archive.org `artofsynthesis00leoa` |
| Ptolemy, *Tetrabiblos* (thế kỷ 2; dịch Ashmand 1822) | Hy Lạp cổ | bảng nhà, vượng (kiến thức chung, khớp Lilly) | archive.org có bản, chưa đọc lại từng trang |
| Lilly, *Christian Astrology* (1647) | cổ điển Anh | phẩm vị cốt yếu (miếu, vượng, hãm, suy) | archive.org có bản, chưa đọc lại từng trang |
| Trường phái Hy Lạp cổ phục hồi (Brennan) | Hy Lạp cổ | sect ngày/đêm: cát/hung tinh theo phe | bản ghi podcast, tóm tắt tìm kiếm (theastrologypodcast.com ep. 274) |
| Arroyo, Hand, Greene, Tierney, Sasportas | hiện đại tâm lý | nguyên tố, bán cầu, thế góc chiếu | kiến thức chung, chưa đọc sách (còn bản quyền) |

Không trộn: chiêm tinh Ấn Độ (hoàng đạo sao, lệch ~24°, luật khác) · Thất Chính Tứ Dư Trung Hoa.

## 2. Tầng 1 — tổng luận lá số (`src/loi/chiemTinhLuan.ts`, lời `chiemTinhLuanLoi.ts`)

Khung theo Alan Leo: "không có một phương pháp chắc chắn… cung Mọc là điểm khởi đầu của mọi tổng hợp", rồi 5 cách: (I) đếm nguyên
tố, thể; (II) so Mặt Trời – Mặt Trăng – cung Mọc theo thể (cùng một thể: ý chí dồn một hướng; ba thể khác nhau: đa năng); (III)
khí chất dương / âm (cung lẻ Lửa Khí là dương); (IV) sao chủ — sao chủ cung Mọc mạnh khi ở nhà / vượng / sát trục; (V) nhiều hành
tinh ở các cung cùng một sao cai quản thì lá số đậm màu sao đó. Thêm:
- **Trọng số đếm** (Claude chọn từ cách phổ biến, sách vênh nhau): Mặt Trời, Mặt Trăng, cung Mọc 3 · Thủy, Kim, Hỏa 2 · Mộc, Thổ 1 ·
  ba sao xa 0,5 (sao thế hệ, cả lứa tuổi giống nhau). Trội khi ≥ 35 % (thể ≥ 40 %); thiếu khi < 1 điểm. Dương ≥ 60 %, âm ≤ 40 %.
- **Phẩm vị** theo Ptolemy / Lilly cho 7 sao cổ (sao xa chưa đồng thuận nên bỏ). **Sao chủ** theo cách cổ; Thiên Yết, Bảo Bình,
  Song Ngư nêu thêm sao cai quản hiện đại (Diêm Vương, Thiên Vương, Hải Vương) — chỗ vênh cổ / hiện đại.
- **Sát trục**: thiên thể cách cung Mọc, Thiên Đỉnh, điểm Lặn, đáy trời ≤ 8° (cùng sai số góc chiếu của app).
- **Ngày / đêm (sect)**: Mặt Trời ở nhà 7–12 là lá ngày (cát tinh chính Sao Mộc, Sao Hỏa khó hơn), nhà 1–6 là lá đêm (Sao Kim, Sao
  Thổ khó hơn). Có người hiện đại nghi tác dụng → nói nhẹ.
- **Bán cầu**: ≥ 65 % trọng số ở nửa trên / dưới / đông / tây mới nói.
- **Góc chiếu chính**: 32 cặp có lời riêng (câu thuận, câu căng) giữa Mặt Trời, Mặt Trăng, Thủy, Kim, Hỏa với nhau và với Mộc, Thổ,
  ba sao xa; lục hợp, tam hợp là thuận, vuông, đối là căng; góc hợp là căng nếu có Thổ hay ba sao xa, còn lại thuận. Lấy 6 góc: có
  Mặt Trời / Mặt Trăng trước, rồi lệch nhỏ. Thế góc chiếu: thập giá lớn, chữ T, tam hợp lớn (mỗi loại một).
- Không giờ sinh: bỏ sao chủ, sát trục, ngày/đêm, bán cầu (cần cung Mọc, nhà).
- Đổi so với lời cũ: lời cũ nói từng điểm riêng lẻ, góc chiếu ghép chữ chung ("A gặp B — va chạm") → giữ lời từng điểm bên dưới
  (đổi tên "Lời giải từng điểm"), thêm tổng luận lên trên.
- Test `tests/ChiemTinhLuan.test.ts`: phẩm vị đúng bảng; 10 sao ở Bạch Dương ra Lửa trội, thiếu ba nguyên tố, khí chất dương; nhận
  thế chữ T trên lá dựng tay; 2.000 lá số giả (có / không giờ) không câu trống.

Còn: tầng 2 (luận từng lĩnh vực theo nhà), tầng 3 (vận: hành tinh chậm đi qua, chu kỳ Sao Thổ…).
