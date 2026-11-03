# LUẬN CHỌN NGÀY — tổng hợp sách lịch chính thức và tục Việt, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-03-chon-ngay.md`)

App giữ cách chấm từng ngày Tốt / Được / Tránh kèm lý do (mục 17–19), **đổi một chỗ** (kỵ chỉ có trong tục hạ xuống Được, tuỳ chọn
`kyTuc`) và thêm lời chốt tháng. File này ghi nguồn, chỗ vênh, vì sao chốt thế, số đo. Lời Claude soạn mới (luật 6).

## 1. Nguồn (đọc tới đâu, mức kiểm)

| Nguồn | Nền | Đã đọc (03/11) | Mức kiểm |
|---|---|---|---|
| *Khâm định Hiệp Kỷ Biện Phương Thư* (1739–1742, Khâm Thiên Giám nhà Thanh soạn theo lệnh vua; Kanripo KR3g0051) | Trung Hoa, sách lịch chọn ngày chính thức | lời tựa vua Càn Long; mục lục ("phá hết những kiêng kỵ không có căn cứ của thầy chọn ngày"); q.6 (Nguyệt Kỵ, hệ 12 thần có Thọ Tử); q.7 (Hoàng Đạo, Hắc Đạo); q.10 (bảng nên – kiêng 6 bậc, cách ghi lịch); q.36 *Biện ngoa* (bác Dương Công Kỵ, hợp hôn theo cung phi…) | nguyên văn |
| Trang lịch Việt, mã GitHub (mục 19 [W46]) | Việt | Tam Nương, Nguyệt Kỵ, Dương Công Kỵ, Sát Chủ, Thọ Tử, Khổng Minh, giờ Lý Thuần Phong | trích đoạn (20–21/10) |
| Thư viện `lunar-typescript` (nên / kiêng, sao tốt / xấu từng ngày) | theo phép hoàng lịch | so `cnlunar` 21/10: mục kiêng trùng 58–65 % (mục 19) | đo máy |

## 2. Các nguồn cùng nói

- Hoàng Đạo nên làm việc lớn, Hắc Đạo kiêng xây dựng, dọn nhà, đi xa (*Hiệp Kỷ* q.7: "các ngày Hoàng Đạo nên làm mọi việc… các sao xấu
  tự lánh"); lịch Việt cùng dùng.
- Xem nên – kiêng theo từng việc rồi cân nặng nhẹ (*Hiệp Kỷ* q.10: "trước theo thứ tự việc xem ngày nên, ngày kiêng; sau so nặng nhẹ
  cát hung mà bỏ, lấy").
- Ngày xung tuổi người làm việc là kỵ (Việt, Trung Hoa).

## 3. Chỗ vênh — cách chốt

| Kỵ | Tục Việt | *Hiệp Kỷ* | App chốt (mặc định `kyTuc: 'xau'`) |
|---|---|---|---|
| Dương Công Kỵ (13 ngày / năm) | kiêng mọi việc lớn | q.36 **bác**: là ngày sao Thất đếm từ sao Giác ngày Tết — "không thông"; sao Thất "ắt chẳng phải sao dữ" | Được, ghi "tục kiêng" |
| Thọ Tử | trăm việc đều kỵ | q.6: Long Hổ, Tội Chí, Thọ Tử "theo lịch cũ, bỏ" (cùng bảng: tháng Giêng ở Tuất) | Được, ghi "tục kiêng" |
| Tam Nương, Sát Chủ Dương | kiêng việc lớn | không có trong sách | Được, ghi "tục kiêng" |
| Nguyệt Kỵ (5, 14, 23) | kiêng mọi việc | q.6: giữ, nhưng lịch chỉ ghi việc nhỏ (tế lễ, tắm gội, sửa nhà); dẫn *Tề Đông dã ngữ* chê tục "việc gì cũng tránh" là không có căn cứ | **Tránh** cho 5 việc lớn của app |
| Sao Đức gặp sao xấu | — | q.10: nên – kiêng 6 bậc; bậc giữa gặp Đức thì theo nên; xấu chồng lên thì có Đức vẫn kiêng | dùng để **xếp hạng** ngày nên chọn (+1 khi có Thiên Đức, Nguyệt Đức, hợp, Thiên Xá); không đổi mức |
| Khổng Minh, giờ Lý Thuần Phong (xuất hành) | dùng | không có | giữ (chỉ xuất hành, mức `xau` như cũ), lời ghi là cách xem của lịch Việt |

Vì sao không giữ "Tránh" cho kỵ tục: sách lịch chính thức — bộ tổng hợp lớn nhất, có thầy lịch cả nước góp — bác hoặc bỏ; giữ "Tránh"
thì gần nửa số ngày mỗi tháng bị cấm (đo §5) mà không có căn cứ. Vẫn ghi "tục kiêng" trên nhãn ngày để nhà giữ tục tự tránh; các ngày Tốt
không bao giờ phạm kỵ nào. Muốn theo tục như cũ: `kyTuc: 'tranh'` (Bảng tuỳ chọn).

## 4. Cách luận trong app (`src/loi/chonNgayLuan.ts`, lời `chonNgayLuanLoi.ts`)

- **Tổng luận tháng**: đếm Tốt / Được / Tránh; **nên chọn nhất** = tối đa 3 ngày Tốt xếp theo (số lý do tốt − số lý do xấu + 1 nếu có sao
  Đức); không có ngày Tốt thì lấy ngày Được không phạm kỵ nào và lịch không ghi kiêng, kèm lời "việc không gấp thì xem tháng khác".
- **Căn cứ** (4 câu, xếp theo sức nặng), **Theo việc** (cưới hỏi, động thổ, khai trương, đi xa, mua xe — mỗi việc một lời dặn),
  **Nhìn cho đúng** (ý lời tựa Càn Long: chọn ngày để thuận trời đất, lời họa phúc rối rắm là lỗi thầy thuật; việc gấp không đợi ngày).

## 5. Số đo (03/11; `tests/LuanChonNgay.test.ts`)

- Năm 2026, 5 việc, không xét tuổi: ngày Tránh **805 / 1.825 (44 %) → 190 (10 %)** — còn lại gần như chỉ Nguyệt Kỵ (3 ngày / tháng); ngày
  Tốt không đổi, không ngày Tốt nào có kỵ tục.
- 12 tháng × 5 việc × có / không tuổi: lời đủ 4 đoạn, chữ đúng quy ước; ngày nên chọn luôn là ngày Tốt khi tháng có ngày Tốt.
- Chưa làm: giờ tốt trong ngày cho từng việc (đã có giờ Hoàng Đạo ở thẻ "Hôm nay"); bảng 6 bậc của *Hiệp Kỷ* chưa đối chiếu với nên – kiêng
  của thư viện (thư viện có lẽ đã theo bảng này — chưa kiểm).
