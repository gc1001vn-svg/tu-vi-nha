# Sinh bo ca kiem vang lich am (dot 1): mung 1 cua moi thang am, thuat toan Ho Ngoc Duc mui +7 (ansaotuvi.Lich_HND).
# Ghi tests/vang/am-lich-hnd.json roi doc lai, suy ngay am tung ngay 01/02/1900-31/12/2100 va so voi S2L(..., 7).
# Chay: bash scripts/doi-chieu/chay.sh (buoc cuoi), hoac <python co ansaotuvi==0.1.28> scripts/doi-chieu/sinh_vang_am_lich.py
import bisect, datetime, json, pathlib, sys
from importlib.metadata import version
from ansaotuvi.Lich_HND import S2L

MUI = 7
# Nam 1900: S2L ra nhuan thang 7, dung la nhuan thang 8 — thang bat dau 24/09/1900 khong co trung khi (goc Mat
# Troi dau thang va dau thang sau cung cung 6, getSunLongitude cua @tuquet/lunar mui +7); @tuquet/lunar va
# lunar-typescript cung ra nhuan 8. Sua tay hai dau thang; 59 ngay 25/08–22/10/1900 vi vay khac S2L.
SUA = {"1900-08-25": [1900, 8, 0], "1900-09-24": [1900, 8, 1]}
SUA_TU, SUA_DEN = datetime.date(1900, 8, 25), datetime.date(1900, 10, 22)
RA = pathlib.Path(__file__).resolve().parents[2] / "tests/vang/am-lich-hnd.json"
MOT = datetime.timedelta(days=1)


def cac_ngay(a, b):
    while a <= b:
        yield a
        a += MOT


# Du cac nam am 1900-2100, them Tet 2101 lam moc cuoi de biet do dai thang chot.
thang, ngay0 = [], []
for t in cac_ngay(datetime.date(1900, 1, 1), datetime.date(2101, 3, 1)):
    d, m, y, nhuan = S2L(t.day, t.month, t.year, MUI)
    if d == 0:
        ngay0.append(t.isoformat())
    if d == 1 and y >= 1900:
        thang.append([t.isoformat(), y, m, nhuan])
        if y == 2101:
            break
thang = [[x[0], *SUA[x[0]]] if x[0] in SUA else x for x in thang]
nguon = (f"ansaotuvi {version('ansaotuvi')}, Lich_HND (thuat toan Ho Ngoc Duc), mui gio +{MUI}. "
         "Moi phan tu: [ngay duong mung 1, nam am, thang am, nhuan 0/1]; du nam am 1900-2100, phan tu cuoi la Tet 2101 "
         f"(chi de biet do dai thang truoc). S2L tra ngay am 0 o {', '.join(ngay0)} (ma HND goc chon nham lan trang moi): "
         "bang tinh la ngay cuoi thang truoc. Nam 1900 sua tay (SUA trong may sinh): ansaotuvi 0.1.28 S2L ra nhuan thang 7, "
         "dung la nhuan thang 8 — thang bat dau 24/09/1900 khong co trung khi (goc Mat Troi dau thang va dau thang sau "
         "cung cung 6, getSunLongitude cua @tuquet/lunar mui +7); @tuquet/lunar va lunar-typescript cung ra nhuan 8. Sinh lai: bash scripts/doi-chieu/chay.sh")
RA.parent.mkdir(exist_ok=True)
RA.write_text('{"nguon": ' + json.dumps(nguon) + ',\n"thang": [\n'
              + ",\n".join(json.dumps(x, separators=(",", ":")) for x in thang) + "\n]}\n")

bang = json.loads(RA.read_text())["thang"]
mung1 = [datetime.date.fromisoformat(x[0]) for x in bang]
tong, lech = 0, []
for t in cac_ngay(datetime.date(1900, 2, 1), datetime.date(2100, 12, 31)):
    i = bisect.bisect_right(mung1, t) - 1
    _, y, m, nhuan = bang[i]
    tu_bang, goc = [(t - mung1[i]).days + 1, m, y, nhuan], S2L(t.day, t.month, t.year, MUI)
    tong += 1
    if tu_bang != goc:
        lech.append((t, tu_bang, goc))
print(f"Vàng lịch âm: {len(bang)} đầu tháng {bang[0][0]} → {bang[-1][0]}, {RA.stat().st_size} byte · "
      f"Tết 1985/2007/2026: {', '.join(x[0] for x in bang if x[1] in (1985, 2007, 2026) and x[2:] == [1, 0])} · "
      f"suy lại từng ngày 01/02/1900–31/12/2100 so với S2L(.., {MUI}): khớp {tong - len(lech)}/{tong}"
      + (" · lệch (bảng / S2L): " + "; ".join(f"{t} {a} / {b}" for t, a, b in lech) if lech else ""))
# Chi chap nhan lech o ngay S2L tra ngay am 0 va 59 ngay nam 1900 sua tay (ghi trong "nguon"); lech khac la bang sai.
sys.exit(any(goc[0] != 0 and not SUA_TU <= t <= SUA_DEN for t, _, goc in lech))
