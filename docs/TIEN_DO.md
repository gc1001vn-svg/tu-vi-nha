# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 20/10/2026 — đợt "lưu hạn + lời giải" (`docs/ke-hoach/2026-10-20-luu-han-loi-giai.md`, anh duyệt A) gộp `main` 20/10;
anh thử iPhone lần 2 ổn, chê vài chỗ diễn giải khó hiểu → viết lại theo sách gốc Tân Biên, gộp lần hai cùng ngày.
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/ · gộp `main` kiểu dồn một commit (`git merge --squash`).

## 1. Đang ở đâu

- Ba thẻ: "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) · "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu).
  Chỉ lưu hồ sơ của anh; người nhà để đợt 9 (anh chốt 19/10).
- Khối mỗi người (`src/giaoDien/khoi/`): tử vi (Altuvi 345/345), năm nay (bảng báo 2026 144/144), bát tự + đại vận (`sxtwl`),
  hướng Bát trạch, tuổi hợp, thần số học, hoàng đạo, nhịp sinh học.
- 20/10: tử vi hạn năm, tháng, ngày + 9 sao lưu tự tính theo hôm nay (`src/loi/tuVi/luuHan.ts`; khớp `tuvi-mcp-server`, `iztro`
  200/200 mỗi bên) · lời giải dài: tử vi (`nghia.ts`), 9 sao hạn + 8 hạn (tháng kỵ, ngày cúng khi ≥2 nguồn), bát tự.
- 20/10 lần hai: đọc sách gốc *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang 1956, OCR archive.org) — hạn tháng app dùng đúng "cách thứ
  nhất" sách nói hay dùng, 9 sao lưu khớp sách; lời giải viết lại theo sách, lời thường; mỗi hạn có kết luận tốt/xấu theo luật
  sách ("quá nửa sao"); bát tự giải thích từ khó. `QUY_UOC` mục 16: bảng so 6 cách hạn tháng. Ảnh 390×844: không lỗi.

## 2. Việc kế

- Anh thử iPhone lần 2: gõ phím, lá số + hạn năm/tháng/ngày, lời giải, sao lưu xuất → xoá → nhập (lần 1 chưa thử bước này).
- Anh xem lại phần lời giải mới; chỗ nào còn khó hiểu thì chụp, em sửa tiếp.
- Kế hoạch tổng còn: đợt 4 (Kinh Dịch, bói Kiều, xem ngày theo việc), 5 (la bàn, Lỗ Ban, phi tinh), 6 (chiêm tinh, tarot),
  7 (AI), 8, 9 (người nhà). Chưa làm: lưu thời, tứ hóa lưu niên, lưu đại hạn.

## 3. Cần anh

- Xem lời giải mới trên iPhone, chụp chỗ còn khó hiểu.
- **Xoá nhánh GitHub: anh dặn 20/10 để dồn, xoá một lần sau cùng.** Đang chờ xoá: `claude/determined-galileo-xz2mc5` (lịch sử
  còn ngày sinh thật — nên xoá), `claude/nifty-johnson-b0rxcq`, `claude/luu-han-loi-giai`, `claude/loi-giai-de-hieu` (đều đã
  nằm trong `main`). Xoá ở https://github.com/gc1001vn-svg/tu-vi-nha/branches — bấm thùng rác.

## 4. Nợ, chỗ chưa chắc

- Hạn tháng chưa so Altuvi (phải trả tiền); tháng nhuận khi xem tính như tháng trước (sách Trung Hoa, hocvienlyso chia ở ngày 15).
- Mệnh chủ/Thân chủ theo *Toàn Thư* (`QUY_UOC` mục 15), chưa so Altuvi; tuổi đại vận bát tự ghi tuổi mụ (chưa có nguồn Việt).
- Lời giải tử vi theo Tân Biên (Claude viết lại), sao hạn theo trang dân gian, bát tự theo nghĩa phổ biến — chưa ai rành đọc lại;
  bát tự chỉ đếm thô, chưa xét vượng suy. Tốt/xấu từng phụ tinh theo bảng `ansaotuvi`, có sao lệch với sách (vd Mộ).
- Dưới 10 tuổi: hạn, Kim Lâu, Hoang Ốc "Chưa xét". Nên/kiêng, sao ngày theo hoàng lịch Trung Hoa (lịch Việt có hệ sao khác).
- Thần tài, hỷ thần, hướng sát chưa có nguồn Việt; cung hoàng đạo theo bảng ngày cố định. Tuỳ chọn `QUY_UOC` chưa có màn chỉnh.
- Mới thử Chromium, chưa thử Safari/WebKit. `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ); bảng cần người rành lịch
  đọc lại vài mục (Bành Tổ, lộc, 28 tú).
