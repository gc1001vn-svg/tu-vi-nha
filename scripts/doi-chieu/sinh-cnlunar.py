# Nen/kieng (宜/忌) cua 7 viec theo cnlunar 0.2.5 (MIT, Python, bang quy tac rieng, KHONG dung lunar-*) cho moi ngay duong
# 2024-01-01 -> 2029-06-30 (2.008 ngay), de so voi lunar-typescript (thu vien app dung): so-cnlunar.mjs.
# Cach cnlunar tinh (doc ma lunar.py 0.2.5):
#   - gio: chi dung gio de chia ngay (>= 23h tinh sang ngay sau); ta dua 12:00 nen ngay = ngay lich, khong lech.
#   - thang: mac dinh godType='8char' = thang TIET (can chi thang theo bang tiet khi cua cnlunar, chi tinh den NGAY, khong den gio:
#     ngay giao tiet da thuoc thang moi); godType='cnlunar' = thang AM (so thang am +2 -> chi; thang nhuan dung so thang goc).
#     Rieng buoc "dang cap nen/kieng" (getTodayThingLevel) luon dung chi thang TIET du godType nao.
#   - ket qua cuoi (goodThing/badThing) da qua dang cap nen/kieng; 诸事不宜 trong badThing = moi viec deu kieng; 诸事不忌 = khong kieng.
# Anh xa ten (cnlunar khong co 动土 va 交易/立券 rieng):
#   嫁娶=嫁娶, 纳采=纳采, 动土=修造 (cnlunar chi co 修造; 破土 cua no la dao dat chon cat, giu them de doi chieu), 开市=开市,
#   出行=出行, 交易=立券交易 (cnlunar gop 立券+交易), 纳财=纳财. Giu them 破土, 结婚姻 (cnlunar tach rieng khoi 嫁娶) lam hang phu.
# Chay voi `python -I` nhu moi file doi chieu (khong nap ma la tu thu muc dang dung).
# Chay (thu muc tam <T>, khong cai vao repo; bash scripts/doi-chieu/chay.sh lam san viec nay):
#   python3 -m venv <T>/venv && <T>/venv/bin/pip install cnlunar==0.2.5
#   <T>/venv/bin/python -I scripts/doi-chieu/sinh-cnlunar.py <T>/cnlunar.json
#   node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/doi-chieu/so-cnlunar.mjs <T>/cnlunar.json
# Do 21/10/2026: 2.008 ngay x 2 cach mat 0,8 giay. Ket qua so voi lunar-typescript: dau so-cnlunar.mjs.
import datetime as dt
import json
import sys
from importlib.metadata import version

import cnlunar

# Chu cnlunar giu lai; 诸事不宜 (moi viec kieng) giu trong 忌 de so-cnlunar.mjs xu ly.
GIU = ("嫁娶", "纳采", "修造", "破土", "结婚姻", "开市", "出行", "立券交易", "纳财")
TAT_CA_KIENG = "诸事不宜"
DAU, CUOI = dt.date(2024, 1, 1), dt.date(2029, 6, 30)


def mot_ngay(d, god_type):
    a = cnlunar.Lunar(dt.datetime(d.year, d.month, d.day, 12, 0), godType=god_type)
    yi = [t for t in a.goodThing if t in GIU]
    ji = [t for t in a.badThing if t in GIU or t == TAT_CA_KIENG]
    return a, yi, ji


def main(ra):
    ngay = []
    d = DAU
    while d <= CUOI:
        a, yi_t, ji_t = mot_ngay(d, "8char")
        _, yi_a, ji_a = mot_ngay(d, "cnlunar")
        # [ngay, can chi ngay, chi thang tiet, so thang am cua cnlunar (de doi voi app), [宜, 忌 thang tiet], [宜, 忌 thang am]]
        ngay.append([d.isoformat(), a.day8Char, a.month8Char[1], a.lunarMonth, [yi_t, ji_t], [yi_a, ji_a]])
        d += dt.timedelta(days=1)
    assert len(ngay) == (CUOI - DAU).days + 1
    with open(ra, "w", encoding="utf-8") as f:
        json.dump({"phienBan": version("cnlunar"), "giu": GIU, "ngay": ngay}, f, ensure_ascii=False)
    print(f"cnlunar {version('cnlunar')}: {len(ngay)} ngay -> {ra}")


if __name__ == "__main__":
    main(sys.argv[1])
