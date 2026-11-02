# LUẬN CHỈ TAY — tổng hợp nhiều sách, nhiều nước, chốt một lời (kế hoạch `docs/ke-hoach/2026-11-02-chi-tay.md`)

App chỉ hiện **lời chốt**. File này ghi nguồn, chỗ các nền vênh, vì sao chốt thế, số đo. Lời Claude soạn mới (luật 6), không kể sách.
Khung ô, máy dò ảnh, AI, nguyên văn các câu trích 28/10: **QUY_UOC mục 27** (không chép lại). Bảng luật từng ô kèm nền, sách
(`GIAI` trong `src/loi/chiTay.ts`) giữ làm ghi chú nguồn và dữ liệu AI, không hiện trên màn hình nữa.

## 1. Nguồn (đọc tới đâu, mức kiểm)

| Nguồn | Nền, nước | Đã đọc | Mức kiểm |
|---|---|---|---|
| *Thái Thanh Thần Giám* q.5, *Thần Tướng Toàn Biên* (Luận chưởng văn, Tướng tâm tính, Tướng căn cơ), *Liễu Trang tướng pháp* mục 54 | Trung Hoa | 28/10 | nguyên văn |
| *Bṛhat Saṃhitā* 67.43, 67.50, 69.12–13 | Ấn Độ | 28/10 | nguyên văn GRETIL |
| Aristotle, *Historia Animalium* I.15 | Hy Lạp | 28/10 | bản dịch Thompson 1910 |
| Johannes Indagine, *Introductiones* (1522; bản Anh *The Book of Palmestry* 1676) | Tây cổ (Đức) | **02/11**: đường đời — dài, thẳng, rõ thì thọ, ít bệnh (dẫn Pliny); ngắn, mảnh, đứt, nhiều vạch cắt thì yếu sức, việc khó thành | archive.org, bản chữ máy nhận dạng (chữ cổ, nhiều lỗi) |
| Richard Saunders, *Palmistry* (Anh 1663) | Tây cổ | 02/11: tải được, chữ máy nhận dạng quá hỏng — chưa dùng | — |
| A. Desbarrolles, *Les mystères de la main* (Pháp 1862) | Tây thế kỷ 19 | **02/11**: đường trí thẳng dài = phán đoán lành, ý chí mạnh; dốc về gò Mặt Trăng = tưởng tượng, dễ buồn; đường tình ngắn trơn = vị kỷ; đường đời dài mà mảnh = sức kém, đứt quãng = yếu | archive.org nguyên văn |
| Comte de Saint-Germain, *Practical Palmistry* (Mỹ 1897; tự nhận gộp sách Latin, Pháp, Ý, Đức, Anh từ thế kỷ 15) | Tây | **02/11**: đường đời ngắn thì đời ngắn nhưng đường trí tốt, ngón cái mạnh bù được; đứt = bệnh; dính đường trí = sống theo lý trí, thận trọng, rất nhạy cảm; đường tình càng dài lên ngón trỏ càng lý tưởng; đường trí thẳng dài = óc thực tế; không có đường số phận = đời bình lặng, ít biến cố | archive.org nguyên văn |
| Cheiro (1916), Benham (1900) | Tây | 28/10 | nguyên văn |
| Nhật: *masukake-sen* ますかけ線 (chỉ tay ngang) — "tướng lấy thiên hạ", gắn với tay ấn Hideyoshi, Ieyasu; bền bỉ, mạnh vận, dễ thành "ông chủ một mình" | Nhật hiện đại | 02/11 | trích đoạn báo Nhật qua công cụ tìm |
| Hàn: *makjwin songeum* 막쥔손금 (chỉ tay ngang) — thẳng thắn, "được ăn cả ngã về không"; nhắc dễ nhận nhầm khi đường trí / tình mờ; xem tay ăn cơm | Hàn hiện đại | 02/11 | trích đoạn báo Hàn |
| Sách tướng tay Việt cổ | Việt | không tìm thấy (02/11: công cụ tìm không ra; Phan Kế Bính 1915 tả tướng mặt, không có chỉ tay) | — |

## 2. Các nền cùng nói (đồng thuận)

- Nét nhỏ, sâu, rõ, liền là tốt; nông, thô, đứt là kém — Trung Hoa, Ấn Độ, Tây cổ (Indagine) đến Tây thế kỷ 19–20.
- Đường đời dài, rõ = sức bền — Trung Hoa ("chủ thọ yểu"), Tây từ Indagine tới Cheiro; Saint-Germain, Benham thêm: đường ngắn **bù
  được** (đường trí tốt, ngón cái mạnh; chỉ tay đổi theo năm tháng).
- Đường trí thẳng, dài = thực tế, phán đoán vững (Desbarrolles, Saint-Germain, Cheiro; Trung Hoa "nét ngay thì lòng ngay").
- Đường dọc thẳng lên ngón giữa = thành đạt; mọc từ cổ tay = tay trắng dựng nghiệp — Trung Hoa, Ấn Độ, Tây.
- Đứt = gián đoạn, trắc trở (mọi nền).

## 3. Chỗ các nền vênh — cách chốt

