# LUẬN QUẺ BÓI KIỀU — tổng hợp cách bói xưa và tục bói sách các nước, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-03-boi-kieu.md`)

App giữ câu thơ, hai câu trước – sau, tên và tóm tắt đoạn truyện (mục 17), thêm **"Luận quẻ"**. File này ghi nguồn, chỗ vênh, vì sao
chốt thế, số đo. Lời Claude soạn mới (luật 6) — **không chép sách bói Kiều nào** (sách còn bản quyền); không soạn lời từng câu.

## 1. Nguồn (đọc tới đâu, mức kiểm)

| Nguồn | Nền | Đã đọc (03/11) | Mức kiểm |
|---|---|---|---|
| Phan Kế Bính, *Việt Nam phong tục* (1915; archive.org `VietNamPhongTucPKB1915`) | Việt | "Bói Kiều là mình có việc gì muốn được biết hay dở đường nào thì khấn với Thúy Kiều, Kim Trọng… mở cuốn sách Kiều, bất kỳ chỗ nào… mà đoán. Cách này là một cách bói chơi, nhưng cũng nhiều khi có người cho là nghiệm." | nguyên văn (bản chữ máy nhận dạng) |
| Phạm Đan Quế, *Bói Kiều – Bình Kiều – Vịnh Kiều* (1991; archive.org) | Việt | cách bói dân dã (khấn Từ Hải, Giác Duyên, Thúy Kiều; nam trang trái, nữ trang phải; tự suy ngẫm, so với cảnh mình); **18 đề mục** thầy bói Kiều xưa dùng (đặt theo 8 quẻ, 10 can: vận năm, công danh, tài lợi, tin tức, tranh tụng, bình an, hôn nhân, buôn bán, đổi chỗ, bệnh, thi, con cái, xuất hành, tìm đồ, lo âu, đi thăm, nghề nghiệp, tâm sự); "bói Kiều trước hết là cách trấn an tinh thần" | đọc bản chữ máy nhận dạng; **chỉ lấy tên mục**, không chép câu đáp (còn bản quyền) |
| *Fāl-e Hāfez* (Ba Tư) | Iran | lập ý (niyyat), khấn gọi Hafez, mở *Divan* ngẫu nhiên, đọc bài gặp đầu tiên, hiểu theo nghĩa bóng; Hoàng gia Anh (Royal Collection) ghi tục này còn đến nay | trích đoạn |
| *Omikuji* (đền chùa Nhật) | Nhật | bài thơ (waka / thơ Hán) là phần chính, kèm lời ngắn từng mục: cầu việc, chờ người, mất đồ, đi xa, buôn bán, học, tranh chấp, tình, dọn nhà, bệnh, hôn sự | trích đoạn |
| *Sortes Virgilianae* (La Mã) | Tây | tìm không ra nguồn trong phiên | — |

## 2. Các nền cùng nói (đồng thuận)

- Lòng thành, nghĩ rõ một việc rồi mới mở sách (Việt khấn, Ba Tư lập ý, Nhật cầu ở đền).
- Đọc câu gặp được theo nghĩa đen trước, rồi tự đối chiếu với cảnh mình (Phan Kế Bính "mà đoán", Phạm Đan Quế "tự suy ngẫm", Hafez đọc nghĩa
  bóng).
- Lời đáp chia theo việc hỏi: 18 đề mục bói Kiều ↔ các mục của omikuji gần như trùng.
- Là chỗ dựa tinh thần, "bói chơi" — không phải lời phán.

## 3. Chỗ vênh — cách chốt

| Chỗ vênh | Các ý | App chốt | Vì sao |
|---|---|---|---|
| Tốt xấu theo câu hay theo cảnh truyện | đọc câu (mọi nguồn) · câu vui có khi nằm giữa đoạn bi kịch | câu rút ×1, hai câu trước – sau ×0,5, cảnh truyện (21 đoạn) ×0,5 | câu là lời đáp; cảnh là bối cảnh, nhẹ hơn |
| Lời từng câu | sách bói Kiều có câu đáp soạn sẵn cho từng mục | không soạn lời từng câu (1.627 cặp); lời theo mức kết × 18 mục, kiểu omikuji | sách còn bản quyền; omikuji cũng chỉ một lời ngắn mỗi mục |
| Khấn ai, đọc mấy câu, trang trái / phải | (mục 17) | giữ như mục 17 | — |
| Gieo đồng xu để chọn câu (cách phức tạp) | có thầy dùng · Phạm Đan Quế: chỉ thêm vẻ huyền bí | không dùng | — |

## 4. Cách luận trong app (`src/loi/kieuLuan.ts`, lời `kieuLuanLoi.ts`)

- **Điểm** = (chữ vui − chữ buồn) trong cặp rút + 0,5 × (như thế) trong hai câu trước – sau + 0,5 × điểm đoạn truyện (+1 đoạn vui: hẹn ước,
  được chuộc, gặp Từ Hải, báo ân, đoàn tụ · −1 đoạn khổ · 0 đoạn lẫn). Bộ chữ: 27 chữ vui, 65 chữ buồn của chính Truyện Kiều; bỏ chữ đa
  nghĩa ("tai" = tai nghe, "sang", "tan", "phụ" đứng riêng). Kết: thuận ≥ 0,5 · khó ≤ −1.
- Đoạn: **Tổng luận** (kết; câu có chữ vui / buồn / không rõ; điềm của cảnh truyện — 21 câu Claude soạn) · **Người trong câu** (Kim Trọng,
  Thúy Vân, Từ Hải, Thúc Sinh, Hoạn Thư, kẻ lừa lọc, Giác Duyên, Đạm Tiên, Hồ Tôn Hiến, nhà họ Vương) · **Theo việc hỏi** (ô chọn 18 đề mục,
  mặc định "Vận cả năm") · **Nhìn cho đúng**.

## 5. Số đo (03/11; `tests/LuanBoiKieu.test.ts`)

- Cả 1.627 cặp (không cần mô phỏng): 70 % cặp không có chữ vui buồn nào; điểm p25 −1 · p50 −0,5 · p75 0,5 → thuận 32 %, khó 27 % (truyện
  buồn nhiều hơn vui). 309 cặp có tên người trong 6 câu; soát tay: tên bắt đúng (Kim, Vân, Mã, Vương, Thúc… đều là tên).
- 1.627 × 18 lời: đủ đoạn, chữ đúng quy ước.
- Chưa chắc: bộ chữ vui buồn là Claude chọn (sách không cho); lời mỗi mục chung theo mức kết, không riêng từng câu.
