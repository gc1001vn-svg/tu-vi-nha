# Nguồn mở cho cả dự án

Tra 14/10/2026. Quá 6 tháng thì tra lại (luật kho: `quyet-dinh/2026-09-10-du-an-moi-phai-tra-nguon-mo-truoc.md`).
Cột "Đã kiểm": **máy** = đọc thẳng từ kho npm/PyPI hoặc chạy thử trong máy ảo · **web** = trang thứ ba, chưa đối chiếu trang gốc.

## Thư viện — dùng trong app

| Tên | Bản · giấy phép | Có gì | Đợt | Đã kiểm |
|---|---|---|---|---|
| `iztro` | 2.6.2 · MIT | Tử vi đẩu số: lá số 12 cung, đại vận, lưu niên/nguyệt/nhật/thời; **có tiếng Việt `vi-VN`**; lập từ ngày dương (`bySolar`) hoặc ngày âm (`byLunar`); có cơ chế plugin | 2 | máy: bản, giấy phép, 19 file `vi-VN`, hàm `byLunar`. **Không chọn làm lõi** — xem "Đối chiếu altuvi.com". 20/10: `horoscope` làm bảng vàng phái lưu nguyệt khởi Lưu Thái Tuế (`tests/vang/luu-han-iztro.json`, 200/200) |
| `react-iztro` | 1.5.0 · MIT | Vẽ lá số `iztro` (cần React) — **không dùng** vì bỏ `iztro` làm lõi | — | máy |
| `lunar-javascript` | 1.7.7 · MIT | Can chi, tiết khí, bát tự, thập thần, ngũ hành, 12 trực, 28 tú, hoàng đạo, nên/kiêng, hướng thần tài/hỷ thần. **Chữ ra tiếng Trung** (chỉ có `chs`, `en`) → cần bảng Hán–Việt | 1, 3 | máy |
| `lunar-typescript` | 1.8.6 · MIT | **Chọn dùng (14/10)** — bản TypeScript của `lunar-javascript`, cùng tác giả, có sẵn khai kiểu. Chữ ra tiếng Trung → bảng Hán–Việt `src/loi/hanViet/` | 1, 3 | máy: 73.414 ngày 1900–2100 ra y hệt `lunar-javascript` 1.7.7 (42 hàm mỗi ngày; cửu tinh, bát tự, 13 giờ mỗi 7 ngày), **trừ** `getDayXiongSha` 300 ngày lộ mã i18n `sn.sanSang`, `sn.guiKu`, `sn.siLi`, `sn.daTui` thay cho 三丧 鬼哭 四离 大退 — lỗi thư viện, bảng Hán–Việt đỡ (`scripts/doi-chieu/so-lunar-ts.mjs`) |
| `tyme4ts` | 1.5.3 · MIT | Bản mới của cùng tác giả `lunar` (cập nhật 03/10/2026) | 1, 3 | máy: chưa xem chức năng bát tự |
| `@tuquet/lunar` | 0.1.0 · MIT | **Âm lịch Việt Nam — đang dùng (`src/loi/amLich.ts`).** Chính là thuật toán HND (+7), 13,7 KB; khớp bảng vàng mọi ngày trừ 2 ngày "ngày 0" (lõi chặn) | 1 | máy: chạy 73.383 ngày. Mới (09/2026), một tác giả → nhỏ, chép vào repo được nếu bị bỏ |
| `@dqcai/vn-lunar` | 1.0.1 · MIT | Âm lịch Việt Nam — **bỏ**: khác HND 987 ngày, rải 30 năm (1900–1967, 2054–2077) | — | máy |
| `circular-natal-horoscope-js` | 1.1.0 · Unlicense | Lá số chiêm tinh Tây: hành tinh, cung nhà (nhiều hệ), góc chiếu. Cũ (2022), dựa `moment` — **không dùng** (22/10): `astronomy-engine` đủ, Placidus tự viết | — | máy |
| Groq API (dịch vụ, không phải thư viện) | gói miễn phí · điều khoản Groq | AI tổng hợp, hỏi đáp (`src/giaoDien/ai/goi.ts`, gọi bằng `fetch`, không thêm thư viện) — anh chọn 23/10 vì miễn phí; `@anthropic-ai/sdk` 1.1.0 (Apache-2.0) dùng bản đầu cùng ngày rồi gỡ | 7 | web 23/10: không huấn luyện bằng dữ liệu API, nút Zero Data Retention (trang thứ ba); máy 23/10: gọi thật 40 lượt từ Node + 1 lượt từ Chromium (200, chữ chảy dần) → chọn `gpt-oss-120b` (`QUY_UOC` mục 25) |
| `astronomy-engine` | 2.1.19 · MIT | Vị trí Mặt Trời, Mặt Trăng, hành tinh — **đang dùng** cho lõi chiêm tinh `src/loi/chiemTinh.ts` (nạp lười, ~87 KB) | 6 | máy 22/10: 300 ca so `pyswisseph` lệch ≤2′, cung, nhà, nghịch hành khớp hết (`QUY_UOC` mục 23) |
| `@mediapipe/tasks-vision` | 1.1.1 · Apache-2.0 | Điểm mốc khuôn mặt — **đang dùng** cho tướng mặt (`src/giaoDien/khoi/tuongMatMp.ts`, nạp khi bấm); mô hình `face_landmarker` float16 bản 1 (thẻ mô hình: Apache 2.0) trong `public/mediapipe/` | 7 | máy 23/10: Chromium 7 ảnh chân dung, lật gương lệch ≤1,05 % (`QUY_UOC` mục 26); iPhone thật: **chưa** |
| `cnlunar` | 0.2.5 · MIT | Hoàng lịch Python tự tính nên/kiêng theo thần sát (bảng khác `lunar-*`) — **chỉ để đo**: chạy ở thư mục tạm (`chay.sh`) | 4 | máy: 21/10 so nên/kiêng 7 việc 2.008 ngày — nên trùng 73,5 %, kiêng 60,9 % (`QUY_UOC` mục 19) |
| `sweph` (Swiss Ephemeris) | AGPL/LGPL | Chính xác nhất cho chiêm tinh | — | máy; **không dùng**: nặng, `astronomy-engine` đủ |

