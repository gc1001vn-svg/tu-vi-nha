# LUẬN CHỈ TAY — nguồn từng ý, cách ghép câu, số đo (viết lại 09/11/2026)

Kế hoạch: `docs/ke-hoach/2026-11-02-chi-tay.md` (bản đầu), `docs/ke-hoach/2026-11-09-loi-giai-chi-tay-nguon.md` (viết lại). Lời app
Claude soạn mới (luật 6), không chép sách; câu trích dưới đây là **nguyên văn ngắn** từ sách hết bản quyền (để đối chiếu, không hiện
trên app). Khung ô, máy dò, AI: **QUY_UOC mục 27, 45–50**. Bảng luật cũ từng ô (`GIAI` trong `src/loi/chiTay.ts`) vẫn gửi AI kèm mức tin.

## 1. Sách đã đọc (tên in đậm = tên ghi cuối câu trên app)

| Tên | Sách, bản | Đọc | Mức kiểm |
|---|---|---|---|
| **Cheiro** | Cheiro (W. J. Warner, mất 1936), *Cheiro's Language of the Hand*, bản in 1898 (archive.org `cheiroslanguageo00chei_1`); *Palmistry for All* (`palmistryforall00cheigoog`) | 28/10, **09/11** chương III–XI | nguyên văn, chữ máy nhận dạng — trích câu đọc chắc, ghi trang sách |
| **Benham** | W. G. Benham (mất 1944), *The Laws of Scientific Hand Reading*, 1900 (archive.org `in.ernet.dli.2015.200302`) | 28/10, **09/11** phần II chương III, V–VII, X | như trên |
| **Saint-Germain** | C. de Saint-Germain, *Practical Palmistry*, 1897 (archive.org `practicalpalmist00sain`) | 02/11, 09/11 tr. 119–120 | như trên |
| **Toàn Biên** | *Thần Tướng Toàn Biên* (Minh), trong *Cổ Kim Đồ Thư Tập Thành* q.640, Wikisource | 28/10 | nguyên văn chữ Hán (QUY_UOC mục 27) |
| Liễu Trang, *Bṛhat Saṃhitā*, Aristotle, Indagine, Desbarrolles, báo Nhật – Hàn | xem QUY_UOC mục 27, bản 02/11 của file này (git) | 28/10, 02/11 | không còn ý nào trên app dựa riêng vào các nguồn này |

Chưa đọc được (09/11): *Ma Y Thần Tướng* (Wikisource giới hạn lượt tra API); Heron-Allen, Frith, St. Hill đã tải về máy ảo nhưng chưa
đọc. Sách tướng tay Việt cổ: chưa tìm thấy (02/11).

## 2. Cách ghép câu

- Mỗi câu một ý, ghi sách cuối câu: **"theo X"** — sách X nói đúng ý đó (kể cả đúng cặp ô, vd Cheiro tr. 88 "extremely long and
  straight"); **"ghép ý X"** — sách nói từng phần, app ghép lại theo hai lời dặn của chính sách: Cheiro tr. 73 "A single sign in itself
  only shows the tendency; when, however, the sign is repeated by other lines, the danger is then a certainty" (dấu lặp ở đường khác
  thì chắc hơn) và Benham tr. 400 "When you have acquired the habit and way of thinking combinations out, you can throw books away".
- Hầu hết câu dựa vào ≥ 2 ô (dáng × độ dài đường trí; đầu đường trí × điểm đầu đường sự nghiệp; độ dài × chỗ đứt đường tình; vòng
  đường đời × độ dài đường tình; độ dài × vòng đường đời; điểm đầu × nét đường sự nghiệp; chỗ đứt × nét…).
- **Rõ / mờ trên ảnh** (máy đo theo sáng, nét ảnh): chỉ dùng khi so các đường với nhau — Benham tr. 362: "If all the lines are deep …
  and some one line is found much less clearly cut and deep than the rest, then the quality which that line indicates is the weakest
  point. Look for proportion constantly". Cả ba đường cùng mờ → chỉ báo "có thể do ánh sáng" (tr. 362: các đường như nhau thì không
  đường nào trội).
- **Câu kết**: mảng mạnh nhất / cần giữ nhất (sức bền, đầu óc, tình cảm, công việc). Dấu: đường đời, đường trí dài +1, ngắn −1
  (Benham tr. 425, 473); vòng rộng +0,5, ôm sát −0,5 (Cheiro tr. 85, Benham tr. 470–472); đường tình dài +0,5, ngắn −0,5 (Cheiro tr.
  97–99); đường sự nghiệp rõ +1, mọc từ cổ tay +0,5 (Benham tr. 539, Cheiro tr. 103); đứt −1 (Cheiro tr. 76, Benham tr. 366–368); một
  đường đậm hơn / mờ hơn hẳn hai đường kia ±0,25 (chỉ phân định khi các dấu khác bằng nhau). Chỉ tay ngang không chấm (các nước đọc
  trái ngược). Bỏ ngưỡng "bàn tay thuận / cần tự bồi đắp" (02/11) — lời kết đó chung chung, rõ / mờ trên ảnh nặng quá.

