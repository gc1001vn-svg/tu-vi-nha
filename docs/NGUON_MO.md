# Nguồn mở cho cả dự án

Tra 14/10/2026. Quá 6 tháng thì tra lại (luật kho: `quyet-dinh/2026-09-10-du-an-moi-phai-tra-nguon-mo-truoc.md`).
Cột "Đã kiểm": **máy** = đọc thẳng từ kho npm/PyPI hoặc chạy thử trong máy ảo · **web** = trang thứ ba, chưa đối chiếu trang gốc.

## Thư viện — dùng trong app

| Tên | Bản · giấy phép | Có gì | Đợt | Đã kiểm |
|---|---|---|---|---|
| `iztro` | 2.6.2 · MIT | Tử vi đẩu số: lá số 12 cung, đại vận, lưu niên/nguyệt/nhật/thời; **có tiếng Việt `vi-VN`**; lập từ ngày dương (`bySolar`) hoặc ngày âm (`byLunar`); có cơ chế plugin | 2 | máy: bản, giấy phép, 19 file `vi-VN`, hàm `byLunar`. **Không chọn làm lõi** — xem "Đối chiếu altuvi.com" |
| `react-iztro` | 1.5.0 · MIT | Vẽ lá số `iztro` (cần React) — **không dùng** vì bỏ `iztro` làm lõi | — | máy |
| `lunar-javascript` | 1.7.7 · MIT | Can chi, tiết khí, bát tự, thập thần, ngũ hành, 12 trực, 28 tú, hoàng đạo, nên/kiêng, hướng thần tài/hỷ thần. **Chữ ra tiếng Trung** (chỉ có `chs`, `en`) → cần bảng Hán–Việt | 1, 3 | máy |
| `tyme4ts` | 1.5.3 · MIT | Bản mới của cùng tác giả `lunar` (cập nhật 03/10/2026) | 1, 3 | máy: chưa xem chức năng bát tự |
| `@tuquet/lunar` | 0.1.0 · MIT | **Âm lịch Việt Nam — chọn dùng.** Khớp thuật toán HND (+7) mọi ngày 1901–2100 | 1 | máy: chạy 73.383 ngày. Mới (09/2026), một tác giả → nhỏ, chép vào repo được nếu bị bỏ |
| `@dqcai/vn-lunar` | 1.0.1 · MIT | Âm lịch Việt Nam — **bỏ**: khác HND 987 ngày, rải 30 năm (1903–1967, 2054–2077) | — | máy |
| `circular-natal-horoscope-js` | 1.1.0 · Unlicense | Lá số chiêm tinh Tây: hành tinh, cung nhà (nhiều hệ), góc chiếu. Cũ (2022), dựa `moment` | 6 | máy |
| `astronomy-engine` | 2.1.19 · MIT | Vị trí Mặt Trời, Mặt Trăng, hành tinh (dự phòng/đối chiếu) | 6 | máy |
| `@mediapipe/tasks-vision` | 1.1.0 · Apache-2.0 | Điểm mốc khuôn mặt, bàn tay — chạy ngay trong máy | 7 | máy; chạy trên iPhone thật: **chưa** |
| `sweph` (Swiss Ephemeris) | AGPL/LGPL | Chính xác nhất cho chiêm tinh | — | máy; **không dùng**: nặng, `astronomy-engine` đủ |

## Số đo 14/10/2026 (chạy trong máy ảo, kịch bản ở `scripts/doi-chieu/`)

**Lịch âm, 73.383 ngày (01/02/1900–31/12/2100), so với thuật toán Hồ Ngọc Đức (HND) bản trong `ansaotuvi`:**
- HND giờ VN (+7) khác HND giờ Bắc Kinh (+8): **2.814 ngày** — lịch âm VN và TQ khác nhau thật.
- `lunar-javascript` (lịch TQ) khác HND +7: **2.785 ngày** → **không dùng nó để ra ngày âm VN.**
- `@tuquet/lunar` khác HND +7: **59 ngày, đều năm 1900** (vị trí tháng nhuận). `@dqcai/vn-lunar`: 987 ngày.
- Mốc đã biết khớp: Tết 1985 VN 21/01 (TQ 20/02) · Tết 2007 VN 17/02 (TQ 18/02) · Tết 2026 cả hai 17/02.
- Chưa có nguồn thứ ba độc lập (trang HND bị chặn) → đợt 0 nhờ anh chụp 3–5 trang lịch âm từ app anh tin.

