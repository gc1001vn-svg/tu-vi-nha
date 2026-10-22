# Quy ước tính toán dùng chung
File này chốt cách tính dùng chung cho mọi môn (âm lịch, tử vi, bát tự, xem ngày, phong thủy, chiêm tinh, thần số học), để không môn nào tự chọn một kiểu.
Người đọc: Claude các phiên sau. Đọc mục liên quan trước khi viết mã một môn; muốn làm khác thì sửa file này trước, kèm nguồn.
Luật: chỗ các trường phái vênh nhau thì làm thành **một tuỳ chọn có mặc định** (bảng cuối file). Chuẩn cuối của tử vi là lá số Altuvi anh gửi, không phải thư viện.
Tra 14/10/2026. Cột "Đã kiểm": **máy** = đọc mã hoặc chạy thử thư viện trong máy ảo; **web** = đoạn trích kết quả tìm kiếm (máy ảo chặn mở trang gốc). Ký hiệu A, M…, W… xem mục "Nguồn".
## 0. Nguyên tắc chung
- Lịch âm luôn tính theo +7 (thuật toán Hồ Ngọc Đức, `@tuquet/lunar`) cho mọi năm [W13]. Hồ sơ lưu ngày dương + giờ đồng hồ + nơi sinh; ngày âm chỉ là kết quả tính ra.
- Mốc thiên văn (sóc, tiết khí, Lập Xuân) thì so bằng thời khắc tuyệt đối; can chi ngày, chi giờ, ngày âm thì lấy theo đồng hồ +7 (đã đổi múi giờ, mục 7). `lunar-typescript` và `sxtwl` trả giờ tiết theo Bắc Kinh (+8): phải trừ 1 giờ, và đừng đưa giờ +8 vào để lấy can chi ngày (23:30 ở VN là 00:30 hôm sau ở Bắc Kinh) [M4, M5]. Ví dụ: Lập Xuân 2013 là 04/02 00:13 giờ Bắc Kinh, tức 03/02 23:13 giờ VN; báo VN ghi ngày 3/2 [W6].
- Kết quả nào dùng tuỳ chọn khác mặc định thì ghi rõ tuỳ chọn đó ngay trên màn hình.
## 1. Ranh năm: Tết hay Lập Xuân
| Môn | Mặc định | Tuỳ chọn khác | Vì sao chọn mặc định | Nguồn | Đã kiểm |
|---|---|---|---|---|---|
| Tử vi: lá số, lưu niên, đại/tiểu hạn | Tết (mùng 1 Giêng, lịch +7) | — (`iztro` có `yearDivide:'exact'` = Lập Xuân, không dùng) | Altuvi ca E (02/02/2001: sau Tết, trước Lập Xuân) ra năm Tân Tỵ | A, M2, M3, W1, W3 | máy+web |
| Bát tự: trụ năm, lưu niên | Lập Xuân, đúng thời khắc (+7) | theo cả ngày Lập Xuân (chỉ dùng khi so với `sxtwl`) | mọi nguồn cùng một ý | M4, M5, W1, W2, W3 | máy+web |
| Cửu tinh/phi tinh năm | Lập Xuân, đúng thời khắc | theo ngày Lập Xuân; theo Tết (`getYearNineStar(2)`, `(1)`) | Huyền Không đổi năm ở Lập Xuân | M4, W1, W2, W6 | máy+web |
| Cung phi Bát trạch | Lập Xuân, đúng thời khắc | Tết | 3 trang phong thủy tính theo tiết khí; phái Tết thì chưa thấy trang nào ghi rõ | W3, W4, W5 | web · **câu hỏi 3** |
| Kim Lâu, Hoang Ốc, Tam Tai | Tết: Kim Lâu, Hoang Ốc theo tuổi mụ (mục 3); Tam Tai theo chi năm sinh và chi năm xem | Lập Xuân: chưa thấy nguồn | các trang đều tính theo tuổi mụ, năm âm | W20, NGUON_MO | web |
| Sao hạn Cửu Diệu + 8 hạn | Tết (tuổi mụ) | — | "tuổi cúng lễ, viết sớ vẫn theo năm Tết" [W3] | W3, W21 | web |
| Con giáp hiển thị, tuổi xung/hợp, mệnh nạp âm năm sinh | Tết | — (màn bát tự, phong thủy ghi thêm con giáp theo Lập Xuân khi hai cái khác nhau) | cách hiểu phổ thông ở VN (Bính Ngọ bắt đầu 17/02/2026) | W3, W19, M4 | máy+web |
| Xem ngày | can chi ngày theo ngày dương; năm in trên lịch theo Tết; thần sát năm (Thái Tuế, Tam Sát…) theo Lập Xuân, **chưa chắc** | — | `getYearPositionTaiSui` mặc định Lập Xuân; chưa có nguồn thứ hai | M4 | máy |
| Chiêm tinh | không dùng năm âm; mọi mốc theo giờ UTC | — | — | — | — |
| Thần số học: năm cá nhân | 01/01 | sinh nhật | phần đông đổi số ngày 01/01 | W15 | web |
## 2. Ranh tháng: tháng âm (theo sóc) hay tháng tiết
| Môn | Mặc định | Tuỳ chọn khác | Vì sao | Nguồn | Đã kiểm |
|---|---|---|---|---|---|
| Tử vi: tháng sinh, lưu nguyệt | tháng âm theo sóc (+7) | — | Altuvi ca B (sinh 30/11 âm), ca C (tháng nhuận) | A, M2, M3, W3 | máy+web |
| Bát tự: trụ tháng, tuổi khởi vận | 12 tiết (Lập Xuân, Kinh Trập, Thanh Minh…), đúng thời khắc +7 | theo cả ngày tiết (`sxtwl`) | mọi nguồn cùng một ý | M4, M5, W17 | máy+web |
| Cửu tinh tháng | tháng tiết, đúng thời khắc | theo ngày tiết (`getMonthNineStar` mặc định) | Huyền Không theo tiết | M4, W2 (chỉ thấy ghi bàn tháng có giờ bắt đầu) | máy |
| Xem ngày: 12 trực, hoàng/hắc đạo ngày, thần sát theo tháng | **tháng âm** như lịch Việt (anh chốt 19/10) | tháng tiết (ngày giao tiết thuộc tháng mới — Thông Thư) | `getZhiXing`, `getDayTianShen` tính theo tiết; Thông Thư lấy chi tháng theo tiết, sang tiết thì tính lại | M4, W22 | máy+web; **lịch Việt trên mạng theo tháng âm** (19/10, baohatinh, chogia, baolamdong, xemlicham: 10/02/2026 Mãn + Kim Đường Hoàng Đạo, 10/03/2026 Chấp, 08/10/2026 Phá, 07/11/2023 Nguy) → anh chốt tháng âm 19/10 |
| Xem ngày: nên/kiêng (宜忌), cát thần/hung sát | như 12 trực: tháng âm (`thangXemNgay`) | tháng tiết giờ +7 | thư viện lấy tháng tiết theo ngày giao tiết giờ Bắc Kinh (`getMonthInGanZhi`, `getMonthZhiIndex`); app lệch đúng 102 ngày tiết rơi 23:xx giờ VN. Nên/kiêng, sao là hệ hoàng lịch Trung Hoa — lịch Việt trên mạng có sao khác (Thiên Quan, Thụ Tử, Lôi Công…), app ghi rõ | M4, qmrl888.com, wannianli.tianqi.com | máy+web |
| Can chi tháng in trên lịch (màn "Hôm nay") | **tháng âm**: tháng Giêng năm Ất Sửu = Mậu Dần (tính từ can năm âm + số tháng; tháng nhuận dùng can chi tháng trước) | — | Ảnh anh chụp 19/10: 21/01/1985 (trước Lập Xuân) lịch Việt ghi tháng Mậu Dần; `getMonthInGanZhi` ra Đinh Sửu (theo tiết) → không dùng hàm thư viện cho dòng này | ảnh | máy |
| Xem ngày: ngày kiêng ghi theo ngày âm (Tam Nương 3, 7, 13, 18, 22, 27; Nguyệt Kỵ 5, 14, 23) | tháng âm | — | quy tắc vốn ghi theo ngày âm | W18 | web |

Ngày thử để chốt dòng 12 trực (máy, `lunar-typescript`). Ngày 10/02/2026 (23/12 âm): theo tiết là trực Trừ, ngày hắc đạo; theo tháng âm là trực Mãn, ngày hoàng đạo. Ngày 10/03/2026 (22/1 âm): theo tiết là trực Định; theo tháng âm là trực Chấp.
## 3. Tuổi mụ
- **Tuổi mụ = năm âm của ngày xem − năm âm của ngày sinh + 1.** Cả hai năm đều tính theo Tết, lịch +7. Không dùng "tuổi dương + 1" (sai với người sinh trước Tết). Ví dụ, xem ngày 14/10/2026: người sinh 20/01/2001 (trước Tết 24/01/2001, nên năm âm là 2000) được 27 tuổi mụ; người sinh 02/02/2001 được 26.
- Dùng cho Kim Lâu, Hoang Ốc, sao hạn, tiểu hạn tử vi và tuổi hiển thị. Tuỳ chọn khác: đổi tuổi ở sinh nhật âm (`iztro` `ageDivide:'birthday'`); chưa thấy nguồn Việt nên không làm.
- Nguồn: W7 (tăng 1 tuổi mỗi Tết; năm hiện tại − năm sinh + 1), W21, M3 (`nominalAge`). Vênh: vài trang (mytour, hellobacsi) đoán theo tháng dương lúc sinh; bỏ cách đó. Đã kiểm: máy+web.
## 4. Giờ Tý (23:00–00:59)
Tý muộn (晚子时/夜子时) là 23:00–23:59; Tý sớm (早子时) là 00:00–00:59. W8b gọi ngược hai tên này, nên đọc nguồn tiếng Anh phải để ý. Với người sinh giờ Tý muộn có 3 phái:

| Phái | Ngày (ngày âm, can chi ngày) | Can giờ | Ai dùng | Đã kiểm |
|---|---|---|---|---|
| A. Đổi ngày lúc 23:00 | ngày hôm sau | theo ngày hôm sau | `iztro` mặc định (`dayDivide:'forward'`), `tuvi-mcp-server`, `bazi_core` mặc định (`nextDay`), `lunar-typescript` `setSect(1)`; W9 gọi là cách chủ lưu, W10 gọi là cổ pháp | máy+web |
| B. Chia đôi, can giờ mượn ngày sau | giữ ngày hôm đó | theo ngày hôm sau | `lunar-typescript` mặc định (sect 2), `sxtwl` mặc định (`isZaoWanZiShi`), W8 mặc định | máy+web |
| C. Chia đôi, can giờ theo ngày đó | giữ ngày hôm đó | theo ngày hôm đó | `bazi_core` `currentDay`, `iztro` `dayDivide:'current'`, W8 "midnight" | máy+web |

- Ví dụ (máy) sinh 14/10/2026 lúc 23:30. Phái A: ngày Nhâm Tuất, giờ Canh Tý. Phái B: ngày Tân Dậu, giờ Canh Tý. Phái C: ngày Tân Dậu, giờ Mậu Tý.
- **Mặc định: phái A cho cả tử vi và bát tự**, vì một người chỉ có một ngày sinh (anh chốt 15/10). Tử vi chỉ có A hoặc C, vì không dùng can giờ. Khi gọi `lunar-typescript` thì đặt `setSect(1)`; khi so với `sxtwl` thì đưa ngày hôm sau.
- Altuvi: ô giờ có vẻ chọn theo 12 chi (mẫu ghi "Tỵ (9-11h)"), nên lấy đúng ngày nhập, không phân biệt sinh 23 giờ với sinh 0 giờ. Chưa tìm thấy nguồn tiếng Việt bàn rõ chuyện này, nên **chưa chắc**.
- Xem ngày: can chi ngày in theo ngày dương (đổi lúc 00:00); giờ hoàng đạo của khung 23:00–23:59 xét theo ngày hôm sau (`getTimeTianShen`), **chưa chắc**.
## 5. Tháng nhuận
| Môn | Mặc định | Tuỳ chọn khác | Nguồn | Đã kiểm |
|---|---|---|---|---|
| Tử vi: tháng sinh | cả tháng nhuận tính như tháng trước, giữ số tháng (ca C: 25/2 nhuận tính là tháng 2) | chia ở ngày 15: từ 15 trở về trước tính tháng đó, sau 15 tính tháng sau (`iztro` `fixLeap` mặc định; W17); hoặc cả tháng tính tháng sau (W17) | A, M2, M3, W17 | máy+web |
| Tử vi: lưu nguyệt trong năm có tháng nhuận | như dòng trên (cả tháng nhuận là tháng trước), **chưa chắc** (Altuvi chưa đo) | chia ở ngày 15 (`iztro`, hocvienlyso) — mục 16 | M3, W40 | máy+web |
| Bát tự, cửu tinh, 12 trực, hoàng đạo | không ảnh hưởng (tính theo tiết) | — | M4, W17 | máy+web |
| Ngày kiêng theo ngày âm | vẫn áp trong tháng nhuận, theo số ngày (em suy ra, **chưa chắc**) | — | W18 | web |

Tuổi mụ, Kim Lâu, sao hạn, cung phi tính theo năm nên không bị tháng nhuận ảnh hưởng. Ô nhập ngày âm phải có dấu "nhuận". Tháng nhuận là tháng không có trung khí, mang số của tháng trước [W13].
## 6. Giờ mặt trời thực (真太阳时)
- **Mặc định tắt cho mọi môn**: dùng giờ đồng hồ đã đổi về +7 (mục 7). Tuỳ chọn bật được cho tử vi và bát tự, theo công thức: giờ mặt trời = giờ +7 + 4 phút × (kinh độ − 105°) + phương trình thời gian [W16].
- Vì sao tắt: Altuvi không có ô nơi sinh (ca D lấy đúng giờ nhập); `ansaotuvi`, `iztro` chỉ nhận chi giờ, không nhận kinh độ; `bazi_core` mặc định dùng giờ đồng hồ (`clockMode: civil`); tài liệu tiếng Trung coi đây là chuyện tuỳ phái [A, M2, M3, M6, W16]. Đã kiểm: máy+web.
- Mức lệch ở VN (máy, `astronomy-engine`): phương trình thời gian năm 2026 chạy từ −14,2 phút (11/02) tới +16,4 phút (03/11). Cộng thêm phần do kinh độ: Hà Nội −11…+20 phút, TP.HCM −7…+23, Đà Nẵng −1…+29, Nha Trang +3…+33. Khi đang tắt mà giờ mặt trời rơi sang chi giờ khác thì báo như mục 8. Chiêm tinh không dùng mục này: luôn tính theo giờ UTC và toạ độ nơi sinh.
## 7. Múi giờ lịch sử Việt Nam
| Từ (giờ địa phương) | Miền Bắc | Miền Nam (phía nam vĩ tuyến 17, từ 1955) |
|---|---|---|
| trước 01/05/1911 | +7:03 (giờ Hà Nội); từ 01/07/1906 là +7:06:30 (giờ đài Phù Liễn) | +7:06:30 |
| 01/05/1911 | +7 | +7 |
| 31/12/1942 23:00 | +8 | +8 |
| 14/03/1945 23:00 | +9 (giờ Nhật) | +9 |
| 02/09/1945 00:00 | +7 (lùi 2 giờ) | +7 |
| 01/04/1947 | +8 ở vùng Pháp giữ (có Hà Nội); vùng kháng chiến có thể vẫn +7, **chưa chắc** | +8 (vùng kháng chiến: như cột Bắc) |
| 10/1954 (chưa rõ ngày) | +7 | |
| 01/07/1955 01:00 | | +7 |
| 31/12/1959 23:00 | | +8 |
| 13/06/1975 00:00 | | +7 (lùi về 23:00 ngày 12/06); từ đây cả nước +7 |

