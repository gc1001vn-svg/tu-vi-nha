# Chỉ tay: lời giải cụ thể hơn, tra thêm sách, ghi nguồn (09/11/2026)

- Anh (09/11): "Đã chụp nhìn được vân tay ok. Có diễn giải những diễn giải ko tốt xem lại các nguồn".
- Hỏi: chưa tốt ở chỗ nào → Đáp: "Chung chung. Một số cái tôi đọc ko thấy hợp lý nên tra thêm nguồn". Hỏi: phần nào → Đáp: cả
  hai (lời giải app in sẵn + đoạn AI). Hỏi: xem lại nguồn theo hướng nào → Đáp: đọc thêm sách, ghi rõ nguồn.
- Hỏi: gật kế hoạch → Đáp (anh, 09/11): "Gật, làm".
- Claude đọc lại 09/11 (bàn tay mẫu "Right Hand Palm"): khuyên chọi nhau ("đường trí cong — hợp việc sáng tạo" cạnh "đường trí mờ —
  nên chọn việc làm bằng tay chân"); còn câu "Máy và ô tự chọn…" dù đã bỏ ô; "rõ / mờ" máy đo trên ảnh (theo sáng, nét) lại chấm
  ±1 như tính chất bàn tay → ảnh tối bị chê "mờ" cả ba đường. Số đo chung chung (2.000 bàn tay giả): cả bộ chỉ có **71 câu**, mỗi
  đặc điểm một câu soạn sẵn; hai tay bất kỳ trùng **24 %** câu; **24 câu** gặp ở > 30 % bàn tay.
- Kho máy ảo vào được: archive.org (sách Tây cổ bản tự do), Wikisource tiếng Trung. Chặn: Gutenberg, ctext, GRETIL.

Việc: lời giải chỉ tay (app + dữ liệu gửi AI) nói riêng cho từng bàn tay, mỗi ý có sách đỡ và ghi nguồn; bỏ ý không có sách, ý chọi nhau.
Xong là khi: (1) mỗi câu lời giải ghi nguồn ngắn ("theo Cheiro", "Thần Tướng Toàn Biên"…), test bắt 100 % câu có nguồn trong bảng;
  (2) bảng nguồn từng giá trị ô (`docs/LUAN_CHI_TAY.md`) — mỗi giá trị ≥ 1 sách đọc nguyên văn, ghi trang / mục; (3) bớt chung chung:
  hai tay ngẫu nhiên trùng ≤ 15 % câu (nay 24 %), không câu nào (trừ câu dặn cố định) gặp ở > 30 % bàn tay, mỗi lời giải ≥ 3 câu
  ghép từ ≥ 2 mục; (4) 0 lời giải chứa cặp câu chọi nhau (bảng cặp trong test); (5) "rõ / mờ" trên ảnh không chấm nặng, lời ghi
  "nét trên ảnh"; (6) dữ liệu AI kèm nguồn từng ý, đo AI thật 3 bàn tay nếu máy ảo có khoá Groq; (7) anh đọc 3 lời giải mẫu và gật.

Cách đo (dựng trước): `tests/LuanChiTay.test.ts` thêm: nguồn từng câu, cặp câu chọi, độ trùng giữa bàn tay giả, câu ghép; chạy bản
  hiện nay làm nền (số trên), rồi đo bản sửa. 3 lời giải mẫu (3 bàn tay khác nhau) in vào báo cáo cho anh đọc.

Phương án A (đề xuất) · ~2 phiên: đọc thêm sách gốc bản tự do — archive.org: Cheiro *Language of the Hand* (1894), Benham (1900,
  phần các đường), Heron-Allen *Manual of Cheirosophy* (1885), d'Arpentigny / Heron-Allen *Science of the Hand* (1886), Frith (1890s),
  đối chiếu Indagine, Desbarrolles, Saint-Germain đã đọc; Wikisource: *Thần Tướng Toàn Biên*, *Ma Y Thần Tướng* (phần chưởng văn) nếu
  có → bảng nguồn từng giá trị ô → viết lại lời chốt: câu ghép nhiều mục (vd trí dài + cong + tách đời; đời ngắn + trí tốt — sách bảo
  bù được), ghi nguồn cuối câu, bỏ câu không có sách; "rõ / mờ" giảm trọng số. Lời Claude soạn mới, không chép sách (luật 6).
  Rủi ro: sách Tây cổ nhiều câu đoán bệnh, chết (luật cấm) → bỏ; sách vênh nhau → chốt như cách mục 34; chữ máy nhận dạng sách cổ
  lỗi → chỉ lấy câu đọc chắc; câu ghép nhiều làm lời giải dài → trần độ dài.
Phương án B: không đọc thêm, chỉ viết lại câu hiện có cho cụ thể, bỏ câu chọi · ~1 phiên. Rủi ro: trái ý anh (tra thêm nguồn).
Phương án C: để AI viết diễn giải từ sách · rủi ro: AI bịa, trái luật 6 (AI chỉ đọc số máy tính).
  Vì sao A: đúng ý anh; mỗi ý truy được về sách; đo được.

Giả sử A hỏng rồi — ba lý do:
- Sách cũng chung chung → câu vẫn na ná: đo độ trùng giữa bàn tay, thêm câu ghép (sách Tây hay luận kết hợp: đường trí với đời, tình).
- Ghi nguồn mà hiểu sai ý sách → mỗi ý trích nguyên văn ngắn (sách tự do) trong `docs/LUAN_CHI_TAY.md` để anh / người sau đối chiếu.
- AI vẫn chung chung → dữ liệu gửi AI có câu ghép + nguồn, dặn AI bám mục riêng của bàn tay; đo lại bằng 3 bàn tay mẫu.

Vịt cao su 09/11: Gemini không trả lời (quá 2,5 phút) — Claude tự phản biện: hạ độ trùng bằng cách đổi chữ cho khác là gian →
  câu ghép nào cũng phải có sách luận đúng cặp đó (≤ ~15 câu ghép, mỗi câu một nguồn); bàn tay giả chia đều chỉ là thước gần đúng.
Lùi bằng: `git revert` commit gộp `main` của việc này.
KHÔNG làm: đổi máy dò; thêm ô mới (gò tay, ngón, hình bàn tay — sách coi trọng nhưng máy chưa đo); đoán bệnh, chết, tuổi thọ.
Cần anh trả lời: gật A? (nhớ câu nào thấy vô lý thì chép 1–2 câu — không bắt buộc).

Kết quả 09/11 (QUY_UOC mục 50, bảng nguồn `docs/LUAN_CHI_TAY.md`): (1) 100 % câu ghi sách; (2) 38 giá trị ô đều có dòng nguyên văn
  + trang (Cheiro, Benham, Saint-Germain, Toàn Biên); (3) trùng 21 → 8,5 %, câu > 30 % bàn tay 23 → 0, câu ghép ≥ 6 / lời giải;
  (4) cặp câu chọi 78 % → 0; (5) rõ / mờ chỉ so các đường với nhau, lật cả ba đổi kết luận 68 → 17 %; (7) chờ anh đọc 3 lời giải mẫu.
- Đổi so kế hoạch: "câu ghép phải có sách luận đúng cặp" → hai loại ghi rõ trên app: "theo X" (sách nói đúng ý) và "ghép ý X" (sách nói
  từng phần, app ghép theo lời dặn Cheiro tr. 73, Benham tr. 400); bỏ mục "Ý nghĩa từng mục" (câu tóm từng ô, chọi với lời giải);
  trần độ dài dữ liệu AI 7.000 → 7.500 ký tự (ca xấu nhất 7.300; vẫn dưới 8.000 token / phút).
- (6) AI thật 09/11, Groq gpt-oss-120b, 3 khung giả, bản cũ → mới: đủ 4 mục 3/3 → 2/3 (1 lời viết tiêu đề "**## …**"); nhắc sách 0 →
  20 lần (2/3 lời); tên bịa 0 → 0; AI dùng câu ghép của app (vd "lý tưởng nhưng có chỗ đứt → thất vọng khi người yêu không như mong
  đợi") nhưng vẫn chép luật từng ô chung chung ("Đường tình rõ, sâu → tướng tốt") và gắn sai nhãn mức tin — vì lời dặn bắt mỗi dòng
  dự đoán mở bằng mức tin của luật từng ô. Chưa sửa lời dặn đó (khu AI phiên khác đang sửa): đề xuất bước sau.
