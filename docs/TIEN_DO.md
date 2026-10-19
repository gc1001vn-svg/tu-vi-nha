# TIẾN ĐỘ — TỬ VI NHÀ

> Đọc cả file đầu mỗi phiên. Mục 1–4 **ghi đè** mỗi cuối phiên, không cộng dồn (việc đã làm: `git log`).
> Kế hoạch: `docs/ke-hoach/2026-10-14-ke-hoach-tong.md` · thư viện + số đo: `docs/NGUON_MO.md` ·
> quy ước tính: `docs/QUY_UOC.md` · lệnh riêng repo: `docs/DAU_PHIEN.md`. Trần cỡ file: `.claude/doc_dau_phien.txt`.

Cập nhật: 19/10/2026 tối — đợt 0, 1 xong; đợt "tăng tốc" (`docs/ke-hoach/2026-10-19-tang-toc.md`, 6 agent) gộp `main` 19/10.
Trang: https://gc1001vn-svg.github.io/tu-vi-nha/ · gộp `main` từ nay kiểu dồn một commit (`git merge --squash`, mục 3).

## 1. Đang ở đâu

- Ba thẻ: "Hôm nay" · "Tra cứu" (bất kỳ ai, không lưu) · "Của tôi" (một hồ sơ, lưu trong máy + file sao lưu). Anh chốt 19/10:
  chỉ lưu hồ sơ của anh; lưu người nhà để đợt 9.
- Anh thử iPhone lần 1 (19/10): app màn hình chính chạy, nhập hồ sơ được; chê ít thông tin, nhập phải bấm nhiều → đợt tăng tốc:
  - Nhập gõ phím: ngày/giờ gõ số, tỉnh gõ không dấu/viết tắt có gợi ý (`src/loi/nhap.ts`).
  - Hôm nay: nên/kiêng, sao tốt xấu, 28 tú, Bành Tổ, tuổi xung, giờ tốt hợp tuổi; trực/hoàng đạo theo **tháng âm** (anh chốt).
  - Khối mỗi người (`src/giaoDien/khoi/`): tử vi lá số (Altuvi 345/345, 3.000 lá khớp `ansaotuvi`), năm nay (sao hạn, hạn,
    Kim Lâu, Hoang Ốc, Tam Tai, Thái Tuế — khớp bảng báo 2026 144/144), bát tự + đại vận (khớp `sxtwl`), hướng Bát trạch,
    tuổi hợp, thần số học, cung hoàng đạo, nhịp sinh học.

## 2. Việc kế

- Anh thử iPhone lần 2: gõ phím (bàn phím số, Telex), lá số tử vi, sao lưu xuất → xoá → nhập (lần 1 chưa thử bước này).
- Anh muốn "Của tôi" tự tính theo giờ/ngày/tháng/năm: còn thiếu lưu niên/nguyệt/nhật tử vi (`ansaotuvi` không có), lời giải.
- Kế hoạch tổng còn: đợt 4 (Kinh Dịch, bói Kiều, xem ngày theo việc), 5 (la bàn, Lỗ Ban, phi tinh), 6 (chiêm tinh, tarot),
  7 (AI), 8, 9 (người nhà). Lời giải mỗi mục mới một dòng.

## 3. Cần anh

- Thử iPhone như mục 2, chụp chỗ lỗi.
- Tuỳ anh: xoá nhánh `claude/determined-galileo-xz2mc5` trên GitHub khi xong việc — lịch sử nhánh còn một commit lộ ngày sinh
  thật (19/10; `main` sạch vì gộp dồn; máy ảo không ghi đè lịch sử được).

## 4. Nợ, chỗ chưa chắc

- Mệnh chủ/Thân chủ: theo *Toàn Thư* (tra 19/10, `QUY_UOC` mục 15), chưa so được Altuvi (phải trả tiền); tuổi đại vận bát tự ghi tuổi mụ (chưa có nguồn Việt).
- Dưới 10 tuổi: hạn, Kim Lâu, Hoang Ốc "Chưa xét". Nên/kiêng, sao ngày theo hoàng lịch Trung Hoa (lịch Việt có hệ sao khác).
- Thần tài, hỷ thần, hướng sát chưa có nguồn Việt; cung hoàng đạo theo bảng ngày cố định.
- Tuỳ chọn trong `QUY_UOC` chưa có màn chỉnh. Mới thử Chromium, chưa thử Safari/WebKit.
- `lunar-typescript` 1.8.6 lộ mã `sn.*` (bảng Hán–Việt đỡ); bảng cần người rành lịch đọc lại vài mục (Bành Tổ, lộc, 28 tú).
- 19/10 chạy 6 agent cùng lúc chạm giới hạn phiên (5 giờ) một lần — chạy song song tối đa ~4.
