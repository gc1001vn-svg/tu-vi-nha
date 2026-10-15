# CLAUDE.md — TỬ VI NHÀ

App tử vi gia đình (âm lịch, tử vi, bát tự, xem ngày, phong thủy…), PWA cài lên iPhone, repo Public.
Chủ dự án không biết lập trình: hướng dẫn từng bước bấm gì, in link đầy đủ.

Đầu phiên: `cat docs/TIEN_DO.md`, lệnh riêng repo ở `docs/DAU_PHIEN.md`. Lệnh đo: `npm run do`.

## Luật cứng

1. Dữ liệu người nhà (tên, ngày sinh, ảnh) **không bao giờ vào repo**. Ca kiểm dùng ngày sinh giả.
2. `src/loi/` là lõi thuần: cấm trình duyệt, đồng hồ, ngẫu nhiên, locale (ESLint chặn). Giờ "bây giờ" nhận qua tham số.
3. Chuẩn cuối của tử vi là lá số altuvi.com anh gửi, không phải thư viện. Âm lịch theo thuật toán Hồ Ngọc Đức múi +7.
4. Mọi chữ Hán từ thư viện đi qua bảng `src/loi/hanViet/` — không tự dịch chỗ khác.
5. Chỗ các trường phái vênh = một tuỳ chọn có mặc định, ghi ở `docs/QUY_UOC.md`.
6. Lời giải: Claude soạn mới, ghi rõ là soạn lại; không chép sách còn bản quyền. AI (đợt 7) chỉ đọc số máy đã tính.
7. Mỗi đợt gộp `main` một lần khi `npm run do` xanh; hỏng thì `git revert`.
