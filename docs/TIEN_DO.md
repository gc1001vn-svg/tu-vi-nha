# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 21/10/2026 — đợt 4 gộp `main` bói Kiều, Kinh Dịch; anh bấm thử 3 nút thẻ "Gieo quẻ" 21/10, không báo lỗi.
Còn chọn ngày theo việc (chờ 4 ảnh lịch). Đợt "lưu hạn + lời giải" anh thử iPhone 20/10 ổn, đã đóng.
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/ · gộp `main` kiểu dồn một commit (`git merge --squash`).

## 1. Đang ở đâu

- Bốn thẻ: "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) · "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu) · "Gieo quẻ".
  Chỉ lưu hồ sơ của anh; người nhà để đợt 9 (anh chốt 19/10).
- Khối mỗi người (`src/giaoDien/khoi/`): tử vi (Altuvi 345/345), năm nay (bảng báo 2026 144/144), bát tự + đại vận (`sxtwl`),
  hướng Bát trạch, tuổi hợp, thần số học, hoàng đạo, nhịp sinh học.
- 20/10: tử vi hạn năm, tháng, ngày + 9 sao lưu tự tính theo hôm nay (`src/loi/tuVi/luuHan.ts`; khớp `tuvi-mcp-server`, `iztro`
  200/200 mỗi bên) · lời giải dài: tử vi (`nghia.ts`), 9 sao hạn + 8 hạn (tháng kỵ, ngày cúng khi ≥2 nguồn), bát tự.
- 20/10: hạn tháng theo *Tân Biên* (`QUY_UOC` mục 16); vòng sao Cửu Diệu trùng kinh đời Đường, chùa Nhật, *Ngọc Hạp Ký*;
  8 hạn chưa có nguồn ngoài VN (`QUY_UOC` mục 14, W43–W45).
- Thẻ "Gieo quẻ" (đợt 4): Kinh Dịch gieo xu hoặc Mai Hoa, lời 64 quẻ, 386 hào; bói Kiều 3.254 câu (`QUY_UOC` mục 17, 18).

## 2. Việc kế

- Đợt 4 (`docs/ke-hoach/2026-10-20-dot-4.md`, anh duyệt A): xong bói Kiều, Kinh Dịch (`QUY_UOC` mục 17, 18); còn chọn ngày.
- Kế hoạch tổng còn: đợt 5 (la bàn, Lỗ Ban, phi tinh), 6 (chiêm tinh, tarot),
  7 (AI), 8, 9 (người nhà). Chưa làm: lưu thời, tứ hóa lưu niên, lưu đại hạn.

## 3. Cần anh

- Chụp 4 ngày lịch ghi trong kế hoạch đợt 4 (trước phần chọn ngày).
- **Xoá nhánh GitHub: anh dặn 20/10 để dồn, xoá một lần sau cùng.** Đang chờ xoá: `claude/determined-galileo-xz2mc5` (lịch sử
  còn ngày sinh thật — nên xoá), `claude/nifty-johnson-b0rxcq`, `claude/luu-han-loi-giai`, `claude/loi-giai-de-hieu`, `claude/nguon-phat-dao`, `claude/kinh-goc-cuu-dieu`, `claude/ngoc-hap-ky`, `claude/dot-4-kinh-dich` (đều đã
  nằm trong `main`). Xoá ở https://github.com/gc1001vn-svg/tu-vi-nha/branches — bấm thùng rác.

## 4. Nợ, chỗ chưa chắc

- Hạn tháng chưa so Altuvi (phải trả tiền); tháng nhuận khi xem tính như tháng trước (sách Trung Hoa, hocvienlyso chia ở ngày 15).
- Mệnh chủ/Thân chủ theo *Toàn Thư* (`QUY_UOC` mục 15), chưa so Altuvi; tuổi đại vận bát tự ghi tuổi mụ (chưa có nguồn Việt).
- Lời giải tử vi theo Tân Biên (Claude viết lại), sao hạn theo trang dân gian, bát tự theo nghĩa phổ biến, 450 đoạn Kinh Dịch
  (agent soát một lượt, sửa 1 lỗi) — chưa ai rành đọc lại;
  bát tự chỉ đếm thô, chưa xét vượng suy. Tốt/xấu từng phụ tinh theo bảng `ansaotuvi`, có sao lệch với sách (vd Mộ).
- Dưới 10 tuổi: hạn, Kim Lâu, Hoang Ốc "Chưa xét". Nên/kiêng, sao ngày theo hoàng lịch Trung Hoa (lịch Việt có hệ sao khác).
- Thần tài, hỷ thần, hướng sát chưa có nguồn Việt; cung hoàng đạo theo bảng ngày cố định. Tuỳ chọn `QUY_UOC` chưa có màn chỉnh.
- Máy ảo chỉ thử Chromium; anh thử iPhone thật 20/10 ổn. `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ); bảng cần người rành lịch
  đọc lại vài mục (Bành Tổ, lộc, 28 tú).