## 3. Bảng nguồn từng giá trị ô

Cột "Lời app" là ý chính (câu đầy đủ ở `src/loi/chiTayLuanLoi.ts`). Trang theo bản quét ghi ở mục 1.

| Ô = giá trị | Lời app | Sách, trang — nguyên văn |
|---|---|---|
| `life.seen = clear` | so với hai đường kia: đậm hơn hẳn → ít lo nghĩ; ba đường rõ, liền → nền tốt | Benham tr. 475 "If the Life line be deep and all other lines thin or nervous, the subject will go through life with less worry"; tr. 473 "more ability to throw off worry and remain calm"; Toàn Biên "三紋瑩淨，無紋破者，福祿之相"; Benham tr. 363 "while they may have many difficulties to encounter, overcome them" |
| `life.seen = faint` | mờ hơn hẳn hai đường kia → chỗ yếu nhất (không phải ốm yếu) | Benham tr. 362 (trên); tr. 475 "The thin line does not mean that the subject is necessarily delicate or sickly" |
| `life.seen = none` | chụp lại — hiếm ai không có | Benham tr. 469 "few cases will be found where none is present … you will in nearly every case discover a remnant of it" |
| `life.length = long` | sức bền giữ được lâu | Benham tr. 473 "When the line is found strong, good, and long … the strong constitution will uphold that life"; Cheiro tr. 80 "long, narrow, and deep … good health, and vitality" |
| `life.length = medium` | không dấu riêng; đi theo vòng đường đời | (sách không bàn riêng mức vừa) |
| `life.length = short` | sức dồi dào không kéo dài, phải chia sức; đường trí tốt đỡ được | Benham tr. 473 "the sooner will the subject have to depend upon a careful handling of his forces"; Saint-Germain tr. 119 "the life may be still sustained by a good line of Head" |
| `life.arc = wide` | nhiều sinh lực; ấm áp, rộng rãi | Benham tr. 472 "ardent, full of desire and warmth, passionate, generous, sympathetic … strong vitality"; Cheiro tr. 85 "a sign of good physical strength" |
| `life.arc = narrow` | sức vóc không dồi dào; kín, ít hăng hái | Cheiro tr. 85 "health is not so robust"; Benham tr. 470–471 "the subject is cold, unsympathetic, lacks … desire" (app nói nhẹ: kín, ít hăng hái) |
| `life.broken = true` | một quãng phải chậm lại; đứt trên nét đậm nhẹ hơn trên nét mờ | Benham tr. 492 "A break occurring in a deep, strong line is less serious than one which appears in a broad and shallow or chained line" |
| `life.broken = false` | vào câu "ba đường rõ và liền" | Toàn Biên "三紋瑩淨，無紋破者，福祿之相" |
| `head.seen = clear` | so với đường tình: đậm hơn → khi lý và tình giằng co thì lý thắng | Cheiro tr. 89 "the head will completely rule the heart, if that line be the strongest, and vice versa"; Benham tr. 362 |
| `head.seen = faint` | như trên, ngược lại; đứt + mờ → dễ đổi ý | Cheiro tr. 89 "made up of little pieces like a chain, it denotes want of fixity of ideas, and indecision" |
| `head.seen = none` | chụp lại; đường trí có thể mọc sau | Benham tr. 387 "I have but once seen the Head line entirely absent … a Head line had appeared in the hand since I last saw it, a period of about a year" |
| `head.length = long` | thẳng: sức nghĩ hơn người, dễ dùng cho riêng mình; cong: tưởng tượng mạnh mà đủ sức nghĩ | Cheiro tr. 88 "extremely long and straight … more than ordinary intellectual power, but is inclined to be selfish in the use of that power"; Benham tr. 426 "more interested in whatever is capable of producing direct results"; tr. 444 "ability as writers of fiction and poetry … no lack of mentality" |
| `head.length = medium` | đi theo dáng | Cheiro tr. 88 (dáng, dưới); Benham tr. 434 |
| `head.length = short` | nghĩ thực, giỏi việc trước mắt; với dáng cong: hai dấu kéo hai ngả | Cheiro tr. 89 "thoroughly material … in things practical he will be quite at home"; Benham tr. 425 "not so 'long headed'"; Cheiro tr. 73 "no single evil mark must be accepted as decisive" |
| `head.shape = straight` | thực tế, cân bằng, khó lay — dễ cứng nhắc | Cheiro tr. 88 "practical common sense and a love of material things"; Benham tr. 434 "the more fixed are the ideas … they want everyone to come to their way of thinking" |
| `head.shape = curved` | thiên việc cần tưởng tượng; không phải viển vông | Cheiro tr. 88 "a leaning toward imaginative work … music, painting, literature, or mechanical invention"; Benham tr. 443 "found on the hands of most sensible, self-contained, practical persons" |
| `head.joined = true` | thận trọng, hay lo, quen hỏi ý người khác, tự quyết muộn; có tài vẫn tự kìm | Cheiro tr. 88 "excess of caution; even clever people with this mark rein themselves down too tightly"; Benham tr. 429 "The longer the Head line is tied to the Life line the less self-confidence … the more he relies upon the advice of others"; Saint-Germain tr. 120 "Life guided by reason and prudence" |
| `head.joined = false` | tự tin, tự lập, tự quyết sớm; nên ngủ một đêm trước việc lớn | Cheiro tr. 90 "splendid energy and self-confidence … would do well to sleep on their decisions"; Benham tr. 429 "the sooner the line separates from the Life line, the younger was the subject when he began to think for himself"; tr. 431 "does not ask advice, he is likely to commit grave errors" |
| `head.broken = true` | lúc hăng lúc nản, việc dễ dở dang; nét đậm thì nối lại được | Toàn Biên "紋生斷續，易勤易懶", "紋雖好而久破者，皆為缺陷無成之相"; Benham tr. 367–368 "the Current may skip over the small break … serious, but not insurmountable" |
| `head.broken = false` | vào câu "ba đường rõ và liền" | Toàn Biên (trên) |
| `heart.seen = clear` | so với đường trí: đậm hơn → tình thường thắng | Cheiro tr. 89; Benham tr. 362 |
| `heart.seen = faint` | như trên, ngược lại | Benham tr. 403 "Do not make the mistake of calling a Heart line thin … unless it is thin, while the other lines are well marked" |
| `heart.seen = none` | một đường ngang duy nhất thì coi là đường trí | Benham tr. 425 "such a single line is the former [Head], and it is the Heart line which is absent" |
| `heart.length = long` | lý tưởng, chung thủy, chọn người kỹ; vỡ mộng thì hụt hẫng lâu | Cheiro tr. 97 "the highest type of love … firm, strong, and reliable in his affections"; tr. 98–99 "when their idols fall … the shock to their pride is so great"; Benham tr. 389 "love is an adoration" |
| `heart.length = medium` | điềm tĩnh mà sâu, thực tế | Cheiro tr. 99 "a calm but deeper nature in matters of love"; Benham tr. 389 "common-sense, practical, 'middle ground' … not carried away with sentiment" |
| `heart.length = short` | nặng tình mà ít bày tỏ, dễ nghĩ cho mình | Cheiro tr. 99 "more or less selfish in satisfying his affections; in home life he is never so expressive or demonstrative" |
| `heart.broken = true` | có lần thất vọng trong tình cảm | Cheiro tr. 100 "Breaks in the line tell of disappointment in affection" |
| `heart.broken = false` | đi cùng độ dài (câu "… liền") | Toàn Biên "三紋瑩淨，無紋破者" |
| `fate.seen = clear` | việc có hướng; cùng điểm đầu (dưới) | Benham tr. 539 "The deep line of Saturn is the most favorable line to possess"; Toàn Biên "豎理直貫上指者，百謀皆遂" |
| `fate.seen = faint` | phải gắng nhiều hơn người nét đậm | Benham tr. 539 "will have to exert himself more to bring forth great results than a subject with a deep line" |
| `fate.seen = none` | nhiều người tự lập từ tay trắng không có đường này; phải gắng đều | Benham tr. 534 "absent in the hands of many successful people … 'self-made men'"; tr. 536 "The absence of the line shows that constant effort is needed" |
| `fate.start = wrist` | tự tay dựng nghiệp | Toàn Biên "紋自坎宮不斷直上…平地發福，白手成家"; Cheiro tr. 103 "rises from the wrist and proceeds straight up … extreme good fortune and success"; Benham tr. 535 "success in life largely by his own efforts" |
| `fate.start = life` | có người thân đỡ, rõ thì thành nhờ tài mình; mờ thì tuổi trẻ phải theo ý gia đình | Cheiro tr. 103 "from that point on is strong, success and riches will be won by personal merit; but if … tied down … the early portion of the subject's life will be sacrificed to the wishes of parents or relatives"; Benham tr. 535 "near relatives will assist him greatly"; Toàn Biên "自艮上生一紋直上者，受祖考之福蔭" |
| `fate.start = middle` | nửa đầu đời vất vả, thời tốt từ chỗ đường mọc | Cheiro tr. 104 "if it goes on well up the hand, all difficulties will be surmounted … own energy, perseverance, and determination"; Benham tr. 536 "His best period will begin at the time the line starts" |
| `fate.broken = true` | có lần đổi hẳn hướng làm ăn; nét mảnh: lên xuống nhiều lần | Benham tr. 543 "these breaks indicate an entire change in the course of a subject's life-work"; Cheiro tr. 105 "if the second portion of the line begin before the other leaves off … more in accordance with the subject's own wishes"; Toàn Biên "一斷一續，一成一敗" |
| `fate.broken = false` | đi bền một hướng | Toàn Biên "紋自坎宮不斷直上" |