**Tử vi, 3.000 lá số ngẫu nhiên (1930–2030, bỏ giờ Tý), `iztro` so với `ansaotuvi` (sách Việt):**
- `iztro` lập từ ngày dương (lịch TQ): mệnh lệch 55 ca, ≥1 chính tinh lệch **119 ca (4 %)**.
- `iztro` lập từ **ngày âm VN**: mệnh lệch 39 ca, chính tinh lệch **16 ca (0,5 %)** — đều nằm trong 83 ca sinh **tháng nhuận**
  (hai bên chia tháng nhuận khác nhau → tuỳ chọn). 3 ca `iztro` từ chối ngày 30 âm VN mà tháng TQ chỉ có 29 ngày.
- 59 sao trùng tên được so. **Lệch có hệ thống do khác trường phái:** Phi Liêm 94 % · Giải Thần 90 % · Thiên Quý 84 % ·
  Phá Toái 67 % · Linh Tinh 60 % · Hỏa Tinh 57 % · Thiên Khôi, Thiên Việt 42 % · Hóa Khoa 19 % · Hóa Kỵ 11 % · Thiên Trù 9 %.
- Sao chỉ có ở một bên: chưa so. `ansaotuvi` cũng chỉ là MỘT cách an sao Việt — chuẩn cuối là lá số từ trang anh tin.

**Đối chiếu altuvi.com (trang anh tin; ảnh anh chụp 14/10; 5 lá số ngày sinh giả — `scripts/doi-chieu/mau-altuvi.json`, `so-altuvi.*`):**

| Ca | Sinh | `ansaotuvi` khớp | `iztro` khớp |
|---|---|---|---|
| A | Nam 15/03/1985 giờ Sửu | 66/69 | 54/57 |
| B | Nữ 08/01/1997 giờ Mùi (30/11 âm) | 67/69 | 33/57 — từ chối ngày 30 âm VN, lùi lịch TQ thì lệch cả 14 chính tinh |
| C | Nam 15/04/2023 giờ Tỵ (25/2 **nhuận**) | 67/69 | 43/57 — lệch cả Mệnh, Thân |
| D | Nữ 15/06/1970 giờ Thìn | 63/69 | 52/57 |
| E | Nam 02/02/2001 giờ Mão (sau Tết, trước Lập Xuân) | 66/69 | 53/57 |
| **Tổng** | | **329/345 (95 %)** | **235/285 (82 %)** |

- Ngày âm khớp HND +7 cả 6 mốc (5 ca + 14/10/2026 = 5/9 Bính Ngọ). Mệnh, Thân `ansaotuvi` khớp Altuvi 5/5.
- **Kết luận: lõi tử vi theo `ansaotuvi` (chép sang TypeScript), không theo `iztro`.** Chỗ `ansaotuvi` khác Altuvi → theo Altuvi:
  - **Thiên Giải** lệch 4/5 ca. Altuvi = khởi Thân tháng Giêng, đi thuận đến tháng sinh (khớp 5/5).
  - **Phá Toái** lệch ca B, C, E. Altuvi = năm Tý Ngọ Mão Dậu → Tỵ · Dần Thân Tỵ Hợi → Dậu · Thìn Tuất Sửu Mùi → Sửu (khớp 5/5).
  - **Hỏa Tinh, Linh Tinh** lệch ca A, E (năm Sửu, Tỵ). Altuvi = khởi theo năm: Dần Ngọ Tuất (Hỏa Sửu, Linh Mão) · Thân Tý Thìn
    (Dần, Tuất) · Tỵ Dậu Sửu (Mão, Tuất) · Hợi Mão Mùi (Dậu, Tuất); dương nam/âm nữ Hỏa thuận Linh nghịch, ngược lại thì đảo —
    đếm tới giờ sinh (khớp 5/5, em tự suy từ 5 lá số).
  - **Năm Canh (ca D):** Altuvi Khôi Ngọ, Việt Dần · Hóa Khoa Thái Âm, Hóa Kỵ Thiên Đồng · Lưu Hà Thìn. `ansaotuvi` theo phái
    khác (Khôi Mùi, Việt Sửu, Khoa Đồng, Kỵ Âm, Lưu Hà Thân) → tuỳ chọn, mặc định Altuvi.