## Số đo 14/10/2026 (chạy trong máy ảo, kịch bản ở `scripts/doi-chieu/`)

**Lịch âm, 73.383 ngày (01/02/1900–31/12/2100), so với thuật toán Hồ Ngọc Đức (HND) bản trong `ansaotuvi`:**
- HND giờ VN (+7) khác HND giờ Bắc Kinh (+8): **2.814 ngày** — lịch âm VN và TQ khác nhau thật.
- `lunar-javascript` (lịch TQ) khác HND +7: **2.785 ngày** → **không dùng nó để ra ngày âm VN.**
- `@tuquet/lunar` khác HND +7 của `ansaotuvi`: **59 ngày, đều năm 1900** (25/08–22/10). **Đo lại 19/10: `ansaotuvi` sai, không phải `@tuquet`** —
  tháng bắt đầu 24/09/1900 không có trung khí (góc Mặt Trời đầu tháng và đầu tháng sau cùng cung 6, `getSunLongitude` +7) → nhuận tháng 8;
  `@tuquet/lunar` và `lunar-typescript` cùng ra nhuận 8. Bảng vàng đã sửa theo đó. `@dqcai/vn-lunar`: 987 ngày.
- `ansaotuvi.S2L` (HND) và `@tuquet/lunar` trả **ngày âm 0** cho 07/05/2054 và 09/04/2062 (lỗi ở ranh tháng); bảng vàng `tests/vang/am-lich-hnd.json` ghi 30/3/2054, 30/2/2062 (khớp `lunar-javascript`) → lõi chặn: "ngày 0" = ngày cuối tháng trước. Đo 15/10; 19/10 tính trăng mới (`newMoon` của `@tuquet`) lúc 00:03 ngày 08/05/2054 và 00:18 ngày 10/04/2062 giờ +7 → hai ngày đó đúng là ngày 30. Trăng mới sát 0 giờ vài phút: sai số công thức có thể lật ngày — **chưa chắc**, theo HND.
- `@dqcai/vn-lunar` trước 1968 trùng HND **+8** (24.594 ngày, khác 211), 1968–2030 trùng +7: giống lịch Việt trước 1968 tính theo +8 (suy từ số, chưa có tài liệu) → chờ ảnh anh chụp (`docs/TIEN_DO.md`).
- Mốc đã biết khớp: Tết 1985 VN 21/01 (TQ 20/02) · Tết 2007 VN 17/02 (TQ 18/02) · Tết 2026 cả hai 17/02.
- **Nguồn thứ ba (19/10):** trang đổi ngày dương sang âm (xemlicham, anh tìm trên mạng — không phải trang anh tin, 21/10), 5 ảnh (1938, 1965, 1968, 1985, 1987) khớp bảng vàng HND +7 **25/25 ô**; 21/10 thêm 4 ảnh năm 2026 (ngày khác mùng 1) → **45/45 ô** (ngày âm, can chi ngày, can chi tháng, tiết, giờ hoàng đạo) — `scripts/doi-chieu/mau-lich.json`, `so-anh-lich.mjs`. Trang tính +7 cả trước 1968; can chi tháng theo **tháng âm** (thư viện theo tiết, lệch cả 5).

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
- **Lõi tử vi TypeScript 19/10** (`src/loi/tuVi/laSo.ts`, chép `ansaotuvi` 0.1.28): 5 lá Altuvi **345/345**; 3.000 lá ngẫu nhiên (`scripts/doi-chieu/tu-vi-py.py` + `so-tu-vi.ts`): phái `ansaotuvi` khớp 3.000/3.000, phái `altuvi` chỉ lệch 4 nhóm đã định (Thiên Giải 2.719 lá, Phá Toái 2.018, Hỏa/Linh 758, năm Canh 338). Mệnh chủ theo chi cung Mệnh, Thân chủ theo chi năm (*Toàn Thư* + đa số trang Việt; tuỳ chọn theo tuổi như Quản Xuân Thịnh 1950; `ansaotuvi` tra nhầm theo can năm) — `QUY_UOC` mục 15; Altuvi chưa biết (phải trả tiền). Lỗi thư viện không chép: độ sáng Thiên Hình/Thiên Riêu dính giữa các lá, Tuần/Triệt chỉ đánh dấu một cung, ô sinh khắc Thủy–Hỏa.
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
| `tuvi-mcp-server` (Python) | 0.5.0 · Apache-2.0 (0.3.1 là MIT) | Tử vi VN dựa `ansaotuvi` + 51 cách cục, 12 trực, 28 tú; **vận hạn** (`_transit.py`: tiểu, nguyệt, nhật hạn, 7 sao lưu) → bảng vàng `tests/vang/luu-han-mcp.json` | máy: PyPI. **Đo 20/10:** lõi lưu hạn TS khớp 200/200 ca (cài `--no-deps` + `pillow`, xem `chay.sh`) |
| `sxtwl` (Python/C++) | 2.0.7 · BSD | Lịch Trung Quốc, tiết khí → đối chiếu bát tự | máy: PyPI. **Đo 19/10** (`scripts/doi-chieu/so-bat-tu.*`, 2.700 ca): bốn trụ ca thường 2.339/2.339; 361 ca ngày giao tiết khớp khi lấy theo thời khắc tiết của `sxtwl` (197 ca khác cách "theo cả ngày"); ngày + giờ phái A 2.700/2.700; thời khắc 2.411 tiết lệch `lunar-typescript` tối đa 54,4 giây; `sxtwl` tự vênh ngày 07/12/1917 |
| `lunar_python` | 1.4.8 · MIT | Cùng tác giả `lunar-javascript` — **không độc lập**, chỉ để thử nhanh | máy: PyPI |
| `kinqimen` (Python) | 0.0.6.6 · MIT | Kỳ Môn Độn Giáp → chép thuật toán sang TypeScript | máy: PyPI |
| `pyswisseph` (Python) | 2.10.3.2 · AGPL | Swiss Ephemeris (lõi của astro.com) → bảng vàng chiêm tinh `tests/vang/chiem-tinh-swe.json` (`chiem-tinh-swe.py` trong `chay.sh`) | máy 22/10: bản Moshier, không cần file .se1 |
| `iztro-py` | 0.5.0 | Bản Python của `iztro` — không độc lập | máy: PyPI |
| Unihan 17.0.0, trường `kVietnamese` | Unicode; bản chép GitHub `vearvip/hanzi-readings` (MIT) vì unicode.org bị chặn | Âm Hán–Việt từng chữ, đối chiếu bảng Hán–Việt (`scripts/sinh_am_doi_chieu.mjs`) | máy: gộp với dòng dưới, 702/703 chữ `lunar-typescript` ra có âm |
| `hanviet.csv` (`ph0ngp/hanviet-pinyin-wordlist`) | MIT · tổng hợp Thiều Chửu, Trần Văn Chánh… | Nguồn âm Hán–Việt thứ hai, chữ phồn thể (giản thể tra qua `kTraditionalVariant` của Unicode) | máy |

