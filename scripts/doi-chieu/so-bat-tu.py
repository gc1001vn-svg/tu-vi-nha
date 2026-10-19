# Bat tu (4 tru) theo sxtwl 2.0.7 (lich TQ, ma C++ doc lap voi lunar-typescript) cho thoi diem ngau nhien 1900-2100,
# gio VN (+7), quy uoc cua app: QUY_UOC muc 1, 2 (nam, thang theo tiet dung thoi khac), muc 4 (phai A).
# sxtwl lay nam theo NGAY Lap Xuan, thang theo NGAY tiet (ngay lich +8), nen nam, thang mong doi lay theo thoi khac
# tiet cua chinh sxtwl (getJieQiByYear): tiet gan nhat truoc luc sinh, doc can chi o ngay thu 2 sau tiet do (giua thang).
# Ca "tiet" = ngay sinh (+8) co giao tiet, hoac bang ngay cua sxtwl khac thoi khac tiet cua no (1917-12-07: Dai Tuyet
# 00:00:59 ngay 08/12 ma getMonthGZ() da sang thang tu 07/12) — ca do khong so voi bang ngay.
# Ghi <ra.json> (moi ca + moi thoi khac 12 tiet 1900-2100, cho so-bat-tu.mjs) va tests/vang/bat-tu-sxtwl.json (300 ca).
# Chay (thu muc tam <T>, khong cai vao repo):
#   python3 -m venv <T>/py && <T>/py/bin/pip install sxtwl==2.0.7
#   <T>/py/bin/python -I scripts/doi-chieu/so-bat-tu.py <T>/bat-tu.json
#   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-bat-tu.mjs <T>/bat-tu.json
import bisect
import datetime as dt
import json
import pathlib
import random
import sys
from importlib.metadata import version

import sxtwl

CAN, CHI = "甲乙丙丁戊己庚辛壬癸", "子丑寅卯辰巳午未申酉戌亥"
MOT_GIO, MOT_NGAY = dt.timedelta(hours=1), dt.timedelta(days=1)
DAU, CUOI = dt.date(1900, 2, 1), dt.date(2100, 12, 31)
VANG = pathlib.Path(__file__).resolve().parents[2] / "tests/vang/bat-tu-sxtwl.json"


def gz(g):
    return CAN[g.tg] + CHI[g.dz]


def ngay_sx(d):
    return sxtwl.fromSolar(d.year, d.month, d.day)


def gio_bk(jd):
    """Thoi khac (gio Bac Kinh) cua mot so JD sxtwl tra ra — JD tinh theo dong ho +8."""
    t = sxtwl.JD2DD(jd)
    return dt.datetime(int(t.Y), int(t.M), int(t.D), int(t.h), int(t.m)) + dt.timedelta(seconds=t.s)


def bon_tru(vn):
    """[nam, thang, ngay, gio, loai, nam theo ngay, thang theo ngay] cho thoi diem `vn` (gio +7)."""
    bk = vn + MOT_GIO
    d = ngay_sx(bk.date())
    nam_ngay, thang_ngay = gz(d.getYearGZ()), gz(d.getMonthGZ())
    giua = ngay_sx(TIET_BK[bisect.bisect_right(TIET_BK, bk) - 1].date() + 2 * MOT_NGAY)
    nam, thang = gz(giua.getYearGZ()), gz(giua.getMonthGZ())
    # 12 tiet (jie) co chi so le: Tieu Han 1, Lap Xuan 3, ..., Dai Tuyet 23
    ngay_tiet = d.hasJieQi() and d.getJieQi() % 2 == 1
    loai = "tiet" if ngay_tiet or (nam, thang) != (nam_ngay, thang_ngay) else "thuong"
    # Phai A: tu 23:00 la ngay hom sau; getHourGZ(23) mac dinh (isZaoWanZiShi) lay can Ty cua ngay sau — dung phai A.
    ngay_a = vn.date() + (MOT_NGAY if vn.hour == 23 else dt.timedelta())
    ngay = gz(ngay_sx(ngay_a).getDayGZ())
    gio = gz(ngay_sx(vn.date()).getHourGZ(vn.hour))
    return [nam, thang, ngay, gio, loai, nam_ngay, thang_ngay]


# Thoi khac 12 tiet theo sxtwl, gio +8 (getJieQiByYear(n): tu Lap Xuan nam n toi Lap Xuan nam n+1).
TIET_BK = sorted({gio_bk(x.jd) for n in range(1899, 2102) for x in sxtwl.getJieQiByYear(n) if x.jqIndex % 2 == 1})
tiet = [(t - MOT_GIO).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] for t in TIET_BK if DAU <= (t - MOT_GIO).date() <= CUOI]

random.seed(20261019)
ca = []
for i in range(2400):  # gio = i % 24: du 24 gio, moi gio 100 ca
    ngay = DAU + dt.timedelta(days=random.randrange((CUOI - DAU).days + 1))
    ca.append(dt.datetime.combine(ngay, dt.time(i % 24, random.randrange(60))))
sat = []
for i in range(300):  # sat thoi khac tiet: lech 3-120 phut truoc/sau (xa hon sai so lich giua hai thu vien)
    goc = dt.datetime.strptime(random.choice(tiet)[:16], "%Y-%m-%d %H:%M")
    t = goc + dt.timedelta(minutes=random.choice([-1, 1]) * random.randint(3, 120))
    if DAU <= t.date() <= CUOI:
        sat.append(t)

ra = [[t.strftime("%Y-%m-%d %H:%M"), *bon_tru(t)] for t in ca + sat]
pathlib.Path(sys.argv[1]).write_text(json.dumps({"ca": ra, "tiet": tiet}, ensure_ascii=False))

vang = [x[:6] for x in ra[:260] + ra[len(ca):len(ca) + 40]]
VANG.write_text('{"nguon": ' + json.dumps(
    f"sxtwl {version('sxtwl')} (Python), scripts/doi-chieu/so-bat-tu.py: [thoi diem gio VN +7, tru nam, thang, ngay, "
    "gio, loai]. Phai A (tu 23:00 tinh ngay sau). loai 'tiet' = ngay +8 co giao tiet: nam, thang lay theo thoi khac "
    "tiet cua sxtwl (sxtwl tu tinh theo ca ngay). 260 ca dau ngau nhien (du 24 gio), 40 ca sau sat tiet 3-120 phut.")
    + ',\n"ca": [\n' + ",\n".join(json.dumps(x, ensure_ascii=False) for x in vang) + "\n]}\n")
dem = {"thuong": 0, "tiet": 0}
for x in ra:
    dem[x[5]] += 1
tu_lech = [x[0] for x in ra if x[5] == "tiet" and not ngay_sx((dt.datetime.strptime(x[0], "%Y-%m-%d %H:%M") + MOT_GIO).date()).hasJieQi()]
print(f"sxtwl {version('sxtwl')}: {len(ra)} ca ({len(ca)} ngau nhien + {len(sat)} sat tiet), {len(tiet)} thoi khac tiet; "
      f"loai: {dem} (tiet ma ngay +8 khong co tiet — bang ngay sxtwl khac thoi khac cua no: {tu_lech}); "
      f"ghi {VANG.name} {len(vang)} ca, {VANG.stat().st_size} byte")