Chỉ tay ngang: Cheiro, *Palmistry for All* tr. 29–30 "greater intensity of purpose than any other, but I have never found it a very
happy mark to possess … intensely lonely … seldom found these people successful, unless when acting alone"; nằm chỗ đường trí →
"head and mentality and very little heart", sát gốc ngón → "more intensity of feeling". Không chấm điểm (mục 4).

## 4. Chỗ các sách vênh — cách chốt

| Chỗ vênh | Các ý | App chốt |
|---|---|---|
| Không có đường sự nghiệp | Cheiro tr. 105: thường vẫn thành công nhưng sống "vegetable kind of existence" · Benham tr. 534: bác lối cũ ("negative existence … cannot be correct"), gặp ở người tự lập từ tay trắng | theo Benham (ông dẫn quan sát, bác ý cũ); câu ghi "sách cũ cho là đời nhạt, Benham bác ý đó" |
| Sự nghiệp tách từ đường đời | Cheiro: tuổi trẻ phải chiều ý gia đình (khi bám sát đường đời) / thành nhờ tài mình (khi đi lên mạnh) · Benham, Toàn Biên: được người thân, ông cha đỡ | rõ → "người thân đỡ, rồi thành nhờ tài mình"; mờ → "tuổi trẻ phải theo ý gia đình" (ghép ý) |
| Chỉ tay ngang | Cheiro: dồn chí, cô độc · Benham: coi là đường trí, đường tình vắng · Trung Hoa xưa chê (chưa chắc đúng đường này), Nhật khen (02/11) | không chấm; lời Cheiro, kèm ý chỗ nằm của đường |
| Đường trí cong | Tây cũ: dấu bệnh tâm trí · Cheiro, Benham tr. 443: tưởng tượng, gặp ở người tỉnh táo | theo Cheiro, Benham |
| Đường đời ngắn | Cheiro tr. 85, Saint-Germain: đời ngắn · Benham tr. 473: quãng sức đầy ngắn hơn, phải biết dùng sức | theo Benham; không phán thọ yểu (luật cứng) |

