# LUẬN NĂM NAY — tổng hợp, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-02-nam-nay.md`)

App chỉ hiện **lời chốt**; file này ghi vì sao chốt thế. Lời trong app Claude soạn mới (luật 6). Phần tra nguồn đã làm 20/10, ghi đủ ở
**QUY_UOC mục 14** (không chép lại): kinh Mật tông 梵天火羅九曜 (T1311), 七曜攘災決 (T1308) đọc nguyên văn CBETA; *Ngọc Hạp Ký* (Đạo
tạng, DZ1481); chùa Nhật (Cửu Diệu theo tuổi mụ); bách khoa Hàn (삼재); *Tam Mệnh Thông Hội* quyển 2 (hình, hại); báo, thầy số Đài
Loan – Hồng Kông (Thái Tuế 2026); lập trường Phật giáo, công văn 73/VHCS-NSVH và 591/BVHTTDL-VHCS (2019).

## 1. Các nguồn cùng nói gì, vênh gì

| Mục | Cùng nói | Vênh | Sức nặng trong lời chốt |
|---|---|---|---|
| Sao Cửu Diệu | vòng sao nam khớp kinh gốc 9/9, chùa Nhật 9/9; Thái Dương, Thái Âm, Mộc Đức tốt; La Hầu, Kế Đô xấu ở mọi nguồn | Thái Bạch: Việt xấu, kinh gốc nhẹ / tốt · Thổ Tú, Vân Hớn: Việt trung tính, kinh gốc + chùa Nhật xấu · Thủy Diệu: Việt trung tính, kinh gốc + nhiều trang tốt | theo cách chia ba của Việt (anh chốt 20/10); La Hầu, Kế Đô nặng hơn (−1,5) vì mọi nguồn cùng xấu; lời ghi chỗ nguồn gốc xếp khác |
| Thái Tuế | trị, xung, hình, hại, phá — Trung Hoa, Đài Loan, Hàn, Việt cùng xem; trị và xung nặng nhất | tuổi thứ năm mỗi thầy một khác (QUY_UOC 14) | phần nặng nhất: trị −1, xung −1,5, hình −0,5, hại −0,5, phá −0,25 |
| Tam Tai | Việt, Hàn cùng quy tắc | Hàn: năm đầu nặng nhất; Việt: ba năm như nhau | −0,75 mỗi năm (không chia nặng nhẹ, chỉ ghi lời Hàn) |
| 8 hạn | — | chưa thấy bộ tám tên ở nguồn ngoài Việt Nam; năm nào ai cũng gặp một hạn (cả 8 đều "xấu") | **không tính điểm** — chỉ là lời nhắc nhẹ |
| Kim Lâu, Hoang Ốc | chỉ dùng cho làm nhà (Kim Lâu cả cưới hỏi, theo tuổi cô dâu) | — | không vào kết chung, chỉ vào phần "Việc lớn" |

## 2. Cách luận (`src/loi/namNayLuan.ts`, lời `namNayLuanLoi.ts`)

- **Tổng quan**: điểm = sao + Thái Tuế + Tam Tai (trọng số ở bảng trên); kết "tương đối êm / bình thường / cần giữ gìn hơn"; một câu cho
  sao (kèm chỗ nguồn gốc xếp khác), Thái Tuế, Tam Tai, hạn (nói rõ không tính vào kết).
- **Việc lớn**: làm nhà (Kim Lâu, Hoang Ốc xấu, Tam Tai → kiêng đứng tên, tục mượn tuổi), cưới hỏi (Kim Lâu theo tuổi cô dâu; Tam Tai có
  nơi kiêng), khởi sự làm ăn (Tam Tai, xung Thái Tuế → chậm lại). Dưới 10 tuổi mụ: chưa xét.
- **Nhìn cho đúng**: tục xem năm theo tuổi; đạo Phật không có sao tốt xấu; Bộ Văn hóa đề nghị chấn chỉnh dâng sao giải hạn trục lợi.

## 3. Số đo (02/11; `tests/LuanNamNay.test.ts`)

- Ngưỡng (điểm rời rạc, mốc gần phân vị 75 / 25 trên tuổi mụ ≥ 10, sinh 1930–2014 × năm xem 2020–2031 × hai giới, 2.028 trường hợp):
  êm khi ≥ 0,5 (20 %), cần giữ gìn khi < −1,25 (29 %).
- Tuổi 1–100 × 12 năm × hai giới: đủ 3 đoạn, chữ đúng quy ước; kết mỗi đầu trong 10–40 %.
- Chưa làm: gộp với năm của tử vi, bát tự, thần số (mỗi môn đã có phần năm riêng trong khối của nó).
