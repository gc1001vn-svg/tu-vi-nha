# Kế hoạch tổng — tu-vi-nha (bản 2, 14/10/2026)

- Hỏi: ai dùng → Đáp: anh + gia đình
- Hỏi: cài thế nào → Đáp: web cài lên màn hình chính iPhone (PWA); repo `tu-vi-nha`, công khai
- Hỏi: lời giải → Đáp: văn soạn sẵn trước, AI sau
- Hỏi: môn nào → Đáp: có hết; kế hoạch một lần cho tất cả, làm kỹ

Việc: app xem mọi môn từ một hồ sơ (tên, giới tính, ngày giờ + nơi sinh, ảnh, hướng nhà), theo giờ/ngày/tháng/năm/cả đời.
Xong là khi: trên iPhone, mỗi người nhà một hồ sơ; mọi môn ở bảng dưới ra kết quả khớp bộ ca kiểm; dữ liệu chỉ nằm trong máy.

Cách đo: `npm run do` (kiểm lỗi, kiểu, test, đóng gói) + bộ ca kiểm vàng từng môn, sinh từ thư viện đối chiếu độc lập
(`docs/NGUON_MO.md` — đã chạy thử 3.000 lá số, 73.383 ngày âm) + ảnh chụp khổ iPhone. Anh thử máy thật 3 lần: sau đợt 1, 4, cuối.
Khung: Vite + TypeScript + PWA + vitest như `quoc-chien` (không React — lá số 12 ô tự vẽ).

| Đợt | Làm gì · xong là khi |
|---|---|
| 0 | Repo, đồ nghề, lệnh đo · chép kịch bản đối chiếu vào `scripts/doi-chieu/` · bảng Hán–Việt cho chữ ra của `lunar-typescript` (bản TS của `lunar-javascript`) · `docs/QUY_UOC.md` |
| 1 | Hồ sơ nhiều người + sao lưu file (xin lưu bền `navigator.storage.persist()`, nhắc sao lưu mỗi 30 ngày — iOS có thể xoá dữ liệu web) · âm lịch VN (`@tuquet/lunar`) · can chi, nạp âm, cung mệnh · màn "Hôm nay": giờ hoàng đạo, ngày tốt xấu theo tuổi, hướng thần tài, màu/số hợp ngày · "không rõ giờ sinh" · nơi sinh → múi giờ lịch sử · xong: 73.383 ngày khớp HND |
| 2 | Tử vi: lá số, đại vận, lưu niên/nguyệt/nhật/thời · sao hạn Cửu Diệu + 8 hạn · xong: khớp 3.000 lá số mẫu + ảnh anh gửi |
| 3 | Bát tự: tứ trụ, vượng suy, thập thần, đại vận · đặt tên con theo ngũ hành · xong: khớp `sxtwl` |
| 4 | Kinh Dịch (đồng xu, Mai Hoa) · bói Kiều · xem ngày theo việc (cưới, động thổ, khai trương, xuất hành, mua xe) |
| 5 | Phong thủy: Bát trạch, la bàn (dự phòng nhập số độ), Kim Lâu/Hoang Ốc/Tam Tai, Lỗ Ban, phi tinh năm/tháng · hợp tuổi vợ chồng, làm ăn, sinh con |
| 6 | Chiêm tinh (lá số + theo ngày) · thần số học · tarot bản 1909 · nhịp sinh học |
| 7 | Ảnh + AI trả phí: tướng mặt (đo trong máy), chỉ tay, hỏi đáp, lời tổng hợp mọi môn · khoá API nhập trên từng máy, không bao giờ vào repo, đặt hạn mức chi · ảnh lấy bằng nút chọn/chụp ảnh, không mở camera trực tiếp |
| 8 | Kỳ Môn Độn Giáp (chép `kinqimen`), Huyền Không nhà, xin xăm, cân xương — chỉ khi đủ nguồn |

Tử vi (đợt 2) — đã quyết bằng số đo 14/10, 5 lá số Altuvi: `ansaotuvi` khớp 329/345 sao, `iztro` 235/285 → chép `ansaotuvi`
(~2.100 dòng Python, MIT) sang TypeScript; chỗ lệch (Thiên Giải, Phá Toái, Hỏa/Linh, năm Canh) theo Altuvi — `docs/NGUON_MO.md`.

Quy ước (chốt ở đợt 0): ranh năm Tết hay Lập Xuân từng môn · tuổi mụ · giờ Tý · tháng nhuận · giờ mặt trời thực ·
giờ sinh sát ranh (±15 phút) thì hiện cả hai. Chỗ nào trường phái vênh = một tuỳ chọn có mặc định.

Vịt cao su (Gemini) 14/10 nhận 3 điểm: lộ khoá API, iOS xoá dữ liệu, la bàn/camera ở app màn hình chính → đã chặn ở đợt 1, 5, 7.

Phương án A (đề xuất): như bảng · ~20–28 phiên (ước, chưa đo) · rủi ro: sai lá số do trường phái, phình việc.
Phương án B: chỉ tính lá số tử vi + bát tự, lời giải chép sang Claude/Gemini · ~3 phiên · rủi ro: thiếu gần hết các môn.
  Vì sao chọn A: anh muốn đủ môn, theo từng giờ/ngày. B là đường lùi nếu A sa lầy.

Giả sử A hỏng — ba lý do:
1. Lá số "đúng máy, sai ý anh" (an sao theo phái khác trang anh hay xem) → chuẩn cuối là ảnh lá số anh gửi, không phải thư viện.
2. Phình việc → mỗi đợt có "xong là khi" riêng; đợt 8 chỉ mở khi đủ nguồn.
3. Bản quyền, AI bịa → văn Claude soạn mới, ghi nguồn; AI chỉ đọc số máy đã tính, không tự tính.

Lùi bằng: mỗi đợt gộp `main` một lần, hỏng thì `git revert`. Dữ liệu người dùng không vào repo; app có xuất/nhập file sao lưu.
KHÔNG làm: App Store · đăng nhập, máy chủ · thu phí · giải mộng ra số lô đề · Vệ Đà, Maya.
Đã có: anh gật 14/10 · trang chuẩn altuvi.com, 5 ca mẫu (đủ). Cần anh: không có.
