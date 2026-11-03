# ĐẦU PHIÊN — TỬ VI NHÀ

> **Bảy bước chung A–G ở `so-thich.md` của kho `ghi-nho`** — chạy theo bảng đó.
> File này chỉ ghi thứ **riêng repo này**: lệnh cụ thể và bẫy đang còn sống.

## A. Nạp bối cảnh

```bash
cat docs/TIEN_DO.md
```

Kế hoạch tổng `docs/ke-hoach/2026-10-14-ke-hoach-tong.md`, quy ước tính `docs/QUY_UOC.md`,
thư viện + số đo `docs/NGUON_MO.md` — đọc khi làm tới đúng môn, không đọc hết mỗi phiên.

## B. Dựng lại máy ảo

| Lệnh | Khi nào |
|---|---|
| `npm ci` | chưa có `node_modules` |
| `npm run do` | **luôn**, trước khi động vào mã và trước mỗi commit — số thước tự in, đừng chép vào đây |
| `bash scripts/doi-chieu/chay.sh` | đo lại thư viện với nhau, ~7 phút (cài Python/npm vào thư mục tạm, không đụng repo) |
| `node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/sinh_am_doi_chieu.mjs` | khi nâng `lunar-typescript` — sinh lại âm Hán–Việt độc lập cho thước đối chiếu |
| `python3 scripts/ve_icon.py` | vẽ lại icon (Thái cực + Bát quái, anh chọn 14/10) |
| `python3 scripts/ky_hieu_sao.py` | vẽ lại ký hiệu chiêm tinh từ phông DejaVu (cần `pip install fonttools`) |
| `node --experimental-strip-types --disable-warning=ExperimentalWarning --import ./scripts/doi-chieu/nap-raw.mjs scripts/doi-chieu/do-ai.ts <thư_mục_tạm> [0,4] [mô_hình,…] [tong,bay,sau,kieu] [100000]` | đo AI thật qua Groq (QUY_UOC mục 42): lời tổng hợp, 10 câu bẫy, 4 câu hỏi sâu, 2 quẻ Kiều; trần token, Groq báo hết hạn mức ngày thì dừng. **Khoá dùng chung cả nhà** (200.000 token/ngày): đo lúc đêm, mỗi ngày tối đa một lượt. Cần `GROQ_API_KEY` trong bí mật môi trường và mạng tới `api.groq.com` |
| `git worktree add <tạm>/cu ea3f70a && ln -s $PWD/node_modules <tạm>/cu/ && node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-ai-so.ts <tạm>/cu <tạm> 3` | đo so bản mã cũ với mô hình hôm nay (một câu hỏi thêm × 3): tách điểm tụt do dữ liệu hay do Groq; xong `git worktree remove <tạm>/cu` |
| `npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/do-mat.mjs <thư_mục_tạm>` | đo tướng mặt trên bản dựng (Chromium, 57 ảnh phạm vi công cộng tải vào thư mục tạm, ~3 phút; in phân bố để đặt ngưỡng lời giải): cần mạng tới upload.wikimedia.org lần đầu (tải dồn bị 429 → chạy lại, ảnh đã tải được giữ) |
| `node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/do-chi-tay.ts <thư_mục_tạm> [5]` | đo AI diễn giải, dự đoán chỉ tay thật qua Groq (5 khung giả + 4 câu bẫy, ~10 phút vì hạn mức): cần `GROQ_API_KEY` và mạng tới `api.groq.com` |
| `npm run build && NODE_PATH=$(npm root -g) node scripts/doi-chieu/do-chi-tay-anh.mjs <thư_mục_tạm>` | đo máy tự dò chỉ tay trên bản dựng (Chromium, 8 ảnh Commons tải vào thư mục tạm, lần đầu ~2 phút vì cách nhau 15 giây; in ô trùng, ghi ảnh vẽ đường để soát bằng mắt) |

`npm run do` chạy ra file rồi `grep`, đừng `| tail` (không in gì tới lúc xong):
`npm run do > <scratchpad>/do.txt 2>&1`.

Bẫy: `check:ten` (bản chuẩn `ghi-nho/cong-cu/check_ten.mjs`) bắt nhầm mọi chữ có đuôi "gate" (`delegate`, `navigate`…) vì cờ `i`
áp cả nhánh bắt camelCase — tránh chữ đó, hoặc sửa ở `ghi-nho` (sửa ở đây thì `cai_dat.mjs` ghi đè). Thấy 23/10.

## C. Dữ liệu người dùng, khoá API — repo Public

- Hồ sơ, ngày sinh, ảnh người nhà **chỉ nằm trong máy** (trình duyệt), không bao giờ vào repo.
  Ca kiểm dùng **ngày sinh giả** (`scripts/doi-chieu/mau-altuvi.json`).
- Gọi trang ngoài (Wikisource, archive.org…): User-Agent tên chung `tu-vi-nha/1.0 (+https://github.com/gc1001vn-svg/tu-vi-nha)` — **không kèm email ai** (03/11 lỡ gửi email anh cho Wikisource; repo, lịch sử git không có).
- Khoá API (đợt 7): người dùng nhập trên từng máy. Không vào git, không gõ vào chat, không đặt vào thân
  lệnh `Bash`. `check:khoa` trong `npm run do` quét hình dạng khoá trong mọi file git theo dõi.

## D. Lõi thuần

`src/loi/` (lịch, can chi, lá số, bảng Hán–Việt): cấm trình duyệt, đồng hồ, ngẫu nhiên, locale —
ESLint chặn. Giờ "bây giờ" nhận qua tham số. Nhờ vậy test chạy trong Node, so với bộ ca kiểm vàng `tests/vang/`.

## E. Bảng Hán–Việt (`src/loi/hanViet/`)

`lunar-typescript` chỉ ra chữ Hán giản thể. Mọi chữ hiện ra phải qua bảng này, có ba thước:
`tests/HanViet.test.ts` (phủ đủ, không thừa, đúng quy ước chữ) · `tests/HanVietDoiChieu.test.ts` (âm từng chữ khớp
Unihan + từ điển `hanviet.csv`; khác thì mục phải ghi `lyDo`). Chỉ kiểm vài nhóm: `NHOM=thanSat npx vitest run tests/HanViet`.

## G. Cho anh xem

Máy ảo **không mở được trang thật** (`github.io` và mọi hosting bị chặn). Đã đẩy `main` thì đưa link
https://gc1001vn-svg.github.io/tu-vi-nha/ — số phiên bản ở chân trang cho anh biết đang xem bản nào.