- Nguồn cột Nam: M8 (`Intl` của Node 22, tzdata 2025b, in ra đúng các mốc trên). Nguồn cột Bắc: file tz `backzone` (`Asia/Hanoi`), dẫn sách Trần Tiến Bình "Lịch Việt Nam thế kỷ XX–XXI" và Công báo các năm 1945, 1955, 1959. Thêm W11 (Nam +8 từ 01/01/1960 theo sắc lệnh 362-TTP tới 13/06/1975; Bắc +7 từ 02/09/1945) và W12 (QĐ 121-CP ngày 08/08/1967: nước ta ở múi giờ 7, kinh tuyến giữa 105°Đ). Đã kiểm: máy+web. Vênh: W11 không nhắc chuyện Bắc +8 năm 1947–1954; một thư trên danh sách tz (2019) nói Bắc +8 tới 1967, nhưng đó là nguồn lẻ nên không theo.
- **Nhập**: giờ đồng hồ ghi lúc sinh + tỉnh nơi sinh. **Mặc định đổi về +7 theo bảng trên** rồi mới tính (anh chốt 15/10). Tuỳ chọn "giữ nguyên giờ nhập" như Altuvi (ca D: sinh ở Sài Gòn năm 1970, khi đó là +8, Altuvi không lùi 1 giờ). Chiêm tinh luôn đổi sang UTC theo bảng.
- Bảng VN **viết cứng trong `src/loi/`**, vì: `Intl` không có `Asia/Hanoi` (máy: Node 22 báo lỗi); `Asia/Ho_Chi_Minh` là giờ miền Nam, dùng cho Hà Nội 1960–1975 sẽ ra +8, sai (tz gợi ý `Asia/Bangkok` cho miền Bắc từ 1970); dữ liệu tz của VN vẫn còn được sửa (năm 2024 sửa mốc 1955). Nơi sinh ngoài VN thì lớp giao diện lấy độ lệch từ `Intl` rồi truyền vào lõi (lõi cấm dùng locale).
- Giờ bị lặp hoặc bị bỏ lúc đổi múi (vd 22:00–24:00 ngày 01/09/1945 lặp hai lần; 23:00–24:00 ngày 31/12/1959 không tồn tại) thì hiện cả hai (mục 8).
- Ngày âm ghi trong giấy tờ cũ có thể theo lịch +8. Miền Bắc tính lịch theo múi 7 từ 1968 [W11, W12]. Miền Nam ăn Tết Mậu Thân ngày 30/01/1968 [W14], đúng với lịch +8; lịch +7 ra 29/01 [M9]. Lịch +7 và lịch +8 khác nhau ở 539/13.879 ngày (1930–1967) và 120/2.720 ngày (01/1968–06/1975) [M9]. Vì vậy lấy ngày dương làm gốc; ai chỉ có ngày âm trước các mốc đó mà hai lịch ra khác nhau thì app hỏi lại.
## 8. Giờ sinh sát ranh (±15 phút)
Giờ sinh (đã đổi về +7) cách một ranh không quá 15 phút thì tính cả hai bên và hiện cả hai kết quả, ghi rõ là ranh nào. Không có tuỳ chọn khác (kế hoạch tổng đã chốt). Các ranh lấy từ mục 1–7, nguồn ở các mục đó. Thần số học chỉ dùng ngày dương nên không áp dụng.

| Ranh | Mốc (giờ +7) | Môn bị ảnh hưởng |
|---|---|---|
| Giờ | 01:00, 03:00, …, 23:00 | tử vi (Mệnh, Thân, các sao an theo giờ), bát tự (trụ giờ) |
| Ngày | 23:00 (phái A) hoặc 00:00 (phái B, C) | tử vi (ngày âm; sang mùng 1 thì đổi cả tháng, qua giao thừa thì đổi cả năm), bát tự (trụ ngày) |
| Tiết | thời khắc 12 tiết | bát tự (trụ tháng, tuổi khởi vận), cửu tinh tháng |
| Lập Xuân | thời khắc Lập Xuân | bát tự (trụ năm), cung phi, cửu tinh năm |
| Tết | đầu ngày mùng 1 Giêng (23:00 đêm giao thừa nếu theo phái A) | tử vi, tuổi mụ, Kim Lâu, Hoang Ốc, Tam Tai, sao hạn, con giáp |
| Chiêm tinh | lúc Mặt Trời, Mặt Trăng, cung Mọc đổi cung | chiêm tinh |
| Múi giờ | giờ lặp hoặc bỏ lúc đổi múi; miền Bắc 1947–1954 (+7 hay +8) | mọi môn có dùng giờ |
## 9. Không rõ giờ sinh
| Môn | Cách làm |
|---|---|
| Âm lịch, can chi năm/tháng/ngày, nạp âm, con giáp, tuổi mụ, Kim Lâu, Hoang Ốc, Tam Tai, sao hạn, cung phi, hợp tuổi, xem ngày theo tuổi, thần số học, nhịp sinh học | Tính đủ. Riêng ngày sinh trùng ngày Tết, ngày Lập Xuân hoặc ngày giao tiết thì hiện 2 phương án |
| Bát tự | Có 3 trụ năm, tháng, ngày; trụ giờ để "?"; thập thần, vượng suy chỉ xét 3 trụ; tuổi khởi vận lấy giờ 12:00 và ghi "có thể lệch tới ±2 tháng" |
| Tử vi | Không lập được một lá duy nhất (Mệnh, Thân, cục và phần lớn sao an theo giờ), nên hiện 12 phương án theo 12 giờ cho người dùng chọn |
| Chiêm tinh | Tính lúc 12:00: Mặt Trời và các hành tinh dùng được; điểm nào đổi cung trong ngày (thường là Mặt Trăng) thì ghi cả hai cung; bỏ cung Mọc và các nhà (mục 23) |
| Kinh Dịch, bói Kiều, tarot, xin xăm, tướng mặt, chỉ tay | Không cần giờ sinh |

Cách làm trong mã (đợt 1, `src/loi/hoSo.ts`): không rõ giờ thì thử 00:00 và 22:59 của ngày ghi (giờ +7), ra khác nhau thì hiện cả hai — bắt được ngày Lập Xuân, ngày giao tiết. Không thử 23:00 trở đi: theo phái A (mục 4) mọi ngày đều sang ngày hôm sau, ngày sinh nào cũng thành 2 phương án; nên người sinh đêm 30 Tết sau 23:00 mà không rõ giờ thì app vẫn lấy năm cũ (**chưa chắc**, chưa thấy nguồn bàn).