- **Tháng nhuận:** Altuvi tính **cả tháng nhuận như tháng trước** (ca C: 25/2 nhuận → tháng 2), giống `ansaotuvi`.
  `iztro` cắt đôi tháng nhuận (sau ngày 15 sang tháng sau) → lệch.
- Altuvi **không có ô nơi sinh**: ca D (Sài Gòn 1970, khi đó giờ +8) lấy đúng giờ nhập, không lùi 1 giờ → tuỳ chọn ở app.
- Ca E (sau Tết 24/01, trước Lập Xuân 04/02/2001): Altuvi lấy năm Tân Tỵ — tử vi tính năm theo Tết, đúng dự kiến.

## Thư viện — chỉ dùng để đối chiếu khi kiểm (không vào app)

| Tên | Bản · giấy phép | Dùng để | Đã kiểm |
|---|---|---|---|
| `ansaotuvi` (Python) | 0.1.28 · MIT | **Tử vi theo sách Việt** (mã ghi theo sách "Số tử vi dưới góc nhìn khoa học"), lịch âm HND chọn múi giờ → sinh lá số mẫu. ~2.100 dòng → **chép sang TypeScript làm lõi tử vi** (chốt 14/10) | máy: cài, chạy 3.000 lá số |
| `tuvi-mcp-server` (Python) | 0.5.0 · Apache-2.0 (0.3.1 là MIT) | Tử vi VN dựa `ansaotuvi` + 51 cách cục, 12 trực, 28 tú | máy: PyPI |
| `sxtwl` (Python/C++) | 2.0.7 · BSD | Lịch Trung Quốc, tiết khí → đối chiếu bát tự | máy: PyPI |
| `lunar_python` | 1.4.8 · MIT | Cùng tác giả `lunar-javascript` — **không độc lập**, chỉ để thử nhanh | máy: PyPI |
| `kinqimen` (Python) | 0.0.6.6 · MIT | Kỳ Môn Độn Giáp → chép thuật toán sang TypeScript | máy: PyPI |
| `iztro-py` | 0.5.0 | Bản Python của `iztro` — không độc lập | máy: PyPI |

**Bỏ:** `@min98/vnlunar` (chỉ cho dùng phi thương mại) · `amlich` npm 0.0.2 (không ghi giấy phép).

## Văn bản, hình ảnh

