# LUẬN PHI TINH — sách lịch chính thức và Huyền Không hiện đại, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-03-phi-tinh.md`)

App giữ bàn phi tinh năm, tháng và hướng kỵ năm (mục 22), sửa hai câu nghĩa, thêm lời chốt. File này ghi nguồn, chỗ vênh, vì sao chốt
thế, số đo. Lời Claude soạn mới (luật 6).

## 1. Nguồn (đọc tới đâu, mức kiểm)

| Nguồn | Nền | Đã đọc (03/11) | Mức kiểm |
|---|---|---|---|
| *Khâm định Hiệp Kỷ Biện Phương Thư* (Thanh; Kanripo KR3g0051) | sách lịch chính thức | q.2: gốc Tử Bạch từ sư Vô Trước đời Nguyên, chín sao gắn Lạc Thư · q.35 *Phụ lục*: sửa nhà "năm, tháng tìm thêm tam kỳ, tử bạch, lộc mã, quý nhân… một sao tốt cùng đến chiếu tọa, hướng thì giúp thêm tốt" (sao phụ) · Thái Tuế: "là đầu trăm thần… hướng ấy vốn là hướng tốt bậc nhất nhưng dân thường không dám dùng; quay mặt về thì như đứng ở đất Tuế Phá"; dẫn phép dời nhà đời Hán (*Luận Hành* chép): "dời về Thái Tuế hung, quay lưng về Thái Tuế cũng hung" · Ngũ Hoàng giữa là "tượng vua", dân gian phải tránh (như Nguyệt Kỵ) | nguyên văn |
| Huyền Không phi tinh hiện đại (Hồng Kông, Đài Loan, Việt; masterseanchan, Tô Dân Phong, báo — mục 22 [W49]) | hiện đại | tốt / xấu từng sao, Vận 9 (Cửu Tử vượng, Nhất Bạch sinh khí), Bát Bạch thoái khí, Thái Tuế "tựa được, kỵ hướng" | trích đoạn |
| *Tử Bạch Quyết*, *Phi Tinh Phú*, *Thẩm thị Huyền Không học* | Huyền Không cổ | **không đọc được** (03/11: Wikisource báo quá tải cả phiên, archive.org không có, công cụ tìm không ra nguyên văn) — các câu ghép sao hay được dẫn ("nhị ngũ giao gia"…) **không dùng** | — |

## 2. Các nguồn cùng nói

- Ngũ Hoàng, Thái Tuế, Tuế Phá, Tam Sát của năm: không động thổ, không sửa lớn phía đó (sách lịch chính thức và thầy nay).
- Nhị Hắc là sao bệnh, nên để yên; Nhất, Lục, Bát, Cửu, Tứ là sao tốt (Huyền Không; *Hiệp Kỷ* xếp "tử bạch" — 1, 6, 8, 9 — là sao tốt phụ).
- Sao tháng cùng nghĩa sao năm, nhẹ hơn.

## 3. Chỗ vênh — cách chốt

| Chỗ vênh | Các ý | App chốt | Vì sao |
|---|---|---|---|
| Tựa lưng về Thái Tuế | thầy nay: "tựa được, kỵ hướng về" · phép dời nhà xưa (sách lịch chính thức dẫn): quay lưng về cũng hung | **sửa câu**: kỵ quay mặt về; tựa lưng thì hai bên nói khác — app không khuyên | bản cũ ghi "tựa lưng về được" như một điều chắc |
| Ngũ Hoàng là gì | Huyền Không nay: sao dữ nhất, tai họa · sách lịch xưa: "tượng vua" ở giữa, quá tôn nên dân thường tránh | **sửa câu**: "nặng nhất trong các sao phải tránh động"; bỏ chữ "tai họa, bệnh nặng" | cùng kết luận "tránh động", không cần dọa |
| Bát Bạch ở Vận 9 | nhiều thầy: thoái khí · có thầy: vẫn tốt | giữ màu tốt (thư viện), lời ghi "không còn là sao tài như vận 8" | hai bên vênh, không đổi màu |
| Sao năm và tháng gặp nhau | *Tử Bạch Quyết* có nhiều câu ghép sao (chưa đọc được nguyên văn) | chỉ dùng phép chắc: hướng có sao xấu (2, 5) năm và tháng chồng nhau là "nặng nhất tháng"; sao tốt năm và tháng cùng về (và không phải hướng để yên) là "thuận nhất tháng" | không dẫn câu chưa kiểm |
| Vật phẩm hóa giải | thầy nay bán chuông gió, hồ lô… · sách cổ không có | không khuyên mua; để yên là đủ | — |

## 4. Cách luận trong app (`src/loi/phiTinhLuan.ts`, lời `phiTinhLuanLoi.ts`)

- **Tổng luận năm**: câu cho sao vào giữa (9 câu) · "nên để yên" = Ngũ Hoàng, Nhị Hắc, Thái Tuế, Tuế Phá, Tam Sát gộp theo hướng (2026: Nam —
  Thái Tuế, Ngũ Hoàng; Bắc — Tuế Phá, Tam Sát; Tây Bắc — Nhị Hắc) · "hướng thuận" = sao tốt năm, trừ hướng để yên.
- **Tháng này**: nặng nhất / thuận nhất như §3. **Vận 9**, **Việc trong nhà** (sửa nhà, bàn học, giường người ốm), **Nhìn cho đúng**.

## 5. Số đo (03/11; `tests/LuanPhiTinh.test.ts`)

- 2026 khớp bàn đã kiểm ở mục 22; 1901–2099 (mỗi 7 năm × 12 tháng): đủ 5 đoạn, chữ đúng quy ước, hướng "nặng nhất" đúng là nơi sao 2 / 5
  năm gặp 2 / 5 tháng.
- Chưa làm: đọc *Tử Bạch Quyết*, *Thẩm thị Huyền Không học* (khi Wikisource mở lại); phi tinh theo nhà (sơn hướng, vận nhà — cần năm
  xây nhà).
