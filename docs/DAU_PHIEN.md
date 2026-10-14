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
| `bash scripts/doi-chieu/chay.sh` | khi cần đo lại thư viện với nhau (cài Python/npm vào thư mục tạm, không đụng repo) |
| `node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/sinh_am_doi_chieu.mjs` | khi nâng `lunar-typescript` — sinh lại âm Hán–Việt độc lập cho thước đối chiếu |
| `python3 scripts/ve_icon.py` | vẽ lại icon (Thái cực + Bát quái, anh chọn 14/10) |

`npm run do` chạy ra file rồi `grep`, đừng `| tail` (không in gì tới lúc xong):
`npm run do > <scratchpad>/do.txt 2>&1`.

## C. Dữ liệu người dùng, khoá API — repo Public

- Hồ sơ, ngày sinh, ảnh người nhà **chỉ nằm trong máy** (trình duyệt), không bao giờ vào repo.
  Ca kiểm dùng **ngày sinh giả** (`scripts/doi-chieu/mau-altuvi.json`).
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
