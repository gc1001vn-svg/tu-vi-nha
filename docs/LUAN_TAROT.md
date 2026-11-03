# LUẬN TRẢI TAROT — tổng hợp nhiều sách, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-03-tarot.md`)

App giữ ảnh và nghĩa từng lá (mục 24), thêm **"Luận trải bài"** — lời chốt gộp cả trải. File này ghi nguồn, chỗ vênh, vì sao chốt thế,
số đo. Lời Claude soạn mới (luật 6).

## 1. Nguồn (đọc tới đâu, mức kiểm)

| Nguồn | Dòng | Đã đọc (03/11) | Mức kiểm |
|---|---|---|---|
| A. E. Waite, *The Pictorial Key to the Tarot* (1910; bản sacred-texts lưu trên archive.org) | Anh, dòng Waite – Smith (bộ bài app dùng) | nghĩa bói 22 ẩn chính, nhiều ẩn phụ; Thập tự Celtic (22/10) | nguyên văn |
| *Book T* (Golden Dawn, Mathers soạn, cuối thế kỷ 19; archive.org `the-book-t-the-tarot`) | Anh, Golden Dawn — gốc của Waite và Crowley | tên 36 lá số ("Lord of Victory", "Lord of Ruin"…); bảng "A majority of…" (đa số Gậy, Cốc, Kiếm, Tiền, ẩn chính, lá triều, Át…); nghĩa lá "tùy theo dignity" (lá bên cạnh) | nguyên văn (chữ máy nhận dạng) |
| Papus, *The Tarot of the Bohemians* (bản Anh 1896) | Pháp, huyền học | tải được, chưa đọc kỹ | — |
| Cách đọc hiện đại (Greer, Pollack… — còn bản quyền) | Mỹ, Anh từ 1970 | lá ngược = năng lượng bị chặn / hướng vào trong / mặt trái — kiến thức chung | **chưa kiểm nguồn**, không trích |
| Tarot Marseille (Ý – Pháp) | lá số không có tranh, nhiều người không dùng lá ngược | kiến thức chung | chưa kiểm |

Nhật, Hàn, Việt: tarot là bài phương Tây du nhập; trang Việt (mục 24 [W53]) chỉ có nghĩa từng lá, không có cách gộp — không có nguồn
riêng để so.

## 2. Các sách cùng nói (đồng thuận)

- Nghĩa ẩn chính và phần lớn lá số: Waite và *Book T* trùng hướng (Victory, Ruin, Sorrow, Despair… ↔ Waite "despair", "ruin", "tears").
- Đọc cả trải chứ không đọc rời từng lá: *Book T* "the whole according to dignity"; Waite: lá cuối Thập tự gom ý các lá trước.
- Đa số bộ cho biết việc nghiêng về đâu (*Book T*): Gậy — sức làm, đối đầu · Cốc — vui, tình · Kiếm — lo, buồn, bệnh · Tiền — tiền, việc ·
  ẩn chính — sức lớn ngoài tầm tay · lá triều — nhiều người · Át — sức mạnh.

## 3. Chỗ vênh — cách chốt

| Chỗ vênh | Các ý | App chốt | Vì sao |
|---|---|---|---|
| Lá ngược | Waite: phần lớn "the same in a lesser degree" (Tower, Moon, Sun ngược = như xuôi nhưng nhẹ hơn), vài lá đổi nghĩa · *Book T*: không dùng lá ngược, dùng lá bên cạnh · hiện đại: bị chặn / đảo nghĩa (lá xấu ngược = thoát ra) | **điểm lá ngược = nửa điểm xuôi** (tốt nhẹ đi, xấu nhẹ đi); vẫn có ô tắt lá ngược | điểm chung của Waite và hiện đại: lá ngược yếu hơn lá xuôi |
| Nghĩa lá ngược hiện trong app (mục 24) | nhiều lá xấu ngược ghi "hồi phục, thoát ra" (hiện đại) — Waite ghi vẫn xấu (The Devil ngược "evil fatality, weakness"; 3 Kiếm ngược "alienation, error, loss") | **chưa sửa** 78 dòng nghĩa từng lá; lời luận dùng cách chốt "nhẹ đi" | ghi nợ ở §5 — sửa 78 dòng cần người rành đọc lại |
| The Star | Waite: "loss, theft… another reading says hope" · *Book T*, hiện đại: hy vọng | +1 | đa số |
| The Fool | Waite: "folly, mania" · hiện đại: khởi đầu tự do | 0 | hai bên ngược |
| Death | Waite: kết thúc, mất · hiện đại: chuyển giai đoạn | −0,5 | cùng nói "hết một giai đoạn"; nặng nhẹ khác |
| Nguyên tố bộ | *Book T*, Waite: Gậy – lửa, Kiếm – khí · vài sách Pháp đổi lại | theo *Book T* | gốc của bộ bài app dùng |

## 4. Cách luận trong app (`src/loi/tarotLuan.ts`, lời `tarotLuanLoi.ts`)

- **Độ tốt / xấu từng lá** (`DO`, −1,5…1,5): ẩn chính theo nghĩa Waite (đã gỡ vênh ở §3); lá số theo tên *Book T* đối chiếu Waite; 16 lá triều
  0 (là người, không phải điềm). Lá ngược × 0,5.
- **Điểm trải** = trung bình có trọng số (lá kết quả Thập tự, lá tương lai 3 lá × 1,5). Kết: 1 lá ≥ 0,5 / ≤ −0,25 · 3 lá ≥ 0,4 / ≤ −0,1 ·
  Thập tự ≥ 0,25 / ≤ 0.
- Đoạn: **Tổng luận** (kết; lá nặng ký nhất) · **Mạch bài** (3 lá, Thập tự: đi lên / xuống / ngang theo lá đầu – lá cuối; lá kết quả; Thập
  tự thêm trở ngại so hiện trạng, hy vọng – lo sợ) · **Bài nghiêng về** (đa số theo *Book T*: 3 lá từ 2, 10 lá từ 4; lửa – nước, khí – đất
  cùng mạnh thì "đối nhau"; tỉ lệ lá ngược) · **Lời khuyên** · **Nhìn cho đúng**. AI nhận thêm dòng "Lời chốt của app".

## 5. Số đo (03/11; `tests/LuanTarot.test.ts`)

- 3.000 trải mỗi kiểu, lá ngược bật: điểm 1 lá p25 0 · p75 0,5 → thuận 37 %, báo vướng 24 % · 3 lá p25 −0,07 · p75 0,36 → 23 % / 24 % ·
  Thập tự p25 0,02 · p75 0,26 → khoảng một phần tư mỗi đầu.
- Đủ đoạn, chữ đúng quy ước; hai trải khác nhau trùng 30 % câu (3 lá), 38 % (Thập tự) — không tính câu kết, lời khuyên, "Nhìn cho đúng".
- Nợ: 78 dòng nghĩa lá ngược theo cách đọc hiện đại, vênh Waite ở nhiều lá xấu; Papus, Marseille chưa đọc; bảng `DO` là Claude đặt (sách
  không cho số).
