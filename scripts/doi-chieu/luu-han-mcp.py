# Bảng vàng lưu hạn từ `tuvi-mcp-server` 0.5.0 (Python, Apache-2.0, tử vi Việt dựa `ansaotuvi`): tiểu hạn, nguyệt hạn
# (khởi từ tiểu hạn — Thái Thứ Lang), nhật hạn và 7 sao lưu, cho N ca ngẫu nhiên. `tests/LuuHan.test.ts` so lõi TS
# `src/loi/tuVi/luuHan.ts` với file này. Ngày sinh ngẫu nhiên, không phải người thật (luật 1 CLAUDE.md).
# Thư viện nhận ngày âm không nhuận nên ca nào cũng tháng thường; công thức chỉ dùng số tháng sinh nên tháng nhuận như nhau.
# Chạy (chay.sh gọi): python luu-han-mcp.py tests/vang/luu-han-mcp.json [số ca = 200] [hạt = 20]
import json, random, sys
from tuvi_mcp._transit import get_van_han_analysis

ra = sys.argv[1]
n = int(sys.argv[2]) if len(sys.argv) > 2 else 200
random.seed(int(sys.argv[3]) if len(sys.argv) > 3 else 20)
chi = lambda cung: cung["cung_so"] - 1
ca = []
while len(ca) < n:
    y, m, d = random.randint(1930, 2030), random.randint(1, 12), random.randint(1, 28)
    h, g = random.randint(1, 12), random.choice([1, -1])
    Y = random.randint(y, min(y + 90, 2100))
    M, D = random.randint(1, 12), random.randint(1, 29)
    r = get_van_han_analysis("x", d, m, y, h, g, False, Y, M, D)
    if "error" in r:
        continue
    ca.append(dict(
        vao=[d, m, y, h - 1, "nam" if g == 1 else "nu"], xem=[D, M, Y],
        tieuHan=chi(r["tieu_han"]), thang=chi(r["nguyet_han"]), ngay=chi(r["nhat_han"]),
        sao={s["name"]: s["cung_so"] - 1 for s in r["transit_stars"]},
    ))
nguon = "tuvi-mcp-server 0.5.0 (Apache-2.0) get_van_han_analysis, sinh bằng scripts/doi-chieu/luu-han-mcp.py; chi 0 = Tý; ngày xem là ngày âm thường"
json.dump(dict(nguon=nguon, ca=ca), open(ra, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(ca)} ca -> {ra}")
