# Sinh ca kiểm từ ansaotuvi (tử vi VN) + âm lịch HND múi +7/+8 để so với thư viện JS.
import json, random, sys, datetime
from ansaotuvi.App import lapDiaBan
from ansaotuvi.DiaBan import diaBan
from ansaotuvi.AmDuong import diaChi
from ansaotuvi.Lich_HND import S2L
out = sys.argv[1]
random.seed(42)
cases = []
for i in range(3000):
    y, m, d = random.randint(1930, 2030), random.randint(1, 12), random.randint(1, 28)
    h = random.randint(1, 11)          # Sửu..Hợi, tránh giờ Tý (hai cách tính)
    g = random.choice([1, -1])
    db = lapDiaBan(diaBan, d, m, y, h + 1, g, True, 7)
    stars = {}
    for c in db.thapNhiCung[1:]:
        for s in c.cungSao:
            stars.setdefault(s["saoTen"].lower(), diaChi[c.cungSo]["tenChi"])
    lun = S2L(d, m, y, 7)
    cases.append(dict(y=y, m=m, d=d, h=h, g=g, lunar=lun, stars=stars,
                      menh=diaChi[db.cungMenh]["tenChi"], than=diaChi[db.cungThan]["tenChi"]))
days = []
t = datetime.date(1900, 2, 1)
while t <= datetime.date(2100, 12, 31):
    days.append([t.year, t.month, t.day, S2L(t.day, t.month, t.year, 7), S2L(t.day, t.month, t.year, 8)])
    t += datetime.timedelta(days=1)
json.dump(dict(cases=cases, days=days), open(out, "w"), ensure_ascii=False)
print("ca", len(cases), "ngay", len(days), "vi du sao:", list(cases[0]["stars"].items())[:5])