Không đưa vào lời: đoán chết, bệnh, tai nạn, vô sinh (Cheiro tr. 80 "broken in both hands it generally signifies death"; tr. 89
"early death"; Benham tr. 425 "the life of the subject is short"; tr. 470–471 "barrenness").

## 5. Số đo (`tests/LuanChiTay.test.ts`, 3.000 bàn tay giả: ba đường chính rõ / mờ chia đôi, ô khác chia đều, chỉ tay ngang 5 %)

| Thước | Bản 02/11 | Bản 09/11 | Ngưỡng |
|---|---|---|---|
| Câu luận ghi sách trong bảng | 0 % | 100 % | 100 % |
| Lời giải có cặp ý chọi nhau (bảng 8 cặp trong test) | 78 % | 0 % | 0 |
| Hai bàn tay ngẫu nhiên trùng câu (Jaccard) | 21 % | 8,5 % | ≤ 15 % |
| Câu (trừ câu dặn cố định) gặp ở > 30 % bàn tay | 23 | 0 | 0 |
| Số câu khác nhau trên 3.000 tay | 70 | 315 | — |
| Câu dựa vào ≥ 2 ô mỗi lời giải | ít nhất 1, trung bình 2,1 | ít nhất 6, trung bình 10 | ≥ 3 |
| Lật rõ ↔ mờ cả ba đường đổi kết luận | 68 % (mức kết) | 17 % (mảng mạnh / cần giữ) | ≤ 20 % |

Chưa chắc: bàn tay giả chia đều chỉ là thước gần đúng (tay thật ít đứt hơn); "ghép ý" là app suy theo lời dặn của sách, không phải sách
nói đúng cặp đó; Cheiro, Benham cùng dòng sách Tây cuối thế kỷ 19 nên "nhiều sách cùng nói" không có nghĩa là đúng; chưa có nghiên cứu
nào cho thấy chỉ tay báo trước tính cách, vận mệnh (QUY_UOC mục 27).