| Chỗ vênh | Các ý | App chốt | Vì sao |
|---|---|---|---|
| Chỉ tay ngang | Trung Hoa: rất xấu (hại ruột thịt) · Nhật: tướng lấy thiên hạ, rất tốt · Tây: ý chí dồn một hướng, cô độc · Hàn: thẳng thắn, được ăn cả ngã về không | **không chấm điểm**; lời: ý chí dồn một hướng, làm tới cùng — hợp thì nên lớn, không hợp dễ cực đoan; nên có người góp ý | hai nền ngược hẳn (xấu ↔ tốt nhất); điểm chung của cả bốn là "mạnh, dồn một phía" |
| Đường sự nghiệp tách từ đường đời | Cheiro: tuổi trẻ bị cha mẹ, họ hàng ràng buộc · *Toàn Biên*: được phúc ấm ông cha | 0 điểm; "tuổi trẻ gắn với gia đình — được nhờ và cũng bị ràng buộc" | hai bên cùng nói "gắn gia đình", chỉ khác tốt / xấu |
| Không có đường sự nghiệp | Benham: tự lập · Saint-Germain: đời bình lặng, ít biến cố | 0 điểm; "tự chọn lối đi, đời ít biến động lớn" — ghép hai ý | không ý nào nói xấu hẳn; rất nhiều người không có |
| Đường trí cong xuống | Tây: tưởng tượng, nghệ thuật · Trung Hoa: nét cong queo = đa nghi | 0 điểm; "giàu tưởng tượng, hay lo xa" | Trung Hoa chê nét **khúc khuỷu**, không phải đường cong đều; giữ "lo xa" từ ý Trung Hoa |
| Đường trên cùng nghĩa là gì | Tây, Nhật, Hàn: tình cảm · Trung Hoa: sang hèn, cha · Ấn Độ, Hy Lạp: thọ | tình cảm | ba nước hiện đại cùng dùng; tên ô đã gọi "đường tình" |
| Đường đời ngắn | Indagine, Saint-Germain: đời ngắn · Benham: quãng nên giữ sức · khoa học: không có cơ sở | −0,5; "cần giữ sức, không phải điềm thọ yểu"; đoạn Sức bền luôn kèm "không báo tuổi thọ, không báo bệnh — muốn biết thì đi khám" | luật cứng không phán chết, bệnh |
| Đường tình dài tới ngón trỏ | Tây: lý tưởng · Hy Lạp: thọ | +0,5 | một nền, nhẹ |
| Đầu đường trí dính / tách | chỉ Tây (Cheiro, Saint-Germain) | 0 điểm, chỉ là tính (thận trọng / dám làm) | không phải tốt xấu |

## 4. Cách luận trong app (`src/loi/chiTayLuan.ts`, lời `chiTayLuanLoi.ts`)

- **Nhãn chốt từng ô** (`O`): rõ +1 / mờ −1 (ba đường chính) · đường sự nghiệp rõ +1, mờ / không có 0 · dài +1 (đời, trí), +0,5 (tình) ·
  ngắn −0,5 · đứt −1 (sự nghiệp −0,5) · cổ tay +1 · các ô tính cách 0. Ba đường chính đều rõ và liền: +1 (các nền cùng khen). Đường
  "không thấy / không có" thì các ô khác của đường đó bỏ qua.
- Chưa chọn độ rõ của ba đường chính → chỉ báo "chưa chọn đủ".
- **Tổng luận**: kết (thuận ≥ 1,5 · cần tự bồi đắp ≤ −2,5) · ba đường rõ liền · đường mờ · đường đứt · chỉ tay ngang.
- **Tính cách, trí tuệ**: bảng 2 × 2 dáng đường trí × đầu dính / tách · sức đường trí (rõ + dài) · vòng đường đời · chỉ tay ngang.
- **Công việc, tiền bạc**: đường sự nghiệp (điểm đầu, độ rõ, đứt). **Tình cảm, gia đình**: đường tình (+ gốc gia đình khi sự nghiệp tách
  từ đường đời). **Sức bền**: đường đời + câu nhắc khám bệnh. **Các quãng đời**: điểm đầu đường sự nghiệp, chỗ đứt (không nói tuổi).
- Màn hình: "Lời giải" 7 đoạn, rồi "Từng ô đã chọn" (câu tóm từng ô); bỏ "Quy luật chung", mức tin, "Từng sách nói gì". AI vẫn nhận ô +
  luật + mức tin như 28/10, thêm mục "Lời chốt của app" (tổng luận).

## 5. Số đo (02/11; `tests/LuanChiTay.test.ts`)

- 3.000 bàn tay giả: ba đường chính rõ / mờ chia đôi (ai cũng có ba đường), các ô khác chia đều, chỉ tay ngang 5 %. Điểm p10 −3,5 · p25
  −2,5 · p50 −0,5 · p75 1 · p90 2. Ngưỡng ≥ 1,5 / ≤ −2,5: thuận 20 %, cần tự bồi đắp 26 %.
- Đủ đoạn, không câu trống, chữ đúng quy ước; hai bàn tay khác nhau trùng trung bình **34 %** câu (không tính câu kết, câu nhắc
  khám, đoạn "Nhìn cho đúng"; bản luật cũ trùng 54 % ô) — cao hơn tướng mặt (17 %) vì mỗi ô chỉ 2–3 giá trị.
- Chưa chắc: tay thật ít đứt hơn mức chia đều → phân bố kết thật có thể nghiêng về "thuận"; chưa có sách tướng tay Việt cổ; Nhật, Hàn
  chỉ đọc trích đoạn; máy dò ảnh vẫn chưa ai chấm (mục 27).
