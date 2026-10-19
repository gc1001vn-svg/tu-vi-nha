# Sinh lá số ansaotuvi 0.1.28 (Python) cho N ngày sinh ngẫu nhiên 1930–2030, đủ 12 giờ (cả Tý), nam nữ, có tháng nhuận,
# để so-tu-vi.ts so với lõi TypeScript src/loi/tuVi/laSo.ts (phái 'ansaotuvi' phải khớp hết; phái 'altuvi' chỉ lệch 4 nhóm sao).
# Chạy: python tu-vi-py.py <ra.json> [số lá = 3000] [hạt = 7]
#   3.000 lá: chay.sh gọi · bảng vàng tests/vang/tu-vi-ansaotuvi.json: python tu-vi-py.py tests/vang/tu-vi-ansaotuvi.json 200 1
import json, random, sys
from ansaotuvi import Sao as S
from ansaotuvi.App import lapDiaBan
from ansaotuvi.AmDuong import diaChi
from ansaotuvi.DiaBan import diaBan
from ansaotuvi.Lich_HND import S2L
from ansaotuvi.ThienBan import lapThienBan

ra = sys.argv[1]
n = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
random.seed(int(sys.argv[3]) if len(sys.argv) > 3 else 7)
CAC_SAO = [v for v in vars(S).values() if isinstance(v, S.Sao)]
CHI = {c["tenChi"]: c["id"] - 1 for c in diaChi[1:]}
la = []
for _ in range(n):
    y, m, d = random.randint(1930, 2030), random.randint(1, 12), random.randint(1, 28)
    h, g = random.randint(0, 11), random.choice([1, -1])
    # Sao là đối tượng dùng chung giữa các lần lập: sao rơi vào cung không ghi độ sáng (Thiên Hình, Thiên Riêu)
    # giữ độ sáng của lá trước — lỗi thư viện, đặt lại trước mỗi lá (lõi TS không chép lỗi này).
    for s in CAC_SAO:
        s.saoDacTinh = None
    db = lapDiaBan(diaBan, d, m, y, h + 1, g, True, 7)
    tb = lapThienBan(d, m, y, h + 1, g, "x", db)
    am = S2L(d, m, y, 7)
    la.append(dict(
        duong=f"{y:04d}-{m:02d}-{d:02d}", vao=[am[0], am[1], am[2], am[3], h, "nam" if g == 1 else "nu"],
        menh=db.cungMenh - 1, than=db.cungThan - 1, cuc=tb.tenCuc, menhChu=tb.menhChu, thanChu=tb.thanChu,
        # Mỗi cung: [tên cung, đại hạn, chi tiểu hạn (0 = Tý), Tuần, Triệt (ansaotuvi chỉ đánh dấu cung đầu), "id+độ sáng"…]
        cung=[[c.cungChu, c.cungDaiHan, CHI[c.cungTieuHan], getattr(c, "tuanTrung", False), getattr(c, "trietLo", False),
               " ".join(f"{s['saoID']}{s['saoDacTinh'] or ''}" for s in c.cungSao)] for c in db.thapNhiCung[1:]]))
nguon = f"ansaotuvi 0.1.28 (MIT), sinh bằng scripts/doi-chieu/tu-vi-py.py {n} lá. Ngày sinh ngẫu nhiên, không phải người thật."
json.dump(dict(nguon=nguon, la=la), open(ra, "w"), ensure_ascii=False, separators=(",", ":"))
print("lá", len(la), "· tháng nhuận", sum(1 for x in la if x["vao"][3]), "· giờ", len({x["vao"][4] for x in la}),
      "· nữ", sum(1 for x in la if x["vao"][5] == "nu"), "· ngày 30", sum(1 for x in la if x["vao"][0] == 30))
