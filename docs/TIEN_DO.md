# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 20/10/2026 — đợt "lưu hạn + lời giải" (`docs/ke-hoach/2026-10-20-luu-han-loi-giai.md`, anh duyệt A) gộp `main` 20/10.
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/ · gộp `main` kiểu dồn một commit (`git merge --squash`).

## 1. Đang ở đâu

- Ba thẻ: "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) · "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu).
  Chỉ lưu hồ sơ của anh; người nhà để đợt 9 (anh chốt 19/10).
- Khối mỗi người (`src/giaoDien/khoi/`): tử vi (Altuvi 345/345), năm nay (bảng báo 2026 144/144), bát tự + đại vận (`sxtwl`),
  hướng Bát trạch, tuổi hợp, thần số học, hoàng đạo, nhịp sinh học.
- 20/10 thêm, tự tính theo hôm nay: tử vi hạn năm (tiểu hạn, Lưu Thái Tuế), tháng, ngày + 9 sao lưu (`src/loi/tuVi/luuHan.ts`;
  khớp `tuvi-mcp-server` 200/200 và `iztro` 200/200, `QUY_UOC` mục 16) · lời giải dài: 12 cung, 14 chính tinh sáng/hãm, đủ phụ tinh
  (`src/loi/tuVi/nghia.ts`), 9 sao hạn + 8 hạn (tháng kỵ, ngày cúng khi ≥2 nguồn), bát tự (nhật chủ, nhóm hành theo nhật chủ,
  vận đang chạy, năm nay theo thập thần). Ảnh khổ 390×844 đã xem: không lỗi, không tràn ngang.

## 2. Việc kế

- Anh thử iPhone lần 2: gõ phím, lá số + hạn năm/tháng/ngày, lời giải, sao lưu xuất → xoá → nhập (lần 1 chưa thử bước này).
- Hạn tháng: mặc định khởi từ tiểu hạn (Thái Thứ Lang); cách khởi Lưu Thái Tuế hiện thêm một dòng. Có ảnh Altuvi mục hạn thì chốt.
- Kế hoạch tổng còn: đợt 4 (Kinh Dịch, bói Kiều, xem ngày theo việc), 5 (la bàn, Lỗ Ban, phi tinh), 6 (chiêm tinh, tarot),
  7 (AI), 8, 9 (người nhà). Chưa làm: lưu thời, tứ hóa lưu niên, lưu đại hạn.

## 3. Cần anh

- Thử iPhone như mục 2, chụp chỗ lỗi. Nếu trang Altuvi anh xem có mục hạn tháng: chụp một ảnh (ngày sinh giả cũng được).
- Tuỳ anh: xoá nhánh `claude/determined-galileo-xz2mc5` trên GitHub — lịch sử nhánh còn một commit lộ ngày sinh thật (19/10;
  `main` sạch). Nhánh `claude/luu-han-loi-giai` (20/10) xoá được sau khi gộp.

## 4. Nợ, chỗ chưa chắc

- Hạn tháng chưa so Altuvi; tháng nhuận khi xem tính như tháng trước (`iztro`, hocvienlyso chia ở ngày 15) — chưa chắc.
- Mệnh chủ/Thân chủ theo *Toàn Thư* (`QUY_UOC` mục 15), chưa so Altuvi; tuổi đại vận bát tự ghi tuổi mụ (chưa có nguồn Việt).
- Lời giải là văn Claude soạn theo cách hiểu phổ biến, chưa ai rành tử vi đọc lại; bát tự chỉ đếm thô, chưa xét vượng suy.
- Dưới 10 tuổi: hạn, Kim Lâu, Hoang Ốc "Chưa xét". Nên/kiêng, sao ngày theo hoàng lịch Trung Hoa (lịch Việt có hệ sao khác).
- Thần tài, hỷ thần, hướng sát chưa có nguồn Việt; cung hoàng đạo theo bảng ngày cố định. Tuỳ chọn `QUY_UOC` chưa có màn chỉnh.
- Mới thử Chromium, chưa thử Safari/WebKit. `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ); bảng cần người rành lịch
  đọc lại vài mục (Bành Tổ, lộc, 28 tú).
- `cai_dat.mjs` (kho ghi-nho) bị chế độ Auto chặn 20/10 ("mã từ ngoài") — phiên sau chạy lại khi anh cho phép.
