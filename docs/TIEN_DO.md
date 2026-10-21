# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 21/10/2026 — **đợt 4 đóng** (anh thử iPhone 21/10 ổn cả ba); **đợt 5 anh duyệt kế hoạch 21/10**, chưa làm mã.
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/ · gộp `main` kiểu dồn một commit (`git merge --squash`).

## 1. Đang ở đâu

- Bốn thẻ: "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) · "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu) · "Gieo quẻ".
  Chỉ lưu hồ sơ của anh; người nhà để đợt 9 (anh chốt 19/10).
- Khối mỗi người (`src/giaoDien/khoi/`): tử vi (Altuvi 345/345), năm nay (bảng báo 2026 144/144), bát tự + đại vận (`sxtwl`),
  hướng Bát trạch, tuổi hợp, thần số học, hoàng đạo, nhịp sinh học.
- Tử vi hạn năm, tháng, ngày + 9 sao lưu theo hôm nay (`luuHan.ts`, `QUY_UOC` mục 16) · lời giải dài tử vi, sao hạn, bát tự.
- Thẻ "Gieo quẻ" (đợt 4): Kinh Dịch gieo xu hoặc Mai Hoa, lời 64 quẻ, 386 hào; bói Kiều 3.254 câu (`QUY_UOC` mục 17, 18).
- Khối "Chọn ngày theo việc" cuối thẻ "Hôm nay" (đợt 4, `src/loi/chonNgay.ts`, `QUY_UOC` mục 19): 5 việc × tháng → Tốt/Được/Tránh
  kèm lý do; Dương Công, Sát Chủ Âm/Dương, Thọ Tử, Khổng Minh, giờ Lý Thuần Phong; tài thần đổi theo sách Việt (cả thẻ "Hôm nay").

## 2. Việc kế

- Đợt 5 (`docs/ke-hoach/2026-10-21-dot-5.md`, anh duyệt 21/10): A — thẻ thứ năm "Phong thủy", lưu hướng nhà vào hồ sơ,
  lưới phi tinh theo đa số trang Việt. **Việc kế: la bàn trước** (gộp `main` cho anh thử iPhone), rồi Lỗ Ban, phi tinh.
- Kế hoạch tổng còn sau đợt 5: 6 (chiêm tinh, tarot),
  7 (AI), 8, 9 (người nhà). Chưa làm: lưu thời, tứ hóa lưu niên, lưu đại hạn.

## 3. Cần anh

- **Xoá nhánh GitHub: anh dặn 20/10 để dồn, xoá một lần sau cùng.** Đang chờ xoá: `claude/determined-galileo-xz2mc5` (lịch sử
  còn ngày sinh thật — nên xoá), `claude/nifty-johnson-b0rxcq`, `claude/luu-han-loi-giai`, `claude/loi-giai-de-hieu`, `claude/nguon-phat-dao`, `claude/kinh-goc-cuu-dieu`, `claude/ngoc-hap-ky`, `claude/dot-4-kinh-dich`, `claude/blissful-sagan-ur507y` (đều đã
  nằm trong `main`). Xoá ở https://github.com/gc1001vn-svg/tu-vi-nha/branches — bấm thùng rác.

## 4. Nợ, chỗ chưa chắc

- Hạn tháng chưa so Altuvi (phải trả tiền); tháng nhuận khi xem tính như tháng trước (sách Trung Hoa, hocvienlyso chia ở ngày 15).
- Mệnh chủ/Thân chủ theo *Toàn Thư* (`QUY_UOC` mục 15), chưa so Altuvi; tuổi đại vận bát tự ghi tuổi mụ (chưa có nguồn Việt).
- Lời giải tử vi theo Tân Biên (Claude viết lại), sao hạn theo trang dân gian, bát tự theo nghĩa phổ biến, 450 đoạn Kinh Dịch
  (agent soát một lượt, sửa 1 lỗi) — chưa ai rành đọc lại;
  bát tự chỉ đếm thô, chưa xét vượng suy. Tốt/xấu từng phụ tinh theo bảng `ansaotuvi`, có sao lệch với sách (vd Mộ).
- Dưới 10 tuổi: hạn, Kim Lâu, Hoang Ốc "Chưa xét". Nên/kiêng, sao ngày theo hoàng lịch Trung Hoa (lịch Việt có hệ sao khác);
  mục kiêng trùng `cnlunar` chỉ 61 % → chọn ngày chỉ hạ Được. Ca kiểm chọn ngày lấy qua tóm tắt tìm kiếm, chưa mở trang gốc.
- Hướng sát chưa có nguồn Việt; cung hoàng đạo theo bảng ngày cố định. Tuỳ chọn `QUY_UOC` chưa có màn chỉnh.
- Máy ảo chỉ thử Chromium; anh thử iPhone thật 20/10 ổn. `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ); bảng cần người rành lịch
  đọc lại vài mục (Bành Tổ, lộc, 28 tú).