Nguồn (máy): `ansaotuvi` an Mệnh, Thân từ tháng + giờ (`DiaBan.cungChu`); `iztro` bắt buộc có `timeIndex`; `lunar-typescript` tính khởi vận theo quy ước 3 ngày tới tiết = 1 năm, 6 giờ = 1 tháng.
## 10. Chữ (đã chốt; áp cho chữ hiện trong app và bảng dữ liệu)
- Unicode NFC. Dấu thanh kiểu cũ như Altuvi và sách tử vi: Hỏa, Thủy, Hóa, Hòa (không viết Hoả, Thuỷ, Hoá, Hoà). Viết "Tỵ", "Kỷ", "Kỵ" (không viết Tị, Kỉ, Kị).
- Tên riêng viết hoa mỗi chữ: can chi ("Giáp Tý"), sao và thần sát ("Thiên Đức"), tiết khí ("Lập Xuân"), trực, tú, nạp âm ("Hải Trung Kim"). Việc nên/kiêng và lời giải chỉ viết hoa chữ đầu ("Cúng tế").
- Ngày viết dạng dd/mm/yyyy, giờ viết dạng 24h (07:05).
## 11. Xem ngày theo tuổi, màu, số (màn "Hôm nay")
- **Tuổi**: so chi ngày với chi năm sinh (năm âm theo Tết, mục 1). Lục xung (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi) là xung, nên tránh việc lớn; lục hợp (Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi) và tam hợp (Thân Tý Thìn, Dần Ngọ Tuất, Tỵ Dậu Sửu, Hợi Mão Mùi) là hợp; còn lại bình thường. Chưa xét hình, hại, phá, can khắc. Nguồn: W23, W24. Đã kiểm: web.
- **Hành ngày** = hành của nạp âm ngày (mytour ghi ngày Mậu Dần hành Thổ, Đinh Hợi hành Thổ — đúng nạp âm) [W25]. App ghi quan hệ hành ngày với hành mệnh: ngày sinh mệnh, mệnh sinh ngày, ngày khắc mệnh, mệnh khắc ngày, cùng hành. Lời giải Claude soạn lại.
- **Màu theo ngày: không làm.** Cùng một ngày, mytour và báo Lâm Đồng gợi ý màu khác nhau cho cùng một mệnh [W25, W26]. App chỉ hiện **màu hợp mệnh**: màu bản mệnh + màu của hành sinh mệnh; màu kỵ là màu của hành khắc mệnh [W27]. Màu từng hành (các trang khớp): Kim trắng, xám, bạc · Mộc xanh lá · Thủy đen, xanh dương · Hỏa đỏ, hồng, tím, cam · Thổ vàng, nâu.
- **Số hợp mệnh** (Lạc Thư): Thủy 0, 1 · Thổ 2, 5, 8 · Mộc 3, 4 · Kim 6, 7 · Hỏa 9; số hợp = số bản mệnh + số hành sinh mệnh (mytour: Kim hợp 6, 7 và 2, 5, 8; fptshop: Mộc hợp 0, 1, 3, 4) [W28]. Vênh: có trang gán số theo Hà Đồ (Kim 4, 9…) — không theo. Đã kiểm: web.
- **Mệnh** dùng cho màu, số: nạp âm năm sinh, năm theo Tết (gumac, fptshop gọi "mệnh Kim/Mộc" theo nạp âm) [W27, W28]. Tuỳ chọn khác: hành của cung phi (mytour, báo Lâm Đồng dùng Nhất Bạch, Nhị Hắc…) [W25, W26].
- **Tuổi xung ngày** = một can chi chính xung như hoàng lịch (chi lục xung chi ngày, can bị can ngày khắc; `getDayChongDesc`). Trang Việt mỗi trang ghi thêm một kiểu (xemlicham ngày Bính Dần: Canh Thân, Nhâm Thân; quantrimang ngày Giáp Tý: Mậu Ngọ, Nhâm Ngọ, Canh Dần, Canh Thân) — chưa có 2 nguồn cùng cách nên chưa làm tuỳ chọn. **Giờ tốt hợp tuổi** = giờ hoàng đạo bỏ giờ lục xung chi năm sinh. **Hướng sát** = `getDaySha` (Thân Tý Thìn → Nam, Dần Ngọ Tuất → Bắc, Tỵ Dậu Sửu → Đông, Hợi Mão Mùi → Tây; qmrl888, tianqi), chưa có nguồn Việt.
- **Tháng tiết của ngày** theo giờ +7: `lunar-typescript` lấy ngày giao tiết theo giờ Bắc Kinh, nên khi tiết rơi 23:00–23:59 giờ VN thì thư viện chậm một ngày. Máy (19/10): 1900–2100 có 102 ngày như vậy; ngoài 102 ngày đó trực, thần trực nhật của app khớp thư viện (so 9.579 ngày, `tests/HomNay.test.ts`).
## 12. Bát tự (`src/loi/batTu.ts`, đo 19/10)
- Trụ năm, tháng: `lunar-typescript` với giờ +7 cộng 1 giờ (`get…Exact`); trụ ngày theo phái A (mục 4); chi giờ theo đồng hồ +7, can giờ theo ngày đó.
- Đại vận: `getYun(giới tính, 2)` dựng từ giờ +8, đếm phút tới tiết (4.320 phút = 1 năm, 360 phút = 1 tháng, 12 phút = 1 ngày — đúng "3 ngày = 1 năm, 6 giờ = 1 tháng" ở mục 9); sect 1 làm tròn theo canh giờ Bắc Kinh nên không dùng. Tuổi vận ghi là tuổi mụ của năm bắt đầu vận (năm dương bắt đầu − năm âm sinh + 1), **chưa chắc** (chưa có nguồn Việt; thư viện tính theo năm dương sinh, người sinh trước Tết lệch 1 tuổi).
- Ngũ hành đếm 8 chữ (hành can + hành chính của chi), không cộng tàng can (trọng số tàng can mỗi phái một khác).
- Không rõ giờ: trụ và khởi vận tính lúc 12:00 (thẻ chính `hoSo.ts` lấy 00:00 — ngày Lập Xuân rơi trước 12:00 thì khối bát tự và cung phi có thể khác, cả hai đều hiện phương án kia). Đã kiểm: máy (`sxtwl` 2.700 ca, `NGUON_MO`).
## 13. Thần số học, cung hoàng đạo, nhịp sinh học (`src/loi/soHoc.ts`, chỉ dùng ngày dương)
- Số chủ đạo: cộng mọi chữ số dd/mm/yyyy, còn >11 thì cộng tiếp; giữ 10, 11, 22/4, 33/6; không có số 1 [W29]. Vênh: fptshop, hellobacsi chỉ kê 2–11 và 22/4 (tổng 33 về 6); mytour, thuviennhadat giữ 33 → app ghi "33/6". Tuỳ chọn `rutGonRieng`: rút gọn ngày, tháng, năm riêng rồi cộng (trang nước ngoài) [W30].
- Năm cá nhân = ngày + tháng sinh + năm xem, rút về 1–9 (đổi 01/01, mục 1); tháng cá nhân = năm cá nhân + tháng. Số ngày sinh: rút gọn ngày, giữ 11, 22. Lưới 3×3 bỏ số 0; mũi tên chưa làm (các trang đặt tên vênh) [W31].
- Cung hoàng đạo: tới 22/10 tra bảng ngày cố định của `lunar-typescript` (vênh 1 ngày ở 21/6, 23/10, 22/11 [W32]); nay lấy Mặt Trời tính thật ở khối Chiêm tinh (mục 23). Bảng Hán–Việt `cungHoangDao` giữ vì thư viện vẫn trả chữ đó.
- Nhịp sinh học: sin(2πt/T), T = 23, 28, 33 ngày, t = số ngày từ ngày sinh; ghi rõ không có cơ sở khoa học [W33].
## 14. Năm nay, hướng Bát trạch, tuổi hợp (`src/loi/namNay.ts`, `batTrach.ts`, `tuoiHop.ts`, đo 19/10)
- Năm xem = năm âm (Tết) của ngày xem; tuổi mụ theo mục 3.
- **Sao Cửu Diệu**: tuổi mụ chia 9, nam nữ khác vòng. **8 hạn**: (số chục + số đơn vị của tuổi mụ) chia 8 — không chia 8 thẳng (89 và 90 cùng Huỳnh Tuyền); nam dư 1 Huỳnh Tuyền … dư 0 Diêm Vương; nữ dư 1 Tán Tận, 2 Thiên Tinh, 3 Ngũ Mộ, 4 Tam Kheo, 5 Huỳnh Tuyền, 6 Diêm Vương, 7 Địa Võng, 0 Thiên La. Khớp bảng báo năm 2026: 36 năm sinh × 2 giới, sao + hạn 144/144 ô; năm 2025: 8/8 [W34].
- **Kim Lâu**: tuổi mụ chia 9 dư 1, 3, 6, 8 (Thân, Thê, Tử, Súc); cách "cộng chữ số" ra trùng hệt nên không làm tuỳ chọn; biến thể cửu cung (khởi Cấn) chưa làm. **Hoang Ốc**: (chục + đơn vị) chia 6, 10 tuổi ở Nhất Cát, mỗi chục quay về cung của chục (`hoangOc = theoChuc`); tuỳ chọn `demTiep` (đếm liền từ 10 tuổi); bỏ hai biến thể trái quy tắc "20 tuổi Nhì Nghi" (tuổi mụ chia 6; bảng cách 9 năm) [W35].
- Dưới 10 tuổi mụ: hạn, Kim Lâu, Hoang Ốc ghi "Chưa xét" (các bảng bắt đầu từ 10 tuổi) — **chưa chắc**.
- Đoạn giải dài sao, hạn (20/10): tháng kỵ, ngày cúng hằng tháng chỉ ghi khi ≥2 trang khớp (La Hầu tháng Giêng, Bảy, ngày 8 · Kế Đô tháng Ba, Chín, ngày 18 · Thái Bạch tháng Năm, ngày 15 · Thái Dương tháng Sáu, Mười tốt, ngày 27 · Thái Âm tháng Chín tốt, ngày 26 · Thổ Tú ngày 19 · Thủy Diệu tháng Tư, Tám, ngày 21). Vênh thì ghi "đa số trang" (Thái Âm kỵ tháng Mười Một hay Mười, Vân Hớn tháng Hai, Tám hay Tư, Tám) hoặc bỏ (ngày cúng Mộc Đức, Vân Hớn) [W41]. Cập nhật 20/10: bộ *Ngọc Hạp Ký* (Đạo tạng đời Minh, DZ1481) ghi ngày cúng 9 sao — 7 ngày trên khớp, thêm Mộc Đức 25, Vân Hớn 29 (app ghi kèm "các trang Việt ghi khác nhau") [W45]; số đèn trong sách (La Hầu 9, Thổ 5, Thủy 7, Kim 8, Nhật 12, Hỏa 15, Kế Đô 20, Nguyệt 7, Mộc 20) app không ghi.
- **Đối chiếu ngoài Việt Nam (tra 20/10)** [W43]: vòng sao nam trùng bảng Cửu Diệu theo tuổi mụ (数え年) của chùa Nhật **9/9** (1 La Hầu 羅睺, 2 Thổ Tú 土曜, 3 Thủy Diệu 水曜, 4 Thái Bạch 金曜, 5 Thái Dương 日曜, 6 Vân Hớn 火曜, 7 Kế Đô 計都, 8 Thái Âm 月曜, 9 Mộc Đức 木曜) — `tests/NamNay.test.ts`. Chùa Nhật không chia nam nữ; **vòng nữ có trong bộ *Ngọc Hạp Ký*** (諸神聖誕日玉匣記等集, Đạo tạng đời Minh, phần 法師選擇記 DZ1481, hậu tự 弘治元年 1488) — bảng 「看男女值年星辰命之屬」 11–99 tuổi: nam khớp app 86/89, nữ 83/89; 9 ô lệch đều lẫn chữ 太陽/太隂 hoặc 水/木, trái chu kỳ 9 của chính bảng (`tests/NamNay.test.ts`) [W45]. Bản *Ngọc Hạp Ký* phổ thông trên Wikisource (「看男女值年星辰屬命之圖」) cùng bảng — cùng dòng văn bản (mục lục có 法師選擇記), không phải nguồn độc lập. Hàn Quốc (직성, encykorea) tính vòng nữ khác: nữ 10 tuổi gặp Mộc, 11 La Hầu — vòng nam lùi một năm, khớp vòng nữ Việt 0/9 → không theo. 太上玄靈北斗本命延生經注 (Đạo tạng DZ0752): 「一羅睢二土宿三水星四金星五太陽六火星七計都八太陰九木星」 — một vòng, trùng vòng nam. Mốc năm: có trang Nhật lấy Lập Xuân (saijigoyomi), chùa Koyasan Bắc California lấy Tết âm (29/1/2025–16/2/2026) → app giữ Tết (mục 1). Tốt/xấu ở Nhật vênh giữa các chùa: La Hầu, Kế Đô 大凶, Thái Dương 大吉 như ta; Vân Hớn 凶 hoặc 大凶 (ta: trung tính); Thái Âm 大吉 hoặc 中吉. **Kinh gốc (đọc nguyên văn 20/10, bản XML CBETA; sửa câu "chưa thấy bảng tuổi" ghi trước đó cùng ngày)** [W45]: 梵天火羅九曜 (T1311, đề 一行, ghi niên đại tới 咸通十五年 = 874) có bảng 行年 đủ 9 sao — tuổi 1, 10, 19… La Hầu (大凶); 2… Thổ (大凶); 3… Thủy/北辰 (少吉); 4… Kim (少凶); 5… Nhật (大吉); 6… Hỏa/熒惑 (凶); 7… Kế Đô (凶); 8… Nguyệt (thân bài: 大吉); 9… Mộc (大吉) — trùng vòng nam **9/9**. 七曜攘災決 (T1308, 金俱吒 soạn) mục 九執至行年法 cùng thứ tự (Hỏa 大凶; La Hầu, Thổ, Kế Đô 凶; còn lại kể cả Kim 吉) và ghi "La Hầu, Thổ: nam nặng nữ nhẹ; Kế Đô, Hỏa: nữ nặng nam nhẹ" — gốc câu "La Hầu kỵ nam, Kế Đô kỵ nữ". Hai kinh không có vòng riêng cho nữ (vòng nữ: *Ngọc Hạp Ký*, xem trên); 宿曜經 (T1299) không có 行年. **8 hạn** (tra 20/10) [W45]: chưa thấy bộ 8 tên ở nguồn ngoài VN (Ngọc Hạp Ký bản Đạo tạng cũng không có); 赤松子章曆 (Đạo tạng DZ615, sách văn sớ): 「戍亥爲天羅辰巳爲地網子午爲中宫寅申爲算盡丑未爲五墓」 — 4 tên đặt trên 12 chi, không thành vòng tuổi; 選擇要略 (李純之, Triều Tiên thế kỷ 15) mục 入宮催屍: 「男一十起黃泉順行，零年亦順行。女一十起香爐逆行，零年亦逆行」 — 8 cung, đếm theo chục y như app (nam 10 tuổi ở Huỳnh Tuyền) nhưng 7 cung kia khác tên (如意, 火把, 路口, 旒旐, 棺木, 貴人, 香爐) và dùng chọn năm đóng hòm → **chưa đủ chứng cứ gọi là gốc**. Cách chia 3 tốt, 3 xấu, 3 trung tính (Thổ, Thủy, Vân Hớn trung tính) là riêng dân gian VN → app giữ (khớp bảng báo; **anh chốt 20/10**, mục "Anh đã quyết" số 6), câu "Về nguồn" ghi chỗ khác. Thủy Diệu: nhiều trang gọi phúc lộc tinh (tốt — hoatieu, didongviet, đúng như hai kinh), ngaydep, thuvienphapluat xếp trung tính → app giữ trung tính, lời giải ghi cả hai; không làm tuỳ chọn (chỉ đổi màu chữ). Lập trường: Thích Nhật Từ (Học viện PGVN) và Thứ trưởng Trịnh Thị Thủy (2019): giáo lý nhà Phật không có sao tốt, sao xấu; công văn 73/VHCS-NSVH (Cục Văn hóa cơ sở, 18/02/2019) và 591/BVHTTDL-VHCS (20/02/2019) đề nghị chấn chỉnh dâng sao giải hạn biến tướng, trục lợi → câu "Về nguồn" dưới đoạn giải (`NGUON_SAO_HAN`).
- **Tam Tai** theo nhóm tam hợp của chi năm sinh. **Thái Tuế**: trùng (Trị), xung, hình (tam hình + tự hình), hại, phá — ghi đủ các quan hệ cùng lúc (2026 Ngọ: Trị + Hình) [W35]. Đối chiếu nguồn Trung Hoa, Hàn 20/10 [W44]: **Thái Tuế 2026** app ra 4 tuổi (Ngọ trị + tự hình, Tý xung, Sửu hại, Mão phá) — khớp đa số báo, thầy số Đài Loan, Hồng Kông; trong kết quả tìm không đền nào (Hoàng Đại Tiên, Xa Công, Viên Huyền, Bạch Vân Quán, Hành Thiên Cung) công bố danh sách. Tuổi thứ năm vênh: 關世華 cho Mão, Dậu phá; 楊登嵙 cho Mão, Sửu "thiên xung" (偏沖); UDN cho Mão, Dậu thiên xung; vài báo đưa Dậu thay Sửu → mỗi thầy một khác nên **không theo, không làm tuỳ chọn**. *Tam Mệnh Thông Hội* (Minh, Wikisource, quyển 2, đọc nguyên văn [W45]): lục hại 子未 丑午 寅巳 卯辰 申亥 酉戌, tam hình, tương hình 子卯, tự hình 辰午酉亥 khớp app; quyển 2 không có mục "phá" (bảng phá theo trang dân gian). Đền (Hành Thiên Cung) an Thái Tuế trong tháng Giêng âm (tốt nhất mùng 1, mùng 9, rằm), tiễn 24 tháng Chạp; Lập Xuân chỉ thấy ở báo, thầy số → khớp app lấy Tết. **Tam Tai**: Hàn Quốc (삼재) cùng quy tắc — bách khoa Hàn (encykorea, đọc nguyên văn [W45]) ghi đủ 4 nhóm khớp app, gọi 삼재 là "từ dân gian" (민간용어), năm đầu (들삼재) xấu nhất rồi năm hai (누울삼재), năm ba (날삼재) — app không chia nặng nhẹ; bài ghi "9년마다" nhưng chính quy tắc 12 chi trong bài cho chu kỳ 12 năm (3 năm Tam Tai + 9 năm nghỉ). 2026 nhóm Hợi Mão Mùi năm thứ 2 — khớp app. Lập trường: Bộ Nội chính Đài Loan xếp an Thái Tuế vào nghi thức tín ngưỡng (60 vị thần năm); báo Phật giáo Hàn (불교신문): chữ "tam tai" gốc kinh Phật, còn cách tính 3 năm theo tuổi là bói toán; chùa Jogyesa gọi lễ giải Tam Tai là phong tục. App vốn ghi "dân gian" ở hai dòng này nên không sửa chữ.
- **Bát trạch**: Đông/Tây tứ mệnh, 8 hướng theo phép biến hào Du Niên (64/64 ô khớp nguồn); cung phi theo Lập Xuân (mục 1), sinh giữa Lập Xuân và Tết thì ghi thêm "nếu tính theo Tết thì là …". **Tuổi hợp/kỵ**: tam hợp, lục hợp, tứ hành xung, lục xung, lục hại — cùng công thức `theoTuoi` (144 cặp chi) [W36].
- Đã kiểm: web (trích đoạn tìm kiếm, chưa mở trang gốc); URL từng dòng bảng báo trong comment `tests/NamNay.test.ts`.
## 15. Mệnh chủ, Thân chủ (tử vi, tra 19/10 — phần này trên Altuvi phải trả tiền, anh nhờ tự tra)
| Cách | Mệnh chủ | Thân chủ | Nguồn |
|---|---|---|---|
| **Toàn Thư (mặc định `menhChuTheo = cungMenh`)** | theo **địa chi cung Mệnh**: Tý Tham Lang · Sửu, Hợi Cự Môn · Dần, Tuất Lộc Tồn · Mão, Dậu Văn Khúc · Thìn, Thân Liêm Trinh · Tỵ, Mùi Vũ Khúc · Ngọ Phá Quân | theo **chi năm sinh**: Tý, Ngọ "火鈴" · Sửu, Mùi Thiên Tướng · Dần, Thân Thiên Lương · Mão, Dậu Thiên Đồng · Thìn, Tuất Văn Xương · Tỵ, Hợi Thiên Cơ | *Tử Vi Đẩu Số Toàn Thư* quyển 2 (安命主, 安身主); trang Trung Hoa thống nhất; trang Việt: tuvilyso, tracuutuvi, khoahoc.tuvichanco, tuvisaigon [W37, W38] |
| Quản Xuân Thịnh (`menhChuTheo = tuoi`) | theo **chi năm sinh** (cùng bảng 12 chi) — sách lấy ví dụ "người tuổi Hợi, mệnh chủ Cự Môn, Thân chủ Thiên Cơ" | như trên | *Số Tử vi kinh nghiệm* (1950); vài bản ca quyết Trung Hoa (ncc.com.tw) cũng gán Mệnh chủ theo năm [W39] |

- "火鈴" của tuổi Tý, Ngọ: sách Việt và đa số trang Việt tách **Tý Linh Tinh, Ngọ Hỏa Tinh** (app theo); trang Trung Hoa nay ghi Hỏa Tinh cả hai; một trang Việt ghi ngược (Ngọ Linh Tinh). Chưa làm tuỳ chọn.
- `ansaotuvi` dùng bảng theo tuổi nhưng tra bằng số **can** năm (`ThienBan.py`) — sai cả hai cách; chỉ giữ ở phái `ansaotuvi` để so với bản Python. Altuvi theo cách nào: **chưa biết** (phải trả tiền mới xem).
## 16. Lưu niên, lưu nguyệt, lưu nhật (tử vi, `src/loi/tuVi/luuHan.ts`, tra 20/10)
- Năm xem theo Tết (mục 1); tiểu hạn như lá số. Ngày xem là ngày dương hôm nay theo giờ +7 (đổi lúc 00:00), đổi ra ngày âm.
- **9 sao lưu** an như sao gốc nhưng theo can chi năm xem: Lưu Thái Tuế (chi năm xem), Lưu Tang Môn (Thái Tuế thuận 2 cung), Lưu Bạch Hổ (đối Tang Môn), Lưu Lộc Tồn (theo can), Lưu Kình Dương, Lưu Đà La (hai bên Lộc Tồn), Lưu Thiên Mã (theo chi), Lưu Thiên Khốc, Lưu Thiên Hư (từ Ngọ, nghịch/thuận theo chi). Máy: `tuvi-mcp-server` 0.5.0 (7 sao, không có Tang Môn, Bạch Hổ) và `iztro` 2.6.2 (流禄 流羊 流陀 流马, 丧门 白虎 vòng 岁前) khớp 200/200 ca mỗi bên. Web: tuvisonlong, phongthuythanhhoa, lyso.vn (Tang Môn, Bạch Hổ) [W40].
- **Lưu nguyệt (nguyệt hạn)** — anh dặn 20/10 tìm nhiều nguồn tin cậy (Altuvi phải trả tiền). So 6 cách, đọc cả sách gốc:

| Cách | Tháng Giêng của năm xem ở cung nào | Nguồn | App |
|---|---|---|---|
| 1 | cung tiểu hạn, đếm nghịch tới tháng sinh, coi cung đó là giờ Tý đếm thuận tới giờ sinh | *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang 1956) mục 10.4: có 3 cách, "thường người ta hay dùng cách thứ nhất"; hocvienlyso, lyso.vn, viettopreview, horos, phongthuythanhhoa; `tuvi-mcp-server` | **mặc định** `nguyetHanTu = tieuHan` |
| 2 | như cách 1 nhưng đếm **thuận** tới tháng sinh | Tân Biên 10.4 | không làm |
| 3 | chính cung tiểu hạn | Tân Biên 10.4 | không làm |
| 4 Đẩu Quân | cung Lưu Thái Tuế, nghịch tới tháng sinh, thuận tới giờ sinh | *Toàn Thư* quyển 2 安斗君訣; ziweicn, zhihu; lyso.vn ghi là cách Tử Vân; `iztro` | `thaiTue`: app hiện thêm một dòng khi khác cung |
| 5 | cung Dần mọi năm | tuvilyso.net (cách cụ Thiên Lương) | không làm |
| 6 Tiên thiên Đẩu Quân | cung Tý, nghịch tháng sinh, thuận giờ sinh, cố định cả đời | zhihu | không làm |

  Sách Việt gốc và đa số trang Việt theo cách 1; sách Trung Hoa gốc theo cách 4. Không so được Altuvi.
- **Lưu nhật (nhật hạn)**: cung tháng là mùng 1, đếm thuận tới ngày âm đang xem (Tân Biên 10.5; 流日 sách Trung Hoa cùng cách; cả hai thư viện; hocvienlyso, kabala). Lưu thời (Tân Biên 10.6: cung ngày là giờ Tý, đếm thuận) chưa làm. Tháng nhuận khi xem: mục 5 — sách Trung Hoa chia nửa đầu về tháng trước, nửa sau về tháng sau (có phái cho cả tháng về tháng sau), Tân Biên không nói; app theo tháng trước, **chưa chắc**.
- **Sách gốc xác nhận sao lưu:** Tân Biên phần III mục 4 kể đúng 9 sao như app, cách an khớp từng bước; ví dụ trong sách (năm Ất Mùi, năm Tý) thành test `tests/LuuHan.test.ts`.
- **Kết luận hạn tốt/xấu:** Tân Biên phần III mục 1.2 — trong các sao hội về cung hạn (chính cung, hai cung tam hợp, cung đối diện) quá nửa tốt là hạn tốt, quá nửa xấu là hạn xấu (`danhGiaHan`). Tốt/xấu theo bảng sao `ansaotuvi`; sao chính theo độ sáng, Bình không tính.
- Chưa so Altuvi (phần hạn trên Altuvi phải trả tiền). Không làm: lưu thời, tứ hóa lưu niên, lưu đại hạn (Tân Biên III.1.1 có nhắc).
- Đã kiểm: máy (`tests/LuuHan.test.ts`, bảng vàng `tests/vang/luu-han-*.json` sinh bằng `scripts/doi-chieu/luu-han-*`) + web (trích đoạn).
## 17. Bói Kiều (`src/loi/kieu.ts`, tra và soát 20/10)
- **Chữ**: gốc là bản phổ thông chép Wikisource (`congmnguyen/kieu-gpt`; ấn bản gốc chưa rõ, khớp ảnh bản Bùi Kỷ – Trần Trọng Kim
  1927 ở 23/26 câu thử). 480 câu khác một bản độc lập (`tiepvupsu/ebookMLCB`) đem bỏ phiếu **từng chữ** với bản in OCR archive.org:
  243 câu lấy chữ theo bản B (OCR giống B), 214 câu giữ bản gốc, 23 câu không so được thì giữ bản gốc; 16 câu sửa tay (đổi chỗ chữ,
  dấu câu bị đổi thành dấu thanh như "aỉ", "nàọ"). Bảng từng câu: `scripts/doi-chieu/kieu-soat.tsv`. Theo phiếu nên chữ cũ, chữ mới
  lẫn nhau (dầu/dù, đương/đang, Lâm Tri → Lâm Truy).
- **Cách bói**: khấn → mở ngẫu nhiên → đọc câu → tự suy theo việc mình hỏi (Phan Kế Bính gọi là "bói chơi"; Phạm Đan Quế 1991).
  Máy chọn đều một trong 1.627 cặp lục bát (`crypto` ở giao diện), hiện thêm một cặp trước, một cặp sau để đọc ra ý.
  Vênh: khấn ai (Từ Hải, Giác Duyên, Thúy Kiều: Phạm Đan Quế, loigiaihay · Thúy Kiều, Kim Trọng: Phan Kế Bính) → mặc định
  câu thứ nhất; đọc mấy câu (Phan Kế Bính "mấy câu", Phạm Đan Quế 2 câu) → tuỳ chọn `cauKieu`; trang trái/phải, đếm dòng
  thì máy không cần. Không làm: lời giải sẵn từng câu (sách bói Kiều còn bản quyền), bói "3 lần" (không thấy nguồn).
- **21 đoạn**: "Mở đầu" (câu 1–38) + 20 hồi theo mục lục bản Nguyễn Can Mộng 1936; ranh hồi tìm bằng so khớp OCR (lệch 0–2 câu),
  đặt ở câu lục; tên đoạn, tóm tắt Claude soạn lại.

## 18. Kinh Dịch (`src/loi/kinhDich.ts`, tra 20/10)
- **Chữ**: nguyên văn 64 quẻ, 386 hào theo Kanripo KR1a0001, chỉ lấy chữ (bỏ dấu câu người biên tập); 63 chỗ dị văn với bản
  Wikisource giữ theo Kanripo (bản thứ ba theo Kanripo 34 chỗ, Wikisource 10). Nhãn cửu/lục của 384 hào khớp vạch quẻ. Tên Việt =
  tượng quái trên + quái dưới + tên ngắn, 8 quẻ thuần gọi "Thuần …" (vênh: "Càn vi Thiên", "Bát Thuần Càn"); quẻ 20 viết Quán
  (có nơi Quan). Lời giải Claude soạn lại theo nghĩa nguyên văn, không chép bản dịch.
- **Gieo đồng xu**: mỗi hào 3 đồng, mỗi mặt 2 hoặc 3 → tổng 6 lão âm (động) · 7 thiếu dương · 8 thiếu âm · 9 lão dương (động);
  lần đầu là hào 1 (dưới cùng). Máy gieo nên không cần chọn mặt sấp/ngửa tính 3 (nguồn Việt vênh).
- **Đoạn cần đọc** (Chu Hy, 易學啟蒙·考變占): 0 hào động → lời quẻ chủ · 1 → lời hào đó · 2 → hai hào, hào trên chính ·
  3 → lời quẻ chủ và quẻ biến, có hào 1 động thì quẻ chủ chính, không thì quẻ biến chính (前十卦主貞，後十卦主悔) · 4 → hai hào
  tĩnh của quẻ biến, hào dưới chính · 5 → hào tĩnh của quẻ biến · 6 → Càn đọc Dụng Cửu, Khôn đọc Dụng Lục, quẻ khác đọc lời quẻ biến.
  Hai trường hợp 2 và 4 sách tự ghi là suy ra.
- **Mai Hoa theo giờ** (梅花易數 quyển 1): chi năm âm (Tý 1 … Hợi 12) + tháng âm + ngày âm, chia 8 → quái trên (dư 0 là 8;
  Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8); thêm chi giờ (Tý 1 … Hợi 12), chia 8 → quái dưới, chia 6 → hào động
  (dư 0 là 6). Sách không nói, app chọn: năm đổi ở Tết (`namMaiHoa`, cùng lịch với tháng, ngày âm; `meihua-ts-lib` đổi ở Lập
  Xuân) · tháng nhuận lấy số tháng · từ 23 giờ sang ngày sau như mục 4. Quẻ hỗ: hào 2-3-4 làm quái dưới, 3-4-5 làm quái trên;
  quẻ chủ Càn, Khôn lấy hỗ của quẻ biến (乾坤無互，互其變卦 → `hoCanKhon`). Thể/Dụng: quái có hào động là Dụng; luận theo
  體用總訣 (quyển 2).
- **Đo**: 14 ví dụ trong sách khớp 14/14; 300 giờ ngẫu nhiên 1950–2050 so `meihua-ts-lib` (`scripts/doi-chieu/so-mai-hoa.mjs`):
  291 khớp, 4 lệch vì quẻ Càn/Khôn lấy hỗ theo sách, 5 lệch vì thư viện đổi năm ở Lập Xuân, 0 lệch chưa giải thích.
- **Không làm**: Lục hào nạp giáp (lục thân, thế ứng), nhập kết quả gieo tay, Mai Hoa lấy quẻ theo chữ, vật, tiếng.

## 19. Chọn ngày theo việc (`src/loi/chonNgay.ts`, tra 21/10)
- **Nguồn**: 3 agent tra 21/10; trang Việt không mở thẳng được (lỗi DNS), đọc qua **tóm tắt tìm kiếm** → các ca trong
  `tests/ChonNgay.test.ts` là ca của trang lịch theo ngày (xemlicham, lichngaytot, lichvannien) chép qua tóm tắt, chưa ai mở trang
  gốc; mã GitHub (`hungnhat.js`, `buicaoliem/licham`, `vinhicut/2027`, `braverynew/xemngay` — không giấy phép, chỉ đọc quy tắc)
  đọc thẳng. Riêng Khổng Minh có 9 ảnh anh chụp. Mọi bảng theo **tháng âm**; tháng nhuận dùng bảng của tháng cùng số (xemlicham,
  lichngaytot, lichvannien tháng 6 nhuận 2025) [W46].
- **Việc → mục nên/kiêng** của hoàng lịch: cưới hỏi 嫁娶, 納采 · động thổ 動土 · khai trương 開市 · xuất hành 出行 · mua xe 交易,
  納財 (chưa chắc: không nguồn nào có mục riêng).
- **Luật chấm** (Claude đặt, ghi lý do từng ngày): **Tránh** nếu Tam Nương, Nguyệt Kỵ, Dương Công Kỵ, Sát Chủ Dương, Thọ Tử,
  hoặc chi ngày lục xung chi năm sinh. Không Tránh thì **Tốt** khi Hoàng Đạo + lịch ghi nên việc đó + không có lý do xấu (Hắc
  Đạo, lịch ghi kiêng, lịch không ghi nên, Sát Chủ Âm, ngày Khổng Minh xấu khi xuất hành); còn lại **Được**. Lục hợp, tam hợp
  tuổi chỉ ghi thêm. Năm phạm Kim Lâu (cưới hỏi, động thổ), Hoang Ốc (động thổ), Tam Tai (cưới hỏi, động thổ, khai trương)
  báo ở đầu tháng, không đổi mức từng ngày (mục 14). Đếm 2026, không xét tuổi: Tránh 11–15 ngày/tháng, Tốt 0–6.
- **Lịch ghi kiêng** chỉ hạ xuống Được (tuỳ chọn `kiengLich`): so `cnlunar` 0.2.5 (MIT, tự tính theo thần sát) 2.008 ngày
  2024–2029 (`scripts/doi-chieu/so-cnlunar.mjs`), 7 mục, tháng âm cả hai bên: **nên trùng 73,5 %, kiêng trùng 60,9 %**
  (kappa nên 0,15–0,49, kiêng 0,03–0,16 — kiêng gần như ngẫu nhiên); 1.097 lượt một bên ghi nên, bên kia ghi kiêng. cnlunar
  không có mục 動土 (so với 修造). Tháng tiết hay tháng âm đổi < 2 điểm %.
- **Dương Công Kỵ** (13 ngày): 13/1, 11/2, 9/3, 7/4, 5/5, 3/6, **1/7 và 29/7**, 27/8, 25/9, 23/10, 21/11, 19/12 — sách Hoa
  (Baidu, 玉匣記), xemlicham, `hungnhat.js`, `vinhicut`; 13 ngày dương 2026 trùng danh sách báo Hoa. Vênh: tháng 7 lấy 8 và 29
  (lichngaytot theo ngày, ~5 bài Việt) · tháng 2 lấy 12 (3 bài) · tháng 12 xemlicham ghi 22 (3 điểm), lichngaytot 21 (1 điểm) →
  không theo, chưa làm tuỳ chọn.
- **Sát Chủ**: xemlicham tách hai nhãn. **Sát Chủ Âm** (chi ngày theo tháng 1–12: Tỵ, Tý, Mùi, Mão, Thân, Tuất, **Sửu, Hợi**,
  Ngọ, Dậu, Dần, Thìn — lịch theo ngày xemlicham, lichngaytot, lichvannien, 4 mã; ≥10 bài viết đảo tháng 7 Hợi, 8 Sửu, không
  trang theo ngày nào khớp): xemlicham, xemngay ghi kiêng mai táng, thờ cúng; lichvannien ghi "xấu mọi việc" → app chỉ hạ Được.
  **Sát Chủ Dương** (Tý, Sửu, Sửu, Tuất, Thìn, Thìn, Sửu, Thìn, Sửu, Thìn, Mùi, Thìn — ≥6 bài, xemlicham theo ngày): kiêng xây
  dựng, cưới hỏi, buôn bán, mua xe, đi xa → Tránh. Bảng 殺主 của sách Hoa là bảng khác, không ghép được.
- **Thọ Tử** theo **chi ngày** (Tuất, Thìn, Hợi, Tỵ, Tý, Ngọ, Sửu, Mùi, Dần, Thân, Mão, Dậu): xemlicham, lichvannien (31/8/2026
  Đinh Sửu có Thọ Tử), 6 mã, 受死日 sách Hoa, Nhật (Nhật theo tháng tiết). Bản can chi (Bính Tuất, Nhâm Thìn…) chỉ 3–4 bài Việt → không theo.
- **Ngày Khổng Minh**: tháng 1-4-7-10 vòng 6 (Đường Phong, Kim Thổ, Kim Dương, Thuần Dương, Đạo Tặc, Hảo Thương) · 2-5-8-11
  vòng 8 (Thiên Đạo, Thiên Môn, Thiên Đường, Thiên Tài, Thiên Tặc, Thiên Dương, Thiên Hầu, Thiên Thương) · 3-6-9-12 vòng 8
  (**Chu Tước**, Bạch Hổ Đầu, Bạch Hổ Kiếp, Bạch Hổ Túc, Huyền Vũ, Thanh Long Đầu, Thanh Long Kiếp, Thanh Long Túc); mùng 1 là tên
  đầu vòng. Ảnh anh 9/9; phongthuyvuong, lich365, `braverynew/xemngay`, mẫu xemlicham, lichngaytot. Vênh: ngày 30 tháng 2-5-8-11
  là Thiên Thương (xemlicham, lichvannien, xemngay, lich365) hay Thiên Dương theo vòng (phongthuyvuong) → Thiên Thương; ngày 30
  tháng 3-6-9-12 Thanh Long Đầu theo vòng (xemngay, lichvannien) hay Thanh Long Túc (xemlicham, 1 điểm) → theo vòng. Mã
  `WxVision-Upgrade` lệch một ô, không dùng. Tốt/xấu theo mọi trang Việt (không có mức "bình").
- **Giờ Lý Thuần Phong**: khắc 1 = giờ Tý và Ngọ … khắc 6 = Tỵ và Hợi; (ngày âm + tháng âm + khắc − 2) chia 6, dư 1 Đại An,
  2 Tốc Hỷ, 3 Lưu Niên, 4 Xích Khẩu, 5 Tiểu Cát, 0 Tuyệt Lộ — 5 bài dạy cách tính (xemvm, phongthuyvuong, lich365, xemvanmenh,
  osshcmup), báo vietnamnet, hoatieu, lịch theo ngày lichngaytot, lichvannien (khớp 16/16 ca). Một trang (xemlicham) tính theo thứ
  tự Trung Hoa lệch một ô (14/10/2026 giờ Tý: lichvannien Đại An, xemlicham Lưu Niên) → 1 nguồn, không theo (anh quyết 21/10,
  mục "Anh đã quyết" số 7). Đại An, Tốc Hỷ, Tiểu Cát tốt; ba tên còn lại xấu.