**Bỏ:** `@min98/vnlunar` (chỉ cho dùng phi thương mại) · `amlich` npm 0.0.2 (không ghi giấy phép).

## Văn bản, hình ảnh

| Nguồn | Tình trạng | Đợt | Đã kiểm |
|---|---|---|---|
| Kinh Dịch nguyên văn chữ Hán | Cổ thư, hết bản quyền; Kanripo không ghi giấy phép → chỉ lấy chữ, bỏ dấu câu người biên tập | 4 | máy 20/10: `kanripo/KR1a0001` tệp `KR1a0001_001`–`_069.txt` trên raw.githubusercontent.com (64 quẻ, 386 hào) · bản Wikisource chụp lại `robolong/zhengming` `data-sources/wikisource/周易/` (CC BY-SA, chỉ để soát): 63 chỗ dị văn · bản thứ ba `Guopop/chinese-philosophy` `经/易类/周易.json` theo Kanripo 34 chỗ, Wikisource 10 · luật Chu Hy (考變占): `kanripo/KR1a0062` tệp `_002` · **20/10** → `src/loi/kinhDichChu.ts` (lời quẻ Cấn bị mất chữ 艮 khi tách, đã thêm lại; `QUY_UOC` mục 18) |
| 梅花易數 (Mai Hoa) | Cổ thư | 4 | máy 20/10: `ShousenZHANG/chinese-fortune` `knowledge/books/meihua/c001`–`c003.json` (MIT, chụp Wikisource); 14 ví dụ trong sách tính lại khớp 14/14 · đối chiếu `meihua-ts-lib` 0.1.0 (npm, GPL → chỉ chạy ngoài repo; đổi năm theo Lập Xuân): 300 giờ ngẫu nhiên khớp 291, 9 lệch đều giải thích được (`scripts/doi-chieu/so-mai-hoa.mjs`) |
| Kinh Dịch bản dịch Ngô Tất Tố, Phan Bội Châu | Người dịch mất 1954, 1940 → hết hạn bảo hộ theo luật VN (50 năm sau khi mất); **bản in 2007 có thể kèm chú thích mới** | 4 | web: [thư viện ĐH Hải Phòng](https://lib.hpu.edu.vn/jspui/handle/123456789/22) chỉ có bản hạn chế |
| Truyện Kiều (bói Kiều) | Hết bản quyền (Nguyễn Du); chỉ lấy câu thơ, không lấy chú thích các bản in | 4 | máy 20/10: bản A `congmnguyen/kieu-gpt` `input.txt` (chép Wikisource; 3.254 câu, đủ luật 6/8) · bản B `tiepvupsu/ebookMLCB` `Chapters/01_Overview/11_featureengineering/TruyenKieu.txt` (độc lập, lệch A 480 câu, có lỗi mã chữ) · bản in OCR archive.org `truyen-kieu-nguyen-du-nom-quoc-ngu` · ảnh Bùi Kỷ – Trần Trọng Kim 1927 archive.org `truyen-thuy-kieu-bui-ky-tran-trong-kim-1927` · 20 hồi: Nguyễn Can Mộng 1936 (archive.org `TruyenKieuNguyenCanMong1936`) · cách bói: Phan Kế Bính (`VietNamPhongTucPKB1915`), Phạm Đan Quế 1991 (`boi-kieu-binh-kieu-vinh-kieu-pham-dan-que`) · **soát 20/10** ba bản A, B, OCR → `src/loi/truyenKieu.txt` (`QUY_UOC` mục 17, `scripts/doi-chieu/soat-kieu.py`) |
| Bài tarot 1909 (Pamela Colman Smith) | Hết bản quyền ở Mỹ; Anh/EU từ 01/01/2022. **Bản tô màu 1971 và tên "Rider-Waite" thì không** · **đang dùng (22/10)**: 78 bản quét "Pam-A" (Holly Voley) trên Wikimedia Commons → `public/tarot/` (`scripts/tai_tarot.py`) | 6 | web: [Wikipedia](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot), [WOPC](https://wopc.co.uk/tarot/rider-waite); máy: 78 tệp tải từ `upload.wikimedia.org` |
| *The Pictorial Key to the Tarot* (Waite, 1910) | Hết bản quyền (Waite mất 1942) | 6 | máy 22/10: bản sacred-texts lưu trên archive.org (`a.-e.-waite-the-pictorial-key-to-the-tarot`), đọc mục Thập tự Celtic |
| Toạ độ 64 tỉnh lỵ (`src/loi/toaDo.ts`) | GeoNames cities1000 (CC BY 4.0, bản chép `lutangar/cities.json`); đối chiếu Natural Earth 10m populated places (phạm vi công cộng) | 6 | máy 22/10: 64/64 tìm thấy, 52 nơi hai bộ lệch ≤0,074° |
| Ký hiệu chiêm tinh (`src/giaoDien/khoi/kyHieu.ts`) | Phông DejaVu Sans 2.37: Bitstream Vera © 2003 Bitstream; phần thêm của DejaVu thuộc phạm vi công cộng | 6 | máy: trích bằng `scripts/ky_hieu_sao.py` (fonttools) |
| Lời giải tử vi, bát tự, phong thủy | Sách hiện đại còn bản quyền → **Claude soạn lời mới** theo quan niệm truyền thống, ghi rõ là soạn lại | 2–6 | — |
| *Tử Vi Đẩu Số Tân Biên* (Vân Đằng Thái Thứ Lang, Sài Gòn 1956) | Bản OCR trên archive.org (6 phần, `_djvu.txt`); năm mất tác giả **chưa rõ** → coi như còn bản quyền: chỉ lấy quy tắc và nghĩa sao, Claude viết lại, không chép văn | 2 | máy: tải qua proxy 20/10, đọc mục 10.4–10.6, phần II mục 2–3, phần III mục 1, 2, 4 (`QUY_UOC` W42) |
| Kinh Mật tông về Cửu Diệu (宿曜經 T1299, T1308, T1311), 玉匣記 (Đạo tạng DZ1480); bản khắc *Toàn Thư*, *Uyên Hải Tử Bình* trên archive.org | Cổ thư, hết bản quyền | 2 | máy: 20/10 (anh mở mạng) tải bản XML CBETA (github.com/cbeta-org/xml-p5) T1299, T1308, T1311 — đọc được, T1308 và T1311 có bảng 行年 trùng vòng sao nam (`QUY_UOC` mục 14, W45); tripitaka.cbeta.org đổi cấu trúc (404), ctext tự chặn (403); 諸神聖誕日玉匣記等集 (DZ1480–1481) đọc bản Kanripo trên GitHub: có bảng nam nữ theo tuổi, ngày cúng 9 sao (W45); bản archive.org (`20260506_20260506_1217`, `20260506_20260506_1149`) chữ khắc dọc, OCR hỏng |

## Quy tắc tính — nguồn web, phải có ≥2 nguồn khớp trước khi viết

| Món | Quy tắc tìm được | Chỗ các nguồn vênh | Nguồn |
|---|---|---|---|
| Kim Lâu | Tuổi mụ chia 9, dư 1, 3, 6, 8 là phạm | Có cách xét hàng đơn vị/cộng chữ số → không trùng mọi tuổi | [dienmayxanh](https://www.dienmayxanh.com/kinh-nghiem-hay/kim-lau-la-gi-huong-dan-tinh-va-hoa-giai-han-kim-lau-1586579), [hoatieu](https://hoatieu.vn/tai-lieu/tuoi-kim-lau-la-gi-cach-tinh-tuoi-kim-lau-205417) |
| Hoang Ốc | (chục + đơn vị tuổi mụ) chia 6, 10 tuổi ở Nhất Cát, mỗi chục quay về cung của chục | Đếm liền từ 10 tuổi → tuỳ chọn `hoangOc`; bỏ "tuổi mụ chia 6" và "bảng cách 9 năm" (trái quy tắc 20 tuổi Nhì Nghi) | dienmayxanh, nhadepktv, homedy, mogi, vinhomes (19/10) |
| Sao hạn Cửu Diệu + 8 hạn | Sao: tuổi mụ chia 9, nam nữ khác vòng. Hạn: (chục + đơn vị tuổi mụ) chia 8 | Các trang tử vi đặt bảng 2027 ngay cạnh bảng 2026 — dễ lấy nhầm; Thủy Diệu tốt (nhiều trang) hay trung tính (app) | luatminhkhue, thuvienphapluat, lichngaytot, tuoiam, hoatieu, phongthuyviet — 19/10: khớp 144/144 ô năm 2026, 8/8 năm 2025; 20/10: vòng nam trùng bảng chùa Nhật 9/9 (`QUY_UOC` W43), kinh 1308, 1311; *Ngọc Hạp Ký* (Đạo tạng) nam 86/89, nữ 83/89 (W45) |
| Tam Tai, Thái Tuế | Tam Tai theo nhóm tam hợp chi năm sinh; Thái Tuế: trùng, xung, hình (tam hình + tự hình), hại, phá | Tuổi thứ năm của năm Ngọ (Dậu phá; "thiên xung" Mão, Dậu hay Mão, Sửu) mỗi thầy Hồng Kông, Đài Loan một khác — không theo | luatminhkhue, batdongsan wiki, vietnamnet, soha, kenh14, tvbs (19/10); 20/10: Hành Thiên Cung, Bộ Nội chính Đài Loan, udn, tvbs, encykorea (Hàn, cùng quy tắc Tam Tai) — `QUY_UOC` W44 |
| Hướng Bát trạch, tuổi hợp | 8 hướng theo biến hào Du Niên (64/64 ô); tam hợp, lục hợp, tứ hành xung, lục hại | Bảng Bát trạch adongadc sai, không theo | batdongsan wiki, vatphamphongthuy, blogphongthuy, dienmayxanh, giaoducthudo (19/10) |
| Thước Lỗ Ban | 3 thước: 52,2 cm (thông thuỷ, 8 cung) · 42,9 cm (dương trạch, 8 cung) · 38,8 cm (âm phần, 10 cung); app chỉ xét cung lớn | Tên cung nhỏ vênh (chưa ô nào 2 nguồn); 52,2 chưa trang nào ghi thẳng màu từng cung; độ dài 52/52,2, 39/38,8 | `QUY_UOC` mục 21, W48 (21/10) |
| Lưu niên, nguyệt, nhật (tử vi) | 9 sao lưu theo can chi năm xem; nguyệt hạn khởi tiểu hạn (Thái Thứ Lang) hoặc Lưu Thái Tuế (Đẩu Quân); nhật hạn từ cung tháng | Nguyệt hạn có nhiều cách → tuỳ chọn `nguyetHanTu`; tháng nhuận khi xem | `QUY_UOC` mục 16, W40 (20/10) |
| Cung phi Bát trạch | Sinh trước Tết → năm âm trước | Sinh giữa Tết và Lập Xuân: hai trường phái khác nhau | [muaban](https://muaban.net/blog/phong-thuy-bat-trach-518866/), [baodautu](https://baodautu.vn/batdongsan/vi-sao-phong-thuy-bat-trach-pho-bien-d102133.html) |
| La bàn iPhone | `DeviceOrientationEvent.requestPermission()` gọi ngay trong lúc bấm; đọc `webkitCompassHeading` | Có báo lỗi bị từ chối dù đã cho phép; chưa thấy nguồn riêng cho app ở màn hình chính | [MDN](https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent), [WebKit 269706](https://bugs.webkit.org/show_bug.cgi?id=269706), [Defold](https://forum.defold.com/t/how-to-force-safari-browser-to-allow-deviceorientation-permission-solved/75641) |
| 24 sơn, hướng nhà | Mỗi sơn 15°, Nhâm từ 337,5°; hướng nhà = nhìn ra từ cửa chính, lưng vào nhà; độ lệch từ VN −0,4° … −1,8° (WMM-2025) | Wikipedia ghi ranh lệch 0,1°; `webkitCompassHeading` bắc từ hay bắc thật chưa thấy tài liệu Apple | `QUY_UOC` mục 20, W47 (21/10) |

## Chưa tìm được — cần anh quyết hoặc tra thêm

- **Cân xương đoán số:** chưa có bảng đủ năm/tháng/ngày/giờ; một nguồn Đài Loan nói không có sử liệu chứng minh là của Viên Thiên Cương ([gvm](https://www.gvm.com.tw/article/105604)).
- **Xin xăm Quan Âm 100 quẻ:** chưa tìm nguồn.
- **Huyền Không phi tinh:** phi tinh năm/tháng đã làm (đợt 5, `QUY_UOC` mục 22: sao giữa từ `lunar-typescript` + Lạc Thư). Huyền Không theo nhà (sao sơn, sao hướng — đợt 8): không thấy thư viện mở, chỉ có trang tính thương mại → tự viết, đối chiếu ảnh chụp trang tính.
- **Giờ Tý (23–24 giờ) thuộc ngày nào, giờ mặt trời thực theo kinh độ:** chưa có nguồn bàn rõ → để thành tuỳ chọn.
- **Giá AI:** chỉ có trang thứ ba. Gemini 3.5 Flash ~1,50 USD/9 USD mỗi triệu token vào/ra ([pricepertoken](https://pricepertoken.com/pricing-page/model/google-gemini-3.5-flash)); giá Claude các trang vênh nhau. Tra lại khi tới đợt 7.
- **Trang gốc thuật toán âm lịch Hồ Ngọc Đức:** máy ảo không vào được → chưa rõ điều kiện dùng mã của ông. Thuật toán (công thức thiên văn) không có bản quyền; dùng thư viện MIT ở trên.
