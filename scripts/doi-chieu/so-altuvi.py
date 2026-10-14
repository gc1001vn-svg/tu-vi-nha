# In lá số ansaotuvi cho các ca trong mau-altuvi.json (để so.mjs so tiếp với iztro).
import json, sys
from ansaotuvi.App import lapDiaBan
from ansaotuvi.DiaBan import diaBan
from ansaotuvi.AmDuong import diaChi
from ansaotuvi.Lich_HND import S2L
mau = json.load(open(sys.argv[1]))
out = []
for c in mau["ca"]:
    y, m, d = map(int, c["duong"].split("-"))
    db = lapDiaBan(diaBan, d, m, y, c["gioIztro"] + 1, 1 if c["gioi"] == "nam" else -1, True, 7)
    sao = {}
    for cung in db.thapNhiCung[1:]:
        for s in cung.cungSao:
            sao.setdefault(s["saoTen"].lower(), diaChi[cung.cungSo]["tenChi"])
    out.append(dict(ten=c["ten"], lunar=S2L(d, m, y, 7), menh=diaChi[db.cungMenh]["tenChi"], than=diaChi[db.cungThan]["tenChi"], sao=sao))
print(json.dumps(out, ensure_ascii=False))