- **Hướng**: hỷ thần theo can ngày như hoàng lịch (sách Đặng Xuân Xuyến, mẫu 10 can trên 4 trang). **Tài thần** (sửa cả thẻ
  "Hôm nay"; tuỳ chọn `taiThan`): sách Đặng Xuân Xuyến, lich365, lichngaytot, lichvannien, quantrimang — Giáp Ất Đông Nam,
  Bính Đinh Chính Đông, Mậu Chính Bắc, Kỷ Chính Nam, Canh Tân Tây Nam, Nhâm Chính Tây, Quý Tây Bắc; hoàng lịch Trung Hoa
  (`getDayPositionCaiDesc`, app dùng tới 21/10) khác 8/10 can; một trang (xemlicham) khác sách ở Mậu, Quý → 1 nguồn, không theo.
- **Không làm**: Sát Chủ giờ (hai nguồn vênh), Không Phòng, Ly Sàng (≤1 nguồn), hệ sao Ngọc Hạp đầy đủ, việc ngoài 5 việc.

## 20. La bàn (`src/loi/laBan.ts`, `src/giaoDien/phongThuy.ts`, tra 21/10)
- **24 sơn**, mỗi sơn 15°, Nhâm bắt đầu 337,5°, Tý giữa ở 0°; ba sơn một quẻ Hậu Thiên (Nhâm Tý Quý Khảm · Sửu Cấn Dần Cấn ·
  Giáp Mão Ất Chấn · Thìn Tốn Tỵ Tốn · Bính Ngọ Đinh Ly · Mùi Khôn Thân Khôn · Canh Dậu Tân Đoài · Tuất Càn Hợi Càn). Đúng ranh
  thì thuộc sơn sau (7,5° là Quý); Wikipedia ghi khoảng "352,6–7,5" — chỉ khác 0,1° ở ranh, không làm tuỳ chọn. Ví dụ vnexpress:
  215° là tọa Sửu hướng Mùi — `tests/LaBan.test.ts` [W47].
- **Hướng nhà** = hướng nhìn ra khi đứng ở cửa chính, lưng quay vào nhà; sau lưng là **tọa** (muaban, voh, mytour, trang
  batdongsan wiki). Một trang phân biệt hướng cửa và hướng nhà (có thể khác nhau) — app chỉ đo một số, nhắc đứng ở cửa chính [W47].
- **Bắc từ**: la bàn phong thủy theo bắc từ. `webkitCompassHeading` của iPhone thường được tả là theo bắc từ, **chưa thấy tài
  liệu Apple xác nhận** (tra 21/10) — theo bắc nào thì ở Việt Nam cũng lệch dưới 2° nên app không chỉnh. Độ lệch từ Việt Nam
  tháng 10/2026 theo mô hình WMM-2025 (NOAA, chạy gói `geomagnetism` 0.2.0 Apache-2.0 ở thư mục tạm): Hà Giang −1,8°, Hà Nội
  −1,7°, Đà Nẵng −1,4°, TP HCM −0,6°, Cà Mau −0,4° → app La bàn của iPhone bật "Dùng phương bắc thực" chỉ lệch dưới 2°.
- **Tốt/xấu** của hướng đo: theo Bát trạch (mục 14) với cung phi hồ sơ (năm Lập Xuân) hoặc năm sinh gõ tay.
- **Cảnh báo đo** (Claude đặt, không phải phép phong thủy): cách ranh sơn dưới 3° → nhắc đo lại; sai số máy báo
  (`webkitCompassAccuracy`) quá 15° hay −1 → không kết luận, không cho lưu; máy nghiêng quá 25° → nhắc đặt phẳng; đo 3 chỗ cách
  nhau 1 m, lệch quá 5° là nhiễu (trang batdongsan wiki khuyên đo 3 lần lấy trung bình) [W47].
- **Quyền cảm biến iPhone**: xin ngay trong lúc bấm; bị từ chối hay 3 giây không có số → gõ số độ tay. Safari có thể nhớ lần
  từ chối (diễn đàn Defold, WebKit 269706). **Anh thử iPhone 21/10** (app ở màn hình chính): có hỏi quyền, kim quay, so app La
  bàn của iPhone vài chỗ không lệch độ nào.
- **Lưu**: hồ sơ thêm `huongNha` (độ nguyên 0–359); file sao lưu cũ không có trường vẫn nhập được, sửa hồ sơ giữ nguyên trường.
- Đã kiểm: máy (`tests/LaBan.test.ts`, bảng 24 sơn gõ tay theo nguồn) + Playwright khổ 390×844 với sự kiện la bàn giả (17 ca)
  + web (trích đoạn tìm kiếm, chưa mở trang gốc — máy ảo không mở được các trang này).

## 21. Thước Lỗ Ban (`src/loi/loBan.ts`, tra 21/10)
- **Ba thước**, cung lớn chia đều, lặp theo vòng, đúng ranh thì sang cung sau: **52,2 cm** thông thủy (khoảng lọt lòng: cửa, cửa
  sổ, ô thoáng) 8 cung Quý Nhân, Hiểm Họa, Thiên Tai, Thiên Tài, Nhân Lộc, Cô Độc, Thiên Tặc, Tể Tướng · **42,9 cm** dương trạch
  (khối đặc: bếp, bệ, bậc, đồ đạc) 8 cung Tài, Bệnh, Ly, Nghĩa, Quan, Kiếp (Nạn), Hại, Bản (Mạng) · **38,8 cm** âm phần (đồ thờ,
  mộ) 10 cung Đinh, Hại, Vượng, Khổ, Nghĩa, Quan, Tử, Hưng, Thất, Tài [W48].
- **Tốt**: 42,9 Tài Nghĩa Quan Bản (trang Việt + Đài Loan: 財義官本 chữ đỏ); 38,8 Đinh Vượng Nghĩa Quan Hưng Tài (hai trang Việt).
  52,2: các trang ghi "4 tốt 4 xấu", "đỏ dùng, đen bỏ" nhưng **không trang nào ghi thẳng màu từng cung** — app lấy theo nghĩa tên
  (Quý Nhân, Thiên Tài, Nhân Lộc, Tể Tướng tốt; Hiểm Họa, Thiên Tai, Cô Độc, Thiên Tặc xấu), đúng 4/4.
- **Độ dài vênh**: 52,2 hay 52 cm (batdongsan: 520 mm, cung 65 mm); 38,8 hay 39 cm (mytour); 42,9 hay 46,08 cm (khảo cổ, uptogo)
  → theo số đa số trang và công cụ (52,2 · 42,9 · 38,8), không làm tuỳ chọn. Lệch dồn theo số vòng (2 m trên thước 52 lệch ~8 mm).
- **Không làm cung nhỏ**: 42,9 có tên cung nhỏ cho 6/8 cung (財德 寶庫 六合 迎福…), còn Kiếp, Hại thì cùng bộ chữ 口舌 病臨 死絕 災至
  trang ghi ở thước 42,9, trang ghi ở thước 38,8; 38,8 và 52,2 không trang nào kê cung nhỏ → chưa ô nào đủ 2 nguồn.
- **Công dụng thước** các trang ghi hơi khác (bàn thờ đo 38,8 hay 42,9) → app ghi công dụng, để người dùng xem đúng thước.
- **App Đo của iPhone** (anh hỏi 21/10): web không mở được app Đo (Apple không công bố đường dẫn — diễn đàn lập trình Apple), Safari
  iPhone chưa có WebXR để đo bằng camera (bảng tương thích 5–6/2026) → nối qua chép–dán: app Đo có nút Chép (support.apple.com
  102468); ô số đo nhận "81 cm", "0,81 m", "810 mm" (`docSoDoGo`, `tests/Nhap.test.ts`), nút "Dán từ app Đo". App Đo sai ~1–2 cm,
  3–5 % (SlashGear, TechRadar — Apple không công bố) → số dán cách ranh cung dưới 2 cm thì nhắc đo lại bằng thước dây.
  **Anh thử iPhone 21/10**: chép từ app Đo, bấm "Dán từ app Đo" — chạy ổn.
- Đã kiểm: `tests/LoBan.test.ts` — ranh cung tới 0,1 mm (tính bằng µm nguyên); 5 khoảng cửa trang Việt công bố (voh: rộng 80,8–82,6,
  cao 210,6–214,8, rộng 105,5–109; batdongsan cửa phòng ngủ 80,5–81,8 × 210,8–214,2) nằm trọn một cung tốt thước 52,2; 10 số bàn
  thờ (41, 48, 61, 67, 69, 81, 107, 127, 153, 175 — thuviennhadat, scrapbox) đều cung tốt thước 38,8. Web qua trích đoạn tìm kiếm.

## 22. Phi tinh năm, tháng, hướng kỵ năm (`src/loi/phiTinh.ts`, tra 21/10)
- **Sao giữa**: thư viện `getYearNineStar(3)`, `getMonthNineStar(3)` — đúng thời khắc Lập Xuân, giao tiết (mục 1, 2), xét lúc
  12:00 giờ VN. Đối chiếu công thức tay độc lập: năm = 11 − (năm Lập Xuân mod 9) (như cung phi nam), tháng Dần khởi 8 (năm Tý Ngọ
  Mão Dậu), 5 (Thìn Tuất Sửu Mùi), 2 (Dần Thân Tỵ Hợi), lùi mỗi tháng — khớp 398 ca năm, 2.388 ca tháng 1901–2099.
- **8 sao còn lại** bay thuận theo Lạc Thư: giữa → Tây Bắc → Tây → Đông Bắc → Nam → Bắc → Tây Nam → Đông → Đông Nam; giữa Ngũ Hoàng
  ra ma phương 4 9 2 / 3 5 7 / 8 1 6 (Nam trên). Năm 2026 khớp Tô Dân Phong (hk01) và sina: Nhất Bạch giữa, Ngũ Hoàng Nam, Nhị Hắc
  Tây Bắc, Cửu Tử Đông Nam, Lục Bạch Bắc; đổi năm ở Lập Xuân [W49].
- **Lưới Nam ở trên** (Wikibooks, masterseanchan); anh muốn "theo đa số trang Việt" nhưng không tìm được trang Việt nói rõ —
  **chưa chắc**, mỗi ô ghi tên hướng nên đặt chiều nào cũng không đọc nhầm.
- **Tốt/xấu** từng sao theo thư viện (Huyền Không 吉/凶: 1, 4, 6, 8, 9 tốt). Vận 9 (2024–2043): Cửu Tử vượng, Nhất Bạch sinh khí
  (thuviennhadat, masterseanchan); Bát Bạch "nhiều thầy coi đã thoái khí" — ghi trong lời giải, không đổi màu. Lời giải Claude soạn lại.
