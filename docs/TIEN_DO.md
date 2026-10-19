# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 19/10/2026 — **đợt 1 xong phần máy, gộp `main` 19/10** (kế hoạch `docs/ke-hoach/2026-10-19-dot-1.md`).
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/

## 1. Đang ở đâu

- Đợt 0: khung, đồ nghề, bảng Hán–Việt, `QUY_UOC`. Đợt 1: hai thẻ "Hôm nay" · "Cả nhà".
- Lõi `src/loi/`: `amLich` (`@tuquet/lunar`, chặn "ngày 0") · `muiGio` (VN viết cứng) · `tinh` (63 tỉnh cũ) · `hoSo`
  (ngày âm phái A, can chi, nạp âm, cung phi Lập Xuân, tuổi mụ, phương án sát ranh) · `homNay` (tiết/trực theo +7).
- Giao diện `src/giaoDien/`, lưu `src/luuTru.ts` (localStorage, xuất/nhập file, nhắc 30 ngày, nhắc cài app).
- Bảng vàng 1900 đã sửa: nhuận tháng 8 (bản cũ của `ansaotuvi` ghi 7, sai).

## 2. Việc kế

- **Anh thử iPhone thật (lần 1 của kế hoạch tổng)** — cài app màn hình chính, thêm hồ sơ, xuất file (Chia sẻ → Lưu vào
  Tệp), xoá, nhập lại. Chưa có xác nhận thì chưa mở đợt 2.
- Đợt 2: tử vi (chép `ansaotuvi` sang TS, chỗ lệch theo Altuvi — `NGUON_MO`).

## 3. Cần anh

- Thử iPhone như mục 2, chụp màn hình chỗ lỗi.
- Ảnh lịch còn thiếu cho 21/01/1985, 10/02/2026, 10/03/2026: dòng "Trực" và "Ngày … Hoàng Đạo/Hắc Đạo" (trang chi tiết
  ngày) + tên trang. Chưa có thì app giữ trực/hoàng đạo theo tiết, ghi "chưa chắc".

## 4. Nợ, chỗ chưa chắc

- Thần tài, hỷ thần theo `lunar-typescript`, chưa đối chiếu lịch Việt. Theo tuổi chưa xét hình, hại, phá, can khắc.
- Tuỳ chọn `menhMauSo`, `thangXemNgay`… có trong lõi/`QUY_UOC`, chưa có màn chỉnh.
- Không rõ giờ + sinh đêm 30 Tết sau 23:00: app lấy năm cũ (`QUY_UOC` mục 9).
- `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ). Bảng Hán–Việt cần người rành lịch đọc lại vài mục (Bành Tổ, lộc, 28 tú).
