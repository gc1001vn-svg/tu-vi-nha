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
| Tử vi: lưu nguyệt trong năm có tháng nhuận | như dòng trên, **chưa chắc** (Altuvi chưa đo) | như trên | — | — |
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
| Chiêm tinh | Tính lúc 12:00: Mặt Trời và các hành tinh dùng được; Mặt Trăng đổi cung trong ngày thì hiện 2 phương án; bỏ cung Mọc và các nhà |
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
- Cung hoàng đạo theo bảng ngày cố định của `lunar-typescript`. Vênh 1 ngày ở 21/6, 23/10, 22/11 (thư viện: Song Tử, Thiên Bình, Thiên Yết; nhiều bảng: Cự Giải, Thiên Yết, Nhân Mã) → ngày cách giao cung ±1 thì ghi thêm cung bên cạnh [W32].
- Nhịp sinh học: sin(2πt/T), T = 23, 28, 33 ngày, t = số ngày từ ngày sinh; ghi rõ không có cơ sở khoa học [W33].
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
| `menhMauSo` | `napAm` · `cungPhi` | `napAm` | màu, số hợp mệnh (màn "Hôm nay") |

Tuỳ chọn riêng của một môn (vd tử vi năm Canh: theo Altuvi hay `ansaotuvi`) ghi ở `docs/NGUON_MO.md`. Chưa tra (môn đó tự tra khi làm): Mai Hoa, Kỳ Môn, Lục Diệu.
## Nguồn
**Máy** (cài vào thư mục tạm, không cài vào repo):
- A: 5 lá số Altuvi (`scripts/doi-chieu/mau-altuvi.json`, so bằng `so-altuvi.*`). Ca E ra năm Tân Tỵ; ca A, B có ngày âm khớp lịch +7 (lịch +8 ra 24/1 và 29/11); ca C sinh 25/2 nhuận được tính tháng 2; ca D lấy đúng giờ nhập.
- M2: `ansaotuvi` 0.1.28. `lapDiaBan` dùng số tháng âm và bỏ cờ nhuận; năm là năm âm HND; giờ chỉ là chi (1 = Tý), ngày do người gọi chọn. M7: `tuvi-mcp-server` 0.5.0 (tử vi Việt dựa trên `ansaotuvi`): `adjust_date_for_late_ty` cộng 1 ngày khi sinh giờ 23.
- M3: `iztro` 2.6.2 (`astro/config.js`). `yearDivide` và `horoscopeDivide` mặc định `normal` (mùng 1 Giêng; `exact` là Lập Xuân); `dayDivide` mặc định `forward`; `ageDivide` mặc định `normal` (năm âm − năm âm sinh + 1); `fixLeap` mặc định true.
- M4: `lunar-javascript` 1.7.7 và `lunar-typescript` 1.8.6 (repo đang dùng; chạy thử ra kết quả giống nhau). `EightChar` lấy năm, tháng theo Lập Xuân, tiết đúng thời khắc; `setSect(2)` (mặc định) là phái B, `setSect(1)` là phái A; `getYearNineStar(1|2|3)` là Tết / ngày Lập Xuân / thời khắc Lập Xuân; `getMonthNineStar`, `getZhiXing`, `getDayTianShen` theo tháng tiết; `getYearPositionTaiSui` mặc định Lập Xuân; giờ tiết là +8 (`ONE_THIRD`).
- M5: `sxtwl` 2.0.7 (mã C++ tải từ PyPI). `getYearGZ()` mặc định theo ngày Lập Xuân; `getMonthGZ()` theo tiết; `getShiGz(…, isZaoWanZiShi=true)` cho giờ 23 lấy can Tý của ngày sau. M6: `bazi_core` 1.1.0 (Dart, mã ở https://pub.dev/documentation/bazi_core/1.1.0/): `ratHourMode` mặc định `nextDay`, có thêm `currentDay`, `currentDayTomorrowStem`; `clockMode` mặc định `civil`.
- M8: `Intl` của Node 22.22 (ICU 77.1, tzdata 2025b); các file `asia`, `backzone`, `zone1970.tab` ở https://github.com/eggert/tz. M9: lịch HND trong `ansaotuvi`, chạy với +7 và +8 cho 1930–2030. M10: `astronomy-engine` 2.1.19, tính phương trình thời gian từng ngày năm 2026.

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
## Anh đã quyết (15/10/2026)

1. Sinh từ 23 giờ đến trước 12 giờ đêm: tính **ngày hôm sau** (phái A) — cho cả tử vi và bát tự.
2. Giờ đồng hồ thời dùng +8/+9 (miền Nam 1960–6/1975 và các giai đoạn ở bảng mục 7): app **tự lùi về +7** rồi mới tính; vẫn có tuỳ chọn giữ giờ nhập như Altuvi.
3. Cung phi của người sinh giữa Tết và Lập Xuân: theo **Lập Xuân**.
4. Ngày âm trước 1968: theo **+7** như trang anh tin (ảnh 19/10: 1938, 1965 khớp +7, lịch TQ lệch tháng) — `docs/NGUON_MO.md`. Người nhà nhớ ngày âm theo lịch thời đó (+8) có thể lệch ở ngày hai lịch vênh → app ưu tiên nhập ngày dương; chỉ có ngày âm thì cảnh báo ở các ngày vênh.
5. (19/10) Trực, ngày hoàng/hắc đạo, nên/kiêng, sao theo tháng: theo **tháng âm** như lịch Việt trên mạng (baohatinh, chogia, baolamdong, xemlicham khớp 4/4 ngày thử) — không cần ảnh lịch nữa.