- **Hướng kỵ năm**: Thái Tuế = sơn chi năm, Tuế Phá = sơn đối diện, Tam Sát = ba sơn quanh chi đối diện chi vượng của tam hợp (Dần
  Ngọ Tuất → Hợi Tý Sửu, Bắc; Thân Tý Thìn → Nam; Tỵ Dậu Sửu → Đông; Hợi Mão Mùi → Tây — masterseanchan 2027–2029; 2026 "tam sát
  chính Bắc" theo báo cáo CLSA trên Sing Tao). Cafeland ghi 2026 "ba hung sát dồn về Nam" — 1 nguồn, không theo. Thái Tuế "tựa
  lưng được, kỵ quay mặt về" (太歲可座不可向 — chinatimes, taiwannews), vị trí Thái Tuế "nên để yên" (Sing Tao); Tam Sát "không tựa
  lưng, không động thổ" (三煞方不可坐 — một tài liệu, chưa đủ 2 nguồn). Ngũ Hoàng, Nhị Hắc chiếm cả ô (45°), ba sao kia chiếm sơn (15°).
- **Thư viện lệch**: `getYearPositionTaiSui` ghi năm Tuất, Hợi ở 坎 (Bắc); theo 24 sơn (mục 20) Tuất, Hợi thuộc Càn (Tây Bắc) → app
  theo 24 sơn (`tests/PhiTinh.test.ts`). La bàn báo khi hướng hay tọa đo được trùng hướng kỵ năm.
- Đã kiểm: `tests/PhiTinh.test.ts`, Playwright khổ 390×844 đồng hồ cố định 21/10/2026; web qua trích đoạn tìm kiếm.

## 23. Chiêm tinh (`src/loi/chiemTinh.ts`, tra 22/10)
- **Vị trí**: hoàng đạo nhiệt đới, kinh độ biểu kiến địa tâm trên hoàng đạo thật của ngày (như Swiss Ephemeris mặc định), thư viện
  `astronomy-engine` 2.1.19. Nút Bắc thật = nút quỹ đạo Mặt Trăng tức thời (r × v); nút trung bình theo Meeus (47.7); cung Mọc,
  Thiên Đỉnh từ giờ sao và độ nghiêng thật; nghịch hành = kinh độ giảm giữa 12 giờ trước và sau. Đo 22/10: 300 ca 1900–2100, toạ
  độ trong VN, so `pyswisseph` [M11] lệch ≤2′ mọi điểm (thử 1.000 ca: Mặt Trời ≤7″, Mặt Trăng ≤71″, hành tinh ≤21″, cung Mọc,
  Thiên Đỉnh ≤3″, nút ≤50″); cung, nhà, chiều nghịch hành khớp hết. Đối chiếu ngoài: 2.484 lần sóc rơi vào mùng 1 HND (2 ca sóc cách
  nửa đêm <1 phút); Mặt Trời qua 0°, 90°, 180°, 270° năm 2026 đúng giờ trang lịch ±5 phút [W51].
- **Giờ**: đổi ra UTC theo bảng múi giờ lịch sử (mục 7, không theo tuỳ chọn `doiVeGio7`). Giờ sinh ±15 phút, múi giờ chưa chắc:
  xét lại Mặt Trời, Mặt Trăng, cung Mọc (mục 8). Không rõ giờ: tính 12:00, bỏ cung Mọc và nhà, ghi điểm đổi cung trong ngày (mục 9).
- **Nơi sinh**: toạ độ tỉnh lỵ trước 07/2025 (`src/loi/toaDo.ts`, 64 nơi) — GeoNames, 52 nơi so Natural Earth lệch ≤0,08° [M12].
  Tỉnh rộng thì cung Mọc lệch tới ~1° so nơi sinh thật; tỉnh đổi tỉnh lỵ (Lai Châu trước 2004 đặt ở Điện Biên Phủ) chưa xét.
  Sinh nước ngoài: chưa có toạ độ nên bỏ cung Mọc và nhà.
- **Hệ nhà**: Placidus — phổ biến nhất, mặc định của nhiều phần mềm [W50]. Phép lặp tự viết; lưới vĩ độ 8–24° × thiên đỉnh mỗi 1°
  hội tụ hết. Tuỳ chọn `heNha` (Whole Sign) chưa có trong mã.
- **Bắc Giao Điểm**: nút trung bình (anh chốt 22/10: khớp astro-seek, trang anh dùng để so — ghi "Node (M)"; astromitra cũng
  dùng); kerykeion mặc định nút thật. Hai cách khác cung 31/1.000 ca → tuỳ chọn `nutBac` [W50]. So ảnh astro-seek anh chụp 22/10
  (cùng giờ, toạ độ): 10 thiên thể, nút, cung Mọc, Thiên Đỉnh khớp từng phút, đỉnh nhà 3 và 9 lệch 1′. Nam Giao Điểm luôn ở cung đối diện, không vẽ riêng.
- **Góc chiếu**: 5 góc chính, orb 8° cho Hợp, Vuông, Tam hợp, Đối, 6° cho Lục hợp (skyscript 8° và 4°; my-zodiac-ai hợp 8°, lục hợp
  ~6°; astrotheme 7,8–10,5°, lục hợp 6,1°); không nới riêng cho Mặt Trời, Mặt Trăng (astrotheme +0,3°, có trang nới tới 10°). Xét
  giữa 10 thiên thể, cung Mọc, Thiên Đỉnh; bỏ Bắc Giao Điểm và cặp cung Mọc – Thiên Đỉnh [W50].
- **Tên**: 12 cung như bảng Hán–Việt `cungHoangDao` [W32]; hành tinh theo tên thiên văn phổ thông; "cung Mọc", "Thiên Đỉnh", góc
  Hợp, Lục hợp, Vuông, Tam hợp, Đối theo trang Việt (có trang ghi "Vuông góc", "Đối đỉnh"); "Bắc Giao Điểm" chưa thấy trang Việt ghi
  rõ. Bảng và góc chiếu luôn kèm tên Anh [W50].
- **Hôm nay** (phần 2, `src/loi/chiemTinhNgay.ts`, thẻ "Hôm nay"): tính lúc mở khối. Mặt Trăng đổi cung: bước 1 giờ rồi chia đôi
  tới nửa phút — 100 ca so Swiss Ephemeris lệch ≤1,8 phút. Nghịch hành: cùng cách xét của lá số (kinh độ ±12 giờ), lùi/tới từng ngày
  rồi chia đôi tới 5 phút — 40 khoảng so Swiss Ephemeris lệch ≤27 phút (hành tinh xa đứng lâu nên giờ đứng khó định); Sao Thủy 2026
  khớp Chani, Cafe Astrology ±5 phút. Ngày ghi theo giờ Việt Nam: đợt 1 năm 2026 hết ngày 21/03 (trang ghi 20/03 là theo giờ Mỹ,
  UTC) [W52]. Sắp nghịch hành: hành tinh đang thuận mà bắt đầu nghịch trong 7 ngày tới (xét từng ngày); chỉ ghi ngày vì giờ
  đứng lệch tới 27 phút (anh yêu cầu 22/10). Tuần trăng: 8 tuần, mỗi tuần 45° góc Mặt Trăng – Mặt Trời, tâm ở 0°, 45°…; tên trăng non, lưỡi liềm, bán nguyệt
  (thượng huyền, hạ huyền), khuyết, tròn theo trang Việt [W52]; 2.484 lần sóc 1900–2100 đều ra Trăng non. Góc chiếu với lá số:
  10 thiên thể lúc xem × 10 thiên thể, cung Mọc, Thiên Đỉnh gốc, orb 1°; không rõ giờ sinh thì bỏ Mặt Trăng gốc (lệch tới ~6°).
- Lời giải Claude soạn lại theo quan niệm chiêm tinh phương Tây phổ biến (`src/loi/chiemTinhGiai.ts`); 3 hành tinh xa ghi theo thế
  hệ. Ký hiệu vẽ bằng đường lấy từ phông DejaVu Sans (`scripts/ky_hieu_sao.py`) vì iPhone đổi ♈… thành emoji. Đã kiểm:
  `tests/ChiemTinh.test.ts`, Playwright khổ 390×844 (có giờ, không rõ giờ, nước ngoài).

## 24. Tarot (`src/loi/tarot.ts`, thẻ "Gieo quẻ", tra 22/10)
- **Bộ bài**: bộ 1909 do Pamela Colman Smith vẽ, A. E. Waite soạn — hết bản quyền ở Mỹ (in 1909) và Anh/EU (Smith mất 1951, Waite
  1942). Không dùng tên "Rider-Waite" (nhãn hiệu US Games) và bản tô màu 1971. Ảnh: bản quét "Pam-A" của Holly Voley trên Wikimedia
  Commons (dấu Public Domain Mark) — trang Commons không mở được từ máy ảo, xác minh qua kết quả tìm kiếm (trang tệp Lovers, Cups04)
  và xem đủ 78 ảnh cùng một bản quét [W53]. WebP rộng 300 px, chất lượng 70 (`scripts/tai_tarot.py`), cài sẵn cùng app.
- **Thứ tự**: 0–21 ẩn chính theo số 1909 (Sức Mạnh VIII, Công Lý XI); 22–77 ẩn phụ Gậy, Cốc, Kiếm, Tiền, mỗi bộ Át, 2–10, Tiểu
  Đồng, Hiệp Sĩ, Hoàng Hậu, Vua.
- **Tên**: tên Việt mỗi trang một khác (The Magician: Nhà Ảo Thuật / Pháp Sư; The Empress: Hoàng Hậu / Mẹ Đại Địa; The Hierophant:
  Giáo Hoàng / Thượng Giáo; Temperance: Tiết Chế / Tiết Độ; Page: Tiểu Đồng / Thị Đồng / Thị Vệ; Queen: Hoàng Hậu / Nữ Hoàng;
  Pentacles: Tiền / Xu) và máy ảo không mở được trang nào để đếm → **tên Anh là tên chính**, kèm tên Việt hay gặp và tên khác [W53].
- **Lá ngược**: tuỳ chọn `laNguoc`, mặc định có (sách Waite ghi nghĩa ngược cho từng lá); ô chọn ngay trên màn hình.
- **Kiểu trải**: 1 lá; 3 lá (quá khứ – hiện tại – tương lai); Thập tự Celtic 10 lá theo Waite, "An Ancient Celtic Method of
  Divination" (đã đọc bản 1910 trên archive.org: covers, crosses, crowns, beneath, behind, before, himself, his house, hopes or fears,
  what will come) — app không chọn lá đại diện (Significator) mà rút đủ 10 lá từ 78 lá.
- **Xáo bài**: Fisher–Yates một phần, số ngẫu nhiên 32 bit từ `crypto.getRandomValues` ở vỏ ngoài; test 78.000 lần rút đều (khi
  bình phương), 10.000 lần trải 10 lá không trùng, lá ngược 50 % ± 1 %.
- Nghĩa xuôi, ngược: Claude soạn lại theo Waite (1910) và cách đọc phổ biến; chưa người rành đọc lại.

## Bảng tuỳ chọn (tên gợi ý trong mã)
| Tuỳ chọn | Giá trị | Mặc định | Môn |
|---|---|---|---|
| `gioTy` | `doiNgay23h` · `chiaDoiCanSau` · `chiaDoiCanNay` | `doiNgay23h` (anh chốt 15/10) | tử vi (chỉ giá trị thứ 1 và 3), bát tự |
| `doiVeGio7` | có · không (giữ giờ nhập như Altuvi) | có (anh chốt 15/10) | mọi môn dùng giờ; chiêm tinh thì luôn đổi |
| `namCungPhi` | `lapXuan` · `tet` | `lapXuan` (anh chốt 15/10) | Bát trạch |
| `thangXemNgay` | `am` · `tiet` | `am` (anh chốt 19/10: khớp lịch Việt trên mạng) | 12 trực, hoàng đạo, thần sát theo tháng |
| `thangNhuanTuVi` | `thangTruoc` · `chia15` · `thangSau` | `thangTruoc` | tử vi |
| `gioMatTroi` | bật · tắt | tắt | tử vi, bát tự |
| `namCaNhan` | `ngay0101` · `sinhNhat` | `ngay0101` | thần số học |
| `soChuDao` | `motLuot` · `rutGonRieng` | `motLuot` | thần số học |
| `hoangOc` | `theoChuc` · `demTiep` | `theoChuc` | Hoang Ốc |
| `menhChuTheo` | `cungMenh` · `tuoi` | `cungMenh` (Toàn Thư) | tử vi: Mệnh chủ |
| `nguyetHanTu` | `tieuHan` · `thaiTue` | `tieuHan` (Thái Thứ Lang, trang Việt) | tử vi: lưu nguyệt, lưu nhật (mục 16) |
| `phaiTuVi` | `altuvi` · `ansaotuvi` | `altuvi` (luật 3) | tử vi: Thiên Giải, Phá Toái, Hỏa/Linh Tinh, năm Canh (Khôi, Việt, Hóa Khoa, Hóa Kỵ, Lưu Hà), Mệnh chủ/Thân chủ |
| `menhMauSo` | `napAm` · `cungPhi` | `napAm` | màu, số hợp mệnh (màn "Hôm nay") |
| `cauKieu` | `motCap` · `haiCap` | `motCap` (một cặp lục bát) | bói Kiều (mục 17) |
| `namMaiHoa` | `tet` · `lapXuan` | `tet` | Kinh Dịch: Mai Hoa (mục 18) |
| `hoCanKhon` | `theoSach` · `giuNguyen` | `theoSach` (乾坤無互) | Kinh Dịch: quẻ hỗ của Càn, Khôn |
| `kiengLich` | `xau` · `tranh` | `xau` (kiêng của hai hoàng lịch trùng 61 %) | chọn ngày: lịch ghi kiêng việc (mục 19) |
| `taiThan` | `sachViet` · `hoangLich` | `sachViet` (chưa có trong mã) | hướng tài thần (mục 19) |
| `duongCongThang7` | `mung1` · `mung8` | `mung1` (chưa có trong mã) | chọn ngày: Dương Công Kỵ tháng 7 (mục 19) |
| `heNha` | `placidus` · `cungNguyen` (Whole Sign) | `placidus` (chưa có trong mã) | chiêm tinh: nhà (mục 23) |
| `nutBac` | `trungBinh` · `that` | `trungBinh` (anh chốt 22/10, như astro-seek) | chiêm tinh: Bắc Giao Điểm (mục 23) |
| `laNguoc` | có · không | có (ô chọn trên màn hình) | tarot (mục 24) |

