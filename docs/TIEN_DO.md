# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 19/10/2026 — **đợt 1 xong phần máy, gộp `main` 19/10** (kế hoạch `docs/ke-hoach/2026-10-19-dot-1.md`).
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/

## 1. Đang ở đâu

- Đợt 0: khung, đồ nghề, bảng Hán–Việt, `QUY_UOC`. Đợt 1: ba thẻ "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) ·
  "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu).
- Lõi `src/loi/`: `amLich` (`@tuquet/lunar`, chặn "ngày 0") · `muiGio` (VN viết cứng) · `tinh` (63 tỉnh cũ) · `hoSo`
  (ngày âm phái A, can chi, nạp âm, cung phi Lập Xuân, tuổi mụ, phương án sát ranh) · `homNay` (tiết/trực theo +7).
- Giao diện `src/giaoDien/` (`cuaToi.ts` có cả Tra cứu), lưu `src/luuTru.ts` (localStorage, xuất/nhập file, nhắc 30 ngày, nhắc cài app).
- Bảng vàng 1900 đã sửa: nhuận tháng 8 (bản cũ của `ansaotuvi` ghi 7, sai).

## 2. Việc kế

- **Anh thử iPhone thật (lần 1 của kế hoạch tổng)** — cài app màn hình chính, thử thẻ "Tra cứu", nhập hồ sơ ở "Của tôi",
  xuất file (Chia sẻ → Lưu vào Tệp), xoá, nhập lại. Chưa có xác nhận thì chưa mở đợt 2.
- **Anh chốt 19/10:** tra được cho mọi người; chỉ lưu hồ sơ của anh, app tự tính cho anh theo giờ/ngày/tháng/năm. Mỗi
  đợt sau thêm phần của môn đó vào "Hôm nay"/"Của tôi" và "Tra cứu". Lưu thêm người nhà: đợt 9 (sau cùng).
- Đợt 2: tử vi (chép `ansaotuvi` sang TS, chỗ lệch theo Altuvi — `NGUON_MO`).

## 3. Cần anh

- Thử iPhone như mục 2 (chỉ hồ sơ của anh), chụp màn hình chỗ lỗi.
- Ảnh lịch còn thiếu cho 21/01/1985, 10/02/2026, 10/03/2026: dòng "Trực" và "Ngày … Hoàng Đạo/Hắc Đạo" (trang chi tiết
  ngày) + tên trang. Chưa có thì app giữ trực/hoàng đạo theo tiết, ghi "chưa chắc".

## 4. Nợ, chỗ chưa chắc

- Thần tài, hỷ thần theo `lunar-typescript`, chưa đối chiếu lịch Việt. Theo tuổi chưa xét hình, hại, phá, can khắc.
- Tuỳ chọn `menhMauSo`, `thangXemNgay`… có trong lõi/`QUY_UOC`, chưa có màn chỉnh.
- Không rõ giờ + sinh đêm 30 Tết sau 23:00: app lấy năm cũ (`QUY_UOC` mục 9).
- `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ). Bảng Hán–Việt cần người rành lịch đọc lại vài mục (Bành Tổ, lộc, 28 tú).