| Nguồn | Tình trạng | Đợt | Đã kiểm |
|---|---|---|---|
| Kinh Dịch nguyên văn chữ Hán | Hết bản quyền (cổ thư) | 4 | — chưa lấy được bản số: Wikisource bị máy ảo chặn |
| Kinh Dịch bản dịch Ngô Tất Tố, Phan Bội Châu | Người dịch mất 1954, 1940 → hết hạn bảo hộ theo luật VN (50 năm sau khi mất); **bản in 2007 có thể kèm chú thích mới** | 4 | web: [thư viện ĐH Hải Phòng](https://lib.hpu.edu.vn/jspui/handle/123456789/22) chỉ có bản hạn chế |
| Truyện Kiều (bói Kiều) | Hết bản quyền | 4 | — Wikisource bị chặn; cần bản số |
| Bài tarot 1909 (Pamela Colman Smith) | Hết bản quyền ở Mỹ; Anh/EU từ 01/01/2022. **Bản tô màu 1971 và tên "Rider-Waite" thì không** | 6 | web: [Wikipedia](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot), [WOPC](https://wopc.co.uk/tarot/rider-waite) |
| Lời giải tử vi, bát tự, phong thủy | Sách hiện đại còn bản quyền → **Claude soạn lời mới** theo quan niệm truyền thống, ghi rõ là soạn lại | 2–6 | — |

## Quy tắc tính — nguồn web, phải có ≥2 nguồn khớp trước khi viết

| Món | Quy tắc tìm được | Chỗ các nguồn vênh | Nguồn |
|---|---|---|---|
| Kim Lâu | Tuổi mụ chia 9, dư 1, 3, 6, 8 là phạm | Có cách xét hàng đơn vị/cộng chữ số → không trùng mọi tuổi | [dienmayxanh](https://www.dienmayxanh.com/kinh-nghiem-hay/kim-lau-la-gi-huong-dan-tinh-va-hoa-giai-han-kim-lau-1586579), [hoatieu](https://hoatieu.vn/tai-lieu/tuoi-kim-lau-la-gi-cach-tinh-tuoi-kim-lau-205417) |
| Hoang Ốc | Vòng 6 cung theo tuổi mụ, 10 tuổi ở cung 1 | Cách đếm khi qua chục | [dienmayxanh](https://www.dienmayxanh.com/kinh-nghiem-hay/hoang-oc-la-gi-cach-tinh-tuoi-hoang-oc-1586912), [muaban](https://muaban.net/blog/tuoi-1988-lam-nha-nam-2026-608076/) |
| Sao hạn Cửu Diệu | Tuổi mụ chia 9, nam nữ khác vòng (VD La Hầu: nam dư 1, nữ dư 6) | Chưa thấy bảng đủ 9 sao | [luatminhkhue](https://luatminhkhue.vn/bang-tinh-sao-han-va-cuu-dieu-nam-binh-ngo-2026.aspx), [thuvienphapluat](https://thuvienphapluat.vn/cong-dong-dan-luat/bang-sao-han-nam-2025-at-ty-cho-cac-tuoi-216641.html) |
| Thước Lỗ Ban | 3 thước: 52,2 cm (thông thuỷ) · 42,9 cm (dương trạch) · 38,8 cm (âm phần) | Tên cung, công dụng từng thước vênh giữa các trang | [nukeviet](https://nukeviet.vn/en/store/modules/thuocloban/), [quantrimang](https://quantrimang.com/cuoc-song/thuoc-lo-ban-175844), [baohatinh](https://baohatinh.vn/cong-cu/lo-ban) |
| Cung phi Bát trạch | Sinh trước Tết → năm âm trước | Sinh giữa Tết và Lập Xuân: hai trường phái khác nhau | [muaban](https://muaban.net/blog/phong-thuy-bat-trach-518866/), [baodautu](https://baodautu.vn/batdongsan/vi-sao-phong-thuy-bat-trach-pho-bien-d102133.html) |
| La bàn iPhone | `DeviceOrientationEvent.requestPermission()` gọi ngay trong lúc bấm; đọc `webkitCompassHeading` | Có báo lỗi bị từ chối dù đã cho phép; chưa thấy nguồn riêng cho app ở màn hình chính | [MDN](https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent), [WebKit 269706](https://bugs.webkit.org/show_bug.cgi?id=269706), [Defold](https://forum.defold.com/t/how-to-force-safari-browser-to-allow-deviceorientation-permission-solved/75641) |

## Chưa tìm được — cần anh quyết hoặc tra thêm

- **Lục Diệu (giờ xuất hành Lý Thuần Phong):** chưa có nguồn ghi công thức rõ.
- **Cân xương đoán số:** chưa có bảng đủ năm/tháng/ngày/giờ; một nguồn Đài Loan nói không có sử liệu chứng minh là của Viên Thiên Cương ([gvm](https://www.gvm.com.tw/article/105604)).
- **Xin xăm Quan Âm 100 quẻ:** chưa tìm nguồn.
- **Huyền Không phi tinh:** không thấy thư viện mở, chỉ có trang tính thương mại → tự viết, đối chiếu ảnh chụp trang tính.
- **Giờ Tý (23–24 giờ) thuộc ngày nào, giờ mặt trời thực theo kinh độ:** chưa có nguồn bàn rõ → để thành tuỳ chọn.
- **Giá AI:** chỉ có trang thứ ba. Gemini 3.5 Flash ~1,50 USD/9 USD mỗi triệu token vào/ra ([pricepertoken](https://pricepertoken.com/pricing-page/model/google-gemini-3.5-flash)); giá Claude các trang vênh nhau. Tra lại khi tới đợt 7.
- **Trang gốc thuật toán âm lịch Hồ Ngọc Đức:** máy ảo không vào được → chưa rõ điều kiện dùng mã của ông. Thuật toán (công thức thiên văn) không có bản quyền; dùng thư viện MIT ở trên.