Tuỳ chọn riêng của một môn (vd tử vi năm Canh: theo Altuvi hay `ansaotuvi`) ghi ở `docs/NGUON_MO.md`. Chưa tra (môn đó tự tra khi làm): Mai Hoa, Kỳ Môn, Lục Diệu.
## Nguồn
**Máy** (cài vào thư mục tạm, không cài vào repo):
- A: 5 lá số Altuvi (`scripts/doi-chieu/mau-altuvi.json`, so bằng `so-altuvi.*`). Ca E ra năm Tân Tỵ; ca A, B có ngày âm khớp lịch +7 (lịch +8 ra 24/1 và 29/11); ca C sinh 25/2 nhuận được tính tháng 2; ca D lấy đúng giờ nhập.
- M2: `ansaotuvi` 0.1.28. `lapDiaBan` dùng số tháng âm và bỏ cờ nhuận; năm là năm âm HND; giờ chỉ là chi (1 = Tý), ngày do người gọi chọn. M7: `tuvi-mcp-server` 0.5.0 (tử vi Việt dựa trên `ansaotuvi`): `adjust_date_for_late_ty` cộng 1 ngày khi sinh giờ 23.
- M3: `iztro` 2.6.2 (`astro/config.js`). `yearDivide` và `horoscopeDivide` mặc định `normal` (mùng 1 Giêng; `exact` là Lập Xuân); `dayDivide` mặc định `forward`; `ageDivide` mặc định `normal` (năm âm − năm âm sinh + 1); `fixLeap` mặc định true.
- M4: `lunar-javascript` 1.7.7 và `lunar-typescript` 1.8.6 (repo đang dùng; chạy thử ra kết quả giống nhau). `EightChar` lấy năm, tháng theo Lập Xuân, tiết đúng thời khắc; `setSect(2)` (mặc định) là phái B, `setSect(1)` là phái A; `getYearNineStar(1|2|3)` là Tết / ngày Lập Xuân / thời khắc Lập Xuân; `getMonthNineStar`, `getZhiXing`, `getDayTianShen` theo tháng tiết; `getYearPositionTaiSui` mặc định Lập Xuân; giờ tiết là +8 (`ONE_THIRD`).
- M5: `sxtwl` 2.0.7 (mã C++ tải từ PyPI). `getYearGZ()` mặc định theo ngày Lập Xuân; `getMonthGZ()` theo tiết; `getShiGz(…, isZaoWanZiShi=true)` cho giờ 23 lấy can Tý của ngày sau. M6: `bazi_core` 1.1.0 (Dart, mã ở https://pub.dev/documentation/bazi_core/1.1.0/): `ratHourMode` mặc định `nextDay`, có thêm `currentDay`, `currentDayTomorrowStem`; `clockMode` mặc định `civil`.
- M8: `Intl` của Node 22.22 (ICU 77.1, tzdata 2025b); các file `asia`, `backzone`, `zone1970.tab` ở https://github.com/eggert/tz. M9: lịch HND trong `ansaotuvi`, chạy với +7 và +8 cho 1930–2030. M10: `astronomy-engine` 2.1.19, tính phương trình thời gian từng ngày năm 2026.

- M11: `pyswisseph` 2.10.3.2 (Swiss Ephemeris 2.10.03, bản Moshier; AGPL nên chỉ cài ở thư mục tạm qua `chay.sh`): `scripts/doi-chieu/chiem-tinh-swe.py` → `tests/vang/chiem-tinh-swe.json`. M12: toạ độ GeoNames cities1000 (bản chép `lutangar/cities.json`, CC BY 4.0) và Natural Earth 10m populated places (`nvkelso/natural-earth-vector`, phạm vi công cộng), tải 22/10.

**Web** (đoạn trích kết quả tìm kiếm, chưa mở được trang gốc):
- W1 https://uptogo.com.tw/?p=1144631: tử vi lấy mùng 1 Giêng làm đầu năm; bát tự và cửu tinh lấy Lập Xuân. W2 https://www.masterseanchan.com/vi/bazi-1945/: năm bát tự bắt đầu từ Lập Xuân; https://www.masterseanchan.com/fengshui-flying-star-charts-by-year/: bàn phi tinh năm chạy từ Lập Xuân tới Lập Xuân năm sau.
- W3 https://www.tinnhanhchungkhoan.vn/ban-khoan-ve-viec-dung-sai-cua-lich-2019-post209095.html: phong thủy, tứ trụ tính tuổi từ Lập Xuân; tử vi theo tháng âm; tuổi cúng lễ, viết sớ theo năm Tết.
- W4 https://muaban.net/blog/phong-thuy-bat-trach-518866/: cung phi lấy năm theo tiết Lập Xuân. W5 https://fptshop.com.vn/tin-tuc/for-gamers/lam-sao-de-biet-minh-menh-gi-201658: muốn tính cung phi chính xác phải theo lịch tiết khí.
- W6 https://vnexpress.net/van-may-nha-ban-nam-2013-2417260.html: Ngũ Hoàng làm chủ năm 2013 "kể từ thời điểm Lập xuân (3/2/2013)".
- W7 https://luatminhkhue.vn/bang-tinh-tuoi-am-nam-2024-cho-cac-nam-sinh-chinh-xac.aspx (tuổi tăng 1 mỗi Tết) · https://thuvienphapluat.vn/hoi-dap-phap-luat/bang-tinh-tuoi-am-2024-chuan-nhat-cho-cac-nam-sinh-138017515.html (năm hiện tại − năm sinh + 1).
- W8 https://roxyapi.com/blogs/bazi-calculators-disagree-day-boundary: ba phái giờ Tý (split-zi là mặc định, midnight, early-zi). W8b https://bazidestiny.yolasite.com/bazi-early-and-late-hour.php: gọi khung 23:00–23:59 là "early".
- W9 https://vocus.cc/article/69c49d6ffd897800017aead7: cách chủ lưu là qua 23:00 đã đổi trụ ngày. W10 https://www.163.com/dy/article/EEB7TVDL0525AEBH.html: cổ pháp lấy 23:00 làm đầu ngày; chia ở 00:00 là cách có từ khi có đồng hồ Tây.
- W11 https://tienphong.vn/xa-hoi/8102/Truoc-nam-1975-Viet-Nam-su-dung-2-mui-gio.html · W12 https://thuvienphapluat.vn/van-ban/Linh-vuc-khac/Quyet-dinh-121-CP-tinh-lich-quan-ly-lich-cua-Nha-nuoc-18212.aspx
- W13 https://informatik.uni-leipzig.de/~duc/amlich/calrules_en.html (Hồ Ngọc Đức): lịch VN tính theo kinh tuyến 105°Đ; tháng không có trung khí là tháng nhuận. W14 https://www.cia.gov/readingroom/document/02008421: ở miền Nam, ngày 30/01/1968 là mùng 1 Tết.
- W15 https://satyori.com/glossary/personal-year/ · https://roxyapi.com/tools/numerology/personal-year: năm cá nhân phần đông đổi ngày 01/01, một số phái đổi ở sinh nhật. W16 https://glama.ai/mcp/servers/@spyfree/mingli-mcp/blob/30212c4c7b479c57f593ac609cf3dc1a0ebd27d6/docs/TRUE_SOLAR_TIME.md: giờ mặt trời thực = giờ địa phương theo kinh độ (4 phút mỗi độ) + phương trình thời gian; dùng hay không là tuỳ phái.
- W17 https://blog.udn.com/PAESI15/178744882: tử vi gặp tháng nhuận thì nửa đầu tính tháng đó, nửa sau tính tháng sau (chỗ khác trong bài ghi cả tháng tính tháng sau); bát tự theo tiết nên không vướng tháng nhuận.
- W18 https://fptshop.com.vn/tin-tuc/danh-gia/ngay-tam-nuong-la-ngay-gi-175689 · https://fptshop.com.vn/tin-tuc/danh-gia/ngay-nguyet-ky-la-gi-175380. W19 https://www.momo.vn/blog/nam-2026-tuoi-gi-bi-kip-chuan-bi-tai-chinh-c116dt2351 · https://vtcnews.vn/nam-2026-la-nam-con-gi-ar992583.html: năm Bính Ngọ kéo dài từ Tết 17/02/2026 tới 05/02/2027.
- W20 https://muaban.net/blog/tuoi-1996-lam-nha-nam-2026-608394/ · https://fptshop.com.vn/tin-tuc/for-gamers/xem-tuoi-lam-nha-2026-209116: Kim Lâu, Hoang Ốc tính theo tuổi mụ (người sinh 1996, năm 2026 được 31 tuổi mụ). W21 https://luatminhkhue.vn/bang-tinh-sao-han-va-cuu-dieu-nam-binh-ngo-2026.aspx · https://thuvienphapluat.vn/cong-dong-dan-luat/bang-sao-han-nam-2025-at-ty-cho-cac-tuoi-216641.html: lấy tuổi âm chia 9, nam và nữ đi vòng khác nhau.
- W22 https://www.skillon.com/BaZi_FengShui_Q.cfm/topic/2747/tong-shu-12-day-officers · https://www.skillon.com/bazi-feng-shui.cfm/topic/90/Chinese-Almanac-Tong-Shu-and-the-12-Day-Officers: trực lấy từ chi ngày và chi tháng; hết tháng tiết thì tính lại từ đầu.
- W23 https://www.dienmayxanh.com/kinh-nghiem-hay/tam-hop-la-gi-tu-hanh-xung-la-gi-1588018: tam hợp, tứ hành xung, lục hợp. W24 https://baohatinh.vn/tv/lich-am-duong-ngay-2972026-gio-hoang-dao-tuoi-xung-va-viec-nen-luu-y-48277.html: lịch ngày ghi "lục hợp, tam hợp, xung, hình, hại" theo chi ngày.
- W25 https://mytour.vn/vi/blog/doi-song/mau-sac-may-man-hom-nay-7-9-2025-theo-menh-giup-ban-thu-hut-tai-loc-va-tinh-duyen-mytour.html · https://mytour.vn/vi/blog/doi-song/kham-pha-mau-sac-may-man-hom-nay-15-9-2025-theo-phong-thuy-menh-chuan-trong-do-do-la-mau-sac-phu-hop-nhat-mytour.html: màu theo ngày, mệnh theo cửu tinh, hành ngày theo nạp âm. W26 https://baolamdong.vn/mau-sac-may-man-ngay-6112025-cho-tung-menh-theo-phong-thuy-400488.html: cùng cách gọi mệnh, màu khác mytour.
- W27 https://gumac.vn/tin-tuc/menh-tho-hop-mau-gi · https://gumac.vn/tin-tuc/menh-moc-hop-mau-gi · https://fptshop.com.vn/tin-tuc/danh-gia/menh-kim-hop-mau-gi-169092: màu từng hành, màu tương sinh (Lộ Bàng Thổ hợp màu Hỏa, Đại Lâm Mộc hợp màu Thủy).
- W28 https://fptshop.com.vn/tin-tuc/for-gamers/menh-moc-hop-so-nao-193888 · https://mytour.vn/vi/blog/bai-viet/menh-kim-hop-so-nao-mang-lai-phu-quy-tien-bac-doi-dao-cho-gia-chu.html: số theo hành (Lạc Thư).
- W29 https://fptshop.com.vn/tin-tuc/thu-thuat/cach-tinh-so-chu-dao-157703 · https://hellobacsi.com/community/suc-khoe-tinh-than/cach-tinh-so-chu-dao-trong-than-so-hoc-238929/ · https://mytour.vn/vi/blog/bai-viet/so-master-33-bac-thay-voi-tam-nhin-rong-mo.html · https://thuviennhadat.vn/phap-luat/master-number-la-gi-y-nghia-tung-master-number-trong-than-so-hoc-630185.html
- W30 https://people.howstuffworks.com/life-path-number.htm · https://101planners.com/numerology/life-path-number-calculator/ · https://numerology.pardesco.com/life-path/how-to-calculate/
- W31 https://thuvienphapluat.vn/cong-dong-dan-luat/huong-dan-cach-tinh-nam-ca-nhan-theo-than-so-hoc-210558.aspx · https://fptshop.com.vn/tin-tuc/for-gamers/2026-la-nam-ca-nhan-so-may-195644 · https://mytour.vn/vi/blog/bai-viet/kham-pha-bi-an-cua-ngay-sinh-qua-than-so-hoc-so-hoc-theo-pythagoras.html · https://www.vietnamworks.com/hrinsider/bieu-do-ngay-sinh-than-so-hoc-la-gi.html · https://jobsgo.vn/blog/bieu-do-ngay-sinh-than-so-hoc/
- W32 https://shopee.vn/blog/cung-hoang-dao/ · https://hoanghamobile.com/tin-tuc/22-11-la-cung-gi/ · https://www.lovetoknow.com/life/astrology/horoscope-sign-dates
- W33 https://blogs.mathworks.com/cleve/?p=105 · https://www.intmath.com/trigonometric-graphs/biorhythm-graphs.php · https://encyclopedia.pub/entry/37613
- W34 https://luatminhkhue.vn/bang-tinh-sao-han-va-cuu-dieu-nam-binh-ngo-2026.aspx · https://hoatieu.vn/tai-lieu/bang-tinh-sao-han-204566 · https://phongthuyviet.com.vn/2016/01/22/cach-tinh-han-huynh-tuyen/ · https://tuvisonlong.com/han-hang-nam-la-gi/ · https://lichngaytot.com/tu-vi/sao-han-tuoi-ty-nam-2026-304-232429.html · https://tuoiam.com/sao-han/ · https://mogi.vn/news/bang-sao-han-2025-270399/
- W35 https://fptshop.com.vn/tin-tuc/for-gamers/2026-tuoi-nao-pham-kim-lau-200222 · https://www.dienmayxanh.com/kinh-nghiem-hay/hoang-oc-la-gi-cach-tinh-tuoi-hoang-oc-1586912 · https://nhadepktv.vn/tu-van-phong-thuy/han-hoang-oc-la-gi.html · https://market.vinhomes.vn/blog/han-hoang-oc · https://luatminhkhue.vn/tam-tai-la-gi.aspx · https://vietnamnet.vn/han-tam-tai-nam-2026-co-nhung-tuoi-nao-cach-hoa-giai-han-tam-tai-2485550.html · https://soha.vn/nam-2026-nhung-tuoi-nao-pham-thai-tue-198251217110657351.htm · https://kenh14.vn/nam-2026-nhung-tuoi-nao-pham-thai-tue-215251217084647382.chn
- W36 https://wiki.batdongsan.com.vn/wiki/xem-huong-tot-va-xau-cho-tung-cung-menh-58093 · https://vatphamphongthuy.com/xem-huong-tot-xau-theo-menh-cung.html · https://www.blogphongthuy.com/cac-huong-tot-xau-voi-8-menh-cung.html · https://giaoducthudo.giaoducthoidai.vn/vi-dau-co-tam-hop-tu-hanh-xung-luc-hop-luc-hai-giua-cac-tuoi-voi-nhau-112321.html
- W37 *Tử Vi Đẩu Số Toàn Thư* quyển 2, bản Wikisource https://zh.wikisource.org/zh-hant/紫微斗數全書/卷二 (máy ảo chặn, đọc qua trích đoạn) · https://www.ptt.cc/man/Life/D4B8/DB31/M.1299766290.A.FE6.html · https://blog.sina.com.cn/s/blog_1370e69aa0102wext.html · https://blog.csdn.net/weixin_30843605/article/details/98658904 · https://ly.yishihui.net/bz/6002.htm
- W38 https://tuvilyso.org/forum/topic/12145-menh-chu-than-chu/ · https://tracuutuvi.com/chu-menh-tham-lang-chu-than-linh-tinh.html · https://khoahoc.tuvichanco.net/menh-chu-than-chu.html · https://tuvisaigon.vn/cach-menh-chu-trong-tu-vi-dau.html
- W39 http://www.phongthuychanthu.com/2018/01/quan-xuan-thinh-so-tu-vi-kinh-nghiem.html · https://lyso.vn/tong-hop/than-chu-menh-chu-t19600/ · http://sach.nlv.gov.vn/sach/cgi-bin/sach?a=d&d=tdKyoE1950.1.6 (bản sách 1950, Thư viện Quốc gia) · https://www.ncc.com.tw/fate/paleo/gv/gv_15.htm
- W40 (lưu hạn, trích đoạn 20/10) https://lyso.vn/xem-tu-vi/ban-ve-cac-cach-xem-dai-van-tieu-van-luu-dai-van-nguyet-van-nhat-van-cua-tu-vi-t83863/ (Thái Thứ Lang khởi tiểu vận, Tử Vân khởi Lưu Thái Tuế) · https://lyso.vn/xem-tu-vi/cach-tinh-nguyet-han-t67995/page10.html ("6, 7 cách") · https://viettopreview.vn/cach-xem-han-thang-trong-tu-vi.html · https://horos.vn/blog/post/nguyet-van-cach-xac-dinh-han-thang-nguyet-han-trong-tu-vi · http://phongthuythanhhoa.vn/vi/cach-tinh-han-thang-han-nguyet-van-trong-tu-vi-chinh-xac/ · https://hocvienlyso.org/luan-doan-nhat-han-tren-la-so-tu-vi.html (nhật hạn; tháng nhuận chia ở ngày 15) · https://hoc.kabala.vn/cach-luan-doan-dai-han-va-tieu-han/ · https://tuvisonlong.com/y-nghia-cac-sao-luu-nien-khi-giai-doan-tieu-han-nam/ · http://phongthuythanhhoa.vn/vi/tinh-chat-cua-cac-sao-luu-dong-trong-tu-vi/ · https://lyso.vn/xem-tu-vi/cach-an-cac-sao-luu-trong-tu-vi-ly-so-t121409/ · máy: `tuvi-mcp-server` 0.5.0 `_transit.py`, `iztro` 2.6.2 `FunctionalAstrolabe.js`.
- W42 *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang, Sài Gòn 1956 — bản OCR https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV (6 phần, máy ảo tải được 20/10): mục 10.4–10.6 (lưu nguyệt, nhật, thời hạn), phần II mục 2–3 (định danh, đặc tính sao — nền của lời giải `src/loi/tuVi/nghia.ts`), phần III mục 1, 2, 4. *Toàn Thư* 安斗君訣: https://ku.meirishici.com/book/zc8uswp5ds/xm6jpqch5n · http://www.ziweicn.com/ziweirumen/mingcijieshi/3056.html · https://zhuanlan.zhihu.com/p/685357660
- W41 (sao hạn, trích đoạn 20/10) https://hoatieu.vn/tai-lieu/cung-sao-la-hau-204576 · https://www.bachhoaxanh.com/kinh-nghiem-hay/cach-cung-sao-nam-2022-de-giai-han-sao-ke-do-thai-bach-va-la-hau-1403145 · https://www.dienmayxanh.com/kinh-nghiem-hay/cung-sao-giai-han-1588853 · https://docungtamlinh.com.vn/cung-sao-giai-han-ram-thang-gieng/ · https://phongthuyphuockhang.com/cung-sao-giai-han/ · https://didongviet.vn/dchannel/sao-thuy-dieu/ · https://vietlac.net/chi-tiet-9-sao-chieu-menh-tuoi-trong-nam · https://huyenbi.net/Sao-Van-Hon-la-gi-tot-hay-xau-Van-khan-va-cach-cung-giai-han-sao-Van-Hon-3138.html · https://muaban.net/blog/sao-thai-duong-tot-hay-xau-223674/ · https://tiki.vn/blog/sao-thai-bach/ · https://mogi.vn/news/sao-moc-duc-149708/
- W43 (nguồn Phật, Đạo, chùa — trích đoạn 20/10) chùa Nhật: https://nckoyasan.org/wp-content/uploads/2025/01/hoshimatsuri-chart-2025.pdf · https://nckoyasan.org/wp-content/uploads/2025/01/2025-Hoshi-Matsuri-Form.pdf · https://www.engakuji.jp/information/%E5%B9%B3%E6%88%9024%E5%B9%B4%E3%81%AE%E6%98%9F%E4%BE%9B%E3%83%BB%E4%B9%9D%E6%9B%9C%E6%98%9F%E6%97%A9%E8%A6%8B%E8%A1%A8/ · https://higoyo.me/nichiyousei/ · https://saijigoyomi.com/tonensei/ · https://byodoji.online/en/ritual/hoshiku/2025 · kinh: https://ntireader.org/taisho/t1299.html · https://ntireader.org/taisho/t1311.html · https://crta.info/wiki/許真君玉匣記_-_DZ1480 · VN: https://giaoduc.net.vn/van-hoa/lam-dieu-ac-se-gap-qua-bao-giao-ly-nha-phat-khong-cung-sao-giai-han-post195620.gd · https://baovanhoa.vn/van-hoa/thu-truong-trinh-thi-thuy-giao-ly-nha-phat-khong-co-sao-tot-sao-xau-72980.html · https://www.sggp.org.vn/bo-vh-tt-dl-de-nghi-chan-chinh-bien-tuong-trong-cung-dang-sao-giai-han-post509181.html · https://baovanhoa.vn/van-hoa/bo-vhttdl-chi-dao-chan-chinh-bien-tuong-trong-cung-dang-sao-giai-han-66283.html · Thủy Diệu: https://hoatieu.vn/tai-lieu/sao-thuy-dieu-tot-hay-xau-206412 · https://didongviet.vn/dchannel/sao-thuy-dieu/ · https://thuvienphapluat.vn/cong-dong-dan-luat/bang-sao-han-nam-2025-at-ty-cho-cac-tuoi-216641.html
- W44 (Thái Tuế, Tam Tai — trích đoạn 20/10) đền, nhà nước Đài Loan: https://www.ht.org.tw/faq256.htm · https://www.ht.org.tw/religion393.htm · https://religion.moi.gov.tw/Knowledge/Content?ci=2&cid=44 · báo, thầy số: https://www.nownews.com/news/6764775 · https://health.tvbs.com.tw/life/359390 · https://health.tvbs.com.tw/life/360350 · https://udn.com/news/story/7268/9261870 · https://udn.com/news/story/7272/9318633 · https://news.tvbs.com.tw/english/3117327 · https://www.taiwanplus.com/news/lunar-new-year/lunar-new-year-traditions/260213043/year-of-the-horse-turning-around-an-unlucky-zodiac-fortune · Hàn: https://encykorea.aks.ac.kr/Article/E0026787 · https://www.beopbo.com/news/articleView.html?idxno=74322 · http://www.ibulgyo.com/news/articleView.html?idxno=85880 · https://www.jogyesa.kr/board/news/board_view.php?search_forward=2004&page=31&num=6553
- W45 (nguyên văn, đọc 20/10 sau khi anh mở mạng) kinh, bản XML CBETA: https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/T21/T21n1311.xml · https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/T21/T21n1308.xml · https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/T21/T21n1299.xml · *Tam Mệnh Thông Hội* quyển 2: https://zh.wikisource.org/wiki/三命通會/卷二 · encykorea 삼재: https://encykorea.aks.ac.kr/Article/E0026787 · *Ngọc Hạp Ký* bản Kanripo (Đạo tạng): https://raw.githubusercontent.com/kanripo/KR5h0051/master/KR5h0051_000.txt (法師選擇記, bảng nam nữ, ngày cúng) · https://raw.githubusercontent.com/kanripo/KR5h0049/master/KR5h0049_001.txt (mục lục "男女值年星命之屬") · https://zh.wikisource.org/wiki/玉匣記 · Hàn 직성: https://encykorea.aks.ac.kr/Article/E0054507 · https://raw.githubusercontent.com/kanripo/KR5c0148/master/KR5c0148_001.txt (DZ0752) · 8 hạn: https://raw.githubusercontent.com/kanripo/KR5b0320/master/KR5b0320_002.txt (赤松子章曆) · https://zh.wikisource.org/wiki/選擇要略/下 (入宮催屍)
- W46 (chọn ngày, tra 21/10 qua tóm tắt tìm kiếm) lịch theo ngày: https://www.xemlicham.com/am-lich/nam/2026/thang/9/ngay/22 · https://www.xemlicham.com/am-lich/nam/2026/thang/10/ngay/9 · https://www.xemlicham.com/am-lich/nam/2026/thang/8/ngay/13 · https://lichngaytot.com/xem-ngay-tot-xau-22-09-2026 · https://lichngaytot.com/xem-ngay-tot-xau-13-10-2026 · https://lichngaytot.com/xem-ngay-tot-xau-20-08-2026 · https://lichvannien.net/lich-am/nam/2026/thang/8/ngay/31 · https://lichvannien.net/lich-am/nam/2026/thang/10/ngay/14 · Khổng Minh, Lý Thuần Phong: https://phongthuyvuong.net/chon-ngay-tot/cach-tinh-ngay-xuat-hanh-theo-khong-minh-gio-xuat-hanh-theo-ly-thuan-phong-434.html · https://lich365.net/lich-khong-minh.html · https://lich365.net/cach-tinh-gio-xuat-hanh.html · https://xemvm.com/kien-thuc-phong-thuy/xem-ngay/chon-gio-xuat-hanh-theo-ly-thuan-phong-459.html · https://vietnamnet.vn/gio-xuat-hanh-huong-xuat-hanh-ngay-mung-1-tet-nguyen-dan-at-ty-2025-2365254.html · hướng: https://t-van.net/dang-xuan-xuyen-cach-tinh-phuong-vi-xuat-hanh-hy-than-tai-than-hac-than/ · Dương Công: https://baike.baidu.com/item/%E6%9D%A8%E5%85%AC%E5%BF%8C%E6%97%A5/3630656 · https://zh.wikisource.org/wiki/%E7%8E%89%E5%8C%A3%E8%A8%98 · https://www.sohu.com/a/967580128_121994924 · Thọ Tử: https://www.ttjiri.com/baishiji/17715.html · https://koyomil.com/jushinichi/ · Sát Chủ Dương: https://www.blogphongthuy.com/cach-tinh-ngay-sat-chu-duong-nhu-the-nao.html · mã: https://raw.githubusercontent.com/tungocvan/adminlt-laravel-12/main/public/js/lichvannien/hungnhat.js · https://raw.githubusercontent.com/buicaoliem/licham/HEAD/sao-report.md · https://raw.githubusercontent.com/vinhicut/2027/HEAD/tuvivietnam-react-main/frontend/src/features/lunar-calendar/engine/saoCatHung.js · https://raw.githubusercontent.com/braverynew/xemngay/master/index.html · máy: `cnlunar` 0.2.5 (PyPI, MIT).
- W47 (la bàn, tra 21/10 qua tóm tắt tìm kiếm) 24 sơn: https://en.wikipedia.org/wiki/Flying_Star_Feng_Shui · https://www.scmp.com/article/640689/mastering-degrees · https://en.wikibooks.org/wiki/Feng_Shui/Flying_Star_Feng_Shui/Period_9 · https://vnexpress.net/sua-nha-bep-hop-phong-thuy-2883438.html (215° Sửu sơn Mùi hướng); cách đo: https://muaban.net/blog/cach-xac-dinh-huong-nha-579475/ · https://voh.com.vn/nha/cach-xem-huong-nha-396077.html · https://mytour.vn/vi/blog/bai-viet/bi-quyet-xac-dinh-huong-nha-va-cua-theo-phong-thuy.html · https://wiki.batdongsan.com.vn/wiki/cach-su-dung-la-ban-chinh-xac-32799; cảm biến: https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent · https://bugs.webkit.org/show_bug.cgi?id=269706 · https://forum.defold.com/t/how-to-force-safari-browser-to-allow-deviceorientation-permission-solved/75641
- W48 (thước Lỗ Ban, tra 21/10 qua tóm tắt tìm kiếm): https://quantrimang.com/cuoc-song/thuoc-lo-ban-175844 · https://wiki.batdongsan.com.vn/wiki/thuoc-lo-ban-la-gi-106076 · https://mytour.vn/vi/blog/bai-viet/huong-dan-cach-su-dung-thuoc-lo-ban-theo-phong-thuy.html · https://nukeviet.vn/en/store/modules/thuocloban/ · https://baohatinh.vn/cong-cu/lo-ban · https://uptogo.com.tw/?p=1257981 · https://uptogo.com.tw/?p=521421 · https://uptogo.com.tw/?p=521428 · https://catalog.digitalarchives.tw/item/00/32/a2/3b.html · cửa: https://voh.com.vn/nha/nhung-dieu-can-biet-de-tinh-kich-thuoc-cua-chinh-chuan-phong-thuy-400448.html · https://wiki.batdongsan.com.vn/wiki/kich-thuoc-cua-phong-ngu-768920 · bàn thờ: https://thuviennhadat.vn/cam-nang-nha-dat/goi-y-kich-thuoc-ban-tho-chuan-phong-thuy-631946.html · https://scrapbox.io/banthodunggiaan/
- W49 (phi tinh, tra 21/10 qua tóm tắt tìm kiếm): https://global.hk01.com/开罐/60297690/ · https://sina.cn/news/detail/5242703902410218.html · https://fengshuitoday.com/feng-shui-for-the-bing-fire-horse-year-2026/ · https://www.masterseanchan.com/fengshui-2026-flying-star-chart/ · https://en.wikibooks.org/wiki/Feng_Shui/Flying_Star_Feng_Shui/Period_9 · https://www.masterseanchan.com/fengshui-2027-san-sha/ · https://www.masterseanchan.com/fengshui-2028-san-sha/ · https://www.stheadline.com/realtime-property/3545457/ · https://www.chinatimes.com/newspapers/20230102000164-260210 · https://www.taiwannews.com.tw/zh/news/4378568 · https://www.rong0922.url.tw/File/819.doc · https://thuviennhadat.vn/cam-nang-nha-dat/cac-huong-nha-vuong-khi-trong-van-9-642310.html · vênh: https://cafeland.vn/xu-huong/phong-thuy/17/
- W50 (chiêm tinh, tra 22/10 qua tóm tắt tìm kiếm) hệ nhà: https://theastrologypodcast.com/transcripts/ep-244-transcript-how-did-placidus-become-the-most-popular-house-system/ · https://help.optuma.com/kb/faq.php?id=1218 · https://kerykeion.net/content/learn-astrology/foundation-house-systems · orb: https://www.skyscript.co.uk/glossary/orbs · https://www.astrotheme.com/astrology_aspects.php · https://my-zodiac-ai.com/vi/glossary/sextile · https://my-zodiac-ai.com/vi/glossary/conjunction · nút: https://kerykeion.net/content/learn-astrology/foundation-mean-true-node · https://www.astromitra.com/western-astrology/north-node-calculator.php · https://glama.ai/mcp/servers/cwkgwfkaw1 · tên: https://glints.com/vn/blog/cung-moc-la-gi/ · https://shopee.vn/blog/cung-moc-la-gi/ · https://viettelstore.vn/tin-tuc/cung-moc-la-gi-kham-pha-y-nghia-va-anh-huong-den-tinh-cach · https://jobsgo.vn/blog/cung-moc/ · https://www.careerlink.vn/cam-nang-viec-lam/goc-ky-nang/ban-do-sao-la-gi-cach-doc-ban-do-sao-cung-hoang-dao · https://fptshop.com.vn/tin-tuc/danh-gia/cach-xem-ban-do-sao-173466 · https://tianqi.masterseanchan.com/vi/learn/western · https://www.vietnamworks.com/hrinsider/ban-do-sao-la-gi-giai-ma-cach-doc-ban-do-sao-hoang-dao.html
- W51 (phân điểm, chí điểm 2026, tra 22/10): https://icalendars.net/tools/equinoxes-solstices · https://starwalk.space/news/what-is-an-equinox · https://www.universaltimedate.com/articles/equinoxes-and-solstices-2026 · https://www.farmersalmanac.com/equinox-solstice — 20/03 14:46, 21/06 08:24, 23/09 00:05, 21/12 20:50 UTC (khớp máy); hai trang sau ghi tháng 6, tháng 9 lệch đúng vài giờ, nghi nhầm múi giờ, không theo.
- W52 (chiêm tinh hôm nay, tra 22/10 qua tóm tắt tìm kiếm) Sao Thủy nghịch hành 2026: https://chani.com/this-year/key-dates/2026-astrological-key-dates-mercury-retrogrades · https://cafeastrology.com/events/mercury-turns-direct-in-cancer-2026/ · https://cafeastrology.com/events/mercury-turns-direct-in-scorpio-2026/ · https://www.almanac.com/content/mercury-retrograde-dates · https://miniwebtool.com/vi/l%E1%BB%8Bch-sao-th%E1%BB%A7y-ngh%E1%BB%8Bch-h%C3%A0nh/?year=2026 · https://my-zodiac-ai.com/vi/blog/mercury-retrograde-2026-complete-calendar-survival-guide · tuần trăng: https://viettelstore.vn/tin-tuc/cach-xem-chu-ky-trang-cuc-don-gian-va-chinh-xac · https://hoanghamobile.com/tin-tuc/bat-trend-the-moon-on-ngay-thang-nam-sinh/ · https://hoatieu.vn/tai-lieu/moon-phase-la-gi-212830 · https://vjol.info.vn/index.php/NNDS/article/download/15768/14176 (thượng huyền ngày 7–9, hạ huyền 22–23 âm)
- W53 (tarot, tra 22/10 qua tóm tắt tìm kiếm) ảnh, bản quyền: https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot · https://download.osmand.net/wiki/File:TheLovers.jpg · https://download.osmand.net/wiki/File:Cups04.jpg · https://www.glorioustrainwrecks.com/node/10985 · https://luciellaes.itch.io/rider-waite-smith-tarot-cards-cc0 · tên Việt: https://soitarot.vn/tarot · https://liu.com.vn/tarot · https://fptshop.com.vn/tin-tuc/dien-may/y-nghia-78-la-bai-tarot-168493 · https://jobsgo.vn/blog/y-nghia-78-la-bai-tarot/ · https://www.elle.vn/cung-hoang-dao/bai-tarot-tuong-trung-cung-hoang-dao/ · https://www.tarothuyenbi.info/2014/08/bon-la-queen-la-hoang-hau-trong-tarot.html · https://yody.vn/post/y-nghia-bai-tarot · https://dich.kabala.vn/tarot/bai-cards · https://aitamsu.com/tarot · https://phogotarot.com/blog/bo-an-phu-tarot-4-nguyen-to · sách Waite (bản sacred-texts 1910 lưu trên archive.org): https://archive.org/details/a.-e.-waite-the-pictorial-key-to-the-tarot
## Anh đã quyết (15/10/2026)

1. Sinh từ 23 giờ đến trước 12 giờ đêm: tính **ngày hôm sau** (phái A) — cho cả tử vi và bát tự.
2. Giờ đồng hồ thời dùng +8/+9 (miền Nam 1960–6/1975 và các giai đoạn ở bảng mục 7): app **tự lùi về +7** rồi mới tính; vẫn có tuỳ chọn giữ giờ nhập như Altuvi.
3. Cung phi của người sinh giữa Tết và Lập Xuân: theo **Lập Xuân**.
4. Ngày âm trước 1968: theo **+7** như trang lịch anh tìm trên mạng (xemlicham — anh nói rõ 21/10 không phải trang anh tin; ảnh 19/10: 1938, 1965 khớp +7, lịch TQ lệch tháng) — `docs/NGUON_MO.md`. Người nhà nhớ ngày âm theo lịch thời đó (+8) có thể lệch ở ngày hai lịch vênh → app ưu tiên nhập ngày dương; chỉ có ngày âm thì cảnh báo ở các ngày vênh.
5. (19/10) Trực, ngày hoàng/hắc đạo, nên/kiêng, sao theo tháng: theo **tháng âm** như lịch Việt trên mạng (baohatinh, chogia, baolamdong, xemlicham khớp 4/4 ngày thử) — không cần ảnh lịch nữa.
6. (20/10) Tốt/xấu 9 sao Cửu Diệu: **giữ như dân gian** (3 tốt: Thái Dương, Thái Âm, Mộc Đức · 3 xấu: La Hầu, Kế Đô, Thái Bạch · 3 trung tính: Thổ Tú, Thủy Diệu, Vân Hớn), không theo kinh gốc (Thổ Tú, Vân Hớn xấu; Thủy Diệu tốt — mục 14), không làm tuỳ chọn.
7. (21/10) Không có trang lịch "anh tin": xemlicham chỉ là trang anh tìm trên mạng. Chỗ các nguồn vênh: **theo bên được nhiều nguồn uy tín công nhận nhất**; bên chỉ có một trang thì không theo, không làm tuỳ chọn.
8. (22/10) Chiêm tinh: Bắc Giao Điểm tính kiểu **trung bình** như astro-seek (mục 23).
