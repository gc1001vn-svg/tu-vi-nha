# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 19/10/2026 — đợt 0 xong phần máy, gộp `main` 15/10; trang web chạy từ 19/10:
https://gc1001vn-svg.github.io/tu-vi-nha/ (Deploy kiểm: trang chính, manifest, icon đều HTTP 200).

## 1. Đang ở đâu

- **Đợt 0 (14–15/10):** khung Vite + TypeScript + PWA + vitest, lệnh đo `npm run do`, CI + đưa lên GitHub Pages, icon
  (Thái cực + Bát quái, anh chọn), kịch bản đối chiếu chạy lại bằng một lệnh, bộ ca kiểm vàng lịch âm
  (`tests/vang/am-lich-hnd.json`), bảng Hán–Việt 820 mục cho mọi chữ `lunar-typescript` ra (thước phủ đủ + đối chiếu âm
  Unihan, `hanviet.csv`), `docs/QUY_UOC.md` (anh chốt 3 mặc định 15/10).
- App mới có vỏ (tên + số phiên bản), chưa có môn nào.
- Đổi `lunar-javascript` → `lunar-typescript` 1.8.6: cùng tác giả, có khai kiểu, so 73.414 ngày ra y hệt trừ lỗi lộ mã `sn.*`.

## 2. Việc kế — đợt 1

Hồ sơ nhiều người + sao lưu file · âm lịch VN (`@tuquet/lunar`) · màn "Hôm nay" · nơi sinh → múi giờ lịch sử
(`docs/QUY_UOC.md` mục 7). Xong là khi: mọi ngày 1900–2100 khớp bảng vàng. Giờ Tý: `setSect(1)` (anh chốt ngày hôm sau).

## 3. Cần anh

- Chụp app lịch âm anh tin, 7 ngày (cả dòng ngày âm, trực, ngày tốt/xấu): 21/01/1985 · 26/07/1987 · 29/01/1968 ·
  01/02/1965 · 25/08/1938 · 10/02/2026 · 10/03/2026. Để biết: ngày âm trước 1968 theo +7 hay +8; 12 trực theo tiết hay tháng âm.

## 4. Nợ, chỗ chưa chắc

- `@tuquet/lunar` và `ansaotuvi.S2L` trả ngày âm 0 cho 07/05/2054, 09/04/2062 → đợt 1 chặn riêng (bảng vàng: 30/3, 30/2).
- Ngày âm trước 1968 có thể theo +8 (`@dqcai/vn-lunar` trùng HND +8 trước 1968) — tạm theo +7, chờ ảnh.
- `lunar-typescript` 1.8.6 lộ mã `sn.sanSang`, `sn.guiKu`, `sn.siLi`, `sn.daTui`; thư viện sửa thì thước "không thừa" báo → đổi khoá.
- Bảng Hán–Việt cần người rành lịch đọc lại nghĩa: Bành Tổ (壬不泱水, 庚不经络…), lộc (互禄/进禄 hiểu theo năm sinh), vài vật hậu,
  động vật 28 tú (貉, 獬, 獐 theo nghĩa chữ, khác lịch Việt), 要安 Yếu Yên, 王日 Vương Nhật.
- Chưa thử trên iPhone thật (kế hoạch: sau đợt 1, 4, cuối).
